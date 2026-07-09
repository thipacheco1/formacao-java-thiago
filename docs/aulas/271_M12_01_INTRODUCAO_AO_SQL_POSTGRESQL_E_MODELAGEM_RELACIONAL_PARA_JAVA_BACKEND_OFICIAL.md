# 271 — M12.01 — Introdução ao SQL, PostgreSQL e modelagem relacional para Java Backend

## 1. Objetivo da aula

Na aula 270, você fechou oficialmente o M11.

Você revisou ferramentas profissionais como:

```text
Maven;
Git;
JUnit;
Mockito;
AssertJ;
JaCoCo;
Docker;
Docker Compose;
GitHub Actions;
pipeline Maven;
pipeline Docker;
Spotless;
Checkstyle;
SCA;
SBOM;
Dependabot;
Testcontainers;
WireMock;
ArchUnit.
```

Agora começa um novo bloco da formação:

```text
M12 — SQL, PostgreSQL e modelagem relacional
```

Este módulo é um dos pilares mais importantes para qualquer pessoa que quer ser backend Java de verdade.

Backend não é só criar classe Java.

Backend trabalha com dados.

E dados vivem em algum lugar.

Na maioria dos sistemas corporativos, esse lugar é um banco de dados relacional.

Nesta aula, vamos abrir o M12 com calma.

O objetivo não é decorar comandos SQL.

O objetivo é entender o papel do banco de dados dentro de uma aplicação backend.

Ao final desta aula, você deve conseguir:

```text
entender por que banco de dados é essencial para backend;
entender o que é SQL;
entender o que é PostgreSQL;
entender o que é banco relacional;
entender o que são tabelas, linhas e colunas;
entender o que são chaves primárias e estrangeiras;
entender o que são constraints;
entender a diferença entre banco, schema e tabela;
entender os grupos de comandos SQL: DDL, DML, DQL, DCL e TCL;
subir um PostgreSQL local com Docker Compose;
conectar no PostgreSQL usando psql;
executar os primeiros comandos SQL;
criar uma primeira tabela simples;
inserir dados;
consultar dados;
começar a pensar em modelagem relacional.
```

Esta aula é a porta de entrada.

Ainda não vamos estudar joins profundamente.

Ainda não vamos estudar índices profundamente.

Ainda não vamos entrar em transações profundamente.

Ainda não vamos usar Java para conectar no banco.

JDBC virá depois.

JPA virá depois.

Spring Boot virá bem depois.

Agora o foco é:

```text
entender banco de dados relacional e começar a praticar SQL com PostgreSQL.
```

---

## 2. Onde estamos na formação

Você está iniciando o módulo:

```text
M12 — SQL, PostgreSQL e modelagem relacional
```

A transição é importante.

No M11, você aprendeu ferramentas.

No M12, você começa a estudar dados.

A sequência do curso agora entra em um novo pilar:

```text
271 — Introdução ao SQL, PostgreSQL e modelagem relacional para Java Backend
272 — PostgreSQL com Docker Compose para estudos: psql, Adminer, scripts e reset controlado
273 — Bancos, schemas, tabelas, colunas e tipos de dados essenciais
274 — SELECT básico: leitura de dados, filtros, ordenação e limites
275 — INSERT, UPDATE e DELETE com responsabilidade
276 — Constraints: primary key, foreign key, unique, not null, check e default
277 — Relacionamentos 1:1, 1:N e N:N
278 — JOINs na prática
279 — GROUP BY, HAVING e funções agregadas
280 — Índices, performance inicial e EXPLAIN introdutório
```

Essa é uma previsão de continuidade do M12.

A ideia é construir a base aos poucos.

Você não vai aprender banco apenas como ferramenta auxiliar do Java.

Você vai aprender banco como parte do raciocínio backend.

---

## 3. Por que SQL é essencial para Java Backend

Um backend Java quase sempre precisa lidar com dados persistentes.

Exemplos:

```text
usuários;
clientes;
produtos;
pedidos;
contratos;
ordens de serviço;
pagamentos;
transações;
logs de negócio;
permissões;
históricos;
eventos;
configurações;
catálogos;
estoque;
faturas.
```

Se você não entende banco de dados, você fica dependente de framework.

Você até consegue escrever:

```java
repository.save(entidade);
```

Mas não entende:

```text
qual tabela recebeu o dado;
qual coluna foi usada;
qual constraint protegeu a regra;
qual índice ajudou a busca;
qual query foi gerada;
qual relacionamento foi consultado;
por que a consulta ficou lenta;
por que uma transação travou;
por que um dado duplicou;
por que uma foreign key falhou.
```

Um backend forte precisa entender o que acontece por baixo.

Framework ajuda.

Mas framework não substitui fundamento.

---

## 4. O que é SQL

SQL significa:

```text
Structured Query Language
```

Em português:

```text
Linguagem de Consulta Estruturada
```

SQL é uma linguagem usada para trabalhar com bancos de dados relacionais.

Com SQL, você consegue:

```text
criar estruturas;
criar tabelas;
inserir dados;
consultar dados;
atualizar dados;
excluir dados;
criar constraints;
criar índices;
controlar transações;
definir permissões.
```

Exemplos de comandos SQL:

```sql
select * from cliente;

insert into cliente (nome, documento)
values ('Cliente A', 'DOC-001');

update cliente
set nome = 'Cliente Atualizado'
where documento = 'DOC-001';

delete from cliente
where documento = 'DOC-001';
```

SQL parece simples no começo.

Mas em sistemas reais ele se torna uma ferramenta poderosa.

---

## 5. O que é PostgreSQL

PostgreSQL é um sistema gerenciador de banco de dados relacional.

Ele é muito usado em aplicações backend modernas.

Quando falamos:

```text
PostgreSQL
```

estamos falando do banco em si.

Quando falamos:

```text
SQL
```

estamos falando da linguagem usada para conversar com o banco.

A relação é:

```text
SQL:
linguagem.

PostgreSQL:
banco que entende SQL, com recursos próprios.
```

Além do PostgreSQL, existem outros bancos relacionais:

```text
MySQL;
MariaDB;
Oracle;
SQL Server;
H2;
DB2.
```

Cada banco tem diferenças.

Mas muitos fundamentos relacionais são comuns.

Nesta formação, vamos usar PostgreSQL porque ele é forte, profissional, gratuito, muito usado no mercado e excelente para estudar conceitos reais.

---

## 6. O que é banco de dados relacional

Banco relacional organiza dados em tabelas.

Uma tabela é parecida com uma planilha, mas muito mais poderosa, controlada e estruturada.

Exemplo de tabela:

```text
cliente
```

Com colunas:

```text
id;
nome;
documento;
ativo;
criado_em.
```

E linhas:

```text
1 | Cliente A | DOC-001 | true | 2026-07-09
2 | Cliente B | DOC-002 | true | 2026-07-09
```

No banco relacional, você cria relações entre tabelas.

Exemplo:

```text
cliente tem muitas ordens de serviço.
```

Isso pode ser modelado com duas tabelas:

```text
cliente;
ordem_servico.
```

A tabela `ordem_servico` guarda uma referência para o cliente.

Essa referência normalmente é feita por uma chave estrangeira.

---

## 7. Conceitos essenciais

### 7.1 Database

Database é o banco de dados.

Exemplo:

```text
formacao_java
```

Dentro de um servidor PostgreSQL, você pode ter vários databases.

Exemplo:

```text
postgres;
formacao_java;
kora_local;
aula271.
```

Cada database pode conter schemas, tabelas, funções, índices e outros objetos.

---

### 7.2 Schema

Schema é uma forma de organizar objetos dentro de um database.

No PostgreSQL, o schema padrão costuma ser:

```text
public
```

Então uma tabela pode estar em:

```text
public.cliente
```

Em sistemas maiores, schemas podem separar domínios ou módulos.

Exemplo:

```text
financeiro.transacao
atendimento.ordem_servico
catalogo.produto
```

Nesta aula, vamos usar o schema padrão.

---

### 7.3 Table

Table é tabela.

Tabela guarda dados de um tipo de entidade ou conceito.

Exemplos:

```text
cliente;
produto;
pedido;
ordem_servico;
contrato;
pagamento;
transacao.
```

Cada tabela possui colunas.

Cada linha representa um registro.

---

### 7.4 Column

Column é coluna.

Coluna define um atributo do registro.

Exemplo na tabela `cliente`:

```text
id;
nome;
documento;
ativo;
criado_em.
```

Cada coluna tem um tipo.

Exemplo:

```text
bigint;
varchar;
boolean;
timestamp;
numeric.
```

---

### 7.5 Row

Row é linha.

Linha é um registro da tabela.

Exemplo:

```text
id: 1
nome: Cliente A
documento: DOC-001
ativo: true
```

Cada linha representa uma ocorrência real do conceito da tabela.

---

### 7.6 Primary Key

Primary key é chave primária.

Ela identifica de forma única uma linha.

Exemplo:

```sql
id bigserial primary key
```

Isso significa:

```text
cada cliente terá um id único;
esse id identifica a linha;
não pode repetir;
não pode ser nulo.
```

Em backend, a chave primária é muito importante porque normalmente ela vira o identificador do objeto.

---

### 7.7 Foreign Key

Foreign key é chave estrangeira.

Ela cria relação entre tabelas.

Exemplo:

```text
ordem_servico.cliente_id aponta para cliente.id
```

Isso significa:

```text
uma ordem de serviço pertence a um cliente existente.
```

A foreign key protege integridade.

Ela impede, por exemplo, criar uma OS ligada a um cliente que não existe.

---

### 7.8 Constraint

Constraint é uma regra imposta pelo banco.

Exemplos:

```text
not null;
unique;
primary key;
foreign key;
check;
default.
```

Constraints são fundamentais porque protegem os dados.

Não confie apenas no Java.

O banco também precisa proteger regras essenciais.

Exemplo:

```text
documento de cliente não pode repetir.
```

Isso pode ser protegido com:

```sql
documento varchar(30) not null unique
```

---

## 8. Grupos de comandos SQL

SQL costuma ser dividido em grupos.

Essa divisão ajuda a entender o papel de cada comando.

### 8.1 DDL

DDL significa:

```text
Data Definition Language
```

São comandos de definição de estrutura.

Exemplos:

```sql
create table
alter table
drop table
create index
```

DDL mexe no desenho do banco.

---

### 8.2 DML

DML significa:

```text
Data Manipulation Language
```

São comandos para manipular dados.

Exemplos:

```sql
insert
update
delete
```

DML altera registros.

---

### 8.3 DQL

DQL significa:

```text
Data Query Language
```

É usado para consultar dados.

Principal comando:

```sql
select
```

Muitas pessoas colocam `select` dentro de DML, mas didaticamente é útil separar como DQL.

---

### 8.4 DCL

DCL significa:

```text
Data Control Language
```

Comandos relacionados a permissões.

Exemplos:

```sql
grant
revoke
```

Não vamos aprofundar agora.

---

### 8.5 TCL

TCL significa:

```text
Transaction Control Language
```

Comandos de transação.

Exemplos:

```sql
begin
commit
rollback
```

Transações serão muito importantes no futuro.

Por enquanto, basta entender que transação controla um conjunto de operações que deve ser confirmado ou desfeito.

---

## 9. O que vamos construir nesta aula

Vamos criar um laboratório inicial:

```text
labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
```

A estrutura será:

```text
labs
└── m12
    └── aula-271-introducao-sql-postgresql-modelagem-relacional
        ├── .env.example
        ├── .gitignore
        ├── docker-compose.yml
        └── sql
            ├── 01_criar_tabelas.sql
            └── 02_inserir_dados.sql
```

Vamos subir um PostgreSQL local com Docker Compose e criar duas tabelas:

```text
cliente;
ordem_servico.
```

A relação será:

```text
cliente 1:N ordem_servico
```

Ou seja:

```text
um cliente pode ter várias ordens de serviço;
uma ordem de serviço pertence a um cliente.
```

Esse modelo é simples e próximo de backend real.

---

## 10. Laboratório guiado passo a passo

### 10.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional
cd labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional

mkdir sql
```

No Linux/macOS:

```bash
mkdir -p labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional/sql
cd labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
```

---

### 10.2 Criar .env.example

Crie:

```text
.env.example
```

Conteúdo:

```properties
POSTGRES_DB=aula271
POSTGRES_USER=aula271
POSTGRES_PASSWORD=aula271_local
POSTGRES_PORT=5432
ADMINER_PORT=8081
```

Agora copie para `.env`.

No PowerShell:

```powershell
copy .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

Regra:

```text
.env.example entra no Git;
.env não entra no Git.
```

---

### 10.3 Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```gitignore
.env
*.log
target/
build/
out/
.idea/
.vscode/
.DS_Store
```

---

### 10.4 Criar docker-compose.yml

Crie:

```text
docker-compose.yml
```

Conteúdo:

```yaml
name: aula-271-postgresql-sql

services:
  postgres:
    image: postgres:16-alpine
    container_name: aula-271-postgres
    restart: unless-stopped
    env_file:
      - .env
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./sql:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  adminer:
    image: adminer:4.8.1
    container_name: aula-271-adminer
    restart: unless-stopped
    ports:
      - "${ADMINER_PORT}:8080"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres-data:
```

Esse Compose sobe:

```text
PostgreSQL;
Adminer;
volume persistente;
scripts SQL de inicialização;
healthcheck.
```

Você já viu isso no M11.

Agora vamos usar para estudar SQL.

---

### 10.5 Criar script de tabelas

Crie:

```text
sql/01_criar_tabelas.sql
```

Conteúdo:

```sql
create table if not exists cliente (
    id bigserial primary key,
    nome varchar(120) not null,
    documento varchar(30) not null unique,
    ativo boolean not null default true,
    criado_em timestamp not null default now()
);

create table if not exists ordem_servico (
    id bigserial primary key,
    codigo varchar(40) not null unique,
    cliente_id bigint not null references cliente(id),
    status varchar(30) not null,
    valor_total numeric(12, 2) not null default 0,
    criado_em timestamp not null default now()
);
```

Não se preocupe em entender todos os detalhes ainda.

Vamos explicar.

A tabela `cliente` tem:

```text
id;
nome;
documento;
ativo;
criado_em.
```

A tabela `ordem_servico` tem:

```text
id;
codigo;
cliente_id;
status;
valor_total;
criado_em.
```

O campo:

```sql
cliente_id bigint not null references cliente(id)
```

cria a relação com a tabela cliente.

---

### 10.6 Criar script de dados

Crie:

```text
sql/02_inserir_dados.sql
```

Conteúdo:

```sql
insert into cliente (nome, documento)
values
    ('Cliente Demonstração A', 'DOC-001'),
    ('Cliente Demonstração B', 'DOC-002')
on conflict (documento) do nothing;

insert into ordem_servico (codigo, cliente_id, status, valor_total)
select 'OS-271-001', c.id, 'ABERTA', 150.00
from cliente c
where c.documento = 'DOC-001'
on conflict (codigo) do nothing;

insert into ordem_servico (codigo, cliente_id, status, valor_total)
select 'OS-271-002', c.id, 'CONCLUIDA', 320.50
from cliente c
where c.documento = 'DOC-002'
on conflict (codigo) do nothing;
```

Esse script insere dados iniciais.

A parte:

```sql
on conflict do nothing
```

evita erro se o dado já existir.

Vamos estudar isso melhor mais adiante.

---

### 10.7 Subir o ambiente

Execute:

```powershell
docker compose up -d
```

Verifique:

```powershell
docker compose ps
```

Veja logs:

```powershell
docker compose logs postgres
```

Resultado esperado:

```text
postgres healthy;
adminer running.
```

---

### 10.8 Conectar com psql

Execute:

```powershell
docker compose exec postgres psql -U aula271 -d aula271
```

Você deve entrar no prompt do PostgreSQL.

Algo parecido com:

```text
aula271=#
```

Dentro do psql, rode:

```sql
\dt
```

Esse comando lista tabelas.

Você deve ver:

```text
cliente
ordem_servico
```

Agora rode:

```sql
select * from cliente;
```

Depois:

```sql
select * from ordem_servico;
```

Para sair:

```sql
\q
```

---

### 10.9 Executar comandos sem entrar no psql

Você também pode executar SQL direto pelo terminal.

Exemplo:

```powershell
docker compose exec postgres psql -U aula271 -d aula271 -c "select * from cliente;"
```

Outro exemplo:

```powershell
docker compose exec postgres psql -U aula271 -d aula271 -c "select codigo, status, valor_total from ordem_servico;"
```

Esse modo é útil para validação rápida.

---

### 10.10 Acessar pelo Adminer

Abra no navegador:

```text
http://localhost:8081
```

Use:

```text
Sistema: PostgreSQL
Servidor: postgres
Usuário: aula271
Senha: aula271_local
Base de dados: aula271
```

No Adminer, você consegue visualizar tabelas e dados.

Mas durante o curso, vamos usar bastante `psql`.

Por quê?

Porque `psql` força você a aprender SQL de verdade, sem depender só de interface.

---

## 11. Entendendo o script SQL

### 11.1 create table

O comando:

```sql
create table if not exists cliente (...)
```

cria uma tabela se ela ainda não existir.

A parte:

```sql
if not exists
```

evita erro caso a tabela já exista.

---

### 11.2 bigserial

A coluna:

```sql
id bigserial primary key
```

cria um identificador numérico auto-incremental.

Em termos simples:

```text
o banco gera o próximo id automaticamente.
```

Mais adiante, vamos estudar melhor tipos de identificadores.

---

### 11.3 varchar

A coluna:

```sql
nome varchar(120)
```

guarda texto com limite de tamanho.

Neste caso:

```text
até 120 caracteres.
```

---

### 11.4 not null

A constraint:

```sql
not null
```

impede valor nulo.

Exemplo:

```sql
nome varchar(120) not null
```

Significa:

```text
cliente precisa ter nome.
```

---

### 11.5 unique

A constraint:

```sql
unique
```

impede repetição.

Exemplo:

```sql
documento varchar(30) not null unique
```

Significa:

```text
dois clientes não podem ter o mesmo documento.
```

---

### 11.6 boolean

A coluna:

```sql
ativo boolean not null default true
```

guarda verdadeiro ou falso.

O default:

```sql
default true
```

significa que, se você não informar valor, o banco usa `true`.

---

### 11.7 timestamp

A coluna:

```sql
criado_em timestamp not null default now()
```

guarda data e hora.

O default:

```sql
now()
```

preenche com o momento da inserção.

---

### 11.8 numeric

A coluna:

```sql
valor_total numeric(12, 2)
```

é usada para valores decimais.

Para dinheiro, geralmente evitamos `float` ou `double`.

Usamos tipos decimais precisos.

No Java, isso se conecta com:

```java
BigDecimal
```

---

### 11.9 foreign key simplificada

A coluna:

```sql
cliente_id bigint not null references cliente(id)
```

significa:

```text
cliente_id precisa apontar para um id existente na tabela cliente.
```

Isso protege integridade.

Se você tentar criar uma OS para um cliente inexistente, o banco deve impedir.

---

## 12. Primeiras consultas

Entre no psql:

```powershell
docker compose exec postgres psql -U aula271 -d aula271
```

Rode:

```sql
select * from cliente;
```

Agora:

```sql
select nome, documento from cliente;
```

Filtre:

```sql
select *
from cliente
where documento = 'DOC-001';
```

Consulte OS:

```sql
select codigo, status, valor_total
from ordem_servico;
```

Filtre status:

```sql
select codigo, status, valor_total
from ordem_servico
where status = 'ABERTA';
```

Ordene:

```sql
select codigo, status, valor_total
from ordem_servico
order by valor_total desc;
```

Esses comandos serão aprofundados nas próximas aulas.

Hoje o objetivo é primeiro contato com sentido.

---

## 13. Teste de integridade

Vamos tentar inserir uma ordem de serviço com cliente inexistente.

Dentro do psql:

```sql
insert into ordem_servico (codigo, cliente_id, status, valor_total)
values ('OS-ERRO-001', 999999, 'ABERTA', 100.00);
```

O PostgreSQL deve recusar.

Por quê?

Porque não existe cliente com id `999999`.

Esse é o papel da foreign key.

Isso é muito importante.

O banco protege o dado mesmo se a aplicação errar.

---

## 14. Reset controlado do ambiente

Para parar sem apagar dados:

```powershell
docker compose down
```

Para apagar dados e recriar tudo do zero:

```powershell
docker compose down -v
docker compose up -d
```

Atenção:

```text
down -v apaga o volume.
```

Isso recria o banco e roda scripts novamente.

Use com consciência.

---

## 15. O que versionar e o que não versionar

Versionar:

```text
docker-compose.yml;
.env.example;
.gitignore;
scripts SQL;
documentação;
README do laboratório, se criar.
```

Não versionar:

```text
.env;
volumes do Docker;
logs;
dados locais;
arquivos temporários.
```

Banco local de estudo pode ser recriado.

Scripts devem ser versionados.

Essa é a mentalidade correta.

---

## 16. Erros comuns e troubleshooting essencial

### 16.1 Porta 5432 ocupada

Erro:

```text
port is already allocated
```

Causa:

```text
já existe PostgreSQL local ou outro container usando 5432.
```

Solução simples:

altere no `.env`:

```properties
POSTGRES_PORT=5433
```

Suba novamente:

```powershell
docker compose up -d
```

Dentro da rede Docker, o PostgreSQL continua usando 5432.

No seu computador, ele ficará exposto em 5433.

---

### 16.2 Scripts não rodaram

Os scripts em:

```text
/docker-entrypoint-initdb.d
```

só rodam quando o banco é criado pela primeira vez.

Se o volume já existia, eles não rodam de novo.

Para resetar:

```powershell
docker compose down -v
docker compose up -d
```

---

### 16.3 Erro de senha

Verifique `.env`.

Confira:

```properties
POSTGRES_USER=aula271
POSTGRES_PASSWORD=aula271_local
POSTGRES_DB=aula271
```

Conecte com:

```powershell
docker compose exec postgres psql -U aula271 -d aula271
```

---

### 16.4 Adminer não conecta

No Adminer, o servidor deve ser:

```text
postgres
```

Não use:

```text
localhost
```

Por quê?

Porque Adminer está em outro container.

Dentro da rede Docker, ele enxerga o serviço pelo nome:

```text
postgres
```

Essa foi uma lição importante do M11.

---

### 16.5 Tabela não aparece

Entre no psql:

```powershell
docker compose exec postgres psql -U aula271 -d aula271
```

Rode:

```sql
\dt
```

Se não aparecer, veja logs:

```powershell
docker compose logs postgres
```

Pode ter erro em algum script SQL.

---

## 17. Exercício prático principal

### Missão

Criar o primeiro ambiente SQL do M12 com PostgreSQL e modelagem inicial.

Você deve criar:

```text
labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
```

Com:

```text
.env.example;
.gitignore;
docker-compose.yml;
sql/01_criar_tabelas.sql;
sql/02_inserir_dados.sql.
```

Depois deve:

```text
subir PostgreSQL;
conectar com psql;
listar tabelas;
consultar clientes;
consultar ordens de serviço;
testar foreign key;
acessar Adminer;
fazer reset controlado.
```

---

### Roteiro de validação

Execute:

```powershell
docker compose up -d
docker compose ps
docker compose exec postgres psql -U aula271 -d aula271 -c "\dt"
docker compose exec postgres psql -U aula271 -d aula271 -c "select * from cliente;"
docker compose exec postgres psql -U aula271 -d aula271 -c "select * from ordem_servico;"
```

Teste erro de foreign key:

```powershell
docker compose exec postgres psql -U aula271 -d aula271 -c "insert into ordem_servico (codigo, cliente_id, status, valor_total) values ('OS-ERRO-001', 999999, 'ABERTA', 100.00);"
```

Esse comando deve falhar.

Isso é bom.

Ele mostra integridade relacional funcionando.

---

### Critérios de aceite

A aula está concluída quando:

```text
PostgreSQL sobe com Docker Compose;
Adminer sobe;
psql conecta no banco aula271;
tabelas cliente e ordem_servico existem;
dados iniciais foram inseridos;
select em cliente funciona;
select em ordem_servico funciona;
foreign key impede cliente inexistente;
você entende database, schema, table, column e row;
você entende primary key e foreign key em nível inicial;
você entende DDL, DML, DQL, DCL e TCL em nível introdutório.
```

---

## 18. Checkpoint final

Responda mentalmente:

```text
1. O que é SQL?
2. O que é PostgreSQL?
3. Qual diferença entre SQL e PostgreSQL?
4. O que é banco relacional?
5. O que é database?
6. O que é schema?
7. O que é table?
8. O que é column?
9. O que é row?
10. O que é primary key?
11. O que é foreign key?
12. O que é constraint?
13. Para que serve not null?
14. Para que serve unique?
15. Para que serve default?
16. O que é DDL?
17. O que é DML?
18. O que é DQL?
19. Por que banco deve proteger dados?
20. Por que SQL vem antes de JDBC, JPA e Spring Boot?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 271.
[ ] Criei .env.example.
[ ] Criei .gitignore.
[ ] Criei docker-compose.yml.
[ ] Criei script de tabelas.
[ ] Criei script de dados.
[ ] Subi PostgreSQL com Docker Compose.
[ ] Conectei com psql.
[ ] Listei tabelas com \dt.
[ ] Rodei select em cliente.
[ ] Rodei select em ordem_servico.
[ ] Testei foreign key.
[ ] Acessei Adminer.
[ ] Entendi por que o M12 começa com SQL.
```

---

## 19. Fechamento e ponte para a próxima aula

Nesta aula, você iniciou oficialmente o M12.

Você estudou:

```text
SQL;
PostgreSQL;
banco relacional;
database;
schema;
table;
column;
row;
primary key;
foreign key;
constraint;
DDL;
DML;
DQL;
DCL;
TCL;
Docker Compose para PostgreSQL;
psql;
Adminer;
scripts SQL;
primeiras consultas;
integridade relacional.
```

A ideia principal foi:

```text
backend Java profissional precisa entender dados, não apenas código.
```

O banco não é um detalhe.

O banco protege regras.

O banco guarda estado.

O banco influencia performance.

O banco influencia modelagem.

O banco influencia arquitetura.

Por isso, o M12 será tratado com cuidado.

A próxima aula será:

```text
272 — M12.02 — PostgreSQL com Docker Compose para estudos: psql, Adminer, scripts, volumes e reset controlado
```

Nela, vamos aprofundar o ambiente de estudos do PostgreSQL, deixando o setup mais sólido para as próximas aulas de SQL.

Ainda não vamos para JDBC.

Ainda não vamos para JPA.

Ainda não vamos para Spring Boot.

Vamos primeiro dominar o banco.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
git commit -m "Aula 271: introducao a sql postgresql e modelagem relacional"
git status
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 271 — M12.01 — Introdução ao SQL, PostgreSQL e modelagem relacional para Java Backend

Nesta aula, iniciei o M12 da formação, focado em SQL, PostgreSQL e modelagem relacional.

Aprendi por que banco de dados é essencial para Java Backend e entendi a diferença entre SQL como linguagem e PostgreSQL como sistema gerenciador de banco de dados relacional.

Estudei conceitos iniciais como database, schema, table, column, row, primary key, foreign key e constraint.

Também entendi a divisão dos comandos SQL em DDL, DML, DQL, DCL e TCL.

Criei o laboratório `labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional`, subi PostgreSQL com Docker Compose, conectei usando `psql`, listei tabelas, consultei dados e testei a proteção de integridade com foreign key.

O principal aprendizado foi que backend Java profissional precisa entender dados e modelagem relacional antes de depender de JDBC, JPA, Hibernate ou Spring Boot.
```
