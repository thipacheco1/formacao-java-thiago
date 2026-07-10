# 271 - M12.01 - Introducao ao SQL, PostgreSQL e modelagem relacional para Java Backend

## Apresentacao da aula

A aula 270 encerrou oficialmente o M11 e consolidou a base de ferramentas profissionais da formação. Você já trabalhou com Maven, Git, testes automatizados, JaCoCo, Docker, Docker Compose, GitHub Actions, Testcontainers, WireMock, ArchUnit, segurança de dependências e qualidade automatizada.

Agora começa um novo bloco:

```text
M12 - SQL, PostgreSQL e modelagem relacional
```

Até aqui, grande parte do aprendizado aconteceu dentro da aplicação Java: objetos, coleções, regras, serviços, testes, pacotes e ferramentas. A partir desta aula, você passa a olhar com profundidade para os dados que uma aplicação backend precisa manter, consultar e proteger.

A pergunta principal muda.

No M11, a preocupação era:

```text
Como construir, testar, empacotar e validar um projeto Java profissional?
```

No M12, a pergunta passa a ser:

```text
Como representar, armazenar, consultar e proteger os dados de uma aplicação backend?
```

Esta aula abre o pilar de dados. Ela apresenta banco de dados, SGBD, banco relacional, SQL e PostgreSQL, além dos conceitos iniciais de tabela, linha, coluna, chave primária, chave estrangeira e relacionamento.

A prática será propositalmente simples: subir um PostgreSQL com Docker Compose, conectar com `psql`, executar verificações mínimas e registrar um primeiro modelo conceitual do domínio de Ordem de Serviço.

O objetivo não é transformar esta aula em uma revisão de Docker Compose. O Compose será apenas o meio de obter um PostgreSQL local, reproduzível e fácil de remover.

Também não vamos conectar Java ao banco. JDBC, JPA, Hibernate, Spring Data e Spring Boot terão seu momento correto depois que a base de SQL e modelagem estiver consolidada.

Ao final, você deverá entender o papel do banco dentro de um backend, reconhecer os elementos fundamentais de um modelo relacional e possuir um ambiente PostgreSQL funcional para continuar o M12.

---

## Onde estamos na formacao

A sequência pedagógica da formação foi construída para evitar dependência cega de frameworks:

```text
Java e lógica
    ↓
Java Core
    ↓
Orientação a objetos e domínio
    ↓
Collections, Generics, Optional, Lambdas e Streams
    ↓
Exceptions, I/O e utilitários
    ↓
SOLID e Design Patterns
    ↓
Ferramentas profissionais
    ↓
SQL, PostgreSQL e modelagem relacional
```

Você já aprendeu que um objeto Java pode representar uma entidade do domínio. Agora precisa aprender como dados equivalentes podem ser persistidos em um banco relacional.

Um objeto Java normalmente vive enquanto a aplicação está executando. Quando a JVM termina, o conteúdo que estava apenas em memória deixa de existir.

Um sistema corporativo precisa de outra característica:

```text
a aplicação termina;
os dados permanecem;
outra execução consegue recuperá-los;
outros usuários conseguem trabalhar com eles;
históricos continuam disponíveis.
```

Essa permanência é parte do conceito de persistência.

No M12, o foco será o banco em si:

- como os dados são organizados;
- como estruturas se relacionam;
- como SQL consulta e altera informações;
- como integridade é protegida;
- como decisões de modelagem afetam manutenção e performance.

Somente depois dessa base a formação seguirá para persistência Java no M13.

Essa ordem importa. Sem SQL, JPA pode virar apenas decoração de annotations. Sem modelagem, um repository pode esconder problemas estruturais. Sem entender o PostgreSQL, erros de constraint, conexão ou consulta ficam difíceis de diagnosticar.

---

## Objetivo pratico

Nesta aula, você vai criar o laboratório oficial:

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
        ├── compose.yaml
        ├── README.md
        ├── modelo-conceitual-inicial.md
        └── sql
            └── README.md
```

Ao concluir a prática, você terá:

1. PostgreSQL executando em container;
2. healthcheck confirmando que o banco está pronto;
3. conexão funcional pelo `psql`;
4. consultas mínimas de verificação;
5. um modelo conceitual inicial de Cliente, Ordem de Serviço e Atividade;
6. documentação suficiente para repetir o laboratório;
7. um commit coerente com a abertura do M12.

Não haverá tabela criada nesta aula. A sequência correta ainda passará por DBeaver, `psql`, schemas, tipos de dados e só então DDL.

---

## Conceito essencial

### Banco de dados

Banco de dados é uma coleção organizada de dados que pode ser armazenada, consultada e modificada.

A palavra mais importante é:

```text
organizada
```

Salvar informações em qualquer lugar não significa que existe um modelo adequado.

Uma aplicação poderia armazenar dados em:

- variáveis;
- listas em memória;
- arquivos;
- planilhas;
- bancos relacionais;
- bancos orientados a documentos;
- bancos chave-valor.

Cada opção possui objetivos, vantagens e limites.

Neste módulo, o foco será banco relacional porque ele aparece com frequência em sistemas corporativos e oferece uma base sólida para:

- integridade;
- relacionamentos;
- transações;
- consultas;
- relatórios;
- controle de concorrência;
- regras estruturais.

Imagine uma ordem de serviço criada hoje. Amanhã alguém precisa consultá-la. Depois, o status muda. Mais tarde, um relatório precisa considerar seu histórico.

Uma lista Java não resolve isso sozinha. Ela vive na memória do processo. Quando a aplicação termina, aquela lista desaparece.

Persistir significa manter dados de forma durável, permitindo recuperação posterior.

O banco não é apenas um lugar onde a aplicação “joga” objetos. Ele possui estrutura, linguagem, regras e responsabilidades próprias.

---


### Dado, informacao e contexto

Um dado é um valor registrado.

Exemplos:

```text
"OS-2026-0001"
"ABERTA"
"Cliente Alfa"
2026-07-10
199.90
```

Isoladamente, esses valores dizem pouco. Quando recebem contexto, passam a representar informação:

```text
código da ordem: OS-2026-0001;
status atual: ABERTA;
cliente responsável: Cliente Alfa;
data de abertura: 10/07/2026;
valor previsto: R$ 199,90.
```

Uma aplicação backend trabalha continuamente com esse ciclo:

```text
receber dados;
validar;
aplicar regras;
consultar informações existentes;
persistir alterações;
devolver uma resposta;
registrar histórico.
```

Essa distinção ajuda a entender por que modelagem importa. O banco não deveria guardar valores sem significado conhecido. Cada estrutura deve comunicar o que representa, quais dados aceita e como se relaciona com o restante do domínio.

Por exemplo, o valor `ABERTA` precisa estar associado ao conceito de status de uma ordem. O número `1` pode ser um identificador de cliente, ordem, atividade ou produto. O significado não está apenas no valor; está na estrutura e no contexto em que ele foi armazenado.

Um modelo bem construído reduz ambiguidades. Um modelo ruim força a aplicação a adivinhar significados, repetir validações e conviver com dados contraditórios.


### SGBD

SGBD significa:

```text
Sistema Gerenciador de Banco de Dados
```

O banco representa os dados organizados. O SGBD é o software que gerencia esses dados.

Ele permite:

- criar bancos;
- definir estruturas;
- inserir e consultar registros;
- controlar usuários;
- aplicar permissões;
- coordenar acessos simultâneos;
- proteger integridade;
- executar backup e restauração;
- manter transações;
- otimizar consultas.

Exemplos de SGBDs relacionais:

```text
PostgreSQL
MySQL
MariaDB
Oracle Database
Microsoft SQL Server
H2
```

Nesta formação, o principal será PostgreSQL.

---

### Banco relacional

Um banco relacional organiza dados em relações, normalmente representadas por tabelas.

Exemplo conceitual de clientes:

| id | nome | documento |
|---:|---|---|
| 1 | Cliente Alfa | 11111111000100 |
| 2 | Cliente Beta | 22222222000100 |

Exemplo conceitual de ordens:

| id | codigo | status | cliente_id |
|---:|---|---|---:|
| 1001 | OS-2026-0001 | ABERTA | 1 |
| 1002 | OS-2026-0002 | AGENDADA | 1 |
| 1003 | OS-2026-0003 | CONCLUIDA | 2 |

A coluna `cliente_id` permite ligar a ordem ao cliente.

Em vez de repetir nome e documento do cliente em cada ordem, a ordem mantém uma referência.

A ideia inicial é:

```text
estruturas representam conceitos;
registros representam ocorrências;
chaves identificam;
referências conectam;
regras protegem consistência.
```

Modelagem conceitual, cardinalidade, normalização e modelo físico serão aprofundados em aulas próprias.

---

### Tabela, linha e coluna

Uma tabela representa um conjunto de registros do mesmo conceito.

Exemplos:

```text
cliente
ordem_servico
atividade
produto
pagamento
```

Uma linha representa uma ocorrência.

Na tabela `ordem_servico`, uma linha pode representar:

```text
1001 | OS-2026-0001 | ABERTA | 1
```

Uma coluna representa uma característica armazenada.

Exemplos de colunas de uma ordem:

```text
id
codigo
status
cliente_id
data_abertura
valor_previsto
```

A coluna possui nome e tipo. Os tipos do PostgreSQL serão estudados na aula 273.

A tabela não deve ser tratada como uma planilha sem regras. Ela faz parte de um modelo com identidade, tipos, restrições e relacionamentos.

---

### Chave primaria

Chave primária identifica uma linha de forma única dentro de uma tabela.

Exemplo:

| id | codigo | status |
|---:|---|---|
| 1001 | OS-2026-0001 | ABERTA |
| 1002 | OS-2026-0002 | AGENDADA |

Nesse caso, `id` pode ser a chave primária.

Conceitualmente:

```text
cada linha possui uma identidade;
duas linhas não compartilham a mesma identidade primária;
outras tabelas podem usar essa identidade como referência.
```

Em Java, você já estudou identidade de entidades. No banco, a chave primária representa a identidade persistida do registro.

A implementação e os critérios de escolha serão aprofundados na aula 275.

---

### Chave estrangeira

Chave estrangeira referencia uma linha de outra tabela.

Considere:

```text
cliente
- id
- nome
```

E:

```text
ordem_servico
- id
- codigo
- cliente_id
```

`ordem_servico.cliente_id` referencia `cliente.id`.

Essa relação permite responder:

```text
a qual cliente esta ordem pertence?
o cliente referenciado existe?
é possível criar uma ordem apontando para um cliente inexistente?
```

Esse tipo de proteção faz parte da integridade referencial.

Por enquanto, entenda o papel conceitual. A criação real da foreign key ficará para a aula 275.

---

### Relacionamentos

Relacionamento mostra como entidades se conectam.

No domínio inicial:

```text
CLIENTE (1) --------< (N) ORDEM_SERVICO
ORDEM_SERVICO (1) --< (N) ATIVIDADE
```

Leitura:

```text
um cliente pode possuir várias ordens de serviço;
cada ordem pertence a um cliente;

uma ordem pode possuir várias atividades;
cada atividade pertence a uma ordem.
```

A notação `1:N` significa um para muitos.

Ainda não estamos definindo obrigatoriedade, tipos SQL ou constraints. O objetivo é construir a visão inicial.

Mais adiante, você estudará:

- um para um;
- um para muitos;
- muitos para muitos;
- cardinalidade;
- opcionalidade;
- tabela associativa;
- modelo conceitual;
- modelo lógico;
- modelo físico.

---


### Modelagem conceitual

Modelagem conceitual é a etapa em que você representa os principais conceitos do domínio e seus relacionamentos sem se preocupar ainda com detalhes técnicos do PostgreSQL.

Nesta etapa, perguntas importantes são:

```text
quais conceitos existem?
o que cada conceito representa?
quais características pertencem a cada conceito?
como os conceitos se relacionam?
uma relação é obrigatória ou opcional?
uma ocorrência se relaciona com uma ou várias ocorrências?
```

No domínio de Ordem de Serviço, uma primeira leitura pode identificar:

```text
Cliente
Ordem de Servico
Atividade
Produto
Tecnico
Pagamento
```

Isso não significa que cada palavra virará automaticamente uma tabela. A modelagem começa pela compreensão do negócio. Depois, o modelo será refinado até chegar à estrutura lógica e física.

Considere a relação entre Cliente e Ordem de Serviço.

A frase de negócio:

```text
um cliente pode possuir várias ordens;
cada ordem pertence a um cliente.
```

já revela informações importantes:

- existem dois conceitos distintos;
- existe um relacionamento;
- o lado Cliente pode se relacionar com várias ordens;
- cada ordem precisa apontar para o cliente correspondente;
- repetir todos os dados do cliente na ordem provavelmente não é a melhor escolha.

A modelagem conceitual funciona como ponte entre linguagem de negócio e estrutura de dados.

Ela também ajuda a evitar um erro comum: começar criando colunas antes de entender o problema. Quando isso acontece, decisões técnicas surgem sem uma visão clara do domínio.

Nesta aula, o arquivo `modelo-conceitual-inicial.md` será simples. Ele não pretende encerrar a modelagem. Ele registra uma hipótese inicial que será revisada ao longo do M12.


### Por que separar dados

Imagine uma tabela única:

| os_codigo | os_status | cliente_nome | cliente_documento | atividade |
|---|---|---|---|---|
| OS-001 | ABERTA | Cliente Alfa | 111... | Instalação |
| OS-001 | ABERTA | Cliente Alfa | 111... | Entrega |
| OS-002 | AGENDADA | Cliente Alfa | 111... | Vistoria |

Nome e documento do cliente se repetem.

Isso pode causar:

- inconsistência;
- atualização duplicada;
- registros divergentes;
- desperdício;
- manutenção mais difícil.

Uma separação conceitual seria:

```text
CLIENTE
- id
- nome
- documento

ORDEM_SERVICO
- id
- codigo
- status
- cliente_id

ATIVIDADE
- id
- descricao
- ordem_servico_id
```

A aula 283 tratará normalização formalmente. Nesta aula, guarde a ideia:

```text
modelar é decidir o que cada estrutura representa e como as estruturas se relacionam.
```

---


### Integridade desde o inicio

Integridade significa manter os dados coerentes com as regras do modelo.

Mesmo antes de estudar constraints em profundidade, você precisa reconhecer perguntas de integridade:

```text
uma ordem pode existir sem cliente?
dois clientes podem ter o mesmo documento?
uma atividade pode apontar para uma ordem inexistente?
um status pode receber qualquer texto?
um valor pode ser negativo?
```

Parte dessas regras ficará na aplicação Java. Parte será protegida pelo banco. Em sistemas profissionais, as duas camadas não competem; elas se complementam.

A aplicação oferece mensagens, fluxo e validações de negócio. O banco protege a consistência persistida, inclusive quando existem múltiplos processos, integrações ou ferramentas acessando os dados.

Um modelo sem proteção pode aceitar estados impossíveis. Depois, relatórios, APIs e processos começam a tratar exceções que nunca deveriam ter sido gravadas.

Você ainda não implementará essas proteções. Chaves, constraints e integridade referencial terão aulas específicas. O objetivo agora é desenvolver a pergunta correta:

```text
qual regra precisa continuar verdadeira mesmo depois que o dado foi armazenado?
```

Essa mentalidade será usada em todas as etapas do M12.


### SQL

SQL significa:

```text
Structured Query Language
```

É uma linguagem usada para trabalhar com bancos relacionais.

Exemplo:

```sql
SELECT version();
```

Você declara que deseja consultar a versão do servidor. O PostgreSQL interpreta, planeja e executa.

Durante o M12, SQL será usado para:

- definir estruturas;
- inserir dados;
- consultar;
- atualizar;
- excluir;
- agrupar;
- relacionar;
- controlar transações;
- analisar execução.

Nesta aula, o uso será mínimo. Não criaremos tabelas.

---

### SQL e PostgreSQL nao sao a mesma coisa

SQL é a linguagem.

PostgreSQL é o SGBD que armazena dados e executa SQL.

Também vamos usar:

```text
psql:
cliente de terminal para conversar com PostgreSQL.

DBeaver:
ferramenta visual para trabalhar com conexões e scripts.
```

A aula 272 aprofundará `psql`, DBeaver, schemas e rotina de trabalho.

---

### Por que PostgreSQL

PostgreSQL foi escolhido porque reúne características importantes para a formação:

- é relacional;
- é completo;
- possui código aberto;
- trabalha bem com integridade;
- oferece transações;
- possui tipos ricos;
- permite consultas simples e avançadas;
- integra-se bem ao ecossistema Java;
- funciona bem em Docker;
- é amplamente útil em ambientes backend.

O objetivo não é decorar peculiaridades de uma ferramenta. É usar PostgreSQL para aprender fundamentos que continuam relevantes em outros bancos relacionais.

---

### Onde o banco entra no backend

No futuro, o fluxo poderá ser:

```text
Cliente HTTP
    ↓
API Java
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Driver JDBC
    ↓
PostgreSQL
```

Nesta aula, o fluxo será apenas:

```text
psql
    ↓
PostgreSQL
```

Essa simplificação é intencional. Você precisa primeiro enxergar o banco sem camadas intermediárias.

---

## Mao na massa guiada

### 1. Confirmar o ambiente

Abra a raiz do repositório e execute:

```powershell
Get-Location
git status
docker version
docker compose version
```

Você precisa confirmar:

- está no repositório correto;
- o Git responde;
- o Docker está ativo;
- o Compose está disponível.

Se `docker version` falhar ao acessar o servidor, abra o Docker Desktop e aguarde a inicialização.

---

### 2. Criar a estrutura

No PowerShell:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional\sql"

Set-Location "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"
```

Confira:

```powershell
Get-ChildItem
```

No Git Bash, Linux ou macOS:

```bash
mkdir -p labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional/sql
cd labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
```

---

### 3. Criar .env.example

Crie:

```text
.env.example
```

Conteúdo:

```properties
POSTGRES_DB=formacao_java
POSTGRES_USER=formacao
POSTGRES_PASSWORD=formacao_local
POSTGRES_PORT=5433
```

Esses valores são locais e didáticos.

A porta externa será `5433` para reduzir o risco de conflito com uma instalação PostgreSQL que já use `5432`.

Representação:

```text
localhost:5433
      ↓
container:5432
```

---

### 4. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```gitignore
.env
*.log
```

O `.env.example` será versionado como contrato de configuração.

O `.env` conterá os valores usados na máquina e ficará fora do Git.

---

### 5. Criar compose.yaml

Crie:

```text
compose.yaml
```

Conteúdo:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: formacao-postgres-m12

    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

    ports:
      - "${POSTGRES_PORT}:5432"

    volumes:
      - postgres_m12_data:/var/lib/postgresql/data

    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"
        ]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

volumes:
  postgres_m12_data:
```

O arquivo contém apenas o necessário para esta aula:

- imagem PostgreSQL;
- credenciais locais;
- porta;
- volume;
- healthcheck.

Docker Compose não é o assunto principal. Você já aprendeu seus fundamentos no M11.

---

### 6. Criar o .env local

Copie o exemplo:

```powershell
Copy-Item ".env.example" ".env"
```

No Git Bash, Linux ou macOS:

```bash
cp .env.example .env
```

Confira:

```powershell
Get-Content ".env"
git status --short
```

O `.env` não deve aparecer no Git.

---

### 7. Validar o Compose

Execute:

```powershell
docker compose config
```

O comando resolve as variáveis e valida a estrutura.

Procure por:

```text
formacao_java
formacao
5433
formacao-postgres-m12
```

Se alguma variável estiver ausente, confirme que o `.env` existe na mesma pasta do `compose.yaml`.

---

### 8. Subir o PostgreSQL

Execute:

```powershell
docker compose up -d
```

Na primeira execução, o Docker poderá baixar a imagem.

Depois:

```powershell
docker compose ps
```

O status pode começar como:

```text
health: starting
```

Aguarde alguns segundos e execute novamente:

```powershell
docker compose ps
```

O resultado esperado é:

```text
healthy
```

Se quiser ver a inicialização:

```powershell
docker compose logs postgres
```

Procure por uma mensagem equivalente a:

```text
database system is ready to accept connections
```

---

### 9. Entrar no psql

Execute:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java
```

No Git Bash, Linux ou macOS:

```bash
docker compose exec postgres psql -U formacao -d formacao_java
```

O terminal deverá mostrar algo semelhante a:

```text
psql (...)
Type "help" for help.

formacao_java=#
```

Isso confirma que você entrou no banco `formacao_java`.

Nesta aula, usamos o `psql` que já existe dentro do container. Não é necessário instalar o cliente no Windows.

---

### 10. Executar as verificacoes

Dentro do `psql`:

```sql
SELECT version();
```

Depois:

```sql
SELECT current_database();
```

Resultado esperado:

```text
formacao_java
```

Agora:

```sql
SELECT current_user;
```

Resultado esperado:

```text
formacao
```

Execute também:

```sql
SELECT 1 AS conexao_ok;
```

Essas consultas confirmam:

- o servidor respondeu;
- você está no banco correto;
- o usuário está correto;
- SQL está sendo executado.

---

### 11. Usar metacomandos minimos

No `psql`, comandos iniciados por barra invertida pertencem ao cliente.

Execute:

```text
\conninfo
```

Depois:

```text
\l
```

E:

```text
\dt
```

Como nenhuma tabela foi criada, o resultado esperado é algo semelhante a:

```text
Did not find any relations.
```

Isso não é erro. É o estado correto para esta aula.

Para sair:

```text
\q
```

---

### 12. Executar uma consulta direta

Sem entrar na sessão interativa:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java `
  -c "SELECT current_database(), current_user;"
```

Essa forma será útil em scripts e diagnósticos.

---

### 13. Criar README.md

Crie um `README.md` curto com:

- objetivo do laboratório;
- comando para copiar `.env.example`;
- comando para validar o Compose;
- comando para subir o banco;
- comando para entrar no `psql`;
- consultas mínimas;
- comando para parar o ambiente;
- aviso sobre `docker compose down -v`.

Não copie uma documentação enorme. O README deve permitir repetir a prática sem substituir a aula.

Use como comandos principais:

```powershell
Copy-Item ".env.example" ".env"
docker compose config
docker compose up -d
docker compose ps
```

Conexão:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java
```

Parada:

```powershell
docker compose stop
```

Remoção do container:

```powershell
docker compose down
```

Remoção completa dos dados:

```powershell
docker compose down -v
```

Registre que `-v` apaga o volume do laboratório.

---

### 14. Criar sql/README.md

Crie:

```text
sql/README.md
```

Explique em poucas linhas:

```text
Esta pasta receberá scripts SQL nas próximas aulas.
A aula 271 apenas valida o PostgreSQL e a conexão.
Nenhuma tabela será criada aqui ainda.
```

Isso prepara a evolução sem antecipar conteúdo.

---

### 15. Criar o modelo conceitual inicial

Crie:

```text
modelo-conceitual-inicial.md
```

Registre as entidades:

```text
Cliente
Ordem de Servico
Atividade
```

Atributos conceituais sugeridos:

```text
Cliente:
identificador, nome, documento, status.

Ordem de Servico:
identificador, codigo, status, data de abertura, cliente relacionado.

Atividade:
identificador, descricao, status, ordem de servico relacionada.
```

Registre os relacionamentos:

```text
CLIENTE (1) --------< (N) ORDEM_SERVICO
ORDEM_SERVICO (1) --< (N) ATIVIDADE
```

Explique:

```text
um cliente pode possuir várias ordens;
cada ordem pertence a um cliente;

uma ordem pode possuir várias atividades;
cada atividade pertence a uma ordem.
```

Não defina tipos SQL, tabelas ou constraints.

Este é um modelo conceitual inicial, não um modelo físico.

---

### 16. Conferir a estrutura

Execute:

```powershell
Get-ChildItem -Force -Recurse
git status --short
```

Arquivos esperados no Git:

```text
.env.example
.gitignore
compose.yaml
README.md
modelo-conceitual-inicial.md
sql/README.md
```

O `.env` não deve aparecer.

---

### 17. Validar de ponta a ponta

Execute:

```powershell
docker compose config
docker compose up -d
docker compose ps
```

Depois:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java `
  -c "SELECT version();"
```

E:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java `
  -c "SELECT current_database(), current_user;"
```

O laboratório está funcional quando:

```text
o Compose é válido;
o PostgreSQL fica healthy;
a versão é retornada;
o banco é formacao_java;
o usuário é formacao;
o modelo conceitual existe;
nenhuma tabela foi criada.
```

---

## Entendendo o que foi feito

### Docker foi apenas o meio

Poderíamos instalar PostgreSQL diretamente no Windows. O Docker Compose foi usado porque entrega um ambiente:

- reproduzível;
- versionado;
- removível;
- isolado;
- consistente com as ferramentas já estudadas.

O foco permanece no PostgreSQL.

---

### Porta externa e porta interna

O mapeamento:

```text
5433:5432
```

significa:

```text
5433:
porta usada pela máquina para acessar o container.

5432:
porta usada pelo PostgreSQL dentro do container.
```

Na aula 272, uma conexão visual usará `localhost:5433`.

---

### Volume

O volume:

```text
postgres_m12_data
```

mantém os dados fora do ciclo de vida do container.

Por isso:

```powershell
docker compose down
```

preserva o volume.

Enquanto:

```powershell
docker compose down -v
```

remove também os dados.

---

### Healthcheck

Container em execução não significa serviço pronto.

O healthcheck usa `pg_isready` para confirmar que o PostgreSQL aceita conexões.

Esse detalhe reduz tentativas prematuras de conexão.

---

### psql antes do DBeaver

O `psql` mostra de forma direta:

- banco;
- usuário;
- conexão;
- comando;
- resultado.

Na próxima aula, o DBeaver será usado como ferramenta de produtividade. Ele não substituirá a compreensão do terminal.

---

### Por que nao criamos tabela

A sequência do M12 reserva:

```text
272:
DBeaver, psql, schemas e rotina.

273:
tipos de dados PostgreSQL.

274:
DDL com CREATE TABLE, ALTER TABLE e DROP TABLE.
```

Criar tabelas agora anteciparia conteúdo sem base suficiente.

---

### Por que nao usamos Java

Conectar Java agora misturaria banco, driver, JDBC, exceções e mapeamento.

O M13 tratará persistência Java.

Nesta etapa, você precisa entender o banco sem abstrações.

---

## Erros comuns importantes

### Docker nao esta ativo

Sintoma:

```text
Cannot connect to the Docker daemon
```

Diagnóstico:

```powershell
docker version
```

Correção:

1. abra o Docker Desktop;
2. aguarde o engine;
3. rode `docker version`;
4. repita `docker compose up -d`.

---

### Porta 5433 ocupada

Sintoma:

```text
port is already allocated
```

Diagnóstico:

```powershell
Get-NetTCPConnection -LocalPort 5433 -ErrorAction SilentlyContinue
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

Se necessário, altere no `.env`:

```properties
POSTGRES_PORT=5434
```

Depois:

```powershell
docker compose down
docker compose up -d
```

---

### Container nao fica healthy

Diagnóstico:

```powershell
docker compose ps
docker compose logs postgres
```

Confirme:

- `.env` presente;
- variáveis corretas;
- Docker ativo;
- espaço em disco;
- ausência de erro de volume.

Não use `down -v` antes de entender se existem dados importantes.

---

### psql parece preso

Ao entrar no `psql`, o terminal muda para:

```text
formacao_java=#
```

Ele está aguardando comandos.

Finalize SQL com `;`.

Para sair:

```text
\q
```

---

## Comandos uteis

```powershell
docker compose config
docker compose up -d
docker compose ps
docker compose logs postgres
docker compose stop
docker compose start
docker compose down
```

Conexão:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java
```

Consulta direta:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java `
  -c "SELECT current_database(), current_user;"
```

Metacomandos desta aula:

```text
\conninfo
\l
\dt
\q
```

---

## Exercicio guiado

### Parte 1 - Repetir a rotina

Feche o terminal atual e abra outro na raiz do repositório.

Sem copiar imediatamente, tente:

1. entrar na pasta do laboratório;
2. validar o Compose;
3. subir PostgreSQL;
4. verificar o status;
5. entrar no `psql`;
6. confirmar banco e usuário;
7. sair.

Use como referência somente se travar:

```powershell
Set-Location "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"
docker compose config
docker compose up -d
docker compose ps
```

Conexão:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java
```

Dentro do `psql`:

```sql
SELECT current_database();
SELECT current_user;
```

Saída:

```text
\q
```

---

### Parte 2 - Evoluir o modelo conceitual

Adicione ao arquivo `modelo-conceitual-inicial.md` a entidade:

```text
Produto
```

Considere:

```text
um produto pode aparecer em várias ordens;
cada ordem possui um produto principal neste modelo inicial.
```

Atributos conceituais:

```text
identificador;
codigo;
nome;
status.
```

Relacionamento:

```text
PRODUTO (1) --------< (N) ORDEM_SERVICO
```

Explique a leitura em português.

Não crie tabela, tipo SQL ou constraint.

---

### Parte 3 - Responder com suas palavras

No final do modelo, responda:

1. Por que cliente não deve ser repetido integralmente em cada atividade?
2. Qual entidade representa a demanda principal?
3. Qual relacionamento existe entre ordem e atividade?
4. Por que um código de negócio e um identificador interno podem coexistir?
5. Quais decisões ainda dependem das próximas aulas?

O objetivo é desenvolver raciocínio de modelagem, não produzir respostas perfeitas.

---

### Parte 4 - Verificacao final

Execute:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java `
  -c "SELECT 'Aula 271 concluida' AS resultado, current_database() AS banco;"
```

Depois:

```powershell
git status --short
```

Revise os arquivos antes do commit.

---

## Criterios de aceite

A aula está concluída quando:

- a pasta oficial existe;
- o `compose.yaml` é válido;
- o `.env.example` está versionável;
- o `.env` está ignorado;
- PostgreSQL alcança status `healthy`;
- `psql` conecta;
- `SELECT version()` funciona;
- banco e usuário estão corretos;
- `\dt` não mostra tabelas;
- o modelo conceitual está documentado;
- Produto foi adicionado no exercício;
- nenhuma tabela foi criada;
- nenhum código Java foi criado;
- o README permite repetir a prática.

---

## Commit recomendado

Revise:

```powershell
git status
git diff
```

Adicione apenas o laboratório:

```powershell
git add `
  labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional
```

Confirme:

```powershell
git status
```

Commit:

```powershell
git commit -m "feat(m12): iniciar PostgreSQL e modelagem relacional"
```

Depois:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou oficialmente o M12.

Você entendeu:

- banco de dados como coleção organizada e persistente;
- SGBD como software responsável pelo gerenciamento;
- SQL como linguagem;
- PostgreSQL como SGBD;
- tabela como estrutura;
- linha como ocorrência;
- coluna como característica;
- chave primária como identidade;
- chave estrangeira como referência;
- relacionamento como conexão entre entidades.

Na prática, você:

- criou o laboratório oficial;
- subiu PostgreSQL;
- validou o healthcheck;
- conectou com `psql`;
- executou SQL real;
- confirmou banco e usuário;
- documentou um modelo conceitual inicial;
- preparou a estrutura para os próximos scripts.

A próxima aula será:

```text
272 - M12.02 - DBeaver, psql, schemas e rotina de trabalho
```

Nela, você vai:

- organizar conexões;
- usar DBeaver;
- aprofundar o `psql`;
- entender database e schema;
- navegar pelos objetos;
- salvar e executar scripts;
- criar uma rotina que reduz o risco de trabalhar no ambiente errado.

Não avance para `CREATE TABLE` ainda.

Primeiro vamos organizar a ferramenta e a rotina. Depois estudaremos tipos de dados. Só então entraremos em DDL.

---

# Material complementar

## Checkpoint final

- [ ] Entendi banco de dados, SGBD, SQL e PostgreSQL.
- [ ] Subi PostgreSQL e confirmei `healthy`.
- [ ] Entrei no `psql` e executei as consultas.
- [ ] Documentei o modelo conceitual e fiz o commit.

---

## Troubleshooting adicional

### Variavel nao encontrada

Sintoma:

```text
The "POSTGRES_DB" variable is not set
```

Confira:

```powershell
Get-ChildItem -Force
Get-Content ".env"
```

Se necessário:

```powershell
Copy-Item ".env.example" ".env"
docker compose config
```

---

### Credenciais alteradas, mas o banco usa as antigas

O volume pode ter sido inicializado com valores anteriores.

As variáveis de criação são aplicadas quando o diretório de dados é inicializado.

Neste laboratório ainda vazio, se você realmente quiser reiniciar:

```powershell
docker compose down -v
docker compose up -d
```

Atenção: `-v` apaga os dados.

---

### Banco nao existe

Confira:

```powershell
Get-Content ".env"
docker compose config
docker compose logs postgres
```

Se o volume foi criado com outro banco, ele não é recriado apenas porque o `.env` mudou.

---

### Nome do container em conflito

Diagnóstico:

```powershell
docker ps -a --filter "name=formacao-postgres-m12"
```

Se for o container deste laboratório:

```powershell
docker compose down
docker compose up -d
```

---

### Comando psql nao encontrado no Windows

Use o cliente dentro do container:

```powershell
docker compose exec postgres `
  psql -U formacao -d formacao_java
```

---

### Esqueci o ponto e virgula

Se o `psql` continuar esperando:

```text
complete a instrução com ;
```

Ou cancele:

```text
CTRL + C
```

Depois execute novamente.

---

## Perguntas de revisao

1. Qual é a diferença entre banco de dados e SGBD?
2. Por que uma lista Java em memória não substitui persistência?
3. Qual é a diferença entre SQL e PostgreSQL?
4. Qual é o papel conceitual de uma chave primária?
5. Qual é o papel conceitual de uma chave estrangeira?
6. O que significa `1:N`?
7. Por que usamos `5433:5432`?
8. Por que `docker compose down -v` exige cuidado?
9. Por que nenhuma tabela foi criada?
10. Por que Java não foi usado nesta aula?

---

## Roteiro de resposta

```text
Banco de dados:
coleção organizada de dados.

SGBD:
software que gerencia o banco.

SQL:
linguagem usada para trabalhar com dados relacionais.

PostgreSQL:
SGBD escolhido para a formação.

Chave primária:
identidade única da linha.

Chave estrangeira:
referência para outra tabela.

1:N:
uma ocorrência do lado 1 pode se relacionar com várias do lado N.

5433:5432:
porta da máquina para porta interna do container.

down -v:
remove o volume e apaga dados.

Sem tabelas:
DDL será estudado depois de ferramentas e tipos.

Sem Java:
persistência Java começa no módulo correto, depois da base de SQL.
```

---

## Desafio opcional

Adicione a entidade conceitual:

```text
Tecnico
```

Considere:

```text
um técnico pode executar várias atividades;
uma atividade pode ter um técnico responsável;
uma atividade pode ainda não possuir técnico.
```

Registre:

- atributos conceituais;
- relacionamento;
- leitura;
- dúvida sobre obrigatoriedade.

Exemplo inicial:

```text
TECNICO (1) --------< (N) ATIVIDADE
```

Esse exercício mostra que relacionamento e obrigatoriedade são decisões diferentes.

---

## Atualizacao do diario de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 271 - M12.01 - Introducao ao SQL, PostgreSQL e modelagem relacional

- Iniciei oficialmente o M12.
- Entendi a diferença entre banco de dados, SGBD, SQL e PostgreSQL.
- Revisei tabela, linha, coluna, chave primária, chave estrangeira e relacionamento.
- Criei o laboratório `labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional`.
- Subi PostgreSQL com Docker Compose e confirmei o healthcheck.
- Conectei com `psql` e executei verificações mínimas.
- Modelei conceitualmente Cliente, Ordem de Serviço, Atividade e Produto.
- Próxima aula: DBeaver, psql, schemas e rotina de trabalho.
```

---

## Referencia tecnica curta

```text
Laboratório:
labs/m12/aula-271-introducao-sql-postgresql-modelagem-relacional

Container:
formacao-postgres-m12

Imagem:
postgres:16-alpine

Host:
localhost

Porta externa:
5433

Porta interna:
5432

Banco:
formacao_java

Usuário:
formacao

Volume:
postgres_m12_data
```

Antes da aula 272, tente executar sem consultar a aula inteira:

```powershell
Set-Location "labs\m12\aula-271-introducao-sql-postgresql-modelagem-relacional"
docker compose up -d
docker compose ps
docker compose exec postgres `
  psql -U formacao -d formacao_java
```

Dentro do `psql`:

```sql
SELECT current_database();
SELECT current_user;
```

Saída:

```text
\q
```
