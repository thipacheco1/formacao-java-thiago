# 353 - M13.43 - Revisao tecnica JDBC JPA Hibernate Spring Data

## Apresentacao da aula

Você concluiu a construção do projeto integrado de persistência de Ordem de Serviço.

Ao longo do M13, o caminho foi propositalmente progressivo:

```text
SQL e JDBC;

DataSource e pool;

transações manuais;

DAO;

Repository Pattern;

Flyway;

JPA;

Hibernate;

Spring Data JPA;

transações declarativas;

Testcontainers;

projeto completo.
```

A intenção nunca foi apenas decorar annotations ou métodos.

O objetivo foi entender:

```text
qual problema cada camada resolve;

qual responsabilidade permanece com o desenvolvedor;

como diagnosticar falhas;

como escolher uma abstração sem perder controle.
```

Nesta aula, você fará uma revisão técnica estruturada.

Ela não repetirá cada aula em ordem cronológica.

A revisão será organizada por decisões profissionais:

1. como a aplicação se conecta ao banco;
2. quem controla a transação;
3. como objetos viram registros;
4. como o persistence context funciona;
5. como relacionamentos são carregados;
6. como consultas são construídas;
7. como concorrência é protegida;
8. como autoria e histórico são registrados;
9. como o schema evolui;
10. como a integração é testada;
11. como avaliar a qualidade do projeto final.

A pergunta central será:

```text
se eu receber um problema de persistência,
consigo identificar a camada correta,
explicar o comportamento e implementar
uma solução verificável?
```

A revisão abordará:

- JDBC;
- `DriverManager`;
- `DataSource`;
- HikariCP;
- `Connection`;
- `PreparedStatement`;
- `ResultSet`;
- commit e rollback;
- DAO;
- Repository Pattern;
- migrations;
- JPA;
- Hibernate;
- `EntityManager`;
- lifecycle;
- persistence context;
- identidade;
- dirty checking;
- flush;
- relacionamentos;
- cascade;
- orphan removal;
- fetch;
- proxy;
- N+1;
- JPQL;
- Criteria API;
- projections;
- paginação;
- optimistic e pessimistic locking;
- auditoria;
- Spring Data repositories;
- queries derivadas;
- `@Query`;
- SQL nativo;
- `@Modifying`;
- `@Transactional`;
- propagação;
- Testcontainers;
- projeto final de OS.

A stack permanece como referência:

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

A aula usará o projeto concluído nas aulas 351 e 352 como material principal de inspeção:

```text
labs/m13/aula-351-projeto-persistencia-os-parte-1
```

Você não reconstruirá o projeto.

Você o revisará com critérios técnicos.

Será criado um laboratório leve de revisão:

```text
labs/m13/aula-353-revisao-tecnica-persistencia
```

Ele conterá:

- mapas de decisão;
- perguntas diagnósticas;
- cartões de cenários;
- checklist de inspeção;
- scripts para executar a suíte final;
- exercícios de correção;
- simulação orientada da prova.

A próxima aula será:

```text
354 - M13.44 - Prova pratica persistencia
```

Por isso, esta aula não entregará a resposta da prova.

Ela treinará o método de raciocínio necessário para realizá-la.

---

## Onde estamos na formacao

O fechamento do M13 está organizado assim:

```text
351:
Projeto persistencia OS parte 1.

352:
Projeto persistencia OS parte 2.

353:
Revisao tecnica JDBC JPA Hibernate Spring Data.

354:
Prova pratica persistencia.

355:
Fechamento do Modulo 13 persistencia Java.
```

As aulas 351 e 352 provaram que você consegue integrar:

```text
migrations;

mappings;

repositories;

transações;

auditoria;

concorrência;

queries;

testes reais.
```

A aula 353 precisa transformar essa experiência em conhecimento recuperável.

O resultado esperado é que você consiga:

- explicar sem consultar código;
- identificar sintomas;
- localizar a camada responsável;
- escolher uma solução;
- prever o SQL;
- desenhar um teste;
- reconhecer uma decisão perigosa.

Nesta aula:

```text
conteúdo novo:
não.

reorganização técnica:
sim.

diagnóstico:
sim.

revisão do projeto:
sim.

simulação guiada:
sim.

prova oficial:
não.

gabarito da prova:
não.
```

A revisão será dividida em cinco eixos:

```text
Eixo 1:
conexão, SQL e transação.

Eixo 2:
JPA, Hibernate e lifecycle.

Eixo 3:
queries, performance e concorrência.

Eixo 4:
Spring Data, migrations e testes.

Eixo 5:
arquitetura do projeto final.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-353-revisao-tecnica-persistencia
```

Estrutura:

```text
labs
└── m13
    └── aula-353-revisao-tecnica-persistencia
        ├── README.md
        ├── docs
        │   ├── mapa-abstracoes.md
        │   ├── mapa-lifecycle-jpa.md
        │   ├── mapa-transacoes.md
        │   ├── mapa-consultas.md
        │   ├── mapa-concorrencia.md
        │   ├── mapa-migrations-testes.md
        │   ├── checklist-projeto-final.md
        │   └── plano-prova-pratica.md
        ├── exercises
        │   ├── 01-escolha-da-abstracao.md
        │   ├── 02-diagnostico-lifecycle.md
        │   ├── 03-diagnostico-fetch-nmaisum.md
        │   ├── 04-diagnostico-transacao.md
        │   ├── 05-diagnostico-concorrencia.md
        │   ├── 06-diagnostico-migration.md
        │   ├── 07-revisao-projeto-os.md
        │   └── 08-simulacao-orientada.md
        ├── scripts
        │   ├── 01_validar_ambiente.ps1
        │   ├── 02_executar_projeto_final.ps1
        │   ├── 03_executar_teste_especifico.ps1
        │   └── 04_gerar_relatorio_revisao.ps1
        └── templates
            ├── resposta-diagnostico.md
            ├── decisao-arquitetural.md
            └── checklist-entrega.md
```

O laboratório não terá novo código de produção.

Ele trabalhará sobre:

```text
o projeto final;

os arquivos das aulas anteriores;

testes existentes;

SQL gerado;

migrations existentes.
```

Ao terminar, você deverá conseguir responder corretamente a perguntas como:

```text
quando usar JDBC direto?

qual a diferença entre JPA e Hibernate?

quando save chama persist ou merge?

por que managed não precisa de save?

por que join não é join fetch?

como detectar N+1?

quando usar projection?

por que flush não é commit?

por que bulk ignora callbacks?

como @Version evita lost update?

por que REQUIRES_NEW consome outra conexão?

por que Flyway vem antes do Hibernate?

por que repository test precisa de PostgreSQL real?
```

---

## Conceito essencial

### Camada 1 — JDBC

JDBC é a API de baixo nível para comunicação com banco relacional.

Objetos fundamentais:

```text
DataSource;

Connection;

PreparedStatement;

ResultSet.
```

O JDBC deixa explícitos:

- SQL;
- parâmetros;
- transação;
- leitura de colunas;
- tratamento de recursos;
- quantidade de round-trips.

Use JDBC direto quando:

- o SQL é central;
- o fluxo é simples;
- o mapeamento é pequeno;
- o desempenho exige controle;
- há batch específico;
- a abstração ORM não ajuda.

JDBC não oferece automaticamente:

- identidade de objetos;
- dirty checking;
- relacionamentos;
- cascade;
- lifecycle de entidades.

---

### DriverManager versus DataSource

`DriverManager` abre conexão diretamente por URL.

`DataSource` abstrai a origem das conexões.

Em aplicação profissional:

```text
DataSource
    -> pool
        -> Connection.
```

HikariCP mantém conexões reutilizáveis.

O pool não substitui transação.

Ele administra recursos físicos.

Uma conexão devolvida sem commit ou rollback correto pode contaminar o fluxo.

---

### PreparedStatement

Use parâmetros:

```java
select *
from ordem_servico
where codigo = ?
```

Benefícios:

- separação entre SQL e dado;
- redução de risco de injection;
- conversão de tipos;
- plano reutilizável conforme banco.

Não concatene entrada do usuário no SQL.

---

### Transacao JDBC

Fluxo básico:

```java
connection.setAutoCommit(false);

try {
    executarOperacoes();
    connection.commit();
} catch (Exception exception) {
    connection.rollback();
    throw exception;
}
```

O rollback precisa ocorrer na mesma conexão.

Um DAO que abre outra conexão não participa automaticamente da transação atual.

---

### DAO e Repository

DAO normalmente representa acesso orientado à persistência:

```text
insert;

update;

delete;

select.
```

Repository representa uma coleção de objetos de domínio e pode usar linguagem do negócio.

Não existe proibição de usar os termos de forma diferente, mas a equipe precisa manter consistência.

O erro comum é criar uma interface chamada repository que apenas espelha cada método SQL sem expressar intenção.

---

### Flyway

Flyway controla o estado do schema por migrations.

Responsabilidade:

```text
criar;

evoluir;

validar;

registrar histórico.
```

Hibernate deve usar:

```text
validate.
```

Nunca permita dois donos concorrentes do DDL:

```text
Flyway migrate;

Hibernate update.
```

---

### JPA versus Hibernate

JPA é a especificação.

Ela define contratos como:

```text
@Entity;

@EntityManager;

@Version;

JPQL;

lifecycle.
```

Hibernate é um provider que implementa JPA e adiciona recursos próprios.

O código deve preferir APIs Jakarta quando não precisa de uma extensão Hibernate.

---

### EntityManagerFactory e EntityManager

`EntityManagerFactory` é pesado e compartilhado.

`EntityManager` representa um persistence context e não deve ser compartilhado livremente entre threads.

Em Spring:

```text
transaction manager
    -> EntityManager associado à transação.
```

---

### Estados da entidade

Os estados centrais são:

```text
NEW;

MANAGED;

DETACHED;

REMOVED.
```

NEW:

- ainda não persistida;
- não está no persistence context.

MANAGED:

- rastreada;
- dirty checking ativo.

DETACHED:

- possui identidade;
- não é rastreada pelo contexto atual.

REMOVED:

- marcada para exclusão.

A mesma classe Java pode aparecer em estados diferentes durante o fluxo.

---

### Persist

`persist` torna a entidade nova managed.

A instância original passa a ser rastreada.

É operação para entidade nova.

Não use `persist` em entidade existente detached.

---

### Merge

`merge` copia o estado para uma instância managed.

Regra central:

```java
Entity managed =
        entityManager.merge(
                detached
        );
```

O retorno deve ser usado.

O argumento não se torna managed por contrato.

Spring Data `save` pode escolher merge quando entende que a entidade não é nova.

---

### Find

`find` busca por ID e devolve managed dentro do contexto atual.

Duas chamadas para o mesmo tipo e ID no mesmo persistence context devem respeitar identidade:

```text
mesma representação gerenciada.
```

Isso é o first-level cache.

---

### Dirty checking

Uma entidade managed alterada é comparada com seu snapshot.

No flush, Hibernate produz `UPDATE` se detecta mudança.

Por isso:

```java
ordem.alterarStatus(...);
```

dentro de transação não exige `save` adicional.

O commit dispara flush automaticamente em condições normais.

---

### Flush, commit, clear, detach e refresh

`flush`:

```text
sincroniza SQL;
não confirma transação.
```

`commit`:

```text
confirma transação.
```

`clear`:

```text
desanexa todas as entidades.
```

`detach`:

```text
desanexa uma entidade.
```

`refresh`:

```text
recarrega estado do banco;
descarta mudanças locais não enviadas.
```

Escolher o método errado pode causar perda de estado ou leitura obsoleta.

---

### Relacionamentos

`ManyToOne` normalmente representa a foreign key proprietária.

`OneToMany(mappedBy=...)` é o lado inverso.

A associação bidirecional precisa de helpers para manter os dois lados coerentes em memória.

Exemplo:

```text
ordem.adicionarAtividade
    -> atividade.vincularA(ordem)
    -> lista recebe atividade.
```

---

### Cascade

Cascade propaga operações de lifecycle.

Não significa cascade no banco.

Use quando a entidade filha pertence à responsabilidade do agregado.

No projeto final:

```text
Ordem -> Atividade:
cascade controlado.

Ordem -> Cliente:
sem cascade.

Ordem -> Produto:
sem cascade.

Atividade -> Técnico:
sem cascade.
```

---

### Orphan removal

`orphanRemoval = true` remove a entidade filha quando ela deixa a coleção proprietária, desde que o mapping e a transação permitam.

Não use para associações compartilhadas.

---

### Fetch LAZY e EAGER

LAZY adia carregamento.

EAGER exige que o provider entregue a associação carregada, mas não garante um único SQL.

EAGER não é solução automática para `LazyInitializationException` nem N+1.

A regra profissional é:

```text
mapping com padrão seguro;

consulta define o fetch necessário.
```

---

### Proxy

Hibernate pode representar uma associação lazy por proxy.

Acesso a atributo não identificado pode inicializar a entidade.

Debugger, `toString`, serializer e logger podem disparar carregamento sem intenção.

Não inclua associações lazy indiscriminadamente em `toString`.

---

### N mais um

Padrão:

```text
1 query para lista principal;

N queries para associações acessadas.
```

Detecção:

- logs;
- statement inspector;
- statistics;
- query budget;
- teste de integração.

Soluções:

- join fetch;
- entity graph;
- batch fetching;
- projection;
- consulta específica.

A solução depende do caso de uso.

---

### JPQL

JPQL usa:

```text
entidades;

atributos;

associações.
```

Ela não usa diretamente nomes de tabela e coluna.

`join fetch` muda o plano de carregamento da consulta.

Uma query de detalhe pode buscar agregado.

Uma query paginada não deve fazer fetch de coleção sem análise, porque linhas duplicadas afetam a página.

---

### Criteria API

Criteria API é útil para filtros dinâmicos.

Elementos:

```text
CriteriaBuilder;

CriteriaQuery;

Root;

Predicate;

Join.
```

Não use Criteria apenas para substituir uma JPQL curta por código mais longo.

Use quando composição dinâmica justifica.

---

### Projection

Projection retorna somente os dados do caso de uso.

Tipos praticados:

```text
DTO;

record;

interface;

Tuple.
```

Projection não é entidade managed.

Ela é especialmente adequada para:

- lista;
- dashboard;
- relatório;
- exportação;
- leitura operacional.

---

### Paginacao

Offset pagination usa:

```text
setFirstResult;

setMaxResults.
```

Com Spring Data:

```text
Pageable;

Page;

Slice.
```

`Page` normalmente exige count.

`Slice` informa continuidade sem total exato.

Ordenação precisa ser determinística.

Use ID como desempate.

---

### Lock otimista

`@Version` inclui a versão no `WHERE` do update.

Formato conceitual:

```sql
update ordem_servico
set status = ?, versao = ?
where id = ?
  and versao = ?
```

Zero linhas atualizadas indica estado obsoleto.

A aplicação deve recarregar e revalidar.

Não faça retry cego em decisão de usuário.

---

### Lock pessimista

Lock pessimista protege a linha durante a transação.

Pode:

- bloquear;
- esperar;
- gerar timeout;
- contribuir para deadlock.

Use quando a disputa precisa ser resolvida antes da alteração e o custo do lock é aceitável.

Mantenha transações curtas e ordem consistente de aquisição.

---

### Auditoria

Auditoria básica:

```text
createdAt;

createdBy;

updatedAt;

updatedBy.
```

Histórico de negócio é diferente.

No projeto:

```text
auditoria:
quem e quando persistiu.

histórico:
qual status mudou.
```

O listener não consulta banco nem chama serviços.

O `AuditScope` precisa permanecer ativo até o flush.

---

### Spring Data Repository

Spring Data cria um proxy para interfaces de repository.

`JpaRepository` fornece operações comuns.

A implementação base usa `EntityManager`.

Spring Data reduz boilerplate, mas não elimina:

- lifecycle;
- transação;
- SQL;
- performance;
- constraints;
- modelagem.

---

### Save

`save` pode usar:

```text
persist:
entidade nova.

merge:
entidade existente.
```

Use o retorno.

Em entidade managed dentro da transação, normalmente não é necessário chamar `save`.

---

### Query derivada

Boa para métodos curtos e claros:

```java
findByCodigo(...)

findByStatusOrderByCreatedAtDescIdDesc(...)
```

Abandone quando o nome fica ambíguo, longo ou exige agrupamento complexo.

---

### @Query e native query

`@Query` JPQL usa o modelo Java.

Native query usa o modelo físico.

Use SQL nativo quando há benefício real:

- função específica;
- CTE;
- view;
- recurso PostgreSQL;
- consulta física otimizada.

A perda de portabilidade precisa ser aceita conscientemente.

---

### @Modifying

Bulk update e delete precisam de:

```text
@Modifying;

transação;

row count;

auditoria explícita;

versão explícita;

clear do contexto.
```

Bulk não executa callbacks por entidade.

---

### @Transactional

A fronteira deve ficar no service do caso de uso.

`REQUIRED` cria ou participa.

`REQUIRES_NEW` abre transação independente e usa outra conexão.

`MANDATORY` exige transação existente.

Runtime exception provoca rollback por padrão.

Checked exception não provoca por padrão.

Self-invocation não atravessa o proxy.

---

### Testcontainers

Repository test é integração.

Testcontainers permite executar PostgreSQL real com:

- imagem fixada;
- porta dinâmica;
- lifecycle descartável;
- configuração reproduzível.

Flyway precisa migrar antes do Hibernate validate.

Mocks continuam úteis para service unitário, não para certificar repository.

---

### Projeto final

O projeto de OS consolidou:

```text
aggregate root;

entidades associativas;

migrations;

transações;

auditoria;

versionamento;

queries;

projections;

views;

testes reais.
```

A qualidade do projeto não é medida pela quantidade de annotations.

Ela é medida por:

- invariantes;
- responsabilidade;
- SQL correto;
- transações claras;
- concorrência protegida;
- testes confiáveis;
- evolução segura.

---

### Metodo profissional de diagnostico

Um problema de persistência deve ser analisado por camadas.

Use a sequência:

```text
sintoma;

evidência;

camada;

hipótese;

experimento;

correção;

teste preventivo.
```

Exemplo:

```text
sintoma:
a tela ficou lenta ao listar Ordens.

evidência:
uma consulta principal e dezenas de SELECTs de Cliente.

camada:
plano de carregamento JPA.

hipótese:
N+1 em associação LAZY acessada durante o mapping.

experimento:
contar statements e executar projection.

correção:
join fetch ou projection específica.

teste preventivo:
query budget em integração.
```

Não comece alterando annotations aleatoriamente.

Primeiro reconstrua:

- qual transação está ativa;
- qual entidade está managed;
- qual associação foi acessada;
- qual SQL foi executado;
- quantas linhas foram afetadas;
- qual constraint participou;
- em que momento a exception surgiu.

---

### Leitura de exceptions

Exceptions de persistência possuem camadas.

Um erro pode aparecer como:

```text
exception Spring;

exception JPA;

exception Hibernate;

exception JDBC;

erro PostgreSQL.
```

Exemplo de unique:

```text
DataIntegrityViolationException
    -> PersistenceException
        -> ConstraintViolationException
            -> SQLException PostgreSQL.
```

Não exponha toda a cadeia para o usuário.

Também não descarte a causa.

A aplicação deve:

1. registrar contexto técnico seguro;
2. identificar a categoria;
3. executar rollback;
4. traduzir para uma mensagem do caso de uso;
5. preservar a causa para diagnóstico.

Categorias importantes:

```text
integridade;

concorrência;

timeout;

conexão;

mapping;

query;

migration;

transação.
```

---

### Observar SQL sem depender de adivinhacao

Uma revisão técnica precisa conseguir prever e confirmar o SQL.

Use:

- `StatementInspector`;
- statistics do Hibernate;
- logs controlados;
- `EXPLAIN`;
- contagem de statements;
- testes de integração.

Para cada caso, responda:

```text
quantos SELECTs?

há INSERT?

há UPDATE?

o WHERE inclui versão?

o ORDER BY é estável?

o count possui os mesmos filtros?

a projection seleciona só o necessário?

o bulk atualiza auditoria?

o persistence context foi limpo?
```

Não compare SQL inteiro quando aliases internos podem variar.

Valide características importantes.

---

### Matriz de escolha da consulta

Use esta decisão:

```text
ID conhecido:
findById.

filtro simples e estável:
query derivada.

consulta explícita sobre entidades:
JPQL.

filtros opcionais dinâmicos:
Criteria ou Specification.

lista e relatório:
projection.

recurso específico PostgreSQL:
native query ou view.

alteração em massa:
@Modifying com contrato explícito.
```

Sinais de que uma query derivada deve ser abandonada:

- nome muito longo;
- mistura difícil de `And` e `Or`;
- subquery;
- agregação;
- fetch;
- função do banco;
- parâmetros opcionais;
- projection complexa.

---

### Matriz de escolha da concorrencia

Use constraint unique quando a disputa é:

```text
duas transações tentando criar
o mesmo valor exclusivo.
```

Use optimistic locking quando:

```text
leituras são comuns;

conflitos são ocasionais;

não é desejável manter lock durante a decisão.
```

Use pessimistic locking quando:

```text
o recurso precisa ficar reservado;

o conflito deve ser evitado antes da escrita;

a transação pode permanecer curta.
```

As estratégias podem coexistir.

Uma Ordem pode ter:

```text
unique no código;

@Version para update;

pessimistic lock em operação crítica específica.
```

---

### Revisao do projeto por evidencias

Ao revisar o projeto final, não marque um item como correto apenas porque encontrou uma annotation.

Exija evidência.

Exemplos:

```text
@Version:
teste com duas transações.

LAZY:
loaded state e SQL.

rollback:
consulta em nova transação.

auditoria:
valores no banco após commit.

migration:
schema history.

unique:
falha real do PostgreSQL.

projection:
colunas e aliases testados.

afterCommit:
não executa em rollback.

bulk:
row count e contexto limpo.
```

Essa disciplina separa uma implementação aparentemente correta de uma implementação comprovada.

---

### Checklist de qualidade antes da prova

Antes de considerar uma solução pronta, confirme:

```text
compila;

migrations aplicam do zero;

Hibernate valida;

testes passam;

fixtures são limpas;

nenhuma transação fica aberta;

nenhuma configuração local foi commitada;

queries possuem ordem determinística;

constraints sustentam invariantes;

service define a transação;

results não expõem entidades;

erros possuem tradução;

README explica execução.
```

A prova prática avaliará o resultado e a capacidade de demonstrar que ele funciona.


## Mao na massa guiada

### 1. Criar o laboratorio de revisao

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-353-revisao-tecnica-persistencia\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-353-revisao-tecnica-persistencia\exercises"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-353-revisao-tecnica-persistencia\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-353-revisao-tecnica-persistencia\templates"
```

---

### 2. Criar mapa de abstracoes

Em `mapa-abstracoes.md`, crie tabela com:

```text
JDBC;

DAO;

JPA;

Hibernate;

Spring Data.
```

Para cada item, registre:

- problema resolvido;
- controle oferecido;
- custo;
- risco;
- cenário adequado;
- cenário inadequado.

---

### 3. Criar mapa de lifecycle

Desenhe:

```text
NEW
    -> persist
        -> MANAGED
            -> detach/clear/close
                -> DETACHED
                    -> merge
                        -> MANAGED

MANAGED
    -> remove
        -> REMOVED
```

Acrescente flush, commit e rollback.

---

### 4. Criar mapa de transacoes

Compare:

```text
JDBC manual;

EntityTransaction;

TransactionTemplate;

@Transactional.
```

Registre onde a fronteira começa, como rollback ocorre e qual recurso participa.

---

### 5. Criar mapa de consultas

Monte matriz:

```text
query derivada;

JPQL;

Criteria;

projection;

native query;

view.
```

Associe cada técnica a um caso do projeto final.

---

### 6. Executar o projeto final

No laboratório da aula 351:

```powershell
mvn clean verify
```

Confirme:

- migrations;
- mappings;
- fluxo completo;
- optimistic lock;
- queries;
- views;
- cleanup.

Registre o resultado em `checklist-projeto-final.md`.

---

### 7. Inspecionar uma transacao

Escolha o método de conclusão da Ordem.

Responda:

1. onde a transação começa;
2. quais repositories participam;
3. quais entidades ficam managed;
4. onde ocorre dirty checking;
5. quando o histórico é criado;
6. quando o flush ocorre;
7. quando afterCommit executa;
8. o que acontece no rollback.

---

### 8. Inspecionar um fetch

Escolha `findDetailedById`.

Liste:

- associações carregadas;
- razão do `distinct`;
- quantidade esperada de SELECTs;
- por que não usar na paginação;
- risco de coleção grande.

---

### 9. Inspecionar uma projection

Escolha a view operacional.

Explique:

- por que não retornar entidade;
- quais joins existem;
- quais agregações existem;
- quais índices ajudam;
- como validar aliases;
- por que ela é read-only.

---

### 10. Diagnosticar N mais um

Crie uma branch temporária.

Remova o fetch de Cliente da consulta detalhada.

Execute o teste de query budget.

Registre:

```text
sintoma;

SQL;

causa;

correção;

teste preventivo.
```

Restaure o código.

---

### 11. Diagnosticar merge

Crie um cenário conceitual:

```text
entidade detached;

alteração local;

repository.save;

retorno ignorado.
```

Explique o erro e reescreva usando o retorno.

Não altere o projeto final.

---

### 12. Diagnosticar rollback-only

Desenhe:

```text
service externo REQUIRED;

service interno REQUIRED falha;

externo captura exception;

commit tentado.
```

Explique `UnexpectedRollbackException`.

---

### 13. Diagnosticar migration

Considere:

```text
V8 aplicada;

arquivo V8 editado;

validate falha.
```

Escreva o procedimento correto.

Não inclua `repair` como primeiro passo.

---

### 14. Diagnosticar concorrencia

Compare:

```text
@Version;

PESSIMISTIC_WRITE;

unique constraint.
```

Para cada um, responda:

- qual disputa resolve;
- quando detecta;
- qual exception ou resultado;
- custo;
- teste necessário.

---

### 15. Simulacao orientada

Use `08-simulacao-orientada.md`.

Problema:

```text
criar cadastro de Agendamento;

ligar a Cliente e Técnico;

permitir atualização concorrente;

listar por período;

auditar;

migrar schema;

testar em PostgreSQL.
```

Não implemente tudo.

Produza:

- modelo;
- migrations;
- entidades;
- repositories;
- service;
- transação;
- queries;
- teste;
- riscos.

---

### 16. Criar plano da prova

Em `plano-prova-pratica.md`, registre a ordem:

```text
1. ler requisitos;

2. listar invariantes;

3. desenhar tabelas;

4. criar migrations;

5. mapear entidades;

6. definir agregado;

7. criar repositories;

8. criar service transacional;

9. implementar consultas;

10. criar testes;

11. executar;

12. revisar SQL;

13. validar estado final;

14. commitar.
```

---

## Entendendo o que foi feito

### A revisao foi organizada por decisoes

Você não dependeu da ordem das aulas para recuperar conhecimento.

### As abstracoes foram comparadas

JDBC, JPA, Hibernate e Spring Data passaram a ocupar papéis claros.

### O projeto final virou evidencia

Cada conceito foi ligado a código, SQL, migration ou teste real.

### O diagnostico recebeu metodo

Sintoma, camada, causa, correção e teste preventivo formaram um padrão.

### A prova ganhou um plano

A execução poderá seguir etapas objetivas em vez de tentativa e erro.

---

## Erros comuns importantes

### Decorar annotation sem entender lifecycle

O comportamento depende do estado da entidade e da transação.

### Culpar Spring Data por SQL ruim

O repository delega ao JPA e ao banco.

### Corrigir N mais um com EAGER global

O fetch precisa ser definido por caso de uso.

### Usar repair antes de investigar checksum

Isso pode esconder divergência histórica.

### Criar código antes de listar invariantes

A modelagem perde direção.

---

## Comandos uteis

### Executar o projeto final

```powershell
Set-Location `
  "labs\m13\aula-351-projeto-persistencia-os-parte-1"

mvn clean verify
```

### Executar teste específico

```powershell
mvn -Dtest=ProjetoOsFullFlowIT test
```

### Inspecionar dependencias

```powershell
mvn dependency:tree
```

### Inspecionar migrations

```powershell
mvn flyway:info
mvn flyway:validate
```

### Verificar Docker

```powershell
docker version
docker info
```

---

## Exercicio guiado

### Parte 1 — Escolha da abstracao

Para cada cenário, escolha JDBC, JPA ou Spring Data e justifique:

1. exportação de milhões de linhas;
2. CRUD de agregado;
3. relatório SQL específico;
4. update bulk controlado;
5. consulta dinâmica com filtros opcionais.

### Parte 2 — Lifecycle

Explique o estado da entidade após:

```text
persist;

commit;

close;

merge;

clear;

remove.
```

### Parte 3 — Transacao

Desenhe uma unidade de trabalho com três repositories e uma falha no segundo.

### Parte 4 — Fetch

Compare:

```text
LAZY;

EAGER;

join fetch;

projection.
```

### Parte 5 — Concorrencia

Escolha entre optimistic, pessimistic e unique para três disputas diferentes.

### Parte 6 — Migration

Desenhe add, backfill e NOT NULL para uma coluna obrigatória.

### Parte 7 — Teste

Escreva o plano de um repository test com Testcontainers.

### Parte 8 — Projeto

Faça uma revisão de 15 minutos no projeto final e liste três melhorias sem alterar escopo.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 352 foi preservada;
- revisão técnica foi entregue;
- conteúdo novo não foi introduzido;
- JDBC foi revisado;
- DriverManager foi diferenciado de DataSource;
- HikariCP foi revisado;
- PreparedStatement foi revisado;
- ResultSet foi revisado;
- transação JDBC foi revisada;
- DAO foi revisado;
- Repository Pattern foi revisado;
- Flyway foi revisado;
- JPA foi diferenciada de Hibernate;
- EntityManagerFactory foi revisado;
- EntityManager foi revisado;
- lifecycle foi revisado;
- NEW foi revisado;
- MANAGED foi revisado;
- DETACHED foi revisado;
- REMOVED foi revisado;
- persist foi revisado;
- merge foi revisado;
- retorno de merge foi destacado;
- find foi revisado;
- identidade do persistence context foi revisada;
- dirty checking foi revisado;
- flush foi diferenciado de commit;
- clear foi revisado;
- detach foi revisado;
- refresh foi revisado;
- ManyToOne foi revisado;
- OneToMany foi revisado;
- helper bidirecional foi revisado;
- cascade foi revisado;
- orphanRemoval foi revisado;
- LAZY foi revisado;
- EAGER foi revisado;
- proxy foi revisado;
- N+1 foi revisado;
- query budget foi lembrado;
- JPQL foi revisada;
- join fetch foi revisado;
- Criteria API foi revisada;
- projections foram revisadas;
- paginação foi revisada;
- Page foi diferenciada de Slice;
- ordenação estável foi revisada;
- lock otimista foi revisado;
- lock pessimista foi revisado;
- unique constraint foi comparada a locks;
- auditoria foi revisada;
- histórico foi diferenciado de auditoria;
- Spring Data Repository foi revisado;
- save foi revisado;
- persist e merge dentro de save foram revisados;
- query derivada foi revisada;
- `@Query` foi revisada;
- native query foi revisada;
- `@Modifying` foi revisada;
- bulk e callbacks foram diferenciados;
- `@Transactional` foi revisada;
- REQUIRED foi revisado;
- REQUIRES_NEW foi revisado;
- MANDATORY foi revisado;
- rollback rules foram revisadas;
- self-invocation foi revisada;
- Testcontainers foi revisado;
- PostgreSQL real foi mantido;
- H2 não foi sugerido como substituto;
- Flyway antes do Hibernate foi revisado;
- migrations imutáveis foram revisadas;
- checksum foi revisado;
- baseline foi revisado;
- repair foi tratado com critério;
- expand-and-contract foi revisado;
- projeto final foi inspecionado;
- agregado da Ordem foi revisado;
- Técnico foi mantido fora do agregado;
- Atividade-Técnico foi revisada;
- Pagamento com BigDecimal foi revisado;
- histórico de status foi revisado;
- views operacionais foram revisadas;
- tests reais foram revisados;
- laboratório de revisão foi definido;
- mapas técnicos foram criados;
- exercícios diagnósticos foram definidos;
- simulação orientada foi criada;
- plano da prova foi criado;
- gabarito da prova não foi antecipado;
- prova oficial não foi executada;
- ponte para a aula 354 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Adicione:

```powershell
git add `
  labs/m13/aula-353-revisao-tecnica-persistencia
```

Commit recomendado:

```powershell
git commit -m "docs(m13): revisar persistencia jdbc jpa hibernate spring data"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você revisou o M13 como um sistema de decisões técnicas.

O mapa completo ficou:

```text
JDBC:
controle direto de SQL e recursos.

DataSource:
origem de conexões.

HikariCP:
pool.

Flyway:
schema.

JPA:
contrato ORM.

Hibernate:
implementação.

EntityManager:
persistence context.

Dirty checking:
update de managed.

Fetch:
carregamento por caso de uso.

JPQL e Criteria:
consultas sobre o modelo.

Projection:
leitura especializada.

Locks:
concorrência.

Auditoria:
autoria e tempo.

Spring Data:
infraestrutura de repositories.

@Transactional:
unidade de trabalho.

Testcontainers:
integração reproduzível.
```

Você também revisou o projeto final por:

- agregado;
- mappings;
- migrations;
- transações;
- queries;
- concorrência;
- auditoria;
- testes;
- estado final.

O método de diagnóstico ficou:

```text
1. observar o sintoma;

2. identificar a camada;

3. reconstruir o lifecycle;

4. prever SQL e transação;

5. localizar a causa;

6. corrigir com menor escopo;

7. criar teste preventivo.
```

A próxima aula será:

```text
354 - M13.44 - Prova pratica persistencia
```

Nela, você receberá um desafio de persistência com critérios objetivos.

A avaliação exigirá:

- modelagem;
- migrations;
- mappings;
- repository;
- transação;
- consulta;
- concorrência;
- auditoria;
- teste real;
- documentação;
- commit.

A aula 353 organizou o conhecimento.

A aula 354 avaliará a capacidade de aplicá-lo sem roteiro de implementação completo.

---

# Material complementar

## Checkpoint final

- [ ] Consigo diferenciar JDBC, JPA, Hibernate e Spring Data.
- [ ] Consigo explicar lifecycle, transação, fetch e concorrência.
- [ ] Consigo escolher entre derivada, JPQL, Criteria, projection e native.
- [ ] Consigo diagnosticar migration, N+1, rollback e optimistic lock.
- [ ] Tenho um plano objetivo para a prova prática.

---

## Troubleshooting adicional

### Nao consigo explicar sem olhar codigo

Use os mapas e responda primeiro com conceitos, depois confirme no projeto.

### Confundo flush com commit

Repita um teste que executa flush e rollback.

### Confundo persist e merge

Desenhe os estados NEW, MANAGED e DETACHED.

### Confundo join e join fetch

Observe loaded state e quantidade de SELECTs.

### Nao sei por onde iniciar a prova

Comece por invariantes, modelo e migrations.

---

## Perguntas de revisao

1. Qual é o papel do JDBC?
2. Qual é o papel do DataSource?
3. O que o pool administra?
4. Qual diferença entre JPA e Hibernate?
5. O que significa managed?
6. Quando dirty checking ocorre?
7. Flush é commit?
8. O que merge retorna?
9. Quando usar cascade?
10. O que causa N+1?
11. Quando usar projection?
12. Page e Slice diferem como?
13. Como `@Version` protege?
14. Quando usar lock pessimista?
15. O que auditoria registra?
16. O que Spring Data abstrai?
17. Onde fica `@Transactional`?
18. Quem cria o schema?
19. Como repository é testado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Acesso relacional de baixo nível.
2. Fornecer conexões.
3. Conexões físicas.
4. Especificação e implementação.
5. Entidade rastreada.
6. No flush de uma transação.
7. Não.
8. Instância managed.
9. Dentro da responsabilidade do agregado.
10. Acesso repetido a associações.
11. Em leitura especializada.
12. Page possui total; Slice não promete.
13. Compara versão no update.
14. Quando precisa bloquear antes.
15. Quem e quando.
16. Boilerplate de repository.
17. No service do caso de uso.
18. Flyway.
19. Com PostgreSQL real em Testcontainers.
20. Prova pratica persistencia.

---

## Desafio opcional

Crie:

```java
PersistenciaKnowledgeMatrix
```

Entrada:

```text
conceito;

sintoma;

camada;

solução;

teste.
```

Saída:

```text
matriz Markdown;

lacunas;

prioridade de revisão.
```

Inclua pelo menos 25 conceitos.

Não copie definições extensas.

Escreva cada linha como uma decisão profissional.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 353 - M13.43 - Revisao tecnica JDBC JPA Hibernate Spring Data

- Revisei o M13 por decisões técnicas.
- Diferenciei JDBC, JPA, Hibernate e Spring Data.
- Revisei DataSource, HikariCP e recursos JDBC.
- Revisei transações manuais e declarativas.
- Revisei DAO e Repository Pattern.
- Revisei Flyway e Hibernate validate.
- Revisei lifecycle JPA.
- Diferenciei NEW, MANAGED, DETACHED e REMOVED.
- Revisei persist, find, merge e remove.
- Reforcei que merge retorna a instância managed.
- Revisei persistence context e identidade.
- Revisei dirty checking.
- Diferenciei flush de commit.
- Revisei clear, detach e refresh.
- Revisei relacionamentos e helpers bidirecionais.
- Revisei cascade e orphanRemoval.
- Revisei LAZY, EAGER e proxies.
- Revisei N+1 e query budget.
- Revisei JPQL, Criteria API e projections.
- Revisei paginação, Page, Slice e ordenação.
- Revisei lock otimista e pessimista.
- Comparei locks com unique constraints.
- Revisei auditoria e histórico.
- Revisei repositories Spring Data.
- Revisei save, persist e merge.
- Revisei queries derivadas, `@Query` e native.
- Revisei `@Modifying` e operações bulk.
- Revisei `@Transactional` e propagações.
- Revisei rollback rules e self-invocation.
- Revisei Testcontainers com PostgreSQL real.
- Revisei migrations imutáveis, checksum e baseline.
- Revisei expand-and-contract.
- Inspecionei o projeto final de OS.
- Criei mapas de decisão e diagnóstico.
- Preparei uma simulação orientada.
- Criei um plano para a prova prática.
- Próxima aula: Prova pratica persistencia.
```

---

## Referencia tecnica curta

```text
JDBC:
SQL direto.

JPA:
contrato ORM.

Hibernate:
provider.

Spring Data:
repository proxy.

Flyway:
schema.

Managed:
dirty checking.

Projection:
leitura.

Version:
concorrência.

Transactional:
unidade de trabalho.

Testcontainers:
banco real.
```

Regra final:

```text
dominar persistencia Java exige entender o comportamento que existe sob cada abstracao: conexoes e SQL no JDBC, lifecycle e identidade na JPA, implementacao e carregamento no Hibernate, repositories e transacoes no Spring Data, evolucao do schema no Flyway e validacao real no PostgreSQL; a escolha correta nasce do caso de uso, do SQL esperado, da fronteira transacional, da concorrencia e de testes reproduziveis.
```
