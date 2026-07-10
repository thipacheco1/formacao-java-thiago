# 306 - M12.36 - JSONB no PostgreSQL quando usar e quando evitar

## Apresentacao da aula

Na aula 305, você construiu relatórios com funções window sem perder a granularidade das linhas.

Agora o foco volta para modelagem e armazenamento.

Aplicações backend frequentemente recebem informações que não possuem uma estrutura totalmente estável:

```text
metadados de integração;
atributos opcionais;
tags;
preferências;
payloads externos;
configurações pouco frequentes;
respostas variáveis de parceiros.
```

Diante disso, surge uma tentação:

```text
guardar tudo em uma coluna JSONB.
```

Essa solução pode parecer rápida porque evita criar novas colunas e tabelas.

Entretanto, se JSONB for usado sem critério, o banco perde parte das vantagens construídas ao longo do M12:

- tipos explícitos;
- foreign keys;
- constraints;
- unicidade;
- joins claros;
- estatísticas por coluna;
- índices simples;
- contratos estáveis;
- atualizações localizadas;
- documentação objetiva.

JSONB complementa o modelo relacional.

Nesta aula, você vai trabalhar com um modelo híbrido:

```text
colunas relacionais:
identidade, vínculo, status, valor e tempo.

JSONB:
metadados opcionais e payload variável.
```

O laboratório criará o schema:

```text
jsonb_aula_306
```

As entidades principais serão:

```text
cliente;

ordem_servico;

evento_integracao.
```

A tabela `ordem_servico` manterá os dados centrais em colunas relacionais e utilizará:

```text
metadados jsonb
```

para informações opcionais, como:

- canal de origem;
- tags;
- características do equipamento;
- referências externas;
- atributos de importação.

A tabela `evento_integracao` guardará o tipo e o momento em colunas relacionais e um payload variável em JSONB.

Você vai praticar:

- diferença entre `json` e `jsonb`;
- extração com `->`, `->>`, `#>` e `#>>`;
- contenção com `@>`;
- existência de chaves com `?`, `?|` e `?&`;
- expansão de arrays;
- `jsonb_set`;
- concatenação com `||`;
- remoção com `-` e `#-`;
- validação com `CHECK` e `jsonb_typeof`;
- índices GIN;
- índices de expressão;
- `jsonb_ops` e `jsonb_path_ops`;
- construção de JSON para saída;
- critérios para promover uma chave JSONB a coluna;
- sinais de abuso.

O laboratório também gerará 30.000 eventos sintéticos para observar planos de consultas JSONB.

Ao final, o schema será removido.

O schema oficial `projeto_os` permanecerá intacto.

A próxima aula será:

```text
307 - M12.37 - Projeto banco OS parte 1 modelo fisico
```

O projeto utilizará as decisões aprendidas neste módulo. JSONB só deverá aparecer quando houver uma justificativa real.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
304:
usuários, permissões e segurança básica.

305:
funções window para relatórios.

306:
JSONB no PostgreSQL.

307:
projeto banco OS parte 1 — modelo físico.

308:
projeto banco OS parte 2 — consultas e relatórios.
```

Você já aprendeu a modelar:

- entidades;
- cardinalidades;
- chaves;
- constraints;
- relacionamentos;
- índices;
- transações;
- relatórios.

JSONB deve entrar depois dessas decisões, não antes.

A pergunta correta não é:

```text
PostgreSQL suporta JSONB?
```

A pergunta correta é:

```text
este atributo possui natureza documental e flexível suficiente
para justificar JSONB?
```

A decisão exige observar estabilidade, constraints, consultas, atualizações, joins, ordenação, unicidade, relacionamentos, tamanho, origem e contrato.

---

## Objetivo pratico

Você vai criar:

```text
labs/m12/aula-306-jsonb-postgresql-quando-usar-evitar
```

Estrutura final:

```text
labs
└── m12
    └── aula-306-jsonb-postgresql-quando-usar-evitar
        ├── README.md
        ├── docs
        │   ├── anti-padroes-jsonb.md
        │   ├── contrato-metadados.md
        │   └── matriz-decisao-jsonb.md
        └── sql
            ├── 00_verificar_pre_requisitos.sql
            ├── 01_criar_schema_e_tabelas.sql
            ├── 02_inserir_seed.sql
            ├── 03_json_vs_jsonb.sql
            ├── 04_extrair_campos_e_caminhos.sql
            ├── 05_contencao_e_existencia.sql
            ├── 06_expandir_arrays_e_objetos.sql
            ├── 07_atualizar_e_remover_chaves.sql
            ├── 08_erros_controlados_e_validacao.sql
            ├── 09_gerar_eventos_sinteticos.sql
            ├── 10_criar_indices_jsonb.sql
            ├── 11_analisar_planos_jsonb.sql
            ├── 12_relacional_vs_documental.sql
            ├── 13_construir_json_de_saida.sql
            ├── 14_exercicio.sql
            ├── 15_limpar_laboratorio.sql
            └── 16_checkpoint_final.sql
```

IDs reservados:

```text
Clientes:
306001 a 306003.

Ordens:
306101 a 306106.

Eventos:
1 a 30000.

Exercício:
306900 em diante.
```

Contagens esperadas antes da limpeza:

```text
3 Clientes;

6 Ordens;

30.000 eventos.
```

---

## Conceito essencial

### JSON e JSONB

PostgreSQL possui dois tipos principais para documentos JSON:

```text
json;

jsonb.
```

Os dois validam se a entrada possui sintaxe JSON válida.

A diferença principal está no armazenamento e no processamento.

`json` preserva uma cópia textual da entrada.

Isso inclui aspectos como:

- espaços;
- ordem das chaves;
- chaves duplicadas no texto recebido.

`jsonb` converte o documento para uma representação binária decomposta.

Consequências:

- espaços sem significado não são preservados;
- ordem das chaves de objetos não é preservada como contrato;
- chaves duplicadas não permanecem como múltiplas entradas;
- operações e índices específicos ficam disponíveis;
- a leitura e a busca costumam ser mais apropriadas para documentos consultados.

Use `json` quando a representação textual original for requisito.

Use `jsonb` quando a aplicação precisa consultar, combinar, atualizar ou indexar o conteúdo.

Se for necessário preservar exatamente os bytes recebidos de uma integração, uma coluna `text` ou `bytea` acompanhada de validação e metadados pode ser mais adequada do que assumir que JSONB preservará a forma original.

---

### JSONB nao significa sem esquema

JSONB não elimina a necessidade de contrato.

O contrato apenas deixa de ser representado integralmente por colunas tradicionais.

Um documento pode precisar garantir:

```text
objeto na raiz;

canal como string;

tags como array;

fragil como boolean;

equipamento como objeto.
```

Essas regras podem ser parcialmente protegidas por `CHECK`.

A aplicação também precisa:

- validar o payload;
- versionar o contrato;
- definir chaves conhecidas;
- tratar chaves desconhecidas;
- documentar nulos;
- evitar tipos inconsistentes.

Schema flexível não significa ausência de schema.

---

### Modelo hibrido

O modelo desta aula manterá como colunas:

```text
ordem_servico.id;

ordem_servico.codigo;

ordem_servico.cliente_id;

ordem_servico.status;

ordem_servico.valor_previsto;

ordem_servico.criado_em.
```

Esses campos são centrais porque:

- participam de joins;
- possuem tipo estável;
- precisam de constraints;
- são filtrados;
- são ordenados;
- fazem parte do contrato do domínio.

A coluna `metadados` guardará informações opcionais:

```json
{
  "canal": "PORTAL",
  "tags": ["vip", "urgente"],
  "fragil": true,
  "equipamento": {
    "cor": "branco",
    "serie": "SN-001"
  }
}
```

Se `canal` se tornar obrigatório, usado em quase todas as consultas, ordenado, agrupado e validado por regras de negócio, ele deverá ser promovido a uma coluna relacional.

---

### Quando usar JSONB

JSONB pode ser adequado para:

- metadados opcionais e esparsos;
- atributos que variam entre tipos de produto;
- payload externo que precisa ser consultado;
- configuração de baixa frequência;
- tags;
- detalhes de integração;
- dados documentais sem relacionamento próprio;
- extensão controlada de um modelo estável.

A decisão melhora quando o documento é pequeno, varia legitimamente, não depende de foreign keys e possui consultas e contrato conhecidos.

---

### Quando evitar JSONB

Evite guardar em JSONB:

- primary key;
- foreign key;
- status central;
- valor financeiro principal;
- data usada em ordenação;
- campo de unicidade;
- atributo obrigatório;
- coleção de entidades com identidade própria;
- histórico que precisa de linhas independentes;
- dados usados constantemente em joins;
- tudo que deveria possuir constraint relacional clara.

Exemplo ruim:

```json
{
  "cliente": {
    "id": 10,
    "nome": "Cliente"
  },
  "atividades": [
    {
      "id": 20,
      "status": "CONCLUIDA"
    }
  ],
  "pagamentos": [
    {
      "id": 30,
      "valor": 500
    }
  ]
}
```

Esse documento esconde relacionamentos, dificulta foreign keys, duplica dados e torna atualizações concorrentes mais complexas.

---

### Chave ausente, JSON null e SQL NULL

Estes estados são diferentes:

```text
chave ausente;

chave presente com valor JSON null;

coluna SQL nula.
```

Exemplo:

```json
{}

{
  "observacoes": null
}
```

A coluna `metadados` desta aula será `NOT NULL`, portanto o terceiro estado não ocorrerá nela.

Operador:

```sql
metadados ? 'observacoes'
```

retorna `true` quando a chave existe, mesmo se o valor for JSON `null`.

Extração textual:

```sql
metadados ->> 'observacoes'
```

retorna SQL `NULL` tanto para chave ausente quanto para valor JSON `null`.

Quando a distinção importa, verifique existência e tipo explicitamente.

---

### Operadores de extracao

Operador `->`:

```sql
metadados -> 'equipamento'
```

retorna JSONB.

Operador `->>`:

```sql
metadados ->> 'canal'
```

retorna texto.

Operador `#>`:

```sql
metadados #> '{equipamento,cor}'
```

retorna JSONB em um caminho.

Operador `#>>`:

```sql
metadados #>> '{equipamento,cor}'
```

retorna texto.

Quando a estrutura não corresponde ao caminho solicitado, os operadores de extração retornam `NULL` em vez de falhar.

Isso é útil, mas pode esconder dados inconsistentes se o contrato não for validado.

---

### Conversao de tipos

`->>` devolve texto.

Para comparar numericamente:

```sql
(metadados ->> 'tentativa')::integer
```

Esse cast falha se o valor não for numérico.

Se uma chave é consultada numericamente com frequência, uma coluna tipada pode ser mais segura.

Não espalhe casts frágeis por dezenas de relatórios.

---

### Contencao

Operador:

```sql
@>
```

responde se o documento da esquerda contém a estrutura da direita.

Exemplo:

```sql
metadados @> '{"canal": "PORTAL"}'::jsonb
```

Também:

```sql
metadados @> '{"tags": ["vip"]}'::jsonb
```

A contenção é uma das operações mais importantes para índices GIN em JSONB.

Ela verifica estrutura e valores, não apenas texto.

---

### Existencia

Operadores:

```text
?:
uma chave ou elemento string existe.

?|:
pelo menos um elemento do array informado existe.

?&:
todos os elementos informados existem.
```

Exemplos:

```sql
metadados ? 'canal';

metadados ?| ARRAY[
    'canal',
    'integracao'
];

metadados ?& ARRAY[
    'canal',
    'tags'
];
```

Aplicado a um array JSONB de strings:

```sql
metadados -> 'tags' ? 'vip'
```

verifica se `vip` está no array.

Para chave aninhada:

```sql
metadados -> 'equipamento' ? 'serie'
```

---

### Expansao de arrays

Para transformar elementos de um array em linhas:

```sql
jsonb_array_elements_text(...)
```

Exemplo:

```sql
CROSS JOIN LATERAL
jsonb_array_elements_text(
    coalesce(
        metadados -> 'tags',
        '[]'::jsonb
    )
) AS tag(valor)
```

O resultado possui uma linha por tag.

Essa expansão é útil para relatórios, mas uma coleção consultada intensivamente, com atributos próprios e relacionamentos, pode merecer uma tabela filha.

---

### Atualizacao com jsonb_set

`jsonb_set` retorna um novo documento JSONB.

Exemplo para uma chave de primeiro nível:

```sql
jsonb_set(
    metadados,
    '{prioridade_externa}',
    to_jsonb('ALTA'::text),
    true
)
```

O último argumento controla a criação do item final ausente.

Para atualizar caminho aninhado:

```sql
jsonb_set(
    metadados,
    '{equipamento,cor}',
    to_jsonb('preto'::text),
    true
)
```

Os componentes anteriores do caminho precisam existir para que a atualização aninhada produza o resultado esperado.

A função não modifica uma parte física isolada do documento em lugar.

Ela produz um novo valor JSONB usado pelo `UPDATE`.

Documentos gigantes e alterados frequentemente podem gerar custo de escrita, WAL e manutenção de índices.

---

### Concatenacao

Operador:

```sql
||
```

combina valores JSONB.

Exemplo:

```sql
metadados
|| jsonb_build_object(
    'origem_revisada',
    true
)
```

Para objetos, chaves da direita substituem chaves iguais da esquerda.

A concatenação não realiza merge recursivo profundo.

Se dois objetos possuem a chave `equipamento`, o valor da direita substitui o objeto da esquerda nessa chave.

Não trate `||` como merge profundo automático.

---

### Remocao

Remover chave:

```sql
metadados - 'observacoes'
```

Remover caminho:

```sql
metadados #- '{equipamento,serie}'
```

Remover elemento de array por índice também é possível, mas índices posicionais em arrays que mudam frequentemente podem produzir lógica frágil.

---

### Validacao com CHECK

A tabela usará:

```sql
CHECK (
    jsonb_typeof(metadados) = 'object'
)
```

Também validará chaves opcionais.

Exemplo:

```sql
CHECK (
    NOT (metadados ? 'tags')
    OR jsonb_typeof(
        metadados -> 'tags'
    ) = 'array'
)
```

Para `canal`:

```sql
CHECK (
    NOT (metadados ? 'canal')
    OR (
        jsonb_typeof(
            metadados -> 'canal'
        ) = 'string'
        AND metadados ->> 'canal'
            IN (
                'PORTAL',
                'API',
                'IMPORTACAO',
                'LOJA'
            )
    )
)
```

Essa validação protege parte do contrato sem transformar o JSONB em um segundo sistema relacional escondido.

---

### Indice GIN

GIN é apropriado para valores que contêm vários componentes pesquisáveis.

Índice padrão:

```sql
CREATE INDEX ...
USING GIN (metadados);
```

Para JSONB, a operator class padrão é:

```text
jsonb_ops.
```

Ela suporta operadores como:

- existência de chave;
- contenção;
- consultas jsonpath suportadas.

O índice possui custo:

- espaço;
- inserção;
- atualização;
- manutenção;
- cache.

Não crie GIN em toda coluna JSONB sem consultas conhecidas.

---

### jsonb_ops e jsonb_path_ops

`jsonb_ops` é a operator class padrão.

Ela indexa chaves e valores de forma mais ampla e suporta mais operadores, incluindo existência.

`jsonb_path_ops` suporta um conjunto menor de operações, principalmente contenção e consultas jsonpath compatíveis.

Em contrapartida, pode produzir índices menores e buscas mais específicas para os operadores suportados.

Escolha conforme as consultas.

Se a aplicação precisa de:

```sql
payload ? 'chave'
```

`jsonb_path_ops` não substitui o comportamento do índice padrão para essa operação.

Não crie os dois índices apenas por dúvida.

Meça uma carga representativa.

---

### Indice de expressao

Quando a consulta usa frequentemente uma chave escalar específica:

```sql
payload ->> 'status_externo'
```

um índice B-tree de expressão pode ser adequado:

```sql
CREATE INDEX ...
ON tabela (
    (payload ->> 'status_externo')
);
```

Isso não significa que a chave deve permanecer no JSONB para sempre.

Se ela se torna obrigatória, central e amplamente usada, promova para coluna.

---

### Estatisticas e seletividade

PostgreSQL possui estatísticas mais ricas para colunas relacionais do que para estruturas arbitrárias profundas.

Uma chave escondida dentro de documentos heterogêneos pode dificultar estimativas.

Campos usados em filtros essenciais, joins e ordenações continuam sendo melhores candidatos a colunas tipadas.

---

### Atualizacao concorrente

Duas transações que atualizam chaves diferentes do mesmo documento ainda atualizam a mesma linha.

Elas não estão alterando duas linhas independentes.

Se vários processos precisam modificar partes autônomas com alta concorrência, uma tabela filha pode representar melhor a granularidade de escrita.

---

### JSONB como saida nao exige JSONB como armazenamento

O PostgreSQL pode construir JSON a partir de tabelas relacionais:

```sql
jsonb_build_object(...);

jsonb_agg(...).
```

Uma API que devolve JSON não precisa armazenar todo o domínio em JSONB.

Armazene de forma relacional quando o domínio é relacional.

Construa o documento na consulta ou na aplicação.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-306-jsonb-postgresql-quando-usar-evitar\sql"

New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-306-jsonb-postgresql-quando-usar-evitar\docs"

Set-Location `
  "labs\m12\aula-306-jsonb-postgresql-quando-usar-evitar"
```

---

### 2. Criar 00_verificar_pre_requisitos.sql

Crie:

```text
sql/00_verificar_pre_requisitos.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    version() AS versao;

SELECT
    to_regnamespace(
        'jsonb_aula_306'
    ) AS schema_laboratorio;

SELECT
    to_regnamespace(
        'projeto_os'
    ) AS schema_oficial,
    to_regclass(
        'projeto_os.vw_ordem_resumo_backend'
    ) AS view_oficial;
```

---

### 3. Criar 01_criar_schema_e_tabelas.sql

Crie:

```text
sql/01_criar_schema_e_tabelas.sql
```

Conteúdo:

```sql
DROP SCHEMA IF EXISTS jsonb_aula_306 CASCADE;

CREATE SCHEMA jsonb_aula_306;

CREATE TABLE jsonb_aula_306.cliente (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    nome text NOT NULL
);

CREATE TABLE jsonb_aula_306.ordem_servico (
    id bigint PRIMARY KEY,
    codigo text NOT NULL UNIQUE,
    cliente_id bigint NOT NULL,
    status text NOT NULL,
    valor_previsto numeric(12, 2) NOT NULL,
    criado_em timestamptz NOT NULL,
    metadados jsonb NOT NULL
        DEFAULT '{}'::jsonb,

    CONSTRAINT fk_a306_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES jsonb_aula_306.cliente (id)
        ON DELETE RESTRICT,

    CONSTRAINT ck_a306_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_a306_ordem_valor
        CHECK (valor_previsto >= 0),

    CONSTRAINT ck_a306_metadados_objeto
        CHECK (
            jsonb_typeof(metadados)
                = 'object'
        ),

    CONSTRAINT ck_a306_metadados_tags
        CHECK (
            NOT (metadados ? 'tags')
            OR jsonb_typeof(
                metadados -> 'tags'
            ) = 'array'
        ),

    CONSTRAINT ck_a306_metadados_fragil
        CHECK (
            NOT (metadados ? 'fragil')
            OR jsonb_typeof(
                metadados -> 'fragil'
            ) = 'boolean'
        ),

    CONSTRAINT ck_a306_metadados_equipamento
        CHECK (
            NOT (metadados ? 'equipamento')
            OR jsonb_typeof(
                metadados -> 'equipamento'
            ) = 'object'
        ),

    CONSTRAINT ck_a306_metadados_canal
        CHECK (
            NOT (metadados ? 'canal')
            OR (
                jsonb_typeof(
                    metadados -> 'canal'
                ) = 'string'
                AND metadados ->> 'canal'
                    IN (
                        'PORTAL',
                        'API',
                        'IMPORTACAO',
                        'LOJA'
                    )
            )
        )
);

CREATE TABLE jsonb_aula_306.evento_integracao (
    id bigint PRIMARY KEY,
    tipo text NOT NULL,
    recebido_em timestamptz NOT NULL,
    payload jsonb NOT NULL,

    CONSTRAINT ck_a306_evento_tipo
        CHECK (
            tipo IN (
                'ORDEM_RECEBIDA',
                'STATUS_ATUALIZADO',
                'PAGAMENTO_RECEBIDO'
            )
        ),

    CONSTRAINT ck_a306_payload_objeto
        CHECK (
            jsonb_typeof(payload)
                = 'object'
        )
);
```

Observe a decisão:

```text
tipo e recebido_em:
colunas relacionais.

payload:
estrutura variável da integração.
```

---

### 4. Criar 02_inserir_seed.sql

Crie:

```text
sql/02_inserir_seed.sql
```

Conteúdo:

```sql
INSERT INTO jsonb_aula_306.cliente (
    id,
    codigo,
    nome
)
VALUES
    (
        306001,
        'CLI-JB-ALFA',
        'Cliente JSONB Alfa'
    ),
    (
        306002,
        'CLI-JB-BETA',
        'Cliente JSONB Beta'
    ),
    (
        306003,
        'CLI-JB-GAMA',
        'Cliente JSONB Gama'
    );

INSERT INTO jsonb_aula_306.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    valor_previsto,
    criado_em,
    metadados
)
VALUES
    (
        306101,
        'OS-JB-001',
        306001,
        'ABERTA',
        500.00,
        TIMESTAMPTZ '2026-07-01 09:00:00-03',
        '{
          "canal": "PORTAL",
          "tags": ["vip", "urgente"],
          "fragil": true,
          "equipamento": {
            "cor": "branco",
            "serie": "SN-001"
          }
        }'::jsonb
    ),
    (
        306102,
        'OS-JB-002',
        306001,
        'EM_ATENDIMENTO',
        750.00,
        TIMESTAMPTZ '2026-07-02 10:00:00-03',
        '{
          "canal": "API",
          "tags": ["garantia"],
          "equipamento": {
            "cor": "inox"
          },
          "integracao": {
            "correlation_id": "CORR-002"
          }
        }'::jsonb
    ),
    (
        306103,
        'OS-JB-003',
        306002,
        'CONCLUIDA',
        900.00,
        TIMESTAMPTZ '2026-07-03 11:00:00-03',
        '{
          "canal": "IMPORTACAO",
          "tags": [],
          "integracao": {
            "lote": "LOTE-2026-07",
            "linha": 15
          },
          "observacoes": null
        }'::jsonb
    ),
    (
        306104,
        'OS-JB-004',
        306002,
        'CANCELADA',
        0.00,
        TIMESTAMPTZ '2026-07-04 12:00:00-03',
        '{}'::jsonb
    ),
    (
        306105,
        'OS-JB-005',
        306003,
        'ABERTA',
        1200.00,
        TIMESTAMPTZ '2026-07-05 13:00:00-03',
        '{
          "canal": "LOJA",
          "tags": ["retorno"],
          "equipamento": {
            "cor": "preto",
            "voltagem": "220V"
          }
        }'::jsonb
    ),
    (
        306106,
        'OS-JB-006',
        306003,
        'EM_ATENDIMENTO',
        650.00,
        TIMESTAMPTZ '2026-07-06 14:00:00-03',
        '{
          "canal": "PORTAL",
          "tags": ["vip"],
          "fragil": false,
          "embalagem": {
            "altura_cm": 80,
            "largura_cm": 60
          }
        }'::jsonb
    );

ANALYZE jsonb_aula_306.cliente;
ANALYZE jsonb_aula_306.ordem_servico;
```

Valide:

```sql
SELECT
    count(*) AS clientes
FROM jsonb_aula_306.cliente;

SELECT
    count(*) AS ordens
FROM jsonb_aula_306.ordem_servico;
```

Esperado:

```text
3;

6.
```

---

### 5. Criar 03_json_vs_jsonb.sql

Crie:

```text
sql/03_json_vs_jsonb.sql
```

Conteúdo:

```sql
CREATE TEMP TABLE comparacao_json (
    id integer PRIMARY KEY,
    documento_json json NOT NULL,
    documento_jsonb jsonb NOT NULL
);

INSERT INTO comparacao_json (
    id,
    documento_json,
    documento_jsonb
)
VALUES (
    1,
    '{
      "codigo": "A",
      "codigo": "B",
      "ordem": [2, 1]
    }'::json,
    '{
      "codigo": "A",
      "codigo": "B",
      "ordem": [2, 1]
    }'::jsonb
);

SELECT
    documento_json::text AS json_textual,
    documento_jsonb::text AS jsonb_normalizado
FROM comparacao_json;

SELECT
    documento_json ->> 'codigo'
        AS codigo_json,
    documento_jsonb ->> 'codigo'
        AS codigo_jsonb
FROM comparacao_json;
```

Observe:

- JSONB não deve ser usado para preservar chaves duplicadas;
- a ordem do array continua significativa;
- a ordem das chaves do objeto não é contrato;
- o último valor de uma chave duplicada é o valor efetivo em JSONB.

A tabela temporária desaparece quando a sessão termina.

---

### 6. Criar 04_extrair_campos_e_caminhos.sql

Crie:

```text
sql/04_extrair_campos_e_caminhos.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    metadados -> 'canal'
        AS canal_jsonb,
    metadados ->> 'canal'
        AS canal_texto,
    metadados #> '{equipamento,cor}'
        AS cor_jsonb,
    metadados #>> '{equipamento,cor}'
        AS cor_texto,
    metadados #>> '{integracao,lote}'
        AS lote_importacao
FROM jsonb_aula_306.ordem_servico
ORDER BY id;

SELECT
    id,
    codigo,
    metadados ? 'observacoes'
        AS chave_observacoes_existe,
    metadados -> 'observacoes'
        AS observacoes_jsonb,
    metadados ->> 'observacoes'
        AS observacoes_texto,
    jsonb_typeof(
        metadados -> 'observacoes'
    ) AS tipo_observacoes
FROM jsonb_aula_306.ordem_servico
WHERE id IN (
    306103,
    306104
)
ORDER BY id;
```

Compare:

```text
306103:
chave existe com JSON null.

306104:
chave ausente.
```

---

### 7. Criar 05_contencao_e_existencia.sql

Crie:

```text
sql/05_contencao_e_existencia.sql
```

Conteúdo:

```sql
SELECT
    id,
    codigo,
    metadados
FROM jsonb_aula_306.ordem_servico
WHERE metadados @> '{
  "canal": "PORTAL"
}'::jsonb
ORDER BY id;

SELECT
    id,
    codigo
FROM jsonb_aula_306.ordem_servico
WHERE metadados @> '{
  "tags": ["vip"]
}'::jsonb
ORDER BY id;

SELECT
    id,
    codigo
FROM jsonb_aula_306.ordem_servico
WHERE metadados ? 'equipamento'
ORDER BY id;

SELECT
    id,
    codigo
FROM jsonb_aula_306.ordem_servico
WHERE metadados ?| ARRAY[
    'integracao',
    'embalagem'
]
ORDER BY id;

SELECT
    id,
    codigo
FROM jsonb_aula_306.ordem_servico
WHERE metadados ?& ARRAY[
    'canal',
    'tags'
]
ORDER BY id;

SELECT
    id,
    codigo
FROM jsonb_aula_306.ordem_servico
WHERE coalesce(
    metadados -> 'tags',
    '[]'::jsonb
) ? 'vip'
ORDER BY id;

SELECT
    id,
    codigo
FROM jsonb_aula_306.ordem_servico
WHERE coalesce(
    metadados -> 'equipamento',
    '{}'::jsonb
) ? 'serie'
ORDER BY id;
```

Valide manualmente os IDs esperados.

---

### 8. Criar 06_expandir_arrays_e_objetos.sql

Crie:

```text
sql/06_expandir_arrays_e_objetos.sql
```

Conteúdo:

```sql
SELECT
    ordem.id,
    ordem.codigo,
    tag.valor AS tag
FROM jsonb_aula_306.ordem_servico AS ordem
CROSS JOIN LATERAL
jsonb_array_elements_text(
    coalesce(
        ordem.metadados -> 'tags',
        '[]'::jsonb
    )
) AS tag(valor)
ORDER BY
    ordem.id,
    tag.valor;

SELECT
    ordem.id,
    ordem.codigo,
    atributo.key AS atributo,
    atributo.value AS valor_jsonb
FROM jsonb_aula_306.ordem_servico AS ordem
CROSS JOIN LATERAL
jsonb_each(
    coalesce(
        ordem.metadados -> 'equipamento',
        '{}'::jsonb
    )
) AS atributo
WHERE ordem.metadados ? 'equipamento'
ORDER BY
    ordem.id,
    atributo.key;

SELECT
    tag.valor,
    count(*) AS quantidade_ordens
FROM jsonb_aula_306.ordem_servico AS ordem
CROSS JOIN LATERAL
jsonb_array_elements_text(
    coalesce(
        ordem.metadados -> 'tags',
        '[]'::jsonb
    )
) AS tag(valor)
GROUP BY tag.valor
ORDER BY
    quantidade_ordens DESC,
    tag.valor;
```

A expansão altera a granularidade:

```text
uma linha por Ordem
vira
uma linha por elemento.
```

---

### 9. Criar 07_atualizar_e_remover_chaves.sql

Crie:

```text
sql/07_atualizar_e_remover_chaves.sql
```

Conteúdo:

```sql
BEGIN;

UPDATE jsonb_aula_306.ordem_servico
SET metadados = jsonb_set(
    metadados,
    '{prioridade_externa}',
    to_jsonb('ALTA'::text),
    true
)
WHERE id = 306101;

UPDATE jsonb_aula_306.ordem_servico
SET metadados = jsonb_set(
    metadados,
    '{equipamento,cor}',
    to_jsonb('azul'::text),
    true
)
WHERE id = 306101;

UPDATE jsonb_aula_306.ordem_servico
SET metadados = jsonb_set(
    metadados,
    '{tags}',
    coalesce(
        metadados -> 'tags',
        '[]'::jsonb
    )
    || jsonb_build_array(
        'prioritario'
    ),
    true
)
WHERE id = 306101;

UPDATE jsonb_aula_306.ordem_servico
SET metadados =
    metadados
    || jsonb_build_object(
        'revisado',
        true
    )
WHERE id = 306101;

UPDATE jsonb_aula_306.ordem_servico
SET metadados =
    metadados - 'observacoes'
WHERE id = 306103;

UPDATE jsonb_aula_306.ordem_servico
SET metadados =
    metadados
    #- '{equipamento,serie}'
WHERE id = 306101;

SELECT
    id,
    codigo,
    metadados
FROM jsonb_aula_306.ordem_servico
WHERE id IN (
    306101,
    306103
)
ORDER BY id;

ROLLBACK;
```

Depois do rollback, o seed original permanece.

---

### 10. Criar 08_erros_controlados_e_validacao.sql

Crie:

```text
sql/08_erros_controlados_e_validacao.sql
```

Execute um cenário por vez.

Depois de cada erro:

```sql
ROLLBACK;
```

Cenário 1 — raiz não é objeto:

```sql
BEGIN;

INSERT INTO jsonb_aula_306.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    valor_previsto,
    criado_em,
    metadados
)
VALUES (
    306901,
    'OS-JB-ERRO-1',
    306001,
    'ABERTA',
    100.00,
    CURRENT_TIMESTAMP,
    '[]'::jsonb
);
```

Cenário 2 — tags não é array:

```sql
BEGIN;

INSERT INTO jsonb_aula_306.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    valor_previsto,
    criado_em,
    metadados
)
VALUES (
    306902,
    'OS-JB-ERRO-2',
    306001,
    'ABERTA',
    100.00,
    CURRENT_TIMESTAMP,
    '{"tags": "vip"}'::jsonb
);
```

Cenário 3 — fragil não é boolean:

```sql
BEGIN;

INSERT INTO jsonb_aula_306.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    valor_previsto,
    criado_em,
    metadados
)
VALUES (
    306903,
    'OS-JB-ERRO-3',
    306001,
    'ABERTA',
    100.00,
    CURRENT_TIMESTAMP,
    '{"fragil": "sim"}'::jsonb
);
```

Cenário 4 — canal inválido:

```sql
BEGIN;

INSERT INTO jsonb_aula_306.ordem_servico (
    id,
    codigo,
    cliente_id,
    status,
    valor_previsto,
    criado_em,
    metadados
)
VALUES (
    306904,
    'OS-JB-ERRO-4',
    306001,
    'ABERTA',
    100.00,
    CURRENT_TIMESTAMP,
    '{"canal": "DESCONHECIDO"}'::jsonb
);
```

As constraints não validam qualquer estrutura imaginável.

Elas protegem o contrato que o domínio decidiu assumir.

---

### 11. Criar 09_gerar_eventos_sinteticos.sql

Crie:

```text
sql/09_gerar_eventos_sinteticos.sql
```

Conteúdo:

```sql
INSERT INTO jsonb_aula_306.evento_integracao (
    id,
    tipo,
    recebido_em,
    payload
)
SELECT
    g AS id,
    CASE
        WHEN g % 3 = 0
            THEN 'PAGAMENTO_RECEBIDO'
        WHEN g % 2 = 0
            THEN 'STATUS_ATUALIZADO'
        ELSE 'ORDEM_RECEBIDA'
    END AS tipo,
    TIMESTAMPTZ '2026-01-01 00:00:00-03'
        + g * INTERVAL '1 minute',
    jsonb_build_object(
        'origem',
        CASE
            WHEN g % 4 = 0
                THEN 'PORTAL'
            WHEN g % 4 = 1
                THEN 'API'
            WHEN g % 4 = 2
                THEN 'IMPORTACAO'
            ELSE 'LOJA'
        END,
        'status_externo',
        CASE
            WHEN g % 10 = 0
                THEN 'ERRO'
            WHEN g % 5 = 0
                THEN 'PROCESSANDO'
            ELSE 'SUCESSO'
        END,
        'tentativa',
        (g % 5) + 1,
        'cliente_codigo',
        'CLI-EXT-'
            || lpad(
                ((g % 1000) + 1)::text,
                4,
                '0'
            ),
        'tags',
        jsonb_build_array(
            CASE
                WHEN g % 7 = 0
                    THEN 'prioritario'
                ELSE 'normal'
            END
        ),
        'detalhes',
        jsonb_build_object(
            'lote',
            'L-'
                || lpad(
                    ((g % 100) + 1)::text,
                    3,
                    '0'
                ),
            'linha',
            g
        )
    ) AS payload
FROM generate_series(
    1,
    30000
) AS serie(g);

ANALYZE jsonb_aula_306.evento_integracao;

SELECT
    count(*) AS eventos
FROM jsonb_aula_306.evento_integracao;
```

Esperado:

```text
30000.
```

---

### 12. Criar 10_criar_indices_jsonb.sql

Crie:

```text
sql/10_criar_indices_jsonb.sql
```

Conteúdo:

```sql
CREATE INDEX idx_a306_ordem_metadados_gin
ON jsonb_aula_306.ordem_servico
USING GIN (
    metadados
);

CREATE INDEX idx_a306_evento_tipo_data
ON jsonb_aula_306.evento_integracao (
    tipo,
    recebido_em DESC,
    id DESC
);

CREATE INDEX idx_a306_evento_payload_gin
ON jsonb_aula_306.evento_integracao
USING GIN (
    payload
);

CREATE INDEX idx_a306_evento_status_externo
ON jsonb_aula_306.evento_integracao (
    (
        payload ->> 'status_externo'
    )
);

ANALYZE jsonb_aula_306.ordem_servico;
ANALYZE jsonb_aula_306.evento_integracao;
```

O índice GIN usa `jsonb_ops`, a operator class padrão.

Não crie também um `jsonb_path_ops` no mesmo laboratório sem uma consulta e uma medição que justifiquem a duplicação.

---

### 13. Criar 11_analisar_planos_jsonb.sql

Crie:

```text
sql/11_analisar_planos_jsonb.sql
```

Conteúdo:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    tipo,
    recebido_em
FROM jsonb_aula_306.evento_integracao
WHERE payload @> '{
  "origem": "PORTAL",
  "status_externo": "ERRO"
}'::jsonb
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    tipo,
    recebido_em
FROM jsonb_aula_306.evento_integracao
WHERE payload ->> 'status_externo'
    = 'ERRO'
ORDER BY id;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT
    id,
    tipo,
    recebido_em
FROM jsonb_aula_306.evento_integracao
WHERE tipo = 'STATUS_ATUALIZADO'
ORDER BY
    recebido_em DESC,
    id DESC
LIMIT 20;

EXPLAIN (
    ANALYZE,
    BUFFERS,
    SUMMARY
)
SELECT count(*)
FROM jsonb_aula_306.evento_integracao
WHERE payload ? 'detalhes';
```

Observe:

- `@>` pode utilizar GIN;
- igualdade sobre `payload ->> 'status_externo'` pode utilizar o índice de expressão;
- a consulta por `tipo` utiliza a coluna relacional;
- uma condição pouco seletiva pode levar o planejador a escolher leitura sequencial.

Não force o planejador.

---

### 14. Criar 12_relacional_vs_documental.sql

Crie:

```text
sql/12_relacional_vs_documental.sql
```

Conteúdo:

```sql
CREATE TEMP TABLE anti_padrao_ordem_jsonb (
    documento jsonb NOT NULL
);

INSERT INTO anti_padrao_ordem_jsonb (
    documento
)
VALUES (
    '{
      "id": 1,
      "codigo": "OS-ANTI-001",
      "cliente": {
        "id": 10,
        "codigo": "CLI-10"
      },
      "status": "ABERTA",
      "valor_previsto": 500,
      "atividades": [
        {
          "id": 100,
          "status": "PENDENTE"
        },
        {
          "id": 101,
          "status": "CONCLUIDA"
        }
      ]
    }'::jsonb
);

SELECT
    documento ->> 'codigo'
        AS codigo,
    documento #>> '{cliente,codigo}'
        AS cliente_codigo,
    documento ->> 'status'
        AS status,
    (
        documento ->> 'valor_previsto'
    )::numeric AS valor_previsto,
    jsonb_array_length(
        documento -> 'atividades'
    ) AS quantidade_atividades
FROM anti_padrao_ordem_jsonb;
```

Analise o que foi perdido:

- foreign key para Cliente;
- tipo numérico declarado na estrutura;
- status protegido por `CHECK`;
- unicidade do código;
- linhas independentes de Atividade;
- atualização concorrente granular;
- índices simples por entidade.

A tabela temporária demonstra o problema, não um modelo recomendado.

---

### 15. Criar 13_construir_json_de_saida.sql

Crie:

```text
sql/13_construir_json_de_saida.sql
```

Conteúdo:

```sql
SELECT
    jsonb_build_object(
        'id',
        ordem.id,
        'codigo',
        ordem.codigo,
        'status',
        ordem.status,
        'valorPrevisto',
        ordem.valor_previsto,
        'cliente',
        jsonb_build_object(
            'id',
            cliente.id,
            'codigo',
            cliente.codigo,
            'nome',
            cliente.nome
        ),
        'metadados',
        ordem.metadados
    ) AS ordem_json
FROM jsonb_aula_306.ordem_servico AS ordem
INNER JOIN jsonb_aula_306.cliente AS cliente
    ON cliente.id = ordem.cliente_id
WHERE ordem.id = 306101;

SELECT
    jsonb_agg(
        jsonb_build_object(
            'codigo',
            ordem.codigo,
            'status',
            ordem.status,
            'valorPrevisto',
            ordem.valor_previsto
        )
        ORDER BY
            ordem.criado_em,
            ordem.id
    ) AS ordens
FROM jsonb_aula_306.ordem_servico AS ordem
WHERE ordem.cliente_id = 306001;
```

O armazenamento continua relacional.

O formato de saída é JSON.

---

### 16. Criar a documentacao

Em:

```text
docs/matriz-decisao-jsonb.md
```

crie colunas:

```text
atributo;
obrigatório;
tipo estável;
join;
ordenação;
constraint;
frequência de filtro;
frequência de update;
decisão;
justificativa.
```

Em:

```text
docs/contrato-metadados.md
```

documente:

- raiz obrigatoriamente objeto;
- chaves conhecidas;
- tipos;
- chaves opcionais;
- diferença entre ausente e JSON null;
- versão do contrato;
- comportamento com chave desconhecida;
- limites de tamanho;
- responsáveis pela validação.

Em:

```text
docs/anti-padroes-jsonb.md
```

registre:

- tabela inteira em um documento;
- IDs relacionados dentro de arrays;
- status central dentro do JSONB;
- casts repetidos;
- chaves com tipos diferentes;
- documentos gigantes;
- atualizações concorrentes na mesma linha;
- GIN sem consulta;
- dois índices GIN redundantes;
- uso de JSONB apenas porque a API devolve JSON.

---

## Entendendo o que foi feito

### O nucleo permaneceu relacional

Cliente, status, valor, código e datas continuaram em colunas.

JSONB não substituiu integridade referencial.

---

### Metadados aceitaram variacao controlada

Cada Ordem pôde possuir chaves diferentes.

As regras mínimas foram protegidas por constraints.

---

### Consultas usaram semanticas JSONB

Extração, contenção e existência responderam perguntas diferentes.

A escolha do operador orientou o índice.

---

### Dois tipos de indice atenderam consultas diferentes

GIN atendeu estruturas flexíveis.

O B-tree de expressão atendeu uma chave escalar específica.

O B-tree comum continuou atendendo a coluna relacional `tipo`.

---

### Saida JSON nao obrigou armazenamento documental

O banco construiu documentos a partir de tabelas relacionadas.

A API pode receber JSON sem que o domínio inteiro esteja dentro de uma coluna.

---

## Erros comuns importantes

### Guardar foreign key em JSONB

O banco perde a integridade referencial nativa.

Use coluna e foreign key.

---

### Usar -> quando precisa de texto

`->` devolve JSONB.

Use `->>` para texto.

---

### Confundir chave ausente com JSON null

A extração textual pode retornar SQL `NULL` nos dois casos.

Use o operador de existência.

---

### Criar GIN sem consulta conhecida

O índice ocupa espaço e aumenta o custo de escrita.

Defina operadores e frequência antes.

---

### Acreditar que || faz merge profundo

Objetos aninhados podem ser substituídos por inteiro.

Teste a estrutura resultante.

---

## Comandos uteis

### Extrair texto

```sql
documento ->> 'chave'
```

### Extrair caminho

```sql
documento #>> '{objeto,chave}'
```

### Conter estrutura

```sql
documento @> '{"chave":"valor"}'
```

### Verificar chave

```sql
documento ? 'chave'
```

### Atualizar

```sql
jsonb_set(
    documento,
    '{chave}',
    to_jsonb('valor'::text),
    true
)
```

### Criar GIN

```sql
CREATE INDEX ...
USING GIN (documento);
```

---

## Exercicio guiado

Use:

```text
sql/14_exercicio.sql
```

### Parte 1 - Nova chave opcional

Adicione por `UPDATE`, dentro de transação:

```text
sla_externo_horas:
24.
```

Use `jsonb_set`.

Consulte como inteiro.

Execute rollback.

---

### Parte 2 - Validacao do SLA

Proponha uma constraint para garantir:

```text
chave ausente;
ou
valor numérico maior que zero.
```

Teste:

- número válido;
- zero;
- string;
- JSON null.

Remova a constraint ao final do exercício.

---

### Parte 3 - Tags

Retorne:

```text
tag;
quantidade de Ordens;
valor total das Ordens.
```

Use `LATERAL` e `GROUP BY`.

Ordens sem tags não devem gerar linha de tag.

---

### Parte 4 - Promocao para coluna

Analise a chave:

```text
canal.
```

Suponha que ela se torne:

- obrigatória;
- filtro de quase todos os endpoints;
- usada em relatórios;
- usada em ordenação;
- controlada por enum de negócio.

Documente uma migração expand and contract para promovê-la a coluna relacional sem quebrar consumidores.

Não implemente a remoção da chave JSONB.

---

### Parte 5 - jsonb_path_ops

Em uma cópia descartável da tabela de eventos:

1. crie GIN com `jsonb_ops`;
2. registre tamanho;
3. execute consulta `@>`;
4. remova o índice;
5. crie GIN com `jsonb_path_ops`;
6. registre tamanho;
7. execute a mesma consulta;
8. tente justificar por que `?` não possui o mesmo suporte.

Remova a cópia e os índices do exercício.

---

### Parte 6 - Documento grande

Gere um documento com um array de 1.000 elementos.

Meça:

```sql
pg_column_size(documento).
```

Atualize uma única chave e explique por que o custo não equivale a alterar uma coluna pequena isolada.

Faça tudo em tabela temporária.

---

### Parte 7 - Relacional ou JSONB

Classifique:

```text
cliente_id;

status;

valor_previsto;

cor do equipamento;

número de série;

tags de atendimento;

pagamentos;

atividades;

payload bruto de parceiro;

data de criação;

correlation_id pesquisado em toda requisição.
```

Escolha entre:

```text
coluna;

tabela filha;

JSONB;

texto bruto protegido.
```

Justifique.

---

### Parte 8 - Relatorio de integracao

Crie um relatório com:

```text
origem;

status_externo;

quantidade;

média de tentativas;

primeiro evento;

último evento.
```

Extraia as chaves do payload.

Depois explique quais chaves deveriam ser promovidas a colunas se esse relatório virar requisito central.

---

## Criterios de aceite

- o laboratório oficial da aula 306 existe;
- o arquivo e o H1 seguem a grade;
- o schema exclusivo foi criado;
- `json` foi diferenciado de `jsonb`;
- preservação textual foi diferenciada de consulta eficiente;
- o núcleo do domínio permaneceu relacional;
- metadados opcionais foram armazenados em JSONB;
- a raiz foi validada como objeto;
- tags foram validadas como array;
- fragil foi validado como boolean;
- canal foi validado como string permitida;
- `->` foi praticado;
- `->>` foi praticado;
- `#>` foi praticado;
- `#>>` foi praticado;
- chave ausente foi diferenciada de JSON null;
- `@>` foi praticado;
- `?`, `?|` e `?&` foram praticados;
- arrays foram expandidos com LATERAL;
- objetos foram expandidos com `jsonb_each`;
- `jsonb_set` foi praticado;
- concatenação foi praticada;
- remoção de chave e caminho foi praticada;
- erros de contrato foram observados;
- 30.000 eventos sintéticos foram criados;
- índice GIN foi criado;
- índice B-tree de expressão foi criado;
- `jsonb_ops` foi diferenciado de `jsonb_path_ops`;
- planos foram observados;
- JSONB não foi usado para foreign keys;
- documento anti-padrão foi analisado;
- JSON de saída foi construído sem mudar o armazenamento;
- schema `projeto_os` foi preservado;
- objetos do exercício foram removidos;
- schema da aula foi removido;
- projeto da aula 307 não foi antecipado;
- documentação e README estão prontos;
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
  labs/m12/aula-306-jsonb-postgresql-quando-usar-evitar
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): modelar metadados com jsonb"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
modelo híbrido;
operadores JSONB;
validação;
atualização;
índices;
critérios de decisão.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprendeu a usar JSONB como extensão controlada de um modelo relacional.

Praticou:

```text
json;
jsonb;
extração;
contenção;
existência;
arrays;
objetos;
jsonb_set;
concatenação;
remoção;
constraints;
GIN;
índice de expressão;
construção de JSON.
```

As regras principais foram:

```text
JSONB complementa o modelo relacional;

campo central deve permanecer tipado;

foreign key não pertence ao JSONB;

estrutura flexível continua precisando de contrato;

chave ausente e JSON null não são iguais;

-> devolve JSONB;

->> devolve texto;

@> verifica contenção;

? verifica existência;

jsonb_set produz um novo documento;

|| não faz merge profundo;

GIN precisa de consultas conhecidas;

jsonb_ops suporta mais operadores;

jsonb_path_ops é especializado;

chave JSONB pode precisar ser promovida a coluna;

saída JSON não exige armazenamento JSONB.
```

A próxima aula será:

```text
307 - M12.37 - Projeto banco OS parte 1 modelo fisico
```

Nela, você iniciará o projeto consolidado do módulo.

O trabalho incluirá:

- leitura dos requisitos;
- definição das entidades;
- dicionário de dados;
- modelo físico;
- schemas;
- tabelas;
- chaves;
- constraints;
- relacionamentos;
- índices iniciais;
- scripts versionados;
- seed mínimo;
- checkpoints de integridade.

A decisão sobre JSONB será aplicada com rigor.

Nenhuma entidade central deverá ser escondida em um documento apenas para reduzir o número de tabelas.

---

# Material complementar

## Checkpoint final

- [ ] Mantive o núcleo relacional e usei JSONB apenas para metadados.
- [ ] Pratiquei operadores, validação, atualização e índices.
- [ ] Documentei quando promover uma chave a coluna.
- [ ] Limpei o schema e fiz o commit.

---

## Troubleshooting adicional

### invalid input syntax for type json

O documento possui aspas, vírgulas ou chaves inválidas.

Valide a sintaxe antes do cast.

### cannot extract elements from a scalar

A função de array recebeu string, número ou objeto.

Valide com `jsonb_typeof`.

### operator does not exist jsonb igual text

A consulta comparou JSONB com texto usando tipos incompatíveis.

Use `->>` para texto ou compare com JSONB explícito.

### jsonb_set nao criou caminho aninhado

Um componente anterior do caminho não existe.

Crie o objeto pai primeiro ou reconstrua o trecho com `jsonb_build_object`.

### indice GIN nao foi usado

A tabela é pequena, o filtro é pouco seletivo, o operador não é suportado pela operator class ou o custo estimado favorece leitura sequencial.

Não force o plano.

---

## Perguntas de revisao

1. Qual a diferença entre `json` e `jsonb`?
2. Quando usar `json`?
3. Quando usar `jsonb`?
4. JSONB elimina contrato?
5. Por que status central deve ser coluna?
6. O que `->` retorna?
7. O que `->>` retorna?
8. Para que serve `#>>`?
9. O que `@>` verifica?
10. O que `?` verifica?
11. Chave ausente é igual a JSON null?
12. Para que serve `jsonb_typeof`?
13. O que `jsonb_set` faz?
14. `||` faz merge profundo?
15. Para que serve índice GIN?
16. O que é `jsonb_ops`?
17. O que é `jsonb_path_ops`?
18. Quando criar índice de expressão?
19. API JSON exige armazenamento JSONB?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Texto preservado versus representação binária consultável.
2. Quando a forma textual precisa ser preservada.
3. Quando o documento será consultado, alterado ou indexado.
4. Não.
5. Precisa de tipo, constraint, índice e consultas estáveis.
6. JSON ou JSONB.
7. Texto.
8. Extrair texto por caminho.
9. Contenção de estrutura e valor.
10. Existência de chave ou elemento string.
11. Não.
12. Identificar o tipo JSONB.
13. Retorna documento com caminho atualizado.
14. Não.
15. Indexar múltiplos componentes do documento.
16. Operator class padrão e mais ampla.
17. Operator class especializada em menos operadores.
18. Para chave escalar consultada com frequência.
19. Não.
20. Projeto banco OS parte 1.

---

## Desafio opcional

Modele um catálogo de produtos com atributos variáveis.

Requisitos:

```text
Produto possui código, nome, categoria e preço relacionais;

categoria ELETRONICO possui voltagem e potência;

categoria MOVEL possui material e dimensões;

categoria TECIDO possui cor e composição;

atributos raros podem variar.
```

Defina:

- quais campos ficam em colunas;
- quais ficam em tabela própria;
- quais podem ficar em JSONB;
- constraints;
- contrato;
- índices;
- estratégia para promover uma chave;
- estratégia para consulta por categoria;
- limites de tamanho;
- riscos de update.

Não implemente o projeto principal da aula 307.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 306 - M12.36 - JSONB no PostgreSQL quando usar e quando evitar

- Diferenciei os tipos `json` e `jsonb`.
- Entendi que JSONB não substitui modelagem relacional.
- Mantive identidade, vínculos, status, valores e datas em colunas.
- Usei JSONB para metadados opcionais e payloads variáveis.
- Validei a raiz do documento com `jsonb_typeof`.
- Criei constraints para chaves opcionais conhecidas.
- Diferenciei chave ausente de JSON null.
- Pratiquei `->`, `->>`, `#>` e `#>>`.
- Pratiquei contenção com `@>`.
- Pratiquei existência com `?`, `?|` e `?&`.
- Expandi arrays com `jsonb_array_elements_text`.
- Expandi objetos com `jsonb_each`.
- Atualizei documentos com `jsonb_set`.
- Usei concatenação e remoção de chaves.
- Entendi que concatenação não realiza merge profundo.
- Gerei 30 mil eventos sintéticos.
- Criei índice GIN para payloads.
- Criei índice B-tree de expressão para uma chave escalar.
- Diferenciei `jsonb_ops` de `jsonb_path_ops`.
- Analisei sinais de abuso de JSONB.
- Construí JSON de saída a partir de tabelas relacionais.
- Removi o schema exclusivo do laboratório.
- Próxima aula: projeto banco OS parte 1 — modelo físico.
```

---

## Referencia tecnica curta

```text
json:
texto validado.

jsonb:
documento binário consultável.

->:
JSONB.

->>:
texto.

@>:
contenção.

?:
existência.

jsonb_set:
atualização de caminho.

GIN:
índice de componentes.

jsonb_ops:
mais operadores.

jsonb_path_ops:
mais especializado.

Regra:
núcleo relacional, extensão documental.
```

Regra final:

```text
use JSONB para variacao documental real, mas preserve em colunas e tabelas tudo que precisa de identidade, relacionamento, integridade e consulta previsivel.
```
