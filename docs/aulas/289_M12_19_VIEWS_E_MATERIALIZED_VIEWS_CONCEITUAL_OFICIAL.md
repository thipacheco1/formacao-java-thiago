# 289 - M12.19 - Views e materialized views conceitual

## Apresentacao da aula

Na aula 288, você organizou consultas complexas com Common Table Expressions.

Usou:

```text
WITH;
CTEs simples;
múltiplas CTEs;
CTEs dependentes;
agregações intermediárias;
MATERIALIZED;
NOT MATERIALIZED;
WITH RECURSIVE.
```

Uma CTE recebe um nome, mas esse nome existe somente durante uma instrução.

Quando a consulta termina no ponto e vírgula, a CTE deixa de existir.

Agora surge uma necessidade diferente:

```text
uma consulta importante precisa ser reutilizada por várias instruções;

vários relatórios precisam enxergar a mesma definição;

uma API deve consumir um contrato de leitura estável;

determinadas colunas precisam ser ocultadas da leitura comum;

um resumo custoso precisa ser consultado sem recalcular tudo a cada SELECT.
```

Esses cenários levam a dois objetos do PostgreSQL:

```text
view;

materialized view.
```

Uma view armazena a definição da consulta.

Quando você consulta a view, PostgreSQL usa a consulta que está por trás dela para produzir o resultado atual.

Uma materialized view armazena fisicamente o resultado da consulta em determinado momento.

Ela não acompanha automaticamente cada alteração das tabelas de origem.

Para atualizar seus dados, é necessário executar:

```sql
REFRESH MATERIALIZED VIEW
```

Nesta aula, você criará:

```text
app.vw_atividade_competencia_detalhe;

app.vw_resumo_ordem;

app.mv_resumo_competencia.
```

Também vai:

- consultar as definições no catálogo;
- comparar CTE, view e materialized view;
- observar dependências;
- analisar contratos de colunas;
- demonstrar dados desatualizados em uma materialized view;
- executar `REFRESH`;
- usar uma transação com `ROLLBACK` para não alterar o dataset final;
- estudar critérios de escolha.

O título da aula usa a palavra “conceitual” porque o objetivo não é apenas decorar `CREATE VIEW`.

Você precisa compreender:

```text
o que é persistido;

quando o resultado é recalculado;

quem depende de quem;

qual contrato é exposto;

como ocorre atualização;

qual risco de dados desatualizados existe;

quando a abstração melhora ou piora o sistema.
```

Views não corrigem consultas ruins.

Materialized views não são uma solução automática de performance.

Antes de escolher uma delas, você precisa entender a necessidade de leitura, atualização, consistência e manutenção.

A próxima aula será dedicada a funções de data, texto, números e `CASE WHEN`. Portanto, essas expressões aparecerão somente quando forem indispensáveis; não serão aprofundadas agora.

Ao final desta aula, você deverá conseguir:

- explicar o que uma view armazena;
- explicar o que uma materialized view armazena;
- diferenciar view, CTE, tabela e materialized view;
- criar e consultar views;
- criar e atualizar materialized views;
- reconhecer dados desatualizados;
- consultar definições e objetos no catálogo;
- compreender dependências;
- definir colunas de um contrato de leitura;
- avaliar segurança e exposição;
- documentar critérios de uso;
- versionar definições como código.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
287:
subqueries.

288:
CTE common table expressions.

289:
views e materialized views conceitual.

290:
funções de data, texto, números e CASE WHEN.

291:
índices B-tree, unique e critérios de uso.

292:
EXPLAIN e EXPLAIN ANALYZE.
```

A progressão é:

```text
Subquery:
consulta interna sem nome persistente.

CTE:
resultado intermediário nomeado durante uma instrução.

View:
consulta nomeada e persistente no catálogo.

Materialized view:
resultado persistido fisicamente e atualizado por refresh.
```

Cada recurso resolve um problema diferente.

A CTE melhora a estrutura de uma instrução.

A view cria um contrato reutilizável de leitura.

A materialized view cria uma fotografia persistida do resultado.

A aula 291 mostrará como índices podem ser criados em tabelas e materialized views conforme critérios reais.

A aula 292 mostrará o plano de execução.

Nesta etapa, você não concluirá que uma opção é mais rápida apenas por sua sintaxe.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-289-views-materialized-views-conceitual
```

Estrutura final:

```text
labs
└── m12
    └── aula-289-views-materialized-views-conceitual
        ├── README.md
        └── sql
            ├── 00_verificar_dataset.sql
            ├── 01_criar_view_detalhe_competencia.sql
            ├── 02_criar_view_resumo_ordem.sql
            ├── 03_consultar_views.sql
            ├── 04_criar_materialized_view.sql
            ├── 05_comparar_view_e_materialized_view.sql
            ├── 06_demonstrar_refresh_com_rollback.sql
            ├── 07_catalogo_e_dependencias.sql
            ├── 08_alteracoes_e_remocao_controlada.sql
            ├── 09_criterios_de_decisao.sql
            ├── 10_exercicio.sql
            └── 11_validacao_final.sql
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

Dataset esperado:

```text
3 clientes;
3 produtos;
4 ordens;
6 atividades;
4 eventos;
5 telefones;
4 competências;
6 associações.
```

O laboratório criará objetos de leitura, mas não deixará novos dados de negócio.

A demonstração de atualização usará:

```text
BEGIN;
INSERT temporário;
REFRESH;
ROLLBACK.
```

Ao final:

```text
os dados temporários não existirão;

a materialized view voltará ao estado anterior à transação;

as views permanecerão criadas;

a materialized view permanecerá criada e populada.
```

---

## Conceito essencial

### O que e uma view

View é um objeto do banco que possui nome e definição baseada em uma consulta.

Forma:

```sql
CREATE VIEW app.vw_exemplo AS
SELECT ...
FROM ...;
```

Depois:

```sql
SELECT *
FROM app.vw_exemplo;
```

A view pode ser usada em consultas como uma relação.

Ela pode participar de:

- `SELECT`;
- joins;
- filtros;
- agregações;
- subqueries;
- CTEs;
- outras views.

Conceitualmente, a view oferece uma interface de leitura para uma consulta.

---

### O que a view armazena

Uma view comum armazena a definição da consulta, não uma cópia permanente de todas as linhas resultantes.

Quando as tabelas de origem mudam, uma nova consulta à view reflete os dados atuais.

Exemplo:

```text
VIEW:
consulta Cliente e Telefone.

novo Telefone inserido:
a próxima leitura da view pode enxergá-lo imediatamente.
```

Não é necessário executar `REFRESH VIEW`.

Esse comando nem existe para views comuns.

---

### View nao e uma tabela com dados copiados

Ao consultar uma view, pode parecer que existe uma tabela pronta.

Mas o objeto representa uma consulta.

Consequências:

- o custo da consulta subjacente continua relevante;
- filtros externos podem ser combinados pelo otimizador;
- mudanças nas tabelas podem alterar o resultado;
- dependências precisam ser respeitadas;
- remover objetos de origem pode ser bloqueado.

Uma view organiza e encapsula. Ela não elimina o trabalho lógico da consulta.

---

### View como contrato de leitura

Considere uma API que precisa retornar:

```text
ordem;
cliente;
produto;
quantidade de atividades;
valor total;
quantidade de eventos.
```

Em vez de repetir a mesma consulta em vários pontos, uma view pode expor:

```text
app.vw_resumo_ordem.
```

O nome das colunas passa a fazer parte de um contrato interno de leitura.

Mudanças precisam ser cuidadosas:

- renomear coluna pode quebrar consumidores;
- remover coluna pode quebrar consultas;
- alterar significado sem mudar nome gera erro semântico;
- adicionar coluna pode ampliar o contrato;
- trocar granularidade pode multiplicar linhas.

Uma view deve ser versionada e revisada como código.

---

### Granularidade da view

Antes de criar uma view, declare:

```text
o que cada linha representa?
```

Exemplos:

```text
vw_atividade_competencia_detalhe:
uma linha por associação entre Atividade e Competência.

vw_resumo_ordem:
uma linha por Ordem de Serviço.
```

A granularidade precisa ser estável.

Uma view chamada `vw_resumo_ordem` não deveria passar silenciosamente de uma linha por ordem para uma linha por atividade.

Isso quebraria contagens, paginação e integrações.

---

### Colunas explicitas

Evite criar contratos importantes com:

```sql
SELECT *
```

A lista explícita:

- documenta o contrato;
- evita expor colunas novas automaticamente;
- controla nomes;
- reduz ambiguidades;
- facilita revisão;
- protege consumidores de mudanças acidentais.

Exemplo:

```sql
CREATE VIEW app.vw_cliente_publico AS
SELECT
    id,
    nome
FROM app.cliente;
```

Se uma coluna sensível for adicionada à tabela, ela não entra automaticamente na view.

---

### CREATE OR REPLACE VIEW

PostgreSQL permite:

```sql
CREATE OR REPLACE VIEW ...
```

Isso atualiza a definição sem exigir remover a view primeiro.

Porém, a substituição precisa preservar compatibilidade estrutural com as colunas existentes.

Mudanças incompatíveis de nome, ordem ou tipo exigem uma estratégia explícita, como:

- alterar o nome da coluna;
- criar uma nova versão da view;
- remover e recriar com análise de dependências;
- migrar consumidores.

`CREATE OR REPLACE VIEW` não deve ser tratado como autorização para quebrar o contrato.

---

### Dependencias

Uma view depende dos objetos usados em sua definição.

Exemplo:

```text
vw_resumo_ordem
depende de:
ordem_servico;
cliente;
produto;
atividade;
evento_ordem_servico.
```

PostgreSQL registra essas dependências.

Se você tentar remover um objeto necessário, o banco pode bloquear a operação.

Uma remoção com `CASCADE` pode apagar objetos dependentes.

Por isso:

```text
não use CASCADE sem listar e compreender o impacto.
```

---

### View sobre outra view

Uma view pode usar outra view:

```sql
CREATE VIEW app.vw_exemplo_2 AS
SELECT ...
FROM app.vw_exemplo_1;
```

Isso cria camadas.

Pode melhorar reutilização, mas também pode:

- esconder complexidade;
- criar cadeia longa de dependências;
- dificultar diagnóstico;
- ampliar impacto de mudanças;
- produzir contratos confusos.

Use camadas quando elas representam conceitos claros.

Não crie uma view para cada pequena transformação sem necessidade.

---

### View e seguranca

Uma view pode expor somente parte das colunas.

Exemplo:

```text
tabela Cliente:
id, nome, documento, email.

view pública:
id, nome.
```

Também é possível conceder permissão de leitura na view e controlar acesso aos objetos de origem conforme a estratégia de segurança.

Mas uma view não é automaticamente uma barreira completa.

Segurança depende de:

- proprietário;
- permissões;
- opção de execução;
- funções chamadas;
- políticas;
- filtros;
- configuração da view;
- estratégia da aplicação.

Nesta aula, você usará a view como contrato de leitura, sem criar usuários ou grants.

---

### Views atualizaveis

Algumas views simples podem permitir `INSERT`, `UPDATE` ou `DELETE` diretamente.

Isso depende da definição.

Views com agregações, `GROUP BY`, joins complexos e outras características geralmente não são automaticamente atualizáveis.

O laboratório será somente leitura.

Não use a possibilidade de escrita por view como comportamento implícito do sistema.

Quando escrita por view for realmente necessária, ela precisa de regras e testes específicos.

---

### O que e uma materialized view

Materialized view é um objeto que armazena fisicamente o resultado de uma consulta.

Forma:

```sql
CREATE MATERIALIZED VIEW app.mv_exemplo AS
SELECT ...
FROM ...;
```

Depois:

```sql
SELECT *
FROM app.mv_exemplo;
```

A leitura usa os dados armazenados na materialized view.

Ela não recalcula automaticamente toda a consulta de origem a cada `SELECT`.

---

### Fotografia do resultado

Pense em uma materialized view como uma fotografia.

Momento inicial:

```text
consulta de origem possui quatro competências;
materialized view é criada;
quatro linhas são armazenadas.
```

Depois:

```text
uma quinta competência é inserida;
a materialized view continua com quatro linhas.
```

Após:

```sql
REFRESH MATERIALIZED VIEW app.mv_resumo_competencia;
```

a fotografia é refeita com os dados atuais.

---

### Dados desatualizados

A diferença entre origem e materialized view é chamada de defasagem ou staleness.

Antes de usar, responda:

```text
qual atraso é aceitável?

quem executa o refresh?

com qual frequência?

como falhas são detectadas?

qual horário de atualização?

a leitura pode usar dados antigos?

como o consumidor sabe a referência temporal?
```

Uma materialized view exige operação.

Criar o objeto sem planejar atualização produz dados silenciosamente desatualizados.

---

### REFRESH MATERIALIZED VIEW

Comando:

```sql
REFRESH MATERIALIZED VIEW app.mv_resumo_competencia;
```

O PostgreSQL executa novamente a consulta e substitui o conteúdo armazenado.

O refresh comum pode bloquear leituras concorrentes durante a atualização.

Existe:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY
```

Mas ele possui requisitos, incluindo um índice único adequado, e não será praticado antes da aula de índices.

Não use `CONCURRENTLY` apenas porque parece mais moderno.

---

### WITH DATA e WITH NO DATA

Ao criar:

```sql
CREATE MATERIALIZED VIEW ... AS
SELECT ...
WITH DATA;
```

o resultado é calculado e armazenado imediatamente.

`WITH DATA` é o comportamento padrão.

Também existe:

```sql
WITH NO DATA
```

Nesse caso, a definição é criada sem popular o conteúdo.

A materialized view não pode ser consultada normalmente até receber um refresh com dados.

Nesta aula, você usará `WITH DATA`.

---

### Indices em materialized views

Uma materialized view armazena linhas fisicamente e pode receber índices.

Isso pode melhorar consultas sobre o resultado materializado.

Mas o índice:

- ocupa espaço;
- precisa ser mantido durante refresh;
- precisa corresponder a consultas reais;
- não corrige uma granularidade errada;
- não deve ser criado por hábito.

Índices serão o tema da aula 291.

---

### Materialized view nao atualiza sozinha

PostgreSQL não agenda o refresh automaticamente apenas porque a materialized view existe.

O agendamento pode ser feito por:

- aplicação;
- scheduler externo;
- job de infraestrutura;
- extensão;
- processo operacional.

O mecanismo precisa ser monitorado.

Sem ele, a materialized view continua envelhecendo.

---

### CREATE OR REPLACE MATERIALIZED VIEW

PostgreSQL não oferece a mesma forma simples de:

```text
CREATE OR REPLACE MATERIALIZED VIEW
```

usada em views comuns.

Quando a definição precisa mudar, uma estratégia comum envolve:

- remover e recriar;
- criar nova versão;
- preservar disponibilidade;
- recriar índices;
- atualizar dependências;
- revisar permissões.

No laboratório, o script usará:

```sql
DROP MATERIALIZED VIEW IF EXISTS ...
```

antes da criação.

Isso é aceitável no ambiente educacional, mas precisa de cuidado em produção.

---

### View versus materialized view

#### View

```text
armazena definição;
resultado atual;
consulta origem durante leitura;
não precisa de refresh;
não armazena fotografia.
```

#### Materialized view

```text
armazena resultado;
pode estar desatualizada;
leitura usa dados materializados;
precisa de refresh;
pode receber índices.
```

A escolha depende do equilíbrio entre:

```text
atualidade;
custo de leitura;
custo de refresh;
espaço;
complexidade operacional.
```

---

### CTE versus view

#### CTE

```text
uma instrução;
não cria objeto;
bom para etapas locais;
fica junto da consulta.
```

#### View

```text
várias instruções;
objeto persistente;
bom para contrato reutilizável;
possui dependências e permissões.
```

Não transforme toda CTE em view.

Persistência deve ser justificada por reutilização, contrato ou segurança.

---

### View versus consulta duplicada

Duplicar uma consulta em vários serviços cria riscos:

- correções aplicadas apenas em um lugar;
- filtros divergentes;
- aliases diferentes;
- regras incompatíveis;
- relatórios com resultados distintos.

Uma view centraliza a definição.

Por outro lado, centralizar toda lógica no banco pode:

- aumentar acoplamento;
- esconder regras;
- dificultar versionamento entre serviços;
- criar dependências compartilhadas.

A decisão faz parte da arquitetura.

---

### Nomeacao

Convenção usada:

```text
vw_:
view.

mv_:
materialized view.
```

Exemplos:

```text
app.vw_resumo_ordem;

app.mv_resumo_competencia.
```

A convenção não é exigência do PostgreSQL.

Ela ajuda a reconhecer o tipo de objeto.

O nome precisa comunicar o conteúdo e a granularidade.

---

### Documentacao operacional

Para cada materialized view, registre:

- definição;
- granularidade;
- fontes;
- horário do refresh;
- duração esperada;
- tolerância a atraso;
- responsável;
- impacto de falha;
- índices;
- consumidores;
- mecanismo de observabilidade.

Para cada view, registre:

- contrato;
- colunas;
- granularidade;
- dependências;
- consumidores;
- política de alteração.

---

## Mao na massa guiada

### 1. Confirmar o PostgreSQL

Na raiz do repositório:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se necessário, inicie o Compose da aula 271.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-289-views-materialized-views-conceitual\sql"

Set-Location `
  "labs\m12\aula-289-views-materialized-views-conceitual"
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
    (SELECT count(*) FROM app.cliente WHERE id BETWEEN 930001 AND 930003)
        AS clientes,
    (SELECT count(*) FROM app.produto WHERE id BETWEEN 930001 AND 930003)
        AS produtos,
    (
        SELECT count(*)
        FROM app.ordem_servico
        WHERE id BETWEEN 930001 AND 930004
    ) AS ordens,
    (
        SELECT count(*)
        FROM app.atividade
        WHERE id BETWEEN 930001 AND 930006
    ) AS atividades,
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

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-289-views-materialized-views-conceitual\sql\00_verificar_dataset.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado esperado:

```text
3 | 3 | 4 | 6 | 4 | 6
```

---

### 4. Criar 01_criar_view_detalhe_competencia.sql

Crie:

```text
sql/01_criar_view_detalhe_competencia.sql
```

Conteúdo:

```sql
CREATE OR REPLACE VIEW app.vw_atividade_competencia_detalhe AS
SELECT
    ac.id AS associacao_id,
    a.id AS atividade_id,
    a.ordem_servico_id,
    a.codigo AS atividade_codigo,
    a.descricao AS atividade_descricao,
    a.status AS atividade_status,
    c.id AS competencia_id,
    c.codigo AS competencia_codigo,
    c.nome AS competencia_nome,
    ac.nivel_requerido,
    ac.obrigatoria,
    ac.observacao,
    ac.criado_em AS associacao_criada_em
FROM app.atividade_competencia AS ac
INNER JOIN app.atividade AS a
    ON a.id = ac.atividade_id
INNER JOIN app.competencia AS c
    ON c.id = ac.competencia_id;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-289-views-materialized-views-conceitual\sql\01_criar_view_detalhe_competencia.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Granularidade:

```text
uma linha por associação Atividade–Competência.
```

---

### 5. Criar 02_criar_view_resumo_ordem.sql

Crie:

```text
sql/02_criar_view_resumo_ordem.sql
```

Conteúdo:

```sql
CREATE OR REPLACE VIEW app.vw_resumo_ordem AS
WITH
atividades_por_ordem AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_atividades,
        sum(valor_mao_obra) AS valor_total_mao_obra,
        avg(valor_mao_obra) AS valor_medio_mao_obra
    FROM app.atividade
    GROUP BY ordem_servico_id
),
eventos_por_ordem AS (
    SELECT
        ordem_servico_id,
        count(*) AS quantidade_eventos
    FROM auditoria.evento_ordem_servico
    GROUP BY ordem_servico_id
)
SELECT
    os.id AS ordem_id,
    os.codigo AS ordem_codigo,
    os.status AS ordem_status,
    os.prioridade,
    os.data_agendada,
    os.valor_previsto,
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    p.id AS produto_id,
    p.codigo AS produto_codigo,
    p.nome AS produto_nome,
    apo.quantidade_atividades,
    apo.valor_total_mao_obra,
    apo.valor_medio_mao_obra,
    epo.quantidade_eventos
FROM app.ordem_servico AS os
INNER JOIN app.cliente AS c
    ON c.id = os.cliente_id
INNER JOIN app.produto AS p
    ON p.id = os.produto_id
LEFT JOIN atividades_por_ordem AS apo
    ON apo.ordem_servico_id = os.id
LEFT JOIN eventos_por_ordem AS epo
    ON epo.ordem_servico_id = os.id;
```

Granularidade:

```text
uma linha por Ordem de Serviço.
```

As relações muitos foram agregadas antes dos joins.

---

### 6. Criar 03_consultar_views.sql

Crie:

```text
sql/03_consultar_views.sql
```

Conteúdo:

```sql
SELECT
    associacao_id,
    atividade_codigo,
    competencia_codigo,
    competencia_nome,
    nivel_requerido,
    obrigatoria
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006
ORDER BY associacao_id;

SELECT
    ordem_id,
    ordem_codigo,
    ordem_status,
    cliente_nome,
    produto_nome,
    quantidade_atividades,
    valor_total_mao_obra,
    quantidade_eventos
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
ORDER BY ordem_id;

SELECT
    ordem_id,
    ordem_codigo,
    cliente_nome,
    valor_total_mao_obra
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004
  AND valor_total_mao_obra > 200
ORDER BY
    valor_total_mao_obra DESC,
    ordem_id;
```

A view pode receber filtros externos como qualquer origem de consulta.

---

### 7. Criar 04_criar_materialized_view.sql

Crie:

```text
sql/04_criar_materialized_view.sql
```

Conteúdo:

```sql
DROP MATERIALIZED VIEW IF EXISTS app.mv_resumo_competencia;

CREATE MATERIALIZED VIEW app.mv_resumo_competencia AS
SELECT
    c.id AS competencia_id,
    c.codigo AS competencia_codigo,
    c.nome AS competencia_nome,
    c.ativa,
    count(ac.id) AS quantidade_associacoes,
    count(ac.id) FILTER (
        WHERE ac.obrigatoria = true
    ) AS quantidade_obrigatorias,
    max(ac.criado_em) AS ultima_associacao_em
FROM app.competencia AS c
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = c.id
GROUP BY
    c.id,
    c.codigo,
    c.nome,
    c.ativa
WITH DATA;
```

A cláusula `FILTER` é usada apenas para produzir uma contagem condicional. Ela será explicada em mais profundidade junto de expressões e relatórios futuros.

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-289-views-materialized-views-conceitual\sql\04_criar_materialized_view.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Granularidade:

```text
uma linha por Competência.
```

---

### 8. Criar 05_comparar_view_e_materialized_view.sql

Crie:

```text
sql/05_comparar_view_e_materialized_view.sql
```

Conteúdo:

```sql
CREATE OR REPLACE VIEW app.vw_resumo_competencia AS
SELECT
    c.id AS competencia_id,
    c.codigo AS competencia_codigo,
    c.nome AS competencia_nome,
    c.ativa,
    count(ac.id) AS quantidade_associacoes,
    count(ac.id) FILTER (
        WHERE ac.obrigatoria = true
    ) AS quantidade_obrigatorias,
    max(ac.criado_em) AS ultima_associacao_em
FROM app.competencia AS c
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = c.id
GROUP BY
    c.id,
    c.codigo,
    c.nome,
    c.ativa;

SELECT
    'VIEW' AS origem,
    competencia_id,
    competencia_codigo,
    quantidade_associacoes,
    quantidade_obrigatorias
FROM app.vw_resumo_competencia
WHERE competencia_id BETWEEN 950001 AND 950004

UNION ALL

SELECT
    'MATERIALIZED_VIEW' AS origem,
    competencia_id,
    competencia_codigo,
    quantidade_associacoes,
    quantidade_obrigatorias
FROM app.mv_resumo_competencia
WHERE competencia_id BETWEEN 950001 AND 950004
ORDER BY
    competencia_id,
    origem;
```

Imediatamente após a criação e sem mudanças na origem, os resultados devem coincidir.

---

### 9. Criar 06_demonstrar_refresh_com_rollback.sql

Crie:

```text
sql/06_demonstrar_refresh_com_rollback.sql
```

Conteúdo:

```sql
BEGIN;

INSERT INTO app.competencia (
    id,
    codigo,
    nome,
    descricao
)
VALUES (
    959090,
    'TEMP_VIEW_REFRESH',
    'Competência temporária',
    'Criada somente para demonstrar refresh'
);

INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria,
    observacao
)
VALUES (
    959190,
    930001,
    959090,
    'BASICO',
    true,
    'Associação temporária da aula 289'
);

-- A view comum consulta a origem atual e encontra a nova competência.
SELECT
    'VIEW_ANTES_REFRESH' AS etapa,
    competencia_id,
    competencia_codigo,
    quantidade_associacoes
FROM app.vw_resumo_competencia
WHERE competencia_id = 959090;

-- A materialized view ainda contém a fotografia anterior.
SELECT
    'MV_ANTES_REFRESH' AS etapa,
    competencia_id,
    competencia_codigo,
    quantidade_associacoes
FROM app.mv_resumo_competencia
WHERE competencia_id = 959090;

REFRESH MATERIALIZED VIEW app.mv_resumo_competencia;

-- Depois do refresh, a materialized view passa a encontrar a linha.
SELECT
    'MV_DEPOIS_REFRESH' AS etapa,
    competencia_id,
    competencia_codigo,
    quantidade_associacoes
FROM app.mv_resumo_competencia
WHERE competencia_id = 959090;

ROLLBACK;

-- O rollback remove os dados temporários
-- e também desfaz o refresh executado dentro da transação.
SELECT
    'VIEW_DEPOIS_ROLLBACK' AS etapa,
    competencia_id,
    competencia_codigo
FROM app.vw_resumo_competencia
WHERE competencia_id = 959090;

SELECT
    'MV_DEPOIS_ROLLBACK' AS etapa,
    competencia_id,
    competencia_codigo
FROM app.mv_resumo_competencia
WHERE competencia_id = 959090;
```

Execute o arquivo completo:

```powershell
Get-Content -Raw `
  "labs\m12\aula-289-views-materialized-views-conceitual\sql\06_demonstrar_refresh_com_rollback.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Resultado conceitual:

```text
view antes do refresh:
encontra a competência temporária.

materialized view antes do refresh:
não encontra.

materialized view depois do refresh:
encontra.

depois do rollback:
nenhuma das duas encontra.
```

O dataset final permanece inalterado.

---

### 10. Criar 07_catalogo_e_dependencias.sql

Crie:

```text
sql/07_catalogo_e_dependencias.sql
```

Conteúdo:

```sql
SELECT
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE schemaname = 'app'
  AND viewname IN (
      'vw_atividade_competencia_detalhe',
      'vw_resumo_ordem',
      'vw_resumo_competencia'
  )
ORDER BY viewname;

SELECT
    schemaname,
    matviewname,
    ispopulated,
    definition
FROM pg_matviews
WHERE schemaname = 'app'
  AND matviewname = 'mv_resumo_competencia';

SELECT
    table_schema,
    table_name,
    column_name,
    ordinal_position,
    data_type
FROM information_schema.columns
WHERE table_schema = 'app'
  AND table_name IN (
      'vw_atividade_competencia_detalhe',
      'vw_resumo_ordem',
      'vw_resumo_competencia',
      'mv_resumo_competencia'
  )
ORDER BY
    table_name,
    ordinal_position;
```

As consultas mostram:

- definições;
- status de população da materialized view;
- contrato de colunas;
- tipos resultantes.

---

### 11. Criar 08_alteracoes_e_remocao_controlada.sql

Crie:

```text
sql/08_alteracoes_e_remocao_controlada.sql
```

Conteúdo:

```sql
-- Objeto descartável para praticar ciclo de vida.
CREATE OR REPLACE VIEW app.vw_aula_289_descartavel AS
SELECT
    id,
    codigo,
    status
FROM app.ordem_servico;

SELECT
    id,
    codigo,
    status
FROM app.vw_aula_289_descartavel
ORDER BY id;

ALTER VIEW app.vw_aula_289_descartavel
RENAME TO vw_aula_289_descartavel_renomeada;

SELECT
    id,
    codigo,
    status
FROM app.vw_aula_289_descartavel_renomeada
ORDER BY id;

DROP VIEW app.vw_aula_289_descartavel_renomeada;

-- Não execute:
-- DROP TABLE app.atividade CASCADE;
--
-- CASCADE poderia remover objetos dependentes.
```

O script pratica:

```text
criação;
consulta;
renomeação;
remoção.
```

Os objetos principais da aula permanecem.

---

### 12. Criar 09_criterios_de_decisao.sql

Crie:

```text
sql/09_criterios_de_decisao.sql
```

Conteúdo:

```sql
SELECT
    'CTE' AS recurso,
    'Uma instrução' AS escopo,
    'Não' AS objeto_catalogo,
    'Não' AS armazena_resultado,
    'Etapa local e legibilidade' AS uso_principal

UNION ALL

SELECT
    'VIEW',
    'Persistente',
    'Sim',
    'Não',
    'Contrato reutilizável de leitura'

UNION ALL

SELECT
    'MATERIALIZED VIEW',
    'Persistente',
    'Sim',
    'Sim',
    'Leitura de fotografia atualizada por refresh'

ORDER BY recurso;
```

O arquivo gera uma referência comparativa consultável.

No README, complemente com critérios operacionais.

---

### 13. Criar 10_exercicio.sql

Crie:

```text
sql/10_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Não remova as views principais.

Não altere o dataset.

---

### 14. Criar 11_validacao_final.sql

Crie:

```text
sql/11_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    count(*) AS linhas_view_resumo_ordem
FROM app.vw_resumo_ordem
WHERE ordem_id BETWEEN 930001 AND 930004;

SELECT
    count(*) AS linhas_view_detalhe
FROM app.vw_atividade_competencia_detalhe
WHERE associacao_id BETWEEN 951001 AND 951006;

SELECT
    count(*) AS linhas_view_competencia
FROM app.vw_resumo_competencia
WHERE competencia_id BETWEEN 950001 AND 950004;

SELECT
    count(*) AS linhas_materialized_view
FROM app.mv_resumo_competencia
WHERE competencia_id BETWEEN 950001 AND 950004;

SELECT
    (SELECT count(*) FROM app.competencia WHERE id = 959090)
        AS competencias_temporarias,
    (
        SELECT count(*)
        FROM app.atividade_competencia
        WHERE id = 959190
    ) AS associacoes_temporarias;

SELECT
    schemaname,
    viewname
FROM pg_views
WHERE schemaname = 'app'
  AND viewname IN (
      'vw_atividade_competencia_detalhe',
      'vw_resumo_ordem',
      'vw_resumo_competencia'
  )
ORDER BY viewname;

SELECT
    schemaname,
    matviewname,
    ispopulated
FROM pg_matviews
WHERE schemaname = 'app'
  AND matviewname = 'mv_resumo_competencia';
```

Resultados esperados:

```text
4 ordens na view de resumo;

6 associações na view de detalhe;

4 competências na view comum;

4 competências na materialized view;

zero dados temporários;

três views principais;

uma materialized view populada.
```

---

### 15. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 289 - Views e materialized views conceitual.

Objetivo:
criar contratos persistentes de leitura e comparar resultado dinâmico com fotografia materializada.

Views:
app.vw_atividade_competencia_detalhe;
app.vw_resumo_ordem;
app.vw_resumo_competencia.

Materialized view:
app.mv_resumo_competencia.

Granularidades:
uma linha por associação;
uma linha por ordem;
uma linha por competência.

Atualização:
view acompanha a origem;
materialized view exige REFRESH.

Dataset:
preservado por ROLLBACK na demonstração.

Próxima aula:
funções de data, texto, números e CASE WHEN.
```

Inclua a ordem de execução e os critérios de escolha.

---

## Entendendo o que foi feito

### As views criaram contratos persistentes

As consultas receberam nomes disponíveis para várias instruções.

Os consumidores não precisam repetir todos os joins e agrupamentos.

---

### A granularidade foi explicita

Você criou:

```text
uma linha por associação;

uma linha por ordem;

uma linha por competência.
```

Isso ajuda consumidores a interpretar contagens, paginação e joins.

---

### A view refletiu a origem atual

Durante a transação, a nova competência apareceu imediatamente na view comum.

Não houve refresh.

---

### A materialized view ficou desatualizada

Antes do refresh, o novo dado não estava na fotografia.

Depois do refresh, passou a aparecer.

O rollback preservou o dataset e restaurou o estado anterior.

---

### O catalogo tornou o contrato inspecionavel

Você consultou:

```text
pg_views;
pg_matviews;
information_schema.columns.
```

Assim, definição, população e colunas deixaram de ser conhecimento informal.

---

### Dependencias exigiram cuidado

Objetos de leitura dependem das tabelas e relações usadas.

Uma alteração física pode afetar vários consumidores.

Por isso, views e materialized views precisam de versionamento, revisão e estratégia de implantação.

---

## Erros comuns importantes

### View nao ficou mais rapida

View comum não armazena automaticamente o resultado.

O custo da consulta subjacente continua relevante.

---

### Materialized view mostra dado antigo

O refresh não foi executado depois da mudança da origem.

Revise a rotina operacional.

---

### DROP foi bloqueado

Existem objetos dependentes.

Inspecione as dependências em vez de aplicar `CASCADE` automaticamente.

---

### CREATE OR REPLACE falhou

A nova definição quebrou o contrato de colunas existente.

Planeje uma migração compatível ou nova versão.

---

### Consumidor recebeu linhas duplicadas

A granularidade mudou ou a view foi combinada com outro lado muitos.

Revise a chave lógica de cada linha.

---

## Comandos uteis

### Criar view

```sql
CREATE OR REPLACE VIEW schema.nome AS
SELECT ...;
```

### Criar materialized view

```sql
CREATE MATERIALIZED VIEW schema.nome AS
SELECT ...
WITH DATA;
```

### Atualizar materialized view

```sql
REFRESH MATERIALIZED VIEW schema.nome;
```

### Remover

```sql
DROP VIEW schema.nome;

DROP MATERIALIZED VIEW schema.nome;
```

### Consultar catalogo

```sql
SELECT *
FROM pg_views;

SELECT *
FROM pg_matviews;
```

---

## Exercicio guiado

No arquivo:

```text
sql/10_exercicio.sql
```

resolva as partes abaixo.

### Parte 1 - View de telefones

Crie:

```text
app.vw_cliente_telefone_detalhe.
```

Granularidade:

```text
uma linha por Telefone.
```

Colunas:

```text
telefone_id;
cliente_id;
cliente_nome;
numero;
tipo;
principal;
confirmado;
criado_em.
```

Use lista explícita.

---

### Parte 2 - View de resumo de Cliente

Crie:

```text
app.vw_resumo_cliente.
```

Granularidade:

```text
uma linha por Cliente.
```

Retorne:

```text
cliente_id;
cliente_nome;
quantidade de ordens;
quantidade de telefones;
quantidade de telefones confirmados.
```

Agregue Ordens e Telefones separadamente antes de combinar com Cliente.

Evite multiplicar:

```text
ordens × telefones.
```

---

### Parte 3 - Contrato de colunas

Consulte `information_schema.columns` para as duas views do exercício.

Registre:

- posição;
- nome;
- tipo resultante;
- nulabilidade observada;
- significado.

---

### Parte 4 - Materialized view de resumo de Cliente

Crie:

```text
app.mv_resumo_cliente.
```

Use a mesma definição lógica da view de resumo.

Consulte view e materialized view.

Confirme que os resultados iniciais coincidem.

---

### Parte 5 - Demonstrar defasagem

Dentro de uma transação:

1. insira um telefone temporário para um cliente existente;
2. consulte a view;
3. consulte a materialized view;
4. execute o refresh;
5. consulte novamente;
6. execute rollback;
7. confirme que o dado temporário desapareceu.

Use IDs reservados do exercício.

---

### Parte 6 - CTE ou View

Escolha três consultas das aulas 287 e 288.

Para cada uma, responda:

```text
deve continuar local?

merece virar view?

merece materialized view?

qual é a justificativa?
```

Considere:

- reutilização;
- atualidade;
- custo;
- operação;
- segurança;
- contrato;
- consumidores.

---

### Parte 7 - Mudanca de contrato

Imagine que `vw_resumo_ordem` precise renomear:

```text
valor_total_mao_obra
```

para:

```text
custo_total.
```

Descreva uma estratégia de migração sem quebrar consumidores de uma vez.

Não altere a view principal no laboratório.

---

### Parte 8 - Plano operacional

Para `mv_resumo_cliente`, documente:

- frequência de refresh;
- tolerância a atraso;
- responsável;
- falha de refresh;
- métrica de idade;
- impacto de leitura antiga;
- necessidade futura de índice;
- estratégia de recriação.

---

## Criterios de aceite

- o laboratório oficial da aula 289 existe;
- o arquivo e o H1 seguem a grade;
- o dataset anterior foi preservado;
- três views principais foram criadas;
- uma materialized view principal foi criada;
- listas de colunas são explícitas;
- a granularidade de cada objeto foi documentada;
- view foi diferenciada de tabela;
- view foi diferenciada de CTE;
- materialized view foi diferenciada de view;
- `CREATE OR REPLACE VIEW` foi praticado;
- `WITH DATA` foi compreendido;
- `REFRESH MATERIALIZED VIEW` foi executado;
- dados desatualizados foram demonstrados;
- a demonstração terminou com `ROLLBACK`;
- nenhum dado temporário permaneceu;
- definições foram consultadas em `pg_views`;
- materialized view foi consultada em `pg_matviews`;
- colunas foram consultadas em `information_schema`;
- dependências e risco de `CASCADE` foram discutidos;
- segurança foi tratada como estratégia, não promessa automática;
- nenhuma escrita por view foi praticada;
- `REFRESH ... CONCURRENTLY` não foi antecipado na prática;
- índices não foram antecipados;
- funções da aula 290 não foram aprofundadas;
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
  labs/m12/aula-289-views-materialized-views-conceitual
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): criar views e materialized views"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
contratos de leitura;
views;
materialized views;
refresh;
catálogo;
dependências;
documentação operacional.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou consultas em objetos reutilizáveis de leitura.

Aprendeu:

```text
view;
materialized view;
CREATE VIEW;
CREATE OR REPLACE VIEW;
CREATE MATERIALIZED VIEW;
WITH DATA;
REFRESH MATERIALIZED VIEW;
granularidade;
contrato de colunas;
dependências;
catálogo;
dados desatualizados;
rollback da demonstração.
```

As regras principais foram:

```text
view armazena a definição;

materialized view armazena o resultado;

view acompanha a origem durante a consulta;

materialized view exige refresh;

CTE existe apenas em uma instrução;

view persiste no catálogo;

materialized view exige operação e monitoramento;

SELECT explícito protege o contrato;

granularidade precisa ser estável;

CASCADE exige análise de impacto;

performance deve ser validada por plano.
```

A próxima aula será:

```text
290 - M12.20 - Funcoes de data texto numeros e case when
```

Nela, você vai estudar:

- funções de texto;
- concatenação;
- normalização de caixa;
- corte e substituição;
- comprimento;
- funções numéricas;
- arredondamento;
- valores absolutos;
- datas e timestamps;
- extração de partes;
- intervalos;
- data e hora atuais;
- `CASE WHEN`;
- classificação;
- colunas calculadas;
- aplicação em relatórios e views.

As views desta aula serão usadas como fontes de leitura para aplicar expressões e colunas calculadas.

---

# Material complementar

## Checkpoint final

- [ ] Criei e consultei views com granularidade definida.
- [ ] Criei, consultei e atualizei uma materialized view.
- [ ] Demonstrei defasagem e preservei o dataset com rollback.
- [ ] Consultei catálogo, documentei critérios e fiz o commit.

---

## Troubleshooting adicional

### Materialized view is not populated

Ela foi criada com `WITH NO DATA`.

Execute um refresh sem a opção `WITH NO DATA`.

### Cannot refresh materialized view concurrently

A materialized view não possui os requisitos necessários, como índice único adequado, ou não está populada.

A prática de índices será feita na aula 291.

### View depende de coluna removida

A alteração da tabela de origem entra em conflito com o objeto dependente.

Planeje a migração em ordem segura.

### View expose coluna indevida

A definição inclui uma coluna que não deveria fazer parte do contrato.

Use projeção explícita e revise permissões.

### Refresh demora

Meça a consulta de origem, volume, locks e plano.

Não adicione índice aleatoriamente antes da análise.

---

## Perguntas de revisao

1. O que uma view armazena?
2. O que uma materialized view armazena?
3. A view precisa de refresh?
4. A materialized view atualiza sozinha?
5. O que é granularidade?
6. Por que evitar `SELECT *`?
7. Qual a diferença entre CTE e view?
8. Qual a diferença entre view e materialized view?
9. O que `WITH DATA` faz?
10. O que `WITH NO DATA` faz?
11. Para que serve `REFRESH`?
12. O que significa dado desatualizado?
13. Por que materialized view exige operação?
14. Onde consultar views no catálogo?
15. Onde consultar materialized views?
16. O que uma dependência implica?
17. Qual o risco de `CASCADE`?
18. Quando uma consulta merece virar view?

---

## Roteiro de resposta

1. A definição da consulta.
2. O resultado físico da consulta.
3. Não.
4. Não; exige refresh.
5. O significado de cada linha.
6. Para controlar o contrato de colunas.
7. CTE dura uma instrução; view persiste.
8. A view calcula o resultado atual; a materialized view lê uma fotografia.
9. Popula durante a criação.
10. Cria sem popular.
11. Recalcula e substitui o conteúdo materializado.
12. Diferença entre a origem atual e a fotografia.
13. Precisa de agenda, monitoramento e tratamento de falha.
14. `pg_views`.
15. `pg_matviews`.
16. Objetos de origem não podem mudar livremente.
17. Remover objetos dependentes sem análise.
18. Quando há contrato ou reutilização estável.

---

## Desafio opcional

Crie conceitualmente uma materialized view para um dashboard operacional:

```text
fila;
quantidade de ordens;
ordem mais antiga;
ordem mais recente;
valor total;
quantidade de atividades pendentes;
momento de referência.
```

Documente:

- fontes;
- granularidade;
- frequência de refresh;
- atraso aceitável;
- índices candidatos;
- consumidores;
- risco de bloqueio;
- comportamento em falha;
- estratégia de versão.

Não implemente índices nem scheduler.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 289 - M12.19 - Views e materialized views conceitual

- Diferenciei CTE, view, tabela e materialized view.
- Entendi que view armazena a definição da consulta.
- Entendi que materialized view armazena uma fotografia do resultado.
- Criei views com contratos de colunas explícitos.
- Documentei a granularidade de cada objeto de leitura.
- Criei uma view de detalhe e uma view de resumo.
- Criei uma materialized view de resumo por competência.
- Comparei view comum e materialized view.
- Demonstrei dados desatualizados antes do refresh.
- Executei `REFRESH MATERIALIZED VIEW`.
- Usei `ROLLBACK` para preservar o dataset.
- Consultei `pg_views`, `pg_matviews` e `information_schema.columns`.
- Analisei dependências, segurança e risco de `CASCADE`.
- Registrei critérios operacionais para refresh.
- Próxima aula: funções de data, texto, números e `CASE WHEN`.
```

---

## Referencia tecnica curta

```text
VIEW:
definição persistente de consulta.

MATERIALIZED VIEW:
resultado persistido.

CTE:
resultado nomeado de uma instrução.

CREATE OR REPLACE VIEW:
atualiza definição compatível.

WITH DATA:
popula ao criar.

WITH NO DATA:
cria sem conteúdo consultável.

REFRESH:
recalcula o resultado materializado.

pg_views:
catálogo de views.

pg_matviews:
catálogo de materialized views.
```

Regra final:

```text
use view para um contrato dinamico de leitura e materialized view apenas quando uma fotografia atualizada por processo operacional fizer sentido.
```
