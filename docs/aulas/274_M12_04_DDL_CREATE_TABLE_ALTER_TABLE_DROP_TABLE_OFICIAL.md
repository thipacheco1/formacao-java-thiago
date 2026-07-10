# 274 - M12.04 - DDL create table alter table drop table

## Apresentacao da aula

Na aula 273, você estudou tipos de dados PostgreSQL com critério. Em vez de criar colunas por hábito, você analisou o significado de cada informação e diferenciou tipos inteiros, decimais, textuais, booleanos, temporais e UUID.

Agora chegou o momento de transformar decisões de modelagem em estruturas reais no banco.

Nesta aula, você vai trabalhar com DDL:

```text
Data Definition Language
```

Em português:

```text
Linguagem de Definição de Dados
```

DDL é a parte do SQL usada para criar, alterar e remover objetos do banco de dados.

Os comandos centrais desta aula serão:

```sql
CREATE TABLE
ALTER TABLE
DROP TABLE
```

Esses comandos não manipulam registros de negócio. Eles manipulam a estrutura que receberá os registros.

A diferença é importante:

```text
DDL:
define a estrutura.

DML:
insere, altera e remove dados.
```

Os comandos de manipulação de dados, como `INSERT`, `UPDATE` e `DELETE`, serão estudados na aula 277.

Nesta aula, você criará tabelas do domínio de Ordem de Serviço, inspecionará a estrutura gerada, fará evoluções controladas com `ALTER TABLE` e praticará `DROP TABLE` apenas em objetos descartáveis.

Ainda não vamos definir primary key, foreign key, integridade referencial, `NOT NULL`, `UNIQUE`, `CHECK` ou `DEFAULT`. Esses assuntos pertencem às aulas 275 e 276.

Ao final da aula, você deverá conseguir:

- explicar o que é DDL;
- criar tabelas em um schema específico;
- definir colunas com tipos escolhidos conscientemente;
- inspecionar objetos criados;
- adicionar, renomear e remover colunas;
- alterar o tipo de uma coluna;
- renomear uma tabela;
- remover uma tabela com segurança;
- entender o risco de `CASCADE`;
- diferenciar script inicial de script de evolução;
- versionar a estrutura do laboratório;
- preparar o banco para o estudo de chaves e integridade referencial.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
271:
introdução a banco de dados, SGBD, SQL e PostgreSQL.

272:
DBeaver, psql, schemas e rotina de trabalho.

273:
tipos de dados PostgreSQL com critério.

274:
DDL com CREATE TABLE, ALTER TABLE e DROP TABLE.

275:
primary key, foreign key e integridade referencial.

276:
constraints NOT NULL, UNIQUE, CHECK e DEFAULT.

277:
INSERT, UPDATE, DELETE e retorno de dados.
```

Até a aula 273, você já possuía:

- um servidor PostgreSQL local;
- o banco `formacao_java`;
- os schemas `app` e `auditoria`;
- uma rotina com DBeaver e `psql`;
- scripts SQL versionados;
- um catálogo inicial de tipos para o domínio.

Agora você vai criar as primeiras tabelas permanentes do M12.

A intenção não é produzir o modelo final de Ordem de Serviço. A modelagem será refinada nas próximas aulas.

Hoje, as tabelas serão propositalmente simples:

```text
app.cliente
app.produto
app.ordem_servico
app.atividade
auditoria.evento_ordem_servico
```

As colunas de referência, como `cliente_id` e `ordem_servico_id`, existirão apenas como `bigint`.

Elas ainda não serão foreign keys.

Isso permite separar duas perguntas:

```text
A coluna existe?

O banco garante que o valor aponta para outra tabela?
```

Nesta aula, a resposta para a primeira pergunta será sim.

A garantia de relacionamento será construída na aula 275.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-274-ddl-create-table-alter-table-drop-table
```

Estrutura final:

```text
labs
└── m12
    └── aula-274-ddl-create-table-alter-table-drop-table
        ├── README.md
        └── sql
            ├── 00_verificar_contexto.sql
            ├── 01_create_tables.sql
            ├── 02_inspecionar_estrutura.sql
            ├── 03_alter_tables.sql
            ├── 04_pratica_drop_table.sql
            └── 05_validacao_final.sql
```

O laboratório será executado no PostgreSQL já iniciado nas aulas anteriores.

Você não criará outro Docker Compose.

O container esperado é:

```text
formacao-postgres-m12
```

O banco esperado é:

```text
formacao_java
```

Os schemas esperados são:

```text
app
auditoria
```

A prática seguirá este fluxo:

1. confirmar o contexto;
2. criar tabelas;
3. inspecionar estrutura;
4. alterar colunas e nomes;
5. criar e remover uma tabela descartável;
6. validar o estado final;
7. documentar e commitar.

---

## Conceito essencial

### O que e DDL

DDL é o conjunto de comandos SQL usado para definir objetos do banco.

Exemplos de objetos:

- schemas;
- tabelas;
- colunas;
- sequences;
- views;
- índices;
- constraints;
- tipos;
- funções.

Nesta aula, o foco ficará em tabelas e colunas.

Os comandos principais são:

```text
CREATE:
cria um objeto.

ALTER:
altera um objeto existente.

DROP:
remove um objeto.
```

Exemplo conceitual:

```sql
CREATE TABLE app.exemplo (
    id bigint,
    nome text
);
```

Depois:

```sql
ALTER TABLE app.exemplo
ADD COLUMN ativo boolean;
```

Por fim:

```sql
DROP TABLE app.exemplo;
```

Essas três operações representam o ciclo estrutural básico:

```text
criar;
evoluir;
remover.
```

---

### Estrutura nao e dado

Considere:

```sql
CREATE TABLE app.cliente (
    id bigint,
    nome text
);
```

Esse comando cria:

- o objeto `cliente`;
- duas colunas;
- os tipos de cada coluna;
- metadados internos.

Ele não cria clientes.

Depois do comando, a tabela existe, mas está vazia.

Isso ajuda a separar:

```text
estrutura:
tabela, coluna e tipo.

dado:
linha armazenada dentro da tabela.
```

Na aula 277, você usará `INSERT` para criar linhas.

---

### CREATE TABLE

A forma básica é:

```sql
CREATE TABLE schema.nome_tabela (
    nome_coluna tipo,
    outra_coluna outro_tipo
);
```

Exemplo:

```sql
CREATE TABLE app.produto (
    id bigint,
    codigo text,
    nome text,
    valor numeric(12, 2),
    ativo boolean
);
```

Cada definição de coluna contém, no mínimo:

```text
nome;
tipo.
```

Regras importantes de escrita:

- use nomes que comuniquem significado;
- qualifique a tabela com o schema;
- separe colunas por vírgula;
- finalize o comando com ponto e vírgula;
- revise tipos antes da execução;
- não misture várias responsabilidades na mesma tabela;
- mantenha o script versionado.

---

### Nomes em snake_case

No PostgreSQL, usaremos nomes em minúsculas com underscore:

```text
ordem_servico
cliente_id
data_agendada
valor_previsto
criado_em
```

Esse padrão é conhecido como:

```text
snake_case
```

Evite criar objetos com nomes entre aspas e letras maiúsculas:

```sql
CREATE TABLE "OrdemServico" ...
```

Quando um identificador é criado com aspas, o PostgreSQL passa a exigir correspondência exata de maiúsculas e minúsculas.

Exemplo:

```sql
SELECT * FROM "OrdemServico";
```

Sem aspas:

```sql
SELECT * FROM ordem_servico;
```

Para reduzir atrito, use nomes minúsculos, claros e sem aspas.

---

### Qualificar schema

Prefira:

```sql
CREATE TABLE app.cliente ...
```

Em vez de depender apenas do `search_path`:

```sql
CREATE TABLE cliente ...
```

O nome qualificado deixa explícito onde o objeto será criado.

Isso reduz o risco de:

- criar tabela no schema errado;
- consultar um objeto homônimo;
- depender da configuração da sessão;
- executar script de forma diferente em outro ambiente.

O `search_path` continua útil, mas scripts estruturais devem priorizar clareza.

---

### IF NOT EXISTS

PostgreSQL permite:

```sql
CREATE TABLE IF NOT EXISTS app.cliente (
    id bigint,
    nome text
);
```

Se a tabela já existir, o comando não falha por esse motivo.

Isso pode ser conveniente, mas precisa de critério.

`IF NOT EXISTS` não valida se a tabela existente possui a estrutura esperada.

A tabela pode existir com:

- colunas diferentes;
- tipos diferentes;
- nome igual e significado diferente;
- versão antiga.

Por isso, não use `IF NOT EXISTS` para esconder divergências.

Nesta aula, o script principal usará `CREATE TABLE` sem esse modificador. Antes de executá-lo novamente, você deverá inspecionar o estado do banco.

Em automação profissional, ferramentas de migração controlam a execução de versões. Esse tema aparecerá mais adiante no M12.

---

### Ordem de criacao

Quando ainda não existem foreign keys, as tabelas podem ser criadas em qualquer ordem técnica.

Mesmo assim, a ordem do script deve comunicar o domínio.

Usaremos:

```text
cliente;
produto;
ordem_servico;
atividade;
evento_ordem_servico.
```

Essa ordem mostra uma progressão conceitual:

```text
cadastros básicos;
objeto principal;
itens dependentes;
auditoria.
```

Na aula 275, a ordem de criação terá impacto maior porque relacionamentos passarão a ser protegidos por foreign keys.

---

### ALTER TABLE

`ALTER TABLE` modifica uma tabela existente.

Operações comuns:

```text
adicionar coluna;
remover coluna;
renomear coluna;
alterar tipo;
renomear tabela;
adicionar ou remover constraints;
alterar default;
alterar obrigatoriedade.
```

Nesta aula, usaremos apenas:

```text
ADD COLUMN;
RENAME COLUMN;
ALTER COLUMN TYPE;
DROP COLUMN;
RENAME TO.
```

Constraints ficarão para as próximas aulas.

---

### Adicionar coluna

Exemplo:

```sql
ALTER TABLE app.ordem_servico
ADD COLUMN prioridade text;
```

O PostgreSQL adiciona a coluna ao objeto existente.

Como a tabela ainda estará vazia, a operação será simples.

Em tabelas grandes e com dados, alterações estruturais podem exigir análise de impacto, bloqueios, tempo de execução e compatibilidade com versões da aplicação.

A formação aprofundará evolução segura de banco posteriormente.

---

### Renomear coluna

Exemplo:

```sql
ALTER TABLE app.ordem_servico
RENAME COLUMN observacao TO descricao;
```

Renomear uma coluna é diferente de remover e criar outra.

O rename preserva a coluna e muda o nome do objeto.

Em sistemas reais, renomear pode quebrar:

- consultas;
- aplicações;
- relatórios;
- integrações;
- views;
- scripts;
- testes.

Por isso, alteração estrutural precisa ser tratada como mudança de contrato.

No laboratório, ainda não existe aplicação consumindo as tabelas.

---

### Alterar tipo

Exemplo simples:

```sql
ALTER TABLE app.ordem_servico
ALTER COLUMN codigo TYPE varchar(50);
```

Quando o PostgreSQL consegue converter os valores automaticamente, o comando funciona sem expressão adicional.

Em outros casos, é necessário informar como converter:

```sql
ALTER TABLE app.exemplo
ALTER COLUMN valor TYPE integer
USING valor::integer;
```

A cláusula `USING` torna explícita a transformação.

Nesta aula, a tabela estará vazia, então a alteração de tipo não terá dados para converter. Mesmo assim, você verá a sintaxe.

Regra profissional:

```text
alterar tipo não é apenas mudar metadado;
pode exigir conversão de todos os valores existentes.
```

---

### Remover coluna

Exemplo:

```sql
ALTER TABLE app.ordem_servico
DROP COLUMN campo_legado;
```

Essa operação remove a coluna e os dados que existiam nela.

Por isso, `DROP COLUMN` é destrutivo.

No laboratório, você removerá apenas uma coluna criada propositalmente para treino.

Não use `DROP COLUMN` para corrigir um nome digitado errado sem antes avaliar se a coluna já possui dados ou dependências.

---

### Renomear tabela

Exemplo:

```sql
ALTER TABLE app.log_evento
RENAME TO evento_ordem_servico;
```

Ao renomear, o schema permanece o mesmo.

A tabela:

```text
auditoria.log_evento
```

passa a ser:

```text
auditoria.evento_ordem_servico
```

O nome deve representar a responsabilidade do objeto.

---

### DROP TABLE

`DROP TABLE` remove a tabela.

Exemplo:

```sql
DROP TABLE app.tabela_descartavel;
```

A operação remove:

- estrutura;
- colunas;
- dados;
- metadados associados;
- objetos dependentes quando permitido.

Não confunda:

```text
DELETE:
remove linhas.

TRUNCATE:
remove todas as linhas mantendo a tabela.

DROP TABLE:
remove a própria tabela.
```

`DELETE` e `TRUNCATE` serão estudados em momentos apropriados.

Nesta aula, `DROP TABLE` será praticado apenas em:

```text
app.laboratorio_drop
```

Essa tabela existirá somente para ser removida.

---

### IF EXISTS

Forma:

```sql
DROP TABLE IF EXISTS app.laboratorio_drop;
```

Se a tabela não existir, o comando não falha por esse motivo.

Isso pode ajudar em scripts de limpeza.

Mas também pode esconder um erro de nome.

Use com intenção.

Antes de apagar, confirme:

```text
database;
schema;
nome do objeto;
dependências;
finalidade.
```

---

### RESTRICT e CASCADE

Ao remover uma tabela, PostgreSQL trabalha com dependências.

Comportamento seguro padrão:

```sql
DROP TABLE app.exemplo RESTRICT;
```

`RESTRICT` impede a remoção se houver objetos dependentes.

`CASCADE` remove também objetos que dependem da tabela:

```sql
DROP TABLE app.exemplo CASCADE;
```

`CASCADE` é poderoso e perigoso.

Nunca use por reflexo.

Regra:

```text
se DROP falhar por dependência, investigue;
não acrescente CASCADE apenas para forçar o comando.
```

Nesta aula, usaremos `RESTRICT`.

---

### Script inicial e script de evolucao

Um script inicial descreve como um objeto nasce em um ambiente vazio.

Exemplo:

```text
01_create_tables.sql
```

Ele representa a primeira versão conhecida da estrutura.

Um script de evolução descreve uma mudança aplicada depois que a versão anterior já existe.

Exemplo:

```text
03_alter_tables.sql
```

A diferença parece simples, mas muda a forma de trabalhar.

Editar apenas o `CREATE TABLE` original pode ser suficiente enquanto o banco é descartável e ninguém depende dele. Em um sistema real, porém, o banco já possui dados, integrações e aplicações em execução. A mudança precisa respeitar o estado existente.

Imagine que a primeira versão tenha:

```text
observacao text
```

E a nova versão precise de:

```text
descricao_problema text
```

Em um banco vazio, você poderia alterar o arquivo inicial e recriar tudo.

Em um banco existente, a evolução correta precisa registrar:

```sql
ALTER TABLE app.ordem_servico
RENAME COLUMN observacao TO descricao_problema;
```

Esse script comunica:

- qual era o estado anterior;
- qual mudança aconteceu;
- qual objeto foi afetado;
- em que ordem a evolução deve ser aplicada.

A partir de agora, trate cada alteração de estrutura como uma mudança de contrato.

Antes de executar, responda:

```text
Qual é o estado atual?
Qual é o estado desejado?
O comando preserva dados?
Há consumidores usando o nome antigo?
A alteração pode ser repetida?
Como vou validar o resultado?
```

Ferramentas como Flyway serão estudadas depois. Nesta aula, você começa a construir a mentalidade que essas ferramentas automatizam.

---

### Inspecionar antes e depois

Uma alteração estrutural deve ter evidência.

Antes do comando, registre o estado:

```text
nome da tabela;
colunas;
tipos;
schema;
dependências conhecidas.
```

Depois do comando, confirme o resultado com:

```text
\d;
\dt;
information_schema.tables;
information_schema.columns.
```

Esse ciclo reduz mudanças baseadas apenas na expectativa:

```text
inspecionar;
alterar;
inspecionar novamente;
registrar.
```

Em ambiente profissional, o fato de o comando terminar sem erro não prova sozinho que a mudança ficou correta. A validação posterior faz parte da execução.

---

### DDL e risco operacional

DDL pode afetar outros usuários e aplicações.

Uma alteração pode:

- exigir bloqueio do objeto;
- esperar operações em andamento;
- invalidar consultas antigas;
- exigir conversão de dados;
- aumentar tempo de execução;
- falhar por dependências;
- produzir incompatibilidade entre versões da aplicação.

Nesta fase, o laboratório está vazio e controlado. Mesmo assim, você deve praticar o comportamento correto:

- confirmar o database;
- qualificar o schema;
- revisar o script;
- evitar `CASCADE`;
- executar uma mudança por intenção;
- validar o estado final;
- versionar o arquivo.

A complexidade de alterações sem indisponibilidade será estudada em módulos avançados. O hábito começa agora.

---

### DDL como codigo versionado

Uma alteração estrutural precisa existir em arquivo.

Evite depender apenas de comandos digitados manualmente no DBeaver.

O script versionado oferece:

- histórico;
- revisão;
- repetição;
- rastreabilidade;
- comparação;
- execução em outro ambiente;
- base para migrações futuras.

Nesta aula, teremos scripts separados por finalidade.

Isso ajuda a diferenciar:

```text
criação inicial;
evolução;
inspeção;
limpeza;
validação.
```

---

## Mao na massa guiada

### 1. Confirmar o PostgreSQL

Na raiz do repositório:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se o container não estiver ativo:

```powershell
Set-Location `
  "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"

docker compose up -d
docker compose ps

Set-Location ..\..\..
```

Não altere o Compose.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql"

Set-Location `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table"
```

---

### 3. Criar 00_verificar_contexto.sql

Crie:

```text
sql/00_verificar_contexto.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_schema() AS schema_atual;

SHOW search_path;

SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('app', 'auditoria')
ORDER BY schema_name;
```

Execute pela raiz do repositório:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql\00_verificar_contexto.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme:

```text
banco:
formacao_java.

usuario:
formacao.

schemas:
app e auditoria.
```

Não execute DDL antes dessa conferência.

---

### 4. Criar 01_create_tables.sql

Crie:

```text
sql/01_create_tables.sql
```

Conteúdo:

```sql
CREATE TABLE app.cliente (
    id bigint,
    nome text,
    documento text,
    ativo boolean,
    criado_em timestamptz
);

CREATE TABLE app.produto (
    id bigint,
    codigo text,
    nome text,
    valor numeric(12, 2),
    ativo boolean,
    criado_em timestamptz
);

CREATE TABLE app.ordem_servico (
    id bigint,
    codigo text,
    cliente_id bigint,
    produto_id bigint,
    status text,
    data_agendada date,
    inicio_previsto time,
    valor_previsto numeric(12, 2),
    urgente boolean,
    observacao text,
    criado_em timestamptz
);

CREATE TABLE app.atividade (
    id bigint,
    ordem_servico_id bigint,
    codigo text,
    descricao text,
    status text,
    valor_mao_obra numeric(12, 2),
    duracao_prevista interval,
    inicio_real timestamptz,
    fim_real timestamptz
);

CREATE TABLE auditoria.log_evento (
    id bigint,
    ordem_servico_id bigint,
    tipo text,
    descricao text,
    ocorrido_em timestamptz
);
```

Observe o que ainda não existe:

```text
primary key;
foreign key;
not null;
unique;
check;
default;
identity;
sequence;
índice.
```

Isso é intencional.

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql\01_create_tables.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado esperado:

```text
CREATE TABLE
```

para cada objeto.

---

### 5. Inspecionar com psql

Entre no `psql`:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Liste tabelas:

```text
\dt app.*
```

Depois:

```text
\dt auditoria.*
```

Inspecione:

```text
\d app.ordem_servico
```

E:

```text
\d app.atividade
```

Observe:

- nomes;
- tipos;
- schema;
- ausência de constraints;
- ausência de índices;
- nulabilidade atual.

Saia:

```text
\q
```

---

### 6. Criar 02_inspecionar_estrutura.sql

Crie:

```text
sql/02_inspecionar_estrutura.sql
```

Conteúdo:

```sql
SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema IN ('app', 'auditoria')
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

SELECT
    ordinal_position,
    column_name,
    data_type,
    is_nullable,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'app'
  AND table_name = 'ordem_servico'
ORDER BY ordinal_position;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql\02_inspecionar_estrutura.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A consulta mostra metadados.

Ela não consulta dados de negócio.

---

### 7. Criar 03_alter_tables.sql

Crie:

```text
sql/03_alter_tables.sql
```

Conteúdo:

```sql
ALTER TABLE app.cliente
ADD COLUMN email text;

ALTER TABLE app.produto
ADD COLUMN descricao text;

ALTER TABLE app.ordem_servico
ADD COLUMN prioridade text;

ALTER TABLE app.ordem_servico
ADD COLUMN campo_temporario text;

ALTER TABLE app.ordem_servico
RENAME COLUMN observacao TO descricao_problema;

ALTER TABLE app.ordem_servico
ALTER COLUMN codigo TYPE varchar(50);

ALTER TABLE app.atividade
ALTER COLUMN codigo TYPE varchar(50);

ALTER TABLE app.ordem_servico
DROP COLUMN campo_temporario;

ALTER TABLE auditoria.log_evento
RENAME TO evento_ordem_servico;
```

Esse script demonstra várias evoluções.

Antes de executar, preveja o resultado.

Depois execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql\03_alter_tables.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Agora inspecione:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Dentro do `psql`:

```text
\d app.cliente
```

```text
\d app.produto
```

```text
\d app.ordem_servico
```

```text
\dt auditoria.*
```

Saia com:

```text
\q
```

Confirme:

- `cliente` possui `email`;
- `produto` possui `descricao`;
- `ordem_servico` possui `prioridade`;
- `observacao` virou `descricao_problema`;
- `codigo` passou para `varchar(50)`;
- `campo_temporario` não existe;
- `log_evento` virou `evento_ordem_servico`.

---

### 8. Criar 04_pratica_drop_table.sql

Crie:

```text
sql/04_pratica_drop_table.sql
```

Conteúdo:

```sql
CREATE TABLE app.laboratorio_drop (
    id bigint,
    descricao text,
    criado_em timestamptz
);

DROP TABLE app.laboratorio_drop RESTRICT;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql\04_pratica_drop_table.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado esperado:

```text
CREATE TABLE
DROP TABLE
```

Confirme que a tabela não existe:

```powershell
docker exec formacao-postgres-m12 `
  psql -U formacao -d formacao_java `
  -c "\dt app.laboratorio_drop"
```

Resultado esperado:

```text
Did not find any relation named "app.laboratorio_drop".
```

Você praticou `DROP TABLE` sem destruir uma tabela do domínio.

---

### 9. Criar 05_validacao_final.sql

Crie:

```text
sql/05_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema IN ('app', 'auditoria')
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

SELECT
    table_schema,
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema IN ('app', 'auditoria')
ORDER BY table_schema, table_name, ordinal_position;

SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'app'
      AND table_name = 'laboratorio_drop'
) AS tabela_descartavel_existe;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-274-ddl-create-table-alter-table-drop-table\sql\05_validacao_final.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

O último resultado deve ser:

```text
false
```

---

### 10. Criar README.md

Crie:

```text
README.md
```

Inclua:

```text
Título:
Aula 274 - DDL create table alter table drop table.

Objetivo:
criar, inspecionar, alterar e remover estruturas de forma controlada.

Banco:
formacao_java.

Schemas:
app e auditoria.

Regra:
não adicionar primary key, foreign key, not null, unique, check ou default nesta aula.

Execução:
rodar os scripts em ordem com psql e ON_ERROR_STOP.

Próxima aula:
primary key, foreign key e integridade referencial.
```

Liste os arquivos SQL e descreva a finalidade de cada um.

---

### 11. Validar arquivos sem repetir DDL

O script `01_create_tables.sql` não é idempotente.

Se você executá-lo novamente, receberá erro informando que a tabela já existe.

Isso é esperado.

Para validar o laboratório, execute:

```text
00_verificar_contexto.sql
02_inspecionar_estrutura.sql
05_validacao_final.sql
```

Não repita:

```text
01_create_tables.sql
03_alter_tables.sql
```

sem reinicializar conscientemente o laboratório.

Isso ensina uma diferença importante:

```text
script inicial:
executado uma vez em um estado conhecido.

script de evolução:
executado uma vez após a versão anterior.

script de consulta:
pode ser executado repetidamente.
```

Ferramentas de migração automatizarão esse controle em aulas futuras.

---

## Entendendo o que foi feito

### A estrutura nasceu sem regras de integridade

As tabelas existem, mas ainda são permissivas.

Por exemplo:

```text
cliente.id:
pode repetir.

ordem_servico.cliente_id:
pode apontar para cliente inexistente.

codigo:
pode repetir.

status:
pode receber qualquer texto.

valor:
pode ser nulo ou negativo.
```

Isso não é o modelo final.

A aula 275 adicionará identidade e relacionamentos.

A aula 276 adicionará regras de obrigatoriedade, unicidade, validação e valores padrão.

---

### CREATE e ALTER possuem papeis diferentes

`CREATE TABLE` descreve a estrutura inicial.

`ALTER TABLE` registra evolução.

Mesmo que você pudesse editar o script inicial e recriar tudo localmente, sistemas reais possuem bancos já existentes.

Por isso, você precisa aprender a pensar em versões:

```text
versão 1:
tabela criada.

versão 2:
coluna adicionada.

versão 3:
coluna renomeada.

versão 4:
tipo alterado.
```

Esse raciocínio prepara migrações.

---

### DROP exige intencao explicita

Você removeu apenas:

```text
app.laboratorio_drop
```

As tabelas do domínio permaneceram.

O exercício ensina:

```text
não pratique comando destrutivo em objeto importante;
crie um alvo descartável;
confirme o contexto;
use RESTRICT;
valide o resultado.
```

---

### Metadados permitem auditar estrutura

Você usou:

```text
information_schema.tables;
information_schema.columns;
\d;
\dt.
```

Essas ferramentas ajudam a responder:

- quais tabelas existem;
- em qual schema;
- quais colunas existem;
- qual é o tipo;
- qual é a ordem;
- qual é a nulabilidade;
- qual é o tamanho textual.

DBeaver também mostra essas informações visualmente, mas os comandos e consultas tornam a verificação reproduzível.

---

## Erros comuns importantes

### Relation already exists

Sintoma:

```text
relation "cliente" already exists
```

Causa:

```text
CREATE TABLE foi executado novamente.
```

Correção:

- não execute o script inicial duas vezes;
- inspecione o banco;
- não adicione `IF NOT EXISTS` apenas para esconder o erro;
- recrie o laboratório somente quando houver intenção clara.

---

### Relation does not exist

Sintoma:

```text
relation "app.cliente" does not exist
```

Verifique:

```sql
SELECT current_database();
SHOW search_path;
```

E:

```text
\dt app.*
```

Possíveis causas:

- script de criação não foi executado;
- database errado;
- schema errado;
- nome digitado incorretamente;
- tabela renomeada.

---

### Column already exists

Sintoma:

```text
column "email" of relation "cliente" already exists
```

Causa:

```text
script ALTER foi executado novamente.
```

A correção não é remover a coluna automaticamente.

Inspecione a estrutura e confirme qual versão já foi aplicada.

---

### Syntax error perto de virgula ou parenteses

Exemplo incorreto:

```sql
CREATE TABLE app.exemplo (
    id bigint
    nome text,
);
```

Problemas:

- falta vírgula após `id bigint`;
- sobra vírgula antes do fechamento.

Revise a estrutura:

```sql
CREATE TABLE app.exemplo (
    id bigint,
    nome text
);
```

---

### DROP falha por dependencia

Não corrija acrescentando `CASCADE` automaticamente.

Investigue:

- qual objeto depende da tabela;
- por que a dependência existe;
- se o alvo está correto;
- se a remoção faz parte da mudança planejada.

`RESTRICT` protege contra remoção em cadeia.

---

## Comandos uteis

### Listar tabelas

```text
\dt app.*
\dt auditoria.*
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

### Consultar colunas

```sql
SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'app'
  AND table_name = 'ordem_servico'
ORDER BY ordinal_position;
```

---

## Exercicio guiado

### Parte 1 - Criar tabela de tecnico

Crie:

```text
sql/06_exercicio_tecnico.sql
```

Comece com:

```sql
CREATE TABLE app.tecnico (
    id bigint,
    codigo text,
    nome text,
    documento text,
    ativo boolean,
    criado_em timestamptz
);
```

Depois, no mesmo arquivo:

1. adicione `email text`;
2. renomeie `documento` para `documento_identificacao`;
3. altere `codigo` para `varchar(30)`;
4. adicione `telefone text`;
5. inspecione a tabela após executar.

Não adicione constraints.

---

### Parte 2 - Criar tabela descartavel

Crie:

```text
sql/07_exercicio_drop.sql
```

O script deve:

1. criar `app.rascunho_importacao`;
2. usar colunas `id bigint`, `arquivo text` e `recebido_em timestamptz`;
3. renomear a tabela para `rascunho_carga`;
4. adicionar `status text`;
5. remover a tabela usando `RESTRICT`.

Ao final, confirme que ela não existe.

---

### Parte 3 - Explicar cada comando

No `README.md`, crie uma seção textual chamada:

```text
Decisões do exercício
```

Responda:

1. Por que `app.tecnico` permanece no banco?
2. Por que `app.rascunho_carga` é removida?
3. Qual a diferença entre renomear e recriar?
4. Por que `CASCADE` não foi usado?
5. Por que ainda não existe primary key?
6. Quais problemas ainda são possíveis nas tabelas?

---

### Parte 4 - Comparar estado esperado

Liste as tabelas finais esperadas:

```text
app.atividade
app.cliente
app.ordem_servico
app.produto
app.tecnico
auditoria.evento_ordem_servico
```

Não devem existir:

```text
app.laboratorio_drop
app.rascunho_importacao
app.rascunho_carga
auditoria.log_evento
```

Valide com `information_schema.tables`.

---

## Criterios de aceite

- o laboratório oficial da aula 274 existe;
- o PostgreSQL anterior foi reutilizado;
- o contexto foi verificado antes do DDL;
- cinco tabelas iniciais foram criadas;
- nenhuma primary key foi adicionada;
- nenhuma foreign key foi adicionada;
- `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT` não foram antecipados;
- estruturas foram inspecionadas com `psql` e `information_schema`;
- colunas foram adicionadas;
- uma coluna foi renomeada;
- tipos textuais foram alterados;
- uma coluna temporária foi removida;
- uma tabela de auditoria foi renomeada;
- `DROP TABLE` foi praticado apenas em tabela descartável;
- `RESTRICT` foi usado;
- `CASCADE` não foi usado;
- a tabela `app.tecnico` foi criada no exercício;
- tabelas descartáveis não existem ao final;
- o README explica a execução;
- o commit está pronto.

---

## Commit recomendado

Na raiz do repositório:

```powershell
git status
git diff
```

Adicione:

```powershell
git add `
  labs/m12/aula-274-ddl-create-table-alter-table-drop-table
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): praticar DDL no PostgreSQL"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
criação de tabelas;
evolução estrutural;
inspeção de metadados;
remoção controlada;
preparação para integridade.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou decisões em estruturas reais.

Você aprendeu:

```text
DDL;
CREATE TABLE;
ALTER TABLE;
ADD COLUMN;
RENAME COLUMN;
ALTER COLUMN TYPE;
DROP COLUMN;
RENAME TO;
DROP TABLE;
IF EXISTS;
IF NOT EXISTS;
RESTRICT;
CASCADE;
information_schema;
\d;
\dt.
```

Também aprendeu que:

- criar uma tabela não cria dados;
- scripts estruturais devem ser versionados;
- `IF NOT EXISTS` não valida a estrutura existente;
- `ALTER TABLE` representa evolução;
- alterar tipo pode exigir conversão;
- remover coluna ou tabela é destrutivo;
- `CASCADE` não deve ser usado por reflexo;
- schema deve ser explícito;
- DDL precisa de revisão e contexto.

As tabelas existem, mas ainda não possuem identidade protegida nem relacionamentos garantidos.

A próxima aula será:

```text
275 - M12.05 - Primary key foreign key e integridade referencial
```

Nela, você vai:

- definir primary keys;
- entender chaves naturais e substitutas;
- avaliar `bigint` e UUID;
- conhecer identity columns;
- criar foreign keys;
- proteger relacionamentos;
- observar erros de referência;
- entender ações de atualização e remoção;
- conectar cliente, ordem de serviço e atividade.

Ainda não vamos aprofundar `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT`. Essas constraints serão o foco da aula 276.

---

# Material complementar

## Checkpoint final

- [ ] Criei e inspecionei as tabelas do laboratório.
- [ ] Usei `ALTER TABLE` para evoluir estruturas.
- [ ] Pratiquei `DROP TABLE` apenas em objetos descartáveis.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Schema does not exist

Sintoma:

```text
schema "app" does not exist
```

Verifique:

```sql
SELECT schema_name
FROM information_schema.schemata
ORDER BY schema_name;
```

Os schemas foram criados na aula 272.

Não crie outro schema com nome diferente apenas para contornar o erro.

---

### Alteracao de tipo falha

Uma tabela com dados pode conter valores incompatíveis com o novo tipo.

Exemplo:

```text
texto "ABC" não pode virar integer.
```

Nesses casos, a mudança precisa de:

- análise dos dados;
- estratégia de conversão;
- cláusula `USING`;
- tratamento de valores inválidos;
- plano de compatibilidade.

Nesta aula, as tabelas estão vazias.

---

### Objeto aparece no DBeaver mas nao no psql

Confira:

- conexão;
- database;
- schema;
- atualização da árvore do DBeaver;
- filtros de objeto;
- transação aberta na ferramenta.

Atualize a navegação do DBeaver e confirme com `information_schema`.

---

### Nome antigo continua sendo usado

Depois de:

```sql
ALTER TABLE auditoria.log_evento
RENAME TO evento_ordem_servico;
```

o nome antigo deixa de existir.

Scripts que ainda usam `auditoria.log_evento` precisam ser atualizados.

Renomear é mudança de contrato.

---

### DROP removeu o alvo errado

Em laboratório, pare e avalie o impacto.

Em ambiente real:

- não tente reconstruir por improviso;
- interrompa alterações adicionais;
- acione o processo de recuperação;
- consulte backup e logs;
- registre o incidente.

A melhor proteção é confirmar o contexto antes do comando.

---

## Perguntas de revisao

1. O que significa DDL?
2. Qual a diferença entre estrutura e dado?
3. O que `CREATE TABLE` cria?
4. Por que qualificar o schema?
5. Qual o risco de `IF NOT EXISTS`?
6. Para que serve `ALTER TABLE`?
7. O que acontece ao remover uma coluna?
8. Quando `USING` pode ser necessário?
9. Qual a diferença entre `RESTRICT` e `CASCADE`?
10. Por que scripts DDL devem ser versionados?
11. Por que as tabelas ainda aceitam valores inválidos?
12. Qual será o papel da aula 275?

---

## Roteiro de resposta

### 1. DDL

Linguagem de definição de dados, usada para criar e alterar objetos do banco.

### 2. Estrutura e dado

Estrutura define tabelas e colunas. Dados são as linhas armazenadas.

### 3. CREATE TABLE

Cria a tabela, colunas, tipos e metadados definidos.

### 4. Schema

Torna explícito onde o objeto existe e reduz ambiguidades.

### 5. IF NOT EXISTS

Evita erro de existência, mas não garante que a estrutura encontrada está correta.

### 6. ALTER TABLE

Evolui uma tabela existente.

### 7. DROP COLUMN

Remove a coluna e os dados armazenados nela.

### 8. USING

Define como converter valores durante alteração de tipo.

### 9. RESTRICT e CASCADE

`RESTRICT` bloqueia remoção com dependências. `CASCADE` remove objetos dependentes.

### 10. Versionamento

Permite revisão, histórico, repetição e rastreabilidade.

### 11. Modelo permissivo

As constraints ainda não foram aplicadas.

### 12. Aula 275

Adicionar identidade, referências e integridade referencial.

---

## Desafio opcional

Crie uma tabela conceitual de contrato:

```text
app.contrato
```

Use apenas:

- `id bigint`;
- `codigo text`;
- `cliente_id bigint`;
- `inicio_vigencia date`;
- `fim_vigencia date`;
- `valor_limite numeric(12,2)`;
- `ativo boolean`;
- `criado_em timestamptz`.

Depois:

1. adicione `observacao text`;
2. renomeie para `descricao`;
3. altere `codigo` para `varchar(40)`;
4. inspecione a tabela;
5. mantenha a tabela para a aula seguinte.

Não adicione primary key ou foreign key.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 274 - M12.04 - DDL create table alter table drop table

- Estudei DDL como linguagem de definição de estruturas.
- Criei tabelas nos schemas `app` e `auditoria`.
- Apliquei os tipos escolhidos na aula 273.
- Inspecionei tabelas e colunas com `psql` e `information_schema`.
- Usei `ALTER TABLE` para adicionar, renomear, alterar e remover colunas.
- Renomeei uma tabela de auditoria.
- Pratiquei `DROP TABLE` somente em uma tabela descartável.
- Entendi a diferença entre `RESTRICT` e `CASCADE`.
- Mantive primary key, foreign key e demais constraints fora desta aula.
- Versionei scripts de criação, evolução e validação.
- Próxima aula: primary key, foreign key e integridade referencial.
```

---

## Referencia tecnica curta

```text
CREATE TABLE:
cria uma tabela.

ALTER TABLE:
altera uma tabela existente.

ADD COLUMN:
adiciona coluna.

RENAME COLUMN:
renomeia coluna.

ALTER COLUMN TYPE:
altera tipo.

DROP COLUMN:
remove coluna.

RENAME TO:
renomeia tabela.

DROP TABLE:
remove a tabela.

RESTRICT:
impede remoção quando há dependências.

CASCADE:
remove também objetos dependentes.
```

Regra final:

```text
DDL altera a estrutura do sistema;
execute com contexto, revisão e rastreabilidade.
```
