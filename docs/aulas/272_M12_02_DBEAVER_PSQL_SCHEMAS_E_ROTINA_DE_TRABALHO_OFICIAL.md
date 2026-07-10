# 272 - M12.02 - DBeaver psql schemas e rotina de trabalho

## Apresentacao da aula

Na aula 271, você iniciou oficialmente o M12 e preparou o primeiro ambiente PostgreSQL da formação. Você distinguiu banco de dados, SGBD, SQL e PostgreSQL, estudou tabela, linha, coluna, chave primária, chave estrangeira e relacionamento em nível conceitual, subiu o servidor com Docker Compose e executou verificações mínimas pelo `psql`.

Agora o objetivo é transformar aquela conexão inicial em uma rotina de trabalho consciente e repetível.

Em projetos reais, não basta conseguir abrir o banco. Você precisa saber responder, antes de executar qualquer comando:

```text
Em qual servidor estou conectado?
Em qual banco estou trabalhando?
Qual usuário está sendo usado?
Qual schema está ativo?
Qual script estou executando?
O resultado pertence ao ambiente esperado?
```

Essas perguntas parecem simples, mas evitam uma classe importante de erros. Um SQL correto, executado no banco errado, continua sendo um problema. Uma ferramenta visual bem configurada, mas conectada ao ambiente incorreto, também pode causar dano.

Nesta aula, você trabalhará com duas ferramentas complementares:

```text
psql:
cliente de terminal do PostgreSQL.

DBeaver:
ferramenta visual para navegar, editar e executar SQL.
```

Você também aprenderá a diferença entre servidor, database e schema, entenderá o papel do schema `public`, conhecerá o `search_path` e criará uma rotina mínima para executar scripts versionados com segurança.

Ainda não criaremos tabelas. O único comando estrutural usado será `CREATE SCHEMA`, porque schemas são o tema central desta aula. Tipos de dados serão estudados na aula 273 e DDL de tabelas começará na aula 274.

---

## Onde estamos na formacao

O M12 está construindo a base de dados antes da persistência Java.

A sequência imediata é:

```text
271 - Introducao ao SQL, PostgreSQL e modelagem relacional
272 - DBeaver psql schemas e rotina de trabalho
273 - Tipos de dados PostgreSQL com criterio
274 - DDL create table alter table drop table
275 - Primary key foreign key e integridade referencial
276 - Constraints not null unique check default
```

A aula 271 respondeu:

```text
O que é banco de dados?
O que é SGBD?
O que é SQL?
Por que PostgreSQL?
Como subir e verificar um servidor local?
```

A aula 272 responde:

```text
Como trabalhar diariamente com esse servidor?
Como confirmar o contexto da conexão?
Como diferenciar database de schema?
Como usar terminal e ferramenta visual sem depender cegamente de nenhum deles?
Como salvar SQL no repositório em vez de deixá-lo perdido no histórico da ferramenta?
```

Essa base será usada durante todo o módulo. Quando chegarem tipos, tabelas, consultas, constraints, índices e transações, você já terá uma rotina confiável para executar e revisar scripts.

---

## Objetivo pratico

Nesta aula, você vai criar o laboratório:

```text
labs/m12/aula-272-dbeaver-psql-schemas-rotina-trabalho
```

A estrutura final será:

```text
labs
└── m12
    └── aula-272-dbeaver-psql-schemas-rotina-trabalho
        ├── README.md
        ├── rotina-trabalho.md
        └── sql
            ├── 00_verificar_contexto.sql
            ├── 01_criar_schemas.sql
            ├── 02_inspecionar_schemas.sql
            └── 03_search_path_sessao.sql
```

O PostgreSQL continuará sendo o mesmo servidor criado na aula 271. Não duplicaremos o `compose.yaml`, porque Docker não é o foco desta aula.

Ao final, você deverá conseguir:

- iniciar o PostgreSQL da aula anterior;
- conectar pelo `psql` e pelo DBeaver;
- identificar servidor, banco, usuário e schema;
- explicar a diferença entre database e schema;
- criar os schemas `app` e `auditoria`;
- listar schemas pelo terminal e pela interface visual;
- entender o efeito do `search_path` durante uma sessão;
- executar arquivos SQL versionados;
- seguir uma rotina que reduza o risco de executar comandos no contexto errado;
- preparar o laboratório para a aula 273.

---

## Conceito essencial

### Servidor PostgreSQL

O PostgreSQL em execução dentro do container é o servidor de banco de dados.

Ele é o processo que:

- recebe conexões;
- autentica usuários;
- mantém databases;
- interpreta SQL;
- gerencia arquivos de dados;
- coordena acessos;
- devolve resultados.

Na aula 271, o container foi chamado:

```text
formacao-postgres-m12
```

Ele expõe o PostgreSQL para a máquina local em:

```text
host: localhost
porta: 5433
```

O container é o meio de execução. O PostgreSQL é o SGBD que está rodando dentro dele.

---

### Database

Um servidor PostgreSQL pode hospedar vários databases.

Na aula anterior, o database inicial foi criado com o nome:

```text
formacao_java
```

Quando um cliente se conecta, ele seleciona um database específico. Uma sessão normal trabalha dentro daquele database.

Você pode pensar assim:

```text
Servidor PostgreSQL
├── database postgres
├── database template0
├── database template1
└── database formacao_java
```

Os databases `postgres`, `template0` e `template1` fazem parte da estrutura padrão de uma instalação PostgreSQL. Nesta formação, o trabalho prático ficará concentrado em `formacao_java`.

Não precisamos criar novos databases nesta aula. O objetivo é aprender a identificar corretamente aquele que já existe.

---

### Schema

Schema é um namespace dentro de um database.

Ele organiza objetos como:

- tabelas;
- views;
- sequências;
- funções;
- tipos;
- outros objetos do banco.

Representação conceitual:

```text
Servidor PostgreSQL
└── database formacao_java
    ├── schema public
    ├── schema app
    └── schema auditoria
```

A diferença principal é:

```text
database:
unidade escolhida na conexão.

schema:
namespace existente dentro do database conectado.
```

Uma conexão com `formacao_java` pode acessar os schemas existentes nesse database, desde que o usuário tenha permissão.

Nesta aula, criaremos:

```text
app:
namespace destinado aos objetos principais da aplicação.

auditoria:
namespace reservado para objetos relacionados a rastreabilidade e auditoria.
```

Ainda não haverá tabelas dentro deles. A separação serve para aprender organização e contexto antes de modelar fisicamente o domínio.

---

### O schema public

Em um database PostgreSQL novo, normalmente existe um schema chamado:

```text
public
```

Quando um objeto é criado sem informar explicitamente o schema, ele pode ser resolvido ou criado em um schema definido pelo `search_path`, frequentemente começando por `public` em ambientes simples.

Exemplo futuro sem qualificação:

```sql
SELECT * FROM ordem_servico;
```

Exemplo qualificado:

```sql
SELECT * FROM app.ordem_servico;
```

A segunda forma informa explicitamente o schema.

Nesta aula, não existe a tabela `ordem_servico`. O exemplo serve apenas para mostrar a diferença entre nome simples e nome qualificado.

Usar `public` não é automaticamente errado. O ponto é entender que ele existe e decidir conscientemente como organizar o projeto, em vez de colocar todos os objetos no schema padrão sem critério.

---

### Schemas de sistema

Ao listar schemas, você poderá encontrar nomes como:

```text
pg_catalog
information_schema
pg_toast
```

Eles não representam módulos da sua aplicação.

`pg_catalog` contém catálogos e objetos internos usados pelo PostgreSQL.

`information_schema` oferece views padronizadas para consultar metadados sobre objetos do banco.

`pg_toast` participa do armazenamento interno de determinados valores.

No início, não altere schemas de sistema. Apenas reconheça que eles existem e diferencie-os de `public`, `app` e `auditoria`.

---

### Nome qualificado

Um nome qualificado informa schema e objeto:

```text
schema.objeto
```

Exemplo futuro:

```text
app.ordem_servico
```

Isso reduz ambiguidade.

Dois schemas podem, conceitualmente, conter objetos com o mesmo nome:

```text
app.evento
auditoria.evento
```

O nome simples `evento` dependeria do contexto de resolução. O nome qualificado informa exatamente qual objeto está sendo usado.

Em scripts de banco importantes, nomes qualificados tornam a intenção mais explícita.

---

### search_path

O `search_path` é a lista de schemas que o PostgreSQL consulta para resolver nomes não qualificados.

Você pode inspecioná-lo com:

```sql
SHOW search_path;
```

E consultar os schemas efetivamente considerados na sessão:

```sql
SELECT current_schemas(true);
```

Também pode verificar o primeiro schema efetivo com:

```sql
SELECT current_schema();
```

Durante uma sessão, é possível alterar temporariamente o caminho:

```sql
SET search_path TO app, public;
```

Depois:

```sql
RESET search_path;
```

Nesta aula, a alteração será apenas de sessão. Ao encerrar a conexão, ela não será tratada como configuração permanente.

A ideia principal é:

```text
nome sem schema:
depende do contexto de resolução.

nome com schema:
explicita o namespace desejado.
```

---

### Sessao e contexto

Cada conexão aberta por `psql` ou DBeaver cria uma sessão.

A sessão possui contexto, incluindo:

- database conectado;
- usuário atual;
- configurações temporárias;
- `search_path`;
- comandos executados naquela conexão.

Se você abrir duas conexões, elas são sessões diferentes.

Uma alteração feita com `SET search_path` em uma sessão não deve ser presumida em outra.

Por isso, a rotina profissional começa verificando contexto, não confiando apenas no que você lembra ter configurado anteriormente.

---

### psql

`psql` é o cliente de terminal oficial do PostgreSQL.

Ele permite:

- abrir conexão;
- executar SQL;
- executar arquivos;
- inspecionar objetos;
- usar metacomandos;
- automatizar verificações;
- trabalhar em ambientes sem interface gráfica.

Na formação, o `psql` continua importante porque torna explícitos os dados da conexão e funciona bem em diagnóstico e automação.

Metacomandos começam com barra invertida:

```text
\conninfo
\l
\dn
\dn+
\dt
\q
```

Eles pertencem ao cliente `psql`, não à linguagem SQL.

---

### DBeaver

DBeaver é uma ferramenta visual que se conecta ao PostgreSQL por meio de um driver.

Ele oferece recursos como:

- navegação por databases e schemas;
- editor SQL;
- grade de resultados;
- histórico de execução;
- abertura de múltiplas conexões;
- inspeção visual de objetos.

DBeaver não substitui o PostgreSQL e não armazena os dados do servidor. Ele é um cliente.

A relação é:

```text
DBeaver ou psql
        ↓
conexao de rede
        ↓
PostgreSQL
        ↓
database formacao_java
        ↓
schemas
```

A ferramenta visual aumenta produtividade. O terminal mantém a compreensão direta. Você aprenderá a usar os dois.

---

### Script versionado

Um comando executado apenas no histórico do DBeaver pode ser difícil de revisar ou reproduzir depois.

Um arquivo SQL salvo no repositório oferece:

- histórico no Git;
- revisão;
- repetição;
- comparação;
- rastreabilidade;
- compartilhamento.

Nesta aula, cada objetivo será colocado em um arquivo pequeno:

```text
00_verificar_contexto.sql
01_criar_schemas.sql
02_inspecionar_schemas.sql
03_search_path_sessao.sql
```

A numeração comunica a ordem didática.

Isso não significa que todo script de produção deve seguir exatamente essa convenção. Aqui ela organiza o laboratório e prepara a mentalidade para scripts e migrações futuras.

---

### Rotina antes de executar SQL

Adote a sequência:

```text
1. Identificar o ambiente.
2. Confirmar host e porta.
3. Confirmar database e usuario.
4. Confirmar schema ou search_path.
5. Ler o script inteiro.
6. Executar o menor trecho necessário.
7. Conferir o resultado.
8. Salvar o script no repositório.
9. Registrar qualquer erro relevante.
```

Ainda não estamos alterando dados de negócio. Mesmo assim, a disciplina começa agora.

---

## Mao na massa guiada

### 1. Iniciar o PostgreSQL da aula 271

Na raiz do repositório, abra o PowerShell e execute:

```powershell
Push-Location "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"

docker compose up -d
docker compose ps

Pop-Location
```

O serviço deve alcançar o estado:

```text
healthy
```

Se isso não acontecer, consulte os logs:

```powershell
Push-Location "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"

docker compose logs postgres

Pop-Location
```

Não crie outro PostgreSQL. A aula 272 continua usando o servidor preparado anteriormente.

---

### 2. Confirmar o contexto pelo psql

Execute:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Dentro do `psql`:

```text
\conninfo
```

Depois:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_schema() AS schema_atual;
```

E:

```sql
SHOW search_path;
```

Saia:

```text
\q
```

Antes de abrir o DBeaver, você já confirmou que o servidor e a sessão estão corretos.

---

### 3. Criar a estrutura do laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql"
```

Entre na pasta:

```powershell
Set-Location "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho"
```

A estrutura inicial deve ser:

```text
.
└── sql
```

---

### 4. Criar 00_verificar_contexto.sql

Crie:

```text
sql/00_verificar_contexto.sql
```

Conteúdo:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_schema() AS schema_atual;

SHOW search_path;

SELECT current_schemas(true) AS schemas_ativos;
```

Esse será o primeiro script executado em qualquer sessão do laboratório.

Ele não altera estrutura nem dados. Apenas responde:

```text
Onde estou?
Quem sou nesta conexão?
Qual schema está sendo resolvido primeiro?
Quais schemas participam do caminho atual?
```

---

### 5. Executar o script pelo psql

Volte à raiz do repositório:

```powershell
Set-Location ..\..\..
```

Execute o arquivo pelo `psql` que está dentro do container:

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\00_verificar_contexto.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Confira se o resultado informa:

```text
banco: formacao_java
usuario: formacao
schema atual: public
```

O valor de `search_path` também será exibido.

Essa forma é importante porque prova que um arquivo local versionado pode ser enviado ao cliente `psql` sem precisar copiá-lo manualmente para o container.

---

### 6. Preparar o DBeaver Community

Se o DBeaver Community já estiver instalado, abra-o.

Se ainda não estiver, instale a edição Community usando o instalador oficial adequado ao Windows. Não é necessário escolher uma versão paga para este laboratório.

Durante a primeira conexão PostgreSQL, o DBeaver pode solicitar o download do driver necessário. Autorize o download para concluir a configuração do cliente.

Não registre arquivos internos do workspace do DBeaver no repositório. A fonte da verdade da aula serão os arquivos SQL salvos em `labs/m12`.

---

### 7. Criar a conexao no DBeaver

No DBeaver:

1. escolha a criação de uma nova conexão;
2. selecione PostgreSQL;
3. preencha os dados;
4. teste a conexão;
5. salve.

Use:

```text
Nome da conexao: [LOCAL] M12 - PostgreSQL
Host: localhost
Porta: 5433
Database: formacao_java
Usuario: formacao
Senha: formacao_local
```

A senha corresponde ao valor padrão do `.env` da aula 271. Se você alterou o arquivo local, use o valor efetivamente configurado.

O prefixo `[LOCAL]` ajuda a reconhecer o ambiente rapidamente.

Quando trabalhar futuramente com outros ambientes, não use nomes vagos como:

```text
postgres
banco
conexao1
```

Prefira nomes que comuniquem ambiente e finalidade.

---

### 8. Testar e revisar a conexao

Use a opção de teste de conexão.

O teste precisa concluir com sucesso antes de salvar.

Se falhar, confira nesta ordem:

```text
1. Docker está ativo?
2. O container está healthy?
3. A porta é 5433?
4. O database é formacao_java?
5. O usuário é formacao?
6. A senha corresponde ao volume inicializado?
```

Depois de salvar, localize a conexão no navegador de bancos do DBeaver.

Expanda os nós gradualmente até encontrar o database e os schemas disponíveis.

A organização visual pode variar conforme a configuração da ferramenta, mas você deverá encontrar pelo menos o schema `public` e schemas de sistema.

---

### 9. Abrir um editor SQL vinculado a conexao

Abra um novo editor SQL usando a conexão:

```text
[LOCAL] M12 - PostgreSQL
```

Antes de executar qualquer comando, observe no editor qual conexão está ativa.

Cole temporariamente:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_schema() AS schema_atual;
```

Execute a instrução atual. Em muitos ambientes do DBeaver, `Ctrl + Enter` executa o comando selecionado ou atual. O atalho pode variar conforme o keymap; a opção de execução também está disponível na interface.

Resultado esperado:

```text
formacao_java | formacao | public
```

Depois, abra o arquivo versionado:

```text
sql/00_verificar_contexto.sql
```

Associe o editor à conexão local e execute o script.

O objetivo é usar no DBeaver o mesmo SQL que já funcionou pelo `psql`.

---

### 10. Criar 01_criar_schemas.sql

Crie:

```text
sql/01_criar_schemas.sql
```

Conteúdo:

```sql
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS auditoria;
```

Nesta aula, `CREATE SCHEMA` é usado de forma limitada porque o próprio assunto é organização por schemas.

Entenda a intenção:

```text
app:
futuros objetos principais do sistema.

auditoria:
futuros objetos relacionados a rastreabilidade.
```

Não crie tabelas.

Execute o arquivo no DBeaver.

Depois, execute novamente.

Como usamos:

```sql
IF NOT EXISTS
```

a segunda execução não deve tentar recriar um schema já existente como se fosse um novo objeto.

Esse recurso ajuda o laboratório a ser repetível, mas não transforma qualquer script em migração profissional. Migrações serão tratadas mais adiante.

---

### 11. Atualizar a navegacao do DBeaver

Depois de criar os schemas, atualize a árvore de navegação da conexão.

Você deve encontrar:

```text
app
auditoria
public
```

Se eles não aparecerem imediatamente, atualize o nó de schemas ou reconecte.

Abra as propriedades de `app` e `auditoria` apenas para observar que eles pertencem ao database `formacao_java`.

Não crie objetos pela interface visual nesta aula.

A preferência será:

```text
criar por script versionado;
inspecionar pela ferramenta visual.
```

Isso preserva rastreabilidade.

---

### 12. Criar 02_inspecionar_schemas.sql

Crie:

```text
sql/02_inspecionar_schemas.sql
```

Conteúdo:

```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name NOT LIKE 'pg_%'
ORDER BY schema_name;
```

Esse script consulta metadados pelo `information_schema`.

Execute no DBeaver.

O resultado deve incluir, entre outros:

```text
app
auditoria
information_schema
public
```

Agora confirme pelo `psql`:

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\02_inspecionar_schemas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Você também pode entrar de forma interativa:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

E usar:

```text
\dn
```

Para obter mais detalhes:

```text
\dn+
```

Depois saia com:

```text
\q
```

DBeaver, SQL e metacomando devem contar a mesma história sobre os schemas existentes.

---

### 13. Criar 03_search_path_sessao.sql

Crie:

```text
sql/03_search_path_sessao.sql
```

Conteúdo:

```sql
SHOW search_path;

SET search_path TO app, public;

SHOW search_path;
SELECT current_schema() AS schema_atual;

RESET search_path;

SHOW search_path;
```

Execute o arquivo no DBeaver como script completo.

Observe a sequência:

```text
search_path inicial;
search_path alterado para app, public;
schema atual passa a considerar app primeiro;
RESET restaura a configuração da sessão.
```

O comando não cria tabela e não muda a estrutura dos schemas.

Ele altera apenas o contexto de resolução naquela sessão.

Abra outro editor ou uma nova conexão e execute:

```sql
SHOW search_path;
```

Não presuma que a alteração temporária da sessão anterior foi aplicada globalmente.

---

### 14. Navegar sem criar objetos pela interface

No DBeaver, explore:

```text
conexao local;
database formacao_java;
schemas app, auditoria e public;
objetos internos de cada schema;
editor SQL;
grade de resultados.
```

Como os schemas novos estão vazios, não haverá tabelas.

Essa ausência é esperada.

A aula 272 ensina organização e contexto, não modelagem física.

Evite clicar em assistentes para criar tabela. Quando esse assunto chegar, você fará primeiro por SQL para entender a estrutura gerada.

---

### 15. Criar README.md

Crie:

```text
README.md
```

Use este conteúdo compacto:

```markdown
# Aula 272 - DBeaver psql schemas e rotina de trabalho

Laboratorio para praticar conexao, contexto, schemas e execucao de scripts SQL versionados.

**Servidor utilizado**

- Container: `formacao-postgres-m12`
- Host: `localhost`
- Porta: `5433`
- Database: `formacao_java`
- Usuario: `formacao`

**Rotina minima**

1. iniciar o PostgreSQL da aula 271;
2. confirmar `database`, `user`, `schema` e `search_path`;
3. executar os arquivos da pasta `sql` na ordem numerica;
4. conferir os schemas no DBeaver e no `psql`;
5. salvar alteracoes no Git.

**Limite da aula**

Nenhuma tabela deve ser criada. Tipos de dados e DDL serao estudados nas proximas aulas.
```

O bloco não contém subtítulos Markdown de nível 2, preservando a renderização esperada pelo site do curso.

---

### 16. Criar rotina-trabalho.md

Crie:

```text
rotina-trabalho.md
```

Conteúdo:

```markdown
# Rotina de trabalho com PostgreSQL

**Antes de executar**

- confirmar o ambiente no nome da conexao;
- confirmar host e porta;
- executar `00_verificar_contexto.sql`;
- ler o arquivo inteiro;
- verificar se o SQL altera estrutura ou apenas consulta;
- confirmar que o script pertence a esta aula.

**Durante a execucao**

- executar um trecho de cada vez quando estiver explorando;
- executar o arquivo completo quando estiver validando o laboratorio;
- conferir mensagens e resultados;
- interromper se o contexto nao for o esperado.

**Depois de executar**

- atualizar a navegacao do DBeaver;
- confirmar pelo `psql` quando fizer sentido;
- salvar o arquivo SQL;
- revisar `git diff`;
- registrar erros relevantes no diario de bordo.
```

Esse arquivo será uma referência rápida nas próximas aulas.

---

### 17. Validar o laboratorio completo

Na raiz do repositório, execute os scripts na ordem:

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\00_verificar_contexto.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\01_criar_schemas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\02_inspecionar_schemas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\03_search_path_sessao.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

Depois, no DBeaver:

1. abra `00_verificar_contexto.sql`;
2. confirme a conexão `[LOCAL] M12 - PostgreSQL`;
3. execute o arquivo;
4. atualize os schemas;
5. confirme `app` e `auditoria`;
6. execute `02_inspecionar_schemas.sql`;
7. compare com o resultado do terminal.

Finalize:

```powershell
git status --short
```

---

## Entendendo o que foi feito

### DBeaver nao e o banco

Fechar o DBeaver não encerra o PostgreSQL.

O servidor continua no container enquanto ele estiver em execução.

Da mesma forma, abrir o DBeaver não inicia automaticamente o container deste laboratório.

A separação correta é:

```text
Docker:
executa o container.

PostgreSQL:
gerencia os dados.

DBeaver:
cliente visual.

psql:
cliente de terminal.
```

---

### psql nao ficou obsoleto por causa da ferramenta visual

DBeaver facilita navegação e leitura de resultados.

`psql` continua valioso para:

- diagnóstico rápido;
- servidores sem interface gráfica;
- execução automatizada;
- pipelines;
- confirmação independente da ferramenta visual;
- trabalho remoto por terminal.

Saber usar ambos evita dependência excessiva de uma única interface.

---

### Database e schema resolvem niveis diferentes

Você se conectou ao database:

```text
formacao_java
```

Dentro dele, criou:

```text
app
auditoria
```

Logo, `app` não é outro database. É um schema do database atual.

Essa distinção será importante quando surgirem nomes como:

```text
app.cliente
app.ordem_servico
auditoria.evento
```

---

### search_path e uma conveniencia, nao uma desculpa para perder contexto

O `search_path` permite usar nomes não qualificados.

Porém, scripts importantes podem preferir nomes qualificados para explicitar o destino.

Nesta formação, você aprenderá a reconhecer ambos e escolher de acordo com o contexto.

O principal é nunca assumir silenciosamente qual schema está ativo.

---

### Script no repositorio e melhor que SQL perdido no historico

O histórico do DBeaver é útil para consulta rápida, mas não substitui um arquivo versionado.

Os scripts da aula agora podem ser:

- revisados;
- executados pelo terminal;
- executados pela ferramenta visual;
- comparados no Git;
- reutilizados pelo aluno no futuro.

Essa prática prepara o caminho para scripts versionados e migrações, que terão aulas próprias.

---

### Contexto vem antes do comando

O primeiro arquivo da aula é:

```text
00_verificar_contexto.sql
```

Isso não é burocracia.

É um mecanismo simples para tornar visível o ambiente da sessão antes de qualquer alteração.

Quanto mais crítico for o banco, maior deve ser o cuidado com contexto, revisão e autorização.

---

## Erros comuns importantes

### DBeaver retorna connection refused

Verifique o servidor:

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

Depois:

```powershell
docker inspect formacao-postgres-m12 `
  --format "{{json .State.Health.Status}}"
```

Confirme no DBeaver:

```text
host: localhost
porta: 5433
```

Não use `postgres` como host no DBeaver do Windows. Esse nome pertence à rede Docker do Compose. A ferramenta instalada na máquina deve usar `localhost` e a porta publicada.

---

### Autenticacao falha

Confirme:

```text
database: formacao_java
usuario: formacao
senha: valor do .env da aula 271
```

Se o volume foi inicializado com credenciais antigas, alterar apenas o `.env` não muda automaticamente o usuário já criado.

Não apague o volume sem entender o impacto.

---

### O script esta vinculado a conexao errada

Antes de executar no DBeaver, confira o nome da conexão ativa no editor.

Use um nome claro:

```text
[LOCAL] M12 - PostgreSQL
```

Execute primeiro:

```sql
SELECT current_database(), current_user, current_schema();
```

Se o resultado não for o esperado, pare.

---

### Schemas nao aparecem no navegador

Atualize o nó de schemas ou a conexão.

Depois confirme pelo SQL:

```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('app', 'auditoria');
```

Se o SQL retornar os schemas, o problema é apenas atualização ou filtro visual.

---

### search_path nao permaneceu em outra sessao

Isso é esperado quando você usou:

```sql
SET search_path TO app, public;
```

A alteração foi feita naquela sessão.

Outra conexão deve verificar seu próprio contexto.

Configuração persistente de usuário ou database não faz parte desta aula.

---

## Comandos uteis

### Verificar o container

```powershell
docker ps --filter "name=formacao-postgres-m12"
docker logs formacao-postgres-m12
```

### Entrar no psql

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

### Metacomandos principais

```text
\conninfo
\l
\dn
\dn+
\dt
\q
```

### Consultar contexto

```sql
SELECT current_database(), current_user, current_schema();
SHOW search_path;
SELECT current_schemas(true);
```

### Executar arquivo local pelo container

```powershell
Get-Content -Raw "caminho\arquivo.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

---

## Exercicio guiado

### Parte 1 - Criar uma conexao reconhecivel

No DBeaver, confirme que a conexão está salva como:

```text
[LOCAL] M12 - PostgreSQL
```

Abra um editor novo e execute:

```sql
SELECT
    current_database() AS banco,
    current_user AS usuario,
    current_schema() AS schema_atual;
```

Salve o script apenas se ele estiver dentro da pasta oficial da aula. Não deixe uma cópia paralela sem necessidade.

---

### Parte 2 - Repetir a criacao de schemas com seguranca

Execute novamente:

```text
01_criar_schemas.sql
```

Explique por escrito em `rotina-trabalho.md`:

```text
Por que IF NOT EXISTS permite repetir o laboratorio sem tratar um schema existente como uma nova criacao?
```

A resposta deve mencionar que o comando verifica a existência antes de tentar criar.

Não extrapole isso para todas as operações SQL. Cada comando possui comportamento próprio.

---

### Parte 3 - Comparar tres formas de inspecao

Confirme os schemas de três formas:

1. navegador visual do DBeaver;
2. consulta ao `information_schema`;
3. metacomando `\dn` no `psql`.

No final de `rotina-trabalho.md`, registre:

```text
DBeaver facilita navegacao.
information_schema permite consulta SQL aos metadados.
\dn permite inspecao rapida no psql.
```

Depois responda:

```text
Por que e util saber mais de uma forma de verificar o mesmo contexto?
```

---

### Parte 4 - Demonstrar o escopo da sessao

No DBeaver, abra dois editores ligados à mesma conexão.

No primeiro, execute:

```sql
SET search_path TO app, public;
SHOW search_path;
```

No segundo, execute:

```sql
SHOW search_path;
```

Dependendo de como a ferramenta gerencia conexões e sessões, os editores podem reutilizar ou não a mesma sessão física. Em vez de presumir o resultado, observe e registre o que ocorreu.

Depois use `RESET search_path` no editor em que você fez a alteração.

A aprendizagem é:

```text
interface visual e sessao de banco nao sao exatamente a mesma ideia;
sempre verifique o contexto efetivo.
```

---

### Parte 5 - Verificacao final pelo terminal

Execute:

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\00_verificar_contexto.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

E:

```powershell
Get-Content -Raw `
  "labs\m12\aula-272-dbeaver-psql-schemas-rotina-trabalho\sql\02_inspecionar_schemas.sql" |
  docker exec -i formacao-postgres-m12 `
    psql -U formacao -d formacao_java
```

O resultado final deve comprovar:

```text
database formacao_java;
usuario formacao;
schemas app e auditoria existentes;
servidor acessivel pelo terminal e pelo DBeaver.
```

---

## Criterios de aceite

A aula está concluída quando:

- o PostgreSQL da aula 271 está saudável;
- a conexão `[LOCAL] M12 - PostgreSQL` funciona no DBeaver;
- o contexto foi validado por SQL;
- os quatro arquivos SQL foram criados;
- `app` e `auditoria` existem no database `formacao_java`;
- os schemas foram confirmados no DBeaver, no `information_schema` e no `psql`;
- o efeito temporário de `SET search_path` foi observado;
- `README.md` e `rotina-trabalho.md` foram criados;
- nenhuma tabela foi criada;
- os scripts estão versionados na pasta oficial;
- o aluno consegue explicar database, schema, sessão e `search_path`.

---

## Commit recomendado

Na raiz do repositório:

```powershell
git status
git diff
```

Adicione apenas o laboratório da aula:

```powershell
git add `
  labs/m12/aula-272-dbeaver-psql-schemas-rotina-trabalho
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m12): configurar rotina PostgreSQL com schemas"
```

Depois:

```powershell
git log -1 --oneline
```

O commit registra uma unidade coerente:

```text
conexao visual;
verificacao por psql;
schemas iniciais;
scripts versionados;
rotina de trabalho.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou uma conexão mínima em uma rotina de trabalho.

Você aprendeu que:

- PostgreSQL é o servidor de banco;
- `formacao_java` é o database selecionado na conexão;
- schemas são namespaces dentro desse database;
- `public` é um schema existente no ambiente inicial;
- `app` e `auditoria` representam organizações distintas;
- nomes qualificados tornam o schema explícito;
- `search_path` participa da resolução de nomes não qualificados;
- cada conexão possui uma sessão e um contexto;
- DBeaver é cliente visual;
- `psql` é cliente de terminal;
- scripts importantes devem ficar no repositório;
- verificar contexto antes de executar SQL é parte do trabalho profissional.

Na prática, você:

- reutilizou o PostgreSQL da aula 271;
- conectou pelo DBeaver;
- confirmou contexto pelo terminal e pela interface visual;
- criou schemas sem criar tabelas;
- consultou metadados;
- observou o `search_path`;
- estruturou arquivos SQL versionados;
- registrou uma rotina de execução segura.

A próxima aula será:

```text
273 - M12.03 - Tipos de dados PostgreSQL com criterio
```

Nela, você aprenderá a escolher tipos para representar dados como:

- identificadores;
- textos;
- valores monetários;
- datas e horários;
- booleanos;
- números inteiros e decimais;
- códigos de negócio.

Ainda não criaremos o modelo físico completo sem antes discutir essas escolhas.

Chegue à aula 273 sabendo abrir o ambiente, confirmar contexto, executar um arquivo e localizar os schemas `app` e `auditoria`.

---

# Material complementar

## Checkpoint final

- [ ] Conectei pelo DBeaver e pelo `psql`.
- [ ] Entendi a diferença entre database e schema.
- [ ] Criei e localizei `app` e `auditoria`.
- [ ] Executei scripts versionados e fiz o commit recomendado.

---

## Troubleshooting adicional

### Driver do PostgreSQL nao foi carregado

Ao criar a primeira conexão, o DBeaver pode precisar obter o driver PostgreSQL.

Use o gerenciador apresentado pela própria ferramenta e conclua o download.

Se o ambiente corporativo bloquear downloads, a instalação do driver pode depender das políticas de rede da empresa. No laboratório local, confirme conexão com a internet e tente novamente.

---

### Porta exibida no DBeaver esta errada

A porta do laboratório é:

```text
5433
```

`5432` é a porta interna do container.

No DBeaver instalado no Windows, use a porta publicada pela máquina.

---

### O DBeaver conecta, mas o terminal nao

Confirme se o comando usa o cliente dentro do container:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Você não precisa ter o executável `psql` instalado no Windows para usar esse comando.

---

### O terminal conecta, mas o DBeaver nao

Se o `docker exec` funciona, o PostgreSQL está ativo internamente.

Confira a publicação de porta:

```powershell
docker port formacao-postgres-m12
```

Depois valide host e porta no DBeaver.

Também confira firewall local e se a conexão usa `localhost`, não o nome do serviço Docker.

---

### O arquivo SQL executou parcialmente

Leia a mensagem exibida pelo cliente.

Não execute repetidamente sem entender em qual comando ocorreu a falha.

Os scripts desta aula são pequenos para facilitar diagnóstico.

Execute os comandos individualmente, corrija a causa e depois valide o arquivo completo.

---

### A arvore do DBeaver mostra objetos antigos

Atualize a conexão ou o nó específico.

Ferramentas visuais podem manter metadados em cache para navegação.

Use SQL ou `psql` como confirmação do estado real.

---

## Perguntas de revisao

1. Qual é a diferença entre servidor PostgreSQL, database e schema?
2. Por que DBeaver e `psql` são clientes, e não bancos de dados?
3. O que é um nome qualificado?
4. Qual é a função do `search_path`?
5. O que `current_database()` informa?
6. O que `current_schema()` informa?
7. Qual é a diferença entre SQL e metacomando do `psql`?
8. Por que salvar scripts no repositório?
9. Por que a conexão foi nomeada com `[LOCAL]`?
10. Por que nenhuma tabela foi criada nesta aula?

---

## Roteiro de resposta

### 1. Servidor, database e schema

```text
servidor:
processo PostgreSQL que recebe conexões.

database:
unidade escolhida ao conectar.

schema:
namespace dentro do database.
```

### 2. Clientes

DBeaver e `psql` enviam comandos para o PostgreSQL. Eles não substituem o servidor nem são o local principal dos dados.

### 3. Nome qualificado

É um nome com schema e objeto:

```text
app.ordem_servico
```

### 4. search_path

Define a ordem de schemas usada para resolver nomes não qualificados.

### 5. current_database

Retorna o database da sessão atual.

### 6. current_schema

Retorna o primeiro schema efetivo do caminho atual.

### 7. SQL e metacomando

SQL é enviado ao PostgreSQL. Metacomandos como `\dn` são interpretados pelo cliente `psql`.

### 8. Scripts versionados

Permitem revisão, histórico, repetição, compartilhamento e rastreabilidade.

### 9. Prefixo LOCAL

Ajuda a reconhecer o ambiente e reduz risco de executar comandos na conexão errada.

### 10. Sem tabelas

A aula 273 tratará tipos e a 274 iniciará DDL de tabelas. A sequência não deve ser antecipada.

---

## Desafio opcional

Crie:

```text
sql/04_relatorio_contexto.sql
```

O arquivo deve retornar uma única linha com:

```text
database atual;
usuario atual;
schema atual;
search_path como texto;
data e hora do servidor.
```

Você poderá pesquisar funções e comandos já disponíveis no PostgreSQL, mas não deve:

- criar tabela;
- criar view;
- alterar configuração permanente;
- usar Java;
- instalar extensão.

Execute o arquivo pelo DBeaver e pelo `psql`.

Depois registre no `README.md` qual ferramenta apresentou o resultado de forma mais legível e qual foi mais direta para automatizar.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 272 - M12.02 - DBeaver psql schemas e rotina de trabalho

- Reutilizei o PostgreSQL criado na aula 271.
- Configurei a conexao `[LOCAL] M12 - PostgreSQL` no DBeaver.
- Entendi a diferenca entre servidor, database e schema.
- Criei os schemas `app` e `auditoria` sem antecipar tabelas.
- Consultei schemas pelo DBeaver, `information_schema` e `psql`.
- Verifiquei `current_database`, `current_user`, `current_schema` e `search_path`.
- Executei arquivos SQL versionados pelo terminal e pela ferramenta visual.
- Registrei uma rotina para confirmar o contexto antes de executar SQL.
- Proxima aula: tipos de dados PostgreSQL com criterio.
```

---

## Referencia tecnica curta

```text
Servidor:
PostgreSQL no container formacao-postgres-m12.

Conexao da maquina:
localhost:5433.

Database:
formacao_java.

Usuario:
formacao.

Schemas da aplicacao:
app e auditoria.

Cliente visual:
DBeaver Community.

Cliente de terminal:
psql dentro do container.

Script inicial de toda sessao:
00_verificar_contexto.sql.
```

Antes da próxima aula, pratique esta sequência:

```powershell
docker exec -it formacao-postgres-m12 `
  psql -U formacao -d formacao_java
```

Dentro do `psql`:

```text
\conninfo
\dn
```

E:

```sql
SELECT current_database(), current_user, current_schema();
SHOW search_path;
```

Saída:

```text
\q
```
