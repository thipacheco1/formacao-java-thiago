# 276 - M12.06 - Constraints not null unique check default

## Apresentacao da aula

Na aula 275, você protegeu duas dimensões fundamentais do modelo relacional:

```text
identidade;
relacionamento.
```

As colunas `id` passaram a ser identity columns e primary keys. As referências entre cliente, produto, ordem de serviço, atividade e auditoria passaram a ser garantidas por foreign keys.

Depois dessas mudanças, o PostgreSQL já consegue impedir situações como:

```text
duas linhas com o mesmo id;
ordem apontando para cliente inexistente;
atividade apontando para ordem inexistente;
remoção de um registro ainda referenciado.
```

O modelo ainda é permissivo em relação ao conteúdo. Sem novas regras, seria possível tentar gravar:

```text
cliente sem nome;
documento repetido;
código de produto duplicado;
nome contendo apenas espaços;
valor negativo;
status inexistente;
prioridade inválida;
atividade com duração zero;
fim do atendimento anterior ao início;
ativo explicitamente nulo;
data de criação ausente.
```

Nesta aula, você vai proteger essas situações com quatro mecanismos:

```text
NOT NULL;
UNIQUE;
CHECK;
DEFAULT.
```

Eles resolvem problemas diferentes.

`NOT NULL` exige presença. `UNIQUE` impede repetições. `CHECK` valida uma expressão. `DEFAULT` fornece um valor quando a inserção não informa a coluna.

Embora esses recursos sejam frequentemente agrupados em uma aula de constraints, existe uma diferença técnica importante no PostgreSQL 16:

```text
UNIQUE e CHECK:
são constraints registradas no catálogo de constraints.

NOT NULL:
é uma propriedade da coluna, aplicada com SET NOT NULL.

DEFAULT:
é uma expressão padrão da coluna; fornece valor, mas não valida o dado.
```

Essa distinção evita confusão.

A aula usará as tabelas existentes. Não criaremos outro PostgreSQL, outro banco ou outro conjunto paralelo de tabelas.

Também não vamos aprofundar `INSERT`, `UPDATE`, `DELETE`, transações ou índices. Alguns comandos mínimos serão usados apenas para provar que as regras funcionam. DML será o tema da aula 277.

Ao final, você deverá conseguir escolher obrigatoriedade, unicidade, checks e defaults com critério, além de inspecionar e interpretar as regras aplicadas ao banco.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
271:
banco de dados, SGBD, SQL e PostgreSQL.

272:
DBeaver, psql, schemas e rotina de trabalho.

273:
tipos de dados PostgreSQL com critério.

274:
DDL com CREATE TABLE, ALTER TABLE e DROP TABLE.

275:
primary key, foreign key e integridade referencial.

276:
NOT NULL, UNIQUE, CHECK e DEFAULT.

277:
INSERT, UPDATE, DELETE e retorno de dados.

278:
SELECT, WHERE, ORDER BY, LIMIT e OFFSET.
```

A modelagem está sendo construída em camadas:

```text
tipo:
qual categoria de valor a coluna representa.

estrutura:
quais tabelas e colunas existem.

primary key:
como cada linha é identificada.

foreign key:
como as tabelas se relacionam.

constraints de conteúdo:
quais valores são obrigatórios, únicos e válidos.

DML:
como os dados entram, mudam e saem.
```

As tabelas principais, depois da aula 275, são:

```text
app.cliente;
app.produto;
app.ordem_servico;
app.atividade;
auditoria.evento_ordem_servico.
```

Elas já possuem primary keys e foreign keys.

Nesta aula, você vai adicionar regras como:

```text
cliente.nome:
obrigatório e não vazio.

cliente.documento:
obrigatório, não vazio e único.

produto.codigo:
obrigatório, não vazio e único.

produto.valor:
obrigatório e não negativo.

ordem_servico.codigo:
obrigatório, não vazio e único.

ordem_servico.status:
obrigatório, com padrão ABERTA e conjunto permitido.

atividade.codigo:
único dentro da mesma ordem.

atividade.fim_real:
não pode ser anterior ao início.

evento.ocorrido_em:
obrigatório e preenchido automaticamente quando omitido.
```

Primary key e foreign key continuarão existindo, mas não serão reensinadas. A aula 275 já definiu o papel delas.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-276-constraints-not-null-unique-check-default
```

Estrutura final:

```text
labs
└── m12
    └── aula-276-constraints-not-null-unique-check-default
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_diagnosticar_dados_existentes.sql
            ├── 02_aplicar_not_null.sql
            ├── 03_aplicar_defaults.sql
            ├── 04_aplicar_unique.sql
            ├── 05_aplicar_checks.sql
            ├── 06_inspecionar_regras.sql
            ├── 07_inserir_dados_validos.sql
            ├── 08_erros_controlados.sql
            ├── 09_limpar_dados_teste.sql
            └── 10_validacao_final.sql
```

O ambiente esperado é:

```text
container:
formacao-postgres-m12

database:
formacao_java

schemas:
app e auditoria
```

O fluxo será confirmar o estado atual, diagnosticar dados, aplicar as quatro regras, inspecionar metadados, testar violações, limpar o laboratório e commitar.

Execute os scripts estruturais uma única vez e na ordem indicada.

---

## Conceito essencial

### O que e constraint

Constraint é uma regra declarada no banco para restringir os valores aceitos.

Quando uma instrução tenta violar uma constraint, PostgreSQL rejeita a operação.

Isso vale independentemente da origem:

- aplicação Java;
- API;
- integração;
- script;
- DBeaver;
- `psql`;
- importação;
- ferramenta administrativa.

A aplicação valida e apresenta mensagens; o banco fornece a garantia final de integridade.

Exemplo:

```text
aplicação:
avisa rapidamente que o valor é inválido.

banco:
impede que o valor inválido seja persistido.
```

As duas camadas se complementam.

---

### NOT NULL

`NOT NULL` exige que a coluna possua um valor diferente de `NULL`.

Em uma tabela nova:

```sql
nome text NOT NULL
```

Em uma tabela existente:

```sql
ALTER TABLE app.cliente
ALTER COLUMN nome SET NOT NULL;
```

Se já houver linhas com `nome IS NULL`, o comando falha.

Isso é comportamento desejado. O PostgreSQL não deve declarar uma garantia que os dados atuais já violam.

No PostgreSQL 16, `NOT NULL` não recebe um nome explícito como uma constraint `CHECK`. Ele é inspecionado como propriedade da coluna.

Exemplo:

```sql
SELECT
    column_name,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'app'
  AND table_name = 'cliente';
```

Quando `is_nullable` for `NO`, a coluna está protegida contra `NULL`.

---

### NULL nao e texto vazio

Compare:

```text
NULL:
ausência ou valor desconhecido.

'':
texto existente com zero caracteres.

'   ':
texto composto apenas por espaços.
```

`NOT NULL` bloqueia apenas `NULL`.

Ele aceita:

```text
''
'   '
```

Por isso, uma coluna textual obrigatória pode precisar de duas regras:

```text
NOT NULL:
o valor deve existir.

CHECK:
o valor, depois de remover espaços externos, não pode ficar vazio.
```

Exemplo:

```sql
ALTER TABLE app.cliente
ADD CONSTRAINT ck_cliente_nome_nao_vazio
CHECK (btrim(nome) <> '');
```

A função `btrim` remove espaços no início e no fim.

---

### Quando usar NOT NULL

Use quando a linha não faz sentido sem o valor, como nome e documento do cliente, código e valor do produto, referências da ordem, status e dados essenciais da atividade.

Mantenha anulável quando ausência for legítima, como e-mail não informado, data ainda não agendada ou horários reais de uma atividade não iniciada. Obrigatoriedade é decisão de domínio.

### UNIQUE

`UNIQUE` impede que duas linhas tenham o mesmo valor ou a mesma combinação de valores.

Exemplo simples:

```sql
ALTER TABLE app.produto
ADD CONSTRAINT uq_produto_codigo
UNIQUE (codigo);
```

Agora dois produtos não podem usar o mesmo código.

Exemplo composto:

```sql
ALTER TABLE app.atividade
ADD CONSTRAINT uq_atividade_ordem_codigo
UNIQUE (ordem_servico_id, codigo);
```

A regra significa:

```text
dentro da mesma ordem, o código da atividade não pode repetir.
```

O mesmo código pode existir em outra ordem, porque a combinação completa será diferente.

---

### UNIQUE simples e composta

Uma constraint simples protege uma coluna, como `produto.codigo`. Uma constraint composta protege a combinação, como `(ordem_servico_id, codigo)` em atividade.

Assim, o código `INSTALACAO` pode existir em ordens diferentes, mas não pode se repetir dentro da mesma ordem. A regra pertence ao conjunto das colunas, não a cada valor isoladamente.

### UNIQUE e NULL

No PostgreSQL 16, valores `NULL` são distintos por padrão em uma constraint `UNIQUE`. Assim, vários clientes podem não ter e-mail, mas um e-mail informado não pode repetir. A opção `NULLS NOT DISTINCT` existe, porém não será usada nesta aula.

### UNIQUE cria indice

PostgreSQL cria automaticamente um índice B-tree único para sustentar a constraint. A regra existe para proteger o domínio; o índice é o mecanismo usado pelo banco. Índices serão aprofundados na aula 291.

### UNIQUE nao substitui primary key

Uma tabela pode ter:

```text
uma primary key;
várias constraints unique.
```

Exemplo:

```text
cliente.id:
primary key.

cliente.documento:
unique.

cliente.email:
unique quando informado.
```

A primary key é a identidade oficial da linha.

Os valores únicos representam chaves candidatas ou regras de negócio.

---

### CHECK

`CHECK` exige que uma expressão booleana seja satisfeita.

Exemplo:

```sql
ALTER TABLE app.produto
ADD CONSTRAINT ck_produto_valor_nao_negativo
CHECK (valor >= 0);
```

A expressão é avaliada quando a linha é inserida ou quando colunas relevantes são atualizadas.

Se o resultado for `false`, a operação falha.

Um `CHECK` pode usar uma coluna:

```sql
CHECK (valor >= 0)
```

Ou comparar várias colunas da mesma linha:

```sql
CHECK (
    fim_real IS NULL
    OR (
        inicio_real IS NOT NULL
        AND fim_real >= inicio_real
    )
)
```

---

### CHECK aceita true ou unknown

`CHECK` rejeita somente quando a expressão é `false`. Se uma coluna nula torna a expressão desconhecida, a linha passa. Por isso, use `NOT NULL` para presença e `CHECK` para validade.

### CHECK de coluna e de tabela

Um `CHECK` pode validar uma coluna ou combinar várias colunas da mesma linha. A regra de período da atividade, por exemplo, compara `inicio_real` e `fim_real`. Nesta aula, todas as constraints serão adicionadas com nomes explícitos por meio de `ALTER TABLE`.

### CHECK deve ser local a linha

Use `CHECK` para regras que podem ser avaliadas com os valores da própria linha.

Exemplos adequados:

```text
valor >= 0;
status dentro de uma lista;
nome não vazio;
fim >= início;
duração > zero.
```

Não use `CHECK` para pesquisar outra tabela.

Exemplos inadequados:

```text
cliente_id precisa existir:
use foreign key.

documento não pode repetir:
use unique.

soma dos valores de todas as atividades:
exige outra estratégia.
```

Use o mecanismo adequado.

---

### Status controlado com CHECK

Uma coluna textual sem proteção aceita qualquer escrita. Um `CHECK` com `IN` limita os valores aos estados reconhecidos pelo fluxo. Essa solução é adequada para conjuntos pequenos e relativamente estáveis; domínios parametrizáveis podem exigir outra modelagem.

### DEFAULT

`DEFAULT` define o valor usado quando uma inserção não informa a coluna.

Em tabela existente:

```sql
ALTER TABLE app.cliente
ALTER COLUMN ativo SET DEFAULT true;
```

Exemplos do laboratório:

```text
cliente.ativo:
true.

produto.ativo:
true.

ordem_servico.status:
ABERTA.

ordem_servico.valor_previsto:
0.

ordem_servico.urgente:
false.

ordem_servico.prioridade:
NORMAL.

criado_em:
CURRENT_TIMESTAMP.

atividade.status:
PENDENTE.

atividade.valor_mao_obra:
0.
```

O default reduz repetição e centraliza uma decisão inicial segura.

---

### DEFAULT nao substitui valor explicito

O default é usado quando a coluna é omitida ou quando a instrução solicita `DEFAULT`. Um `NULL` explícito continua sendo `NULL` e falha se a coluna for `NOT NULL`.

### DEFAULT nao e validacao

`DEFAULT 'ABERTA'` fornece o estado inicial, mas não impede outro texto. A combinação correta é usar default para inicialização e `CHECK` para limitar valores.

### Bons e maus defaults

Um bom default representa um estado inicial seguro, como `ativo = true`, `urgente = false`, `status = 'ABERTA'` ou `criado_em = CURRENT_TIMESTAMP`.

Evite defaults que inventem decisões de negócio, como cliente artificial, agendamento automático ou valor zero usado para esconder ausência. Pergunte se o padrão é uma regra real ou apenas uma forma de evitar erro na inserção.

### Nomeacao das constraints

Usaremos:

```text
uq_<tabela>_<colunas>
ck_<tabela>_<regra>
```

Exemplos:

```text
uq_cliente_documento;
uq_ordem_servico_codigo;
uq_atividade_ordem_codigo;
ck_produto_valor_nao_negativo;
ck_ordem_servico_status_valido;
ck_atividade_periodo_real_valido.
```

`NOT NULL` e `DEFAULT` serão inspecionados pelas propriedades das colunas.

Nomes claros ajudam a interpretar mensagens como:

```text
violates unique constraint "uq_cliente_documento"
```

ou:

```text
violates check constraint "ck_produto_valor_nao_negativo"
```

A mensagem identifica a regra.

---

### Adicionar regras a dados existentes

PostgreSQL verifica as linhas atuais ao adicionar `NOT NULL`, `UNIQUE` ou `CHECK`. Valores nulos, duplicados ou inválidos fazem o comando falhar. `DEFAULT` muda novas inserções e não corrige automaticamente registros antigos.

Por isso, o laboratório começa com diagnóstico. Em ambiente real, trate os dados antes de declarar a nova garantia.

## Mao na massa guiada

### 1. Confirmar o PostgreSQL

Na raiz do repositório:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se necessário:

```powershell
Set-Location `
  "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"

docker compose up -d
docker compose ps

Set-Location ..\..\..
```

Não crie outro Compose.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-276-constraints-not-null-unique-check-default\sql"

Set-Location `
  "labs\m12\aula-276-constraints-not-null-unique-check-default"
```

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
    current_user AS usuario;

SELECT
    ns.nspname AS schema_name,
    tab.relname AS table_name,
    con.conname AS constraint_name,
    con.contype AS constraint_type
FROM pg_constraint con
JOIN pg_class tab
  ON tab.oid = con.conrelid
JOIN pg_namespace ns
  ON ns.oid = tab.relnamespace
WHERE ns.nspname IN ('app', 'auditoria')
  AND con.contype IN ('p', 'f')
ORDER BY ns.nspname, tab.relname, con.contype, con.conname;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme as primary keys e foreign keys da aula 275.

---

### 4. Criar 01_diagnosticar_dados_existentes.sql

Crie:

```text
sql/01_diagnosticar_dados_existentes.sql
```

Conteúdo:

```sql
SELECT
    (SELECT count(*) FROM app.cliente) AS clientes,
    (SELECT count(*) FROM app.produto) AS produtos,
    (SELECT count(*) FROM app.ordem_servico) AS ordens,
    (SELECT count(*) FROM app.atividade) AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
    ) AS eventos;

SELECT
    (SELECT count(*) FROM app.cliente WHERE nome IS NULL)
        AS cliente_nome_nulo,
    (SELECT count(*) FROM app.cliente WHERE documento IS NULL)
        AS cliente_documento_nulo,
    (SELECT count(*) FROM app.produto WHERE valor IS NULL)
        AS produto_valor_nulo,
    (
        SELECT count(*)
        FROM app.ordem_servico
        WHERE cliente_id IS NULL OR produto_id IS NULL
    ) AS ordem_referencia_nula,
    (
        SELECT count(*)
        FROM app.atividade
        WHERE ordem_servico_id IS NULL
    ) AS atividade_ordem_nula;

SELECT
    (SELECT count(*) FROM app.cliente WHERE btrim(nome) = '')
        AS cliente_nome_vazio,
    (SELECT count(*) FROM app.produto WHERE valor < 0)
        AS produto_valor_negativo,
    (
        SELECT count(*)
        FROM app.ordem_servico
        WHERE valor_previsto < 0
    ) AS ordem_valor_negativo,
    (
        SELECT count(*)
        FROM app.atividade
        WHERE valor_mao_obra < 0
    ) AS atividade_valor_negativo;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\01_diagnosticar_dados_existentes.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Se houver violações, não aplique as constraints sem entender os dados.

---

### 5. Criar 02_aplicar_not_null.sql

Crie:

```text
sql/02_aplicar_not_null.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
    ALTER COLUMN nome SET NOT NULL,
    ALTER COLUMN documento SET NOT NULL,
    ALTER COLUMN ativo SET NOT NULL,
    ALTER COLUMN criado_em SET NOT NULL;

ALTER TABLE app.produto
    ALTER COLUMN codigo SET NOT NULL,
    ALTER COLUMN nome SET NOT NULL,
    ALTER COLUMN valor SET NOT NULL,
    ALTER COLUMN ativo SET NOT NULL,
    ALTER COLUMN criado_em SET NOT NULL;

ALTER TABLE app.ordem_servico
    ALTER COLUMN codigo SET NOT NULL,
    ALTER COLUMN cliente_id SET NOT NULL,
    ALTER COLUMN produto_id SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN valor_previsto SET NOT NULL,
    ALTER COLUMN urgente SET NOT NULL,
    ALTER COLUMN criado_em SET NOT NULL,
    ALTER COLUMN prioridade SET NOT NULL;

ALTER TABLE app.atividade
    ALTER COLUMN ordem_servico_id SET NOT NULL,
    ALTER COLUMN codigo SET NOT NULL,
    ALTER COLUMN descricao SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN valor_mao_obra SET NOT NULL;

ALTER TABLE auditoria.evento_ordem_servico
    ALTER COLUMN ordem_servico_id SET NOT NULL,
    ALTER COLUMN tipo SET NOT NULL,
    ALTER COLUMN descricao SET NOT NULL,
    ALTER COLUMN ocorrido_em SET NOT NULL;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\02_aplicar_not_null.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Campos opcionais permaneceram anuláveis:

```text
cliente.email;
produto.descricao;
ordem_servico.data_agendada;
ordem_servico.inicio_previsto;
ordem_servico.descricao_problema;
atividade.duracao_prevista;
atividade.inicio_real;
atividade.fim_real.
```

---

### 6. Criar 03_aplicar_defaults.sql

Crie:

```text
sql/03_aplicar_defaults.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
    ALTER COLUMN ativo SET DEFAULT true,
    ALTER COLUMN criado_em SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE app.produto
    ALTER COLUMN ativo SET DEFAULT true,
    ALTER COLUMN criado_em SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE app.ordem_servico
    ALTER COLUMN status SET DEFAULT 'ABERTA',
    ALTER COLUMN valor_previsto SET DEFAULT 0,
    ALTER COLUMN urgente SET DEFAULT false,
    ALTER COLUMN criado_em SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN prioridade SET DEFAULT 'NORMAL';

ALTER TABLE app.atividade
    ALTER COLUMN status SET DEFAULT 'PENDENTE',
    ALTER COLUMN valor_mao_obra SET DEFAULT 0;

ALTER TABLE auditoria.evento_ordem_servico
    ALTER COLUMN ocorrido_em SET DEFAULT CURRENT_TIMESTAMP;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\03_aplicar_defaults.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Os defaults passam a valer para novas inserções.

---

### 7. Criar 04_aplicar_unique.sql

Crie:

```text
sql/04_aplicar_unique.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
ADD CONSTRAINT uq_cliente_documento
UNIQUE (documento);

ALTER TABLE app.cliente
ADD CONSTRAINT uq_cliente_email
UNIQUE (email);

ALTER TABLE app.produto
ADD CONSTRAINT uq_produto_codigo
UNIQUE (codigo);

ALTER TABLE app.ordem_servico
ADD CONSTRAINT uq_ordem_servico_codigo
UNIQUE (codigo);

ALTER TABLE app.atividade
ADD CONSTRAINT uq_atividade_ordem_codigo
UNIQUE (ordem_servico_id, codigo);
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\04_aplicar_unique.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A constraint é composta.

---

### 8. Criar 05_aplicar_checks.sql

Crie:

```text
sql/05_aplicar_checks.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
ADD CONSTRAINT ck_cliente_nome_nao_vazio
CHECK (btrim(nome) <> '');

ALTER TABLE app.cliente
ADD CONSTRAINT ck_cliente_documento_nao_vazio
CHECK (btrim(documento) <> '');

ALTER TABLE app.cliente
ADD CONSTRAINT ck_cliente_email_nao_vazio
CHECK (email IS NULL OR btrim(email) <> '');

ALTER TABLE app.produto
ADD CONSTRAINT ck_produto_codigo_nao_vazio
CHECK (btrim(codigo) <> '');

ALTER TABLE app.produto
ADD CONSTRAINT ck_produto_nome_nao_vazio
CHECK (btrim(nome) <> '');

ALTER TABLE app.produto
ADD CONSTRAINT ck_produto_valor_nao_negativo
CHECK (valor >= 0);

ALTER TABLE app.ordem_servico
ADD CONSTRAINT ck_ordem_servico_codigo_nao_vazio
CHECK (btrim(codigo) <> '');

ALTER TABLE app.ordem_servico
ADD CONSTRAINT ck_ordem_servico_status_valido
CHECK (
    status IN (
        'ABERTA',
        'AGENDADA',
        'EM_ATENDIMENTO',
        'CONCLUIDA',
        'CANCELADA'
    )
);

ALTER TABLE app.ordem_servico
ADD CONSTRAINT ck_ordem_servico_valor_nao_negativo
CHECK (valor_previsto >= 0);

ALTER TABLE app.ordem_servico
ADD CONSTRAINT ck_ordem_servico_prioridade_valida
CHECK (
    prioridade IN (
        'BAIXA',
        'NORMAL',
        'ALTA',
        'CRITICA'
    )
);

ALTER TABLE app.ordem_servico
ADD CONSTRAINT ck_ordem_servico_descricao_nao_vazia
CHECK (
    descricao_problema IS NULL
    OR btrim(descricao_problema) <> ''
);

ALTER TABLE app.atividade
ADD CONSTRAINT ck_atividade_codigo_nao_vazio
CHECK (btrim(codigo) <> '');

ALTER TABLE app.atividade
ADD CONSTRAINT ck_atividade_descricao_nao_vazia
CHECK (btrim(descricao) <> '');

ALTER TABLE app.atividade
ADD CONSTRAINT ck_atividade_status_valido
CHECK (
    status IN (
        'PENDENTE',
        'AGENDADA',
        'EM_EXECUCAO',
        'CONCLUIDA',
        'CANCELADA'
    )
);

ALTER TABLE app.atividade
ADD CONSTRAINT ck_atividade_valor_nao_negativo
CHECK (valor_mao_obra >= 0);

ALTER TABLE app.atividade
ADD CONSTRAINT ck_atividade_duracao_positiva
CHECK (
    duracao_prevista IS NULL
    OR duracao_prevista > interval '0 seconds'
);

ALTER TABLE app.atividade
ADD CONSTRAINT ck_atividade_periodo_real_valido
CHECK (
    fim_real IS NULL
    OR (
        inicio_real IS NOT NULL
        AND fim_real >= inicio_real
    )
);

ALTER TABLE auditoria.evento_ordem_servico
ADD CONSTRAINT ck_evento_tipo_nao_vazio
CHECK (btrim(tipo) <> '');

ALTER TABLE auditoria.evento_ordem_servico
ADD CONSTRAINT ck_evento_descricao_nao_vazia
CHECK (btrim(descricao) <> '');
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\05_aplicar_checks.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

As regras agora protegem presença, unicidade e conteúdo.

---

### 9. Criar 06_inspecionar_regras.sql

Crie:

```text
sql/06_inspecionar_regras.sql
```

Conteúdo:

```sql
SELECT
    table_schema,
    table_name,
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema IN ('app', 'auditoria')
ORDER BY table_schema, table_name, ordinal_position;

SELECT
    ns.nspname AS schema_name,
    tab.relname AS table_name,
    con.conname AS constraint_name,
    CASE con.contype
        WHEN 'u' THEN 'UNIQUE'
        WHEN 'c' THEN 'CHECK'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'f' THEN 'FOREIGN KEY'
        ELSE con.contype::text
    END AS constraint_type,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class tab
  ON tab.oid = con.conrelid
JOIN pg_namespace ns
  ON ns.oid = tab.relnamespace
WHERE ns.nspname IN ('app', 'auditoria')
ORDER BY ns.nspname, tab.relname, constraint_type, con.conname;

SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN ('app', 'auditoria')
ORDER BY schemaname, tablename, indexname;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\06_inspecionar_regras.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Observe:

- `is_nullable = NO` nas colunas obrigatórias;
- expressões em `column_default`;
- constraints `UNIQUE` e `CHECK`;
- índices das primary keys e unique constraints.

---

### 10. Criar 07_inserir_dados_validos.sql

Crie:

```text
sql/07_inserir_dados_validos.sql
```

Conteúdo:

```sql
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    920001,
    'Cliente Aula 276 A',
    '00127600000001'
);

INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    920002,
    'Cliente Aula 276 B',
    '00127600000002'
);

INSERT INTO app.produto (
    id,
    codigo,
    nome,
    valor
)
VALUES (
    920001,
    'PROD-276',
    'Produto Aula 276',
    250.00
);

INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id
)
VALUES (
    920001,
    'OS-276-001',
    920001,
    920001
);

INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    duracao_prevista
)
VALUES (
    920001,
    920001,
    'ATV-001',
    'Atividade válida da aula 276',
    interval '90 minutes'
);

INSERT INTO auditoria.evento_ordem_servico (
    id,
    ordem_servico_id,
    tipo,
    descricao
)
VALUES (
    920001,
    920001,
    'CRIACAO_TESTE',
    'Evento válido da aula 276'
);

SELECT
    id,
    nome,
    documento,
    ativo,
    criado_em,
    email
FROM app.cliente
WHERE id IN (920001, 920002)
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    valor_previsto,
    urgente,
    prioridade,
    criado_em
FROM app.ordem_servico
WHERE id = 920001;

SELECT
    id,
    codigo,
    status,
    valor_mao_obra
FROM app.atividade
WHERE id = 920001;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\07_inserir_dados_validos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Observe os defaults preenchidos.

Os dois clientes podem ter `email = NULL`.

---

### 11. Criar 08_erros_controlados.sql

Crie:

```text
sql/08_erros_controlados.sql
```

Conteúdo:

```sql
-- Execute cada instrução separadamente.
-- Todos os blocos abaixo devem falhar.

-- Erro 1: NOT NULL.
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    920010,
    NULL,
    '00127600000010'
);

-- Erro 2: CHECK de texto vazio.
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    920011,
    '   ',
    '00127600000011'
);

-- Erro 3: UNIQUE.
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    920012,
    'Cliente documento duplicado',
    '00127600000001'
);

-- Erro 4: DEFAULT não substitui NULL explícito.
INSERT INTO app.cliente (
    id,
    nome,
    documento,
    ativo
)
VALUES (
    920013,
    'Cliente ativo nulo',
    '00127600000013',
    NULL
);

-- Erro 5: valor negativo.
INSERT INTO app.produto (
    id,
    codigo,
    nome,
    valor
)
VALUES (
    920010,
    'PROD-NEGATIVO',
    'Produto inválido',
    -1
);

-- Erro 6: status inválido.
INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status
)
VALUES (
    920010,
    'OS-STATUS-INVALIDO',
    920001,
    920001,
    'FINALIZADAA'
);

-- Erro 7: prioridade inválida.
INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    prioridade
)
VALUES (
    920011,
    'OS-PRIORIDADE-INVALIDA',
    920001,
    920001,
    'URGENTISSIMA'
);

-- Erro 8: unique composta.
INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao
)
VALUES (
    920010,
    920001,
    'ATV-001',
    'Código repetido na mesma ordem'
);

-- Erro 9: duração inválida.
INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    duracao_prevista
)
VALUES (
    920011,
    920001,
    'ATV-DURACAO',
    'Duração inválida',
    interval '0 seconds'
);

-- Erro 10: fim anterior ao início.
INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    inicio_real,
    fim_real
)
VALUES (
    920012,
    920001,
    'ATV-PERIODO',
    'Período inválido',
    '2026-07-10 10:00:00-03',
    '2026-07-10 09:00:00-03'
);
```

Abra no DBeaver ou `psql`.

Execute uma instrução por vez e identifique:

```text
coluna;
constraint;
valor;
regra violada.
```

Não execute esse arquivo pelo fluxo automatizado com `ON_ERROR_STOP=1`.

---

### 12. Criar 09_limpar_dados_teste.sql

Crie:

```text
sql/09_limpar_dados_teste.sql
```

Conteúdo:

```sql
DELETE FROM auditoria.evento_ordem_servico
WHERE id = 920001;

DELETE FROM app.atividade
WHERE id = 920001;

DELETE FROM app.ordem_servico
WHERE id = 920001;

DELETE FROM app.produto
WHERE id = 920001;

DELETE FROM app.cliente
WHERE id IN (920001, 920002);
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\09_limpar_dados_teste.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A ordem respeita as foreign keys da aula 275.

---

### 13. Criar 10_validacao_final.sql

Crie:

```text
sql/10_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    ns.nspname AS schema_name,
    tab.relname AS table_name,
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class tab
  ON tab.oid = con.conrelid
JOIN pg_namespace ns
  ON ns.oid = tab.relnamespace
WHERE ns.nspname IN ('app', 'auditoria')
  AND con.contype IN ('u', 'c')
ORDER BY ns.nspname, tab.relname, con.contype, con.conname;

SELECT
    table_schema,
    table_name,
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema IN ('app', 'auditoria')
  AND (
      is_nullable = 'NO'
      OR column_default IS NOT NULL
  )
ORDER BY table_schema, table_name, ordinal_position;

SELECT
    (SELECT count(*) FROM app.cliente WHERE id >= 920000)
        AS clientes_teste,
    (SELECT count(*) FROM app.produto WHERE id >= 920000)
        AS produtos_teste,
    (SELECT count(*) FROM app.ordem_servico WHERE id >= 920000)
        AS ordens_teste,
    (SELECT count(*) FROM app.atividade WHERE id >= 920000)
        AS atividades_teste,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id >= 920000
    ) AS eventos_teste;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-276-constraints-not-null-unique-check-default\sql\10_validacao_final.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado esperado:

```text
unique e checks presentes;
colunas obrigatórias e defaults visíveis;
zero registros de teste.
```

---

### 14. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 276 - Constraints not null unique check default.

Pré-requisito:
aulas 274 e 275 concluídas.

Objetivo:
proteger obrigatoriedade, unicidade, validade e valores iniciais.

Execução:
rodar os scripts 00 a 07;
executar o script 08 manualmente, uma instrução por vez;
rodar 09 e 10.

Importante:
DEFAULT não substitui NULL explícito;
CHECK não bloqueia NULL sozinho;
UNIQUE permite múltiplos NULLs por padrão;
NOT NULL é propriedade de coluna no PostgreSQL 16.

Próxima aula:
INSERT, UPDATE, DELETE e retorno de dados.
```

Liste as regras adicionadas a cada tabela.

---

## Entendendo o que foi feito

### Cada mecanismo protege uma dimensao

Você aplicou:

```text
NOT NULL:
presença.

UNIQUE:
não repetição.

CHECK:
validade da expressão.

DEFAULT:
valor inicial quando omitido.
```

Nenhum mecanismo substitui os outros.

---

### O banco representa mais do dominio

Antes, `status` e `documento` eram apenas textos. Agora possuem obrigatoriedade, validade, valor inicial quando aplicável e unicidade de negócio. O modelo ficou mais expressivo e protegido.

---

### Defaults reduziram repeticao

Defaults foram usados apenas para estados iniciais seguros. Cliente, produto, código, documento e valor principal continuaram explícitos porque não devem ser inventados pelo banco.

### Os erros passaram a explicar a regra

Com constraints nomeadas, a mensagem aponta para:

```text
uq_cliente_documento;
ck_produto_valor_nao_negativo;
ck_ordem_servico_status_valido;
uq_atividade_ordem_codigo.
```

Isso torna o diagnóstico mais rápido.

---

### O modelo ainda vai evoluir

Constraints protegem estados locais, mas o M12 ainda avançará por DML, consultas, modelagem, normalização, índices, transações, performance e migrações.

## Erros comuns importantes

### SET NOT NULL falha

Existem valores nulos na coluna.

Diagnostique antes de corrigir.

Não substitua todos os nulos por um valor artificial apenas para fazer a alteração passar.

---

### UNIQUE falha ao ser criada

Existem valores duplicados.

Determine:

- quais linhas repetem;
- qual deveria permanecer;
- se a regra de unicidade está correta;
- se a constraint deveria ser simples ou composta.

---

### CHECK nao bloqueia NULL

Isso é esperado.

Adicione `NOT NULL` quando ausência não for permitida.

---

### DEFAULT nao foi aplicado

Verifique se a coluna foi omitida.

Um `NULL` explícito não solicita o default.

---

### Valor antigo viola CHECK

Ao adicionar o `CHECK`, PostgreSQL valida os dados existentes.

Corrija a inconsistência antes de declarar a regra.

Não enfraqueça o `CHECK` apenas para acomodar dado incorreto.

---

## Comandos uteis

### Inspecionar coluna

```sql
SELECT
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'app'
  AND table_name = 'ordem_servico';
```

### Inspecionar constraints

```sql
SELECT
    conname,
    contype,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'app.ordem_servico'::regclass;
```

### Descrever tabela

```text
\d app.ordem_servico
```

### Executar script

```powershell
Get-Content -Raw "caminho\arquivo.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

## Exercicio guiado

### Parte 1 - Proteger app.tecnico

Se a tabela `app.tecnico` existe, crie:

```text
sql/11_exercicio_tecnico.sql
```

Aplique:

```text
codigo:
NOT NULL, UNIQUE e não vazio.

nome:
NOT NULL e não vazio.

ativo:
NOT NULL com DEFAULT true.

criado_em:
NOT NULL com DEFAULT CURRENT_TIMESTAMP.

email:
UNIQUE quando informado e não vazio.

documento_identificacao:
UNIQUE quando informado e não vazio.
```

Nomeie as constraints `UNIQUE` e `CHECK`.

---

### Parte 2 - Proteger relacionamento opcional

A coluna `app.atividade.tecnico_id`, criada no exercício da aula 275, pode permanecer anulável.

Explique no README:

```text
foreign key:
garante que um técnico informado exista.

ausência de NOT NULL:
permite atividade ainda sem técnico.

quando a regra exigir técnico:
SET NOT NULL poderá ser aplicado após tratar dados existentes.
```

Não transforme a relação em obrigatória sem uma decisão de fluxo.

---

### Parte 3 - Criar regra composta

Adicione ao técnico uma coluna:

```sql
ALTER TABLE app.tecnico
ADD COLUMN tipo text;
```

Configure:

```text
DEFAULT:
INTERNO.

NOT NULL:
tipo precisa existir.

CHECK:
INTERNO ou EXTERNO.
```

Depois teste:

```text
tipo omitido:
deve usar INTERNO.

tipo EXTERNO:
deve funcionar.

tipo TERCEIRIZADO:
deve falhar nesta regra inicial.
```

Registre que o conjunto poderá mudar conforme o domínio evoluir.

---

### Parte 4 - Testar e limpar

Insira dois técnicos válidos.

Teste:

- código duplicado;
- nome vazio;
- tipo inválido;
- `ativo = NULL`;
- e-mail duplicado.

Remova os dados de teste respeitando referências existentes.

---

### Parte 5 - Revisar decisoes

No README, responda:

1. Quais colunas receberam `NOT NULL` e por quê?
2. Quais constraints `UNIQUE` são simples?
3. Existe alguma regra composta?
4. Quais defaults representam estado inicial?
5. Quais colunas continuam opcionais?
6. Qual `CHECK` compara mais de uma coluna?
7. Por que `DEFAULT` não é validação?
8. Por que `CHECK` não substitui foreign key?

---

## Criterios de aceite

- o laboratório oficial da aula 276 existe;
- as tabelas das aulas anteriores foram reutilizadas;
- precondições e dados existentes foram verificados;
- colunas obrigatórias receberam `NOT NULL`;
- campos opcionais permaneceram anuláveis;
- defaults foram aplicados somente quando havia regra inicial clara;
- documento, códigos e e-mail receberam unicidade apropriada;
- uma constraint unique composta foi criada para atividade;
- textos obrigatórios não aceitam apenas espaços;
- valores monetários não aceitam negativos;
- status e prioridade foram limitados;
- duração zero ou negativa foi bloqueada;
- fim anterior ao início foi bloqueado;
- evento exige tipo e descrição não vazios;
- constraints foram nomeadas;
- metadados foram inspecionados;
- dados válidos usaram defaults;
- `NULL` explícito não foi substituído pelo default;
- múltiplos e-mails nulos foram aceitos;
- violações controladas foram interpretadas;
- dados de teste foram removidos;
- DML não foi aprofundado;
- o exercício com técnico foi concluído;
- README e scripts estão prontos;
- commit recomendado pode ser realizado.

---

## Commit recomendado

Na raiz:

```powershell
git status
git diff
```

Adicione:

```powershell
git add `
  labs/m12/aula-276-constraints-not-null-unique-check-default
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): proteger dados com constraints"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
obrigatoriedade;
unicidade;
checks de domínio;
valores padrão;
testes de violação.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você protegeu o conteúdo das linhas.

Aprendeu que:

```text
NOT NULL:
exige presença.

UNIQUE:
impede repetição.

CHECK:
valida uma expressão local da linha.

DEFAULT:
fornece valor quando a coluna é omitida.
```

Também consolidou diferenças importantes:

```text
NULL não é texto vazio;
CHECK não bloqueia NULL sozinho;
DEFAULT não substitui NULL explícito;
UNIQUE permite múltiplos NULLs por padrão;
UNIQUE composta protege uma combinação;
UNIQUE cria índice automaticamente;
DEFAULT não é regra de validação;
foreign key protege relação entre tabelas;
CHECK protege condição dentro da linha.
```

Na prática, o banco passou a rejeitar:

- nomes vazios;
- documentos repetidos;
- códigos duplicados;
- valores negativos;
- status inválidos;
- prioridades inexistentes;
- atividades repetidas dentro da mesma ordem;
- duração não positiva;
- fim anterior ao início;
- valores nulos em colunas obrigatórias.

A próxima aula será:

```text
277 - M12.07 - Insert update delete e retorno de dados
```

Nela, você vai estudar DML de forma completa:

- `INSERT` simples;
- inserção de múltiplas linhas;
- uso de defaults;
- `RETURNING`;
- `UPDATE` com filtro;
- `DELETE` com filtro;
- validação antes de alterar;
- impacto de comandos sem `WHERE`;
- retorno das linhas afetadas;
- responsabilidade em operações destrutivas;
- interação entre DML e constraints.

Agora que a estrutura e as regras existem, você poderá manipular dados e observar o banco protegendo cada operação.

---

# Material complementar

## Checkpoint final

- [ ] Apliquei `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT`.
- [ ] Testei dados válidos e violações controladas.
- [ ] Entendi as diferenças entre os quatro mecanismos.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Duplicados antes do UNIQUE

Use uma consulta de diagnóstico com `GROUP BY` e `HAVING`, mas não apague automaticamente os registros. Identifique a linha correta e as referências existentes.

### NOT NULL em tabela grande

A validação pode exigir planejamento de volume, bloqueios e implantação. O laboratório não simula produção.

### CHECK complexo demais

Prefira regras locais, determinísticas, legíveis e nomeadas. Dependências entre tabelas pertencem a foreign keys ou outra estratégia adequada.

### Alterar proteção

`DROP CONSTRAINT` e `DROP DEFAULT` existem, mas só devem ser usados quando o domínio realmente mudou. Não remova regras apenas para aceitar dado inválido.

## Perguntas de revisao

1. O que `NOT NULL` garante?
2. Qual a diferença entre `NULL`, texto vazio e espaços?
3. Quando uma coluna deve permanecer anulável?
4. O que `UNIQUE` garante?
5. Qual a diferença entre unicidade simples e composta?
6. Como PostgreSQL 16 trata `NULL` em `UNIQUE` por padrão?
7. O que `CHECK` valida?
8. Por que `CHECK (valor >= 0)` aceita `NULL`?
9. Quando usar `NOT NULL` junto com `CHECK`?
10. Por que `CHECK` não deve consultar outra tabela?
11. O que `DEFAULT` faz?
12. Quando o default é aplicado?
13. Por que `NULL` explícito não usa default?
14. Qual a diferença entre default e validação?
15. Por que nomear constraints?
16. O que acontece ao adicionar uma regra sobre dados inválidos?

---

## Roteiro de resposta

1. `NOT NULL` impede ausência.
2. `NULL`, texto vazio e espaços são valores diferentes.
3. Colunas opcionais permanecem anuláveis quando a ausência faz parte do domínio.
4. `UNIQUE` impede repetição.
5. Unicidade composta avalia a combinação das colunas.
6. PostgreSQL 16 considera valores nulos distintos por padrão.
7. `CHECK` valida uma expressão da linha.
8. Uma expressão com `NULL` pode resultar em desconhecido e não falhar.
9. Combine `NOT NULL` com `CHECK` quando presença e validade forem obrigatórias.
10. Relações entre tabelas pertencem a foreign keys, não a checks.
11. `DEFAULT` fornece um valor quando a coluna é omitida.
12. Ele também pode ser solicitado explicitamente com `DEFAULT`.
13. `NULL` explícito não significa omissão.
14. Default inicializa; constraints validam.
15. Nomes claros ajudam no diagnóstico e na manutenção.
16. PostgreSQL rejeita a nova regra se os dados existentes já a violarem.

## Desafio opcional

Se `app.contrato` existe dos desafios anteriores, aplique:

```text
codigo:
NOT NULL, UNIQUE e não vazio.

cliente_id:
NOT NULL.

inicio_vigencia:
NOT NULL.

fim_vigencia:
opcional, mas não pode ser anterior ao início.

valor_limite:
NOT NULL e não negativo.

ativo:
NOT NULL com DEFAULT true.

criado_em:
NOT NULL com DEFAULT CURRENT_TIMESTAMP.

descricao:
opcional, mas não vazia quando informada.
```

Crie constraints nomeadas.

Teste valores válidos e inválidos.

Não aprofunde DML além do necessário para provar as regras.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 276 - M12.06 - Constraints not null unique check default

- Protegi colunas obrigatórias com `NOT NULL`.
- Diferenciei ausência, texto vazio e texto com espaços.
- Criei constraints `UNIQUE` simples e composta.
- Entendi que múltiplos valores nulos são permitidos por padrão em `UNIQUE`.
- Criei `CHECK` para textos, valores, status, prioridade, duração e período.
- Entendi que `CHECK` não bloqueia `NULL` sozinho.
- Configurei defaults para estados iniciais e datas de criação.
- Validei que `DEFAULT` não substitui `NULL` explícito.
- Inspecionei constraints, nulabilidade, defaults e índices.
- Testei violações controladas e interpretei os nomes das regras.
- Mantive a manipulação completa de dados para a aula seguinte.
- Próxima aula: `INSERT`, `UPDATE`, `DELETE` e retorno de dados.
```

---

## Referencia tecnica curta

```text
NOT NULL:
valor obrigatório.

UNIQUE:
valor ou combinação sem repetição.

CHECK:
expressão que não pode resultar em false.

DEFAULT:
valor usado quando a coluna é omitida.

NULL:
ausência ou desconhecimento.

texto vazio:
valor textual existente.

UNIQUE composta:
unicidade do conjunto de colunas.

constraint nomeada:
diagnóstico e manutenção melhores.
```

Regra final:

```text
tipo define a categoria;
constraint define o estado permitido;
default define o ponto de partida.
```
