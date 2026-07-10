# 293 - M12.23 - Transacoes ACID begin commit rollback

## Apresentacao da aula

Na aula 292, você analisou como o PostgreSQL planeja e executa consultas.

Usou:

```text
EXPLAIN;
EXPLAIN ANALYZE;
Seq Scan;
Index Scan;
Sort;
joins;
buffers;
estatísticas.
```

Agora o foco muda de leitura e performance para segurança das alterações.

Considere um fluxo de backend:

```text
criar uma Ordem de Serviço;

criar duas Atividades;

registrar um Evento de auditoria;

atualizar um indicador do Cliente.
```

Se apenas as duas primeiras operações forem gravadas e a terceira falhar, o banco pode ficar em um estado incompleto.

Outro exemplo:

```text
debitar saldo de uma conta;

creditar saldo em outra.
```

Executar apenas o débito não representa uma transferência válida.

O banco precisa tratar várias instruções relacionadas como uma unidade de trabalho.

Essa unidade é uma transação.

Nesta aula, você vai praticar:

```sql
BEGIN;
COMMIT;
ROLLBACK;
```

Também vai estudar as propriedades:

```text
Atomicidade;
Consistência;
Isolamento;
Durabilidade.
```

As iniciais formam:

```text
ACID.
```

Uma transação explícita permite delimitar:

```text
onde a unidade de trabalho começa;

quais instruções pertencem a ela;

quando as mudanças se tornam definitivas;

quando tudo deve ser desfeito.
```

A prática usará as tabelas reais do laboratório:

```text
app.ordem_servico;

app.atividade;

auditoria.evento_ordem_servico.
```

Você criará registros com IDs reservados da aula 293.

Alguns serão revertidos com `ROLLBACK`.

Um conjunto será confirmado com `COMMIT`, verificado por outra conexão e depois removido por uma limpeza controlada.

Também será demonstrado:

- autocommit;
- transação implícita de uma instrução;
- transação explícita com várias instruções;
- estado abortado depois de erro;
- necessidade de `ROLLBACK`;
- encerramento da conexão sem commit;
- visibilidade de alterações na própria transação;
- limites da transação do banco;
- impacto de transações longas;
- fronteira transacional em um serviço backend.

O laboratório não aprofundará níveis de isolamento.

A próxima aula será:

```text
294 - M12.24 - Isolamento read committed repeatable read serializable
```

Nela, você usará duas conexões simultâneas para observar concorrência e visibilidade.

Ao final desta aula, você deverá conseguir:

- definir uma transação;
- diferenciar autocommit e transação explícita;
- iniciar uma unidade de trabalho;
- confirmar alterações;
- desfazer alterações;
- reconhecer estado abortado;
- explicar ACID sem definições superficiais;
- coordenar mudanças em várias tabelas;
- verificar durabilidade em outra sessão;
- reconhecer limites de uma transação;
- definir uma fronteira transacional coerente para backend.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
291:
índices.

292:
planos de execução.

293:
transações ACID, BEGIN, COMMIT e ROLLBACK.

294:
níveis de isolamento.

295:
locks, bloqueios e deadlocks.

296:
paginação consistente e keyset pagination.
```

Nas aulas 277 e 284, você executou:

```text
INSERT;
UPDATE;
DELETE.
```

Cada instrução era atômica por si mesma.

Exemplo:

```sql
INSERT INTO app.produto (...)
VALUES
    (...),
    (...),
    (...);
```

Se uma das linhas daquele mesmo comando violasse uma constraint, o comando inteiro falharia.

Agora o problema é maior:

```text
como coordenar várias instruções separadas?
```

Sem transação explícita e com autocommit ativo:

```text
INSERT 1:
confirma automaticamente.

INSERT 2:
confirma automaticamente.

INSERT 3:
falha.
```

Os dois primeiros comandos podem permanecer gravados.

Com transação explícita:

```text
BEGIN;

INSERT 1;
INSERT 2;
INSERT 3;

COMMIT;
```

Se uma instrução falha, a transação entra em estado de erro e pode ser desfeita integralmente com:

```sql
ROLLBACK;
```

A fronteira entre `BEGIN` e `COMMIT` ou `ROLLBACK` transforma instruções separadas em uma unidade.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-293-transacoes-acid-begin-commit-rollback
```

Estrutura final:

```text
labs
└── m12
    └── aula-293-transacoes-acid-begin-commit-rollback
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_autocommit_e_transacao_implicita.sql
            ├── 02_begin_e_rollback_multiplas_tabelas.sql
            ├── 03_commit_unidade_de_trabalho.sql
            ├── 04_verificar_commit_nova_conexao.sql
            ├── 05_limpar_commit_controlado.sql
            ├── 06_atualizacao_e_rollback.sql
            ├── 07_erro_e_estado_abortado_manual.sql
            ├── 08_fim_da_sessao_sem_commit.sql
            ├── 09_verificar_rollback_por_desconexao.sql
            ├── 10_fronteira_transacional_backend.md
            ├── 11_exercicio.sql
            └── 12_validacao_final.sql
```

O ambiente permanece:

```text
container:
formacao-postgres-m12

database:
formacao_java

schemas:
app e auditoria
```

IDs reservados:

```text
960001:
rollback em múltiplas tabelas.

960010:
registro confirmado e depois limpo.

960020:
atualização revertida.

960030:
erro controlado e estado abortado.

960040:
sessão encerrada sem commit.

960100 em diante:
exercício.
```

Regras de segurança:

- use os IDs reservados;
- execute o script de commit antes da verificação;
- execute a limpeza depois da verificação;
- o script de erro deve ser executado manualmente no `psql`;
- não use `ON_ERROR_STOP=1` no roteiro do estado abortado;
- não feche o terminal no meio do commit controlado;
- valide o banco ao final.

---

## Conceito essencial

### O que e uma transacao

Transação é uma sequência de operações tratada como uma unidade lógica.

Ela possui três momentos básicos:

```text
início;

execução das instruções;

finalização.
```

Finalizações possíveis:

```text
COMMIT:
confirma.

ROLLBACK:
desfaz.
```

Forma:

```sql
BEGIN;

-- instruções

COMMIT;
```

Ou:

```sql
BEGIN;

-- instruções

ROLLBACK;
```

`START TRANSACTION` é uma alternativa a `BEGIN`.

Nesta formação, usaremos `BEGIN`.

---

### Transacao implicita de uma instrucao

Mesmo sem escrever `BEGIN`, cada instrução SQL é executada dentro de uma transação.

Com autocommit ativo, o cliente realiza conceitualmente:

```text
inicia transação;

executa uma instrução;

confirma se houve sucesso;

desfaz se houve falha.
```

Exemplo:

```sql
UPDATE app.cliente
SET email = 'novo@exemplo.local'
WHERE id = 930001;
```

A instrução não altera metade de uma linha.

Ela termina integralmente ou falha.

Esse comportamento protege a atomicidade da instrução.

---

### Autocommit

Autocommit é um comportamento do cliente.

Quando está ativo, cada instrução concluída com sucesso é confirmada automaticamente, desde que não exista uma transação explícita aberta.

No `psql`, o comportamento padrão é autocommit.

Ferramentas como DBeaver possuem um modo de autocommit que pode ser ativado ou desativado na interface.

Não confunda:

```text
autocommit do cliente;

COMMIT escrito explicitamente;

transação automática interna do PostgreSQL.
```

Antes de executar scripts de escrita, confirme o modo do cliente.

---

### Transacao explicita

Uma transação explícita agrupa várias instruções:

```sql
BEGIN;

INSERT INTO app.ordem_servico (...);

INSERT INTO app.atividade (...);

INSERT INTO auditoria.evento_ordem_servico (...);

COMMIT;
```

Nenhuma instrução deve ser tratada isoladamente do objetivo completo.

A unidade de negócio é:

```text
criar Ordem com Atividade e Evento.
```

Não:

```text
executar três INSERTs independentes.
```

---

### COMMIT

`COMMIT` confirma a transação.

Depois do sucesso:

- as mudanças tornam-se visíveis conforme as regras de isolamento;
- outra conexão pode observá-las;
- um `ROLLBACK` posterior não desfaz aquele commit;
- uma nova transação será necessária para realizar compensação ou limpeza.

Exemplo:

```sql
BEGIN;

UPDATE app.ordem_servico
SET status = 'AGENDADA'
WHERE id = 930001;

COMMIT;
```

Depois do commit, a alteração é definitiva do ponto de vista daquela transação.

---

### ROLLBACK

`ROLLBACK` desfaz as mudanças da transação atual.

Exemplo:

```sql
BEGIN;

UPDATE app.ordem_servico
SET status = 'CANCELADA'
WHERE id = 930001;

ROLLBACK;
```

Depois:

```sql
SELECT status
FROM app.ordem_servico
WHERE id = 930001;
```

O status original permanece.

O rollback não “executa um update inverso” escrito por você.

O mecanismo transacional descarta os efeitos não confirmados.

---

### Leitura dentro da propria transacao

A própria transação enxerga suas alterações.

Exemplo:

```sql
BEGIN;

INSERT INTO app.ordem_servico (...);

SELECT *
FROM app.ordem_servico
WHERE id = 960001;

ROLLBACK;
```

O `SELECT` dentro da mesma transação encontra a linha.

Depois do rollback, uma nova consulta não encontra.

Isso permite validar uma unidade antes de confirmá-la.

---

### Atomicidade

Atomicidade significa:

```text
tudo ou nada dentro da unidade.
```

Se uma criação exige:

```text
Ordem;

Atividade;

Evento;
```

o estado desejado não é:

```text
somente Ordem;

Ordem sem Evento;

Atividade sem fluxo completo.
```

A transação permite confirmar o conjunto completo ou desfazer o conjunto.

Atomicidade não significa que todas as operações do sistema inteiro cabem em uma única transação.

A fronteira precisa ser escolhida conforme a unidade de negócio.

---

### Consistencia

Consistência significa que a transação leva o banco de um estado válido para outro estado válido conforme as regras definidas.

Essas regras podem estar em:

- tipos;
- `NOT NULL`;
- primary keys;
- unique;
- foreign keys;
- checks;
- triggers;
- lógica da aplicação;
- invariantes de domínio.

O PostgreSQL não conhece automaticamente todas as regras de negócio.

Exemplo:

```text
Constraint conhecida:
Atividade precisa referenciar Ordem existente.

Regra possivelmente somente da aplicação:
Ordem CONCLUIDA não pode receber nova Atividade.
```

Se a segunda regra não estiver implementada em nenhuma camada, “ACID” não a inventará.

Consistência depende de regras reais e transações corretas.

---

### Isolamento

Isolamento trata da interação entre transações concorrentes.

Perguntas:

```text
uma transação enxerga mudança não confirmada de outra?

duas leituras podem produzir resultados diferentes?

duas atualizações podem conflitar?

uma consulta pode enxergar linhas novas?
```

Nesta aula, use apenas a ideia:

```text
transações não devem compartilhar livremente estados parciais.
```

Os níveis:

```text
READ COMMITTED;

REPEATABLE READ;

SERIALIZABLE
```

serão praticados na aula 294 com duas conexões.

---

### Durabilidade

Durabilidade significa que, depois de um commit bem-sucedido, o banco assume a responsabilidade de preservar a mudança mesmo diante de falhas, conforme sua configuração e garantias.

PostgreSQL usa mecanismos como:

```text
WAL;
flush;
recovery;
checkpoint;
armazenamento persistente.
```

Nesta aula, a evidência prática será:

1. confirmar dados;
2. encerrar a conexão;
3. abrir outra conexão;
4. consultar os registros.

Isso demonstra persistência entre sessões.

Não é uma simulação de queda física do servidor.

---

### ACID nao significa ausencia de erros

Uma transação pode falhar por:

- constraint;
- sintaxe;
- deadlock;
- timeout;
- perda de conexão;
- regra da aplicação;
- conflito de serialização;
- indisponibilidade.

ACID define propriedades da execução transacional.

A aplicação ainda precisa:

- tratar erros;
- decidir rollback;
- repetir quando apropriado;
- registrar contexto;
- devolver resposta correta;
- evitar efeitos externos inconsistentes.

---

### Estado abortado depois de erro

Dentro de uma transação explícita, uma instrução pode falhar.

Exemplo:

```sql
BEGIN;

INSERT válido;

INSERT inválido;
```

Depois do erro, a transação entra em estado abortado.

No `psql`, o prompt pode mudar de:

```text
formacao_java=*#
```

para:

```text
formacao_java=!#
```

Comandos seguintes recebem uma mensagem semelhante a:

```text
current transaction is aborted,
commands ignored until end of transaction block
```

A saída normal é:

```sql
ROLLBACK;
```

Não continue enviando comandos esperando que a transação se recupere sozinha.

---

### COMMIT depois de erro

Se a transação está abortada, o objetivo original não pode ser confirmado normalmente.

O tratamento correto é encerrar a unidade com rollback e iniciar outra transação depois de corrigir a causa.

Alguns clientes podem enviar `COMMIT` e o PostgreSQL responder como rollback da transação abortada.

Não dependa desse comportamento para controle de fluxo.

Use explicitamente:

```sql
ROLLBACK;
```

---

### Encerrar conexao sem COMMIT

Se a conexão termina com transação aberta, as mudanças não confirmadas são desfeitas.

Exemplo:

```text
BEGIN;

INSERT;

conexão encerrada.
```

O PostgreSQL não considera a alteração confirmada.

Isso protege o banco de sessões interrompidas.

Porém, enquanto a sessão permanece aberta, a transação pode:

- manter locks;
- reter versões de linhas;
- atrapalhar manutenção;
- consumir recursos.

Não use desconexão como estratégia normal de rollback.

---

### Transacoes longas

Uma transação longa pode permanecer aberta enquanto:

- usuário pensa em uma tela;
- aplicação chama serviço externo;
- processo realiza cálculo demorado;
- lote percorre muitos itens;
- breakpoint pausa execução.

Problemas possíveis:

- locks mantidos por mais tempo;
- contenção;
- versões antigas necessárias;
- impacto no vacuum;
- maior risco de conflito;
- rollback mais custoso;
- conexão ocupada.

Regra:

```text
transação deve abranger a unidade necessária
e terminar o mais cedo possível.
```

---

### Transacao e conexao

Uma transação pertence a uma conexão do banco.

Se uma aplicação inicia `BEGIN` em uma conexão e executa o restante em outra, não está usando a mesma transação.

Em backend com pool de conexões, a camada de acesso precisa garantir:

```text
mesma conexão;

mesma unidade de trabalho;

commit ou rollback no lugar correto;

liberação da conexão ao final.
```

Isso será importante quando JDBC e Spring forem estudados.

---

### Fronteira transacional

Uma boa fronteira representa uma mudança coerente de negócio.

Exemplo:

```text
criar Ordem;
criar Atividades iniciais;
registrar Evento de criação.
```

Fronteira ruim:

```text
abrir transação quando usuário abre a tela;

aguardar vários minutos;

chamar três APIs externas;

esperar confirmação manual;

confirmar no final.
```

A transação do banco não deve permanecer aberta durante interação humana ou chamadas remotas demoradas sem necessidade.

---

### Efeitos externos

`ROLLBACK` desfaz operações no banco participantes da transação.

Ele não desfaz automaticamente:

- e-mail enviado;
- mensagem publicada fora da transação;
- arquivo criado;
- requisição HTTP;
- cobrança em sistema externo;
- log enviado a serviço independente.

Exemplo problemático:

```text
BEGIN;

atualiza banco;

envia e-mail;

INSERT seguinte falha;

ROLLBACK.
```

O banco volta.

O e-mail já foi enviado.

Sistemas reais usam estratégias como mensageria confiável, idempotência e outbox, que serão estudadas em módulos futuros.

---

### Transacoes aninhadas

Executar outro `BEGIN` dentro de uma transação não cria uma transação independente completa.

PostgreSQL não oferece transações aninhadas reais dessa forma.

Existem savepoints para controle parcial, mas eles não serão usados nesta aula.

A unidade principal continua sendo confirmada ou desfeita por `COMMIT` ou `ROLLBACK`.

---

### DDL e transacoes

Muitos comandos DDL do PostgreSQL participam de transações.

Exemplo conceitual:

```sql
BEGIN;

CREATE TABLE app.exemplo (...);

ROLLBACK;
```

A tabela pode deixar de existir após o rollback.

Isso é útil em migrações, mas não significa que toda operação externa ou administrativa seja reversível.

O laboratório desta aula prioriza DML e regras de negócio.

---

## Mao na massa guiada

### 1. Confirmar o PostgreSQL

Na raiz:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se necessário, inicie o Compose da aula 271.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql"

New-Item -ItemType File -Force `
  -Path "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\10_fronteira_transacional_backend.md"

Set-Location `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback"
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
    current_user AS usuario;

SELECT
    id,
    nome
FROM app.cliente
WHERE id = 930001;

SELECT
    id,
    codigo,
    nome
FROM app.produto
WHERE id = 930001;

SELECT
    'ordem' AS objeto,
    count(*) AS quantidade
FROM app.ordem_servico
WHERE id BETWEEN 960001 AND 960199

UNION ALL

SELECT
    'atividade',
    count(*)
FROM app.atividade
WHERE id BETWEEN 960001 AND 960199

UNION ALL

SELECT
    'evento',
    count(*)
FROM auditoria.evento_ordem_servico
WHERE id BETWEEN 960001 AND 960199
ORDER BY objeto;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Os IDs reservados devem estar livres.

---

### 4. Criar 01_autocommit_e_transacao_implicita.sql

Crie:

```text
sql/01_autocommit_e_transacao_implicita.sql
```

Conteúdo:

```sql
CREATE TEMP TABLE tmp_autocommit_aula_293 (
    id integer PRIMARY KEY,
    descricao text NOT NULL
);

INSERT INTO tmp_autocommit_aula_293 (
    id,
    descricao
)
VALUES (
    1,
    'Primeira instrução confirmada pelo autocommit'
);

UPDATE tmp_autocommit_aula_293
SET descricao = 'Segunda instrução confirmada pelo autocommit'
WHERE id = 1
RETURNING
    id,
    descricao;

SELECT
    id,
    descricao
FROM tmp_autocommit_aula_293;

DROP TABLE tmp_autocommit_aula_293;
```

Execute em uma única conexão:

```powershell
Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\01_autocommit_e_transacao_implicita.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Com autocommit ativo e sem `BEGIN`, cada instrução bem-sucedida possui sua própria fronteira transacional.

A tabela temporária desaparece ao final da sessão.

---

### 5. Criar 02_begin_e_rollback_multiplas_tabelas.sql

Crie:

```text
sql/02_begin_e_rollback_multiplas_tabelas.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    data_agendada,
    inicio_previsto,
    valor_previsto,
    urgente,
    descricao_problema,
    prioridade
)
VALUES (
    960001,
    'OS-293-ROLLBACK',
    930001,
    930001,
    'ABERTA',
    DATE '2026-07-20',
    TIME '09:00:00',
    400.00,
    false,
    'Ordem criada para demonstrar rollback',
    'NORMAL'
);

INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista
)
VALUES (
    960001,
    960001,
    'DIAGNOSTICO_293',
    'Atividade temporária da transação',
    'PENDENTE',
    90.00,
    INTERVAL '1 hour'
);

INSERT INTO auditoria.evento_ordem_servico (
    id,
    ordem_servico_id,
    tipo,
    descricao
)
VALUES (
    960001,
    960001,
    'CRIACAO',
    'Evento temporário da aula 293'
);

SELECT
    os.id AS ordem_id,
    a.id AS atividade_id,
    eos.id AS evento_id
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
INNER JOIN auditoria.evento_ordem_servico AS eos
    ON eos.ordem_servico_id = os.id
WHERE os.id = 960001;

ROLLBACK;

SELECT
    (SELECT count(*) FROM app.ordem_servico WHERE id = 960001)
        AS ordens,
    (SELECT count(*) FROM app.atividade WHERE id = 960001)
        AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id = 960001
    ) AS eventos;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\02_begin_e_rollback_multiplas_tabelas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Dentro da transação, as três linhas aparecem.

Depois do rollback, as três contagens devem ser zero.

---

### 6. Criar 03_commit_unidade_de_trabalho.sql

Crie:

```text
sql/03_commit_unidade_de_trabalho.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    data_agendada,
    inicio_previsto,
    valor_previsto,
    urgente,
    descricao_problema,
    prioridade
)
VALUES (
    960010,
    'OS-293-COMMIT',
    930001,
    930001,
    'ABERTA',
    DATE '2026-07-21',
    TIME '10:00:00',
    450.00,
    false,
    'Ordem confirmada para demonstrar durabilidade',
    'NORMAL'
);

INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista
)
VALUES (
    960010,
    960010,
    'VISTORIA_293',
    'Atividade confirmada pela transação',
    'PENDENTE',
    110.00,
    INTERVAL '90 minutes'
);

INSERT INTO auditoria.evento_ordem_servico (
    id,
    ordem_servico_id,
    tipo,
    descricao
)
VALUES (
    960010,
    960010,
    'CRIACAO',
    'Evento confirmado pela transação da aula 293'
);

SELECT
    os.id AS ordem_id,
    os.codigo,
    a.id AS atividade_id,
    eos.id AS evento_id
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
INNER JOIN auditoria.evento_ordem_servico AS eos
    ON eos.ordem_servico_id = os.id
WHERE os.id = 960010;

COMMIT;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\03_commit_unidade_de_trabalho.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A conexão termina depois do commit.

Os registros permanecem até a limpeza controlada.

---

### 7. Criar 04_verificar_commit_nova_conexao.sql

Crie:

```text
sql/04_verificar_commit_nova_conexao.sql
```

Conteúdo:

```sql
SELECT
    os.id AS ordem_id,
    os.codigo,
    os.status,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    eos.id AS evento_id,
    eos.tipo AS evento_tipo
FROM app.ordem_servico AS os
INNER JOIN app.atividade AS a
    ON a.ordem_servico_id = os.id
INNER JOIN auditoria.evento_ordem_servico AS eos
    ON eos.ordem_servico_id = os.id
WHERE os.id = 960010;
```

Execute em um novo `docker exec`:

```powershell
Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\04_verificar_commit_nova_conexao.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A nova conexão encontra Ordem, Atividade e Evento.

Essa é a evidência prática de persistência depois do commit.

---

### 8. Criar 05_limpar_commit_controlado.sql

Crie:

```text
sql/05_limpar_commit_controlado.sql
```

Conteúdo:

```sql
BEGIN;

DELETE FROM auditoria.evento_ordem_servico
WHERE id = 960010
RETURNING
    id,
    ordem_servico_id,
    tipo;

DELETE FROM app.atividade
WHERE id = 960010
RETURNING
    id,
    ordem_servico_id,
    codigo;

DELETE FROM app.ordem_servico
WHERE id = 960010
RETURNING
    id,
    codigo;

COMMIT;

SELECT
    (SELECT count(*) FROM app.ordem_servico WHERE id = 960010)
        AS ordens,
    (SELECT count(*) FROM app.atividade WHERE id = 960010)
        AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id = 960010
    ) AS eventos;
```

Execute depois da verificação da nova conexão.

A ordem de remoção respeita:

```text
Evento;
Atividade;
Ordem.
```

As contagens finais devem ser zero.

---

### 9. Criar 06_atualizacao_e_rollback.sql

Crie:

```text
sql/06_atualizacao_e_rollback.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE id = 930001;

BEGIN;

UPDATE app.ordem_servico
SET
    status = 'AGENDADA',
    valor_previsto = valor_previsto + 50
WHERE id = 930001
RETURNING
    id,
    codigo,
    status,
    valor_previsto;

SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE id = 930001;

ROLLBACK;

SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE id = 930001;
```

Execute e compare:

```text
antes;

durante a transação;

depois do rollback.
```

O estado final deve coincidir com o inicial.

---

### 10. Criar 07_erro_e_estado_abortado_manual.sql

Crie:

```text
sql/07_erro_e_estado_abortado_manual.sql
```

Conteúdo:

```sql
-- Execute manualmente no psql, uma instrução por vez.
-- Não use ON_ERROR_STOP=1 neste roteiro.

BEGIN;

INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    valor_previsto,
    urgente,
    descricao_problema,
    prioridade
)
VALUES (
    960030,
    'OS-293-ERRO',
    930001,
    930001,
    'ABERTA',
    300.00,
    false,
    'Ordem que será desfeita após erro',
    'NORMAL'
);

-- Deve falhar:
-- a atividade referencia uma Ordem inexistente.
INSERT INTO app.atividade (
    id,
    ordem_servico_id,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista
)
VALUES (
    960030,
    999999,
    'ERRO_FK_293',
    'Atividade inválida',
    'PENDENTE',
    50.00,
    INTERVAL '30 minutes'
);

-- Deve ser ignorado porque a transação está abortada.
SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE id = 960030;

ROLLBACK;

-- Depois do rollback, o SELECT volta a funcionar
-- e a primeira inserção também foi desfeita.
SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE id = 960030;
```

Abra o `psql`:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Copie uma instrução por vez.

Observe os prompts:

```text
sem transação:
formacao_java=#

transação aberta:
formacao_java=*#

transação abortada:
formacao_java=!#
```

Depois do `ROLLBACK`, o prompt retorna ao normal.

---

### 11. Criar 08_fim_da_sessao_sem_commit.sql

Crie:

```text
sql/08_fim_da_sessao_sem_commit.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO app.ordem_servico (
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    valor_previsto,
    urgente,
    descricao_problema,
    prioridade
)
VALUES (
    960040,
    'OS-293-DESCONECTADA',
    930001,
    930001,
    'ABERTA',
    280.00,
    false,
    'Transação encerrada sem commit',
    'NORMAL'
);

SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE id = 960040;

-- Intencionalmente não existe COMMIT nem ROLLBACK.
-- Quando o psql encerrar a conexão, PostgreSQL desfará a transação.
```

Execute em processo separado:

```powershell
Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\08_fim_da_sessao_sem_commit.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

O `SELECT` interno encontra a linha.

Ao final do processo, a conexão encerra sem commit.

---

### 12. Criar 09_verificar_rollback_por_desconexao.sql

Crie:

```text
sql/09_verificar_rollback_por_desconexao.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE id = 960040;

SELECT
    count(*) AS quantidade
FROM app.ordem_servico
WHERE id = 960040;
```

Execute em nova conexão:

```powershell
Get-Content -Raw `
  "labs\m12\aula-293-transacoes-acid-begin-commit-rollback\sql\09_verificar_rollback_por_desconexao.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado:

```text
nenhuma linha;

quantidade zero.
```

A conexão anterior não confirmou a transação.

---

### 13. Criar 10_fronteira_transacional_backend.md

Crie:

```text
10_fronteira_transacional_backend.md
```

Registre:

```markdown
# Fronteira transacional da criação de Ordem

**Unidade de negócio**

Criar uma Ordem de Serviço com suas Atividades iniciais e o Evento de criação.

**Operações no banco**

1. Validar referências de Cliente e Produto.
2. Inserir Ordem.
3. Inserir Atividades.
4. Inserir Evento.
5. Confirmar a transação.

**Condição de sucesso**

Todas as linhas necessárias foram criadas e obedecem às constraints.

**Condição de rollback**

Qualquer inserção ou validação obrigatória falhou.

**Operações que não devem ocorrer dentro da transação por tempo desnecessário**

- aguardar ação do usuário;
- chamar API remota demorada;
- enviar e-mail diretamente;
- aguardar processamento manual;
- dormir ou repetir indefinidamente.

**Efeitos externos**

Um rollback do PostgreSQL não desfaz e-mail, HTTP, arquivo ou mensagem já enviados.

**Conexão**

Toda a unidade precisa usar a mesma conexão do pool.

**Tempo**

A transação deve começar imediatamente antes das alterações e terminar assim que a unidade estiver válida.
```

Complete com riscos e decisões do seu domínio.

---

### 14. Criar 11_exercicio.sql

Crie:

```text
sql/11_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Use IDs entre:

```text
960100 e 960149.
```

Ao final, nenhum registro do exercício deve permanecer.

---

### 15. Criar 12_validacao_final.sql

Crie:

```text
sql/12_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    'ordem' AS objeto,
    count(*) AS quantidade
FROM app.ordem_servico
WHERE id BETWEEN 960001 AND 960199

UNION ALL

SELECT
    'atividade',
    count(*)
FROM app.atividade
WHERE id BETWEEN 960001 AND 960199

UNION ALL

SELECT
    'evento',
    count(*)
FROM auditoria.evento_ordem_servico
WHERE id BETWEEN 960001 AND 960199
ORDER BY objeto;

SELECT
    id,
    codigo,
    status,
    valor_previsto
FROM app.ordem_servico
WHERE id = 930001;

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
zero Ordens da aula 293;

zero Atividades da aula 293;

zero Eventos da aula 293;

Ordem 930001 preservada;

seis índices principais preservados.
```

---

### 16. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 293 - Transacoes ACID begin commit rollback.

Objetivo:
coordenar várias instruções como uma unidade de trabalho.

Comandos:
BEGIN, COMMIT e ROLLBACK.

Propriedades:
Atomicidade, Consistência, Isolamento e Durabilidade.

Demonstrações:
autocommit;
rollback em três tabelas;
commit verificado em nova conexão;
estado abortado;
desconexão sem commit;
atualização revertida.

Segurança:
IDs reservados;
limpeza controlada;
nenhum registro temporário ao final.

Próxima aula:
isolamento READ COMMITTED, REPEATABLE READ e SERIALIZABLE.
```

Liste a ordem dos scripts.

Registre que o script `07` precisa ser executado manualmente.

---

## Entendendo o que foi feito

### Varias instrucoes viraram uma unidade

Ordem, Atividade e Evento foram tratadas como um único objetivo.

O rollback removeu as três mudanças não confirmadas.

---

### Commit foi verificado fora da sessao

Os registros confirmados foram consultados por uma nova conexão.

Isso demonstrou que o commit não dependia da sessão original.

---

### O erro abortou a transacao

A violação de foreign key não desfez apenas aquela instrução e permitiu continuar normalmente.

A transação ficou abortada até receber `ROLLBACK`.

---

### A desconexao protegeu dados nao confirmados

A sessão terminou com transação aberta.

PostgreSQL descartou a alteração.

Esse comportamento é proteção, não estratégia normal de controle.

---

### ACID foi conectado ao dominio

Atomicidade protegeu a unidade.

Consistência dependeu de constraints e regras.

Isolamento ficou preparado para concorrência.

Durabilidade foi observada depois do commit.

---

### A fronteira foi tratada como decisao de arquitetura

Uma transação não deve começar cedo demais nem incluir chamadas externas demoradas sem necessidade.

Ela precisa usar a mesma conexão e terminar rapidamente.

---

## Erros comuns importantes

### Esquecer COMMIT no DBeaver

A ferramenta está com autocommit desativado.

Confirme ou desfaça antes de fechar a conexão.

---

### Continuar depois de erro

A transação está abortada.

Execute `ROLLBACK`, corrija a causa e recomece.

---

### Abrir transacao e aguardar usuario

Locks e versões podem permanecer ativos por muito tempo.

Mova a fronteira para perto das alterações.

---

### Usar conexoes diferentes

`BEGIN` foi executado em uma conexão e os inserts em outra.

A unidade transacional foi perdida.

---

### Acreditar que rollback desfaz email

Efeitos externos não participam automaticamente da transação do PostgreSQL.

Use arquitetura apropriada.

---

## Comandos uteis

### Iniciar

```sql
BEGIN;
```

### Confirmar

```sql
COMMIT;
```

### Desfazer

```sql
ROLLBACK;
```

### Estrutura basica

```sql
BEGIN;

-- alterações

COMMIT;
```

### Estrutura de teste

```sql
BEGIN;

-- alterações e consultas

ROLLBACK;
```

---

## Exercicio guiado

No arquivo:

```text
sql/11_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Unidade com rollback

Crie dentro de uma transação:

```text
Ordem 960100;

Atividade 960100;

Evento 960100.
```

Use Cliente e Produto existentes.

Consulte as três linhas dentro da transação.

Execute `ROLLBACK`.

Confirme zero linhas.

---

### Parte 2 - Atualizacao reversivel

Escolha a Ordem `930002`.

Registre antes:

```text
status;

prioridade;

valor_previsto.
```

Dentro de uma transação:

- altere os três valores para opções válidas;
- use `RETURNING`;
- consulte novamente;
- execute rollback;
- confirme o estado original.

---

### Parte 3 - Commit controlado

Crie:

```text
Ordem 960110;

Atividade 960110;

Evento 960110.
```

Execute `COMMIT`.

Em outra conexão, confirme as três linhas.

Depois crie uma transação de limpeza:

```text
Evento;
Atividade;
Ordem.
```

Confirme a limpeza com commit.

---

### Parte 4 - Erro de consistencia

No `psql` interativo:

1. inicie a transação;
2. insira Ordem `960120`;
3. tente inserir Atividade com `ordem_servico_id` inexistente;
4. observe o prompt abortado;
5. tente executar um `SELECT`;
6. execute rollback;
7. confirme que a Ordem `960120` não existe.

---

### Parte 5 - Autocommit

Explique o que aconteceria sem `BEGIN`:

```text
INSERT da Ordem confirma;

INSERT da Atividade falha;

Evento nem é executado.
```

Registre o estado parcial que poderia permanecer.

Não provoque esse estado nas tabelas permanentes.

---

### Parte 6 - ACID aplicado

Para a criação de Ordem, explique:

```text
Atomicidade:
o que precisa ser tudo ou nada?

Consistência:
quais constraints e regras protegem a mudança?

Isolamento:
qual interação concorrente será estudada?

Durabilidade:
qual evidência existe depois do commit?
```

---

### Parte 7 - Fronteira ruim

Analise:

```text
BEGIN;

criar Ordem;

chamar API externa por 20 segundos;

aguardar confirmação do usuário;

enviar e-mail;

criar Atividade;

COMMIT.
```

Liste problemas.

Proponha uma fronteira melhor sem implementar mensageria ainda.

---

### Parte 8 - Mesma conexao

Explique por que este fluxo é inválido:

```text
conexão A:
BEGIN.

conexão B:
INSERT Ordem.

conexão C:
INSERT Atividade.

conexão A:
COMMIT.
```

Relacione a explicação a um pool de conexões backend.

---

### Parte 9 - Encerramento seguro

Crie uma checklist para uma camada de serviço:

```text
iniciar;

executar;

validar;

commit;

capturar erro;

rollback;

liberar conexão;

registrar contexto.
```

Não escreva JDBC ainda.

---

## Criterios de aceite

- o laboratório oficial da aula 293 existe;
- o arquivo e o H1 seguem a grade;
- autocommit foi diferenciado de transação explícita;
- transação implícita de uma instrução foi compreendida;
- `BEGIN` foi praticado;
- `COMMIT` foi praticado;
- `ROLLBACK` foi praticado;
- alterações em três tabelas foram coordenadas;
- leitura dentro da própria transação foi observada;
- rollback removeu todas as mudanças;
- commit foi verificado em nova conexão;
- dados confirmados foram limpos de forma controlada;
- atualização de registro existente foi revertida;
- erro de foreign key colocou a transação em estado abortado;
- comandos posteriores ao erro foram rejeitados;
- rollback recuperou a sessão;
- desconexão sem commit desfez a mudança;
- atomicidade foi aplicada ao domínio;
- consistência foi relacionada a constraints e regras;
- isolamento foi introduzido sem antecipar níveis;
- durabilidade foi demonstrada entre sessões;
- efeitos externos foram separados do rollback do banco;
- transações longas foram discutidas;
- mesma conexão foi reconhecida como requisito;
- fronteira transacional foi documentada;
- savepoints não foram antecipados;
- níveis de isolamento não foram praticados;
- nenhum registro com ID reservado permaneceu;
- índices das aulas anteriores foram preservados;
- o exercício foi concluído;
- README e scripts estão prontos;
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
  labs/m12/aula-293-transacoes-acid-begin-commit-rollback
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): praticar transacoes acid"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
BEGIN;
COMMIT;
ROLLBACK;
ACID;
unidade de trabalho;
tratamento de erro;
fronteira transacional.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você coordenou várias alterações como uma unidade.

Aprendeu:

```text
transação;
autocommit;
transação implícita;
transação explícita;
BEGIN;
COMMIT;
ROLLBACK;
estado abortado;
encerramento sem commit;
fronteira transacional;
mesma conexão;
ACID.
```

As regras principais foram:

```text
cada instrução é transacional;

autocommit confirma instruções separadamente;

BEGIN agrupa várias instruções;

COMMIT torna a unidade definitiva;

ROLLBACK desfaz a unidade não confirmada;

erro dentro da transação exige rollback;

a própria transação enxerga suas mudanças;

outra sessão só deve observar conforme isolamento;

conexão encerrada sem commit desfaz a transação;

rollback do banco não desfaz efeitos externos;

transações devem ser curtas e coerentes;

toda a unidade precisa usar a mesma conexão.
```

A próxima aula será:

```text
294 - M12.24 - Isolamento read committed repeatable read serializable
```

Nela, você vai abrir duas conexões e observar:

- nível padrão do PostgreSQL;
- visibilidade de dados confirmados;
- leituras repetidas;
- non-repeatable read;
- phantom read em perspectiva prática;
- snapshot;
- `READ COMMITTED`;
- `REPEATABLE READ`;
- `SERIALIZABLE`;
- conflitos de serialização;
- retry;
- escolha do nível conforme regra.

A transação deixou de ser apenas uma sequência local.

Na próxima aula, ela será observada concorrendo com outra transação.

---

# Material complementar

## Checkpoint final

- [ ] Pratiquei `BEGIN`, `COMMIT` e `ROLLBACK`.
- [ ] Demonstrei atomicidade em várias tabelas.
- [ ] Tratei estado abortado e desconexão sem commit.
- [ ] Documentei a fronteira backend e fiz o commit.

---

## Troubleshooting adicional

### There is already a transaction in progress

Outro `BEGIN` foi executado com transação aberta.

Finalize a unidade atual antes de iniciar outra.

### There is no transaction in progress

`COMMIT` ou `ROLLBACK` foi executado sem transação explícita ativa.

Revise o modo do cliente e a sequência dos comandos.

### Current transaction is aborted

Alguma instrução falhou.

Execute `ROLLBACK`.

### Script parou no primeiro erro

O `psql` foi iniciado com `ON_ERROR_STOP=1`.

Para observar o estado abortado, use o roteiro manual.

### Registro do commit ainda existe

A limpeza `05_limpar_commit_controlado.sql` não foi executada ou falhou.

Consulte filhos e remova na ordem correta dentro de uma transação.

---

## Perguntas de revisao

1. O que é uma transação?
2. O que é autocommit?
3. Cada instrução isolada é transacional?
4. Para que serve `BEGIN`?
5. O que `COMMIT` faz?
6. O que `ROLLBACK` faz?
7. A própria transação enxerga suas mudanças?
8. O que é atomicidade?
9. O que é consistência?
10. O que é isolamento?
11. O que é durabilidade?
12. O que acontece depois de erro em transação?
13. O que acontece ao fechar a conexão sem commit?
14. Por que transações longas são perigosas?
15. Por que a mesma conexão é necessária?
16. Rollback desfaz chamada HTTP?
17. O que é uma fronteira transacional?
18. Por que ACID não cria regras de negócio automaticamente?

---

## Roteiro de resposta

1. Unidade lógica de operações.
2. Confirmação automática por instrução no cliente.
3. Sim.
4. Iniciar unidade explícita.
5. Confirma mudanças.
6. Desfaz mudanças não confirmadas.
7. Sim.
8. Tudo ou nada.
9. Estados válidos conforme regras implementadas.
10. Interação controlada entre concorrentes.
11. Persistência depois do commit.
12. Fica abortada até rollback.
13. Mudanças não confirmadas são desfeitas.
14. Mantêm recursos e versões por mais tempo.
15. A transação pertence à conexão.
16. Não.
17. Limite da unidade de negócio.
18. O banco só conhece regras implementadas.

---

## Desafio opcional

Modele a fronteira transacional de um pagamento com:

```text
criar transação financeira;

registrar lançamento;

atualizar saldo;

registrar auditoria;

publicar evento para outro sistema.
```

Separe:

```text
operações atômicas no PostgreSQL;

efeitos externos;

validações antes da transação;

ações depois do commit;

estratégia em caso de falha externa.
```

Não implemente mensageria nem outbox nesta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 293 - M12.23 - Transacoes ACID begin commit rollback

- Entendi transação como unidade lógica de trabalho.
- Diferenciei autocommit de transação explícita.
- Pratiquei `BEGIN`, `COMMIT` e `ROLLBACK`.
- Coordenei Ordem, Atividade e Evento em uma mesma unidade.
- Consultei alterações ainda não confirmadas dentro da própria transação.
- Desfiz várias mudanças com um único rollback.
- Confirmei uma unidade e validei os dados em outra conexão.
- Limpei os registros confirmados de forma transacional.
- Observei que um erro coloca a transação em estado abortado.
- Usei rollback para recuperar a sessão.
- Demonstrei rollback automático ao encerrar uma conexão sem commit.
- Apliquei Atomicidade, Consistência, Isolamento e Durabilidade.
- Entendi que rollback do banco não desfaz efeitos externos.
- Registrei riscos de transações longas.
- Documentei a necessidade de usar a mesma conexão do pool.
- Defini uma fronteira transacional para criação de Ordem.
- Próxima aula: isolamento `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`.
```

---

## Referencia tecnica curta

```text
BEGIN:
inicia transação explícita.

COMMIT:
confirma.

ROLLBACK:
desfaz.

Autocommit:
confirma cada instrução.

Atomicidade:
tudo ou nada.

Consistência:
respeito às regras implementadas.

Isolamento:
interação entre concorrentes.

Durabilidade:
persistência após commit.

Erro:
transação abortada até rollback.
```

Regra final:

```text
defina a transacao pela unidade de negocio, use a mesma conexao e finalize rapidamente com commit ou rollback.
```
