# 280 - M12.10 - Joins inner left right full e cross com criterio

## Apresentacao da aula

Na aula 279, você ampliou os filtros SQL com operadores de comparação, `AND`, `OR`, `NOT`, `LIKE`, `ILIKE`, `BETWEEN`, `IN`, `IS NULL` e `IS NOT NULL`.

Até agora, cada consulta principal leu uma tabela por vez.

Isso permitiu responder perguntas como:

```text
quais ordens estão agendadas?
quais atividades ainda não começaram?
quais produtos estão em determinada faixa de valor?
quais clientes possuem certo texto no nome?
```

Mas o domínio de Ordem de Serviço foi separado em várias tabelas:

```text
app.cliente;
app.produto;
app.ordem_servico;
app.atividade;
auditoria.evento_ordem_servico.
```

A separação evita repetição descontrolada e permite proteger os relacionamentos com foreign keys. Em contrapartida, muitas perguntas de negócio precisam reunir dados que estão em tabelas diferentes.

Exemplo:

```text
qual é o código da ordem?
qual é o nome do cliente?
qual produto está relacionado?
quais atividades pertencem à ordem?
quais eventos foram registrados?
```

É nesse ponto que entram os joins.

`JOIN` combina linhas de duas table expressions conforme uma condição.

Nesta aula, você vai estudar:

```text
INNER JOIN;
LEFT JOIN;
RIGHT JOIN;
FULL JOIN;
CROSS JOIN;
ON;
aliases;
linhas correspondentes;
linhas sem correspondência;
multiplicação de linhas;
filtros no ON;
filtros no WHERE;
produto cartesiano.
```

Escolha o join que representa a pergunta.

Uma consulta pode estar sintaticamente correta e conceitualmente errada: ocultar ausências, perder linhas de outer join ou multiplicar resultados.

Ao final, você deverá conseguir escolher o tipo de join, identificar a tabela preservada, escrever condições com `ON`, prever multiplicidade, evitar produto cartesiano e combinar as tabelas do domínio com consultas legíveis.

O laboratório será somente leitura e preservará o dataset da aula 277.

---

## Onde estamos na formacao

A sequência imediata do M12 é:

```text
278:
consulta básica.

279:
operadores e filtros.

280:
joins.

281:
modelagem conceitual.

282:
modelagem lógica e cardinalidade.
```

Agora você combina tabelas e precisa decidir origem principal, relação, condição, conjunto preservado, multiplicidade e posição dos filtros. A aula 281 formalizará essas decisões em nível conceitual.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-280-joins-inner-left-right-full-cross-criterio
```

Estrutura final:

```text
labs
└── m12
    └── aula-280-joins-inner-left-right-full-cross-criterio
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_inner_join.sql
            ├── 02_left_join.sql
            ├── 03_right_join.sql
            ├── 04_full_join.sql
            ├── 05_cross_join.sql
            ├── 06_on_vs_where.sql
            ├── 07_multiplos_joins.sql
            ├── 08_multiplicidade.sql
            ├── 09_armadilhas_controladas.sql
            ├── 10_exercicio.sql
            └── 11_validacao_final.sql
```

O ambiente continua sendo:

```text
container:
formacao-postgres-m12

database:
formacao_java

schemas:
app e auditoria
```

O dataset esperado continua:

```text
3 clientes;
3 produtos;
4 ordens;
6 atividades;
4 eventos.
```

O laboratório seguirá este fluxo:

1. confirmar contexto e dataset;
2. combinar apenas linhas correspondentes;
3. preservar linhas do lado esquerdo;
4. compreender o espelhamento do right join;
5. demonstrar full join com conjuntos controlados;
6. gerar combinações com cross join;
7. comparar filtros no `ON` e no `WHERE`;
8. combinar mais de duas tabelas;
9. observar multiplicidade;
10. analisar armadilhas;
11. resolver o exercício;
12. validar que nenhuma linha foi modificada;
13. fazer o commit.

---

## Conceito essencial

### O que e join

Join é uma operação que combina linhas provenientes de table expressions.

Exemplo:

```sql
SELECT
    os.codigo,
    c.nome
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id;
```

A consulta possui:

```text
app.ordem_servico:
primeira origem.

app.cliente:
segunda origem.

INNER JOIN:
tipo da combinação.

ON c.id = os.cliente_id:
condição que determina correspondência.
```

Para cada ordem, PostgreSQL procura clientes cujo `id` corresponde ao `cliente_id`.

A saída pode usar colunas das duas tabelas.

---

### Foreign key nao executa join automaticamente

A foreign key protege a relação entre colunas, mas não inclui dados relacionados no resultado. Para consultar o nome do cliente, ainda é necessário declarar `JOIN ... ON ...`.

### Alias em joins

Aliases reduzem repetição e deixam a consulta legível:

```sql
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
```

Use nomes reconhecíveis, como `c`, `p`, `os`, `a` e `eos`, e mantenha a convenção estável.

### Colunas com o mesmo nome

Tabelas diferentes possuem colunas como:

```text
id;
codigo;
status;
criado_em.
```

Em um join, escrever apenas:

```sql
SELECT id
```

pode gerar ambiguidade.

Use:

```sql
SELECT
    os.id AS ordem_id,
    c.id AS cliente_id
```

A qualificação informa de qual tabela vem cada coluna.

O alias da saída explica o papel no resultado.

---

### INNER JOIN

`INNER JOIN` retorna apenas pares de linhas que satisfazem a condição do `ON`.

Exemplo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    c.id AS cliente_id,
    c.nome AS cliente_nome
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
ORDER BY os.id;
```

Se uma ordem não possui cliente correspondente, ela não aparece.

Se um cliente não possui ordens, ele também não aparece.

No modelo atual, a foreign key e o `NOT NULL` garantem que toda ordem possua cliente. Portanto, todas as ordens devem encontrar correspondência.

Isso não significa que todos os clientes aparecem uma vez. Um cliente com duas ordens aparece em duas linhas.

---

### JOIN sem a palavra INNER

`JOIN` e `INNER JOIN` são equivalentes. Nos primeiros exemplos, o tipo será escrito por extenso para tornar a intenção explícita.

### Condicao ON

A condição de junção costuma relacionar:

```text
primary key;
foreign key.
```

Exemplo:

```sql
ON c.id = os.cliente_id
```

Mas a sintaxe não exige uma foreign key física.

Você pode juntar qualquer expressão booleana compatível.

A pergunta não é apenas:

```text
o SQL aceita?
```

A pergunta correta é:

```text
essa condição representa uma relação verdadeira do domínio?
```

Evite juntar tabelas por colunas que coincidem por acaso.

---

### Multiplicidade um para muitos

No modelo:

```text
um cliente possui várias ordens;
uma ordem possui várias atividades;
uma ordem possui vários eventos.
```

Quando você junta cliente e ordem:

```text
uma linha de cliente pode combinar com várias ordens.
```

Quando junta ordem e atividade:

```text
uma linha de ordem pode combinar com várias atividades.
```

O resultado repete as colunas do lado “um” para cada linha do lado “muitos”.

Isso não é duplicidade acidental.

É a representação tabular da cardinalidade.

---

### LEFT JOIN

`LEFT JOIN` retorna:

```text
todas as linhas do lado esquerdo;
as correspondências do lado direito;
NULL nas colunas da direita quando não há correspondência.
```

Forma:

```sql
SELECT
    c.id,
    c.nome,
    os.id AS ordem_id,
    os.codigo AS ordem_codigo
FROM app.cliente AS c
LEFT JOIN app.ordem_servico AS os
    ON os.cliente_id = c.id
ORDER BY c.id, os.id;
```

A tabela preservada é:

```text
app.cliente
```

porque está à esquerda.

Se um cliente não possuir ordens, ele continuará aparecendo, com colunas da ordem em `NULL`.

No dataset atual, todos os três clientes possuem ordens. Para observar ausência sem alterar o banco, o laboratório também usará table expressions com `VALUES`.

---

### Tabela preservada

Em outer joins, pergunte:

```text
qual conjunto precisa aparecer mesmo sem correspondência?
```

Se a resposta for “todos os clientes”, escreva:

```sql
cliente
LEFT JOIN ordem
```

Se a resposta for “todas as ordens”, escreva:

```sql
ordem
LEFT JOIN atividade
```

A posição das tabelas comunica a intenção.

---

### RIGHT JOIN

`RIGHT JOIN` preserva todas as linhas do lado direito.

Exemplo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo
FROM app.atividade AS a
RIGHT JOIN app.ordem_servico AS os
    ON os.id = a.ordem_servico_id
ORDER BY os.id, a.id;
```

A consulta preserva todas as ordens porque `ordem_servico` está à direita.

Ela pode ser reescrita como:

```sql
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
```

As duas versões representam o mesmo conjunto lógico.

Em muitos times, `LEFT JOIN` é preferido por manter a tabela principal no início da leitura.

`RIGHT JOIN` continua válido e precisa ser compreendido, mas não deve ser usado apenas para variar a sintaxe.

---

### FULL JOIN

`FULL JOIN` retorna:

```text
linhas correspondentes;
linhas sem correspondência da esquerda;
linhas sem correspondência da direita.
```

Quando não há correspondência, as colunas do outro lado recebem `NULL`.

No domínio protegido por foreign keys, criar uma ordem órfã apenas para demonstrar full join seria incorreto.

Por isso, usaremos conjuntos derivados com `VALUES`:

```sql
SELECT
    e.codigo AS codigo_esquerda,
    d.codigo AS codigo_direita
FROM (
    VALUES
        ('A'),
        ('B')
) AS e(codigo)
FULL JOIN (
    VALUES
        ('B'),
        ('C')
) AS d(codigo)
    ON d.codigo = e.codigo
ORDER BY
    COALESCE(e.codigo, d.codigo);
```

Resultado conceitual:

```text
A:
somente esquerda.

B:
correspondência.

C:
somente direita.
```

`COALESCE` será aprofundado em uma aula futura de funções. Aqui, ele é usado apenas para ordenar pelo valor disponível.

---

### Quando usar FULL JOIN

Use full join para comparar fontes independentes e preservar divergências dos dois lados, como reconciliação entre sistemas. Quando existe um conjunto claramente principal, left join costuma comunicar melhor.

### CROSS JOIN

`CROSS JOIN` produz todas as combinações entre duas fontes.

Se a esquerda possui `N` linhas e a direita possui `M` linhas, o resultado possui:

```text
N × M linhas.
```

Exemplo:

```sql
SELECT
    c.nome,
    turno.nome AS turno
FROM app.cliente AS c
CROSS JOIN (
    VALUES
        ('MANHA'),
        ('TARDE')
) AS turno(nome)
ORDER BY c.id, turno.nome;
```

Com três clientes e dois turnos:

```text
3 × 2 = 6 linhas.
```

Não existe cláusula `ON` no cross join.

Cada linha da esquerda combina com cada linha da direita.

---

### Uso consciente de CROSS JOIN

Cross join é útil para gerar grades e combinações controladas. Antes de executar, estime `N × M`. Em fontes grandes, a quantidade pode crescer rapidamente.

### Produto cartesiano acidental

A sintaxe antiga:

```sql
SELECT
    c.nome,
    os.codigo
FROM app.cliente AS c,
     app.ordem_servico AS os;
```

sem condição produz produto cartesiano.

É equivalente a um cross join.

Quando a intenção era relacionar cliente e ordem, isso é um erro.

Prefira sintaxe explícita:

```sql
INNER JOIN ... ON ...
```

Ela separa claramente:

```text
relação;
filtro.
```

---

### ON e WHERE no INNER JOIN

Em inner join, uma condição pode muitas vezes ser movida entre `ON` e `WHERE` sem mudar o conjunto final.

Exemplo:

```sql
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.status = 'AGENDADA'
```

Pode produzir o mesmo resultado que:

```sql
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE a.status = 'AGENDADA'
```

Mesmo assim, organize por intenção:

```text
ON:
como as fontes se relacionam.

WHERE:
quais linhas do resultado são desejadas.
```

Essa separação melhora a leitura.

---

### ON e WHERE no LEFT JOIN

Em left join, mover um filtro pode mudar o resultado.

Considere:

```sql
SELECT
    os.id,
    os.codigo,
    a.id AS atividade_id,
    a.status
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.status = 'CONCLUIDA'
ORDER BY os.id, a.id;
```

Todas as ordens são preservadas.

Quando não existe atividade concluída, as colunas de `a` ficam nulas.

Agora:

```sql
SELECT
    os.id,
    os.codigo,
    a.id AS atividade_id,
    a.status
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE a.status = 'CONCLUIDA'
ORDER BY os.id, a.id;
```

O `WHERE` rejeita as linhas em que `a.status` é `NULL`.

O resultado passa a conter apenas ordens com atividade concluída, aproximando-se do comportamento de inner join.

Regra:

```text
filtro no ON:
controla quais linhas da direita correspondem, preservando a esquerda.

filtro no WHERE:
filtra o resultado depois da junção.
```

---

### USING

`USING (coluna)` pode ser usado quando as duas fontes possuem a mesma coluna de junção. Como o domínio usa nomes como `cliente.id` e `ordem_servico.cliente_id`, `ON` comunica melhor a relação.

### NATURAL JOIN

`NATURAL JOIN` escolhe automaticamente colunas com nomes iguais. Isso cria acoplamento implícito: uma nova coluna pode mudar a junção sem alteração no SQL. Nesta formação, prefira `JOIN ... ON ...`.

### Combinar mais de duas tabelas

Você pode encadear joins:

```sql
SELECT
    os.codigo AS ordem_codigo,
    c.nome AS cliente_nome,
    p.nome AS produto_nome
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
INNER JOIN app.produto AS p
    ON p.id = os.produto_id
ORDER BY os.id;
```

Leia em sequência:

1. comece em ordem;
2. junte cliente;
3. junte produto;
4. projete colunas;
5. ordene.

Para adicionar atividades:

```sql
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
```

Agora cada ordem pode aparecer várias vezes.

---

### Multiplicacao entre relacionamentos um para muitos

Considere uma ordem com:

```text
2 atividades;
3 eventos.
```

Se você juntar ao mesmo tempo:

```text
ordem -> atividade;
ordem -> evento;
```

o resultado pode ter:

```text
2 × 3 = 6 linhas para a mesma ordem.
```

Cada atividade combina com cada evento da ordem.

Isso não significa que existem seis atividades ou seis eventos.

Significa que dois relacionamentos um-para-muitos foram expandidos na mesma tabela resultante.

Esse fenômeno é essencial para consultas e relatórios.

Agregações serão estudadas na aula 286. Por enquanto, aprenda a prever a multiplicidade antes de interpretar o resultado.

---

### DISTINCT nao corrige modelagem automaticamente

Quando aparecem repetições, investigue cardinalidade, condição `ON`, projeção e relações um-para-muitos antes de usar `DISTINCT`. Ele pode esconder a causa sem corrigir a consulta.

## Mao na massa guiada

### 1. Confirmar o ambiente

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
  -Path "labs\m12\aula-280-joins-inner-left-right-full-cross-criterio\sql"

Set-Location `
  "labs\m12\aula-280-joins-inner-left-right-full-cross-criterio"
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

SELECT
    (SELECT count(*) FROM app.cliente WHERE id BETWEEN 930001 AND 930099)
        AS clientes,
    (SELECT count(*) FROM app.produto WHERE id BETWEEN 930001 AND 930099)
        AS produtos,
    (
        SELECT count(*)
        FROM app.ordem_servico
        WHERE id BETWEEN 930001 AND 930099
    ) AS ordens,
    (
        SELECT count(*)
        FROM app.atividade
        WHERE id BETWEEN 930001 AND 930099
    ) AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id BETWEEN 930001 AND 930099
    ) AS eventos;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-280-joins-inner-left-right-full-cross-criterio\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado esperado:

```text
3 | 3 | 4 | 6 | 4
```

---

### 4. Criar 01_inner_join.sql

Crie:

```text
sql/01_inner_join.sql
```

Conteúdo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    os.status AS ordem_status,
    c.id AS cliente_id,
    c.nome AS cliente_nome
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id;

SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    p.codigo AS produto_codigo,
    p.nome AS produto_nome,
    os.valor_previsto
FROM app.ordem_servico AS os
INNER JOIN app.produto AS p
    ON p.id = os.produto_id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id;

SELECT
    os.codigo AS ordem_codigo,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    a.status AS atividade_status
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;
```

Execute e observe a repetição da ordem que possui várias atividades.

---

### 5. Criar 02_left_join.sql

Crie:

```text
sql/02_left_join.sql
```

Conteúdo:

```sql
SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    os.id AS ordem_id,
    os.codigo AS ordem_codigo
FROM app.cliente AS c
LEFT JOIN app.ordem_servico AS os
    ON os.cliente_id = c.id
   AND os.id BETWEEN 930001 AND 930099
WHERE c.id BETWEEN 930001 AND 930099
ORDER BY c.id, os.id;

SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;

SELECT
    e.id AS esquerda_id,
    e.nome AS esquerda_nome,
    d.id AS direita_id,
    d.descricao AS direita_descricao
FROM (
    VALUES
        (1, 'UM'),
        (2, 'DOIS'),
        (3, 'TRES')
) AS e(id, nome)
LEFT JOIN (
    VALUES
        (2, 'correspondencia dois'),
        (3, 'correspondencia tres')
) AS d(id, descricao)
    ON d.id = e.id
ORDER BY e.id;
```

A terceira consulta mostra a linha `1` preservada com colunas nulas do lado direito.

---

### 6. Criar 03_right_join.sql

Crie:

```text
sql/03_right_join.sql
```

Conteúdo:

```sql
SELECT
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    os.id AS ordem_id,
    os.codigo AS ordem_codigo
FROM app.atividade AS a
RIGHT JOIN app.ordem_servico AS os
    ON os.id = a.ordem_servico_id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;

SELECT
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    os.id AS ordem_id,
    os.codigo AS ordem_codigo
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;
```

Compare os resultados.

Registre no README por que a segunda forma costuma ser lida com mais facilidade.

---

### 7. Criar 04_full_join.sql

Crie:

```text
sql/04_full_join.sql
```

Conteúdo:

```sql
SELECT
    e.codigo AS codigo_esquerda,
    e.descricao AS descricao_esquerda,
    d.codigo AS codigo_direita,
    d.descricao AS descricao_direita
FROM (
    VALUES
        ('A', 'somente esquerda'),
        ('B', 'presente nos dois')
) AS e(codigo, descricao)
FULL JOIN (
    VALUES
        ('B', 'presente nos dois'),
        ('C', 'somente direita')
) AS d(codigo, descricao)
    ON d.codigo = e.codigo
ORDER BY
    COALESCE(e.codigo, d.codigo);

SELECT
    e.id AS esquerda_id,
    d.id AS direita_id
FROM (
    VALUES
        (1),
        (2),
        (4)
) AS e(id)
FULL JOIN (
    VALUES
        (2),
        (3),
        (4)
) AS d(id)
    ON d.id = e.id
ORDER BY
    COALESCE(e.id, d.id);
```

Identifique:

```text
somente esquerda;
correspondência;
somente direita.
```

---

### 8. Criar 05_cross_join.sql

Crie:

```text
sql/05_cross_join.sql
```

Conteúdo:

```sql
SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    turno.nome AS turno
FROM app.cliente AS c
CROSS JOIN (
    VALUES
        ('MANHA'),
        ('TARDE')
) AS turno(nome)
WHERE c.id BETWEEN 930001 AND 930099
ORDER BY c.id, turno.nome;

SELECT
    prioridade.nome AS prioridade,
    status.nome AS status
FROM (
    VALUES
        ('NORMAL'),
        ('ALTA')
) AS prioridade(nome)
CROSS JOIN (
    VALUES
        ('ABERTA'),
        ('AGENDADA'),
        ('CONCLUIDA')
) AS status(nome)
ORDER BY prioridade.nome, status.nome;
```

Antes de executar a segunda consulta, calcule:

```text
2 prioridades × 3 status = 6 linhas.
```

---

### 9. Criar 06_on_vs_where.sql

Crie:

```text
sql/06_on_vs_where.sql
```

Conteúdo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    a.id AS atividade_id,
    a.status AS atividade_status
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.status = 'CONCLUIDA'
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;

SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    a.id AS atividade_id,
    a.status AS atividade_status
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930099
  AND a.status = 'CONCLUIDA'
ORDER BY os.id, a.id;
```

Compare:

```text
primeira:
todas as ordens, com atividade concluída quando existir.

segunda:
somente ordens que possuem atividade concluída.
```

---

### 10. Criar 07_multiplos_joins.sql

Crie:

```text
sql/07_multiplos_joins.sql
```

Conteúdo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    os.status AS ordem_status,
    c.nome AS cliente_nome,
    p.nome AS produto_nome
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
INNER JOIN app.produto AS p
    ON p.id = os.produto_id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id;

SELECT
    os.codigo AS ordem_codigo,
    c.nome AS cliente_nome,
    p.nome AS produto_nome,
    a.codigo AS atividade_codigo,
    a.status AS atividade_status
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
INNER JOIN app.produto AS p
    ON p.id = os.produto_id
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;
```

A segunda consulta retorna uma linha por atividade, não uma linha por ordem.

---

### 11. Criar 08_multiplicidade.sql

Crie:

```text
sql/08_multiplicidade.sql
```

Conteúdo:

```sql
SELECT
    os.codigo AS ordem_codigo,
    a.codigo AS atividade_codigo,
    eos.tipo AS evento_tipo
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
LEFT JOIN auditoria.evento_ordem_servico AS eos
    ON eos.ordem_servico_id = os.id
WHERE os.id = 930001
ORDER BY a.id, eos.id;

SELECT
    os.codigo AS ordem_codigo,
    a.codigo AS atividade_codigo
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id = 930001
ORDER BY a.id;

SELECT
    os.codigo AS ordem_codigo,
    eos.tipo AS evento_tipo
FROM app.ordem_servico AS os
LEFT JOIN auditoria.evento_ordem_servico AS eos
    ON eos.ordem_servico_id = os.id
WHERE os.id = 930001
ORDER BY eos.id;
```

Compare os três resultados e explique a multiplicação.

---

### 12. Criar 09_armadilhas_controladas.sql

Crie:

```text
sql/09_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Produto cartesiano acidental: execute apenas para observar o tamanho.
SELECT
    c.id AS cliente_id,
    os.id AS ordem_id
FROM app.cliente AS c
CROSS JOIN app.ordem_servico AS os
WHERE c.id BETWEEN 930001 AND 930099
  AND os.id BETWEEN 930001 AND 930099
ORDER BY c.id, os.id;

-- Condição correta.
SELECT
    c.id AS cliente_id,
    os.id AS ordem_id
FROM app.cliente AS c
INNER JOIN app.ordem_servico AS os
    ON os.cliente_id = c.id
WHERE c.id BETWEEN 930001 AND 930099
  AND os.id BETWEEN 930001 AND 930099
ORDER BY c.id, os.id;

-- Condição conceitualmente errada: IDs coincidem por acaso.
SELECT
    c.id AS cliente_id,
    p.id AS produto_id
FROM app.cliente AS c
INNER JOIN app.produto AS p
    ON p.id = c.id
WHERE c.id BETWEEN 930001 AND 930099
ORDER BY c.id;

-- Não use NATURAL JOIN em código do laboratório.
```

A terceira consulta pode retornar linhas, mas não representa uma relação válida do domínio.

---

### 13. Criar 10_exercicio.sql

Crie:

```text
sql/10_exercicio.sql
```

Implemente as missões da seção de exercício guiado.

---

### 14. Criar 11_validacao_final.sql

Crie:

```text
sql/11_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    os.codigo AS ordem_codigo,
    c.nome AS cliente_nome,
    p.nome AS produto_nome,
    os.status
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
INNER JOIN app.produto AS p
    ON p.id = os.produto_id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id;

SELECT
    os.codigo AS ordem_codigo,
    a.codigo AS atividade_codigo,
    a.status AS atividade_status
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930099
ORDER BY os.id, a.id;

SELECT
    (SELECT count(*) FROM app.cliente WHERE id BETWEEN 930001 AND 930099)
        AS clientes,
    (SELECT count(*) FROM app.produto WHERE id BETWEEN 930001 AND 930099)
        AS produtos,
    (
        SELECT count(*)
        FROM app.ordem_servico
        WHERE id BETWEEN 930001 AND 930099
    ) AS ordens,
    (
        SELECT count(*)
        FROM app.atividade
        WHERE id BETWEEN 930001 AND 930099
    ) AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id BETWEEN 930001 AND 930099
    ) AS eventos;
```

As contagens devem continuar:

```text
3 | 3 | 4 | 6 | 4
```

---

### 15. Criar README.md

Registre:

```text
Título:
Aula 280 - Joins inner left right full e cross com criterio.

Pré-requisito:
dataset da aula 277 e filtros da aula 279.

Objetivo:
combinar table expressions escolhendo o join conforme a pergunta.

Regra:
laboratório somente leitura.

Dataset:
3 clientes, 3 produtos, 4 ordens, 6 atividades e 4 eventos.

Próxima aula:
modelagem conceitual, entidades, atributos e relacionamentos.
```

Liste os scripts e explique a diferença entre `ON` e `WHERE` em outer joins.

---

## Entendendo o que foi feito

### Join reuniu dados separados

Você consultou nomes de cliente e produto sem repetir esses dados na tabela de ordem.

O modelo relacional permaneceu separado, e o resultado foi montado no momento da consulta.

---

### O tipo de join respondeu a uma pergunta

Você não escolheu joins por preferência estética.

Usou:

```text
INNER:
somente correspondências.

LEFT:
preservar a esquerda.

RIGHT:
preservar a direita.

FULL:
preservar os dois lados.

CROSS:
todas as combinações.
```

---

### Cardinalidade explicou repeticoes

Um cliente com duas ordens apareceu duas vezes.

Uma ordem com duas atividades apareceu duas vezes.

Ao combinar dois relacionamentos um-para-muitos, o número de linhas pôde ser multiplicado.

---

### ON e WHERE nao foram intercambiaveis em outer join

O filtro no `ON` limitou correspondências mantendo a tabela preservada.

O filtro no `WHERE` eliminou linhas nulas depois da junção.

Essa diferença é uma das decisões mais importantes em joins.

---

### Dataset permaneceu intacto

Todos os exemplos foram de leitura.

Os casos artificiais de ausência usaram `VALUES`, sem criar registros órfãos ou alterar o modelo protegido.

---

## Erros comuns importantes

### Column reference is ambiguous

Duas tabelas possuem uma coluna com o mesmo nome.

Qualifique:

```sql
os.id
c.id
```

E use aliases de saída.

---

### Join retorna linhas demais

Possíveis causas:

- condição `ON` ausente;
- condição incompleta;
- cardinalidade um-para-muitos;
- dois relacionamentos um-para-muitos combinados;
- produto cartesiano;
- tabela repetida.

Não adicione `DISTINCT` antes de diagnosticar.

---

### LEFT JOIN perdeu linhas da esquerda

Um filtro sobre a tabela direita foi colocado no `WHERE`.

Avalie mover a condição para o `ON`.

---

### Join retorna zero linhas

Verifique:

- condição;
- tipos;
- valores;
- filtro;
- aliases;
- sentido da relação;
- dataset.

---

### RIGHT JOIN ficou dificil de ler

Reescreva trocando a ordem das tabelas e use `LEFT JOIN`.

O resultado pode ficar mais alinhado à narrativa da consulta.

---

## Comandos uteis

### Inner join

```sql
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
```

### Left join

```sql
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
```

### Full join

```sql
FROM fonte_a AS a
FULL JOIN fonte_b AS b
    ON b.id = a.id
```

### Cross join

```sql
FROM fonte_a AS a
CROSS JOIN fonte_b AS b
```

---

## Exercicio guiado

No arquivo:

```text
sql/10_exercicio.sql
```

resolva as missões.

### Parte 1 - Ordem completa

Retorne:

```text
ordem id;
ordem código;
status;
cliente nome;
produto código;
produto nome;
valor previsto.
```

Use inner joins e ordene pelo ID da ordem.

---

### Parte 2 - Ordens e atividades

Retorne todas as ordens e suas atividades, mesmo quando não houver atividade.

Use `LEFT JOIN`.

Mostre:

```text
ordem código;
atividade código;
atividade status;
valor da mão de obra.
```

---

### Parte 3 - Atividades agendadas preservando ordens

Retorne todas as ordens.

Traga somente atividades com status `AGENDADA`.

O filtro precisa ficar no `ON`.

Depois escreva uma segunda consulta com o filtro no `WHERE` e explique a diferença.

---

### Parte 4 - Cliente e quantidade visual de ordens

Sem usar `GROUP BY`, liste clientes e ordens com `LEFT JOIN`.

Explique por que o nome do cliente pode aparecer várias vezes.

Não tente agregar ainda.

---

### Parte 5 - Cross join controlado

Combine os três clientes do dataset com:

```text
MANHA;
TARDE;
NOITE.
```

Preveja a quantidade antes de executar.

---

### Parte 6 - Full join didatico

Crie dois conjuntos com `VALUES`:

```text
esquerda:
1, 2, 3.

direita:
2, 3, 4.
```

Use full join e identifique:

```text
somente esquerda;
correspondência;
somente direita.
```

---

### Parte 7 - Multiplicidade

Para uma ordem que possua atividades e evento:

1. junte ordem e atividade;
2. junte ordem e evento;
3. junte as três fontes;
4. compare a quantidade visual de linhas;
5. explique a multiplicação.

---

### Parte 8 - Explicar o criterio

No README, escolha uma consulta e responda:

1. qual é a tabela principal;
2. qual tabela precisa ser preservada;
3. qual é a condição de relacionamento;
4. por que o join escolhido é adequado;
5. qual é a cardinalidade esperada;
6. onde os filtros foram colocados;
7. quantas linhas podem aparecer por registro principal.

---

## Criterios de aceite

- o laboratório oficial da aula 280 existe;
- o dataset foi preservado;
- nenhum script altera dados;
- aliases claros foram usados;
- colunas ambíguas foram qualificadas;
- `INNER JOIN` foi praticado;
- `LEFT JOIN` foi praticado;
- `RIGHT JOIN` foi compreendido e reescrito como left;
- `FULL JOIN` foi demonstrado com conjuntos controlados;
- `CROSS JOIN` foi praticado com cardinalidade prevista;
- foreign key e join foram diferenciados;
- tabela preservada foi identificada;
- `ON` e `WHERE` foram comparados em outer join;
- filtros no `ON` preservaram linhas da esquerda;
- múltiplos joins foram encadeados;
- relações um-para-muitos produziram repetição esperada;
- multiplicação entre atividades e eventos foi compreendida;
- produto cartesiano acidental foi reconhecido;
- `NATURAL JOIN` foi evitado;
- `DISTINCT` não foi usado como correção automática;
- joins não foram confundidos com modelagem conceitual;
- o exercício foi concluído;
- as contagens finais continuam 3, 3, 4, 6 e 4;
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
  labs/m12/aula-280-joins-inner-left-right-full-cross-criterio
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): combinar tabelas com joins"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
inner join;
outer joins;
cross join;
on e where;
multiplicidade;
consultas relacionais.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você reuniu dados separados sem desfazer a modelagem relacional.

Aprendeu:

```text
INNER JOIN;
LEFT JOIN;
RIGHT JOIN;
FULL JOIN;
CROSS JOIN;
ON;
aliases;
tabela preservada;
linhas correspondentes;
linhas sem correspondência;
produto cartesiano;
multiplicidade;
filtro no ON;
filtro no WHERE.
```

As regras principais foram:

```text
join deve representar uma relação real;

foreign key protege, join consulta;

inner retorna correspondências;

outer join preserva um ou ambos os lados;

cross join produz todas as combinações;

filtro no ON e no WHERE pode mudar outer join;

uma relação um-para-muitos repete o lado um;

dois relacionamentos um-para-muitos podem multiplicar linhas;

DISTINCT não substitui diagnóstico;

NATURAL JOIN esconde condição;
prefira ON explícito.
```

A próxima aula será:

```text
281 - M12.11 - Modelagem conceitual entidades atributos relacionamentos
```

Nela, você vai sair temporariamente da sintaxe SQL e formalizar o pensamento de domínio:

- entidade;
- atributo;
- relacionamento;
- identidade;
- regra de negócio;
- cardinalidade em nível conceitual;
- opcionalidade;
- fronteira do modelo;
- nomes do domínio;
- diferença entre modelo conceitual, lógico e físico;
- diagrama inicial de Ordem de Serviço.

Os joins mostraram como o banco combina dados. A modelagem conceitual mostrará por que essas entidades e relações existem.

---

# Material complementar

## Checkpoint final

- [ ] Pratiquei os cinco tipos de join da aula.
- [ ] Diferenciei filtros no `ON` e no `WHERE`.
- [ ] Expliquei multiplicidade e produto cartesiano.
- [ ] Mantive o dataset e fiz o commit recomendado.

---

## Troubleshooting adicional

### FULL JOIN parece desnecessario

Em domínios protegidos por foreign keys, pode haver correspondência garantida em uma direção. Full join aparece com mais frequência em reconciliação entre fontes independentes.

### CROSS JOIN ficou enorme

Calcule `N × M` antes de executar.

Aplique-o apenas a dimensões controladas ou quando todas as combinações fazem sentido.

### Condicao ON usa colunas erradas

Uma coincidência de valores não prova uma relação.

Confira primary key, foreign key e significado do domínio.

### Filtro de outer join

Se o objetivo é preservar a tabela principal, condições sobre a tabela opcional geralmente precisam ser avaliadas no `ON`.

### Repeticao inesperada

Projete também as chaves dos lados muitos. Elas ajudam a revelar quais linhas são realmente distintas.

---

## Perguntas de revisao

1. O que um join combina?
2. Qual o papel do `ON`?
3. Foreign key executa join automaticamente?
4. O que inner join retorna?
5. O que left join preserva?
6. O que right join preserva?
7. Como reescrever right join?
8. O que full join retorna?
9. Quando full join é útil?
10. O que cross join produz?
11. Como prever a quantidade de um cross join?
12. Por que aliases são importantes?
13. Por que qualificar `id`?
14. O que acontece em uma relação um-para-muitos?
15. Por que ON e WHERE diferem em left join?
16. O que é produto cartesiano acidental?
17. Por que evitar natural join?
18. Por que DISTINCT não deve ser a primeira correção?

---

## Roteiro de resposta

1. Join combina linhas de duas table expressions.
2. `ON` define a correspondência.
3. Foreign key protege a relação; não executa a consulta.
4. Inner retorna correspondências.
5. Left preserva a esquerda.
6. Right preserva a direita e pode ser reescrito como left.
7. Full preserva ambos os lados.
8. Cross produz todas as combinações.
9. `N × M` estima a cardinalidade do cross join.
10. Aliases eliminam repetição e ambiguidade.
11. O lado um se repete para cada linha do lado muitos.
12. Filtro no `WHERE` pode eliminar linhas nulas de um outer join.
13. Produto cartesiano surge sem relação desejada.
14. Natural join esconde a condição.
15. `DISTINCT` não substitui diagnóstico.

## Desafio opcional

Crie uma consulta que retorne:

```text
ordem;
cliente;
produto;
atividade;
evento.
```

Use:

```text
inner join para cliente e produto;
left join para atividade e evento.
```

Escolha uma única ordem.

Antes de executar, conte:

```text
quantas atividades?
quantos eventos?
qual multiplicação é esperada?
```

Depois compare a previsão com o resultado.

Não use agregação nem `DISTINCT`.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 280 - M12.10 - Joins inner left right full e cross com criterio

- Combinei tabelas relacionadas com joins.
- Diferenciei foreign key de operação de consulta.
- Usei aliases e qualifiquei colunas ambíguas.
- Pratiquei `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN` e `CROSS JOIN`.
- Identifiquei qual tabela é preservada em outer joins.
- Reescrevi right join como left join.
- Usei conjuntos com `VALUES` para demonstrar full join sem alterar o dataset.
- Comparei filtros no `ON` e no `WHERE`.
- Entendi a multiplicidade de relações um-para-muitos.
- Observei a multiplicação ao combinar atividades e eventos.
- Reconheci produto cartesiano acidental.
- Evitei `NATURAL JOIN` e `DISTINCT` como correção automática.
- Mantive o dataset inalterado.
- Próxima aula: modelagem conceitual, entidades, atributos e relacionamentos.
```

---

## Referencia tecnica curta

```text
INNER JOIN:
somente correspondências.

LEFT JOIN:
preserva a esquerda.

RIGHT JOIN:
preserva a direita.

FULL JOIN:
preserva os dois lados.

CROSS JOIN:
todas as combinações.

ON:
condição de correspondência.

WHERE:
filtro do resultado.

1:N:
o lado um se repete para cada linha do lado muitos.
```

Regra final:

```text
escolha o join pela pergunta e preveja a cardinalidade antes de confiar no resultado.
```
