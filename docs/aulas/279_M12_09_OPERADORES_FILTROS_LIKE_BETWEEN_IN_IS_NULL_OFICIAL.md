# 279 - M12.09 - Operadores filtros like between in is null

## Apresentacao da aula

Na aula 278, você aprendeu a construir consultas previsíveis com:

```text
SELECT;
FROM;
WHERE;
ORDER BY;
LIMIT;
OFFSET.
```

Você selecionou colunas explícitas, aplicou filtros básicos por igualdade, ordenou resultados com critérios de desempate e criou recortes estáveis.

Agora vamos ampliar a capacidade de filtrar dados.

Uma aplicação backend raramente consulta apenas:

```text
id igual a um valor;
status igual a um valor;
boolean igual a true.
```

As perguntas de negócio costumam ser mais ricas:

```text
quais produtos custam mais de determinado valor?
quais ordens estão dentro de um período?
quais registros pertencem a um conjunto de status?
quais clientes possuem determinado texto no nome?
quais atividades ainda não começaram?
quais ordens são urgentes e estão agendadas?
quais resultados atendem a uma condição ou a outra?
```

Para responder, você vai estudar:

```text
operadores de comparação;
AND;
OR;
NOT;
precedência;
parênteses;
LIKE;
ILIKE;
coringas % e _;
BETWEEN;
IN;
IS NULL;
IS NOT NULL.
```

O objetivo não é decorar uma lista de símbolos. Você precisa aprender a transformar uma regra de negócio em uma expressão booleana legível.

Uma expressão usada no `WHERE` pode resultar em:

```text
true;
false;
unknown.
```

O terceiro resultado aparece quando `NULL` participa da avaliação. Essa lógica de três valores explica por que:

```sql
coluna = NULL
```

não funciona como muitos iniciantes esperam.

Nesta aula, o laboratório continuará sendo somente leitura. O dataset criado na aula 277 será preservado.

Ainda não vamos combinar tabelas. `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN` e `CROSS JOIN` pertencem à aula 280.

Ao final, você deverá conseguir:

- comparar números, textos e datas;
- usar `AND`, `OR` e `NOT`;
- controlar precedência com parênteses;
- buscar padrões com `LIKE` e `ILIKE`;
- compreender os coringas `%` e `_`;
- filtrar intervalos inclusivos com `BETWEEN`;
- comparar com listas por meio de `IN`;
- testar ausência com `IS NULL` e `IS NOT NULL`;
- combinar filtros sem criar ambiguidades;
- interpretar resultados vazios;
- evitar armadilhas com `NULL`;
- manter consultas legíveis;
- preparar critérios que serão usados em joins.

---

## Onde estamos na formacao

A sequência imediata do M12 é:

```text
277:
INSERT, UPDATE, DELETE e RETURNING.

278:
SELECT, WHERE, ORDER BY, LIMIT e OFFSET.

279:
operadores e filtros.

280:
joins com critério.

281:
modelagem conceitual.

282:
modelagem lógica, cardinalidade e chaves.
```

A progressão é intencional:

```text
primeiro:
ler uma tabela.

depois:
filtrar uma tabela com mais precisão.

em seguida:
combinar tabelas relacionadas.
```

Um join não elimina a necessidade de saber filtrar. Pelo contrário, consultas com várias tabelas ficam mais difíceis quando as condições já são confusas em uma tabela única.

Nesta aula, você continuará usando:

```text
app.cliente;
app.produto;
app.ordem_servico;
app.atividade;
auditoria.evento_ordem_servico.
```

O dataset esperado possui:

```text
3 clientes;
3 produtos;
4 ordens;
6 atividades;
4 eventos.
```

Os scripts não modificarão esse conjunto.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-279-operadores-filtros-like-between-in-is-null
```

Estrutura final:

```text
labs
└── m12
    └── aula-279-operadores-filtros-like-between-in-is-null
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_operadores_comparacao.sql
            ├── 02_and_or_not_precedencia.sql
            ├── 03_like_ilike.sql
            ├── 04_between.sql
            ├── 05_in.sql
            ├── 06_is_null.sql
            ├── 07_filtros_combinados.sql
            ├── 08_armadilhas_controladas.sql
            ├── 09_exercicio.sql
            └── 10_validacao_final.sql
```

O fluxo será:

1. confirmar o contexto e o dataset;
2. comparar valores;
3. combinar condições;
4. buscar padrões textuais;
5. filtrar intervalos;
6. filtrar listas;
7. tratar valores nulos;
8. combinar recursos em consultas de negócio;
9. analisar armadilhas;
10. resolver o exercício;
11. validar que os dados não foram alterados;
12. fazer o commit.

O ambiente permanece:

```text
container:
formacao-postgres-m12

database:
formacao_java

schemas:
app e auditoria
```

---

## Conceito essencial

### Expressoes booleanas no WHERE

O `WHERE` mantém as linhas cuja condição resulta em verdadeiro.

Exemplo:

```sql
SELECT
    id,
    codigo,
    valor
FROM app.produto
WHERE valor > 3000;
```

Para cada produto, PostgreSQL avalia:

```text
valor > 3000?
```

Se o resultado for `true`, a linha entra no resultado.

Se for `false`, a linha é descartada.

Se for `unknown`, também não entra.

O `unknown` será importante na seção sobre `NULL`.

---

### Operadores de comparacao

Os operadores principais são:

```text
=:
igual.

<>:
diferente.

!=:
diferente, aceito pelo PostgreSQL.

>:
maior.

>=:
maior ou igual.

<:
menor.

<=:
menor ou igual.
```

Exemplo de igualdade:

```sql
WHERE status = 'AGENDADA'
```

Exemplo de diferença:

```sql
WHERE status <> 'CANCELADA'
```

Exemplo numérico:

```sql
WHERE valor_previsto >= 300
```

Exemplo temporal:

```sql
WHERE data_agendada < '2026-07-17'::date
```

Use literais compatíveis com o tipo da coluna.

Quando a intenção é “diferente”, prefira `<>`, porque é a forma padronizada em SQL. O PostgreSQL também aceita `!=`.

---

### Comparacao de textos

Textos são comparados considerando o conteúdo e as regras de collation do banco.

Na igualdade:

```sql
WHERE status = 'AGENDADA'
```

a escrita precisa coincidir.

```text
AGENDADA
```

não é igual a:

```text
agendada
```

Para padrões sem diferenciar maiúsculas e minúsculas, PostgreSQL oferece `ILIKE`.

Não transforme toda comparação em `lower(coluna) = lower(valor)` sem necessidade. Primeiro escolha o operador adequado.

---

### Operadores logicos

Operadores lógicos combinam condições:

```text
AND:
todas as condições precisam ser verdadeiras.

OR:
pelo menos uma condição precisa ser verdadeira.

NOT:
inverte o resultado lógico.
```

Exemplo com `AND`:

```sql
WHERE status = 'AGENDADA'
  AND prioridade = 'ALTA'
```

A linha precisa satisfazer as duas regras.

Exemplo com `OR`:

```sql
WHERE prioridade = 'ALTA'
   OR prioridade = 'CRITICA'
```

A linha pode satisfazer uma ou outra.

Exemplo com `NOT`:

```sql
WHERE NOT urgente
```

Para uma coluna booleana não nula, isso seleciona linhas em que `urgente` é falso.

Também é possível escrever:

```sql
WHERE urgente = false
```

A segunda forma pode ser mais clara durante o aprendizado.

---

### Precedencia

Quando operadores aparecem juntos, existe uma ordem de avaliação.

Em termos práticos:

```text
NOT:
avaliado antes.

AND:
avaliado depois de NOT.

OR:
avaliado depois de AND.
```

Considere:

```sql
WHERE status = 'AGENDADA'
   OR status = 'ABERTA'
  AND urgente = true
```

Sem parênteses, o `AND` é avaliado antes.

A expressão equivale a:

```sql
WHERE status = 'AGENDADA'
   OR (
       status = 'ABERTA'
       AND urgente = true
   )
```

Ela não equivale a:

```sql
WHERE (
       status = 'AGENDADA'
       OR status = 'ABERTA'
   )
  AND urgente = true
```

As duas consultas podem retornar resultados diferentes.

---

### Parenteses comunicam intencao

Mesmo quando você conhece a precedência, use parênteses quando eles melhoram a leitura.

Exemplo:

```sql
WHERE (
        status = 'AGENDADA'
        OR status = 'ABERTA'
      )
  AND urgente = true
```

O leitor entende que:

```text
primeiro:
status precisa estar em um dos dois estados.

depois:
a ordem também precisa ser urgente.
```

Parênteses não são apenas correção sintática. Eles documentam o agrupamento da regra.

---

### NOT e formas negativas

Estas consultas possuem intenção semelhante:

```sql
WHERE NOT ativo
```

```sql
WHERE ativo = false
```

Para uma lista:

```sql
WHERE status NOT IN ('CANCELADA', 'CONCLUIDA')
```

Para padrão:

```sql
WHERE nome NOT LIKE 'Hospital%'
```

Para intervalo:

```sql
WHERE valor NOT BETWEEN 100 AND 500
```

Formas negativas podem ser úteis, mas precisam ser lidas com cuidado. Quando a lógica ficar difícil, reescreva a regra de forma positiva ou use parênteses.

---

### LIKE

`LIKE` compara texto com um padrão.

Os dois coringas principais são:

```text
%:
zero ou mais caracteres.

_:
exatamente um caractere.
```

Exemplo:

```sql
WHERE nome LIKE 'Hospital%'
```

Significa:

```text
começa com Hospital.
```

Exemplo:

```sql
WHERE nome LIKE '%Vida%'
```

Significa:

```text
contém Vida em qualquer posição.
```

Exemplo:

```sql
WHERE codigo LIKE 'OS-277-___'
```

Cada `_` representa um caractere.

O padrão exige:

```text
OS-277-
seguido de exatamente três caracteres.
```

---

### LIKE e maiusculas

`LIKE` diferencia maiúsculas de minúsculas conforme o texto.

Exemplo:

```sql
WHERE nome LIKE '%vida%'
```

pode não encontrar:

```text
Hospital Vida
```

No PostgreSQL, `ILIKE` faz busca de padrão sem diferenciar maiúsculas e minúsculas:

```sql
WHERE nome ILIKE '%vida%'
```

`ILIKE` é uma extensão do PostgreSQL, não parte do SQL padrão.

Use quando a regra de busca realmente for case-insensitive.

---

### Padroes e desempenho

Um padrão que começa com `%`:

```sql
WHERE nome ILIKE '%vida%'
```

pode exigir mais trabalho porque qualquer posição do texto pode corresponder.

Nesta aula, o dataset é pequeno e o foco é semântica.

Mais adiante, índices e planos de execução mostrarão o impacto de filtros. Não tente otimizar antes de entender o comportamento.

---

### Caractere de escape

Se o texto procurado contém `%` ou `_` como caracteres literais, eles precisam deixar de funcionar como coringas.

PostgreSQL permite definir um escape.

Exemplo conceitual:

```sql
WHERE codigo LIKE '%\_%' ESCAPE '\'
```

Isso procura um underscore real.

O laboratório principal não depende desse caso, mas você deve saber que padrões possuem caracteres especiais.

---

### BETWEEN

`BETWEEN` verifica se um valor está dentro de um intervalo inclusivo.

Exemplo:

```sql
WHERE valor BETWEEN 2000 AND 4000
```

É equivalente a:

```sql
WHERE valor >= 2000
  AND valor <= 4000
```

Os dois limites estão incluídos.

Com datas:

```sql
WHERE data_agendada
      BETWEEN '2026-07-15'::date
          AND '2026-07-18'::date
```

As duas datas-limite participam do intervalo.

---

### Ordem dos limites no BETWEEN

Escreva o menor limite primeiro:

```sql
BETWEEN 2000 AND 4000
```

A forma invertida:

```sql
BETWEEN 4000 AND 2000
```

não reorganiza os valores automaticamente e tende a não encontrar resultados.

Leia como:

```text
maior ou igual ao primeiro;
menor ou igual ao segundo.
```

---

### BETWEEN com timestamps

Com datas de calendário, a inclusão dos limites é direta.

Com timestamp, cuidado com o limite final.

Exemplo:

```sql
WHERE criado_em
      BETWEEN '2026-07-10 00:00:00'
          AND '2026-07-10 23:59:59'
```

Esse filtro pode excluir valores com frações de segundo depois de `23:59:59`.

Uma estratégia comum para períodos temporais é intervalo semiaberto:

```sql
WHERE criado_em >= '2026-07-10 00:00:00'
  AND criado_em <  '2026-07-11 00:00:00'
```

Nesta aula, `BETWEEN` será praticado principalmente com números e colunas `date`.

---

### IN

`IN` compara um valor com uma lista.

Exemplo:

```sql
WHERE status IN (
    'ABERTA',
    'AGENDADA',
    'EM_ATENDIMENTO'
)
```

É equivalente a uma sequência de `OR`:

```sql
WHERE status = 'ABERTA'
   OR status = 'AGENDADA'
   OR status = 'EM_ATENDIMENTO'
```

`IN` costuma ser mais legível para comparar a mesma coluna com vários valores.

---

### NOT IN

Forma:

```sql
WHERE status NOT IN (
    'CONCLUIDA',
    'CANCELADA'
)
```

Isso seleciona linhas cujo status não pertence ao conjunto.

Tenha cuidado quando a lista ou a coluna pode envolver `NULL`, porque a lógica pode resultar em `unknown`.

No dataset principal, `status` é `NOT NULL`, então o caso é mais simples.

A regra geral permanece:

```text
NULL precisa de tratamento explícito.
```

---

### IN nao e intervalo

Use `IN` para valores discretos:

```text
ABERTA;
AGENDADA;
EM_ATENDIMENTO.
```

Use `BETWEEN` ou comparações para intervalos:

```text
2000 a 4000;
15 a 18 de julho.
```

Não crie listas enormes de números consecutivos quando um intervalo comunica melhor a regra.

---

### NULL

`NULL` representa ausência ou valor desconhecido.

Ele não é:

```text
zero;
false;
texto vazio;
data mínima;
string "NULL".
```

Uma comparação comum está errada:

```sql
WHERE inicio_real = NULL
```

O resultado não é verdadeiro nem falso. É `unknown`.

Por isso, a consulta não encontra as linhas esperadas.

---

### IS NULL

Para verificar ausência:

```sql
WHERE inicio_real IS NULL
```

Para verificar presença:

```sql
WHERE inicio_real IS NOT NULL
```

Exemplo:

```sql
SELECT
    id,
    codigo,
    status
FROM app.atividade
WHERE inicio_real IS NULL
ORDER BY id;
```

Isso encontra atividades que ainda não possuem início real registrado.

---

### Logica de tres valores

Em SQL, condições podem resultar em:

```text
true;
false;
unknown.
```

Exemplo:

```text
valor = 10:
true ou false quando valor existe.

NULL = 10:
unknown.

NULL <> 10:
unknown.
```

O `WHERE` mantém apenas `true`.

Por isso, estas duas condições não são complementares quando `NULL` é possível:

```sql
coluna = 10
```

```sql
coluna <> 10
```

Linhas nulas não entram em nenhuma delas.

Para incluir ausência, declare:

```sql
WHERE coluna <> 10
   OR coluna IS NULL
```

Parênteses podem ser necessários quando essa regra se combina com outras condições.

---

### IS TRUE e IS FALSE

PostgreSQL permite avaliar booleanos com:

```sql
WHERE urgente IS TRUE
```

```sql
WHERE urgente IS FALSE
```

Também existe:

```sql
WHERE urgente IS NOT TRUE
```

Essa última forma inclui `false` e `NULL`.

No modelo atual, `urgente` é `NOT NULL`, então:

```sql
WHERE urgente = true
```

é suficiente e mais familiar.

O importante é entender que booleanos anuláveis exigem uma decisão explícita sobre `NULL`.

---

### Combinar filtros

Uma consulta real pode usar vários recursos:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada
FROM app.ordem_servico
WHERE status IN ('ABERTA', 'AGENDADA')
  AND prioridade IN ('ALTA', 'CRITICA')
  AND data_agendada
      BETWEEN '2026-07-15'::date
          AND '2026-07-20'::date
ORDER BY
    data_agendada ASC,
    id ASC;
```

Leia por partes:

1. status pertence ao conjunto;
2. prioridade pertence ao conjunto;
3. data está no intervalo;
4. todas as condições precisam ser verdadeiras;
5. resultado é ordenado.

Se a regra não puder ser explicada em português com clareza, o SQL provavelmente precisa ser reorganizado.

---

### Legibilidade dos filtros

Prefira:

```sql
WHERE (
        status = 'ABERTA'
        OR status = 'AGENDADA'
      )
  AND urgente = true
```

Em vez de comprimir:

```sql
WHERE status='ABERTA' OR status='AGENDADA' AND urgente=true
```

Boas práticas:

- uma condição relevante por linha;
- operadores alinhados;
- listas formatadas verticalmente quando longas;
- parênteses para agrupamentos;
- casts explícitos quando ajudam;
- aliases claros;
- sem negações desnecessárias.

SQL legível é mais fácil de revisar e menos sujeito a erro.

---

## Mao na massa guiada

### 1. Confirmar o ambiente

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
  -Path "labs\m12\aula-279-operadores-filtros-like-between-in-is-null\sql"

Set-Location `
  "labs\m12\aula-279-operadores-filtros-like-between-in-is-null"
```

---

### 3. Criar 00_verificar_dataset.sql

Crie:

```text
sql/00_verificar_dataset.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario;

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
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-279-operadores-filtros-like-between-in-is-null\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultados esperados:

```text
3;
3;
4;
6;
4.
```

---

### 4. Criar 01_operadores_comparacao.sql

Crie:

```text
sql/01_operadores_comparacao.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    nome,
    valor
FROM app.produto
WHERE valor > 3000
ORDER BY valor ASC, id ASC;

SELECT
    id,
    codigo,
    valor_previsto
FROM app.ordem_servico
WHERE valor_previsto >= 350
ORDER BY valor_previsto ASC, id ASC;

SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE status <> 'AGENDADA'
ORDER BY id ASC;

SELECT
    id,
    codigo,
    data_agendada
FROM app.ordem_servico
WHERE data_agendada < '2026-07-17'::date
ORDER BY data_agendada ASC, id ASC;

SELECT
    id,
    codigo,
    valor_mao_obra
FROM app.atividade
WHERE valor_mao_obra <= 150
ORDER BY valor_mao_obra DESC, id ASC;
```

Execute e traduza cada condição para português.

---

### 5. Criar 02_and_or_not_precedencia.sql

Crie:

```text
sql/02_and_or_not_precedencia.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade
FROM app.ordem_servico
WHERE status = 'AGENDADA'
  AND prioridade = 'ALTA'
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    prioridade
FROM app.ordem_servico
WHERE prioridade = 'ALTA'
   OR prioridade = 'CRITICA'
ORDER BY prioridade, id;

SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE NOT urgente
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE (
        status = 'ABERTA'
        OR status = 'AGENDADA'
      )
  AND urgente = true
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE status = 'ABERTA'
   OR (
       status = 'AGENDADA'
       AND urgente = true
   )
ORDER BY id;
```

Compare as duas últimas consultas.

A diferença é parte central da aula.

---

### 6. Criar 03_like_ilike.sql

Crie:

```text
sql/03_like_ilike.sql
```

Conteúdo:

```sql
SELECT
    id,
    nome
FROM app.cliente
WHERE nome LIKE 'Hospital%'
ORDER BY id;

SELECT
    id,
    nome
FROM app.cliente
WHERE nome ILIKE '%futuro%'
ORDER BY id;

SELECT
    id,
    codigo,
    nome
FROM app.produto
WHERE nome ILIKE '%refriger%'
ORDER BY id;

SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE codigo LIKE 'OS-277-___'
ORDER BY codigo;

SELECT
    id,
    codigo,
    descricao
FROM app.atividade
WHERE descricao ILIKE '%técnic%'
ORDER BY id;
```

Observe:

```text
LIKE:
sensível à caixa no padrão textual.

ILIKE:
ignora diferença de caixa no PostgreSQL.

%:
qualquer quantidade de caracteres.

_:
um caractere.
```

---

### 7. Criar 04_between.sql

Crie:

```text
sql/04_between.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    valor
FROM app.produto
WHERE valor BETWEEN 2000 AND 4000
ORDER BY valor ASC, id ASC;

SELECT
    id,
    codigo,
    valor_previsto
FROM app.ordem_servico
WHERE valor_previsto BETWEEN 300 AND 500
ORDER BY valor_previsto ASC, id ASC;

SELECT
    id,
    codigo,
    data_agendada
FROM app.ordem_servico
WHERE data_agendada
      BETWEEN '2026-07-15'::date
          AND '2026-07-18'::date
ORDER BY data_agendada ASC, id ASC;

SELECT
    id,
    codigo,
    valor_mao_obra
FROM app.atividade
WHERE valor_mao_obra NOT BETWEEN 100 AND 300
ORDER BY valor_mao_obra ASC, id ASC;
```

Confirme que os limites são inclusivos.

---

### 8. Criar 05_in.sql

Crie:

```text
sql/05_in.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE status IN (
    'ABERTA',
    'AGENDADA'
)
ORDER BY status, id;

SELECT
    id,
    codigo,
    prioridade
FROM app.ordem_servico
WHERE prioridade IN (
    'ALTA',
    'CRITICA'
)
ORDER BY prioridade, id;

SELECT
    id,
    codigo,
    status
FROM app.atividade
WHERE status NOT IN (
    'CONCLUIDA',
    'CANCELADA'
)
ORDER BY status, id;

SELECT
    id,
    codigo,
    nome
FROM app.produto
WHERE id IN (
    930001,
    930003
)
ORDER BY id;
```

Compare mentalmente cada `IN` com a versão usando vários `OR`.

---

### 9. Criar 06_is_null.sql

Crie:

```text
sql/06_is_null.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    inicio_real,
    fim_real
FROM app.atividade
WHERE inicio_real IS NULL
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    inicio_real,
    fim_real
FROM app.atividade
WHERE inicio_real IS NOT NULL
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    fim_real
FROM app.atividade
WHERE fim_real IS NULL
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    inicio_real,
    fim_real
FROM app.atividade
WHERE inicio_real IS NOT NULL
  AND fim_real IS NOT NULL
ORDER BY id;
```

Não use:

```sql
inicio_real = NULL
```

---

### 10. Criar 07_filtros_combinados.sql

Crie:

```text
sql/07_filtros_combinados.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada,
    valor_previsto
FROM app.ordem_servico
WHERE status IN (
        'ABERTA',
        'AGENDADA'
      )
  AND prioridade IN (
        'ALTA',
        'CRITICA'
      )
  AND data_agendada
      BETWEEN '2026-07-15'::date
          AND '2026-07-20'::date
ORDER BY
    data_agendada ASC,
    id ASC;

SELECT
    id,
    codigo,
    descricao,
    status,
    valor_mao_obra
FROM app.atividade
WHERE descricao ILIKE '%atividade%'
   OR descricao ILIKE '%técnic%'
ORDER BY
    valor_mao_obra DESC,
    id ASC;

SELECT
    id,
    codigo,
    status,
    inicio_real,
    fim_real
FROM app.atividade
WHERE status NOT IN (
        'CONCLUIDA',
        'CANCELADA'
      )
  AND fim_real IS NULL
ORDER BY
    status ASC,
    id ASC;

SELECT
    id,
    codigo,
    nome,
    valor
FROM app.produto
WHERE ativo = true
  AND valor BETWEEN 2000 AND 5000
  AND (
        nome ILIKE '%ar%'
        OR nome ILIKE '%lava%'
      )
ORDER BY
    valor DESC,
    id ASC;
```

Antes de executar, explique cada consulta em português.

---

### 11. Criar 08_armadilhas_controladas.sql

Crie:

```text
sql/08_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Errado para procurar NULL: retorna zero linhas.
SELECT
    id,
    codigo,
    inicio_real
FROM app.atividade
WHERE inicio_real = NULL;

-- Correto.
SELECT
    id,
    codigo,
    inicio_real
FROM app.atividade
WHERE inicio_real IS NULL
ORDER BY id;

-- Ambíguo para leitura humana por depender de precedência.
SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE status = 'ABERTA'
   OR status = 'AGENDADA'
  AND urgente = true
ORDER BY id;

-- Intenção explícita com parênteses.
SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE (
        status = 'ABERTA'
        OR status = 'AGENDADA'
      )
  AND urgente = true
ORDER BY id;

-- LIKE sensível à caixa.
SELECT
    id,
    nome
FROM app.cliente
WHERE nome LIKE '%futuro%';

-- ILIKE encontra sem diferenciar a caixa.
SELECT
    id,
    nome
FROM app.cliente
WHERE nome ILIKE '%futuro%';
```

Execute e compare os pares.

---

### 12. Criar 09_exercicio.sql

Crie:

```text
sql/09_exercicio.sql
```

Implemente as missões da seção de exercício guiado.

Não copie consultas prontas antes de tentar.

---

### 13. Criar 10_validacao_final.sql

Crie:

```text
sql/10_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade
FROM app.ordem_servico
WHERE status IN (
    'ABERTA',
    'AGENDADA',
    'EM_ATENDIMENTO'
)
ORDER BY status, id;

SELECT
    id,
    codigo,
    status,
    inicio_real,
    fim_real
FROM app.atividade
WHERE fim_real IS NULL
  AND status NOT IN (
      'CONCLUIDA',
      'CANCELADA'
  )
ORDER BY status, id;

SELECT
    id,
    codigo,
    nome,
    valor
FROM app.produto
WHERE nome ILIKE '%a%'
  AND valor BETWEEN 2000 AND 5000
ORDER BY valor DESC, id;

SELECT
    (SELECT count(*) FROM app.cliente WHERE id BETWEEN 930001 AND 930099)
        AS clientes,
    (SELECT count(*) FROM app.produto WHERE id BETWEEN 930001 AND 930099)
        AS produtos,
    (
        SELECT count(*)
        FROM app.ordem_servico
        WHERE id BETWEEN 930001 AND 930099
    ) AS ordens,
    (
        SELECT count(*)
        FROM app.atividade
        WHERE id BETWEEN 930001 AND 930099
    ) AS atividades,
    (
        SELECT count(*)
        FROM auditoria.evento_ordem_servico
        WHERE id BETWEEN 930001 AND 930099
    ) AS eventos;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-279-operadores-filtros-like-between-in-is-null\sql\10_validacao_final.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

As contagens finais precisam continuar:

```text
3;
3;
4;
6;
4.
```

---

### 14. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 279 - Operadores filtros like between in is null.

Pré-requisito:
dataset da aula 277 e consultas da aula 278.

Objetivo:
filtrar uma tabela com comparações, lógica, padrões, intervalos, listas e ausência.

Regra:
laboratório somente leitura.

Dataset:
3 clientes, 3 produtos, 4 ordens, 6 atividades e 4 eventos.

Próxima aula:
joins inner, left, right, full e cross com critério.
```

Liste os scripts e explique que nenhuma consulta altera dados.

---

## Entendendo o que foi feito

### Comparacao virou regra de selecao

Você deixou de trabalhar apenas com igualdade.

Agora consegue expressar:

```text
maior;
menor;
diferente;
intervalo;
conjunto;
padrão;
ausência.
```

Isso aproxima o SQL das perguntas reais do backend.

---

### AND OR e parenteses definiram a logica

Uma mesma lista de condições pode produzir resultados diferentes conforme o agrupamento.

Você praticou a precedência e tornou a intenção explícita com parênteses.

Essa disciplina será ainda mais importante quando joins adicionarem condições no `ON` e no `WHERE`.

---

### LIKE e ILIKE resolveram padroes

`LIKE` usa padrões sensíveis à caixa.

`ILIKE` oferece busca case-insensitive específica do PostgreSQL.

Você praticou:

```text
prefixo;
conteúdo;
quantidade exata de caracteres.
```

---

### BETWEEN e IN reduziram repeticao

`BETWEEN` expressou intervalos inclusivos.

`IN` expressou listas discretas.

Cada um substituiu combinações mais longas de comparações e operadores lógicos.

---

### NULL exigiu operador proprio

Você observou que:

```sql
coluna = NULL
```

não encontra ausência.

A forma correta é:

```sql
coluna IS NULL
```

A lógica de três valores é parte essencial de SQL.

---

## Erros comuns importantes

### Filtro com = NULL

Sintoma:

```text
nenhuma linha, mesmo existindo valores nulos.
```

Correção:

```sql
IS NULL
```

ou:

```sql
IS NOT NULL
```

---

### AND e OR retornam linhas inesperadas

A expressão depende da precedência.

Adicione parênteses e traduza a regra para português.

---

### LIKE nao encontra texto

Verifique maiúsculas e minúsculas.

Use `ILIKE` quando a busca precisar ignorar caixa.

---

### BETWEEN nao retorna o intervalo esperado

Confirme:

- menor limite primeiro;
- tipos compatíveis;
- limites inclusivos;
- horário quando a coluna é timestamp.

---

### NOT IN retorna menos linhas

Se a coluna ou lista envolve `NULL`, a expressão pode resultar em `unknown`.

Trate ausência explicitamente com `IS NULL` ou `IS NOT NULL`.

---

## Comandos uteis

### Comparacao

```sql
WHERE valor >= 300
```

### Logica

```sql
WHERE status = 'AGENDADA'
  AND urgente = true
```

### Padrao

```sql
WHERE nome ILIKE '%vida%'
```

### Intervalo

```sql
WHERE valor BETWEEN 2000 AND 4000
```

### Lista

```sql
WHERE status IN ('ABERTA', 'AGENDADA')
```

### Ausencia

```sql
WHERE fim_real IS NULL
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

No arquivo:

```text
sql/09_exercicio.sql
```

resolva as missões.

### Parte 1 - Produtos em faixa

Retorne:

```text
id;
codigo;
nome;
valor.
```

Regras:

```text
valor entre 2500 e 5000;
nome contém a letra r sem diferenciar caixa;
ordenar por valor decrescente e id.
```

---

### Parte 2 - Ordens operacionais

Retorne:

```text
id;
codigo;
status;
prioridade;
data_agendada;
urgente.
```

Regras:

```text
status ABERTA, AGENDADA ou EM_ATENDIMENTO;
prioridade ALTA ou CRITICA;
data entre 14 e 20 de julho de 2026;
ordenar por data e id.
```

Use `IN` e `BETWEEN`.

---

### Parte 3 - Atividades pendentes de inicio

Retorne:

```text
id;
ordem_servico_id;
codigo;
descricao;
status;
inicio_real.
```

Regras:

```text
início real nulo;
status não pode ser CONCLUIDA nem CANCELADA;
descrição contém a letra a;
ordenar por ordem_servico_id e id.
```

---

### Parte 4 - Comparar precedencia

Crie duas consultas.

Consulta A:

```text
status ABERTA
ou status AGENDADA e urgente true.
```

Sem parênteses.

Consulta B:

```text
status ABERTA ou AGENDADA
e urgente true.
```

Com parênteses.

Explique por que os resultados podem ser diferentes.

---

### Parte 5 - Padroes

Crie consultas que encontrem:

```text
clientes cujo nome começa com H;
produtos cujo nome contém "ar";
ordens com código no formato OS-277- seguido por três caracteres;
atividades cuja descrição contém "técnic" sem diferenciar caixa.
```

---

### Parte 6 - Nulos

Liste:

```text
atividades sem início;
atividades com início;
atividades sem fim;
atividades com início e fim.
```

Não use `= NULL` nem `<> NULL`.

---

### Parte 7 - Explicar um filtro

No README, escolha a consulta mais complexa e explique:

1. quais condições usam `IN`;
2. qual usa `BETWEEN`;
3. qual usa `ILIKE`;
4. como `AND` combina as partes;
5. onde os parênteses são necessários;
6. como os nulos são tratados;
7. como o resultado é ordenado.

---

## Criterios de aceite

- o laboratório oficial da aula 279 existe;
- o dataset foi preservado;
- nenhum script altera dados;
- operadores `=`, `<>`, `>`, `>=`, `<` e `<=` foram praticados;
- `AND`, `OR` e `NOT` foram praticados;
- a precedência foi compreendida;
- parênteses foram usados para comunicar intenção;
- `LIKE` e `ILIKE` foram diferenciados;
- `%` e `_` foram praticados;
- `BETWEEN` foi usado com números e datas;
- ficou claro que `BETWEEN` inclui os limites;
- `IN` e `NOT IN` foram usados;
- `IS NULL` e `IS NOT NULL` foram usados;
- `= NULL` foi reconhecido como incorreto;
- a lógica de três valores foi compreendida;
- filtros combinados foram construídos;
- operadores da aula anterior continuaram sendo usados;
- joins não foram antecipados;
- o exercício foi concluído;
- as contagens finais continuam 3, 3, 4, 6 e 4;
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
  labs/m12/aula-279-operadores-filtros-like-between-in-is-null
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): aplicar operadores e filtros SQL"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
comparações;
lógica;
padrões;
intervalos;
listas;
tratamento de null.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você ampliou o `WHERE`.

Aprendeu:

```text
=;
<>;
!=;
>;
>=;
<;
<=;
AND;
OR;
NOT;
LIKE;
ILIKE;
%;
_;
BETWEEN;
IN;
IS NULL;
IS NOT NULL;
precedência;
parênteses;
lógica de três valores.
```

As regras principais foram:

```text
use comparação compatível com o tipo;

use parênteses para deixar agrupamentos claros;

use LIKE ou ILIKE para padrões;

lembre que BETWEEN inclui os limites;

use IN para listas discretas;

nunca procure NULL com igualdade;

trate ausência explicitamente;

mantenha filtros legíveis.
```

A próxima aula será:

```text
280 - M12.10 - Joins inner left right full e cross com criterio
```

Nela, você vai combinar dados relacionados:

- `INNER JOIN`;
- `LEFT JOIN`;
- `RIGHT JOIN`;
- `FULL JOIN`;
- `CROSS JOIN`;
- cláusula `ON`;
- aliases;
- correspondências;
- registros sem relacionamento;
- filtros no `ON`;
- filtros no `WHERE`;
- multiplicação de linhas;
- cuidado com produtos cartesianos;
- escolha do tipo de join.

O domínio continuará sendo Ordem de Serviço, agora reunindo dados de cliente, produto, ordem, atividade e auditoria.

---

# Material complementar

## Checkpoint final

- [ ] Pratiquei comparação, lógica, padrões, intervalos e listas.
- [ ] Tratei valores nulos com `IS NULL` e `IS NOT NULL`.
- [ ] Usei parênteses para tornar filtros claros.
- [ ] Mantive o dataset e fiz o commit recomendado.

---

## Troubleshooting adicional

### Underscore funciona como coringa

No `LIKE`, `_` representa exatamente um caractere.

Use escape quando quiser procurar underscore literal.

### Texto possui acento

`ILIKE` ignora diferença entre maiúsculas e minúsculas, mas não transforma automaticamente caracteres diferentes em equivalentes.

A busca por `tecnic` pode não encontrar `técnic`.

### Filtro negativo exclui NULL

Expressões como:

```sql
coluna <> 'VALOR'
```

não incluem linhas nulas.

Acrescente:

```sql
OR coluna IS NULL
```

quando essa for a regra.

### Parenteses demais

Parênteses podem melhorar clareza, mas não devem transformar uma condição simples em um labirinto.

Agrupe regras de negócio, não cada comparação isolada.

### Padrao com percentual no inicio

Funciona, mas pode ter custo maior em tabelas grandes. Performance será analisada com índices e planos em aulas posteriores.

---

## Perguntas de revisao

1. O que o `WHERE` mantém?
2. Quais são os operadores de comparação?
3. Qual a diferença entre `AND` e `OR`?
4. Qual operador possui precedência maior?
5. Por que usar parênteses?
6. O que `NOT` faz?
7. Para que serve `LIKE`?
8. Qual a diferença entre `%` e `_`?
9. Qual a diferença entre `LIKE` e `ILIKE`?
10. `BETWEEN` inclui os limites?
11. Quando usar `IN`?
12. Quando usar `BETWEEN`?
13. Por que `= NULL` não funciona?
14. O que `IS NULL` testa?
15. O que significa `unknown`?
16. Por que `NOT IN` exige cuidado com `NULL`?
17. Como deixar um filtro complexo legível?
18. Como esta aula prepara joins?

---

## Roteiro de resposta

1. Linhas cuja condição resulta em verdadeiro.
2. Igualdade, diferença, maior, menor e suas formas inclusivas.
3. `AND` exige todas; `OR` exige pelo menos uma.
4. `NOT`, depois `AND`, depois `OR`.
5. Para controlar e documentar o agrupamento.
6. Inverte o resultado lógico.
7. Compara texto com um padrão.
8. `%` representa vários caracteres; `_`, um caractere.
9. `ILIKE` ignora diferença de caixa no PostgreSQL.
10. Sim.
11. Para valores discretos.
12. Para intervalos.
13. A comparação resulta em `unknown`.
14. Ausência de valor.
15. Resultado lógico que não é verdadeiro nem falso.
16. Nulos podem tornar o resultado desconhecido.
17. Formatação, parênteses e condições por linha.
18. Condições serão usadas no `ON` e no `WHERE`.

---

## Desafio opcional

Construa uma consulta sobre `app.atividade` com as regras:

```text
status PENDENTE, AGENDADA ou EM_EXECUCAO;
valor da mão de obra entre 0 e 200;
descrição contém "a" sem diferenciar caixa;
fim_real nulo;
código diferente de CONTATO;
ordenar por valor decrescente e id;
limitar em quatro linhas.
```

Depois explique por que cada operador foi escolhido.

Não use join.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 279 - M12.09 - Operadores filtros like between in is null

- Ampliei os filtros de consultas SQL.
- Pratiquei operadores de igualdade, diferença, maior e menor.
- Combinei condições com `AND`, `OR` e `NOT`.
- Entendi a precedência e usei parênteses para deixar a intenção clara.
- Usei `LIKE` e `ILIKE` com os coringas `%` e `_`.
- Filtrei números e datas com `BETWEEN`.
- Usei `IN` e `NOT IN` para conjuntos discretos.
- Tratei ausência com `IS NULL` e `IS NOT NULL`.
- Entendi por que `= NULL` resulta em `unknown`.
- Construí filtros legíveis combinando vários recursos.
- Mantive o dataset sem alterações.
- Próxima aula: joins `INNER`, `LEFT`, `RIGHT`, `FULL` e `CROSS`.
```

---

## Referencia tecnica curta

```text
AND:
todas as condições.

OR:
uma ou mais condições.

NOT:
inverte a condição.

LIKE:
padrão sensível à caixa.

ILIKE:
padrão sem diferenciar caixa.

%:
zero ou mais caracteres.

_:
um caractere.

BETWEEN:
intervalo inclusivo.

IN:
lista de valores.

IS NULL:
ausência.

IS NOT NULL:
presença.
```

Regra final:

```text
um bom filtro traduz a regra de negócio sem esconder a lógica.
```
