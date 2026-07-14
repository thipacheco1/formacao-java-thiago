# 616 - M19.06 - Modularizacao em Java

## Apresentação da aula

Na aula 615, você construiu um monólito modular.

A aplicação continuou sendo uma única unidade de deploy, mas passou a possuir:

```text
módulos de negócio;

APIs públicas mínimas;

packages internos;

dependências explícitas;

eventos entre módulos;

data ownership;

testes de arquitetura;

proibição de ciclos.
```

Essa organização já reduz muito o acoplamento.

Entretanto, na aula anterior, grande parte das fronteiras ainda era protegida por:

- convenções de packages;
- visibilidade Java;
- testes com ArchUnit;
- regras de equipe;
- documentação;
- validações do Spring Modulith.

Essas proteções são valiosas, mas existe uma pergunta adicional:

```text
como o próprio Java
pode reforçar
quais packages
um módulo oferece,

quais dependências
ele exige

e quais detalhes
devem permanecer
encapsulados?
```

É aqui que entra a modularização em Java.

Desde o Java 9, a plataforma possui o:

```text
Java Platform Module System
```

Também chamado de:

```text
JPMS.
```

Com JPMS, um módulo pode declarar:

- seu nome;
- módulos dos quais depende;
- packages que exporta;
- packages que abre para reflexão;
- serviços que oferece;
- serviços que consome.

O arquivo central é:

```text
module-info.java
```

Exemplo simples:

```java
module br.com.formacao.orders.api {

    exports br.com.formacao.orders.api;
}
```

Outro módulo pode declarar:

```java
module br.com.formacao.orders.application {

    requires br.com.formacao.orders.api;
}
```

Isso permite que o compilador e o runtime validem parte das fronteiras.

A pergunta central desta aula será:

```text
quando e como usar
módulos Java

para reforçar
encapsulamento,
dependências
e APIs públicas

sem transformar
o build
em complexidade desnecessária?
```

O laboratório será:

```text
labs/m19/aula-616-modularizacao-em-java/java-modular-commerce
```

Você irá transformar uma parte do monólito modular em um projeto Maven multi-module com módulos Java explícitos.

O laboratório terá:

```text
commerce-shared;

commerce-inventory-api;

commerce-inventory-application;

commerce-orders-api;

commerce-orders-application;

commerce-bootstrap.
```

Cada módulo Maven produzirá um artifact próprio.

Cada artifact principal terá seu `module-info.java`.

A aplicação final continuará sendo executada como uma única aplicação.

O objetivo não é criar microservices.

O objetivo é reforçar fronteiras.

Você irá praticar:

- projeto Maven multi-module;
- module path;
- `module-info.java`;
- `requires`;
- `requires transitive`;
- `requires static`;
- `exports`;
- `exports ... to`;
- `opens`;
- `opens ... to`;
- encapsulamento forte;
- reflexão;
- testes;
- service loader de forma controlada;
- ciclos proibidos;
- split packages proibidos;
- automatic modules;
- unnamed module;
- composição do bootstrap;
- trade-offs com Spring Boot.

A próxima aula oficial será:

```text
617 - M19.07 - DDD fundamentos
```

Por isso, esta aula não irá ensinar formalmente:

- ubiquitous language;
- domain model estratégico;
- bounded context;
- aggregate;
- entity em DDD;
- value object em DDD;
- domain service;
- repository em DDD;
- domain event em DDD;
- contexto delimitado;
- subdomain.

Esses conteúdos começam na aula 617.

A aula também não transformará todos os módulos em projetos independentes sem necessidade.

Você aprenderá que JPMS não é obrigatório em toda aplicação backend.

Ele é uma ferramenta.

A decisão depende de:

- tamanho;
- maturidade;
- build;
- framework;
- biblioteca;
- necessidade de encapsulamento;
- custo operacional;
- benefício real.

A regra central será:

```text
modularização útil
torna dependências
e APIs mais explícitas;

modularização ruim
apenas multiplica
arquivos,
builds
e dificuldades.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
614:
Ports and Adapters.

615:
Monolito modular.

616:
Modularizacao em Java.

617:
DDD fundamentos.

618:
DDD estrategico.
```

A progressão é:

```text
formalizar integração;

organizar módulos de negócio;

reforçar módulos com mecanismos Java;

aprender modelagem de domínio;

aprofundar estratégia de domínio.
```

Nesta aula:

```text
Maven multi-module:
sim.

JPMS:
sim.

module-info.java:
sim.

requires:
sim.

exports:
sim.

opens:
sim.

module path:
sim.

service loader:
sim,
de forma limitada.

Spring Boot:
sim,
composição controlada.

microservices:
não.

DDD fundamentos:
não.

DDD estratégico:
não.
```

O laboratório será novo.

Ele reutilizará os conceitos do monólito modular, mas reduzirá o escopo para que o foco permaneça em mecanismos de modularização.

---

## Objetivo prático

A estrutura será:

```text
labs/m19/aula-616-modularizacao-em-java/java-modular-commerce
├── pom.xml
├── README.md
├── commerce-shared
│   ├── pom.xml
│   └── src
│       ├── main
│       │   └── java
│       │       ├── module-info.java
│       │       └── br/com/formacao/commerce/shared
│       │           ├── ModuleClock.java
│       │           └── ModuleIdGenerator.java
│       └── test
├── commerce-inventory-api
│   ├── pom.xml
│   └── src
│       └── main
│           └── java
│               ├── module-info.java
│               └── br/com/formacao/commerce/inventory/api
│                   ├── InventoryModuleApi.java
│                   ├── InventoryReservationRequest.java
│                   └── InventoryReservationResult.java
├── commerce-inventory-application
│   ├── pom.xml
│   └── src
│       ├── main
│       │   └── java
│       │       ├── module-info.java
│       │       └── br/com/formacao/commerce/inventory/internal
│       │           ├── DefaultInventoryModuleApi.java
│       │           ├── InventoryItem.java
│       │           ├── InventoryReservation.java
│       │           ├── InventoryRepository.java
│       │           └── InMemoryInventoryRepository.java
│       └── test
│           └── java
│               └── br/com/formacao/commerce/inventory/internal
│                   └── DefaultInventoryModuleApiTest.java
├── commerce-orders-api
│   ├── pom.xml
│   └── src
│       └── main
│           └── java
│               ├── module-info.java
│               └── br/com/formacao/commerce/orders/api
│                   ├── OrderModuleApi.java
│                   ├── CreateOrderRequest.java
│                   └── OrderSummary.java
├── commerce-orders-application
│   ├── pom.xml
│   └── src
│       ├── main
│       │   └── java
│       │       ├── module-info.java
│       │       └── br/com/formacao/commerce/orders/internal
│       │           ├── DefaultOrderModuleApi.java
│       │           ├── Order.java
│       │           ├── OrderItem.java
│       │           ├── OrderStatus.java
│       │           ├── OrderRepository.java
│       │           └── InMemoryOrderRepository.java
│       └── test
│           └── java
│               └── br/com/formacao/commerce/orders/internal
│                   └── DefaultOrderModuleApiTest.java
├── commerce-bootstrap
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   ├── module-info.java
│       │   │   └── br/com/formacao/commerce/bootstrap
│       │   │       ├── ModularCommerceApplication.java
│       │   │       ├── CommerceConfiguration.java
│       │   │       └── web
│       │   │           ├── OrderController.java
│       │   │           └── ApiExceptionHandler.java
│       │   └── resources
│       │       └── application.yml
│       └── test
│           └── java
│               └── br/com/formacao/commerce/bootstrap
│                   ├── ModularCommerceContextTest.java
│                   └── ModularCommerceSmokeTest.java
├── contracts
│   ├── java-modularization-contract.yaml
│   ├── module-naming-policy.yaml
│   ├── requires-policy.yaml
│   ├── exports-policy.yaml
│   ├── opens-policy.yaml
│   ├── reflection-policy.yaml
│   ├── service-loader-policy.yaml
│   ├── split-package-policy.yaml
│   ├── automatic-module-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── docs
│   ├── JAVA_MODULES_OVERVIEW.md
│   ├── MODULE_GRAPH.md
│   ├── REQUIRES_AND_EXPORTS.md
│   ├── OPENS_AND_REFLECTION.md
│   ├── MAVEN_MULTI_MODULE.md
│   ├── MODULE_PATH.md
│   ├── SPRING_AND_JPMS.md
│   ├── TRADE_OFFS.md
│   └── TROUBLESHOOTING.md
└── reports
    ├── Maven-module-report.yaml
    ├── JPMS-module-report.yaml
    ├── dependency-graph-report.yaml
    ├── exports-report.yaml
    ├── reflection-report.yaml
    ├── split-package-report.yaml
    └── Java-modularization-gate-report.yaml
```

Scripts:

```text
scripts/m19/java-modular-commerce
├── validate-java-modularization-contract.ps1
├── build-java-modular-commerce.ps1
├── validate-Maven-module-graph.ps1
├── validate-JPMS-module-descriptors.ps1
├── validate-module-requires.ps1
├── validate-module-exports.ps1
├── validate-module-opens.ps1
├── validate-split-packages.ps1
├── validate-automatic-modules.ps1
├── run-java-modular-commerce-tests.ps1
├── run-java-modular-commerce-smoke.ps1
├── collect-java-modularization-evidence.ps1
└── verify-java-modularization-gate.ps1
```

Ao final, você terá uma aplicação única montada a partir de artifacts Maven e módulos JPMS explícitos.

---

## Conceito essencial

### Maven multi-module

Projeto Maven agregador que coordena vários subprojetos.

---

### Java module

Unidade nomeada com dependências e packages expostos explicitamente.

---

### Module descriptor

Arquivo `module-info.java` que descreve um módulo Java.

---

### Module path

Caminho usado pelo JPMS para localizar módulos nomeados.

---

### Classpath

Mecanismo tradicional de carregamento sem encapsulamento modular explícito.

---

### `requires`

Declara dependência de outro módulo.

---

### `requires transitive`

Propaga uma dependência para consumidores do módulo atual.

---

### `requires static`

Declara dependência necessária em compilação, mas opcional em runtime.

---

### `exports`

Torna um package acessível a outros módulos.

---

### Qualified export

Exporta um package apenas para módulos específicos.

---

### `opens`

Permite reflexão profunda em um package.

---

### Qualified open

Abre um package apenas para módulos específicos.

---

### Strong encapsulation

Restrição real de acesso a packages não exportados ou não abertos.

---

### Split package

Mesmo package distribuído em mais de um módulo nomeado.

---

### Automatic module

JAR sem `module-info.java` colocado no module path.

---

### Unnamed module

Código executado no classpath, sem nome modular.

---

### Service Loader

Mecanismo Java para descobrir implementações de serviços.

---

## Mão na massa guiada

### 1. Criar projeto raiz

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-616-modularizacao-em-java/java-modular-commerce

Set-Location `
  labs/m19/aula-616-modularizacao-em-java/java-modular-commerce
```

---

### 2. Criar POM agregador

Arquivo:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
             http://maven.apache.org/POM/4.0.0
             https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.formacao</groupId>
    <artifactId>java-modular-commerce</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <packaging>pom</packaging>

    <modules>
        <module>commerce-shared</module>
        <module>commerce-inventory-api</module>
        <module>commerce-inventory-application</module>
        <module>commerce-orders-api</module>
        <module>commerce-orders-application</module>
        <module>commerce-bootstrap</module>
    </modules>
</project>
```

A ordem também ajuda o reactor Maven.

---

### 3. Entender agregação e herança

O POM raiz pode ser:

- agregador;
- parent;
- ambos.

Agregação define módulos do build.

Herança compartilha configuração.

Nesta aula, o POM raiz será ambos.

---

### 4. Criar contrato principal

Arquivo:

```text
contracts/java-modularization-contract.yaml
```

Conteúdo:

```yaml
javaModularization:
  required:
    - Maven-multi-module
    - named-Java-modules
    - explicit-requires
    - minimal-exports
    - controlled-opens
    - no-split-packages
    - module-graph
    - tests
    - smoke

  forbidden:
    - export-all-packages
    - open-entire-module-without-reason
    - cyclic-Maven-dependency
    - cyclic-JPMS-dependency
    - split-package
    - hidden-classpath-fallback

  nextLesson:
    code:
      M19.07
```

---

### 5. Definir nomes dos módulos

Use nomes estáveis:

```text
br.com.formacao.commerce.shared;

br.com.formacao.commerce.inventory.api;

br.com.formacao.commerce.inventory.application;

br.com.formacao.commerce.orders.api;

br.com.formacao.commerce.orders.application;

br.com.formacao.commerce.bootstrap.
```

Evite nomes com:

- versão;
- ambiente;
- implementação temporária;
- underscore;
- hífen no identificador JPMS.

---

### 6. Criar naming policy

Arquivo:

```text
contracts/module-naming-policy.yaml
```

Conteúdo:

```yaml
moduleNaming:
  format:
    reverse-domain:
      required

  forbidden:
    - version
    - environment
    - temporary-name
    - underscore
    - hyphen

  artifactAndModule:
    mapping:
      documented:
        required
```

O artifact Maven pode conter hífen.

O nome JPMS normalmente usa pontos.

---

### 7. Criar módulo shared

Descriptor:

```java
module br.com.formacao.commerce.shared {

    exports br.com.formacao.commerce.shared;
}
```

Mantenha o shared mínimo.

O fato de um package ser exportado aumenta seu custo de compatibilidade.

---

### 8. Criar inventory API

Descriptor:

```java
module br.com.formacao.commerce.inventory.api {

    exports br.com.formacao.commerce.inventory.api;
}
```

O módulo API não depende da implementação.

---

### 9. Criar inventory application

Descriptor:

```java
module br.com.formacao.commerce.inventory.application {

    requires br.com.formacao.commerce.inventory.api;
    requires br.com.formacao.commerce.shared;

    exports br.com.formacao.commerce.inventory.internal
        to br.com.formacao.commerce.bootstrap;
}
```

Esse qualified export permite que apenas o bootstrap acesse uma classe de composição.

Entretanto, exportar `internal` deve ser avaliado com cuidado.

Uma alternativa melhor é criar um package específico de fábrica.

---

### 10. Melhorar package de composição

Em vez de exportar todo `internal`, crie:

```text
br.com.formacao.commerce.inventory.configuration
```

E exporte apenas:

```java
exports br.com.formacao.commerce.inventory.configuration
    to br.com.formacao.commerce.bootstrap;
```

A implementação de domínio permanece não exportada.

---

### 11. Criar factory de módulo

```java
public final class InventoryModuleFactory {

    private InventoryModuleFactory() {
    }

    public static InventoryModuleApi create(
            ModuleClock clock) {

        InventoryRepository repository =
                new InMemoryInventoryRepository();

        return new DefaultInventoryModuleApi(
                repository,
                clock);
    }
}
```

O bootstrap recebe a API pública.

Ele não recebe repositories internos.

---

### 12. Criar orders API

Descriptor:

```java
module br.com.formacao.commerce.orders.api {

    requires br.com.formacao.commerce.inventory.api;

    exports br.com.formacao.commerce.orders.api;
}
```

Questione essa dependência.

A API pública de orders realmente precisa expor tipos de inventory?

Se não precisa, remova.

A dependência provavelmente pertence à implementação de orders, não à API.

---

### 13. Corrigir dependência

Descriptor de orders API:

```java
module br.com.formacao.commerce.orders.api {

    exports br.com.formacao.commerce.orders.api;
}
```

Descriptor de orders application:

```java
module br.com.formacao.commerce.orders.application {

    requires br.com.formacao.commerce.orders.api;
    requires br.com.formacao.commerce.inventory.api;
    requires br.com.formacao.commerce.shared;

    exports br.com.formacao.commerce.orders.configuration
        to br.com.formacao.commerce.bootstrap;
}
```

A implementação depende da API de inventory.

---

### 14. Criar bootstrap

Descriptor inicial:

```java
module br.com.formacao.commerce.bootstrap {

    requires br.com.formacao.commerce.orders.api;
    requires br.com.formacao.commerce.orders.application;
    requires br.com.formacao.commerce.inventory.api;
    requires br.com.formacao.commerce.inventory.application;
    requires br.com.formacao.commerce.shared;

    requires spring.boot;
    requires spring.boot.autoconfigure;
    requires spring.context;
    requires spring.web;
}
```

Nomes reais de módulos de bibliotecas devem ser confirmados pelo build.

Nem todo JAR possui módulo explícito.

---

### 15. Entender automatic modules

Dependências sem `module-info.java` podem virar automatic modules quando colocadas no module path.

O nome pode vir de:

- `Automatic-Module-Name`;
- nome do JAR.

Nomes derivados do JAR podem mudar.

Por isso, valide.

---

### 16. Inspecionar módulo

Use:

```powershell
jar `
  --describe-module `
  --file `
  caminho/do/dependency.jar
```

Ou:

```powershell
jdeps `
  --print-module-deps `
  caminho/do/artifact.jar
```

---

### 17. Criar automatic module policy

Arquivo:

```text
contracts/automatic-module-policy.yaml
```

Conteúdo:

```yaml
automaticModules:
  usage:
    allowedWithReview:
      true

  name:
    stable:
      required

  derivedFromFileName:
    risk:
      documented

  migration:
    plan:
      requiredForCriticalDependency

  classpathFallback:
    hidden:
      forbidden
```

---

### 18. Entender `requires`

Exemplo:

```java
requires br.com.formacao.commerce.inventory.api;
```

Significa que o módulo atual lê o módulo informado.

Sem essa leitura, tipos públicos não ficam acessíveis.

---

### 19. Entender `requires transitive`

Exemplo hipotético:

```java
module br.com.formacao.commerce.orders.api {

    requires transitive
        br.com.formacao.commerce.shared;

    exports br.com.formacao.commerce.orders.api;
}
```

Use somente se a API pública de orders expuser tipos do shared.

Consumidores precisam ler shared para usar a API.

Não use transitive apenas por conveniência.

---

### 20. Criar requires policy

Arquivo:

```text
contracts/requires-policy.yaml
```

Conteúdo:

```yaml
requires:
  normal:
    default:
      true

  transitive:
    onlyWhenPublicAPIExposesDependency:
      required

  static:
    compileTimeOnlyOrOptionalRuntime:
      required

  unused:
    forbidden

  cycle:
    forbidden
```

---

### 21. Entender `requires static`

Pode ser usado quando a dependência é necessária na compilação, mas opcional em runtime.

Exemplo comum:

- annotations;
- ferramentas de análise;
- integração opcional.

Não use para esconder dependência runtime real.

---

### 22. Entender `exports`

```java
exports br.com.formacao.commerce.orders.api;
```

Outros módulos podem acessar tipos públicos desse package.

Packages não exportados permanecem encapsulados.

---

### 23. Entender qualified exports

```java
exports br.com.formacao.commerce.orders.configuration
    to br.com.formacao.commerce.bootstrap;
```

Somente o bootstrap recebe acesso.

Isso é útil para composição.

Mas aumenta acoplamento explícito.

Documente a decisão.

---

### 24. Criar exports policy

Arquivo:

```text
contracts/exports-policy.yaml
```

Conteúdo:

```yaml
exports:
  publicAPI:
    allowed

  internalDomain:
    forbidden

  repository:
    forbidden

  configuration:
    qualifiedExport:
      preferredWhenNeeded

  exportAll:
    forbidden

  exportedPackage:
    compatibilityCost:
      acknowledged:
        required
```

---

### 25. Entender reflexão

Frameworks podem usar reflexão para:

- criar objetos;
- acessar campos;
- descobrir annotations;
- serializar;
- desserializar;
- proxying.

JPMS pode bloquear acesso reflexivo profundo a packages não abertos.

---

### 26. Entender `opens`

```java
opens br.com.formacao.commerce.bootstrap.web
    to spring.core,
       spring.beans,
       com.fasterxml.jackson.databind;
```

Essa sintaxe pode variar conforme os nomes reais dos módulos.

Sempre valide com o build.

---

### 27. Evitar `open module`

Exemplo amplo:

```java
open module br.com.formacao.commerce.bootstrap {
}
```

Isso abre todos os packages para reflexão.

É simples, mas reduz encapsulamento.

Prefira abrir somente o necessário.

---

### 28. Criar opens policy

Arquivo:

```text
contracts/opens-policy.yaml
```

Conteúdo:

```yaml
opens:
  default:
    closed

  reflection:
    packageSpecific:
      required

  qualifiedOpen:
    preferred

  openModule:
    forbiddenWithoutDocumentedReason

  domainPackage:
    open:
      forbiddenByDefault
```

---

### 29. Criar reflection policy

Arquivo:

```text
contracts/reflection-policy.yaml
```

Conteúdo:

```yaml
reflection:
  framework:
    allowedOnlyFor:
      - configuration
      - web-DTO
      - framework-entrypoint

  domain:
    deepReflection:
      forbiddenByDefault

  failure:
    mustBeDetectedBy:
      - context-test
      - smoke-test
```

---

### 30. Configurar Maven Compiler Plugin

Exemplo:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <release>21</release>
    </configuration>
</plugin>
```

O Maven deve compilar no module path quando encontra descriptors adequados.

---

### 31. Configurar Surefire

Testes JPMS podem exigir configuração adicional.

Exemplo:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <useModulePath>true</useModulePath>
    </configuration>
</plugin>
```

Alguns frameworks de teste podem exigir `opens` ou argumentos adicionais.

Evite desativar module path sem compreender o problema.

---

### 32. Criar build completo

Execute:

```powershell
mvn `
  clean `
  verify
```

O reactor deve construir todos os módulos.

---

### 33. Criar script de build

```powershell
.\scripts\m19\java-modular-commerce\build-java-modular-commerce.ps1
```

O script deve:

- validar Java 21;
- validar Maven;
- limpar artifacts;
- compilar;
- executar testes;
- gerar relatório;
- preservar saída útil;
- falhar no primeiro erro crítico.

---

### 34. Validar grafo Maven

Execute:

```powershell
.\scripts\m19\java-modular-commerce\validate-Maven-module-graph.ps1
```

Procure:

- módulos ausentes;
- dependências duplicadas;
- ciclos;
- dependência no sentido errado;
- versões divergentes;
- artifact não usado.

---

### 35. Validar descriptors JPMS

Execute:

```powershell
.\scripts\m19\java-modular-commerce\validate-JPMS-module-descriptors.ps1
```

Confirme:

- um descriptor por módulo nomeado;
- nome correto;
- requires existentes;
- exports mínimos;
- opens mínimos;
- ausência de ciclos;
- ausência de packages duplicados.

---

### 36. Detectar split packages

Split package ocorre quando:

```text
br.com.formacao.commerce.orders.api
```

aparece em dois módulos.

JPMS não permite isso entre módulos nomeados na mesma camada.

---

### 37. Criar split package policy

Arquivo:

```text
contracts/split-package-policy.yaml
```

Conteúdo:

```yaml
splitPackage:
  namedModules:
    forbidden

  packageOwnership:
    singleModule:
      required

  duplicatePackage:
    action:
      FAIL

  testFixtures:
    separatePackage:
      required
```

---

### 38. Validar split packages

Execute:

```powershell
.\scripts\m19\java-modular-commerce\validate-split-packages.ps1
```

O script deve mapear:

- package;
- módulo;
- origem;
- duplicidade.

---

### 39. Criar composition root

No bootstrap:

```java
@Configuration
public class CommerceConfiguration {

    @Bean
    InventoryModuleApi inventoryModuleApi(
            ModuleClock clock) {

        return InventoryModuleFactory.create(
                clock);
    }

    @Bean
    OrderModuleApi orderModuleApi(
            InventoryModuleApi inventory,
            ModuleClock clock,
            ModuleIdGenerator ids) {

        return OrderModuleFactory.create(
                inventory,
                clock,
                ids);
    }
}
```

O bootstrap conhece factories exportadas de forma qualificada.

---

### 40. Criar HTTP adapter

O controller depende apenas de:

```text
OrderModuleApi.
```

Não depende de classes internas.

---

### 41. Criar contexto Spring

O módulo bootstrap concentra:

- aplicação;
- controllers;
- configuration;
- exception handler;
- properties;
- startup.

Os módulos de negócio permanecem Java puro quando possível.

---

### 42. Criar context test

```java
@SpringBootTest
class ModularCommerceContextTest {

    @Test
    void contextLoads() {
    }
}
```

Esse teste detecta problemas de:

- reflection;
- bean discovery;
- module reads;
- package opens;
- automatic module names.

---

### 43. Criar smoke test

Valide:

- contexto;
- criação de pedido;
- chamada ao inventory API;
- resposta HTTP;
- ausência de acesso a internals;
- build no module path.

---

### 44. Usar `jdeps`

Execute:

```powershell
jdeps `
  --recursive `
  --summary `
  commerce-bootstrap/target/*.jar
```

E:

```powershell
jdeps `
  --print-module-deps `
  commerce-bootstrap/target/*.jar
```

Resultados ajudam a identificar dependências reais.

---

### 45. Usar `java --list-modules`

```powershell
java `
  --list-modules
```

Isso lista módulos do runtime.

---

### 46. Usar `java --describe-module`

```powershell
java `
  --describe-module `
  java.sql
```

Ajuda a entender descriptors da plataforma.

---

### 47. Service Loader controlado

Crie uma interface:

```java
public interface ModuleHealthContributor {

    String moduleName();

    boolean healthy();
}
```

No módulo compartilhado ou API própria.

Um provider declara:

```java
provides ModuleHealthContributor
    with InventoryHealthContributor;
```

O bootstrap declara:

```java
uses ModuleHealthContributor;
```

---

### 48. Consumir serviço

```java
ServiceLoader
        .load(
                ModuleHealthContributor.class)
        .stream()
        .map(ServiceLoader.Provider::get)
        .toList();
```

Use apenas para demonstrar mecanismo.

Não substitua toda injeção de dependência por Service Loader.

---

### 49. Criar service loader policy

Arquivo:

```text
contracts/service-loader-policy.yaml
```

Conteúdo:

```yaml
serviceLoader:
  use:
    limitedAndExplicit:
      required

  serviceType:
    stableAPI:
      required

  provider:
    declared:
      required

  dependencyInjectionReplacement:
    forbiddenByDefault

  missingProvider:
    behavior:
      explicit
```

---

### 50. Entender unnamed module

Código no classpath entra no unnamed module.

Ele lê todos os módulos.

Mas módulos nomeados não leem automaticamente o unnamed module.

Misturar classpath e module path pode causar comportamentos confusos.

Documente exatamente como a aplicação é executada.

---

### 51. Evitar fallback silencioso

Uma build pode “funcionar” porque os testes foram executados no classpath, enquanto produção usa module path.

Por isso:

- validar `useModulePath`;
- executar smoke;
- inspecionar logs do build;
- documentar comandos.

---

### 52. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unusedRequires:
    result:
      review-required

  broadExports:
    result:
      encapsulation-loss

  broadOpens:
    result:
      reflection-leak

  splitPackage:
    action:
      FAIL

  hiddenClasspathFallback:
    action:
      FAIL

  unstableAutomaticModuleName:
    result:
      dependency-risk
```

---

### 53. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  cyclicMavenModules:
    action:
      FAIL

  cyclicJpmsModules:
    action:
      FAIL

  splitPackage:
    action:
      FAIL

  internalPackageExported:
    action:
      FAIL

  openEntireModuleWithoutReason:
    action:
      FAIL

  contextReflectionFailure:
    action:
      FAIL

  DDD:
    deferredToLesson617
```

---

### 54. Executar testes

Execute:

```powershell
.\scripts\m19\java-modular-commerce\run-java-modular-commerce-tests.ps1
```

Confirme:

- shared;
- inventory API;
- inventory application;
- orders API;
- orders application;
- bootstrap;
- context;
- smoke;
- service loader.

---

### 55. Validar requires

Execute:

```powershell
.\scripts\m19\java-modular-commerce\validate-module-requires.ps1
```

Procure:

- requires ausente;
- requires não usado;
- transitive sem justificativa;
- static incorreto;
- ciclo;
- framework no módulo errado.

---

### 56. Validar exports

Execute:

```powershell
.\scripts\m19\java-modular-commerce\validate-module-exports.ps1
```

Confirme:

- APIs públicas exportadas;
- internals não exportados;
- configuration qualificada;
- nenhum export global desnecessário.

---

### 57. Validar opens

Execute:

```powershell
.\scripts\m19\java-modular-commerce\validate-module-opens.ps1
```

Confirme:

- apenas packages refletidos;
- qualified opens quando possível;
- domínio fechado;
- nenhum `open module` sem justificativa.

---

### 58. Criar relatório de grafo

Arquivo:

```text
docs/MODULE_GRAPH.md
```

Grafo esperado:

```text
commerce-bootstrap
    |
    +--> commerce-orders-api
    |
    +--> commerce-orders-application
    |
    +--> commerce-inventory-api
    |
    +--> commerce-inventory-application
    |
    +--> commerce-shared

commerce-orders-application
    |
    +--> commerce-orders-api
    |
    +--> commerce-inventory-api
    |
    +--> commerce-shared

commerce-inventory-application
    |
    +--> commerce-inventory-api
    |
    +--> commerce-shared
```

Sem ciclo.

---

### 59. Criar reports

Exemplo:

```yaml
jpmsModules:
  shared:
    PASS

  inventoryApi:
    PASS

  inventoryApplication:
    PASS

  ordersApi:
    PASS

  ordersApplication:
    PASS

  bootstrap:
    PASS

  result:
    PASS
```

---

### 60. Criar gate

O gate valida:

```text
Maven reactor;

module descriptors;

module names;

requires;

transitive requires;

static requires;

exports;

qualified exports;

opens;

reflection;

module path;

automatic modules;

split packages;

service loader;

tests;

smoke;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_MAVEN_GRAPH;

FAIL_MODULE_DESCRIPTOR;

FAIL_REQUIRES;

FAIL_EXPORTS;

FAIL_OPENS;

FAIL_REFLECTION;

FAIL_MODULE_PATH;

FAIL_AUTOMATIC_MODULE;

FAIL_SPLIT_PACKAGE;

FAIL_SERVICE_LOADER;

FAIL_TEST;

FAIL_SMOKE;

FAIL_DOCUMENTATION;

INCONCLUSIVE.
```

---

### 61. Coletar evidence

Arquivo:

```text
contracts/java-modularization-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- Maven reactor status;
- shared module status;
- inventory API status;
- inventory application status;
- orders API status;
- orders application status;
- bootstrap status;
- requires status;
- exports status;
- opens status;
- reflection status;
- module path status;
- automatic module status;
- split package status;
- service loader status;
- test status;
- smoke status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- secrets;
- paths locais reais;
- tokens;
- conteúdo de DDD;
- bounded contexts;
- aggregates.

---

### 62. Executar validação completa

```powershell
.\scripts\m19\java-modular-commerce\validate-java-modularization-contract.ps1

.\scripts\m19\java-modular-commerce\build-java-modular-commerce.ps1

.\scripts\m19\java-modular-commerce\validate-Maven-module-graph.ps1

.\scripts\m19\java-modular-commerce\validate-JPMS-module-descriptors.ps1

.\scripts\m19\java-modular-commerce\validate-module-requires.ps1

.\scripts\m19\java-modular-commerce\validate-module-exports.ps1

.\scripts\m19\java-modular-commerce\validate-module-opens.ps1

.\scripts\m19\java-modular-commerce\validate-split-packages.ps1

.\scripts\m19\java-modular-commerce\validate-automatic-modules.ps1

.\scripts\m19\java-modular-commerce\run-java-modular-commerce-tests.ps1

.\scripts\m19\java-modular-commerce\run-java-modular-commerce-smoke.ps1

.\scripts\m19\java-modular-commerce\collect-java-modularization-evidence.ps1

.\scripts\m19\java-modular-commerce\verify-java-modularization-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 63. Encerrar o laboratório

Confirme:

- reactor Maven aprovado;
- descriptors válidos;
- grafo sem ciclos;
- packages internos fechados;
- opens mínimos;
- nenhum split package;
- automatic modules documentados;
- testes no module path;
- smoke aprovado;
- nenhum processo residual;
- reports sanitizados;
- DDD não antecipado.

---

## Entendendo o que foi feito

### O monólito modular ganhou artifacts físicos

Módulos deixaram de existir apenas como packages.

### As dependências ganharam declaração

`requires` passou a explicitar leituras.

### As APIs ganharam export control

`exports` passou a limitar acesso externo.

### A reflexão ganhou limite

`opens` passou a registrar quais packages precisam de acesso profundo.

### A composição ganhou módulo próprio

O bootstrap passou a conectar implementações.

### Os internals ganharam encapsulamento

Packages não exportados ficaram inacessíveis a outros módulos nomeados.

### O build ganhou grafo

Maven e JPMS passaram a validar relações complementares.

### Os split packages ganharam proibição

Cada package passou a possuir um único módulo.

### As bibliotecas ganharam avaliação

Automatic modules deixaram de ser tratados como detalhe invisível.

### A próxima aula ganhou fronteira

DDD fundamentos fica para a aula 617.

---

## Erros comuns importantes

### Criar `module-info.java` sem entender o grafo

A build fica frágil.

### Exportar todos os packages

O encapsulamento desaparece.

### Usar `open module` por conveniência

Reflexão recebe acesso amplo.

### Usar `requires transitive` em tudo

Dependências vazam para consumidores.

### Colocar internals no módulo API

A fronteira perde sentido.

### Criar split package

JPMS não consegue resolver corretamente.

### Ignorar automatic module names

Atualização de dependência pode quebrar o descriptor.

### Desativar module path nos testes

Problemas reais ficam escondidos.

### Criar módulo Maven para cada classe

O custo supera o benefício.

### Antecipar DDD

A modularização técnica não substitui modelagem de domínio.

---

## Comandos úteis

### Build completo

```powershell
.\scripts\m19\java-modular-commerce\build-java-modular-commerce.ps1
```

### Validar descriptors

```powershell
.\scripts\m19\java-modular-commerce\validate-JPMS-module-descriptors.ps1
```

### Validar exports e opens

```powershell
.\scripts\m19\java-modular-commerce\validate-module-exports.ps1

.\scripts\m19\java-modular-commerce\validate-module-opens.ps1
```

### Executar smoke

```powershell
.\scripts\m19\java-modular-commerce\run-java-modular-commerce-smoke.ps1
```

### Verificar gate

```powershell
.\scripts\m19\java-modular-commerce\verify-java-modularization-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Reactor Maven

Crie POM raiz e submódulos.

### Parte 2 — Module descriptors

Nomeie módulos e dependências.

### Parte 3 — Requires

Declare leituras mínimas.

### Parte 4 — Exports

Exponha apenas APIs.

### Parte 5 — Opens

Abra somente packages refletidos.

### Parte 6 — Composition

Monte módulos no bootstrap.

### Parte 7 — Module path

Execute build e testes corretamente.

### Parte 8 — Split packages

Garanta ownership único.

### Parte 9 — Automatic modules

Inspecione dependências externas.

### Parte 10 — Gate

Valide grafo, reflexão e smoke.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 615 e ponte para a aula 617 foram preservadas;
- o projeto Maven multi-module foi criado;
- módulos shared, inventory API, inventory application, orders API, orders application e bootstrap existem;
- cada módulo nomeado possui `module-info.java`;
- nomes JPMS seguem reverse domain;
- dependências Maven e JPMS estão coerentes;
- não existem ciclos Maven;
- não existem ciclos JPMS;
- APIs públicas são exportadas;
- internals não são exportados;
- packages de composição usam qualified export quando necessário;
- `requires transitive` aparece apenas quando a API pública exige;
- `requires static` não oculta dependência runtime;
- `opens` é mínimo e específico;
- nenhum `open module` foi usado sem justificativa;
- packages de domínio permanecem fechados por padrão;
- Spring e Jackson possuem acesso reflexivo apenas quando necessário;
- testes executam no module path;
- nenhum fallback silencioso para classpath foi aceito;
- não existem split packages;
- automatic modules foram inspecionados;
- nomes automáticos instáveis foram documentados;
- bootstrap compõe APIs e implementations;
- controllers dependem das APIs públicas;
- Service Loader foi usado apenas de forma controlada;
- contexto Spring e smoke foram aprovados;
- reports, gate e evidence foram criados;
- nenhum dado sensível ou path pessoal foi incluído;
- DDD fundamentos e DDD estratégico não foram antecipados;
- commit recomendado, diário de bordo e regra final estão presentes.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

git diff --stat
```

Adicione:

```powershell
git add `
  labs/m19/aula-616-modularizacao-em-java/java-modular-commerce `
  scripts/m19/java-modular-commerce `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|userHomePath|customerReferenceReal|boundedContext|aggregateRoot|ubiquitousLanguage|strategicDDD"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): aplicar modularizacao em Java"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- paths locais reais;
- módulos sem uso;
- exports amplos;
- opens amplos;
- DDD;
- sistemas distribuídos.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou modularização em Java.

Você criou:

```text
projeto Maven multi-module;

módulos JPMS nomeados;

module-info.java;

requires;

requires transitive;

requires static;

exports;

qualified exports;

opens;

qualified opens;

module path;

service loader;

testes de reflexão;

gates.
```

Você comprovou que modules Maven e modules Java resolvem problemas relacionados, mas diferentes; que `requires` explicita leitura; que `exports` define API; que `opens` controla reflexão; que internals não precisam ser públicos; que split packages são proibidos; que automatic modules precisam ser avaliados; que testes precisam reproduzir o module path; e que o bootstrap pode compor módulos sem expor implementações.

A próxima aula será:

```text
617 - M19.07 - DDD fundamentos
```

Nela, você começará a estudar como entender e modelar o negócio, construindo linguagem compartilhada e distinguindo conceitos de domínio de detalhes técnicos.

Nenhum bounded context, aggregate, value object, domain service ou prática formal de DDD foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o reactor Maven.
- [ ] Nomeei módulos JPMS.
- [ ] Declarei requires mínimos.
- [ ] Exporteis apenas APIs.
- [ ] Abri apenas packages necessários.
- [ ] Impedi split packages.
- [ ] Validei automatic modules.
- [ ] Executei testes no module path.

---

## Troubleshooting adicional

### `module not found`

Revise artifact, nome JPMS, module path e ordem do build.

### Package não está visível

Verifique se deve ser exportado ou se o acesso é indevido.

### Spring falha por reflexão

Adicione `opens` apenas ao package necessário.

### Jackson não cria DTO

Revise qualified open para o módulo do Jackson.

### Teste passa sem JPMS

Confirme `useModulePath` e logs do Surefire.

### Automatic module muda de nome

Procure `Automatic-Module-Name` ou fixe versão e risco.

### Surge split package

Mova o package inteiro para um único módulo.

### `requires transitive` parece resolver tudo

Revise se a API pública realmente expõe a dependência.

### Bootstrap conhece internals demais

Use factory exportada de forma qualificada.

### A aula começa a modelar domínio formalmente

Preserve DDD para a aula 617.

---

## Perguntas de revisão

1. O que é JPMS?
2. O que é `module-info.java`?
3. Qual diferença entre Maven module e Java module?
4. O que faz `requires`?
5. Quando usar `requires transitive`?
6. Quando usar `requires static`?
7. O que faz `exports`?
8. O que é qualified export?
9. O que faz `opens`?
10. Qual risco de `open module`?
11. O que é strong encapsulation?
12. O que é module path?
13. O que é automatic module?
14. O que é unnamed module?
15. O que é split package?
16. Por que testes precisam usar module path?
17. Para que serve `jdeps`?
18. Quando Service Loader faz sentido?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sistema de módulos da plataforma Java.
2. Descriptor do módulo.
3. Build físico versus encapsulamento Java.
4. Declara leitura de outro módulo.
5. Quando a API pública expõe tipos da dependência.
6. Dependência de compilação ou runtime opcional real.
7. Expõe package para outros módulos.
8. Export limitado a módulos específicos.
9. Permite reflexão profunda.
10. Perda ampla de encapsulamento.
11. Restrição real de packages não exportados.
12. Caminho de resolução de módulos nomeados.
13. JAR sem descriptor no module path.
14. Código executado no classpath.
15. Mesmo package em módulos diferentes.
16. Reproduzir comportamento real.
17. Inspecionar dependências.
18. Descoberta limitada de providers.
19. DDD fundamentos.
20. DDD fundamentos.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 616 - M19.06 - Modularizacao em Java

- Transformei parte do monólito modular em projeto Maven multi-module.
- Criei módulos shared, inventory API, inventory application, orders API, orders application e bootstrap.
- Adicionei `module-info.java` aos módulos nomeados.
- Defini nomes JPMS estáveis.
- Declarei dependências com `requires`.
- Usei `requires transitive` apenas quando necessário.
- Estudei `requires static`.
- Exportei apenas packages de API.
- Usei qualified exports para composição.
- Mantive internals não exportados.
- Usei `opens` apenas para reflexão necessária.
- Evitei `open module`.
- Configurei testes no module path.
- Validei automatic modules.
- Impedi split packages.
- Usei `jdeps`, `jar --describe-module` e comandos do runtime.
- Demonstrei Service Loader de forma limitada.
- Criei reports, gate e evidence.
- Não antecipei DDD fundamentos ou DDD estratégico.
- Próxima aula: DDD fundamentos.
```

---

## Referência técnica curta

- Java Platform Module System.
- Maven multi-module.
- Module descriptors.
- Module path.
- `requires`.
- `exports`.
- `opens`.
- Strong encapsulation.
- Automatic modules.
- Service Loader.

Regra final:

```text
a modularização em Java precisa reforçar fronteiras sem transformar o build em burocracia: Maven multi-module organiza artifacts e o JPMS organiza módulos nomeados, cada `module-info.java` declara `requires` mínimos, `requires transitive` somente quando a API pública expõe tipos da dependência e `requires static` somente quando a ausência em runtime é realmente suportada; `exports` publica apenas APIs estáveis, internals permanecem fechados, qualified exports limitam factories de composição, `opens` é aplicado apenas a packages que precisam de reflexão e `open module` é evitado, enquanto Spring e Jackson são validados por context e smoke tests; não existem ciclos Maven ou JPMS, split packages são proibidos, automatic modules têm nomes e riscos inspecionados, testes executam no module path sem fallback silencioso e Service Loader permanece limitado a contratos estáveis; o gate termina com reactor, descriptors, requires, exports, opens, reflexão, module path, testes, smoke, documentação e evidence aprovados, enquanto DDD fundamentos começa somente na aula 617 e DDD estratégico permanece reservado à aula 618.
```
