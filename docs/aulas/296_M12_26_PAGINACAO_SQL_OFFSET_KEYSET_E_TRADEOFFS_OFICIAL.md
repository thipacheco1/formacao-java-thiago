# 296 - M12.26 - Paginacao SQL offset keyset e tradeoffs

## Apresentacao da aula

Na aula 295, você estudou concorrência sobre recursos compartilhados.

Praticou:

```text
locks de linha;
SELECT FOR UPDATE;
NOWAIT;
SKIP LOCKED;
pg_stat_activity;
pg_locks;
deadlocks;
retry.
```

Agora o foco volta para consultas de leitura, mas com um problema que aparece em praticamente toda API de listagem:

```text
como retornar muitos registros em partes menores?
```

Uma API de Ordens de Serviço não deve enviar cem mil linhas em uma única resposta.

A interface normalmente solicita algo como:

```text
primeiros 20 registros;

próximos 20 registros;

registros depois de determinado cursor;

total de resultados;

ordenação por data.
```

Esse processo é paginação.

Você já usou `LIMIT` e `OFFSET` na aula 278.

Nesta aula, vai aprofundar dois modelos:

```text
paginação por OFFSET;

paginação por keyset, também chamada seek pagination.
```

A paginação por offset é simples:

```sql
ORDER BY criado_em DESC
LIMIT 20
OFFSET 40;
```

Ela representa:

```text
ignore os primeiros 40 registros ordenados;
retorne os próximos 20.
```

A paginação por keyset usa a última chave da página anterior:

```sql
WHERE (criado_em, id) < (:ultimo_criado_em, :ultimo_id)
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;
```

Ela representa:

```text
continue depois do último item que o cliente recebeu.
```

As duas abordagens possuem vantagens e limitações.

OFFSET:

- é fácil de compreender;
- permite acessar uma página arbitrária;
- combina com interfaces numeradas;
- pode ficar caro em páginas profundas;
- pode repetir ou pular itens quando dados mudam entre requisições.

Keyset:

- evita descartar todas as linhas anteriores;
- costuma escalar melhor em navegação sequencial;
- mantém continuidade relativa ao cursor;
- exige ordenação total e estável;
- exige contrato de cursor;
- não oferece acesso direto natural à página 4.723;
- fica mais complexa com várias ordenações, nulos e filtros mutáveis.

Nesta aula, você criará uma tabela exclusiva com cem mil registros para tornar os efeitos visíveis.

Também simulará uma inserção concorrente entre a primeira e a segunda página.

A escolha OFFSET ou keyset depende da interface, volume, profundidade, mudanças concorrentes, índices e contrato da API.

O laboratório não modificará as tabelas principais de Ordem, Atividade, Cliente ou Produto.

Ao final, a tabela exclusiva será removida.

A próxima aula será dedicada à modelagem integrada de Ordem de Serviço, Cliente, Atividade, Produto e Pagamento. Portanto, esta aula não ampliará o modelo principal.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
294:
níveis de isolamento.

295:
locks e deadlocks.

296:
paginação SQL com offset, keyset e trade-offs.

297:
modelagem de Ordem, Cliente, Atividade, Produto e Pagamento.

298:
consultas e relatórios de backend.

299:
performance SQL aplicada.
```

As aulas anteriores fornecem a base necessária:

```text
ORDER BY:
define a sequência.

LIMIT:
limita a quantidade.

OFFSET:
descarta linhas anteriores.

índice B-tree:
pode fornecer caminho de acesso e ordenação.

EXPLAIN ANALYZE:
mede o plano.

isolamento:
define a visão entre transações.

locks:
coordenam alterações concorrentes.
```

Paginação não é apenas adicionar dois parâmetros à consulta.

Ela precisa garantir:

```text
ordem determinística;

limite seguro;

continuidade;

compatibilidade com filtros;

comportamento diante de inserções e remoções;

consulta alinhada ao índice;

contrato compreensível para a API.
```

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-296-paginacao-sql-offset-keyset-tradeoffs
```

Estrutura final:

```text
labs
└── m12
    └── aula-296-paginacao-sql-offset-keyset-tradeoffs
        ├── README.md
        ├── docs
        │   ├── contrato-cursor.md
        │   └── matriz-decisao.md
        └── sql
            ├── 00_preparar_ambiente.sql
            ├── 01_inspecionar_dados_e_indices.sql
            ├── 02_offset_paginas_iniciais.sql
            ├── 03_ordenacao_deterministica.sql
            ├── 04_offset_profundo_explain.sql
            ├── 05_keyset_primeira_e_proxima_pagina.sql
            ├── 06_keyset_com_filtro.sql
            ├── 07_insercao_concorrente_sessao_a.sql
            ├── 08_insercao_concorrente_sessao_b.sql
            ├── 09_pagina_anterior_keyset.sql
            ├── 10_total_contagem_e_metadados.sql
            ├── 11_indices_e_planos.sql
            ├── 12_armadilhas_controladas.sql
            ├── 13_exercicio.sql
            ├── 14_limpar_ambiente.sql
            └── 15_validacao_final.sql
```

O ambiente permanece:

```text
container:
formacao-postgres-m12

database:
formacao_java

schema:
app
```

Objeto exclusivo:

```text
app.ordem_paginacao_aula_296
```

Volume:

```text
100.000 registros base;
um registro temporário na simulação concorrente.
```

Índices exclusivos:

```text
idx_ordem_pag_criado_id_desc;

idx_ordem_pag_status_criado_id_desc.
```

Regras:

- execute a preparação uma única vez;
- use limite pequeno nas páginas exibidas;
- execute a simulação concorrente na ordem indicada;
- remova o registro concorrente depois da análise;
- execute a limpeza somente ao concluir o exercício;
- não altere o dataset principal.

---

## Conceito essencial

### O que e paginacao

Paginação divide um conjunto ordenado em partes.

Sem ordenação, a ideia de:

```text
primeira página;

segunda página;

próximo item
```

não possui significado estável.

Uma consulta como:

```sql
SELECT *
FROM app.ordem_paginacao_aula_296
LIMIT 20;
```

pode retornar vinte linhas, mas não cria contrato de sequência.

O PostgreSQL pode usar caminhos diferentes entre execuções.

A primeira regra é:

```text
toda paginação precisa de ORDER BY explícito.
```

---

### Ordem deterministica

Considere:

```sql
ORDER BY criado_em DESC
```

Se várias linhas possuem o mesmo `criado_em`, a ordem entre elas não está definida pelo contrato.

O banco pode devolver:

```text
A antes de B;
B antes de A.
```

Para criar ordem total:

```sql
ORDER BY
    criado_em DESC,
    id DESC
```

`id` atua como desempate único.

Assim, qualquer par de linhas possui posição determinada.

Regra:

```text
a última chave do ORDER BY deve tornar a ordenação única.
```

Não precisa ser sempre `id`, mas precisa existir um desempate confiável.

---

### LIMIT

`LIMIT` define a quantidade máxima retornada. A API deve impor valor padrão, mínimo e máximo para proteger banco, memória, rede e serialização.

### OFFSET

Forma:

```sql
LIMIT 20
OFFSET 40
```

O banco precisa encontrar o conjunto ordenado e avançar até a posição solicitada.

Mesmo quando um índice fornece a ordem, as linhas anteriores precisam ser percorridas para chegar ao deslocamento.

Página profunda:

```sql
LIMIT 20
OFFSET 90000
```

não significa:

```text
vá diretamente à linha 90001 por posição física.
```

Significa:

```text
percorra e descarte 90000 resultados válidos;
depois entregue 20.
```

---

### Numero da pagina

Com página iniciada em zero:

```text
offset = page × size.
```

Com página iniciada em um:

```text
offset = (page - 1) × size.
```

O contrato da API deve declarar a convenção.

### Vantagens do OFFSET

OFFSET é simples, permite página arbitrária e combina com interfaces numeradas. É adequado quando volume e profundidade são moderados e mudanças concorrentes são aceitáveis.

### Custo de pagina profunda

Compare:

```sql
LIMIT 20 OFFSET 0;
```

com:

```sql
LIMIT 20 OFFSET 90000;
```

A segunda consulta pode percorrer muito mais entradas.

No plano, observe:

- tempo;
- buffers;
- linhas produzidas pelo nó interno;
- linhas descartadas pelo `Limit`;
- uso do índice;
- custo total.

Um índice alinhado à ordenação evita um sort completo, mas não elimina o deslocamento profundo.

---

### Instabilidade entre requisicoes

Em APIs, cada página normalmente é uma nova requisição e uma nova transação.

Cenário:

```text
Página 1:
itens 100 até 91.

novo item 101 é inserido no topo.

Página 2 com OFFSET 10:
começa novamente no item 91.
```

O item 91 aparece em duas páginas.

Se uma linha da primeira página for removida:

```text
Página 2 com OFFSET 10:
pode começar depois do item 90.
```

O cliente não recebe um item que deveria aparecer.

OFFSET conta posições no conjunto atual.

Quando o conjunto muda, as posições mudam.

---

### Isolamento e estabilidade

Uma navegação de API normalmente usa requisições e transações separadas. Manter `REPEATABLE READ` aberto durante toda a interação ocuparia conexão e criaria uma transação longa. A estratégia de paginação deve funcionar sem preservar o mesmo snapshot entre páginas.

### Keyset pagination

Keyset usa os valores da última linha entregue.

Primeira página:

```sql
SELECT
    id,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;
```

A última linha produz:

```text
criado_em = 2026-01-02 06:33:11-03;
id = 1099991.
```

Próxima página:

```sql
WHERE (criado_em, id)
    < (
        TIMESTAMPTZ '2026-01-02 06:33:11-03',
        1099991
    )
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;
```

Em ordem decrescente, “depois” significa valores menores que o cursor.

---

### Comparacao por linha

PostgreSQL permite:

```sql
(criado_em, id) < (:criado_em, :id)
```

A comparação é lexicográfica:

1. compara `criado_em`;
2. quando empata, compara `id`.

Ela corresponde ao:

```sql
ORDER BY
    criado_em DESC,
    id DESC
```

quando as duas chaves usam a mesma direção.

Forma equivalente explícita:

```sql
WHERE criado_em < :criado_em
   OR (
       criado_em = :criado_em
       AND id < :id
   )
```

A forma por linha é mais compacta.

---

### Direcao do operador

Ordem descendente:

```text
ORDER BY chave DESC;
próxima página usa <.
```

Ordem ascendente:

```text
ORDER BY chave ASC;
próxima página usa >.
```

---

### Cursor composto

Se a ordem usa:

```text
criado_em;
id.
```

o cursor precisa transportar:

```text
criado_em;
id.
```

Usar apenas `criado_em` falha quando existem empates.

Usar apenas `id` não representa a ordenação por data.

Regra:

```text
o cursor contém todas as chaves necessárias para continuar a ordem.
```

---

### Cursor opaco

A API pode devolver um token que represente versão, ordenação, filtros, `criado_em` e `id`. Codificação não é segurança: valide o conteúdo e use assinatura quando adulteração precisar ser impedida.

### Cursor e filtros

Considere:

```sql
WHERE status = 'ABERTA'
  AND (criado_em, id) < (:data, :id)
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;
```

O cursor pertence ao conjunto filtrado.

Se o cliente troca:

```text
status = ABERTA
```

por:

```text
status = CONCLUIDA
```

não deve reutilizar o mesmo cursor como se fosse equivalente.

O contrato precisa vincular:

- filtros;
- ordenação;
- direção;
- cursor.

---

### Colunas nulas

Comparações do cursor com `NULL` podem resultar em valor desconhecido. Prefira chaves `NOT NULL`, determinísticas e comparáveis. Quando isso não for possível, defina explicitamente `NULLS FIRST` ou `NULLS LAST` e uma expressão de continuidade compatível.

### Chave mutavel

Se a coluna de ordenação mudar, a linha pode atravessar o cursor e reaparecer ou ser omitida. Prefira chaves estáveis, como criação e ID, quando a navegação exigir continuidade previsível.

### Insercao antes do cursor

Uma nova linha mais recente não aparece nas páginas seguintes do cursor atual. Ela poderá aparecer quando a listagem for reiniciada. Esse comportamento evita deslocar itens já vistos.

### Remocao de linha

Se uma linha anterior ao cursor for removida, keyset continua pelas chaves conhecidas. Mesmo que a própria linha do cursor desapareça, seus valores ainda podem orientar a próxima consulta.

### Pagina anterior

Para voltar em ordem decrescente, procure valores maiores que o primeiro item da página atual:

```sql
WHERE (criado_em, id) > (:primeiro_criado_em, :primeiro_id)
ORDER BY
    criado_em ASC,
    id ASC
LIMIT 20;
```

Essa consulta encontra os itens anteriores, mas em ordem inversa.

Depois, reordene o pequeno resultado:

```sql
SELECT *
FROM (
    consulta_ascendente
) AS pagina_anterior
ORDER BY
    criado_em DESC,
    id DESC;
```

O cursor da página anterior precisa usar o primeiro item atual.

---

### Acesso aleatorio

OFFSET permite saltar diretamente para uma página numerada. Keyset navega naturalmente para a próxima ou anterior a partir de um cursor. Feeds e históricos favorecem keyset; catálogos numerados podem favorecer offset.

### Total exato

Respostas por página numerada costumam exigir `count(*)`, que pode custar tanto quanto a própria busca.

Keyset pode evitar essa contagem usando `limit + 1`: para uma página de 20, busque 21; entregue 20 e use a linha extra para definir `hasNext`.

### Contagem aproximada

Estimativas de catálogo podem estar desatualizadas e não representam filtros complexos. Nunca as apresente como total exato.

### Indice alinhado

Para:

```sql
WHERE status = 'ABERTA'
  AND (criado_em, id) < (:data, :id)
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;
```

índice candidato:

```sql
(status, criado_em DESC, id DESC)
```

A igualdade em `status` vem antes.

Depois, o índice continua pela mesma ordem usada no cursor.

Para listagem sem filtro:

```sql
(criado_em DESC, id DESC)
```

A aula 291 ensinou que a ordem das colunas importa.

A aula 292 permite validar o plano.

---

### Offset e indice

Índice alinhado também ajuda OFFSET a evitar ordenação completa.

Porém:

```text
índice resolve ordem;

OFFSET ainda percorre entradas anteriores.
```

Não confunda:

```text
consulta usa índice
```

com:

```text
custo não cresce com profundidade.
```

---

### Keyset e indice

Keyset transforma a continuidade em uma condição de faixa:

```text
chaves menores que o cursor;
```

B-tree é adequada para:

- igualdade;
- faixa;
- ordem.

O banco pode posicionar o caminho próximo ao cursor e retornar o limite solicitado.

Isso reduz trabalho em páginas profundas, desde que a consulta e o índice estejam alinhados.

---

### Ordenacoes dinamicas

Cada ordenação permitida precisa de definição determinística, cursor compatível e índice candidato. Se a API aceita diferentes campos, selecione-os por uma whitelist; um cursor não serve automaticamente para outra ordenação.

### Seguranca de parametros

Valores do cursor devem ser parâmetros. Colunas e direções do `ORDER BY` precisam vir de opções seguras da aplicação, nunca de texto livre concatenado.

### Quando usar OFFSET

Use OFFSET para volumes moderados, poucas páginas profundas, navegação numerada e necessidade de acesso aleatório.

### Quando usar keyset

Use keyset para feeds, históricos e navegação sequencial em grande volume, especialmente com inserções frequentes e índice alinhado.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-296-paginacao-sql-offset-keyset-tradeoffs\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-296-paginacao-sql-offset-keyset-tradeoffs\docs"

Set-Location `
  "labs\m12\aula-296-paginacao-sql-offset-keyset-tradeoffs"
```

Confirme:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

---

### 2. Criar 00_preparar_ambiente.sql

Crie:

```text
sql/00_preparar_ambiente.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS app.ordem_paginacao_aula_296;

CREATE TABLE app.ordem_paginacao_aula_296 (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    prioridade integer NOT NULL,
    criado_em timestamptz NOT NULL,
    valor numeric(12, 2) NOT NULL,

    CONSTRAINT ck_ordem_pag_status
        CHECK (
            status IN (
                'ABERTA',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_ordem_pag_prioridade
        CHECK (
            prioridade BETWEEN 1 AND 5
        ),

    CONSTRAINT ck_ordem_pag_valor
        CHECK (
            valor >= 0
        )
);

INSERT INTO app.ordem_paginacao_aula_296 (
    id,
    codigo,
    cliente_id,
    status,
    prioridade,
    criado_em,
    valor
)
SELECT
    1000000 + g AS id,
    'OS-PAG-' || lpad(
        g::text,
        6,
        '0'
    ) AS codigo,
    (g % 1000) + 1 AS cliente_id,
    CASE
        WHEN g % 10 = 0 THEN 'CANCELADA'
        WHEN g % 3 = 0 THEN 'CONCLUIDA'
        ELSE 'ABERTA'
    END AS status,
    (g % 5) + 1 AS prioridade,
    TIMESTAMPTZ '2026-01-01 00:00:00-03'
        + g * INTERVAL '1 second' AS criado_em,
    (100 + (g % 5000))::numeric(12, 2) AS valor
FROM generate_series(
    1,
    100000
) AS serie(g);

CREATE INDEX idx_ordem_pag_criado_id_desc
ON app.ordem_paginacao_aula_296 (
    criado_em DESC,
    id DESC
);

CREATE INDEX idx_ordem_pag_status_criado_id_desc
ON app.ordem_paginacao_aula_296 (
    status,
    criado_em DESC,
    id DESC
);

VACUUM ANALYZE app.ordem_paginacao_aula_296;
```

Execute:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-296-paginacao-sql-offset-keyset-tradeoffs\sql\00_preparar_ambiente.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

### 3. Criar 01_inspecionar_dados_e_indices.sql

Crie:

```text
sql/01_inspecionar_dados_e_indices.sql
```

Conteúdo:

```sql
SELECT
    count(*) AS quantidade
FROM app.ordem_paginacao_aula_296;

SELECT
    min(id) AS menor_id,
    max(id) AS maior_id,
    min(criado_em) AS primeiro_instante,
    max(criado_em) AS ultimo_instante
FROM app.ordem_paginacao_aula_296;

SELECT
    status,
    count(*) AS quantidade
FROM app.ordem_paginacao_aula_296
GROUP BY status
ORDER BY status;

SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'app'
  AND tablename = 'ordem_paginacao_aula_296'
ORDER BY indexname;
```

Confirme:

```text
100000 registros;

id máximo 1100000;

dois índices manuais;

primary key e unique de código.
```

---

### 4. Criar 02_offset_paginas_iniciais.sql

Crie:

```text
sql/02_offset_paginas_iniciais.sql
```

Conteúdo:

```sql
-- Página 1, numeração iniciada em zero.
SELECT
    id,
    codigo,
    status,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10
OFFSET 0;

-- Página 2.
SELECT
    id,
    codigo,
    status,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10
OFFSET 10;

-- Página 3.
SELECT
    id,
    codigo,
    status,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10
OFFSET 20;
```

Valide:

```text
página 1:
1100000 até 1099991.

página 2:
1099990 até 1099981.

página 3:
1099980 até 1099971.
```

---

### 5. Criar 03_ordenacao_deterministica.sql

Crie:

```text
sql/03_ordenacao_deterministica.sql
```

Conteúdo:

```sql
SELECT
    prioridade,
    count(*) AS quantidade
FROM app.ordem_paginacao_aula_296
GROUP BY prioridade
ORDER BY prioridade DESC;

-- Ordenação incompleta:
SELECT
    id,
    prioridade
FROM app.ordem_paginacao_aula_296
ORDER BY prioridade DESC
LIMIT 20;

-- Ordenação total:
SELECT
    id,
    prioridade
FROM app.ordem_paginacao_aula_296
ORDER BY
    prioridade DESC,
    id DESC
LIMIT 20;
```

A primeira consulta paginada não define a ordem entre milhares de linhas com a mesma prioridade.

A segunda usa `id` como desempate.

---

### 6. Criar 04_offset_profundo_explain.sql

Crie:

```text
sql/04_offset_profundo_explain.sql
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
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20
OFFSET 0;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    codigo,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20
OFFSET 90000;
```

Compare:

- linhas percorridas;
- buffers;
- tempo;
- custo;
- nó de índice;
- trabalho descartado antes do limite.

Execute mais de uma vez e registre a variação de cache.

---

### 7. Criar 05_keyset_primeira_e_proxima_pagina.sql

Crie:

```text
sql/05_keyset_primeira_e_proxima_pagina.sql
```

Conteúdo:

```sql
-- Primeira página.
SELECT
    id,
    codigo,
    status,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10;

-- Próxima página usando a última linha:
-- id = 1099991.
WITH cursor_atual AS (
    SELECT
        criado_em,
        id
    FROM app.ordem_paginacao_aula_296
    WHERE id = 1099991
)
SELECT
    ordem.id,
    ordem.codigo,
    ordem.status,
    ordem.criado_em
FROM app.ordem_paginacao_aula_296 AS ordem
CROSS JOIN cursor_atual AS cursor
WHERE (
    ordem.criado_em,
    ordem.id
) < (
    cursor.criado_em,
    cursor.id
)
ORDER BY
    ordem.criado_em DESC,
    ordem.id DESC
LIMIT 10;

-- Terceira página usando o último item da segunda:
-- id = 1099981.
WITH cursor_atual AS (
    SELECT
        criado_em,
        id
    FROM app.ordem_paginacao_aula_296
    WHERE id = 1099981
)
SELECT
    ordem.id,
    ordem.codigo,
    ordem.status,
    ordem.criado_em
FROM app.ordem_paginacao_aula_296 AS ordem
CROSS JOIN cursor_atual AS cursor
WHERE (
    ordem.criado_em,
    ordem.id
) < (
    cursor.criado_em,
    cursor.id
)
ORDER BY
    ordem.criado_em DESC,
    ordem.id DESC
LIMIT 10;
```

Os resultados devem corresponder às páginas iniciais por offset enquanto o conjunto não muda.

---

### 8. Criar 06_keyset_com_filtro.sql

Crie:

```text
sql/06_keyset_com_filtro.sql
```

Conteúdo:

```sql
-- Primeira página de Ordens ABERTAS.
SELECT
    id,
    codigo,
    status,
    criado_em
FROM app.ordem_paginacao_aula_296
WHERE status = 'ABERTA'
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10;

-- Próxima página derivando o cursor da décima linha.
WITH primeira_pagina AS (
    SELECT
        id,
        criado_em
    FROM app.ordem_paginacao_aula_296
    WHERE status = 'ABERTA'
    ORDER BY
        criado_em DESC,
        id DESC
    LIMIT 10
),
cursor_atual AS (
    SELECT
        id,
        criado_em
    FROM primeira_pagina
    ORDER BY
        criado_em ASC,
        id ASC
    LIMIT 1
)
SELECT
    ordem.id,
    ordem.codigo,
    ordem.status,
    ordem.criado_em
FROM app.ordem_paginacao_aula_296 AS ordem
CROSS JOIN cursor_atual AS cursor
WHERE ordem.status = 'ABERTA'
  AND (
      ordem.criado_em,
      ordem.id
  ) < (
      cursor.criado_em,
      cursor.id
  )
ORDER BY
    ordem.criado_em DESC,
    ordem.id DESC
LIMIT 10;
```

O índice candidato começa por `status` e continua pelas chaves do cursor.

---

### 9. Criar 07_insercao_concorrente_sessao_a.sql

Crie:

```text
sql/07_insercao_concorrente_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1: execute antes da inserção concorrente.
SELECT
    id,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10
OFFSET 0;

-- Último item esperado:
-- id = 1099991.
--
-- PARE e execute a Sessão B.

-- PASSO A2: página 2 por OFFSET depois da inserção.
SELECT
    id,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10
OFFSET 10;

-- O item 1099991 reaparece.

-- PASSO A3: página 2 por keyset usando o cursor anterior.
WITH cursor_anterior AS (
    SELECT
        criado_em,
        id
    FROM app.ordem_paginacao_aula_296
    WHERE id = 1099991
)
SELECT
    ordem.id,
    ordem.criado_em
FROM app.ordem_paginacao_aula_296 AS ordem
CROSS JOIN cursor_anterior AS cursor
WHERE (
    ordem.criado_em,
    ordem.id
) < (
    cursor.criado_em,
    cursor.id
)
ORDER BY
    ordem.criado_em DESC,
    ordem.id DESC
LIMIT 10;

-- O resultado continua em 1099990.
```

Execute A1 em uma sessão.

Depois execute B.

Volte para A2 e A3.

---

### 10. Criar 08_insercao_concorrente_sessao_b.sql

Crie:

```text
sql/08_insercao_concorrente_sessao_b.sql
```

Conteúdo:

```sql
INSERT INTO app.ordem_paginacao_aula_296 (
    id,
    codigo,
    cliente_id,
    status,
    prioridade,
    criado_em,
    valor
)
VALUES (
    1900001,
    'OS-PAG-CONCORRENTE',
    1,
    'ABERTA',
    5,
    TIMESTAMPTZ '2026-12-31 23:59:59-03',
    999.00
);

SELECT
    id,
    codigo,
    criado_em
FROM app.ordem_paginacao_aula_296
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 3;
```

A nova linha ocupa o topo.

Depois de comparar A2 e A3, remova:

```sql
DELETE FROM app.ordem_paginacao_aula_296
WHERE id = 1900001;
```

Confirme que a contagem volta a `100000`.

---

### 11. Criar 09_pagina_anterior_keyset.sql

Crie:

```text
sql/09_pagina_anterior_keyset.sql
```

Conteúdo:

```sql
-- Considere uma página iniciada em id 1099980.
-- O primeiro item da página atual é o cursor para voltar.
WITH cursor_atual AS (
    SELECT
        criado_em,
        id
    FROM app.ordem_paginacao_aula_296
    WHERE id = 1099980
),
pagina_anterior_invertida AS (
    SELECT
        ordem.id,
        ordem.codigo,
        ordem.criado_em
    FROM app.ordem_paginacao_aula_296 AS ordem
    CROSS JOIN cursor_atual AS cursor
    WHERE (
        ordem.criado_em,
        ordem.id
    ) > (
        cursor.criado_em,
        cursor.id
    )
    ORDER BY
        ordem.criado_em ASC,
        ordem.id ASC
    LIMIT 10
)
SELECT
    id,
    codigo,
    criado_em
FROM pagina_anterior_invertida
ORDER BY
    criado_em DESC,
    id DESC;
```

A consulta interna busca em direção inversa.

A externa devolve a ordem visual original.

---

### 12. Criar 10_total_contagem_e_metadados.sql

Crie:

```text
sql/10_total_contagem_e_metadados.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT count(*)
FROM app.ordem_paginacao_aula_296;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT count(*)
FROM app.ordem_paginacao_aula_296
WHERE status = 'ABERTA';

-- Estratégia LIMIT + 1 para página de tamanho 10.
WITH candidatos AS (
    SELECT
        id,
        codigo,
        criado_em
    FROM app.ordem_paginacao_aula_296
    ORDER BY
        criado_em DESC,
        id DESC
    LIMIT 11
)
SELECT
    id,
    codigo,
    criado_em
FROM candidatos
ORDER BY
    criado_em DESC,
    id DESC;

SELECT
    count(*) > 10 AS has_next
FROM (
    SELECT id
    FROM app.ordem_paginacao_aula_296
    ORDER BY
        criado_em DESC,
        id DESC
    LIMIT 11
) AS candidatos;
```

Na aplicação:

```text
solicite size + 1;

remova o item extra;

hasNext = item extra existe.
```

---

### 13. Criar 11_indices_e_planos.sql

Crie:

```text
sql/11_indices_e_planos.sql
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
    criado_em
FROM app.ordem_paginacao_aula_296
WHERE (
    criado_em,
    id
) < (
    TIMESTAMPTZ '2026-01-02 06:33:11-03',
    1099991
)
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    status,
    criado_em
FROM app.ordem_paginacao_aula_296
WHERE status = 'ABERTA'
  AND (
      criado_em,
      id
  ) < (
      TIMESTAMPTZ '2026-01-02 06:33:11-03',
      1099991
  )
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;

SELECT
    indexname,
    indexdef,
    pg_size_pretty(
        pg_relation_size(
            (
                quote_ident(schemaname)
                || '.'
                || quote_ident(indexname)
            )::regclass
        )
    ) AS tamanho
FROM pg_indexes
WHERE schemaname = 'app'
  AND tablename = 'ordem_paginacao_aula_296'
ORDER BY indexname;
```

Confirme:

- condição de índice;
- ausência ou presença de `Sort`;
- linhas reais;
- buffers;
- índice escolhido;
- custo dos índices em espaço.

---

### 14. Criar 12_armadilhas_controladas.sql

Crie:

```text
sql/12_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Armadilha 1: paginação sem ORDER BY.
SELECT
    id,
    codigo
FROM app.ordem_paginacao_aula_296
LIMIT 10
OFFSET 10;

-- Armadilha 2: ordenação não única.
SELECT
    id,
    prioridade
FROM app.ordem_paginacao_aula_296
ORDER BY prioridade DESC
LIMIT 10
OFFSET 10;

-- Armadilha 3: cursor incompleto, sem ID para desempate.
SELECT
    id,
    criado_em
FROM app.ordem_paginacao_aula_296
WHERE criado_em
    < TIMESTAMPTZ '2026-01-02 06:33:11-03'
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 10;

-- Armadilha 4: OFFSET negativo.
-- Não execute:
-- SELECT *
-- FROM app.ordem_paginacao_aula_296
-- LIMIT 10
-- OFFSET -1;

-- Armadilha 5: limite sem política.
-- Não execute em API sem validação:
-- SELECT *
-- FROM app.ordem_paginacao_aula_296
-- LIMIT 1000000;
```

Explique por que consultas sintaticamente válidas podem possuir contrato ruim.

---

### 15. Criar docs/contrato-cursor.md

Crie:

```text
docs/contrato-cursor.md
```

Conteúdo sugerido:

```markdown
# Contrato de cursor da aula 296

**Versão**

`v1`

**Ordenação**

`criado_em DESC, id DESC`

**Filtros vinculados**

- status;
- cliente_id;
- intervalo de criação.

**Valores de continuidade**

- `criado_em`;
- `id`.

**Direções**

- próxima página: operador `<`;
- página anterior: operador `>` com busca invertida.

**Validações**

- cursor pertence à versão suportada;
- campos obrigatórios estão presentes;
- data possui formato válido;
- ID é positivo;
- filtro da requisição coincide com o filtro do cursor;
- tamanho da página respeita o máximo.

**Resposta**

- itens;
- próximo cursor;
- cursor anterior, quando suportado;
- `hasNext`;
- tamanho solicitado;
- ordenação aplicada.

**Segurança**

O token codificado não é automaticamente confiável. Assinar quando adulteração precisar ser impedida.
```

---

### 16. Criar docs/matriz-decisao.md

Crie:

```text
docs/matriz-decisao.md
```

Conteúdo:

```markdown
# Matriz de decisão

| Critério | OFFSET | Keyset |
|---|---|---|
| Implementação inicial | Simples | Moderada |
| Página arbitrária | Natural | Não natural |
| Página profunda | Custo crescente | Custo mais estável |
| Inserção no topo | Pode duplicar | Continua após cursor |
| Remoção anterior | Pode pular | Continua após cursor |
| Total exato | Comum | Opcional |
| Rolagem infinita | Possível | Muito adequada |
| Ordenação única | Necessária | Obrigatória |
| Índice alinhado | Importante | Essencial |
| Cursor de API | Não precisa | Precisa |
| Filtros dinâmicos | Simples | Cursor deve vinculá-los |
| Chave mutável | Afeta posições | Pode mover item entre regiões |

**Decisão**

- OFFSET para páginas pequenas, numeradas e acesso aleatório.
- Keyset para feeds, históricos e navegação sequencial em volume alto.
- Medir planos e documentar o comportamento concorrente.
```

---

### 17. Criar 13_exercicio.sql

Crie:

```text
sql/13_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Não crie novos índices sem justificar.

Remova qualquer objeto experimental antes da limpeza.

---

### 18. Criar 14_limpar_ambiente.sql

Crie:

```text
sql/14_limpar_ambiente.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS app.ordem_paginacao_aula_296;
```

Execute somente depois do exercício e do checkpoint.

---

### 19. Criar 15_validacao_final.sql

Crie:

```text
sql/15_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    to_regclass(
        'app.ordem_paginacao_aula_296'
    ) AS tabela_paginacao;

SELECT
    (SELECT count(*) FROM app.ordem_servico)
        AS ordens_principais,
    (SELECT count(*) FROM app.atividade)
        AS atividades_principais,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
    ) AS eventos_principais;

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
```

Resultado esperado:

```text
tabela exclusiva removida;

dataset principal preservado;

seis índices anteriores preservados.
```

---

## Entendendo o que foi feito

### OFFSET dividiu por posicao

As páginas iniciais foram simples; a página profunda percorreu muitas entradas anteriores.

### Ordem total impediu empates

`criado_em` definiu a ordem principal e `id` garantiu desempate único.

### Keyset continuou pela chave

A próxima página procurou chaves menores que o cursor, sem contar todas as linhas anteriores.

### Insercao concorrente deslocou OFFSET

A nova linha entrou no topo e fez um item reaparecer na página 2 por offset. Keyset continuou corretamente.

### Indices acompanharam a consulta

A listagem geral usou data e ID; a filtrada usou status antes das chaves de continuidade.

### Total foi separado da pagina

`count(*)` respondeu o total; `limit + 1` respondeu somente se havia próxima página.

## Erros comuns importantes

### Paginar sem ORDER BY

Não existe sequência contratual.

Adicione ordenação explícita.

---

### Ordenar sem desempate

Linhas empatadas podem trocar de posição.

Inclua chave única no final.

---

### Usar OFFSET profundo em feed grande

O banco descarta muitas linhas.

Avalie keyset e índice alinhado.

---

### Reutilizar cursor com outro filtro

O cursor pertence a outro conjunto.

Reinicie a paginação.

---

### Usar coluna mutavel como unica chave

A linha pode mudar de posição durante a navegação.

Escolha chave estável ou documente o comportamento.

---

## Comandos uteis

### OFFSET

```sql
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20
OFFSET 40;
```

### Keyset descendente

```sql
WHERE (criado_em, id) < ($1, $2)
ORDER BY
    criado_em DESC,
    id DESC
LIMIT 20;
```

### Keyset ascendente

```sql
WHERE (criado_em, id) > ($1, $2)
ORDER BY
    criado_em ASC,
    id ASC
LIMIT 20;
```

### Has next

```sql
LIMIT tamanho_da_pagina + 1;
```

---

## Exercicio guiado

No arquivo:

```text
sql/13_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Offset numerado

Implemente páginas:

```text
0;
1;
10;
100;
1000;
9000.
```

Use tamanho `10`.

Para cada uma, registre:

- offset;
- primeiro ID;
- último ID;
- tempo;
- buffers;
- plano.

---

### Parte 2 - Keyset equivalente

Selecione uma página profunda por offset.

Pegue o último item da página anterior.

Busque a mesma página por keyset.

Compare:

- itens;
- tempo;
- buffers;
- linhas percorridas;
- índice.

---

### Parte 3 - Filtro por status

Implemente paginação de:

```text
status = CONCLUIDA.
```

Use:

```text
status;
criado_em;
id.
```

Confirme que o cursor contém as duas chaves de ordenação e está vinculado ao filtro.

---

### Parte 4 - Ordenacao por prioridade

Crie ordenação:

```text
prioridade DESC;
criado_em DESC;
id DESC.
```

Descreva o índice candidato.

Não crie automaticamente.

Explique por que cursor com apenas `prioridade` é insuficiente.

---

### Parte 5 - Insercao concorrente

Repita o cenário com tamanho de página `20`.

Registre:

- último item da primeira página;
- novo item inserido;
- primeiro item da página 2 por offset;
- primeiro item por keyset;
- duplicidade encontrada.

Remova o item concorrente.

---

### Parte 6 - Remocao concorrente

Leia a primeira página.

Remova temporariamente o primeiro item dentro de uma transação confirmada.

Compare página 2 por offset e keyset.

Restaure a linha com os mesmos valores.

Registre qual item foi pulado pelo offset.

Use somente a tabela exclusiva.

---

### Parte 7 - Pagina anterior

Implemente retorno à página anterior usando:

```text
primeiro item da página atual;

operador inverso;

ordem interna ascendente;

ordem externa descendente.
```

Confirme que a sequência coincide com a página anterior original.

---

### Parte 8 - Total e hasNext

Compare:

```text
count(*) exato;

limit + 1.
```

Explique qual pergunta cada estratégia responde.

---

### Parte 9 - Contrato de API

Desenhe duas respostas.

OFFSET:

```text
items;
page;
size;
totalElements;
totalPages;
sort.
```

Keyset:

```text
items;
nextCursor;
previousCursor;
hasNext;
size;
sort.
```

Documente erros para:

- tamanho inválido;
- cursor malformado;
- cursor de outro filtro;
- ordenação não suportada.

---

### Parte 10 - Escolha arquitetural

Classifique:

1. feed de eventos;
2. catálogo administrativo pequeno;
3. exportação estável;
4. histórico de pagamentos;
5. busca com página numerada;
6. fila operacional em atualização constante.

Para cada um, escolha:

```text
OFFSET;

keyset;

snapshot/exportação;

ou combinação.
```

Justifique.

---

## Criterios de aceite

- o laboratório oficial da aula 296 existe;
- o arquivo e o H1 seguem a grade;
- a tabela exclusiva possui cem mil registros;
- índices exclusivos foram criados;
- paginação sem ordenação foi reconhecida como inválida;
- ordenação determinística foi implementada;
- `LIMIT` e `OFFSET` foram praticados;
- conversão entre página e offset foi compreendida;
- página profunda foi medida com `EXPLAIN ANALYZE`;
- custo de descarte do offset foi compreendido;
- keyset foi implementado;
- comparação composta por linha foi usada;
- direção do operador foi relacionada à ordenação;
- cursor contém todas as chaves;
- cursor foi vinculado ao filtro;
- colunas nulas foram discutidas;
- chave mutável foi analisada;
- inserção concorrente produziu duplicidade no offset;
- keyset continuou depois do cursor;
- página anterior foi implementada;
- total exato foi diferenciado de `hasNext`;
- estratégia `limit + 1` foi praticada;
- índice foi alinhado à ordenação;
- filtros e ordenações foram tratados por whitelist conceitual;
- OFFSET não foi descartado como solução válida;
- keyset não foi tratado como solução universal;
- a tabela exclusiva foi removida;
- dataset principal e índices anteriores foram preservados;
- modelagem da aula 297 não foi antecipada;
- o exercício foi concluído;
- README e documentos estão prontos;
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
  labs/m12/aula-296-paginacao-sql-offset-keyset-tradeoffs
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): comparar paginacao offset e keyset"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
LIMIT;
OFFSET;
keyset;
cursores;
ordenação determinística;
concorrência;
índices;
trade-offs.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você implementou duas estratégias de paginação.

Aprendeu:

```text
LIMIT;
OFFSET;
página profunda;
ordem determinística;
desempate;
keyset pagination;
seek method;
cursor composto;
comparação por linha;
página anterior;
limit + 1;
total exato;
estabilidade concorrente;
índice alinhado.
```

As regras principais foram:

```text
paginação exige ORDER BY;

ordem precisa ser total;

OFFSET conta posições do conjunto atual;

offset profundo percorre e descarta linhas;

inserções e remoções podem deslocar páginas;

keyset continua depois de chaves conhecidas;

cursor deve reproduzir ORDER BY e filtros;

ordem DESC normalmente usa operador menor para avançar;

chaves nulas e mutáveis exigem política;

página anterior inverte comparação e ordem interna;

count(*) e hasNext respondem perguntas diferentes;

OFFSET e keyset atendem experiências distintas.
```

A próxima aula será:

```text
297 - M12.27 - Modelagem OS cliente atividade produto e pagamento
```

Nela, você vai integrar conceitos do módulo em um modelo de domínio mais completo:

- Cliente;
- Produto;
- Ordem de Serviço;
- Atividade;
- Pagamento;
- cardinalidades;
- obrigatoriedade;
- chaves;
- constraints;
- estados;
- histórico;
- valores;
- integridade referencial;
- decisões de normalização;
- modelo conceitual, lógico e físico.

A paginação voltará a ser aplicada depois, quando o modelo produzir consultas reais de backend.

---

# Material complementar

## Checkpoint final

- [ ] Comparei páginas iniciais e profundas com OFFSET.
- [ ] Implementei keyset com cursor composto.
- [ ] Demonstrei alteração concorrente entre páginas.
- [ ] Limpei a tabela exclusiva e fiz o commit.

---

## Troubleshooting adicional

### Keyset repete a ultima linha

O operador usou `<=` em vez de `<`.

Use comparação estrita.

### Linhas empatadas desaparecem

O cursor não inclui a chave de desempate.

Inclua o ID.

### Plano usa Sort

O índice não corresponde à ordenação, o filtro muda o prefixo ou o planejador escolheu outro caminho.

Leia o plano.

### Pagina anterior volta invertida

A busca interna foi ascendente e o resultado não foi reordenado externamente.

Aplique a ordem visual final.

### Contagem demora mais que a pagina

A consulta de total percorre muito mais linhas.

Reavalie se total exato é requisito.

---

## Perguntas de revisao

1. O que é paginação?
2. Por que `ORDER BY` é obrigatório?
3. O que é ordem determinística?
4. Por que adicionar `id`?
5. O que `OFFSET` faz?
6. Por que página profunda custa mais?
7. Como uma inserção causa duplicidade?
8. Como uma remoção causa ausência?
9. O que é keyset?
10. O que contém o cursor?
11. Qual operador avança em ordem descendente?
12. Por que usar comparação estrita?
13. Como voltar à página anterior?
14. O que acontece com inserção antes do cursor?
15. Qual o risco de chave mutável?
16. Para que serve `limit + 1`?
17. Por que `count(*)` pode ser caro?
18. Qual índice combina com filtro por status?
19. Quando OFFSET é adequado?
20. Quando keyset é adequado?

---

## Roteiro de resposta

1. Dividir conjunto ordenado em partes.
2. Sem ele não existe sequência contratual.
3. Toda linha possui posição definida.
4. Para desempatar.
5. Descarta resultados anteriores.
6. Precisa percorrer mais entradas.
7. Desloca as posições.
8. Fecha posições e pode pular item.
9. Continuação por valores da última chave.
10. Chaves do ORDER BY e contexto.
11. `<`.
12. Para não repetir o cursor.
13. Operador inverso, ordem inversa e reordenação final.
14. Ela não aparece na continuação atual.
15. O item pode mudar de região.
16. Detectar próxima página sem contar tudo.
17. Precisa percorrer o conjunto filtrado.
18. `(status, criado_em DESC, id DESC)`.
19. Volume moderado e página arbitrária.
20. Navegação sequencial em grande volume.

---

## Desafio opcional

Projete paginação para eventos de auditoria com:

```text
cliente;
tipo de evento;
período;
ocorrido_em DESC;
id DESC.
```

Documente:

- consulta OFFSET;
- consulta keyset;
- cursor;
- índice composto;
- tamanho máximo;
- `hasNext`;
- página anterior;
- comportamento com novo evento;
- comportamento com correção de timestamp;
- política de expiração do cursor;
- resposta da API.

Não altere o modelo principal nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 296 - M12.26 - Paginacao SQL offset keyset e tradeoffs

- Aprofundei paginação com `LIMIT` e `OFFSET`.
- Entendi que toda paginação exige ordenação explícita.
- Usei `id` como desempate para criar ordem total.
- Converti número de página em deslocamento.
- Medi o custo de offsets iniciais e profundos.
- Entendi que OFFSET percorre e descarta linhas anteriores.
- Implementei keyset pagination com cursor composto.
- Usei comparação por linha em `(criado_em, id)`.
- Relacionei a direção do operador à direção do `ORDER BY`.
- Vinculei cursor, filtros e ordenação.
- Analisei colunas nulas e chaves mutáveis.
- Demonstrei duplicidade por inserção concorrente no OFFSET.
- Confirmei que keyset continua depois do cursor anterior.
- Implementei navegação para a página anterior.
- Diferenciei total exato de `hasNext`.
- Usei a estratégia `limit + 1`.
- Relacionei índices B-tree às chaves de paginação.
- Documentei quando usar OFFSET e quando usar keyset.
- Removi a tabela exclusiva do laboratório.
- Próxima aula: modelagem de Ordem, Cliente, Atividade, Produto e Pagamento.
```

---

## Referencia tecnica curta

```text
OFFSET:
navegação por posição.

Keyset:
navegação por chave.

Ordem total:
chave principal + desempate único.

DESC:
próxima página normalmente usa <.

ASC:
próxima página normalmente usa >.

Cursor:
valores do ORDER BY e contexto.

Página anterior:
comparação inversa e reordenação.

Has next:
buscar size + 1.

Índice:
mesmos filtros e mesma ordem.
```

Regra final:

```text
escolha a paginacao pela experiencia, pelo volume e pela estabilidade necessaria, sempre com ordem deterministica e indice coerente.
```
