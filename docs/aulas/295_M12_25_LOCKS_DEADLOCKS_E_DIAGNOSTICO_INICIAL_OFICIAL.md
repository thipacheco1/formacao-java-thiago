# 295 - M12.25 - Locks deadlocks e diagnostico inicial

## Apresentacao da aula

Na aula 294, você abriu duas sessões e observou como diferentes níveis de isolamento alteram a visão dos dados.

Praticou:

```text
READ COMMITTED;
REPEATABLE READ;
SERIALIZABLE;
snapshots;
write skew;
falha de serialização;
retry da transação inteira.
```

Agora o foco muda da visibilidade para a disputa por recursos.

Considere duas transações:

```text
Sessão A:
inicia uma atualização sobre a Ordem 1;
mantém a transação aberta.

Sessão B:
tenta atualizar a mesma Ordem 1.
```

A Sessão B não pode alterar livremente uma versão concorrente da mesma linha.

Ela pode:

- aguardar;
- falhar por timeout;
- falhar imediatamente com `NOWAIT`;
- ignorar a linha bloqueada com `SKIP LOCKED`;
- participar de um ciclo que termina em deadlock.

Os mecanismos usados para coordenar esse acesso são locks.

Locks aparecem em diversos níveis:

```text
relação;
linha;
transação;
objeto;
metadado.
```

Nesta aula, você vai praticar principalmente:

- locks de linha causados por `UPDATE`;
- locks explícitos com `SELECT FOR UPDATE`;
- espera entre sessões;
- `lock_timeout`;
- `NOWAIT`;
- `SKIP LOCKED`;
- locks de tabela em nível introdutório;
- diagnóstico com `pg_stat_activity`;
- diagnóstico com `pg_locks`;
- identificação de bloqueadores com `pg_blocking_pids`;
- transações `idle in transaction`;
- deadlock entre duas linhas;
- SQLSTATE `40P01`;
- prevenção por ordem consistente;
- recuperação após abortar uma transação.

A prática será controlada.

Você criará três tabelas exclusivas da aula:

```text
app.recurso_lock_aula_295;

app.fila_lock_aula_295;

app.conta_deadlock_aula_295.
```

Elas serão removidas ao final.

Nenhuma tabela do dataset principal será alterada.

A próxima aula será:

```text
296 - M12.26 - Paginacao SQL offset keyset e tradeoffs
```

Por isso, esta aula não avançará para paginação, cursores de API ou keyset pagination.

Ao final, você deverá conseguir identificar quem bloqueia quem, interpretar esperas, usar formas seguras de aquisição de linha e reproduzir um deadlock sem deixar sessões ou dados pendentes.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
293:
transações ACID.

294:
níveis de isolamento.

295:
locks, deadlocks e diagnóstico inicial.

296:
paginação SQL offset e keyset.

297:
modelagem integrada de Ordem de Serviço.

298:
consultas e relatórios de backend.
```

Uma transação possui duas dimensões diferentes:

```text
visibilidade:
quais versões dos dados ela enxerga.

bloqueio:
quais operações concorrentes precisam esperar.
```

O isolamento da aula 294 não elimina locks.

Mesmo em `READ COMMITTED`, duas atualizações da mesma linha precisam ser coordenadas.

Mesmo em `SERIALIZABLE`, uma transação pode esperar por outra antes de receber commit ou falha de serialização.

O diagnóstico exige responder:

```text
qual sessão está esperando?

qual sessão mantém o recurso?

qual comando está aberto?

há quanto tempo a transação existe?

o lock foi concedido?

qual tipo de espera está ativo?

existe um ciclo de dependências?
```

Essas perguntas serão traduzidas para consultas ao catálogo.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-295-locks-deadlocks-diagnostico-inicial
```

Estrutura final:

```text
labs
└── m12
    └── aula-295-locks-deadlocks-diagnostico-inicial
        ├── README.md
        ├── docs
        │   ├── checklist-diagnostico.md
        │   └── roteiro-sessoes.md
        └── sql
            ├── 00_preparar_ambiente.sql
            ├── 01_inspecionar_sessao.sql
            ├── 02_lock_linha_sessao_a.sql
            ├── 03_lock_linha_sessao_b.sql
            ├── 04_nowait_sessao_a.sql
            ├── 05_nowait_sessao_b.sql
            ├── 06_skip_locked_worker_a.sql
            ├── 07_skip_locked_worker_b.sql
            ├── 08_diagnosticar_bloqueio.sql
            ├── 09_lock_tabela_sessao_a.sql
            ├── 10_lock_tabela_sessao_b.sql
            ├── 11_deadlock_sessao_a.sql
            ├── 12_deadlock_sessao_b.sql
            ├── 13_prevencao_ordem_consistente.sql
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

O laboratório exige:

- duas sessões do `psql`;
- uma terceira sessão opcional para diagnóstico;
- execução dos passos na ordem indicada;
- `COMMIT` ou `ROLLBACK` ao final de cada cenário;
- limpeza antes do checkpoint final.

---

## Conceito essencial

### O que e um lock

Lock é um mecanismo de coordenação sobre um recurso compartilhado.

Ele informa que determinada operação possui ou solicita um modo de acesso.

Exemplo:

```text
uma transação altera uma linha;

outra transação tenta alterar a mesma linha;

a segunda precisa aguardar a primeira finalizar.
```

O objetivo não é impedir concorrência.

O objetivo é evitar combinações incompatíveis de operações.

Leituras comuns continuam concorrentes em muitos cenários por causa do MVCC.

---

### Lock nao e transacao

Transação e lock são relacionados, mas não são a mesma coisa.

Transação:

```text
unidade de trabalho;
possui BEGIN, COMMIT e ROLLBACK.
```

Lock:

```text
coordenação de acesso a recurso;
normalmente pertence a uma transação;
é liberado ao final da transação.
```

Um lock de linha adquirido por `UPDATE` permanece até `COMMIT` ou `ROLLBACK`, não apenas até o fim do comando.

---

### Locks implicitos

Muitos comandos adquirem locks sem você escrever `LOCK`.

Exemplos:

```text
SELECT:
lock de relação compatível com leituras normais.

INSERT, UPDATE e DELETE:
locks de relação e de linhas afetadas.

ALTER TABLE:
lock mais forte sobre a relação.
```

Isso é normal.

A aplicação precisa considerar a duração da transação porque ela controla a duração de diversos locks.

---

### Lock de linha com UPDATE

Exemplo:

```sql
BEGIN;

UPDATE app.recurso_lock_aula_295
SET saldo = saldo - 100
WHERE id = 980001;
```

A linha modificada fica protegida contra atualizações incompatíveis de outra transação.

Uma segunda sessão executando outro `UPDATE` sobre a mesma linha aguarda.

Uma leitura comum pode continuar enxergando a versão confirmada anterior.

---

### Espera nao e deadlock

Uma sessão aguardando outra não significa deadlock.

Exemplo:

```text
A mantém lock;

B aguarda A;

A confirma;

B continua.
```

Existe uma cadeia simples.

Deadlock exige ciclo:

```text
A espera B;

B espera A.
```

PostgreSQL consegue detectar o ciclo e aborta uma das transações.

---

### SELECT FOR UPDATE

`SELECT FOR UPDATE` lê e bloqueia as linhas selecionadas para atualizações concorrentes incompatíveis.

Exemplo:

```sql
BEGIN;

SELECT
    id,
    saldo
FROM app.recurso_lock_aula_295
WHERE id = 980001
FOR UPDATE;
```

Uso típico:

1. localizar a linha;
2. bloqueá-la;
3. validar regra;
4. alterar;
5. confirmar rapidamente.

Não abra o lock enquanto aguarda interação humana ou serviço externo.

---

### FOR NO KEY UPDATE

`FOR NO KEY UPDATE` é um lock de linha um pouco menos forte que `FOR UPDATE`.

Ele é usado automaticamente por determinados `UPDATE` que não alteram colunas de chave relevantes.

Para esta aula, a prática principal usa `FOR UPDATE`.

O importante é reconhecer que PostgreSQL possui diferentes modos de lock de linha e compatibilidades próprias.

---

### FOR SHARE e FOR KEY SHARE

Outros modos incluem:

```text
FOR SHARE;

FOR KEY SHARE.
```

Eles permitem leituras com proteção contra determinadas alterações concorrentes.

São relevantes para integridade referencial e fluxos avançados.

Não serão praticados em profundidade nesta aula.

---

### NOWAIT

Forma:

```sql
SELECT ...
FOR UPDATE NOWAIT;
```

Se a linha já está bloqueada de maneira incompatível, a instrução falha imediatamente.

Mensagem típica:

```text
could not obtain lock on row in relation
```

SQLSTATE comum:

```text
55P03
```

Uso possível:

- operação interativa que não pode aguardar;
- tentativa rápida;
- retorno de conflito ao usuário;
- mecanismo de retry controlado.

`NOWAIT` não resolve a disputa.

Ele apenas troca espera por falha imediata.

---

### SKIP LOCKED

Forma:

```sql
SELECT ...
FOR UPDATE SKIP LOCKED;
```

Linhas bloqueadas são ignoradas.

Esse recurso é útil em filas com múltiplos workers:

```text
worker A bloqueia item 1;

worker B ignora item 1 e recebe item 2.
```

Limitações:

- o resultado não representa uma visão completa do conjunto;
- itens bloqueados podem parecer ausentes;
- uso fora de fila pode produzir resultado funcional incorreto;
- starvation precisa ser monitorada;
- ordenação e critérios precisam ser determinísticos.

Use `SKIP LOCKED` quando ignorar temporariamente uma linha ocupada faz parte da regra.

---

### lock_timeout

`lock_timeout` define quanto tempo uma instrução espera para adquirir um lock.

Exemplo:

```sql
SET LOCAL lock_timeout = '3s';
```

Se o tempo expira, PostgreSQL cancela a instrução.

Isso é diferente de:

```text
statement_timeout:
limite total da instrução.

idle_in_transaction_session_timeout:
limite de sessão ociosa dentro de transação.
```

Nesta aula, `lock_timeout` evita que o laboratório permaneça preso indefinidamente.

---

### Lock de tabela

Forma:

```sql
LOCK TABLE app.recurso_lock_aula_295
IN ACCESS EXCLUSIVE MODE;
```

`ACCESS EXCLUSIVE` conflita com todos os modos de lock de tabela, inclusive leituras comuns.

É o modo mais forte.

Não use em aplicação comum sem necessidade.

Alguns comandos DDL precisam desse modo ou de modos fortes.

O laboratório o usará apenas para tornar uma espera de tabela visível.

---

### Modos de tabela em visao inicial

Alguns modos importantes:

```text
ACCESS SHARE:
leitura comum.

ROW EXCLUSIVE:
INSERT, UPDATE e DELETE.

SHARE:
certas operações de manutenção.

ACCESS EXCLUSIVE:
bloqueio mais forte.
```

A matriz completa de compatibilidade é extensa.

Nesta aula, você precisa reconhecer:

```text
o nome do modo;

se granted é true ou false;

qual sessão aguarda;

qual objeto está relacionado.
```

---

### pg_stat_activity

`pg_stat_activity` mostra sessões conectadas.

Campos úteis:

```text
pid;

usename;

datname;

state;

xact_start;

query_start;

wait_event_type;

wait_event;

query.
```

Estados comuns:

```text
active;

idle;

idle in transaction;

idle in transaction (aborted).
```

`idle in transaction` merece atenção porque a sessão não está executando comando, mas mantém a transação aberta.

---

### pg_locks

`pg_locks` mostra locks mantidos ou aguardados.

Campos úteis:

```text
pid;

locktype;

relation;

page;

tuple;

transactionid;

mode;

granted.
```

`granted = true`:

```text
lock concedido.
```

`granted = false`:

```text
sessão aguardando.
```

Nem toda espera de linha aparece de forma intuitiva como uma linha `tuple` não concedida.

Frequentemente a sessão aguarda um lock sobre o ID da transação que modificou a linha.

Por isso, combine `pg_locks` com `pg_stat_activity` e `pg_blocking_pids`.

---

### pg_blocking_pids

Forma:

```sql
SELECT pg_blocking_pids(pid)
FROM pg_stat_activity;
```

A função retorna os PIDs que bloqueiam determinada sessão.

Isso simplifica o diagnóstico:

```text
PID bloqueado;

lista de PIDs bloqueadores;

consulta de cada sessão;

tempo da transação.
```

Não finalize um backend automaticamente apenas porque ele aparece como bloqueador.

Primeiro identifique o contexto.

---

### wait_event_type e wait_event

Quando uma sessão aguarda lock, podem aparecer:

```text
wait_event_type:
Lock.

wait_event:
transactionid;
tuple;
relation;
```

O valor depende da fase e do recurso.

Esses campos ajudam a separar:

- CPU;
- I/O;
- cliente;
- lock;
- outros tipos de espera.

---

### Consulta bloqueadora

Uma consulta pode terminar, mas a transação permanecer aberta.

Exemplo:

```text
UPDATE executou;

cliente ficou idle in transaction;

outra sessão aguarda.
```

Por isso, não procure apenas consultas `active`.

Analise:

```text
state;

xact_start;

query_start;

última query;

bloqueadores.
```

---

### Cancelar ou terminar sessao

PostgreSQL possui funções administrativas como:

```text
pg_cancel_backend;

pg_terminate_backend.
```

Elas podem exigir permissão e causar impacto funcional.

Esta aula não as executará.

Em ambiente real:

1. confirme o bloqueador;
2. entenda a transação;
3. avalie impacto;
4. contate o responsável;
5. cancele ou termine somente com procedimento autorizado.

---

### Deadlock

Deadlock ocorre quando existe ciclo de espera.

Exemplo com duas contas:

```text
Sessão A:
bloqueia Conta 1.

Sessão B:
bloqueia Conta 2.

Sessão A:
tenta Conta 2 e aguarda B.

Sessão B:
tenta Conta 1 e aguarda A.
```

Nenhuma consegue continuar sozinha.

PostgreSQL detecta o ciclo depois de um intervalo e aborta uma das transações.

---

### SQLSTATE 40P01

Erro de deadlock:

```text
deadlock detected
```

SQLSTATE:

```text
40P01
```

A transação escolhida como vítima fica abortada.

Ela precisa executar:

```sql
ROLLBACK;
```

A outra pode continuar depois que o lock da vítima é liberado.

No laboratório, as duas sessões executarão rollback para restaurar os saldos originais.

---

### Vitima do deadlock

Não dependa de qual sessão será abortada.

O PostgreSQL escolhe uma transação para quebrar o ciclo.

A ordem pode variar conforme:

- momento dos comandos;
- dependências;
- custo;
- contexto interno.

O código deve tratar `40P01` independentemente de ser Sessão A ou B.

---

### Prevenir deadlock por ordem consistente

Uma técnica importante:

```text
todas as transações bloqueiam recursos na mesma ordem.
```

Exemplo:

```text
sempre menor ID primeiro;

depois maior ID.
```

Se A e B adquirem Conta 1 antes de Conta 2, uma pode aguardar, mas não se forma o ciclo inverso.

Isso reduz deadlocks.

Não elimina todos os casos possíveis de sistemas complexos, mas é uma regra fundamental.

---

### Retry depois de deadlock

Depois de `40P01`:

1. execute rollback;
2. descarte decisões da transação;
3. aguarde pequeno intervalo;
4. inicie nova transação;
5. refaça leituras;
6. adquira locks em ordem consistente;
7. repita a unidade;
8. limite as tentativas.

Assim como na falha de serialização, repita a unidade inteira.

---

### Locks e indices

Um índice pode reduzir a quantidade de linhas examinadas e a duração de uma operação.

Porém:

- índice não elimina lock de linha alterada;
- plano ruim pode manter transação mais tempo;
- atualização em massa bloqueia muitas linhas;
- ausência de índice em foreign key pode aumentar trabalho em alterações do pai.

Performance e concorrência se relacionam, mas continuam sendo problemas distintos.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-295-locks-deadlocks-diagnostico-inicial\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-295-locks-deadlocks-diagnostico-inicial\docs"

Set-Location `
  "labs\m12\aula-295-locks-deadlocks-diagnostico-inicial"
```

Confirme:

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
DROP TABLE IF EXISTS app.fila_lock_aula_295;
DROP TABLE IF EXISTS app.conta_deadlock_aula_295;
DROP TABLE IF EXISTS app.recurso_lock_aula_295;

CREATE TABLE app.recurso_lock_aula_295 (
    id bigint PRIMARY KEY,
    nome text NOT NULL UNIQUE,
    saldo numeric(12, 2) NOT NULL,
    status text NOT NULL,

    CONSTRAINT ck_recurso_lock_saldo
        CHECK (saldo >= 0),

    CONSTRAINT ck_recurso_lock_status
        CHECK (
            status IN (
                'ATIVO',
                'INATIVO'
            )
        )
);

CREATE TABLE app.fila_lock_aula_295 (
    id bigint PRIMARY KEY,
    descricao text NOT NULL,
    status text NOT NULL,
    prioridade integer NOT NULL,
    processada_por text,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_fila_lock_status
        CHECK (
            status IN (
                'PENDENTE',
                'PROCESSANDO',
                'CONCLUIDO'
            )
        )
);

CREATE TABLE app.conta_deadlock_aula_295 (
    id bigint PRIMARY KEY,
    nome text NOT NULL UNIQUE,
    saldo numeric(12, 2) NOT NULL,

    CONSTRAINT ck_conta_deadlock_saldo
        CHECK (saldo >= 0)
);

INSERT INTO app.recurso_lock_aula_295 (
    id,
    nome,
    saldo,
    status
)
VALUES
    (
        980001,
        'Recurso principal',
        1000.00,
        'ATIVO'
    ),
    (
        980002,
        'Recurso secundário',
        500.00,
        'ATIVO'
    );

INSERT INTO app.fila_lock_aula_295 (
    id,
    descricao,
    status,
    prioridade
)
VALUES
    (
        981001,
        'Processar ordem crítica',
        'PENDENTE',
        100
    ),
    (
        981002,
        'Processar ordem prioritária',
        'PENDENTE',
        80
    ),
    (
        981003,
        'Processar ordem normal',
        'PENDENTE',
        50
    ),
    (
        981004,
        'Processar ordem de baixa prioridade',
        'PENDENTE',
        10
    );

INSERT INTO app.conta_deadlock_aula_295 (
    id,
    nome,
    saldo
)
VALUES
    (
        982001,
        'Conta A',
        1000.00
    ),
    (
        982002,
        'Conta B',
        1000.00
    );

ANALYZE app.recurso_lock_aula_295;
ANALYZE app.fila_lock_aula_295;
ANALYZE app.conta_deadlock_aula_295;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-295-locks-deadlocks-diagnostico-inicial\sql\00_preparar_ambiente.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

### 3. Criar 01_inspecionar_sessao.sql

Crie:

```text
sql/01_inspecionar_sessao.sql
```

Conteúdo:

```sql
SELECT
    pg_backend_pid() AS pid,
    current_database() AS banco,
    current_user AS usuario,
    current_setting(
        'transaction_isolation'
    ) AS isolamento;

SELECT
    pid,
    usename,
    state,
    xact_start,
    query_start,
    wait_event_type,
    wait_event,
    left(query, 120) AS query_resumida
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY pid;
```

Abra dois terminais:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Execute `01_inspecionar_sessao.sql` em cada um e registre os PIDs.

---

### 4. Criar 02_lock_linha_sessao_a.sql

Crie:

```text
sql/02_lock_linha_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN;

UPDATE app.recurso_lock_aula_295
SET saldo = saldo - 100.00
WHERE id = 980001
RETURNING
    id,
    nome,
    saldo;

-- Mantenha a transação aberta.
-- Execute o roteiro da Sessão B.

-- PASSO A2
ROLLBACK;
```

Depois do `UPDATE`, A mantém lock sobre a linha.

---

### 5. Criar 03_lock_linha_sessao_b.sql

Crie:

```text
sql/03_lock_linha_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN;

SET LOCAL lock_timeout = '3s';

SELECT
    id,
    nome,
    saldo
FROM app.recurso_lock_aula_295
WHERE id = 980001;

-- A leitura comum encontra a versão confirmada anterior.

UPDATE app.recurso_lock_aula_295
SET saldo = saldo + 50.00
WHERE id = 980001;

-- O UPDATE aguarda e falha depois de aproximadamente três segundos.

ROLLBACK;
```

A leitura comum não deve mostrar o saldo não confirmado de A.

O `UPDATE` deve falhar por timeout de lock.

Depois, execute A2.

---

### 6. Criar 04_nowait_sessao_a.sql

Crie:

```text
sql/04_nowait_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN;

SELECT
    id,
    nome,
    saldo
FROM app.recurso_lock_aula_295
WHERE id = 980001
FOR UPDATE;

-- PARE.
-- Execute a Sessão B.

-- PASSO A2
ROLLBACK;
```

---

### 7. Criar 05_nowait_sessao_b.sql

Crie:

```text
sql/05_nowait_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN;

SELECT
    id,
    nome,
    saldo
FROM app.recurso_lock_aula_295
WHERE id = 980001
FOR UPDATE NOWAIT;

-- Deve falhar imediatamente com lock_not_available.

ROLLBACK;
```

Registre:

```text
mensagem;

SQLSTATE 55P03, quando exibido;

tempo aproximado;

PID bloqueador.
```

Depois execute A2.

---

### 8. Resetar a fila

Antes do cenário de workers:

```sql
UPDATE app.fila_lock_aula_295
SET
    status = 'PENDENTE',
    processada_por = NULL;
```

---

### 9. Criar 06_skip_locked_worker_a.sql

Crie:

```text
sql/06_skip_locked_worker_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN;

WITH proxima AS (
    SELECT id
    FROM app.fila_lock_aula_295
    WHERE status = 'PENDENTE'
    ORDER BY
        prioridade DESC,
        id
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
UPDATE app.fila_lock_aula_295 AS fila
SET
    status = 'PROCESSANDO',
    processada_por = 'WORKER_A'
FROM proxima
WHERE fila.id = proxima.id
RETURNING
    fila.id,
    fila.descricao,
    fila.prioridade,
    fila.processada_por;

-- Mantenha a transação aberta.
-- Execute B1.

-- PASSO A2
COMMIT;
```

A deve selecionar o item de prioridade `100`.

---

### 10. Criar 07_skip_locked_worker_b.sql

Crie:

```text
sql/07_skip_locked_worker_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN;

WITH proxima AS (
    SELECT id
    FROM app.fila_lock_aula_295
    WHERE status = 'PENDENTE'
    ORDER BY
        prioridade DESC,
        id
    FOR UPDATE SKIP LOCKED
    LIMIT 1
)
UPDATE app.fila_lock_aula_295 AS fila
SET
    status = 'PROCESSANDO',
    processada_por = 'WORKER_B'
FROM proxima
WHERE fila.id = proxima.id
RETURNING
    fila.id,
    fila.descricao,
    fila.prioridade,
    fila.processada_por;

COMMIT;
```

B deve ignorar a linha bloqueada por A e selecionar prioridade `80`.

Depois execute A2 e consulte:

```sql
SELECT
    id,
    prioridade,
    status,
    processada_por
FROM app.fila_lock_aula_295
ORDER BY
    prioridade DESC,
    id;
```

---

### 11. Preparar um bloqueio diagnosticavel

Na Sessão A:

```sql
BEGIN;

UPDATE app.recurso_lock_aula_295
SET status = 'INATIVO'
WHERE id = 980002;
```

Mantenha aberta.

Na Sessão B:

```sql
BEGIN;

UPDATE app.recurso_lock_aula_295
SET saldo = saldo + 10
WHERE id = 980002;
```

A Sessão B ficará aguardando.

Não defina `lock_timeout` neste cenário.

Use a Sessão A ou uma terceira sessão para diagnosticar.

---

### 12. Criar 08_diagnosticar_bloqueio.sql

Crie:

```text
sql/08_diagnosticar_bloqueio.sql
```

Conteúdo:

```sql
SELECT
    atividade.pid AS blocked_pid,
    atividade.usename,
    atividade.state,
    atividade.xact_start,
    atividade.query_start,
    atividade.wait_event_type,
    atividade.wait_event,
    pg_blocking_pids(
        atividade.pid
    ) AS blocking_pids,
    left(
        atividade.query,
        160
    ) AS blocked_query
FROM pg_stat_activity AS atividade
WHERE atividade.datname = current_database()
  AND cardinality(
      pg_blocking_pids(
          atividade.pid
      )
  ) > 0
ORDER BY atividade.pid;

SELECT
    bloqueada.pid AS blocked_pid,
    bloqueadora.pid AS blocker_pid,
    bloqueadora.state AS blocker_state,
    bloqueadora.xact_start AS blocker_xact_start,
    left(
        bloqueadora.query,
        160
    ) AS blocker_query
FROM pg_stat_activity AS bloqueada
CROSS JOIN LATERAL unnest(
    pg_blocking_pids(
        bloqueada.pid
    )
) AS pid_bloqueador(pid)
INNER JOIN pg_stat_activity AS bloqueadora
    ON bloqueadora.pid = pid_bloqueador.pid
WHERE bloqueada.datname = current_database()
ORDER BY
    bloqueada.pid,
    bloqueadora.pid;

SELECT
    atividade.pid,
    atividade.state,
    lock.locktype,
    lock.mode,
    lock.granted,
    namespace.nspname AS schema_name,
    classe.relname AS relation_name,
    lock.transactionid,
    atividade.wait_event_type,
    atividade.wait_event,
    left(
        atividade.query,
        120
    ) AS query_resumida
FROM pg_locks AS lock
INNER JOIN pg_stat_activity AS atividade
    ON atividade.pid = lock.pid
LEFT JOIN pg_class AS classe
    ON classe.oid = lock.relation
LEFT JOIN pg_namespace AS namespace
    ON namespace.oid = classe.relnamespace
WHERE atividade.datname = current_database()
  AND (
      classe.relname IN (
          'recurso_lock_aula_295',
          'fila_lock_aula_295',
          'conta_deadlock_aula_295'
      )
      OR cardinality(
          pg_blocking_pids(
              atividade.pid
          )
      ) > 0
  )
ORDER BY
    atividade.pid,
    lock.granted,
    lock.locktype,
    lock.mode;
```

Procure:

```text
blocked_pid;

blocking_pids;

wait_event_type = Lock;

wait_event;

granted = false;

transação bloqueadora.
```

Depois:

1. execute `ROLLBACK` na Sessão A;
2. a atualização da Sessão B continuará;
3. execute `ROLLBACK` na Sessão B.

---

### 13. Criar 09_lock_tabela_sessao_a.sql

Crie:

```text
sql/09_lock_tabela_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN;

LOCK TABLE app.recurso_lock_aula_295
IN ACCESS EXCLUSIVE MODE;

SELECT
    'ACCESS EXCLUSIVE adquirido pela Sessão A'
        AS situacao;

-- PARE.
-- Execute B1.

-- PASSO A2
ROLLBACK;
```

---

### 14. Criar 10_lock_tabela_sessao_b.sql

Crie:

```text
sql/10_lock_tabela_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN;

SET LOCAL lock_timeout = '3s';

SELECT
    id,
    nome,
    saldo
FROM app.recurso_lock_aula_295
ORDER BY id;

-- A leitura deve falhar por timeout porque
-- ACCESS EXCLUSIVE conflita com ACCESS SHARE.

ROLLBACK;
```

Depois execute A2.

Esse modo forte foi usado apenas para demonstração.

---

### 15. Resetar contas do deadlock

Execute:

```sql
UPDATE app.conta_deadlock_aula_295
SET saldo = 1000.00
WHERE id IN (
    982001,
    982002
);
```

---

### 16. Criar 11_deadlock_sessao_a.sql

Crie:

```text
sql/11_deadlock_sessao_a.sql
```

Conteúdo:

```sql
-- PASSO A1
BEGIN;

UPDATE app.conta_deadlock_aula_295
SET saldo = saldo - 100.00
WHERE id = 982001
RETURNING
    id,
    nome,
    saldo;

-- Execute B1.

-- PASSO A2
UPDATE app.conta_deadlock_aula_295
SET saldo = saldo + 100.00
WHERE id = 982002
RETURNING
    id,
    nome,
    saldo;

-- A deve ficar aguardando B.
-- Execute B2.

-- PASSO A3
ROLLBACK;
```

---

### 17. Criar 12_deadlock_sessao_b.sql

Crie:

```text
sql/12_deadlock_sessao_b.sql
```

Conteúdo:

```sql
-- PASSO B1
BEGIN;

UPDATE app.conta_deadlock_aula_295
SET saldo = saldo - 200.00
WHERE id = 982002
RETURNING
    id,
    nome,
    saldo;

-- Execute A2.

-- PASSO B2
UPDATE app.conta_deadlock_aula_295
SET saldo = saldo + 200.00
WHERE id = 982001
RETURNING
    id,
    nome,
    saldo;

-- PostgreSQL detectará o ciclo.
-- Uma das sessões receberá:
-- deadlock detected
-- SQLSTATE 40P01.

-- PASSO B3
ROLLBACK;
```

Depois do erro:

1. execute `ROLLBACK` na sessão abortada;
2. a outra sessão pode concluir o comando pendente;
3. execute `ROLLBACK` também na outra;
4. confirme saldos `1000.00`.

A vítima pode variar.

---

### 18. Criar 13_prevencao_ordem_consistente.sql

Crie:

```text
sql/13_prevencao_ordem_consistente.sql
```

Conteúdo:

```sql
BEGIN;

SELECT
    id,
    nome,
    saldo
FROM app.conta_deadlock_aula_295
WHERE id IN (
    982001,
    982002
)
ORDER BY id
FOR UPDATE;

UPDATE app.conta_deadlock_aula_295
SET saldo = saldo - 50.00
WHERE id = 982001;

UPDATE app.conta_deadlock_aula_295
SET saldo = saldo + 50.00
WHERE id = 982002;

ROLLBACK;
```

Regra:

```text
todas as transações do mesmo fluxo devem bloquear
982001 antes de 982002.
```

Se duas sessões seguirem a mesma ordem, pode haver espera, mas o ciclo inverso é evitado.

---

### 19. Criar docs/roteiro-sessoes.md

Crie:

```text
docs/roteiro-sessoes.md
```

Conteúdo:

```markdown
# Roteiro de sessões da aula 295

**Sessão A**

- PID:
- terminal:
- estado final:

**Sessão B**

- PID:
- terminal:
- estado final:

**Cenário 1 — Lock de linha**

1. A executa update e permanece aberta.
2. B lê a versão confirmada.
3. B tenta update com timeout.
4. B executa rollback.
5. A executa rollback.

**Cenário 2 — NOWAIT**

1. A usa `FOR UPDATE`.
2. B usa `FOR UPDATE NOWAIT`.
3. Registrar SQLSTATE.
4. Finalizar as duas transações.

**Cenário 3 — SKIP LOCKED**

1. Resetar fila.
2. A reserva o primeiro item.
3. B ignora o item de A.
4. B confirma.
5. A confirma.
6. Conferir workers.

**Cenário 4 — Diagnóstico**

1. A bloqueia a linha 980002.
2. B tenta atualizar e aguarda.
3. Executar consulta de diagnóstico.
4. Registrar bloqueado e bloqueador.
5. Executar rollback nas duas sessões.

**Cenário 5 — Deadlock**

1. A bloqueia Conta A.
2. B bloqueia Conta B.
3. A tenta Conta B.
4. B tenta Conta A.
5. Registrar `40P01`.
6. Executar rollback nas duas.
```

---

### 20. Criar docs/checklist-diagnostico.md

Crie:

```text
docs/checklist-diagnostico.md
```

Conteúdo:

```markdown
# Checklist de diagnóstico de locks

1. Identificar o PID bloqueado.
2. Verificar `state`.
3. Verificar `wait_event_type` e `wait_event`.
4. Consultar `pg_blocking_pids`.
5. Ler a consulta bloqueada.
6. Ler a consulta do bloqueador.
7. Comparar `xact_start` e `query_start`.
8. Verificar `idle in transaction`.
9. Consultar modos e `granted` em `pg_locks`.
10. Confirmar objeto e transação envolvidos.
11. Avaliar impacto antes de cancelar sessão.
12. Corrigir a causa: duração, ordem, índice ou fronteira.
13. Registrar SQLSTATE e tempo de espera.
14. Confirmar `COMMIT` ou `ROLLBACK` ao final.
```

---

### 21. Criar 14_exercicio.sql

Crie:

```text
sql/14_exercicio.sql
```

Inclua blocos comentados para execução em duas sessões.

Use IDs entre:

```text
983000 e 983099.
```

Não deixe transações abertas ao final.

---

### 22. Criar 15_limpar_ambiente.sql

Crie:

```text
sql/15_limpar_ambiente.sql
```

Conteúdo:

```sql
DROP TABLE IF EXISTS app.fila_lock_aula_295;
DROP TABLE IF EXISTS app.conta_deadlock_aula_295;
DROP TABLE IF EXISTS app.recurso_lock_aula_295;
```

Antes de executar:

```text
confirme COMMIT ou ROLLBACK nas duas sessões;
encerre qualquer comando bloqueado;
feche sessões adicionais.
```

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
        'app.recurso_lock_aula_295'
    ) AS recurso_lock,
    to_regclass(
        'app.fila_lock_aula_295'
    ) AS fila_lock,
    to_regclass(
        'app.conta_deadlock_aula_295'
    ) AS conta_deadlock;

SELECT
    pid,
    state,
    xact_start,
    wait_event_type,
    wait_event,
    pg_blocking_pids(pid) AS blocking_pids,
    left(query, 120) AS query_resumida
FROM pg_stat_activity
WHERE datname = current_database()
  AND (
      state LIKE 'idle in transaction%'
      OR cardinality(
          pg_blocking_pids(pid)
      ) > 0
  )
ORDER BY pid;

SELECT
    (SELECT count(*) FROM app.ordem_servico)
        AS ordens_principais,
    (SELECT count(*) FROM app.atividade)
        AS atividades_principais,
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

Resultado esperado:

```text
três tabelas da aula removidas;

nenhuma sessão bloqueada pelo laboratório;

nenhuma sessão idle in transaction do laboratório;

dataset principal preservado;

seis índices principais preservados.
```

---

## Entendendo o que foi feito

### Lock de linha manteve integridade

A primeira transação alterou uma linha.

A segunda não conseguiu atualizar a mesma versão sem aguardar a finalização.

---

### Leitura comum continuou pelo MVCC

Enquanto A possuía alteração não confirmada, B conseguiu ler a versão confirmada anterior.

Bloqueio de escrita não significou bloqueio de toda leitura.

---

### NOWAIT trocou espera por erro

A instrução falhou imediatamente com `55P03`.

Esse comportamento pode ser apropriado para uma operação interativa que não deseja aguardar.

---

### SKIP LOCKED distribuiu trabalho

O Worker B ignorou o item reservado pelo Worker A e processou o próximo.

O resultado foi adequado porque o domínio era uma fila.

---

### Catalogo revelou a cadeia

`pg_stat_activity`, `pg_locks` e `pg_blocking_pids` mostraram:

```text
sessão bloqueada;

sessão bloqueadora;

estado;

espera;

consulta;

início da transação.
```

---

### Deadlock foi um ciclo

Aguardos em direções opostas formaram o ciclo.

PostgreSQL abortou uma transação com `40P01`.

Rollback liberou os recursos.

---

### Ordem consistente preveniu o ciclo

Adquirir Conta A antes de Conta B em todos os fluxos transforma o ciclo em uma espera simples.

A prevenção foi feita pelo desenho, não por ignorar o erro.

---

## Erros comuns importantes

### Deixar sessao idle in transaction

A consulta terminou, mas a transação continua mantendo locks e versões.

Finalize rapidamente.

---

### Usar SKIP LOCKED em relatorio

Linhas ocupadas desaparecem temporariamente.

O relatório fica incompleto.

---

### Tratar todo bloqueador como problema

Uma transação curta bloqueando por milissegundos pode ser normal.

Analise duração e contexto.

---

### Tentar continuar depois do deadlock

A transação vítima está abortada.

Execute rollback e repita a unidade.

---

### Corrigir deadlock somente com timeout

Timeout reduz espera, mas não remove o ciclo de aquisição inconsistente.

Corrija a ordem e a fronteira.

---

## Comandos uteis

### Bloquear linha

```sql
SELECT ...
FOR UPDATE;
```

### Falhar imediatamente

```sql
SELECT ...
FOR UPDATE NOWAIT;
```

### Ignorar linha ocupada

```sql
SELECT ...
FOR UPDATE SKIP LOCKED;
```

### Limitar espera

```sql
SET LOCAL lock_timeout = '3s';
```

### Identificar bloqueadores

```sql
SELECT pg_blocking_pids(pid)
FROM pg_stat_activity;
```

---

## Exercicio guiado

No arquivo:

```text
sql/14_exercicio.sql
```

resolva os cenários abaixo.

### Parte 1 - Espera e timeout

Crie recurso `983001`.

Sessão A atualiza e mantém a transação aberta.

Sessão B usa:

```sql
SET LOCAL lock_timeout = '2s';
```

e tenta atualizar.

Registre:

- tempo;
- mensagem;
- SQLSTATE;
- valor depois dos rollbacks.

---

### Parte 2 - NOWAIT

Repita com:

```sql
FOR UPDATE NOWAIT.
```

Compare:

```text
espera com timeout;

falha imediata.
```

---

### Parte 3 - Dois workers

Crie quatro itens de fila com prioridades diferentes.

Execute dois workers com `SKIP LOCKED`.

Confirme:

- IDs diferentes;
- prioridade respeitada;
- nenhum item processado duas vezes;
- transações curtas.

---

### Parte 4 - Diagnostico

Enquanto B estiver bloqueada:

1. identifique o PID;
2. obtenha `blocking_pids`;
3. consulte a query do bloqueador;
4. registre `xact_start`;
5. verifique `wait_event`;
6. identifique locks concedidos e aguardados;
7. encerre com rollback.

---

### Parte 5 - Idle in transaction

Sessão A:

```text
BEGIN;
UPDATE;
fica sem executar comando.
```

Na sessão de diagnóstico, confirme:

```text
state = idle in transaction.
```

Registre por que isso é perigoso.

Finalize A.

---

### Parte 6 - Deadlock

Use dois recursos novos.

Reproduza o ciclo em ordens opostas.

Registre:

- sessão vítima;
- SQLSTATE `40P01`;
- estado abortado;
- valor final depois dos rollbacks.

---

### Parte 7 - Prevencao

Refaça o fluxo adquirindo IDs em ordem crescente.

Mostre que existe no máximo espera, sem ciclo.

---

### Parte 8 - Parecer de backend

Para uma operação de reserva de Ordem, escolha entre:

```text
esperar;

NOWAIT;

SKIP LOCKED;

retry após deadlock.
```

Justifique conforme:

- experiência do usuário;
- fila ou interação;
- duração;
- idempotência;
- limite de tentativas;
- observabilidade.

---

## Criterios de aceite

- o laboratório oficial da aula 295 existe;
- o arquivo e o H1 seguem a grade;
- três tabelas exclusivas foram criadas;
- duas sessões foram identificadas;
- lock e transação foram diferenciados;
- lock implícito de `UPDATE` foi observado;
- leitura comum continuou por MVCC;
- espera por linha foi demonstrada;
- `lock_timeout` foi praticado;
- `SELECT FOR UPDATE` foi praticado;
- `NOWAIT` produziu falha imediata;
- SQLSTATE `55P03` foi registrado;
- `SKIP LOCKED` distribuiu itens entre workers;
- limitações de `SKIP LOCKED` foram compreendidas;
- lock de tabela foi demonstrado;
- `pg_stat_activity` foi consultado;
- `pg_locks` foi consultado;
- `pg_blocking_pids` identificou bloqueadores;
- `wait_event_type` e `wait_event` foram interpretados;
- estado `idle in transaction` foi diagnosticado;
- deadlock foi reproduzido;
- SQLSTATE `40P01` foi registrado;
- a vítima executou rollback;
- a unidade inteira foi tratada como candidata a retry;
- ordem consistente foi aplicada como prevenção;
- funções administrativas não foram executadas;
- nenhuma sessão permaneceu bloqueada;
- as tabelas de laboratório foram removidas;
- dataset principal e índices foram preservados;
- paginação da aula 296 não foi antecipada;
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
  labs/m12/aula-295-locks-deadlocks-diagnostico-inicial
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): diagnosticar locks e deadlocks"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
locks de linha;
FOR UPDATE;
NOWAIT;
SKIP LOCKED;
diagnóstico;
deadlocks;
prevenção;
retry.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você observou transações disputando recursos.

Aprendeu:

```text
lock;
espera;
lock de linha;
lock de tabela;
FOR UPDATE;
NOWAIT;
SKIP LOCKED;
lock_timeout;
pg_stat_activity;
pg_locks;
pg_blocking_pids;
wait_event;
idle in transaction;
deadlock;
40P01;
ordem consistente.
```

As regras principais foram:

```text
locks permanecem até o fim da transação;

espera simples não é deadlock;

leitura comum pode continuar por MVCC;

NOWAIT falha imediatamente;

SKIP LOCKED serve para filas, não para qualquer leitura;

lock_timeout limita espera;

diagnóstico combina atividade, locks e bloqueadores;

idle in transaction pode manter recursos sem trabalho ativo;

deadlock é ciclo de espera;

PostgreSQL aborta uma vítima;

retry deve repetir a unidade inteira;

adquirir recursos em ordem consistente reduz deadlocks.
```

A próxima aula será:

```text
296 - M12.26 - Paginacao SQL offset keyset e tradeoffs
```

Nela, você vai estudar:

- paginação com `LIMIT` e `OFFSET`;
- custo de offsets profundos;
- ordenação determinística;
- duplicidade e ausência entre páginas;
- cursor lógico;
- keyset pagination;
- chave composta de continuidade;
- uso de `id` como desempate;
- consultas para próxima página;
- página anterior;
- trade-offs de API;
- relação com índices;
- consistência diante de inserções concorrentes.

Finalize todas as transações antes de seguir.

A próxima aula usa ordenação e índices, mas não depende das tabelas temporárias deste laboratório.

---

# Material complementar

## Checkpoint final

- [ ] Reproduzi espera por lock e falha por timeout.
- [ ] Usei `NOWAIT` e `SKIP LOCKED` com critérios diferentes.
- [ ] Identifiquei bloqueado e bloqueador no catálogo.
- [ ] Reproduzi, corrigi e documentei um deadlock.

---

## Troubleshooting adicional

### O UPDATE da Sessao B nao espera

A Sessão A confirmou cedo demais, usa outro ID ou não está em transação.

Reinicie o cenário.

### NOWAIT nao falhou

A linha não está mais bloqueada ou a sessão usou outra conexão.

Confirme os PIDs e o ID.

### SKIP LOCKED retornou nenhuma linha

Todos os itens estão bloqueados ou não estão `PENDENTE`.

Resete a fila.

### O deadlock nao apareceu

Os comandos não formaram ciclo ou uma sessão confirmou antes.

Siga A1, B1, A2 e B2.

### DROP TABLE ficou esperando

Alguma sessão ainda mantém lock sobre as tabelas.

Finalize todas as transações.

---

## Perguntas de revisao

1. O que é lock?
2. Qual a diferença entre lock e transação?
3. Quando um lock de linha é liberado?
4. Leitura comum sempre bloqueia em UPDATE concorrente?
5. O que `FOR UPDATE` faz?
6. O que `NOWAIT` muda?
7. Qual SQLSTATE é comum em lock indisponível?
8. O que `SKIP LOCKED` faz?
9. Quando ele é adequado?
10. O que `lock_timeout` limita?
11. Para que serve `pg_stat_activity`?
12. Para que serve `pg_locks`?
13. O que `granted = false` indica?
14. Para que serve `pg_blocking_pids`?
15. O que é `idle in transaction`?
16. O que é deadlock?
17. Qual SQLSTATE representa deadlock?
18. Como ordem consistente ajuda?
19. O que repetir depois de deadlock?
20. Por que não terminar bloqueadores automaticamente?

---

## Roteiro de resposta

1. Coordenação de acesso a recurso.
2. Transação é unidade; lock protege acesso.
3. No commit ou rollback.
4. Não; MVCC permite versão confirmada anterior.
5. Lê e bloqueia linhas selecionadas.
6. Troca espera por falha imediata.
7. `55P03`.
8. Ignora linhas bloqueadas.
9. Filas com múltiplos workers.
10. Tempo para adquirir lock.
11. Inspecionar sessões e esperas.
12. Inspecionar locks concedidos e aguardados.
13. A sessão está esperando.
14. Encontrar PIDs bloqueadores.
15. Transação aberta sem comando ativo.
16. Ciclo de espera.
17. `40P01`.
18. Evita aquisição em ordem inversa.
19. A unidade transacional inteira.
20. Pode interromper operação legítima e causar impacto.

---

## Desafio opcional

Modele uma fila de processamento de Ordens com dez workers.

Documente:

- consulta com `FOR UPDATE SKIP LOCKED`;
- ordenação por prioridade e ID;
- mudança para `PROCESSANDO`;
- timeout do processamento;
- recuperação de item abandonado;
- idempotência;
- limite de tentativas;
- observabilidade;
- prevenção de starvation;
- impacto de transação longa;
- índice candidato.

Não implemente paginação nem mensageria nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 295 - M12.25 - Locks deadlocks e diagnostico inicial

- Diferenciei locks de transações.
- Observei lock de linha adquirido por `UPDATE`.
- Confirmei que uma leitura comum pode continuar usando MVCC.
- Reproduzi espera de atualização concorrente.
- Limitei a espera com `lock_timeout`.
- Usei `SELECT FOR UPDATE`.
- Usei `NOWAIT` e registrei SQLSTATE `55P03`.
- Usei `SKIP LOCKED` para distribuir itens entre workers.
- Entendi que linhas bloqueadas ficam ausentes do resultado com `SKIP LOCKED`.
- Demonstrei um lock de tabela `ACCESS EXCLUSIVE`.
- Consultei sessões em `pg_stat_activity`.
- Consultei locks em `pg_locks`.
- Identifiquei bloqueadores com `pg_blocking_pids`.
- Interpretei `wait_event_type`, `wait_event` e `granted`.
- Diagnostiquei uma sessão `idle in transaction`.
- Reproduzi um deadlock em duas linhas.
- Registrei SQLSTATE `40P01`.
- Apliquei rollback e retry da unidade inteira.
- Usei ordem consistente de aquisição para prevenir ciclos.
- Removi as tabelas exclusivas do laboratório.
- Próxima aula: paginação SQL com offset, keyset e trade-offs.
```

---

## Referencia tecnica curta

```text
FOR UPDATE:
bloqueia linha selecionada.

NOWAIT:
falha imediatamente.

SKIP LOCKED:
ignora linha ocupada.

lock_timeout:
limita espera.

pg_stat_activity:
sessões.

pg_locks:
locks.

pg_blocking_pids:
bloqueadores.

55P03:
lock_not_available.

40P01:
deadlock_detected.

Prevenção:
transação curta e ordem consistente.
```

Regra final:

```text
diagnostique antes de agir, mantenha transacoes curtas e adquira recursos em ordem consistente para reduzir bloqueios e deadlocks.
```
