# 456 - M16.01 - Integracoes HTTP entre sistemas

## Apresentação da aula

O Módulo 15 terminou com uma aplicação protegida por:

```text
autenticação;

autorização;

multi-tenancy;

ownership;

DTOs;

auditoria;

rate limiting;

hardening;

testes;

release gate.
```

Agora a formação avança para um novo tipo de problema.

Até aqui, grande parte dos fluxos acontecia dentro de uma única aplicação:

```text
controller;

service;

domain;

repository;

database.
```

No Módulo 16, um sistema precisará conversar com outro.

Exemplo:

```text
sistema de ordens
precisa consultar
o catálogo de produtos.
```

Essa mudança cria uma nova fronteira.

A chamada deixa de ser apenas uma chamada de método.

Ela passa a atravessar:

- processo;
- porta de rede;
- DNS ou endereço;
- HTTP;
- serialização;
- autenticação entre sistemas;
- contrato externo;
- latência;
- indisponibilidade;
- versões diferentes;
- observabilidade distribuída.

A pergunta central desta aula será:

```text
o que muda quando
uma regra de negócio
depende de uma resposta
fornecida por outro sistema?
```

A resposta começa por reconhecer que uma integração HTTP é uma comunicação distribuída.

Mesmo em um laboratório local, podem ocorrer:

```text
servidor fora do ar;

porta incorreta;

DNS inválido;

timeout;

conexão recusada;

TLS inválido;

token inválido;

status inesperado;

JSON incompatível;

campo ausente;

resposta lenta;

resposta duplicada;

mudança de contrato.
```

Nesta primeira aula do módulo, ainda não usaremos `RestClient` nem `WebClient`.

Esses clientes serão estudados nas aulas seguintes.

O objetivo atual é preparar corretamente:

- o sistema provedor;
- o sistema consumidor;
- o contrato;
- a fronteira de domínio;
- a matriz de falhas;
- a segurança;
- os testes do provedor;
- a forma manual de exercitar o HTTP.

O laboratório será criado em:

```text
labs/m16/aula-456-integracoes-http-entre-sistemas
```

Ele terá dois projetos:

```text
catalog-provider;

order-consumer.
```

O `catalog-provider` será responsável por fornecer disponibilidade de produto.

Endpoint:

```text
GET
/api/v1/products/{productCode}/availability
```

O `order-consumer` precisará consultar essa informação antes de aceitar uma nova ordem.

Entretanto, nesta aula o consumidor não terá um adapter HTTP real.

Ele terá uma porta:

```java
ProductCatalogGateway
```

e testes unitários com um fake controlado.

A chamada HTTP real será executada manualmente por:

```text
arquivo .http;

curl;

teste de contrato do provedor.
```

Na aula 457, criaremos:

```text
RestClientProductCatalogGateway
```

A separação é intencional.

Antes de aprender a sintaxe de um client HTTP, precisamos saber:

- qual contrato ele consome;
- quais falhas ele traduz;
- qual informação o domínio realmente precisa;
- o que deve permanecer fora do domínio;
- como autenticar a chamada;
- como correlacionar os dois sistemas;
- quais decisões ainda não estão implementadas.

A primeira decisão arquitetural será:

```text
o domínio do consumidor
não depende de HTTP.
```

O domínio conhece:

```text
ProductCatalogGateway;

ProductAvailabilitySnapshot;

ProductNotFound;

ProductCatalogUnavailable.
```

Ele não conhece:

- URL;
- JSON;
- status HTTP;
- header;
- bearer token;
- Spring client;
- socket;
- timeout.

A segunda decisão será:

```text
o contrato externo
não deve vazar
diretamente para o domínio.
```

O provedor pode responder:

```json
{
  "code": "SKU-1001",
  "name": "Teclado mecanico",
  "available": true,
  "availableQuantity": 25,
  "version": 7,
  "updatedAt": "2026-07-12T03:00:00Z"
}
```

O consumidor pode precisar apenas de:

```text
productCode;

available;

availableQuantity.
```

A terceira decisão será:

```text
a rede não é uma fronteira confiável.
```

Mesmo em comunicação interna, a chamada precisa considerar:

- identidade do serviço;
- audience;
- permission;
- TLS no ambiente real;
- dados mínimos;
- logs seguros;
- limites;
- erros.

No laboratório, o provedor continuará como Resource Server.

A permission será:

```text
catalog:availability:read.
```

O access token deverá possuir audience:

```text
catalog-api.
```

Tokens não serão salvos no Git.

O arquivo `.http` utilizará uma variável local:

```text
{{serviceToken}}
```

A aula será concluída quando:

1. os dois projetos existirem;
2. o provedor publicar o contrato;
3. o endpoint estiver protegido;
4. respostas e erros estiverem documentados;
5. o consumidor possuir uma porta de domínio;
6. o caso de uso funcionar com fake;
7. o HTTP for exercitado manualmente;
8. falhas forem classificadas;
9. a próxima aula tiver uma base pronta para `RestClient`.

---

## Onde estamos na formação

A transição oficial é:

```text
455:
Fechamento do Modulo 15.

456:
Integracoes HTTP entre sistemas.

457:
RestClient.

458:
WebClient.

459:
Timeouts em clientes HTTP.

460:
Retry com criterio.
```

O Módulo 15 respondeu:

```text
como proteger
uma aplicação?
```

O Módulo 16 começará respondendo:

```text
como uma aplicação
se comunica com outra
sem transformar a rede
em um detalhe invisível?
```

Nesta aula:

```text
sistema provedor:
sim.

sistema consumidor:
sim.

contrato HTTP:
sim.

porta de domínio:
sim.

segurança entre serviços:
modelada.

chamada manual:
sim.

RestClient:
próxima aula.

WebClient:
aula 458.

timeout:
aula 459.

retry:
aula 460.
```

A regra central será:

```text
integração externa
é uma fronteira explícita
do sistema.
```

---

## Objetivo prático

Ao final da aula, o laboratório terá:

```text
labs/m16/
└── aula-456-integracoes-http-entre-sistemas/
    ├── README.md
    ├── docs/
    │   ├── INTEGRATION_MAP.md
    │   ├── PRODUCT_AVAILABILITY_CONTRACT.md
    │   └── HTTP_FAILURE_MATRIX.md
    ├── requests/
    │   └── catalog-provider.http
    ├── catalog-provider/
    │   ├── pom.xml
    │   └── src/
    └── order-consumer/
        ├── pom.xml
        └── src/
```

No provedor:

```text
ProductAvailabilityController;

FindProductAvailabilityService;

ProductCatalog;

LocalProductCatalog;

ProductAvailabilityResponse;

CatalogProblemHandler;

CatalogSecurityConfiguration.
```

No consumidor:

```text
ProductCatalogGateway;

ProductAvailabilitySnapshot;

ValidateProductForOrderService;

ProductNotFoundException;

ProductCatalogUnavailableException.
```

Testes:

```text
ProductAvailabilityControllerTest;

ProductAvailabilitySecurityTest;

ProductAvailabilityContractTest;

ValidateProductForOrderServiceTest;

IntegrationBoundaryPolicyTest.
```

Você irá:

1. compreender integração síncrona;
2. identificar acoplamento temporal;
3. mapear responsabilidades;
4. criar o provedor;
5. definir o contrato;
6. criar resposta segura;
7. criar erros;
8. proteger o endpoint;
9. adicionar correlation ID;
10. criar arquivo `.http`;
11. criar o consumidor;
12. definir a porta;
13. definir o snapshot;
14. criar o caso de uso;
15. testar com fake;
16. classificar falhas;
17. documentar ownership do contrato;
18. registrar limitações;
19. executar os projetos;
20. preparar o `RestClient`.

---

## Conceito essencial

### Integração síncrona

Em uma integração HTTP síncrona, o consumidor envia uma request e espera uma response.

Fluxo:

```text
order-consumer;

HTTP request;

catalog-provider;

processamento;

HTTP response;

order-consumer continua.
```

Durante a espera, o fluxo do consumidor depende do provedor.

Isso cria acoplamento temporal.

---

### Acoplamento temporal

Acoplamento temporal significa que os dois sistemas precisam estar disponíveis em momentos compatíveis para o fluxo concluir.

Se o catálogo estiver indisponível:

```text
a validação da ordem
não recebe resposta.
```

O consumidor precisa decidir:

- falhar;
- aguardar;
- usar cache;
- usar fallback;
- enfileirar;
- aceitar com validação posterior.

Nesta aula, a decisão será:

```text
falhar de forma explícita.
```

Fallback, retry e circuit breaker serão estudados posteriormente.

---

### Fronteira de processo

Uma chamada Java local pode falhar por uma exception conhecida.

Uma chamada HTTP pode falhar antes de atingir o método remoto.

Exemplos:

```text
DNS;

conexão;

TLS;

proxy;

timeout;

autenticação;

roteamento;

servidor;

serialização.
```

Por isso, a integração precisa de um adapter.

O domínio não deve tratar `ConnectException` ou `HttpStatusCode`.

---

### Provedor e consumidor

Provedor:

```text
publica capacidade;

define contrato;

processa request;

retorna response;

documenta errors.
```

Consumidor:

```text
chama capacidade;

traduz contrato;

trata falhas;

protege seu domínio;

não depende de detalhes internos.
```

Nenhum dos dois controla sozinho toda a comunicação.

---

### Contrato

O contrato inclui mais que JSON.

Ele inclui:

- método;
- path;
- headers;
- autenticação;
- status;
- media type;
- body;
- campos;
- tipos;
- limites;
- semântica;
- erros;
- compatibilidade.

---

### Contrato do laboratório

Request:

```http
GET /api/v1/products/SKU-1001/availability
Accept: application/json
Authorization: Bearer <access-token>
X-Correlation-Id: corr-456-001
```

Response `200`:

```json
{
  "code": "SKU-1001",
  "name": "Teclado mecanico",
  "available": true,
  "availableQuantity": 25,
  "version": 7,
  "updatedAt": "2026-07-12T03:00:00Z"
}
```

---

### Status do contrato

Respostas previstas:

```text
200:
produto encontrado.

400:
código inválido.

401:
token ausente ou inválido.

403:
permission ausente.

404:
produto não encontrado.

406:
representation não aceita.

429:
limite excedido no provedor
quando essa policy existir.

503:
catálogo temporariamente indisponível.
```

O consumidor não deve tratar qualquer status como erro genérico sem classificação.

A tradução será implementada na aula 457.

---

### Identificador de produto

O código terá:

```text
mínimo:
3 caracteres.

máximo:
40 caracteres.

formato:
A-Z, 0-9, hífen e underscore.
```

Exemplo válido:

```text
SKU-1001.
```

Exemplo inválido:

```text
../../secret.
```

O path variable precisa ser validado.

---

### Versionamento de contrato

O path usa:

```text
/api/v1.
```

Isso não resolve sozinho toda compatibilidade.

Mudanças compatíveis possíveis:

- adicionar campo opcional;
- adicionar novo status documentado com coordenação;
- ampliar enum somente se consumidores tolerarem;
- corrigir descrição sem mudar semântica.

Mudanças incompatíveis:

- remover campo obrigatório;
- renomear campo;
- trocar tipo;
- mudar significado;
- trocar `404` por `200` com `available=false`;
- mudar autenticação sem coordenação.

---

### Tolerant reader com limite

O consumidor pode ignorar campos adicionais que não usa.

Mas ele não deve aceitar:

- tipo incompatível;
- campo obrigatório ausente;
- enum desconhecida quando altera decisão;
- body vazio em `200`;
- JSON malformado.

Tolerância não significa aceitar qualquer resposta.

---

### DTO externo e modelo interno

DTO externo:

```text
ProductAvailabilityHttpResponse.
```

Modelo interno:

```text
ProductAvailabilitySnapshot.
```

O adapter traduz um para o outro.

Nesta aula, criaremos apenas o modelo interno e o contrato externo documentado.

A classe HTTP do consumidor nasce na aula 457.

---

### Porta de saída

Porta:

```java
public interface ProductCatalogGateway {

    ProductAvailabilitySnapshot
    findAvailability(
            ProductCode productCode
    );
}
```

O caso de uso depende da porta.

O adapter HTTP implementará a porta.

---

### Tradução de falhas

O domínio consumidor precisa de categorias estáveis.

Exemplos:

```text
ProductNotFoundException;

ProductCatalogUnavailableException;

ProductCatalogContractException.
```

Ele não deve conhecer:

```text
404;

503;

JsonMappingException;

ConnectException.
```

O adapter traduz esses detalhes.

---

### Segurança entre serviços

Comunicação interna não significa confiável.

A chamada deverá validar:

- issuer;
- audience;
- assinatura;
- expiração;
- permission;
- TLS no ambiente real;
- target correto.

No laboratório:

```text
audience:
catalog-api.

permission:
catalog:availability:read.
```

O consumidor utilizará OAuth 2.0 Client Credentials em uma etapa futura.

Nesta aula, o token é obtido externamente e usado somente no arquivo `.http`.

---

### Token não entra no contrato de domínio

O service token pertence ao adapter e à infraestrutura.

O caso de uso não recebe:

```java
String accessToken
```

O domínio não decide como obter ou renovar credenciais.

---

### Correlation ID

Cada request recebe:

```text
X-Correlation-Id.
```

O consumidor deve:

- reutilizar o correlation ID atual quando existir;
- gerar um novo quando iniciar um fluxo;
- encaminhá-lo ao provedor;
- não usá-lo como autenticação;
- não colocá-lo em labels de alta cardinalidade.

Nesta aula, o provedor recebe, valida tamanho e inclui no log seguro.

---

### Observabilidade distribuída

Uma integração precisa permitir responder:

```text
qual sistema chamou;

qual endpoint;

qual outcome;

qual duração;

qual correlation;

qual status;

qual failure category.
```

Não logue:

- bearer token;
- body sensível;
- URL com secrets;
- stack em response;
- headers completos.

---

### Latência

Uma chamada local pode levar microssegundos ou poucos milissegundos.

Uma chamada de rede pode variar.

A latência total do consumidor inclui:

```text
DNS;

conexão;

TLS;

request;

fila do servidor;

processamento;

response;

desserialização.
```

Timeouts serão implementados na aula 459.

Nesta aula, apenas registraremos que o consumidor ainda não está pronto para produção sem eles.

---

### Falha parcial

O consumidor pode estar saudável enquanto o provedor está indisponível.

Ou o provedor pode processar uma operação, mas a response se perder.

Para `GET`, repetir pode ser seguro do ponto de vista semântico, mas retry automático ainda exige critério.

Para `POST`, duplicidade pode ser perigosa.

A aula 460 tratará retry.

Idempotência será aprofundada depois.

---

### Disponibilidade composta

Se um fluxo depende de vários sistemas síncronos, a disponibilidade final tende a diminuir.

Exemplo conceitual:

```text
ordem depende de catálogo;

catálogo depende de preço;

preço depende de imposto.
```

Cada dependência amplia latência e pontos de falha.

Integração deve ser escolhida conscientemente.

---

### Quando usar HTTP síncrono

É adequado quando:

- o consumidor precisa da resposta agora;
- o contrato é request-response;
- a latência é aceitável;
- a indisponibilidade pode ser tratada;
- a operação é curta;
- o acoplamento temporal é aceitável.

Pode ser inadequado quando:

- processamento é longo;
- alta fan-out existe;
- resposta imediata não é necessária;
- indisponibilidade precisa ser absorvida;
- eventos representam melhor o domínio.

Mensageria será estudada depois.

---

## Mão na massa guiada

### 1. Criar o laboratório

Na raiz:

```powershell
New-Item `
  -ItemType Directory `
  -Path labs/m16/aula-456-integracoes-http-entre-sistemas `
  -Force

Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas
```

Crie:

```text
catalog-provider;

order-consumer;

docs;

requests.
```

---

### 2. Criar o README

Arquivo:

```text
README.md
```

Inclua:

```markdown
# Aula 456 - Integracoes HTTP

## Sistemas

- catalog-provider
- order-consumer

## Fluxo

order-consumer
consulta disponibilidade
no catalog-provider.

## Estado atual

- provider implementado;
- contrato documentado;
- consumer possui gateway;
- chamada manual funcionando;
- adapter HTTP ainda ausente.

## Proxima aula

Implementar o gateway
com Spring RestClient.
```

---

### 3. Criar o mapa da integração

Arquivo:

```text
docs/INTEGRATION_MAP.md
```

Diagrama:

```text
[Order Consumer]
        |
        | GET /api/v1/products/{code}/availability
        | Bearer token
        | X-Correlation-Id
        v
[Catalog Provider]
        |
        v
[Product Catalog]
```

Registre:

- owner do provedor;
- owner do consumidor;
- contrato;
- classificação dos dados;
- audience;
- permission;
- failure owner;
- próxima evolução.

---

### 4. Criar o catalog-provider

Use Java 21 e a mesma linha de Spring Boot validada na formação.

Dependências:

```text
spring-boot-starter-web;

spring-boot-starter-validation;

spring-boot-starter-security;

spring-boot-starter-oauth2-resource-server;

spring-boot-starter-actuator;

spring-boot-starter-test;

spring-security-test.
```

Nesta aula, o catálogo local pode usar memória.

Persistência não é o objetivo.

---

### 5. Criar ProductCode

```java
public record ProductCode(
        String value
) {
    private static final Pattern ALLOWED =
            Pattern.compile(
                "[A-Z0-9_-]{3,40}"
            );

    public ProductCode {
        if (
            value == null
            || !ALLOWED
                .matcher(
                    value
                )
                .matches()
        ) {
            throw new InvalidProductCodeException();
        }
    }
}
```

O value object centraliza a regra.

---

### 6. Criar ProductAvailability

```java
public record ProductAvailability(
        ProductCode code,
        String name,
        boolean available,
        int availableQuantity,
        long version,
        Instant updatedAt
) {
    public ProductAvailability {
        Objects.requireNonNull(
                code
        );

        Objects.requireNonNull(
                name
        );

        Objects.requireNonNull(
                updatedAt
        );

        if (availableQuantity < 0) {
            throw new IllegalArgumentException(
                "Quantity cannot be negative"
            );
        }
    }
}
```

---

### 7. Criar ProductCatalog

```java
public interface ProductCatalog {

    Optional<ProductAvailability>
    findAvailability(
            ProductCode productCode
    );
}
```

O service depende da porta.

---

### 8. Criar LocalProductCatalog

Sob profile local:

```java
@Component
@Profile("local")
public class LocalProductCatalog
        implements ProductCatalog {

    private final Map<ProductCode, ProductAvailability>
            products;

    public LocalProductCatalog(
            Clock clock
    ) {
        ProductCode code =
                new ProductCode(
                    "SKU-1001"
                );

        this.products =
                Map.of(
                    code,
                    new ProductAvailability(
                        code,
                        "Teclado mecanico",
                        true,
                        25,
                        7,
                        clock.instant()
                    )
                );
    }

    @Override
    public Optional<ProductAvailability>
    findAvailability(
            ProductCode productCode
    ) {
        return Optional.ofNullable(
                products.get(
                    productCode
                )
        );
    }
}
```

Os dados são sintéticos.

---

### 9. Criar o service

```java
@Service
public class FindProductAvailabilityService {

    private final ProductCatalog catalog;

    @PreAuthorize(
        "hasAuthority('catalog:availability:read')"
    )
    public ProductAvailability find(
            ProductCode productCode
    ) {
        return catalog
                .findAvailability(
                    productCode
                )
                .orElseThrow(
                    ProductNotFoundException::new
                );
    }
}
```

Permission no service preserva a proteção fora do controller.

---

### 10. Criar response DTO

```java
public record ProductAvailabilityResponse(
        String code,
        String name,
        boolean available,
        int availableQuantity,
        long version,
        Instant updatedAt
) {
    static ProductAvailabilityResponse from(
            ProductAvailability availability
    ) {
        return new ProductAvailabilityResponse(
                availability.code()
                            .value(),
                availability.name(),
                availability.available(),
                availability.availableQuantity(),
                availability.version(),
                availability.updatedAt()
        );
    }
}
```

Não retorne objeto de domínio diretamente.

---

### 11. Criar o controller

```java
@RestController
@RequestMapping(
    path = "/api/v1/products",
    produces = MediaType.APPLICATION_JSON_VALUE
)
public class ProductAvailabilityController {

    private final FindProductAvailabilityService service;

    @GetMapping(
        "/{productCode}/availability"
    )
    ProductAvailabilityResponse find(
            @PathVariable
            String productCode
    ) {
        ProductAvailability availability =
                service.find(
                    new ProductCode(
                        productCode
                    )
                );

        return ProductAvailabilityResponse.from(
                availability
        );
    }
}
```

---

### 12. Configurar segurança

Baseline:

```java
@Bean
SecurityFilterChain catalogApi(
        HttpSecurity http
) throws Exception {
    http
        .csrf(
            csrf ->
                csrf.disable()
        )
        .sessionManagement(
            session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
        )
        .authorizeHttpRequests(
            requests ->
                requests
                    .requestMatchers(
                        "/actuator/health"
                    )
                    .permitAll()
                    .requestMatchers(
                        "/api/**"
                    )
                    .authenticated()
                    .anyRequest()
                    .denyAll()
        )
        .oauth2ResourceServer(
            resourceServer ->
                resourceServer.jwt(
                    Customizer.withDefaults()
                )
        );

    return http.build();
}
```

Audience validator:

```text
catalog-api.
```

---

### 13. Criar correlation filter

Regras:

- aceitar header com até 100 caracteres;
- rejeitar controles;
- gerar UUID quando ausente;
- colocar no MDC;
- retornar no response;
- limpar MDC no `finally`.

Não logar todos os headers.

---

### 14. Criar Problem Details

Codes:

```text
invalid_product_code;

product_not_found;

catalog_temporarily_unavailable;

authentication_required;

invalid_token;

access_denied.
```

Inclua:

```text
correlationId;

Cache-Control: no-store.
```

Não exponha exception message.

---

### 15. Criar contrato documentado

Arquivo:

```text
docs/PRODUCT_AVAILABILITY_CONTRACT.md
```

Documente:

- método;
- path;
- security;
- permission;
- audience;
- request headers;
- success response;
- error responses;
- limites;
- compatibilidade;
- owner;
- exemplos sintéticos.

---

### 16. Criar arquivo HTTP

Arquivo:

```text
requests/catalog-provider.http
```

Conteúdo:

```http
@baseUrl = http://localhost:8081
@productCode = SKU-1001

GET {{baseUrl}}/api/v1/products/{{productCode}}/availability
Accept: application/json
Authorization: Bearer {{serviceToken}}
X-Correlation-Id: corr-aula-456-001
```

A variável `serviceToken` fica no environment local ignorado.

---

### 17. Criar requests negativas

No mesmo arquivo:

```http
### Sem token
GET {{baseUrl}}/api/v1/products/{{productCode}}/availability
Accept: application/json

### Codigo invalido
GET {{baseUrl}}/api/v1/products/..%2Fsecret/availability
Accept: application/json
Authorization: Bearer {{serviceToken}}

### Produto inexistente
GET {{baseUrl}}/api/v1/products/SKU-9999/availability
Accept: application/json
Authorization: Bearer {{serviceToken}}
```

---

### 18. Criar controller test

Cenários:

- produto existente;
- produto inexistente;
- código inválido;
- `Accept` inválido;
- correlation ID presente;
- no-store nos errors;
- response allowlist.

---

### 19. Criar security test

Cenários:

```text
sem token:
401.

wrong audience:
401.

ID Token:
401.

sem permission:
403.

permission exata:
200.

authority semelhante:
403.
```

O teste criptográfico real pertence à estratégia já construída no M15.

---

### 20. Criar contract test

Valide:

- fields exatos;
- tipos;
- media type;
- status;
- error code;
- ausência de internals;
- `code` preservado;
- quantity não negativa;
- timestamp ISO-8601.

---

### 21. Criar o order-consumer

Dependências iniciais:

```text
spring-boot-starter-web;

spring-boot-starter-validation;

spring-boot-starter-test.
```

Ainda não adicione `RestClient` por configuração específica.

O Spring Framework já pode disponibilizá-lo em contexto futuro, mas o adapter não será criado nesta aula.

---

### 22. Criar ProductCode no consumidor

O consumidor possui seu próprio value object.

Ele não importa a classe Java do provedor.

Integração compartilha contrato, não artifact de domínio por conveniência.

---

### 23. Criar snapshot interno

```java
public record ProductAvailabilitySnapshot(
        ProductCode productCode,
        boolean available,
        int availableQuantity
) {
    public ProductAvailabilitySnapshot {
        Objects.requireNonNull(
                productCode
        );

        if (availableQuantity < 0) {
            throw new IllegalArgumentException(
                "Quantity cannot be negative"
            );
        }
    }
}
```

O consumer não precisa de `name`, `version` ou `updatedAt` neste caso de uso.

---

### 24. Criar gateway

```java
public interface ProductCatalogGateway {

    ProductAvailabilitySnapshot
    findAvailability(
            ProductCode productCode
    );
}
```

Nenhum detalhe HTTP aparece.

---

### 25. Criar caso de uso

```java
@Service
public class ValidateProductForOrderService {

    private final ProductCatalogGateway productCatalogGateway;

    public void requireAvailable(
            ProductCode productCode,
            int requestedQuantity
    ) {
        if (requestedQuantity <= 0) {
            throw new InvalidOrderQuantityException();
        }

        ProductAvailabilitySnapshot snapshot =
                productCatalogGateway
                    .findAvailability(
                        productCode
                    );

        if (
            !snapshot.available()
            || snapshot.availableQuantity()
               < requestedQuantity
        ) {
            throw new ProductUnavailableForOrderException();
        }
    }
}
```

O service não conhece status HTTP.

---

### 26. Criar fake somente em teste

```java
final class FakeProductCatalogGateway
        implements ProductCatalogGateway {

    private final Map<ProductCode, ProductAvailabilitySnapshot>
            products =
                new HashMap<>();

    void add(
            ProductAvailabilitySnapshot snapshot
    ) {
        products.put(
                snapshot.productCode(),
                snapshot
        );
    }

    @Override
    public ProductAvailabilitySnapshot findAvailability(
            ProductCode productCode
    ) {
        ProductAvailabilitySnapshot snapshot =
                products.get(
                    productCode
                );

        if (snapshot == null) {
            throw new ProductNotFoundException();
        }

        return snapshot;
    }
}
```

Não coloque esse fake em `src/main`.

---

### 27. Testar o caso de uso

Cenários:

- produto disponível;
- quantidade suficiente;
- quantidade insuficiente;
- produto indisponível;
- produto inexistente;
- quantidade inválida;
- gateway indisponível.

Para indisponibilidade, o fake pode lançar:

```text
ProductCatalogUnavailableException.
```

---

### 28. Criar IntegrationBoundaryPolicyTest

Falhe se:

- domain importar `org.springframework.web`;
- application importar client HTTP;
- `ProductCatalogGateway` receber URL;
- service receber access token;
- snapshot reproduzir todos os fields externos sem necessidade;
- fake estiver em `src/main`.

---

### 29. Criar matriz de falhas

Arquivo:

```text
docs/HTTP_FAILURE_MATRIX.md
```

Tabela:

| Falha | Origem | Tradução futura | Decisão atual |
|---|---|---|---|
| 404 | contrato | ProductNotFound | negar ordem |
| 401/403 | segurança | IntegrationAuthentication | falhar |
| 503 | provedor | CatalogUnavailable | falhar |
| conexão | rede | CatalogUnavailable | falhar |
| timeout | rede | CatalogTimeout | aula 459 |
| JSON inválido | contrato | CatalogContract | falhar |
| 429 | proteção | CatalogRateLimited | aula futura |

Não implemente todas as traduções ainda.

---

### 30. Documentar synchronous boundary

No mapa, registre:

```text
o order-consumer
depende temporalmente
do catalog-provider
para validar a ordem.
```

Risco:

```text
indisponibilidade do catálogo
impede o fluxo.
```

Decisão atual:

```text
falha explícita;

sem retry;

sem fallback;

sem cache.
```

---

### 31. Executar o provedor

```powershell
Set-Location catalog-provider

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

Porta sugerida:

```text
8081.
```

---

### 32. Obter token de laboratório

Use o Keycloak local do M15 ou token sintético em testes.

Para request manual, obtenha access token por fluxo aprovado.

Não use password grant.

Não versione o token.

Confirme:

```text
audience catalog-api;

permission catalog:availability:read.
```

---

### 33. Executar request manual

Use o arquivo `.http` ou:

```powershell
curl.exe `
  --request GET `
  --url "http://localhost:8081/api/v1/products/SKU-1001/availability" `
  --header "Accept: application/json" `
  --header "Authorization: Bearer $env:CATALOG_SERVICE_TOKEN" `
  --header "X-Correlation-Id: corr-aula-456-001"
```

O token vem de environment.

---

### 34. Validar response

Confirme:

- `200`;
- JSON;
- fields esperados;
- correlation ID;
- nenhuma session cookie;
- nenhum server internal;
- nenhum token no log.

---

### 35. Executar negativas

Valide:

- sem token;
- audience incorreta;
- permission ausente;
- produto inexistente;
- código inválido;
- Accept incompatível.

Registre status e code.

---

### 36. Executar testes do provedor

```powershell
.\mvnw.cmd `
  -Dtest=ProductAvailabilityControllerTest,ProductAvailabilitySecurityTest,ProductAvailabilityContractTest `
  test
```

---

### 37. Executar testes do consumidor

```powershell
Set-Location ..\order-consumer

.\mvnw.cmd `
  -Dtest=ValidateProductForOrderServiceTest,IntegrationBoundaryPolicyTest `
  test
```

---

### 38. Executar gate dos dois projetos

Provedor:

```powershell
.\mvnw.cmd clean verify
```

Consumidor:

```powershell
.\mvnw.cmd clean verify
```

---

### 39. Registrar limitações

No README:

```text
adapter HTTP ainda não existe;

timeout ainda não foi configurado;

retry ainda não existe;

circuit breaker ainda não existe;

service credential
ainda não é obtida pelo consumer;

produção pública:
NO-GO.
```

---

### 40. Preparar a próxima aula

Crie apenas o package vazio:

```text
infrastructure/http/catalog
```

Não implemente o adapter.

Registre a classe planejada:

```text
RestClientProductCatalogGateway.
```

A implementação começa na aula 457.

---

## Entendendo o que foi feito

### Dois processos foram separados

O catálogo e o consumidor deixaram de ser apenas packages da mesma aplicação.

### O contrato ficou explícito

Método, path, security, status e body foram documentados.

### O domínio do consumidor ficou protegido

Ele depende de uma porta, não de HTTP.

### O provedor permaneceu seguro

Audience e permission do M15 foram reaplicadas.

### O HTTP foi exercitado sem antecipar o client

O arquivo `.http` comprovou o contrato do provedor.

### Falhas foram classificadas

Rede, segurança, contrato e disponibilidade deixaram de ser uma exception genérica.

### O acoplamento temporal ficou visível

A ordem depende da disponibilidade do catálogo.

### A próxima aula ganhou uma base correta

O `RestClient` implementará uma porta já definida.

---

## Erros comuns importantes

### Colocar URL no service

O domínio passa a depender de infraestrutura.

### Compartilhar entity entre sistemas

Os sistemas ficam acoplados ao mesmo modelo interno.

### Tratar rede como chamada local

Timeouts, falhas e latência ficam invisíveis.

### Aceitar qualquer `2xx`

O contrato precisa definir status e body esperados.

### Logar bearer token

A integração cria vazamento de credencial.

### Confiar por estar na rede interna

A rede não substitui autenticação e autorização.

### Criar retry imediatamente

Retry sem timeout, idempotência e critério pode piorar a falha.

### Implementar RestClient antes do contrato

O adapter passa a definir o domínio por acidente.

### Usar fake em produção

O sistema parece integrado, mas nunca chama o provedor.

### Declarar produção pronta

Ainda faltam client, timeout, retry e credencial automatizada.

---

## Comandos úteis

### Executar provedor

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider

.\mvnw.cmd `
  -Dspring-boot.run.profiles=local `
  spring-boot:run
```

### Chamada manual

```powershell
curl.exe `
  --request GET `
  --url "http://localhost:8081/api/v1/products/SKU-1001/availability" `
  --header "Accept: application/json" `
  --header "Authorization: Bearer $env:CATALOG_SERVICE_TOKEN" `
  --header "X-Correlation-Id: corr-aula-456-001"
```

### Testar provedor

```powershell
.\mvnw.cmd `
  -Dtest=ProductAvailabilityControllerTest,ProductAvailabilitySecurityTest,ProductAvailabilityContractTest `
  test
```

### Testar consumidor

```powershell
.\mvnw.cmd `
  -Dtest=ValidateProductForOrderServiceTest,IntegrationBoundaryPolicyTest `
  test
```

---

## Exercício guiado

### Parte 1 — Fronteira

Desenhe consumidor, rede e provedor.

### Parte 2 — Contrato

Defina método, path, headers, status e body.

### Parte 3 — Provedor

Implemente o endpoint de disponibilidade.

### Parte 4 — Segurança

Exija audience e permission.

### Parte 5 — Errors

Crie Problem Details seguros.

### Parte 6 — Consumidor

Crie gateway e snapshot interno.

### Parte 7 — Caso de uso

Valide disponibilidade para a ordem.

### Parte 8 — Testes

Teste provedor, domínio e boundaries.

### Parte 9 — Falhas

Crie a matriz HTTP.

### Parte 10 — Preparação

Deixe o adapter para o `RestClient`.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com o fechamento do M15 foi preservada;
- Módulo 16 foi aberto sem antecipar aulas futuras;
- integração síncrona foi explicada;
- acoplamento temporal foi identificado;
- fronteira de processo foi modelada;
- responsabilidades de provider e consumer foram separadas;
- contrato inclui método, path, headers, security, status e body;
- versionamento e compatibilidade foram discutidos;
- laboratório possui dois projetos;
- catalog-provider publica availability;
- ProductCode valida input;
- response DTO não expõe domínio diretamente;
- permission `catalog:availability:read` foi definida;
- audience `catalog-api` foi definida;
- endpoint usa Resource Server;
- correlation ID foi propagado com segurança;
- Problem Details foi catalogado;
- arquivo `.http` foi criado;
- tokens permaneceram fora do Git;
- order-consumer possui `ProductCatalogGateway`;
- snapshot interno contém somente dados necessários;
- caso de uso não conhece HTTP;
- fake existe somente em testes;
- boundary policy test foi criado;
- matriz de falhas foi criada;
- HTTP foi exercitado manualmente;
- testes positivos e negativos foram executados;
- falhas de rede, segurança e contrato foram diferenciadas;
- timeout não foi implementado antes da aula 459;
- retry não foi implementado antes da aula 460;
- RestClient não foi implementado antes da aula 457;
- limitações foram registradas;
- produção pública permaneceu NO-GO;
- gate dos dois projetos foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas `
  docs/diario-de-bordo.md `
  docs/mapa-da-formacao.md
```

Ajuste o último path ao mapa real da formação.

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m16): iniciar integracoes HTTP entre sistemas"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- service token;
- client secret;
- `.env`;
- dump do Keycloak;
- dados reais;
- logs;
- reports locais;
- adapter RestClient antecipado;
- retry improvisado;
- configuração produtiva não validada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o Módulo 16 foi iniciado com uma fronteira distribuída real.

O fluxo ficou:

```text
order-consumer;

ProductCatalogGateway;

HTTP futuro;

catalog-provider;

ProductCatalog;

response.
```

O provedor definiu:

```text
método;

path;

security;

permission;

audience;

response;

errors;

correlation.
```

O consumidor definiu:

```text
porta;

snapshot;

caso de uso;

falhas de domínio;

testes.
```

A principal decisão foi:

```text
HTTP pertence
ao adapter;

o domínio depende
de uma capacidade,
não de uma URL.
```

Também ficou explícito que integração síncrona cria:

- acoplamento temporal;
- latência;
- falhas parciais;
- dependência de disponibilidade;
- necessidade de contrato;
- necessidade de segurança entre serviços;
- necessidade de observabilidade.

O laboratório ainda não possui um client Java real.

Isso é intencional.

A próxima aula será:

```text
457 - M16.02 - RestClient
```

Nela, você irá:

- configurar um `RestClient`;
- implementar `RestClientProductCatalogGateway`;
- definir base URL;
- enviar headers;
- propagar correlation ID;
- adicionar bearer token de laboratório;
- desserializar responses;
- traduzir `404`, `401`, `403`, `5xx` e contrato inválido;
- testar o adapter com servidor HTTP controlado;
- integrar o consumidor ao provedor sem acoplar o domínio ao HTTP.

---

# Material complementar

## Checkpoint final

- [ ] Separei provider e consumer.
- [ ] Documentei o contrato HTTP.
- [ ] Protegi o endpoint com audience e permission.
- [ ] Criei gateway e snapshot no consumidor.
- [ ] Preparei a base para o RestClient.

---

## Troubleshooting adicional

### O provider retorna 401

Confirme issuer, signature, audience `catalog-api` e expiração.

### O provider retorna 403

Confirme `catalog:availability:read` no access token.

### A chamada manual retorna connection refused

Confirme processo, porta `8081` e profile local.

### O código inválido chega ao service

O `ProductCode` pode não estar sendo criado na fronteira.

### O consumer importa classes do provider

Remova o acoplamento e mantenha modelos separados.

### O fake foi colocado em src/main

Mova-o para test support.

### O token apareceu no arquivo HTTP

Substitua por variável local e remova do histórico.

### O teste do consumer precisa de Spring

O caso de uso está acoplado demais à infraestrutura.

---

## Perguntas de revisão

1. O que muda em uma chamada remota?
2. O que é acoplamento temporal?
3. Quem define o contrato?
4. Contrato é apenas JSON?
5. O domínio deve conhecer URL?
6. O domínio deve conhecer status HTTP?
7. Para que serve o gateway?
8. O consumer pode importar entity do provider?
9. Qual é a audience?
10. Qual é a permission?
11. Rede interna é confiável?
12. Para que serve correlation ID?
13. O que um `404` representa no contrato?
14. O que um `503` representa?
15. Retry foi implementado?
16. Timeout foi implementado?
17. Qual client será usado na próxima aula?
18. Por que o fake fica em testes?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Rede, latência e falhas parciais.
2. Sistemas precisam estar disponíveis juntos.
3. Provider e consumers coordenam.
4. Não.
5. Não.
6. Não.
7. Representar uma capacidade externa.
8. Não.
9. `catalog-api`.
10. `catalog:availability:read`.
11. Não.
12. Rastrear o fluxo.
13. Produto não encontrado.
14. Indisponibilidade temporária.
15. Não.
16. Não.
17. RestClient.
18. Para não simular integração em produção.
19. RestClient.
20. Implementar o adapter HTTP.

---

## Desafio opcional

Crie um segundo contrato:

```text
GET
/api/v1/products/{code}/price
```

Antes de implementar, documente:

- owner;
- dados;
- permission;
- audience;
- status;
- response;
- compatibilidade;
- falhas;
- snapshot interno.

Não crie o adapter HTTP nesta aula.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 456 - M16.01 - Integracoes HTTP entre sistemas

- Iniciei o Módulo 16 de integrações, mensageria, eventos e resiliência.
- Diferenciei chamada local e chamada remota.
- Entendi acoplamento temporal.
- Mapeei fronteiras de processo e rede.
- Separei provider e consumer.
- Criei `labs/m16/aula-456-integracoes-http-entre-sistemas`.
- Criei `catalog-provider`.
- Criei `order-consumer`.
- Criei `INTEGRATION_MAP.md`.
- Criei `PRODUCT_AVAILABILITY_CONTRACT.md`.
- Criei `HTTP_FAILURE_MATRIX.md`.
- Modelei `ProductCode`.
- Modelei `ProductAvailability`.
- Criei `ProductCatalog`.
- Criei catálogo local com dados sintéticos.
- Criei `FindProductAvailabilityService`.
- Criei `ProductAvailabilityResponse`.
- Criei endpoint de disponibilidade.
- Protegi o provider como Resource Server.
- Defini audience `catalog-api`.
- Defini permission `catalog:availability:read`.
- Criei correlation ID seguro.
- Criei Problem Details catalogados.
- Criei arquivo `.http`.
- Mantive tokens fora do Git.
- Criei `ProductCatalogGateway` no consumer.
- Criei `ProductAvailabilitySnapshot`.
- Criei `ValidateProductForOrderService`.
- Mantive HTTP fora do domínio.
- Criei fake somente em testes.
- Criei testes de controller, segurança e contrato.
- Criei testes do caso de uso.
- Criei boundary policy test.
- Classifiquei falhas de rede, segurança e contrato.
- Registrei acoplamento temporal.
- Executei o HTTP manualmente.
- Executei os gates dos dois projetos.
- Não antecipei timeout, retry ou circuit breaker.
- Mantive produção pública como NO-GO.
- Próxima aula: RestClient.
```

---

## Referência técnica curta

- RFC 9110 — HTTP Semantics.
- RFC 9112 — HTTP/1.1.
- RFC 9457 — Problem Details for HTTP APIs.
- Spring Security — OAuth 2.0 Resource Server.
- Spring Framework — REST Clients.
- OWASP REST Security Cheat Sheet.
- OWASP API Security Top 10.
- OpenAPI Specification.

Regra final:

```text
uma integração HTTP entre sistemas deve ser tratada como uma fronteira distribuída explícita: provider e consumer possuem responsabilidades diferentes, o contrato inclui protocolo, segurança, semântica e erros, o domínio consumidor depende de uma porta e de modelos internos mínimos, tokens e headers permanecem na infraestrutura, correlation ID sustenta rastreabilidade, falhas de rede e contrato são classificadas e a implementação do client só começa depois que a capacidade externa, os riscos, os limites e os testes do provedor estão claros.
```
