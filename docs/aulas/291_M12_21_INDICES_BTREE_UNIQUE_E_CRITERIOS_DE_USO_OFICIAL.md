# 291 - M12.21 - Indices btree unique e criterios de uso

## Apresentacao da aula

Na aula 290, você criou expressões para transformar textos, números e valores temporais.

Também registrou uma dúvida técnica importante:

```text
o que acontece quando uma função é aplicada à coluna usada em um filtro?
```

Considere:

```sql
SELECT
    id,
    nome
FROM app.cliente
WHERE lower(nome) = 'hospital vida';
```

A consulta está semanticamente correta.

Porém, um índice simples sobre:

```text
nome
```

não representa necessariamente a expressão:

```text
lower(nome)
```

Essa diferença leva ao tema desta aula:

```text
índices;
B-tree;
unicidade;
ordem das colunas;
seletividade;
custo de manutenção;
critérios de uso.
```

Um índice é uma estrutura auxiliar mantida pelo banco para encontrar ou ordenar dados por determinados valores sem depender sempre da leitura integral da relação.

Ele não substitui:

- modelagem correta;
- primary keys;
- foreign keys;
- constraints;
- consultas legíveis;
- estatísticas;
- análise de plano;
- capacidade de hardware;
- observação da carga real.

Um índice também não é gratuito.

Cada índice:

- ocupa espaço;
- precisa ser atualizado em inserções;
- precisa ser atualizado quando colunas indexadas mudam;
- pode aumentar o custo de remoções;
- pode gerar mais trabalho de manutenção;
- pode competir por memória e cache;
- pode ficar redundante;
- pode nunca ser escolhido pelo planejador.

Nesta aula, você criará índices com base em consultas já praticadas:

```text
ordens por cliente e status;

atividades por ordem e status;

eventos por ordem em ordem temporal;

telefones por cliente e confirmação;

clientes pesquisados por lower(nome);

resumo materializado identificado por competencia_id.
```

O foco não será provar qual plano é mais rápido.

Com apenas algumas linhas no dataset, PostgreSQL pode preferir uma leitura sequencial mesmo quando existe um índice adequado. Isso não significa automaticamente que o índice está errado.

A aula 292 usará:

```text
EXPLAIN;
EXPLAIN ANALYZE;
custos estimados;
linhas estimadas e reais;
Seq Scan;
Index Scan;
Bitmap Scan;
Sort;
loops;
tempo.
```

A divisão é intencional:

```text
Aula 291:
desenhar, criar, inspecionar e justificar índices.

Aula 292:
observar como o planejador executa as consultas.
```

Ao final desta aula, você deverá conseguir:

- explicar por que um índice existe;
- compreender a estrutura B-tree em nível prático;
- relacionar igualdade, faixa e ordenação a B-tree;
- reconhecer índices criados por primary key e unique;
- diferenciar constraint unique de índice unique;
- identificar que foreign key não cria automaticamente índice no lado referenciador;
- criar índice simples, composto e de expressão;
- analisar a ordem das colunas;
- reconhecer seletividade baixa e alta;
- identificar índices possivelmente redundantes;
- consultar o catálogo;
- medir o tamanho das estruturas;
- documentar custos de escrita;
- preparar consultas para a aula 292.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
289:
views e materialized views.

290:
funções e CASE.

291:
índices B-tree, unique e critérios.

292:
EXPLAIN, EXPLAIN ANALYZE e leitura de plano.

293:
transações ACID.

294:
níveis de isolamento.
```

Você já criou várias constraints:

```text
PRIMARY KEY;

UNIQUE;

FOREIGN KEY.
```

As primary keys e constraints unique possuem estruturas de índice associadas.

As foreign keys do lado referenciador, por outro lado, não criam automaticamente um índice em PostgreSQL.

Exemplo:

```text
app.atividade.ordem_servico_id
```

A foreign key protege a existência da ordem.

Ela não garante a criação automática de:

```text
INDEX ON app.atividade (ordem_servico_id).
```

Essa decisão precisa ser analisada conforme:

- consultas;
- joins;
- remoções e atualizações no pai;
- volume;
- seletividade;
- frequência de escrita;
- custo de manutenção.

Nesta aula, o banco deixa de ser observado somente pelo modelo lógico e passa a ser observado também por suas estruturas de acesso.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-291-indices-btree-unique-criterios-uso
```

Estrutura final:

```text
labs
└── m12
    └── aula-291-indices-btree-unique-criterios-uso
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_inventario_indices_constraints.sql
            ├── 02_criar_indices_btree_compostos.sql
            ├── 03_criar_indice_expressao.sql
            ├── 04_criar_indice_unique_materialized_view.sql
            ├── 05_consultas_candidatas.sql
            ├── 06_catalogo_tamanho_e_definicao.sql
            ├── 07_ordem_colunas_e_redundancia.sql
            ├── 08_indice_descartavel_ciclo_vida.sql
            ├── 09_criterios_de_decisao.sql
            ├── 10_exercicio.sql
            └── 11_validacao_final.sql
```

O ambiente permanece:

```text
container:
formacao-postgres-m12

database:
formacao_java

schemas:
app e auditoria
```

Objetos usados:

```text
app.cliente;
app.ordem_servico;
app.atividade;
app.telefone_cliente;
auditoria.evento_ordem_servico;
app.mv_resumo_competencia.
```

Índices principais que permanecerão após a aula:

```text
app.idx_ordem_servico_cliente_status;

app.idx_atividade_ordem_status;

auditoria.idx_evento_ordem_ocorrido_em;

app.idx_telefone_cliente_confirmado;

app.idx_cliente_nome_lower;

app.uq_mv_resumo_competencia_id.
```

O dataset de negócio não será modificado.

---

## Conceito essencial

### O que e um indice

Índice é uma estrutura separada da tabela que organiza chaves de busca e referências às linhas.

Analogia controlada:

```text
livro sem índice:
procure página por página.

livro com índice:
encontre um termo e siga para a página.
```

A analogia ajuda, mas um índice de banco possui regras adicionais:

- ordenação;
- páginas;
- concorrência;
- versões de linhas;
- manutenção;
- custo estimado;
- diferentes métodos de acesso.

A tabela continua sendo a fonte dos dados.

O índice ajuda a localizar ou ordenar.

---

### B-tree

B-tree é o método de índice padrão do PostgreSQL para `CREATE INDEX` quando nenhum método é informado.

Forma implícita:

```sql
CREATE INDEX nome
ON tabela (coluna);
```

Forma explícita:

```sql
CREATE INDEX nome
ON tabela USING btree (coluna);
```

A estrutura mantém as chaves ordenadas em páginas balanceadas.

Em visão simplificada:

```text
raiz;
páginas internas;
páginas folha.
```

A navegação reduz o conjunto de páginas que precisa ser examinado para encontrar determinada faixa de chaves.

Você não precisa implementar uma árvore.

Precisa reconhecer quais perguntas combinam com a ordem mantida por ela.

---

### Igualdade

B-tree é adequada para comparações de igualdade:

```sql
WHERE cliente_id = 930001
```

O índice pode localizar a região correspondente à chave.

Isso não significa que será escolhido em toda consulta.

Em uma tabela minúscula, ler todas as linhas pode ser mais barato.

---

### Faixa

B-tree também é adequada para intervalos ordenáveis:

```sql
WHERE valor_previsto >= 500
  AND valor_previsto < 1000
```

Operadores comuns:

```text
<;
<=;
=;
>=;
>;
BETWEEN.
```

A estrutura pode localizar o início da faixa e percorrer as chaves até o limite.

---

### Ordenacao

Um índice B-tree pode ajudar consultas cuja ordenação coincide com sua definição.

Exemplo:

```sql
ORDER BY
    ordem_servico_id,
    ocorrido_em DESC
```

Índice candidato:

```sql
CREATE INDEX ...
ON auditoria.evento_ordem_servico (
    ordem_servico_id,
    ocorrido_em DESC
);
```

O benefício depende:

- filtros;
- direção;
- quantidade de linhas;
- colunas;
- necessidade de acessar a tabela;
- custo comparado com ordenar separadamente.

A aula 292 mostrará se aparece um nó `Sort` ou um caminho indexado.

---

### Primary key e indice

Ao criar:

```sql
PRIMARY KEY (id)
```

PostgreSQL cria um índice unique para suportar:

- unicidade;
- busca pela chave;
- referência por foreign keys.

Esse índice não é um “bônus opcional”.

Ele faz parte da implementação da constraint.

No catálogo, o índice pode ser identificado como:

```text
indisprimary = true;

indisunique = true.
```

---

### Constraint UNIQUE e indice unique

Ao criar:

```sql
CONSTRAINT uq_produto_codigo
UNIQUE (codigo)
```

PostgreSQL cria um índice unique associado.

A constraint comunica uma regra do domínio:

```text
código do Produto não pode repetir.
```

O índice fornece o mecanismo físico de verificação.

A constraint aparece em `pg_constraint`.

O índice aparece em `pg_index` e `pg_indexes`.

---

### CREATE UNIQUE INDEX

Também é possível criar diretamente:

```sql
CREATE UNIQUE INDEX nome
ON tabela (coluna);
```

Isso impede duplicidade da chave indexada.

Porém, a escolha entre constraint unique e índice unique deve considerar intenção.

Use constraint quando a regra é parte explícita do modelo de integridade.

Use índice unique quando:

- o objeto indexado não aceita constraint comum, como materialized view;
- a expressão é indexada;
- existe uma necessidade física específica;
- o índice será posteriormente ligado a uma constraint compatível;
- a regra depende de recursos próprios do índice.

Nesta aula, a materialized view receberá um índice unique porque não recebe uma constraint de tabela comum.

---

### NULL em indice unique

Por padrão, valores nulos distintos podem coexistir em um índice unique do PostgreSQL, porque `NULL` representa valor desconhecido e não é tratado como igual aos demais nulos para essa verificação.

Versões modernas do PostgreSQL permitem:

```sql
UNIQUE NULLS NOT DISTINCT
```

quando a regra exige que os nulos sejam tratados como iguais.

Não aplique essa opção sem regra de domínio.

As chaves indexadas nesta aula são obrigatórias e não dependem desse comportamento.

---

### Foreign key e indice

A foreign key:

```sql
FOREIGN KEY (ordem_servico_id)
REFERENCES app.ordem_servico (id)
```

precisa de uma chave unique no lado referenciado.

No lado filho, PostgreSQL não cria automaticamente índice para:

```text
ordem_servico_id.
```

Por que um índice pode ser útil no filho?

- joins por ordem;
- busca das atividades de uma ordem;
- validação de remoção ou atualização da ordem;
- filtros recorrentes;
- ordenação dentro do pai.

Por que não criar automaticamente?

- nem toda foreign key possui volume relevante;
- cada índice possui custo;
- um índice composto pode atender melhor;
- a ordem de colunas depende das consultas;
- alguns índices seriam redundantes.

---

### Indice simples

Índice simples possui uma chave.

Exemplo:

```sql
CREATE INDEX idx_cliente_nome_lower
ON app.cliente (
    lower(nome)
);
```

Apesar de a expressão usar uma coluna, a chave indexada é:

```text
lower(nome).
```

Outro exemplo simples:

```sql
CREATE INDEX idx_produto_nome
ON app.produto (nome);
```

A criação só é justificável quando existe uma consulta candidata e volume.

---

### Indice composto

Índice composto possui várias chaves.

Exemplo:

```sql
CREATE INDEX idx_atividade_ordem_status
ON app.atividade (
    ordem_servico_id,
    status
);
```

Ele organiza primeiro por:

```text
ordem_servico_id.
```

Dentro do mesmo valor, organiza por:

```text
status.
```

A ordem é parte da definição.

---

### Prefixo a esquerda

No índice:

```text
(ordem_servico_id, status)
```

consultas candidatas incluem:

```sql
WHERE ordem_servico_id = ...
```

e:

```sql
WHERE ordem_servico_id = ...
  AND status = ...
```

Uma consulta somente por:

```sql
WHERE status = ...
```

não se beneficia da mesma forma do prefixo inicial.

Isso não significa impossibilidade absoluta de qualquer uso pelo PostgreSQL, mas significa que a estrutura não foi ordenada primariamente por `status`.

Regra de projeto:

```text
coloque primeiro as colunas compatíveis com os padrões principais de filtro e ordenação.
```

---

### Igualdade antes de faixa

Considere:

```sql
WHERE cliente_id = 930001
  AND criado_em >= TIMESTAMPTZ '2026-07-01 00:00:00-03'
ORDER BY criado_em DESC
```

Índice candidato:

```text
(cliente_id, criado_em DESC)
```

A igualdade restringe o cliente.

A faixa e a ordenação atuam dentro daquele cliente.

Essa orientação é útil, mas não substitui medição.

---

### Seletividade

Seletividade descreve quanto um filtro reduz o conjunto.

Exemplo de alta seletividade:

```text
documento único;
id;
código único.
```

Exemplo potencialmente pouco seletivo:

```text
ativo boolean;
status com poucos valores;
principal boolean.
```

Um índice apenas em uma coluna booleana pode ser pouco útil quando grande parte da tabela possui o mesmo valor.

Entretanto, uma coluna de baixa seletividade pode ser útil como parte de índice composto, índice parcial ou quando a distribuição é muito desigual.

Índice parcial não será praticado nesta aula.

---

### Distribuicao dos dados

Não basta conhecer o tipo da coluna.

Pergunte:

```text
quantos valores distintos existem?

qual percentual corresponde a cada valor?

a distribuição é uniforme?

há valores dominantes?

o filtro retorna poucas linhas?

a tabela é grande?
```

No dataset do curso, as tabelas possuem poucas linhas.

As decisões são preparadas com base em consultas plausíveis, mas a eficácia real precisará de volume e plano.

---

### Indice e escrita

Em uma inserção, PostgreSQL precisa:

1. inserir a linha na tabela;
2. atualizar cada índice aplicável;
3. verificar unicidade quando necessário.

Em uma atualização de coluna indexada, a chave precisa ser mantida.

Em uma remoção, referências e entradas de índice também entram no ciclo de manutenção.

Quanto mais índices:

- maior o custo de escrita;
- maior o consumo de espaço;
- maior a quantidade de páginas alteradas;
- maior a pressão de manutenção.

Índice é uma troca:

```text
mais estrutura de leitura;
mais custo de escrita e armazenamento.
```

---

### Indice redundante

Considere:

```text
idx_a:
(cliente_id)

idx_b:
(cliente_id, status)
```

O segundo possui o primeiro como prefixo.

Isso não prova automaticamente que `idx_a` deve ser removido.

O índice simples pode:

- ser menor;
- ser mais barato para algumas consultas;
- ter comportamento diferente de cache;
- servir a uma constraint;
- existir por outra razão.

Mas a sobreposição deve ser investigada.

Não mantenha ambos apenas porque “índice nunca atrapalha”.

---

### Indice de expressao

A consulta:

```sql
WHERE lower(nome) = 'hospital vida'
```

possui como chave lógica de busca:

```text
lower(nome).
```

Índice:

```sql
CREATE INDEX idx_cliente_nome_lower
ON app.cliente (
    lower(nome)
);
```

A expressão da consulta precisa ser compatível com a expressão indexada.

Esse índice não transforma automaticamente buscas por:

```sql
upper(nome)
```

ou:

```sql
btrim(lower(nome))
```

na mesma chave.

Padronize a expressão usada pelo contrato de consulta.

---

### Funcoes, imutabilidade e indices

Expressões indexadas precisam ser adequadas para indexação e não podem depender de resultado instável a cada chamada.

Uma expressão como:

```text
lower(nome)
```

é apropriada.

Uma expressão baseada na data atual não representa uma chave estável do registro.

Não tente indexar classificações como:

```text
data_agendada < current_date
```

diretamente como se fossem imutáveis.

Modele a consulta e a regra temporal corretamente.

---

### Indice na materialized view

A materialized view:

```text
app.mv_resumo_competencia
```

armazena fisicamente linhas.

Ela pode receber índice.

A granularidade declarada na aula 289 é:

```text
uma linha por competencia_id.
```

Portanto, um índice unique candidato é:

```sql
CREATE UNIQUE INDEX uq_mv_resumo_competencia_id
ON app.mv_resumo_competencia (
    competencia_id
);
```

Além de proteger a granularidade, um índice unique adequado é requisito importante para uma futura análise de:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY
```

O refresh concorrente não será executado nesta aula.

---

### IF NOT EXISTS

Forma:

```sql
CREATE INDEX IF NOT EXISTS nome
ON tabela (...);
```

Isso evita erro quando já existe um objeto com o mesmo nome.

Mas não confirma que a definição existente é equivalente.

Pode existir:

```text
mesmo nome;
colunas diferentes;
ordem diferente;
expressão diferente.
```

Por isso, scripts versionados precisam validar a definição, não apenas confiar no nome.

---

### Nomeacao

Convenção usada:

```text
idx_:
índice não unique criado manualmente.

uq_:
índice unique ligado a regra de unicidade.
```

O nome inclui:

```text
objeto;
colunas ou propósito.
```

Exemplos:

```text
idx_atividade_ordem_status;

idx_cliente_nome_lower;

uq_mv_resumo_competencia_id.
```

Evite nomes como:

```text
index1;
idx_novo;
teste;
otimizacao.
```

---

### Catalogo

As principais fontes serão:

```text
pg_indexes;

pg_index;

pg_class;

pg_namespace;

pg_constraint.
```

`pg_indexes` oferece uma visão legível da definição.

`pg_index` contém flags técnicas.

`pg_constraint` mostra as regras declarativas e o índice associado quando aplicável.

---

### Tamanho

Funções:

```sql
pg_relation_size('schema.indice');

pg_size_pretty(...);
```

No dataset pequeno, muitos índices ocuparão ao menos páginas mínimas e poderão parecer desproporcionalmente grandes em relação às poucas linhas.

Não extrapole tamanho linear a partir desse laboratório.

O objetivo é aprender a inspecionar.

---

## Mao na massa guiada

### 1. Confirmar o PostgreSQL

Na raiz:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se necessário, inicie o Compose da aula 271.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-291-indices-btree-unique-criterios-uso\sql"

Set-Location `
  "labs\m12\aula-291-indices-btree-unique-criterios-uso"
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
    current_user AS usuario,
    version() AS versao;

SELECT
    (SELECT count(*) FROM app.cliente) AS clientes,
    (SELECT count(*) FROM app.ordem_servico) AS ordens,
    (SELECT count(*) FROM app.atividade) AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
    ) AS eventos,
    (
        SELECT count(*)
        FROM app.telefone_cliente
    ) AS telefones;

SELECT
    schemaname,
    matviewname,
    ispopulated
FROM pg_matviews
WHERE schemaname = 'app'
  AND matviewname = 'mv_resumo_competencia';
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-291-indices-btree-unique-criterios-uso\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme que a materialized view está populada.

---

### 4. Criar 01_inventario_indices_constraints.sql

Crie:

```text
sql/01_inventario_indices_constraints.sql
```

Conteúdo:

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN (
    'app',
    'auditoria'
)
ORDER BY
    schemaname,
    tablename,
    indexname;

SELECT
    ns.nspname AS schema_name,
    tbl.relname AS relation_name,
    idx.relname AS index_name,
    i.indisprimary,
    i.indisunique,
    i.indisvalid,
    pg_get_indexdef(idx.oid) AS index_definition
FROM pg_index AS i
INNER JOIN pg_class AS idx
    ON idx.oid = i.indexrelid
INNER JOIN pg_class AS tbl
    ON tbl.oid = i.indrelid
INNER JOIN pg_namespace AS ns
    ON ns.oid = tbl.relnamespace
WHERE ns.nspname IN (
    'app',
    'auditoria'
)
ORDER BY
    ns.nspname,
    tbl.relname,
    idx.relname;

SELECT
    ns.nspname AS schema_name,
    tbl.relname AS relation_name,
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    idx.relname AS supporting_index
FROM pg_constraint AS con
INNER JOIN pg_class AS tbl
    ON tbl.oid = con.conrelid
INNER JOIN pg_namespace AS ns
    ON ns.oid = tbl.relnamespace
LEFT JOIN pg_class AS idx
    ON idx.oid = con.conindid
WHERE ns.nspname IN (
    'app',
    'auditoria'
)
  AND con.contype IN (
      'p',
      'u',
      'f'
  )
ORDER BY
    ns.nspname,
    tbl.relname,
    con.contype,
    con.conname;
```

Identifique:

```text
p:
primary key.

u:
unique.

f:
foreign key.
```

Observe quais FKs não possuem um índice próprio criado automaticamente.

---

### 5. Criar 02_criar_indices_btree_compostos.sql

Crie:

```text
sql/02_criar_indices_btree_compostos.sql
```

Conteúdo:

```sql
CREATE INDEX IF NOT EXISTS idx_ordem_servico_cliente_status
ON app.ordem_servico USING btree (
    cliente_id,
    status
);

CREATE INDEX IF NOT EXISTS idx_atividade_ordem_status
ON app.atividade USING btree (
    ordem_servico_id,
    status
);

CREATE INDEX IF NOT EXISTS idx_evento_ordem_ocorrido_em
ON auditoria.evento_ordem_servico USING btree (
    ordem_servico_id,
    ocorrido_em DESC
);

CREATE INDEX IF NOT EXISTS idx_telefone_cliente_confirmado
ON app.telefone_cliente USING btree (
    cliente_id,
    confirmado
);
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-291-indices-btree-unique-criterios-uso\sql\02_criar_indices_btree_compostos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Justificativas:

```text
cliente_id + status:
ordens de determinado cliente, opcionalmente por status.

ordem_servico_id + status:
atividades de determinada ordem, opcionalmente por status.

ordem_servico_id + ocorrido_em DESC:
histórico da ordem em ordem temporal.

cliente_id + confirmado:
telefones de determinado cliente, com possível filtro de confirmação.
```

Não crie índices separados em `status` ou `confirmado` apenas por existirem nas consultas.

---

### 6. Criar 03_criar_indice_expressao.sql

Crie:

```text
sql/03_criar_indice_expressao.sql
```

Conteúdo:

```sql
CREATE INDEX IF NOT EXISTS idx_cliente_nome_lower
ON app.cliente USING btree (
    lower(nome)
);

SELECT
    id,
    nome
FROM app.cliente
WHERE lower(nome) = 'hospital vida'
ORDER BY id;

SELECT
    id,
    nome
FROM app.cliente
WHERE upper(nome) = 'HOSPITAL VIDA'
ORDER BY id;
```

As duas consultas podem retornar o mesmo dado.

A expressão do índice foi definida para:

```text
lower(nome).
```

Na aula 292, compare os planos sem concluir previamente que o índice será escolhido no dataset pequeno.

---

### 7. Criar 04_criar_indice_unique_materialized_view.sql

Crie:

```text
sql/04_criar_indice_unique_materialized_view.sql
```

Conteúdo:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS uq_mv_resumo_competencia_id
ON app.mv_resumo_competencia USING btree (
    competencia_id
);

SELECT
    competencia_id,
    competencia_codigo,
    competencia_nome,
    quantidade_associacoes
FROM app.mv_resumo_competencia
ORDER BY competencia_id;
```

Confirme:

```text
uma linha por competencia_id;
índice unique válido;
materialized view populada.
```

Não execute:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY
```

A aula ainda não analisou os efeitos concorrentes e locks desse comando.

---

### 8. Criar 05_consultas_candidatas.sql

Crie:

```text
sql/05_consultas_candidatas.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE cliente_id = 930001
  AND status = 'ABERTA'
ORDER BY id;

SELECT
    id,
    codigo,
    descricao,
    status
FROM app.atividade
WHERE ordem_servico_id = 930001
  AND status = 'PENDENTE'
ORDER BY id;

SELECT
    id,
    tipo,
    descricao,
    ocorrido_em
FROM auditoria.evento_ordem_servico
WHERE ordem_servico_id = 930001
ORDER BY ocorrido_em DESC;

SELECT
    id,
    numero,
    tipo,
    confirmado
FROM app.telefone_cliente
WHERE cliente_id = 930001
  AND confirmado = true
ORDER BY id;

SELECT
    id,
    nome,
    documento
FROM app.cliente
WHERE lower(nome) = 'hospital vida';

SELECT
    competencia_id,
    competencia_codigo,
    quantidade_associacoes
FROM app.mv_resumo_competencia
WHERE competencia_id = 950001;
```

Essas consultas serão reutilizadas na aula 292.

Não adicione `EXPLAIN` ainda.

---

### 9. Criar 06_catalogo_tamanho_e_definicao.sql

Crie:

```text
sql/06_catalogo_tamanho_e_definicao.sql
```

Conteúdo:

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE indexname IN (
    'idx_ordem_servico_cliente_status',
    'idx_atividade_ordem_status',
    'idx_evento_ordem_ocorrido_em',
    'idx_telefone_cliente_confirmado',
    'idx_cliente_nome_lower',
    'uq_mv_resumo_competencia_id'
)
ORDER BY indexname;

SELECT
    ns.nspname AS schema_name,
    idx.relname AS index_name,
    pg_size_pretty(
        pg_relation_size(idx.oid)
    ) AS index_size,
    i.indisunique,
    i.indisprimary,
    i.indisvalid
FROM pg_index AS i
INNER JOIN pg_class AS idx
    ON idx.oid = i.indexrelid
INNER JOIN pg_class AS tbl
    ON tbl.oid = i.indrelid
INNER JOIN pg_namespace AS ns
    ON ns.oid = tbl.relnamespace
WHERE idx.relname IN (
    'idx_ordem_servico_cliente_status',
    'idx_atividade_ordem_status',
    'idx_evento_ordem_ocorrido_em',
    'idx_telefone_cliente_confirmado',
    'idx_cliente_nome_lower',
    'uq_mv_resumo_competencia_id'
)
ORDER BY idx.relname;
```

Registre no README:

- definição;
- tamanho;
- unicidade;
- validade;
- relação indexada;
- consulta candidata.

---

### 10. Criar 07_ordem_colunas_e_redundancia.sql

Crie:

```text
sql/07_ordem_colunas_e_redundancia.sql
```

Conteúdo:

```sql
SELECT
    'cliente_status' AS indice_logico,
    'cliente_id' AS primeira_chave,
    'status' AS segunda_chave,
    'cliente_id ou cliente_id + status' AS filtros_candidatos

UNION ALL

SELECT
    'atividade_ordem_status',
    'ordem_servico_id',
    'status',
    'ordem_servico_id ou ordem_servico_id + status'

UNION ALL

SELECT
    'evento_ordem_data',
    'ordem_servico_id',
    'ocorrido_em DESC',
    'ordem e faixa/ordenação temporal'

UNION ALL

SELECT
    'telefone_cliente_confirmado',
    'cliente_id',
    'confirmado',
    'cliente_id ou cliente_id + confirmado';

SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE status = 'ABERTA'
ORDER BY id;

SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE cliente_id = 930001
ORDER BY id;

SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE cliente_id = 930001
  AND status = 'ABERTA'
ORDER BY id;
```

Compare as formas da consulta.

O índice composto foi desenhado primariamente para as duas últimas, não para `status` isolado.

---

### 11. Criar 08_indice_descartavel_ciclo_vida.sql

Crie:

```text
sql/08_indice_descartavel_ciclo_vida.sql
```

Conteúdo:

```sql
CREATE INDEX idx_aula_291_produto_nome_descartavel
ON app.produto USING btree (
    nome
);

SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'app'
  AND indexname = 'idx_aula_291_produto_nome_descartavel';

DROP INDEX app.idx_aula_291_produto_nome_descartavel;

SELECT
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'app'
  AND indexname = 'idx_aula_291_produto_nome_descartavel';
```

O script pratica:

```text
criação;
inspeção;
remoção.
```

Não use `CASCADE`.

---

### 12. Criar 09_criterios_de_decisao.sql

Crie:

```text
sql/09_criterios_de_decisao.sql
```

Conteúdo:

```sql
SELECT
    'Consulta recorrente' AS criterio,
    'Existe filtro, join ou ordenação real' AS pergunta

UNION ALL

SELECT
    'Volume',
    'A relação possui linhas suficientes para justificar estrutura auxiliar?'

UNION ALL

SELECT
    'Seletividade',
    'O filtro reduz significativamente o conjunto?'

UNION ALL

SELECT
    'Ordem das colunas',
    'O prefixo do índice coincide com o padrão principal?'

UNION ALL

SELECT
    'Escrita',
    'Qual custo será adicionado a inserts, updates e deletes?'

UNION ALL

SELECT
    'Redundância',
    'Outro índice já atende a mesma consulta?'

UNION ALL

SELECT
    'Expressão',
    'A consulta usa a mesma expressão indexada?'

UNION ALL

SELECT
    'Medição',
    'EXPLAIN e EXPLAIN ANALYZE confirmam o uso e o benefício?'

ORDER BY criterio;
```

Esse arquivo não decide sozinho.

Ele organiza as perguntas obrigatórias.

---

### 13. Criar 10_exercicio.sql

Crie:

```text
sql/10_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Índices do exercício devem usar prefixo:

```text
idx_ex291_;
```

No final, remova os índices de exercício que não forem aprovados.

---

### 14. Criar 11_validacao_final.sql

Crie:

```text
sql/11_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE indexname IN (
    'idx_ordem_servico_cliente_status',
    'idx_atividade_ordem_status',
    'idx_evento_ordem_ocorrido_em',
    'idx_telefone_cliente_confirmado',
    'idx_cliente_nome_lower',
    'uq_mv_resumo_competencia_id'
)
ORDER BY indexname;

SELECT
    count(*) AS quantidade_indices_principais
FROM pg_indexes
WHERE indexname IN (
    'idx_ordem_servico_cliente_status',
    'idx_atividade_ordem_status',
    'idx_evento_ordem_ocorrido_em',
    'idx_telefone_cliente_confirmado',
    'idx_cliente_nome_lower',
    'uq_mv_resumo_competencia_id'
);

SELECT
    (SELECT count(*) FROM app.ordem_servico) AS ordens,
    (SELECT count(*) FROM app.atividade) AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
    ) AS eventos,
    (
        SELECT count(*)
        FROM app.telefone_cliente
    ) AS telefones,
    (
        SELECT count(*)
        FROM app.mv_resumo_competencia
    ) AS competencias_materializadas;
```

Resultado esperado:

```text
seis índices principais;

dataset sem alteração;

materialized view populada.
```

---

### 15. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 291 - Indices btree unique e criterios de uso.

Objetivo:
criar e justificar estruturas de acesso antes de medir planos.

Índices:
ordem por cliente e status;
atividade por ordem e status;
evento por ordem e data;
telefone por cliente e confirmação;
lower do nome do cliente;
unique da materialized view.

Regras:
índice não é gratuito;
foreign key não cria índice no filho;
ordem das colunas importa;
função precisa corresponder à expressão;
dataset pequeno pode favorecer Seq Scan;
aula 292 medirá os planos.

Próxima aula:
EXPLAIN, EXPLAIN ANALYZE e leitura de plano.
```

Para cada índice, documente:

- consulta candidata;
- granularidade;
- primeira chave;
- segunda chave;
- seletividade esperada;
- custo de escrita;
- possível redundância;
- decisão de manter;
- hipótese para a aula 292.

---

## Entendendo o que foi feito

### Constraints ja possuíam indices

O inventário mostrou índices de primary keys e constraints unique.

Eles sustentam regras declarativas e também podem ajudar consultas.

---

### Foreign keys exigiram decisao

As FKs do lado filho não receberam índices automaticamente.

Você criou índices compostos conforme padrões de busca, e não um índice isolado para cada coluna por reflexo.

---

### A ordem das chaves expressou a consulta

Os índices começaram pelas chaves de igualdade mais importantes:

```text
cliente_id;

ordem_servico_id.
```

Depois incluíram:

```text
status;

confirmado;

ocorrido_em.
```

Isso refletiu filtros e ordenações recorrentes.

---

### A expressao foi indexada

O filtro:

```text
lower(nome)
```

recebeu um índice sobre a mesma expressão.

Um índice comum em `nome` não foi tratado como equivalente automático.

---

### A materialized view ganhou identidade fisica

O índice unique em `competencia_id` protegeu a granularidade de uma linha por competência.

Ele também preparou o objeto para estudo futuro de refresh concorrente.

---

### Tamanho e custo ficaram visiveis

O catálogo mostrou que cada índice é um objeto físico.

Mesmo em tabelas pequenas, existe custo de armazenamento e manutenção.

---

## Erros comuns importantes

### Criar indice para toda coluna

Coluna existente não é justificativa.

Comece pela consulta e pelo volume.

---

### Inverter a ordem do composto

O índice foi criado com `status` primeiro, mas as consultas principais começam por `cliente_id`.

Redesenhe conforme o padrão real.

---

### Esperar que foreign key crie indice

PostgreSQL protege a referência, mas não cria automaticamente o índice no filho.

Inspecione o catálogo.

---

### Indice existe e nao e usado

A tabela é pequena, o filtro retorna muitas linhas ou o custo estimado favorece leitura sequencial.

A aula 292 mostrará o plano.

---

### Expressao nao coincide

O índice usa `lower(nome)`, mas a consulta usa outra função.

Padronize a expressão ou reavalie a necessidade.

---

## Comandos uteis

### B-tree simples

```sql
CREATE INDEX nome
ON schema.tabela USING btree (
    coluna
);
```

### B-tree composto

```sql
CREATE INDEX nome
ON schema.tabela (
    coluna_1,
    coluna_2
);
```

### Expressao

```sql
CREATE INDEX nome
ON schema.tabela (
    lower(coluna)
);
```

### Unique

```sql
CREATE UNIQUE INDEX nome
ON schema.objeto (
    coluna
);
```

### Remover

```sql
DROP INDEX schema.nome;
```

---

## Exercicio guiado

No arquivo:

```text
sql/10_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Inventario comentado

Escolha dez índices já existentes.

Classifique cada um como:

```text
primary key;
constraint unique;
índice manual;
índice de expressão;
índice da materialized view.
```

Registre a relação e as colunas.

---

### Parte 2 - Produto por status e nome

Considere consultas:

```sql
WHERE status = true
ORDER BY nome
```

ou a coluna de situação equivalente existente em `app.produto`.

Antes de criar qualquer índice:

1. confirme o nome e o tipo das colunas;
2. descreva o volume atual;
3. estime a seletividade;
4. decida se o índice seria justificável;
5. se criar, use prefixo `idx_ex291_`;
6. registre a hipótese para `EXPLAIN`;
7. remova se não houver justificativa suficiente.

Não invente uma coluna inexistente.

---

### Parte 3 - Codigo da Ordem

Verifique se `ordem_codigo` ou `codigo` já possui constraint unique.

Se possuir:

```text
não crie outro índice idêntico.
```

Explique por que a estrutura já existente pode atender busca por igualdade.

---

### Parte 4 - Indice composto alternativo

Compare:

```text
(cliente_id, status);

(status, cliente_id).
```

Para cada ordem, liste consultas atendidas pelo prefixo.

Escolha a definição apropriada para:

```text
ordens de um cliente;
ordens de um cliente por status.
```

---

### Parte 5 - Filtro com funcao

Compare consultas:

```sql
WHERE lower(nome) = 'hospital vida';

WHERE upper(nome) = 'HOSPITAL VIDA';

WHERE nome = 'Hospital Vida';
```

Relacione cada uma aos índices existentes.

Não execute `EXPLAIN` ainda.

---

### Parte 6 - Indice potencialmente redundante

Avalie criar:

```text
idx_ex291_atividade_ordem
(ordem_servico_id).
```

Compare com:

```text
idx_atividade_ordem_status
(ordem_servico_id, status).
```

Registre:

- sobreposição;
- diferença de tamanho esperada;
- consultas;
- custo de manutenção;
- decisão provisória.

Se criar para inspeção, remova ao final.

---

### Parte 7 - Baixa seletividade

Analise índices isolados em:

```text
confirmado boolean;

obrigatoria boolean;

ativa boolean.
```

Explique por que a baixa quantidade de valores distintos exige cautela.

Descreva quando uma coluna booleana ainda poderia fazer parte de uma estratégia útil.

Não crie índice parcial.

---

### Parte 8 - Materialized view

Confirme:

```text
competencia_id é único;

uq_mv_resumo_competencia_id está válido;

a materialized view está populada.
```

Documente por que essa estrutura é diferente de uma constraint unique em tabela comum.

---

### Parte 9 - Preparar a aula 292

Selecione seis consultas:

1. igualdade por primary key;
2. filtro pelo prefixo de índice composto;
3. filtro pelas duas colunas do composto;
4. filtro apenas pela segunda coluna;
5. filtro por expressão;
6. consulta que retorna grande parte da tabela.

Para cada uma, registre sua previsão:

```text
índice candidato;

Seq Scan possível;

ordenação necessária;

quantidade esperada;

incertezas.
```

Não execute `EXPLAIN`.

---

## Criterios de aceite

- o laboratório oficial da aula 291 existe;
- o arquivo e o H1 seguem a grade;
- o dataset não foi modificado;
- índices existentes foram inventariados;
- primary key e índice primary foram relacionados;
- unique constraint e índice unique foram relacionados;
- foreign key foi diferenciada de índice no lado filho;
- B-tree foi compreendida para igualdade, faixa e ordenação;
- índices compostos foram criados com ordem justificada;
- prefixo à esquerda foi compreendido;
- seletividade foi discutida;
- custo de escrita foi documentado;
- redundância foi analisada;
- índice de expressão foi criado;
- a expressão do filtro foi comparada com a expressão indexada;
- índice unique foi criado na materialized view;
- tamanho e definição foram consultados;
- ciclo de vida de índice descartável foi praticado;
- nenhum índice foi criado apenas porque a coluna existe;
- `IF NOT EXISTS` não foi tratado como validação da definição;
- `CREATE INDEX CONCURRENTLY` não foi praticado antecipadamente;
- índice parcial não foi praticado;
- nenhum `EXPLAIN` foi executado;
- consultas candidatas foram preparadas para a aula 292;
- o exercício foi concluído;
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
  labs/m12/aula-291-indices-btree-unique-criterios-uso
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): criar indices com criterios de uso"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
índices B-tree;
índices compostos;
índice de expressão;
índice unique;
catálogo;
critérios;
preparação para planos.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você criou estruturas de acesso com uma hipótese explícita de uso.

Aprendeu:

```text
índice;
B-tree;
igualdade;
faixa;
ordenação;
índice de primary key;
índice de unique;
CREATE UNIQUE INDEX;
índice simples;
índice composto;
prefixo à esquerda;
seletividade;
índice de expressão;
redundância;
custo de escrita;
catálogo;
tamanho.
```

As regras principais foram:

```text
comece pela consulta, não pela coluna;

primary key e unique criam índices de suporte;

foreign key não cria automaticamente índice no filho;

ordem das colunas faz parte do contrato do composto;

baixa seletividade exige cautela;

índice melhora caminhos de leitura e custa nas escritas;

função no filtro precisa corresponder à expressão indexada;

materialized view pode receber índice;

índice existente não garante que o planejador o escolherá;

performance precisa ser medida.
```

A próxima aula será:

```text
292 - M12.22 - Explain explain analyze e leitura de plano
```

Nela, você vai estudar:

- diferença entre `EXPLAIN` e `EXPLAIN ANALYZE`;
- custo inicial e custo total;
- linhas e largura estimadas;
- tempo e linhas reais;
- `Seq Scan`;
- `Index Scan`;
- `Index Only Scan`;
- `Bitmap Index Scan`;
- `Bitmap Heap Scan`;
- `Filter`;
- `Index Cond`;
- `Sort`;
- `Nested Loop`;
- loops;
- divergência de estimativas;
- risco de executar comandos com `ANALYZE`;
- comparação das consultas candidatas desta aula.

Não remova os seis índices principais.

Eles serão usados para comparar planos.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei índices de constraints e índices manuais.
- [ ] Criei índices compostos, de expressão e unique com justificativa.
- [ ] Analisei ordem, seletividade, tamanho e custo de escrita.
- [ ] Preparei consultas para `EXPLAIN` e fiz o commit.

---

## Troubleshooting adicional

### Index already exists

O objeto já existe com aquele nome.

Consulte `pg_indexes` e confirme a definição antes de continuar.

### Functions in index expression must be marked IMMUTABLE

A expressão usa função inadequada para uma chave indexada estável.

Revise a regra; não force a criação.

### Could not create unique index

Existem valores duplicados para a chave.

Diagnostique os dados antes de remover ou alterar registros.

### DROP INDEX foi bloqueado

O índice pode sustentar uma constraint.

Remova ou altere a constraint somente com migração planejada.

### Nome existe com definicao diferente

`IF NOT EXISTS` não corrige o objeto.

Compare `pg_get_indexdef` e trate a migração explicitamente.

---

## Perguntas de revisao

1. O que é um índice?
2. Qual é o método padrão estudado?
3. Para quais comparações B-tree é adequada?
4. Como ela pode ajudar ordenação?
5. Primary key cria índice?
6. Unique constraint cria índice?
7. Foreign key cria índice no filho?
8. O que é índice composto?
9. Por que a ordem importa?
10. O que significa prefixo à esquerda?
11. O que é seletividade?
12. Por que boolean isolado exige cautela?
13. O que é índice de expressão?
14. Por que `lower(nome)` difere de `nome`?
15. Qual é o custo de escrita?
16. O que é índice redundante?
17. Por que materialized view pode receber índice?
18. Como confirmar se o índice será usado?

---

## Roteiro de resposta

1. Estrutura auxiliar de acesso às linhas.
2. B-tree.
3. Igualdade, faixas e comparações ordenáveis.
4. Mantendo chaves em ordem compatível.
5. Sim.
6. Sim.
7. Não automaticamente.
8. Índice com várias chaves.
9. A ordenação interna começa pela primeira chave.
10. Consultas iniciadas pelas primeiras chaves são candidatas naturais.
11. Quanto o filtro reduz o conjunto.
12. Possui poucos valores distintos.
13. Índice sobre o resultado de uma expressão.
14. São chaves de busca diferentes.
15. Manutenção em inserções, alterações e remoções.
16. Estrutura sobreposta sem benefício justificado.
17. Ela armazena linhas fisicamente.
18. Com `EXPLAIN` e `EXPLAIN ANALYZE`, considerando a carga real.

---

## Desafio opcional

Escreva uma proposta de índices para um sistema com:

```text
10 milhões de Ordens;

busca por cliente e período;

fila por status e prioridade;

histórico por ordem e instante;

pesquisa case-insensitive por código externo;

materialized view de dashboard;
```

Para cada índice, documente:

- consulta;
- igualdade;
- faixa;
- ordenação;
- ordem das chaves;
- seletividade;
- volume;
- frequência de escrita;
- risco de redundância;
- tamanho esperado;
- hipótese de plano;
- critério de remoção.

Não crie os índices no banco do curso.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 291 - M12.21 - Indices btree unique e criterios de uso

- Entendi índices como estruturas auxiliares de acesso.
- Estudei B-tree para igualdade, faixas e ordenação.
- Relacionei primary keys e constraints unique aos índices criados pelo PostgreSQL.
- Entendi que foreign key não cria automaticamente índice no lado filho.
- Criei índices compostos conforme consultas recorrentes.
- Analisei a ordem das colunas e o prefixo à esquerda.
- Estudei seletividade e o cuidado com colunas booleanas.
- Criei índice de expressão para `lower(nome)`.
- Criei índice unique na materialized view de competências.
- Consultei definições, flags e tamanhos no catálogo.
- Pratiquei criação e remoção de um índice descartável.
- Analisei sobreposição e possível redundância.
- Registrei o custo de manutenção nas escritas.
- Preparei consultas candidatas sem antecipar `EXPLAIN`.
- Próxima aula: `EXPLAIN`, `EXPLAIN ANALYZE` e leitura de plano.
```

---

## Referencia tecnica curta

```text
B-tree:
igualdade, faixa e ordem.

PK:
cria índice unique.

UNIQUE:
cria índice unique.

FK:
não cria índice automático no filho.

Composto:
ordem das chaves importa.

Expressao:
consulta deve ser compatível.

Seletividade:
capacidade de reduzir linhas.

Custo:
espaço e manutenção de escrita.

Prova:
EXPLAIN e EXPLAIN ANALYZE.
```

Regra final:

```text
um indice deve nascer de uma consulta real, possuir uma hipotese clara e permanecer somente quando seu beneficio superar seu custo.
```
