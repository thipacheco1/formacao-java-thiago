# 285 - M12.15 - Relacionamento muitos para muitos com tabela associativa

## Apresentacao da aula

Na aula 284, você implementou um relacionamento um-para-muitos completo:

```text
Cliente 1:N Telefone do Cliente.
```

A foreign key foi colocada no lado muitos, o banco impediu filhos órfãos, a remoção do pai foi protegida e as consultas mostraram como uma linha do lado um aparece uma vez para cada filho relacionado.

Agora você vai trabalhar com um relacionamento que não pode ser representado por uma única foreign key em apenas um dos lados:

```text
muitos para muitos;
N:N;
many-to-many.
```

O exemplo será:

```text
Atividade N:N Competência.
```

As regras iniciais serão:

```text
uma Atividade pode exigir várias Competências;

uma Competência pode ser exigida por várias Atividades.
```

Exemplos:

```text
a atividade Diagnóstico pode exigir Refrigeração e Elétrica;

a competência Refrigeração pode ser exigida por Diagnóstico,
Manutenção e Vistoria.
```

Uma coluna `competencia_id` dentro de `ATIVIDADE` permitiria apenas uma competência por atividade.

Uma coluna `atividade_id` dentro de `COMPETENCIA` permitiria apenas uma atividade por competência.

Uma lista de IDs em texto ou JSON esconderia as referências do modelo relacional e dificultaria integridade, consulta e atualização.

A solução será uma tabela associativa:

```text
ATIVIDADE_COMPETENCIA.
```

Ela possuirá duas foreign keys:

```text
atividade_id;
competencia_id.
```

Cada linha representará um fato do relacionamento:

```text
determinada Atividade exige determinada Competência.
```

A associação também terá atributos próprios:

```text
nivel_requerido;
obrigatoria;
observacao;
criado_em.
```

Esses dados não descrevem somente Atividade nem somente Competência. Eles descrevem a relação entre as duas.

Nesta aula, você vai:

- criar a entidade `COMPETENCIA`;
- criar a tabela associativa `ATIVIDADE_COMPETENCIA`;
- transformar N:N em dois relacionamentos 1:N;
- comparar chave composta e chave substituta;
- impedir associações duplicadas;
- inserir dados respeitando as duas foreign keys;
- consultar nos dois sentidos;
- preservar entidades sem associações;
- atualizar atributos do relacionamento;
- remover somente a associação;
- bloquear remoções que violariam integridade;
- manter um dataset preparado para agregações na aula 286.

Ainda não vamos estudar `GROUP BY`, `HAVING`, `COUNT`, `SUM`, `AVG`, `MIN` ou `MAX` em profundidade. Esses recursos pertencem à próxima aula.

Ao final, você deverá conseguir explicar por que uma tabela associativa não é apenas um detalhe técnico, mas a representação explícita de um fato do domínio.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
282:
modelagem lógica, cardinalidade e chaves.

283:
normalização até terceira forma normal.

284:
relacionamento um para muitos.

285:
relacionamento muitos para muitos com tabela associativa.

286:
GROUP BY, HAVING e agregações.

287:
subqueries.
```

Na aula 282, você modelou conceitualmente:

```text
ATIVIDADE_COMPETENCIA (
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria
)
```

Na aula 283, você verificou que atributos como `competencia_nome` não deveriam ser copiados para dentro da associação, pois pertencem à entidade Competência.

Agora o modelo será implementado fisicamente no PostgreSQL.

A progressão é:

```text
Conceitual:
Atividade exige Competência.

Lógico:
N:N representado por entidade associativa.

Físico:
duas tabelas principais conectadas por uma tabela associativa.

Consulta:
joins atravessam a associação para reunir os dois lados.
```

O relacionamento muitos-para-muitos será construído sobre as atividades já existentes no dataset da aula 277.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa
```

Estrutura final:

```text
labs
└── m12
    └── aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa
        ├── README.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_criar_competencia.sql
            ├── 02_criar_atividade_competencia.sql
            ├── 03_limpar_dataset.sql
            ├── 04_inserir_competencias.sql
            ├── 05_inserir_associacoes.sql
            ├── 06_consultar_atividade_para_competencia.sql
            ├── 07_consultar_competencia_para_atividade.sql
            ├── 08_atualizar_atributos_associacao.sql
            ├── 09_erros_controlados.sql
            ├── 10_remover_associacao.sql
            ├── 11_validacao_final.sql
            └── 12_exercicio.sql
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

O dataset existente inclui as atividades:

```text
930001 a 930006.
```

As competências principais usarão IDs:

```text
950001 a 950099.
```

As associações principais usarão IDs:

```text
951001 a 951099.
```

O fluxo será:

1. confirmar atividades existentes;
2. criar a entidade Competência;
3. criar a tabela associativa;
4. limpar apenas o dataset reservado;
5. inserir competências;
6. inserir associações;
7. consultar Atividade para Competência;
8. consultar Competência para Atividade;
9. atualizar atributos da associação;
10. provocar violações controladas;
11. remover uma associação sem remover as entidades;
12. validar o dataset final;
13. concluir o exercício;
14. fazer o commit.

---

## Conceito essencial

### O que significa N:N

Um relacionamento muitos-para-muitos permite várias ocorrências dos dois lados.

No exemplo:

```text
uma Atividade pode exigir várias Competências;

uma Competência pode participar de várias Atividades.
```

Representação conceitual:

```text
ATIVIDADE N -------- N COMPETENCIA
```

A cardinalidade mínima também importa.

Nesta aula:

```text
Atividade:
pode existir sem Competência cadastrada.

Competência:
pode existir sem estar associada a Atividade.
```

Representação:

```text
ATIVIDADE 0..N -------- 0..N COMPETENCIA
```

O relacionamento é opcional nos dois lados.

---

### Por que uma foreign key simples nao resolve

Considere colocar em `ATIVIDADE`:

```text
competencia_id.
```

Cada atividade poderia referenciar apenas uma competência por coluna.

Para permitir várias, alguém poderia criar:

```text
competencia_1_id;
competencia_2_id;
competencia_3_id.
```

Essa solução possui problemas:

- quantidade limitada;
- grupos repetitivos;
- colunas vazias;
- alteração estrutural para adicionar mais competências;
- consultas difíceis;
- violação de normalização.

Outra tentativa seria:

```text
competencias = "950001,950002,950003".
```

Isso transforma referências em texto e impede a foreign key de proteger cada valor.

A solução relacional é criar uma linha por associação.

---

### Tabela associativa

A tabela associativa representa o relacionamento.

Estrutura lógica:

```text
ATIVIDADE_COMPETENCIA (
    atividade_id,
    competencia_id
)
```

Cada linha significa:

```text
Atividade X exige Competência Y.
```

O relacionamento N:N passa a ser representado por dois relacionamentos 1:N:

```text
ATIVIDADE 1:N ATIVIDADE_COMPETENCIA;

COMPETENCIA 1:N ATIVIDADE_COMPETENCIA.
```

A tabela associativa está no lado muitos em relação às duas entidades principais.

---

### Duas foreign keys

A associação precisa apontar para ambos os lados:

```text
atividade_id
    -> ATIVIDADE.id;

competencia_id
    -> COMPETENCIA.id.
```

As duas colunas serão `NOT NULL`.

Isso significa:

```text
uma associação precisa possuir uma Atividade válida;

uma associação precisa possuir uma Competência válida.
```

Não existe associação incompleta.

---

### Identidade da associacao

Existem duas estratégias comuns.

#### Chave composta

```text
PK:
atividade_id + competencia_id.
```

Vantagens:

- a própria combinação identifica o fato;
- impede duplicidade naturalmente;
- não exige ID adicional.

Custos:

- referências à associação precisam carregar duas colunas;
- FKs dependentes podem ficar maiores;
- algumas ferramentas trabalham melhor com chave simples;
- histórico de versões da associação pode exigir outra identidade.

#### Chave substituta

```text
PK:
atividade_competencia_id.

AK:
atividade_id + competencia_id.
```

Vantagens:

- identidade simples;
- associação pode ser referenciada diretamente;
- evolução com histórico pode ficar mais simples.

Custos:

- exige unique composta adicional;
- um ID artificial não impede duplicidade sozinho;
- pode esconder que o fato de negócio é a combinação.

Nesta aula, implementaremos:

```text
id como PK substituta;

UNIQUE (atividade_id, competencia_id)
como chave de negócio da associação.
```

As duas decisões serão visíveis.

---

### Associacao duplicada

Sem unique composta, estas linhas poderiam coexistir:

```text
atividade 930001 + competência 950001;

atividade 930001 + competência 950001.
```

O banco teria duas cópias do mesmo fato.

A constraint:

```sql
UNIQUE (atividade_id, competencia_id)
```

impede essa repetição.

Ela não impede:

```text
atividade 930001 + competência 950002;

atividade 930002 + competência 950001.
```

Essas são associações diferentes e legítimas.

---

### Atributos do relacionamento

Considere:

```text
nivel_requerido.
```

O nível não pertence somente à Competência.

A mesma Competência pode ser:

```text
AVANCADO para Manutenção;

BASICO para Vistoria.
```

Também não pertence somente à Atividade, porque uma atividade pode exigir competências em níveis diferentes.

Portanto:

```text
nivel_requerido
```

pertence à associação.

O mesmo vale para:

```text
obrigatoria;
observacao;
criado_em.
```

Uma tabela associativa com atributos próprios representa uma entidade associativa rica.

---

### Entidade associativa rica

Uma associação simples contém apenas as FKs.

Uma associação rica possui comportamento ou atributos relevantes.

Exemplo:

```text
ATIVIDADE_COMPETENCIA (
    id,
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria,
    observacao,
    criado_em
)
```

Ela pode evoluir para incluir:

```text
validade;
origem da exigência;
usuário que cadastrou;
nível mínimo;
certificação exigida;
data de remoção.
```

Quando o relacionamento possui ciclo de vida próprio, a PK substituta pode ganhar mais valor.

---

### Ordem de insercao

As entidades principais precisam existir antes da associação.

Fluxo:

```text
primeiro:
ATIVIDADE e COMPETENCIA.

depois:
ATIVIDADE_COMPETENCIA.
```

As atividades já existem.

Você criará as competências antes das associações.

A foreign key rejeitará:

- atividade inexistente;
- competência inexistente;
- valor nulo.

---

### Ordem de exclusao

Com `ON DELETE RESTRICT` nas duas FKs:

```text
uma Atividade associada não pode ser removida;

uma Competência associada não pode ser removida.
```

Para remover uma das entidades:

```text
primeiro:
remova as associações correspondentes.

depois:
remova a entidade, caso a regra permita.
```

Remover uma associação não remove automaticamente Atividade nem Competência.

Esse é um comportamento essencial.

---

### Remover o relacionamento sem remover as entidades

Considere:

```text
a Atividade não exige mais determinada Competência.
```

A operação correta pode ser:

```sql
DELETE FROM app.atividade_competencia
WHERE atividade_id = 930001
  AND competencia_id = 950002;
```

A Atividade continua existindo.

A Competência continua existindo.

Apenas o vínculo é removido.

---

### Atualizar atributos da associacao

Se o nível exigido mudar:

```sql
UPDATE app.atividade_competencia
SET nivel_requerido = 'AVANCADO'
WHERE atividade_id = 930001
  AND competencia_id = 950001;
```

Você está alterando o relacionamento, não a definição geral da Competência.

A competência `REFRIGERACAO` continua sendo a mesma.

---

### Consultar de Atividade para Competencia

A consulta atravessa a associação:

```text
ATIVIDADE
-> ATIVIDADE_COMPETENCIA
-> COMPETENCIA.
```

Exemplo:

```sql
SELECT
    a.codigo,
    c.nome,
    ac.nivel_requerido
FROM app.atividade AS a
INNER JOIN app.atividade_competencia AS ac
    ON ac.atividade_id = a.id
INNER JOIN app.competencia AS c
    ON c.id = ac.competencia_id;
```

O resultado possui uma linha por associação.

---

### Consultar de Competencia para Atividade

O mesmo relacionamento pode ser percorrido no sentido inverso:

```text
COMPETENCIA
-> ATIVIDADE_COMPETENCIA
-> ATIVIDADE.
```

A tabela associativa não possui direção fixa.

O sentido vem da pergunta da consulta.

---

### Preservar entidades sem associacao

Para listar todas as Competências, inclusive as não usadas:

```sql
FROM app.competencia AS c
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = c.id
LEFT JOIN app.atividade AS a
    ON a.id = ac.atividade_id
```

Uma competência sem associação aparece com colunas de `ac` e `a` em `NULL`.

O mesmo raciocínio pode preservar atividades sem competência.

---

### Multiplicidade no resultado

Se uma Atividade possui três Competências, ela aparece em três linhas.

Se uma Competência participa de quatro Atividades, ela aparece em quatro linhas.

Essa multiplicidade representa as associações.

Ao combinar outros relacionamentos um-para-muitos na mesma consulta, o número de linhas pode aumentar ainda mais.

Preveja a cardinalidade antes de interpretar o resultado.

---

### N:N e normalizacao

A tabela associativa resolve um relacionamento multivalorado sem:

- listas;
- colunas repetidas;
- duplicação de atributos das entidades;
- valores separados por vírgula;
- dependência parcial escondida.

Ela materializa a decisão das aulas 282 e 283.

---

### N:N nao significa sempre associacao simples

Considere:

```text
Técnico participa de Atividade.
```

Se houver:

- momento de atribuição;
- papel;
- principal;
- remoção;
- motivo;

a associação precisa representar histórico e regras próprias.

Uma foreign key direta em Atividade pode não ser suficiente.

A modelagem depende da pergunta e do ciclo de vida.

---

### Regra de dominio e tabela associativa

A tabela associativa não deve ser criada apenas porque duas listas aparecem na mesma tela.

Confirme:

```text
uma ocorrência de A pode relacionar-se com várias de B?

uma ocorrência de B pode relacionar-se com várias de A?

a associação possui significado?

a combinação precisa ser protegida?

existem atributos do vínculo?
```

Se as respostas indicam N:N, a tabela associativa é adequada.

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
  -Path "labs\m12\aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa\sql"

Set-Location `
  "labs\m12\aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa"
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
    ordem_servico_id,
    codigo,
    descricao,
    status
FROM app.atividade
WHERE id BETWEEN 930001 AND 930006
ORDER BY id;

SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint AS con
WHERE con.conrelid = 'app.atividade'::regclass
ORDER BY con.contype, con.conname;
```

Execute pela raiz:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa\sql\00_verificar_pre_requisitos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Confirme as seis atividades do dataset.

---

### 4. Criar 01_criar_competencia.sql

Crie:

```text
sql/01_criar_competencia.sql
```

Conteúdo:

```sql
CREATE TABLE app.competencia (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo text NOT NULL,
    nome text NOT NULL,
    descricao text,
    ativa boolean NOT NULL DEFAULT true,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_competencia
        PRIMARY KEY (id),

    CONSTRAINT uq_competencia_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_competencia_codigo_nao_vazio
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_competencia_nome_nao_vazio
        CHECK (btrim(nome) <> '')
);
```

Execute uma vez:

```powershell
Get-Content -Raw `
  "labs\m12\aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa\sql\01_criar_competencia.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

---

### 5. Criar 02_criar_atividade_competencia.sql

Crie:

```text
sql/02_criar_atividade_competencia.sql
```

Conteúdo:

```sql
CREATE TABLE app.atividade_competencia (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    atividade_id bigint NOT NULL,
    competencia_id bigint NOT NULL,
    nivel_requerido text NOT NULL DEFAULT 'BASICO',
    obrigatoria boolean NOT NULL DEFAULT true,
    observacao text,
    criado_em timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_atividade_competencia
        PRIMARY KEY (id),

    CONSTRAINT fk_atividade_competencia_atividade
        FOREIGN KEY (atividade_id)
        REFERENCES app.atividade (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT fk_atividade_competencia_competencia
        FOREIGN KEY (competencia_id)
        REFERENCES app.competencia (id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT uq_atividade_competencia
        UNIQUE (atividade_id, competencia_id),

    CONSTRAINT ck_atividade_competencia_nivel
        CHECK (
            nivel_requerido IN (
                'BASICO',
                'INTERMEDIARIO',
                'AVANCADO'
            )
        ),

    CONSTRAINT ck_atividade_competencia_observacao
        CHECK (
            observacao IS NULL
            OR btrim(observacao) <> ''
        )
);
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa\sql\02_criar_atividade_competencia.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Inspecione:

```powershell
docker exec formacao-postgres-m12 `
  psql -U formacao -d formacao_java `
  -c "\d app.atividade_competencia"
```

Identifique as duas FKs e a unique composta.

---

### 6. Criar 03_limpar_dataset.sql

Crie:

```text
sql/03_limpar_dataset.sql
```

Conteúdo:

```sql
DELETE FROM app.atividade_competencia
WHERE id BETWEEN 951001 AND 951099
RETURNING
    id,
    atividade_id,
    competencia_id;

DELETE FROM app.competencia
WHERE id BETWEEN 950001 AND 950099
RETURNING
    id,
    codigo;
```

Execute antes dos inserts.

A ordem é:

```text
associações;
competências.
```

---

### 7. Criar 04_inserir_competencias.sql

Crie:

```text
sql/04_inserir_competencias.sql
```

Conteúdo:

```sql
INSERT INTO app.competencia (
    id,
    codigo,
    nome,
    descricao
)
VALUES
    (
        950001,
        'REFRIGERACAO',
        'Refrigeração',
        'Diagnóstico e manutenção de sistemas de refrigeração'
    ),
    (
        950002,
        'ELETRICA',
        'Elétrica',
        'Leitura e intervenção em componentes elétricos'
    ),
    (
        950003,
        'SEGURANCA',
        'Segurança operacional',
        'Execução segura e prevenção de riscos'
    ),
    (
        950004,
        'ATENDIMENTO',
        'Atendimento ao cliente',
        'Comunicação durante o atendimento'
    )
RETURNING
    id,
    codigo,
    nome,
    ativa,
    criado_em;
```

Execute e preserve as quatro competências.

A competência `ATENDIMENTO` ficará inicialmente sem associação para demonstrar opcionalidade.

---

### 8. Criar 05_inserir_associacoes.sql

Crie:

```text
sql/05_inserir_associacoes.sql
```

Conteúdo:

```sql
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria,
    observacao
)
VALUES
    (
        951001,
        930001,
        950001,
        'AVANCADO',
        true,
        'Necessária para diagnóstico do sistema'
    ),
    (
        951002,
        930001,
        950002,
        'BASICO',
        false,
        'Apoio para medições elétricas'
    ),
    (
        951003,
        930002,
        950001,
        'AVANCADO',
        true,
        'Competência central da manutenção'
    ),
    (
        951004,
        930002,
        950003,
        'INTERMEDIARIO',
        true,
        'Aplicação de procedimentos seguros'
    ),
    (
        951005,
        930003,
        950003,
        'INTERMEDIARIO',
        true,
        'Vistoria exige análise de riscos'
    ),
    (
        951006,
        930005,
        950001,
        'INTERMEDIARIO',
        true,
        'Diagnóstico inicial do vazamento'
    )
RETURNING
    id,
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa\sql\05_inserir_associacoes.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

Estado inicial:

```text
Atividade 930001:
2 competências.

Atividade 930002:
2 competências.

Atividade 930003:
1 competência.

Atividade 930005:
1 competência.

Competência 950001:
3 atividades.

Competência 950002:
1 atividade.

Competência 950003:
2 atividades.

Competência 950004:
0 atividades.
```

---

### 9. Criar 06_consultar_atividade_para_competencia.sql

Crie:

```text
sql/06_consultar_atividade_para_competencia.sql
```

Conteúdo:

```sql
SELECT
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    a.descricao AS atividade_descricao,
    c.id AS competencia_id,
    c.codigo AS competencia_codigo,
    c.nome AS competencia_nome,
    ac.nivel_requerido,
    ac.obrigatoria
FROM app.atividade AS a
LEFT JOIN app.atividade_competencia AS ac
    ON ac.atividade_id = a.id
   AND ac.id BETWEEN 951001 AND 951099
LEFT JOIN app.competencia AS c
    ON c.id = ac.competencia_id
WHERE a.id BETWEEN 930001 AND 930006
ORDER BY
    a.id,
    c.id;
```

Execute.

As atividades sem competência devem permanecer por causa do `LEFT JOIN`.

---

### 10. Criar 07_consultar_competencia_para_atividade.sql

Crie:

```text
sql/07_consultar_competencia_para_atividade.sql
```

Conteúdo:

```sql
SELECT
    c.id AS competencia_id,
    c.codigo AS competencia_codigo,
    c.nome AS competencia_nome,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    ac.nivel_requerido,
    ac.obrigatoria
FROM app.competencia AS c
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = c.id
   AND ac.id BETWEEN 951001 AND 951099
LEFT JOIN app.atividade AS a
    ON a.id = ac.atividade_id
WHERE c.id BETWEEN 950001 AND 950099
ORDER BY
    c.id,
    a.id;
```

Execute.

`ATENDIMENTO` deve aparecer sem atividade.

---

### 11. Criar 08_atualizar_atributos_associacao.sql

Crie:

```text
sql/08_atualizar_atributos_associacao.sql
```

Conteúdo:

```sql
SELECT
    ac.id,
    a.codigo AS atividade,
    c.codigo AS competencia,
    ac.nivel_requerido,
    ac.obrigatoria,
    ac.observacao
FROM app.atividade_competencia AS ac
INNER JOIN app.atividade AS a
    ON a.id = ac.atividade_id
INNER JOIN app.competencia AS c
    ON c.id = ac.competencia_id
WHERE ac.id = 951002;

UPDATE app.atividade_competencia
SET
    nivel_requerido = 'INTERMEDIARIO',
    obrigatoria = true,
    observacao = 'Medições elétricas agora são obrigatórias'
WHERE id = 951002
RETURNING
    id,
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria,
    observacao;
```

A atualização afeta a associação entre:

```text
Atividade 930001;
Competência 950002.
```

Ela não altera a definição geral da competência Elétrica.

---

### 12. Criar 09_erros_controlados.sql

Crie:

```text
sql/09_erros_controlados.sql
```

Conteúdo:

```sql
-- Execute cada instrução separadamente.
-- Todas devem falhar.

-- Atividade inexistente.
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id
)
VALUES (
    951090,
    999999,
    950001
);

-- Competência inexistente.
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id
)
VALUES (
    951091,
    930001,
    999999
);

-- Associação duplicada.
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id
)
VALUES (
    951092,
    930001,
    950001
);

-- Nível inválido.
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id,
    nivel_requerido
)
VALUES (
    951093,
    930004,
    950002,
    'ESPECIALISTA'
);

-- Atividade nula.
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id
)
VALUES (
    951094,
    NULL,
    950001
);

-- Remoção de competência associada.
DELETE FROM app.competencia
WHERE id = 950001;

-- Remoção de atividade associada.
DELETE FROM app.atividade
WHERE id = 930001;
```

Leia as mensagens e identifique:

```text
fk_atividade_competencia_atividade;
fk_atividade_competencia_competencia;
uq_atividade_competencia;
ck_atividade_competencia_nivel;
NOT NULL.
```

---

### 13. Criar 10_remover_associacao.sql

Crie:

```text
sql/10_remover_associacao.sql
```

Conteúdo:

```sql
INSERT INTO app.atividade_competencia (
    id,
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria
)
VALUES (
    951010,
    930004,
    950002,
    'BASICO',
    false
)
RETURNING
    id,
    atividade_id,
    competencia_id;

DELETE FROM app.atividade_competencia
WHERE id = 951010
RETURNING
    id,
    atividade_id,
    competencia_id;

SELECT
    id,
    codigo,
    descricao
FROM app.atividade
WHERE id = 930004;

SELECT
    id,
    codigo,
    nome
FROM app.competencia
WHERE id = 950002;
```

A associação é removida.

Atividade e Competência continuam existindo.

---

### 14. Criar 11_validacao_final.sql

Crie:

```text
sql/11_validacao_final.sql
```

Conteúdo:

```sql
SELECT
    ac.id AS associacao_id,
    a.id AS atividade_id,
    a.codigo AS atividade_codigo,
    c.id AS competencia_id,
    c.codigo AS competencia_codigo,
    ac.nivel_requerido,
    ac.obrigatoria
FROM app.atividade_competencia AS ac
INNER JOIN app.atividade AS a
    ON a.id = ac.atividade_id
INNER JOIN app.competencia AS c
    ON c.id = ac.competencia_id
WHERE ac.id BETWEEN 951001 AND 951099
ORDER BY ac.id;

SELECT
    c.id,
    c.codigo,
    c.nome,
    ac.id AS associacao_id
FROM app.competencia AS c
LEFT JOIN app.atividade_competencia AS ac
    ON ac.competencia_id = c.id
   AND ac.id BETWEEN 951001 AND 951099
WHERE c.id BETWEEN 950001 AND 950099
ORDER BY c.id, ac.id;

SELECT
    ac.id,
    ac.atividade_id,
    ac.competencia_id
FROM app.atividade_competencia AS ac
LEFT JOIN app.atividade AS a
    ON a.id = ac.atividade_id
LEFT JOIN app.competencia AS c
    ON c.id = ac.competencia_id
WHERE ac.id BETWEEN 951001 AND 951099
  AND (
      a.id IS NULL
      OR c.id IS NULL
  )
ORDER BY ac.id;
```

Resultado esperado:

```text
seis associações principais;

quatro competências;

competência ATENDIMENTO sem associação;

nenhuma associação órfã.
```

Esses dados serão preservados para a aula 286.

---

### 15. Criar 12_exercicio.sql

Crie:

```text
sql/12_exercicio.sql
```

Implemente as tarefas da seção de exercício guiado.

Use IDs:

```text
competências:
950010 em diante.

associações:
951020 em diante.
```

---

### 16. Criar README.md

Registre:

```text
Título:
Aula 285 - Relacionamento muitos para muitos com tabela associativa.

Entidades:
Atividade e Competência.

Tabela associativa:
app.atividade_competencia.

PK:
id substituto.

Chave de negócio:
atividade_id + competencia_id.

Atributos da associação:
nivel_requerido, obrigatoria, observacao e criado_em.

Remoção:
RESTRICT nas duas foreign keys.

Dataset preservado:
quatro competências e seis associações principais.

Próxima aula:
GROUP BY, HAVING e agregações.
```

Liste a ordem de execução dos scripts.

---

## Entendendo o que foi feito

### N para N virou dois relacionamentos 1 para N

A tabela associativa ficou no lado muitos em relação a Atividade e Competência.

Cada associação aponta para exatamente uma ocorrência de cada lado.

---

### A combinacao foi protegida

A PK substituta identificou a linha da associação.

A unique composta impediu duplicar o mesmo vínculo de negócio.

---

### A associacao armazenou fatos proprios

Nível, obrigatoriedade e observação pertencem ao vínculo.

A mesma competência pôde possuir níveis diferentes em atividades diferentes.

---

### As consultas percorreram os dois sentidos

Você listou competências por atividade e atividades por competência.

Também preservou entidades sem associação usando `LEFT JOIN`.

---

### Remover a associacao nao removeu os lados

A exclusão do vínculo manteve Atividade e Competência.

Esse comportamento diferencia:

```text
remover relacionamento;
remover entidade.
```

---

### Integridade protegeu os dois lados

A tabela associativa não aceitou atividade inexistente, competência inexistente, referência nula ou associação duplicada.

As entidades associadas não puderam ser removidas antes do vínculo.

---

## Erros comuns importantes

### Colocar lista de IDs em uma coluna

A lista impede foreign keys individuais e dificulta consulta.

Crie uma linha por associação.

---

### Criar somente uma foreign key

Uma tabela associativa N:N precisa conectar os dois lados.

Sem uma das FKs, o vínculo fica incompleto.

---

### PK substituta sem unique composta

O banco aceita duas linhas com a mesma atividade e competência.

Proteja a chave de negócio do relacionamento.

---

### Duplicar nome da Competencia na associacao

O nome depende de `competencia_id` e pertence à entidade Competência.

Use join.

---

### Remover entidade associada

`RESTRICT` bloqueia enquanto existirem vínculos.

Remova primeiro a associação, se a regra permitir.

---

## Comandos uteis

### Associacao com duas FKs

```sql
FOREIGN KEY (atividade_id)
REFERENCES app.atividade (id)

FOREIGN KEY (competencia_id)
REFERENCES app.competencia (id)
```

### Impedir duplicidade

```sql
UNIQUE (atividade_id, competencia_id)
```

### Percorrer o relacionamento

```sql
FROM app.atividade AS a
JOIN app.atividade_competencia AS ac
    ON ac.atividade_id = a.id
JOIN app.competencia AS c
    ON c.id = ac.competencia_id
```

### Remover somente o vinculo

```sql
DELETE FROM app.atividade_competencia
WHERE atividade_id = ...
  AND competencia_id = ...;
```

---

## Exercicio guiado

No arquivo:

```text
sql/12_exercicio.sql
```

resolva as tarefas.

### Parte 1 - Nova Competencia

Insira:

```text
id:
950010.

codigo:
MECANICA.

nome:
Mecânica.

descricao:
Análise e reparo de componentes mecânicos.
```

Use `RETURNING`.

---

### Parte 2 - Associar a duas Atividades

Associe a nova competência às atividades:

```text
930002;
930006.
```

Use:

```text
ids:
951020 e 951021.

níveis:
AVANCADO e INTERMEDIARIO.

obrigatória:
true em ambas.
```

Use `RETURNING`.

---

### Parte 3 - Duplicidade

Tente associar novamente:

```text
atividade 930002;
competência 950010.
```

A unique composta deve rejeitar.

Mantenha o comando comentado depois do teste.

---

### Parte 4 - Consultar nos dois sentidos

Crie:

1. uma consulta que parte de Atividade e chega a Competência;
2. uma consulta que parte de Competência e chega a Atividade;
3. uma consulta que preserva competências sem atividade;
4. uma consulta que preserva atividades sem competência.

Ordene com critérios estáveis.

---

### Parte 5 - Atualizar o vinculo

Altere a associação `951021`:

```text
nivel:
AVANCADO.

observacao:
Competência avançada para execução do reparo.
```

Use `RETURNING`.

Confirme que a entidade Competência não foi alterada.

---

### Parte 6 - Remover uma associacao

Remova apenas a associação `951020`.

Confirme:

```text
atividade 930002 continua existindo;

competência 950010 continua existindo;

associação 951021 continua existindo.
```

---

### Parte 7 - Comparar PKs

Documente duas opções:

```text
PK composta:
atividade_id + competencia_id.

PK substituta:
id;
AK atividade_id + competencia_id.
```

Compare:

- clareza;
- referências futuras;
- duplicidade;
- tamanho das FKs;
- histórico;
- ferramentas.

Justifique a estratégia usada na aula.

---

### Parte 8 - Revisar o dominio

Responda:

1. Qual fato cada linha da associativa representa?
2. Quais atributos pertencem ao vínculo?
3. Por que `nivel_requerido` não pertence a Competência?
4. Por que a associação precisa das duas FKs?
5. O que acontece quando uma Competência não possui Atividade?
6. O que precisa acontecer antes de remover uma Competência associada?
7. Como o relacionamento prepara agregações na aula 286?

---

## Criterios de aceite

- o laboratório oficial da aula 285 existe;
- o título e o arquivo seguem a grade;
- o PostgreSQL anterior foi reutilizado;
- as atividades existentes foram preservadas;
- `app.competencia` foi criada;
- `app.atividade_competencia` foi criada;
- a tabela associativa possui duas FKs;
- as duas referências são obrigatórias;
- `ON DELETE RESTRICT` foi aplicado nos dois lados;
- PK substituta foi criada;
- unique composta protege a combinação;
- atributos próprios da associação foram criados;
- quatro competências principais foram inseridas;
- seis associações principais foram inseridas;
- uma atividade possui várias competências;
- uma competência participa de várias atividades;
- uma competência sem associação foi preservada;
- uma atividade sem competência foi preservada;
- consultas nos dois sentidos foram realizadas;
- atributos da associação foram atualizados;
- atividade inexistente foi rejeitada;
- competência inexistente foi rejeitada;
- associação duplicada foi rejeitada;
- nível inválido foi rejeitado;
- remoção de entidade associada foi bloqueada;
- remoção do vínculo preservou as entidades;
- nenhum `GROUP BY` foi aprofundado;
- o dataset foi preservado para a aula 286;
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
  labs/m12/aula-285-relacionamento-muitos-para-muitos-com-tabela-associativa
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): implementar relacionamento muitos para muitos"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
competências;
tabela associativa;
duas foreign keys;
atributos do vínculo;
integridade N:N;
consultas nos dois sentidos.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você implementou um relacionamento muitos-para-muitos completo.

Aprendeu:

```text
N:N;
tabela associativa;
entidade associativa;
duas foreign keys;
PK composta;
PK substituta;
alternate key composta;
atributos do relacionamento;
ordem de inserção;
ordem de exclusão;
consultas nos dois sentidos;
entidades sem associação;
remoção do vínculo.
```

As regras principais foram:

```text
uma FK simples não representa N:N;

a tabela associativa transforma N:N em dois 1:N;

cada linha representa um vínculo;

as duas FKs precisam apontar para entidades válidas;

a combinação dos lados não deve repetir;

atributos do vínculo pertencem à associação;

remover a associação não remove as entidades;

consultas atravessam a tabela associativa;

a cardinalidade do resultado acompanha a quantidade de vínculos.
```

A próxima aula será:

```text
286 - M12.16 - Group by having e agregacoes
```

Nela, você vai usar o dataset acumulado para responder perguntas como:

- quantas atividades existem por ordem;
- quantas competências cada atividade exige;
- quantas atividades usam cada competência;
- qual é o valor médio das atividades;
- qual é o maior e o menor valor;
- quais grupos atendem a uma condição;
- diferença entre `WHERE` e `HAVING`;
- uso de `COUNT`, `SUM`, `AVG`, `MIN` e `MAX`.

Não remova as competências nem as seis associações principais.

Elas serão usadas nas agregações.

---

# Material complementar

## Checkpoint final

- [ ] Criei Competência e a tabela associativa.
- [ ] Protegi as duas FKs e a combinação do vínculo.
- [ ] Consultei os dois sentidos e atualizei atributos da associação.
- [ ] Mantive o dataset e fiz o commit recomendado.

---

## Troubleshooting adicional

### Table already exists

Os scripts de criação já foram aplicados.

Continue pela inspeção e limpeza do dataset reservado.

### Unique violation ao reassociar

A combinação de atividade e competência já existe.

Não crie outra linha para o mesmo vínculo; atualize a associação existente.

### Competencia nao pode ser removida

Existem associações protegidas por `RESTRICT`.

Consulte a tabela associativa antes de decidir a remoção.

### Resultado possui muitas linhas

Cada linha representa uma associação.

Projete IDs de atividade, competência e associação para interpretar a multiplicidade.

### Atributo parece pertencer aos dois lados

Pergunte se o valor varia para cada combinação.

Se varia por vínculo, pertence à associação.

---

## Perguntas de revisao

1. O que significa N:N?
2. Por que uma FK simples não resolve?
3. O que uma linha associativa representa?
4. Por que existem duas FKs?
5. Como N:N vira dois 1:N?
6. Qual a diferença entre associação simples e rica?
7. O que é atributo do relacionamento?
8. Qual a vantagem da PK composta?
9. Qual a vantagem da PK substituta?
10. Por que manter unique composta com PK substituta?
11. Qual é a ordem de inserção?
12. Qual é a ordem de exclusão?
13. Como preservar competências sem atividade?
14. Por que a atividade aparece várias vezes no join?
15. O que acontece ao remover somente a associação?
16. Como a aula prepara agregações?

---

## Roteiro de resposta

1. Várias ocorrências de ambos os lados podem se relacionar.
2. Uma coluna comporta apenas uma referência por linha.
3. Um vínculo específico entre os dois lados.
4. Para referenciar uma ocorrência de cada entidade.
5. Cada entidade se relaciona em 1:N com a associativa.
6. A rica possui atributos próprios do vínculo.
7. Valor que depende da combinação.
8. A combinação identifica diretamente o fato.
9. Identidade simples para referência futura.
10. Para impedir duplicidade do vínculo.
11. Entidades primeiro, associação depois.
12. Associação primeiro, entidade depois.
13. Use left join partindo de Competência.
14. Há uma linha por associação.
15. As duas entidades continuam existindo.
16. O dataset permite contar e resumir associações por grupo.

---

## Desafio opcional

Modele e implemente:

```text
Tecnico N:N Competencia.
```

A tabela associativa pode conter:

```text
tecnico_id;
competencia_id;
nivel;
certificado;
validade;
principal;
criado_em.
```

Defina:

- PK;
- unique de negócio;
- duas FKs;
- checks;
- política de remoção;
- consultas nos dois sentidos;
- atributos do vínculo;
- dados de teste.

Não use agregações ainda.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 285 - M12.15 - Relacionamento muitos para muitos com tabela associativa

- Implementei o relacionamento `Atividade N:N Competência`.
- Entendi por que uma foreign key simples não representa N:N.
- Transformei o relacionamento em dois relacionamentos 1:N.
- Criei as entidades `COMPETENCIA` e `ATIVIDADE_COMPETENCIA`.
- Adicionei duas foreign keys obrigatórias na tabela associativa.
- Usei PK substituta e unique composta para proteger o vínculo.
- Diferenciei chave física da chave de negócio da associação.
- Modelei nível, obrigatoriedade e observação como atributos do relacionamento.
- Inseri várias competências por atividade e várias atividades por competência.
- Consultei o relacionamento nos dois sentidos.
- Preservei entidades sem associação usando `LEFT JOIN`.
- Atualizei dados do vínculo sem alterar as entidades.
- Removi uma associação sem remover Atividade ou Competência.
- Mantive o dataset para a próxima aula.
- Próxima aula: `GROUP BY`, `HAVING` e funções de agregação.
```

---

## Referencia tecnica curta

```text
N:N:
vários dos dois lados.

Tabela associativa:
representa o vínculo.

Duas FKs:
uma para cada entidade.

PK composta:
combinação das FKs.

PK substituta:
ID próprio da associação.

Unique composta:
impede vínculo duplicado.

Atributo do relacionamento:
depende da combinação.

RESTRICT:
protege entidades associadas.
```

Regra final:

```text
em N:N, cada vinculo vira uma linha propria protegida por duas referencias.
```
