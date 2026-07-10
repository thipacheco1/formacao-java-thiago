# 290 - M12.20 - Funcoes de data texto numeros e case when

## Apresentacao da aula

Na aula 289, você transformou consultas importantes em objetos reutilizáveis de leitura.

Criou:

```text
app.vw_atividade_competencia_detalhe;

app.vw_resumo_ordem;

app.vw_resumo_competencia;

app.mv_resumo_competencia.
```

Essas views expõem dados organizados, mas ainda em formatos muito próximos dos valores armazenados.

Em relatórios e APIs, normalmente surgem necessidades como:

```text
padronizar textos;

montar descrições legíveis;

calcular diferenças entre valores;

arredondar números;

extrair ano, mês ou dia;

calcular duração;

classificar ordens;

traduzir códigos para rótulos;

substituir valores nulos;

criar colunas calculadas.
```

Essas transformações são realizadas com funções e expressões SQL.

Nesta aula, você vai praticar quatro grupos:

```text
funções de texto;

funções numéricas;

funções de data e hora;

CASE WHEN.
```

Também serão usados dois recursos de apoio:

```text
COALESCE;

NULLIF.
```

O objetivo é aplicar funções com critério:

- reconhecer o tipo do valor de entrada;
- escolher uma função compatível;
- prever o tipo e o significado da saída;
- controlar valores nulos;
- evitar conversões apenas para apresentação;
- distinguir dado armazenado de coluna calculada;
- manter expressões legíveis;
- decidir se a transformação pertence ao banco, à API ou à interface;
- reutilizar as views da aula 289 sem alterar os dados.

O laboratório será somente leitura e não modificará objetos.

Você não criará índices nesta aula.

A aula 291 tratará de índices. Nesta aula, o impacto de funções sobre filtros será apenas registrado como ponto de atenção.

Ao final, você deverá transformar textos, números e valores temporais, criar classificações com `CASE`, tratar nulos com `COALESCE` e `NULLIF` e produzir colunas calculadas sem alterar os dados originais.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
288:
CTEs.

289:
views e materialized views.

290:
funções de data, texto, números e CASE WHEN.

291:
índices B-tree, unique e critérios de uso.

292:
EXPLAIN e EXPLAIN ANALYZE.

293:
transações e propriedades ACID.
```

Até agora, você aprendeu a:

```text
consultar;
filtrar;
ordenar;
combinar;
agrupar;
agregar;
usar subqueries;
organizar CTEs;
encapsular consultas em views.
```

Agora aprenderá a transformar valores dentro da consulta.

Funções podem aparecer em projeções, filtros, ordenações, agrupamentos, joins, views, CTEs e subqueries. A mesma expressão pode ter efeitos funcionais e técnicos diferentes conforme o lugar em que é usada.

Exemplo:

```sql
WHERE upper(nome) = 'HOSPITAL VIDA'
```

A consulta pode estar correta, mas a função aplicada à coluna altera a expressão filtrada. O impacto sobre índices será estudado a partir da aula 291.

Nesta aula, o foco é produzir expressões corretas, legíveis e semanticamente adequadas.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-290-funcoes-data-texto-numeros-case-when
```

Estrutura final:

```text
labs
└── m12
    └── aula-290-funcoes-data-texto-numeros-case-when
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_funcoes_texto_basicas.sql
            ├── 02_concatenacao_recorte_substituicao.sql
            ├── 03_funcoes_numericas.sql
            ├── 04_data_hora_e_intervalos.sql
            ├── 05_extract_date_trunc_age.sql
            ├── 06_case_simples.sql
            ├── 07_case_pesquisado.sql
            ├── 08_coalesce_nullif.sql
            ├── 09_relatorios_com_colunas_calculadas.sql
            ├── 10_armadilhas_controladas.sql
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

As principais fontes serão:

```text
app.atividade;

app.ordem_servico;

app.cliente;

app.telefone_cliente;

app.vw_resumo_ordem;

app.vw_atividade_competencia_detalhe;

app.vw_resumo_competencia.
```

O fluxo será:

1. confirmar tabelas, views e dataset;
2. transformar textos;
3. concatenar, localizar, recortar e substituir;
4. aplicar funções numéricas;
5. trabalhar com datas, timestamps e intervalos;
6. extrair e truncar partes temporais;
7. criar classificações com `CASE`;
8. tratar nulos;
9. construir relatórios;
10. analisar armadilhas;
11. resolver o exercício;
12. validar que os dados permaneceram intactos;
13. fazer o commit.

---

## Conceito essencial

### Funcao e expressao

Uma função recebe valores e produz outro valor.

Exemplo:

```sql
upper('Hospital Vida')
```

Resultado:

```text
HOSPITAL VIDA
```

Uma expressão combina:

- colunas;
- literais;
- operadores;
- funções;
- condições.

Exemplo:

```sql
round(valor_previsto * 1.10, 2)
```

A expressão calcula um acréscimo de dez por cento e arredonda o resultado.

Uma coluna calculada existe no resultado da consulta.

Ela não altera o valor armazenado.

---

### Tipo de entrada e tipo de saida

Antes de aplicar uma função, confirme tipo de entrada, tipo retornado, nulabilidade, precisão e semântica temporal.

Exemplos:

```text
upper(text) -> text;

char_length(text) -> integer;

round(numeric, integer) -> numeric;

current_date -> date;

current_timestamp -> timestamp com fuso.
```

Os ramos de `CASE` também precisam convergir para um tipo compatível.

### Funcoes de texto e dado original

Funções de texto podem produzir uma versão normalizada:

```sql
upper(nome)
```

Isso não muda `nome` na tabela.

A consulta pode retornar:

```text
nome_original;

nome_em_maiusculas.
```

Essa comparação ajuda a distinguir armazenamento de apresentação.

Não sobrescreva dados originais apenas para adequar um relatório.

---

### UPPER e LOWER

`UPPER` converte letras para maiúsculas.

`LOWER` converte para minúsculas.

Exemplo:

```sql
SELECT
    nome,
    upper(nome) AS nome_maiusculo,
    lower(nome) AS nome_minusculo
FROM app.cliente;
```

Usos:

- apresentação;
- comparação controlada;
- criação de chaves normalizadas;
- análise de inconsistência.

A conversão depende das regras de collation e locale do banco.

Não assuma que todo comportamento linguístico é idêntico em qualquer ambiente.

---

### INITCAP

`INITCAP` capitaliza palavras:

```sql
initcap('HOSPITAL VIDA')
```

Resultado:

```text
Hospital Vida
```

É útil para apresentação, mas não corrige corretamente todas as siglas, marcas e partículas. Não o trate como normalizador universal.

### TRIM BTRIM LTRIM RTRIM

Espaços extras causam:

- filtros inconsistentes;
- exibição ruim;
- comparação inesperada;
- dados aparentemente duplicados.

Funções:

```text
trim(text):
remove espaços das extremidades.

btrim(text):
remove caracteres das duas extremidades.

ltrim(text):
remove da esquerda.

rtrim(text):
remove da direita.
```

Exemplo:

```sql
btrim('   Hospital Vida   ')
```

Resultado:

```text
Hospital Vida
```

Também é possível informar caracteres:

```sql
btrim('---codigo---', '-')
```

Resultado:

```text
codigo
```

---

### Comprimento de texto

`CHAR_LENGTH` retorna a quantidade de caracteres. `LENGTH` possui comportamento equivalente para texto no PostgreSQL.

`OCTET_LENGTH` conta bytes, por isso não deve substituir automaticamente a contagem de caracteres em regras funcionais.

### Concatenacao com operador

O operador:

```sql
||
```

concatena textos.

Exemplo:

```sql
cliente_nome || ' - ' || ordem_codigo
```

Se qualquer parte for `NULL`, o resultado completo pode se tornar `NULL`.

Essa característica exige atenção.

---

### CONCAT

`CONCAT` junta os argumentos e trata valores nulos como textos vazios.

Exemplo:

```sql
concat(cliente_nome, ' - ', ordem_codigo)
```

Se `cliente_nome` for nulo, os outros elementos ainda aparecem.

Isso evita resultado totalmente nulo, mas pode produzir separadores sobrando.

---

### CONCAT_WS

`CONCAT_WS` significa:

```text
concat with separator.
```

Exemplo:

```sql
concat_ws(
    ' - ',
    cliente_nome,
    produto_nome,
    ordem_codigo
)
```

Argumentos nulos são ignorados.

O separador é aplicado entre os valores presentes.

Esse recurso é adequado para descrições opcionais.

---

### POSITION

`POSITION` localiza um trecho:

```sql
position('VIDA' in 'HOSPITAL VIDA')
```

A posição começa em `1`; quando não encontra, retorna `0`.

### SUBSTRING

`SUBSTRING` recorta parte de um texto.

Forma legível:

```sql
substring(texto from inicio for quantidade)
```

Exemplo:

```sql
substring('OS-2026-0001' from 4 for 4)
```

Resultado:

```text
2026
```

O primeiro caractere possui posição `1`.

Não use recorte posicional para extrair um conceito quando o formato pode mudar sem contrato.

---

### REPLACE

`REPLACE` substitui ocorrências de um trecho.

Exemplo:

```sql
replace('OS-2026-0001', '-', '/')
```

Resultado:

```text
OS/2026/0001
```

É útil para apresentação e padronização temporária.

Se o dado precisa possuir formato obrigatório, a regra deve ser tratada na entrada e nas constraints apropriadas.

---

### Funcoes numericas

As principais funções numéricas desta aula são:

```text
round;
trunc;
ceil;
floor;
abs;
power;
mod.
```

Elas serão aplicadas a cálculos e relatórios, sempre preservando a regra de precisão do domínio.

### ROUND

`ROUND` arredonda.

Exemplo:

```sql
round(123.456::numeric, 2)
```

Resultado:

```text
123.46
```

Para `numeric`, você pode informar quantidade de casas.

Use cast explícito em literais quando precisar selecionar a assinatura correta da função.

Arredondamento para apresentação não substitui a definição correta de precisão da coluna.

---

### TRUNC

`TRUNC` remove casas sem arredondar.

Exemplo:

```sql
trunc(123.456::numeric, 2)
```

Resultado:

```text
123.45
```

Compare:

```text
ROUND:
aproxima.

TRUNC:
corta.
```

A escolha é regra de negócio, principalmente em valores financeiros.

---

### CEIL e FLOOR

`CEIL` retorna o menor inteiro que não é menor que o valor.

`FLOOR` retorna o maior inteiro que não é maior que o valor.

Exemplo:

```text
valor:
7.2.

CEIL:
8.

FLOOR:
7.
```

Com valores negativos:

```text
valor:
-7.2.

CEIL:
-7.

FLOOR:
-8.
```

A reta numérica ajuda a interpretar.

---

### ABS

`ABS` retorna valor absoluto.

Exemplo:

```sql
abs(valor_previsto - valor_total_mao_obra)
```

O resultado mede a magnitude da diferença sem sinal.

Use quando o sentido da diferença não importa.

Quando importa saber se ficou acima ou abaixo, preserve o sinal.

---

### POWER e MOD

`POWER` calcula potência e `MOD` retorna o resto da divisão.

```sql
power(3, 2)
mod(10, 3)
```

Resultados:

```text
9;
1.
```

### Data e timestamp

PostgreSQL diferencia:

```text
date:
data sem horário.

time:
horário sem data.

timestamp:
data e horário sem fuso.

timestamp with time zone:
instante interpretado com fuso da sessão.
```

No curso, colunas como `criado_em` usam `timestamptz`.

Colunas como `data_agendada` usam `date`.

Não converta entre tipos sem compreender a perda ou mudança de significado.

---

### CURRENT_DATE e CURRENT_TIMESTAMP

`CURRENT_DATE` retorna a data atual da transação conforme o fuso da sessão.

`CURRENT_TIMESTAMP` retorna data e hora atuais com fuso.

Exemplo:

```sql
SELECT
    current_date,
    current_timestamp;
```

Esses valores permanecem estáveis dentro da mesma transação.

Para exemplos reproduzíveis, use literais fixos.

Para lógica atual, use as funções temporais apropriadas.

---

### Literais tipados

Prefira literais explícitos:

```sql
DATE '2026-07-10'

TIMESTAMP '2026-07-10 14:30:00'

TIMESTAMPTZ '2026-07-10 14:30:00-03'

INTERVAL '2 days'
```

Isso comunica o tipo esperado e reduz conversões implícitas.

---

### Aritmetica de datas

Exemplos:

```sql
DATE '2026-07-10' + 7
```

Resultado conceitual:

```text
2026-07-17
```

```sql
TIMESTAMP '2026-07-10 10:00:00'
    + INTERVAL '2 hours'
```

Resultado:

```text
2026-07-10 12:00:00
```

Subtrair datas pode retornar quantidade de dias.

Subtrair timestamps retorna intervalo.

---

### INTERVAL

Interval representa duração.

Exemplos:

```text
2 days;

3 hours;

1 month;

15 minutes.
```

Use:

```sql
INTERVAL '2 days 3 hours'
```

Meses não possuem duração fixa em dias.

Isso importa em cálculos de calendário.

Não trate todo mês como trinta dias sem regra explícita.

---

### EXTRACT

`EXTRACT` obtém uma parte temporal.

Exemplo:

```sql
extract(year from current_date)
```

Outros campos:

```text
month;
day;
hour;
minute;
dow;
isodow;
week;
quarter;
epoch.
```

O resultado é numérico.

`DOW` e `ISODOW` usam convenções diferentes para domingo.

Quando dia da semana for regra, documente a convenção escolhida.

---

### DATE_TRUNC

`DATE_TRUNC` reduz um timestamp para o início de uma unidade.

Exemplo:

```sql
date_trunc('month', current_timestamp)
```

Resultado:

```text
primeiro instante do mês atual.
```

Unidades comuns:

```text
hour;
day;
week;
month;
quarter;
year.
```

É útil para agrupamentos temporais.

Exemplo:

```sql
GROUP BY date_trunc('month', criado_em)
```

Isso cria um grupo por mês e ano, não apenas por número do mês.

---

### AGE

`AGE` calcula uma diferença simbólica em anos, meses e dias:

```sql
age(
    DATE '2026-07-10',
    DATE '2025-05-01'
)
```

Para duração exata, subtraia timestamps e trabalhe com o intervalo retornado.

### CASE simples

Forma:

```sql
CASE expressao
    WHEN valor_1 THEN resultado_1
    WHEN valor_2 THEN resultado_2
    ELSE resultado_padrao
END
```

Exemplo:

```sql
CASE ordem_status
    WHEN 'ABERTA' THEN 'Aguardando atendimento'
    WHEN 'AGENDADA' THEN 'Atendimento planejado'
    WHEN 'EM_ATENDIMENTO' THEN 'Atendimento em andamento'
    ELSE 'Outro estado'
END
```

O `CASE` simples compara igualdade com uma expressão.

---

### CASE pesquisado

Forma:

```sql
CASE
    WHEN condicao_1 THEN resultado_1
    WHEN condicao_2 THEN resultado_2
    ELSE resultado_padrao
END
```

Exemplo:

```sql
CASE
    WHEN valor_previsto >= 1000 THEN 'ALTO'
    WHEN valor_previsto >= 500 THEN 'MEDIO'
    ELSE 'BAIXO'
END
```

As condições são avaliadas de cima para baixo.

A primeira condição verdadeira define o resultado.

A ordem dos ramos é parte da regra.

---

### Intervalos em CASE

Exemplo correto:

```sql
CASE
    WHEN valor >= 1000 THEN 'ALTO'
    WHEN valor >= 500 THEN 'MEDIO'
    ELSE 'BAIXO'
END
```

Se a condição `valor >= 500` viesse primeiro, valores acima de 1000 seriam classificados como `MEDIO`.

Comece pelas condições mais específicas ou restritivas.

---

### ELSE

Sem `ELSE`, o resultado será `NULL` quando nenhum ramo for verdadeiro.

Isso pode ser desejado, mas normalmente deve ser explícito.

Pergunte:

```text
existe um valor padrão legítimo?

ou a ausência deve revelar um estado não previsto?
```

Evite usar:

```text
ELSE 'OUTRO'
```

quando isso esconder um status inválido que deveria ser tratado.

---

### CASE e tipos compativeis

Os resultados dos ramos precisam possuir tipo compatível.

Exemplo inadequado:

```sql
CASE
    WHEN condicao THEN 100
    ELSE 'SEM VALOR'
END
```

Um ramo é número e outro é texto.

Você pode:

- retornar texto em todos os ramos;
- retornar número e usar `NULL`;
- separar rótulo de valor;
- aplicar cast conscientemente.

---

### COALESCE

`COALESCE` retorna o primeiro argumento não nulo.

Exemplo:

```sql
coalesce(email, 'E-mail não informado')
```

Também pode combinar valores numéricos:

```sql
coalesce(valor_total_mao_obra, 0)
```

Use zero somente quando:

```text
ausência de linha ou valor
significa realmente total zero.
```

Não substitua todo nulo por zero ou texto vazio sem analisar o significado.

---

### NULLIF

`NULLIF(a, b)` retorna `NULL` quando `a = b`.

Caso contrário, retorna `a`.

Exemplo:

```sql
valor_total / nullif(quantidade, 0)
```

Se `quantidade` for zero, o denominador vira nulo e evita divisão por zero.

O resultado será nulo.

Isso não significa que toda divisão por zero deva ser silenciosamente ignorada. A regra precisa definir o comportamento esperado.

---

### Funcoes em WHERE

Exemplo:

```sql
WHERE upper(cliente_nome) LIKE 'HOSPITAL%'
```

A consulta está correta.

Mas a função aplicada à coluna pode influenciar o uso de um índice simples sobre `cliente_nome`.

A aula 291 mostrará:

- índices B-tree;
- expressão indexada;
- critérios;
- medição;
- riscos.

Nesta aula, apenas registre:

```text
função em filtro é decisão funcional e também técnica.
```

---

### Funcoes em ORDER BY

Você pode ordenar por expressão:

```sql
ORDER BY lower(cliente_nome)
```

Ou por alias:

```sql
SELECT
    lower(cliente_nome) AS nome_normalizado
FROM app.vw_resumo_ordem
ORDER BY nome_normalizado;
```

A ordenação depende da collation.

Use critérios adicionais para desempate.

---

### Transformacao no banco ou na aplicacao

Transformações no SQL são adequadas quando participam de filtro, agrupamento, redução de dados ou contrato compartilhado. A aplicação costuma ser melhor para apresentação dependente de idioma, canal ou usuário.

Evite duplicar a mesma regra em várias camadas sem definir a fonte de verdade.

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
  -Path "labs\m12\aula-290-funcoes-data-texto-numeros-case-when\sql"

Set-Location `
  "labs\m12\aula-290-funcoes-data-texto-numeros-case-when"
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
    current_user AS usuario,
    current_date AS data_atual,
    current_timestamp AS instante_atual;

SELECT
    table_schema,
    table_name
FROM information_schema.views
WHERE table_schema = 'app'
  AND table_name IN (
      'vw_atividade_competencia_detalhe',
      'vw_resumo_ordem',
      'vw_resumo_competencia'
  )
ORDER BY table_name;

SELECT
    count(*) AS ordens
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004;

SELECT
    count(*) AS associacoes
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-290-funcoes-data-texto-numeros-case-when\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme as três views da aula 289.

---

### 4. Criar 01_funcoes_texto_basicas.sql

Crie:

```text
sql/01_funcoes_texto_basicas.sql
```

Conteúdo:

```sql
SELECT
    id,
    nome AS nome_original,
    upper(nome) AS nome_maiusculo,
    lower(nome) AS nome_minusculo,
    initcap(nome) AS nome_capitalizado,
    char_length(nome) AS quantidade_caracteres
FROM app.cliente
WHERE id BETWEEN 930001 AND 930003
ORDER BY id;

SELECT
    '   Hospital Vida   ' AS original,
    trim('   Hospital Vida   ') AS com_trim,
    btrim('   Hospital Vida   ') AS com_btrim,
    ltrim('   Hospital Vida   ') AS sem_esquerda,
    rtrim('   Hospital Vida   ') AS sem_direita;

SELECT
    '---ORDEM-930001---' AS original,
    btrim('---ORDEM-930001---', '-') AS sem_hifens_externos;
```

Execute e compare valor original e calculado.

---

### 5. Criar 02_concatenacao_recorte_substituicao.sql

Crie:

```text
sql/02_concatenacao_recorte_substituicao.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    cliente_nome || ' - ' || ordem_codigo AS descricao_com_operador,
    concat(
        cliente_nome,
        ' - ',
        ordem_codigo
    ) AS descricao_com_concat,
    concat_ws(
        ' | ',
        cliente_nome,
        produto_nome,
        ordem_codigo
    ) AS descricao_com_separador
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    ordem_id,
    ordem_codigo,
    position('-' in ordem_codigo) AS primeira_posicao_hifen,
    substring(ordem_codigo from 1 for 10) AS trecho_inicial,
    replace(ordem_codigo, '-', '/') AS codigo_apresentacao
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    associacao_id,
    atividade_codigo,
    competencia_codigo,
    concat_ws(
        ' -> ',
        atividade_codigo,
        competencia_codigo,
        nivel_requerido
    ) AS descricao_associacao
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
ORDER BY associacao_id;
```

O recorte é apenas demonstrativo.

Não presuma que o formato de `ordem_codigo` será sempre idêntico sem contrato explícito.

---

### 6. Criar 03_funcoes_numericas.sql

Crie:

```text
sql/03_funcoes_numericas.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    ordem_codigo,
    valor_previsto,
    valor_total_mao_obra,
    valor_medio_mao_obra,
    round(valor_medio_mao_obra, 2) AS media_arredondada,
    trunc(valor_medio_mao_obra, 2) AS media_truncada,
    abs(
        valor_previsto - coalesce(valor_total_mao_obra, 0)
    ) AS diferenca_absoluta
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    7.2::numeric AS valor,
    ceil(7.2::numeric) AS teto,
    floor(7.2::numeric) AS piso,
    ceil(-7.2::numeric) AS teto_negativo,
    floor(-7.2::numeric) AS piso_negativo;

SELECT
    power(3::numeric, 2) AS tres_ao_quadrado,
    mod(10, 3) AS resto_dez_por_tres;
```

Compare arredondamento e truncamento.

---

### 7. Criar 04_data_hora_e_intervalos.sql

Crie:

```text
sql/04_data_hora_e_intervalos.sql
```

Conteúdo:

```sql
SELECT
    current_date AS data_atual,
    current_timestamp AS instante_atual,
    localtimestamp AS data_hora_local;

SELECT
    DATE '2026-07-10' AS data_base,
    DATE '2026-07-10' + 7 AS mais_sete_dias,
    DATE '2026-07-10' - 7 AS menos_sete_dias,
    DATE '2026-07-20' - DATE '2026-07-10' AS diferenca_em_dias;

SELECT
    TIMESTAMP '2026-07-10 10:00:00' AS instante_base,
    TIMESTAMP '2026-07-10 10:00:00'
        + INTERVAL '2 hours 30 minutes' AS instante_final,
    TIMESTAMP '2026-07-10 12:30:00'
        - TIMESTAMP '2026-07-10 10:00:00' AS duracao;

SELECT
    id,
    codigo,
    data_agendada,
    data_agendada - DATE '2026-07-10' AS dias_desde_referencia
FROM app.ordem_servico
WHERE id BETWEEN 930001 AND 930004
ORDER BY id;
```

As datas fixas tornam parte do resultado reproduzível.

---

### 8. Criar 05_extract_date_trunc_age.sql

Crie:

```text
sql/05_extract_date_trunc_age.sql
```

Conteúdo:

```sql
SELECT
    TIMESTAMPTZ '2026-07-10 14:30:45-03' AS instante,
    extract(
        year FROM TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS ano,
    extract(
        month FROM TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS mes,
    extract(
        day FROM TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS dia,
    extract(
        hour FROM TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS hora;

SELECT
    TIMESTAMPTZ '2026-07-10 14:30:45-03' AS instante,
    date_trunc(
        'hour',
        TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS inicio_hora,
    date_trunc(
        'day',
        TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS inicio_dia,
    date_trunc(
        'month',
        TIMESTAMPTZ '2026-07-10 14:30:45-03'
    ) AS inicio_mes;

SELECT
    age(
        DATE '2026-07-10',
        DATE '2025-05-01'
    ) AS diferenca_calendario;

SELECT
    date_trunc(
        'month',
        associacao_criada_em
    ) AS mes_referencia,
    count(*) AS quantidade_associacoes
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
GROUP BY
    date_trunc(
        'month',
        associacao_criada_em
    )
ORDER BY mes_referencia;
```

A última consulta agrupa por início do mês, preservando ano e mês.

---

### 9. Criar 06_case_simples.sql

Crie:

```text
sql/06_case_simples.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    CASE ordem_status
        WHEN 'ABERTA' THEN 'Aguardando atendimento'
        WHEN 'AGENDADA' THEN 'Atendimento planejado'
        WHEN 'EM_ATENDIMENTO' THEN 'Atendimento em andamento'
        WHEN 'CONCLUIDA' THEN 'Atendimento finalizado'
        ELSE 'Status não mapeado'
    END AS descricao_status
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    associacao_id,
    nivel_requerido,
    CASE nivel_requerido
        WHEN 'BASICO' THEN 1
        WHEN 'INTERMEDIARIO' THEN 2
        WHEN 'AVANCADO' THEN 3
        ELSE NULL
    END AS ordem_nivel
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
ORDER BY
    ordem_nivel,
    associacao_id;
```

O segundo `CASE` transforma rótulos em uma ordem numérica de negócio.

---

### 10. Criar 07_case_pesquisado.sql

Crie:

```text
sql/07_case_pesquisado.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    ordem_codigo,
    valor_previsto,
    CASE
        WHEN valor_previsto >= 1000 THEN 'ALTO'
        WHEN valor_previsto >= 500 THEN 'MEDIO'
        ELSE 'BAIXO'
    END AS faixa_valor
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY
    valor_previsto DESC,
    ordem_id;

SELECT
    ordem_id,
    ordem_codigo,
    data_agendada,
    CASE
        WHEN data_agendada IS NULL THEN 'SEM_AGENDAMENTO'
        WHEN data_agendada < DATE '2026-07-10' THEN 'DATA_PASSADA'
        WHEN data_agendada = DATE '2026-07-10' THEN 'DATA_REFERENCIA'
        ELSE 'DATA_FUTURA'
    END AS classificacao_agendamento
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    associacao_id,
    competencia_nome,
    nivel_requerido,
    obrigatoria,
    CASE
        WHEN obrigatoria = true
             AND nivel_requerido = 'AVANCADO'
            THEN 'CRITICA'
        WHEN obrigatoria = true
            THEN 'OBRIGATORIA'
        ELSE 'COMPLEMENTAR'
    END AS classificacao_exigencia
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
ORDER BY associacao_id;
```

Observe a ordem das condições.

---

### 11. Criar 08_coalesce_nullif.sql

Crie:

```text
sql/08_coalesce_nullif.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    ordem_codigo,
    quantidade_atividades,
    coalesce(
        quantidade_atividades,
        0
    ) AS quantidade_atividades_exibida,
    valor_total_mao_obra,
    coalesce(
        valor_total_mao_obra,
        0
    ) AS valor_total_exibido
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    id,
    nome,
    email,
    coalesce(
        email,
        'E-mail não informado'
    ) AS email_exibicao
FROM app.cliente
WHERE id BETWEEN 930001 AND 930003
ORDER BY id;

SELECT
    100::numeric AS total,
    4::numeric AS quantidade,
    100::numeric / nullif(
        4::numeric,
        0::numeric
    ) AS media_valida,
    100::numeric / nullif(
        0::numeric,
        0::numeric
    ) AS media_sem_divisao;
```

O último resultado é `NULL`, não erro.

---

### 12. Criar 09_relatorios_com_colunas_calculadas.sql

Crie:

```text
sql/09_relatorios_com_colunas_calculadas.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    concat_ws(
        ' | ',
        ordem_codigo,
        cliente_nome,
        produto_nome
    ) AS descricao_ordem,
    ordem_status,
    CASE ordem_status
        WHEN 'ABERTA' THEN 'PENDENTE DE FLUXO'
        WHEN 'AGENDADA' THEN 'PLANEJADA'
        WHEN 'EM_ATENDIMENTO' THEN 'EM EXECUCAO'
        ELSE 'OUTRO'
    END AS grupo_operacional,
    round(
        coalesce(valor_total_mao_obra, 0),
        2
    ) AS custo_mao_obra,
    round(
        valor_previsto
        - coalesce(valor_total_mao_obra, 0),
        2
    ) AS saldo_previsto,
    CASE
        WHEN valor_previsto = 0 THEN NULL
        ELSE round(
            coalesce(valor_total_mao_obra, 0)
            / nullif(valor_previsto, 0)
            * 100,
            2
        )
    END AS percentual_mao_obra
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    associacao_id,
    concat_ws(
        ' -> ',
        atividade_codigo,
        competencia_codigo
    ) AS vinculo,
    upper(competencia_nome) AS competencia_exibicao,
    nivel_requerido,
    CASE nivel_requerido
        WHEN 'BASICO' THEN 1
        WHEN 'INTERMEDIARIO' THEN 2
        WHEN 'AVANCADO' THEN 3
        ELSE NULL
    END AS peso_nivel,
    CASE
        WHEN obrigatoria THEN 'SIM'
        ELSE 'NAO'
    END AS obrigatoria_exibicao,
    date_trunc(
        'day',
        associacao_criada_em
    ) AS dia_criacao
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
ORDER BY
    peso_nivel DESC,
    associacao_id;
```

Esses resultados são projeções de leitura.

Não são novos fatos armazenados.

---

### 13. Criar 10_armadilhas_controladas.sql

Crie:

```text
sql/10_armadilhas_controladas.sql
```

Conteúdo:

```sql
-- O operador || produz NULL quando uma parte é NULL.
SELECT
    'Cliente' || ' - ' || NULL::text AS resultado_operador,
    concat(
        'Cliente',
        ' - ',
        NULL::text
    ) AS resultado_concat,
    concat_ws(
        ' - ',
        'Cliente',
        NULL::text
    ) AS resultado_concat_ws;

-- A ordem dos WHEN muda a classificação.
SELECT
    valor,
    CASE
        WHEN valor >= 500 THEN 'MEDIO_OU_ALTO'
        WHEN valor >= 1000 THEN 'ALTO'
        ELSE 'BAIXO'
    END AS classificacao_incorreta,
    CASE
        WHEN valor >= 1000 THEN 'ALTO'
        WHEN valor >= 500 THEN 'MEDIO'
        ELSE 'BAIXO'
    END AS classificacao_correta
FROM (
    VALUES
        (400::numeric),
        (700::numeric),
        (1200::numeric)
) AS dados(valor);

-- ROUND e TRUNC possuem regras diferentes.
SELECT
    12.349::numeric AS valor,
    round(12.349::numeric, 2) AS arredondado,
    trunc(12.349::numeric, 2) AS truncado;

-- CASE sem ELSE retorna NULL quando não encontra ramo.
SELECT
    status,
    CASE status
        WHEN 'ABERTA' THEN 'MAPEADO'
    END AS resultado_sem_else
FROM (
    VALUES
        ('ABERTA'),
        ('DESCONHECIDO')
) AS dados(status);

-- Evite aplicar função em filtro sem avaliar a necessidade.
SELECT
    id,
    nome
FROM app.cliente
WHERE upper(nome) LIKE 'HOSPITAL%';
```

O último comando é funcionalmente válido.

O impacto de índice será analisado nas próximas aulas.

---

### 14. Criar 11_exercicio.sql

Crie:

```text
sql/11_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Não altere views nem tabelas.

---

### 15. Criar 12_validacao_final.sql

Crie:

```text
sql/12_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    ordem_id,
    upper(ordem_codigo) AS codigo,
    CASE
        WHEN valor_previsto >= 1000 THEN 'ALTO'
        WHEN valor_previsto >= 500 THEN 'MEDIO'
        ELSE 'BAIXO'
    END AS faixa_valor,
    round(
        coalesce(valor_total_mao_obra, 0),
        2
    ) AS valor_mao_obra
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    associacao_id,
    concat_ws(
        ' -> ',
        atividade_codigo,
        competencia_codigo
    ) AS vinculo,
    CASE nivel_requerido
        WHEN 'BASICO' THEN 1
        WHEN 'INTERMEDIARIO' THEN 2
        WHEN 'AVANCADO' THEN 3
        ELSE NULL
    END AS peso
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
ORDER BY associacao_id;

SELECT
    (SELECT count(*) FROM app.ordem_servico WHERE id BETWEEN 930001 AND 930004)
        AS ordens,
    (SELECT count(*) FROM app.atividade WHERE id BETWEEN 930001 AND 930006)
        AS atividades,
    (
        SELECT count(*)
        FROM app.competencia
        WHERE id BETWEEN 950001 AND 950004
    ) AS competencias,
    (
        SELECT count(*)
        FROM app.atividade_competencia
        WHERE id BETWEEN 951001 AND 951006
    ) AS associacoes;
```

Contagens finais esperadas:

```text
4 ordens;
6 atividades;
4 competências;
6 associações.
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
Aula 290 - Funcoes de data texto numeros e case when.

Objetivo:
transformar valores em consultas e relatórios sem alterar os dados.

Texto:
UPPER, LOWER, INITCAP, TRIM, CHAR_LENGTH, CONCAT, CONCAT_WS,
POSITION, SUBSTRING e REPLACE.

Numeros:
ROUND, TRUNC, CEIL, FLOOR, ABS, POWER e MOD.

Data e hora:
CURRENT_DATE, CURRENT_TIMESTAMP, INTERVAL, EXTRACT,
DATE_TRUNC e AGE.

Condicoes:
CASE simples e CASE pesquisado.

Nulos:
COALESCE e NULLIF.

Regra:
laboratório somente leitura.

Próxima aula:
índices B-tree, unique e critérios de uso.
```

Liste os scripts e registre quais transformações pertencem somente à apresentação.

---

## Entendendo o que foi feito

### Valores foram transformados sem alterar a origem

Maiúsculas, descrições, faixas, diferenças e períodos existiram somente no resultado.

### Texto exigiu semantica

Capitalização, recorte e substituição dependeram de formato e significado, não apenas de sintaxe.

### Numeros exigiram regra de negocio

Arredondar e truncar produziram resultados diferentes, especialmente relevantes para valores financeiros.

### Data e hora exigiram tipos corretos

Você diferenciou `date`, `timestamp`, `timestamptz` e `interval`.

### CASE criou classificacoes

O `CASE` simples tratou valores exatos; o pesquisado tratou condições e faixas. A ordem dos ramos definiu o resultado.

### COALESCE e NULLIF controlaram ausencias

Os dois recursos foram aplicados somente quando o valor nulo possuía significado aceitável.

## Erros comuns importantes

### Funcao recebeu tipo inesperado

Use casts explícitos quando houver ambiguidade.

Não converta tudo para texto apenas para fazer a função aceitar.

---

### Concatenacao virou NULL

O operador `||` encontrou valor nulo.

Avalie `CONCAT`, `CONCAT_WS` ou `COALESCE`.

---

### Faixa ficou errada

Os ramos de `CASE` foram ordenados do mais amplo para o mais específico.

Reordene as condições.

---

### Data mudou com fuso

A expressão usa `timestamptz` e é apresentada no fuso da sessão.

Registre a política temporal da aplicação.

---

### Filtro com funcao ficou lento

A função aplicada à coluna pode alterar as possibilidades de índice.

Não conclua sem criar o índice adequado e medir o plano nas aulas 291 e 292.

---

## Comandos uteis

### Texto

```sql
upper(texto)
lower(texto)
trim(texto)
char_length(texto)
concat_ws(' - ', parte1, parte2)
```

### Numeros

```sql
round(valor, 2)
trunc(valor, 2)
ceil(valor)
floor(valor)
abs(valor)
```

### Data e hora

```sql
current_date
current_timestamp
date_trunc('month', instante)
extract(year from instante)
age(data_final, data_inicial)
```

### Condicao

```sql
CASE
    WHEN condicao THEN resultado
    ELSE resultado_padrao
END
```

---

## Exercicio guiado

No arquivo:

```text
sql/11_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - Cliente normalizado

Retorne os três clientes com:

```text
id;
nome original;
nome em maiúsculas;
nome em minúsculas;
nome capitalizado;
quantidade de caracteres;
email ou texto de ausência.
```

Ordene por nome em minúsculas.

---

### Parte 2 - Descricao de Ordem

Usando `app.vw_resumo_ordem`, produza:

```text
ordem_id;
descricao composta por código, cliente e produto;
status;
descrição amigável do status.
```

Use `CONCAT_WS` e `CASE` simples.

---

### Parte 3 - Faixa e saldo

Retorne:

```text
ordem;
valor previsto;
total de mão de obra;
saldo;
diferença absoluta;
faixa BAIXO, MEDIO ou ALTO.
```

Arredonde valores para duas casas.

Defina as faixas no README.

---

### Parte 4 - Datas

Para cada ordem:

```text
data agendada;
ano;
mês;
dia;
diferença em dias em relação a DATE '2026-07-10';
classificação passada, referência, futura ou ausente.
```

Use `EXTRACT` e `CASE`.

---

### Parte 5 - Associacoes por Nivel

Use a view de detalhe.

Retorne:

```text
associacao_id;
atividade;
competência;
nível;
peso numérico;
classificação CRITICA, OBRIGATORIA ou COMPLEMENTAR.
```

Ordene pelo peso decrescente.

---

### Parte 6 - Agrupamento temporal

Agrupe associações por mês de criação usando:

```text
date_trunc('month', associacao_criada_em)
```

Retorne quantidade por mês.

Explique por que agrupar apenas por `EXTRACT(month ...)` pode misturar anos.

---

### Parte 7 - Divisao segura

Calcule para cada ordem:

```text
percentual de mão de obra em relação ao valor previsto.
```

Requisitos:

- usar `NULLIF` para denominador zero;
- usar `COALESCE` apenas quando ausência significar zero;
- arredondar para duas casas;
- retornar `NULL` quando o percentual não puder ser calculado.

---

### Parte 8 - Apresentacao ou Regra

Classifique cada transformação como:

```text
apresentação;
regra de consulta;
regra de negócio;
decisão duvidosa.
```

Itens:

```text
UPPER no nome;

faixa de valor;

descrição amigável de status;

substituir email nulo;

arredondar valor financeiro;

calcular saldo;

formatar código com barras;

classificar data agendada.
```

Justifique onde cada transformação deveria morar:

```text
SQL;
view;
Java;
frontend;
configuração.
```

---

### Parte 9 - Revisao de indice

Escolha três filtros com função:

```text
upper(nome);

date_trunc('month', criado_em);

abs(valor_previsto - valor_total).
```

Para cada um, registre:

- por que a função é necessária;
- se poderia comparar sem função;
- qual índice simples existe ou poderia existir;
- qual dúvida será levada para a aula 291;
- como validar na aula 292.

Não crie índice agora.

---

## Criterios de aceite

- o laboratório oficial da aula 290 existe;
- o arquivo e o H1 seguem a grade;
- o dataset e as views anteriores foram preservados;
- nenhum script modifica dados ou objetos;
- `UPPER`, `LOWER` e `INITCAP` foram praticados;
- funções de corte de espaços foram praticadas;
- comprimento de texto foi medido;
- concatenação com `||`, `CONCAT` e `CONCAT_WS` foi comparada;
- `POSITION`, `SUBSTRING` e `REPLACE` foram usados;
- `ROUND` e `TRUNC` foram diferenciados;
- `CEIL`, `FLOOR`, `ABS`, `POWER` e `MOD` foram praticados;
- `CURRENT_DATE` e `CURRENT_TIMESTAMP` foram usados;
- literais de data, timestamp e intervalo foram usados;
- aritmética temporal foi praticada;
- `EXTRACT`, `DATE_TRUNC` e `AGE` foram praticados;
- `CASE` simples foi usado;
- `CASE` pesquisado foi usado;
- a ordem dos ramos foi compreendida;
- `ELSE` e resultado nulo foram discutidos;
- `COALESCE` foi usado com critério;
- `NULLIF` foi usado para divisão segura;
- colunas calculadas foram produzidas;
- transformação e armazenamento foram diferenciados;
- impacto potencial de funções em filtros foi registrado sem antecipar índices;
- o exercício foi concluído;
- contagens finais continuam corretas;
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
  labs/m12/aula-290-funcoes-data-texto-numeros-case-when
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): aplicar funcoes e expressoes sql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
funções de texto;
funções numéricas;
funções temporais;
CASE;
tratamento de nulos;
relatórios calculados.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aplicou funções e expressões sobre dados relacionais.

Aprendeu:

```text
UPPER;
LOWER;
INITCAP;
TRIM;
CHAR_LENGTH;
CONCAT;
CONCAT_WS;
POSITION;
SUBSTRING;
REPLACE;
ROUND;
TRUNC;
CEIL;
FLOOR;
ABS;
POWER;
MOD;
CURRENT_DATE;
CURRENT_TIMESTAMP;
INTERVAL;
EXTRACT;
DATE_TRUNC;
AGE;
CASE;
COALESCE;
NULLIF.
```

As regras principais foram:

```text
função transforma o resultado sem alterar a origem;

entrada e saída precisam de tipos compatíveis;

concatenação com NULL precisa de decisão;

arredondamento e truncamento não são equivalentes;

date, timestamp, timestamptz e interval possuem semânticas diferentes;

CASE avalia condições em ordem;

COALESCE precisa de substituição semanticamente válida;

NULLIF pode evitar divisão por zero;

apresentação não deve dominar a modelagem;

funções em filtros precisam ser avaliadas junto de índices e planos.
```

A próxima aula será:

```text
291 - M12.21 - Indices btree unique e criterios de uso
```

Nela, você vai estudar:

- por que índices existem;
- estrutura B-tree;
- busca por igualdade;
- busca por faixa;
- ordenação;
- índice de primary key;
- índice criado por unique;
- índice simples;
- índice composto;
- ordem das colunas;
- seletividade;
- custo de escrita;
- tamanho;
- filtros com funções;
- critérios para criar ou não criar;
- inspeção do catálogo;
- preparação para `EXPLAIN` na aula 292.

Não crie índices nesta aula.

Leve as dúvidas registradas nos filtros com funções para a próxima prática.

---

# Material complementar

## Checkpoint final

- [ ] Pratiquei funções de texto, números e data/hora.
- [ ] Criei classificações com `CASE`.
- [ ] Tratei valores nulos com critério.
- [ ] Mantive o dataset inalterado e fiz o commit.

---

## Troubleshooting adicional

### Function does not exist

A assinatura não corresponde aos tipos enviados.

Inspecione os tipos e aplique cast consciente.

### CASE types cannot be matched

Os ramos retornam tipos incompatíveis.

Padronize os resultados.

### Invalid input syntax for type date

O texto não está em formato reconhecido.

Prefira literal tipado ou conversão explícita com formato conhecido.

### Division by zero

Use `NULLIF` somente se resultado nulo representar a regra correta.

Caso contrário, valide antes e retorne erro controlado na camada apropriada.

### Timestamp aparece em horario diferente

A sessão está usando outro fuso.

Consulte a configuração e defina uma política temporal consistente.

---

## Perguntas de revisao

1. O que uma função SQL produz?
2. A função altera o valor armazenado?
3. Qual a diferença entre `UPPER` e `INITCAP`?
4. O que `CHAR_LENGTH` conta?
5. Como `||` trata `NULL`?
6. Qual a diferença entre `CONCAT` e `CONCAT_WS`?
7. Qual a diferença entre `ROUND` e `TRUNC`?
8. Como `CEIL` e `FLOOR` se comportam com negativos?
9. O que representa `INTERVAL`?
10. Qual a diferença entre `date` e `timestamptz`?
11. O que `EXTRACT` retorna?
12. Para que serve `DATE_TRUNC`?
13. Qual a diferença entre `CASE` simples e pesquisado?
14. Por que a ordem dos `WHEN` importa?
15. O que acontece sem `ELSE`?
16. Para que serve `COALESCE`?
17. Para que serve `NULLIF`?
18. Por que uma função no filtro exige análise de índice?

---

## Roteiro de resposta

1. Um novo valor calculado.
2. Não, salvo em comando de escrita.
3. `UPPER` usa maiúsculas; `INITCAP` capitaliza palavras.
4. Caracteres.
5. Pode tornar o resultado nulo.
6. `CONCAT_WS` usa separador e ignora argumentos nulos.
7. `ROUND` arredonda; `TRUNC` corta casas.
8. Teto aproxima para cima na reta; piso para baixo.
9. Uma duração temporal.
10. `date` não possui hora; `timestamptz` representa instante com fuso.
11. Uma parte temporal numérica.
12. Reduz o instante ao início de uma unidade.
13. Simples compara igualdade; pesquisado avalia condições.
14. O primeiro ramo verdadeiro vence.
15. O resultado é `NULL`.
16. Retorna o primeiro valor não nulo.
17. Retorna nulo quando dois valores são iguais.
18. A expressão filtrada pode não usar um índice simples da mesma forma.

---

## Desafio opcional

Crie um relatório somente leitura usando:

```text
app.vw_resumo_ordem;
app.vw_atividade_competencia_detalhe.
```

Para cada ordem, produza:

```text
descrição composta;
status amigável;
faixa de valor;
saldo previsto;
percentual de mão de obra;
classificação da data agendada;
mês de referência;
quantidade de atividades;
indicador textual de presença de eventos.
```

Regras:

- usar funções desta aula;
- não criar view;
- não modificar dados;
- não usar função de janela;
- não criar índice;
- documentar tipo e significado de cada coluna calculada.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 290 - M12.20 - Funcoes de data texto numeros e case when

- Apliquei funções SQL sem alterar os valores armazenados.
- Pratiquei `UPPER`, `LOWER`, `INITCAP`, `TRIM` e `CHAR_LENGTH`.
- Comparei `||`, `CONCAT` e `CONCAT_WS`.
- Usei `POSITION`, `SUBSTRING` e `REPLACE`.
- Diferenciei `ROUND` de `TRUNC`.
- Usei `CEIL`, `FLOOR`, `ABS`, `POWER` e `MOD`.
- Trabalhei com `date`, `timestamp`, `timestamptz` e `interval`.
- Usei `CURRENT_DATE`, `CURRENT_TIMESTAMP`, `EXTRACT`, `DATE_TRUNC` e `AGE`.
- Criei classificações com `CASE` simples e pesquisado.
- Entendi que a ordem dos `WHEN` altera o resultado.
- Usei `COALESCE` para valores substitutos semanticamente válidos.
- Usei `NULLIF` para evitar divisão por zero quando o resultado nulo era aceitável.
- Produzi relatórios com colunas calculadas a partir das views.
- Registrei dúvidas sobre funções em filtros para a aula de índices.
- Próxima aula: índices B-tree, unique e critérios de uso.
```

---

## Referencia tecnica curta

```text
Texto:
UPPER, LOWER, TRIM, CONCAT_WS, SUBSTRING.

Numeros:
ROUND, TRUNC, CEIL, FLOOR, ABS.

Data:
CURRENT_DATE, CURRENT_TIMESTAMP, INTERVAL,
EXTRACT, DATE_TRUNC, AGE.

Condicao:
CASE WHEN.

Nulos:
COALESCE e NULLIF.

Regra:
funções calculam valores;
não alteram a origem em consultas de leitura.
```

Regra final:

```text
use funcoes para expressar transformacoes claras, com tipos, nulos e significado de negocio controlados.
```
