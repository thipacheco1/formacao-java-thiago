# 364 - M14.09 - HTTP e REST de verdade

## Apresentacao da aula

Na aula 363, a aplicação passou a oferecer seus primeiros contratos HTTP.

Foram criados:

```text
GET /api/v1/runtime/ping;

GET /api/v1/runtime.
```

O primeiro devolve:

```text
status:
200 OK.

content type:
text/plain.

body:
pong.
```

O segundo devolve:

```text
status:
200 OK.

content type:
application/json.

body:
RuntimeMessageResponse.
```

Você também comprovou:

- registro de `@RestController`;
- mappings Spring MVC;
- delegação ao service;
- serialização JSON;
- uso inicial de `ResponseEntity`;
- teste unitário;
- `MockMvc`;
- `@WebMvcTest`;
- Tomcat em porta aleatória;
- chamada HTTP real;
- rota desconhecida com 404.

Agora surge uma diferença importante:

```text
uma aplicacao pode usar HTTP
sem possuir um contrato REST coerente.
```

Adicionar:

```java
@RestController
```

não torna uma API automaticamente RESTful.

Retornar JSON também não.

Um contrato profissional exige decisões conscientes sobre:

- recursos;
- URIs;
- métodos;
- safety;
- idempotência;
- status;
- representações;
- media types;
- headers;
- cache;
- compatibilidade;
- evolução.

Nesta aula, você estudará o protocolo HTTP como contrato de aplicação.

O foco será responder:

```text
o que o cliente realmente envia?

o que o servidor realmente devolve?

qual parte pertence ao protocolo?

qual parte pertence ao dominio?

qual metodo representa a intencao?

a operacao pode alterar estado?

ela pode ser repetida?

qual status comunica o resultado?

qual representacao foi negociada?

a URI identifica recurso ou descreve uma acao?

o contrato pode evoluir sem quebrar consumidores?
```

Os endpoints da aula 363 continuarão sendo a superfície executável.

Nenhum método mutável será implementado.

Você estudará conceitualmente:

```text
GET;

POST;

PUT;

PATCH;

DELETE.
```

Porém, o projeto continuará possuindo somente GETs.

Essa decisão evita antecipar:

- request body;
- desserialização de entrada;
- criação de recursos;
- atualização;
- exclusão;
- validação;
- tratamento de erros;
- persistência.

Esses assuntos possuem aulas próprias.

A aula prática validará:

- request line;
- response status line;
- URI;
- path;
- query;
- headers;
- body;
- `Accept`;
- `Content-Type`;
- `HEAD`;
- `OPTIONS`;
- `Allow`;
- 404;
- 405;
- 406;
- safety;
- idempotência observável;
- metadata dos mappings;
- compatibilidade do contrato.

A aplicação continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Não será criado um novo projeto.

O endpoint:

```text
/api/v1/runtime/ping
```

será reconhecido como um endpoint operacional didático e orientado a ação.

Ele não será usado como exemplo perfeito de recurso de domínio.

O endpoint:

```text
/api/v1/runtime
```

será revisado como uma representação de estado de runtime.

Essa revisão é importante porque REST não exige fingir que toda URI existente é perfeita.

Engenharia profissional também consiste em:

- identificar dívida;
- documentar intenção;
- preservar compatibilidade;
- planejar evolução.

A próxima aula será:

```text
365 - M14.10 - Request body PathVariable RequestParam
```

Por isso, esta aula não implementará:

- `@RequestBody`;
- `@PathVariable`;
- `@RequestParam` na baseline;
- POST;
- PUT;
- PATCH;
- DELETE;
- `ResponseEntity.created`;
- headers customizados de negócio;
- exceptions customizadas;
- Problem Details;
- Bean Validation.

A aula 364 construirá a base semântica antes dessas ferramentas.

---

## Onde estamos na formacao

A progressão do M14 está assim:

```text
356:
Spring Boot visão geral.

357:
Initializr e estrutura.

358:
Main Application e auto configuration.

359:
properties, YAML e profiles.

360:
beans e formas de registro.

361:
constructor injection.

362:
ciclo de vida.

363:
primeiros endpoints.

364:
HTTP e REST de verdade.

365:
request body, path variable e request param.

366:
ResponseEntity, status, headers e body.
```

A aula 363 respondeu:

```text
como registrar e testar endpoints?
```

A aula 364 responderá:

```text
como desenhar e avaliar
um contrato HTTP semanticamente correto?
```

Nesta aula:

```text
mensagem HTTP:
sim.

métodos:
sim.

safety:
sim.

idempotência:
sim.

status:
sim.

media type:
sim.

Accept:
sim.

Content-Type:
sim.

HEAD:
sim.

OPTIONS:
sim.

cache:
conceitual.

REST constraints:
sim.

Richardson:
sim.

REST versus RPC:
sim.

compatibilidade:
sim.

POST real:
não.

request body:
não.

path variable:
não.

response headers customizados:
não.

tratamento global:
não.
```

A principal regra será:

```text
usar HTTP como protocolo,
nao apenas como transporte de chamadas Java.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

O código de produção da aula 363 será preservado.

A maior parte da evolução ocorrerá em testes, documentação e scripts.

Novos testes:

```text
src/test/java/br/com/formacao/backend/web
├── RuntimeApiMappingMetadataIT.java
├── RuntimeApiContentNegotiationWebMvcTest.java
├── RuntimeApiMethodSemanticsWebMvcTest.java
├── RuntimeApiHeadOptionsWebMvcTest.java
├── RuntimeApiStatusSemanticsWebMvcTest.java
├── RuntimeApiIdempotencyObservationIT.java
├── RuntimeApiLiveHttpSemanticsIT.java
├── RuntimeApiCompatibilityTest.java
└── RuntimeApiRestReviewTest.java
```

Documentação externa:

```text
docs
├── http-message-anatomy.md
├── uri-resource-design.md
├── method-semantics.md
├── safety-and-idempotency.md
├── status-code-map.md
├── media-types-content-negotiation.md
├── cache-conditional-requests.md
├── rest-constraints.md
├── richardson-maturity-model.md
├── rest-vs-rpc.md
├── compatibility-versioning.md
└── runtime-api-contract-review.md
```

Scripts:

```text
scripts
├── 39_inspecionar_mensagem_http.ps1
├── 40_testar_accept.ps1
├── 41_testar_metodos_incorretos.ps1
├── 42_testar_head_options.ps1
├── 43_observar_idempotencia.ps1
└── 44_executar_testes_http_rest.ps1
```

Resultados esperados:

```text
GET ping:
200.

GET runtime:
200.

HEAD ping:
200 e body vazio.

OPTIONS runtime:
Allow contém GET, HEAD e OPTIONS.

POST runtime:
405.

PUT runtime:
405.

PATCH runtime:
405.

DELETE runtime:
405.

GET rota inexistente:
404.

Accept application/json no runtime:
200.

Accept text/plain no runtime:
406.

Accept text/plain no ping:
200.

Accept application/json no ping:
406.

Content-Type da resposta JSON:
application/json compatível.

Content-Type da resposta textual:
text/plain compatível.

GET repetido:
não altera estado observável.

body repetido:
pode variar por generatedAt.

mapping:
somente GET.

compatibilidade:
campos públicos preservados.

request body:
zero.
```

---

## Conceito essencial

### HTTP e um protocolo de aplicacao

HTTP define semântica para comunicação entre clientes e servidores.

Ele não é apenas:

```text
abrir uma porta
e enviar JSON.
```

O protocolo define conceitos como:

- método;
- target;
- headers;
- conteúdo;
- status;
- representação;
- cache;
- negociação;
- intermediários.

Quando a API ignora essas semânticas, clientes precisam conhecer regras particulares demais.

---

### Request HTTP

Uma request contém, de forma conceitual:

```text
method;

request target;

protocol version;

headers;

optional content.
```

Exemplo:

```http
GET /api/v1/runtime HTTP/1.1
Host: localhost:8081
Accept: application/json
```

Não existe body nesse exemplo.

A linha inicial expressa:

```text
método:
GET.

target:
/api/v1/runtime.

versão:
HTTP/1.1.
```

---

### Response HTTP

Uma response contém:

```text
protocol version;

status code;

reason phrase quando aplicável;

headers;

optional content.
```

Exemplo conceitual:

```http
HTTP/1.1 200
Content-Type: application/json
Content-Length: 123

{...}
```

O status e os headers são parte do contrato.

O body sozinho não conta toda a história.

---

### URI

URI identifica ou referencia um recurso.

Na API:

```text
/api/v1/runtime
```

possui partes convencionais:

```text
/api:
superfície de API.

/v1:
versão do contrato.

/runtime:
recurso ou coleção lógica.
```

O Spring não exige esses segmentos.

Eles são decisões do projeto.

---

### URL e URI

URL é um tipo de URI que indica localização.

Exemplo completo:

```text
http://localhost:8081/api/v1/runtime.
```

Partes:

```text
scheme:
http.

host:
localhost.

port:
8081.

path:
/api/v1/runtime.
```

Em conversas de API, URI é o termo mais geral para o identificador do recurso.

---

### Path

O path identifica uma hierarquia ou endereço lógico.

Exemplos futuros:

```text
/api/v1/orders;

/api/v1/orders/123;

/api/v1/orders/123/items.
```

O path deve priorizar substantivos.

Evite:

```text
/getOrders;

/createOrder;

/deleteOrder.
```

O método HTTP já comunica a operação.

---

### Query

Query modifica a forma de consulta sem mudar a identidade principal do recurso.

Usos comuns:

- filtro;
- ordenação;
- paginação;
- projeção;
- busca.

Exemplo:

```text
/api/v1/orders?status=OPEN&page=0.
```

A query não será implementada na baseline desta aula.

Ela será ligada ao Java na aula 365.

---

### Fragment

Fragment:

```text
#section
```

é interpretado pelo cliente.

Ele não é enviado ao servidor em uma request HTTP normal.

Não desenhe API esperando receber fragment no controller.

---

### Recurso

Recurso é uma abstração identificável.

Pode representar:

- entidade;
- coleção;
- documento;
- estado;
- processo;
- capacidade;
- resultado.

Recurso não é obrigatoriamente uma linha de banco.

REST modela conceitos do domínio e da aplicação, não tabelas diretamente.

---

### Representacao

O recurso não viaja pela rede como objeto Java.

O cliente recebe uma representação.

Exemplos:

- JSON;
- texto;
- XML;
- imagem;
- arquivo.

O mesmo recurso pode possuir representações diferentes.

Nesta aplicação:

```text
runtime:
JSON.

ping:
texto.
```

---

### REST nao e JSON

Uma API pode retornar JSON e ainda ser:

- RPC;
- orientada a ações;
- inconsistente com métodos;
- sem cache;
- stateful;
- acoplada a comandos.

JSON é um formato de representação.

REST é um estilo arquitetural com restrições.

---

### Restricoes REST

As restrições clássicas são:

```text
client-server;

stateless;

cache;

uniform interface;

layered system;

code-on-demand opcional.
```

`Client-server` separa interface cliente e implementação do servidor.

`Stateless` exige que cada request carregue o contexto necessário; não significa ausência de banco, cache ou estado de negócio.

`Cache` permite reutilizar respostas quando o contrato e os headers autorizam.

`Uniform interface` organiza identificação de recursos, representações e mensagens autoexplicativas.

`Layered system` permite proxies, gateways, caches e load balancers sem mudar o contrato do cliente.

`Code-on-demand` é opcional e raramente central em APIs JSON.

A API do laboratório será avaliada por essas ideias sem afirmar que já implementa REST completo.

### Semantica dos metodos

Matriz essencial:

```text
GET:
consulta representação;
safe;
idempotente;
potencialmente cacheable.

HEAD:
mesma semântica de GET;
sem conteúdo na resposta;
safe e idempotente.

OPTIONS:
descobre opções e métodos;
safe e idempotente.

POST:
submete dados ou cria processamento;
não safe;
não idempotente por garantia geral.

PUT:
cria ou substitui o recurso identificado;
não safe;
idempotente.

PATCH:
aplica alteração parcial;
não safe;
idempotência depende do formato e do contrato.

DELETE:
remove a associação do recurso;
não safe;
idempotente.
```

`Safe` significa que o cliente não solicita mutação de estado de negócio. Não significa operação barata, pública ou sem logs.

`Idempotente` significa que repetir a operação mantém o mesmo efeito pretendido no servidor. Não exige body, timestamp, request id ou log idênticos.

O endpoint runtime pode gerar outro `generatedAt` em cada GET e continuar idempotente, desde que não altere estado de negócio.

Spring MVC pode atender HEAD a partir de um mapping GET e responder OPTIONS com `Allow`. O laboratório comprovará esses comportamentos sem criar handlers adicionais.

Nenhum POST, PUT, PATCH ou DELETE será implementado nesta aula.

### 404 versus 405

`404 Not Found` significa que o servidor não encontrou o recurso ou handler correspondente ao target.

`405 Method Not Allowed` significa que o target existe, mas não aceita o método usado.

Exemplos:

```text
GET /api/v1/nao-existe
    -> 404.

POST /api/v1/runtime
    -> 405.
```

Essa diferença é parte da semântica do contrato.

---

### Familias de status

Os status são agrupados:

```text
1xx:
informação.

2xx:
sucesso.

3xx:
redirecionamento.

4xx:
erro do cliente.

5xx:
erro do servidor.
```

Não escolha status apenas porque “parece próximo”.

Use a semântica documentada.

---

### Status comuns

Mapa inicial:

```text
200:
sucesso com representação.

201:
recurso criado.

202:
processamento aceito.

204:
sucesso sem body.

400:
request inválida.

401:
autenticação necessária ou inválida.

403:
acesso proibido.

404:
recurso não encontrado.

405:
método não permitido.

406:
nenhuma representação aceitável.

409:
conflito com estado atual.

415:
media type de entrada não suportado.

422:
conteúdo compreendido, mas semanticamente inválido.

500:
falha inesperada do servidor.

503:
serviço temporariamente indisponível.
```

Nesta aula, apenas 200, 404, 405 e 406 serão observados diretamente.

---

### Media type

Media type identifica o formato da representação.

Exemplos:

```text
text/plain;

application/json;

application/xml;

application/pdf.
```

Ele pode possuir parâmetros.

Exemplo:

```text
text/plain;charset=UTF-8.
```

Nos testes, use compatibilidade quando o parâmetro não altera o contrato essencial.

---

### Content-Type

`Content-Type` descreve o conteúdo presente na mensagem atual.

Em uma response:

```text
qual formato o servidor enviou?
```

Em uma request com body:

```text
qual formato o cliente enviou?
```

GETs do laboratório não precisam enviar `Content-Type` porque não possuem body.

---

### Accept

`Accept` informa quais representações o cliente aceita receber.

Exemplo:

```http
Accept: application/json
```

O endpoint runtime produz JSON.

Logo, esse header é compatível.

Se o cliente pedir apenas:

```text
text/plain
```

para um endpoint que produz somente JSON, a resposta esperada é:

```text
406 Not Acceptable.
```

---

### Content negotiation

Content negotiation escolhe uma representação compatível entre:

- capacidades do servidor;
- preferências do cliente.

A negociação pode considerar:

- `Accept`;
- qualidade;
- media types produzidos;
- converters disponíveis.

O laboratório não oferecerá duas representações para o mesmo endpoint.

Ele validará compatibilidade e incompatibilidade.

---

### 406 versus 415

`406 Not Acceptable` trata da representação de saída solicitada pelo cliente.

`415 Unsupported Media Type` trata do formato de entrada enviado pelo cliente.

Resumo:

```text
Accept incompatível:
406.

Content-Type de request incompatível:
415.
```

Como não existe request body nesta aula, 415 será apenas conceitual.

---

### Vary

O header:

```text
Vary
```

informa a caches que a representação pode variar conforme determinados headers, como `Accept`.

Ele é importante quando existem múltiplas representações.

Não será configurado manualmente nesta aula.

---

### Cache de GET

GET é cacheable por semântica, mas a resposta concreta precisa respeitar regras e headers.

O endpoint runtime contém timestamp atual.

Isso reduz a utilidade de cache longo.

Antes de configurar cache, pergunte:

- o dado muda?
- por quanto tempo pode ficar antigo?
- é público?
- varia por usuário?
- existe validação condicional?
- há risco de expor dados?

---

### Requisicao condicional

Clientes podem usar:

```text
If-None-Match;

If-Modified-Since.
```

O servidor pode responder:

```text
304 Not Modified.
```

Nesse caso, não envia uma nova representação completa.

ETag e Last-Modified serão praticados quando headers forem aprofundados.

---

### Desenho de URI

Boas diretrizes:

- usar substantivos;
- manter consistência;
- evitar detalhes internos;
- evitar extensão de arquivo;
- usar path para identidade;
- usar query para filtro;
- evitar verbos redundantes;
- usar hierarquia somente quando existe relação real.

Exemplos:

```text
bom:
GET /orders/123.

frágil:
GET /getOrderById?id=123.
```

---

### Singular ou plural

Coleções normalmente usam plural:

```text
/orders;

 customers;

 products.
```

Um recurso singleton pode usar singular:

```text
/profile;

 runtime;

 configuration.
```

Mais importante que uma regra absoluta é consistência documentada.

---

### Endpoint de acao

Nem toda operação cabe naturalmente em CRUD.

Às vezes uma ação explícita é necessária:

```text
POST /orders/123/cancellation.
```

Isso ainda pode ser modelado como criação de um recurso de comando ou processo.

Evite transformar a API inteira em:

```text
/doThis;

/executeThat;

/processSomething.
```

O endpoint `/ping` é aceito como diagnóstico didático, não como modelo de recurso de domínio.

---

### REST versus RPC

RPC modela chamadas ou comandos.

Exemplo:

```text
POST /calculateRuntimeMessages.
```

REST procura modelar recursos e usar semântica HTTP.

Exemplo:

```text
GET /runtime.
```

RPC não é automaticamente errado.

O erro é chamar uma interface de REST quando o contrato ignora recursos e protocolo.

A escolha deve ser consciente.

---

### Richardson Maturity Model

O modelo de Richardson é uma ferramenta didática:

```text
Level 0:
HTTP como túnel para comandos.

Level 1:
recursos separados.

Level 2:
recursos, métodos, status e media types coerentes.

Level 3:
controles de hipermídia.
```

Ele ajuda a avaliar evolução, mas não substitui as restrições REST originais.

A API atual começa a trabalhar no Level 2, ainda sem HATEOAS.

### Compatibilidade

Um contrato publicado possui consumidores.

Mudanças potencialmente incompatíveis:

- remover campo;
- renomear campo;
- mudar tipo;
- mudar status;
- mudar media type;
- mudar semântica;
- exigir header novo;
- alterar URI.

Adicionar campo JSON pode ser compatível para clientes tolerantes, mas nem todos os consumidores ignoram campos desconhecidos.

Compatibilidade precisa ser testada e comunicada.

---

### Versionamento

O projeto usa:

```text
/api/v1.
```

Esse versionamento protege mudanças maiores de contrato.

Ele não deve ser usado como desculpa para quebrar clientes a cada alteração pequena.

Uma nova versão precisa de:

- motivo;
- período de coexistência;
- migração;
- documentação;
- depreciação.

---

### Contract first mindset

Antes de implementar, descreva:

```text
recurso;

método;

URI;

entrada;

saída;

status;

headers;

media types;

safety;

idempotência;

erros;

compatibilidade.
```

Esse pensamento reduz endpoints improvisados.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Todos os testes da aula 363 precisam permanecer verdes.

---

### 2. Preservar o controller

Não adicione novos mappings obrigatórios.

Confirme que existem somente:

```text
GET /api/v1/runtime/ping;

GET /api/v1/runtime.
```

A aula evoluirá o entendimento e os testes, não a superfície pública.

---

### 3. Criar RuntimeApiMappingMetadataIT

Injete:

```text
RequestMappingHandlerMapping.
```

Localize somente os métodos de:

```text
RuntimeMessageController.
```

Para cada mapping, registre:

- métodos HTTP;
- patterns;
- produces;
- consumes;
- nome do handler.

Valide:

```text
dois mappings;

somente GET;

paths esperados;

produces explícitos;

nenhum consumes.
```

Não faça assert sobre mappings internos do Boot.

---

### 4. Criar RuntimeApiContentNegotiationWebMvcTest

Use `@WebMvcTest`.

Declare o service com `@MockitoBean`.

Cenário JSON compatível:

```text
GET /api/v1/runtime;

Accept application/json;

status 200.
```

Cenário JSON incompatível:

```text
Accept text/plain;

status 406.
```

---

### 5. Testar ping por Accept

No mesmo teste:

```text
Accept text/plain:
200.

Accept application/json:
406.
```

Valide o body somente no caso aceito.

---

### 6. Criar RuntimeApiMethodSemanticsWebMvcTest

Execute contra:

```text
/api/v1/runtime.
```

Métodos:

```text
POST;

PUT;

PATCH;

DELETE.
```

Todos devem retornar:

```text
405 Method Not Allowed.
```

Não crie handlers para fazer o teste passar.

---

### 7. Validar GET permitido

No mesmo teste:

```text
GET:
200.
```

A diferença entre 200 e 405 demonstra que o recurso existe, mas aceita somente determinados métodos.

---

### 8. Criar RuntimeApiHeadOptionsWebMvcTest

Cenário HEAD:

```text
HEAD /api/v1/runtime/ping.
```

Valide:

- status 200;
- content type compatível;
- body vazio.

Cenário OPTIONS:

```text
OPTIONS /api/v1/runtime.
```

Valide:

- status de sucesso;
- header `Allow`;
- presença de GET;
- presença de HEAD;
- presença de OPTIONS.

Não fixe ordem textual do header.

---

### 9. Criar RuntimeApiStatusSemanticsWebMvcTest

Valide separadamente:

```text
GET /api/v1/runtime:
200.

GET /api/v1/unknown:
404.

POST /api/v1/runtime:
405.

GET runtime com Accept incompatível:
406.
```

O objetivo é impedir que esses status sejam tratados como equivalentes.

---

### 10. Criar RuntimeApiIdempotencyObservationIT

Use um service fake ou mock determinístico.

Execute dois GETs iguais.

Valide:

- service chamado duas vezes;
- nenhum método mutável chamado;
- status igual;
- estrutura igual;
- contrato não altera estado do fake.

Depois documente:

```text
idempotencia nao exige body identico
quando existe generatedAt.
```

Não compare o timestamp real do runtime.

---

### 11. Criar RuntimeApiLiveHttpSemanticsIT

Use:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.RANDOM_PORT
)
```

Use `HttpClient`.

Valide:

- GET com Accept JSON;
- HEAD;
- OPTIONS;
- POST com body vazio;
- rota desconhecida.

Confirme 200, 405 e 404 em HTTP real.

---

### 12. Inspecionar request e response reais

No teste live ou script, registre de forma resumida:

```text
method;

URI;

status;

HTTP version observada;

Content-Type;

Allow;

body length.
```

Não acople o teste à versão exata do protocolo se o servidor puder negociar.

---

### 13. Criar RuntimeApiCompatibilityTest

Serialize um `RuntimeMessageResponse` fixo.

Valide:

- campos `generatedAt`, `formatterId`, `messages`;
- tipos esperados;
- ausência de campos internos;
- lista representada como array;
- timestamp em formato textual ISO compatível.

Não valide ordem de propriedades JSON como contrato obrigatório.

---

### 14. Criar RuntimeApiRestReviewTest

Crie uma tabela de revisão como dados de teste:

```text
endpoint;

recurso;

safe;

idempotente;

media type;

nível Richardson;

observação.
```

Valide:

```text
runtime GET:
safe e idempotente.

ping GET:
safe e idempotente,
mas orientado a ação diagnóstica.
```

Esse teste é documental e não substitui comportamento real.

---

### 15. Executar aplicação manualmente

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

Use a porta 8081 do profile dev.

---

### 16. Inspecionar request GET

```powershell
curl.exe `
  -v `
  -H "Accept: application/json" `
  http://localhost:8081/api/v1/runtime
```

Observe:

- request line;
- request headers;
- status;
- response headers;
- body.

Não versionar a saída completa.

---

### 17. Testar Accept incompatível

```powershell
curl.exe `
  -i `
  -H "Accept: text/plain" `
  http://localhost:8081/api/v1/runtime
```

Resultado esperado:

```text
406.
```

---

### 18. Testar ping incompatível

```powershell
curl.exe `
  -i `
  -H "Accept: application/json" `
  http://localhost:8081/api/v1/runtime/ping
```

Resultado esperado:

```text
406.
```

---

### 19. Testar método incorreto

```powershell
curl.exe `
  -i `
  -X POST `
  http://localhost:8081/api/v1/runtime
```

Resultado esperado:

```text
405.
```

Não envie JSON.

---

### 20. Testar HEAD

```powershell
curl.exe `
  -I `
  http://localhost:8081/api/v1/runtime/ping
```

Confirme headers sem body.

---

### 21. Testar OPTIONS

```powershell
curl.exe `
  -i `
  -X OPTIONS `
  http://localhost:8081/api/v1/runtime
```

Confirme header:

```text
Allow.
```

---

### 22. Testar 404

```powershell
curl.exe `
  -i `
  http://localhost:8081/api/v1/recurso-inexistente
```

Compare com o 405 anterior.

---

### 23. Criar http-message-anatomy.md

Inclua exemplos de request e response.

Identifique:

- method;
- target;
- version;
- headers;
- separator;
- body;
- status.

---

### 24. Criar uri-resource-design.md

Documente:

- URI;
- URL;
- path;
- query;
- fragment;
- recursos;
- substantivos;
- hierarquia;
- singular e plural;
- ações justificadas.

---

### 25. Criar method-semantics.md

Crie uma matriz:

```text
GET:
safe, idempotente.

HEAD:
safe, idempotente.

OPTIONS:
safe, idempotente.

POST:
não safe, não garantidamente idempotente.

PUT:
não safe, idempotente.

PATCH:
não safe, não garantidamente idempotente.

DELETE:
não safe, idempotente.
```

Inclua exemplos futuros, sem implementar.

---

### 26. Criar safety-and-idempotency.md

Explique:

- efeito pretendido;
- repetição;
- timestamp;
- logs;
- retries;
- idempotency key;
- diferença entre response igual e efeito igual.

---

### 27. Criar status-code-map.md

Organize:

- famílias;
- status comuns;
- 404 versus 405;
- 406 versus 415;
- status observados;
- status reservados para próximas aulas.

---

### 28. Criar media-types-content-negotiation.md

Inclua:

- representation;
- media type;
- `Content-Type`;
- `Accept`;
- `produces`;
- `consumes`;
- converter;
- 406;
- 415;
- `Vary`.

---

### 29. Criar cache-conditional-requests.md

Explique:

- cacheability;
- Cache-Control;
- ETag;
- Last-Modified;
- If-None-Match;
- If-Modified-Since;
- 304;
- dados privados;
- timestamp do endpoint atual.

Não implemente headers.

---

### 30. Criar rest-constraints.md

Documente:

- client-server;
- stateless;
- cache;
- uniform interface;
- layered;
- code-on-demand;
- avaliação honesta da API atual.

---

### 31. Criar richardson-maturity-model.md

Documente levels 0 a 3.

Classifique a API atual como uma superfície pequena em evolução, sem afirmar Level 3.

---

### 32. Criar rest-vs-rpc.md

Compare:

```text
recurso versus ação;

método semântico versus POST para tudo;

status HTTP versus erro sempre 200;

contrato uniforme versus comandos particulares.
```

Reconheça casos legítimos de RPC.

---

### 33. Criar compatibility-versioning.md

Inclua:

- mudanças breaking;
- mudanças potencialmente compatíveis;
- `/v1`;
- depreciação;
- coexistência;
- testes de contrato;
- consumidores tolerantes.

---

### 34. Criar runtime-api-contract-review.md

Revise os dois endpoints.

Para runtime:

```text
recurso:
estado de runtime.

método:
GET.

safe:
sim.

idempotente:
sim.

representation:
JSON.
```

Para ping:

```text
capacidade diagnóstica;

GET safe;

orientação a ação aceita no laboratório;

não confundir com health operacional definitivo.
```

---

### 35. Criar scripts

`39_inspecionar_mensagem_http.ps1` usa `curl.exe -v`.

`40_testar_accept.ps1` executa combinações compatíveis e incompatíveis.

`41_testar_metodos_incorretos.ps1` testa POST, PUT, PATCH e DELETE.

`42_testar_head_options.ps1` testa metadata e Allow.

`43_observar_idempotencia.ps1` repete GETs e compara estrutura, não timestamp.

`44_executar_testes_http_rest.ps1` executa todos os testes da aula.

---

### 36. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeApiContentNegotiationWebMvcTest,RuntimeApiMethodSemanticsWebMvcTest,RuntimeApiHeadOptionsWebMvcTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 37. Executar testes live

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeApiLiveHttpSemanticsIT test
```

Confirme fechamento do servidor.

---

### 38. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 39. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 40. Revisar escopo

Confirme:

```text
novos mappings de produção:
zero.

@RequestBody:
zero.

@PathVariable:
zero.

@RequestParam de produção:
zero.

@PostMapping:
zero.

@PutMapping:
zero.

@PatchMapping:
zero.

@DeleteMapping:
zero.

headers customizados:
zero.

exception handler:
zero.
```

---

### 41. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs verbose;
- capturas curl completas;
- endpoint temporário;
- body de POST;
- configuração de cache antecipada;
- mudança incompatível de response.

---

## Entendendo o que foi feito

### HTTP deixou de ser apenas transporte

Método, URI, status, headers e representação ganharam semântica.

### REST deixou de ser sinonimo de JSON

As restrições arquiteturais foram separadas do formato.

### Safety e idempotencia foram comprovadas

GET repetido não precisa produzir body idêntico para manter o mesmo efeito.

### Erros de contrato foram diferenciados

404, 405 e 406 passaram a comunicar problemas distintos.

### A API atual foi revisada honestamente

O endpoint runtime é orientado a recurso; ping permanece uma capacidade diagnóstica didática.

---

## Erros comuns importantes

### Usar POST para tudo

A API perde semântica de safety, idempotência e cache.

### Retornar 200 para qualquer resultado

Clientes deixam de usar o protocolo para tomar decisões.

### Confundir Accept com Content-Type

Um descreve o que o cliente aceita receber; o outro descreve o conteúdo enviado.

### Chamar qualquer JSON de REST

Formato não substitui restrições arquiteturais.

### Alterar contrato sem pensar em consumidores

Uma mudança pequena no código pode ser breaking na rede.

---

## Comandos uteis

### Iniciar

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

### Request verbose

```powershell
curl.exe -v `
  -H "Accept: application/json" `
  http://localhost:8081/api/v1/runtime
```

### HEAD

```powershell
curl.exe -I `
  http://localhost:8081/api/v1/runtime/ping
```

### OPTIONS

```powershell
curl.exe -i -X OPTIONS `
  http://localhost:8081/api/v1/runtime
```

### Método incorreto

```powershell
curl.exe -i -X POST `
  http://localhost:8081/api/v1/runtime
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Anatomia

Copie uma request e uma response do curl verbose.

Identifique cada parte sem versionar dados temporários.

### Parte 2 — URI

Reescreva:

```text
/getRuntimeMessages;

/createOrder;

/orders/getById?id=10.
```

como contratos orientados a recursos.

### Parte 3 — Safety

Classifique uma operação de consulta que incrementa contador de visualizações de negócio.

Explique por que ela não deveria ser GET.

### Parte 4 — Idempotencia

Compare:

```text
POST /payments;

PUT /customers/10/address;

DELETE /sessions/20.
```

Explique o efeito de repetição.

### Parte 5 — Negotiation

Envie:

```text
Accept: */*;

Accept: application/json;

Accept: text/plain.
```

ao endpoint runtime.

Registre os status.

### Parte 6 — Status

Crie uma tabela para:

- recurso inexistente;
- método errado;
- representação inaceitável;
- conteúdo de entrada não suportado.

Não implemente 415.

### Parte 7 — Richardson

Classifique uma API que usa:

```text
POST /api
```

para todos os comandos.

Depois proponha evolução para Levels 1 e 2.

### Parte 8 — ADR

Registre:

```text
URIs orientadas a recursos;

GET safe e idempotente;

métodos mutáveis somente em aulas próprias;

Accept e Content-Type distintos;

404, 405 e 406 preservados;

cache definido por contrato;

REST não é sinônimo de JSON;

compatibilidade protegida por /v1 e testes.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 363 e ponte para a aula 365 foram preservadas;
- o mesmo projeto `formacao-java-backend-api` foi continuado;
- nenhum novo mapping de produção foi criado;
- request e response HTTP foram explicadas;
- método, target, versão, headers e conteúdo foram identificados;
- URI, URL, scheme, host, port, path, query e fragment foram diferenciados;
- fragment foi reconhecido como informação não enviada ao servidor;
- recurso foi diferenciado de tabela e de representação;
- REST não foi tratado como sinônimo de JSON;
- restrições client-server, stateless, cache, uniform interface, layered system e code-on-demand foram explicadas;
- GET, HEAD, OPTIONS, POST, PUT, PATCH e DELETE foram comparados;
- safety e idempotência foram definidas corretamente;
- GET foi mantido safe e idempotente;
- resposta diferente por `generatedAt` não foi confundida com efeito não idempotente;
- POST não recebeu garantia geral de idempotência;
- PUT e DELETE foram reconhecidos como idempotentes;
- PATCH teve idempotência condicionada ao contrato;
- HEAD foi testado sem body;
- OPTIONS foi testado com header `Allow`;
- CORS não foi antecipado;
- famílias de status foram explicadas;
- 200, 404, 405 e 406 foram observados;
- 404 foi diferenciado de 405;
- 406 foi diferenciado de 415;
- body de erro padrão não virou contrato;
- media type, `Accept`, `Content-Type`, `produces` e `consumes` foram explicados;
- Accept compatível retornou 200;
- Accept incompatível retornou 406;
- `Content-Type` de response foi validado;
- GET sem body não enviou Content-Type de request desnecessário;
- cache, Cache-Control, ETag, Last-Modified, requests condicionais e 304 foram apresentados sem implementação antecipada;
- desenho de URI priorizou recursos, substantivos e consistência;
- query foi reservada para filtros e opções;
- endpoint `ping` foi reconhecido como diagnóstico didático;
- REST e RPC foram comparados sem classificar RPC como sempre errado;
- Richardson Levels 0 a 3 foram documentados;
- HATEOAS não foi implementado;
- compatibilidade, breaking changes, versionamento `/v1`, depreciação e coexistência foram discutidos;
- contract-first mindset foi aplicado;
- `RuntimeApiMappingMetadataIT` foi criado;
- somente os mappings do controller da aplicação foram inspecionados;
- dois GETs, paths e `produces` foram validados;
- `RuntimeApiContentNegotiationWebMvcTest` foi criado;
- `RuntimeApiMethodSemanticsWebMvcTest` foi criado;
- POST, PUT, PATCH e DELETE retornaram 405;
- `RuntimeApiHeadOptionsWebMvcTest` foi criado;
- `RuntimeApiStatusSemanticsWebMvcTest` foi criado;
- `RuntimeApiIdempotencyObservationIT` foi criado;
- nenhuma mutação foi observada nos GETs;
- `RuntimeApiLiveHttpSemanticsIT` usou servidor real, porta aleatória e `HttpClient`;
- contexto do teste live foi fechado;
- `RuntimeApiCompatibilityTest` preservou os campos públicos sem fixar ordem JSON;
- `RuntimeApiRestReviewTest` documentou recurso, safety, idempotência e nível de maturidade;
- curl verbose, Accept incompatível, método incorreto, HEAD, OPTIONS e 404 foram exercitados;
- outputs completos de diagnóstico não foram versionados;
- anatomia HTTP, URIs, métodos, status, negociação, cache, REST, Richardson, RPC e compatibilidade foram documentados;
- scripts da aula foram criados;
- testes focados, teste live, suite completa e package passaram;
- nenhum `@RequestBody`, `@PathVariable` ou `@RequestParam` de produção foi usado;
- nenhum POST, PUT, PATCH ou DELETE foi criado;
- nenhum header customizado, exception handler, banco, JPA, Flyway, Security ou Validation foi antecipado;
- commit recomendado e diário de bordo estão prontos.

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
git commit -m "test(m14): validar semantica http e contrato rest"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs verbose;
- arquivos de captura;
- endpoint temporário;
- configuração de cache;
- alteração incompatível de contrato.

---

## Fechamento e ponte para a proxima aula

Nesta aula, HTTP deixou de ser apenas o transporte dos endpoints criados na aula 363.

O mapa consolidado ficou:

```text
request:
método, target, headers e conteúdo.

response:
status, headers e conteúdo.

URI:
identificação.

resource:
abstração exposta.

representation:
forma transferida.

GET:
safe e idempotente.

POST:
processamento, sem idempotência garantida.

PUT:
substituição idempotente.

PATCH:
alteração parcial.

DELETE:
remoção idempotente.

Accept:
representação desejada.

Content-Type:
representação enviada.

REST:
restrições arquiteturais.

RPC:
chamadas e comandos.
```

Você comprovou:

```text
GET 200;

HEAD 200 sem body;

OPTIONS com Allow;

métodos incorretos 405;

rota inexistente 404;

Accept incompatível 406;

media types explícitos;

GET repetido sem mutação;

contrato JSON preservado.
```

A decisão central foi:

```text
um contrato HTTP profissional
usa metodo, URI, status, headers
e representacao como partes semanticas,
nao como detalhes acidentais.
```

A próxima aula será:

```text
365 - M14.10 - Request body PathVariable RequestParam
```

Nela, você continuará no mesmo projeto e estudará:

- entrada HTTP;
- `@RequestBody`;
- desserialização JSON;
- request record;
- `@PathVariable`;
- identidade no path;
- `@RequestParam`;
- filtro e opção na query;
- required;
- default value;
- tipos;
- conversão;
- coleções;
- parâmetros repetidos;
- URI encoding;
- erros de binding;
- teste MockMvc;
- teste com servidor real;
- separação entre request e domínio.

A aula 364 respondeu:

```text
o que torna um contrato HTTP
semanticamente coerente?
```

A aula 365 responderá:

```text
como transformar path, query e body
em entradas Java bem definidas?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei ler a anatomia de request e response.
- [ ] Sei classificar métodos por safety e idempotência.
- [ ] Sei diferenciar 404, 405, 406 e 415.
- [ ] Sei diferenciar Accept de Content-Type.
- [ ] Sei avaliar uma API como REST, RPC ou mistura consciente.

---

## Troubleshooting adicional

### POST retornou 404 em vez de 405

Revise se o path corresponde exatamente a um mapping existente.

### Accept incompatível não retornou 406

Revise `produces`, converters e header usado.

### HEAD executou lógica do GET

Isso pode ocorrer para produzir metadata; confirme ausência de body e avalie custo do handler.

### OPTIONS não mostrou método esperado

Revise mappings e infraestrutura MVC carregada.

### Repetir GET gerou body diferente

Verifique se a diferença é representação dinâmica ou mutação de estado.

### Teste de contrato quebrou por ordem JSON

Não trate ordem de propriedades como requisito sem necessidade.

---

## Perguntas de revisao

1. O que compõe uma request HTTP?
2. O que compõe uma response?
3. Qual diferença entre URI e representação?
4. REST é sinônimo de JSON?
5. O que significa stateless?
6. Quais métodos são safe?
7. GET é idempotente?
8. POST é idempotente por definição?
9. PUT é idempotente?
10. DELETE é idempotente?
11. Qual diferença entre 404 e 405?
12. Qual diferença entre 406 e 415?
13. O que faz Accept?
14. O que faz Content-Type?
15. Para que serve HEAD?
16. Para que serve OPTIONS?
17. O que é Richardson Level 2?
18. REST e RPC podem coexistir conscientemente?
19. Por que preservar compatibilidade?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Método, target, versão, headers e conteúdo.
2. Versão, status, headers e conteúdo.
3. URI identifica; representação transfere estado.
4. Não.
5. Cada request carrega contexto necessário.
6. GET, HEAD, OPTIONS e TRACE.
7. Sim.
8. Não.
9. Sim.
10. Sim.
11. Recurso ausente versus método não aceito.
12. Saída inaceitável versus entrada não suportada.
13. Declara o que o cliente aceita receber.
14. Declara o formato do conteúdo atual.
15. Obter metadata sem body.
16. Descobrir opções e métodos.
17. Recursos, métodos e status HTTP.
18. Sim, com contrato claro.
19. Existem consumidores dependentes.
20. Request body PathVariable RequestParam.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 364 - M14.09 - HTTP e REST de verdade

- Continuei no projeto `formacao-java-backend-api`.
- Entendi HTTP como protocolo de aplicação.
- Estudei a anatomia de request e response.
- Diferenciei URI, URL, path, query e fragment.
- Entendi recurso e representação.
- Confirmei que REST não é sinônimo de JSON.
- Estudei client-server, stateless, cache e interface uniforme.
- Entendi layered system e code-on-demand.
- Aprofundei GET, HEAD, POST, PUT, PATCH, DELETE e OPTIONS.
- Classifiquei métodos por safety.
- Classifiquei métodos por idempotência.
- Diferenciei efeito idempotente de resposta idêntica.
- Diferenciei 404 de 405.
- Diferenciei 406 de 415.
- Revisei famílias e status HTTP.
- Entendi media types.
- Diferenciei `Accept` de `Content-Type`.
- Testei negociação de conteúdo.
- Recebi 406 para representações incompatíveis.
- Testei HEAD sem body.
- Testei OPTIONS e o header `Allow`.
- Testei métodos não permitidos.
- Observei idempotência dos GETs atuais.
- Estudei cache, ETag, Last-Modified e 304 sem antecipar implementação.
- Revisei boas práticas de URIs.
- Reconheci o endpoint ping como diagnóstico didático.
- Comparei REST e RPC.
- Estudei Richardson Levels 0 a 3.
- Analisei compatibilidade e versionamento.
- Mantive `/api/v1`.
- Criei testes de metadata dos mappings.
- Criei testes de status e métodos.
- Criei testes de content negotiation.
- Criei teste HTTP com servidor real.
- Criei teste de compatibilidade JSON.
- Preservei os dois endpoints existentes.
- Não criei request body, path variable ou novos métodos.
- Próxima aula: Request body PathVariable RequestParam.
```

---

## Referencia tecnica curta

```text
HTTP:
protocolo.

URI:
identificador.

Resource:
abstração.

Representation:
conteúdo transferido.

Safe:
sem mutação pretendida.

Idempotent:
mesmo efeito repetido.

Accept:
saída aceita.

Content-Type:
formato enviado.

REST:
restrições.

RPC:
chamadas.
```

Regra final:

```text
uma API profissional deve tratar HTTP como protocolo semantico: URIs identificam recursos, metodos comunicam intencao, safety e idempotencia orientam repeticao, status distinguem resultados, Accept e Content-Type governam representacoes, cache e compatibilidade precisam ser planejados e REST deve ser avaliado por suas restricoes e interface uniforme, nao apenas pela presenca de JSON e annotations de controller.
```
