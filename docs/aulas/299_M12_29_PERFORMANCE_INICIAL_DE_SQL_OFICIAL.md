# 299 - M12.29 - Performance inicial de SQL

## Apresentacao da aula

Na aula 298, você transformou o schema `projeto_os` em contratos de leitura para backend.

Foram criadas as views:

```text
projeto_os.vw_ordem_resumo_backend;

projeto_os.vw_pagamento_pendente_backend.
```

Também foram aplicadas práticas importantes:

```text
granularidade explícita;

pré-agregação de Atividades;

pré-agregação de Pagamentos;

LEFT JOIN para preservar Ordens sem filhos;

FILTER;

COALESCE;

NULLIF;

paginação keyset.
```

Agora surge uma nova pergunta:

```text
as consultas semanticamente corretas executam de forma adequada para a carga esperada?
```

Performance não começa com a criação de índices.

Ela começa com:

1. definir o que será medido;
2. confirmar que o resultado está correto;
3. registrar uma baseline;
4. observar o plano;
5. identificar o trabalho dominante;
6. formular uma hipótese;
7. aplicar uma mudança;
8. medir novamente;
9. avaliar o custo da mudança.

Nesta aula, você usará novamente:

```text
EXPLAIN;
EXPLAIN ANALYZE;
BUFFERS;
pg_stat_user_tables;
pg_stat_user_indexes;
pg_relation_size;
ANALYZE.
```

Entretanto, o foco será diferente da aula 292.

Naquela aula, você aprendeu a ler os nós.

Nesta, você usará os nós para comparar decisões reais de projeto:

- filtrar antes ou depois da agregação;
- pré-agregar o conjunto inteiro ou somente a página;
- aplicar função na coluna ou usar intervalo indexável;
- usar OFFSET profundo ou keyset;
- contar todo o conjunto ou buscar `limit + 1`;
- manter ou rejeitar um índice candidato;
- interpretar uma view sem tratá-la como tabela materializada.

O seed oficial possui apenas quatro Ordens.

Com esse volume, PostgreSQL pode corretamente escolher leituras sequenciais e concluir tudo em frações de milissegundo.

Para tornar as diferenças observáveis, o laboratório criará um schema descartável:

```text
perf_os_aula_299
```

Ele terá:

```text
100.000 Ordens;
300.000 Atividades;
150.000 Pagamentos.
```

Os dados serão sintéticos e existirão somente durante esta aula.

O schema `projeto_os`, seu seed e as views oficiais permanecerão intactos.

A regra central será:

```text
otimize uma pergunta e uma carga conhecidas, não um SQL isolado fora de contexto.
```

Ao final, você deverá conseguir produzir um parecer inicial de performance com evidências, riscos, índices candidatos e próximos passos.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
297:
modelagem integrada.

298:
relatórios para backend.

299:
performance inicial de SQL.

300:
scripts versionados e migrações conceituais.

301:
Flyway e versionamento de banco.
```

Você já aprendeu:

```text
B-tree;

ordem das colunas;

seletividade;

EXPLAIN ANALYZE;

buffers;

estatísticas;

paginação;

views;

CTEs.
```

A aula 299 combina esses conhecimentos em um processo de investigação.

Ela não será uma lista de “truques para deixar SQL rápido”.

O comportamento de uma consulta depende de:

- quantidade de linhas;
- distribuição dos valores;
- filtros;
- ordenação;
- largura das linhas;
- índices;
- cache;
- estatísticas;
- concorrência;
- frequência de escrita;
- versão do PostgreSQL;
- parâmetros da instância.

Uma alteração que melhora uma listagem pode piorar inserções.

Um índice útil para uma consulta pode ser redundante para outra.

Uma consulta excelente para retornar vinte Ordens pode ser inadequada para exportar cem mil.

O objetivo é aprender a relacionar forma da consulta, carga e plano.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-299-performance-inicial-sql
```

Estrutura final:

```text
labs
└── m12
    └── aula-299-performance-inicial-sql
        ├── README.md
        ├── docs
        │   ├── baseline-performance.md
        │   ├── checklist-investigacao.md
        │   └── parecer-indices.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_baseline_views_reais.sql
            ├── 02_preparar_carga_sintetica.sql
            ├── 03_baseline_sem_indices_secundarios.sql
            ├── 04_criar_indices_candidatos.sql
            ├── 05_comparar_filtro_e_ordenacao.sql
            ├── 06_offset_profundo_vs_keyset.sql
            ├── 07_funcao_na_coluna_vs_intervalo.sql
            ├── 08_agregar_tudo_vs_filtrar_primeiro.sql
            ├── 09_relatorio_completo_vs_pagina.sql
            ├── 10_count_exato_vs_limit_mais_um.sql
            ├── 11_view_e_consulta_subjacente.sql
            ├── 12_catalogo_tamanho_e_uso.sql
            ├── 13_exercicio.sql
            ├── 14_limpar_carga_sintetica.sql
            └── 15_checkpoint_final.sql
```

Objetos oficiais preservados:

```text
schema projeto_os;

seed da aula 297;

views da aula 298.
```

Objeto temporário da aula:

```text
schema perf_os_aula_299.
```

A carga sintética será removida ao final.

---

## Conceito essencial

### O que significa performance

Performance não é apenas “quantos milissegundos levou”.

Ela inclui:

```text
latência:
tempo de uma execução.

throughput:
quantas operações podem ser atendidas.

CPU:
trabalho de processamento.

I/O:
páginas lidas e escritas.

memória:
sorts, hashes e cache.

concorrência:
impacto sobre outras transações.

escrita:
custo de manter índices.

previsibilidade:
variação entre casos comuns e extremos.
```

Uma consulta que leva 20 ms isoladamente pode ser ruim se executada dez mil vezes por minuto.

Uma consulta de 500 ms pode ser aceitável em um relatório diário.

A medição precisa considerar o uso.

---

### Definir a pergunta

Antes de otimizar, registre:

```text
qual endpoint usa a consulta?

quantas vezes por minuto?

qual tamanho da página?

quais filtros são comuns?

existe ordenação obrigatória?

qual volume atual?

qual crescimento esperado?

qual latência aceitável?

é leitura interativa, exportação ou lote?
```

Sem isso, “rápido” não possui definição operacional.

---

### Correcao antes de velocidade

A consulta errada pode ser extremamente rápida.

Exemplos:

- total duplicado por fan-out;
- Ordem sem Pagamento desaparecendo;
- filtro temporal excluindo o último dia;
- paginação sem desempate;
- saldo escondido por `greatest(..., 0)`.

Primeiro valide o resultado com dados conhecidos.

Depois meça.

---

### Baseline

Baseline é o registro do comportamento antes da mudança.

Ela deve incluir:

- SQL;
- parâmetros;
- quantidade retornada;
- plano;
- tempo de planejamento;
- tempo de execução;
- buffers;
- tamanho das tabelas;
- índices existentes;
- data e ambiente.

Sem baseline, você não sabe se a alteração melhorou.

---

### Repetir medicoes

Uma execução isolada sofre influência de:

- cache frio;
- cache aquecido;
- atividade de outros processos;
- alocação inicial;
- checkpoint;
- variação do sistema operacional.

Execute a consulta algumas vezes.

Não escolha apenas o melhor resultado.

Registre uma faixa e descreva o ambiente.

O laboratório não será um benchmark científico, mas seguirá disciplina mínima.

---

### Cache e buffers

Com:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS
)
```

observe:

```text
shared hit:
página encontrada no cache compartilhado.

shared read:
página precisou ser lida para o buffer.

temp read ou written:
operação usou arquivos temporários.
```

Uma segunda execução pode apresentar mais hits.

Tempo menor não prova que o SQL mudou.

O cache mudou.

---

### Planejamento e execucao

Compare:

```text
Planning Time;

Execution Time.
```

Consultas curtas executadas muitas vezes podem sofrer impacto relevante de planejamento.

Nesta aula, o foco principal será o tempo e o trabalho de execução.

Prepared statements e planos genéricos serão estudados em contexto de aplicação em módulos posteriores.

---

### Estatisticas

O planejador estima quantidades com estatísticas.

Depois de carga em massa:

```sql
ANALYZE schema.tabela;
```

Sem estatísticas atualizadas, o plano pode assumir cardinalidades inadequadas.

Campos úteis em `pg_stats`:

- `n_distinct`;
- `most_common_vals`;
- `most_common_freqs`;
- `histogram_bounds`;
- `correlation`.

Não ajuste estatísticas avançadas sem evidência.

Primeiro confirme se o problema é uma estimativa ruim.

---

### Seletividade

Um filtro seletivo retorna pequena parcela da tabela.

Exemplo:

```text
cliente_id = 42 em 100.000 Ordens.
```

Um filtro pouco seletivo retorna grande parcela:

```text
status = ABERTA quando 60% das Ordens estão abertas.
```

Índice costuma ser mais atraente para filtros seletivos.

Para grande parte da tabela, `Seq Scan` pode ser mais barato.

---

### Largura da linha

`SELECT *` pode aumentar:

- bytes lidos;
- páginas acessadas;
- memória;
- tráfego;
- serialização.

Uma listagem deve projetar apenas o contrato necessário.

Mesmo quando o filtro é eficiente, buscar colunas largas desnecessárias aumenta o custo.

---

### Condicao aproveitavel pelo indice

Considere um índice em:

```text
aberta_em.
```

Filtro:

```sql
aberta_em >= TIMESTAMPTZ '2026-03-01 00:00:00-03'
AND aberta_em < TIMESTAMPTZ '2026-03-02 00:00:00-03'
```

A condição define uma faixa diretamente sobre a coluna indexada.

Agora:

```sql
aberta_em::date = DATE '2026-03-01'
```

A função é aplicada à coluna.

Um índice comum em `aberta_em` pode não atender da mesma forma.

Alternativas:

- reescrever como intervalo;
- criar índice de expressão quando a expressão for realmente o contrato;
- revisar o modelo.

Nesta aula, a reescrita por intervalo será preferida.

---

### Filtrar antes de agregar

Consulta A:

```text
agrega 300.000 Atividades;

agrega 150.000 Pagamentos;

junta 100.000 Ordens;

depois filtra um Cliente.
```

Consulta B:

```text
seleciona as 20 Ordens da página;

agrega somente os filhos dessas Ordens;

junta os pequenos resumos.
```

Para uma página pequena, B tende a realizar menos trabalho.

Para uma exportação completa, a pré-agregação global pode ser adequada.

A forma correta depende do tamanho do resultado.

---

### Correlated subquery nao e sempre ruim

Uma subquery correlacionada executada para cem mil Ordens pode custar caro.

A mesma subquery executada para vinte Ordens, com índice no filho, pode ser eficiente e legível.

Não classifique um recurso SQL isoladamente como bom ou ruim.

Avalie:

```text
quantas vezes será executado?

existe índice?

quantas linhas cada execução encontra?

o plano confirma a hipótese?
```

O laboratório priorizará CTEs filtradas, mas o princípio vale para subqueries correlacionadas.

---

### OFFSET profundo

Um índice pode fornecer a ordem:

```text
aberta_em DESC;
id DESC.
```

Mesmo assim:

```sql
OFFSET 90000
```

precisa percorrer e descartar muitas entradas.

O índice elimina o sort, mas não elimina o deslocamento.

Keyset transforma a continuação em uma condição de faixa.

---

### Contagem exata

Uma página de vinte linhas pode ser encontrada rapidamente.

O total exato:

```sql
SELECT count(*)
```

pode precisar examinar todo o conjunto filtrado.

Perguntas diferentes:

```text
quantos registros existem no total?

existe uma próxima página?
```

Para a segunda, `limit + 1` costuma realizar menos trabalho.

Não devolva total exato quando o produto só precisa de `hasNext`.

---

### Views e performance

Uma view comum não armazena linhas.

Ao consultar:

```sql
SELECT *
FROM projeto_os.vw_ordem_resumo_backend;
```

PostgreSQL expande a definição e planeja as tabelas subjacentes.

A view não é automaticamente uma barreira nem uma materialized view.

Ela pode:

- melhorar organização;
- esconder complexidade;
- ser combinada com filtros externos.

Mas o consumidor precisa observar o plano final.

Uma view conveniente pode ocultar uma agregação global cara para uma listagem pequena.

---

### CTEs e o planejador

CTEs não recursivas e sem efeitos colaterais podem ser incorporadas ao plano em determinadas condições.

`MATERIALIZED` e `NOT MATERIALIZED` permitem influenciar esse comportamento.

Não aplique essas palavras como otimização padrão.

Primeiro observe:

- quantas vezes a CTE é usada;
- se o filtro foi empurrado;
- se a materialização evita repetição;
- se cria leitura intermediária desnecessária.

Nesta aula, as CTEs serão escritas para tornar a estratégia clara.

---

### Indice tem custo

Cada índice adicionado:

- ocupa espaço;
- aumenta trabalho de `INSERT`;
- aumenta trabalho de `UPDATE`;
- aumenta trabalho de `DELETE`;
- precisa de vacuum e manutenção;
- consome cache.

Um parecer de performance precisa justificar:

```text
consulta beneficiada;

frequência;

seletividade;

ordem das colunas;

sobreposição com índices existentes;

custo de escrita;

decisão de manter ou remover.
```

---

### Medir o plano certo

Use valores representativos.

Um filtro para Cliente com uma Ordem não representa Cliente corporativo com cinquenta mil Ordens.

Um período de um minuto não representa relatório mensal.

Uma página inicial não representa offset 500.000.

Teste:

- caso comum;
- caso seletivo;
- caso pouco seletivo;
- caso profundo;
- limite esperado;
- extremo plausível.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-299-performance-inicial-sql\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-299-performance-inicial-sql\docs"

Set-Location `
  "labs\m12\aula-299-performance-inicial-sql"
```

Confirme:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

---

### 2. Criar 00_verificar_pre_requisitos.sql

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
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_ordens,
    to_regclass(
        'projeto_os.vw_pagamento_pendente_backend'
    ) AS view_pagamentos;

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

Esperado:

```text
duas views;

3 Clientes;

3 Produtos;

4 Ordens;

7 Atividades;

5 Pagamentos.
```

---

### 3. Criar 01_baseline_views_reais.sql

Crie:

```text
sql/01_baseline_views_reais.sql
```

Conteúdo:

```sql
ANALYZE projeto_os.cliente;
ANALYZE projeto_os.produto;
ANALYZE projeto_os.ordem_servico;
ANALYZE projeto_os.atividade;
ANALYZE projeto_os.pagamento;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SUMMARY
)
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    cliente_nome,
    produto_nome,
    quantidade_atividades,
    total_mao_obra,
    total_pago,
    total_pendente
FROM projeto_os.vw_ordem_resumo_backend
ORDER BY
    aberta_em DESC,
    ordem_id DESC;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SUMMARY
)
SELECT
    pagamento_id,
    referencia,
    valor,
    vencimento,
    ordem_codigo,
    cliente_nome
FROM projeto_os.vw_pagamento_pendente_backend
WHERE vencimento < DATE '2026-07-26'
ORDER BY
    vencimento,
    pagamento_id;
```

Registre:

- quantidade de linhas;
- nós;
- scans;
- agregações;
- Planning Time;
- Execution Time;
- buffers.

Não tente otimizar esse seed pequeno.

O objetivo é reconhecer que a view foi expandida.

---

### 4. Criar 02_preparar_carga_sintetica.sql

Crie:

```text
sql/02_preparar_carga_sintetica.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS perf_os_aula_299 CASCADE;

CREATE SCHEMA perf_os_aula_299;

CREATE TABLE perf_os_aula_299.ordem_servico (
    id bigint PRIMARY KEY,
    cliente_id bigint NOT NULL,
    produto_id bigint NOT NULL,
    status text NOT NULL,
    prioridade text NOT NULL,
    aberta_em timestamptz NOT NULL,
    valor_previsto numeric(12, 2) NOT NULL
);

CREATE TABLE perf_os_aula_299.atividade (
    id bigint PRIMARY KEY,
    ordem_servico_id bigint NOT NULL,
    status text NOT NULL,
    valor_mao_obra numeric(12, 2) NOT NULL
);

CREATE TABLE perf_os_aula_299.pagamento (
    id bigint PRIMARY KEY,
    ordem_servico_id bigint NOT NULL,
    parcela smallint NOT NULL,
    status text NOT NULL,
    valor numeric(12, 2) NOT NULL,
    vencimento date NOT NULL
);

INSERT INTO perf_os_aula_299.ordem_servico (
    id,
    cliente_id,
    produto_id,
    status,
    prioridade,
    aberta_em,
    valor_previsto
)
SELECT
    g AS id,
    (g % 2000) + 1 AS cliente_id,
    (g % 200) + 1 AS produto_id,
    CASE
        WHEN g % 20 = 0 THEN 'CANCELADA'
        WHEN g % 4 = 0 THEN 'CONCLUIDA'
        WHEN g % 3 = 0 THEN 'EM_ATENDIMENTO'
        ELSE 'ABERTA'
    END AS status,
    CASE
        WHEN g % 50 = 0 THEN 'CRITICA'
        WHEN g % 10 = 0 THEN 'ALTA'
        ELSE 'NORMAL'
    END AS prioridade,
    TIMESTAMPTZ '2026-01-01 00:00:00-03'
        + g * INTERVAL '1 minute' AS aberta_em,
    (200 + (g % 3000))::numeric(12, 2)
        AS valor_previsto
FROM generate_series(
    1,
    100000
) AS serie(g);

INSERT INTO perf_os_aula_299.atividade (
    id,
    ordem_servico_id,
    status,
    valor_mao_obra
)
SELECT
    ordem.id * 10 + numero.numero AS id,
    ordem.id AS ordem_servico_id,
    CASE
        WHEN numero.numero = 1
            THEN 'CONCLUIDA'
        WHEN ordem.status = 'CONCLUIDA'
            THEN 'CONCLUIDA'
        WHEN numero.numero = 2
            THEN 'EM_EXECUCAO'
        ELSE 'PENDENTE'
    END AS status,
    (
        40
        + numero.numero * 25
        + ordem.id % 100
    )::numeric(12, 2) AS valor_mao_obra
FROM perf_os_aula_299.ordem_servico AS ordem
CROSS JOIN generate_series(
    1,
    3
) AS numero(numero);

INSERT INTO perf_os_aula_299.pagamento (
    id,
    ordem_servico_id,
    parcela,
    status,
    valor,
    vencimento
)
SELECT
    ordem.id * 10 + parcela.numero AS id,
    ordem.id AS ordem_servico_id,
    parcela.numero::smallint,
    CASE
        WHEN parcela.numero = 1
            THEN 'PAGO'
        ELSE 'PENDENTE'
    END AS status,
    round(
        ordem.valor_previsto
        / CASE
            WHEN ordem.id % 2 = 0 THEN 2
            ELSE 1
          END,
        2
    ) AS valor,
    DATE '2026-06-01'
        + (ordem.id % 120)::integer
        + (parcela.numero - 1) * 30
        AS vencimento
FROM perf_os_aula_299.ordem_servico AS ordem
CROSS JOIN LATERAL generate_series(
    1,
    CASE
        WHEN ordem.id % 2 = 0 THEN 2
        ELSE 1
    END
) AS parcela(numero);

ANALYZE perf_os_aula_299.ordem_servico;
ANALYZE perf_os_aula_299.atividade;
ANALYZE perf_os_aula_299.pagamento;
```

Contagens esperadas:

```text
100.000 Ordens;

300.000 Atividades;

150.000 Pagamentos.
```

Ainda não existem índices secundários.

---

### 5. Criar 03_baseline_sem_indices_secundarios.sql

Crie:

```text
sql/03_baseline_sem_indices_secundarios.sql
```

Conteúdo:

```sql
SELECT
    (SELECT count(*)
     FROM perf_os_aula_299.ordem_servico)
        AS ordens,
    (SELECT count(*)
     FROM perf_os_aula_299.atividade)
        AS atividades,
    (SELECT count(*)
     FROM perf_os_aula_299.pagamento)
        AS pagamentos;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    cliente_id,
    status,
    aberta_em,
    valor_previsto
FROM perf_os_aula_299.ordem_servico
WHERE cliente_id = 42
  AND status = 'ABERTA'
ORDER BY
    aberta_em DESC,
    id DESC
LIMIT 20;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    ordem_servico_id,
    status,
    valor_mao_obra
FROM perf_os_aula_299.atividade
WHERE ordem_servico_id = 50000;
```

Registre o plano antes dos índices.

É provável encontrar:

```text
Seq Scan;

Sort;
```

O plano exato pode variar.

---

### 6. Criar 04_criar_indices_candidatos.sql

Crie:

```text
sql/04_criar_indices_candidatos.sql
```

Conteúdo:

```sql
CREATE INDEX idx_perf_ordem_cliente_status_aberta_id
ON perf_os_aula_299.ordem_servico (
    cliente_id,
    status,
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_perf_ordem_status_aberta_id
ON perf_os_aula_299.ordem_servico (
    status,
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_perf_ordem_aberta_id
ON perf_os_aula_299.ordem_servico (
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_perf_atividade_ordem_status
ON perf_os_aula_299.atividade (
    ordem_servico_id,
    status
);

CREATE INDEX idx_perf_pagamento_ordem_status
ON perf_os_aula_299.pagamento (
    ordem_servico_id,
    status
);

CREATE INDEX idx_perf_pagamento_status_vencimento
ON perf_os_aula_299.pagamento (
    status,
    vencimento,
    id
);

VACUUM (
    ANALYZE
) perf_os_aula_299.ordem_servico;

VACUUM (
    ANALYZE
) perf_os_aula_299.atividade;

VACUUM (
    ANALYZE
) perf_os_aula_299.pagamento;
```

O `VACUUM ANALYZE` atualiza estatísticas e mapa de visibilidade.

Não conclua que os seis índices devem existir em produção.

Eles são hipóteses do laboratório.

---

### 7. Criar 05_comparar_filtro_e_ordenacao.sql

Crie:

```text
sql/05_comparar_filtro_e_ordenacao.sql
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
    cliente_id,
    status,
    aberta_em,
    valor_previsto
FROM perf_os_aula_299.ordem_servico
WHERE cliente_id = 42
  AND status = 'ABERTA'
ORDER BY
    aberta_em DESC,
    id DESC
LIMIT 20;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    cliente_id,
    status,
    aberta_em,
    valor_previsto
FROM perf_os_aula_299.ordem_servico
WHERE status = 'ABERTA'
ORDER BY
    aberta_em DESC,
    id DESC
LIMIT 20;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    cliente_id,
    status,
    aberta_em,
    valor_previsto
FROM perf_os_aula_299.ordem_servico
WHERE prioridade = 'NORMAL'
ORDER BY
    aberta_em DESC,
    id DESC
LIMIT 20;
```

Compare:

```text
filtro seletivo por Cliente e status;

filtro por status com muitas linhas;

filtro por prioridade sem índice dedicado.
```

Não crie índice de prioridade antes de medir frequência e seletividade.

---

### 8. Criar 06_offset_profundo_vs_keyset.sql

Crie:

```text
sql/06_offset_profundo_vs_keyset.sql
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
    status,
    aberta_em
FROM perf_os_aula_299.ordem_servico
WHERE status = 'ABERTA'
ORDER BY
    aberta_em DESC,
    id DESC
LIMIT 20
OFFSET 50000;

-- A obtenção do cursor com OFFSET é apenas uma preparação
-- didática. Em uma API real, ele viria da página anterior.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
WITH cursor AS (
    SELECT
        aberta_em,
        id
    FROM perf_os_aula_299.ordem_servico
    WHERE status = 'ABERTA'
    ORDER BY
        aberta_em DESC,
        id DESC
    OFFSET 49999
    LIMIT 1
)
SELECT
    ordem.id,
    ordem.status,
    ordem.aberta_em
FROM perf_os_aula_299.ordem_servico AS ordem
CROSS JOIN cursor
WHERE ordem.status = 'ABERTA'
  AND (
      ordem.aberta_em,
      ordem.id
  ) < (
      cursor.aberta_em,
      cursor.id
  )
ORDER BY
    ordem.aberta_em DESC,
    ordem.id DESC
LIMIT 20;
```

Compare principalmente o trabalho da consulta depois que o cursor já é conhecido. A preparação por offset não faz parte do custo normal de uma próxima página enviada pela API.

### 9. Criar 07_funcao_na_coluna_vs_intervalo.sql

Crie:

```text
sql/07_funcao_na_coluna_vs_intervalo.sql
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
    aberta_em,
    status
FROM perf_os_aula_299.ordem_servico
WHERE aberta_em::date = DATE '2026-02-15'
ORDER BY
    aberta_em,
    id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    aberta_em,
    status
FROM perf_os_aula_299.ordem_servico
WHERE aberta_em
        >= TIMESTAMPTZ '2026-02-15 00:00:00-03'
  AND aberta_em
        < TIMESTAMPTZ '2026-02-16 00:00:00-03'
ORDER BY
    aberta_em,
    id;
```

A segunda consulta expressa uma faixa diretamente sobre a coluna.

Registre:

- nó;
- condição de índice;
- linhas examinadas;
- buffers;
- tempo.

---

### 10. Criar 08_agregar_tudo_vs_filtrar_primeiro.sql

Crie:

```text
sql/08_agregar_tudo_vs_filtrar_primeiro.sql
```

Conteúdo:

```sql
-- Estratégia A:
-- agregar todas as relações filhas
-- e filtrar o Cliente no final.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS total_mao_obra
    FROM perf_os_aula_299.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor) FILTER (
            WHERE status = 'PAGO'
        ) AS total_pago,
        sum(valor) FILTER (
            WHERE status = 'PENDENTE'
        ) AS total_pendente
    FROM perf_os_aula_299.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id,
    ordem.status,
    atividade.quantidade,
    atividade.total_mao_obra,
    coalesce(
        pagamento.total_pago,
        0
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0
    ) AS total_pendente
FROM perf_os_aula_299.ordem_servico AS ordem
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
WHERE ordem.cliente_id = 42
ORDER BY
    ordem.aberta_em DESC,
    ordem.id DESC
LIMIT 20;

-- Estratégia B:
-- selecionar a página primeiro
-- e agregar somente seus filhos.
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
WITH pagina AS (
    SELECT
        id,
        status,
        aberta_em
    FROM perf_os_aula_299.ordem_servico
    WHERE cliente_id = 42
    ORDER BY
        aberta_em DESC,
        id DESC
    LIMIT 20
),
atividade_resumo AS (
    SELECT
        atividade.ordem_servico_id,
        count(*) AS quantidade,
        sum(
            atividade.valor_mao_obra
        ) AS total_mao_obra
    FROM perf_os_aula_299.atividade AS atividade
    INNER JOIN pagina
        ON pagina.id = atividade.ordem_servico_id
    GROUP BY atividade.ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        pagamento.ordem_servico_id,
        sum(
            pagamento.valor
        ) FILTER (
            WHERE pagamento.status = 'PAGO'
        ) AS total_pago,
        sum(
            pagamento.valor
        ) FILTER (
            WHERE pagamento.status = 'PENDENTE'
        ) AS total_pendente
    FROM perf_os_aula_299.pagamento AS pagamento
    INNER JOIN pagina
        ON pagina.id = pagamento.ordem_servico_id
    GROUP BY pagamento.ordem_servico_id
)
SELECT
    pagina.id,
    pagina.status,
    atividade.quantidade,
    atividade.total_mao_obra,
    coalesce(
        pagamento.total_pago,
        0
    ) AS total_pago,
    coalesce(
        pagamento.total_pendente,
        0
    ) AS total_pendente
FROM pagina
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = pagina.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = pagina.id
ORDER BY
    pagina.aberta_em DESC,
    pagina.id DESC;
```

As duas consultas devem produzir informações equivalentes para a página.

A quantidade de trabalho não será equivalente.

---

### 11. Criar 09_relatorio_completo_vs_pagina.sql

Crie:

```text
sql/09_relatorio_completo_vs_pagina.sql
```

Conteúdo:

```sql
-- Exportação completa:
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
WITH atividade_resumo AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade,
        sum(valor_mao_obra) AS total_mao_obra
    FROM perf_os_aula_299.atividade
    GROUP BY ordem_servico_id
),
pagamento_resumo AS (
    SELECT
        ordem_servico_id,
        sum(valor) FILTER (
            WHERE status = 'PAGO'
        ) AS total_pago,
        sum(valor) FILTER (
            WHERE status = 'PENDENTE'
        ) AS total_pendente
    FROM perf_os_aula_299.pagamento
    GROUP BY ordem_servico_id
)
SELECT
    ordem.id,
    ordem.cliente_id,
    ordem.status,
    atividade.quantidade,
    atividade.total_mao_obra,
    pagamento.total_pago,
    pagamento.total_pendente
FROM perf_os_aula_299.ordem_servico AS ordem
LEFT JOIN atividade_resumo AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN pagamento_resumo AS pagamento
    ON pagamento.ordem_servico_id = ordem.id;

-- Página pequena com subqueries correlacionadas:
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
WITH pagina AS (
    SELECT
        id,
        cliente_id,
        status,
        aberta_em
    FROM perf_os_aula_299.ordem_servico
    WHERE cliente_id = 42
    ORDER BY
        aberta_em DESC,
        id DESC
    LIMIT 20
)
SELECT
    pagina.id,
    pagina.status,
    (
        SELECT count(*)
        FROM perf_os_aula_299.atividade AS atividade
        WHERE atividade.ordem_servico_id
            = pagina.id
    ) AS quantidade_atividades,
    (
        SELECT sum(
            atividade.valor_mao_obra
        )
        FROM perf_os_aula_299.atividade AS atividade
        WHERE atividade.ordem_servico_id
            = pagina.id
    ) AS total_mao_obra,
    (
        SELECT sum(
            pagamento.valor
        )
        FROM perf_os_aula_299.pagamento AS pagamento
        WHERE pagamento.ordem_servico_id
            = pagina.id
          AND pagamento.status = 'PAGO'
    ) AS total_pago
FROM pagina
ORDER BY
    pagina.aberta_em DESC,
    pagina.id DESC;
```

Não conclua que subquery correlacionada é sempre melhor.

Ela é testada para vinte Ordens com índices adequados.

---

### 12. Criar 10_count_exato_vs_limit_mais_um.sql

Crie:

```text
sql/10_count_exato_vs_limit_mais_um.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT count(*)
FROM perf_os_aula_299.ordem_servico
WHERE status = 'ABERTA';

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    aberta_em
FROM perf_os_aula_299.ordem_servico
WHERE status = 'ABERTA'
ORDER BY
    aberta_em DESC,
    id DESC
LIMIT 21;
```

A primeira responde:

```text
quantas Ordens ABERTAS existem?
```

A segunda ajuda a responder:

```text
existe próxima página para size 20?
```

Não compare apenas tempos.

Compare a pergunta respondida.

---

### 13. Criar 11_view_e_consulta_subjacente.sql

Crie:

```text
sql/11_view_e_consulta_subjacente.sql
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
    ordem_id,
    ordem_codigo,
    ordem_status,
    cliente_nome,
    total_pago
FROM projeto_os.vw_ordem_resumo_backend
WHERE cliente_id = 990001
ORDER BY
    aberta_em DESC,
    ordem_id DESC;

SELECT
    definition
FROM pg_views
WHERE schemaname = 'projeto_os'
  AND viewname = 'vw_ordem_resumo_backend';
```

Observe no plano:

- tabelas subjacentes;
- agregações;
- joins;
- filtros;
- ausência de armazenamento próprio da view.

Não altere a view oficial nesta aula.

---

### 14. Criar 12_catalogo_tamanho_e_uso.sql

Crie:

```text
sql/12_catalogo_tamanho_e_uso.sql
```

Conteúdo:

```sql
SELECT
    schemaname,
    relname AS relation_name,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_live_tup,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname IN (
    'projeto_os',
    'perf_os_aula_299'
)
ORDER BY
    schemaname,
    relname;

SELECT
    schemaname,
    relname AS relation_name,
    indexrelname AS index_name,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(
        pg_relation_size(
            indexrelid
        )
    ) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'perf_os_aula_299'
ORDER BY
    relname,
    indexrelname;

SELECT
    namespace.nspname AS schema_name,
    classe.relname AS relation_name,
    pg_size_pretty(
        pg_relation_size(
            classe.oid
        )
    ) AS main_size,
    pg_size_pretty(
        pg_total_relation_size(
            classe.oid
        )
    ) AS total_size
FROM pg_class AS classe
INNER JOIN pg_namespace AS namespace
    ON namespace.oid = classe.relnamespace
WHERE namespace.nspname = 'perf_os_aula_299'
  AND classe.relkind = 'r'
ORDER BY classe.relname;
```

As estatísticas de uso são acumulativas e podem não refletir somente esta aula.

Use-as como sinal, não como prova única.

---

### 15. Criar a documentacao

Em:

```text
docs/baseline-performance.md
```

registre para cada consulta:

- finalidade;
- parâmetros;
- linhas retornadas;
- plano;
- tempo;
- buffers;
- índice;
- observações;
- segunda medição.

Em:

```text
docs/checklist-investigacao.md
```

inclua:

```text
resultado correto;

granularidade;

volume;

filtros;

ordenação;

índices;

estatísticas;

estimativa versus realidade;

scans;

sorts;

hashes;

buffers;

largura;

concorrência;

custo de escrita.
```

Em:

```text
docs/parecer-indices.md
```

classifique cada índice do schema sintético:

```text
manter na hipótese;

revisar;

redundante;

sem evidência suficiente.
```

Justifique com consultas e planos.

---

### 16. Criar 13_exercicio.sql

Crie:

```text
sql/13_exercicio.sql
```

Organize nele as consultas do exercício guiado. Cada comparação deve registrar o SQL, os parâmetros, a quantidade retornada e o plano medido. Não deixe índices experimentais nem dados adicionais no schema oficial.

---

### 17. Criar 14_limpar_carga_sintetica.sql

Crie:

```text
sql/14_limpar_carga_sintetica.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS perf_os_aula_299 CASCADE;
```

O uso de `CASCADE` está limitado ao schema exclusivo e descartável desta aula. Execute a limpeza somente depois de concluir medições, exercício e parecer.

---

### 18. Criar 15_checkpoint_final.sql

Crie:

```text
sql/15_checkpoint_final.sql
```

Conteúdo:

```sql
SELECT
    to_regnamespace(
        'perf_os_aula_299'
    ) AS schema_sintetico;

SELECT
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_ordens,
    to_regclass(
        'projeto_os.vw_pagamento_pendente_backend'
    ) AS view_pagamentos;

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
schema sintético:
NULL.

views oficiais:
existentes.

contagens:
3, 3, 4, 7 e 5.
```

---

### 19. Criar README.md

Crie:

```text
README.md
```

Registre:

- objetivo da investigação;
- ambiente e versão;
- consultas medidas;
- carga sintética;
- índices candidatos;
- baseline;
- comparação antes e depois;
- limitações do teste;
- decisões do parecer;
- confirmação da limpeza;
- ponte para a aula 300.

O README deve deixar claro que a carga sintética não representa automaticamente a distribuição de produção.

---

## Entendendo o que foi feito

### O seed pequeno nao foi artificialmente otimizado

As views reais foram medidas e preservadas.

O plano simples foi aceito como adequado ao volume.

---

### A carga sintetica tornou diferenças visiveis

Com centenas de milhares de linhas, filtros, agregações e paginação passaram a produzir trabalho mensurável.

---

### Os indices atenderam perguntas especificas

Cada índice foi ligado a:

- filtro;
- ordenação;
- relacionamento;
- vencimento.

Nenhum índice foi declarado universal.

---

### Filtrar primeiro reduziu o conjunto

A consulta de página evitou agregar todos os filhos.

Ela executou trabalho proporcional ao conjunto solicitado.

---

### A exportacao exigiu outra estrategia

Para retornar todas as Ordens, pré-agregar todo o conjunto pode ser adequado.

A melhor forma mudou com a cardinalidade de saída.

---

### Count e hasNext foram separados

A contagem exata percorreu o conjunto.

`LIMIT 21` respondeu uma pergunta menor.

---

## Erros comuns importantes

### Otimizar sem baseline

Não existe comparação.

Registre o antes.

---

### Forcar Index Scan

Desabilitar `Seq Scan` não prova benefício.

Deixe o planejador escolher e compare trabalho.

---

### Criar indice para cada filtro

Índices possuem custo e podem se sobrepor.

Justifique cada estrutura.

---

### Comparar consultas com resultados diferentes

Uma consulta conta tudo; outra retorna vinte linhas.

Compare objetivo e custo juntos.

---

### Medir com estatisticas desatualizadas

Execute `ANALYZE` depois de cargas significativas.

---

## Comandos uteis

### Plano medido

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT ...;
```

### Atualizar estatisticas

```sql
ANALYZE schema.tabela;
```

### Tamanho total

```sql
SELECT pg_size_pretty(
    pg_total_relation_size(
        'schema.tabela'
    )
);
```

### Uso de indices

```sql
SELECT *
FROM pg_stat_user_indexes;
```

---

## Exercicio guiado

No arquivo:

```text
sql/13_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Baseline de Cliente

Escolha:

```text
cliente_id = 42.
```

Meça:

- quantidade de Ordens;
- página inicial;
- página profunda;
- relatório com Atividades;
- relatório com Pagamentos.

Registre duas execuções.

---

### Parte 2 - Periodo temporal

Compare:

```text
aberta_em::date = data;

intervalo semiaberto.
```

Use a mesma data e valide resultados idênticos.

Compare plano e buffers.

---

### Parte 3 - Filtro pouco seletivo

Meça:

```text
prioridade = NORMAL.
```

Proponha um índice.

Não o crie inicialmente.

Depois responda:

- quantas linhas retornam;
- frequência da consulta;
- ordenação;
- custo de escrita;
- existe índice prefixado que ajuda;
- decisão.

---

### Parte 4 - Relatorio de pagina

Implemente três estratégias:

1. pré-agregar tudo;
2. filtrar página e agregar filhos;
3. subqueries correlacionadas sobre a página.

Compare:

- resultado;
- plano;
- buffers;
- tempo;
- legibilidade;
- cenário de uso.

---

### Parte 5 - Exportacao completa

Execute o relatório para todas as Ordens.

Explique por que a estratégia de página pode não ser a melhor para cem mil linhas.

---

### Parte 6 - Pagamentos vencidos

Use:

```text
status = PENDENTE;

vencimento < data de referência.
```

Confirme se o índice:

```text
(status, vencimento, id)
```

é usado.

Altere a data para retornar:

- poucas linhas;
- muitas linhas.

Compare os planos.

---

### Parte 7 - Indice redundante

Compare:

```text
idx_perf_ordem_status_aberta_id;

idx_perf_ordem_aberta_id;

idx_perf_ordem_cliente_status_aberta_id.
```

Descreva sobreposição e diferenças de prefixo.

Não remova antes de concluir os testes.

---

### Parte 8 - Parecer final

Produza uma tabela:

```text
consulta;

frequência estimada;

latência observada;

principal nó;

principal custo;

mudança proposta;

ganho;

custo;

decisão.
```

Não use a palavra “otimizado” sem evidência.

---

## Criterios de aceite

- o laboratório oficial da aula 299 existe;
- o arquivo e o H1 seguem a grade;
- schema e views oficiais foram preservados;
- baseline das views reais foi registrada;
- o schema sintético foi criado;
- 100.000 Ordens foram geradas;
- 300.000 Atividades foram geradas;
- 150.000 Pagamentos foram gerados;
- estatísticas foram atualizadas;
- plano sem índices secundários foi registrado;
- índices candidatos foram criados;
- filtro seletivo foi comparado com filtro amplo;
- função na coluna foi comparada com intervalo;
- OFFSET profundo foi comparado com keyset;
- pré-agregação global foi comparada com filtragem antecipada;
- página pequena foi comparada com exportação completa;
- subquery correlacionada foi avaliada conforme cardinalidade;
- `count(*)` foi diferenciado de `limit + 1`;
- view comum foi reconhecida como consulta expandida;
- Planning Time e Execution Time foram registrados;
- buffers foram registrados;
- efeitos de cache foram documentados;
- tamanho de tabelas e índices foi consultado;
- uso de índices foi consultado;
- custo de escrita foi considerado;
- nenhum método do planejador foi forçado;
- nenhuma alteração foi feita nas views oficiais;
- o schema sintético foi removido;
- o exercício foi concluído;
- baseline e parecer foram documentados;
- migrações da aula 300 não foram antecipadas;
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
  labs/m12/aula-299-performance-inicial-sql
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): analisar performance inicial de sql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
baseline;

planos;

buffers;

índices;

filtragem;

agregação;

paginação;

parecer técnico.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aplicou uma investigação inicial de performance a consultas reais de backend.

Aprendeu a:

```text
definir a pergunta;

registrar baseline;

medir mais de uma vez;

separar cache de mudança de SQL;

atualizar estatísticas;

comparar seletividade;

alinhar filtros e índices;

evitar função desnecessária na coluna;

filtrar antes de agregar;

escolher estratégia conforme volume;

comparar OFFSET e keyset;

separar count de hasNext;

inspecionar views;

medir tamanho e uso de índices;

produzir parecer com evidências.
```

As regras principais foram:

```text
correção vem antes de velocidade;

performance depende da carga;

Seq Scan não é erro;

índice usado não significa índice útil;

página e exportação exigem estratégias diferentes;

subquery correlacionada depende da cardinalidade;

estatística ruim pode produzir estimativa ruim;

cache altera tempo;

uma medição não é benchmark;

todo índice cobra nas escritas;

otimização precisa de antes e depois.
```

A próxima aula será:

```text
300 - M12.30 - Scripts versionados e migracoes conceituais
```

Nela, você vai estudar:

- evolução do schema;
- scripts imutáveis;
- ordem de execução;
- identificação de versão;
- migração forward;
- rollback conceitual;
- mudanças compatíveis e incompatíveis;
- expansão e contração;
- alteração de coluna;
- criação de índice;
- backfill;
- deploy de aplicação e banco;
- revisão e auditoria;
- preparação para Flyway.

Antes de seguir, execute:

```text
sql/14_limpar_carga_sintetica.sql
```

O schema `perf_os_aula_299` deve ser removido.

O schema `projeto_os` e suas views devem permanecer.

---

# Material complementar

## Checkpoint final

- [ ] Registrei baseline antes de propor mudanças.
- [ ] Comparei planos, buffers e cardinalidades.
- [ ] Justifiquei índices com consultas reais.
- [ ] Removi a carga sintética e fiz o commit.

---

## Troubleshooting adicional

### O plano continua usando Seq Scan

O filtro retorna muitas linhas, a tabela é pequena, estatísticas mudaram ou o custo do índice é maior.

Analise, não force.

### Os tempos variam muito

Cache e atividade externa influenciam.

Repita e registre uma faixa.

### O segundo EXPLAIN falha depois da CTE

`EXPLAIN` precisa aparecer antes de `WITH`.

Use:

```sql
EXPLAIN (...)
WITH ...
SELECT ...;
```

### O indice nao aparece em pg_stat_user_indexes

A consulta não o usou, as estatísticas são cumulativas ou ainda não foram atualizadas na visão.

Confirme o plano diretamente.

### DROP SCHEMA fica bloqueado

Existe sessão usando objetos do schema sintético.

Finalize transações e consultas abertas.

---

## Perguntas de revisao

1. O que é baseline?
2. Por que correção vem primeiro?
3. O que performance inclui além de tempo?
4. Por que repetir medições?
5. O que `shared hit` indica?
6. O que `shared read` indica?
7. Para que serve `ANALYZE`?
8. O que é seletividade?
9. Quando `Seq Scan` pode ser adequado?
10. Por que evitar `SELECT *`?
11. Qual o problema de função na coluna?
12. Quando filtrar antes de agregar?
13. Quando pré-agregar tudo pode ser adequado?
14. Subquery correlacionada é sempre ruim?
15. Por que OFFSET profundo custa mais?
16. Qual a diferença entre count e hasNext?
17. View comum armazena dados?
18. O que consultar em `pg_stat_user_indexes`?
19. Qual o custo de um índice?
20. O que deve constar no parecer?

---

## Roteiro de resposta

1. Medição antes da mudança.
2. Consulta errada rápida continua errada.
3. Latência, throughput, I/O, CPU, memória e concorrência.
4. Cache e ambiente variam.
5. Página encontrada no cache compartilhado.
6. Página lida para o buffer.
7. Atualizar estatísticas.
8. Quanto o filtro reduz o conjunto.
9. Tabela pequena ou retorno amplo.
10. Aumenta largura e contrato.
11. Pode impedir faixa direta no índice.
12. Quando o resultado final é pequeno.
13. Exportação ou conjunto completo.
14. Não; depende de repetições e índices.
15. Precisa percorrer entradas anteriores.
16. Respondem perguntas diferentes.
17. Não.
18. Uso e leituras dos índices.
19. Espaço e manutenção de escrita.
20. Evidência, hipótese, ganho, custo e decisão.

---

## Desafio opcional

Projete um teste para um relatório mensal de um milhão de Ordens.

Inclua:

```text
carga sintética;

distribuição de status;

filtros por Cliente;

período;

pré-agregação;

página;

exportação;

count;

índices candidatos;

baseline;

planos;

buffers;

critério de aceite.
```

Não altere configurações globais do PostgreSQL.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 299 - M12.29 - Performance inicial de SQL

- Entendi performance como latência, throughput, I/O, CPU, memória e concorrência.
- Registrei baseline antes de alterar consultas ou índices.
- Medi as views reais do schema `projeto_os`.
- Criei carga sintética com 100 mil Ordens, 300 mil Atividades e 150 mil Pagamentos.
- Comparei planos antes e depois de índices secundários.
- Analisei filtros seletivos e pouco seletivos.
- Comparei função sobre timestamp com intervalo semiaberto.
- Comparei OFFSET profundo com keyset.
- Comparei pré-agregação global com filtragem antecipada.
- Diferenciei estratégia de página de estratégia de exportação.
- Avaliei subqueries correlacionadas conforme cardinalidade.
- Diferenciei `count(*)` de `limit + 1`.
- Entendi que view comum é expandida no plano.
- Registrei Planning Time, Execution Time e buffers.
- Considerei variação de cache.
- Consultei tamanho de tabelas e índices.
- Consultei estatísticas de uso de índices.
- Produzi um parecer com ganho, custo e decisão.
- Removi o schema sintético.
- Próxima aula: scripts versionados e migrações conceituais.
```

---

## Referencia tecnica curta

```text
Baseline:
medir antes.

ANALYZE:
atualizar estatísticas.

Seletividade:
fração retornada.

BUFFERS:
páginas acessadas.

Filtro antecipado:
reduzir antes de agregar.

OFFSET:
descartar anteriores.

Keyset:
continuar por chave.

COUNT:
examinar conjunto.

LIMIT + 1:
detectar próxima página.

Índice:
benefício de leitura e custo de escrita.
```

Regra final:

```text
performance sql deve ser investigada com resultado correto, carga representativa, plano medido e comparacao antes e depois.
```
