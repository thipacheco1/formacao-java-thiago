# 350 - M13.40 - Migrations integradas com persistencia

## Apresentacao da aula

Na aula 349, você executou repositories Spring Data contra um PostgreSQL real e descartável.

A suíte utilizou:

```text
Testcontainers;

PostgreSQLContainer;

Flyway;

Hibernate validate;

Spring TestContext;

Spring Data JPA;

constraints reais;

queries reais;

transações reais.
```

A migration `V1` criou um schema suficiente para iniciar a aplicação e executar os testes.

Entretanto, bancos de produção não permanecem na versão inicial.

O sistema evolui.

Novas necessidades aparecem:

```text
nova coluna;

novo índice;

nova constraint;

novo relacionamento;

correção de dados antigos;

view atualizada;

compatibilidade com duas versões da aplicação;

mudança gradual de contrato.
```

Uma aplicação pode ser recompilada e substituída.

Um banco contém dados acumulados e compartilhados.

Por isso, a evolução do schema exige uma disciplina diferente.

Nesta aula, você integrará migrations ao ciclo completo da persistência.

O laboratório terá uma cadeia real:

```text
V1:
criação inicial.

V2:
coluna opcional para referência externa.

V3:
expansão com prioridade anulável.

V4:
backfill dos dados existentes.

V5:
constraint, default e NOT NULL.

V6:
índices da consulta operacional.

R__:
view de resumo recriada quando o arquivo muda.
```

Também serão praticados:

- `flyway_schema_history`;
- `info`;
- `migrate`;
- `validate`;
- checksum;
- migration imutável;
- migration com falha;
- `repair` com critério;
- baseline explícito;
- callbacks;
- banco vazio;
- banco legado;
- compatibilidade da entidade com o schema final;
- Flyway antes do `EntityManagerFactory`;
- Hibernate em `validate`;
- testes de migration com Testcontainers;
- expand-and-contract;
- deploy gradual;
- rollback operacional;
- pipeline.

A regra principal será:

```text
migration aplicada não é editada.
```

Quando uma mudança nova é necessária:

```text
crie uma nova migration.
```

Editar uma migration já executada altera o checksum e quebra a rastreabilidade entre ambientes.

O laboratório continuará usando:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

JUnit 6.1.1;

Testcontainers 2.0.5;

PostgreSQL 17.6;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O banco descartável será criado pelo Testcontainers.

O database será:

```text
aula350_test
```

O schema principal será:

```text
jpa_350
```

Flyway continuará sendo o único dono do DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade final terá:

```text
codigo;

descricao;

status;

referenciaExterna;

prioridade;

versao;

auditoria.
```

O laboratório comprovará:

```text
banco vazio:
migra até a última versão.

banco na V2:
recebe dados legados;
migra até V6;
dados são preservados e backfilled.

schema history:
registra versões, descrição, checksum e sucesso.

repeatable:
cria view;
muda checksum;
é reaplicada quando o conteúdo muda.

validate:
detecta migration alterada.

repair:
não corrige SQL;
somente repara metadata em cenário autorizado.

baseline:
adota schema legado explicitamente.

Hibernate:
só inicia depois das migrations.

entidade final:
é compatível com o schema final.

estado final:
containers descartados.
```

A próxima aula será:

```text
351 - M13.41 - Projeto persistencia OS parte 1
```

Por isso, esta aula não iniciará a implementação completa do projeto de persistência de Ordem de Serviço.

Não serão construídos ainda:

- todos os agregados do projeto;
- fluxo completo de cadastro;
- API;
- controllers;
- regras finais de OS;
- projeto consolidado;
- integração de todas as tabelas oficiais.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
348:
Transacoes com Spring Data.

349:
Testes de Repository com Testcontainers.

350:
Migrations integradas com persistencia.

351:
Projeto persistencia OS parte 1.

352:
Projeto persistencia OS parte 2.
```

A aula 349 respondeu:

```text
como testar repositories
em PostgreSQL descartável?
```

A aula 350 responderá:

```text
como criar, evoluir e validar o schema
que esses repositories utilizam?
```

Nesta aula:

```text
versioned migrations:
sim.

repeatable migrations:
sim.

callbacks:
sim.

checksum:
sim.

validate:
sim.

repair:
sim, com limites.

baseline:
sim, explícito.

backfill:
sim.

expand-and-contract:
sim.

Testcontainers:
sim.

Hibernate validate:
sim.

projeto OS completo:
não.
```

A arquitetura será:

```text
container PostgreSQL
    -> DataSource
        -> Flyway
            -> V1, V2, V3, V4, V5, V6
            -> callbacks
            -> repeatable
                -> schema final
                    -> EntityManagerFactory
                        -> Hibernate validate
                            -> repositories.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-350-migrations-integradas-persistencia
```

Estrutura final:

```text
labs
└── m13
    └── aula-350-migrations-integradas-persistencia
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── docs
        │   ├── politica-migrations-imutaveis.md
        │   ├── fluxo-startup.md
        │   ├── backfill-e-constraints.md
        │   ├── baseline-e-repair.md
        │   ├── expand-and-contract.md
        │   ├── pipeline-migrations.md
        │   └── troubleshooting-migrations.md
        ├── scripts
        │   ├── 01_validar_docker.ps1
        │   ├── 02_executar_testes.ps1
        │   ├── 03_executar_migrations_local.ps1
        │   └── 04_inspecionar_schema_history.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula350
            │   │                       ├── audit
            │   │                       │   ├── AuditActor.java
            │   │                       │   ├── AuditContext.java
            │   │                       │   ├── AuditEntityListener.java
            │   │                       │   ├── AuditableEntity.java
            │   │                       │   └── AuditScope.java
            │   │                       ├── config
            │   │                       │   ├── PersistenceConfig.java
            │   │                       │   └── PersistenceSettings.java
            │   │                       ├── entity
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── projection
            │   │                       │   └── OrdemOperacionalView.java
            │   │                       └── repository
            │   │                           └── OrdemServicoRepository.java
            │   └── resources
            │       ├── db
            │       │   ├── callback
            │       │   │   ├── beforeMigrate__configurar_timeouts.sql
            │       │   │   └── afterMigrate__validar_schema.sql
            │       │   └── migration
            │       │       ├── V1__criar_schema_e_ordem.sql
            │       │       ├── V2__adicionar_referencia_externa.sql
            │       │       ├── V3__expandir_com_prioridade.sql
            │       │       ├── V4__backfill_prioridade.sql
            │       │       ├── V5__contrair_prioridade.sql
            │       │       ├── V6__criar_indices_operacionais.sql
            │       │       └── R__vw_ordem_operacional.sql
            │       └── META-INF
            │           └── persistence.xml
            └── test
                ├── java
                │   └── br
                │       └── com
                │           └── formacao
                │               └── m13
                │                   └── aula350
                │                       ├── AbstractMigrationContainerIT.java
                │                       ├── EmptyDatabaseMigrationIT.java
                │                       ├── LegacyUpgradeMigrationIT.java
                │                       ├── SchemaHistoryIT.java
                │                       ├── RepeatableMigrationIT.java
                │                       ├── ChecksumValidationIT.java
                │                       ├── FailedMigrationIT.java
                │                       ├── BaselineMigrationIT.java
                │                       ├── FlywayBeforeHibernateIT.java
                │                       ├── PersistenceCompatibilityIT.java
                │                       ├── MigrationArchitectureTest.java
                │                       └── MigrationTestSupport.java
                └── resources
                    └── db
                        ├── checksum
                        │   ├── original
                        │   └── changed
                        ├── failure
                        │   └── V99__migration_invalida.sql
                        └── baseline
                            └── migration
```

Resultados esperados:

```text
versão atual:
6.

repeatable:
sucesso registrado.

migration count:
6 versionadas.

base legada:
dados preservados.

prioridade:
preenchida e NOT NULL.

default:
NORMAL.

view:
consulta operacional disponível.

checksum alterado:
validate falha.

repair controlado:
metadata realinhada em database descartável.

baseline:
versão 1 registrada;
migrations posteriores aplicadas.

Hibernate:
inicia somente no schema final.

zero alteração manual:
fora das migrations.
```

---

## Conceito essencial

### Migration versionada

Uma migration versionada possui nome:

```text
V<versao>__<descricao>.sql
```

Exemplos:

```text
V1__criar_schema_e_ordem.sql;

V2__adicionar_referencia_externa.sql;

V3__expandir_com_prioridade.sql.
```

Cada versão é aplicada uma única vez por schema history.

A ordem é determinada pela versão, não pelo timestamp de modificação do arquivo.

---

### Nome e descricao

Use descrições curtas e objetivas.

O separador padrão é:

```text
dois underscores.
```

Evite nomes como:

```text
V4__ajustes.sql;

V5__correcao_final.sql;

V6__agora_vai.sql.
```

O nome precisa comunicar a intenção.

---

### Migration imutavel

Depois que uma migration foi aplicada em qualquer ambiente compartilhado, ela se torna um registro histórico.

Não altere:

- SQL;
- espaços relevantes para checksum;
- encoding;
- nome;
- versão;
- descrição.

Quando descobrir um problema, crie uma nova migration corretiva.

---

### flyway_schema_history

Flyway registra metadata como:

```text
installed_rank;

version;

description;

type;

script;

checksum;

installed_by;

installed_on;

execution_time;

success.
```

Essa tabela permite comparar o estado do banco com os arquivos da aplicação.

Ela não substitui backup nem histórico de negócio.

---

### Migrate

`migrate`:

1. lê migrations disponíveis;
2. consulta schema history;
3. ordena versões pendentes;
4. executa callbacks;
5. aplica migrations;
6. registra resultado;
7. executa repeatables pendentes.

Se não houver mudança, a operação deve ser idempotente no nível do Flyway:

```text
nenhuma versioned migration reaplicada.
```

---

### Info

`info` mostra:

- aplicadas;
- pendentes;
- baseline;
- repeatables;
- failed;
- future;
- missing.

Ele deve fazer parte do diagnóstico antes de executar ações corretivas.

---

### Validate

`validate` compara banco e classpath.

Pode detectar:

- checksum diferente;
- migration aplicada ausente;
- descrição incompatível;
- versão duplicada;
- migration resolvida não aplicada, conforme configuração;
- histórico inconsistente.

Validação deve falhar no pipeline quando existe divergência não autorizada.

---

### Checksum

O checksum representa o conteúdo da migration.

Cenário:

1. V3 foi aplicada;
2. alguém edita V3;
3. a aplicação executa validate;
4. checksum não coincide;
5. startup ou pipeline falha.

Essa falha protege a rastreabilidade.

Não responda automaticamente com `repair`.

Primeiro descubra por que o arquivo mudou.

---

### Repair

`repair` pode:

- realinhar checksums;
- descrições e tipos no schema history;
- remover entradas failed em situações compatíveis;
- corrigir metadata.

Ele não:

- corrige SQL;
- desfaz dados;
- recria constraint;
- restaura coluna;
- torna uma migration ruim segura;
- substitui backup.

Política:

```text
repair somente com causa conhecida,
aprovação e evidência.
```

No laboratório, será executado apenas em database descartável criado para o teste.

---

### Migration com falha

PostgreSQL suporta DDL transacional em muitos comandos.

Uma migration que falha pode ter suas alterações revertidas pela transação.

Ainda assim, sempre verifique:

- schema history;
- objetos parciais;
- tipo de comando;
- logs;
- suporte transacional;
- estado da conexão.

Não presuma rollback universal para qualquer banco ou qualquer operação.

---

### Repeatable migration

Nome:

```text
R__vw_ordem_operacional.sql
```

Não possui versão.

É reaplicada quando seu checksum muda.

É apropriada para objetos reconstruíveis, como:

- views;
- funções;
- procedures;
- grants;
- material de referência idempotente.

O script deve poder ser executado novamente.

Exemplo:

```sql
CREATE OR REPLACE VIEW ...
```

---

### Ordem das repeatables

Repeatables executam depois das versionadas pendentes.

Uma view pode depender das colunas criadas pelas versões.

Se duas repeatables dependem entre si, use nomes e desenho que deixem a ordem estável, ou prefira uma migration versionada quando a dependência for crítica.

---

### Callback

Callbacks executam em pontos do lifecycle do Flyway.

Exemplos:

```text
beforeMigrate;

beforeEachMigrate;

afterEachMigrate;

afterMigrate;

afterValidate.
```

O laboratório usará callbacks SQL para:

```text
configurar timeouts da sessão;

validar invariantes após migrate.
```

Callbacks não devem esconder a evolução principal do schema.

Uma coluna obrigatória deve aparecer em uma migration versionada, não em um callback obscuro.

---

### Timeouts operacionais

O callback `beforeMigrate` poderá executar:

```sql
SET lock_timeout = '5s';

SET statement_timeout = '30s';
```

Isso evita espera indefinida no laboratório.

Em produção, valores precisam refletir:

- tamanho das tabelas;
- janela de deploy;
- estratégia de lock;
- capacidade de retry;
- observabilidade.

---

### V1 criacao inicial

`V1` cria:

```text
schema;

sequence;

tabela ordem_servico;

primary key;

unique de codigo;

check de status;

versao;

auditoria.
```

O schema inicial não terá ainda:

```text
referencia_externa;

prioridade.
```

---

### V2 coluna opcional

`V2`:

```sql
ALTER TABLE jpa_350.ordem_servico
ADD COLUMN referencia_externa varchar(100);
```

A coluna é anulável.

Aplicações antigas que não conhecem o campo continuam gravando.

Essa é uma mudança de expansão.

---

### V3 expansao da prioridade

`V3` adiciona:

```sql
ALTER TABLE jpa_350.ordem_servico
ADD COLUMN prioridade varchar(20);
```

Ainda sem `NOT NULL`.

Isso evita exigir um valor que as linhas antigas não possuem.

---

### V4 backfill

`V4` preenche dados existentes:

```sql
UPDATE jpa_350.ordem_servico
SET prioridade =
    CASE
        WHEN status = 'ABERTA'
            THEN 'ALTA'
        WHEN status = 'AGENDADA'
            THEN 'NORMAL'
        ELSE 'BAIXA'
    END
WHERE prioridade IS NULL;
```

O `WHERE` torna o script mais seguro para reexecução controlada, embora migrations versionadas não sejam reaplicadas normalmente.

---

### Backfill grande

Em tabela grande, um único update pode:

- manter lock por muito tempo;
- gerar WAL elevado;
- aumentar réplica atrasada;
- disputar I/O;
- bloquear deploy;
- crescer tabela.

Estratégias possíveis:

- lotes;
- job assíncrono;
- migration separada;
- checkpoint;
- observabilidade;
- janela de manutenção.

O laboratório possui poucas linhas e usa update único.

---

### V5 contracao

Depois do backfill:

```sql
ALTER TABLE jpa_350.ordem_servico
ALTER COLUMN prioridade
SET DEFAULT 'NORMAL';

ALTER TABLE jpa_350.ordem_servico
ALTER COLUMN prioridade
SET NOT NULL;
```

Também crie:

```sql
CHECK (
    prioridade IN (
        'BAIXA',
        'NORMAL',
        'ALTA'
    )
)
```

A ordem é importante:

```text
adicionar;

preencher;

validar;

obrigar.
```

---

### Default e entidade

O default do banco protege inserts que omitem a coluna.

A entidade final deve definir a prioridade conscientemente.

Não use default como desculpa para esconder uma regra de domínio.

---

### V6 indices

Crie índices para consultas conhecidas:

```sql
CREATE INDEX idx_jpa_350_ordem_status_created
    ON jpa_350.ordem_servico (
        status,
        created_at DESC,
        id DESC
    );

CREATE INDEX idx_jpa_350_ordem_prioridade
    ON jpa_350.ordem_servico (
        prioridade
    );
```

Índice é parte do schema e precisa de migration.

---

### CREATE INDEX CONCURRENTLY

No PostgreSQL, `CREATE INDEX CONCURRENTLY` reduz certos bloqueios, mas não pode executar dentro de uma transaction block comum.

Isso exige tratamento específico no Flyway e planejamento operacional.

O laboratório não usará `CONCURRENTLY`.

Ele será documentado como opção para tabelas grandes.

---

### Banco vazio

Teste:

1. inicia PostgreSQL vazio;
2. configura Flyway;
3. executa migrate;
4. valida versão 6;
5. consulta view;
6. executa validate;
7. executa migrate novamente;
8. confirma ausência de novas versionadas.

Esse é o caminho de instalação nova.

---

### Banco legado

Teste:

1. migra somente até V2;
2. insere linhas antigas;
3. confirma ausência de prioridade;
4. migra até latest;
5. verifica backfill;
6. verifica NOT NULL;
7. verifica check;
8. confirma preservação dos IDs e códigos.

Esse é o caminho de atualização.

---

### Target

Flyway pode migrar até uma versão alvo:

```java
.target(
        MigrationVersion.fromVersion(
                "2"
        )
)
```

Isso será usado apenas para preparar a base legada do teste.

A aplicação normal migra até latest.

---

### Baseline

Baseline serve para adotar um schema existente que não possui schema history.

Fluxo explícito:

1. inspecionar schema legado;
2. confirmar qual versão ele representa;
3. executar baseline nessa versão;
4. manter migration anterior disponível para instalações novas;
5. aplicar somente versões posteriores no schema adotado.

Não habilite `baselineOnMigrate` por conveniência sem entender o banco.

---

### Baseline nao executa V1

Se o schema é baselineado na versão 1, Flyway registra que V1 já está representada.

Ele não executa V1 naquele schema.

Por isso, a estrutura legada precisa realmente equivaler ao contrato de V1.

---

### Expand-and-contract

Mudanças incompatíveis devem ser divididas.

Exemplo de renomear `descricao` para `detalhes`:

#### Expandir

- adicionar `detalhes` anulável;
- manter `descricao`;
- publicar aplicação que lê fallback;
- dual-write.

#### Migrar

- backfill;
- monitorar linhas divergentes.

#### Contrair

- tornar `detalhes` obrigatório;
- publicar aplicação que não usa `descricao`;
- remover `descricao` em migration futura.

Nunca faça add, copy e drop em um único deploy se versões antigas ainda podem executar.

---

### Compatibilidade entre versoes

Durante rolling deployment, duas versões podem compartilhar o banco.

Migration e aplicação precisam considerar:

```text
versão antiga ainda ativa;

versão nova iniciando;

mensagens atrasadas;

jobs antigos;

rollback de aplicação.
```

Mudanças aditivas são mais seguras no início.

---

### Flyway antes do Hibernate

Ordem obrigatória:

```text
DataSource;

Flyway migrate;

EntityManagerFactory;

Hibernate validate;

repositories.
```

Se Hibernate iniciar primeiro, ele poderá falhar por coluna ausente.

Não use:

```text
hibernate.hbm2ddl.auto=update.
```

Isso criaria dois donos do schema.

---

### Validation do Hibernate

Flyway confirma:

```text
histórico de migrations.
```

Hibernate validate confirma:

```text
mapping compatível com schema atual.
```

As duas validações são complementares.

---

### Rollback operacional

Migrations de banco nem sempre possuem rollback simples.

Estratégias:

- forward-fix;
- backup e restore;
- feature flag;
- compatibilidade retroativa;
- deployment rollback sem schema rollback;
- script corretivo aprovado;
- snapshot antes de mudança destrutiva.

Não apague migration do histórico para “voltar”.

---

### Dados de referencia

Dados técnicos estáveis podem ser inseridos por migration.

Dados de negócio mutáveis normalmente precisam de outro processo.

Evite que uma repeatable sobrescreva decisões de usuários.

---

### Pipeline

Uma sequência profissional:

```text
compilar;

testes unitários;

subir PostgreSQL Testcontainers;

migrate do zero;

validate;

testar upgrade legado;

iniciar Hibernate validate;

testar repositories;

empacotar;

executar migration controlada no ambiente;

iniciar nova aplicação;

smoke tests.
```

O ambiente de produção deve impedir duas estratégias concorrentes executando DDL sem coordenação.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\java\br\com\formacao\m13\aula350\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\java\br\com\formacao\m13\aula350\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\java\br\com\formacao\m13\aula350\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\java\br\com\formacao\m13\aula350\projection"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\java\br\com\formacao\m13\aula350\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\resources\db\callback"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\test\java\br\com\formacao\m13\aula350"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\test\resources\db\checksum\original"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\test\resources\db\checksum\changed"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-350-migrations-integradas-persistencia\src\test\resources\db\failure"

Set-Location `
  "labs\m13\aula-350-migrations-integradas-persistencia"
```

---

### 2. Criar pom.xml

Reutilize a stack da aula 349.

Mantenha:

```text
JUnit 6.1.1;

Testcontainers 2.0.5;

Flyway 12.5.0;

PostgreSQL 17.6.
```

Inclua:

```text
flyway-core;

flyway-database-postgresql;

spring-context;

spring-orm;

spring-data-jpa;

testcontainers-postgresql;

testcontainers-junit-jupiter.
```

Não adicione Spring Boot ou H2.

---

### 3. Criar V1

Arquivo:

```text
V1__criar_schema_e_ordem.sql
```

Crie:

- schema;
- sequence;
- tabela;
- primary key;
- unique;
- check de status;
- versão;
- auditoria.

Status permitidos:

```text
ABERTA;

AGENDADA;

CONCLUIDA;

CANCELADA.
```

---

### 4. Criar V2

Arquivo:

```text
V2__adicionar_referencia_externa.sql
```

SQL:

```sql
ALTER TABLE jpa_350.ordem_servico
ADD COLUMN referencia_externa varchar(100);
```

Crie índice parcial somente se houver caso de consulta comprovado.

No laboratório, não será necessário.

---

### 5. Criar V3

Arquivo:

```text
V3__expandir_com_prioridade.sql
```

SQL:

```sql
ALTER TABLE jpa_350.ordem_servico
ADD COLUMN prioridade varchar(20);
```

Não defina `NOT NULL` ainda.

---

### 6. Criar V4

Arquivo:

```text
V4__backfill_prioridade.sql
```

Use `CASE` por status.

Depois confirme:

```sql
SELECT count(*)
FROM jpa_350.ordem_servico
WHERE prioridade IS NULL;
```

O resultado esperado após V4 é zero.

---

### 7. Criar V5

Arquivo:

```text
V5__contrair_prioridade.sql
```

Adicione:

- check de valores;
- default `NORMAL`;
- `NOT NULL`.

Antes do `NOT NULL`, use um bloco de validação que falhe se ainda existir nulo.

---

### 8. Criar V6

Arquivo:

```text
V6__criar_indices_operacionais.sql
```

Crie índices:

```text
status + created_at + id;

prioridade.
```

Use nomes explícitos e únicos no schema.

---

### 9. Criar repeatable

Arquivo:

```text
R__vw_ordem_operacional.sql
```

Crie ou substitua view com:

```text
id;

codigo;

status;

prioridade;

referencia_externa;

created_at;

updated_at.
```

A view deve ser consultável por uma projection Spring Data ou JDBC.

---

### 10. Criar callbacks

`beforeMigrate__configurar_timeouts.sql`:

```sql
SET lock_timeout = '5s';
SET statement_timeout = '30s';
```

`afterMigrate__validar_schema.sql` verifica:

```text
zero prioridade nula;

view existente.
```

Se a validação falhar, o migrate deve falhar.

---

### 11. Configurar locations

Flyway:

```java
.locations(
        "classpath:db/migration",
        "classpath:db/callback"
)
.schemas(
        "jpa_350"
)
.defaultSchema(
        "jpa_350"
)
```

Mantenha schema history no schema principal.

---

### 12. Criar OrdemServicoEntity.java

Mapeie o schema final.

Campos:

```text
referenciaExterna;

prioridade.
```

`prioridade` não pode ser nula na entidade final.

Mantenha:

```text
@Version;

auditoria.
```

Hibernate deve iniciar apenas depois de V6 e repeatable.

---

### 13. Criar OrdemOperacionalView.java

Interface projection:

```java
public interface OrdemOperacionalView {

    Long getId();

    String getCodigo();

    String getStatus();

    String getPrioridade();

    String getReferenciaExterna();

    Instant getCreatedAt();

    Instant getUpdatedAt();
}
```

O repository poderá usar native query sobre a view apenas para provar integração.

---

### 14. Criar base Testcontainers

Use a mesma imagem:

```text
postgres:17.6-alpine.
```

Cada teste de cenário destrutivo pode criar seu próprio schema dentro do mesmo container.

Para checksum e baseline, prefira databases ou schemas isolados para não corromper a suíte principal.

---

### 15. Criar MigrationTestSupport.java

Forneça métodos:

```java
Flyway flyway(
        String schema,
        String... locations
)

void createLegacySchema(
        String schema
)

List<Map<String, Object>>
history(
        String schema
)

boolean columnIsNullable(
        String schema,
        String table,
        String column
)
```

Não esconda assertions importantes em helpers genéricos demais.

---

### 16. Criar EmptyDatabaseMigrationIT.java

Fluxo:

1. criar schema vazio;
2. executar `info`;
3. confirmar seis pendentes;
4. executar migrate;
5. confirmar versão 6;
6. executar validate;
7. consultar view;
8. executar migrate novamente;
9. confirmar zero versionadas novas.

---

### 17. Criar LegacyUpgradeMigrationIT.java

Fluxo:

1. migrar até V2;
2. inserir três Ordens legadas;
3. confirmar coluna prioridade ausente;
4. migrar até latest;
5. confirmar prioridade preenchida;
6. confirmar `NOT NULL`;
7. confirmar default;
8. confirmar check;
9. confirmar IDs e códigos preservados;
10. confirmar view.

Use status diferentes para validar o `CASE`.

---

### 18. Criar SchemaHistoryIT.java

Consulte:

```sql
SELECT
    installed_rank,
    version,
    description,
    type,
    script,
    checksum,
    success
FROM jpa_350.flyway_schema_history
ORDER BY installed_rank;
```

Confirme:

- V1 a V6;
- repeatable;
- checksums;
- success;
- ordem;
- nenhuma duplicidade.

---

### 19. Criar RepeatableMigrationIT.java

Use locations de filesystem temporário.

Fluxo:

1. copie V1 a V6 e repeatable versão A;
2. migrate;
3. guarde installed rank da repeatable;
4. altere somente a view em versão B;
5. migrate novamente;
6. confirme nova execução da repeatable;
7. confirme versionadas não reaplicadas;
8. confirme view atualizada.

---

### 20. Criar ChecksumValidationIT.java

Fluxo:

1. migre com migration original;
2. troque a location para versão modificada da mesma V1;
3. execute validate;
4. espere falha de checksum;
5. não execute migrate;
6. confirme banco inalterado.

O teste não altera arquivos da aplicação.

Ele usa cópias isoladas em diretório temporário.

---

### 21. Demonstrar repair controlado

No mesmo database descartável:

1. confirme causa conhecida;
2. execute repair;
3. execute validate;
4. confirme metadata realinhada;
5. registre que o SQL já aplicado não foi reexecutado;
6. destrua o schema.

Esse cenário ensina o efeito, não recomenda repair automático.

---

### 22. Criar FailedMigrationIT.java

Use location adicional com:

```text
V99__migration_invalida.sql.
```

O SQL referencia coluna inexistente.

Confirme:

- migrate falha;
- causa preservada;
- objetos anteriores continuam;
- schema history é inspecionada;
- aplicação não inicia;
- corrigir exige nova análise, não `repair` cego.

---

### 23. Criar BaselineMigrationIT.java

Fluxo:

1. crie manualmente estrutura equivalente à V1;
2. confirme ausência de schema history;
3. configure baseline version 1;
4. execute baseline;
5. migre V2 a V6;
6. confirme estrutura final;
7. confirme V1 não executada;
8. confirme registro BASELINE.

Não use `baselineOnMigrate`.

---

### 24. Criar FlywayBeforeHibernateIT.java

Configuração correta:

```text
Flyway bean initMethod migrate;

EntityManagerFactory DependsOn flyway.
```

Confirme contexto iniciado.

Crie configuração quebrada sem dependência e database vazio.

Confirme que Hibernate validate falha antes da migration ou que a ordem incorreta é detectada.

Isole o contexto quebrado.

---

### 25. Criar PersistenceCompatibilityIT.java

Depois de latest:

1. inicie Spring;
2. obtenha repository;
3. abra `AuditScope`;
4. persista Ordem com prioridade;
5. consulte;
6. atualize;
7. confirme auditoria e versão;
8. consulte view.

Esse teste conecta migration e persistência.

---

### 26. Criar MigrationArchitectureTest.java

Valide:

- arquivos V1 a V6 existem;
- versões não duplicadas;
- descrições objetivas;
- repeatable usa `CREATE OR REPLACE`;
- V3 não adiciona NOT NULL;
- V4 possui backfill;
- V5 contrai depois do backfill;
- Hibernate usa validate;
- não existe `hbm2ddl.auto=update`;
- factory depende de Flyway;
- baselineOnMigrate está desabilitado;
- migrations não estão em test resources duplicadas;
- ponte aponta para aula 351.

---

### 27. Criar scripts

`01_validar_docker.ps1`:

```powershell
docker version
docker info
```

`02_executar_testes.ps1`:

```powershell
mvn clean verify
```

`03_executar_migrations_local.ps1` deve exigir URL, usuário, senha e confirmação do ambiente antes de executar:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

`04_inspecionar_schema_history.ps1` consulta o histórico sem alterar o banco.

Não inclua `repair` em script de uso cotidiano.

---

### 28. Executar o laboratorio

```powershell
.\scripts\01_validar_docker.ps1
.\scripts\02_executar_testes.ps1
```

Confirme:

```text
banco vazio;

upgrade legado;

schema history;

repeatable;

checksum;

repair isolado;

migration inválida;

baseline;

ordem Flyway/Hibernate;

compatibilidade da entidade;

containers removidos.
```

---

### 29. Criar documentacao

`politica-migrations-imutaveis.md` deve declarar que migrations aplicadas não são editadas.

`fluxo-startup.md` deve desenhar DataSource, Flyway, validate e repositories.

`backfill-e-constraints.md` deve registrar expandir, preencher, validar e obrigar.

`baseline-e-repair.md` deve explicar pré-condições, aprovações e riscos.

`expand-and-contract.md` deve detalhar deploys compatíveis.

`pipeline-migrations.md` deve registrar teste do zero, upgrade, validate e deploy.

`troubleshooting-migrations.md` deve cobrir checksum, failed, missing, future, lock, timeout, schema, callbacks e Hibernate antes do Flyway.

---

## Entendendo o que foi feito

### O schema passou a ter historia

Cada versão ficou registrada e validável.

### A mudança obrigatoria foi dividida

A coluna foi adicionada, preenchida e somente depois tornou-se obrigatória.

### Instalação e upgrade foram testados

Banco vazio e base legada chegaram ao mesmo schema final.

### Flyway e Hibernate receberam papeis diferentes

Flyway criou e evoluiu; Hibernate validou o mapping.

### A operacao ganhou criterios de seguranca

Baseline, repair e rollback deixaram de ser comandos automáticos.

---

## Erros comuns importantes

### Editar migration aplicada

Isso quebra checksum e rastreabilidade.

### Adicionar NOT NULL antes do backfill

Linhas antigas tornam a migration inviável.

### Usar repair para esconder problema

Repair altera metadata, não corrige o banco.

### Iniciar Hibernate antes do Flyway

O mapping pode validar contra schema antigo.

### Remover coluna no mesmo deploy da expansao

Aplicações antigas podem continuar usando o contrato anterior.

---

## Comandos uteis

### Testes

```powershell
mvn clean verify
```

### Flyway

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

### Schema history

```sql
SELECT
    installed_rank,
    version,
    description,
    type,
    script,
    checksum,
    success
FROM jpa_350.flyway_schema_history
ORDER BY installed_rank;
```

### Colunas

```sql
SELECT
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'jpa_350'
  AND table_name = 'ordem_servico'
ORDER BY ordinal_position;
```

---

## Exercicio guiado

### Parte 1 — Nova prioridade

Adicione uma prioridade `CRITICA` em nova migration V7.

Não edite V5.

### Parte 2 — Backfill em lotes

Desenhe um backfill para um milhão de linhas.

Defina lote, checkpoint e observabilidade.

### Parte 3 — Repeatable

Adicione coluna calculada à view.

Confirme reaplicação sem reaplicar V1 a V6.

### Parte 4 — Checksum

Altere uma cópia isolada de V2.

Confirme validate e restaure.

### Parte 5 — Baseline

Crie schema legado incompatível com V1.

Confirme que baseline não torna a estrutura correta automaticamente.

### Parte 6 — Expand-and-contract

Desenhe três deploys para renomear `descricao`.

### Parte 7 — Índice concorrente

Pesquise o requisito transacional do PostgreSQL e desenhe a execução sem implementar no fluxo oficial.

### Parte 8 — ADR

Registre:

```text
Flyway é dono do DDL;

migrations aplicadas são imutáveis;

banco vazio e upgrade são testados;

backfill precede constraint;

repeatable somente para objeto reconstruível;

repair exige aprovação;

baseline é explícito;

expand-and-contract em mudança incompatível;

Hibernate usa validate.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 350 existe;
- continuidade com a aula 349 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- JUnit 6.1.1 foi mantido;
- Testcontainers 2.0.5 foi mantido;
- PostgreSQL real foi usado;
- Spring Boot não foi usado;
- H2 não foi usado;
- Flyway 12.5.0 foi mantido;
- Flyway permaneceu dono do DDL;
- Hibernate permaneceu em validate;
- database descartável foi criado;
- schema `jpa_350` foi criado;
- V1 foi criada;
- V2 foi criada;
- V3 foi criada;
- V4 foi criada;
- V5 foi criada;
- V6 foi criada;
- versões não foram duplicadas;
- nomes usam dois underscores;
- descrições são objetivas;
- migration aplicada foi tratada como imutável;
- nova correção exige nova migration;
- schema history foi explicado;
- installed rank foi validado;
- version foi validada;
- description foi validada;
- script foi validado;
- checksum foi validado;
- success foi validado;
- `info` foi usado;
- `migrate` foi usado;
- `validate` foi usado;
- migrate repetido foi idempotente;
- checksum alterado falhou;
- banco permaneceu inalterado após validate;
- repair foi explicado;
- repair não foi tratado como correção de SQL;
- repair foi executado somente em database descartável;
- causa foi conhecida antes do repair;
- migration com falha foi testada;
- PostgreSQL transacional foi discutido;
- rollback universal não foi presumido;
- repeatable foi criada;
- repeatable não possui versão;
- repeatable usa objeto reconstruível;
- repeatable foi reaplicada após mudança;
- versionadas não foram reaplicadas;
- callbacks foram usados;
- callback configurou timeouts;
- callback validou invariantes;
- callback não escondeu DDL principal;
- V1 criou schema base;
- V2 adicionou coluna anulável;
- V3 expandiu prioridade anulável;
- V4 realizou backfill;
- V4 filtrou linhas nulas;
- V5 validou antes de obrigar;
- V5 adicionou default;
- V5 adicionou NOT NULL;
- V5 adicionou check;
- V6 criou índices;
- índice composto foi criado;
- índice de prioridade foi criado;
- `CONCURRENTLY` foi discutido sem implementação;
- banco vazio migrou até latest;
- banco legado foi migrado até latest;
- dados legados foram preservados;
- IDs legados foram preservados;
- prioridades foram preenchidas;
- target foi usado somente em teste;
- baseline foi praticado;
- baseline foi explícito;
- baselineOnMigrate não foi usado;
- schema legado equivalia à V1;
- V1 não foi reexecutada após baseline;
- versões posteriores foram aplicadas;
- BASELINE apareceu no histórico;
- expand-and-contract foi explicado;
- expansão foi separada da contração;
- dual-read e dual-write foram discutidos;
- rolling deployment foi considerado;
- aplicação antiga foi considerada;
- mudança destrutiva não ocorreu no mesmo deploy;
- Flyway executou antes do Hibernate;
- factory dependeu de Flyway;
- Hibernate validou schema final;
- `hbm2ddl.auto=update` não foi usado;
- entidade final mapeou prioridade;
- entidade final mapeou referência externa;
- auditoria foi preservada;
- versão foi preservada;
- repository funcionou após latest;
- view foi consultada;
- rollback operacional foi discutido;
- forward-fix foi discutido;
- backup e restore foram discutidos;
- migration não foi apagada para voltar;
- dados de referência foram diferenciados de negócio;
- pipeline foi documentado;
- teste do zero foi criado;
- teste de upgrade foi criado;
- teste de history foi criado;
- teste repeatable foi criado;
- teste checksum foi criado;
- teste failure foi criado;
- teste baseline foi criado;
- teste Flyway/Hibernate foi criado;
- teste de compatibilidade foi criado;
- teste de arquitetura foi criado;
- scripts não automatizaram repair;
- Docker foi validado;
- containers foram encerrados;
- projeto OS completo não foi antecipado;
- ponte para a aula 351 está correta;
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
  labs/m13/aula-350-migrations-integradas-persistencia
```

Commit recomendado:

```powershell
git commit -m "feat(m13): integrar migrations ao ciclo de persistencia"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou migrations em parte testável da arquitetura de persistência.

Aprendeu:

```text
versioned:
executa uma vez.

repeatable:
reexecuta quando checksum muda.

schema history:
registra o estado.

validate:
detecta divergência.

repair:
corrige metadata com critério.

baseline:
adota schema existente.

backfill:
prepara dados antigos.

expand-and-contract:
mantém compatibilidade.

Hibernate validate:
confere mapping final.
```

O laboratório comprovou:

```text
instalação do zero;

upgrade de V2;

dados preservados;

prioridade preenchida;

constraint aplicada;

índices;

view repeatable;

checksum inválido;

repair isolado;

migration falha;

baseline;

Flyway antes do Hibernate;

repository compatível.
```

A decisão arquitetural foi:

```text
Flyway:
único dono do schema.

migration aplicada:
imutável.

mudança obrigatória:
expandir, preencher, contrair.

ambiente:
testar zero e upgrade.

repair:
excepcional.

baseline:
explícito.

deploy:
compatível com versões coexistentes.
```

A próxima aula será:

```text
351 - M13.41 - Projeto persistencia OS parte 1
```

Nela, você iniciará a integração dos conhecimentos do módulo em um projeto de persistência de Ordem de Serviço.

Serão definidos:

- escopo do projeto;
- arquitetura de pacotes;
- schema do projeto;
- migrations iniciais;
- entidades principais;
- value objects persistidos;
- relacionamentos;
- repositories;
- casos de uso da primeira parte;
- transações;
- auditoria;
- versionamento;
- fixtures;
- Testcontainers;
- critérios de aceite da parte 1.

A aula 350 consolidou a evolução segura do banco.

A aula 351 começará a aplicação integrada desses fundamentos no projeto de persistência de OS.

---

# Material complementar

## Checkpoint final

- [ ] Criei seis migrations versionadas imutáveis.
- [ ] Testei instalação do zero e upgrade legado.
- [ ] Usei backfill antes de NOT NULL.
- [ ] Pratiquei repeatable, checksum, baseline e repair controlado.
- [ ] Garanti Flyway antes do Hibernate validate.

---

## Troubleshooting adicional

### Validate acusa checksum

Descubra por que a migration aplicada foi alterada.

### Hibernate acusa coluna ausente

Confirme que Flyway executou antes da factory.

### Backfill deixa nulos

Revise filtro, valores inesperados e validação anterior ao NOT NULL.

### Repeatable nao reaplicou

O checksum não mudou ou a location está incorreta.

### Baseline pulou migration

Baseline registra a versão como já representada.

---

## Perguntas de revisao

1. O que é migration versionada?
2. O que é repeatable?
3. Migration aplicada pode ser editada?
4. Para que serve schema history?
5. O que validate compara?
6. O que checksum protege?
7. Repair corrige SQL?
8. O que baseline faz?
9. Baseline executa V1?
10. Por que V3 é anulável?
11. Quando ocorre o backfill?
12. Quando aplicar NOT NULL?
13. Para que servem callbacks?
14. O que faz target?
15. Por que testar banco legado?
16. Quem cria o schema?
17. Quem valida o mapping?
18. O que é expand-and-contract?
19. Como voltar de migration destrutiva?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Script executado uma vez por versão.
2. Script reaplicado quando muda.
3. Não.
4. Registrar migrations.
5. Banco e arquivos.
6. Imutabilidade do conteúdo.
7. Não.
8. Adota schema existente.
9. Não, se baselineado em 1.
10. Para compatibilidade e backfill.
11. Antes da constraint.
12. Depois de validar dados.
13. Ações do lifecycle.
14. Limita a versão.
15. Para provar upgrade.
16. Flyway.
17. Hibernate validate.
18. Evolução em fases compatíveis.
19. Forward-fix ou estratégia operacional.
20. Projeto persistencia OS parte 1.

---

## Desafio opcional

Crie:

```java
MigrationPolicyVerifier
```

Entrada:

```text
diretório de migrations;

schema history exportada;

mapping final;

configuração Flyway.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- detectar versão duplicada;
- detectar nome inválido;
- alertar migration aplicada alterada;
- alertar `NOT NULL` sem backfill anterior;
- alertar drop sem fase de expansão;
- alertar baselineOnMigrate;
- alertar Hibernate update;
- alertar repair automatizado;
- não conectar ao banco;
- possuir testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 350 - M13.40 - Migrations integradas com persistencia

- Integrei migrations ao ciclo de persistência.
- Criei migrations V1 a V6.
- Entendi versioned migrations.
- Entendi repeatable migrations.
- Mantive migrations aplicadas imutáveis.
- Usei `flyway_schema_history`.
- Inspecionei versão, descrição, checksum e sucesso.
- Usei `info`.
- Usei `migrate`.
- Usei `validate`.
- Reproduzi erro de checksum.
- Entendi que `repair` não corrige SQL.
- Executei repair somente em banco descartável.
- Testei uma migration inválida.
- Considerei DDL transacional do PostgreSQL.
- Criei callbacks de migrate.
- Configurei timeouts operacionais.
- Criei uma view repeatable.
- Adicionei referência externa de forma compatível.
- Expandi prioridade como anulável.
- Realizei backfill.
- Apliquei default, check e NOT NULL depois.
- Criei índices operacionais.
- Discuti `CREATE INDEX CONCURRENTLY`.
- Testei instalação do zero.
- Testei upgrade de uma base na V2.
- Preservei dados e IDs legados.
- Usei target somente para preparar teste.
- Pratiquei baseline explícito.
- Evitei baselineOnMigrate.
- Entendi expand-and-contract.
- Considerei rolling deployment.
- Mantive Flyway antes do Hibernate.
- Mantive Hibernate em `validate`.
- Evitei `hbm2ddl.auto=update`.
- Testei a entidade contra o schema final.
- Consultei a view operacional.
- Documentei forward-fix, backup e restore.
- Integrei migrations ao pipeline.
- Não iniciei o projeto completo de OS.
- Próxima aula: Projeto persistencia OS parte 1.
```

---

## Referencia tecnica curta

```text
V:
uma vez.

R:
quando muda.

History:
estado aplicado.

Checksum:
imutabilidade.

Validate:
consistência.

Repair:
metadata.

Baseline:
adoção.

Backfill:
dados antigos.

Expand:
compatibilidade.

Contract:
remoção posterior.
```

Regra final:

```text
migrations integradas com persistencia devem ser imutaveis, testadas tanto em banco vazio quanto em upgrade legado e executadas antes do Hibernate validate; mudancas obrigatorias precisam separar expansao, backfill e contracao, enquanto checksum, baseline, repeatables, callbacks, repair e rollback operacional exigem politicas explicitas e nunca podem ser usados para esconder divergencias de schema.
```
