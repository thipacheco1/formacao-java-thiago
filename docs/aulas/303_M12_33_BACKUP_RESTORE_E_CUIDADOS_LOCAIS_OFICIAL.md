# 303 - M12.33 - Backup restore e cuidados locais

## Apresentacao da aula

Na aula 302, você classificou dados de referência, seeds, fixtures, CSVs e massas sintéticas.

Também aprendeu que todo conjunto de dados precisa possuir:

```text
origem conhecida;
finalidade;
validação;
reprodutibilidade;
proteção;
estratégia de limpeza.
```

Agora o foco será a recuperação.

Considere uma situação comum:

```text
um comando removeu dados importantes;

um container foi recriado;

um volume local foi perdido;

uma migration produziu um resultado inesperado;

uma atualização exige banco separado para teste;

uma equipe precisa confirmar se o backup realmente restaura.
```

Ter um arquivo chamado “backup” não garante recuperação.

Um processo confiável precisa registrar origem, momento, versão das ferramentas, formato, local, acesso, integridade, destino, validação e duração da recuperação.

Nesta aula, você praticará backup lógico com:

```text
pg_dump;
pg_dumpall;
psql;
pg_restore.
```

Serão usados dois formatos principais:

```text
plain:
script SQL restaurado com psql.

custom:
arquivo de archive restaurado com pg_restore.
```

O laboratório criará três bancos isolados no mesmo container:

```text
formacao_java_a303_origem;

formacao_java_a303_restore_plain;

formacao_java_a303_restore_custom.
```

O banco oficial `formacao_java` não será usado como destino de restauração.

O banco de origem possuirá um schema determinístico com:

```text
3 Clientes;
2 Produtos;
4 Ordens;
5 Pagamentos;
1 view;
índices;
constraints;
sequences de identity.
```

Você vai:

1. criar o banco de origem;
2. gerar dumps plain e custom;
3. gerar recortes schema-only, data-only e table-only;
4. gerar uma cópia de objetos globais sem senhas;
5. listar o conteúdo do archive custom;
6. calcular SHA-256;
7. restaurar plain em um banco novo;
8. restaurar custom em outro banco novo;
9. validar contagens, somas, constraints, view e sequence;
10. medir o tempo do restore;
11. remover bancos e arquivos gerados.

O objetivo é aprender um procedimento seguro e verificável.

A próxima aula será:

```text
304 - M12.34 - Usuarios permissoes e seguranca basica no PostgreSQL
```

Por isso, roles e privilégios serão mencionados apenas no contexto do backup. A criação e administração de usuários será aprofundada na aula 304.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
301:
Flyway e histórico de migrations.

302:
seed, massa e dados de teste.

303:
backup, restore e cuidados locais.

304:
usuários, permissões e segurança básica.

305:
window functions para relatórios.
```

Migrations e backup resolvem problemas diferentes.

Migrations respondem:

```text
como reconstruir e evoluir a estrutura conhecida?
```

Backup responde:

```text
como preservar e recuperar um estado de dados existente?
```

Um conjunto de migrations não substitui os dados operacionais.

Um dump não substitui o histórico versionado de evolução.

Uma aplicação profissional normalmente precisa dos dois:

```text
migrations:
reconstroem o schema e suas mudanças.

backup:
protege dados e objetos do estado capturado.
```

Também é importante separar:

```text
backup;
réplica;
alta disponibilidade;
exportação;
arquivo CSV;
snapshot de infraestrutura.
```

Uma réplica pode receber imediatamente uma exclusão acidental.

Um CSV normalmente não preserva constraints, índices, sequences e views.

Um backup lógico não oferece, sozinho, recuperação para qualquer segundo da linha do tempo.

Cada mecanismo possui uma finalidade.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-303-backup-restore-cuidados-locais
```

Estrutura final:

```text
labs
└── m12
    └── aula-303-backup-restore-cuidados-locais
        ├── README.md
        ├── .gitignore
        ├── backups
        │   └── .gitkeep
        ├── docs
        │   ├── checklist-backup.md
        │   ├── manifesto-backup.md
        │   ├── plano-recuperacao.md
        │   └── politica-retencao.md
        ├── scripts
        │   ├── 01_preparar_banco_origem.ps1
        │   ├── 02_gerar_backups.ps1
        │   ├── 03_restaurar_plain.ps1
        │   ├── 04_restaurar_custom.ps1
        │   ├── 05_validar_hashes.ps1
        │   └── 06_limpar_laboratorio.ps1
        └── sql
            ├── 00_verificar_ambiente.sql
            ├── 01_criar_modelo_origem.sql
            ├── 02_validar_origem.sql
            ├── 03_validar_restore.sql
            ├── 04_validar_sequence.sql
            ├── 05_exercicio.sql
            └── 06_checkpoint_final.sql
```

Arquivos gerados durante a prática:

```text
a303_full_plain.sql;

a303_full_custom.dump;

a303_schema_only.sql;

a303_data_only.dump;

a303_pagamento_only.dump;

a303_globals_only.sql;

a303_full_custom.list;

arquivos .sha256.
```

Esses arquivos ficarão fora do Git.

---

## Conceito essencial

### Backup logico

Backup lógico descreve objetos e dados em nível SQL.

Ferramentas principais:

```text
pg_dump:
um database.

pg_dumpall:
todos os databases e objetos globais do cluster.

pg_restore:
archives não plain.

psql:
scripts plain.
```

O dump lógico é útil para:

- restore seletivo;
- migração entre servidores;
- atualização entre versões;
- cópia de schema;
- recuperação de tabelas;
- ambientes de teste.

Ele não é uma cópia byte a byte do diretório de dados.

---

### Backup fisico

Backup físico protege os arquivos do cluster e pode ser combinado com WAL para recuperação contínua, grandes volumes e réplicas. Esta aula não implementará backup físico nem PITR; o foco será o backup lógico local.

### pg_dump protege um database

`pg_dump` exporta um único database.

Ele pode gerar um dump consistente enquanto outras sessões leem e escrevem.

Isso não significa impacto zero:

- o processo consome CPU, I/O e rede;
- pode aguardar locks incompatíveis;
- dumps longos mantêm uma visão consistente por mais tempo;
- o tempo precisa ser medido.

`pg_dump` não inclui objetos globais do cluster, como roles e tablespaces.

Para esses objetos, existe `pg_dumpall`.

---

### pg_dumpall e objetos globais

`pg_dumpall` pode exportar:

```text
todos os databases;
roles;
tablespaces;
configurações globais relacionadas.
```

Nesta aula será usado:

```text
--globals-only;
--no-role-passwords.
```

O arquivo será inspecionado, mas não restaurado.

Restaurar objetos globais exige privilégios elevados e pode alterar o cluster inteiro.

A aula 304 aprofundará roles e permissões.

---

### Formato plain

Comando conceitual:

```text
pg_dump --format=plain.
```

O resultado é texto SQL.

Vantagens:

- pode ser aberto;
- pode ser revisado;
- pode ser versionado em cenários específicos sem dados sensíveis;
- pode ser restaurado com `psql`;
- permite edição manual em casos controlados.

Limitações:

- restore menos seletivo;
- não é usado diretamente por `pg_restore`;
- paralelismo de restore não é a principal opção;
- pode ocupar mais espaço sem compressão externa.

No laboratório, o plain será restaurado com:

```text
psql -X -v ON_ERROR_STOP=1 -f arquivo.sql.
```

---

### Formato custom

Comando conceitual:

```text
pg_dump --format=custom.
```

O resultado é um archive.

Vantagens:

- compressão por padrão;
- listagem de conteúdo;
- restore seletivo;
- reordenação por lista;
- suporte a restore paralelo;
- portabilidade entre arquiteturas.

Ele não é um script para `psql`.

A restauração usa:

```text
pg_restore.
```

Nesta aula:

```text
--jobs=2;
--exit-on-error;
--no-owner;
--no-privileges.
```

Como o arquivo é pequeno, o paralelismo não produzirá ganho relevante. Ele será praticado para demonstrar o recurso.

---

### Formato directory

O formato directory também é um archive.

É o único formato que suporta dump paralelo com `pg_dump --jobs`.

Ele também aceita restore paralelo.

Não será criado nesta aula para manter a prática compacta, mas fará parte do exercício.

---

### Schema only e data only

`--schema-only` inclui definições, sem os dados das tabelas.

Exemplos:

- schemas;
- tabelas;
- constraints;
- sequences;
- views;
- índices.

`--data-only` inclui dados e valores de sequences, sem criar a estrutura.

Um data-only dump precisa de destino compatível.

Ele não deve ser tratado como backup completo do database.

---

### Backup por schema e por tabela

Opções:

```text
--schema=backup_aula_303;

--table=backup_aula_303.pagamento.
```

Esses recortes são úteis para:

- extração seletiva;
- recuperação pontual;
- testes;
- transferência de um módulo.

Entretanto, um dump parcial pode depender de objetos não incluídos:

- tipos;
- tabelas pai;
- foreign keys;
- functions;
- extensions.

Sempre valide o restore do recorte no contexto pretendido.

---

### Owner e privileges

Dumps podem conter ownership e ACLs. O laboratório usa `--no-owner` e `--no-privileges` para restaurar com o usuário local. Isso melhora a portabilidade, mas não preserva o modelo original de segurança, que precisa de estratégia própria em produção.

### Banco vazio a partir de template0

O restore deve ocorrer em um banco limpo.

Nesta aula, cada destino será criado com:

```text
TEMPLATE template0.
```

Isso reduz o risco de objetos adicionais de um `template1` customizado produzirem duplicidade.

Não restaure sobre o database oficial apenas para “testar rapidamente”.

Crie um destino separado e nomeado de forma inequívoca.

---

### --clean e --if-exists

`--clean` remove objetos antes do restore e `--if-exists` reduz erros para objetos ausentes. Como podem destruir o destino errado, o laboratório cria databases novos e não precisa dessas opções.

### --create

`--create` recria o database registrado no dump. Como esta aula restaura em nomes diferentes, os destinos serão criados manualmente e passados por `-d`, evitando recriar a origem por engano.

### Compatibilidade de versoes

Use ferramentas da mesma major version do servidor ou cliente compatível mais novo. Um `pg_dump` mais antigo recusa servidor mais novo; restore em versão anterior não é garantido. Extensões, collations e sintaxe também precisam ser testadas.

### Consistencia e concorrencia

O dump de um database usa uma visão consistente sem bloquear leituras e escritas normais. Ele ainda consome recursos e pode aguardar locks incompatíveis. `pg_dumpall` usa snapshots independentes por database, portanto não garante um único instante consistente para todo o cluster.

### Arquivo custom nao e criptografia

Compressão não é criptografia.

Um arquivo custom pode conter:

- dados pessoais;
- tokens armazenados;
- segredos gravados incorretamente;
- valores financeiros;
- estrutura interna;
- nomes de Clientes.

Proteja backups com:

- criptografia em repouso;
- criptografia em trânsito;
- controle de acesso;
- segregação de credenciais;
- retenção;
- logs;
- cópias imutáveis;
- descarte seguro.

Os backups desta aula são fictícios e locais.

---

### SHA-256

O laboratório calculará SHA-256 para cada arquivo.

O hash ajuda a detectar alteração do arquivo em relação ao valor registrado.

Ele não prova:

- que o dump está completo;
- que as tabelas corretas foram incluídas;
- que a senha está segura;
- que o restore funciona;
- que o arquivo não contém dados indevidos.

Hash é uma evidência de integridade do arquivo, não uma validação funcional do backup.

---

### Backup so existe quando o restore foi testado

Validações mínimas:

```text
arquivo existe;

tamanho maior que zero;

hash confere;

archive pode ser listado;

restore termina sem erro;

contagens conferem;

somas conferem;

constraints existem;

view funciona;

sequence continua;

aplicação consegue consultar.
```

O laboratório realizará essas validações em dois databases separados.

---

### RPO e RTO

RPO responde:

```text
quanto de dados a organização aceita perder?
```

Um backup diário pode permitir perda de quase um dia.

RTO responde:

```text
quanto tempo a recuperação pode levar?
```

O tempo será medido no laboratório, mas o banco é pequeno.

Esse número não representa produção.

Ele apenas ensina a registrar início, fim e resultado.

---

### Retencao e copias

Uma política pode combinar backups diários, semanais e mensais, cópia fora do servidor, armazenamento imutável e testes periódicos. Um arquivo no mesmo disco ou apenas dentro do container não protege contra a perda desse ambiente.

### Docker e volumes

O database vive no volume do container.

O dump gerado em `/tmp` vive no filesystem do container.

Se o container for removido, esse arquivo pode desaparecer.

Por isso, o script:

1. gera o arquivo no container;
2. copia para a pasta local `backups`;
3. remove o temporário do container.

A pasta local estará no `.gitignore`.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-303-backup-restore-cuidados-locais\backups"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-303-backup-restore-cuidados-locais\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-303-backup-restore-cuidados-locais\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-303-backup-restore-cuidados-locais\sql"

Set-Location `
  "labs\m12\aula-303-backup-restore-cuidados-locais"

New-Item `
  -ItemType File `
  -Force `
  -Path ".\backups\.gitkeep"
```

---

### 2. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```text
backups/*
!backups/.gitkeep
*.dump
*.backup
*.sql.gz
*.sha256
```

Os dumps não devem entrar no Git.

---

### 3. Criar 00_verificar_ambiente.sql

Crie:

```text
sql/00_verificar_ambiente.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    version() AS versao_servidor;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_oficial;
```

Confirme também as ferramentas:

```powershell
docker exec formacao-postgres-m12 `
  pg_dump --version

docker exec formacao-postgres-m12 `
  pg_restore --version

docker exec formacao-postgres-m12 `
  psql --version
```

As versões principais devem ser compatíveis com o servidor.

---

### 4. Criar 01_criar_modelo_origem.sql

Crie:

```text
sql/01_criar_modelo_origem.sql
```

Conteúdo:

```sql
CREATE SCHEMA backup_aula_303;

CREATE TABLE backup_aula_303.cliente (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,

    CONSTRAINT pk_a303_cliente
        PRIMARY KEY (id),

    CONSTRAINT ck_a303_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_a303_cliente_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE backup_aula_303.produto (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,
    valor_referencia numeric(12, 2) NOT NULL,

    CONSTRAINT pk_a303_produto
        PRIMARY KEY (id),

    CONSTRAINT ck_a303_produto_valor
        CHECK (valor_referencia >= 0)
);

CREATE TABLE backup_aula_303.ordem_servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    produto_id bigint NOT NULL,
    status text NOT NULL,
    aberta_em timestamptz NOT NULL,
    valor_previsto numeric(12, 2) NOT NULL,

    CONSTRAINT pk_a303_ordem
        PRIMARY KEY (id),

    CONSTRAINT fk_a303_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES backup_aula_303.cliente (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_a303_ordem_produto
        FOREIGN KEY (produto_id)
        REFERENCES backup_aula_303.produto (id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_a303_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_a303_ordem_valor
        CHECK (valor_previsto >= 0)
);

CREATE TABLE backup_aula_303.pagamento (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    ordem_servico_id bigint NOT NULL,
    parcela smallint NOT NULL,
    status text NOT NULL,
    valor numeric(12, 2) NOT NULL,

    CONSTRAINT pk_a303_pagamento
        PRIMARY KEY (id),

    CONSTRAINT fk_a303_pagamento_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES backup_aula_303.ordem_servico (id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_a303_pagamento_parcela
        UNIQUE (
            ordem_servico_id,
            parcela
        ),

    CONSTRAINT ck_a303_pagamento_status
        CHECK (
            status IN (
                'PENDENTE',
                'PAGO',
                'CANCELADO'
            )
        ),

    CONSTRAINT ck_a303_pagamento_valor
        CHECK (valor > 0)
);

CREATE INDEX idx_a303_ordem_cliente_status
ON backup_aula_303.ordem_servico (
    cliente_id,
    status,
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_a303_pagamento_ordem_status
ON backup_aula_303.pagamento (
    ordem_servico_id,
    status,
    parcela
);

INSERT INTO backup_aula_303.cliente (
    id,
    codigo,
    nome
)
VALUES
    (
        101,
        'CLI-A303-001',
        'Cliente Backup Alfa'
    ),
    (
        102,
        'CLI-A303-002',
        'Cliente Backup Beta'
    ),
    (
        103,
        'CLI-A303-003',
        'Cliente Backup Gama'
    );

INSERT INTO backup_aula_303.produto (
    id,
    codigo,
    nome,
    valor_referencia
)
VALUES
    (
        201,
        'PROD-A303-001',
        'Produto Backup Alfa',
        1800.00
    ),
    (
        202,
        'PROD-A303-002',
        'Produto Backup Beta',
        3200.00
    );

INSERT INTO backup_aula_303.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    aberta_em,
    valor_previsto
)
VALUES
    (
        301,
        'OS-A303-001',
        101,
        201,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-07-01 09:00:00-03',
        500.00
    ),
    (
        302,
        'OS-A303-002',
        101,
        202,
        'EM_ATENDIMENTO',
        TIMESTAMPTZ '2026-07-02 10:00:00-03',
        900.00
    ),
    (
        303,
        'OS-A303-003',
        102,
        201,
        'ABERTA',
        TIMESTAMPTZ '2026-07-03 11:00:00-03',
        350.00
    ),
    (
        304,
        'OS-A303-004',
        103,
        202,
        'CANCELADA',
        TIMESTAMPTZ '2026-07-04 12:00:00-03',
        0.00
    );

INSERT INTO backup_aula_303.pagamento (
    id,
    ordem_servico_id,
    parcela,
    status,
    valor
)
VALUES
    (
        401,
        301,
        1,
        'PAGO',
        250.00
    ),
    (
        402,
        301,
        2,
        'PAGO',
        250.00
    ),
    (
        403,
        302,
        1,
        'PAGO',
        450.00
    ),
    (
        404,
        302,
        2,
        'PENDENTE',
        450.00
    ),
    (
        405,
        303,
        1,
        'PENDENTE',
        350.00
    );

SELECT setval(
    pg_get_serial_sequence(
        'backup_aula_303.cliente',
        'id'
    ),
    103,
    true
);

SELECT setval(
    pg_get_serial_sequence(
        'backup_aula_303.produto',
        'id'
    ),
    202,
    true
);

SELECT setval(
    pg_get_serial_sequence(
        'backup_aula_303.ordem_servico',
        'id'
    ),
    304,
    true
);

SELECT setval(
    pg_get_serial_sequence(
        'backup_aula_303.pagamento',
        'id'
    ),
    405,
    true
);

CREATE VIEW backup_aula_303.vw_ordem_resumo AS
WITH pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor) FILTER (
            WHERE status = 'PAGO'
        ) AS total_pago,
        sum(valor) FILTER (
            WHERE status = 'PENDENTE'
        ) AS total_pendente
    FROM backup_aula_303.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    produto.codigo AS produto_codigo,
    produto.nome AS produto_nome,
    ordem.valor_previsto,
    coalesce(
        pagamento.total_pago,
        0
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0
    ) AS total_pendente
FROM backup_aula_303.ordem_servico AS ordem
INNER JOIN backup_aula_303.cliente AS cliente
    ON cliente.id = ordem.cliente_id
INNER JOIN backup_aula_303.produto AS produto
    ON produto.id = ordem.produto_id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id;

ANALYZE backup_aula_303.cliente;
ANALYZE backup_aula_303.produto;
ANALYZE backup_aula_303.ordem_servico;
ANALYZE backup_aula_303.pagamento;
```

---

### 5. Criar 01_preparar_banco_origem.ps1

Crie:

```text
scripts/01_preparar_banco_origem.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java_a303_origem"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

docker exec $container `
    dropdb `
    --if-exists `
    -U formacao `
    $database

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao remover database de origem."
}

docker exec $container `
    createdb `
    -U formacao `
    -T template0 `
    -E UTF8 `
    $database

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao criar database de origem."
}

$sql = Join-Path `
    $labRoot `
    "sql\01_criar_modelo_origem.sql"

Get-Content -Raw $sql |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d $database

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao criar modelo de origem."
}

Write-Host "Database de origem preparado."
```

Execute:

```powershell
.\scripts\01_preparar_banco_origem.ps1
```

---

### 6. Criar 02_validar_origem.sql

Crie:

```text
sql/02_validar_origem.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco;

SELECT
    (SELECT count(*)
     FROM backup_aula_303.cliente)
        AS clientes,
    (SELECT count(*)
     FROM backup_aula_303.produto)
        AS produtos,
    (SELECT count(*)
     FROM backup_aula_303.ordem_servico)
        AS ordens,
    (SELECT count(*)
     FROM backup_aula_303.pagamento)
        AS pagamentos;

SELECT
    sum(valor) AS valor_total_pagamentos
FROM backup_aula_303.pagamento;

SELECT
    count(*) AS linhas_view,
    sum(total_pago) AS total_pago,
    sum(total_pendente) AS total_pendente
FROM backup_aula_303.vw_ordem_resumo;

SELECT
    indexname
FROM pg_indexes
WHERE schemaname = 'backup_aula_303'
ORDER BY indexname;
```

Resultados esperados:

```text
3 Clientes;
2 Produtos;
4 Ordens;
5 Pagamentos;
1750.00 em Pagamentos;
4 linhas na view;
950.00 pago;
800.00 pendente.
```

---

### 7. Criar 02_gerar_backups.ps1

Crie:

```text
scripts/02_gerar_backups.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java_a303_origem"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backupDir = Join-Path $labRoot "backups"

New-Item `
    -ItemType Directory `
    -Force `
    -Path $backupDir |
    Out-Null

$arquivos = @(
    "a303_full_plain.sql",
    "a303_full_custom.dump",
    "a303_schema_only.sql",
    "a303_data_only.dump",
    "a303_pagamento_only.dump",
    "a303_globals_only.sql",
    "a303_full_custom.list"
)

Get-ChildItem $backupDir |
    Where-Object {
        $_.Name -ne ".gitkeep"
    } |
    Remove-Item -Force

docker exec $container `
    pg_dump `
    -U formacao `
    -d $database `
    --format=plain `
    --no-owner `
    --no-privileges `
    --file=/tmp/a303_full_plain.sql

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao gerar dump plain."
}

docker exec $container `
    pg_dump `
    -U formacao `
    -d $database `
    --format=custom `
    --no-owner `
    --no-privileges `
    --file=/tmp/a303_full_custom.dump

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao gerar dump custom."
}

docker exec $container `
    pg_dump `
    -U formacao `
    -d $database `
    --format=plain `
    --schema-only `
    --schema=backup_aula_303 `
    --no-owner `
    --no-privileges `
    --file=/tmp/a303_schema_only.sql

docker exec $container `
    pg_dump `
    -U formacao `
    -d $database `
    --format=custom `
    --data-only `
    --schema=backup_aula_303 `
    --no-owner `
    --no-privileges `
    --file=/tmp/a303_data_only.dump

docker exec $container `
    pg_dump `
    -U formacao `
    -d $database `
    --format=custom `
    --table=backup_aula_303.pagamento `
    --no-owner `
    --no-privileges `
    --file=/tmp/a303_pagamento_only.dump

docker exec $container `
    pg_dumpall `
    -U formacao `
    --globals-only `
    --no-role-passwords `
    --no-owner `
    --file=/tmp/a303_globals_only.sql

docker exec $container `
    pg_restore `
    --list `
    --file=/tmp/a303_full_custom.list `
    /tmp/a303_full_custom.dump

foreach ($arquivo in $arquivos) {
    docker cp `
        "${container}:/tmp/$arquivo" `
        (Join-Path $backupDir $arquivo)

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao copiar $arquivo."
    }

    docker exec $container `
        rm -f "/tmp/$arquivo"
}

foreach ($arquivo in $arquivos) {
    $caminho = Join-Path $backupDir $arquivo
    $hash = Get-FileHash `
        -Path $caminho `
        -Algorithm SHA256

    (
        $hash.Hash.ToLower() +
        "  " +
        $arquivo
    ) |
    Set-Content `
        -Encoding ascii `
        -Path (
            $caminho +
            ".sha256"
        )
}

Write-Host "Backups, listagem e hashes gerados."
```

A geração acontece dentro do container.

A cópia binária ocorre com `docker cp`, evitando corrupção por redirecionamento de texto do PowerShell.

Execute:

```powershell
.\scripts\02_gerar_backups.ps1
```

---

### 8. Inspecionar os arquivos

Execute:

```powershell
Get-ChildItem .\backups |
    Sort-Object Name |
    Format-Table `
        Name,
        Length,
        LastWriteTime
```

Inspecione o plain:

```powershell
Get-Content `
  ".\backups\a303_full_plain.sql" `
  -TotalCount 40
```

Inspecione a listagem custom:

```powershell
Get-Content `
  ".\backups\a303_full_custom.list" `
  -TotalCount 80
```

Não tente abrir o `.dump` como texto.

---

### 9. Criar 05_validar_hashes.ps1

Crie:

```text
scripts/05_validar_hashes.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backupDir = Join-Path $labRoot "backups"

$hashFiles = Get-ChildItem `
    $backupDir `
    -Filter "*.sha256"

if ($hashFiles.Count -eq 0) {
    throw "Nenhum arquivo de hash encontrado."
}

foreach ($hashFile in $hashFiles) {
    $linha = (
        Get-Content `
            $hashFile.FullName `
            -Raw
    ).Trim()

    $partes = $linha -split "\s+", 2
    $esperado = $partes[0].ToLower()
    $nome = $partes[1].Trim()
    $arquivo = Join-Path $backupDir $nome

    if (-not (Test-Path $arquivo)) {
        throw "Arquivo ausente: $nome"
    }

    $atual = (
        Get-FileHash `
            $arquivo `
            -Algorithm SHA256
    ).Hash.ToLower()

    if ($atual -ne $esperado) {
        throw "Hash divergente: $nome"
    }

    Write-Host "OK: $nome"
}
```

Execute:

```powershell
.\scripts\05_validar_hashes.ps1
```

---

### 10. Criar 03_restaurar_plain.ps1

Crie:

```text
scripts/03_restaurar_plain.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java_a303_restore_plain"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backup = Join-Path `
    $labRoot `
    "backups\a303_full_plain.sql"
$remote = "/tmp/a303_full_plain.sql"

if (-not (Test-Path $backup)) {
    throw "Backup plain não encontrado."
}

docker cp `
    $backup `
    "${container}:$remote"

docker exec $container `
    dropdb `
    --if-exists `
    -U formacao `
    $database

docker exec $container `
    createdb `
    -U formacao `
    -T template0 `
    -E UTF8 `
    $database

$inicio = Get-Date

docker exec $container `
    psql `
    -X `
    -v ON_ERROR_STOP=1 `
    -U formacao `
    -d $database `
    -f $remote

if ($LASTEXITCODE -ne 0) {
    throw "Restore plain falhou."
}

docker exec $container `
    psql `
    -X `
    -v ON_ERROR_STOP=1 `
    -U formacao `
    -d $database `
    -c "ANALYZE;"

$fim = Get-Date
$duracao = $fim - $inicio

docker exec $container `
    rm -f $remote

Write-Host (
    "Restore plain concluído em " +
    [math]::Round(
        $duracao.TotalSeconds,
        3
    ) +
    " segundos."
)
```

O destino é sempre recriado.

Execute:

```powershell
.\scripts\03_restaurar_plain.ps1
```

---

### 11. Criar 04_restaurar_custom.ps1

Crie:

```text
scripts/04_restaurar_custom.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java_a303_restore_custom"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backup = Join-Path `
    $labRoot `
    "backups\a303_full_custom.dump"
$remote = "/tmp/a303_full_custom.dump"

if (-not (Test-Path $backup)) {
    throw "Backup custom não encontrado."
}

docker cp `
    $backup `
    "${container}:$remote"

docker exec $container `
    dropdb `
    --if-exists `
    -U formacao `
    $database

docker exec $container `
    createdb `
    -U formacao `
    -T template0 `
    -E UTF8 `
    $database

$inicio = Get-Date

docker exec $container `
    pg_restore `
    -U formacao `
    -d $database `
    --no-owner `
    --no-privileges `
    --exit-on-error `
    --jobs=2 `
    --verbose `
    $remote

if ($LASTEXITCODE -ne 0) {
    throw "Restore custom falhou."
}

docker exec $container `
    psql `
    -X `
    -v ON_ERROR_STOP=1 `
    -U formacao `
    -d $database `
    -c "ANALYZE;"

$fim = Get-Date
$duracao = $fim - $inicio

docker exec $container `
    rm -f $remote

Write-Host (
    "Restore custom concluído em " +
    [math]::Round(
        $duracao.TotalSeconds,
        3
    ) +
    " segundos."
)
```

Execute:

```powershell
.\scripts\04_restaurar_custom.ps1
```

---

### 12. Criar 03_validar_restore.sql

Crie:

```text
sql/03_validar_restore.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco;

DO $$
DECLARE
    v_clientes bigint;
    v_produtos bigint;
    v_ordens bigint;
    v_pagamentos bigint;
    v_total numeric(12, 2);
    v_view bigint;
BEGIN
    SELECT count(*)
    INTO v_clientes
    FROM backup_aula_303.cliente;

    SELECT count(*)
    INTO v_produtos
    FROM backup_aula_303.produto;

    SELECT count(*)
    INTO v_ordens
    FROM backup_aula_303.ordem_servico;

    SELECT count(*)
    INTO v_pagamentos
    FROM backup_aula_303.pagamento;

    SELECT sum(valor)
    INTO v_total
    FROM backup_aula_303.pagamento;

    SELECT count(*)
    INTO v_view
    FROM backup_aula_303.vw_ordem_resumo;

    IF v_clientes <> 3
       OR v_produtos <> 2
       OR v_ordens <> 4
       OR v_pagamentos <> 5
       OR v_total <> 1750.00
       OR v_view <> 4 THEN
        RAISE EXCEPTION
            'Restore inválido: %, %, %, %, %, %',
            v_clientes,
            v_produtos,
            v_ordens,
            v_pagamentos,
            v_total,
            v_view;
    END IF;
END
$$;

SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'backup_aula_303'
ORDER BY
    table_name,
    constraint_type,
    constraint_name;

SELECT
    indexname
FROM pg_indexes
WHERE schemaname = 'backup_aula_303'
ORDER BY indexname;

SELECT
    ordem_codigo,
    total_pago,
    total_pendente
FROM backup_aula_303.vw_ordem_resumo
ORDER BY ordem_id;
```

Execute nos dois destinos:

```powershell
Get-Content -Raw `
  ".\sql\03_validar_restore.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -X -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java_a303_restore_plain

Get-Content -Raw `
  ".\sql\03_validar_restore.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -X -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java_a303_restore_custom
```

---

### 13. Criar 04_validar_sequence.sql

Crie:

```text
sql/04_validar_sequence.sql
```

Conteúdo:

```sql
BEGIN;

DO $$
DECLARE
    v_id bigint;
BEGIN
    INSERT INTO backup_aula_303.cliente (
        codigo,
        nome
    )
    VALUES (
        'CLI-A303-SEQUENCE',
        'Teste de sequence'
    )
    RETURNING id
    INTO v_id;

    IF v_id <= 103 THEN
        RAISE EXCEPTION
            'Sequence não foi restaurada: %',
            v_id;
    END IF;

    RAISE NOTICE
        'Sequence válida. Novo ID: %',
        v_id;
END
$$;

ROLLBACK;
```

Execute nos dois restores.

A validação usa rollback e não altera o resultado final.

---

### 14. Validar constraint por comportamento

No destino custom:

```sql
BEGIN;

INSERT INTO backup_aula_303.pagamento (
    ordem_servico_id,
    parcela,
    status,
    valor
)
VALUES (
    301,
    3,
    'PAGO',
    -10.00
);

ROLLBACK;
```

A inserção deve falhar pela constraint de valor positivo.

Depois do erro, execute:

```sql
ROLLBACK;
```

Isso prova que a constraint foi restaurada e funciona.

---

### 15. Criar manifesto-backup.md

Em:

```text
docs/manifesto-backup.md
```

registre:

- database de origem;
- data e hora;
- versão do servidor;
- versão do `pg_dump`;
- formato;
- opções;
- tamanho;
- SHA-256;
- contagens esperadas;
- soma esperada;
- database de restore;
- duração;
- resultado;
- responsável;
- observações.

Não coloque senha.

---

### 16. Criar checklist-backup.md

Em:

```text
docs/checklist-backup.md
```

inclua:

- confirmar host;
- confirmar porta;
- confirmar database;
- confirmar usuário;
- verificar espaço;
- verificar versão;
- registrar início;
- capturar erros e warnings;
- copiar para armazenamento externo;
- gerar hash;
- limitar acesso;
- testar restore isolado;
- validar dados;
- validar sequences;
- executar `ANALYZE`;
- registrar duração;
- aplicar retenção;
- testar descarte.

---

### 17. Criar politica-retencao.md

Em:

```text
docs/politica-retencao.md
```

descreva uma política didática:

```text
diário:
7 dias.

semanal:
4 semanas.

mensal:
12 meses.
```

Inclua:

- cópia fora do servidor;
- criptografia;
- imutabilidade;
- acesso mínimo;
- monitoramento;
- teste trimestral de restore;
- descarte seguro.

Deixe claro que a política real depende de RPO, RTO, legislação e custo.

---

### 18. Criar plano-recuperacao.md

Em:

```text
docs/plano-recuperacao.md
```

registre:

1. declarar incidente;
2. impedir novas alterações quando necessário;
3. escolher ponto de recuperação;
4. selecionar backup;
5. verificar hash;
6. criar destino isolado;
7. restaurar;
8. executar validações;
9. testar aplicação;
10. aprovar troca;
11. documentar perdas;
12. preservar evidências.

Inclua a regra:

```text
nunca iniciar apagando o database original.
```

---

### 19. Criar 06_limpar_laboratorio.ps1

Crie:

```text
scripts/06_limpar_laboratorio.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$databases = @(
    "formacao_java_a303_restore_plain",
    "formacao_java_a303_restore_custom",
    "formacao_java_a303_origem"
)

foreach ($database in $databases) {
    docker exec $container `
        dropdb `
        --if-exists `
        -U formacao `
        $database

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao remover $database"
    }
}

$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backupDir = Join-Path $labRoot "backups"

Get-ChildItem $backupDir |
    Where-Object {
        $_.Name -ne ".gitkeep"
    } |
    Remove-Item -Force

Write-Host "Bancos e backups locais removidos."
```

Não execute antes do exercício e da documentação.

---

### 20. Criar 06_checkpoint_final.sql

Crie:

```text
sql/06_checkpoint_final.sql
```

Conteúdo:

```sql
SELECT
    datname
FROM pg_database
WHERE datname IN (
    'formacao_java_a303_origem',
    'formacao_java_a303_restore_plain',
    'formacao_java_a303_restore_custom'
)
ORDER BY datname;

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

Depois da limpeza:

```text
nenhum database da aula;

schema oficial preservado;

views oficiais preservadas;

contagens 3, 3, 4, 7 e 5.
```

---

## Entendendo o que foi feito

### Plain e custom representaram o mesmo estado

Os dois formatos protegeram os mesmos objetos e dados.

O processo de restore foi diferente:

```text
plain:
psql.

custom:
pg_restore.
```

---

### O restore nunca usou o banco oficial

Cada teste criou um database de destino a partir de `template0`.

Isso reduziu o risco de sobrescrever o ambiente principal.

---

### O hash protegeu o arquivo

A validação detectaria alteração posterior ao registro.

A recuperação funcional ainda precisou de restore e consultas.

---

### As sequences foram verificadas

Contagens corretas não garantem sequence correta.

O teste de novo `INSERT` confirmou que o próximo ID não colide com o seed restaurado.

---

### Objetos globais foram separados

`pg_dump` protegeu o database.

`pg_dumpall --globals-only` demonstrou que roles e tablespaces pertencem ao cluster.

O arquivo não foi restaurado.

---

### O RTO foi medido

Os scripts registraram o tempo de restore.

O valor local não foi extrapolado para produção.

---

## Erros comuns importantes

### Restaurar custom com psql

O archive não é um script SQL.

Use `pg_restore`.

---

### Restaurar plain com pg_restore

O plain deve ser executado por `psql`.

---

### Guardar backup apenas no container

A remoção do container pode apagar o arquivo.

Copie para armazenamento externo controlado.

---

### Confundir compressao com criptografia

Custom comprimido ainda contém dados sensíveis.

Proteja o arquivo.

---

### Validar somente o tamanho

Arquivo grande também pode estar incompleto ou incorreto.

Teste o restore.

---

## Comandos uteis

### Plain

```text
pg_dump --format=plain;
psql -f arquivo.sql.
```

### Custom

```text
pg_dump --format=custom;
pg_restore -d destino arquivo.dump.
```

### Listar archive

```text
pg_restore --list arquivo.dump.
```

### Globais

```text
pg_dumpall --globals-only.
```

### Hash no PowerShell

```powershell
Get-FileHash `
  -Algorithm SHA256 `
  -Path ".\backups\arquivo.dump"
```

---

## Exercicio guiado

Registre consultas e resultados em:

```text
sql/05_exercicio.sql
```

### Parte 1 - Backup por schema

Gere um custom dump contendo apenas:

```text
backup_aula_303.
```

Liste o archive.

Confirme que objetos fora do schema não aparecem.

---

### Parte 2 - Restore seletivo de tabela

Crie um database vazio.

Restaure primeiro o schema-only.

Depois restaure apenas:

```text
backup_aula_303.pagamento.
```

Analise as dependências e explique por que restaurar uma tabela filha isoladamente pode exigir tabelas pai e estrutura prévia.

---

### Parte 3 - Directory format

Gere um dump directory:

```text
--format=directory;
--jobs=2.
```

Copie a pasta do container com `docker cp`.

Restaure em outro database com dois jobs.

Remova o database e a pasta ao final.

---

### Parte 4 - Alteracao do arquivo

Faça uma cópia do plain.

Adicione um comentário à cópia.

Calcule o novo hash.

Confirme que ele difere do manifesto original.

Não altere o backup oficial.

---

### Parte 5 - Data only

Crie um database com o schema-only.

Restaure o data-only.

Valide:

- contagens;
- sequence;
- constraints;
- view.

Explique quais objetos vieram de cada arquivo.

---

### Parte 6 - Erro de destino

Escreva um checklist que impeça executar restore em:

```text
formacao_java.
```

Inclua confirmação digitada do nome do destino antes de comandos destrutivos.

---

### Parte 7 - RPO e RTO

Para um sistema que aceita:

```text
RPO de 15 minutos;

RTO de 1 hora.
```

explique por que um `pg_dump` diário não é suficiente.

Proponha uma estratégia conceitual sem implementar PITR.

---

### Parte 8 - Parecer

Compare:

```text
plain;

custom;

directory.
```

Critérios:

- inspeção;
- compressão;
- seletividade;
- dump paralelo;
- restore paralelo;
- simplicidade;
- uso local;
- uso em database grande.

---

## Criterios de aceite

- o laboratório oficial da aula 303 existe;
- o arquivo e o H1 seguem a grade;
- backup lógico foi diferenciado de físico;
- `pg_dump` foi praticado;
- `pg_dumpall --globals-only` foi praticado;
- formato plain foi gerado;
- formato custom foi gerado;
- schema-only foi gerado;
- data-only foi gerado;
- table-only foi gerado;
- o custom archive foi listado;
- os arquivos foram copiados com `docker cp`;
- redirecionamento binário inseguro foi evitado;
- SHA-256 foi calculado;
- hashes foram validados;
- plain foi restaurado com `psql`;
- custom foi restaurado com `pg_restore`;
- restore paralelo foi praticado;
- os destinos foram criados com `template0`;
- o database oficial não foi usado como destino;
- `--no-owner` foi compreendido;
- `--no-privileges` foi compreendido;
- contagens foram comparadas;
- somas foram comparadas;
- constraints foram inspecionadas;
- uma constraint foi validada por comportamento;
- a view restaurada foi consultada;
- sequences foram testadas;
- `ANALYZE` foi executado após o restore;
- duração foi registrada;
- RPO e RTO foram compreendidos;
- compressão foi diferenciada de criptografia;
- política de retenção foi documentada;
- plano de recuperação foi documentado;
- os três databases da aula foram removidos;
- arquivos gerados foram removidos;
- `projeto_os` foi preservado;
- usuários e permissões da aula 304 não foram antecipados;
- README e diário de bordo estão prontos;
- commit recomendado pode ser realizado.

---

## Commit recomendado

Antes de adicionar:

```powershell
git status
git diff
```

Confirme que dumps e hashes não aparecem.

Adicione:

```powershell
git add `
  labs/m12/aula-303-backup-restore-cuidados-locais
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): praticar backup e restore local"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
pg_dump;
pg_restore;
plain;
custom;
hash;
restore isolado;
validação;
retenção.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou um dump em um procedimento de recuperação testado.

Aprendeu:

```text
backup lógico;
backup físico conceitual;
pg_dump;
pg_dumpall;
plain;
custom;
directory;
schema-only;
data-only;
table-only;
psql;
pg_restore;
SHA-256;
RPO;
RTO;
retenção;
restore isolado.
```

As regras principais foram:

```text
pg_dump protege um database;

pg_dumpall protege o cluster e objetos globais;

plain usa psql;

custom usa pg_restore;

custom comprimido não está criptografado;

hash não substitui restore;

backup no mesmo servidor não é suficiente;

restore deve ocorrer primeiro em destino isolado;

template0 oferece um database limpo;

contagens não bastam: valide constraints, views e sequences;

um backup só é confiável depois de recuperação testada.
```

A próxima aula será:

```text
304 - M12.34 - Usuarios permissoes e seguranca basica no PostgreSQL
```

Nela, você vai estudar:

- roles;
- usuários com login;
- roles de grupo;
- `CREATE ROLE`;
- `GRANT`;
- `REVOKE`;
- ownership;
- privilégios de database;
- schema;
- tabela;
- sequence;
- `USAGE`;
- `CONNECT`;
- princípio do menor privilégio;
- usuário da aplicação;
- usuário de migration;
- usuário somente leitura;
- `ALTER DEFAULT PRIVILEGES`;
- validação por conexão real.

Os arquivos `globals-only` desta aula mostraram que segurança também precisa de estratégia de recuperação.

A aula 304 aprofundará o desenho desses acessos.

---

# Material complementar

## Checkpoint final

- [ ] Gerei plain, custom e recortes de backup.
- [ ] Validei hashes e listei o archive.
- [ ] Restaurei em dois databases isolados.
- [ ] Validei dados, objetos e sequences.
- [ ] Limpei databases, arquivos e fiz o commit.

---

## Troubleshooting adicional

### pg_dump: server version mismatch

O cliente é mais antigo que o servidor.

Use ferramentas da mesma major version ou versão compatível mais nova.

### pg_restore: input file appears to be a text format dump

O arquivo é plain.

Use `psql`.

### psql mostra caracteres estranhos

Verifique encoding do database, cliente e arquivo.

Não edite o dump custom.

### Permission denied durante restore

O usuário não pode criar schemas ou objetos necessários.

Revise owner, privileges e usuário do destino.

### Database is being accessed by other users

Existem conexões abertas e o `dropdb` não consegue remover o destino.

Feche as sessões do laboratório antes de limpar.

---

## Perguntas de revisao

1. O que é backup lógico?
2. O que é backup físico?
3. O que `pg_dump` protege?
4. O que ele não protege?
5. Para que serve `pg_dumpall`?
6. Qual ferramenta restaura plain?
7. Qual ferramenta restaura custom?
8. O que o formato custom oferece?
9. Qual formato suporta dump paralelo?
10. O que `--schema-only` inclui?
11. O que `--data-only` inclui?
12. Para que serve `--no-owner`?
13. Para que serve `--no-privileges`?
14. Por que criar destino com `template0`?
15. O que SHA-256 comprova?
16. O que ele não comprova?
17. O que é RPO?
18. O que é RTO?
19. Por que validar sequence?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Exportação de objetos e dados em nível lógico.
2. Cópia dos arquivos do cluster.
3. Um database.
4. Roles e tablespaces globais.
5. Cluster e objetos globais.
6. `psql`.
7. `pg_restore`.
8. Seletividade, compressão e restore paralelo.
9. Directory.
10. Definições sem dados.
11. Dados e valores de sequences.
12. Ignorar owners originais.
13. Ignorar ACLs originais.
14. Evitar objetos adicionais do template.
15. Que o arquivo corresponde ao hash registrado.
16. Que o restore funciona.
17. Perda máxima de dados aceitável.
18. Tempo máximo de recuperação.
19. Evitar colisão no próximo insert.
20. Usuários, permissões e segurança básica.

---

## Desafio opcional

Projete a política de uma aplicação com:

```text
database de 500 GB;

crescimento diário de 5 GB;

RPO de 15 minutos;

RTO de 1 hora;

retenção legal de 7 anos;

operação 24x7.
```

Responda:

- pg_dump diário é suficiente?
- qual é o papel do backup físico?
- qual é o papel do WAL?
- onde armazenar?
- como criptografar?
- como impedir exclusão por credencial comprometida?
- como testar restore?
- como medir RTO?
- como separar backup operacional de arquivo legal?
- como aplicar retenção?

Não implemente PITR nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 303 - M12.33 - Backup restore e cuidados locais

- Diferenciei backup lógico de backup físico.
- Usei `pg_dump` para proteger um database.
- Usei `pg_dumpall --globals-only` para inspecionar objetos globais.
- Gerei dump plain e archive custom.
- Gerei recortes schema-only, data-only e table-only.
- Entendi que plain é restaurado com `psql`.
- Entendi que custom é restaurado com `pg_restore`.
- Listei o conteúdo do archive custom.
- Copiei arquivos binários com `docker cp`.
- Calculei e validei hashes SHA-256.
- Criei destinos separados a partir de `template0`.
- Restaurei plain em database isolado.
- Restaurei custom com dois jobs.
- Validei contagens e somas.
- Inspecionei constraints e índices.
- Validei uma constraint por comportamento.
- Consultei a view restaurada.
- Confirmei a continuidade das sequences.
- Executei `ANALYZE` depois do restore.
- Registrei o tempo de recuperação.
- Documentei retenção, manifesto e plano de recuperação.
- Removi databases e arquivos do laboratório.
- Próxima aula: usuários, permissões e segurança básica.
```

---

## Referencia tecnica curta

```text
pg_dump:
um database.

pg_dumpall:
cluster e globais.

plain:
psql.

custom:
pg_restore.

directory:
dump e restore paralelos.

schema-only:
estrutura.

data-only:
dados.

template0:
destino limpo.

SHA-256:
integridade do arquivo.

RPO:
perda aceitável.

RTO:
tempo de recuperação.
```

Regra final:

```text
backup confiavel e aquele que possui origem conhecida, arquivo protegido, integridade registrada e restore validado em destino isolado.
```
