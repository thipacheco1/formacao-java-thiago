# 367 - M14.12 - DTO request response

## Apresentacao da aula

Na aula 366, você passou a controlar explicitamente o envelope HTTP devolvido pela camada web.

Foram praticados:

```text
ResponseEntity;

HttpStatus;

HttpStatusCode;

Location;

ETag;

Last-Modified;

Cache-Control;

headers customizados;

body presente;

body ausente;

200;

201;

204;

304;

400;

404;

409.
```

Também foi criado um pequeno recurso em memória:

```text
managed runtime message.
```

Os contratos atuais incluem:

```text
POST /api/v1/runtime/managed-messages;

GET /api/v1/runtime/managed-messages/{id};

DELETE /api/v1/runtime/managed-messages/{id}.
```

A implementação já separa parte das responsabilidades.

O service retorna outcomes de aplicação.

O controller traduz esses outcomes para HTTP.

Agora surge uma nova pergunta:

```text
quais objetos devem representar
a entrada e a saida da API
sem expor o modelo interno?
```

A resposta passa pelo conceito de:

```text
DTO.
```

DTO significa:

```text
Data Transfer Object.
```

Um DTO é um objeto criado para transportar dados entre fronteiras.

Na aplicação desta formação, a fronteira principal da aula será:

```text
cliente HTTP
    <-> camada web
    <-> camada de aplicacao.
```

Os DTOs de request representam os dados aceitos do cliente.

Os DTOs de response representam os dados publicados pela API.

Eles não devem ser confundidos com:

- entidade de persistência;
- agregado de domínio;
- command de aplicação;
- result de aplicação;
- configuração;
- bean de infraestrutura;
- objeto usado internamente pelo repository.

Um erro comum é reutilizar a mesma classe em todos os lugares.

Exemplo problemático:

```text
JSON de entrada;

entity JPA;

objeto do service;

response JSON.
```

Esse acoplamento parece rápido no início.

Depois, qualquer alteração interna pode mudar o contrato externo.

Nesta aula, você aprenderá a separar:

```text
request DTO;

response DTO;

modelo de aplicacao;

modelo de dominio;

modelo de persistencia.
```

O projeto ainda não possui entidade JPA neste módulo.

Mesmo assim, a fronteira será construída corretamente antes da persistência.

A aula trabalhará com os endpoints já existentes.

Não será criado um novo conjunto de operações apenas para exibir DTOs.

O foco será reorganizar e proteger o contrato atual.

Os DTOs serão específicos por operação.

Exemplos:

```text
CreateManagedRuntimeMessageRequest;

ManagedRuntimeMessageCreatedResponse;

ManagedRuntimeMessageDetailResponse;

RuntimeMessagePreviewRequest;

RuntimeMessagePreviewResponse;

RuntimeMessageQueryResponse.
```

Não será criado:

```text
ManagedRuntimeMessageDto
```

para servir ao mesmo tempo como:

- create;
- update;
- detail;
- list;
- internal model.

Também serão estudados:

- over-posting;
- mass assignment;
- campos sensíveis;
- campos somente de leitura;
- campos gerados pelo servidor;
- imutabilidade;
- records;
- listas defensivas;
- nomes estáveis;
- nullabilidade;
- campos opcionais;
- evolução compatível;
- versionamento;
- DTOs por caso de uso;
- objetos aninhados;
- contratos de lista;
- contratos de detalhe;
- exposição acidental;
- testes de contrato.

A conversão entre os tipos continuará pequena e local.

Nesta aula, factories estáticas simples poderão existir nos próprios response DTOs.

Exemplo:

```java
public static ManagedRuntimeMessageDetailResponse from(
        ManagedRuntimeMessage source
) {
}
```

Entretanto, a extração da conversão para classes dedicadas será feita somente em:

```text
368 - M14.13 - Mappers manuais
```

A validação declarativa ficará para:

```text
369 - M14.14 - Bean Validation
```

Portanto, esta aula não adicionará:

- `@Valid`;
- `@NotBlank`;
- `@NotNull`;
- `@Size`;
- `@Min`;
- `@Max`;
- constraint customizada;
- mapper framework;
- MapStruct;
- ModelMapper;
- reflexão para copiar campos;
- `@ControllerAdvice`;
- Problem Details;
- JPA;
- Flyway;
- PostgreSQL.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
368 - M14.13 - Mappers manuais
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
363:
primeiros endpoints.

364:
HTTP e REST.

365:
binding de entrada.

366:
status, headers e body.

367:
DTO request response.

368:
mappers manuais.

369:
Bean Validation.

370:
validações customizadas.

371:
service layer, use cases e transações.
```

A aula 366 respondeu:

```text
como controlar o envelope HTTP?
```

A aula 367 responderá:

```text
como desenhar os objetos
que atravessam a fronteira HTTP?
```

Nesta aula:

```text
DTO:
sim.

request DTO:
sim.

response DTO:
sim.

modelo interno:
sim.

entidade:
conceito e fronteira.

record:
sim.

imutabilidade:
sim.

over-posting:
sim.

mass assignment:
sim.

dados sensíveis:
sim.

campos gerados:
sim.

DTO por operação:
sim.

list response:
sim.

detail response:
sim.

nullabilidade:
sim.

compatibilidade:
sim.

mapper dedicado:
não.

Bean Validation:
não.

persistência:
não.

error response:
não aprofundado.
```

A regra central será:

```text
o contrato HTTP deve ser desenhado
para o consumidor,
nao derivado automaticamente
da estrutura interna da aplicacao.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A organização será ajustada para:

```text
src/main/java/br/com/formacao/backend
├── beans
│   ├── managedmessage
│   │   ├── ManagedRuntimeMessage.java
│   │   ├── ManagedRuntimeMessageCreateCommand.java
│   │   ├── ManagedRuntimeMessageCreateOutcome.java
│   │   ├── ManagedRuntimeMessageCreateResult.java
│   │   ├── ManagedRuntimeMessageService.java
│   │   └── ManagedRuntimeMessageStore.java
│   └── service
│       ├── RuntimeMessagePreviewCommand.java
│       ├── RuntimeMessagePreviewResult.java
│       ├── RuntimeMessageQuery.java
│       ├── RuntimeMessageQueryResult.java
│       └── RuntimeMessageService.java
└── web
    ├── controller
    │   ├── ManagedRuntimeMessageController.java
    │   └── RuntimeMessageController.java
    ├── request
    │   ├── CreateManagedRuntimeMessageRequest.java
    │   └── RuntimeMessagePreviewRequest.java
    └── response
        ├── ManagedRuntimeMessageCreatedResponse.java
        ├── ManagedRuntimeMessageDetailResponse.java
        ├── RuntimeMessageItemResponse.java
        ├── RuntimeMessagePreviewResponse.java
        └── RuntimeMessageQueryResponse.java
```

Novos testes:

```text
src/test/java/br/com/formacao/backend
├── web
│   ├── DtoRequestContractTest.java
│   ├── DtoResponseContractTest.java
│   ├── DtoSerializationContractTest.java
│   ├── DtoDeserializationContractTest.java
│   ├── DtoOverPostingProtectionWebMvcTest.java
│   ├── DtoSensitiveDataExposureTest.java
│   ├── DtoOperationSpecificityTest.java
│   ├── DtoCompatibilityTest.java
│   ├── DtoArchitectureTest.java
│   └── DtoLiveContractIT.java
└── beans
    ├── ManagedRuntimeMessageServiceContractTest.java
    └── RuntimeMessageApplicationModelTest.java
```

Documentação externa:

```text
docs
├── dto-definition.md
├── request-vs-response-dto.md
├── transport-application-domain-persistence.md
├── operation-specific-dtos.md
├── over-posting-mass-assignment.md
├── sensitive-readonly-fields.md
├── dto-immutability-records.md
├── dto-nullability-optionality.md
├── dto-list-detail-contracts.md
├── dto-versioning-compatibility.md
└── dto-contract-baseline.md
```

Scripts:

```text
scripts
├── 57_testar_request_dtos.ps1
├── 58_testar_response_dtos.ps1
├── 59_testar_over_posting.ps1
├── 60_testar_exposicao_sensivel.ps1
├── 61_testar_compatibilidade_dto.ps1
└── 62_executar_testes_dto.ps1
```

Resultados esperados:

```text
request DTO:
somente campos enviados pelo cliente.

response DTO:
somente campos publicados pela API.

id no create request:
ausente.

createdAt no create request:
ausente.

version no create request:
ausente.

normalizedValue no response:
ausente.

chave interna do store:
ausente.

request e response:
classes diferentes.

create e detail:
classes diferentes.

web DTO no service:
ausente.

HTTP annotation no modelo de aplicacao:
ausente.

entity no controller:
ausente.

lista:
imutável.

records:
sem stereotypes.

Optional como field de DTO:
ausente.

Map cru:
ausente.

JsonNode como contrato:
ausente.

BaseDto:
ausente.

DTO genérico:
ausente.
```

---

## Conceito essencial

### O que e DTO

DTO é um objeto de transporte.

Ele existe para mover dados entre componentes, processos ou fronteiras.

Um DTO deve possuir:

- propósito;
- direção;
- contrato;
- campos conhecidos;
- semântica documentada.

Um DTO não é apenas uma classe com getters.

O nome e o contexto precisam revelar:

```text
de onde vem;

para onde vai;

para qual operação serve.
```

---

### Request DTO

Request DTO representa dados aceitos do cliente.

Exemplo:

```java
public record CreateManagedRuntimeMessageRequest(
        String value
) {
}
```

O cliente pode fornecer:

```text
value.
```

O cliente não pode fornecer:

```text
id;

createdAt;

version;

normalizedValue;

internalStatus.
```

Esses valores pertencem ao servidor.

---

### Response DTO

Response DTO representa dados publicados ao cliente.

Exemplo:

```java
public record ManagedRuntimeMessageDetailResponse(
        long id,
        String value,
        Instant createdAt,
        long version
) {
}
```

O response pode conter campos gerados pelo servidor.

Ele não precisa aceitar os mesmos campos em uma request.

---

### Direcao importa

Mesmo quando request e response possuem campos parecidos, são contratos diferentes.

Exemplo:

```text
Create request:
value.

Created response:
id, value, createdAt, version.
```

Reutilizar a response como request permite que o cliente tente enviar campos somente de leitura.

Reutilizar a request como response esconde metadata que o cliente precisa receber.

---

### DTO nao e dominio

Um DTO descreve transporte.

Um objeto de domínio descreve conceitos e regras do negócio.

Exemplo:

```text
DTO:
texto recebido em JSON.

domínio:
mensagem válida, identidade, versão e invariantes.
```

O domínio não deve depender de:

- JSON;
- annotations MVC;
- status HTTP;
- nomes de headers;
- formato da URL.

---

### DTO nao e entidade

Entidade de persistência descreve mapeamento e identidade no mecanismo de dados.

Ela pode possuir:

- annotations JPA;
- relacionamentos;
- lazy loading;
- versão otimista;
- campos técnicos;
- construtor exigido pelo provider.

Expor entity diretamente pode causar:

- contrato acoplado à tabela;
- serialização de relações;
- lazy loading acidental;
- vazamento de campos;
- ciclos JSON;
- mass assignment;
- dificuldade de versionar a API.

O módulo ainda não usa JPA, mas a proteção começa agora.

---

### Modelo de aplicacao

A camada de aplicação pode usar commands e results.

Exemplo:

```java
public record ManagedRuntimeMessageCreateCommand(
        String value
) {
}
```

e:

```text
ManagedRuntimeMessageCreateResult.
```

O controller converte request DTO para command.

O service retorna result.

O controller converte result para response DTO e `ResponseEntity`.

Nesta aula, essa conversão será pequena e local.

---

### Por que command interno

O request DTO pertence à web.

Um command pertence ao caso de uso.

Hoje, ambos podem possuir:

```text
value.
```

Amanhã, o request pode mudar por compatibilidade HTTP, enquanto o caso de uso permanece.

Separar evita que:

```text
service dependa do package web.
```

---

### Modelo por operacao

Prefira objetos específicos:

```text
CreateManagedRuntimeMessageRequest;

UpdateManagedRuntimeMessageRequest;

ManagedRuntimeMessageDetailResponse;

ManagedRuntimeMessageSummaryResponse.
```

Evite:

```text
ManagedRuntimeMessageDto
```

com vinte campos opcionais usados em todos os endpoints.

DTO genérico costuma gerar:

- nulls;
- regras condicionais;
- campos sem sentido;
- over-posting;
- documentação confusa;
- testes frágeis.

---

### Create request

Create request contém somente o que o cliente precisa fornecer para criação.

Não inclua campos gerados.

Exemplo correto:

```text
value.
```

Exemplo inadequado:

```text
id;

version;

createdAt;

deleted;

ownerInternalCode.
```

---

### Update request

Mesmo sem endpoint de update nesta aula, o conceito precisa estar claro.

Update pode ter regras diferentes de create.

Por isso, não reutilize automaticamente o create request.

Exemplo futuro:

```text
Create:
value obrigatório.

Update:
novo value e versão esperada.

Patch:
campos opcionais com semântica parcial.
```

A aula não criará esses endpoints.

---

### Detail response

Detail response pode publicar informação completa permitida para um recurso.

No laboratório:

```text
id;

value;

createdAt;

version.
```

Ele não publica:

```text
normalizedValue;

chave de deduplicação;

estrutura do ConcurrentHashMap;

nome de bean;

dados de infraestrutura.
```

---

### Summary response

Listagens frequentemente usam uma visão resumida.

Exemplo futuro:

```text
id;

value resumido;

createdAt.
```

Não reutilize detail response se isso:

- aumenta payload;
- expõe campos;
- acopla telas;
- dificulta evolução.

Nesta aula, o conceito será testado com fixtures sem criar endpoint de listagem novo.

---

### Over-posting

Over-posting ocorre quando o cliente consegue enviar mais campos do que deveria.

Exemplo inseguro:

```json
{
  "value": "mensagem",
  "id": 999,
  "version": 100,
  "createdAt": "2030-01-01T00:00:00Z"
}
```

Se a aplicação liga esse JSON diretamente ao modelo interno e copia todos os campos, o cliente influencia valores controlados pelo servidor.

A proteção principal é:

```text
request DTO limitado.
```

---

### Mass assignment

Mass assignment é a atribuição automática de campos recebidos a um objeto interno.

Exemplo perigoso:

```text
copiar todas as propriedades pelo nome
do JSON para a entidade.
```

Riscos:

- elevação de privilégio;
- mudança de owner;
- mudança de status;
- manipulação de preço;
- alteração de versão;
- bypass de regra.

Não use reflexão genérica para copiar tudo.

A aula 368 criará mappers explícitos.

---

### Campo somente de leitura

Campos somente de leitura pertencem ao response, não ao request.

Exemplos:

- id;
- createdAt;
- updatedAt;
- version;
- status calculado;
- links;
- totals;
- campos derivados.

A ausência no request é melhor que receber e ignorar silenciosamente.

---

### Dados sensiveis

Campos sensíveis não devem entrar no response apenas porque existem no modelo interno.

Exemplos:

- senha;
- hash;
- token;
- segredo;
- chave de API;
- documento completo;
- observação interna;
- razão de risco;
- metadata de segurança.

DTO de response funciona como lista de permissão.

Somente os campos declarados são publicados.

---

### Whitelist versus blacklist

Whitelist:

```text
publicar somente campos explicitamente escolhidos.
```

Blacklist:

```text
publicar tudo, exceto alguns campos proibidos.
```

Para APIs, prefira whitelist por meio de response DTO específico.

Novos campos internos não aparecem automaticamente.

---

### Record

Records são adequados para muitos DTOs porque oferecem:

- estado final;
- accessors;
- equals;
- hashCode;
- toString;
- construção explícita;
- concisão.

DTO não precisa ser mutável para o Jackson desserializar em um projeto moderno configurado corretamente.

O laboratório já utiliza records com sucesso.

---

### Imutabilidade estrutural

Record não torna automaticamente listas imutáveis.

Faça:

```java
public RuntimeMessagePreviewRequest {
    messages =
            messages == null
                    ? List.of()
                    : List.copyOf(messages);
}
```

Isso evita que uma coleção externa seja modificada depois da construção.

---

### Nullabilidade

Um DTO precisa documentar quais campos podem ser nulos.

Nesta aula, sem Bean Validation, algumas combinações ainda poderão ser desserializadas.

A política será:

```text
coleção ausente:
normalizada para lista vazia quando a semântica permitir.

campo escalar ausente:
permanece null e será tratado pelo caso de uso transitório.
```

A aula 369 adicionará constraints declarativas.

---

### Optional em DTO

Evite:

```java
Optional<String>
```

como field de request ou response DTO.

`Optional` foi desenhado principalmente para retorno de método.

Em contratos JSON, ele pode:

- confundir serialização;
- dificultar documentação;
- misturar ausência de campo com null;
- acoplar API a detalhe Java.

Use campo nullable conscientemente e validação apropriada.

---

### Colecoes

Responses devem retornar:

- lista vazia em vez de null;
- cópia imutável;
- tipo estável;
- ordem documentada quando relevante.

Requests também devem evitar expor coleção mutável internamente.

---

### Tipos adequados

Use tipos que expressem o contrato:

```text
Instant:
instante UTC.

UUID:
identificador UUID.

long:
identificador numérico.

enum:
conjunto fechado.

List<T>:
coleção ordenada.
```

Não transforme tudo em `String` apenas porque JSON é textual.

---

### Nomes de campos

Nomes públicos devem ser:

- claros;
- estáveis;
- consistentes;
- orientados ao consumidor.

Exemplo:

```text
createdAt
```

é melhor que:

```text
dtCriacaoInterna;
```

Não exponha convenções de coluna ou nomes de legado sem necessidade.

---

### Nomes de classes

Padrão desta formação:

```text
...Request;

...Response;

...Command;

...Result.
```

O sufixo revela direção e papel.

Evite nomes vagos:

```text
Data;

Payload;

Model;

Info;

GenericDto.
```

quando existe uma intenção específica.

---

### Objetos aninhados

DTOs podem conter outros DTOs.

Exemplo conceitual:

```text
CustomerResponse
    -> AddressResponse.
```

Não reutilize automaticamente um objeto de domínio aninhado.

Cada parte publicada precisa ser intencional.

A aula não criará uma hierarquia complexa.

---

### Serializacao nao define arquitetura

Jackson consegue serializar muitas classes.

Isso não significa que todas devem ser expostas.

A pergunta não é:

```text
o Jackson consegue converter?
```

A pergunta é:

```text
este tipo representa o contrato que queremos publicar?
```

---

### Desserializacao nao autoriza campo

Mesmo que o mapper aceite campos desconhecidos ou ignore determinadas propriedades, o contrato deve limitar explicitamente o request.

Proteção não deve depender somente da configuração global do Jackson.

Use request DTO específico.

---

### Compatibilidade de request

Mudanças potencialmente incompatíveis:

- renomear campo;
- mudar tipo;
- tornar campo opcional em obrigatório;
- remover valor de enum;
- mudar formato de data;
- rejeitar campo antes aceito;
- alterar significado.

Adicionar campo opcional pode ser compatível, mas precisa de default ou semântica clara.

---

### Compatibilidade de response

Mudanças potencialmente incompatíveis:

- remover campo;
- renomear;
- mudar tipo;
- mudar nullabilidade;
- mudar unidade;
- mudar ordenação contratual;
- alterar enum;
- trocar estrutura de objeto por lista.

Adicionar campo pode quebrar clientes rígidos.

Teste e comunicação continuam necessários.

---

### Versionamento de DTO

O path já usa:

```text
/v1.
```

DTOs pertencem a essa versão de contrato.

Não crie:

```text
RequestV1;

ResponseV1
```

em todos os nomes antecipadamente.

O package e o endpoint já fornecem contexto.

Uma v2 real pode exigir package ou módulo separado quando surgir necessidade.

---

### Factory estatica no response

Nesta aula, factories simples são permitidas:

```java
public static ManagedRuntimeMessageDetailResponse from(
        ManagedRuntimeMessage source
) {
}
```

A factory:

- escolhe campos;
- copia valores;
- não consulta repository;
- não decide regra;
- não formata HTTP;
- não acessa Spring.

Quando as conversões crescerem, serão extraídas na aula 368.

---

### Controller e conversao

O controller pode fazer uma conversão mecânica pequena:

```text
request
    -> command;

result
    -> response.
```

Ele não deve executar transformação complexa.

Sinais de que um mapper dedicado é necessário:

- muitos campos;
- objetos aninhados;
- múltiplas fontes;
- regras de formatação;
- reuso;
- testes extensos;
- branches.

Essa extração será a próxima aula.

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

### 2. Criar ManagedRuntimeMessageCreateCommand

Package:

```text
br.com.formacao.backend.beans.managedmessage.
```

Record:

```java
public record ManagedRuntimeMessageCreateCommand(
        String value
) {
}
```

Não adicione annotation web.

Não adicione Bean Validation.

---

### 3. Evoluir ManagedRuntimeMessageService

Altere o método create para receber:

```text
ManagedRuntimeMessageCreateCommand.
```

O service não deve receber:

```text
CreateManagedRuntimeMessageRequest.
```

Mantenha outcomes e regras atuais.

---

### 4. Revisar ManagedRuntimeMessage

Confirme que o modelo interno contém somente informações necessárias à aplicação:

```text
id;

value;

createdAt;

version.
```

Adicione em fixture de teste um campo interno conceitual:

```text
normalizedValue.
```

Não publique esse campo.

Se preferir não alterar produção, use um model de fixture equivalente.

---

### 5. Restringir CreateManagedRuntimeMessageRequest

O request deve conter somente:

```java
public record CreateManagedRuntimeMessageRequest(
        String value
) {
}
```

Remova qualquer factory `from(domain)`.

Request não é construído a partir do domínio como fluxo principal.

---

### 6. Criar ManagedRuntimeMessageCreatedResponse

Campos:

```text
id;

value;

createdAt;

version.
```

Factory simples:

```java
static from(
        ManagedRuntimeMessage source
).
```

Use cópia direta.

Não inclua ETag no body.

ETag já pertence ao header.

---

### 7. Criar ManagedRuntimeMessageDetailResponse

Mesmo que possua campos iguais à resposta de criação nesta fase, mantenha classe separada.

Motivo:

```text
contratos podem evoluir de forma diferente.
```

Exemplo futuro:

- created response pode incluir onboarding;
- detail response pode incluir links;
- summary response pode omitir campos.

Não una por conveniência prematura.

---

### 8. Evoluir ManagedRuntimeMessageController

No POST:

```text
CreateManagedRuntimeMessageRequest
    -> ManagedRuntimeMessageCreateCommand.
```

Depois:

```text
ManagedRuntimeMessage
    -> ManagedRuntimeMessageCreatedResponse.
```

No GET:

```text
ManagedRuntimeMessage
    -> ManagedRuntimeMessageDetailResponse.
```

Mantenha status e headers da aula 366.

---

### 9. Criar RuntimeMessagePreviewCommand

Package de aplicação:

```text
br.com.formacao.backend.beans.service.
```

Campos:

```text
RuntimeFormatOption format;

List<String> messages.
```

Copie a lista.

Sem annotations web.

---

### 10. Criar RuntimeMessagePreviewResult

Campos:

```text
format;

messages.
```

O result representa saída do caso de uso.

Ele não deve ser a response HTTP.

---

### 11. Evoluir RuntimeMessageService preview

Receba:

```text
RuntimeMessagePreviewCommand.
```

Retorne:

```text
RuntimeMessagePreviewResult.
```

Não receba request DTO.

Não retorne response DTO.

---

### 12. Evoluir RuntimeMessageController preview

Converta:

```text
RuntimeMessagePreviewRequest
    -> RuntimeMessagePreviewCommand.
```

Depois:

```text
RuntimeMessagePreviewResult
    -> RuntimeMessagePreviewResponse.
```

Mantenha `ResponseEntity` e headers da aula 366.

---

### 13. Criar RuntimeMessageQuery

Modelo de aplicação:

```text
limit;

format;

tags.
```

Copie tags.

O service recebe esse tipo, não parâmetros web dispersos quando a operação possui múltiplas entradas relacionadas.

---

### 14. Criar RuntimeMessageQueryResult

Campos:

```text
limit;

format;

tags;

messages.
```

Listas imutáveis.

O controller converte esse result para response.

---

### 15. Evoluir endpoint de query

No controller:

```text
@RequestParam values
    -> RuntimeMessageQuery.
```

No retorno:

```text
RuntimeMessageQueryResult
    -> RuntimeMessageQueryResponse.
```

O header `X-Result-Count` continua baseado no response final.

---

### 16. Revisar RuntimeMessageItemResponse

Confirme que o response publica somente:

```text
position;

message.
```

Não exponha:

- formatter bean;
- repository index;
- lista interna inteira;
- Clock;
- source package.

---

### 17. Criar DtoRequestContractTest

Por reflection, valide:

```text
CreateManagedRuntimeMessageRequest:
somente value.

RuntimeMessagePreviewRequest:
somente format e messages.
```

Valide também:

- records;
- sem stereotypes;
- sem id;
- sem createdAt;
- sem version;
- sem status interno.

---

### 18. Criar DtoResponseContractTest

Valide campos públicos de:

```text
ManagedRuntimeMessageCreatedResponse;

ManagedRuntimeMessageDetailResponse;

RuntimeMessageItemResponse;

RuntimeMessagePreviewResponse;

RuntimeMessageQueryResponse.
```

Confirme ausência de:

- normalizedValue;
- internalKey;
- repository;
- status técnico;
- bean name.

---

### 19. Criar DtoSerializationContractTest

Use `ObjectMapper` fornecido pelo Boot em teste.

Serialize responses fixas.

Valide:

- nomes JSON;
- tipos;
- arrays;
- timestamps;
- ausência de campos internos;
- lista vazia como array;
- nenhum Optional serializado.

Não fixe ordem de propriedades.

---

### 20. Criar DtoDeserializationContractTest

Desserialize requests válidos.

Valide:

- value;
- enum;
- lista;
- lista ausente normalizada quando aplicável.

Envie campos extras como:

```text
id;

version;

createdAt.
```

Observe o comportamento configurado, mas confirme que o record resultante não possui esses componentes.

Não transforme a política de unknown fields em foco da aula.

---

### 21. Criar DtoOverPostingProtectionWebMvcTest

Envie POST:

```json
{
  "value": "dto seguro",
  "id": 999,
  "version": 50,
  "createdAt": "2030-01-01T00:00:00Z"
}
```

Conforme a configuração JSON atual, a request pode ser rejeitada ou os campos extras podem ser ignorados.

O teste principal deve confirmar:

```text
o service recebe command somente com value.
```

O id, versão e data devolvidos vêm do servidor.

Não dependa exclusivamente de ignorar campos desconhecidos.

---

### 22. Criar DtoSensitiveDataExposureTest

Crie fixture interna com campos:

```text
normalizedValue;

internalDeduplicationKey;

secretNote.
```

Converta para response permitido.

Serialize.

Confirme que os campos sensíveis não aparecem.

A fixture não entra no runtime oficial.

---

### 23. Criar DtoOperationSpecificityTest

Valide que:

```text
CreateManagedRuntimeMessageRequest
!= ManagedRuntimeMessageCreatedResponse
!= ManagedRuntimeMessageDetailResponse.
```

Confirme classes distintas mesmo com componentes semelhantes.

Falhe se surgir:

```text
ManagedRuntimeMessageDto;

BaseDto;

GenericResponseDto.
```

no package web.

---

### 24. Criar DtoCompatibilityTest

Guarde um snapshot estrutural em assertions:

```text
created response:
id, value, createdAt, version.

detail response:
id, value, createdAt, version.

preview request:
format, messages.
```

Não use arquivo snapshot opaco.

Assertions explícitas facilitam revisão.

---

### 25. Criar DtoArchitectureTest

Valide:

- packages `web.request` e `web.response` separados;
- requests terminam em `Request`;
- responses terminam em `Response`;
- commands terminam em `Command`;
- results terminam em `Result`;
- service não importa `web.request`;
- service não importa `web.response`;
- controller não devolve modelo interno diretamente;
- nenhum DTO possui `@Component`;
- nenhum DTO possui `@Entity`;
- nenhum DTO possui `@Service`;
- nenhum DTO possui `@Repository`;
- nenhum `Optional` como record component;
- nenhum Map ou JsonNode como contrato público;
- nenhum mapper framework.

---

### 26. Criar DtoLiveContractIT

Use servidor real em porta aleatória.

Fluxo:

1. POST com request DTO;
2. capture response created;
3. valide headers;
4. valide body criado;
5. GET detail;
6. compare contratos;
7. envie preview;
8. valide response;
9. consulte query;
10. valide listas.

Confirme que nenhum campo interno aparece em JSON real.

---

### 27. Criar ManagedRuntimeMessageServiceContractTest

Instancie o service sem Spring.

Passe command.

Confirme:

- command aceito;
- request DTO não é necessário;
- result de aplicação não possui HTTP;
- id e metadata são criados pelo servidor;
- duplicidade continua funcionando.

---

### 28. Criar RuntimeMessageApplicationModelTest

Valide:

- query e preview command são records;
- listas copiadas;
- results são imutáveis;
- nenhuma annotation web;
- nenhuma dependência em controller;
- nenhuma dependência em `ResponseEntity`.

---

### 29. Executar request de over-posting

Inicie a aplicação:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

Envie:

```json
{
  "value": "contrato controlado",
  "id": 999,
  "version": 999,
  "createdAt": "2030-01-01T00:00:00Z"
}
```

Confirme que o cliente não controla os campos do response.

Registre o status observado para campos desconhecidos.

---

### 30. Comparar POST e GET

No POST created response, observe os campos.

Depois consulte a Location.

Compare:

```text
created response;

detail response.
```

Mesmo que sejam iguais nesta versão, são tipos separados.

---

### 31. Testar listas vazias

Envie preview sem `messages` conforme o comportamento atual.

Confirme:

```text
lista vazia;
nao null.
```

Registre que Bean Validation poderá proibir a ausência futuramente.

---

### 32. Criar dto-definition.md

Explique:

- definição;
- transporte;
- direção;
- fronteira;
- responsabilidade;
- o que DTO não é.

---

### 33. Criar request-vs-response-dto.md

Compare:

```text
origem;

destino;

campos controlados;

nullabilidade;

segurança;

evolução.
```

Use create request e detail response.

---

### 34. Criar transport-application-domain-persistence.md

Desenhe:

```text
HTTP request
-> request DTO
-> command
-> service
-> domain/application model
-> result
-> response DTO
-> HTTP response.
```

Inclua uma futura entity de persistência apenas no diagrama conceitual.

---

### 35. Criar operation-specific-dtos.md

Documente:

- create;
- update;
- patch;
- summary;
- detail;
- created response;
- por que não usar DTO universal.

Não implemente update ou patch.

---

### 36. Criar over-posting-mass-assignment.md

Inclua:

- definição;
- JSON de ataque;
- campos somente servidor;
- request whitelist;
- risco de reflection copy;
- proteção por tipos específicos.

---

### 37. Criar sensitive-readonly-fields.md

Classifique:

```text
publicável;

somente leitura;

interno;

sensível;

derivado.
```

Inclua exemplos.

---

### 38. Criar dto-immutability-records.md

Explique:

- record;
- final;
- listas;
- cópia defensiva;
- equals;
- toString;
- cuidado com dados sensíveis em toString.

---

### 39. Criar dto-nullability-optionality.md

Inclua:

- ausente;
- null;
- vazio;
- lista vazia;
- default;
- Optional fora de components;
- ponte para Bean Validation.

---

### 40. Criar dto-list-detail-contracts.md

Compare payload de:

- summary;
- detail;
- collection wrapper;
- metadados;
- paginação futura.

Não crie paginação ainda.

---

### 41. Criar dto-versioning-compatibility.md

Documente:

- tipos de breaking change;
- campo adicional;
- enum;
- nullabilidade;
- formato de data;
- `/v1`;
- coexistência;
- consumer tolerance.

---

### 42. Criar dto-contract-baseline.md

Liste todos os request e response DTOs atuais.

Para cada um:

- operação;
- direção;
- components;
- campos proibidos;
- teste de contrato.

---

### 43. Criar scripts

`57_testar_request_dtos.ps1` executa testes de request.

`58_testar_response_dtos.ps1` executa serialização e contrato.

`59_testar_over_posting.ps1` envia JSON com campos controlados pelo servidor.

`60_testar_exposicao_sensivel.ps1` executa teste de campos internos.

`61_testar_compatibilidade_dto.ps1` executa assertions estruturais.

`62_executar_testes_dto.ps1` executa a suite da aula.

---

### 44. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=DtoRequestContractTest,DtoResponseContractTest,DtoSerializationContractTest,DtoDeserializationContractTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 45. Executar testes de seguranca do contrato

```powershell
.\mvnw.cmd `
  -Dtest=DtoOverPostingProtectionWebMvcTest,DtoSensitiveDataExposureTest,DtoArchitectureTest test
```

---

### 46. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=DtoLiveContractIT test
```

Confirme porta aleatória, store limpo e contexto fechado.

---

### 47. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 48. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 49. Revisar escopo

Confirme:

```text
request DTOs:
específicos.

response DTOs:
específicos.

service importando web:
zero.

domain exposto:
zero.

entity exposta:
zero.

BaseDto:
zero.

Map público:
zero.

JsonNode público:
zero.

mapper dedicado:
zero.

Bean Validation:
zero.
```

---

### 50. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs;
- payload de ataque temporário;
- snapshot JSON opaco;
- campo sensível em fixture de produção;
- mapper antecipado;
- annotation de validation;
- DTO genérico.

---

## Entendendo o que foi feito

### A fronteira HTTP ganhou tipos proprios

Requests e responses deixaram de depender do modelo interno.

### O service recebeu modelos de aplicacao

Commands e results removeram dependência do package web.

### Campos do servidor ficaram protegidos

Id, data e versão não fazem parte do create request.

### O response virou whitelist

Somente campos declarados são serializados.

### Contratos semelhantes permaneceram separados

Created e detail podem evoluir independentemente.

---

## Erros comuns importantes

### Usar a entity como request e response

Persistência e contrato HTTP ficam acoplados.

### Criar um DTO universal

Campos opcionais e responsabilidades crescem sem controle.

### Usar reflection para copiar tudo

Mass assignment e vazamento de dados ficam prováveis.

### Colocar Optional em components JSON

Ausência, null e serialização ficam confusos.

### Expor campo porque ele ja existe no model

A existência interna não autoriza publicação.

---

## Comandos uteis

### Testes de requests

```powershell
.\mvnw.cmd `
  -Dtest=DtoRequestContractTest,DtoDeserializationContractTest test
```

### Testes de responses

```powershell
.\mvnw.cmd `
  -Dtest=DtoResponseContractTest,DtoSerializationContractTest test
```

### Protecao

```powershell
.\mvnw.cmd `
  -Dtest=DtoOverPostingProtectionWebMvcTest,DtoSensitiveDataExposureTest test
```

### Arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=DtoArchitectureTest test
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — DTO universal

Crie em fixture:

```text
ManagedRuntimeMessageDto
```

com todos os campos.

Use como request e response.

Liste os problemas.

Remova a fixture.

### Parte 2 — Campo de servidor

Adicione temporariamente `id` ao create request.

Envie valor controlado pelo cliente.

Faça o teste arquitetural rejeitar.

Restaure.

### Parte 3 — Campo sensivel

Adicione `internalNote` ao model de fixture.

Confirme que o response não publica.

### Parte 4 — Summary

Crie somente em teste:

```text
ManagedRuntimeMessageSummaryResponse.
```

Compare com detail.

Não adicione endpoint novo.

### Parte 5 — Null versus vazio

Desserialize:

```text
messages ausente;

messages null;

messages vazia.
```

Registre as diferenças.

### Parte 6 — Enum

Imagine adicionar um novo valor de enum.

Analise impacto em requests e responses.

### Parte 7 — Compatibilidade

Proponha alterações compatíveis e incompatíveis no detail response.

Justifique.

### Parte 8 — ADR

Registre:

```text
DTO por operação;

request e response separados;

commands e results internos;

records imutáveis;

listas defensivas;

sem entity na web;

sem BaseDto;

sem reflection copy;

campos sensíveis por whitelist;

mappers dedicados somente na aula seguinte.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 366 foi preservada;
- o mesmo projeto foi continuado;
- DTO foi definido como objeto de transporte;
- request e response DTOs foram diferenciados;
- direção e operação foram documentadas;
- DTO foi diferenciado de domínio, aplicação e persistência;
- conceito de entity foi explicado sem adicionar JPA;
- `ManagedRuntimeMessageCreateCommand` foi criado;
- service deixou de receber request DTO;
- `RuntimeMessagePreviewCommand` e result foram criados;
- `RuntimeMessageQuery` e result foram criados;
- modelos de aplicação não possuem annotations web;
- create request contém somente `value`;
- id, createdAt e version ficaram fora do request;
- created response foi criado;
- detail response foi criado;
- created e detail permanecem classes distintas;
- preview request e response permanecem separados;
- query response publica somente o contrato permitido;
- item response não expõe infraestrutura;
- response DTOs funcionam como whitelist;
- campos internos e sensíveis não foram serializados;
- over-posting foi explicado e testado;
- mass assignment foi explicado;
- cópia por reflexão genérica foi rejeitada;
- campos somente de leitura foram identificados;
- dados sensíveis foram classificados;
- whitelist foi preferida a blacklist;
- records foram usados;
- listas foram copiadas defensivamente;
- lista vazia foi preferida a null quando aplicável;
- nullabilidade foi documentada;
- `Optional` não foi usado como record component de DTO;
- nomes terminam em Request, Response, Command ou Result;
- `BaseDto`, `GenericDto`, Map cru e JsonNode público não foram criados;
- DTO específico por operação foi adotado;
- create, update, patch, summary e detail foram diferenciados conceitualmente;
- update e patch não foram implementados;
- nomes de campos públicos não expõem nomes de coluna;
- tipos como Instant, enum e List foram preservados;
- versionamento `/v1` foi relacionado aos DTOs;
- breaking changes de request e response foram explicadas;
- factories estáticas permaneceram mecânicas;
- mapper dedicado não foi criado;
- framework de mapping não foi adicionado;
- controller converte request para command;
- controller converte result para response;
- conversão complexa não foi inserida no controller;
- `DtoRequestContractTest` foi criado;
- `DtoResponseContractTest` foi criado;
- `DtoSerializationContractTest` foi criado;
- `DtoDeserializationContractTest` foi criado;
- `DtoOverPostingProtectionWebMvcTest` foi criado;
- campos extras não controlam id, versão ou data;
- `DtoSensitiveDataExposureTest` foi criado;
- `DtoOperationSpecificityTest` foi criado;
- `DtoCompatibilityTest` foi criado;
- `DtoArchitectureTest` foi criado;
- service não importa packages web;
- controller não retorna modelo interno diretamente;
- DTOs não possuem stereotypes nem entity annotations;
- `DtoLiveContractIT` foi criado;
- servidor real, porta aleatória e JSON real foram exercitados;
- store foi limpo e contexto fechado;
- testes dos modelos de aplicação foram criados;
- documentação de definição, direção, camadas, operações, segurança, imutabilidade, nullabilidade, listas e compatibilidade foi criada;
- baseline dos DTOs foi documentada;
- scripts foram criados;
- testes focados, segurança, live, suite completa e package passaram;
- nenhuma Bean Validation, validação customizada, mapper manual dedicado, MapStruct, ModelMapper, JPA, Flyway, ControllerAdvice ou ProblemDetail foi antecipado;
- ponte para a aula 368 está correta;
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
git commit -m "refactor(m14): separar dto request response e modelos internos"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- payload temporário;
- campo sensível de fixture;
- DTO genérico;
- mapper antecipado;
- annotations de validation.

---

## Fechamento e ponte para a proxima aula

Nesta aula, o contrato HTTP deixou de reutilizar diretamente modelos internos.

O fluxo consolidado ficou:

```text
HTTP request;

request DTO;

command de aplicacao;

service;

result ou modelo interno;

response DTO;

ResponseEntity;

HTTP response.
```

Você comprovou:

```text
request com campos permitidos;

campos do servidor protegidos;

service independente da web;

responses como whitelist;

records imutáveis;

listas defensivas;

over-posting controlado;

dados internos ausentes;

contratos específicos por operação;

compatibilidade testada.
```

A decisão central foi:

```text
DTOs devem representar contratos de transporte
e precisam ser desenhados por operacao,
sem expor automaticamente
o modelo interno da aplicacao.
```

A próxima aula será:

```text
368 - M14.13 - Mappers manuais
```

Nela, você continuará no mesmo projeto e estudará:

- responsabilidade de mapping;
- request para command;
- domain para response;
- mapper por feature;
- métodos explícitos;
- null handling;
- listas;
- nested mapping;
- composição de mappers;
- context data;
- atualização controlada;
- testes unitários;
- ausência de reflection;
- diferenças entre mapper, factory e assembler;
- organização de packages;
- redução de lógica no controller;
- evolução segura.

A aula 367 respondeu:

```text
quais objetos atravessam
a fronteira HTTP?
```

A aula 368 responderá:

```text
onde e como converter
esses objetos de forma explicita e testavel?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar request DTO, response DTO, command, result e entity.
- [ ] Sei proteger campos controlados pelo servidor.
- [ ] Sei explicar over-posting e mass assignment.
- [ ] Sei desenhar DTOs específicos por operação.
- [ ] Sei preservar compatibilidade do contrato.

---

## Troubleshooting adicional

### Service importa package web

Crie command ou result na camada de aplicação.

### JSON publica campo interno

Revise o response DTO e pare de retornar o model diretamente.

### Request aceita id e version

Remova esses components e mantenha campos gerados no servidor.

### DTO possui muitos nulls

Divida por operação e direção.

### Lista continua mutavel

Use `List.copyOf` no construtor compacto.

### Teste quebra por ordem JSON

Valide nomes e tipos, não ordem de propriedades.

---

## Perguntas de revisao

1. O que é DTO?
2. O que representa request DTO?
3. O que representa response DTO?
4. DTO e entidade são iguais?
5. Por que o service não deve receber request DTO?
6. Para que serve um command?
7. Para que serve um result?
8. O que é over-posting?
9. O que é mass assignment?
10. Quais campos não entram em create request?
11. Por que response funciona como whitelist?
12. Por que created e detail podem ser classes diferentes?
13. Record torna lista imutável automaticamente?
14. Devemos usar Optional como field de DTO?
15. O que é DTO por operação?
16. Qual risco de um BaseDto?
17. Adicionar campo sempre é compatível?
18. Por que não retornar entity?
19. Mapper dedicado foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Objeto de transporte.
2. Dados aceitos do cliente.
3. Dados publicados pela API.
4. Não.
5. Para não acoplar aplicação à web.
6. Representar entrada do caso de uso.
7. Representar saída do caso de uso.
8. Cliente envia campos que não deveria controlar.
9. Cópia automática de campos para modelo interno.
10. Id, versão, datas e status gerados.
11. Publica somente campos escolhidos.
12. Podem evoluir separadamente.
13. Não.
14. Evite.
15. Tipo específico para cada contrato.
16. Campos opcionais e acoplamento.
17. Não.
18. Evitar vazamento e acoplamento.
19. Não.
20. Mappers manuais.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 367 - M14.12 - DTO request response

- Continuei no projeto `formacao-java-backend-api`.
- Defini DTO como objeto de transporte.
- Diferenciei request DTO de response DTO.
- Diferenciei DTO de modelo de aplicação, domínio e persistência.
- Entendi por que entity não deve ser exposta.
- Criei `ManagedRuntimeMessageCreateCommand`.
- Mantive o service independente do package web.
- Criei command e result para preview.
- Criei query e result para consulta.
- Mantive annotations HTTP somente na camada web.
- Restringi o create request ao campo permitido.
- Mantive id, createdAt e version controlados pelo servidor.
- Separei created response de detail response.
- Mantive preview request e response separados.
- Usei responses como whitelist.
- Protegi campos internos e sensíveis.
- Entendi over-posting.
- Entendi mass assignment.
- Rejeitei cópia genérica por reflexão.
- Adotei DTOs específicos por operação.
- Evitei DTO universal e `BaseDto`.
- Usei records imutáveis.
- Copiei listas defensivamente.
- Preferi listas vazias a null quando aplicável.
- Evitei `Optional` em fields de DTO.
- Padronizei nomes Request, Response, Command e Result.
- Testei serialização e desserialização.
- Testei proteção contra campos controlados pelo servidor.
- Testei ausência de dados sensíveis.
- Testei compatibilidade estrutural.
- Criei teste arquitetural para as fronteiras.
- Testei contratos com servidor real.
- Não adicionei mapper dedicado.
- Não adicionei Bean Validation.
- Não adicionei JPA ou Flyway.
- Próxima aula: Mappers manuais.
```

---

## Referencia tecnica curta

```text
Request DTO:
entrada HTTP.

Response DTO:
saida HTTP.

Command:
entrada do caso de uso.

Result:
saida do caso de uso.

Domain:
regras.

Entity:
persistencia.

Over-posting:
campos indevidos.

Whitelist:
campos publicados.

Record:
imutabilidade estrutural.

Mapper:
proxima aula.
```

Regra final:

```text
DTOs de request e response devem ser contratos especificos por operacao, imutaveis e separados dos modelos de aplicacao, dominio e persistencia; campos gerados pelo servidor, internos ou sensiveis nao devem entrar no request nem aparecer automaticamente no response, services devem trabalhar com commands e results proprios, listas precisam de copia defensiva e a conversao deve permanecer explicita para impedir over-posting, mass assignment e acoplamento entre a API e a estrutura interna.
```
