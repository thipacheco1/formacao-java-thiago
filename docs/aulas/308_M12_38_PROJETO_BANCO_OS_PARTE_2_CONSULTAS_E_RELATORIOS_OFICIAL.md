# 308 - M12.38 - Projeto banco OS parte 2 consultas e relatorios

## Apresentacao da aula

Na aula 307, você construiu o modelo físico do projeto final do M12 no schema persistente:

```text
projeto_os_final
```

O modelo possui Cliente, Produto, Técnico, Ordem de Serviço, Atividade, associação Atividade–Técnico, Pagamento e Histórico de Status. Também possui chaves, constraints, índices, migrations V1 a V4 e seed determinístico.

Agora o projeto precisa responder perguntas de backend:

```text
qual é a visão consolidada de uma Ordem?

quanto foi previsto, parcelado, pago e ainda falta receber?

quais Pagamentos estão vencidos?

quais Clientes possuem maior volume financeiro?

qual é a carga de cada Técnico?

qual foi a última transição de status?

como paginar Ordens de forma determinística?
```

O desafio principal não é apenas retornar linhas. É manter granularidade, evitar duplicações, tratar nulos, documentar fórmulas e validar o resultado.

A maior armadilha será o fan-out. Se uma Ordem possui duas Atividades e dois Pagamentos, um join direto entre as duas relações filhas produz quatro linhas. Somar valores depois desse join multiplica mão de obra e Pagamentos.

A solução central será:

```text
pré-agregar cada relação filha em sua própria granularidade;

somente depois juntar os resumos à Ordem.
```

Você criará a migration:

```text
V5__criar_views_backend.sql
```

Ela adicionará:

```text
vw_ordem_resumo_backend;

vw_pagamento_pendente_backend;

vw_carga_tecnico_backend.
```

As views permanecerão disponíveis para a revisão da aula 309.

A próxima aula será:

```text
309 - M12.39 - Revisao tecnica SQL PostgreSQL e simulado
```

---

## Onde estamos na formacao

A sequência final do módulo é:

```text
307:
modelo físico do projeto OS.

308:
consultas e relatórios.

309:
revisão técnica e simulado.

310:
fechamento do M12.
```

A aula 307 respondeu como os dados são armazenados e protegidos. A aula 308 responde como transformá-los em informação confiável.

Você aplicará:

- joins;
- agregações;
- `FILTER`;
- CTEs;
- views;
- funções de data;
- window functions;
- paginação;
- índices;
- `EXPLAIN`.

Nenhuma tabela central será redesenhada. A evolução persistente será a criação das views de leitura.

---

## Objetivo pratico

Crie:

```text
labs/m12/aula-308-projeto-banco-os-parte-2-consultas-relatorios
```

Estrutura final:

```text
labs
└── m12
    └── aula-308-projeto-banco-os-parte-2-consultas-relatorios
        ├── README.md
        ├── docs
        │   ├── checklist-fanout.md
        │   ├── contratos-relatorios.md
        │   ├── matriz-indicadores.md
        │   └── parecer-indices.md
        ├── migrations
        │   └── V5__criar_views_backend.sql
        ├── scripts
        │   ├── 01_aplicar_views.ps1
        │   └── 02_validar_relatorios.ps1
        └── sql
            ├── 00_verificar_precondicoes.sql
            ├── 01_demonstrar_fanout.sql
            ├── 02_resumos_pre_agregados.sql
            ├── 03_relatorio_consolidado_ordem.sql
            ├── 04_pagamentos_e_inadimplencia.sql
            ├── 05_ranking_clientes.sql
            ├── 06_carga_tecnicos.sql
            ├── 07_top_produtos.sql
            ├── 08_historico_transicoes.sql
            ├── 09_consistencia_status_historico.sql
            ├── 10_paginacao_offset_keyset.sql
            ├── 11_consultar_views_backend.sql
            ├── 12_explain_planos.sql
            ├── 13_validar_resultados.sql
            ├── 14_exercicio.sql
            └── 15_checkpoint_final.sql
```

Métricas esperadas:

```text
valor previsto:
5200.00.

mão de obra:
2960.00.

total parcelado:
4500.00.

total pago:
2700.00.

total pendente:
1800.00.

saldo em relação ao previsto:
2500.00.
```

A inadimplência será calculada com a data fixa:

```text
2026-06-01
```

Assim, o laboratório continuará reproduzível.

---

## Conceito essencial

### Contrato antes do SQL

Antes de escrever a consulta, declare:

```text
granularidade;

filtros;

parâmetros;

tratamento de nulos;

ordenação;

data de referência;

inclusão de registros sem filhos.
```

Contrato do consolidado:

```text
uma linha por Ordem;

inclui Ordem sem Pagamento ou Técnico;

ordena por aberta_em DESC e ordem_id DESC;

agregações ausentes viram zero;

último Histórico usa data e ID como desempate.
```

### Fan-out

Considere:

```sql
FROM projeto_os_final.ordem_servico AS ordem
LEFT JOIN projeto_os_final.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN projeto_os_final.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
```

Cada Atividade combina com cada Pagamento da Ordem. A consulta executa, mas pode entregar totais falsos.

### Pre-agregacao

Resuma cada filho separadamente:

```sql
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS total_mao_obra
    FROM projeto_os_final.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor) AS total_parcelado
    FROM projeto_os_final.pagamento
    GROUP BY ordem_servico_id
)
SELECT ...
```

Cada CTE retorna uma linha por Ordem. O join final preserva a granularidade.

### COUNT DISTINCT nao resolve tudo

`COUNT(DISTINCT atividade.id)` pode corrigir uma contagem, mas não corrige automaticamente somas, médias, percentuais ou `string_agg`. Use `DISTINCT` somente quando a semântica pede valores distintos.

### FILTER

PostgreSQL permite agregações condicionais:

```sql
count(*) FILTER (
    WHERE status = 'CONCLUIDA'
)
```

```sql
sum(valor) FILTER (
    WHERE status = 'PAGO'
)
```

Isso mantém várias métricas em uma agregação legível.

### LEFT JOIN, NULL e zero

Relatórios precisam incluir Ordem sem Pagamento e Técnico sem alocação. Por isso, vários joins serão `LEFT JOIN`.

Depois do join:

```text
count(coluna_filha):
zero.

sum(coluna_filha):
NULL.
```

Use `COALESCE` quando o contrato realmente exige zero. Ausência de Histórico não deve ser escondida como texto vazio.

### Indicadores financeiros

O projeto diferencia:

```text
valor_previsto:
valor acordado da Ordem.

total_parcelado:
soma das parcelas cadastradas.

total_pago:
soma de Pagamentos PAGO.

total_pendente:
soma de Pagamentos PENDENTE.
```

Saldo a receber:

```text
valor_previsto - total_pago.
```

Diferença de parcelamento:

```text
valor_previsto - total_parcelado.
```

Percentual pago:

```sql
total_pago
/ nullif(valor_previsto, 0)
* 100
```

`NULLIF` evita divisão por zero. Uma Ordem de valor zero não será considerada automaticamente 100% paga.

### Relogio controlado

Inadimplência depende de data. Em vez de `CURRENT_DATE`, o teste usará:

```sql
WITH parametros AS (
    SELECT DATE '2026-06-01'
        AS data_referencia
)
```

Um relatório operacional pode usar a data atual. Um teste precisa controlar o relógio.

### Ultimo registro por grupo

Para escolher o último Histórico:

```sql
row_number() OVER (
    PARTITION BY ordem_servico_id
    ORDER BY
        ocorrido_em DESC,
        id DESC
)
```

O ID resolve empates de timestamp.

### LAG e tempo entre transicoes

`LAG` acessa o evento anterior da Ordem e permite calcular:

```text
status anterior observado;

data anterior;

tempo entre transições.
```

O primeiro evento não possui anterior. Esse `NULL` é esperado.

### Rankings

O ranking deve operar depois que os dados já possuem uma linha por entidade.

Exemplo:

```sql
dense_rank() OVER (
    ORDER BY valor_previsto_total DESC
)
```

Clientes empatados recebem a mesma posição sem lacunas.

### Views de backend

Views oferecem contrato reutilizável e centralizam joins. Elas não substituem versionamento, autorização, documentação, filtros ou paginação.

A aplicação ainda deverá definir limites e parâmetros.

### Paginacao

Offset:

```sql
ORDER BY aberta_em DESC, id DESC
LIMIT 3 OFFSET 0;
```

Keyset:

```sql
WHERE (aberta_em, id) < (
    TIMESTAMPTZ '2026-03-05 12:00:00-03',
    307304
)
ORDER BY aberta_em DESC, id DESC
LIMIT 3;
```

A ordenação inclui ID para ser total e determinística.

### EXPLAIN em seed pequeno

O planejador pode escolher `Seq Scan` em tabelas pequenas. Isso não prova que um índice é inútil.

Observe estimativas, linhas reais, filtros, sorts e buffers. Não desative `enable_seqscan` para fabricar evidência.

---

## Mao na massa guiada

### 1. Criar o laboratorio

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-308-projeto-banco-os-parte-2-consultas-relatorios\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-308-projeto-banco-os-parte-2-consultas-relatorios\migrations"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-308-projeto-banco-os-parte-2-consultas-relatorios\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-308-projeto-banco-os-parte-2-consultas-relatorios\sql"

Set-Location `
  "labs\m12\aula-308-projeto-banco-os-parte-2-consultas-relatorios"
```

### 2. Criar 00_verificar_precondicoes.sql

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario;

SELECT
    to_regnamespace(
        'projeto_os_final'
    ) AS schema_projeto;

SELECT
    (SELECT count(*) FROM projeto_os_final.cliente)
        AS clientes,
    (SELECT count(*) FROM projeto_os_final.produto)
        AS produtos,
    (SELECT count(*) FROM projeto_os_final.tecnico)
        AS tecnicos,
    (SELECT count(*) FROM projeto_os_final.ordem_servico)
        AS ordens,
    (SELECT count(*) FROM projeto_os_final.atividade)
        AS atividades,
    (SELECT count(*) FROM projeto_os_final.atividade_tecnico)
        AS alocacoes,
    (SELECT count(*) FROM projeto_os_final.pagamento)
        AS pagamentos,
    (SELECT count(*) FROM projeto_os_final.ordem_status_historico)
        AS historicos;
```

Esperado:

```text
4, 4, 4, 6, 12, 10, 7 e 12.
```

### 3. Criar 01_demonstrar_fanout.sql

```sql
SELECT
    ordem.id AS ordem_id,
    atividade.id AS atividade_id,
    atividade.valor_mao_obra,
    pagamento.id AS pagamento_id,
    pagamento.valor AS pagamento_valor
FROM projeto_os_final.ordem_servico AS ordem
LEFT JOIN projeto_os_final.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN projeto_os_final.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
WHERE ordem.id = 307301
ORDER BY
    atividade.id,
    pagamento.id;

SELECT
    ordem.id AS ordem_id,
    count(*) AS linhas_do_join,
    sum(atividade.valor_mao_obra)
        AS mao_obra_incorreta,
    sum(pagamento.valor)
        AS pagamento_incorreto
FROM projeto_os_final.ordem_servico AS ordem
LEFT JOIN projeto_os_final.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN projeto_os_final.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
WHERE ordem.id = 307301
GROUP BY ordem.id;
```

Resultado incorreto:

```text
4 linhas;

1400.00 de mão de obra em vez de 700.00;

2000.00 em Pagamentos em vez de 1000.00.
```

### 4. Criar 02_resumos_pre_agregados.sql

```sql
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        count(*) FILTER (
            WHERE status = 'PENDENTE'
        ) AS atividades_pendentes,
        sum(valor_mao_obra) AS total_mao_obra
    FROM projeto_os_final.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_parcelas,
        sum(valor) AS total_parcelado,
        sum(valor) FILTER (
            WHERE status = 'PAGO'
        ) AS total_pago,
        sum(valor) FILTER (
            WHERE status = 'PENDENTE'
        ) AS total_pendente
    FROM projeto_os_final.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id,
    ordem.codigo,
    coalesce(
        atividade.quantidade_atividades,
        0
    ) AS quantidade_atividades,
    coalesce(
        atividade.total_mao_obra,
        0::numeric
    ) AS total_mao_obra,
    coalesce(
        pagamento.quantidade_parcelas,
        0
    ) AS quantidade_parcelas,
    coalesce(
        pagamento.total_pago,
        0::numeric
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0::numeric
    ) AS total_pendente
FROM projeto_os_final.ordem_servico AS ordem
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
ORDER BY ordem.id;
```

### 5. Criar V5__criar_views_backend.sql

```sql
BEGIN;

CREATE VIEW
    projeto_os_final.vw_ordem_resumo_backend
AS
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        count(*) FILTER (
            WHERE status = 'PENDENTE'
        ) AS atividades_pendentes,
        count(*) FILTER (
            WHERE status = 'EM_EXECUCAO'
        ) AS atividades_em_execucao,
        count(*) FILTER (
            WHERE status = 'CONCLUIDA'
        ) AS atividades_concluidas,
        count(*) FILTER (
            WHERE status = 'CANCELADA'
        ) AS atividades_canceladas,
        sum(valor_mao_obra) AS total_mao_obra
    FROM projeto_os_final.atividade
    GROUP BY ordem_servico_id
),
tecnico_resumo AS (
    SELECT
        atividade.ordem_servico_id,
        count(
            DISTINCT tecnico.id
        ) AS quantidade_tecnicos,
        string_agg(
            DISTINCT tecnico.nome,
            ', '
            ORDER BY tecnico.nome
        ) AS tecnicos
    FROM projeto_os_final.atividade AS atividade
    INNER JOIN projeto_os_final.atividade_tecnico
        AS alocacao
        ON alocacao.atividade_id = atividade.id
    INNER JOIN projeto_os_final.tecnico AS tecnico
        ON tecnico.id = alocacao.tecnico_id
    GROUP BY atividade.ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_parcelas,
        sum(valor) AS total_parcelado,
        sum(valor) FILTER (
            WHERE status = 'PAGO'
        ) AS total_pago,
        sum(valor) FILTER (
            WHERE status = 'PENDENTE'
        ) AS total_pendente,
        sum(valor) FILTER (
            WHERE status = 'CANCELADO'
        ) AS total_cancelado
    FROM projeto_os_final.pagamento
    GROUP BY ordem_servico_id
),
historico_ordenado AS (
    SELECT
        historico.ordem_servico_id,
        historico.status_novo,
        historico.ocorrido_em,
        historico.origem,
        historico.ator,
        row_number() OVER (
            PARTITION BY historico.ordem_servico_id
            ORDER BY
                historico.ocorrido_em DESC,
                historico.id DESC
        ) AS posicao
    FROM projeto_os_final.ordem_status_historico
        AS historico
)
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    ordem.prioridade,
    ordem.aberta_em,
    ordem.data_agendada,
    ordem.concluida_em,
    ordem.valor_previsto,
    ordem.versao,
    ordem.metadados,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    produto.id AS produto_id,
    produto.codigo AS produto_codigo,
    produto.nome AS produto_nome,
    produto.categoria AS produto_categoria,
    coalesce(atividade.quantidade_atividades, 0)
        AS quantidade_atividades,
    coalesce(atividade.atividades_pendentes, 0)
        AS atividades_pendentes,
    coalesce(atividade.atividades_em_execucao, 0)
        AS atividades_em_execucao,
    coalesce(atividade.atividades_concluidas, 0)
        AS atividades_concluidas,
    coalesce(atividade.atividades_canceladas, 0)
        AS atividades_canceladas,
    coalesce(atividade.total_mao_obra, 0::numeric)
        AS total_mao_obra,
    coalesce(tecnico.quantidade_tecnicos, 0)
        AS quantidade_tecnicos,
    tecnico.tecnicos,
    coalesce(pagamento.quantidade_parcelas, 0)
        AS quantidade_parcelas,
    coalesce(pagamento.total_parcelado, 0::numeric)
        AS total_parcelado,
    coalesce(pagamento.total_pago, 0::numeric)
        AS total_pago,
    coalesce(pagamento.total_pendente, 0::numeric)
        AS total_pendente,
    coalesce(pagamento.total_cancelado, 0::numeric)
        AS total_cancelado,
    greatest(
        ordem.valor_previsto
        - coalesce(pagamento.total_pago, 0::numeric),
        0::numeric
    ) AS saldo_a_receber,
    ordem.valor_previsto
        - coalesce(pagamento.total_parcelado, 0::numeric)
        AS diferenca_parcelamento,
    CASE
        WHEN ordem.valor_previsto > 0
            THEN round(
                coalesce(pagamento.total_pago, 0::numeric)
                / ordem.valor_previsto
                * 100,
                2
            )
        ELSE NULL
    END AS percentual_pago,
    historico.status_novo AS ultimo_status_historico,
    historico.ocorrido_em AS ultimo_status_em,
    historico.origem AS ultima_origem_status,
    historico.ator AS ultimo_ator_status,
    coalesce(
        historico.status_novo = ordem.status,
        false
    ) AS historico_consistente
FROM projeto_os_final.ordem_servico AS ordem
INNER JOIN projeto_os_final.cliente AS cliente
    ON cliente.id = ordem.cliente_id
INNER JOIN projeto_os_final.produto AS produto
    ON produto.id = ordem.produto_id
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN tecnico_resumo AS tecnico
    ON tecnico.ordem_servico_id = ordem.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
LEFT JOIN historico_ordenado AS historico
    ON historico.ordem_servico_id = ordem.id
   AND historico.posicao = 1;

CREATE VIEW
    projeto_os_final.vw_pagamento_pendente_backend
AS
SELECT
    pagamento.id AS pagamento_id,
    pagamento.parcela,
    pagamento.vencimento,
    pagamento.valor,
    pagamento.referencia_externa,
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome
FROM projeto_os_final.pagamento AS pagamento
INNER JOIN projeto_os_final.ordem_servico AS ordem
    ON ordem.id = pagamento.ordem_servico_id
INNER JOIN projeto_os_final.cliente AS cliente
    ON cliente.id = ordem.cliente_id
WHERE pagamento.status = 'PENDENTE';

CREATE VIEW
    projeto_os_final.vw_carga_tecnico_backend
AS
SELECT
    tecnico.id AS tecnico_id,
    tecnico.matricula,
    tecnico.nome AS tecnico_nome,
    tecnico.especialidade,
    tecnico.ativo,
    count(alocacao.atividade_id)
        AS quantidade_atividades,
    count(DISTINCT atividade.ordem_servico_id)
        AS quantidade_ordens,
    coalesce(
        sum(alocacao.horas_previstas),
        0::numeric
    ) AS horas_previstas,
    count(*) FILTER (
        WHERE atividade.status = 'PENDENTE'
    ) AS atividades_pendentes,
    count(*) FILTER (
        WHERE atividade.status = 'EM_EXECUCAO'
    ) AS atividades_em_execucao,
    count(*) FILTER (
        WHERE atividade.status = 'CONCLUIDA'
    ) AS atividades_concluidas,
    count(*) FILTER (
        WHERE atividade.status = 'CANCELADA'
    ) AS atividades_canceladas
FROM projeto_os_final.tecnico AS tecnico
LEFT JOIN projeto_os_final.atividade_tecnico AS alocacao
    ON alocacao.tecnico_id = tecnico.id
LEFT JOIN projeto_os_final.atividade AS atividade
    ON atividade.id = alocacao.atividade_id
GROUP BY
    tecnico.id,
    tecnico.matricula,
    tecnico.nome,
    tecnico.especialidade,
    tecnico.ativo;

COMMIT;
```

Técnicos são resumidos separadamente para não duplicar o valor de uma Atividade que possui dois profissionais.

### 6. Criar scripts/01_aplicar_views.ps1

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

$schemaExiste = docker exec $container `
    psql -X -tA `
    -U formacao `
    -d $database `
    -c (
        "SELECT to_regnamespace(" +
        "'projeto_os_final')" +
        " IS NOT NULL;"
    )

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao verificar o schema."
}

if ($schemaExiste.Trim() -ne "t") {
    throw "Conclua a aula 307 antes da 308."
}

$viewExiste = docker exec $container `
    psql -X -tA `
    -U formacao `
    -d $database `
    -c (
        "SELECT to_regclass(" +
        "'projeto_os_final." +
        "vw_ordem_resumo_backend')" +
        " IS NOT NULL;"
    )

if ($viewExiste.Trim() -eq "t") {
    throw "A migration V5 já foi aplicada."
}

$migration = Join-Path `
    $labRoot `
    "migrations\V5__criar_views_backend.sql"

Get-Content -Raw $migration |
    docker exec -i $container `
        psql -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d $database

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao aplicar V5."
}

Write-Host "Views de backend criadas."
```

Execute:

```powershell
.\scripts\01_aplicar_views.ps1
```

### 7. Criar 03_relatorio_consolidado_ordem.sql

```sql
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    prioridade,
    cliente_codigo,
    cliente_nome,
    produto_codigo,
    produto_nome,
    valor_previsto,
    quantidade_atividades,
    total_mao_obra,
    quantidade_tecnicos,
    tecnicos,
    quantidade_parcelas,
    total_parcelado,
    total_pago,
    total_pendente,
    saldo_a_receber,
    diferenca_parcelamento,
    percentual_pago,
    ultimo_status_historico,
    ultimo_status_em,
    historico_consistente
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY
    aberta_em DESC,
    ordem_id DESC;
```

A view deve retornar seis linhas.

### 8. Criar 04_pagamentos_e_inadimplencia.sql

```sql
WITH parametros AS (
    SELECT DATE '2026-06-01'
        AS data_referencia
)
SELECT
    pagamento.pagamento_id,
    pagamento.ordem_codigo,
    pagamento.cliente_codigo,
    pagamento.cliente_nome,
    pagamento.parcela,
    pagamento.vencimento,
    pagamento.valor,
    parametro.data_referencia
        - pagamento.vencimento
        AS dias_em_atraso
FROM projeto_os_final.vw_pagamento_pendente_backend
    AS pagamento
CROSS JOIN parametros AS parametro
WHERE pagamento.vencimento
    < parametro.data_referencia
ORDER BY
    pagamento.vencimento,
    pagamento.pagamento_id;

WITH parametros AS (
    SELECT DATE '2026-06-01'
        AS data_referencia
)
SELECT
    pagamento.cliente_id,
    pagamento.cliente_codigo,
    pagamento.cliente_nome,
    count(*) AS parcelas_vencidas,
    sum(pagamento.valor) AS valor_vencido,
    min(pagamento.vencimento)
        AS vencimento_mais_antigo
FROM projeto_os_final.vw_pagamento_pendente_backend
    AS pagamento
CROSS JOIN parametros AS parametro
WHERE pagamento.vencimento
    < parametro.data_referencia
GROUP BY
    pagamento.cliente_id,
    pagamento.cliente_codigo,
    pagamento.cliente_nome
ORDER BY
    valor_vencido DESC,
    pagamento.cliente_id;
```

Esperado:

```text
2 parcelas vencidas;

1800.00 vencido.
```

### 9. Criar 05_ranking_clientes.sql

```sql
WITH cliente_resumo AS (
    SELECT
        cliente.id AS cliente_id,
        cliente.codigo AS cliente_codigo,
        cliente.nome AS cliente_nome,
        count(ordem.ordem_id)
            AS quantidade_ordens,
        coalesce(
            sum(ordem.valor_previsto),
            0::numeric
        ) AS valor_previsto_total,
        coalesce(
            sum(ordem.total_pago),
            0::numeric
        ) AS total_pago,
        coalesce(
            sum(ordem.total_pendente),
            0::numeric
        ) AS total_pendente,
        coalesce(
            sum(ordem.total_mao_obra),
            0::numeric
        ) AS total_mao_obra,
        count(*) FILTER (
            WHERE ordem.ordem_status = 'CONCLUIDA'
        ) AS ordens_concluidas,
        count(*) FILTER (
            WHERE ordem.ordem_status IN (
                'ABERTA',
                'AGENDADA',
                'EM_ATENDIMENTO'
            )
        ) AS ordens_ativas
    FROM projeto_os_final.cliente AS cliente
    LEFT JOIN projeto_os_final.vw_ordem_resumo_backend
        AS ordem
        ON ordem.cliente_id = cliente.id
    GROUP BY
        cliente.id,
        cliente.codigo,
        cliente.nome
)
SELECT
    *,
    dense_rank() OVER (
        ORDER BY valor_previsto_total DESC
    ) AS posicao_financeira
FROM cliente_resumo
ORDER BY
    posicao_financeira,
    cliente_id;
```

Valores esperados:

```text
Alfa: 2500.00;
Gama: 1900.00;
Beta: 800.00;
Cliente sem Ordem: 0.00.
```

### 10. Criar 06_carga_tecnicos.sql

```sql
SELECT
    tecnico_id,
    matricula,
    tecnico_nome,
    especialidade,
    quantidade_atividades,
    quantidade_ordens,
    horas_previstas,
    atividades_pendentes,
    atividades_em_execucao,
    atividades_concluidas,
    dense_rank() OVER (
        ORDER BY horas_previstas DESC
    ) AS posicao_por_horas
FROM projeto_os_final.vw_carga_tecnico_backend
ORDER BY
    posicao_por_horas,
    tecnico_id;
```

Horas esperadas:

```text
Bruno: 5.50;
Ana: 4.50;
Carla: 4.00;
Daniel: 0.00.
```

### 11. Criar 07_top_produtos.sql

```sql
WITH produto_resumo AS (
    SELECT
        produto.id AS produto_id,
        produto.codigo AS produto_codigo,
        produto.nome AS produto_nome,
        produto.categoria,
        count(ordem.id) AS quantidade_ordens,
        coalesce(
            sum(ordem.valor_previsto),
            0::numeric
        ) AS valor_previsto_total,
        round(
            avg(ordem.valor_previsto),
            2
        ) AS media_valor_ordem,
        count(*) FILTER (
            WHERE ordem.status = 'CONCLUIDA'
        ) AS ordens_concluidas,
        count(*) FILTER (
            WHERE ordem.status IN (
                'ABERTA',
                'AGENDADA',
                'EM_ATENDIMENTO'
            )
        ) AS ordens_ativas
    FROM projeto_os_final.produto AS produto
    LEFT JOIN projeto_os_final.ordem_servico AS ordem
        ON ordem.produto_id = produto.id
    GROUP BY
        produto.id,
        produto.codigo,
        produto.nome,
        produto.categoria
)
SELECT
    *,
    dense_rank() OVER (
        ORDER BY valor_previsto_total DESC
    ) AS posicao_por_valor
FROM produto_resumo
ORDER BY
    posicao_por_valor,
    produto_id;
```

Lavadora ocupa a primeira posição com `2700.00`.

### 12. Criar 08_historico_transicoes.sql

```sql
WITH transicoes AS (
    SELECT
        historico.id AS historico_id,
        historico.ordem_servico_id,
        ordem.codigo AS ordem_codigo,
        historico.status_anterior,
        historico.status_novo,
        historico.ocorrido_em,
        historico.origem,
        historico.ator,
        lag(historico.status_novo) OVER (
            PARTITION BY historico.ordem_servico_id
            ORDER BY
                historico.ocorrido_em,
                historico.id
        ) AS status_novo_anterior,
        lag(historico.ocorrido_em) OVER (
            PARTITION BY historico.ordem_servico_id
            ORDER BY
                historico.ocorrido_em,
                historico.id
        ) AS ocorrido_em_anterior
    FROM projeto_os_final.ordem_status_historico
        AS historico
    INNER JOIN projeto_os_final.ordem_servico AS ordem
        ON ordem.id = historico.ordem_servico_id
)
SELECT
    historico_id,
    ordem_servico_id,
    ordem_codigo,
    status_anterior,
    status_novo,
    status_novo_anterior,
    ocorrido_em,
    ocorrido_em - ocorrido_em_anterior
        AS tempo_desde_transicao_anterior,
    origem,
    ator
FROM transicoes
ORDER BY
    ordem_servico_id,
    ocorrido_em,
    historico_id;
```

### 13. Criar 09_consistencia_status_historico.sql

```sql
WITH ultimo_historico AS (
    SELECT
        historico.ordem_servico_id,
        historico.status_novo,
        historico.ocorrido_em,
        row_number() OVER (
            PARTITION BY historico.ordem_servico_id
            ORDER BY
                historico.ocorrido_em DESC,
                historico.id DESC
        ) AS posicao
    FROM projeto_os_final.ordem_status_historico
        AS historico
)
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS status_atual,
    historico.status_novo
        AS ultimo_status_historico,
    historico.ocorrido_em,
    CASE
        WHEN historico.status_novo IS NULL
            THEN 'SEM_HISTORICO'
        WHEN historico.status_novo = ordem.status
            THEN 'CONSISTENTE'
        ELSE 'DIVERGENTE'
    END AS resultado
FROM projeto_os_final.ordem_servico AS ordem
LEFT JOIN ultimo_historico AS historico
    ON historico.ordem_servico_id = ordem.id
   AND historico.posicao = 1
ORDER BY ordem.id;

SELECT count(*) AS divergencias
FROM projeto_os_final.vw_ordem_resumo_backend
WHERE NOT historico_consistente;
```

Esperado: zero divergências.

### 14. Criar 10_paginacao_offset_keyset.sql

```sql
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    cliente_nome,
    aberta_em
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY
    aberta_em DESC,
    ordem_id DESC
LIMIT 3
OFFSET 0;

SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    cliente_nome,
    aberta_em
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY
    aberta_em DESC,
    ordem_id DESC
LIMIT 3
OFFSET 3;

SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    cliente_nome,
    aberta_em
FROM projeto_os_final.vw_ordem_resumo_backend
WHERE (aberta_em, ordem_id) < (
    TIMESTAMPTZ '2026-03-05 12:00:00-03',
    307304
)
ORDER BY
    aberta_em DESC,
    ordem_id DESC
LIMIT 3;
```

O cursor é a última linha da primeira página do seed.

### 15. Criar 11_consultar_views_backend.sql

```sql
SELECT
    ordem_codigo,
    cliente_nome,
    ordem_status,
    valor_previsto,
    total_pago,
    total_pendente,
    saldo_a_receber,
    percentual_pago
FROM projeto_os_final.vw_ordem_resumo_backend
WHERE ordem_status IN (
    'ABERTA',
    'AGENDADA',
    'EM_ATENDIMENTO'
)
ORDER BY
    aberta_em,
    ordem_id;

SELECT
    pagamento_id,
    ordem_codigo,
    cliente_nome,
    vencimento,
    valor
FROM projeto_os_final.vw_pagamento_pendente_backend
ORDER BY
    vencimento,
    pagamento_id;

SELECT
    tecnico_nome,
    especialidade,
    quantidade_atividades,
    horas_previstas
FROM projeto_os_final.vw_carga_tecnico_backend
ORDER BY
    horas_previstas DESC,
    tecnico_id;
```

### 16. Criar 12_explain_planos.sql

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SUMMARY
)
SELECT
    id,
    codigo,
    status,
    prioridade,
    aberta_em
FROM projeto_os_final.ordem_servico
WHERE status = 'EM_ATENDIMENTO'
  AND prioridade = 'CRITICA'
ORDER BY
    aberta_em DESC,
    id DESC;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SUMMARY
)
SELECT
    id,
    ordem_servico_id,
    parcela,
    vencimento,
    valor
FROM projeto_os_final.pagamento
WHERE status = 'PENDENTE'
ORDER BY
    vencimento,
    id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SUMMARY
)
SELECT
    ordem_id,
    ordem_codigo,
    cliente_nome,
    total_pago,
    total_pendente
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY
    aberta_em DESC,
    ordem_id DESC;
```

Registre plano, estimativas, linhas reais, buffers e sorts.

### 17. Criar 13_validar_resultados.sql

```sql
DO $$
DECLARE
    v_ordens bigint;
    v_previsto numeric;
    v_mao_obra numeric;
    v_parcelado numeric;
    v_pago numeric;
    v_pendente numeric;
    v_saldo numeric;
    v_divergencias bigint;
BEGIN
    SELECT
        count(*),
        sum(valor_previsto),
        sum(total_mao_obra),
        sum(total_parcelado),
        sum(total_pago),
        sum(total_pendente),
        sum(saldo_a_receber),
        count(*) FILTER (
            WHERE NOT historico_consistente
        )
    INTO
        v_ordens,
        v_previsto,
        v_mao_obra,
        v_parcelado,
        v_pago,
        v_pendente,
        v_saldo,
        v_divergencias
    FROM projeto_os_final.vw_ordem_resumo_backend;

    IF v_ordens <> 6
       OR v_previsto <> 5200.00
       OR v_mao_obra <> 2960.00
       OR v_parcelado <> 4500.00
       OR v_pago <> 2700.00
       OR v_pendente <> 1800.00
       OR v_saldo <> 2500.00
       OR v_divergencias <> 0 THEN
        RAISE EXCEPTION
            'Resumo inválido: %, %, %, %, %, %, %, %',
            v_ordens,
            v_previsto,
            v_mao_obra,
            v_parcelado,
            v_pago,
            v_pendente,
            v_saldo,
            v_divergencias;
    END IF;
END
$$;

DO $$
DECLARE
    v_pendencias bigint;
    v_valor numeric;
    v_tecnicos bigint;
    v_horas numeric;
BEGIN
    SELECT
        count(*),
        sum(valor)
    INTO
        v_pendencias,
        v_valor
    FROM projeto_os_final.vw_pagamento_pendente_backend;

    SELECT
        count(*),
        sum(horas_previstas)
    INTO
        v_tecnicos,
        v_horas
    FROM projeto_os_final.vw_carga_tecnico_backend;

    IF v_pendencias <> 2
       OR v_valor <> 1800.00
       OR v_tecnicos <> 4
       OR v_horas <> 14.00 THEN
        RAISE EXCEPTION
            'Views auxiliares inválidas: %, %, %, %',
            v_pendencias,
            v_valor,
            v_tecnicos,
            v_horas;
    END IF;
END
$$;
```

O arquivo falha se uma métrica central divergir.

### 18. Criar scripts/02_validar_relatorios.ps1

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

$arquivos = @(
    "00_verificar_precondicoes.sql",
    "03_relatorio_consolidado_ordem.sql",
    "09_consistencia_status_historico.sql",
    "13_validar_resultados.sql",
    "15_checkpoint_final.sql"
)

foreach ($arquivo in $arquivos) {
    $path = Join-Path `
        $labRoot `
        "sql\$arquivo"

    Write-Host "Executando $arquivo"

    Get-Content -Raw $path |
        docker exec -i $container `
            psql -X `
            -v ON_ERROR_STOP=1 `
            -U formacao `
            -d $database

    if ($LASTEXITCODE -ne 0) {
        throw "Falha em $arquivo"
    }
}

Write-Host "Relatórios validados."
```

### 19. Criar 15_checkpoint_final.sql

```sql
SELECT
    to_regclass(
        'projeto_os_final.vw_ordem_resumo_backend'
    ) AS view_ordens,
    to_regclass(
        'projeto_os_final.vw_pagamento_pendente_backend'
    ) AS view_pagamentos,
    to_regclass(
        'projeto_os_final.vw_carga_tecnico_backend'
    ) AS view_tecnicos;

SELECT
    count(*) AS ordens,
    sum(valor_previsto) AS previsto,
    sum(total_mao_obra) AS mao_obra,
    sum(total_pago) AS pago,
    sum(total_pendente) AS pendente,
    sum(saldo_a_receber) AS saldo
FROM projeto_os_final.vw_ordem_resumo_backend;
```

As três views devem existir.

### 20. Criar a documentacao

Em `docs/checklist-fanout.md`, registre granularidade, cardinalidade de cada join, risco de multiplicação, pré-agregação e comparação manual de uma Ordem.

Em `docs/contratos-relatorios.md`, documente consolidado, inadimplência, ranking, carga, Produtos, Histórico e paginação. Para cada relatório, declare filtros, parâmetros, nulos, ordenação, tipos e resultado esperado.

Em `docs/matriz-indicadores.md`, registre fórmula, fonte e significado de previsto, parcelado, pago, pendente, saldo, diferença de parcelamento, percentual pago, atraso, horas e tempo entre transições.

Em `docs/parecer-indices.md`, relacione consultas aos índices existentes e classifique cada decisão como manter, medir com massa maior, candidato futuro ou não criar.

---

## Entendendo o que foi feito

### Granularidade estavel

O consolidado possui uma linha por Ordem. Atividades, Técnicos, Pagamentos e Histórico foram resumidos separadamente.

### Fan-out eliminado

A consulta incorreta multiplicou valores. As CTEs corrigiram a causa, não apenas a apresentação.

### Indicadores diferentes

Saldo, total pendente e diferença de parcelamento não foram tratados como sinônimos.

### Window functions aplicadas

`ROW_NUMBER` escolheu o último Histórico. `LAG` comparou transições. `DENSE_RANK` classificou entidades.

### Views reutilizaveis

As views centralizam joins, mas filtros, limites e paginação continuam sob responsabilidade do consumidor.

### Planos lidos com criterio

A ausência de índice em seis linhas não motivou mudanças precipitadas. O parecer registra o que precisa ser medido com volume representativo.

---

## Erros comuns importantes

### Somar depois de varios joins 1:N

Os valores podem ser multiplicados. Pré-agregue cada filho.

### Usar DISTINCT como remendo

Ele não corrige qualquer métrica.

### Converter NULL em zero sem contrato

Ausência de Histórico não é texto vazio.

### Usar data atual em teste fixo

O resultado muda diariamente. Injete a data.

### Ordenar sem desempate

Paginação e seleção do último registro ficam instáveis.

---

## Comandos uteis

### Aplicar V5

```powershell
.\scripts\01_aplicar_views.ps1
```

### Validar

```powershell
.\scripts\02_validar_relatorios.ps1
```

### Consultar consolidado

```sql
SELECT *
FROM projeto_os_final.vw_ordem_resumo_backend;
```

### Inspecionar views

```sql
SELECT
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE schemaname = 'projeto_os_final';
```

---

## Exercicio guiado

Use:

```text
sql/14_exercicio.sql
```

Não altere o seed oficial.

### Parte 1 - Prioridade ordenada

Liste Ordens ativas na ordem `CRITICA`, `ALTA`, `NORMAL`, `BAIXA`. Use `CASE` no `ORDER BY` e depois a abertura mais antiga.

### Parte 2 - Dashboard operacional

Retorne uma linha por status com quantidade, valor previsto, total pago, total pendente, mão de obra e percentual no total geral.

### Parte 3 - Cliente com risco financeiro

Por Cliente, calcule parcelas vencidas, valor vencido, vencimento mais antigo, Ordens ativas e saldo total. Use `2026-06-01` e evite fan-out.

### Parte 4 - Tecnico sem alocacao

Classifique Técnicos como `SEM_ALOCACAO`, `DISPONIVEL` ou `OCUPADO`, usando horas e Atividades abertas. Documente que a classificação é didática.

### Parte 5 - Ultima e penultima transicao

Retorne status atual, último Histórico, penúltimo Histórico, data da última mudança e duração entre as duas últimas transições. Ordens com um evento devem permanecer.

### Parte 6 - Top duas Ordens por Cliente

Use `ROW_NUMBER` particionado por Cliente e ordenado por valor decrescente e ID. Filtre em CTE.

### Parte 7 - Paginacao por status

Crie keyset somente para Ordens ativas. O cursor deve conter `aberta_em` e `ordem_id`, mantendo o mesmo filtro em todas as páginas.

### Parte 8 - Parecer de indice

Analise:

```text
Ordens ativas por prioridade e data;

correlation_id em metadados;

relatório mensal por Produto;

último Histórico por Ordem.
```

Para cada requisito, indique índice atual, candidato, ordem de colunas, tipo, custo de escrita e massa necessária para medir. Não crie índices.

### Parte 9 - Validacao de fan-out

Use a Ordem `307305`:

```text
3 Atividades;
2 Pagamentos;
6 linhas no join direto;
750.00 de mão de obra;
1200.00 pagos.
```

Demonstre o valor incorreto e a correção.

---

## Criterios de aceite

- o laboratório oficial da aula 308 existe;
- o arquivo e o H1 seguem a grade;
- o schema da aula 307 foi reutilizado;
- as precondições foram validadas;
- fan-out foi demonstrado;
- Atividades, Técnicos e Pagamentos foram pré-agregados;
- o último Histórico foi escolhido deterministicamente;
- V5 foi criada sem alterar V1 a V4;
- a migration usa transação;
- as três views foram criadas;
- o consolidado possui seis Ordens;
- valor previsto total é 5200;
- mão de obra total é 2960;
- total parcelado é 4500;
- total pago é 2700;
- total pendente é 1800;
- saldo total é 2500;
- inadimplência usou data fixa;
- duas parcelas vencidas foram identificadas;
- ranking de Clientes foi criado;
- carga de Técnicos inclui quem não possui alocação;
- top Produtos foi criado;
- `LAG` foi aplicado ao Histórico;
- divergências de status são zero;
- offset e keyset foram praticados;
- a ordenação possui desempate;
- planos foram analisados;
- nenhum índice foi criado sem medição;
- contratos e indicadores foram documentados;
- o exercício não alterou o seed;
- `projeto_os_final` permaneceu disponível;
- a aula 309 não foi antecipada;
- o commit recomendado pode ser realizado.

---

## Commit recomendado

```powershell
git status
git diff
```

Adicione:

```powershell
git add `
  labs/m12/aula-308-projeto-banco-os-parte-2-consultas-relatorios
```

Commit:

```powershell
git commit -m "feat(m12): criar consultas e relatorios do projeto os"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou o modelo físico em contratos de leitura para backend.

Consolidou:

```text
granularidade;
fan-out;
pré-agregação;
FILTER;
COALESCE;
views;
indicadores;
inadimplência;
rankings;
window functions;
paginação;
EXPLAIN.
```

Regras principais:

```text
declare a granularidade antes do SQL;

joins 1:N independentes podem multiplicar linhas;

pré-agregue cada relação filha;

COUNT DISTINCT não corrige qualquer métrica;

NULL e zero possuem significados diferentes;

relatórios temporais precisam de relógio controlado;

último registro exige ordem determinística;

views precisam de contrato e versionamento;

paginação precisa de desempate;

índices são avaliados com volume representativo.
```

A próxima aula será:

```text
309 - M12.39 - Revisao tecnica SQL PostgreSQL e simulado
```

O schema e as views desta aula devem permanecer disponíveis.

---

# Material complementar

## Checkpoint final

- [ ] Eliminei fan-out com pré-agregações.
- [ ] Apliquei V5 e validei as três views.
- [ ] Confirmei todas as métricas.
- [ ] Preservei o projeto e fiz o commit.

---

## Troubleshooting adicional

### relation projeto_os_final does not exist

A aula 307 não foi aplicada ou o schema foi removido. Reconstrua V1 a V4.

### view already exists

V5 já foi aplicada. Não reaplique nem edite a migration.

### totals aparecem multiplicados

Existe join entre filhos antes da agregação. Separe os resumos.

### sum retorna NULL

Não existem linhas para o grupo. Use `COALESCE` somente se o contrato exige zero.

### keyset repete ou pula linhas

O cursor não contém todos os componentes ou os filtros mudaram.

---

## Perguntas de revisao

1. O que é granularidade?
2. O que é fan-out?
3. Como a pré-agregação resolve o problema?
4. `COUNT DISTINCT` corrige qualquer soma?
5. Para que serve `FILTER`?
6. Por que `SUM` sem filhos retorna `NULL`?
7. Qual a diferença entre parcelado e pago?
8. Qual a diferença entre saldo e pendência?
9. Por que usar data fixa?
10. Como escolher o último Histórico?
11. Para que serve `LAG`?
12. Como filtrar um ranking?
13. Por que usar `LEFT JOIN` no Técnico?
14. O que uma view oferece?
15. View substitui paginação?
16. Qual é o desempate das Ordens?
17. Por que o plano pode usar `Seq Scan`?
18. Por que não criar índice imediatamente?
19. Quais views foram criadas?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Significado de uma linha.
2. Multiplicação causada por joins.
3. Cada filho vira uma linha por pai antes do join.
4. Não.
5. Agregação condicional.
6. Não existe valor para agregar.
7. Cadastrado versus recebido.
8. Saldo considera previsto; pendência considera parcelas.
9. Reprodutibilidade.
10. `ROW_NUMBER` com data e ID descendentes.
11. Acessar a linha anterior.
12. CTE ou subquery.
13. Incluir quem não possui alocação.
14. Contrato reutilizável.
15. Não.
16. `aberta_em` e ID.
17. A tabela é pequena.
18. É necessário medir custo e benefício.
19. Resumo de Ordem, Pagamento pendente e carga de Técnico.
20. Revisão técnica e simulado.

---

## Desafio opcional

Projete um dashboard conceitual sem escrever Java.

Defina:

```text
filtros;
parâmetros;
granularidade;
ordenação;
paginação;
indicadores;
nulos;
data de referência;
limite máximo;
índices candidatos;
contrato de resposta.
```

O dashboard deve combinar Ordens ativas, Pagamentos vencidos, carga por Técnico e ranking de Clientes. Não crie uma única consulta gigante; separe responsabilidades.

---

## Atualizacao do diario de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 308 - M12.38 - Projeto banco OS parte 2 consultas e relatorios

- Reutilizei o schema persistente `projeto_os_final`.
- Declarei a granularidade de cada relatório.
- Demonstrei fan-out entre Atividades e Pagamentos.
- Confirmei que o join direto multiplicava valores.
- Pré-agreguei Atividades, Técnicos e Pagamentos separadamente.
- Usei `FILTER` para métricas condicionais.
- Usei `COALESCE` quando o contrato exigia zero.
- Criei a migration V5 sem alterar V1 a V4.
- Criei as três views de backend.
- Calculei previsto, parcelado, pago, pendente e saldo.
- Usei data fixa para inadimplência.
- Criei rankings de Clientes e Produtos.
- Criei relatório de carga por Técnico.
- Usei `LAG` para analisar transições.
- Validei o último Histórico com `ROW_NUMBER`.
- Confirmei zero divergências de status.
- Pratiquei paginação offset e keyset.
- Analisei planos sem forçar índices.
- Validei métricas por script executável.
- Preservei schema e views para a revisão.
- Próxima aula: revisão técnica SQL PostgreSQL e simulado.
```

---

## Referencia tecnica curta

```text
Granularidade:
significado de uma linha.

Fan-out:
multiplicação entre filhos.

Pré-agregação:
uma linha por pai antes do join.

FILTER:
agregação condicional.

COALESCE:
tratamento de ausência.

ROW_NUMBER:
último registro.

LAG:
transição anterior.

View:
contrato reutilizável.

Keyset:
paginação por cursor.

EXPLAIN:
leitura do plano.
```

Regra final:

```text
um relatorio confiavel preserva sua granularidade, evita fan-out, declara formulas e produz resultados verificaveis antes de ser exposto pelo backend.
```
