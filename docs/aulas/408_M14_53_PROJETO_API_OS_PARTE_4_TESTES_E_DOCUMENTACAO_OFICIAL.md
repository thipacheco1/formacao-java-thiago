# 408 - M14.53 - Projeto API OS parte 4 testes e documentacao

## Apresentação da aula

Na aula 407, a API de Ordem de Serviço ganhou persistência orientada às consultas reais.

A listagem passou a suportar:

```text
status;

customerName;

serviceType;

scheduledFrom;

scheduledTo;

paginação;

ordenação controlada;

desempate por ID.
```

A implementação utilizou:

```text
ServiceOrderSearchCriteria;

ServiceOrderSearchValidator;

ServiceOrderSpecifications;

JpaSpecificationExecutor;

ServiceOrderPageRequestFactory;

migration V7;

índices PostgreSQL.
```

Aquela aula respondeu:

```text
como filtrar e paginar
sem carregar tudo em memória
e sem criar um método
para cada combinação?
```

Agora o projeto guiado de Ordem de Serviço precisa ser consolidado.

Até aqui, você construiu quatro grupos de comportamento.

Primeiro:

```text
domínio e CRUD.
```

Segundo:

```text
validações, transições,
ETag e If-Match.
```

Terceiro:

```text
persistência,
filtros,
paginação e índices.
```

Quarto:

```text
contrato público,
documentação e consumo.
```

A pergunta central desta aula será:

```text
como provar que a API OS
funciona em cada camada,
como registrar seu contrato
e como deixar o projeto
reproduzível para outra pessoa?
```

A resposta utilizará uma estratégia de testes em camadas.

A suíte será dividida em:

```text
testes de domínio;

testes de validators;

testes do application service;

testes de controller;

testes de repository;

testes de integração HTTP;

teste de OpenAPI;

collection Postman/Insomnia;

documentação técnica.
```

Cada tipo de teste terá uma responsabilidade clara.

Teste de domínio:

```text
prova regras da entity
sem Spring e sem banco.
```

Teste de validator:

```text
prova dados e limites
sem infraestrutura.
```

Teste de application service:

```text
prova coordenação,
transação lógica,
repository, Clock e ID generator
com mocks.
```

Teste de controller:

```text
prova método, path,
headers, JSON, status
e Problem Details.
```

Teste de repository:

```text
prova JPA, Specifications,
migrations e PostgreSQL real.
```

Teste de integração HTTP:

```text
prova o fluxo completo
controller -> service -> JPA -> PostgreSQL.
```

Teste de OpenAPI:

```text
prova que o contrato gerado
contém paths, responses
e headers essenciais.
```

A collection:

```text
prova fluxos manuais,
encadeamento e uso real.
```

A documentação:

```text
explica domínio, setup,
endpoints, erros,
filtros e concorrência.
```

O objetivo não será atingir um percentual arbitrário de cobertura.

Uma métrica de linhas pode ajudar a localizar áreas não exercitadas.

Ela não prova:

- qualidade das assertions;
- relevância dos cenários;
- comportamento concorrente;
- compatibilidade de contrato;
- ausência de bugs.

A prioridade será:

```text
comportamentos críticos;

fronteiras;

regras;

erros;

concorrência;

consultas;

contrato.
```

A suíte não duplicará todas as mesmas assertions em todos os níveis.

Exemplo:

```text
OPEN -> COMPLETED inválido
é testado profundamente no domínio;

o controller precisa provar
que a exception vira 409,
não repetir toda a matriz.
```

Essa decisão reduz testes frágeis e lentos.

O Spring Boot oferece testes com ambiente mock e MockMvc sem iniciar um servidor real. Testcontainers integra serviços reais ao JUnit, e `@ServiceConnection` permite fornecer os detalhes de conexão para a auto-configuração.

Nesta aula, PostgreSQL real continuará sendo utilizado nos testes de persistência e integração.

Não será usado H2.

Motivo:

```text
a aplicação usa PostgreSQL;

migrations usam PostgreSQL;

índices e tipos precisam
ser validados no banco real.
```

A baseline de testes usará:

```text
postgres:17.6-alpine.
```

A imagem deve permanecer alinhada ao laboratório do módulo.

O profile de teste precisará desabilitar recursos não relacionados:

- scheduler;
- e-mail;
- cache Redis;
- rate limiting externo;
- tarefas assíncronas que não participam do cenário.

A suíte de OS não deve falhar porque Mailpit ou Redis não estão ativos.

Quando Redis faz parte do comportamento testado, ele merece uma suíte própria.

A documentação final da API OS será adicionada em:

```text
docs/api/service-orders.md
```

O arquivo principal:

```text
docs/api/README.md
```

receberá um link para o novo documento.

A collection da aula 401 ganhará o folder:

```text
40 - Service Orders v2.
```

Variáveis:

```text
serviceOrderId;

serviceOrderEtag;

openServiceOrderId;

openServiceOrderEtag.
```

A próxima aula será:

```text
409 - M14.54 - Revisao tecnica Spring Boot APIs
```

Por isso, esta aula encerra o projeto API OS.

Ela não começará ainda a revisão ampla de todo o módulo.

---

## Onde estamos na formação

A sequência do projeto guiado é:

```text
405:
domínio e CRUD.

406:
validações e erros.

407:
persistência e filtros.

408:
testes e documentação.
```

A aula 407 respondeu:

```text
como consultar OS
com filtros opcionais
e índices coerentes?
```

A aula 408 responderá:

```text
como consolidar a feature
com evidências automatizadas
e documentação executável?
```

Nesta aula:

```text
testes de domínio:
sim.

testes de validator:
sim.

testes de service:
sim.

testes de controller:
sim.

testes de repository:
sim.

integração HTTP:
sim.

PostgreSQL real:
sim.

Testcontainers:
sim.

OpenAPI:
sim.

collection:
sim.

documentação:
sim.

revisão técnica do módulo:
não.

nova feature:
não.
```

A regra central será:

```text
cada teste precisa falhar
por um motivo compreensível;

cada camada precisa provar
apenas a responsabilidade
que realmente possui.
```

---

## Objetivo prático

Ao final da aula, a feature terá uma suíte organizada.

Estrutura esperada:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── serviceorder
│       ├── ServiceOrderApplicationServiceTest.java
│       ├── ServiceOrderCommandValidatorTest.java
│       └── ServiceOrderSearchValidatorTest.java
├── domain
│   └── serviceorder
│       └── ServiceOrderTest.java
├── persistence
│   └── serviceorder
│       └── ServiceOrderRepositoryPostgreSqlTest.java
├── support
│   ├── PostgreSqlTestConfiguration.java
│   └── ServiceOrderTestFixture.java
└── web
    └── v2
        └── serviceorder
            ├── ServiceOrderControllerTest.java
            ├── ServiceOrderApiIT.java
            ├── ServiceOrderHttpVersionTest.java
            ├── ServiceOrderOpenApiTest.java
            └── ServiceOrderPageRequestFactoryTest.java
```

Documentação:

```text
docs/api/service-orders.md
```

Collection:

```text
api-clients/postman/
└── formacao-java-backend-api-v2.postman_collection.json
```

O gate final será:

```powershell
.\mvnw.cmd clean verify
```

Você irá:

1. revisar a pirâmide de testes;
2. criar fixtures reutilizáveis;
3. completar testes de domínio;
4. completar validators;
5. testar o application service;
6. testar o controller;
7. testar repository com PostgreSQL;
8. testar o fluxo HTTP integrado;
9. testar o OpenAPI;
10. atualizar a collection;
11. criar documentação da feature;
12. executar o gate final;
13. revisar evidências;
14. commitar.

---

## Conceito essencial

### Teste por responsabilidade

Um teste deve informar claramente o que quebrou.

Exemplo ruim:

```text
testeFluxoCompletoDaAplicacao.
```

Ele cria, atualiza, filtra, cancela, exclui, consulta OpenAPI e verifica logs.

Quando falha, o diagnóstico é lento.

Preferível:

```text
shouldOpenServiceOrder;

shouldRejectPastSchedule;

shouldReturn412ForStaleEtag;

shouldFilterByStatusAndCustomerName.
```

O nome comunica cenário e resultado.

---

### Teste de domínio

O domínio não precisa de Spring.

Para testar:

```text
factory;

estado inicial;

update permitido;

update bloqueado;

delete permitido;

delete bloqueado;

transições;

estado terminal.
```

Use JUnit e AssertJ.

Não use repository.

Não use MockMvc.

Não use container.

---

### Teste de application service

O service coordena dependências.

Mocks adequados:

```text
ServiceOrderRepository;

ServiceOrderIdGenerator;

Clock;

ServiceOrderCommandValidator;

ServiceOrderSearchValidator.
```

O teste verifica:

- chamada correta;
- entity enviada ao repository;
- ID utilizado;
- tempo utilizado;
- exception propagada;
- flush em mutações;
- version verificada;
- specification delegada.

Evite testar private methods por reflection.

Teste pelo comportamento público.

---

### Teste de controller

`@WebMvcTest` carrega componentes MVC relevantes.

Ele é adequado para:

- mapping;
- JSON;
- Bean Validation;
- headers;
- status;
- advice;
- serialization;
- deserialization.

O application service será substituído por:

```text
@MockitoBean.
```

O controller continua real.

O advice da feature continua real.

---

### MockMvc

MockMvc executa o pipeline Spring MVC sem abrir porta de rede.

Ele prova:

- request mapping;
- converters;
- validation;
- filters incluídos;
- exception handling;
- response.

Ele não prova:

- socket;
- proxy;
- TLS;
- rede externa.

Para a feature atual, o ambiente mock é suficiente no teste de controller.

---

### Teste de repository

O repository precisa de PostgreSQL real porque a feature usa:

- UUID;
- timestamptz;
- check constraint;
- índices por expressão;
- índice parcial;
- Criteria API;
- Specifications;
- paginação.

`@DataJpaTest` foca JPA, entities e repositories.

O Testcontainer fornece PostgreSQL.

Flyway precisa aplicar V6 e V7.

Hibernate continua validando o schema.

---

### Teste de integração HTTP

O teste integrado usa:

```text
@SpringBootTest;

@AutoConfigureMockMvc;

PostgreSQL Testcontainer;

MockMvc;

repository real;

Flyway real;

controller real;

service real.
```

Ele não usa mock do service.

A finalidade é provar a integração das camadas.

Não adicione `@Transactional` na classe de teste.

Requests MockMvc executam transações da aplicação.

Um rollback no método de teste não representa corretamente essas fronteiras.

Faça limpeza explícita antes de cada cenário.

---

### Testcontainers como bean de teste

Uma configuração compartilhada evita repetir o container.

Exemplo:

```java
@TestConfiguration(
        proxyBeanMethods = false
)
public class PostgreSqlTestConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(
                "postgres:17.6-alpine"
        );
    }
}
```

O container é criado antes dos beans que dependem dele e encerrado depois do contexto.

A mesma configuração pode ser importada em testes de repository e integração.

---

### Fixtures

Fixtures evitam JSON e objetos duplicados.

Porém, uma fixture muito genérica pode esconder o cenário.

Use defaults claros:

```text
customerName:
Cliente Teste.

serviceType:
Instalação.

description:
Instalação do equipamento.

address:
Rua Teste, 100.
```

O teste altera apenas o campo relevante.

---

### Assertions de contrato

No controller, verifique:

- status;
- `Location`;
- `ETag`;
- content type;
- campos;
- code do Problem Details;
- violations;
- ausência de stack trace.

Não compare JSON inteiro como uma string.

A ordem de propriedades não faz parte do contrato.

---

### Testes de filtros

Filtro deve ser provado no PostgreSQL.

Cenários:

```text
status;

customerName contains;

case-insensitive;

serviceType equals;

janela semiaberta;

combinação;

wildcard literal;

ordenação;

paginação.
```

Não é necessário criar um teste de integração para cada combinação possível.

Escolha cenários representativos.

---

### OpenAPI como contrato verificável

A documentação gerada deve conter:

```text
/api/v2/service-orders;

/{id};

/{id}/status;

201;

204;

409;

412;

428;

ETag;

If-Match;

query parameters.
```

Um smoke test do JSON OpenAPI detecta:

- path removido;
- response omitida;
- header não documentado;
- tag ausente.

Ele não substitui revisão humana do contrato.

---

### Collection como evidência manual

A collection deve conseguir executar:

```text
create;

get;

update com ETag;

stale ETag;

start;

complete;

search;

delete de uma OS OPEN;

erro de transição.
```

O script precisa atualizar:

```text
serviceOrderEtag
```

depois de cada response que retorna o header.

---

### Documentação da feature

O arquivo `service-orders.md` deve explicar:

- objetivo;
- modelo;
- status;
- transições;
- endpoints;
- requests;
- responses;
- ETag;
- If-Match;
- filtros;
- erros;
- exemplos;
- testes;
- limitações.

Ele aponta para OpenAPI e collection.

Não copia todas as classes.

---

## Mão na massa guiada

### 1. Criar a configuração do PostgreSQL de teste

Arquivo:

```text
PostgreSqlTestConfiguration.java
```

Conteúdo:

```java
package br.com.formacao.backend.support;

import org.springframework.boot.test.context
        .TestConfiguration;
import org.springframework.boot.testcontainers
        .service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers
        .PostgreSQLContainer;

@TestConfiguration(
        proxyBeanMethods = false
)
public class PostgreSqlTestConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(
                "postgres:17.6-alpine"
        );
    }
}
```

Confirme a dependency de teste:

```text
spring-boot-testcontainers.
```

Ela já foi usada na aula 395.

---

### 2. Criar a fixture

```java
package br.com.formacao.backend.support;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import br.com.formacao.backend.application
        .serviceorder.CreateServiceOrderCommand;
import br.com.formacao.backend.domain
        .serviceorder.ServiceOrder;

public final class ServiceOrderTestFixture {

    public static final UUID ID =
            UUID.fromString(
                    "11111111-1111-1111-1111-111111111111"
            );

    public static final Instant NOW =
            Instant.parse(
                    "2026-07-11T15:00:00Z"
            );

    private ServiceOrderTestFixture() {
    }

    public static CreateServiceOrderCommand
            createCommand() {
        return new CreateServiceOrderCommand(
                "Cliente Teste",
                "Instalação",
                "Instalar equipamento",
                "Rua Teste, 100",
                OffsetDateTime.of(
                        2026,
                        7,
                        15,
                        9,
                        0,
                        0,
                        0,
                        ZoneOffset.ofHours(-3)
                )
        );
    }

    public static ServiceOrder openEntity() {
        CreateServiceOrderCommand command =
                createCommand();

        return ServiceOrder.open(
                ID,
                command.customerName(),
                command.serviceType(),
                command.description(),
                command.serviceAddress(),
                command.scheduledFor(),
                NOW
        );
    }
}
```

---

### 3. Completar ServiceOrderTest

Cenários mínimos:

```java
@Test
void shouldOpenServiceOrder() {
    ServiceOrder order =
            ServiceOrderTestFixture.openEntity();

    assertThat(order.getStatus())
            .isEqualTo(
                    ServiceOrderStatus.OPEN
            );

    assertThat(order.getVersion())
            .isZero();
}
```

Transição válida:

```java
@Test
void shouldTransitionFromOpenToInProgress() {
    ServiceOrder order =
            ServiceOrderTestFixture.openEntity();

    order.transitionTo(
            ServiceOrderStatus.IN_PROGRESS,
            ServiceOrderTestFixture.NOW
                    .plusSeconds(60)
    );

    assertThat(order.getStatus())
            .isEqualTo(
                    ServiceOrderStatus.IN_PROGRESS
            );
}
```

Transição inválida:

```java
@Test
void shouldRejectOpenToCompleted() {
    ServiceOrder order =
            ServiceOrderTestFixture.openEntity();

    assertThatThrownBy(
            () -> order.transitionTo(
                    ServiceOrderStatus.COMPLETED,
                    ServiceOrderTestFixture.NOW
            )
    )
    .isInstanceOf(
            InvalidServiceOrderTransitionException.class
    );
}
```

Complete a matriz essencial.

---

### 4. Completar validators

`ServiceOrderCommandValidatorTest`:

```text
command válido passa;

blank acumula violations;

scheduledFor passado falha;

scheduledFor igual ao now passa;

limite máximo passa;

acima do máximo falha.
```

`ServiceOrderSearchValidatorTest`:

```text
blank vira null;

janela válida passa;

início igual ao fim falha;

fim anterior falha;

uma borda passa.
```

Use:

```text
Clock ou Instant fixo.
```

---

### 5. Criar ServiceOrderApplicationServiceTest

Use:

```java
@ExtendWith(
        MockitoExtension.class
)
class ServiceOrderApplicationServiceTest {

    @Mock
    private ServiceOrderRepository repository;

    @Mock
    private ServiceOrderIdGenerator idGenerator;

    @Mock
    private ServiceOrderCommandValidator validator;

    @Mock
    private ServiceOrderSearchValidator searchValidator;

    private Clock clock;

    private ServiceOrderApplicationService service;

    @BeforeEach
    void setUp() {
        clock = Clock.fixed(
                ServiceOrderTestFixture.NOW,
                ZoneOffset.UTC
        );

        service =
                new ServiceOrderApplicationService(
                        repository,
                        idGenerator,
                        validator,
                        searchValidator,
                        clock
                );
    }
}
```

Adapte a ordem do construtor ao código real.

---

### 6. Testar create no service

```java
@Test
void shouldCreateOpenServiceOrder() {
    CreateServiceOrderCommand command =
            ServiceOrderTestFixture
                    .createCommand();

    when(idGenerator.nextId())
            .thenReturn(
                    ServiceOrderTestFixture.ID
            );

    when(repository.save(any()))
            .thenAnswer(
                    invocation ->
                            invocation.getArgument(0)
            );

    ServiceOrderResult result =
            service.create(
                    command
            );

    assertThat(result.id())
            .isEqualTo(
                    ServiceOrderTestFixture.ID
            );

    assertThat(result.status())
            .isEqualTo(
                    ServiceOrderStatus.OPEN
            );

    verify(validator)
            .validateCreate(
                    command,
                    ServiceOrderTestFixture.NOW
            );

    verify(repository)
            .save(any(ServiceOrder.class));
}
```

---

### 7. Testar versão antiga

Prepare uma entity OPEN.

```java
when(repository.findById(ID))
        .thenReturn(
                Optional.of(order)
        );
```

Chame update com versão diferente.

Valide:

```text
ServiceOrderVersionMismatchException;

repository.flush não chamado.
```

Isso prova fail-fast antes da escrita.

---

### 8. Testar transição e flush

Cenário:

```text
OPEN;

expectedVersion 0;

target IN_PROGRESS.
```

Valide:

- status alterado;
- `repository.flush()` chamado;
- result correto.

Simule:

```java
doThrow(
    new ObjectOptimisticLockingFailureException(
        ServiceOrder.class,
        ID
    )
)
.when(repository)
.flush();
```

Confirme tradução para:

```text
ServiceOrderConcurrentUpdateException.
```

---

### 9. Criar ServiceOrderControllerTest

```java
@WebMvcTest(
        ServiceOrderController.class
)
@Import(
        ServiceOrderErrorHandler.class
)
class ServiceOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ServiceOrderApplicationService
            applicationService;
}
```

Se o advice faz parte do component scan do slice, não duplique o import.

Use a configuração efetiva do projeto.

---

### 10. Testar create HTTP

Prepare um `ServiceOrderResult` com version zero.

Execute:

```java
mockMvc.perform(
        post(
            "/api/v2/service-orders"
        )
        .contentType(
            MediaType.APPLICATION_JSON
        )
        .header(
            "X-Client-Id",
            "controller-test"
        )
        .content(
            """
            {
              "customerName": "Cliente Teste",
              "serviceType": "Instalação",
              "description": "Instalar equipamento",
              "serviceAddress": "Rua Teste, 100",
              "scheduledFor": "2026-07-15T09:00:00-03:00"
            }
            """
        )
)
.andExpect(
        status().isCreated()
)
.andExpect(
        header().string(
                "Location",
                Matchers.endsWith(
                        "/api/v2/service-orders/"
                        + ID
                )
        )
)
.andExpect(
        header().string(
                "ETag",
                "\"0\""
        )
)
.andExpect(
        jsonPath("$.status")
                .value("OPEN")
)
.andExpect(
        jsonPath("$.version")
                .value(0)
);
```

---

### 11. Testar If-Match ausente

Execute PUT sem o header.

Resultado:

```text
428;

application/problem+json;

code:
service_order_precondition_required.
```

O mock do service não deve ser chamado.

---

### 12. Testar PATCH inválido

Configure o service para lançar:

```text
InvalidServiceOrderTransitionException.
```

Execute PATCH.

Valide:

```text
409;

service_order_invalid_transition;

from OPEN;

to COMPLETED;

X-Correlation-Id.
```

Não valide stack trace.

---

### 13. Criar teste de repository com PostgreSQL

```java
@DataJpaTest
@Import(
        PostgreSqlTestConfiguration.class
)
@ActiveProfiles(
        "test"
)
class ServiceOrderRepositoryPostgreSqlTest {

    @Autowired
    private ServiceOrderRepository repository;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAllInBatch();
    }
}
```

Confirme que o profile de teste mantém:

```text
Flyway enabled;

ddl-auto validate.
```

---

### 14. Testar persistência

Salve três ordens.

Confirme:

- UUID;
- status;
- timestamps;
- version;
- update incrementa version;
- constraint de status existe via migration.

Não altere a coluna manualmente para “testar” o enum.

---

### 15. Testar Specifications no PostgreSQL

Crie dados:

```text
Silva Comércio / Instalação / OPEN;

Silva Residencial / Manutenção / IN_PROGRESS;

Oficina Norte / Instalação / OPEN.
```

Use:

```java
repository.findAll(
        ServiceOrderSpecifications.withFilters(
                criteria
        ),
        pageable
);
```

Confirme:

```text
status OPEN;

customerName contém silva;

serviceType instalação;

somente um resultado.
```

Adicione cenário de `%` literal.

---

### 16. Criar ServiceOrderApiIT

```java
@SpringBootTest
@AutoConfigureMockMvc
@Import(
        PostgreSqlTestConfiguration.class
)
@ActiveProfiles(
        "test"
)
class ServiceOrderApiIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ServiceOrderRepository repository;

    @BeforeEach
    void cleanDatabase() {
        repository.deleteAllInBatch();
    }
}
```

Não use `@Transactional` na classe.

---

### 17. Testar fluxo integrado

Crie helpers:

```text
createOrder;

extractId;

extractEtag;

getOrder;

transitionStatus.
```

Cenário principal:

1. POST retorna 201 e ETag `"0"`;
2. GET retorna o mesmo ID;
3. PUT com `"0"` retorna nova versão;
4. PUT novamente com `"0"` retorna 412;
5. PATCH com ETag atual inicia;
6. PUT em `IN_PROGRESS` retorna 409;
7. PATCH conclui;
8. GET confirma `COMPLETED`.

Esse teste prova a jornada principal.

---

### 18. Testar busca integrada

Crie múltiplas OS.

Transicione algumas.

Consulte:

```text
status=OPEN;

customerName=silva;

serviceType=instalação;

size=2;

sort=createdAt;

direction=desc.
```

Valide:

- `content`;
- `totalElements`;
- `page`;
- `size`;
- cada item;
- ordem determinística.

Não dependa de ordem de inserção sem sort.

---

### 19. Testar delete integrado

Crie uma OS OPEN.

DELETE com ETag:

```text
204.
```

GET:

```text
404.
```

Crie outra e transicione para IN_PROGRESS.

DELETE:

```text
409.
```

---

### 20. Criar teste de OpenAPI

Use o contexto completo ou um teste focado de web.

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(
        "test"
)
class ServiceOrderOpenApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldDocumentServiceOrderContract()
            throws Exception {

        mockMvc.perform(
                get(
                    "/v3/api-docs"
                )
        )
        .andExpect(
                status().isOk()
        )
        .andExpect(
                jsonPath(
                    "$.paths['/api/v2/service-orders']"
                ).exists()
        )
        .andExpect(
                jsonPath(
                    "$.paths['/api/v2/service-orders/{serviceOrderId}']"
                ).exists()
        )
        .andExpect(
                jsonPath(
                    "$.paths['/api/v2/service-orders/{serviceOrderId}/status']"
                ).exists()
        );
    }
}
```

Amplie para responses e headers essenciais.

---

### 21. Completar annotations OpenAPI

No controller:

```java
@Tag(
        name = "Service Orders v2",
        description = "Lifecycle and search of service orders"
)
```

Em create:

```text
201;

400;

Location;

ETag.
```

Em update:

```text
200;

400;

404;

409;

412;

428;

If-Match;

ETag.
```

Em transition:

```text
200;

400;

404;

409;

412;

428.
```

Na busca:

```text
status;

customerName;

serviceType;

scheduledFrom;

scheduledTo;

page;

size;

sort;

direction.
```

Não descreva respostas que o código não produz.

---

### 22. Atualizar a collection

Crie o folder:

```text
40 - Service Orders v2.
```

Requests:

```text
Create Open Service Order;

Get Service Order;

Update Service Order;

Start Service Order;

Complete Service Order;

Search Service Orders;

Create Order for Delete;

Delete Open Service Order;

Stale ETag Error;

Invalid Transition Error.
```

---

### 23. Capturar ETag no Postman

No post-response script:

```javascript
const etag =
    pm.response.headers.get(
        "ETag"
    );

if (etag) {
    pm.environment.set(
        "serviceOrderEtag",
        etag
    );
}
```

No create:

```javascript
const body =
    pm.response.json();

pm.environment.set(
    "serviceOrderId",
    body.id
);
```

Não remova aspas do ETag.

O header `If-Match` usa o valor exatamente como recebido.

---

### 24. Testar runner da collection

Fluxo principal:

```text
Create;

Get;

Update;

Start;

Complete;

Search.
```

Fluxo de exclusão separado:

```text
Create Order for Delete;

Delete Open Service Order.
```

Fluxos de erro:

```text
Stale ETag;

Invalid Transition;

Missing If-Match;

Invalid Search Parameter.
```

Execute três vezes.

Limpe variáveis ao final.

---

### 25. Criar docs/api/service-orders.md

Estrutura:

```markdown
# Service Orders API v2

## Objetivo
## Modelo
## Status
## Transições
## Endpoints
## Create
## Read
## Update
## Status transition
## Delete
## Search
## ETag e If-Match
## Erros
## Exemplos
## Testes
## Limitações
```

---

### 26. Documentar a matriz de transição

```markdown
| Estado atual | Destino | Permitido |
|---|---|---|
| OPEN | IN_PROGRESS | Sim |
| OPEN | CANCELED | Sim |
| OPEN | COMPLETED | Não |
| IN_PROGRESS | COMPLETED | Sim |
| IN_PROGRESS | CANCELED | Sim |
| COMPLETED | qualquer | Não |
| CANCELED | qualquer | Não |
```

---

### 27. Documentar filtros

Tabela:

```markdown
| Parâmetro | Semântica |
|---|---|
| status | Igualdade |
| customerName | Contains sem diferenciar caixa |
| serviceType | Igualdade sem diferenciar caixa |
| scheduledFrom | Inclusivo |
| scheduledTo | Exclusivo |
| page | Base zero |
| size | 1 a 100 |
| sort | Allowlist |
| direction | asc ou desc |
```

---

### 28. Documentar concorrência

Explique:

```text
GET retorna ETag;

mutações exigem If-Match;

428:
header ausente.

412:
versão antiga.

409:
corrida detectada durante o flush.
```

Inclua exemplo:

```http
If-Match: "2"
```

---

### 29. Atualizar README principal da API

Em:

```text
docs/api/README.md
```

Adicione:

```markdown
- [Service Orders API v2](service-orders.md)
```

Inclua Service Orders na tabela de endpoints principais.

Não duplique o documento inteiro.

---

### 30. Executar o gate final

```powershell
docker info

.\mvnw.cmd clean verify
```

Depois:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Execute o runner da collection.

Consulte Swagger UI.

Revise:

```text
zero teste falhando;

OpenAPI correta;

collection verde;

documentação navegável.
```

---

## Entendendo o que foi feito

### O domínio foi provado sem framework

Regras centrais possuem testes rápidos.

### O service foi isolado

ID, tempo e repository ficaram controláveis.

### O contrato HTTP foi protegido

Status, headers e Problem Details possuem assertions.

### PostgreSQL real foi exercitado

Migrations, JPA e Specifications não dependem de H2.

### A jornada foi provada ponta a ponta

Create, ETag, update, transição e busca atravessaram as camadas reais.

### OpenAPI deixou de ser apenas visual

Paths e responses essenciais possuem smoke test.

### A collection acompanhou o contrato

ETag e IDs são encadeados.

### A documentação encerrou a feature

Outra pessoa pode entender e executar a API OS.

---

## Erros comuns importantes

### Testar tudo com SpringBootTest

A suíte fica lenta e pouco diagnóstica.

### Mockar a entity

Regras de domínio deixam de ser testadas.

### Usar H2

Diferenças de PostgreSQL ficam escondidas.

### Repetir o mesmo cenário em todas as camadas

A manutenção aumenta sem ganho proporcional.

### Não limpar o banco

Testes passam ou falham conforme a ordem.

### Usar @Transactional no fluxo HTTP

O rollback do teste não representa as transações da aplicação.

### Comparar JSON como string

Ordem de propriedades cria fragilidade.

### Ignorar headers

ETag, Location e If-Match fazem parte do contrato.

### Atualizar código sem OpenAPI e collection

As fontes divergem.

### Perseguir cobertura sem comportamento

Linhas verdes não garantem regras corretas.

---

## Comandos úteis

### Testes unitários da feature

```powershell
.\mvnw.cmd `
  "-Dtest=ServiceOrderTest,ServiceOrderCommandValidatorTest,ServiceOrderSearchValidatorTest,ServiceOrderApplicationServiceTest,ServiceOrderHttpVersionTest,ServiceOrderPageRequestFactoryTest" `
  test
```

### Repository PostgreSQL

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderRepositoryPostgreSqlTest `
  test
```

### Integração HTTP

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderApiIT `
  test
```

### Gate final

```powershell
.\mvnw.cmd clean verify
```

### Subir ambiente manual

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

---

## Exercício guiado

### Parte 1 — Domínio

Complete a matriz de transições.

### Parte 2 — Validators

Teste bordas e múltiplas violations.

### Parte 3 — Service

Teste create, versão, flush e concorrência.

### Parte 4 — Controller

Teste 201, 204, 409, 412 e 428.

### Parte 5 — Repository

Teste Specifications no PostgreSQL.

### Parte 6 — Integração

Execute a jornada completa por MockMvc.

### Parte 7 — OpenAPI

Valide paths, responses e headers.

### Parte 8 — Collection

Encadeie ID e ETag.

### Parte 9 — Documentação

Crie `service-orders.md`.

### Parte 10 — Gate

Execute `clean verify` e runner.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 407 foi preservada;
- estratégia de testes em camadas foi definida;
- domínio é testado sem Spring;
- validators são testados sem Spring;
- application service usa Mockito;
- controller usa WebMvcTest;
- repository usa DataJpaTest;
- integração usa SpringBootTest;
- MockMvc foi utilizado;
- PostgreSQL real foi utilizado;
- H2 não foi utilizado;
- Testcontainers foi reutilizado;
- ServiceConnection foi utilizado;
- configuração compartilhada foi criada;
- fixture de OS foi criada;
- IDs fixos foram usados nos testes;
- tempo fixo foi usado;
- estado inicial foi testado;
- transições válidas foram testadas;
- transições inválidas foram testadas;
- estados terminais foram testados;
- update bloqueado foi testado;
- delete bloqueado foi testado;
- command válido foi testado;
- blank foi testado;
- limite máximo foi testado;
- agendamento passado foi testado;
- limite temporal foi testado;
- busca válida foi testada;
- período inválido foi testado;
- service create foi testado;
- gerador de ID foi verificado;
- Clock foi verificado;
- repository.save foi verificado;
- versão antiga foi testada;
- flush não ocorre após mismatch;
- transição do service foi testada;
- optimistic locking foi traduzido;
- controller create retorna 201;
- Location foi testado;
- ETag foi testado;
- JSON foi testado por campos;
- If-Match ausente retorna 428;
- transição inválida retorna 409;
- Problem Details foi testado;
- correlation ID foi preservado;
- stack trace não foi validada como conteúdo público;
- repository aplica migrations;
- schema é validado;
- persistência de UUID foi testada;
- version incrementada foi testada;
- filtro por status foi testado;
- filtro por cliente foi testado;
- filtro por tipo foi testado;
- janela semiaberta foi testada;
- combinação de filtros foi testada;
- wildcard literal foi testado;
- paginação foi testada;
- ordenação foi testada;
- integração não usa mock do service;
- banco é limpo explicitamente;
- teste de integração não usa Transactional na classe;
- create integrado foi testado;
- get integrado foi testado;
- update integrado foi testado;
- stale ETag integrado foi testado;
- start integrado foi testado;
- complete integrado foi testado;
- search integrado foi testado;
- delete OPEN integrado foi testado;
- delete bloqueado integrado foi testado;
- OpenAPI foi testada;
- path base foi testado;
- path de ID foi testado;
- path de status foi testado;
- responses principais foram documentadas;
- header ETag foi documentado;
- header If-Match foi documentado;
- query parameters foram documentados;
- folder da collection foi criado;
- serviceOrderId foi encadeado;
- serviceOrderEtag foi encadeado;
- aspas do ETag foram preservadas;
- runner principal foi criado;
- runner de exclusão foi separado;
- cenários de erro foram criados;
- runner foi executado três vezes;
- documentação service-orders.md foi criada;
- modelo foi documentado;
- transições foram documentadas;
- filtros foram documentados;
- concorrência foi documentada;
- erros foram documentados;
- limitações foram documentadas;
- README principal foi atualizado;
- gate clean verify foi executado;
- Swagger UI foi revisada;
- collection foi executada;
- revisão técnica ampla não foi antecipada;
- nova feature não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 409 está correta.

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
git commit -m "test(m14): consolidar API OS com testes e documentacao"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- env files;
- credentials;
- relatórios temporários;
- logs;
- dados PostgreSQL;
- exports locais duplicados;
- arquivos usados manualmente no upload.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto API OS foi consolidado.

A feature agora possui:

```text
domínio;

validações;

transições;

concorrência;

persistência;

filtros;

índices;

testes;

OpenAPI;

collection;

documentação.
```

A evidência ficou distribuída de forma intencional:

```text
JUnit:
regras.

Mockito:
coordenação.

WebMvcTest:
contrato HTTP.

DataJpaTest:
persistência.

SpringBootTest:
integração.

OpenAPI:
descrição.

Collection:
uso manual.

Markdown:
contexto e operação.
```

A decisão central foi:

```text
uma feature completa
não termina quando o endpoint responde;

ela termina quando o comportamento
está protegido por testes,
o contrato está documentado
e outra pessoa consegue reproduzir
o fluxo com confiança.
```

A próxima aula será:

```text
409 - M14.54 - Revisao tecnica Spring Boot APIs
```

Nela, você revisará o módulo como um todo.

A revisão incluirá:

- arquitetura;
- Spring Boot;
- configuração;
- REST;
- validação;
- erros;
- JPA;
- cache;
- rate limiting;
- arquivos;
- e-mail;
- testes;
- observabilidade;
- containers;
- documentação;
- projeto API OS.

O fechamento formal do módulo permanecerá para a aula 410.

---

# Material complementar

## Checkpoint final

- [ ] Testei regras sem Spring.
- [ ] Testei web com MockMvc.
- [ ] Testei PostgreSQL com Testcontainers.
- [ ] Atualizei OpenAPI e collection.
- [ ] Documentei e executei o gate final.

---

## Troubleshooting adicional

### WebMvcTest não encontra o advice

Confirme component scan ou use `@Import`.

Não duplique dois handlers para a mesma exception.

### WebMvcTest tenta carregar repository

O controller deve depender do application service.

Use `@MockitoBean` para o service.

### DataJpaTest tenta usar banco embutido

Confirme Testcontainers, ServiceConnection e configuração de teste.

Não adicione H2 para contornar o problema.

### Flyway não aplica V6 e V7

Revise o profile de teste e o location das migrations.

Mantenha `ddl-auto=validate`.

### Version continua zero após update no teste

Force flush e refresh antes da assertion.

### Teste HTTP fica 429

Desabilite rate limiting no profile de teste ou use IDs de cliente isolados.

A suíte de OS não está testando Redis.

### OpenAPI não mostra If-Match

Adicione annotation de header na operação.

Confirme o JSON em `/v3/api-docs`.

### Collection envia ETag sem aspas

Salve o header completo.

Não faça parse para número.

---

## Perguntas de revisão

1. Por que separar tipos de teste?
2. Domínio precisa de Spring?
3. O que o service test controla?
4. O que WebMvcTest prova?
5. O que DataJpaTest prova?
6. Por que PostgreSQL real?
7. O que ServiceConnection faz?
8. Integração usa mock do service?
9. Por que limpar banco?
10. Por que evitar Transactional no teste HTTP?
11. O que deve ser testado no ETag?
12. OpenAPI substitui teste?
13. Collection substitui teste automatizado?
14. Qual variável guarda ETag?
15. O que service-orders.md explica?
16. Cobertura de linhas prova qualidade?
17. Qual é o gate final?
18. O projeto API OS terminou?
19. Qual é a próxima aula?
20. O módulo termina na 409?

---

## Roteiro de resposta

1. Para isolar responsabilidades e falhas.
2. Não.
3. Mocks, ID, tempo e coordenação.
4. Contrato Spring MVC.
5. JPA, migrations e repository.
6. Para refletir o banco real.
7. Fornece connection details ao Boot.
8. Não.
9. Para independência entre cenários.
10. Porque as transações da aplicação são separadas.
11. Header, version e If-Match.
12. Não.
13. Não.
14. `serviceOrderEtag`.
15. Modelo, endpoints, regras, filtros e erros.
16. Não.
17. `mvnw clean verify`.
18. Sim.
19. Revisão técnica Spring Boot APIs.
20. Não, o fechamento é na 410.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 408 - M14.53 - Projeto API OS parte 4 testes e documentacao

- Continuei no projeto `formacao-java-backend-api`.
- Consolidei o projeto guiado de Ordem de Serviço.
- Organizei a suíte por responsabilidade.
- Mantive domínio e validators sem Spring.
- Criei fixture reutilizável de OS.
- Usei ID e tempo fixos nos testes.
- Completei testes de transição.
- Completei testes de update e delete por estado.
- Completei testes de validação.
- Criei testes do application service com Mockito.
- Testei geração de ID e uso do Clock.
- Testei version mismatch.
- Testei flush e optimistic locking.
- Criei testes de controller com `@WebMvcTest`.
- Usei `@MockitoBean` para o application service.
- Testei status, JSON, Location e ETag.
- Testei 409, 412 e 428.
- Criei configuração compartilhada de PostgreSQL Testcontainers.
- Usei `@ServiceConnection`.
- Criei testes de repository com PostgreSQL real.
- Não usei H2.
- Testei migrations, JPA, Specifications e paginação.
- Criei integração HTTP com `@SpringBootTest` e MockMvc.
- Não usei mock do service na integração.
- Limpei o banco explicitamente.
- Não usei `@Transactional` na classe de integração.
- Testei create, get, update, stale ETag, transições, busca e delete.
- Criei teste do OpenAPI.
- Documentei paths, responses, ETag e If-Match.
- Adicionei o folder Service Orders à collection.
- Encadeei ID e ETag.
- Executei o runner três vezes.
- Criei `docs/api/service-orders.md`.
- Documentei modelo, transições, filtros, concorrência e erros.
- Atualizei o README técnico.
- Executei `clean verify`.
- Não antecipei a revisão técnica ampla.
- Próxima aula: Revisão técnica Spring Boot APIs.
```

---

## Referência técnica curta

- [Spring Boot — Testing](https://docs.spring.io/spring-boot/reference/testing/)
- [Spring Boot — Testing Spring Boot Applications](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Spring Boot — Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [Spring Framework — MockMvc](https://docs.spring.io/spring-framework/reference/testing/mockmvc.html)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/)
- [springdoc-openapi](https://springdoc.org/)

Regra final:

```text
a consolidação da API OS precisa provar regras em testes rápidos, persistência no PostgreSQL real, contrato HTTP com MockMvc, integração das camadas sem mocks, documentação OpenAPI verificável e fluxos manuais reproduzíveis; nesta baseline, cada teste possui responsabilidade clara, Testcontainers executa migrations e Specifications, ETag e If-Match fazem parte das assertions, a collection encadeia versões e service-orders.md registra o contrato e seus limites.
```
