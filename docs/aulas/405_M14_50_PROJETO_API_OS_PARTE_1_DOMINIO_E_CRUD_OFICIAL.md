# 405 - M14.50 - Projeto API OS parte 1 dominio e CRUD

## Apresentação da aula

Na aula 404, você executou uma avaliação inicial de prontidão para produção.

A conclusão foi baseada em evidências:

```text
laboratório local controlado:
GO CONDICIONAL.

produção pública com dados reais:
NO-GO.
```

Aquela aula encerrou uma sequência importante do módulo:

```text
contrato REST;

testes;

observabilidade;

Docker;

Compose;

collection;

documentação;

auditoria;

prontidão.
```

Agora começa um projeto guiado dentro do próprio M14.

O objetivo é aplicar os conhecimentos anteriores em um novo domínio, sem apenas copiar a feature de mensagens já existente.

O domínio escolhido é:

```text
Ordem de Serviço.
```

Uma Ordem de Serviço, abreviada como OS, representa uma solicitação formal para executar um serviço.

Exemplos:

- instalação de equipamento;
- manutenção preventiva;
- reparo;
- vistoria;
- atendimento técnico;
- montagem;
- visita agendada.

Em sistemas reais, o domínio de OS pode incluir:

- cliente;
- endereço;
- produtos;
- atividades;
- técnico;
- equipe;
- agenda;
- checklist;
- materiais;
- custos;
- fotos;
- assinatura;
- ocorrências;
- transações;
- integrações;
- mensageria;
- auditoria.

Implementar tudo de uma vez produziria um projeto grande demais para uma primeira parte.

Nesta aula, o domínio será intencionalmente pequeno.

A Ordem de Serviço terá:

```text
id;

customerName;

serviceType;

description;

serviceAddress;

scheduledFor;

status;

createdAt;

updatedAt;

version.
```

A OS nascerá sempre com o status:

```text
OPEN.
```

O CRUD inicial permitirá:

```text
criar;

consultar por ID;

listar com paginação;

atualizar dados básicos;

excluir.
```

A atualização desta parte não poderá mudar o status.

Motivo:

```text
mudança de status não é simples edição;

ela representa uma transição de negócio.
```

As regras de transição serão tratadas na próxima aula.

O fluxo desta parte será:

```text
request HTTP;

controller;

command;

application service;

entity;

repository;

PostgreSQL;

response DTO.
```

A API utilizará:

```text
POST   /api/v2/service-orders

GET    /api/v2/service-orders/{serviceOrderId}

GET    /api/v2/service-orders

PUT    /api/v2/service-orders/{serviceOrderId}

DELETE /api/v2/service-orders/{serviceOrderId}
```

O projeto continuará dentro da aplicação construída ao longo do módulo:

```text
formacao-java-backend-api.
```

Você não criará um segundo projeto Spring Boot.

A nova feature ficará isolada por packages:

```text
domain.serviceorder;

application.serviceorder;

persistence.serviceorder;

web.v2.serviceorder.
```

A migration será:

```text
V6__create_service_order.sql.
```

A versão seis preserva a sequência atual do laboratório, que já possui migrations até `V5`.

A tabela será:

```text
service_order.
```

O ID será um UUID gerado pela aplicação.

A geração será abstraída por:

```text
ServiceOrderIdGenerator.
```

Essa decisão reaproveita o aprendizado da aula 394.

O service não chamará `UUID.randomUUID()` diretamente.

O tempo também continuará sendo obtido por:

```text
Clock.
```

Assim, a futura aula de testes poderá controlar:

- ID;
- instante de criação;
- instante de atualização.

O CRUD desta aula terá validação estrutural simples:

- campos textuais obrigatórios;
- tamanhos máximos;
- JSON válido.

Ainda não serão implementadas:

- regras condicionais;
- transições de status;
- conflitos;
- validação de agendamento;
- proteção contra exclusão;
- códigos detalhados para todas as regras;
- controle de concorrência na request;
- filtros avançados.

Esses assuntos pertencem às próximas partes.

A sequência do projeto será:

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

A pergunta central desta aula será:

```text
como modelar uma Ordem de Serviço pequena,
persisti-la com JPA
e expor um CRUD REST v2
sem misturar entity, request e response?
```

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
401:
Coleção Postman/Insomnia profissional.

402:
Documentação técnica da API.

403:
Erros comuns em API REST.

404:
Checklist de produção inicial.

405:
Projeto API OS parte 1 dominio e CRUD.

406:
Projeto API OS parte 2 validacoes e erros.

407:
Projeto API OS parte 3 persistencia e filtros.

408:
Projeto API OS parte 4 testes e documentacao.
```

A aula 404 respondeu:

```text
a aplicação atual possui evidência
para o ambiente avaliado?
```

A aula 405 responderá:

```text
como iniciar um domínio novo
aplicando a arquitetura e as convenções
construídas no módulo?
```

Nesta aula:

```text
domínio de OS:
sim.

migration:
sim.

entity JPA:
sim.

status inicial:
sim.

repository:
sim.

application service:
sim.

commands:
sim.

response DTO:
sim.

controller v2:
sim.

CRUD:
sim.

paginação básica:
sim.

validação estrutural:
sim.

transições de status:
não.

erros de negócio avançados:
não.

filtros:
não.

Specifications:
não.

testes completos:
não.

documentação completa:
não.
```

A regra central será:

```text
a primeira parte estabelece
um modelo pequeno e coerente;

as próximas partes aprofundam
regras, persistência, testes
e documentação sem reescrever tudo.
```

---

## Objetivo prático

Ao final da aula, a API terá um CRUD funcional de Ordem de Serviço.

Estrutura:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── serviceorder
│       ├── CreateServiceOrderCommand.java
│       ├── UpdateServiceOrderCommand.java
│       ├── ServiceOrderApplicationService.java
│       ├── ServiceOrderIdGenerator.java
│       ├── RandomServiceOrderIdGenerator.java
│       ├── ServiceOrderNotFoundException.java
│       └── ServiceOrderResult.java
├── domain
│   └── serviceorder
│       ├── ServiceOrder.java
│       └── ServiceOrderStatus.java
├── persistence
│   └── serviceorder
│       └── ServiceOrderRepository.java
└── web
    └── v2
        └── serviceorder
            ├── CreateServiceOrderRequest.java
            ├── UpdateServiceOrderRequest.java
            ├── ServiceOrderResponse.java
            ├── ServiceOrderPageResponse.java
            └── ServiceOrderController.java
```

Migration:

```text
src/main/resources/db/migration
└── V6__create_service_order.sql
```

Endpoints:

```text
POST:
201 Created.

GET by ID:
200 OK.

GET collection:
200 OK.

PUT:
200 OK.

DELETE:
204 No Content.
```

Você irá:

1. definir o vocabulário;
2. delimitar o escopo;
3. criar o status;
4. criar a migration;
5. criar a entity;
6. criar o repository;
7. criar o gerador de ID;
8. criar commands;
9. criar o application service;
10. criar requests e responses;
11. criar o controller;
12. adicionar o handler mínimo de `404`;
13. iniciar a aplicação;
14. executar o CRUD;
15. verificar o PostgreSQL;
16. registrar o commit.

---

## Conceito essencial

### Domínio antes do endpoint

É comum começar uma feature pensando:

```text
qual controller vou criar?
```

Nesta aula, a primeira pergunta será:

```text
o que é uma Ordem de Serviço
nesta versão do projeto?
```

A resposta define:

- dados;
- invariantes;
- estados;
- operações;
- limites.

O endpoint vem depois.

---

### Linguagem do domínio

No código Java, os nomes serão em inglês:

```text
ServiceOrder;

ServiceOrderStatus;

customerName;

serviceType;

scheduledFor.
```

Na explicação e na documentação em português:

```text
Ordem de Serviço;

status;

cliente;

tipo de serviço;

agendamento.
```

A tradução precisa ser consistente.

Não use alternadamente:

```text
WorkOrder;

OrderService;

ServiceRequest;

OS.
```

para representar o mesmo conceito.

---

### Escopo da primeira versão

A Ordem de Serviço representa uma solicitação de atendimento.

Campos:

`id`

```text
identificador técnico UUID.
```

`customerName`

```text
nome do cliente nesta versão simplificada.
```

`serviceType`

```text
categoria textual do serviço.
```

`description`

```text
detalhamento do que precisa ser realizado.
```

`serviceAddress`

```text
endereço textual do atendimento.
```

`scheduledFor`

```text
data e hora opcional com offset.
```

`status`

```text
estado atual da OS.
```

`createdAt`

```text
instante de criação.
```

`updatedAt`

```text
instante da última alteração.
```

`version`

```text
controle otimista interno da entity.
```

---

### O que não pertence a esta versão

Não serão criados:

- entity de cliente;
- tabela de técnico;
- tabela de endereço;
- atividades;
- itens;
- checklist;
- anexos da OS;
- cobrança;
- pagamento;
- agenda complexa;
- SLA;
- ocorrências;
- histórico de status.

O objetivo é possuir um agregado pequeno.

---

### Status

Enum:

```text
OPEN;

IN_PROGRESS;

COMPLETED;

CANCELED.
```

Nesta aula, somente `OPEN` é atribuído pela aplicação.

Os outros valores já fazem parte do vocabulário do domínio, mas não podem ser selecionados pelo cliente durante create ou update.

A próxima aula definirá transições.

---

### Invariante inicial

Toda nova OS nasce:

```text
status:
OPEN.

createdAt:
agora.

updatedAt:
agora.

version:
controlada pelo JPA.
```

O cliente não envia esses campos.

Essa regra pertence à aplicação e ao domínio.

---

### CRUD não significa ausência de domínio

CRUD descreve operações técnicas:

- create;
- read;
- update;
- delete.

O domínio ainda define:

- campos válidos;
- estado inicial;
- dados alteráveis;
- dados imutáveis;
- significado da exclusão.

Nesta parte, a exclusão será física.

Soft delete não será criado sem requisito.

---

### Entity não é request

A entity possui:

- annotations JPA;
- campos internos;
- version;
- timestamps;
- status;
- métodos de domínio.

A request representa dados enviados pelo cliente.

O cliente não pode controlar:

- ID;
- status inicial;
- timestamps;
- version.

Por isso, a entity não será usada em `@RequestBody`.

---

### Entity não é response

A response também será separada.

Isso evita expor:

- detalhes JPA;
- campos futuros;
- proxies;
- associações;
- version interna.

O contrato HTTP fica estável mesmo quando a persistência evolui.

---

### UUID gerado pela aplicação

Fluxo:

```text
ServiceOrderIdGenerator;

RandomServiceOrderIdGenerator;

UUID.
```

Vantagens:

- ID existe antes do insert;
- não depende de sequence;
- pode ser controlado em teste;
- funciona em múltiplas instâncias;
- não expõe quantidade de registros.

UUID não substitui autorização.

Conhecer ou adivinhar um ID não deve conceder acesso em uma futura API segura.

---

### Clock injetado

O application service usará:

```java
clock.instant()
```

e não:

```java
Instant.now()
```

A classe poderá ser testada com `Clock.fixed`.

O projeto já possui um bean `Clock`.

Não crie outro bean duplicado.

---

### @Version

A entity terá:

```java
@Version
private long version;
```

O JPA utiliza esse valor para optimistic locking.

Nesta aula, a versão não entra na request e não será convertida em `ETag`.

A aula 406 tratará conflitos de atualização de forma explícita.

A presença da coluna evita preparar a tabela novamente depois.

---

### Migration como fonte do schema

A tabela será criada pelo Flyway.

Hibernate continuará com:

```text
ddl-auto:
validate.
```

A entity deve corresponder à migration.

Não use:

```text
update;

create;

create-drop.
```

para corrigir divergência silenciosamente.

---

### Repository

Interface:

```java
JpaRepository<ServiceOrder, UUID>.
```

Ela fornecerá:

- save;
- findById;
- findAll;
- delete.

Filtros específicos ficarão para a aula 407.

Não crie vinte query methods sem caso de uso.

---

### Application service

O application service coordena:

- geração de ID;
- relógio;
- entity;
- repository;
- transação;
- conversão para result.

Ele não recebe DTO web.

Ele recebe commands.

Isso permite uma futura entrada diferente, como mensageria ou batch, sem reutilizar request HTTP.

---

### Transações

Create, update e delete serão:

```text
@Transactional.
```

Find e list serão:

```text
@Transactional(readOnly = true).
```

Na atualização, a entity carregada fica managed.

O método altera os campos.

O dirty checking gera o `UPDATE` no commit.

Não é necessário chamar `save` novamente em uma entity já gerenciada.

---

### Paginação básica

O list endpoint utilizará:

```text
page;

size;

sort.
```

Default:

```text
page:
0.

size:
20.

sort:
createdAt DESC.
```

Ainda não haverá filtros.

O response será próprio:

```text
content;

page;

size;

totalElements;

totalPages;

first;

last.
```

Não exponha `PageImpl` diretamente como contrato estável.

---

### Validação estrutural

Requests usarão:

- `@NotBlank`;
- `@Size`;
- `@Valid`.

Limites:

```text
customerName:
120.

serviceType:
120.

description:
500.

serviceAddress:
200.
```

`scheduledFor` não receberá regra temporal nesta parte.

A aula 406 decidirá se uma OS pode ser criada no passado, reagendada e quais erros serão retornados.

---

## Mão na massa guiada

### 1. Criar o enum de status

Arquivo:

```text
ServiceOrderStatus.java
```

Conteúdo:

```java
package br.com.formacao.backend.domain
        .serviceorder;

public enum ServiceOrderStatus {
    OPEN,
    IN_PROGRESS,
    COMPLETED,
    CANCELED
}
```

Não adicione métodos de transição ainda.

---

### 2. Criar a migration V6

Arquivo:

```text
V6__create_service_order.sql
```

Conteúdo:

```sql
create table service_order (
    id uuid primary key,

    customer_name varchar(120) not null,

    service_type varchar(120) not null,

    description varchar(500) not null,

    service_address varchar(200) not null,

    scheduled_for timestamptz null,

    status varchar(30) not null,

    created_at timestamptz not null,

    updated_at timestamptz not null,

    version bigint not null default 0,

    constraint ck_service_order_status
        check (
            status in (
                'OPEN',
                'IN_PROGRESS',
                'COMPLETED',
                'CANCELED'
            )
        )
);
```

Não crie índices de filtros ainda.

A aula 407 definirá queries antes de definir índices.

---

### 3. Criar a entity ServiceOrder

Arquivo:

```text
ServiceOrder.java
```

Conteúdo:

```java
package br.com.formacao.backend.domain
        .serviceorder;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(
        name = "service_order"
)
public class ServiceOrder {

    @Id
    private UUID id;

    @Column(
            name = "customer_name",
            nullable = false,
            length = 120
    )
    private String customerName;

    @Column(
            name = "service_type",
            nullable = false,
            length = 120
    )
    private String serviceType;

    @Column(
            nullable = false,
            length = 500
    )
    private String description;

    @Column(
            name = "service_address",
            nullable = false,
            length = 200
    )
    private String serviceAddress;

    @Column(
            name = "scheduled_for"
    )
    private OffsetDateTime scheduledFor;

    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false,
            length = 30
    )
    private ServiceOrderStatus status;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private Instant updatedAt;

    @Version
    @Column(
            nullable = false
    )
    private long version;

    protected ServiceOrder() {
    }

    private ServiceOrder(
            UUID id,
            String customerName,
            String serviceType,
            String description,
            String serviceAddress,
            OffsetDateTime scheduledFor,
            Instant createdAt
    ) {
        this.id = id;
        this.customerName = customerName;
        this.serviceType = serviceType;
        this.description = description;
        this.serviceAddress = serviceAddress;
        this.scheduledFor = scheduledFor;
        this.status =
                ServiceOrderStatus.OPEN;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    public static ServiceOrder open(
            UUID id,
            String customerName,
            String serviceType,
            String description,
            String serviceAddress,
            OffsetDateTime scheduledFor,
            Instant createdAt
    ) {
        return new ServiceOrder(
                id,
                customerName,
                serviceType,
                description,
                serviceAddress,
                scheduledFor,
                createdAt
        );
    }

    public void updateDetails(
            String customerName,
            String serviceType,
            String description,
            String serviceAddress,
            OffsetDateTime scheduledFor,
            Instant updatedAt
    ) {
        this.customerName = customerName;
        this.serviceType = serviceType;
        this.description = description;
        this.serviceAddress = serviceAddress;
        this.scheduledFor = scheduledFor;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getServiceType() {
        return serviceType;
    }

    public String getDescription() {
        return description;
    }

    public String getServiceAddress() {
        return serviceAddress;
    }

    public OffsetDateTime getScheduledFor() {
        return scheduledFor;
    }

    public ServiceOrderStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
```

Não crie setter público.

---

### 4. Criar o repository

Arquivo:

```text
ServiceOrderRepository.java
```

Conteúdo:

```java
package br.com.formacao.backend.persistence
        .serviceorder;

import java.util.UUID;

import org.springframework.data.jpa.repository
        .JpaRepository;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrder;

public interface ServiceOrderRepository
        extends JpaRepository<
                ServiceOrder,
                UUID
        > {
}
```

O Spring Data cria a implementação.

---

### 5. Criar o gerador de ID

Interface:

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.util.UUID;

public interface ServiceOrderIdGenerator {

    UUID nextId();
}
```

Implementação:

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class RandomServiceOrderIdGenerator
        implements ServiceOrderIdGenerator {

    @Override
    public UUID nextId() {
        return UUID.randomUUID();
    }
}
```

---

### 6. Criar os commands

Create:

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.time.OffsetDateTime;

public record CreateServiceOrderCommand(
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor
) {
}
```

Update:

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.time.OffsetDateTime;

public record UpdateServiceOrderCommand(
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor
) {
}
```

Nenhum command possui status.

---

### 7. Criar o result

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrderStatus;

public record ServiceOrderResult(
        UUID id,
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor,
        ServiceOrderStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
```

---

### 8. Criar a exception mínima

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.util.UUID;

public class ServiceOrderNotFoundException
        extends RuntimeException {

    private final UUID serviceOrderId;

    public ServiceOrderNotFoundException(
            UUID serviceOrderId
    ) {
        super(
                "Service order not found"
        );

        this.serviceOrderId =
                serviceOrderId;
    }

    public UUID serviceOrderId() {
        return serviceOrderId;
    }
}
```

A aula 406 ampliará o catálogo de erros.

---

### 9. Criar o application service

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.time.Clock;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
        .Transactional;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrder;
import br.com.formacao.backend.persistence
        .serviceorder.ServiceOrderRepository;

@Service
public class ServiceOrderApplicationService {

    private final ServiceOrderRepository
            repository;

    private final ServiceOrderIdGenerator
            idGenerator;

    private final Clock clock;

    public ServiceOrderApplicationService(
            ServiceOrderRepository repository,
            ServiceOrderIdGenerator idGenerator,
            Clock clock
    ) {
        this.repository = repository;
        this.idGenerator = idGenerator;
        this.clock = clock;
    }

    @Transactional
    public ServiceOrderResult create(
            CreateServiceOrderCommand command
    ) {
        ServiceOrder serviceOrder =
                ServiceOrder.open(
                        idGenerator.nextId(),
                        normalize(
                                command.customerName()
                        ),
                        normalize(
                                command.serviceType()
                        ),
                        normalize(
                                command.description()
                        ),
                        normalize(
                                command.serviceAddress()
                        ),
                        command.scheduledFor(),
                        clock.instant()
                );

        return toResult(
                repository.save(
                        serviceOrder
                )
        );
    }

    @Transactional(
            readOnly = true
    )
    public ServiceOrderResult findById(
            UUID serviceOrderId
    ) {
        return toResult(
                findRequired(
                        serviceOrderId
                )
        );
    }

    @Transactional(
            readOnly = true
    )
    public Page<ServiceOrderResult> findAll(
            Pageable pageable
    ) {
        return repository
                .findAll(
                        pageable
                )
                .map(
                        this::toResult
                );
    }

    @Transactional
    public ServiceOrderResult update(
            UUID serviceOrderId,
            UpdateServiceOrderCommand command
    ) {
        ServiceOrder serviceOrder =
                findRequired(
                        serviceOrderId
                );

        serviceOrder.updateDetails(
                normalize(
                        command.customerName()
                ),
                normalize(
                        command.serviceType()
                ),
                normalize(
                        command.description()
                ),
                normalize(
                        command.serviceAddress()
                ),
                command.scheduledFor(),
                clock.instant()
        );

        return toResult(
                serviceOrder
        );
    }

    @Transactional
    public void delete(
            UUID serviceOrderId
    ) {
        ServiceOrder serviceOrder =
                findRequired(
                        serviceOrderId
                );

        repository.delete(
                serviceOrder
        );
    }

    private ServiceOrder findRequired(
            UUID serviceOrderId
    ) {
        return repository
                .findById(
                        serviceOrderId
                )
                .orElseThrow(
                        () ->
                                new ServiceOrderNotFoundException(
                                        serviceOrderId
                                )
                );
    }

    private String normalize(
            String value
    ) {
        return value.trim();
    }

    private ServiceOrderResult toResult(
            ServiceOrder serviceOrder
    ) {
        return new ServiceOrderResult(
                serviceOrder.getId(),
                serviceOrder.getCustomerName(),
                serviceOrder.getServiceType(),
                serviceOrder.getDescription(),
                serviceOrder.getServiceAddress(),
                serviceOrder.getScheduledFor(),
                serviceOrder.getStatus(),
                serviceOrder.getCreatedAt(),
                serviceOrder.getUpdatedAt()
        );
    }
}
```

O `normalize` depende da validação web.

Uma entrada por outra interface precisará validar o command.

Isso será fortalecido na aula 406.

---

### 10. Criar a request de criação

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateServiceOrderRequest(

        @NotBlank
        @Size(
                max = 120
        )
        String customerName,

        @NotBlank
        @Size(
                max = 120
        )
        String serviceType,

        @NotBlank
        @Size(
                max = 500
        )
        String description,

        @NotBlank
        @Size(
                max = 200
        )
        String serviceAddress,

        OffsetDateTime scheduledFor
) {
}
```

---

### 11. Criar a request de atualização

A estrutura é igual à criação:

```java
public record UpdateServiceOrderRequest(
        @NotBlank
        @Size(max = 120)
        String customerName,

        @NotBlank
        @Size(max = 120)
        String serviceType,

        @NotBlank
        @Size(max = 500)
        String description,

        @NotBlank
        @Size(max = 200)
        String serviceAddress,

        OffsetDateTime scheduledFor
) {
}
```

Não inclua:

```text
id;

status;

createdAt;

updatedAt;

version.
```

---

### 12. Criar a response

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

import br.com.formacao.backend.application
        .serviceorder.ServiceOrderResult;
import br.com.formacao.backend.domain
        .serviceorder.ServiceOrderStatus;

public record ServiceOrderResponse(
        UUID id,
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor,
        ServiceOrderStatus status,
        Instant createdAt,
        Instant updatedAt
) {

    public static ServiceOrderResponse from(
            ServiceOrderResult result
    ) {
        return new ServiceOrderResponse(
                result.id(),
                result.customerName(),
                result.serviceType(),
                result.description(),
                result.serviceAddress(),
                result.scheduledFor(),
                result.status(),
                result.createdAt(),
                result.updatedAt()
        );
    }
}
```

---

### 13. Criar a response de paginação

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import java.util.List;

import org.springframework.data.domain.Page;

import br.com.formacao.backend.application
        .serviceorder.ServiceOrderResult;

public record ServiceOrderPageResponse(
        List<ServiceOrderResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {

    public static ServiceOrderPageResponse from(
            Page<ServiceOrderResult> result
    ) {
        return new ServiceOrderPageResponse(
                result
                    .getContent()
                    .stream()
                    .map(
                        ServiceOrderResponse::from
                    )
                    .toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isFirst(),
                result.isLast()
        );
    }
}
```

---

### 14. Criar o controller

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import java.net.URI;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web
        .PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation
        .DeleteMapping;
import org.springframework.web.bind.annotation
        .GetMapping;
import org.springframework.web.bind.annotation
        .PathVariable;
import org.springframework.web.bind.annotation
        .PostMapping;
import org.springframework.web.bind.annotation
        .PutMapping;
import org.springframework.web.bind.annotation
        .RequestBody;
import org.springframework.web.bind.annotation
        .RequestMapping;
import org.springframework.web.bind.annotation
        .RestController;
import org.springframework.web.servlet.support
        .ServletUriComponentsBuilder;

import br.com.formacao.backend.application
        .serviceorder.CreateServiceOrderCommand;
import br.com.formacao.backend.application
        .serviceorder.ServiceOrderApplicationService;
import br.com.formacao.backend.application
        .serviceorder.ServiceOrderResult;
import br.com.formacao.backend.application
        .serviceorder.UpdateServiceOrderCommand;

@RestController
@RequestMapping(
        "/api/v2/service-orders"
)
public class ServiceOrderController {

    private final ServiceOrderApplicationService
            applicationService;

    public ServiceOrderController(
            ServiceOrderApplicationService
                    applicationService
    ) {
        this.applicationService =
                applicationService;
    }

    @PostMapping
    public ResponseEntity<
            ServiceOrderResponse
    > create(
            @Valid
            @RequestBody
            CreateServiceOrderRequest request
    ) {
        ServiceOrderResponse response =
                ServiceOrderResponse.from(
                        applicationService.create(
                                toCommand(
                                        request
                                )
                        )
                );

        URI location =
                ServletUriComponentsBuilder
                        .fromCurrentRequest()
                        .path(
                                "/{serviceOrderId}"
                        )
                        .buildAndExpand(
                                response.id()
                        )
                        .toUri();

        return ResponseEntity
                .created(
                        location
                )
                .body(
                        response
                );
    }

    @GetMapping(
            "/{serviceOrderId}"
    )
    public ServiceOrderResponse findById(
            @PathVariable
            UUID serviceOrderId
    ) {
        return ServiceOrderResponse.from(
                applicationService.findById(
                        serviceOrderId
                )
        );
    }

    @GetMapping
    public ServiceOrderPageResponse findAll(

            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction =
                            Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ServiceOrderPageResponse.from(
                applicationService.findAll(
                        pageable
                )
        );
    }

    @PutMapping(
            "/{serviceOrderId}"
    )
    public ServiceOrderResponse update(
            @PathVariable
            UUID serviceOrderId,

            @Valid
            @RequestBody
            UpdateServiceOrderRequest request
    ) {
        return ServiceOrderResponse.from(
                applicationService.update(
                        serviceOrderId,
                        toCommand(
                                request
                        )
                )
        );
    }

    @DeleteMapping(
            "/{serviceOrderId}"
    )
    public ResponseEntity<Void> delete(
            @PathVariable
            UUID serviceOrderId
    ) {
        applicationService.delete(
                serviceOrderId
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    private CreateServiceOrderCommand toCommand(
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

    private UpdateServiceOrderCommand toCommand(
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

---

### 15. Adicionar o handler mínimo de not found

No `GlobalExceptionHandler`, adicione:

```java
@ExceptionHandler(
        ServiceOrderNotFoundException.class
)
public ProblemDetail handleServiceOrderNotFound(
        ServiceOrderNotFoundException exception
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.NOT_FOUND,
                    "Service order not found."
            );

    problem.setTitle(
            "Service order not found"
    );

    problem.setProperty(
            "code",
            "service_order_not_found"
    );

    return problem;
}
```

Não exponha o stack trace.

A aula 406 ampliará esse tratamento.

---

### 16. Compilar

```powershell
.\mvnw.cmd clean compile
```

Erros comuns neste ponto:

- package incorreto;
- import de `Pageable`;
- migration divergente;
- bean `Clock` duplicado;
- nome de coluna incorreto.

---

### 17. Iniciar com Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Acompanhe:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow `
  "api"
```

Flyway deve aplicar:

```text
V6__create_service_order.sql.
```

---

### 18. Criar uma OS

```powershell
$createBody = @{
  customerName =
    "Cliente Laboratório"

  serviceType =
    "Instalação"

  description =
    "Instalar equipamento no ponto principal"

  serviceAddress =
    "Rua do Laboratório, 100"

  scheduledFor =
    "2026-07-15T14:00:00-03:00"
} |
  ConvertTo-Json

$createResponse = Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405"
  } `
  -ContentType "application/json" `
  -Body $createBody

$createResponse.StatusCode
$createResponse.Headers.Location
$createResponse.Content
```

Resultado esperado:

```text
201;

Location;

status OPEN;

createdAt;

updatedAt.
```

---

### 19. Capturar o ID

```powershell
$created =
  $createResponse.Content |
  ConvertFrom-Json

$serviceOrderId =
  $created.id
```

Não copie manualmente.

---

### 20. Consultar por ID

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/service-orders/$serviceOrderId" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405"
  }
```

Confirme:

```text
id correto;

status OPEN;

dados persistidos.
```

---

### 21. Listar

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/service-orders?page=0&size=20&sort=createdAt,desc" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405"
  }
```

Confirme:

```text
content;

page;

size;

totalElements;

totalPages.
```

---

### 22. Atualizar dados básicos

```powershell
$updateBody = @{
  customerName =
    "Cliente Laboratório"

  serviceType =
    "Instalação técnica"

  description =
    "Instalar e validar o equipamento"

  serviceAddress =
    "Rua do Laboratório, 100"

  scheduledFor =
    "2026-07-16T09:00:00-03:00"
} |
  ConvertTo-Json

$updated = Invoke-RestMethod `
  -Method Put `
  -Uri "http://localhost:8081/api/v2/service-orders/$serviceOrderId" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405"
  } `
  -ContentType "application/json" `
  -Body $updateBody

$updated
```

Confirme:

```text
status continua OPEN;

updatedAt mudou;

id não mudou.
```

---

### 23. Verificar no PostgreSQL

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "postgres" `
  psql `
  -U "formacao" `
  -d "formacao_java" `
  -c `
  "select id, customer_name, service_type, status, version from service_order;"
```

Após a atualização:

```text
version:
maior que o valor inicial.
```

---

### 24. Testar campo inválido

```powershell
$invalidBody = @{
  customerName =
    ""

  serviceType =
    "Instalação"

  description =
    "Teste"

  serviceAddress =
    "Rua A"
} |
  ConvertTo-Json

Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/service-orders" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405-invalid"
  } `
  -ContentType "application/json" `
  -Body $invalidBody `
  -SkipHttpErrorCheck
```

Resultado esperado:

```text
400.
```

O detalhamento será aprofundado na aula 406.

---

### 25. Excluir

```powershell
$deleteResponse = Invoke-WebRequest `
  -Method Delete `
  -Uri "http://localhost:8081/api/v2/service-orders/$serviceOrderId" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405"
  }

$deleteResponse.StatusCode
```

Resultado:

```text
204.
```

Sem body.

---

### 26. Confirmar 404

```powershell
Invoke-WebRequest `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/service-orders/$serviceOrderId" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-405"
  } `
  -SkipHttpErrorCheck
```

Resultado:

```text
404;

code:
service_order_not_found.
```

---

## Entendendo o que foi feito

### O domínio ganhou vocabulário próprio

`ServiceOrder` e `ServiceOrderStatus` representam a OS.

### O escopo foi controlado

Cliente, técnico e atividades não viraram entidades prematuramente.

### O status inicial ficou protegido

O cliente não envia `OPEN`.

### A persistência ficou versionada

Flyway criou a tabela.

### O contrato ficou separado da entity

Requests, commands, result e response possuem papéis diferentes.

### O CRUD ficou transacional

Create, update e delete utilizam transações.

### O update preservou o status

Dados básicos mudam, o ciclo de vida não.

### A paginação ganhou response estável

O contrato não expõe diretamente `PageImpl`.

### ID e tempo ficaram testáveis

Gerador e `Clock` são dependências explícitas.

---

## Erros comuns importantes

### Criar entity para cada substantivo

Nem todo campo precisa virar tabela.

### Permitir status no create

O cliente poderia criar uma OS concluída.

### Alterar status no PUT genérico

Transição de negócio ficaria sem regra.

### Usar entity como request

ID, timestamps e version poderiam ser controlados externamente.

### Usar entity como response

Persistência ficaria acoplada ao contrato.

### Gerar UUID diretamente no service

O teste futuro perde controle do ID.

### Usar Instant.now diretamente

O teste perde controle do tempo.

### Usar ddl-auto update

A migration deixa de ser fonte do schema.

### Retornar PageImpl diretamente

A representação pode ficar acoplada ao framework.

### Criar filtros antes dos casos de uso

Queries e índices seriam definidos por antecipação.

---

## Comandos úteis

### Compilar

```powershell
.\mvnw.cmd clean compile
```

### Subir a stack

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

### Logs da API

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow `
  "api"
```

### Consultar a tabela

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "select * from service_order;"
```

### Parar preservando dados

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

---

## Exercício guiado

### Parte 1 — Domínio

Explique por que a OS nasce `OPEN`.

### Parte 2 — Schema

Crie a migration e valide com Flyway.

### Parte 3 — Entity

Crie factory, update de detalhes e `@Version`.

### Parte 4 — Application

Crie ID generator, commands, result e service.

### Parte 5 — Web

Crie requests, responses, paginação e controller.

### Parte 6 — CRUD

Execute create, get, list, update e delete.

### Parte 7 — Banco

Confirme status, timestamps e version.

### Parte 8 — Limites

Registre o que não pertence à parte 1.

### Parte 9 — Decisão

Anote:

```text
status inicial OPEN;

status não entra nas requests;

UUID gerado pela aplicação;

Clock injetado;

entity separada de DTO;

Flyway cria schema;

JPA valida schema;

paginação básica;

delete físico;

sem transição de status;

sem filtros;

sem testes completos;

sem documentação completa.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 404 foi preservada;
- projeto API OS foi iniciado;
- novo projeto Spring não foi criado;
- domínio de OS foi definido;
- linguagem do domínio foi mantida;
- escopo da primeira parte foi delimitado;
- campos da OS foram definidos;
- itens fora do escopo foram registrados;
- enum `ServiceOrderStatus` foi criado;
- status OPEN foi criado;
- status IN_PROGRESS foi criado;
- status COMPLETED foi criado;
- status CANCELED foi criado;
- novas OS nascem OPEN;
- cliente não envia status no create;
- cliente não envia status no update;
- migration V6 foi criada;
- tabela `service_order` foi criada;
- UUID foi usado como primary key;
- constraints de not null foram criadas;
- check de status foi criado;
- índices de filtros não foram antecipados;
- entity `ServiceOrder` foi criada;
- construtor JPA foi protegido;
- factory `open` foi criada;
- método `updateDetails` foi criado;
- setters públicos não foram criados;
- `@Version` foi usado;
- timestamps foram criados;
- Clock foi utilizado;
- repository JPA foi criado;
- query methods prematuros não foram criados;
- interface de gerador de ID foi criada;
- implementação aleatória foi criada;
- UUID direto não foi usado no service;
- create command foi criado;
- update command foi criado;
- commands não possuem status;
- result foi criado;
- exception mínima de not found foi criada;
- application service foi criado;
- create é transacional;
- find é read-only;
- list é read-only;
- update é transacional;
- delete é transacional;
- dirty checking foi aproveitado;
- request de criação foi criada;
- request de atualização foi criada;
- Bean Validation estrutural foi usada;
- response foi criada;
- entity não foi exposta;
- page response própria foi criada;
- PageImpl não foi exposto;
- controller v2 foi criado;
- URI usa substantivo plural;
- POST foi criado;
- GET by ID foi criado;
- GET collection foi criado;
- PUT foi criado;
- DELETE foi criado;
- POST retorna 201;
- POST retorna Location;
- GET retorna 200;
- PUT retorna 200;
- DELETE retorna 204;
- DELETE não retorna body;
- handler mínimo de 404 foi criado;
- Problem Details não expõe stack trace;
- aplicação compilou;
- Flyway aplicou a migration;
- create foi executado;
- status OPEN foi comprovado;
- get foi executado;
- list paginado foi executado;
- update foi executado;
- status permaneceu OPEN;
- updatedAt foi alterado;
- version foi incrementada;
- validation 400 foi observada;
- delete foi executado;
- 404 após delete foi observado;
- transições não foram antecipadas;
- conflitos não foram antecipados;
- filtros não foram antecipados;
- Specifications não foram antecipadas;
- testes completos não foram antecipados;
- documentação completa não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 406 está correta.

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
git commit -m "feat(m14): iniciar dominio e CRUD de ordens de servico"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- env files;
- credentials;
- dados PostgreSQL;
- uploads;
- logs;
- responses;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou o projeto guiado de Ordem de Serviço.

O fluxo ficou:

```text
CreateServiceOrderRequest;

CreateServiceOrderCommand;

ServiceOrderApplicationService;

ServiceOrder;

ServiceOrderRepository;

PostgreSQL;

ServiceOrderResult;

ServiceOrderResponse.
```

Você implementou:

```text
domínio pequeno;

status inicial;

migration;

entity;

repository;

service;

CRUD;

paginação;

404 mínimo.
```

A decisão central foi:

```text
CRUD não significa
expor entity e aceitar qualquer mudança;

o domínio define
o estado inicial,
os dados alteráveis
e os limites da primeira versão.
```

A próxima aula será:

```text
406 - M14.51 - Projeto API OS parte 2 validacoes e erros
```

Nela, a OS receberá regras de negócio explícitas.

Serão trabalhados:

- agendamento;
- status;
- transições;
- cancelamento;
- conclusão;
- conflito;
- optimistic locking;
- validation da aplicação;
- códigos de erro;
- Problem Details;
- violations;
- testes focados nas regras.

Persistência avançada e filtros permanecerão para a aula 407.

Testes amplos e documentação final permanecerão para a aula 408.

---

# Material complementar

## Checkpoint final

- [ ] Criei o domínio de Ordem de Serviço.
- [ ] Criei migration e entity.
- [ ] Criei application service e repository.
- [ ] Expus CRUD v2 com DTOs.
- [ ] Executei o fluxo completo no PostgreSQL.

---

## Troubleshooting adicional

### Flyway acusa versão duplicada

Confirme se `V6` já existe no projeto real.

A sequência oficial desta baseline usa V6.

Não altere uma migration já aplicada.

### Hibernate acusa coluna inexistente

Compare:

- migration;
- `@Column`;
- tipo;
- nullable;
- nome da tabela.

Não use `ddl-auto=update`.

### Clock possui dois beans

Reutilize o bean criado anteriormente.

Não declare outro sem qualifier.

### Create retorna 500 com string nula

Confirme `@Valid` e annotations da request.

A aula 406 adicionará defesa no application service.

### Update não executa SQL

Confirme:

- método transacional;
- entity carregada no mesmo contexto;
- valores realmente mudaram.

### Version não aumenta

Confirme `@Version` e coluna `version`.

O incremento ocorre no flush.

### List retorna estrutura do framework

Confirme uso de `ServiceOrderPageResponse`.

### Status muda pelo update

O request não pode possuir status.

O método `updateDetails` não altera status.

---

## Perguntas de revisão

1. O que a OS representa?
2. Qual é o status inicial?
3. O cliente envia status no create?
4. Qual é o ID?
5. Quem gera o ID?
6. Por que usar Clock?
7. Qual migration foi criada?
8. Quem cria o schema?
9. Entity é request?
10. Entity é response?
11. Qual repository foi usado?
12. O list é paginado?
13. PageImpl foi exposto?
14. O PUT muda status?
15. O delete é físico?
16. Qual status o create retorna?
17. Qual header acompanha o create?
18. Qual status o delete retorna?
19. Filtros foram criados?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma solicitação formal de serviço.
2. `OPEN`.
3. Não.
4. UUID.
5. `ServiceOrderIdGenerator`.
6. Para controlar tempo e testes.
7. `V6__create_service_order.sql`.
8. Flyway.
9. Não.
10. Não.
11. `JpaRepository`.
12. Sim.
13. Não.
14. Não.
15. Sim nesta versão.
16. 201.
17. Location.
18. 204.
19. Não.
20. Validações e erros da API OS.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 405 - M14.50 - Projeto API OS parte 1 dominio e CRUD

- Continuei no projeto `formacao-java-backend-api`.
- Iniciei o projeto guiado de Ordem de Serviço.
- Defini uma linguagem consistente para o domínio.
- Delimitei o escopo da primeira versão.
- Registrei itens que ficaram fora do escopo.
- Criei `ServiceOrderStatus`.
- Defini os estados OPEN, IN_PROGRESS, COMPLETED e CANCELED.
- Garanti que toda OS nasce OPEN.
- Criei `V6__create_service_order.sql`.
- Criei a tabela `service_order`.
- Usei UUID como primary key.
- Criei check constraint para status.
- Criei a entity `ServiceOrder`.
- Criei factory `open`.
- Criei `updateDetails`.
- Não criei setters públicos.
- Adicionei `@Version`.
- Usei timestamps controlados por `Clock`.
- Criei `ServiceOrderRepository`.
- Criei `ServiceOrderIdGenerator`.
- Criei `RandomServiceOrderIdGenerator`.
- Criei commands de create e update.
- Não permiti status nos commands.
- Criei `ServiceOrderResult`.
- Criei `ServiceOrderApplicationService`.
- Usei transações de escrita e read-only.
- Aproveitei dirty checking.
- Criei requests com validação estrutural.
- Criei response separada da entity.
- Criei response própria de paginação.
- Criei `ServiceOrderController`.
- Implementei POST, GET, list, PUT e DELETE.
- Retornei 201 com Location.
- Retornei 204 sem body.
- Criei 404 mínimo para OS inexistente.
- Executei create, get, list, update e delete.
- Confirmei status OPEN.
- Confirmei alteração de updatedAt e version.
- Não antecipei transições, filtros ou testes completos.
- Próxima aula: Projeto API OS parte 2 validações e erros.
```

---

## Referência técnica curta

- [Spring Data JPA — Reference](https://docs.spring.io/spring-data/jpa/reference/)
- [Spring Data JPA — Transactionality](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)
- [Spring Framework — Annotated Controllers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
- [Jakarta Persistence — Version](https://jakarta.ee/specifications/persistence/3.2/apidocs/jakarta.persistence/jakarta/persistence/version)

Regra final:

```text
a primeira parte do projeto API OS precisa estabelecer um domínio pequeno, um schema versionado e um CRUD previsível sem permitir que o cliente controle estado interno; nesta baseline, ServiceOrder nasce OPEN, UUID e tempo são gerados por dependências explícitas, Flyway cria service_order, JPA persiste a entity, o application service coordena transações e o controller v2 expõe requests e responses separados da persistência.
```
