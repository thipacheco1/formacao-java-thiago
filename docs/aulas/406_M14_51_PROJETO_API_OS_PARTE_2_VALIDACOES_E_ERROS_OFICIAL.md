# 406 - M14.51 - Projeto API OS parte 2 validacoes e erros

## Apresentação da aula

Na aula 405, você iniciou o projeto guiado de Ordem de Serviço.

A primeira parte criou:

```text
ServiceOrder;

ServiceOrderStatus;

migration V6;

entity JPA;

repository;

commands;

application service;

requests;

responses;

controller;

CRUD v2.
```

A OS nasce sempre:

```text
OPEN.
```

O fluxo básico ficou:

```text
POST;

GET por ID;

GET paginado;

PUT de dados básicos;

DELETE.
```

Aquela aula respondeu:

```text
como iniciar um domínio pequeno
e expor um CRUD REST
sem misturar entity e contrato HTTP?
```

Agora o CRUD precisa receber regras de negócio.

Sem essas regras, um cliente poderia tentar:

- criar OS com agendamento no passado;
- alterar uma OS que já foi concluída;
- concluir uma OS que nunca foi iniciada;
- reabrir uma OS cancelada;
- excluir uma OS em atendimento;
- atualizar uma versão antiga;
- sobrescrever alterações feitas por outro usuário;
- enviar comandos inválidos por uma entrada diferente do controller.

Bean Validation protege a fronteira HTTP.

Ela não é suficiente para proteger o caso de uso.

O mesmo application service pode ser chamado futuramente por:

- mensageria;
- importação;
- batch;
- scheduler;
- outro módulo;
- teste direto.

Por isso, esta aula adicionará validações na camada de aplicação e regras dentro do domínio.

A pergunta central será:

```text
como impedir estados inválidos,
controlar transições
e devolver erros previsíveis
sem acoplar o domínio ao HTTP?
```

A evolução utilizará:

```text
ServiceOrderCommandValidator;

ServiceOrderViolation;

exceptions de negócio;

transições explícitas;

ETag;

If-Match;

HTTP 428;

HTTP 412;

HTTP 409;

Problem Details;

optimistic locking.
```

O ciclo de vida será:

```text
OPEN
  |
  +--> IN_PROGRESS
  |       |
  |       +--> COMPLETED
  |       |
  |       +--> CANCELED
  |
  +--> CANCELED
```

Não serão permitidas:

```text
OPEN -> COMPLETED;

IN_PROGRESS -> OPEN;

COMPLETED -> qualquer estado;

CANCELED -> qualquer estado;

estado -> mesmo estado.
```

As regras de operação serão:

```text
update de dados:
somente OPEN.

delete:
somente OPEN.

start:
OPEN -> IN_PROGRESS.

complete:
IN_PROGRESS -> COMPLETED.

cancel:
OPEN ou IN_PROGRESS -> CANCELED.
```

O agendamento será opcional.

Quando informado em create ou update:

```text
scheduledFor
não pode ser anterior
ao instante atual do Clock.
```

A validação utilizará:

```text
scheduledFor.toInstant();
clock.instant().
```

Não será usado `OffsetDateTime.now()` diretamente.

A entity já possui:

```text
@Version.
```

Nesta aula, essa versão passará a fazer parte do contrato de concorrência.

As responses de recurso incluirão:

```text
version.
```

As responses individuais também retornarão:

```http
ETag: "0"
```

Para alterar, transicionar ou excluir, o cliente precisará enviar:

```http
If-Match: "0"
```

Quando o header não existir:

```text
428 Precondition Required.
```

Quando a versão enviada não corresponder à versão atual:

```text
412 Precondition Failed.
```

Quando duas transações passam pela verificação inicial e o JPA detecta a corrida no flush:

```text
409 Conflict.
```

Essa separação é importante.

`412` significa:

```text
a precondição declarada pelo cliente
já estava desatualizada.
```

`409` significa:

```text
o servidor detectou
um conflito concorrente
durante a operação.
```

A mudança de status utilizará:

```http
PATCH /api/v2/service-orders/{serviceOrderId}/status
```

Body:

```json
{
  "targetStatus": "IN_PROGRESS"
}
```

O endpoint altera somente o subestado de status.

Ele não reutiliza o PUT de dados básicos.

A aula também padronizará os seguintes erros:

```text
service_order_validation_failed;

service_order_not_found;

service_order_operation_not_allowed;

service_order_invalid_transition;

service_order_precondition_required;

service_order_invalid_if_match;

service_order_version_mismatch;

service_order_concurrent_update.
```

Cada código público terá uma finalidade estável.

O cliente não receberá:

- nome de classe Java;
- SQL;
- versão Hibernate;
- stack trace;
- mensagem do PostgreSQL;
- path local;
- host de infraestrutura.

A próxima aula será:

```text
407 - M14.52 - Projeto API OS parte 3 persistencia e filtros
```

Por isso, esta aula não criará:

- filtros por cliente;
- filtros por status;
- filtros por período;
- `JpaSpecificationExecutor`;
- Criteria API;
- índices para busca;
- ordenações de negócio;
- consultas agregadas.

A aula 408 continuará responsável por testes amplos e documentação final.

---

## Onde estamos na formação

A sequência do projeto API OS é:

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

A aula 405 respondeu:

```text
como criar o primeiro CRUD da OS?
```

A aula 406 responderá:

```text
como proteger o domínio
contra operações inválidas
e concorrência perdida?
```

Nesta aula:

```text
validation no application service:
sim.

agendamento:
sim.

transições:
sim.

update por estado:
sim.

delete por estado:
sim.

ETag:
sim.

If-Match:
sim.

428:
sim.

412:
sim.

409:
sim.

Problem Details:
sim.

violations:
sim.

testes focados:
sim.

filtros:
não.

Specifications:
não.

documentação final:
não.
```

A regra central será:

```text
validação web melhora feedback;

validação da aplicação
protege o caso de uso;

o domínio protege
as transições de estado.
```

---

## Objetivo prático

Ao final da aula, a API de OS terá:

```text
POST /api/v2/service-orders

GET /api/v2/service-orders/{id}

GET /api/v2/service-orders

PUT /api/v2/service-orders/{id}

PATCH /api/v2/service-orders/{id}/status

DELETE /api/v2/service-orders/{id}
```

Create e GET individual devolverão:

```text
body com version;

ETag.
```

PUT, PATCH e DELETE exigirão:

```text
If-Match.
```

Novas classes principais:

```text
application/serviceorder/
├── ServiceOrderCommandValidator.java
├── ServiceOrderViolation.java
├── ServiceOrderValidationException.java
├── ServiceOrderOperationNotAllowedException.java
├── InvalidServiceOrderTransitionException.java
├── ServiceOrderVersionMismatchException.java
├── ServiceOrderConcurrentUpdateException.java
└── TransitionServiceOrderStatusCommand.java

web/v2/serviceorder/
├── TransitionServiceOrderStatusRequest.java
├── ServiceOrderHttpVersion.java
└── ServiceOrderErrorHandler.java
```

Você irá:

1. fortalecer validação da aplicação;
2. criar violations;
3. adicionar regras à entity;
4. criar transição de status;
5. expor version;
6. gerar ETag;
7. interpretar If-Match;
8. exigir precondição;
9. diferenciar 412 de 409;
10. padronizar Problem Details;
11. executar transições válidas;
12. executar transições inválidas;
13. simular versão antiga;
14. criar testes focados;
15. commitar.

---

## Conceito essencial

### Três níveis de proteção

A feature terá três níveis.

Primeiro:

```text
request HTTP.
```

Bean Validation detecta:

- blank;
- tamanho;
- estrutura.

Segundo:

```text
application service.
```

O validator detecta:

- command nulo;
- strings inválidas;
- agendamento no passado;
- inconsistências independentes do transporte.

Terceiro:

```text
domínio.
```

A entity decide:

- pode atualizar?
- pode excluir?
- pode mudar para o estado alvo?

Cada nível responde uma pergunta diferente.

---

### Bean Validation não é regra completa

`@NotBlank` é útil no controller.

Porém:

```java
applicationService.create(
        new CreateServiceOrderCommand(
                null,
                null,
                null,
                null,
                null
        )
);
```

não passa pelo controller.

O application service precisa recusar o command.

A validação não deve depender da existência de HTTP.

---

### Violation pública

Record:

```java
public record ServiceOrderViolation(
        String field,
        String message
) {
}
```

A exception de validação carrega uma lista.

O Problem Details publica:

```json
{
  "code": "service_order_validation_failed",
  "violations": [
    {
      "field": "scheduledFor",
      "message": "must not be in the past"
    }
  ]
}
```

Não publique o valor rejeitado quando ele puder conter dados sensíveis.

---

### Normalização

Strings serão normalizadas antes da entity:

```text
trim.
```

Depois da normalização, o valor precisa continuar válido.

Exemplo:

```text
"   "
```

vira vazio.

A validação da aplicação deve detectar isso antes de construir ou atualizar a entity.

---

### Regra temporal com Clock

Um agendamento igual ao instante atual é aceito.

Somente:

```text
scheduledFor < now
```

é inválido.

O validator recebe `Instant now`.

Isso permite testar exatamente o limite.

Não use tolerâncias escondidas sem requisito.

---

### Regra dentro da entity

A entity saberá:

```text
se pode atualizar detalhes;

se pode ser removida;

se a transição é válida.
```

Ela não saberá:

- status HTTP;
- Problem Details;
- header;
- controller.

Exemplo:

```java
serviceOrder.transitionTo(
        targetStatus,
        now
);
```

Quando inválido, lança exception de domínio.

---

### Estado terminal

`COMPLETED` e `CANCELED` serão terminais.

Isso significa:

```text
nenhuma transição posterior.
```

A escolha é uma regra desta versão do domínio.

Uma futura reabertura exigirá novo caso de uso e nova decisão.

Não adicione reabertura como atalho administrativo.

---

### Update somente em OPEN

Depois que o atendimento inicia, os dados básicos ficam protegidos.

Essa regra evita alterar retroativamente o escopo durante execução.

Uma evolução futura poderia criar:

- reagendamento;
- correção autorizada;
- aditivo;
- histórico.

Nesta baseline:

```text
PUT em IN_PROGRESS,
COMPLETED ou CANCELED
retorna 409.
```

---

### Delete somente em OPEN

Excluir uma OS em atendimento ou finalizada destrói histórico.

Nesta versão:

```text
DELETE somente OPEN.
```

Mais tarde, soft delete ou retenção podem ser avaliados.

A regra atual é simples e explícita.

---

### ETag

ETag representa uma versão da representação.

Formato da baseline:

```http
ETag: "0"
```

Depois da atualização:

```http
ETag: "1"
```

O valor será derivado de `@Version`.

Não use timestamp como ETag quando a versão JPA já existe.

---

### If-Match

O cliente envia a versão que leu:

```http
If-Match: "1"
```

A operação só prossegue se o recurso ainda estiver na versão esperada.

Isso evita lost update:

```text
cliente A lê versão 1;

cliente B lê versão 1;

A atualiza para versão 2;

B tenta atualizar usando versão 1;

B recebe 412.
```

Sem precondição, B poderia sobrescrever A.

---

### 428 Precondition Required

Quando uma operação exige precondição e o header está ausente:

```text
428.
```

O erro informa ao cliente que ele precisa ler o recurso e enviar o ETag.

Não use `400` para esconder essa semântica.

---

### 412 Precondition Failed

Quando o header é válido, mas a versão não corresponde:

```text
412.
```

O cliente deve:

1. fazer novo GET;
2. analisar o estado atual;
3. decidir se reaplica a alteração;
4. enviar o novo If-Match.

Não faça retry automático cego.

---

### 409 Conflict

Mesmo com a mesma versão inicial, duas transações podem concorrer.

O JPA executa algo semelhante a:

```sql
update service_order
set ...
where id = ?
  and version = ?;
```

Se nenhuma linha for atualizada, ocorre optimistic locking failure.

A aplicação traduz para:

```text
409;
service_order_concurrent_update.
```

O `flush()` será chamado antes de retornar para garantir que a falha aconteça dentro do método controlado.

---

### If-Match válido

A baseline aceitará somente:

```text
um ETag forte;

aspas;

inteiro não negativo.
```

Aceito:

```text
"0";
"15".
```

Rejeitado:

```text
0;

W/"0";

*;

"abc";

"-1";

"0","1".
```

Suporte a listas e wildcard não é necessário para o laboratório.

---

### Problem Details estável

Campos comuns:

```text
type;

title;

status;

detail;

instance;

code.
```

Validation adiciona:

```text
violations.
```

Conflito de versão pode adicionar:

```text
expectedVersion;

currentVersion.
```

Não publique a entity inteira no erro.

---

## Mão na massa guiada

### 1. Expor version na entity

Adicione:

```java
public long getVersion() {
    return version;
}
```

Não crie setter.

---

### 2. Criar violation

```java
package br.com.formacao.backend.application
        .serviceorder;

public record ServiceOrderViolation(
        String field,
        String message
) {
}
```

---

### 3. Criar exception de validação

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.util.List;

public class ServiceOrderValidationException
        extends RuntimeException {

    private final List<ServiceOrderViolation>
            violations;

    public ServiceOrderValidationException(
            List<ServiceOrderViolation>
                    violations
    ) {
        super(
                "Service order validation failed"
        );

        this.violations =
                List.copyOf(
                        violations
                );
    }

    public List<ServiceOrderViolation>
            violations() {
        return violations;
    }
}
```

---

### 4. Criar o validator

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ServiceOrderCommandValidator {

    public void validateCreate(
            CreateServiceOrderCommand command,
            Instant now
    ) {
        validate(
                command.customerName(),
                command.serviceType(),
                command.description(),
                command.serviceAddress(),
                command.scheduledFor(),
                now
        );
    }

    public void validateUpdate(
            UpdateServiceOrderCommand command,
            Instant now
    ) {
        validate(
                command.customerName(),
                command.serviceType(),
                command.description(),
                command.serviceAddress(),
                command.scheduledFor(),
                now
        );
    }

    private void validate(
            String customerName,
            String serviceType,
            String description,
            String serviceAddress,
            OffsetDateTime scheduledFor,
            Instant now
    ) {
        List<ServiceOrderViolation>
                violations =
                new ArrayList<>();

        validateText(
                violations,
                "customerName",
                customerName,
                120
        );

        validateText(
                violations,
                "serviceType",
                serviceType,
                120
        );

        validateText(
                violations,
                "description",
                description,
                500
        );

        validateText(
                violations,
                "serviceAddress",
                serviceAddress,
                200
        );

        if (
            scheduledFor != null
            && scheduledFor
                    .toInstant()
                    .isBefore(
                            now
                    )
        ) {
            violations.add(
                    new ServiceOrderViolation(
                            "scheduledFor",
                            "must not be in the past"
                    )
            );
        }

        if (!violations.isEmpty()) {
            throw new ServiceOrderValidationException(
                    violations
            );
        }
    }

    private void validateText(
            List<ServiceOrderViolation>
                    violations,
            String field,
            String value,
            int maxLength
    ) {
        if (
            value == null
            || value.trim().isEmpty()
        ) {
            violations.add(
                    new ServiceOrderViolation(
                            field,
                            "must not be blank"
                    )
            );

            return;
        }

        if (value.trim().length() > maxLength) {
            violations.add(
                    new ServiceOrderViolation(
                            field,
                            "must have at most "
                            + maxLength
                            + " characters"
                    )
            );
        }
    }
}
```

O validator não depende de Jakarta Validation.

---

### 5. Criar exceptions de domínio

Operação não permitida:

```java
public class ServiceOrderOperationNotAllowedException
        extends RuntimeException {

    private final String operation;
    private final ServiceOrderStatus currentStatus;

    public ServiceOrderOperationNotAllowedException(
            String operation,
            ServiceOrderStatus currentStatus
    ) {
        super(
                "Operation not allowed for current status"
        );

        this.operation = operation;
        this.currentStatus = currentStatus;
    }

    public String operation() {
        return operation;
    }

    public ServiceOrderStatus currentStatus() {
        return currentStatus;
    }
}
```

Transição inválida:

```java
public class InvalidServiceOrderTransitionException
        extends RuntimeException {

    private final ServiceOrderStatus from;
    private final ServiceOrderStatus to;

    public InvalidServiceOrderTransitionException(
            ServiceOrderStatus from,
            ServiceOrderStatus to
    ) {
        super(
                "Invalid service order transition"
        );

        this.from = from;
        this.to = to;
    }

    public ServiceOrderStatus from() {
        return from;
    }

    public ServiceOrderStatus to() {
        return to;
    }
}
```

---

### 6. Fortalecer a entity

No início de `updateDetails`:

```java
if (status != ServiceOrderStatus.OPEN) {
    throw new ServiceOrderOperationNotAllowedException(
            "update",
            status
    );
}
```

Crie:

```java
public void ensureDeletable() {
    if (status != ServiceOrderStatus.OPEN) {
        throw new ServiceOrderOperationNotAllowedException(
                "delete",
                status
        );
    }
}
```

Crie a transição:

```java
public void transitionTo(
        ServiceOrderStatus targetStatus,
        Instant updatedAt
) {
    boolean allowed =
            switch (status) {
                case OPEN ->
                        targetStatus
                                == ServiceOrderStatus
                                .IN_PROGRESS
                        || targetStatus
                                == ServiceOrderStatus
                                .CANCELED;

                case IN_PROGRESS ->
                        targetStatus
                                == ServiceOrderStatus
                                .COMPLETED
                        || targetStatus
                                == ServiceOrderStatus
                                .CANCELED;

                case COMPLETED, CANCELED ->
                        false;
            };

    if (!allowed) {
        throw new InvalidServiceOrderTransitionException(
                status,
                targetStatus
        );
    }

    this.status = targetStatus;
    this.updatedAt = updatedAt;
}
```

O mesmo estado não passa pela allowlist.

---

### 7. Criar command de status

```java
package br.com.formacao.backend.application
        .serviceorder;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrderStatus;

public record TransitionServiceOrderStatusCommand(
        ServiceOrderStatus targetStatus
) {
}
```

O target nulo será validado no application service.

---

### 8. Criar exceptions de concorrência

Versão incompatível:

```java
public class ServiceOrderVersionMismatchException
        extends RuntimeException {

    private final long expectedVersion;
    private final long currentVersion;

    public ServiceOrderVersionMismatchException(
            long expectedVersion,
            long currentVersion
    ) {
        super(
                "Service order version mismatch"
        );

        this.expectedVersion = expectedVersion;
        this.currentVersion = currentVersion;
    }

    public long expectedVersion() {
        return expectedVersion;
    }

    public long currentVersion() {
        return currentVersion;
    }
}
```

Concorrência real:

```java
public class ServiceOrderConcurrentUpdateException
        extends RuntimeException {

    public ServiceOrderConcurrentUpdateException(
            Throwable cause
    ) {
        super(
                "Concurrent service order update",
                cause
        );
    }
}
```

Precondition e parser inválido pertencem à camada web.

---

### 9. Atualizar result e response

Adicione em ambos:

```java
long version.
```

No mapper:

```java
serviceOrder.getVersion().
```

A response individual passa a informar a versão no body e no ETag.

A paginação também inclui a versão em cada item.

---

### 10. Atualizar o application service

Injete:

```java
ServiceOrderCommandValidator validator.
```

Create:

```java
Instant now =
        clock.instant();

validator.validateCreate(
        command,
        now
);
```

Depois normalize e crie a entity.

Update passa a receber:

```java
long expectedVersion.
```

Fluxo:

```java
@Transactional
public ServiceOrderResult update(
        UUID serviceOrderId,
        long expectedVersion,
        UpdateServiceOrderCommand command
) {
    Instant now =
            clock.instant();

    validator.validateUpdate(
            command,
            now
    );

    ServiceOrder serviceOrder =
            findRequired(
                    serviceOrderId
            );

    ensureExpectedVersion(
            serviceOrder,
            expectedVersion
    );

    serviceOrder.updateDetails(
            normalize(command.customerName()),
            normalize(command.serviceType()),
            normalize(command.description()),
            normalize(command.serviceAddress()),
            command.scheduledFor(),
            now
    );

    flushSafely();

    return toResult(
            serviceOrder
    );
}
```

Crie o helper:

```java
private void ensureExpectedVersion(
        ServiceOrder serviceOrder,
        long expectedVersion
) {
    if (
        serviceOrder.getVersion()
        != expectedVersion
    ) {
        throw new ServiceOrderVersionMismatchException(
                expectedVersion,
                serviceOrder.getVersion()
        );
    }
}
```

---

### 11. Adicionar transition

```java
@Transactional
public ServiceOrderResult transitionStatus(
        UUID serviceOrderId,
        long expectedVersion,
        TransitionServiceOrderStatusCommand
                command
) {
    if (command.targetStatus() == null) {
        throw new ServiceOrderValidationException(
                List.of(
                        new ServiceOrderViolation(
                                "targetStatus",
                                "must not be null"
                        )
                )
        );
    }

    ServiceOrder serviceOrder =
            findRequired(
                    serviceOrderId
            );

    ensureExpectedVersion(
            serviceOrder,
            expectedVersion
    );

    serviceOrder.transitionTo(
            command.targetStatus(),
            clock.instant()
    );

    flushSafely();

    return toResult(
            serviceOrder
    );
}
```

---

### 12. Fortalecer delete

Delete recebe:

```text
expectedVersion.
```

Antes de remover:

```java
ensureExpectedVersion(
        serviceOrder,
        expectedVersion
);

serviceOrder.ensureDeletable();

repository.delete(
        serviceOrder
);

flushSafely();
```

---

### 13. Criar flush seguro

Injete `EntityManager` ou utilize `repository.flush()`.

Como o repository é `JpaRepository`:

```java
private void flushSafely() {
    try {
        repository.flush();
    }
    catch (
        ObjectOptimisticLockingFailureException
                exception
    ) {
        throw new ServiceOrderConcurrentUpdateException(
                exception
        );
    }
}
```

Import:

```java
org.springframework.orm
        .ObjectOptimisticLockingFailureException;
```

O flush antecipa a detecção.

---

### 14. Criar request de status

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import jakarta.validation.constraints.NotNull;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrderStatus;

public record TransitionServiceOrderStatusRequest(

        @NotNull
        ServiceOrderStatus targetStatus
) {
}
```

---

### 15. Criar parser de versão HTTP

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class ServiceOrderHttpVersion {

    private static final Pattern STRONG_ETAG =
            Pattern.compile(
                    "^\"([0-9]+)\"$"
            );

    private ServiceOrderHttpVersion() {
    }

    public static String toEtag(
            long version
    ) {
        return "\""
                + version
                + "\"";
    }

    public static long parseIfMatch(
            String ifMatch
    ) {
        if (
            ifMatch == null
            || ifMatch.isBlank()
        ) {
            throw new ServiceOrderPreconditionRequiredException();
        }

        Matcher matcher =
                STRONG_ETAG.matcher(
                        ifMatch.trim()
                );

        if (!matcher.matches()) {
            throw new InvalidServiceOrderIfMatchException(
                    ifMatch
            );
        }

        try {
            return Long.parseLong(
                    matcher.group(1)
            );
        }
        catch (NumberFormatException exception) {
            throw new InvalidServiceOrderIfMatchException(
                    ifMatch
            );
        }
    }
}
```

Crie as duas exceptions web sem guardar valor bruto sensível no message.

---

### 16. Atualizar o controller

Create passa a devolver body e ETag:

```java
return ResponseEntity
        .created(
                location
        )
        .eTag(
                ServiceOrderHttpVersion
                        .toEtag(
                                response.version()
                        )
        )
        .body(
                response
        );
```

GET individual:

```java
return ResponseEntity
        .ok()
        .eTag(
                ServiceOrderHttpVersion
                        .toEtag(
                                response.version()
                        )
        )
        .body(
                response
        );
```

PUT recebe:

```java
@RequestHeader(
        name = HttpHeaders.IF_MATCH,
        required = false
)
String ifMatch
```

Converta:

```java
long expectedVersion =
        ServiceOrderHttpVersion
                .parseIfMatch(
                        ifMatch
                );
```

Retorne novo ETag.

DELETE também exige o header.

---

### 17. Criar PATCH de status

```java
@PatchMapping(
        "/{serviceOrderId}/status"
)
public ResponseEntity<
        ServiceOrderResponse
> transitionStatus(

        @PathVariable
        UUID serviceOrderId,

        @RequestHeader(
                name = HttpHeaders.IF_MATCH,
                required = false
        )
        String ifMatch,

        @Valid
        @RequestBody
        TransitionServiceOrderStatusRequest
                request
) {
    long expectedVersion =
            ServiceOrderHttpVersion
                    .parseIfMatch(
                            ifMatch
                    );

    ServiceOrderResponse response =
            ServiceOrderResponse.from(
                    applicationService
                            .transitionStatus(
                                    serviceOrderId,
                                    expectedVersion,
                                    new TransitionServiceOrderStatusCommand(
                                            request.targetStatus()
                                    )
                            )
            );

    return ResponseEntity
            .ok()
            .eTag(
                    ServiceOrderHttpVersion
                            .toEtag(
                                    response.version()
                            )
            )
            .body(
                    response
            );
}
```

---

### 18. Criar handler de erros

Use `@RestControllerAdvice` focado na feature ou adicione handlers ao advice global existente.

Validation da aplicação:

```java
@ExceptionHandler(
        ServiceOrderValidationException.class
)
public ProblemDetail handleValidation(
        ServiceOrderValidationException
                exception
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Service order validation failed."
            );

    problem.setTitle(
            "Invalid service order"
    );

    problem.setProperty(
            "code",
            "service_order_validation_failed"
    );

    problem.setProperty(
            "violations",
            exception.violations()
    );

    return problem;
}
```

Transição:

```text
409;
service_order_invalid_transition.
```

Operação bloqueada:

```text
409;
service_order_operation_not_allowed.
```

Precondition ausente:

```text
428;
service_order_precondition_required.
```

If-Match inválido:

```text
400;
service_order_invalid_if_match.
```

Versão antiga:

```text
412;
service_order_version_mismatch.
```

Concorrência JPA:

```text
409;
service_order_concurrent_update.
```

---

### 19. Preservar correlation ID

O advice global e o filter da aplicação já cuidam do correlation ID.

Confirme que todas as responses de erro continuam devolvendo:

```text
X-Correlation-Id.
```

Não crie um segundo mecanismo.

---

### 20. Testar create com agendamento passado

Use:

```json
{
  "customerName": "Cliente",
  "serviceType": "Instalação",
  "description": "Teste",
  "serviceAddress": "Rua A",
  "scheduledFor": "2020-01-01T10:00:00-03:00"
}
```

Resultado:

```text
400;

code:
service_order_validation_failed;

violations:
scheduledFor.
```

---

### 21. Criar uma OS válida

Capture:

```text
ID;

ETag.
```

PowerShell:

```powershell
$create =
  Invoke-WebRequest `
    -Method Post `
    -Uri "http://localhost:8081/api/v2/service-orders" `
    -Headers @{
      "X-Client-Id" =
        "api-os-aula-406"
    } `
    -ContentType "application/json" `
    -Body $createBody

$serviceOrder =
  $create.Content |
  ConvertFrom-Json

$serviceOrderId =
  $serviceOrder.id

$etag =
  $create.Headers.ETag
```

Confirme:

```text
ETag:
"0".
```

---

### 22. Testar PUT sem If-Match

Execute update sem header.

Resultado:

```text
428;

service_order_precondition_required.
```

---

### 23. Atualizar com ETag correto

Envie:

```powershell
-Headers @{
  "X-Client-Id" =
    "api-os-aula-406"

  "If-Match" =
    $etag
}
```

Resultado:

```text
200;

version incrementada;

novo ETag.
```

Atualize a variável:

```powershell
$etag =
  $updateResponse.Headers.ETag
```

---

### 24. Testar ETag antigo

Reutilize:

```text
"0"
```

depois que a versão já mudou.

Resultado:

```text
412;

service_order_version_mismatch;

expectedVersion:
0;

currentVersion:
1.
```

---

### 25. Iniciar atendimento

PATCH:

```json
{
  "targetStatus": "IN_PROGRESS"
}
```

Envie o ETag atual.

Resultado:

```text
200;

status IN_PROGRESS;

version incrementada;

novo ETag.
```

---

### 26. Tentar atualizar detalhes em atendimento

Execute PUT com o ETag atual.

Resultado:

```text
409;

service_order_operation_not_allowed;

operation:
update;

currentStatus:
IN_PROGRESS.
```

---

### 27. Tentar concluir diretamente de OPEN

Crie outra OS.

Execute:

```json
{
  "targetStatus": "COMPLETED"
}
```

Resultado:

```text
409;

service_order_invalid_transition;

from:
OPEN;

to:
COMPLETED.
```

---

### 28. Concluir fluxo válido

Na OS em `IN_PROGRESS`, envie:

```json
{
  "targetStatus": "COMPLETED"
}
```

Resultado:

```text
200;

status COMPLETED.
```

Depois tente cancelar.

Resultado:

```text
409.
```

---

### 29. Testar cancelamento

Crie outra OS.

Envie:

```text
OPEN -> CANCELED.
```

Resultado:

```text
200.
```

Tente iniciar depois.

Resultado:

```text
409.
```

---

### 30. Testar delete bloqueado

Em uma OS `IN_PROGRESS`, execute DELETE com ETag atual.

Resultado:

```text
409;

service_order_operation_not_allowed.
```

Em uma OS `OPEN`, DELETE continua:

```text
204.
```

---

### 31. Criar testes focados

Crie:

```text
ServiceOrderCommandValidatorTest;

ServiceOrderTest;

ServiceOrderHttpVersionTest.
```

Cenários mínimos:

```text
scheduledFor passado falha;

OPEN -> IN_PROGRESS passa;

OPEN -> COMPLETED falha;

update em IN_PROGRESS falha;

If-Match "12" retorna 12;

If-Match ausente retorna precondition;

If-Match fraco é inválido.
```

Use JUnit puro.

Não inicie Spring nesses testes.

---

## Entendendo o que foi feito

### A validação deixou de depender da web

Commands inválidos são recusados pelo application service.

### A entity passou a proteger seu ciclo de vida

Transições não estão espalhadas no controller.

### Update e delete ganharam regras

CRUD deixou de significar alteração irrestrita.

### A versão virou precondição HTTP

O consumidor participa do controle de concorrência.

### Lost update foi evitado

Uma versão antiga não sobrescreve uma nova.

### Erros ganharam códigos estáveis

O cliente não precisa interpretar mensagens internas.

### Concorrência foi diferenciada de validação

400, 409, 412 e 428 possuem responsabilidades distintas.

### Testes rápidos protegeram regras centrais

As regras foram testadas sem infraestrutura.

---

## Erros comuns importantes

### Validar somente no controller

Outras entradas poderiam ignorar a regra.

### Colocar HttpStatus na entity

O domínio ficaria acoplado à web.

### Permitir qualquer transição

Estados terminais perderiam significado.

### Usar PUT para mudar status

Dados básicos e ciclo de vida ficariam misturados.

### Aceitar update sem versão

Lost update continuaria possível.

### Devolver 409 para If-Match ausente

A semântica correta da baseline é 428.

### Devolver 400 para versão antiga

A request é sintaticamente válida; a precondição falhou.

### Confiar apenas na comparação manual

Uma corrida ainda pode ocorrer antes do commit.

### Não forçar flush

A exception pode ocorrer depois do ponto de tradução.

### Publicar exception do Hibernate

O consumidor não deve conhecer o mecanismo interno.

---

## Comandos úteis

### Compilar

```powershell
.\mvnw.cmd clean compile
```

### Testes focados

```powershell
.\mvnw.cmd `
  "-Dtest=ServiceOrderCommandValidatorTest,ServiceOrderTest,ServiceOrderHttpVersionTest" `
  test
```

### Subir Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

### Ver ETag

```powershell
$response = Invoke-WebRequest `
  "http://localhost:8081/api/v2/service-orders/$serviceOrderId"

$response.Headers.ETag
```

### Consultar versão

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "select id, status, version from service_order;"
```

---

## Exercício guiado

### Parte 1 — Validação

Crie command inválido fora do controller e confirme a exception.

### Parte 2 — Agendamento

Teste passado, agora e futuro.

### Parte 3 — Transições

Teste todos os caminhos válidos.

### Parte 4 — Caminhos inválidos

Teste terminal, mesmo estado e salto.

### Parte 5 — Operações por estado

Teste update e delete em todos os estados.

### Parte 6 — ETag

Capture, atualize e reutilize uma versão antiga.

### Parte 7 — If-Match

Teste ausente, inválido, fraco e válido.

### Parte 8 — Erros

Confirme status, code e ausência de detalhes internos.

### Parte 9 — Testes

Execute as três classes focadas.

### Parte 10 — Registrar decisão

Anote:

```text
validation web e application;

Clock para regra temporal;

OPEN atualizável e removível;

OPEN -> IN_PROGRESS;

OPEN -> CANCELED;

IN_PROGRESS -> COMPLETED;

IN_PROGRESS -> CANCELED;

terminais sem transição;

PATCH de status;

version no body;

ETag nas responses;

If-Match obrigatório;

428 ausente;

400 malformado;

412 versão antiga;

409 conflito concorrente;

Problem Details com codes estáveis.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 405 foi preservada;
- validation web e aplicação foram diferenciadas;
- validator de command foi criado;
- violation foi criada;
- exception de validation foi criada;
- strings nulas foram tratadas;
- strings blank foram tratadas;
- tamanhos máximos foram tratados;
- trim foi considerado;
- agendamento passado foi rejeitado;
- Clock foi usado;
- OffsetDateTime.now direto não foi usado;
- entity protege update;
- update somente OPEN foi implementado;
- entity protege delete;
- delete somente OPEN foi implementado;
- transição foi implementada na entity;
- OPEN para IN_PROGRESS foi permitida;
- OPEN para CANCELED foi permitida;
- IN_PROGRESS para COMPLETED foi permitida;
- IN_PROGRESS para CANCELED foi permitida;
- OPEN para COMPLETED foi rejeitada;
- IN_PROGRESS para OPEN foi rejeitada;
- COMPLETED foi terminal;
- CANCELED foi terminal;
- mesma transição foi rejeitada;
- command de status foi criado;
- request de status foi criada;
- PATCH de status foi criado;
- status não entrou no PUT;
- version foi exposta no result;
- version foi exposta na response;
- getter de version foi criado;
- ETag foi retornado no create;
- ETag foi retornado no GET;
- ETag foi retornado no PUT;
- ETag foi retornado no PATCH;
- If-Match foi exigido no PUT;
- If-Match foi exigido no PATCH;
- If-Match foi exigido no DELETE;
- ETag forte foi usado;
- weak ETag foi rejeitado;
- wildcard foi rejeitado;
- lista de ETags não foi antecipada;
- precondition ausente retorna 428;
- If-Match inválido retorna 400;
- versão antiga retorna 412;
- currentVersion foi informada;
- expectedVersion foi informada;
- @Version continuou ativo;
- repository.flush foi usado;
- optimistic locking real foi traduzido;
- concorrência retorna 409;
- exception JPA não vazou;
- Problem Details foi padronizado;
- code de validation foi criado;
- code de not found foi preservado;
- code de operation not allowed foi criado;
- code de invalid transition foi criado;
- code de precondition required foi criado;
- code de invalid If-Match foi criado;
- code de version mismatch foi criado;
- code de concurrent update foi criado;
- violations foram publicadas;
- correlation ID foi preservado;
- stack trace não foi publicada;
- SQL não foi publicado;
- create passado foi testado;
- PUT sem If-Match foi testado;
- update válido foi testado;
- ETag antigo foi testado;
- start válido foi testado;
- update em atendimento foi testado;
- conclusão direta foi rejeitada;
- conclusão válida foi testada;
- cancelamento foi testado;
- operação após terminal foi rejeitada;
- delete bloqueado foi testado;
- delete OPEN foi preservado;
- testes de validator foram criados;
- testes de domínio foram criados;
- testes de parser foram criados;
- Spring não foi iniciado nos testes focados;
- filtros não foram antecipados;
- Specifications não foram antecipadas;
- índices não foram antecipados;
- testes amplos não foram antecipados;
- documentação final não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 407 está correta.

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
git commit -m "feat(m14): validar regras e concorrencia da API OS"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- env files;
- credentials;
- logs;
- responses;
- dados do volume;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API OS deixou de ser um CRUD irrestrito.

O fluxo passou a incluir:

```text
Bean Validation;

command validator;

Clock;

regras da entity;

ETag;

If-Match;

@Version;

flush;

Problem Details.
```

Você protegeu:

```text
dados obrigatórios;

tamanhos;

agendamento;

update;

delete;

transições;

concorrência.
```

A decisão central foi:

```text
uma operação não é válida
apenas porque o JSON está correto;

o estado atual,
a versão lida
e as regras do domínio
também precisam permitir a mudança.
```

A próxima aula será:

```text
407 - M14.52 - Projeto API OS parte 3 persistencia e filtros
```

Nela, a listagem de OS receberá filtros reais.

Serão trabalhados:

- status;
- customerName;
- serviceType;
- período de agendamento;
- ordenação;
- paginação;
- `JpaSpecificationExecutor`;
- composição de predicates;
- índices;
- queries;
- validação de filtros;
- análise do SQL.

Os testes completos de controller, service, repository e integração continuarão reservados para a aula 408.

---

# Material complementar

## Checkpoint final

- [ ] Protegi commands fora da web.
- [ ] Implementei transições válidas.
- [ ] Bloqueei update e delete por estado.
- [ ] Adicionei ETag e If-Match.
- [ ] Padronizei validação, conflito e concorrência.

---

## Troubleshooting adicional

### ETag retorna com aspas duplicadas

`ResponseEntity.eTag` normaliza o valor conforme a API utilizada.

Confirme o header real.

Mantenha uma única função de formatação.

### If-Match chega sem aspas

O cliente precisa enviar o ETag exatamente como recebido.

Não remova aspas manualmente.

### Version não incrementa antes da response

O flush precisa acontecer antes do mapper final quando a response usa a versão nova.

### Optimistic exception escapa como 500

Confirme:

- `repository.flush()`;
- catch da exception Spring;
- tradução para exception da feature;
- handler 409.

### scheduledFor igual ao agora falha

Confirme uso de `isBefore`.

Não use `!isAfter`.

### Validation publica valor rejeitado

Remova o valor.

Publique somente field e message.

### Update em OPEN retorna 409

Confirme o status real e o If-Match atual no PostgreSQL.

### PATCH retorna 415

Confirme:

```text
Content-Type:
application/json.
```

---

## Perguntas de revisão

1. Por que validar no application service?
2. Onde ficam as transições?
3. Qual estado pode atualizar dados?
4. Qual estado pode ser excluído?
5. OPEN pode ir para quais estados?
6. IN_PROGRESS pode ir para quais?
7. Estados terminais são quais?
8. Qual endpoint muda status?
9. O que ETag representa?
10. Qual header envia a versão?
11. Header ausente retorna qual status?
12. Header malformado retorna qual status?
13. Versão antiga retorna qual status?
14. Corrida JPA retorna qual status?
15. Por que chamar flush?
16. O que `@Version` evita?
17. A exception Hibernate é pública?
18. Filtros foram criados?
19. Testes completos foram criados?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Para proteger entradas além do HTTP.
2. Na entity.
3. `OPEN`.
4. `OPEN`.
5. `IN_PROGRESS` ou `CANCELED`.
6. `COMPLETED` ou `CANCELED`.
7. `COMPLETED` e `CANCELED`.
8. `PATCH /{id}/status`.
9. A versão da representação.
10. `If-Match`.
11. 428.
12. 400.
13. 412.
14. 409.
15. Para detectar conflito dentro do método.
16. Lost update.
17. Não.
18. Não.
19. Não.
20. Persistência e filtros da API OS.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 406 - M14.51 - Projeto API OS parte 2 validacoes e erros

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei validation web, aplicação e domínio.
- Criei `ServiceOrderViolation`.
- Criei `ServiceOrderValidationException`.
- Criei `ServiceOrderCommandValidator`.
- Validei campos obrigatórios e tamanhos.
- Validei agendamento com `Clock`.
- Rejeitei agendamento no passado.
- Protegi update para permitir somente OPEN.
- Protegi delete para permitir somente OPEN.
- Implementei OPEN para IN_PROGRESS.
- Implementei OPEN para CANCELED.
- Implementei IN_PROGRESS para COMPLETED.
- Implementei IN_PROGRESS para CANCELED.
- Rejeitei saltos e estados terminais.
- Criei command e request de transição.
- Criei PATCH de status.
- Expus version no contrato.
- Adicionei ETag em responses individuais.
- Exigi If-Match em PUT, PATCH e DELETE.
- Retornei 428 para precondition ausente.
- Retornei 400 para If-Match malformado.
- Retornei 412 para versão antiga.
- Mantive `@Version` para concorrência real.
- Forcei flush nas mutações.
- Traduzi optimistic locking para 409.
- Padronizei códigos públicos de erro.
- Publiquei violations sem valores sensíveis.
- Preservei correlation ID.
- Testei transições válidas e inválidas.
- Testei update e delete bloqueados.
- Testei ETag antigo.
- Criei testes unitários focados.
- Não antecipei filtros, Specifications ou documentação final.
- Próxima aula: Projeto API OS parte 3 persistência e filtros.
```

---

## Referência técnica curta

- [RFC 9110 — If-Match](https://www.rfc-editor.org/rfc/rfc9110#name-if-match)
- [RFC 9110 — 412 Precondition Failed](https://www.rfc-editor.org/rfc/rfc9110#name-412-precondition-failed)
- [RFC 6585 — 428 Precondition Required](https://www.rfc-editor.org/rfc/rfc6585#section-3)
- [Spring Data JPA — Locking](https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html)
- [Jakarta Persistence — Version](https://jakarta.ee/specifications/persistence/3.2/apidocs/jakarta.persistence/jakarta/persistence/version)

Regra final:

```text
a API OS precisa validar commands independentemente da web, manter transições dentro do domínio e exigir uma precondição de versão nas mutações; nesta baseline, agendamentos passados são rejeitados, somente OPEN pode ser atualizado ou removido, transições seguem uma allowlist, ETag representa @Version, If-Match evita lost update, 428 sinaliza precondição ausente, 412 versão antiga e 409 concorrência detectada pelo JPA.
```
