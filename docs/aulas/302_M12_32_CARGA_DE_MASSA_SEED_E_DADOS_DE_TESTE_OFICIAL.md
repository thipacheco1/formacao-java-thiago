# 302 - M12.32 - Carga de massa seed e dados de teste

## Apresentacao da aula

Na aula 301, você executou Flyway diretamente por Docker e aprendeu a controlar a evolução do schema com:

```text
versioned migrations;

repeatable migrations;

schema history;

checksum;

info;

migrate;

validate.
```

Agora o foco muda da estrutura do banco para os dados usados em desenvolvimento, testes e análise.

Nem todo dado inserido em um ambiente possui a mesma finalidade.

Considere estes exemplos:

```text
status ABERTA e CONCLUIDA;

um Cliente e uma Ordem usados em um teste de integração;

cem mil Ordens usadas para analisar paginação;

um CSV recebido de outro sistema;

uma cópia de produção para reproduzir um defeito.
```

Todos são dados, mas não devem ser tratados da mesma forma.

Nesta aula, você vai diferenciar:

- dados de referência;
- seed local;
- fixture de teste;
- massa sintética;
- importação externa;
- staging;
- cópia anonimizada;
- dados reais de produção.

Também praticará:

```text
INSERT com ON CONFLICT;

generate_series;

CSV;

\copy;

staging;

validação anterior à carga;

merge transacional;

ANALYZE;

limpeza controlada;

reexecução idempotente.
```

O laboratório criará o schema descartável `dados_teste_aula_302`, contendo dados de referência, Clientes, Produtos, Ordens, Atividades, tabelas de staging e uma cópia mascarada.

A carga final terá aproximadamente:

```text
1.006 Clientes;

205 Produtos;

100.006 Ordens;

300.003 Atividades.
```

Todo o processo será determinístico, com IDs reservados, datas fixas, regras previsíveis e nenhuma dependência de `random()`.

Ao final, o schema será removido.

A próxima aula será:

```text
303 - M12.33 - Backup restore e cuidados locais
```

Por isso, esta aula não realizará backup nem restauração. Ela preparará a disciplina necessária para saber exatamente quais dados existem, de onde vieram e como podem ser reconstruídos.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
300:
scripts versionados e migrações conceituais.

301:
Flyway antes do Spring.

302:
carga de massa, seed e dados de teste.

303:
backup, restore e cuidados locais.

304:
usuários, permissões e segurança inicial.
```

As aulas 300 e 301 responderam:

```text
como o schema evolui?
```

A aula 302 responde:

```text
como os ambientes recebem dados adequados à sua finalidade?
```

Esses temas se relacionam, mas não são iguais.

Uma migration pode criar:

```text
tabela;

constraint;

índice;

dado de referência obrigatório.
```

Ela não deve necessariamente carregar:

```text
cem mil Ordens de performance;

Clientes fictícios locais;

dados específicos de um teste;

cópia de produção.
```

A política precisa separar dados obrigatórios da aplicação, dados locais, fixtures, massas recriáveis, informações que exigem anonimização e arquivos proibidos no Git.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-302-carga-massa-seed-dados-teste
```

Estrutura final:

```text
labs
└── m12
    └── aula-302-carga-massa-seed-dados-teste
        ├── README.md
        ├── .gitignore
        ├── data
        │   ├── clientes_importacao.csv
        │   ├── ordens_importacao.csv
        │   └── produtos_importacao.csv
        ├── docs
        │   ├── checklist-carga.md
        │   ├── classificacao-dados.md
        │   ├── contrato-dataset.md
        │   └── politica-dados-teste.md
        ├── scripts
        │   └── carregar-csv.ps1
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_limpar_laboratorio.sql
            ├── 02_criar_schema_e_tabelas.sql
            ├── 03_seed_dados_referencia.sql
            ├── 04_seed_cenario_local.sql
            ├── 05_criar_staging.sql
            ├── 06_carregar_csv_staging.sql
            ├── 07_validar_e_mesclar_csv.sql
            ├── 08_gerar_massa_sintetica.sql
            ├── 09_criar_indices_e_analisar.sql
            ├── 10_validar_integridade_e_perfil.sql
            ├── 11_verificar_idempotencia.sql
            ├── 12_criar_copia_anonimizada.sql
            ├── 13_exercicio.sql
            ├── 14_limpar_laboratorio.sql
            └── 15_checkpoint_final.sql
```

Faixas de IDs:

```text
seed local:
302101 em diante.

CSV:
302001 em diante.

Clientes sintéticos:
400001 a 401000.

Produtos sintéticos:
500001 a 500200.

Ordens sintéticas:
600001 a 700000.

Atividades sintéticas:
derivadas do ID da Ordem.
```

Regras de segurança:

- não use dados reais;
- não copie documento, e-mail ou telefone de produção;
- execute a carga somente no schema da aula;
- valide staging antes do merge;
- mantenha o CSV no repositório apenas porque ele é fictício;
- remova arquivos temporários do container;
- execute a limpeza ao final.

---

## Conceito essencial

### Dado de referencia

Dado de referência representa valores necessários para o funcionamento do domínio.

Exemplos:

```text
status da Ordem;

tipos de origem;

categorias obrigatórias;

códigos de moeda.
```

Características:

- pequeno;
- estável;
- conhecido;
- compartilhado;
- necessário em todos os ambientes.

Pode ser versionado com o schema quando sua existência faz parte da aplicação.

Exemplo:

```text
ABERTA;
AGENDADA;
EM_ATENDIMENTO;
CONCLUIDA;
CANCELADA.
```

A decisão entre versioned e repeatable migration depende da política.

Se a alteração representa evento histórico único, use versioned migration.

Se a tabela precisa ser reconciliada continuamente com um conjunto declarativo pequeno, uma repeatable cuidadosamente idempotente pode ser adequada.

---

### Seed

Seed inicializa um ambiente com dados úteis.

Exemplos:

- Cliente fictício;
- Produto fictício;
- Ordem usada em demonstração;
- usuário local de desenvolvimento;
- configuração de sandbox.

Seed não significa automaticamente “dado de produção”.

Um seed local pode:

- existir apenas em desenvolvimento;
- ser executado depois das migrations;
- ser removido e recriado;
- usar IDs reservados;
- possuir dados claramente fictícios.

Não misture seed local com migration obrigatória sem uma decisão explícita.

---

### Fixture

Fixture é um conjunto pequeno construído para um cenário de teste.

Exemplo:

```text
uma Ordem com duas Atividades;

um Pagamento vencido;

um Cliente sem Ordens.
```

Características:

- mínima;
- específica;
- criada perto do teste;
- limpa depois;
- independente de outros testes;
- orientada a uma expectativa.

Um teste não deve depender de uma massa local gigante quando precisa apenas de três linhas.

Fixtures pequenas tornam falhas mais fáceis de entender.

---

### Massa sintetica

Massa sintética representa volume sem copiar pessoas reais. Ela serve para performance, paginação e testes de limite. Deve ser determinística, documentada, válida, removível e grande apenas o suficiente para o objetivo.

### Dados de producao

Dados de produção podem conter informações pessoais, financeiras e estratégicas. A regra padrão é não copiá-los para desenvolvimento.

Uma exceção formal exige autorização, minimização, anonimização, acesso restrito, criptografia, retenção definida, descarte e auditoria. Trocar apenas o nome não garante anonimização, pois outros atributos podem permitir reidentificação.

### Dados deterministas, relogio fixo e chaves reservadas

Um dataset determinístico produz o mesmo resultado a cada execução. Use IDs previsíveis e datas fixas quando o teste depende de vencimento, ordenação ou volume.

Faixas reservadas ajudam a identificar origem, validar contagens e limpar o laboratório. Elas são uma convenção de teste, não uma regra de negócio de produção.

### Ordem de carga

Foreign keys definem uma ordem natural:

```text
status;

Clientes e Produtos;

Ordens;

Atividades.
```

Para remover:

```text
Atividades;

Ordens;

Produtos e Clientes;

status.
```

Uma carga que ignora dependências falha ou precisa desativar integridade.

Não desative constraints para “facilitar” uma carga sem um plano rigoroso.

---

### INSERT unitario e em lote

Um comando por linha aumenta parsing, comunicação e transações. Poucos registros podem usar `INSERT` com várias linhas; grandes arquivos costumam favorecer `COPY`. A escolha depende de volume, fonte, validação e transformação.

### COPY e barra copy

`COPY` é um comando do servidor PostgreSQL.

Ele lê um arquivo acessível ao processo do servidor.

`\copy` é um comando do cliente `psql`.

Ele lê um arquivo acessível ao cliente e envia os dados ao servidor.

No laboratório:

1. o CSV local será copiado para `/tmp` do container;
2. `psql` será executado no mesmo container;
3. `\copy` lerá o arquivo;
4. os dados entrarão em staging.

Isso evita conceder ao usuário da aplicação acesso amplo a arquivos do servidor.

---

### Staging

Staging recebe dados externos antes das tabelas finais.

Vantagens:

- validar formato;
- detectar duplicidade;
- conferir referências;
- comparar contagens;
- transformar valores;
- rejeitar lote inteiro;
- preservar evidência da importação durante o diagnóstico.

As tabelas de staging desta aula não terão foreign keys.

Elas representarão o conteúdo recebido.

As tabelas finais continuarão protegidas.

---

### Validar antes do merge

Verificações:

```text
IDs duplicados;

códigos duplicados;

campos vazios;

valores negativos;

status inexistentes;

Cliente inexistente;

Produto inexistente;

timestamp inválido.
```

O CSV precisa ser sintaticamente aceito antes de chegar ao staging.

Depois, regras semânticas são validadas por SQL.

Somente então ocorre o merge.

---

### ON CONFLICT e idempotencia

Um seed idempotente pode ser reexecutado sem duplicar o efeito:

```sql
INSERT ...
ON CONFLICT (codigo)
DO UPDATE SET
    nome = excluded.nome;
```

Trate apenas conflitos de uma chave conhecida. O mesmo ID associado a outro código deve continuar falhando.

### Merge transacional

A sequência será:

```text
validar staging;

BEGIN;

inserir ou atualizar Clientes;

inserir ou atualizar Produtos;

resolver foreign keys das Ordens;

inserir ou atualizar Ordens;

COMMIT.
```

Se uma Ordem referencia um código inexistente, a validação interrompe antes do merge.

O lote não deve deixar metade dos dados aplicada.

---

### generate_series

`generate_series` cria uma sequência de valores.

Exemplo:

```sql
SELECT g
FROM generate_series(1, 100000) AS serie(g);
```

Ela pode alimentar um `INSERT ... SELECT`.

Ela oferece velocidade, controle de quantidade e fórmulas determinísticas, mas não substitui um gerador completo de dados de negócio. As fórmulas ainda precisam produzir valores válidos e distribuição coerente.

---

### Distribuicao dos valores

A massa precisa representar a pergunta do teste. Nesta aula, os status seguem regras determinísticas e não uma distribuição uniforme. Em estudos reais, compare proporções sintéticas com métricas agregadas de produção, sem copiar pessoas ou registros reais.

### Criar indices antes ou depois

Índices mantidos durante uma carga grande geram trabalho por linha. Em um schema descartável, pode ser melhor carregar primeiro e criar índices secundários depois. Em produção, remover índices pode ser inaceitável; a decisão exige plano operacional.

### ANALYZE depois da carga

Depois de inserir centenas de milhares de linhas:

```sql
ANALYZE schema.tabela;
```

O planejador precisa conhecer:

- cardinalidade;
- distribuição;
- valores comuns;
- correlação.

Sem estatísticas, testes de performance podem produzir planos artificiais.

---

### Limpeza

Todo dataset precisa de descarte. Esta aula remove o schema exclusivo com `DROP SCHEMA ... CASCADE`. Essa estratégia só é aceitável porque nenhum objeto compartilhado pertence ao schema.

### Anonimizacao, mascaramento e pseudonimizacao

Mascaramento altera a apresentação; pseudonimização substitui identificadores; anonimização busca impedir reidentificação. O laboratório cria apenas uma cópia sintética mascarada, não uma certificação jurídica de anonimização.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-302-carga-massa-seed-dados-teste\data"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-302-carga-massa-seed-dados-teste\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-302-carga-massa-seed-dados-teste\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-302-carga-massa-seed-dados-teste\sql"

Set-Location `
  "labs\m12\aula-302-carga-massa-seed-dados-teste"
```

---

### 2. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```text
data/private/
data/generated/
*.dump
*.backup
```

Arquivos privados, gerados ou de backup não podem entrar no Git por padrão.

---

### 3. Criar 00_verificar_pre_requisitos.sql

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
        'dados_teste_aula_302'
    ) AS schema_laboratorio;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_oficial;
```

O schema oficial deve existir.

O schema da aula pode ser nulo.

---

### 4. Criar 01_limpar_laboratorio.sql

Crie:

```text
sql/01_limpar_laboratorio.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS dados_teste_aula_302 CASCADE;
```

Esse script reinicia somente o laboratório.

---

### 5. Criar 02_criar_schema_e_tabelas.sql

Crie:

```text
sql/02_criar_schema_e_tabelas.sql
```

Conteúdo:

```sql
CREATE SCHEMA dados_teste_aula_302;

CREATE TABLE dados_teste_aula_302.status_ordem (
    codigo text PRIMARY KEY,
    descricao text NOT NULL,
    ordem_exibicao smallint NOT NULL UNIQUE,
    ativo boolean NOT NULL DEFAULT true,

    CONSTRAINT ck_a302_status_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_a302_status_descricao
        CHECK (btrim(descricao) <> '')
);

CREATE TABLE dados_teste_aula_302.cliente (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,
    email text,
    origem_dado text NOT NULL,

    CONSTRAINT ck_a302_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_a302_cliente_nome
        CHECK (btrim(nome) <> ''),

    CONSTRAINT ck_a302_cliente_origem
        CHECK (
            origem_dado IN (
                'SEED',
                'CSV',
                'SINTETICO'
            )
        )
);

CREATE TABLE dados_teste_aula_302.produto (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,
    valor_referencia numeric(12, 2) NOT NULL,
    origem_dado text NOT NULL,

    CONSTRAINT ck_a302_produto_valor
        CHECK (valor_referencia >= 0),

    CONSTRAINT ck_a302_produto_origem
        CHECK (
            origem_dado IN (
                'SEED',
                'CSV',
                'SINTETICO'
            )
        )
);

CREATE TABLE dados_teste_aula_302.ordem_servico (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    produto_id bigint NOT NULL,
    status_codigo text NOT NULL,
    aberta_em timestamptz NOT NULL,
    valor_previsto numeric(12, 2) NOT NULL,
    origem text NOT NULL,

    CONSTRAINT fk_a302_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES dados_teste_aula_302.cliente (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_a302_ordem_produto
        FOREIGN KEY (produto_id)
        REFERENCES dados_teste_aula_302.produto (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_a302_ordem_status
        FOREIGN KEY (status_codigo)
        REFERENCES dados_teste_aula_302.status_ordem (codigo)
        ON DELETE RESTRICT,

    CONSTRAINT ck_a302_ordem_valor
        CHECK (valor_previsto >= 0),

    CONSTRAINT ck_a302_ordem_origem
        CHECK (
            origem IN (
                'SEED',
                'CSV',
                'SINTETICO'
            )
        )
);

CREATE TABLE dados_teste_aula_302.atividade (
    id bigint PRIMARY KEY,
    ordem_servico_id bigint NOT NULL,
    sequencia smallint NOT NULL,
    descricao text NOT NULL,
    status text NOT NULL,
    valor_mao_obra numeric(12, 2) NOT NULL,

    CONSTRAINT fk_a302_atividade_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES dados_teste_aula_302.ordem_servico (id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_a302_atividade_ordem_sequencia
        UNIQUE (
            ordem_servico_id,
            sequencia
        ),

    CONSTRAINT ck_a302_atividade_sequencia
        CHECK (sequencia > 0),

    CONSTRAINT ck_a302_atividade_status
        CHECK (
            status IN (
                'PENDENTE',
                'EM_EXECUCAO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_a302_atividade_valor
        CHECK (valor_mao_obra >= 0)
);
```

Ainda não existem índices secundários.

---

### 6. Criar 03_seed_dados_referencia.sql

Crie:

```text
sql/03_seed_dados_referencia.sql
```

Conteúdo:

```sql
INSERT INTO dados_teste_aula_302.status_ordem (
    codigo,
    descricao,
    ordem_exibicao,
    ativo
)
VALUES
    (
        'ABERTA',
        'Ordem aberta',
        1,
        true
    ),
    (
        'AGENDADA',
        'Ordem agendada',
        2,
        true
    ),
    (
        'EM_ATENDIMENTO',
        'Ordem em atendimento',
        3,
        true
    ),
    (
        'CONCLUIDA',
        'Ordem concluída',
        4,
        true
    ),
    (
        'CANCELADA',
        'Ordem cancelada',
        5,
        true
    )
ON CONFLICT (codigo)
DO UPDATE SET
    descricao = excluded.descricao,
    ordem_exibicao = excluded.ordem_exibicao,
    ativo = excluded.ativo;
```

O script pode ser reexecutado sem duplicar status.

---

### 7. Criar 04_seed_cenario_local.sql

Crie:

```text
sql/04_seed_cenario_local.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO dados_teste_aula_302.cliente (
    id,
    codigo,
    nome,
    email,
    origem_dado
)
VALUES
    (
        302101,
        'CLI-SEED-001',
        'Cliente Seed Alfa',
        'alfa.seed@example.invalid',
        'SEED'
    ),
    (
        302102,
        'CLI-SEED-002',
        'Cliente Seed Beta',
        NULL,
        'SEED'
    )
ON CONFLICT (codigo)
DO UPDATE SET
    nome = excluded.nome,
    email = excluded.email,
    origem_dado = excluded.origem_dado;

INSERT INTO dados_teste_aula_302.produto (
    id,
    codigo,
    nome,
    valor_referencia,
    origem_dado
)
VALUES
    (
        303101,
        'PROD-SEED-001',
        'Produto Seed Alfa',
        1200.00,
        'SEED'
    ),
    (
        303102,
        'PROD-SEED-002',
        'Produto Seed Beta',
        1800.00,
        'SEED'
    )
ON CONFLICT (codigo)
DO UPDATE SET
    nome = excluded.nome,
    valor_referencia = excluded.valor_referencia,
    origem_dado = excluded.origem_dado;

INSERT INTO dados_teste_aula_302.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status_codigo,
    aberta_em,
    valor_previsto,
    origem
)
VALUES
    (
        304101,
        'OS-SEED-001',
        302101,
        303101,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-07-01 09:00:00-03',
        300.00,
        'SEED'
    ),
    (
        304102,
        'OS-SEED-002',
        302102,
        303102,
        'AGENDADA',
        TIMESTAMPTZ '2026-07-02 10:00:00-03',
        450.00,
        'SEED'
    )
ON CONFLICT (codigo)
DO UPDATE SET
    cliente_id = excluded.cliente_id,
    produto_id = excluded.produto_id,
    status_codigo = excluded.status_codigo,
    aberta_em = excluded.aberta_em,
    valor_previsto = excluded.valor_previsto,
    origem = excluded.origem;

INSERT INTO dados_teste_aula_302.atividade (
    id,
    ordem_servico_id,
    sequencia,
    descricao,
    status,
    valor_mao_obra
)
VALUES
    (
        305101,
        304101,
        1,
        'Diagnóstico do cenário seed',
        'CONCLUIDA',
        100.00
    ),
    (
        305102,
        304101,
        2,
        'Reparo do cenário seed',
        'CONCLUIDA',
        200.00
    ),
    (
        305103,
        304102,
        1,
        'Visita agendada do cenário seed',
        'PENDENTE',
        150.00
    )
ON CONFLICT (
    ordem_servico_id,
    sequencia
)
DO UPDATE SET
    descricao = excluded.descricao,
    status = excluded.status,
    valor_mao_obra = excluded.valor_mao_obra;

COMMIT;
```

Esse conjunto é uma fixture local pequena e compreensível.

---

### 8. Criar 05_criar_staging.sql

Crie:

```text
sql/05_criar_staging.sql
```

Conteúdo:

```sql
CREATE TABLE dados_teste_aula_302.stg_cliente_csv (
    id bigint,
    codigo text,
    nome text,
    email text
);

CREATE TABLE dados_teste_aula_302.stg_produto_csv (
    id bigint,
    codigo text,
    nome text,
    valor_referencia numeric(12, 2)
);

CREATE TABLE dados_teste_aula_302.stg_ordem_csv (
    id bigint,
    codigo text,
    cliente_codigo text,
    produto_codigo text,
    status_codigo text,
    aberta_em timestamptz,
    valor_previsto numeric(12, 2),
    origem text
);
```

As tabelas representam a entrada, ainda sem integridade final.

---

### 9. Criar os CSVs

Crie:

```text
data/clientes_importacao.csv
```

Conteúdo:

```csv
id,codigo,nome,email
302001,CLI-CSV-001,Cliente CSV Alfa,alfa.csv@example.invalid
302002,CLI-CSV-002,Cliente CSV Beta,beta.csv@example.invalid
302003,CLI-CSV-003,Cliente CSV Gama,gama.csv@example.invalid
302004,CLI-CSV-004,Cliente CSV Delta,
```

Crie:

```text
data/produtos_importacao.csv
```

Conteúdo:

```csv
id,codigo,nome,valor_referencia
303001,PROD-CSV-001,Produto CSV Alfa,2100.00
303002,PROD-CSV-002,Produto CSV Beta,3200.00
303003,PROD-CSV-003,Produto CSV Gama,4700.00
```

Crie:

```text
data/ordens_importacao.csv
```

Conteúdo:

```csv
id,codigo,cliente_codigo,produto_codigo,status_codigo,aberta_em,valor_previsto,origem
304001,OS-CSV-001,CLI-CSV-001,PROD-CSV-001,ABERTA,2026-07-03 09:00:00-03,250.00,CSV
304002,OS-CSV-002,CLI-CSV-002,PROD-CSV-002,EM_ATENDIMENTO,2026-07-04 10:00:00-03,550.00,CSV
304003,OS-CSV-003,CLI-CSV-003,PROD-CSV-003,CONCLUIDA,2026-07-05 11:00:00-03,800.00,CSV
304004,OS-CSV-004,CLI-CSV-004,PROD-CSV-001,CANCELADA,2026-07-06 12:00:00-03,0.00,CSV
```

Todos os dados são fictícios.

O domínio `.invalid` existe para exemplos e não deve receber e-mail real.

---

### 10. Criar 06_carregar_csv_staging.sql

Crie:

```text
sql/06_carregar_csv_staging.sql
```

Conteúdo:

```sql
TRUNCATE TABLE
    dados_teste_aula_302.stg_cliente_csv,
    dados_teste_aula_302.stg_produto_csv,
    dados_teste_aula_302.stg_ordem_csv;

\copy dados_teste_aula_302.stg_cliente_csv (id, codigo, nome, email) FROM '/tmp/aula302_clientes_importacao.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')

\copy dados_teste_aula_302.stg_produto_csv (id, codigo, nome, valor_referencia) FROM '/tmp/aula302_produtos_importacao.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')

\copy dados_teste_aula_302.stg_ordem_csv (id, codigo, cliente_codigo, produto_codigo, status_codigo, aberta_em, valor_previsto, origem) FROM '/tmp/aula302_ordens_importacao.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')
```

As linhas iniciadas por barra invertida são comandos do `psql`, não SQL do servidor.

---

### 11. Criar scripts/carregar-csv.ps1

Crie:

```text
scripts/carregar-csv.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

$arquivos = @(
    @{
        Local = "data\clientes_importacao.csv"
        Container = "/tmp/aula302_clientes_importacao.csv"
    },
    @{
        Local = "data\produtos_importacao.csv"
        Container = "/tmp/aula302_produtos_importacao.csv"
    },
    @{
        Local = "data\ordens_importacao.csv"
        Container = "/tmp/aula302_ordens_importacao.csv"
    }
)

foreach ($arquivo in $arquivos) {
    $origem = Join-Path `
        $labRoot `
        $arquivo.Local

    docker cp `
        $origem `
        "${container}:$($arquivo.Container)"

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao copiar $origem"
    }
}

$sql = Join-Path `
    $labRoot `
    "sql\06_carregar_csv_staging.sql"

Get-Content -Raw $sql |
    docker exec -i $container `
        psql `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d formacao_java

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao carregar CSVs no staging"
}

foreach ($arquivo in $arquivos) {
    docker exec `
        $container `
        rm -f `
        $arquivo.Container
}

Write-Host "CSVs carregados e temporários removidos."
```

Execute na raiz do laboratório:

```powershell
.\scripts\carregar-csv.ps1
```

---

### 12. Criar 07_validar_e_mesclar_csv.sql

Crie:

```text
sql/07_validar_e_mesclar_csv.sql
```

Conteúdo:

```sql
DO $$
BEGIN
    IF EXISTS (
        SELECT id
        FROM dados_teste_aula_302.stg_cliente_csv
        GROUP BY id
        HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION
            'CSV de Clientes possui ID duplicado';
    END IF;

    IF EXISTS (
        SELECT codigo
        FROM dados_teste_aula_302.stg_cliente_csv
        GROUP BY codigo
        HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION
            'CSV de Clientes possui código duplicado';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM dados_teste_aula_302.stg_produto_csv
        WHERE valor_referencia < 0
    ) THEN
        RAISE EXCEPTION
            'CSV de Produtos possui valor negativo';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM dados_teste_aula_302.stg_ordem_csv AS ordem
        LEFT JOIN dados_teste_aula_302.stg_cliente_csv AS cliente
            ON cliente.codigo = ordem.cliente_codigo
        LEFT JOIN dados_teste_aula_302.cliente AS cliente_existente
            ON cliente_existente.codigo = ordem.cliente_codigo
        WHERE cliente.codigo IS NULL
          AND cliente_existente.codigo IS NULL
    ) THEN
        RAISE EXCEPTION
            'Ordem referencia Cliente inexistente';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM dados_teste_aula_302.stg_ordem_csv AS ordem
        LEFT JOIN dados_teste_aula_302.stg_produto_csv AS produto
            ON produto.codigo = ordem.produto_codigo
        LEFT JOIN dados_teste_aula_302.produto AS produto_existente
            ON produto_existente.codigo = ordem.produto_codigo
        WHERE produto.codigo IS NULL
          AND produto_existente.codigo IS NULL
    ) THEN
        RAISE EXCEPTION
            'Ordem referencia Produto inexistente';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM dados_teste_aula_302.stg_ordem_csv AS ordem
        LEFT JOIN dados_teste_aula_302.status_ordem AS status
            ON status.codigo = ordem.status_codigo
        WHERE status.codigo IS NULL
    ) THEN
        RAISE EXCEPTION
            'Ordem possui status inexistente';
    END IF;
END
$$;

BEGIN;

INSERT INTO dados_teste_aula_302.cliente (
    id,
    codigo,
    nome,
    email,
    origem_dado
)
SELECT
    id,
    codigo,
    nome,
    nullif(
        btrim(email),
        ''
    ),
    'CSV'
FROM dados_teste_aula_302.stg_cliente_csv
ON CONFLICT (codigo)
DO UPDATE SET
    nome = excluded.nome,
    email = excluded.email,
    origem_dado = excluded.origem_dado;

INSERT INTO dados_teste_aula_302.produto (
    id,
    codigo,
    nome,
    valor_referencia,
    origem_dado
)
SELECT
    id,
    codigo,
    nome,
    valor_referencia,
    'CSV'
FROM dados_teste_aula_302.stg_produto_csv
ON CONFLICT (codigo)
DO UPDATE SET
    nome = excluded.nome,
    valor_referencia = excluded.valor_referencia,
    origem_dado = excluded.origem_dado;

INSERT INTO dados_teste_aula_302.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status_codigo,
    aberta_em,
    valor_previsto,
    origem
)
SELECT
    ordem.id,
    ordem.codigo,
    cliente.id,
    produto.id,
    ordem.status_codigo,
    ordem.aberta_em,
    ordem.valor_previsto,
    ordem.origem
FROM dados_teste_aula_302.stg_ordem_csv AS ordem
INNER JOIN dados_teste_aula_302.cliente AS cliente
    ON cliente.codigo = ordem.cliente_codigo
INNER JOIN dados_teste_aula_302.produto AS produto
    ON produto.codigo = ordem.produto_codigo
ON CONFLICT (codigo)
DO UPDATE SET
    cliente_id = excluded.cliente_id,
    produto_id = excluded.produto_id,
    status_codigo = excluded.status_codigo,
    aberta_em = excluded.aberta_em,
    valor_previsto = excluded.valor_previsto,
    origem = excluded.origem;

COMMIT;
```

Se o merge falhar, a transação não deixa um lote parcial.

---

### 13. Criar 08_gerar_massa_sintetica.sql

Crie:

```text
sql/08_gerar_massa_sintetica.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO dados_teste_aula_302.cliente (
    id,
    codigo,
    nome,
    email,
    origem_dado
)
SELECT
    400000 + g,
    'CLI-SINT-' || lpad(
        g::text,
        6,
        '0'
    ),
    'Cliente Sintético ' || g,
    'cliente+' || g || '@example.invalid',
    'SINTETICO'
FROM generate_series(
    1,
    1000
) AS serie(g)
ON CONFLICT (id)
DO NOTHING;

INSERT INTO dados_teste_aula_302.produto (
    id,
    codigo,
    nome,
    valor_referencia,
    origem_dado
)
SELECT
    500000 + g,
    'PROD-SINT-' || lpad(
        g::text,
        4,
        '0'
    ),
    'Produto Sintético ' || g,
    (
        500
        + g * 7.5
    )::numeric(12, 2),
    'SINTETICO'
FROM generate_series(
    1,
    200
) AS serie(g)
ON CONFLICT (id)
DO NOTHING;

INSERT INTO dados_teste_aula_302.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status_codigo,
    aberta_em,
    valor_previsto,
    origem
)
SELECT
    600000 + g,
    'OS-SINT-' || lpad(
        g::text,
        6,
        '0'
    ),
    400001 + (
        (g - 1) % 1000
    ),
    500001 + (
        (g - 1) % 200
    ),
    CASE
        WHEN g % 25 = 0
            THEN 'CANCELADA'
        WHEN g % 5 = 0
            THEN 'CONCLUIDA'
        WHEN g % 3 = 0
            THEN 'EM_ATENDIMENTO'
        WHEN g % 2 = 0
            THEN 'AGENDADA'
        ELSE 'ABERTA'
    END,
    TIMESTAMPTZ '2026-01-01 00:00:00-03'
        + g * INTERVAL '1 minute',
    (
        150
        + g % 3500
    )::numeric(12, 2),
    'SINTETICO'
FROM generate_series(
    1,
    100000
) AS serie(g)
ON CONFLICT (id)
DO NOTHING;

INSERT INTO dados_teste_aula_302.atividade (
    id,
    ordem_servico_id,
    sequencia,
    descricao,
    status,
    valor_mao_obra
)
SELECT
    ordem.id * 10 + sequencia.numero,
    ordem.id,
    sequencia.numero::smallint,
    'Atividade sintética '
        || sequencia.numero,
    CASE
        WHEN ordem.status_codigo = 'CONCLUIDA'
            THEN 'CONCLUIDA'
        WHEN ordem.status_codigo = 'CANCELADA'
            THEN 'CANCELADA'
        WHEN sequencia.numero = 1
            THEN 'EM_EXECUCAO'
        ELSE 'PENDENTE'
    END,
    (
        40
        + sequencia.numero * 30
        + ordem.id % 100
    )::numeric(12, 2)
FROM dados_teste_aula_302.ordem_servico AS ordem
CROSS JOIN generate_series(
    1,
    3
) AS sequencia(numero)
WHERE ordem.origem = 'SINTETICO'
ON CONFLICT (id)
DO NOTHING;

COMMIT;
```

A reexecução não altera as contagens.

---

### 14. Criar 09_criar_indices_e_analisar.sql

Crie:

```text
sql/09_criar_indices_e_analisar.sql
```

Conteúdo:

```sql
CREATE INDEX idx_a302_ordem_status_data
ON dados_teste_aula_302.ordem_servico (
    status_codigo,
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_a302_ordem_cliente_data
ON dados_teste_aula_302.ordem_servico (
    cliente_id,
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_a302_atividade_ordem_status
ON dados_teste_aula_302.atividade (
    ordem_servico_id,
    status
);

ANALYZE dados_teste_aula_302.cliente;
ANALYZE dados_teste_aula_302.produto;
ANALYZE dados_teste_aula_302.ordem_servico;
ANALYZE dados_teste_aula_302.atividade;
```

Execute apenas uma vez depois da carga.

Se precisar reconstruir, use a limpeza e repita a cadeia completa.

---

### 15. Criar 10_validar_integridade_e_perfil.sql

Crie:

```text
sql/10_validar_integridade_e_perfil.sql
```

Conteúdo:

```sql
SELECT
    (SELECT count(*)
     FROM dados_teste_aula_302.status_ordem)
        AS status,
    (SELECT count(*)
     FROM dados_teste_aula_302.cliente)
        AS clientes,
    (SELECT count(*)
     FROM dados_teste_aula_302.produto)
        AS produtos,
    (SELECT count(*)
     FROM dados_teste_aula_302.ordem_servico)
        AS ordens,
    (SELECT count(*)
     FROM dados_teste_aula_302.atividade)
        AS atividades;

SELECT
    origem_dado,
    count(*) AS quantidade
FROM dados_teste_aula_302.cliente
GROUP BY origem_dado
ORDER BY origem_dado;

SELECT
    origem,
    status_codigo,
    count(*) AS quantidade
FROM dados_teste_aula_302.ordem_servico
GROUP BY
    origem,
    status_codigo
ORDER BY
    origem,
    status_codigo;

SELECT
    count(*) AS ordens_sem_cliente
FROM dados_teste_aula_302.ordem_servico AS ordem
LEFT JOIN dados_teste_aula_302.cliente AS cliente
    ON cliente.id = ordem.cliente_id
WHERE cliente.id IS NULL;

SELECT
    count(*) AS ordens_sem_produto
FROM dados_teste_aula_302.ordem_servico AS ordem
LEFT JOIN dados_teste_aula_302.produto AS produto
    ON produto.id = ordem.produto_id
WHERE produto.id IS NULL;

SELECT
    count(*) AS atividades_sem_ordem
FROM dados_teste_aula_302.atividade AS atividade
LEFT JOIN dados_teste_aula_302.ordem_servico AS ordem
    ON ordem.id = atividade.ordem_servico_id
WHERE ordem.id IS NULL;

SELECT
    min(aberta_em) AS primeira_ordem,
    max(aberta_em) AS ultima_ordem,
    min(valor_previsto) AS menor_valor,
    max(valor_previsto) AS maior_valor
FROM dados_teste_aula_302.ordem_servico
WHERE origem = 'SINTETICO';
```

Contagens esperadas:

```text
5 status;

1.006 Clientes;

205 Produtos;

100.006 Ordens;

300.003 Atividades.
```

As três contagens de órfãos devem ser zero.

---

### 16. Criar 11_verificar_idempotencia.sql

Crie:

```text
sql/11_verificar_idempotencia.sql
```

Conteúdo:

```sql
SELECT
    'antes_da_reexecucao' AS momento,
    (SELECT count(*)
     FROM dados_teste_aula_302.status_ordem)
        AS status,
    (SELECT count(*)
     FROM dados_teste_aula_302.cliente)
        AS clientes,
    (SELECT count(*)
     FROM dados_teste_aula_302.produto)
        AS produtos,
    (SELECT count(*)
     FROM dados_teste_aula_302.ordem_servico)
        AS ordens,
    (SELECT count(*)
     FROM dados_teste_aula_302.atividade)
        AS atividades;
```

Depois:

1. reexecute `03_seed_dados_referencia.sql`;
2. reexecute `04_seed_cenario_local.sql`;
3. reexecute `carregar-csv.ps1`;
4. reexecute `07_validar_e_mesclar_csv.sql`;
5. reexecute `08_gerar_massa_sintetica.sql`;
6. execute novamente a consulta de contagem.

Não reexecute a criação dos índices.

As contagens devem permanecer iguais.

---

### 17. Criar 12_criar_copia_anonimizada.sql

Crie:

```text
sql/12_criar_copia_anonimizada.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS
    dados_teste_aula_302.cliente_anonimizado;

CREATE TABLE
    dados_teste_aula_302.cliente_anonimizado
AS
SELECT
    id,
    codigo,
    'Cliente Teste '
        || lpad(
            row_number() OVER (
                ORDER BY id
            )::text,
            6,
            '0'
        ) AS nome,
    'cliente+'
        || id
        || '@example.invalid'
        AS email
FROM dados_teste_aula_302.cliente;

ALTER TABLE
    dados_teste_aula_302.cliente_anonimizado
ADD CONSTRAINT pk_a302_cliente_anonimizado
PRIMARY KEY (id);

SELECT
    count(*) AS quantidade,
    count(DISTINCT email) AS emails_unicos
FROM dados_teste_aula_302.cliente_anonimizado;

SELECT
    id,
    codigo,
    nome,
    email
FROM dados_teste_aula_302.cliente_anonimizado
ORDER BY id
LIMIT 10;
```

Os IDs são preservados para permitir relacionamentos em uma cópia completa.

Os nomes e e-mails são substituídos por dados sintéticos.

Isso é uma demonstração técnica, não uma certificação de anonimização.

---

### 18. Criar a documentacao

Em:

```text
docs/classificacao-dados.md
```

classifique:

- referência;
- seed;
- fixture;
- CSV;
- massa sintética;
- cópia anonimizada;
- produção.

Em:

```text
docs/contrato-dataset.md
```

documente:

- quantidades;
- faixas de IDs;
- datas;
- distribuição de status;
- relações;
- finalidade;
- limitações.

Em:

```text
docs/politica-dados-teste.md
```

registre:

- proibição de dados reais sem autorização;
- minimização;
- anonimização;
- retenção;
- descarte;
- segregação;
- revisão antes do commit;
- domínios de e-mail reservados;
- ausência de credenciais.

Em:

```text
docs/checklist-carga.md
```

inclua:

- origem;
- encoding;
- delimitador;
- header;
- quantidade esperada;
- duplicidades;
- nulos;
- referências;
- transação;
- contagem final;
- órfãos;
- estatísticas;
- limpeza.

---

## Entendendo o que foi feito

### Cada tipo de dado recebeu uma finalidade

Status representam referência.

O cenário pequeno representa fixture local.

Os CSVs representam integração externa.

`generate_series` representa massa de volume.

A cópia mascarada demonstra proteção de atributos.

---

### O staging protegeu as tabelas finais

Os CSVs foram carregados sem foreign keys.

As referências foram validadas antes do merge.

Somente o lote válido chegou ao modelo final.

---

### A massa foi reproduzivel

IDs, datas, valores e status seguiram fórmulas conhecidas.

A reexecução manteve as quantidades.

---

### Os indices foram criados depois

A massa não precisou manter índices secundários durante cada inserção.

Depois, as estatísticas foram atualizadas.

---

### A limpeza ficou simples

Todo o laboratório pertence a um schema exclusivo.

O descarte não depende de localizar cada linha individual.

---

## Erros comuns importantes

### Usar dado real como seed

Informações pessoais podem entrar no Git e em máquinas sem controle.

Use dados fictícios.

---

### Inserir direto na tabela final

Um lote inválido pode aplicar parcialmente ou produzir erro difícil de diagnosticar.

Use staging e transação.

---

### Gerar datas com agora

O resultado muda em cada execução.

Use relógio fixo quando o teste depende do tempo.

---

### Usar random sem seed

A falha pode não ser reproduzida.

Prefira fórmulas determinísticas.

---

### Desativar foreign keys para carregar

Você pode produzir órfãos.

Respeite a ordem e valide referências.

---

## Comandos uteis

### Gerar sequencia

```sql
SELECT *
FROM generate_series(1, 1000);
```

### Importar por psql

```text
\copy schema.tabela FROM '/tmp/arquivo.csv'
WITH (FORMAT csv, HEADER true)
```

### Upsert

```sql
INSERT ...
ON CONFLICT (codigo)
DO UPDATE SET ...;
```

### Atualizar estatisticas

```sql
ANALYZE schema.tabela;
```

---

## Exercicio guiado

Use:

```text
sql/13_exercicio.sql
```

para registrar consultas e validações.

### Parte 1 - Dado de referencia

Adicione o status:

```text
SUSPENSA.
```

Use ordem de exibição `6`.

Reexecute o script de referência sem duplicar.

Depois remova o status do exercício.

---

### Parte 2 - Fixture pequena

Crie:

```text
um Cliente;

um Produto;

uma Ordem;

duas Atividades.
```

Use IDs entre:

```text
309001 e 309099.
```

Faça tudo em uma transação.

Valide e execute rollback.

Nenhuma linha deve permanecer.

---

### Parte 3 - CSV invalido

Crie uma cópia local do CSV de Ordens com:

```text
cliente_codigo inexistente.
```

Carregue somente no staging.

Execute a validação.

Confirme que o merge não foi iniciado.

Remova a cópia inválida.

---

### Parte 4 - Duplicidade

Insira duas linhas com o mesmo código no staging de Clientes.

Confirme que a validação detecta o problema.

Execute `TRUNCATE` no staging e recarregue os CSVs corretos.

---

### Parte 5 - Massa adicional

Gere:

```text
10.000 Ordens;

20.000 Atividades.
```

Use uma faixa exclusiva do exercício.

Documente:

- IDs;
- distribuição;
- datas;
- regra de limpeza.

Remova a massa antes do checkpoint.

---

### Parte 6 - COPY versus INSERT

Compare conceitualmente:

```text
um INSERT por linha;

INSERT com várias linhas;

COPY;

generate_series.
```

Escolha a estratégia para:

- cinco status;
- cinquenta fixtures;
- um CSV com um milhão de linhas;
- massa de performance.

---

### Parte 7 - Anonimizacao

Proponha uma cópia segura de:

```text
Cliente;

Ordem;

Atividade.
```

Preserve chaves técnicas e relacionamentos.

Substitua atributos identificadores.

Documente atributos indiretos que também podem reidentificar.

---

### Parte 8 - Politica de limpeza

Escreva a estratégia para:

- teste unitário;
- teste de integração;
- ambiente local;
- ambiente compartilhado;
- ensaio de performance.

Não use a mesma regra para todos.

---

## Criterios de aceite

- o laboratório oficial da aula 302 existe;
- o arquivo e o H1 seguem a grade;
- dados de referência foram diferenciados de seed;
- seed foi diferenciado de fixture;
- massa sintética foi diferenciada de produção;
- políticas de dados reais foram documentadas;
- o schema exclusivo foi criado;
- cinco status foram carregados;
- o cenário local foi carregado;
- três CSVs fictícios foram criados;
- `\copy` foi praticado;
- os arquivos foram copiados para o container;
- os temporários foram removidos;
- staging foi usado;
- duplicidades foram validadas;
- referências foram validadas;
- merge foi transacional;
- `ON CONFLICT` tornou cargas reexecutáveis;
- 1.000 Clientes sintéticos foram gerados;
- 200 Produtos sintéticos foram gerados;
- 100.000 Ordens sintéticas foram geradas;
- 300.000 Atividades sintéticas foram geradas;
- datas e IDs são determinísticos;
- índices secundários foram criados depois da carga;
- `ANALYZE` foi executado;
- contagens finais foram validadas;
- órfãos foram validados;
- a reexecução manteve as contagens;
- uma cópia mascarada foi criada;
- limitações da anonimização foram registradas;
- dados oficiais de `projeto_os` foram preservados;
- a massa do exercício foi removida;
- o schema da aula foi removido;
- backup e restore não foram antecipados;
- documentação e README estão prontos;
- commit recomendado pode ser realizado.

---

## Commit recomendado

Na raiz:

```powershell
git status
git diff
```

Confirme que não existem:

```text
dados privados;

backups;

arquivos de data/generated.
```

Adicione:

```powershell
git add `
  labs/m12/aula-302-carga-massa-seed-dados-teste
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): criar seed e massa de dados de teste"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
referência;

seed;

fixture;

CSV;

staging;

massa sintética;

anonimização;

limpeza.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você tratou dados de teste como artefatos de engenharia.

Aprendeu:

```text
dado de referência;

seed;

fixture;

massa sintética;

CSV;

COPY;

staging;

merge;

idempotência;

generate_series;

ANALYZE;

anonimização;

limpeza.
```

As regras principais foram:

```text
cada dataset precisa de finalidade;

dados reais não pertencem ao ambiente local por padrão;

fixtures devem ser pequenas;

massa de performance deve ser reproduzível;

datas fixas produzem testes estáveis;

staging separa entrada de dados válidos;

validação deve preceder merge;

foreign keys não devem ser desativadas por conveniência;

ON CONFLICT precisa tratar uma chave conhecida;

índices e estatísticas fazem parte da preparação da massa;

todo dataset precisa de estratégia de descarte.
```

A próxima aula será:

```text
303 - M12.33 - Backup restore e cuidados locais
```

Nela, você vai estudar:

- diferença entre backup lógico e físico;
- `pg_dump`;
- formato plain;
- formato custom;
- `pg_restore`;
- backup de schema;
- backup de tabela;
- backup completo;
- restauração em banco separado;
- verificação do arquivo;
- compatibilidade de versões;
- credenciais;
- armazenamento seguro;
- retenção;
- teste de restauração;
- risco de sobrescrita;
- cuidados com Docker e volumes locais.

Antes de fazer backup, é preciso conhecer banco, schemas, dados, finalidade, ambiente e política de retenção.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei referência, seed, fixture e massa.
- [ ] Carreguei CSV com staging e validação.
- [ ] Gerei massa determinística e validei contagens.
- [ ] Limpei o schema e fiz o commit.

---

## Troubleshooting adicional

### Permission denied no COPY

Use `\copy` pelo cliente `psql`, não `COPY` do servidor.

Confirme que o arquivo existe em `/tmp` do container.

### Invalid byte sequence

O encoding do CSV não corresponde a UTF-8.

Converta o arquivo e mantenha `ENCODING 'UTF8'`.

### Extra data after last expected column

O delimitador, aspas ou quantidade de colunas está incorreto.

Abra o CSV e valide o header.

### Duplicate key durante merge

O mesmo ID foi associado a outro código ou o staging possui duplicidade não validada.

Não silencie o erro.

### CREATE INDEX falha na reexecucao

Os índices já existem.

Não reexecute a etapa estrutural; reconstrua o schema quando precisar repetir toda a aula.

---

## Perguntas de revisao

1. O que é dado de referência?
2. O que é seed?
3. O que é fixture?
4. O que é massa sintética?
5. Por que não usar produção?
6. O que torna um dataset determinístico?
7. Por que usar datas fixas?
8. Para que servem faixas de IDs?
9. Qual a diferença entre `COPY` e `\copy`?
10. O que é staging?
11. O que validar antes do merge?
12. Para que serve `ON CONFLICT`?
13. O que `generate_series` oferece?
14. Por que criar índices depois?
15. Por que executar `ANALYZE`?
16. O que significa idempotência?
17. Mascaramento é anonimização completa?
18. Como preservar relacionamentos em uma cópia?
19. Como limpar o laboratório?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Valor obrigatório e compartilhado do domínio.
2. Dados iniciais úteis ao ambiente.
3. Cenário pequeno de teste.
4. Volume fictício reproduzível.
5. Privacidade, segurança e conformidade.
6. Mesma entrada gera a mesma saída.
7. Evitar mudança temporal do resultado.
8. Identificar origem e facilitar limpeza.
9. Servidor versus cliente.
10. Área intermediária de carga.
11. Duplicidade, nulos, valores e referências.
12. Inserir ou atualizar conflito conhecido.
13. Sequências para `INSERT SELECT`.
14. Reduzir manutenção durante carga descartável.
15. Atualizar estatísticas.
16. Reexecutar sem duplicar efeito.
17. Não.
18. Manter chaves técnicas consistentes.
19. Removendo o schema exclusivo.
20. Backup e restore.

---

## Desafio opcional

Projete uma massa para testes de mensageria com:

```text
10.000 Ordens;

cinco status;

três tipos de Cliente;

Atividades pendentes e concluídas;

datas vencidas e futuras;

identificador de correlação.
```

Documente:

- distribuição;
- IDs;
- data fixa;
- ausência de dados reais;
- criação;
- validação;
- idempotência;
- limpeza;
- volume esperado;
- limitações.

Não publique mensagens reais.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 302 - M12.32 - Carga de massa seed e dados de teste

- Diferenciei dados de referência, seed, fixture e massa sintética.
- Entendi por que dados de produção não devem ser copiados para desenvolvimento.
- Criei um schema exclusivo para dados de teste.
- Carreguei cinco status de referência de forma idempotente.
- Criei uma fixture local pequena e compreensível.
- Criei CSVs inteiramente fictícios.
- Copiei arquivos para o container e usei `\copy`.
- Carreguei dados externos em tabelas de staging.
- Validei duplicidades, valores e referências antes do merge.
- Mesclei Clientes, Produtos e Ordens dentro de uma transação.
- Usei `ON CONFLICT` para permitir reexecução controlada.
- Gerei 1.000 Clientes sintéticos.
- Gerei 200 Produtos sintéticos.
- Gerei 100.000 Ordens e 300.000 Atividades.
- Usei IDs, datas e distribuições determinísticas.
- Criei índices secundários depois da carga.
- Atualizei estatísticas com `ANALYZE`.
- Validei contagens e ausência de órfãos.
- Criei uma cópia mascarada de Clientes.
- Documentei limitações da anonimização.
- Removi integralmente o schema do laboratório.
- Próxima aula: backup, restore e cuidados locais.
```

---

## Referencia tecnica curta

```text
Referência:
dado obrigatório do domínio.

Seed:
inicialização do ambiente.

Fixture:
cenário pequeno de teste.

Massa:
volume sintético.

Staging:
entrada intermediária.

\copy:
importação pelo cliente.

ON CONFLICT:
reexecução controlada.

generate_series:
geração determinística.

ANALYZE:
estatísticas.

Limpeza:
parte obrigatória do dataset.
```

Regra final:

```text
dados de teste confiaveis precisam ser classificados, reproduziveis, seguros, validaveis e faceis de remover.
```
