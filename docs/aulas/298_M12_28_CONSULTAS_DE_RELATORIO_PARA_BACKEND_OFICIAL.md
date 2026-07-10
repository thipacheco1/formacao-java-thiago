# 298 - M12.28 - Consultas de relatorio para backend

## Apresentacao da aula

Na aula 297, você consolidou um modelo relacional no schema:

```text
projeto_os
```

O modelo possui:

```text
Cliente;
Produto;
Ordem de Serviço;
Atividade;
Pagamento.
```

O seed oficial deixou:

```text
3 Clientes;
3 Produtos;
4 Ordens;
7 Atividades;
5 Pagamentos.
```

Agora esse modelo será transformado em informações úteis para um backend.

Uma API raramente devolve as tabelas exatamente como estão armazenadas.

Uma tela de gestão de Ordens pode precisar exibir:

```text
código da Ordem;
Cliente;
Produto;
status;
prioridade;
quantidade de Atividades;
Atividades concluídas;
custo de mão de obra;
valor previsto;
total pago;
total pendente;
saldo a receber;
situação financeira.
```

Esses valores estão distribuídos em várias tabelas.

O desafio não é apenas escrever joins.

Você precisa garantir:

- uma linha por entidade do relatório;
- totais corretos;
- preservação de Ordens sem Pagamentos;
- ausência de multiplicação entre tabelas filhas;
- tratamento semântico de valores nulos;
- aliases estáveis para o backend;
- filtros parametrizáveis;
- ordenação determinística;
- datas sem formatação destrutiva;
- contrato claro de cada coluna;
- consultas reutilizáveis.

O principal risco desta aula será a multiplicação de linhas.

Considere uma Ordem com:

```text
2 Atividades;
2 Pagamentos.
```

Ao juntar diretamente as duas relações filhas:

```text
2 × 2 = 4 linhas.
```

Se você executar:

```sql
sum(atividade.valor_mao_obra)
```

cada Atividade poderá ser contada duas vezes.

Se executar:

```sql
sum(pagamento.valor)
```

cada Pagamento também poderá ser duplicado.

A solução principal será:

```text
agregar Atividades por Ordem;

agregar Pagamentos por Ordem;

somente depois juntar os dois resumos à Ordem.
```

Nesta aula, você criará consultas de:

- resumo de Ordens;
- relatório financeiro;
- pagamentos pendentes e vencidos;
- indicadores operacionais;
- desempenho por Cliente;
- Produtos mais atendidos;
- listagem filtrada e paginada;
- contratos de leitura com views.

A correção semântica será priorizada.

A aula 299, **Performance inicial de SQL**, medirá essas consultas, observará planos e revisará índices. Portanto, esta aula não fará tuning aprofundado nem criará índices por tentativa.

Ao final, o schema `projeto_os` permanecerá disponível com duas views de backend.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
297:
modelagem de Ordem, Cliente, Atividade, Produto e Pagamento.

298:
consultas de relatório para backend.

299:
performance inicial de SQL.

300:
scripts versionados e conceito de migração.

301:
Flyway e versionamento de banco.
```

Você já domina os componentes usados nesta aula:

```text
JOIN;
LEFT JOIN;
GROUP BY;
HAVING;
FILTER;
CTEs;
subqueries;
CASE;
COALESCE;
NULLIF;
views;
paginação.
```

A diferença agora é a combinação orientada a um contrato real de leitura.

O fluxo recomendado será:

```text
definir a pergunta;

declarar a granularidade;

identificar as fontes;

agregar cada relação filha;

juntar os resultados;

calcular indicadores;

validar com valores conhecidos;

documentar o contrato.
```

Não comece pelo `SELECT`.

Comece pela pergunta de negócio.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-298-consultas-relatorio-backend
```

Estrutura final:

```text
labs
└── m12
    └── aula-298-consultas-relatorio-backend
        ├── README.md
        ├── docs
        │   ├── contratos-relatorios.md
        │   ├── matriz-granularidade.md
        │   └── regras-calculo.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_resumo_ordens_com_ctes.sql
            ├── 02_relatorio_financeiro_ordens.sql
            ├── 03_pagamentos_pendentes_vencidos.sql
            ├── 04_indicadores_operacionais.sql
            ├── 05_clientes_volume_financeiro.sql
            ├── 06_produtos_mais_atendidos.sql
            ├── 07_validar_multiplicacao_linhas.sql
            ├── 08_criar_views_backend.sql
            ├── 09_consultar_views_backend.sql
            ├── 10_listagem_filtrada_paginada.sql
            ├── 11_parametros_periodo_e_filtros.sql
            ├── 12_exercicio.sql
            └── 13_checkpoint_final.sql
```

Views persistentes:

```text
projeto_os.vw_ordem_resumo_backend;

projeto_os.vw_pagamento_pendente_backend.
```

O seed oficial da aula 297 não será modificado.

Valores de referência esperados:

```text
OS-PROJ-001:
2 Atividades;
mão de obra 350;
pago 500;
pendente 0.

OS-PROJ-002:
2 Atividades;
mão de obra 680;
pago 450;
pendente 450.

OS-PROJ-003:
2 Atividades;
mão de obra 150;
pago 0;
pendente 350.

OS-PROJ-004:
1 Atividade;
mão de obra 0;
sem Pagamentos.
```

Esses números servirão como oráculo do laboratório.

---

## Conceito essencial

### Relatorio e tabela operacional

Uma tabela operacional é otimizada para registrar fatos e manter integridade.

Um relatório combina fatos para responder uma pergunta.

Exemplo operacional:

```text
pagamento:
uma linha por parcela.
```

Exemplo de relatório:

```text
uma linha por Ordem com total pago e total pendente.
```

O relatório não precisa copiar sua estrutura para uma nova tabela.

Ele pode ser produzido por consulta ou view.

---

### Granularidade do relatorio

Granularidade responde:

```text
o que uma linha do resultado representa?
```

Exemplos desta aula:

```text
Resumo de Ordens:
uma linha por Ordem.

Pagamentos pendentes:
uma linha por parcela pendente.

Indicadores por status:
uma linha por status da Ordem.

Clientes:
uma linha por Cliente.

Produtos:
uma linha por Produto.
```

Se a granularidade não estiver clara, joins e agregações tendem a produzir resultados incoerentes.

---

### Multiplicacao entre tabelas filhas

Considere:

```text
Ordem 991001;
2 Atividades;
2 Pagamentos.
```

Join direto:

```sql
FROM projeto_os.ordem_servico AS ordem
LEFT JOIN projeto_os.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN projeto_os.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
```

Resultado intermediário:

```text
Atividade 1 + Pagamento 1;
Atividade 1 + Pagamento 2;
Atividade 2 + Pagamento 1;
Atividade 2 + Pagamento 2.
```

A granularidade virou:

```text
uma linha por combinação de Atividade e Pagamento.
```

Ela não é mais uma linha por Ordem.

---

### COUNT DISTINCT nao corrige tudo

Você pode tentar:

```sql
count(DISTINCT atividade.id)
```

Isso corrige a quantidade de Atividades.

Porém:

```sql
sum(atividade.valor_mao_obra)
```

continua duplicado.

Uma tentativa como:

```sql
sum(DISTINCT atividade.valor_mao_obra)
```

é incorreta quando duas Atividades diferentes possuem o mesmo valor.

O `DISTINCT` consideraria o valor repetido apenas uma vez.

A solução correta é respeitar a granularidade.

---

### Pre-agregacao

Agregue cada filha antes do join:

```sql
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS total
    FROM projeto_os.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor) AS total
    FROM projeto_os.pagamento
    GROUP BY ordem_servico_id
)
SELECT ...
```

Cada CTE retorna:

```text
no máximo uma linha por Ordem.
```

Depois, juntar as duas CTEs à Ordem preserva a granularidade desejada.

---

### LEFT JOIN para preservar o pai

A Ordem `991004` não possui Pagamentos.

Com `INNER JOIN`, ela desapareceria do resumo financeiro.

Com:

```sql
LEFT JOIN pagamento_resumo
```

ela permanece.

As colunas do resumo financeiro chegam como `NULL`.

Nesse momento, você decide se o significado correto é:

```text
NULL:
informação não aplicável ou desconhecida.

0:
nenhum valor registrado.
```

Para total de Pagamentos, ausência de linhas significa total zero.

Por isso, `COALESCE` é apropriado.

---

### FILTER em agregacoes

`FILTER` calcula agregações condicionais com clareza:

```sql
sum(valor) FILTER (
    WHERE status = 'PAGO'
)
```

Também:

```sql
count(*) FILTER (
    WHERE status = 'CONCLUIDA'
)
```

Isso evita repetir várias subqueries.

Cada expressão precisa definir quais estados entram no cálculo.

---

### Semantica financeira

Nesta aula:

```text
total_pago:
soma de Pagamentos PAGO.

total_pendente:
soma de Pagamentos PENDENTE.

total_cancelado:
soma de Pagamentos CANCELADO.

total_estornado:
soma de Pagamentos ESTORNADO.
```

Cálculos:

```text
valor_comprometido =
total_pago + total_pendente.

saldo_a_receber =
valor_previsto - total_pago.

saldo_sem_cobertura =
valor_previsto - valor_comprometido.
```

Os nomes precisam ser precisos.

`saldo_a_receber` inclui parcelas ainda pendentes.

`saldo_sem_cobertura` mostra valor previsto que ainda não está representado por Pagamento pago ou pendente.

---

### Valores negativos em relatorio

Uma consulta pode revelar:

```text
total pago maior que valor previsto;

valor comprometido maior que valor previsto.
```

Não aplique automaticamente:

```sql
greatest(saldo, 0)
```

Isso esconderia excesso de cobrança ou inconsistência.

Mostre o valor real e crie um indicador:

```text
EXCEDENTE;
EQUILIBRADO;
SEM_COBERTURA.
```

Relatório também serve para detectar problemas.

---

### Percentuais

Percentual pago:

```sql
total_pago / valor_previsto * 100
```

Quando `valor_previsto = 0`, existe divisão por zero.

Use:

```sql
total_pago
/ nullif(valor_previsto, 0)
* 100
```

O resultado será `NULL`.

Isso representa:

```text
percentual não aplicável.
```

Não transforme automaticamente em zero.

---

### Datas de referencia

Um relatório de vencimento depende de uma data.

Em produção, ela pode ser:

```text
CURRENT_DATE;
data enviada pela aplicação;
data de fechamento.
```

Para teste reproduzível, o laboratório usará:

```sql
DATE '2026-07-26'
```

Assim, os pagamentos pendentes:

```text
993004;
993005.
```

estarão vencidos.

A data será declarada em uma CTE de parâmetros, não espalhada pela consulta.

---

### Intervalos de data

Para filtrar timestamps, prefira intervalo semiaberto:

```sql
aberta_em >= :inicio
AND aberta_em < :fim_exclusivo
```

Exemplo para julho:

```text
início:
2026-07-01 00:00.

fim exclusivo:
2026-08-01 00:00.
```

Isso evita problemas com:

```text
23:59:59.999999;
precisão;
fuso;
último instante do dia.
```

---

### Contrato para backend

Uma consulta de backend precisa definir:

- nome das colunas;
- tipo;
- nulabilidade;
- granularidade;
- significado;
- filtros;
- ordenação;
- paginação;
- comportamento sem dados.

Evite:

```sql
SELECT *
```

A adição de uma coluna na tabela poderia alterar o contrato sem intenção.

Projete somente o necessário.

---

### Formato e apresentacao

O banco deve retornar:

```text
numeric para dinheiro;

date para vencimento;

timestamptz para instantes;

text para status.
```

Evite transformar valores em textos decorados:

```text
R$ 500,00;
26/07/2026;
Pago.
```

Formatação depende de idioma, localidade e canal.

O backend ou frontend deve decidir a apresentação.

---

### Dados sensiveis e minimizacao

Um relatório de Ordens pode precisar de:

```text
cliente_id;
cliente_codigo;
cliente_nome.
```

Ele talvez não precise de:

```text
documento completo;
email.
```

Não exponha atributos apenas porque estão disponíveis no join.

O contrato deve aplicar minimização de dados.

---

### Consulta de listagem e detalhe

A listagem costuma possuir:

- poucas colunas;
- filtros;
- ordenação;
- paginação.

O detalhe pode possuir:

- informações da Ordem;
- lista de Atividades;
- lista de Pagamentos;
- histórico.

Não force toda informação detalhada em uma única linha gigantesca.

Nesta aula, a view de resumo servirá à listagem e aos indicadores.

As tabelas filhas continuam disponíveis para detalhes específicos.

---

### N mais um no backend

Fluxo ineficiente:

```text
buscar 20 Ordens;

para cada Ordem, consultar Atividades;

para cada Ordem, consultar Pagamentos.
```

Isso gera:

```text
1 + 20 + 20 consultas.
```

Um relatório agregado pode retornar os principais totais em uma consulta.

Isso não significa que todo detalhe precisa ser agregado em texto ou JSON.

Significa que o contrato deve evitar viagens desnecessárias ao banco.

---

### View como contrato de leitura

Uma view pode encapsular:

- joins;
- agregações;
- aliases;
- cálculos;
- granularidade.

Vantagens:

- reutilização;
- consulta mais simples;
- contrato centralizado;
- menor duplicação.

Cuidados:

- dependências;
- alterações de coluna;
- custo oculto;
- evolução versionada;
- permissões.

A aula criará uma view de resumo e uma view de Pagamentos pendentes.

---

## Mao na massa guiada

### 1. Confirmar o ambiente

Na raiz:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Confirme o banco:

```text
formacao_java.
```

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-298-consultas-relatorio-backend\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-298-consultas-relatorio-backend\docs"

Set-Location `
  "labs\m12\aula-298-consultas-relatorio-backend"
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
    to_regnamespace(
        'projeto_os'
    ) AS schema_modelo;

SELECT
    (SELECT count(*) FROM projeto_os.cliente)
        AS clientes,
    (SELECT count(*) FROM projeto_os.produto)
        AS produtos,
    (SELECT count(*) FROM projeto_os.ordem_servico)
        AS ordens,
    (SELECT count(*) FROM projeto_os.atividade)
        AS atividades,
    (SELECT count(*) FROM projeto_os.pagamento)
        AS pagamentos;
```

Resultado esperado:

```text
3;
3;
4;
7;
5.
```

Se não corresponder, volte à aula 297.

Não reconstrua o modelo sem entender a diferença.

---

### 4. Criar 01_resumo_ordens_com_ctes.sql

Crie:

```text
sql/01_resumo_ordens_com_ctes.sql
```

Conteúdo:

```sql
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        count(*) FILTER (
            WHERE status = 'CONCLUIDA'
        ) AS atividades_concluidas,
        count(*) FILTER (
            WHERE status IN (
                'PENDENTE',
                'AGENDADA',
                'EM_EXECUCAO'
            )
        ) AS atividades_abertas,
        coalesce(
            sum(valor_mao_obra),
            0
        ) AS total_mao_obra,
        sum(duracao_prevista) AS duracao_prevista_total
    FROM projeto_os.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_pagamentos,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'PAGO'
            ),
            0
        ) AS total_pago,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'PENDENTE'
            ),
            0
        ) AS total_pendente,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'CANCELADO'
            ),
            0
        ) AS total_cancelado,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'ESTORNADO'
            ),
            0
        ) AS total_estornado
    FROM projeto_os.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    ordem.prioridade AS ordem_prioridade,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    produto.id AS produto_id,
    produto.codigo AS produto_codigo,
    produto.nome AS produto_nome,
    ordem.aberta_em,
    ordem.data_agendada,
    ordem.concluida_em,
    ordem.valor_previsto,
    coalesce(
        atividade.quantidade_atividades,
        0
    ) AS quantidade_atividades,
    coalesce(
        atividade.atividades_concluidas,
        0
    ) AS atividades_concluidas,
    coalesce(
        atividade.atividades_abertas,
        0
    ) AS atividades_abertas,
    coalesce(
        atividade.total_mao_obra,
        0
    ) AS total_mao_obra,
    atividade.duracao_prevista_total,
    coalesce(
        pagamento.quantidade_pagamentos,
        0
    ) AS quantidade_pagamentos,
    coalesce(
        pagamento.total_pago,
        0
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0
    ) AS total_pendente,
    coalesce(
        pagamento.total_cancelado,
        0
    ) AS total_cancelado,
    coalesce(
        pagamento.total_estornado,
        0
    ) AS total_estornado
FROM projeto_os.ordem_servico AS ordem
INNER JOIN projeto_os.cliente AS cliente
    ON cliente.id = ordem.cliente_id
INNER JOIN projeto_os.produto AS produto
    ON produto.id = ordem.produto_id
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
ORDER BY
    ordem.aberta_em DESC,
    ordem.id DESC;
```

A consulta retorna exatamente quatro linhas.

---

### 5. Criar 02_relatorio_financeiro_ordens.sql

Crie:

```text
sql/02_relatorio_financeiro_ordens.sql
```

Conteúdo:

```sql
WITH pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'PAGO'
            ),
            0
        ) AS total_pago,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'PENDENTE'
            ),
            0
        ) AS total_pendente,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'ESTORNADO'
            ),
            0
        ) AS total_estornado
    FROM projeto_os.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    ordem.valor_previsto,
    coalesce(
        pagamento.total_pago,
        0
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0
    ) AS total_pendente,
    coalesce(
        pagamento.total_estornado,
        0
    ) AS total_estornado,
    coalesce(
        pagamento.total_pago,
        0
    ) + coalesce(
        pagamento.total_pendente,
        0
    ) AS valor_comprometido,
    ordem.valor_previsto
        - coalesce(
            pagamento.total_pago,
            0
        ) AS saldo_a_receber,
    ordem.valor_previsto
        - coalesce(
            pagamento.total_pago,
            0
        )
        - coalesce(
            pagamento.total_pendente,
            0
        ) AS saldo_sem_cobertura,
    round(
        coalesce(
            pagamento.total_pago,
            0
        )
        / nullif(
            ordem.valor_previsto,
            0
        )
        * 100,
        2
    ) AS percentual_pago,
    CASE
        WHEN ordem.status = 'CANCELADA'
            THEN 'NAO_APLICAVEL'
        WHEN coalesce(
            pagamento.total_pago,
            0
        ) > ordem.valor_previsto
            THEN 'PAGAMENTO_EXCEDENTE'
        WHEN coalesce(
            pagamento.total_pago,
            0
        ) = ordem.valor_previsto
             AND ordem.valor_previsto > 0
            THEN 'QUITADA'
        WHEN coalesce(
            pagamento.total_pago,
            0
        ) > 0
            THEN 'PARCIAL'
        WHEN coalesce(
            pagamento.total_pendente,
            0
        ) > 0
            THEN 'AGUARDANDO_PAGAMENTO'
        ELSE 'SEM_PAGAMENTO'
    END AS situacao_financeira
FROM projeto_os.ordem_servico AS ordem
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
ORDER BY ordem.id;
```

Valide os quatro cenários do seed.

---

### 6. Criar 03_pagamentos_pendentes_vencidos.sql

Crie:

```text
sql/03_pagamentos_pendentes_vencidos.sql
```

Conteúdo:

```sql
WITH parametros AS (
    SELECT
        DATE '2026-07-26' AS data_referencia
)
SELECT
    pagamento.id AS pagamento_id,
    pagamento.referencia,
    pagamento.parcela,
    pagamento.valor,
    pagamento.vencimento,
    parametros.data_referencia,
    parametros.data_referencia
        - pagamento.vencimento AS dias_em_atraso,
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    CASE
        WHEN pagamento.vencimento
            < parametros.data_referencia
            THEN 'ATRASADO'
        WHEN pagamento.vencimento
            = parametros.data_referencia
            THEN 'VENCE_HOJE'
        ELSE 'A_VENCER'
    END AS situacao_vencimento,
    CASE
        WHEN parametros.data_referencia
            - pagamento.vencimento >= 30
            THEN '30_DIAS_OU_MAIS'
        WHEN parametros.data_referencia
            - pagamento.vencimento >= 8
            THEN 'DE_8_A_29_DIAS'
        WHEN parametros.data_referencia
            - pagamento.vencimento >= 1
            THEN 'DE_1_A_7_DIAS'
        ELSE 'SEM_ATRASO'
    END AS faixa_atraso
FROM projeto_os.pagamento AS pagamento
INNER JOIN projeto_os.ordem_servico AS ordem
    ON ordem.id = pagamento.ordem_servico_id
INNER JOIN projeto_os.cliente AS cliente
    ON cliente.id = ordem.cliente_id
CROSS JOIN parametros
WHERE pagamento.status = 'PENDENTE'
ORDER BY
    pagamento.vencimento,
    pagamento.id;
```

Resultado esperado:

```text
PAG-PROJ-003-1:
6 dias de atraso.

PAG-PROJ-002-2:
1 dia de atraso.
```

Em produção, substitua a data fixa por parâmetro ou política documentada.

---

### 7. Criar 04_indicadores_operacionais.sql

Crie:

```text
sql/04_indicadores_operacionais.sql
```

Conteúdo:

```sql
SELECT
    status,
    count(*) AS quantidade_ordens,
    sum(valor_previsto) AS valor_previsto_total,
    round(
        avg(valor_previsto),
        2
    ) AS valor_previsto_medio
FROM projeto_os.ordem_servico
GROUP BY status
ORDER BY status;

SELECT
    prioridade,
    count(*) AS quantidade_ordens,
    count(*) FILTER (
        WHERE status IN (
            'ABERTA',
            'AGENDADA',
            'EM_ATENDIMENTO'
        )
    ) AS ordens_em_fluxo,
    sum(valor_previsto) AS valor_previsto_total
FROM projeto_os.ordem_servico
GROUP BY prioridade
ORDER BY
    CASE prioridade
        WHEN 'CRITICA' THEN 1
        WHEN 'ALTA' THEN 2
        WHEN 'NORMAL' THEN 3
        WHEN 'BAIXA' THEN 4
        ELSE 5
    END;

SELECT
    status,
    count(*) AS quantidade_atividades,
    sum(valor_mao_obra) AS valor_mao_obra,
    sum(duracao_prevista) AS duracao_prevista
FROM projeto_os.atividade
GROUP BY status
ORDER BY status;
```

Os indicadores possuem granularidades diferentes.

Não os una em uma linha sem uma pergunta específica.

---

### 8. Criar 05_clientes_volume_financeiro.sql

Crie:

```text
sql/05_clientes_volume_financeiro.sql
```

Conteúdo:

```sql
WITH pagamento_por_ordem AS (
    SELECT
        ordem_servico_id,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'PAGO'
            ),
            0
        ) AS total_pago,
        coalesce(
            sum(valor) FILTER (
                WHERE status = 'PENDENTE'
            ),
            0
        ) AS total_pendente
    FROM projeto_os.pagamento
    GROUP BY ordem_servico_id
),
ordem_enriquecida AS (
    SELECT
        ordem.id,
        ordem.cliente_id,
        ordem.status,
        ordem.valor_previsto,
        coalesce(
            pagamento.total_pago,
            0
        ) AS total_pago,
        coalesce(
            pagamento.total_pendente,
            0
        ) AS total_pendente
    FROM projeto_os.ordem_servico AS ordem
    LEFT JOIN pagamento_por_ordem AS pagamento
        ON pagamento.ordem_servico_id = ordem.id
)
SELECT
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    count(ordem.id) AS quantidade_ordens,
    count(ordem.id) FILTER (
        WHERE ordem.status IN (
            'ABERTA',
            'AGENDADA',
            'EM_ATENDIMENTO'
        )
    ) AS ordens_em_fluxo,
    coalesce(
        sum(ordem.valor_previsto),
        0
    ) AS valor_previsto_total,
    coalesce(
        sum(ordem.total_pago),
        0
    ) AS total_pago,
    coalesce(
        sum(ordem.total_pendente),
        0
    ) AS total_pendente
FROM projeto_os.cliente AS cliente
LEFT JOIN ordem_enriquecida AS ordem
    ON ordem.cliente_id = cliente.id
GROUP BY
    cliente.id,
    cliente.codigo,
    cliente.nome
ORDER BY
    valor_previsto_total DESC,
    cliente.id;
```

Todos os Clientes permanecem no resultado, mesmo que futuramente algum não possua Ordem.

---

### 9. Criar 06_produtos_mais_atendidos.sql

Crie:

```text
sql/06_produtos_mais_atendidos.sql
```

Conteúdo:

```sql
WITH atividade_por_ordem AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS total_mao_obra
    FROM projeto_os.atividade
    GROUP BY ordem_servico_id
),
ordem_enriquecida AS (
    SELECT
        ordem.id,
        ordem.produto_id,
        ordem.status,
        ordem.valor_previsto,
        coalesce(
            atividade.quantidade_atividades,
            0
        ) AS quantidade_atividades,
        coalesce(
            atividade.total_mao_obra,
            0
        ) AS total_mao_obra
    FROM projeto_os.ordem_servico AS ordem
    LEFT JOIN atividade_por_ordem AS atividade
        ON atividade.ordem_servico_id = ordem.id
)
SELECT
    produto.id AS produto_id,
    produto.codigo AS produto_codigo,
    produto.nome AS produto_nome,
    count(ordem.id) AS quantidade_ordens,
    coalesce(
        sum(ordem.quantidade_atividades),
        0
    ) AS quantidade_atividades,
    coalesce(
        sum(ordem.valor_previsto),
        0
    ) AS valor_previsto_total,
    coalesce(
        sum(ordem.total_mao_obra),
        0
    ) AS total_mao_obra
FROM projeto_os.produto AS produto
LEFT JOIN ordem_enriquecida AS ordem
    ON ordem.produto_id = produto.id
GROUP BY
    produto.id,
    produto.codigo,
    produto.nome
ORDER BY
    quantidade_ordens DESC,
    quantidade_atividades DESC,
    produto.id;
```

Resultado principal:

```text
REFRIG-500:
2 Ordens;
3 Atividades.
```

---

### 10. Criar 07_validar_multiplicacao_linhas.sql

Crie:

```text
sql/07_validar_multiplicacao_linhas.sql
```

Conteúdo:

```sql
-- Consulta propositalmente incorreta.
SELECT
    ordem.id AS ordem_id,
    count(*) AS linhas_intermediarias,
    count(DISTINCT atividade.id) AS atividades_distintas,
    count(DISTINCT pagamento.id) AS pagamentos_distintos,
    sum(atividade.valor_mao_obra) AS mao_obra_incorreta,
    sum(pagamento.valor) AS pagamentos_incorretos
FROM projeto_os.ordem_servico AS ordem
LEFT JOIN projeto_os.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN projeto_os.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
WHERE ordem.id = 991001
GROUP BY ordem.id;

-- Totais corretos calculados separadamente.
SELECT
    ordem.id AS ordem_id,
    (
        SELECT sum(atividade.valor_mao_obra)
        FROM projeto_os.atividade AS atividade
        WHERE atividade.ordem_servico_id = ordem.id
    ) AS mao_obra_correta,
    (
        SELECT sum(pagamento.valor)
        FROM projeto_os.pagamento AS pagamento
        WHERE pagamento.ordem_servico_id = ordem.id
    ) AS pagamentos_corretos
FROM projeto_os.ordem_servico AS ordem
WHERE ordem.id = 991001;
```

Resultado incorreto esperado:

```text
4 linhas intermediárias;

mão de obra 700;

pagamentos 1000.
```

Resultado correto:

```text
mão de obra 350;

pagamentos 500.
```

---

### 11. Criar 08_criar_views_backend.sql

Crie:

```text
sql/08_criar_views_backend.sql
```

Conteúdo:

```sql
CREATE OR REPLACE VIEW projeto_os.vw_ordem_resumo_backend AS
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        count(*) FILTER (
            WHERE status = 'CONCLUIDA'
        ) AS atividades_concluidas,
        count(*) FILTER (
            WHERE status IN (
                'PENDENTE',
                'AGENDADA',
                'EM_EXECUCAO'
            )
        ) AS atividades_abertas,
        sum(valor_mao_obra) AS total_mao_obra,
        sum(duracao_prevista) AS duracao_prevista_total
    FROM projeto_os.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_pagamentos,
        sum(valor) FILTER (
            WHERE status = 'PAGO'
        ) AS total_pago,
        sum(valor) FILTER (
            WHERE status = 'PENDENTE'
        ) AS total_pendente,
        sum(valor) FILTER (
            WHERE status = 'CANCELADO'
        ) AS total_cancelado,
        sum(valor) FILTER (
            WHERE status = 'ESTORNADO'
        ) AS total_estornado
    FROM projeto_os.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    ordem.prioridade AS ordem_prioridade,
    ordem.descricao_problema,
    ordem.data_agendada,
    ordem.aberta_em,
    ordem.concluida_em,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    produto.id AS produto_id,
    produto.codigo AS produto_codigo,
    produto.nome AS produto_nome,
    ordem.valor_previsto,
    coalesce(
        atividade.quantidade_atividades,
        0
    ) AS quantidade_atividades,
    coalesce(
        atividade.atividades_concluidas,
        0
    ) AS atividades_concluidas,
    coalesce(
        atividade.atividades_abertas,
        0
    ) AS atividades_abertas,
    coalesce(
        atividade.total_mao_obra,
        0
    ) AS total_mao_obra,
    atividade.duracao_prevista_total,
    coalesce(
        pagamento.quantidade_pagamentos,
        0
    ) AS quantidade_pagamentos,
    coalesce(
        pagamento.total_pago,
        0
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0
    ) AS total_pendente,
    coalesce(
        pagamento.total_cancelado,
        0
    ) AS total_cancelado,
    coalesce(
        pagamento.total_estornado,
        0
    ) AS total_estornado,
    ordem.valor_previsto
        - coalesce(
            pagamento.total_pago,
            0
        ) AS saldo_a_receber,
    ordem.valor_previsto
        - coalesce(
            pagamento.total_pago,
            0
        )
        - coalesce(
            pagamento.total_pendente,
            0
        ) AS saldo_sem_cobertura
FROM projeto_os.ordem_servico AS ordem
INNER JOIN projeto_os.cliente AS cliente
    ON cliente.id = ordem.cliente_id
INNER JOIN projeto_os.produto AS produto
    ON produto.id = ordem.produto_id
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id;

CREATE OR REPLACE VIEW projeto_os.vw_pagamento_pendente_backend AS
SELECT
    pagamento.id AS pagamento_id,
    pagamento.referencia,
    pagamento.parcela,
    pagamento.valor,
    pagamento.vencimento,
    pagamento.forma,
    pagamento.criado_em,
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status AS ordem_status,
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome
FROM projeto_os.pagamento AS pagamento
INNER JOIN projeto_os.ordem_servico AS ordem
    ON ordem.id = pagamento.ordem_servico_id
INNER JOIN projeto_os.cliente AS cliente
    ON cliente.id = ordem.cliente_id
WHERE pagamento.status = 'PENDENTE';
```

A view pendente não usa `CURRENT_DATE`.

O consumidor informa a data de referência.

---

### 12. Criar 09_consultar_views_backend.sql

Crie:

```text
sql/09_consultar_views_backend.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    ordem_prioridade,
    cliente_codigo,
    cliente_nome,
    produto_codigo,
    produto_nome,
    valor_previsto,
    quantidade_atividades,
    atividades_concluidas,
    total_mao_obra,
    total_pago,
    total_pendente,
    saldo_a_receber,
    saldo_sem_cobertura
FROM projeto_os.vw_ordem_resumo_backend
ORDER BY
    aberta_em DESC,
    ordem_id DESC;

SELECT
    pagamento_id,
    referencia,
    parcela,
    valor,
    vencimento,
    ordem_codigo,
    cliente_codigo,
    cliente_nome
FROM projeto_os.vw_pagamento_pendente_backend
WHERE vencimento < DATE '2026-07-26'
ORDER BY
    vencimento,
    pagamento_id;
```

O primeiro resultado possui quatro linhas.

O segundo possui duas parcelas vencidas na data de referência.

---

### 13. Criar 10_listagem_filtrada_paginada.sql

Crie:

```text
sql/10_listagem_filtrada_paginada.sql
```

Conteúdo:

```sql
-- Primeira página com tamanho 2.
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    ordem_prioridade,
    cliente_nome,
    produto_nome,
    aberta_em,
    valor_previsto,
    total_pago,
    total_pendente
FROM projeto_os.vw_ordem_resumo_backend
WHERE ordem_status IN (
    'AGENDADA',
    'EM_ATENDIMENTO',
    'CONCLUIDA'
)
ORDER BY
    aberta_em DESC,
    ordem_id DESC
LIMIT 2;

-- Próxima página por keyset.
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    ordem_prioridade,
    cliente_nome,
    produto_nome,
    aberta_em,
    valor_previsto,
    total_pago,
    total_pendente
FROM projeto_os.vw_ordem_resumo_backend
WHERE ordem_status IN (
    'AGENDADA',
    'EM_ATENDIMENTO',
    'CONCLUIDA'
)
  AND (
      aberta_em,
      ordem_id
  ) < (
      TIMESTAMPTZ '2026-07-10 08:00:00-03',
      991002
  )
ORDER BY
    aberta_em DESC,
    ordem_id DESC
LIMIT 2;
```

O cursor usa:

```text
aberta_em;
ordem_id.
```

O filtro e a ordenação fazem parte do contrato.

---

### 14. Criar 11_parametros_periodo_e_filtros.sql

Crie:

```text
sql/11_parametros_periodo_e_filtros.sql
```

Conteúdo:

```sql
WITH parametros AS (
    SELECT
        TIMESTAMPTZ '2026-07-01 00:00:00-03'
            AS inicio,
        TIMESTAMPTZ '2026-08-01 00:00:00-03'
            AS fim_exclusivo,
        NULL::text AS status_opcional,
        NULL::bigint AS cliente_id_opcional
)
SELECT
    resumo.ordem_id,
    resumo.ordem_codigo,
    resumo.ordem_status,
    resumo.cliente_id,
    resumo.cliente_nome,
    resumo.aberta_em,
    resumo.valor_previsto,
    resumo.total_pago,
    resumo.total_pendente
FROM projeto_os.vw_ordem_resumo_backend AS resumo
CROSS JOIN parametros
WHERE resumo.aberta_em >= parametros.inicio
  AND resumo.aberta_em < parametros.fim_exclusivo
  AND (
      parametros.status_opcional IS NULL
      OR resumo.ordem_status
          = parametros.status_opcional
  )
  AND (
      parametros.cliente_id_opcional IS NULL
      OR resumo.cliente_id
          = parametros.cliente_id_opcional
  )
ORDER BY
    resumo.aberta_em DESC,
    resumo.ordem_id DESC;
```

Na aplicação, os valores devem ser parâmetros preparados.

A CTE apenas simula o contrato.

---

### 15. Criar a documentacao

Em:

```text
docs/matriz-granularidade.md
```

registre:

```text
relatório;
uma linha representa;
chave da linha;
tabelas usadas;
risco de multiplicação;
estratégia de agregação.
```

Em:

```text
docs/regras-calculo.md
```

documente as fórmulas:

```text
total_pago;
total_pendente;
valor_comprometido;
saldo_a_receber;
saldo_sem_cobertura;
percentual_pago;
dias_em_atraso.
```

Em:

```text
docs/contratos-relatorios.md
```

documente para cada view:

- finalidade;
- granularidade;
- colunas;
- tipos;
- nulos;
- filtros permitidos;
- ordenação padrão;
- paginação;
- exposição de dados;
- regras de evolução.

---

## Entendendo o que foi feito

### A granularidade guiou o desenho

O resumo devolveu uma linha por Ordem.

As relações filhas foram reduzidas para uma linha por Ordem antes do join.

---

### A Ordem sem Pagamentos permaneceu

`LEFT JOIN` preservou a Ordem cancelada.

`COALESCE` converteu ausência de linhas financeiras em totais zero.

---

### Os calculos financeiros ficaram explicitos

Total pago, pendente e saldos possuem nomes distintos.

O relatório não esconde excedentes nem divisões não aplicáveis.

---

### A data de vencimento ficou parametrizavel

A consulta de atrasos usou uma CTE de parâmetros.

O contrato pode receber outra data sem reescrever a lógica.

---

### As views criaram contratos reutilizaveis

O backend poderá consultar um resumo sem repetir toda a agregação.

A view de Pagamentos pendentes manteve o vencimento bruto para filtros dinâmicos.

---

### A listagem permaneceu deterministica

A ordenação usou:

```text
aberta_em DESC;
ordem_id DESC.
```

O mesmo par formou o cursor.

---

## Erros comuns importantes

### Somar depois de juntar duas filhas

Atividades e Pagamentos multiplicam linhas.

Pré-agregue cada filha.

---

### Usar SUM DISTINCT para corrigir

Valores iguais de entidades diferentes seriam descartados.

Corrija a granularidade, não o sintoma.

---

### Converter ausencia em zero sem analisar

Zero só é adequado quando ausência significa nenhum valor registrado.

Preserve `NULL` para informação desconhecida ou não aplicável.

---

### Formatar dinheiro no SQL

O backend perde o tipo numérico.

Retorne `numeric`.

---

### Misturar listagem e detalhe completo

O resultado fica pesado e difícil de paginar.

Separe contratos.

---

## Comandos uteis

### Agregacao condicional

```sql
sum(valor) FILTER (
    WHERE status = 'PAGO'
)
```

### Protecao contra divisao por zero

```sql
valor / nullif(total, 0)
```

### Preservar pai sem filhos

```sql
LEFT JOIN resumo_filho
    ON resumo_filho.pai_id = pai.id
```

### Intervalo semiaberto

```sql
data >= :inicio
AND data < :fim_exclusivo
```

---

## Exercicio guiado

No arquivo:

```text
sql/12_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Resumo por Ordem

Crie uma consulta com uma linha por Ordem contendo:

```text
Cliente;
Produto;
quantidade de Atividades;
mão de obra;
total pago;
total pendente;
saldo a receber.
```

Não consulte as views prontas.

Use CTEs.

---

### Parte 2 - Ordens com pendencia operacional

Retorne Ordens que possuam ao menos uma Atividade em:

```text
PENDENTE;
AGENDADA;
EM_EXECUCAO.
```

Use agregação ou `EXISTS`.

Explique a granularidade.

---

### Parte 3 - Ordens com divergencia financeira

Encontre:

```text
valor comprometido diferente do valor previsto.
```

Mostre:

```text
valor previsto;
pago;
pendente;
diferença.
```

Não esconda valores negativos.

---

### Parte 4 - Clientes sem Ordem

Escreva uma consulta que preserva todos os Clientes e identifica quantidade zero.

O seed atual pode não retornar Cliente sem Ordem.

A consulta ainda deve estar correta para o futuro.

---

### Parte 5 - Pagamentos vencidos

Use uma data de referência recebida no topo da consulta.

Retorne somente `PENDENTE`.

Calcule dias de atraso e faixa.

---

### Parte 6 - Validar fan-out

Crie uma Ordem temporária do exercício com:

```text
3 Atividades;
2 Pagamentos.
```

Demonstre seis linhas no join direto.

Compare soma incorreta e pré-agregação correta.

Remova os dados do exercício dentro de uma transação.

---

### Parte 7 - View de indicador

Crie uma view de exercício:

```text
projeto_os.vw_ex298_cliente_indicadores.
```

Granularidade:

```text
uma linha por Cliente.
```

Depois de validar:

```sql
DROP VIEW projeto_os.vw_ex298_cliente_indicadores;
```

Não deixe a view de exercício.

---

### Parte 8 - Contrato paginado

Projete uma listagem por:

```text
ordem_status;
cliente_id;
período de abertura.
```

Ordenação:

```text
aberta_em DESC;
ordem_id DESC.
```

Documente o cursor e os limites da página.

---

### Parte 9 - Revisao de seguranca

Revise os relatórios e marque colunas que não precisam ser expostas.

Justifique a ausência de:

```text
documento;
email;
descrições internas desnecessárias.
```

---

## Criterios de aceite

- o laboratório oficial da aula 298 existe;
- o arquivo e o H1 seguem a grade;
- o schema `projeto_os` e o seed foram preservados;
- a granularidade de cada relatório foi declarada;
- Atividades foram pré-agregadas;
- Pagamentos foram pré-agregados;
- multiplicação entre filhas foi demonstrada;
- `COUNT DISTINCT` foi diferenciado de correção estrutural;
- `SUM DISTINCT` não foi usado como reparo;
- Ordens sem Pagamentos foram preservadas;
- `FILTER` foi usado em agregações condicionais;
- `COALESCE` foi aplicado com semântica;
- `NULLIF` protegeu percentual;
- total pago e total pendente foram separados;
- saldo a receber e saldo sem cobertura foram diferenciados;
- pagamentos vencidos usaram data de referência;
- intervalos de timestamp usaram limite exclusivo;
- indicadores por status foram criados;
- relatório por Cliente foi criado;
- relatório por Produto foi criado;
- aliases são estáveis;
- `SELECT *` não foi usado nos contratos;
- dinheiro permaneceu numérico;
- datas permaneceram tipadas;
- dados desnecessários não foram expostos;
- view de resumo foi criada;
- view de Pagamentos pendentes foi criada;
- listagem keyset foi aplicada;
- documentação dos contratos foi produzida;
- exercício foi concluído;
- objetos temporários do exercício foram removidos;
- views oficiais permaneceram para a aula 299;
- tuning aprofundado não foi antecipado;
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
  labs/m12/aula-298-consultas-relatorio-backend
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): criar relatorios sql para backend"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
granularidade;
pré-agregação;
relatórios;
views;
filtros;
paginação;
contratos.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou um modelo normalizado em contratos de leitura para backend.

Aprendeu a:

```text
declarar granularidade;

evitar multiplicação de linhas;

pré-agregar tabelas filhas;

preservar pais sem filhos;

calcular indicadores financeiros;

parametrizar períodos;

criar relatórios operacionais;

criar views de leitura;

paginar com ordem determinística;

documentar contratos.
```

As regras principais foram:

```text
uma linha do relatório precisa de significado explícito;

duas coleções filhas não devem ser somadas depois do join direto;

COUNT DISTINCT não corrige SUM;

COALESCE depende do significado do nulo;

dinheiro deve continuar numérico;

data deve continuar tipada;

listagem e detalhe são contratos diferentes;

view encapsula lógica, mas cria dependência;

filtros e cursores pertencem ao contrato;

relatório correto vem antes de relatório rápido.
```

A próxima aula será:

```text
299 - M12.29 - Performance inicial de SQL
```

Nela, você vai usar os relatórios desta aula para:

- medir planos;
- comparar estimativas e realidade;
- observar scans e joins;
- revisar índices existentes;
- identificar ordenações;
- analisar filtros opcionais;
- estudar seletividade;
- observar CTEs e views no plano;
- medir contagens;
- comparar consultas equivalentes;
- evitar otimização sem evidência;
- produzir um parecer inicial de performance.

Não remova:

```text
projeto_os.vw_ordem_resumo_backend;

projeto_os.vw_pagamento_pendente_backend;

schema projeto_os;

seed oficial.
```

Esses objetos serão a base da aula 299.

---

# Material complementar

## Checkpoint final

- [ ] Criei relatórios sem multiplicar tabelas filhas.
- [ ] Validei totais financeiros com o seed conhecido.
- [ ] Criei e documentei duas views de backend.
- [ ] Mantive o modelo para a próxima aula e fiz o commit.

---

## Troubleshooting adicional

### Total de mao de obra duplicado

Atividade foi juntada diretamente com Pagamento.

Pré-agregue as duas relações.

### Ordem sem Pagamento desapareceu

Foi usado `INNER JOIN`.

Use `LEFT JOIN`.

### Percentual gerou divisao por zero

A Ordem possui valor previsto zero.

Use `NULLIF`.

### View nao pode ser alterada

A nova definição mudou nomes ou tipos de colunas existentes de forma incompatível.

Planeje a evolução do contrato.

### Relatorio de vencimento muda todo dia

A consulta usa `CURRENT_DATE`.

Para testes, use parâmetro fixo; em produção, documente a referência.

---

## Perguntas de revisao

1. O que é granularidade?
2. Qual a granularidade da view de resumo?
3. Por que duas filhas multiplicam linhas?
4. `COUNT DISTINCT` corrige quais casos?
5. Por que `SUM DISTINCT` é perigoso?
6. O que é pré-agregação?
7. Por que usar `LEFT JOIN`?
8. Quando `COALESCE` para zero é válido?
9. O que `FILTER` faz?
10. O que entra em total pago?
11. O que entra em total pendente?
12. Qual a diferença entre os dois saldos?
13. Para que serve `NULLIF`?
14. Por que usar data de referência?
15. Por que intervalo de data deve ser semiaberto?
16. Por que evitar `SELECT *`?
17. Por que não formatar dinheiro no SQL?
18. Como evitar N mais um?
19. O que uma view oferece?
20. O que será feito na aula 299?

---

## Roteiro de resposta

1. O significado de uma linha.
2. Uma linha por Ordem.
3. Cada combinação de filhos gera uma linha.
4. Contagens de identificadores distintos.
5. Valores iguais de entidades diferentes são eliminados.
6. Resumir cada filha antes do join.
7. Preservar o pai sem filhos.
8. Quando ausência significa quantidade ou total zero.
9. Aplica condição a uma agregação.
10. Pagamentos com status PAGO.
11. Pagamentos com status PENDENTE.
12. Um desconta pago; outro desconta pago e pendente.
13. Evitar divisão por zero.
14. Tornar a regra temporal explícita.
15. Evitar limite final ambíguo.
16. Manter contrato estável.
17. Preservar tipo e localização da apresentação.
18. Buscar agregados em consulta apropriada.
19. Encapsulamento e reutilização.
20. Medição e revisão inicial de performance.

---

## Desafio opcional

Projete um relatório mensal com:

```text
mês de abertura;
quantidade de Ordens;
valor previsto;
mão de obra;
pago;
pendente;
ticket médio;
percentual concluído.
```

Regras:

- uma linha por mês;
- preservar mês e ano;
- usar `date_trunc`;
- pré-agregar filhos;
- evitar multiplicação;
- declarar data inicial e fim exclusivo;
- manter valores numéricos;
- documentar nulos.

Não crie materialized view nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 298 - M12.28 - Consultas de relatorio para backend

- Transformei o schema `projeto_os` em contratos de leitura.
- Declarei a granularidade de cada relatório.
- Pré-agreguei Atividades e Pagamentos antes dos joins.
- Demonstrei a multiplicação de linhas entre duas relações filhas.
- Entendi por que `COUNT DISTINCT` não corrige somas.
- Preservei Ordens sem Pagamentos com `LEFT JOIN`.
- Usei `FILTER` para agregações condicionais.
- Apliquei `COALESCE` somente quando ausência significava zero.
- Calculei total pago, pendente, comprometido e saldos.
- Protegi percentuais com `NULLIF`.
- Criei relatório de Pagamentos vencidos com data de referência.
- Usei intervalos de timestamp com fim exclusivo.
- Criei indicadores por status e prioridade.
- Criei relatórios por Cliente e Produto.
- Mantive dinheiro e datas em tipos nativos.
- Evitei exposição de documento e e-mail nos contratos.
- Criei `vw_ordem_resumo_backend`.
- Criei `vw_pagamento_pendente_backend`.
- Apliquei listagem keyset com ordenação determinística.
- Documentei granularidade, cálculos e contratos.
- Próxima aula: performance inicial de SQL.
```

---

## Referencia tecnica curta

```text
Granularidade:
uma linha representa o quê?

Fan-out:
filho A × filho B.

Correção:
agregar cada filho antes do join.

FILTER:
agregação condicional.

LEFT JOIN:
preserva pai sem filhos.

COALESCE:
ausência semanticamente igual a zero.

NULLIF:
protege divisão.

View:
contrato reutilizável.

Performance:
medir somente depois de garantir correção.
```

Regra final:

```text
um relatorio de backend deve ser semanticamente correto, possuir granularidade explicita e devolver tipos e colunas que formem um contrato estavel.
```
