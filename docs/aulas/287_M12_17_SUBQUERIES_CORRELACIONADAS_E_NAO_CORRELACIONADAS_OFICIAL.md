# 287 - M12.17 - Subqueries correlacionadas e nao correlacionadas

## Apresentacao da aula

Na aula 286, você resumiu conjuntos de linhas com:

```text
COUNT;
SUM;
AVG;
MIN;
MAX;
GROUP BY;
HAVING.
```

Esses recursos permitiram responder perguntas como:

```text
quantas atividades existem por ordem?

qual é o total de mão de obra?

quais competências participam de mais associações?

quais grupos ultrapassam determinado limite?
```

Agora surge uma nova necessidade:

```text
usar o resultado de uma consulta dentro de outra consulta.
```

Esse recurso é chamado de subquery.

Exemplos de perguntas que podem ser resolvidas com subqueries:

```text
quais atividades possuem valor acima da média geral?

quais ordens possuem pelo menos uma atividade?

quais competências ainda não foram associadas?

qual é a quantidade de atividades de cada ordem?

quais atividades estão acima da média da própria ordem?

quais clientes possuem telefones confirmados?

quais produtos aparecem em alguma ordem?
```

Nesta aula, você vai estudar dois grupos principais:

```text
subqueries não correlacionadas;

subqueries correlacionadas.
```

Uma subquery não correlacionada pode ser entendida e executada sem depender da linha atual da consulta externa.

Uma subquery correlacionada referencia colunas da consulta externa. Sua lógica é reavaliada para o contexto de cada linha externa, embora o otimizador do PostgreSQL possa transformar internamente o plano.

Você também vai usar subqueries em diferentes posições:

```text
WHERE;
SELECT;
FROM.
```

E com diferentes operadores:

```text
=;
>;
IN;
EXISTS;
NOT EXISTS.
```

Subqueries não substituem joins automaticamente. A escolha deve considerar intenção, forma do resultado, cardinalidade, `NULL`, clareza, manutenção e plano de execução.

O laboratório será somente leitura e não usará `WITH`. Ao final, você deverá dominar as principais formas de subquery e diagnosticar sua cardinalidade.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
285:
relacionamento muitos para muitos.

286:
GROUP BY, HAVING e agregações.

287:
subqueries correlacionadas e não correlacionadas.

288:
CTE common table expressions.

289:
views e materialized views.

290:
funções de data, texto, número e CASE.
```

Até aqui, você trabalhou com consultas em uma única camada principal.

Agora uma consulta poderá fornecer:

- um valor;
- uma lista;
- um teste de existência;
- uma tabela derivada;
- um cálculo relacionado à linha externa.

A progressão será:

```text
consulta simples;
join;
agregação;
subquery;
CTE;
view.
```

Cada etapa amplia a capacidade de organizar consultas sem abandonar os fundamentos anteriores.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-287-subqueries-correlacionadas-nao-correlacionadas
```

Estrutura final:

```text
labs
└── m12
    └── aula-287-subqueries-correlacionadas-nao-correlacionadas
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_subquery_escalar.sql
            ├── 02_subquery_com_in.sql
            ├── 03_exists_not_exists.sql
            ├── 04_subquery_no_select.sql
            ├── 05_subquery_no_from.sql
            ├── 06_subquery_correlacionada.sql
            ├── 07_comparar_join_e_subquery.sql
            ├── 08_armadilhas_controladas.sql
            ├── 09_relatorios_com_subqueries.sql
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

Dataset esperado:

```text
3 clientes;
3 produtos;
4 ordens;
6 atividades;
4 eventos;
5 telefones;
4 competências;
6 associações.
```

O fluxo será confirmar o dataset, praticar as diferentes formas de subquery, comparar alternativas, executar erros controlados, construir relatórios, resolver o exercício e validar que nenhum dado foi alterado.

---

## Conceito essencial

### O que e uma subquery

Subquery é uma consulta inserida dentro de outra instrução SQL.

Exemplo:

```sql
SELECT
    id,
    codigo,
    valor_mao_obra
FROM app.atividade
WHERE valor_mao_obra > (
    SELECT avg(valor_mao_obra)
    FROM app.atividade
);
```

A consulta interna:

```sql
SELECT avg(valor_mao_obra)
FROM app.atividade
```

retorna a média.

A consulta externa compara cada atividade com esse valor.

Terminologia:

```text
consulta externa:
a instrução principal.

subquery:
a consulta interna.
```

---

### Forma do resultado

Antes de usar uma subquery, descubra qual forma ela retorna.

Possibilidades:

```text
uma linha e uma coluna;

várias linhas e uma coluna;

uma ou mais linhas com várias colunas;

nenhuma linha.
```

O operador ao redor precisa ser compatível.

Exemplo:

```text
=:
espera um único valor.

IN:
aceita uma coleção de valores.

EXISTS:
verifica se existe pelo menos uma linha.

FROM:
aceita uma tabela derivada.
```

Muitos erros de subquery acontecem porque a forma esperada não foi definida.

---

### Subquery escalar

Uma subquery escalar deve retornar:

```text
no máximo uma linha;
exatamente uma coluna.
```

Exemplo:

```sql
SELECT
    id,
    codigo
FROM app.atividade
WHERE valor_mao_obra > (
    SELECT avg(valor_mao_obra)
    FROM app.atividade
);
```

`AVG` sem `GROUP BY` produz uma linha e uma coluna.

Por isso, a subquery pode ser usada com `>`.

---

### Subquery escalar sem linha

Quando não há linha, o valor escalar resultante é `NULL`. Comparações precisam considerar esse comportamento.

### Subquery escalar com varias linhas

Considere:

```sql
SELECT
    id,
    codigo
FROM app.atividade
WHERE ordem_servico_id = (
    SELECT id
    FROM app.ordem_servico
);
```

A subquery retorna várias ordens.

O operador `=` espera um valor.

PostgreSQL rejeita a instrução porque mais de uma linha foi retornada.

Possíveis correções:

- tornar o filtro interno único;
- usar agregação quando a regra pede um único valor;
- usar `IN` quando vários valores são válidos;
- revisar a pergunta;
- usar `EXISTS`;
- usar join.

Não aplique `LIMIT 1` apenas para esconder o erro. Sem critério de negócio, isso seleciona uma linha arbitrária do conjunto ordenado ou não ordenado.

---

### Subquery nao correlacionada

Uma subquery não correlacionada não referencia a consulta externa.

Exemplo:

```sql
SELECT
    id,
    codigo,
    valor_mao_obra
FROM app.atividade
WHERE valor_mao_obra > (
    SELECT avg(valor_mao_obra)
    FROM app.atividade
);
```

A consulta interna pode ser executada isoladamente:

```sql
SELECT avg(valor_mao_obra)
FROM app.atividade;
```

Ela possui significado completo sem a consulta externa.

---

### Testar a subquery isoladamente

Execute primeiro a consulta interna, confirme se ela retorna um valor, uma lista ou uma tabela e só depois encaixe-a na consulta externa. Essa rotina reduz erros de cardinalidade.

### IN com subquery

`IN` testa se um valor pertence ao conjunto produzido pela subquery.

Exemplo:

```sql
SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE id IN (
    SELECT ordem_servico_id
    FROM app.atividade
    WHERE status = 'PENDENTE'
);
```

A subquery pode retornar vários IDs.

A consulta externa mantém ordens cujo ID aparece nessa lista.

---

### Valores duplicados em IN

A subquery de `IN` pode repetir valores. Isso não altera a pergunta de pertinência ao conjunto. Use `DISTINCT` somente quando comunicar melhor a intenção ou quando houver motivo técnico comprovado.

### NOT IN

`NOT IN` testa se um valor não pertence ao conjunto.

Exemplo:

```sql
SELECT
    id,
    codigo
FROM app.competencia
WHERE id NOT IN (
    SELECT competencia_id
    FROM app.atividade_competencia
);
```

No modelo atual, `competencia_id` é `NOT NULL`.

Nesse caso controlado, a consulta identifica competências não associadas.

Entretanto, `NOT IN` exige cuidado quando a subquery pode retornar `NULL`.

---

### Armadilha de NOT IN com NULL

Considere uma subquery que retorna:

```text
10;
20;
NULL.
```

A condição:

```sql
valor NOT IN (10, 20, NULL)
```

não consegue afirmar com certeza que o valor é diferente do elemento desconhecido.

O resultado pode ser `unknown`.

No `WHERE`, `unknown` é descartado.

Isso pode fazer a consulta retornar zero linhas inesperadamente.

Quando existe possibilidade de `NULL`, `NOT EXISTS` costuma comunicar a ausência de relacionamento com mais segurança.

---

### EXISTS

`EXISTS` retorna verdadeiro quando a subquery produz pelo menos uma linha.

Exemplo:

```sql
SELECT
    os.id,
    os.codigo
FROM app.ordem_servico AS os
WHERE EXISTS (
    SELECT 1
    FROM app.atividade AS a
    WHERE a.ordem_servico_id = os.id
);
```

A subquery referencia `os.id`.

Ela é correlacionada.

Para cada ordem lógica externa, a consulta pergunta:

```text
existe alguma atividade relacionada?
```

---

### SELECT 1 em EXISTS

Dentro de `EXISTS`, os valores projetados não são usados. `SELECT 1` comunica que apenas a existência da linha importa.

### NOT EXISTS

`NOT EXISTS` retorna verdadeiro quando a subquery não produz linha.

Exemplo:

```sql
SELECT
    c.id,
    c.codigo,
    c.nome
FROM app.competencia AS c
WHERE NOT EXISTS (
    SELECT 1
    FROM app.atividade_competencia AS ac
    WHERE ac.competencia_id = c.id
);
```

A consulta identifica competências sem associações.

Esse padrão é chamado de anti-semi join em termos relacionais, embora a sintaxe usada seja `NOT EXISTS`.

---

### EXISTS e NULL

`EXISTS` verifica a presença de uma linha, sem comparar diretamente os valores projetados. Por isso, `NOT EXISTS` evita a armadilha de `NOT IN` quando o conjunto interno pode conter `NULL`.

### Subquery correlacionada

Uma subquery correlacionada referencia um alias da consulta externa.

Exemplo:

```sql
SELECT
    os.id,
    os.codigo
FROM app.ordem_servico AS os
WHERE EXISTS (
    SELECT 1
    FROM app.atividade AS a
    WHERE a.ordem_servico_id = os.id
);
```

O alias `os` foi definido fora da subquery.

A condição interna depende da ordem atual.

A subquery não possui significado completo se você tentar executar apenas:

```sql
SELECT 1
FROM app.atividade AS a
WHERE a.ordem_servico_id = os.id;
```

O alias `os` não existe isoladamente.

---

### Execucao logica e otimizador

Didaticamente, pense que a condição interna é avaliada para a linha externa atual. O PostgreSQL pode transformar essa lógica em outro plano equivalente; `EXPLAIN` mostrará o plano real em aula posterior.

### Alias e escopo

Aliases externos podem ser referenciados pela subquery correlacionada.

Aliases definidos dentro da subquery não existem fora dela.

Exemplo:

```sql
SELECT
    os.id
FROM app.ordem_servico AS os
WHERE EXISTS (
    SELECT 1
    FROM app.atividade AS a
    WHERE a.ordem_servico_id = os.id
);
```

Escopos:

```text
os:
visível na consulta externa e na subquery correlacionada.

a:
visível apenas dentro da subquery.
```

Use aliases diferentes para evitar esconder nomes.

---

### Subquery correlacionada com agregacao

Exemplo:

```sql
SELECT
    a.id,
    a.codigo,
    a.valor_mao_obra
FROM app.atividade AS a
WHERE a.valor_mao_obra > (
    SELECT avg(a2.valor_mao_obra)
    FROM app.atividade AS a2
    WHERE a2.ordem_servico_id = a.ordem_servico_id
);
```

Para cada atividade, a subquery calcula a média das atividades da mesma ordem.

A consulta retorna atividades acima da média de seu próprio grupo.

Aliases:

```text
a:
atividade externa.

a2:
atividades usadas no cálculo interno.
```

---

### Subquery no SELECT

Uma subquery escalar pode produzir um valor por linha externa, como a quantidade de atividades de cada ordem. Isso é útil em projeções de relatório, mas deve ser comparado com `LEFT JOIN` e `GROUP BY` quanto à clareza e ao plano.

### Subquery no FROM

Uma subquery em `FROM` produz uma tabela derivada.

Exemplo:

```sql
SELECT
    resumo.ordem_servico_id,
    resumo.quantidade,
    resumo.valor_total
FROM (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
) AS resumo
ORDER BY resumo.ordem_servico_id;
```

A subquery interna produz linhas agrupadas.

A consulta externa trata esse resultado como uma origem.

Use alias para a tabela derivada:

```text
resumo.
```

Isso melhora clareza e permite referenciar suas colunas.

---

### Filtrar uma tabela derivada

A consulta externa pode filtrar o resultado agregado produzido em `FROM`. Quando a etapa intermediária cresce, uma CTE pode torná-la mais legível.

### Subquery no WHERE com agregacao

Exemplo:

```sql
SELECT
    id,
    codigo,
    valor_mao_obra
FROM app.atividade
WHERE valor_mao_obra > (
    SELECT avg(valor_mao_obra)
    FROM app.atividade
);
```

Isso responde:

```text
quais linhas estão acima de um valor agregado?
```

É diferente de `HAVING`, que filtra grupos.

---

### Subquery e join

Uma pergunta pode ter mais de uma solução.

Com `EXISTS`:

```sql
SELECT
    os.id,
    os.codigo
FROM app.ordem_servico AS os
WHERE EXISTS (
    SELECT 1
    FROM app.atividade AS a
    WHERE a.ordem_servico_id = os.id
);
```

Com join:

```sql
SELECT DISTINCT
    os.id,
    os.codigo
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id;
```

`EXISTS` comunica diretamente:

```text
ordens que possuem atividade.
```

O join produz uma linha por correspondência e precisa eliminar duplicidades para retornar uma linha por ordem.

Quando você não precisa de colunas do lado relacionado, `EXISTS` pode expressar melhor a intenção.

---

### Subquery, IN, EXISTS e join

A mesma pergunta pode admitir soluções diferentes.

Use `IN` quando a intenção é pertencer a uma coleção. Use `EXISTS` quando apenas a existência do relacionamento importa. Use join quando precisa trazer colunas do outro lado ou quando a forma resultante é naturalmente relacional.

Não trate uma forma como universalmente mais rápida. O plano, os dados e a clareza da consulta importam.

### Subquery e agregacao previa

Na aula 286, você observou que juntar dois lados muitos pode multiplicar linhas.

Uma estratégia é agregar um lado em uma subquery antes do join.

Exemplo conceitual:

```sql
SELECT
    os.codigo,
    resumo.quantidade,
    resumo.valor_total
FROM app.ordem_servico AS os
LEFT JOIN (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
) AS resumo
    ON resumo.ordem_servico_id = os.id;
```

A tabela derivada possui uma linha por ordem.

Isso reduz a multiplicidade antes da combinação.

---

### Subquery profunda demais

Muitas camadas, aliases obscuros ou repetição da mesma lógica dificultam manutenção. Teste cada parte isoladamente e considere CTE ou view quando o resultado intermediário precisar de nome. CTE será o tema da aula 288.

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
  -Path "labs\m12\aula-287-subqueries-correlacionadas-nao-correlacionadas\sql"

Set-Location `
  "labs\m12\aula-287-subqueries-correlacionadas-nao-correlacionadas"
```

---

### 3. Criar 00_verificar_dataset.sql

Crie:

```text
sql/00_verificar_dataset.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario;

SELECT count(*) AS ordens
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930004;

SELECT count(*) AS atividades
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006;

SELECT count(*) AS competencias
FROM app.competencia
WHERE id BETWEEN 950001 AND 950004;

SELECT count(*) AS associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951006;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-287-subqueries-correlacionadas-nao-correlacionadas\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultados esperados:

```text
4 ordens;
6 atividades;
4 competências;
6 associações.
```

---

### 4. Criar 01_subquery_escalar.sql

Crie:

```text
sql/01_subquery_escalar.sql
```

Conteúdo:

```sql
SELECT
    avg(valor_mao_obra) AS media_geral
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006;

SELECT
    id,
    codigo,
    valor_mao_obra
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
  AND valor_mao_obra > (
      SELECT avg(valor_mao_obra)
      FROM app.atividade
      WHERE id BETWEEN 930001 AND 930006
  )
ORDER BY
    valor_mao_obra DESC,
    id;

SELECT
    id,
    codigo,
    valor_previsto
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930004
  AND valor_previsto = (
      SELECT max(valor_previsto)
      FROM app.ordem_servico
      WHERE id BETWEEN 930001 AND 930004
  )
ORDER BY id;
```

Primeiro execute cada subquery isoladamente.

Depois execute a consulta completa.

---

### 5. Criar 02_subquery_com_in.sql

Crie:

```text
sql/02_subquery_com_in.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930004
  AND id IN (
      SELECT ordem_servico_id
      FROM app.atividade
      WHERE id BETWEEN 930001 AND 930006
        AND status = 'PENDENTE'
  )
ORDER BY id;

SELECT
    id,
    codigo,
    nome
FROM app.competencia
WHERE id BETWEEN 950001 AND 950004
  AND id IN (
      SELECT competencia_id
      FROM app.atividade_competencia
      WHERE id BETWEEN 951001 AND 951006
        AND obrigatoria = true
  )
ORDER BY id;

SELECT
    id,
    codigo,
    nome
FROM app.competencia
WHERE id BETWEEN 950001 AND 950004
  AND id NOT IN (
      SELECT competencia_id
      FROM app.atividade_competencia
      WHERE id BETWEEN 951001 AND 951006
  )
ORDER BY id;
```

O último exemplo é seguro neste dataset porque `competencia_id` é `NOT NULL`.

Mesmo assim, o laboratório também apresentará a alternativa com `NOT EXISTS`.

---

### 6. Criar 03_exists_not_exists.sql

Crie:

```text
sql/03_exists_not_exists.sql
```

Conteúdo:

```sql
SELECT
    os.id,
    os.codigo,
    os.status
FROM app.ordem_servico AS os
WHERE os.id BETWEEN 930001 AND 930004
  AND EXISTS (
      SELECT 1
      FROM app.atividade AS a
      WHERE a.ordem_servico_id = os.id
        AND a.id BETWEEN 930001 AND 930006
  )
ORDER BY os.id;

SELECT
    comp.id,
    comp.codigo,
    comp.nome
FROM app.competencia AS comp
WHERE comp.id BETWEEN 950001 AND 950004
  AND NOT EXISTS (
      SELECT 1
      FROM app.atividade_competencia AS ac
      WHERE ac.competencia_id = comp.id
        AND ac.id BETWEEN 951001 AND 951006
  )
ORDER BY comp.id;

SELECT
    c.id,
    c.nome
FROM app.cliente AS c
WHERE c.id BETWEEN 930001 AND 930003
  AND EXISTS (
      SELECT 1
      FROM app.telefone_cliente AS tc
      WHERE tc.cliente_id = c.id
        AND tc.id BETWEEN 940001 AND 940005
        AND tc.confirmado = true
  )
ORDER BY c.id;
```

Explique em português a pergunta de existência feita por cada consulta.

---

### 7. Criar 04_subquery_no_select.sql

Crie:

```text
sql/04_subquery_no_select.sql
```

Conteúdo:

```sql
SELECT
    os.id,
    os.codigo,
    os.status,
    (
        SELECT count(*)
        FROM app.atividade AS a
        WHERE a.ordem_servico_id = os.id
          AND a.id BETWEEN 930001 AND 930006
    ) AS quantidade_atividades,
    (
        SELECT sum(a.valor_mao_obra)
        FROM app.atividade AS a
        WHERE a.ordem_servico_id = os.id
          AND a.id BETWEEN 930001 AND 930006
    ) AS valor_total_mao_obra
FROM app.ordem_servico AS os
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY os.id;

SELECT
    comp.id,
    comp.nome,
    (
        SELECT count(*)
        FROM app.atividade_competencia AS ac
        WHERE ac.competencia_id = comp.id
          AND ac.id BETWEEN 951001 AND 951006
    ) AS quantidade_atividades
FROM app.competencia AS comp
WHERE comp.id BETWEEN 950001 AND 950004
ORDER BY comp.id;
```

Observe:

```text
COUNT retorna zero quando não há linha correspondente;

SUM retorna NULL quando não há valor a somar.
```

Não substitua `NULL` por zero nesta aula. Funções para tratamento serão aprofundadas posteriormente.

---

### 8. Criar 05_subquery_no_from.sql

Crie:

```text
sql/05_subquery_no_from.sql
```

Conteúdo:

```sql
SELECT
    resumo.ordem_servico_id,
    resumo.quantidade_atividades,
    resumo.valor_total_mao_obra
FROM (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS valor_total_mao_obra
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
) AS resumo
ORDER BY resumo.ordem_servico_id;

SELECT
    resumo.ordem_servico_id,
    resumo.valor_total_mao_obra
FROM (
    SELECT
        ordem_servico_id,
        sum(valor_mao_obra) AS valor_total_mao_obra
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
) AS resumo
WHERE resumo.valor_total_mao_obra > 250
ORDER BY
    resumo.valor_total_mao_obra DESC,
    resumo.ordem_servico_id;

SELECT
    comp.id,
    comp.nome,
    resumo.quantidade_atividades
FROM app.competencia AS comp
LEFT JOIN (
    SELECT
        competencia_id,
        count(*) AS quantidade_atividades
    FROM app.atividade_competencia
    WHERE id BETWEEN 951001 AND 951006
    GROUP BY competencia_id
) AS resumo
    ON resumo.competencia_id = comp.id
WHERE comp.id BETWEEN 950001 AND 950004
ORDER BY comp.id;
```

A última consulta preserva Competência sem associação.

---

### 9. Criar 06_subquery_correlacionada.sql

Crie:

```text
sql/06_subquery_correlacionada.sql
```

Conteúdo:

```sql
SELECT
    a.id,
    a.ordem_servico_id,
    a.codigo,
    a.valor_mao_obra
FROM app.atividade AS a
WHERE a.id BETWEEN 930001 AND 930006
  AND a.valor_mao_obra > (
      SELECT avg(a2.valor_mao_obra)
      FROM app.atividade AS a2
      WHERE a2.ordem_servico_id = a.ordem_servico_id
        AND a2.id BETWEEN 930001 AND 930006
  )
ORDER BY
    a.ordem_servico_id,
    a.valor_mao_obra DESC,
    a.id;

SELECT
    os.id,
    os.codigo,
    os.valor_previsto
FROM app.ordem_servico AS os
WHERE os.id BETWEEN 930001 AND 930004
  AND os.valor_previsto > (
      SELECT avg(os2.valor_previsto)
      FROM app.ordem_servico AS os2
      WHERE os2.cliente_id = os.cliente_id
        AND os2.id BETWEEN 930001 AND 930004
  )
ORDER BY
    os.cliente_id,
    os.valor_previsto DESC,
    os.id;

SELECT
    a.id,
    a.codigo
FROM app.atividade AS a
WHERE a.id BETWEEN 930001 AND 930006
  AND EXISTS (
      SELECT 1
      FROM app.atividade_competencia AS ac
      WHERE ac.atividade_id = a.id
        AND ac.obrigatoria = true
        AND ac.id BETWEEN 951001 AND 951006
  )
ORDER BY a.id;
```

Identifique a coluna externa usada por cada subquery.

---

### 10. Criar 07_comparar_join_e_subquery.sql

Crie:

```text
sql/07_comparar_join_e_subquery.sql
```

Conteúdo:

```sql
-- EXISTS: uma linha por ordem, sem precisar remover duplicidades.
SELECT
    os.id,
    os.codigo
FROM app.ordem_servico AS os
WHERE os.id BETWEEN 930001 AND 930004
  AND EXISTS (
      SELECT 1
      FROM app.atividade AS a
      WHERE a.ordem_servico_id = os.id
        AND a.id BETWEEN 930001 AND 930006
  )
ORDER BY os.id;

-- JOIN: produz uma linha por atividade antes do DISTINCT.
SELECT DISTINCT
    os.id,
    os.codigo
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.id BETWEEN 930001 AND 930006
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY os.id;

-- Subquery escalar na projeção.
SELECT
    os.id,
    os.codigo,
    (
        SELECT count(*)
        FROM app.atividade AS a
        WHERE a.ordem_servico_id = os.id
          AND a.id BETWEEN 930001 AND 930006
    ) AS quantidade
FROM app.ordem_servico AS os
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY os.id;

-- JOIN com GROUP BY.
SELECT
    os.id,
    os.codigo,
    count(a.id) AS quantidade
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.id BETWEEN 930001 AND 930006
WHERE os.id BETWEEN 930001 AND 930004
GROUP BY
    os.id,
    os.codigo
ORDER BY os.id;
```

Compare:

- intenção;
- cardinalidade intermediária;
- necessidade de `DISTINCT`;
- legibilidade;
- forma do resultado.

Não declare uma solução universalmente superior.

---

### 11. Criar 08_armadilhas_controladas.sql

Crie:

```text
sql/08_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Erro esperado: subquery escalar retorna várias linhas.
SELECT
    id,
    codigo
FROM app.atividade
WHERE ordem_servico_id = (
    SELECT id
    FROM app.ordem_servico
    WHERE id BETWEEN 930001 AND 930004
);

-- Forma compatível com várias linhas.
SELECT
    id,
    codigo
FROM app.atividade
WHERE ordem_servico_id IN (
    SELECT id
    FROM app.ordem_servico
    WHERE id BETWEEN 930001 AND 930004
)
ORDER BY id;

-- Armadilha de NOT IN com NULL em conjunto artificial.
SELECT
    valor
FROM (
    VALUES
        (1),
        (2),
        (3)
) AS origem(valor)
WHERE valor NOT IN (
    SELECT bloqueado
    FROM (
        VALUES
            (2),
            (NULL)
    ) AS bloqueios(bloqueado)
);

-- Alternativa com NOT EXISTS.
SELECT
    origem.valor
FROM (
    VALUES
        (1),
        (2),
        (3)
) AS origem(valor)
WHERE NOT EXISTS (
    SELECT 1
    FROM (
        VALUES
            (2),
            (NULL)
    ) AS bloqueios(bloqueado)
    WHERE bloqueios.bloqueado = origem.valor
)
ORDER BY origem.valor;

-- Evite LIMIT 1 como correção sem regra.
-- A consulta abaixo é sintaticamente válida,
-- mas não define por que a primeira ordem seria a correta.
SELECT
    id,
    codigo
FROM app.atividade
WHERE ordem_servico_id = (
    SELECT id
    FROM app.ordem_servico
    ORDER BY id
    LIMIT 1
)
ORDER BY id;
```

Execute o primeiro comando separadamente para observar o erro.

Explique por que o último comando não é correção genérica.

---

### 12. Criar 09_relatorios_com_subqueries.sql

Crie:

```text
sql/09_relatorios_com_subqueries.sql
```

Conteúdo:

```sql
SELECT
    os.id,
    os.codigo,
    os.status,
    (
        SELECT count(*)
        FROM app.atividade AS a
        WHERE a.ordem_servico_id = os.id
          AND a.id BETWEEN 930001 AND 930006
    ) AS quantidade_atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico AS eos
        WHERE eos.ordem_servico_id = os.id
          AND eos.id BETWEEN 930001 AND 930004
    ) AS quantidade_eventos
FROM app.ordem_servico AS os
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY os.id;

SELECT
    comp.id,
    comp.nome,
    (
        SELECT count(*)
        FROM app.atividade_competencia AS ac
        WHERE ac.competencia_id = comp.id
          AND ac.id BETWEEN 951001 AND 951006
    ) AS total_associacoes,
    EXISTS (
        SELECT 1
        FROM app.atividade_competencia AS ac
        WHERE ac.competencia_id = comp.id
          AND ac.obrigatoria = true
          AND ac.id BETWEEN 951001 AND 951006
    ) AS possui_associacao_obrigatoria
FROM app.competencia AS comp
WHERE comp.id BETWEEN 950001 AND 950004
ORDER BY comp.id;

SELECT
    c.id,
    c.nome
FROM app.cliente AS c
WHERE c.id BETWEEN 930001 AND 930003
  AND EXISTS (
      SELECT 1
      FROM app.ordem_servico AS os
      WHERE os.cliente_id = c.id
        AND os.id BETWEEN 930001 AND 930004
        AND os.valor_previsto > (
            SELECT avg(os2.valor_previsto)
            FROM app.ordem_servico AS os2
            WHERE os2.id BETWEEN 930001 AND 930004
        )
  )
ORDER BY c.id;
```

A última consulta combina uma subquery correlacionada de existência com uma média não correlacionada.

Leia as camadas de dentro para fora.

---

### 13. Criar 10_exercicio.sql

Crie:

```text
sql/10_exercicio.sql
```

Implemente as missões da seção de exercício guiado.

Não use `WITH`.

---

### 14. Criar 11_validacao_final.sql

Crie:

```text
sql/11_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    a.id,
    a.codigo,
    a.valor_mao_obra
FROM app.atividade AS a
WHERE a.id BETWEEN 930001 AND 930006
  AND a.valor_mao_obra > (
      SELECT avg(a2.valor_mao_obra)
      FROM app.atividade AS a2
      WHERE a2.id BETWEEN 930001 AND 930006
  )
ORDER BY a.id;

SELECT
    comp.id,
    comp.codigo
FROM app.competencia AS comp
WHERE comp.id BETWEEN 950001 AND 950004
  AND NOT EXISTS (
      SELECT 1
      FROM app.atividade_competencia AS ac
      WHERE ac.competencia_id = comp.id
        AND ac.id BETWEEN 951001 AND 951006
  )
ORDER BY comp.id;

SELECT count(*) AS atividades
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006;

SELECT count(*) AS competencias
FROM app.competencia
WHERE id BETWEEN 950001 AND 950004;

SELECT count(*) AS associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951006;
```

Contagens finais:

```text
6 atividades;
4 competências;
6 associações.
```

Nenhum dado deve ser modificado.

---

### 15. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 287 - Subqueries correlacionadas e nao correlacionadas.

Objetivo:
usar resultados de consultas dentro de outras consultas.

Tipos:
escalar;
lista;
existência;
tabela derivada;
correlacionada.

Operadores:
comparação;
IN;
EXISTS;
NOT EXISTS.

Posições:
WHERE;
SELECT;
FROM.

Regra:
laboratório somente leitura.

Próxima aula:
CTE common table expressions.
```

Liste os scripts e descreva a forma esperada do resultado de cada subquery principal.

---

## Entendendo o que foi feito

### A forma do resultado guiou o operador

Você diferenciou valor escalar, coleção, existência e tabela derivada. Isso evitou usar `=` quando a subquery produzia várias linhas.

### Correlacao conectou a linha externa

A consulta interna usou o alias externo para responder perguntas sobre a ordem, atividade, competência ou cliente atual.

### EXISTS e NOT EXISTS expressaram relacionamento

`EXISTS` verificou presença sem multiplicar a consulta externa. `NOT EXISTS` identificou ausência sem a armadilha de `NOT IN` com `NULL`.

### Tabela derivada organizou uma etapa

A subquery em `FROM` agregou dados antes da consulta externa. Esse padrão será nomeado com CTEs na aula 288.

### Nenhuma forma substituiu todas as outras

Join, `IN`, `EXISTS`, subquery escalar e tabela derivada foram escolhidos conforme intenção e forma do resultado.

## Erros comuns importantes

### More than one row returned

Uma subquery usada como valor retornou várias linhas.

Revise a cardinalidade.

Não aplique `LIMIT 1` sem regra.

---

### Column does not exist

O alias está fora do escopo ou foi digitado incorretamente.

Revise quais aliases pertencem à consulta externa e à interna.

---

### NOT IN retorna zero inesperadamente

A subquery pode conter `NULL`.

Use `NOT EXISTS` ou elimine nulos somente quando isso representar a regra correta.

---

### Subquery repetida varias vezes

A consulta ficou difícil de manter.

A próxima aula mostrará CTEs para nomear resultados intermediários.

---

### Consulta correlacionada parece lenta

A semântica não revela sozinha o plano real.

Analise com `EXPLAIN` em aula apropriada antes de concluir.

---

## Comandos uteis

### Subquery escalar

```sql
WHERE valor > (
    SELECT avg(valor)
    FROM tabela
)
```

### Lista

```sql
WHERE id IN (
    SELECT referencia_id
    FROM outra_tabela
)
```

### Existencia

```sql
WHERE EXISTS (
    SELECT 1
    FROM outra_tabela
    WHERE outra_tabela.pai_id = pai.id
)
```

### Ausencia

```sql
WHERE NOT EXISTS (
    SELECT 1
    FROM outra_tabela
    WHERE outra_tabela.pai_id = pai.id
)
```

### Tabela derivada

```sql
FROM (
    SELECT ...
) AS resumo
```

---

## Exercicio guiado

No arquivo:

```text
sql/10_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Atividades acima da media

Retorne:

```text
id;
codigo;
valor_mao_obra.
```

Regras:

```text
somente atividades com valor acima da média geral;
usar subquery não correlacionada;
ordenar por valor decrescente e id.
```

---

### Parte 2 - Ordens com atividade concluida

Retorne:

```text
id;
codigo;
status.
```

Use `EXISTS`.

A subquery deve verificar atividade com status `CONCLUIDA`.

Não use join.

---

### Parte 3 - Competencias sem uso

Resolva de duas formas:

1. `NOT IN`;
2. `NOT EXISTS`.

Explique por que a versão com `NOT IN` é segura apenas porque `competencia_id` é obrigatório.

---

### Parte 4 - Quantidade por Ordem no SELECT

Retorne todas as quatro ordens com:

```text
id;
codigo;
quantidade de atividades;
valor total de mão de obra.
```

Use duas subqueries correlacionadas na projeção.

Explique por que uma ordem sem atividade receberia:

```text
COUNT:
zero.

SUM:
NULL.
```

---

### Parte 5 - Atividade acima da media da propria Ordem

Retorne as atividades cujo valor é maior que a média das atividades da mesma ordem.

Use aliases externos e internos diferentes.

Não use CTE.

---

### Parte 6 - Tabela derivada

Crie uma subquery em `FROM` que calcule por competência:

```text
quantidade de associações;
quantidade de associações obrigatórias.
```

Na consulta externa, mantenha somente linhas com pelo menos duas associações.

Não use `HAVING` na consulta externa.

---

### Parte 7 - Comparar EXISTS e JOIN

Resolva:

```text
clientes que possuem telefone confirmado.
```

Versão A:

```text
EXISTS.
```

Versão B:

```text
JOIN com DISTINCT.
```

Compare:

- cardinalidade intermediária;
- intenção;
- colunas necessárias;
- legibilidade.

---

### Parte 8 - Diagnosticar scalar subquery

Crie um exemplo que falha porque uma subquery escalar retorna mais de uma linha.

Depois corrija usando o operador adequado.

Documente por que a correção representa a regra.

---

### Parte 9 - Relatorio final

Retorne cada competência com:

```text
id;
nome;
quantidade de atividades;
possui associação obrigatória;
nível máximo textual.
```

Use subqueries na projeção.

Registre que `MAX` textual segue ordenação, não a hierarquia semântica dos níveis.

Não implemente conversão de nível nesta aula.

---

## Criterios de aceite

- o laboratório oficial da aula 287 existe;
- o arquivo e o H1 seguem a grade;
- o dataset das aulas anteriores foi preservado;
- nenhum script modifica dados;
- consulta externa e subquery foram diferenciadas;
- a forma do resultado foi analisada;
- subquery escalar foi praticada;
- retorno de múltiplas linhas foi diagnosticado;
- subquery não correlacionada foi praticada;
- subquery correlacionada foi praticada;
- `IN` foi usado com lista;
- `EXISTS` foi usado para existência;
- `NOT EXISTS` foi usado para ausência;
- a armadilha de `NOT IN` com `NULL` foi demonstrada;
- subquery em `SELECT` foi praticada;
- subquery em `FROM` foi praticada;
- aliases e escopos foram compreendidos;
- agregação correlacionada foi praticada;
- join e subquery foram comparados;
- `LIMIT 1` não foi usado como correção arbitrária;
- CTE não foi antecipada;
- função de janela não foi antecipada;
- o exercício foi concluído;
- contagens finais continuam corretas;
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
  labs/m12/aula-287-subqueries-correlacionadas-nao-correlacionadas
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): consultar dados com subqueries"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
subqueries escalares;
IN;
EXISTS;
NOT EXISTS;
correlação;
tabelas derivadas;
consultas somente leitura.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você usou consultas como parte de outras consultas.

Aprendeu:

```text
subquery;
consulta externa;
subquery escalar;
subquery não correlacionada;
subquery correlacionada;
IN;
NOT IN;
EXISTS;
NOT EXISTS;
subquery no SELECT;
subquery no FROM;
tabela derivada;
escopo de alias.
```

As regras principais foram:

```text
defina a forma esperada do resultado;

use comparação escalar somente com um valor;

use IN para pertinência a uma coleção;

use EXISTS para testar presença;

use NOT EXISTS para testar ausência;

tenha cuidado com NOT IN e NULL;

correlação referencia a linha externa;

execute a subquery isoladamente quando possível;

não use LIMIT 1 para esconder cardinalidade errada;

compare joins e subqueries pela intenção.
```

A próxima aula será:

```text
288 - M12.18 - CTE common table expressions
```

Nela, você vai estudar:

- cláusula `WITH`;
- nomeação de resultados intermediários;
- uma ou várias CTEs;
- reutilização lógica;
- legibilidade;
- dependência entre CTEs;
- CTE com agregação;
- CTE em consultas de relatório;
- comparação com subquery em `FROM`;
- materialização e otimização em nível introdutório;
- CTE recursiva em introdução controlada.

Não reescreva os scripts atuais com `WITH` ainda.

Primeiro conclua a prática de subqueries.

---

# Material complementar

## Checkpoint final

- [ ] Usei subqueries escalares, listas e testes de existência.
- [ ] Diferenciei subqueries correlacionadas e não correlacionadas.
- [ ] Pratiquei subqueries em `WHERE`, `SELECT` e `FROM`.
- [ ] Preservei o dataset e fiz o commit recomendado.

---

## Troubleshooting adicional

### Subquery retorna mais de uma coluna

Um contexto escalar ou `IN` simples espera uma coluna.

Selecione apenas o atributo necessário ou revise a comparação de linhas.

### Alias externo foi escondido

Você reutilizou o mesmo alias dentro da subquery.

Escolha aliases distintos para cada escopo.

### EXISTS parece retornar dados internos

`EXISTS` devolve apenas verdadeiro ou falso.

Para trazer colunas internas, use join ou outra forma de consulta.

### Subquery escalar com SUM retorna NULL

Não existem valores no conjunto.

Isso é comportamento diferente de `COUNT`, que retorna zero.

### Consulta ficou dificil de ler

Separe e teste as camadas.

Na aula 288, use CTE para nomear etapas.

---

## Perguntas de revisao

1. O que é subquery?
2. O que é consulta externa?
3. O que define uma subquery escalar?
4. O que acontece quando ela retorna várias linhas?
5. O que acontece quando não retorna linha?
6. O que é subquery não correlacionada?
7. O que é subquery correlacionada?
8. Para que serve `IN`?
9. Qual o risco de `NOT IN`?
10. O que `EXISTS` verifica?
11. Por que usar `SELECT 1`?
12. O que `NOT EXISTS` verifica?
13. Como usar subquery no `SELECT`?
14. O que uma subquery em `FROM` produz?
15. Por que usar alias na tabela derivada?
16. Quando `EXISTS` pode ser mais claro que join?
17. Por que testar a subquery isoladamente?
18. Quando considerar CTE?

---

## Roteiro de resposta

1. Subquery é uma consulta inserida em outra instrução.
2. A consulta externa contém a subquery.
3. Uma subquery escalar retorna uma coluna e no máximo uma linha.
4. Múltiplas linhas causam erro no contexto escalar; nenhuma linha resulta em `NULL`.
5. A não correlacionada independe da linha externa.
6. A correlacionada referencia atributos externos.
7. `IN` testa pertinência; `EXISTS`, presença; `NOT EXISTS`, ausência.
8. `NOT IN` exige cuidado com `NULL`.
9. Subquery no `SELECT` produz um valor por linha.
10. Subquery no `FROM` produz uma tabela derivada.
11. Aliases definem escopo e evitam ambiguidade.
12. Execute a consulta interna isoladamente quando possível.
13. Use CTE quando etapas intermediárias precisarem de nome.

## Desafio opcional

Crie uma consulta que retorne cada Ordem com:

```text
codigo;
quantidade de atividades;
valor total de mão de obra;
quantidade de eventos;
possui atividade concluída;
possui atividade sem competência;
valor acima da média geral de ordens.
```

Use somente:

- subqueries;
- agregações;
- `EXISTS`;
- operadores já estudados.

Não use:

```text
WITH;
funções de janela;
views.
```

Documente a forma de retorno de cada subquery.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 287 - M12.17 - Subqueries correlacionadas e nao correlacionadas

- Estudei consultas usadas dentro de outras consultas.
- Diferenciei consulta externa e subquery.
- Analisei a forma esperada do resultado interno.
- Usei subquery escalar com agregações.
- Entendi o erro causado por múltiplas linhas em contexto escalar.
- Usei `IN` para comparar com uma coleção.
- Estudei a armadilha de `NOT IN` com valores nulos.
- Usei `EXISTS` e `NOT EXISTS` para presença e ausência.
- Diferenciei subquery correlacionada de não correlacionada.
- Usei aliases externos e internos com escopo correto.
- Criei subqueries na projeção e no `FROM`.
- Comparei joins, `IN`, `EXISTS` e tabelas derivadas.
- Evitei usar `LIMIT 1` como correção arbitrária.
- Mantive o dataset inalterado.
- Próxima aula: CTEs com `WITH`.
```

---

## Referencia tecnica curta

```text
Subquery escalar:
uma coluna e no máximo uma linha.

Nao correlacionada:
independe da linha externa.

Correlacionada:
referencia a linha externa.

IN:
pertence ao conjunto.

EXISTS:
há pelo menos uma linha.

NOT EXISTS:
não há linha.

FROM subquery:
tabela derivada.

SELECT subquery:
valor calculado por linha.
```

Regra final:

```text
antes de encaixar uma subquery, defina a forma do resultado e a pergunta que ela precisa responder.
```
