# 300 - M12.30 - Scripts versionados e migracoes conceituais

## Apresentacao da aula

Na aula 299, você analisou performance a partir de consultas corretas, cargas representativas e planos medidos.

Agora o foco muda para a evolução controlada do banco.

Um banco de produção não permanece igual desde o primeiro deploy.

Ao longo do tempo, surgem necessidades como:

```text
criar uma tabela;

adicionar uma coluna;

preencher dados existentes;

tornar uma coluna obrigatória;

criar um índice;

alterar um contrato de leitura;

corrigir dados;

remover uma estrutura obsoleta.
```

Executar essas mudanças manualmente, sem ordem e sem histórico, produz riscos:

- ambientes com estruturas diferentes;
- scripts executados duas vezes;
- mudança aplicada em homologação, mas esquecida em produção;
- desenvolvedor alterando um script que já havia sido usado;
- aplicação nova executando sobre schema antigo;
- alteração destrutiva antes de todos os consumidores migrarem;
- backfill interrompido;
- dificuldade para auditar o que aconteceu.

A solução conceitual é tratar cada mudança do banco como uma migração versionada.

Uma migração representa uma transição:

```text
estado anterior do schema;

mudança ordenada;

novo estado esperado.
```

Nesta aula, você ainda não usará Flyway.

Antes da ferramenta, precisa compreender o problema que ela resolve.

Você vai criar seis migrações manuais:

```text
001:
modelo base.

002:
expansão com coluna opcional.

003:
backfill dos registros existentes.

004:
restrições e contrato definitivo.

005:
índice orientado a uma consulta.

006:
views de compatibilidade para duas versões da API.
```

Cada script:

- terá uma versão única;
- será executado em ordem;
- possuirá responsabilidade clara;
- registrará sua aplicação;
- será tratado como imutável depois de aplicado;
- será validado por consultas de checkpoint.

O laboratório usará o schema isolado:

```text
migracao_aula_300
```

Ele será removido ao final, porque a aula 301 reutilizará os arquivos de migração, não o estado manual criado no banco.

O schema oficial `projeto_os`, seu seed e suas views permanecerão intactos.

Ao final, você deverá compreender por que uma migração aplicada não deve ser editada, como dividir mudanças em etapas compatíveis e como preparar banco e aplicação para evoluírem sem depender de uma alteração destrutiva imediata.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
298:
relatórios SQL para backend.

299:
performance inicial de SQL.

300:
scripts versionados e migrações conceituais.

301:
Flyway conceitual antes do Spring.

302:
carga de massa, seed e dados de teste.
```

Até aqui, muitos laboratórios foram reconstruídos com:

```sql
DROP TABLE IF EXISTS ...;

CREATE TABLE ...;
```

Essa estratégia é útil em ambiente didático descartável.

Ela não é uma estratégia de evolução para um banco com dados reais.

Em produção, normalmente não se deseja:

```text
apagar o schema;

recriar todas as tabelas;

reinserir todos os dados.
```

O objetivo é evoluir o estado existente:

```text
versão 1;

versão 2;

versão 3;

versão 4.
```

Cada ambiente deve alcançar o mesmo estado aplicando a mesma sequência.

A aula 301 apresentará uma ferramenta que:

- descobre scripts;
- ordena versões;
- registra histórico;
- valida scripts aplicados;
- impede inconsistências comuns.

Nesta aula, o processo será manual para que cada responsabilidade fique visível.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-300-scripts-versionados-migracoes-conceituais
```

Estrutura final:

```text
labs
└── m12
    └── aula-300-scripts-versionados-migracoes-conceituais
        ├── README.md
        ├── docs
        │   ├── checklist-revisao-migracao.md
        │   ├── estrategia-expand-contract.md
        │   ├── inventario-versoes.md
        │   └── politica-migracoes.md
        ├── migrations
        │   ├── 001_criar_modelo_base.sql
        │   ├── 002_adicionar_prioridade_opcional.sql
        │   ├── 003_backfill_prioridade.sql
        │   ├── 004_endurecer_prioridade.sql
        │   ├── 005_criar_indice_listagem.sql
        │   └── 006_criar_views_compatibilidade.sql
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_limpar_laboratorio.sql
            ├── 02_inspecionar_historico.sql
            ├── 03_validar_estado_final.sql
            ├── 04_simular_falha_transacional.sql
            ├── 05_validar_compatibilidade.sql
            ├── 06_exercicio.sql
            ├── 07_limpar_laboratorio.sql
            └── 08_checkpoint_final.sql
```

O modelo inicial terá:

```text
Cliente;

Ordem de Serviço;

histórico manual de migrações.
```

A evolução adicionará:

```text
prioridade;

backfill;

NOT NULL;

CHECK;

default;

índice composto;

view v1;

view v2.
```

O laboratório usará quatro Ordens existentes para tornar o backfill observável.

---

## Conceito essencial

### Estado desejado e historico de mudancas

Há duas formas gerais de descrever um banco.

#### Estado desejado

Um único arquivo declara:

```text
como o schema deve estar agora.
```

Ele pode ser útil para:

- documentação;
- criação de ambiente novo;
- comparação;
- geração de diagrama.

Porém, não explica necessariamente como migrar dados existentes com segurança.

#### Histórico de mudanças

Uma sequência declara:

```text
como sair da versão anterior e chegar à próxima.
```

Exemplo:

```text
001 cria a tabela;

002 adiciona a coluna;

003 preenche os dados;

004 aplica a obrigatoriedade.
```

Migrações versionadas preservam essa história.

Os dois modelos podem coexistir:

- DDL consolidado para referência;
- migrações para evolução.

---

### Versao

Cada migração precisa de um identificador único e ordenável.

Nesta aula:

```text
001;
002;
003;
004;
005;
006.
```

A versão não deve depender somente da data de execução.

Ela representa a posição da mudança no histórico do projeto.

Uma convenção precisa definir:

- quantidade de dígitos;
- separador;
- nome descritivo;
- extensão;
- ordem.

Exemplo:

```text
003_backfill_prioridade.sql
```

O nome deve explicar a intenção sem exigir abrir o arquivo.

---

### Ordem de execucao

A migração `004` depende de `003`.

Não é seguro executar:

```text
004:
SET NOT NULL
```

antes de:

```text
003:
preencher valores nulos.
```

A ordem faz parte do contrato.

Um ambiente que executou:

```text
001, 002, 003, 004
```

não é equivalente a outro que executou:

```text
001, 002, 004
```

mesmo que alguém tente corrigir manualmente depois.

---

### Imutabilidade

Depois que uma migração foi aplicada em um ambiente compartilhado, ela deve ser tratada como imutável.

Se a versão `003` possui um erro já aplicado, não edite silenciosamente o arquivo.

Crie:

```text
007_corrigir_backfill_prioridade.sql
```

Por quê?

O ambiente A já executou o conteúdo antigo.

O ambiente B executaria o conteúdo novo.

Os dois teriam:

```text
versão 003 registrada;
estados diferentes.
```

Ferramentas de migração usam checksums justamente para detectar esse tipo de alteração.

Nesta aula, o checksum será apenas conceitual.

A aula 301 mostrará a validação automatizada.

---

### Uma responsabilidade por migracao

Evite um arquivo que:

- cria vinte tabelas;
- migra milhões de linhas;
- remove colunas;
- cria views;
- altera permissões;
- corrige dados sem relação.

Migrações menores facilitam:

- revisão;
- diagnóstico;
- rollback operacional;
- auditoria;
- entendimento da falha;
- coordenação com o deploy.

Isso não significa criar um arquivo para cada linha de SQL.

A unidade deve representar uma mudança coerente.

---

### Migracao de schema e de dados

Migração de schema altera estrutura:

```sql
ALTER TABLE ... ADD COLUMN;
```

Migração de dados altera registros existentes:

```sql
UPDATE ...
SET prioridade = 'NORMAL'
WHERE prioridade IS NULL;
```

O backfill é uma migração de dados.

Ele precisa considerar:

- quantidade de linhas;
- locks;
- duração;
- lotes;
- repetibilidade;
- validação;
- impacto em replicação;
- concorrência com a aplicação.

O laboratório possui quatro linhas e executará um único `UPDATE`.

Em produção, um backfill grande pode exigir processamento em lotes e observabilidade.

---

### Expand and contract

Mudanças incompatíveis podem ser divididas em fases.

Exemplo: tornar `prioridade` obrigatória.

#### Expandir

```text
adicionar a coluna aceitando NULL;

publicar aplicação que escreve o novo campo;

manter consumidores antigos funcionando.
```

#### Migrar

```text
preencher registros antigos;

validar a distribuição;

corrigir exceções.
```

#### Endurecer

```text
definir default;

adicionar CHECK;

tornar NOT NULL.
```

#### Contrair

```text
remover contrato antigo;

remover coluna obsoleta;

eliminar compatibilidade temporária.
```

A contração só deve ocorrer quando nenhum consumidor depende da estrutura anterior.

---

### Compatibilidade entre banco e aplicacao

Imagine duas versões da aplicação durante um deploy:

```text
versão antiga:
não conhece prioridade.

versão nova:
envia prioridade.
```

Se o banco adicionar uma coluna obrigatória sem default antes da nova aplicação estar em todas as instâncias, a versão antiga pode falhar ao inserir.

Uma sequência compatível seria:

1. banco adiciona coluna opcional;
2. aplicação nova começa a escrever;
3. dados antigos recebem backfill;
4. todas as instâncias antigas são removidas;
5. banco aplica obrigatoriedade.

Banco e aplicação evoluem como um sistema.

---

### Mudancas destrutivas

Exemplos:

- remover coluna;
- renomear coluna usada;
- mudar tipo incompatível;
- remover tabela;
- alterar significado de status;
- restringir valores existentes.

Essas mudanças exigem:

- inventário de consumidores;
- plano de dados;
- compatibilidade temporária;
- monitoramento;
- janela adequada;
- estratégia de recuperação.

Renomear uma coluna diretamente pode quebrar aplicação, relatório e integração no mesmo instante.

Uma estratégia mais segura pode manter as duas representações durante a transição.

---

### Forward migration e rollback

Migração forward corrige o banco avançando para uma nova versão.

Exemplo:

```text
006 introduziu definição incompleta;

007 corrige a definição.
```

Rollback pode significar coisas diferentes:

- desfazer uma transação ainda não confirmada;
- executar um script reverso;
- restaurar backup;
- voltar a aplicação;
- criar nova migração que restaura compatibilidade.

Nem toda mudança é reversível.

Depois de remover uma coluna e perder os dados, um `ALTER TABLE ADD COLUMN` não recupera o conteúdo anterior.

Por isso, a estratégia preferida costuma ser:

```text
backup;
expansão compatível;
migração forward;
contração tardia.
```

---

### Transacoes em migracoes

PostgreSQL permite executar muitas alterações DDL dentro de transação.

Exemplo:

```sql
BEGIN;

ALTER TABLE ...;

UPDATE ...;

INSERT INTO historico ...;

COMMIT;
```

Se uma instrução falhar, `ROLLBACK` pode desfazer as mudanças da unidade.

Entretanto, algumas operações não podem executar dentro de bloco transacional ou possuem necessidades operacionais próprias.

Exemplo conhecido:

```text
CREATE INDEX CONCURRENTLY.
```

Não conclua que toda migração é automaticamente atômica.

Conheça cada comando.

No laboratório, todas as migrações usarão operações compatíveis com transação comum.

---

### Idempotencia e deteccao de erro

Pode parecer conveniente escrever:

```sql
CREATE TABLE IF NOT EXISTS ...;
```

em todas as migrações.

Porém, isso pode esconder drift.

Se a tabela já existe com definição errada, `IF NOT EXISTS` apenas ignora a criação.

Uma migração versionada normalmente deve executar uma vez e falhar quando o estado não é o esperado.

A ferramenta consulta o histórico para decidir se o script já foi aplicado.

Idempotência continua útil em:

- scripts operacionais específicos;
- reconciliação cuidadosamente projetada;
- limpeza de laboratório;
- rotinas repetíveis.

Não confunda idempotência com versionamento.

---

### Historico de migracoes

O laboratório criará:

```text
migracao_aula_300.historico_migracao
```

Colunas:

```text
versao;
descricao;
arquivo;
aplicada_em;
aplicada_por.
```

Cada script registra sua versão na mesma transação da mudança.

Se a mudança falhar, o histórico não deve afirmar que ela foi concluída.

Em uma ferramenta real, a tabela de histórico e seus metadados são gerenciados pela própria ferramenta.

O histórico manual desta aula existe para visualizar o mecanismo.

---

### Checksum

Checksum é um resumo calculado a partir do conteúdo do script.

Ele permite detectar:

```text
arquivo da versão 003 foi alterado depois da aplicação.
```

O histórico manual não calculará checksum para evitar criar um executor caseiro.

A política do laboratório continuará sendo:

```text
não editar uma migração aplicada;
criar nova versão.
```

---

### Revisao de migracao

Uma revisão precisa responder:

- o script possui versão única?
- a ordem está correta?
- a mudança é compatível?
- existem dados antigos?
- haverá backfill?
- o comando pode bloquear?
- existe índice necessário?
- a aplicação antiga continuará funcionando?
- há operação destrutiva?
- como validar o resultado?
- qual é o plano de recuperação?
- o script pode ser executado em transação?
- a migração foi testada em cópia representativa?

A revisão de SQL é parte da revisão da aplicação.

---

### Separar schema, seed e teste

Migrações estruturais não devem depender de dados aleatórios de teste.

Nesta aula, a versão `001` inserirá um pequeno conjunto controlado apenas porque o backfill precisa de dados observáveis.

Em um projeto real, a política deve separar:

```text
schema obrigatório;

dados de referência obrigatórios;

seed local;

massa de teste;

dados de produção.
```

A aula 302 aprofundará seed e carga de massa.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-300-scripts-versionados-migracoes-conceituais\migrations"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-300-scripts-versionados-migracoes-conceituais\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-300-scripts-versionados-migracoes-conceituais\docs"

Set-Location `
  "labs\m12\aula-300-scripts-versionados-migracoes-conceituais"
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
    to_regnamespace(
        'migracao_aula_300'
    ) AS schema_laboratorio;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_oficial;
```

O schema oficial deve existir.

O schema do laboratório pode ser nulo.

---

### 3. Criar 01_limpar_laboratorio.sql

Crie:

```text
sql/01_limpar_laboratorio.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS migracao_aula_300 CASCADE;
```

Use esse script apenas para reiniciar o laboratório.

Ele não é uma migração de produção.

O `CASCADE` está restrito ao schema descartável da aula.

---

### 4. Criar a migracao 001

Crie:

```text
migrations/001_criar_modelo_base.sql
```

Conteúdo:

```sql
BEGIN;

CREATE SCHEMA migracao_aula_300;

CREATE TABLE migracao_aula_300.historico_migracao (
    versao integer PRIMARY KEY,
    descricao text NOT NULL,
    arquivo text NOT NULL UNIQUE,
    aplicada_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    aplicada_por text NOT NULL
        DEFAULT CURRENT_USER
);

CREATE TABLE migracao_aula_300.cliente (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL,
    ativo boolean NOT NULL DEFAULT true,

    CONSTRAINT ck_mig300_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_mig300_cliente_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE migracao_aula_300.ordem_servico (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    descricao_problema text NOT NULL,
    aberta_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mig300_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES migracao_aula_300.cliente (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT ck_mig300_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_mig300_ordem_descricao
        CHECK (
            btrim(descricao_problema) <> ''
        )
);

INSERT INTO migracao_aula_300.cliente (
    id,
    codigo,
    nome
)
VALUES
    (
        300001,
        'CLI-M300-A',
        'Cliente Alfa'
    ),
    (
        300002,
        'CLI-M300-B',
        'Cliente Beta'
    );

INSERT INTO migracao_aula_300.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    descricao_problema,
    aberta_em
)
VALUES
    (
        301001,
        'OS-M300-001',
        300001,
        'ABERTA',
        'Equipamento não inicia',
        TIMESTAMPTZ '2026-07-01 09:00:00-03'
    ),
    (
        301002,
        'OS-M300-002',
        300001,
        'EM_ATENDIMENTO',
        'Ruído durante funcionamento',
        TIMESTAMPTZ '2026-07-02 10:00:00-03'
    ),
    (
        301003,
        'OS-M300-003',
        300002,
        'CONCLUIDA',
        'Falha no sensor',
        TIMESTAMPTZ '2026-07-03 11:00:00-03'
    ),
    (
        301004,
        'OS-M300-004',
        300002,
        'CANCELADA',
        'Solicitação cancelada',
        TIMESTAMPTZ '2026-07-04 12:00:00-03'
    );

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    1,
    'Criar modelo base',
    '001_criar_modelo_base.sql'
);

COMMIT;
```

A versão cria o ponto de partida e os dados que serão migrados.

---

### 5. Criar a migracao 002

Crie:

```text
migrations/002_adicionar_prioridade_opcional.sql
```

Conteúdo:

```sql
BEGIN;

ALTER TABLE migracao_aula_300.ordem_servico
ADD COLUMN prioridade text;

COMMENT ON COLUMN
    migracao_aula_300.ordem_servico.prioridade
IS
    'Prioridade operacional da Ordem';

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    2,
    'Adicionar prioridade opcional',
    '002_adicionar_prioridade_opcional.sql'
);

COMMIT;
```

Depois dessa versão:

```text
a aplicação antiga continua inserindo sem prioridade;

a aplicação nova já pode escrever o campo;

registros antigos permanecem nulos.
```

---

### 6. Criar a migracao 003

Crie:

```text
migrations/003_backfill_prioridade.sql
```

Conteúdo:

```sql
BEGIN;

UPDATE migracao_aula_300.ordem_servico
SET prioridade = CASE
    WHEN status = 'EM_ATENDIMENTO'
        THEN 'ALTA'
    WHEN status = 'CANCELADA'
        THEN 'BAIXA'
    ELSE 'NORMAL'
END
WHERE prioridade IS NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM migracao_aula_300.ordem_servico
        WHERE prioridade IS NULL
    ) THEN
        RAISE EXCEPTION
            'Backfill deixou prioridades nulas';
    END IF;
END
$$;

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    3,
    'Preencher prioridade existente',
    '003_backfill_prioridade.sql'
);

COMMIT;
```

A validação está na mesma transação.

Se existir um nulo inesperado, a migração inteira falha.

---

### 7. Criar a migracao 004

Crie:

```text
migrations/004_endurecer_prioridade.sql
```

Conteúdo:

```sql
BEGIN;

ALTER TABLE migracao_aula_300.ordem_servico
ADD CONSTRAINT ck_mig300_ordem_prioridade
CHECK (
    prioridade IN (
        'BAIXA',
        'NORMAL',
        'ALTA',
        'CRITICA'
    )
) NOT VALID;

ALTER TABLE migracao_aula_300.ordem_servico
VALIDATE CONSTRAINT ck_mig300_ordem_prioridade;

ALTER TABLE migracao_aula_300.ordem_servico
ALTER COLUMN prioridade
SET DEFAULT 'NORMAL';

ALTER TABLE migracao_aula_300.ordem_servico
ALTER COLUMN prioridade
SET NOT NULL;

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    4,
    'Validar e tornar prioridade obrigatoria',
    '004_endurecer_prioridade.sql'
);

COMMIT;
```

A separação entre `003` e `004` torna o backfill verificável antes da obrigatoriedade.

`NOT VALID` permite adicionar a constraint antes de validar o legado explicitamente.

---

### 8. Criar a migracao 005

Crie:

```text
migrations/005_criar_indice_listagem.sql
```

Conteúdo:

```sql
BEGIN;

CREATE INDEX idx_mig300_ordem_cliente_prioridade_data
ON migracao_aula_300.ordem_servico (
    cliente_id,
    prioridade,
    aberta_em DESC,
    id DESC
);

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    5,
    'Criar indice de listagem por cliente e prioridade',
    '005_criar_indice_listagem.sql'
);

COMMIT;
```

Consulta candidata:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade,
    aberta_em
FROM migracao_aula_300.ordem_servico
WHERE cliente_id = 300001
  AND prioridade = 'ALTA'
ORDER BY
    aberta_em DESC,
    id DESC;
```

No dataset pequeno, o planejador pode não usar o índice.

A justificativa continua sendo o contrato esperado, não a quantidade didática.

---

### 9. Criar a migracao 006

Crie:

```text
migrations/006_criar_views_compatibilidade.sql
```

Conteúdo:

```sql
BEGIN;

CREATE VIEW migracao_aula_300.vw_ordem_api_v1 AS
SELECT
    ordem.id,
    ordem.codigo,
    ordem.cliente_id,
    ordem.status,
    ordem.descricao_problema,
    ordem.aberta_em
FROM migracao_aula_300.ordem_servico AS ordem;

CREATE VIEW migracao_aula_300.vw_ordem_api_v2 AS
SELECT
    ordem.id,
    ordem.codigo,
    ordem.cliente_id,
    ordem.status,
    ordem.prioridade,
    ordem.descricao_problema,
    ordem.aberta_em
FROM migracao_aula_300.ordem_servico AS ordem;

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    6,
    'Criar contratos de leitura v1 e v2',
    '006_criar_views_compatibilidade.sql'
);

COMMIT;
```

A view v1 preserva o contrato anterior.

A view v2 expõe a nova coluna.

A remoção da v1 pertence a uma futura etapa de contração, depois que todos os consumidores migrarem.

---

### 10. Aplicar as migracoes manualmente

Na raiz do repositório, execute a limpeza:

```powershell
Get-Content -Raw `
  "labs\m12\aula-300-scripts-versionados-migracoes-conceituais\sql\01_limpar_laboratorio.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Aplique cada versão na ordem:

```powershell
Get-Content -Raw `
  "labs\m12\aula-300-scripts-versionados-migracoes-conceituais\migrations\001_criar_modelo_base.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Repita para:

```text
002_adicionar_prioridade_opcional.sql;

003_backfill_prioridade.sql;

004_endurecer_prioridade.sql;

005_criar_indice_listagem.sql;

006_criar_views_compatibilidade.sql.
```

Não execute os arquivos em ordem alfabética sem conferir as versões.

Aqui a convenção garante que as duas ordens coincidem.

---

### 11. Criar 02_inspecionar_historico.sql

Crie:

```text
sql/02_inspecionar_historico.sql
```

Conteúdo:

```sql
SELECT
    versao,
    descricao,
    arquivo,
    aplicada_em,
    aplicada_por
FROM migracao_aula_300.historico_migracao
ORDER BY versao;

SELECT
    count(*) AS quantidade_migracoes,
    min(versao) AS primeira_versao,
    max(versao) AS ultima_versao
FROM migracao_aula_300.historico_migracao;
```

Resultado esperado:

```text
6 migrações;

primeira versão 1;

última versão 6.
```

O histórico deve não possuir lacunas.

---

### 12. Criar 03_validar_estado_final.sql

Crie:

```text
sql/03_validar_estado_final.sql
```

Conteúdo:

```sql
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'migracao_aula_300'
  AND table_name = 'ordem_servico'
ORDER BY ordinal_position;

SELECT
    id,
    codigo,
    status,
    prioridade
FROM migracao_aula_300.ordem_servico
ORDER BY id;

SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'migracao_aula_300'
  AND table_name = 'ordem_servico'
ORDER BY
    constraint_type,
    constraint_name;

SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'migracao_aula_300'
ORDER BY indexname;

SELECT
    table_name
FROM information_schema.views
WHERE table_schema = 'migracao_aula_300'
ORDER BY table_name;
```

Valide:

```text
prioridade NOT NULL;

default NORMAL;

quatro valores preenchidos;

CHECK presente;

índice presente;

views v1 e v2 presentes.
```

---

### 13. Criar 04_simular_falha_transacional.sql

Crie:

```text
sql/04_simular_falha_transacional.sql
```

Conteúdo:

```sql
-- Execute manualmente no psql.
-- Não use ON_ERROR_STOP=1 para observar o estado abortado.

BEGIN;

ALTER TABLE migracao_aula_300.ordem_servico
ADD COLUMN coluna_temporaria text;

INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    999,
    'Migracao que deve falhar',
    '999_falha_controlada.sql'
);

-- A mesma versão provoca erro de primary key.
INSERT INTO migracao_aula_300.historico_migracao (
    versao,
    descricao,
    arquivo
)
VALUES (
    999,
    'Duplicidade proposital',
    '999_falha_duplicada.sql'
);

ROLLBACK;

SELECT
    column_name
FROM information_schema.columns
WHERE table_schema = 'migracao_aula_300'
  AND table_name = 'ordem_servico'
  AND column_name = 'coluna_temporaria';

SELECT
    versao
FROM migracao_aula_300.historico_migracao
WHERE versao = 999;
```

Depois do rollback:

```text
a coluna não existe;

a versão 999 não existe.
```

Isso demonstra que estrutura e histórico devem participar da mesma unidade transacional quando os comandos permitirem.

---

### 14. Criar 05_validar_compatibilidade.sql

Crie:

```text
sql/05_validar_compatibilidade.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    cliente_id,
    status,
    descricao_problema,
    aberta_em
FROM migracao_aula_300.vw_ordem_api_v1
ORDER BY id;

SELECT
    id,
    codigo,
    cliente_id,
    status,
    prioridade,
    descricao_problema,
    aberta_em
FROM migracao_aula_300.vw_ordem_api_v2
ORDER BY id;

SELECT
    column_name,
    ordinal_position
FROM information_schema.columns
WHERE table_schema = 'migracao_aula_300'
  AND table_name IN (
      'vw_ordem_api_v1',
      'vw_ordem_api_v2'
  )
ORDER BY
    table_name,
    ordinal_position;
```

Confirme:

```text
v1 mantém seis colunas de negócio sem prioridade;

v2 inclui prioridade;

as duas devolvem quatro Ordens.
```

---

### 15. Criar a documentacao

Em:

```text
docs/inventario-versoes.md
```

crie uma tabela com:

- versão;
- arquivo;
- tipo;
- dependência;
- estado produzido;
- validação;
- risco.

Em:

```text
docs/politica-migracoes.md
```

registre:

- migrações aplicadas são imutáveis;
- versões não podem repetir;
- execução ocorre em ordem;
- scripts devem ser revisados;
- toda mudança possui validação;
- correção usa nova versão;
- secrets não entram em scripts;
- massa de teste não pertence à migração de produção;
- operação destrutiva exige plano de transição.

Em:

```text
docs/estrategia-expand-contract.md
```

documente as fases da coluna `prioridade`:

```text
expandir;

publicar aplicação compatível;

backfill;

endurecer;

migrar consumidores;

contrair contrato v1 futuramente.
```

Em:

```text
docs/checklist-revisao-migracao.md
```

inclua o checklist conceitual da seção de teoria.

---

### 16. Criar 06_exercicio.sql

Crie:

```text
sql/06_exercicio.sql
```

Organize nele as consultas de validação do exercício.

Não altere os scripts `001` a `006`.

As mudanças do exercício devem começar na versão `007`.

---

### 17. Criar 07_limpar_laboratorio.sql

Crie:

```text
sql/07_limpar_laboratorio.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS migracao_aula_300 CASCADE;
```

Execute somente depois de concluir o exercício, a documentação e o checkpoint do histórico.

A limpeza não é uma migração de produção.

---

### 18. Criar 08_checkpoint_final.sql

Crie:

```text
sql/08_checkpoint_final.sql
```

Conteúdo:

```sql
SELECT
    to_regnamespace(
        'migracao_aula_300'
    ) AS schema_laboratorio;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
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

Depois da limpeza:

```text
schema do laboratório:
NULL.

schema e views oficiais:
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

- objetivo do laboratório;
- ordem das seis migrações;
- comando manual de aplicação;
- histórico esperado;
- decisão de imutabilidade;
- separação entre expansão, backfill e endurecimento;
- compatibilidade entre v1 e v2;
- simulação de falha;
- exercício;
- limpeza;
- ponte para Flyway.

Inclua um alerta:

```text
não editar os arquivos 001 a 006 depois de considerá-los aplicados;
qualquer evolução deve criar nova versão.
```

---

## Entendendo o que foi feito

### O banco evoluiu sem ser recriado

A versão `001` criou o estado inicial.

As versões seguintes alteraram o estado existente.

Os dados foram preservados e migrados.

---

### Prioridade foi dividida em etapas

A coluna nasceu opcional.

Os dados receberam backfill.

Somente depois foram aplicados:

```text
CHECK;

default;

NOT NULL.
```

Essa sequência reduziu a incompatibilidade com consumidores antigos.

---

### O historico participou da transacao

Cada migração registrou sua versão na mesma unidade da alteração.

Uma falha não deixou versão registrada sem mudança concluída.

---

### As views preservaram contratos

A view v1 não foi removida quando v2 surgiu.

Consumidores puderam migrar em outro momento.

A contração ficou explicitamente adiada.

---

### O indice foi uma migracao propria

A criação do índice possui versão e justificativa.

Ela não ficou escondida dentro de uma alteração sem relação.

---

### A limpeza ficou fora do historico

Apagar o schema é uma ação do laboratório.

Não faz parte da evolução de produção.

---

## Erros comuns importantes

### Editar migracao aplicada

Ambientes passam a ter conteúdos diferentes para a mesma versão.

Crie uma nova migração.

---

### Usar IF NOT EXISTS para esconder drift

O objeto pode existir com definição incorreta.

O histórico deve controlar a execução.

---

### Tornar coluna obrigatoria antes do backfill

Registros existentes violam o novo contrato.

Expanda, migre e endureça.

---

### Remover contrato antigo cedo demais

Instâncias antigas ainda podem depender dele.

Confirme a migração dos consumidores.

---

### Executar script fora de ordem

Dependências não foram atendidas.

Valide a última versão aplicada antes de continuar.

---

## Comandos uteis

### Aplicar uma migracao

```powershell
Get-Content -Raw "<arquivo.sql>" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

### Inspecionar historico

```sql
SELECT *
FROM migracao_aula_300.historico_migracao
ORDER BY versao;
```

### Inspecionar definicao

```sql
SELECT pg_get_constraintdef(oid)
FROM pg_constraint;
```

### Confirmar coluna

```sql
SELECT *
FROM information_schema.columns;
```

---

## Exercicio guiado

As mudanças do exercício devem criar novas versões.

Não edite `001` a `006`.

### Parte 1 - Migracao 007

Crie:

```text
migrations/007_adicionar_origem_opcional.sql
```

Adicione à Ordem:

```text
origem text;
```

A coluna deve aceitar nulo inicialmente.

Registre a versão no histórico.

---

### Parte 2 - Migracao 008

Crie:

```text
migrations/008_backfill_origem.sql
```

Preencha registros existentes com:

```text
LEGADO.
```

Valide que não restou nulo.

---

### Parte 3 - Migracao 009

Crie:

```text
migrations/009_endurecer_origem.sql
```

Valores permitidos:

```text
LEGADO;
PORTAL;
API;
IMPORTACAO.
```

Defina:

```text
default API;

NOT NULL;

CHECK.
```

---

### Parte 4 - Migracao 010

Crie uma view:

```text
migracao_aula_300.vw_ordem_api_v3
```

Ela deve expor:

```text
prioridade;

origem.
```

Não remova v1 ou v2.

---

### Parte 5 - Correcao por nova versao

Suponha que o default correto passe a ser:

```text
PORTAL.
```

Não edite a versão `009`.

Crie:

```text
011_alterar_default_origem.sql
```

A migração deve alterar apenas o default para novas linhas.

Não reescreva registros históricos automaticamente.

---

### Parte 6 - Validar historico

Confirme:

```text
11 versões;

ordem crescente;

sem duplicidade;

arquivo coerente com descrição.
```

---

### Parte 7 - Testar compatibilidade

Insira uma Ordem sem informar origem.

Confirme o novo default.

Consulte a Ordem por:

```text
v1;

v2;

v3.
```

Remova a linha de teste em uma transação separada.

---

### Parte 8 - Plano de contracao

Documente o que precisaria ser comprovado antes de remover:

```text
vw_ordem_api_v1.
```

Inclua:

- consumidores;
- métricas;
- logs;
- prazo;
- deploy;
- recuperação.

Não remova a view.

---

### Parte 9 - Reconstrucao completa

Execute a limpeza.

Aplique `001` a `011` em ordem em um banco limpo.

Confirme que o estado final é o mesmo.

Essa é a principal validação de uma cadeia de migrações.

---

## Criterios de aceite

- o laboratório oficial da aula 300 existe;
- o arquivo e o H1 seguem a grade;
- scripts possuem versões ordenadas;
- nomes são descritivos;
- cada migração possui responsabilidade coerente;
- o modelo inicial foi criado por `001`;
- a prioridade nasceu opcional;
- o backfill foi separado;
- a obrigatoriedade veio depois do backfill;
- `CHECK`, default e `NOT NULL` foram aplicados;
- o índice possui migração própria;
- views v1 e v2 preservam compatibilidade;
- cada migração registra seu histórico;
- alteração e histórico participam da mesma transação;
- falha transacional foi simulada;
- versão 999 não permaneceu;
- coluna temporária não permaneceu;
- imutabilidade foi documentada;
- correção por nova versão foi praticada;
- expand and contract foi compreendido;
- migração de schema foi diferenciada de migração de dados;
- rollback foi diferenciado de migração forward;
- `IF NOT EXISTS` não foi usado para esconder drift;
- operações destrutivas foram adiadas;
- schema oficial `projeto_os` foi preservado;
- exercício criou versões `007` a `011`;
- reconstrução completa foi validada;
- schema do laboratório foi removido;
- documentação e README estão prontos;
- Flyway não foi antecipado como ferramenta prática;
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
  labs/m12/aula-300-scripts-versionados-migracoes-conceituais
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): versionar scripts de migracao"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
versões;

ordem;

imutabilidade;

backfill;

expand and contract;

histórico;

compatibilidade.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você deixou de tratar o banco apenas como um estado final e passou a tratá-lo como uma sequência de mudanças auditáveis.

Aprendeu:

```text
migração versionada;

ordem de execução;

imutabilidade;

histórico;

migração de schema;

migração de dados;

backfill;

expand and contract;

compatibilidade;

migração forward;

rollback operacional;

validação;

reconstrução.
```

As regras principais foram:

```text
uma versão identifica uma mudança única;

migrações aplicadas não são editadas;

correções criam novas versões;

a ordem faz parte do contrato;

backfill deve preceder NOT NULL;

banco e aplicação precisam evoluir de forma compatível;

operações destrutivas pertencem à contração tardia;

histórico só deve registrar mudança concluída;

IF NOT EXISTS não substitui controle de versão;

todo script precisa de validação;

reconstruir do zero testa a cadeia completa.
```

A próxima aula será:

```text
301 - M12.31 - Flyway conceitual antes do Spring
```

Nela, você vai relacionar os conceitos desta aula aos mecanismos do Flyway:

- convenção de nomes;
- migrações versionadas;
- localização de scripts;
- schema history;
- versões pendentes;
- validação;
- checksum;
- baseline;
- repair;
- ordem de execução;
- falha de migração;
- execução pela linha de comando;
- preparação para uso futuro com Spring.

A ferramenta automatizará responsabilidades que nesta aula foram executadas manualmente.

Os arquivos de migração são a ponte principal.

---

# Material complementar

## Checkpoint final

- [ ] Apliquei migrações em ordem e inspecionei o histórico.
- [ ] Pratiquei expansão, backfill e endurecimento.
- [ ] Corrigi uma regra criando nova versão.
- [ ] Reconstruí a cadeia, limpei o schema e fiz o commit.

---

## Troubleshooting adicional

### Schema already exists ao executar 001

A cadeia já foi aplicada ou a limpeza não ocorreu.

Inspecione o histórico antes de agir.

### Column contains null values

O backfill não foi concluído antes de `SET NOT NULL`.

Não force a obrigatoriedade.

### Duplicate key em historico_migracao

A versão já foi registrada.

Não execute o script novamente nem altere o número sem investigar.

### Current transaction is aborted

Uma instrução falhou.

Execute `ROLLBACK`, corrija a causa e reaplique a versão em ambiente limpo.

### View possui dependencias

Uma contração tentou remover contrato ainda usado.

Mapeie consumidores e adie a remoção.

---

## Perguntas de revisao

1. O que é migração?
2. O que uma versão representa?
3. Por que a ordem importa?
4. Por que não editar script aplicado?
5. Como corrigir uma migração antiga?
6. O que é backfill?
7. Qual a diferença entre schema e data migration?
8. O que significa expandir?
9. O que significa contrair?
10. Por que adicionar coluna opcional primeiro?
11. Quando aplicar NOT NULL?
12. O que é histórico de migrações?
13. Por que histórico e mudança devem compartilhar transação?
14. O que é checksum?
15. Por que IF NOT EXISTS pode esconder drift?
16. Toda migração é reversível?
17. O que é migração forward?
18. Por que criar view de compatibilidade?
19. Como validar a cadeia completa?
20. O que Flyway automatizará?

---

## Roteiro de resposta

1. Transição versionada do banco.
2. Posição única no histórico.
3. Versões dependem das anteriores.
4. Ambientes teriam conteúdos diferentes.
5. Criando nova versão.
6. Preenchimento de dados existentes.
7. Uma altera estrutura; outra altera dados.
8. Adicionar estrutura compatível.
9. Remover legado depois da migração.
10. Para manter consumidores antigos.
11. Depois de preencher e validar.
12. Registro das versões aplicadas.
13. Evitar histórico falso.
14. Resumo do conteúdo do script.
15. Pode ignorar objeto incorreto existente.
16. Não.
17. Corrigir avançando para nova versão.
18. Permitir transição de consumidores.
19. Aplicando tudo em banco limpo.
20. Descoberta, ordem, histórico, validação e checksum.

---

## Desafio opcional

Modele uma migração para substituir:

```text
cliente.nome
```

por:

```text
cliente.nome_razao_social;
cliente.nome_fantasia.
```

Proponha:

- expansão;
- backfill;
- aplicação com escrita dupla temporária;
- views de compatibilidade;
- validação;
- contração;
- risco de perda;
- plano de recuperação;
- métricas para confirmar consumidores.

Não implemente a remoção nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 300 - M12.30 - Scripts versionados e migracoes conceituais

- Passei a tratar o banco como uma sequência de estados versionados.
- Criei migrações numeradas e ordenadas.
- Entendi que migrações aplicadas devem permanecer imutáveis.
- Separei criação de schema, backfill e endurecimento.
- Adicionei a coluna `prioridade` inicialmente opcional.
- Preenchi dados existentes em uma migração própria.
- Apliquei `CHECK`, default e `NOT NULL` somente depois da validação.
- Criei um índice em uma versão independente.
- Mantive views v1 e v2 para compatibilidade.
- Registrei cada versão em um histórico manual.
- Mantive alteração e histórico na mesma transação.
- Simulei uma falha e confirmei rollback completo.
- Diferenciei migração de schema de migração de dados.
- Estudei a estratégia expand and contract.
- Diferenciei rollback de migração forward.
- Entendi por que `IF NOT EXISTS` não substitui histórico.
- Corrigi uma regra criando nova versão.
- Reconstruí toda a cadeia em banco limpo.
- Preservei o schema oficial `projeto_os`.
- Próxima aula: Flyway conceitual antes do Spring.
```

---

## Referencia tecnica curta

```text
Migração:
mudança ordenada.

Versão:
posição única.

Imutabilidade:
não editar script aplicado.

Backfill:
migrar dados antigos.

Expand:
adicionar compatibilidade.

Contract:
remover legado depois.

Histórico:
versões concluídas.

Checksum:
detectar alteração de conteúdo.

Forward:
corrigir com nova versão.

Validação:
confirmar estado produzido.
```

Regra final:

```text
uma evolucao de banco confiavel precisa ser ordenada, auditavel, compativel e reconstruivel a partir de scripts imutaveis.
```
