# 365 - M14.10 - Request body PathVariable RequestParam

## Apresentacao da aula

Na aula 364, você deixou de tratar HTTP apenas como transporte e passou a analisar o protocolo como parte do contrato da aplicação.

Foram aprofundados:

```text
request;

response;

URI;

recurso;

representação;

métodos HTTP;

safety;

idempotência;

status;

media types;

Accept;

Content-Type;

cache;

REST;

RPC;

compatibilidade.
```

Os dois endpoints existentes foram preservados:

```text
GET /api/v1/runtime/ping;

GET /api/v1/runtime.
```

Agora surge uma nova pergunta:

```text
como os dados enviados pelo cliente
entram nos parametros e objetos Java
do metodo controller?
```

Uma request pode transportar entrada em regiões diferentes.

Nesta aula, você trabalhará com três delas:

```text
path;

query string;

body.
```

No Spring MVC, essas regiões serão ligadas ao Java com:

```text
@PathVariable;

@RequestParam;

@RequestBody.
```

Cada annotation representa uma intenção diferente.

`@PathVariable` será usado quando o valor fizer parte da identidade ou do endereço lógico do recurso.

Exemplo:

```text
GET /api/v1/runtime/messages/2
```

O número `2` faz parte do path.

`@RequestParam` será usado para opções de consulta.

Exemplo:

```text
GET /api/v1/runtime/messages?limit=2&format=compact
```

Os valores ajustam a representação consultada, mas não alteram o path principal do recurso.

`@RequestBody` será usado quando o cliente enviar uma representação estruturada no conteúdo HTTP.

Exemplo:

```text
POST /api/v1/runtime/messages/preview
Content-Type: application/json
```

Body:

```json
{
  "format": "DETAILED",
  "messages": [
    "spring boot",
    "spring mvc"
  ]
}
```

A aula criará três novos contratos:

```text
GET /api/v1/runtime/messages/{position};

GET /api/v1/runtime/messages;

POST /api/v1/runtime/messages/preview.
```

O POST será um endpoint de prévia.

Ele não persistirá dados.

Ele não criará um recurso definitivo.

Seu objetivo será demonstrar desserialização do body e delegação ao service.

A semântica de status e headers de uma operação POST será aprofundada na aula:

```text
366 - M14.11 - ResponseEntity status headers body
```

Por isso, os novos métodos retornarão records diretamente e utilizarão o status padrão de sucesso do Spring MVC.

Você observará respostas de erro geradas pela infraestrutura:

```text
400:
conversão ou JSON inválido.

415:
Content-Type não suportado.
```

Porém, não criará ainda:

- `ResponseEntity` customizada para esses erros;
- exception handler;
- Problem Details;
- body de erro oficial;
- status de criação;
- header `Location`.

A arquitetura detalhada de DTOs será aprofundada em:

```text
367 - M14.12 - DTO request response
```

Nesta aula, records de transporte serão criados somente para permitir binding e serialização tipados.

Você não criará:

- `BaseDto`;
- mapper genérico;
- herança de DTO;
- entity exposta;
- modelo compartilhado para toda a aplicação;
- camada de mapping complexa.

A validação semântica também não será antecipada.

Ainda não serão usados:

```text
@Valid;

@NotBlank;

@NotNull;

@Size;

@Min;

@Max.
```

A aula observará a diferença entre:

```text
binding:
conseguir converter a entrada.

validation:
decidir se o valor convertido é aceitável.
```

Exemplo:

```text
limit=abc:
falha de conversão.

limit=-10:
converte para int,
mas ainda exige regra de validação.
```

A primeira situação pertence diretamente ao binding.

A segunda pertence a validação e regra de aplicação.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
366 - M14.11 - ResponseEntity status headers body
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
363:
primeiros endpoints.

364:
HTTP e REST de verdade.

365:
request body, path variable e request param.

366:
ResponseEntity, status, headers e body.

367:
DTO request e response.

368:
Bean Validation.
```

A aula 364 respondeu:

```text
o que torna um contrato HTTP coerente?
```

A aula 365 responderá:

```text
como path, query e body
são convertidos em entradas Java?
```

Nesta aula:

```text
@PathVariable:
sim.

@RequestParam:
sim.

@RequestBody:
sim.

conversão de String para int:
sim.

converter customizado:
sim.

query obrigatória:
sim.

query opcional:
sim.

defaultValue:
sim.

lista repetida:
sim.

URI encoding:
sim.

JSON para record:
sim.

HttpMessageConverter:
sim.

JSON inválido:
sim.

Content-Type incorreto:
sim.

binding errors:
sim.

Bean Validation:
não.

ResponseEntity aprofundada:
não.

DTO architecture aprofundada:
não.

exception handler:
não.

persistência:
não.
```

O controller continuará fino.

A nova regra será:

```text
controller extrai e adapta entrada HTTP;

service executa processamento;

controller devolve objeto de transporte;

Spring serializa a resposta.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura nova de produção:

```text
src/main/java/br/com/formacao/backend
├── beans
│   ├── formatter
│   │   ├── RuntimeFormatOption.java
│   │   └── RuntimeMessageFormatterCatalog.java
│   └── service
│       └── RuntimeMessageService.java
└── web
    ├── controller
    │   └── RuntimeMessageController.java
    ├── converter
    │   └── RuntimeFormatOptionConverter.java
    ├── request
    │   └── RuntimeMessagePreviewRequest.java
    └── response
        ├── RuntimeMessageItemResponse.java
        ├── RuntimeMessageQueryResponse.java
        └── RuntimeMessagePreviewResponse.java
```

Novos testes:

```text
src/test/java/br/com/formacao/backend/web
├── RuntimeMessagePathVariableWebMvcTest.java
├── RuntimeMessageRequestParamWebMvcTest.java
├── RuntimeMessageRequestBodyWebMvcTest.java
├── RuntimeMessageBindingErrorsWebMvcTest.java
├── RuntimeMessageBindingLiveServerIT.java
├── RuntimeFormatOptionConverterTest.java
├── RuntimeMessageInputArchitectureTest.java
└── RuntimeMessageBindingContractTest.java
```

Documentação externa:

```text
docs
├── request-input-regions.md
├── path-variable.md
├── request-param.md
├── request-body.md
├── http-message-converters.md
├── type-conversion.md
├── uri-encoding.md
├── binding-errors.md
├── binding-vs-validation.md
└── runtime-input-contracts.md
```

Scripts:

```text
scripts
├── 45_testar_path_variable.ps1
├── 46_testar_request_params.ps1
├── 47_testar_request_body.ps1
├── 48_testar_erros_binding.ps1
├── 49_testar_uri_encoding.ps1
└── 50_executar_testes_binding.ps1
```

Resultados esperados:

```text
GET /messages/2:
position convertida para int.

GET /messages?limit=2:
limit convertida para int.

format=compact:
convertido para enum COMPACT.

tag=java&tag=spring:
lista com dois elementos.

query sem limit:
default aplicado.

query sem format:
default aplicado.

POST preview com JSON:
record criado.

JSON malformado:
400.

body ausente:
400.

Content-Type text/plain:
415.

position=abc:
400.

limit=abc:
400.

format=desconhecido:
400.

controller com HttpServletRequest:
ausente.

Map cru como body:
ausente.

JsonNode como contrato:
ausente.

Bean Validation:
ausente.
```

---

## Conceito essencial

### Regioes de entrada HTTP

Uma request pode transportar dados em:

```text
path;

query;

headers;

cookies;

body.
```

Cada região possui semântica própria.

Nesta aula, headers e cookies não serão ligados a parâmetros.

O foco será:

```text
path:
identidade ou posição no endereço.

query:
opções de consulta.

body:
representação estruturada.
```

---

### Argument resolution

O Spring MVC executa o método controller por meio de infraestrutura que resolve seus argumentos.

Exemplo:

```java
public RuntimeMessageItemResponse messageAt(
        @PathVariable("position")
        int position
) {
}
```

Antes de chamar o método, o framework precisa:

1. localizar a variável no path;
2. obter o valor textual;
3. converter para `int`;
4. chamar o método com o valor convertido.

Se a conversão falhar, o método não é executado.

---

### @PathVariable

`@PathVariable` liga um segmento variável do path a um argumento Java.

Mapping:

```java
@GetMapping(
        path = "/messages/{position}",
        produces = MediaType.APPLICATION_JSON_VALUE
)
```

Argumento:

```java
@PathVariable("position")
int position
```

Request:

```text
GET /api/v1/runtime/messages/2
```

Resultado conceitual:

```text
"2"
    -> conversão
    -> int 2.
```

---

### Nome explicito do path variable

Use:

```java
@PathVariable("position")
```

em vez de depender somente do nome compilado do parâmetro.

Isso torna o contrato explícito e reduz dependência da configuração do compilador.

O nome no mapping e o nome da annotation devem corresponder.

---

### Path identifica; query modifica

Compare:

```text
/messages/2:
seleciona uma posição específica.

/messages?limit=2:
consulta a coleção com limite.
```

O primeiro valor participa do endereço.

O segundo ajusta a consulta.

Não existe regra matemática universal.

A decisão deve representar a semântica do recurso.

---

### Conversao de path variable

O valor chega como texto.

O Spring usa seu sistema de conversão para tipos como:

- `int`;
- `long`;
- `UUID`;
- enum;
- `LocalDate`;
- tipos com converter registrado.

Nesta aula, `position` será `int`.

Valor:

```text
abc
```

não pode ser convertido.

Resultado esperado:

```text
400 Bad Request.
```

O body padrão do erro não será adotado como contrato.

---

### Valores validos e regra semantica

O binding consegue converter:

```text
-1
```

para `int`.

Isso não significa que a posição seja válida.

A regra:

```text
position deve ser positiva
```

é validação ou regra de aplicação.

Nesta aula, os testes de sucesso usarão somente posições válidas.

O tratamento profissional de posição inexistente será combinado com status e erros em aulas posteriores.

---

### @RequestParam

`@RequestParam` liga request parameters a argumentos Java.

Em Spring MVC, request parameters incluem principalmente:

- query parameters;
- dados de formulário;
- partes multipart, conforme o tipo.

Nesta aula, será usado apenas para query string.

Exemplo:

```java
@RequestParam(
        name = "limit",
        defaultValue = "10"
)
int limit
```

Request:

```text
GET /api/v1/runtime/messages?limit=2
```

---

### Required

O padrão de `@RequestParam` é:

```text
required=true.
```

Se um parâmetro obrigatório estiver ausente, o método não é executado e a infraestrutura responde com erro de request.

Nesta aula, `limit` e `format` possuirão defaults.

As tags serão opcionais.

Um teste isolado demonstrará um parâmetro obrigatório sem alterar o contrato de produção.

---

### defaultValue

Exemplo:

```java
@RequestParam(
        name = "limit",
        defaultValue = "10"
)
int limit
```

Quando `limit` está ausente ou é tratado como vazio pela resolução aplicável, o default é convertido para `int`.

Definir `defaultValue` torna a entrada efetivamente não obrigatória.

O default deve ser:

- seguro;
- documentado;
- compatível com o tipo;
- coerente com a operação.

---

### RequestParam opcional

Para tags:

```java
@RequestParam(
        name = "tag",
        required = false
)
List<String> tags
```

Quando ausente, a implementação pode receber `null` conforme a assinatura e a resolução.

O controller fará apenas normalização mecânica:

```java
List<String> safeTags =
        tags == null
                ? List.of()
                : List.copyOf(tags);
```

O service não receberá uma lista mutável ou nula.

---

### Parametros repetidos

Uma query pode repetir a mesma chave:

```text
?tag=java&tag=spring
```

Ela será ligada a:

```java
List<String>.
```

Resultado:

```text
["java", "spring"].
```

A ordem será preservada no contrato didático.

Não use um único texto delimitado manualmente quando o protocolo já permite repetição.

---

### Tipos simples

Request params podem ser convertidos para:

- números;
- boolean;
- enums;
- datas;
- listas;
- tipos registrados.

Se o texto não puder ser convertido, o controller não deve tentar capturar o erro com `try/catch` genérico.

O binding falha antes da execução do método.

---

### Enum de formato

Crie:

```java
public enum RuntimeFormatOption {
    COMPACT,
    DETAILED
}
```

O enum não é bean.

Ele representa opções aceitas pela entrada web e pelo processamento.

---

### Converter customizado

URLs amigáveis usarão:

```text
format=compact;

format=detailed.
```

O converter será:

```java
@Component
public class RuntimeFormatOptionConverter
        implements Converter<
                String,
                RuntimeFormatOption
        > {
}
```

Ele normalizará com:

```text
trim;

upper case com Locale.ROOT.
```

Depois utilizará:

```java
RuntimeFormatOption.valueOf(...).
```

Valor desconhecido produzirá erro de conversão.

Não faça fallback silencioso para COMPACT.

Uma opção digitada incorretamente precisa ser percebida.

---

### Converter e JSON sao pipelines diferentes

O converter MVC participa de entradas textuais como:

- path variable;
- request param.

O body JSON é lido por um `HttpMessageConverter` e desserializado pela infraestrutura JSON.

Portanto, o converter de `String` para enum não transforma automaticamente o texto de um campo JSON.

No body da baseline, use:

```json
"format": "DETAILED"
```

O estudo de customização JSON ficará para uma aula apropriada.

---

### @RequestBody

`@RequestBody` solicita que o conteúdo da request seja lido e convertido para um objeto Java.

Exemplo:

```java
public RuntimeMessagePreviewResponse preview(
        @RequestBody
        RuntimeMessagePreviewRequest request
) {
}
```

O método não recebe JSON textual.

Ele recebe um record já desserializado quando a entrada é válida.

---

### Request record

Record mínimo:

```java
public record RuntimeMessagePreviewRequest(
        RuntimeFormatOption format,
        List<String> messages
) {

    public RuntimeMessagePreviewRequest {
        messages =
                messages == null
                        ? List.of()
                        : List.copyOf(messages);
    }
}
```

A normalização é estrutural.

Ela não substitui Bean Validation.

Nesta aula, `format=null` poderá chegar ao service se o JSON omitir o campo.

O teste documentará essa limitação.

---

### HttpMessageConverter

O Spring MVC usa `HttpMessageConverter` para ler e escrever conteúdo HTTP.

Na entrada JSON:

```text
bytes da request;

Content-Type application/json;

converter JSON;

RuntimeMessagePreviewRequest.
```

Na saída:

```text
RuntimeMessagePreviewResponse;

converter JSON;

bytes da response;

Content-Type application/json.
```

O controller não instancia o converter.

---

### Content-Type de entrada

Para o POST JSON, o cliente deve enviar:

```http
Content-Type: application/json
```

Esse header descreve o body enviado.

Se o endpoint consome JSON e o cliente envia:

```text
text/plain
```

o resultado esperado é:

```text
415 Unsupported Media Type.
```

---

### consumes

O mapping do POST declarará:

```java
consumes =
        MediaType.APPLICATION_JSON_VALUE
```

Isso torna o formato de entrada explícito.

O método também declarará:

```java
produces =
        MediaType.APPLICATION_JSON_VALUE
```

A aula 366 aprofundará a composição da response.

---

### Body obrigatorio

O padrão de `@RequestBody` é obrigatório.

Uma request POST sem body para o método da aula deve resultar em:

```text
400 Bad Request.
```

Não use:

```java
@RequestBody(required = false)
```

apenas para aceitar uma entrada incompleta.

Se a operação exige representação, o body deve existir.

---

### JSON malformado

Exemplo inválido:

```json
{
  "format": "COMPACT",
  "messages": [
}
```

O converter não consegue criar o record.

Resultado esperado:

```text
400 Bad Request.
```

O controller não é executado.

---

### Campo desconhecido

O comportamento para campos JSON desconhecidos depende da configuração do mapper.

Nesta aula, campos desconhecidos não serão usados para definir a política de compatibilidade.

A aula 367 aprofundará contratos request e response.

Não crie assertions frágeis sobre uma política ainda não definida.

---

### Binding versus validation

Binding responde:

```text
consigo transformar esta entrada
no tipo Java declarado?
```

Validation responde:

```text
o objeto convertido respeita
as regras do contrato?
```

Exemplos:

```text
limit=abc:
binding falha.

limit=-1:
binding funciona;
validação deveria rejeitar.

messages=null:
JSON pode ser desserializado;
contrato pode considerar inválido.
```

Bean Validation será adicionada em aula posterior.

---

### Binding versus regra de negocio

Mesmo uma request válida pode representar uma operação rejeitada pelo negócio.

Exemplo futuro:

```text
pedido válido em JSON,
mas estado atual impede cancelamento.
```

Controller binding não decide essa regra.

O service e o domínio continuam responsáveis.

---

### Erros antes do controller

Podem ocorrer antes da execução do método:

- path variable não convertida;
- request param obrigatória ausente;
- request param não convertida;
- body ausente;
- JSON malformado;
- Content-Type não suportado;
- media type de saída incompatível.

Por isso, teste MVC é obrigatório.

Um teste unitário chamando o método Java não observa essas falhas.

---

### URI encoding

Caracteres especiais em query precisam ser codificados.

Exemplo lógico:

```text
tag=spring boot
```

Forma na URI:

```text
tag=spring%20boot
```

Use ferramentas que façam encoding corretamente.

Com curl:

```powershell
curl.exe --get `
  --data-urlencode "tag=spring boot" `
  ...
```

Não monte URIs com concatenação insegura quando valores vêm de entrada.

---

### Path e encoding

Valores no path também precisam de encoding.

Entretanto, barras possuem significado estrutural.

Não use path variable para transportar texto arbitrário com `/`.

Escolha query ou body quando o valor não representa um segmento estável.

---

### Controller fino com binding

O controller pode:

- declarar annotations de binding;
- normalizar coleção nula para vazia;
- adaptar request record;
- delegar ao service;
- adaptar response.

Ele não deve:

- validar regra complexa;
- selecionar repository;
- fazer parsing manual de JSON;
- dividir query por string;
- capturar exception genérica;
- consultar `HttpServletRequest` sem necessidade;
- usar `ObjectMapper` diretamente.

---

### Records de transporte nesta aula

Serão criados:

```text
RuntimeMessagePreviewRequest;

RuntimeMessageItemResponse;

RuntimeMessageQueryResponse;

RuntimeMessagePreviewResponse.
```

Eles existirão no package web.

A aula 367 revisará:

- diferença entre request e response;
- DTO versus domínio;
- mapping;
- nomes;
- evolução;
- exposição acidental;
- contratos separados.

Agora, use estruturas mínimas e explícitas.

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

Todos os testes anteriores devem permanecer verdes.

---

### 2. Criar RuntimeFormatOption

Package sugerido:

```text
br.com.formacao.backend.beans.formatter.
```

Código:

```java
public enum RuntimeFormatOption {
    COMPACT,
    DETAILED
}
```

Não adicione annotation Spring.

---

### 3. Evoluir o catalogo de formatters

Adicione método que localiza formatter por `RuntimeFormatOption`.

O catálogo já conhece os formatters injetados.

Mapeie pela propriedade semântica:

```text
COMPACT:
formatter id compact.

DETAILED:
formatter id detailed.
```

Se nenhum formatter corresponder, lance exception clara de configuração.

Não use nome concreto da classe no controller.

---

### 4. Criar RuntimeFormatOptionConverter

Package:

```text
br.com.formacao.backend.web.converter.
```

Implemente:

```java
Converter<String, RuntimeFormatOption>.
```

Regras:

1. rejeitar texto nulo;
2. aplicar `trim`;
3. rejeitar vazio;
4. converter com `Locale.ROOT`;
5. chamar `valueOf`;
6. não aplicar fallback.

Marque com:

```java
@Component.
```

---

### 5. Evoluir RuntimeMessageService

Adicione operações pequenas:

```text
messageAt(position);

query(limit, format, tags);

preview(format, messages).
```

Regras:

- posição da API começa em 1;
- converter para índice interno;
- limit restringe quantidade retornada;
- formatter vem do catálogo;
- tags são normalizadas sem mutar a entrada;
- preview não persiste;
- resultados são imutáveis.

Não adicione status HTTP ao service.

---

### 6. Criar RuntimeMessageItemResponse

Campos:

```text
position;

message.
```

Factory:

```text
from.
```

Não inclua repository, formatter bean ou metadata interna.

---

### 7. Criar RuntimeMessageQueryResponse

Campos:

```text
limit;

format;

tags;

messages.
```

Copie listas.

Use o nome textual do formato de maneira estável.

Não retorne o enum se a decisão do contrato exigir minúsculas; faça adaptação mecânica no response.

---

### 8. Criar RuntimeMessagePreviewRequest

Campos:

```text
format;

messages.
```

Copie a lista.

Não adicione annotations de Bean Validation.

Não transforme o request em bean.

---

### 9. Criar RuntimeMessagePreviewResponse

Campos:

```text
format;

messages.
```

O response não deve ser a mesma classe do request.

Mesmo que os campos sejam parecidos, as direções possuem responsabilidades diferentes.

A justificativa completa será aprofundada na aula 367.

---

### 10. Criar endpoint com PathVariable

No `RuntimeMessageController`:

```java
@GetMapping(
        path = "/messages/{position}",
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
public RuntimeMessageItemResponse messageAt(
        @PathVariable("position")
        int position
) {
}
```

Delegue ao service.

Não leia a lista diretamente no controller.

---

### 11. Criar endpoint com RequestParam

Mapping:

```java
@GetMapping(
        path = "/messages",
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
```

Parâmetros:

```java
@RequestParam(
        name = "limit",
        defaultValue = "10"
)
int limit;

@RequestParam(
        name = "format",
        defaultValue = "compact"
)
RuntimeFormatOption format;

@RequestParam(
        name = "tag",
        required = false
)
List<String> tags.
```

Normalize tags mecanicamente.

Delegue ao service.

---

### 12. Criar endpoint com RequestBody

Mapping:

```java
@PostMapping(
        path = "/messages/preview",
        consumes =
                MediaType.APPLICATION_JSON_VALUE,
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
```

Argumento:

```java
@RequestBody
RuntimeMessagePreviewRequest request.
```

Retorne:

```text
RuntimeMessagePreviewResponse.
```

Não use `ResponseEntity` nova nessa operação.

A aula 366 fará a evolução do envelope.

---

### 13. Executar a aplicacao

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

Use a porta:

```text
8081.
```

---

### 14. Testar PathVariable

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/messages/2
```

Confirme:

- 200;
- JSON;
- position 2;
- message correspondente.

---

### 15. Testar path invalido

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/messages/abc
```

Confirme:

```text
400.
```

Não documente o body padrão como contrato.

---

### 16. Testar query default

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/messages
```

Confirme:

```text
limit:
10.

format:
compact.

tags:
vazia.
```

---

### 17. Testar query explicita

```powershell
curl.exe --get -i `
  --data-urlencode "limit=2" `
  --data-urlencode "format=detailed" `
  --data-urlencode "tag=java" `
  --data-urlencode "tag=spring boot" `
  http://localhost:8081/api/v1/runtime/messages
```

Confirme conversão, lista e encoding.

---

### 18. Testar query invalida

```powershell
curl.exe -i `
  "http://localhost:8081/api/v1/runtime/messages?limit=abc"
```

Resultado:

```text
400.
```

Depois:

```text
format=desconhecido
```

Resultado:

```text
400.
```

---

### 19. Testar body valido

Crie arquivo temporário:

```json
{
  "format": "DETAILED",
  "messages": [
    "spring boot",
    "spring mvc"
  ]
}
```

Execute:

```powershell
curl.exe -i `
  -X POST `
  -H "Content-Type: application/json" `
  --data-binary "@preview-request.json" `
  http://localhost:8081/api/v1/runtime/messages/preview
```

Remova o arquivo depois da evidência.

---

### 20. Testar body ausente

```powershell
curl.exe -i `
  -X POST `
  -H "Content-Type: application/json" `
  http://localhost:8081/api/v1/runtime/messages/preview
```

Resultado:

```text
400.
```

---

### 21. Testar JSON malformado

Envie JSON incompleto.

Confirme:

```text
400.
```

Não altere o controller para capturar parsing.

---

### 22. Testar Content-Type incorreto

```powershell
curl.exe -i `
  -X POST `
  -H "Content-Type: text/plain" `
  --data "mensagem" `
  http://localhost:8081/api/v1/runtime/messages/preview
```

Resultado:

```text
415.
```

---

### 23. Criar RuntimeFormatOptionConverterTest

Teste unitário sem contexto:

- compact;
- COMPACT;
- valor com espaços;
- detailed;
- vazio;
- desconhecido.

Falhas devem ser explícitas.

---

### 24. Criar RuntimeMessagePathVariableWebMvcTest

Use:

```java
@WebMvcTest(
        RuntimeMessageController.class
)
```

Importe o converter se a slice não o detectar automaticamente de forma suficiente para o controller selecionado.

Use `@MockitoBean` para o service.

Valide:

- posição válida;
- conversão para int;
- delegação;
- JSON;
- posição alfabética retorna 400.

---

### 25. Criar RuntimeMessageRequestParamWebMvcTest

Cenários:

- defaults;
- limit explícito;
- format compact lowercase;
- format detailed uppercase;
- tags repetidas;
- tag com espaço codificado;
- limit inválido;
- format inválido.

Capture argumentos do mock para confirmar os valores Java recebidos.

---

### 26. Criar RuntimeMessageRequestBodyWebMvcTest

Cenários:

- JSON válido;
- Content-Type JSON;
- request record entregue ao service;
- response JSON;
- body ausente;
- JSON malformado;
- Content-Type text/plain.

Valide 200, 400 e 415.

---

### 27. Criar RuntimeMessageBindingErrorsWebMvcTest

Consolide a matriz:

```text
path não numérico:
400.

query numérica inválida:
400.

enum inválido:
400.

body ausente:
400.

JSON inválido:
400.

Content-Type incorreto:
415.
```

Não valide o body de erro padrão.

---

### 28. Criar RuntimeMessageBindingLiveServerIT

Use:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.RANDOM_PORT
)
```

Com Java `HttpClient`, teste:

- path válido;
- query repetida;
- POST JSON;
- JSON malformado;
- Content-Type incorreto.

Use porta dinâmica.

Feche recursos.

---

### 29. Criar RuntimeMessageInputArchitectureTest

Valide:

- controller possui construtor único;
- nenhuma field de repository;
- nenhum `HttpServletRequest`;
- nenhum `ObjectMapper`;
- nenhum `Map` cru como request body;
- request e responses não possuem stereotype;
- nenhum `@Valid`;
- nenhum constraint de Bean Validation;
- nenhuma `ResponseEntity` nova nos métodos da aula;
- service não importa annotations web.

---

### 30. Criar RuntimeMessageBindingContractTest

Registre os três contratos:

```text
método;

path;

fonte de entrada;

tipo Java;

default;

media type;

status atual.
```

O teste deve proteger mappings, não reproduzir documentação inteira.

---

### 31. Documentar request-input-regions.md

Compare:

```text
path;

query;

header;

cookie;

body.
```

Marque o que foi praticado e o que ficou futuro.

---

### 32. Documentar path-variable.md

Inclua:

- identidade;
- nome explícito;
- conversão;
- erro;
- encoding;
- valor válido versus regra semântica.

---

### 33. Documentar request-param.md

Inclua:

- required;
- defaultValue;
- optional;
- lista repetida;
- conversão;
- query encoding;
- filtro versus identidade.

---

### 34. Documentar request-body.md

Inclua:

- Content-Type;
- consumes;
- HttpMessageConverter;
- record;
- body obrigatório;
- JSON malformado;
- 415;
- ausência de validação.

---

### 35. Documentar http-message-converters.md

Desenhe:

```text
JSON request
-> converter
-> request record
-> controller
-> response record
-> converter
-> JSON response.
```

---

### 36. Documentar type-conversion.md

Inclua:

- String para int;
- String para enum;
- converter customizado;
- converter MVC versus desserialização JSON;
- falha antes do controller.

---

### 37. Documentar uri-encoding.md

Inclua:

- espaço;
- acentos;
- caracteres reservados;
- `--data-urlencode`;
- path versus query;
- evitar concatenação manual.

---

### 38. Documentar binding-errors.md

Crie matriz com:

```text
entrada;

etapa;

status observado;

controller executado?;

body contratual?
```

Para todos os erros da aula.

---

### 39. Documentar binding-vs-validation.md

Compare:

```text
conversão;

estrutura;

regra de campo;

regra de negócio.
```

Explique por que `limit=-1` ainda não está protegido por Bean Validation.

---

### 40. Documentar runtime-input-contracts.md

Registre os três endpoints.

Não trate a estrutura de erro padrão como contrato oficial.

Indique dívidas:

- status de posição inexistente;
- validation;
- error response;
- DTO review;
- ResponseEntity completa.

---

### 41. Criar scripts

`45_testar_path_variable.ps1` testa posição válida e inválida.

`46_testar_request_params.ps1` testa defaults, enum e tags.

`47_testar_request_body.ps1` usa arquivo JSON temporário e o remove.

`48_testar_erros_binding.ps1` testa 400 e 415.

`49_testar_uri_encoding.ps1` usa `--data-urlencode`.

`50_executar_testes_binding.ps1` executa os testes da aula.

---

### 42. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessagePathVariableWebMvcTest,RuntimeMessageRequestParamWebMvcTest,RuntimeMessageRequestBodyWebMvcTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 43. Executar testes de erros

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageBindingErrorsWebMvcTest test
```

Confirme que erros esperados são assertions.

---

### 44. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageBindingLiveServerIT test
```

Confirme porta aleatória e encerramento.

---

### 45. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 46. Empacotar e executar

```powershell
.\mvnw.cmd clean package

java -jar target\*.jar `
  --spring.profiles.active=local,web-lab
```

Repita os três contratos.

Encerre com `Ctrl+C`.

---

### 47. Revisar escopo

Confirme:

```text
@PathVariable:
um endpoint.

@RequestParam:
um endpoint.

@RequestBody:
um endpoint.

@Valid:
zero.

constraints:
zero.

exception handler:
zero.

ProblemDetail:
zero.

header customizado:
zero.

persistência:
zero.
```

---

### 48. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- arquivo JSON temporário;
- target;
- logs;
- body de erro capturado;
- mapper genérico;
- validação antecipada;
- segredo;
- configuração local.

---

## Entendendo o que foi feito

### O path virou argumento tipado

Um segmento textual foi convertido para `int` antes da execução do método.

### A query virou opcoes Java

Defaults, enum e lista repetida foram resolvidos pela infraestrutura MVC.

### O JSON virou record

O message converter leu o body e criou uma estrutura tipada.

### Erros aconteceram antes do controller

Conversão, parsing e media type foram testados na camada correta.

### Binding ficou separado de validation

A entrada pode ser convertível e ainda ser semanticamente inválida.

---

## Erros comuns importantes

### Usar RequestBody para qualquer valor

Valores simples de filtro pertencem normalmente à query.

### Colocar objeto grande na PathVariable

Path deve representar segmentos estáveis e identificadores.

### Fazer parsing manual de JSON

Isso ignora converters e duplica infraestrutura.

### Aplicar fallback em enum desconhecido

Erro de digitação vira comportamento silencioso.

### Tratar binding como validação completa

Converter um número não prova que ele está no intervalo permitido.

---

## Comandos uteis

### Path variable

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/messages/2
```

### Query

```powershell
curl.exe --get -i `
  --data-urlencode "limit=2" `
  --data-urlencode "format=detailed" `
  --data-urlencode "tag=spring boot" `
  http://localhost:8081/api/v1/runtime/messages
```

### Body

```powershell
curl.exe -i -X POST `
  -H "Content-Type: application/json" `
  --data-binary "@preview-request.json" `
  http://localhost:8081/api/v1/runtime/messages/preview
```

### Testes

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Path UUID

Crie uma fixture de teste com:

```java
@PathVariable UUID id.
```

Envie UUID válido e inválido.

Não altere o contrato de produção.

### Parte 2 — Parametro obrigatorio

Em controller de teste, crie:

```text
@RequestParam(required=true).
```

Confirme 400 quando ausente.

### Parte 3 — Boolean

Adicione temporariamente query:

```text
uppercase=true.
```

Observe conversão para boolean.

Remova antes do commit.

### Parte 4 — Lista repetida

Envie três tags repetidas.

Confirme ordem e encoding.

### Parte 5 — JSON enum

Envie:

```json
"format": "compact"
```

Compare com `"COMPACT"`.

Documente a diferença entre converter MVC e desserialização JSON.

### Parte 6 — Body desconhecido

Adicione campo extra ao JSON.

Observe o comportamento atual sem transformá-lo em política oficial.

### Parte 7 — Binding versus validation

Envie:

```text
limit=-1.
```

Explique por que o binding funciona e qual aula deverá proteger a regra.

### Parte 8 — ADR

Registre:

```text
path para identidade;

query para filtro;

body para representação;

nomes explícitos nas annotations;

converter sem fallback;

records tipados;

sem parsing manual;

binding separado de validation;

erros padrão ainda não são contrato.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 364 foi preservada;
- o mesmo projeto foi continuado;
- regiões path, query e body foram diferenciadas;
- `@PathVariable`, `@RequestParam` e `@RequestBody` foram usados;
- resolução de argumentos Spring MVC foi explicada;
- nomes explícitos foram usados nas annotations;
- path variable foi convertida de String para int;
- posição válida foi delegada ao service;
- path não numérico retornou 400;
- posição convertível foi diferenciada de posição semanticamente válida;
- query foi usada para opções de consulta;
- `required` foi explicado;
- `defaultValue` foi aplicado;
- defaults de limit e format foram testados;
- tags opcionais foram normalizadas;
- parâmetros repetidos foram ligados a lista;
- lista recebida não permaneceu mutável;
- `RuntimeFormatOption` foi criado;
- enum não virou bean;
- converter customizado foi criado;
- converter aceitou caixa diferente e espaços laterais;
- converter rejeitou valor desconhecido;
- nenhum fallback silencioso foi aplicado;
- diferença entre converter MVC e desserialização JSON foi explicada;
- `RuntimeMessagePreviewRequest` foi criado;
- request record não virou bean;
- `@RequestBody` permaneceu obrigatório;
- Content-Type JSON foi exigido;
- `consumes` e `produces` foram declarados;
- JSON válido foi desserializado;
- JSON malformado retornou 400;
- body ausente retornou 400;
- Content-Type incorreto retornou 415;
- controller não fez parsing manual;
- `HttpMessageConverter` foi explicado;
- records de response foram criados;
- request e response não compartilharam a mesma classe;
- listas dos records foram copiadas;
- service recebeu dados tipados;
- service não recebeu annotations web;
- preview não persistiu;
- endpoint de path foi criado;
- endpoint de query foi criado;
- endpoint de body foi criado;
- métodos novos retornaram records diretamente;
- aprofundamento de `ResponseEntity` não foi antecipado;
- status de criação e header Location não foram antecipados;
- DTO architecture da aula 367 não foi antecipada;
- Bean Validation não foi adicionada;
- `@Valid` não foi usado;
- constraints não foram usadas;
- binding foi diferenciado de validation;
- validation foi diferenciada de regra de negócio;
- erros anteriores ao controller foram testados;
- URI encoding foi explicado e testado;
- concatenação manual insegura de URI foi evitada;
- `RuntimeFormatOptionConverterTest` foi criado;
- `RuntimeMessagePathVariableWebMvcTest` foi criado;
- `RuntimeMessageRequestParamWebMvcTest` foi criado;
- `RuntimeMessageRequestBodyWebMvcTest` foi criado;
- `RuntimeMessageBindingErrorsWebMvcTest` foi criado;
- `RuntimeMessageBindingLiveServerIT` foi criado;
- teste live usou porta aleatória;
- Java `HttpClient` foi usado;
- contexto live foi fechado;
- `RuntimeMessageInputArchitectureTest` foi criado;
- controller não possui repository, `HttpServletRequest`, `ObjectMapper` ou Map cru;
- `RuntimeMessageBindingContractTest` foi criado;
- body de erro padrão não virou contrato;
- documentação das regiões de entrada foi criada;
- path variable foi documentada;
- request param foi documentado;
- request body foi documentado;
- message converters foram documentados;
- type conversion foi documentada;
- URI encoding foi documentado;
- binding errors foram documentados;
- binding versus validation foi documentado;
- contratos de entrada foram documentados;
- scripts foram criados;
- testes focados, erros, live, suite e package passaram;
- arquivo JSON temporário foi removido;
- nenhum exception handler, ProblemDetail, banco, JPA, Flyway, Security ou Validation foi adicionado;
- ponte para a aula 366 está correta;
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
git commit -m "feat(m14): adicionar binding de path query e body"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- arquivo JSON temporário;
- responses de erro capturadas;
- mapper genérico;
- validação antecipada;
- configurações locais.

---

## Fechamento e ponte para a proxima aula

Nesta aula, as três principais regiões de entrada HTTP foram ligadas a tipos Java.

O mapa consolidado ficou:

```text
@PathVariable:
segmento do path.

@RequestParam:
query parameter.

@RequestBody:
conteúdo HTTP.

ConversionService:
texto para tipo simples.

Converter customizado:
texto para enum.

HttpMessageConverter:
body para objeto.

Content-Type:
formato enviado.

consumes:
formato aceito.

URI encoding:
transporte seguro de caracteres.

400:
binding ou parsing inválido.

415:
media type de entrada não suportado.
```

Você criou:

```text
GET /api/v1/runtime/messages/{position};

GET /api/v1/runtime/messages;

POST /api/v1/runtime/messages/preview.
```

Você comprovou:

```text
path convertida para int;

query convertida para int e enum;

defaults aplicados;

tags repetidas convertidas para lista;

JSON convertido para record;

JSON inválido rejeitado;

body ausente rejeitado;

Content-Type incompatível rejeitado;

controller fino preservado.
```

A decisão central foi:

```text
cada dado HTTP deve ser extraido
da regiao que melhor representa sua semantica
e convertido antes de chegar ao caso de uso.
```

A próxima aula será:

```text
366 - M14.11 - ResponseEntity status headers body
```

Nela, você continuará no mesmo projeto e estudará:

- resposta HTTP explícita;
- `ResponseEntity`;
- builders;
- `HttpStatus`;
- `HttpStatusCode`;
- status 200;
- status 201;
- status 202;
- status 204;
- status 400;
- status 404;
- status 409;
- headers;
- `Location`;
- `Content-Type`;
- headers customizados;
- body presente;
- body ausente;
- respostas condicionais;
- contratos de criação;
- testes de status, headers e body.

A aula 365 respondeu:

```text
como path, query e body
viram entradas Java?
```

A aula 366 responderá:

```text
como controlar explicitamente
status, headers e body da resposta?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei escolher entre path, query e body.
- [ ] Sei explicar conversão de argumentos MVC.
- [ ] Sei usar defaults e listas em `@RequestParam`.
- [ ] Sei explicar o papel de `HttpMessageConverter`.
- [ ] Sei diferenciar binding de validation.

---

## Troubleshooting adicional

### Path variable retorna 400

Revise o tipo Java, o texto da URI e converters registrados.

### Request param default nao aparece

Revise o nome explícito e o mapping chamado.

### Lista de tags chega nula

Normalize a entrada opcional antes de delegar.

### Enum lowercase falha

Confirme que o converter está registrado na slice e no contexto real.

### RequestBody retorna 415

Revise `Content-Type`, `consumes` e o body enviado.

### JSON retorna 400

Revise sintaxe, nomes, tipos e enum esperado.

---

## Perguntas de revisao

1. Quando usar path variable?
2. Quando usar request param?
3. Quando usar request body?
4. Quem resolve argumentos do controller?
5. Como o texto vira int?
6. O que ocorre com `position=abc`?
7. Qual é o padrão de `required`?
8. O que `defaultValue` altera?
9. Como enviar tags repetidas?
10. Para que serve um converter?
11. O converter MVC atua no JSON?
12. O que faz `@RequestBody`?
13. Quem desserializa JSON?
14. Para que serve `consumes`?
15. O que significa 415?
16. O que significa JSON malformado?
17. Binding e validation são iguais?
18. `limit=-1` falha no binding?
19. O body de erro padrão já é contrato?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Para segmento de identidade ou endereço.
2. Para filtro e opção de consulta.
3. Para representação estruturada.
4. A infraestrutura Spring MVC.
5. Pelo ConversionService.
6. Retorna 400 antes do método.
7. True.
8. Torna a entrada efetivamente opcional.
9. Repetindo a chave.
10. Converter texto para tipo.
11. Não automaticamente.
12. Liga o conteúdo a um objeto.
13. Um HttpMessageConverter.
14. Declarar media type de entrada.
15. Formato de entrada não suportado.
16. Erro 400 de leitura.
17. Não.
18. Não; converte e exige validação.
19. Não.
20. ResponseEntity status headers body.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 365 - M14.10 - Request body PathVariable RequestParam

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei path, query e body.
- Entendi a resolução de argumentos do Spring MVC.
- Usei `@PathVariable` com nome explícito.
- Converti uma posição para `int`.
- Observei 400 em conversão inválida.
- Diferenciei conversão de regra semântica.
- Usei `@RequestParam`.
- Estudei `required` e `defaultValue`.
- Apliquei defaults de limit e format.
- Recebi tags repetidas como lista.
- Normalizei listas opcionais.
- Criei `RuntimeFormatOption`.
- Criei converter customizado de texto para enum.
- Aceitei lowercase sem fallback silencioso.
- Diferenciei converter MVC de desserialização JSON.
- Usei `@RequestBody`.
- Criei um request record mínimo.
- Declarei `consumes` e `produces`.
- Entendi `HttpMessageConverter`.
- Converti JSON em objeto Java.
- Observei 400 para body ausente.
- Observei 400 para JSON malformado.
- Observei 415 para Content-Type incompatível.
- Criei response records separados.
- Mantive o controller fino.
- Mantive o service sem annotations web.
- Testei URI encoding.
- Criei testes MockMvc para path, query e body.
- Criei matriz de erros de binding.
- Criei teste com servidor real e porta aleatória.
- Diferenciei binding de validation.
- Não adicionei Bean Validation.
- Não aprofundei ResponseEntity.
- Não antecipei a arquitetura completa de DTOs.
- Próxima aula: ResponseEntity status headers body.
```

---

## Referencia tecnica curta

```text
PathVariable:
path.

RequestParam:
query.

RequestBody:
body.

Converter:
texto.

MessageConverter:
conteúdo.

DefaultValue:
fallback.

Required:
obrigatoriedade.

400:
entrada inválida.

415:
media type inválido.

Validation:
próxima etapa.
```

Regra final:

```text
entradas HTTP devem ser ligadas a tipos Java conforme sua semantica: PathVariable representa segmentos do recurso, RequestParam representa filtros e opcoes, RequestBody representa conteudo estruturado; conversao e desserializacao precisam ocorrer pela infraestrutura Spring MVC, converters nao devem aplicar fallbacks silenciosos, URI encoding deve ser respeitado e erros de binding devem permanecer separados de validacao, regra de negocio e do futuro contrato padronizado de erros.
```
