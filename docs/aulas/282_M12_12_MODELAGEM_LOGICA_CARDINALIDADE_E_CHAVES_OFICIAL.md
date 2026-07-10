# 282 - M12.12 - Modelagem logica cardinalidade e chaves

## Apresentacao da aula

Na aula 281, você definiu a fronteira do domínio e construiu um modelo conceitual para:

```text
Cliente;
Produto;
Ordem de Serviço;
Atividade;
Técnico;
Evento da Ordem de Serviço.
```

Você descreveu entidades, atributos, identidades conceituais, relacionamentos, cardinalidades iniciais e regras de negócio sem começar por tabelas ou tipos SQL.

Agora vamos transformar esse entendimento em um modelo lógico relacional.

O modelo lógico ocupa a ponte entre:

```text
modelo conceitual:
o que existe no negócio.

modelo físico:
como será implementado no PostgreSQL.
```

Nesta aula, você vai decidir:

- quais relações lógicas existirão;
- quais atributos pertencem a cada relação;
- quais atributos identificam uma ocorrência;
- quais chaves são candidatas;
- qual chave será escolhida como chave primária lógica;
- quais chaves permanecerão alternativas;
- onde surgem chaves estrangeiras;
- como representar relacionamentos 1:1, 1:N e N:N;
- como a opcionalidade afeta a estrutura;
- quando uma entidade associativa é necessária;
- como registrar cardinalidade mínima e máxima;
- como validar o modelo antes do DDL.

Ainda não vamos escrever:

```sql
CREATE TABLE
```

Também não vamos escolher:

```text
bigint;
uuid;
varchar;
numeric;
date;
timestamptz;
índices;
nomes físicos de constraints.
```

Essas são decisões do modelo físico e da implementação no PostgreSQL.

A aula também não aprofundará primeira, segunda e terceira forma normal. A normalização será o tema central da aula 283.

O objetivo desta etapa é produzir um desenho lógico consistente, capaz de ser implementado depois sem depender de improviso.

Ao final, você deverá conseguir:

- diferenciar entidade conceitual de relação lógica;
- transformar entidades em relações;
- definir atributos lógicos;
- reconhecer superchaves e chaves candidatas;
- escolher uma chave primária lógica;
- registrar chaves alternativas;
- propagar chaves em relacionamentos 1:N;
- avaliar relacionamentos 1:1;
- criar entidade associativa para N:N;
- representar opcionalidade;
- distinguir chave simples e composta;
- construir um dicionário lógico;
- desenhar um diagrama lógico;
- revisar o modelo antes da normalização.

---

## Onde estamos na formacao

A sequência atual do M12 é:

```text
280:
joins e multiplicidade.

281:
modelagem conceitual.

282:
modelagem lógica, cardinalidade e chaves.

283:
normalização em primeira, segunda e terceira forma normal.

284:
relacionamento um para muitos na prática.

285:
relacionamento muitos para muitos na prática.
```

Na aula 280, você observou que uma ordem podia aparecer várias vezes em um join porque possuía várias atividades.

Na aula 281, você descreveu conceitualmente:

```text
uma Ordem de Serviço possui zero ou muitas Atividades;
cada Atividade pertence a exatamente uma Ordem de Serviço.
```

Agora essa regra precisa ser traduzida para uma estrutura lógica.

Exemplo inicial:

```text
ORDEM_SERVICO
- ordem_servico_id
- codigo
- status
- ...

ATIVIDADE
- atividade_id
- ordem_servico_id
- codigo
- ...
```

O atributo `ordem_servico_id` em `ATIVIDADE` representa a referência lógica à ordem.

Neste momento, ele não possui tipo PostgreSQL nem constraint física. Ele apenas registra a estrutura relacional esperada.

A progressão é:

```text
regra de negócio;
cardinalidade;
estrutura lógica;
implementação física;
consulta.
```

Quando essa ordem é ignorada, o banco pode até funcionar, mas o modelo se torna difícil de explicar e evoluir.

---

## Objetivo pratico

Você vai criar o laboratório:

```text
labs/m12/aula-282-modelagem-logica-cardinalidade-chaves
```

Estrutura final:

```text
labs
└── m12
    └── aula-282-modelagem-logica-cardinalidade-chaves
        ├── README.md
        ├── 01-mapeamento-conceitual-logico.md
        ├── 02-dicionario-logico.md
        ├── 03-chaves-candidatas-e-primarias.md
        ├── 04-cardinalidades-e-propagacao.md
        ├── 05-entidades-associativas.md
        ├── 06-modelo-logico.md
        └── 07-revisao-do-modelo-logico.md
```

O laboratório continuará documental.

Você vai:

1. revisar o modelo conceitual da aula 281;
2. mapear cada entidade para uma relação lógica;
3. organizar atributos;
4. identificar chaves candidatas;
5. escolher chaves primárias lógicas;
6. registrar chaves alternativas;
7. propagar referências em relacionamentos 1:N;
8. analisar um relacionamento 1:1;
9. transformar um relacionamento N:N em entidade associativa;
10. desenhar o modelo lógico;
11. revisar redundâncias e dependências;
12. preparar a aula de normalização.

Nenhum arquivo SQL será criado.

---

## Conceito essencial

### Modelo logico

Modelo lógico descreve a organização dos dados segundo um paradigma, neste caso o modelo relacional.

Ele representa:

```text
relações;
atributos;
chaves;
referências;
cardinalidades;
opcionalidade;
regras estruturais.
```

Ele ainda não depende de detalhes específicos do PostgreSQL.

Exemplo lógico:

```text
CLIENTE (
    cliente_id,
    nome,
    documento,
    email,
    situacao
)
```

A notação indica uma relação chamada `CLIENTE` com seus atributos.

Ela não informa ainda:

```text
tipo de cada coluna;
tamanho;
schema;
default;
check;
índice;
sequence.
```

### Relacao logica

No modelo relacional, uma relação representa um conjunto de tuplas com a mesma estrutura.

Na prática, ela costuma originar uma tabela física.

Exemplo:

```text
PRODUTO (
    produto_id,
    codigo,
    nome,
    valor,
    situacao
)
```

Use a palavra relação para discutir o modelo lógico.

Use tabela quando estiver falando da implementação física.

A diferença ajuda a evitar decisões prematuras.

### Tupla e atributo

Uma tupla é uma ocorrência da relação.

Exemplo conceitual de uma tupla de Cliente:

```text
cliente_id:
C001.

nome:
Hospital Vida.

documento:
93000000000002.
```

Um atributo é uma propriedade definida para todas as tuplas da relação.

No modelo físico, tupla e atributo normalmente correspondem a linha e coluna.

Nesta aula, o foco é a estrutura lógica.

### Mapeamento de entidade para relacao

Uma entidade conceitual com identidade própria normalmente origina uma relação.

Exemplo:

```text
Entidade conceitual:
Cliente.

Relação lógica:
CLIENTE.
```

Atributos conceituais tornam-se atributos lógicos:

```text
Nome;
Documento;
Email;
Situação.
```

Resultado:

```text
CLIENTE (
    cliente_id,
    nome,
    documento,
    email,
    situacao
)
```

O atributo `cliente_id` representa a identidade lógica escolhida.

A escolha do tipo físico ficará para outra etapa.

### Identidade logica

Identidade lógica é o conjunto de atributos escolhido para distinguir uma tupla das demais.

Exemplo:

```text
cliente_id
```

A identidade lógica precisa ser:

- única;
- estável;
- mínima;
- obrigatória;
- adequada para referência.

Ela pode ser baseada em:

```text
chave natural;
chave substituta;
combinação de atributos.
```

O modelo lógico registra a escolha sem decidir ainda como o valor será gerado fisicamente.

### Superchave

Superchave é qualquer conjunto de atributos capaz de identificar unicamente uma tupla.

Considere:

```text
CLIENTE (
    cliente_id,
    documento,
    email,
    nome
)
```

Se `cliente_id` e `documento` são únicos, então podem existir superchaves como:

```text
{cliente_id}

{documento}

{cliente_id, nome}

{documento, email}
```

Algumas superchaves possuem atributos desnecessários.

A chave candidata busca a identificação mínima.

### Chave candidata

Chave candidata é uma superchave mínima.

Mínima significa:

```text
se um atributo for removido, o conjunto deixa de identificar unicamente.
```

Exemplo:

```text
cliente_id;
documento.
```

Ambos podem ser candidatos quando cada um é único e obrigatório.

O conjunto:

```text
cliente_id + nome
```

não é candidato se `cliente_id` sozinho já identifica.

### Chave primaria logica

Entre as chaves candidatas, uma é escolhida como chave primária lógica.

Exemplo:

```text
PK:
cliente_id.
```

Critérios para escolha:

- estabilidade;
- simplicidade;
- tamanho lógico;
- ausência de significado mutável;
- facilidade de referência;
- baixo risco de alteração;
- clareza no modelo.

Documento pode ser chave candidata, mas pode sofrer correção, mudança de formato ou regra externa.

Por isso, `cliente_id` pode ser escolhido como primary key lógica e `documento` permanecer como chave alternativa.

### Chave alternativa

Chave alternativa é uma chave candidata que não foi escolhida como primária.

Exemplo:

```text
CLIENTE

PK:
cliente_id.

AK:
documento.
```

`AK` significa alternate key.

No modelo físico, uma chave alternativa normalmente será protegida por `UNIQUE` e, quando obrigatória, `NOT NULL`.

Nesta aula, registre a regra, sem escrever a constraint física.

### Chave natural

Chave natural utiliza um atributo de negócio.

Exemplos possíveis:

```text
documento do cliente;
código do produto;
código da ordem.
```

Vantagens:

- possui significado conhecido;
- pode já ser usado por integrações;
- evita identidade artificial em alguns casos.

Riscos:

- pode mudar;
- pode ter regra externa;
- pode ser sensível;
- pode ser grande;
- pode deixar de ser único;
- pode ser corrigido.

### Chave substituta

Chave substituta é criada para identificar a tupla.

Exemplos conceituais:

```text
cliente_id;
produto_id;
ordem_servico_id.
```

Ela não substitui a necessidade de proteger códigos de negócio.

Exemplo:

```text
ORDEM_SERVICO

PK:
ordem_servico_id.

AK:
codigo.
```

A chave substituta protege identidade estável.

O código continua sendo uma regra de negócio.

### Chave simples

Chave simples possui um atributo.

Exemplo:

```text
PK CLIENTE:
cliente_id.
```

Ela tende a facilitar referências.

Isso não significa que toda relação deva obrigatoriamente usar chave simples.

### Chave composta

Chave composta possui mais de um atributo.

Exemplo:

```text
ORDEM_SERVICO_PRODUTO (
    ordem_servico_id,
    produto_id,
    quantidade
)

PK:
ordem_servico_id + produto_id.
```

A combinação identifica a associação.

Nenhum dos atributos isoladamente é suficiente.

Chaves compostas são comuns em entidades associativas, mas uma entidade associativa também pode receber uma chave substituta quando o domínio ou a implementação justificar.

### Chave estrangeira logica

Chave estrangeira lógica é um atributo ou conjunto de atributos que referencia a chave de outra relação.

Exemplo:

```text
ORDEM_SERVICO (
    ordem_servico_id,
    cliente_id,
    produto_id,
    codigo,
    status
)

FK cliente_id -> CLIENTE.cliente_id

FK produto_id -> PRODUTO.produto_id
```

Neste nível, a foreign key descreve a referência.

A sintaxe física `REFERENCES` será produzida apenas na implementação.

### Cardinalidade maxima

Cardinalidade máxima descreve a quantidade máxima de ocorrências relacionadas.

Exemplos:

```text
1:
no máximo uma.

N:
várias.
```

Relacionamento:

```text
Cliente 1:N Ordem de Serviço.
```

Leitura:

```text
um Cliente pode relacionar-se com várias Ordens;
cada Ordem relaciona-se com um Cliente.
```

### Cardinalidade minima

Cardinalidade mínima descreve a participação obrigatória.

Valores comuns:

```text
0:
participação opcional.

1:
participação obrigatória.
```

Exemplo:

```text
Cliente:
0..N Ordens.

Ordem:
1..1 Cliente.
```

Isso significa:

```text
um cliente pode existir sem ordem;

uma ordem precisa possuir exatamente um cliente.
```

### Notacao min max

A notação:

```text
0..1
1..1
0..N
1..N
```

combina mínimo e máximo.

Leitura:

```text
0..1:
zero ou uma ocorrência.

1..1:
exatamente uma.

0..N:
zero ou muitas.

1..N:
uma ou muitas.
```

O modelo lógico deve registrar ambos os lados do relacionamento.

### Relacionamento 1 para N

Exemplo:

```text
CLIENTE 1 ---- N ORDEM_SERVICO
```

Regra de mapeamento:

```text
a chave do lado 1 é propagada para o lado N.
```

Resultado:

```text
CLIENTE (
    cliente_id,
    ...
)

ORDEM_SERVICO (
    ordem_servico_id,
    cliente_id,
    ...
)
```

`cliente_id` em `ORDEM_SERVICO` é foreign key lógica.

O lado N recebe a referência porque cada ordem pertence a um cliente.

### Opcionalidade no 1 para N

Considere:

```text
um Técnico pode executar várias Atividades;

uma Atividade pode estar sem Técnico.
```

Resultado lógico:

```text
ATIVIDADE (
    atividade_id,
    tecnico_id,
    ...
)
```

A referência `tecnico_id` é opcional.

No modelo físico, isso poderá significar coluna anulável.

Por enquanto, registre:

```text
FK opcional.
```

### Relacionamento 1 para 1

Exemplo hipotético:

```text
Ordem de Serviço possui zero ou um Laudo Final;

cada Laudo Final pertence a exatamente uma Ordem.
```

Possibilidades lógicas:

1. propagar a chave da Ordem para `LAUDO_FINAL`;
2. usar a chave da Ordem também como chave do Laudo;
3. unir os atributos na mesma relação, quando os ciclos e regras justificarem.

Exemplo separado:

```text
LAUDO_FINAL (
    ordem_servico_id,
    conclusao,
    emitido_em
)

PK:
ordem_servico_id.

FK:
ordem_servico_id -> ORDEM_SERVICO.
```

A relação 1:1 não deve ser criada apenas para separar grupos visuais de campos.

Ela precisa representar ciclo de vida, opcionalidade, segurança, volume ou responsabilidade própria.

### Relacionamento N para N

Considere:

```text
uma Atividade pode exigir várias Competências;

uma Competência pode ser exigida por várias Atividades.
```

Não é possível resolver isso com uma única foreign key em um dos lados sem perder multiplicidade.

O relacionamento precisa tornar-se uma relação associativa.

### Entidade associativa

Resultado lógico:

```text
ATIVIDADE_COMPETENCIA (
    atividade_id,
    competencia_id,
    nivel_requerido
)
```

Referências:

```text
FK atividade_id -> ATIVIDADE.

FK competencia_id -> COMPETENCIA.
```

Chave possível:

```text
PK:
atividade_id + competencia_id.
```

A entidade associativa também pode possuir atributos próprios, como:

```text
nivel_requerido;
obrigatoria;
observacao.
```

Isso mostra que o relacionamento pode carregar informação.

### Relacionamento com atributo

No modelo conceitual, uma relação pode possuir atributos.

Exemplo:

```text
Técnico é atribuído a Atividade.
```

A atribuição pode possuir:

```text
momento da atribuição;
papel;
principal;
motivo;
momento da remoção.
```

Nesse caso, a simples foreign key `tecnico_id` em `ATIVIDADE` pode ser insuficiente.

Uma entidade associativa pode ser melhor:

```text
ATRIBUICAO_TECNICO (
    atividade_id,
    tecnico_id,
    atribuido_em,
    removido_em,
    principal
)
```

Essa decisão depende do histórico e das regras do domínio.

No modelo inicial, manteremos `tecnico_id` opcional em `ATIVIDADE`, mas registraremos `ATRIBUICAO_TECNICO` como evolução possível.

### Atributo multivalorado

Na aula 281, Telefone foi identificado como possível atributo multivalorado de Cliente.

No modelo lógico, ele pode tornar-se relação dependente:

```text
TELEFONE_CLIENTE (
    telefone_cliente_id,
    cliente_id,
    numero,
    tipo,
    principal
)
```

Ou usar chave composta, dependendo da regra.

O ponto central:

```text
não armazene vários valores em um único atributo lógico.
```

A normalização aprofundará essa decisão na aula 283.

### Atributo composto

Endereço conceitual pode ser decomposto em atributos:

```text
logradouro;
numero;
complemento;
bairro;
cidade;
estado;
cep.
```

Ou tornar-se uma relação própria quando:

- houver múltiplos endereços;
- existir reutilização;
- houver histórico;
- outras entidades referenciarem o endereço.

O modelo lógico torna explícita a escolha.

### Atributo derivado

Atributos derivados normalmente não precisam ser armazenados na relação lógica principal.

Exemplo:

```text
duracao_real =
fim_real - inicio_real.
```

No dicionário lógico, marque:

```text
derivado;
origem do cálculo;
necessidade de persistência ainda não definida.
```

A normalização e as necessidades de consulta ajudarão a decidir.

### Chaves e estabilidade

Uma chave primária lógica deve permanecer estável.

Evite escolher como PK um atributo que:

- muda com frequência;
- depende de outra organização;
- contém informação sensível;
- possui formatação variável;
- pode ser reutilizado;
- ainda não tem regra de unicidade confirmada.

O código de negócio pode continuar como alternate key.

### Decisao logica versus decisao fisica

O modelo lógico precisa ser preciso sem se tornar específico demais.

Decisões lógicas:

```text
Ordem possui identidade própria;
Código da ordem é único;
Cliente da ordem é obrigatório;
Técnico da atividade é opcional;
Atividade possui código único dentro da ordem.
```

Decisões físicas:

```text
identidade será bigint ou UUID;
código usará text ou varchar;
FK terá nome específico;
será criado índice na FK;
sequence começará em determinado valor.
```

Separar os níveis evita que uma preferência tecnológica esconda a regra de negócio.

Também facilita implementar o mesmo modelo em outro SGBD sem redefinir o significado das relações.

### Rastreabilidade entre os modelos

Cada decisão lógica deve apontar para sua origem conceitual.

Exemplo:

```text
Regra conceitual:
Toda Atividade pertence a exatamente uma Ordem.

Decisão lógica:
ATIVIDADE recebe ordem_servico_id como FK obrigatória.
```

Outro exemplo:

```text
Regra conceitual:
Uma Atividade pode aguardar atribuição.

Decisão lógica:
tecnico_id permanece como FK opcional.
```

Essa rastreabilidade ajuda a revisar o modelo com pessoas de negócio. Se uma regra mudar, você consegue localizar quais relações e chaves precisam ser reavaliadas.

### Nomeacao logica

Use nomes consistentes:

```text
CLIENTE;
PRODUTO;
ORDEM_SERVICO;
ATIVIDADE;
TECNICO;
EVENTO_ORDEM_SERVICO.
```

Atributos de identidade:

```text
cliente_id;
produto_id;
ordem_servico_id;
atividade_id;
tecnico_id;
evento_ordem_servico_id.
```

Esses nomes indicam o papel sem decidir o tipo físico.

### Dicionario logico

O dicionário lógico documenta cada relação e atributo.

Colunas úteis:

| Relação | Atributo | Papel | Obrigatório lógico? | Chave | Referência | Observação |
|---|---|---|---|---|---|---|
| CLIENTE | cliente_id | Identidade | Sim | PK | - | Chave substituta |
| CLIENTE | documento | Identificador de negócio | Sim | AK | - | Único |
| ORDEM_SERVICO | cliente_id | Cliente da ordem | Sim | FK | CLIENTE | Participação obrigatória |
| ATIVIDADE | tecnico_id | Técnico responsável | Não | FK | TECNICO | Pode aguardar atribuição |

O dicionário reduz ambiguidade antes do DDL.

### Modelo logico inicial do dominio

Uma primeira versão será:

```text
CLIENTE (
    cliente_id,
    nome,
    documento,
    email,
    situacao
)

PRODUTO (
    produto_id,
    codigo,
    nome,
    valor,
    situacao
)

TECNICO (
    tecnico_id,
    codigo,
    nome,
    documento,
    email,
    tipo,
    situacao
)

ORDEM_SERVICO (
    ordem_servico_id,
    cliente_id,
    produto_id,
    codigo,
    status,
    prioridade,
    data_agendada,
    inicio_previsto,
    valor_previsto,
    descricao_problema,
    criado_em
)

ATIVIDADE (
    atividade_id,
    ordem_servico_id,
    tecnico_id,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista,
    inicio_real,
    fim_real
)

EVENTO_ORDEM_SERVICO (
    evento_ordem_servico_id,
    ordem_servico_id,
    tipo,
    descricao,
    ocorrido_em
)
```

Esse modelo será revisado na aula 283.

Não o trate como versão definitiva.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-282-modelagem-logica-cardinalidade-chaves"

Set-Location `
  "labs\m12\aula-282-modelagem-logica-cardinalidade-chaves"
```

### 2. Copiar as decisoes conceituais

Abra os documentos da aula 281.

Não copie apenas o diagrama.

Liste:

- entidades;
- atributos;
- identidades conceituais;
- relacionamentos;
- cardinalidades;
- opcionalidades;
- regras;
- dúvidas abertas.

Esses itens serão a entrada do modelo lógico.

### 3. Criar 01-mapeamento-conceitual-logico.md

Crie:

```text
01-mapeamento-conceitual-logico.md
```

Use a tabela:

| Elemento conceitual | Decisão lógica | Justificativa |
|---|---|---|
| Cliente | Relação `CLIENTE` | Possui identidade e ciclo de vida |
| Produto | Relação `PRODUTO` | É referência independente |
| Ordem de Serviço | Relação `ORDEM_SERVICO` | Entidade central |
| Atividade | Relação `ATIVIDADE` | Possui identidade e depende da ordem |
| Técnico | Relação `TECNICO` | Existe independentemente |
| Evento da Ordem | Relação `EVENTO_ORDEM_SERVICO` | Várias ocorrências por ordem |

Depois registre:

```text
Status:
atributo nesta versão.

Telefone:
relação dependente candidata, fora do núcleo inicial.

Agendamento:
ainda tratado como atributos da ordem;
histórico de reagendamento permanece como dúvida de evolução.

Duração real:
atributo derivado.
```

### 4. Criar 02-dicionario-logico.md

Crie:

```text
02-dicionario-logico.md
```

Para cada relação, use:

| Atributo | Significado | Obrigatório lógico? | Papel de chave | Referência | Derivado? |
|---|---|---|---|---|---|

Preencha as seis relações.

Não informe tipos PostgreSQL.

Use:

```text
PK;
AK;
FK;
nenhuma.
```

Exemplo para `CLIENTE`:

| Atributo | Significado | Obrigatório lógico? | Papel de chave | Referência | Derivado? |
|---|---|---|---|---|---|
| cliente_id | Identidade estável | Sim | PK | - | Não |
| documento | Identificador de negócio | Sim | AK | - | Não |
| nome | Nome reconhecido | Sim | - | - | Não |
| email | Canal eletrônico | Não | AK opcional | - | Não |
| situacao | Participação em novos fluxos | Sim | - | - | Não |

### 5. Criar 03-chaves-candidatas-e-primarias.md

Crie:

```text
03-chaves-candidatas-e-primarias.md
```

Para cada relação, registre:

```text
superchaves relevantes;
chaves candidatas;
primary key escolhida;
alternate keys;
justificativa;
riscos.
```

Decisões iniciais:

```text
CLIENTE:
PK cliente_id;
AK documento;
AK email quando informado.

PRODUTO:
PK produto_id;
AK codigo.

TECNICO:
PK tecnico_id;
AK codigo;
AK documento quando informado.

ORDEM_SERVICO:
PK ordem_servico_id;
AK codigo.

ATIVIDADE:
PK atividade_id;
AK ordem_servico_id + codigo.

EVENTO_ORDEM_SERVICO:
PK evento_ordem_servico_id;
sem alternate key confirmada.
```

Explique por que cada código de negócio não foi escolhido automaticamente como PK.

### 6. Criar 04-cardinalidades-e-propagacao.md

Crie:

```text
04-cardinalidades-e-propagacao.md
```

Registre cada relacionamento.

#### Cliente e Ordem

```text
CLIENTE:
0..N ordens.

ORDEM_SERVICO:
1..1 cliente.

Propagação:
cliente_id entra em ORDEM_SERVICO como FK obrigatória.
```

#### Produto e Ordem

```text
PRODUTO:
0..N ordens.

ORDEM_SERVICO:
1..1 produto.

Propagação:
produto_id entra em ORDEM_SERVICO como FK obrigatória.
```

#### Ordem e Atividade

```text
ORDEM_SERVICO:
0..N atividades.

ATIVIDADE:
1..1 ordem.

Propagação:
ordem_servico_id entra em ATIVIDADE como FK obrigatória.
```

#### Técnico e Atividade

```text
TECNICO:
0..N atividades.

ATIVIDADE:
0..1 técnico.

Propagação:
tecnico_id entra em ATIVIDADE como FK opcional.
```

#### Ordem e Evento

```text
ORDEM_SERVICO:
0..N eventos.

EVENTO_ORDEM_SERVICO:
1..1 ordem.

Propagação:
ordem_servico_id entra em EVENTO_ORDEM_SERVICO como FK obrigatória.
```

### 7. Criar 05-entidades-associativas.md

Crie:

```text
05-entidades-associativas.md
```

Modele o exemplo:

```text
Atividade exige Competência.

Competência pode ser exigida por várias Atividades.
```

Relações:

```text
COMPETENCIA (
    competencia_id,
    codigo,
    nome
)

ATIVIDADE_COMPETENCIA (
    atividade_id,
    competencia_id,
    nivel_requerido,
    obrigatoria
)
```

Registre:

```text
PK composta:
atividade_id + competencia_id.

FKs:
atividade_id -> ATIVIDADE;
competencia_id -> COMPETENCIA.
```

Depois analise a alternativa:

```text
atividade_competencia_id como PK substituta;
combinação atividade_id + competencia_id como AK.
```

Explique vantagens e custos sem escolher tipo físico.

### 8. Criar 06-modelo-logico.md

Crie:

```text
06-modelo-logico.md
```

Adicione a notação textual completa:

```text
CLIENTE (
    PK cliente_id,
    AK documento,
    AK email,
    nome,
    situacao
)

PRODUTO (
    PK produto_id,
    AK codigo,
    nome,
    valor,
    situacao
)

TECNICO (
    PK tecnico_id,
    AK codigo,
    AK documento,
    nome,
    email,
    tipo,
    situacao
)

ORDEM_SERVICO (
    PK ordem_servico_id,
    FK cliente_id -> CLIENTE,
    FK produto_id -> PRODUTO,
    AK codigo,
    status,
    prioridade,
    data_agendada,
    inicio_previsto,
    valor_previsto,
    descricao_problema,
    criado_em
)

ATIVIDADE (
    PK atividade_id,
    FK ordem_servico_id -> ORDEM_SERVICO,
    FK opcional tecnico_id -> TECNICO,
    AK ordem_servico_id + codigo,
    codigo,
    descricao,
    status,
    valor_mao_obra,
    duracao_prevista,
    inicio_real,
    fim_real
)

EVENTO_ORDEM_SERVICO (
    PK evento_ordem_servico_id,
    FK ordem_servico_id -> ORDEM_SERVICO,
    tipo,
    descricao,
    ocorrido_em
)
```

### 9. Criar o diagrama logico

No mesmo arquivo, adicione:

```mermaid
erDiagram
    CLIENTE ||--o{ ORDEM_SERVICO : possui
    PRODUTO ||--o{ ORDEM_SERVICO : referencia
    ORDEM_SERVICO ||--o{ ATIVIDADE : possui
    TECNICO o|--o{ ATIVIDADE : executa
    ORDEM_SERVICO ||--o{ EVENTO_ORDEM_SERVICO : registra

    CLIENTE {
        logical_id cliente_id PK
        business_key documento AK
        business_key email AK
        attribute nome
        attribute situacao
    }

    PRODUTO {
        logical_id produto_id PK
        business_key codigo AK
        attribute nome
        attribute valor
        attribute situacao
    }

    ORDEM_SERVICO {
        logical_id ordem_servico_id PK
        logical_id cliente_id FK
        logical_id produto_id FK
        business_key codigo AK
        attribute status
        attribute prioridade
        attribute data_agendada
    }

    ATIVIDADE {
        logical_id atividade_id PK
        logical_id ordem_servico_id FK
        logical_id tecnico_id FK
        business_key codigo
        attribute status
    }

    TECNICO {
        logical_id tecnico_id PK
        business_key codigo AK
        attribute nome
        attribute situacao
    }

    EVENTO_ORDEM_SERVICO {
        logical_id evento_ordem_servico_id PK
        logical_id ordem_servico_id FK
        attribute tipo
        attribute ocorrido_em
    }
```

Os rótulos `logical_id`, `business_key` e `attribute` não são tipos físicos.

Eles apenas ajudam a leitura do diagrama.

### 10. Criar 07-revisao-do-modelo-logico.md

Crie:

```text
07-revisao-do-modelo-logico.md
```

Use o checklist:

```text
Cada relação possui finalidade?

Cada relação possui PK lógica?

As chaves candidatas foram registradas?

A PK é mínima e estável?

Códigos de negócio permanecem protegidos como AK?

Toda FK aponta para uma chave candidata?

Relacionamentos 1:N propagaram a chave para o lado N?

Referências opcionais foram marcadas?

Existe relacionamento N:N sem entidade associativa?

Existe atributo multivalorado ainda dentro de uma relação?

Existe grupo repetitivo?

Existe atributo derivado armazenado sem decisão?

Há dependência de detalhes PostgreSQL?

O modelo está pronto para análise de normalização?
```

Responda item por item.

### 11. Criar README.md

Crie:

```text
README.md
```

Registre:

```text
Título:
Aula 282 - Modelagem logica cardinalidade e chaves.

Origem:
modelo conceitual da aula 281.

Objetivo:
transformar conceitos em relações, atributos, chaves e referências lógicas.

Regra:
não escrever DDL nem escolher tipos PostgreSQL.

Entregáveis:
mapeamento, dicionário, chaves, cardinalidades, associativas, diagrama e revisão.

Próxima aula:
normalização em primeira, segunda e terceira forma normal.
```

---

## Entendendo o que foi feito

### Conceitos viraram relacoes logicas

Cliente, Produto, Ordem, Atividade, Técnico e Evento passaram a possuir uma estrutura relacional explícita.

Ainda assim, o modelo não depende de PostgreSQL.

### Identidade foi separada de codigo

Você escolheu PKs lógicas substitutas e manteve documentos e códigos como alternate keys.

Isso preserva identidade estável sem abandonar regras de negócio.

### Cardinalidade definiu propagacao

Nos relacionamentos 1:N, a chave do lado 1 foi propagada para o lado N.

A opcionalidade determinou se a referência lógica é obrigatória ou opcional.

### N para N exigiu relacao associativa

O relacionamento Atividade–Competência não foi representado por uma lista dentro de um atributo.

Ele ganhou uma relação própria capaz de armazenar também atributos do relacionamento.

### O modelo esta pronto para ser questionado

A aula 283 vai analisar:

- grupos repetitivos;
- atomicidade;
- dependências parciais;
- dependências transitivas;
- redundância;
- anomalias de inserção, atualização e exclusão.

O modelo lógico é uma hipótese estruturada, não uma verdade imutável.

---

## Erros comuns importantes

### Escolher chave pelo formato atual

Um código curto e único hoje pode mudar no futuro.

Avalie estabilidade e regra de negócio.

### Propagar a chave para o lado errado

Em 1:N, a referência normalmente fica no lado N.

Revise a leitura do relacionamento nos dois sentidos.

### Representar N para N com uma lista

Uma lista de IDs em um atributo enfraquece integridade e consulta.

Use entidade associativa.

### Confundir opcionalidade com ausencia de regra

Uma referência opcional deve ser justificada pelo ciclo de vida.

Não deixe todas as FKs opcionais por conveniência.

### Adicionar tipos fisicos cedo demais

Se a discussão começou por `bigint`, `uuid` ou `varchar`, retorne à decisão lógica.

---

## Comandos uteis

Esta aula não possui SQL.

Para revisar arquivos:

```powershell
Get-ChildItem -Recurse `
  "labs\m12\aula-282-modelagem-logica-cardinalidade-chaves"

git status
git diff
```

---

## Exercicio guiado

### Parte 1 - Modelar Telefone do Cliente

Transforme o atributo multivalorado em relação lógica.

Defina:

```text
nome da relação;
PK;
FK;
alternate key;
atributos;
cardinalidade;
opcionalidade.
```

Considere:

```text
tipo;
numero;
principal;
confirmado;
observacao.
```

Explique se `numero` sozinho pode ser chave candidata.

### Parte 2 - Modelar Agendamento

Considere que uma Ordem pode ser reagendada várias vezes.

Modele:

```text
AGENDAMENTO_ORDEM
```

Avalie atributos:

```text
agendamento_id;
ordem_servico_id;
data;
periodo;
situacao;
motivo;
criado_em.
```

Defina cardinalidade, PK, FKs e possíveis alternate keys.

Não implemente.

### Parte 3 - Modelar Atribuicao de Tecnico

Substitua temporariamente `tecnico_id` em `ATIVIDADE` por:

```text
ATRIBUICAO_TECNICO
```

Considere:

```text
atividade_id;
tecnico_id;
atribuido_em;
removido_em;
principal;
motivo.
```

Responda:

1. o relacionamento é N:N ao longo do tempo?
2. a associação possui identidade própria?
3. a PK deve ser composta ou substituta?
4. como impedir duas atribuições principais simultâneas?
5. qual regra dependerá do modelo físico ou aplicação?

### Parte 4 - Comparar chaves

Para `ORDEM_SERVICO`, compare:

```text
PK codigo.

PK ordem_servico_id com codigo como AK.
```

Analise:

- estabilidade;
- tamanho;
- integração;
- exposição;
- correção;
- referências;
- legibilidade.

Registre sua decisão.

### Parte 5 - Revisar cardinalidades

Para cada relacionamento principal, escreva quatro frases:

```text
mínimo do lado A;
máximo do lado A;
mínimo do lado B;
máximo do lado B.
```

Não use apenas o desenho.

### Parte 6 - Preparar normalizacao

Escolha duas relações e responda:

1. cada atributo contém um único valor?
2. existe grupo repetitivo?
3. algum atributo depende apenas de parte de uma chave composta?
4. algum atributo depende de outro atributo não chave?
5. há redundância?
6. quais anomalias podem surgir?

Não tente concluir formalmente 1FN, 2FN ou 3FN. Apenas prepare as perguntas da aula 283.

---

## Criterios de aceite

- o laboratório oficial da aula 282 existe;
- nenhum arquivo SQL foi criado;
- nenhuma estrutura física foi alterada;
- o modelo conceitual da aula 281 foi usado como origem;
- seis entidades foram mapeadas para relações;
- atributos lógicos foram documentados;
- superchaves e chaves candidatas foram compreendidas;
- uma PK lógica foi escolhida para cada relação;
- alternate keys foram registradas;
- chaves naturais e substitutas foram comparadas;
- chaves simples e compostas foram analisadas;
- FKs lógicas foram registradas;
- cardinalidades mínimas e máximas foram documentadas;
- referências obrigatórias e opcionais foram diferenciadas;
- relacionamentos 1:N propagaram a chave para o lado N;
- um relacionamento 1:1 foi analisado;
- um relacionamento N:N virou entidade associativa;
- atributos de relacionamento foram reconhecidos;
- Telefone, Agendamento e Atribuição de Técnico foram modelados no exercício;
- nenhum tipo PostgreSQL foi escolhido;
- o diagrama lógico foi criado;
- o dicionário lógico foi preenchido;
- o modelo foi revisado para a normalização;
- README e documentos estão prontos;
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
  labs/m12/aula-282-modelagem-logica-cardinalidade-chaves
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "docs(m12): estruturar modelo logico e chaves"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
relações lógicas;
chaves;
cardinalidade;
opcionalidade;
entidades associativas;
dicionário lógico.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou o modelo conceitual em uma estrutura relacional lógica.

Aprendeu:

```text
relação;
tupla;
atributo lógico;
superchave;
chave candidata;
primary key lógica;
alternate key;
chave natural;
chave substituta;
chave simples;
chave composta;
foreign key lógica;
cardinalidade mínima;
cardinalidade máxima;
opcionalidade;
entidade associativa.
```

As regras principais foram:

```text
entidade conceitual normalmente origina relação lógica;

PK deve ser mínima, única e estável;

código de negócio pode permanecer como alternate key;

em 1:N, a referência normalmente fica no lado N;

opcionalidade precisa refletir o ciclo de vida;

N:N exige relação associativa;

atributos multivalorados não devem ser listas internas;

modelo lógico não escolhe detalhes PostgreSQL;

toda decisão deve ser registrada no dicionário.
```

A próxima aula será:

```text
283 - M12.13 - Normalizacao primeira segunda e terceira forma normal
```

Nela, você vai estudar:

- redundância;
- anomalia de inserção;
- anomalia de atualização;
- anomalia de exclusão;
- dependência funcional;
- primeira forma normal;
- segunda forma normal;
- terceira forma normal;
- dependência parcial;
- dependência transitiva;
- decomposição;
- preservação de informação;
- revisão do modelo lógico desta aula.

Não escreva DDL ainda.

Primeiro valide se o modelo lógico representa dados atômicos e dependências corretas.

---

# Material complementar

## Checkpoint final

- [ ] Transformei entidades conceituais em relações lógicas.
- [ ] Defini PKs, AKs e FKs lógicas.
- [ ] Registrei cardinalidade, opcionalidade e entidades associativas.
- [ ] Revisei o modelo e fiz o commit recomendado.

---

## Troubleshooting adicional

### Muitas chaves candidatas

Nem toda combinação única útil é uma chave candidata.

Verifique minimalidade, obrigatoriedade e estabilidade.

### Nenhuma chave natural confiavel

Use uma chave substituta lógica e mantenha regras de negócio como alternate keys quando possível.

### Entidade associativa sem atributos

Ela ainda pode ser necessária para resolver N:N.

A ausência de atributos próprios não elimina sua função estrutural.

### Chave composta ficou grande

Avalie uma PK substituta e mantenha a combinação natural como AK.

Não decida apenas por conveniência do código.

### Relacao logica parece tabela fisica

Remova tipos, defaults, índices e detalhes do SGBD.

Mantenha significado, atributos e chaves.

---

## Perguntas de revisao

1. O que é modelo lógico?
2. Qual a diferença entre relação e tabela?
3. O que é uma tupla?
4. O que é superchave?
5. O que é chave candidata?
6. O que significa minimalidade?
7. Como escolher uma primary key lógica?
8. O que é alternate key?
9. Qual a diferença entre chave natural e substituta?
10. O que é chave composta?
11. O que é foreign key lógica?
12. Como mapear 1:N?
13. Como representar opcionalidade?
14. Como mapear 1:1?
15. Como mapear N:N?
16. O que é entidade associativa?
17. Quando um relacionamento possui atributos?
18. Por que não escolher tipos PostgreSQL nesta aula?

---

## Roteiro de resposta

1. Estrutura relacional independente da implementação física.
2. Relação é conceito lógico; tabela é implementação.
3. Uma ocorrência da relação.
4. Conjunto que identifica unicamente.
5. Superchave mínima.
6. Nenhum atributo pode ser removido sem perder unicidade.
7. Escolha a candidata mais estável e adequada para referência.
8. Candidata não escolhida como PK.
9. Natural vem do negócio; substituta é criada para identidade.
10. Chave com mais de um atributo.
11. Referência lógica à chave de outra relação.
12. Propague a chave do lado 1 para o lado N.
13. Marque a FK como obrigatória ou opcional.
14. Avalie propagação, PK compartilhada ou união das relações.
15. Crie relação associativa.
16. Relação que representa a associação.
17. Quando a associação possui informação própria.
18. Tipos pertencem ao modelo físico.

---

## Desafio opcional

Modele logicamente:

```text
Checklist;
Pergunta;
Resposta;
Regra de dependência entre perguntas;
Versão do Checklist.
```

Defina:

- relações;
- PKs;
- AKs;
- FKs;
- cardinalidades;
- opcionalidades;
- entidade associativa quando necessária;
- dúvidas para normalização.

Não escreva DDL.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 282 - M12.12 - Modelagem logica cardinalidade e chaves

- Transformei o modelo conceitual em relações lógicas.
- Diferenciei relação lógica de tabela física.
- Estudei superchaves, chaves candidatas e minimalidade.
- Escolhi primary keys lógicas estáveis.
- Mantive códigos e documentos como alternate keys quando aplicável.
- Comparei chaves naturais e substitutas.
- Diferenciei chaves simples e compostas.
- Registrei foreign keys lógicas e propagação em relações 1:N.
- Modelei opcionalidade com cardinalidade mínima e máxima.
- Analisei relacionamento 1:1.
- Transformei relacionamento N:N em entidade associativa.
- Modelei atributos de relacionamento.
- Criei dicionário e diagrama lógico sem detalhes PostgreSQL.
- Preparei o modelo para análise de normalização.
- Próxima aula: primeira, segunda e terceira forma normal.
```

---

## Referencia tecnica curta

```text
Relacao:
estrutura lógica.

Tupla:
ocorrência.

Superchave:
identifica unicamente.

Chave candidata:
superchave mínima.

PK:
candidata escolhida.

AK:
candidata alternativa.

FK:
referência a outra relação.

1:N:
chave do lado 1 vai para o lado N.

N:N:
cria entidade associativa.

Opcionalidade:
mínimo zero ou um.

Cardinalidade:
mínimo e máximo.
```

Regra final:

```text
o modelo lógico transforma regras do domínio em estrutura relacional antes do DDL.
```
