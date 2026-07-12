# 428 - M15.18 - Autorizacao por regra de negocio

## Apresentação da aula

Na aula 427, a autorização passou a acompanhar o caso de uso.

A aplicação recebeu:

```text
@EnableMethodSecurity;

@PreAuthorize;

denyAll como fallback;

permission explícita em cada método;

testes diretos no bean proxied;

comprovação de ausência de efeitos quando negado.
```

O fluxo ficou:

```text
request authorization
-> controller
-> method authorization
-> application service
-> domínio
-> repository
```

Cada operação exige uma capacidade:

```text
create:
service-order:create.

findById e search:
service-order:read.

update:
service-order:update.

transitionStatus:
service-order:status:update.

delete:
service-order:delete.
```

Essa policy ainda responde apenas:

```text
o usuário possui
a permission da operação?
```

Ela não responde:

```text
esta identidade pode agir
sobre esta ordem de serviço específica?
```

Considere dois operadores:

```text
operador A;

operador B.
```

Os dois possuem:

```text
service-order:read;

service-order:update;

service-order:status:update.
```

Se a regra verificar somente essas permissions, o operador A pode tentar trocar o UUID na URL e acessar a ordem criada pelo operador B.

A autenticação é válida.

A permission também é válida.

Mesmo assim, o acesso ao objeto pode ser indevido.

A pergunta central desta aula será:

```text
como combinar permission,
identidade autenticada,
relacionamento com o recurso
e exceções de negócio
sem escrever uma expressão SpEL extensa
e sem confiar em dados enviados pelo cliente?
```

A solução adicionará uma regra baseada em relacionamento. Cada nova ordem de serviço terá `owner_user_id`, derivado do subject UUID, salvo pelo backend, imutável, ausente do request e protegido por foreign key.

A policy do laboratório será:

```text
operador:
cria OS para si;
lê as próprias;
atualiza as próprias;
altera status das próprias;
não exclui.

auditor:
lê qualquer OS;
não escreve.

supervisor:
lê qualquer OS;
atualiza qualquer OS;
altera status de qualquer OS;
exclui quando possui a permission.

admin:
mesma visibilidade global;
opera conforme permissions explícitas.
```

A regra combinará:

```text
RBAC:
roles amplas.

permission-based authorization:
capacidade da operação.

ReBAC:
relação owner entre usuário e OS.

atributos:
subject, owner e tipo de operação.
```

`@PreAuthorize` invocará um bean e a annotation ficará curta:

```java
@PreAuthorize(
    "hasAuthority('service-order:read') "
    + "and @serviceOrderBusinessAuthorization"
    + ".canRead(authentication, #serviceOrderId)"
)
```

A lógica real ficará em `ServiceOrderBusinessAuthorization`, que resolve o subject, consulta uma projeção mínima, aplica a policy, não altera estado e falha de forma fechada.

A busca paginada exige um tratamento diferente.

Não é aceitável:

```text
buscar todas as OS;

filtrar em memória;

montar a página depois.
```

Esse padrão:

- vaza contagens;
- quebra paginação;
- consome memória;
- aumenta latência;
- pode serializar itens antes do filtro;
- cria risco de acesso indevido.

O escopo será incorporado à query:

```text
operador:
where owner_user_id = subject.

auditor, supervisor e admin:
sem filtro de owner.

identidade inválida:
predicate false.
```

A API continuará usando:

- matriz HTTP;
- Method Security;
- permission explícita;
- deny by default;
- JWT validado;
- authorities conhecidas.

A autorização por regra de negócio será uma camada adicional.

A próxima aula oficial será:

```text
429 - M15.19 - Erros de autenticacao e autorizacao
```

Nela, os contratos públicos de `401`, `403`, recurso inexistente e acesso negado serão revisados para evitar enumeração e inconsistência.

---

## Onde estamos na formação

A sequência oficial é:

```text
426:
Roles authorities e permissoes.

427:
Method Security.

428:
Autorizacao por regra de negocio.

429:
Erros de autenticacao e autorizacao.

430:
Testes de seguranca com MockMvc.

431:
OAuth2 conceitos.
```

A aula 427 respondeu:

```text
como proteger o caso de uso
independentemente da rota?
```

A aula 428 responderá:

```text
como decidir acesso
usando a relação entre
subject e recurso?
```

Nesta aula:

```text
permission:
sim.

owner:
sim.

subject UUID:
sim.

role privilegiada:
sim.

bean em SpEL:
sim.

projeção mínima:
sim.

escopo SQL:
sim.

legacy owner nulo:
sim.

testes com dois usuários:
sim.

mass assignment:
sim.

erro público definitivo:
não.

multi-tenant:
não.

ACL:
não.

OPA:
não.

PermissionEvaluator:
não.
```

A regra central será:

```text
ter permissão para uma operação
não significa possuir acesso
a todo objeto daquele tipo.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/db/migration/
└── V10__add_service_order_owner.sql
```

Segurança:

```text
configuration/security/authorization/
├── AuthenticatedSubjectResolver.java
├── ServiceOrderBusinessAuthorization.java
└── ServiceOrderReadScope.java
```

Persistência:

```text
persistence/serviceorder/
└── ServiceOrderAccessView.java
```

Arquivos atualizados:

```text
ServiceOrder.java;

ServiceOrderRepository.java;

ServiceOrderSpecifications.java;

ServiceOrderApplicationService.java;

CreateServiceOrderCommand.java;

CreateServiceOrderRequest.java.
```

Testes:

```text
ServiceOrderBusinessAuthorizationTest.java;

ServiceOrderBusinessAuthorizationIntegrationTest.java.
```

Documento:

```text
docs/security/M15_BUSINESS_AUTHORIZATION.md
```

A aplicação demonstrará:

```text
operador A lê OS de A:
permitido.

operador A lê OS de B:
negado.

auditor lê OS de B:
permitido.

operador A atualiza OS de B:
negado.

supervisor atualiza OS de B:
permitido.

operador com permission delete:
negado pela regra de negócio.

supervisor com delete:
permitido.

search do operador:
somente próprias OS.

search do auditor:
todas as OS.

owner enviado no JSON:
campo inexistente ou rejeitado.
```

Você irá:

1. criar a migration de ownership;
2. tratar registros legados;
3. adicionar owner imutável;
4. derivar owner do subject;
5. impedir mass assignment;
6. criar resolver de subject;
7. criar projeção de acesso;
8. criar bean de autorização;
9. definir regras de leitura;
10. definir regras de alteração;
11. definir regra de exclusão;
12. combinar bean e permission;
13. escopar listagem no SQL;
14. manter paginação segura;
15. testar dois operadores;
16. testar auditor;
17. testar supervisor;
18. testar owner nulo;
19. atualizar riscos;
20. preparar a aula de erros.

---

## Conceito essencial

### Permission não resolve object-level authorization

A permission:

```text
service-order:read
```

significa:

```text
a identidade pode executar
uma operação de leitura de OS
quando as demais regras permitirem.
```

Ela não significa:

```text
a identidade pode ler
todas as OS existentes.
```

A decisão completa pode depender de:

- owner;
- cliente;
- tenant;
- contrato;
- região;
- estado;
- horário;
- origem da request;
- delegação;
- classificação do dado.

Nesta aula, a relação utilizada será owner.

---

### Relação owner

A OS passará a registrar:

```text
owner_user_id.
```

O valor representa o usuário responsável pelo recurso no laboratório.

Ele não é:

- username;
- e-mail;
- nome de exibição;
- `X-Client-Id`;
- correlation ID;
- dado vindo do frontend.

Ele é o UUID do usuário autenticado, igual ao:

```text
sub
```

do access token.

---

### Owner não vem do request

Um request como:

```json
{
  "customerName": "Cliente",
  "ownerUserId": "uuid-de-outro-usuario"
}
```

criaria mass assignment.

O cliente poderia escolher o owner e manipular a autorização futura.

A solução é remover o campo do contrato público.

O backend executa:

```text
owner =
subject autenticado.
```

Não existe setter público para trocar o owner.

---

### Subject como UUID

O Resource Server já valida:

```text
sub:
UUID.
```

`JwtAuthenticationToken.getName()` retorna esse subject.

O resolver converterá o valor para:

```java
UUID
```

Ele não usará username.

Username pode mudar.

O UUID persistido é o identificador estável.

---

### ABAC e ReBAC

A policy combina atributos do subject, do objeto e da operação, além da relação `subject owns object`. Isso se aproxima de ABAC e ReBAC sem exigir uma plataforma externa.

---

### Bean de autorização

O bean terá nome explícito:

```text
serviceOrderBusinessAuthorization.
```

Exemplo:

```java
@Component(
    "serviceOrderBusinessAuthorization"
)
public class ServiceOrderBusinessAuthorization {
}
```

A annotation referencia o bean:

```text
@serviceOrderBusinessAuthorization.
```

A expressão continua pequena.

A regra complexa permanece em Java, com:

- tipos;
- testes;
- repository;
- métodos semânticos;
- observabilidade futura;
- refatoração segura.

---

### Fail closed

Quando ocorrer:

- Authentication ausente;
- principal anônimo;
- subject inválido;
- OS não encontrada;
- owner ausente;
- authority inconsistente;
- falha inesperada de resolução;

a decisão não pode virar permit.

O padrão será:

```text
false.
```

Não capture indiscriminadamente falhas de infraestrutura para convertê-las em allow.

Falha de banco deve interromper a operação, não conceder acesso.

---

### Projeção mínima

A autorização precisa inicialmente apenas de `id` e `ownerUserId`, sem carregar payload ou entidade inteira. A projeção reduz os dados acessados durante a decisão.

Exemplo:

```java
public interface ServiceOrderAccessView {

    UUID getId();

    UUID getOwnerUserId();
}
```

---

### Query de autorização e query do caso de uso

Com `@PreAuthorize`, o bean pode consultar uma projeção antes do método.

Depois, o service carrega a entidade para executar a operação.

Isso produz duas consultas.

É uma escolha consciente nesta etapa:

```text
consulta 1:
decisão mínima.

consulta 2:
caso de uso.
```

Uma versão futura pode carregar e autorizar na mesma transação por outra arquitetura, desde que não abra uma janela de bypass.

---

### TOCTOU

TOCTOU significa:

```text
time of check;

time of use.
```

Se o owner pudesse mudar entre a autorização e o uso, a decisão poderia ficar desatualizada.

Nesta baseline:

- owner é imutável;
- nenhum endpoint troca owner;
- alteração de owner não existe;
- a FK preserva identidade referenciada.

Isso reduz o risco.

Se ownership se tornar mutável, a decisão precisará ocorrer na mesma unidade transacional com lock ou constraint apropriada.

---

### Registros legados

A tabela `service_order` já pode conter registros.

Adicionar diretamente:

```sql
owner_user_id uuid not null
```

falharia sem backfill.

A migration seguirá expand/migrate/contract:

1. adicionar coluna nullable;
2. nova aplicação sempre escreve owner;
3. registros antigos ficam identificáveis;
4. criar plano de reconciliação;
5. futuramente aplicar `NOT NULL`.

Policy para `owner_user_id null`:

```text
operador:
sem acesso.

auditor:
leitura global.

supervisor/admin:
leitura e operações privilegiadas.
```

O owner nulo não vira acesso público.

---

### Roles privilegiadas

A policy utilizará `ROLE_AUDITOR`, `ROLE_SUPERVISOR` e `ROLE_ADMIN`. As três possuem leitura global.

Escrita em recurso de outro owner:

```text
SUPERVISOR;

ADMIN.
```

Exclusão:

```text
SUPERVISOR;

ADMIN.
```

A role não substitui a permission.

Para excluir, a identidade precisa de:

```text
service-order:delete
```

e:

```text
ROLE_SUPERVISOR
ou ROLE_ADMIN.
```

---

### Escopo de listagem

O método `search` não recebe um `ownerUserId` externo.

O escopo é interno:

```text
ALL;

OWNED;

NONE.
```

Operador:

```text
OWNED(subject).
```

Auditor, supervisor e admin:

```text
ALL.
```

Identidade inválida:

```text
NONE.
```

A specification transforma o escopo em predicate SQL.

---

### Paginação segura

O filtro de owner precisa participar da query de dados e da count query. Aplicá-lo depois da paginação produz resultados errados; a `Specification` será combinada antes do `findAll`.

---

### Ausência e acesso negado

Quando o bean recebe um UUID inexistente, ele retornará `false`.

O Method Security lançará `AccessDeniedException`.

Essa decisão reduz a diferença observável entre:

- recurso de outro owner;
- recurso inexistente.

A aula 429 revisará formalmente os contratos públicos para `401`, `403` e `404`.

---

### Auditoria sem segredo

A decisão poderá futuramente emitir eventos com operação, subject, recurso, resultado e correlation ID, sem registrar tokens, password, hash ou claims completos.

Nesta aula, a auditoria detalhada será apenas documentada para não antecipar o módulo específico.

---

## Mão na massa guiada

### 1. Criar a migration V10

Arquivo:

```text
V10__add_service_order_owner.sql
```

Conteúdo:

```sql
alter table service_order
    add column owner_user_id uuid;

alter table service_order
    add constraint fk_service_order_owner
        foreign key (owner_user_id)
        references security_user (id);

create index ix_service_order_owner
    on service_order (owner_user_id);

comment on column service_order.owner_user_id is
    'Authenticated user that owns the service order';
```

Não use cascade delete.

Excluir usuário não deve excluir automaticamente OS.

---

### 2. Atualizar ServiceOrder

Adicione:

```java
@Column(
        name = "owner_user_id"
)
private UUID ownerUserId;
```

Na factory:

```java
public static ServiceOrder create(
        UUID ownerUserId,
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor,
        Clock clock
) {
    if (ownerUserId == null) {
        throw new IllegalArgumentException(
                "Service order owner is required"
        );
    }

    ServiceOrder serviceOrder =
            new ServiceOrder();

    serviceOrder.id =
            UUID.randomUUID();

    serviceOrder.ownerUserId =
            ownerUserId;

    // demais campos existentes

    return serviceOrder;
}
```

Crie somente getter:

```java
public UUID getOwnerUserId() {
    return ownerUserId;
}
```

Não crie setter ou operação de troca.

---

### 3. Remover owner do contrato público

Confirme que estes contratos não possuem owner:

```text
CreateServiceOrderRequest;

CreateServiceOrderCommand;

UpdateServiceOrderRequest;

UpdateServiceOrderCommand.
```

Crie um teste de deserialização:

```java
@Test
void shouldRejectUnknownOwnerField()
        throws Exception {

    mockMvc.perform(
            post(
                "/api/v2/service-orders"
            )
            .contentType(
                MediaType.APPLICATION_JSON
            )
            .content(
                """
                {
                  "ownerUserId":
                    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                  "customerName": "Cliente",
                  "serviceType": "INSTALLATION",
                  "description": "Teste",
                  "serviceAddress": "Endereco",
                  "scheduledFor":
                    "2026-07-20T10:00:00-03:00"
                }
                """
            )
            .header(
                HttpHeaders.AUTHORIZATION,
                bearerForOperatorA()
            )
    )
    .andExpect(
            status().isBadRequest()
    );
}
```

Esse teste pressupõe Jackson configurado para rejeitar propriedades desconhecidas.

Se o projeto optar por ignorá-las, valide no banco que o valor foi ignorado e registre o trade-off.

A preferência de segurança é rejeitar.

---

### 4. Criar AuthenticatedSubjectResolver

```java
package br.com.formacao.backend.configuration
        .security.authorization;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication
        .AnonymousAuthenticationToken;
import org.springframework.security.core
        .Authentication;
import org.springframework.security.core.context
        .SecurityContextHolder;
import org.springframework.security.access
        .AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedSubjectResolver {

    public Optional<UUID> resolve(
            Authentication authentication
    ) {
        if (
            authentication == null
            || !authentication.isAuthenticated()
            || authentication
                    instanceof
                    AnonymousAuthenticationToken
        ) {
            return Optional.empty();
        }

        try {
            return Optional.of(
                    UUID.fromString(
                            authentication.getName()
                    )
            );
        }
        catch (
            IllegalArgumentException exception
        ) {
            return Optional.empty();
        }
    }

    public UUID requireCurrentUserId() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return resolve(authentication)
                .orElseThrow(
                        () ->
                                new AccessDeniedException(
                                        "Authenticated subject is invalid"
                                )
                );
    }
}
```

A mensagem interna não deve ser devolvida ao cliente.

---

### 5. Criar ServiceOrderAccessView

```java
package br.com.formacao.backend.persistence
        .serviceorder;

import java.util.UUID;

public interface ServiceOrderAccessView {

    UUID getId();

    UUID getOwnerUserId();
}
```

---

### 6. Atualizar ServiceOrderRepository

Adicione:

```java
@Query("""
        select
            serviceOrder.id as id,
            serviceOrder.ownerUserId
                as ownerUserId
        from ServiceOrder serviceOrder
        where serviceOrder.id =
            :serviceOrderId
        """)
Optional<ServiceOrderAccessView>
findAccessViewById(
        UUID serviceOrderId
);
```

A projection não carrega a entity inteira.

---

### 7. Criar ServiceOrderReadScope

```java
package br.com.formacao.backend.configuration
        .security.authorization;

import java.util.UUID;

public record ServiceOrderReadScope(
        Mode mode,
        UUID ownerUserId
) {

    public enum Mode {
        ALL,
        OWNED,
        NONE
    }

    public static ServiceOrderReadScope all() {
        return new ServiceOrderReadScope(
                Mode.ALL,
                null
        );
    }

    public static ServiceOrderReadScope owned(
            UUID ownerUserId
    ) {
        return new ServiceOrderReadScope(
                Mode.OWNED,
                ownerUserId
        );
    }

    public static ServiceOrderReadScope none() {
        return new ServiceOrderReadScope(
                Mode.NONE,
                null
        );
    }
}
```

---

### 8. Criar ServiceOrderBusinessAuthorization

```java
package br.com.formacao.backend.configuration
        .security.authorization;

import java.util.Set;
import java.util.UUID;

import org.springframework.security.core
        .Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation
        .Transactional;

import br.com.formacao.backend.persistence
        .serviceorder.ServiceOrderAccessView;
import br.com.formacao.backend.persistence
        .serviceorder.ServiceOrderRepository;

import static br.com.formacao.backend.configuration
        .security.authorization
        .SecurityAuthorityCatalog.*;

@Component(
        "serviceOrderBusinessAuthorization"
)
@Transactional(
        readOnly = true
)
public class ServiceOrderBusinessAuthorization {

    private static final Set<String>
            GLOBAL_READ_ROLES =
            Set.of(
                    ROLE_AUDITOR,
                    ROLE_SUPERVISOR,
                    ROLE_ADMIN
            );

    private static final Set<String>
            GLOBAL_WRITE_ROLES =
            Set.of(
                    ROLE_SUPERVISOR,
                    ROLE_ADMIN
            );

    private final ServiceOrderRepository
            repository;

    private final AuthenticatedSubjectResolver
            subjectResolver;

    public ServiceOrderBusinessAuthorization(
            ServiceOrderRepository repository,
            AuthenticatedSubjectResolver subjectResolver
    ) {
        this.repository = repository;
        this.subjectResolver = subjectResolver;
    }
```

Continue:

```java
    public boolean canRead(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        return repository
                .findAccessViewById(
                        serviceOrderId
                )
                .map(
                        view ->
                                hasAnyAuthority(
                                        authentication,
                                        GLOBAL_READ_ROLES
                                )
                                || isOwner(
                                        authentication,
                                        view
                                )
                )
                .orElse(false);
    }

    public boolean canUpdate(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        return canWrite(
                authentication,
                serviceOrderId
        );
    }

    public boolean canTransitionStatus(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        return canWrite(
                authentication,
                serviceOrderId
        );
    }

    public boolean canDelete(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        return repository
                .findAccessViewById(
                        serviceOrderId
                )
                .map(
                        ignored ->
                                hasAnyAuthority(
                                        authentication,
                                        GLOBAL_WRITE_ROLES
                                )
                )
                .orElse(false);
    }
```

Helpers:

```java
    public ServiceOrderReadScope readScope(
            Authentication authentication
    ) {
        if (
            hasAnyAuthority(
                    authentication,
                    GLOBAL_READ_ROLES
            )
        ) {
            return ServiceOrderReadScope.all();
        }

        return subjectResolver
                .resolve(authentication)
                .map(
                        ServiceOrderReadScope
                                ::owned
                )
                .orElseGet(
                        ServiceOrderReadScope
                                ::none
                );
    }

    private boolean canWrite(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        return repository
                .findAccessViewById(
                        serviceOrderId
                )
                .map(
                        view ->
                                hasAnyAuthority(
                                        authentication,
                                        GLOBAL_WRITE_ROLES
                                )
                                || isOwner(
                                        authentication,
                                        view
                                )
                )
                .orElse(false);
    }

    private boolean isOwner(
            Authentication authentication,
            ServiceOrderAccessView view
    ) {
        if (view.getOwnerUserId() == null) {
            return false;
        }

        return subjectResolver
                .resolve(authentication)
                .map(
                        view.getOwnerUserId()
                                ::equals
                )
                .orElse(false);
    }

    private boolean hasAnyAuthority(
            Authentication authentication,
            Set<String> expected
    ) {
        if (authentication == null) {
            return false;
        }

        return authentication
                .getAuthorities()
                .stream()
                .map(
                        granted ->
                                granted
                                        .getAuthority()
                )
                .anyMatch(expected::contains);
    }
}
```

O bean não lança “resource forbidden” com detalhes.

Ele apenas decide.

---

### 9. Atualizar annotations do service

Leitura por ID:

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_READ
        + "') and "
        + "@serviceOrderBusinessAuthorization"
        + ".canRead("
        + "authentication, "
        + "#serviceOrderId"
        + ")"
)
@Transactional(
        readOnly = true
)
public ServiceOrderResult findById(
        UUID serviceOrderId
) {
    // implementação existente
}
```

Update:

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_UPDATE
        + "') and "
        + "@serviceOrderBusinessAuthorization"
        + ".canUpdate("
        + "authentication, "
        + "#serviceOrderId"
        + ")"
)
```

Status:

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_STATUS_UPDATE
        + "') and "
        + "@serviceOrderBusinessAuthorization"
        + ".canTransitionStatus("
        + "authentication, "
        + "#serviceOrderId"
        + ")"
)
```

Delete:

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_DELETE
        + "') and "
        + "@serviceOrderBusinessAuthorization"
        + ".canDelete("
        + "authentication, "
        + "#serviceOrderId"
        + ")"
)
```

Create continua exigindo a permission.

Search receberá o escopo dentro do método.

---

### 10. Verificar nomes de parâmetros

As expressions usam:

```text
#serviceOrderId.
```

Confirme no `pom.xml`:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <parameters>true</parameters>
    </configuration>
</plugin>
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Não troque silenciosamente para índices como `#p0` sem documentar.

---

### 11. Derivar owner no create

No `create`:

```java
UUID ownerUserId =
        subjectResolver
                .requireCurrentUserId();

ServiceOrder serviceOrder =
        ServiceOrder.create(
                ownerUserId,
                command.customerName(),
                command.serviceType(),
                command.description(),
                command.serviceAddress(),
                command.scheduledFor(),
                clock
        );
```

O command não carrega owner.

---

### 12. Escopar o search

No começo do método:

```java
Authentication authentication =
        SecurityContextHolder
                .getContext()
                .getAuthentication();

ServiceOrderReadScope scope =
        businessAuthorization
                .readScope(
                        authentication
                );
```

Combine:

```java
Specification<ServiceOrder>
        specification =
        ServiceOrderSpecifications
                .withCriteria(
                        criteria
                )
                .and(
                        ServiceOrderSpecifications
                                .visibleTo(
                                        scope
                                )
                );

return repository.findAll(
        specification,
        pageable
);
```

A count query receberá o mesmo predicate.

---

### 13. Criar visibleTo

```java
public static Specification<ServiceOrder>
visibleTo(
        ServiceOrderReadScope scope
) {
    return (
            root,
            query,
            builder
    ) -> {
        return switch (scope.mode()) {
            case ALL ->
                    builder.conjunction();

            case OWNED ->
                    builder.equal(
                            root.get(
                                    "ownerUserId"
                            ),
                            scope.ownerUserId()
                    );

            case NONE ->
                    builder.disjunction();
        };
    };
}
```

Não aceite `scope` vindo do controller.

---

### 14. Tratar owner legado

Nos testes, insira uma OS com:

```text
owner_user_id null.
```

Resultados:

```text
operator:
não lê;
não atualiza;
não altera status;
não exclui.

auditor:
lê.

supervisor/admin:
lê e opera conforme permission.
```

Crie uma tarefa de reconciliação fora da aplicação.

Não adicione owner falso apenas para cumprir `NOT NULL`.

---

### 15. Testar criação segura

Com subject A:

```java
@Test
@WithMockUser(
        username =
            "11111111-1111-1111-1111-111111111111",
        authorities = {
            SERVICE_ORDER_CREATE
        }
)
void shouldAssignAuthenticatedSubjectAsOwner() {
    ServiceOrderResult result =
            service.create(
                    validCreateCommand()
            );

    ServiceOrder saved =
            repository
                    .findById(result.id())
                    .orElseThrow();

    assertThat(
            saved.getOwnerUserId()
    )
    .isEqualTo(
            UUID.fromString(
                "11111111-1111-1111-1111-111111111111"
            )
    );
}
```

---

### 16. Testar owner e não owner

Crie uma OS de A.

A:

```text
read:
permitido.

update:
permitido.

status:
permitido.
```

B com as mesmas permissions:

```text
read:
AccessDeniedException.

update:
AccessDeniedException.

status:
AccessDeniedException.
```

Confirme que nenhuma alteração ocorreu.

---

### 17. Testar auditor

Auditor com:

```text
ROLE_AUDITOR;

service-order:read.
```

pode ler OS de A e B.

Ele não atualiza porque não possui permission de update.

Mesmo que receba update por erro de provisionamento, a policy global write não inclui auditor; somente ownership permitiria, e ele não é owner.

---

### 18. Testar supervisor

Supervisor com:

```text
ROLE_SUPERVISOR;

service-order:update;

service-order:status:update;

service-order:delete.
```

pode atuar em OS de A.

O domínio ainda decide:

- versão;
- transição;
- estado;
- validation.

Autorização não garante sucesso de negócio.

---

### 19. Testar delete estrito

Crie um usuário que é owner e possui:

```text
service-order:delete.
```

mas não possui:

```text
ROLE_SUPERVISOR;

ROLE_ADMIN.
```

Resultado:

```text
AccessDeniedException.
```

O laboratório decidiu que delete exige permission e role privilegiada.

---

### 20. Testar busca escopada

Crie:

```text
três OS de A;

duas OS de B;

uma OS legada sem owner.
```

Operador A:

```text
totalElements:
3.
```

Operador B:

```text
totalElements:
2.
```

Auditor:

```text
totalElements:
6.
```

Use paginação pequena e valide também:

- conteúdo;
- total;
- número de páginas;
- filtros;
- ordenação.

---

### 21. Testar filtros combinados

Crie OS de A e B com o mesmo status.

Aplique:

```text
status=OPEN.
```

Operador A deve receber somente OPEN de A.

O predicate de negócio precisa ser combinado com o filtro funcional usando:

```text
AND.
```

Nunca use `OR` entre owner e filtros do usuário.

---

### 22. Testar subject inválido

Com:

```java
@WithMockUser(
        username = "operator",
        authorities = {
            SERVICE_ORDER_READ
        }
)
```

a resolução UUID falha.

Resultado:

```text
denied.
```

Não use username como fallback.

---

### 23. Testar UUID inexistente

Use um UUID válido sem OS.

O bean retorna:

```text
false.
```

O Method Security nega.

Não faça uma segunda decisão diferente no controller.

A aula 429 padronizará o contrato HTTP final.

---

### 24. Criar teste HTTP com JWT real

Persistir:

- usuário A;
- usuário B;
- OS de A.

Emitir JWT real para B.

Executar:

```http
GET /api/v2/service-orders/{id-da-A}
Authorization: Bearer <token-de-B>
```

Esperado nesta etapa:

```text
403.
```

Depois use o token de A:

```text
200.
```

Esse teste atravessa:

- signature;
- validators;
- authorities;
- Method Security;
- business bean;
- repository.

---

### 25. Criar teste de mass assignment

Além do JSON com owner, valide que:

- response pode apresentar owner somente se houver decisão explícita;
- update não troca owner;
- PATCH status não troca owner;
- mapper não lê owner de DTO;
- reflection ou BeanUtils não copia owner.

Evite:

```java
BeanUtils.copyProperties(
    request,
    entity
);
```

em objetos sensíveis.

---

### 26. Criar documento

Arquivo:

```text
docs/security/M15_BUSINESS_AUTHORIZATION.md
```

Inclua:

```markdown
# Autorizacao por regra de negocio

## Objetivo

Combinar permission e relacionamento com o recurso.

## Subject

UUID validado no JWT.

## Object

Service Order com owner imutavel.

## Policy

| Operacao | Owner | Auditor | Supervisor | Admin |
| ... |

## Search scope

- Operator: OWNED.
- Auditor: ALL.
- Supervisor: ALL.
- Admin: ALL.

## Legacy

Owner nulo falha fechado para operadores.

## Mass assignment

Owner nao pertence ao request.

## Limites

- Erros publicos serao refinados.
- Tenant ainda nao existe.
- Owner nao pode ser alterado.
- Auditoria detalhada ainda pendente.
```

---

### 27. Atualizar threat model

Adicione:

```text
THR-073:
operador troca UUID e acessa OS de outro.

THR-074:
owner é recebido do cliente.

THR-075:
listagem filtra depois da paginação.

THR-076:
owner nulo vira acesso público.

THR-077:
subject inválido usa username como fallback.

THR-078:
role privilegiada ignora permission.

THR-079:
autorização consulta entity inteira.

THR-080:
owner muda entre check e use.
```

Controles:

- owner backend;
- bean de autorização;
- scope SQL;
- fail closed;
- UUID subject;
- permission + role;
- projection;
- owner imutável.

---

### 28. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
request authorization:
implementada.

method authorization:
implementada.

relationship-based authorization:
implementada para owner.

error semantics:
pendente.

tenant isolation:
pendente.
```

Baseline:

```text
Service Order:
owner_user_id.

criação:
owner derivado do subject.

read:
owner ou role global.

write:
owner ou supervisor/admin.

delete:
supervisor/admin.

search:
escopo no SQL.

produção pública:
NO-GO.
```

---

### 29. Executar o gate

Teste direto:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderBusinessAuthorizationTest `
  test
```

Teste HTTP:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderBusinessAuthorizationIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- Flyway V10;
- PostgreSQL real;
- owner derivado;
- mass assignment rejeitado;
- owner e não owner;
- auditor;
- supervisor;
- legacy;
- paginação;
- JWT real;
- refresh verde;
- nenhuma authority desconhecida;
- nenhum token em logs.

---

## Entendendo o que foi feito

### A permission deixou de ser suficiente sozinha

O relacionamento com o recurso entrou na decisão.

### O owner veio do servidor

O cliente não escolhe a identidade proprietária.

### O subject ficou estável

A policy usa UUID, não username.

### O bean manteve SpEL curto

Annotations não receberam lógica extensa.

### A projection reduziu dados

A decisão consulta somente o necessário.

### Listagens foram filtradas no banco

Paginação e contagem permaneceram coerentes.

### Roles privilegiadas continuaram explícitas

Elas não ignoram a permission da operação.

### Owner legado falhou fechado

Ausência de vínculo não virou acesso de operador.

---

## Erros comuns importantes

### Verificar somente a permission

Isso permite acesso horizontal indevido.

### Receber owner no JSON

O cliente pode atribuir o recurso a outra identidade.

### Usar username como owner

Username é mutável.

### Filtrar a página em memória

A contagem e o conteúdo podem vazar.

### Colocar toda a regra na annotation

SpEL longo fica difícil de testar e revisar.

### Retornar true quando a OS não existe

A policy deixa de falhar fechado.

### Dar bypass por role sem permission

A regra de operação perde least privilege.

### Carregar a entity inteira para decidir

Mais dados são acessados que o necessário.

### Permitir alteração de owner sem policy

A relação usada pela autorização pode ser manipulada.

### Tratar UUID difícil como controle

Identificadores imprevisíveis não substituem autorização.

---

## Comandos úteis

### Teste direto

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderBusinessAuthorizationTest `
  test
```

### Teste HTTP

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderBusinessAuthorizationIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar owner em requests

```powershell
git grep `
  -n `
  -E `
  "CreateServiceOrderRequest.*owner|UpdateServiceOrderRequest.*owner"
```

### Procurar filtro em memória

```powershell
git grep `
  -n `
  -E `
  "findAll\\(\\).*stream|filter\\(.*owner"
```

### Consultar ownership

```sql
select
    id,
    owner_user_id,
    status,
    created_at
from
    service_order
order by
    created_at;
```

---

## Exercício guiado

### Parte 1 — Schema

Adicione owner com migration expand.

### Parte 2 — Domínio

Torne o owner obrigatório para novas OS e imutável.

### Parte 3 — Subject

Resolva UUID da Authentication.

### Parte 4 — Projection

Busque apenas dados de autorização.

### Parte 5 — Policy

Implemente owner e roles privilegiadas.

### Parte 6 — Method Security

Combine permission e bean.

### Parte 7 — Search

Aplique escopo na query.

### Parte 8 — Legacy

Negue operadores quando owner for nulo.

### Parte 9 — Testes

Compare dois usuários sobre o mesmo recurso.

### Parte 10 — Segurança

Teste mass assignment e atualize riscos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 427 foi preservada;
- permission e autorização por objeto foram diferenciadas;
- owner foi escolhido como relação do laboratório;
- `owner_user_id` foi criado por V10;
- foreign key foi criada sem cascade delete;
- índice de owner foi criado;
- coluna nullable foi justificada por registros legados;
- plano expand/migrate/contract foi documentado;
- novas OS exigem owner;
- owner não possui setter público;
- owner não pode ser alterado pelo update;
- owner não existe nos requests públicos;
- mass assignment foi testado;
- owner é derivado do subject autenticado;
- subject usa UUID;
- username não foi usado como fallback;
- `AuthenticatedSubjectResolver` foi criado;
- Authentication ausente ou anônima falha fechado;
- subject inválido falha fechado;
- `ServiceOrderAccessView` foi criado;
- projection contém somente dados necessários;
- repository possui query de acesso;
- `ServiceOrderReadScope` foi criado;
- modos ALL, OWNED e NONE foram definidos;
- `ServiceOrderBusinessAuthorization` foi criado;
- bean possui nome explícito para SpEL;
- componente é read-only;
- regra de leitura foi implementada;
- regra de update foi implementada;
- regra de status foi implementada;
- regra de delete foi implementada;
- auditor possui leitura global;
- supervisor e admin possuem escrita global conforme permission;
- delete exige role privilegiada e permission;
- owner nulo não autoriza operador;
- recurso inexistente retorna false na policy;
- exceptions não revelam valor sensível;
- annotations continuam curtas;
- `#serviceOrderId` foi usado;
- compilação com `-parameters` foi verificada;
- create continua protegido por permission;
- create persiste subject como owner;
- findById combina read e regra de negócio;
- update combina update e regra de negócio;
- status combina permission e regra de negócio;
- delete combina permission e role de negócio;
- search obtém escopo interno;
- owner não é filtro controlado pelo cliente;
- filtro é aplicado no SQL;
- count query recebe o mesmo escopo;
- NONE usa predicate false;
- filtros funcionais são combinados com AND;
- paginação não é filtrada em memória;
- dois operadores foram testados;
- owner foi permitido;
- não owner foi negado;
- auditor foi testado;
- supervisor foi testado;
- owner com delete sem role privilegiada foi negado;
- registros legados foram testados;
- subject inválido foi testado;
- UUID inexistente foi testado;
- JWT real foi usado no teste HTTP;
- token de outro usuário recebeu negação;
- token do owner recebeu acesso;
- writes negados não alteraram banco;
- TOCTOU foi discutido;
- owner imutável reduziu a janela;
- documento de business authorization foi criado;
- threat model foi atualizado;
- OWASP A01 foi atualizado sem ser encerrado;
- baseline foi atualizada;
- contrato final de erros não foi antecipado;
- multi-tenant não foi antecipado;
- gate completo foi executado;
- commit recomendado está pronto;
- ponte para a aula 429 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git grep -n -E "ownerUserId" `
  -- "*Request.java" "*Command.java"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): aplicar autorizacao por ownership da OS"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access token;
- refresh token;
- password;
- hash;
- private key;
- owner controlado pelo cliente;
- regra extensa em SpEL;
- filtro em memória;
- bypass por role sem permission;
- contrato de erro não revisado;
- migration antiga alterada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a autorização passou a considerar:

```text
subject;

permission;

role;

recurso;

relacionamento.
```

A regra deixou de ser apenas:

```text
possui service-order:read?
```

e passou a ser:

```text
possui read
e é owner
ou possui uma role
com visibilidade global?
```

A criação agora define:

```text
owner =
subject autenticado.
```

O cliente não controla esse campo.

A busca aplica:

```text
owner_user_id = subject
```

diretamente no SQL para operadores.

Auditores, supervisores e administradores recebem escopo global conforme a policy.

O bean:

```text
serviceOrderBusinessAuthorization
```

mantém a lógica fora da annotation.

As expressions continuam curtas e testáveis.

A decisão central foi:

```text
permissions descrevem capacidades;

a regra de negócio decide
se essa capacidade pode ser aplicada
ao recurso concreto;

e identificadores nunca substituem
a verificação de relacionamento.
```

Ainda existe uma pergunta delicada:

```text
quando o recurso não existe
ou pertence a outro usuário,
qual resposta pública deve ser devolvida?
```

Também é necessário padronizar:

- token ausente;
- token inválido;
- credencial inválida;
- permission ausente;
- regra de negócio negada;
- endpoint negado;
- recurso inexistente;
- logging seguro desses eventos.

Esse será o foco da próxima aula:

```text
429 - M15.19 - Erros de autenticacao e autorizacao
```

---

# Material complementar

## Checkpoint final

- [ ] Adicionei owner sem aceitar mass assignment.
- [ ] Resolvi o subject UUID de forma segura.
- [ ] Combinei permission e relacionamento.
- [ ] Filtrei listagens no SQL.
- [ ] Testei owner, não owner e roles privilegiadas.

---

## Troubleshooting adicional

### O bean não é encontrado no SpEL

Confirme:

```java
@Component(
    "serviceOrderBusinessAuthorization"
)
```

e o nome usado na annotation.

### #serviceOrderId é null

Confirme `-parameters`, nome do argumento e clean build.

### Operador vê todas as OS

Revise `readScope`, `visibleTo` e combinação da specification.

### TotalElements está incorreto

O owner precisa participar da count query.

Não filtre o conteúdo depois de `findAll`.

### Supervisor recebe 403

Confirme:

- permission da operação;
- role exata;
- token renovado;
- catálogo;
- validator.

### Owner não consegue acessar

Confirme que `sub` e `owner_user_id` representam o mesmo UUID.

### Owner nulo permite operador

`isOwner` precisa retornar false quando o campo é nulo.

### JSON com owner é aceito

Confirme configuração de unknown properties e ausência do campo nos DTOs.

### A autorização faz duas queries

Esse é o desenho inicial com projection.

Meça antes de alterar e preserve a decisão antes da mutação.

---

## Perguntas de revisão

1. Permission garante acesso a toda OS?
2. Qual relação foi modelada?
3. De onde vem o owner?
4. O request pode escolher owner?
5. Qual claim identifica o usuário?
6. Por que usar UUID?
7. O que faz o bean de autorização?
8. Por que usar projection?
9. Quem possui leitura global?
10. Quem possui escrita global?
11. Delete exige quais condições?
12. O que ocorre com owner nulo?
13. Como operador pesquisa OS?
14. Onde o filtro é aplicado?
15. Pode filtrar depois da paginação?
16. O que significa fail closed?
17. O que é TOCTOU?
18. O contrato final de erro já foi concluído?
19. Qual é a próxima aula?
20. Qual será o foco dela?

---

## Roteiro de resposta

1. Não.
2. Ownership.
3. Do subject autenticado.
4. Não.
5. `sub`.
6. É identificador estável.
7. Combina identidade, role e recurso.
8. Consultar somente dados necessários.
9. Auditor, supervisor e admin.
10. Supervisor e admin.
11. Permission e role privilegiada.
12. Operador é negado.
13. Com escopo OWNED.
14. No SQL.
15. Não.
16. Falhas resultam em negação.
17. Intervalo entre check e uso.
18. Não.
19. Erros de autenticação e autorização.
20. Padronizar respostas e evitar vazamento.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 428 - M15.18 - Autorizacao por regra de negocio

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei permission e acesso ao objeto concreto.
- Modelei ownership para Ordem de Serviço.
- Criei `V10__add_service_order_owner.sql`.
- Adicionei `owner_user_id` com FK e índice.
- Usei expand/migrate/contract para registros legados.
- Mantive owner nulo como estado restrito.
- Tornei owner obrigatório para novas OS.
- Não criei setter de owner.
- Removi owner dos requests e commands.
- Impedi mass assignment.
- Derivei owner do subject autenticado.
- Criei `AuthenticatedSubjectResolver`.
- Usei UUID do claim `sub`.
- Não usei username como fallback.
- Criei `ServiceOrderAccessView`.
- Consultei somente dados necessários à autorização.
- Criei `ServiceOrderReadScope`.
- Criei `ServiceOrderBusinessAuthorization`.
- Mantive expressions SpEL curtas.
- Combinei permission e regra de ownership.
- Permiti leitura global para auditor, supervisor e admin.
- Permiti escrita global para supervisor e admin.
- Exigi role privilegiada e permission para delete.
- Neguei operadores em registros legados sem owner.
- Apliquei escopo de listagem no SQL.
- Preservei paginação e count query.
- Não filtrei resultados em memória.
- Testei dois operadores sobre o mesmo recurso.
- Testei owner, não owner, auditor e supervisor.
- Testei delete estrito.
- Testei subject inválido e UUID inexistente.
- Testei mass assignment.
- Testei o fluxo HTTP com JWT real.
- Documentei TOCTOU e owner imutável.
- Criei `docs/security/M15_BUSINESS_AUTHORIZATION.md`.
- Atualizei baseline, threat model e OWASP.
- Mantive o contrato definitivo de erros para a próxima aula.
- Próxima aula: Erros de autenticacao e autorizacao.
```

---

## Referência técnica curta

- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Security — Authorization Architecture](https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html)
- [Spring Security — Authorize HttpServletRequests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
- [Spring Data JPA — Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)

Regra final:

```text
a autorização de negócio precisa combinar a capacidade geral da identidade com a relação dela com o recurso concreto: nesta baseline, a Ordem de Serviço recebe um owner imutável derivado do subject UUID, o cliente não controla esse vínculo, @PreAuthorize combina permission e um bean Java testável, operadores acessam somente recursos próprios, roles privilegiadas recebem escopo explícito sem ignorar permissions, owner ausente falha fechado, listagens são filtradas no SQL antes da paginação e qualquer inconsistência de identidade ou recurso resulta em negação; a próxima aula padronizará como essas negações aparecem publicamente.
```
