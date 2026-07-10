# 297 - M12.27 - Modelagem OS cliente atividade produto e pagamento

## Apresentacao da aula

Nas aulas anteriores do M12, você construiu uma base completa para trabalhar com PostgreSQL:

```text
DDL e DML;
constraints;
joins;
agregações;
subqueries;
CTEs;
views;
índices;
planos de execução;
transações;
isolamento;
locks;
paginação.
```

Agora esses conhecimentos serão reunidos em uma modelagem de domínio integrada.

O contexto será um sistema de assistência técnica com cinco entidades centrais:

```text
Cliente;
Produto;
Ordem de Serviço;
Atividade;
Pagamento.
```

O problema não será tratado como cinco tabelas independentes.

Você precisará decidir:

- o que cada entidade representa;
- qual é a granularidade de cada linha;
- quais relacionamentos existem;
- quais cardinalidades são obrigatórias;
- quais regras pertencem a constraints;
- quais regras dependem de várias linhas;
- como preservar histórico;
- como permitir pagamentos parciais ou parcelados;
- como impedir duplicidades;
- quais índices atendem consultas reais;
- como preparar o modelo para relatórios de backend.

As tabelas acumuladas no schema `app` continuarão preservadas.

Para consolidar o modelo sem misturar estruturas didáticas anteriores, esta aula criará um schema próprio:

```text
projeto_os
```

Dentro dele serão criadas:

```text
projeto_os.cliente;
projeto_os.produto;
projeto_os.ordem_servico;
projeto_os.atividade;
projeto_os.pagamento.
```

Esse schema permanecerá no banco ao final da aula.

A próxima aula, **298 — Consultas de relatório para backend**, consultará exatamente esse modelo.

O laboratório terá documentação conceitual, modelo lógico, dicionário de dados, DDL, seed, validações e exercícios.

A intenção não é produzir o modelo definitivo de toda empresa.

O objetivo é construir uma versão coerente, normalizada e pronta para evoluir.

Ao final, você deverá conseguir justificar cada tabela, relacionamento, constraint, índice e decisão de histórico do modelo.

---

## Onde estamos na formacao

A sequência atual do módulo é:

```text
296:
paginação SQL com OFFSET e keyset.

297:
modelagem de Cliente, Produto, Ordem, Atividade e Pagamento.

298:
consultas de relatório para backend.

299:
performance SQL aplicada.

300:
scripts versionados e conceito de migração.
```

Nas aulas 281, 282 e 283 você separou:

```text
modelo conceitual;
modelo lógico;
modelo físico;
normalização.
```

Nas aulas 284 e 285 você implementou:

```text
relacionamento um para muitos;
relacionamento muitos para muitos;
tabelas associativas.
```

Agora a atividade será mais próxima de uma demanda real.

Você receberá regras do domínio e precisará transformá-las em:

```text
entidades;
atributos;
chaves;
foreign keys;
restrições;
índices;
dados de teste.
```

A próxima aula não deve precisar adivinhar o significado das colunas.

Por isso, a documentação do modelo faz parte do laboratório, não é um anexo opcional.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-297-modelagem-os-cliente-atividade-produto-pagamento
```

Estrutura final:

```text
labs
└── m12
    └── aula-297-modelagem-os-cliente-atividade-produto-pagamento
        ├── README.md
        ├── docs
        │   ├── modelo-conceitual.md
        │   ├── modelo-logico.md
        │   ├── dicionario-dados.md
        │   └── regras-nao-garantidas-por-check.md
        └── sql
            ├── 00_verificar_contexto.sql
            ├── 01_limpar_modelo_anterior.sql
            ├── 02_criar_schema_e_tabelas.sql
            ├── 03_criar_indices.sql
            ├── 04_inserir_seed.sql
            ├── 05_validar_cardinalidades.sql
            ├── 06_validar_integridade.sql
            ├── 07_erros_controlados.sql
            ├── 08_consultas_integradas.sql
            ├── 09_exercicio.sql
            └── 10_checkpoint_final.sql
```

O laboratório deverá deixar no banco:

```text
3 clientes;
3 produtos;
4 ordens;
7 atividades;
5 pagamentos.
```

IDs reservados:

```text
Cliente e Produto:
990001 a 990099.

Ordem:
991001 a 991099.

Atividade:
992001 a 992199.

Pagamento:
993001 a 993199.

Exercício:
994000 em diante.
```

O modelo será persistente porque a aula 298 dependerá dele.

Não execute a limpeza depois de concluir esta aula.

---

## Conceito essencial

### Granularidade das entidades

Antes de criar qualquer coluna, declare o que cada linha representa.

#### Cliente

```text
uma linha representa uma pessoa jurídica ou pessoa física atendida pelo sistema.
```

#### Produto

```text
uma linha representa um produto cadastrado e identificável pelo código.
```

#### Ordem de Serviço

```text
uma linha representa uma solicitação de atendimento para um Cliente e um Produto.
```

#### Atividade

```text
uma linha representa uma etapa de trabalho pertencente a uma Ordem.
```

#### Pagamento

```text
uma linha representa uma parcela ou obrigação financeira vinculada a uma Ordem.
```

A granularidade do Pagamento é importante.

Se uma linha representasse “a situação financeira inteira da Ordem”, pagamentos parciais, parcelamento e estorno seriam difíceis de modelar.

Com uma linha por parcela, a Ordem pode possuir várias obrigações financeiras.

---

### Relacionamentos

O modelo conceitual será:

```text
Cliente 1:N Ordem de Serviço;

Produto 1:N Ordem de Serviço;

Ordem de Serviço 1:N Atividade;

Ordem de Serviço 0:N Pagamento.
```

Um Cliente pode existir antes de possuir Ordens.

Um Produto pode existir sem ter sido usado.

Uma Ordem pertence a exatamente um Cliente e um Produto.

Uma Atividade pertence a exatamente uma Ordem.

Um Pagamento pertence a exatamente uma Ordem.

Conceitualmente, a Ordem deve possuir pelo menos uma Atividade para representar um atendimento executável.

Fisicamente, uma foreign key não consegue obrigar o pai a possuir um filho.

Durante a criação da unidade, pode existir um instante entre:

```text
INSERT da Ordem;

INSERT das Atividades.
```

Essa invariante será garantida pela transação da camada de serviço:

```text
criar Ordem e Atividades;
confirmar tudo;
ou executar rollback.
```

---

### Cliente separado da Ordem

Não coloque todos os dados do Cliente dentro de cada Ordem.

Isso produziria repetição:

```text
nome;
documento;
email;
status.
```

Problemas:

- alteração duplicada;
- inconsistência entre Ordens;
- desperdício;
- dificuldade para identificar o Cliente.

A Ordem guarda:

```text
cliente_id.
```

O Cliente permanece uma entidade independente.

---

### Produto separado da Ordem

A Ordem referencia um Produto cadastrado.

Entretanto, existe uma diferença entre:

```text
valor de referência atual do Produto;

valor previsto ou negociado na Ordem.
```

Por isso, o modelo terá:

```text
produto.valor_referencia;

ordem_servico.valor_previsto.
```

A alteração do preço atual do Produto não deve reescrever automaticamente o valor acordado na Ordem.

Se o sistema precisar preservar nome, descrição ou versão técnica exatamente como estavam na contratação, uma evolução possível será:

- versionamento do Produto;
- tabela de item da Ordem;
- colunas de snapshot;
- catálogo histórico.

Nesta aula, será armazenado somente o valor específico da Ordem.

---

### Ordem como centro do fluxo

A Ordem conecta:

```text
Cliente;
Produto;
Atividades;
Pagamentos.
```

Ela possui informações próprias:

```text
código;
status;
prioridade;
descrição do problema;
data agendada;
momento de abertura;
momento de conclusão;
valor previsto.
```

Não armazene na Ordem:

```text
quantidade de Atividades;

total pago;

saldo pendente.
```

Esses valores são derivados.

Armazená-los sem mecanismo de consistência poderia produzir divergência.

A aula 298 calculará os totais por consulta.

---

### Atividade como filha da Ordem

A Atividade representa o trabalho executado.

A chave de negócio local será:

```text
ordem_servico_id + codigo.
```

Isso permite:

```text
DIAGNOSTICO na Ordem 1;

DIAGNOSTICO na Ordem 2.
```

E impede duas atividades com o mesmo código dentro da mesma Ordem.

O ID continuará como primary key técnica.

---

### Pagamento um para muitos

Não modele:

```text
ordem_servico.pagamento_id.
```

Isso limitaria cada Ordem a um único Pagamento.

O relacionamento correto é:

```text
pagamento.ordem_servico_id.
```

A tabela filha guarda a foreign key.

A chave alternativa:

```text
ordem_servico_id + parcela
```

impede duas parcelas com o mesmo número na mesma Ordem.

Uma referência externa unique também permite identificar o pagamento em integração financeira.

---

### Status como texto com CHECK

O modelo usará `text` com `CHECK`.

Exemplo:

```text
ABERTA;
AGENDADA;
EM_ATENDIMENTO;
CONCLUIDA;
CANCELADA.
```

Vantagens didáticas:

- DDL visível;
- validação no banco;
- leitura simples;
- sem dependência de tabela de domínio.

Alternativas reais:

- enum do PostgreSQL;
- tabela de status;
- código numérico;
- máquina de estados na aplicação.

O `CHECK` garante valores permitidos.

Ele não garante toda transição possível.

Exemplo:

```text
ABERTA -> CONCLUIDA
```

pode ser proibida pela regra, mas o `CHECK` isolado não conhece o estado anterior.

---

### Regras de tempo

A Atividade terá:

```text
inicio_real;
fim_real.
```

Constraint:

```text
fim_real é nulo
ou
inicio_real existe e fim_real >= inicio_real.
```

Atividade `CONCLUIDA` deverá possuir `fim_real`.

A Ordem `CONCLUIDA` deverá possuir `concluida_em`.

Essas regras são locais à própria linha e podem ser protegidas por `CHECK`.

---

### Regras financeiras

Pagamento terá:

```text
valor > 0;

vencimento obrigatório;

status permitido;

pago_em compatível com status.
```

Estados:

```text
PENDENTE;
PAGO;
CANCELADO;
ESTORNADO.
```

Para:

```text
PAGO;
ESTORNADO;
```

`pago_em` deve existir.

Para:

```text
PENDENTE;
CANCELADO;
```

`pago_em` deve ser nulo.

Essa decisão é simplificada.

Em um sistema completo, estorno poderia possuir:

```text
pago_em;
estornado_em;
motivo;
transação de estorno.
```

---

### Regras entre varias linhas

Um `CHECK` não deve consultar outras linhas ou tabelas para garantir invariantes agregadas.

Regras como:

```text
soma dos pagamentos não pode superar o valor previsto;

Ordem só pode concluir quando todas as Atividades terminarem;

Pagamento só pode ser criado para Cliente ativo;

ao menos uma Atividade deve existir;
```

dependem de várias linhas ou entidades.

Elas podem ser garantidas por:

- transação na camada de serviço;
- trigger cuidadosamente projetada;
- procedure;
- modelo alternativo;
- processamento assíncrono com reconciliação.

Nesta aula, elas serão documentadas e validadas por consultas, mas não escondidas em constraints inadequadas.

---

### Integridade referencial e exclusao

As foreign keys usarão:

```text
ON UPDATE RESTRICT;

ON DELETE RESTRICT.
```

Isso evita remover:

- Cliente com Ordem;
- Produto usado em Ordem;
- Ordem com Atividades;
- Ordem com Pagamentos.

Em domínio histórico, apagar em cascata pode destruir evidências financeiras e operacionais.

A estratégia preferida será:

```text
inativar Cliente ou Produto;

cancelar Ordem;

cancelar Pagamento;
```

Não usar exclusão física como rotina.

---

### Normalizacao

O modelo atende às três primeiras formas normais em seu escopo.

#### Primeira forma normal

Cada coluna guarda valor atômico.

Não existe:

```text
atividade_1;
atividade_2;
atividade_3;
```

#### Segunda forma normal

Atributos dependem da chave completa.

Em Pagamento, dados da parcela pertencem à linha identificada, não apenas à Ordem.

#### Terceira forma normal

Dados do Cliente e Produto não são copiados como dependências transitivas na Ordem.

O valor previsto permanece na Ordem porque é um fato próprio da contratação, não uma cópia obrigatória do preço atual.

---

### Indices orientados a consultas

Constraints já criam índices para:

```text
primary keys;

unique.
```

Serão adicionados índices para padrões esperados:

```text
Ordens por Cliente e status;

Ordens por Produto e status;

Atividades por Ordem e status;

Pagamentos por Ordem e status;

Pagamentos pendentes por vencimento.
```

Índices não serão criados para toda coluna.

A aula 298 usará essas estruturas em relatórios.

---

## Mao na massa guiada

### 1. Confirmar o ambiente

Na raiz:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Confirme:

```text
container:
formacao-postgres-m12.

database:
formacao_java.
```

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-297-modelagem-os-cliente-atividade-produto-pagamento\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-297-modelagem-os-cliente-atividade-produto-pagamento\docs"

Set-Location `
  "labs\m12\aula-297-modelagem-os-cliente-atividade-produto-pagamento"
```

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
    version() AS versao;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_modelo;

SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema = 'projeto_os'
ORDER BY table_name;
```

Na primeira execução, o schema pode não existir.

---

### 4. Criar 01_limpar_modelo_anterior.sql

Crie:

```text
sql/01_limpar_modelo_anterior.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS projeto_os.pagamento;
DROP TABLE IF EXISTS projeto_os.atividade;
DROP TABLE IF EXISTS projeto_os.ordem_servico;
DROP TABLE IF EXISTS projeto_os.produto;
DROP TABLE IF EXISTS projeto_os.cliente;
```

A ordem respeita as dependências.

Não use `CASCADE`.

Se a aula 298 já tiver criado objetos dependentes, a remoção deverá falhar e exigir análise, evitando apagar relatórios silenciosamente.

Execute este arquivo apenas antes de reconstruir a aula 297.

---

### 5. Criar 02_criar_schema_e_tabelas.sql

Crie:

```text
sql/02_criar_schema_e_tabelas.sql
```

Conteúdo:

```sql
CREATE SCHEMA IF NOT EXISTS projeto_os;

CREATE TABLE projeto_os.cliente (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL,
    nome text NOT NULL,
    documento text NOT NULL,
    email text,
    ativo boolean NOT NULL DEFAULT true,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_projeto_cliente
        PRIMARY KEY (id),

    CONSTRAINT uq_projeto_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT uq_projeto_cliente_documento
        UNIQUE (documento),

    CONSTRAINT ck_projeto_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_projeto_cliente_nome
        CHECK (btrim(nome) <> ''),

    CONSTRAINT ck_projeto_cliente_documento
        CHECK (btrim(documento) <> ''),

    CONSTRAINT ck_projeto_cliente_email
        CHECK (
            email IS NULL
            OR position('@' in email) > 1
        )
);

CREATE TABLE projeto_os.produto (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL,
    nome text NOT NULL,
    descricao text,
    valor_referencia numeric(12, 2) NOT NULL,
    ativo boolean NOT NULL DEFAULT true,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_projeto_produto
        PRIMARY KEY (id),

    CONSTRAINT uq_projeto_produto_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_projeto_produto_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_projeto_produto_nome
        CHECK (btrim(nome) <> ''),

    CONSTRAINT ck_projeto_produto_valor
        CHECK (valor_referencia >= 0),

    CONSTRAINT ck_projeto_produto_descricao
        CHECK (
            descricao IS NULL
            OR btrim(descricao) <> ''
        )
);

CREATE TABLE projeto_os.ordem_servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL,
    cliente_id bigint NOT NULL,
    produto_id bigint NOT NULL,
    status text NOT NULL DEFAULT 'ABERTA',
    prioridade text NOT NULL DEFAULT 'NORMAL',
    descricao_problema text NOT NULL,
    data_agendada date,
    aberta_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    concluida_em timestamptz,
    valor_previsto numeric(12, 2) NOT NULL DEFAULT 0,

    CONSTRAINT pk_projeto_ordem_servico
        PRIMARY KEY (id),

    CONSTRAINT uq_projeto_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT fk_projeto_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES projeto_os.cliente (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT fk_projeto_ordem_produto
        FOREIGN KEY (produto_id)
        REFERENCES projeto_os.produto (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT ck_projeto_ordem_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_projeto_ordem_descricao
        CHECK (btrim(descricao_problema) <> ''),

    CONSTRAINT ck_projeto_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_projeto_ordem_prioridade
        CHECK (
            prioridade IN (
                'BAIXA',
                'NORMAL',
                'ALTA',
                'CRITICA'
            )
        ),

    CONSTRAINT ck_projeto_ordem_valor
        CHECK (valor_previsto >= 0),

    CONSTRAINT ck_projeto_ordem_conclusao
        CHECK (
            (
                status = 'CONCLUIDA'
                AND concluida_em IS NOT NULL
            )
            OR
            (
                status <> 'CONCLUIDA'
                AND concluida_em IS NULL
            )
        )
);

CREATE TABLE projeto_os.atividade (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    ordem_servico_id bigint NOT NULL,
    codigo text NOT NULL,
    descricao text NOT NULL,
    status text NOT NULL DEFAULT 'PENDENTE',
    valor_mao_obra numeric(12, 2) NOT NULL DEFAULT 0,
    duracao_prevista interval NOT NULL,
    inicio_real timestamptz,
    fim_real timestamptz,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_projeto_atividade
        PRIMARY KEY (id),

    CONSTRAINT fk_projeto_atividade_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES projeto_os.ordem_servico (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT uq_projeto_atividade_ordem_codigo
        UNIQUE (
            ordem_servico_id,
            codigo
        ),

    CONSTRAINT ck_projeto_atividade_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_projeto_atividade_descricao
        CHECK (btrim(descricao) <> ''),

    CONSTRAINT ck_projeto_atividade_status
        CHECK (
            status IN (
                'PENDENTE',
                'AGENDADA',
                'EM_EXECUCAO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_projeto_atividade_valor
        CHECK (valor_mao_obra >= 0),

    CONSTRAINT ck_projeto_atividade_duracao
        CHECK (
            duracao_prevista > INTERVAL '0'
        ),

    CONSTRAINT ck_projeto_atividade_periodo
        CHECK (
            fim_real IS NULL
            OR (
                inicio_real IS NOT NULL
                AND fim_real >= inicio_real
            )
        ),

    CONSTRAINT ck_projeto_atividade_conclusao
        CHECK (
            status <> 'CONCLUIDA'
            OR fim_real IS NOT NULL
        )
);

CREATE TABLE projeto_os.pagamento (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    ordem_servico_id bigint NOT NULL,
    referencia text NOT NULL,
    parcela smallint NOT NULL DEFAULT 1,
    forma text NOT NULL,
    status text NOT NULL DEFAULT 'PENDENTE',
    valor numeric(12, 2) NOT NULL,
    vencimento date NOT NULL,
    pago_em timestamptz,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_projeto_pagamento
        PRIMARY KEY (id),

    CONSTRAINT fk_projeto_pagamento_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES projeto_os.ordem_servico (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT uq_projeto_pagamento_referencia
        UNIQUE (referencia),

    CONSTRAINT uq_projeto_pagamento_parcela
        UNIQUE (
            ordem_servico_id,
            parcela
        ),

    CONSTRAINT ck_projeto_pagamento_referencia
        CHECK (btrim(referencia) <> ''),

    CONSTRAINT ck_projeto_pagamento_parcela
        CHECK (parcela > 0),

    CONSTRAINT ck_projeto_pagamento_forma
        CHECK (
            forma IN (
                'PIX',
                'BOLETO',
                'CARTAO',
                'TRANSFERENCIA'
            )
        ),

    CONSTRAINT ck_projeto_pagamento_status
        CHECK (
            status IN (
                'PENDENTE',
                'PAGO',
                'CANCELADO',
                'ESTORNADO'
            )
        ),

    CONSTRAINT ck_projeto_pagamento_valor
        CHECK (valor > 0),

    CONSTRAINT ck_projeto_pagamento_data_status
        CHECK (
            (
                status IN (
                    'PAGO',
                    'ESTORNADO'
                )
                AND pago_em IS NOT NULL
            )
            OR
            (
                status IN (
                    'PENDENTE',
                    'CANCELADO'
                )
                AND pago_em IS NULL
            )
        )
);
```

Execute com:

```powershell
Get-Content -Raw `
  "labs\m12\aula-297-modelagem-os-cliente-atividade-produto-pagamento\sql\02_criar_schema_e_tabelas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

### 6. Criar 03_criar_indices.sql

Crie:

```text
sql/03_criar_indices.sql
```

Conteúdo:

```sql
CREATE INDEX idx_projeto_ordem_cliente_status
ON projeto_os.ordem_servico (
    cliente_id,
    status,
    aberta_em DESC,
    id DESC
);

CREATE INDEX idx_projeto_ordem_produto_status
ON projeto_os.ordem_servico (
    produto_id,
    status
);

CREATE INDEX idx_projeto_atividade_ordem_status
ON projeto_os.atividade (
    ordem_servico_id,
    status,
    id
);

CREATE INDEX idx_projeto_pagamento_ordem_status
ON projeto_os.pagamento (
    ordem_servico_id,
    status,
    parcela
);

CREATE INDEX idx_projeto_pagamento_status_vencimento
ON projeto_os.pagamento (
    status,
    vencimento,
    id
);
```

Não crie índices adicionais para:

```text
cliente.ativo;
produto.ativo;
pagamento.forma.
```

Essas colunas possuem poucos valores distintos e ainda não existe consulta que justifique índice isolado.

---

### 7. Criar 04_inserir_seed.sql

Crie:

```text
sql/04_inserir_seed.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO projeto_os.cliente (
    id,
    codigo,
    nome,
    documento,
    email
)
VALUES
    (
        990001,
        'CLI-HORIZONTE',
        'Mercado Horizonte',
        '99000000000001',
        'contato@horizonte.local'
    ),
    (
        990002,
        'CLI-VIDA',
        'Hospital Vida',
        '99000000000002',
        'infra@hospitalvida.local'
    ),
    (
        990003,
        'CLI-FUTURO',
        'Escola Futuro',
        '99000000000003',
        NULL
    );

INSERT INTO projeto_os.produto (
    id,
    codigo,
    nome,
    descricao,
    valor_referencia
)
VALUES
    (
        990001,
        'AR-12000',
        'Ar-condicionado 12000 BTU',
        'Equipamento residencial',
        2200.00
    ),
    (
        990002,
        'REFRIG-500',
        'Refrigerador 500 litros',
        'Equipamento comercial',
        4900.00
    ),
    (
        990003,
        'LAVA-15',
        'Lavadora 15 kg',
        'Equipamento de lavanderia',
        3300.00
    );

INSERT INTO projeto_os.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    prioridade,
    descricao_problema,
    data_agendada,
    aberta_em,
    concluida_em,
    valor_previsto
)
VALUES
    (
        991001,
        'OS-PROJ-001',
        990001,
        990001,
        'CONCLUIDA',
        'NORMAL',
        'Equipamento não resfria',
        DATE '2026-07-01',
        TIMESTAMPTZ '2026-06-28 09:00:00-03',
        TIMESTAMPTZ '2026-07-01 15:00:00-03',
        500.00
    ),
    (
        991002,
        'OS-PROJ-002',
        990002,
        990002,
        'EM_ATENDIMENTO',
        'CRITICA',
        'Temperatura interna acima do limite',
        DATE '2026-07-12',
        TIMESTAMPTZ '2026-07-10 08:00:00-03',
        NULL,
        900.00
    ),
    (
        991003,
        'OS-PROJ-003',
        990003,
        990003,
        'AGENDADA',
        'NORMAL',
        'Equipamento apresenta ruído',
        DATE '2026-07-20',
        TIMESTAMPTZ '2026-07-11 10:00:00-03',
        NULL,
        350.00
    ),
    (
        991004,
        'OS-PROJ-004',
        990001,
        990002,
        'CANCELADA',
        'BAIXA',
        'Solicitação cancelada pelo cliente',
        NULL,
        TIMESTAMPTZ '2026-07-05 14:00:00-03',
        NULL,
        0.00
    );

INSERT INTO projeto_os.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista,
    inicio_real,
    fim_real
)
VALUES
    (
        992001,
        991001,
        'DIAGNOSTICO',
        'Diagnosticar circuito de refrigeração',
        'CONCLUIDA',
        100.00,
        INTERVAL '1 hour',
        TIMESTAMPTZ '2026-07-01 09:00:00-03',
        TIMESTAMPTZ '2026-07-01 10:00:00-03'
    ),
    (
        992002,
        991001,
        'REPARO',
        'Executar reparo e teste final',
        'CONCLUIDA',
        250.00,
        INTERVAL '3 hours',
        TIMESTAMPTZ '2026-07-01 10:30:00-03',
        TIMESTAMPTZ '2026-07-01 14:30:00-03'
    ),
    (
        992003,
        991002,
        'VISTORIA',
        'Verificar temperatura e vedação',
        'EM_EXECUCAO',
        180.00,
        INTERVAL '2 hours',
        TIMESTAMPTZ '2026-07-12 08:30:00-03',
        NULL
    ),
    (
        992004,
        991002,
        'SUBSTITUICAO',
        'Substituir componente após diagnóstico',
        'PENDENTE',
        500.00,
        INTERVAL '4 hours',
        NULL,
        NULL
    ),
    (
        992005,
        991003,
        'CONTATO',
        'Confirmar acesso ao local',
        'AGENDADA',
        50.00,
        INTERVAL '30 minutes',
        NULL,
        NULL
    ),
    (
        992006,
        991003,
        'DIAGNOSTICO',
        'Diagnosticar origem do ruído',
        'AGENDADA',
        100.00,
        INTERVAL '90 minutes',
        NULL,
        NULL
    ),
    (
        992007,
        991004,
        'VISITA',
        'Visita cancelada com a Ordem',
        'CANCELADA',
        0.00,
        INTERVAL '1 hour',
        NULL,
        NULL
    );

INSERT INTO projeto_os.pagamento (
    id,
    ordem_servico_id,
    referencia,
    parcela,
    forma,
    status,
    valor,
    vencimento,
    pago_em
)
VALUES
    (
        993001,
        991001,
        'PAG-PROJ-001-1',
        1,
        'PIX',
        'PAGO',
        250.00,
        DATE '2026-07-01',
        TIMESTAMPTZ '2026-07-01 08:00:00-03'
    ),
    (
        993002,
        991001,
        'PAG-PROJ-001-2',
        2,
        'CARTAO',
        'PAGO',
        250.00,
        DATE '2026-07-05',
        TIMESTAMPTZ '2026-07-04 18:00:00-03'
    ),
    (
        993003,
        991002,
        'PAG-PROJ-002-1',
        1,
        'TRANSFERENCIA',
        'PAGO',
        450.00,
        DATE '2026-07-12',
        TIMESTAMPTZ '2026-07-12 07:30:00-03'
    ),
    (
        993004,
        991002,
        'PAG-PROJ-002-2',
        2,
        'BOLETO',
        'PENDENTE',
        450.00,
        DATE '2026-07-25',
        NULL
    ),
    (
        993005,
        991003,
        'PAG-PROJ-003-1',
        1,
        'PIX',
        'PENDENTE',
        350.00,
        DATE '2026-07-20',
        NULL
    );

COMMIT;
```

A Ordem `991004` não possui Pagamento.

Isso demonstra a cardinalidade física:

```text
Ordem 0:N Pagamento.
```

---

### 8. Criar 05_validar_cardinalidades.sql

Crie:

```text
sql/05_validar_cardinalidades.sql
```

Conteúdo:

```sql
SELECT
    cliente.id,
    cliente.nome,
    count(ordem.id) AS quantidade_ordens
FROM projeto_os.cliente AS cliente
LEFT JOIN projeto_os.ordem_servico AS ordem
    ON ordem.cliente_id = cliente.id
GROUP BY
    cliente.id,
    cliente.nome
ORDER BY cliente.id;

SELECT
    produto.id,
    produto.nome,
    count(ordem.id) AS quantidade_ordens
FROM projeto_os.produto AS produto
LEFT JOIN projeto_os.ordem_servico AS ordem
    ON ordem.produto_id = produto.id
GROUP BY
    produto.id,
    produto.nome
ORDER BY produto.id;

SELECT
    ordem.id,
    ordem.codigo,
    count(DISTINCT atividade.id) AS atividades,
    count(DISTINCT pagamento.id) AS pagamentos
FROM projeto_os.ordem_servico AS ordem
LEFT JOIN projeto_os.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
LEFT JOIN projeto_os.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
GROUP BY
    ordem.id,
    ordem.codigo
ORDER BY ordem.id;
```

O uso de `COUNT(DISTINCT ...)` evita multiplicação causada por duas relações filhas na mesma consulta.

Na aula 298, você usará agregações prévias em CTEs para relatórios mais completos.

---

### 9. Criar 06_validar_integridade.sql

Crie:

```text
sql/06_validar_integridade.sql
```

Conteúdo:

```sql
SELECT
    table_schema,
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'projeto_os'
ORDER BY
    table_name,
    constraint_type,
    constraint_name;

SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'projeto_os'
ORDER BY
    tablename,
    indexname;

SELECT
    ordem.id,
    ordem.codigo,
    ordem.valor_previsto,
    coalesce(
        sum(
            pagamento.valor
        ) FILTER (
            WHERE pagamento.status IN (
                'PAGO',
                'PENDENTE'
            )
        ),
        0
    ) AS valor_financeiro_ativo
FROM projeto_os.ordem_servico AS ordem
LEFT JOIN projeto_os.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
GROUP BY
    ordem.id,
    ordem.codigo,
    ordem.valor_previsto
ORDER BY ordem.id;

SELECT
    ordem.id,
    ordem.codigo
FROM projeto_os.ordem_servico AS ordem
WHERE NOT EXISTS (
    SELECT 1
    FROM projeto_os.atividade AS atividade
    WHERE atividade.ordem_servico_id = ordem.id
);
```

A última consulta deve retornar zero linhas no seed.

Ela valida uma regra que a foreign key não garante no sentido pai para filho.

---

### 10. Criar 07_erros_controlados.sql

Crie:

```text
sql/07_erros_controlados.sql
```

Conteúdo:

```sql
-- Execute um cenário por vez no psql.
-- Depois de cada erro, execute ROLLBACK.

-- 1. Documento duplicado.
BEGIN;

INSERT INTO projeto_os.cliente (
    id,
    codigo,
    nome,
    documento
)
VALUES (
    994001,
    'CLI-DUPLICADO',
    'Cliente duplicado',
    '99000000000001'
);

ROLLBACK;

-- 2. Ordem com Cliente inexistente.
BEGIN;

INSERT INTO projeto_os.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    descricao_problema
)
VALUES (
    994010,
    'OS-FK-INVALIDA',
    999999,
    990001,
    'Deve falhar por foreign key'
);

ROLLBACK;

-- 3. Código de Atividade duplicado na mesma Ordem.
BEGIN;

INSERT INTO projeto_os.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    duracao_prevista
)
VALUES (
    994020,
    991001,
    'DIAGNOSTICO',
    'Código já existente nesta Ordem',
    INTERVAL '1 hour'
);

ROLLBACK;

-- 4. Pagamento PAGO sem data.
BEGIN;

INSERT INTO projeto_os.pagamento (
    id,
    ordem_servico_id,
    referencia,
    parcela,
    forma,
    status,
    valor,
    vencimento,
    pago_em
)
VALUES (
    994030,
    991003,
    'PAG-INVALIDO-DATA',
    2,
    'PIX',
    'PAGO',
    100.00,
    DATE '2026-07-30',
    NULL
);

ROLLBACK;

-- 5. Parcela repetida na Ordem.
BEGIN;

INSERT INTO projeto_os.pagamento (
    id,
    ordem_servico_id,
    referencia,
    parcela,
    forma,
    status,
    valor,
    vencimento
)
VALUES (
    994031,
    991003,
    'PAG-PARCELA-DUPLICADA',
    1,
    'BOLETO',
    'PENDENTE',
    100.00,
    DATE '2026-07-30'
);

ROLLBACK;
```

O arquivo deve ser executado manualmente.

Um erro deixa a transação abortada até `ROLLBACK`.

---

### 11. Criar 08_consultas_integradas.sql

Crie:

```text
sql/08_consultas_integradas.sql
```

Conteúdo:

```sql
SELECT
    ordem.codigo AS ordem,
    cliente.nome AS cliente,
    produto.nome AS produto,
    ordem.status,
    ordem.prioridade,
    ordem.valor_previsto
FROM projeto_os.ordem_servico AS ordem
INNER JOIN projeto_os.cliente AS cliente
    ON cliente.id = ordem.cliente_id
INNER JOIN projeto_os.produto AS produto
    ON produto.id = ordem.produto_id
ORDER BY
    ordem.aberta_em DESC,
    ordem.id DESC;

SELECT
    ordem.codigo AS ordem,
    atividade.codigo AS atividade,
    atividade.status,
    atividade.valor_mao_obra,
    atividade.duracao_prevista
FROM projeto_os.ordem_servico AS ordem
INNER JOIN projeto_os.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
ORDER BY
    ordem.id,
    atividade.id;

SELECT
    ordem.codigo AS ordem,
    pagamento.parcela,
    pagamento.forma,
    pagamento.status,
    pagamento.valor,
    pagamento.vencimento,
    pagamento.pago_em
FROM projeto_os.ordem_servico AS ordem
LEFT JOIN projeto_os.pagamento AS pagamento
    ON pagamento.ordem_servico_id = ordem.id
ORDER BY
    ordem.id,
    pagamento.parcela;
```

Essas consultas são apenas uma inspeção do modelo.

A próxima aula construirá relatórios agregados e contratos de leitura.

---

### 12. Criar a documentacao conceitual

Em:

```text
docs/modelo-conceitual.md
```

registre:

```text
Cliente solicita Ordens;

Produto é o objeto atendido;

Ordem organiza o atendimento;

Atividade descreve o trabalho;

Pagamento representa parcela financeira.
```

Inclua as cardinalidades e as regras de opcionalidade.

Em:

```text
docs/modelo-logico.md
```

registre cada relação com:

- primary key;
- chaves alternativas;
- foreign keys;
- cardinalidade;
- granularidade.

Em:

```text
docs/dicionario-dados.md
```

documente todas as colunas:

- tipo;
- nulabilidade;
- default;
- significado;
- exemplo;
- regra.

Em:

```text
docs/regras-nao-garantidas-por-check.md
```

registre:

```text
Ordem precisa de pelo menos uma Atividade;

soma financeira ativa deve respeitar valor previsto;

Ordem só conclui com Atividades encerradas;

Pagamento depende de regra comercial;

transições de status precisam de máquina de estados;

Cliente e Produto inativos não recebem novas Ordens.
```

Para cada regra, proponha a camada responsável.

---

## Entendendo o que foi feito

### O schema isolou o modelo consolidado

`projeto_os` evita colisão com as tabelas históricas do laboratório.

Ele também cria uma fonte clara para a aula 298.

---

### A Ordem conectou o dominio

Cliente e Produto são pais independentes.

Atividade e Pagamento são filhos da Ordem.

O relacionamento ficou visível pelas foreign keys.

---

### Pagamento permitiu parcelamento

A chave:

```text
ordem_servico_id + parcela
```

impediu repetição de número de parcela dentro da mesma Ordem.

A referência externa unique impediu duplicidade de integração.

---

### Constraints protegeram regras locais

O banco protegeu:

- valores;
- status;
- datas;
- duplicidades;
- referências;
- obrigatoriedade.

Regras agregadas ficaram documentadas para a camada transacional.

---

### O seed representou estados diferentes

O dataset possui:

```text
Ordem concluída e integralmente paga;

Ordem em atendimento e parcialmente paga;

Ordem agendada com pagamento pendente;

Ordem cancelada sem Pagamentos.
```

A variedade permitirá relatórios úteis na próxima aula.

---

### Os indices nasceram de consultas

Nenhum índice foi criado apenas porque a coluna existe.

Cada índice possui um padrão de busca planejado.

---

## Erros comuns importantes

### Colocar Pagamento dentro da Ordem

Isso impede parcelas e histórico de tentativas.

Use tabela filha.

---

### Copiar nome do Cliente para toda Ordem

Atributos cadastrais ficam duplicados.

Use foreign key e defina estratégia de snapshot somente quando houver requisito histórico.

---

### Garantir regra agregada com CHECK

`CHECK` não deve consultar outras linhas.

Use transação, trigger ou outra modelagem.

---

### Usar DELETE CASCADE em histórico financeiro

A exclusão do pai apagaria evidências.

Prefira `RESTRICT` e mudança de status.

---

### Criar índice duplicado de UNIQUE

Primary keys e unique já possuem índices de suporte.

Inspecione o catálogo antes.

---

## Comandos uteis

### Inspecionar tabelas

```sql
SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema = 'projeto_os';
```

### Inspecionar constraints

```sql
SELECT *
FROM information_schema.table_constraints
WHERE table_schema = 'projeto_os';
```

### Inspecionar indices

```sql
SELECT *
FROM pg_indexes
WHERE schemaname = 'projeto_os';
```

### Conferir relacionamentos

```sql
SELECT
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE connamespace = 'projeto_os'::regnamespace;
```

---

## Exercicio guiado

No arquivo:

```text
sql/09_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Novo Cliente e Produto

Crie:

```text
Cliente 994001;

Produto 994001.
```

Use códigos e documentos únicos.

---

### Parte 2 - Nova Ordem transacional

Dentro de uma transação, crie:

```text
Ordem 994010;

duas Atividades;

duas parcelas de Pagamento.
```

A Ordem deve ficar `AGENDADA`.

Use IDs:

```text
Atividades:
994020 e 994021.

Pagamentos:
994030 e 994031.
```

Faça `COMMIT` somente depois de validar todas as linhas.

---

### Parte 3 - Validar valores

A soma das duas parcelas deve ser igual a:

```text
ordem_servico.valor_previsto.
```

Crie uma consulta de validação.

Não armazene o total na Ordem.

---

### Parte 4 - Testar constraint temporal

Tente criar uma Atividade com:

```text
fim_real anterior a inicio_real.
```

Confirme o erro e execute rollback.

---

### Parte 5 - Testar integridade referencial

Tente remover o Cliente do exercício enquanto a Ordem existir.

Confirme que `ON DELETE RESTRICT` impede a remoção.

---

### Parte 6 - Inativacao

Em vez de apagar, altere:

```text
cliente.ativo = false;

produto.ativo = false.
```

Explique por que o histórico continua íntegro.

---

### Parte 7 - Regra nao local

Escreva uma consulta que encontre Ordens `CONCLUIDA` com Atividades não concluídas.

O seed deve retornar zero.

Explique qual camada impediria esse estado durante uma alteração real.

---

### Parte 8 - Limpeza do exercicio

Remova somente os dados do exercício, dentro de uma transação, na ordem:

```text
Pagamentos;

Atividades;

Ordem;

Produto;

Cliente.
```

Confirme zero linhas nos IDs `994000` a `994099`.

Não remova o seed oficial.

---

## Criterios de aceite

- o laboratório oficial da aula 297 existe;
- o arquivo e o H1 seguem a grade;
- o schema `projeto_os` foi criado;
- as cinco entidades oficiais foram modeladas;
- a granularidade de cada tabela foi documentada;
- Cliente possui chave técnica e chaves alternativas;
- Produto possui valor de referência;
- Ordem referencia Cliente e Produto;
- Atividade referencia Ordem;
- Pagamento referencia Ordem;
- o relacionamento de Pagamento permite várias parcelas;
- primary keys foram criadas;
- foreign keys usam `RESTRICT`;
- constraints unique foram aplicadas;
- checks de status e valores foram aplicados;
- regras temporais foram aplicadas;
- regras agregadas foram separadas de constraints locais;
- normalização até 3FN foi justificada;
- índices possuem consultas candidatas;
- seed contém três Clientes;
- seed contém três Produtos;
- seed contém quatro Ordens;
- seed contém sete Atividades;
- seed contém cinco Pagamentos;
- cardinalidades foram validadas;
- erros controlados foram documentados;
- o exercício foi concluído;
- dados do exercício foram removidos;
- seed oficial permaneceu;
- tabelas anteriores do schema `app` permaneceram;
- o modelo ficou disponível para a aula 298;
- relatórios completos não foram antecipados;
- README e documentos estão prontos;
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
  labs/m12/aula-297-modelagem-os-cliente-atividade-produto-pagamento
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): modelar dominio integrado de ordem de servico"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
modelo conceitual;
modelo lógico;
modelo físico;
constraints;
índices;
seed;
integridade.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você consolidou um domínio relacional completo.

Aprendeu a transformar regras em:

```text
entidades;
granularidades;
cardinalidades;
chaves;
foreign keys;
checks;
índices;
dados de referência;
documentação.
```

As decisões principais foram:

```text
Cliente e Produto permanecem entidades independentes;

Ordem conecta o atendimento;

Atividade representa etapas operacionais;

Pagamento representa parcelas;

totais permanecem derivados;

histórico usa RESTRICT em vez de exclusão em cascata;

constraints protegem regras locais;

transações protegem invariantes de várias linhas;

índices atendem consultas conhecidas;

schema isolado preserva o laboratório acumulado.
```

A próxima aula será:

```text
298 - M12.28 - Consultas de relatorio para backend
```

Nela, você utilizará o schema `projeto_os` para construir:

- resumo de Ordens;
- total de Atividades;
- custo de mão de obra;
- total pago;
- total pendente;
- saldo financeiro;
- pagamentos vencidos;
- Ordens por Cliente;
- Produtos mais atendidos;
- indicadores por status;
- relatórios com CTEs;
- contratos estáveis de leitura;
- validações contra multiplicação de linhas.

Não execute `01_limpar_modelo_anterior.sql` depois desta aula.

O seed precisa permanecer disponível.

---

# Material complementar

## Checkpoint final

- [ ] Modelei as cinco entidades e suas cardinalidades.
- [ ] Criei constraints, índices e seed coerente.
- [ ] Separei regras locais de invariantes agregadas.
- [ ] Mantive o modelo disponível e fiz o commit.

---

## Troubleshooting adicional

### Schema already exists

Isso é esperado em reexecução.

A criação usa `IF NOT EXISTS`.

### Relation already exists

O arquivo de limpeza não foi executado antes da reconstrução.

Revise dependências e não use `CASCADE`.

### Violacao de check em Ordem concluida

`concluida_em` está nulo ou foi informado para status diferente de `CONCLUIDA`.

Corrija o estado.

### Violacao unique em parcela

Já existe o mesmo número de parcela para a Ordem.

Use o próximo número ou corrija a carga.

### Nao consigo remover a Ordem

Existem Atividades ou Pagamentos.

A proteção histórica está funcionando.

---

## Perguntas de revisao

1. Qual é a granularidade de Pagamento?
2. Por que Pagamento referencia Ordem?
3. Por que não usar uma coluna de Pagamento na Ordem?
4. Qual relacionamento existe entre Cliente e Ordem?
5. Qual relacionamento existe entre Ordem e Atividade?
6. Por que Atividade usa chave unique composta?
7. O que `valor_previsto` representa?
8. Por que ele não é substituído pelo valor do Produto?
9. Quais regras cabem em `CHECK`?
10. Quais regras dependem de várias linhas?
11. Por que usar `ON DELETE RESTRICT`?
12. Como garantir ao menos uma Atividade?
13. Por que não armazenar total pago?
14. Como o modelo atende à 1FN?
15. Como atende à 3FN?
16. Quais índices foram criados?
17. Por que não indexar todo boolean?
18. Por que usar schema isolado?
19. Qual dataset ficará para a aula 298?
20. Qual é a próxima etapa?

---

## Roteiro de resposta

1. Uma parcela ou obrigação financeira.
2. Porque uma Ordem pode possuir várias parcelas.
3. Isso limitaria cardinalidade e histórico.
4. Um Cliente para muitas Ordens.
5. Uma Ordem para muitas Atividades.
6. Para não repetir código na mesma Ordem.
7. Valor acordado ou estimado para aquela Ordem.
8. O preço atual do Produto pode mudar.
9. Regras locais da linha.
10. Totais e estados que consultam filhos.
11. Para preservar histórico.
12. Na transação da camada de serviço.
13. É derivado dos Pagamentos.
14. Colunas atômicas e filhos em linhas próprias.
15. Dados de Cliente e Produto não são copiados na Ordem.
16. Índices para Cliente, Produto, Atividade e Pagamento.
17. Baixa seletividade e ausência de consulta.
18. Para preservar o schema acumulado.
19. 3 Clientes, 3 Produtos, 4 Ordens, 7 Atividades e 5 Pagamentos.
20. Relatórios para backend.

---

## Desafio opcional

Proponha uma evolução para registrar histórico de transições.

Inclua:

```text
ordem_status_historico;

status_anterior;

status_novo;

ocorrido_em;

usuario;

motivo;

origem.
```

Documente:

- cardinalidade;
- primary key;
- foreign key;
- índices;
- regra de imutabilidade;
- relação com auditoria;
- diferença entre estado atual e histórico.

Não implemente a tabela nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 297 - M12.27 - Modelagem OS cliente atividade produto e pagamento

- Consolidei um modelo relacional no schema `projeto_os`.
- Defini a granularidade de Cliente, Produto, Ordem, Atividade e Pagamento.
- Modelei Cliente 1:N Ordem e Produto 1:N Ordem.
- Modelei Ordem 1:N Atividade e Ordem 0:N Pagamento.
- Usei Pagamento como uma linha por parcela.
- Diferenciei valor de referência do Produto de valor previsto da Ordem.
- Criei primary keys, foreign keys, unique e checks.
- Usei `ON DELETE RESTRICT` para preservar histórico.
- Impedi códigos duplicados de Atividade dentro da mesma Ordem.
- Impedi parcelas duplicadas dentro da mesma Ordem.
- Modelei compatibilidade entre status e datas.
- Separei constraints locais de regras agregadas.
- Justifiquei a normalização até a 3FN.
- Criei índices orientados a consultas reais.
- Inserí seed com 3 Clientes, 3 Produtos, 4 Ordens, 7 Atividades e 5 Pagamentos.
- Validei cardinalidades e integridade.
- Mantive o modelo disponível para a próxima aula.
- Próxima aula: consultas de relatório para backend.
```

---

## Referencia tecnica curta

```text
Cliente 1:N Ordem;

Produto 1:N Ordem;

Ordem 1:N Atividade;

Ordem 0:N Pagamento;

Atividade:
unique por Ordem e código;

Pagamento:
unique por Ordem e parcela;

Exclusão:
RESTRICT;

Totais:
derivados;

Regras agregadas:
transação ou mecanismo dedicado.
```

Regra final:

```text
um bom modelo relacional transforma regras de dominio em estruturas claras, protege o que e local no banco e torna explicito o que depende de uma unidade transacional maior.
```
