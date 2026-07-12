# 474 - M16.19 - Testes de contrato

## Apresentação da aula

Na aula 472, o laboratório transformou as integrações em artefatos versionados.

Passamos a ter:

```text
OpenAPI;

AsyncAPI;

JSON Schema;

WSDL;

XSD;

contrato CSV;

catálogo de erros;

ownership;

compatibility policy.
```

Na aula 473, o WireMock permitiu controlar o comportamento do provider durante os testes dos consumers.

Foram simulados:

```text
200;

404;

429;

503;

timeout;

connection reset;

retry;

circuit breaker;

bulkhead;

fallback.
```

Agora surge uma lacuna diferente.

O WireMock prova o consumer diante de stubs controlados, mas não prova que o `catalog-provider` real ainda entrega essas interações. O OpenAPI descreve a superfície ampla, não o uso específico de cada consumer.

A pergunta central desta aula será:

```text
como registrar
as expectativas reais
dos consumers
e verificar automaticamente
se o provider continua
capaz de atendê-las?
```

A resposta prática será:

```text
consumer-driven contract testing
com Pact.
```

Pact trabalha com dois lados.

No consumer:

```text
o teste executa
o client real;

um mock server controlado
valida a request;

a response pactuada
é devolvida;

o comportamento do consumer
é testado;

um arquivo Pact
é produzido.
```

No provider:

```text
o arquivo Pact
é carregado;

cada interação
é reproduzida
contra o provider real;

provider states
preparam os dados;

request e response
são verificadas;

o resultado
é publicado.
```

O fluxo completo será:

```text
order-consumer
        |
        | consumer test
        v
Pact V4
        |
        | publish
        v
Pact Broker
        |
        | retrieve
        v
catalog-provider
        |
        | provider verification
        v
verification result
        |
        | can-i-deploy
        v
release gate
```

A aula utilizará Pact-JVM `4.7.3` para consumer e provider com JUnit 5 e Spring.

A versão ficará em uma property única:

```xml
<pact.version>4.7.3</pact.version>
```

Não use ranges como:

```text
4.+;

LATEST;

RELEASE.
```

Uma atualização precisa reexecutar consumer tests, provider verification, geração V4, publicação, selectors, pending, `can-i-deploy` e regressões do WireMock.

Os pacticipants serão:

```text
consumers:
order-consumer;
order-consumer-reactive.

provider:
catalog-provider.
```

Cada consumer produzirá contratos somente para as interações que utiliza: disponibilidade, criação de reserva, `product not found` e conflito idempotente.

O `order-consumer-reactive` será pacticipant independente porque possui código, release e decisão de deploy próprios.

Não criaremos um único consumer chamado:

```text
all-order-consumers.
```

Esse nome esconderia os owners e as versões reais.

Os arquivos serão gerados em:

```text
order-consumer/target/pacts;

order-consumer-reactive/target/pacts.
```

Exemplo de nome:

```text
order-consumer-catalog-provider.json.
```

O Pact será produzido pelo teste do consumer, nunca escrito manualmente.

O teste precisa chamar gateways, adapters, decoders, mappers e tradutores reais.

Um teste que chama o mock server com um client genérico apenas para gerar JSON não prova o comportamento do consumer.

A primeira interação será:

```text
Given:
product SKU-1001 exists with 25 units.

Upon receiving:
a request to obtain availability for SKU-1001.

Request:
GET /api/v1/products/SKU-1001/availability.

Response:
200 with availability.
```

A segunda será:

```text
Given:
product SKU-404 does not exist.

Request:
GET availability.

Response:
404 Problem Details.
```

A terceira será:

```text
Given:
reservation ORD-2026-0001 can be created.

Request:
POST /api/v1/reservations.

Response:
201 Created.
```

A quarta será:

```text
Given:
idempotency key is already associated
with another reservation payload.

Request:
POST reservation.

Response:
409 Problem Details.
```

Os provider states descrevem precondições do provider, não ações do consumer.

Nome inadequado:

```text
consumer calls availability endpoint.
```

Nome correto:

```text
product SKU-1001 exists with 25 units.
```

Cada provider state será isolado: limpa fixtures, prepara apenas os dados necessários, fixa relógio, tenant, downstreams e idempotência.

Uma interação não pode depender da execução anterior.

O Pact V4 armazenará consumer, provider, interactions, states, requests, matchers, responses e metadata.

Valores dinâmicos devem usar tipo ou formato, não igualdade artificial.

Exemplo ruim:

```text
reservationId
precisa ser exatamente
RSV-10001.
```

Exemplo melhor:

```text
reservationId:
string não vazia
com formato aprovado.
```

Valores semanticamente fixos, como product code solicitado, error code, método, path e status, permanecem exatos.

A aula também ligará Pact e OpenAPI.

Eles não são concorrentes.

OpenAPI:

```text
descreve
a superfície publicada
pelo provider.
```

Pact:

```text
descreve
interações utilizadas
por consumers específicos.
```

Uma operação pode existir no OpenAPI e não aparecer em Pact por ausência de consumer, uso externo, endpoint obsoleto ou lacuna de teste.

Um Pact também não pode inventar uma operação fora do contrato aprovado.

O gate da aula 472 continuará validando:

```text
paths;

schemas;

errors;

examples;

versions.
```

A aula 474 adicionará:

```text
expectativa do consumer;

verificação do provider;

matriz de compatibilidade
por versão.
```

O Pact Broker compartilhará contratos, versões, resultados, branches, environments, deployments e a matriz.

O token do Broker ficará no secret do CI, fora de Git, build, configuração, logs, Pacts e reports.

A baseline de versionamento será:

```text
consumer version:
Git commit SHA.

provider version:
Git commit SHA.

branch:
nome real da branch.

environment:
test,
staging,
production.
```

Não use `latest`, `snapshot`, data ou número aleatório como versão principal do pacticipant.

A decisão de deploy usará:

```text
can-i-deploy.
```

Antes do deploy:

```text
consultar matriz.
```

Depois do deploy bem-sucedido:

```text
record-deployment.
```

Pending pacts e work-in-progress pacts serão utilizados com cuidado.

Pending evita que uma expectativa ainda não implementada bloqueie automaticamente a main do provider, mas não autoriza o deploy do consumer.

O consumer continua bloqueado por provider verification, `can-i-deploy` e release policy.

A aula não implementará contratos de mensagens RabbitMQ.

A próxima aula será:

```text
475 - M16.20 - RabbitMQ fundamentos.
```

Os message pacts serão considerados depois que existir um consumer e producer de mensagens reais.

Ao final, você deverá explicar:

```text
por que Pact
não substitui OpenAPI;

por que o consumer test
precisa executar
o client real;

por que provider state
é precondição;

por que um matcher
não pode aceitar tudo;

por que o provider
verifica cada interação
isoladamente;

por que Pact Broker
não é apenas storage;

por que pending
não autoriza deploy;

por que can-i-deploy
precisa de versões
e ambientes registrados.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
472:
Contratos de integracao.

473:
WireMock aplicado.

474:
Testes de contrato.

475:
RabbitMQ fundamentos.

476:
Exchanges queues bindings.
```

A aula 473 respondeu:

```text
como testar
o consumer
contra um provider HTTP
simulado e controlado?
```

A aula 474 responderá:

```text
como verificar
que consumer e provider
continuam compatíveis
em suas versões reais?
```

Nesta aula:

```text
Pact consumer test:
sim.

Pact V4:
sim.

provider verification:
sim.

provider states:
sim.

Pact Broker:
sim.

pending e WIP:
sim.

can-i-deploy:
sim.

message pact:
não.

RabbitMQ:
próxima aula.
```

A regra central será:

```text
o consumer declara
o que realmente usa;

o provider prova
que consegue entregar;

o Broker registra
quais versões
são compatíveis.
```

---

## Objetivo prático

Ao final, o laboratório terá:

```text
order-consumer/
├── src/test/java/.../pact/
│   ├── CatalogAvailabilityPactConsumerTest.java
│   ├── CatalogReservationPactConsumerTest.java
│   └── PactConsumerTestSupport.java
└── target/pacts/

order-consumer-reactive/
├── src/test/java/.../pact/
│   ├── ReactiveCatalogAvailabilityPactConsumerTest.java
│   └── ReactiveCatalogReservationPactConsumerTest.java
└── target/pacts/

catalog-provider/
└── src/test/java/.../pact/
    ├── CatalogProviderLocalPactVerificationTest.java
    ├── CatalogProviderBrokerPactVerificationTest.java
    ├── CatalogProviderStates.java
    ├── PactProviderAuthentication.java
    └── PactProviderFixtureCleaner.java
```

Testes e gates:

```text
PactConsumerUsesRealGatewayTest;

PactFileV4StructureTest;

PactInteractionNamingTest;

PactProviderStateCoverageTest;

PactProviderStateIsolationTest;

PactProviderAuthenticationTest;

PactProviderLocalVerificationTest;

PactProviderBrokerConfigurationTest;

PactPublishingConfigurationTest;

PactVersionMetadataTest;

PactPendingPolicyTest;

PactCanIDeployPolicyTest;

PactSecuritySanitizationTest;

PactOpenApiConsistencyTest.
```

Documentação:

```text
docs/pact/
├── PACT_WORKFLOW.md
├── PACT_NAMING_POLICY.md
├── PACT_PROVIDER_STATES.md
├── PACT_BROKER_POLICY.md
├── PACT_CI_PIPELINE.md
├── PACT_DEPLOYMENT_GATE.md
└── PACT_RUNBOOK.md
```

Você irá:

1. fixar Pact-JVM;
2. criar consumer tests;
3. usar V4;
4. executar gateways reais;
5. criar matchers;
6. gerar pact files;
7. inspecionar contratos;
8. criar provider verification;
9. criar provider states;
10. tratar autenticação;
11. verificar localmente;
12. publicar pacts;
13. recuperar via Broker;
14. publicar resultados;
15. usar branches;
16. usar pending/WIP;
17. executar can-i-deploy;
18. registrar deployment;
19. criar observabilidade;
20. preparar RabbitMQ.

---

## Conceito essencial

### Consumer-driven contract

O consumer descreve a interação necessária para funcionar.

Ele não descreve tudo que o provider sabe fazer.

Vantagem:

```text
mudanças em partes
não utilizadas
não bloqueiam consumers.
```

Risco:

```text
uma interação usada
sem consumer test
não fica protegida.
```

---

### Consumer test

O consumer test prova que o consumer envia a request esperada e entende a response pactuada.

O Pact só é escrito se a interação ocorrer conforme a definição.

---

### Mock server do Pact

O mock server do Pact executa as interações que formarão o contrato; o WireMock simula falhas e estados amplos do consumer.

Connection reset, circuit breaker, bulkhead, timeout e latência permanecem no WireMock.

---

### Pacticipant

Pacticipant é uma aplicação participante.

Exemplos:

```text
order-consumer;

catalog-provider.
```

Use nomes estáveis e iguais nas annotations, Broker, CI, deploy gate e ownership.

Renomear pacticipant cria outra identidade no Broker.

---

### Interaction

Uma interaction reúne description, provider state, request e response. A description expressa a intenção observável.

Exemplo:

```text
a request to obtain availability
for an existing product.
```

Não use:

```text
test 1;

happy path;

GET test.
```

---

### Provider state

Provider state é precondição e prepara banco, cache, tenant, flags, downstreams, relógio e idempotência.

Ele não deve chamar a operação que será verificada.

Isso poderia produzir o efeito antes do test.

---

### Matchers

Matchers permitem variação segura.

Matchers comuns incluem type, regex, number, timestamp, collections e tamanho mínimo.

Use valor exato quando a semântica exige.

Não use matcher de tipo para:

```text
error code;

event type;

status semântico;

product code da request.
```

---

### Generators

Generator produz valor na provider verification a partir do state. Use para IDs realmente dinâmicos, não para esconder fixture instável.

---

### Pact V4

A especificação V4 suporta uma estrutura moderna de interactions e plugins.

Nesta aula, os contratos HTTP não exigem plugin.

A escolha V4 evita criar uma baseline antiga.

---

### Pact file

O pact file é gerado pelo consumer test. Para mudar o contrato, altere o teste, regenere e revise o diff; não edite, reformate ou resolva conflitos manualmente.

---

### Pact Broker

O Broker registra pacticipants, versões, branches, Pacts, resultados, deployments, releases, environments e a matriz usada nas decisões de deploy.

---

### Branches e environments

Branch identifica a origem de desenvolvimento; environment registra onde a versão foi implantada ou liberada.

Evite tags como mecanismo principal em uma baseline moderna.

---

### Pending pacts

Um Pact novo pode ficar pending sem bloquear a main do provider, mas continua incompatível até ser implementado e verificado antes do deploy do consumer.

---

### Work-in-progress pacts

WIP permite que pacts novos ou alterados sejam selecionados automaticamente para verificação.

Ele reduz configuração manual de selectors.

Use com data de corte e policy explícita.

---

### Consumer version selectors

O provider verifica main branch, matching branch, versões deployed/released e WIP relevante, nunca apenas `latest`.

---

### Verification result

O provider publica resultado, versão, branch, build URL e Pact version somente no CI confiável. Execução local não registra SHA falso.

---

### Can I deploy

`can-i-deploy` consulta a matriz para o ambiente alvo: exit code `0` permite; qualquer outro bloqueia.

Use o exit code, não o texto, para decidir.

---

### Record deployment

Depois de um deploy bem-sucedido, registre:

```text
pacticipant;

version;

environment.
```

Sem esse registro, o Broker não sabe quais versões estão em cada ambiente.

---

### OpenAPI e Pact

OpenAPI governa a superfície do provider; Pact protege o uso específico. Requests e responses pactuadas precisam caber no OpenAPI aprovado.

O laboratório criará um consistency test estrutural.

Ele não substituirá os dois lados.

---

### Testes end-to-end

Pact reduz E2E de compatibilidade, mas não prova configuração, DNS, TLS, credenciais, infraestrutura ou fluxo completo.

---

## Mão na massa guiada

### 1. Adicionar versão

No parent ou nos três projetos:

```xml
<properties>
    <pact.version>4.7.3</pact.version>
</properties>
```

Crie um único ponto de atualização.

---

### 2. Adicionar consumer dependency

Nos consumers:

```xml
<dependency>
    <groupId>au.com.dius.pact.consumer</groupId>
    <artifactId>junit5</artifactId>
    <version>${pact.version}</version>
    <scope>test</scope>
</dependency>
```

Não adicione provider dependency ao consumer.

---

### 3. Adicionar provider dependency

No `catalog-provider`:

```xml
<dependency>
    <groupId>au.com.dius.pact.provider</groupId>
    <artifactId>junit5spring</artifactId>
    <version>${pact.version}</version>
    <scope>test</scope>
</dependency>
```

Mantenha consumer e provider na mesma linha de versão.

---

### 4. Configurar pact root

No Surefire dos consumers:

```xml
<systemPropertyVariables>
    <pact.rootDir>
        ${project.build.directory}/pacts
    </pact.rootDir>
    <pact_do_not_track>true</pact_do_not_track>
</systemPropertyVariables>
```

A configuração explicita o diretório `target/pacts`.

---

### 5. Limpar artefatos antigos

Use:

```powershell
.\mvnw.cmd clean test
```

Não publique pact files de execução incremental sem limpar `target`.

O writer combina interactions; evite escrita paralela no mesmo arquivo consumer-provider.

---

### 6. Criar consumer class

```java
@PactConsumerTest
@PactTestFor(
    providerName = "catalog-provider",
    pactVersion = PactSpecVersion.V4
)
class CatalogAvailabilityPactConsumerTest {
}
```

O nome do provider precisa ser igual ao manifest.

---

### 7. Criar pact de sucesso

```java
@Pact(
    provider = "catalog-provider",
    consumer = "order-consumer"
)
V4Pact availableProduct(
        PactDslWithProvider builder
) {
    PactDslJsonBody response =
            new PactDslJsonBody()
                .stringValue(
                    "productCode",
                    "SKU-1001"
                )
                .booleanValue(
                    "available",
                    true
                )
                .integerType(
                    "quantity",
                    25
                )
                .stringMatcher(
                    "observedAt",
                    "^\\d{4}-\\d{2}-\\d{2}T.*Z$",
                    "2026-07-12T15:00:00Z"
                )
                .stringValue(
                    "source",
                    "LIVE"
                );

    return builder
            .given(
                "product SKU-1001 exists with 25 units"
            )
            .uponReceiving(
                "a request to obtain availability for SKU-1001"
            )
            .path(
                "/api/v1/products/SKU-1001/availability"
            )
            .method("GET")
            .headers(
                "Accept",
                "application/json"
            )
            .willRespondWith()
            .status(200)
            .headers(
                Map.of(
                    "Content-Type",
                    "application/json"
                )
            )
            .body(response)
            .toPact(
                V4Pact.class
            );
}
```

A DSL deve seguir Pact-JVM `4.7.3`.

---

### 8. Executar gateway real

```java
@Test
@PactTestFor(
    pactMethod = "availableProduct"
)
void shouldReadAvailability(
        MockServer mockServer
) {
    ProductCatalogGateway gateway =
            productionGatewayFactory
                .create(
                    URI.create(
                        mockServer.getUrl()
                    )
                );

    ProductAvailability result =
            gateway.findAvailability(
                new ProductCode(
                    "SKU-1001"
                )
            );

    assertThat(
        result.available()
    ).isTrue();

    assertThat(
        result.quantity()
    ).isEqualTo(25);
}
```

Não substitua o gateway por outro client.

---

### 9. Criar 404 consumer pact

Provider state:

```text
product SKU-404 does not exist.
```

Response:

```text
404;

application/problem+json;

code:
product_not_found.
```

O test chama o gateway e espera:

```text
ProductNotFoundException.
```

---

### 10. Criar reservation pact

Request matchers:

```text
orderId:
exact.

productCode:
exact.

quantity:
exact ou integer
conforme uso.

Idempotency-Key:
regex.

Content-Type:
exact.
```

Response:

```text
201;

Location;

reservationId type/regex;

status exact.
```

---

### 11. Não pactuar token efêmero

O consumer test pode enviar um token de exemplo estrutural:

```text
Bearer pact-consumer-test.
```

Não use JWT produtivo.

Na provider verification, substitua por credencial curta válida somente para o test.

---

### 12. Inspecionar Pact gerado

Após:

```powershell
.\mvnw.cmd clean test
```

Abra:

```text
target/pacts/order-consumer-catalog-provider.json.
```

Confirme:

- V4;
- nomes;
- states;
- matchers;
- request;
- response;
- sem token real;
- sem host real;
- sem timestamp de versão interna.

---

### 13. Criar structure test

O test lê o JSON e valida:

- consumer e provider esperados;
- metadata V4;
- descriptions únicas;
- provider states conhecidos;
- error codes no catálogo;
- paths no OpenAPI;
- sem secrets.

---

### 14. Criar consumer pact reativo

No `order-consumer-reactive`, repita apenas as interactions que o código reativo usa.

O test executa:

```text
ReactiveProductCatalogGateway;

WebClient;

decoder;

mapper.
```

Use `StepVerifier`.

Não copie o Pact do consumer imperativo.

---

### 15. Criar provider local verification

```java
@SpringBootTest(
    webEnvironment =
        SpringBootTest.WebEnvironment.RANDOM_PORT
)
@Provider("catalog-provider")
@PactFolder(
    "../order-consumer/target/pacts"
)
class CatalogProviderLocalPactVerificationTest {

    @LocalServerPort
    int port;

    @BeforeEach
    void configureTarget(
            PactVerificationContext context
    ) {
        context.setTarget(
            new HttpTestTarget(
                "localhost",
                port
            )
        );
    }

    @TestTemplate
    @ExtendWith(
        PactVerificationInvocationContextProvider.class
    )
    void verify(
            PactVerificationContext context,
            HttpRequest request
    ) {
        authentication
            .addShortLivedToken(
                request
            );

        context.verifyInteraction();
    }
}
```

JUnit 5 modifica a request injetada; não use `@TargetRequestFilter`.

---

### 16. Criar provider state handler

```java
@Component
class CatalogProviderStates {

    @State(
        "product SKU-1001 exists with 25 units"
    )
    void productAvailable() {
        cleaner.reset();

        fixture.insertProduct(
            "SKU-1001",
            25
        );
    }

    @State(
        "product SKU-404 does not exist"
    )
    void productMissing() {
        cleaner.reset();

        fixture.ensureMissing(
            "SKU-404"
        );
    }
}
```

Registre o handler no contexto quando estiver em outra classe.

---

### 17. Isolar states

O cleaner remove somente dados da fixture de contract test.

Não faça:

```text
TRUNCATE indiscriminado
em banco compartilhado.
```

Use database/container isolado para o test.

Cada state começa de uma baseline conhecida.

---

### 18. Criar state de reservation

Prepare:

- product;
- stock;
- tenant;
- idempotency storage vazio;
- clock;
- audit dependencies;
- outbox fake se necessário.

Não crie a reservation antes do POST.

---

### 19. Criar conflict state

Para o `409`:

- insira idempotency key;
- associe a outro fingerprint;
- mantenha response esperada;
- não altere o request pactuado.

---

### 20. Configurar auth de provider

Crie token curto para:

```text
tenant do fixture;

audience correta;

scopes necessários;

issuer de teste.
```

Adicione no `HttpRequest` antes de `verifyInteraction()`.

Não persista o token no Pact.

---

### 21. Verificar headers públicos

Se o consumer pact exige:

```text
X-Correlation-Id;
Idempotency-Key;
Content-Type;
```

o provider verifier enviará esses valores.

A autenticação efêmera é a única alteração adicional aprovada.

Não modifique body ou path durante verification.

---

### 22. Executar verificação local

Primeiro gere pacts:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd clean test
```

Depois provider:

```powershell
Set-Location `
  ..\catalog-provider

.\mvnw.cmd `
  -Dtest=CatalogProviderLocalPactVerificationTest `
  test
```

---

### 23. Adicionar os dois consumers

Copie os pact files gerados para um diretório de verificação local controlado ou configure múltiplas fontes.

Não use path absoluto da máquina.

O CI prefere Broker.

---

### 24. Criar Broker configuration

Properties de CI:

```text
PACT_BROKER_BASE_URL;

PACT_BROKER_TOKEN;

GIT_COMMIT;

GIT_BRANCH;

CI_BUILD_URL.
```

Essas variáveis são obrigatórias para publicar resultados; localmente, `publishResults=false`.

---

### 25. Publicar Pact do consumer

Com CLI do Pact Broker:

```powershell
pact-broker publish `
  target/pacts `
  --consumer-app-version $env:GIT_COMMIT `
  --branch $env:GIT_BRANCH `
  --broker-base-url $env:PACT_BROKER_BASE_URL `
  --broker-token $env:PACT_BROKER_TOKEN
```

Falha de publicação falha o pipeline do consumer.

---

### 26. Configurar selectors do provider

Baseline conceitual:

```json
[
  { "mainBranch": true },
  { "matchingBranch": true },
  { "deployedOrReleased": true }
]
```

Inclua WIP desde uma data aprovada na main.

Não selecione apenas o pact mais recente global.

---

### 27. Criar provider Broker test

```java
@SpringBootTest(
    webEnvironment =
        SpringBootTest.WebEnvironment.RANDOM_PORT
)
@Provider("catalog-provider")
@PactBroker(
    url = "${pactbroker.url}"
)
class CatalogProviderBrokerPactVerificationTest {
}
```

Authentication do Broker vem de system properties ou environment seguro.

Selectors são configurados no test JVM.

---

### 28. Publicar verification result

Somente CI:

```text
pact.verifier.publishResults=true;

pact.provider.version=<GIT_COMMIT>;

pact.provider.branch=<GIT_BRANCH>;

pact.verifier.buildUrl=<CI_BUILD_URL>.
```

Se `GIT_COMMIT` estiver ausente:

```text
falhar configuração.
```

Não publique `local`.

---

### 29. Habilitar pending com policy

Na main do provider:

```text
pending:
enabled.
```

Na branch coordenada:

```text
expectativa da branch
deve falhar
até implementação.
```

Documente a diferença.

Pending não remove `can-i-deploy`.

---

### 30. Incluir WIP

Na main:

```text
includeWipPactsSince:
data aprovada.
```

A data impede recuperar histórico irrelevante.

Revise periodicamente.

---

### 31. Criar pipeline do consumer

Etapas:

1. compile;
2. unit;
3. Pact consumer tests;
4. OpenAPI consistency;
5. sanitize pact files;
6. publish Pact;
7. esperar provider verification quando policy exigir;
8. `can-i-deploy`;
9. deploy;
10. `record-deployment`.

O consumer não depende do provider no test local.

---

### 32. Criar pipeline do provider

Etapas:

1. compile;
2. migrations/test;
3. provider states tests;
4. retrieve selected pacts;
5. provider verification;
6. publish results;
7. `can-i-deploy`;
8. deploy;
9. `record-deployment`.

---

### 33. Executar can-i-deploy

Antes do deploy para test:

```powershell
pact-broker can-i-deploy `
  --pacticipant order-consumer `
  --version $env:GIT_COMMIT `
  --to-environment test `
  --broker-base-url $env:PACT_BROKER_BASE_URL `
  --broker-token $env:PACT_BROKER_TOKEN
```

Use o exit code.

---

### 34. Registrar deployment

Depois do deploy:

```powershell
pact-broker record-deployment `
  --pacticipant order-consumer `
  --version $env:GIT_COMMIT `
  --environment test `
  --broker-base-url $env:PACT_BROKER_BASE_URL `
  --broker-token $env:PACT_BROKER_TOKEN
```

Se o deploy falhou, não registre.

---

### 35. Testar consumer breaking expectation

Adicione ao consumer expectation:

```text
required field:
warehouseCode
```

sem implementar provider.

O Pact é gerado, a verificação falha e `can-i-deploy` bloqueia. Depois, reverta.

---

### 36. Testar provider breaking change

Remova `quantity` da response real.

A verificação dos consumers afetados e o diff OpenAPI bloqueiam. Restaure o campo.

---

### 37. Testar campo não utilizado

Adicione um campo interno a uma operation não consumida.

O Pact pode continuar verde.

O OpenAPI gate ainda classifica a mudança.

Isso comprova os escopos complementares.

---

### 38. Testar matcher excessivo

Troque `productCode` por matcher de qualquer string.

Altere provider para responder outro code.

O policy test bloqueia matcher amplo em campo de identidade.

---

### 39. Testar provider state ausente

Remova um `@State`.

Provider verification precisa falhar.

Não ignore state ausente.

---

### 40. Testar state leakage

Faça um state inserir `SKU-1001`.

A interação seguinte de missing product precisa continuar retornando `404`.

Se não retornar, o cleaner falha.

---

### 41. Testar auth ausente

Remova o token efêmero.

Provider retorna `401`.

Verification falha.

Isso comprova que o provider real, incluindo segurança, está no alvo.

---

### 42. Testar publicação local proibida

Com `CI=false`:

```text
publish verification result:
false.
```

Com CI e SHA ausente:

```text
startup/test configuration:
fail.
```

---

### 43. Criar segurança do Pact file

Proíba:

- Authorization real;
- token;
- cookie;
- e-mail real;
- CPF;
- host real;
- correlation real;
- database ID produtivo;
- secret;
- internal stack.

Use fixtures sintéticas.

---

### 44. Criar métricas de pipeline

```text
contract.consumer.generated;

contract.provider.verified;

contract.verification.failed;

contract.can_deploy.allowed;

contract.can_deploy.blocked;

contract.pending;

contract.wip.
```

Tags:

```text
pacticipant;

role;

branch.class;

outcome.
```

Não use commit SHA como tag de métrica.

---

### 45. Criar Broker runbook

Perguntas:

- consumer;
- provider;
- versions;
- branches;
- pact publicado;
- selectors;
- pending;
- WIP;
- provider state;
- verification result;
- build URL;
- environment;
- deployment registrado;
- can-i-deploy result;
- owner;
- last successful matrix entry.

---

### 46. Diferenciar falhas

Consumer test falha:

```text
consumer não respeita
a expectativa declarada.
```

Provider verification falha:

```text
provider não atende
o Pact.
```

Publish falha:

```text
contrato não chegou
ao Broker.
```

Can-I-Deploy falha:

```text
matriz não autoriza
a combinação.
```

Cada falha exige resposta operacional própria.

---

### 47. Executar consumer tests

Imperativo:

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=CatalogAvailabilityPactConsumerTest,CatalogReservationPactConsumerTest,PactFileV4StructureTest,PactSecuritySanitizationTest `
  clean test
```

Reativo:

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=ReactiveCatalogAvailabilityPactConsumerTest,ReactiveCatalogReservationPactConsumerTest,PactFileV4StructureTest,PactSecuritySanitizationTest `
  clean test
```

---

### 48. Executar provider local

```powershell
Set-Location `
  ..\catalog-provider

.\mvnw.cmd `
  -Dtest=CatalogProviderLocalPactVerificationTest,PactProviderStateCoverageTest,PactProviderStateIsolationTest,PactProviderAuthenticationTest `
  test
```

---

### 49. Executar Broker verification

No CI:

```powershell
.\mvnw.cmd `
  -Dtest=CatalogProviderBrokerPactVerificationTest `
  -Dpact.verifier.publishResults=true `
  -Dpact.provider.version=$env:GIT_COMMIT `
  -Dpact.provider.branch=$env:GIT_BRANCH `
  test
```

As system properties precisam chegar ao JVM do test via configuração do build.

---

### 50. Executar gate completo

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- consumer real;
- Pact V4;
- provider states;
- provider real;
- auth;
- Broker config;
- selectors;
- pending/WIP;
- publish;
- can-i-deploy policy;
- OpenAPI consistency;
- WireMock regression;
- logs e secrets.

---

### 51. Registrar limitações

Ainda faltam:

```text
message Pact;

RabbitMQ real;

contract broker produtivo;

webhooks de build;

retention do Broker;

disaster recovery;

SSO do Broker;

multi-region;

governança corporativa;

telemetria de todos os consumers.
```

---

## Entendendo o que foi feito

### O consumer passou a publicar expectativas reais

O Pact nasce do teste do gateway usado em produção.

### O provider passou a provar compatibilidade

Cada interação é executada contra a aplicação real.

### Provider states deixaram os testes determinísticos

Cada interação começa com precondições controladas.

### OpenAPI e Pact ficaram complementares

Um protege a superfície; o outro protege usos reais.

### O Broker criou uma matriz de versões

Compatibilidade deixou de ser uma afirmação genérica.

### Deploy ganhou gate

`can-i-deploy` consulta evidências publicadas.

### Pending foi limitado à função correta

Ele protege o fluxo do provider sem liberar consumer incompatível.

### WireMock permaneceu necessário

Falhas de rede e resiliência continuam fora do escopo principal do Pact.

---

## Erros comuns importantes

### Gerar Pact sem executar o client real

O contrato pode estar correto e o consumer real incorreto.

### Colocar todos os fields como type matcher

Mudanças semânticas passam despercebidas.

### Usar valor exato para ID gerado

O provider fica acoplado à fixture.

### Provider state depender de outra interaction

A ordem da suíte passa a importar.

### Alterar request durante verification

O provider é verificado contra algo diferente do Pact.

### Publicar resultado local

Uma execução não reproduzível contamina a matriz.

### Usar latest sem versão

O gate pode sofrer race e consultar combinação errada.

### Tratar pending como sucesso

Pending ainda precisa de verificação antes do deploy do consumer.

### Não registrar deployment

O Broker não sabe o que está no ambiente.

### Substituir E2E por Pact

Configuração e infraestrutura ficam sem teste.

---

## Comandos úteis

### Consumer Pact

```powershell
.\mvnw.cmd `
  -Dtest=*PactConsumerTest `
  clean test
```

### Provider local

```powershell
.\mvnw.cmd `
  -Dtest=CatalogProviderLocalPactVerificationTest `
  test
```

### Provider states

```powershell
.\mvnw.cmd `
  -Dtest=PactProviderStateCoverageTest,PactProviderStateIsolationTest,PactProviderAuthenticationTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar secrets

```powershell
git grep `
  -n `
  -E `
  "PACT_BROKER_TOKEN|Authorization.*Bearer|pactbroker.*token|target/pacts|@State|@Pact\\("
```

---

## Exercício guiado

### Parte 1 — Dependências

Fixe Pact-JVM e os artifacts corretos.

### Parte 2 — Consumer

Crie Pact V4 com gateway real.

### Parte 3 — Matchers

Diferencie valores exatos e dinâmicos.

### Parte 4 — Pact files

Gere, inspecione e sanitize.

### Parte 5 — Provider

Crie verification com aplicação real.

### Parte 6 — States

Prepare banco, tenant e idempotência.

### Parte 7 — Broker

Publique Pact e resultados.

### Parte 8 — Selectors

Use main, matching e deployed/released.

### Parte 9 — Deploy

Execute `can-i-deploy` e registre deployment.

### Parte 10 — Gate

Bloqueie consumer e provider incompatíveis.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 473 foi preservada;
- consumer-driven contracts foram explicados;
- Pact foi diferenciado de OpenAPI;
- Pact foi diferenciado de WireMock;
- Pact foi diferenciado de E2E;
- Pact-JVM foi fixado em property;
- versão `4.7.3` foi adotada;
- ranges de versão foram proibidos;
- artifact consumer JUnit 5 foi usado;
- artifact provider Spring/JUnit 5 foi usado;
- Pact V4 foi usado;
- pacticipants possuem nomes estáveis;
- consumers imperativo e reativo são independentes;
- consumer test executa gateway real;
- generic HTTP client de teste foi proibido;
- MockServer foi injetado;
- base URL dinâmica foi usada;
- interaction descriptions são semânticas;
- provider states descrevem precondições;
- matchers foram usados em valores dinâmicos;
- values semânticos permaneceram exatos;
- generated IDs não foram fixados indevidamente;
- Pact files foram gerados em `target/pacts`;
- Pact files não foram editados manualmente;
- artifacts antigos são limpos no CI;
- gravação concorrente no mesmo Pact foi evitada;
- pact structure test foi criado;
- secrets foram removidos dos Pacts;
- provider verification usa aplicação real;
- random port foi usado no provider;
- `HttpTestTarget` foi configurado;
- `PactVerificationContext` foi usado;
- `@TestTemplate` foi usado;
- JUnit 5 não usa `@TargetRequestFilter`;
- token efêmero foi injetado na request;
- body e path não são alterados na verification;
- provider states foram implementados;
- states são isolados;
- banco de teste é isolado;
- reservation state não cria reservation antes do POST;
- conflict state prepara idempotency record;
- state ausente falha o gate;
- state leakage foi testado;
- auth real de teste foi exercitada;
- verificação local foi criada;
- Broker configuration foi criada;
- token do Broker fica em secret;
- consumer version usa Git SHA;
- provider version usa Git SHA;
- branch real foi publicada;
- verification result é publicado somente no CI;
- build URL foi configurada;
- selectors incluem main branch;
- selectors incluem matching branch;
- selectors incluem deployed/released;
- seleção apenas por latest foi proibida;
- pending policy foi criada;
- WIP policy foi criada;
- pending não autoriza deploy do consumer;
- consumer pipeline foi documentado;
- provider pipeline foi documentado;
- Pact publishing foi configurado;
- `can-i-deploy` foi configurado;
- exit code é utilizado;
- `record-deployment` ocorre após deploy;
- deploy falho não é registrado;
- breaking consumer expectation foi testada;
- breaking provider change foi testada;
- Pact/OpenAPI consistency foi testada;
- matcher excessivo foi testado;
- resultado local não contamina Broker;
- métricas de pipeline foram criadas;
- runbook foi criado;
- WireMock regressions foram executadas;
- message Pact não foi antecipado;
- RabbitMQ não foi antecipado;
- limitações foram registradas;
- produção permaneceu NO-GO;
- gate foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat

git grep `
  -n `
  -E `
  "pact.version|@Pact\\(|@Provider\\(|@State\\(|PACT_BROKER|publishResults|can-i-deploy|record-deployment"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-provider `
  labs/m16/aula-456-integracoes-http-entre-sistemas/contracts `
  labs/m16/aula-456-integracoes-http-entre-sistemas/docs `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "test(m16): adicionar testes de contrato com Pact"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- Broker token;
- Authorization real;
- pact file com dados reais;
- provider state destrutivo;
- resultado local publicado;
- generated Pact editado;
- endpoint produtivo;
- message Pact antecipado;
- RabbitMQ antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o laboratório passou a verificar contratos a partir das necessidades reais dos consumers.

O fluxo ficou:

```text
consumer test;

Pact V4;

publish;

provider verification;

verification result;

Pact Matrix;

can-i-deploy;

record-deployment.
```

A principal decisão foi:

```text
compatibilidade
não é presumida;

ela é demonstrada
entre versões específicas
de consumer
e provider.
```

Também ficou comprovado que:

- o consumer test precisa executar o gateway real;
- provider state é precondição;
- interação precisa ser isolada;
- matcher amplo demais reduz proteção;
- OpenAPI e Pact possuem escopos diferentes;
- WireMock continua responsável por falhas de rede;
- Broker registra contratos, resultados e ambientes;
- pending não significa compatível;
- can-i-deploy depende de versionamento e deployment records;
- um contract test não substitui E2E.

A próxima aula será:

```text
475 - M16.20 - RabbitMQ fundamentos
```

Nela, você irá:

- compreender broker e mensageria;
- diferenciar queue e stream;
- entender conexão e channel;
- criar RabbitMQ local;
- conhecer AMQP 0-9-1;
- publicar e consumir a primeira mensagem;
- compreender acknowledgements;
- analisar durabilidade;
- distinguir mensagens persistentes;
- preparar exchanges, queues e bindings.

---

# Material complementar

## Checkpoint final

- [ ] Gereis Pacts V4 com consumers reais.
- [ ] Verifiquei o provider com states isolados.
- [ ] Publiquei contratos e resultados com versões.
- [ ] Configurei `can-i-deploy`.
- [ ] Mantive OpenAPI, WireMock e E2E complementares.

---

## Troubleshooting adicional

### Pact file não é gerado

Confirme `@PactConsumerTest`, `@PactTestFor`, pact method e interação executada.

### Consumer test passa com gateway falso

O test pode não estar instanciando o adapter de produção.

### Provider verification retorna `401`

Token efêmero não foi adicionado ou os scopes estão incorretos.

### Provider state não é encontrado

O texto do `given` e do `@State` precisa coincidir.

### Verification depende da ordem

O cleaner ou fixture não isola as interactions.

### Pact local passa e Broker falha

Selectors, branch, versões ou Pact publicado podem diferir.

### Resultado não aparece no Broker

Confirme `publishResults`, provider version, token e execução em CI.

### Can-I-Deploy bloqueia sem falha visível

Pode faltar verification result ou deployment record de uma dependência.

### Pending foi tratado como verde

Revise a matriz e o gate do consumer.

### Pact e OpenAPI divergem

Atualize contrato e implementação por processo de change, não edite apenas o Pact.

---

## Perguntas de revisão

1. O que é consumer-driven contract?
2. Quem gera o Pact?
3. O consumer test chama qual código?
4. O que é provider state?
5. Provider state representa request?
6. Para que servem matchers?
7. Pact substitui OpenAPI?
8. Pact substitui WireMock?
9. Pact substitui E2E?
10. O que é pacticipant?
11. O que é verification result?
12. Para que serve o Broker?
13. O que é pending Pact?
14. Pending autoriza consumer deploy?
15. O que é WIP?
16. O que faz can-i-deploy?
17. Quando registrar deployment?
18. Qual versão identifica a aplicação?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Contrato orientado ao uso do consumer.
2. O consumer test.
3. O gateway real.
4. Precondição do provider.
5. Não.
6. Aceitar variação segura.
7. Não.
8. Não.
9. Não.
10. Aplicação participante.
11. Resultado da verificação do provider.
12. Compartilhar e formar matriz.
13. Expectativa ainda sem sucesso para provider.
14. Não.
15. Pact novo incluído automaticamente.
16. Consulta compatibilidade de versões.
17. Depois do deploy bem-sucedido.
18. Git commit SHA.
19. RabbitMQ fundamentos.
20. Broker, conexão, channel e primeira mensagem.

---

## Desafio opcional

Crie um terceiro consumer:

```text
catalog-reporting-consumer.
```

Ele utiliza somente:

```text
GET availability;

productCode;

available.
```

Requisitos:

- pacticipant próprio;
- versão própria;
- consumer test real;
- não exigir `quantity`;
- provider verification;
- consumer inventory atualizado;
- can-i-deploy independente;
- prova de que remover `quantity` quebra `order-consumer`, mas não esse consumer;
- nenhum copy/paste do Pact existente.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 474 - M16.19 - Testes de contrato

- Diferenciei Pact, OpenAPI, WireMock e E2E.
- Compreendi consumer-driven contract testing.
- Fixei Pact-JVM 4.7.3.
- Adicionei consumer JUnit 5.
- Adicionei provider Spring/JUnit 5.
- Criei Pact V4.
- Mantive nomes estáveis de pacticipants.
- Separei `order-consumer` e `order-consumer-reactive`.
- Executei gateways reais nos consumer tests.
- Injeteei o MockServer dinâmico.
- Criei interactions de availability, not found, reservation e conflict.
- Criei descriptions semânticas.
- Criei provider states como precondições.
- Diferenciei matchers e valores exatos.
- Evitei matchers amplos em identifiers e error codes.
- Gerei pact files em `target/pacts`.
- Impedi edição manual de Pacts.
- Criei structure e sanitization tests.
- Criei provider verification com aplicação real.
- Usei random port e `HttpTestTarget`.
- Usei `@TestTemplate`.
- Injetei token efêmero na request do verifier.
- Não alterei body ou path na verification.
- Criei states isolados para banco, tenant e idempotência.
- Testei state ausente e state leakage.
- Criei verificação local.
- Configurei Pact Broker no CI.
- Mantive Broker token em secret.
- Usei Git SHA como consumer e provider version.
- Publiquei branch e build URL.
- Configurei selectors de main, matching e deployed/released.
- Documentei pending e WIP.
- Mantive pending fora da decisão de deploy do consumer.
- Publiquei Pact do consumer.
- Publiquei verification result do provider.
- Configurei `can-i-deploy`.
- Configurei `record-deployment`.
- Testei breaking expectation do consumer.
- Testei breaking change do provider.
- Mantive Pact e OpenAPI consistentes.
- Criei métricas e runbook.
- Executei regressões do WireMock.
- Não antecipei message Pact ou RabbitMQ.
- Mantive produção como NO-GO.
- Próxima aula: RabbitMQ fundamentos.
```

---

## Referência técnica curta

- Pact Docs — Consumer tests.
- Pact-JVM — Consumer JUnit 5.
- Pact-JVM — Provider JUnit 5.
- Pact-JVM — Provider Spring/JUnit 5.
- Pact Docs — Provider states.
- Pact Broker — Publishing and retrieving pacts.
- Pact Broker — Pending and WIP pacts.
- Pact Broker — Can I Deploy.
- Pact Broker — Recording deployments and releases.

Regra final:

```text
testes de contrato consumer-driven devem provar necessidades reais e compatibilidade entre versões: cada consumer executa seu gateway de produção contra o mock server do Pact e gera um Pact V4 com interações, states e matchers precisos; o provider recupera esses contratos, prepara precondições isoladas, injeta somente autenticação efêmera e verifica a aplicação real; o Broker armazena pacts, branches, versões, resultados e deployments; pending e WIP organizam evolução sem transformar incompatibilidade em sucesso; can-i-deploy consulta a matriz antes do release; OpenAPI continua governando a superfície, WireMock continua simulando resiliência e E2E continua validando ambiente e fluxo completo.
```
