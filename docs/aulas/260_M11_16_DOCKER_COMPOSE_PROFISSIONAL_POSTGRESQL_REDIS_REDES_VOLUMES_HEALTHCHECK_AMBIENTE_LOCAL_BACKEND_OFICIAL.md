# 260 — M11.16 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend

## Objetivo da aula

Na aula anterior, você estudou Docker para Java Backend.

Você viu:

```text
Docker;
container;
imagem;
registry;
Dockerfile;
FROM;
WORKDIR;
COPY;
ENV;
EXPOSE;
ENTRYPOINT;
docker build;
docker run;
portas;
variáveis de ambiente;
volumes;
redes;
localhost dentro de container;
.dockerignore;
multi-stage build;
Docker Compose inicial;
PostgreSQL;
depends_on;
healthcheck em alto nível;
logs;
docker exec;
docker inspect;
troubleshooting;
boas práticas;
segurança;
CI/CD;
preparação para Spring Boot.
```

Agora vamos aprofundar o ponto que aparece todos os dias em projetos backend reais:

```text
Docker Compose profissional.
```

A ideia desta aula não é apenas "subir banco com Docker".

A ideia é montar uma stack local de backend mais próxima de um projeto real, com:

```text
PostgreSQL;
Redis;
Adminer;
Redis Commander;
rede Docker dedicada;
volumes nomeados;
bind mount para scripts SQL;
.env.example;
.gitignore;
docker-compose.yml organizado;
healthcheck;
depends_on com service_healthy;
comandos de operação;
testes com psql;
testes com redis-cli;
reset controlado;
troubleshooting essencial;
documentação de ambiente local.
```

Ao final desta aula, você deve conseguir:

```text
entender a diferença entre Compose básico e Compose profissional;
criar uma stack local organizada;
subir PostgreSQL com volume persistente;
subir Redis com volume persistente;
usar rede dedicada;
usar nomes de serviço corretamente;
usar variáveis de ambiente sem commitar segredo real;
criar .env.example;
usar healthcheck em PostgreSQL e Redis;
entender depends_on com condition service_healthy;
subir ferramentas auxiliares como Adminer e Redis Commander;
criar scripts SQL de inicialização;
executar comandos dentro dos containers;
ver logs por serviço;
diagnosticar erros comuns;
remover stack sem apagar dados;
remover stack apagando dados quando necessário;
documentar o ambiente local profissional.
```

---

## Reforço do objetivo maior

Nosso objetivo é formar um desenvolvedor Java Backend com raciocínio profissional.

Em empresa, não basta saber rodar:

```powershell
docker compose up
```

Você precisa entender:

```text
quais serviços fazem parte do ambiente;
quais portas são usadas;
quais variáveis configuram a stack;
onde os dados ficam persistidos;
como resetar o ambiente;
como diagnosticar falha;
como outro desenvolvedor consegue rodar o mesmo projeto;
como uma futura API Java encontrará banco e cache.
```

Docker Compose profissional funciona como uma documentação executável do ambiente.

Ele explica e executa a infraestrutura local necessária para desenvolver, testar e validar uma aplicação backend.

---

# Parte 1 — Compose básico vs Compose profissional

Um Compose básico geralmente resolve apenas o começo:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: aula
      POSTGRES_USER: aula
      POSTGRES_PASSWORD: aula
    ports:
      - "5432:5432"
```

Isso sobe o banco, mas ainda deixa várias perguntas abertas:

```text
onde ficam os dados?
como resetar?
como saber se o banco está pronto?
como evitar commitar senha real?
como subir Redis junto?
como acessar o banco pelo navegador?
como testar Redis?
como a API vai descobrir o host do banco?
como documentar isso para o time?
```

Um Compose profissional considera:

```text
nomes claros;
rede dedicada;
volumes nomeados;
healthcheck;
variáveis centralizadas;
arquivo .env.example;
ferramentas auxiliares;
scripts de inicialização;
logs;
comandos de manutenção;
reset seguro;
segurança básica para ambiente local;
preparação para futura API.
```

Resumo:

```text
Compose básico:
sobe serviço.

Compose profissional:
sobe uma stack local reproduzível, diagnosticável e documentada.
```

---

# Parte 2 — Laboratório da aula

Vamos criar o laboratório:

```text
labs/m11/aula-260-docker-compose-profissional
```

Estrutura esperada:

```text
labs/m11/aula-260-docker-compose-profissional
├── .env.example
├── .gitignore
├── README_AMBIENTE_LOCAL.md
├── RELATORIO_DOCKER_COMPOSE.md
├── docker-compose.yml
├── postgres
│   └── init
│       ├── 01-create-schema.sql
│       └── 02-seed.sql
└── redis
    └── README_REDIS.md
```

No PowerShell, a partir da raiz do repositório da formação:

```powershell
mkdir labs\m11\aula-260-docker-compose-profissional
cd labs\m11\aula-260-docker-compose-profissional

mkdir postgres
mkdir postgres\init
mkdir redis
```

No Git Bash, Linux ou macOS:

```bash
mkdir -p labs/m11/aula-260-docker-compose-profissional/postgres/init
mkdir -p labs/m11/aula-260-docker-compose-profissional/redis
cd labs/m11/aula-260-docker-compose-profissional
```

---

# Parte 3 — Papel dos serviços da stack

## PostgreSQL

PostgreSQL será nosso banco relacional local.

Em projetos Java Backend, ele pode armazenar:

```text
clientes;
ordens de serviço;
atividades;
produtos;
pagamentos;
usuários;
permissões;
histórico;
logs de auditoria;
parâmetros de sistema.
```

Nesta aula, o foco não é aprofundar SQL ainda.

O foco é entender:

```text
como subir PostgreSQL em container;
como persistir dados;
como executar scripts na primeira inicialização;
como expor porta para ferramentas locais;
como conectar usando nome do serviço;
como validar saúde do banco.
```

---

## Redis

Redis será nosso serviço auxiliar de cache/chave-valor.

Em backend, Redis costuma aparecer em:

```text
cache;
sessão;
rate limit;
tokens temporários;
locks simples;
deduplicação;
filas leves.
```

Nesta aula, o foco é:

```text
subir Redis local;
testar resposta com PING;
persistir dados de forma simples;
visualizar chaves;
preparar uma futura integração Java.
```

---

## Adminer

Adminer será usado para acessar o PostgreSQL pelo navegador.

Ele ajuda a validar:

```text
conexão com banco;
usuário e senha;
tabelas criadas;
dados iniciais.
```

---

## Redis Commander

Redis Commander será usado para visualizar chaves do Redis pelo navegador.

Ele ajuda a validar:

```text
conexão com Redis;
chaves criadas;
dados armazenados;
nome do serviço na rede Docker.
```

---

# Parte 4 — Criando o .env.example

Crie o arquivo:

```text
.env.example
```

Conteúdo:

```properties
# =========================================================
# Aula 260 — Ambiente local Docker Compose
# Este arquivo serve como exemplo.
# Copie para .env se quiser usar variáveis reais localmente.
# Não coloque segredos reais no Git.
# =========================================================

POSTGRES_IMAGE=postgres:16
POSTGRES_CONTAINER_NAME=aula-260-postgres
POSTGRES_HOST_PORT=5432
POSTGRES_CONTAINER_PORT=5432
POSTGRES_DB=aula260db
POSTGRES_USER=aula260
POSTGRES_PASSWORD=aula260

REDIS_IMAGE=redis:7
REDIS_CONTAINER_NAME=aula-260-redis
REDIS_HOST_PORT=6379
REDIS_CONTAINER_PORT=6379

ADMINER_IMAGE=adminer:latest
ADMINER_CONTAINER_NAME=aula-260-adminer
ADMINER_HOST_PORT=8081
ADMINER_CONTAINER_PORT=8080

REDIS_COMMANDER_IMAGE=rediscommander/redis-commander:latest
REDIS_COMMANDER_CONTAINER_NAME=aula-260-redis-commander
REDIS_COMMANDER_HOST_PORT=8082
REDIS_COMMANDER_CONTAINER_PORT=8081
```

Regra profissional:

```text
.env.example pode ser versionado.
.env não deve ser versionado quando contém valores locais ou segredos.
```

O `.env.example` mostra quais variáveis existem.

O `.env`, quando usado, guarda valores locais da sua máquina.

---

# Parte 5 — Criando o .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```gitignore
.env
*.log
logs/
tmp/
```

Motivo:

```text
.env pode conter senha local;
logs não precisam entrar no Git;
tmp não precisa entrar no Git.
```

O repositório deve permitir reproduzir o ambiente, mas não deve vazar segredo nem carregar lixo local.

---

# Parte 6 — Criando scripts SQL de inicialização

Crie:

```text
postgres/init/01-create-schema.sql
```

Conteúdo:

```sql
CREATE TABLE IF NOT EXISTS ordem_servico (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    cliente VARCHAR(120) NOT NULL,
    status VARCHAR(40) NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS atividade (
    id BIGSERIAL PRIMARY KEY,
    ordem_servico_id BIGINT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    status VARCHAR(40) NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atividade_ordem_servico
        FOREIGN KEY (ordem_servico_id)
        REFERENCES ordem_servico (id)
);
```

Agora crie:

```text
postgres/init/02-seed.sql
```

Conteúdo:

```sql
INSERT INTO ordem_servico (codigo, cliente, status)
VALUES
    ('OS-260-001', 'Cliente Exemplo A', 'ABERTA'),
    ('OS-260-002', 'Cliente Exemplo B', 'AGENDADA')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO atividade (ordem_servico_id, descricao, status)
SELECT id, 'Instalação inicial', 'PENDENTE'
FROM ordem_servico
WHERE codigo = 'OS-260-001'
  AND NOT EXISTS (
      SELECT 1
      FROM atividade
      WHERE descricao = 'Instalação inicial'
        AND ordem_servico_id = ordem_servico.id
  );

INSERT INTO atividade (ordem_servico_id, descricao, status)
SELECT id, 'Conferência de dados', 'PENDENTE'
FROM ordem_servico
WHERE codigo = 'OS-260-002'
  AND NOT EXISTS (
      SELECT 1
      FROM atividade
      WHERE descricao = 'Conferência de dados'
        AND ordem_servico_id = ordem_servico.id
  );
```

Esses scripts serão montados dentro do container PostgreSQL no diretório:

```text
/docker-entrypoint-initdb.d
```

A imagem oficial do PostgreSQL executa scripts desse diretório na primeira criação do banco, quando o volume de dados ainda está vazio.

Importante:

```text
se o volume já existe, os scripts não rodam novamente automaticamente.
```

---

# Parte 7 — Criando documentação mínima do Redis

Crie:

```text
redis/README_REDIS.md
```

Conteúdo:

```md
# Redis — Aula 260

Este diretório documenta o papel do Redis no ambiente local.

Usos comuns em projetos Java Backend:

- cache;
- sessão;
- rate limit;
- tokens temporários;
- deduplicação;
- locks simples;
- filas leves.

Nesta aula, não vamos integrar Redis a uma aplicação Java ainda.
O foco é subir o serviço, validar saúde, testar conexão e preparar o ambiente.
```

---

# Parte 8 — Criando o docker-compose.yml

Crie:

```text
docker-compose.yml
```

Conteúdo:

```yaml
name: aula-260-docker-compose-profissional

services:
  postgres:
    image: ${POSTGRES_IMAGE:-postgres:16}
    container_name: ${POSTGRES_CONTAINER_NAME:-aula-260-postgres}
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-aula260db}
      POSTGRES_USER: ${POSTGRES_USER:-aula260}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-aula260}
    ports:
      - "${POSTGRES_HOST_PORT:-5432}:${POSTGRES_CONTAINER_PORT:-5432}"
    volumes:
      - aula-260-postgres-data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d:ro
    networks:
      - aula-260-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-aula260} -d ${POSTGRES_DB:-aula260db}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  redis:
    image: ${REDIS_IMAGE:-redis:7}
    container_name: ${REDIS_CONTAINER_NAME:-aula-260-redis}
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    ports:
      - "${REDIS_HOST_PORT:-6379}:${REDIS_CONTAINER_PORT:-6379}"
    volumes:
      - aula-260-redis-data:/data
    networks:
      - aula-260-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 5s

  adminer:
    image: ${ADMINER_IMAGE:-adminer:latest}
    container_name: ${ADMINER_CONTAINER_NAME:-aula-260-adminer}
    restart: unless-stopped
    ports:
      - "${ADMINER_HOST_PORT:-8081}:${ADMINER_CONTAINER_PORT:-8080}"
    networks:
      - aula-260-network
    depends_on:
      postgres:
        condition: service_healthy

  redis-commander:
    image: ${REDIS_COMMANDER_IMAGE:-rediscommander/redis-commander:latest}
    container_name: ${REDIS_COMMANDER_CONTAINER_NAME:-aula-260-redis-commander}
    restart: unless-stopped
    environment:
      REDIS_HOSTS: local:redis:6379
    ports:
      - "${REDIS_COMMANDER_HOST_PORT:-8082}:${REDIS_COMMANDER_CONTAINER_PORT:-8081}"
    networks:
      - aula-260-network
    depends_on:
      redis:
        condition: service_healthy

volumes:
  aula-260-postgres-data:
    name: aula-260-postgres-data

  aula-260-redis-data:
    name: aula-260-redis-data

networks:
  aula-260-network:
    name: aula-260-network
    driver: bridge
```

---

# Parte 9 — Entendendo as partes principais do Compose

## name

```yaml
name: aula-260-docker-compose-profissional
```

Define o nome do projeto Compose.

Isso ajuda a organizar recursos criados, como containers, volumes e rede.

---

## services

```yaml
services:
```

Define os containers da stack.

Nesta aula:

```text
postgres;
redis;
adminer;
redis-commander.
```

---

## image

Exemplo:

```yaml
image: ${POSTGRES_IMAGE:-postgres:16}
```

Significa:

```text
use POSTGRES_IMAGE se existir;
senão use postgres:16.
```

A sintaxe:

```text
${VARIAVEL:-valor_padrao}
```

permite customização sem quebrar o padrão.

---

## container_name

Exemplo:

```yaml
container_name: ${POSTGRES_CONTAINER_NAME:-aula-260-postgres}
```

Dá nome fixo ao container.

Isso facilita comandos como:

```powershell
docker logs aula-260-postgres
docker exec -it aula-260-postgres psql -U aula260 -d aula260db
```

---

## restart

```yaml
restart: unless-stopped
```

Se o container cair, o Docker tenta reiniciar.

Se você parar manualmente, ele respeita.

Para ambiente local, é uma opção prática.

---

## environment

No PostgreSQL:

```yaml
environment:
  POSTGRES_DB: ${POSTGRES_DB:-aula260db}
  POSTGRES_USER: ${POSTGRES_USER:-aula260}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-aula260}
```

Essas variáveis são usadas pela imagem oficial para criar o banco, usuário e senha na primeira inicialização.

Atenção:

```text
se o volume já existe, mudar essas variáveis não recria automaticamente usuário, senha ou banco.
```

---

## ports

Exemplo:

```yaml
ports:
  - "${POSTGRES_HOST_PORT:-5432}:${POSTGRES_CONTAINER_PORT:-5432}"
```

Formato:

```text
HOST:CONTAINER
```

Significa:

```text
porta da sua máquina -> porta dentro do container.
```

Neste laboratório:

```text
PostgreSQL: localhost:5432 -> postgres:5432
Redis: localhost:6379 -> redis:6379
Adminer: localhost:8081 -> adminer:8080
Redis Commander: localhost:8082 -> redis-commander:8081
```

---

## volumes

PostgreSQL:

```yaml
volumes:
  - aula-260-postgres-data:/var/lib/postgresql/data
  - ./postgres/init:/docker-entrypoint-initdb.d:ro
```

O primeiro é um named volume.

Ele persiste os dados do banco.

O segundo é um bind mount.

Ele monta a pasta local de scripts dentro do container.

O `:ro` significa read-only.

Redis:

```yaml
volumes:
  - aula-260-redis-data:/data
```

Esse volume persiste dados do Redis.

---

## networks

Todos os serviços entram na mesma rede:

```yaml
networks:
  - aula-260-network
```

Assim, um container encontra o outro pelo nome do serviço:

```text
postgres;
redis;
adminer;
redis-commander.
```

A futura API em container deverá usar:

```text
postgres:5432
redis:6379
```

E não:

```text
localhost:5432
localhost:6379
```

Dentro de um container, `localhost` aponta para o próprio container.

---

## healthcheck

Healthcheck verifica se o serviço está realmente pronto.

PostgreSQL:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-aula260} -d ${POSTGRES_DB:-aula260db}"]
```

Redis:

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
```

Um container pode estar running, mas o serviço ainda não estar pronto.

Por isso o healthcheck é importante.

---

## depends_on com service_healthy

Exemplo:

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

Isso diz:

```text
só inicie este serviço depois que o PostgreSQL estiver saudável.
```

Nesta aula:

```text
Adminer depende do PostgreSQL saudável;
Redis Commander depende do Redis saudável.
```

Esse raciocínio será importante quando a API Java entrar na stack.

---

# Parte 10 — Subindo a stack

Na pasta do laboratório, execute:

```powershell
docker compose up -d
```

Veja os containers:

```powershell
docker compose ps
```

Você deve encontrar os serviços:

```text
aula-260-postgres;
aula-260-redis;
aula-260-adminer;
aula-260-redis-commander.
```

PostgreSQL e Redis devem aparecer como saudáveis ou em processo de healthcheck.

Para acompanhar logs:

```powershell
docker compose logs -f
```

Logs por serviço:

```powershell
docker compose logs postgres
docker compose logs redis
docker compose logs adminer
docker compose logs redis-commander
```

---

# Parte 11 — Testando PostgreSQL com psql

Execute:

```powershell
docker exec -it aula-260-postgres psql -U aula260 -d aula260db
```

Dentro do `psql`, rode:

```sql
SELECT version();
```

Depois:

```sql
SELECT * FROM ordem_servico;
```

E:

```sql
SELECT * FROM atividade;
```

Para sair:

```sql
\q
```

Você validou:

```text
PostgreSQL está rodando;
banco aula260db existe;
usuário aula260 funciona;
scripts SQL foram executados;
dados iniciais existem.
```

Também é possível executar SQL direto pelo PowerShell:

```powershell
docker exec -it aula-260-postgres psql -U aula260 -d aula260db -c "SELECT COUNT(*) FROM ordem_servico;"
```

---

# Parte 12 — Testando PostgreSQL pelo Adminer

Acesse no navegador:

```text
http://localhost:8081
```

Use:

```text
Sistema: PostgreSQL
Servidor: postgres
Usuário: aula260
Senha: aula260
Base de dados: aula260db
```

Atenção ao campo servidor:

```text
postgres
```

Não use:

```text
localhost
```

O Adminer está em outro container.

Para ele, `localhost` seria o próprio container do Adminer.

O PostgreSQL está no serviço:

```text
postgres
```

---

# Parte 13 — Testando Redis com redis-cli

Execute:

```powershell
docker exec -it aula-260-redis redis-cli
```

Dentro do Redis CLI:

```text
PING
```

Resposta esperada:

```text
PONG
```

Agora teste uma chave:

```text
SET aula:260 "Docker Compose profissional"
GET aula:260
```

Resposta esperada:

```text
"Docker Compose profissional"
```

Para sair:

```text
exit
```

Também é possível testar direto:

```powershell
docker exec -it aula-260-redis redis-cli PING
docker exec -it aula-260-redis redis-cli SET os:260 "ABERTA"
docker exec -it aula-260-redis redis-cli GET os:260
```

---

# Parte 14 — Testando Redis pelo Redis Commander

Acesse:

```text
http://localhost:8082
```

Procure pela chave:

```text
aula:260
```

Se ela aparecer, você validou:

```text
Redis está rodando;
Redis Commander está conectado;
nome do serviço redis funciona na rede Docker;
dados estão acessíveis.
```

---

# Parte 15 — Verificando volumes e rede

Listar volumes:

```powershell
docker volume ls
```

Procure:

```text
aula-260-postgres-data
aula-260-redis-data
```

Inspecionar volume:

```powershell
docker volume inspect aula-260-postgres-data
docker volume inspect aula-260-redis-data
```

Listar redes:

```powershell
docker network ls
```

Procure:

```text
aula-260-network
```

Inspecionar rede:

```powershell
docker network inspect aula-260-network
```

Esses comandos ajudam a entender o que o Compose criou por baixo.

---

# Parte 16 — Parando, subindo novamente e resetando

## Parar sem apagar dados

```powershell
docker compose down
```

Isso remove containers e rede, mas mantém os volumes nomeados.

Suba novamente:

```powershell
docker compose up -d
```

Os dados devem continuar.

Teste:

```powershell
docker exec -it aula-260-postgres psql -U aula260 -d aula260db -c "SELECT * FROM ordem_servico;"
docker exec -it aula-260-redis redis-cli GET aula:260
```

---

## Parar apagando dados

```powershell
docker compose down -v
```

Atenção:

```text
-v remove os volumes da stack.
```

Isso apaga os dados locais do PostgreSQL e do Redis.

Depois:

```powershell
docker compose up -d
```

O PostgreSQL criará o banco novamente e executará os scripts de init outra vez.

Use `down -v` quando quiser resetar completamente o laboratório.

---

# Parte 17 — Criando README do ambiente local

Crie:

```text
README_AMBIENTE_LOCAL.md
```

Conteúdo:

```md
# Ambiente local — Aula 260

## Objetivo

Este laboratório sobe uma stack local de backend com:

- PostgreSQL;
- Redis;
- Adminer;
- Redis Commander;
- rede Docker dedicada;
- volumes persistentes;
- healthchecks.

## Como subir

```powershell
docker compose up -d
```

## Como verificar

```powershell
docker compose ps
docker compose logs
```

## PostgreSQL

Host para ferramentas no computador:

```text
localhost
```

Porta:

```text
5432
```

Banco:

```text
aula260db
```

Usuário:

```text
aula260
```

Senha:

```text
aula260
```

Host para outros containers:

```text
postgres
```

## Adminer

URL:

```text
http://localhost:8081
```

Dados:

```text
Sistema: PostgreSQL
Servidor: postgres
Usuário: aula260
Senha: aula260
Base de dados: aula260db
```

## Redis

Host para ferramentas no computador:

```text
localhost
```

Porta:

```text
6379
```

Host para outros containers:

```text
redis
```

## Redis Commander

URL:

```text
http://localhost:8082
```

## Como parar sem apagar dados

```powershell
docker compose down
```

## Como parar apagando dados

```powershell
docker compose down -v
```

## Observação importante

Dentro de containers, não use localhost para acessar outro container.

Use os nomes dos serviços:

- postgres;
- redis.
```

---

# Parte 18 — Criando relatório técnico da aula

Crie:

```text
RELATORIO_DOCKER_COMPOSE.md
```

Conteúdo:

```md
# Relatório Docker Compose — Aula 260

## Stack criada

- PostgreSQL
- Redis
- Adminer
- Redis Commander

## Comandos executados

### Subir ambiente

```powershell
docker compose up -d
```

### Ver status

```powershell
docker compose ps
```

### Ver logs

```powershell
docker compose logs
```

### Testar PostgreSQL

```powershell
docker exec -it aula-260-postgres psql -U aula260 -d aula260db
```

### Testar Redis

```powershell
docker exec -it aula-260-redis redis-cli PING
```

## Volumes criados

- aula-260-postgres-data
- aula-260-redis-data

## Rede criada

- aula-260-network

## Portas usadas

| Serviço | Porta host | Porta container |
|---|---:|---:|
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |
| Adminer | 8081 | 8080 |
| Redis Commander | 8082 | 8081 |

## Scripts SQL executados

- postgres/init/01-create-schema.sql
- postgres/init/02-seed.sql

## Resultado dos testes

### PostgreSQL

Registre aqui se as tabelas foram criadas.

### Redis

Registre aqui se o PING retornou PONG.

### Adminer

Registre aqui se conseguiu acessar.

### Redis Commander

Registre aqui se conseguiu acessar.

## Erros encontrados

Descreva erros encontrados durante a aula.

## Soluções aplicadas

Descreva as soluções aplicadas.

## Aprendizados

Explique com suas palavras:

1. O que é uma stack local de backend?
2. Por que PostgreSQL e Redis ficam na mesma rede?
3. Por que usar nome do serviço em vez de localhost?
4. Para que servem volumes nomeados?
5. Para que serve healthcheck?
6. Qual diferença entre docker compose down e docker compose down -v?
```

---

# Parte 19 — Host vs container

Essa é uma das regras mais importantes da aula.

## Aplicação rodando no seu Windows

Use:

```text
localhost:5432
localhost:6379
```

## Aplicação rodando em container na mesma rede

Use:

```text
postgres:5432
redis:6379
```

## Adminer rodando em container

Use servidor:

```text
postgres
```

## Redis Commander rodando em container

Use host:

```text
redis
```

Regra:

```text
não decore apenas o comando;
entenda onde o processo está rodando.
```

---

# Parte 20 — Troubleshooting essencial

## 1. Porta ocupada

Erro comum:

```text
port is already allocated
```

ou:

```text
Bind for 0.0.0.0:5432 failed
```

Causas:

```text
PostgreSQL local usando 5432;
outro container usando a porta;
serviço antigo ainda rodando.
```

Diagnóstico:

```powershell
docker ps
netstat -ano | findstr :5432
```

Soluções:

```text
parar o serviço que usa a porta;
ou alterar POSTGRES_HOST_PORT no .env.
```

Exemplo:

```properties
POSTGRES_HOST_PORT=5433
```

Nesse caso, do seu computador você acessa:

```text
localhost:5433
```

Dentro da rede Docker continua:

```text
postgres:5432
```

---

## 2. Senha alterada no .env mas não funcionou

Se você criou o banco com uma senha e depois mudou:

```properties
POSTGRES_PASSWORD=novaSenha
```

pode não funcionar.

Motivo:

```text
PostgreSQL cria usuário e senha na primeira inicialização do volume.
```

Se o volume já existe, a variável nova não recria o usuário.

Soluções:

```text
alterar senha via SQL;
ou resetar o volume no laboratório.
```

Reset local:

```powershell
docker compose down -v
docker compose up -d
```

---

## 3. Scripts SQL não rodaram

Se você alterou os scripts em:

```text
postgres/init
```

e nada mudou, o motivo provável é:

```text
o volume do PostgreSQL já existia.
```

Scripts em:

```text
/docker-entrypoint-initdb.d
```

rodam quando o diretório de dados está vazio.

Para laboratório:

```powershell
docker compose down -v
docker compose up -d
```

---

## 4. Adminer não conecta

Verifique:

```text
servidor;
usuário;
senha;
base de dados;
status do PostgreSQL;
logs.
```

Servidor correto no Adminer:

```text
postgres
```

Servidor incorreto dentro do Adminer:

```text
localhost
```

Comandos úteis:

```powershell
docker compose ps
docker compose logs postgres
docker compose logs adminer
```

---

## 5. Redis Commander não conecta

Verifique no Compose:

```yaml
environment:
  REDIS_HOSTS: local:redis:6379
```

O host deve ser:

```text
redis
```

Comandos úteis:

```powershell
docker compose logs redis
docker compose logs redis-commander
docker exec -it aula-260-redis redis-cli PING
```

---

## 6. Serviço unhealthy

Veja o status:

```powershell
docker compose ps
```

Veja logs:

```powershell
docker compose logs postgres
docker compose logs redis
```

Inspecione o healthcheck:

```powershell
docker inspect aula-260-postgres --format "{{json .State.Health}}"
docker inspect aula-260-redis --format "{{json .State.Health}}"
```

Causas comuns:

```text
usuário errado;
banco errado;
serviço demorou mais que o esperado;
container reiniciando;
volume com estado inconsistente;
comando de healthcheck inválido.
```

---

# Parte 21 — O que versionar e o que não versionar

## Versionar

```text
docker-compose.yml;
.env.example;
README_AMBIENTE_LOCAL.md;
RELATORIO_DOCKER_COMPOSE.md;
postgres/init/*.sql;
redis/README_REDIS.md;
.gitignore.
```

## Não versionar

```text
.env com segredo real;
logs;
dados do PostgreSQL;
dados do Redis;
backups locais grandes;
arquivos temporários;
senhas reais;
tokens;
certificados privados.
```

Regra profissional:

```text
o repositório deve permitir reproduzir o ambiente sem vazar dados sensíveis.
```

---

# Parte 22 — Como isso será usado nas próximas etapas

Esta aula prepara três pontos importantes da formação.

## Para Spring Boot

Uma futura API poderá usar:

```properties
spring.datasource.url=jdbc:postgresql://postgres:5432/aula260db
spring.datasource.username=aula260
spring.datasource.password=aula260
spring.data.redis.host=redis
spring.data.redis.port=6379
```

Se a API rodar fora do Docker, no seu computador, muda para:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aula260db
spring.data.redis.host=localhost
```

## Para Testcontainers

Mais à frente, testes Java poderão subir PostgreSQL e Redis descartáveis automaticamente.

Esta aula prepara a base mental para entender isso.

## Para CI/CD

Pipelines podem subir serviços auxiliares, rodar testes, validar integração e gerar artefatos.

A próxima aula começa esse assunto.

---

# Parte 23 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Docker Compose profissional.
[ ] Sei diferenciar Compose básico e profissional.
[ ] Criei labs/m11/aula-260-docker-compose-profissional.
[ ] Criei .env.example.
[ ] Criei .gitignore protegendo .env.
[ ] Criei docker-compose.yml.
[ ] Configurei PostgreSQL.
[ ] Configurei Redis.
[ ] Configurei Adminer.
[ ] Configurei Redis Commander.
[ ] Configurei rede dedicada.
[ ] Configurei volumes nomeados.
[ ] Configurei bind mount dos scripts SQL.
[ ] Configurei healthcheck do PostgreSQL.
[ ] Configurei healthcheck do Redis.
[ ] Usei depends_on com service_healthy.
[ ] Subi a stack com docker compose up -d.
[ ] Verifiquei status com docker compose ps.
[ ] Consultei logs com docker compose logs.
[ ] Testei PostgreSQL com psql.
[ ] Validei tabelas e seed.
[ ] Testei Redis com redis-cli.
[ ] Criei e consultei chave no Redis.
[ ] Acessei Adminer.
[ ] Acessei Redis Commander.
[ ] Entendi localhost vs nome do serviço.
[ ] Parei com docker compose down.
[ ] Resetei com docker compose down -v.
[ ] Registrei erros e soluções.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é uma stack local de backend?
2. Qual a diferença entre Compose básico e Compose profissional?
3. Para que serve .env.example?
4. Por que .env não deve ser commitado?
5. Para que serve uma rede Docker dedicada?
6. Por que uma API em container deve acessar postgres e não localhost?
7. Para que serve volume nomeado?
8. Para que serve bind mount?
9. Para que serve /docker-entrypoint-initdb.d no PostgreSQL?
10. Por que scripts de init não rodam de novo quando o volume já existe?
11. Para que serve healthcheck?
12. Qual a diferença entre container running e serviço saudável?
13. Para que serve depends_on com condition service_healthy?
14. Qual host o Adminer deve usar para acessar o PostgreSQL?
15. Como testar Redis com redis-cli?
16. O que docker compose down remove?
17. O que docker compose down -v remove?
18. Quando usar porta alternativa como 5433?
19. Como esta aula prepara Spring Boot?
20. Como esta aula prepara CI/CD?
```

---

# Parte 24 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-260-docker-compose-profissional
```

Com:

```text
.env.example;
.gitignore;
docker-compose.yml;
postgres/init/01-create-schema.sql;
postgres/init/02-seed.sql;
redis/README_REDIS.md;
README_AMBIENTE_LOCAL.md;
RELATORIO_DOCKER_COMPOSE.md.
```

---

## Requisitos

Você deve:

```text
criar a estrutura de pastas;
criar .env.example;
garantir que .env está no .gitignore;
criar docker-compose.yml;
subir PostgreSQL;
subir Redis;
subir Adminer;
subir Redis Commander;
configurar rede dedicada;
configurar volumes nomeados;
configurar healthchecks;
executar docker compose up -d;
executar docker compose ps;
validar PostgreSQL com psql;
validar tabelas criadas;
validar Redis com PING;
criar uma chave no Redis;
acessar Adminer;
acessar Redis Commander;
parar com docker compose down;
subir novamente sem perder dados;
executar reset com docker compose down -v;
documentar tudo no relatório.
```

---

## Critérios de aceite

```text
docker compose up -d deve subir sem erro;
PostgreSQL deve ficar healthy;
Redis deve ficar healthy;
Adminer deve abrir em http://localhost:8081;
Redis Commander deve abrir em http://localhost:8082;
psql deve conectar com usuário aula260;
tabelas ordem_servico e atividade devem existir;
seed inicial deve existir;
redis-cli PING deve retornar PONG;
uma chave criada no Redis deve ser consultável;
volumes nomeados devem aparecer em docker volume ls;
rede deve aparecer em docker network ls;
.env não deve ser versionado;
.env.example deve ser versionado;
README deve explicar como subir o ambiente;
relatório deve registrar comandos, erros e aprendizados.
```

---

# Parte 25 — Simulado rápido

## Questão 1

Docker Compose profissional é mais útil porque:

```text
A) documenta e executa uma stack local reproduzível.
B) substitui Java.
C) elimina necessidade de banco.
D) impede qualquer erro de ambiente.
```

---

## Questão 2

Dentro de um container, `localhost` normalmente aponta para:

```text
A) o próprio container.
B) sempre o computador host.
C) sempre o PostgreSQL.
D) sempre o Redis.
```

---

## Questão 3

Se uma API está em container na mesma rede do PostgreSQL, ela deve acessar o banco por:

```text
A) postgres:5432.
B) localhost:5432.
C) 127.0.0.1:5432 obrigatoriamente.
D) adminer:8080.
```

---

## Questão 4

Um named volume é usado principalmente para:

```text
A) persistir dados gerenciados pelo Docker.
B) criar branch Git.
C) compilar Java.
D) substituir healthcheck.
```

---

## Questão 5

Um bind mount como `./postgres/init:/docker-entrypoint-initdb.d:ro` serve para:

```text
A) mapear uma pasta local para dentro do container.
B) remover o container.
C) criar imagem Java.
D) publicar porta.
```

---

## Questão 6

Scripts em `/docker-entrypoint-initdb.d` no PostgreSQL rodam:

```text
A) na primeira inicialização do banco, quando o volume de dados está vazio.
B) a cada SELECT.
C) sempre que abrir Adminer.
D) apenas quando o Redis inicia.
```

---

## Questão 7

Healthcheck serve para:

```text
A) verificar se o serviço está realmente saudável/pronto.
B) criar senha.
C) remover volume.
D) substituir logs.
```

---

## Questão 8

`docker compose down -v` faz:

```text
A) remove containers e volumes da stack.
B) apenas mostra logs.
C) apenas reinicia o Redis.
D) cria banco sem apagar nada.
```

---

## Questão 9

O arquivo `.env.example` deve:

```text
A) ser um modelo versionável das variáveis necessárias.
B) conter senha real de produção.
C) substituir o docker-compose.yml.
D) ser sempre apagado.
```

---

## Questão 10

Se a porta 5432 estiver ocupada na máquina, uma solução local é:

```text
A) alterar POSTGRES_HOST_PORT para outra porta, como 5433.
B) apagar o Java.
C) remover o arquivo README.
D) trocar o nome da tabela.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
7. A
8. A
9. A
10. A
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-260-docker-compose-profissional
git commit -m "Aula 260: docker compose profissional postgres redis healthcheck"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
Docker Compose profissional permite criar uma stack local de backend reproduzível, com serviços auxiliares, rede, volumes, variáveis, healthchecks, ferramentas de inspeção, reset controlado e documentação executável.
```

Você estudou:

```text
Docker Compose profissional;
PostgreSQL;
Redis;
Adminer;
Redis Commander;
.env.example;
.gitignore;
variáveis com valor padrão;
rede Docker dedicada;
named volumes;
bind mounts;
scripts de inicialização PostgreSQL;
healthcheck;
pg_isready;
redis-cli ping;
depends_on com service_healthy;
docker compose up;
docker compose ps;
docker compose logs;
docker exec;
psql;
redis-cli;
localhost vs nome do serviço;
reset sem apagar dados;
reset apagando volumes;
troubleshooting essencial;
documentação de ambiente local;
preparação para Spring Boot;
preparação para Testcontainers;
preparação para CI/CD.
```

Na próxima aula, vamos continuar o fechamento do M11 entrando em:

```text
CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos.
```

A ideia será entender como uma alteração no Git pode disparar um fluxo automatizado de validação, testes e qualidade, preparando o caminho para pipelines Maven, Docker, qualidade e entrega profissional.
