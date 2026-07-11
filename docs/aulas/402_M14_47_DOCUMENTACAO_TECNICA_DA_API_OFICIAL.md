# 402 - M14.47 - Documentação técnica da API

## Apresentação da aula

Na aula 401, você criou uma coleção profissional para consumir a API.

A coleção passou a organizar:

```text
ambientes;

variáveis;

folders;

headers;

correlation ID;

encadeamento de IDs;

assertions;

examples;

runner;

cenários de erro.
```

Aquela aula respondeu:

```text
como executar e validar
fluxos reais da API
de forma reproduzível?
```

Agora existe uma collection versionada.

Também existe OpenAPI.

Também existem testes.

Também existem Dockerfile e Compose.

Também existem logs, health, readiness, liveness, cache, rate limiting, upload, download e notificação.

O projeto possui muitos recursos.

Porém, um novo desenvolvedor ainda pode perguntar:

```text
o que esta API faz?

como iniciar?

quais dependências são obrigatórias?

quais profiles existem?

quais variáveis precisam ser configuradas?

onde está a especificação OpenAPI?

como subir com Compose?

como testar?

como consultar health?

como entender um erro?

quais decisões arquiteturais já foram tomadas?

quais limitações ainda existem?
```

Se essas respostas estão espalhadas em commits, aulas, mensagens e memória da equipe, o custo de entrada aumenta.

A pergunta central desta aula será:

```text
como transformar o conhecimento técnico
do projeto em uma documentação navegável,
versionada, verificável e útil
para desenvolvimento e operação?
```

A solução criará uma documentação principal em:

```text
docs/api/README.md
```

Ela funcionará como porta de entrada técnica da API.

A estrutura será:

```text
visão geral;

escopo;

arquitetura;

requisitos;

execução local;

execução com Docker Compose;

configuração;

profiles;

endpoints;

versionamento;

erros;

observabilidade;

cache;

rate limiting;

arquivos;

notificação;

testes;

coleção;

troubleshooting;

segurança;

limitações;

referências.
```

A documentação não copiará integralmente o OpenAPI.

Ela fará links para a fonte oficial e explicará:

- como usar;
- onde encontrar;
- como validar;
- quais decisões importam;
- quais operações são suportadas.

A documentação também não substituirá a coleção.

OpenAPI, collection, testes e documentação possuem responsabilidades diferentes.

OpenAPI:

```text
contrato de endpoints e schemas.
```

Collection:

```text
fluxos executáveis de consumo.
```

Testes:

```text
verificação automatizada de comportamento.
```

Documentação técnica:

```text
contexto, operação, decisões e navegação.
```

A documentação será escrita para três públicos principais:

```text
desenvolvedor que vai executar;

desenvolvedor que vai alterar;

pessoa que vai operar ou diagnosticar.
```

Ela não será um texto comercial.

Ela não será uma lista de todas as classes Java.

Ela não será uma cópia do código.

Ela também não será uma sequência de comandos sem explicação.

Uma boa documentação precisa responder:

```text
por que;

o quê;

como;

onde;

qual limite.
```

A documentação ficará próxima do código.

Isso permite:

- review no mesmo pull request;
- versionamento;
- histórico;
- atualização junto da mudança;
- busca;
- links relativos;
- validação por CI no futuro.

A baseline também criará um pequeno índice na raiz do projeto.

No `README.md` principal, haverá uma seção:

```text
Documentação técnica
```

com links para:

```text
docs/api/README.md;

OpenAPI;

collection;

Compose.
```

Não será necessário reescrever o README inteiro.

A aula ensinará a complementar o arquivo existente.

A documentação utilizará exemplos seguros.

Não serão incluídos:

- senhas;
- tokens;
- dados pessoais;
- endpoints internos não publicados;
- dumps;
- stack traces;
- URLs corporativas;
- IPs reais;
- secrets de ambiente;
- credentials de banco.

A próxima aula será:

```text
403 - M14.48 - Erros comuns em API REST
```

Por isso, esta aula documentará o modelo de erro já existente, mas não criará um catálogo aprofundado de anti-patterns e falhas de design.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
398:
Health readiness/liveness.

399:
Dockerizando API Spring.

400:
Compose API PostgreSQL Redis.

401:
Coleção Postman/Insomnia profissional.

402:
Documentação técnica da API.

403:
Erros comuns em API REST.

404:
Checklist de produção inicial.
```

A aula 401 respondeu:

```text
como consumir a API
com uma collection profissional?
```

A aula 402 responderá:

```text
como permitir que outra pessoa
entenda, execute, altere e opere
a API com segurança?
```

Nesta aula:

```text
README técnico:
sim.

visão geral:
sim.

arquitetura:
sim.

setup local:
sim.

Compose:
sim.

configuração:
sim.

profiles:
sim.

endpoints:
sim.

erros:
sim.

observabilidade:
sim.

testes:
sim.

collection:
sim.

troubleshooting:
sim.

segurança:
sim.

limitações:
sim.

documentação automática:
não.

portal de docs:
não.

site estático:
não.

catálogo de anti-patterns:
não.
```

A regra central será:

```text
documentação técnica
precisa estar ligada ao código,
ter dono,
ser atualizada no mesmo fluxo
e apontar para fontes executáveis.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
docs/api/README.md
```

E o README principal terá links para:

```text
documentação da API;

OpenAPI;

Postman;

Docker Compose.
```

A documentação precisará permitir que uma pessoa:

1. entenda o propósito;
2. conheça os componentes;
3. veja as dependências;
4. escolha uma forma de execução;
5. configure o ambiente;
6. encontre endpoints;
7. interprete erros;
8. consulte health;
9. execute testes;
10. importe a collection;
11. diagnostique falhas comuns;
12. conheça limitações.

A estrutura mínima será:

```text
# Formação Java Backend API

## Visão geral
## Escopo
## Arquitetura
## Requisitos
## Execução local
## Execução com Docker Compose
## Configuração
## Profiles
## Contrato HTTP
## Endpoints principais
## Versionamento
## Erros
## Observabilidade
## Cache e rate limiting
## Upload e download
## Notificação por e-mail
## Testes
## Coleção Postman/Insomnia
## Troubleshooting
## Segurança
## Limitações conhecidas
## Referências
```

A validação será manual e automatizável.

Você irá:

- abrir links;
- testar comandos;
- comparar variáveis;
- revisar exemplos;
- procurar secrets;
- conferir paths;
- executar a stack;
- executar testes;
- importar a coleção;
- atualizar o diário;
- commitar.

---

## Conceito essencial

### Documentação é parte do produto

A documentação técnica não é um anexo opcional.

Ela influencia:

- tempo de onboarding;
- qualidade de manutenção;
- recuperação de incidentes;
- consistência de operação;
- facilidade de revisão;
- confiança da equipe;
- risco de conhecimento concentrado.

Código sem documentação suficiente pode funcionar, mas custa mais para ser entendido.

---

### Documentação viva

Documentação viva acompanha o projeto.

Ela não significa necessariamente geração automática de tudo.

Significa:

```text
versionada;

revisada;

ligada ao código;

validável;

atualizada quando o comportamento muda.
```

Um arquivo atualizado uma vez e abandonado não é documentação viva.

---

### Fonte da verdade

Cada assunto precisa possuir uma fonte principal.

Exemplos:

```text
contrato HTTP:
OpenAPI.

fluxos manuais:
collection.

migrations:
db/migration.

configuração:
application*.yaml e properties.

execução:
Dockerfile e compose.yaml.

decisões de arquitetura:
documentação técnica.

comportamento:
código e testes.
```

A documentação não deve competir com essas fontes.

Ela precisa apontar para elas.

---

### Não duplicar sem necessidade

Duplicação aumenta risco de divergência.

Errado:

```text
copiar todos os schemas OpenAPI
para o README.
```

Melhor:

```text
explicar onde acessar o OpenAPI;
listar endpoints principais;
apontar para a especificação completa.
```

Errado:

```text
copiar o compose.yaml inteiro.
```

Melhor:

```text
mostrar o comando;
explicar services, portas e volumes;
linkar o arquivo.
```

---

### Público da documentação

Antes de escrever, defina o público.

Nesta aula:

```text
desenvolvimento;

QA técnico;

operação local;

manutenção futura.
```

Um consumidor externo pode usar OpenAPI e collection.

Uma pessoa interna precisa de contexto adicional.

---

### Visão geral

A visão geral deve responder em poucos parágrafos:

- o que é;
- para que serve;
- qual stack;
- qual estado atual;
- qual é a responsabilidade principal.

Exemplo:

```text
API Spring Boot 4 e Java 21
construída como laboratório evolutivo
da Formação Java Backend.
```

Não escreva uma história longa do curso.

---

### Escopo

Liste o que a API possui.

Exemplo:

- CRUD de managed messages;
- versionamento v1/v2;
- OpenAPI;
- Problem Details;
- cache Redis;
- rate limiting;
- upload/download;
- scheduler;
- e-mail;
- Actuator;
- Docker;
- Compose;
- testes.

Liste também o que está fora.

Isso evita expectativas incorretas.

---

### Arquitetura

A documentação arquitetural deve mostrar:

```text
entrada;

aplicação;

persistência;

infraestrutura;

operação.
```

Um diagrama textual simples pode ser suficiente.

Exemplo:

```text
Cliente
  |
  v
Spring MVC
  |
  v
Application Service
  |
  +--> PostgreSQL
  +--> Redis
  +--> Filesystem
  +--> SMTP
```

Não é necessário criar uma ferramenta de diagramas nesta aula.

---

### Requisitos

Liste versões e ferramentas necessárias.

Exemplos:

- JDK 21;
- Docker;
- Docker Compose;
- Git;
- PowerShell;
- Postman ou Insomnia.

Não inclua uma versão exata de ferramenta sem necessidade.

Quando o projeto fixa uma versão, documente.

---

### Execução local

A documentação precisa separar:

```text
execução da JVM no host;

execução com Compose.
```

Na JVM local, PostgreSQL e Redis precisam estar disponíveis.

No Compose, a stack cria os services.

Não misture os dois fluxos em um único bloco de comandos.

---

### Configuração

Liste variáveis por finalidade.

Não copie todas as properties do framework.

Agrupe:

```text
aplicação;

banco;

Redis;

arquivos;

e-mail;

Actuator;

availability.
```

Para cada variável, informe:

- nome;
- objetivo;
- exemplo não sensível;
- obrigatória ou opcional;
- default quando existe.

---

### Profiles

A documentação precisa explicar profiles ativos.

Exemplo:

```text
local;

test;

mail-lab;

observability-local;

availability-lab.
```

Não precisa listar cada profile interno sem contexto.

Explique os profiles que alguém realmente ativa.

---

### Contrato HTTP

Documente:

```text
base path;

versões;

media type;

correlation ID;

client ID;

OpenAPI;

Swagger UI.
```

Não duplique o schema inteiro.

---

### Endpoints principais

Agrupe por domínio.

Exemplo:

```text
Managed Messages;

Arquivos;

Notificações;

Operação.
```

Use uma tabela pequena com:

```text
método;

path;

descrição.
```

Não transforme o README em uma tabela de centenas de linhas.

---

### Erros

Explique:

- Problem Details;
- status HTTP;
- correlation ID;
- `code`;
- `violations`;
- ausência de stack trace.

Mostre um exemplo seguro.

Não documente mensagens internas como contrato.

---

### Observabilidade

Documente:

- management port;
- `/actuator/health`;
- `/livez`;
- `/readyz`;
- `/actuator/info`;
- `/actuator/metrics`.

Explique que liveness e readiness possuem significados diferentes.

---

### Testes

Separe níveis:

```text
controller;

service;

integração;

contrato.
```

Mostre comandos para executar:

- todos;
- classe específica;
- integração com Docker.

Não liste cada método de teste.

---

### Troubleshooting

Troubleshooting deve ser orientado a sintomas.

Formato:

```text
Sintoma;
causa provável;
como confirmar;
como corrigir.
```

Exemplos:

- porta ocupada;
- Docker indisponível;
- PostgreSQL unhealthy;
- Redis indisponível;
- migration falhou;
- env file ignorado;
- endpoint 404;
- rate limit 429;
- upload permission denied.

---

### Segurança

Documente decisões atuais:

- não usar secrets no Git;
- management no loopback;
- endpoints mínimos;
- usuário não root;
- allowlist de upload;
- destinatário configurado;
- rate limiting;
- logs sem conteúdo sensível.

Também documente limites:

```text
Spring Security ainda não foi implementado.
```

Honestidade é melhor que uma falsa impressão de produção.

---

### Limitações conhecidas

Lista inicial:

- sem autenticação;
- sem autorização;
- sem lock distribuído;
- scheduler por instância;
- armazenamento local de arquivos;
- e-mail sem outbox;
- Redis sem persistência;
- Compose voltado ao laboratório;
- sem TLS;
- sem observabilidade externa.

Esses limites ajudam decisões futuras.

---

## Mão na massa guiada

### 1. Criar o diretório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/api" |
  Out-Null
```

---

### 2. Criar o README técnico

Arquivo:

```text
docs/api/README.md
```

Comece com:

```markdown
# Formação Java Backend API

API de laboratório construída com Java 21 e Spring Boot 4,
utilizada na Formação Java Backend para praticar desenvolvimento,
persistência, integração, testes, observabilidade e containerização.
```

Mantenha a descrição objetiva.

---

### 3. Adicionar visão geral

Conteúdo sugerido:

```markdown
## Visão geral

A aplicação expõe uma API REST versionada para gerenciamento
de mensagens de runtime e recursos auxiliares de laboratório.

Principais tecnologias:

- Java 21;
- Spring Boot 4;
- Spring MVC;
- Spring Data JPA;
- PostgreSQL;
- Redis;
- Flyway;
- Spring Boot Actuator;
- Docker;
- Docker Compose.
```

---

### 4. Adicionar escopo

```markdown
## Escopo

A API inclui:

- CRUD de managed messages;
- versionamento v1 e v2;
- OpenAPI e Swagger UI;
- Problem Details;
- cache Redis;
- rate limiting;
- upload e download;
- scheduler de limpeza;
- notificação simples por e-mail;
- health, readiness e liveness;
- testes unitários, de slice, integração e contrato;
- execução por Docker Compose.
```

Depois:

```markdown
Fora do escopo atual:

- autenticação e autorização;
- mensageria distribuída;
- armazenamento de objetos em cloud;
- alta disponibilidade;
- Kubernetes;
- tracing distribuído.
```

---

### 5. Adicionar arquitetura

```markdown
## Arquitetura

```text
Cliente HTTP
    |
    v
Spring MVC / Controllers
    |
    v
Application Services
    |
    +--> Spring Data JPA --> PostgreSQL
    |
    +--> Spring Cache / Redis
    |
    +--> Filesystem de uploads
    |
    +--> JavaMailSender / SMTP

Actuator
    |
    +--> health
    +--> info
    +--> metrics
    +--> liveness
    +--> readiness
```
```

Explique que PostgreSQL é fonte da verdade.

Redis é cache e estado temporário de rate limiting.

---

### 6. Adicionar requisitos

```markdown
## Requisitos

Para execução pela JVM:

- JDK 21;
- PostgreSQL;
- Redis.

Para execução completa:

- Docker;
- Docker Compose.

Ferramentas opcionais:

- Postman;
- Insomnia;
- IntelliJ IDEA.
```

---

### 7. Documentar execução local

Inclua:

```powershell
.\mvnw.cmd clean verify

.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Explique:

```text
PostgreSQL, Redis e Mailpit
precisam estar disponíveis
conforme os profiles ativos.
```

Não inclua senha real.

---

### 8. Documentar Compose

Inclua:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet

docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Depois:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

Link relativo:

```markdown
Veja [`compose.yaml`](../../compose.yaml).
```

---

### 9. Criar tabela de portas

```markdown
| Componente | Porta | Exposição |
|---|---:|---|
| API | 8081 | Host |
| Actuator | 8082 | Loopback |
| PostgreSQL | 5432 | Rede Compose |
| Redis | 6379 | Rede Compose |
```

Explique que PostgreSQL e Redis não são publicados no host pela stack oficial.

---

### 10. Documentar configuração

Crie uma tabela pequena:

```markdown
| Variável | Objetivo | Obrigatória |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Profiles ativos | Sim |
| `LOCAL_DB_URL` | JDBC URL | Sim |
| `LOCAL_DB_USERNAME` | Usuário do banco | Sim |
| `LOCAL_DB_PASSWORD` | Senha do banco | Sim |
| `REDIS_HOST` | Host do Redis | Sim |
| `REDIS_PORT` | Porta do Redis | Não |
| `FILE_STORAGE_ROOT` | Diretório de uploads | Não |
| `APP_VERSION` | Versão exposta em info | Não |
```

Depois, crie seções específicas para e-mail e management.

---

### 11. Documentar profiles

Exemplo:

```markdown
## Profiles

### local

Agrupa as configurações de desenvolvimento local.

### test

Usado em testes automatizados.

### mail-lab

Habilita o laboratório de e-mail.

### availability-lab

Permite forçar estados de readiness e liveness somente localmente.
```

Não incentive uso do lab de disponibilidade em produção.

---

### 12. Documentar OpenAPI

Inclua:

```markdown
## Contrato HTTP

Swagger UI:

`http://localhost:8081/swagger-ui/index.html`

OpenAPI JSON:

`http://localhost:8081/v3/api-docs`
```

Confirme os paths reais do projeto antes do commit.

Adicione link para os arquivos versionados quando existirem.

---

### 13. Documentar headers

Inclua:

```markdown
### Headers

`X-Client-Id`

Identifica o cliente do laboratório para rate limiting.

`X-Correlation-Id`

Pode ser enviado pelo cliente. Quando ausente, a aplicação gera um valor.
A response devolve o correlation ID.
```

Explique que `X-Client-Id` não é autenticação.

---

### 14. Documentar endpoints principais

Tabela:

```markdown
| Método | Path | Descrição |
|---|---|---|
| POST | `/api/v2/runtime/managed-messages` | Criar mensagem |
| GET | `/api/v2/runtime/managed-messages/{id}` | Consultar |
| GET | `/api/v2/runtime/managed-messages` | Listar |
| DELETE | `/api/v2/runtime/managed-messages/{id}` | Remover |
| POST | `/api/v2/runtime/files` | Upload |
| GET | `/api/v2/runtime/files/{fileId}` | Download |
| POST | `/api/v2/runtime/notifications/email` | Enviar e-mail |
```

A notificação depende do profile de laboratório.

---

### 15. Documentar versionamento

```markdown
## Versionamento

A API possui versões v1 e v2.

A v1 está depreciada.
Novas capacidades são adicionadas somente na v2,
salvo decisão explícita de compatibilidade.

O contrato completo permanece no OpenAPI.
```

Não prometa data de remoção que não foi definida.

---

### 16. Documentar Problem Details

Exemplo:

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Resource not found.",
  "instance": "/api/v2/runtime/managed-messages/999",
  "code": "managed_message_not_found",
  "correlationId": "..."
}
```

Use o formato real do projeto.

Se `correlationId` está apenas no header, não o invente no body.

Revise antes do commit.

---

### 17. Documentar observabilidade

```markdown
## Observabilidade

### Liveness

`GET http://localhost:8081/livez`

### Readiness

`GET http://localhost:8081/readyz`

### Health

`GET http://127.0.0.1:8082/actuator/health`

### Info

`GET http://127.0.0.1:8082/actuator/info`

### Metrics

`GET http://127.0.0.1:8082/actuator/metrics`
```

Inclua o significado operacional.

---

### 18. Documentar cache e rate limiting

Explique:

```text
Redis é utilizado para cache e rate limiting.

Cache:
fonte continua sendo PostgreSQL.

Rate limiting:
5 requests por 60 segundos na baseline.

Falha Redis:
policy definida no código atual.
```

Não copie detalhes internos da Lua inteira.

---

### 19. Documentar arquivos

Inclua:

- limite de 5 MB;
- tipos permitidos;
- storage local;
- UUID físico;
- metadata;
- volume Compose;
- `Content-Disposition`;
- `nosniff`.

Não prometa antivírus ou cloud storage.

---

### 20. Documentar notificação

Inclua:

- Mailpit local;
- texto simples;
- destinatário configurado;
- status `SUBMITTED`;
- ausência de garantia de entrega;
- feature desabilitada na stack da aula 400.

---

### 21. Documentar testes

Inclua:

```powershell
.\mvnw.cmd test
```

Classes recentes:

```text
EmailNotificationControllerTest;

SimpleEmailNotificationServiceTest;

ManagedRuntimeMessagePostgreSqlIT;

EmailNotificationProviderContractTest.
```

Explique que a integração precisa de Docker.

---

### 22. Documentar collection

Link:

```markdown
[Collection Postman](../../api-clients/postman/formacao-java-backend-api-v2.postman_collection.json)
```

Environment:

```markdown
[Environment example](../../api-clients/postman/formacao-java-backend-local.postman_environment.example.json)
```

Explique que o environment real não é versionado.

---

### 23. Criar troubleshooting

Casos mínimos:

```text
porta 8081 ocupada;

Docker indisponível;

PostgreSQL unhealthy;

Redis unhealthy;

migration falhou;

API unhealthy;

env file ausente;

403/404 no Actuator;

429 no rate limiting;

upload sem permissão.
```

Para cada um:

```text
sintoma;

comando de confirmação;

ação.
```

---

### 24. Documentar segurança

Seção:

```markdown
## Segurança

A baseline atual utiliza:

- usuário não root no container;
- management no loopback;
- allowlist de Actuator;
- rate limiting;
- validação de upload;
- logs sem conteúdo sensível;
- secrets fora do Git.

Limites atuais:

- sem Spring Security;
- sem autenticação;
- sem autorização;
- sem TLS.
```

---

### 25. Documentar limitações

Inclua:

```text
scheduler por instância;

sem lock distribuído;

upload local;

sem outbox de e-mail;

Redis reconstruível;

Compose local;

sem alta disponibilidade;

sem tracing externo.
```

Não esconda limitações.

---

### 26. Criar referências

Links relativos:

```markdown
- [`compose.yaml`](../../compose.yaml)
- [`Dockerfile`](../../Dockerfile)
- [Collection Postman](../../api-clients/postman/formacao-java-backend-api-v2.postman_collection.json)
- [Environment example](../../api-clients/postman/formacao-java-backend-local.postman_environment.example.json)
- [Migrations](../../src/main/resources/db/migration)
```

Inclua links oficiais externos somente quando realmente úteis.

---

### 27. Atualizar README principal

Adicione:

```markdown
## Documentação técnica

- [Documentação da API](docs/api/README.md)
- [Docker Compose](compose.yaml)
- [Collection Postman](api-clients/postman/formacao-java-backend-api-v2.postman_collection.json)
```

Mantenha a seção curta.

---

### 28. Validar links relativos

No IntelliJ ou editor:

- abra `docs/api/README.md`;
- clique em cada link;
- confirme o destino;
- corrija path relativo.

Links quebrados reduzem confiança.

---

### 29. Validar comandos

Execute pelo menos:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet

.\mvnw.cmd test
```

Depois consulte:

```text
/livez;

/readyz;

/actuator/info.
```

A documentação precisa refletir comandos reais.

---

### 30. Revisar por secrets

PowerShell:

```powershell
Select-String `
  -Path "docs/api/README.md" `
  -Pattern `
    "password|secret|token|authorization" `
  -CaseSensitive:$false
```

Resultados podem ser explicações.

Confirme que não existem valores reais.

---

### 31. Revisar hardcodes perigosos

Procure:

```text
IP real;

diretório pessoal;

nome de usuário Windows;

URL corporativa;

path absoluto.
```

Exemplos locais genéricos são permitidos.

---

### 32. Revisar divergência

Compare:

```text
README;

OpenAPI;

collection;

compose.yaml;

application*.yaml.
```

Perguntas:

- path está correto?
- status está correto?
- variável existe?
- profile existe?
- porta está correta?
- limite está correto?
- nome do arquivo está correto?

---

## Entendendo o que foi feito

### A documentação ganhou uma porta de entrada

Uma pessoa não precisa começar lendo classes.

### As fontes ficaram conectadas

README aponta para OpenAPI, Compose, tests e collection.

### A operação ficou descrita

Startup, health, logs e troubleshooting estão próximos do código.

### Limitações ficaram explícitas

A documentação não vende uma maturidade inexistente.

### Secrets ficaram fora

Examples usam nomes genéricos.

### O projeto ficou mais transferível

Conhecimento deixou de depender de uma única pessoa.

---

## Erros comuns importantes

### Documentar tudo em um único bloco

A navegação fica ruim.

### Copiar OpenAPI inteira

A duplicação diverge.

### Escrever somente comandos

O leitor não entende decisões e limites.

### Documentar somente happy path

Troubleshooting e erros também importam.

### Incluir secrets em exemplos

README é versionado.

### Prometer comportamento futuro

Documente o estado atual.

### Usar links absolutos locais

Eles quebram em outra máquina.

### Listar classes Java como arquitetura

Arquitetura explica responsabilidades e fluxos.

### Esconder limitações

A equipe toma decisões erradas.

### Atualizar documentação depois

A mudança pode ser esquecida.

---

## Comandos úteis

### Criar diretório

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "docs/api"
```

### Procurar secrets

```powershell
Select-String `
  -Path "docs/**/*.md" `
  -Pattern `
    "password|secret|token" `
  -CaseSensitive:$false
```

### Procurar localhost

```powershell
Select-String `
  -Path "docs/api/README.md" `
  -Pattern "localhost"
```

Revise se cada uso é intencional.

### Validar Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

### Executar testes

```powershell
.\mvnw.cmd test
```

### Revisar diff

```powershell
git diff `
  -- `
  "README.md" `
  "docs/api/README.md"
```

---

## Exercício guiado

### Parte 1 — Porta de entrada

Crie `docs/api/README.md`.

### Parte 2 — Arquitetura e execução

Documente componentes e duas formas de startup.

### Parte 3 — Configuração

Crie tabelas de variáveis, profiles e portas.

### Parte 4 — Contrato

Documente OpenAPI, headers, versionamento e endpoints.

### Parte 5 — Operação

Documente health, readiness, liveness, info e metrics.

### Parte 6 — Recursos

Documente cache, rate limiting, arquivos e e-mail.

### Parte 7 — Qualidade

Documente testes e collection.

### Parte 8 — Suporte

Crie troubleshooting e limitações.

### Parte 9 — Validação

Abra links, execute comandos e revise secrets.

### Parte 10 — Registrar decisão

Anote:

```text
docs/api/README.md;

README principal com índice;

documentação próxima do código;

OpenAPI como contrato;

collection como fluxo executável;

Compose como topologia;

migrations como schema;

configuração agrupada;

health e troubleshooting;

segurança e limitações;

sem duplicação integral;

sem secrets;

sem promessas futuras.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 401 foi preservada;
- documentação técnica foi definida como parte do produto;
- documentação viva foi explicada;
- fontes da verdade foram identificadas;
- duplicação foi evitada;
- público foi definido;
- `docs/api/README.md` foi criado;
- README principal foi atualizado;
- visão geral foi criada;
- escopo foi criado;
- fora de escopo foi criado;
- arquitetura foi documentada;
- PostgreSQL foi definido como fonte da verdade;
- Redis foi definido como estado reconstruível;
- requisitos foram documentados;
- execução local foi documentada;
- execução com Compose foi documentada;
- comandos foram testados;
- tabela de portas foi criada;
- configuração foi agrupada;
- variáveis obrigatórias foram documentadas;
- variáveis opcionais foram documentadas;
- profiles foram documentados;
- profile de laboratório foi identificado;
- OpenAPI foi linkado;
- Swagger UI foi documentado;
- headers foram documentados;
- `X-Client-Id` não foi chamado de autenticação;
- correlation ID foi documentado;
- endpoints principais foram agrupados;
- v1 e v2 foram explicadas;
- v1 depreciada foi documentada;
- data de remoção não foi inventada;
- Problem Details foi documentado;
- status e code foram explicados;
- stack trace pública foi rejeitada;
- health foi documentado;
- liveness foi documentada;
- readiness foi documentada;
- info foi documentado;
- metrics foi documentado;
- cache foi documentado;
- rate limiting foi documentado;
- upload foi documentado;
- limites de arquivo foram documentados;
- volume de upload foi documentado;
- notificação foi documentada;
- `SUBMITTED` não foi chamado de entrega;
- testes foram documentados;
- níveis de teste foram diferenciados;
- integração com Docker foi documentada;
- collection foi linkada;
- environment example foi linkado;
- environment real não foi versionado;
- troubleshooting foi criado;
- sintomas foram usados;
- comandos de diagnóstico foram incluídos;
- segurança atual foi documentada;
- ausência de Spring Security foi documentada;
- ausência de TLS foi documentada;
- limitações conhecidas foram documentadas;
- scheduler por instância foi documentado;
- ausência de lock distribuído foi documentada;
- upload local foi documentado;
- ausência de outbox foi documentada;
- Compose local foi documentado;
- referências relativas foram criadas;
- links foram testados;
- secrets foram revisados;
- paths absolutos foram removidos;
- divergência com OpenAPI foi revisada;
- divergência com collection foi revisada;
- divergência com Compose foi revisada;
- divergência com properties foi revisada;
- documentação automática não foi antecipada;
- site estático não foi antecipado;
- portal de developer não foi antecipado;
- catálogo aprofundado de erros não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 403 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "docs(m14): consolidar documentacao tecnica da API"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- env local;
- secrets;
- tokens;
- dados pessoais;
- logs;
- reports;
- screenshots;
- paths absolutos;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto ganhou uma porta de entrada técnica.

A documentação passou a conectar:

```text
arquitetura;

configuração;

OpenAPI;

endpoints;

Compose;

testes;

collection;

observabilidade;

troubleshooting;

segurança;

limitações.
```

Você comprovou:

```text
links válidos;

comandos reais;

sem secrets;

sem duplicação integral;

alinhamento com código;

alinhamento com contrato;

alinhamento com operação.
```

A decisão central foi:

```text
documentação técnica
precisa reduzir incerteza;

ela não substitui o código,
o contrato ou os testes;

ela conecta essas fontes
e explica como utilizá-las.
```

A próxima aula será:

```text
403 - M14.48 - Erros comuns em API REST
```

Nela, você analisará falhas recorrentes de design e implementação em APIs.

Serão estudados problemas como:

- status HTTP inadequado;
- verbos incorretos;
- contratos inconsistentes;
- erros genéricos;
- vazamento de detalhes;
- versionamento mal aplicado;
- endpoints orientados a ação;
- validação duplicada;
- paginação inconsistente;
- acoplamento de infraestrutura.

Esses anti-patterns não foram aprofundados nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei a documentação técnica principal.
- [ ] Conectei OpenAPI, collection, Compose e testes.
- [ ] Documentei execução, configuração e operação.
- [ ] Revisei segurança e limitações.
- [ ] Validei links, comandos e ausência de secrets.

---

## Troubleshooting adicional

### Link relativo não funciona

Confirme:

- quantidade de `../`;
- nome real do arquivo;
- capitalização;
- arquivo versionado;
- preview do editor.

### Swagger UI não abre

Confirme:

- aplicação ativa;
- profile;
- path real;
- dependency OpenAPI;
- porta 8081.

### Comando Compose falha

Confirme:

- env file;
- Docker ativo;
- execução na raiz do projeto;
- nome `compose.yaml`.

### Documentação diverge do endpoint

Compare com OpenAPI e testes.

Corrija a documentação ou o código conforme a decisão oficial.

### Tabela de variável está incompleta

Revise `application*.yaml` e records de `@ConfigurationProperties`.

### README ficou grande demais

Mantenha a porta de entrada e extraia assuntos especializados para arquivos ligados.

Não remova contexto necessário.

### Secret foi encontrado no histórico

Remova do arquivo atual e trate a credential como comprometida.

Reescrever Git não substitui rotação da secret.

---

## Observações para evolução

A documentação pode evoluir para:

- ADRs;
- diagramas C4;
- site com MkDocs;
- Antora;
- Backstage;
- catálogo de APIs;
- documentação gerada;
- validação de links;
- spellcheck;
- snippets testados;
- changelog;
- release notes;
- runbooks;
- SLOs;
- playbooks de incidente.

Essas ferramentas só agregam valor quando o conteúdo possui dono e processo de atualização.

Uma documentação bonita e desatualizada continua perigosa.

O próximo passo do cronograma será revisar erros comuns em APIs REST.

---

## Perguntas de revisão

1. Qual é o objetivo da documentação técnica?
2. Ela substitui OpenAPI?
3. Ela substitui testes?
4. Onde ficou o README técnico?
5. Quem é o público?
6. Qual é a fonte do contrato HTTP?
7. Qual é a fonte dos fluxos manuais?
8. Qual é a fonte do schema?
9. O que entra na visão geral?
10. Por que documentar fora de escopo?
11. Secrets entram no README?
12. O que deve existir no troubleshooting?
13. Liveness e readiness são iguais?
14. `SUBMITTED` significa entregue?
15. Redis é fonte da verdade?
16. Onde ficam uploads no Compose?
17. Spring Security existe?
18. Limitações devem ser escondidas?
19. Links precisam ser testados?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Reduzir incerteza de uso, manutenção e operação.
2. Não.
3. Não.
4. `docs/api/README.md`.
5. Desenvolvimento, QA técnico e operação.
6. OpenAPI.
7. Collection.
8. Migrations.
9. Propósito, stack e responsabilidade.
10. Para evitar expectativas incorretas.
11. Não.
12. Sintoma, diagnóstico e correção.
13. Não.
14. Não.
15. Não.
16. Volume `uploads-data`.
17. Não.
18. Não.
19. Sim.
20. Erros comuns em API REST.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 402 - M14.47 - Documentação técnica da API

- Continuei no projeto `formacao-java-backend-api`.
- Tratei documentação técnica como parte do produto.
- Diferenciei documentação, OpenAPI, collection e testes.
- Identifiquei fontes da verdade.
- Evitei duplicação integral.
- Defini o público da documentação.
- Criei `docs/api/README.md`.
- Atualizei o README principal com um índice.
- Documentei visão geral e escopo.
- Documentei o que está fora do escopo.
- Documentei a arquitetura.
- Defini PostgreSQL como fonte da verdade.
- Defini Redis como cache e estado temporário.
- Documentei requisitos.
- Documentei execução local.
- Documentei execução com Compose.
- Criei tabela de portas.
- Agrupei variáveis de configuração.
- Documentei profiles.
- Documentei OpenAPI e Swagger UI.
- Documentei headers e correlation ID.
- Documentei endpoints principais.
- Documentei versionamento v1 e v2.
- Documentei Problem Details.
- Documentei health, liveness, readiness, info e metrics.
- Documentei cache e rate limiting.
- Documentei upload e download.
- Documentei notificação simples por e-mail.
- Documentei testes.
- Linkei a collection e o environment example.
- Criei troubleshooting orientado a sintomas.
- Documentei decisões de segurança.
- Documentei ausência de autenticação e TLS.
- Documentei limitações conhecidas.
- Criei referências relativas.
- Testei links e comandos.
- Revisei secrets e paths absolutos.
- Comparei documentação com OpenAPI, collection, Compose e properties.
- Não antecipei portal de documentação ou catálogo aprofundado de erros.
- Próxima aula: Erros comuns em API REST.
```

---

## Referência técnica curta

- [Spring REST Docs](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Postman Collections](https://learning.postman.com/docs/collections/collections-overview)

Regra final:

```text
documentação técnica precisa conectar propósito, arquitetura, execução, configuração, contrato, operação, testes e troubleshooting sem duplicar integralmente as fontes executáveis; nesta baseline, docs/api/README.md funciona como porta de entrada, OpenAPI permanece como contrato, a collection representa fluxos, Compose descreve a topologia, migrations definem o schema e limitações e decisões de segurança são registradas de forma explícita.
```
