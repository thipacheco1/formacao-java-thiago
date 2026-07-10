# 309 - M12.39 - Revisao tecnica SQL PostgreSQL e simulado

## Apresentacao da aula

Você chegou à avaliação prática do módulo M12.

Nas aulas 271 a 308, construiu uma base completa de SQL, PostgreSQL e modelagem relacional para backend Java.

Ao longo desse percurso, praticou:

```text
schemas e rotina de trabalho;

tipos de dados;

DDL e DML;

primary keys e foreign keys;

constraints;

joins;

modelagem conceitual, lógica e física;

normalização;

agregações;

subqueries e CTEs;

views;

funções de data, texto e números;

índices;

EXPLAIN e EXPLAIN ANALYZE;

transações e isolamento;

locks e deadlocks;

paginação;

relatórios;

migrations e Flyway;

seed e massa de teste;

backup e restore;

roles e permissões;

window functions;

JSONB;

projeto físico de Ordem de Serviço;

views e relatórios de backend.
```

Esta aula não apresenta um novo recurso central.

Ela verifica se você consegue combinar os conhecimentos sem depender de uma sequência pronta.

O trabalho será dividido em três blocos:

```text
Bloco A:
revisão técnica orientada.

Bloco B:
simulado teórico e análise de decisões.

Bloco C:
simulado prático executável.
```

O simulado utilizará o projeto persistente das aulas 307 e 308:

```text
projeto_os_final
```

Também utilizará as views:

```text
projeto_os_final.vw_ordem_resumo_backend;

projeto_os_final.vw_pagamento_pendente_backend;

projeto_os_final.vw_carga_tecnico_backend.
```

O schema principal não será removido nem reconstruído.

Para exercícios de DDL e DML, será criado um schema auxiliar:

```text
simulado_m12_309
```

Ele será apagado ao final.

Os exercícios de alteração no projeto principal serão executados dentro de transações com `ROLLBACK`.

A avaliação não mede velocidade de digitação.

Ela mede:

- compreensão;
- capacidade de explicar;
- integridade do SQL;
- leitura de resultados;
- prevenção de erros;
- uso de evidências;
- decisões de engenharia.

Uma resposta correta sem justificativa pode ser insuficiente em um contexto profissional.

Um SQL que executa, mas multiplica valores, também está incorreto.

Ao final, você terá:

- mapa de revisão;
- rubrica de avaliação;
- prova teórica;
- prova prática;
- gabarito comentado;
- validadores automáticos;
- lista objetiva de pontos para revisar.

A próxima aula será:

```text
310 - M12.40 - Fechamento do Modulo 12 SQL PostgreSQL
```

A aula 310 fechará o módulo, registrará competências e fará a transição para o próximo estágio da formação.

---

## Onde estamos na formacao

O encerramento do M12 está organizado assim:

```text
307:
modelo físico do projeto final.

308:
consultas e relatórios do projeto.

309:
revisão técnica e simulado.

310:
fechamento do módulo.
```

Você não está mais resolvendo exercícios isolados.

Agora precisa reconhecer relações entre os temas.

Exemplo:

```text
uma consulta lenta
```

pode envolver:

- modelagem ruim;
- tipo inadequado;
- filtro pouco seletivo;
- índice ausente;
- índice redundante;
- estatística desatualizada;
- fan-out;
- ordenação sem apoio;
- volume incompatível;
- transação longa;
- lock;
- plano mal interpretado.

Outro exemplo:

```text
um relatório financeiro incorreto
```

pode envolver:

- granularidade não declarada;
- joins 1:N independentes;
- soma após fan-out;
- nulos convertidos indevidamente;
- data de referência variável;
- status mal definido;
- valor derivado armazenado e desatualizado.

A revisão técnica deve conectar causas, não apenas memorizar comandos.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-309-revisao-tecnica-sql-postgresql-simulado
```

Estrutura final:

```text
labs
└── m12
    └── aula-309-revisao-tecnica-sql-postgresql-simulado
        ├── README.md
        ├── docs
        │   ├── folha-respostas.md
        │   ├── mapa-revisao.md
        │   ├── plano-recuperacao.md
        │   └── rubrica-simulado.md
        ├── scripts
        │   ├── 01_preparar_simulado.ps1
        │   ├── 02_validar_respostas_praticas.ps1
        │   └── 03_limpar_simulado.ps1
        └── sql
            ├── 00_verificar_precondicoes.sql
            ├── 01_revisao_modelagem_integridade.sql
            ├── 02_revisao_consultas_relatorios.sql
            ├── 03_revisao_indices_planos.sql
            ├── 04_revisao_transacoes_concorrencia.sql
            ├── 05_revisao_operacao_seguranca.sql
            ├── 06_criar_schema_simulado.sql
            ├── 07_simulado_pratico_enunciados.sql
            ├── 08_gabarito_pratico.sql
            ├── 09_validar_simulado.sql
            ├── 10_limpar_schema_simulado.sql
            └── 11_checkpoint_final.sql
```

Pontuação:

```text
Bloco A — revisão guiada:
sem nota; preparação obrigatória.

Bloco B — simulado teórico:
30 pontos.

Bloco C — simulado prático:
70 pontos.

Total:
100 pontos.
```

Classificação:

```text
90 a 100:
domínio consistente.

75 a 89:
aprovado com pontos de revisão.

60 a 74:
base funcional, revisão obrigatória.

abaixo de 60:
repetir laboratórios essenciais antes do fechamento.
```

Critério mínimo recomendado para seguir:

```text
75 pontos;
nenhum erro crítico de integridade;
nenhum relatório com fan-out não reconhecido;
nenhuma ação destrutiva no schema principal.
```

---

## Conceito essencial

### Revisar nao e reler tudo

Revisão eficiente exige recuperar o conhecimento.

Em vez de apenas reler:

```text
o que é uma foreign key?
```

responda sem consultar:

```text
qual regra ela protege?

o que ela não protege?

qual política de exclusão foi escolhida?

qual índice pode ser necessário?
```

Depois compare sua resposta com o material.

Esse processo revela lacunas reais.

---

### Modelagem antes do SQL

Antes de escrever uma consulta, identifique:

```text
entidades;

granularidade;

cardinalidades;

chaves;

atributos obrigatórios;

regras locais;

regras agregadas.
```

Uma consulta complexa sobre um modelo incoerente não corrige a origem do problema.

No projeto final:

```text
Ordem:
uma solicitação de atendimento.

Atividade:
uma etapa operacional.

Pagamento:
uma parcela.

Histórico:
um evento de status.

Atividade–Técnico:
uma alocação.
```

Essa granularidade orienta joins e agregações.

---

### Integridade em camadas

O banco pode garantir diretamente:

- `NOT NULL`;
- `UNIQUE`;
- `CHECK`;
- primary key;
- foreign key;
- tipos;
- defaults.

Uma transação de aplicação pode garantir:

- atualização da Ordem e Histórico juntos;
- soma de Pagamentos compatível;
- conclusão condicionada às Atividades;
- concorrência otimista.

Monitoramento pode identificar:

- divergência entre status e último Histórico;
- referências externas duplicadas fora do contrato;
- atrasos operacionais;
- anomalias de volume.

Não concentre toda regra em uma única camada por dogma.

---

### SQL correto preserva granularidade

Pergunta obrigatória:

```text
uma linha do resultado representa o quê?
```

Se a resposta é:

```text
uma Ordem
```

cada join precisa preservar uma linha por Ordem ou ser pré-agregado.

Se a resposta é:

```text
uma parcela vencida
```

não agrupe prematuramente por Cliente.

A granularidade precisa aparecer no contrato e no teste.

---

### Fan-out e valores falsos

O erro mais importante do projeto foi demonstrado na aula 308.

Duas relações filhas independentes produzem combinações.

A correção preferida:

```text
agregar Atividades por Ordem;

agregar Pagamentos por Ordem;

agregar Técnicos por Ordem;

associar os resumos à Ordem.
```

`DISTINCT` não é substituto universal.

---

### Indice nao e resposta automatica

Antes de criar um índice, pergunte:

- qual consulta?
- qual filtro?
- qual ordenação?
- qual seletividade?
- qual frequência?
- qual volume?
- qual custo de escrita?
- já existe índice equivalente?
- o plano mostra necessidade?

Um índice pode:

- acelerar leitura;
- ocupar disco;
- aumentar WAL;
- aumentar custo de insert e update;
- competir por cache;
- ficar redundante.

---

### EXPLAIN e evidencia

`EXPLAIN` mostra plano estimado.

`EXPLAIN ANALYZE` executa a consulta e mostra tempos e linhas reais.

Ao ler um plano, observe:

```text
tipo de scan;

condição de índice;

filtro;

linhas estimadas;

linhas reais;

loops;

sort;

hash;

buffers;

tempo total.
```

Não conclua que `Seq Scan` é erro em uma tabela pequena.

---

### Transacao e concorrencia

Transação não é apenas:

```sql
BEGIN;
COMMIT;
```

Ela representa uma unidade de consistência.

Perguntas:

- quais linhas são lidas?
- quais linhas são alteradas?
- qual isolamento?
- pode haver atualização perdida?
- algum lock será mantido?
- quanto tempo a transação permanece aberta?
- o rollback é possível?
- uma chamada externa ocorre dentro dela?

Transações longas aumentam risco operacional.

---

### Backup precisa restaurar

Um arquivo não é evidência suficiente.

Validação de backup inclui:

- arquivo existente;
- hash;
- listagem do archive;
- restore em destino isolado;
- contagens;
- constraints;
- views;
- sequences;
- teste da aplicação.

Backup e migration resolvem problemas diferentes.

---

### Menor privilegio

A aplicação deve possuir apenas:

```text
CONNECT;

USAGE;

SELECT;

INSERT;

UPDATE;

DELETE;

USAGE em sequences necessárias.
```

Ela não precisa ser owner nem superuser.

Migration, leitura e runtime devem ter identidades separadas.

---

### JSONB com criterio

Use JSONB para variação documental real.

Mantenha em colunas:

- IDs;
- foreign keys;
- status;
- valores;
- datas centrais;
- unicidade;
- atributos de joins.

Se uma chave JSONB se torna obrigatória e muito consultada, considere promovê-la.

---

### Simulado como diagnostico

O objetivo não é esconder o gabarito.

Faça primeiro sem consultar.

Depois:

1. execute;
2. compare;
3. classifique o erro;
4. corrija;
5. registre a causa;
6. refaça sem copiar.

Um erro compreendido vale mais que uma resposta memorizada.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-309-revisao-tecnica-sql-postgresql-simulado\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-309-revisao-tecnica-sql-postgresql-simulado\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-309-revisao-tecnica-sql-postgresql-simulado\sql"

Set-Location `
  "labs\m12\aula-309-revisao-tecnica-sql-postgresql-simulado"
```

---

### 2. Criar 00_verificar_precondicoes.sql

Crie:

```text
sql/00_verificar_precondicoes.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    version() AS versao;

SELECT
    to_regnamespace(
        'projeto_os_final'
    ) AS schema_projeto,
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
    (SELECT count(*)
     FROM projeto_os_final.cliente)
        AS clientes,
    (SELECT count(*)
     FROM projeto_os_final.produto)
        AS produtos,
    (SELECT count(*)
     FROM projeto_os_final.tecnico)
        AS tecnicos,
    (SELECT count(*)
     FROM projeto_os_final.ordem_servico)
        AS ordens,
    (SELECT count(*)
     FROM projeto_os_final.atividade)
        AS atividades,
    (SELECT count(*)
     FROM projeto_os_final.pagamento)
        AS pagamentos,
    (SELECT count(*)
     FROM projeto_os_final.ordem_status_historico)
        AS historicos;
```

Esperado:

```text
4 Clientes;
4 Produtos;
4 Técnicos;
6 Ordens;
12 Atividades;
7 Pagamentos;
12 Históricos.
```

---

### 3. Criar 01_revisao_modelagem_integridade.sql

Crie:

```text
sql/01_revisao_modelagem_integridade.sql
```

Conteúdo:

```sql
SELECT
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'projeto_os_final'
ORDER BY
    table_name,
    constraint_type,
    constraint_name;

SELECT
    constraint_name,
    table_name,
    column_name,
    foreign_table_name,
    foreign_column_name
FROM information_schema.constraint_column_usage
WHERE table_schema = 'projeto_os_final'
ORDER BY
    table_name,
    constraint_name;

SELECT
    atividade.id,
    atividade.codigo,
    count(alocacao.tecnico_id) AS tecnicos
FROM projeto_os_final.atividade AS atividade
LEFT JOIN projeto_os_final.atividade_tecnico AS alocacao
    ON alocacao.atividade_id = atividade.id
GROUP BY
    atividade.id,
    atividade.codigo
ORDER BY atividade.id;

SELECT
    ordem.id,
    ordem.codigo,
    ordem.status,
    ordem.versao,
    jsonb_typeof(ordem.metadados)
        AS tipo_metadados
FROM projeto_os_final.ordem_servico AS ordem
ORDER BY ordem.id;
```

Durante a revisão, responda:

- quais constraints protegem cada entidade?
- quais regras não aparecem nos catálogos?
- por que a associação possui primary key composta?
- por que `versao` não é timestamp?
- por que metadados exige objeto?

---

### 4. Criar 02_revisao_consultas_relatorios.sql

Crie:

```text
sql/02_revisao_consultas_relatorios.sql
```

Conteúdo:

```sql
SELECT
    ordem_codigo,
    cliente_nome,
    produto_nome,
    ordem_status,
    valor_previsto,
    total_mao_obra,
    total_pago,
    total_pendente,
    saldo_a_receber,
    historico_consistente
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY ordem_id;

WITH parametros AS (
    SELECT DATE '2026-06-01'
        AS data_referencia
)
SELECT
    pagamento.ordem_codigo,
    pagamento.cliente_nome,
    pagamento.vencimento,
    pagamento.valor,
    parametro.data_referencia
        - pagamento.vencimento
        AS dias_atraso
FROM projeto_os_final.vw_pagamento_pendente_backend
    AS pagamento
CROSS JOIN parametros AS parametro
WHERE pagamento.vencimento
    < parametro.data_referencia
ORDER BY
    pagamento.vencimento,
    pagamento.pagamento_id;

SELECT
    tecnico_nome,
    quantidade_atividades,
    quantidade_ordens,
    horas_previstas
FROM projeto_os_final.vw_carga_tecnico_backend
ORDER BY
    horas_previstas DESC,
    tecnico_id;
```

Explique a granularidade de cada consulta antes de executar.

---

### 5. Criar 03_revisao_indices_planos.sql

Crie:

```text
sql/03_revisao_indices_planos.sql
```

Conteúdo:

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'projeto_os_final'
ORDER BY
    tablename,
    indexname;

EXPLAIN (
    ANALYZE,
    BUFFERS,
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
    SUMMARY
)
SELECT
    id,
    ordem_servico_id,
    vencimento,
    valor
FROM projeto_os_final.pagamento
WHERE status = 'PENDENTE'
ORDER BY
    vencimento,
    id;
```

Registre no mapa de revisão:

- índice candidato;
- plano escolhido;
- linhas estimadas;
- linhas reais;
- motivo possível de `Seq Scan`;
- decisão de manter, medir ou revisar.

---

### 6. Criar 04_revisao_transacoes_concorrencia.sql

Crie:

```text
sql/04_revisao_transacoes_concorrencia.sql
```

Conteúdo:

```sql
BEGIN;

SELECT
    id,
    codigo,
    status,
    versao
FROM projeto_os_final.ordem_servico
WHERE id = 307303
FOR UPDATE;

UPDATE projeto_os_final.ordem_servico
SET
    prioridade = 'ALTA',
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 307303
  AND versao = 0;

SELECT
    id,
    prioridade,
    versao
FROM projeto_os_final.ordem_servico
WHERE id = 307303;

ROLLBACK;

SELECT
    id,
    prioridade,
    versao
FROM projeto_os_final.ordem_servico
WHERE id = 307303;
```

Depois do rollback, os valores originais devem permanecer.

Explique:

- o lock adquirido;
- o papel da versão;
- o que ocorreria se a versão esperada fosse diferente;
- por que não fazer chamada HTTP dentro da transação.

---

### 7. Criar 05_revisao_operacao_seguranca.sql

Crie:

```text
sql/05_revisao_operacao_seguranca.sql
```

Conteúdo:

```sql
SELECT
    current_user,
    session_user;

SELECT
    has_schema_privilege(
        current_user,
        'projeto_os_final',
        'USAGE'
    ) AS pode_usar_schema;

SELECT
    has_table_privilege(
        current_user,
        'projeto_os_final.ordem_servico',
        'SELECT'
    ) AS pode_consultar_ordens;

SELECT
    has_table_privilege(
        current_user,
        'projeto_os_final.ordem_servico',
        'TRUNCATE'
    ) AS pode_truncar_ordens;

SELECT
    pg_size_pretty(
        pg_total_relation_size(
            'projeto_os_final.ordem_servico'
        )
    ) AS tamanho_ordem;
```

A revisão operacional deve responder:

- qual role deveria executar migrations?
- qual role deveria atender a API?
- qual role deveria produzir relatório?
- como o backup seria testado?
- por que dump custom não é criptografia?
- quais arquivos nunca entram no Git?

---

### 8. Criar 06_criar_schema_simulado.sql

Crie:

```text
sql/06_criar_schema_simulado.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS simulado_m12_309 CASCADE;

CREATE SCHEMA simulado_m12_309;

CREATE TABLE simulado_m12_309.categoria_servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL,
    nome text NOT NULL,
    ativo boolean NOT NULL DEFAULT true,

    CONSTRAINT pk_sim_categoria
        PRIMARY KEY (id),

    CONSTRAINT uq_sim_categoria_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_sim_categoria_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_sim_categoria_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE simulado_m12_309.servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    categoria_id bigint NOT NULL,
    codigo text NOT NULL,
    nome text NOT NULL,
    valor_base numeric(12, 2) NOT NULL,
    metadados jsonb NOT NULL
        DEFAULT '{}'::jsonb,

    CONSTRAINT pk_sim_servico
        PRIMARY KEY (id),

    CONSTRAINT fk_sim_servico_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES simulado_m12_309.categoria_servico (id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_sim_servico_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_sim_servico_valor
        CHECK (valor_base >= 0),

    CONSTRAINT ck_sim_servico_metadados
        CHECK (
            jsonb_typeof(metadados)
                = 'object'
        )
);

INSERT INTO simulado_m12_309.categoria_servico (
    id,
    codigo,
    nome
)
VALUES
    (
        309001,
        'INSTALACAO',
        'Instalação'
    ),
    (
        309002,
        'MANUTENCAO',
        'Manutenção'
    ),
    (
        309003,
        'DIAGNOSTICO',
        'Diagnóstico'
    );

INSERT INTO simulado_m12_309.servico (
    id,
    categoria_id,
    codigo,
    nome,
    valor_base,
    metadados
)
VALUES
    (
        309101,
        309001,
        'SERV-INST-01',
        'Instalação padrão',
        350.00,
        '{"nivel":"PADRAO"}'::jsonb
    ),
    (
        309102,
        309002,
        'SERV-MAN-01',
        'Manutenção preventiva',
        250.00,
        '{"recorrente":true}'::jsonb
    ),
    (
        309103,
        309002,
        'SERV-MAN-02',
        'Manutenção corretiva',
        500.00,
        '{"urgencia":"ALTA"}'::jsonb
    ),
    (
        309104,
        309003,
        'SERV-DIAG-01',
        'Diagnóstico técnico',
        180.00,
        '{}'::jsonb
    );

SELECT setval(
    pg_get_serial_sequence(
        'simulado_m12_309.categoria_servico',
        'id'
    ),
    309003,
    true
);

SELECT setval(
    pg_get_serial_sequence(
        'simulado_m12_309.servico',
        'id'
    ),
    309104,
    true
);
```

O schema auxiliar permite avaliar DDL, constraints e JSONB sem alterar o projeto final.

---

### 9. Criar scripts/01_preparar_simulado.ps1

Crie:

```text
scripts/01_preparar_simulado.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

$precondicoes = Join-Path `
    $labRoot `
    "sql\00_verificar_precondicoes.sql"

Get-Content -Raw $precondicoes |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d $database

if ($LASTEXITCODE -ne 0) {
    throw "Precondições inválidas."
}

$schema = Join-Path `
    $labRoot `
    "sql\06_criar_schema_simulado.sql"

Get-Content -Raw $schema |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d $database

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao preparar o simulado."
}

Write-Host "Simulado preparado."
```

Execute:

```powershell
.\scripts\01_preparar_simulado.ps1
```

---

## Simulado teorico

Registre respostas em:

```text
docs/folha-respostas.md
```

Não consulte o gabarito durante a primeira tentativa.

### Questao 1 — 2 pontos

Explique a diferença entre:

```text
primary key;

unique;

foreign key.
```

Inclua um exemplo do projeto.

### Questao 2 — 2 pontos

Por que `numeric(12, 2)` é mais adequado que `double precision` para valores monetários?

### Questao 3 — 2 pontos

Explique a diferença entre `INNER JOIN` e `LEFT JOIN`.

Dê um caso em que o Técnico sem alocação precisa permanecer.

### Questao 4 — 2 pontos

Defina fan-out e explique por que `COUNT(DISTINCT ...)` não corrige qualquer soma.

### Questao 5 — 2 pontos

Qual é a diferença entre:

```text
WHERE;

HAVING.
```

### Questao 6 — 2 pontos

Explique quando usar CTE e quando uma subquery simples é suficiente.

### Questao 7 — 2 pontos

O que muda entre `EXPLAIN` e `EXPLAIN ANALYZE`?

Qual cuidado é necessário com comandos que alteram dados?

### Questao 8 — 2 pontos

Explique `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE` em nível conceitual.

### Questao 9 — 2 pontos

Por que uma transação longa pode ser problemática?

### Questao 10 — 2 pontos

Compare paginação offset e keyset.

### Questao 11 — 2 pontos

Explique a diferença entre `ROW_NUMBER`, `RANK` e `DENSE_RANK`.

### Questao 12 — 2 pontos

Por que `LAST_VALUE` exige atenção ao frame?

### Questao 13 — 2 pontos

Quando JSONB deve ser evitado?

### Questao 14 — 2 pontos

Por que runtime, migrator e reader devem usar roles diferentes?

### Questao 15 — 2 pontos

Por que um backup só é confiável depois de um restore validado?

Total teórico:

```text
30 pontos.
```

---

## Simulado pratico

Crie:

```text
sql/07_simulado_pratico_enunciados.sql
```

Use o arquivo para escrever suas respostas antes de abrir o gabarito.

### Desafio 1 — 5 pontos

No schema `simulado_m12_309`, crie a tabela:

```text
servico_preco_historico
```

Granularidade:

```text
uma linha por alteração de preço de Serviço.
```

Campos mínimos:

- ID identity;
- `servico_id`;
- valor anterior;
- valor novo;
- ocorrido em;
- ator.

Regras:

- foreign key com `RESTRICT`;
- valores não negativos;
- valor anterior diferente do novo;
- ator não vazio;
- índice por Serviço e data descendente.

### Desafio 2 — 5 pontos

Insira dois históricos para `SERV-MAN-02`.

Execute tudo em transação.

Valide e faça rollback.

### Desafio 3 — 6 pontos

Retorne uma linha por categoria com:

- quantidade de Serviços;
- valor mínimo;
- valor máximo;
- valor médio;
- soma dos valores.

Inclua categoria sem Serviço, caso exista futuramente.

### Desafio 4 — 8 pontos

No projeto `projeto_os_final`, crie um relatório com uma linha por Cliente:

- quantidade de Ordens;
- valor previsto;
- total pago;
- total pendente;
- Ordens concluídas;
- Ordens ativas.

Inclua Cliente sem Ordem.

Não produza fan-out.

### Desafio 5 — 8 pontos

Retorne as duas Ordens de maior valor de cada Cliente.

Use window function e desempate por ID.

### Desafio 6 — 8 pontos

Com data de referência `2026-06-01`, retorne Pagamentos vencidos com:

- Cliente;
- Ordem;
- parcela;
- vencimento;
- valor;
- dias em atraso;
- posição do Pagamento mais antigo dentro do Cliente.

### Desafio 7 — 8 pontos

Retorne o último Histórico de cada Ordem e classifique:

```text
CONSISTENTE;

DIVERGENTE;

SEM_HISTORICO.
```

### Desafio 8 — 6 pontos

Escreva uma atualização otimista da Ordem `307303`.

Requisitos:

- prioridade para `ALTA`;
- incrementar versão;
- atualizar timestamp;
- aplicar somente se a versão atual for zero;
- executar dentro de transação;
- validar quantidade de linhas;
- rollback.

### Desafio 9 — 6 pontos

Escreva paginação keyset das Ordens em ordem decrescente por:

```text
aberta_em;

id.
```

Use cursor:

```text
2026-03-05 12:00:00-03;

307304.
```

Limite 3.

### Desafio 10 — 5 pontos

Analise com `EXPLAIN ANALYZE` a consulta de Pagamentos pendentes por vencimento.

Registre:

- scan;
- índice candidato;
- estimativas;
- linhas reais;
- decisão.

### Desafio 11 — 5 pontos

Consulte Serviços cujo JSONB contém:

```json
{
  "recorrente": true
}
```

Depois explique se essa chave deve virar coluna caso passe a ser obrigatória e filtrada em todos os endpoints.

Total prático:

```text
70 pontos.
```

---

## Gabarito pratico orientado

Abra o gabarito somente depois da primeira tentativa.

Crie:

```text
sql/08_gabarito_pratico.sql
```

Conteúdo:

```sql
CREATE TABLE simulado_m12_309.servico_preco_historico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    servico_id bigint NOT NULL,
    valor_anterior numeric(12, 2) NOT NULL,
    valor_novo numeric(12, 2) NOT NULL,
    ocorrido_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    ator text NOT NULL,

    CONSTRAINT pk_sim_preco_historico
        PRIMARY KEY (id),

    CONSTRAINT fk_sim_preco_servico
        FOREIGN KEY (servico_id)
        REFERENCES simulado_m12_309.servico (id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_sim_preco_valores
        CHECK (
            valor_anterior >= 0
            AND valor_novo >= 0
        ),

    CONSTRAINT ck_sim_preco_alteracao
        CHECK (
            valor_anterior <> valor_novo
        ),

    CONSTRAINT ck_sim_preco_ator
        CHECK (btrim(ator) <> '')
);

CREATE INDEX idx_sim_preco_servico_data
ON simulado_m12_309.servico_preco_historico (
    servico_id,
    ocorrido_em DESC,
    id DESC
);

BEGIN;

INSERT INTO simulado_m12_309.servico_preco_historico (
    servico_id,
    valor_anterior,
    valor_novo,
    ocorrido_em,
    ator
)
VALUES
    (
        309103,
        420.00,
        460.00,
        TIMESTAMPTZ '2026-06-01 09:00:00-03',
        'analista.01'
    ),
    (
        309103,
        460.00,
        500.00,
        TIMESTAMPTZ '2026-07-01 09:00:00-03',
        'analista.02'
    );

SELECT *
FROM simulado_m12_309.servico_preco_historico
ORDER BY ocorrido_em;

ROLLBACK;

SELECT
    categoria.id AS categoria_id,
    categoria.codigo,
    categoria.nome,
    count(servico.id) AS quantidade_servicos,
    min(servico.valor_base) AS menor_valor,
    max(servico.valor_base) AS maior_valor,
    round(
        avg(servico.valor_base),
        2
    ) AS valor_medio,
    coalesce(
        sum(servico.valor_base),
        0::numeric
    ) AS valor_total
FROM simulado_m12_309.categoria_servico AS categoria
LEFT JOIN simulado_m12_309.servico AS servico
    ON servico.categoria_id = categoria.id
GROUP BY
    categoria.id,
    categoria.codigo,
    categoria.nome
ORDER BY categoria.id;

SELECT
    cliente.id AS cliente_id,
    cliente.codigo,
    cliente.nome,
    count(ordem.ordem_id) AS quantidade_ordens,
    coalesce(
        sum(ordem.valor_previsto),
        0::numeric
    ) AS valor_previsto,
    coalesce(
        sum(ordem.total_pago),
        0::numeric
    ) AS total_pago,
    coalesce(
        sum(ordem.total_pendente),
        0::numeric
    ) AS total_pendente,
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
LEFT JOIN projeto_os_final.vw_ordem_resumo_backend AS ordem
    ON ordem.cliente_id = cliente.id
GROUP BY
    cliente.id,
    cliente.codigo,
    cliente.nome
ORDER BY cliente.id;

WITH ranqueada AS (
    SELECT
        ordem.id,
        ordem.codigo,
        ordem.cliente_id,
        ordem.valor_previsto,
        row_number() OVER (
            PARTITION BY ordem.cliente_id
            ORDER BY
                ordem.valor_previsto DESC,
                ordem.id
        ) AS posicao
    FROM projeto_os_final.ordem_servico AS ordem
)
SELECT *
FROM ranqueada
WHERE posicao <= 2
ORDER BY
    cliente_id,
    posicao;

WITH parametros AS (
    SELECT DATE '2026-06-01'
        AS data_referencia
),
vencidos AS (
    SELECT
        pagamento.pagamento_id,
        pagamento.cliente_id,
        pagamento.cliente_nome,
        pagamento.ordem_codigo,
        pagamento.parcela,
        pagamento.vencimento,
        pagamento.valor,
        parametro.data_referencia
            - pagamento.vencimento
            AS dias_atraso,
        row_number() OVER (
            PARTITION BY pagamento.cliente_id
            ORDER BY
                pagamento.vencimento,
                pagamento.pagamento_id
        ) AS posicao_antiguidade
    FROM projeto_os_final.vw_pagamento_pendente_backend
        AS pagamento
    CROSS JOIN parametros AS parametro
    WHERE pagamento.vencimento
        < parametro.data_referencia
)
SELECT *
FROM vencidos
ORDER BY
    cliente_id,
    posicao_antiguidade;

WITH ultimo AS (
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
    ordem.id,
    ordem.codigo,
    ordem.status AS status_atual,
    ultimo.status_novo AS ultimo_status,
    CASE
        WHEN ultimo.status_novo IS NULL
            THEN 'SEM_HISTORICO'
        WHEN ultimo.status_novo = ordem.status
            THEN 'CONSISTENTE'
        ELSE 'DIVERGENTE'
    END AS resultado
FROM projeto_os_final.ordem_servico AS ordem
LEFT JOIN ultimo
    ON ultimo.ordem_servico_id = ordem.id
   AND ultimo.posicao = 1
ORDER BY ordem.id;

BEGIN;

UPDATE projeto_os_final.ordem_servico
SET
    prioridade = 'ALTA',
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 307303
  AND versao = 0
RETURNING
    id,
    prioridade,
    versao;

ROLLBACK;

SELECT
    ordem_id,
    ordem_codigo,
    aberta_em
FROM projeto_os_final.vw_ordem_resumo_backend
WHERE (
    aberta_em,
    ordem_id
) < (
    TIMESTAMPTZ '2026-03-05 12:00:00-03',
    307304
)
ORDER BY
    aberta_em DESC,
    ordem_id DESC
LIMIT 3;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    ordem_servico_id,
    vencimento,
    valor
FROM projeto_os_final.pagamento
WHERE status = 'PENDENTE'
ORDER BY
    vencimento,
    id;

SELECT
    id,
    codigo,
    nome,
    metadados
FROM simulado_m12_309.servico
WHERE metadados @> '{
  "recorrente": true
}'::jsonb
ORDER BY id;
```

O gabarito apresenta uma solução válida, não a única solução possível.

---

### 10. Criar 09_validar_simulado.sql

Crie:

```text
sql/09_validar_simulado.sql
```

Conteúdo:

```sql
DO $$
DECLARE
    v_categorias bigint;
    v_servicos bigint;
    v_historico_regclass regclass;
BEGIN
    SELECT count(*)
    INTO v_categorias
    FROM simulado_m12_309.categoria_servico;

    SELECT count(*)
    INTO v_servicos
    FROM simulado_m12_309.servico;

    SELECT to_regclass(
        'simulado_m12_309.servico_preco_historico'
    )
    INTO v_historico_regclass;

    IF v_categorias <> 3
       OR v_servicos <> 4
       OR v_historico_regclass IS NULL THEN
        RAISE EXCEPTION
            'Estrutura do simulado inválida: %, %, %',
            v_categorias,
            v_servicos,
            v_historico_regclass;
    END IF;
END
$$;

DO $$
DECLARE
    v_ordens bigint;
    v_previsto numeric;
    v_pago numeric;
    v_divergencias bigint;
BEGIN
    SELECT
        count(*),
        sum(valor_previsto),
        sum(total_pago),
        count(*) FILTER (
            WHERE NOT historico_consistente
        )
    INTO
        v_ordens,
        v_previsto,
        v_pago,
        v_divergencias
    FROM projeto_os_final.vw_ordem_resumo_backend;

    IF v_ordens <> 6
       OR v_previsto <> 5200.00
       OR v_pago <> 2700.00
       OR v_divergencias <> 0 THEN
        RAISE EXCEPTION
            'Projeto principal foi alterado: %, %, %, %',
            v_ordens,
            v_previsto,
            v_pago,
            v_divergencias;
    END IF;
END
$$;

SELECT
    'SIMULADO_VALIDADO' AS resultado;
```

Esse validador confirma a estrutura auxiliar e protege o projeto principal contra alterações acidentais.

---

### 11. Criar scripts/02_validar_respostas_praticas.ps1

Crie:

```text
scripts/02_validar_respostas_praticas.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$arquivo = Join-Path `
    $labRoot `
    "sql\09_validar_simulado.sql"

Get-Content -Raw $arquivo |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -U formacao `
        -d $database

if ($LASTEXITCODE -ne 0) {
    throw "Validação do simulado falhou."
}

Write-Host "Simulado prático validado."
```

---

### 12. Criar a rubrica

Em:

```text
docs/rubrica-simulado.md
```

registre por desafio:

```text
SQL executa;

granularidade correta;

integridade preservada;

resultado correto;

ordenação determinística;

justificativa;

limpeza ou rollback.
```

Erros críticos:

```text
DROP no schema principal;

COMMIT de alterações do exercício;

soma com fan-out não reconhecido;

senha em arquivo versionado;

uso de superuser como solução;

backup tratado como confiável sem restore;

foreign key substituída por ID dentro de JSONB.
```

Um erro crítico exige revisão, mesmo que a soma dos pontos seja superior a 75.

---

## Entendendo o que foi feito

### A revisao conectou os temas

Modelagem, consultas, índices, transações, segurança e operação foram tratados como partes do mesmo sistema.

---

### O simulado protegeu o projeto

DDL ocorreu no schema auxiliar.

Alterações em `projeto_os_final` usaram rollback.

O validador confirmou que métricas centrais permaneceram iguais.

---

### O gabarito foi executavel

As respostas práticas não são apenas texto.

Elas podem ser executadas, comparadas e analisadas.

---

### A nota nao substitui diagnostico

Dois alunos com 80 pontos podem possuir lacunas diferentes.

O plano de recuperação precisa registrar temas específicos.

---

## Erros comuns importantes

### Consultar o gabarito antes da tentativa

Isso mede reconhecimento, não recuperação.

Faça a primeira execução sozinho.

### Pontuar apenas pelo SQL executar

Resultado incorreto pode executar sem erro.

Valide contagens e totals.

### Ignorar rollback

O simulado pode alterar o projeto usado no fechamento.

### Criar indice durante a prova sem evidencia

Apresente o candidato e o plano antes de alterar o schema.

### Esconder duvida

Registre a dúvida no plano de recuperação.

Ela orientará a revisão.

---

## Comandos uteis

### Preparar

```powershell
.\scripts\01_preparar_simulado.ps1
```

### Validar

```powershell
.\scripts\02_validar_respostas_praticas.ps1
```

### Abrir transacao de teste

```sql
BEGIN;
```

### Descartar alteracoes

```sql
ROLLBACK;
```

### Confirmar projeto

```sql
SELECT count(*)
FROM projeto_os_final.vw_ordem_resumo_backend;
```

---

## Exercicio principal

O exercício principal é o próprio simulado.

Fluxo obrigatório:

1. execute as precondições;
2. conclua a revisão orientada;
3. responda as 15 questões teóricas;
4. execute os 11 desafios práticos;
5. registre resultados;
6. abra o gabarito;
7. compare;
8. corrija;
9. atribua pontuação;
10. escreva o plano de recuperação;
11. execute o validador;
12. limpe apenas o schema auxiliar.

Em:

```text
docs/plano-recuperacao.md
```

crie uma tabela com:

```text
tema;

erro observado;

causa;

aula de referência;

ação prática;

evidência de correção;

status.
```

Ações válidas:

```text
refazer aula;

reescrever consulta sem copiar;

explicar em voz alta;

criar teste negativo;

comparar plano;

reconstruir schema;

validar restore;

repetir simulado parcial.
```

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade;
- o laboratório oficial da aula 309 existe;
- o projeto das aulas 307 e 308 foi preservado;
- as três views existem;
- precondições foram executadas;
- mapa de revisão foi criado;
- modelagem e integridade foram revisadas;
- consultas e relatórios foram revisados;
- índices e planos foram revisados;
- transações e concorrência foram revisadas;
- operação e segurança foram revisadas;
- schema `simulado_m12_309` foi criado;
- duas tabelas iniciais foram criadas;
- o simulado teórico possui 15 questões;
- o simulado prático possui 11 desafios;
- a prova soma 100 pontos;
- a rubrica foi documentada;
- uma tabela de histórico de preço foi modelada;
- foreign key e checks foram aplicados;
- relatório por categoria foi criado;
- relatório por Cliente evitou fan-out;
- top duas Ordens por Cliente foi implementado;
- Pagamentos vencidos usaram data fixa;
- último Histórico foi selecionado deterministicamente;
- atualização otimista usou versão;
- paginação keyset usou cursor composto;
- `EXPLAIN ANALYZE` foi registrado;
- consulta JSONB foi praticada;
- gabarito executável foi criado;
- validador automático foi executado;
- nenhuma métrica do projeto principal mudou;
- plano de recuperação foi preenchido;
- schema auxiliar foi removido;
- schema `projeto_os_final` permaneceu;
- views V5 permaneceram;
- fechamento da aula 310 não foi antecipado;
- commit recomendado pode ser realizado.

---

## Commit recomendado

Antes de adicionar:

```powershell
git status
git diff
```

Adicione:

```powershell
git add `
  labs/m12/aula-309-revisao-tecnica-sql-postgresql-simulado
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "test(m12): realizar revisao tecnica e simulado sql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
revisão;

simulado;

gabarito;

rubrica;

validação;

plano de recuperação.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você revisou o M12 como um conjunto integrado de competências.

A avaliação verificou:

```text
modelagem;

integridade;

consultas;

relatórios;

fan-out;

índices;

planos;

transações;

concorrência;

paginação;

window functions;

JSONB;

migrations;

backup;

segurança.
```

A regra principal da revisão foi:

```text
não basta lembrar o comando;

é necessário reconhecer quando usar,
qual regra proteger,
qual risco existe
e como validar o resultado.
```

A próxima aula será:

```text
310 - M12.40 - Fechamento do Modulo 12 SQL PostgreSQL
```

Nela, você vai:

- consolidar competências;
- revisar entregáveis do módulo;
- registrar evolução;
- organizar o projeto final;
- confirmar checkpoints;
- fechar pendências;
- atualizar o diário de bordo;
- preparar a transição para o próximo módulo.

Mantenha disponíveis:

```text
projeto_os_final;

views V5;

laboratórios do M12;

resultado do simulado;

plano de recuperação.
```

---

# Material complementar

## Limpeza do simulado

Crie:

```text
sql/10_limpar_schema_simulado.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS simulado_m12_309 CASCADE;
```

Crie:

```text
scripts/03_limpar_simulado.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

Get-Content -Raw `
  ".\sql\10_limpar_schema_simulado.sql" |
  docker exec -i formacao-postgres-m12 `
    psql `
    -X `
    -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao limpar o simulado."
}

Write-Host "Schema auxiliar removido."
```

Não remova `projeto_os_final`.

---

## Checkpoint final

Crie:

```text
sql/11_checkpoint_final.sql
```

Conteúdo:

```sql
SELECT
    to_regnamespace(
        'simulado_m12_309'
    ) AS schema_simulado,
    to_regnamespace(
        'projeto_os_final'
    ) AS schema_projeto,
    to_regclass(
        'projeto_os_final.vw_ordem_resumo_backend'
    ) AS view_ordens;

SELECT
    count(*) AS ordens,
    sum(valor_previsto) AS valor_previsto,
    sum(total_pago) AS total_pago,
    count(*) FILTER (
        WHERE NOT historico_consistente
    ) AS divergencias
FROM projeto_os_final.vw_ordem_resumo_backend;
```

Esperado:

```text
schema do simulado:
NULL.

schema do projeto:
existente.

view:
existente.

Ordens:
6.

valor previsto:
5200.00.

total pago:
2700.00.

divergências:
0.
```

---

## Mapa de revisao recomendado

Em:

```text
docs/mapa-revisao.md
```

organize:

```text
271–280:
fundamentos SQL e joins.

281–285:
modelagem e normalização.

286–290:
agregações, subqueries, CTEs, views e funções.

291–296:
índices, planos, transações, locks e paginação.

297–299:
modelo integrado, relatórios e performance.

300–304:
migrations, Flyway, dados, backup e segurança.

305–306:
window functions e JSONB.

307–308:
projeto final.
```

Marque:

```text
domino;

preciso praticar;

preciso refazer.
```

---

## Perguntas de reflexao

1. Qual erro técnico mais apareceu durante o simulado?
2. O problema foi sintaxe, modelagem ou interpretação?
3. Você declarou a granularidade antes de consultar?
4. Reconheceu fan-out sem consultar o material?
5. Conseguiu justificar os índices?
6. Leu estimativas e linhas reais?
7. Usou rollback corretamente?
8. Separou regra do banco e da aplicação?
9. Tratou NULL conscientemente?
10. A data de referência ficou determinística?
11. O cursor da paginação ficou completo?
12. O JSONB foi usado com critério?
13. O projeto principal permaneceu íntegro?
14. Qual aula precisa ser refeita?
15. Você atingiu pelo menos 75 pontos?

---

## Troubleshooting adicional

### O schema do projeto nao existe

Reconstrua as migrations V1 a V5 das aulas 307 e 308.

### O validador acusa metricas alteradas

Revise transações abertas e alterações sem rollback.

Não corrija o validador para aceitar o erro.

### A tabela de historico ja existe

O gabarito foi executado antes.

Reconstrua somente `simulado_m12_309`.

### UPDATE retornou zero linhas

A versão esperada não corresponde à versão atual.

Isso representa conflito otimista.

### Plano diferente do gabarito

Planos podem variar por versão, estatísticas e ambiente.

Compare semântica, estimativas e custo; não exija texto idêntico.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 309 - M12.39 - Revisao tecnica SQL PostgreSQL e simulado

- Revisei os fundamentos de SQL e PostgreSQL do M12.
- Reforcei modelagem, granularidade, chaves e integridade.
- Revisei joins, agregações, CTEs, views e relatórios.
- Reforcei a prevenção de fan-out.
- Revisei índices, seletividade e planos de execução.
- Revisei transações, isolamento, locks e concorrência otimista.
- Revisei paginação offset e keyset.
- Revisei window functions e frames.
- Revisei critérios de uso de JSONB.
- Revisei migrations, Flyway, seed e massa de teste.
- Revisei backup, restore e validação de recuperação.
- Revisei roles e princípio do menor privilégio.
- Respondi 15 questões teóricas.
- Executei 11 desafios práticos.
- Modelei histórico de preço em schema auxiliar.
- Criei relatórios sem fan-out.
- Pratiquei ranking, inadimplência e último Histórico.
- Executei atualização otimista com rollback.
- Analisei plano de Pagamentos pendentes.
- Comparei minhas respostas com gabarito executável.
- Registrei pontuação e plano de recuperação.
- Validei que o projeto principal permaneceu íntegro.
- Removi apenas o schema auxiliar.
- Próxima aula: fechamento do M12.
```

---

## Referencia tecnica curta

```text
Modelar:
definir significado e regras.

Consultar:
preservar granularidade.

Agregar:
evitar fan-out.

Indexar:
medir consultas reais.

Transacionar:
proteger unidade de consistência.

Paginar:
ordenar deterministicamente.

Autorizar:
aplicar menor privilégio.

Recuperar:
testar restore.

Avaliar:
executar, validar e explicar.
```

Regra final:

```text
dominio tecnico de SQL e PostgreSQL aparece quando voce consegue modelar, consultar, proteger, diagnosticar e justificar suas decisoes sem comprometer a integridade dos dados.
```
