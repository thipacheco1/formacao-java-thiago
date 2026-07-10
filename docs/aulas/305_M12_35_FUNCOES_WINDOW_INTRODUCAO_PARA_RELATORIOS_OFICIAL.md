# 305 - M12.35 - Funcoes window introducao para relatorios

## Apresentacao da aula

Na aula 304, você separou identidades e responsabilidades no PostgreSQL.

Criou:

```text
owner técnico;
usuário de migration;
runtime;
leitor;
grupos de privilégios;
default privileges.
```

Agora o foco volta para consultas e relatórios.

Em relatórios de backend, muitas perguntas exigem comparar uma linha com outras sem perder a identidade de cada registro.

Exemplos:

```text
qual é a posição desta Ordem dentro do Cliente?

qual foi a Ordem anterior?

qual será a próxima Ordem?

quanto o Cliente acumulou até esta data?

qual é a média das últimas três Ordens?

quais são as duas maiores Ordens de cada Cliente?

qual é o primeiro e o último valor de cada grupo?
```

Uma agregação comum com `GROUP BY` reduz várias linhas a uma linha por grupo.

Uma função window trabalha sobre um conjunto relacionado, mas preserva cada linha do resultado.

Considere quatro Ordens de um Cliente.

Com:

```sql
SELECT
    cliente_id,
    sum(valor_previsto)
FROM ordem_servico
GROUP BY cliente_id;
```

o resultado possui uma linha para o Cliente.

Com:

```sql
SELECT
    id,
    cliente_id,
    valor_previsto,
    sum(valor_previsto) OVER (
        PARTITION BY cliente_id
    ) AS total_cliente
FROM ordem_servico;
```

as quatro Ordens permanecem visíveis, e cada uma recebe o total de seu Cliente.

Essa é a ideia central da aula:

```text
calcular sobre linhas relacionadas sem colapsar a granularidade original.
```

Você vai praticar:

- `OVER`;
- `PARTITION BY`;
- `ORDER BY` dentro da janela;
- `ROW_NUMBER`;
- `RANK`;
- `DENSE_RANK`;
- `LAG`;
- `LEAD`;
- agregações como window functions;
- total acumulado;
- média móvel;
- frames;
- `FIRST_VALUE`;
- `LAST_VALUE`;
- janelas nomeadas;
- top N por grupo;
- filtro após cálculo da janela;
- relatório mensal com agregação e janela.

O laboratório criará o schema descartável:

```text
window_aula_305
```

Ele terá:

```text
3 Clientes;
12 Ordens;
valores empatados;
datas sequenciais;
status variados.
```

Os empates são intencionais.

Sem eles, seria difícil perceber a diferença entre:

```text
ROW_NUMBER;
RANK;
DENSE_RANK.
```

O schema oficial `projeto_os` será usado apenas como referência de continuidade e permanecerá inalterado.

Ao final, o schema da aula será removido.

A próxima aula será:

```text
306 - M12.36 - JSONB no PostgreSQL quando usar e quando evitar
```

JSONB não será antecipado nesta aula.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
303:
backup, restore e cuidados locais.

304:
usuários, permissões e segurança básica.

305:
funções window para relatórios.

306:
JSONB no PostgreSQL.

307:
projeto banco OS parte 1.
```

Você já praticou:

```text
GROUP BY;
HAVING;
CTEs;
subqueries;
views;
relatórios;
paginação;
performance.
```

Window functions combinam vários desses conhecimentos.

Elas aparecem em backends para:

- rankings;
- históricos;
- dashboards;
- comparações temporais;
- relatórios financeiros;
- detecção de mudança;
- paginação interna de grupos;
- seleção do último evento;
- análise de sequências.

A meta não é decorar todas as funções existentes.

A meta é compreender quatro decisões:

```text
qual é a granularidade final?

qual é a partição?

qual é a ordem da janela?

qual é o frame?
```

Se essas quatro respostas estiverem erradas, a função pode executar sem erro e ainda produzir um relatório incorreto.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-305-funcoes-window-relatorios
```

Estrutura final:

```text
labs
└── m12
    └── aula-305-funcoes-window-relatorios
        ├── README.md
        ├── docs
        │   ├── contrato-relatorios-window.md
        │   ├── matriz-funcoes-window.md
        │   └── decisoes-de-frame.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_criar_schema_e_tabelas.sql
            ├── 02_inserir_seed.sql
            ├── 03_agregacao_vs_window.sql
            ├── 04_row_number_rank_dense_rank.sql
            ├── 05_top_n_por_cliente.sql
            ├── 06_lag_lead_comparacao_temporal.sql
            ├── 07_total_acumulado_e_frames.sql
            ├── 08_media_movel.sql
            ├── 09_first_value_last_value.sql
            ├── 10_relatorio_mensal_agregado.sql
            ├── 11_janela_nomeada_e_filtro.sql
            ├── 12_explain_windowagg.sql
            ├── 13_exercicio.sql
            ├── 14_limpar_laboratorio.sql
            └── 15_checkpoint_final.sql
```

IDs reservados:

```text
Clientes:
305001 a 305003.

Ordens:
305101 a 305112.

Exercício:
305900 em diante.
```

Valores esperados por Cliente:

```text
Cliente Alfa:
1000, 750, 750 e 500.
Total: 3000.

Cliente Beta:
1200, 900, 900 e 400.
Total: 3400.

Cliente Gama:
800, 800, 600 e 300.
Total: 2500.
```

Total geral:

```text
8900.
```

Esses valores permitirão validar os relatórios sem depender de percepção visual.

---

## Conceito essencial

### Agregacao comum e funcao window

Agregação comum:

```sql
SELECT
    cliente_id,
    sum(valor_previsto)
FROM window_aula_305.ordem_servico
GROUP BY cliente_id;
```

Granularidade:

```text
uma linha por Cliente.
```

Agregação como window:

```sql
SELECT
    id,
    cliente_id,
    valor_previsto,
    sum(valor_previsto) OVER (
        PARTITION BY cliente_id
    ) AS total_cliente
FROM window_aula_305.ordem_servico;
```

Granularidade:

```text
uma linha por Ordem.
```

A soma é repetida em cada Ordem da mesma partição.

Window function não substitui `GROUP BY`.

Ela responde outra pergunta.

---

### A clausula OVER

Uma função se torna window function quando usa:

```sql
OVER (...)
```

Exemplos:

```sql
row_number() OVER (...);

sum(valor) OVER (...);

lag(valor) OVER (...).
```

Sem `OVER`, `sum` é uma agregação comum.

Com `OVER`, ela calcula sobre uma janela e preserva as linhas.

Funções como `ROW_NUMBER`, `RANK`, `LAG` e `LEAD` são usadas com sintaxe de janela.

---

### Particao

`PARTITION BY` divide o conjunto em grupos independentes.

Exemplo:

```sql
PARTITION BY cliente_id
```

Cada Cliente possui sua própria janela.

A contagem reinicia.

O ranking reinicia.

O acumulado reinicia.

Sem `PARTITION BY`, todas as linhas pertencem a uma única partição.

Isso pode ser correto para um ranking geral, mas incorreto para ranking por Cliente.

---

### Ordem da janela

`ORDER BY` dentro de `OVER` define a sequência usada pela função.

Exemplo:

```sql
lag(valor_previsto) OVER (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
)
```

A comparação segue a ordem temporal de cada Cliente.

Esse `ORDER BY` não garante a ordem final do resultado.

Para ordenar a resposta, ainda use:

```sql
ORDER BY cliente_id, aberta_em, id;
```

São responsabilidades diferentes:

```text
ORDER BY da janela:
define o cálculo.

ORDER BY final:
define a apresentação.
```

---

### Ordem deterministica

Se duas linhas empatam na coluna de ordenação, o PostgreSQL pode escolher qualquer sequência entre elas quando não existe desempate suficiente.

Para resultados estáveis:

```sql
ORDER BY aberta_em, id
```

O ID torna a ordem total.

Isso é especialmente importante para:

- `ROW_NUMBER`;
- `LAG`;
- `LEAD`;
- acumulados com `ROWS`;
- primeiro e último valor.

---

### Peer rows

Linhas empatadas nos valores do `ORDER BY` da janela são chamadas peers.

Exemplo:

```text
duas Ordens de valor 750.
```

Com ranking por valor:

```sql
ORDER BY valor_previsto DESC
```

essas Ordens são peers.

As funções tratam peers de maneiras diferentes.

---

### ROW_NUMBER

`ROW_NUMBER` atribui um número único e sequencial:

```text
1, 2, 3, 4.
```

Mesmo quando os valores empatam, uma linha recebe 2 e a outra recebe 3.

Por isso, acrescente desempate:

```sql
ORDER BY valor_previsto DESC, id
```

Use para:

- top N por grupo;
- selecionar linha mais recente;
- numeração de relatório;
- deduplicação controlada.

---

### RANK

`RANK` dá a mesma posição aos empates e deixa lacunas.

Valores:

```text
1000, 750, 750, 500.
```

Ranks:

```text
1, 2, 2, 4.
```

A posição 3 foi consumida pelo empate.

Use quando a posição competitiva precisa refletir o número de linhas anteriores.

---

### DENSE_RANK

`DENSE_RANK` dá a mesma posição aos empates sem lacunas.

Para os mesmos valores:

```text
1, 2, 2, 3.
```

Use quando deseja classificar níveis distintos.

Exemplo:

```text
primeiro maior valor;
segundo maior valor;
terceiro maior valor.
```

---

### LAG

`LAG` acessa uma linha anterior dentro da partição.

Exemplo:

```sql
lag(valor_previsto) OVER (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
)
```

Na primeira linha da partição, não existe anterior.

O resultado padrão é `NULL`.

Também é possível definir offset e default:

```sql
lag(valor_previsto, 1, 0)
```

Não substitua `NULL` automaticamente.

Às vezes, a ausência de linha anterior é uma informação importante.

---

### LEAD

`LEAD` acessa uma linha posterior.

Use para:

- próxima data;
- próximo status;
- próximo valor;
- intervalo até o próximo evento;
- comparação de sequência.

Na última linha da partição, o resultado normalmente é `NULL`.

---

### Diferenca entre linhas

Depois de obter o anterior:

```sql
valor_previsto
- lag(valor_previsto) OVER (...)
```

a diferença mostra variação.

Como uma window function não deve ser repetida várias vezes sem necessidade, uma CTE pode calcular o valor anterior e a consulta externa calcular diferenças e classificações.

Isso melhora leitura e evita duplicação da expressão.

---

### Agregacoes como window

Agregações comuns podem ser usadas com `OVER`:

```text
sum;
avg;
count;
min;
max.
```

Sem `ORDER BY` na janela:

```sql
sum(valor) OVER (
    PARTITION BY cliente_id
)
```

o total considera toda a partição.

Com `ORDER BY`:

```sql
sum(valor) OVER (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
)
```

o comportamento depende do frame.

Para acumulados previsíveis, declare o frame explicitamente.

---

### Frame

A partição define quais linhas pertencem ao grupo.

O frame define quais linhas da partição participam do cálculo da linha atual.

Exemplo de acumulado:

```sql
ROWS BETWEEN
    UNBOUNDED PRECEDING
    AND CURRENT ROW
```

Significado:

```text
desde a primeira linha da partição
até a linha atual.
```

Exemplo de janela móvel:

```sql
ROWS BETWEEN
    2 PRECEDING
    AND CURRENT ROW
```

Significado:

```text
linha atual e até duas linhas anteriores.
```

---

### ROWS, RANGE e GROUPS

Modos de frame:

```text
ROWS:
conta linhas físicas da sequência.

RANGE:
trabalha com valores do ORDER BY e peers.

GROUPS:
trabalha com grupos de peers.
```

Nesta aula, a prática principal usará `ROWS`.

Ele torna explícito quantas linhas anteriores e posteriores participam.

`RANGE` e `GROUPS` serão reconhecidos, mas não aprofundados.

---

### Frame padrao e empates

Quando existe `ORDER BY` na janela e o frame não é declarado, o comportamento padrão inclui a linha atual e peers de acordo com a semântica do frame padrão.

Em acumulados com valores empatados, isso pode produzir saltos que surpreendem quem esperava avanço linha a linha.

Por isso, para acumulado por linha:

```sql
ROWS BETWEEN
    UNBOUNDED PRECEDING
    AND CURRENT ROW
```

é uma decisão explícita e legível.

---

### FIRST_VALUE

`FIRST_VALUE` retorna o valor da primeira linha do frame.

Exemplo:

```sql
first_value(valor_previsto) OVER (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
    ROWS BETWEEN
        UNBOUNDED PRECEDING
        AND UNBOUNDED FOLLOWING
)
```

O frame completo deixa a intenção explícita:

```text
primeiro valor da partição.
```

---

### LAST_VALUE e a armadilha do frame

`LAST_VALUE` retorna o último valor do frame, não necessariamente o último valor da partição inteira.

Com frame terminando em `CURRENT ROW`, o resultado pode ser o valor atual.

Para buscar o último valor do Cliente:

```sql
last_value(valor_previsto) OVER (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
    ROWS BETWEEN
        UNBOUNDED PRECEDING
        AND UNBOUNDED FOLLOWING
)
```

Essa é uma das decisões de frame mais importantes da aula.

---

### Media movel

Média móvel das últimas três Ordens:

```sql
avg(valor_previsto) OVER (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
    ROWS BETWEEN
        2 PRECEDING
        AND CURRENT ROW
)
```

Nas primeiras linhas, o frame possui menos de três registros.

A primeira média usa uma linha.

A segunda usa duas.

A terceira em diante usa até três.

Isso não é erro.

É a definição do frame.

---

### Filtrar resultado de window

Window functions são calculadas depois das etapas que formam o conjunto filtrado e agrupado.

Você não filtra diretamente o `ROW_NUMBER` no `WHERE` do mesmo nível.

Use CTE ou subquery:

```sql
WITH ranqueada AS (
    SELECT
        ...,
        row_number() OVER (...) AS posicao
    FROM ...
)
SELECT *
FROM ranqueada
WHERE posicao <= 2;
```

Essa estrutura é a base do top N por grupo.

---

### Window depois de GROUP BY

É possível agregar primeiro e aplicar window sobre o resultado agregado.

Exemplo:

```text
uma linha por Cliente e mês;

total do mês;

acumulado mensal por Cliente.
```

A consulta usa uma CTE mensal.

A window opera sobre as linhas já agregadas.

Isso combina duas granularidades em etapas diferentes sem confundi-las.

---

### Janelas nomeadas

Quando várias funções usam a mesma definição:

```sql
WINDOW por_cliente_data AS (
    PARTITION BY cliente_id
    ORDER BY aberta_em, id
)
```

Depois:

```sql
lag(valor) OVER por_cliente_data;

lead(valor) OVER por_cliente_data;

row_number() OVER por_cliente_data.
```

A janela nomeada reduz repetição.

Ela não muda a semântica.

A definição ainda precisa ser correta.

---

### Posicao logica da window function

Window functions são calculadas depois de:

```text
FROM;
WHERE;
GROUP BY;
HAVING.
```

E antes do `ORDER BY` final da consulta.

Por isso:

- o `WHERE` define quais linhas entram;
- o `GROUP BY` pode reduzir as linhas;
- a window calcula sobre o resultado disponível;
- o `ORDER BY` final apresenta a saída.

Window functions são normalmente usadas no `SELECT` e no `ORDER BY` da consulta.

Quando precisar filtrar o resultado calculado, crie outro nível com CTE ou subquery.

---

### Custo e plano

No plano de execução, é comum encontrar:

```text
Sort;
WindowAgg.
```

A ordenação pode ser necessária para:

```text
PARTITION BY;
ORDER BY da janela.
```

Várias windows com ordens incompatíveis podem exigir trabalho adicional.

Não crie índices apenas por observar um `Sort` no seed pequeno.

Primeiro defina a consulta real, o volume e a frequência.

A aula 299 já estabeleceu essa disciplina.

---

## Mao na massa guiada

### 1. Confirmar o ambiente

Na raiz:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Confirme o database:

```text
formacao_java.
```

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-305-funcoes-window-relatorios\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-305-funcoes-window-relatorios\docs"

Set-Location `
  "labs\m12\aula-305-funcoes-window-relatorios"
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
    to_regnamespace(
        'window_aula_305'
    ) AS schema_laboratorio;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_oficial;
```

---

### 4. Criar 01_criar_schema_e_tabelas.sql

Crie:

```text
sql/01_criar_schema_e_tabelas.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS window_aula_305 CASCADE;

CREATE SCHEMA window_aula_305;

CREATE TABLE window_aula_305.cliente (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL
);

CREATE TABLE window_aula_305.ordem_servico (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    aberta_em timestamptz NOT NULL,
    valor_previsto numeric(12, 2) NOT NULL,

    CONSTRAINT fk_a305_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES window_aula_305.cliente (id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_a305_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_a305_ordem_valor
        CHECK (valor_previsto >= 0)
);

CREATE INDEX idx_a305_ordem_cliente_data
ON window_aula_305.ordem_servico (
    cliente_id,
    aberta_em,
    id
);

CREATE INDEX idx_a305_ordem_cliente_valor
ON window_aula_305.ordem_servico (
    cliente_id,
    valor_previsto DESC,
    id
);
```

Os índices correspondem às duas ordens principais do laboratório:

```text
por Cliente e data;

por Cliente e valor.
```

---

### 5. Criar 02_inserir_seed.sql

Crie:

```text
sql/02_inserir_seed.sql
```

Conteúdo:

```sql
INSERT INTO window_aula_305.cliente (
    id,
    codigo,
    nome
)
VALUES
    (
        305001,
        'CLI-WIN-ALFA',
        'Cliente Window Alfa'
    ),
    (
        305002,
        'CLI-WIN-BETA',
        'Cliente Window Beta'
    ),
    (
        305003,
        'CLI-WIN-GAMA',
        'Cliente Window Gama'
    );

INSERT INTO window_aula_305.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    aberta_em,
    valor_previsto
)
VALUES
    (
        305101,
        'OS-WIN-A-01',
        305001,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-01-10 09:00:00-03',
        500.00
    ),
    (
        305102,
        'OS-WIN-A-02',
        305001,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-02-10 09:00:00-03',
        750.00
    ),
    (
        305103,
        'OS-WIN-A-03',
        305001,
        'EM_ATENDIMENTO',
        TIMESTAMPTZ '2026-03-10 09:00:00-03',
        750.00
    ),
    (
        305104,
        'OS-WIN-A-04',
        305001,
        'ABERTA',
        TIMESTAMPTZ '2026-04-10 09:00:00-03',
        1000.00
    ),
    (
        305105,
        'OS-WIN-B-01',
        305002,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-01-15 10:00:00-03',
        400.00
    ),
    (
        305106,
        'OS-WIN-B-02',
        305002,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-02-15 10:00:00-03',
        900.00
    ),
    (
        305107,
        'OS-WIN-B-03',
        305002,
        'EM_ATENDIMENTO',
        TIMESTAMPTZ '2026-03-15 10:00:00-03',
        900.00
    ),
    (
        305108,
        'OS-WIN-B-04',
        305002,
        'ABERTA',
        TIMESTAMPTZ '2026-04-15 10:00:00-03',
        1200.00
    ),
    (
        305109,
        'OS-WIN-G-01',
        305003,
        'CANCELADA',
        TIMESTAMPTZ '2026-01-20 11:00:00-03',
        300.00
    ),
    (
        305110,
        'OS-WIN-G-02',
        305003,
        'CONCLUIDA',
        TIMESTAMPTZ '2026-02-20 11:00:00-03',
        600.00
    ),
    (
        305111,
        'OS-WIN-G-03',
        305003,
        'EM_ATENDIMENTO',
        TIMESTAMPTZ '2026-03-20 11:00:00-03',
        800.00
    ),
    (
        305112,
        'OS-WIN-G-04',
        305003,
        'ABERTA',
        TIMESTAMPTZ '2026-04-20 11:00:00-03',
        800.00
    );

ANALYZE window_aula_305.cliente;
ANALYZE window_aula_305.ordem_servico;
```

Valide:

```sql
SELECT
    cliente_id,
    count(*) AS ordens,
    sum(valor_previsto) AS total
FROM window_aula_305.ordem_servico
GROUP BY cliente_id
ORDER BY cliente_id;
```

Esperado:

```text
305001:
4 e 3000.

305002:
4 e 3400.

305003:
4 e 2500.
```

---

### 6. Criar 03_agregacao_vs_window.sql

Crie:

```text
sql/03_agregacao_vs_window.sql
```

Conteúdo:

```sql
SELECT
    cliente_id,
    count(*) AS quantidade_ordens,
    sum(valor_previsto) AS total_cliente
FROM window_aula_305.ordem_servico
GROUP BY cliente_id
ORDER BY cliente_id;

SELECT
    id AS ordem_id,
    codigo AS ordem_codigo,
    cliente_id,
    valor_previsto,
    count(*) OVER (
        PARTITION BY cliente_id
    ) AS quantidade_ordens_cliente,
    sum(valor_previsto) OVER (
        PARTITION BY cliente_id
    ) AS total_cliente,
    avg(valor_previsto) OVER (
        PARTITION BY cliente_id
    ) AS media_cliente,
    sum(valor_previsto) OVER () AS total_geral
FROM window_aula_305.ordem_servico
ORDER BY
    cliente_id,
    aberta_em,
    id;
```

A primeira consulta retorna três linhas.

A segunda retorna doze.

---

### 7. Criar 04_row_number_rank_dense_rank.sql

Crie:

```text
sql/04_row_number_rank_dense_rank.sql
```

Conteúdo:

```sql
SELECT
    cliente_id,
    id AS ordem_id,
    codigo,
    valor_previsto,
    row_number() OVER (
        PARTITION BY cliente_id
        ORDER BY
            valor_previsto DESC,
            id
    ) AS numero_linha,
    rank() OVER (
        PARTITION BY cliente_id
        ORDER BY valor_previsto DESC
    ) AS posicao_rank,
    dense_rank() OVER (
        PARTITION BY cliente_id
        ORDER BY valor_previsto DESC
    ) AS posicao_dense_rank
FROM window_aula_305.ordem_servico
ORDER BY
    cliente_id,
    valor_previsto DESC,
    id;
```

Observe os empates:

```text
Alfa:
750 e 750.

Beta:
900 e 900.

Gama:
800 e 800.
```

`ROW_NUMBER` diferencia as linhas.

`RANK` deixa lacuna.

`DENSE_RANK` não deixa lacuna.

---

### 8. Criar 05_top_n_por_cliente.sql

Crie:

```text
sql/05_top_n_por_cliente.sql
```

Conteúdo:

```sql
WITH ordens_ranqueadas AS (
    SELECT
        ordem.id AS ordem_id,
        ordem.codigo AS ordem_codigo,
        ordem.cliente_id,
        ordem.valor_previsto,
        ordem.aberta_em,
        row_number() OVER (
            PARTITION BY ordem.cliente_id
            ORDER BY
                ordem.valor_previsto DESC,
                ordem.id
        ) AS posicao
    FROM window_aula_305.ordem_servico AS ordem
)
SELECT
    ordem_id,
    ordem_codigo,
    cliente_id,
    valor_previsto,
    aberta_em,
    posicao
FROM ordens_ranqueadas
WHERE posicao <= 2
ORDER BY
    cliente_id,
    posicao;
```

Resultado:

```text
duas Ordens por Cliente;

seis linhas no total.
```

A CTE cria um nível onde `posicao` já existe e pode ser filtrada.

---

### 9. Criar 06_lag_lead_comparacao_temporal.sql

Crie:

```text
sql/06_lag_lead_comparacao_temporal.sql
```

Conteúdo:

```sql
WITH sequencia AS (
    SELECT
        ordem.id AS ordem_id,
        ordem.codigo AS ordem_codigo,
        ordem.cliente_id,
        ordem.aberta_em,
        ordem.valor_previsto,
        lag(
            ordem.valor_previsto
        ) OVER (
            PARTITION BY ordem.cliente_id
            ORDER BY
                ordem.aberta_em,
                ordem.id
        ) AS valor_anterior,
        lead(
            ordem.valor_previsto
        ) OVER (
            PARTITION BY ordem.cliente_id
            ORDER BY
                ordem.aberta_em,
                ordem.id
        ) AS proximo_valor,
        lag(
            ordem.aberta_em
        ) OVER (
            PARTITION BY ordem.cliente_id
            ORDER BY
                ordem.aberta_em,
                ordem.id
        ) AS data_anterior
    FROM window_aula_305.ordem_servico AS ordem
)
SELECT
    ordem_id,
    ordem_codigo,
    cliente_id,
    aberta_em,
    valor_previsto,
    valor_anterior,
    valor_previsto
        - valor_anterior AS variacao_absoluta,
    round(
        (
            valor_previsto
            - valor_anterior
        )
        / nullif(
            valor_anterior,
            0
        )
        * 100,
        2
    ) AS variacao_percentual,
    proximo_valor,
    aberta_em
        - data_anterior AS intervalo_desde_anterior
FROM sequencia
ORDER BY
    cliente_id,
    aberta_em,
    ordem_id;
```

Na primeira Ordem de cada Cliente:

```text
valor_anterior:
NULL.

data_anterior:
NULL.
```

Isso comunica ausência de registro anterior.

---

### 10. Criar 07_total_acumulado_e_frames.sql

Crie:

```text
sql/07_total_acumulado_e_frames.sql
```

Conteúdo:

```sql
SELECT
    cliente_id,
    id AS ordem_id,
    codigo,
    aberta_em,
    valor_previsto,
    sum(valor_previsto) OVER (
        PARTITION BY cliente_id
    ) AS total_particao,
    sum(valor_previsto) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            UNBOUNDED PRECEDING
            AND CURRENT ROW
    ) AS total_acumulado,
    count(*) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            UNBOUNDED PRECEDING
            AND CURRENT ROW
    ) AS quantidade_acumulada
FROM window_aula_305.ordem_servico
ORDER BY
    cliente_id,
    aberta_em,
    ordem_id;
```

Para Alfa, o acumulado esperado é:

```text
500;
1250;
2000;
3000.
```

Para Beta:

```text
400;
1300;
2200;
3400.
```

Para Gama:

```text
300;
900;
1700;
2500.
```

---

### 11. Criar 08_media_movel.sql

Crie:

```text
sql/08_media_movel.sql
```

Conteúdo:

```sql
SELECT
    cliente_id,
    id AS ordem_id,
    codigo,
    aberta_em,
    valor_previsto,
    round(
        avg(valor_previsto) OVER (
            PARTITION BY cliente_id
            ORDER BY
                aberta_em,
                id
            ROWS BETWEEN
                2 PRECEDING
                AND CURRENT ROW
        ),
        2
    ) AS media_movel_tres_ordens,
    min(valor_previsto) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            2 PRECEDING
            AND CURRENT ROW
    ) AS menor_ultimas_tres,
    max(valor_previsto) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            2 PRECEDING
            AND CURRENT ROW
    ) AS maior_ultimas_tres
FROM window_aula_305.ordem_servico
ORDER BY
    cliente_id,
    aberta_em,
    ordem_id;
```

A primeira linha usa apenas ela mesma.

A segunda usa duas linhas.

A terceira e a quarta usam até três.

---

### 12. Criar 09_first_value_last_value.sql

Crie:

```text
sql/09_first_value_last_value.sql
```

Conteúdo:

```sql
SELECT
    cliente_id,
    id AS ordem_id,
    codigo,
    aberta_em,
    valor_previsto,
    first_value(
        valor_previsto
    ) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            UNBOUNDED PRECEDING
            AND UNBOUNDED FOLLOWING
    ) AS primeiro_valor_cliente,
    last_value(
        valor_previsto
    ) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            UNBOUNDED PRECEDING
            AND UNBOUNDED FOLLOWING
    ) AS ultimo_valor_cliente,
    valor_previsto
        - first_value(
            valor_previsto
        ) OVER (
            PARTITION BY cliente_id
            ORDER BY
                aberta_em,
                id
            ROWS BETWEEN
                UNBOUNDED PRECEDING
                AND UNBOUNDED FOLLOWING
        ) AS diferenca_desde_primeira
FROM window_aula_305.ordem_servico
ORDER BY
    cliente_id,
    aberta_em,
    ordem_id;
```

Últimos valores esperados:

```text
Alfa:
1000.

Beta:
1200.

Gama:
800.
```

Remova mentalmente `UNBOUNDED FOLLOWING` e perceba por que `LAST_VALUE` mudaria de significado.

Não altere o script correto.

---

### 13. Criar 10_relatorio_mensal_agregado.sql

Crie:

```text
sql/10_relatorio_mensal_agregado.sql
```

Conteúdo:

```sql
WITH mensal AS (
    SELECT
        cliente_id,
        date_trunc(
            'month',
            aberta_em
        )::date AS mes,
        count(*) AS quantidade_ordens,
        sum(valor_previsto) AS valor_mes
    FROM window_aula_305.ordem_servico
    WHERE status <> 'CANCELADA'
    GROUP BY
        cliente_id,
        date_trunc(
            'month',
            aberta_em
        )::date
)
SELECT
    cliente_id,
    mes,
    quantidade_ordens,
    valor_mes,
    sum(valor_mes) OVER (
        PARTITION BY cliente_id
        ORDER BY mes
        ROWS BETWEEN
            UNBOUNDED PRECEDING
            AND CURRENT ROW
    ) AS valor_acumulado,
    lag(valor_mes) OVER (
        PARTITION BY cliente_id
        ORDER BY mes
    ) AS valor_mes_anterior,
    valor_mes
        - lag(valor_mes) OVER (
            PARTITION BY cliente_id
            ORDER BY mes
        ) AS variacao_mensal
FROM mensal
ORDER BY
    cliente_id,
    mes;
```

O `WHERE` exclui a Ordem cancelada antes da agregação mensal.

A window opera sobre as linhas mensais.

---

### 14. Criar 11_janela_nomeada_e_filtro.sql

Crie:

```text
sql/11_janela_nomeada_e_filtro.sql
```

Conteúdo:

```sql
WITH sequencia AS (
    SELECT
        ordem.id AS ordem_id,
        ordem.codigo AS ordem_codigo,
        ordem.cliente_id,
        ordem.aberta_em,
        ordem.valor_previsto,
        row_number() OVER por_cliente_data
            AS numero_sequencial,
        lag(
            ordem.valor_previsto
        ) OVER por_cliente_data
            AS valor_anterior,
        lead(
            ordem.valor_previsto
        ) OVER por_cliente_data
            AS proximo_valor,
        sum(
            ordem.valor_previsto
        ) OVER (
            por_cliente_data
            ROWS BETWEEN
                UNBOUNDED PRECEDING
                AND CURRENT ROW
        ) AS total_acumulado
    FROM window_aula_305.ordem_servico AS ordem
    WINDOW por_cliente_data AS (
        PARTITION BY ordem.cliente_id
        ORDER BY
            ordem.aberta_em,
            ordem.id
    )
)
SELECT
    ordem_id,
    ordem_codigo,
    cliente_id,
    aberta_em,
    valor_previsto,
    numero_sequencial,
    valor_anterior,
    proximo_valor,
    total_acumulado
FROM sequencia
WHERE numero_sequencial >= 2
ORDER BY
    cliente_id,
    numero_sequencial;
```

A primeira Ordem de cada Cliente foi removida somente na consulta externa.

As windows foram calculadas antes desse filtro externo.

---

### 15. Criar 12_explain_windowagg.sql

Crie:

```text
sql/12_explain_windowagg.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SUMMARY
)
SELECT
    cliente_id,
    id,
    aberta_em,
    valor_previsto,
    row_number() OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
    ) AS numero,
    sum(valor_previsto) OVER (
        PARTITION BY cliente_id
        ORDER BY
            aberta_em,
            id
        ROWS BETWEEN
            UNBOUNDED PRECEDING
            AND CURRENT ROW
    ) AS acumulado
FROM window_aula_305.ordem_servico
ORDER BY
    cliente_id,
    aberta_em,
    id;
```

Procure:

```text
WindowAgg;

Sort ou leitura ordenada;

linhas estimadas;

linhas reais.
```

Com doze linhas, não transforme essa observação em conclusão de performance.

---

### 16. Criar a documentacao

Em:

```text
docs/matriz-funcoes-window.md
```

registre:

```text
função;
pergunta;
partição;
ordem;
frame;
granularidade;
tratamento de empate.
```

Em:

```text
docs/decisoes-de-frame.md
```

documente:

- acumulado;
- média móvel;
- primeiro valor;
- último valor;
- motivo do uso de `ROWS`;
- efeito de `CURRENT ROW`;
- efeito de `UNBOUNDED FOLLOWING`.

Em:

```text
docs/contrato-relatorios-window.md
```

documente os contratos:

- top 2 por Cliente;
- evolução temporal;
- acumulado;
- média móvel;
- mensal agregado.

Para cada um, declare tipos, nulos, ordenação e significado.

---

## Entendendo o que foi feito

### As linhas foram preservadas

As funções window acrescentaram contexto sem reduzir doze Ordens a três Clientes.

---

### Particoes reiniciaram os calculos

Ranking, sequência e acumulado começaram novamente para cada Cliente.

---

### Empates ficaram visiveis

`ROW_NUMBER`, `RANK` e `DENSE_RANK` produziram resultados diferentes sobre valores iguais.

---

### LAG e LEAD evitaram self join

A linha anterior e a próxima foram acessadas pela ordem temporal da partição.

---

### Frames controlaram o subconjunto

O acumulado usou toda a história até a linha atual.

A média móvel usou no máximo três linhas.

`LAST_VALUE` usou a partição inteira.

---

### Agregacao e window foram combinadas

O relatório mensal agregou Ordens por mês.

Depois calculou acumulado e variação entre meses.

---

## Erros comuns importantes

### Confundir ORDER BY da janela com o final

O cálculo pode estar correto, mas a apresentação sair em outra ordem.

Declare ambos quando necessário.

---

### Omitir desempate

`ROW_NUMBER`, `LAG` e acumulados podem variar entre peers.

Inclua uma chave estável.

---

### Usar LAST_VALUE sem revisar frame

O resultado pode ser o valor atual, não o último da partição.

Declare `UNBOUNDED FOLLOWING` quando essa for a intenção.

---

### Filtrar row_number no mesmo WHERE

O alias ainda não existe nessa etapa.

Use CTE ou subquery.

---

### Usar window quando GROUP BY basta

Se a saída precisa de uma linha por Cliente, uma agregação comum pode ser mais simples.

---

## Comandos uteis

### Numerar

```sql
row_number() OVER (
    PARTITION BY grupo
    ORDER BY data, id
)
```

### Comparar anterior

```sql
lag(valor) OVER (
    PARTITION BY grupo
    ORDER BY data, id
)
```

### Acumular

```sql
sum(valor) OVER (
    PARTITION BY grupo
    ORDER BY data, id
    ROWS BETWEEN
        UNBOUNDED PRECEDING
        AND CURRENT ROW
)
```

### Último da partição

```sql
last_value(valor) OVER (
    PARTITION BY grupo
    ORDER BY data, id
    ROWS BETWEEN
        UNBOUNDED PRECEDING
        AND UNBOUNDED FOLLOWING
)
```

---

## Exercicio guiado

Use:

```text
sql/13_exercicio.sql
```

### Parte 1 - Ranking geral

Crie um ranking de todas as Ordens por valor, sem partição.

Retorne:

```text
ROW_NUMBER;
RANK;
DENSE_RANK.
```

Explique o tratamento dos empates.

---

### Parte 2 - Ultima Ordem de cada Cliente

Use `ROW_NUMBER` com:

```text
PARTITION BY cliente_id;

ORDER BY aberta_em DESC, id DESC.
```

Retorne somente posição 1 por CTE.

Esperado:

```text
305104;
305108;
305112.
```

---

### Parte 3 - Duas maiores faixas distintas

Use `DENSE_RANK` para retornar as duas maiores faixas de valor de cada Cliente.

Compare com `ROW_NUMBER <= 2`.

Explique por que a quantidade de linhas pode ser diferente quando existem empates.

---

### Parte 4 - Mudanca de status

Use `LAG(status)` para comparar cada Ordem com o status anterior do Cliente.

Crie uma coluna:

```text
MUDOU;

MANTEVE;

PRIMEIRO_REGISTRO.
```

---

### Parte 5 - Intervalo ate a proxima Ordem

Use `LEAD(aberta_em)`.

Calcule:

```text
proxima_data - aberta_em.
```

A última Ordem deve ter intervalo nulo.

---

### Parte 6 - Acumulado sem canceladas

Calcule total acumulado por Cliente excluindo `CANCELADA` antes da window.

Explique por que filtrar depois produziria outro significado.

---

### Parte 7 - Media movel de duas Ordens

Use:

```text
ROWS BETWEEN
    1 PRECEDING
    AND CURRENT ROW.
```

Valide manualmente as duas primeiras linhas de Alfa.

---

### Parte 8 - Primeiro e ultimo status

Retorne em cada Ordem:

```text
primeiro status do Cliente;

último status do Cliente.
```

Use frame completo.

---

### Parte 9 - Fixture temporaria

Dentro de uma transação, insira duas Ordens do Cliente Alfa com a mesma data e valor.

Execute `ROW_NUMBER`:

1. somente por data;
2. por data e ID.

Compare a estabilidade.

Execute rollback.

---

### Parte 10 - Parecer

Para cada requisito, escolha entre:

```text
GROUP BY;

window function;

subquery;

CTE.
```

Requisitos:

- total por Cliente;
- total repetido em cada Ordem;
- top 2 por Cliente;
- linha anterior;
- acumulado;
- uma linha mensal;
- variação entre meses.

Justifique cada decisão.

---

## Criterios de aceite

- o laboratório oficial da aula 305 existe;
- o arquivo e o H1 seguem a grade;
- o schema exclusivo foi criado;
- três Clientes foram carregados;
- doze Ordens foram carregadas;
- os totais por Cliente foram validados;
- agregação comum foi diferenciada de window;
- `OVER` foi compreendido;
- `PARTITION BY` foi aplicado;
- ordem da janela foi diferenciada da ordem final;
- desempate determinístico foi aplicado;
- peers foram compreendidos;
- `ROW_NUMBER` foi praticado;
- `RANK` foi praticado;
- `DENSE_RANK` foi praticado;
- top N por grupo foi implementado;
- filtro após window usou CTE;
- `LAG` foi praticado;
- `LEAD` foi praticado;
- diferenças temporal e financeira foram calculadas;
- agregações foram usadas como window;
- total da partição foi diferenciado de acumulado;
- frame `ROWS` foi declarado;
- média móvel foi criada;
- `FIRST_VALUE` foi praticado;
- `LAST_VALUE` usou frame completo;
- relatório mensal combinou GROUP BY e window;
- janela nomeada foi usada;
- plano com `WindowAgg` foi observado;
- seed oficial `projeto_os` foi preservado;
- fixture do exercício foi revertida;
- schema da aula foi removido;
- JSONB não foi antecipado;
- documentação e README estão prontos;
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
  labs/m12/aula-305-funcoes-window-relatorios
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): aplicar funcoes window em relatorios"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
partições;
ordenação;
ranking;
comparação temporal;
frames;
acumulados;
médias móveis;
top N.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você criou relatórios que analisam conjuntos relacionados sem perder a granularidade de cada Ordem.

Aprendeu:

```text
OVER;
PARTITION BY;
ORDER BY da janela;
ROW_NUMBER;
RANK;
DENSE_RANK;
LAG;
LEAD;
SUM como window;
AVG como window;
frames;
FIRST_VALUE;
LAST_VALUE;
janelas nomeadas;
top N por grupo.
```

As regras principais foram:

```text
GROUP BY reduz linhas;

window preserva linhas;

partição define o grupo;

ordem define a sequência;

frame define o subconjunto;

empates precisam de semântica explícita;

ROW_NUMBER sempre numera linhas;

RANK deixa lacunas;

DENSE_RANK não deixa lacunas;

LAG e LEAD dependem de ordem determinística;

acumulado deve declarar frame;

LAST_VALUE precisa do frame correto;

resultado de window é filtrado em outro nível;

window pode operar sobre dados já agrupados.
```

A próxima aula será:

```text
306 - M12.36 - JSONB no PostgreSQL quando usar e quando evitar
```

Nela, você vai estudar:

- diferença entre `json` e `jsonb`;
- documentos e colunas relacionais;
- operadores de acesso;
- contenção;
- existência de chave;
- atualização;
- `jsonb_set`;
- arrays e objetos;
- validação de estrutura;
- índices GIN introdutórios;
- metadados flexíveis;
- critérios para usar;
- sinais de abuso;
- impacto sobre constraints, joins e contratos.

O foco continuará sendo decisão de modelagem.

JSONB não substituirá automaticamente o modelo relacional construído no M12.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei agregação de window function.
- [ ] Pratiquei ranking, LAG, LEAD e top N.
- [ ] Declarei frames para acumulado, média e último valor.
- [ ] Limpei o schema e fiz o commit.

---

## Troubleshooting adicional

### window function calls cannot be nested

Uma window foi usada diretamente dentro de outra.

Calcule a primeira em CTE e aplique a segunda na consulta externa.

### column must appear in GROUP BY

A consulta misturou agregação comum e coluna não agrupada.

Defina a granularidade da etapa antes de adicionar a window.

### Resultado de LAST_VALUE parece igual ao atual

O frame termina na linha atual.

Use frame até `UNBOUNDED FOLLOWING` quando deseja o último da partição.

### ROW_NUMBER muda entre execucoes

A ordenação possui empate sem desempate estável.

Inclua uma chave única.

### Acumulado salta em valores empatados

O frame implícito não corresponde à intenção por linha.

Declare `ROWS`.

---

## Perguntas de revisao

1. O que uma window function preserva?
2. Qual a diferença para GROUP BY?
3. Para que serve `OVER`?
4. Para que serve `PARTITION BY`?
5. O que define o `ORDER BY` da janela?
6. Ele ordena a saída final?
7. O que são peers?
8. Como `ROW_NUMBER` trata empates?
9. Como `RANK` trata empates?
10. Como `DENSE_RANK` trata empates?
11. O que `LAG` retorna?
12. O que `LEAD` retorna?
13. O que é frame?
14. O que significa `UNBOUNDED PRECEDING`?
15. O que significa `CURRENT ROW`?
16. Como criar média das últimas três linhas?
17. Qual é o risco de `LAST_VALUE`?
18. Como filtrar top N?
19. O que é janela nomeada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. A identidade das linhas.
2. GROUP BY colapsa; window acrescenta contexto.
3. Definir a chamada como window.
4. Dividir o conjunto em grupos.
5. A sequência do cálculo.
6. Não necessariamente.
7. Linhas empatadas na ordem da janela.
8. Atribui números únicos.
9. Repete posição e deixa lacunas.
10. Repete posição sem lacunas.
11. Valor de linha anterior.
12. Valor de linha posterior.
13. Subconjunto da partição usado no cálculo.
14. Desde o início da partição.
15. Até a linha atual no modo aplicado.
16. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`.
17. Retornar o último do frame atual.
18. CTE ou subquery.
19. Definição reutilizável de janela.
20. JSONB no PostgreSQL.

---

## Desafio opcional

Crie um relatório de desempenho por Cliente com:

```text
Ordem;
data;
valor;
posição por valor;
posição por data;
valor anterior;
variação;
acumulado;
média das últimas três;
primeiro valor;
último valor;
percentual da Ordem no total do Cliente.
```

Regras:

- uma linha por Ordem;
- partição por Cliente;
- ordens determinísticas;
- frames explícitos;
- divisão protegida por `NULLIF`;
- nenhuma alteração de dados;
- nenhuma criação de view;
- contrato documentado.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 305 - M12.35 - Funcoes window introducao para relatorios

- Diferenciei agregação comum de função window.
- Entendi que window preserva a granularidade das linhas.
- Usei `OVER` para definir cálculos por janela.
- Dividi cálculos por Cliente com `PARTITION BY`.
- Diferenciei a ordem da janela da ordem final da consulta.
- Usei ID como desempate determinístico.
- Entendi o conceito de peer rows.
- Pratiquei `ROW_NUMBER`, `RANK` e `DENSE_RANK`.
- Implementei top N por grupo com CTE.
- Usei `LAG` para acessar a linha anterior.
- Usei `LEAD` para acessar a próxima linha.
- Calculei variação absoluta, percentual e temporal.
- Usei `SUM`, `AVG`, `MIN`, `MAX` e `COUNT` como windows.
- Criei total acumulado com frame explícito.
- Criei média móvel das últimas três Ordens.
- Pratiquei `FIRST_VALUE` e `LAST_VALUE`.
- Entendi a influência do frame em `LAST_VALUE`.
- Combinei agregação mensal e window function.
- Reutilizei uma definição com janela nomeada.
- Observei o nó `WindowAgg` no plano.
- Removi o schema exclusivo do laboratório.
- Próxima aula: JSONB no PostgreSQL.
```

---

## Referencia tecnica curta

```text
OVER:
ativa a janela.

PARTITION BY:
divide grupos.

ORDER BY:
define sequência.

ROW_NUMBER:
numeração única.

RANK:
empate com lacuna.

DENSE_RANK:
empate sem lacuna.

LAG:
anterior.

LEAD:
próximo.

ROWS:
frame por linhas.

UNBOUNDED:
limite da partição.
```

Regra final:

```text
uma funcao window correta depende de granularidade, particao, ordem e frame explicitamente escolhidos.
```
