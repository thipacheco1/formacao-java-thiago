# 376 - M14.21 - CRUD completo parte 2

## Apresentacao da aula

Na aula 375, você integrou a primeira metade de um CRUD profissional.

O recurso:

```text
managed runtime message
```

passou a oferecer:

```text
POST /api/v1/runtime/managed-messages;

GET /api/v1/runtime/managed-messages/{id};

GET /api/v1/runtime/managed-messages.
```

O fluxo de criação ficou completo:

```text
request DTO;

Bean Validation;

web mapper;

create command;

application service;

transacao;

repository port;

adapter Spring Data;

PostgreSQL;

created response;

201;

Location;

ETag;

Last-Modified.
```

A leitura individual preservou:

- 200;
- 304;
- ETag;
- `If-None-Match`;
- `Last-Modified`;
- 404 com Problem Details.

A coleção nasceu com:

- paginação;
- filtro;
- ordenação por whitelist;
- summary DTO;
- metadata;
- headers de total;
- links de navegação.

Agora falta completar o ciclo de vida do recurso.

A pergunta central desta aula será:

```text
como completar o CRUD
com atualizacao, exclusao
e controle de concorrencia?
```

A segunda parte implementará:

```text
PUT /api/v1/runtime/managed-messages/{id};

DELETE /api/v1/runtime/managed-messages/{id}.
```

O endpoint DELETE já existia em uma versão introdutória.

Nesta aula, ele será revisado para participar do mesmo modelo de concorrência adotado pela atualização.

A atualização utilizará:

```text
PUT.
```

O motivo é prático.

O recurso possui atualmente apenas um campo editável pelo cliente:

```text
value.
```

O request de PUT representará a substituição completa dos campos editáveis da representação.

A comparação aprofundada entre PUT e PATCH será feita somente na próxima aula:

```text
377 - M14.22 - PUT vs PATCH
```

Nesta aula, você não criará:

- PATCH;
- JSON Merge Patch;
- JSON Patch;
- campos opcionais de atualização parcial;
- máscara de campos;
- null com semântica de remoção;
- endpoint alternativo de update.

O PUT será construído corretamente e servirá de baseline para a comparação da aula 377.

A atualização e a exclusão utilizarão preconditions HTTP.

O cliente precisará enviar:

```http
If-Match: "v3"
```

A ETag representa a versão atual da representação.

Quando o header não estiver presente:

```text
428 Precondition Required.
```

Quando a versão estiver desatualizada:

```text
412 Precondition Failed.
```

Quando o recurso não existir:

```text
404 Not Found.
```

Quando o novo valor conflitar com outro recurso:

```text
409 Conflict.
```

Essas categorias não serão confundidas.

A aplicação continuará utilizando:

```text
@Version
```

na entity JPA.

A verificação de versão ocorrerá em duas camadas.

Primeira:

```text
application service:
comparacao antecipada
para produzir a falha esperada.
```

Segunda:

```text
Hibernate e PostgreSQL:
optimistic locking
como protecao contra corrida real.
```

Essa dupla proteção é necessária porque duas requests podem ler a mesma versão antes de uma delas gravar.

O banco continuará sendo a autoridade final para:

- optimistic locking;
- constraint única;
- atomicidade;
- rollback.

Uma migration V2 adicionará:

```text
updated_at.
```

O recurso passará a possuir:

```text
createdAt;

updatedAt;

version.
```

`createdAt` não muda.

`updatedAt` muda apenas quando a representação realmente muda.

`version` aumenta apenas quando ocorre update persistente.

Um PUT que envia exatamente o mesmo valor será tratado como:

```text
no-op update.
```

Resultado:

- 200;
- mesma representação;
- mesma ETag;
- mesmo `updatedAt`;
- nenhuma escrita desnecessária;
- nenhuma nova versão.

Essa decisão melhora:

- idempotência;
- observabilidade;
- redução de updates;
- estabilidade de cache;
- concorrência.

O DELETE será idempotente quanto ao efeito.

Primeira request válida:

```text
204 No Content.
```

Segunda request para o mesmo recurso:

```text
404 Not Found.
```

Idempotência não exige respostas idênticas.

Ela exige que repetir a operação não produza efeitos adicionais incompatíveis.

O handler global continuará produzindo:

```text
ProblemDetail;

application/problem+json;

type;

title;

status;

detail;

instance;

code;

timestamp;

correlationId.
```

Novos codes:

```text
precondition_required;

precondition_failed;

invalid_entity_tag.
```

Nenhum detalhe de Hibernate, SQL ou versão interna será exposto além da ETag pública.

O projeto permanece em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
377 - M14.22 - PUT vs PATCH
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
372:
repository layer Spring Data.

373:
Exception Handler global.

374:
Problem Details e padrao de erro.

375:
CRUD completo parte 1.

376:
CRUD completo parte 2.

377:
PUT vs PATCH.

378:
Paginacao e ordenacao em API.
```

A aula 375 respondeu:

```text
como integrar create,
read by id e listagem
em um CRUD profissional?
```

A aula 376 responderá:

```text
como completar o ciclo de vida
com update, delete,
preconditions e optimistic locking?
```

Nesta aula:

```text
PUT:
sim.

DELETE revisitado:
sim.

PATCH:
nao.

If-Match:
sim.

ETag forte:
sim.

428:
sim.

412:
sim.

404:
sim.

409:
sim.

@Version:
sim.

updatedAt:
sim.

migration V2:
sim.

no-op update:
sim.

optimistic locking real:
sim.

concorrencia:
sim.

Problem Details:
integrado.

soft delete:
nao.
```

A regra central será:

```text
quem altera ou remove um recurso
deve provar qual versao observou,
e o banco deve impedir
que uma escrita antiga sobrescreva
uma alteracao mais recente.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageUseCases.java
│       ├── ManagedRuntimeMessageApplicationService.java
│       ├── command
│       │   ├── ManagedRuntimeMessageReplaceCommand.java
│       │   └── ManagedRuntimeMessageDeleteCommand.java
│       ├── exception
│       │   ├── ManagedRuntimeMessagePreconditionFailedException.java
│       │   └── ManagedRuntimeMessageConflictException.java
│       └── port
│           ├── ManagedRuntimeMessageReplacement.java
│           └── ManagedRuntimeMessageRepositoryPort.java
├── domain
│   └── managedmessage
│       └── ManagedRuntimeMessage.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── adapter
│           │   └── SpringDataManagedRuntimeMessageRepositoryAdapter.java
│           ├── entity
│           │   └── ManagedRuntimeMessageJpaEntity.java
│           └── mapper
│               └── ManagedRuntimeMessagePersistenceMapper.java
└── web
    ├── controller
    │   └── ManagedRuntimeMessageController.java
    ├── etag
    │   ├── ManagedRuntimeMessageEntityTag.java
    │   └── ManagedRuntimeMessageIfMatchParser.java
    ├── exception
    │   ├── InvalidIfMatchHeaderException.java
    │   └── MissingIfMatchHeaderException.java
    ├── mapper
    │   └── ManagedRuntimeMessageWebMapper.java
    ├── request
    │   └── ReplaceManagedRuntimeMessageRequest.java
    └── response
        └── ManagedRuntimeMessageUpdatedResponse.java
```

Migration:

```text
src/main/resources/db/migration
└── V2__add_updated_at_to_managed_runtime_message.sql
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageReplaceUseCaseTest.java
│       ├── ManagedRuntimeMessageDeleteUseCaseTest.java
│       └── ManagedRuntimeMessageNoOpUpdateTest.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── ManagedRuntimeMessageUpdateRepositoryTest.java
│           ├── ManagedRuntimeMessageOptimisticLockingIT.java
│           ├── ManagedRuntimeMessageConcurrentUpdateIT.java
│           └── ManagedRuntimeMessageVersionedDeleteIT.java
└── web
    ├── ManagedRuntimeMessageEntityTagTest.java
    ├── ManagedRuntimeMessageIfMatchParserTest.java
    ├── ManagedRuntimeMessagePutWebMvcTest.java
    ├── ManagedRuntimeMessageDeleteWebMvcTest.java
    ├── ManagedRuntimeMessagePreconditionProblemDetailTest.java
    ├── ManagedRuntimeMessageCrudPartTwoContractTest.java
    ├── ManagedRuntimeMessageCrudPartTwoArchitectureTest.java
    └── ManagedRuntimeMessageCrudPartTwoLiveServerIT.java
```

Documentação:

```text
docs
├── update-resource-contract.md
├── delete-resource-contract.md
├── etag-version-contract.md
├── if-match-preconditions.md
├── optimistic-locking.md
├── precondition-status-codes.md
├── no-op-update.md
├── delete-idempotency.md
├── updated-at-migration.md
├── concurrent-update-test-strategy.md
└── crud-part-two-baseline.md
```

Scripts:

```text
scripts
├── 111_atualizar_managed_message.ps1
├── 112_testar_if_match_obrigatorio.ps1
├── 113_testar_etag_desatualizada.ps1
├── 114_excluir_managed_message.ps1
├── 115_testar_updates_concorrentes.ps1
└── 116_executar_testes_crud_parte_2.ps1
```

Resultados esperados:

```text
PUT valido:
200.

PUT sem If-Match:
428.

PUT com header invalido:
400.

PUT com ETag antiga:
412.

PUT em id ausente:
404.

PUT duplicado:
409.

PUT com mesmo valor:
200 sem nova version.

PUT com valor novo:
version incrementada.

DELETE valido:
204.

DELETE sem If-Match:
428.

DELETE com ETag antiga:
412.

DELETE ausente:
404.

dois updates concorrentes:
um sucesso e um precondition failure.

updatedAt:
muda somente em update real.

createdAt:
permanece.

PATCH:
zero.
```

---

## Conceito essencial

### Update completo

PUT representa a substituição da representação editável do recurso identificado pela URI.

Nesta feature, o único campo editável é:

```text
value.
```

O request completo é:

```json
{
  "value": "novo valor"
}
```

Se novos campos editáveis forem adicionados no futuro, o contrato de PUT precisará declarar todos os campos necessários.

A aula 377 comparará isso com PATCH.

---

### PUT e idempotencia

PUT é definido como idempotente.

Repetir a mesma intenção não deve produzir efeitos cumulativos.

Isso não significa:

- mesma data de resposta;
- mesmos logs;
- mesma latência;
- mesmo status em toda condição;
- mesma ETag quando a primeira operação alterou o recurso.

O estado final pretendido precisa permanecer equivalente.

---

### No-op update

Quando o valor recebido já é igual ao valor persistido após normalização:

```text
nenhuma escrita.
```

O application service retorna o modelo atual.

Consequências:

- version não muda;
- updatedAt não muda;
- ETag não muda;
- nenhuma query de update;
- resposta continua 200.

O teste precisa comprovar que o port de update não foi chamado.

---

### ETag

ETag é um validator da representação.

A baseline usará tags fortes:

```http
ETag: "v0"
```

Depois de um update real:

```http
ETag: "v1"
```

A tag é válida no contexto da URI do recurso.

Não precisa conter o id porque o recurso já está identificado pela request URI.

---

### Strong versus weak

Strong ETag representa equivalência byte a byte ou uma equivalência forte definida para a representação.

Weak ETag utiliza:

```text
W/"..."
```

`If-Match` exige comparação forte.

A baseline rejeitará weak tags.

O parser aceitará somente uma tag forte no formato:

```text
"v<numero-nao-negativo>".
```

---

### If-Match

`If-Match` permite que a operação prossiga somente quando o validator atual corresponde ao informado.

Fluxo:

```text
cliente faz GET;

recebe ETag "v3";

cliente altera localmente;

envia PUT com If-Match "v3";

servidor compara;

grava somente se a versao continua 3.
```

Isso evita lost update.

---

### Lost update

Lost update ocorre quando:

1. cliente A lê versão 3;
2. cliente B lê versão 3;
3. A grava e produz versão 4;
4. B grava sua cópia antiga;
5. mudança de A é perdida.

Com `If-Match` e optimistic locking:

```text
A:
sucesso.

B:
412.
```

B precisa buscar a versão atual e decidir como reconciliar.

---

### 428 Precondition Required

428 informa:

```text
esta operacao exige uma precondition.
```

O header ausente não é o mesmo que uma ETag desatualizada.

Por isso:

```text
header ausente:
428.

header presente e antiga:
412.
```

O controller receberá o header como opcional para poder produzir 428 conscientemente.

---

### 412 Precondition Failed

412 informa que a precondition enviada não é satisfeita pelo estado atual.

Exemplo:

```text
If-Match "v2";

versao atual "v3".
```

Não use 409 para esse cenário.

409 será reservado a conflitos de estado que não são validators HTTP, como valor duplicado.

---

### Header invalido

Exemplos inválidos:

```text
v3;

W/"v3";

"abc";

"v-1";

"v3","v4";

*.
```

A baseline aceita uma tag forte única.

Valores fora do contrato retornam:

```text
400 invalid_entity_tag.
```

O wildcard será discutido como extensão possível, mas não será implementado nesta baseline.

---

### If-Match no DELETE

DELETE também altera estado.

Ele exigirá `If-Match`.

Isso impede que um cliente remova uma versão mais recente que nunca observou.

Fluxo:

```text
GET;

ETag;

DELETE com If-Match;

204.
```

---

### @Version

A entity já possui:

```java
@Version
private long version;
```

Hibernate inclui a versão em operações de update e delete.

Conceitualmente:

```sql
update managed_runtime_message
set value = ?,
    updated_at = ?,
    version = version + 1
where id = ?
  and version = ?;
```

Se nenhuma row for alterada, ocorreu conflito otimista ou ausência concorrente.

---

### Verificacao antecipada e final

O service compara:

```text
command.expectedVersion
com
current.version.
```

Isso produz 412 antes de tentar gravar.

Porém, outra transação pode alterar a row depois dessa comparação.

Por isso, a versão JPA continua obrigatória.

A aplicação não depende somente do check antecipado.

---

### ObjectOptimisticLockingFailureException

Spring pode traduzir a falha otimista para:

```text
ObjectOptimisticLockingFailureException.
```

O adapter converte essa falha para uma exception da aplicação ou da porta.

A camada web não conhece a exception Spring ORM.

---

### Constraint unica durante update

O valor novo pode colidir com outro recurso.

O service executa um precheck excluindo o próprio id.

O banco continua com constraint única.

Corrida:

```text
A verifica:
livre.

B verifica:
livre.

A atualiza.

B tenta atualizar.
```

A constraint final transforma o segundo fluxo em conflito.

---

### updatedAt

`updatedAt` representa a última mudança real da representação.

Na criação:

```text
updatedAt = createdAt.
```

No update real:

```text
updatedAt = Instant.now(clock).
```

No no-op:

```text
updatedAt permanece.
```

O GET passa a usar `updatedAt` em `Last-Modified`.

---

### Migration V2

A tabela já possui rows.

Por isso, a migration precisa:

1. adicionar coluna nullable;
2. preencher com `created_at`;
3. tornar not null;
4. adicionar check de coerência.

Exemplo:

```sql
alter table managed_runtime_message
    add column updated_at timestamptz;

update managed_runtime_message
set updated_at = created_at;

alter table managed_runtime_message
    alter column updated_at set not null;
```

Não use default permanente sem necessidade.

---

### Update command

Command:

```java
public record ManagedRuntimeMessageReplaceCommand(
        long id,
        String value,
        long expectedVersion
) {
}
```

Ele contém intenção de aplicação.

Não contém:

- `If-Match`;
- ETag string;
- `HttpHeaders`;
- `HttpStatus`.

O web mapper transforma version parsed para `expectedVersion`.

---

### Replacement do port

O adapter receberá:

```java
public record ManagedRuntimeMessageReplacement(
        long id,
        String value,
        String normalizedValue,
        Instant updatedAt,
        long expectedVersion
) {
}
```

Esse tipo pertence à fronteira de persistência da aplicação.

Ele não contém entity JPA.

---

### Update no adapter

Fluxo:

1. buscar entity;
2. se ausente, not found;
3. comparar version;
4. aplicar campos permitidos;
5. `saveAndFlush`;
6. mapear para domínio;
7. traduzir optimistic lock;
8. traduzir unique constraint.

Não use bulk update nesta aula.

Bulk update ignora facilmente o persistence context e exige cuidado explícito com version.

---

### Dirty checking

A entity carregada dentro da transação é gerenciada.

Ao alterar seus campos, Hibernate detecta a mudança.

`saveAndFlush` torna o momento da execução visível para os testes.

O commit continua sendo a confirmação da transação.

---

### Delete versionado

O adapter carrega a entity.

Verifica version.

Executa:

```text
delete;

flush.
```

A version participa do delete.

Uma alteração concorrente pode provocar optimistic locking failure.

---

### Ordem das falhas

Para PUT e DELETE:

```text
header ausente:
428 antes do caso de uso.

header invalido:
400 antes do caso de uso.

id ausente:
404.

id existente e versao antiga:
412.

valor duplicado:
409.
```

Os testes precisam fixar essa política.

---

### Response de update

Crie:

```java
public record ManagedRuntimeMessageUpdatedResponse(
        long id,
        String value,
        Instant createdAt,
        Instant updatedAt,
        long version
) {
}
```

Resposta:

```text
200 OK.
```

Headers:

- ETag nova;
- Last-Modified atualizado;
- Cache-Control;
- correlation id.

---

### Detail e summary

Detail response passará a incluir:

```text
updatedAt.
```

Summary também pode incluir `updatedAt` para informar a última alteração.

A ordenação pública continuará a baseline da aula 375.

A aula 378 aprofundará paginação e ordenação.

---

### Problem Details

Novos mappings:

```text
MissingIfMatchHeaderException:
428 precondition_required.

InvalidIfMatchHeaderException:
400 invalid_entity_tag.

ManagedRuntimeMessagePreconditionFailedException:
412 precondition_failed.
```

O detail é público.

A versão atual não será publicada no detail do erro.

O cliente deve executar novo GET.

---

### Idempotencia do DELETE

Primeiro DELETE:

```text
204.
```

Segundo DELETE:

```text
404.
```

O efeito final continua:

```text
recurso ausente.
```

Isso é compatível com idempotência.

Não recrie o recurso ou gere efeito adicional.

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

Docker precisa estar ativo.

---

### 2. Criar migration V2

Arquivo:

```text
V2__add_updated_at_to_managed_runtime_message.sql.
```

Conteúdo:

```sql
alter table managed_runtime_message
    add column updated_at timestamptz;

update managed_runtime_message
set updated_at = created_at;

alter table managed_runtime_message
    alter column updated_at set not null;

alter table managed_runtime_message
    add constraint ck_managed_runtime_message_updated_at
        check (
            updated_at >= created_at
        );
```

Não edite V1.

---

### 3. Evoluir domain model

Adicione:

```text
updatedAt.
```

Invariantes:

- createdAt não nulo;
- updatedAt não nulo;
- updatedAt não anterior a createdAt;
- version não negativa.

---

### 4. Evoluir entity

Adicione:

```java
@Column(
        name = "updated_at",
        nullable = false
)
private Instant updatedAt;
```

Na criação:

```text
createdAt e updatedAt iguais.
```

Crie método package-private:

```java
void replace(
        String value,
        String normalizedValue,
        Instant updatedAt
) {
}
```

Não permita alterar id, createdAt ou version diretamente.

---

### 5. Evoluir persistence mapper

Atualize:

```text
new draft para entity;

entity para domain.
```

Inclua updatedAt.

Não gere version manualmente.

---

### 6. Criar Replace request

```java
public record ReplaceManagedRuntimeMessageRequest(
        @RuntimeMessageValue
        String value
) {
}
```

Não use fields opcionais.

Isso representa a forma completa editável.

---

### 7. Criar EntityTag formatter

`ManagedRuntimeMessageEntityTag`:

```text
format(version):
"v3".
```

Valide version não negativa.

Use o mesmo formatter em POST, GET e PUT.

---

### 8. Criar If-Match parser

Entrada:

```text
String header.
```

Saída:

```text
long expectedVersion.
```

Regras:

- null ou blank gera missing exception;
- uma strong ETag;
- formato `"vN"`;
- N não negativo;
- weak rejeitada;
- múltiplas rejeitadas;
- wildcard rejeitado nesta baseline.

---

### 9. Criar exceptions web

`MissingIfMatchHeaderException`.

`InvalidIfMatchHeaderException`.

Elas pertencem à camada web porque representam parsing e presença de um header HTTP.

Não coloque essas classes na application layer.

---

### 10. Criar Replace command

Campos:

```text
id;

value;

expectedVersion.
```

Invariantes:

- id positivo;
- value não nulo;
- expectedVersion não negativa.

---

### 11. Criar Delete command

```java
public record ManagedRuntimeMessageDeleteCommand(
        long id,
        long expectedVersion
) {
}
```

O application service recebe sem conhecer If-Match.

---

### 12. Criar Replacement do port

Campos:

```text
id;

value;

normalizedValue;

updatedAt;

expectedVersion.
```

Use record imutável.

---

### 13. Evoluir repository port

Adicione:

```java
ManagedRuntimeMessage replace(
        ManagedRuntimeMessageReplacement replacement
);

void delete(
        long id,
        long expectedVersion
);
```

Mantenha find, create e search.

Remova o delete boolean antigo.

---

### 14. Evoluir input port

Adicione:

```java
ManagedRuntimeMessage replace(
        ManagedRuntimeMessageReplaceCommand command
);

void delete(
        ManagedRuntimeMessageDeleteCommand command
);
```

Não exponha ETag string.

---

### 15. Implementar replace no service

Fluxo:

1. buscar current;
2. not found quando ausente;
3. comparar expected version;
4. lançar precondition failed quando diferente;
5. normalizar novo value;
6. detectar no-op;
7. verificar duplicidade excluindo id;
8. criar replacement com Clock;
9. chamar port;
10. traduzir conflito concorrente;
11. retornar atualizado.

Método:

```text
@Transactional.
```

---

### 16. Implementar no-op

Compare:

```text
current.normalizedValue
com
new normalizedValue.
```

Se iguais:

```text
return current.
```

Não chame:

- exists duplicate;
- replace;
- Clock para updatedAt.

A versão informada precisa ser validada antes do no-op.

---

### 17. Verificar duplicidade excluindo id

Evolua o port com:

```java
boolean existsByNormalizedValueAndIdNot(
        String normalizedValue,
        long id
);
```

Repository Spring Data:

```java
boolean existsByNormalizedValueAndIdNot(
        String normalizedValue,
        Long id
);
```

---

### 18. Implementar replace no adapter

Busque entity.

Compare version.

Aplique replacement.

Execute:

```text
saveAndFlush.
```

Traduza:

- entity ausente;
- optimistic locking;
- unique constraint;
- persistence failure genérica.

---

### 19. Implementar delete no service

Fluxo:

1. buscar current;
2. not found;
3. comparar version;
4. chamar port delete.

Método read-write.

---

### 20. Implementar delete no adapter

Busque entity.

Compare version.

Execute:

```text
repository.delete(entity);

repository.flush().
```

Traduza optimistic lock.

---

### 21. Criar response de update

Inclua:

```text
id;

value;

createdAt;

updatedAt;

version.
```

Atualize detail e summary conforme baseline definida.

---

### 22. Evoluir web mapper

Adicione:

```text
toReplaceCommand;

toDeleteCommand;

toUpdatedResponse.
```

O mapper recebe a versão já parseada.

Não parseie header dentro do application mapper.

---

### 23. Criar PUT endpoint

```java
@PutMapping(
        "/{id}"
)
```

Entradas:

- id;
- `If-Match`;
- request body.

Fluxo:

1. parser;
2. mapper;
3. use case;
4. response mapper;
5. headers;
6. 200.

---

### 24. Revisar DELETE endpoint

Receba:

```text
If-Match.
```

Fluxo:

1. parser;
2. command;
3. use case;
4. 204.

Sem body.

---

### 25. Atualizar ETag e Last-Modified

POST:

```text
ETag da version criada;

Last-Modified de updatedAt.
```

GET:

```text
ETag atual;

Last-Modified de updatedAt.
```

PUT:

```text
ETag nova ou preservada no no-op;

Last-Modified de updatedAt.
```

---

### 26. Evoluir Problem Types

Adicione:

```text
PRECONDITION_REQUIRED;

PRECONDITION_FAILED;

INVALID_ENTITY_TAG.
```

---

### 27. Evoluir Problem Codes

Adicione:

```text
precondition_required;

precondition_failed;

invalid_entity_tag.
```

---

### 28. Evoluir GlobalExceptionHandler

Handlers:

```text
MissingIfMatchHeaderException:
428.

InvalidIfMatchHeaderException:
400.

ManagedRuntimeMessagePreconditionFailedException:
412.
```

Use `ApiProblemFactory`.

Mantenha application/problem+json.

---

### 29. Adicionar mensagens

Base:

```properties
problem.precondition-required.title=Precondition required
problem.precondition-required.detail=The If-Match header is required
problem.precondition-failed.title=Precondition failed
problem.precondition-failed.detail=The resource has changed since it was read
problem.invalid-entity-tag.title=Invalid entity tag
problem.invalid-entity-tag.detail=The If-Match header is invalid
```

Adicione pt-BR.

---

### 30. Testar migration

Valide:

- V1 e V2 aplicadas;
- updated_at not null;
- rows antigas copiadas;
- check constraint;
- Hibernate validate.

---

### 31. Testar entity update

Persistir entity.

Atualizar.

Flush e clear.

Buscar novamente.

Confirmar:

- value novo;
- normalized novo;
- updatedAt novo;
- createdAt igual;
- version incrementada.

---

### 32. Testar optimistic locking

Use duas transações independentes.

Ambas carregam versão zero.

Primeira atualiza e confirma.

Segunda tenta atualizar.

Espere optimistic locking failure traduzida.

Não execute as duas alterações na mesma persistence context.

---

### 33. Testar updates concorrentes

Use executor com duas requests ou duas transações.

Ambas utilizam a mesma ETag.

Resultado:

```text
um sucesso;

uma falha 412.
```

Estado final possui somente um dos valores.

Version aumenta uma vez.

---

### 34. Testar no-op

Current value:

```text
Spring MVC.
```

PUT:

```text
spring mvc
```

Se a normalização considera equivalentes:

- 200;
- version igual;
- updatedAt igual;
- port replace não chamado.

Documente a normalização.

---

### 35. Testar conflito de valor

Crie dois recursos.

Atualize o primeiro com o valor do segundo.

Espere:

```text
409.
```

Teste precheck e constraint única.

---

### 36. Testar delete versionado

Cenários:

- versão atual: 204;
- versão antiga: 412;
- ausente: 404;
- sem header: 428;
- header inválido: 400;
- repetição após sucesso: 404.

---

### 37. Criar EntityTagTest

Teste:

- version zero;
- version grande;
- negative rejeitada;
- aspas corretas;
- strong tag.

---

### 38. Criar IfMatchParserTest

Teste:

- null;
- blank;
- `"v0"`;
- `"v42"`;
- sem aspas;
- weak;
- wildcard;
- múltiplas;
- negativa;
- conteúdo arbitrário.

---

### 39. Criar PUT WebMvcTest

Cenários:

- sucesso;
- no-op;
- missing header;
- invalid header;
- stale;
- not found;
- duplicate;
- invalid body.

Valide:

- status;
- body;
- ETag;
- Last-Modified;
- Problem Details;
- use case não chamado em falha web.

---

### 40. Criar DELETE WebMvcTest

Valide:

- 204;
- body vazio;
- 428;
- 400;
- 412;
- 404;
- command correto.

---

### 41. Criar ContractTest

Updated response:

```text
id;

value;

createdAt;

updatedAt;

version.
```

Detail:

```text
inclui updatedAt.
```

ETag:

```text
formato "vN".
```

Problem codes:

```text
estaveis.
```

---

### 42. Criar ArchitectureTest

Valide:

- web parser não está na application;
- command não contém HttpHeaders;
- application não importa Spring Web;
- port não importa JPA;
- adapter concentra optimistic locking;
- entity versionada;
- controller sem EntityManager;
- zero PATCH;
- zero JSON Merge Patch;
- zero JSON Patch;
- migration V2 presente;
- V1 não alterada.

---

### 43. Criar teste live

Fluxo:

1. POST;
2. capturar Location e ETag;
3. PUT sem If-Match;
4. PUT com ETag válida;
5. capturar ETag nova;
6. PUT com ETag antiga;
7. GET e confirmar estado;
8. PUT no-op com ETag nova;
9. DELETE com ETag nova;
10. repetir DELETE;
11. validar Problems.

Use PostgreSQLContainer.

---

### 44. Criar documentacao

`update-resource-contract.md` documenta PUT.

`delete-resource-contract.md` documenta DELETE.

`etag-version-contract.md` documenta `"vN"`.

`if-match-preconditions.md` documenta fluxo.

`optimistic-locking.md` documenta `@Version`.

`precondition-status-codes.md` diferencia 400, 404, 409, 412 e 428.

`no-op-update.md` documenta versão preservada.

`delete-idempotency.md` diferencia efeito e resposta.

`updated-at-migration.md` documenta V2.

`concurrent-update-test-strategy.md` documenta transações independentes.

`crud-part-two-baseline.md` consolida contratos.

---

### 45. Criar scripts

`111_atualizar_managed_message.ps1` recebe id, value e ETag.

`112_testar_if_match_obrigatorio.ps1` espera 428.

`113_testar_etag_desatualizada.ps1` produz 412.

`114_excluir_managed_message.ps1` usa If-Match.

`115_testar_updates_concorrentes.ps1` executa duas alterações.

`116_executar_testes_crud_parte_2.ps1` executa a suite.

---

### 46. Executar unit tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageReplaceUseCaseTest,ManagedRuntimeMessageDeleteUseCaseTest,ManagedRuntimeMessageNoOpUpdateTest test
```

---

### 47. Executar persistence tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageUpdateRepositoryTest,ManagedRuntimeMessageOptimisticLockingIT,ManagedRuntimeMessageVersionedDeleteIT test
```

Docker precisa estar ativo.

---

### 48. Executar concorrencia

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageConcurrentUpdateIT test
```

O teste não pode depender de qual concorrente vence.

---

### 49. Executar web tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePutWebMvcTest,ManagedRuntimeMessageDeleteWebMvcTest,ManagedRuntimeMessagePreconditionProblemDetailTest test
```

---

### 50. Executar contract e architecture

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageEntityTagTest,ManagedRuntimeMessageIfMatchParserTest,ManagedRuntimeMessageCrudPartTwoContractTest,ManagedRuntimeMessageCrudPartTwoArchitectureTest test
```

---

### 51. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageCrudPartTwoLiveServerIT test
```

---

### 52. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 53. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 54. Revisar escopo

Confirme:

```text
PUT:
completo.

DELETE:
versionado.

If-Match:
obrigatorio.

428:
presente.

412:
presente.

updatedAt:
presente.

optimistic locking:
real.

no-op:
presente.

PATCH:
zero.

soft delete:
zero.
```

---

### 55. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- logs;
- payload;
- ETag capturada;
- dump;
- migration temporária;
- PATCH;
- JSON Patch;
- Merge Patch.

---

## Entendendo o que foi feito

### O CRUD foi completado

Create, Read, Update e Delete agora possuem fluxos profissionais.

### A concorrencia ficou explicita

Clientes precisam enviar a versão que observaram.

### O banco virou a protecao final

`@Version` impede lost updates reais.

### Updates sem mudanca ficaram baratos

No-op não altera version nem updatedAt.

### DELETE ganhou precondition

A remoção não apaga silenciosamente uma versão desconhecida pelo cliente.

---

## Erros comuns importantes

### Usar 409 para ETag antiga

A falha de precondition deve ser 412.

### Tornar If-Match required=true no annotation

O Spring devolveria 400 antes de a API produzir 428.

### Confiar somente no check do service

Uma corrida ainda pode ocorrer antes do commit.

### Atualizar version manualmente

Hibernate controla o campo `@Version`.

### Incrementar updatedAt em no-op

O recurso pareceria alterado sem mudança real.

---

## Comandos uteis

### Atualizar

```powershell
.\scripts\111_atualizar_managed_message.ps1 `
  -Id 1 `
  -Value "novo valor" `
  -ETag '"v0"'
```

### Testar 428

```powershell
.\scripts\112_testar_if_match_obrigatorio.ps1 `
  -Id 1
```

### Testar 412

```powershell
.\scripts\113_testar_etag_desatualizada.ps1 `
  -Id 1
```

### Excluir

```powershell
.\scripts\114_excluir_managed_message.ps1 `
  -Id 1 `
  -ETag '"v1"'
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — No-op desativado

Remova temporariamente a detecção.

Execute dois PUTs equivalentes com ETags atuais.

Observe versions desnecessárias.

Restaure.

### Parte 2 — Weak ETag

Envie:

```text
W/"v1".
```

Confirme 400.

Explique por que If-Match exige comparação forte.

### Parte 3 — Concorrencia

Execute três updates com a mesma ETag.

Confirme um sucesso e duas falhas.

### Parte 4 — Constraint unica

Atualize dois recursos concorrentes para o mesmo valor.

Confirme somente um valor final único.

### Parte 5 — Delete repetido

Execute DELETE duas vezes.

Compare 204 e 404.

Explique idempotência de efeito.

### Parte 6 — Migration

Insira row usando somente V1 em fixture.

Aplique V2.

Confirme updatedAt igual a createdAt.

### Parte 7 — Header wildcard

Projete suporte a:

```text
If-Match: *.
```

Não implemente na baseline.

Documente implicações.

### Parte 8 — ADR

Registre:

```text
PUT para replacement completo;

PATCH reservado para aula 377;

If-Match obrigatorio;

ETag forte "vN";

428 sem precondition;

412 para stale version;

409 para duplicidade;

@Version como garantia final;

updatedAt somente em mudanca real;

DELETE idempotente em efeito.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 375 foi preservada;
- o mesmo projeto foi continuado;
- a segunda metade do CRUD foi implementada;
- PUT foi usado para atualização completa;
- PATCH não foi criado;
- comparação PUT versus PATCH foi reservada à aula 377;
- DELETE foi revisitado;
- `If-Match` foi exigido em PUT;
- `If-Match` foi exigido em DELETE;
- ETag forte usa formato `"vN"`;
- weak ETag foi rejeitada;
- múltiplas ETags foram rejeitadas na baseline;
- wildcard foi documentado sem implementação;
- header ausente retorna 428;
- header inválido retorna 400;
- versão antiga retorna 412;
- recurso ausente retorna 404;
- valor duplicado retorna 409;
- categorias de erro não foram confundidas;
- `MissingIfMatchHeaderException` ficou na web;
- `InvalidIfMatchHeaderException` ficou na web;
- commands não conhecem headers HTTP;
- application layer continua sem Spring Web;
- `ManagedRuntimeMessageReplaceCommand` foi criado;
- `ManagedRuntimeMessageDeleteCommand` foi criado;
- replacement do port foi criado;
- repository port foi evoluído;
- input port foi evoluído;
- create e list anteriores foram preservados;
- migration V2 foi criada;
- migration V1 não foi alterada;
- updated_at foi preenchido para rows antigas;
- updated_at tornou-se not null;
- check updated_at >= created_at foi criado;
- domain model recebeu updatedAt;
- entity recebeu updatedAt;
- persistence mapper foi atualizado;
- createdAt permanece imutável;
- updatedAt muda somente em update real;
- version não é alterada manualmente;
- `@Version` continua responsável pela versão;
- service compara expectedVersion antecipadamente;
- Hibernate protege a corrida final;
- lost update foi explicado;
- no-op update foi implementado;
- no-op valida versão antes de retornar;
- no-op não chama update do port;
- no-op não muda version;
- no-op não muda updatedAt;
- duplicidade exclui o próprio id;
- precheck de duplicidade foi usado;
- constraint única continua como garantia final;
- adapter carrega entity gerenciada;
- dirty checking foi usado;
- `saveAndFlush` foi usado conscientemente;
- optimistic locking exception foi traduzida;
- exception Spring ORM não vazou para application;
- delete carrega entity versionada;
- delete executa flush;
- update response específico foi criado;
- detail response inclui updatedAt;
- summary segue a baseline documentada;
- PUT retorna 200;
- PUT retorna body atualizado;
- PUT retorna ETag atual;
- PUT retorna Last-Modified de updatedAt;
- DELETE retorna 204 sem body;
- GET usa updatedAt em Last-Modified;
- POST usa updatedAt inicial;
- Problem Types foram evoluídos;
- Problem Codes foram evoluídos;
- Problem Details continuam RFC 9457;
- 428 usa `precondition_required`;
- 412 usa `precondition_failed`;
- 400 de ETag usa `invalid_entity_tag`;
- versão atual não é exposta no detail do erro;
- idempotência de PUT foi explicada;
- idempotência de DELETE foi explicada;
- respostas idênticas não foram tratadas como requisito de idempotência;
- `ManagedRuntimeMessageReplaceUseCaseTest` foi criado;
- `ManagedRuntimeMessageDeleteUseCaseTest` foi criado;
- `ManagedRuntimeMessageNoOpUpdateTest` foi criado;
- `ManagedRuntimeMessageUpdateRepositoryTest` foi criado;
- `ManagedRuntimeMessageOptimisticLockingIT` foi criado;
- transações independentes foram usadas no teste otimista;
- `ManagedRuntimeMessageConcurrentUpdateIT` foi criado;
- teste concorrente não depende de qual request vence;
- uma atualização vence e outra falha;
- version incrementa uma vez;
- `ManagedRuntimeMessageVersionedDeleteIT` foi criado;
- `ManagedRuntimeMessageEntityTagTest` foi criado;
- `ManagedRuntimeMessageIfMatchParserTest` foi criado;
- `ManagedRuntimeMessagePutWebMvcTest` foi criado;
- `ManagedRuntimeMessageDeleteWebMvcTest` foi criado;
- `ManagedRuntimeMessagePreconditionProblemDetailTest` foi criado;
- `ManagedRuntimeMessageCrudPartTwoContractTest` foi criado;
- `ManagedRuntimeMessageCrudPartTwoArchitectureTest` foi criado;
- zero PATCH foi validado arquiteturalmente;
- `ManagedRuntimeMessageCrudPartTwoLiveServerIT` foi criado;
- teste live usou PostgreSQL real;
- POST, PUT, GET e DELETE foram exercitados;
- 400, 404, 409, 412 e 428 foram exercitados;
- documentação completa foi criada;
- scripts foram criados;
- testes unitários, persistência, concorrência, web, contratos, arquitetura, live, suite e package passaram;
- nenhum PATCH, JSON Patch, Merge Patch, soft delete, Security, cache ou OpenAPI foi antecipado;
- ponte para a aula 377 está correta;
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
git commit -m "feat(m14): completar crud com update e delete versionados"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- payload;
- ETag capturada;
- dump;
- migration temporária;
- PATCH;
- JSON Patch;
- Merge Patch.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você completou o ciclo CRUD do recurso.

O fluxo de update ficou:

```text
PUT;

If-Match;

parser de ETag;

request DTO;

replace command;

application service;

precheck de versao;

no-op detection;

transaction;

repository port;

JPA entity;

optimistic locking;

updated response;

200.
```

O fluxo de delete ficou:

```text
DELETE;

If-Match;

delete command;

version check;

delete versionado;

204.
```

Você comprovou:

```text
428 quando falta precondition;

400 para ETag invalida;

412 para versao antiga;

404 para recurso ausente;

409 para duplicidade;

ETag nova apos update;

updatedAt coerente;

version gerenciada pelo Hibernate;

lost update impedido;

delete idempotente em efeito.
```

A decisão central foi:

```text
updates e deletes concorrentes
precisam combinar preconditions HTTP
com optimistic locking no banco,
sem confundir conflitos de versao,
ausencia e duplicidade.
```

A próxima aula será:

```text
377 - M14.22 - PUT vs PATCH
```

Nela, você continuará no mesmo projeto e estudará:

- semântica de PUT;
- semântica de PATCH;
- replacement completo;
- atualização parcial;
- campos ausentes;
- null explícito;
- idempotência;
- JSON Merge Patch;
- JSON Patch;
- media types;
- operações add, remove, replace, move, copy e test;
- validação após patch;
- segurança de campos;
- mass assignment;
- If-Match;
- optimistic locking;
- escolha arquitetural;
- testes de contrato;
- quando não oferecer PATCH.

A aula 376 respondeu:

```text
como completar o CRUD
com update, delete
e concorrencia otimista?
```

A aula 377 responderá:

```text
quando usar PUT,
quando usar PATCH
e como modelar atualizacoes parciais
sem ambiguidade?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei exigir `If-Match` e diferenciar 428 de 412.
- [ ] Sei combinar ETag com `@Version`.
- [ ] Sei implementar no-op update sem nova versão.
- [ ] Sei proteger update e delete contra lost update.
- [ ] Sei diferenciar 404, 409, 412 e 428.

---

## Troubleshooting adicional

### PUT sempre retorna 412

Compare o parser com o formatter e confirme aspas.

### Version nao incrementa

Confirme entity gerenciada, alteração real, flush e `@Version`.

### Version incrementa no no-op

Confirme a detecção antes da chamada ao adapter.

### DELETE antigo ainda aceita sem header

Revise a assinatura e os testes de 428.

### Update concorrente sobrescreve

Confirme transações independentes e version no SQL.

### Migration V2 falha

Revise preenchimento de rows antigas antes de `set not null`.

---

## Perguntas de revisao

1. Qual operação completa foi adicionada?
2. PATCH foi criado?
3. Para que serve If-Match?
4. Qual formato da ETag?
5. Weak ETag é aceita?
6. Quando retornar 428?
7. Quando retornar 412?
8. Quando retornar 409?
9. Quando retornar 404?
10. O que é lost update?
11. Para que serve `@Version`?
12. Por que comparar no service e no banco?
13. O que é no-op update?
14. No-op muda version?
15. No-op muda updatedAt?
16. Quem gera updatedAt?
17. DELETE é idempotente?
18. Respostas precisam ser iguais?
19. Qual migration foi criada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. PUT de replacement.
2. Não.
3. Validar a versão observada.
4. `"vN"`.
5. Não.
6. Header ausente.
7. Versão desatualizada.
8. Duplicidade.
9. Recurso ausente.
10. Sobrescrever mudança concorrente.
11. Optimistic locking.
12. Resposta antecipada e proteção final.
13. Update sem mudança real.
14. Não.
15. Não.
16. Application service com Clock.
17. Sim, no efeito.
18. Não.
19. V2 de updated_at.
20. PUT vs PATCH.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 376 - M14.21 - CRUD completo parte 2

- Continuei no projeto `formacao-java-backend-api`.
- Completei o CRUD com PUT e DELETE versionados.
- Mantive PATCH para a próxima aula.
- Criei request e command específicos de replacement.
- Exigi `If-Match` em PUT e DELETE.
- Padronizei ETags fortes no formato `"vN"`.
- Rejeitei weak ETags e headers fora da baseline.
- Retornei 428 quando a precondition está ausente.
- Retornei 412 quando a versão está desatualizada.
- Mantive 404 para recurso ausente.
- Mantive 409 para duplicidade.
- Criei migration V2 para `updated_at`.
- Preservei `createdAt`.
- Atualizei `updatedAt` somente em mudanças reais.
- Mantive `@Version` sob controle do Hibernate.
- Comparei expected version no application service.
- Mantive optimistic locking como proteção final do banco.
- Implementei no-op update.
- Preservei version, updatedAt e ETag em no-op.
- Atualizei o repository port e o adapter Spring Data.
- Traduzi falhas de optimistic locking.
- Mantive a constraint única contra corrida de duplicidade.
- Atualizei response DTOs e headers.
- Revisei DELETE com versionamento.
- Entendi idempotência de efeito.
- Testei transações concorrentes com PostgreSQL real.
- Testei PUT, DELETE, 400, 404, 409, 412 e 428.
- Mantive Problem Details integrado.
- Não criei PATCH, JSON Patch ou Merge Patch.
- Próxima aula: PUT vs PATCH.
```

---

## Referencia tecnica curta

```text
PUT:
replacement.

If-Match:
precondition.

ETag:
versao publica.

428:
header ausente.

412:
stale.

409:
duplicidade.

Version:
locking.

UpdatedAt:
mudanca real.

No-op:
sem escrita.

DELETE:
efeito idempotente.
```

Regra final:

```text
a segunda parte do CRUD deve implementar replacement por PUT e exclusao condicionada por If-Match, usando ETags fortes e @Version para impedir lost updates; ausencia da precondition deve gerar 428, ETag desatualizada deve gerar 412, duplicidade deve permanecer 409 e ausencia 404, updatedAt e version devem mudar somente em update real, no-op deve evitar escrita e DELETE deve permanecer idempotente quanto ao efeito sem antecipar PATCH ou atualizacao parcial.
```
