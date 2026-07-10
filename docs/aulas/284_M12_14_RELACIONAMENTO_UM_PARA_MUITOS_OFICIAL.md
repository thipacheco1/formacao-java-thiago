# 284 - M12.14 - Relacionamento um para muitos

## Apresentacao da aula

Na aula 283, você estudou normalização e organizou os fatos do domínio conforme suas dependências funcionais. Listas internas, grupos repetitivos, dependências parciais e dependências transitivas foram transformados em relações com responsabilidades mais claras.

Agora você vai implementar e praticar um dos relacionamentos mais comuns em sistemas backend:

```text
um para muitos;
1:N;
one-to-many.
```

O modelo atual já possui exemplos importantes:

```text
Cliente 1:N Ordem de Serviço;

Produto 1:N Ordem de Serviço;

Ordem de Serviço 1:N Atividade;

Ordem de Serviço 1:N Evento da Ordem.
```

Nesta aula, além de consultar essas relações, você implementará um novo exemplo físico derivado das decisões de modelagem anteriores:

```text
Cliente 1:N Telefone do Cliente.
```

A regra será:

```text
um Cliente pode possuir zero, um ou vários Telefones;

cada Telefone pertence a exatamente um Cliente.
```

O relacionamento será implementado colocando a foreign key no lado muitos:

```text
TELEFONE_CLIENTE.cliente_id
    referencia
CLIENTE.cliente_id.
```

Você verá que uma relação 1:N não é apenas desenhar `1` de um lado e `N` do outro. A implementação envolve:

- identidade do registro filho;
- foreign key no lado correto;
- obrigatoriedade;
- unicidade no contexto do pai;
- ordem de inserção;
- comportamento de remoção;
- reassociação;
- consultas com join;
- multiplicidade do resultado;
- diagnóstico de referências inválidas;
- decisão entre excluir ou preservar histórico.

O laboratório reutilizará o PostgreSQL e os clientes criados na aula 277.

Nenhum relacionamento muitos-para-muitos será criado. Esse será o tema da aula 285.

Ao final desta aula, você deverá conseguir:

- explicar o que significa 1:N nos dois sentidos;
- identificar o lado um e o lado muitos;
- colocar a foreign key no lado N;
- combinar `NOT NULL` e foreign key para participação obrigatória;
- permitir que o pai exista sem filhos;
- inserir registros respeitando dependências;
- consultar pai e filhos com joins;
- compreender por que dados do pai se repetem no resultado;
- impedir filhos órfãos;
- reassociar um filho com critério;
- bloquear remoção de pai referenciado;
- remover filhos sem remover o pai;
- definir unicidade dentro do contexto do pai;
- implementar `Cliente 1:N Telefone`;
- revisar os relacionamentos 1:N já existentes.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
281:
modelagem conceitual.

282:
modelagem lógica, cardinalidade e chaves.

283:
normalização até terceira forma normal.

284:
relacionamento um para muitos.

285:
relacionamento muitos para muitos.

286:
GROUP BY, HAVING e agregações.
```

Nas aulas de modelagem, você definiu:

```text
Cliente pode possuir vários Telefones;
Telefone depende de Cliente;
Telefone não deve ser armazenado como lista textual dentro de Cliente.
```

Na normalização, uma coleção como:

```text
"11999990000; 1133334444"
```

foi reconhecida como um atributo multivalorado inadequado.

Agora a decisão lógica será materializada:

```text
CLIENTE (
    cliente_id,
    ...
)

TELEFONE_CLIENTE (
    telefone_cliente_id,
    cliente_id,
    numero,
    tipo,
    principal,
    confirmado,
    criado_em
)
```

A aula conecta três perspectivas:

```text
Conceitual:
Cliente possui Telefones.

Lógica:
TELEFONE_CLIENTE recebe cliente_id.

Física:
cliente_id possui NOT NULL e FOREIGN KEY.
```

Esse encadeamento evita criar tabelas sem compreender a regra que representam.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-284-relacionamento-um-para-muitos
```

Estrutura final:

```text
labs
└── m12
    └── aula-284-relacionamento-um-para-muitos
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_criar_telefone_cliente.sql
            ├── 02_limpar_dataset_telefone.sql
            ├── 03_inserir_telefones.sql
            ├── 04_consultar_relacionamento.sql
            ├── 05_reassociar_telefone.sql
            ├── 06_erros_controlados.sql
            ├── 07_remocao_controlada.sql
            ├── 08_validacao_final.sql
            └── 09_exercicio.sql
```

O ambiente permanece:

```text
container:
formacao-postgres-m12

database:
formacao_java

schema principal:
app
```

O dataset de clientes esperado contém:

```text
930001:
Mercado Horizonte.

930002:
Hospital Vida.

930003:
Escola Futuro.
```

O fluxo será:

1. confirmar os clientes e relacionamentos existentes;
2. criar a tabela do lado muitos;
3. limpar somente os telefones reservados para a aula;
4. inserir vários telefones para alguns clientes;
5. consultar pais com filhos e filhos com pais;
6. reassociar um telefone controlado;
7. provocar violações;
8. testar remoção protegida;
9. deixar um dataset final previsível;
10. executar o exercício;
11. documentar e commitar.

Os telefones do dataset principal usarão IDs entre:

```text
940001 e 940099.
```

---

## Conceito essencial

### Leitura do relacionamento 1:N

Considere:

```text
Cliente 1:N Telefone.
```

A leitura precisa ser feita nos dois sentidos.

Do lado de Cliente:

```text
um Cliente pode possuir vários Telefones.
```

Do lado de Telefone:

```text
cada Telefone pertence a um Cliente.
```

A cardinalidade máxima é:

```text
Cliente:
N telefones.

Telefone:
1 cliente.
```

A cardinalidade mínima será:

```text
Cliente:
0 telefones.

Telefone:
1 cliente.
```

Representação:

```text
CLIENTE 1 -------- 0..N TELEFONE_CLIENTE
```

Ou, descrevendo os dois lados:

```text
CLIENTE:
0..N Telefones.

TELEFONE_CLIENTE:
1..1 Cliente.
```

---

### O lado um

O lado um é a entidade cuja ocorrência pode ser referenciada por vários registros.

No exemplo:

```text
CLIENTE
```

Um cliente pode aparecer como referência em vários telefones.

O cliente possui sua própria identidade:

```text
cliente_id.
```

A primary key do lado um precisa ser única para que os filhos possam apontar para uma ocorrência específica.

---

### O lado muitos

O lado muitos contém várias ocorrências associadas ao mesmo pai.

No exemplo:

```text
TELEFONE_CLIENTE.
```

Cada telefone possui identidade própria:

```text
telefone_cliente_id.
```

E a referência ao pai:

```text
cliente_id.
```

Duas chaves cumprem papéis diferentes:

```text
telefone_cliente_id:
identifica o telefone.

cliente_id:
identifica a qual cliente o telefone pertence.
```

---

### Foreign key no lado N

Regra de mapeamento:

```text
em um relacionamento 1:N,
a chave do lado 1 é propagada para o lado N.
```

Estrutura:

```text
CLIENTE
PK cliente_id

TELEFONE_CLIENTE
PK telefone_cliente_id
FK cliente_id -> CLIENTE.cliente_id
```

Não coloque uma lista de telefones dentro de Cliente.

Também não coloque várias colunas:

```text
telefone_1;
telefone_2;
telefone_3.
```

A relação filha permite quantidade variável sem alterar a estrutura do pai.

---

### Primary key e foreign key

A primary key do filho responde:

```text
qual registro de telefone é este?
```

A foreign key responde:

```text
a qual cliente ele pertence?
```

Um telefone pode mudar de cliente tecnicamente por meio de atualização da FK, mas essa operação precisa fazer sentido no domínio.

Um número corporativo pode ser transferido.

Um contato pessoal cadastrado incorretamente pode ser corrigido.

Por outro lado, uma reassociação indevida pode alterar histórico.

O fato de o SQL permitir não elimina a necessidade de regra de negócio.

---

### Participacao obrigatoria do filho

A regra desta aula será:

```text
um Telefone não existe no modelo sem Cliente.
```

Fisicamente, isso exige duas proteções:

```text
NOT NULL:
cliente_id precisa ser informado.

FOREIGN KEY:
o valor informado precisa existir em CLIENTE.
```

Somente `NOT NULL` permitiria um ID inexistente.

Somente foreign key, sem `NOT NULL`, permitiria ausência.

A combinação representa:

```text
exatamente um cliente válido.
```

---

### Participacao opcional do pai

O Cliente pode existir sem Telefone.

Isso não exige uma coluna nula em Cliente.

A opcionalidade é representada pela ausência de linhas em `TELEFONE_CLIENTE`.

Exemplo:

```text
Cliente 930003 existe;

nenhuma linha de Telefone referencia 930003.
```

O pai continua válido.

Essa é uma diferença importante:

```text
pai sem filhos:
zero linhas no lado muitos.

filho sem pai:
referência nula ou inválida.
```

Nesta aula, o primeiro caso é permitido e o segundo é proibido.

---

### Identidade do filho

Um telefone do cliente não será identificado apenas pelo número.

Usaremos:

```text
id:
primary key substituta.

cliente_id + numero:
alternate key composta.
```

A primary key permite identidade estável.

A unique composta impede que o mesmo cliente cadastre o mesmo número duas vezes:

```text
UNIQUE (cliente_id, numero)
```

O mesmo número poderá, tecnicamente, aparecer para clientes diferentes.

Isso pode ser válido para:

- telefone compartilhado;
- central de atendimento;
- contato familiar;
- número corporativo.

Se o domínio exigisse unicidade global, a constraint seria apenas sobre `numero`.

A regra precisa ser escolhida conscientemente.

---

### Unicidade no contexto do pai

Considere:

```text
Cliente A:
telefone 11999990000.

Cliente B:
telefone 11999990000.
```

Com:

```text
UNIQUE (cliente_id, numero)
```

as duas linhas são permitidas porque as combinações são diferentes.

Dentro do Cliente A, repetir o mesmo número é proibido.

Essa é uma regra comum em relações filhas:

```text
código da atividade único dentro da ordem;

sequência do item única dentro do pedido;

nome do arquivo único dentro do lote.
```

A chave de negócio pode depender do contexto do pai.

---

### Ordem de insercao

Com foreign key obrigatória:

```text
primeiro:
o pai precisa existir.

depois:
o filho pode ser inserido.
```

Fluxo:

```text
INSERT CLIENTE;
INSERT TELEFONE_CLIENTE.
```

No laboratório, os clientes já existem.

Se você tentar inserir um telefone para `cliente_id = 999999`, PostgreSQL rejeitará a operação.

Isso impede filho órfão.

---

### Ordem de exclusao

Com:

```text
ON DELETE RESTRICT
```

um Cliente com Telefones não pode ser removido.

Para exclusão física:

```text
primeiro:
remova ou reassocie os filhos.

depois:
remova o pai.
```

Nesta formação, o dataset principal de clientes será preservado.

A prática de remoção usará um cliente descartável criado especificamente para o teste.

---

### RESTRICT, CASCADE e SET NULL

Possibilidades:

```text
RESTRICT:
bloqueia remoção do pai.

CASCADE:
remove automaticamente os filhos.

SET NULL:
mantém os filhos sem referência.
```

Para `TELEFONE_CLIENTE`, usaremos:

```text
ON DELETE RESTRICT.
```

Motivos:

- a remoção automática precisa ser consciente;
- o relacionamento é obrigatório;
- `SET NULL` contrariaria a regra 1..1 do filho;
- o laboratório deve tornar a dependência visível.

`CASCADE` pode ser adequado em outros domínios, mas não será o padrão aplicado aqui.

---

### Atualizacao da chave do pai

Usaremos:

```text
ON UPDATE RESTRICT.
```

A primary key do cliente deve ser estável.

Alterar o identificador do pai não é uma operação comum de negócio.

Mudanças em nome, documento ou e-mail não exigem mudar `cliente_id`.

---

### Consultar filho com pai

Quando o filho exige pai válido, `INNER JOIN` é apropriado:

```sql
SELECT
    tc.numero,
    c.nome
FROM app.telefone_cliente AS tc
INNER JOIN app.cliente AS c
    ON c.id = tc.cliente_id;
```

Toda linha de telefone deve encontrar cliente.

Se não encontrar, existe violação estrutural — algo que a foreign key impede.

---

### Consultar pai com filhos

Para listar todos os clientes, inclusive quem não possui telefone:

```sql
SELECT
    c.nome,
    tc.numero
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id;
```

O `LEFT JOIN` preserva Cliente.

Um cliente sem telefone aparece com colunas do telefone em `NULL`.

---

### Multiplicidade no resultado

Se um Cliente possui três Telefones, o nome do Cliente aparece em três linhas do join.

Isso não significa que há três clientes.

Significa:

```text
uma linha do lado um
combinou com três linhas do lado muitos.
```

A repetição está no resultado da consulta, não no armazenamento do nome do cliente.

Esse comportamento foi estudado em joins e agora aparece ligado ao relacionamento físico.

---

### Contar filhos

Uma necessidade comum é saber quantos filhos cada pai possui.

Agregações com `GROUP BY` e `COUNT` serão aprofundadas na aula 286.

Nesta aula, observe visualmente as linhas e preserve o foco em estrutura, referência e cardinalidade.

---

### Reassociar um filho

Uma reassociação altera a foreign key:

```sql
UPDATE app.telefone_cliente
SET cliente_id = 930003
WHERE id = 940005;
```

O PostgreSQL verifica:

- novo cliente existe;
- cliente_id não é nulo;
- nova combinação de cliente e número é única;
- demais checks continuam válidos.

Antes de reassociar, confirme:

- registro correto;
- pai atual;
- novo pai;
- justificativa;
- impacto histórico;
- conflitos de unicidade.

---

### Dados do pai nao pertencem ao filho

Evite armazenar em `TELEFONE_CLIENTE`:

```text
cliente_nome;
cliente_documento;
cliente_email.
```

Esses fatos dependem de `cliente_id` e pertencem a Cliente.

Quando forem necessários, use join.

Duplicá-los criaria dependência transitiva e risco de inconsistência.

---

### Dados do filho nao pertencem ao pai

Evite armazenar em Cliente:

```text
telefone_principal;
telefone_secundario;
telefone_terciario.
```

A quantidade de telefones é variável.

O lado muitos representa cada ocorrência separadamente.

---

### Regra de apenas um telefone principal

O modelo possui:

```text
principal boolean.
```

A regra desejável poderia ser:

```text
cada cliente possui no máximo um telefone principal.
```

Um `CHECK` não consegue comparar várias linhas.

Uma solução física possível envolve índice único parcial, assunto reservado para a aula de índices.

Nesta aula, registraremos a regra, mas não a implementaremos.

Isso demonstra que nem toda regra do relacionamento é resolvida apenas por foreign key.

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
  -Path "labs\m12\aula-284-relacionamento-um-para-muitos\sql"

Set-Location `
  "labs\m12\aula-284-relacionamento-um-para-muitos"
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
    nome,
    documento
FROM app.cliente
WHERE id IN (
    930001,
    930002,
    930003
)
ORDER BY id;

SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint AS con
WHERE con.conrelid = 'app.ordem_servico'::regclass
  AND con.contype = 'f'
ORDER BY con.conname;

SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint AS con
WHERE con.conrelid = 'app.atividade'::regclass
  AND con.contype = 'f'
ORDER BY con.conname;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme os três clientes e as FKs dos relacionamentos já existentes.

---

### 4. Criar 01_criar_telefone_cliente.sql

Crie:

```text
sql/01_criar_telefone_cliente.sql
```

Conteúdo:

```sql
CREATE TABLE app.telefone_cliente (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    cliente_id bigint NOT NULL,
    numero text NOT NULL,
    tipo text NOT NULL DEFAULT 'CELULAR',
    principal boolean NOT NULL DEFAULT false,
    confirmado boolean NOT NULL DEFAULT false,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_telefone_cliente
        PRIMARY KEY (id),

    CONSTRAINT fk_telefone_cliente_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES app.cliente (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT uq_telefone_cliente_numero
        UNIQUE (cliente_id, numero),

    CONSTRAINT ck_telefone_cliente_numero_nao_vazio
        CHECK (btrim(numero) <> ''),

    CONSTRAINT ck_telefone_cliente_tipo_valido
        CHECK (
            tipo IN (
                'CELULAR',
                'RESIDENCIAL',
                'COMERCIAL'
            )
        )
);
```

Execute uma única vez:

```powershell
Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\01_criar_telefone_cliente.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Inspecione:

```powershell
docker exec formacao-postgres-m12 `
  psql -U formacao -d formacao_java `
  -c "\d app.telefone_cliente"
```

Identifique:

- PK;
- FK;
- unique composta;
- checks;
- defaults;
- nulabilidade.

---

### 5. Criar 02_limpar_dataset_telefone.sql

Crie:

```text
sql/02_limpar_dataset_telefone.sql
```

Conteúdo:

```sql
DELETE FROM app.telefone_cliente
WHERE id BETWEEN 940001 AND 940099
RETURNING
    id,
    cliente_id,
    numero;
```

Execute antes de inserir o dataset:

```powershell
Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\02_limpar_dataset_telefone.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Esse script não remove clientes.

---

### 6. Criar 03_inserir_telefones.sql

Crie:

```text
sql/03_inserir_telefones.sql
```

Conteúdo:

```sql
INSERT INTO app.telefone_cliente (
    id,
    cliente_id,
    numero,
    tipo,
    principal,
    confirmado
)
VALUES
    (
        940001,
        930001,
        '11940000001',
        'COMERCIAL',
        true,
        true
    ),
    (
        940002,
        930001,
        '11940000002',
        'CELULAR',
        false,
        false
    ),
    (
        940003,
        930002,
        '11940000003',
        'COMERCIAL',
        true,
        true
    ),
    (
        940004,
        930002,
        '11940000004',
        'CELULAR',
        false,
        true
    ),
    (
        940005,
        930002,
        '11940000005',
        'RESIDENCIAL',
        false,
        false
    )
RETURNING
    id,
    cliente_id,
    numero,
    tipo,
    principal,
    confirmado,
    criado_em;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\03_inserir_telefones.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Estado inicial:

```text
Mercado Horizonte:
2 telefones.

Hospital Vida:
3 telefones.

Escola Futuro:
0 telefones.
```

---

### 7. Criar 04_consultar_relacionamento.sql

Crie:

```text
sql/04_consultar_relacionamento.sql
```

Conteúdo:

```sql
SELECT
    tc.id AS telefone_id,
    tc.numero,
    tc.tipo,
    tc.principal,
    c.id AS cliente_id,
    c.nome AS cliente_nome
FROM app.telefone_cliente AS tc
INNER JOIN app.cliente AS c
    ON c.id = tc.cliente_id
WHERE tc.id BETWEEN 940001 AND 940099
ORDER BY
    c.id,
    tc.principal DESC,
    tc.id;

SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    tc.id AS telefone_id,
    tc.numero,
    tc.tipo,
    tc.principal
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
   AND tc.id BETWEEN 940001 AND 940099
WHERE c.id IN (
    930001,
    930002,
    930003
)
ORDER BY
    c.id,
    tc.principal DESC,
    tc.id;

SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
   AND tc.id BETWEEN 940001 AND 940099
WHERE c.id IN (
        930001,
        930002,
        930003
      )
  AND tc.id IS NULL
ORDER BY c.id;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\04_consultar_relacionamento.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Observe:

- o inner join retorna somente telefones com clientes;
- o left join preserva os três clientes;
- Escola Futuro aparece sem telefone;
- o nome do Hospital aparece três vezes porque existem três filhos.

---

### 8. Criar 05_reassociar_telefone.sql

Crie:

```text
sql/05_reassociar_telefone.sql
```

Conteúdo:

```sql
SELECT
    tc.id,
    tc.numero,
    tc.cliente_id,
    c.nome AS cliente_nome
FROM app.telefone_cliente AS tc
INNER JOIN app.cliente AS c
    ON c.id = tc.cliente_id
WHERE tc.id = 940005;

UPDATE app.telefone_cliente
SET cliente_id = 930003
WHERE id = 940005
RETURNING
    id,
    cliente_id,
    numero,
    tipo;

SELECT
    tc.id,
    tc.numero,
    tc.cliente_id,
    c.nome AS cliente_nome
FROM app.telefone_cliente AS tc
INNER JOIN app.cliente AS c
    ON c.id = tc.cliente_id
WHERE tc.id = 940005;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\05_reassociar_telefone.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Estado final planejado:

```text
Mercado Horizonte:
2 telefones.

Hospital Vida:
2 telefones.

Escola Futuro:
1 telefone.
```

A reassociação serve para praticar a atualização da FK.

Em um sistema real, registre motivo e histórico quando a troca possuir relevância.

---

### 9. Criar 06_erros_controlados.sql

Crie:

```text
sql/06_erros_controlados.sql
```

Conteúdo:

```sql
-- Execute uma instrução por vez.
-- Todas devem falhar.

-- Filho sem pai existente.
INSERT INTO app.telefone_cliente (
    id,
    cliente_id,
    numero
)
VALUES (
    940090,
    999999,
    '11940999990'
);

-- Filho sem referência obrigatória.
INSERT INTO app.telefone_cliente (
    id,
    cliente_id,
    numero
)
VALUES (
    940091,
    NULL,
    '11940999991'
);

-- Mesmo número repetido para o mesmo cliente.
INSERT INTO app.telefone_cliente (
    id,
    cliente_id,
    numero
)
VALUES (
    940092,
    930001,
    '11940000001'
);

-- Tipo fora do domínio permitido.
INSERT INTO app.telefone_cliente (
    id,
    cliente_id,
    numero,
    tipo
)
VALUES (
    940093,
    930001,
    '11940999993',
    'FAX'
);

-- Reassociação para pai inexistente.
UPDATE app.telefone_cliente
SET cliente_id = 999999
WHERE id = 940001;

-- Remoção de pai ainda referenciado.
DELETE FROM app.cliente
WHERE id = 930001;
```

Abra no DBeaver ou `psql`.

Execute uma instrução por vez.

Identifique:

```text
fk_telefone_cliente_cliente;
NOT NULL de cliente_id;
uq_telefone_cliente_numero;
ck_telefone_cliente_tipo_valido.
```

Não remova constraints para fazer os comandos passarem.

---

### 10. Criar 07_remocao_controlada.sql

Crie:

```text
sql/07_remocao_controlada.sql
```

Conteúdo:

```sql
INSERT INTO app.cliente (
    id,
    nome,
    documento
)
VALUES (
    940090,
    'Cliente Descartável Aula 284',
    '94000000000090'
)
RETURNING
    id,
    nome,
    documento;

INSERT INTO app.telefone_cliente (
    id,
    cliente_id,
    numero,
    tipo
)
VALUES (
    940090,
    940090,
    '11940940090',
    'CELULAR'
)
RETURNING
    id,
    cliente_id,
    numero;

-- Execute separadamente no DBeaver:
-- deve falhar por RESTRICT.
-- DELETE FROM app.cliente
-- WHERE id = 940090;

DELETE FROM app.telefone_cliente
WHERE id = 940090
RETURNING
    id,
    cliente_id,
    numero;

DELETE FROM app.cliente
WHERE id = 940090
RETURNING
    id,
    nome,
    documento;
```

Execute as inserções.

Depois execute manualmente o delete comentado para observar o bloqueio.

Em seguida, remova primeiro o telefone e depois o cliente.

A ordem respeita o relacionamento.

---

### 11. Criar 08_validacao_final.sql

Crie:

```text
sql/08_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    tc.id AS telefone_id,
    tc.numero,
    tc.tipo,
    tc.principal,
    tc.confirmado
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
   AND tc.id BETWEEN 940001 AND 940099
WHERE c.id IN (
    930001,
    930002,
    930003
)
ORDER BY
    c.id,
    tc.principal DESC,
    tc.id;

SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint AS con
WHERE con.conrelid = 'app.telefone_cliente'::regclass
ORDER BY
    con.contype,
    con.conname;

SELECT
    tc.id,
    tc.cliente_id,
    tc.numero
FROM app.telefone_cliente AS tc
LEFT JOIN app.cliente AS c
    ON c.id = tc.cliente_id
WHERE tc.id BETWEEN 940001 AND 940099
  AND c.id IS NULL
ORDER BY tc.id;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-284-relacionamento-um-para-muitos\sql\08_validacao_final.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado esperado:

```text
cinco telefones principais do laboratório;

todos vinculados a clientes existentes;

nenhum telefone órfão;

constraints visíveis.
```

---

### 12. Criar 09_exercicio.sql

Crie:

```text
sql/09_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Não altere os IDs `940001` a `940005`.

Use IDs a partir de `940010` para o exercício.

---

### 13. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 284 - Relacionamento um para muitos.

Objetivo:
implementar e validar Cliente 1:N Telefone.

Lado um:
app.cliente.

Lado muitos:
app.telefone_cliente.

FK:
telefone_cliente.cliente_id -> cliente.id.

Participação:
Cliente pode ter zero ou muitos Telefones;
Telefone precisa ter exatamente um Cliente.

Remoção:
ON DELETE RESTRICT.

Dataset preservado:
cinco telefones com IDs 940001 a 940005.

Próxima aula:
relacionamento muitos para muitos.
```

Liste os scripts e a ordem de execução.

---

## Entendendo o que foi feito

### A foreign key ficou no lado muitos

Cada linha de Telefone possui `cliente_id`.

Cliente não precisou receber uma lista nem várias colunas de telefone.

A estrutura suporta qualquer quantidade de filhos.

---

### Obrigatoriedade usou duas regras

`NOT NULL` exigiu presença.

A foreign key exigiu existência.

Juntas, elas representaram:

```text
todo Telefone pertence a exatamente um Cliente válido.
```

---

### O pai permaneceu opcional em relacao aos filhos

Cliente pôde existir sem Telefone.

Essa regra apareceu como ausência de linhas filhas, não como ausência do próprio cliente.

---

### O join refletiu a cardinalidade

Um cliente com dois telefones apareceu em duas linhas.

A repetição no resultado correspondeu à multiplicidade 1:N.

Os dados do cliente continuaram armazenados apenas em Cliente.

---

### RESTRICT tornou a dependencia visivel

O banco bloqueou a remoção do pai enquanto o filho existia.

A limpeza precisou respeitar:

```text
filho primeiro;
pai depois.
```

---

### A regra composta pertenceu ao contexto

`UNIQUE (cliente_id, numero)` impediu repetição dentro do mesmo cliente e permitiu discutir números compartilhados entre clientes.

A regra de unicidade foi definida conforme o domínio, não apenas pelo formato do dado.

---

## Erros comuns importantes

### Foreign key no lado errado

Se você colocar `telefone_id` em Cliente, um cliente poderá apontar para apenas um telefone por coluna.

O lado N deve receber a referência ao lado 1.

---

### Filho aceita NULL

A FK existe, mas a coluna não recebeu `NOT NULL`.

Se a participação é obrigatória, aplique as duas regras.

---

### Pai nao pode ser removido

Existem filhos e a FK usa `RESTRICT`.

Remova ou trate os filhos primeiro.

Não substitua por `CASCADE` sem decisão de domínio.

---

### Join parece duplicar Cliente

O pai aparece uma vez por filho.

Projete as chaves dos filhos para visualizar a multiplicidade.

---

### Mesmo telefone aparece duas vezes

Confirme se a duplicidade está:

```text
no armazenamento;
ou apenas no resultado de um join adicional.
```

Use a unique composta para proteger o armazenamento dentro do mesmo cliente.

---

## Comandos uteis

### Criar FK no lado N

```sql
FOREIGN KEY (cliente_id)
REFERENCES app.cliente (id)
```

### Consultar filhos com pai

```sql
FROM app.telefone_cliente AS tc
INNER JOIN app.cliente AS c
    ON c.id = tc.cliente_id
```

### Preservar pais sem filhos

```sql
FROM app.cliente AS c
LEFT JOIN app.telefone_cliente AS tc
    ON tc.cliente_id = c.id
```

### Encontrar pais sem filhos

```sql
WHERE tc.id IS NULL
```

---

## Exercicio guiado

No arquivo:

```text
sql/09_exercicio.sql
```

resolva as tarefas.

### Parte 1 - Inserir novo telefone

Insira:

```text
id:
940010.

cliente:
930003.

numero:
11940000010.

tipo:
CELULAR.

principal:
true.

confirmado:
true.
```

Use `RETURNING`.

---

### Parte 2 - Mesma combinacao

Tente inserir novamente:

```text
cliente 930003;
numero 11940000010.
```

Use outro ID.

A unique composta deve rejeitar.

Execute manualmente e mantenha o comando comentado depois do teste.

---

### Parte 3 - Mesmo numero em outro cliente

Insira o mesmo número para:

```text
cliente 930001.
```

Explique por que a operação funciona com a regra atual.

Depois remova essa linha de exercício.

---

### Parte 4 - Consultar clientes e telefones

Crie uma consulta com `LEFT JOIN` que retorne:

```text
cliente;
telefone;
tipo;
principal;
confirmado.
```

Preserve os três clientes.

Ordene por cliente, principal e telefone.

---

### Parte 5 - Reassociar e retornar

Reassocie o telefone `940010` de `930003` para `930002`.

Antes:

```text
consulte o pai atual.
```

Durante:

```text
use UPDATE com RETURNING.
```

Depois:

```text
consulte o novo pai.
```

Explique quando uma reassociação é aceitável.

---

### Parte 6 - Remover filho

Remova o telefone `940010`.

Confirme que:

```text
o telefone deixou de existir;

os clientes 930002 e 930003 continuam existindo.
```

O relacionamento não significa que remover o filho remove o pai.

---

### Parte 7 - Revisar relacionamentos existentes

Analise:

```text
Cliente 1:N Ordem;

Produto 1:N Ordem;

Ordem 1:N Atividade;

Ordem 1:N Evento.
```

Para cada um, registre:

1. lado um;
2. lado muitos;
3. FK;
4. obrigatoriedade do filho;
5. se o pai pode existir sem filhos;
6. política de remoção atual;
7. consulta de verificação.

---

### Parte 8 - Regra de principal

Explique por que:

```text
CHECK (principal IN (true, false))
```

não garantiria somente um telefone principal por cliente.

Registre qual recurso físico poderá ser analisado na aula de índices.

Não implemente agora.

---

## Criterios de aceite

- o laboratório oficial da aula 284 existe;
- a linha da grade e o H1 estão corretos;
- o PostgreSQL anterior foi reutilizado;
- os clientes da aula 277 foram preservados;
- `app.telefone_cliente` foi criada;
- a PK do filho foi criada;
- a FK foi colocada no lado N;
- `cliente_id` é obrigatório;
- `ON DELETE RESTRICT` foi aplicado;
- a unique composta protege número dentro do cliente;
- checks e defaults foram aplicados;
- cinco telefones principais foram inseridos;
- um cliente possui dois telefones;
- outro cliente possui dois telefones após a reassociação;
- outro cliente possui um telefone;
- inner join e left join foram praticados;
- pai sem filho foi observado;
- filho órfão foi rejeitado;
- cliente nulo foi rejeitado;
- duplicidade contextual foi rejeitada;
- reassociação válida foi praticada;
- reassociação inválida foi rejeitada;
- remoção do pai referenciado foi bloqueada;
- remoção controlada respeitou filho antes do pai;
- nenhum relacionamento N:N foi criado;
- a regra de telefone principal foi documentada sem antecipar índices;
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
  labs/m12/aula-284-relacionamento-um-para-muitos
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): implementar relacionamento um para muitos"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
relação pai e filho;
foreign key no lado N;
integridade referencial;
consultas;
remoção protegida;
reassociação controlada.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você implementou um relacionamento 1:N completo.

Aprendeu:

```text
lado um;
lado muitos;
foreign key no lado N;
participação obrigatória;
participação opcional;
PK do filho;
alternate key composta;
ordem de inserção;
ordem de exclusão;
RESTRICT;
reassociação;
inner join;
left join;
multiplicidade.
```

As regras principais foram:

```text
o lado N recebe a chave do lado 1;

NOT NULL exige referência presente;

foreign key exige referência válida;

o pai pode existir sem filhos;

o filho obrigatório não pode existir sem pai;

um pai aparece uma vez por filho no resultado do join;

dados do pai não devem ser duplicados no filho;

remoção precisa respeitar as dependências;

unicidade pode depender do contexto do pai.
```

A próxima aula será:

```text
285 - M12.15 - Relacionamento muitos para muitos
```

Nela, você vai estudar:

- por que uma FK simples não resolve N:N;
- entidade associativa;
- duas foreign keys;
- chave composta;
- chave substituta e alternate key composta;
- atributos do relacionamento;
- inserção da associação;
- prevenção de associação duplicada;
- consultas entre os dois lados;
- remoção da associação sem remover as entidades;
- exemplo Atividade N:N Competência.

O relacionamento 1:N conectou pai e filhos.

O relacionamento N:N será representado por duas relações 1:N ligadas por uma entidade associativa.

---

# Material complementar

## Checkpoint final

- [ ] Implementei a FK no lado muitos.
- [ ] Testei inserção, consulta, reassociação e remoção protegida.
- [ ] Expliquei opcionalidade, multiplicidade e unicidade contextual.
- [ ] Mantive o dataset e fiz o commit recomendado.

---

## Troubleshooting adicional

### Table telefone_cliente already exists

O script de criação já foi executado.

Não recrie a tabela.

Continue pela inspeção e limpeza do dataset reservado.

### Violacao unique depois de reassociar

O novo cliente já possui o mesmo número.

Escolha outro número ou revise a regra de negócio.

### DELETE do cliente falha mesmo sem telefones do laboratorio

O cliente também pode possuir Ordens de Serviço.

Inspecione todas as foreign keys que referenciam Cliente.

### Telefone principal duplicado

A estrutura atual ainda não protege “um principal por cliente”.

Registre a pendência e não tente resolvê-la com check entre linhas.

### Reexecucao dos inserts falha

Execute `02_limpar_dataset_telefone.sql` antes de inserir novamente.

---

## Perguntas de revisao

1. O que significa 1:N?
2. Qual é o lado um no exemplo?
3. Qual é o lado muitos?
4. Onde fica a foreign key?
5. Por que o filho possui PK própria?
6. O que `NOT NULL` garante?
7. O que a foreign key garante?
8. Como o pai existe sem filhos?
9. Por que não armazenar uma lista no pai?
10. O que a unique composta protege?
11. Por que o pai se repete no join?
12. Para que serve `LEFT JOIN`?
13. O que `RESTRICT` faz?
14. Qual é a ordem de exclusão?
15. Reassociar um filho é sempre correto?
16. Por que um check não garante um único principal?

---

## Roteiro de resposta

1. Uma ocorrência do pai pode relacionar-se com várias do filho.
2. Cliente.
3. Telefone do Cliente.
4. No lado muitos.
5. Para identificar cada filho.
6. A referência precisa estar presente.
7. A referência precisa existir no pai.
8. Não existem linhas filhas para ele.
9. Quantidade variável exige ocorrências separadas.
10. O mesmo número não repete dentro do mesmo cliente.
11. Uma linha é produzida para cada filho.
12. Preserva pais sem filhos.
13. Bloqueia remoção do pai referenciado.
14. Primeiro filhos, depois pai.
15. Não; depende de regra e histórico.
16. Check avalia uma linha, não o conjunto de irmãos.

---

## Desafio opcional

Implemente conceitualmente e fisicamente:

```text
Cliente 1:N Endereço do Cliente.
```

Defina:

- PK do endereço;
- FK para cliente;
- obrigatoriedade;
- tipo do endereço;
- regra de endereço principal;
- unique contextual;
- comportamento de remoção;
- consultas com inner e left join.

Não use muitos-para-muitos.

Registre qualquer regra que não possa ser implementada com as constraints já estudadas.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 284 - M12.14 - Relacionamento um para muitos

- Implementei o relacionamento `Cliente 1:N Telefone do Cliente`.
- Identifiquei o lado um e o lado muitos.
- Coloquei a foreign key no lado N.
- Combinei `NOT NULL` e foreign key para exigir um pai válido.
- Mantive a possibilidade de Cliente existir sem Telefone.
- Criei PK própria para o registro filho.
- Usei unique composta para proteger número dentro do contexto do Cliente.
- Inseri vários filhos para o mesmo pai.
- Consultei filhos com pai usando `INNER JOIN`.
- Preservei pais sem filhos usando `LEFT JOIN`.
- Entendi a repetição do pai causada pela multiplicidade.
- Pratiquei reassociação controlada da foreign key.
- Observei `RESTRICT` bloquear a remoção do pai.
- Removi primeiro o filho e depois o pai descartável.
- Próxima aula: relacionamento muitos para muitos.
```

---

## Referencia tecnica curta

```text
1:N:
um pai, vários filhos.

PK do pai:
alvo da referência.

PK do filho:
identidade do filho.

FK no lado N:
referência ao pai.

NOT NULL:
pai obrigatório.

RESTRICT:
bloqueia remoção do pai com filhos.

LEFT JOIN:
preserva pais sem filhos.

UNIQUE contextual:
combinação da FK com atributo do filho.
```

Regra final:

```text
em 1:N, cada filho guarda a referencia de um pai, e o banco protege essa dependencia.
```
