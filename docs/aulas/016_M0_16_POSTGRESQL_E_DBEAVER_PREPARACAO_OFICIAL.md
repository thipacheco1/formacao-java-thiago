# 016 — M0.16 — PostgreSQL e DBeaver: Preparação

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.16.01` — PostgreSQL e DBeaver preparação — Conceito, por que existe e vocabulário essencial.
- `M0.16.02` — PostgreSQL e DBeaver preparação — Exemplo mínimo digitado do zero.
- `M0.16.03` — PostgreSQL e DBeaver preparação — Exemplo aplicado ao domínio corporativo.
- `M0.16.04` — PostgreSQL e DBeaver preparação — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para preparar PostgreSQL e DBeaver no ambiente local, validar porta, usuário, banco de dados, conexão e diagnóstico básico antes dos módulos de backend com persistência.

---

## Complemento operacional — roteiro final de instalação do PostgreSQL e DBeaver


> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.


Esta aula já explica PostgreSQL, DBeaver, servidor, porta, usuário, database, driver JDBC e validação SQL. Este complemento funciona como checklist operacional.

### PostgreSQL — instalação

Fluxo:

```text
1. Baixar PostgreSQL de fonte oficial.
2. Executar instalador.
3. Definir senha do usuário `postgres`.
4. Confirmar porta, normalmente `5432`.
5. Concluir instalação.
6. Validar serviço rodando.
7. Guardar a senha fora do Git.
```

Não registrar senha real em:

```text
README;
docs/ambiente.md;
diário;
prints compartilhados;
código;
repositório.
```

### DBeaver — instalação

Fluxo:

```text
1. Baixar DBeaver Community de fonte oficial.
2. Instalar.
3. Abrir.
4. Criar conexão PostgreSQL.
5. Permitir download do driver JDBC quando solicitado.
6. Testar conexão.
```

### Conexão local recomendada

```text
Host: localhost
Port: 5432
Database: postgres ou formacao_java
Username: postgres
Password: senha definida localmente
```

Depois criar a database:

```sql
CREATE DATABASE formacao_java;
```

### Validação SQL obrigatória

Conectado na database de estudo:

```sql
SELECT version();

SELECT current_database();

CREATE TABLE ambiente_validacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ambiente_validacao (descricao)
VALUES ('PostgreSQL e DBeaver preparados');

SELECT *
FROM ambiente_validacao;
```

### Critério operacional atualizado

```markdown
## PostgreSQL e DBeaver validados

- [ ] PostgreSQL instalado.
- [ ] Serviço do PostgreSQL rodando.
- [ ] Porta identificada.
- [ ] Senha do `postgres` guardada fora do Git.
- [ ] DBeaver Community instalado.
- [ ] Driver PostgreSQL JDBC baixado pelo DBeaver.
- [ ] Conexão local criada.
- [ ] `Test Connection` funciona.
- [ ] Database `formacao_java` criada.
- [ ] `SELECT version();` executado.
- [ ] `SELECT current_database();` executado.
- [ ] Tabela de validação criada, inserida e consultada.
```

---

## Onde estamos na formação

Estamos seguindo a ordem oficial do Módulo 0.

Até aqui, a base já passou por:

```text
M0.01 — mapa da formação;
M0.02 — diagnóstico inicial;
M0.03 — organização do Windows;
M0.04 — PowerShell e comandos básicos;
M0.05 — JDK, JRE e JVM;
M0.06 — compilação manual com javac;
M0.07 — IntelliJ IDEA Community;
M0.08 — debug inicial;
M0.09 — Git instalação e configuração global;
M0.10 — Git local;
M0.11 — GitHub e repositório remoto;
M0.12 — Markdown para documentação técnica;
M0.13 — diário de bordo e rastreabilidade;
M0.14 — Codex/IA no IntelliJ com ética e método;
M0.15 — Maven instalação e validação inicial.
```

Agora o foco é banco de dados.

Mas atenção:

```text
ainda não estamos estudando SQL profundamente;
ainda não estamos estudando JDBC;
ainda não estamos estudando JPA;
ainda não estamos estudando Spring Data;
ainda não estamos modelando banco profissionalmente.
```

Esta aula é preparação.

O objetivo é garantir que, quando o backend precisar salvar e consultar dados, o ambiente local já esteja pronto.

---

## Hoje a aula é sobre preparar o banco antes de precisar dele

Um backend real raramente vive só em memória.

Ele precisa lidar com dados.

Exemplos:

```text
clientes;
pedidos;
produtos;
ordens de serviço;
atividades;
pagamentos;
auditoria;
histórico;
usuários;
permissões;
mensageria;
configurações.
```

Esses dados normalmente precisam ser persistidos.

Persistir significa:

```text
salvar de forma durável para consultar depois.
```

No mundo Java Backend, PostgreSQL é um banco relacional muito usado.

DBeaver é uma ferramenta visual para conectar, explorar e executar comandos em bancos de dados.

Nesta aula, vamos preparar os dois.

---

## O que é PostgreSQL

PostgreSQL é um sistema gerenciador de banco de dados relacional.

Na prática, ele é um servidor de banco.

Ele permite criar:

```text
databases;
schemas;
tables;
columns;
constraints;
indexes;
users;
permissions;
queries;
transactions.
```

Mas nesta aula, foque no básico:

```text
PostgreSQL é o banco;
ele roda como serviço;
ele escuta em uma porta;
você se conecta com usuário, senha, host, porta e database.
```

Exemplo de conexão local:

```text
host: localhost
porta: 5432
database: formacao_java
usuário: postgres
senha: definida na instalação
```

---

## O que é DBeaver

DBeaver é uma ferramenta cliente para banco de dados.

Ele não substitui o PostgreSQL.

Ele se conecta ao PostgreSQL.

Pense assim:

```text
PostgreSQL = servidor de banco
DBeaver = ferramenta cliente para acessar o banco
```

O DBeaver permite:

```text
criar conexão;
testar conexão;
visualizar bancos;
visualizar tabelas;
executar SQL;
consultar dados;
editar dados em ambiente local;
investigar erros;
validar se uma aplicação gravou corretamente.
```

No backend, DBeaver será muito útil para validar o que a aplicação fez no banco.

Exemplo futuro:

```text
API criou um pedido?
DBeaver consulta a tabela pedido.
API atualizou status?
DBeaver confere o status no banco.
Teste falhou?
DBeaver ajuda a investigar os dados.
```

---

## PostgreSQL e DBeaver não são a mesma coisa

Esse ponto precisa ficar claro.

```text
PostgreSQL guarda os dados.
DBeaver acessa e visualiza os dados.
```

Se o PostgreSQL não estiver instalado ou rodando, o DBeaver não consegue conectar.

Se o DBeaver não estiver instalado, o PostgreSQL ainda pode estar funcionando.

Você poderia acessar PostgreSQL por outras ferramentas, como:

```text
psql;
pgAdmin;
aplicação Java;
outros clientes SQL.
```

Nesta formação, vamos usar DBeaver porque ele é prático para estudo e diagnóstico.

---

## O que é servidor de banco

Servidor de banco é o processo que fica rodando e aguardando conexões.

No caso local, ele roda na sua própria máquina.

Quando você instala PostgreSQL no Windows, ele costuma ser configurado como serviço.

Um serviço é algo que pode iniciar junto com o sistema ou ser iniciado manualmente.

Se o serviço estiver parado, a conexão falha.

Sintoma comum:

```text
connection refused
```

ou:

```text
could not connect to server
```

O primeiro diagnóstico é:

```text
o PostgreSQL está rodando?
```

---

## Porta 5432

PostgreSQL normalmente usa a porta:

```text
5432
```

Porta é como uma entrada de comunicação.

Quando DBeaver se conecta, ele precisa saber:

```text
host;
porta;
database;
usuário;
senha.
```

Exemplo:

```text
host: localhost
porta: 5432
```

Se outra instalação já usa a porta 5432, pode haver conflito.

Nesse caso, o PostgreSQL pode não iniciar ou pode ter sido instalado em outra porta.

Por isso, não memorize cegamente.

Use 5432 como padrão esperado, mas valide quando houver erro.

---

## Usuário `postgres`

Durante a instalação local, é comum existir um usuário administrativo chamado:

```text
postgres
```

Esse usuário geralmente é o superusuário inicial do banco.

Durante a instalação, você define uma senha para ele.

Guarde essa senha com segurança.

Não coloque em:

```text
README público;
Git;
diário público;
prints compartilhados;
mensagem em ferramenta externa;
código-fonte.
```

Para estudo local, você pode usar `postgres`.

Em ambiente profissional, não se deve usar superusuário em aplicação.

Mais tarde, vamos aprender usuários próprios, permissões e segurança.

Nesta aula, o foco é preparação local.

---

## Database

Database é uma base de dados.

No PostgreSQL, você pode ter várias databases dentro do mesmo servidor.

Exemplo:

```text
postgres
formacao_java
api_pedidos
teste_backend
```

Para a formação, crie uma database simples:

```text
formacao_java
```

Evite nomes com:

```text
espaço;
acento;
caractere especial;
letra maiúscula desnecessária.
```

Prefira:

```text
formacao_java
```

ou:

```text
formacao_backend
```

Nomes simples reduzem erro.

---

## Host local

Quando PostgreSQL roda na sua máquina, o host normalmente é:

```text
localhost
```

ou:

```text
127.0.0.1
```

`localhost` aponta para a própria máquina.

Então:

```text
host: localhost
```

significa:

```text
conectar no PostgreSQL que está rodando neste computador.
```

Em empresa, o host pode ser um servidor remoto.

Mas nesta aula, use local.

Nunca use dados de banco corporativo em estudos sem autorização.

---

## Instalação do PostgreSQL

O fluxo geral no Windows é:

```text
baixar instalador oficial ou recomendado;
executar instalação;
escolher componentes;
definir senha do usuário postgres;
definir porta;
concluir instalação;
validar serviço;
criar database de estudo;
conectar via DBeaver.
```

Durante a instalação, tome cuidado com:

```text
senha definida;
porta escolhida;
pasta de instalação;
componentes opcionais;
Stack Builder, se aparecer;
serviço do PostgreSQL.
```

Para a formação, não precisamos instalar componentes extras sem necessidade.

O essencial é:

```text
servidor PostgreSQL funcionando;
porta conhecida;
usuário e senha válidos.
```

---

## Stack Builder

Em algumas instalações, pode aparecer o Stack Builder.

Ele serve para instalar componentes adicionais.

No início, normalmente você não precisa dele.

A regra é:

```text
não instale componentes extras sem entender por quê.
```

Feche ou ignore, se não for necessário para a aula.

Quanto menos coisa desnecessária, menor a chance de confusão.

---

## Validação do PostgreSQL

Depois de instalar, valide se o PostgreSQL está rodando.

Formas possíveis:

```text
serviços do Windows;
pgAdmin, se instalado;
psql, se disponível no PATH;
DBeaver;
logs do serviço;
ferramenta de conexão.
```

Nesta aula, a validação principal será pelo DBeaver.

Mas, se `psql` estiver disponível, você pode validar:

```powershell
psql --version
```

Esse comando mostra se o cliente `psql` está disponível no terminal.

Atenção:

```text
psql disponível não garante que o servidor está rodando.
```

Ele apenas valida o cliente.

Para conectar de verdade, precisa host, porta, usuário e senha.

---

## Instalação do DBeaver

O fluxo geral no Windows é:

```text
baixar DBeaver Community;
instalar;
abrir;
criar nova conexão;
escolher PostgreSQL;
informar host, porta, database, usuário e senha;
baixar driver quando solicitado;
testar conexão.
```

DBeaver pode baixar o driver JDBC do PostgreSQL na primeira conexão.

Isso é normal.

Se não houver internet ou se houver bloqueio corporativo, o download do driver pode falhar.

Em empresa, pode haver política específica.

Para estudo local, normalmente o DBeaver baixa automaticamente.

---

## O que é driver JDBC

Driver JDBC é a biblioteca que permite uma aplicação Java conversar com um banco específico.

DBeaver é uma ferramenta Java.

Para conectar ao PostgreSQL, ele precisa do driver PostgreSQL JDBC.

Quando DBeaver pergunta se pode baixar o driver, ele está baixando a biblioteca necessária para falar com PostgreSQL.

Mais tarde, no Java Backend, a aplicação também usará driver JDBC, direta ou indiretamente.

Então, mesmo aqui, já estamos preparando um conceito futuro:

```text
Java conversa com banco por meio de driver.
```

---

## Criando a conexão no DBeaver

Dados típicos para conexão local:

```text
Database type: PostgreSQL
Host: localhost
Port: 5432
Database: formacao_java
Username: postgres
Password: senha definida na instalação
```

Depois clique em:

```text
Test Connection
```

Se funcionar, salve.

Se falhar, leia a mensagem.

Não chute.

Diagnostique.

---

## Criando database pelo DBeaver

Depois de conectar no servidor PostgreSQL, crie a database de estudo.

Nome:

```text
formacao_java
```

Dependendo da interface, você pode:

```text
clicar com botão direito em Databases;
Create New Database;
informar o nome;
confirmar.
```

Ou usar SQL:

```sql
CREATE DATABASE formacao_java;
```

Depois conecte nessa database.

Atenção:

```text
se você criou a database depois de configurar a conexão,
talvez precise atualizar a árvore ou criar nova conexão apontando para ela.
```

---

## Primeira validação SQL

Com conexão aberta na database `formacao_java`, execute:

```sql
SELECT version();
```

Esse comando retorna a versão do PostgreSQL.

Depois execute:

```sql
SELECT current_database();
```

Isso mostra a database atual.

Resultado esperado:

```text
formacao_java
```

Se retornar outra database, você está conectado em outro lugar.

Isso é diagnóstico simples e importante.

---

## Criando uma tabela mínima

Ainda não estamos estudando SQL profundamente.

Mas podemos criar uma tabela mínima para validar escrita e leitura.

Execute:

```sql
CREATE TABLE ambiente_validacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Depois insira:

```sql
INSERT INTO ambiente_validacao (descricao)
VALUES ('PostgreSQL e DBeaver preparados');
```

Consulte:

```sql
SELECT *
FROM ambiente_validacao;
```

Se a linha aparecer, você validou:

```text
conexão;
database;
permissão de criação;
insert;
select;
visualização no DBeaver.
```

Isso é suficiente para preparação.

---

## Limpando a tabela de validação

Se quiser limpar a tabela:

```sql
DROP TABLE ambiente_validacao;
```

Mas, para rastreabilidade, pode manter.

Ela mostra que o ambiente foi validado.

Em projeto profissional, não sairíamos criando tabelas aleatórias em qualquer banco.

Mas em database local de estudo, isso é aceitável.

---

## Exemplo mínimo digitado do zero

Resumo da prática mínima:

```text
1. Instalar PostgreSQL.
2. Guardar senha local do usuário postgres com segurança.
3. Confirmar porta 5432 ou porta escolhida.
4. Instalar DBeaver Community.
5. Criar conexão PostgreSQL.
6. Informar localhost, 5432, postgres, senha.
7. Criar database formacao_java.
8. Executar SELECT version().
9. Executar SELECT current_database().
10. Criar tabela ambiente_validacao.
11. Inserir uma linha.
12. Consultar a linha.
```

SQL da prática:

```sql
SELECT version();

SELECT current_database();

CREATE TABLE ambiente_validacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ambiente_validacao (descricao)
VALUES ('PostgreSQL e DBeaver preparados');

SELECT *
FROM ambiente_validacao;
```

Isso valida o ambiente.

---

## Exemplo aplicado ao domínio corporativo

Imagine um backend de ordem de serviço.

No futuro, uma API pode precisar gravar:

```text
ordem_servico;
atividade;
cliente;
produto;
historico;
ocorrencia;
mensagem;
auditoria.
```

Antes de programar essa API, o ambiente precisa permitir:

```text
conectar no banco;
criar estrutura;
inserir dados;
consultar dados;
validar resultado;
investigar erro.
```

Uma validação simples de domínio poderia ser:

```sql
CREATE TABLE ordem_servico_validacao (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ordem_servico_validacao (numero, status)
VALUES ('OS-EXEMPLO-001', 'ABERTA');

SELECT *
FROM ordem_servico_validacao;
```

Isso ainda não é modelagem definitiva.

É apenas uma simulação para conectar banco com domínio backend.

Depois, quando Java começar a conversar com PostgreSQL, essa noção será reaproveitada.

---

## Segurança desde o começo

Mesmo em preparação, segurança importa.

Não coloque senha em:

```text
README.md;
docs/ambiente.md;
diário de bordo;
prints;
repositório Git;
código-fonte;
mensagens para terceiros.
```

Em documentação, escreva assim:

```text
usuário: postgres
senha: definida localmente durante instalação
```

Ou:

```text
senha: não documentada por segurança
```

Se precisar registrar exemplo, use placeholder:

```text
DB_PASSWORD=SENHA_LOCAL_NAO_VERSIONADA
```

Nunca use senha real.

Esse hábito precisa nascer agora.

---

## Organização da documentação do ambiente

Crie ou atualize:

```text
docs/ambiente.md
```

Modelo:

```markdown
# Ambiente de desenvolvimento

## PostgreSQL

- Host local: `localhost`
- Porta padrão: `5432`
- Usuário administrativo local: `postgres`
- Database de estudo: `formacao_java`
- Senha: não documentada por segurança

## Validações executadas

```sql
SELECT version();
SELECT current_database();
```

## DBeaver

- Conexão criada para PostgreSQL local.
- Test Connection executado com sucesso.
- Driver baixado pelo DBeaver quando solicitado.

## Observações

- Não versionar senhas.
- Não usar banco corporativo para estudos sem autorização.
- Banco local é apenas para formação.
```

Esse arquivo registra o ambiente sem vazar segredo.

---

## Atalhos e ações úteis nesta aula

Atalhos podem variar conforme versão, sistema operacional e configuração, então use como referência prática.

### DBeaver

| Ação | Atalho/Ação | Uso |
|---|---|---|
| Nova conexão | Menu `Database > New Database Connection` | Criar conexão com PostgreSQL |
| Testar conexão | Botão `Test Connection` | Validar host, porta, usuário e senha |
| Executar SQL atual | `Ctrl + Enter` em muitos keymaps | Executar statement selecionado/atual |
| Auto completar SQL | `Ctrl + Space` em muitos keymaps | Sugerir nomes e comandos |
| Atualizar árvore | Ação `Refresh` | Recarregar databases, schemas e tabelas |

### IntelliJ e terminal

| Ação | Atalho | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Validar comandos e Git |
| Project | `Alt + 1` | Navegar em `docs` |
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE |
| Search Everywhere | `Shift Shift` | Buscar arquivos e ações |
| Reformatar | `Ctrl + Alt + L` | Organizar Markdown/SQL quando aplicável |
| Commit | `Ctrl + K` | Revisar alterações antes do commit |

Registre os atalhos úteis em:

```text
docs/atalhos.md
```

Não tente decorar todos.

Use os que aparecem no fluxo real.

---

## Erros comuns

### Erro 1 — DBeaver instalado, mas PostgreSQL não

DBeaver é cliente.

Sem servidor PostgreSQL rodando, não há conexão.

Correção:

```text
instalar e iniciar PostgreSQL.
```

---

### Erro 2 — PostgreSQL instalado, mas serviço parado

Sintoma:

```text
connection refused
```

Correção:

```text
verificar serviços do Windows;
iniciar serviço do PostgreSQL;
validar porta.
```

---

### Erro 3 — Porta errada

Você tenta conectar em:

```text
5432
```

mas instalou PostgreSQL em outra porta.

Correção:

```text
verificar configuração da instalação;
ajustar porta no DBeaver.
```

---

### Erro 4 — Senha esquecida

Senha do usuário `postgres` foi definida na instalação.

Se esquecer, pode precisar resetar senha ou reinstalar dependendo do caso.

Correção preventiva:

```text
guardar senha em gerenciador seguro;
não colocar em Git.
```

---

### Erro 5 — Conectar na database errada

Você pensa que está em `formacao_java`, mas está em `postgres`.

Diagnóstico:

```sql
SELECT current_database();
```

---

### Erro 6 — Database não existe

Mensagem pode indicar que a database informada não existe.

Correção:

```text
criar database;
ou conectar primeiro em postgres e depois criar formacao_java.
```

---

### Erro 7 — Driver não baixou no DBeaver

Possíveis causas:

```text
sem internet;
bloqueio de rede;
proxy;
repositório inacessível;
restrição corporativa.
```

Correção:

```text
validar internet;
seguir política da empresa;
baixar driver por método permitido.
```

---

### Erro 8 — Usar banco corporativo para estudo

Não use banco real sem autorização.

Correção:

```text
usar PostgreSQL local;
usar dados fictícios;
não expor informação sensível.
```

---

### Erro 9 — Documentar senha real

Nunca faça isso.

Correção:

```text
usar placeholder;
guardar senha fora do repositório.
```

---

### Erro 10 — Achar que já aprendeu banco profundamente

Esta aula é preparação.

Ainda vamos estudar SQL, modelagem, JDBC, transações, JPA e Spring Data em módulos próprios.

---

## Diagnóstico de conexão

Quando a conexão falhar, siga o roteiro.

### 1. PostgreSQL está instalado?

Verifique no Windows se existe serviço do PostgreSQL.

### 2. Serviço está rodando?

Se estiver parado, inicie.

### 3. Host está correto?

Para local:

```text
localhost
```

ou:

```text
127.0.0.1
```

### 4. Porta está correta?

Padrão:

```text
5432
```

Mas valide se foi alterada.

### 5. Usuário está correto?

Exemplo local:

```text
postgres
```

### 6. Senha está correta?

Senha definida na instalação.

### 7. Database existe?

Se está conectando em:

```text
formacao_java
```

ela precisa existir.

### 8. Driver JDBC foi baixado?

Se DBeaver pediu driver, autorize quando for ambiente de estudo e fonte confiável.

### 9. A mensagem é de autenticação ou conexão?

Exemplo:

```text
password authentication failed
```

é diferente de:

```text
connection refused
```

### 10. Conseguiu rodar `SELECT current_database()`?

Se sim, conexão básica está validada.

---

## Checklist de preparação

Use este checklist:

```markdown
# Checklist — PostgreSQL e DBeaver

- [ ] PostgreSQL instalado.
- [ ] Senha local do usuário `postgres` guardada com segurança.
- [ ] Porta da instalação identificada.
- [ ] Serviço PostgreSQL iniciado.
- [ ] DBeaver Community instalado.
- [ ] Conexão PostgreSQL criada no DBeaver.
- [ ] Driver JDBC baixado quando solicitado.
- [ ] `Test Connection` executado com sucesso.
- [ ] Database `formacao_java` criada.
- [ ] `SELECT version();` executado.
- [ ] `SELECT current_database();` executado.
- [ ] Tabela `ambiente_validacao` criada.
- [ ] Insert de validação executado.
- [ ] Select de validação executado.
- [ ] Senha não foi documentada em Git.
- [ ] Diário de bordo atualizado.
```

Checklist concluído significa:

```text
ambiente de banco preparado.
```

Não significa domínio profundo de banco ainda.

---

## Prática recomendada

Execute no DBeaver:

```sql
SELECT version();

SELECT current_database();

CREATE TABLE ambiente_validacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ambiente_validacao (descricao)
VALUES ('PostgreSQL e DBeaver preparados');

SELECT *
FROM ambiente_validacao;
```

Atualize:

```text
docs/ambiente.md
docs/diario-de-bordo.md
docs/atalhos.md
```

Depois, no terminal do projeto de documentação, valide Git:

```bash
git status
git diff
git add docs/ambiente.md docs/diario-de-bordo.md docs/atalhos.md
git diff --staged
git commit -m "Documenta preparacao de PostgreSQL e DBeaver"
git status
```

Se ainda não houver repositório para o material, apenas registre no diário.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 016 — PostgreSQL e DBeaver preparação

### O que aprendi
Aprendi que PostgreSQL é o servidor de banco e DBeaver é uma ferramenta cliente para conectar, visualizar e executar SQL.

### O que pratiquei
Preparei conexão local com PostgreSQL, criei a database `formacao_java`, executei queries de validação e registrei o ambiente sem expor senha.

### Conceitos principais
- PostgreSQL
- DBeaver
- Servidor de banco
- Cliente de banco
- Host
- Porta
- Database
- Usuário
- Senha
- Driver JDBC
- Test Connection
- Serviço do PostgreSQL

### SQL executado
```sql
SELECT version();

SELECT current_database();

CREATE TABLE ambiente_validacao (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ambiente_validacao (descricao)
VALUES ('PostgreSQL e DBeaver preparados');

SELECT *
FROM ambiente_validacao;
```

### Arquivos criados ou alterados
- `docs/ambiente.md`
- `docs/diario-de-bordo.md`
- `docs/atalhos.md`

### Atalhos úteis
- `Ctrl + Enter` — executar SQL atual no DBeaver, conforme keymap.
- `Ctrl + Space` — autocomplete SQL, conforme keymap.
- `Alt + F12` — terminal integrado.
- `Ctrl + Shift + A` — buscar ação.
- `Ctrl + K` — Commit.

### Erros que quero evitar
- confundir DBeaver com PostgreSQL;
- esquecer que o PostgreSQL precisa estar rodando;
- usar porta errada;
- conectar na database errada;
- documentar senha real;
- usar banco corporativo em estudo sem autorização;
- achar que preparação de banco já é domínio profundo de SQL.

### Próximo passo
Preparar Postman/Insomnia e HTTP básico.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é PostgreSQL;
explicar o que é DBeaver;
diferenciar servidor de banco e cliente de banco;
entender host localhost;
entender porta 5432 como padrão comum do PostgreSQL;
entender usuário postgres em ambiente local;
entender database;
instalar PostgreSQL em ambiente local;
instalar DBeaver Community;
criar conexão PostgreSQL no DBeaver;
testar conexão;
baixar driver JDBC quando solicitado;
criar database formacao_java;
executar SELECT version();
executar SELECT current_database();
criar tabela de validação;
inserir linha de validação;
consultar linha de validação;
diagnosticar erro de porta, senha, serviço parado e database inexistente;
não documentar senha real;
registrar ambiente no diário;
usar atalhos úteis quando conveniente.
```

Não precisa ainda dominar SQL.

Não precisa ainda conectar Java ao banco.

Não precisa ainda criar modelagem relacional profissional.

O objetivo é deixar PostgreSQL e DBeaver prontos para uso futuro.

---

## Fechamento da aula

Hoje preparamos a base de banco de dados.

Isso não transforma ninguém em especialista em PostgreSQL.

Mas remove um bloqueio futuro.

Quando a formação chegar em JDBC, JPA, Spring Data e persistência, o ambiente já terá:

```text
PostgreSQL instalado;
porta conhecida;
usuário local;
database de estudo;
DBeaver configurado;
conexão validada;
SQL básico de validação;
diário atualizado;
cuidado com senha.
```

Essa é a postura correta no Módulo 0:

```text
preparar o ambiente antes de depender dele.
```

Na próxima aula, vamos preparar ferramentas de HTTP:

```text
Postman;
Insomnia;
request;
response;
GET;
POST;
PUT;
PATCH;
DELETE;
headers;
body JSON;
status codes.
```

Ainda não será Spring Boot.

Ainda será preparação.

Mas essa preparação vai ser essencial para testar APIs quando começarmos backend web.
