# 292 - M12.22 - Explain explain analyze e leitura de plano

## Apresentacao da aula

Na aula 291, você criou índices B-tree com hipóteses explícitas de uso.

Os principais objetos foram:

```text
app.idx_ordem_servico_cliente_status;

app.idx_atividade_ordem_status;

auditoria.idx_evento_ordem_ocorrido_em;

app.idx_telefone_cliente_confirmado;

app.idx_cliente_nome_lower;

app.uq_mv_resumo_competencia_id.
```

Também preparou consultas candidatas para:

- igualdade por primary key;
- filtro pelo prefixo de um índice composto;
- filtro pelas duas colunas do índice;
- filtro somente pela segunda coluna;
- busca por expressão;
- ordenação temporal;
- consulta que retorna grande parte da tabela.

Até aqui, cada índice representou uma hipótese.

Agora você vai observar como o PostgreSQL planeja e executa as consultas.

As ferramentas centrais serão:

```sql
EXPLAIN
```

e:

```sql
EXPLAIN ANALYZE
```

`EXPLAIN` mostra o plano estimado sem executar um `SELECT`.

`EXPLAIN ANALYZE` executa a instrução e acrescenta medidas reais.

Essa diferença é decisiva.

Em uma consulta de leitura controlada:

```sql
EXPLAIN ANALYZE
SELECT ...
```

a execução é geralmente apropriada para estudo.

Em um comando de escrita:

```sql
EXPLAIN ANALYZE
DELETE ...
```

o `DELETE` é realmente executado.

Por isso, esta aula usa `EXPLAIN ANALYZE` somente com consultas `SELECT` e demonstra o risco de escrita apenas em exemplos comentados.

Você vai aprender a interpretar:

- árvore do plano;
- nó raiz e nós filhos;
- custo inicial;
- custo total;
- linhas estimadas;
- largura estimada;
- tempo real;
- linhas reais;
- loops;
- `Seq Scan`;
- `Index Scan`;
- `Index Only Scan`;
- `Bitmap Index Scan`;
- `Bitmap Heap Scan`;
- `Filter`;
- `Index Cond`;
- `Rows Removed by Filter`;
- `Sort`;
- `Nested Loop`;
- `Hash Join`;
- `Buffers`;
- tempo de planejamento;
- tempo de execução;
- divergência entre estimativas e realidade.

O dataset permanente do curso é pequeno.

Por isso, o PostgreSQL pode escolher `Seq Scan` mesmo quando existe um índice compatível. Ler seis linhas sequencialmente pode custar menos que navegar por um índice e depois acessar a tabela.

Para tornar outros caminhos observáveis sem alterar os dados do curso, você criará uma tabela temporária com volume controlado.

A tabela temporária:

- existe apenas na sessão;
- será preenchida com `generate_series`;
- receberá índices;
- terá estatísticas atualizadas;
- será removida no final do script;
- não alterará as tabelas permanentes.

A meta desta aula não é perseguir um nó específico.

A meta é aprender a responder:

```text
qual caminho foi escolhido?

quais condições foram usadas pelo índice?

quais linhas foram filtradas depois?

as estimativas estavam próximas?

o plano executou quantas vezes?

houve ordenação?

quais páginas foram lidas?

a consulta realmente ficou melhor?

o índice criado na aula 291 é justificável?
```

Ao final, você deverá conseguir ler um plano de baixo para cima, relacionar nós à consulta original e separar evidência de suposição.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
290:
funções e CASE.

291:
índices B-tree e critérios.

292:
EXPLAIN, EXPLAIN ANALYZE e leitura de plano.

293:
transações ACID com BEGIN, COMMIT e ROLLBACK.

294:
níveis de isolamento.

295:
locks, bloqueios e deadlocks.
```

A progressão técnica é:

```text
consulta;
índice candidato;
plano estimado;
execução medida;
decisão.
```

Não inverta para:

```text
consulta lenta;
criar vários índices;
esperar melhora.
```

O plano é uma evidência sobre uma execução em determinado contexto.

Ele depende de:

- versão do PostgreSQL;
- estatísticas;
- quantidade de linhas;
- distribuição dos valores;
- parâmetros do planejador;
- memória;
- cache;
- concorrência;
- formato da consulta;
- índices disponíveis.

Uma medição local não prova automaticamente o comportamento em produção.

Ela ensina como investigar.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-292-explain-explain-analyze-leitura-plano
```

Estrutura final:

```text
labs
└── m12
    └── aula-292-explain-explain-analyze-leitura-plano
        ├── README.md
        └── sql
            ├── 00_verificar_ambiente_indices.sql
            ├── 01_explain_estimado.sql
            ├── 02_explain_analyze_select.sql
            ├── 03_seq_scan_e_index_scan.sql
            ├── 04_index_cond_filter_rows_removed.sql
            ├── 05_index_only_e_bitmap.sql
            ├── 06_sort_e_order_by.sql
            ├── 07_planos_de_join.sql
            ├── 08_estimativas_e_estatisticas.sql
            ├── 09_buffers_loops_e_tempos.sql
            ├── 10_risco_explain_analyze_escrita.sql
            ├── 11_laboratorio_temporario_com_volume.sql
            ├── 12_exercicio.sql
            └── 13_validacao_final.sql
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

O laboratório:

- não altera dados permanentes;
- não remove índices principais;
- não cria índices permanentes adicionais;
- atualiza estatísticas apenas quando indicado;
- usa tabela temporária para volume;
- executa `EXPLAIN ANALYZE` apenas em `SELECT`.

Os planos exatos podem variar.

Você deve interpretar os campos encontrados, não copiar uma saída esperada como verdade absoluta.

---

## Conceito essencial

### Planejador e executor

O PostgreSQL possui componentes conceituais diferentes.

Planejador:

```text
analisa a consulta;

considera caminhos possíveis;

estima custos e cardinalidades;

escolhe um plano.
```

Executor:

```text
executa os nós escolhidos;

lê páginas;

aplica filtros;

combina linhas;

mede tempo e quantidade real.
```

`EXPLAIN` mostra estimativas do planejador.

`EXPLAIN ANALYZE` mostra estimativas e execução real.

---

### EXPLAIN

Forma:

```sql
EXPLAIN
SELECT ...
```

A consulta é planejada.

Para um `SELECT`, ela não é executada.

Exemplo:

```sql
EXPLAIN
SELECT
    id,
    nome
FROM app.cliente
WHERE id = 930001;
```

Saída conceitual:

```text
Index Scan using pk_cliente on cliente
  Index Cond: (id = 930001)
```

Com tabela muito pequena, também pode aparecer:

```text
Seq Scan on cliente
  Filter: (id = 930001)
```

As duas formas podem ser corretas conforme o custo estimado.

---

### EXPLAIN ANALYZE

Forma:

```sql
EXPLAIN ANALYZE
SELECT ...
```

O PostgreSQL executa a consulta e mede o que ocorreu.

Exemplo de campos:

```text
cost=0.00..1.04 rows=1 width=40

actual time=0.010..0.011 rows=1 loops=1
```

As estimativas aparecem ao lado das medidas reais.

O resultado da consulta não é entregue como linhas comuns; o resultado exibido é o plano com métricas.

---

### Opcoes do EXPLAIN

Forma recomendada para o laboratório:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    COSTS,
    SUMMARY,
    FORMAT TEXT
)
SELECT ...
```

Significados:

```text
ANALYZE:
executa e mede.

BUFFERS:
mostra atividade de buffers.

VERBOSE:
detalha relações, aliases e colunas.

COSTS:
mantém custos estimados.

SUMMARY:
mostra tempos de planejamento e execução.

FORMAT TEXT:
saída textual hierárquica.
```

Outros formatos incluem:

```text
JSON;
XML;
YAML.
```

O formato textual será usado para leitura humana.

---

### Arvore do plano

Um plano é uma árvore.

Exemplo:

```text
Sort
  -> Seq Scan on atividade
```

Leia de baixo para cima:

1. `Seq Scan` produz linhas;
2. `Sort` ordena as linhas;
3. o nó raiz entrega o resultado.

Outro exemplo:

```text
Nested Loop
  -> Index Scan on ordem_servico
  -> Index Scan on atividade
```

O nó externo encontra ordens.

Para cada linha externa, o nó interno procura atividades.

A indentação representa relação entre pai e filhos.

---

### Cost inicial e total

Trecho:

```text
cost=0.29..8.31
```

Primeiro número:

```text
startup cost;
custo estimado antes de produzir a primeira linha.
```

Segundo:

```text
total cost;
custo estimado para produzir todas as linhas.
```

O custo não é medido em milissegundos.

É uma unidade interna comparativa baseada em parâmetros do planejador.

Não compare custo de servidores ou consultas diferentes como se fosse tempo real universal.

---

### Rows e width

Exemplo:

```text
rows=10 width=64
```

`rows`:

```text
quantidade estimada de linhas produzidas pelo nó.
```

`width`:

```text
tamanho médio estimado de cada linha, em bytes.
```

A combinação influencia custos de:

- leitura;
- memória;
- ordenação;
- hash;
- transferência entre nós.

Estimativa de linhas muito distante da realidade pode levar o planejador a escolher um caminho inadequado.

---

### Actual time rows loops

Exemplo:

```text
actual time=0.015..0.022 rows=3 loops=1
```

Primeiro tempo:

```text
tempo até a primeira linha.
```

Segundo:

```text
tempo até concluir o nó em uma execução.
```

`rows`:

```text
média de linhas produzidas por loop.
```

`loops`:

```text
quantidade de execuções do nó.
```

Para estimar linhas totais produzidas pelo nó:

```text
rows por loop × loops.
```

Não leia `rows` isoladamente quando `loops` for maior que um.

---

### Seq Scan

`Seq Scan` lê a relação sequencialmente e aplica filtros.

Exemplo:

```text
Seq Scan on cliente
  Filter: (status = true)
```

É apropriado quando:

- a tabela é pequena;
- grande parte das linhas será retornada;
- não existe índice útil;
- o custo do índice seria maior;
- as estatísticas indicam baixa seletividade.

`Seq Scan` não significa erro.

Em tabelas pequenas, pode ser a melhor escolha.

---

### Index Scan

`Index Scan` navega pelo índice e acessa as linhas correspondentes na tabela.

Exemplo:

```text
Index Scan using idx_atividade_ordem_status on atividade
  Index Cond: (
      (ordem_servico_id = 930001)
      AND (status = 'PENDENTE')
  )
```

O índice localiza as chaves.

A tabela fornece colunas que não estão armazenadas de forma suficiente no índice e confirma visibilidade.

---

### Index Cond

`Index Cond` representa condições usadas para limitar a navegação no índice.

Exemplo:

```text
Index Cond: (ordem_servico_id = 930001)
```

Essa condição participa do caminho indexado.

Ela é diferente de `Filter`.

---

### Filter

`Filter` é aplicado às linhas produzidas pelo nó.

Exemplo:

```text
Index Cond: (ordem_servico_id = 930001)
Filter: (descricao ~~* '%teste%')
```

A primeira condição ajuda o índice a localizar candidatos.

A segunda é verificada depois.

Um filtro posterior pode remover muitas linhas, indicando oportunidade de revisar:

- índice;
- ordem das colunas;
- seletividade;
- expressão;
- consulta;
- modelo.

---

### Rows Removed by Filter

Com `ANALYZE`, pode aparecer:

```text
Rows Removed by Filter: 900
```

Isso indica linhas examinadas e descartadas pelo filtro daquele nó.

Não significa automaticamente que um índice resolverá.

Primeiro avalie:

- qual condição removeu as linhas;
- se é indexável;
- se é seletiva;
- se o custo de outro índice compensa.

---

### Index Only Scan

`Index Only Scan` pode responder usando o índice sem buscar todos os dados na tabela.

Requisitos conceituais:

- as colunas necessárias estão disponíveis no índice;
- o PostgreSQL consegue confirmar visibilidade pelas estruturas apropriadas.

Pode aparecer:

```text
Index Only Scan using uq_mv_resumo_competencia_id
```

Campo importante:

```text
Heap Fetches.
```

Mesmo em um `Index Only Scan`, o executor pode precisar consultar a tabela para verificar visibilidade de algumas linhas.

Quanto menor `Heap Fetches`, mais próximo de uma leitura somente do índice.

---

### Bitmap Index Scan e Bitmap Heap Scan

Para conjuntos intermediários, o PostgreSQL pode:

1. usar um ou mais índices para construir um bitmap de localizações;
2. visitar páginas da tabela em ordem eficiente.

Plano:

```text
Bitmap Heap Scan on tabela
  Recheck Cond: (...)
  -> Bitmap Index Scan on indice
       Index Cond: (...)
```

`Bitmap Index Scan` identifica posições.

`Bitmap Heap Scan` lê as páginas da tabela.

Esse caminho pode ser útil quando muitas linhas correspondem, mas ainda não tantas a ponto de preferir `Seq Scan`.

---

### Recheck Cond

Em um bitmap scan, pode aparecer:

```text
Recheck Cond
```

O executor confirma a condição nas linhas visitadas.

Isso é parte normal do mecanismo.

Em bitmaps com perda de precisão por memória, a rechecagem se torna ainda mais importante.

---

### Sort

`Sort` ordena linhas.

Exemplo:

```text
Sort
  Sort Key: ocorrido_em DESC
  Sort Method: quicksort
  Memory: 25kB
```

Perguntas:

- o índice já possuía ordem compatível?
- o filtro permitiu usar essa ordem?
- quantas linhas foram ordenadas?
- a ordenação ficou em memória?
- houve uso de disco?

No dataset pequeno, ordenar pode ser barato.

Não crie índice apenas para remover qualquer `Sort`.

---

### Nested Loop

`Nested Loop` combina linhas executando o lado interno para cada linha do lado externo.

É adequado quando:

- o lado externo retorna poucas linhas;
- o lado interno possui busca eficiente;
- a junção é seletiva.

O nó interno costuma apresentar:

```text
loops maior que 1.
```

Exemplo:

```text
3 linhas externas;

Index Scan interno com loops=3.
```

Leia as métricas considerando essa repetição.

---

### Hash Join

`Hash Join` constrói uma tabela hash de um dos lados e procura correspondências do outro.

Plano conceitual:

```text
Hash Join
  Hash Cond: (a.ordem_servico_id = os.id)
  -> Seq Scan on atividade a
  -> Hash
       -> Seq Scan on ordem_servico os
```

Pode ser adequado para conjuntos maiores e igualdade.

O plano depende do tamanho estimado, memória e índices.

---

### Buffers

Com:

```sql
EXPLAIN (ANALYZE, BUFFERS)
```

podem aparecer:

```text
Buffers: shared hit=5 read=2
```

`shared hit`:

```text
páginas encontradas no cache compartilhado.
```

`read`:

```text
páginas lidas do sistema de armazenamento para o buffer.
```

Também podem aparecer buffers:

```text
dirtied;
written;
local;
temp.
```

Uma segunda execução pode ter mais hits por causa do aquecimento do cache.

Por isso, comparar apenas tempo de uma execução é frágil.

---

### Planning Time e Execution Time

No final:

```text
Planning Time: ...

Execution Time: ...
```

`Planning Time` mede a preparação do plano.

`Execution Time` mede a execução instrumentada.

`EXPLAIN ANALYZE` adiciona sobrecarga de medição.

O tempo exibido não inclui necessariamente todos os custos percebidos por uma aplicação, como:

- rede;
- serialização;
- fila de conexão;
- mapeamento Java;
- tempo no cliente.

---

### Estimativas e estatisticas

O planejador estima cardinalidade usando estatísticas.

Comando:

```sql
ANALYZE app.atividade;
```

Ele coleta estatísticas sem alterar os dados de negócio.

O catálogo `pg_stats` pode mostrar:

- fração de nulos;
- quantidade estimada de valores distintos;
- valores comuns;
- frequências;
- histograma;
- correlação.

Se estatísticas estiverem ausentes ou desatualizadas, as estimativas podem divergir.

---

### Divergencia de cardinalidade

Compare:

```text
rows estimadas:
10.

rows reais:
10000.
```

Uma diferença grande pode afetar:

- ordem dos joins;
- escolha de nested loop;
- escolha de hash;
- uso de bitmap;
- memória de sort;
- custo total.

Não conclua somente por uma diferença pequena no dataset educacional.

Em produção, observe repetição e impacto.

---

### EXPLAIN ANALYZE executa escrita

Estas instruções executam de verdade:

```sql
EXPLAIN ANALYZE
UPDATE ...;

EXPLAIN ANALYZE
DELETE ...;

EXPLAIN ANALYZE
INSERT ...;
```

Para estudar uma escrita, uma proteção possível é:

```sql
BEGIN;

EXPLAIN ANALYZE
UPDATE ...;

ROLLBACK;
```

Mesmo com rollback:

- locks podem ocorrer;
- triggers executam;
- sequences podem avançar;
- funções externas podem ter efeitos;
- tempo e recursos são consumidos.

Nesta aula, você não executará escrita com `EXPLAIN ANALYZE`.

---

### Forcar um plano nao prova beneficio

Parâmetros como:

```text
enable_seqscan;
enable_indexscan;
enable_bitmapscan.
```

podem ser alterados na sessão para investigação.

Desabilitar `Seq Scan` não prova que `Index Scan` é melhor.

Apenas força o planejador a considerar caminhos alternativos quando possível.

O laboratório principal não dependerá dessa técnica.

A tabela temporária com volume permitirá observar decisões naturais do planejador.

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
  -Path "labs\m12\aula-292-explain-explain-analyze-leitura-plano\sql"

Set-Location `
  "labs\m12\aula-292-explain-explain-analyze-leitura-plano"
```

---

### 3. Criar 00_verificar_ambiente_indices.sql

Crie:

```text
sql/00_verificar_ambiente_indices.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    version() AS versao;

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
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-292-explain-explain-analyze-leitura-plano\sql\00_verificar_ambiente_indices.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme os seis índices da aula 291.

---

### 4. Criar 01_explain_estimado.sql

Crie:

```text
sql/01_explain_estimado.sql
```

Conteúdo:

```sql
EXPLAIN
SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE cliente_id = 930001
  AND status = 'ABERTA'
ORDER BY id;

EXPLAIN (
    VERBOSE,
    COSTS,
    FORMAT TEXT
)
SELECT
    id,
    codigo,
    descricao,
    status
FROM app.atividade
WHERE ordem_servico_id = 930001
  AND status = 'PENDENTE'
ORDER BY id;
```

Leia:

- nó raiz;
- nó de acesso;
- custo;
- linhas;
- largura;
- filtros;
- ordenação.

A consulta não é executada pelo `EXPLAIN` simples.

---

### 5. Criar 02_explain_analyze_select.sql

Crie:

```text
sql/02_explain_analyze_select.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    COSTS,
    SUMMARY,
    FORMAT TEXT
)
SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE cliente_id = 930001
  AND status = 'ABERTA'
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    codigo,
    descricao,
    status
FROM app.atividade
WHERE ordem_servico_id = 930001
  AND status = 'PENDENTE'
ORDER BY id;
```

Compare:

```text
rows estimadas;

rows reais;

tempo inicial;

tempo total;

loops;

buffers;

Planning Time;

Execution Time.
```

Não estranhe se aparecer `Seq Scan`.

As tabelas possuem poucas linhas.

---

### 6. Criar 03_seq_scan_e_index_scan.sql

Crie:

```text
sql/03_seq_scan_e_index_scan.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE status = 'ABERTA'
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE cliente_id = 930001
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE cliente_id = 930001
  AND status = 'ABERTA'
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    nome,
    documento
FROM app.cliente
WHERE lower(nome) = 'hospital vida';
```

Relacione cada consulta aos índices:

```text
status isolado:
não começa pelo prefixo do composto.

cliente_id:
usa o primeiro atributo lógico do composto.

cliente_id + status:
corresponde às duas chaves.

lower(nome):
corresponde à expressão indexada.
```

O plano escolhido ainda depende de custo.

---

### 7. Criar 04_index_cond_filter_rows_removed.sql

Crie:

```text
sql/04_index_cond_filter_rows_removed.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    codigo,
    descricao,
    status
FROM app.atividade
WHERE ordem_servico_id = 930001
  AND status = 'PENDENTE'
  AND descricao ILIKE '%teste%'
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    numero,
    tipo,
    confirmado
FROM app.telefone_cliente
WHERE cliente_id = 930001
  AND confirmado = true
  AND tipo = 'COMERCIAL'
ORDER BY id;
```

Procure, quando presentes:

```text
Index Cond;

Filter;

Rows Removed by Filter.
```

No dataset pequeno, o nó pode ser sequencial e apresentar somente `Filter`.

Documente o plano real, não o plano desejado.

---

### 8. Criar 05_index_only_e_bitmap.sql

Crie:

```text
sql/05_index_only_e_bitmap.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    competencia_id
FROM app.mv_resumo_competencia
WHERE competencia_id = 950001;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    competencia_id,
    competencia_codigo,
    quantidade_associacoes
FROM app.mv_resumo_competencia
WHERE competencia_id = 950001;
```

A primeira consulta projeta apenas a coluna indexada.

Mesmo assim, o planejador pode escolher outro caminho por causa do tamanho reduzido.

Observe se aparece:

```text
Index Only Scan;

Heap Fetches;

Index Scan;

Seq Scan.
```

Bitmap scans serão observados de forma mais provável no laboratório temporário.

---

### 9. Criar 06_sort_e_order_by.sql

Crie:

```text
sql/06_sort_e_order_by.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    ordem_servico_id,
    tipo,
    ocorrido_em
FROM auditoria.evento_ordem_servico
WHERE ordem_servico_id = 930001
ORDER BY ocorrido_em DESC;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    ordem_servico_id,
    tipo,
    ocorrido_em
FROM auditoria.evento_ordem_servico
ORDER BY ocorrido_em DESC;
```

Compare:

```text
ordem_servico_id + ocorrido_em DESC:
compatível com o índice composto.

ocorrido_em sem a primeira chave:
não corresponde ao prefixo principal.
```

Procure:

```text
Sort;

Sort Key;

Sort Method;

Memory.
```

---

### 10. Criar 07_planos_de_join.sql

Crie:

```text
sql/07_planos_de_join.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY
    os.id,
    a.id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    c.id AS competencia_id,
    c.codigo AS competencia_codigo
FROM app.atividade AS a
INNER JOIN app.atividade_competencia AS ac
    ON ac.atividade_id = a.id
INNER JOIN app.competencia AS c
    ON c.id = ac.competencia_id
WHERE a.id BETWEEN 930001 AND 930006
ORDER BY
    a.id,
    c.id;
```

Identifique o algoritmo real:

```text
Nested Loop;

Hash Join;

Merge Join, caso apareça.
```

Leia os nós filhos antes do nó de join.

---

### 11. Criar 08_estimativas_e_estatisticas.sql

Crie:

```text
sql/08_estimativas_e_estatisticas.sql
```

Conteúdo:

```sql
ANALYZE app.cliente;
ANALYZE app.ordem_servico;
ANALYZE app.atividade;
ANALYZE app.telefone_cliente;
ANALYZE auditoria.evento_ordem_servico;

SELECT
    schemaname,
    tablename,
    attname,
    null_frac,
    n_distinct,
    most_common_vals,
    most_common_freqs,
    histogram_bounds,
    correlation
FROM pg_stats
WHERE schemaname IN (
    'app',
    'auditoria'
)
  AND tablename IN (
      'cliente',
      'ordem_servico',
      'atividade',
      'telefone_cliente',
      'evento_ordem_servico'
  )
  AND attname IN (
      'cliente_id',
      'ordem_servico_id',
      'status',
      'confirmado',
      'ocorrido_em',
      'nome'
  )
ORDER BY
    schemaname,
    tablename,
    attname;
```

`ANALYZE` atualiza estatísticas.

Ele não altera as linhas de negócio.

No dataset pequeno, algumas listas estatísticas podem ficar vazias ou pouco representativas.

---

### 12. Criar 09_buffers_loops_e_tempos.sql

Crie:

```text
sql/09_buffers_loops_e_tempos.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY,
    TIMING
)
SELECT
    os.id,
    os.codigo,
    a.id,
    a.codigo
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id = 930001
ORDER BY a.id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY,
    TIMING
)
SELECT
    os.id,
    os.codigo,
    a.id,
    a.codigo
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id = 930001
ORDER BY a.id;
```

Execute duas vezes no mesmo arquivo.

Compare os buffers.

A segunda execução pode apresentar mais `shared hit`, mas isso não é garantia absoluta.

Registre:

- nós;
- loops;
- linhas por loop;
- buffers;
- Planning Time;
- Execution Time;
- diferença entre as execuções.

---

### 13. Criar 10_risco_explain_analyze_escrita.sql

Crie:

```text
sql/10_risco_explain_analyze_escrita.sql
```

Conteúdo:

```sql
-- EXPLAIN simples não executa o UPDATE.
EXPLAIN
UPDATE app.cliente
SET nome = nome
WHERE id = 930001;

-- NÃO EXECUTE FORA DE UMA PRÁTICA CONTROLADA:
--
-- EXPLAIN ANALYZE
-- UPDATE app.cliente
-- SET nome = nome
-- WHERE id = 930001;
--
-- O UPDATE seria executado.

-- Uma proteção parcial seria:
--
-- BEGIN;
--
-- EXPLAIN ANALYZE
-- UPDATE app.cliente
-- SET nome = nome
-- WHERE id = 930001;
--
-- ROLLBACK;
--
-- Mesmo assim, locks, triggers, sequences e efeitos externos
-- precisam ser analisados.
```

Execute apenas o `EXPLAIN` simples.

Mantenha o bloco com `ANALYZE` comentado.

---

### 14. Criar 11_laboratorio_temporario_com_volume.sql

Crie:

```text
sql/11_laboratorio_temporario_com_volume.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS tmp_ordem_plano_aula_292;

CREATE TEMP TABLE tmp_ordem_plano_aula_292 (
    id bigint NOT NULL,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    criado_em timestamptz NOT NULL,
    valor numeric(12, 2) NOT NULL
);

INSERT INTO tmp_ordem_plano_aula_292 (
    id,
    cliente_id,
    status,
    criado_em,
    valor
)
SELECT
    g AS id,
    (g % 1000) + 1 AS cliente_id,
    CASE
        WHEN g % 20 = 0 THEN 'ERRO'
        WHEN g % 4 = 0 THEN 'CONCLUIDA'
        ELSE 'ABERTA'
    END AS status,
    TIMESTAMPTZ '2026-01-01 00:00:00-03'
        + g * INTERVAL '1 minute' AS criado_em,
    round(
        (100 + (g % 5000))::numeric,
        2
    ) AS valor
FROM generate_series(
    1,
    100000
) AS serie(g);

CREATE INDEX idx_tmp_ordem_cliente_status
ON tmp_ordem_plano_aula_292 (
    cliente_id,
    status
);

CREATE INDEX idx_tmp_ordem_criado_em
ON tmp_ordem_plano_aula_292 (
    criado_em
);

VACUUM ANALYZE tmp_ordem_plano_aula_292;

-- Busca seletiva por igualdade nas duas chaves.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    cliente_id,
    status
FROM tmp_ordem_plano_aula_292
WHERE cliente_id = 42
  AND status = 'ABERTA';

-- Filtro de baixa seletividade.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    cliente_id,
    status
FROM tmp_ordem_plano_aula_292
WHERE status = 'ABERTA';

-- Faixa temporal seletiva.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    criado_em,
    valor
FROM tmp_ordem_plano_aula_292
WHERE criado_em >= TIMESTAMPTZ '2026-03-10 00:00:00-03'
  AND criado_em < TIMESTAMPTZ '2026-03-10 02:00:00-03'
ORDER BY criado_em;

-- Conjunto intermediário que pode favorecer bitmap.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    cliente_id,
    status
FROM tmp_ordem_plano_aula_292
WHERE cliente_id BETWEEN 1 AND 150;

-- Consulta coberta pelas chaves do índice composto.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    cliente_id,
    status
FROM tmp_ordem_plano_aula_292
WHERE cliente_id = 42
  AND status = 'ABERTA';

DROP TABLE tmp_ordem_plano_aula_292;
```

Execute o arquivo inteiro na mesma sessão:

```powershell
Get-Content -Raw `
  "labs\m12\aula-292-explain-explain-analyze-leitura-plano\sql\11_laboratorio_temporario_com_volume.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Os nós podem variar.

Procure diferenças entre:

- busca seletiva;
- filtro que retorna grande parte;
- faixa temporal;
- conjunto intermediário;
- projeção coberta pelo índice.

A tabela temporária desaparece ao final do script.

---

### 15. Criar 12_exercicio.sql

Crie:

```text
sql/12_exercicio.sql
```

Resolva as tarefas da seção de exercício guiado.

Não desabilite métodos do planejador.

Não modifique dados permanentes.

---

### 16. Criar 13_validacao_final.sql

Crie:

```text
sql/13_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    count(*) AS indices_principais
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
    to_regclass(
        'pg_temp.tmp_ordem_plano_aula_292'
    ) AS tabela_temporaria_restante;

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
    ) AS telefones;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    nome,
    documento
FROM app.cliente
WHERE lower(nome) = 'hospital vida';
```

Resultados esperados:

```text
seis índices principais;

nenhuma tabela temporária restante;

dataset permanente intacto;

plano final legível.
```

---

### 17. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 292 - Explain explain analyze e leitura de plano.

Objetivo:
comparar estimativas com execução real e interpretar nós.

Segurança:
EXPLAIN não executa SELECT;
EXPLAIN ANALYZE executa;
ANALYZE em escrita é perigoso.

Campos:
cost, rows, width, actual time, actual rows, loops,
buffers, Planning Time e Execution Time.

Nós:
Seq Scan, Index Scan, Index Only Scan,
Bitmap Index Scan, Bitmap Heap Scan,
Sort, Nested Loop e Hash Join.

Regra:
dataset pequeno pode preferir Seq Scan.

Volume:
tabela temporária com 100000 linhas;
nenhuma alteração permanente.

Próxima aula:
transações ACID com BEGIN, COMMIT e ROLLBACK.
```

Para cada consulta, documente:

- objetivo;
- índice candidato;
- nó escolhido;
- condição de índice;
- filtros;
- estimativa;
- realidade;
- loops;
- buffers;
- ordenação;
- conclusão;
- dúvida restante.

---

## Entendendo o que foi feito

### A hipotese virou evidencia

Os índices da aula 291 foram comparados com planos reais.

Alguns podem não ser escolhidos no dataset pequeno.

Isso foi interpretado como decisão de custo, não como falha automática.

---

### Estimativa e realidade foram separadas

`EXPLAIN` mostrou:

```text
cost;
rows;
width.
```

`EXPLAIN ANALYZE` acrescentou:

```text
actual time;
actual rows;
loops;
buffers.
```

A diferença permitiu avaliar a qualidade das estimativas.

---

### Condicao de indice e filtro foram diferenciados

`Index Cond` limitou o acesso pelo índice.

`Filter` descartou linhas depois do acesso.

`Rows Removed by Filter` mostrou o trabalho descartado.

---

### A arvore foi lida de baixo para cima

Scans produziram linhas.

Sorts ordenaram.

Joins combinaram.

O nó raiz entregou o resultado.

---

### O volume temporario tornou escolhas visiveis

A tabela temporária permitiu comparar:

- igualdade seletiva;
- baixa seletividade;
- faixa;
- bitmap;
- projeção coberta.

Nenhuma tabela permanente foi alterada.

---

### EXPLAIN ANALYZE foi tratado como execucao

O laboratório limitou `ANALYZE` a `SELECT`.

O risco em comandos de escrita ficou explícito.

---

## Erros comuns importantes

### Seq Scan foi tratado como problema

A tabela é pequena ou o filtro retorna muitas linhas.

Compare custos, volume e buffers.

---

### Cost foi lido como milissegundo

Custo é unidade comparativa do planejador.

Use `actual time` para tempo medido daquela execução.

---

### Rows ignorou loops

O nó produziu `rows` por loop.

Multiplique por `loops` para entender o total aproximado.

---

### Indice foi criado depois de um unico plano

Uma execução isolada não representa toda a carga.

Confirme frequência, parâmetros, volume e custo de escrita.

---

### EXPLAIN ANALYZE foi executado em DELETE

O comando realmente removeu linhas.

Nunca faça isso sem estratégia de segurança e compreensão dos efeitos.

---

## Comandos uteis

### Plano estimado

```sql
EXPLAIN
SELECT ...;
```

### Plano medido

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT ...;
```

### Estatisticas

```sql
ANALYZE schema.tabela;
```

### Catalogo

```sql
SELECT *
FROM pg_stats
WHERE schemaname = 'app';
```

---

## Exercicio guiado

No arquivo:

```text
sql/12_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Primary key

Execute `EXPLAIN` e `EXPLAIN ANALYZE` para:

```sql
SELECT *
FROM app.ordem_servico
WHERE id = 930001;
```

Registre:

- nó;
- índice candidato;
- linhas estimadas;
- linhas reais;
- buffers;
- motivo possível do plano.

---

### Parte 2 - Prefixo do composto

Compare:

```text
cliente_id;

cliente_id + status;

status isolado.
```

Use `app.ordem_servico`.

Relacione cada consulta a:

```text
idx_ordem_servico_cliente_status.
```

Não force o planejador.

---

### Parte 3 - Expressao

Compare:

```sql
WHERE lower(nome) = 'hospital vida';

WHERE upper(nome) = 'HOSPITAL VIDA';

WHERE nome = 'Hospital Vida';
```

Registre qual expressão coincide com:

```text
idx_cliente_nome_lower.
```

Explique o plano real.

---

### Parte 4 - Sort

Compare duas consultas de eventos:

1. por ordem e `ocorrido_em DESC`;
2. somente por `ocorrido_em DESC`.

Identifique se existe `Sort`.

Relacione com a ordem do índice.

---

### Parte 5 - Join

Analise um join entre Ordem e Atividade.

Para cada nó:

- identifique pai e filho;
- leia de baixo para cima;
- registre loops;
- calcule linhas aproximadas totais;
- identifique o algoritmo de join.

---

### Parte 6 - Bitmap

No laboratório temporário, escolha uma faixa de `cliente_id` que produza conjunto intermediário.

Ajuste o limite se necessário.

Registre se apareceu:

```text
Bitmap Index Scan;
Bitmap Heap Scan;
Seq Scan;
Index Scan.
```

Não considere nenhum nó obrigatório.

---

### Parte 7 - Index Only

Na tabela temporária, projete somente:

```text
cliente_id;
status.
```

Use filtro compatível com o índice composto.

Observe:

```text
Index Only Scan;
Heap Fetches.
```

Se outro plano for escolhido, explique o tamanho e o custo.

---

### Parte 8 - Estimativa ruim

Na tabela temporária:

1. crie os dados;
2. consulte antes do `ANALYZE`;
3. execute `ANALYZE`;
4. consulte novamente;
5. compare `rows` estimadas e reais.

Mantenha tudo na mesma sessão.

Remova a tabela ao final.

---

### Parte 9 - Buffers e cache

Execute a mesma consulta de leitura duas vezes com `BUFFERS`.

Compare:

```text
shared hit;
shared read;
Execution Time.
```

Explique por que isso não é um benchmark completo.

---

### Parte 10 - Parecer tecnico

Escolha os seis índices da aula 291.

Classifique provisoriamente:

```text
manter;

revisar com mais volume;

possivelmente redundante;

não há evidência suficiente.
```

Para cada classificação, cite:

- consulta;
- plano;
- seletividade;
- custo de escrita;
- limitação do dataset.

Não remova os índices principais.

---

## Criterios de aceite

- o laboratório oficial da aula 292 existe;
- o arquivo e o H1 seguem a grade;
- os seis índices principais foram preservados;
- nenhum dado permanente foi modificado;
- `EXPLAIN` foi diferenciado de `EXPLAIN ANALYZE`;
- o risco de `ANALYZE` em escrita foi compreendido;
- custos inicial e total foram lidos;
- linhas e largura estimadas foram lidas;
- tempo, linhas reais e loops foram lidos;
- a árvore foi lida de baixo para cima;
- `Seq Scan` foi interpretado sem preconceito;
- `Index Scan` foi reconhecido;
- `Index Cond` e `Filter` foram diferenciados;
- `Rows Removed by Filter` foi analisado;
- `Index Only Scan` e `Heap Fetches` foram estudados;
- bitmap scans foram estudados;
- `Sort` e sua memória foram analisados;
- `Nested Loop` e `Hash Join` foram reconhecidos;
- buffers foram interpretados;
- Planning Time e Execution Time foram diferenciados;
- estatísticas foram atualizadas com `ANALYZE`;
- `pg_stats` foi consultado;
- estimativas foram comparadas com realidade;
- tabela temporária com volume foi criada e removida;
- métodos do planejador não foram forçados;
- nenhum `EXPLAIN ANALYZE` de escrita foi executado;
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
  labs/m12/aula-292-explain-explain-analyze-leitura-plano
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): analisar planos de execucao sql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
EXPLAIN;
EXPLAIN ANALYZE;
nós de plano;
estimativas;
métricas reais;
buffers;
estatísticas;
diagnóstico.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você deixou de presumir como uma consulta funciona e passou a observar o plano escolhido.

Aprendeu:

```text
EXPLAIN;
EXPLAIN ANALYZE;
cost;
rows;
width;
actual time;
loops;
Seq Scan;
Index Scan;
Index Only Scan;
Bitmap Index Scan;
Bitmap Heap Scan;
Index Cond;
Filter;
Rows Removed by Filter;
Sort;
Nested Loop;
Hash Join;
Buffers;
ANALYZE;
pg_stats.
```

As regras principais foram:

```text
EXPLAIN estima;

EXPLAIN ANALYZE executa e mede;

custo não é milissegundo;

rows reais precisam ser lidas com loops;

Seq Scan pode ser a melhor escolha;

índice existente não garante uso;

Index Cond participa do acesso;

Filter atua depois;

estatísticas influenciam estimativas;

buffers ajudam a entender páginas;

uma execução não é benchmark;

EXPLAIN ANALYZE em escrita executa a escrita;

decisões de índice precisam de evidência.
```

A próxima aula será:

```text
293 - M12.23 - Transacoes ACID begin commit rollback
```

Nela, você vai estudar:

- unidade de trabalho;
- `BEGIN`;
- `COMMIT`;
- `ROLLBACK`;
- atomicidade;
- consistência;
- isolamento;
- durabilidade;
- transação implícita e explícita;
- erro dentro de transação;
- estado abortado;
- rollback completo;
- múltiplas alterações coordenadas;
- leitura antes e depois do commit;
- cuidados de transações longas.

Os índices e planos continuarão existindo.

A próxima etapa muda o foco de leitura e performance para segurança das alterações.

---

# Material complementar

## Checkpoint final

- [ ] Comparei plano estimado e execução real.
- [ ] Interpretei scans, filtros, joins, sort, loops e buffers.
- [ ] Usei volume temporário sem alterar dados permanentes.
- [ ] Produzi parecer sobre índices e fiz o commit.

---

## Troubleshooting adicional

### Plano mudou entre execucoes

Cache, estatísticas, parâmetros ou contexto podem ter mudado.

Registre o ambiente e compare várias execuções.

### BUFFERS nao aparece

A opção `BUFFERS` exige `ANALYZE`.

Use-a somente quando a execução for segura.

### Index Only Scan possui Heap Fetches

O executor precisou confirmar visibilidade na tabela.

Isso não invalida o nó.

### Estimativa continua distante apos ANALYZE

A distribuição pode ser complexa, correlacionada ou exigir estatísticas mais adequadas.

Não aumente configurações sem diagnóstico.

### Tempo muito pequeno varia bastante

Ruído de medição domina consultas minúsculas.

Use volume representativo e múltiplas observações.

---

## Perguntas de revisao

1. O que `EXPLAIN` faz?
2. O que `EXPLAIN ANALYZE` acrescenta?
3. Por que ele é perigoso em escrita?
4. O que significa `cost=a..b`?
5. O que representa `rows` estimado?
6. O que representa `width`?
7. Como ler `actual time`?
8. O que significa `loops`?
9. Quando `Seq Scan` é apropriado?
10. O que é `Index Cond`?
11. Qual a diferença para `Filter`?
12. O que são linhas removidas?
13. O que é `Index Only Scan`?
14. O que significa `Heap Fetches`?
15. Como funciona um bitmap scan?
16. O que `Sort Method` informa?
17. Como ler um `Nested Loop`?
18. Para que serve `ANALYZE`?

---

## Roteiro de resposta

1. Mostra o plano estimado.
2. Executa e mostra métricas reais.
3. A escrita realmente acontece.
4. Custo inicial e total estimados.
5. Linhas que o nó deve produzir.
6. Tamanho médio estimado da linha.
7. Tempo até primeira e última linha por loop.
8. Quantidade de execuções do nó.
9. Tabela pequena ou grande parte das linhas.
10. Condição usada para navegar no índice.
11. `Filter` descarta depois do acesso.
12. Candidatas avaliadas e descartadas.
13. Leitura potencialmente atendida pelo índice.
14. Consultas adicionais à tabela para visibilidade.
15. Índice cria mapa; heap lê páginas correspondentes.
16. Algoritmo e memória ou disco usados.
17. O lado interno executa para linhas do externo.
18. Atualiza estatísticas do planejador.

---

## Desafio opcional

Crie uma tabela temporária com um milhão de linhas e distribuição desigual:

```text
95% status ABERTA;

4% CONCLUIDA;

1% ERRO.
```

Crie índices candidatos e compare planos para:

- `ABERTA`;
- `ERRO`;
- cliente específico;
- cliente e status;
- intervalo temporal;
- ordenação com limite;
- projeção coberta pelo índice.

Documente:

- estimativa;
- realidade;
- buffers;
- plano;
- seletividade;
- conclusão;
- custo de manter o índice.

Remova a tabela temporária ao final.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 292 - M12.22 - Explain explain analyze e leitura de plano

- Diferenciei `EXPLAIN` de `EXPLAIN ANALYZE`.
- Entendi que `EXPLAIN ANALYZE` executa a instrução.
- Li custos inicial e total, linhas e largura estimadas.
- Comparei estimativas com tempo, linhas e loops reais.
- Aprendi a ler a árvore do plano de baixo para cima.
- Interpretei `Seq Scan`, `Index Scan` e `Index Only Scan`.
- Diferenciei `Index Cond` de `Filter`.
- Analisei `Rows Removed by Filter`.
- Estudei `Bitmap Index Scan` e `Bitmap Heap Scan`.
- Interpretei `Sort`, `Nested Loop` e `Hash Join`.
- Usei `BUFFERS` para observar hits e leituras.
- Diferenciei Planning Time de Execution Time.
- Atualizei estatísticas com `ANALYZE` e consultei `pg_stats`.
- Usei uma tabela temporária com volume controlado.
- Preservei índices e dados permanentes.
- Próxima aula: transações ACID com `BEGIN`, `COMMIT` e `ROLLBACK`.
```

---

## Referencia tecnica curta

```text
EXPLAIN:
plano estimado.

EXPLAIN ANALYZE:
executa e mede.

cost:
unidade estimada.

rows:
cardinalidade.

loops:
repetições do nó.

Seq Scan:
leitura sequencial.

Index Scan:
índice mais tabela.

Index Only Scan:
dados potencialmente no índice.

Bitmap:
mapa de páginas.

Filter:
condição posterior.

BUFFERS:
páginas em cache e lidas.
```

Regra final:

```text
leia o plano como uma arvore de trabalho, compare estimativa com realidade e somente depois decida sobre consultas e indices.
```
