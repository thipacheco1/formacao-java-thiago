# 017 — M0.17 — Postman, Insomnia e HTTP Básico

## Complemento operacional — instalar cliente HTTP e criar primeira collection

> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.

Esta aula já ensina HTTP básico, request, response, métodos, headers, body, JSON, status code, collection e environment. Este complemento deixa explícito como preparar a ferramenta.

### Escolha da ferramenta

Instale uma das duas:

```text
Postman;
Insomnia.
```

Não é obrigatório instalar as duas.

O importante é dominar o conceito HTTP.

### Instalação

Fluxo geral:

```text
1. Baixar a ferramenta pelo site oficial.
2. Instalar no Windows.
3. Abrir a ferramenta.
4. Criar conta se for necessário para o uso escolhido.
5. Criar workspace/projeto local.
6. Criar collection de estudo.
7. Criar environment local.
```

### Environment inicial

Crie uma variável:

```text
base_url=http://localhost:8080
```

Ela será usada futuramente assim:

```text
{base_url}/clientes
```

### Primeira request preparada

Mesmo antes de ter API local, deixe registrado o modelo:

```text
Método: GET
URL: {base_url}/health
Headers:
Accept: application/json
Body: vazio
```

### Primeira request POST preparada

```text
Método: POST
URL: {base_url}/clientes
Headers:
Content-Type: application/json
Accept: application/json
Body:
```

```json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

### Critério operacional atualizado

```markdown
## Cliente HTTP validado

- [ ] Postman ou Insomnia instalado.
- [ ] Workspace/projeto local criado.
- [ ] Collection de estudo criada.
- [ ] Environment local criado.
- [ ] Variável `base_url` criada.
- [ ] Request GET modelo criada.
- [ ] Request POST com JSON modelo criada.
- [ ] Headers `Content-Type` e `Accept` entendidos.
- [ ] Sei identificar status code.
- [ ] Sei diferenciar erro de conexão de erro HTTP.
- [ ] Nenhum token real foi salvo em collection compartilhável.
```

---

## Onde estamos na formação

Estamos seguindo a ordem oficial do Módulo 0.

Até aqui, a preparação já cobriu:

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
M0.15 — Maven instalação e validação inicial;
M0.16 — PostgreSQL e DBeaver preparação.
```

Agora vamos preparar ferramentas e conceitos para testar APIs.

Ainda não estamos criando uma API Java com Spring Boot.

Ainda não estamos estudando REST profundamente.

Ainda não estamos automatizando testes de API.

Esta aula é preparação.

O objetivo é que, quando a primeira API aparecer, a pessoa já saiba o que é:

```text
request;
response;
URL;
método HTTP;
header;
body;
JSON;
status code;
query parameter;
path parameter;
Postman;
Insomnia;
collection;
environment;
erro de conexão;
erro de autenticação;
erro de contrato.
```

---

## Hoje a aula é sobre aprender a conversar com APIs

Backend moderno conversa muito por HTTP.

Uma aplicação backend pode expor endpoints para:

```text
criar cliente;
consultar pedido;
atualizar atividade;
cancelar ordem de serviço;
registrar pagamento;
buscar produto;
enviar mensagem;
validar autenticação;
consultar status.
```

Esses endpoints normalmente são chamados por:

```text
frontend;
aplicativo mobile;
outro backend;
fila ou integração;
ferramenta de teste;
script automatizado;
pipeline.
```

Postman e Insomnia são ferramentas que permitem montar requisições HTTP manualmente, enviar para uma API e analisar a resposta.

Elas são úteis para:

```text
explorar APIs;
testar endpoints;
validar payloads;
investigar erros;
documentar exemplos;
simular integrações;
apoiar desenvolvimento;
apoiar QA;
apoiar troubleshooting.
```

Nesta aula, vamos aprender o vocabulário e o fluxo básico.

---

## O que é HTTP

HTTP é um protocolo de comunicação usado na web.

Quando um navegador acessa um site, usa HTTP ou HTTPS.

Quando um frontend chama uma API backend, geralmente usa HTTP ou HTTPS.

Quando uma ferramenta como Postman chama um endpoint, também usa HTTP ou HTTPS.

Pense assim:

```text
HTTP é a linguagem de comunicação entre cliente e servidor na web.
```

Exemplo:

```text
Cliente envia uma requisição.
Servidor processa.
Servidor devolve uma resposta.
```

Fluxo:

```text
request -> server -> response
```

Em português:

```text
requisição -> servidor -> resposta
```

---

## Cliente e servidor

Em HTTP, quem faz a chamada é o cliente.

Quem recebe e responde é o servidor.

Exemplos de cliente:

```text
navegador;
frontend;
Postman;
Insomnia;
aplicativo mobile;
outro backend;
script;
teste automatizado.
```

Exemplos de servidor:

```text
API Java;
API Node;
API Python;
servidor web;
gateway;
serviço de autenticação;
serviço corporativo.
```

Postman e Insomnia atuam como clientes HTTP.

Eles permitem montar a chamada sem precisar escrever código.

---

## URL

URL é o endereço chamado.

Exemplo:

```text
https://api.exemplo.com/clientes
```

Em ambiente local, mais tarde podemos ter algo como:

```text
http://localhost:8080/clientes
```

Partes importantes:

```text
http ou https -> protocolo;
localhost -> host;
8080 -> porta;
clientes -> caminho/recurso.
```

Exemplo local:

```text
http://localhost:8080/api/pedidos/10
```

Interpretação:

```text
protocolo: http
host: localhost
porta: 8080
caminho: /api/pedidos/10
```

Entender URL é essencial para testar API.

---

## HTTP versus HTTPS

`HTTP` é o protocolo sem camada de criptografia.

`HTTPS` usa criptografia via TLS.

Em produção, APIs devem usar HTTPS.

Em ambiente local de estudo, é comum usar HTTP:

```text
http://localhost:8080
```

Isso é aceitável para laboratório local.

Mas em ambiente real, cuidado:

```text
não trafegar credenciais em HTTP;
não chamar API sensível sem HTTPS;
não expor token em URL;
não compartilhar headers sensíveis.
```

Segurança começa no básico.

---

## Métodos HTTP

Método HTTP indica a intenção da requisição.

Principais métodos:

```text
GET;
POST;
PUT;
PATCH;
DELETE.
```

Cada um tem uso típico.

### GET

Usado para consultar.

Exemplos:

```text
buscar cliente;
listar produtos;
consultar pedido por ID;
consultar status.
```

Exemplo:

```http
GET /clientes/10
```

### POST

Usado para criar ou disparar uma operação.

Exemplos:

```text
criar cliente;
criar pedido;
enviar mensagem;
abrir solicitação.
```

Exemplo:

```http
POST /clientes
```

### PUT

Usado para atualizar um recurso, geralmente substituição ou atualização mais completa.

Exemplo:

```http
PUT /clientes/10
```

### PATCH

Usado para atualização parcial.

Exemplo:

```http
PATCH /clientes/10/status
```

### DELETE

Usado para remover ou solicitar exclusão.

Exemplo:

```http
DELETE /clientes/10
```

Na prática, times podem ter variações, mas essa é a base.

---

## Endpoint

Endpoint é um ponto de acesso de uma API.

Exemplo:

```text
GET /clientes
POST /clientes
GET /clientes/{id}
PUT /clientes/{id}
DELETE /clientes/{id}
```

Endpoint combina:

```text
método HTTP;
caminho;
regras;
entrada;
saída;
status esperado.
```

Exemplo completo:

```text
POST http://localhost:8080/clientes
```

Método:

```text
POST
```

URL:

```text
http://localhost:8080/clientes
```

---

## Request

Request é a requisição enviada pelo cliente.

Ela pode conter:

```text
método;
URL;
headers;
query parameters;
path parameters;
body;
cookies;
autenticação.
```

Exemplo conceitual:

```http
POST /clientes
Content-Type: application/json

{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

Essa request diz:

```text
quero criar um cliente;
estou enviando JSON;
o corpo contém nome e email.
```

---

## Response

Response é a resposta enviada pelo servidor.

Ela pode conter:

```text
status code;
headers;
body;
tempo de resposta;
mensagem de erro;
dados retornados.
```

Exemplo:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 10,
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

Essa response diz:

```text
o cliente foi criado;
status 201;
resposta em JSON;
id gerado é 10.
```

---

## Status code

Status code é um número que indica o resultado da requisição.

Principais grupos:

```text
2xx — sucesso;
3xx — redirecionamento;
4xx — erro do cliente;
5xx — erro do servidor.
```

Status comuns:

```text
200 OK;
201 Created;
204 No Content;
400 Bad Request;
401 Unauthorized;
403 Forbidden;
404 Not Found;
409 Conflict;
422 Unprocessable Entity;
500 Internal Server Error.
```

O status code é uma das primeiras coisas que você olha ao testar API.

---

## Status 200 OK

Indica sucesso genérico.

Exemplo:

```text
GET /clientes/10
```

Resposta:

```text
200 OK
```

com dados do cliente.

---

## Status 201 Created

Indica que um recurso foi criado.

Exemplo:

```text
POST /clientes
```

Resposta esperada:

```text
201 Created
```

Isso é muito comum em criação.

---

## Status 204 No Content

Indica sucesso sem corpo de resposta.

Exemplo:

```text
DELETE /clientes/10
```

ou:

```text
PUT /clientes/10
```

dependendo da API.

Resposta:

```text
204 No Content
```

Significa:

```text
operação realizada;
não há body para retornar.
```

---

## Status 400 Bad Request

Indica que a requisição está inválida.

Exemplos:

```text
JSON mal formado;
campo obrigatório ausente;
tipo errado;
formato inválido.
```

Exemplo:

```json
{
  "email": "email-invalido"
}
```

A API pode responder:

```text
400 Bad Request
```

ou outro status de validação, dependendo do padrão.

---

## Status 401 Unauthorized

Indica problema de autenticação.

Exemplos:

```text
token ausente;
token inválido;
credencial inválida;
sessão expirada.
```

Não significa necessariamente que o usuário não tem permissão.

Significa que a autenticação falhou ou não foi fornecida corretamente.

---

## Status 403 Forbidden

Indica que o cliente foi autenticado, mas não tem permissão.

Exemplo:

```text
usuário logado tentando acessar recurso restrito.
```

Diferença prática:

```text
401 -> quem é você?
403 -> sei quem você é, mas você não pode fazer isso.
```

---

## Status 404 Not Found

Indica que o recurso não foi encontrado.

Exemplo:

```text
GET /clientes/999999
```

Se não existe cliente com esse ID, a API pode retornar:

```text
404 Not Found
```

Também pode acontecer se o caminho da URL estiver errado.

---

## Status 409 Conflict

Indica conflito de estado.

Exemplo:

```text
tentar criar usuário com e-mail já cadastrado;
tentar cancelar pedido já concluído;
tentar executar ação incompatível com status atual.
```

É comum em regras de negócio.

---

## Status 422 Unprocessable Entity

Algumas APIs usam 422 para validação semântica.

Exemplo:

```text
JSON bem formado, mas regra de negócio inválida.
```

Nem toda API usa 422.

Algumas usam 400.

O importante é entender o contrato da API.

---

## Status 500 Internal Server Error

Indica erro inesperado no servidor.

Exemplos:

```text
bug;
exceção não tratada;
falha de banco;
erro de integração;
erro de configuração.
```

Ao testar API, 500 geralmente exige investigação no backend.

Mas nem sempre a causa está no código.

Pode ser ambiente, banco, dependência externa ou configuração.

---

## Headers

Headers são metadados da requisição ou resposta.

Exemplos comuns:

```text
Content-Type;
Accept;
Authorization;
User-Agent;
Correlation-Id;
Request-Id.
```

### Content-Type

Indica o formato do corpo enviado.

Exemplo:

```text
Content-Type: application/json
```

Diz:

```text
estou enviando JSON.
```

### Accept

Indica o formato esperado na resposta.

Exemplo:

```text
Accept: application/json
```

Diz:

```text
quero receber JSON.
```

### Authorization

Usado para enviar credenciais ou token.

Exemplo:

```text
Authorization: Bearer TOKEN_EXEMPLO
```

Não compartilhe token real.

Não coloque token real em documentação pública.

---

## Body

Body é o corpo da requisição ou resposta.

Em `POST`, `PUT` e `PATCH`, é comum enviar body.

Exemplo JSON:

```json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

Em `GET`, normalmente não se envia body.

A maioria das APIs espera parâmetros em URL, path ou query.

---

## JSON

JSON é um formato de dados muito usado em APIs.

Exemplo:

```json
{
  "id": 10,
  "nome": "Cliente Exemplo",
  "ativo": true
}
```

Tipos comuns em JSON:

```text
string;
number;
boolean;
object;
array;
null.
```

Exemplo com array:

```json
{
  "pedidoId": 100,
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2
    },
    {
      "produtoId": 2,
      "quantidade": 1
    }
  ]
}
```

Java Backend usa muito JSON para entrada e saída de APIs.

Mais tarde, bibliotecas como Jackson farão a conversão entre JSON e objetos Java.

---

## Query parameter

Query parameters aparecem depois de `?` na URL.

Exemplo:

```text
GET /clientes?status=ativo&page=0&size=20
```

Parâmetros:

```text
status=ativo
page=0
size=20
```

Uso comum:

```text
filtros;
paginação;
ordenação;
buscas.
```

Exemplo:

```text
http://localhost:8080/clientes?nome=ana
```

---

## Path parameter

Path parameter faz parte do caminho da URL.

Exemplo:

```text
GET /clientes/10
```

Aqui, `10` é o ID do cliente.

Em documentação, costuma aparecer como:

```text
GET /clientes/{id}
```

Diferença:

```text
path parameter identifica recurso;
query parameter filtra ou ajusta consulta.
```

Exemplo:

```text
GET /clientes/10/pedidos?status=aberto
```

Path parameters:

```text
clienteId = 10
```

Query parameter:

```text
status=aberto
```

---

## Collection

Postman e Insomnia permitem organizar requisições em coleções.

Collection é um agrupamento de requests.

Exemplo:

```text
Clientes
├── Listar clientes
├── Buscar cliente por ID
├── Criar cliente
├── Atualizar cliente
└── Excluir cliente
```

Isso ajuda a organizar testes manuais.

Em projeto profissional, uma collection pode documentar e facilitar validação de uma API.

Mas precisa ser mantida.

Collection desatualizada confunde.

---

## Environment

Environment guarda variáveis de ambiente da ferramenta.

Exemplos:

```text
base_url=http://localhost:8080
token=TOKEN_EXEMPLO
cliente_id=10
```

Em vez de escrever:

```text
http://localhost:8080/clientes
```

você usa:

```text
{{base_url}}/clientes
```

Vantagens:

```text
trocar local/homologação/produção;
evitar repetir URL;
organizar variáveis;
facilitar testes.
```

Cuidado:

```text
não salve token real em collection compartilhada;
não exporte environment com segredo;
não commite credenciais.
```

---

## Postman ou Insomnia: qual usar?

Para esta formação, qualquer um dos dois serve para o básico.

Ambos permitem:

```text
criar request;
escolher método;
informar URL;
configurar headers;
enviar body;
ver response;
organizar coleções;
usar variáveis.
```

A escolha pode depender de:

```text
preferência pessoal;
padrão do time;
política da empresa;
leveza;
recursos;
integrações.
```

O mais importante não é decorar a interface.

O mais importante é entender HTTP.

Ferramenta muda.

Conceito permanece.

---

## Exemplo mínimo: request pública simples

Para treinar sem criar backend ainda, você pode usar uma API pública de teste ou endpoint local simples quando disponível.

Mas a prática conceitual pode ser descrita assim:

```text
Método: GET
URL: https://exemplo.com/health
Headers: Accept: application/json
Body: vazio
```

Resposta esperada, se fosse uma API de health check:

```json
{
  "status": "UP"
}
```

Status esperado:

```text
200 OK
```

Como esta formação evita depender de serviços externos para o conteúdo central, o mais importante é aprender o formato.

Quando criarmos nossa própria API, usaremos URLs locais.

---

## Exemplo mínimo com endpoint local futuro

Quando tivermos uma API local rodando em `localhost:8080`, uma request simples será:

```text
Método: GET
URL: http://localhost:8080/health
```

Resposta possível:

```json
{
  "status": "UP"
}
```

Status:

```text
200 OK
```

Esse tipo de endpoint é usado para verificar se a aplicação está viva.

Em projetos profissionais, health checks são comuns.

---

## Exemplo de POST com JSON

Request:

```text
Método: POST
URL: http://localhost:8080/clientes
Header: Content-Type: application/json
Body:
```

```json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

Resposta esperada:

```text
201 Created
```

Body possível:

```json
{
  "id": 1,
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

Esse exemplo será muito comum no futuro.

---

## Exemplo de erro de validação

Request inválida:

```json
{
  "nome": "",
  "email": "email-invalido"
}
```

Resposta possível:

```text
400 Bad Request
```

Body possível:

```json
{
  "erro": "Dados inválidos",
  "campos": [
    {
      "campo": "nome",
      "mensagem": "Nome é obrigatório"
    },
    {
      "campo": "email",
      "mensagem": "Email inválido"
    }
  ]
}
```

Esse tipo de resposta será estudado com validação e tratamento de erros.

Por enquanto, entenda:

```text
request inválida deve gerar erro controlado,
não 500 inesperado.
```

---

## Exemplo aplicado ao domínio corporativo

Imagine uma API de ordem de serviço.

Endpoints possíveis:

```text
GET /ordens-servico
GET /ordens-servico/{id}
POST /ordens-servico
PATCH /ordens-servico/{id}/status
POST /ordens-servico/{id}/atividades
```

Request para buscar uma OS:

```text
GET /ordens-servico/100
```

Resposta:

```json
{
  "id": 100,
  "numero": "OS-EXEMPLO-001",
  "status": "ABERTA"
}
```

Request para atualizar status:

```text
PATCH /ordens-servico/100/status
Content-Type: application/json
```

```json
{
  "status": "CONCLUIDA"
}
```

Resposta possível:

```text
204 No Content
```

Isso conecta HTTP com domínio backend real.

---

## Exemplo de collection organizada

Uma collection para ordem de serviço poderia ter:

```text
Ordem de Serviço
├── Health
├── Listar ordens
├── Buscar ordem por ID
├── Criar ordem
├── Atualizar status
├── Criar atividade
└── Consultar atividades
```

Variáveis de environment:

```text
base_url=http://localhost:8080
ordem_servico_id=100
token=TOKEN_EXEMPLO
```

Uso:

```text
{{base_url}}/ordens-servico/{{ordem_servico_id}}
```

Isso evita ficar trocando URL manualmente.

---

## Cuidado com tokens e senhas

Postman e Insomnia podem guardar headers de autenticação.

Exemplo:

```text
Authorization: Bearer ey...
```

Nunca compartilhe token real.

Nunca exporte collection com token real.

Nunca coloque token em Git.

Nunca cole token em documentação.

Para exemplos, use:

```text
TOKEN_EXEMPLO
```

ou:

```text
{{token}}
```

E, no environment compartilhado, deixe vazio ou com placeholder.

Segurança é parte da preparação.

---

## Instalando Postman ou Insomnia

A prática da aula é escolher uma ferramenta.

Pode ser:

```text
Postman;
Insomnia.
```

Instale a versão apropriada para o sistema.

Depois valide:

```text
abrir ferramenta;
criar uma collection;
criar uma request GET;
configurar método e URL;
enviar;
ver status code;
ver body;
salvar request;
criar environment com base_url.
```

Não precisa usar as duas ferramentas obrigatoriamente.

Mas é importante saber que ambas existem.

Em time real, use o padrão adotado pelo time.

---

## Atalhos e ações úteis

As ferramentas podem mudar atalhos conforme versão e sistema, então os atalhos abaixo são referência prática.

### Postman/Insomnia

| Ação | Atalho/Ação | Uso |
|---|---|---|
| Enviar request | `Ctrl + Enter` em muitos ambientes | Enviar a requisição atual |
| Buscar request | Campo de busca da ferramenta | Encontrar request em collection |
| Nova request | Ação `New Request` | Criar chamada nova |
| Duplicar request | Ação `Duplicate` | Criar variação sem começar do zero |
| Formatar JSON | Ação de beautify/format quando disponível | Organizar body JSON |
| Salvar request | `Ctrl + S` em muitos ambientes | Persistir alteração |

### IntelliJ e terminal

| Ação | Atalho | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Rodar Git e comandos locais |
| Project | `Alt + 1` | Navegar em documentação |
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos da IDE |
| Search Everywhere | `Shift Shift` | Buscar arquivos e ações |
| Reformatar | `Ctrl + Alt + L` | Organizar arquivos |
| Commit | `Ctrl + K` | Revisar alterações |
| Push | `Ctrl + Shift + K` | Enviar commits |

Registre atalhos úteis em:

```text
docs/atalhos.md
```

---

## Documentando uma request

Uma request importante deve poder ser documentada.

Exemplo em Markdown:

````markdown
# Criar cliente

## Método e URL

`POST {{base_url}}/clientes`

## Headers

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

## Body

```json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

## Resposta esperada

Status:

```text
201 Created
```

Body:

```json
{
  "id": 1,
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```
````

Isso une Markdown e HTTP.

Documentação técnica começa a ficar prática.

---

## Diagnóstico básico de erro em API

Quando uma request falhar, não chute.

Observe:

```text
URL;
método;
headers;
body;
status code;
response body;
tempo de resposta;
ambiente selecionado;
variáveis;
logs do backend, quando existir.
```

Perguntas:

```text
a URL está correta?
a porta está correta?
a API está rodando?
o método está correto?
o body é JSON válido?
o Content-Type está correto?
o token está presente?
o token expirou?
o ID existe?
a regra de negócio permite essa ação?
a resposta é 4xx ou 5xx?
```

Diagnóstico começa pela camada HTTP.

---

## Erros comuns

### Erro 1 — API não está rodando

Sintoma:

```text
connection refused
```

ou:

```text
could not connect
```

Possível causa:

```text
servidor local não iniciado;
porta errada;
aplicação caiu.
```

---

### Erro 2 — Porta errada

Você chama:

```text
localhost:8080
```

mas a aplicação está em:

```text
localhost:8081
```

Correção:

```text
verificar log da aplicação;
verificar configuração;
ajustar base_url.
```

---

### Erro 3 — Método errado

Você usa:

```text
GET /clientes
```

quando deveria usar:

```text
POST /clientes
```

Resultado possível:

```text
405 Method Not Allowed
```

---

### Erro 4 — Body sem Content-Type

Você envia JSON, mas não informa:

```text
Content-Type: application/json
```

A API pode não interpretar corretamente.

---

### Erro 5 — JSON inválido

Exemplo inválido:

```json
{
  "nome": "Cliente"
  "email": "cliente@exemplo.com"
}
```

Falta vírgula.

Resposta possível:

```text
400 Bad Request
```

---

### Erro 6 — Token ausente

Resposta possível:

```text
401 Unauthorized
```

Correção:

```text
configurar Authorization corretamente;
validar token;
não expor token real.
```

---

### Erro 7 — Sem permissão

Resposta:

```text
403 Forbidden
```

Significa que autenticação pode estar ok, mas a permissão não.

---

### Erro 8 — Recurso inexistente

Resposta:

```text
404 Not Found
```

Causas:

```text
ID não existe;
URL errada;
rota não implementada.
```

---

### Erro 9 — Ambiente errado

Você acha que está chamando local, mas environment aponta para homologação.

Correção:

```text
verificar base_url;
verificar environment selecionado.
```

---

### Erro 10 — Salvar segredo em collection

Não exporte token real.

Não commite collection com credenciais.

Use variáveis e placeholders.

---

## Checklist de preparação

Use este checklist:

```markdown
# Checklist — Postman/Insomnia e HTTP básico

- [ ] Postman ou Insomnia instalado.
- [ ] Ferramenta aberta com sucesso.
- [ ] Collection de estudo criada.
- [ ] Environment local criado.
- [ ] Variável `base_url` criada.
- [ ] Request GET criada.
- [ ] Request POST com JSON criada.
- [ ] Header `Content-Type: application/json` entendido.
- [ ] Status codes 200, 201, 204, 400, 401, 403, 404, 409 e 500 revisados.
- [ ] Diferença entre request e response entendida.
- [ ] Diferença entre path parameter e query parameter entendida.
- [ ] Nenhum token real salvo em documentação ou Git.
- [ ] Diário de bordo atualizado.
```

Checklist concluído significa:

```text
ambiente de teste HTTP preparado.
```

Ainda não significa domínio completo de REST.

---

## Prática recomendada

Crie uma collection chamada:

```text
Formação Java Backend — HTTP Básico
```

Crie um environment:

```text
Local
```

Com variável:

```text
base_url=http://localhost:8080
```

Crie requests conceituais:

```text
GET {{base_url}}/health
GET {{base_url}}/clientes
GET {{base_url}}/clientes/1
POST {{base_url}}/clientes
PUT {{base_url}}/clientes/1
PATCH {{base_url}}/clientes/1/status
DELETE {{base_url}}/clientes/1
```

Mesmo que ainda não exista API rodando, organize a collection.

Quando a API existir, você ajustará e executará.

Crie ou atualize:

```text
docs/http-basico.md
docs/diario-de-bordo.md
docs/atalhos.md
```

Valide Git:

```bash
git status
git diff
git add docs/http-basico.md docs/diario-de-bordo.md docs/atalhos.md
git diff --staged
git commit -m "Documenta preparacao de HTTP e ferramentas de API"
git status
```

---

## Modelo para `docs/http-basico.md`

Use:

````markdown
# HTTP básico

## Conceitos

- Request
- Response
- URL
- Método HTTP
- Header
- Body
- JSON
- Status code
- Query parameter
- Path parameter

## Métodos

| Método | Uso comum |
|---|---|
| `GET` | Consultar |
| `POST` | Criar ou disparar operação |
| `PUT` | Atualizar recurso |
| `PATCH` | Atualizar parcialmente |
| `DELETE` | Remover |

## Status codes

| Status | Significado |
|---|---|
| `200` | OK |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `409` | Conflict |
| `500` | Internal Server Error |

## Exemplo POST

```http
POST {{base_url}}/clientes
Content-Type: application/json
```

```json
{
  "nome": "Cliente Exemplo",
  "email": "cliente@exemplo.com"
}
```

## Cuidados

- Não salvar token real em collection exportada.
- Não commitar credenciais.
- Validar environment antes de enviar request.
- Conferir método, URL, headers e body.
````
Esse arquivo será útil depois.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 017 — Postman/Insomnia e HTTP básico

### O que aprendi
Aprendi que Postman e Insomnia são clientes HTTP usados para montar, enviar e analisar requisições para APIs.

### Conceitos principais
- HTTP
- Request
- Response
- URL
- Endpoint
- GET
- POST
- PUT
- PATCH
- DELETE
- Header
- Body
- JSON
- Status code
- Query parameter
- Path parameter
- Collection
- Environment

### O que pratiquei
Criei uma collection de estudo, um environment local com `base_url` e requests conceituais para endpoints de exemplo.

### Status codes revisados
- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`

### Atalhos úteis
- `Ctrl + Enter` — enviar request, conforme ferramenta/keymap.
- `Ctrl + S` — salvar request, conforme ferramenta/keymap.
- `Alt + F12` — terminal integrado.
- `Ctrl + Shift + A` — buscar ação.
- `Ctrl + K` — Commit.

### Erros que quero evitar
- usar método HTTP errado;
- esquecer `Content-Type: application/json`;
- enviar JSON inválido;
- chamar porta errada;
- usar environment errado;
- salvar token real;
- confundir 401 com 403;
- tratar todo erro como bug do backend sem diagnosticar request.

### Próximo passo
Preparar Docker Desktop e WSL2.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é HTTP;
explicar request e response;
explicar cliente e servidor;
explicar URL;
explicar endpoint;
diferenciar GET, POST, PUT, PATCH e DELETE;
explicar header;
explicar Content-Type;
explicar Authorization sem expor token real;
explicar body;
entender JSON básico;
diferenciar query parameter e path parameter;
entender status codes principais;
instalar Postman ou Insomnia;
criar collection;
criar environment;
usar base_url;
montar request GET;
montar request POST com JSON;
identificar erro de conexão, porta, método, JSON inválido e autenticação;
não salvar segredo em documentação ou Git;
registrar a aula no diário;
usar atalhos úteis quando conveniente.
```

Não precisa ainda dominar REST profundamente.

Não precisa ainda criar API Java.

Não precisa ainda automatizar testes.

O objetivo é preparar a ferramenta e o vocabulário para testar APIs quando elas aparecerem.

---

## Fechamento da aula

Hoje preparamos a base de comunicação HTTP.

Isso será essencial quando começarmos backend web.

Antes de escrever uma API, você precisa saber como uma API é chamada.

Antes de automatizar teste de API, você precisa saber montar uma request manual.

Antes de culpar o backend por um erro, você precisa saber analisar:

```text
método;
URL;
headers;
body;
status code;
response body;
environment;
token;
porta;
servidor.
```

Postman e Insomnia são ferramentas.

HTTP é o conceito.

A ferramenta pode mudar.

O conceito fica.

Na próxima aula, vamos preparar Docker Desktop e WSL2.

Ainda não será arquitetura de containers em profundidade.

Será preparação de ambiente para que, mais tarde, banco, filas, serviços e aplicações possam rodar de forma mais próxima do mundo profissional.
