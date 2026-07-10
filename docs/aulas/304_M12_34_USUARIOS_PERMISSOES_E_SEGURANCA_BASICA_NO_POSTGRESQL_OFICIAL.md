# 304 - M12.34 - Usuarios permissoes e seguranca basica no PostgreSQL

## Apresentacao da aula

Na aula 303, você praticou backup e restore lógico com `pg_dump`, `psql` e `pg_restore`.

Durante aquela prática, apareceram conceitos como:

```text
usuário que executa o dump;
owner dos objetos;
privilégios;
roles globais;
grants;
restauração com --no-owner;
restauração com --no-privileges.
```

Agora esses conceitos serão estudados diretamente.

Uma aplicação backend não deve acessar o PostgreSQL como superusuário.

Também não deve usar a mesma credencial para:

```text
executar migrations;
atender requisições;
produzir relatórios;
administrar o cluster;
realizar backup.
```

Essas atividades possuem necessidades diferentes.

Quando todas compartilham uma conta poderosa, qualquer falha da aplicação pode adquirir alcance muito maior:

- criar ou remover tabelas;
- alterar constraints;
- conceder acesso;
- ler dados fora do domínio;
- apagar schemas;
- criar extensões;
- encerrar sessões;
- contornar políticas de segurança.

Nesta aula, você vai construir uma separação básica de responsabilidades usando roles do PostgreSQL.

O laboratório criará:

```text
a304_owner:
role sem login que possui os objetos.

a304_app_rw:
role de grupo para leitura e escrita da aplicação.

a304_app_ro:
role de grupo somente leitura.

a304_runtime:
login da aplicação, membro de a304_app_rw.

a304_reader:
login de consulta, membro de a304_app_ro.

a304_migrator:
login de migration que precisa executar SET ROLE a304_owner.
```

O ambiente será completamente isolado:

```text
database:
formacao_java_a304.

schema:
seguranca_aula_304.
```

O database oficial `formacao_java` e o schema `projeto_os` não serão alterados.

Você vai praticar:

- `CREATE ROLE`;
- `LOGIN` e `NOLOGIN`;
- roles de grupo;
- associação entre roles;
- `GRANT`;
- `REVOKE`;
- `CONNECT`;
- `USAGE`;
- privilégios de tabela;
- privilégios de sequence;
- ownership;
- `SET ROLE`;
- `RESET ROLE`;
- `session_user`;
- `current_user`;
- `ALTER DEFAULT PRIVILEGES`;
- inspeção de privilégios;
- conexões reais com cada login;
- menor privilégio;
- limpeza segura das roles.

As senhas locais não serão gravadas nos scripts SQL versionados.

Um arquivo local ignorado pelo Git fornecerá as credenciais ao laboratório.

Ao final, todas as roles e o database da aula serão removidos.

A próxima aula será:

```text
305 - M12.35 - Funcoes window introducao para relatorios
```

Portanto, esta aula não antecipará `row_number`, `rank`, `lag`, `lead` ou agregações por janela.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
302:
carga de massa, seed e dados de teste.

303:
backup, restore e cuidados locais.

304:
usuários, permissões e segurança básica.

305:
funções window para relatórios.

306:
JSONB no PostgreSQL.
```

Você já construiu:

```text
schemas;
tabelas;
views;
sequences;
índices;
migrations;
backups;
restores.
```

Agora precisa controlar:

```text
quem conecta;

quem enxerga o schema;

quem consulta;

quem modifica linhas;

quem cria objetos;

quem é proprietário;

quem pode assumir outra role.
```

A segurança do banco não é uma camada separada do design.

Ela precisa acompanhar:

- modelagem;
- migrations;
- deploy;
- backup;
- aplicação;
- observabilidade;
- resposta a incidentes.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-304-usuarios-permissoes-seguranca-postgresql
```

Estrutura final:

```text
labs
└── m12
    └── aula-304-usuarios-permissoes-seguranca-postgresql
        ├── README.md
        ├── .gitignore
        ├── config
        │   └── roles.local.env.example
        ├── docs
        │   ├── matriz-acessos.md
        │   ├── politica-credenciais.md
        │   └── revisao-menor-privilegio.md
        ├── scripts
        │   ├── 01_preparar_ambiente.ps1
        │   ├── 02_testar_runtime.ps1
        │   ├── 03_testar_reader.ps1
        │   ├── 04_testar_migrator.ps1
        │   └── 05_limpar_ambiente.ps1
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_criar_roles.sql
            ├── 02_configurar_database.sql
            ├── 03_criar_modelo_com_owner.sql
            ├── 04_conceder_privilegios.sql
            ├── 05_inspecionar_roles_e_privilegios.sql
            ├── 06_teste_runtime.sql
            ├── 07_teste_reader.sql
            ├── 08_teste_migrator.sql
            ├── 09_validar_default_privileges.sql
            ├── 10_revoke_controlado.sql
            ├── 11_exercicio.sql
            └── 12_checkpoint_final.sql
```

Modelo do laboratório:

```text
seguranca_aula_304.cliente;

seguranca_aula_304.ordem_servico;

seguranca_aula_304.vw_ordem_resumo;

seguranca_aula_304.auditoria_evento.
```

A tabela `auditoria_evento` será criada depois dos default privileges para demonstrar sua aplicação sobre objetos futuros.

---

## Conceito essencial

### PostgreSQL usa roles

No PostgreSQL, os antigos conceitos de usuário e grupo são representados por roles.

Uma role pode:

- possuir objetos;
- receber privilégios;
- ser membro de outra role;
- permitir login;
- não permitir login.

Exemplo de login:

```sql
CREATE ROLE aplicacao LOGIN;
```

Exemplo de grupo:

```sql
CREATE ROLE leitura NOLOGIN;
```

`CREATE USER` é um alias para `CREATE ROLE` com `LOGIN` implícito.

Nesta formação, usaremos `CREATE ROLE` para deixar o atributo visível.

---

### Role existe no cluster

Roles não pertencem apenas a um database.

Elas existem no cluster PostgreSQL.

Por isso:

```text
criar a304_runtime em um database
```

torna essa role conhecida pelos demais databases do mesmo cluster.

Entretanto, os privilégios sobre schemas, tabelas e sequences são concedidos em cada database.

A limpeza precisa remover primeiro os objetos e databases dependentes e, depois, as roles.

---

### LOGIN e NOLOGIN

Role com `LOGIN` pode iniciar uma sessão quando a autenticação permite.

Role com `NOLOGIN` não conecta diretamente.

Roles sem login são adequadas para:

- grupos de privilégios;
- proprietários técnicos;
- responsabilidades assumidas por `SET ROLE`.

O laboratório usa `a304_owner` como `NOLOGIN`.

Assim, a credencial utilizada pela aplicação nunca é a proprietária dos objetos.

---

### Role proprietaria sem login

O owner possui poderes especiais sobre o objeto.

O proprietário de uma tabela pode:

- alterá-la;
- removê-la;
- conceder privilégios;
- mudar definições;
- transferir ownership.

Esses poderes não são apenas grants comuns.

Não existe um `REVOKE DROP` que retire do owner a possibilidade de remover sua própria tabela.

Por isso, uma aplicação de runtime não deve possuir as tabelas.

O modelo será:

```text
a304_owner:
possui schema, tabelas, sequences e views.

a304_migrator:
conecta e usa SET ROLE a304_owner durante migrations.

a304_runtime:
somente DML permitido.

a304_reader:
somente SELECT permitido.
```

---

### Role de grupo

Uma role `NOLOGIN` pode reunir privilégios.

Exemplo:

```sql
GRANT SELECT
ON tabela
TO a304_app_ro;
```

Depois:

```sql
GRANT a304_app_ro
TO a304_reader;
```

O benefício é administrar a permissão pela responsabilidade, não por cada conta individual.

Se um novo leitor for criado, basta associá-lo ao grupo.

---

### Menor privilegio

Princípio do menor privilégio:

```text
cada identidade recebe apenas o acesso necessário;
durante o tempo necessário;
no escopo necessário.
```

Para a aplicação:

```text
SELECT;
INSERT;
UPDATE;
DELETE;
USAGE em sequences necessárias.
```

Ela não receberá:

```text
CREATE em schema;
DROP;
ALTER;
TRUNCATE;
REFERENCES;
TRIGGER;
CREATEDB;
CREATEROLE;
SUPERUSER;
REPLICATION;
BYPASSRLS.
```

O fato de uma aplicação “talvez precisar no futuro” não é justificativa para concessão antecipada.

---

### Atributos de role

Atributos relevantes:

```text
SUPERUSER:
contorna praticamente todas as verificações de privilégio.

CREATEDB:
cria databases.

CREATEROLE:
cria e administra roles dentro das regras permitidas.

REPLICATION:
inicia conexões e operações de replicação.

BYPASSRLS:
ignora políticas de row-level security.

INHERIT:
controla herança automática de memberships.

LOGIN:
permite autenticação.
```

As roles de aplicação da aula serão explicitamente:

```text
NOSUPERUSER;
NOCREATEDB;
NOCREATEROLE;
NOREPLICATION;
NOBYPASSRLS.
```

---

### CONNECT no database

Para entrar em um database, a role precisa de `CONNECT`.

Muitos databases concedem `CONNECT` a `PUBLIC` por padrão.

No database isolado da aula, será executado:

```sql
REVOKE ALL
ON DATABASE formacao_java_a304
FROM PUBLIC;
```

Depois, `CONNECT` será concedido somente às responsabilidades necessárias.

Isso torna a validação do laboratório inequívoca.

---

### PUBLIC

`PUBLIC` representa todas as roles.

Um grant para `PUBLIC` também alcança futuras roles.

Ele é útil para permissões realmente universais, mas pode ampliar acesso de forma silenciosa.

No database da aula:

- privilégios do database serão revogados de `PUBLIC`;
- acesso ao schema `public` será revogado;
- a aplicação usará somente `seguranca_aula_304`.

Não execute essas revogações no database oficial desta formação.

---

### USAGE e CREATE no schema

Privilégios de schema:

```text
USAGE:
permite resolver e acessar objetos do schema quando também existe privilégio no objeto.

CREATE:
permite criar novos objetos no schema.
```

Conceder `SELECT` em uma tabela sem `USAGE` no schema não é suficiente para consultá-la pelo nome.

A runtime e o reader receberão `USAGE`, mas não `CREATE`.

---

### Privilegios de tabela

Privilégios comuns de tabela:

```text
SELECT;
INSERT;
UPDATE;
DELETE;
TRUNCATE;
REFERENCES;
TRIGGER.
```

O grupo de leitura recebe apenas `SELECT`.

O grupo de escrita da aplicação recebe:

```text
SELECT;
INSERT;
UPDATE;
DELETE.
```

`TRUNCATE` não será concedido.

Uma aplicação capaz de excluir uma linha não deve automaticamente ser capaz de esvaziar toda a tabela com `TRUNCATE`.

---

### Privilegios de sequence

Identity e serial normalmente usam sequences.

Um grant sobre a tabela não concede automaticamente acesso à sequence.

Para inserir sem informar o ID, a runtime precisa de privilégio apropriado na sequence.

O laboratório concederá:

```sql
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA seguranca_aula_304
TO a304_app_rw;
```

O reader não precisa chamar `nextval`.

---

### GRANT de membership

Associação:

```sql
GRANT a304_app_rw
TO a304_runtime;
```

A role de login passa a ser membro do grupo.

A runtime usa `INHERIT`, portanto recebe automaticamente os privilégios do grupo.

O migrator será criado com `NOINHERIT`.

Ele não utilizará automaticamente os poderes de `a304_owner`.

Para criar objetos, precisará executar:

```sql
SET ROLE a304_owner;
```

---

### session_user e current_user

`session_user` identifica a role que iniciou a conexão.

`current_user` identifica a role efetiva usada para verificação de permissões.

Antes de `SET ROLE`:

```text
session_user:
a304_migrator.

current_user:
a304_migrator.
```

Depois:

```sql
SET ROLE a304_owner;
```

Resultado:

```text
session_user:
a304_migrator.

current_user:
a304_owner.
```

Depois de:

```sql
RESET ROLE;
```

`current_user` volta para `a304_migrator`.

---

### INHERIT e SET ROLE

`INHERIT` controla se memberships fornecem privilégios automaticamente.

`NOINHERIT` permite desenhar um fluxo explícito:

```text
conectar com a identidade individual;

assumir uma role privilegiada somente durante a operação;

voltar para a identidade normal.
```

A capacidade de `SET ROLE` depende da membership concedida.

Não conceda membership de owner à runtime.

---

### GRANT OPTION e ADMIN OPTION

`WITH GRANT OPTION` permite que o destinatário conceda um privilégio de objeto a outras roles.

`WITH ADMIN OPTION` permite administrar a membership de uma role concedida.

Essas capacidades ampliam o alcance da identidade.

O laboratório não concederá nenhuma delas.

Uma aplicação não deve redistribuir seus próprios privilégios.

---

### ALTER DEFAULT PRIVILEGES

Grants aplicados aos objetos atuais não alcançam automaticamente objetos futuros.

Exemplo:

```text
a runtime acessa cliente hoje;

uma migration cria auditoria_evento amanhã;

a runtime não recebe acesso automaticamente.
```

`ALTER DEFAULT PRIVILEGES` define privilégios para objetos futuros criados por uma role específica.

Exemplo:

```sql
ALTER DEFAULT PRIVILEGES
FOR ROLE a304_owner
IN SCHEMA seguranca_aula_304
GRANT SELECT
ON TABLES
TO a304_app_ro;
```

Pontos importantes:

- não altera objetos existentes;
- depende da role criadora;
- depende do schema;
- precisa ser configurado para tables e sequences separadamente;
- não é uma regra global mágica.

---

### Ownership e role criadora

Se o migrator criar uma tabela sem `SET ROLE`, o objeto pertencerá a `a304_migrator`.

Os default privileges configurados para `a304_owner` talvez não sejam aplicados.

Por isso, o fluxo de migration será:

```sql
SET ROLE a304_owner;

CREATE TABLE ...;

RESET ROLE;
```

Assim, ownership e defaults permanecem consistentes.

---

### Search path

`search_path` define onde nomes não qualificados são procurados.

Um schema gravável por uma role não confiável no `search_path` pode permitir criação de objetos que ocultam nomes esperados.

O laboratório configura:

```text
pg_catalog;
seguranca_aula_304.
```

Também remove acesso ao schema `public` no database isolado.

Mesmo assim, scripts de migration continuarão usando nomes qualificados.

---

### Senhas e credenciais

Senhas não devem aparecer em:

- migrations;
- commits;
- logs;
- screenshots;
- documentação pública;
- histórico de shell.

O laboratório usa um arquivo local ignorado pelo Git.

Em produção, use:

- secret manager;
- rotação;
- prazo de validade quando aplicável;
- acesso mínimo;
- TLS;
- auditoria;
- credenciais diferentes por ambiente.

As senhas de exemplo são apenas locais.

---

### Revogacao

`REVOKE` remove grants explícitos.

Exemplo:

```sql
REVOKE UPDATE
ON seguranca_aula_304.cliente
FROM a304_app_rw;
```

A permissão efetiva pode continuar existindo por outra membership ou por `PUBLIC`.

Ao investigar acesso, considere todos os caminhos:

- grant direto;
- grupos;
- grupos indiretos;
- `PUBLIC`;
- ownership;
- superuser.

---

### Funcoes SECURITY DEFINER

Funções são `SECURITY INVOKER` por padrão e executam com privilégios do chamador.

`SECURITY DEFINER` executa com privilégios do owner e exige cuidados fortes, especialmente com `search_path` e schemas graváveis.

Esta aula não criará funções privilegiadas.

A regra básica é:

```text
não use SECURITY DEFINER como atalho para esconder um modelo de acesso mal desenhado.
```

---

### O que nao sera coberto

Ficam para aprofundamento futuro:

- `pg_hba.conf`;
- TLS;
- certificados;
- autenticação externa;
- row-level security;
- column-level privileges em profundidade;
- security definer aplicado;
- auditoria completa;
- secrets em cloud;
- rotação automatizada;
- integração com Spring Security.

A aula trata a base de autorização dentro do PostgreSQL.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-304-usuarios-permissoes-seguranca-postgresql\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-304-usuarios-permissoes-seguranca-postgresql\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-304-usuarios-permissoes-seguranca-postgresql\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-304-usuarios-permissoes-seguranca-postgresql\sql"

Set-Location `
  "labs\m12\aula-304-usuarios-permissoes-seguranca-postgresql"
```

---

### 2. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```text
config/roles.local.env
```

---

### 3. Criar roles.local.env.example

Crie:

```text
config/roles.local.env.example
```

Conteúdo:

```text
A304_RUNTIME_PASSWORD=troque-runtime-local
A304_READER_PASSWORD=troque-reader-local
A304_MIGRATOR_PASSWORD=troque-migrator-local
```

Crie o arquivo local:

```powershell
Copy-Item `
  ".\config\roles.local.env.example" `
  ".\config\roles.local.env"
```

Troque os três valores.

Não use suas senhas pessoais.

---

### 4. Criar 00_verificar_pre_requisitos.sql

Crie:

```text
sql/00_verificar_pre_requisitos.sql
```

Conteúdo:

```sql
SELECT
    current_user,
    session_user,
    version();

SELECT
    rolname,
    rolsuper,
    rolcreaterole,
    rolcreatedb
FROM pg_roles
WHERE rolname = current_user;
```

A role `formacao` precisa conseguir criar roles e database no ambiente local.

---

### 5. Criar 01_criar_roles.sql

Crie:

```text
sql/01_criar_roles.sql
```

Conteúdo:

```sql
CREATE ROLE a304_owner
NOLOGIN
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOREPLICATION
NOBYPASSRLS;

CREATE ROLE a304_app_rw
NOLOGIN
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOREPLICATION
NOBYPASSRLS;

CREATE ROLE a304_app_ro
NOLOGIN
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOREPLICATION
NOBYPASSRLS;

CREATE ROLE a304_runtime
LOGIN
INHERIT
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOREPLICATION
NOBYPASSRLS
PASSWORD :'runtime_password';

CREATE ROLE a304_reader
LOGIN
INHERIT
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOREPLICATION
NOBYPASSRLS
PASSWORD :'reader_password';

CREATE ROLE a304_migrator
LOGIN
NOINHERIT
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
NOREPLICATION
NOBYPASSRLS
PASSWORD :'migrator_password';

GRANT a304_app_rw
TO a304_runtime;

GRANT a304_app_ro
TO a304_reader;

GRANT a304_owner
TO a304_migrator;
```

As memberships não usam `ADMIN OPTION`.

---

### 6. Criar 02_configurar_database.sql

Crie:

```text
sql/02_configurar_database.sql
```

Conteúdo:

```sql
REVOKE ALL
ON DATABASE formacao_java_a304
FROM PUBLIC;

GRANT CONNECT
ON DATABASE formacao_java_a304
TO a304_app_rw;

GRANT CONNECT
ON DATABASE formacao_java_a304
TO a304_app_ro;

GRANT CONNECT
ON DATABASE formacao_java_a304
TO a304_migrator;

REVOKE ALL
ON SCHEMA public
FROM PUBLIC;

ALTER ROLE a304_runtime
IN DATABASE formacao_java_a304
SET search_path =
    pg_catalog,
    seguranca_aula_304;

ALTER ROLE a304_reader
IN DATABASE formacao_java_a304
SET search_path =
    pg_catalog,
    seguranca_aula_304;

ALTER ROLE a304_migrator
IN DATABASE formacao_java_a304
SET search_path =
    pg_catalog,
    seguranca_aula_304;
```

O schema da aula ainda será criado pelo owner.

---

### 7. Criar 03_criar_modelo_com_owner.sql

Crie:

```text
sql/03_criar_modelo_com_owner.sql
```

Conteúdo:

```sql
SELECT
    session_user,
    current_user;

SET ROLE a304_owner;

SELECT
    session_user,
    current_user;

CREATE SCHEMA seguranca_aula_304
AUTHORIZATION a304_owner;

CREATE TABLE seguranca_aula_304.cliente (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,

    CONSTRAINT pk_a304_cliente
        PRIMARY KEY (id),

    CONSTRAINT ck_a304_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_a304_cliente_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE seguranca_aula_304.ordem_servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    valor_previsto numeric(12, 2) NOT NULL,

    CONSTRAINT pk_a304_ordem
        PRIMARY KEY (id),

    CONSTRAINT fk_a304_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES seguranca_aula_304.cliente (id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_a304_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_a304_ordem_valor
        CHECK (valor_previsto >= 0)
);

INSERT INTO seguranca_aula_304.cliente (
    codigo,
    nome
)
VALUES
    (
        'CLI-A304-001',
        'Cliente Segurança Alfa'
    ),
    (
        'CLI-A304-002',
        'Cliente Segurança Beta'
    );

INSERT INTO seguranca_aula_304.ordem_servico (
    codigo,
    cliente_id,
    status,
    valor_previsto
)
SELECT
    dados.codigo,
    cliente.id,
    dados.status,
    dados.valor_previsto
FROM seguranca_aula_304.cliente AS cliente
INNER JOIN (
    VALUES
        (
            'CLI-A304-001',
            'OS-A304-001',
            'ABERTA',
            450.00::numeric
        ),
        (
            'CLI-A304-001',
            'OS-A304-002',
            'CONCLUIDA',
            700.00::numeric
        ),
        (
            'CLI-A304-002',
            'OS-A304-003',
            'EM_ATENDIMENTO',
            900.00::numeric
        )
) AS dados(
    cliente_codigo,
    codigo,
    status,
    valor_previsto
)
    ON dados.cliente_codigo = cliente.codigo;

CREATE VIEW seguranca_aula_304.vw_ordem_resumo AS
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status,
    ordem.valor_previsto,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome
FROM seguranca_aula_304.ordem_servico AS ordem
INNER JOIN seguranca_aula_304.cliente AS cliente
    ON cliente.id = ordem.cliente_id;

RESET ROLE;

SELECT
    session_user,
    current_user;
```

O script será executado conectado como `a304_migrator`.

Os objetos serão propriedade de `a304_owner`.

---

### 8. Criar 04_conceder_privilegios.sql

Crie:

```text
sql/04_conceder_privilegios.sql
```

Conteúdo:

```sql
SET ROLE a304_owner;

GRANT USAGE
ON SCHEMA seguranca_aula_304
TO a304_app_ro;

GRANT USAGE
ON SCHEMA seguranca_aula_304
TO a304_app_rw;

GRANT SELECT
ON ALL TABLES
IN SCHEMA seguranca_aula_304
TO a304_app_ro;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES
IN SCHEMA seguranca_aula_304
TO a304_app_rw;

GRANT USAGE, SELECT
ON ALL SEQUENCES
IN SCHEMA seguranca_aula_304
TO a304_app_rw;

ALTER DEFAULT PRIVILEGES
FOR ROLE a304_owner
IN SCHEMA seguranca_aula_304
GRANT SELECT
ON TABLES
TO a304_app_ro;

ALTER DEFAULT PRIVILEGES
FOR ROLE a304_owner
IN SCHEMA seguranca_aula_304
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLES
TO a304_app_rw;

ALTER DEFAULT PRIVILEGES
FOR ROLE a304_owner
IN SCHEMA seguranca_aula_304
GRANT USAGE, SELECT
ON SEQUENCES
TO a304_app_rw;

RESET ROLE;
```

Existing objects receberam grants explícitos.

Future objects receberão default privileges.

---

### 9. Criar scripts/01_preparar_ambiente.ps1

Crie:

```text
scripts/01_preparar_ambiente.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java_a304"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$envFile = Join-Path `
    $labRoot `
    "config\roles.local.env"

if (-not (Test-Path $envFile)) {
    throw "Copie roles.local.env.example."
}

$config = @{}

Get-Content $envFile |
    Where-Object {
        $_ -and
        -not $_.StartsWith("#")
    } |
    ForEach-Object {
        $parts = $_ -split "=", 2
        $config[$parts[0].Trim()] =
            $parts[1].Trim()
    }

$required = @(
    "A304_RUNTIME_PASSWORD",
    "A304_READER_PASSWORD",
    "A304_MIGRATOR_PASSWORD"
)

foreach ($name in $required) {
    if (
        -not $config.ContainsKey($name) -or
        [string]::IsNullOrWhiteSpace(
            $config[$name]
        )
    ) {
        throw "Variável local ausente: $name"
    }
}

docker exec $container `
    dropdb `
    --if-exists `
    -U formacao `
    $database

$roles = @(
    "a304_runtime",
    "a304_reader",
    "a304_migrator",
    "a304_app_rw",
    "a304_app_ro",
    "a304_owner"
)

foreach ($role in $roles) {
    docker exec $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d postgres `
        -c "DROP ROLE IF EXISTS $role;"
}

$rolesSql = Join-Path `
    $labRoot `
    "sql\01_criar_roles.sql"

Get-Content -Raw $rolesSql |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -v "runtime_password=$($config.A304_RUNTIME_PASSWORD)" `
        -v "reader_password=$($config.A304_READER_PASSWORD)" `
        -v "migrator_password=$($config.A304_MIGRATOR_PASSWORD)" `
        -U formacao `
        -d postgres

docker exec $container `
    createdb `
    -U formacao `
    -O a304_owner `
    -T template0 `
    -E UTF8 `
    $database

$configSql = Join-Path `
    $labRoot `
    "sql\02_configurar_database.sql"

Get-Content -Raw $configSql |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d $database

$modelSql = Join-Path `
    $labRoot `
    "sql\03_criar_modelo_com_owner.sql"

Get-Content -Raw $modelSql |
    docker exec -i `
        -e "PGPASSWORD=$($config.A304_MIGRATOR_PASSWORD)" `
        $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -h 127.0.0.1 `
        -U a304_migrator `
        -d $database

$grantsSql = Join-Path `
    $labRoot `
    "sql\04_conceder_privilegios.sql"

Get-Content -Raw $grantsSql |
    docker exec -i `
        -e "PGPASSWORD=$($config.A304_MIGRATOR_PASSWORD)" `
        $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -h 127.0.0.1 `
        -U a304_migrator `
        -d $database

Write-Host "Ambiente de segurança preparado."
```

O uso de `-h 127.0.0.1` força uma conexão TCP sujeita a senha.

---

### 10. Criar 05_inspecionar_roles_e_privilegios.sql

Crie:

```text
sql/05_inspecionar_roles_e_privilegios.sql
```

Conteúdo:

```sql
SELECT
    rolname,
    rolcanlogin,
    rolinherit,
    rolsuper,
    rolcreatedb,
    rolcreaterole,
    rolreplication,
    rolbypassrls
FROM pg_roles
WHERE rolname LIKE 'a304_%'
ORDER BY rolname;

SELECT
    member_role.rolname AS membro,
    granted_role.rolname AS role_concedida
FROM pg_auth_members AS membership
INNER JOIN pg_roles AS member_role
    ON member_role.oid = membership.member
INNER JOIN pg_roles AS granted_role
    ON granted_role.oid = membership.roleid
WHERE member_role.rolname LIKE 'a304_%'
ORDER BY
    membro,
    role_concedida;

SELECT
    namespace.nspname AS schema_name,
    classe.relname AS object_name,
    classe.relkind AS object_kind,
    pg_get_userbyid(
        classe.relowner
    ) AS owner
FROM pg_class AS classe
INNER JOIN pg_namespace AS namespace
    ON namespace.oid = classe.relnamespace
WHERE namespace.nspname = 'seguranca_aula_304'
ORDER BY
    object_kind,
    object_name;

SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'seguranca_aula_304'
ORDER BY
    grantee,
    table_name,
    privilege_type;

SELECT
    has_database_privilege(
        'a304_runtime',
        current_database(),
        'CONNECT'
    ) AS runtime_connect,
    has_schema_privilege(
        'a304_runtime',
        'seguranca_aula_304',
        'USAGE'
    ) AS runtime_schema_usage,
    has_table_privilege(
        'a304_runtime',
        'seguranca_aula_304.cliente',
        'SELECT'
    ) AS runtime_select,
    has_table_privilege(
        'a304_reader',
        'seguranca_aula_304.cliente',
        'INSERT'
    ) AS reader_insert;
```

O último campo deve ser `false`.

---

### 11. Criar 06_teste_runtime.sql

Crie:

```text
sql/06_teste_runtime.sql
```

Conteúdo:

```sql
SELECT
    session_user,
    current_user,
    current_setting(
        'search_path'
    ) AS search_path;

SELECT
    ordem_codigo,
    status,
    cliente_nome
FROM seguranca_aula_304.vw_ordem_resumo
ORDER BY ordem_id;

BEGIN;

INSERT INTO seguranca_aula_304.cliente (
    codigo,
    nome
)
VALUES (
    'CLI-A304-RUNTIME',
    'Cliente criado pela runtime'
)
RETURNING id;

UPDATE seguranca_aula_304.cliente
SET nome = 'Cliente alterado pela runtime'
WHERE codigo = 'CLI-A304-RUNTIME';

DELETE FROM seguranca_aula_304.cliente
WHERE codigo = 'CLI-A304-RUNTIME';

ROLLBACK;
```

O `INSERT` usa a sequence da identity.

A transação é revertida.

Teste negativo, execute separadamente:

```sql
CREATE TABLE seguranca_aula_304.tabela_proibida (
    id integer
);
```

O comando deve falhar por ausência de `CREATE` no schema.

Outro teste negativo:

```sql
DROP TABLE seguranca_aula_304.cliente;
```

A runtime não é owner e o comando deve falhar.

---

### 12. Criar scripts/02_testar_runtime.ps1

Crie:

```text
scripts/02_testar_runtime.ps1
```

O script deve ler `roles.local.env` como o preparador e executar:

```powershell
Get-Content -Raw `
  ".\sql\06_teste_runtime.sql" |
  docker exec -i `
    -e "PGPASSWORD=<senha-runtime>" `
    formacao-postgres-m12 `
    psql `
    -X `
    -v ON_ERROR_STOP=1 `
    -h 127.0.0.1 `
    -U a304_runtime `
    -d formacao_java_a304
```

Não imprima a senha.

Inclua os testes negativos em chamadas separadas e confirme que o código de saída é diferente de zero.

---

### 13. Criar 07_teste_reader.sql

Crie:

```text
sql/07_teste_reader.sql
```

Conteúdo:

```sql
SELECT
    session_user,
    current_user;

SELECT
    ordem_codigo,
    status,
    valor_previsto,
    cliente_nome
FROM seguranca_aula_304.vw_ordem_resumo
ORDER BY ordem_id;
```

Teste negativo separado:

```sql
INSERT INTO seguranca_aula_304.cliente (
    codigo,
    nome
)
VALUES (
    'CLI-A304-READER',
    'Não deve ser inserido'
);
```

O reader consulta, mas não insere.

---

### 14. Criar scripts/03_testar_reader.ps1

Crie um wrapper semelhante ao da runtime.

Ele deve:

1. executar `07_teste_reader.sql` e exigir sucesso;
2. tentar o `INSERT` proibido;
3. exigir falha;
4. consultar a tabela como `formacao`;
5. confirmar que `CLI-A304-READER` não existe.

---

### 15. Criar 08_teste_migrator.sql

Crie:

```text
sql/08_teste_migrator.sql
```

Conteúdo:

```sql
SELECT
    session_user,
    current_user;

SET ROLE a304_owner;

SELECT
    session_user,
    current_user;

CREATE TABLE seguranca_aula_304.auditoria_evento (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    ordem_servico_id bigint NOT NULL,
    tipo text NOT NULL,
    criado_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_a304_auditoria
        PRIMARY KEY (id),

    CONSTRAINT fk_a304_auditoria_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES seguranca_aula_304.ordem_servico (id)
        ON DELETE RESTRICT
);

RESET ROLE;

SELECT
    session_user,
    current_user;
```

Esse objeto será criado depois dos default privileges.

Não execute duas vezes sem reconstruir o ambiente.

---

### 16. Criar scripts/04_testar_migrator.ps1

O script deve:

1. conectar como `a304_migrator`;
2. tentar criar uma tabela sem `SET ROLE` e esperar falha;
3. executar `08_teste_migrator.sql`;
4. consultar ownership;
5. executar `09_validar_default_privileges.sql`.

---

### 17. Criar 09_validar_default_privileges.sql

Crie:

```text
sql/09_validar_default_privileges.sql
```

Conteúdo:

```sql
SELECT
    pg_get_userbyid(
        classe.relowner
    ) AS owner
FROM pg_class AS classe
INNER JOIN pg_namespace AS namespace
    ON namespace.oid = classe.relnamespace
WHERE namespace.nspname = 'seguranca_aula_304'
  AND classe.relname = 'auditoria_evento';

SELECT
    has_table_privilege(
        'a304_reader',
        'seguranca_aula_304.auditoria_evento',
        'SELECT'
    ) AS reader_select,
    has_table_privilege(
        'a304_runtime',
        'seguranca_aula_304.auditoria_evento',
        'INSERT'
    ) AS runtime_insert,
    has_table_privilege(
        'a304_runtime',
        'seguranca_aula_304.auditoria_evento',
        'DELETE'
    ) AS runtime_delete,
    has_sequence_privilege(
        'a304_runtime',
        'seguranca_aula_304.auditoria_evento_id_seq',
        'USAGE'
    ) AS runtime_sequence_usage;
```

Todos os campos devem ser `true`.

Isso comprova que os defaults atingiram o objeto futuro criado por `a304_owner`.

---

### 18. Criar 10_revoke_controlado.sql

Crie:

```text
sql/10_revoke_controlado.sql
```

Conteúdo:

```sql
BEGIN;

REVOKE UPDATE
ON seguranca_aula_304.cliente
FROM a304_app_rw;

SELECT
    has_table_privilege(
        'a304_runtime',
        'seguranca_aula_304.cliente',
        'UPDATE'
    ) AS runtime_update_durante_revoke;

ROLLBACK;

SELECT
    has_table_privilege(
        'a304_runtime',
        'seguranca_aula_304.cliente',
        'UPDATE'
    ) AS runtime_update_restaurado;
```

Resultados:

```text
durante a transação:
false.

depois do rollback:
true.
```

A alteração de privilégio também participa da transação.

---

### 19. Criar a documentacao

Em:

```text
docs/matriz-acessos.md
```

crie uma tabela:

```text
responsabilidade;
CONNECT;
USAGE;
SELECT;
INSERT;
UPDATE;
DELETE;
CREATE;
SET ROLE owner;
ownership.
```

Em:

```text
docs/politica-credenciais.md
```

registre:

- senha não entra no Git;
- credenciais diferem por ambiente;
- runtime não é owner;
- migration usa identidade separada;
- reader é somente leitura;
- segredo deve ser rotacionável;
- logs não exibem senha;
- acesso administrativo é excepcional;
- desativação remove a role ou o login;
- vazamento exige rotação e investigação.

Em:

```text
docs/revisao-menor-privilegio.md
```

documente:

- privilégio;
- justificativa;
- objeto;
- responsável;
- data de revisão;
- última utilização observada;
- decisão de manter ou revogar.

---

## Entendendo o que foi feito

### Ownership ficou separado do login

`a304_owner` não pode conectar.

O migrator assume essa identidade apenas durante DDL.

A runtime não pode remover ou alterar as tabelas.

---

### Grupos reuniram privilegios

`a304_app_rw` e `a304_app_ro` receberam grants.

Os logins receberam memberships.

Uma troca de pessoa ou serviço não exige repetir cada grant de objeto.

---

### Database, schema e tabela exigiram camadas diferentes

A role precisou de:

```text
CONNECT no database;

USAGE no schema;

privilégio no objeto.
```

A ausência em qualquer camada bloqueia o acesso correspondente.

---

### Sequence exigiu grant proprio

O `INSERT` da runtime utilizou identity.

O privilégio da tabela sozinho não seria suficiente para usar a sequence.

---

### Default privileges protegeram o futuro

`auditoria_evento` nasceu com acesso de leitura e escrita coerente com os grupos.

Não foi necessário repetir grants manualmente para aquele objeto.

---

### Conexoes reais validaram o modelo

As verificações não dependeram apenas de catálogos.

Cada login tentou operações permitidas e proibidas.

A falha esperada também foi considerada evidência.

---

## Erros comuns importantes

### Usar superuser na aplicacao

Uma injeção ou bug adquire poder sobre todo o cluster.

Use uma role limitada.

---

### Tornar runtime proprietaria

Grants não conseguem retirar os poderes de owner.

Use owner sem login.

---

### Conceder tabela e esquecer schema

Sem `USAGE`, a tabela não é acessível pelo schema.

---

### Conceder tabela e esquecer sequence

O insert em identity pode falhar.

Conceda apenas o necessário na sequence.

---

### Configurar default para a role errada

Defaults dependem de quem cria o objeto.

Padronize o uso de `SET ROLE` nas migrations.

---

## Comandos uteis

### Criar grupo

```sql
CREATE ROLE grupo NOLOGIN;
```

### Criar login limitado

```sql
CREATE ROLE usuario
LOGIN
NOSUPERUSER
NOCREATEDB
NOCREATEROLE;
```

### Conceder membership

```sql
GRANT grupo TO usuario;
```

### Assumir owner

```sql
SET ROLE owner_role;
```

### Verificar privilegio

```sql
SELECT has_table_privilege(
    'usuario',
    'schema.tabela',
    'SELECT'
);
```

---

## Exercicio guiado

Use:

```text
sql/11_exercicio.sql
```

para registrar as consultas e validações.

### Parte 1 - Novo grupo de suporte

Crie:

```text
a304_support_ro.
```

A role deve ser `NOLOGIN`.

Conceda:

```text
CONNECT;

USAGE;

SELECT apenas em vw_ordem_resumo.
```

Ela não deve consultar diretamente `cliente`.

---

### Parte 2 - Login de suporte

Crie:

```text
a304_support_user.
```

Use uma senha local não versionada.

Associe ao grupo de suporte.

Valide por conexão real:

```text
SELECT na view:
sucesso.

SELECT em cliente:
falha.

INSERT:
falha.
```

---

### Parte 3 - Privilegio por coluna

Conceda temporariamente ao suporte:

```text
SELECT (
    id,
    codigo
)
ON cliente.
```

Confirme que:

```text
SELECT id, codigo:
sucesso.

SELECT nome:
falha.
```

Depois execute `REVOKE` e remova o acesso.

Documente por que privilégio por coluna aumenta complexidade operacional.

---

### Parte 4 - Membership sem heranca

Crie:

```text
a304_auditor;
```

Use `LOGIN NOINHERIT`.

Conceda `a304_app_ro`.

Valide:

- sem `SET ROLE`, a consulta falha;
- com `SET ROLE a304_app_ro`, a consulta funciona;
- `RESET ROLE` remove o acesso efetivo.

---

### Parte 5 - Default privileges

Crie, como owner:

```text
seguranca_aula_304.observacao_ordem.
```

Use identity.

Confirme automaticamente:

- reader possui `SELECT`;
- runtime possui DML;
- runtime possui `USAGE` na sequence;
- support não recebeu acesso.

---

### Parte 6 - Grant option

Explique por que a runtime não deve receber:

```text
WITH GRANT OPTION.
```

Demonstre a consulta de catálogo que comprova ausência da opção.

Não conceda a opção.

---

### Parte 7 - Revisao de acesso

Classifique cada role:

```text
owner;

runtime;

reader;

migrator;

support;

auditor.
```

Para cada uma, responda:

- precisa login?
- precisa inheritance?
- precisa SET ROLE?
- quais objetos?
- quais comandos?
- qual risco?
- como revogar?

---

### Parte 8 - Limpeza do exercicio

Remova primeiro:

- objetos do exercício;
- memberships;
- logins;
- grupos adicionais.

Não remova as roles oficiais da aula antes do checkpoint principal.

---

## Criterios de aceite

- o laboratório oficial da aula 304 existe;
- o arquivo e o H1 seguem a grade;
- o database isolado foi criado;
- roles foram diferenciadas de usuários tradicionais;
- LOGIN foi diferenciado de NOLOGIN;
- role de owner não possui login;
- grupos de leitura e escrita foram criados;
- runtime é membro do grupo de escrita;
- reader é membro do grupo de leitura;
- migrator usa NOINHERIT;
- migrator consegue executar SET ROLE;
- session_user foi diferenciado de current_user;
- roles de aplicação não são superusers;
- roles de aplicação não possuem CREATEDB;
- roles de aplicação não possuem CREATEROLE;
- roles de aplicação não possuem REPLICATION;
- roles de aplicação não possuem BYPASSRLS;
- CONNECT foi controlado;
- PUBLIC foi revogado somente no database isolado;
- USAGE no schema foi concedido;
- CREATE no schema não foi concedido à runtime;
- privilégios DML foram concedidos ao grupo correto;
- TRUNCATE não foi concedido;
- sequence recebeu grants próprios;
- ownership foi inspecionado;
- runtime não consegue criar tabela;
- runtime não consegue remover tabela;
- reader consulta e não escreve;
- default privileges foram configurados;
- objeto futuro recebeu privilégios automaticamente;
- search_path foi configurado;
- credenciais locais foram ignoradas pelo Git;
- revoke transacional foi praticado;
- conexões reais validaram sucessos e falhas;
- roles e database foram removidos ao final;
- `formacao_java` e `projeto_os` foram preservados;
- window functions não foram antecipadas;
- documentação e README estão prontos;
- commit recomendado pode ser realizado.

---

## Commit recomendado

Antes de adicionar:

```powershell
git status
git diff
```

Confirme que não aparece:

```text
config/roles.local.env.
```

Adicione:

```powershell
git add `
  labs/m12/aula-304-usuarios-permissoes-seguranca-postgresql
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): aplicar menor privilegio no postgresql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
roles;
groups;
ownership;
grants;
default privileges;
testes de acesso;
menor privilégio.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você construiu uma base de autorização para PostgreSQL.

Aprendeu:

```text
roles;
LOGIN;
NOLOGIN;
groups;
memberships;
INHERIT;
NOINHERIT;
SET ROLE;
ownership;
CONNECT;
USAGE;
CREATE;
privilégios de tabela;
privilégios de sequence;
ALTER DEFAULT PRIVILEGES;
REVOKE;
search_path.
```

As regras principais foram:

```text
role com login não deve ser owner por conveniência;

aplicação não usa superuser;

grupos recebem privilégios;

logins recebem memberships;

database, schema e objeto possuem verificações diferentes;

identity pode exigir privilégio de sequence;

default privileges valem para objetos futuros da role criadora;

migrations precisam criar objetos sob ownership consistente;

PUBLIC amplia acesso para todas as roles;

senhas não pertencem ao Git;

acesso deve ser validado por conexão real;

falha esperada também é evidência.
```

A próxima aula será:

```text
305 - M12.35 - Funcoes window introducao para relatorios
```

Nela, você vai estudar:

- diferença entre agregação e janela;
- `OVER`;
- `PARTITION BY`;
- `ORDER BY` da janela;
- `row_number`;
- `rank`;
- `dense_rank`;
- `lag`;
- `lead`;
- totais acumulados;
- médias móveis introdutórias;
- primeiro e último valor;
- frames;
- relatórios sem perder a granularidade original.

O modelo de segurança desta aula será encerrado antes da próxima.

A aula 305 voltará ao foco de consultas e relatórios.

---

# Material complementar

## Checkpoint final

- [ ] Separei owner, migrator, runtime e reader.
- [ ] Validei grants por conexões reais.
- [ ] Testei default privileges e sequences.
- [ ] Limpei database, roles e fiz o commit.

---

## Troubleshooting adicional

### permission denied for database

A role não possui `CONNECT` ou o grant do grupo não está sendo herdado.

Inspecione membership e `INHERIT`.

### permission denied for schema

Existe privilégio na tabela, mas falta `USAGE`.

Conceda ao grupo correto.

### permission denied for sequence

A role insere na tabela, mas não chama `nextval`.

Revise os grants de sequence.

### must be owner of table

A runtime tentou DDL.

Use o migrator com `SET ROLE a304_owner`.

### cannot drop role because some objects depend on it

Ainda existem database, objetos, grants ou memberships.

Remova o database e dependências antes das roles.

---

## Perguntas de revisao

1. O que é uma role?
2. Qual a diferença entre LOGIN e NOLOGIN?
3. Por que usar grupo?
4. Por que o owner não possui login?
5. O que é menor privilégio?
6. Para que serve CONNECT?
7. Para que serve USAGE no schema?
8. Para que serve CREATE no schema?
9. Quais DMLs a runtime recebeu?
10. Por que TRUNCATE não foi concedido?
11. Por que sequence precisa de grant?
12. O que é membership?
13. O que INHERIT controla?
14. Para que serve SET ROLE?
15. Qual a diferença entre session_user e current_user?
16. O que são default privileges?
17. Eles alteram objetos existentes?
18. Por que a role criadora importa?
19. Por que PUBLIC exige cuidado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Identidade que possui objetos e privilégios.
2. Uma conecta e a outra não.
3. Centralizar permissões por responsabilidade.
4. Separar credencial de ownership.
5. Somente acesso necessário.
6. Entrar no database.
7. Resolver objetos do schema.
8. Criar objetos no schema.
9. SELECT, INSERT, UPDATE e DELETE.
10. Evitar esvaziamento completo.
11. Identity usa nextval.
12. Associação entre roles.
13. Herança automática dos privilégios.
14. Assumir a role concedida.
15. Identidade da sessão versus identidade efetiva.
16. Grants para objetos futuros.
17. Não.
18. Defaults pertencem ao criador.
19. Alcança todas as roles.
20. Funções window.

---

## Desafio opcional

Projete acessos para uma API com:

```text
serviço de pedidos;

serviço financeiro;

BI;

migrations;

suporte;

backup;

administrador.
```

Para cada identidade, documente:

- LOGIN ou NOLOGIN;
- grupo;
- database;
- schema;
- tabelas;
- sequences;
- funções;
- DML;
- DDL;
- SET ROLE;
- owner;
- duração da credencial;
- rotação;
- auditoria.

Não implemente row-level security.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 304 - M12.34 - Usuarios permissoes e seguranca basica no PostgreSQL

- Entendi que PostgreSQL unifica usuários e grupos como roles.
- Diferenciei roles com `LOGIN` e `NOLOGIN`.
- Criei um owner técnico sem login.
- Criei grupos separados para leitura e escrita.
- Associei logins aos grupos por membership.
- Mantive runtime e reader sem privilégios administrativos.
- Usei `NOINHERIT` no migrator.
- Executei migrations com `SET ROLE` para o owner.
- Diferenciei `session_user` de `current_user`.
- Controlei `CONNECT` no database isolado.
- Concedi `USAGE` sem `CREATE` no schema.
- Concedi DML mínimo para a aplicação.
- Evitei conceder `TRUNCATE`.
- Concedi privilégios próprios para sequences.
- Inspecionei ownership e grants.
- Configurei `ALTER DEFAULT PRIVILEGES`.
- Validei grants sobre um objeto criado posteriormente.
- Configurei um `search_path` restrito.
- Mantive senhas locais fora do Git.
- Testei acessos permitidos e proibidos por conexões reais.
- Removi o database e as roles do laboratório.
- Próxima aula: funções window para relatórios.
```

---

## Referencia tecnica curta

```text
Role:
identidade e grupo.

LOGIN:
pode conectar.

NOLOGIN:
grupo ou owner técnico.

Owner:
controla o objeto.

GRANT:
concede.

REVOKE:
remove.

CONNECT:
database.

USAGE:
schema ou sequence.

SELECT:
leitura.

SET ROLE:
assumir responsabilidade.

Default privileges:
objetos futuros.

PUBLIC:
todas as roles.
```

Regra final:

```text
seguranca basica no PostgreSQL comeca separando identidades, ownership e privilegios, e validando cada acesso com o principio do menor privilegio.
```
