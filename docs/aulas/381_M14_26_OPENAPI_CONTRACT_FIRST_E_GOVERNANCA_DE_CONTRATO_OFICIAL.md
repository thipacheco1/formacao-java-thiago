# 381 - M14.26 - OpenAPI contract first e governanca de contrato

## Apresentacao da aula

Na aula 380, você documentou a API existente com uma abordagem code-first.

O fluxo ficou:

```text
controllers e DTOs;

Bean Validation;

annotations OpenAPI;

springdoc;

OpenAPI 3.1 gerada;

Swagger UI;

testes do documento.
```

A API ganhou:

- metadata;
- tags;
- operation ids;
- parâmetros;
- request bodies;
- schemas;
- exemplos;
- responses;
- headers;
- Problem Details;
- documentação de paginação;
- documentação de filtros;
- documentação de PUT e PATCH;
- exposição controlada por profile.

A documentação gerada foi comparada com o comportamento real.

Esse resultado é valioso.

Porém, no fluxo code-first, o contrato ainda é consequência do código.

Exemplo:

```text
um desenvolvedor altera um DTO;

o springdoc gera outro schema;

a descrição muda;

o consumidor descobre depois.
```

Mesmo com testes, a mudança pode nascer na implementação antes de ser discutida como contrato.

Em uma organização com vários consumidores, a pergunta precisa ser invertida.

Em vez de:

```text
o que o código passou a expor?
```

a equipe deve perguntar:

```text
qual contrato foi aprovado
e como o código comprova
que o implementa?
```

A pergunta central desta aula será:

```text
como transformar o contrato OpenAPI
em uma fonte versionada,
revisavel e protegida
contra mudancas incompatíveis?
```

A solução adotará:

```text
contract first;

contrato modular versionado;

lint;

bundle;

validation;

code generation;

runtime conformance;

diff de compatibilidade;

CI gate;

ownership.
```

O contrato canônico ficará em:

```text
contracts/openapi/managed-runtime-messages-v1/openapi.yaml
```

Ele será a fonte da verdade da superfície HTTP da feature.

A descrição gerada pelo springdoc continuará existindo.

Porém, seu papel mudará.

```text
contrato canônico:
promessa aprovada.

springdoc runtime:
visao produzida pela implementacao.

teste de conformidade:
compara promessa e implementacao.
```

A aula não removerá Swagger UI.

Ela passará a apontar preferencialmente para o contrato canônico bundled no profile de governança.

A baseline técnica utilizará:

```text
OpenAPI:
3.1.0.

Redocly CLI:
2.38.0.

OpenAPI Generator:
7.23.0.

openapi-diff:
2.1.7.

Node:
20.20.0 ou linha suportada.

Java:
21.

Spring Boot:
4.1.0.
```

As ferramentas serão fixadas.

Não use:

```text
latest
```

em scripts versionados.

Reprodutibilidade exige versões conhecidas.

O contrato será modular.

Estrutura:

```text
contracts/openapi/managed-runtime-messages-v1
├── openapi.yaml
├── paths
│   ├── collection.yaml
│   └── item.yaml
├── components
│   ├── headers.yaml
│   ├── parameters.yaml
│   ├── responses.yaml
│   └── schemas
│       ├── messages.yaml
│       ├── pagination.yaml
│       ├── patches.yaml
│       └── problems.yaml
└── examples
    ├── requests.yaml
    ├── responses.yaml
    └── problems.yaml
```

O arquivo raiz usará:

```text
$ref.
```

O bundle determinístico será gerado em:

```text
target/generated-openapi/
managed-runtime-messages-v1-bundled.yaml
```

O bundle é derivado.

Ele não será editado.

Ele não substituirá os arquivos fonte.

A última versão liberada ficará em:

```text
contracts/openapi/baseline/
managed-runtime-messages-v1-released.yaml
```

O candidate será o bundle atual.

O diff comparará:

```text
released;

candidate.
```

Uma mudança incompatível fará o build falhar.

Uma mudança compatível produzirá relatório.

A aprovação humana continuará necessária.

Ferramentas de diff não conhecem toda a semântica de negócio.

A aula também utilizará code generation.

A baseline gerará:

```text
um cliente Java de contrato.
```

O cliente será produzido em:

```text
target/generated-openapi-client.
```

Configuração:

```text
generator:
java.

library:
restclient.

Spring Boot:
4.

Jackson:
3.
```

O objetivo não é substituir toda a aplicação nesta aula.

O objetivo é provar que:

- o contrato é válido;
- operation ids são utilizáveis;
- schemas são geráveis;
- nomes são consistentes;
- um consumidor Java consegue ser produzido;
- o artefato gerado compila;
- ninguém precisa editar código gerado.

A geração de server stubs será estudada e testada em uma fixture.

Ela não substituirá os controllers existentes automaticamente.

A razão é importante.

A feature possui:

- dois media types de PATCH;
- Problem Details com extensões;
- headers condicionais;
- paginação própria;
- decisões arquiteturais já consolidadas.

Migrar para interfaces geradas precisa ser deliberado.

Contract first não significa:

```text
aceitar cegamente
todo código produzido pela ferramenta.
```

Significa:

```text
o contrato aprovado dirige
a implementação e os testes.
```

A governança terá quatro gates.

Primeiro:

```text
lint.
```

Segundo:

```text
validation e bundle.
```

Terceiro:

```text
compatibilidade com baseline.
```

Quarto:

```text
conformidade do runtime.
```

A próxima aula será:

```text
382 - M14.27 - Versionamento de APIs compatibilidade e depreciacao
```

Portanto, esta aula não definirá ainda:

- estratégia pública de v2;
- URL `/v2`;
- media type versionado;
- version header;
- Sunset;
- Deprecation;
- período de suporte;
- matriz de versões;
- calendário de retirada;
- política de migração pública.

O contrato atual continuará:

```text
v1.
```

A aula 382 aprofundará compatibilidade e depreciação.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
377:
PUT vs PATCH.

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
```

A aula 380 respondeu:

```text
como gerar documentacao OpenAPI
a partir da aplicacao?
```

A aula 381 responderá:

```text
como tornar o contrato
uma fonte governada
e impedir alteracoes incompatíveis?
```

Nesta aula:

```text
contract first:
sim.

contrato versionado:
sim.

modularizacao:
sim.

$ref:
sim.

lint:
sim.

bundle:
sim.

validation:
sim.

code generation:
sim.

cliente Java:
sim.

diff:
sim.

breaking change gate:
sim.

runtime conformance:
sim.

ownership:
sim.

CI:
sim.

server stub:
fixture.

v2 publica:
nao.

depreciacao:
nao.

Security:
nao.
```

A regra central será:

```text
uma API muda primeiro
como contrato revisado;

a implementacao muda depois
e precisa provar conformidade.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura principal:

```text
contracts
└── openapi
    ├── managed-runtime-messages-v1
    │   ├── openapi.yaml
    │   ├── paths
    │   │   ├── collection.yaml
    │   │   └── item.yaml
    │   ├── components
    │   │   ├── headers.yaml
    │   │   ├── parameters.yaml
    │   │   ├── responses.yaml
    │   │   └── schemas
    │   │       ├── messages.yaml
    │   │       ├── pagination.yaml
    │   │       ├── patches.yaml
    │   │       └── problems.yaml
    │   └── examples
    │       ├── requests.yaml
    │       ├── responses.yaml
    │       └── problems.yaml
    ├── baseline
    │   └── managed-runtime-messages-v1-released.yaml
    ├── redocly.yaml
    ├── package.json
    └── package-lock.json
```

Configuração Maven:

```text
pom.xml
```

Perfis:

```text
contract-governance;

contract-diff-strict.
```

Testes:

```text
src/test/java/br/com/formacao/backend/contract
├── CanonicalOpenApiContractParseTest.java
├── CanonicalOpenApiOperationIdTest.java
├── CanonicalOpenApiReferenceTest.java
├── CanonicalOpenApiExamplesTest.java
├── CanonicalOpenApiSecurityTest.java
├── RuntimeOpenApiConformanceTest.java
├── RuntimeResponseConformanceTest.java
├── GeneratedClientCompilationTest.java
├── GeneratedCodeIsolationTest.java
├── OpenApiCompatibleChangeFixtureTest.java
├── OpenApiBreakingChangeFixtureTest.java
├── OpenApiGovernanceArchitectureTest.java
└── OpenApiGovernanceLiveServerIT.java
```

Relatórios:

```text
target/openapi-governance
├── lint.txt
├── contract-bundled.yaml
├── diff.md
├── diff.json
└── runtime-conformance.json
```

Documentação:

```text
docs
├── openapi-contract-first.md
├── openapi-source-of-truth.md
├── openapi-modular-contract.md
├── openapi-lint-rules.md
├── openapi-bundle-policy.md
├── openapi-code-generation.md
├── generated-code-policy.md
├── openapi-breaking-changes.md
├── openapi-runtime-conformance.md
├── openapi-review-ownership.md
├── openapi-ci-gates.md
└── openapi-governance-baseline.md
```

Scripts:

```text
scripts
├── 141_instalar_ferramentas_openapi.ps1
├── 142_validar_contrato_openapi.ps1
├── 143_gerar_bundle_openapi.ps1
├── 144_gerar_cliente_openapi.ps1
├── 145_comparar_contrato_openapi.ps1
├── 146_validar_conformidade_runtime.ps1
└── 147_executar_governanca_openapi.ps1
```

Resultados esperados:

```text
contrato canônico:
versionado.

lint:
zero errors.

bundle:
deterministico.

refs:
resolvidas.

OpenAPI Generator validate:
sucesso.

cliente Java:
gerado e compilado.

codigo gerado no source:
zero.

breaking fixture:
build falha.

compatible fixture:
relatorio compatível.

runtime:
conforme o contrato.

springdoc:
nao e mais a fonte.

v2:
zero.

deprecation:
zero.
```

---

## Conceito essencial

### Contract first

Contract first significa desenhar e aprovar a interface antes de implementá-la.

Fluxo:

```text
necessidade;

contrato;

review;

lint;

compatibilidade;

implementacao;

testes;

publicacao.
```

O contrato é um artefato de engenharia.

Ele não é apenas documentação final.

---

### Code first versus contract first

Code first:

```text
implementacao gera descricao.
```

Contract first:

```text
descricao aprovada dirige implementacao.
```

Nenhuma abordagem elimina testes.

Contract first exige ainda mais testes de conformidade.

---

### Fonte da verdade

A fonte da verdade será:

```text
contracts/openapi/
managed-runtime-messages-v1/openapi.yaml
```

Os arquivos referenciados fazem parte da mesma fonte.

Não são fontes:

- Swagger UI;
- arquivo exportado em `target`;
- JSON do springdoc;
- cliente gerado;
- screenshot;
- Postman collection;
- README.

Esses elementos derivam do contrato.

---

### Documento modular

Um contrato grande em um único YAML torna review difícil.

A modularização separa:

- paths;
- schemas;
- parameters;
- responses;
- examples.

O arquivo raiz mantém a visão global.

---

### $ref

Exemplo:

```yaml
paths:
  /api/v1/runtime/managed-messages:
    $ref: "./paths/collection.yaml"
```

Schema:

```yaml
schema:
  $ref: "../components/schemas/messages.yaml#/CreateManagedRuntimeMessageRequest"
```

Refs precisam ser:

- relativos;
- resolvíveis;
- case-sensitive;
- estáveis;
- sem ciclo inválido.

---

### Bundle

Bundle resolve a árvore modular em um documento distribuível.

Comando:

```text
redocly bundle.
```

O resultado pode ser usado por:

- generator;
- diff;
- publicação;
- ferramentas externas;
- testes.

O bundle é gerado.

Não edite.

---

### Lint

Lint aplica regras estruturais e de estilo.

A baseline usará:

```text
recommended-strict.
```

Regras adicionais:

```text
operation-operationId:
error.

operation-4xx-response:
error.

no-ambiguous-paths:
error.

no-unused-components:
error.

security-defined:
off.
```

Security fica off porque a API ainda não possui Security.

Não invente um scheme para satisfazer o linter.

---

### Validacao versus lint

Validation verifica conformidade com a especificação.

Lint verifica também convenções e qualidade.

Um documento pode ser tecnicamente válido e ainda ter:

- operationId ausente;
- examples inválidos;
- components não utilizados;
- descrições ruins;
- paths ambíguos.

Use os dois.

---

### Redocly CLI local

Package:

```json
{
  "devDependencies": {
    "@redocly/cli": "2.38.0"
  }
}
```

Use:

```text
npm ci.
```

O lock file faz parte da reprodutibilidade.

Não instale globalmente como dependência do build oficial.

---

### Node version

A CLI atual exige uma linha Node suportada.

O ambiente do curso usa:

```text
Node 20.20.0.
```

Ele satisfaz a linha 20.19 ou superior.

Registre a versão em:

```text
.nvmrc;

ou documentação operacional.
```

Não altere a stack Java por causa da ferramenta de contrato.

---

### OpenAPI Generator

O OpenAPI Generator recebe um contrato e produz artefatos.

Ele pode gerar:

- clients;
- server stubs;
- models;
- docs;
- configuração.

A baseline fixa:

```text
7.23.0.
```

---

### Maven plugin

Property:

```xml
<openapi-generator.version>
    7.23.0
</openapi-generator.version>
```

Plugin:

```xml
<groupId>org.openapitools</groupId>
<artifactId>openapi-generator-maven-plugin</artifactId>
```

Goals:

```text
validate;

generate.
```

---

### Cliente gerado

Generator:

```text
java.
```

Library:

```text
restclient.
```

Configuração:

```text
useSpringBoot4:
true.

useJackson3:
true.

dateLibrary:
java8.

hideGenerationTimestamp:
true.

openApiNullable:
false.
```

O cliente gerado é prova de consumibilidade.

Ele não é código de domínio.

---

### Codigo gerado

Regra:

```text
nunca editar manualmente.
```

Diretório:

```text
target/generated-openapi-client.
```

Ele é apagável e reproduzível.

Se uma correção é necessária:

- corrija o contrato;
- ajuste configuração;
- use template governado;
- atualize a versão da ferramenta;
- gere novamente.

---

### Templates customizados

OpenAPI Generator permite templates Mustache customizados.

Eles criam uma superfície de manutenção.

A baseline não os usa.

Quando um template é necessário, ele precisa de:

- owner;
- versão;
- testes;
- changelog;
- comparação com upstream.

---

### Server stubs

Gerar interfaces Spring pode utilizar:

```text
generator:
spring.

interfaceOnly:
true.

useSpringBoot4:
true.

useJackson3:
true.

skipDefaultInterface:
true.
```

Essa possibilidade será praticada em `target`.

O controller de produção não será migrado nesta aula.

O motivo não é medo da ferramenta.

É evitar uma refatoração automática sem revisar:

- PATCH com múltiplos media types;
- DTOs existentes;
- Problem Details;
- headers;
- arquitetura.

---

### Lint gate

Gate um:

```text
redocly lint.
```

Se houver erro:

```text
pipeline falha.
```

Warnings também serão tratados como erro pelo ruleset strict.

Não gere ignore file automaticamente para esconder problemas.

---

### Bundle gate

Gate dois:

```text
redocly bundle.
```

O bundle precisa:

- resolver todos os refs;
- manter examples;
- não duplicar components;
- ser determinístico;
- ser parseável.

---

### Generator validation gate

Antes de gerar:

```text
openapi-generator:validate.
```

Não configure:

```text
skipValidateSpec=true.
```

O build precisa falhar em contrato inválido.

---

### Diff gate

A baseline liberada é comparada com o candidate.

Ferramenta:

```text
openapi-diff 2.1.7.
```

Configuração principal:

```text
failOnIncompatible:
true.

failOnChanged:
false.
```

Mudança compatível gera relatório.

Mudança incompatível falha.

---

### failOnChanged

`failOnChanged=true` falharia em qualquer alteração.

Isso pode ser útil em um profile de congelamento.

Na baseline diária:

```text
false.
```

Mudanças compatíveis ainda precisam de review.

No profile:

```text
contract-diff-strict
```

use `failOnChanged=true` para comprovar ausência total de drift quando necessário.

---

### Breaking change

Exemplos comuns:

- remover path;
- remover operation;
- tornar request property obrigatória;
- remover response;
- remover media type;
- restringir enum;
- reduzir maximum;
- mudar tipo;
- remover field de response;
- tornar parâmetro obrigatório;
- mudar status documentado;
- remover header esperado.

---

### Mudanca compativel

Exemplos normalmente compatíveis:

- adicionar operation;
- adicionar response property opcional;
- adicionar optional query parameter;
- adicionar novo 4xx documentado;
- ampliar enum de request com cuidado;
- corrigir description;
- adicionar example.

Mesmo mudanças classificadas como compatíveis podem afetar clients.

Enum de response ampliado pode quebrar consumidores antigos.

Governança não pode depender somente do resultado binário do diff.

---

### Review semantico

Checklist humano:

- a regra de negócio mudou;
- a idempotência mudou;
- null mudou;
- ordenação mudou;
- default mudou;
- limite mudou;
- segurança mudou;
- exemplo contradiz schema;
- status mudou;
- header deixou de ser obrigatório;
- performance do contrato mudou.

Ferramentas não compreendem tudo.

---

### Baseline liberada

O arquivo released representa o contrato em produção ou formalmente publicado.

Ele não deve ser atualizado no mesmo commit apenas para fazer o diff passar.

Fluxo correto:

1. candidate aprovado;
2. implementação liberada;
3. baseline promovida;
4. changelog registrado.

---

### Runtime conformance

O runtime precisa provar:

- paths;
- methods;
- status;
- media types;
- headers;
- bodies;
- schemas;
- examples principais.

O documento springdoc é comparado com o canonical.

Responses reais são validadas contra schemas do contract.

---

### Springdoc como observador

Springdoc continua útil.

Ele detecta o que a aplicação expõe.

Diferença conceitual:

```text
canonical:
deveria existir.

springdoc:
parece existir.

runtime test:
realmente existe.
```

Os três sinais são comparados.

---

### Drift

Drift ocorre quando:

```text
contrato e runtime divergem.
```

Exemplos:

- contrato declara 428 e runtime retorna 400;
- contrato declara `application/problem+json` e runtime retorna JSON comum;
- controller aceita `application/json` em PATCH;
- schema diz max 50 e validation aceita 100;
- header ETag não aparece;
- response possui field extra proibido.

O build deve detectar drift.

---

### Examples governados

Examples são parte do contrato.

Eles precisam:

- validar contra schema;
- usar valores fictícios;
- não conter secrets;
- ser coerentes com status;
- representar media type correto;
- permanecer pequenos.

Não use response capturada de produção.

---

### OperationId

Operation ids dirigem nomes de métodos gerados.

Alterar um operationId pode quebrar client source mesmo quando path não muda.

Trate como elemento estável.

O diff e os testes precisam observá-lo.

---

### Ownership

Crie:

```text
CODEOWNERS
```

ou política equivalente.

Owners do contrato:

- responsável da API;
- representante consumidor;
- arquitetura ou platform quando necessário.

Mudança de contrato não deve ser aprovada somente por quem implementa.

---

### Pull request template

Checklist:

- contrato alterado antes do código;
- lint passou;
- bundle passou;
- diff anexado;
- breaking change identificado;
- examples atualizados;
- runtime tests atualizados;
- consumers notificados quando necessário;
- baseline não foi mascarada.

---

### CI gate

Pipeline conceitual:

```text
checkout;

Java setup;

Node setup;

npm ci;

lint;

bundle;

generator validate;

generate client;

compile generated client;

openapi diff;

unit tests;

runtime conformance;

package;

publish reports.
```

A ordem evita gastar tempo em código quando o contrato já é inválido.

---

### Artefatos

Publique como artifacts de CI:

- bundled YAML;
- diff Markdown;
- diff JSON;
- lint output;
- generated client package;
- conformance report.

Não publique secrets ou URLs internas.

---

### Versao do contrato versus versao da API

O campo:

```yaml
info:
  version: "1.0.0"
```

versiona o documento ou release da API.

Ele não é a versão da OpenAPI Specification.

```yaml
openapi: 3.1.0
```

define a versão da especificação usada.

A aula 382 aprofundará a relação com versões públicas da API.

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

### 2. Criar a arvore de contrato

Crie os diretórios em:

```text
contracts/openapi.
```

Não coloque o canonical em `target`.

---

### 3. Exportar o documento atual

Inicie o profile `openapi-lab`.

Exporte:

```text
/v3/api-docs.yaml.
```

Salve temporariamente em `target`.

Use o resultado como inventário.

Não copie cegamente.

---

### 4. Criar openapi.yaml

Defina:

```yaml
openapi: 3.1.0
info:
  title: Formacao Java Backend API
  version: 1.0.0
```

Adicione server relativo e tag.

Paths usam `$ref`.

---

### 5. Separar paths

`collection.yaml` contém:

- GET collection;
- POST.

`item.yaml` contém:

- GET;
- PUT;
- PATCH;
- DELETE;
- OPTIONS.

Um Path Item possui somente um PATCH.

O request body desse PATCH declara os dois media types.

---

### 6. Separar components

Crie schemas, parameters, headers e responses reutilizáveis.

Evite references excessivamente profundas.

A leitura humana precisa continuar possível.

---

### 7. Criar examples externos

Mova examples grandes para arquivos próprios.

Use `$ref` em `examples`.

Valide contra schemas.

---

### 8. Criar package.json

```json
{
  "name": "formacao-java-openapi-governance",
  "private": true,
  "devDependencies": {
    "@redocly/cli": "2.38.0"
  },
  "scripts": {
    "lint": "redocly lint managed-runtime-messages-v1/openapi.yaml",
    "bundle": "redocly bundle managed-runtime-messages-v1/openapi.yaml --output ../../target/openapi-governance/contract-bundled.yaml"
  }
}
```

Ajuste paths ao diretório real.

Gere e versione `package-lock.json`.

---

### 9. Criar redocly.yaml

Use:

```yaml
extends:
  - recommended-strict

rules:
  security-defined: off
  operation-operationId: error
  operation-4xx-response: error
  no-ambiguous-paths: error
  no-unused-components: error
```

Não desative regras apenas para obter verde.

---

### 10. Instalar de forma reproduzivel

```powershell
npm `
  --prefix contracts/openapi `
  ci
```

Não use instalação global no script oficial.

---

### 11. Executar lint

```powershell
npm `
  --prefix contracts/openapi `
  run lint
```

Corrija todos os errors.

---

### 12. Executar bundle

```powershell
npm `
  --prefix contracts/openapi `
  run bundle
```

Confirme arquivo em `target`.

---

### 13. Validar o bundle

Use OpenAPI Generator validate.

Não gere antes de validar.

---

### 14. Adicionar properties Maven

```xml
<openapi-generator.version>
    7.23.0
</openapi-generator.version>

<openapi-diff.version>
    2.1.7
</openapi-diff.version>
```

---

### 15. Configurar Generator plugin

Input:

```text
target/openapi-governance/
contract-bundled.yaml.
```

Output:

```text
target/generated-openapi-client.
```

Generator:

```text
java.
```

Library:

```text
restclient.
```

---

### 16. Configurar cliente Boot 4

Options:

```text
useSpringBoot4=true;

useJackson3=true;

dateLibrary=java8;

hideGenerationTimestamp=true;

openApiNullable=false;

apiPackage:
br.com.formacao.contract.client.api;

modelPackage:
br.com.formacao.contract.client.model.
```

Desabilite testes gerados quando a baseline não os utiliza.

---

### 17. Gerar o cliente

```powershell
.\mvnw.cmd `
  -Pcontract-governance `
  openapi-generator:generate
```

Não mova arquivos para `src/main/java`.

---

### 18. Compilar cliente gerado

Execute o build do projeto gerado.

Confirme:

- Java 21;
- RestClient;
- Jackson 3;
- models;
- operation ids;
- media types;
- headers.

---

### 19. Inspecionar nomes

Confirme que operation ids geram métodos legíveis.

Exemplo:

```text
createManagedRuntimeMessage;

listManagedRuntimeMessages;

replaceManagedRuntimeMessage.
```

Corrija o contrato, não o arquivo gerado.

---

### 20. Gerar interface Spring em fixture

Use generator `spring`.

Options:

```text
interfaceOnly=true;

skipDefaultInterface=true;

useSpringBoot4=true;

useJackson3=true;

useTags=true;

documentationProvider=none.
```

Gere somente em `target`.

Analise a assinatura.

Não integre automaticamente.

---

### 21. Criar baseline released

Copie o primeiro bundle aprovado para:

```text
contracts/openapi/baseline/
managed-runtime-messages-v1-released.yaml.
```

Esse arquivo representa a release inicial.

---

### 22. Configurar openapi-diff

Compare:

```text
oldSpec:
baseline released.

newSpec:
bundle candidate.
```

Configuração diária:

```text
failOnIncompatible=true;

failOnChanged=false.
```

Gere Markdown e JSON.

---

### 23. Criar profile strict

No profile:

```text
contract-diff-strict
```

configure:

```text
failOnChanged=true.
```

Use quando nenhuma alteração de contrato é esperada.

---

### 24. Testar mudanca compativel

Fixture:

- adicionar optional response property;
- adicionar optional query parameter.

Confirme:

```text
compatible.
```

Remova a fixture depois.

---

### 25. Testar breaking change

Fixture:

- remover response property;
- tornar field obrigatório;
- remover 409;
- reduzir size maximum.

Confirme:

```text
build falha.
```

---

### 26. Criar parser test

Use uma biblioteca OpenAPI já disponível no classpath do tooling ou parser de teste.

Confirme:

- OpenAPI 3.1;
- refs resolvidas;
- paths;
- operations;
- components;
- examples.

---

### 27. Criar OperationIdTest

Colete todos os operation ids.

Valide:

- não nulos;
- únicos;
- padrão lowerCamelCase;
- lista esperada.

---

### 28. Criar ReferenceTest

Valide:

- nenhum ref quebrado;
- nenhum ref remoto;
- nenhum caminho absoluto;
- nenhum ref para `target`;
- nenhum ciclo inválido.

---

### 29. Criar ExamplesTest

Para cada example:

- resolver schema;
- validar JSON;
- confirmar ausência de secrets;
- confirmar status e media type.

---

### 30. Criar SecurityTest

Confirme ausência de:

- password;
- token;
- Authorization real;
- hostname interno;
- SQL;
- stack trace;
- email pessoal;
- dados de produção.

---

### 31. Criar RuntimeOpenApiConformanceTest

Carregue:

```text
canonical bundle;

springdoc runtime JSON.
```

Compare:

- paths;
- methods;
- operation ids;
- request media types;
- response status;
- response media types;
- required parameters.

Ignore somente metadata deliberadamente derivada.

---

### 32. Criar RuntimeResponseConformanceTest

Execute requests reais.

Valide bodies contra schemas canônicos.

Cenários:

- 201;
- 200 detail;
- 200 page;
- 400;
- 404;
- 409;
- 412;
- 422;
- 428.

---

### 33. Validar headers

Confirme no runtime e no canonical:

- Location;
- ETag;
- Last-Modified;
- Link;
- totals;
- correlation id;
- Accept-Patch;
- Allow.

---

### 34. Validar PATCH

Canonical possui uma operation PATCH com dois media types.

Runtime possui dois handlers especializados.

O teste comprova que ambos atendem a mesma operation contratual.

---

### 35. Criar GeneratedCodeIsolationTest

Valide:

- generated source somente em target;
- zero generated class em src;
- zero edição manual;
- target no gitignore;
- packages gerados não são domain.

---

### 36. Criar ArchitectureTest

Valide:

- contrato fora de target;
- baseline separada;
- springdoc não é fonte;
- Swagger annotations não substituem canonical;
- diff plugin configurado;
- generator version fixada;
- Redocly version fixada;
- zero latest;
- zero skipValidateSpec;
- zero Security inventada;
- zero v2.

---

### 37. Criar LiveServerIT

Use PostgreSQLContainer.

Fluxo:

1. iniciar runtime;
2. carregar canonical;
3. carregar springdoc;
4. executar operations principais;
5. validar schemas;
6. validar media types;
7. validar headers;
8. produzir relatório.

---

### 38. Criar script de instalacao

`141_instalar_ferramentas_openapi.ps1`:

- valida Node;
- valida npm;
- executa npm ci;
- imprime versões;
- não instala globalmente.

---

### 39. Criar script de validacao

`142_validar_contrato_openapi.ps1` executa:

- lint;
- generator validate;
- parser tests.

---

### 40. Criar script de bundle

`143_gerar_bundle_openapi.ps1` limpa output e gera bundle.

---

### 41. Criar script de cliente

`144_gerar_cliente_openapi.ps1`:

- valida;
- gera;
- compila;
- falha em warnings críticos.

---

### 42. Criar script de diff

`145_comparar_contrato_openapi.ps1`:

- compara baseline;
- gera Markdown;
- gera JSON;
- retorna código incompatível quando necessário.

---

### 43. Criar script de runtime

`146_validar_conformidade_runtime.ps1` executa testes de conformance.

---

### 44. Criar script completo

`147_executar_governanca_openapi.ps1` executa gates na ordem.

---

### 45. Criar documentacao

`openapi-contract-first.md` compara fluxos.

`openapi-source-of-truth.md` define canonical.

`openapi-modular-contract.md` documenta refs.

`openapi-lint-rules.md` registra cada regra.

`openapi-bundle-policy.md` diferencia fonte e derivado.

`openapi-code-generation.md` documenta generator.

`generated-code-policy.md` proíbe edição.

`openapi-breaking-changes.md` cria catálogo.

`openapi-runtime-conformance.md` define comparações.

`openapi-review-ownership.md` define owners.

`openapi-ci-gates.md` documenta pipeline.

`openapi-governance-baseline.md` consolida a decisão.

---

### 46. Executar lint e bundle

```powershell
npm `
  --prefix contracts/openapi `
  ci

npm `
  --prefix contracts/openapi `
  run lint

npm `
  --prefix contracts/openapi `
  run bundle
```

---

### 47. Executar generator

```powershell
.\mvnw.cmd `
  -Pcontract-governance `
  generate-sources
```

---

### 48. Executar diff

```powershell
.\mvnw.cmd `
  -Pcontract-governance `
  openapi-diff:diff
```

---

### 49. Executar contract tests

```powershell
.\mvnw.cmd `
  -Dtest=CanonicalOpenApiContractParseTest,CanonicalOpenApiOperationIdTest,CanonicalOpenApiReferenceTest,CanonicalOpenApiExamplesTest test
```

---

### 50. Executar conformance

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeOpenApiConformanceTest,RuntimeResponseConformanceTest test
```

---

### 51. Executar architecture

```powershell
.\mvnw.cmd `
  -Dtest=GeneratedClientCompilationTest,GeneratedCodeIsolationTest,OpenApiGovernanceArchitectureTest test
```

---

### 52. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiGovernanceLiveServerIT test
```

Docker precisa estar ativo.

---

### 53. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 54. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 55. Revisar escopo

Confirme:

```text
canonical:
versionado.

springdoc:
derivado.

lint:
presente.

bundle:
presente.

generator:
presente.

diff:
presente.

runtime conformance:
presente.

v2:
zero.

deprecation:
zero.
```

---

### 56. Revisar Git

```powershell
git status
git diff
git diff --check
```

Inclua:

- fonte modular;
- baseline released;
- redocly config;
- package files;
- pom;
- testes;
- docs;
- scripts.

Não inclua:

- node_modules;
- target;
- cliente gerado;
- bundle gerado;
- diff gerado;
- token;
- URL interna;
- response de produção.

---

## Entendendo o que foi feito

### O contrato virou entrada

A implementação deixou de ser a única origem da descrição.

### O springdoc ganhou um novo papel

Ele mostra a visão do runtime e ajuda a detectar drift.

### A governanca ganhou gates independentes

Lint, bundle, diff, geração e conformance detectam categorias diferentes de problema.

### Codigo gerado ficou descartavel

O contrato e a configuração são permanentes; `target` pode ser recriado.

### Breaking changes passaram a falhar

O build protege consumidores antes da release.

---

## Erros comuns importantes

### Atualizar baseline junto com candidate

O diff fica verde sem proteger ninguém.

### Versionar codigo gerado

O repository acumula ruído e divergência.

### Usar latest

O mesmo commit pode gerar resultados diferentes.

### Considerar diff automatico suficiente

Mudanças semânticas podem parecer compatíveis.

### Tratar springdoc como canonical

A implementação volta a comandar o contrato.

---

## Comandos uteis

### Instalar ferramentas

```powershell
.\scripts\141_instalar_ferramentas_openapi.ps1
```

### Validar contrato

```powershell
.\scripts\142_validar_contrato_openapi.ps1
```

### Gerar bundle

```powershell
.\scripts\143_gerar_bundle_openapi.ps1
```

### Comparar baseline

```powershell
.\scripts\145_comparar_contrato_openapi.ps1
```

### Executar governanca

```powershell
.\scripts\147_executar_governanca_openapi.ps1
```

---

## Exercicio guiado

### Parte 1 — Remover operation

Remova GET item em uma cópia candidate.

Confirme diff incompatível.

### Parte 2 — Adicionar field opcional

Adicione uma property opcional em response fixture.

Confirme relatório compatível.

### Parte 3 — Tornar field obrigatorio

Altere a mesma property para required.

Confirme quebra.

### Parte 4 — OperationId

Renomeie um operationId sem alterar path.

Observe impacto no cliente gerado.

Restaure.

### Parte 5 — Exemplo invalido

Altere example para violar schema.

Confirme lint ou test falhando.

### Parte 6 — Drift runtime

Altere temporariamente um status no controller sem mudar canonical.

Confirme conformance failure.

### Parte 7 — Server interface

Gere a interface Spring em target.

Compare assinaturas com controllers existentes.

Não migre automaticamente.

### Parte 8 — ADR

Registre:

```text
canonical modular versionado;

springdoc como observador;

Redocly 2.38.0;

Generator 7.23.0;

openapi-diff 2.1.7;

generated code em target;

breaking gate obrigatorio;

review semantico obrigatorio;

baseline promovida somente apos release;

versionamento publico na aula 382.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 380 foi preservada;
- o mesmo projeto foi continuado;
- contract first foi definido;
- code first foi comparado;
- o contrato passou a ser fonte da verdade;
- springdoc deixou de ser fonte canônica;
- Swagger UI permaneceu como renderer;
- contrato modular foi criado;
- root OpenAPI foi criado;
- paths foram separados;
- schemas foram separados;
- parameters foram separados;
- headers foram separados;
- responses foram separados;
- examples foram separados;
- `$ref` relativos foram usados;
- refs remotos não foram usados;
- refs para target não foram usados;
- refs quebrados foram testados;
- bundle foi criado;
- bundle ficou em target;
- bundle não foi editado;
- canonical ficou fora de target;
- baseline released foi criada;
- candidate foi diferenciado da baseline;
- baseline não é atualizada para mascarar diff;
- OpenAPI 3.1.0 foi preservada;
- `info.version` foi diferenciado de `openapi`;
- Redocly CLI 2.38.0 foi fixada;
- package-lock foi versionado;
- npm ci foi usado;
- instalação global não foi exigida;
- Node suportado foi validado;
- `recommended-strict` foi usado;
- operationId foi exigido;
- 4xx response foi exigido;
- ambiguous paths foram rejeitados;
- unused components foram rejeitados;
- Security rule foi desligada com justificativa;
- Security inexistente não foi inventada;
- lint falha em errors;
- warnings strict foram tratados;
- ignore file automático não foi usado;
- bundle gate foi criado;
- Generator 7.23.0 foi fixado;
- Maven plugin foi configurado;
- validate foi executado;
- `skipValidateSpec` não foi usado;
- cliente Java foi gerado;
- library RestClient foi usada;
- Spring Boot 4 foi configurado;
- Jackson 3 foi configurado;
- Java time foi usado;
- timestamps de geração foram ocultados;
- packages gerados foram explícitos;
- cliente foi gerado em target;
- cliente gerado compilou;
- código gerado não foi versionado;
- código gerado não foi editado;
- templates customizados não foram criados sem necessidade;
- server interface foi gerada somente em fixture;
- `interfaceOnly` foi estudado;
- `skipDefaultInterface` foi estudado;
- migração automática dos controllers não foi feita;
- PATCH com dois media types foi preservado no contrato;
- uma única operation PATCH foi usada;
- OpenAPI-diff 2.1.7 foi fixado;
- `failOnIncompatible=true` foi usado;
- `failOnChanged=false` foi usado no fluxo normal;
- profile strict foi criado;
- relatórios Markdown e JSON foram gerados;
- remoção de path foi reconhecida como breaking;
- required novo foi reconhecido como breaking;
- remoção de response foi reconhecida como breaking;
- mudança de type foi reconhecida como breaking;
- limite mais restritivo foi reconhecido como breaking;
- adição opcional foi tratada como compatível;
- novo optional parameter foi tratado como compatível;
- enum de response foi reconhecido como risco semântico;
- review humano permaneceu obrigatório;
- catálogo de breaking changes foi criado;
- operationId foi tratado como contrato;
- examples foram governados;
- examples validam contra schemas;
- secrets não aparecem em examples;
- owners foram definidos;
- checklist de pull request foi criado;
- CI gates foram documentados;
- lint executa antes da compilação pesada;
- bundle executa antes do generator;
- diff executa antes da release;
- runtime conformance foi criado;
- canonical foi comparado ao springdoc;
- canonical foi comparado a responses reais;
- paths foram comparados;
- methods foram comparados;
- status foram comparados;
- media types foram comparados;
- required parameters foram comparados;
- schemas foram usados para validar bodies;
- headers foram validados;
- Problem Details foram validados;
- PATCH Merge e JSON foram validados;
- drift de status foi detectado;
- drift de media type foi detectado;
- drift de schema foi detectado;
- generated code isolation foi testado;
- `CanonicalOpenApiContractParseTest` foi criado;
- `CanonicalOpenApiOperationIdTest` foi criado;
- `CanonicalOpenApiReferenceTest` foi criado;
- `CanonicalOpenApiExamplesTest` foi criado;
- `CanonicalOpenApiSecurityTest` foi criado;
- `RuntimeOpenApiConformanceTest` foi criado;
- `RuntimeResponseConformanceTest` foi criado;
- `GeneratedClientCompilationTest` foi criado;
- `GeneratedCodeIsolationTest` foi criado;
- compatible fixture foi criada;
- breaking fixture foi criada;
- `OpenApiGovernanceArchitectureTest` foi criado;
- `OpenApiGovernanceLiveServerIT` foi criado;
- PostgreSQL real foi preservado;
- relatórios de CI foram definidos;
- scripts 141 a 147 foram criados;
- documentação completa foi criada;
- lint, bundle, validation, generation, diff, conformance, suite e package passaram;
- nenhum versionamento público, v2, Sunset, Deprecation, Security, cache ou profile seguro foi antecipado;
- ponte para a aula 382 está correta;
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
git commit -m "docs(m14): governar contrato openapi contract first"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- node_modules;
- target;
- bundle;
- cliente gerado;
- diff gerado;
- token;
- URL interna;
- v2 antecipada.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a descrição OpenAPI deixou de ser apenas um resultado do runtime.

O fluxo consolidado ficou:

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

Você comprovou:

```text
source of truth versionada;

refs modulares;

tools fixadas;

cliente geravel;

codigo gerado isolado;

breaking changes bloqueadas;

mudancas compativeis relatadas;

springdoc comparado;

responses reais validadas;

owners e CI gates.
```

A decisão central foi:

```text
contract first nao significa
gerar codigo e confiar cegamente;

significa governar uma promessa publica
e exigir que tooling,
implementacao e runtime
provem conformidade.
```

A próxima aula será:

```text
382 - M14.27 - Versionamento de APIs compatibilidade e depreciacao
```

Nela, você continuará no mesmo projeto e estudará:

- compatibilidade backward;
- compatibilidade forward;
- breaking changes;
- semantic versioning de contrato;
- versionamento por URI;
- versionamento por header;
- media type versioning;
- trade-offs;
- v1 e v2;
- additive changes;
- migrations;
- deprecation;
- header Deprecation;
- header Sunset;
- Link successor-version;
- documentação;
- período de convivência;
- métricas de uso;
- comunicação;
- retirada segura;
- testes de compatibilidade;
- governança de múltiplas versões.

A aula 381 respondeu:

```text
como governar o contrato
antes da implementacao?
```

A aula 382 responderá:

```text
como evoluir esse contrato
sem quebrar consumidores
e como retirar versoes antigas
de forma previsivel?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar canonical, springdoc, bundle e código gerado.
- [ ] Sei aplicar lint, validation, diff e runtime conformance.
- [ ] Sei manter baseline released separada do candidate.
- [ ] Sei reconhecer breaking changes automáticas e semânticas.
- [ ] Sei manter código gerado reproduzível, isolado e descartável.

---

## Troubleshooting adicional

### Redocly nao encontra refs

Revise paths relativos e case do filesystem.

### Bundle muda sem alterar contrato

Confirme versão fixada, lock file e ordering.

### Generator compila com imports errados

Confirme `useSpringBoot4` e `useJackson3`.

### Diff sempre mostra tudo alterado

Compare bundles determinísticos e baseline correta.

### Runtime diverge apenas em metadata

Separe metadata derivada de contrato comportamental.

### Build passa apos breaking change

Confirme `failOnIncompatible` e execução do profile.

---

## Perguntas de revisao

1. O que contract first significa?
2. Qual é a fonte da verdade?
3. Springdoc continua útil?
4. O que o bundle representa?
5. Bundle deve ser editado?
6. Para que serve lint?
7. Validation e lint são iguais?
8. Qual versão do Redocly?
9. Qual versão do Generator?
10. Qual versão do openapi-diff?
11. Onde fica código gerado?
12. Ele deve ser versionado?
13. O que é baseline released?
14. Quando ela é promovida?
15. O que `failOnIncompatible` faz?
16. Mudança compatível dispensa review?
17. Como detectar drift?
18. OperationId é contrato?
19. V2 foi criada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Contrato antes da implementação.
2. O OpenAPI canonical versionado.
3. Sim, como visão do runtime.
4. Documento resolvido e distribuível.
5. Não.
6. Aplicar regras e qualidade.
7. Não.
8. 2.38.0.
9. 7.23.0.
10. 2.1.7.
11. Em target.
12. Não.
13. Último contrato liberado.
14. Após release aprovada.
15. Falha em quebra backward.
16. Não.
17. Comparando canonical, springdoc e responses.
18. Sim.
19. Não.
20. Versionamento de APIs, compatibilidade e depreciação.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 381 - M14.26 - OpenAPI contract first e governanca de contrato

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei code-first de contract-first.
- Transformei o OpenAPI canonical em fonte da verdade.
- Mantive springdoc como visão derivada do runtime.
- Modularizei paths, schemas, parameters, headers, responses e examples.
- Usei referências relativas com `$ref`.
- Criei bundle determinístico em `target`.
- Fixei Redocly CLI 2.38.0.
- Usei `npm ci` e package-lock.
- Adotei lint `recommended-strict`.
- Exigi operation ids, 4xx responses e components utilizados.
- Não inventei Security.
- Fixei OpenAPI Generator 7.23.0.
- Validei o contrato antes da geração.
- Gerei um cliente Java com RestClient.
- Configurei Spring Boot 4 e Jackson 3 no código gerado.
- Mantive código gerado somente em `target`.
- Não editei ou versione código gerado.
- Estudei geração de interfaces Spring em fixture.
- Fixei openapi-diff 2.1.7.
- Criei baseline released separada do candidate.
- Falhei o build em mudanças incompatíveis.
- Gerei relatórios para mudanças compatíveis.
- Mantive review semântico obrigatório.
- Tratei operationId como contrato.
- Governei examples e dados sensíveis.
- Comparei canonical com springdoc.
- Validei responses reais contra schemas.
- Detectei drift de status, media type, headers e body.
- Defini ownership e checklist de pull request.
- Organizei gates de CI.
- Não criei v2 ou depreciação.
- Próxima aula: Versionamento de APIs, compatibilidade e depreciação.
```

---

## Referencia tecnica curta

```text
Canonical:
promessa.

Springdoc:
observacao.

Bundle:
distribuicao.

Lint:
qualidade.

Validate:
conformidade.

Generator:
artefato.

Diff:
compatibilidade.

Baseline:
release.

Conformance:
runtime.

Governance:
decisao.
```

Regra final:

```text
uma estrategia contract first deve manter um OpenAPI canonical modular e versionado como fonte da verdade, gerar bundles determinísticos, fixar e validar ferramentas, produzir codigo somente em diretorios derivados, comparar cada candidate com a baseline realmente liberada, falhar em breaking changes, exigir review semantico mesmo para mudancas classificadas como compativeis e comprovar a conformidade do runtime por meio da comparação entre canonical, springdoc, headers, status, media types e responses reais, sem promover baseline antecipadamente ou confundir geração de código com governança.
```
