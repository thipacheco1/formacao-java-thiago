# 286 - M12.16 - Group by having e agregacoes

## Apresentacao da aula

Na aula 285, você implementou o relacionamento muitos-para-muitos entre:

```text
Atividade;
Competência.
```

A tabela associativa `app.atividade_competencia` passou a representar cada vínculo entre uma atividade e uma competência. O banco agora possui dados suficientes para responder perguntas que não devolvem apenas linhas individuais, mas resumos sobre conjuntos de linhas.

Exemplos:

```text
quantas atividades existem em cada ordem?

qual é o valor total de mão de obra por ordem?

qual é o valor médio das atividades?

quantas competências cada atividade exige?

quantas atividades utilizam cada competência?

quais clientes possuem mais de um telefone?

quais grupos ultrapassam determinado valor?
```

Essas perguntas exigem agregação.

As funções centrais desta aula serão:

```sql
COUNT
SUM
AVG
MIN
MAX
```

Você também vai estudar:

```sql
GROUP BY
HAVING
```

A ideia principal é:

```text
função de agregação:
resume várias linhas em um valor.

GROUP BY:
divide as linhas em grupos.

HAVING:
filtra os grupos depois da agregação.
```

Nesta aula, você vai trabalhar com o dataset acumulado desde a aula 277:

```text
clientes;
produtos;
ordens de serviço;
atividades;
eventos;
telefones;
competências;
associações entre atividades e competências.
```

O laboratório será somente leitura. Nenhum script deve modificar o banco.

Também não vamos usar subqueries, CTEs, funções de janela ou agrupamentos avançados. Subqueries correlacionadas e não correlacionadas serão o tema da aula 287.

Ao final, você deverá conseguir:

- executar agregações sobre o conjunto inteiro;
- diferenciar `COUNT(*)` de `COUNT(coluna)`;
- compreender como agregações tratam `NULL`;
- agrupar por uma ou várias colunas;
- combinar joins e agrupamentos;
- contar filhos preservando pais sem filhos;
- usar `COUNT(DISTINCT ...)`;
- filtrar linhas com `WHERE`;
- filtrar grupos com `HAVING`;
- ordenar resultados agregados;
- evitar erros de colunas não agrupadas;
- interpretar a cardinalidade antes da agregação;
- preparar consultas para relatórios backend.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
284:
relacionamento um para muitos.

285:
relacionamento muitos para muitos com tabela associativa.

286:
GROUP BY, HAVING e agregações.

287:
subqueries correlacionadas e não correlacionadas.

288:
CTEs.

289:
views e materialized views.
```

As aulas anteriores criaram relações e dados.

Agora você começa a produzir informações resumidas.

A progressão é:

```text
SELECT:
lê linhas.

WHERE:
filtra linhas.

JOIN:
combina relações.

GROUP BY:
organiza linhas em grupos.

AGREGACAO:
resume cada grupo.

HAVING:
filtra grupos.
```

Esse conjunto aparece em:

- dashboards;
- relatórios;
- indicadores;
- APIs de resumo;
- validações operacionais;
- análises de volume;
- monitoramento;
- conciliações.

A consulta agregada precisa ser entendida antes de ser otimizada. Índices, planos de execução e performance serão aprofundados em aulas posteriores.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-286-group-by-having-agregacoes
```

Estrutura final:

```text
labs
└── m12
    └── aula-286-group-by-having-agregacoes
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_agregacoes_globais.sql
            ├── 02_group_by_uma_coluna.sql
            ├── 03_group_by_multiplas_colunas.sql
            ├── 04_agregacoes_com_joins.sql
            ├── 05_count_star_coluna_distinct.sql
            ├── 06_where_vs_having.sql
            ├── 07_relatorios_agregados.sql
            ├── 08_armadilhas_controladas.sql
            ├── 09_exercicio.sql
            └── 10_validacao_final.sql
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

Dataset esperado:

```text
3 clientes;
3 produtos;
4 ordens;
6 atividades;
4 eventos;
5 telefones;
4 competências;
6 associações principais.
```

O fluxo será:

1. confirmar o dataset;
2. executar agregações sem agrupamento;
3. agrupar por uma coluna;
4. agrupar por várias colunas;
5. agregar relações combinadas por joins;
6. comparar formas de `COUNT`;
7. separar `WHERE` de `HAVING`;
8. construir relatórios resumidos;
9. analisar armadilhas;
10. resolver o exercício;
11. validar que nenhuma linha foi alterada;
12. fazer o commit.

---

## Conceito essencial

### Funcao de agregacao

Uma função de agregação recebe várias linhas e produz um valor resumido.

Exemplo:

```sql
SELECT
    count(*) AS total_atividades
FROM app.atividade;
```

Se a tabela possui seis linhas, o resultado possui uma linha:

```text
total_atividades:
6.
```

A consulta não devolve cada atividade.

Ela devolve o resumo do conjunto.

---

### Agregacao sem GROUP BY

Quando não existe `GROUP BY`, todas as linhas filtradas formam um único grupo lógico.

Exemplo:

```sql
SELECT
    sum(valor_mao_obra) AS valor_total
FROM app.atividade;
```

A função soma o valor de todas as atividades.

Você também pode usar várias agregações:

```sql
SELECT
    count(*) AS quantidade,
    sum(valor_mao_obra) AS total,
    avg(valor_mao_obra) AS media,
    min(valor_mao_obra) AS menor,
    max(valor_mao_obra) AS maior
FROM app.atividade;
```

O resultado ainda possui apenas uma linha.

---

### COUNT asterisco

`COUNT(*)` conta linhas.

Exemplo:

```sql
SELECT
    count(*) AS quantidade
FROM app.atividade;
```

Ele não depende de uma coluna específica.

Mesmo que algumas colunas estejam nulas, a linha é contada.

Regra:

```text
COUNT(*):
quantidade de linhas do conjunto.
```

---

### COUNT coluna

`COUNT(coluna)` conta apenas valores não nulos da coluna.

Exemplo:

```sql
SELECT
    count(inicio_real) AS atividades_iniciadas
FROM app.atividade;
```

Atividades com `inicio_real IS NULL` não são contadas.

Isso permite comparar:

```sql
SELECT
    count(*) AS total,
    count(inicio_real) AS iniciadas,
    count(fim_real) AS finalizadas
FROM app.atividade;
```

No mesmo conjunto, os três valores podem ser diferentes.

---

### COUNT e NULL

Considere três linhas:

| id | fim_real |
|---:|---|
| 1 | 2026-07-10 10:00 |
| 2 | NULL |
| 3 | NULL |

Resultados:

```text
COUNT(*):
3.

COUNT(fim_real):
1.
```

`COUNT(*)` conta linhas.

`COUNT(fim_real)` conta valores presentes.

Essa diferença será essencial em `LEFT JOIN`.

---

### SUM

`SUM` soma valores não nulos.

Exemplo:

```sql
SELECT
    sum(valor_mao_obra) AS valor_total
FROM app.atividade;
```

Se uma coluna puder ser nula, os nulos são ignorados.

Quando não existe nenhum valor não nulo no conjunto, `SUM` retorna `NULL`, não zero.

No modelo atual, `valor_mao_obra` é obrigatório e possui default, então todas as atividades possuem valor.

---

### AVG

`AVG` calcula a média dos valores não nulos.

Exemplo:

```sql
SELECT
    avg(valor_mao_obra) AS valor_medio
FROM app.atividade;
```

Conceitualmente:

```text
soma dos valores não nulos
dividida pela quantidade de valores não nulos.
```

Não confunda com:

```text
soma dividida por COUNT(*)
```

quando a coluna aceita nulos.

---

### MIN e MAX

`MIN` retorna o menor valor.

`MAX` retorna o maior valor.

Eles funcionam com:

- números;
- datas;
- timestamps;
- textos, conforme ordenação;
- outros tipos comparáveis.

Exemplos:

```sql
SELECT
    min(valor_mao_obra) AS menor_valor,
    max(valor_mao_obra) AS maior_valor
FROM app.atividade;
```

```sql
SELECT
    min(data_agendada) AS primeira_data,
    max(data_agendada) AS ultima_data
FROM app.ordem_servico;
```

Valores nulos são ignorados.

---

### Agregacao depois de WHERE

`WHERE` filtra linhas antes da agregação.

Exemplo:

```sql
SELECT
    count(*) AS atividades_agendadas
FROM app.atividade
WHERE status = 'AGENDADA';
```

Fluxo lógico:

```text
FROM:
lê atividade.

WHERE:
mantém status AGENDADA.

COUNT:
conta as linhas restantes.
```

A função não vê as linhas removidas pelo `WHERE`.

---

### GROUP BY

`GROUP BY` divide as linhas conforme os valores informados.

Exemplo:

```sql
SELECT
    status,
    count(*) AS quantidade
FROM app.atividade
GROUP BY status
ORDER BY status;
```

Todas as atividades com o mesmo status formam um grupo.

Para cada grupo, `COUNT(*)` produz um valor.

Resultado conceitual:

```text
AGENDADA:
2.

CONCLUIDA:
1.

PENDENTE:
3.
```

O número exato depende do dataset preservado.

---

### Uma linha por grupo

Sem agrupamento:

```sql
SELECT count(*)
FROM app.atividade;
```

Uma linha para o conjunto inteiro.

Com agrupamento:

```sql
SELECT
    status,
    count(*)
FROM app.atividade
GROUP BY status;
```

Uma linha para cada status distinto.

Regra:

```text
quantidade de linhas do resultado agregado
é determinada pela quantidade de grupos.
```

---

### Colunas selecionadas e GROUP BY

Em uma consulta agrupada, cada item da projeção deve ser:

- parte do `GROUP BY`;
- resultado de uma função de agregação;
- ou uma expressão derivada adequadamente desses elementos.

Exemplo válido:

```sql
SELECT
    status,
    count(*) AS quantidade
FROM app.atividade
GROUP BY status;
```

Exemplo inválido:

```sql
SELECT
    status,
    descricao,
    count(*)
FROM app.atividade
GROUP BY status;
```

Pergunta:

```text
qual descrição deve representar o grupo de várias atividades?
```

O banco não pode escolher arbitrariamente.

---

### GROUP BY com varias colunas

Exemplo:

```sql
SELECT
    ordem_servico_id,
    status,
    count(*) AS quantidade
FROM app.atividade
GROUP BY
    ordem_servico_id,
    status
ORDER BY
    ordem_servico_id,
    status;
```

O grupo é definido pela combinação:

```text
ordem_servico_id + status.
```

Duas linhas pertencem ao mesmo grupo apenas se os dois valores coincidirem.

---

### Atributos do grupo

Considere:

```sql
GROUP BY
    ordem_servico_id,
    status
```

Os grupos possíveis são:

```text
Ordem 930001 + AGENDADA;

Ordem 930001 + PENDENTE;

Ordem 930004 + CONCLUIDA;

Ordem 930004 + PENDENTE.
```

Cada combinação produz sua própria linha agregada.

---

### ORDER BY em resultado agregado

Você pode ordenar por:

- coluna agrupada;
- expressão agregada;
- alias da projeção.

Exemplo:

```sql
SELECT
    ordem_servico_id,
    sum(valor_mao_obra) AS valor_total
FROM app.atividade
GROUP BY ordem_servico_id
ORDER BY
    valor_total DESC,
    ordem_servico_id ASC;
```

O alias `valor_total` pode ser usado em `ORDER BY`.

Adicione um critério estável para desempate.

---

### HAVING

`HAVING` filtra grupos.

Exemplo:

```sql
SELECT
    ordem_servico_id,
    count(*) AS quantidade
FROM app.atividade
GROUP BY ordem_servico_id
HAVING count(*) > 1
ORDER BY ordem_servico_id;
```

Primeiro os grupos são formados.

Depois, somente grupos com mais de uma atividade permanecem.

---

### WHERE e HAVING

Compare:

```sql
WHERE status = 'PENDENTE'
```

Com:

```sql
HAVING count(*) > 1
```

`WHERE` responde:

```text
quais linhas participam?
```

`HAVING` responde:

```text
quais grupos permanecem depois do resumo?
```

Consulta completa:

```sql
SELECT
    ordem_servico_id,
    count(*) AS atividades_pendentes
FROM app.atividade
WHERE status = 'PENDENTE'
GROUP BY ordem_servico_id
HAVING count(*) >= 1
ORDER BY ordem_servico_id;
```

Fluxo:

1. filtra atividades pendentes;
2. agrupa por ordem;
3. conta cada grupo;
4. mantém grupos conforme `HAVING`;
5. ordena.

---

### Nao use HAVING como substituto de WHERE

Esta consulta pode funcionar:

```sql
SELECT
    status,
    count(*)
FROM app.atividade
GROUP BY status
HAVING status = 'PENDENTE';
```

Mas o filtro não depende de agregação.

A forma mais clara é:

```sql
SELECT
    status,
    count(*)
FROM app.atividade
WHERE status = 'PENDENTE'
GROUP BY status;
```

Regra:

```text
filtro de linha:
WHERE.

filtro de grupo:
HAVING.
```

Essa separação também pode reduzir o volume que precisa ser agrupado.

---

### Ordem logica ampliada

Uma forma útil de pensar:

```text
FROM e JOIN:
constroem as linhas de origem.

WHERE:
filtra linhas.

GROUP BY:
forma grupos.

HAVING:
filtra grupos.

SELECT:
produz a projeção.

ORDER BY:
ordena o resultado.

LIMIT:
recorta o resultado.
```

Essa ordem explica por que:

- `WHERE` não usa resultado de agregação;
- `HAVING` pode usar agregação;
- alias da projeção costuma funcionar em `ORDER BY`;
- alias da projeção não deve ser usado como se já existisse em `WHERE`.

---

### Agregacoes com JOIN

Considere contar atividades por ordem.

Consulta:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    count(a.id) AS quantidade_atividades
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
GROUP BY
    os.id,
    os.codigo
ORDER BY os.id;
```

O `LEFT JOIN` preserva ordens sem atividades.

O agrupamento produz uma linha por ordem.

---

### COUNT asterisco em LEFT JOIN

Em um `LEFT JOIN`, o pai sem filhos ainda produz uma linha com colunas do filho nulas.

Considere:

```sql
count(*)
```

Ele conta a linha preservada.

Por isso, um pai sem filhos poderia aparecer com quantidade `1`.

Para contar filhos:

```sql
count(a.id)
```

Como `a.id` fica nulo quando não existe filho, o resultado será zero.

Regra:

```text
contar linhas resultantes:
COUNT(*).

contar filhos em LEFT JOIN:
COUNT(filho.id).
```

---

### GROUP BY depois de JOIN

Ao combinar relações 1:N, a cardinalidade da entrada aumenta.

Exemplo:

```text
uma ordem com duas atividades
gera duas linhas antes do agrupamento.
```

O `GROUP BY` reúne essas linhas novamente conforme a chave da ordem.

Isso permite calcular:

```text
quantidade de atividades;
soma de mão de obra;
menor valor;
maior valor;
média.
```

---

### Cuidado com multiplicacao de joins

Considere juntar:

```text
Ordem -> Atividade;
Ordem -> Evento.
```

Se uma ordem possui:

```text
2 atividades;
3 eventos;
```

o join pode gerar:

```text
2 × 3 = 6 linhas.
```

Uma soma de valores de atividade poderia ser repetida três vezes.

Antes de agregar:

```text
entenda a cardinalidade da entrada.
```

Nesta aula, os relatórios evitarão combinar dois lados muitos na mesma agregação.

Subqueries e CTEs futuramente ajudarão a agregar cada lado antes da combinação.

---

### COUNT DISTINCT

`COUNT(DISTINCT coluna)` conta valores distintos não nulos.

Exemplo:

```sql
SELECT
    count(DISTINCT competencia_id) AS competencias_distintas
FROM app.atividade_competencia;
```

Também pode ser usado por grupo:

```sql
SELECT
    atividade_id,
    count(DISTINCT competencia_id) AS competencias_distintas
FROM app.atividade_competencia
GROUP BY atividade_id;
```

A unique composta já impede associações duplicadas, mas `DISTINCT` continua expressando claramente a intenção de contar competências diferentes.

---

### COUNT DISTINCT e NULL

Assim como `COUNT(coluna)`, valores nulos são ignorados.

No modelo da associativa, `competencia_id` é obrigatório, então não existem nulos nessa coluna.

Em outros domínios, essa diferença pode importar.

---

### Agregacao da associacao N:N

A tabela associativa permite responder:

```text
quantas competências cada atividade exige?

quantas atividades utilizam cada competência?

quantas associações são obrigatórias?

qual nível aparece em cada grupo?
```

Exemplo:

```sql
SELECT
    competencia_id,
    count(*) AS quantidade_atividades
FROM app.atividade_competencia
GROUP BY competencia_id;
```

Para incluir competências sem associação, parta de `COMPETENCIA` com `LEFT JOIN` e conte `ac.id`.

---

### Agregacao e relatorio backend

Uma consulta agregada costuma alimentar um objeto de leitura.

Exemplo conceitual:

```text
ResumoOrdem {
    ordemId;
    codigo;
    quantidadeAtividades;
    valorTotalMaoObra;
    valorMedioMaoObra;
}
```

Esse resultado não é a entidade Ordem completa.

É uma projeção de relatório.

Mais adiante, Java poderá mapear essas consultas para DTOs específicos.

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
  -Path "labs\m12\aula-286-group-by-having-agregacoes\sql"

Set-Location `
  "labs\m12\aula-286-group-by-having-agregacoes"
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

SELECT count(*) AS clientes
FROM app.cliente
WHERE id BETWEEN 930001 AND 930099;

SELECT count(*) AS produtos
FROM app.produto
WHERE id BETWEEN 930001 AND 930099;

SELECT count(*) AS ordens
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930099;

SELECT count(*) AS atividades
FROM app.atividade
WHERE id BETWEEN 930001 AND 930099;

SELECT count(*) AS telefones
FROM app.telefone_cliente
WHERE id BETWEEN 940001 AND 940099;

SELECT count(*) AS competencias
FROM app.competencia
WHERE id BETWEEN 950001 AND 950099;

SELECT count(*) AS associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-286-group-by-having-agregacoes\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultados esperados:

```text
3;
3;
4;
6;
5;
4;
6.
```

---

### 4. Criar 01_agregacoes_globais.sql

Crie:

```text
sql/01_agregacoes_globais.sql
```

Conteúdo:

```sql
SELECT
    count(*) AS quantidade_atividades,
    sum(valor_mao_obra) AS valor_total_mao_obra,
    avg(valor_mao_obra) AS valor_medio_mao_obra,
    min(valor_mao_obra) AS menor_valor_mao_obra,
    max(valor_mao_obra) AS maior_valor_mao_obra
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006;

SELECT
    count(*) AS total_atividades,
    count(inicio_real) AS atividades_iniciadas,
    count(fim_real) AS atividades_finalizadas
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006;

SELECT
    min(data_agendada) AS primeira_data_agendada,
    max(data_agendada) AS ultima_data_agendada
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930004;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-286-group-by-having-agregacoes\sql\01_agregacoes_globais.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Anote a diferença entre:

```text
total de atividades;
atividades iniciadas;
atividades finalizadas.
```

---

### 5. Criar 02_group_by_uma_coluna.sql

Crie:

```text
sql/02_group_by_uma_coluna.sql
```

Conteúdo:

```sql
SELECT
    status,
    count(*) AS quantidade_atividades
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY status
ORDER BY status;

SELECT
    ordem_servico_id,
    count(*) AS quantidade_atividades,
    sum(valor_mao_obra) AS valor_total_mao_obra,
    avg(valor_mao_obra) AS valor_medio_mao_obra,
    min(valor_mao_obra) AS menor_valor,
    max(valor_mao_obra) AS maior_valor
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY ordem_servico_id
ORDER BY ordem_servico_id;

SELECT
    competencia_id,
    count(*) AS quantidade_associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099
GROUP BY competencia_id
ORDER BY competencia_id;
```

Execute e confirme que cada grupo produz uma linha.

---

### 6. Criar 03_group_by_multiplas_colunas.sql

Crie:

```text
sql/03_group_by_multiplas_colunas.sql
```

Conteúdo:

```sql
SELECT
    ordem_servico_id,
    status,
    count(*) AS quantidade
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY
    ordem_servico_id,
    status
ORDER BY
    ordem_servico_id,
    status;

SELECT
    nivel_requerido,
    obrigatoria,
    count(*) AS quantidade_associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099
GROUP BY
    nivel_requerido,
    obrigatoria
ORDER BY
    nivel_requerido,
    obrigatoria DESC;

SELECT
    tipo,
    principal,
    count(*) AS quantidade_telefones
FROM app.telefone_cliente
WHERE id BETWEEN 940001 AND 940099
GROUP BY
    tipo,
    principal
ORDER BY
    tipo,
    principal DESC;
```

Cada combinação forma um grupo diferente.

---

### 7. Criar 04_agregacoes_com_joins.sql

Crie:

```text
sql/04_agregacoes_com_joins.sql
```

Conteúdo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    count(a.id) AS quantidade_atividades,
    sum(a.valor_mao_obra) AS valor_total_mao_obra,
    avg(a.valor_mao_obra) AS valor_medio_mao_obra
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.id BETWEEN 930001 AND 930006
WHERE os.id BETWEEN 930001 AND 930004
GROUP BY
    os.id,
    os.codigo
ORDER BY os.id;

SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    count(tc.id) AS quantidade_telefones
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
   AND tc.id BETWEEN 940001 AND 940099
WHERE c.id BETWEEN 930001 AND 930003
GROUP BY
    c.id,
    c.nome
ORDER BY c.id;

SELECT
    comp.id AS competencia_id,
    comp.codigo AS competencia_codigo,
    comp.nome AS competencia_nome,
    count(ac.id) AS quantidade_atividades
FROM app.competencia AS comp
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = comp.id
   AND ac.id BETWEEN 951001 AND 951099
WHERE comp.id BETWEEN 950001 AND 950004
GROUP BY
    comp.id,
    comp.codigo,
    comp.nome
ORDER BY
    quantidade_atividades DESC,
    comp.id;
```

Observe que `ATENDIMENTO` aparece com quantidade zero.

---

### 8. Criar 05_count_star_coluna_distinct.sql

Crie:

```text
sql/05_count_star_coluna_distinct.sql
```

Conteúdo:

```sql
SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    count(*) AS linhas_do_join,
    count(tc.id) AS telefones_reais
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
   AND tc.id BETWEEN 940001 AND 940099
WHERE c.id BETWEEN 930001 AND 930003
GROUP BY
    c.id,
    c.nome
ORDER BY c.id;

SELECT
    atividade_id,
    count(*) AS associacoes,
    count(DISTINCT competencia_id) AS competencias_distintas
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099
GROUP BY atividade_id
ORDER BY atividade_id;

SELECT
    count(*) AS total_associacoes,
    count(DISTINCT atividade_id) AS atividades_com_competencia,
    count(DISTINCT competencia_id) AS competencias_utilizadas
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099;
```

Compare `linhas_do_join` com `telefones_reais`.

No dataset atual, todos os três clientes possuem telefone. No exercício, você criará um caso controlado para visualizar a diferença quando não houver filho.

---

### 9. Criar 06_where_vs_having.sql

Crie:

```text
sql/06_where_vs_having.sql
```

Conteúdo:

```sql
SELECT
    ordem_servico_id,
    count(*) AS atividades_pendentes
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
  AND status = 'PENDENTE'
GROUP BY ordem_servico_id
HAVING count(*) >= 1
ORDER BY ordem_servico_id;

SELECT
    ordem_servico_id,
    count(*) AS quantidade_atividades,
    sum(valor_mao_obra) AS valor_total_mao_obra
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY ordem_servico_id
HAVING count(*) > 1
ORDER BY ordem_servico_id;

SELECT
    ordem_servico_id,
    count(*) AS quantidade_atividades,
    sum(valor_mao_obra) AS valor_total_mao_obra
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY ordem_servico_id
HAVING sum(valor_mao_obra) > 250
ORDER BY
    valor_total_mao_obra DESC,
    ordem_servico_id;

SELECT
    competencia_id,
    count(*) AS quantidade_atividades
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099
  AND obrigatoria = true
GROUP BY competencia_id
HAVING count(*) >= 2
ORDER BY competencia_id;
```

Identifique em cada consulta:

```text
filtro de linha;
chave do grupo;
agregação;
filtro de grupo.
```

---

### 10. Criar 07_relatorios_agregados.sql

Crie:

```text
sql/07_relatorios_agregados.sql
```

Conteúdo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    os.status AS ordem_status,
    count(a.id) AS quantidade_atividades,
    sum(a.valor_mao_obra) AS valor_total_mao_obra,
    min(a.valor_mao_obra) AS menor_valor_atividade,
    max(a.valor_mao_obra) AS maior_valor_atividade
FROM app.ordem_servico AS os
LEFT JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
   AND a.id BETWEEN 930001 AND 930006
WHERE os.id BETWEEN 930001 AND 930004
GROUP BY
    os.id,
    os.codigo,
    os.status
HAVING count(a.id) >= 1
ORDER BY
    valor_total_mao_obra DESC,
    os.id;

SELECT
    comp.id AS competencia_id,
    comp.nome AS competencia_nome,
    count(ac.id) AS quantidade_atividades,
    count(DISTINCT ac.atividade_id) AS atividades_distintas
FROM app.competencia AS comp
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = comp.id
   AND ac.id BETWEEN 951001 AND 951099
WHERE comp.id BETWEEN 950001 AND 950004
GROUP BY
    comp.id,
    comp.nome
ORDER BY
    quantidade_atividades DESC,
    comp.id;

SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    count(tc.id) AS quantidade_telefones
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
   AND tc.id BETWEEN 940001 AND 940099
WHERE c.id BETWEEN 930001 AND 930003
GROUP BY
    c.id,
    c.nome
HAVING count(tc.id) >= 2
ORDER BY
    quantidade_telefones DESC,
    c.id;
```

Essas consultas se aproximam de relatórios que uma API poderia expor.

---

### 11. Criar 08_armadilhas_controladas.sql

Crie:

```text
sql/08_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Erro: descricao não está agrupada nem agregada.
-- Execute manualmente para observar a mensagem.
SELECT
    status,
    descricao,
    count(*)
FROM app.atividade
GROUP BY status;

-- Correto: remove a coluna que não representa o grupo.
SELECT
    status,
    count(*) AS quantidade
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY status
ORDER BY status;

-- Armadilha: COUNT(*) conta a linha preservada no LEFT JOIN.
SELECT
    comp.id,
    comp.nome,
    count(*) AS linhas_do_join,
    count(ac.id) AS associacoes_reais
FROM app.competencia AS comp
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = comp.id
   AND ac.id BETWEEN 951001 AND 951099
WHERE comp.id BETWEEN 950001 AND 950004
GROUP BY
    comp.id,
    comp.nome
ORDER BY comp.id;

-- Erro conceitual: HAVING usado para filtro simples de linha.
-- Funciona, mas prefira WHERE.
SELECT
    status,
    count(*) AS quantidade
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY status
HAVING status = 'PENDENTE';

-- Forma preferida.
SELECT
    status,
    count(*) AS quantidade
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
  AND status = 'PENDENTE'
GROUP BY status;
```

O primeiro comando deve falhar.

Os demais demonstram armadilhas sem alterar dados.

---

### 12. Criar 09_exercicio.sql

Crie:

```text
sql/09_exercicio.sql
```

Implemente as missões da seção de exercício guiado.

Não use subquery, CTE ou função de janela.

---

### 13. Criar 10_validacao_final.sql

Crie:

```text
sql/10_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    ordem_servico_id,
    count(*) AS quantidade_atividades,
    sum(valor_mao_obra) AS valor_total
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
GROUP BY ordem_servico_id
ORDER BY ordem_servico_id;

SELECT
    competencia_id,
    count(*) AS quantidade_associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099
GROUP BY competencia_id
ORDER BY competencia_id;

SELECT count(*) AS atividades
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006;

SELECT count(*) AS competencias
FROM app.competencia
WHERE id BETWEEN 950001 AND 950099;

SELECT count(*) AS associacoes
FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099;
```

Contagens finais esperadas:

```text
6 atividades;
4 competências;
6 associações.
```

Nenhum dado deve ser modificado.

---

### 14. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 286 - Group by having e agregacoes.

Objetivo:
resumir conjuntos de linhas e filtrar grupos.

Funções:
COUNT, SUM, AVG, MIN e MAX.

Cláusulas:
GROUP BY e HAVING.

Regra:
WHERE filtra linhas;
HAVING filtra grupos.

Dataset:
atividades, telefones, competências e associações das aulas anteriores.

Escopo:
somente leitura.

Próxima aula:
subqueries correlacionadas e não correlacionadas.
```

Liste os scripts e explique o objetivo de cada um.

---

## Entendendo o que foi feito

### Agregacoes produziram resumos

Você calculou:

- quantidades;
- totais;
- médias;
- menores valores;
- maiores valores.

Sem `GROUP BY`, todo o conjunto virou um grupo.

Com `GROUP BY`, cada combinação de chaves gerou seu próprio resumo.

---

### COUNT mudou conforme o argumento

Você diferenciou:

```text
COUNT(*):
linhas.

COUNT(coluna):
valores não nulos.

COUNT(DISTINCT coluna):
valores distintos não nulos.
```

Essa diferença foi especialmente importante em `LEFT JOIN`.

---

### WHERE e HAVING atuaram em momentos diferentes

`WHERE` reduziu as linhas antes do agrupamento.

`HAVING` avaliou o resultado agregado de cada grupo.

As duas cláusulas trabalharam juntas em consultas de relatório.

---

### Joins definiram a entrada da agregacao

Antes de contar ou somar, você analisou quais linhas o join produziu.

Isso evitou interpretar multiplicações acidentais como dados reais.

---

### O resultado agregado e uma projecao

Uma linha de relatório por ordem ou competência não é a entidade original.

É um resultado calculado para leitura.

Essa distinção será importante quando Java mapear consultas para DTOs.

---

## Erros comuns importantes

### Coluna precisa aparecer no GROUP BY

Uma coluna selecionada não foi agrupada nem agregada.

Decida se ela:

- identifica o grupo;
- precisa de agregação;
- deve sair da projeção.

---

### COUNT retorna um quando esperava zero

Você usou `COUNT(*)` depois de `LEFT JOIN`.

Conte uma coluna não nula do filho:

```sql
COUNT(filho.id)
```

---

### HAVING nao reconhece alias

Não dependa do alias da projeção dentro de `HAVING`.

Repita a expressão agregada:

```sql
HAVING count(*) > 1
```

Aliases funcionam de forma confiável em `ORDER BY`.

---

### Soma ficou maior que o esperado

O join multiplicou linhas antes da agregação.

Projete as chaves e inspecione a entrada sem agregação.

---

### AVG ignora valores nulos

A média considera apenas valores presentes.

Compare `COUNT(*)` com `COUNT(coluna)` quando a coluna for opcional.

---

## Comandos uteis

### Agregacao global

```sql
SELECT
    count(*),
    sum(valor),
    avg(valor),
    min(valor),
    max(valor)
FROM tabela;
```

### Agrupamento

```sql
SELECT
    status,
    count(*)
FROM tabela
GROUP BY status;
```

### Filtro de grupo

```sql
HAVING count(*) > 1
```

### Contar filhos em left join

```sql
count(filho.id)
```

### Contar distintos

```sql
count(DISTINCT coluna)
```

---

## Exercicio guiado

No arquivo:

```text
sql/09_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Resumo global das Ordens

Calcule para as ordens `930001` a `930004`:

```text
quantidade;
soma de valor previsto;
média de valor previsto;
menor valor;
maior valor.
```

Use apenas agregações globais.

---

### Parte 2 - Atividades por status

Retorne:

```text
status;
quantidade;
soma da mão de obra;
média da mão de obra;
menor valor;
maior valor.
```

Agrupe por status e ordene pela quantidade decrescente, usando status como desempate.

---

### Parte 3 - Atividades por Ordem

Retorne todas as quatro ordens com:

```text
id da ordem;
código;
quantidade de atividades;
valor total da mão de obra.
```

Use `LEFT JOIN`.

Conte `a.id`, não `*`.

---

### Parte 4 - Competencias sem e com uso

Retorne todas as competências com:

```text
id;
nome;
quantidade de atividades associadas.
```

A competência sem uso precisa aparecer com zero.

Depois crie uma segunda consulta com `HAVING` para mostrar apenas competências usadas em duas ou mais atividades.

---

### Parte 5 - Telefones por Cliente

Retorne:

```text
cliente;
quantidade de telefones;
quantidade de telefones confirmados.
```

Para a segunda quantidade, filtre as linhas no join ou construa uma expressão agregada coerente sem usar subquery.

Não altere os dados.

Explique a estratégia no README.

---

### Parte 6 - Where antes de Having

Crie uma consulta que:

```text
considere somente associações obrigatórias;

agrupe por competência;

mantenha apenas competências presentes em duas ou mais associações obrigatórias.
```

Identifique qual condição pertence ao `WHERE` e qual pertence ao `HAVING`.

---

### Parte 7 - Count e Null

Crie uma consulta sobre Atividade com:

```text
COUNT(*);
COUNT(inicio_real);
COUNT(fim_real).
```

Depois explique por que os valores diferem.

---

### Parte 8 - Diagnosticar multiplicacao

Crie uma consulta sem agregação que junte:

```text
Ordem 930001;
Atividade;
Evento da Ordem.
```

Conte visualmente as linhas.

Não aplique `SUM` nesse resultado.

Explique por que somar mão de obra diretamente poderia duplicar valores.

---

### Parte 9 - Relatorio final

Crie um relatório de competências com:

```text
competência;
quantidade de atividades;
quantidade de associações obrigatórias;
menor nível textual;
maior nível textual.
```

Agrupe e ordene.

Registre que `MIN` e `MAX` em texto seguem ordenação, não hierarquia de negócio.

Não use subquery para converter níveis.

---

## Criterios de aceite

- o laboratório oficial da aula 286 existe;
- o título e o arquivo seguem a grade;
- o dataset das aulas anteriores foi preservado;
- nenhum script modifica dados;
- `COUNT(*)` foi praticado;
- `COUNT(coluna)` foi praticado;
- `COUNT(DISTINCT coluna)` foi praticado;
- `SUM`, `AVG`, `MIN` e `MAX` foram praticados;
- agregação sem `GROUP BY` foi compreendida;
- agrupamento por uma coluna foi executado;
- agrupamento por várias colunas foi executado;
- uma linha por grupo foi compreendida;
- colunas não agregadas foram incluídas no `GROUP BY`;
- agregações com joins foram realizadas;
- pais sem filhos foram preservados;
- filhos foram contados com `COUNT(filho.id)`;
- `WHERE` foi usado para filtrar linhas;
- `HAVING` foi usado para filtrar grupos;
- resultados agregados foram ordenados;
- multiplicação de joins foi reconhecida;
- aliases não foram usados indevidamente em `HAVING`;
- subqueries não foram antecipadas;
- CTEs não foram antecipadas;
- funções de janela não foram antecipadas;
- o exercício foi concluído;
- contagens finais permanecem corretas;
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
  labs/m12/aula-286-group-by-having-agregacoes
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): criar consultas agrupadas e agregacoes"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
funções de agregação;
agrupamentos;
filtros de grupo;
relatórios resumidos;
consultas somente leitura.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou conjuntos de linhas em resumos úteis.

Aprendeu:

```text
COUNT;
SUM;
AVG;
MIN;
MAX;
GROUP BY;
HAVING;
COUNT DISTINCT;
agregação global;
agregação por grupo;
agregação com join;
filtro de linha;
filtro de grupo.
```

As regras principais foram:

```text
sem GROUP BY, todo o conjunto forma um grupo;

com GROUP BY, cada combinação gera um grupo;

COUNT(*) conta linhas;

COUNT(coluna) ignora NULL;

COUNT(DISTINCT coluna) conta valores diferentes;

WHERE atua antes do agrupamento;

HAVING atua depois do agrupamento;

em LEFT JOIN, conte a chave do filho para obter zero;

entenda a cardinalidade do join antes de somar;

colunas selecionadas precisam representar o grupo ou ser agregadas.
```

A próxima aula será:

```text
287 - M12.17 - Subqueries correlacionadas e nao correlacionadas
```

Nela, você vai estudar:

- consulta dentro de outra consulta;
- subquery escalar;
- subquery que retorna várias linhas;
- uso em `WHERE`;
- uso em `FROM`;
- uso em `SELECT`;
- `IN`;
- `EXISTS`;
- subquery não correlacionada;
- subquery correlacionada;
- comparação com agregações;
- critérios para legibilidade e desempenho.

O dataset atual deve permanecer inalterado.

Ele será usado para comparar ordens, atividades, competências e valores por meio de subqueries.

---

# Material complementar

## Checkpoint final

- [ ] Pratiquei `COUNT`, `SUM`, `AVG`, `MIN` e `MAX`.
- [ ] Agrupei por uma e várias colunas.
- [ ] Diferenciei `WHERE`, `GROUP BY` e `HAVING`.
- [ ] Validei agregações com joins e fiz o commit.

---

## Troubleshooting adicional

### SUM retorna NULL

O conjunto não possui valor não nulo.

Isso é diferente de total zero.

A decisão de substituir `NULL` por zero será estudada junto de funções e expressões apropriadas.

### Resultado possui um grupo por valor inesperado

O atributo contém valores diferentes, espaços ou grafias distintas.

Inspecione os valores antes de agrupá-los.

### GROUP BY ficou muito grande

A projeção pode estar tentando carregar detalhes incompatíveis com o resumo.

Defina a granularidade desejada do relatório.

### HAVING removeu todos os grupos

Revise a agregação e o limite escolhido.

Execute primeiro sem `HAVING` para observar os valores produzidos.

### COUNT DISTINCT parece desnecessario

Mesmo quando uma constraint impede duplicidade, ele pode documentar que a intenção é contar entidades distintas. Use com propósito, não automaticamente.

---

## Perguntas de revisao

1. O que uma função de agregação faz?
2. O que acontece sem `GROUP BY`?
3. O que `COUNT(*)` conta?
4. O que `COUNT(coluna)` conta?
5. Como `SUM` trata `NULL`?
6. Como `AVG` trata `NULL`?
7. O que `MIN` e `MAX` retornam?
8. O que define um grupo?
9. Quantas linhas o resultado agrupado possui?
10. Por que uma coluna selecionada precisa estar agrupada?
11. Qual a diferença entre `WHERE` e `HAVING`?
12. Em que ordem lógica eles atuam?
13. Por que contar `filho.id` em left join?
14. O que `COUNT(DISTINCT ...)` faz?
15. Como joins podem inflar uma soma?
16. O que representa uma linha de relatório agregado?

---

## Roteiro de resposta

1. Resume várias linhas em um valor.
2. Todas as linhas filtradas formam um grupo.
3. Linhas.
4. Valores não nulos.
5. Ignora nulos; sem valores, retorna nulo.
6. Considera somente valores não nulos.
7. Menor e maior valor do conjunto.
8. A combinação de valores do `GROUP BY`.
9. Uma por grupo.
10. O banco precisa saber qual valor representa o grupo.
11. `WHERE` filtra linhas; `HAVING` filtra grupos.
12. `WHERE`, depois agrupamento, depois `HAVING`.
13. O filho inexistente fica nulo e deve contar zero.
14. Conta valores diferentes e não nulos.
15. Relações muitos podem multiplicar linhas antes da agregação.
16. Uma projeção calculada para leitura.

---

## Desafio opcional

Crie relatórios somente com os recursos desta aula:

1. quantidade de atividades por status;
2. total de mão de obra por ordem;
3. competências usadas por mais de uma atividade;
4. clientes com pelo menos dois telefones;
5. quantidade de associações por nível requerido;
6. quantidade de eventos por ordem;
7. ordens cujo total de mão de obra ultrapassa 250.

Para cada relatório, registre:

- granularidade;
- linhas de entrada;
- chave do grupo;
- função agregada;
- filtro de linha;
- filtro de grupo;
- ordenação.

Não use subquery.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 286 - M12.16 - Group by having e agregacoes

- Estudei agregações globais e por grupo.
- Usei `COUNT`, `SUM`, `AVG`, `MIN` e `MAX`.
- Diferenciei `COUNT(*)` de `COUNT(coluna)`.
- Usei `COUNT(DISTINCT ...)` para valores diferentes.
- Entendi como agregações tratam valores nulos.
- Agrupei por uma coluna e por combinações de colunas.
- Mantive na projeção apenas colunas agrupadas ou agregadas.
- Combinei joins com agregações.
- Usei `COUNT(filho.id)` para contar zero em `LEFT JOIN`.
- Diferenciei `WHERE` como filtro de linhas e `HAVING` como filtro de grupos.
- Ordenei resultados por valores agregados.
- Identifiquei riscos de multiplicação de linhas antes de somar.
- Mantive o dataset inalterado.
- Próxima aula: subqueries correlacionadas e não correlacionadas.
```

---

## Referencia tecnica curta

```text
COUNT(*):
conta linhas.

COUNT(coluna):
conta valores não nulos.

SUM:
soma.

AVG:
média.

MIN:
menor valor.

MAX:
maior valor.

GROUP BY:
forma grupos.

HAVING:
filtra grupos.

WHERE:
filtra linhas antes do agrupamento.
```

Regra final:

```text
antes de agregar, defina a granularidade e entenda quais linhas entram em cada grupo.
```
