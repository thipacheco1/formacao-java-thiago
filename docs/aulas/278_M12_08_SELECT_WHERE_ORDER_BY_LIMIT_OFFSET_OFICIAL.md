# 278 - M12.08 - Select where order by limit offset

## Apresentacao da aula

Na aula 277, você começou a manipular dados reais com `INSERT`, `UPDATE`, `DELETE` e `RETURNING`. O PostgreSQL passou a armazenar um pequeno conjunto consistente de clientes, produtos, ordens de serviço, atividades e eventos de auditoria.

O banco agora possui:

```text
3 clientes;
3 produtos;
4 ordens de serviço;
6 atividades;
4 eventos.
```

Esse conjunto foi preservado propositalmente para esta aula.

Agora você vai estudar a operação mais usada em SQL:

```sql
SELECT
```

`SELECT` lê dados.

Parece simples, mas uma consulta profissional precisa responder com clareza:

```text
quais colunas eu quero?
de qual tabela?
quais linhas?
em qual ordem?
quantas linhas?
a partir de qual posição?
```

Essas perguntas serão traduzidas pelos recursos:

```text
SELECT;
FROM;
WHERE;
ORDER BY;
LIMIT;
OFFSET.
```

O objetivo desta aula não é apresentar todos os operadores possíveis. A aula 279 será dedicada a filtros com `LIKE`, `BETWEEN`, `IN`, `IS NULL` e outras combinações.

Nesta etapa, o `WHERE` será usado com condições básicas e diretas, principalmente igualdade e valores booleanos. O foco será construir uma consulta previsível do início ao fim.

Você também aprenderá uma regra que evita muitos erros:

```text
uma tabela não possui ordem natural garantida.
```

Mesmo que o resultado pareça vir sempre na mesma sequência, o PostgreSQL pode devolver linhas em outra ordem quando não existe `ORDER BY`.

A consulta correta precisa declarar a ordem quando a ordem importa.

Ao final da aula, você deverá conseguir:

- selecionar todas ou apenas algumas colunas;
- usar aliases para melhorar a apresentação;
- entender a diferença entre coluna, literal e expressão;
- filtrar linhas com `WHERE`;
- ordenar resultados em ordem crescente ou decrescente;
- ordenar por mais de uma coluna;
- controlar a posição de valores nulos na ordenação;
- limitar a quantidade retornada;
- ignorar um número inicial de linhas com `OFFSET`;
- combinar filtro, ordenação, limite e deslocamento;
- construir uma paginação inicial previsível;
- evitar `SELECT *` em consultas que funcionam como contrato;
- preparar os dados para operadores mais ricos na aula 279.

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
DDL.

275:
primary key, foreign key e integridade referencial.

276:
NOT NULL, UNIQUE, CHECK e DEFAULT.

277:
INSERT, UPDATE, DELETE e RETURNING.

278:
SELECT, WHERE, ORDER BY, LIMIT e OFFSET.

279:
operadores, LIKE, BETWEEN, IN e IS NULL.

280:
joins.
```

Até aqui, você criou estrutura, protegeu dados e realizou operações de escrita.

Agora começa o bloco de consultas.

A leitura será construída em etapas:

```text
278:
consulta de uma tabela com filtro básico e ordenação.

279:
operadores e filtros mais expressivos.

280:
combinação de várias tabelas com joins.

286:
agrupamentos e agregações.

287:
subqueries.

288:
CTEs.

291:
índices.

292:
EXPLAIN e ANALYZE.
```

A formação não vai pular diretamente para consultas complexas.

Uma consulta grande é composta por decisões menores:

```text
projeção;
origem;
filtro;
ordenação;
quantidade;
combinação;
agrupamento;
transformação.
```

Nesta aula, você dominará a base.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-278-select-where-order-by-limit-offset
```

Estrutura final:

```text
labs
└── m12
    └── aula-278-select-where-order-by-limit-offset
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_select_colunas_aliases.sql
            ├── 02_where_basico.sql
            ├── 03_order_by.sql
            ├── 04_limit.sql
            ├── 05_offset.sql
            ├── 06_consultas_combinadas.sql
            ├── 07_armadilhas_controladas.sql
            ├── 08_exercicio.sql
            └── 09_validacao_final.sql
```

O laboratório é somente leitura.

Nenhum script deve executar:

```text
INSERT;
UPDATE;
DELETE;
ALTER TABLE;
DROP TABLE.
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

O dataset esperado veio da aula 277.

Se ele não existir, execute os scripts de criação do dataset da aula anterior antes de seguir.

O fluxo será:

1. confirmar database e quantidade esperada de registros;
2. consultar colunas;
3. usar aliases e expressões simples;
4. filtrar linhas;
5. ordenar resultados;
6. aplicar `LIMIT`;
7. aplicar `OFFSET`;
8. combinar as cláusulas;
9. analisar armadilhas;
10. resolver um exercício de consulta;
11. validar o resultado final;
12. fazer o commit.

---

## Conceito essencial

### O que e SELECT

`SELECT` solicita um resultado ao banco.

Forma mínima:

```sql
SELECT 1;
```

Essa consulta não lê uma tabela. Ela apenas retorna o valor literal `1`.

Para ler uma tabela:

```sql
SELECT
    id,
    nome
FROM app.cliente;
```

A consulta possui duas ideias:

```text
SELECT:
quais valores serão exibidos.

FROM:
de onde vêm as linhas.
```

O resultado de uma consulta é uma tabela lógica, mesmo quando não existe uma tabela física com aquele formato.

A consulta pode:

- selecionar colunas;
- calcular expressões;
- renomear saídas;
- filtrar linhas;
- ordenar;
- limitar;
- combinar fontes;
- agrupar;
- transformar.

Nesta aula, trabalharemos com uma tabela por consulta.

---

### Projecao

Em banco relacional, escolher quais colunas aparecem no resultado é chamado de projeção.

Exemplo:

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico;
```

A tabela possui outras colunas, mas a consulta retorna apenas três.

A projeção ajuda a:

- reduzir dados transferidos;
- tornar a intenção clara;
- evitar expor colunas desnecessárias;
- estabilizar o formato do resultado;
- melhorar a leitura;
- diminuir acoplamento com mudanças estruturais.

Quando uma API ou relatório depende de uma consulta, a lista de colunas funciona como parte do contrato.

---

### SELECT *

Forma:

```sql
SELECT *
FROM app.cliente;
```

O asterisco significa:

```text
todas as colunas disponíveis.
```

Ele é útil em exploração rápida e diagnóstico.

Mas possui riscos em consultas que serão mantidas:

- uma nova coluna altera o resultado;
- dados sensíveis podem aparecer;
- a ordem das colunas depende da estrutura;
- mais dados são transferidos;
- a intenção fica menos clara;
- consumidores podem passar a depender de campos que não deveriam receber.

Regra prática:

```text
exploração local:
SELECT * pode ajudar.

consulta versionada ou contrato:
prefira colunas explícitas.
```

Nesta aula, você usará `SELECT *` apenas para comparar comportamentos. Os scripts principais terão colunas nomeadas.

---

### Coluna qualificada

Forma:

```sql
SELECT
    cliente.id,
    cliente.nome
FROM app.cliente;
```

Como existe apenas uma tabela, o prefixo é opcional.

Você também pode usar um alias:

```sql
SELECT
    c.id,
    c.nome
FROM app.cliente AS c;
```

O alias reduz repetição.

Nesta aula, aliases de tabela serão usados com moderação. Eles se tornarão ainda mais importantes quando joins começarem na aula 280.

---

### Alias de coluna

Você pode renomear a saída:

```sql
SELECT
    id AS cliente_id,
    nome AS cliente_nome
FROM app.cliente;
```

O alias não altera a coluna física.

Ele altera apenas o nome apresentado no resultado.

`AS` é opcional em muitos casos:

```sql
SELECT nome cliente_nome
FROM app.cliente;
```

Prefira `AS` porque torna a intenção explícita.

Use aliases:

- para nomes mais claros;
- para expressões calculadas;
- para eliminar ambiguidade;
- para apresentar um resultado adequado ao consumidor.

Evite aliases enigmáticos.

---

### Literal e expressao

Uma consulta pode combinar colunas e valores fixos:

```sql
SELECT
    id,
    codigo,
    'ORDEM_DE_SERVICO' AS tipo_registro
FROM app.ordem_servico;
```

Também pode calcular:

```sql
SELECT
    id,
    codigo,
    valor_previsto,
    valor_previsto * 2 AS valor_referencia
FROM app.ordem_servico;
```

A expressão não altera os dados armazenados.

Ela calcula um valor para o resultado.

Esse recurso será usado com critério. Funções e expressões mais amplas terão aulas próprias.

---

### FROM

`FROM` define a origem das linhas.

Exemplo:

```sql
FROM app.produto
```

Sempre qualifique o schema em scripts do curso:

```text
app.cliente;
app.produto;
app.ordem_servico;
app.atividade;
auditoria.evento_ordem_servico.
```

Isso evita depender apenas do `search_path`.

Nesta aula, cada consulta terá uma única origem.

Várias tabelas serão combinadas somente na aula 280.

---

### WHERE

`WHERE` decide quais linhas participam do resultado.

Exemplo:

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
WHERE status = 'ABERTA';
```

A consulta lê `app.ordem_servico`, avalia a condição para cada linha e retorna apenas as linhas em que a expressão resulta em verdadeiro.

Outro exemplo:

```sql
SELECT
    id,
    nome,
    ativo
FROM app.cliente
WHERE ativo = true;
```

Para booleanos, PostgreSQL também aceita:

```sql
WHERE ativo;
```

Nesta aula, usaremos a forma explícita em exemplos iniciais:

```sql
WHERE ativo = true
```

Isso facilita a leitura para quem ainda está consolidando SQL.

---

### Igualdade e tipo

O valor comparado precisa ser compatível com a coluna.

Exemplo textual:

```sql
WHERE status = 'AGENDADA'
```

Exemplo numérico:

```sql
WHERE id = 930001
```

Exemplo booleano:

```sql
WHERE urgente = true
```

PostgreSQL diferencia letras maiúsculas e minúsculas em textos.

Assim:

```text
'AGENDADA'
```

não é igual a:

```text
'agendada'
```

Filtros flexíveis por padrão de texto serão estudados na aula 279.

---

### WHERE nao altera dados

Compare:

```sql
SELECT
    id,
    nome
FROM app.cliente
WHERE id = 930001;
```

Com:

```sql
UPDATE app.cliente
SET ativo = false
WHERE id = 930001;
```

O `WHERE` exerce o mesmo papel lógico de seleção das linhas, mas o comando ao redor define a ação.

Nesta aula, todas as consultas são de leitura.

---

### Ordem logica da consulta

Uma forma útil de pensar é:

```text
FROM:
localiza a origem.

WHERE:
filtra linhas.

SELECT:
define a saída.

ORDER BY:
ordena o resultado.

LIMIT:
limita a quantidade.

OFFSET:
ignora linhas iniciais.
```

A ordem escrita será normalmente:

```sql
SELECT
FROM
WHERE
ORDER BY
LIMIT
OFFSET
```

A ordem lógica ajuda a compreender por que certas referências funcionam em uma cláusula e não em outra.

Não vamos aprofundar o plano interno de execução agora. `EXPLAIN` e `ANALYZE` terão aula própria.

---

### ORDER BY

Sem `ORDER BY`, a ordem das linhas não é garantida.

Forma crescente:

```sql
SELECT
    id,
    codigo
FROM app.ordem_servico
ORDER BY id ASC;
```

`ASC` significa ascending, ou crescente.

É o padrão, então estas formas são equivalentes:

```sql
ORDER BY id
```

```sql
ORDER BY id ASC
```

Forma decrescente:

```sql
ORDER BY id DESC
```

`DESC` significa descending.

---

### Ordenar por texto, numero e data

Texto:

```sql
ORDER BY nome ASC
```

Número:

```sql
ORDER BY valor DESC
```

Data:

```sql
ORDER BY data_agendada ASC
```

A ordenação segue as regras do tipo e da configuração do banco.

Detalhes de collation e ordenação linguística serão tratados quando forem relevantes.

---

### Ordenacao por mais de uma coluna

Forma:

```sql
ORDER BY
    status ASC,
    codigo ASC
```

Leitura:

```text
primeiro ordene por status;
quando o status empatar, ordene por código.
```

Outro exemplo:

```sql
ORDER BY
    prioridade DESC,
    data_agendada ASC,
    id ASC
```

A última coluna pode funcionar como critério de desempate.

Uma ordenação previsível precisa resolver empates.

Se você ordenar apenas por `status`, várias linhas podem possuir o mesmo valor. A ordem interna entre elas não é garantida.

Adicionar uma chave estável, como `id`, cria determinismo.

---

### Ordenar por alias

Você pode usar um alias da saída:

```sql
SELECT
    codigo,
    valor_previsto AS valor
FROM app.ordem_servico
ORDER BY valor DESC;
```

O PostgreSQL reconhece o alias em `ORDER BY`.

Evite aliases que tenham o mesmo nome de outra coluna e causem confusão.

---

### Ordenar por posicao

SQL permite:

```sql
SELECT
    codigo,
    status
FROM app.ordem_servico
ORDER BY 2, 1;
```

Isso significa ordenar pela segunda coluna e depois pela primeira.

A forma é curta, mas frágil.

Se a ordem da projeção mudar, a ordenação muda.

Em scripts profissionais, prefira nomes:

```sql
ORDER BY status, codigo
```

---

### NULLS FIRST e NULLS LAST

Algumas ordens possuem `data_agendada = NULL`.

Você pode controlar onde os valores nulos aparecem:

```sql
ORDER BY data_agendada ASC NULLS LAST
```

Ou:

```sql
ORDER BY data_agendada DESC NULLS FIRST
```

Isso é importante quando registros ainda não agendados precisam ficar no fim ou no início.

Não confunda ordenar valores nulos com filtrar valores nulos.

O filtro `IS NULL` será ensinado na aula 279.

---

### LIMIT

`LIMIT` restringe a quantidade máxima de linhas retornadas.

Exemplo:

```sql
SELECT
    id,
    codigo,
    valor_previsto
FROM app.ordem_servico
ORDER BY valor_previsto DESC, id ASC
LIMIT 2;
```

A consulta devolve no máximo duas linhas.

`LIMIT` sem `ORDER BY` não garante quais duas linhas serão retornadas.

Regra:

```text
se você quer as primeiras, maiores, menores, mais antigas ou mais recentes:
declare ORDER BY.
```

`LIMIT 0` retorna nenhuma linha, mas ainda representa uma consulta válida.

---

### OFFSET

`OFFSET` ignora uma quantidade inicial de linhas do resultado ordenado.

Exemplo:

```sql
SELECT
    id,
    codigo
FROM app.ordem_servico
ORDER BY id ASC
LIMIT 2
OFFSET 2;
```

Leitura:

```text
ordene por id;
ignore as duas primeiras linhas;
retorne no máximo duas.
```

Com quatro ordens:

```text
página 1:
LIMIT 2 OFFSET 0.

página 2:
LIMIT 2 OFFSET 2.
```

Isso é uma forma inicial de paginação.

A paginação completa, seus problemas e estratégias terá aula própria mais adiante.

---

### OFFSET precisa de ordem deterministica

Considere:

```sql
SELECT
    id,
    status
FROM app.ordem_servico
LIMIT 2
OFFSET 2;
```

Sem `ORDER BY`, a divisão em páginas não é estável.

Mesmo com:

```sql
ORDER BY status
```

pode haver empates.

Melhor:

```sql
ORDER BY status ASC, id ASC
LIMIT 2
OFFSET 2;
```

O `id` resolve a ordem entre linhas com o mesmo status.

---

### Custo conceitual do OFFSET

Para ignorar muitas linhas, o banco ainda precisa localizar e descartar resultados anteriores.

Em grandes volumes, offsets profundos podem ficar caros.

Não vamos otimizar paginação agora.

Nesta aula, registre:

```text
LIMIT e OFFSET são simples e úteis;
ordem determinística é obrigatória;
offset alto merece análise.
```

A aula 296 aprofundará paginação.

---

### Combinar as clausulas

Exemplo completo:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada
FROM app.ordem_servico
WHERE status = 'AGENDADA'
ORDER BY
    data_agendada ASC NULLS LAST,
    id ASC
LIMIT 2
OFFSET 0;
```

Leitura:

1. leia `app.ordem_servico`;
2. mantenha ordens agendadas;
3. selecione cinco colunas;
4. ordene pela data e pelo ID;
5. retorne no máximo duas linhas;
6. não ignore nenhuma linha inicial.

A consulta está completa e previsível.

---

### Consulta como contrato de leitura

Uma consulta não serve apenas para “ver dados”. Em sistemas reais, ela costuma alimentar:

- uma tela;
- um relatório;
- uma exportação;
- uma API;
- uma rotina de integração;
- uma análise operacional.

Por isso, o formato do resultado precisa ser tratado como contrato.

Compare:

```sql
SELECT *
FROM app.ordem_servico;
```

Com:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada
FROM app.ordem_servico
ORDER BY id;
```

A segunda consulta deixa claro quais informações serão entregues e em qual sequência. Se a tabela ganhar uma coluna interna ou sensível, ela não aparecerá automaticamente.

Esse cuidado será importante quando Java começar a mapear resultados no M13. Uma consulta previsível reduz mudanças inesperadas no consumidor.

---

### Legibilidade da consulta

SQL pode ser escrito em uma única linha, mas isso não significa que deva ser.

Prefira organizar:

```text
uma cláusula por bloco;
uma coluna por linha quando a lista for longa;
condições alinhadas;
ordenação explícita;
aliases claros;
ponto e vírgula no final.
```

Exemplo legível:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade
FROM app.ordem_servico
WHERE status = 'AGENDADA'
ORDER BY
    prioridade ASC,
    id ASC
LIMIT 2;
```

A legibilidade facilita revisão, diagnóstico e manutenção. O objetivo não é deixar o SQL “bonito” por estética, mas reduzir ambiguidade.

---

### Resultado vazio tambem e resultado valido

Uma consulta pode retornar zero linhas sem estar errada.

Exemplo:

```sql
SELECT
    id,
    codigo
FROM app.ordem_servico
WHERE status = 'CANCELADA'
ORDER BY id;
```

Se nenhuma ordem estiver cancelada, o resultado vazio significa:

```text
a consulta foi executada;
o filtro foi aplicado;
nenhuma linha correspondeu.
```

Diferencie:

```text
zero linhas:
consulta válida sem correspondência.

erro:
sintaxe, objeto, permissão ou tipo incorreto.
```

Essa distinção evita alterar filtros corretos apenas para “fazer aparecer alguma coisa”.

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
  -Path "labs\m12\aula-278-select-where-order-by-limit-offset\sql"

Set-Location `
  "labs\m12\aula-278-select-where-order-by-limit-offset"
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
    id,
    nome,
    documento
FROM app.cliente
WHERE id = 930001
ORDER BY id;

SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
ORDER BY id;

SELECT
    id,
    ordem_servico_id,
    codigo,
    status
FROM app.atividade
ORDER BY id;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme:

```text
ordens:
IDs 930001 a 930004.

atividades:
IDs 930001 a 930006.
```

Se não existirem, conclua a aula 277.

---

### 4. Criar 01_select_colunas_aliases.sql

Crie:

```text
sql/01_select_colunas_aliases.sql
```

Conteúdo:

```sql
SELECT *
FROM app.cliente
ORDER BY id;

SELECT
    id,
    nome,
    documento,
    ativo
FROM app.cliente
ORDER BY id;

SELECT
    id AS cliente_id,
    nome AS cliente_nome,
    documento AS documento_cliente
FROM app.cliente
ORDER BY cliente_id;

SELECT
    os.id,
    os.codigo AS ordem_codigo,
    os.status AS ordem_status,
    os.valor_previsto,
    os.valor_previsto * 2 AS valor_referencia,
    'ORDEM_SERVICO' AS tipo_registro
FROM app.ordem_servico AS os
ORDER BY os.id;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\01_select_colunas_aliases.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Compare `SELECT *` com a projeção explícita.

---

### 5. Criar 02_where_basico.sql

Crie:

```text
sql/02_where_basico.sql
```

Conteúdo:

```sql
SELECT
    id,
    nome,
    ativo
FROM app.cliente
WHERE ativo = true
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE status = 'AGENDADA'
ORDER BY id;

SELECT
    id,
    codigo,
    status,
    urgente
FROM app.ordem_servico
WHERE urgente = true
ORDER BY id;

SELECT
    id,
    ordem_servico_id,
    codigo,
    status
FROM app.atividade
WHERE ordem_servico_id = 930001
ORDER BY id;

SELECT
    id,
    codigo,
    nome
FROM app.produto
WHERE id = 930002;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\02_where_basico.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Não acrescente `LIKE`, `IN`, `BETWEEN` ou `IS NULL`. Eles pertencem à próxima aula.

---

### 6. Criar 03_order_by.sql

Crie:

```text
sql/03_order_by.sql
```

Conteúdo:

```sql
SELECT
    id,
    nome
FROM app.cliente
ORDER BY nome ASC, id ASC;

SELECT
    id,
    codigo,
    valor
FROM app.produto
ORDER BY valor DESC, id ASC;

SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada
FROM app.ordem_servico
ORDER BY
    status ASC,
    data_agendada ASC NULLS LAST,
    id ASC;

SELECT
    id,
    codigo,
    status,
    valor_mao_obra
FROM app.atividade
ORDER BY
    status ASC,
    valor_mao_obra DESC,
    id ASC;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\03_order_by.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Observe os critérios de desempate.

---

### 7. Criar 04_limit.sql

Crie:

```text
sql/04_limit.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    valor_previsto
FROM app.ordem_servico
ORDER BY
    valor_previsto DESC,
    id ASC
LIMIT 2;

SELECT
    id,
    codigo,
    status
FROM app.atividade
ORDER BY id ASC
LIMIT 3;

SELECT
    id,
    nome
FROM app.cliente
ORDER BY nome ASC, id ASC
LIMIT 1;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\04_limit.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme que o limite atua depois da ordenação lógica.

---

### 8. Criar 05_offset.sql

Crie:

```text
sql/05_offset.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
ORDER BY id ASC
LIMIT 2
OFFSET 0;

SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
ORDER BY id ASC
LIMIT 2
OFFSET 2;

SELECT
    id,
    codigo,
    status
FROM app.atividade
ORDER BY
    status ASC,
    id ASC
LIMIT 2
OFFSET 2;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\05_offset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

A primeira e a segunda consulta representam duas páginas de ordens com tamanho dois.

---

### 9. Criar 06_consultas_combinadas.sql

Crie:

```text
sql/06_consultas_combinadas.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade,
    data_agendada
FROM app.ordem_servico
WHERE status = 'AGENDADA'
ORDER BY
    data_agendada ASC NULLS LAST,
    id ASC
LIMIT 2
OFFSET 0;

SELECT
    id,
    ordem_servico_id,
    codigo,
    status,
    valor_mao_obra
FROM app.atividade
WHERE ordem_servico_id = 930004
ORDER BY
    valor_mao_obra DESC,
    id ASC
LIMIT 1;

SELECT
    id,
    codigo,
    nome,
    valor
FROM app.produto
WHERE ativo = true
ORDER BY
    valor DESC,
    id ASC
LIMIT 2;

SELECT
    id,
    ordem_servico_id,
    tipo,
    ocorrido_em
FROM auditoria.evento_ordem_servico
WHERE ordem_servico_id = 930004
ORDER BY
    ocorrido_em DESC,
    id DESC
LIMIT 1;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\06_consultas_combinadas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Leia cada consulta em português antes de observar o resultado.

---

### 10. Criar 07_armadilhas_controladas.sql

Crie:

```text
sql/07_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- Consulta válida, mas sem ordem garantida.
SELECT
    id,
    codigo
FROM app.ordem_servico;

-- Limite sem ordem: não garante quais linhas representam as "primeiras".
SELECT
    id,
    codigo
FROM app.ordem_servico
LIMIT 2;

-- Ordenação por posição: funciona, mas é frágil.
SELECT
    codigo,
    status
FROM app.ordem_servico
ORDER BY 2, 1;

-- Ordenação com empate sem critério final estável.
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
ORDER BY status;

-- Forma preferida.
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico
ORDER BY status ASC, id ASC;
```

Execute o arquivo e compare os resultados.

A consulta sem `ORDER BY` pode parecer estável hoje. Não transforme essa aparência em garantia.

---

### 11. Criar 08_exercicio.sql

Crie:

```text
sql/08_exercicio.sql
```

Implemente as consultas da seção de exercício guiado.

Não copie as respostas antes de tentar.

---

### 12. Criar 09_validacao_final.sql

Crie:

```text
sql/09_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    status,
    prioridade
FROM app.ordem_servico
ORDER BY id ASC
LIMIT 4;

SELECT
    id,
    codigo,
    status,
    valor_mao_obra
FROM app.atividade
ORDER BY
    valor_mao_obra DESC,
    id ASC
LIMIT 3;

SELECT
    id,
    nome,
    documento
FROM app.cliente
ORDER BY nome ASC, id ASC
LIMIT 2
OFFSET 1;

SELECT
    id,
    codigo,
    status,
    data_agendada
FROM app.ordem_servico
WHERE status = 'AGENDADA'
ORDER BY
    data_agendada ASC NULLS LAST,
    id ASC;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-278-select-where-order-by-limit-offset\sql\09_validacao_final.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Nenhum dado deve ser modificado.

---

### 13. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 278 - Select where order by limit offset.

Pré-requisito:
dataset da aula 277.

Objetivo:
consultar uma tabela com projeção, filtro básico, ordenação e recorte.

Regra:
laboratório somente leitura.

Dataset:
3 clientes, 3 produtos, 4 ordens, 6 atividades e 4 eventos.

Próxima aula:
operadores, LIKE, BETWEEN, IN e IS NULL.
```

Liste os scripts e descreva o objetivo de cada um.

---

## Entendendo o que foi feito

### A consulta declarou a intencao

Você deixou explícito:

```text
quais colunas;
qual tabela;
quais linhas;
qual ordem;
quantidade;
deslocamento.
```

Isso transforma uma leitura genérica em uma consulta com objetivo claro.

---

### SELECT explicito funciona como contrato

Ao listar colunas, você controla o formato do resultado.

Uma nova coluna na tabela não passa automaticamente a aparecer.

Isso reduz exposição acidental e acoplamento.

---

### ORDER BY trouxe previsibilidade

Sem ordenação, o banco não promete sequência.

Com múltiplos critérios e um desempate por `id`, o resultado fica determinístico para o dataset.

Essa propriedade é especialmente importante com `LIMIT` e `OFFSET`.

---

### LIMIT e OFFSET criaram um recorte

Você criou páginas iniciais com:

```text
LIMIT:
tamanho máximo.

OFFSET:
quantidade ignorada.
```

A técnica é simples, mas precisa de ordem estável.

Paginação em grande escala será aprofundada posteriormente.

---

### WHERE permaneceu propositalmente simples

Você filtrou por:

- ID;
- status exato;
- booleano;
- foreign key exata.

A próxima aula ampliará o vocabulário de filtros.

---

## Erros comuns importantes

### Column does not exist

A coluna foi digitada incorretamente, renomeada ou pertence a outra tabela.

Inspecione:

```text
\d app.ordem_servico
```

Não invente aliases para esconder o problema.

---

### Resultado veio em ordem diferente

A consulta não possui `ORDER BY` suficiente.

Declare a ordem e inclua critério de desempate.

---

### LIMIT retornou linhas inesperadas

Verifique o `ORDER BY`.

`LIMIT` não define quais linhas são prioritárias.

---

### OFFSET pulou linhas diferentes

A ordenação é ausente ou não determinística.

Use uma coluna estável como desempate.

---

### WHERE retornou zero linhas

Confirme:

- valor;
- tipo;
- letras maiúsculas e minúsculas;
- database;
- tabela;
- estado atual do dataset.

Não remova o filtro antes de entender.

---

## Comandos uteis

### Selecionar colunas

```sql
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico;
```

### Filtrar

```sql
WHERE status = 'AGENDADA'
```

### Ordenar

```sql
ORDER BY data_agendada ASC NULLS LAST, id ASC
```

### Limitar e deslocar

```sql
LIMIT 2
OFFSET 2
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
sql/08_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Clientes

Retorne:

```text
id;
nome;
documento;
email.
```

Regras:

```text
somente clientes ativos;
ordenar por nome e id;
retornar no máximo dois.
```

---

### Parte 2 - Ordens urgentes

Retorne:

```text
id;
codigo;
status;
prioridade;
valor_previsto.
```

Regras:

```text
urgente igual a true;
ordenar por valor previsto decrescente;
usar id como desempate.
```

---

### Parte 3 - Atividades de uma ordem

Consulte atividades da ordem:

```text
930001
```

Retorne:

```text
id;
codigo;
descricao;
status;
valor_mao_obra.
```

Ordene por valor decrescente e ID crescente.

---

### Parte 4 - Duas paginas

Crie duas consultas para `app.atividade`.

Regras:

```text
ordenar por id;
tamanho da página: 3.
```

Página 1:

```text
LIMIT 3 OFFSET 0
```

Página 2:

```text
LIMIT 3 OFFSET 3
```

As duas páginas juntas devem cobrir as seis atividades do dataset principal.

---

### Parte 5 - Datas nulas no final

Liste ordens com:

```text
id;
codigo;
status;
data_agendada.
```

Ordene por data crescente, mantenha nulos no final e use ID como desempate.

Não filtre nulos nesta aula.

---

### Parte 6 - Explicar a consulta

No README, escolha uma consulta do exercício e explique em ordem lógica:

1. de qual tabela as linhas vêm;
2. qual condição é aplicada;
3. quais colunas aparecem;
4. como o resultado é ordenado;
5. quantas linhas podem ser retornadas;
6. quantas linhas são ignoradas.

---

## Criterios de aceite

- o laboratório oficial da aula 278 existe;
- o dataset da aula 277 foi preservado;
- nenhum script modifica dados;
- `SELECT *` foi comparado com projeção explícita;
- aliases de tabela e coluna foram praticados;
- literais e expressões simples foram usados;
- o schema foi qualificado;
- filtros básicos por igualdade foram executados;
- booleanos foram filtrados;
- resultados foram ordenados com `ASC` e `DESC`;
- mais de uma coluna foi usada na ordenação;
- critérios de desempate foram aplicados;
- `NULLS LAST` foi praticado;
- `LIMIT` foi usado com `ORDER BY`;
- `OFFSET` foi usado em páginas;
- a necessidade de ordem determinística foi compreendida;
- ordenação por posição foi reconhecida como frágil;
- operadores avançados não foram antecipados;
- joins não foram antecipados;
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
  labs/m12/aula-278-select-where-order-by-limit-offset
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): consultar dados com select e ordenacao"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
projeção;
filtro básico;
ordenação;
limite;
offset;
consultas somente leitura.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você construiu consultas previsíveis sobre o dataset criado na aula 277.

Aprendeu:

```text
SELECT;
FROM;
projeção;
SELECT *;
alias;
literal;
expressão;
WHERE;
ORDER BY;
ASC;
DESC;
NULLS FIRST;
NULLS LAST;
LIMIT;
OFFSET.
```

As regras principais foram:

```text
liste colunas quando o resultado funciona como contrato;

use WHERE para selecionar apenas as linhas desejadas;

não dependa da ordem aparente da tabela;

use ORDER BY quando a sequência importa;

resolva empates com um critério estável;

não use LIMIT sem definir o que significa "primeiro";

use OFFSET somente sobre uma ordem determinística.
```

A próxima aula será:

```text
279 - M12.09 - Operadores filtros like between in is null
```

Nela, você ampliará os filtros com:

- operadores de comparação;
- operadores lógicos;
- `LIKE` e padrões;
- `BETWEEN`;
- `IN`;
- `IS NULL`;
- `IS NOT NULL`;
- combinações de condições;
- precedência;
- parênteses;
- filtros de texto, datas, números e ausência;
- critérios para consultas legíveis.

O dataset deve permanecer inalterado.

---

# Material complementar

## Checkpoint final

- [ ] Consultei colunas explícitas e usei aliases.
- [ ] Filtrei e ordenei resultados de forma determinística.
- [ ] Pratiquei `LIMIT` e `OFFSET`.
- [ ] Mantive o dataset e fiz o commit recomendado.

---

## Troubleshooting adicional

### Alias nao funciona no WHERE

O alias da projeção é definido para a saída e, em geral, não pode ser usado no `WHERE` da mesma consulta.

Repita a expressão ou use a coluna original.

Aliases de saída podem ser usados em `ORDER BY`.

### NULL aparece em posicao inesperada

Declare:

```text
NULLS FIRST;
NULLS LAST.
```

A escolha deve refletir a necessidade da consulta.

### OFFSET maior que o resultado

A consulta retorna zero linhas.

Isso não é erro de sintaxe.

### SELECT estrela ficou grande

A tabela ganhou colunas ou possui dados que não deveriam aparecer.

Troque por projeção explícita.

### Resultado do DBeaver e psql parece diferente

Confirme a mesma consulta, database, usuário e ordenação.

A ferramenta pode formatar valores, mas não deve mudar a semântica do SQL.

---

## Perguntas de revisao

1. O que `SELECT` faz?
2. O que é projeção?
3. Quando `SELECT *` é aceitável?
4. Por que listar colunas?
5. O que `FROM` define?
6. O que um alias altera?
7. O que `WHERE` faz?
8. Uma consulta com `WHERE` altera dados?
9. Por que a comparação textual exata pode retornar zero?
10. O que `ORDER BY` garante?
11. Qual a diferença entre `ASC` e `DESC`?
12. Por que usar mais de uma coluna na ordenação?
13. Para que servem `NULLS FIRST` e `NULLS LAST`?
14. O que `LIMIT` faz?
15. O que `OFFSET` faz?
16. Por que paginação exige ordem determinística?

---

## Roteiro de resposta

1. `SELECT` produz um resultado.
2. Projeção escolhe as colunas.
3. `SELECT *` é útil em exploração controlada.
4. Colunas explícitas deixam o contrato claro.
5. `FROM` indica a origem.
6. Alias muda o nome apresentado, não a estrutura.
7. `WHERE` filtra linhas.
8. Não; `SELECT` é leitura.
9. Textos diferenciam maiúsculas e minúsculas.
10. Define a sequência do resultado.
11. Crescente e decrescente.
12. Para resolver empates e criar previsibilidade.
13. Controlam a posição dos nulos.
14. Limita a quantidade máxima.
15. Ignora linhas iniciais.
16. Sem ordem estável, páginas podem variar.

---

## Desafio opcional

Crie uma consulta sobre `app.ordem_servico` que:

```text
retorne codigo, status, prioridade e valor_previsto;
filtre prioridade ALTA;
ordene por valor decrescente e id crescente;
limite em uma linha;
use alias para valor_previsto.
```

Depois crie a mesma consulta com:

```text
OFFSET 1
```

Explique o que mudou.

Não acrescente operadores da aula 279.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 278 - M12.08 - Select where order by limit offset

- Estudei `SELECT` como operação de leitura.
- Diferenciei `SELECT *` de projeção explícita.
- Usei aliases de tabela e coluna.
- Consultei literais e expressões simples.
- Usei `WHERE` com filtros básicos por igualdade.
- Ordenei textos, números e datas.
- Pratiquei `ASC`, `DESC`, `NULLS FIRST` e `NULLS LAST`.
- Usei mais de uma coluna para resolver empates.
- Entendi que tabelas não possuem ordem natural garantida.
- Usei `LIMIT` para controlar a quantidade retornada.
- Usei `OFFSET` para criar páginas iniciais.
- Registrei que paginação exige uma ordem determinística.
- Mantive o dataset para a próxima aula.
- Próxima aula: operadores, `LIKE`, `BETWEEN`, `IN` e `IS NULL`.
```

---

## Referencia tecnica curta

```text
SELECT:
define a saída.

FROM:
define a origem.

WHERE:
filtra linhas.

ORDER BY:
ordena o resultado.

ASC:
ordem crescente.

DESC:
ordem decrescente.

NULLS FIRST:
nulos no início.

NULLS LAST:
nulos no final.

LIMIT:
quantidade máxima.

OFFSET:
linhas iniciais ignoradas.
```

Regra final:

```text
consulta previsível declara colunas, filtro, ordem e recorte.
```
