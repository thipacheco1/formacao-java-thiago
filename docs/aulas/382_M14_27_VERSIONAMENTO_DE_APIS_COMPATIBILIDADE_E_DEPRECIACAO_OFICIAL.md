# 382 - M14.27 - Versionamento de APIs compatibilidade e depreciacao

## Apresentacao da aula

Na aula 381, você transformou o contrato OpenAPI em uma fonte de verdade governada.

O fluxo ficou:

```text
contrato canonical;

review;

lint;

bundle;

validation;

generation;

diff;

implementacao;

runtime conformance;

release;

promocao da baseline.
```

A API passou a possuir:

- contrato modular;
- baseline liberada;
- lint estrito;
- bundle determinístico;
- geração de cliente;
- comparação de breaking changes;
- testes de conformidade entre canonical, springdoc e runtime;
- ownership;
- gates de CI.

Essa governança responde:

```text
a mudanca proposta
quebra o contrato atual?
```

Porém, uma pergunta permanece.

Quando uma mudança realmente precisa ser incompatível:

```text
como evoluir a API
sem interromper consumidores antigos?
```

Exemplo.

A versão atual publica:

```json
{
  "id": 10,
  "value": "Spring MVC",
  "description": "Mensagem de laboratorio"
}
```

Uma nova decisão de produto deseja substituir o nome público:

```text
value
```

por:

```text
message.
```

Se o campo for renomeado diretamente na v1, consumidores antigos deixam de desserializar o payload esperado.

O contrato atual não pode simplesmente mudar.

A pergunta central desta aula será:

```text
como evoluir contratos HTTP,
manter compatibilidade,
publicar uma nova versao
e retirar a versao antiga
de forma previsivel?
```

A solução adotará:

```text
versionamento por URI;

v1 e v2 convivendo;

DTOs web separados;

mesmos use cases;

mesmo dominio;

mesma persistencia;

depreciacao explicita;

Sunset planejado;

links de migracao;

contratos governados por versao;

testes com clientes antigos e novos.
```

A estratégia principal será:

```text
/api/v1/runtime/managed-messages;

/api/v2/runtime/managed-messages.
```

A v1 continuará publicando:

```text
value.
```

A v2 publicará:

```text
message.
```

O domínio continuará utilizando:

```text
value.
```

Isso é uma decisão interna.

O nome público não precisa ser o mesmo nome interno.

Controllers e mappers v1 e v2 compartilharão:

- input ports;
- application service;
- repository port;
- transactions;
- domain model;
- persistence adapter;
- PostgreSQL.

Eles não compartilharão os DTOs públicos.

Essa separação impede que uma annotation Jackson ou mudança em um record v2 altere a resposta v1.

A v1 será marcada como deprecated.

Depreciação não significa remoção imediata.

Ela comunica:

```text
a versao continua funcionando;

novas integracoes devem evitar a versao;

consumidores existentes devem migrar;

uma data de retirada pode ser anunciada.
```

A aula utilizará datas fixas de laboratório:

```text
deprecation date:
2026-10-01T00:00:00Z.

sunset date:
2027-04-01T00:00:00Z.
```

Headers v1:

```http
Deprecation: @1790812800
Sunset: Thu, 01 Apr 2027 00:00:00 GMT
```

Os formatos são diferentes por definição dos RFCs.

`Deprecation` utiliza uma Structured Field Date.

`Sunset` utiliza HTTP-date.

A data de Sunset nunca poderá ser anterior à data de Deprecation.

Links:

```http
Link: </docs/api/v1/deprecation>; rel="deprecation"; type="text/html"
Link: </docs/api/v1/sunset>; rel="sunset"; type="text/html"
Link: </api/v2/runtime/managed-messages>; rel="successor-version"
```

A v1 não será removida nesta aula.

A aula também não programará uma resposta 410 automática depois da data.

Uma retirada precisa considerar:

- adoção da v2;
- consumidores ainda ativos;
- comunicação;
- suporte;
- métricas;
- exceções aprovadas;
- rollback;
- data real de produção.

O objetivo é construir o ciclo de vida corretamente, não simular uma remoção irresponsável.

A aula comparará estratégias de versionamento:

```text
URI;

header;

media type;

query parameter.
```

A implementação oficial utilizará URI porque:

- a versão fica visível;
- roteamento fica simples;
- documentação fica separável;
- cache e observabilidade ficam claros;
- links de migração são diretos;
- consumidores entendem a major version.

A escolha não será apresentada como regra universal.

O contrato v1 continuará em:

```text
contracts/openapi/managed-runtime-messages-v1.
```

O contrato v2 ficará em:

```text
contracts/openapi/managed-runtime-messages-v2.
```

A baseline v1 não será reescrita.

A baseline v2 nascerá somente depois de sua primeira release aprovada.

O diff continuará comparando:

```text
v1 candidate com v1 released;

v2 candidate com v2 released,
quando a baseline v2 existir.
```

Não compare v2 com v1 esperando compatibilidade.

A v2 existe justamente porque uma mudança incompatível foi aprovada.

A próxima aula será:

```text
383 - M14.28 - Profiles por ambiente e configuracao segura
```

Portanto, esta aula não aprofundará:

- externalização segura das datas;
- secrets;
- variáveis de ambiente;
- Config Data;
- profile groups;
- Vault;
- Kubernetes Secrets;
- configuração por ambiente;
- precedência de properties.

A política de ciclo de vida permanecerá em um bean de laboratório testável.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
378:
Paginacao e ordenacao em API.

379:
Filtros dinamicos e Specifications.

380:
OpenAPI Swagger.

381:
OpenAPI contract first e governanca de contrato.

382:
Versionamento de APIs compatibilidade e depreciacao.

383:
Profiles por ambiente e configuracao segura.

384:
Logging em APIs.
```

A aula 381 respondeu:

```text
como governar o contrato
antes da implementacao?
```

A aula 382 responderá:

```text
como evoluir um contrato
quando uma mudanca incompatível
e realmente necessaria?
```

Nesta aula:

```text
compatibilidade backward:
sim.

compatibilidade forward:
sim.

breaking changes:
sim.

Semantic Versioning:
sim.

versionamento por URI:
implementado.

versionamento por header:
comparado.

media type versioning:
comparado.

query versioning:
comparado.

v1:
preservada.

v2:
criada.

deprecation:
sim.

Sunset:
sim.

successor-version:
sim.

contratos separados:
sim.

clientes antigo e novo:
sim.

retirada efetiva:
nao.

profiles:
nao.

configuracao segura:
nao.
```

A regra central será:

```text
uma nova major version
nao autoriza quebrar a versao antiga;

as duas precisam coexistir
durante uma migracao governada.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura principal:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageUseCases.java
│       └── ManagedRuntimeMessageApplicationService.java
├── domain
│   └── managedmessage
│       └── ManagedRuntimeMessage.java
└── web
    ├── versioning
    │   ├── ApiVersionLifecycleFilter.java
    │   ├── ApiVersionLifecyclePolicy.java
    │   ├── ApiVersionLifecycleHeaders.java
    │   └── ApiVersionLinkBuilder.java
    ├── v1
    │   └── managedmessage
    │       ├── ManagedRuntimeMessageV1Controller.java
    │       ├── ManagedRuntimeMessageV1WebMapper.java
    │       ├── request
    │       └── response
    └── v2
        └── managedmessage
            ├── ManagedRuntimeMessageV2Controller.java
            ├── ManagedRuntimeMessageV2WebMapper.java
            ├── request
            └── response
```

Contratos:

```text
contracts/openapi
├── managed-runtime-messages-v1
├── managed-runtime-messages-v2
├── baseline
│   ├── managed-runtime-messages-v1-released.yaml
│   └── README.md
└── lifecycle
    └── v1-deprecation-policy.md
```

Testes:

```text
src/test/java/br/com/formacao/backend/versioning
├── ApiVersionLifecyclePolicyTest.java
├── ApiVersionLifecycleHeadersTest.java
├── ApiVersionLifecycleFilterTest.java
├── ManagedRuntimeMessageV1CompatibilityTest.java
├── ManagedRuntimeMessageV2ContractTest.java
├── ManagedRuntimeMessageVersionIsolationTest.java
├── ManagedRuntimeMessageVersionedOpenApiTest.java
├── ManagedRuntimeMessageV1GeneratedClientIT.java
├── ManagedRuntimeMessageV2GeneratedClientIT.java
├── ManagedRuntimeMessageVersionLinkTest.java
├── ManagedRuntimeMessageVersioningArchitectureTest.java
└── ManagedRuntimeMessageVersioningLiveServerIT.java
```

Documentação:

```text
docs
├── api-versioning-strategies.md
├── backward-forward-compatibility.md
├── api-semantic-versioning.md
├── uri-versioning-contract.md
├── v1-v2-migration-guide.md
├── api-deprecation-header.md
├── api-sunset-header.md
├── api-version-links.md
├── api-deprecation-lifecycle.md
├── api-consumer-migration.md
├── api-retirement-checklist.md
└── api-versioning-baseline.md
```

Scripts:

```text
scripts
├── 148_testar_compatibilidade_v1.ps1
├── 149_testar_contrato_v2.ps1
├── 150_testar_headers_depreciacao.ps1
├── 151_testar_links_de_migracao.ps1
├── 152_testar_clientes_v1_v2.ps1
├── 153_comparar_contratos_por_versao.ps1
└── 154_executar_testes_versionamento.ps1
```

Resultados esperados:

```text
GET v1:
200 com value.

GET v2:
200 com message.

POST v1:
aceita value.

POST v2:
aceita message.

dominio:
um.

repository:
um.

tabela:
uma.

v1 deprecated:
sim.

v1 behavior:
inalterado.

Deprecation:
Structured Date.

Sunset:
HTTP-date.

successor-version:
v2.

OpenAPI v1:
deprecated true.

OpenAPI v2:
ativa.

cliente v1 antigo:
continua funcionando.

cliente v2:
funciona.

v1 removida:
nao.
```

---

## Conceito essencial

### O que e versionamento de API

Versionamento de API é a estratégia usada para evoluir uma interface pública quando consumidores não podem migrar todos ao mesmo tempo.

Uma versão não é apenas um número.

Ela representa:

- contrato;
- comportamento;
- defaults;
- schemas;
- errors;
- headers;
- media types;
- limites;
- semântica.

---

### Compatibilidade backward

Uma evolução é backward compatible quando consumidores construídos para o contrato anterior continuam funcionando com a nova implementação daquela mesma versão.

Exemplo:

```text
cliente v1 antigo
continua consumindo runtime v1 atualizado.
```

Adicionar uma property opcional de response costuma ser compatível somente se o consumidor tolera campos desconhecidos.

Não presuma isso sem testar clientes reais ou gerados.

---

### Compatibilidade forward

Forward compatibility descreve a capacidade de componentes antigos tolerarem informações produzidas por componentes mais novos ou de componentes novos lidarem com uma versão anterior dentro de uma política definida.

O termo é usado de formas diferentes.

Nesta formação, registre a direção explicitamente.

Exemplo:

```text
consumidor antigo tolera
um campo opcional novo.
```

Evite escrever apenas:

```text
forward compatible
```

sem explicar produtor e consumidor.

---

### Wire compatibility

Wire compatibility trata do que trafega no protocolo.

Exemplos:

- JSON;
- headers;
- status;
- media types;
- parâmetros.

Uma classe Java pode continuar compilando enquanto o JSON mudou.

Por isso, source compatibility não garante wire compatibility.

---

### Breaking change

Mudança incompatível inclui:

- remover path;
- remover operation;
- renomear property;
- tornar property obrigatória;
- restringir enum;
- mudar tipo;
- mudar status;
- remover header;
- mudar default;
- alterar semântica de null;
- reduzir limite;
- mudar ordenação padrão.

A renomeação:

```text
value para message
```

é uma breaking change.

Ela justifica a v2.

---

### Mudanca aditiva

Mudanças frequentemente aditivas:

- novo endpoint;
- query parameter opcional;
- response field opcional;
- novo status de erro documentado;
- novo header opcional.

“Aditiva” não significa automaticamente segura.

Um enum novo pode quebrar um switch exaustivo.

Uma property nova pode quebrar um parser configurado para rejeitar campos desconhecidos.

---

### Semantic Versioning do contrato

Use Semantic Versioning para releases do contrato:

```text
MAJOR.MINOR.PATCH.
```

Política:

```text
MAJOR:
breaking change.

MINOR:
capacidade backward compatible.

PATCH:
correcao semantica,
descricao,
example ou ajuste nao comportamental.
```

Exemplo:

```text
v1 URI:
major publica 1.

info.version:
1.4.2.
```

A URI major e o SemVer do artefato não são a mesma coisa.

---

### URI versioning

Exemplo:

```text
/api/v1/...;

/api/v2/....
```

Vantagens:

- explícito;
- roteamento simples;
- cache separado;
- logs claros;
- links diretos;
- documentação por versão;
- debug fácil.

Custos:

- URIs mudam;
- duplicação de controllers;
- migração explícita;
- risco de duplicar domínio.

A baseline evita duplicação de domínio.

---

### Header versioning

Exemplo:

```http
API-Version: 2
```

Vantagens:

- URI estável;
- versão fora do identificador do recurso.

Custos:

- navegação menos óbvia;
- cache precisa considerar o header;
- links e ferramentas ficam menos transparentes;
- debug manual é mais difícil;
- `Vary` precisa ser considerado.

Não será implementado.

---

### Media type versioning

Exemplo:

```http
Accept: application/vnd.formacao.managed-message.v2+json
```

Vantagens:

- negociação por representação;
- semântica alinhada ao media type;
- URI estável.

Custos:

- configuração mais complexa;
- documentação e clients mais difíceis;
- cache depende de `Accept`;
- erros 406 e 415 aumentam;
- suporte de ferramentas varia.

Não será implementado.

---

### Query parameter versioning

Exemplo:

```text
?version=2.
```

É simples para testes, mas mistura versão com filtros e pode criar caches e links ambíguos.

A baseline não o recomenda para major versions públicas.

---

### Uma estrategia por API

Não ofereça simultaneamente:

- URI v2;
- header v2;
- media type v2;
- query v2.

Múltiplos caminhos para o mesmo contrato aumentam combinações e testes.

A feature escolherá URI.

---

### DTOs separados

V1:

```java
public record ManagedRuntimeMessageV1DetailResponse(
        long id,
        String value,
        String description,
        Instant createdAt,
        Instant updatedAt,
        long version
) {
}
```

V2:

```java
public record ManagedRuntimeMessageV2DetailResponse(
        long id,
        String message,
        String description,
        Instant createdAt,
        Instant updatedAt,
        long version
) {
}
```

Não use `@JsonProperty` para fazer um único record fingir duas versões.

---

### Mesmos casos de uso

Os dois controllers chamam:

```text
ManagedRuntimeMessageUseCases.
```

O caso de uso não conhece:

- v1;
- v2;
- `value`;
- `message` como nomes HTTP;
- deprecation;
- Sunset.

Ele retorna o modelo da aplicação.

---

### Mesmo dominio

O domínio não será duplicado em:

```text
ManagedRuntimeMessageV1;

ManagedRuntimeMessageV2.
```

A major version pertence à interface pública.

Uma nova versão somente exige novo domínio quando a regra de negócio também mudou de forma incompatível.

Nesta aula, mudou apenas o contrato web.

---

### Mapper por versao

V1 mapper:

```text
domain.value
    -> response.value.
```

V2 mapper:

```text
domain.value
    -> response.message.
```

Request v2:

```text
request.message
    -> createCommand.value.
```

O mapping torna a mudança explícita.

---

### Deprecation

Deprecation informa que o recurso será ou já foi depreciado.

Ela não muda automaticamente o comportamento.

A v1 continuará:

- respondendo os mesmos status;
- aceitando os mesmos payloads;
- usando os mesmos schemas;
- executando as mesmas regras.

Não torne v1 propositalmente mais lenta.

Não introduza erro artificial para “forçar” migração.

---

### Header Deprecation

Formato:

```http
Deprecation: @1790812800
```

O valor é uma Structured Field Date.

Não use:

```http
Deprecation: true
```

Não use HTTP-date nesse header.

A data pode estar no futuro.

---

### Header Sunset

Formato:

```http
Sunset: Thu, 01 Apr 2027 00:00:00 GMT
```

Ele informa quando o recurso provavelmente ficará indisponível.

Sunset é um hint.

Ele não garante disponibilidade até a data nem indisponibilidade imediata depois.

---

### Ordem das datas

Regra:

```text
sunsetAt >= deprecationAt.
```

A policy falhará na inicialização do teste quando a ordem estiver inválida.

---

### Link de deprecacao

Header:

```http
Link: </docs/api/v1/deprecation>;
      rel="deprecation";
      type="text/html"
```

O destino explica:

- motivo;
- timeline;
- diferenças;
- ações do consumidor;
- suporte.

---

### Link de Sunset

Header:

```http
Link: </docs/api/v1/sunset>;
      rel="sunset";
      type="text/html"
```

Ele aponta para a política de retirada.

---

### successor-version

Header:

```http
Link: </api/v2/runtime/managed-messages>;
      rel="successor-version"
```

Ele permite descobrir a versão sucessora.

O link não substitui um guia de migração.

---

### latest-version

Uma API também pode publicar:

```text
rel="latest-version".
```

A baseline utilizará somente `successor-version` no recurso v1.

Isso reduz ambiguidade.

---

### Escopo dos headers

A v1 terá headers em todas as responses do prefixo:

```text
/api/v1/runtime/managed-messages.
```

Incluindo:

- 2xx;
- 4xx;
- 5xx produzidos pela API.

Um filter web garante consistência.

A documentação explica que o escopo é a versão v1 da feature.

---

### Filter de ciclo de vida

`ApiVersionLifecycleFilter` estende:

```text
OncePerRequestFilter.
```

Ele identifica o prefixo v1.

Antes de concluir a response, adiciona os headers.

Ele não altera status ou body.

---

### OpenAPI deprecated

Operations v1 recebem:

```yaml
deprecated: true
```

OpenAPI informa que consumidores devem evitar novos usos.

O campo não contém a data.

Extensions:

```yaml
x-deprecation-date: "2026-10-01T00:00:00Z"
x-sunset-date: "2027-04-01T00:00:00Z"
x-successor-version: "/api/v2/runtime/managed-messages"
```

Extensions precisam ser documentadas e testadas.

---

### Contrato v2

O contrato v2 possui:

```yaml
info:
  version: 2.0.0
```

Paths usam `/api/v2`.

Schemas possuem nomes v2 explícitos.

Operation ids:

```text
createManagedRuntimeMessageV2;

getManagedRuntimeMessageV2;

listManagedRuntimeMessagesV2.
```

Isso evita colisão em clients gerados.

---

### V1 continua governada

O candidate v1 precisa continuar compatível com:

```text
v1 released.
```

A adição de headers de depreciação é revisada como mudança aditiva.

O body v1 não muda.

A v2 possui governança própria.

---

### Cliente antigo

O cliente v1 gerado na aula 381 será recompilado sem regeneração.

Ele chamará o runtime atual.

Resultado esperado:

```text
sucesso.
```

Isso prova compatibilidade de consumidor.

Não regenere o client antes do teste.

---

### Cliente v2

Gere um client a partir do contrato v2.

Ele utiliza `message`.

Ele não precisa conhecer `value`.

Ambos os clients acessam os mesmos dados persistidos.

---

### Ciclo de vida

Estados:

```text
ACTIVE;

DEPRECATED;

SUNSET_ANNOUNCED;

RETIRED.
```

Nesta aula:

```text
v1:
DEPRECATED com Sunset anunciado.

v2:
ACTIVE.
```

RETIRED não será implementado no runtime.

---

### Deprecation antes de Sunset

Fluxo recomendado:

1. publicar v2;
2. publicar guia;
3. anunciar deprecation;
4. medir uso;
5. oferecer suporte;
6. anunciar Sunset;
7. confirmar migração;
8. retirar;
9. monitorar efeitos;
10. manter plano de rollback.

As datas do laboratório simplificam o exercício.

---

### 410 depois da retirada

Uma API retirada pode responder:

```text
410 Gone.
```

Também pode ficar sem rota ou redirecionar em um plano específico.

Esta aula não escolhe o comportamento final.

A decisão pertence ao plano de retirada aprovado.

---

### Metricas de uso

Antes de remover v1, acompanhe:

- requests por versão;
- consumers identificados;
- endpoints usados;
- status;
- volume;
- horários;
- erros;
- crescimento ou queda.

A implementação de observabilidade virá em aulas apropriadas.

Não use apenas “ninguém reclamou” como evidência.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

---

### 2. Preservar controller v1

Renomeie o controller existente para:

```text
ManagedRuntimeMessageV1Controller.
```

Mantenha mappings em:

```text
/api/v1/runtime/managed-messages.
```

Não altere DTOs v1.

---

### 3. Criar packages v1 e v2

Separe:

```text
web.v1;

web.v2.
```

Tipos comuns de protocolo podem permanecer em `web.common` somente quando forem realmente idênticos e estáveis.

Não compartilhe response DTOs.

---

### 4. Criar requests v2

Create e replace usam:

```text
message;

description.
```

Constraints permanecem equivalentes às regras v1.

PATCH paths v2 utilizam:

```text
/message;

/description.
```

---

### 5. Criar responses v2

Created, detail, updated e summary publicam:

```text
message.
```

Page response reutiliza somente metadata estável ou possui wrapper v2 explícito.

Prefira nome v2 para o wrapper público.

---

### 6. Criar mapper v2

Mapeie:

```text
message -> value;

value -> message.
```

Não altere commands ou domain.

---

### 7. Criar controller v2

Base path:

```text
/api/v2/runtime/managed-messages.
```

Implemente os mesmos capabilities da v1.

Reutilize os mesmos input ports.

---

### 8. Evoluir PATCH v2

Merge Patch aceita:

```text
message;

description.
```

JSON Patch aceita:

```text
/message;

/description.
```

V1 continua aceitando `/value`.

Não aceite os dois nomes na mesma versão.

---

### 9. Criar lifecycle policy

Bean imutável:

```text
deprecationAt;

sunsetAt;

documentationUri;

sunsetPolicyUri;

successorUri.
```

Use `Instant`.

Valide ordem das datas.

---

### 10. Criar formatter de Deprecation

Converta:

```text
Instant.getEpochSecond()
```

para:

```text
@<epoch>.
```

Não use formatter HTTP-date.

---

### 11. Criar formatter de Sunset

Use formatter RFC 1123 em UTC.

Resultado de laboratório:

```text
Thu, 01 Apr 2027 00:00:00 GMT.
```

Teste locale e timezone.

---

### 12. Criar LinkBuilder

Produza três link-values.

Preserve cada relation.

Não concatene URIs recebidas do cliente.

Todas as URIs vêm da policy.

---

### 13. Criar lifecycle filter

Aplique somente ao prefixo v1.

Adicione:

```text
Deprecation;

Sunset;

Link.
```

Não adicione à v2.

---

### 14. Cobrir errors v1

Execute:

- validation 400;
- not found 404;
- conflict 409;
- stale 412;
- patch invalid 422;
- missing precondition 428.

Confirme os headers de ciclo de vida.

---

### 15. Criar contrato v2

Copie a estrutura, não a baseline.

Atualize:

- paths;
- operation ids;
- schemas;
- examples;
- PATCH paths;
- info.version;
- descriptions.

---

### 16. Marcar v1 deprecated

No canonical v1:

```yaml
deprecated: true
```

em todas as operations públicas v1.

Adicione extensions de ciclo de vida.

---

### 17. Não marcar schemas v2 deprecated

Confirme:

```text
deprecated:
false ou ausente.
```

---

### 18. Atualizar OpenAPI group

Crie grupos:

```text
managed-runtime-messages-v1;

managed-runtime-messages-v2.
```

Endpoints:

```text
/v3/api-docs/managed-runtime-messages-v1;

/v3/api-docs/managed-runtime-messages-v2.
```

---

### 19. Atualizar Swagger UI

Exiba os dois groups no profile de laboratório.

A tag v1 inclui:

```text
Deprecated.
```

A tag v2 inclui:

```text
Current.
```

---

### 20. Executar diff v1

Compare v1 candidate com v1 released.

Espere:

```text
nenhuma incompatibilidade de body.
```

Headers e metadata de deprecation são mudanças aditivas.

---

### 21. Criar baseline inicial v2

Não promova imediatamente.

Primeiro:

- lint;
- bundle;
- generate;
- conformance;
- review.

Depois da release simulada, crie a baseline v2 em fixture ou procedimento documentado.

---

### 22. Recompilar client v1 antigo

Use o client gerado antes das mudanças.

Não regenere.

Execute contra o runtime atual.

Valide create, get e list.

---

### 23. Gerar client v2

Gere em:

```text
target/generated-openapi-client-v2.
```

Compile.

Valide nomes com `message`.

---

### 24. Criar teste de isolamento

Mude um example ou DTO v2 em fixture.

Confirme que schema v1 não muda.

---

### 25. Criar teste de persistencia compartilhada

Crie pela v1.

Leia pela v2.

Depois crie pela v2.

Leia pela v1.

Confirme o mesmo id e os nomes públicos corretos.

---

### 26. Criar CompatibilityTest v1

Valide JSON exato esperado por cliente antigo.

Não use apenas `contains`.

Confirme:

- `value` presente;
- `message` ausente.

---

### 27. Criar ContractTest v2

Confirme:

- `message` presente;
- `value` ausente;
- status iguais onde a semântica não mudou;
- Problem Details preservado.

---

### 28. Criar LifecyclePolicyTest

Teste:

- datas corretas;
- Sunset posterior;
- URIs;
- policy imutável;
- data inválida falha.

---

### 29. Criar HeadersTest

Valide valores exatos:

```text
Deprecation:
@1790812800.

Sunset:
Thu, 01 Apr 2027 00:00:00 GMT.
```

---

### 30. Criar LinkTest

Parseie Link.

Confirme relations:

```text
deprecation;

sunset;

successor-version.
```

Não faça assertion frágil apenas pela ordem.

---

### 31. Criar OpenApiTest

V1:

- deprecated true;
- extensions;
- schemas com value;
- paths v1.

V2:

- não deprecated;
- schemas com message;
- paths v2.

---

### 32. Criar ArchitectureTest

Valide:

- domain sem v1 ou v2;
- application sem v1 ou v2;
- persistence sem v1 ou v2;
- DTOs separados;
- controllers separados;
- mapper por versão;
- um repository;
- uma tabela;
- policy somente web;
- zero header versioning;
- zero media type versioning;
- zero query versioning;
- zero retirement automático.

---

### 33. Criar LiveServerIT

Use PostgreSQLContainer.

Fluxo:

1. POST v1;
2. GET v1;
3. GET v2 do mesmo id;
4. POST v2;
5. GET v1 do novo id;
6. PATCH v1 com `/value`;
7. PATCH v2 com `/message`;
8. validar lifecycle headers v1;
9. confirmar ausência desses headers v2;
10. validar contracts.

---

### 34. Criar guia de migracao

Tabela:

```text
v1:
value.

v2:
message.
```

Inclua:

- paths;
- payloads;
- PATCH paths;
- clients;
- timeline;
- headers;
- testes.

---

### 35. Criar politica de retirada

Documente critérios:

- uso abaixo do limite aprovado;
- consumidores conhecidos migrados;
- suporte concluído;
- incidentes resolvidos;
- comunicação enviada;
- rollback testado;
- owner aprova.

Não retire somente porque a data chegou.

---

### 36. Criar scripts

`148_testar_compatibilidade_v1.ps1` usa payload antigo.

`149_testar_contrato_v2.ps1` usa message.

`150_testar_headers_depreciacao.ps1` valida datas.

`151_testar_links_de_migracao.ps1` valida relations.

`152_testar_clientes_v1_v2.ps1` executa clients gerados.

`153_comparar_contratos_por_versao.ps1` executa diffs separados.

`154_executar_testes_versionamento.ps1` executa a suite.

---

### 37. Executar testes v1

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageV1CompatibilityTest,ManagedRuntimeMessageV1GeneratedClientIT test
```

---

### 38. Executar testes v2

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageV2ContractTest,ManagedRuntimeMessageV2GeneratedClientIT test
```

---

### 39. Executar lifecycle tests

```powershell
.\mvnw.cmd `
  -Dtest=ApiVersionLifecyclePolicyTest,ApiVersionLifecycleHeadersTest,ApiVersionLifecycleFilterTest,ManagedRuntimeMessageVersionLinkTest test
```

---

### 40. Executar OpenAPI

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageVersionedOpenApiTest test
```

---

### 41. Executar isolamento e arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageVersionIsolationTest,ManagedRuntimeMessageVersioningArchitectureTest test
```

---

### 42. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageVersioningLiveServerIT test
```

Docker precisa estar ativo.

---

### 43. Executar governanca

```powershell
.\scripts\153_comparar_contratos_por_versao.ps1
```

V1 continua compatível.

V2 passa pelos próprios gates.

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
v1:
preservada e deprecated.

v2:
ativa.

URI versioning:
implementado.

header versioning:
zero.

media type versioning:
zero.

query versioning:
zero.

retirement:
zero.

profiles seguros:
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
- clients gerados;
- bundles;
- diff reports;
- responses capturadas;
- logs;
- URL interna;
- configuração segura antecipada.

---

## Entendendo o que foi feito

### A v1 continuou intacta

O consumidor antigo continua recebendo `value`.

### A v2 ganhou um contrato próprio

A nova interface publica `message`.

### A regra de negocio nao foi duplicada

Controllers e mappers mudaram; application e persistence permaneceram compartilhadas.

### A deprecacao ficou descobrivel

Headers e links informam timeline e sucessora.

### A retirada permaneceu governada

Sunset anunciado não remove automaticamente a rota.

---

## Erros comuns importantes

### Renomear field na v1

Uma mudança aparentemente simples quebra o wire contract.

### Reutilizar o mesmo response DTO

Annotations e renames atravessam versões.

### Usar Deprecation true

O RFC atual exige uma Structured Field Date.

### Remover na data sem verificar uso

Sunset é parte do plano, não um script cego.

### Duplicar dominio por versao

A versão web não implica automaticamente uma nova regra de negócio.

---

## Comandos uteis

### Testar v1

```powershell
.\scripts\148_testar_compatibilidade_v1.ps1
```

### Testar v2

```powershell
.\scripts\149_testar_contrato_v2.ps1
```

### Validar deprecacao

```powershell
.\scripts\150_testar_headers_depreciacao.ps1
```

### Validar links

```powershell
.\scripts\151_testar_links_de_migracao.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Breaking change na v1

Renomeie temporariamente `value` no schema v1.

Confirme diff incompatível.

Restaure.

### Parte 2 — Campo opcional

Adicione um field opcional somente à v1 candidate.

Analise compatibilidade técnica e risco de consumer estrito.

Restaure.

### Parte 3 — Header versioning

Desenhe o mesmo fluxo com `API-Version`.

Liste necessidades de `Vary`, cache e documentação.

Não implemente.

### Parte 4 — Media type

Desenhe:

```text
application/vnd.formacao.managed-message.v2+json.
```

Compare com URI.

Não implemente.

### Parte 5 — Datas invalidas

Configure Sunset anterior à Deprecation em fixture.

Confirme falha.

### Parte 6 — Cliente antigo

Execute o client v1 sem regeneração.

Altere temporariamente o body v1 e observe a falha.

Restaure.

### Parte 7 — Retirada

Projete uma resposta 410 após a retirada.

Liste pré-condições organizacionais.

Não ative.

### Parte 8 — ADR

Registre:

```text
URI versioning para major;

v1 preservada;

v2 separada na web;

domain compartilhado;

value para message como breaking change;

Deprecation RFC 9745;

Sunset RFC 8594;

successor-version;

clientes antigos em CI;

retirada somente com evidencias;

profiles na aula 383.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 381 foi preservada;
- o mesmo projeto foi continuado;
- versionamento de API foi definido;
- compatibilidade backward foi definida;
- compatibilidade forward foi explicada com direção explícita;
- wire compatibility foi diferenciada de source compatibility;
- breaking changes foram catalogadas;
- mudanças aditivas foram tratadas com cautela;
- Semantic Versioning foi aplicado ao contrato;
- MAJOR, MINOR e PATCH foram diferenciados;
- major da URI foi diferenciada de `info.version`;
- estratégias por URI, header, media type e query foram comparadas;
- URI versioning foi escolhida;
- uma única estratégia foi implementada;
- header versioning não foi implementado;
- media type versioning não foi implementado;
- query versioning não foi implementado;
- `/api/v1` foi preservado;
- `/api/v2` foi criado;
- v1 continua publicando `value`;
- v2 publica `message`;
- v1 não aceita `message`;
- v2 não publica `value`;
- request DTOs v1 e v2 são separados;
- response DTOs v1 e v2 são separados;
- mappers v1 e v2 são separados;
- controllers v1 e v2 são separados;
- application service foi compartilhado;
- input ports foram compartilhados;
- domain model foi compartilhado;
- repository port foi compartilhado;
- persistence adapter foi compartilhado;
- tabela PostgreSQL foi compartilhada;
- nenhuma entity v2 foi criada;
- nenhum domínio v2 artificial foi criado;
- PATCH v1 usa `/value`;
- PATCH v2 usa `/message`;
- JSON Merge Patch foi preservado em ambas;
- JSON Patch foi preservado em ambas;
- If-Match foi preservado;
- ETag foi preservada;
- optimistic locking foi preservado;
- Problem Details foi preservado;
- v1 recebeu deprecation;
- deprecation não alterou comportamento;
- v1 não foi degradada artificialmente;
- RFC 9745 foi aplicada;
- `Deprecation` usa Structured Field Date;
- `Deprecation: true` não foi usado;
- epoch de laboratório foi validado;
- RFC 8594 foi aplicada;
- `Sunset` usa HTTP-date;
- Sunset é posterior à Deprecation;
- Sunset foi tratado como hint;
- link `deprecation` foi publicado;
- link `sunset` foi publicado;
- link `successor-version` foi publicado;
- URIs dos links vêm da policy;
- policy é imutável;
- policy valida a ordem das datas;
- filter aplica headers somente à v1;
- v2 não recebe headers de depreciação;
- responses 2xx v1 recebem headers;
- responses 4xx v1 recebem headers;
- responses 5xx v1 recebem headers quando produzidas pela API;
- filter não altera status;
- filter não altera body;
- OpenAPI v1 usa `deprecated: true`;
- OpenAPI v1 possui extensions de lifecycle;
- OpenAPI v2 não está deprecated;
- group OpenAPI v1 foi criado;
- group OpenAPI v2 foi criado;
- operation ids não colidem;
- contrato v1 permaneceu governado;
- contrato v2 foi criado separadamente;
- baseline v1 não foi reescrita;
- baseline v2 não foi promovida antes da release;
- diff v1 continua sem incompatibilidade;
- v2 passa lint, bundle, validation e conformance;
- client v1 antigo foi usado sem regeneração;
- client v1 antigo continua funcionando;
- client v2 foi gerado;
- client v2 usa `message`;
- create pela v1 pode ser lido pela v2;
- create pela v2 pode ser lido pela v1;
- ids e estado persistido são compartilhados;
- teste de compatibilidade v1 usa JSON exato;
- teste v1 confirma ausência de `message`;
- teste v2 confirma ausência de `value`;
- lifecycle policy foi testada;
- headers foram testados por valor exato;
- links foram parseados;
- OpenAPI por versão foi testada;
- isolamento entre versões foi testado;
- arquitetura sem versão no domínio foi testada;
- live server test foi criado;
- PostgreSQL real foi preservado;
- guia de migração foi criado;
- política de retirada foi documentada;
- uso por versão foi definido como evidência necessária;
- 410 foi discutido sem implementação;
- retirada automática não foi criada;
- v1 não foi removida;
- datas de laboratório foram identificadas como baseline;
- profiles não foram aprofundados;
- configuração segura não foi antecipada;
- logging não foi antecipado;
- scripts 148 a 154 foram criados;
- documentação completa foi criada;
- testes v1, v2, lifecycle, OpenAPI, clientes, arquitetura, live, governança, suite e package passaram;
- ponte para a aula 383 está correta;
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
git commit -m "feat(m14): versionar api e anunciar depreciacao da v1"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- clients gerados;
- bundles;
- diff reports;
- responses capturadas;
- logs;
- URLs internas;
- configuração de ambiente antecipada.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a API passou a evoluir sem quebrar o consumidor antigo.

O fluxo consolidado ficou:

```text
v1 canonical;

v2 canonical;

controllers por versao;

DTOs por versao;

mappers por versao;

application compartilhada;

persistence compartilhada;

deprecation headers;

Sunset;

links de migracao;

clients em CI;

retirada governada.
```

Você comprovou:

```text
v1 preservada;

v2 ativa;

value na v1;

message na v2;

mesmo dominio;

mesmo banco;

cliente antigo funcionando;

cliente novo funcionando;

Deprecation estruturado;

Sunset em HTTP-date;

successor-version;

nenhuma retirada automatica.
```

A decisão central foi:

```text
uma breaking change deve criar
uma nova major version publica,
mas nao pode apagar a versao anterior
sem periodo de convivencia,
sinais de deprecacao,
evidencias de migracao
e governanca de retirada.
```

A próxima aula será:

```text
383 - M14.28 - Profiles por ambiente e configuracao segura
```

Nela, você continuará no mesmo projeto e estudará:

- configuração externa;
- `application.yaml`;
- profiles;
- profile groups;
- Config Data;
- import;
- precedência;
- variáveis de ambiente;
- argumentos de linha;
- secrets;
- placeholders;
- validação de configuração;
- `@ConfigurationProperties`;
- records de properties;
- ambientes local, test, hml e production;
- URLs e credenciais;
- fail fast;
- logging de configuração sem secrets;
- Testcontainers;
- arquivos não versionados;
- configuração segura de OpenAPI;
- configuração das datas de lifecycle;
- testes por ambiente.

A aula 382 respondeu:

```text
como evoluir e depreciar
uma API sem quebrar consumidores?
```

A aula 383 responderá:

```text
como configurar cada ambiente
sem hardcode,
sem vazar secrets
e sem produzir comportamento ambiguo?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar mudança aditiva de breaking change.
- [ ] Sei manter DTOs web separados por major version.
- [ ] Sei preservar domínio e persistência compartilhados.
- [ ] Sei publicar Deprecation, Sunset e links de migração.
- [ ] Sei exigir evidências antes de retirar uma versão.

---

## Troubleshooting adicional

### V1 passou a retornar message

Revise DTO e mapper v1.

### V2 alterou a entity

A mudança pública não precisa duplicar persistence.

### Deprecation aparece como data HTTP

Esse header usa Structured Field Date com `@epoch`.

### Sunset aparece antes da deprecacao

A policy deve falhar.

### Cliente antigo só funciona depois de regenerar

O teste não está provando backward compatibility.

### V2 recebe headers deprecated

Revise o matcher do filter.

---

## Perguntas de revisao

1. O que versionamento de API protege?
2. O que é backward compatibility?
3. O que é wire compatibility?
4. Renomear field é breaking?
5. O que MAJOR representa?
6. Qual estratégia foi implementada?
7. Qual URI da v2?
8. V1 e v2 compartilham domínio?
9. Elas compartilham DTOs?
10. Qual field existe na v1?
11. Qual field existe na v2?
12. O que Deprecation comunica?
13. Qual formato do header Deprecation?
14. Qual formato do Sunset?
15. Sunset remove a rota automaticamente?
16. Para que serve successor-version?
17. Baseline v1 pode ser reescrita?
18. Cliente antigo deve ser regenerado no teste?
19. V1 foi retirada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Consumidores durante evolução.
2. Cliente antigo continua funcionando.
3. Compatibilidade do protocolo.
4. Sim.
5. Mudança incompatível.
6. Versionamento por URI.
7. `/api/v2/runtime/managed-messages`.
8. Sim.
9. Não.
10. `value`.
11. `message`.
12. Uso futuro não recomendado e timeline.
13. Structured Field Date `@epoch`.
14. HTTP-date.
15. Não.
16. Apontar versão sucessora.
17. Não.
18. Não.
19. Não.
20. Profiles por ambiente e configuração segura.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 382 - M14.27 - Versionamento de APIs compatibilidade e depreciacao

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei compatibilidade backward, forward, source e wire.
- Cataloguei breaking changes e mudanças aditivas.
- Apliquei Semantic Versioning ao contrato.
- Diferenciei major pública da URI de `info.version`.
- Comparei versionamento por URI, header, media type e query.
- Escolhi versionamento por URI para a baseline.
- Mantive `/api/v1` funcionando.
- Criei `/api/v2`.
- Mantive `value` na v1.
- Publiquei `message` na v2.
- Separei controllers, DTOs e mappers por versão.
- Compartilhei application service, domínio, repository e banco.
- Mantive PATCH, If-Match, ETag e Problem Details.
- Marquei operations v1 como deprecated no OpenAPI.
- Apliquei RFC 9745 ao header Deprecation.
- Usei Structured Field Date com `@epoch`.
- Apliquei RFC 8594 ao header Sunset.
- Garanti Sunset posterior à Deprecation.
- Publiquei links de depreciação, Sunset e successor-version.
- Mantive o comportamento v1 inalterado.
- Testei headers também em responses de erro.
- Mantive o contrato v1 governado.
- Criei contrato v2 separado.
- Não reescrevi a baseline v1.
- Reexecutei o cliente v1 antigo sem regeneração.
- Gerei e testei o cliente v2.
- Comprovei persistência compartilhada entre versões.
- Documentei guia de migração e checklist de retirada.
- Não removi a v1.
- Não implementei retirada automática.
- Não antecipei profiles ou configuração segura.
- Próxima aula: Profiles por ambiente e configuração segura.
```

---

## Referencia tecnica curta

```text
V1:
compatibilidade.

V2:
breaking change.

URI:
major publica.

SemVer:
release do contrato.

Deprecation:
aviso.

Sunset:
retirada planejada.

Link:
descoberta.

Mapper:
isolamento.

Client:
prova.

Retirement:
governanca.
```

Regra final:

```text
uma API deve criar nova major version quando uma breaking change publica for necessária, preservar integralmente a versao antiga durante a convivencia, separar controllers, DTOs, mappers e contratos por versao sem duplicar automaticamente application, domain ou persistence, comprovar compatibilidade com clientes antigos nao regenerados, sinalizar deprecacao usando o header Deprecation no formato Structured Field Date, anunciar retirada com Sunset em HTTP-date e links de documentacao e successor-version, e somente retirar a versao depois de evidencias de migracao, comunicacao, suporte e aprovacao governada.
```
