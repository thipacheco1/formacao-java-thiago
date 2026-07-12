# 440 - M15.30 - Protecao contra mass assignment

## Apresentação da aula

Na aula 439, o backend ganhou rate limiting específico para operações sensíveis.

A proteção passou a combinar:

```text
login:
rede + falhas por identidade.

refresh:
rede + fingerprint.

privacy request:
usuário + tenant.

privacy export:
usuário + tenant.
```

Redis e Lua mantiveram as decisões distribuídas.

As keys deixaram de expor:

- username;
- endereço IP;
- refresh token;
- user ID;
- tenant ID.

O contrato público passou a usar:

```text
429 Too Many Requests;

Retry-After;

Problem Details;

Cache-Control: no-store.
```

Essa defesa reduz abuso volumétrico.

Ela não impede um request isolado de enviar campos que o cliente não deveria controlar.

Considere uma criação legítima de Ordem de Serviço:

```json
{
  "customerName": "Cliente Alpha",
  "serviceType": "INSTALLATION",
  "description": "Instalação do equipamento",
  "serviceAddress": "Rua de Exemplo, 100",
  "scheduledFor": "2026-07-15T14:00:00-03:00"
}
```

Agora considere um payload malicioso:

```json
{
  "customerName": "Cliente Alpha",
  "serviceType": "INSTALLATION",
  "description": "Instalação do equipamento",
  "serviceAddress": "Rua de Exemplo, 100",
  "scheduledFor": "2026-07-15T14:00:00-03:00",
  "tenantId": "20000000-0000-0000-0000-000000000002",
  "ownerUserId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "status": "COMPLETED",
  "version": 999,
  "createdAt": "2020-01-01T00:00:00Z",
  "authorities": [
    "tenant:access:all",
    "service-order:delete"
  ]
}
```

Se o framework ou o mapper copiar automaticamente propriedades compatíveis, o atacante pode tentar alterar:

- tenant;
- proprietário;
- status;
- versão otimista;
- datas de auditoria;
- permissions;
- flags internas;
- identificadores;
- relacionamentos.

Essa classe de vulnerabilidade é conhecida como:

```text
mass assignment.
```

Também aparece com nomes como:

```text
automatic binding abuse;

over-posting;

unsafe object binding.
```

A pergunta central desta aula será:

```text
como garantir que cada endpoint
aceite somente os campos
explicitamente previstos
para aquela operação,
mesmo quando o JSON contém
propriedades extras,
aninhadas ou com nomes
de campos internos?
```

A resposta não será uma única annotation.

A defesa será composta por:

1. DTOs de entrada dedicados;
2. entidades fora do binding HTTP;
3. comandos de aplicação mínimos;
4. mapeamento explícito;
5. rejeição de propriedades desconhecidas;
6. ausência de setters sensíveis;
7. invariantes no aggregate;
8. autorização antes da mutação;
9. constraints no banco;
10. testes negativos;
11. OpenAPI coerente;
12. policy tests no repositório.

A regra será:

```text
o cliente informa intenção;

o servidor deriva contexto,
identidade, tenant,
owner, status, versão
e auditoria.
```

A aplicação não aceitará entidades JPA em:

```java
@RequestBody
```

Também não usará:

```java
BeanUtils.copyProperties(...);

ObjectMapper.convertValue(...);

ModelMapper.map(...);

reflection genérica;

Map<String, Object>
como request de atualização.
```

DTOs de criação, atualização e transição de status serão separados.

Exemplo:

```text
CreateServiceOrderRequest:
campos necessários para criar.

UpdateServiceOrderRequest:
campos editáveis por PUT.

TransitionServiceOrderStatusRequest:
somente próximo status.

ServiceOrder:
estado interno completo.
```

Propriedades desconhecidas serão rejeitadas com:

```text
400 Bad Request;

code:
unknown_request_property.
```

Essa decisão torna tentativas visíveis.

Ignorar silenciosamente um campo como `tenantId` poderia preservar a segurança do estado, mas esconderia:

- cliente desatualizado;
- contrato incorreto;
- ataque;
- erro de integração;
- divergência entre OpenAPI e runtime.

Mesmo assim, rejeitar unknown fields não basta.

Se um campo perigoso fizer parte do DTO, ele será conhecido.

Por isso, a defesa principal continua sendo:

```text
DTO allowlist por operação.
```

A próxima aula será:

```text
441 - M15.31 - Seguranca em DTOs e logs
```

Nela, a formação aprofundará classificação de DTOs, serialização de responses, mascaramento, limites de campos, `toString`, exceptions e proteção de logs.

---

## Onde estamos na formação

A sequência oficial é:

```text
438:
LGPD para backend.

439:
Rate limiting seguranca.

440:
Protecao contra mass assignment.

441:
Seguranca em DTOs e logs.

442:
Vulnerabilidades em dependencias.

443:
SAST e analise estatica.
```

A aula 439 respondeu:

```text
quantas vezes uma operação
sensível pode ser tentada?
```

A aula 440 responderá:

```text
quais propriedades
uma tentativa autorizada
pode controlar?
```

Nesta aula:

```text
DTOs dedicados:
sim.

allowlist:
sim.

unknown properties:
rejeitadas.

entity binding:
proibido.

mappers explícitos:
sim.

tenant derivado:
sim.

owner derivado:
sim.

status protegido:
sim.

version protegida:
sim.

auditoria protegida:
sim.

JSON malicioso:
testado.

logs profundos:
próxima aula.

dependências:
aula 442.
```

A regra central será:

```text
um endpoint não atualiza
um objeto genérico;

ele executa
uma operação explícita
com campos explícitos.
```

---

## Objetivo prático

Ao final da aula, o projeto terá DTOs separados:

```text
web/v2/serviceorder/
├── CreateServiceOrderRequest.java
├── UpdateServiceOrderRequest.java
├── TransitionServiceOrderStatusRequest.java
└── ServiceOrderRequestMapper.java
```

Configuração:

```text
configuration/json/
├── StrictRequestJsonConfiguration.java
└── RequestPayloadProblemHandler.java
```

Exceptions:

```text
web/error/
├── UnknownRequestPropertyException.java
└── InvalidRequestPayloadException.java
```

Testes:

```text
ServiceOrderMassAssignmentIntegrationTest;

ServiceOrderRequestMapperTest;

StrictRequestJsonIntegrationTest;

MassAssignmentRepositoryPolicyTest;

UserAuthorityMassAssignmentTest.
```

Documentação:

```text
docs/security/
├── M15_MASS_ASSIGNMENT_PROTECTION.md
└── M15_SERVER_CONTROLLED_FIELDS.md
```

OpenAPI e collections receberão cenários negativos.

Você irá:

1. definir mass assignment;
2. mapear campos controlados pelo servidor;
3. remover entity binding;
4. criar DTO de criação;
5. criar DTO de atualização;
6. criar DTO de status;
7. separar commands;
8. criar mapper explícito;
9. habilitar rejeição de unknown fields;
10. padronizar `400`;
11. proteger nested objects;
12. proteger identidade;
13. proteger tenant;
14. proteger ownership;
15. proteger status;
16. proteger version;
17. proteger audit fields;
18. testar payloads maliciosos;
19. criar policy test;
20. preparar segurança aprofundada de DTOs e logs.

---

## Conceito essencial

### Mass assignment

Mass assignment ocorre quando input externo é associado automaticamente a propriedades de um objeto sem uma allowlist adequada.

O problema não é apenas desserializar JSON.

Ele surge quando existe um caminho como:

```text
request;

binding automático;

objeto rico;

persistência.
```

Quanto mais a estrutura externa se parece com a entidade, maior o risco de propriedades internas serem alteradas.

---

### DTO não é entidade

Entidade representa estado e comportamento do domínio.

DTO de request representa uma intenção externa específica.

A entidade `ServiceOrder` possui:

- `id`;
- `tenantId`;
- `ownerUserId`;
- `status`;
- `version`;
- `createdAt`;
- `updatedAt`;
- campos editáveis.

O request de criação não precisa controlar todos eles.

Reutilizar a entidade como request transforma toda propriedade bindable em superfície de ataque.

---

### Allowlist vence denylist

Uma denylist tentaria proibir:

```text
tenantId;

ownerUserId;

status;

version.
```

Quando um novo campo interno fosse adicionado, ele poderia ficar desprotegido.

A allowlist define somente:

```text
customerName;

serviceType;

description;

serviceAddress;

scheduledFor.
```

Campos novos não entram automaticamente.

Essa propriedade torna a solução mais segura diante da evolução.

---

### DTO por operação

Create, update e status possuem intenções diferentes.

Não use um DTO universal com dezenas de campos opcionais.

Exemplo inseguro:

```java
record ServiceOrderRequest(
        UUID id,
        UUID tenantId,
        UUID ownerUserId,
        ServiceOrderStatus status,
        Long version,
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor
) {
}
```

O fato de um campo ser nullable não o torna seguro.

---

### Campos controlados pelo servidor

A baseline classifica como server-controlled:

```text
id;

tenantId;

ownerUserId;

status inicial;

version;

createdAt;

updatedAt;

createdBy;

lastModifiedBy;

deleted;

internal flags;

permissions;

authorities;

audit metadata.
```

Alguns podem mudar por endpoints específicos.

Isso não significa que podem ser enviados em qualquer request.

---

### Status usa operação própria

Status é alterado por:

```text
PATCH /service-orders/{id}/status
```

com um DTO que contém somente:

```text
targetStatus.
```

O fluxo executa máquina de estados, permission, tenant, ownership, ETag e auditoria.

Adicionar `status` ao PUT contornaria essa semântica.

---

### Version não vem do JSON

A concorrência usa:

```http
If-Match: "7"
```

A version esperada é derivada do header validado.

O body não contém `version`.

Isso evita duas fontes concorrentes para o mesmo controle.

---

### Tenant e owner são derivados

Tenant vem de:

```text
TenantContext.
```

Owner vem de:

```text
usuário autenticado
ou regra explícita do servidor.
```

Nenhum deles vem do JSON.

Mesmo um administrador não envia esses campos em endpoints comuns.

Uma futura transferência de ownership exigiria:

- endpoint próprio;
- permission própria;
- regra de negócio;
- auditoria;
- testes.

---

### Unknown property rejection

O parser deve falhar quando encontra propriedade não mapeada.

A configuração será explícita.

Não dependa do default da versão do framework.

Também proíba nos request DTOs:

```java
@JsonIgnoreProperties(
    ignoreUnknown = true
)
```

e:

```java
@JsonAnySetter
```

Esses recursos transformariam propriedades inesperadas em input silenciosamente aceito.

---

### Rejeição não substitui DTO mínimo

Se `ownerUserId` existir no DTO, não será unknown.

Por isso:

```text
unknown rejection:
defesa complementar.

DTO mínimo:
defesa principal.
```

As duas trabalham juntas.

---

### Mapeamento explícito

O mapper deve construir o command campo a campo.

Exemplo:

```java
new CreateServiceOrderCommand(
    request.customerName(),
    request.serviceType(),
    request.description(),
    request.serviceAddress(),
    request.scheduledFor()
);
```

Não copie propriedades por nome.

O código repetitivo aqui é uma característica de segurança e legibilidade.

---

### Aggregate protege invariantes

Mesmo com DTO seguro, a entidade não expõe setters para:

- tenant;
- owner;
- version;
- timestamps;
- status arbitrário.

Use factories e métodos de domínio.

Exemplo:

```text
create(...):
status OPEN.

transitionTo(...):
valida transição.

updateDetails(...):
altera somente dados editáveis.
```

---

### JPA como defesa em profundidade

Anotações como:

```java
@Column(
    updatable = false
)
```

podem proteger tenant, owner e createdAt contra updates acidentais.

Elas não substituem a camada HTTP e o domínio.

O valor ainda poderia ser usado incorretamente na criação.

---

### Request params e form binding

`@RequestBody` JSON é desserializado pelo Jackson.

`@ModelAttribute` e forms usam data binding do Spring.

Se o projeto adicionar binding por propriedades, utilize:

```java
binder.setAllowedFields(...);
```

em um modelo dedicado.

Não faça binding de parâmetros diretamente na entidade.

A API atual continuará preferindo DTOs e parâmetros explícitos.

---

### Nested object injection

Payload inseguro:

```json
{
  "customer": {
    "id": "uuid",
    "tenantId": "outro-tenant",
    "creditLimit": 999999
  }
}
```

Quando a operação precisa apenas de um identificador, receba:

```text
customerId.
```

Depois:

1. carregue o recurso no tenant;
2. autorize;
3. valide estado;
4. associe a entidade carregada.

Não aceite um aggregate aninhado controlado pelo cliente.

---

### Map e patch genérico

Evite:

```java
Map<String, Object> changes;
```

e:

```text
for each field:
set by reflection.
```

Esse padrão transfere ao atacante a escolha das propriedades.

PATCH precisa possuir semântica explícita.

A API já usa um endpoint dedicado para status.

Outros patches futuros terão DTOs próprios.

---

### Autorização continua necessária

Um DTO seguro não concede direito à operação.

A ordem permanece:

```text
authentication;

rate limiting;

tenant;

permission;

ownership;

ETag;

validation;

domain mutation;

persistence;

audit.
```

Mass assignment protection limita campos.

Ela não substitui autorização.

---

### Responses também precisam de DTO

Não serializar entidade evita expor:

- version interna além do contrato;
- owner;
- tenant;
- campos futuros;
- relações lazy;
- audit metadata.

A próxima aula aprofundará responses e logs.

Nesta aula, o princípio já fica registrado:

```text
entity não entra;
entity não sai.
```

---

## Mão na massa guiada

### 1. Inventariar campos controlados

Crie:

```text
docs/security/M15_SERVER_CONTROLLED_FIELDS.md
```

Tabela inicial:

| Recurso | Campo | Fonte | Operação autorizada |
|---|---|---|---|
| ServiceOrder | id | servidor | nunca pelo body |
| ServiceOrder | tenantId | TenantContext | nunca pelo body |
| ServiceOrder | ownerUserId | Authentication | futura transferência dedicada |
| ServiceOrder | status | máquina de estados | PATCH status |
| ServiceOrder | version | JPA/ETag | If-Match |
| ServiceOrder | createdAt | Clock | nunca pelo body |
| ServiceOrder | updatedAt | Clock | mutações do domínio |
| User | authorities | serviço administrativo | endpoint dedicado |
| AuditEvent | actor/tenant | contexto | somente recorder |

---

### 2. Criar CreateServiceOrderRequest

```java
public record CreateServiceOrderRequest(
        @NotBlank
        @Size(max = 160)
        String customerName,

        @NotBlank
        @Size(max = 80)
        String serviceType,

        @Size(max = 2_000)
        String description,

        @NotBlank
        @Size(max = 300)
        String serviceAddress,

        @NotNull
        @Future
        OffsetDateTime scheduledFor
) {
}
```

O DTO não possui:

- ID;
- tenant;
- owner;
- status;
- version;
- timestamps.

---

### 3. Criar UpdateServiceOrderRequest

```java
public record UpdateServiceOrderRequest(
        @NotBlank
        @Size(max = 160)
        String customerName,

        @NotBlank
        @Size(max = 80)
        String serviceType,

        @Size(max = 2_000)
        String description,

        @NotBlank
        @Size(max = 300)
        String serviceAddress,

        @NotNull
        @Future
        OffsetDateTime scheduledFor
) {
}
```

PUT continua representando a atualização completa dos detalhes editáveis.

Status permanece fora.

---

### 4. Criar TransitionServiceOrderStatusRequest

```java
public record TransitionServiceOrderStatusRequest(
        @NotNull
        ServiceOrderStatus targetStatus
) {
}
```

Use o nome `targetStatus` para deixar clara a intenção.

A entity valida se a transição é permitida.

---

### 5. Atualizar os controllers

Create:

```java
@PostMapping
ResponseEntity<ServiceOrderResponse> create(
        Authentication authentication,
        TenantContext tenant,
        @Valid
        @RequestBody
        CreateServiceOrderRequest request
) {
    CreateServiceOrderCommand command =
            mapper.toCreateCommand(
                    request
            );

    ServiceOrderResult result =
            service.create(
                    authentication,
                    tenant,
                    command
            );

    return createdResponse(result);
}
```

O controller nunca recebe `ServiceOrder`.

---

### 6. Atualizar o PUT

```java
@PutMapping("/{serviceOrderId}")
ResponseEntity<ServiceOrderResponse> update(
        Authentication authentication,
        TenantContext tenant,
        @PathVariable
        UUID serviceOrderId,
        @RequestHeader(HttpHeaders.IF_MATCH)
        String ifMatch,
        @Valid
        @RequestBody
        UpdateServiceOrderRequest request
) {
    long expectedVersion =
            etagParser.requireVersion(
                    ifMatch
            );

    UpdateServiceOrderCommand command =
            mapper.toUpdateCommand(
                    request
            );

    return ResponseEntity.ok(
            mapper.toResponse(
                service.update(
                    authentication,
                    tenant,
                    serviceOrderId,
                    expectedVersion,
                    command
                )
            )
    );
}
```

A version vem somente do `If-Match`.

---

### 7. Atualizar o PATCH de status

```java
@PatchMapping(
    "/{serviceOrderId}/status"
)
ResponseEntity<ServiceOrderResponse>
transitionStatus(
        Authentication authentication,
        TenantContext tenant,
        @PathVariable
        UUID serviceOrderId,
        @RequestHeader(HttpHeaders.IF_MATCH)
        String ifMatch,
        @Valid
        @RequestBody
        TransitionServiceOrderStatusRequest request
) {
    return ResponseEntity.ok(
        mapper.toResponse(
            service.transitionStatus(
                authentication,
                tenant,
                serviceOrderId,
                etagParser.requireVersion(
                    ifMatch
                ),
                new TransitionServiceOrderStatusCommand(
                    request.targetStatus()
                )
            )
        )
    );
}
```

Nenhum outro campo é aceito.

---

### 8. Criar mapper explícito

```java
@Component
public class ServiceOrderRequestMapper {

    public CreateServiceOrderCommand
    toCreateCommand(
            CreateServiceOrderRequest request
    ) {
        return new CreateServiceOrderCommand(
                request.customerName(),
                request.serviceType(),
                request.description(),
                request.serviceAddress(),
                request.scheduledFor()
        );
    }

    public UpdateServiceOrderCommand
    toUpdateCommand(
            UpdateServiceOrderRequest request
    ) {
        return new UpdateServiceOrderCommand(
                request.customerName(),
                request.serviceType(),
                request.description(),
                request.serviceAddress(),
                request.scheduledFor()
        );
    }
}
```

Não injete `Authentication` no mapper.

Contexto não é campo de request.

---

### 9. Configurar JSON estrito

No profile principal da API:

```yaml
spring:
  jackson:
    deserialization:
      fail-on-unknown-properties: true
```

Além disso, crie um teste que inspeciona o `ObjectMapper`.

Não dependa apenas do arquivo YAML.

---

### 10. Criar StrictRequestJsonConfiguration

```java
@Configuration
public class StrictRequestJsonConfiguration {

    @Bean
    Jackson2ObjectMapperBuilderCustomizer
    rejectUnknownRequestProperties() {
        return builder ->
                builder.featuresToEnable(
                    DeserializationFeature
                        .FAIL_ON_UNKNOWN_PROPERTIES
                );
    }
}
```

Se o projeto possui múltiplos `ObjectMapper`, documente quais processam requests.

Não crie um mapper permissivo no controller.

---

### 11. Padronizar unknown property

No `ApiExceptionHandler`:

```java
@ExceptionHandler(
    HttpMessageNotReadableException.class
)
ResponseEntity<ProblemDetail>
handleUnreadableMessage(
        HttpMessageNotReadableException exception,
        HttpServletRequest request
) {
    Throwable cause =
            NestedExceptionUtils
                    .getMostSpecificCause(
                        exception
                    );

    if (
        cause instanceof
            UnrecognizedPropertyException
    ) {
        return unknownProperty(
                request
        );
    }

    return invalidPayload(
            request
    );
}
```

Não devolva o payload.

---

### 12. Criar o Problem Details

Unknown:

```text
status:
400.

type:
urn:problem:unknown-request-property.

title:
Invalid request payload.

detail:
The request contains an unsupported property.

code:
unknown_request_property.
```

Malformed JSON:

```text
code:
invalid_request_payload.
```

Ambos usam `no-store`.

---

### 13. Não refletir o nome bruto

O nome da propriedade é input do atacante.

Não o copie diretamente para:

- detail;
- log;
- metric label;
- audit reason;
- exception message pública.

Internamente, um nome sanitizado e limitado pode ser usado em debugging controlado.

A baseline registra somente o code.

---

### 14. Reforçar o aggregate

A factory:

```java
public static ServiceOrder create(
        UUID tenantId,
        UUID ownerUserId,
        CreateServiceOrderCommand command,
        Instant now
) {
    ServiceOrder order =
            new ServiceOrder();

    order.id =
            UUID.randomUUID();

    order.tenantId =
            requireTenant(
                    tenantId
            );

    order.ownerUserId =
            requireOwner(
                    ownerUserId
            );

    order.status =
            ServiceOrderStatus.OPEN;

    order.applyDetails(
            command
    );

    order.createdAt = now;
    order.updatedAt = now;

    return order;
}
```

Não receba status ou version.

---

### 15. Atualizar detalhes por método

```java
public void updateDetails(
        UpdateServiceOrderCommand command,
        Instant now
) {
    requireEditableStatus();

    this.customerName =
            normalizeCustomerName(
                    command.customerName()
            );

    this.serviceType =
            normalizeServiceType(
                    command.serviceType()
            );

    this.description =
            normalizeDescription(
                    command.description()
            );

    this.serviceAddress =
            normalizeAddress(
                    command.serviceAddress()
            );

    this.scheduledFor =
            requireFutureSchedule(
                    command.scheduledFor(),
                    now
            );

    this.updatedAt = now;
}
```

O método não toca em tenant, owner ou status.

---

### 16. Aplicar JPA defense-in-depth

```java
@Column(
    name = "tenant_id",
    nullable = false,
    updatable = false
)
private UUID tenantId;
```

```java
@Column(
    name = "owner_user_id",
    updatable = false
)
private UUID ownerUserId;
```

```java
@Column(
    name = "created_at",
    nullable = false,
    updatable = false
)
private Instant createdAt;
```

Uma futura transferência de owner exigirá revisão dessa decisão.

---

### 17. Proibir setters sensíveis

A entity não possui:

```text
setTenantId;

setOwnerUserId;

setVersion;

setCreatedAt;

setAuthorities;

setPermissions.
```

Se Lombok estiver presente, não use:

```java
@Data
```

em entities ou requests de segurança.

---

### 18. Proteger usuário e authorities

Crie uma demonstração com DTO de profile:

```java
public record UpdateUserProfileRequest(
        @NotBlank
        @Size(max = 120)
        String displayName
) {
}
```

Ele não possui:

- enabled;
- locked;
- roles;
- authorities;
- tenant memberships.

Mudança de authority pertence a serviço administrativo separado.

---

### 19. Proibir qualquer setter JSON

Request DTOs não podem usar:

```java
@JsonAnySetter
```

Crie `MassAssignmentRepositoryPolicyTest` que procura a annotation em packages de request.

Também proíba:

```java
@JsonIgnoreProperties(
    ignoreUnknown = true
)
```

nesses DTOs.

---

### 20. Proibir mappers genéricos

O policy test procura:

```text
BeanUtils.copyProperties;

ObjectMapper.convertValue;

ModelMapper;

setAccessible(true);

Map<String, Object>
em update requests.
```

Permita usos documentados fora do fluxo HTTP somente após revisão.

---

### 21. Testar criação válida

Envie somente os campos permitidos.

Valide no banco:

```text
tenant:
TenantContext.

owner:
usuário autenticado.

status:
OPEN.

version:
valor inicial da JPA.

createdAt:
Clock do servidor.

updatedAt:
Clock do servidor.
```

Nenhum valor vem do body.

---

### 22. Testar tenantId malicioso

Payload:

```json
{
  "customerName": "Cliente",
  "serviceType": "INSTALLATION",
  "serviceAddress": "Rua A",
  "scheduledFor": "2026-07-15T14:00:00-03:00",
  "tenantId": "20000000-0000-0000-0000-000000000002"
}
```

Esperado:

```text
400;

unknown_request_property;

nenhuma OS persistida.
```

---

### 23. Testar ownerUserId malicioso

Use um owner de outro usuário.

Esperado:

```text
400;

nenhuma consulta para transferir owner;

nenhum audit de criação.
```

A request falha antes da camada de aplicação.

---

### 24. Testar status e version

Inclua:

```json
{
  "status": "COMPLETED",
  "version": 999
}
```

Tanto no create quanto no PUT.

Esperado:

```text
400.
```

No PATCH status, inclua `version` no body.

Também retorna `400`.

A version continua no `If-Match`.

---

### 25. Testar datas de auditoria

Inclua:

```json
{
  "createdAt": "2020-01-01T00:00:00Z",
  "updatedAt": "2030-01-01T00:00:00Z"
}
```

Valide:

```text
400;

nenhuma mutação.
```

---

### 26. Testar authorities

No update de profile, envie:

```json
{
  "displayName": "Novo Nome",
  "authorities": [
    "tenant:access:all"
  ],
  "enabled": true
}
```

Esperado:

```text
400;

authorities inalteradas;

enabled inalterado.
```

---

### 27. Testar nested object

Envie:

```json
{
  "customerName": "Cliente",
  "serviceType": "INSTALLATION",
  "serviceAddress": "Rua A",
  "scheduledFor": "2026-07-15T14:00:00-03:00",
  "owner": {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "authorities": [
      "service-order:delete"
    ]
  }
}
```

Esperado:

```text
400.
```

Não faça flatten automático.

---

### 28. Testar casing alternativo

Envie:

```json
{
  "TenantId": "uuid",
  "OWNERUSERID": "uuid"
}
```

A aplicação não deve habilitar:

```text
case-insensitive properties.
```

Esperado:

```text
400.
```

---

### 29. Testar properties antes e depois

Crie payloads em que a propriedade maliciosa aparece:

- antes dos campos válidos;
- no meio;
- no final.

Todos falham.

A ordem do JSON não altera a policy.

---

### 30. Testar malformed JSON

Exemplos:

```text
chave sem aspas;

vírgula extra;

tipo incompatível;

array no lugar de objeto.
```

Esperado:

```text
400 invalid_request_payload.
```

Não use `unknown_request_property` para todos os erros.

---

### 31. Testar ausência de side effects

Para cada payload rejeitado, valide:

- repository não salva;
- audit de sucesso não grava;
- cache não invalida;
- evento não publica;
- e-mail não envia;
- rate limit já pode ter sido consumido conforme a ordem;
- correlation ID permanece na response.

---

### 32. Criar ServiceOrderRequestMapperTest

Valide que o mapper transfere exatamente:

```text
customerName;

serviceType;

description;

serviceAddress;

scheduledFor.
```

Use reflection no command para garantir que ele não ganha campos server-controlled sem revisão.

Se o command mudar, o teste força decisão explícita.

---

### 33. Criar StrictRequestJsonIntegrationTest

Valide:

```text
unknown field:
400.

known fields:
sucesso.

ignoreUnknown annotation:
ausente.

global mapper:
FAIL_ON_UNKNOWN_PROPERTIES ativo.
```

Não dependa somente de um teste de controller.

---

### 34. Criar MassAssignmentRepositoryPolicyTest

Escaneie `src/main/java`.

Falhe quando encontrar:

```text
@RequestBody ServiceOrder;

@RequestBody ApplicationUser;

BeanUtils.copyProperties;

ObjectMapper.convertValue;

@JsonAnySetter
em requests;

ignoreUnknown = true
em requests;

Map<String, Object>
em update DTO.
```

Esse teste é guardrail, não prova formal.

---

### 35. Atualizar OpenAPI

Schemas de request devem listar somente os campos permitidos.

Documente:

```text
additional properties:
not accepted.
```

Não confie apenas no OpenAPI.

O runtime e os testes continuam sendo a defesa.

Separe schemas:

```text
CreateServiceOrderRequest;

UpdateServiceOrderRequest;

TransitionServiceOrderStatusRequest.
```

---

### 36. Atualizar Postman e Insomnia

Adicione cenários:

- create válido;
- create com tenant;
- create com owner;
- create com status;
- update com version;
- status com owner;
- profile com authorities;
- nested injection;
- unknown casing;
- malformed JSON.

Teste:

```text
status;

code;

content type;

ausência de side effects.
```

---

### 37. Métricas e auditoria

Métrica:

```text
http_request_payload_rejected_total
```

Labels permitidas:

```text
endpoint template;

reason code.
```

Não use:

- propriedade recebida;
- payload;
- username;
- tenant ID;
- user ID.

Evento opcional e amostrado:

```text
MASS_ASSIGNMENT_ATTEMPT_REJECTED.
```

Registre:

- endpoint;
- actor quando autenticado;
- tenant validado;
- correlation ID;
- reason code.

Não registre a propriedade raw.

---

### 38. Atualizar o threat model

Adicione:

```text
THR-205:
entity é usada como request body.

THR-206:
tenant é alterado por JSON.

THR-207:
owner é alterado por JSON.

THR-208:
status contorna máquina de estados.

THR-209:
version do body contorna ETag.

THR-210:
audit fields são forjados.

THR-211:
authorities entram em profile update.

THR-212:
mapper copia propriedades por nome.

THR-213:
unknown fields são ignorados.

THR-214:
nested aggregate é desserializado.

THR-215:
patch genérico usa reflection.

THR-216:
response serializa entity futura.
```

Controles:

- DTOs dedicados;
- allowlist;
- derivação no servidor;
- operation-specific endpoint;
- `If-Match`;
- Clock;
- service administrativo;
- mapper explícito;
- strict JSON;
- scalar reference;
- policy test;
- response DTO.

---

### 39. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
tenant e owner:
controlados pelo servidor.

authorities:
endpoint dedicado.
```

A04 Insecure Design:

```text
DTO por operação;

aggregate invariants;

allowlist.
```

A05 Security Misconfiguration:

```text
unknown properties:
rejeitadas explicitamente.

case-insensitive binding:
não habilitado.
```

Baseline:

```text
entity request binding:
proibido.

generic copy:
proibida.

request DTO:
mínimo.

unknown property:
400.

tenant:
TenantContext.

owner:
Authentication.

status:
state transition.

version:
If-Match.

audit:
Clock e recorder.

produção pública:
NO-GO.
```

---

### 40. Criar o documento principal

Arquivo:

```text
docs/security/M15_MASS_ASSIGNMENT_PROTECTION.md
```

Inclua:

```markdown
# Protecao contra mass assignment

## Principio

Input externo usa allowlist.

## Requests

- Create DTO.
- Update DTO.
- Status DTO.
- Profile DTO.

## Campos do servidor

- id.
- tenant.
- owner.
- status inicial.
- version.
- timestamps.
- authorities.
- audit.

## Binding

- entity nunca recebe request.
- unknown properties falham.
- JsonAnySetter proibido.
- ignoreUnknown proibido.

## Mapping

- campo a campo.
- sem reflection.
- sem BeanUtils.
- sem convertValue.

## Defesa em profundidade

- aggregate.
- JPA.
- authorization.
- database.
- tests.
```

---

### 41. Executar o gate

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderMassAssignmentIntegrationTest,ServiceOrderRequestMapperTest,StrictRequestJsonIntegrationTest,MassAssignmentRepositoryPolicyTest,UserAuthorityMassAssignmentTest `
  test
```

Suítes anteriores:

```powershell
.\mvnw.cmd `
  -Dtest=TenantIsolationIntegrationTest,ServiceOrderBusinessAuthorizationIntegrationTest,RedisSecurityRateLimiterIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Revise:

```powershell
git grep `
  -n `
  -E `
  "BeanUtils\\.copyProperties|convertValue|JsonAnySetter|ignoreUnknown *= *true"
```

Confirme:

- DTOs mínimos;
- mapper explícito;
- unknown property;
- malformed JSON;
- tenant;
- owner;
- status;
- version;
- timestamps;
- authorities;
- nested payload;
- no side effects;
- OpenAPI;
- collections;
- policy tests;
- nenhuma regressão.

---

## Entendendo o que foi feito

### O contrato de input ficou menor

Cada endpoint recebe somente os campos necessários.

### A entidade saiu da fronteira HTTP

Mudanças futuras na JPA não ampliam automaticamente a API.

### Unknown fields deixaram de ser silenciosos

Integrações incorretas e tentativas recebem `400`.

### Contexto continuou no servidor

Tenant, owner, version e audit não vêm do cliente.

### Status preservou sua máquina de estados

PUT não contorna a transição dedicada.

### O mapper ficou auditável

Cada linha mostra qual campo atravessa a fronteira.

### O domínio manteve invariantes

Mesmo uma chamada interna não possui setters sensíveis.

### Policy tests reduziram regressões

Padrões perigosos passam a falhar no build.

---

## Erros comuns importantes

### Usar entity como request

Toda propriedade bindable vira risco.

### Usar um DTO universal

Campos opcionais misturam operações e permissões.

### Criar denylist de quatro campos

O próximo campo interno pode ser esquecido.

### Ignorar unknown fields

Ataques e contratos incorretos ficam invisíveis.

### Usar BeanUtils

A correspondência por nome amplia o impacto de novos campos.

### Colocar status no PUT

A máquina de estados é contornada.

### Aceitar version no body e header

Duas fontes de verdade criam inconsistência.

### Usar Map para PATCH

O atacante escolhe as propriedades.

### Confiar apenas em @Column(updatable=false)

A criação e outras camadas ainda podem ser afetadas.

### Logar a propriedade maliciosa

Input do atacante pode causar exposição ou log injection.

---

## Comandos úteis

### Testes de mass assignment

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderMassAssignmentIntegrationTest,MassAssignmentRepositoryPolicyTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar entity binding

```powershell
git grep `
  -n `
  -E `
  "@RequestBody.*(ServiceOrder|ApplicationUser)"
```

### Procurar cópia genérica

```powershell
git grep `
  -n `
  -E `
  "BeanUtils\\.copyProperties|ObjectMapper.*convertValue|ModelMapper"
```

### Procurar binding permissivo

```powershell
git grep `
  -n `
  -E `
  "JsonAnySetter|ignoreUnknown *= *true"
```

---

## Exercício guiado

### Parte 1 — Inventário

Liste todos os campos controlados pelo servidor.

### Parte 2 — DTOs

Crie requests separados por operação.

### Parte 3 — Mapping

Converta campo a campo para commands.

### Parte 4 — JSON

Rejeite propriedades desconhecidas.

### Parte 5 — Domínio

Remova setters sensíveis.

### Parte 6 — Persistência

Aplique defesa em profundidade.

### Parte 7 — Ataques

Envie tenant, owner, status e version.

### Parte 8 — Side effects

Comprove que nenhum efeito ocorre após rejeição.

### Parte 9 — Guardrails

Crie policy test no repositório.

### Parte 10 — Contrato

Atualize OpenAPI, collections e documentação.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 439 foi preservada;
- mass assignment, over-posting e unsafe binding foram explicados;
- entity e DTO foram separados;
- allowlist foi preferida a denylist;
- DTOs de create, update, status e profile foram separados;
- campos server-controlled foram inventariados;
- tenant, owner, status, version e auditoria não vêm do body;
- controllers não recebem entities;
- commands contêm somente dados da operação;
- mapper explícito foi criado;
- BeanUtils, convertValue, ModelMapper e reflection foram proibidos;
- unknown properties são rejeitadas explicitamente;
- request DTOs não usam `JsonAnySetter`;
- request DTOs não ignoram unknown fields;
- `400 unknown_request_property` foi padronizado;
- malformed JSON possui code separado;
- payload e property raw não aparecem no erro;
- aggregate não expõe setters sensíveis;
- status usa máquina de estados;
- version usa `If-Match`;
- JPA foi usada como defesa em profundidade;
- nested aggregate não é aceito;
- patch genérico por Map foi proibido;
- criação válida deriva tenant, owner, status, version e timestamps;
- payloads com tenant, owner, status, version, audit e authorities foram testados;
- casing alternativo e ordem das propriedades foram testados;
- ausência de side effects foi validada;
- mapper e ObjectMapper foram testados;
- policy test foi criado;
- OpenAPI e collections foram atualizados;
- métricas e auditoria não recebem input raw;
- threat model e OWASP foram atualizados;
- segurança aprofundada de DTOs e logs não foi antecipada;
- produção pública permaneceu NO-GO;
- gate completo foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check

git grep `
  -n `
  -E `
  "BeanUtils\\.copyProperties|convertValue|JsonAnySetter|ignoreUnknown *= *true"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/security `
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
git commit -m "feat(m15): bloquear mass assignment nos requests"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- payload real de usuário;
- token;
- password;
- tenant de produção;
- owner real;
- dump de request;
- log com propriedade maliciosa;
- entity exposta como DTO;
- configuração permissiva temporária.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a fronteira HTTP passou a utilizar allowlists explícitas.

O fluxo ficou:

```text
JSON;

request DTO mínimo;

validation;

mapper explícito;

command;

tenant e identidade
derivados pelo servidor;

aggregate;

persistence;

audit.
```

O cliente não controla:

```text
id;

tenant;

owner;

status inicial;

version;

timestamps;

authorities;

audit fields.
```

Operações especiais possuem endpoints próprios:

```text
status:
transition endpoint.

version:
If-Match.

authorities:
serviço administrativo.

ownership:
futura operação dedicada.
```

A configuração estrita transforma propriedades extras em:

```text
400 unknown_request_property.
```

O domínio e a persistência adicionam defesa em profundidade.

A decisão central foi:

```text
segurança contra mass assignment
não consiste em esconder setters;

consiste em desenhar
uma allowlist por operação
e impedir qualquer caminho
genérico entre input externo
e estado interno.
```

A proteção de input está consolidada.

Ainda precisamos aprofundar a segurança dos objetos que atravessam a aplicação e da observabilidade que os registra.

A próxima aula será:

```text
441 - M15.31 - Seguranca em DTOs e logs
```

Nela, você irá:

- classificar request, command, result e response DTO;
- impedir vazamento de campos em responses;
- controlar `toString`;
- mascarar valores;
- limitar exception details;
- proteger logs estruturados;
- evitar PII em MDC;
- revisar serialização de Problem Details;
- testar sentinelas em logs;
- criar um catálogo de campos proibidos.

---

# Material complementar

## Checkpoint final

- [ ] Entidades não recebem request body.
- [ ] Cada operação possui DTO mínimo.
- [ ] Unknown fields retornam `400`.
- [ ] Tenant, owner, status e version vêm do servidor.
- [ ] Testes negativos comprovam ausência de side effects.

---

## Troubleshooting adicional

### Campo desconhecido é ignorado

Confirme a configuração do `ObjectMapper` efetivamente usado pelo MVC.

Procure outro mapper permissivo.

### Payload com tenant retorna sucesso

O request DTO provavelmente possui `tenantId` ou ignora unknown properties.

### Status muda pelo PUT

Remova status do DTO e do command de update.

### Version do body é usada

Mantenha somente o parser de `If-Match`.

### BeanUtils ainda aparece

Substitua por mapper explícito e adicione o padrão ao policy test.

### Teste falha ao adicionar campo legítimo

Decida em qual operação ele pertence, atualize DTO, command, mapper, OpenAPI e testes.

Não torne o mapper genérico.

### Unknown field retorna 500

Mapeie `HttpMessageNotReadableException` e `UnrecognizedPropertyException`.

### Response expõe tenant ou owner

Use response DTO dedicado; o aprofundamento será feito na aula 441.

---

## Perguntas de revisão

1. O que é mass assignment?
2. Qual outro nome comum?
3. Por que entidade não deve ser request?
4. Allowlist ou denylist?
5. Por que DTO por operação?
6. Quem define tenant?
7. Quem define owner?
8. Como status muda?
9. De onde vem version?
10. O que ocorre com unknown field?
11. Ignorar unknown é suficiente?
12. BeanUtils é permitido?
13. Map genérico é seguro para PATCH?
14. JPA substitui DTO seguro?
15. Nested aggregate deve ser aceito?
16. O que o mapper transfere?
17. O erro pode ecoar o payload?
18. O policy test prova tudo?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Binding indevido de propriedades externas.
2. Over-posting.
3. Porque contém estado interno.
4. Allowlist.
5. Para representar uma intenção específica.
6. TenantContext validado.
7. Identidade e regra do servidor.
8. Por endpoint e máquina de estados.
9. Do `If-Match`.
10. `400`.
11. Não; o DTO precisa ser mínimo.
12. Não.
13. Não.
14. Não.
15. Não.
16. Somente campos permitidos.
17. Não.
18. Não; é guardrail.
19. Seguranca em DTOs e logs.
20. Responses, serialização e observabilidade segura.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 440 - M15.30 - Protecao contra mass assignment

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini mass assignment, over-posting e unsafe binding.
- Diferenciei entidades e DTOs de entrada.
- Preferi allowlist a denylist.
- Criei DTOs separados para create, update e status.
- Criei um DTO de profile sem authorities.
- Inventariei campos controlados pelo servidor.
- Mantive ID, tenant, owner, status, version e timestamps fora dos bodies.
- Mantive authorities fora do profile update.
- Removi entity binding dos controllers.
- Criei commands mínimos.
- Criei mapper explícito campo a campo.
- Proibi BeanUtils, convertValue, ModelMapper e reflection genérica.
- Habilitei rejeição explícita de unknown properties.
- Proibi `JsonAnySetter` em requests.
- Proibi `ignoreUnknown=true` em requests.
- Criei Problem Details para unknown e malformed payload.
- Não expus payload ou property raw.
- Reforcei factories e métodos do aggregate.
- Removi setters sensíveis.
- Mantive status na máquina de estados.
- Mantive version no `If-Match`.
- Apliquei JPA como defesa em profundidade.
- Rejeitei nested aggregates e patches genéricos.
- Testei tenant, owner, status, version, timestamps e authorities.
- Testei casing e posição das propriedades.
- Validei ausência de persistência, audit e eventos após rejeição.
- Criei testes do mapper e do ObjectMapper.
- Criei `MassAssignmentRepositoryPolicyTest`.
- Atualizei OpenAPI e collections.
- Criei `M15_MASS_ASSIGNMENT_PROTECTION.md`.
- Criei `M15_SERVER_CONTROLLED_FIELDS.md`.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Seguranca em DTOs e logs.
```

---

## Referência técnica curta

- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Spring Framework — Data Binding](https://docs.spring.io/spring-framework/reference/core/validation/data-binding.html)
- [Spring Framework — WebDataBinder](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/WebDataBinder.html)
- [Jackson — DeserializationFeature](https://fasterxml.github.io/jackson-databind/javadoc/2.6/com/fasterxml/jackson/databind/DeserializationFeature.html)
- [MapStruct — Stable Reference Guide](https://mapstruct.org/documentation/stable/reference/html/)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

Regra final:

```text
proteção contra mass assignment exige uma allowlist explícita para cada operação: entidades não recebem request bodies, DTOs mínimos não contêm campos controlados pelo servidor, unknown properties falham, commands e mappers transferem somente dados autorizados, tenant e owner vêm do contexto, status passa pela máquina de estados, version vem do If-Match, auditoria vem do Clock e do recorder, e testes negativos comprovam que propriedades extras nunca produzem mutação ou efeitos colaterais.
```
