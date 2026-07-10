# 351 - M13.41 - Projeto persistencia OS parte 1

## Apresentacao da aula

Você chegou ao primeiro projeto integrado de persistência do M13.

Até aqui, os assuntos foram estudados separadamente e aprofundados em laboratórios próprios:

```text
JDBC;

DAO;

Repository Pattern;

Flyway;

JPA;

Hibernate;

EntityManager;

ciclo de vida;

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

Spring Data JPA;

queries derivadas;

@Query;

transações;

Testcontainers;

migrations evolutivas.
```

A partir desta aula, esses conhecimentos deixam de aparecer como exemplos isolados e passam a compor um projeto único.

O domínio será:

```text
persistência de Ordens de Serviço.
```

Uma Ordem de Serviço não será apenas uma tabela.

Ela será tratada como uma unidade de negócio composta por:

```text
Cliente;

Produto;

Ordem de Serviço;

Atividades.
```

Nesta primeira parte, você construirá a fundação do projeto:

- estrutura Maven;
- configuração explícita do Spring;
- migrations iniciais;
- auditoria;
- versionamento;
- value objects;
- entidades;
- relacionamentos;
- repositories;
- caso de uso de abertura da OS;
- leitura do agregado;
- projection de listagem;
- testes reais com PostgreSQL;
- critérios de arquitetura.

A segunda parte completará o projeto com:

- técnico;
- atribuição;
- pagamento;
- histórico de status;
- transições;
- cancelamento;
- conclusão;
- consultas operacionais;
- concorrência;
- fechamento do laboratório.

Por isso, a parte 1 não tentará entregar todas as funcionalidades antecipadamente.

Ela deverá entregar uma base correta, testada e preparada para evolução.

A arquitetura continuará sem Spring Boot.

Você configurará explicitamente:

```text
AnnotationConfigApplicationContext;

@EnableJpaRepositories;

@EnableTransactionManagement;

LocalContainerEntityManagerFactoryBean;

JpaTransactionManager;

Flyway;

HikariCP;

Testcontainers.
```

A stack será:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

JUnit 6.1.1;

Testcontainers 2.0.5;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

PostgreSQL 17.6.
```

O database de desenvolvimento será:

```text
formacao_java_projeto_os_351
```

O schema será:

```text
projeto_os_351
```

Nos testes, Testcontainers criará um PostgreSQL descartável.

Flyway continuará sendo o único responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

O projeto adotará as seguintes regras:

```text
entidade não expõe setter genérico;

ID é gerado pelo banco;

campos de auditoria são controlados por listener;

entidades mutáveis usam @Version;

relacionamentos são LAZY por padrão;

cascade só existe dentro da responsabilidade do agregado;

repository não define regra de negócio;

service define a transação;

consulta de lista usa projection;

teste de repository usa PostgreSQL real;

migration aplicada não é editada.
```

O fluxo principal da parte 1 será:

```text
AbrirOrdemServicoCommand
    -> OrdemServicoApplicationService
        -> localizar Cliente
        -> localizar Produto
        -> criar Ordem
        -> adicionar Atividades
        -> salvar agregado
        -> commit
        -> retornar ID e código.
```

A leitura detalhada será:

```text
buscar Ordem por ID
    -> join fetch controlado
        -> Cliente
        -> Produto
        -> Atividades
            -> montar OrdemDetalhada.
```

A listagem será:

```text
projection
    -> código
    -> status
    -> Cliente
    -> Produto
    -> quantidade de Atividades
    -> data de criação.
```

O laboratório comprovará:

```text
schema criado por migrations;

Hibernate validando o schema;

Cliente e Produto persistidos;

Ordem criada com duas Atividades;

auditoria preenchida;

versão inicial zero;

cascade somente da Ordem para Atividades;

Cliente e Produto sem cascade;

rollback integral quando uma Atividade é inválida;

código de Ordem unique;

fetch detalhado sem N+1;

projection de listagem;

paginação estável;

Testcontainers usando PostgreSQL real;

estado final sem fixtures.
```

A próxima aula será:

```text
352 - M13.42 - Projeto persistencia OS parte 2
```

---

## Onde estamos na formacao

A sequência final do M13 está entrando na consolidação prática:

```text
349:
Testes de Repository com Testcontainers.

350:
Migrations integradas com persistencia.

351:
Projeto persistencia OS parte 1.

352:
Projeto persistencia OS parte 2.

353:
Revisao tecnica JDBC JPA Hibernate Spring Data.
```

A aula 350 respondeu:

```text
como evoluir o schema com segurança?
```

A aula 351 responderá:

```text
como organizar um projeto de persistência
que reúne o conteúdo do módulo?
```

Nesta primeira parte:

```text
estrutura do projeto:
sim.

migrations iniciais:
sim.

Cliente:
sim.

Produto:
sim.

Ordem:
sim.

Atividade:
sim.

auditoria:
sim.

@Version:
sim.

Spring Data:
sim.

abertura da OS:
sim.

leitura detalhada:
sim.

projection:
sim.

paginação:
sim.

Testcontainers:
sim.

Técnico:
não.

Pagamento:
não.

Histórico de status:
não.

fechamento completo:
não.
```

A arquitetura de pacotes será:

```text
domain:
regras e value objects.

persistence:
entidades e repositories.

application:
commands, services e resultados.

config:
infraestrutura Spring, JPA e Flyway.

test:
integração real com PostgreSQL.
```

O projeto não será uma API web.

Não haverá:

- controller;
- JSON;
- DTO HTTP;
- endpoint;
- autenticação;
- Spring Boot;
- mensageria.

O foco continuará sendo persistência profissional.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-351-projeto-persistencia-os-parte-1
```

Estrutura final:

```text
labs
└── m13
    └── aula-351-projeto-persistencia-os-parte-1
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── application.local.env.example
        │   └── application.local.env
        ├── docs
        │   ├── arquitetura-parte-1.md
        │   ├── modelo-relacional-parte-1.md
        │   ├── contrato-agregado-ordem.md
        │   ├── politica-cascade-fetch.md
        │   ├── fluxo-abertura-os.md
        │   ├── estrategia-testes.md
        │   └── troubleshooting-projeto-os.md
        ├── scripts
        │   ├── 01_criar_database.ps1
        │   ├── 02_executar_migrations.ps1
        │   ├── 03_executar_testes.ps1
        │   ├── 04_executar_aplicacao.ps1
        │   ├── 05_validar_estado.ps1
        │   └── 06_limpar_database.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── projetoos
            │   │                   ├── Main.java
            │   │                   ├── application
            │   │                   │   ├── command
            │   │                   │   │   ├── AbrirOrdemServicoCommand.java
            │   │                   │   │   └── NovaAtividadeCommand.java
            │   │                   │   ├── result
            │   │                   │   │   ├── OrdemAbertaResult.java
            │   │                   │   │   ├── OrdemDetalhadaResult.java
            │   │                   │   │   └── OrdemResumoResult.java
            │   │                   │   └── service
            │   │                   │       ├── OrdemServicoApplicationService.java
            │   │                   │       └── OrdemServicoQueryService.java
            │   │                   ├── audit
            │   │                   │   ├── AuditActor.java
            │   │                   │   ├── AuditContext.java
            │   │                   │   ├── AuditEntityListener.java
            │   │                   │   ├── AuditableEntity.java
            │   │                   │   └── AuditScope.java
            │   │                   ├── config
            │   │                   │   ├── ApplicationSettings.java
            │   │                   │   ├── ApplicationSettingsLoader.java
            │   │                   │   └── PersistenceConfig.java
            │   │                   ├── domain
            │   │                   │   ├── AtividadeStatus.java
            │   │                   │   ├── OrdemServicoStatus.java
            │   │                   │   ├── PeriodoAtendimento.java
            │   │                   │   └── PrioridadeOrdem.java
            │   │                   └── persistence
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   ├── OrdemServicoEntity.java
            │   │                       │   └── ProdutoEntity.java
            │   │                       ├── projection
            │   │                       │   └── OrdemResumoView.java
            │   │                       └── repository
            │   │                           ├── ClienteRepository.java
            │   │                           ├── OrdemServicoRepository.java
            │   │                           └── ProdutoRepository.java
            │   └── resources
            │       └── db
            │           └── migration
            │               ├── V1__criar_schema_projeto_os.sql
            │               ├── V2__criar_cliente_e_produto.sql
            │               ├── V3__criar_ordem_servico.sql
            │               ├── V4__criar_atividade.sql
            │               ├── V5__criar_indices_parte_1.sql
            │               └── R__vw_ordem_resumo_parte_1.sql
            └── test
                ├── java
                │   └── br
                │       └── com
                │           └── formacao
                │               └── projetoos
                │                   ├── AbstractProjetoOsContainerIT.java
                │                   ├── MigrationProjetoOsIT.java
                │                   ├── MappingProjetoOsIT.java
                │                   ├── AbrirOrdemServicoIT.java
                │                   ├── AbrirOrdemRollbackIT.java
                │                   ├── OrdemAggregateFetchIT.java
                │                   ├── OrdemResumoProjectionIT.java
                │                   ├── OrdemPaginationIT.java
                │                   ├── ProjetoOsArchitectureTest.java
                │                   └── TestDataCleaner.java
                └── resources
                    └── logback-test.xml
```

Ao terminar, você terá:

```text
um projeto compilável;

um schema versionado;

quatro entidades principais;

um agregado de Ordem;

um caso de uso transacional;

uma consulta detalhada;

uma projection paginada;

uma suíte de integração real;

documentação de decisões.
```

---

## Conceito essencial

### O agregado da parte 1

O agregado principal será:

```text
OrdemServico.
```

A Ordem controla o ciclo das Atividades criadas junto com ela.

Cliente e Produto não pertencem ao lifecycle da Ordem.

Isso produz a responsabilidade:

```text
Ordem
    -> possui Atividades.

Ordem
    -> referencia Cliente.

Ordem
    -> referencia Produto.
```

Logo:

```text
cascade para Atividade:
sim, com critério.

cascade para Cliente:
não.

cascade para Produto:
não.
```

---

### Cliente

O Cliente representa o contratante da Ordem.

Campos:

```text
id;

codigo;

nome;

ativo;

versao;

auditoria.
```

Regras:

- código obrigatório;
- nome obrigatório;
- código unique;
- somente Cliente ativo pode receber nova Ordem;
- Ordem não cria nem remove Cliente.

---

### Produto

O Produto representa o item ou categoria principal atendida.

Campos:

```text
id;

codigo;

nome;

categoria;

ativo;

versao;

auditoria.
```

Regras:

- código obrigatório;
- nome obrigatório;
- categoria obrigatória;
- código unique;
- somente Produto ativo pode ser usado;
- Ordem não controla seu lifecycle.

---

### OrdemServico

Campos da parte 1:

```text
id;

codigo;

descricao;

status;

prioridade;

dataAgendada;

periodo;

cliente;

produto;

atividades;

versao;

auditoria.
```

Estado inicial:

```text
ABERTA.
```

Prioridade inicial:

```text
NORMAL,
salvo valor explícito no command.
```

A Ordem precisa ter pelo menos uma Atividade.

---

### Atividade

Campos:

```text
id;

codigo;

descricao;

status;

ordemServico;

versao;

auditoria.
```

Estado inicial:

```text
AGENDADA,
quando a Ordem possui data e período.

PENDENTE,
quando ainda não existe agendamento.
```

Nesta parte, o command exigirá data e período.

Portanto, as Atividades novas começarão:

```text
AGENDADA.
```

---

### Value objects e enums

Use enums para estados persistidos:

```java
@Enumerated(
        EnumType.STRING
)
```

Enums:

```text
OrdemServicoStatus;

AtividadeStatus;

PeriodoAtendimento;

PrioridadeOrdem.
```

Não use ordinal.

Adicionar um item no meio de um enum ordinal altera o significado dos números antigos.

---

### Codigo gerado pela aplicacao

O projeto usará códigos recebidos pelo command para manter o laboratório determinístico:

```text
OS-P351-0001;

ATV-P351-0001;

ATV-P351-0002.
```

Em produção, a geração poderia ser feita por:

- sequence dedicada;
- serviço de numeração;
- UUID;
- código composto;
- integração externa.

Nesta aula, o command fornece os códigos e o banco garante unicidade.

---

### Relacionamentos to-one

Na Ordem:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
@JoinColumn(
        name = "cliente_id",
        nullable = false
)
private ClienteEntity cliente;
```

Produto segue o mesmo padrão.

Não use cascade.

---

### OneToMany das Atividades

Na Ordem:

```java
@OneToMany(
        mappedBy = "ordemServico",
        cascade = {
                CascadeType.PERSIST,
                CascadeType.MERGE
        },
        orphanRemoval = true
)
private final List<AtividadeEntity>
        atividades =
                new ArrayList<>();
```

Não use `CascadeType.ALL` automaticamente.

A parte 1 precisa de persist e merge.

A remoção definitiva da Ordem não será fluxo de negócio desta etapa.

---

### Helper bidirecional

A Ordem terá:

```java
public void adicionarAtividade(
        AtividadeEntity atividade
) {
    Objects.requireNonNull(
            atividade
    );

    atividade.vincularA(
            this
    );

    atividades.add(
            atividade
    );
}
```

A entidade Atividade terá um método controlado para receber a Ordem.

Os dois lados permanecem coerentes em memória.

---

### Construtor protegido

Entidades JPA terão construtor:

```java
protected OrdemServicoEntity() {
}
```

A criação válida passará por factory:

```java
public static OrdemServicoEntity abrir(...)
```

Isso concentra invariantes.

---

### Colecao protegida

O getter retorna:

```java
Collections.unmodifiableList(
        atividades
);
```

ou:

```java
List.copyOf(
        atividades
);
```

Não exponha a lista mutável diretamente.

---

### Auditoria

As quatro entidades usarão:

```text
createdAt;

updatedAt;

createdBy;

updatedBy.
```

O `AuditScope` precisa envolver a transação do service.

Ator do laboratório:

```text
user:thiago.
```

Clock dos testes:

```text
fixo.
```

---

### Versionamento

Todas as entidades mutáveis terão:

```java
@Version
private int versao;
```

A parte 1 validará a versão inicial e uma atualização simples da Ordem.

O conflito concorrente completo será retomado na parte 2, dentro do fluxo operacional final.

---

### Migrations por responsabilidade

A cadeia será:

```text
V1:
schema, sequences auxiliares e extensões do projeto.

V2:
Cliente e Produto.

V3:
Ordem de Serviço.

V4:
Atividade.

V5:
índices.

R__:
view de resumo.
```

Separar migrations por responsabilidade facilita leitura e testes.

---

### View de resumo

A view:

```text
vw_ordem_resumo_parte_1
```

retornará:

```text
ordem_id;

codigo;

status;

prioridade;

cliente_nome;

produto_nome;

quantidade_atividades;

created_at.
```

Ela demonstra integração entre migration e projection.

O repository também terá uma JPQL projection.

As duas estratégias serão comparadas.

---

### Repository de Cliente

Métodos:

```java
Optional<ClienteEntity>
findByCodigo(
        String codigo
);

boolean existsByCodigo(
        String codigo
);
```

Não exponha `findAll` no caso de uso.

---

### Repository de Produto

Métodos equivalentes por código.

---

### Repository de Ordem

Operações:

```text
save;

findById;

findByCodigo;

findDetailedById;

findSummaries;

findNativeSummariesFromView.
```

A consulta detalhada usará `join fetch` para os to-one e uma estratégia controlada para Atividades.

---

### Fetch de duas associacoes to-one e uma colecao

Uma query pode usar:

```java
select distinct o
from OrdemServico o
join fetch o.cliente
join fetch o.produto
left join fetch o.atividades
where o.id = :id
```

Como a consulta retorna uma única Ordem, o fetch da coleção é aceitável.

Não use essa mesma query para paginação.

---

### Projection para pagina

A listagem não retorna o agregado completo.

Ela retorna:

```text
OrdemResumoView.
```

A query agrupa por Ordem e conta Atividades.

A paginação precisa de `countQuery` separada.

A ordenação será:

```text
createdAt DESC;

id DESC.
```

---

### Service de aplicacao

O service coordena:

1. validar command;
2. buscar Cliente;
3. verificar ativo;
4. buscar Produto;
5. verificar ativo;
6. criar Ordem;
7. criar Atividades;
8. adicionar ao agregado;
9. salvar;
10. confirmar;
11. devolver resultado.

Ele não recebe `EntityManager`.

Ele usa repositories.

---

### Command

`AbrirOrdemServicoCommand` será um record imutável.

Campos:

```text
codigoOrdem;

descricao;

codigoCliente;

codigoProduto;

prioridade;

dataAgendada;

periodo;

atividades.
```

A lista de atividades será copiada defensivamente.

O command valida estrutura.

O service valida estado persistido de Cliente e Produto.

---

### Resultado de abertura

Retorno:

```java
public record OrdemAbertaResult(
        Long id,
        String codigo,
        String status,
        int quantidadeAtividades,
        int versao
) {
}
```

O service não retorna a entidade managed.

Isso evita vazar lifecycle JPA para a borda da aplicação.

---

### Transacao atomica

Se a segunda Atividade for inválida, nenhuma parte será confirmada.

Não pode existir:

```text
Ordem sem todas as Atividades solicitadas.
```

O teste verificará o banco em nova transação após a falha.

---

### Excecoes do projeto

Crie exceptions específicas:

```text
ClienteNaoEncontradoException;

ClienteInativoException;

ProdutoNaoEncontradoException;

ProdutoInativoException;

CodigoDuplicadoException;

OrdemNaoEncontradaException.
```

Não exponha `DataIntegrityViolationException` diretamente como mensagem de negócio.

A tradução completa pode ser finalizada na parte 2.

---

### Testcontainers

A suíte continuará usando:

```text
postgres:17.6-alpine;

porta dinâmica;

Flyway antes do Hibernate;

container compartilhado por JVM;

fixtures por prefixo;

execução sequencial.
```

Não use H2.

---

### Testes de arquitetura

Além de testes de comportamento, haverá testes estruturais simples por reflection e leitura de arquivos.

Eles confirmarão:

- entidade sem setter genérico;
- `@Version`;
- mappings LAZY;
- ausência de cascade em Cliente e Produto;
- service com `@Transactional`;
- repository sem implementação manual;
- Hibernate em validate;
- migrations presentes;
- Spring Boot ausente.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\application\command"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\application\result"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\application\service"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\persistence\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\persistence\projection"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\java\br\com\formacao\projetoos\persistence\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-351-projeto-persistencia-os-parte-1\src\test\java\br\com\formacao\projetoos"

Set-Location `
  "labs\m13\aula-351-projeto-persistencia-os-parte-1"
```

---

### 2. Criar pom.xml

Reutilize os BOMs e versões das aulas 349 e 350.

Inclua:

```text
spring-context;

spring-orm;

spring-tx;

spring-data-jpa;

hibernate-core;

jakarta.persistence-api;

HikariCP;

postgresql;

flyway-core;

flyway-database-postgresql;

spring-test;

junit-jupiter;

assertj-core;

testcontainers-postgresql;

testcontainers-junit-jupiter.
```

Não inclua:

```text
Spring Boot;

H2;

Lombok;

MapStruct;

Web MVC.
```

O objetivo é manter o modelo explícito.

---

### 3. Criar configuracao local

`application.local.env.example`:

```properties
APP_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_projeto_os_351
APP_JDBC_USER=formacao
APP_JDBC_PASSWORD=formacao_local
APP_POOL_NAME=projeto-os-351-pool
APP_POOL_SIZE=6
```

O arquivo real deve estar no `.gitignore`.

---

### 4. Criar V1

Arquivo:

```text
V1__criar_schema_projeto_os.sql
```

Crie:

```text
schema projeto_os_351;

sequences de Cliente, Produto, Ordem e Atividade.
```

Não crie tabelas ainda.

A migration também pode configurar comentários de schema.

---

### 5. Criar V2

Arquivo:

```text
V2__criar_cliente_e_produto.sql
```

Crie `cliente` e `produto`.

Ambas terão:

```text
id bigint;

codigo varchar;

nome varchar;

ativo boolean;

versao integer;

created_at timestamptz;

updated_at timestamptz;

created_by varchar;

updated_by varchar.
```

Produto terá também:

```text
categoria varchar.
```

Crie unique, checks e índices por ativo.

---

### 6. Criar V3

Arquivo:

```text
V3__criar_ordem_servico.sql
```

Colunas:

```text
id;

codigo;

descricao;

status;

prioridade;

data_agendada;

periodo;

cliente_id;

produto_id;

versao;

auditoria.
```

Crie foreign keys sem cascade delete.

Checks:

```text
status;

prioridade;

periodo;

versao;

updated_at >= created_at.
```

---

### 7. Criar V4

Arquivo:

```text
V4__criar_atividade.sql
```

Colunas:

```text
id;

codigo;

descricao;

status;

ordem_servico_id;

versao;

auditoria.
```

Crie:

```text
unique de codigo;

foreign key para Ordem;

check de status;

índice em ordem_servico_id;

índice em status.
```

A foreign key pode usar:

```text
ON DELETE CASCADE
```

somente porque Atividade faz parte do agregado e não existe sem Ordem.

Documente essa decisão.

---

### 8. Criar V5

Arquivo:

```text
V5__criar_indices_parte_1.sql
```

Índices:

```text
ordem por status, created_at e id;

ordem por Cliente;

ordem por Produto;

atividade por Ordem e status.
```

Não crie índices sem relação com consultas da parte 1.

---

### 9. Criar view repeatable

Arquivo:

```text
R__vw_ordem_resumo_parte_1.sql
```

Use:

```sql
CREATE OR REPLACE VIEW
    projeto_os_351.vw_ordem_resumo_parte_1
AS
SELECT
    ordem.id AS ordem_id,
    ordem.codigo,
    ordem.status,
    ordem.prioridade,
    cliente.nome AS cliente_nome,
    produto.nome AS produto_nome,
    count(atividade.id) AS quantidade_atividades,
    ordem.created_at
FROM projeto_os_351.ordem_servico ordem
JOIN projeto_os_351.cliente cliente
    ON cliente.id = ordem.cliente_id
JOIN projeto_os_351.produto produto
    ON produto.id = ordem.produto_id
LEFT JOIN projeto_os_351.atividade atividade
    ON atividade.ordem_servico_id = ordem.id
GROUP BY
    ordem.id,
    ordem.codigo,
    ordem.status,
    ordem.prioridade,
    cliente.nome,
    produto.nome,
    ordem.created_at;
```

---

### 10. Criar enums

`OrdemServicoStatus`:

```text
ABERTA;

AGENDADA;

EM_ATENDIMENTO;

CONCLUIDA;

CANCELADA.
```

Na parte 1, somente `ABERTA` será criada.

`AtividadeStatus`:

```text
PENDENTE;

AGENDADA;

EM_ATENDIMENTO;

CONCLUIDA;

CANCELADA.
```

`PeriodoAtendimento`:

```text
MANHA;

TARDE;

NOITE.
```

`PrioridadeOrdem`:

```text
BAIXA;

NORMAL;

ALTA;

CRITICA.
```

---

### 11. Reutilizar auditoria

Copie a infraestrutura consolidada da aula 344.

Mantenha:

```text
AuditActor;

AuditContext;

AuditScope;

AuditableEntity;

AuditEntityListener;

Clock.
```

Não introduza Spring Security.

---

### 12. Criar ClienteEntity.java

Factory:

```java
public static ClienteEntity novo(
        String codigo,
        String nome
)
```

Métodos:

```java
public void ativar()

public void inativar()

public boolean isAtivo()
```

A factory inicia ativo.

---

### 13. Criar ProdutoEntity.java

Factory:

```java
public static ProdutoEntity novo(
        String codigo,
        String nome,
        String categoria
)
```

Métodos de ativação e inativação equivalentes.

---

### 14. Criar AtividadeEntity.java

Factory package-private ou controlada:

```java
static AtividadeEntity nova(
        String codigo,
        String descricao
)
```

O status inicial será definido quando vinculada à Ordem agendada.

Método:

```java
void vincularA(
        OrdemServicoEntity ordem
)
```

Não exponha mudança livre de Ordem.

---

### 15. Criar OrdemServicoEntity.java

Factory:

```java
public static OrdemServicoEntity abrir(
        String codigo,
        String descricao,
        ClienteEntity cliente,
        ProdutoEntity produto,
        PrioridadeOrdem prioridade,
        LocalDate dataAgendada,
        PeriodoAtendimento periodo
)
```

Valide todos os argumentos.

Estado inicial:

```text
ABERTA.
```

---

### 16. Adicionar Atividades

Método:

```java
public void adicionarAtividade(
        String codigo,
        String descricao
) {
    AtividadeEntity atividade =
            AtividadeEntity.nova(
                    codigo,
                    descricao
            );

    atividade.agendar();
    atividade.vincularA(
            this
    );

    atividades.add(
            atividade
    );
}
```

Impeça códigos repetidos dentro do agregado antes do flush.

---

### 17. Criar commands

`NovaAtividadeCommand`:

```java
public record NovaAtividadeCommand(
        String codigo,
        String descricao
) {
}
```

`AbrirOrdemServicoCommand` copia a lista:

```java
atividades =
        List.copyOf(
                atividades
        );
```

Exija pelo menos uma Atividade.

---

### 18. Criar repositories

`ClienteRepository` e `ProdutoRepository` terão busca por código.

`OrdemServicoRepository`:

```java
Optional<OrdemServicoEntity>
findByCodigo(
        String codigo
);
```

Consulta detalhada:

```java
@Query(
        """
        select distinct o
        from OrdemServico o
        join fetch o.cliente
        join fetch o.produto
        left join fetch o.atividades
        where o.id = :id
        """
)
Optional<OrdemServicoEntity>
findDetailedById(
        @Param("id") Long id
);
```

---

### 19. Criar projection de resumo

Interface:

```java
public interface OrdemResumoView {

    Long getId();

    String getCodigo();

    OrdemServicoStatus getStatus();

    PrioridadeOrdem getPrioridade();

    String getClienteNome();

    String getProdutoNome();

    long getQuantidadeAtividades();

    Instant getCreatedAt();
}
```

Crie JPQL com aliases e `countQuery`.

A consulta paginada deve usar `Pageable`.

---

### 20. Criar projection nativa da view

Método separado para comparar:

```java
@Query(
        value = """
                select
                    ordem_id as id,
                    codigo,
                    status,
                    prioridade,
                    cliente_nome as "clienteNome",
                    produto_nome as "produtoNome",
                    quantidade_atividades
                        as "quantidadeAtividades",
                    created_at as "createdAt"
                from projeto_os_351.vw_ordem_resumo_parte_1
                order by created_at desc, ordem_id desc
                """,
        nativeQuery = true
)
List<OrdemResumoView>
findNativeSummaries();
```

Use apenas nos testes e no relatório do laboratório.

---

### 21. Criar OrdemServicoApplicationService.java

Anote:

```java
@Service
```

Método:

```java
@Transactional
public OrdemAbertaResult abrir(
        AbrirOrdemServicoCommand command
)
```

Fluxo:

1. verificar código duplicado;
2. buscar Cliente;
3. confirmar ativo;
4. buscar Produto;
5. confirmar ativo;
6. criar Ordem;
7. adicionar commands de Atividade;
8. salvar Ordem;
9. retornar resultado.

---

### 22. Tratar codigo duplicado

Primeira proteção:

```text
existsByCodigo.
```

Proteção definitiva:

```text
constraint unique.
```

Existe condição de corrida entre exists e insert.

Por isso, traduza também a exception de integridade.

O `exists` melhora mensagem, mas não substitui a constraint.

---

### 23. Criar OrdemServicoQueryService.java

Métodos:

```java
@Transactional(
        readOnly = true
)
public OrdemDetalhadaResult detalhar(
        Long id
)

@Transactional(
        readOnly = true
)
public Page<OrdemResumoResult> listar(
        Pageable pageable
)
```

Converta entidades e projections para results.

Não retorne entidades para o `Main`.

---

### 24. Criar Main.java

O `Main`:

1. inicia contexto Spring;
2. cria Cliente e Produto de demonstração em transação de preparação;
3. abre `AuditScope`;
4. chama service;
5. detalha Ordem;
6. lista resumos;
7. imprime;
8. remove fixtures;
9. fecha contexto.

Formato:

```text
OS | status | prioridade | Cliente | Produto | Atividades | versão
```

Não use JSON.

---

### 25. Criar base Testcontainers

Use:

```text
postgres:17.6-alpine;

porta dinâmica;

database projeto_os_351_test;

container compartilhado por JVM.
```

Flyway deve executar antes do `EntityManagerFactory`.

---

### 26. Criar MigrationProjetoOsIT.java

Valide:

- migrations V1 a V5;
- repeatable;
- quatro tabelas;
- foreign keys;
- unique;
- checks;
- índices;
- view;
- Hibernate validate.

---

### 27. Criar MappingProjetoOsIT.java

Persista Cliente e Produto.

Crie Ordem com uma Atividade.

Confirme:

- IDs;
- auditoria;
- versões;
- foreign keys;
- cascade da Atividade;
- ausência de cascade em Cliente e Produto.

---

### 28. Criar AbrirOrdemServicoIT.java

Prepare Cliente e Produto ativos.

Command com duas Atividades.

Execute o service dentro de `AuditScope`.

Confirme:

```text
uma Ordem;

duas Atividades;

status ABERTA;

Atividades AGENDADAS;

prioridade;

data e período;

versão zero;

auditoria do mesmo ator.
```

---

### 29. Criar AbrirOrdemRollbackIT.java

Use a segunda Atividade com código duplicado dentro do command.

Espere falha.

Em nova transação, confirme:

```text
zero Ordem;

zero Atividade.
```

Cliente e Produto de fixture permanecem, pois já existiam antes do caso de uso.

---

### 30. Criar OrdemAggregateFetchIT.java

Execute `findDetailedById`.

Confirme:

- Cliente loaded;
- Produto loaded;
- Atividades loaded;
- uma Ordem;
- duas Atividades;
- quantidade controlada de SELECTs;
- nenhum N+1 ao navegar.

---

### 31. Criar OrdemResumoProjectionIT.java

Compare:

```text
JPQL projection;

native view projection.
```

Confirme os mesmos dados principais.

Não compare a classe concreta da interface projection.

---

### 32. Criar OrdemPaginationIT.java

Crie sete Ordens.

Use página zero, tamanho três.

Confirme:

```text
content 3;

total 7;

totalPages 3;

ordem estável;

sem fetch de coleção.
```

---

### 33. Criar ProjetoOsArchitectureTest.java

Valide:

- Spring Boot ausente;
- H2 ausente;
- mappings LAZY;
- `@Version` nas entidades;
- `AuditableEntity`;
- cascade apenas em Atividades;
- service transacional;
- query service readOnly;
- Hibernate validate;
- Flyway presente;
- migrations nomeadas;
- repository como interface;
- nenhuma implementação manual;
- ponte para aula 352.

---

### 34. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM projeto_os_351.atividade
WHERE codigo LIKE 'ATV-P351-%';

DELETE FROM projeto_os_351.ordem_servico
WHERE codigo LIKE 'OS-P351-%';

DELETE FROM projeto_os_351.produto
WHERE codigo LIKE 'PROD-P351-%';

DELETE FROM projeto_os_351.cliente
WHERE codigo LIKE 'CLI-P351-%';
```

Limpe filhos antes dos pais.

---

### 35. Criar scripts

`01_criar_database.ps1` cria o database local.

`02_executar_migrations.ps1`:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

`03_executar_testes.ps1`:

```powershell
docker info
mvn clean verify
```

`04_executar_aplicacao.ps1`:

```powershell
mvn exec:java
```

`05_validar_estado.ps1` verifica schema, view e ausência de fixtures.

`06_limpar_database.ps1` remove o database isolado.

---

### 36. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migrations.ps1
.\scripts\03_executar_testes.ps1
.\scripts\04_executar_aplicacao.ps1
.\scripts\05_validar_estado.ps1
```

Confirme:

```text
migrations válidas;

contexto Spring inicia;

Cliente e Produto existentes;

Ordem aberta;

duas Atividades;

auditoria;

versão;

rollback;

fetch detalhado;

projection;

paginação;

estado limpo.
```

Depois:

```powershell
.\scripts\06_limpar_database.ps1
```

---

### 37. Criar documentacao

`arquitetura-parte-1.md` deve mostrar camadas e dependências.

`modelo-relacional-parte-1.md` deve registrar tabelas, colunas, foreign keys, índices e cardinalidades.

`contrato-agregado-ordem.md` deve explicar por que Atividade pertence à Ordem e Cliente/Produto não.

`politica-cascade-fetch.md` deve registrar decisões de cascade, LAZY e consultas específicas.

`fluxo-abertura-os.md` deve desenhar validação, transação, persist, flush e commit.

`estrategia-testes.md` deve separar unitário, integração, migration e arquitetura.

`troubleshooting-projeto-os.md` deve cobrir migration, bean, auditoria, cascade, detached, N+1, projection, rollback e Docker.

---

## Entendendo o que foi feito

### O modulo virou um projeto

As técnicas anteriores passaram a colaborar em uma única solução.

### O agregado recebeu fronteiras

Atividade pertence à Ordem; Cliente e Produto são referências externas ao agregado.

### O banco e o modelo ficaram alinhados

Flyway criou; Hibernate validou; Testcontainers comprovou.

### O caso de uso ganhou atomicidade

Ordem e Atividades são confirmadas ou desfeitas juntas.

### Leitura e escrita receberam contratos diferentes

O agregado atende ao caso detalhado; projection atende à listagem.

---

## Erros comuns importantes

### Colocar cascade em Cliente e Produto

Salvar uma Ordem não deve criar ou remover cadastros mestres.

### Retornar entidade no resultado do service

Isso vaza o persistence context para fora da camada.

### Paginar com fetch de colecao

A multiplicação de linhas quebra a semântica da página.

### Usar setter para montar agregado

Factories e helpers preservam invariantes.

### Testar somente com mock

Mapping, migration e SQL precisam de PostgreSQL real.

---

## Comandos uteis

### Compilar

```powershell
mvn clean compile
```

### Testar

```powershell
mvn clean verify
```

### Flyway

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

### Docker

```powershell
docker info
docker ps
```

### Consultar resumo

```sql
SELECT *
FROM projeto_os_351.vw_ordem_resumo_parte_1
ORDER BY created_at DESC, ordem_id DESC;
```

---

## Exercicio guiado

### Parte 1 — Cliente inativo

Inative um Cliente e tente abrir uma Ordem.

Confirme zero Ordem.

### Parte 2 — Produto inativo

Repita com Produto inativo.

### Parte 3 — Atividade duplicada

Envie dois commands com o mesmo código.

Confirme validação antes do banco.

### Parte 4 — Constraint como ultima defesa

Simule duas tentativas concorrentes com o mesmo código de Ordem.

Confirme que unique continua protegendo.

### Parte 5 — Projection alternativa

Crie record projection para a listagem.

Compare com interface projection.

### Parte 6 — Fetch incorreto

Remova temporariamente o fetch da coleção.

Observe SELECTs e restaure.

### Parte 7 — Sem cascade

Remova temporariamente cascade de Atividades.

Observe que o agregado deixa de persistir completo e restaure.

### Parte 8 — ADR

Registre:

```text
Ordem é agregado;

Atividade pertence à Ordem;

Cliente e Produto são referências;

cascade somente para Atividades;

LAZY por padrão;

service transacional;

results fora da JPA;

projection para lista;

Testcontainers para integração;

Flyway dono do schema.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 351 existe;
- continuidade com a aula 350 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- JUnit 6.1.1 foi mantido;
- Testcontainers 2.0.5 foi mantido;
- PostgreSQL real foi usado;
- Spring Boot não foi usado;
- H2 não foi usado;
- Flyway permaneceu dono do DDL;
- Hibernate permaneceu em validate;
- database local isolado foi definido;
- database de teste descartável foi definido;
- schema `projeto_os_351` foi criado;
- V1 foi criada;
- V2 foi criada;
- V3 foi criada;
- V4 foi criada;
- V5 foi criada;
- repeatable foi criada;
- Cliente foi modelado;
- Produto foi modelado;
- Ordem foi modelada;
- Atividade foi modelada;
- enums foram persistidos como STRING;
- ordinal não foi usado;
- códigos possuem unique;
- status possuem checks;
- prioridade possui check;
- período possui check;
- foreign keys foram criadas;
- índices correspondem às consultas;
- view de resumo foi criada;
- auditoria foi reutilizada;
- AuditScope envolveu transações;
- Clock foi controlado em teste;
- ator foi explícito;
- `@Version` foi usado;
- construtores JPA foram protegidos;
- factories foram criadas;
- setters genéricos foram evitados;
- coleção interna ficou protegida;
- helper bidirecional foi usado;
- Ordem foi definida como agregado;
- Atividade pertence ao lifecycle da Ordem;
- Cliente não recebeu cascade;
- Produto não recebeu cascade;
- Atividade recebeu persist e merge;
- orphanRemoval foi justificado;
- delete de Ordem não foi fluxo da parte 1;
- Cliente ativo foi exigido;
- Produto ativo foi exigido;
- Ordem iniciou ABERTA;
- Atividades iniciaram AGENDADAS;
- pelo menos uma Atividade foi exigida;
- código duplicado no agregado foi rejeitado;
- command foi imutável;
- lista do command foi copiada;
- service foi criado;
- service foi transacional;
- service coordenou repositories;
- EntityManager não foi injetado no service;
- resultado não retornou entidade;
- busca por código foi criada;
- constraint permaneceu defesa final;
- exceptions de domínio foram previstas;
- consulta detalhada foi criada;
- join fetch carregou to-one;
- coleção foi carregada no detalhe;
- `distinct` foi usado com critério;
- consulta detalhada não foi usada para paginação;
- projection de resumo foi criada;
- count de Atividades foi calculado;
- `Pageable` foi usado;
- `countQuery` foi definido quando necessário;
- ordenação ficou estável;
- ID foi usado como desempate;
- projection nativa da view foi criada;
- JPQL e view foram comparadas;
- Testcontainers iniciou PostgreSQL;
- imagem foi fixada;
- porta foi dinâmica;
- Flyway executou antes do Hibernate;
- migration foi testada;
- mapping foi testado;
- abertura foi testada;
- rollback foi testado;
- fetch foi testado;
- projection foi testada;
- paginação foi testada;
- teste de arquitetura foi criado;
- cleaner removeu filhos antes dos pais;
- fixtures receberam prefixos;
- testes não dependeram da ordem;
- SQL foi observado;
- N+1 foi controlado;
- estado final ficou limpo;
- Técnico não foi antecipado;
- Pagamento não foi antecipado;
- histórico de status não foi antecipado;
- conclusão completa não foi antecipada;
- ponte para a aula 352 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Confirme que não aparece:

```text
config/application.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-351-projeto-persistencia-os-parte-1
```

Commit recomendado:

```powershell
git commit -m "feat(m13): iniciar projeto de persistencia de os"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou o projeto integrado de persistência de Ordem de Serviço.

Construiu:

```text
estrutura Maven;

configuração Spring explícita;

migrations;

Cliente;

Produto;

Ordem;

Atividade;

auditoria;

versionamento;

repositories;

service transacional;

consulta detalhada;

projection;

paginação;

Testcontainers.
```

O fluxo principal comprovou:

```text
Cliente ativo;

Produto ativo;

Ordem ABERTA;

Atividades AGENDADAS;

cascade controlado;

auditoria preenchida;

versão inicial;

rollback integral;

fetch sem N+1;

listagem enxuta.
```

As decisões arquiteturais foram:

```text
Ordem:
raiz do agregado.

Atividade:
filha do agregado.

Cliente e Produto:
referências sem cascade.

escrita:
service transacional.

detalhe:
agregado carregado sob consulta específica.

lista:
projection paginada.

schema:
Flyway.

mapping:
Hibernate validate.

teste:
PostgreSQL em Testcontainers.
```

A próxima aula será:

```text
352 - M13.42 - Projeto persistencia OS parte 2
```

Nela, você completará o projeto com:

- Técnico;
- associação de Técnico às Atividades;
- Pagamento;
- histórico de status;
- transições da Ordem;
- transições das Atividades;
- atualização por dirty checking;
- controle otimista;
- consultas operacionais;
- projections finais;
- operações bulk permitidas;
- regras de exclusão;
- fechamento transacional;
- suíte integrada final;
- documentação consolidada;
- validação completa do estado.

A parte 1 entregou uma fundação estável.

A parte 2 completará os fluxos de persistência e encerrará o projeto do M13.

---

# Material complementar

## Checkpoint final

- [ ] Criei o projeto integrado da parte 1.
- [ ] Modelei Cliente, Produto, Ordem e Atividade.
- [ ] Defini a Ordem como raiz do agregado.
- [ ] Implementei abertura transacional e leitura controlada.
- [ ] Testei tudo contra PostgreSQL real.

---

## Troubleshooting adicional

### Atividades nao foram inseridas

Revise cascade, helper bidirecional e transação.

### Cliente foi inserido junto com a Ordem

Existe cascade indevido no `ManyToOne`.

### Projection duplicou Ordens

Revise agrupamento e joins.

### Paginação retornou total incorreto

Revise `countQuery`.

### Hibernate iniciou antes das tabelas

Garanta Flyway antes do `EntityManagerFactory`.

---

## Perguntas de revisao

1. Qual é a raiz do agregado?
2. Atividade pertence ao lifecycle de quem?
3. Cliente recebe cascade?
4. Produto recebe cascade?
5. Por que usar LAZY?
6. Onde fica a transação?
7. O service retorna entidade?
8. Como a auditoria recebe o ator?
9. Quem cria o schema?
10. Quem valida o mapping?
11. Qual estado inicial da Ordem?
12. Qual estado inicial das Atividades?
13. Por que exigir ao menos uma Atividade?
14. Como evitar coleção inconsistente?
15. Qual consulta carrega o detalhe?
16. Por que não paginar com collection fetch?
17. Qual retorno usar na listagem?
18. Qual banco executa os testes?
19. O projeto terminou nesta aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. OrdemServico.
2. Da Ordem.
3. Não.
4. Não.
5. Para carregamento controlado.
6. No application service.
7. Não.
8. Por AuditScope e listener.
9. Flyway.
10. Hibernate validate.
11. ABERTA.
12. AGENDADAS.
13. Para manter o agregado válido.
14. Helper bidirecional e lista protegida.
15. `findDetailedById`.
16. Por multiplicação de linhas.
17. Projection.
18. PostgreSQL em Testcontainers.
19. Não.
20. Projeto persistencia OS parte 2.

---

## Desafio opcional

Crie:

```java
ProjetoOsParte1PolicyVerifier
```

Entrada:

```text
entidades;

repositories;

services;

migrations;

queries;

testes.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- exigir `@Version`;
- exigir auditoria;
- alertar cascade em to-one;
- exigir helper bidirecional;
- alertar collection fetch paginado;
- exigir service transacional;
- alertar entidade retornada pelo service;
- exigir Testcontainers;
- alertar Hibernate update;
- não iniciar Spring;
- possuir testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 351 - M13.41 - Projeto persistencia OS parte 1

- Iniciei o projeto integrado de persistência de OS.
- Mantive Java 21 e Spring sem Boot.
- Usei Spring Data JPA, Hibernate, Flyway e HikariCP.
- Usei PostgreSQL real com Testcontainers.
- Criei o schema `projeto_os_351`.
- Criei migrations V1 a V5.
- Criei uma view repeatable de resumo.
- Modelei `ClienteEntity`.
- Modelei `ProdutoEntity`.
- Modelei `OrdemServicoEntity`.
- Modelei `AtividadeEntity`.
- Persisti enums como STRING.
- Mantive auditoria com ator e Clock.
- Mantive `@Version` nas entidades.
- Usei factories e construtores protegidos.
- Evitei setters genéricos.
- Defini Ordem como raiz do agregado.
- Defini Atividade como filha da Ordem.
- Evitei cascade em Cliente e Produto.
- Usei cascade controlado para Atividades.
- Usei helper bidirecional.
- Protegi a coleção interna.
- Criei commands imutáveis.
- Exigi ao menos uma Atividade.
- Criei `OrdemServicoApplicationService`.
- Coloquei a transação no service.
- Busquei Cliente e Produto ativos.
- Abri Ordem no status ABERTA.
- Criei Atividades no status AGENDADA.
- Retornei result em vez de entidade.
- Mantive unique como defesa final.
- Criei consulta detalhada com fetch controlado.
- Evitei N+1.
- Criei projection de resumo.
- Criei paginação estável.
- Comparei JPQL projection com view nativa.
- Testei migrations e mappings.
- Testei abertura e rollback.
- Testei fetch, projection e paginação.
- Limpei fixtures na ordem correta.
- Não antecipei Técnico, Pagamento ou histórico.
- Próxima aula: Projeto persistencia OS parte 2.
```

---

## Referencia tecnica curta

```text
Ordem:
aggregate root.

Atividade:
child.

Cliente:
reference.

Produto:
reference.

Cascade:
somente child.

Service:
transação.

Result:
borda.

Projection:
lista.

Flyway:
schema.

Testcontainers:
integração real.
```

Regra final:

```text
a primeira parte do projeto de persistencia de Ordem de Servico deve estabelecer um agregado coerente, migrations versionadas, mappings auditaveis e versionados, cascade restrito ao lifecycle das Atividades, referencias LAZY para Cliente e Produto, caso de uso transacional na camada de aplicacao, leitura detalhada sem N mais um, projection paginada para listagem e testes de integracao contra PostgreSQL real.
```
