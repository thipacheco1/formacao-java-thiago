# 310 - M12.40 - Fechamento do Modulo 12 SQL PostgreSQL

## Apresentacao da aula

Você chegou ao fechamento oficial do módulo M12 — SQL, PostgreSQL e modelagem relacional.

Este módulo começou na aula 271 e termina agora, na aula 310.

Foram quarenta aulas dedicadas a compreender banco de dados como parte essencial da engenharia backend.

Ao longo do percurso, você não estudou apenas comandos SQL.

Você aprendeu a transformar requisitos em estruturas persistentes, consultar dados sem distorcer a granularidade, proteger integridade, analisar planos, controlar transações, diagnosticar concorrência, versionar mudanças, organizar dados de teste, recuperar backups e aplicar segurança básica.

O fechamento precisa responder quatro perguntas:

```text
o que foi aprendido?

quais evidências comprovam o aprendizado?

quais pontos ainda precisam de revisão?

como o banco será entregue ao próximo módulo?
```

A resposta não pode depender apenas de uma sensação como:

```text
acho que entendi.
```

Ela precisa utilizar evidências verificáveis:

- schema criado;
- constraints existentes;
- seed conhecido;
- views funcionando;
- métricas esperadas;
- simulado concluído;
- backup gerado;
- restore testado;
- documentação organizada;
- plano de revisão registrado.

O principal entregável técnico do módulo é:

```text
projeto_os_final
```

Esse schema foi construído nas aulas 307 e 308 e contém:

```text
8 tabelas;

3 views de backend;

relacionamentos;

constraints;

índices;

seed determinístico;

consultas e indicadores.
```

Ele permanecerá disponível.

A próxima aula iniciará o módulo M13:

```text
311 - M13.01 - JDBC visao geral e driver PostgreSQL
```

O objetivo da transição será conectar Java ao PostgreSQL sem tratar o banco como uma caixa-preta.

Você já conhece:

- o modelo;
- os dados;
- as chaves;
- os tipos;
- as restrições;
- os relatórios;
- os riscos;
- as métricas.

Por isso, quando JDBC aparecer, você poderá concentrar-se na fronteira entre Java e banco.

Nesta aula, você vai:

1. inventariar competências;
2. validar o projeto final;
3. gerar evidência executável;
4. revisar o resultado do simulado;
5. registrar pendências;
6. gerar backup custom;
7. testar o restore em database isolado;
8. documentar o contrato de transição para M13;
9. fazer o commit de encerramento;
10. atualizar o diário de bordo.

Nenhum conceito de JDBC será implementado ainda.

A aula prepara o ambiente e o contrato, mas preserva o início oficial do M13 para a aula 311.

---

## Onde estamos na formacao

A parte final do M12 ficou organizada assim:

```text
307:
modelo físico do projeto final.

308:
consultas, views e relatórios.

309:
revisão técnica e simulado.

310:
fechamento e transição.
```

O próximo módulo será:

```text
M13 — Persistencia Java:
JDBC, JPA, Hibernate e Spring Data.
```

A mudança de módulo não elimina o que foi aprendido.

Ela aumenta a responsabilidade.

Em M13, comandos Java produzirão efeitos no PostgreSQL.

Uma conexão mal administrada pode:

- manter transações abertas;
- bloquear linhas;
- esgotar conexões;
- executar consultas sem índice;
- gerar N+1;
- ignorar constraints;
- duplicar dados;
- expor credenciais;
- misturar lógica transacional e chamadas externas.

A base do M12 será usada para avaliar esses comportamentos.

O módulo está concluído quando você consegue:

```text
modelar;

criar;

popular;

consultar;

agregar;

indexar;

diagnosticar;

transacionar;

proteger;

recuperar;

explicar.
```

Conclusão não significa memorização perfeita.

Significa possuir uma base funcional, saber validar resultados e reconhecer quando precisa consultar documentação ou refazer um laboratório.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-310-fechamento-modulo-12-sql-postgresql
```

Estrutura final:

```text
labs
└── m12
    └── aula-310-fechamento-modulo-12-sql-postgresql
        ├── README.md
        ├── .gitignore
        ├── backups
        │   └── .gitkeep
        ├── evidencias
        │   └── .gitkeep
        ├── docs
        │   ├── contrato-transicao-m13.md
        │   ├── inventario-entregaveis.md
        │   ├── mapa-competencias-m12.md
        │   ├── plano-revisao-pos-m12.md
        │   └── retrospectiva-tecnica.md
        ├── scripts
        │   ├── 01_validar_ambiente_final.ps1
        │   ├── 02_gerar_evidencia_final.ps1
        │   ├── 03_gerar_backup_final.ps1
        │   └── 04_testar_restore_final.ps1
        └── sql
            ├── 00_verificar_contexto.sql
            ├── 01_validar_objetos_finais.sql
            ├── 02_validar_contagens_finais.sql
            ├── 03_validar_metricas_finais.sql
            ├── 04_validar_integridade_final.sql
            ├── 05_inspecionar_constraints_indices.sql
            ├── 06_smoke_contract_m13.sql
            └── 07_checkpoint_final.sql
```

Estado esperado:

```text
database:
formacao_java.

schema:
projeto_os_final.

tabelas:
8.

views:
3.

Ordens:
6.

valor previsto:
5200.00.

mão de obra:
2960.00.

parcelado:
4500.00.

pago:
2700.00.

pendente:
1800.00.

saldo:
2500.00.

divergências de Histórico:
0.
```

Backup final:

```text
backups/m12_projeto_os_final.dump
```

Hash:

```text
backups/m12_projeto_os_final.dump.sha256
```

Database temporário de restore:

```text
formacao_java_m12_restore_check
```

Esse database será removido automaticamente depois da validação.

---

## Conceito essencial

### Fechamento tecnico

Fechar um módulo técnico não é apenas parar de adicionar conteúdo.

É produzir um estado conhecido.

Esse estado precisa responder:

```text
o que existe?

qual versão representa a entrega?

como validar?

como reconstruir?

como recuperar?

o que permanece pendente?

qual é a próxima dependência?
```

Sem fechamento, o próximo módulo começa sobre uma base incerta.

---

### Competencia e evidencia

Uma competência precisa de evidência.

Exemplos:

```text
competência:
modelar muitos para muitos.

evidência:
atividade_tecnico com chave composta e atributos da relação.
```

```text
competência:
evitar fan-out.

evidência:
vw_ordem_resumo_backend usa pré-agregações independentes.
```

```text
competência:
validar recuperação.

evidência:
dump custom restaurado e métricas conferidas em database isolado.
```

A evidência não precisa ser sofisticada.

Ela precisa ser reproduzível.

---

### Mapa de competencias

O mapa do M12 será dividido em oito áreas.

#### Fundamentos SQL

Você deve reconhecer:

- `SELECT`;
- filtros;
- ordenação;
- nulos;
- expressões;
- aliases;
- funções;
- DML.

#### Modelagem relacional

Você deve explicar:

- entidade;
- granularidade;
- cardinalidade;
- normalização;
- chave técnica;
- chave de negócio;
- tabela associativa.

#### Integridade

Você deve saber escolher:

- tipo;
- `NOT NULL`;
- primary key;
- `UNIQUE`;
- foreign key;
- `CHECK`;
- política de exclusão;
- regra transacional.

#### Consultas de backend

Você deve produzir:

- joins;
- agregações;
- CTEs;
- subqueries;
- views;
- paginação;
- rankings;
- relatórios sem fan-out.

#### Performance e diagnóstico

Você deve compreender:

- índice B-tree;
- índice parcial;
- índice de expressão;
- GIN;
- seletividade;
- estatísticas;
- `EXPLAIN ANALYZE`;
- custo de escrita.

#### Transações e concorrência

Você deve reconhecer:

- atomicidade;
- commit;
- rollback;
- isolamento;
- locks;
- deadlocks;
- atualização otimista;
- transação longa.

#### Evolução e operação

Você deve praticar:

- migrations;
- Flyway;
- seed;
- massa de teste;
- backup;
- restore;
- hash;
- limpeza.

#### Segurança e contratos

Você deve aplicar:

- roles;
- menor privilégio;
- owner sem login;
- runtime separado;
- credenciais fora do Git;
- contrato estável de leitura;
- data de referência;
- ordenação determinística.

---

### Nivel de dominio

Classifique cada competência como:

```text
DOMINO:
consigo explicar e executar sem roteiro detalhado.

PRATICO_COM_REFERENCIA:
consigo executar consultando documentação.

PRECISO_REFAZER:
não consigo explicar ou produzo resultado incorreto.
```

Evite classificar tudo como `DOMINO`.

Um mapa honesto é mais útil que uma lista otimista.

---

### Inventario de entregaveis

O inventário precisa identificar:

- laboratório;
- objetivo;
- arquivo principal;
- schema criado;
- objetos persistentes;
- commit;
- status;
- dependências.

Itens fundamentais do M12:

```text
ambiente PostgreSQL;

scripts SQL;

projeto_os;

projeto_os_final;

views V5;

migrations;

backup e restore;

simulado;

diário de bordo.
```

O inventário não precisa listar cada arquivo das quarenta aulas.

Ele precisa apontar os entregáveis que representam competências importantes.

---

### Retrospectiva tecnica

A retrospectiva responde:

```text
o que ficou mais claro?

o que foi mais difícil?

qual erro se repetiu?

qual decisão melhorou?

qual prática será mantida?
```

Exemplos de erros que merecem registro:

- esquecer a granularidade;
- usar join direto entre filhos;
- confundir `NULL` e zero;
- criar índice sem medir;
- deixar transação aberta;
- usar data atual em teste;
- esquecer sequence após seed;
- misturar owner e runtime;
- guardar relacionamento em JSONB.

A retrospectiva não é uma avaliação emocional.

Ela é um registro de padrões técnicos.

---

### Plano de revisao

Uma pendência precisa de ação concreta.

Fraco:

```text
revisar índices.
```

Forte:

```text
refazer as aulas 291 a 293;

executar EXPLAIN em três consultas;

comparar estimativa e linha real;

documentar um índice mantido e um rejeitado.
```

O plano precisa informar:

- tema;
- evidência da dificuldade;
- aula de referência;
- atividade;
- data;
- critério de conclusão.

---

### Baseline para o M13

Antes de conectar Java, registre o contrato do banco.

Exemplo:

```text
host local:
localhost.

porta:
a porta publicada pelo container PostgreSQL.

database:
formacao_java.

schema:
projeto_os_final.

tabela inicial:
cliente.

view inicial:
vw_ordem_resumo_backend.

credencial:
variável local, nunca hardcoded.

timezone:
confirmar na conexão.

autocommit:
será estudado no M13.
```

A aula 311 ainda decidirá como o driver será adicionado e utilizado.

A aula 310 apenas garante que o destino da conexão é conhecido e saudável.

---

### Preservar o projeto

Não remova:

```text
projeto_os_final;

views V5;

seed;

container PostgreSQL;

volume local.
```

O backup final não substitui o ambiente ativo.

Ele oferece uma forma adicional de recuperação.

O schema ativo será útil para os primeiros exercícios de JDBC.

---

### Backup como evidencia de encerramento

O dump final usará:

```text
formato custom;

somente projeto_os_final;

sem owner;

sem ACLs.
```

Essas opções facilitam o restore local.

O arquivo não deve entrar no Git.

Também será gerado SHA-256.

Depois, o dump será restaurado em database temporário.

A validação executará:

- contagens;
- métricas;
- consistência;
- presença das views.

Somente depois o database temporário será removido.

---

### Definition of Done do M12

O módulo estará tecnicamente encerrado quando:

```text
projeto final validado;

simulado registrado;

pendências documentadas;

evidência final gerada;

backup criado;

hash conferido;

restore testado;

diário atualizado;

commit realizado;

ponte para M13 documentada.
```

Se algum item falhar, o fechamento deve registrar a falha.

Não altere o validador para aceitar um estado incorreto.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do projeto:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-310-fechamento-modulo-12-sql-postgresql\backups"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-310-fechamento-modulo-12-sql-postgresql\evidencias"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-310-fechamento-modulo-12-sql-postgresql\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-310-fechamento-modulo-12-sql-postgresql\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-310-fechamento-modulo-12-sql-postgresql\sql"

Set-Location `
  "labs\m12\aula-310-fechamento-modulo-12-sql-postgresql"

New-Item -ItemType File -Force `
  -Path ".\backups\.gitkeep"

New-Item -ItemType File -Force `
  -Path ".\evidencias\.gitkeep"
```

---

### 2. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```text
backups/*
!backups/.gitkeep

evidencias/*
!evidencias/.gitkeep

*.dump
*.sha256
```

Backup e evidência gerada localmente não entram no Git.

Os scripts e a documentação entram.

---

### 3. Criar 00_verificar_contexto.sql

Crie:

```text
sql/00_verificar_contexto.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_setting(
        'server_version'
    ) AS versao_servidor,
    current_setting(
        'TimeZone'
    ) AS timezone,
    current_setting(
        'search_path'
    ) AS search_path;

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
```

O resultado precisa apontar para `formacao_java`.

---

### 4. Criar 01_validar_objetos_finais.sql

Crie:

```text
sql/01_validar_objetos_finais.sql
```

Conteúdo:

```sql
DO $$
BEGIN
    IF to_regnamespace(
        'projeto_os_final'
    ) IS NULL THEN
        RAISE EXCEPTION
            'Schema projeto_os_final ausente.';
    END IF;

    IF to_regclass(
        'projeto_os_final.cliente'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.produto'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.tecnico'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.ordem_servico'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.atividade'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.atividade_tecnico'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.pagamento'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.ordem_status_historico'
    ) IS NULL THEN
        RAISE EXCEPTION
            'Uma ou mais tabelas finais estão ausentes.';
    END IF;

    IF to_regclass(
        'projeto_os_final.vw_ordem_resumo_backend'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.vw_pagamento_pendente_backend'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.vw_carga_tecnico_backend'
    ) IS NULL THEN
        RAISE EXCEPTION
            'Uma ou mais views finais estão ausentes.';
    END IF;
END
$$;

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'projeto_os_final'
ORDER BY table_name;

SELECT
    table_name
FROM information_schema.views
WHERE table_schema = 'projeto_os_final'
ORDER BY table_name;
```

---

### 5. Criar 02_validar_contagens_finais.sql

Crie:

```text
sql/02_validar_contagens_finais.sql
```

Conteúdo:

```sql
DO $$
DECLARE
    v_clientes bigint;
    v_produtos bigint;
    v_tecnicos bigint;
    v_ordens bigint;
    v_atividades bigint;
    v_alocacoes bigint;
    v_pagamentos bigint;
    v_historicos bigint;
BEGIN
    SELECT count(*)
    INTO v_clientes
    FROM projeto_os_final.cliente;

    SELECT count(*)
    INTO v_produtos
    FROM projeto_os_final.produto;

    SELECT count(*)
    INTO v_tecnicos
    FROM projeto_os_final.tecnico;

    SELECT count(*)
    INTO v_ordens
    FROM projeto_os_final.ordem_servico;

    SELECT count(*)
    INTO v_atividades
    FROM projeto_os_final.atividade;

    SELECT count(*)
    INTO v_alocacoes
    FROM projeto_os_final.atividade_tecnico;

    SELECT count(*)
    INTO v_pagamentos
    FROM projeto_os_final.pagamento;

    SELECT count(*)
    INTO v_historicos
    FROM projeto_os_final.ordem_status_historico;

    IF v_clientes <> 4
       OR v_produtos <> 4
       OR v_tecnicos <> 4
       OR v_ordens <> 6
       OR v_atividades <> 12
       OR v_alocacoes <> 10
       OR v_pagamentos <> 7
       OR v_historicos <> 12 THEN
        RAISE EXCEPTION
            'Contagens finais inválidas: %, %, %, %, %, %, %, %',
            v_clientes,
            v_produtos,
            v_tecnicos,
            v_ordens,
            v_atividades,
            v_alocacoes,
            v_pagamentos,
            v_historicos;
    END IF;
END
$$;

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
     FROM projeto_os_final.atividade_tecnico)
        AS alocacoes,
    (SELECT count(*)
     FROM projeto_os_final.pagamento)
        AS pagamentos,
    (SELECT count(*)
     FROM projeto_os_final.ordem_status_historico)
        AS historicos;
```

---

### 6. Criar 03_validar_metricas_finais.sql

Crie:

```text
sql/03_validar_metricas_finais.sql
```

Conteúdo:

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
            'Métricas finais inválidas: %, %, %, %, %, %, %, %',
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

SELECT
    count(*) AS ordens,
    sum(valor_previsto) AS valor_previsto,
    sum(total_mao_obra) AS total_mao_obra,
    sum(total_parcelado) AS total_parcelado,
    sum(total_pago) AS total_pago,
    sum(total_pendente) AS total_pendente,
    sum(saldo_a_receber) AS saldo_a_receber,
    count(*) FILTER (
        WHERE NOT historico_consistente
    ) AS divergencias
FROM projeto_os_final.vw_ordem_resumo_backend;
```

---

### 7. Criar 04_validar_integridade_final.sql

Crie:

```text
sql/04_validar_integridade_final.sql
```

Conteúdo:

```sql
DO $$
DECLARE
    v_orfaos bigint;
    v_sequences_invalidas bigint;
BEGIN
    SELECT
        (
            SELECT count(*)
            FROM projeto_os_final.ordem_servico AS ordem
            LEFT JOIN projeto_os_final.cliente AS cliente
                ON cliente.id = ordem.cliente_id
            LEFT JOIN projeto_os_final.produto AS produto
                ON produto.id = ordem.produto_id
            WHERE cliente.id IS NULL
               OR produto.id IS NULL
        )
        +
        (
            SELECT count(*)
            FROM projeto_os_final.atividade AS atividade
            LEFT JOIN projeto_os_final.ordem_servico AS ordem
                ON ordem.id = atividade.ordem_servico_id
            WHERE ordem.id IS NULL
        )
        +
        (
            SELECT count(*)
            FROM projeto_os_final.atividade_tecnico AS alocacao
            LEFT JOIN projeto_os_final.atividade AS atividade
                ON atividade.id = alocacao.atividade_id
            LEFT JOIN projeto_os_final.tecnico AS tecnico
                ON tecnico.id = alocacao.tecnico_id
            WHERE atividade.id IS NULL
               OR tecnico.id IS NULL
        )
        +
        (
            SELECT count(*)
            FROM projeto_os_final.pagamento AS pagamento
            LEFT JOIN projeto_os_final.ordem_servico AS ordem
                ON ordem.id = pagamento.ordem_servico_id
            WHERE ordem.id IS NULL
        )
        +
        (
            SELECT count(*)
            FROM projeto_os_final.ordem_status_historico
                AS historico
            LEFT JOIN projeto_os_final.ordem_servico AS ordem
                ON ordem.id = historico.ordem_servico_id
            WHERE ordem.id IS NULL
        )
    INTO v_orfaos;

    WITH verificacao AS (
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.cliente',
                'id'
            ) AS sequence_name,
            (
                SELECT max(id)
                FROM projeto_os_final.cliente
            ) AS maior_id
        UNION ALL
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.produto',
                'id'
            ),
            (
                SELECT max(id)
                FROM projeto_os_final.produto
            )
        UNION ALL
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.tecnico',
                'id'
            ),
            (
                SELECT max(id)
                FROM projeto_os_final.tecnico
            )
        UNION ALL
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.ordem_servico',
                'id'
            ),
            (
                SELECT max(id)
                FROM projeto_os_final.ordem_servico
            )
        UNION ALL
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.atividade',
                'id'
            ),
            (
                SELECT max(id)
                FROM projeto_os_final.atividade
            )
        UNION ALL
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.pagamento',
                'id'
            ),
            (
                SELECT max(id)
                FROM projeto_os_final.pagamento
            )
        UNION ALL
        SELECT
            pg_get_serial_sequence(
                'projeto_os_final.ordem_status_historico',
                'id'
            ),
            (
                SELECT max(id)
                FROM projeto_os_final.ordem_status_historico
            )
    )
    SELECT count(*)
    INTO v_sequences_invalidas
    FROM verificacao
    WHERE sequence_name IS NULL
       OR maior_id IS NULL;

    IF v_orfaos <> 0 THEN
        RAISE EXCEPTION
            'Foram encontrados % registros órfãos.',
            v_orfaos;
    END IF;

    IF v_sequences_invalidas <> 0 THEN
        RAISE EXCEPTION
            'Existem sequences não identificadas.';
    END IF;
END
$$;

SELECT
    ordem_codigo,
    ordem_status,
    ultimo_status_historico,
    historico_consistente
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY ordem_id;
```

---

### 8. Criar 05_inspecionar_constraints_indices.sql

Crie:

```text
sql/05_inspecionar_constraints_indices.sql
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
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'projeto_os_final'
ORDER BY
    tablename,
    indexname;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_pof_ordem_cliente'
    )
       OR NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ck_pof_ordem_conclusao'
    )
       OR NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pk_pof_atividade_tecnico'
    ) THEN
        RAISE EXCEPTION
            'Constraints críticas ausentes.';
    END IF;

    IF to_regclass(
        'projeto_os_final.idx_pof_ordem_cliente_data'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.idx_pof_pagamento_pendente_vencimento'
    ) IS NULL
       OR to_regclass(
        'projeto_os_final.idx_pof_historico_ordem_data'
    ) IS NULL THEN
        RAISE EXCEPTION
            'Índices críticos ausentes.';
    END IF;
END
$$;
```

---

### 9. Criar 06_smoke_contract_m13.sql

Crie:

```text
sql/06_smoke_contract_m13.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_setting(
        'TimeZone'
    ) AS timezone;

SELECT
    id,
    codigo,
    nome,
    documento,
    ativo
FROM projeto_os_final.cliente
ORDER BY id
LIMIT 3;

SELECT
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    prioridade,
    valor_previsto,
    versao
FROM projeto_os_final.ordem_servico
ORDER BY id
LIMIT 3;

SELECT
    ordem_id,
    ordem_codigo,
    cliente_nome,
    produto_nome,
    ordem_status,
    valor_previsto,
    total_pago,
    total_pendente
FROM projeto_os_final.vw_ordem_resumo_backend
ORDER BY ordem_id
LIMIT 3;
```

Essas consultas serão o contrato de leitura inicial para a transição.

A aula 311 decidirá como executá-las por JDBC.

---

### 10. Criar 07_checkpoint_final.sql

Crie:

```text
sql/07_checkpoint_final.sql
```

Conteúdo:

```sql
SELECT
    'M12_CONCLUIDO' AS status_modulo,
    current_database() AS banco,
    current_user AS usuario,
    current_setting(
        'server_version'
    ) AS versao_postgresql;

SELECT
    count(*) AS ordens,
    sum(valor_previsto) AS valor_previsto,
    sum(total_mao_obra) AS mao_obra,
    sum(total_parcelado) AS parcelado,
    sum(total_pago) AS pago,
    sum(total_pendente) AS pendente,
    sum(saldo_a_receber) AS saldo,
    count(*) FILTER (
        WHERE NOT historico_consistente
    ) AS divergencias
FROM projeto_os_final.vw_ordem_resumo_backend;

SELECT
    count(*) AS pagamentos_pendentes,
    sum(valor) AS valor_pendente
FROM projeto_os_final.vw_pagamento_pendente_backend;

SELECT
    count(*) AS tecnicos,
    sum(horas_previstas) AS horas_previstas
FROM projeto_os_final.vw_carga_tecnico_backend;

SELECT
    '311 - M13.01 - JDBC visao geral e driver PostgreSQL'
        AS proxima_aula;
```

---

### 11. Criar 01_validar_ambiente_final.ps1

Crie:

```text
scripts/01_validar_ambiente_final.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

$arquivos = @(
    "00_verificar_contexto.sql",
    "01_validar_objetos_finais.sql",
    "02_validar_contagens_finais.sql",
    "03_validar_metricas_finais.sql",
    "04_validar_integridade_final.sql",
    "05_inspecionar_constraints_indices.sql",
    "06_smoke_contract_m13.sql",
    "07_checkpoint_final.sql"
)

foreach ($arquivo in $arquivos) {
    $path = Join-Path `
        $labRoot `
        "sql\$arquivo"

    Write-Host "Executando $arquivo"

    Get-Content -Raw $path |
        docker exec -i $container `
            psql `
            -X `
            -v ON_ERROR_STOP=1 `
            -P pager=off `
            -U formacao `
            -d $database

    if ($LASTEXITCODE -ne 0) {
        throw "Falha em $arquivo"
    }
}

Write-Host "Validação final do M12 concluída."
```

Execute:

```powershell
.\scripts\01_validar_ambiente_final.ps1
```

---

### 12. Criar 02_gerar_evidencia_final.ps1

Crie:

```text
scripts/02_gerar_evidencia_final.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$sql = Join-Path `
    $labRoot `
    "sql\07_checkpoint_final.sql"
$evidencia = Join-Path `
    $labRoot `
    "evidencias\relatorio-final-m12.txt"

$conteudo = Get-Content -Raw $sql

$resultado = $conteudo |
    docker exec -i $container `
        psql `
        -X `
        -v ON_ERROR_STOP=1 `
        -P pager=off `
        -P border=2 `
        -U formacao `
        -d $database

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao gerar evidência."
}

$resultado |
    Set-Content `
        -Encoding utf8 `
        -Path $evidencia

Write-Host "Evidência gerada em:"
Write-Host $evidencia
```

A evidência é local e reproduzível.

Não precisa ser versionada.

---

### 13. Criar 03_gerar_backup_final.ps1

Crie:

```text
scripts/03_gerar_backup_final.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$database = "formacao_java"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backupDir = Join-Path $labRoot "backups"
$backup = Join-Path `
    $backupDir `
    "m12_projeto_os_final.dump"
$hashFile = $backup + ".sha256"
$remote = "/tmp/m12_projeto_os_final.dump"

New-Item `
    -ItemType Directory `
    -Force `
    -Path $backupDir |
    Out-Null

Remove-Item `
    $backup `
    -Force `
    -ErrorAction SilentlyContinue

Remove-Item `
    $hashFile `
    -Force `
    -ErrorAction SilentlyContinue

docker exec $container `
    pg_dump `
    -U formacao `
    -d $database `
    --format=custom `
    --schema=projeto_os_final `
    --no-owner `
    --no-privileges `
    --file=$remote

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao gerar backup final."
}

docker exec $container `
    pg_restore `
    --list `
    $remote

if ($LASTEXITCODE -ne 0) {
    throw "Archive custom não pode ser listado."
}

docker cp `
    "${container}:$remote" `
    $backup

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao copiar backup para o host."
}

docker exec $container `
    rm -f $remote

$hash = Get-FileHash `
    -Path $backup `
    -Algorithm SHA256

(
    $hash.Hash.ToLower() +
    "  " +
    (Split-Path $backup -Leaf)
) |
Set-Content `
    -Encoding ascii `
    -Path $hashFile

Write-Host "Backup e SHA-256 gerados."
```

Execute:

```powershell
.\scripts\03_gerar_backup_final.ps1
```

---

### 14. Criar 04_testar_restore_final.ps1

Crie:

```text
scripts/04_testar_restore_final.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$container = "formacao-postgres-m12"
$databaseRestore = "formacao_java_m12_restore_check"
$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$backup = Join-Path `
    $labRoot `
    "backups\m12_projeto_os_final.dump"
$hashFile = $backup + ".sha256"
$remote = "/tmp/m12_projeto_os_final.dump"

if (-not (Test-Path $backup)) {
    throw "Backup final não encontrado."
}

if (-not (Test-Path $hashFile)) {
    throw "Hash do backup não encontrado."
}

$linhaHash = (
    Get-Content `
        $hashFile `
        -Raw
).Trim()

$hashEsperado = (
    $linhaHash -split "\s+", 2
)[0].ToLower()

$hashAtual = (
    Get-FileHash `
        $backup `
        -Algorithm SHA256
).Hash.ToLower()

if ($hashAtual -ne $hashEsperado) {
    throw "SHA-256 divergente."
}

docker cp `
    $backup `
    "${container}:$remote"

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao copiar backup ao container."
}

try {
    docker exec $container `
        dropdb `
        --if-exists `
        -U formacao `
        $databaseRestore

    docker exec $container `
        createdb `
        -U formacao `
        -T template0 `
        -E UTF8 `
        $databaseRestore

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao criar database de restore."
    }

    docker exec $container `
        pg_restore `
        -U formacao `
        -d $databaseRestore `
        --no-owner `
        --no-privileges `
        --exit-on-error `
        --jobs=2 `
        $remote

    if ($LASTEXITCODE -ne 0) {
        throw "Restore final falhou."
    }

    $validadores = @(
        "01_validar_objetos_finais.sql",
        "02_validar_contagens_finais.sql",
        "03_validar_metricas_finais.sql",
        "04_validar_integridade_final.sql"
    )

    foreach ($arquivo in $validadores) {
        $path = Join-Path `
            $labRoot `
            "sql\$arquivo"

        Get-Content -Raw $path |
            docker exec -i $container `
                psql `
                -X `
                -v ON_ERROR_STOP=1 `
                -P pager=off `
                -U formacao `
                -d $databaseRestore

        if ($LASTEXITCODE -ne 0) {
            throw "Restore inválido em $arquivo"
        }
    }

    Write-Host "Restore final validado."
}
finally {
    docker exec $container `
        dropdb `
        --if-exists `
        -U formacao `
        $databaseRestore

    docker exec $container `
        rm -f $remote
}
```

Esse script prova que:

- o arquivo confere com o hash;
- o archive restaura;
- tabelas e views existem;
- contagens conferem;
- métricas conferem;
- o projeto ativo não foi usado como destino.

Execute:

```powershell
.\scripts\04_testar_restore_final.ps1
```

---

### 15. Criar mapa-competencias-m12.md

Em:

```text
docs/mapa-competencias-m12.md
```

crie a tabela:

```text
Competência | Evidência | Nível | Aula de referência | Próxima ação
```

Preencha pelo menos estas linhas:

```text
Modelagem relacional;

Constraints;

Joins;

Agregações;

Prevenção de fan-out;

CTEs e views;

Índices;

EXPLAIN ANALYZE;

Transações;

Locks;

Paginação;

Migrations;

Flyway;

Backup e restore;

Roles;

Window functions;

JSONB;

Projeto final.
```

Use somente os níveis:

```text
DOMINO;

PRATICO_COM_REFERENCIA;

PRECISO_REFAZER.
```

---

### 16. Criar inventario-entregaveis.md

Em:

```text
docs/inventario-entregaveis.md
```

registre:

```text
Entregável | Local | Estado | Evidência | Dependência futura
```

Inclua:

- container PostgreSQL;
- database `formacao_java`;
- schema `projeto_os`;
- schema `projeto_os_final`;
- migrations V1 a V5;
- três views;
- seed final;
- simulado 309;
- backup final;
- evidência final;
- diário de bordo.

Estado permitido:

```text
VALIDADO;

PENDENTE_REVISAO;

NAO_APLICAVEL.
```

---

### 17. Criar retrospectiva-tecnica.md

Em:

```text
docs/retrospectiva-tecnica.md
```

responda:

1. Qual conceito mudou sua forma de pensar banco?
2. Qual erro apareceu mais de uma vez?
3. Onde você confundiu resultado correto com SQL que apenas executa?
4. Qual laboratório exigiu mais raciocínio?
5. Qual índice foi mais fácil de justificar?
6. Qual índice você decidiu não criar?
7. Como sua visão de transação mudou?
8. O que aprendeu sobre restore?
9. O que mudou na forma de usar JSONB?
10. Qual prática será mantida no M13?

Finalize com três decisões:

```text
continuar fazendo;

parar de fazer;

começar a fazer.
```

---

### 18. Criar plano-revisao-pos-m12.md

Em:

```text
docs/plano-revisao-pos-m12.md
```

crie:

```text
Tema | Evidência da lacuna | Aulas | Ação | Critério | Status
```

Exemplo completo:

```text
Tema:
EXPLAIN.

Evidência:
confundi Seq Scan com erro.

Aulas:
291 a 293.

Ação:
comparar três planos com massa maior.

Critério:
explicar estimativas, linhas reais e índice candidato.

Status:
PENDENTE.
```

Crie ações somente para lacunas reais encontradas no simulado.

---

### 19. Criar contrato-transicao-m13.md

Em:

```text
docs/contrato-transicao-m13.md
```

registre:

```text
database:
formacao_java.

schema:
projeto_os_final.

tabela inicial:
cliente.

view inicial:
vw_ordem_resumo_backend.

objetos preservados:
8 tabelas e 3 views.

credenciais:
somente configuração local.

SQL inicial:
SELECT current_database(), current_user.

consulta de leitura:
SELECT id, codigo, nome
FROM projeto_os_final.cliente
ORDER BY id.

regra:
usar nomes qualificados no início do M13.

regra:
não hardcodar senha.

regra:
não remover o schema antes do JDBC.
```

Não adicione dependência Java nem código JDBC nesta aula.

---

## Entendendo o que foi feito

### O projeto foi certificado por estado

A conclusão não dependeu de abrir manualmente cada tabela.

Validadores executáveis comprovaram objetos, contagens, métricas e integridade.

---

### A evidência pode ser regenerada

O relatório final não é um print isolado.

Ele pode ser produzido novamente pelo script.

---

### O backup foi realmente testado

O archive foi listado, copiado, validado por hash, restaurado e consultado.

O database temporário foi removido.

---

### Pendencias nao foram escondidas

O mapa de competências e o plano de revisão distinguem conclusão do módulo de domínio absoluto.

---

### A transicao possui contrato

O M13 começará com database, schema e consultas conhecidos.

Isso reduz dúvidas de ambiente quando JDBC for introduzido.

---

## Erros comuns importantes

### Apagar projeto_os_final

O próximo módulo pode reutilizá-lo.

Preserve schema e views.

### Versionar dump

Backup pode conter dados e crescer rapidamente.

Mantenha no `.gitignore`.

### Considerar hash como restore

Hash valida o arquivo, não a recuperação funcional.

Execute o restore.

### Marcar tudo como DOMINO

Isso elimina o valor do diagnóstico.

Use evidências.

### Comecar JDBC nesta aula

A aula 310 fecha SQL e prepara a transição.

A implementação começa na 311.

---

## Comandos uteis

### Validar ambiente

```powershell
.\scripts\01_validar_ambiente_final.ps1
```

### Gerar evidência

```powershell
.\scripts\02_gerar_evidencia_final.ps1
```

### Gerar backup

```powershell
.\scripts\03_gerar_backup_final.ps1
```

### Testar restore

```powershell
.\scripts\04_testar_restore_final.ps1
```

### Ver status do Git

```powershell
git status
```

---

## Exercicio guiado

O exercício principal é a certificação final do M12.

### Parte 1 — Reconstrucao mental

Sem consultar a documentação, desenhe:

```text
Cliente;

Produto;

Técnico;

Ordem;

Atividade;

Atividade–Técnico;

Pagamento;

Histórico.
```

Indique:

- granularidade;
- primary key;
- foreign keys;
- cardinalidades;
- regras locais;
- regras transacionais.

Depois compare com `docs/modelo-fisico.md` da aula 307.

---

### Parte 2 — Relatorio sem view

Sem usar `vw_ordem_resumo_backend`, escreva uma consulta com uma linha por Ordem contendo:

- quantidade de Atividades;
- total de mão de obra;
- total pago;
- total pendente;
- último status do Histórico.

Regras:

- pré-agregar cada filho;
- não usar soma depois de fan-out;
- desempatar Histórico por data e ID;
- incluir Ordens sem Pagamento.

Compare as seis linhas com a view.

---

### Parte 3 — Explicacao do plano

Escolha uma consulta do relatório.

Execute:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
```

Registre:

- granularidade;
- scan;
- join;
- sort;
- estimativas;
- linhas reais;
- índice candidato;
- decisão.

Não crie índice durante o fechamento.

---

### Parte 4 — Teste de integridade

Dentro de uma transação, tente:

- duplicar código de Cliente;
- inserir Pagamento negativo;
- concluir Ordem sem data;
- alocar o mesmo Técnico duas vezes.

Cada ação deve falhar.

Finalize com:

```sql
ROLLBACK;
```

---

### Parte 5 — Recuperacao

Execute:

```powershell
.\scripts\03_gerar_backup_final.ps1
.\scripts\04_testar_restore_final.ps1
```

Registre:

- tamanho do dump;
- SHA-256;
- resultado do restore;
- data;
- duração;
- qualquer warning.

---

### Parte 6 — Autoavaliacao

Use a pontuação da aula 309 e o mapa de competências.

Escolha três temas:

```text
um dominado;

um praticado com referência;

um que precisa ser refeito.
```

Para cada um, escreva uma evidência concreta.

---

### Parte 7 — Preparacao para M13

Execute:

```text
sql/06_smoke_contract_m13.sql
```

Confirme:

- database;
- usuário;
- timezone;
- leitura da tabela Cliente;
- leitura da Ordem;
- leitura da view.

Não escreva Java ainda.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade;
- o laboratório oficial da aula 310 existe;
- `projeto_os_final` foi preservado;
- as oito tabelas existem;
- as três views existem;
- contagens finais foram validadas;
- métricas finais foram validadas;
- valor previsto é 5200;
- mão de obra é 2960;
- parcelado é 4500;
- pago é 2700;
- pendente é 1800;
- saldo é 2500;
- divergências de Histórico são zero;
- registros órfãos são zero;
- constraints críticas existem;
- índices críticos existem;
- consultas de smoke para M13 foram executadas;
- mapa de competências foi preenchido;
- inventário de entregáveis foi preenchido;
- retrospectiva técnica foi escrita;
- plano de revisão possui ações concretas;
- contrato de transição ao M13 foi documentado;
- evidência final foi gerada;
- dump custom foi criado;
- SHA-256 foi gerado;
- archive foi listado;
- restore foi feito em database isolado;
- validadores foram executados no restore;
- database temporário foi removido;
- backup e evidências estão no `.gitignore`;
- nenhuma credencial foi versionada;
- nenhuma implementação JDBC foi antecipada;
- diário de bordo foi atualizado;
- commit recomendado pode ser realizado;
- ponte para a aula 311 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Confirme que não aparecem:

```text
backups/m12_projeto_os_final.dump;

arquivos .sha256;

evidencias/relatorio-final-m12.txt.
```

Adicione:

```powershell
git add `
  labs/m12/aula-310-fechamento-modulo-12-sql-postgresql
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "chore(m12): concluir modulo sql postgresql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
validação final;

competências;

inventário;

backup;

restore;

transição para JDBC.
```

---

## Fechamento e ponte para a proxima aula

O módulo M12 está encerrado.

Você percorreu a cadeia completa:

```text
requisito;

modelagem;

DDL;

integridade;

seed;

consulta;

relatório;

índice;

plano;

transação;

concorrência;

migration;

segurança;

backup;

restore.
```

O principal ganho não é a quantidade de comandos conhecidos.

É a capacidade de raciocinar sobre dados.

Antes de criar uma tabela, você pergunta pela granularidade.

Antes de criar uma foreign key, decide a política de exclusão.

Antes de somar, verifica fan-out.

Antes de criar índice, identifica a consulta.

Antes de confiar em backup, testa o restore.

Antes de usar JSONB, verifica se o dado é realmente documental.

Antes de conectar uma aplicação, separa credenciais e responsabilidades.

O projeto `projeto_os_final` representa essa evolução.

Ele será a base concreta para compreender persistência Java.

A próxima aula será:

```text
311 - M13.01 - JDBC visao geral e driver PostgreSQL
```

Nela, você iniciará o M13 — Persistência Java: JDBC, JPA, Hibernate e Spring Data.

O primeiro passo será entender:

- o papel do JDBC;
- a relação entre Java e driver;
- o protocolo com PostgreSQL;
- dependência do driver;
- URL de conexão;
- credenciais;
- carregamento do driver;
- responsabilidades do código;
- diferenças entre SQL executado manualmente e pela aplicação.

O banco deixará de ser acessado apenas pelo `psql`.

Java passará a abrir conexões e executar comandos.

A base de SQL construída no M12 permitirá enxergar o que acontece por baixo das abstrações.

---

# Material complementar

## Checkpoint final

- [ ] Validei objetos, contagens, métricas e integridade.
- [ ] Gereei a evidência final e testei o restore.
- [ ] Preenchi competências, inventário e plano de revisão.
- [ ] Preservei o projeto para JDBC e fiz o commit.

---

## Troubleshooting adicional

### projeto_os_final nao existe

Reconstrua as migrations V1 a V5 das aulas 307 e 308.

Não avance ao JDBC com o estado desconhecido.

### O restore falha ao criar objetos

Confirme que o database temporário foi criado com `template0`, que o dump usa `--no-owner` e que o usuário possui permissão para criar o schema.

### O hash diverge

O arquivo mudou depois da geração.

Crie um novo backup e um novo hash.

### A metrica diverge

Não altere o valor esperado sem investigar.

Compare seed, views e alterações do simulado.

### O arquivo de backup aparece no Git

Revise o `.gitignore` e remova-o do staging antes do commit.

---

## Perguntas de revisao

1. Quantas aulas formaram o M12?
2. Qual é o principal schema final?
3. Quantas tabelas ele possui?
4. Quantas views de backend existem?
5. O que comprova uma competência?
6. Qual a diferença entre concluir e dominar?
7. O que o mapa de competências registra?
8. Para que serve o inventário?
9. Por que a retrospectiva é técnica?
10. Como uma pendência deve ser escrita?
11. Por que preservar o schema?
12. Qual formato de backup foi usado?
13. O hash comprova o restore?
14. Onde o restore foi testado?
15. O database temporário permanece?
16. O que será reutilizado no M13?
17. Credenciais podem entrar no Git?
18. JDBC foi implementado nesta aula?
19. Qual é o próximo módulo?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Quarenta.
2. `projeto_os_final`.
3. Oito.
4. Três.
5. Uma evidência reproduzível.
6. Concluir é possuir base funcional; dominar exige autonomia maior.
7. Nível, evidência e próxima ação.
8. Localizar entregáveis e dependências.
9. Registra padrões de decisão e erro.
10. Com ação e critério verificável.
11. JDBC poderá reutilizá-lo.
12. Custom.
13. Não.
14. Em database isolado.
15. Não.
16. Database, schema, tabelas, views e seed.
17. Não.
18. Não.
19. Persistência Java.
20. JDBC visão geral e driver PostgreSQL.

---

## Desafio opcional

Crie um documento:

```text
docs/arquitetura-persistencia-inicial.md
```

Sem escrever Java, descreva o fluxo futuro:

```text
aplicação;

driver JDBC;

conexão;

PostgreSQL;

transação;

resultado;

mapeamento para objeto.
```

Para cada etapa, registre:

- responsabilidade;
- entrada;
- saída;
- erro possível;
- evidência;
- recurso que precisa ser fechado.

Não use JPA ou Hibernate ainda.

O objetivo é preparar perguntas para a aula 311, não antecipar a implementação.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 310 - M12.40 - Fechamento do Modulo 12 SQL PostgreSQL

- Concluí as quarenta aulas do módulo M12.
- Consolidei SQL, PostgreSQL e modelagem relacional.
- Validei as oito tabelas de `projeto_os_final`.
- Validei as três views de backend.
- Confirmei contagens, métricas e integridade.
- Confirmei zero divergências entre status e Histórico.
- Inspecionei constraints e índices críticos.
- Executei consultas de smoke para a transição ao M13.
- Criei um mapa de competências com evidências.
- Organizei o inventário dos entregáveis.
- Registrei minha retrospectiva técnica.
- Criei um plano de revisão com ações verificáveis.
- Documentei o contrato de transição para JDBC.
- Gerei uma evidência final reproduzível.
- Gerei backup custom de `projeto_os_final`.
- Calculei SHA-256 do backup.
- Listei o conteúdo do archive.
- Restaurei o projeto em database isolado.
- Validei objetos, contagens e métricas após o restore.
- Removi o database temporário de recuperação.
- Mantive backups e evidências fora do Git.
- Preservei o projeto final para o próximo módulo.
- Próxima aula: JDBC visão geral e driver PostgreSQL.
```

---

## Referencia tecnica curta

```text
Competência:
capacidade comprovada.

Evidência:
resultado reproduzível.

Inventário:
mapa dos entregáveis.

Retrospectiva:
padrões de decisão e erro.

Plano de revisão:
ação com critério.

Backup:
arquivo protegido.

Restore:
recuperação validada.

Baseline:
estado conhecido para o próximo módulo.

M13:
persistência Java.
```

Regra final:

```text
um modulo termina de forma profissional quando seu conhecimento esta demonstrado, seus artefatos estao organizados, suas pendencias estao registradas e a proxima etapa recebe uma base validada.
```
