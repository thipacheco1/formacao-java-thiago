# 288 - M12.18 - CTE common table expressions

## Apresentacao da aula

Na aula 287, você usou consultas dentro de outras consultas.

Praticou:

```text
subquery escalar;
subquery não correlacionada;
subquery correlacionada;
IN;
EXISTS;
NOT EXISTS;
subquery no SELECT;
subquery no FROM.
```

Esses recursos permitiram construir consultas em camadas. Porém, à medida que uma instrução cresce, subqueries aninhadas podem ficar difíceis de ler, testar e explicar.

Considere a ideia:

```text
primeiro:
calcular um resumo de atividades por ordem;

depois:
combinar o resumo com as ordens;

por fim:
filtrar apenas os resultados relevantes.
```

Uma subquery em `FROM` consegue fazer isso, mas o resultado intermediário fica cercado por parênteses e recebe um alias somente depois de toda a definição.

Uma Common Table Expression permite nomear essa etapa antes da consulta principal.

A sintaxe começa com:

```sql
WITH
```

Exemplo:

```sql
WITH resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
)
SELECT
    *
FROM resumo_atividades;
```

A CTE `resumo_atividades` existe somente durante essa instrução.

Ela não cria uma tabela permanente.

Ela não cria uma view.

Ela não permanece disponível para a próxima consulta.

Nesta aula, você vai aprender a usar CTEs para:

- nomear resultados intermediários;
- separar uma consulta em etapas;
- encadear várias transformações;
- reutilizar um resultado dentro da mesma instrução;
- agregar antes de combinar tabelas;
- tornar relatórios mais legíveis;
- comparar CTE com subquery em `FROM`;
- compreender introduções a `MATERIALIZED` e `NOT MATERIALIZED`;
- construir uma CTE recursiva controlada.

O laboratório será somente leitura.

Você não usará CTEs para `INSERT`, `UPDATE`, `DELETE` ou `MERGE`, embora o PostgreSQL ofereça formas de `WITH` ligadas a comandos de modificação. Transações e operações de escrita em múltiplas etapas pertencem a outros pontos da formação.

A próxima aula será sobre views e materialized views. Portanto, uma diferença precisa ficar clara desde já:

```text
CTE:
resultado nomeado de uma única instrução.

View:
objeto persistente no catálogo que encapsula uma consulta.

Materialized view:
objeto persistente que armazena fisicamente o resultado.
```

Ao final desta aula, você deverá conseguir:

- explicar o que é uma CTE;
- escrever `WITH nome AS (...)`;
- consumir uma CTE na consulta principal;
- criar várias CTEs;
- fazer uma CTE depender de outra anterior;
- reutilizar uma CTE na mesma instrução;
- aplicar agregação dentro da CTE;
- comparar CTE e subquery derivada;
- reconhecer o escopo de uma CTE;
- compreender introduções a materialização;
- criar uma CTE recursiva simples;
- manter consultas complexas organizadas.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
286:
GROUP BY, HAVING e agregações.

287:
subqueries correlacionadas e não correlacionadas.

288:
CTE common table expressions.

289:
views e materialized views conceitual.

290:
funções de data, texto, números e CASE WHEN.

291:
índices B-tree, unique e critérios de uso.

292:
EXPLAIN, EXPLAIN ANALYZE e leitura de plano.
```

Na aula 287, você criou tabelas derivadas:

```sql
SELECT
    resumo.ordem_servico_id,
    resumo.valor_total
FROM (
    SELECT
        ordem_servico_id,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
) AS resumo;
```

Nesta aula, a mesma lógica poderá ser escrita como:

```sql
WITH resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
)
SELECT
    resumo.ordem_servico_id,
    resumo.valor_total
FROM resumo;
```

A diferença principal é organizacional:

```text
a etapa intermediária recebe um nome antes da consulta principal.
```

CTEs não tornam qualquer consulta automaticamente mais rápida.

Elas também não substituem:

- joins;
- subqueries;
- views;
- tabelas temporárias;
- funções;
- modelagem adequada.

O objetivo é expressar etapas com clareza e permitir que a estrutura da consulta reflita o raciocínio.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-288-cte-common-table-expressions
```

Estrutura final:

```text
labs
└── m12
    └── aula-288-cte-common-table-expressions
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_primeira_cte.sql
            ├── 02_cte_com_agregacao.sql
            ├── 03_multiplas_ctes.sql
            ├── 04_ctes_dependentes.sql
            ├── 05_reutilizar_cte.sql
            ├── 06_cte_e_relatorios.sql
            ├── 07_materialized_not_materialized.sql
            ├── 08_cte_recursiva_introducao.sql
            ├── 09_comparar_subquery_cte.sql
            ├── 10_armadilhas_controladas.sql
            ├── 11_exercicio.sql
            └── 12_validacao_final.sql
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

O fluxo será:

1. confirmar o dataset;
2. criar uma CTE simples;
3. agregar dentro da CTE;
4. declarar várias CTEs;
5. criar dependência entre CTEs;
6. reutilizar uma etapa;
7. produzir relatórios;
8. conhecer controles de materialização;
9. praticar recursão de forma controlada;
10. comparar CTE com subquery;
11. analisar armadilhas;
12. resolver o exercício;
13. validar que nenhum dado foi alterado;
14. fazer o commit.

---

## Conceito essencial

### O que e uma CTE

CTE significa:

```text
Common Table Expression.
```

Em português, pode ser entendida como:

```text
expressão de tabela comum.
```

Ela define uma consulta auxiliar nomeada que pode ser usada pela instrução principal.

Forma básica:

```sql
WITH nome_da_cte AS (
    SELECT ...
)
SELECT ...
FROM nome_da_cte;
```

Partes:

```text
WITH:
inicia a cláusula.

nome_da_cte:
nome do resultado intermediário.

AS:
liga o nome à consulta.

parênteses:
contêm a consulta auxiliar.

consulta principal:
consome a CTE.
```

---

### CTE nao e tabela permanente

Considere:

```sql
WITH atividades_pendentes AS (
    SELECT
        id,
        codigo
    FROM app.atividade
    WHERE status = 'PENDENTE'
)
SELECT
    *
FROM atividades_pendentes;
```

Após o ponto e vírgula, o nome:

```text
atividades_pendentes
```

deixa de existir.

Esta instrução seguinte falhará:

```sql
SELECT *
FROM atividades_pendentes;
```

A CTE possui escopo de uma instrução.

---

### CTE nao e view

Uma view é criada no catálogo:

```sql
CREATE VIEW ...
```

Depois pode ser consultada por outras instruções até ser alterada ou removida.

A CTE não é registrada como objeto do banco.

Ela serve para organizar uma consulta específica.

Na aula 289, você comparará essas alternativas em profundidade.

---

### Primeira CTE

Exemplo:

```sql
WITH atividades_pendentes AS (
    SELECT
        id,
        ordem_servico_id,
        codigo,
        valor_mao_obra
    FROM app.atividade
    WHERE status = 'PENDENTE'
)
SELECT
    id,
    ordem_servico_id,
    codigo,
    valor_mao_obra
FROM atividades_pendentes
ORDER BY id;
```

Leia em etapas:

1. construa o conjunto `atividades_pendentes`;
2. leia esse conjunto;
3. ordene o resultado.

O nome deve comunicar a informação produzida.

---

### Alias de colunas da CTE

Você pode nomear as colunas depois do nome da CTE:

```sql
WITH resumo (
    ordem_id,
    quantidade,
    valor_total
) AS (
    SELECT
        ordem_servico_id,
        count(*),
        sum(valor_mao_obra)
    FROM app.atividade
    GROUP BY ordem_servico_id
)
SELECT
    ordem_id,
    quantidade,
    valor_total
FROM resumo;
```

Essa forma pode ser útil quando as expressões internas não possuem aliases claros.

Na maioria dos exemplos do curso, os aliases serão definidos dentro da consulta:

```sql
count(*) AS quantidade
```

Isso mantém os nomes próximos das expressões.

---

### CTE com agregacao

Uma CTE pode encapsular um agrupamento:

```sql
WITH resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
)
SELECT
    *
FROM resumo_atividades;
```

Granularidade da CTE:

```text
uma linha por ordem_servico_id.
```

Antes de usar uma CTE agregada, registre sua granularidade.

Isso ajuda a prever joins posteriores.

---

### CTE e consulta principal

A consulta principal pode:

- filtrar a CTE;
- ordenar;
- limitar;
- combinar com tabelas;
- combinar com outras CTEs;
- agregar novamente quando necessário.

Exemplo:

```sql
WITH resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
)
SELECT
    ordem_servico_id,
    quantidade,
    valor_total
FROM resumo_atividades
WHERE valor_total > 250
ORDER BY
    valor_total DESC,
    ordem_servico_id;
```

A etapa interna produz o resumo.

A etapa externa seleciona os grupos desejados.

---

### Varias CTEs

Você pode declarar várias CTEs separadas por vírgula:

```sql
WITH
resumo_atividades AS (
    SELECT ...
),
resumo_eventos AS (
    SELECT ...
)
SELECT ...
```

Existe apenas uma palavra `WITH`.

Cada definição recebe nome próprio.

Exemplo:

```sql
WITH
resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades
    FROM app.atividade
    GROUP BY ordem_servico_id
),
resumo_eventos AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_eventos
    FROM auditoria.evento_ordem_servico
    GROUP BY ordem_servico_id
)
SELECT
    os.codigo,
    ra.quantidade_atividades,
    re.quantidade_eventos
FROM app.ordem_servico AS os
LEFT JOIN resumo_atividades AS ra
    ON ra.ordem_servico_id = os.id
LEFT JOIN resumo_eventos AS re
    ON re.ordem_servico_id = os.id;
```

Cada lado muitos foi agregado separadamente.

Isso evita multiplicar Atividades por Eventos antes da contagem.

---

### Ordem das CTEs

Uma CTE pode referenciar outra CTE definida anteriormente na mesma cláusula.

Exemplo:

```sql
WITH
resumo AS (
    SELECT ...
),
ordens_relevantes AS (
    SELECT ...
    FROM resumo
)
SELECT *
FROM ordens_relevantes;
```

A segunda etapa depende da primeira.

Em uma cláusula não recursiva, não tente referenciar uma CTE que ainda será declarada depois.

Organize as etapas na ordem em que os dados fluem.

---

### CTEs dependentes

Exemplo:

```sql
WITH
resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
),
ordens_com_maior_volume AS (
    SELECT
        ordem_servico_id,
        quantidade,
        valor_total
    FROM resumo_atividades
    WHERE quantidade >= 2
)
SELECT
    *
FROM ordens_com_maior_volume;
```

Raciocínio:

```text
etapa 1:
resumir.

etapa 2:
filtrar o resumo.

etapa principal:
apresentar.
```

Esse formato aproxima a consulta de um pipeline de transformação.

---

### Reutilizacao na mesma instrucao

Uma CTE pode ser referenciada mais de uma vez na consulta principal.

Exemplo conceitual:

```sql
WITH resumo AS (
    SELECT ...
)
SELECT ...
FROM resumo AS r1
JOIN resumo AS r2
    ON ...
```

Outro caso:

```sql
WITH media_geral AS (
    SELECT avg(valor_mao_obra) AS media
    FROM app.atividade
)
SELECT
    a.id,
    a.codigo,
    a.valor_mao_obra,
    mg.media
FROM app.atividade AS a
CROSS JOIN media_geral AS mg
WHERE a.valor_mao_obra > mg.media;
```

A CTE `media_geral` produz uma linha.

O `CROSS JOIN` disponibiliza o valor para comparar cada atividade.

---

### Nomear pela informacao produzida

Nomes ruins:

```text
cte1;
temp;
dados;
consulta;
resultado2.
```

Nomes melhores:

```text
resumo_atividades;
competencias_utilizadas;
ordens_com_alto_valor;
clientes_com_telefone_confirmado;
media_mao_obra.
```

O nome deve descrever o conjunto, não a ação de implementação.

---

### Granularidade

Toda CTE possui uma granularidade.

Exemplos:

```text
uma linha por atividade;

uma linha por ordem;

uma linha por competência;

uma linha por cliente e tipo de telefone;

uma única linha de média geral.
```

Antes de combinar uma CTE com outra relação, pergunte:

```text
qual é a chave lógica de cada linha da CTE?
```

Sem essa resposta, joins podem multiplicar resultados.

---

### CTE e subquery em FROM

Versão com subquery:

```sql
SELECT
    resumo.ordem_servico_id,
    resumo.valor_total
FROM (
    SELECT
        ordem_servico_id,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
) AS resumo;
```

Versão com CTE:

```sql
WITH resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    GROUP BY ordem_servico_id
)
SELECT
    resumo.ordem_servico_id,
    resumo.valor_total
FROM resumo;
```

As duas representam a mesma ideia.

Prefira CTE quando:

- a etapa merece nome;
- existem várias etapas;
- o resultado intermediário é reutilizado;
- a subquery aninhada compromete leitura.

Prefira subquery quando:

- a etapa é pequena;
- é usada uma vez;
- a consulta continua clara;
- o nome adicional não acrescentaria compreensão.

---

### CTE nao garante desempenho melhor

Uma CTE é uma construção de consulta.

Ela não é um comando:

```text
otimize esta parte.
```

O PostgreSQL pode incorporar uma CTE não recursiva e sem efeitos colaterais à consulta principal em determinadas condições.

Também pode tratá-la como resultado separado.

A decisão depende de:

- tipo da CTE;
- quantidade de referências;
- versão;
- opções de materialização;
- plano escolhido.

Na aula 292, você usará `EXPLAIN` e `EXPLAIN ANALYZE`.

Nesta aula, não conclua sobre performance apenas olhando a sintaxe.

---

### MATERIALIZED

PostgreSQL permite:

```sql
WITH resumo AS MATERIALIZED (
    SELECT ...
)
SELECT ...
FROM resumo;
```

`MATERIALIZED` solicita que o resultado da CTE seja calculado como uma etapa separada para a instrução.

Isso pode ser útil quando:

- a mesma etapa é reutilizada;
- você quer evitar reavaliação;
- existe uma razão confirmada pelo plano;
- o resultado intermediário funciona como fronteira de otimização.

Também pode impedir que filtros externos sejam empurrados para dentro da consulta.

Portanto, não use automaticamente.

---

### NOT MATERIALIZED

Forma:

```sql
WITH resumo AS NOT MATERIALIZED (
    SELECT ...
)
SELECT ...
FROM resumo;
```

Essa opção permite que a consulta seja integrada ao restante quando possível.

Ela pode ajudar o otimizador a aplicar filtros da consulta externa diretamente na origem.

Por outro lado, se a CTE for usada várias vezes, o trabalho interno pode ser repetido.

Regra:

```text
MATERIALIZED e NOT MATERIALIZED
não são preferências de estilo;
são decisões que devem ser confirmadas pelo plano.
```

Nesta aula, você praticará apenas a sintaxe e a semântica introdutória.

---

### CTE recursiva

Uma CTE recursiva pode referenciar o próprio resultado.

A cláusula usa:

```sql
WITH RECURSIVE
```

Exemplo simples:

```sql
WITH RECURSIVE numeros AS (
    SELECT 1 AS numero

    UNION ALL

    SELECT numero + 1
    FROM numeros
    WHERE numero < 5
)
SELECT
    numero
FROM numeros
ORDER BY numero;
```

Resultado:

```text
1;
2;
3;
4;
5.
```

---

### Termo ancora e termo recursivo

Uma CTE recursiva normalmente possui duas partes.

Termo âncora:

```sql
SELECT 1 AS numero
```

Ele inicia o conjunto.

Termo recursivo:

```sql
SELECT numero + 1
FROM numeros
WHERE numero < 5
```

Ele usa as linhas produzidas anteriormente para gerar novas linhas.

As partes são combinadas com:

```sql
UNION ALL
```

A condição de parada é essencial:

```sql
WHERE numero < 5
```

Sem critério correto, a recursão pode crescer indefinidamente até ser interrompida por erro, limite externo ou cancelamento.

---

### Recursao e hierarquia

CTEs recursivas são úteis para estruturas como:

- categorias e subcategorias;
- organogramas;
- árvore de diretórios;
- dependências;
- encadeamento de itens;
- componentes hierárquicos.

O modelo atual de Ordem de Serviço não possui uma hierarquia necessária para a aula.

Por isso, a prática usará conjuntos controlados com `VALUES`, sem alterar o banco.

---

### WITH RECURSIVE vale para a clausula

Quando a cláusula começa com:

```sql
WITH RECURSIVE
```

ela pode conter CTEs recursivas e não recursivas.

Nem toda CTE dentro dela precisa referenciar a si mesma.

Exemplo:

```sql
WITH RECURSIVE
estrutura AS (
    VALUES ...
),
arvore AS (
    ...
)
SELECT ...
```

A primeira CTE fornece os dados.

A segunda percorre a hierarquia.

---

### UNION e UNION ALL na recursao

`UNION ALL` preserva linhas e costuma ser a forma mais direta.

`UNION` remove duplicidades entre resultados, o que pode ajudar em alguns ciclos, mas possui custo e não substitui uma modelagem correta da condição de parada.

Nesta introdução, use `UNION ALL` com dados sem ciclos.

Detecção de ciclos e recursos avançados de busca ficam fora do escopo.

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
  -Path "labs\m12\aula-288-cte-common-table-expressions\sql"

Set-Location `
  "labs\m12\aula-288-cte-common-table-expressions"
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

SELECT count(*) AS eventos
FROM auditoria.evento_ordem_servico
WHERE id BETWEEN 930001 AND 930004;

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
  "labs\m12\aula-288-cte-common-table-expressions\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultados esperados:

```text
4 ordens;
6 atividades;
4 eventos;
4 competências;
6 associações.
```

---

### 4. Criar 01_primeira_cte.sql

Crie:

```text
sql/01_primeira_cte.sql
```

Conteúdo:

```sql
WITH atividades_pendentes AS (
    SELECT
        id,
        ordem_servico_id,
        codigo,
        descricao,
        valor_mao_obra
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
      AND status = 'PENDENTE'
)
SELECT
    id,
    ordem_servico_id,
    codigo,
    descricao,
    valor_mao_obra
FROM atividades_pendentes
ORDER BY
    ordem_servico_id,
    id;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-288-cte-common-table-expressions\sql\01_primeira_cte.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Depois tente executar somente:

```sql
SELECT *
FROM atividades_pendentes;
```

em uma nova instrução.

Ela deve falhar porque o escopo terminou.

---

### 5. Criar 02_cte_com_agregacao.sql

Crie:

```text
sql/02_cte_com_agregacao.sql
```

Conteúdo:

```sql
WITH resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS valor_total_mao_obra,
        avg(valor_mao_obra) AS valor_medio_mao_obra
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
)
SELECT
    ordem_servico_id,
    quantidade_atividades,
    valor_total_mao_obra,
    valor_medio_mao_obra
FROM resumo_atividades
WHERE valor_total_mao_obra > 200
ORDER BY
    valor_total_mao_obra DESC,
    ordem_servico_id;
```

Registre no README:

```text
granularidade da CTE:
uma linha por ordem_servico_id.
```

---

### 6. Criar 03_multiplas_ctes.sql

Crie:

```text
sql/03_multiplas_ctes.sql
```

Conteúdo:

```sql
WITH
resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS valor_total_mao_obra
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
),
resumo_eventos AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_eventos
    FROM auditoria.evento_ordem_servico
    WHERE id BETWEEN 930001 AND 930004
    GROUP BY ordem_servico_id
)
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    ra.quantidade_atividades,
    ra.valor_total_mao_obra,
    re.quantidade_eventos
FROM app.ordem_servico AS os
LEFT JOIN resumo_atividades AS ra
    ON ra.ordem_servico_id = os.id
LEFT JOIN resumo_eventos AS re
    ON re.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY os.id;
```

As duas relações muitos foram agregadas antes dos joins.

Isso evita multiplicar atividades por eventos.

---

### 7. Criar 04_ctes_dependentes.sql

Crie:

```text
sql/04_ctes_dependentes.sql
```

Conteúdo:

```sql
WITH
resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
),
ordens_relevantes AS (
    SELECT
        ordem_servico_id,
        quantidade,
        valor_total
    FROM resumo_atividades
    WHERE quantidade >= 2
       OR valor_total > 250
)
SELECT
    os.id,
    os.codigo,
    os.status,
    r.quantidade,
    r.valor_total
FROM ordens_relevantes AS r
INNER JOIN app.ordem_servico AS os
    ON os.id = r.ordem_servico_id
ORDER BY
    r.valor_total DESC,
    os.id;
```

A segunda CTE depende da primeira.

A consulta principal depende da segunda.

---

### 8. Criar 05_reutilizar_cte.sql

Crie:

```text
sql/05_reutilizar_cte.sql
```

Conteúdo:

```sql
WITH media_geral AS (
    SELECT
        avg(valor_mao_obra) AS valor
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
)
SELECT
    a.id,
    a.codigo,
    a.valor_mao_obra,
    mg.valor AS media_geral,
    a.valor_mao_obra - mg.valor AS diferenca
FROM app.atividade AS a
CROSS JOIN media_geral AS mg
WHERE a.id BETWEEN 930001 AND 930006
  AND a.valor_mao_obra > mg.valor
ORDER BY
    diferenca DESC,
    a.id;

WITH resumo_competencias AS (
    SELECT
        competencia_id,
        count(*) AS quantidade_atividades
    FROM app.atividade_competencia
    WHERE id BETWEEN 951001 AND 951006
    GROUP BY competencia_id
)
SELECT
    c.id,
    c.nome,
    r.quantidade_atividades
FROM app.competencia AS c
LEFT JOIN resumo_competencias AS r
    ON r.competencia_id = c.id
WHERE c.id BETWEEN 950001 AND 950004
ORDER BY c.id;
```

A segunda consulta preserva Competência sem associação.

---

### 9. Criar 06_cte_e_relatorios.sql

Crie:

```text
sql/06_cte_e_relatorios.sql
```

Conteúdo:

```sql
WITH
atividades_por_ordem AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS valor_total_mao_obra,
        min(valor_mao_obra) AS menor_valor,
        max(valor_mao_obra) AS maior_valor
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
),
eventos_por_ordem AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_eventos
    FROM auditoria.evento_ordem_servico
    WHERE id BETWEEN 930001 AND 930004
    GROUP BY ordem_servico_id
),
relatorio_ordens AS (
    SELECT
        os.id AS ordem_id,
        os.codigo AS ordem_codigo,
        os.status,
        apo.quantidade_atividades,
        apo.valor_total_mao_obra,
        apo.menor_valor,
        apo.maior_valor,
        epo.quantidade_eventos
    FROM app.ordem_servico AS os
    LEFT JOIN atividades_por_ordem AS apo
        ON apo.ordem_servico_id = os.id
    LEFT JOIN eventos_por_ordem AS epo
        ON epo.ordem_servico_id = os.id
    WHERE os.id BETWEEN 930001 AND 930004
)
SELECT
    ordem_id,
    ordem_codigo,
    status,
    quantidade_atividades,
    valor_total_mao_obra,
    menor_valor,
    maior_valor,
    quantidade_eventos
FROM relatorio_ordens
ORDER BY ordem_id;
```

Esse script organiza o relatório em três etapas nomeadas.

---

### 10. Criar 07_materialized_not_materialized.sql

Crie:

```text
sql/07_materialized_not_materialized.sql
```

Conteúdo:

```sql
WITH resumo AS MATERIALIZED (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
)
SELECT
    ordem_servico_id,
    quantidade,
    valor_total
FROM resumo
WHERE valor_total > 200
ORDER BY ordem_servico_id;

WITH resumo AS NOT MATERIALIZED (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
)
SELECT
    ordem_servico_id,
    quantidade,
    valor_total
FROM resumo
WHERE valor_total > 200
ORDER BY ordem_servico_id;
```

Os resultados devem ser equivalentes.

Não conclua qual versão é mais rápida.

Registre:

```text
a diferença precisa ser analisada pelo plano;
EXPLAIN será estudado na aula 292.
```

---

### 11. Criar 08_cte_recursiva_introducao.sql

Crie:

```text
sql/08_cte_recursiva_introducao.sql
```

Conteúdo:

```sql
WITH RECURSIVE numeros AS (
    SELECT 1 AS numero

    UNION ALL

    SELECT numero + 1
    FROM numeros
    WHERE numero < 5
)
SELECT
    numero
FROM numeros
ORDER BY numero;

WITH RECURSIVE
estrutura (
    id,
    nome,
    pai_id
) AS (
    VALUES
        (1, 'Serviços', NULL::integer),
        (2, 'Instalação', 1),
        (3, 'Manutenção', 1),
        (4, 'Preventiva', 3),
        (5, 'Corretiva', 3)
),
arvore (
    id,
    nome,
    pai_id,
    nivel,
    caminho
) AS (
    SELECT
        id,
        nome,
        pai_id,
        0 AS nivel,
        nome::text AS caminho
    FROM estrutura
    WHERE pai_id IS NULL

    UNION ALL

    SELECT
        e.id,
        e.nome,
        e.pai_id,
        a.nivel + 1,
        a.caminho || ' > ' || e.nome
    FROM estrutura AS e
    INNER JOIN arvore AS a
        ON a.id = e.pai_id
)
SELECT
    id,
    nome,
    pai_id,
    nivel,
    caminho
FROM arvore
ORDER BY
    caminho,
    id;
```

Identifique:

```text
termo âncora;
termo recursivo;
condição de relacionamento;
critério que impede crescimento infinito nos números.
```

A hierarquia não modifica o banco.

---

### 12. Criar 09_comparar_subquery_cte.sql

Crie:

```text
sql/09_comparar_subquery_cte.sql
```

Conteúdo:

```sql
-- Versão com subquery em FROM.
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
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
) AS resumo
WHERE resumo.valor_total > 200
ORDER BY resumo.ordem_servico_id;

-- Versão com CTE.
WITH resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
)
SELECT
    ordem_servico_id,
    quantidade,
    valor_total
FROM resumo
WHERE valor_total > 200
ORDER BY ordem_servico_id;
```

Compare:

- resultado;
- legibilidade;
- proximidade entre definição e uso;
- facilidade para adicionar uma segunda etapa;
- necessidade real de nomear o resultado.

---

### 13. Criar 10_armadilhas_controladas.sql

Crie:

```text
sql/10_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Erro: a CTE existe somente nesta instrução.
WITH dados AS (
    SELECT
        id,
        codigo
    FROM app.ordem_servico
    WHERE id BETWEEN 930001 AND 930004
)
SELECT *
FROM dados;

-- Execute separadamente para observar o erro:
-- SELECT * FROM dados;

-- Erro de ordem: a primeira CTE tenta usar uma CTE ainda não definida.
-- Execute manualmente.
-- WITH
-- segunda AS (
--     SELECT *
--     FROM primeira
-- ),
-- primeira AS (
--     SELECT 1 AS valor
-- )
-- SELECT *
-- FROM segunda;

-- CTE sem benefício real para um literal simples.
WITH valor AS (
    SELECT 1 AS numero
)
SELECT numero
FROM valor;

-- Recursão sem condição de parada seria perigosa.
-- Nunca execute:
-- WITH RECURSIVE infinito AS (
--     SELECT 1 AS numero
--     UNION ALL
--     SELECT numero + 1
--     FROM infinito
-- )
-- SELECT *
-- FROM infinito;
```

A CTE simples com literal é válida, mas não melhora a consulta.

Nem toda subquery precisa virar CTE.

---

### 14. Criar 11_exercicio.sql

Crie:

```text
sql/11_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Não crie view.

Não modifique dados.

---

### 15. Criar 12_validacao_final.sql

Crie:

```text
sql/12_validacao_final.sql
```

Conteúdo:

```sql
WITH
resumo_atividades AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS valor_total
    FROM app.atividade
    WHERE id BETWEEN 930001 AND 930006
    GROUP BY ordem_servico_id
),
resumo_competencias AS (
    SELECT
        atividade_id,
        count(*) AS quantidade_competencias
    FROM app.atividade_competencia
    WHERE id BETWEEN 951001 AND 951006
    GROUP BY atividade_id
)
SELECT
    os.id,
    os.codigo,
    ra.quantidade,
    ra.valor_total
FROM app.ordem_servico AS os
LEFT JOIN resumo_atividades AS ra
    ON ra.ordem_servico_id = os.id
WHERE os.id BETWEEN 930001 AND 930004
ORDER BY os.id;

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

### 16. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 288 - CTE common table expressions.

Objetivo:
nomear e organizar resultados intermediários dentro de uma instrução.

Recursos:
WITH;
várias CTEs;
CTEs dependentes;
reutilização;
agregação;
MATERIALIZED;
NOT MATERIALIZED;
WITH RECURSIVE.

Regra:
laboratório somente leitura.

Diferença:
CTE dura uma instrução;
view é objeto persistente;
materialized view armazena resultado.

Próxima aula:
views e materialized views conceitual.
```

Liste os scripts e informe a granularidade das principais CTEs.

---

## Entendendo o que foi feito

### Resultados intermediarios receberam nomes

Em vez de esconder agregações dentro de parênteses, você criou conjuntos como:

```text
resumo_atividades;
resumo_eventos;
relatorio_ordens.
```

A consulta passou a refletir etapas do raciocínio.

---

### Varias CTEs evitaram multiplicacao

Atividades e Eventos foram agregados separadamente.

Depois, os resumos foram combinados com Ordem.

Isso evitou uma entrada com:

```text
quantidade de atividades
multiplicada
pela quantidade de eventos.
```

---

### Dependencias criaram um pipeline

Uma CTE produziu dados para a CTE seguinte.

A ordem das definições documentou o fluxo.

---

### Escopo permaneceu local

Nenhuma CTE virou objeto permanente.

O nome deixou de existir ao final da instrução.

---

### Materializacao foi tratada com criterio

Você conheceu a sintaxe, mas não assumiu que `MATERIALIZED` ou `NOT MATERIALIZED` seria automaticamente melhor.

A decisão será validada por plano de execução em aula posterior.

---

### Recursao foi controlada

A CTE recursiva separou:

```text
termo âncora;
termo recursivo;
condição de parada ou avanço.
```

A prática usou dados pequenos e sem ciclos.

---

## Erros comuns importantes

### Relation does not exist depois da consulta

A CTE terminou com o ponto e vírgula.

Crie uma view se o nome precisar persistir, assunto da aula 289.

---

### CTE posterior foi referenciada antes

Reordene as definições para que a dependência venha depois da origem.

---

### Resultado duplicou linhas

A granularidade da CTE e da tabela combinada não foi compreendida.

Identifique a chave lógica de cada conjunto.

---

### CTE ficou mais dificil que a subquery

O nome ou a etapa não acrescentou clareza.

Use a forma mais simples que preserve compreensão.

---

### Recursao nao termina

A parte recursiva continua gerando linhas.

Revise a condição de parada e a possibilidade de ciclos.

---

## Comandos uteis

### CTE simples

```sql
WITH nome AS (
    SELECT ...
)
SELECT ...
FROM nome;
```

### Varias CTEs

```sql
WITH
primeira AS (
    SELECT ...
),
segunda AS (
    SELECT ...
    FROM primeira
)
SELECT *
FROM segunda;
```

### Materializacao

```sql
AS MATERIALIZED (...)
AS NOT MATERIALIZED (...)
```

### Recursao

```sql
WITH RECURSIVE nome AS (
    termo_ancora
    UNION ALL
    termo_recursivo
)
SELECT *
FROM nome;
```

---

## Exercicio guiado

No arquivo:

```text
sql/11_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Reescrever uma subquery

Pegue uma consulta da aula 287 que usa subquery em `FROM`.

Reescreva com CTE.

Compare:

- resultado;
- quantidade de linhas;
- nomes;
- legibilidade;
- facilidade de adicionar outra etapa.

---

### Parte 2 - Relatorio de Ordens

Crie três CTEs:

```text
atividades_por_ordem;
eventos_por_ordem;
ordens_resumidas.
```

Retorne:

```text
ordem;
status;
quantidade de atividades;
valor total de mão de obra;
quantidade de eventos.
```

Preserve todas as quatro ordens.

---

### Parte 3 - Competencias por Atividade

Crie:

```text
competencias_por_atividade.
```

Granularidade:

```text
uma linha por atividade_id.
```

Retorne todas as seis atividades com a quantidade de competências.

Atividades sem associação devem aparecer.

---

### Parte 4 - Clientes e Telefones

Crie:

```text
telefones_por_cliente.
```

Retorne:

```text
cliente;
quantidade total;
quantidade confirmada;
quantidade principal.
```

Não use subquery correlacionada.

Use agregação na CTE e `LEFT JOIN` na consulta principal.

---

### Parte 5 - CTEs dependentes

Crie:

```text
resumo_atividades;
ordens_acima_da_media.
```

A segunda deve calcular quais ordens possuem `valor_total` acima da média dos totais produzidos pela primeira.

Você pode reutilizar `resumo_atividades` em uma subquery escalar dentro da segunda CTE.

Não use `WITH` aninhado.

---

### Parte 6 - MATERIALIZED e NOT MATERIALIZED

Crie duas versões equivalentes de uma CTE de atividades.

Uma com:

```text
MATERIALIZED.
```

Outra com:

```text
NOT MATERIALIZED.
```

Confirme apenas que os resultados são iguais.

Registre que a comparação de desempenho aguarda `EXPLAIN`.

---

### Parte 7 - Recursao numerica

Crie uma CTE recursiva que gere:

```text
1 até 10.
```

Depois retorne:

```text
numero;
numero ao quadrado.
```

A recursão precisa possuir condição de parada.

---

### Parte 8 - Hierarquia controlada

Modele com `VALUES`:

```text
Atendimento;
Atendimento Técnico;
Atendimento Administrativo;
Instalação;
Manutenção.
```

Crie uma hierarquia de dois ou três níveis.

Retorne:

```text
id;
nome;
nível;
caminho.
```

Não crie tabela física.

---

### Parte 9 - Revisao de criterio

Para cada CTE do exercício, documente:

1. nome;
2. granularidade;
3. chave lógica;
4. origem;
5. filtros;
6. dependências;
7. quantidade de usos;
8. por que CTE foi escolhida em vez de subquery.

---

## Criterios de aceite

- o laboratório oficial da aula 288 existe;
- o arquivo e o H1 seguem a grade;
- o dataset anterior foi preservado;
- nenhum script modifica dados;
- uma CTE simples foi criada;
- o escopo de uma instrução foi compreendido;
- CTE e tabela permanente foram diferenciadas;
- CTE e view foram diferenciadas;
- CTE agregada foi praticada;
- a granularidade foi documentada;
- várias CTEs foram declaradas;
- uma CTE dependeu de outra anterior;
- um resultado foi reutilizado;
- relatórios foram organizados em etapas;
- agregações separadas evitaram multiplicação;
- CTE e subquery em `FROM` foram comparadas;
- `MATERIALIZED` foi introduzido;
- `NOT MATERIALIZED` foi introduzido;
- nenhuma conclusão de performance foi feita sem plano;
- uma CTE recursiva simples foi executada;
- termo âncora e termo recursivo foram identificados;
- condição de parada foi aplicada;
- nenhuma view foi criada;
- funções de janela não foram antecipadas;
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
  labs/m12/aula-288-cte-common-table-expressions
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): organizar consultas com ctes"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
WITH;
resultados intermediários;
múltiplas etapas;
agregações;
recursão controlada;
consultas somente leitura.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você nomeou etapas intermediárias de consultas SQL.

Aprendeu:

```text
WITH;
Common Table Expression;
escopo de uma instrução;
CTE simples;
CTE agregada;
múltiplas CTEs;
CTEs dependentes;
reutilização;
granularidade;
MATERIALIZED;
NOT MATERIALIZED;
WITH RECURSIVE;
termo âncora;
termo recursivo.
```

As regras principais foram:

```text
uma CTE existe somente na instrução atual;

CTE não é tabela permanente;

CTE não é view;

nomeie a CTE pela informação produzida;

documente a granularidade;

declare dependências na ordem correta;

não assuma ganho de performance pela sintaxe;

use materialização somente com evidência;

recursão precisa de início e progressão controlada;

nem toda subquery precisa virar CTE.
```

A próxima aula será:

```text
289 - M12.19 - Views e materialized views conceitual
```

Nela, você vai estudar:

- por que encapsular uma consulta;
- criação conceitual de view;
- view como objeto do catálogo;
- consulta de view;
- dependências;
- alteração e remoção;
- segurança e exposição de colunas;
- diferença entre view e CTE;
- materialized view;
- armazenamento do resultado;
- atualização por `REFRESH MATERIALIZED VIEW`;
- dados desatualizados;
- critérios de uso.

O dataset deve permanecer inalterado.

As consultas construídas nesta aula serão candidatas para analisar quais resultados merecem ou não virar views.

---

# Material complementar

## Checkpoint final

- [ ] Criei CTEs simples, múltiplas e dependentes.
- [ ] Organizei agregações e relatórios em etapas nomeadas.
- [ ] Conheci materialização sem presumir performance.
- [ ] Executei recursão controlada e fiz o commit.

---

## Troubleshooting adicional

### WITH RECURSIVE foi esquecido

Uma CTE que referencia a si mesma precisa da palavra `RECURSIVE` na cláusula.

### Tipos nao coincidem na recursao

O termo âncora e o recursivo precisam produzir colunas compatíveis.

Use casts explícitos quando necessário.

### Nome da CTE conflita com tabela

Evite usar o mesmo nome de uma tabela real dentro da consulta.

Escolha um nome que represente o resultado intermediário.

### Materialized nao mudou o resultado

A opção altera possibilidades de planejamento, não a semântica esperada do resultado.

### CTE repetida em varios scripts

A repetição entre instruções pode indicar candidata a view, mas confirme estabilidade, reutilização e contrato na aula 289.

---

## Perguntas de revisao

1. O que significa CTE?
2. Qual palavra inicia a cláusula?
3. Qual é o escopo de uma CTE?
4. A CTE cria tabela permanente?
5. Qual a diferença entre CTE e view?
6. Uma CTE pode agregar?
7. Como declarar várias CTEs?
8. Uma CTE pode depender de outra?
9. Por que a ordem importa?
10. O que é granularidade?
11. Quando preferir CTE a subquery?
12. CTE é sempre mais rápida?
13. O que `MATERIALIZED` solicita?
14. O que `NOT MATERIALIZED` permite?
15. O que é uma CTE recursiva?
16. O que é termo âncora?
17. O que é termo recursivo?
18. Por que a condição de parada importa?

---

## Roteiro de resposta

1. Common Table Expression.
2. `WITH`.
3. Uma instrução.
4. Não.
5. View persiste no catálogo; CTE não.
6. Sim.
7. Separe definições por vírgula.
8. Sim, quando a origem vem antes.
9. A dependência precisa estar disponível.
10. O que cada linha representa.
11. Quando a etapa merece nome ou existe pipeline.
12. Não.
13. Uma etapa separada materializada na instrução.
14. Integração ao plano quando possível.
15. CTE que referencia seu próprio resultado.
16. Parte inicial.
17. Parte que produz novas linhas a partir das anteriores.
18. Evita crescimento indefinido.

---

## Desafio opcional

Construa um relatório usando cinco CTEs:

```text
atividades_por_ordem;
eventos_por_ordem;
competencias_por_ordem;
telefones_por_cliente;
relatorio_final.
```

O resultado deve apresentar:

```text
ordem;
cliente;
quantidade de atividades;
valor total;
quantidade de eventos;
quantidade de competências distintas;
quantidade de telefones do cliente.
```

Regras:

- agregue cada lado muitos antes do join final;
- documente a granularidade;
- preserve ordens sem correspondência;
- não use view;
- não modifique dados;
- não use função de janela.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 288 - M12.18 - CTE common table expressions

- Estudei Common Table Expressions com a cláusula `WITH`.
- Entendi que uma CTE existe somente durante uma instrução.
- Diferenciei CTE, tabela, view e materialized view.
- Nomeei resultados intermediários de forma semântica.
- Criei CTEs simples e com agregação.
- Declarei várias CTEs na mesma cláusula.
- Encadeei CTEs dependentes na ordem correta.
- Documentei a granularidade de cada etapa.
- Agreguei relações muitos separadamente antes dos joins.
- Comparei CTE com subquery em `FROM`.
- Conheci `MATERIALIZED` e `NOT MATERIALIZED` sem presumir ganho.
- Criei uma CTE recursiva com termo âncora e termo recursivo.
- Apliquei condição de parada e percorri uma hierarquia controlada.
- Mantive o dataset inalterado.
- Próxima aula: views e materialized views.
```

---

## Referencia tecnica curta

```text
WITH:
inicia a cláusula.

CTE:
resultado nomeado de uma instrução.

Escopo:
até o ponto e vírgula.

Varias CTEs:
separadas por vírgula.

Dependencia:
CTE posterior usa CTE anterior.

MATERIALIZED:
solicita cálculo separado.

NOT MATERIALIZED:
permite integração quando possível.

WITH RECURSIVE:
habilita autorreferência.

Ancora:
inicia.

Termo recursivo:
gera próximas linhas.
```

Regra final:

```text
use CTE para transformar uma consulta complexa em etapas nomeadas, com granularidade e dependencias claras.
```
