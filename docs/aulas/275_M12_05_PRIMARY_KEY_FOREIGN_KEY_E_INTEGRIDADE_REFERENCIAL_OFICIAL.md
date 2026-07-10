# 275 - M12.05 - Primary key foreign key e integridade referencial

## Apresentacao da aula

Na aula 274, você criou as primeiras tabelas do domínio, inspecionou metadados, alterou colunas e praticou `DROP TABLE` apenas em objetos descartáveis.

As tabelas existem, mas ainda não protegem identidade nem relacionamento:

```text
id pode repetir;
id pode ficar nulo;
cliente_id pode apontar para cliente inexistente;
ordem_servico_id pode apontar para ordem inexistente.
```

Nesta aula, você vai transformar intenção em regra usando:

```text
identity column;
primary key;
foreign key;
integridade de entidade;
integridade referencial;
ações ON DELETE;
constraints nomeadas.
```

A prática será feita sobre:

```text
app.cliente
app.produto
app.ordem_servico
app.atividade
auditoria.evento_ordem_servico
```

Você adicionará geração automática aos IDs, criará primary keys, conectará as tabelas com foreign keys e provocará erros controlados para observar o PostgreSQL protegendo os dados.

Ainda não vamos aprofundar:

```text
NOT NULL;
UNIQUE;
CHECK;
DEFAULT;
índices;
transações;
DML completo.
```

Uma primary key implica unicidade e não nulidade, mas as constraints independentes serão estudadas na aula 276. `INSERT` e `DELETE` aparecerão somente como instrumentos de teste; a prática completa de DML ficará para a aula 277.

Ao final, você deverá explicar por que uma coluna chamada `id` não é automaticamente uma chave e por que uma coluna chamada `cliente_id` não é automaticamente um relacionamento.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
271 - Banco de dados, SGBD, SQL e PostgreSQL
272 - DBeaver, psql, schemas e rotina de trabalho
273 - Tipos de dados PostgreSQL com critério
274 - DDL create table alter table drop table
275 - Primary key foreign key e integridade referencial
276 - Constraints not null unique check default
277 - Insert update delete e retorno de dados
```

Na aula anterior, a coluna `app.cliente.id` recebeu o tipo `bigint`, mas ainda aceita valores repetidos e nulos. Depois desta aula, ela terá dois recursos:

```text
identity:
gera valores automaticamente.

primary key:
garante identidade única e não nula.
```

Da mesma forma, `ordem_servico.cliente_id` deixará de ser apenas um número e passará a ser uma referência protegida a `cliente.id`.

A formação está construindo o modelo por etapas:

```text
tipo;
estrutura;
identidade;
relacionamento;
demais constraints;
dados.
```

Essa separação permite entender exatamente o problema resolvido por cada recurso.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-275-primary-key-foreign-key-integridade-referencial
```

Estrutura final:

```text
labs
└── m12
    └── aula-275-primary-key-foreign-key-integridade-referencial
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_adicionar_identity.sql
            ├── 02_adicionar_primary_keys.sql
            ├── 03_adicionar_foreign_keys.sql
            ├── 04_inspecionar_constraints.sql
            ├── 05_dados_validos_para_teste.sql
            ├── 06_erros_controlados.sql
            ├── 07_limpar_dados_teste.sql
            └── 08_validacao_final.sql
```

O ambiente será reutilizado:

```text
container: formacao-postgres-m12
database: formacao_java
schemas: app e auditoria
```

O fluxo será:

1. verificar as tabelas da aula 274;
2. transformar `id` em identity;
3. adicionar primary keys nomeadas;
4. adicionar foreign keys nomeadas;
5. inspecionar constraints e índices;
6. inserir dados válidos;
7. provocar violações controladas;
8. limpar os dados de teste;
9. validar o estado final;
10. fazer o commit.

Não crie outro Compose e não recrie as tabelas.

---

## Conceito essencial

### Identidade de uma linha

Cada linha precisa ser distinguida das demais.

Exemplo:

| id | nome |
|---:|---|
| 1 | Cliente Alfa |
| 2 | Cliente Beta |

A identidade permite localizar, atualizar, remover, auditar e relacionar uma linha específica.

Uma coluna chamada `id` expressa intenção. Somente uma constraint de primary key transforma essa intenção em garantia do banco.

---

### O que e primary key

Primary key identifica unicamente cada linha.

Exemplo:

```sql
ALTER TABLE app.cliente
ADD CONSTRAINT pk_cliente
PRIMARY KEY (id);
```

Ela exige valores:

```text
únicos;
não nulos.
```

No PostgreSQL, a primary key também cria automaticamente um índice B-tree único.

Uma tabela pode possuir apenas uma primary key. Ela pode usar uma coluna:

```sql
PRIMARY KEY (id)
```

Ou várias:

```sql
PRIMARY KEY (coluna_a, coluna_b)
```

A segunda forma é uma chave composta. Nesta aula, o domínio principal usará chave simples em `id`.

Primary key não é apenas um detalhe técnico. Ela declara:

```text
esta é a identidade oficial da tabela.
```

Essa informação é usada por ferramentas, aplicações, ORMs, foreign keys e processos de integração.

---

### Chave natural e chave substituta

Chave natural usa um dado que já existe no negócio:

```text
CPF;
CNPJ;
código de produto;
número de contrato;
código da ordem.
```

Chave substituta é criada especificamente para identificar a linha:

```text
id bigint
```

Uma chave natural precisa ser única, obrigatória e estável. Na prática, documentos podem ser corrigidos, códigos podem mudar e regras externas podem evoluir.

Por isso, o laboratório usará uma chave substituta `id`.

Os códigos de negócio continuarão existindo:

```text
cliente.documento;
produto.codigo;
ordem_servico.codigo;
atividade.codigo.
```

Na aula 276, `UNIQUE` poderá proteger valores de negócio quando a regra exigir.

Regra:

```text
primary key identifica a linha;
código de negócio identifica o registro no domínio.
```

---

### Bigint e UUID

`bigint` é comum para identidade numérica crescente. Ele possui ampla faixa, armazenamento previsível e boa integração com sequências.

UUID pode ser adequado quando há geração distribuída, integração entre sistemas ou necessidade de identificadores não sequenciais.

Nenhum é automaticamente melhor. Nesta aula, manteremos `bigint` porque as tabelas já foram criadas com esse tipo.

---

### O que e identity column

Identity column pede ao PostgreSQL que gere valores automaticamente.

Em uma tabela nova:

```sql
id bigint GENERATED BY DEFAULT AS IDENTITY
```

Como as tabelas já existem, usaremos:

```sql
ALTER TABLE app.cliente
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;
```

Existem duas formas principais:

```text
GENERATED ALWAYS:
o banco espera controlar o valor.

GENERATED BY DEFAULT:
o banco gera, mas permite valor explícito.
```

Usaremos `BY DEFAULT` porque os testes controlados informarão IDs específicos.

Importante:

```text
identity gera valor;
primary key garante identidade.
```

Identity sozinha não impede valores duplicados informados explicitamente.

A geração é sustentada por uma sequência. Não use `max(id) + 1`: essa abordagem falha quando operações concorrentes calculam o mesmo próximo valor.

---

### Constraints nomeadas

Você poderia deixar o PostgreSQL escolher nomes, mas usaremos nomes explícitos:

```text
pk_<tabela>
fk_<tabela_origem>_<tabela_destino>
```

Exemplos:

```text
pk_cliente
pk_ordem_servico
fk_ordem_servico_cliente
fk_atividade_ordem_servico
```

Nomes claros melhoram mensagens de erro, scripts de alteração, diagnóstico e documentação.

---

### O que e foreign key

Foreign key exige correspondência entre tabelas relacionadas.

Exemplo:

```sql
ALTER TABLE app.ordem_servico
ADD CONSTRAINT fk_ordem_servico_cliente
FOREIGN KEY (cliente_id)
REFERENCES app.cliente (id);
```

Leitura:

```text
todo cliente_id não nulo em ordem_servico
deve existir como id em cliente.
```

A tabela que possui a foreign key é a referenciadora:

```text
app.ordem_servico
```

A tabela apontada é a referenciada:

```text
app.cliente
```

A foreign key mantém integridade referencial.

---

### Integridade referencial

Sem foreign key, o banco aceitaria uma ordem apontando para um cliente inexistente.

Com foreign key, a operação é rejeitada.

A regra vale independentemente de quem executa o comando:

- aplicação Java;
- DBeaver;
- script;
- integração;
- ferramenta administrativa.

A aplicação valida para oferecer uma boa experiência. O banco valida para proteger os dados. As duas camadas se complementam.

---

### Tipos compativeis e chave de destino

A coluna de origem e a coluna referenciada precisam possuir tipos compatíveis.

No laboratório:

```text
cliente.id: bigint
ordem_servico.cliente_id: bigint
```

A foreign key precisa apontar para uma coluna protegida por primary key, unique constraint ou índice único adequado. Nesta aula, todas apontarão para primary keys.

---

### Null em foreign key

Por padrão, foreign key não impede `null`.

Se `ordem_servico.produto_id` estiver nulo, não há valor para conferir na tabela `produto`.

Isso não decide se o produto deveria ser obrigatório no domínio.

Separação:

```text
foreign key:
quando existe valor, ele precisa ser válido.

NOT NULL:
o valor precisa existir.
```

A obrigatoriedade será tratada na aula 276.

---

### ON DELETE

Ao remover uma linha referenciada, o banco precisa tratar os dependentes.

Opções principais:

```text
NO ACTION;
RESTRICT;
CASCADE;
SET NULL;
SET DEFAULT.
```

`NO ACTION` é o padrão e rejeita a mudança se a referência inválida continuar quando a constraint for verificada.

`RESTRICT` bloqueia a remoção imediatamente quando existem dependentes.

Usaremos:

```sql
ON DELETE RESTRICT
```

Isso evita apagar um cliente que possui ordens ou uma ordem que possui atividades e eventos.

`CASCADE` remove automaticamente os filhos. Pode ser adequado quando o filho não possui sentido sem o pai, mas também pode apagar uma cadeia inteira. Nesta aula, ele será demonstrado apenas em tabelas descartáveis.

`SET NULL` remove a referência mantendo a linha, desde que a relação seja opcional.

`SET DEFAULT` aplica o valor padrão, que ainda precisa ser válido. Defaults serão estudados na aula 276.

---

### ON UPDATE

Foreign keys também permitem ações quando a chave de destino muda.

Como a primary key substituta deve ser estável, usaremos:

```sql
ON UPDATE RESTRICT
```

Alterar `cliente.id` não deve ser uma operação comum de negócio.

---

### Foreign key e indice

A primary key cria automaticamente um índice único na coluna referenciada.

A foreign key não cria automaticamente índice na coluna de origem.

Exemplo:

```text
cliente.id:
recebe índice da primary key.

ordem_servico.cliente_id:
não recebe índice somente por ser foreign key.
```

Em tabelas grandes, índices nas foreign keys podem ser importantes. Eles serão estudados na aula 291. Não os crie agora.

---

### Constraint em tabela existente

Ao adicionar uma constraint, PostgreSQL verifica as linhas existentes.

O comando falha se houver:

```text
IDs repetidos;
IDs nulos;
referências órfãs;
tipos incompatíveis.
```

As tabelas do laboratório estão vazias, então a aplicação será direta. Em bancos reais, é necessário diagnosticar e corrigir dados antes de ativar a garantia.

---

### Integridade de entidade, dominio e referencia

É útil separar três ideias que costumam ser misturadas.

Integridade de entidade protege a identidade de cada linha. No laboratório, esse papel será exercido pela primary key. Duas linhas de `cliente` não poderão compartilhar o mesmo `id`, e nenhuma linha poderá existir com `id` nulo.

Integridade referencial protege a ligação entre tabelas. Uma ordem só poderá apontar para um cliente existente, e uma atividade só poderá apontar para uma ordem existente.

Integridade de domínio protege os valores permitidos dentro de cada coluna. Exemplos:

```text
status dentro de uma lista conhecida;
valor maior ou igual a zero;
código obrigatório;
data final posterior à data inicial.
```

Essa terceira dimensão será aprofundada na aula 276 com `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT`.

O modelo fica mais claro quando você consegue dizer qual regra resolve cada problema:

```text
linha sem identidade:
primary key.

referência para linha inexistente:
foreign key.

valor inválido dentro da própria linha:
constraints de domínio.
```

Não use uma camada para tentar substituir a outra. Uma foreign key não garante que o status seja válido. Um `CHECK` não garante que o cliente exista. Uma validação Java não substitui a proteção estrutural do banco.

---

### Constraint como contrato executavel

Uma constraint não é apenas documentação. Ela é um contrato executado pelo PostgreSQL toda vez que uma operação tenta produzir um estado incompatível.

Considere a regra:

```text
toda atividade pertence a uma ordem de serviço existente.
```

Sem foreign key, essa frase depende da disciplina de todas as aplicações, scripts e usuários que escrevem no banco.

Com foreign key, a frase vira regra técnica:

```sql
FOREIGN KEY (ordem_servico_id)
REFERENCES app.ordem_servico (id)
```

Essa transformação é uma habilidade importante de engenharia:

```text
regra declarada em documento;
regra representada no modelo;
regra garantida pelo banco;
regra validada por teste controlado.
```

Ao ler um erro de constraint, não trate a mensagem como obstáculo. Ela informa que o banco evitou um estado inválido. Identifique:

- qual constraint falhou;
- qual tabela recebeu a operação;
- qual valor causou a violação;
- qual regra de domínio está representada;
- se o problema está no dado, na ordem da operação ou na modelagem.

Esse processo transforma erro técnico em diagnóstico de negócio.

---

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

---

### 2. Criar o laboratorio

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-275-primary-key-foreign-key-integridade-referencial\sql"

Set-Location `
  "labs\m12\aula-275-primary-key-foreign-key-integridade-referencial"
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
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema IN ('app', 'auditoria')
  AND table_name IN (
      'cliente',
      'produto',
      'ordem_servico',
      'atividade',
      'evento_ordem_servico'
  )
ORDER BY table_schema, table_name;

SELECT
    table_schema,
    table_name,
    column_name,
    data_type,
    is_identity
FROM information_schema.columns
WHERE table_schema IN ('app', 'auditoria')
  AND column_name IN (
      'id',
      'cliente_id',
      'produto_id',
      'ordem_servico_id'
  )
ORDER BY table_schema, table_name, ordinal_position;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-275-primary-key-foreign-key-integridade-referencial\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

As cinco tabelas precisam existir e `id` ainda deve aparecer com `is_identity = NO`.

---

### 4. Criar 01_adicionar_identity.sql

Crie:

```text
sql/01_adicionar_identity.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;

ALTER TABLE app.produto
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;

ALTER TABLE app.ordem_servico
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;

ALTER TABLE app.atividade
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;

ALTER TABLE auditoria.evento_ordem_servico
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-275-primary-key-foreign-key-integridade-referencial\sql\01_adicionar_identity.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Inspecione:

```powershell
docker exec formacao-postgres-m12 `
  psql -U formacao -d formacao_java `
  -c "\d app.cliente"
```

Procure por `generated by default as identity`.

---

### 5. Criar 02_adicionar_primary_keys.sql

Crie:

```text
sql/02_adicionar_primary_keys.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
ADD CONSTRAINT pk_cliente
PRIMARY KEY (id);

ALTER TABLE app.produto
ADD CONSTRAINT pk_produto
PRIMARY KEY (id);

ALTER TABLE app.ordem_servico
ADD CONSTRAINT pk_ordem_servico
PRIMARY KEY (id);

ALTER TABLE app.atividade
ADD CONSTRAINT pk_atividade
PRIMARY KEY (id);

ALTER TABLE auditoria.evento_ordem_servico
ADD CONSTRAINT pk_evento_ordem_servico
PRIMARY KEY (id);
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-275-primary-key-foreign-key-integridade-referencial\sql\02_adicionar_primary_keys.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Entre no `psql`:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Inspecione:

```text
\d app.cliente
\d app.ordem_servico
```

Observe primary key, índice e `id` não nulo. Saia com `\q`.

---

### 6. Criar 03_adicionar_foreign_keys.sql

Crie:

```text
sql/03_adicionar_foreign_keys.sql
```

Conteúdo:

```sql
ALTER TABLE app.ordem_servico
ADD CONSTRAINT fk_ordem_servico_cliente
FOREIGN KEY (cliente_id)
REFERENCES app.cliente (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;

ALTER TABLE app.ordem_servico
ADD CONSTRAINT fk_ordem_servico_produto
FOREIGN KEY (produto_id)
REFERENCES app.produto (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;

ALTER TABLE app.atividade
ADD CONSTRAINT fk_atividade_ordem_servico
FOREIGN KEY (ordem_servico_id)
REFERENCES app.ordem_servico (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;

ALTER TABLE auditoria.evento_ordem_servico
ADD CONSTRAINT fk_evento_ordem_servico_ordem
FOREIGN KEY (ordem_servico_id)
REFERENCES app.ordem_servico (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-275-primary-key-foreign-key-integridade-referencial\sql\03_adicionar_foreign_keys.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Agora o banco protege:

```text
ordem -> cliente;
ordem -> produto;
atividade -> ordem;
evento -> ordem.
```

---

### 7. Criar 04_inspecionar_constraints.sql

Crie:

```text
sql/04_inspecionar_constraints.sql
```

Conteúdo:

```sql
SELECT
    ns.nspname AS schema_name,
    tab.relname AS table_name,
    con.conname AS constraint_name,
    CASE con.contype
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
  AND con.contype IN ('p', 'f')
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

Execute e confirme:

```text
cinco primary keys;
quatro foreign keys;
índices das primary keys;
nenhum índice automático nas colunas de origem das foreign keys.
```

---

### 8. Criar 05_dados_validos_para_teste.sql

Crie:

```text
sql/05_dados_validos_para_teste.sql
```

Conteúdo:

```sql
INSERT INTO app.cliente (
    id, nome, documento, ativo, criado_em, email
)
VALUES (
    900001,
    'Cliente Aula 275',
    '00123456789000',
    true,
    CURRENT_TIMESTAMP,
    'cliente275@exemplo.local'
);

INSERT INTO app.produto (
    id, codigo, nome, valor, ativo, criado_em, descricao
)
VALUES (
    900001,
    'PROD-275',
    'Produto Aula 275',
    199.90,
    true,
    CURRENT_TIMESTAMP,
    'Produto usado no teste de integridade'
);

INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    data_agendada,
    inicio_previsto,
    valor_previsto,
    urgente,
    descricao_problema,
    criado_em,
    prioridade
)
VALUES (
    900001,
    'OS-275-001',
    900001,
    900001,
    'ABERTA',
    CURRENT_DATE,
    '09:00:00',
    199.90,
    false,
    'Teste válido de integridade referencial',
    CURRENT_TIMESTAMP,
    'NORMAL'
);

INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista
)
VALUES (
    900001,
    900001,
    'ATV-275-001',
    'Atividade válida da aula 275',
    'PENDENTE',
    80.00,
    '2 hours'::interval
);

INSERT INTO auditoria.evento_ordem_servico (
    id,
    ordem_servico_id,
    tipo,
    descricao,
    ocorrido_em
)
VALUES (
    900001,
    900001,
    'CRIACAO_TESTE',
    'Evento válido da aula 275',
    CURRENT_TIMESTAMP
);
```

Esses comandos servem apenas para validar as constraints.

Execute com `ON_ERROR_STOP=1`. Os cinco devem funcionar.

---

### 9. Criar 06_erros_controlados.sql

Crie:

```text
sql/06_erros_controlados.sql
```

Conteúdo:

```sql
-- Execute cada bloco separadamente no DBeaver ou psql.
-- Cada instrução abaixo deve falhar.

-- Primary key duplicada.
INSERT INTO app.cliente (id, nome)
VALUES (900001, 'Cliente duplicado');

-- Cliente inexistente.
INSERT INTO app.ordem_servico (
    id, codigo, cliente_id, produto_id
)
VALUES (
    900002, 'OS-275-INVALIDA', 999999, 900001
);

-- Ordem inexistente.
INSERT INTO app.atividade (
    id, ordem_servico_id, codigo
)
VALUES (
    900002, 999999, 'ATV-INVALIDA'
);

-- Cliente ainda referenciado.
DELETE FROM app.cliente
WHERE id = 900001;

-- Ordem ainda referenciada.
DELETE FROM app.ordem_servico
WHERE id = 900001;
```

Não execute o arquivo inteiro pelo fluxo automatizado.

Execute uma instrução por vez e procure os nomes das constraints nas mensagens:

```text
pk_cliente
fk_ordem_servico_cliente
fk_atividade_ordem_servico
fk_evento_ordem_servico_ordem
```

---

### 10. Criar 07_limpar_dados_teste.sql

Crie:

```text
sql/07_limpar_dados_teste.sql
```

Conteúdo:

```sql
DELETE FROM auditoria.evento_ordem_servico
WHERE id = 900001;

DELETE FROM app.atividade
WHERE id = 900001;

DELETE FROM app.ordem_servico
WHERE id = 900001;

DELETE FROM app.produto
WHERE id = 900001;

DELETE FROM app.cliente
WHERE id = 900001;
```

A ordem importa:

```text
primeiro filhos;
depois pais.
```

Execute com `ON_ERROR_STOP=1`.

---

### 11. Criar 08_validacao_final.sql

Crie:

```text
sql/08_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    ns.nspname AS schema_name,
    tab.relname AS table_name,
    con.conname AS constraint_name,
    con.contype AS constraint_code,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class tab
  ON tab.oid = con.conrelid
JOIN pg_namespace ns
  ON ns.oid = tab.relnamespace
WHERE ns.nspname IN ('app', 'auditoria')
  AND con.contype IN ('p', 'f')
ORDER BY ns.nspname, tab.relname, con.contype, con.conname;

SELECT
    table_schema,
    table_name,
    column_name,
    is_identity,
    identity_generation
FROM information_schema.columns
WHERE table_schema IN ('app', 'auditoria')
  AND column_name = 'id'
ORDER BY table_schema, table_name;

SELECT
    (SELECT count(*) FROM app.cliente WHERE id = 900001)
        AS clientes_teste,
    (SELECT count(*) FROM app.produto WHERE id = 900001)
        AS produtos_teste,
    (SELECT count(*) FROM app.ordem_servico WHERE id = 900001)
        AS ordens_teste,
    (SELECT count(*) FROM app.atividade WHERE id = 900001)
        AS atividades_teste,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id = 900001
    ) AS eventos_teste;
```

Resultado esperado:

```text
cinco primary keys;
quatro foreign keys;
cinco identity columns;
zero registros de teste.
```

---

### 12. Criar README.md

Registre:

```text
Título:
Aula 275 - Primary key foreign key e integridade referencial.

Pré-requisito:
tabelas da aula 274 existentes.

Objetivo:
adicionar identity, primary keys e foreign keys.

Política de remoção:
RESTRICT nas relações principais.

Execução:
rodar 00 a 05;
executar 06 manualmente, uma instrução por vez;
rodar 07 e 08.

Regra:
não adicionar UNIQUE, CHECK, DEFAULT ou índices manuais.

Próxima aula:
NOT NULL, UNIQUE, CHECK e DEFAULT.
```

Liste os relacionamentos e a ordem dos scripts.

---

## Entendendo o que foi feito

### Identity e primary key resolveram problemas diferentes

Identity automatizou a geração.

Primary key protegeu:

```text
unicidade;
não nulidade;
identidade oficial.
```

Se existisse identity sem primary key, valores explícitos ainda poderiam repetir. Se existisse primary key sem identity, a identidade seria protegida, mas o valor precisaria ser fornecido por outra estratégia.

---

### Foreign key transformou numero em referencia

Antes:

```text
cliente_id era apenas bigint.
```

Depois:

```text
cliente_id precisa corresponder a cliente.id.
```

A semântica saiu da convenção e virou regra executável.

---

### A ordem de limpeza demonstrou dependencia

Você não pôde apagar primeiro cliente ou ordem porque existiam linhas dependentes.

A limpeza seguiu:

```text
evento;
atividade;
ordem;
produto;
cliente.
```

Essa ordem é consequência do grafo de relacionamentos.

---

### O banco protege qualquer caminho de escrita

Mesmo que uma aplicação esqueça uma validação, a foreign key continua ativa.

Isso não elimina validação na aplicação. A aplicação produz mensagens adequadas e aplica regras de caso de uso; o banco impede estados estruturalmente inválidos.

---

### O modelo ainda nao esta completo

As tabelas ainda podem aceitar:

```text
nome nulo;
código repetido;
valor negativo;
status inválido;
ativo nulo.
```

Esses problemas serão tratados na aula 276.

---

## Erros comuns importantes

### Multiple primary keys

A tabela já possui primary key.

Inspecione com:

```text
\d app.cliente
```

Não adicione uma segunda sem entender a estrutura.

---

### Duplicate key violates primary key

O `id` já existe.

A correção não é remover a constraint. Corrija a estratégia de geração ou o dado.

---

### Foreign key violation

O valor informado não existe na tabela referenciada.

Confirme:

- nome da constraint;
- coluna de origem;
- valor;
- tabela de destino;
- ordem de criação dos dados.

---

### Cannot delete referenced row

O pai possui dependentes.

Não troque `RESTRICT` por `CASCADE` apenas para fazer o comando passar. Decida se os filhos devem ser removidos, se o pai deve ser inativado ou se existe retenção histórica.

---

### Identity already exists

O script foi executado novamente.

Scripts de evolução devem ser aplicados uma vez em estado conhecido. Inspecione `information_schema.columns` antes de repetir.

---

## Comandos uteis

### Descrever tabela

```text
\d app.ordem_servico
```

### Listar constraints

```sql
SELECT
    conname,
    contype,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'app.ordem_servico'::regclass;
```

### Inspecionar identity

```sql
SELECT
    table_schema,
    table_name,
    column_name,
    is_identity,
    identity_generation
FROM information_schema.columns
WHERE column_name = 'id';
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

Se `app.tecnico` foi criado no exercício da aula 274, crie:

```text
sql/09_exercicio_tecnico.sql
```

Adicione:

```sql
ALTER TABLE app.tecnico
ALTER COLUMN id
ADD GENERATED BY DEFAULT AS IDENTITY;

ALTER TABLE app.tecnico
ADD CONSTRAINT pk_tecnico
PRIMARY KEY (id);
```

Se a tabela não existir, crie-a usando o modelo da aula 274, sem antecipar outras constraints.

---

### Parte 2 - Relacionar atividade e tecnico

```sql
ALTER TABLE app.atividade
ADD COLUMN tecnico_id bigint;

ALTER TABLE app.atividade
ADD CONSTRAINT fk_atividade_tecnico
FOREIGN KEY (tecnico_id)
REFERENCES app.tecnico (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

O relacionamento permanece opcional porque `NOT NULL` ainda não foi estudado.

---

### Parte 3 - Testar a referencia

Insira um técnico válido:

```sql
INSERT INTO app.tecnico (
    id, codigo, nome
)
VALUES (
    900001, 'TEC-275', 'Tecnico Aula 275'
);
```

Crie uma atividade apontando para esse técnico e tente criar outra com `tecnico_id = 999999`.

A segunda deve falhar.

Depois remova os dados na ordem correta.

---

### Parte 4 - Demonstrar CASCADE em tabelas descartaveis

```sql
CREATE TABLE app.laboratorio_pai (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    CONSTRAINT pk_laboratorio_pai PRIMARY KEY (id)
);

CREATE TABLE app.laboratorio_filho (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    pai_id bigint,
    CONSTRAINT pk_laboratorio_filho PRIMARY KEY (id),
    CONSTRAINT fk_laboratorio_filho_pai
        FOREIGN KEY (pai_id)
        REFERENCES app.laboratorio_pai (id)
        ON DELETE CASCADE
);
```

Insira um pai e um filho, remova o pai e confirme que o filho foi removido automaticamente.

Depois:

```sql
DROP TABLE app.laboratorio_filho RESTRICT;
DROP TABLE app.laboratorio_pai RESTRICT;
```

Use `CASCADE` somente para observar o comportamento no objeto descartável.

---

### Parte 5 - Documentar a decisao

No README, responda:

1. Por que as tabelas principais usam `RESTRICT`?
2. Em que cenário `CASCADE` seria adequado?
3. Por que identity não substitui primary key?
4. Por que foreign key não torna a coluna obrigatória?
5. Por que foreign key não criou índice em `tecnico_id`?
6. Quando uma chave natural poderia ser usada?

---

## Criterios de aceite

- o laboratório oficial da aula 275 existe;
- as tabelas da aula 274 foram reutilizadas;
- cinco colunas `id` viraram identity;
- cinco primary keys nomeadas foram criadas;
- quatro foreign keys principais foram criadas;
- a política principal usa `ON DELETE RESTRICT`;
- constraints foram inspecionadas em `pg_constraint`;
- índices de primary key foram identificados;
- ficou claro que foreign key não cria índice na origem;
- dados válidos foram aceitos;
- primary key duplicada foi rejeitada;
- referência inexistente foi rejeitada;
- remoção de pai referenciado foi bloqueada;
- dados de teste foram removidos na ordem correta;
- `UNIQUE`, `CHECK`, `DEFAULT` e índices manuais não foram antecipados;
- `NOT NULL` só apareceu como efeito da primary key;
- o exercício com técnico foi concluído;
- `CASCADE` foi testado apenas em tabelas descartáveis;
- README e scripts estão prontos;
- o commit pode ser realizado.

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
  labs/m12/aula-275-primary-key-foreign-key-integridade-referencial
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): proteger identidade e relacionamentos"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
identity columns;
primary keys;
foreign keys;
integridade referencial;
testes controlados de violação.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, as tabelas deixaram de ser apenas estruturas com nomes relacionados.

Você aprendeu:

```text
id bigint:
apenas uma coluna.

identity:
gera valores.

primary key:
define identidade única e não nula.

cliente_id bigint:
apenas uma coluna.

foreign key:
protege a referência a cliente.id.
```

Também estudou:

- chave natural e substituta;
- `bigint` e UUID como estratégias possíveis;
- constraints nomeadas;
- tabelas referenciada e referenciadora;
- compatibilidade de tipos;
- referência opcional;
- `ON DELETE RESTRICT`;
- riscos de `CASCADE`;
- inspeção em `pg_constraint`;
- índices automáticos de primary key;
- ausência de índice automático na foreign key;
- validação de dados existentes ao adicionar constraints.

Na prática, PostgreSQL rejeitou:

- identificador duplicado;
- cliente inexistente;
- atividade ligada a ordem inexistente;
- remoção de cliente usado;
- remoção de ordem referenciada.

A próxima aula será:

```text
276 - M12.06 - Constraints not null unique check default
```

Nela, você vai proteger outras dimensões do domínio:

```text
NOT NULL:
dados obrigatórios.

UNIQUE:
valores ou combinações que não podem repetir.

CHECK:
expressões que cada linha precisa respeitar.

DEFAULT:
valor usado quando a inserção não informa a coluna.
```

Você aplicará regras como código obrigatório, documento não repetido, valor não negativo, status controlado, datas coerentes e valores iniciais.

Primary key e foreign key já protegem identidade e relacionamento. A aula 276 protegerá conteúdo e obrigatoriedade.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei identity e primary keys às tabelas.
- [ ] Criei e inspecionei foreign keys nomeadas.
- [ ] Observei violações de identidade e referência.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Existing data violates foreign key

Ao adicionar foreign key, PostgreSQL verifica as linhas existentes.

Se houver órfãos, o comando falha.

Diagnóstico conceitual:

```sql
SELECT os.*
FROM app.ordem_servico os
LEFT JOIN app.cliente c
  ON c.id = os.cliente_id
WHERE os.cliente_id IS NOT NULL
  AND c.id IS NULL;
```

`JOIN` será aprofundado na aula 280. Aqui, a consulta serve apenas como referência de diagnóstico.

Não remova dados automaticamente. Entenda a origem da inconsistência.

---

### Existing data violates primary key

Pode haver IDs repetidos ou nulos.

Em ambiente real, a correção pode exigir migração dos identificadores e atualização das referências.

---

### Sequence e valor explicito

`GENERATED BY DEFAULT` permite ID manual.

A sequência não avança necessariamente para acompanhar um valor explícito muito alto.

No laboratório, os IDs `900001` são removidos. Em cargas reais, valores explícitos exigem ajuste planejado da sequência.

---

### Foreign key permite null

Isso é esperado.

A foreign key valida valores presentes. `NOT NULL` será usado quando o domínio exigir presença, na aula 276.

---

## Perguntas de revisao

1. O que a primary key garante?
2. Qual a diferença entre identity e primary key?
3. O que é chave natural?
4. O que é chave substituta?
5. Por que usamos `bigint`?
6. O que a foreign key garante?
7. Qual é a tabela referenciada?
8. Qual é a referenciadora?
9. Por que foreign key pode aceitar `null`?
10. Quando `RESTRICT` é adequado?
11. Qual é o risco de `CASCADE`?
12. Primary key cria índice?
13. Foreign key cria índice na origem?
14. Por que nomear constraints?
15. O que acontece ao adicionar uma constraint sobre dados inválidos?

---

## Roteiro de resposta

### 1. Primary key

Garante identidade única e não nula.

### 2. Identity e primary key

Identity gera valores. Primary key protege identidade.

### 3. Chave natural

Usa um dado do negócio como identidade.

### 4. Chave substituta

É criada especificamente para identificar a linha.

### 5. Bigint

Oferece ampla faixa e integração simples para identidade numérica crescente.

### 6. Foreign key

Exige correspondência com uma linha da tabela referenciada.

### 7. Referenciada

É a tabela que oferece a chave de destino.

### 8. Referenciadora

É a tabela que possui a foreign key.

### 9. Null

Sem `NOT NULL`, ausência de referência é permitida.

### 10. RESTRICT

É adequado quando o pai não deve ser removido enquanto houver dependentes.

### 11. CASCADE

Pode remover automaticamente uma cadeia de registros.

### 12. Índice da primary key

PostgreSQL cria um índice B-tree único.

### 13. Índice da foreign key

Não é criado automaticamente na coluna referenciadora.

### 14. Nomes

Melhoram mensagens, scripts e diagnóstico.

### 15. Dados existentes

PostgreSQL rejeita a constraint se houver violações.

---

## Desafio opcional

Se você criou `app.contrato` no desafio da aula 274:

1. transforme `id` em identity;
2. crie `pk_contrato`;
3. crie `fk_contrato_cliente`;
4. use `ON DELETE RESTRICT`;
5. insira um contrato válido;
6. tente inserir contrato com cliente inexistente;
7. tente remover o cliente usado;
8. limpe os dados;
9. inspecione as constraints.

Não adicione `UNIQUE`, `CHECK`, `DEFAULT` ou `NOT NULL` fora da primary key.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 275 - M12.05 - Primary key foreign key e integridade referencial

- Diferenciei identity column de primary key.
- Transformei as colunas `id` em identities `BY DEFAULT`.
- Criei primary keys nomeadas para as tabelas principais.
- Entendi chaves naturais e substitutas.
- Criei foreign keys entre cliente, produto, ordem, atividade e auditoria.
- Apliquei `ON UPDATE RESTRICT` e `ON DELETE RESTRICT`.
- Observei o banco rejeitar IDs duplicados e referências inexistentes.
- Confirmei que primary key cria índice automaticamente.
- Registrei que foreign key não cria índice na coluna de origem.
- Limpei os dados de teste respeitando a ordem de dependência.
- Mantive `UNIQUE`, `CHECK`, `DEFAULT` e `NOT NULL` independente para a aula seguinte.
- Próxima aula: constraints `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT`.
```

---

## Referencia tecnica curta

```text
IDENTITY:
gera valor.

PRIMARY KEY:
identidade única e não nula.

FOREIGN KEY:
referência válida entre tabelas.

REFERENCED TABLE:
tabela de destino.

REFERENCING TABLE:
tabela que possui a foreign key.

RESTRICT:
bloqueia remoção com dependentes.

CASCADE:
propaga remoção ou atualização.

SET NULL:
remove a referência mantendo a linha.

PK:
cria índice único automaticamente.

FK:
não cria índice automaticamente na origem.
```

Regra final:

```text
nomes sugerem relacionamentos;
constraints garantem relacionamentos.
```
