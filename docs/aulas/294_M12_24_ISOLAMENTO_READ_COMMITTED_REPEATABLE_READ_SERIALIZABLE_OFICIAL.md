# 294 - M12.24 - Isolamento read committed repeatable read serializable

## Apresentacao da aula

Na aula 293, você aprendeu a agrupar várias alterações em uma unidade transacional.

Praticou:

```text
BEGIN;
COMMIT;
ROLLBACK;
autocommit;
estado abortado;
Atomicidade;
Consistência;
Isolamento;
Durabilidade.
```

A propriedade de isolamento foi apresentada, mas ainda falta observar o que acontece quando duas transações trabalham ao mesmo tempo.

Considere duas conexões:

```text
Sessão A:
abre uma transação e lê o saldo.

Sessão B:
altera o mesmo saldo e confirma.

Sessão A:
lê novamente.
```

A segunda leitura deve mostrar o valor antigo ou o novo?

A resposta depende do nível de isolamento.

Outro cenário:

```text
Sessão A:
confirma que existem dois profissionais de plantão.

Sessão B:
também confirma que existem dois.

Sessão A:
retira um profissional.

Sessão B:
retira o outro.
```

As duas transações podem ter tomado decisões individualmente válidas e, em conjunto, quebrado a regra:

```text
deve existir pelo menos um profissional de plantão.
```

Nesta aula, você vai estudar os níveis:

```text
READ COMMITTED;
REPEATABLE READ;
SERIALIZABLE.
```

Também vai entender por que:

```text
READ UNCOMMITTED
```

é aceito pelo PostgreSQL, mas possui o mesmo comportamento prático de `READ COMMITTED`.

O laboratório usará duas sessões simultâneas do `psql`.

Você observará:

- leitura de dados não confirmados;
- snapshot por instrução;
- leitura não repetível;
- aparecimento de novas linhas entre duas consultas;
- snapshot estável;
- conflito de atualização;
- anomalia de escrita concorrente;
- falha de serialização;
- necessidade de repetir a transação inteira.

O objetivo não é escolher sempre o nível mais forte.

Níveis mais rigorosos podem:

- reduzir anomalias;
- aumentar a possibilidade de abortar uma transação;
- exigir retry;
- manter snapshots por mais tempo;
- alterar o comportamento esperado da aplicação.

A escolha depende da regra que precisa ser protegida.

A próxima aula estudará:

```text
locks;
esperas;
deadlocks;
diagnóstico inicial.
```

Por isso, esta aula não aprofundará `SELECT FOR UPDATE`, `NOWAIT`, `SKIP LOCKED`, `pg_locks` nem a formação de deadlocks.

Ao final, você deverá compreender MVCC e snapshots, distinguir anomalias de leitura, usar os três níveis principais, interpretar falhas `40001`, repetir a transação inteira e escolher o isolamento conforme a regra.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
292:
EXPLAIN e leitura de planos.

293:
transações ACID.

294:
isolamento READ COMMITTED, REPEATABLE READ e SERIALIZABLE.

295:
locks, deadlocks e diagnóstico inicial.

296:
paginação SQL com offset e keyset.

297:
modelagem integrada de Ordem de Serviço.
```

Na aula anterior, uma única conexão controlou cada transação.

Agora existem duas unidades concorrentes:

```text
Transação A;

Transação B.
```

As duas podem:

- ler os mesmos dados;
- alterar linhas diferentes;
- alterar a mesma linha;
- confirmar em ordens diferentes;
- tomar decisões com base em snapshots diferentes.

A pergunta central deixa de ser apenas:

```text
a minha transação confirmou?
```

E passa a incluir:

```text
o que ela enxergou das outras transações?

qual versão dos dados foi usada?

a decisão conjunta equivale a alguma ordem serial válida?

a aplicação está preparada para retry?
```

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-294-isolamento-read-committed-repeatable-read-serializable
```

Estrutura final:

```text
labs
└── m12
    └── aula-294-isolamento-read-committed-repeatable-read-serializable
        ├── README.md
        ├── docs
        │   ├── matriz-isolamento.md
        │   └── roteiro-duas-sessoes.md
        └── sql
            ├── 00_preparar_ambiente.sql
            ├── 01_inspecionar_niveis.sql
            ├── 02_resetar_cenarios.sql
            ├── 03_dirty_read_sessao_a.sql
            ├── 04_dirty_read_sessao_b.sql
            ├── 05_read_committed_sessao_a.sql
            ├── 06_read_committed_sessao_b.sql
            ├── 07_repeatable_read_sessao_a.sql
            ├── 08_repeatable_read_sessao_b.sql
            ├── 09_conflito_repeatable_read_sessao_a.sql
            ├── 10_conflito_repeatable_read_sessao_b.sql
            ├── 11_serializable_sessao_a.sql
            ├── 12_serializable_sessao_b.sql
            ├── 13_retry_serializable.sql
            ├── 14_exercicio.sql
            ├── 15_limpar_ambiente.sql
            └── 16_validacao_final.sql
```

O ambiente permanece:

```text
container:
formacao-postgres-m12

database:
formacao_java

schema:
app
```

Tabelas exclusivas da aula:

```text
app.saldo_isolamento_aula_294;

app.pedido_isolamento_aula_294;

app.plantao_isolamento_aula_294.
```

Elas serão removidas no final.

Nenhuma tabela do dataset principal será alterada.

---

## Conceito essencial

### Concorrencia

Concorrência ocorre quando duas ou mais transações se sobrepõem no tempo.

Elas não precisam executar exatamente no mesmo nanossegundo.

Basta que uma permaneça aberta enquanto outra lê ou modifica dados relacionados.

Exemplo:

```text
A inicia;
A lê;
B inicia;
B altera;
B confirma;
A lê novamente;
A confirma.
```

A ordem intercalada produz comportamentos que não aparecem quando as transações são executadas uma após a outra.

---

### MVCC

PostgreSQL usa Multiversion Concurrency Control. Alterações criam versões de linhas, e cada transação lê as versões visíveis ao seu snapshot.

MVCC reduz bloqueios diretos entre leitura e escrita, mas não elimina conflitos, esperas, deadlocks nem falhas de serialização.

### Snapshot

Snapshot é a visão das versões consideradas visíveis.

Em `READ COMMITTED`, cada comando recebe uma visão atualizada dos commits anteriores ao início daquele comando.

Em `REPEATABLE READ` e `SERIALIZABLE`, a transação trabalha com uma visão estável. As próprias alterações continuam visíveis para ela.

### Dirty read

Dirty read ocorre quando uma transação lê uma alteração ainda não confirmada por outra.

Exemplo conceitual:

```text
A altera saldo de 1000 para 100;
A ainda não executou COMMIT;

B lê 100.
```

Se A executar rollback, B tomou uma decisão baseada em um valor que nunca se tornou definitivo.

PostgreSQL não permite dirty read nos níveis comuns.

Mesmo quando você solicita:

```sql
READ UNCOMMITTED
```

o comportamento é o de `READ COMMITTED`.

---

### Non-repeatable read

Uma leitura não repetível acontece quando a mesma consulta sobre a mesma linha produz valores diferentes dentro da mesma transação porque outra transação confirmou uma alteração.

Exemplo:

```text
A lê saldo 1000;

B altera para 1200 e confirma;

A lê novamente e encontra 1200.
```

Isso pode ocorrer em `READ COMMITTED`.

Em `REPEATABLE READ`, a segunda leitura continua enxergando a versão do snapshot estável.

---

### Phantom read

Phantom read ocorre quando a repetição de uma consulta por condição encontra um conjunto diferente de linhas.

Exemplo:

```text
A conta pedidos ABERTOS e encontra 2;

B insere outro pedido ABERTO e confirma;

A conta novamente e encontra 3.
```

Em `READ COMMITTED`, cada comando recebe novo snapshot e pode enxergar a linha adicional.

No PostgreSQL, `REPEATABLE READ` mantém o conjunto do snapshot e evita esse phantom dentro da transação.

Esse comportamento é mais forte do que o mínimo tradicional associado ao nome do nível no padrão SQL.

---

### Lost update e write skew

Lost update ocorre quando uma alteração sobrescreve ou perde o efeito lógico de outra.

Alguns comandos atômicos e mecanismos de concorrência evitam formas simples desse problema.

Write skew é diferente.

Duas transações leem um conjunto compartilhado, tomam decisões compatíveis com o próprio snapshot e alteram linhas diferentes.

Exemplo:

```text
há dois profissionais de plantão;

A lê dois e retira o primeiro;

B lê dois e retira o segundo;

as duas confirmam;

restam zero.
```

Não houve atualização da mesma linha.

Por isso, uma simples detecção de conflito de linha pode não proteger a regra global.

`SERIALIZABLE` foi projetado para impedir resultados que não correspondam a uma execução serial válida, abortando uma das transações quando necessário.

---

### READ COMMITTED

É o nível padrão usual do PostgreSQL:

```sql
BEGIN ISOLATION LEVEL READ COMMITTED;
```

Cada comando recebe um novo snapshot. Assim, duas consultas da mesma transação podem enxergar estados diferentes depois de um commit concorrente.

É adequado quando a unidade aceita o estado confirmado mais recente por comando, mas permite leitura não repetível e mudança do conjunto consultado.

### Um comando em READ COMMITTED

Embora duas consultas separadas possam enxergar snapshots diferentes, cada instrução possui uma visão consistente durante sua própria execução.

Um `SELECT` não deveria misturar arbitrariamente linhas confirmadas antes e depois do início daquele mesmo comando.

A mudança de visão ocorre entre comandos.

---

### UPDATE em READ COMMITTED

Se outra transação alterar uma linha candidata, PostgreSQL pode aguardar sua conclusão e reavaliar a condição sobre a versão confirmada. Locks serão aprofundados na aula 295.

Regra:

```text
READ COMMITTED não oferece fotografia estável para várias instruções.
```

### REPEATABLE READ

Forma:

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

A transação usa snapshot estável. Se B confirmar uma alteração depois da leitura inicial de A, A continua vendo a versão do próprio snapshot até terminar.

Esse nível é útil para relatórios ou decisões que precisam de uma fotografia consistente, mas conflitos de atualização podem exigir retry.

### O snapshot e estabelecido

Em PostgreSQL, o snapshot transacional é estabelecido quando a transação executa sua primeira instrução que precisa dessa visão.

Por isso, não abra uma transação, aguarde muito tempo e suponha que o momento relevante será sempre o texto do `BEGIN`.

Na prática, mantenha a transação curta e inicie o trabalho imediatamente.

---

### Atualizacao concorrente em REPEATABLE READ

Considere:

```text
A inicia REPEATABLE READ e lê uma linha;

B atualiza a linha e confirma;

A tenta atualizar a mesma linha.
```

A transação A pode receber:

```text
could not serialize access due to concurrent update
```

A unidade precisa ser desfeita e repetida com dados atuais.

Não tente continuar somente a instrução que falhou.

A decisão foi tomada sobre um snapshot antigo.

---

### SERIALIZABLE

Forma:

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
```

Esse é o nível mais rigoroso estudado.

O objetivo é que o resultado das transações confirmadas seja equivalente a alguma execução serial, como se tivessem ocorrido uma após a outra.

PostgreSQL mantém a visão de snapshot e monitora dependências perigosas de leitura e escrita.

Quando a combinação concorrente poderia produzir uma anomalia, uma transação pode ser abortada.

Mensagem comum:

```text
could not serialize access due to read/write dependencies among transactions
```

SQLSTATE:

```text
40001.
```

---

### Serializable nao significa sem concorrencia

As transações continuam concorrentes. Quando a combinação não pode ser aceita como execução serial, PostgreSQL aborta uma delas. Aplicações nesse nível precisam estar preparadas para retry.

### Retry da transacao inteira

Ao receber uma falha de serialização:

1. encerre a transação;
2. descarte decisões calculadas no snapshot antigo;
3. inicie nova transação;
4. refaça leituras;
5. reavalie regras;
6. refaça alterações;
7. tente confirmar novamente.

Não repita apenas o último `UPDATE`.

Exemplo:

```text
tentativa 1:
leu dois profissionais;
tentou retirar um;
falhou.

tentativa 2:
agora existe somente um;
a regra decide não retirar ninguém.
```

O retry pode mudar o resultado funcional.

---

### Limite de tentativas

Retry precisa de limite, pequeno atraso, registro do SQLSTATE e métrica. Repetição infinita pode ampliar contenção.

### READ UNCOMMITTED no PostgreSQL

O padrão SQL possui o nível `READ UNCOMMITTED`.

PostgreSQL aceita a sintaxe, mas trata o comportamento como `READ COMMITTED`.

Consequência:

```text
dados não confirmados continuam invisíveis.
```

Não use o nome para prometer dirty read ou leitura “mais rápida”.

A semântica real do PostgreSQL prevalece.

---

### Matriz de fenomenos

Resumo prático do PostgreSQL:

| Fenômeno | Read Committed | Repeatable Read | Serializable |
|---|---:|---:|---:|
| Dirty read | Não | Não | Não |
| Non-repeatable read | Pode ocorrer | Não | Não |
| Phantom read | Pode ocorrer | Não | Não |
| Anomalia de serialização | Pode ocorrer | Pode ocorrer | Impedida por aborto/retry |
| Falha de serialização | Menos comum | Pode ocorrer | Esperada sob alguns conflitos |

A ausência de uma anomalia pode ser garantida por outras características da consulta, constraints ou comandos atômicos.

A matriz descreve o nível, não substitui análise da regra.

---

### Escolha do nivel

Use `READ COMMITTED` quando cada comando pode trabalhar com o estado confirmado mais recente.

Considere `REPEATABLE READ` para várias leituras da mesma fotografia.

Considere `SERIALIZABLE` quando a regra depende de um conjunto e write skew não pode ser aceito.

O nível mais forte não corrige efeitos externos, regras ausentes nem retry inexistente.

### Definir o nivel

Você pode definir no início:

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

Ou:

```sql
BEGIN;

SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

`SET TRANSACTION` deve ocorrer antes de consultas e alterações que estabeleçam o comportamento transacional.

Para inspecionar:

```sql
SHOW transaction_isolation;
```

Para o padrão da sessão:

```sql
SHOW default_transaction_isolation;
```

Não altere o padrão global do servidor durante o laboratório.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-294-isolamento-read-committed-repeatable-read-serializable\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-294-isolamento-read-committed-repeatable-read-serializable\docs"

Set-Location `
  "labs\m12\aula-294-isolamento-read-committed-repeatable-read-serializable"
```

Confirme o container:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

---

### 2. Criar 00_preparar_ambiente.sql

Crie:

```text
sql/00_preparar_ambiente.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS app.plantao_isolamento_aula_294;
DROP TABLE IF EXISTS app.pedido_isolamento_aula_294;
DROP TABLE IF EXISTS app.saldo_isolamento_aula_294;

CREATE TABLE app.saldo_isolamento_aula_294 (
    id bigint PRIMARY KEY,
    titular text NOT NULL,
    saldo numeric(12, 2) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    atualizado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_saldo_isolamento_aula_294
        CHECK (saldo >= 0)
);

CREATE TABLE app.pedido_isolamento_aula_294 (
    id bigint PRIMARY KEY,
    descricao text NOT NULL,
    status text NOT NULL,
    valor numeric(12, 2) NOT NULL,

    CONSTRAINT ck_pedido_status_aula_294
        CHECK (
            status IN (
                'ABERTO',
                'PROCESSANDO',
                'CONCLUIDO'
            )
        ),

    CONSTRAINT ck_pedido_valor_aula_294
        CHECK (valor >= 0)
);

CREATE TABLE app.plantao_isolamento_aula_294 (
    id bigint PRIMARY KEY,
    profissional text NOT NULL UNIQUE,
    em_plantao boolean NOT NULL
);

INSERT INTO app.saldo_isolamento_aula_294 (
    id,
    titular,
    saldo
)
VALUES (
    970001,
    'Conta de laboratório',
    1000.00
);

INSERT INTO app.pedido_isolamento_aula_294 (
    id,
    descricao,
    status,
    valor
)
VALUES
    (
        970001,
        'Pedido inicial A',
        'ABERTO',
        100.00
    ),
    (
        970002,
        'Pedido inicial B',
        'ABERTO',
        200.00
    );

INSERT INTO app.plantao_isolamento_aula_294 (
    id,
    profissional,
    em_plantao
)
VALUES
    (
        970001,
        'Ana',
        true
    ),
    (
        970002,
        'Bruno',
        true
    );

ANALYZE app.saldo_isolamento_aula_294;
ANALYZE app.pedido_isolamento_aula_294;
ANALYZE app.plantao_isolamento_aula_294;
```

Execute:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-294-isolamento-read-committed-repeatable-read-serializable\sql\00_preparar_ambiente.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

### 3. Criar 01_inspecionar_niveis.sql

Crie:

```text
sql/01_inspecionar_niveis.sql
```

Conteúdo:

```sql
SHOW default_transaction_isolation;

BEGIN ISOLATION LEVEL READ COMMITTED;

SHOW transaction_isolation;

ROLLBACK;

BEGIN ISOLATION LEVEL READ UNCOMMITTED;

SHOW transaction_isolation;

SELECT
    'No PostgreSQL, READ UNCOMMITTED possui comportamento de READ COMMITTED'
        AS observacao;

ROLLBACK;

BEGIN ISOLATION LEVEL REPEATABLE READ;

SHOW transaction_isolation;

ROLLBACK;

BEGIN ISOLATION LEVEL SERIALIZABLE;

SHOW transaction_isolation;

ROLLBACK;
```

O objetivo é validar a sintaxe e os níveis disponíveis.

---

### 4. Criar 02_resetar_cenarios.sql

Crie:

```text
sql/02_resetar_cenarios.sql
```

Conteúdo:

```sql
BEGIN;

UPDATE app.saldo_isolamento_aula_294
SET
    saldo = 1000.00,
    versao = 0,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 970001;

DELETE FROM app.pedido_isolamento_aula_294
WHERE id >= 970010;

UPDATE app.plantao_isolamento_aula_294
SET em_plantao = true
WHERE id IN (
    970001,
    970002
);

COMMIT;

SELECT *
FROM app.saldo_isolamento_aula_294
ORDER BY id;

SELECT *
FROM app.pedido_isolamento_aula_294
ORDER BY id;

SELECT *
FROM app.plantao_isolamento_aula_294
ORDER BY id;
```

Execute antes de cada cenário que solicitar reset.

---

### 5. Abrir duas sessoes

Terminal A:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Terminal B:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

No topo de cada terminal:

```sql
SELECT pg_backend_pid();
```

Registre:

```text
PID da Sessão A;

PID da Sessão B.
```

Não encerre as sessões durante um cenário.

---

### 6. Criar 03_dirty_read_sessao_a.sql

Crie:

```text
sql/03_dirty_read_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN ISOLATION LEVEL READ COMMITTED;

UPDATE app.saldo_isolamento_aula_294
SET
    saldo = 100.00,
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 970001
RETURNING
    id,
    saldo,
    versao;

-- PARE.
-- Execute o passo B1 na Sessão B.
-- Depois volte e execute:

-- PASSO A2
ROLLBACK;
```

Execute o bloco A1.

Não confirme.

---

### 7. Criar 04_dirty_read_sessao_b.sql

Crie:

```text
sql/04_dirty_read_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN ISOLATION LEVEL READ UNCOMMITTED;

SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

COMMIT;
```

Enquanto A possui alteração não confirmada, B continua enxergando:

```text
saldo:
1000.00.
```

Depois execute A2.

Isso demonstra ausência de dirty read.

---

### 8. Criar 05_read_committed_sessao_a.sql

Crie:

```text
sql/05_read_committed_sessao_a.sql
```

Conteúdo:

```sql
-- Execute 02_resetar_cenarios.sql antes.

-- PASSO A1
BEGIN ISOLATION LEVEL READ COMMITTED;

SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

-- Resultado esperado no primeiro snapshot:
-- saldo 1000.00.
--
-- PARE e execute B1 na Sessão B.

-- PASSO A2
SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

COMMIT;
```

Não execute A2 antes de B confirmar.

---

### 9. Criar 06_read_committed_sessao_b.sql

Crie:

```text
sql/06_read_committed_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN ISOLATION LEVEL READ COMMITTED;

UPDATE app.saldo_isolamento_aula_294
SET
    saldo = 1200.00,
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 970001
RETURNING
    id,
    saldo,
    versao;

COMMIT;
```

Depois do commit de B, execute A2.

A segunda consulta de A deve enxergar:

```text
saldo:
1200.00.
```

A mesma transação A observou uma leitura não repetível.

---

### 10. Demonstrar phantom em READ COMMITTED

Ainda usando os dois terminais, resete o cenário.

Na Sessão A:

```sql
BEGIN ISOLATION LEVEL READ COMMITTED;

SELECT count(*) AS pedidos_abertos
FROM app.pedido_isolamento_aula_294
WHERE status = 'ABERTO';
```

Resultado inicial:

```text
2.
```

Na Sessão B:

```sql
BEGIN;

INSERT INTO app.pedido_isolamento_aula_294 (
    id,
    descricao,
    status,
    valor
)
VALUES (
    970010,
    'Pedido concorrente em READ COMMITTED',
    'ABERTO',
    300.00
);

COMMIT;
```

Volte à Sessão A:

```sql
SELECT count(*) AS pedidos_abertos
FROM app.pedido_isolamento_aula_294
WHERE status = 'ABERTO';

COMMIT;
```

Resultado final na transação A:

```text
3.
```

Uma nova linha apareceu entre as consultas.

---

### 11. Criar 07_repeatable_read_sessao_a.sql

Crie:

```text
sql/07_repeatable_read_sessao_a.sql
```

Conteúdo:

```sql
-- Execute 02_resetar_cenarios.sql antes.

-- PASSO A1
BEGIN ISOLATION LEVEL REPEATABLE READ;

SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

SELECT count(*) AS pedidos_abertos
FROM app.pedido_isolamento_aula_294
WHERE status = 'ABERTO';

-- PARE e execute B1 na Sessão B.

-- PASSO A2
SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

SELECT count(*) AS pedidos_abertos
FROM app.pedido_isolamento_aula_294
WHERE status = 'ABERTO';

COMMIT;

-- Fora da transação anterior:
SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

SELECT count(*) AS pedidos_abertos
FROM app.pedido_isolamento_aula_294
WHERE status = 'ABERTO';
```

Dentro da transação, A deve manter:

```text
saldo:
1000.00;

pedidos:
2.
```

Depois do commit, as consultas novas enxergam as mudanças de B.

---

### 12. Criar 08_repeatable_read_sessao_b.sql

Crie:

```text
sql/08_repeatable_read_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN ISOLATION LEVEL READ COMMITTED;

UPDATE app.saldo_isolamento_aula_294
SET
    saldo = 1200.00,
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 970001;

INSERT INTO app.pedido_isolamento_aula_294 (
    id,
    descricao,
    status,
    valor
)
VALUES (
    970011,
    'Pedido concorrente em REPEATABLE READ',
    'ABERTO',
    350.00
);

COMMIT;
```

Depois do commit de B, execute A2.

PostgreSQL mantém o snapshot da transação A e não apresenta phantom nesse nível.

---

### 13. Criar 09_conflito_repeatable_read_sessao_a.sql

Crie:

```text
sql/09_conflito_repeatable_read_sessao_a.sql
```

Conteúdo:

```sql
-- Execute 02_resetar_cenarios.sql antes.

-- PASSO A1
BEGIN ISOLATION LEVEL REPEATABLE READ;

SELECT
    id,
    saldo,
    versao
FROM app.saldo_isolamento_aula_294
WHERE id = 970001;

-- PARE e execute B1 na Sessão B.

-- PASSO A2
UPDATE app.saldo_isolamento_aula_294
SET
    saldo = saldo + 50.00,
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 970001
RETURNING
    id,
    saldo,
    versao;

-- A atualização deve falhar porque a linha mudou
-- depois do snapshot de A.

ROLLBACK;
```

Depois do erro, o prompt pode indicar transação abortada.

Execute `ROLLBACK`.

---

### 14. Criar 10_conflito_repeatable_read_sessao_b.sql

Crie:

```text
sql/10_conflito_repeatable_read_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN;

UPDATE app.saldo_isolamento_aula_294
SET
    saldo = saldo + 100.00,
    versao = versao + 1,
    atualizado_em = CURRENT_TIMESTAMP
WHERE id = 970001
RETURNING
    id,
    saldo,
    versao;

COMMIT;
```

Depois do commit de B, execute A2.

A precisa refazer toda a unidade com o estado atual.

---

### 15. Preparar o cenario SERIALIZABLE

Execute:

```sql
UPDATE app.plantao_isolamento_aula_294
SET em_plantao = true
WHERE id IN (
    970001,
    970002
);

SELECT *
FROM app.plantao_isolamento_aula_294
ORDER BY id;
```

Estado inicial:

```text
Ana:
true.

Bruno:
true.
```

Regra:

```text
pelo menos um profissional deve permanecer de plantão.
```

---

### 16. Criar 11_serializable_sessao_a.sql

Crie:

```text
sql/11_serializable_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT count(*) AS profissionais_em_plantao
FROM app.plantao_isolamento_aula_294
WHERE em_plantao = true;

UPDATE app.plantao_isolamento_aula_294
SET em_plantao = false
WHERE id = 970001
  AND (
      SELECT count(*)
      FROM app.plantao_isolamento_aula_294
      WHERE em_plantao = true
  ) > 1
RETURNING
    id,
    profissional,
    em_plantao;

-- PARE.
-- Execute B1 e B2, mas não confirme B antes de A.

-- PASSO A2
COMMIT;
```

A lê dois profissionais e retira Ana.

Mantenha a transação aberta até B realizar sua leitura e atualização.

---

### 17. Criar 12_serializable_sessao_b.sql

Crie:

```text
sql/12_serializable_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT count(*) AS profissionais_em_plantao
FROM app.plantao_isolamento_aula_294
WHERE em_plantao = true;

-- PASSO B2
UPDATE app.plantao_isolamento_aula_294
SET em_plantao = false
WHERE id = 970002
  AND (
      SELECT count(*)
      FROM app.plantao_isolamento_aula_294
      WHERE em_plantao = true
  ) > 1
RETURNING
    id,
    profissional,
    em_plantao;

-- PARE.
-- Confirme A.
-- Depois execute:

-- PASSO B3
COMMIT;
```

Uma das transações deve receber falha de serialização.

A sessão abortada pode variar conforme a ordem real e as decisões do banco.

A regra é:

```text
não aceite as duas confirmações produzindo zero profissionais.
```

Depois, consulte em uma sessão livre:

```sql
SELECT *
FROM app.plantao_isolamento_aula_294
ORDER BY id;

SELECT count(*) AS profissionais_em_plantao
FROM app.plantao_isolamento_aula_294
WHERE em_plantao = true;
```

Deve restar pelo menos um.

---

### 18. Criar 13_retry_serializable.sql

Crie:

```text
sql/13_retry_serializable.sql
```

Conteúdo:

```sql
-- Execute na sessão cuja transação falhou.
-- Se o cliente ainda estiver em estado abortado:
ROLLBACK;

BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT count(*) AS profissionais_em_plantao
FROM app.plantao_isolamento_aula_294
WHERE em_plantao = true;

UPDATE app.plantao_isolamento_aula_294
SET em_plantao = false
WHERE id = 970002
  AND (
      SELECT count(*)
      FROM app.plantao_isolamento_aula_294
      WHERE em_plantao = true
  ) > 1
RETURNING
    id,
    profissional,
    em_plantao;

COMMIT;

SELECT *
FROM app.plantao_isolamento_aula_294
ORDER BY id;
```

Na nova tentativa, o `UPDATE` deve afetar zero linhas se só existir um profissional disponível.

O retry refez leitura e decisão.

---

### 19. Criar docs/roteiro-duas-sessoes.md

Crie:

```text
docs/roteiro-duas-sessoes.md
```

Conteúdo sugerido:

```markdown
# Roteiro de duas sessões

**Identificação**

- PID Sessão A:
- PID Sessão B:
- Data:
- Ambiente:

**Cenário 1 — Dirty read**

1. Resetar.
2. Executar A1.
3. Executar B1.
4. Registrar valor lido por B.
5. Executar A2.

Resultado:
B não deve enxergar valor não confirmado.

**Cenário 2 — READ COMMITTED**

1. Resetar.
2. A lê saldo.
3. B altera e confirma.
4. A lê novamente.
5. Registrar os dois valores.

Resultado:
a leitura pode mudar entre comandos.

**Cenário 3 — REPEATABLE READ**

1. Resetar.
2. A lê saldo e conta pedidos.
3. B altera, insere e confirma.
4. A repete as consultas.
5. A confirma.
6. A consulta fora da transação.

Resultado:
snapshot estável durante A; novos valores depois.

**Cenário 4 — Conflito em REPEATABLE READ**

1. Resetar.
2. A lê linha.
3. B atualiza e confirma.
4. A tenta atualizar.
5. Registrar erro e executar rollback.

**Cenário 5 — SERIALIZABLE**

1. Resetar plantão.
2. A lê dois e altera Ana.
3. B lê dois e altera Bruno.
4. Confirmar A.
5. Confirmar B.
6. Registrar SQLSTATE.
7. Refazer a transação abortada.

Resultado:
uma transação falha; pelo menos um profissional permanece.
```

---

### 20. Criar docs/matriz-isolamento.md

Crie:

```text
docs/matriz-isolamento.md
```

Conteúdo:

```markdown
# Matriz de isolamento da aula 294

| Cenário | READ COMMITTED | REPEATABLE READ | SERIALIZABLE |
|---|---|---|---|
| Ler dado não confirmado | Não | Não | Não |
| Repetir leitura da mesma linha | Pode mudar | Permanece no snapshot | Permanece no snapshot |
| Repetir consulta por condição | Pode ganhar/perder linhas | Permanece no snapshot | Permanece no snapshot |
| Atualizar linha alterada após snapshot | Pode trabalhar sobre versão confirmada conforme comando | Pode falhar e exigir retry | Pode falhar e exigir retry |
| Write skew em linhas diferentes | Pode ocorrer | Pode ocorrer | Detectado por falha de serialização |
| Retry obrigatório por desenho | Normalmente não | Precisa estar previsto | Precisa estar previsto |

**Regra de escolha**

- `READ COMMITTED`: estado confirmado mais recente por comando.
- `REPEATABLE READ`: fotografia consistente durante a transação.
- `SERIALIZABLE`: proteção de invariantes concorrentes com possibilidade de aborto e retry.
```

---

### 21. Criar 14_exercicio.sql

Crie:

```text
sql/14_exercicio.sql
```

O arquivo deve conter blocos comentados para execução manual em duas sessões.

Use IDs:

```text
970100 a 970199.
```

Não altere as três linhas principais dos cenários sem resetá-las ao final.

---

### 22. Criar 15_limpar_ambiente.sql

Crie:

```text
sql/15_limpar_ambiente.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS app.plantao_isolamento_aula_294;
DROP TABLE IF EXISTS app.pedido_isolamento_aula_294;
DROP TABLE IF EXISTS app.saldo_isolamento_aula_294;
```

Execute somente depois de concluir exercício, checkpoint e registros.

---

### 23. Criar 16_validacao_final.sql

Crie:

```text
sql/16_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    to_regclass(
        'app.saldo_isolamento_aula_294'
    ) AS saldo_laboratorio,
    to_regclass(
        'app.pedido_isolamento_aula_294'
    ) AS pedido_laboratorio,
    to_regclass(
        'app.plantao_isolamento_aula_294'
    ) AS plantao_laboratorio;

SELECT
    (SELECT count(*) FROM app.ordem_servico) AS ordens_principais,
    (SELECT count(*) FROM app.atividade) AS atividades_principais,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
    ) AS eventos_principais;

SELECT
    count(*) AS indices_principais
FROM pg_indexes
WHERE indexname IN (
    'idx_ordem_servico_cliente_status',
    'idx_atividade_ordem_status',
    'idx_evento_ordem_ocorrido_em',
    'idx_telefone_cliente_confirmado',
    'idx_cliente_nome_lower',
    'uq_mv_resumo_competencia_id'
);
```

Depois da limpeza:

```text
as três relações de laboratório devem ser NULL;

dataset principal deve permanecer;

seis índices principais devem permanecer.
```

---

## Entendendo o que foi feito

### Dados nao confirmados ficaram invisiveis

A Sessão B não leu a alteração pendente da Sessão A.

O nome `READ UNCOMMITTED` não mudou esse comportamento no PostgreSQL.

---

### READ COMMITTED atualizou o snapshot

A primeira consulta leu `1000`.

Depois do commit concorrente, a segunda consulta leu `1200`.

Cada comando viu o estado confirmado disponível ao começar.

---

### REPEATABLE READ manteve a fotografia

Alteração e inserção de B não mudaram as consultas repetidas de A.

Depois do commit de A, uma nova consulta enxergou os valores atuais.

---

### Conflito exigiu retry

Uma transação `REPEATABLE READ` tentou atualizar uma linha modificada após seu snapshot.

O PostgreSQL rejeitou a operação.

Continuar somente o comando não seria correto.

---

### SERIALIZABLE protegeu a regra global

As sessões alteraram linhas diferentes, mas tomaram decisões sobre o mesmo conjunto.

O banco detectou uma combinação perigosa e abortou uma unidade.

---

### O retry refez a decisao

Na tentativa seguinte, a transação encontrou somente um profissional de plantão.

A condição impediu a segunda retirada.

O resultado funcional mudou porque a leitura foi refeita.

---

## Erros comuns importantes

### Esperar dirty read com READ UNCOMMITTED

PostgreSQL trata esse nível como `READ COMMITTED`.

Dados não confirmados continuam invisíveis.

---

### Executar todos os blocos de uma vez

Os cenários dependem de pausas e alternância entre A e B.

Selecione somente o passo indicado.

---

### Esquecer transacao aberta

Antes de resetar, confirme que as duas sessões executaram `COMMIT` ou `ROLLBACK`.

---

### Repetir somente o UPDATE

A falha de serialização invalida a decisão baseada no snapshot anterior.

Refaça toda a unidade.

---

### Usar SERIALIZABLE sem retry

Falhas `40001` fazem parte do contrato esperado sob algumas concorrências.

A aplicação precisa tratá-las.

---

## Comandos uteis

### READ COMMITTED

```sql
BEGIN ISOLATION LEVEL READ COMMITTED;
```

### REPEATABLE READ

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

### SERIALIZABLE

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
```

### Inspecionar

```sql
SHOW transaction_isolation;
```

### Definir depois do BEGIN

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

---

## Exercicio guiado

No arquivo:

```text
sql/14_exercicio.sql
```

resolva os cenários.

### Parte 1 - Nova leitura nao repetivel

Crie um registro de saldo com ID `970100`.

Na Sessão A:

```text
inicie READ COMMITTED;
leia duas vezes.
```

Na Sessão B:

```text
altere e confirme entre as leituras.
```

Registre os dois resultados.

Remova o registro depois do cenário.

---

### Parte 2 - Snapshot estavel

Repita o cenário com `REPEATABLE READ`.

Confirme:

```text
segunda leitura interna permanece;

nova leitura depois do commit encontra alteração.
```

---

### Parte 3 - Phantom

Crie dois pedidos com IDs `970110` e `970111`.

Sessão A conta por:

```text
status = 'PROCESSANDO'.
```

Sessão B insere `970112` e confirma.

Compare:

```text
READ COMMITTED;

REPEATABLE READ.
```

Limpe os três pedidos.

---

### Parte 4 - Conflito de atualizacao

Sessão A inicia `REPEATABLE READ` e lê saldo.

Sessão B altera e confirma.

Sessão A tenta alterar.

Registre:

- mensagem;
- SQLSTATE, quando disponível;
- estado da transação;
- valor final;
- estratégia de retry.

---

### Parte 5 - Write skew em REPEATABLE READ

Resete os dois profissionais.

Repita o cenário do plantão usando:

```text
REPEATABLE READ
```

e atualizando linhas diferentes.

Observe que as duas transações podem confirmar e quebrar a invariante.

Imediatamente restaure os dois valores.

Esse cenário demonstra por que snapshot estável não equivale a serialização completa.

---

### Parte 6 - Write skew em SERIALIZABLE

Repita usando `SERIALIZABLE`.

Registre:

- qual transação falhou;
- mensagem;
- SQLSTATE;
- estado final;
- resultado do retry.

---

### Parte 7 - Escolha de nivel

Classifique:

1. consulta simples por ID;
2. relatório que precisa de fotografia consistente;
3. reserva concorrente com limite global;
4. atualização atômica de contador;
5. exportação longa;
6. regra de pelo menos um profissional ativo.

Para cada item, indique:

```text
nível candidato;

riscos;

necessidade de retry;

duração aceitável;

alternativas de modelagem.
```

---

### Parte 8 - Contrato de retry

Documente um algoritmo de backend:

```text
máximo de tentativas;

SQLSTATE tratado;

rollback;

nova transação;

refazer leituras;

reaplicar regra;

atraso;

métrica;

erro final.
```

Não escreva Java ainda.

---

## Criterios de aceite

- o laboratório oficial da aula 294 existe;
- o arquivo e o H1 seguem a grade;
- três tabelas exclusivas foram criadas;
- duas sessões foram abertas e identificadas;
- MVCC foi explicado em nível prático;
- snapshot foi compreendido;
- dirty read foi definido;
- PostgreSQL não permitiu dirty read;
- `READ UNCOMMITTED` foi relacionado a `READ COMMITTED`;
- non-repeatable read foi demonstrado;
- phantom em `READ COMMITTED` foi demonstrado;
- `READ COMMITTED` foi identificado como nível padrão usual;
- snapshot por comando foi compreendido;
- `REPEATABLE READ` manteve leitura estável;
- phantom foi evitado em `REPEATABLE READ`;
- conflito de atualização foi demonstrado;
- write skew foi compreendido;
- `SERIALIZABLE` protegeu a invariante por aborto;
- SQLSTATE `40001` foi registrado;
- retry da transação inteira foi praticado;
- o resultado funcional foi reavaliado no retry;
- limite de tentativas foi documentado;
- o nível foi escolhido conforme regra;
- `SELECT FOR UPDATE` não foi antecipado;
- locks e deadlocks não foram aprofundados;
- tabelas de laboratório foram removidas;
- dataset principal foi preservado;
- índices anteriores foram preservados;
- o exercício foi concluído;
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
  labs/m12/aula-294-isolamento-read-committed-repeatable-read-serializable
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): praticar niveis de isolamento"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
MVCC;
snapshots;
READ COMMITTED;
REPEATABLE READ;
SERIALIZABLE;
anomalias;
serialização;
retry.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você observou duas transações concorrentes.

Aprendeu:

```text
concorrência;
MVCC;
snapshot;
dirty read;
non-repeatable read;
phantom read;
write skew;
READ UNCOMMITTED;
READ COMMITTED;
REPEATABLE READ;
SERIALIZABLE;
falha de serialização;
SQLSTATE 40001;
retry.
```

As regras principais foram:

```text
PostgreSQL não permite dirty read;

READ UNCOMMITTED comporta-se como READ COMMITTED;

READ COMMITTED usa snapshot por comando;

REPEATABLE READ mantém snapshot transacional;

PostgreSQL evita phantom em REPEATABLE READ;

snapshot estável não impede todo write skew;

SERIALIZABLE pode abortar uma transação;

falha de serialização exige retry da unidade inteira;

o nível deve proteger uma regra concreta;

transações precisam continuar curtas.
```

A próxima aula será:

```text
295 - M12.25 - Locks deadlocks e diagnostico inicial
```

Nela, você vai estudar:

- locks de tabela e de linha;
- espera por transação concorrente;
- `SELECT FOR UPDATE`;
- `NOWAIT`;
- `SKIP LOCKED`;
- `lock_timeout`;
- `pg_stat_activity`;
- `pg_locks`;
- bloqueador e bloqueado;
- deadlock;
- ordem consistente de aquisição;
- erro `deadlock detected`;
- diagnóstico inicial.

Os níveis de isolamento definem a visão e a proteção contra anomalias.

A próxima aula mostrará como transações também esperam e bloqueiam recursos.

---

# Material complementar

## Checkpoint final

- [ ] Demonstrei snapshots diferentes em `READ COMMITTED` e `REPEATABLE READ`.
- [ ] Observei conflito de atualização e write skew.
- [ ] Usei `SERIALIZABLE` e refiz uma transação abortada.
- [ ] Limpei o laboratório e fiz o commit.

---

## Troubleshooting adicional

### O segundo SELECT ainda mostra o mesmo valor em READ COMMITTED

A Sessão B não confirmou, o passo foi executado fora de ordem ou A está em outro nível.

Use:

```sql
SHOW transaction_isolation;
```

---

### O UPDATE ficou esperando

Outra transação pode estar modificando a mesma linha.

Finalize a outra sessão.

Locks serão aprofundados na aula 295.

---

### Nenhuma transacao SERIALIZABLE falhou

A ordem dos passos não criou sobreposição suficiente, uma sessão confirmou cedo demais ou a leitura não ocorreu antes das alterações.

Resete e siga o roteiro exatamente.

---

### Current transaction is aborted

O cenário produziu erro esperado.

Execute:

```sql
ROLLBACK;
```

---

### Tabela nao pode ser removida

Uma sessão ainda possui transação ou referência ativa.

Finalize as duas sessões e execute a limpeza novamente.

---

## Perguntas de revisao

1. O que é concorrência?
2. O que é MVCC?
3. O que é snapshot?
4. O que é dirty read?
5. PostgreSQL permite dirty read?
6. Como `READ UNCOMMITTED` se comporta?
7. O que é non-repeatable read?
8. O que é phantom read?
9. Qual é o nível padrão usual?
10. Como funciona `READ COMMITTED`?
11. Como funciona `REPEATABLE READ`?
12. PostgreSQL permite phantom nesse nível?
13. O que é write skew?
14. Por que atualizar linhas diferentes ainda pode quebrar regra?
15. O que `SERIALIZABLE` garante?
16. Por que uma transação pode ser abortada?
17. Qual SQLSTATE indica falha de serialização?
18. O que deve ser repetido?
19. Por que retry precisa de limite?
20. Como escolher o nível?

---

## Roteiro de resposta

1. Sobreposição temporal de transações.
2. Controle por múltiplas versões de linhas.
3. Visão de versões visíveis.
4. Leitura de dado não confirmado.
5. Não.
6. Como `READ COMMITTED`.
7. Mesma linha muda entre leituras.
8. Conjunto por condição ganha ou perde linhas.
9. `READ COMMITTED`.
10. Novo snapshot por comando.
11. Snapshot estável na transação.
12. Não no PostgreSQL.
13. Decisões concorrentes sobre conjunto compartilhado com escritas diferentes.
14. A invariante depende do conjunto, não só da linha.
15. Resultado equivalente a alguma ordem serial.
16. Para impedir uma anomalia.
17. `40001`.
18. A transação inteira.
19. Para evitar repetição infinita e contenção.
20. Pela regra, anomalia tolerada, duração e retry.

---

## Desafio opcional

Modele um cenário de estoque:

```text
produto possui dez unidades;

dois pedidos tentam reservar seis unidades cada.
```

Compare três estratégias conceituais:

```text
READ COMMITTED com UPDATE atômico condicionado;

REPEATABLE READ;

SERIALIZABLE com retry.
```

Para cada estratégia, documente:

- leitura;
- condição;
- escrita;
- anomalia possível;
- erro esperado;
- retry;
- impacto na experiência;
- necessidade futura de lock explícito.

Não implemente `FOR UPDATE` antes da aula 295.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 294 - M12.24 - Isolamento read committed repeatable read serializable

- Estudei concorrência e MVCC no PostgreSQL.
- Entendi snapshot como a visão de versões disponível para uma consulta ou transação.
- Confirmei que PostgreSQL não permite dirty read.
- Entendi que `READ UNCOMMITTED` possui comportamento de `READ COMMITTED`.
- Demonstrei leitura não repetível em `READ COMMITTED`.
- Demonstrei mudança de conjunto entre comandos em `READ COMMITTED`.
- Usei `REPEATABLE READ` para manter uma fotografia estável.
- Confirmei que PostgreSQL evita phantom nesse nível.
- Observei conflito ao atualizar uma linha alterada depois do snapshot.
- Diferenciei snapshot estável de serialização completa.
- Modelei write skew com profissionais de plantão.
- Usei `SERIALIZABLE` para proteger uma invariante global.
- Registrei falha de serialização com SQLSTATE `40001`.
- Repeti a transação inteira e refiz a decisão.
- Documentei limite, rollback e métricas para retry.
- Removi todas as tabelas exclusivas do laboratório.
- Próxima aula: locks, deadlocks e diagnóstico inicial.
```

---

## Referencia tecnica curta

```text
READ COMMITTED:
snapshot por comando.

REPEATABLE READ:
snapshot estável.

SERIALIZABLE:
equivalência serial com possibilidade de aborto.

Dirty read:
não ocorre no PostgreSQL.

Non-repeatable read:
pode ocorrer em READ COMMITTED.

Phantom:
pode ocorrer em READ COMMITTED;
não ocorre em REPEATABLE READ do PostgreSQL.

40001:
serialization_failure.

Retry:
refazer a transação inteira.
```

Regra final:

```text
isolamento nao e apenas configuracao do banco: ele define quais decisoes concorrentes a aplicacao pode aceitar e quais precisa repetir.
```