# 368 - M14.13 - Mappers manuais

## Apresentacao da aula

Na aula 367, você separou os objetos que atravessam a fronteira HTTP dos modelos usados internamente pela aplicação.

O fluxo passou a ser:

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

Também foram estabelecidas regras importantes:

```text
request e response separados;

DTO por operacao;

campos gerados pelo servidor fora do request;

responses como whitelist;

service sem dependencias do package web;

records imutaveis;

listas defensivas;

sem BaseDto;

sem entity exposta;

sem Map cru;

sem JsonNode como contrato.
```

A separação resolveu o problema de acoplamento entre contrato HTTP e modelo interno.

Entretanto, surgiu uma nova responsabilidade:

```text
quem converte um tipo no outro?
```

Na aula 367, conversões pequenas permaneceram no controller ou em factories estáticas dos response DTOs.

Exemplos conceituais:

```java
ManagedRuntimeMessageCreateCommand command =
        new ManagedRuntimeMessageCreateCommand(
                request.value()
        );
```

e:

```java
ManagedRuntimeMessageDetailResponse response =
        ManagedRuntimeMessageDetailResponse.from(
                message
        );
```

Essas conversões funcionam.

Porém, à medida que a API cresce, o controller pode começar a acumular:

- cópia de campos;
- transformação de listas;
- conversão de tipos;
- composição de objetos;
- null handling;
- formatação;
- seleção de campos;
- context data;
- branches;
- código repetido.

Quando isso acontece, a camada web deixa de ser somente uma fronteira HTTP.

Ela passa a conhecer detalhes demais da transformação.

Nesta aula, você extrairá a responsabilidade de conversão para:

```text
mappers manuais.
```

O padrão oficial do laboratório será:

```text
mapping explicito;

metodos pequenos;

tipos de origem e destino conhecidos;

sem reflection;

sem copia por nome;

sem conversao generica;

sem framework de mapping.
```

Serão criados dois mappers por feature:

```text
ManagedRuntimeMessageWebMapper;

RuntimeMessageWebMapper.
```

O primeiro será responsável por:

```text
CreateManagedRuntimeMessageRequest
    -> ManagedRuntimeMessageCreateCommand;

ManagedRuntimeMessage
    -> ManagedRuntimeMessageCreatedResponse;

ManagedRuntimeMessage
    -> ManagedRuntimeMessageDetailResponse.
```

O segundo será responsável por:

```text
RuntimeMessagePreviewRequest
    -> RuntimeMessagePreviewCommand;

RuntimeMessagePreviewResult
    -> RuntimeMessagePreviewResponse;

request params
    -> RuntimeMessageQuery;

RuntimeMessageQueryResult
    -> RuntimeMessageQueryResponse;

resultado individual
    -> RuntimeMessageItemResponse.
```

Os controllers receberão os mappers por constructor injection.

Eles continuarão responsáveis por:

- annotations HTTP;
- status;
- headers;
- leitura de path, query e body;
- delegação ao service;
- escolha do envelope `ResponseEntity`.

Os mappers serão responsáveis por:

- converter modelos;
- escolher campos;
- copiar listas;
- preservar null policy;
- manter direção explícita.

Os mappers não serão responsáveis por:

- buscar dados;
- acessar repository;
- executar regra de negócio;
- escolher status HTTP;
- criar headers;
- abrir transação;
- validar constraint;
- serializar JSON;
- interpretar request servlet.

Nesta aula, também serão estudadas as diferenças entre:

```text
mapper;

factory;

assembler;

Spring Converter;

HttpMessageConverter;

Jackson ObjectMapper.
```

Esses conceitos possuem nomes semelhantes, mas responsabilidades diferentes.

A aula demonstrará:

- mapping de objeto único;
- mapping de lista;
- nested mapping;
- composição entre mappers;
- context data;
- null handling;
- atualização controlada;
- testes unitários;
- testes de integração;
- proteção arquitetural.

Nested mapping, context data e atualização controlada serão praticados em fixtures isoladas.

A API pública não será alterada apenas para criar exemplos.

Nenhum endpoint de update será criado.

Nenhuma estrutura JSON será modificada sem necessidade.

A aula também rejeitará abordagens como:

```text
BeanUtils.copyProperties;

ObjectMapper.convertValue;

reflection;

Map<String, Object>;

copy all fields;

mapper generico universal.
```

Essas ferramentas podem existir em outros contextos.

Entretanto, na fronteira HTTP, copiar propriedades por nome esconde decisões de segurança e compatibilidade.

O objetivo do curso é tornar cada campo publicado ou aceito uma decisão visível.

Não serão adicionados:

- MapStruct;
- ModelMapper;
- Dozer;
- Orika;
- mapper annotation processor;
- Bean Validation;
- validation customizada;
- JPA;
- Flyway;
- PostgreSQL;
- `@ControllerAdvice`;
- Problem Details.

A próxima aula será:

```text
369 - M14.14 - Bean Validation
```

Portanto, os mappers não validarão regras de campo.

Eles poderão rejeitar uma origem `null` quando o contrato interno exige objeto presente.

Mas não substituirão constraints como:

```text
@NotBlank;

@NotNull;

@Size;

@Min;

@Max.
```

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
365:
binding de path, query e body.

366:
ResponseEntity, status, headers e body.

367:
DTO request response.

368:
mappers manuais.

369:
Bean Validation.

370:
validacoes customizadas.

371:
service layer, use cases e transacoes.
```

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

Nesta aula:

```text
mapper manual:
sim.

request para command:
sim.

result para response:
sim.

modelo para response:
sim.

mapper por feature:
sim.

metodos explicitos:
sim.

listas:
sim.

null handling:
sim.

nested mapping:
sim, em fixture.

composicao:
sim, em fixture.

context data:
sim, em fixture.

update controlado:
sim, em fixture.

teste unitario:
sim.

controller fino:
sim.

BeanUtils:
nao.

reflection:
nao.

ObjectMapper como mapper:
nao.

MapStruct:
nao.

Bean Validation:
nao.

endpoint de update:
nao.
```

A regra central será:

```text
mapping deve tornar visivel
como cada campo atravessa a fronteira.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/backend/web
├── controller
│   ├── ManagedRuntimeMessageController.java
│   └── RuntimeMessageController.java
├── mapper
│   ├── ManagedRuntimeMessageWebMapper.java
│   └── RuntimeMessageWebMapper.java
├── request
└── response
```

As factories de conversão presentes nos DTOs serão removidas.

Os response records permanecerão apenas como estruturas de contrato.

Novos testes:

```text
src/test/java/br/com/formacao/backend/web/mapper
├── ManagedRuntimeMessageWebMapperTest.java
├── RuntimeMessageWebMapperTest.java
├── MapperNullPolicyTest.java
├── MapperListMappingTest.java
├── MapperCompositionTest.java
├── MapperContextDataTest.java
├── ControlledUpdateMappingTest.java
├── MapperArchitectureTest.java
├── MapperControllerIntegrationWebMvcTest.java
└── MapperLiveContractIT.java
```

Documentação externa:

```text
docs
├── manual-mapper-definition.md
├── mapper-factory-assembler.md
├── mapper-boundaries.md
├── request-command-mapping.md
├── model-response-mapping.md
├── list-nested-mapping.md
├── mapper-null-policy.md
├── mapping-context-data.md
├── controlled-update-mapping.md
├── why-no-reflection-copy.md
└── mapper-baseline.md
```

Scripts:

```text
scripts
├── 63_executar_testes_mappers.ps1
├── 64_validar_controller_sem_mapping.ps1
├── 65_validar_sem_reflection.ps1
├── 66_testar_listas_e_nulls.ps1
├── 67_testar_contratos_com_mappers.ps1
└── 68_executar_teste_live_mappers.ps1
```

Resultados esperados:

```text
controller criando command diretamente:
zero.

controller criando response diretamente:
zero, exceto ResponseEntity.

factory from nos response DTOs:
zero.

mapper por feature:
dois.

mappers:
stateless.

mappers:
constructor injected.

request para command:
explicito.

model para response:
explicito.

listas:
copiadas.

origem obrigatoria null:
falha rapida.

lista ausente permitida:
lista vazia.

campo interno:
nao publicado.

BeanUtils.copyProperties:
zero.

ObjectMapper.convertValue:
zero.

reflection:
zero.

MapStruct:
zero.

ModelMapper:
zero.

endpoint de update:
zero.

contrato JSON:
preservado.
```

---

## Conceito essencial

### O que e mapper

Mapper é um componente responsável por transformar uma representação em outra.

Exemplo:

```text
CreateManagedRuntimeMessageRequest
    -> ManagedRuntimeMessageCreateCommand.
```

A origem pertence à camada web.

O destino pertence à camada de aplicação.

O mapper explicita a travessia entre essas fronteiras.

---

### Mapping nao e serializacao

Serialização transforma objeto em bytes ou texto.

Exemplo:

```text
ManagedRuntimeMessageDetailResponse
    -> JSON.
```

Essa responsabilidade pertence ao Jackson e ao `HttpMessageConverter`.

O mapper trabalha antes da serialização:

```text
ManagedRuntimeMessage
    -> ManagedRuntimeMessageDetailResponse.
```

Não use `ObjectMapper` para substituir esse desenho.

---

### Mapping nao e binding

Binding transforma entrada HTTP em tipos do método.

Exemplo:

```text
JSON
    -> CreateManagedRuntimeMessageRequest.
```

Esse trabalho é realizado pelo Spring MVC e pelo message converter.

Depois do binding, o mapper transforma:

```text
request DTO
    -> command.
```

São etapas diferentes.

---

### Mapping nao e regra de negocio

O mapper não deve decidir:

- se a mensagem é duplicada;
- se o usuário pode criar;
- se o status permite alteração;
- se o limite comercial foi excedido;
- se uma transação deve ocorrer.

Essas decisões pertencem ao service, caso de uso ou domínio.

O mapper apenas traduz estruturas.

---

### Mapper manual

Mapper manual usa código Java explícito.

Exemplo:

```java
public ManagedRuntimeMessageCreateCommand
        toCommand(
                CreateManagedRuntimeMessageRequest source
        ) {

    Objects.requireNonNull(
            source,
            "source must not be null"
    );

    return new ManagedRuntimeMessageCreateCommand(
            source.value()
    );
}
```

Cada campo é visível.

Uma mudança no construtor tende a gerar erro de compilação.

---

### Beneficios do mapping manual

Vantagens:

- intenção explícita;
- revisão fácil;
- segurança por whitelist;
- refactoring assistido pelo compilador;
- sem geração escondida;
- sem runtime reflection;
- testes diretos;
- debugging simples;
- controle de null;
- controle de listas;
- nenhum novo plugin.

Custos:

- código repetitivo;
- manutenção manual;
- mais classes;
- risco de esquecer campo se testes forem fracos.

Nesta etapa da formação, o benefício pedagógico e arquitetural supera o custo.

---

### Mapper por feature

Evite um mapper global:

```text
ApplicationMapper.
```

Ele cresce indefinidamente e conhece todos os módulos.

Prefira:

```text
ManagedRuntimeMessageWebMapper;

RuntimeMessageWebMapper.
```

A feature define a fronteira e facilita testes.

---

### Mapper como bean

Os mappers da aula serão:

```java
@Component
```

Motivos:

- controllers receberão por construtor;
- arquitetura já utiliza DI;
- composição futura entre mappers fica explícita;
- testes de wiring podem validar o contexto.

Eles serão stateless.

Nenhum mapper manterá dados por request.

Um mapper simples também poderia ser instanciado com `new`.

A escolha por bean não transforma mapping em regra de negócio.

---

### Stateless

Um mapper stateless não armazena:

- último request;
- usuário atual;
- entidade atual;
- lista mutável compartilhada;
- resultado de mapping anterior.

Todos os dados necessários entram por parâmetros.

Isso torna o singleton seguro para uso concorrente quando seus colaboradores também são adequados.

---

### Metodo por direcao

Use nomes específicos:

```text
toCreateCommand;

toCreatedResponse;

toDetailResponse;

toPreviewCommand;

toPreviewResponse;

toQuery;

toQueryResponse;

toItemResponse.
```

Evite:

```text
map;

convert;

transform.
```

quando a direção não fica clara.

Nomes específicos reduzem ambiguidade.

---

### Request para command

O mapper de entrada deve copiar apenas campos aceitos.

Exemplo:

```java
return new ManagedRuntimeMessageCreateCommand(
        source.value()
);
```

Mesmo que o JSON possua campos extras, o command continua contendo somente:

```text
value.
```

Essa é uma proteção contra over-posting.

---

### Model para response

O mapper de saída escolhe a whitelist pública.

Exemplo:

```java
return new ManagedRuntimeMessageDetailResponse(
        source.id(),
        source.value(),
        source.createdAt(),
        source.version()
);
```

Campos internos não aparecem porque não são lidos.

---

### Result para response

Um result de aplicação pode possuir dados úteis para a web, mas não é o contrato HTTP.

O mapper transforma:

```text
RuntimeMessageQueryResult
    -> RuntimeMessageQueryResponse.
```

O controller continua responsável por headers como:

```text
X-Result-Count.
```

O mapper não cria `ResponseEntity`.

---

### Factory

Factory cria uma instância e pode proteger invariantes de criação.

Exemplo conceitual:

```text
ManagedRuntimeMessage.create(...).
```

Uma factory de domínio pode:

- gerar estado inicial;
- validar invariantes;
- escolher implementação;
- impedir construção inválida.

Um mapper traduz representações.

Não use mapper como factory de domínio quando existem regras.

---

### Factory estatica em DTO

Uma factory como:

```text
DetailResponse.from(model)
```

é uma forma pequena de mapping.

Ela não é incorreta por definição.

O problema aparece quando:

- muitos DTOs conhecem modelos internos;
- mapping é repetido;
- composição cresce;
- testes ficam espalhados;
- controllers usam factories diferentes;
- DTO passa a executar lógica.

Nesta aula, essas factories serão extraídas para centralizar a responsabilidade.

---

### Assembler

Assembler combina várias fontes para formar uma representação.

Exemplo conceitual:

```text
message;

owner;

permissions;

links;

metadata.
```

Ele pode usar múltiplos mappers.

O laboratório não criará um assembler de produção porque a representação atual depende de uma fonte principal.

O conceito será demonstrado em fixture.

---

### Spring Converter

`Converter<S, T>` pertence ao sistema de conversão de tipos do Spring.

Ele é adequado para conversões gerais como:

```text
String
    -> RuntimeFormatOption.
```

O converter da aula 365 continua responsável por query e path textuais.

Não registre todos os DTO mappings no `ConversionService`.

Mappings de casos de uso são mais explícitos em classes por feature.

---

### HttpMessageConverter

`HttpMessageConverter` lê e escreve conteúdo HTTP.

Exemplo:

```text
JSON
    -> request DTO;

response DTO
    -> JSON.
```

Ele não substitui:

```text
request DTO
    -> command.
```

---

### ObjectMapper

`ObjectMapper` é infraestrutura JSON.

Evite:

```java
objectMapper.convertValue(
        source,
        Target.class
);
```

como mapper arquitetural.

Essa abordagem:

- copia por nomes compatíveis;
- esconde campos;
- depende de configuração JSON;
- pode ignorar decisões;
- transforma erro de compilação em comportamento de runtime;
- aproxima contrato interno de contrato externo.

---

### BeanUtils.copyProperties

`BeanUtils.copyProperties` copia valores de propriedades compatíveis entre objetos.

Na fronteira da API, isso não expressa quais campos foram autorizados.

Um novo campo com o mesmo nome pode começar a ser copiado sem uma decisão explícita.

Por isso, a aula proibirá essa abordagem nos mappers.

---

### Reflection

Reflection pode ler campos, métodos e metadata em runtime.

Um mapper genérico por reflection parece reduzir código.

Porém, ele dificulta:

- rastrear origem;
- controlar campos;
- garantir tipos;
- refatorar;
- debugar;
- impedir mass assignment;
- medir impacto de contrato.

Não será usada.

---

### Null policy

Cada mapper precisa de uma política explícita.

Padrão da aula:

```text
origem raiz obrigatoria null:
falha com Objects.requireNonNull.

colecao opcional permitida null:
normalizar para List.of.

elemento null dentro de lista:
rejeitar ou preservar somente quando o contrato declarar.

mapper nunca retorna null silenciosamente.
```

A política pode variar por operação, mas deve ser testada.

---

### Fail fast

Se o controller recebeu um request DTO obrigatório, o mapper não deve fingir que `null` é um command válido.

Use:

```java
Objects.requireNonNull(
        source,
        "source must not be null"
);
```

Isso revela erro de programação.

Não confunda com validação de campo enviada pelo cliente.

---

### List mapping

Mapeamento de lista pode usar:

```java
source.stream()
        .map(this::toDetailResponse)
        .toList();
```

A lista produzida por `Stream.toList()` é não modificável.

Ainda assim, a política de `null` da lista e de seus elementos precisa ser definida.

Não esconda queries ou chamadas externas dentro do mapping de cada item.

---

### Nested mapping

Nested mapping transforma objetos internos aninhados por meio de mappers menores.

Exemplo conceitual:

```text
Customer
    -> CustomerResponse;

Address
    -> AddressResponse.
```

O `CustomerMapper` pode receber `AddressMapper`.

Isso evita duplicação.

A API atual não precisa de objeto aninhado novo.

O conceito será praticado em teste isolado.

---

### Composicao de mappers

Um mapper pode depender de outro mapper quando:

- existe objeto aninhado;
- o submapeamento é reutilizado;
- a responsabilidade permanece clara.

Evite ciclos:

```text
MapperA
    -> MapperB
        -> MapperA.
```

Mappers precisam formar um grafo simples.

---

### Context data

Alguns mappings precisam de informação externa que não pertence à origem.

Exemplos:

- locale;
- timezone;
- URI base;
- permissões já calculadas;
- versão de contrato;
- feature flag resolvida.

Não use estado mutável no mapper.

Passe contexto explicitamente:

```java
toResponse(
        source,
        mappingContext
);
```

O contexto não deve esconder chamadas a repository.

A aula demonstrará esse padrão em fixture.

---

### Atualizacao controlada

Um mapper de update não deve copiar todos os campos recebidos para um modelo existente.

Exemplo:

```text
campos editaveis:
value.

campos protegidos:
id, createdAt, version.
```

O mapper pode produzir um command com somente os campos editáveis.

Ou pode aplicar explicitamente valores permitidos em um draft.

Nenhum endpoint de update será criado.

O comportamento será validado em fixture de teste.

---

### Mapping e formatacao

Conversão estrutural não deve virar apresentação arbitrária.

Exemplo:

```text
Instant
    -> Instant
```

é preferível quando o contrato publica um instante.

Transformar para texto localizado pode ser necessário em outro contrato, mas exige contexto explícito.

Não use `toString()` indiscriminadamente.

---

### Mapping e defaults

Defaults de transporte devem ser decididos na fronteira adequada.

Exemplo:

```text
tags ausentes
    -> lista vazia.
```

Pode ocorrer no request record ou mapper.

Não aplique default de negócio escondido no mapper.

Exemplo inadequado:

```text
preco null
    -> zero
```

sem regra documentada.

---

### Mapping e excecoes

Um mapper pode lançar:

- `NullPointerException` controlada por `requireNonNull`;
- `IllegalArgumentException` para estrutura impossível;
- exception específica de mapping, se realmente necessária.

Não capture toda exception para retornar objeto vazio.

Falhas de programação precisam permanecer visíveis.

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

Todos os testes anteriores precisam permanecer verdes.

---

### 2. Criar package de mappers

Crie:

```text
br.com.formacao.backend.web.mapper.
```

Não coloque os mappers no package de service.

Eles transformam contratos da web.

---

### 3. Criar ManagedRuntimeMessageWebMapper

Estrutura:

```java
@Component
public class ManagedRuntimeMessageWebMapper {
}
```

A classe não terá fields.

Ela será stateless.

---

### 4. Criar toCreateCommand

Método:

```java
public ManagedRuntimeMessageCreateCommand
        toCreateCommand(
                CreateManagedRuntimeMessageRequest source
        ) {
}
```

Use `Objects.requireNonNull`.

Copie somente:

```text
value.
```

Não copie nenhum campo por reflection.

---

### 5. Criar toCreatedResponse

Método:

```java
public ManagedRuntimeMessageCreatedResponse
        toCreatedResponse(
                ManagedRuntimeMessage source
        ) {
}
```

Mapeie explicitamente:

```text
id;

value;

createdAt;

version.
```

---

### 6. Criar toDetailResponse

Mesmo que os campos coincidam, implemente método próprio.

Não faça:

```java
return toCreatedResponse(source);
```

se os tipos de retorno forem diferentes.

Mantenha a intenção de cada contrato visível.

Você pode extrair um método privado de leitura dos campos somente se ele não esconder a direção.

---

### 7. Remover factories dos responses

Remova:

```text
from(...).
```

de:

```text
ManagedRuntimeMessageCreatedResponse;

ManagedRuntimeMessageDetailResponse.
```

Os records devem conter somente contrato e invariantes estruturais.

---

### 8. Criar RuntimeMessageWebMapper

Estrutura:

```java
@Component
public class RuntimeMessageWebMapper {
}
```

Stateless e sem dependências inicialmente.

---

### 9. Criar toPreviewCommand

Mapeie:

```text
RuntimeMessagePreviewRequest
    -> RuntimeMessagePreviewCommand.
```

Copie a lista.

Se a lista já foi normalizada pelo record, ainda preserve a invariante do command.

---

### 10. Criar toPreviewResponse

Mapeie:

```text
RuntimeMessagePreviewResult
    -> RuntimeMessagePreviewResponse.
```

Use o formato público estável.

Não retorne o result diretamente.

---

### 11. Criar toQuery

Receba:

```text
limit;

format;

tags.
```

Ou receba um pequeno input web específico se já existir.

Crie:

```text
RuntimeMessageQuery.
```

Normalize tags `null` para lista vazia.

Não aplique regra de limite máximo.

Isso pertence à validação ou aplicação.

---

### 12. Criar toQueryResponse

Mapeie:

```text
RuntimeMessageQueryResult
    -> RuntimeMessageQueryResponse.
```

Copie:

- limit;
- format;
- tags;
- messages.

Não monte headers.

---

### 13. Criar toItemResponse

Mapeie o resultado individual da aplicação para:

```text
RuntimeMessageItemResponse.
```

Se o service ainda retorna uma estrutura interna com posição e mensagem, use-a como origem.

Não permita que o controller monte o record diretamente.

---

### 14. Remover factories dos DTOs runtime

Remova factories estáticas de:

```text
RuntimeMessageItemResponse;

RuntimeMessagePreviewResponse;

RuntimeMessageQueryResponse.
```

quando existirem.

O mapping passa a ter um único local por feature.

---

### 15. Injetar mapper no ManagedRuntimeMessageController

Adicione field:

```java
private final ManagedRuntimeMessageWebMapper mapper;
```

Inclua no construtor.

No POST:

```java
var command =
        mapper.toCreateCommand(
                request
        );
```

No response de criação:

```java
var response =
        mapper.toCreatedResponse(
                message
        );
```

No GET:

```java
var response =
        mapper.toDetailResponse(
                message
        );
```

Status e headers permanecem no controller.

---

### 16. Injetar mapper no RuntimeMessageController

Adicione:

```java
private final RuntimeMessageWebMapper mapper;
```

Use o mapper para:

- preview command;
- preview response;
- query;
- query response;
- item response.

O controller não deve chamar constructors de commands ou responses.

---

### 17. Preservar ResponseEntity no controller

Não mova para o mapper:

```text
ok;

created;

notFound;

noContent;

ETag;

Location;

Cache-Control.
```

Essas são decisões HTTP.

---

### 18. Criar ManagedRuntimeMessageWebMapperTest

Teste unitário sem Spring.

Cenários:

- request válido para command;
- id não existe na origem;
- created response;
- detail response;
- campos preservados;
- objetos distintos;
- origem null falha;
- nenhum estado é mantido.

Use `Clock.fixed` somente para criar fixtures estáveis.

---

### 19. Criar RuntimeMessageWebMapperTest

Teste:

- preview request para command;
- preview result para response;
- query input para query;
- query result para response;
- item result para response;
- listas preservadas;
- listas não modificáveis;
- formatos preservados;
- origem null falha.

---

### 20. Criar MapperNullPolicyTest

Valide a política:

```text
source raiz null:
falha.

tags null permitidas:
lista vazia.

messages null quando record permite:
lista vazia.

elemento null em lista:
rejeitado pela fixture ou documentado.
```

Não altere o comportamento sem teste.

---

### 21. Criar MapperListMappingTest

Crie uma lista de modelos de fixture.

Mapeie com método explícito de lista em mapper de teste:

```java
List<Target> toResponses(
        List<Source> source
).
```

Valide:

- ordem;
- quantidade;
- objetos distintos;
- lista não modificável;
- origem não alterada.

Não crie endpoint de listagem novo.

---

### 22. Criar MapperCompositionTest

Em `src/test/java`, crie fixtures:

```text
Address;

Customer;

AddressResponse;

CustomerResponse;

AddressMapper;

CustomerMapper.
```

O `CustomerMapper` recebe `AddressMapper` pelo construtor.

Valide nested mapping.

Não mova as fixtures para produção.

---

### 23. Criar MapperContextDataTest

Crie fixture:

```java
record MappingContext(
        String apiVersion,
        ZoneId zoneId
) {
}
```

Mapeie um model com `Instant` para response de fixture contendo:

```text
apiVersion;

OffsetDateTime.
```

Passe o contexto como parâmetro.

Confirme que o mapper não guarda locale ou zone em field mutável.

---

### 24. Criar ControlledUpdateMappingTest

Fixtures:

```text
UpdateRequest:
value, id, version.

UpdateCommand:
value.

ExistingDraft:
id, value, version.
```

O mapper deve produzir command somente com:

```text
value.
```

Ou aplicar somente `value` ao draft.

Confirme que:

```text
id não muda;

version não muda;

createdAt não muda.
```

Não crie endpoint PUT ou PATCH.

---

### 25. Criar MapperArchitectureTest

Valide:

- package `web.mapper`;
- classes terminam em `Mapper`;
- mappers são stateless;
- fields, quando existirem, são somente outros mappers final;
- controllers recebem mapper por construtor;
- controllers não chamam constructors de `Command` ou `Response`;
- response DTOs não declaram factory `from`;
- mappers não importam repository;
- mappers não importam `ResponseEntity`;
- mappers não importam `HttpStatus`;
- mappers não usam `ObjectMapper`;
- mappers não usam `BeanUtils`;
- mappers não usam reflection;
- nenhum MapStruct ou ModelMapper no POM;
- nenhum método genérico `map(Object, Class)`.

---

### 26. Criar MapperControllerIntegrationWebMvcTest

Use `@WebMvcTest`.

Importe os mappers reais:

```java
@Import({
    ManagedRuntimeMessageWebMapper.class,
    RuntimeMessageWebMapper.class
})
```

Mantenha services como `@MockitoBean`.

Valide que contratos JSON e headers da aula 366 permanecem iguais.

---

### 27. Criar MapperLiveContractIT

Use servidor real em porta aleatória.

Fluxo:

- criar managed message;
- consultar detalhe;
- enviar preview;
- consultar query;
- consultar item.

Confirme que a extração do mapping não alterou:

- status;
- headers;
- nomes JSON;
- tipos;
- listas;
- ausência de campos internos.

---

### 28. Testar controllers unitariamente

Atualize testes unitários existentes.

Instancie controllers com:

- service mock;
- mapper real.

Ou mocke o mapper quando o objetivo for provar somente delegação HTTP.

Não misture objetivos no mesmo teste.

---

### 29. Testar mapper como bean

Crie contexto pequeno ou use `@SpringBootTest`.

Confirme:

```text
ManagedRuntimeMessageWebMapper:
um bean singleton.

RuntimeMessageWebMapper:
um bean singleton.
```

Não teste detalhes internos do component scan novamente.

---

### 30. Validar ausência de BeanUtils

Execute:

```powershell
Get-ChildItem src -Recurse -Filter "*.java" |
  Select-String `
    -Pattern "BeanUtils|copyProperties"
```

Resultado esperado na produção:

```text
zero.
```

---

### 31. Validar ausência de reflection mapping

Pesquise:

```text
java.lang.reflect;

getDeclaredFields;

setAccessible;

ObjectMapper.convertValue;

Map<String, Object>.
```

As fixtures didáticas também devem evitar essas abordagens.

---

### 32. Criar manual-mapper-definition.md

Explique:

- origem;
- destino;
- direção;
- fronteira;
- responsabilidade;
- stateless;
- campos explícitos.

---

### 33. Criar mapper-factory-assembler.md

Compare:

```text
mapper:
transforma representações.

factory:
cria objeto válido.

assembler:
combina múltiplas fontes.

converter:
conversão geral de tipos.

message converter:
conteúdo HTTP.
```

---

### 34. Criar mapper-boundaries.md

Documente o que entra e não entra no mapper.

Inclua:

- sem repository;
- sem status;
- sem headers;
- sem transação;
- sem validação de negócio;
- sem serialização JSON.

---

### 35. Criar request-command-mapping.md

Liste campos de cada request e command.

Mostre por que id, version e dates não atravessam a entrada.

---

### 36. Criar model-response-mapping.md

Crie tabela:

```text
campo interno;

campo público;

publicado?;

motivo.
```

Inclua campos sensíveis de fixture.

---

### 37. Criar list-nested-mapping.md

Explique:

- `stream().map`;
- ordem;
- lista vazia;
- null;
- nested mapper;
- composição;
- ausência de queries no loop.

---

### 38. Criar mapper-null-policy.md

Defina:

```text
source obrigatória null:
falha.

coleção opcional null:
vazia.

mapper não retorna null.

elemento null:
política explícita.
```

---

### 39. Criar mapping-context-data.md

Documente:

- locale;
- zone;
- base URI;
- permissions;
- contexto explícito;
- sem state mutável;
- sem repository escondido.

---

### 40. Criar controlled-update-mapping.md

Explique:

- whitelist de campos editáveis;
- command específico;
- id e version protegidos;
- sem mass assignment;
- sem endpoint de update nesta aula.

---

### 41. Criar why-no-reflection-copy.md

Compare mapping explícito com:

- BeanUtils;
- reflection;
- ObjectMapper;
- Map;
- frameworks automáticos.

Não afirme que ferramentas são universalmente ruins.

Explique por que não são adotadas nesta etapa e nesta fronteira.

---

### 42. Criar mapper-baseline.md

Liste:

- mapper;
- origem;
- destino;
- null policy;
- lista;
- teste;
- consumidor.

---

### 43. Criar scripts

`63_executar_testes_mappers.ps1` executa os testes unitários.

`64_validar_controller_sem_mapping.ps1` pesquisa constructors de commands e responses nos controllers.

`65_validar_sem_reflection.ps1` pesquisa APIs proibidas.

`66_testar_listas_e_nulls.ps1` executa testes específicos.

`67_testar_contratos_com_mappers.ps1` executa MockMvc.

`68_executar_teste_live_mappers.ps1` executa integração real.

---

### 44. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageWebMapperTest,RuntimeMessageWebMapperTest,MapperNullPolicyTest,MapperListMappingTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 45. Executar testes de conceitos

```powershell
.\mvnw.cmd `
  -Dtest=MapperCompositionTest,MapperContextDataTest,ControlledUpdateMappingTest test
```

As fixtures ficam somente em test source.

---

### 46. Executar teste arquitetural

```powershell
.\mvnw.cmd `
  -Dtest=MapperArchitectureTest test
```

Confirme que nenhuma API de cópia genérica aparece.

---

### 47. Executar testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=MapperControllerIntegrationWebMvcTest test
```

Compare com a baseline JSON da aula 367.

---

### 48. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=MapperLiveContractIT test
```

Confirme porta aleatória e contexto fechado.

---

### 49. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem continuar verdes.

---

### 50. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 51. Revisar escopo

Confirme:

```text
mappers por feature:
dois.

mapping em controller:
zero.

factory from em response:
zero.

BeanUtils:
zero.

ObjectMapper mapping:
zero.

reflection:
zero.

MapStruct:
zero.

ModelMapper:
zero.

Bean Validation:
zero.

endpoint update:
zero.
```

---

### 52. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs;
- fixture em produção;
- dependency de mapper framework;
- código gerado;
- annotation de validation;
- alteração de contrato JSON.

---

## Entendendo o que foi feito

### A conversao ganhou uma responsabilidade propria

Controllers deixaram de construir commands e responses.

### Cada campo ficou visivel

A whitelist é expressa pelo construtor do destino.

### Os mappers permaneceram sem regra

Eles não acessam repository, status ou transações.

### Listas e nulls ganharam politica

O comportamento deixou de ser acidental.

### Conceitos avancados ficaram isolados

Nested mapping, context data e update controlado foram praticados sem mudar a API.

---

## Erros comuns importantes

### Criar mapper generico para tudo

As fronteiras e decisões de campos voltam a ficar escondidas.

### Usar ObjectMapper para converter DTOs

Configuração JSON passa a controlar arquitetura interna.

### Colocar regra de negocio no mapper

A transformação vira um segundo service.

### Retornar null silenciosamente

O erro reaparece longe da origem.

### Mover ResponseEntity para o mapper

A camada de transformação fica acoplada ao protocolo.

---

## Comandos uteis

### Testes de mapper

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageWebMapperTest,RuntimeMessageWebMapperTest test
```

### Politicas

```powershell
.\mvnw.cmd `
  -Dtest=MapperNullPolicyTest,MapperListMappingTest test
```

### Arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=MapperArchitectureTest test
```

### Buscar copias genericas

```powershell
Get-ChildItem src -Recurse -Filter "*.java" |
  Select-String `
    -Pattern "BeanUtils|copyProperties|convertValue|getDeclaredFields|setAccessible"
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Campo novo

Adicione em fixture um campo interno:

```text
internalCode.
```

Confirme que o response não muda até o mapper ser alterado explicitamente.

### Parte 2 — Mapper generico

Crie em test source um mapper com:

```text
map(Object source).
```

Liste os problemas de tipo e direção.

Remova a fixture.

### Parte 3 — Lista

Mapeie lista com três elementos.

Inclua lista vazia e lista null conforme a policy.

### Parte 4 — Nested

Adicione `Country` dentro da fixture `Address`.

Crie `CountryMapper`.

Componha sem duplicar os campos.

### Parte 5 — Context

Passe outra `ZoneId` ao fixture mapper.

Confirme resposta diferente sem alterar estado do mapper.

### Parte 6 — Update

Envie id e version maliciosos à fixture de update.

Confirme que somente `value` atravessa.

### Parte 7 — Factory

Mova temporariamente uma regra de criação de domínio para o mapper.

Explique por que a factory de domínio é o local melhor.

Restaure.

### Parte 8 — ADR

Registre:

```text
mappers por feature;

metodos direcionais;

mapping explicito;

null policy testada;

listas imutaveis;

nested mapper por composicao;

context data por parametro;

update por whitelist;

sem reflection;

sem mapper framework nesta etapa.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 367 foi preservada;
- o mesmo projeto foi continuado;
- mapper foi definido como transformação entre representações;
- mapping foi diferenciado de binding e serialização;
- mapping foi separado de regra de negócio;
- mappers manuais foram adotados;
- benefícios e custos foram discutidos;
- mappers foram organizados por feature;
- `ManagedRuntimeMessageWebMapper` foi criado;
- `RuntimeMessageWebMapper` foi criado;
- mappers são stateless;
- mappers são beans singleton sem estado por request;
- métodos possuem direção explícita;
- request foi convertido para command;
- modelo interno foi convertido para created response;
- modelo interno foi convertido para detail response;
- preview request foi convertido para command;
- preview result foi convertido para response;
- request params foram convertidos para query;
- query result foi convertido para response;
- item result foi convertido para response;
- todos os campos foram copiados explicitamente;
- campos internos não foram publicados;
- over-posting continuou bloqueado;
- factories `from` foram removidas dos response DTOs;
- DTOs ficaram sem dependência dos modelos internos;
- controllers receberam mappers por constructor injection;
- controllers deixaram de construir commands;
- controllers deixaram de construir response DTOs;
- `ResponseEntity`, status e headers permaneceram nos controllers;
- mappers não importam repository;
- mappers não importam `ResponseEntity`, `HttpStatus` ou `HttpHeaders`;
- mappers não executam queries;
- mappers não executam validação de negócio;
- mapper foi diferenciado de factory;
- mapper foi diferenciado de assembler;
- mapper foi diferenciado de Spring `Converter`;
- mapper foi diferenciado de `HttpMessageConverter`;
- `ObjectMapper` não foi usado como mapper;
- `BeanUtils.copyProperties` não foi usado;
- reflection não foi usada;
- `Map<String, Object>` não foi usado;
- MapStruct, ModelMapper e outros frameworks não foram adicionados;
- null policy foi definida;
- origem raiz null falhou rápido;
- coleção opcional null virou lista vazia quando permitido;
- mapper não retorna null silenciosamente;
- list mapping foi testado;
- ordem e quantidade foram preservadas;
- lista de destino ficou não modificável;
- origem não foi alterada;
- nested mapping foi demonstrado em fixture;
- composição entre mappers foi demonstrada;
- ciclos entre mappers foram evitados;
- context data foi passada por parâmetro;
- mapper não guardou locale ou zone em estado mutável;
- context data não escondeu repository;
- atualização controlada foi demonstrada em fixture;
- id, version e createdAt ficaram protegidos;
- nenhum endpoint de update foi criado;
- mapping não formatou tipos indiscriminadamente com `toString`;
- defaults de negócio não foram escondidos;
- `ManagedRuntimeMessageWebMapperTest` foi criado;
- `RuntimeMessageWebMapperTest` foi criado;
- `MapperNullPolicyTest` foi criado;
- `MapperListMappingTest` foi criado;
- `MapperCompositionTest` foi criado;
- `MapperContextDataTest` foi criado;
- `ControlledUpdateMappingTest` foi criado;
- `MapperArchitectureTest` foi criado;
- `MapperControllerIntegrationWebMvcTest` foi criado;
- mappers reais foram importados na slice MVC;
- contratos JSON e headers foram preservados;
- `MapperLiveContractIT` foi criado;
- servidor real e porta aleatória foram usados;
- contexto foi fechado;
- documentação de definição, fronteiras, requests, responses, listas, nulls, contexto, update e reflection foi criada;
- baseline dos mappers foi documentada;
- scripts foram criados;
- testes unitários, conceituais, arquiteturais, MVC, live, suite e package passaram;
- nenhuma Bean Validation, validação customizada, persistência, JPA, Flyway, ControllerAdvice ou ProblemDetail foi antecipado;
- ponte para a aula 369 está correta;
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
git commit -m "refactor(m14): extrair mappers manuais por feature"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- fixtures em produção;
- dependency de mapper framework;
- código gerado;
- annotations de validation;
- alteração acidental do JSON.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a responsabilidade de conversão deixou os controllers e os DTOs.

O fluxo consolidado ficou:

```text
request DTO;

web mapper;

command;

service;

result ou model;

web mapper;

response DTO;

ResponseEntity.
```

Você comprovou:

```text
mapping explicito;

mappers por feature;

controllers mais finos;

DTOs sem factories de dominio;

services independentes da web;

listas imutaveis;

null policy testada;

nested mapping;

composicao;

context data;

update controlado;

sem reflection;

sem frameworks automaticos;

contrato HTTP preservado.
```

A decisão central foi:

```text
cada campo deve atravessar a fronteira
por um mapping explicito,
testavel e orientado ao caso de uso.
```

A próxima aula será:

```text
369 - M14.14 - Bean Validation
```

Nela, você continuará no mesmo projeto e estudará:

- Jakarta Validation;
- provider Hibernate Validator;
- starter de validation;
- `@Valid`;
- `@Validated`;
- `@NotNull`;
- `@NotBlank`;
- `@NotEmpty`;
- `@Size`;
- `@Min`;
- `@Max`;
- `@Positive`;
- `@PositiveOrZero`;
- `@Pattern`;
- `@Email`;
- constraints em records;
- validação de request body;
- validação de path e query;
- method validation;
- cascata;
- listas;
- mensagens;
- locale;
- groups conceituais;
- testes de violations;
- diferença entre binding e validation.

A aula 368 respondeu:

```text
onde e como converter
os objetos entre as camadas?
```

A aula 369 responderá:

```text
como declarar e executar
regras de validade sobre as entradas?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar mapper, factory, assembler e converter.
- [ ] Sei escrever mapping manual explícito.
- [ ] Sei definir null policy.
- [ ] Sei mapear listas e objetos aninhados.
- [ ] Sei manter controllers e services livres de responsabilidades indevidas.

---

## Troubleshooting adicional

### Mapper nao aparece no WebMvcTest

Importe o mapper real com `@Import` ou declare a estratégia de teste conscientemente.

### Controller ainda cria response

Localize constructors ou factories e mova a transformação para o mapper.

### Campo novo apareceu sem revisao

Revise se existe cópia genérica ou se o model está sendo retornado diretamente.

### Lista mapeada pode ser alterada

Use `Stream.toList()` ou cópia não modificável.

### Null gera erro distante

Defina a policy no início do método e falhe rápido.

### Mapper conhece repository

Remova a busca; entregue ao mapper todas as fontes já resolvidas.

---

## Perguntas de revisao

1. O que é mapper?
2. Mapping e serialização são iguais?
3. Mapping e binding são iguais?
4. Mapper deve executar regra de negócio?
5. Por que usar mapper por feature?
6. Por que métodos direcionais?
7. Mapper pode ser bean?
8. O que significa stateless?
9. Qual diferença entre mapper e factory?
10. Qual diferença entre mapper e assembler?
11. Para que serve Spring Converter?
12. Para que serve HttpMessageConverter?
13. Por que evitar ObjectMapper como mapper?
14. Qual risco do BeanUtils?
15. Qual é a null policy da aula?
16. Como mapear listas?
17. Como mapear objetos aninhados?
18. Como passar context data?
19. Como proteger update?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Transforma uma representação em outra.
2. Não.
3. Não.
4. Não.
5. Para limitar responsabilidade.
6. Para deixar origem e destino claros.
7. Sim.
8. Não guardar dados por operação.
9. Factory cria objeto válido.
10. Assembler combina fontes.
11. Conversão geral de tipos.
12. Ler e escrever conteúdo HTTP.
13. Esconde campos e depende de configuração JSON.
14. Copia por nomes sem whitelist explícita.
15. Origem obrigatória falha; coleção permitida pode virar vazia.
16. Com mapping explícito por elemento.
17. Composição de mappers.
18. Por parâmetro.
19. Whitelist de campos editáveis.
20. Bean Validation.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 368 - M14.13 - Mappers manuais

- Continuei no projeto `formacao-java-backend-api`.
- Defini mapper como transformação entre representações.
- Diferenciei mapping de binding e serialização.
- Diferenciei mapper de factory e assembler.
- Diferenciei mapper de `Converter` e `HttpMessageConverter`.
- Criei `ManagedRuntimeMessageWebMapper`.
- Criei `RuntimeMessageWebMapper`.
- Organizei mappers por feature.
- Mantive os mappers stateless.
- Injetei os mappers nos controllers por construtor.
- Extraí request DTO para command.
- Extraí model e result para response DTO.
- Removi factories `from` dos responses.
- Mantive status, headers e `ResponseEntity` nos controllers.
- Mantive repositories e regras de negócio fora dos mappers.
- Defini uma política explícita de null.
- Falhei rápido para origem obrigatória ausente.
- Normalizei coleções opcionais permitidas.
- Testei mapping de listas.
- Preservei ordem e imutabilidade.
- Pratiquei nested mapping em fixture.
- Pratiquei composição entre mappers.
- Passei context data por parâmetro.
- Evitei estado mutável no mapper.
- Pratiquei atualização controlada por whitelist.
- Protegi id, versão e datas.
- Não criei endpoint de update.
- Rejeitei `BeanUtils.copyProperties`.
- Rejeitei `ObjectMapper.convertValue`.
- Rejeitei reflection e Map genérico.
- Não adicionei MapStruct ou ModelMapper.
- Criei testes unitários e arquiteturais dos mappers.
- Validei contratos com MockMvc e servidor real.
- Mantive JSON, status e headers compatíveis.
- Não adicionei Bean Validation.
- Próxima aula: Bean Validation.
```

---

## Referencia tecnica curta

```text
Mapper:
transformacao.

Factory:
criacao.

Assembler:
composicao.

Converter:
tipo geral.

MessageConverter:
HTTP content.

Request:
origem web.

Command:
destino aplicacao.

Result:
origem aplicacao.

Response:
destino web.

Whitelist:
campos explicitos.
```

Regra final:

```text
mappers manuais devem transformar requests, commands, results, modelos internos e responses por metodos direcionais, explicitos e testaveis; cada campo precisa ser escolhido conscientemente, nulls e listas devem seguir politicas documentadas, nested mapping deve usar composicao, context data deve entrar por parametro e atualizacoes devem aplicar somente campos permitidos, sem reflection, copia por nome, ObjectMapper, BeanUtils ou regras de negocio escondidas.
```
