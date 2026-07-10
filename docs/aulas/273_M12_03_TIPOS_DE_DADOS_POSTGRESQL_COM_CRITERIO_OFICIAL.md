# 273 - M12.03 - Tipos de dados PostgreSQL com criterio

## Apresentacao da aula

Na aula 272, você organizou a rotina de trabalho com PostgreSQL. Você reutilizou o servidor criado na aula 271, configurou o DBeaver, trabalhou com `psql`, criou os schemas `app` e `auditoria`, executou scripts versionados e aprendeu a confirmar database, usuário, schema e `search_path` antes de executar comandos.

Agora vamos responder uma pergunta que parece simples, mas influencia integridade, desempenho, clareza e manutenção:

```text
Qual tipo de dado deve representar cada informação?
```

Escolher tipo não é preencher uma formalidade. O tipo comunica o significado do dado, limita valores possíveis, define operações válidas e afeta como o PostgreSQL armazena, compara e transforma informações.

Um sistema pode funcionar mesmo com escolhas ruins, por exemplo:

```text
datas salvas como texto;
valores monetários salvos como ponto flutuante;
status representado por boolean quando existem vários estados;
UUID salvo em varchar;
números de documento tratados como números;
timestamp sem decisão sobre fuso horário;
char usado por hábito;
varchar com tamanhos arbitrários.
```

O problema aparece depois: consultas ficam confusas, conversões se espalham, cálculos geram resultados inesperados e dados inconsistentes entram no sistema.

Nesta aula, você vai estudar os tipos mais importantes para um backend corporativo e criar critérios para escolhê-los.

Não vamos criar tabelas. A aula 274 será dedicada a `CREATE TABLE`, `ALTER TABLE` e `DROP TABLE`. Hoje, os tipos serão explorados com literais, casts, expressões e funções do PostgreSQL.

Ao final, você terá um catálogo inicial de decisões para o domínio de Ordem de Serviço e estará preparado para aplicar essas escolhas no primeiro DDL do módulo.

---

## Onde estamos na formacao

O início do M12 segue esta progressão:

```text
271:
banco, SGBD, SQL, PostgreSQL e modelo relacional.

272:
DBeaver, psql, schemas e rotina de trabalho.

273:
tipos de dados PostgreSQL com critério.

274:
DDL para criar, alterar e remover estruturas.

275:
primary key, foreign key e integridade referencial.

276:
not null, unique, check e default.
```

Essa ordem evita um erro comum: criar tabelas antes de entender o significado das colunas.

Antes de escrever:

```sql
CREATE TABLE ...
```

você deve conseguir justificar decisões como:

```text
Por que este campo é bigint?
Por que este valor é numeric e não double precision?
Por que esta informação é text?
Por que esta data é date?
Por que este evento é timestamptz?
Por que este identificador é uuid?
Por que este status não é boolean?
```

No desenvolvimento Java, você já aprendeu que tipos importam. Um `BigDecimal` não possui o mesmo propósito de um `double`; um `LocalDate` não representa a mesma coisa que um instante; um identificador não deve ser tratado como quantidade.

No PostgreSQL, o raciocínio também precisa ser explícito. O mapeamento com Java ficará para o M13.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-273-tipos-dados-postgresql-criterio
```

Estrutura final:

```text
labs
└── m12
    └── aula-273-tipos-dados-postgresql-criterio
        ├── README.md
        ├── catalogo-decisoes-tipos.md
        └── sql
            ├── 00_verificar_contexto.sql
            ├── 01_numericos.sql
            ├── 02_texto_booleano.sql
            ├── 03_data_hora.sql
            └── 04_uuid_e_inspecao.sql
```

O laboratório vai identificar tipos, comparar escolhas comuns, observar precisão e fuso horário e registrar critérios para o domínio de Ordem de Serviço.

Você usará o mesmo PostgreSQL das aulas anteriores:

```text
container:
formacao-postgres-m12

database:
formacao_java

usuario:
formacao

schemas:
app e auditoria
```

O Docker Compose não será reensinado. Ele será apenas usado para garantir que o servidor esteja ativo.

---

## Conceito essencial

### Tipo representa significado

Um tipo de dado define um conjunto de valores e as operações que fazem sentido para esses valores.

Considere:

```text
"2026-07-10"
```

Como texto, esse valor é apenas uma sequência de caracteres.

Como `date`, o PostgreSQL entende que ele representa uma data de calendário. Isso permite:

- validar o formato;
- comparar datas;
- somar períodos;
- extrair ano, mês e dia;
- ordenar cronologicamente;
- rejeitar datas impossíveis.

Agora considere:

```text
"06454-000"
```

Esse valor contém dígitos, mas é um CEP. Não é quantidade e não participa de cálculo.

Salvar como número seria uma escolha ruim porque:

- o zero inicial tem significado;
- hífen pode fazer parte da apresentação;
- somar dois CEPs não faz sentido;
- comparar CEPs numericamente não representa uma regra de negócio.

O tipo deve refletir o significado, não apenas a aparência.

---

### Literal, inferencia e cast

Um literal é um valor escrito diretamente em uma instrução.

Exemplos:

```sql
42
```

```sql
199.90
```

```sql
'ABERTA'
```

```sql
'2026-07-10'
```

Valores entre aspas começam como literais de texto sem um tipo de domínio explícito. O contexto da expressão ajuda o PostgreSQL a determinar como interpretá-los.

Quando você quer tornar a decisão explícita, pode usar cast.

Forma SQL padrão:

```sql
CAST('2026-07-10' AS date)
```

Forma curta do PostgreSQL:

```sql
'2026-07-10'::date
```

As duas expressam:

```text
interprete este valor como date.
```

Para inspecionar o tipo de uma expressão, usaremos:

```sql
pg_typeof(...)
```

Exemplo:

```sql
SELECT pg_typeof('2026-07-10'::date);
```

Resultado esperado:

```text
date
```

O cast será usado nesta aula para estudar tipos. Conversões complexas, limpeza de dados e migrações serão tratadas em contextos futuros.

---

### Inteiros: smallint, integer e bigint

PostgreSQL possui tipos inteiros com diferentes faixas:

```text
smallint:
inteiro de 2 bytes.

integer:
inteiro de 4 bytes.

bigint:
inteiro de 8 bytes.
```

Eles armazenam números exatos sem casas decimais.

Exemplos de dados adequados:

```text
quantidade de tentativas;
número de prioridade;
ano;
contador;
posição;
identificador numérico.
```

A escolha não deve ser baseada apenas em economizar alguns bytes.

Critérios:

```text
smallint:
faixa pequena e comprovadamente limitada.

integer:
quantidade comum com faixa suficiente.

bigint:
identidade ou contador que pode crescer muito ao longo do tempo.
```

Em sistemas corporativos, `bigint` costuma ser uma escolha segura para identificadores numéricos de entidades que podem crescer por anos. Isso não significa que todo número deve ser `bigint`.

Uma quantidade como:

```text
numero_de_reagendamentos
```

provavelmente não precisa de uma faixa enorme.

Já uma identidade global da tabela pode crescer continuamente.

Importante:

```text
identificador não é quantidade.
```

Mesmo quando os dois usam tipos inteiros, o significado é diferente.

Nesta aula, não estudaremos geração automática de identificadores. `identity`, sequências e estratégias de chave aparecerão junto com DDL e primary key.

---

### Numeric para valores exatos

`numeric` e `decimal` representam números decimais exatos. No PostgreSQL, os dois nomes possuem comportamento equivalente.

Exemplo:

```sql
199.90::numeric
```

Você também pode definir precisão e escala:

```text
numeric(12,2)
```

Leitura:

```text
12 dígitos no total;
2 dígitos após a vírgula decimal;
até 10 dígitos antes da parte decimal.
```

Exemplo adequado:

```text
valor_previsto numeric(12,2)
```

Para valores monetários e cálculos que exigem exatidão decimal, `numeric` é normalmente a escolha mais segura.

Isso se conecta ao uso de `BigDecimal` em Java, mas o mapeamento será estudado apenas no módulo de persistência.

Critérios:

```text
use numeric:
quando o valor precisa ser decimal e exato.

defina precisão e escala:
quando o domínio possui limite conhecido e útil.

não escolha escala por hábito:
entenda quantas casas a regra realmente exige.
```

Nem todo decimal precisa de duas casas.

Exemplos:

```text
dinheiro:
frequentemente 2 casas, dependendo da moeda e regra.

percentual:
pode exigir 2, 4 ou mais casas.

peso:
pode exigir 3 casas.

taxa financeira:
pode exigir maior precisão.
```

---

### Real e double precision

`real` e `double precision` representam ponto flutuante.

Eles são úteis quando aproximação é aceitável e a faixa ou velocidade de cálculo é mais importante que a representação decimal exata.

Exemplos possíveis:

```text
cálculos científicos;
medidas aproximadas;
estatísticas;
telemetria;
coordenadas, conforme o caso.
```

Não são a escolha padrão para dinheiro.

Uma operação aparentemente simples pode produzir uma aproximação binária:

```sql
0.1::double precision + 0.2::double precision
```

O resultado pode não ser representado exatamente como `0.3`.

Isso não é defeito do PostgreSQL. É uma característica de ponto flutuante binário.

Critério:

```text
numeric:
exatidão decimal.

double precision:
aproximação aceitável.

real:
menor precisão; use apenas quando houver motivo claro.
```

Nunca escolha `double precision` para valor financeiro apenas porque em alguma linguagem o tipo parece mais familiar.

---

### O tipo money

PostgreSQL possui o tipo `money`, mas ele traz decisões ligadas à configuração monetária e formato de entrada e saída do ambiente.

Em aplicações de backend, uma estratégia mais explícita costuma ser:

```text
valor:
numeric com precisão e escala definidas.

moeda:
coluna separada, como código ISO, quando o sistema trabalha com múltiplas moedas.
```

Nesta formação, usaremos `numeric` nos exemplos financeiros.

Adote `money` somente com justificativa técnica clara.

---

### Text, varchar e char

PostgreSQL oferece:

```text
text
character varying ou varchar
character ou char
```

#### text

`text` armazena texto de tamanho variável sem um limite declarado na coluna.

É uma excelente escolha padrão para:

```text
nome;
descrição;
observação;
código textual;
documento;
e-mail;
mensagem.
```

O fato de usar `text` não significa que a aplicação aceita qualquer tamanho. Regras de limite podem existir no domínio e no banco. Constraints serão estudadas na aula 276.

#### varchar sem tamanho

```text
varchar
```

Sem tamanho explícito, também aceita texto variável sem limite declarado.

Na prática, é muito semelhante a `text`.

#### varchar(n)

```text
varchar(50)
```

Impõe um limite de caracteres.

Use quando o limite representa uma regra real e estável.

Exemplo possível:

```text
um código externo cujo contrato permite no máximo 30 caracteres.
```

Não use tamanhos arbitrários como:

```text
varchar(255)
```

apenas porque esse número aparece em muitos projetos.

Pergunte:

```text
255 vem de qual regra?
É limite técnico?
É contrato externo?
É decisão histórica sem justificativa?
```

#### char(n)

`char(n)` possui tamanho fixo e completa valores menores com espaços internamente.

Isso pode produzir comportamentos surpreendentes em comparação, comprimento e apresentação.

Use somente quando o formato fixo for realmente parte do domínio e o comportamento de preenchimento for desejado.

Na maioria dos campos corporativos comuns, `text` ou `varchar` são mais claros.

---

### Codigo, documento e telefone nao sao numeros

Alguns valores possuem apenas dígitos, mas não representam quantidade.

Exemplos:

```text
CPF;
CNPJ;
CEP;
telefone;
código de barras;
número de contrato;
código de ordem;
matrícula;
identificador externo.
```

Pergunta útil:

```text
faz sentido somar, multiplicar ou calcular média deste valor?
```

Se a resposta for não, provavelmente ele não deve ser um tipo numérico.

Outros sinais:

- pode começar com zero;
- pode conter letra;
- pode mudar de formato;
- possui pontuação;
- é comparado por igualdade;
- funciona como rótulo ou identidade.

No domínio de Ordem de Serviço:

```text
codigo_os:
text.

documento_cliente:
text.

telefone:
text.
```

A validação de formato será uma regra separada.

---

### Boolean

O tipo `boolean` representa:

```text
true
false
null, quando ausência for permitida
```

Use quando a pergunta de negócio é realmente binária.

Exemplos:

```text
ativo?
urgente?
possui_garantia?
aceitou_termos?
```

Evite usar boolean para esconder múltiplos estados.

Exemplo ruim:

```text
ordem_concluida boolean
```

Uma ordem pode estar:

```text
ABERTA
AGENDADA
EM_ATENDIMENTO
CONCLUIDA
CANCELADA
FRUSTRADA
```

Um boolean não representa essa variedade.

Também evite nomes ambíguos:

```text
status boolean
flag boolean
controle boolean
```

Prefira perguntas claras:

```text
ativo
urgente
bloqueado
```

A presença de `null` pode criar uma terceira situação. Por isso, obrigatoriedade e valor padrão precisam ser decididos conscientemente. Esse ponto será aprofundado na aula de constraints.

---

### Date

`date` representa uma data de calendário sem horário.

Exemplos adequados:

```text
data de nascimento;
data de vencimento;
dia agendado;
feriado;
competência mensal representada por uma data convencional.
```

Exemplo:

```sql
'2026-07-10'::date
```

Use `date` quando o horário não faz parte do significado.

Não transforme uma data simples em timestamp sem motivo.

Se o negócio pergunta:

```text
em qual dia?
```

`date` pode ser a escolha correta.

---

### Time

`time without time zone`, normalmente escrito apenas como `time`, representa um horário sem data.

Exemplos possíveis:

```text
hora de abertura de uma loja;
início de uma janela diária;
horário padrão de corte.
```

Um horário isolado pode ser insuficiente para representar um evento real.

```text
10:00
```

Não informa:

- o dia;
- o fuso;
- se houve horário de verão;
- qual instante ocorreu.

Por isso, não use `time` para registrar quando um evento aconteceu.

O tipo `time with time zone` existe, mas costuma ser evitado em novos modelos porque um horário isolado com deslocamento não representa adequadamente a maioria dos eventos de negócio.

---

### Timestamp without time zone

`timestamp without time zone`, frequentemente escrito apenas como `timestamp`, representa data e horário sem informação de fuso.

Exemplo:

```sql
'2026-07-10 10:30:00'::timestamp
```

Ele pode ser adequado quando o valor é deliberadamente local e não representa um instante global.

Exemplos possíveis:

```text
horário local planejado que será interpretado em um contexto conhecido;
agenda interna cuja zona é parte de outra regra;
valor importado de sistema legado sem fuso.
```

O risco é tratar o valor como se fosse um instante universal.

Se pessoas em fusos diferentes precisam enxergar o mesmo momento real, `timestamp` sem fuso exige cuidado adicional.

---

### Timestamp with time zone

`timestamp with time zone`, abreviado como `timestamptz`, representa um instante no tempo.

PostgreSQL normaliza internamente o instante e o apresenta conforme o fuso configurado na sessão.

Exemplo:

```sql
'2026-07-10 10:30:00-03'::timestamptz
```

O mesmo instante pode ser exibido de maneiras diferentes em sessões com fusos diferentes.

Isso é útil para:

```text
data e hora de criação;
última atualização;
momento de aprovação;
momento de envio;
momento de login;
registro de auditoria;
evento ocorrido.
```

Critério prático:

```text
se a pergunta é "quando isso aconteceu?":
timestamptz costuma ser a primeira opção a avaliar.
```

Não confunda:

```text
timestamptz:
instante real exibido conforme o fuso da sessão.

timestamp:
data e hora sem contexto de fuso.
```

---

### Interval

`interval` representa uma duração ou diferença temporal.

Exemplos:

```text
2 horas;
15 minutos;
3 dias;
1 mês.
```

Pode ser útil para:

```text
tempo estimado;
prazo adicional;
duração de atendimento;
janela;
tempo de espera.
```

Exemplo:

```sql
'2 hours 30 minutes'::interval
```

Não salve duração como texto se você precisa somar, comparar ou calcular.

Também não misture duração com instante.

```text
início:
timestamptz.

duração:
interval.

fim calculado:
início + duração.
```

---

### UUID

`uuid` armazena identificadores universais de 128 bits.

Exemplo:

```sql
'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
```

Vantagens de usar o tipo nativo:

- valida formato;
- representa claramente a intenção;
- evita tratar UUID como texto genérico;
- oferece armazenamento e operadores apropriados;
- facilita integração com sistemas que usam UUID.

Critérios possíveis:

```text
integração entre sistemas;
identificação gerada fora do banco;
identificador difícil de prever;
criação distribuída;
exposição pública sem sequência evidente.
```

UUID não é automaticamente melhor que `bigint`; essa decisão será retomada na aula de chaves. Se o dado já é UUID, use o tipo nativo em vez de `varchar`.

---

### Tipos especializados

PostgreSQL também possui tipos como `bytea`, `jsonb`, arrays, `inet`, ranges e XML. Eles são poderosos, mas exigem um problema real do domínio. JSONB terá uma aula específica no M12 e não será aprofundado agora.

Regra:

```text
tipo especializado deve resolver uma necessidade concreta.
```

### Null nao e um tipo

`null` representa ausência ou desconhecimento de valor.

Ele não é:

```text
zero;
texto vazio;
false;
data mínima;
código especial;
"NAO_INFORMADO".
```

Esses valores possuem significados diferentes.

Exemplo:

```text
data_conclusao = null:
a ordem ainda não foi concluída ou a data é desconhecida.

data_conclusao = 1900-01-01:
existe uma data, mesmo que tenha sido usada como valor artificial.
```

Usar valores artificiais para representar ausência cria confusão.

Por outro lado, permitir `null` em todo lugar também enfraquece o modelo.

A decisão correta depende da obrigatoriedade do dado. `NOT NULL` será estudado na aula 276.

---

### Escolha orientada por perguntas

Antes de escolher um tipo, pergunte:

1. O que este dado representa?
2. É identidade, quantidade, texto, instante, data ou duração?
3. Precisa de exatidão?
4. Pode começar com zero?
5. Participa de cálculo?
6. Precisa de fuso horário?
7. Possui limite real?
8. Pode estar ausente?
9. Existe tipo nativo mais expressivo?
10. Como esse dado será consultado e comparado?

O tipo correto nasce do significado e do uso, não de uma tabela de receitas.

---

## Mao na massa guiada

### 1. Confirmar o PostgreSQL ativo

Na raiz do repositório:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Se o container não estiver em execução, entre no laboratório da aula 271 e inicie o Compose:

```powershell
Set-Location `
  "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"

docker compose up -d
docker compose ps
```

Depois volte à raiz do repositório.

Não altere o `compose.yaml`. O servidor já está preparado.

---

### 2. Criar a estrutura do laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql"

Set-Location `
  "labs\m12\aula-273-tipos-dados-postgresql-criterio"
```

Estrutura inicial:

```text
.
└── sql
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
    current_schema() AS schema_atual,
    current_setting('TimeZone') AS fuso_sessao;

SHOW search_path;
```

Execute pela raiz do repositório:

```powershell
Set-Location ..\..\..

Get-Content -Raw `
  "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql\00_verificar_contexto.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Confirme:

```text
banco:
formacao_java.

usuario:
formacao.

schemas:
app e public no search_path configurado na aula anterior, conforme a sessão.

fuso:
valor atual da sessão.
```

Se o `search_path` não tiver sido alterado permanentemente na aula anterior, isso não é problema. O script existe para mostrar o contexto real.

---

### 4. Criar 01_numericos.sql

Crie:

```text
sql/01_numericos.sql
```

Conteúdo:

```sql
SELECT
    pg_typeof(10::smallint) AS tipo_smallint,
    pg_typeof(10::integer) AS tipo_integer,
    pg_typeof(10::bigint) AS tipo_bigint;

SELECT
    199.90::numeric(12, 2) AS valor_exato,
    pg_typeof(199.90::numeric(12, 2)) AS tipo_valor;

SELECT
    0.1::numeric + 0.2::numeric AS soma_numeric,
    0.1::double precision + 0.2::double precision AS soma_double;

SELECT
    15::integer AS quantidade_tentativas,
    9876543210::bigint AS identificador_exemplo,
    7.5::numeric(5, 2) AS percentual_exemplo;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql\01_numericos.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Observe:

- os três tipos inteiros são distintos;
- `numeric(12,2)` mantém escala definida;
- `numeric` representa a soma decimal exatamente;
- `double precision` trabalha com aproximação binária;
- o mesmo formato visual não significa o mesmo tipo.

No DBeaver, execute o mesmo arquivo e compare a apresentação dos resultados.

---

### 5. Criar 02_texto_booleano.sql

Crie:

```text
sql/02_texto_booleano.sql
```

Conteúdo:

```sql
SELECT
    'OS-2026-0001'::text AS codigo_os,
    pg_typeof('OS-2026-0001'::text) AS tipo_codigo;

SELECT
    '06454000'::text AS cep_preservado,
    '00123456789'::text AS documento_preservado;

SELECT
    'SP'::char(5) AS char_fixo,
    length('SP'::char(5)) AS comprimento_logico,
    octet_length('SP'::char(5)) AS bytes_com_preenchimento;

SELECT
    true::boolean AS ativo,
    false::boolean AS bloqueado,
    pg_typeof(true::boolean) AS tipo_booleano;

SELECT
    'ABERTA'::text AS status_ordem,
    true::boolean AS urgente;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql\02_texto_booleano.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Pontos de observação:

```text
CEP e documento:
zeros iniciais permanecem.

char(5):
possui comportamento de tamanho fixo.

boolean:
representa pergunta binária.

status:
continua textual porque possui mais de dois estados.
```

A validação definitiva de status será tratada com constraints e modelagem em aulas futuras.

---

### 6. Criar 03_data_hora.sql

Crie:

```text
sql/03_data_hora.sql
```

Conteúdo:

```sql
SELECT
    '2026-07-10'::date AS data_agendada,
    '08:30:00'::time AS horario_inicio,
    '2 hours 30 minutes'::interval AS duracao_estimada;

SELECT
    '2026-07-10 10:30:00'::timestamp AS horario_local_sem_fuso,
    pg_typeof('2026-07-10 10:30:00'::timestamp) AS tipo_sem_fuso;

SET TIME ZONE 'America/Sao_Paulo';

SELECT
    current_setting('TimeZone') AS fuso_sessao,
    '2026-07-10 10:30:00-03'::timestamptz AS instante_exibido;

SET TIME ZONE 'UTC';

SELECT
    current_setting('TimeZone') AS fuso_sessao,
    '2026-07-10 10:30:00-03'::timestamptz AS mesmo_instante_exibido;

SET TIME ZONE 'America/Sao_Paulo';

SELECT
    '2026-07-10 08:00:00-03'::timestamptz
        + '2 hours 30 minutes'::interval AS termino_estimado;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql\03_data_hora.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Observe que o mesmo `timestamptz` aparece de formas diferentes em `America/Sao_Paulo` e `UTC`, mas representa o mesmo instante.

O comando:

```sql
SET TIME ZONE ...
```

altera apenas a sessão atual.

Ao finalizar a execução, outra conexão pode possuir outro fuso. Por isso, sempre verifique o contexto.

---

### 7. Criar 04_uuid_e_inspecao.sql

Crie:

```text
sql/04_uuid_e_inspecao.sql
```

Conteúdo:

```sql
SELECT
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid AS identificador,
    pg_typeof(
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
    ) AS tipo_identificador;

SELECT
    pg_typeof('texto livre'::text) AS tipo_texto,
    pg_typeof(100::bigint) AS tipo_inteiro,
    pg_typeof(19.90::numeric(12, 2)) AS tipo_decimal,
    pg_typeof('2026-07-10'::date) AS tipo_data,
    pg_typeof(now()) AS tipo_agora;

SELECT
    typname AS nome_interno,
    typtype AS categoria
FROM pg_type
WHERE typname IN (
    'bool',
    'date',
    'int4',
    'int8',
    'numeric',
    'text',
    'timestamp',
    'timestamptz',
    'uuid'
)
ORDER BY typname;
```

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql\04_uuid_e_inspecao.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

A consulta em `pg_type` apenas inspeciona o catálogo interno. Ela não altera o banco. Nomes como `int4`, `int8` e `bool` correspondem a `integer`, `bigint` e `boolean`; não é necessário memorizá-los.

---

### 8. Criar catalogo-decisoes-tipos.md

Crie:

```text
catalogo-decisoes-tipos.md
```

Adicione uma tabela de decisões:

| Dado do domínio | Tipo candidato | Justificativa inicial |
|---|---|---|
| identificador interno do cliente | `bigint` | identidade numérica com crescimento contínuo |
| nome do cliente | `text` | texto variável sem limite arbitrário nesta etapa |
| documento do cliente | `text` | identificador textual, pode possuir zero inicial e formatação |
| cliente ativo | `boolean` | pergunta binária |
| identificador externo | `uuid` | integração e identificação distribuída |
| código da ordem | `text` | código de negócio, não quantidade |
| status da ordem | `text` | possui vários estados; não é boolean |
| valor previsto | `numeric(12,2)` | valor decimal exato |
| data agendada | `date` | dia de calendário |
| início previsto | `time` | horário dentro do dia, quando separado da data |
| abertura da ordem | `timestamptz` | instante real de criação |
| duração estimada | `interval` | período de tempo |
| observação | `text` | conteúdo variável |
| quantidade de reagendamentos | `integer` | contador inteiro comum |
| urgente | `boolean` | regra binária clara |

Abaixo da tabela, registre:

```text
Estas são decisões candidatas.

Primary key, obrigatoriedade, limites, unicidade, defaults e relacionamentos serão definidos nas próximas aulas.

O tipo pode mudar se uma regra de negócio nova alterar o significado do dado.
```

Depois responda:

1. Por que `documento` não foi definido como número?
2. Por que `valor_previsto` não usa `double precision`?
3. Por que `status` não usa boolean?
4. Qual a diferença entre `data_agendada` e `abertura_da_ordem`?
5. Em que cenário `uuid` seria melhor que `bigint`?
6. Qual limite real justificaria `varchar(n)` em vez de `text`?

Use suas palavras.

---

### 9. Criar README.md

Crie:

```text
README.md
```

Inclua:

```text
Título:
Aula 273 - Tipos de dados PostgreSQL com critério.

Objetivo:
explorar tipos sem criar tabelas e registrar decisões para o domínio.

Pré-requisito:
container formacao-postgres-m12 em execução.

Execução:
usar DBeaver ou enviar cada arquivo ao psql com Get-Content e docker exec.

Regra:
não executar CREATE TABLE, ALTER TABLE ou DROP TABLE nesta aula.

Próximo passo:
aplicar as decisões no DDL da aula 274.
```

Também liste os scripts e o objetivo de cada um.

Não copie toda a teoria para o README. Ele deve funcionar como guia operacional do laboratório.

---

### 10. Executar todos os scripts

Na raiz do repositório:

```powershell
$base = "labs\m12\aula-273-tipos-dados-postgresql-criterio\sql"

Get-ChildItem "$base\*.sql" |
  Sort-Object Name |
  ForEach-Object {
    Write-Host "Executando $($_.Name)"

    Get-Content -Raw $_.FullName |
      docker exec -i formacao-postgres-m12 `
        psql -v ON_ERROR_STOP=1 `
        -U formacao `
        -d formacao_java
  }
```

A opção:

```text
ON_ERROR_STOP=1
```

faz o `psql` interromper a execução se um erro SQL ocorrer.

Isso evita que um script continue silenciosamente depois de uma falha.

O laboratório está correto quando todos os arquivos executam sem erro.

---

## Entendendo o que foi feito

### Tipos foram estudados sem tabelas

Você usou:

- literais;
- casts;
- expressões;
- `pg_typeof`;
- configurações de sessão;
- catálogo interno.

Isso foi suficiente para observar comportamento e semântica.

Na próxima aula, os mesmos tipos serão aplicados em colunas reais.

---

### O catálogo de decisões vem antes do DDL

O arquivo:

```text
catalogo-decisoes-tipos.md
```

separa decisão de implementação.

Primeiro você responde:

```text
o que o dado significa?
qual tipo representa esse significado?
```

Depois transforma a decisão em SQL.

Esse hábito reduz tabelas criadas por improviso.

---

### Tipo nativo comunica intencao

Compare:

```text
uuid:
identificador universal.

varchar:
texto genérico.
```

Compare:

```text
date:
data de calendário.

text:
sequência de caracteres.
```

Compare:

```text
numeric:
decimal exato.

double precision:
ponto flutuante aproximado.
```

O tipo torna o modelo expressivo.

---

### Exatidao tem custo e finalidade

`numeric` é adequado quando a exatidão decimal é parte da regra.

Ponto flutuante é adequado quando aproximação é aceitável.

A decisão não deve ser:

```text
sempre use numeric;
sempre use double.
```

A decisão deve ser baseada na natureza do cálculo.

---

### Fuso horario e parte do modelo

Salvar um evento temporal sem decidir sobre fuso cria ambiguidade.

Pergunte:

```text
é uma data?
é um horário local?
é um instante real?
é uma duração?
```

Cada resposta aponta para um tipo diferente.

---

## Erros comuns importantes

### Salvar valor monetario como double precision

Sintoma:

```text
diferenças inesperadas em soma, comparação ou arredondamento.
```

Correção:

```text
use numeric quando a regra exige decimal exato.
```

---

### Usar integer para documento, CEP ou telefone

Problemas:

- perde zeros iniciais;
- não representa o significado;
- pode exceder faixa;
- impede caracteres válidos;
- sugere operações matemáticas indevidas.

Correção:

```text
use tipo textual.
```

---

### Confundir timestamp e timestamptz

Problema:

```text
um horário local é tratado como instante global ou vice-versa.
```

Diagnóstico:

```sql
SELECT current_setting('TimeZone');
```

Correção:

```text
defina primeiro o significado temporal;
depois escolha o tipo.
```

---

### Usar boolean para status com varios estados

Problema:

```text
true e false não conseguem representar todo o fluxo.
```

Correção:

```text
modele o status como domínio próprio;
nesta etapa, text é apenas o candidato inicial.
```

---

### Definir varchar com tamanho arbitrario

Problema:

```text
o número não corresponde a uma regra real.
```

Correção:

```text
use text ou justifique o limite com contrato e regra de negócio.
```

---

## Comandos uteis

### Verificar contexto

```sql
SELECT
    current_database(),
    current_user,
    current_schema(),
    current_setting('TimeZone');

SHOW search_path;
```

### Inspecionar tipo

```sql
SELECT pg_typeof(199.90::numeric(12,2));
```

### Executar arquivo local

```powershell
Get-Content -Raw "caminho\arquivo.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -v ON_ERROR_STOP=1 `
    -U formacao `
    -d formacao_java
```

### Abrir psql

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

---

## Exercicio guiado

### Parte 1 - Escolher tipos para uma atividade

Adicione ao `catalogo-decisoes-tipos.md` os campos:

```text
id;
codigo;
descricao;
status;
data_execucao;
inicio_real;
fim_real;
duracao_prevista;
valor_mao_obra;
tecnico_externo_id;
possui_pendencia;
tentativas_contato.
```

Escolha um tipo candidato para cada campo e escreva uma justificativa.

Não defina constraint.

Não crie tabela.

---

### Parte 2 - Comparar duas escolhas

Escolha três pares:

```text
text vs varchar(n);
numeric vs double precision;
timestamp vs timestamptz;
bigint vs uuid;
boolean vs status textual.
```

Para cada par, escreva:

1. o que cada tipo representa;
2. qual escolheria no domínio;
3. qual regra poderia mudar a decisão.

---

### Parte 3 - Criar 05_exercicio.sql

Crie:

```text
sql/05_exercicio.sql
```

O arquivo deve:

- converter um código de OS para `text`;
- converter um valor para `numeric(12,2)`;
- converter uma data para `date`;
- converter um instante com offset para `timestamptz`;
- converter uma duração para `interval`;
- converter um identificador válido para `uuid`;
- exibir o tipo de cada expressão com `pg_typeof`.

Não use DDL.

---

### Parte 4 - Testar um erro controlado

No `psql`, execute:

```sql
SELECT 'nao-e-uuid'::uuid;
```

O PostgreSQL deve rejeitar o valor.

Leia a mensagem.

Depois execute um UUID válido.

O objetivo é perceber que o tipo protege o formato antes mesmo da criação de uma tabela.

Não coloque a instrução inválida no conjunto principal de scripts, porque a execução automatizada usa `ON_ERROR_STOP=1`.

---

### Parte 5 - Revisar as decisoes

Revise o catálogo e marque cada decisão como:

```text
alta confiança;
depende de regra;
será validada em aula futura.
```

Exemplos:

```text
valor monetário como numeric:
alta confiança.

tamanho máximo do código:
depende de contrato.

status como text:
será revisado com constraints e modelagem.
```

Nem toda decisão precisa ser tratada como definitiva.

---

## Criterios de aceite

- o laboratório oficial da aula 273 existe;
- o PostgreSQL das aulas anteriores foi reutilizado;
- nenhum arquivo cria tabela;
- os scripts executam com `ON_ERROR_STOP=1`;
- `pg_typeof` foi usado para inspecionar tipos;
- tipos inteiros foram comparados;
- `numeric` e `double precision` foram diferenciados;
- `text`, `varchar` e `char` foram compreendidos;
- documento, CEP e telefone foram tratados como texto;
- boolean foi limitado a perguntas binárias;
- `date`, `time`, `timestamp`, `timestamptz` e `interval` foram diferenciados;
- a mudança de exibição por fuso foi observada;
- o tipo `uuid` foi validado;
- o catálogo de decisões do domínio foi criado;
- o exercício de Atividade foi concluído;
- DDL, JDBC, JPA e Spring não foram antecipados;
- os arquivos estão prontos para commit.

---

## Commit recomendado

Na raiz do repositório:

```powershell
git status
git diff
```

Adicione somente o laboratório:

```powershell
git add `
  labs/m12/aula-273-tipos-dados-postgresql-criterio
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): estudar tipos PostgreSQL com criterio"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
exploração de tipos;
scripts de diagnóstico;
decisões de domínio;
preparação para DDL.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprendeu que escolher tipo é uma decisão de modelagem.

Você diferenciou:

```text
smallint, integer e bigint;
numeric e ponto flutuante;
text, varchar e char;
boolean e status;
date, time, timestamp e timestamptz;
instante e duração;
bigint e uuid;
null e valor artificial.
```

Também aplicou critérios ao domínio de Ordem de Serviço:

- código e documento são textos;
- valor financeiro exige decimal exato;
- status possui vários estados;
- data agendada não é igual a instante de abertura;
- duração não é timestamp;
- UUID deve usar tipo nativo;
- boolean deve responder uma pergunta binária.

Na prática, você criou scripts que exploram os tipos sem criar estruturas permanentes e documentou decisões candidatas antes de escrever DDL.

A próxima aula será:

```text
274 - M12.04 - DDL create table alter table drop table
```

Nela, você finalmente transformará decisões em estrutura física.

Você vai aprender:

- o que é DDL;
- como criar tabelas;
- como definir colunas e tipos;
- como alterar uma tabela;
- como remover estruturas com segurança;
- como inspecionar o resultado;
- como versionar um script estrutural;
- como diferenciar criação inicial de evolução.

Ainda não será a aula de primary key, foreign key ou constraints completas. Esses assuntos virão nas aulas 275 e 276.

Chegue à aula 274 com o catálogo revisado. O DDL será consequência das decisões, não um chute.

---

# Material complementar

## Checkpoint final

- [ ] Executei todos os scripts sem criar tabelas.
- [ ] Consigo justificar tipos numéricos, textuais e temporais.
- [ ] Completei o catálogo de decisões do domínio.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Numeric field overflow

Ao converter um valor para `numeric(p,s)`, o PostgreSQL pode informar que o valor excede a precisão.

Interpretação:

```text
a quantidade de dígitos antes e depois da parte decimal não cabe na definição.
```

Revise:

- precisão total;
- escala;
- faixa real do domínio.

Não aumente o tamanho automaticamente sem entender o dado.

---

### Invalid input syntax

Exemplo:

```text
invalid input syntax for type uuid
```

ou:

```text
invalid input syntax for type date
```

O valor não pode ser interpretado no tipo solicitado.

Revise o formato e a origem do dado.

O cast não corrige um valor inválido.

---

### Resultado de timestamptz parece diferente

Confira:

```sql
SELECT current_setting('TimeZone');
```

O instante pode estar correto e apenas ter sido exibido em outro fuso.

Compare explicitamente em duas sessões ou altere o fuso temporariamente.

---

### char mostra espacos inesperados

`char(n)` completa o valor até o tamanho fixo.

Isso é comportamento do tipo.

Se o preenchimento não é desejado, reavalie `text` ou `varchar`.

---

### DBeaver e psql exibem formatos diferentes

Clientes podem formatar valores de maneiras diferentes. Confirme o tipo com `pg_typeof`; a ferramenta visual não altera o valor nem o tipo.

---

## Perguntas de revisao

1. Por que tipo não deve ser escolhido apenas pela aparência do valor?
2. Quando `bigint` é mais adequado que `integer`?
3. Qual a diferença entre `numeric` e `double precision`?
4. Por que dinheiro normalmente não deve usar ponto flutuante?
5. Quando `varchar(n)` possui justificativa real?
6. Por que CEP e documento são textos?
7. Quando boolean é uma boa escolha?
8. Qual a diferença entre `date`, `timestamp` e `timestamptz`?
9. O que `interval` representa?
10. Por que UUID deve usar o tipo nativo?
11. O que `null` representa?
12. Por que o catálogo foi criado antes das tabelas?

---

## Roteiro de resposta

### 1. Significado

O tipo deve representar a semântica e as operações válidas, não apenas o formato visual.

### 2. Bigint

É adequado para identidades e contadores que podem crescer além da faixa de `integer`.

### 3. Numeric e double

`numeric` oferece decimal exato. `double precision` usa aproximação de ponto flutuante.

### 4. Dinheiro

Cálculos financeiros normalmente exigem exatidão decimal e regras claras de escala.

### 5. Varchar com limite

Use quando o limite vem de uma regra real, contrato ou restrição estável.

### 6. Identificadores textuais

CEP e documento não são quantidades, podem ter zeros iniciais e não participam de cálculo.

### 7. Boolean

Quando a regra é realmente binária e o nome expressa uma pergunta clara.

### 8. Tipos temporais

```text
date:
dia de calendário.

timestamp:
data e hora sem fuso.

timestamptz:
instante real exibido conforme o fuso da sessão.
```

### 9. Interval

Representa duração ou diferença temporal.

### 10. UUID nativo

Valida formato, comunica intenção e oferece representação apropriada.

### 11. Null

Representa ausência ou valor desconhecido, não zero ou texto vazio.

### 12. Catálogo

Permite justificar a modelagem antes de transformar decisões em DDL.

---

## Desafio opcional

Crie um segundo catálogo para:

```text
Pagamento
```

Considere os dados:

```text
id;
ordem_servico_id;
valor;
moeda;
status;
vencimento;
pago_em;
identificador_gateway;
tentativas;
estornado;
motivo_estorno;
criado_em.
```

Para cada campo, escolha um tipo candidato, justifique e marque decisões que dependem de regra futura. Não crie tabela.

Depois responda:

```text
pago_em deve ser date ou timestamptz?
status pode ser boolean?
moeda deve ficar separada do valor?
qual tipo representa o identificador do gateway?
```

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 273 - M12.03 - Tipos de dados PostgreSQL com criterio

- Estudei tipos PostgreSQL sem antecipar DDL.
- Diferenciei `smallint`, `integer` e `bigint`.
- Comparei `numeric` com `double precision`.
- Entendi por que valores monetários exigem exatidão decimal.
- Diferenciei `text`, `varchar` e `char`.
- Registrei que documento, CEP, telefone e códigos são dados textuais.
- Usei boolean apenas para regras realmente binárias.
- Diferenciei `date`, `time`, `timestamp`, `timestamptz` e `interval`.
- Observei o mesmo instante em fusos diferentes.
- Validei UUID usando o tipo nativo.
- Criei um catálogo de tipos candidatos para o domínio de Ordem de Serviço.
- Próxima aula: DDL com create table, alter table e drop table.
```

---

## Referencia tecnica curta

```text
Inteiros:
smallint, integer, bigint.

Decimal exato:
numeric ou decimal.

Ponto flutuante:
real e double precision.

Texto:
text, varchar e char.

Binário:
boolean.

Calendário:
date.

Horário:
time.

Data e hora local:
timestamp.

Instante:
timestamptz.

Duração:
interval.

Identificador universal:
uuid.
```

Regra final:

```text
escolha o tipo pelo significado, pelas operações e pelas regras do domínio.
```
