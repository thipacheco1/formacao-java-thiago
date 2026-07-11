# 403 - M14.48 - Erros comuns em API REST

## Apresentação da aula

Na aula 402, você consolidou a documentação técnica da API.

O projeto passou a possuir uma porta de entrada para:

```text
arquitetura;

configuração;

execução local;

Docker Compose;

OpenAPI;

endpoints;

erros;

observabilidade;

testes;

collection;

troubleshooting;

limitações.
```

Aquela aula respondeu:

```text
como permitir que outra pessoa
entenda, execute, altere e opere
a API com segurança?
```

Agora a formação entra em uma etapa de revisão crítica.

A aplicação já possui:

- endpoints REST;
- versões v1 e v2;
- DTOs;
- Bean Validation;
- Problem Details;
- paginação;
- cache;
- rate limiting;
- upload e download;
- notificação;
- testes;
- OpenAPI;
- collection;
- documentação.

Isso permite analisar erros comuns usando um sistema real.

A pergunta central desta aula será:

```text
quais decisões aparentemente pequenas
fazem uma API REST ficar inconsistente,
difícil de consumir,
difícil de evoluir
ou insegura?
```

Nesta aula, você não criará uma nova feature de negócio.

O trabalho será:

```text
auditar;

comparar;

classificar;

corrigir quando necessário;

registrar decisões.
```

A prática criará:

```text
docs/api/REST_API_REVIEW.md
```

Esse arquivo não substituirá a documentação técnica da aula 402.

Ele será um relatório de revisão com:

- convenções;
- riscos;
- evidências;
- decisão;
- ação recomendada;
- resultado esperado.

A análise será organizada por categorias:

```text
URI;

método HTTP;

status HTTP;

request e response;

validação;

erros;

idempotência;

paginação;

versionamento;

concorrência;

segurança;

observabilidade;

documentação.
```

Os erros estudados serão:

- usar verbos na URI sem necessidade;
- criar paths inconsistentes;
- usar `GET` com efeito colateral;
- usar `POST` para tudo;
- confundir `PUT` e `PATCH`;
- devolver `200` para qualquer situação;
- devolver `500` para erro de cliente;
- devolver body em `204`;
- omitir `Location` após criação;
- expor entity JPA diretamente;
- aceitar payload sem limite;
- misturar campos v1 e v2;
- retornar formatos de erro diferentes;
- vazar stack trace;
- expor mensagem de infraestrutura;
- paginação sem contrato;
- usar ID genérico e sem contexto;
- ignorar idempotência;
- acoplar cliente a detalhes internos;
- documentar comportamento diferente do código;
- alterar contrato sem versionamento ou depreciação.

A aula utilizará a API atual como referência.

Alguns pontos já foram implementados corretamente.

Eles também serão registrados.

Auditoria não serve apenas para encontrar defeitos.

Ela serve para comprovar decisões boas e impedir regressões.

Exemplo:

```text
POST de criação:
201 Created;

header Location:
presente;

response v2:
campo message;

Problem Details:
formato consistente.
```

Quando a API já estiver correta, a ação será:

```text
manter;

testar;

documentar.
```

Quando houver um risco, a ação poderá ser:

```text
criar teste;

ajustar OpenAPI;

corrigir status;

renomear path;

limitar payload;

registrar depreciação.
```

Não serão feitos refactors grandes sem necessidade.

Uma revisão profissional evita:

```text
alterar tudo
apenas para mostrar atividade.
```

A próxima aula será:

```text
404 - M14.49 - Checklist de produção inicial
```

Por isso, esta aula não criará ainda o checklist completo de produção.

Ela produzirá insumos concretos para esse checklist.

Também não serão antecipados:

- Spring Security;
- autenticação;
- autorização;
- gateway;
- API management;
- WAF;
- OAuth2;
- Kubernetes;
- SLO;
- testes de carga;
- chaos engineering.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
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

405:
Projeto API OS - Parte 1.
```

A aula 402 respondeu:

```text
como consolidar
o conhecimento técnico da API?
```

A aula 403 responderá:

```text
como revisar criticamente
o design e o comportamento REST
antes de considerar a API madura?
```

Nesta aula:

```text
auditoria REST:
sim.

URI:
sim.

método HTTP:
sim.

status HTTP:
sim.

DTO:
sim.

validation:
sim.

Problem Details:
sim.

idempotência:
sim.

paginação:
sim.

versionamento:
sim.

OpenAPI:
sim.

testes de regressão:
sim.

nova feature:
não.

Spring Security:
não.

produção:
não ainda.

checklist final:
não ainda.
```

A regra central será:

```text
uma API previsível
é mais valiosa
do que uma API criativa;

consistência reduz custo
para consumidor e manutenção.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/api/REST_API_REVIEW.md
```

Com uma matriz semelhante a:

```text
Categoria;
Convenção;
Evidência;
Status;
Risco;
Ação.
```

Status possíveis:

```text
OK;

ATENÇÃO;

CORRIGIR;

NÃO SE APLICA.
```

Você irá:

1. mapear os endpoints atuais;
2. revisar nomes de URI;
3. revisar métodos;
4. revisar status;
5. revisar requests e responses;
6. revisar validação;
7. revisar Problem Details;
8. revisar idempotência;
9. revisar paginação;
10. revisar versionamento;
11. revisar headers;
12. revisar documentação;
13. executar a collection;
14. criar testes de regressão quando necessário;
15. registrar as decisões;
16. commitar.

A revisão usará estas fontes:

```text
OpenAPI;

controllers;

DTOs;

GlobalExceptionHandler;

tests;

collection;

docs/api/README.md.
```

A aula não deve depender apenas de memória.

---

## Conceito essencial

### REST não é apenas JSON por HTTP

Uma API pode enviar JSON e ainda possuir um design inconsistente.

REST envolve decisões sobre:

- recursos;
- representações;
- métodos;
- semântica HTTP;
- URIs;
- estado;
- cache;
- evolução.

Não é necessário transformar toda API em uma implementação acadêmica perfeita.

O objetivo profissional é:

```text
usar a semântica HTTP
de forma previsível e consistente.
```

---

### Erro 1 — Verbo desnecessário na URI

Exemplo problemático:

```http
POST /api/v2/createManagedMessage
```

Ou:

```http
POST /api/v2/managed-messages/create
```

O método HTTP já informa criação.

Preferível:

```http
POST /api/v2/runtime/managed-messages
```

A URI representa o recurso.

Exceções podem existir quando a operação não se encaixa naturalmente em CRUD.

Exemplo:

```text
simular;

validar;

calcular;

reenviar.
```

Mesmo nesses casos, analise se a operação pode ser representada como recurso ou sub-recurso.

Não crie verbos por hábito.

---

### Erro 2 — Nomes inconsistentes

Exemplos:

```text
/managed-message;

/managedMessages;

/messages_runtime;

/runtime-message.
```

Uma API precisa escolher convenções.

Na baseline:

```text
kebab-case;

substantivos;

plural para coleções.
```

Exemplo:

```text
/managed-messages.
```

O consumidor não deveria adivinhar a convenção de cada equipe.

---

### Erro 3 — GET com efeito colateral

Problemático:

```http
GET /orders/10/cancel
```

`GET` deve ser seguro.

Isso significa:

```text
não alterar o estado do recurso
como objetivo da operação.
```

Logs, métricas e cache técnico podem ocorrer.

Mas o resultado de negócio não deve ser alterado por uma leitura.

Browsers, crawlers e proxies podem repetir `GET`.

---

### Erro 4 — POST para tudo

Problemático:

```text
POST para consultar;

POST para atualizar;

POST para excluir;

POST para listar.
```

Isso elimina parte da semântica HTTP.

Use:

```text
GET:
consultar.

POST:
criar ou executar operação não idempotente.

PUT:
substituir representação.

PATCH:
alterar parcialmente.

DELETE:
remover.
```

Não escolha o método apenas porque o body é conveniente.

---

### Erro 5 — Confundir PUT e PATCH

`PUT` representa substituição completa no target URI.

`PATCH` representa modificação parcial.

Erro comum:

```http
PUT /users/10

{
  "name": "Novo nome"
}
```

Se o recurso possui dez campos e apenas um é enviado, isso se comporta como patch, mesmo que o método seja `PUT`.

A API precisa definir:

- campos omitidos são mantidos?
- ficam nulos?
- recebem default?
- request precisa ser completa?

O contrato precisa ser explícito.

---

### Erro 6 — Status 200 para tudo

Exemplos ruins:

```http
HTTP 200

{
  "success": false,
  "error": "not found"
}
```

Ou:

```http
HTTP 200

{
  "status": 500
}
```

O status HTTP faz parte do contrato.

Use:

```text
200:
leitura ou alteração com body.

201:
recurso criado.

202:
processamento aceito.

204:
sucesso sem body.

400:
request inválida.

404:
recurso inexistente.

409:
conflito.

415:
media type inválido.

429:
limite excedido.

503:
dependência temporariamente indisponível.
```

---

### Erro 7 — 500 para erro do cliente

Se o cliente envia:

- JSON inválido;
- campo obrigatório ausente;
- media type incorreto;
- ID malformado;
- valor fora do limite;

a response não deveria ser um `500` genérico.

`500` indica falha inesperada do servidor.

Erros previsíveis precisam de mapping explícito.

---

### Erro 8 — Body em 204

`204 No Content` não deve conter conteúdo na response.

Erro:

```http
HTTP 204

{
  "deleted": true
}
```

Escolha:

```text
204 sem body;
```

ou:

```text
200 com body.
```

Não misture as duas semânticas.

---

### Erro 9 — Criação sem Location

Quando um recurso é criado e possui URI identificável, `201 Created` deveria incluir:

```http
Location: /api/v2/runtime/managed-messages/123
```

Isso facilita o encadeamento.

A collection da aula 401 já utiliza esse header.

O body pode existir ou não conforme o contrato.

---

### Erro 10 — Entity JPA como response

Retornar entity diretamente causa riscos:

- lazy loading;
- ciclo de serialização;
- campos internos;
- alteração involuntária do contrato;
- exposição de relacionamentos;
- acoplamento ao schema;
- dificuldade de versionamento.

Preferível:

```text
entity:
persistência.

response DTO:
contrato HTTP.
```

A v2 pode evoluir sem obrigar a entity a mudar.

---

### Erro 11 — Request sem limites

Campos textuais ilimitados geram riscos:

- consumo de memória;
- dados inválidos;
- payload excessivo;
- log excessivo;
- problemas de banco;
- abuso.

Use:

```text
@NotBlank;

@Size;

allowlist;

max file size;

max request size.
```

Validation da web não elimina validação da aplicação quando o mesmo caso de uso possui outras entradas.

---

### Erro 12 — Formatos de erro diferentes

Exemplo:

```text
validation:
Map.

not found:
String.

rate limit:
JSON customizado.

SMTP:
HTML.

500:
stack trace.
```

Isso obriga consumidores a implementar vários parsers.

Problem Details oferece uma estrutura comum.

Campos adicionais podem incluir:

```text
code;

violations;

correlationId.
```

Mantenha coerência.

---

### Erro 13 — Vazamento de stack trace

Nunca retorne:

```text
java.lang.NullPointerException;

org.postgresql.util.PSQLException;

caminho de arquivo;

classe interna;

linha do código;

SQL.
```

Esses detalhes:

- confundem consumidor;
- expõem implementação;
- podem revelar dados;
- aumentam superfície de ataque.

O log interno pode registrar a exception.

A response pública usa mensagem controlada.

---

### Erro 14 — Mensagem de infraestrutura como contrato

Exemplo ruim:

```json
{
  "detail": "Connection refused: localhost/127.0.0.1:6379"
}
```

A response deveria informar algo como:

```text
serviço temporariamente indisponível.
```

Host, porta e driver pertencem ao diagnóstico interno.

---

### Erro 15 — Paginação inconsistente

Problemas:

- uma rota usa `page` e `size`;
- outra usa `offset` e `limit`;
- uma começa em zero;
- outra começa em um;
- uma retorna metadata;
- outra retorna apenas array;
- tamanho sem máximo;
- ordenação não documentada.

Defina uma convenção.

Exemplo:

```text
page:
zero-based.

size:
default e máximo.

sort:
campo e direção.

response:
content e metadata.
```

---

### Erro 16 — IDs sem contexto

Uma variável chamada:

```text
id.
```

pode representar qualquer coisa.

Em URI, o contexto já ajuda:

```text
/managed-messages/{managedMessageId}.
```

Em código e collection, nomes específicos reduzem erros:

```text
managedMessageId;

fileId;

notificationId.
```

---

### Erro 17 — Ignorar idempotência

Uma operação idempotente pode ser repetida e produzir o mesmo efeito final.

Exemplos:

```text
GET:
idempotente.

PUT:
idempotente por semântica.

DELETE:
idempotente no efeito final.

POST:
normalmente não idempotente.
```

Isso não significa que toda repetição devolve o mesmo status.

Exemplo:

```text
primeiro DELETE:
204.

segundo DELETE:
404.
```

O efeito final continua:

```text
recurso ausente.
```

Para operações críticas de criação ou pagamento, uma chave de idempotência pode ser necessária.

Ela não será implementada nesta aula.

---

### Erro 18 — Versionamento inconsistente

Erros:

- v1 e v2 misturadas;
- endpoint novo apenas em v1;
- response muda sem versão;
- v1 depreciada sem aviso;
- versão no path e header simultaneamente sem necessidade;
- documentação aponta para versão errada.

A baseline do projeto usa:

```text
/api/v1;

/api/v2.
```

A v1 está depreciada.

Novas capacidades ficam na v2.

---

### Erro 19 — Contrato divergente

Pode ocorrer divergência entre:

- controller;
- OpenAPI;
- collection;
- docs;
- testes.

Exemplo:

```text
controller retorna 201;

OpenAPI documenta 200;

collection espera 202;

README diz 204.
```

Uma API profissional precisa alinhar essas fontes.

A revisão desta aula comparará todas.

---

### Erro 20 — Endpoint acoplado à infraestrutura

Exemplo ruim:

```http
POST /redis/cache/clear
```

quando o consumidor quer:

```text
atualizar um recurso.
```

O contrato de negócio não deve expor a tecnologia interna sem necessidade operacional explícita.

Redis pode ser trocado.

A API de negócio deveria continuar estável.

---

## Mão na massa guiada

### 1. Criar o relatório

Arquivo:

```text
docs/api/REST_API_REVIEW.md
```

Estrutura inicial:

```markdown
# Revisão REST da API

## Objetivo
## Escopo
## Fontes analisadas
## Convenções
## Matriz de revisão
## Achados
## Ações
## Evidências
## Conclusão
```

---

### 2. Definir status da auditoria

Adicione:

```markdown
| Status | Significado |
|---|---|
| OK | Convenção atendida |
| ATENÇÃO | Risco ou decisão pendente |
| CORRIGIR | Inconsistência confirmada |
| NÃO SE APLICA | Fora do escopo atual |
```

---

### 3. Mapear endpoints

Use OpenAPI e collection.

Agrupe:

```text
Managed Messages;

Arquivos;

Notificações;

Operação.
```

Crie uma tabela:

```markdown
| Método | Path | Status principal | Recurso |
|---|---|---:|---|
| POST | `/api/v2/runtime/managed-messages` | 201 | Managed message |
| GET | `/api/v2/runtime/managed-messages/{id}` | 200 | Managed message |
| DELETE | `/api/v2/runtime/managed-messages/{id}` | 204 | Managed message |
```

Use os dados reais.

---

### 4. Auditar URIs

Checklist:

```text
substantivos;

plural;

kebab-case;

sem verbo redundante;

sem extensão de arquivo;

versão consistente;

recurso claro.
```

Registre evidência.

Exemplo:

```text
/api/v2/runtime/managed-messages:
OK.
```

---

### 5. Auditar métodos

Para cada endpoint, responda:

- método corresponde à intenção?
- GET altera estado?
- DELETE remove?
- POST cria ou submete?
- operação é idempotente?
- retry é seguro?

Registre:

```text
POST de notificação:
não idempotente;
pode gerar múltiplos e-mails.
```

Isso não é necessariamente defeito.

É uma característica que precisa ser conhecida.

---

### 6. Auditar status

Compare:

```text
controller;

OpenAPI;

tests;

collection;

docs.
```

Crie uma matriz:

```markdown
| Cenário | Esperado | Código | OpenAPI | Collection | Status |
|---|---:|---:|---:|---:|---|
| Create managed message | 201 | 201 | 201 | 201 | OK |
| Delete managed message | 204 | 204 | 204 | 204 | OK |
| Email submitted | 202 | 202 | 202 | 202 | OK |
```

Não marque `OK` sem evidência.

---

### 7. Auditar Location

Execute a criação.

Confirme:

```text
201;

Location;

ID válido.
```

Se o header existir, marque `OK`.

Se não existir:

```text
CORRIGIR.
```

A collection depende desse contrato.

---

### 8. Auditar 204

Execute o delete.

Confirme:

```text
status 204;

body vazio.
```

Se houver conteúdo, registre correção.

---

### 9. Auditar DTOs

Abra controllers e responses.

Confirme:

```text
entities não são retornadas diretamente;

DTO v1 e v2 são separados;

campo v2 é message;

campo interno value não vaza.
```

Crie evidência com nomes de classes.

Não copie o código inteiro.

---

### 10. Auditar validation

Para cada request:

```text
required;

blank;

size;

format;

allowlist;

file size.
```

Execute cenários inválidos da collection.

Confirme `400`.

Registre limites:

```text
subject:
120.

message de e-mail:
2000.

upload:
5 MB.
```

---

### 11. Auditar Problem Details

Execute:

- JSON inválido;
- validation;
- not found;
- rate limit;
- SMTP indisponível.

Compare:

```text
content type;

status;

title;

detail;

code;

violations;

correlation ID.
```

Registre divergências.

---

### 12. Auditar vazamento

Procure responses contendo:

```text
java.lang;

org.springframework;

org.postgresql;

redis;

localhost;

stackTrace;

SQLException.
```

PowerShell:

```powershell
Select-String `
  -Path ".\target\surefire-reports\*" `
  -Pattern `
    "java\.lang|SQLException|stackTrace" `
  -ErrorAction SilentlyContinue
```

Também revise examples da collection.

---

### 13. Auditar paginação

Confirme:

```text
nomes de parâmetros;

base zero ou um;

default;

máximo;

ordenação;

metadata.
```

Se o máximo de `size` não estiver definido, registre:

```text
ATENÇÃO.
```

Não invente um limite durante a auditoria.

Abra uma ação para decisão.

---

### 14. Auditar versionamento

Confirme:

```text
v1 depreciada;

v2 atual;

upload apenas v2;

notificação apenas v2;

OpenAPI separa operações;

docs não recomendam v1.
```

Verifique se headers de depreciação existem quando previstos pelo projeto.

---

### 15. Auditar idempotência

Crie tabela:

```markdown
| Operação | Idempotente | Observação |
|---|---|---|
| GET by ID | Sim | Leitura |
| DELETE | Sim no efeito final | Segunda chamada pode retornar 404 |
| POST create | Não | Pode criar novo recurso |
| POST notification | Não | Pode enviar novamente |
```

Registre riscos de retry.

---

### 16. Auditar headers

Confirme:

```text
Content-Type;

Location;

Retry-After;

X-Correlation-Id;

X-Content-Type-Options;

Content-Disposition.
```

Cada header precisa ter finalidade.

Não adicione headers apenas por moda.

---

### 17. Auditar cache e rate limiting

Confirme que:

```text
cache não muda contrato público;

Redis não aparece em response;

429 possui Retry-After;

X-Client-Id não é autenticação;

falha Redis segue policy documentada.
```

---

### 18. Auditar upload e download

Confirme:

```text
filename original não vira path físico;

UUID físico;

normalização;

allowlist;

limite;

Content-Disposition;

nosniff;

404 controlado.
```

Marque como risco:

```text
sem antivírus;

storage local;

sem range request.
```

Esses itens podem ser limitações, não erros atuais.

---

### 19. Auditar notificação

Confirme:

```text
destinatário não vem da request;

from configurado;

status SUBMITTED;

202;

SMTP não vaza;

sem garantia de entrega;

feature por profile.
```

Marque:

```text
sem outbox;

sem retry durável.
```

Como limitações conhecidas.

---

### 20. Auditar observabilidade

Confirme:

```text
health sem detalhes;

management no loopback;

liveness e readiness separadas;

correlation ID;

logs sem body sensível.
```

Não confunda endpoint operacional com endpoint de negócio.

---

### 21. Criar achados

Cada achado deve possuir:

```text
ID;

categoria;

severidade;

evidência;

impacto;

ação;

responsável;

status.
```

Exemplo:

```markdown
### REST-001 — Tamanho máximo da paginação

- Categoria: Paginação
- Severidade: Média
- Status: ATENÇÃO
- Evidência: parâmetro `size` sem máximo documentado
- Impacto: responses grandes e consumo excessivo
- Ação: definir máximo e adicionar teste
```

Não crie achados falsos.

---

### 22. Criar teste de regressão

Escolha um achado real e pequeno.

Exemplos adequados:

- delete não devolve body;
- create devolve Location;
- Problem Details não contém stack trace;
- v2 não expõe `value`;
- 429 possui `Retry-After`.

Adicione o teste no nível correto.

Não crie uma classe genérica com centenas de assertions.

---

### 23. Atualizar OpenAPI quando necessário

Se um status ou header real não estiver documentado:

```text
corrija a especificação.
```

Não altere o código apenas para combinar com uma documentação incorreta.

Primeiro decida o contrato correto.

---

### 24. Atualizar collection quando necessário

Se a collection espera status incorreto:

```text
corrija a assertion.
```

Se o comportamento da API está errado:

```text
corrija a API;
mantenha a expectation correta.
```

---

### 25. Atualizar documentação

Adicione em:

```text
docs/api/README.md
```

somente decisões estáveis.

O relatório de auditoria pode manter:

- pendências;
- riscos;
- ações futuras.

---

### 26. Executar testes

```powershell
.\mvnw.cmd test
```

Quando houver integração:

```powershell
docker info

.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePostgreSqlIT `
  test
```

---

### 27. Executar collection

Execute o runner principal.

Confirme:

```text
zero falhas;

IDs encadeados;

erros no formato esperado.
```

---

### 28. Revisar conclusão

A conclusão precisa informar:

```text
quantos itens OK;

quantos ATENÇÃO;

quantos CORRIGIR;

principais riscos;

ações imediatas;

ações futuras.
```

Não use percentual para parecer preciso quando a amostra é incompleta.

---

## Entendendo o que foi feito

### A API foi revisada por contrato

A análise não ficou limitada ao código.

### Comportamentos corretos foram registrados

Isso evita regressão silenciosa.

### Riscos foram separados de defeitos

Storage local pode ser uma limitação aceita.

### As fontes foram comparadas

Código, OpenAPI, tests, collection e docs precisam concordar.

### O relatório criou rastreabilidade

Cada achado possui evidência e ação.

### Correções ficaram pequenas

A auditoria não virou um refactor indiscriminado.

---

## Erros comuns importantes

### Auditar apenas o happy path

Erros fazem parte do contrato.

### Marcar tudo como problema

Limitações aceitas não são bugs automaticamente.

### Corrigir sem teste

A regressão pode voltar.

### Usar opinião sem evidência

Cada achado precisa apontar para comportamento real.

### Alterar contrato silenciosamente

Consumidores podem quebrar.

### Confundir REST com estética

O objetivo é previsibilidade, não preferência pessoal.

### Exigir perfeição acadêmica

Decisões precisam considerar contexto e custo.

### Criar relatório sem ação

Achados sem responsável e próximo passo ficam esquecidos.

### Duplicar documentação

O relatório deve linkar fontes.

### Transformar auditoria em checklist de produção

A aula 404 tratará esse escopo.

---

## Comandos úteis

### Executar testes

```powershell
.\mvnw.cmd test
```

### Consultar OpenAPI

```powershell
Invoke-RestMethod `
  "http://localhost:8081/v3/api-docs"
```

### Ver headers de criação

```powershell
Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages" `
  -ContentType "application/json" `
  -Headers @{
    "X-Client-Id" = "rest-review"
  } `
  -Body '{"message":"Review","description":"Aula 403"}'
```

### Procurar stack trace em examples

```powershell
Select-String `
  -Path "api-clients/postman/*.json" `
  -Pattern `
    "java\.lang|SQLException|stackTrace" `
  -CaseSensitive:$false
```

### Revisar documentação

```powershell
git diff `
  -- `
  "docs/api"
```

---

## Exercício guiado

### Parte 1 — Mapa

Liste endpoints e status principais.

### Parte 2 — Semântica

Revise URI, método e idempotência.

### Parte 3 — Representação

Revise DTOs, campos e versionamento.

### Parte 4 — Falhas

Revise validation, Problem Details e vazamento.

### Parte 5 — Operação

Revise headers, rate limit, arquivos e observabilidade.

### Parte 6 — Evidência

Execute testes e collection.

### Parte 7 — Achado

Registre ao menos um achado real.

### Parte 8 — Correção

Faça uma correção pequena e adicione teste.

### Parte 9 — Conclusão

Classifique OK, ATENÇÃO e CORRIGIR.

### Parte 10 — Registrar decisão

Anote:

```text
URI com substantivos;

plural;

kebab-case;

método coerente;

status exato;

201 com Location;

204 sem body;

DTO separado de entity;

validation com limites;

Problem Details consistente;

sem stack trace;

paginação documentada;

idempotência analisada;

v1 depreciada;

v2 atual;

Redis invisível ao contrato;

headers revisados;

OpenAPI, tests, collection e docs alinhados.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 402 foi preservada;
- REST foi diferenciado de JSON por HTTP;
- relatório de revisão foi criado;
- status de auditoria foram definidos;
- fontes analisadas foram listadas;
- endpoints foram mapeados;
- URIs foram revisadas;
- substantivos foram preferidos;
- plural foi revisado;
- kebab-case foi revisado;
- verbos redundantes foram identificados;
- métodos HTTP foram revisados;
- GET seguro foi explicado;
- POST para tudo foi rejeitado;
- PUT e PATCH foram diferenciados;
- status 200 genérico foi rejeitado;
- 500 para erro de cliente foi rejeitado;
- 201 foi revisado;
- Location foi revisado;
- 202 foi revisado;
- 204 sem body foi revisado;
- 400 foi revisado;
- 404 foi revisado;
- 409 foi discutido;
- 415 foi revisado;
- 429 foi revisado;
- 503 foi revisado;
- DTO foi separado de entity;
- v2 não expõe campo interno;
- validation foi revisada;
- limites foram revisados;
- upload limit foi revisado;
- formatos de erro foram comparados;
- Problem Details foi revisado;
- stack trace pública foi rejeitada;
- mensagem de infraestrutura foi rejeitada;
- paginação foi revisada;
- base da página foi verificada;
- tamanho máximo foi verificado ou registrado;
- IDs específicos foram usados;
- idempotência foi analisada;
- retry foi discutido;
- versionamento foi revisado;
- v1 depreciada foi confirmada;
- novas features em v2 foram confirmadas;
- contrato divergente foi investigado;
- OpenAPI foi comparado;
- collection foi comparada;
- docs foram comparadas;
- testes foram comparados;
- acoplamento de infraestrutura foi rejeitado;
- cache não mudou contrato;
- Redis não vazou;
- Retry-After foi revisado;
- X-Client-Id não foi chamado de autenticação;
- upload foi auditado;
- notificação foi auditada;
- observabilidade foi auditada;
- achados possuem evidência;
- achados possuem impacto;
- achados possuem ação;
- riscos foram separados de defeitos;
- ao menos um teste de regressão foi criado;
- correção pequena foi aplicada quando necessária;
- testes foram executados;
- collection foi executada;
- conclusão foi registrada;
- número de pendências foi informado;
- refactor indiscriminado foi evitado;
- Spring Security não foi antecipado;
- API gateway não foi antecipado;
- checklist de produção não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 404 está correta.

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
git commit -m "docs(m14): revisar erros comuns da API REST"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- credentials;
- responses com dados sensíveis;
- logs;
- reports;
- screenshots;
- arquivos temporários;
- achados inventados;
- decisões não aprovadas.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você deixou de olhar a API apenas como implementação.

A revisão passou por:

```text
URI;

método;

status;

representação;

validation;

erros;

paginação;

idempotência;

versionamento;

headers;

infraestrutura;

documentação.
```

Você comprovou que uma API profissional precisa manter alinhados:

```text
código;

OpenAPI;

testes;

collection;

documentação.
```

A decisão central foi:

```text
consistência é um requisito;

status HTTP,
métodos,
URIs e erros
fazem parte do contrato;

mudanças precisam de evidência,
teste e decisão explícita.
```

A próxima aula será:

```text
404 - M14.49 - Checklist de produção inicial
```

Nela, os conhecimentos do módulo serão consolidados em uma revisão de prontidão.

O checklist tratará:

- build;
- configuração;
- banco;
- migrations;
- segurança;
- observabilidade;
- health;
- logs;
- testes;
- documentação;
- containers;
- rollback;
- operação;
- riscos conhecidos.

Esse checklist não foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei os endpoints.
- [ ] Revisei métodos, URIs e status.
- [ ] Revisei DTOs, validation e erros.
- [ ] Comparei código, OpenAPI, testes, collection e docs.
- [ ] Registrei achados com evidência e ação.

---

## Troubleshooting adicional

### OpenAPI e controller divergem

Defina o contrato correto.

Depois corrija a fonte errada e adicione teste.

### Collection passa, mas status está incorreto

A collection pode estar reproduzindo um erro antigo.

Não use teste verde como única prova de design correto.

### Problem Details muda entre cenários

Revise handlers específicos e fallbacks.

Padronize campos públicos.

### Auditoria encontra muitos riscos

Priorize:

```text
quebra de contrato;

vazamento;

status incorreto;

validação ausente;

inconsistência de versão.
```

### Não há achado real

Registre itens `OK` com evidência.

Não invente defeitos.

### Correção quebra consumidor

A mudança pode ser incompatível.

Use versionamento, depreciação ou transição.

### Paginação não possui máximo

Registre `ATENÇÃO`.

Defina política antes de alterar.

---

## Observações para evolução

Uma revisão REST futura pode incluir:

- ETag;
- If-Match;
- optimistic concurrency;
- idempotency key;
- caching HTTP;
- content negotiation;
- locale;
- bulk operations;
- async jobs;
- webhooks;
- partial responses;
- cursor pagination;
- API gateway;
- schema registry;
- breaking change detection.

Esses assuntos precisam ser adicionados quando o domínio justificar.

Não transforme todas as APIs em uma coleção de features protocolares sem necessidade.

O próximo passo será uma revisão inicial de prontidão para produção.

---

## Perguntas de revisão

1. REST é apenas JSON?
2. Por que evitar verbos na URI?
3. GET pode alterar negócio?
4. Quando usar POST?
5. Qual diferença entre PUT e PATCH?
6. Por que 200 para erro é ruim?
7. Quando usar 201?
8. O que acompanha 201?
9. 204 pode ter body?
10. Entity deve ser response?
11. Por que limitar payload?
12. Qual formato de erro foi adotado?
13. Stack trace pode ser público?
14. O que revisar na paginação?
15. DELETE é idempotente?
16. POST de e-mail é idempotente?
17. Qual versão recebe features novas?
18. Redis deve aparecer no contrato?
19. Quais fontes precisam concordar?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Não.
2. O método já expressa a ação.
3. Não como objetivo.
4. Criação ou operação não idempotente.
5. Substituição completa versus alteração parcial.
6. Oculta semântica do protocolo.
7. Quando recurso é criado.
8. Header Location.
9. Não.
10. Não diretamente.
11. Segurança, memória e consistência.
12. Problem Details.
13. Não.
14. Parâmetros, base, limites, ordenação e metadata.
15. Sim no efeito final.
16. Não.
17. v2.
18. Não.
19. Código, OpenAPI, testes, collection e docs.
20. Checklist de produção inicial.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 403 - M14.48 - Erros comuns em API REST

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei REST de JSON por HTTP.
- Criei `docs/api/REST_API_REVIEW.md`.
- Defini status OK, ATENÇÃO, CORRIGIR e NÃO SE APLICA.
- Mapeei endpoints e status.
- Revisei URIs com substantivos, plural e kebab-case.
- Rejeitei verbos redundantes na URI.
- Revisei métodos HTTP.
- Confirmei que GET não deve alterar estado de negócio.
- Diferenciei POST, PUT, PATCH e DELETE.
- Rejeitei status 200 para qualquer situação.
- Revisei 201, 202, 204, 400, 404, 415, 429 e 503.
- Confirmei Location após criação.
- Confirmei 204 sem body.
- Revisei separação entre entity e DTO.
- Confirmei o campo `message` na v2.
- Revisei validation e limites.
- Revisei Problem Details.
- Rejeitei stack trace pública.
- Rejeitei mensagens de infraestrutura.
- Revisei paginação.
- Revisei IDs específicos.
- Analisei idempotência e retry.
- Revisei versionamento v1 e v2.
- Confirmei depreciação da v1.
- Comparei controller, OpenAPI, testes, collection e docs.
- Confirmei que Redis não faz parte do contrato público.
- Revisei rate limiting, uploads e notificação.
- Registrei achados com evidência, impacto e ação.
- Separei riscos de defeitos.
- Criei teste de regressão para um achado real.
- Evitei refactor indiscriminado.
- Não antecipei Spring Security ou checklist de produção.
- Próxima aula: Checklist de produção inicial.
```

---

## Referência técnica curta

- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

Regra final:

```text
uma API REST previsível precisa representar recursos com URIs consistentes, usar métodos e status conforme a semântica HTTP, separar DTOs de persistência, validar entradas, retornar erros uniformes, evitar vazamentos e manter alinhados código, OpenAPI, testes, collection e documentação; nesta baseline, a revisão técnica registra cada convenção com evidência, classifica riscos e cria correções pequenas protegidas por testes.
```
