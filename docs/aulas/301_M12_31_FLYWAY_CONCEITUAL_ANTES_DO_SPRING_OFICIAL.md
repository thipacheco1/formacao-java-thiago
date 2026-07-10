# 301 - M12.31 - Flyway conceitual antes do Spring

## Apresentacao da aula

Na aula 300, você criou uma cadeia de migrações manual.

Praticou:

```text
versões ordenadas;

scripts imutáveis;

migração de schema;

migração de dados;

backfill;

expand and contract;

histórico;

compatibilidade;

reconstrução completa.
```

O processo funcionou, mas várias responsabilidades ficaram sob controle manual:

- descobrir quais scripts existem;
- ordenar as versões;
- saber quais já foram executadas;
- registrar o histórico;
- detectar uma migração editada;
- mostrar versões pendentes;
- impedir reaplicação;
- executar cada arquivo;
- validar o estado do histórico.

Flyway automatiza essas responsabilidades.

Nesta aula, você usará Flyway sem Spring Boot.

A ferramenta será executada diretamente em um container Docker e conectará ao PostgreSQL do módulo M12.

O objetivo é separar duas ideias:

```text
Flyway:
ferramenta de migração.

Spring:
framework de aplicação.
```

Flyway pode ser usado por:

- linha de comando;
- container Docker;
- Maven;
- Gradle;
- API Java;
- pipelines de CI/CD;
- integração futura com Spring Boot.

O banco não deve depender de uma aplicação Spring para que você compreenda o histórico das migrações.

A prática usará o schema isolado:

```text
flyway_aula_301
```

Você criará:

- migrações versionadas;
- uma repeatable migration;
- configuração local fora do Git;
- wrapper PowerShell para o container;
- histórico automático;
- migração pendente;
- validação por checksum;
- simulação de edição indevida;
- falha transacional controlada;
- documentação de `repair`, `baseline` e `clean`.

O schema oficial `projeto_os`, seus dados e suas views não serão modificados.

Ao final, o schema da aula será removido, mas os arquivos Flyway permanecerão no repositório para revisão.

A próxima aula será:

```text
302 - M12.32 - Carga de massa seed e dados de teste
```

Por isso, esta aula usará apenas uma quantidade mínima e determinística de dados para tornar as migrações observáveis. Estratégias completas de seed e massa pertencem à aula 302.

---

## Onde estamos na formacao

A sequência atual do módulo é:

```text
299:
performance inicial de SQL.

300:
scripts versionados e migrações conceituais.

301:
Flyway conceitual antes do Spring.

302:
carga de massa, seed e dados de teste.

303:
backup, restore e recuperação.
```

A aula anterior construiu manualmente algo semelhante a:

```text
histórico de versões;
ordem;
descrição;
usuário;
data de aplicação.
```

Flyway cria e mantém uma tabela própria:

```text
flyway_schema_history
```

Ela registra informações como:

- ordem instalada;
- versão;
- descrição;
- tipo;
- nome do script;
- checksum;
- usuário;
- momento;
- tempo de execução;
- sucesso.

Flyway também compara:

```text
migrações disponíveis no projeto;

migrações registradas no banco.
```

Com isso, consegue informar estados como:

```text
Pending;

Success;

Missing;

Failed;

Outdated;

Future;

Out of Order.
```

O fluxo básico será:

```text
info;

migrate;

info;

validate.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-301-flyway-conceitual-antes-spring
```

Estrutura final:

```text
labs
└── m12
    └── aula-301-flyway-conceitual-antes-spring
        ├── README.md
        ├── .gitignore
        ├── config
        │   └── flyway.local.env.example
        ├── docs
        │   ├── comandos-flyway.md
        │   ├── estados-historico.md
        │   └── politica-repair-baseline-clean.md
        ├── migrations
        │   ├── V1__criar_modelo_base.sql
        │   ├── V2__adicionar_prioridade.sql
        │   ├── V3__criar_indice_listagem.sql
        │   ├── V4__adicionar_origem.sql
        │   └── R__vw_ordem_resumo.sql
        ├── scripts
        │   └── flyway.ps1
        ├── simulations
        │   └── .gitkeep
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_inspecionar_schema_history.sql
            ├── 02_validar_objetos.sql
            ├── 03_validar_repeatable.sql
            ├── 04_verificar_falha_transacional.sql
            ├── 05_exercicio.sql
            ├── 06_limpar_laboratorio.sql
            └── 07_checkpoint_final.sql
```

A imagem utilizada será fixada:

```text
redgate/flyway:12.11.0
```

Fixar a versão evita que uma atualização futura de `latest` altere silenciosamente o comportamento do laboratório.

Comandos praticados:

```text
info;

migrate;

validate.
```

Comandos estudados, mas não usados como correção automática:

```text
repair;

baseline;

clean.
```

---

## Conceito essencial

### Como Flyway pensa

Flyway parte de três elementos:

```text
um banco alvo;

uma localização de migrações;

uma tabela de histórico.
```

Ao executar `migrate`, a ferramenta:

1. conecta ao banco;
2. localiza os scripts;
3. interpreta nomes e versões;
4. consulta o histórico;
5. identifica versões pendentes;
6. aplica as pendentes em ordem;
7. registra o resultado;
8. executa repeatable migrations necessárias.

A ferramenta não inventa o conteúdo da migração.

Você continua responsável por escrever SQL correto, compatível e seguro.

---

### Migracao versionada

Convenção padrão:

```text
V1__criar_modelo_base.sql
```

Partes:

```text
V:
prefixo de versioned migration.

1:
versão.

__:
separador duplo.

criar_modelo_base:
descrição.

.sql:
sufixo.
```

Outros exemplos:

```text
V2__adicionar_prioridade.sql;

V2_1__corrigir_prioridade.sql;

V2026.07.10__criar_tabela.sql.
```

A convenção escolhida pelo projeto precisa ser consistente.

Nesta aula serão usados números inteiros simples.

---

### Ordem das versoes

Flyway ordena versões de forma semântica.

Exemplo:

```text
V1;

V2;

V10.
```

A versão `V10` vem depois de `V2`.

Isso não depende de ordenação textual comum.

Mesmo assim, nomes claros e uma política simples melhoram a manutenção.

Não use duas migrações com a mesma versão.

---

### Migracao aplicada e imutabilidade

Quando uma versioned migration é executada, Flyway registra seu checksum.

Se o arquivo for alterado depois, `validate` detecta diferença entre:

```text
checksum aplicado;

checksum disponível.
```

Essa validação materializa a regra da aula 300:

```text
migração aplicada não deve ser editada.
```

Se uma regra precisa mudar, crie uma versão nova.

---

### Repeatable migration

Convenção:

```text
R__vw_ordem_resumo.sql
```

Uma repeatable migration:

- não possui número de versão;
- é executada depois das versionadas pendentes;
- volta a ser executada quando seu checksum muda;
- é adequada para objetos que podem ser recriados de forma segura.

Usos comuns:

- views;
- procedures;
- functions;
- dados de referência pequenos e idempotentes, quando a política permitir.

A responsabilidade pela repetibilidade é do autor.

Para uma view:

```sql
CREATE OR REPLACE VIEW ...
```

é uma estratégia natural.

Não transforme toda mudança em repeatable.

Estruturas históricas e backfills normalmente pertencem a versioned migrations.

---

### Ordem das repeatable migrations

Quando várias repeatables precisam executar, Flyway as ordena pela descrição.

Se uma view depende de outra, os nomes devem refletir uma ordem compatível ou a estrutura deve ser reorganizada.

Não use dependências escondidas e frágeis.

---

### Schema history

Por padrão, a tabela se chama:

```text
flyway_schema_history
```

Campos importantes:

```text
installed_rank:
ordem em que foi instalada.

version:
versão da migration.

description:
descrição interpretada do nome.

type:
SQL, BASELINE ou outro tipo.

script:
nome do arquivo.

checksum:
resumo do conteúdo.

installed_by:
usuário do banco.

installed_on:
momento.

execution_time:
tempo em milissegundos.

success:
resultado.
```

Uma repeatable possui `version` nula.

Não edite a tabela manualmente.

Ela é parte do mecanismo de controle do Flyway.

---

### Comando info

`info` mostra:

- versões aplicadas;
- versões pendentes;
- repeatables;
- estado do histórico;
- última versão;
- scripts ausentes ou futuros.

Use antes de um deploy para responder:

```text
o que será executado?
```

Use depois para confirmar:

```text
o que foi executado?
```

---

### Comando migrate

`migrate` leva o banco até a versão mais recente disponível, respeitando a configuração.

Ele cria a tabela de histórico quando necessário.

Em PostgreSQL, cada migração SQL normalmente pode ser executada em sua própria transação quando os comandos usados permitem transação.

Se uma versioned migration falha, a unidade é revertida.

Isso não significa que toda instrução em todo banco seja transacional.

Exemplo importante:

```text
CREATE INDEX CONCURRENTLY
```

possui requisitos próprios e não pode ser colocado em uma transação comum.

---

### Comando validate

`validate` compara o histórico com as migrações disponíveis.

Ele pode falhar quando:

- checksum mudou;
- nome ou tipo divergiu;
- migration aplicada não existe mais localmente;
- migration resolvida está pendente;
- histórico e projeto não são compatíveis.

No laboratório, `validate` será executado:

1. depois da cadeia correta;
2. contra uma cópia adulterada de `V2`.

A cópia evita alterar o arquivo oficial do laboratório.

---

### Comando repair

`repair` modifica a tabela de histórico.

Entre suas ações possíveis estão:

- remover registros de migrações falhas;
- realinhar checksums, descrições e tipos;
- marcar migrações ausentes como removidas.

Isso torna o comando poderoso e perigoso.

`repair` não deve ser usado para silenciar uma alteração acidental sem investigação.

Antes de usar:

1. identifique a causa;
2. compare banco e repositório;
3. confirme quais ambientes foram afetados;
4. decida se o conteúdo aplicado é realmente o desejado;
5. faça backup;
6. use as mesmas locations do `migrate`;
7. registre a decisão.

Nesta aula, `repair` não será executado.

---

### Comando baseline

`baseline` é usado quando Flyway passa a controlar um banco existente.

Ele registra que o banco já está em determinada versão sem executar todas as versões anteriores.

Exemplo conceitual:

```text
banco legado já possui estrutura equivalente à versão 10;

baselineVersion = 10;

Flyway registra a linha de baseline;

V11 em diante poderá ser aplicada.
```

Baseline não valida automaticamente que o banco realmente corresponde à versão declarada.

É responsabilidade da equipe comprovar o estado.

Não use `baseline` em banco vazio como substituto para aplicar migrações.

O laboratório não executará baseline.

---

### baselineOnMigrate

Existe uma configuração que pode criar baseline automaticamente durante `migrate` em certas situações.

Ela reduz uma proteção importante contra conexão ao banco errado.

Por isso, não será ativada.

A decisão de baseline deve ser explícita e revisada.

---

### Comando clean

`clean` remove objetos dos schemas configurados.

É útil em ambientes locais descartáveis.

É perigoso em produção.

O arquivo local do laboratório definirá:

```text
FLYWAY_CLEAN_DISABLED=true
```

A limpeza será feita por um script SQL explícito apenas no schema exclusivo da aula.

Não execute:

```text
flyway clean
```

no banco oficial.

---

### Locations

Locations indicam onde Flyway procura migrações.

No container:

```text
filesystem:/flyway/sql
```

A pasta local `migrations` será montada como somente leitura nesse caminho.

A mesma location deve ser usada de forma consistente em:

```text
migrate;

validate;

repair.
```

Se `repair` enxergar outra coleção de arquivos, pode produzir um histórico incorreto.

---

### Configuracao e secrets

O laboratório usará variáveis de ambiente:

```text
FLYWAY_URL;

FLYWAY_USER;

FLYWAY_PASSWORD;

FLYWAY_SCHEMAS;

FLYWAY_DEFAULT_SCHEMA;

FLYWAY_LOCATIONS.
```

O arquivo real:

```text
config/flyway.local.env
```

não será versionado.

O repositório conterá apenas:

```text
config/flyway.local.env.example
```

Em produção, credenciais devem vir de secret manager ou mecanismo seguro do pipeline.

Não grave senha real em migration SQL.

---

### schemas e defaultSchema

Configuração:

```text
schemas:
schemas gerenciados pelo Flyway.

defaultSchema:
schema padrão e local da tabela de histórico.
```

No laboratório, ambos apontarão para:

```text
flyway_aula_301
```

Flyway poderá criar o schema automaticamente.

As migrações usarão nomes totalmente qualificados para tornar o alvo explícito.

---

### Concorrencia de migracoes

Dois processos de deploy podem tentar executar `migrate` simultaneamente.

Flyway usa mecanismos de lock para coordenar o histórico e evitar que ambos apliquem a mesma versão livremente.

Isso não elimina a necessidade de pipeline organizado.

A empresa deve definir:

- um responsável pelo deploy;
- ordem;
- timeout;
- logs;
- observabilidade;
- política de falha.

---

### Out of order

Flyway possui suporte configurável a migrações fora de ordem.

Exemplo:

```text
produção está em V5;

surge V3_1.
```

Permitir execução fora de ordem pode gerar estados diferentes quando a cadeia é reconstruída do zero.

Nesta formação, a regra será:

```text
não criar versão abaixo da maior aplicada;
criar a próxima versão disponível.
```

`outOfOrder` permanecerá desativado.

---

## Mao na massa guiada

### 1. Confirmar o ambiente

Na raiz:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

O container precisa estar em execução.

Confirme a imagem Flyway:

```powershell
docker pull redgate/flyway:12.11.0

docker run --rm `
  redgate/flyway:12.11.0 `
  -v
```

A imagem será baixada apenas quando ainda não existir localmente.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-301-flyway-conceitual-antes-spring\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-301-flyway-conceitual-antes-spring\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-301-flyway-conceitual-antes-spring\migrations"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-301-flyway-conceitual-antes-spring\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-301-flyway-conceitual-antes-spring\simulations"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-301-flyway-conceitual-antes-spring\sql"

Set-Location `
  "labs\m12\aula-301-flyway-conceitual-antes-spring"
```

---

### 3. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```text
config/flyway.local.env
simulations/checksum-migrations/
simulations/failure-migrations/
```

O arquivo de credenciais e as cópias adulteradas não serão commitados.

---

### 4. Criar flyway.local.env.example

Crie:

```text
config/flyway.local.env.example
```

Conteúdo:

```text
FLYWAY_URL=jdbc:postgresql://localhost:5432/formacao_java
FLYWAY_USER=formacao
FLYWAY_PASSWORD=formacao
FLYWAY_SCHEMAS=flyway_aula_301
FLYWAY_DEFAULT_SCHEMA=flyway_aula_301
FLYWAY_CREATE_SCHEMAS=true
FLYWAY_LOCATIONS=filesystem:/flyway/sql
FLYWAY_CONNECT_RETRIES=10
FLYWAY_CLEAN_DISABLED=true
```

Essas credenciais pertencem somente ao PostgreSQL local da formação.

Crie a configuração local:

```powershell
Copy-Item `
  ".\config\flyway.local.env.example" `
  ".\config\flyway.local.env"
```

Confirme que `.gitignore` protege o arquivo.

---

### 5. Criar scripts/flyway.ps1

Crie:

```text
scripts/flyway.ps1
```

Conteúdo:

```powershell
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet(
        "info",
        "migrate",
        "validate",
        "repair",
        "baseline"
    )]
    [string] $Command,

    [string] $MigrationsPath = ""
)

$ErrorActionPreference = "Stop"

$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

$envFile = Join-Path `
    $labRoot `
    "config\flyway.local.env"

if (-not (Test-Path $envFile)) {
    throw (
        "Arquivo local ausente: $envFile. " +
        "Copie flyway.local.env.example."
    )
}

if ([string]::IsNullOrWhiteSpace($MigrationsPath)) {
    $MigrationsPath = Join-Path `
        $labRoot `
        "migrations"
}

$migrations = Resolve-Path $MigrationsPath

docker run --rm `
    --network "container:formacao-postgres-m12" `
    --env-file $envFile `
    --mount (
        "type=bind,source=" +
        $migrations.Path +
        ",target=/flyway/sql,readonly"
    ) `
    redgate/flyway:12.11.0 `
    $Command

if ($LASTEXITCODE -ne 0) {
    throw (
        "Flyway terminou com código " +
        $LASTEXITCODE
    )
}
```

O container Flyway compartilhará a rede do PostgreSQL.

Por isso, a URL usa:

```text
localhost:5432.
```

O volume das migrações é somente leitura.

---

### 6. Criar 00_verificar_pre_requisitos.sql

Crie:

```text
sql/00_verificar_pre_requisitos.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    version() AS versao;

SELECT
    to_regnamespace(
        'flyway_aula_301'
    ) AS schema_flyway;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_oficial;
```

Execute pela raiz do repositório usando `psql`, como nas aulas anteriores.

O schema Flyway pode ser nulo antes do primeiro `migrate`.

---

### 7. Criar V1__criar_modelo_base.sql

Crie:

```text
migrations/V1__criar_modelo_base.sql
```

Conteúdo:

```sql
CREATE TABLE flyway_aula_301.cliente (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,

    CONSTRAINT ck_fly301_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_fly301_cliente_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE flyway_aula_301.ordem_servico (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    descricao_problema text NOT NULL,
    aberta_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fly301_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES flyway_aula_301.cliente (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT ck_fly301_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        )
);

INSERT INTO flyway_aula_301.cliente (
    id,
    codigo,
    nome
)
VALUES
    (
        301001,
        'CLI-FLY-A',
        'Cliente Flyway Alfa'
    ),
    (
        301002,
        'CLI-FLY-B',
        'Cliente Flyway Beta'
    );

INSERT INTO flyway_aula_301.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    descricao_problema,
    aberta_em
)
VALUES
    (
        301101,
        'OS-FLY-001',
        301001,
        'ABERTA',
        'Equipamento não liga',
        TIMESTAMPTZ '2026-07-01 09:00:00-03'
    ),
    (
        301102,
        'OS-FLY-002',
        301001,
        'EM_ATENDIMENTO',
        'Equipamento apresenta ruído',
        TIMESTAMPTZ '2026-07-02 10:00:00-03'
    ),
    (
        301103,
        'OS-FLY-003',
        301002,
        'CONCLUIDA',
        'Sensor substituído',
        TIMESTAMPTZ '2026-07-03 11:00:00-03'
    );
```

Os dados são mínimos e determinísticos, usados apenas para observar as próximas migrações.

---

### 8. Criar V2__adicionar_prioridade.sql

Crie:

```text
migrations/V2__adicionar_prioridade.sql
```

Conteúdo:

```sql
ALTER TABLE flyway_aula_301.ordem_servico
ADD COLUMN prioridade text;

UPDATE flyway_aula_301.ordem_servico
SET prioridade = CASE
    WHEN status = 'EM_ATENDIMENTO'
        THEN 'ALTA'
    ELSE 'NORMAL'
END
WHERE prioridade IS NULL;

ALTER TABLE flyway_aula_301.ordem_servico
ADD CONSTRAINT ck_fly301_ordem_prioridade
CHECK (
    prioridade IN (
        'BAIXA',
        'NORMAL',
        'ALTA',
        'CRITICA'
    )
);

ALTER TABLE flyway_aula_301.ordem_servico
ALTER COLUMN prioridade
SET DEFAULT 'NORMAL';

ALTER TABLE flyway_aula_301.ordem_servico
ALTER COLUMN prioridade
SET NOT NULL;
```

A aula 300 separou expansão, backfill e endurecimento.

Aqui eles permanecem juntos apenas para manter o laboratório Flyway pequeno.

Em produção, a política expand and contract continua válida.

---

### 9. Criar V3__criar_indice_listagem.sql

Crie:

```text
migrations/V3__criar_indice_listagem.sql
```

Conteúdo:

```sql
CREATE INDEX idx_fly301_ordem_cliente_prioridade_data
ON flyway_aula_301.ordem_servico (
    cliente_id,
    prioridade,
    aberta_em DESC,
    id DESC
);
```

A migration possui uma responsabilidade única.

---

### 10. Criar a primeira versao da repeatable

Crie:

```text
migrations/R__vw_ordem_resumo.sql
```

Conteúdo inicial:

```sql
CREATE OR REPLACE VIEW
    flyway_aula_301.vw_ordem_resumo
AS
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    ordem.prioridade AS ordem_prioridade,
    ordem.aberta_em,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome
FROM flyway_aula_301.ordem_servico AS ordem
INNER JOIN flyway_aula_301.cliente AS cliente
    ON cliente.id = ordem.cliente_id;
```

A repeatable depende das colunas criadas por V1 e V2.

Ela será executada depois das versioned migrations.

---

### 11. Executar info antes de migrate

Na raiz do laboratório:

```powershell
.\scripts\flyway.ps1 -Command info
```

Observe:

```text
V1:
Pending.

V2:
Pending.

V3:
Pending.

R__vw_ordem_resumo:
Pending.
```

A apresentação exata pode variar conforme a versão da CLI.

O significado deve ser o mesmo.

---

### 12. Executar migrate

Execute:

```powershell
.\scripts\flyway.ps1 -Command migrate
```

Flyway deverá:

1. criar o schema;
2. criar `flyway_schema_history`;
3. aplicar V1;
4. aplicar V2;
5. aplicar V3;
6. executar a repeatable.

Depois:

```powershell
.\scripts\flyway.ps1 -Command info

.\scripts\flyway.ps1 -Command validate
```

`validate` deve concluir com sucesso.

---

### 13. Criar 01_inspecionar_schema_history.sql

Crie:

```text
sql/01_inspecionar_schema_history.sql
```

Conteúdo:

```sql
SELECT
    installed_rank,
    version,
    description,
    type,
    script,
    checksum,
    installed_by,
    installed_on,
    execution_time,
    success
FROM flyway_aula_301.flyway_schema_history
ORDER BY installed_rank;
```

Resultado esperado:

```text
V1;

V2;

V3;

repeatable.
```

A repeatable possui versão nula.

Não atualize a tabela manualmente.

---

### 14. Criar V4__adicionar_origem.sql

Agora crie:

```text
migrations/V4__adicionar_origem.sql
```

Conteúdo:

```sql
ALTER TABLE flyway_aula_301.ordem_servico
ADD COLUMN origem text NOT NULL
DEFAULT 'LEGADO';

ALTER TABLE flyway_aula_301.ordem_servico
ADD CONSTRAINT ck_fly301_ordem_origem
CHECK (
    origem IN (
        'LEGADO',
        'PORTAL',
        'API',
        'IMPORTACAO'
    )
);
```

Execute apenas:

```powershell
.\scripts\flyway.ps1 -Command info
```

V4 deve aparecer como pendente.

Não foi necessário registrar a versão manualmente.

---

### 15. Atualizar a repeatable

Substitua o conteúdo de:

```text
migrations/R__vw_ordem_resumo.sql
```

pela versão final:

```sql
CREATE OR REPLACE VIEW
    flyway_aula_301.vw_ordem_resumo
AS
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    ordem.prioridade AS ordem_prioridade,
    ordem.origem AS ordem_origem,
    ordem.aberta_em,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome
FROM flyway_aula_301.ordem_servico AS ordem
INNER JOIN flyway_aula_301.cliente AS cliente
    ON cliente.id = ordem.cliente_id;
```

Execute:

```powershell
.\scripts\flyway.ps1 -Command info
```

Agora devem existir duas necessidades:

```text
V4:
Pending.

R__vw_ordem_resumo:
Outdated ou pendente para nova execução.
```

Execute:

```powershell
.\scripts\flyway.ps1 -Command migrate

.\scripts\flyway.ps1 -Command validate
```

Flyway aplicará V4 antes de recriar a view.

---

### 16. Criar 02_validar_objetos.sql

Crie:

```text
sql/02_validar_objetos.sql
```

Conteúdo:

```sql
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'flyway_aula_301'
  AND table_name = 'ordem_servico'
ORDER BY ordinal_position;

SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'flyway_aula_301'
ORDER BY indexname;

SELECT
    installed_rank,
    version,
    description,
    type,
    script,
    success
FROM flyway_aula_301.flyway_schema_history
ORDER BY installed_rank;
```

Confirme:

- prioridade;
- origem;
- constraints;
- índice;
- V1 a V4;
- duas execuções históricas da repeatable.

A repeatable antiga permanece no histórico e a mais recente representa o estado atual.

---

### 17. Criar 03_validar_repeatable.sql

Crie:

```text
sql/03_validar_repeatable.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    ordem_prioridade,
    ordem_origem,
    aberta_em,
    cliente_id,
    cliente_codigo,
    cliente_nome
FROM flyway_aula_301.vw_ordem_resumo
ORDER BY ordem_id;

SELECT
    definition
FROM pg_views
WHERE schemaname = 'flyway_aula_301'
  AND viewname = 'vw_ordem_resumo';
```

A view deve devolver três Ordens e incluir `ordem_origem`.

---

### 18. Simular alteracao indevida de V2

Crie uma cópia descartável:

```powershell
Remove-Item `
  ".\simulations\checksum-migrations" `
  -Recurse `
  -Force `
  -ErrorAction SilentlyContinue

Copy-Item `
  ".\migrations" `
  ".\simulations\checksum-migrations" `
  -Recurse

Add-Content `
  ".\simulations\checksum-migrations\V2__adicionar_prioridade.sql" `
  "`n-- alteração indevida depois da aplicação"
```

Execute `validate` contra a cópia:

```powershell
.\scripts\flyway.ps1 `
  -Command validate `
  -MigrationsPath ".\simulations\checksum-migrations"
```

O comando deve falhar por incompatibilidade de checksum da V2.

O banco não foi alterado.

Remova a cópia:

```powershell
Remove-Item `
  ".\simulations\checksum-migrations" `
  -Recurse `
  -Force
```

Valide novamente com os arquivos oficiais:

```powershell
.\scripts\flyway.ps1 -Command validate
```

O resultado deve voltar ao sucesso.

Não use `repair` para aceitar a cópia adulterada.

---

### 19. Simular falha transacional

Copie as migrações corretas:

```powershell
Remove-Item `
  ".\simulations\failure-migrations" `
  -Recurse `
  -Force `
  -ErrorAction SilentlyContinue

Copy-Item `
  ".\migrations" `
  ".\simulations\failure-migrations" `
  -Recurse
```

Crie:

```text
simulations/failure-migrations/V5__falha_controlada.sql
```

Conteúdo:

```sql
ALTER TABLE flyway_aula_301.ordem_servico
ADD COLUMN coluna_temporaria text;

INSERT INTO flyway_aula_301.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    prioridade,
    origem,
    descricao_problema
)
VALUES (
    301999,
    'OS-FLY-FALHA',
    999999,
    'ABERTA',
    'NORMAL',
    'API',
    'Deve falhar por foreign key'
);
```

Execute:

```powershell
.\scripts\flyway.ps1 `
  -Command migrate `
  -MigrationsPath ".\simulations\failure-migrations"
```

A V5 deve falhar.

Como PostgreSQL suporta DDL transacional para essas instruções, a coluna temporária deve ser revertida.

---

### 20. Criar 04_verificar_falha_transacional.sql

Crie:

```text
sql/04_verificar_falha_transacional.sql
```

Conteúdo:

```sql
SELECT
    column_name
FROM information_schema.columns
WHERE table_schema = 'flyway_aula_301'
  AND table_name = 'ordem_servico'
  AND column_name = 'coluna_temporaria';

SELECT
    installed_rank,
    version,
    script,
    success
FROM flyway_aula_301.flyway_schema_history
WHERE version = '5'
ORDER BY installed_rank;
```

Resultado esperado no PostgreSQL:

```text
coluna ausente;

nenhuma V5 aplicada com sucesso.
```

Remova a cópia:

```powershell
Remove-Item `
  ".\simulations\failure-migrations" `
  -Recurse `
  -Force
```

Execute:

```powershell
.\scripts\flyway.ps1 -Command validate

.\scripts\flyway.ps1 -Command info
```

O estado oficial deve permanecer válido até V4.

---

### 21. Criar a documentacao

Em:

```text
docs/comandos-flyway.md
```

documente:

```text
info:
inspecionar estados.

migrate:
aplicar pendentes.

validate:
comparar histórico e arquivos.

repair:
corrigir histórico somente após investigação.

baseline:
iniciar controle de banco existente.

clean:
remover objetos de schemas configurados.
```

Em:

```text
docs/estados-historico.md
```

documente pelo menos:

- Pending;
- Success;
- Missing;
- Failed;
- Future;
- Outdated;
- Out of Order;
- Baseline.

Em:

```text
docs/politica-repair-baseline-clean.md
```

registre critérios de autorização, backup, revisão, ambiente e evidência.

Deixe explícito:

```text
clean:
proibido em produção.

repair:
não é ferramenta para esconder edição indevida.

baseline:
exige comprovação do estado existente.
```

---

### 22. Criar 05_exercicio.sql

Crie:

```text
sql/05_exercicio.sql
```

Use o arquivo para as validações do exercício guiado.

As novas migrações do exercício devem começar em:

```text
V5.
```

Não edite V1 a V4.

---

### 23. Criar 06_limpar_laboratorio.sql

Crie:

```text
sql/06_limpar_laboratorio.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS flyway_aula_301 CASCADE;
```

A limpeza é intencionalmente executada por `psql`.

`flyway clean` está desativado.

Execute somente depois do exercício e da inspeção final do histórico.

---

### 24. Criar 07_checkpoint_final.sql

Crie:

```text
sql/07_checkpoint_final.sql
```

Conteúdo:

```sql
SELECT
    to_regnamespace(
        'flyway_aula_301'
    ) AS schema_laboratorio;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_ordens,
    to_regclass(
        'projeto_os.vw_pagamento_pendente_backend'
    ) AS view_pagamentos;

SELECT
    (SELECT count(*) FROM projeto_os.cliente)
        AS clientes,
    (SELECT count(*) FROM projeto_os.produto)
        AS produtos,
    (SELECT count(*) FROM projeto_os.ordem_servico)
        AS ordens,
    (SELECT count(*) FROM projeto_os.atividade)
        AS atividades,
    (SELECT count(*) FROM projeto_os.pagamento)
        AS pagamentos;
```

Esperado:

```text
schema da aula:
NULL.

schema oficial:
existente.

views oficiais:
existentes.

contagens:
3, 3, 4, 7 e 5.
```

---

### 25. Criar README.md

Crie:

```text
README.md
```

Registre:

- versão da imagem;
- conexão local;
- preparação do arquivo de ambiente;
- uso do wrapper;
- convenção de nomes;
- ordem inicial;
- aplicação de V4;
- evolução da repeatable;
- inspeção do schema history;
- simulação de checksum;
- falha transacional;
- política de comandos perigosos;
- exercício;
- limpeza;
- ponte para a aula 302.

Inclua a regra:

```text
V1 a V4 são imutáveis depois de aplicadas;
correções devem criar nova versão.
```

---

## Entendendo o que foi feito

### O historico deixou de ser manual

Flyway criou e manteve:

```text
flyway_schema_history.
```

Não foi necessário inserir versões manualmente.

---

### Info mostrou o plano de aplicacao

Antes de `migrate`, foi possível ver scripts pendentes.

Depois, os estados mudaram para sucesso.

---

### Validate protegeu a imutabilidade

A cópia alterada de V2 produziu incompatibilidade de checksum.

O arquivo oficial permaneceu intacto.

---

### Repeatable evoluiu de forma esperada

A view foi recriada depois que seu conteúdo mudou.

Isso não foi tratado como violação.

Repeatables possuem um contrato diferente das versionadas.

---

### A falha foi revertida

A V5 de simulação adicionou uma coluna e depois violou foreign key.

No PostgreSQL, as mudanças daquela migration foram revertidas.

O histórico não declarou sucesso.

---

### Comandos perigosos ficaram sob politica

`repair`, `baseline` e `clean` foram compreendidos, mas não usados como atalhos.

A ferramenta não substitui governança.

---

## Erros comuns importantes

### Nomear migration com um sublinhado

Forma incorreta:

```text
V1_criar_tabela.sql
```

Forma padrão:

```text
V1__criar_tabela.sql
```

São dois sublinhados entre versão e descrição.

---

### Editar V2 depois do migrate

`validate` falha por checksum.

Crie V5 ou próxima versão.

---

### Usar repeatable para backfill historico

O script pode executar novamente e alterar dados indevidamente.

Use versioned migration para mudança única.

---

### Executar repair automaticamente

Você pode legitimar um histórico incorreto.

Investigue primeiro.

---

### Versionar arquivo local de credenciais

A senha entra no repositório.

Mantenha o arquivo real no `.gitignore`.

---

## Comandos uteis

### Informacao

```powershell
.\scripts\flyway.ps1 -Command info
```

### Migrar

```powershell
.\scripts\flyway.ps1 -Command migrate
```

### Validar

```powershell
.\scripts\flyway.ps1 -Command validate
```

### Consultar historico

```sql
SELECT *
FROM flyway_aula_301.flyway_schema_history
ORDER BY installed_rank;
```

---

## Exercicio guiado

As migrações oficiais V1 a V4 não podem ser editadas.

### Parte 1 - Criar V5

Crie:

```text
migrations/V5__adicionar_canal_atendimento.sql
```

Adicione:

```text
canal_atendimento text;
```

Valores:

```text
TELEFONE;
PORTAL;
API;
IMPORTACAO.
```

Faça backfill para:

```text
TELEFONE.
```

Aplique default, `CHECK` e `NOT NULL`.

---

### Parte 2 - Inspecionar pending

Antes do migrate:

```powershell
.\scripts\flyway.ps1 -Command info
```

Registre o estado da V5.

Depois execute `migrate`.

---

### Parte 3 - Evoluir a repeatable

Inclua:

```text
ordem_canal_atendimento
```

na view.

Execute:

```text
info;

migrate;

validate.
```

Confirme nova execução da repeatable.

---

### Parte 4 - Criar V6

Crie:

```text
migrations/V6__criar_indice_canal_data.sql
```

Índice:

```text
(canal_atendimento, aberta_em DESC, id DESC).
```

Documente a consulta candidata.

---

### Parte 5 - Simular checksum em V5

Copie a pasta de migrations.

Altere somente a cópia de V5.

Execute validate contra a cópia.

Confirme a falha.

Remova a simulação.

---

### Parte 6 - Estados do historico

Consulte:

```text
installed_rank;

version;

description;

type;

script;

checksum;

execution_time;

success.
```

Explique por que a repeatable possui versão nula.

---

### Parte 7 - Decidir repair

Escreva um parecer para o cenário:

```text
V5 foi editada depois de aplicada;
a mudança editada não foi executada em produção;
o banco está correto;
o repositório está incorreto.
```

A decisão esperada é restaurar o arquivo original, não executar `repair`.

---

### Parte 8 - Decidir baseline

Escreva um plano para adotar Flyway em um banco legado equivalente à versão 20.

Inclua:

- inventário;
- backup;
- DDL de referência;
- comparação;
- baselineVersion;
- primeira migration posterior;
- teste em cópia;
- aprovação.

Não execute baseline neste laboratório.

---

### Parte 9 - Reconstrucao

Limpe o schema.

Execute `migrate` com V1 a V6 e repeatable final.

Confirme que um banco vazio chega ao mesmo estado.

Depois execute o script de limpeza final.

---

## Criterios de aceite

- o laboratório oficial da aula 301 existe;
- o arquivo e o H1 seguem a grade;
- Flyway foi executado sem Spring;
- a imagem Docker foi fixada;
- credenciais locais não são versionadas;
- o wrapper PowerShell foi criado;
- o schema exclusivo foi configurado;
- versioned migrations seguem a convenção;
- o separador duplo foi compreendido;
- V1 a V4 foram aplicadas em ordem;
- a tabela `flyway_schema_history` foi inspecionada;
- `info` foi executado antes e depois;
- `migrate` aplicou somente pendentes;
- `validate` concluiu com sucesso na cadeia correta;
- a repeatable foi aplicada depois das versionadas;
- a repeatable foi reaplicada após mudança;
- uma edição indevida em cópia alterou o checksum;
- validate detectou a alteração;
- os arquivos oficiais permaneceram intactos;
- uma migration falha foi simulada;
- a alteração transacional foi revertida;
- `repair` foi compreendido sem uso indevido;
- `baseline` foi compreendido sem execução arriscada;
- `clean` permaneceu desativado;
- `outOfOrder` permaneceu desativado;
- V5 e V6 foram criadas no exercício;
- a cadeia completa foi reconstruída;
- o schema da aula foi removido;
- `projeto_os` e suas views foram preservados;
- estratégias completas de seed não foram antecipadas;
- documentação e README estão prontos;
- commit recomendado pode ser realizado.

---

## Commit recomendado

Na raiz:

```powershell
git status
git diff
```

Confirme que não aparece:

```text
config/flyway.local.env
```

Adicione:

```powershell
git add `
  labs/m12/aula-301-flyway-conceitual-antes-spring
```

Confira novamente:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): executar migracoes com flyway"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
Flyway CLI;

versioned migrations;

repeatable migration;

schema history;

checksum;

validate;

governança.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você conectou os conceitos de migração versionada a uma ferramenta real.

Aprendeu:

```text
Flyway sem Spring;

imagem Docker;

configuração por ambiente;

locations;

versioned migration;

repeatable migration;

info;

migrate;

validate;

schema history;

checksum;

falha transacional;

repair;

baseline;

clean.
```

As regras principais foram:

```text
Flyway executa scripts; ele não escreve SQL correto por você;

versioned migration aplicada é imutável;

repeatable executa novamente quando o checksum muda;

info mostra estados;

migrate aplica pendentes;

validate compara banco e projeto;

repair exige investigação;

baseline exige comprovação do legado;

clean não pertence à produção;

credenciais não pertencem ao Git;

migrações precisam ser reconstruíveis em banco vazio.
```

A próxima aula será:

```text
302 - M12.32 - Carga de massa seed e dados de teste
```

Nela, você vai estudar:

- diferença entre migração, seed e fixture;
- dados de referência;
- dados locais;
- massa de teste;
- geração determinística;
- `generate_series`;
- importação com `COPY`;
- CSV;
- carga em lotes;
- chaves e relacionamentos;
- idempotência;
- limpeza;
- anonimização;
- volume representativo;
- dados para performance;
- dados para testes automatizados.

A ferramenta de migração continuará no contexto, mas o foco mudará do schema para a qualidade e finalidade dos dados usados em desenvolvimento e testes.

---

# Material complementar

## Checkpoint final

- [ ] Executei Flyway via Docker sem Spring.
- [ ] Apliquei versioned e repeatable migrations.
- [ ] Validei checksum e falha transacional.
- [ ] Reconstruí, limpei e fiz o commit.

---

## Troubleshooting adicional

### Docker nao encontra o container PostgreSQL

Confirme:

```powershell
docker ps
```

O nome deve ser:

```text
formacao-postgres-m12.
```

### Connection refused

O PostgreSQL não está pronto ou não escuta na porta esperada.

Valide a conexão com `psql`.

### Unable to resolve location

O volume não foi montado ou `FLYWAY_LOCATIONS` aponta para caminho diferente.

Confirme `/flyway/sql`.

### Found more than one migration with version

Duas migrations usam a mesma versão.

Renomeie a nova para a próxima versão antes de aplicá-la.

### Validate failed checksum mismatch

Um arquivo aplicado foi alterado.

Restaure o conteúdo original ou investigue formalmente antes de qualquer repair.

---

## Perguntas de revisao

1. O que Flyway automatiza?
2. Flyway depende de Spring?
3. Qual a convenção de versioned migration?
4. Por que existem dois sublinhados?
5. O que é repeatable migration?
6. Quando ela executa novamente?
7. O que `info` mostra?
8. O que `migrate` faz?
9. O que `validate` compara?
10. O que é checksum?
11. Qual tabela guarda o histórico?
12. Por que não editar essa tabela?
13. Para que serve `repair`?
14. Por que ele é perigoso?
15. Para que serve `baseline`?
16. Por que baseline exige inventário?
17. O que `clean` faz?
18. Por que clean foi desativado?
19. O que acontece em falha transacional?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Descoberta, ordem, aplicação, histórico e validação.
2. Não.
3. `V<versao>__<descricao>.sql`.
4. É o separador padrão.
5. Script sem versão que pode reaplicar.
6. Quando o checksum muda.
7. Estados aplicados e pendentes.
8. Aplica migrations pendentes.
9. Histórico contra arquivos disponíveis.
10. Resumo do conteúdo.
11. `flyway_schema_history`.
12. É gerenciada pela ferramenta.
13. Reparar metadados do histórico.
14. Pode legitimar inconsistência.
15. Iniciar controle de banco existente.
16. O estado precisa corresponder à versão.
17. Remove objetos dos schemas configurados.
18. Para evitar destruição acidental.
19. PostgreSQL reverte a migration compatível com transação.
20. Carga de massa, seed e dados de teste.

---

## Desafio opcional

Modele um pipeline de banco com etapas:

```text
checkout;

subir PostgreSQL descartável;

flyway info;

flyway validate;

flyway migrate;

executar testes SQL;

gerar evidências;

destruir ambiente.
```

Documente:

- secrets;
- versão da imagem;
- timeout;
- logs;
- artefatos;
- falha;
- aprovação;
- execução em produção.

Não implemente CI/CD nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 301 - M12.31 - Flyway conceitual antes do Spring

- Executei Flyway diretamente por Docker, sem Spring.
- Fixei a versão da imagem usada no laboratório.
- Mantive credenciais locais fora do Git.
- Criei um wrapper PowerShell para os comandos.
- Configurei URL, schema, default schema e locations.
- Criei versioned migrations V1 a V4.
- Criei uma repeatable migration para uma view.
- Usei `info` para consultar estados.
- Usei `migrate` para aplicar somente scripts pendentes.
- Inspecionei `flyway_schema_history`.
- Usei `validate` para comparar histórico e arquivos.
- Entendi o checksum das migrations SQL.
- Simulei alteração indevida em uma cópia de V2.
- Confirmei falha de validação sem alterar o arquivo oficial.
- Evoluí uma repeatable e observei sua reaplicação.
- Simulei uma migration com falha transacional.
- Estudei critérios seguros para `repair`.
- Estudei adoção de Flyway por `baseline`.
- Mantive `clean` desativado.
- Reconstruí toda a cadeia em schema vazio.
- Próxima aula: carga de massa, seed e dados de teste.
```

---

## Referencia tecnica curta

```text
V:
versioned migration.

R:
repeatable migration.

info:
estado.

migrate:
aplicar.

validate:
comparar.

repair:
reparar histórico com governança.

baseline:
marcar ponto inicial.

clean:
destruir schemas configurados.

schema history:
auditoria do Flyway.

checksum:
detectar alteração.
```

Regra final:

```text
Flyway automatiza o controle das migracoes, mas a seguranca continua dependendo de scripts corretos, imutabilidade, configuracao protegida e governanca.
```
