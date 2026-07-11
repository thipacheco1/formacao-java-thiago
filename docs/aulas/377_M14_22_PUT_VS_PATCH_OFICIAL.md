# 377 - M14.22 - PUT vs PATCH

## Apresentacao da aula

Na aula 376, você concluiu o CRUD do recurso `managed runtime message`.

A atualização completa passou a utilizar:

```text
PUT;

If-Match;

ETag forte;

428;

412;

@Version;

optimistic locking;

updatedAt;

no-op update.
```

O fluxo atual é:

```text
PUT /api/v1/runtime/managed-messages/{id};

If-Match: "v3";

request completo;

replace command;

application service;

repository port;

JPA;

PostgreSQL;

200;

ETag nova.
```

A decisão da aula anterior foi intencional:

```text
PUT representa replacement
dos campos editaveis.
```

O request possuía apenas:

```text
value.
```

Com um único campo editável, PUT e uma atualização parcial simples podem parecer iguais.

Essa semelhança desaparece quando o recurso possui mais de um campo editável.

Nesta aula, o recurso ganhará:

```text
description.
```

O campo será:

- opcional;
- nullable;
- limitado a 500 caracteres;
- editável pelo cliente;
- ausente da regra de unicidade;
- não exibido na resposta resumida da coleção.

Agora a diferença fica visível.

Estado atual:

```json
{
  "value": "Spring MVC",
  "description": "Mensagem usada no laboratorio"
}
```

PUT:

```json
{
  "value": "Spring Web MVC"
}
```

Resultado:

```json
{
  "value": "Spring Web MVC",
  "description": null
}
```

A representação editável foi substituída.

A ausência de `description` não significa “preservar”.

Significa que o novo estado completo não possui descrição.

JSON Merge Patch:

```json
{
  "value": "Spring Web MVC"
}
```

Resultado:

```json
{
  "value": "Spring Web MVC",
  "description": "Mensagem usada no laboratorio"
}
```

O membro ausente não foi alterado.

JSON Merge Patch com remoção:

```json
{
  "description": null
}
```

Resultado:

```json
{
  "value": "Spring MVC",
  "description": null
}
```

JSON Patch:

```json
[
  {
    "op": "replace",
    "path": "/value",
    "value": "Spring Web MVC"
  },
  {
    "op": "remove",
    "path": "/description"
  }
]
```

Resultado:

```json
{
  "value": "Spring Web MVC",
  "description": null
}
```

A pergunta central será:

```text
quando usar PUT,
quando usar PATCH
e como modelar atualizacoes parciais
sem ambiguidade?
```

A aula utilizará quatro RFCs como base.

```text
RFC 9110:
semantica HTTP e PUT.

RFC 5789:
metodo PATCH e Accept-Patch.

RFC 7396:
JSON Merge Patch.

RFC 6902:
JSON Patch.
```

PUT é idempotente segundo a semântica HTTP.

PATCH não possui idempotência garantida pelo método.

Um patch document pode ser desenhado para produzir efeito idempotente, mas isso depende do formato e das operações.

Exemplo:

```text
replace /value:
normalmente idempotente.

add em array pelo indice:
pode depender do estado.

move:
pode mudar a estrutura.

test:
depende da representacao atual.
```

Todos os PATCH desta aula exigirão:

```text
If-Match.
```

Isso preserva a proteção contra lost update construída na aula 376.

A API aceitará dois media types.

```text
application/merge-patch+json;

application/json-patch+json.
```

Ela não aceitará:

```text
application/json
```

como formato genérico de PATCH.

O media type identifica a semântica do patch document.

A API também publicará:

```http
Accept-Patch: application/merge-patch+json, application/json-patch+json
```

O header será incluído na resposta `OPTIONS` do recurso e poderá ser reutilizado em respostas relacionadas.

A implementação não aplicará patches diretamente em:

- entity JPA;
- domain model;
- request DTO genérico;
- `Map<String, Object>`;
- reflection;
- BeanUtils;
- mass assignment.

O patch será aplicado em uma representação editável isolada:

```text
ManagedRuntimeMessageEditableDocument.
```

Campos permitidos:

```text
value;

description.
```

Campos protegidos:

```text
id;

normalizedValue;

createdAt;

updatedAt;

version.
```

Após aplicar o patch:

1. o documento final será convertido para um tipo forte;
2. Bean Validation será executada;
3. o web mapper criará o command de replacement;
4. o application service verificará `If-Match`;
5. no-op será detectado;
6. a transação executará a atualização;
7. `@Version` protegerá a corrida;
8. a resposta devolverá 200, ETag e `Last-Modified`.

O patch document inteiro será processado antes de qualquer gravação.

Se uma operação falhar:

```text
nenhuma alteracao parcial
sera persistida.
```

A aula também definirá as respostas:

```text
400:
JSON ou estrutura malformada;
ETag invalida.

404:
recurso ausente.

409:
teste do JSON Patch falhou;
duplicidade de valor.

412:
If-Match desatualizado.

415:
media type nao suportado.

422:
patch compreendido,
mas semanticamente inaplicavel.

428:
If-Match ausente.
```

Os erros continuarão utilizando:

```text
Problem Details RFC 9457.
```

Novos error codes:

```text
invalid_patch_document;

patch_path_not_allowed;

patch_operation_not_supported;

patch_test_failed;

patch_result_invalid.
```

A próxima aula será:

```text
378 - M14.23 - Paginacao e ordenacao em API
```

Portanto, paginação, ordenação avançada e contratos de coleção não serão aprofundados nesta aula.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
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

379:
Filtros dinamicos e Specifications.
```

A aula 376 respondeu:

```text
como completar o CRUD
com update, delete
e concorrencia otimista?
```

A aula 377 responderá:

```text
como escolher e implementar
replacement completo,
merge parcial
e operacoes de patch?
```

Nesta aula:

```text
PUT:
preservado e aprofundado.

PATCH:
sim.

JSON Merge Patch:
sim.

JSON Patch:
sim.

description opcional:
sim.

migration V3:
sim.

Accept-Patch:
sim.

If-Match:
sim.

atomicidade:
sim.

validacao final:
sim.

whitelist:
sim.

mass assignment:
bloqueado.

PATCH application/json:
nao.

patch direto em entity:
nao.

paginacao avancada:
nao.

Specifications:
nao.
```

A regra central será:

```text
PUT substitui o estado editavel completo;

PATCH aplica instrucoes parciais
definidas pelo media type;

ambos devem preservar
validacao, seguranca e concorrencia.
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
│       ├── command
│       │   └── ManagedRuntimeMessageReplaceCommand.java
│       └── exception
│           ├── ManagedRuntimeMessagePatchResultInvalidException.java
│           └── ManagedRuntimeMessagePatchTestFailedException.java
├── domain
│   └── managedmessage
│       └── ManagedRuntimeMessage.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── entity
│           │   └── ManagedRuntimeMessageJpaEntity.java
│           └── mapper
│               └── ManagedRuntimeMessagePersistenceMapper.java
└── web
    ├── controller
    │   └── ManagedRuntimeMessageController.java
    ├── patch
    │   ├── ManagedRuntimeMessageEditableDocument.java
    │   ├── ManagedRuntimeMessagePatchMediaTypes.java
    │   ├── ManagedRuntimeMessageMergePatchApplier.java
    │   ├── ManagedRuntimeMessageJsonPatchApplier.java
    │   ├── JsonPatchOperationRequest.java
    │   ├── JsonPatchOperationType.java
    │   ├── PatchDocumentException.java
    │   └── PatchResultValidator.java
    ├── request
    │   └── ReplaceManagedRuntimeMessageRequest.java
    └── response
        ├── ManagedRuntimeMessageDetailResponse.java
        ├── ManagedRuntimeMessageCreatedResponse.java
        └── ManagedRuntimeMessageUpdatedResponse.java
```

Migration:

```text
src/main/resources/db/migration
└── V3__add_description_to_managed_runtime_message.sql
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── PutReplacementSemanticsTest.java
│       └── PatchReplacementIntegrationTest.java
├── infrastructure
│   └── persistence
│       └── jpa
│           └── ManagedRuntimeMessageDescriptionPersistenceTest.java
└── web
    └── patch
        ├── MergePatchSemanticsTest.java
        ├── JsonPatchOperationTest.java
        ├── JsonPatchAtomicityTest.java
        ├── PatchAllowedPathsTest.java
        ├── PatchFinalValidationTest.java
        ├── PatchMassAssignmentTest.java
        ├── PutVsPatchWebMvcTest.java
        ├── PatchMediaTypeWebMvcTest.java
        ├── PatchPreconditionWebMvcTest.java
        ├── PatchProblemDetailTest.java
        ├── PatchArchitectureTest.java
        └── PutVsPatchLiveServerIT.java
```

Documentação:

```text
docs
├── put-semantics.md
├── patch-semantics.md
├── json-merge-patch.md
├── json-patch.md
├── patch-media-types.md
├── patch-null-and-absence.md
├── patch-idempotency.md
├── patch-security-whitelist.md
├── patch-atomicity-validation.md
├── patch-preconditions.md
└── put-vs-patch-decision-guide.md
```

Scripts:

```text
scripts
├── 117_testar_put_replacement.ps1
├── 118_testar_merge_patch.ps1
├── 119_testar_json_patch.ps1
├── 120_testar_patch_preconditions.ps1
├── 121_testar_patch_security.ps1
└── 122_executar_testes_put_vs_patch.ps1
```

Resultados esperados:

```text
PUT sem description:
description removida.

PUT com description:
estado completo substituido.

Merge Patch sem description:
description preservada.

Merge Patch description null:
description removida.

JSON Patch replace:
campo substituido.

JSON Patch remove description:
campo removido.

JSON Patch test falhou:
409.

path protegido:
422.

operacao invalida:
422.

resultado final invalido:
422.

If-Match ausente:
428.

If-Match antiga:
412.

application/json:
415.

Accept-Patch:
dois formatos publicados.

escrita parcial:
zero.
```

---

## Conceito essencial

### Semantica de PUT

PUT solicita que o estado do recurso alvo seja criado ou substituído pelo estado definido na representação enviada.

A API desta formação não permite que o cliente escolha novos ids.

Por isso:

```text
PUT em id existente:
replacement.

PUT em id ausente:
404.
```

A semântica HTTP permite outros desenhos, mas a política desta API é explícita.

---

### Replacement completo

Replacement completo considera todos os campos editáveis.

Depois da migration V3:

```text
value;

description.
```

Campos gerenciados pelo servidor não pertencem ao request.

O request de PUT será:

```java
public record ReplaceManagedRuntimeMessageRequest(
        @RuntimeMessageValue
        String value,

        @Size(
                max = 500
        )
        String description
) {
}
```

Se `description` não vier no JSON, o valor desserializado será null.

Como o request representa o estado completo editável:

```text
null substitui a description anterior.
```

---

### PUT parcial e ambiguidade

Tratar PUT como alteração somente dos campos presentes cria ambiguidade.

Exemplo:

```json
{
  "value": "novo"
}
```

O servidor não saberia se:

```text
description deve permanecer;
description deve ser removida;
cliente esqueceu o campo;
cliente usa versao antiga do contrato.
```

Essa não será a política da API.

---

### Idempotencia de PUT

PUT é idempotente.

Enviar repetidamente a mesma representação completa produz o mesmo estado pretendido.

Na implementação:

- primeiro PUT pode atualizar;
- segundo PUT equivalente vira no-op;
- ETag permanece após o no-op;
- efeitos externos não devem se acumular.

Idempotência descreve efeito pretendido, não igualdade de logs ou tempo.

---

### Semantica de PATCH

PATCH solicita que um conjunto de mudanças descrito pelo request body seja aplicado ao recurso.

O body é:

```text
patch document.
```

A semântica do documento depende do media type.

PATCH não significa automaticamente:

```text
DTO com todos os campos opcionais.
```

Sem uma regra formal, ausência e null tornam-se ambíguos.

---

### PATCH nao e necessariamente idempotente

RFC 5789 não classifica PATCH como idempotente por padrão.

Um cliente pode construir um patch idempotente.

Exemplos:

```text
Merge Patch definindo value:
idempotente no estado final.

JSON Patch replace:
normalmente idempotente.

JSON Patch add em array:
pode nao ser.

JSON Patch move:
depende do estado.

test:
pode falhar depois da primeira alteracao.
```

Não configure retry automático apenas porque o endpoint usa PATCH.

---

### Accept-Patch

O header anuncia media types de patch aceitos.

```http
Accept-Patch: application/merge-patch+json, application/json-patch+json
```

Ele pode ser enviado em resposta a OPTIONS.

Ele não substitui:

```text
Allow.
```

`Allow` anuncia métodos.

`Accept-Patch` anuncia formatos de patch document.

---

### JSON Merge Patch

JSON Merge Patch usa uma estrutura parecida com o recurso.

Media type:

```text
application/merge-patch+json.
```

Regras principais:

```text
membro ausente:
nao altera.

membro presente:
adiciona ou substitui.

membro null:
remove.
```

O formato é simples para objetos.

---

### Null no Merge Patch

Null possui semântica de remoção.

Isso gera uma limitação importante.

Quando o domínio precisa distinguir:

```text
atribuir null
```

de:

```text
remover o membro
```

Merge Patch pode não representar ambas as intenções sem um desenho adicional.

Nesta feature, description nullable interpreta null como remoção.

Value é obrigatório.

Por isso:

```json
{
  "value": null
}
```

é semanticamente inválido.

---

### Ausencia no Merge Patch

Body:

```json
{
  "description": "nova descricao"
}
```

Não toca em value.

Esse comportamento é diferente do PUT.

O teste comparativo precisa deixar essa diferença visível.

---

### Arrays no Merge Patch

Merge Patch não modifica itens individuais de array.

Um array presente substitui o array inteiro.

A feature atual não possui coleção editável.

O conceito será documentado e testado em fixture.

Quando operações por índice são necessárias, JSON Patch pode ser mais adequado.

---

### JSON Patch

JSON Patch representa uma sequência ordenada de operações.

Media type:

```text
application/json-patch+json.
```

Exemplo:

```json
[
  {
    "op": "test",
    "path": "/value",
    "value": "Spring MVC"
  },
  {
    "op": "replace",
    "path": "/value",
    "value": "Spring Web MVC"
  }
]
```

As operações são aplicadas em ordem.

---

### Operacao add

`add` adiciona um valor no path.

Em membro de objeto já existente, a operação substitui o valor.

Na feature:

```text
add /description:
define description.

add /value:
define value,
mas o resultado ainda precisa ser valido.
```

---

### Operacao remove

`remove` remove o valor no path.

Na feature:

```text
remove /description:
permitido.

remove /value:
rejeitado,
porque value e obrigatorio.
```

A remoção não será aplicada diretamente ao domain model.

---

### Operacao replace

`replace` substitui um valor existente.

Paths permitidos:

```text
/value;

/description.
```

O tipo do valor precisa ser string ou null permitido pela regra do campo.

---

### Operacao move

`move` remove o valor de `from` e adiciona no `path`.

Exemplo de laboratório:

```json
{
  "op": "move",
  "from": "/description",
  "path": "/value"
}
```

O estado final precisa satisfazer:

- value não nulo;
- value válido;
- description removida.

A operação pode falhar na validation final.

---

### Operacao copy

`copy` lê de `from` e adiciona em `path`.

Exemplo:

```text
copy /value para /description.
```

O valor original permanece.

Paths protegidos não podem ser origem ou destino.

---

### Operacao test

`test` compara o valor atual no path com o valor fornecido.

Se não for igual:

```text
patch inteiro falha.
```

A baseline retorna:

```text
409 patch_test_failed.
```

`test` não substitui `If-Match`.

`If-Match` protege a versão da representação.

`test` protege uma expectativa sobre um membro específico.

---

### Ordem das operacoes

JSON Patch é uma sequência.

Uma operação posterior observa o resultado das anteriores.

Se qualquer operação falhar:

```text
nenhum estado e persistido.
```

O applier trabalha sobre uma cópia isolada.

Somente o documento final validado chega ao use case.

---

### JSON Pointer e whitelist

Paths de JSON Patch usam JSON Pointer.

A implementação desta aula não será um engine genérico.

Ela aceitará exatamente:

```text
/value;

/description.
```

Isso evita:

- acesso a campos internos;
- traversal inesperado;
- complexidade desnecessária;
- mass assignment.

---

### Campos protegidos

Devem ser rejeitados:

```text
/id;

/normalizedValue;

/createdAt;

/updatedAt;

/version.
```

Também serão rejeitados:

- paths desconhecidos;
- paths aninhados;
- arrays;
- path raiz;
- escape não necessário;
- field com nome parecido.

Não normalize path suspeito.

---

### JsonNode como ferramenta de transporte

A aula 367 evitou `JsonNode` como contrato genérico da aplicação.

Aqui existe uma exceção consciente.

Patch documents são documentos JSON dinâmicos definidos por media type.

`JsonNode` será usado somente em:

```text
web.patch.
```

Ele não atravessa:

- input port;
- command;
- service;
- repository port;
- domain;
- entity.

---

### ObjectMapper nao e mapper arquitetural

O Jackson será usado para:

- copiar a árvore editável;
- comparar nodes;
- ler values do patch document.

Ele não substituirá:

```text
web mapper;

persistence mapper.
```

Esse uso não é `ObjectMapper.convertValue` para copiar camadas por nome.

---

### Documento editavel

Crie:

```java
public record ManagedRuntimeMessageEditableDocument(
        @RuntimeMessageValue
        String value,

        @Size(
                max = 500
        )
        String description
) {
}
```

Ele representa somente campos editáveis.

Não contém id, version ou timestamps.

---

### Validacao do estado final

Aplicar operações sintaticamente válidas pode produzir estado inválido.

Exemplo:

```text
move description para value,
mas description possui 300 caracteres.
```

O patch applier termina.

Depois:

```text
Validator.validate(document).
```

Se houver violations:

```text
422 patch_result_invalid.
```

O service não é chamado.

---

### Atomicidade

Atomicidade possui duas dimensões.

Documento:

```text
todas as operacoes sao aplicadas
ou nenhuma.
```

Persistência:

```text
uma unica chamada de replacement
ocorre em uma transacao.
```

Não salve após cada operação.

---

### Limite de operacoes

A baseline aceitará no máximo:

```text
20 operacoes.
```

Esse limite reduz:

- custo de CPU;
- documentos abusivos;
- logs enormes;
- complexidade de testes.

Merge Patch possui limite de tamanho controlado pela configuração HTTP geral.

Não adicione parsing sem limite.

---

### Status 422

422 representa conteúdo sintaticamente compreendido, mas semanticamente inaplicável.

Exemplos:

- path não permitido;
- remove de field obrigatório;
- operation não suportada;
- resultado final inválido;
- move sem origem válida.

JSON malformado continua 400.

Media type errado continua 415.

---

### Preconditions

PUT, Merge Patch e JSON Patch usarão:

```text
If-Match.
```

Ordem:

1. validar presença;
2. validar sintaxe;
3. carregar recurso;
4. validar versão;
5. aplicar patch;
6. validar resultado;
7. persistir;
8. optimistic locking final.

---

### Quando escolher PUT

Escolha PUT quando:

- cliente conhece a representação editável completa;
- replacement é natural;
- campos obrigatórios são claros;
- idempotência é desejada;
- contrato completo é simples;
- não há custo relevante para enviar todos os campos.

---

### Quando escolher Merge Patch

Escolha Merge Patch quando:

- objeto é simples;
- alteração parcial por fields é suficiente;
- null pode representar remoção;
- arrays são substituídos como unidade;
- cliente prefere documento parecido com o recurso.

---

### Quando escolher JSON Patch

Escolha JSON Patch quando:

- operações ordenadas são úteis;
- precisa de add, remove, replace, move, copy ou test;
- paths são bem definidos;
- alterações em arrays são necessárias;
- cliente aceita maior complexidade.

---

### Quando nao oferecer PATCH

Não ofereça PATCH quando:

- PUT completo é simples;
- regras parciais seriam ambíguas;
- campo ausente e null não têm semântica definida;
- segurança de paths não pode ser garantida;
- consumidores não precisam da funcionalidade;
- equipe não consegue manter vários media types;
- documentação e testes seriam insuficientes.

Mais endpoints não significam uma API melhor.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Docker precisa estar ativo.

---

### 2. Criar migration V3

Arquivo:

```text
V3__add_description_to_managed_runtime_message.sql.
```

Conteúdo:

```sql
alter table managed_runtime_message
    add column description varchar(500);
```

Não edite V1 ou V2.

---

### 3. Evoluir domain e entity

Adicione:

```text
description.
```

No domain:

```text
String nullable.
```

Na entity:

```java
@Column(
        name = "description",
        length = 500
)
private String description;
```

Atualize create, replace e persistence mapper.

---

### 4. Evoluir requests

Create e replace recebem:

```text
description.
```

Use:

```java
@Size(
        max = 500
)
```

Null e string vazia são valores distintos nesta baseline.

---

### 5. Atualizar responses

Created, detail e updated incluem description.

Summary da coleção permanece sem description.

Isso evita ampliar desnecessariamente cada item da página.

---

### 6. Atualizar no-op

No-op exige equivalência de:

```text
normalized value;

description.
```

PUT sem description pode remover descrição e, portanto, não é no-op quando a atual existe.

---

### 7. Criar media types

Constantes:

```java
public static final String
        MERGE_PATCH_JSON_VALUE =
                "application/merge-patch+json";

public static final String
        JSON_PATCH_JSON_VALUE =
                "application/json-patch+json";
```

Crie também objetos `MediaType`.

---

### 8. Criar EditableDocument

Campos:

```text
value;

description.
```

Adicione constraints.

Nenhum campo protegido.

---

### 9. Criar MergePatchApplier

Entrada:

- current editable document;
- `JsonNode` patch.

Valide:

- patch é object;
- somente fields permitidos;
- value é string e não null;
- description é string ou null;
- members ausentes preservam estado.

Retorne novo documento.

---

### 10. Criar JsonPatchOperationType

Valores:

```text
ADD;

REMOVE;

REPLACE;

MOVE;

COPY;

TEST.
```

Parsing case-sensitive conforme documento JSON.

Operação desconhecida gera patch operation not supported.

---

### 11. Criar JsonPatchOperationRequest

Campos:

```text
op;

path;

from;

value.
```

Não tente validar tudo com annotations simples.

Cada operation possui membros obrigatórios diferentes.

Use validação explícita no applier.

---

### 12. Criar JsonPatchApplier

Entrada:

- current document;
- lista de operations.

Fluxo:

1. limite 1 a 20;
2. converter current para cópia editável;
3. validar operation;
4. validar paths;
5. aplicar em ordem;
6. retornar final document.

Nenhuma chamada ao banco.

---

### 13. Implementar add e replace

Aceite `/value` e `/description`.

Exija value member.

Valide tipo JSON.

`add` em field existente substitui o valor.

---

### 14. Implementar remove

`/description` vira null.

`/value` gera 422.

Não permita remover o documento raiz.

---

### 15. Implementar move e copy

Exija:

```text
from;

path.
```

Ambos precisam estar na whitelist.

Move limpa a origem.

Copy preserva.

O estado final será validado depois.

---

### 16. Implementar test

Exija value.

Compare `JsonNode` estruturalmente.

Quando diferente:

```text
ManagedRuntimeMessagePatchTestFailedException.
```

Nenhuma operação posterior deve executar.

---

### 17. Criar PatchResultValidator

Injete:

```text
jakarta.validation.Validator.
```

Valide o EditableDocument final.

Converta violations para exception interna com dados seguros.

O GlobalExceptionHandler produzirá 422 com violations públicas.

---

### 18. Criar fluxo compartilhado de patch

Método privado ou component web:

1. parse If-Match;
2. use case get current;
3. mapear current para editable;
4. aplicar patch;
5. validar final;
6. mapear final para replace command;
7. use case replace;
8. mapear updated response.

Não duplique o fluxo entre os dois media types.

---

### 19. Criar PATCH Merge endpoint

```java
@PatchMapping(
        path = "/{id}",
        consumes =
                ManagedRuntimeMessagePatchMediaTypes
                        .MERGE_PATCH_JSON_VALUE
)
```

Body:

```text
JsonNode.
```

Resposta:

```text
200;

updated response;

ETag;

Last-Modified.
```

---

### 20. Criar PATCH JSON endpoint

```java
@PatchMapping(
        path = "/{id}",
        consumes =
                ManagedRuntimeMessagePatchMediaTypes
                        .JSON_PATCH_JSON_VALUE
)
```

Body:

```text
List<JsonPatchOperationRequest>.
```

Mesma resposta de sucesso.

---

### 21. Criar OPTIONS

Resposta:

```text
204.
```

Headers:

```text
Allow:
GET, PUT, PATCH, DELETE, OPTIONS.

Accept-Patch:
application/merge-patch+json,
application/json-patch+json.
```

Não crie body.

---

### 22. Preservar PUT

Atualize request para incluir description.

Confirme replacement:

- ausência remove;
- null remove;
- string define;
- value continua obrigatório.

---

### 23. Evoluir Problem Types

Adicione:

```text
INVALID_PATCH_DOCUMENT;

PATCH_PATH_NOT_ALLOWED;

PATCH_OPERATION_NOT_SUPPORTED;

PATCH_TEST_FAILED;

PATCH_RESULT_INVALID.
```

---

### 24. Evoluir Problem Codes

Valores públicos:

```text
invalid_patch_document;

patch_path_not_allowed;

patch_operation_not_supported;

patch_test_failed;

patch_result_invalid.
```

---

### 25. Evoluir handlers

Mapeamentos:

```text
estrutura malformada:
400.

path ou operation inaplicavel:
422.

test falhou:
409.

resultado invalido:
422.
```

Preserve correlation id e RFC 9457.

---

### 26. Testar PUT replacement

Estado inicial com description.

Envie PUT sem description.

Confirme:

```text
description null.
```

Repita o mesmo PUT com ETag atual.

Confirme no-op.

---

### 27. Testar Merge Patch

Cenários:

- apenas value;
- apenas description;
- description null;
- body vazio `{}`;
- value null;
- field desconhecido;
- body array;
- field protegido.

---

### 28. Testar JSON Patch operations

Teste individualmente:

- add;
- remove;
- replace;
- move;
- copy;
- test success;
- test failure.

Use current document conhecido.

---

### 29. Testar ordem

Operations:

1. replace value;
2. test new value;
3. copy value para description.

Confirme estado final.

Inverta a ordem e confirme comportamento diferente.

---

### 30. Testar atomicidade

Operations:

1. replace válido;
2. path proibido.

Espere 422.

Depois faça GET.

Confirme que a primeira mudança não foi persistida.

---

### 31. Testar validacao final

Mova description de 300 caracteres para value.

O applier consegue executar.

A validation final falha.

Espere:

```text
422 patch_result_invalid.
```

Service replace não é chamado.

---

### 32. Testar mass assignment

Tente alterar:

- id;
- version;
- createdAt;
- updatedAt;
- normalizedValue.

Nos dois formatos.

Espere 422.

Nenhum campo protegido muda.

---

### 33. Testar media types

PATCH com:

```text
application/json:
415.
```

PATCH sem content type:

```text
415.
```

OPTIONS publica Accept-Patch.

---

### 34. Testar preconditions

Nos dois formatos:

- sem If-Match: 428;
- inválida: 400;
- antiga: 412;
- atual: sucesso;
- concorrência: um sucesso.

---

### 35. Criar teste arquitetural

Valide:

- JsonNode somente em web.patch e controller;
- application sem Jackson;
- domain sem Jackson;
- entity sem patch logic;
- whitelist explícita;
- zero BeanUtils;
- zero reflection;
- zero `Map<String,Object>`;
- dois media types explícitos;
- zero generic application/json PATCH;
- PUT continua existindo;
- paginação não foi alterada.

---

### 36. Criar teste live

Fluxo:

1. POST com description;
2. GET e capturar ETag;
3. PUT sem description;
4. GET e confirmar remoção;
5. Merge Patch para adicionar description;
6. JSON Patch com test e replace;
7. patch inválido;
8. patch com ETag antiga;
9. OPTIONS;
10. validar estado final no PostgreSQL.

---

### 37. Criar documentacao

`put-semantics.md` documenta replacement.

`patch-semantics.md` documenta partial modification.

`json-merge-patch.md` documenta ausência, null e arrays.

`json-patch.md` documenta seis operações.

`patch-media-types.md` documenta consumes e Accept-Patch.

`patch-null-and-absence.md` cria tabela comparativa.

`patch-idempotency.md` separa método e documento.

`patch-security-whitelist.md` lista paths.

`patch-atomicity-validation.md` documenta apply, validate e save.

`patch-preconditions.md` integra If-Match.

`put-vs-patch-decision-guide.md` cria árvore de decisão.

---

### 38. Criar scripts

`117_testar_put_replacement.ps1` demonstra remoção por ausência.

`118_testar_merge_patch.ps1` demonstra preserve e null.

`119_testar_json_patch.ps1` executa operações.

`120_testar_patch_preconditions.ps1` testa 428 e 412.

`121_testar_patch_security.ps1` tenta fields protegidos.

`122_executar_testes_put_vs_patch.ps1` executa a suite.

---

### 39. Executar unit tests

```powershell
.\mvnw.cmd `
  -Dtest=PutReplacementSemanticsTest,MergePatchSemanticsTest,JsonPatchOperationTest,JsonPatchAtomicityTest test
```

---

### 40. Executar validation e seguranca

```powershell
.\mvnw.cmd `
  -Dtest=PatchAllowedPathsTest,PatchFinalValidationTest,PatchMassAssignmentTest test
```

---

### 41. Executar WebMvc

```powershell
.\mvnw.cmd `
  -Dtest=PutVsPatchWebMvcTest,PatchMediaTypeWebMvcTest,PatchPreconditionWebMvcTest,PatchProblemDetailTest test
```

---

### 42. Executar architecture

```powershell
.\mvnw.cmd `
  -Dtest=PatchArchitectureTest test
```

---

### 43. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=PutVsPatchLiveServerIT test
```

Docker precisa estar ativo.

---

### 44. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 45. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 46. Revisar escopo

Confirme:

```text
PUT:
replacement completo.

Merge Patch:
presente.

JSON Patch:
presente.

description:
presente.

Accept-Patch:
presente.

If-Match:
presente.

atomicidade:
presente.

Page e sorting:
nao alterados.

Specifications:
zero.

patch direto em entity:
zero.
```

---

### 47. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- payload temporário;
- ETag capturada;
- banco;
- dump;
- patch experimental fora da whitelist;
- dependency genérica desnecessária;
- alteração de paginação.

---

## Entendendo o que foi feito

### PUT ganhou semantica observavel

Ausência de description substitui o valor anterior por null.

### Merge Patch separou ausencia de null

Ausência preserva; null remove.

### JSON Patch expressou operacoes

Add, remove, replace, move, copy e test foram executados em ordem.

### O patch permaneceu fora do dominio

JsonNode e paths ficaram na web.

### Concorrencia e atomicidade foram preservadas

If-Match protege a versão e nenhuma operação parcial é salva.

---

## Erros comuns importantes

### Usar DTO opcional sem definir semantica

Ausência e null ficam ambíguos.

### Aceitar application/json em PATCH

O media type não informa qual algoritmo aplicar.

### Aplicar patch diretamente na entity

Campos protegidos e estado JPA ficam expostos.

### Salvar depois de cada operacao

Uma falha posterior deixa atualização parcial.

### Considerar PATCH sempre idempotente

A propriedade depende do patch document.

---

## Comandos uteis

### PUT

```powershell
.\scripts\117_testar_put_replacement.ps1 `
  -Id 1 `
  -ETag '"v0"'
```

### Merge Patch

```powershell
.\scripts\118_testar_merge_patch.ps1 `
  -Id 1 `
  -ETag '"v1"'
```

### JSON Patch

```powershell
.\scripts\119_testar_json_patch.ps1 `
  -Id 1 `
  -ETag '"v2"'
```

### Segurança

```powershell
.\scripts\121_testar_patch_security.ps1 `
  -Id 1 `
  -ETag '"v2"'
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — PUT incompleto

Envie apenas description.

Confirme falha porque value é obrigatório.

### Parte 2 — Merge Patch vazio

Envie `{}`.

Confirme no-op e ETag preservada.

### Parte 3 — Null explicito

Compare description ausente, null e string vazia.

Registre os três resultados.

### Parte 4 — Operacoes ordenadas

Crie JSON Patch em que `test` depende de `replace` anterior.

Inverta a ordem.

### Parte 5 — Path protegido

Tente copy de `/version` para `/description`.

Confirme bloqueio.

### Parte 6 — Limite de operacoes

Envie 21 operations.

Confirme 422.

### Parte 7 — Arrays

Crie fixture com tags.

Compare Merge Patch substituindo array inteiro com JSON Patch alterando índice.

Não adicione tags ao recurso de produção.

### Parte 8 — ADR

Registre:

```text
PUT como replacement completo;

Merge Patch para alteracao por fields;

JSON Patch para operacoes;

media types explicitos;

If-Match em toda escrita;

whitelist de paths;

estado final validado;

patch atomico;

JsonNode somente na web;

PATCH somente quando justificado.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 376 foi preservada;
- o mesmo projeto foi continuado;
- RFC 9110 foi usada para semântica HTTP;
- RFC 5789 foi usada para PATCH;
- RFC 7396 foi usada para JSON Merge Patch;
- RFC 6902 foi usada para JSON Patch;
- PUT foi mantido como replacement completo;
- PUT não foi tratado como partial update;
- PUT em id ausente continua 404 por política da API;
- idempotência de PUT foi explicada;
- PATCH foi definido como aplicação de patch document;
- PATCH não foi tratado como inerentemente idempotente;
- idempotência por documento foi explicada;
- `description` foi adicionado ao recurso;
- migration V3 foi criada;
- migrations anteriores não foram editadas;
- description é nullable e limitada a 500;
- domain, entity, mapper e responses foram atualizados;
- summary da coleção permaneceu enxuto;
- create request recebeu description;
- PUT request recebeu description;
- PUT sem description remove valor anterior;
- PUT com null remove valor anterior;
- PUT com string define novo valor;
- no-op de PUT considera value e description;
- JSON Merge Patch foi implementado;
- media type merge patch foi declarado;
- membro ausente preserva valor;
- membro presente substitui;
- description null remove;
- value null foi rejeitado;
- patch não objeto foi rejeitado;
- arrays do Merge Patch foram explicados;
- JSON Patch foi implementado;
- media type JSON Patch foi declarado;
- add foi implementado;
- remove foi implementado;
- replace foi implementado;
- move foi implementado;
- copy foi implementado;
- test foi implementado;
- operações são aplicadas em ordem;
- test failure interrompe o documento;
- test failure retorna 409;
- operation inválida retorna 422;
- path inválido retorna 422;
- resultado final inválido retorna 422;
- JSON malformado retorna 400;
- media type errado retorna 415;
- If-Match ausente retorna 428;
- If-Match antiga retorna 412;
- recurso ausente retorna 404;
- duplicidade continua 409;
- Accept-Patch foi publicado;
- Allow e Accept-Patch foram diferenciados;
- OPTIONS foi criado;
- PATCH com application/json foi rejeitado;
- editable document contém somente value e description;
- id não pode ser alterado;
- version não pode ser alterada;
- normalizedValue não pode ser alterado;
- createdAt não pode ser alterado;
- updatedAt não pode ser alterado;
- whitelist usa paths exatos;
- path raiz foi rejeitado;
- path desconhecido foi rejeitado;
- máximo de 20 operações foi aplicado;
- patch foi aplicado sobre cópia isolada;
- nenhuma gravação ocorreu por operação;
- estado final foi validado;
- Bean Validation foi executada antes do service replace;
- service não foi chamado em patch inválido;
- uma única chamada de replacement foi usada;
- transaction e optimistic locking foram preservados;
- If-Match continuou obrigatório;
- JsonNode ficou restrito à web;
- application não importa Jackson;
- domain não importa Jackson;
- entity não possui lógica de patch;
- ObjectMapper não foi usado como mapper arquitetural;
- BeanUtils não foi usado;
- reflection não foi usada;
- `Map<String,Object>` não foi usado;
- `PutReplacementSemanticsTest` foi criado;
- `MergePatchSemanticsTest` foi criado;
- `JsonPatchOperationTest` foi criado;
- todas as seis operações foram testadas;
- `JsonPatchAtomicityTest` foi criado;
- estado persistido foi preservado após falha;
- `PatchAllowedPathsTest` foi criado;
- `PatchFinalValidationTest` foi criado;
- `PatchMassAssignmentTest` foi criado;
- `PutVsPatchWebMvcTest` foi criado;
- `PatchMediaTypeWebMvcTest` foi criado;
- `PatchPreconditionWebMvcTest` foi criado;
- `PatchProblemDetailTest` foi criado;
- `PatchArchitectureTest` foi criado;
- `PutVsPatchLiveServerIT` foi criado;
- PostgreSQL real foi usado;
- GET, PUT, Merge Patch, JSON Patch e OPTIONS foram exercitados;
- documentação completa foi criada;
- scripts foram criados;
- testes unitários, validação, segurança, MVC, arquitetura, live, suite e package passaram;
- paginação, sorting avançado, Specifications, OpenAPI, Security e cache não foram antecipados;
- ponte para a aula 378 está correta;
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
git commit -m "feat(m14): comparar put e patch com contratos explicitos"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- payload temporário;
- ETag capturada;
- dump;
- fields fora da whitelist;
- dependency desnecessária;
- alteração da paginação.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você implementou três estratégias de atualização.

```text
PUT:
replacement completo.

JSON Merge Patch:
merge por fields.

JSON Patch:
sequencia de operacoes.
```

Você comprovou:

```text
ausencia no PUT remove estado omitido;

ausencia no Merge Patch preserva;

null no Merge Patch remove;

JSON Patch executa em ordem;

test pode bloquear o documento;

patch inteiro e atomico;

estado final e validado;

paths protegidos sao rejeitados;

If-Match continua obrigatorio;

optimistic locking continua ativo.
```

A decisão central foi:

```text
a escolha entre PUT e PATCH
nao e apenas uma escolha de annotation;

ela define a semantica
de ausencia, null, replacement,
operacoes, idempotencia e seguranca.
```

A próxima aula será:

```text
378 - M14.23 - Paginacao e ordenacao em API
```

Nela, você continuará no mesmo projeto e aprofundará:

- paginação offset-based;
- page e size;
- limites;
- ordenação simples e múltipla;
- whitelist de campos;
- direção;
- parâmetros repetidos;
- stable sort;
- tie-breaker;
- links;
- metadata;
- total count;
- custo de count query;
- página acima do limite;
- zero-based versus one-based;
- validação;
- Problem Details;
- contratos de aplicação;
- Spring Data Pageable;
- testes de repository;
- testes HTTP;
- compatibilidade de paginação.

A aula 377 respondeu:

```text
quando usar PUT,
quando usar PATCH
e como implementar ambos
sem ambiguidade?
```

A aula 378 responderá:

```text
como desenhar paginacao
e ordenacao de API
de forma estavel e escalavel?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar replacement completo de modificação parcial.
- [ ] Sei explicar ausência e null em PUT e Merge Patch.
- [ ] Sei aplicar as seis operações de JSON Patch.
- [ ] Sei proteger paths, validar o estado final e garantir atomicidade.
- [ ] Sei escolher quando não oferecer PATCH.

---

## Troubleshooting adicional

### Merge Patch remove fields inesperadamente

Confirme que null significa remoção e que ausência preserva.

### PUT preserva description antiga

O request está sendo tratado incorretamente como parcial.

### JSON Patch salva primeira operacao antes da falha

O applier está persistindo cedo demais.

### Field protegido foi alterado

Revise whitelist e não aplique o patch na entity.

### PATCH retorna 415

Confirme o media type exato.

### Test operation falha depois do retry

PATCH não é automaticamente idempotente; revise estado e If-Match.

---

## Perguntas de revisao

1. O que PUT representa?
2. PUT é idempotente?
3. O que PATCH representa?
4. PATCH é sempre idempotente?
5. Qual RFC define PATCH?
6. Qual media type do Merge Patch?
7. Qual media type do JSON Patch?
8. O que ausência significa no Merge Patch?
9. O que null significa no Merge Patch?
10. Como PUT trata campo omitido?
11. Quais são as operações JSON Patch?
12. O que faz test?
13. Accept-Patch anuncia o quê?
14. If-Match continua necessário?
15. Onde JsonNode pode existir?
16. Patch pode alterar version?
17. Quando retornar 422?
18. Como garantir atomicidade?
19. Quando não oferecer PATCH?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Replacement completo.
2. Sim.
3. Aplicação de mudanças.
4. Não.
5. RFC 5789.
6. `application/merge-patch+json`.
7. `application/json-patch+json`.
8. Preservar.
9. Remover.
10. Substitui pelo estado ausente ou null.
11. Add, remove, replace, move, copy e test.
12. Verifica expectativa.
13. Formatos aceitos.
14. Sim.
15. Na camada web de patch.
16. Não.
17. Documento compreendido, mas inaplicável.
18. Aplicar em cópia e salvar uma vez.
19. Quando não há necessidade ou semântica segura.
20. Paginação e ordenação em API.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 377 - M14.22 - PUT vs PATCH

- Continuei no projeto `formacao-java-backend-api`.
- Aprofundei a semântica de PUT.
- Mantive PUT como replacement completo.
- Diferenciei PUT de atualização parcial.
- Estudei RFC 5789 para PATCH.
- Estudei JSON Merge Patch.
- Estudei JSON Patch.
- Adicionei o campo opcional `description`.
- Criei migration V3.
- Demonstrei que PUT sem description remove o valor anterior.
- Demonstrei que Merge Patch sem description preserva o valor.
- Demonstrei que null em Merge Patch remove o campo.
- Implementei `application/merge-patch+json`.
- Implementei `application/json-patch+json`.
- Implementei add, remove, replace, move, copy e test.
- Publiquei o header `Accept-Patch`.
- Mantive `If-Match` em todas as alterações.
- Preservei ETag e optimistic locking.
- Apliquei patches em uma representação editável isolada.
- Mantive JsonNode somente na camada web.
- Protegi id, version, timestamps e normalized value.
- Usei whitelist exata de paths.
- Limitei a quantidade de operações.
- Apliquei o documento inteiro antes de persistir.
- Validei o estado final com Bean Validation.
- Impedi escrita parcial.
- Diferenciei 400, 409, 412, 415, 422 e 428.
- Mantive Problem Details integrado.
- Testei atomicidade, mass assignment e concorrência.
- Não alterei paginação ou Specifications.
- Próxima aula: Paginação e ordenação em API.
```

---

## Referencia tecnica curta

```text
PUT:
replacement.

PATCH:
mudancas.

Merge Patch:
fields.

JSON Patch:
operacoes.

Ausente:
preserva no merge.

Null:
remove no merge.

Accept-Patch:
formatos.

If-Match:
concorrencia.

Whitelist:
seguranca.

Atomicidade:
tudo ou nada.
```

Regra final:

```text
PUT deve substituir a representacao editavel completa e permanecer idempotente, enquanto PATCH deve aplicar um patch document cujo media type define a semantica; JSON Merge Patch diferencia ausencia de null e JSON Patch executa add, remove, replace, move, copy e test em ordem, mas ambos precisam de If-Match, whitelist de paths, aplicacao sobre copia isolada, validacao do estado final, uma unica gravacao transacional e protecao contra mass assignment, sem permitir que JsonNode, paths ou detalhes de patch atravessem para application, domain ou persistence.
```
