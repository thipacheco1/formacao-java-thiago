# 277 - M12.07 - Insert update delete e retorno de dados

## Apresentacao da aula

Na aula 276, você protegeu o conteúdo das tabelas com `NOT NULL`, `UNIQUE`, `CHECK` e `DEFAULT`. O PostgreSQL passou a rejeitar nomes vazios, códigos duplicados, valores negativos, status inválidos, períodos incoerentes e ausências em campos obrigatórios.

Agora a estrutura está pronta para receber dados com responsabilidade.

Nesta aula, você vai estudar DML:

```text
Data Manipulation Language
```

Em português:

```text
Linguagem de Manipulação de Dados
```

Os três comandos centrais serão:

```sql
INSERT
UPDATE
DELETE
```

Você também vai usar um recurso muito importante do PostgreSQL:

```sql
RETURNING
```

`RETURNING` permite que o próprio comando de escrita devolva as linhas inseridas, atualizadas ou removidas. Isso evita uma consulta adicional apenas para descobrir o identificador gerado ou confirmar o resultado da alteração.

O foco não será apenas decorar sintaxe. Você vai desenvolver uma rotina segura:

```text
confirmar o ambiente;
entender o estado atual;
escrever colunas explicitamente;
filtrar a alteração;
verificar quantas linhas serão afetadas;
usar RETURNING;
interpretar constraints;
preservar a ordem das foreign keys;
validar o estado final.
```

Um `UPDATE` ou `DELETE` sem `WHERE` é sintaticamente válido. O perigo está justamente nisso: o banco pode executar uma operação ampla sem considerar que você pretendia atingir apenas uma linha.

Transações com `BEGIN`, `COMMIT` e `ROLLBACK` serão estudadas com profundidade na aula 293. Nesta aula, você não deve usar a ausência desse conteúdo como desculpa para executar comandos arriscados. O comportamento seguro começa antes da transação: contexto correto, filtro correto, revisão e retorno das linhas afetadas.

Também não vamos aprofundar `SELECT`, operadores de filtro, paginação, joins, subqueries ou `ON CONFLICT`. Esses assuntos possuem aulas próprias.

Ao final, você deverá conseguir:

- inserir uma ou várias linhas;
- omitir colunas que possuem default;
- usar identity columns sem informar o identificador;
- solicitar valores gerados com `RETURNING`;
- atualizar somente as linhas desejadas;
- usar valores atuais em expressões de atualização;
- remover somente registros selecionados;
- entender o efeito de comandos sem `WHERE`;
- interpretar a contagem de linhas afetadas;
- observar constraints durante DML;
- respeitar foreign keys durante exclusões;
- manter um conjunto de dados pronto para a aula 278.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
271:
banco de dados, SGBD, SQL e PostgreSQL.

272:
DBeaver, psql, schemas e rotina de trabalho.

273:
tipos de dados PostgreSQL com critério.

274:
DDL com CREATE TABLE, ALTER TABLE e DROP TABLE.

275:
primary key, foreign key e integridade referencial.

276:
NOT NULL, UNIQUE, CHECK e DEFAULT.

277:
INSERT, UPDATE, DELETE e RETURNING.

278:
SELECT, WHERE, ORDER BY, LIMIT e OFFSET.

279:
operadores e filtros.
```

Até agora, a formação construiu o banco por camadas:

```text
tipos;
tabelas;
identity;
primary keys;
foreign keys;
constraints de conteúdo.
```

A partir desta aula, as estruturas deixam de estar vazias.

Você criará um conjunto coerente para o domínio:

```text
clientes;
produtos;
ordens de serviço;
atividades;
eventos de auditoria.
```

O conjunto será pequeno, previsível e mantido no banco ao final. A aula 278 usará esses registros para ensinar leitura, filtros, ordenação e limites.

Isso cria uma progressão importante:

```text
277:
como os dados entram, mudam e saem.

278:
como os dados são lidos e organizados.

279:
como filtros mais ricos são construídos.
```

Os comandos `SELECT` usados nesta aula servirão apenas para conferir o estado antes ou depois de uma escrita. A leitura aprofundada continua reservada para a aula seguinte.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-277-insert-update-delete-retorno-dados
```

Estrutura final:

```text
labs
└── m12
    └── aula-277-insert-update-delete-retorno-dados
        ├── README.md
        └── sql
            ├── 00_verificar_contexto.sql
            ├── 01_limpar_dataset_anterior.sql
            ├── 02_insert_clientes_produtos.sql
            ├── 03_insert_ordens.sql
            ├── 04_insert_atividades_eventos.sql
            ├── 05_update_com_filtro_returning.sql
            ├── 06_delete_com_filtro_returning.sql
            ├── 07_erros_controlados.sql
            ├── 08_validacao_final.sql
            └── 09_exercicio.sql
```

O ambiente continua sendo:

```text
container:
formacao-postgres-m12

database:
formacao_java

schemas:
app e auditoria
```

O fluxo será:

1. confirmar database, usuário e tabelas;
2. limpar somente o dataset da aula, caso exista;
3. inserir clientes e produtos;
4. inserir ordens;
5. inserir atividades e eventos;
6. atualizar registros com filtros específicos;
7. criar e remover registros descartáveis;
8. provocar erros controlados;
9. validar o dataset final;
10. documentar e commitar.

Os IDs do conjunto principal ficarão na faixa:

```text
930001 a 930099
```

Como as identity columns foram configuradas com `BY DEFAULT`, o banco permite IDs explícitos. Isso torna os relacionamentos determinísticos para o laboratório.

Você também fará inserções sem ID para observar a geração automática.

---

## Conceito essencial

### O que e DML

DML é o conjunto de comandos que manipula linhas.

Nesta aula:

```text
INSERT:
cria linhas.

UPDATE:
altera linhas existentes.

DELETE:
remove linhas.

RETURNING:
devolve dados das linhas modificadas.
```

Compare com DDL:

```text
CREATE TABLE:
cria estrutura.

INSERT:
cria uma linha dentro da estrutura.
```

O PostgreSQL executa as constraints em cada operação.

Um `INSERT` pode falhar por `NOT NULL`, `UNIQUE`, `CHECK` ou foreign key. Um `UPDATE` pode transformar uma linha válida em inválida e ser rejeitado. Um `DELETE` pode ser bloqueado porque outra tabela referencia o registro.

As regras das aulas anteriores passam a atuar durante a manipulação.

---

### INSERT basico

A forma recomendada é informar as colunas:

```sql
INSERT INTO app.cliente (
    nome,
    documento,
    email
)
VALUES (
    'Cliente Exemplo',
    '00123456789000',
    'cliente@exemplo.local'
);
```

Evite:

```sql
INSERT INTO app.cliente
VALUES (...);
```

Quando a lista de colunas é omitida, os valores dependem da ordem física atual da tabela. Uma nova coluna pode quebrar o script ou mudar o significado da instrução.

Com colunas explícitas, o comando comunica:

```text
quais dados serão fornecidos;
quais colunas serão omitidas;
quais defaults deverão atuar.
```

---

### Defaults durante INSERT

Na tabela `app.cliente`, as colunas:

```text
ativo;
criado_em;
```

possuem defaults.

Se forem omitidas:

```sql
INSERT INTO app.cliente (
    nome,
    documento
)
VALUES (
    'Cliente Exemplo',
    '00123456789000'
);
```

o PostgreSQL usa:

```text
ativo = true;
criado_em = CURRENT_TIMESTAMP.
```

Você também pode solicitar explicitamente:

```sql
INSERT INTO app.cliente (
    nome,
    documento,
    ativo
)
VALUES (
    'Cliente Exemplo',
    '00123456789000',
    DEFAULT
);
```

Lembre-se:

```text
coluna omitida:
default pode ser aplicado.

palavra DEFAULT:
default é solicitado.

NULL explícito:
NULL é enviado e pode violar NOT NULL.
```

---

### Identity durante INSERT

A coluna `id` é:

```text
GENERATED BY DEFAULT AS IDENTITY
```

Quando o ID é omitido:

```sql
INSERT INTO app.cliente (
    nome,
    documento
)
VALUES (
    'Cliente com ID automático',
    '00123456789001'
);
```

o PostgreSQL gera o valor.

Como a estratégia é `BY DEFAULT`, um ID explícito também é aceito:

```sql
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    930001,
    'Cliente controlado',
    '00123456789002'
);
```

No laboratório, IDs explícitos serão usados no dataset principal para facilitar referências entre scripts. Inserções automáticas serão praticadas em registros descartáveis.

---

### RETURNING no INSERT

Forma:

```sql
INSERT INTO app.cliente (
    nome,
    documento
)
VALUES (
    'Cliente Retorno',
    '00123456789003'
)
RETURNING
    id,
    nome,
    ativo,
    criado_em;
```

A linha é inserida e devolvida pelo mesmo comando.

Isso é útil para obter:

- ID gerado;
- defaults;
- valores transformados pelo banco;
- confirmação da linha realmente criada.

A lista de `RETURNING` aceita colunas e expressões:

```sql
RETURNING id, codigo, valor * 2 AS valor_dobrado;
```

Nesta aula, priorizaremos colunas claras.

---

### INSERT de multiplas linhas

Você pode inserir várias linhas:

```sql
INSERT INTO app.produto (
    id,
    codigo,
    nome,
    valor
)
VALUES
    (930001, 'PROD-A', 'Produto A', 100.00),
    (930002, 'PROD-B', 'Produto B', 200.00)
RETURNING id, codigo, nome, valor;
```

O PostgreSQL tenta executar o comando como uma unidade.

Se uma linha viola uma constraint, o comando inteiro falha. As demais linhas daquele mesmo `INSERT` não ficam parcialmente gravadas.

Isso é diferente de executar vários comandos separados.

---

### Contagem de linhas afetadas

O `psql` mostra respostas como:

```text
INSERT 0 3
UPDATE 1
DELETE 2
```

Leitura:

```text
INSERT 0 3:
três linhas inseridas.

UPDATE 1:
uma linha atualizada.

DELETE 2:
duas linhas removidas.
```

A contagem é uma evidência importante.

Se você esperava atualizar uma linha e recebeu:

```text
UPDATE 25
```

pare e investigue.

Se recebeu:

```text
UPDATE 0
```

o filtro não encontrou linhas.

`RETURNING` fornece ainda mais contexto ao mostrar quais registros foram afetados.

---

### UPDATE basico

Forma:

```sql
UPDATE app.cliente
SET email = 'novo@exemplo.local'
WHERE id = 930001;
```

Partes:

```text
UPDATE:
tabela alvo.

SET:
novos valores.

WHERE:
quais linhas serão alteradas.
```

O `WHERE` não é obrigatório para o SQL, mas é obrigatório para a intenção quando a mudança deveria atingir apenas uma parte da tabela.

Sem filtro:

```sql
UPDATE app.cliente
SET ativo = false;
```

todas as linhas recebem `false`.

Esse comando pode ser correto em uma mudança planejada. O problema é executá-lo sem perceber a abrangência.

---

### Atualizar varias colunas

Exemplo:

```sql
UPDATE app.ordem_servico
SET
    status = 'AGENDADA',
    data_agendada = '2026-07-15',
    inicio_previsto = '09:00:00',
    prioridade = 'ALTA'
WHERE id = 930001;
```

As atribuições são separadas por vírgula.

O PostgreSQL valida a linha resultante contra todas as constraints.

Se `prioridade` receber um valor inválido, o update inteiro da linha falha.

---

### Usar valor atual em UPDATE

Você pode calcular o novo valor a partir do atual:

```sql
UPDATE app.produto
SET valor = valor + 10
WHERE id = 930001;
```

Ou:

```sql
UPDATE app.produto
SET valor = round(valor * 1.10, 2)
WHERE id = 930001;
```

O lado direito usa o valor anterior ao update.

Critério:

```text
o cálculo pertence à operação?
a precisão está correta?
a regra permite esse ajuste?
o filtro está restrito?
```

Não transforme updates de negócio em cálculos obscuros.

---

### RETURNING no UPDATE

Exemplo:

```sql
UPDATE app.ordem_servico
SET status = 'AGENDADA'
WHERE id = 930001
RETURNING
    id,
    codigo,
    status,
    data_agendada;
```

No PostgreSQL 16, `RETURNING` de `UPDATE` mostra os valores da linha depois da alteração.

Isso ajuda a confirmar:

- linha atingida;
- estado resultante;
- defaults ou expressões aplicadas;
- quantidade de retornos.

Se o filtro não encontrar registros, nenhuma linha será devolvida.

---

### Rotina segura antes de UPDATE

Antes de um update importante:

1. confirme o database;
2. escreva o filtro;
3. use o mesmo filtro em um `SELECT`;
4. confira as linhas;
5. execute o `UPDATE`;
6. use `RETURNING`;
7. valide novamente.

Exemplo de prévia:

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE id = 930001;
```

Depois:

```sql
UPDATE app.ordem_servico
SET status = 'AGENDADA'
WHERE id = 930001
RETURNING id, codigo, status;
```

A aula 278 aprofundará `SELECT` e filtros. Hoje, essa consulta é uma barreira de segurança.

---

### DELETE basico

Forma:

```sql
DELETE FROM app.cliente
WHERE id = 930099;
```

`DELETE` remove linhas e mantém a tabela.

Compare:

```text
DELETE:
remove linhas.

DROP TABLE:
remove a estrutura.

TRUNCATE:
esvazia a tabela por outro mecanismo.
```

`TRUNCATE` não será aprofundado nesta aula.

---

### RETURNING no DELETE

Exemplo:

```sql
DELETE FROM app.cliente
WHERE id = 930099
RETURNING
    id,
    nome,
    documento;
```

No `DELETE`, `RETURNING` devolve os valores da linha removida.

Isso fornece evidência do que saiu do banco.

Depois do comando, a linha já não existe na tabela, mas seus dados foram enviados como resultado da operação.

---

### DELETE sem WHERE

Este comando é válido:

```sql
DELETE FROM app.cliente;
```

Ele tenta remover todas as linhas.

Foreign keys podem bloquear parte do processo, mas não trate constraints como plano de segurança para um comando errado.

Nunca dependa de:

```text
talvez a FK impeça.
```

A operação correta precisa ter o filtro correto.

Nesta aula, comandos amplos ficarão comentados no arquivo de erros controlados.

---

### Foreign key e ordem de exclusao

O modelo possui:

```text
cliente -> ordem_servico;
produto -> ordem_servico;
ordem_servico -> atividade;
ordem_servico -> evento.
```

Com `ON DELETE RESTRICT`, um registro pai não pode ser removido enquanto houver filhos.

Para remover um conjunto completo:

```text
primeiro eventos;
depois atividades;
depois ordens;
depois produtos e clientes.
```

A ordem de exclusão representa as dependências do modelo.

---

### Exclusao fisica e inativacao

`DELETE` remove fisicamente a linha.

Em muitos domínios, registros históricos não devem ser apagados. Pode ser mais adequado alterar:

```text
ativo = false;
status = CANCELADA;
data de encerramento;
motivo.
```

Isso é conhecido como inativação ou exclusão lógica, dependendo do desenho.

Nesta aula, o dataset principal será preservado. O `DELETE` será praticado em registros descartáveis.

A escolha entre remover e inativar é decisão de domínio, auditoria, legislação e arquitetura.

---

### Constraints durante DML

Cada comando pode falhar por regras já estudadas.

Exemplos:

```text
INSERT com documento repetido:
UNIQUE.

INSERT com cliente inexistente:
FOREIGN KEY.

UPDATE com valor negativo:
CHECK.

UPDATE com status inválido:
CHECK.

DELETE de cliente com ordem:
FOREIGN KEY RESTRICT.

INSERT sem nome:
NOT NULL.
```

Não corrija uma falha removendo a constraint.

Leia a mensagem, identifique a regra e corrija o comando ou o dado.

---

### Reexecucao de scripts

Um script de inserção pode falhar na segunda execução por duplicidade.

Por isso, o laboratório terá:

```text
01_limpar_dataset_anterior.sql
```

Ele remove somente os IDs reservados para a aula, na ordem correta.

O script não apaga a tabela inteira.

Esse padrão oferece repetição controlada:

```text
limpar faixa conhecida;
inserir dataset;
aplicar mudanças;
validar.
```

Não use faixas amplas em projetos reais sem critério.

---

## Mao na massa guiada

### 1. Confirmar o PostgreSQL

Na raiz do repositório:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se necessário:

```powershell
Set-Location `
  "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"

docker compose up -d
docker compose ps

Set-Location ..\..\..
```

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-277-insert-update-delete-retorno-dados\sql"

Set-Location `
  "labs\m12\aula-277-insert-update-delete-retorno-dados"
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
    current_schema() AS schema_atual;

SELECT
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema IN ('app', 'auditoria')
  AND table_name IN (
      'cliente',
      'produto',
      'ordem_servico',
      'atividade',
      'evento_ordem_servico'
  )
ORDER BY table_schema, table_name;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\00_verificar_contexto.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme o banco e as cinco tabelas.

---

### 4. Criar 01_limpar_dataset_anterior.sql

Crie:

```text
sql/01_limpar_dataset_anterior.sql
```

Conteúdo:

```sql
DELETE FROM auditoria.evento_ordem_servico
WHERE id BETWEEN 930001 AND 930099
RETURNING id, ordem_servico_id, tipo;

DELETE FROM app.atividade
WHERE id BETWEEN 930001 AND 930099
RETURNING id, ordem_servico_id, codigo;

DELETE FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930099
RETURNING id, codigo;

DELETE FROM app.produto
WHERE id BETWEEN 930001 AND 930099
RETURNING id, codigo;

DELETE FROM app.cliente
WHERE id BETWEEN 930001 AND 930099
RETURNING id, documento;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\01_limpar_dataset_anterior.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Na primeira execução, cada comando pode retornar zero linhas.

Na reexecução, o dataset anterior será removido com segurança.

---

### 5. Criar 02_insert_clientes_produtos.sql

Crie:

```text
sql/02_insert_clientes_produtos.sql
```

Conteúdo:

```sql
INSERT INTO app.cliente (
    id,
    nome,
    documento,
    email
)
VALUES
    (
        930001,
        'Mercado Horizonte',
        '93000000000001',
        'contato@horizonte.local'
    ),
    (
        930002,
        'Hospital Vida',
        '93000000000002',
        'infra@hospitalvida.local'
    ),
    (
        930003,
        'Escola Futuro',
        '93000000000003',
        NULL
    )
RETURNING
    id,
    nome,
    documento,
    ativo,
    criado_em,
    email;

INSERT INTO app.produto (
    id,
    codigo,
    nome,
    valor,
    descricao
)
VALUES
    (
        930001,
        'AR-COND-12000',
        'Ar-condicionado 12000 BTU',
        2199.90,
        'Equipamento residencial'
    ),
    (
        930002,
        'REFRIG-500L',
        'Refrigerador 500 litros',
        4899.00,
        'Equipamento comercial'
    ),
    (
        930003,
        'LAVA-ROUPAS-15',
        'Lavadora 15 kg',
        3299.50,
        'Equipamento de lavanderia'
    )
RETURNING
    id,
    codigo,
    nome,
    valor,
    ativo,
    criado_em;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\02_insert_clientes_produtos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Observe os defaults `ativo` e `criado_em`.

---

### 6. Criar 03_insert_ordens.sql

Crie:

```text
sql/03_insert_ordens.sql
```

Conteúdo:

```sql
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
VALUES
    (
        930001,
        'OS-277-001',
        930001,
        930001,
        DEFAULT,
        '2026-07-15',
        '09:00:00',
        350.00,
        false,
        'Equipamento não resfria',
        'NORMAL'
    ),
    (
        930002,
        'OS-277-002',
        930002,
        930002,
        'AGENDADA',
        '2026-07-16',
        '14:00:00',
        480.00,
        true,
        'Temperatura interna acima do esperado',
        'CRITICA'
    ),
    (
        930003,
        'OS-277-003',
        930003,
        930003,
        DEFAULT,
        NULL,
        NULL,
        DEFAULT,
        DEFAULT,
        'Equipamento apresenta ruído',
        DEFAULT
    ),
    (
        930004,
        'OS-277-004',
        930001,
        930002,
        'EM_ATENDIMENTO',
        '2026-07-14',
        '08:30:00',
        620.00,
        false,
        'Refrigerador com vazamento',
        'ALTA'
    )
RETURNING
    id,
    codigo,
    cliente_id,
    produto_id,
    status,
    data_agendada,
    valor_previsto,
    urgente,
    prioridade,
    criado_em;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\03_insert_ordens.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Observe a terceira ordem usando vários defaults e campos opcionais nulos.

---

### 7. Criar 04_insert_atividades_eventos.sql

Crie:

```text
sql/04_insert_atividades_eventos.sql
```

Conteúdo:

```sql
INSERT INTO app.atividade (
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
        930001,
        930001,
        'DIAGNOSTICO',
        'Diagnosticar sistema de refrigeração',
        'AGENDADA',
        80.00,
        interval '1 hour',
        NULL,
        NULL
    ),
    (
        930002,
        930001,
        'MANUTENCAO',
        'Executar manutenção corretiva',
        DEFAULT,
        220.00,
        interval '2 hours',
        NULL,
        NULL
    ),
    (
        930003,
        930002,
        'VISTORIA',
        'Realizar vistoria técnica',
        'AGENDADA',
        150.00,
        interval '90 minutes',
        NULL,
        NULL
    ),
    (
        930004,
        930003,
        'CONTATO',
        'Confirmar disponibilidade da escola',
        DEFAULT,
        DEFAULT,
        interval '30 minutes',
        NULL,
        NULL
    ),
    (
        930005,
        930004,
        'DIAGNOSTICO',
        'Localizar origem do vazamento',
        'EM_EXECUCAO',
        120.00,
        interval '1 hour',
        '2026-07-14 08:40:00-03',
        NULL
    ),
    (
        930006,
        930004,
        'REPARO',
        'Substituir componente danificado',
        DEFAULT,
        350.00,
        interval '3 hours',
        NULL,
        NULL
    )
RETURNING
    id,
    ordem_servico_id,
    codigo,
    status,
    valor_mao_obra,
    duracao_prevista;

INSERT INTO auditoria.evento_ordem_servico (
    id,
    ordem_servico_id,
    tipo,
    descricao
)
VALUES
    (
        930001,
        930001,
        'CRIACAO',
        'Ordem criada para o Mercado Horizonte'
    ),
    (
        930002,
        930002,
        'AGENDAMENTO',
        'Visita agendada para o Hospital Vida'
    ),
    (
        930003,
        930003,
        'CRIACAO',
        'Ordem criada aguardando agendamento'
    ),
    (
        930004,
        930004,
        'INICIO_ATENDIMENTO',
        'Atendimento iniciado'
    )
RETURNING
    id,
    ordem_servico_id,
    tipo,
    ocorrido_em;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\04_insert_atividades_eventos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

### 8. Criar 05_update_com_filtro_returning.sql

Crie:

```text
sql/05_update_com_filtro_returning.sql
```

Conteúdo:

```sql
SELECT
    id,
    nome,
    email
FROM app.cliente
WHERE id = 930003;

UPDATE app.cliente
SET email = 'manutencao@escolafuturo.local'
WHERE id = 930003
RETURNING
    id,
    nome,
    email;

SELECT
    id,
    codigo,
    valor
FROM app.produto
WHERE id = 930001;

UPDATE app.produto
SET valor = round(valor * 1.05, 2)
WHERE id = 930001
RETURNING
    id,
    codigo,
    valor;

SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada
FROM app.ordem_servico
WHERE id = 930003;

UPDATE app.ordem_servico
SET
    status = 'AGENDADA',
    prioridade = 'ALTA',
    data_agendada = '2026-07-18',
    inicio_previsto = '10:00:00'
WHERE id = 930003
RETURNING
    id,
    codigo,
    status,
    prioridade,
    data_agendada,
    inicio_previsto;

UPDATE app.atividade
SET
    status = 'CONCLUIDA',
    inicio_real = '2026-07-14 08:40:00-03',
    fim_real = '2026-07-14 09:25:00-03'
WHERE id = 930005
RETURNING
    id,
    ordem_servico_id,
    codigo,
    status,
    inicio_real,
    fim_real;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\05_update_com_filtro_returning.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Cada update deve afetar exatamente uma linha.

---

### 9. Criar 06_delete_com_filtro_returning.sql

Crie:

```text
sql/06_delete_com_filtro_returning.sql
```

Conteúdo:

```sql
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    930099,
    'Cliente Descartável',
    '93000000000099'
)
RETURNING
    id,
    nome,
    documento,
    ativo;

SELECT
    id,
    nome,
    documento
FROM app.cliente
WHERE id = 930099;

DELETE FROM app.cliente
WHERE id = 930099
RETURNING
    id,
    nome,
    documento,
    ativo,
    criado_em;

SELECT
    id,
    nome,
    documento
FROM app.cliente
WHERE id = 930099;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\06_delete_com_filtro_returning.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A última consulta não deve retornar a linha.

O dataset principal permanece.

---

### 10. Criar 07_erros_controlados.sql

Crie:

```text
sql/07_erros_controlados.sql
```

Conteúdo:

```sql
-- Execute cada bloco separadamente.
-- Todos os comandos abaixo devem falhar ou são perigosos.

-- Erro esperado: documento duplicado.
INSERT INTO app.cliente (
    nome,
    documento
)
VALUES (
    'Cliente duplicado',
    '93000000000001'
);

-- Erro esperado: foreign key inválida.
INSERT INTO app.ordem_servico (
    codigo,
    cliente_id,
    produto_id
)
VALUES (
    'OS-277-INVALIDA',
    999999,
    930001
);

-- Erro esperado: check de valor.
UPDATE app.produto
SET valor = -10
WHERE id = 930001;

-- Erro esperado: status inválido.
UPDATE app.ordem_servico
SET status = 'FINALIZADAA'
WHERE id = 930001;

-- Erro esperado: pai referenciado.
DELETE FROM app.cliente
WHERE id = 930001;

-- Perigoso: não execute.
-- UPDATE app.cliente
-- SET ativo = false;

-- Perigoso: não execute.
-- DELETE FROM app.atividade;
```

Execute os cinco erros esperados individualmente no DBeaver ou `psql`.

Não remova constraints.

Não execute os dois comandos sem `WHERE`.

---

### 11. Criar 08_validacao_final.sql

Crie:

```text
sql/08_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    count(*) AS total_clientes
FROM app.cliente
WHERE id BETWEEN 930001 AND 930099;

SELECT
    count(*) AS total_produtos
FROM app.produto
WHERE id BETWEEN 930001 AND 930099;

SELECT
    count(*) AS total_ordens
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930099;

SELECT
    count(*) AS total_atividades
FROM app.atividade
WHERE id BETWEEN 930001 AND 930099;

SELECT
    count(*) AS total_eventos
FROM auditoria.evento_ordem_servico
WHERE id BETWEEN 930001 AND 930099;

SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada,
    valor_previsto
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930004
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    inicio_real,
    fim_real
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
ORDER BY id;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-277-insert-update-delete-retorno-dados\sql\08_validacao_final.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Contagens esperadas:

```text
clientes:
3.

produtos:
3.

ordens:
4.

atividades:
6.

eventos:
4.
```

Esses dados devem permanecer para a aula 278.

---

### 12. Criar 09_exercicio.sql

Crie:

```text
sql/09_exercicio.sql
```

O exercício será concluído depois da explicação principal.

Não execute um arquivo vazio. Primeiro implemente as partes da seção de exercício guiado.

---

### 13. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 277 - Insert update delete e retorno de dados.

Pré-requisito:
aulas 274, 275 e 276 concluídas.

Objetivo:
manipular linhas com filtros, constraints e RETURNING.

Execução:
rodar 00 a 06;
executar 07 manualmente;
rodar 08;
implementar e executar 09.

Dataset preservado:
3 clientes, 3 produtos, 4 ordens, 6 atividades e 4 eventos.

Próxima aula:
SELECT, WHERE, ORDER BY, LIMIT e OFFSET.
```

Liste os IDs reservados e explique que o script 01 permite reexecução controlada.

---

## Entendendo o que foi feito

### INSERT trabalhou com regras existentes

Você não precisou repetir manualmente todos os campos porque defaults preencheram estados iniciais.

Ao mesmo tempo, constraints impediram dados inválidos.

A escrita ocorreu dentro do modelo, não ao redor dele.

---

### RETURNING reduziu consultas adicionais

Você obteve:

- IDs;
- defaults;
- valores atualizados;
- linhas removidas.

O retorno veio do próprio comando que realizou a mudança.

Esse recurso será muito útil quando Java começar a conversar diretamente com PostgreSQL no M13.

---

### UPDATE foi guiado pelo filtro

Cada update da prática atingiu uma linha.

A sequência foi:

```text
consultar;
atualizar;
retornar;
validar.
```

O filtro é parte essencial da intenção da operação.

---

### DELETE preservou o dataset principal

Você criou um cliente descartável, confirmou sua existência, removeu a linha e recebeu seus dados com `RETURNING`.

As linhas que serão usadas na aula 278 permaneceram.

---

### Constraints continuaram protegendo o banco

Os erros controlados mostraram que DML não ignora o modelo.

O PostgreSQL rejeitou duplicidade, referência inexistente, valor negativo, status inválido e remoção de pai referenciado.

---

## Erros comuns importantes

### INSERT has more expressions than target columns

A quantidade de valores não corresponde à lista de colunas.

Revise a ordem e a quantidade.

Prefira formatar uma coluna e um valor por linha quando o comando for grande.

---

### Duplicate key

Uma primary key ou unique constraint encontrou repetição.

Leia o nome da regra e o valor informado.

Não altere o identificador ou código sem entender se a linha já existe.

---

### UPDATE 0 ou DELETE 0

O filtro não encontrou linhas.

Verifique:

- database;
- schema;
- ID;
- código;
- estado atual;
- valor usado no `WHERE`.

Não remova o filtro para fazer o comando afetar alguma coisa.

---

### UPDATE afetou mais linhas que o esperado

Interrompa a sequência de comandos e investigue.

Sem transação explícita, as alterações já foram aplicadas ao final do comando.

A aula de transações ensinará recuperação controlada. Nesta fase, prevenção é essencial.

---

### DELETE bloqueado por foreign key

A linha possui dependentes.

Decida se o registro deve ser mantido, inativado ou removido após os filhos.

Não troque `RESTRICT` por `CASCADE` por conveniência.

---

## Comandos uteis

### Inserir e retornar

```sql
INSERT INTO app.cliente (
    nome,
    documento
)
VALUES (
    'Cliente',
    '001'
)
RETURNING id, nome, ativo, criado_em;
```

### Atualizar e retornar

```sql
UPDATE app.cliente
SET ativo = false
WHERE id = 1
RETURNING id, nome, ativo;
```

### Remover e retornar

```sql
DELETE FROM app.cliente
WHERE id = 1
RETURNING id, nome, documento;
```

### Executar script

```powershell
Get-Content -Raw "caminho\arquivo.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

## Exercicio guiado

### Parte 1 - Inserir uma nova ordem

No arquivo `09_exercicio.sql`, insira:

```text
ordem:
id 930010;
codigo OS-277-010;
cliente 930002;
produto 930001;
status usando default;
valor previsto 275.50;
urgente false;
descrição Atendimento adicional;
prioridade normal usando default.
```

Use `RETURNING` para mostrar todos os valores importantes.

---

### Parte 2 - Inserir duas atividades

Insira duas atividades para a ordem `930010` em um único `INSERT`.

Use:

```text
ids:
930010 e 930011.

códigos:
ANALISE e EXECUCAO.

status:
default.

valores:
50.00 e 180.00.

durações:
30 minutos e 2 horas.
```

Use `RETURNING`.

---

### Parte 3 - Atualizar a ordem

Antes do update, consulte a ordem.

Depois altere:

```text
status:
AGENDADA.

data_agendada:
2026-07-20.

inicio_previsto:
13:30.

prioridade:
ALTA.
```

Use filtro por `id = 930010` e `RETURNING`.

---

### Parte 4 - Concluir uma atividade

Atualize a atividade `930010`:

```text
status:
CONCLUIDA.

inicio_real:
2026-07-20 13:35:00-03.

fim_real:
2026-07-20 14:00:00-03.
```

Use `RETURNING`.

---

### Parte 5 - Remover o conjunto do exercicio

Tente remover primeiro a ordem.

A foreign key deve bloquear porque existem atividades.

Depois remova:

1. atividades `930010` e `930011`;
2. ordem `930010`.

Use `RETURNING` em cada comando.

Ao final, confirme que as linhas não existem.

Não remova os IDs `930001` a `930006`.

---

### Parte 6 - Explicar as decisoes

No README, responda:

1. Por que as colunas foram escritas explicitamente no `INSERT`?
2. Quais defaults foram usados?
3. O que `RETURNING` mostrou?
4. Por que o update usou `WHERE`?
5. Por que a ordem não pôde ser removida primeiro?
6. Em que situação seria melhor inativar em vez de apagar?
7. Qual foi a contagem esperada em cada comando?

---

## Criterios de aceite

- o laboratório oficial da aula 277 existe;
- o banco e as tabelas corretas foram confirmados;
- a limpeza atingiu somente a faixa reservada;
- três clientes foram inseridos;
- três produtos foram inseridos;
- quatro ordens foram inseridas;
- seis atividades foram inseridas;
- quatro eventos foram inseridos;
- listas de colunas foram explícitas;
- identity e defaults foram compreendidos;
- inserção de múltiplas linhas foi praticada;
- `RETURNING` foi usado em `INSERT`, `UPDATE` e `DELETE`;
- contagens de linhas foram conferidas;
- updates usaram filtros específicos;
- valores atuais foram usados em uma expressão de update;
- um registro descartável foi removido;
- comandos sem `WHERE` não foram executados;
- constraints rejeitaram operações inválidas;
- foreign key bloqueou remoção de pai;
- o exercício completo foi realizado;
- o dataset principal permaneceu no banco;
- as contagens finais são 3, 3, 4, 6 e 4;
- a aula 278 possui dados para consulta;
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
  labs/m12/aula-277-insert-update-delete-retorno-dados
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): manipular dados com DML e returning"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
inserção;
atualização;
remoção controlada;
RETURNING;
dataset para consultas.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você começou a manipular dados reais no modelo construído desde a aula 274.

Aprendeu:

```text
INSERT;
lista explícita de colunas;
VALUES;
inserção múltipla;
identity;
defaults;
UPDATE;
SET;
WHERE;
DELETE;
RETURNING;
contagem de linhas;
ordem de exclusão;
validação por constraints.
```

As ideias principais foram:

```text
INSERT deve deixar claro quais colunas recebe.

UPDATE precisa de filtro compatível com a intenção.

DELETE físico exige decisão consciente.

RETURNING mostra as linhas realmente modificadas.

Constraints continuam protegendo toda escrita.

A contagem de linhas afetadas é uma evidência operacional.
```

O banco agora possui um dataset consistente:

```text
3 clientes;
3 produtos;
4 ordens de serviço;
6 atividades;
4 eventos.
```

A próxima aula será:

```text
278 - M12.08 - Select where order by limit offset
```

Nela, você vai estudar leitura de dados com profundidade:

- selecionar todas ou algumas colunas;
- criar aliases;
- filtrar com `WHERE`;
- combinar condições simples;
- ordenar com `ORDER BY`;
- controlar quantidade com `LIMIT`;
- avançar posições com `OFFSET`;
- construir resultados previsíveis;
- evitar depender da ordem natural da tabela;
- preparar filtros mais ricos para a aula 279.

Não altere ou apague o dataset final. Ele será a base da próxima aula.

---

# Material complementar

## Checkpoint final

- [ ] Inseri dados usando colunas explícitas e defaults.
- [ ] Usei filtros e `RETURNING` em updates e deletes.
- [ ] Interpretei contagens e violações de constraints.
- [ ] Mantive o dataset para a aula 278 e fiz o commit.

---

## Troubleshooting adicional

### Identity gerou valor diferente do esperado

Sequences avançam independentemente dos IDs explícitos usados no dataset.

Não assuma que o próximo ID será `930004`.

Use `RETURNING id` para descobrir o valor gerado.

### Script de insert falha na segunda execucao

Execute primeiro `01_limpar_dataset_anterior.sql`.

O script remove apenas os IDs reservados e respeita a ordem das foreign keys.

### RETURNING nao mostrou linha

O filtro não encontrou registros ou a operação não foi realizada.

Confirme o comando e a mensagem de contagem.

### Comando parcial falhou

Um único `INSERT` com várias linhas é atômico em relação àquele comando. Se uma linha viola uma constraint, nenhuma linha do mesmo comando é inserida.

Comandos separados já executados não são desfeitos automaticamente.

### Dados do exercicio ficaram no banco

Remova primeiro as atividades e depois a ordem.

Use os IDs `930010` e `930011` para limitar a limpeza.

---

## Perguntas de revisao

1. O que significa DML?
2. Por que informar as colunas no `INSERT`?
3. Quando um default é aplicado?
4. Como identity funciona quando o ID é omitido?
5. O que `RETURNING` devolve no insert?
6. Como inserir várias linhas?
7. O que significa `UPDATE 0`?
8. Qual é o risco de update sem `WHERE`?
9. Como usar o valor atual em uma atualização?
10. O que `RETURNING` mostra no update?
11. Qual é o risco de delete sem `WHERE`?
12. O que `RETURNING` mostra no delete?
13. Por que filhos precisam ser removidos antes dos pais?
14. Quando inativar pode ser melhor que remover?
15. Como constraints interagem com DML?
16. Por que o dataset foi mantido?

---

## Roteiro de resposta

1. DML manipula linhas.
2. Colunas explícitas protegem contra mudanças de ordem e tornam a intenção clara.
3. O default atua quando a coluna é omitida ou `DEFAULT` é solicitado.
4. PostgreSQL obtém o próximo valor da identity.
5. A linha inserida, incluindo valores gerados e defaults.
6. Use uma lista de grupos em `VALUES`.
7. Nenhuma linha correspondeu ao filtro.
8. Todas as linhas podem ser alteradas.
9. Referencie a própria coluna no lado direito de `SET`.
10. Os valores depois da alteração.
11. Todas as linhas podem ser removidas.
12. Os valores das linhas removidas.
13. Foreign keys com `RESTRICT` protegem as referências.
14. Quando histórico, auditoria ou regra de negócio exigem preservação.
15. Toda escrita precisa respeitar as regras.
16. Ele será usado nas consultas da aula 278.

---

## Desafio opcional

Crie um cliente sem informar o ID e use `RETURNING` para capturar:

```text
id;
nome;
ativo;
criado_em.
```

Depois:

1. atualize o e-mail usando o ID retornado;
2. altere `ativo` para `false`;
3. consulte a linha;
4. remova usando o mesmo ID;
5. use `RETURNING` no delete;
6. confirme que não existe mais.

Não tente prever o ID da sequence.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 277 - M12.07 - Insert update delete e retorno de dados

- Estudei DML com `INSERT`, `UPDATE` e `DELETE`.
- Usei listas explícitas de colunas em inserções.
- Pratiquei identity columns e valores padrão.
- Inseri múltiplas linhas em um comando.
- Usei `RETURNING` para obter dados inseridos, atualizados e removidos.
- Conferi a contagem de linhas afetadas.
- Atualizei registros com `WHERE` específico.
- Usei o valor atual da coluna em uma expressão de update.
- Removi somente registros descartáveis.
- Evitei executar updates e deletes sem filtro.
- Observei constraints rejeitarem operações inválidas.
- Respeitei a ordem das foreign keys durante exclusões.
- Mantive um dataset com clientes, produtos, ordens, atividades e eventos.
- Próxima aula: `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` e `OFFSET`.
```

---

## Referencia tecnica curta

```text
INSERT:
cria linhas.

UPDATE:
altera linhas.

DELETE:
remove linhas.

RETURNING:
devolve linhas modificadas.

VALUES:
fornece valores.

SET:
define novos valores.

WHERE:
limita as linhas.

DEFAULT:
solicita valor padrão.

identity:
gera identificador.

contagem:
indica quantas linhas foram afetadas.
```

Regra final:

```text
toda escrita deve ter intenção explícita, filtro correto e evidência do resultado.
```
