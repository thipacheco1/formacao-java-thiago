# 360 - M14.05 - Beans Component Service Repository Configuration

## Apresentacao da aula

Na aula 359, você retirou valores operacionais do código e passou a controlá-los por meio do sistema de configuração externa do Spring Boot.

O projeto contínuo agora possui:

```text
application.yaml;

profiles dev, test, prod e diagnostics;

grupo local;

variáveis de ambiente;

argumentos de linha de comando;

arquivos externos;

@ConfigurationProperties;

binding de URI, Duration, lista e boolean;

política para dados sensíveis.
```

A aplicação já consegue mudar de comportamento sem ser recompilada.

Agora surge a próxima pergunta:

```text
quais objetos o Spring administra
e como esses objetos entram no ApplicationContext?
```

A resposta começa pelo conceito de:

```text
bean.
```

Um bean Spring é um objeto criado, configurado, identificado e administrado pelo container.

Esse objeto pode representar:

- componente genérico;
- serviço de aplicação;
- acesso a dados;
- configuração;
- cliente de biblioteca;
- clock;
- formatter;
- mapper;
- policy;
- infraestrutura;
- objeto de terceiros.

Nem todo objeto Java precisa ser um bean.

Entidades, records de command, DTOs, value objects e objetos temporários normalmente são criados pela própria aplicação.

Transformar tudo em bean gera um container inchado e dificulta compreender responsabilidade e lifecycle.

Nesta aula, você estudará:

- `BeanFactory`;
- `ApplicationContext`;
- bean definition;
- instância;
- nome;
- tipo;
- alias;
- scope singleton;
- component scan;
- `@Component`;
- `@Service`;
- `@Repository`;
- `@Configuration`;
- `@Bean`;
- stereotypes;
- classes próprias;
- classes de terceiros;
- factory methods;
- full configuration;
- lite configuration;
- `proxyBeanMethods`;
- nomes duplicados;
- bean definition overriding;
- múltiplos beans do mesmo tipo;
- introspecção controlada;
- organização por packages;
- testes de registro.

A aula continuará no projeto:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Nenhum novo projeto será gerado.

O laboratório criará objetos simples para observar o container.

Eles não serão ainda uma feature REST.

A aplicação continuará sem:

- controller;
- endpoint;
- persistência real;
- banco;
- JPA;
- Flyway;
- Security;
- Bean Validation;
- Actuator;
- regra de negócio completa.

A anotação `@Repository` será demonstrada como stereotype de acesso a dados.

A tradução real de exceptions de um provider de persistência será explicada, mas não será simulada com um banco inexistente.

Esse comportamento depende de infraestrutura de tradução e de uma tecnologia de persistência.

Você já praticou essa camada no M13.

Nesta aula, o foco será:

```text
registro e papel do bean.
```

A resolução de dependências por:

- constructor injection;
- `@Primary`;
- `@Qualifier`;
- coleções de beans;
- optional dependencies;
- múltiplos candidatos;

será aprofundada na próxima aula:

```text
361 - M14.06 - Injecao de dependencia constructor injection
```

Ainda assim, conflitos serão reproduzidos para que o problema exista antes da solução.

A próxima aula será:

```text
361 - M14.06 - Injecao de dependencia constructor injection
```

---

## Onde estamos na formacao

A sequência inicial do M14 é:

```text
356:
visão geral do Spring Boot.

357:
Initializr e estrutura.

358:
Main Application e auto configuration.

359:
properties, YAML e profiles.

360:
Beans, Component, Service, Repository e Configuration.

361:
injeção de dependência por construtor.

362:
ciclo de vida de beans.
```

A aula 359 respondeu:

```text
de onde vêm os valores da aplicação?
```

A aula 360 responderá:

```text
quais objetos fazem parte do container
e como são registrados?
```

Nesta aula:

```text
bean:
sim.

BeanFactory:
sim.

ApplicationContext:
sim.

bean definition:
sim.

@Component:
sim.

@Service:
sim.

@Repository:
sim.

@Configuration:
sim.

@Bean:
sim.

nome e alias:
sim.

singleton padrão:
sim.

component scan:
sim.

full e lite configuration:
sim.

conflito de nome:
sim.

múltiplos candidatos:
sim, como diagnóstico.

constructor injection:
não aprofundado.

@Primary:
somente ponte.

@Qualifier:
somente ponte.

lifecycle detalhado:
não.

@PostConstruct:
não.

@PreDestroy:
não.
```

O objetivo é conseguir olhar para qualquer classe e responder:

```text
ela precisa ser bean?

quem registra?

qual nome recebe?

qual tipo expõe?

qual papel representa?

qual código depende dela?

o container precisa administrar seu lifecycle?
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
├── FormacaoJavaBackendApiApplication.java
├── beans
│   ├── BeanCatalogDiagnostics.java
│   ├── BeanDescriptor.java
│   ├── component
│   │   └── ApplicationIdentityComponent.java
│   ├── config
│   │   ├── ClockConfiguration.java
│   │   └── TextToolConfiguration.java
│   ├── external
│   │   └── ThirdPartyTextNormalizer.java
│   ├── repository
│   │   └── RuntimeMessageRepository.java
│   └── service
│       └── RuntimeMessageService.java
├── bootstrap
└── properties
```

Testes novos:

```text
src/test/java/br/com/formacao/backend
├── BeanCatalogDiagnosticsIT.java
├── BeanDefinitionConflictIT.java
├── BeanNameAndAliasIT.java
├── ComponentStereotypeRegistrationIT.java
├── ConfigurationProxyBehaviorTest.java
├── ExplicitBeanRegistrationIT.java
├── MultipleBeanCandidatesIT.java
└── RepositoryStereotypeMetadataTest.java
```

Documentação na pasta externa:

```text
docs
├── bean-factory-application-context.md
├── bean-definition-instance.md
├── stereotypes.md
├── component-scan-registration.md
├── configuration-and-bean.md
├── full-lite-configuration.md
├── bean-names-aliases-conflicts.md
├── repository-exception-translation.md
└── bean-catalog-baseline.md
```

Scripts:

```text
scripts
├── 18_executar_testes_beans.ps1
├── 19_iniciar_catalogo_beans.ps1
├── 20_validar_conflitos.ps1
└── 21_validar_escopo_aula.ps1
```

Resultados esperados:

```text
ApplicationIdentityComponent:
registrado por @Component.

RuntimeMessageService:
registrado por @Service.

RuntimeMessageRepository:
registrado por @Repository.

ClockConfiguration:
registrada por @Configuration.

Clock:
registrado por @Bean.

ThirdPartyTextNormalizer:
registrado por @Bean.

nome default de component:
applicationIdentityComponent.

nome default de bean method:
applicationClock.

alias:
validado.

scope:
singleton.

bean overriding:
false.

nome duplicado:
falha controlada.

dois beans do mesmo tipo:
busca simples por tipo ambígua.

full configuration:
inter-bean call interceptada.

lite configuration:
chamada Java comum.

catalogo:
somente beans selecionados.

controller:
zero.

endpoint:
zero.
```

---

## Conceito essencial

### Inversion of Control

Em código puramente manual, uma classe cria seus colaboradores:

```java
var clock =
        Clock.systemUTC();

var formatter =
        new ThirdPartyTextNormalizer();

var service =
        new RuntimeMessageService();
```

Com Inversion of Control, a criação e a ligação de objetos administrados são delegadas ao container.

A aplicação declara:

```text
quais objetos existem;

como podem ser descobertos;

como podem ser construídos;

quais papéis possuem.
```

O container coordena a criação.

Isso não elimina o operador `new`.

Objetos de domínio e valores continuam podendo ser criados diretamente.

IoC deve ser usado onde o gerenciamento compartilhado oferece valor.

---

### Bean

Um bean é um objeto administrado pelo Spring container.

Para existir como bean, precisa haver uma bean definition ou um mecanismo equivalente de registro.

Fontes comuns:

- component scan;
- método `@Bean`;
- auto-configuração;
- import;
- infraestrutura do framework;
- registro programático.

Uma classe anotada fora da fronteira do scan não vira bean automaticamente.

Uma classe sem annotation pode virar bean por `@Bean`.

---

### BeanFactory

`BeanFactory` é o contrato central do container.

Ele permite operações como:

- obter bean por nome;
- obter bean por tipo;
- verificar existência;
- consultar aliases;
- distinguir singleton.

Ele representa a capacidade básica de gerenciar beans.

Não use `BeanFactory` diretamente em serviços de negócio para buscar dependências.

Isso criaria Service Locator e esconderia contratos.

Nesta aula, ele será utilizado somente para inspeção.

---

### ApplicationContext

`ApplicationContext` amplia as capacidades do `BeanFactory`.

Além de acesso a beans, integra:

- Environment;
- eventos;
- resources;
- internacionalização;
- lifecycle;
- infraestrutura web;
- post-processors.

A aplicação Boot executa sobre um `ApplicationContext`.

A classe principal já recebe um `ConfigurableApplicationContext` no laboratório.

---

### Bean definition

Bean definition é metadata usada pelo container.

Ela pode conter:

- classe;
- factory method;
- nome;
- scope;
- lazy;
- dependências;
- qualifiers;
- init e destroy methods;
- source;
- role.

A bean definition não é necessariamente a instância.

Pense em:

```text
bean definition:
receita.

bean instance:
objeto produzido.
```

O container pode possuir a definition antes de criar a instância.

O momento de criação será aprofundado na aula 362.

---

### Nome do bean

Cada bean possui ao menos um nome no contexto.

Para:

```java
@Component
public class ApplicationIdentityComponent {
}
```

o nome default esperado é:

```text
applicationIdentityComponent.
```

O nome é derivado da classe com convenção de decapitalização.

Para:

```java
@Bean
Clock applicationClock() {
    return Clock.systemUTC();
}
```

o nome default é:

```text
applicationClock.
```

Evite depender de nomes implícitos em contratos importantes sem documentar.

---

### Nome explicito

Um component pode receber nome:

```java
@Component(
        "applicationIdentity"
)
```

Um método bean pode declarar:

```java
@Bean(
        "applicationClock"
)
```

Use nomes explícitos quando:

- existe contrato por nome;
- há integração com framework;
- existem múltiplas instâncias do tipo;
- a semântica precisa ser visível.

Não dê nome arbitrário a todos os beans.

---

### Alias

`@Bean` pode registrar aliases:

```java
@Bean({
        "runtimeTextNormalizer",
        "textNormalizer"
})
ThirdPartyTextNormalizer runtimeTextNormalizer() {
    return new ThirdPartyTextNormalizer();
}
```

Os dois nomes apontam para a mesma bean definition e para a mesma instância singleton.

Alias não cria dois objetos.

Use alias somente por compatibilidade ou semântica clara.

Aliases demais dificultam busca e manutenção.

---

### Tipo do bean

O container também localiza beans por tipo.

Exemplo:

```java
context.getBean(
        Clock.class
);
```

A busca funciona quando existe um único candidato compatível.

Se houver mais de um, uma busca singular por tipo se torna ambígua.

O problema será reproduzido nesta aula.

A escolha entre candidatos será aprofundada na aula 361.

---

### Scope singleton

O scope default é:

```text
singleton.
```

Isso significa:

```text
uma instância por ApplicationContext
para aquela bean definition.
```

Não significa singleton global da JVM.

Dois contextos podem possuir instâncias diferentes.

O escopo e lifecycle detalhados serão estudados na aula 362.

Nesta aula, você validará apenas a identidade no mesmo contexto.

---

### Component scan

`@SpringBootApplication` ativa component scan a partir do package da classe principal.

A raiz permanece:

```text
br.com.formacao.backend.
```

As classes dentro de:

```text
br.com.formacao.backend.beans
```

podem ser descobertas.

Uma annotation stereotype só funciona automaticamente se a classe estiver dentro da fronteira ou for importada explicitamente.

---

### @Component

`@Component` é o stereotype genérico.

Use quando a classe é um componente Spring, mas não pertence claramente a uma camada especializada.

Exemplo da aula:

```text
ApplicationIdentityComponent.
```

Ele informará:

- nome da aplicação;
- ambiente lógico;
- identidade do módulo.

Não terá regra de negócio.

---

### @Service

`@Service` é uma especialização de `@Component`.

Ela comunica:

```text
serviço;

orquestração;

caso de uso;

regra de aplicação.
```

A annotation, sozinha, não adiciona uma transação nem transforma qualquer método em serviço de negócio.

Ela fornece semântica para:

- leitores;
- ferramentas;
- pointcuts;
- arquitetura;
- component scan.

O exemplo será pequeno porque a injeção entre camadas ficará para a próxima aula.

---

### @Repository

`@Repository` é uma especialização de `@Component` para acesso a dados.

Ela comunica:

```text
DAO;

repository;

integração com persistência;

fronteira de exceptions de dados.
```

Classes anotadas ficam elegíveis para tradução de exceptions quando a infraestrutura adequada, como um `PersistenceExceptionTranslationPostProcessor`, está presente.

A tradução converte exceptions específicas de tecnologia para a hierarquia consistente do Spring.

Nesta aula, não existe driver, provider ou banco.

Logo:

```text
stereotype:
demonstrado.

tradução real de provider:
não simulada.
```

Não invente uma exception de banco para fingir que a tradução ocorreu.

---

### @Controller

`@Controller` também é especialização de `@Component`.

Ele pertence à camada web.

Não será criado nesta aula.

A presença no ecossistema será apenas reconhecida.

Controllers e contratos HTTP terão aulas próprias.

---

### Stereotypes e arquitetura

Stereotype deve representar papel real.

Não faça:

```java
@Service
public class DateFormatter {
}
```

se o objeto é apenas uma ferramenta técnica.

Não faça:

```java
@Repository
public class EmailSender {
}
```

se ele não acessa armazenamento.

Annotations sem semântica correta enganam leitores e testes arquiteturais.

---

### @Configuration

`@Configuration` indica uma classe fonte de bean definitions.

Exemplo:

```java
@Configuration(
        proxyBeanMethods = false
)
public class ClockConfiguration {

    @Bean
    Clock applicationClock() {
        return Clock.systemUTC();
    }
}
```

A classe de configuração também é registrada no contexto.

Ela deve permanecer focada.

Evite uma configuração central com centenas de factory methods.

---

### @Bean

`@Bean` marca um factory method.

O tipo de retorno indica o tipo exposto pelo método.

O nome default é o nome do método.

Use `@Bean` quando:

- a classe é de terceiro;
- a construção exige factory;
- é necessário escolher uma implementação;
- a configuração precisa de parameters;
- o objeto não deve receber annotation Spring;
- o registro precisa ser explícito.

---

### Classe de terceiro

Você não controla classes do JDK ou bibliotecas externas.

Não pode adicionar `@Component` nelas.

Exemplo:

```text
java.time.Clock.
```

A solução é:

```java
@Bean
Clock applicationClock() {
    return Clock.systemUTC();
}
```

O mesmo será feito com:

```text
ThirdPartyTextNormalizer.
```

A classe simulará uma biblioteca externa sem annotation Spring.

---

### Factory method

O método `@Bean` pode conter lógica pequena de construção.

Exemplo:

```java
@Bean
ThirdPartyTextNormalizer runtimeTextNormalizer() {
    return new ThirdPartyTextNormalizer(
            Locale.ROOT
    );
}
```

Não coloque:

- chamadas demoradas;
- regra de negócio;
- fluxo transacional;
- acesso externo indiscriminado;
- tratamento complexo.

Configuração deve construir infraestrutura, não executar aplicação.

---

### Parameter em @Bean

Um factory method pode declarar dependências como parâmetros:

```java
@Bean
RuntimeTextPolicy runtimeTextPolicy(
        Clock applicationClock,
        ThirdPartyTextNormalizer runtimeTextNormalizer
) {
    return new RuntimeTextPolicy(
            applicationClock,
            runtimeTextNormalizer
    );
}
```

O container resolve os parâmetros.

Esse é um exemplo de injeção.

A escolha entre candidatos, contratos e testes de constructor injection será aprofundada na aula 361.

Nesta aula, use o padrão apenas em configuração explícita.

---

### Full configuration

O default de `@Configuration` é:

```text
proxyBeanMethods = true.
```

Nesse modo, a configuração é processada para interceptar chamadas entre métodos `@Bean`.

Exemplo conceitual:

```java
@Bean
Dependency dependency() {
    return new Dependency();
}

@Bean
Consumer consumer() {
    return new Consumer(
            dependency()
    );
}
```

A chamada a `dependency()` é interceptada e devolve o bean singleton administrado.

Esse comportamento é chamado informalmente de:

```text
full mode.
```

---

### Lite configuration

Com:

```java
@Configuration(
        proxyBeanMethods = false
)
```

as chamadas Java diretas entre métodos não são interceptadas.

Se um método chama outro diretamente, ele executa Java comum e pode criar outra instância.

Por isso, em lite mode, prefira dependências como parâmetros de factory method.

Exemplo:

```java
@Bean
Consumer consumer(
        Dependency dependency
) {
    return new Consumer(
            dependency
    );
}
```

Essa forma não depende de proxy entre métodos.

---

### Quando usar proxyBeanMethods false

Use `false` quando:

- não existem chamadas diretas entre métodos bean;
- dependencies entram por parâmetros;
- a configuração funciona como conjunto de factory methods independentes;
- não é necessário garantir semântica de chamada interceptada.

O Spring Boot utiliza esse estilo em muitas configurações.

Não defina `false` mecanicamente sem revisar chamadas internas.

---

### @Bean em classe nao Configuration

Métodos `@Bean` também podem existir em classes `@Component`.

Nesse caso, operam em semântica lite.

A aula manterá métodos bean em classes `@Configuration` para tornar a intenção explícita.

---

### Bean definition overriding

Registrar duas bean definitions com o mesmo nome gera colisão.

No Spring Boot, o padrão:

```text
spring.main.allow-bean-definition-overriding=false.
```

mantém overriding desabilitado.

Isso ajuda a detectar erro de configuração.

Não habilite overriding apenas para fazer o contexto iniciar.

Corrija:

- nome duplicado;
- import duplicado;
- configuração carregada duas vezes;
- teste com override inadequado.

---

### Nome duplicado versus tipo duplicado

São problemas diferentes.

Nome duplicado:

```text
duas definitions tentam usar o mesmo nome.
```

Tipo duplicado:

```text
duas definitions possuem tipos compatíveis,
mas nomes diferentes.
```

O primeiro pode impedir o registro.

O segundo pode ser válido, mas exige seleção quando uma dependência singular é solicitada.

---

### Multiplos candidatos

Considere:

```text
compactTextFormatter;

verboseTextFormatter.
```

Ambos implementam:

```text
TextFormatter.
```

Pedir:

```java
context.getBean(
        TextFormatter.class
);
```

é ambíguo.

O container não deve adivinhar.

Na aula 361, você resolverá com contratos explícitos, `@Primary`, `@Qualifier` e collections quando apropriado.

---

### Introspeccao do contexto

O contexto pode listar bean names e definitions.

Isso é útil para:

- diagnóstico;
- testes;
- documentação;
- arquitetura;
- análise de auto-configuração.

Não imprima milhares de beans no startup normal.

O laboratório criará um catálogo filtrado somente para:

```text
br.com.formacao.backend.beans.
```

---

### Role da bean definition

Bean definitions podem possuir role.

Exemplos conceituais:

```text
application;

support;

infrastructure.
```

Esse metadata ajuda ferramentas e leitores.

Não use role como segurança ou regra de negócio.

---

### Origin e source

Uma bean definition pode indicar origem:

- classe escaneada;
- factory method;
- auto-configuração;
- import;
- registro programático.

O relatório da aula registrará uma descrição segura da origem.

Não acople assertions a nomes internos instáveis.

---

### Bean de ConfigurationProperties

O `AppRuntimeProperties` criado na aula 359 também é administrado pelo container.

Ele entrou por:

```text
@ConfigurationPropertiesScan.
```

Isso demonstra que component scan não é a única forma de registro.

O container reúne beans de múltiplas fontes.

---

### Objetos que nao devem virar beans automaticamente

Evite registrar como singleton:

- DTO;
- request;
- response;
- command;
- result;
- entity;
- value object;
- collection temporária;
- objeto com estado por operação.

O container é adequado para colaboradores compartilhados e infraestrutura.

A fronteira será reforçada ao longo do módulo.

---

### Estado mutavel em singleton

Como singleton é compartilhado no contexto, estado mutável precisa de atenção.

Um repository em memória pode exigir:

- coleção thread-safe;
- encapsulamento;
- cópias defensivas;
- limpeza entre testes.

Nesta aula, `RuntimeMessageRepository` retornará dados imutáveis e não simulará concorrência.

Não transforme o exemplo em banco de dados improvisado.

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

Todos os testes anteriores devem permanecer verdes.

---

### 2. Criar packages

Crie:

```text
br.com.formacao.backend.beans;

br.com.formacao.backend.beans.component;

br.com.formacao.backend.beans.config;

br.com.formacao.backend.beans.external;

br.com.formacao.backend.beans.repository;

br.com.formacao.backend.beans.service.
```

Não crie packages `controller` ou `entity`.

---

### 3. Criar ApplicationIdentityComponent

```java
@Component
public class ApplicationIdentityComponent {

    public String module() {
        return "M14";
    }

    public String application() {
        return "formacao-java-backend-api";
    }
}
```

A classe não precisa de dependências.

---

### 4. Criar RuntimeMessageService

```java
@Service
public class RuntimeMessageService {

    public String roleDescription() {
        return "service";
    }
}
```

O exemplo identifica o stereotype.

A orquestração real com dependências ficará para a aula 361.

---

### 5. Criar RuntimeMessageRepository

```java
@Repository
public class RuntimeMessageRepository {

    public List<String> findAll() {
        return List.of(
                "bootstrap",
                "configuration",
                "beans"
        );
    }
}
```

Retorne lista imutável.

Não adicione banco ou exception artificial.

---

### 6. Criar ClockConfiguration

```java
@Configuration(
        proxyBeanMethods = false
)
public class ClockConfiguration {

    @Bean
    Clock applicationClock() {
        return Clock.systemUTC();
    }
}
```

O `Clock` não possui annotation Spring.

---

### 7. Criar ThirdPartyTextNormalizer

A classe ficará em:

```text
beans.external.
```

Ela não receberá stereotype.

Exemplo:

```java
public final class ThirdPartyTextNormalizer {

    public String normalize(
            String value
    ) {
        return value
                .trim()
                .toLowerCase(
                        Locale.ROOT
                );
    }
}
```

Considere-a uma classe externa ao controle do projeto.

---

### 8. Criar TextToolConfiguration

```java
@Configuration(
        proxyBeanMethods = false
)
public class TextToolConfiguration {

    @Bean({
            "runtimeTextNormalizer",
            "textNormalizer"
    })
    ThirdPartyTextNormalizer runtimeTextNormalizer() {
        return new ThirdPartyTextNormalizer();
    }
}
```

Confirme que os dois nomes apontam para a mesma instância.

---

### 9. Criar BeanDescriptor

```java
public record BeanDescriptor(
        String beanName,
        String beanType,
        String scope,
        String origin,
        boolean singleton,
        List<String> aliases
) {
}
```

Copie a lista defensivamente.

---

### 10. Criar BeanCatalogDiagnostics

Responsabilidades:

- receber o contexto apenas no bootstrap diagnóstico;
- filtrar bean names relacionados ao package da aula;
- localizar type;
- localizar bean definition quando disponível;
- ler scope;
- ler aliases;
- informar singleton;
- ordenar por nome;
- imprimir relatório curto.

Não transforme a classe em dependência de negócio.

---

### 11. Integrar o catalogo ao bootstrap

Depois do diagnóstico de configuração, imprima:

```text
BEAN CATALOG - AULA 360
```

Inclua somente:

- component;
- service;
- repository;
- configuration;
- Clock;
- text normalizer.

Não imprima todos os beans do Boot.

---

### 12. Executar a aplicacao

```powershell
.\mvnw.cmd spring-boot:run
```

Confirme no catálogo:

```text
applicationIdentityComponent;

runtimeMessageService;

runtimeMessageRepository;

clockConfiguration;

applicationClock;

textToolConfiguration;

runtimeTextNormalizer.
```

O alias pode aparecer em lista separada.

---

### 13. Validar singleton

No diagnóstico ou teste:

```java
Clock first =
        context.getBean(
                "applicationClock",
                Clock.class
        );

Clock second =
        context.getBean(
                "applicationClock",
                Clock.class
        );
```

Confirme:

```text
first == second.
```

Não generalize para objetos fora do container.

---

### 14. Criar ComponentStereotypeRegistrationIT

Use `@SpringBootTest`.

Valide:

- component presente;
- service presente;
- repository presente;
- classes possuem annotations corretas;
- cada bean é singleton;
- nomes default estão corretos;
- zero controller da aplicação.

---

### 15. Criar ExplicitBeanRegistrationIT

Valide:

- `Clock` presente;
- normalizer presente;
- classes de configuration presentes;
- `ThirdPartyTextNormalizer` não possui `@Component`;
- factory method registrou o objeto;
- normalização funciona.

---

### 16. Criar BeanNameAndAliasIT

Valide:

```text
runtimeTextNormalizer:
existe.

textNormalizer:
é alias.

mesma instância:
sim.

applicationClock:
nome default do método.
```

Use:

```java
context.getAliases(
        "runtimeTextNormalizer"
);
```

---

### 17. Criar RepositoryStereotypeMetadataTest

Por reflection, valide:

- `RuntimeMessageRepository` possui `@Repository`;
- `@Repository` é stereotype especializado;
- classe está dentro da fronteira do scan;
- método retorna dados imutáveis.

Documente que tradução real não foi simulada.

---

### 18. Criar ConfigurationProxyBehaviorTest

Use `AnnotationConfigApplicationContext`.

Crie configurações internas de teste.

Full mode:

```java
@Configuration
```

Um método bean chama outro diretamente.

Confirme que o consumer recebe a instância singleton administrada.

Lite mode:

```java
@Configuration(
        proxyBeanMethods = false
)
```

O método chama outro diretamente.

Confirme que a chamada Java cria instância distinta.

Depois, crie lite mode correto usando parameter no factory method.

Confirme que recebe o singleton administrado.

Feche todos os contextos.

---

### 19. Criar BeanDefinitionConflictIT

Use `ApplicationContextRunner`.

Carregue duas configurações que registram:

```text
formatPolicy.
```

Com overriding desabilitado, confirme que o contexto falha.

Valide a categoria da falha.

Não habilite overriding para obter teste verde.

---

### 20. Criar MultipleBeanCandidatesIT

Registre dois beans:

```text
compactTextFormatter;

verboseTextFormatter.
```

Mesmo contrato:

```text
TextFormatter.
```

Confirme:

- busca por nome funciona;
- busca por tipo singular falha por ambiguidade;
- busca de todos por tipo retorna dois.

Não resolva ainda com `@Primary` ou `@Qualifier`.

---

### 21. Criar BeanCatalogDiagnosticsIT

Valide:

- catálogo possui somente o subconjunto esperado;
- ordem é determinística;
- scope vazio é representado como singleton default;
- aliases são copiados;
- auto-configurations não aparecem;
- valores sensíveis não aparecem.

---

### 22. Inspecionar bean definitions

No teste, use:

```text
ConfigurableListableBeanFactory.
```

Para os beans da aula, registre:

- nome;
- classe;
- factory bean;
- factory method;
- role;
- scope;
- source resumida.

Não altere definitions em runtime.

---

### 23. Comparar fontes de registro

Crie tabela:

```text
ApplicationIdentityComponent:
component scan.

RuntimeMessageService:
component scan.

RuntimeMessageRepository:
component scan.

Clock:
@Bean.

ThirdPartyTextNormalizer:
@Bean.

AppRuntimeProperties:
@ConfigurationPropertiesScan.

Tomcat:
auto-configuration.
```

Essa tabela é a síntese da aula.

---

### 24. Criar documentação BeanFactory e Context

Em:

```text
bean-factory-application-context.md.
```

Compare:

- contrato básico;
- recursos adicionais;
- uso na aplicação;
- uso em diagnóstico;
- antipadrão Service Locator.

---

### 25. Criar documentação definition versus instance

Explique:

```text
definition:
metadata.

instance:
objeto.

singleton:
uma instância por definition no contexto.

alias:
outro nome para a mesma definition.
```

---

### 26. Criar stereotypes.md

Documente:

- component;
- service;
- repository;
- controller;
- configuration;
- papel arquitetural;
- comportamento que não é automático.

---

### 27. Criar component-scan-registration.md

Registre:

- package raiz;
- packages escaneados;
- classes encontradas;
- classe externa sem annotation;
- relação com aula 358.

---

### 28. Criar configuration-and-bean.md

Explique:

- factory method;
- nome default;
- alias;
- classe de terceiro;
- parameter de método;
- configuração focada.

---

### 29. Criar full-lite-configuration.md

Inclua:

- proxyBeanMethods true;
- inter-bean calls;
- proxyBeanMethods false;
- chamada Java comum;
- method parameter como alternativa;
- resultado do teste.

---

### 30. Criar bean-names-aliases-conflicts.md

Registre:

- nome default;
- nome explícito;
- alias;
- colisão;
- overriding false;
- tipo duplicado;
- ponte para seleção na aula 361.

---

### 31. Criar repository-exception-translation.md

Explique:

- papel de repository;
- stereotype;
- elegibilidade para tradução;
- necessidade de post-processor e provider;
- hierarquia DataAccessException;
- motivo de não simular tradução sem banco.

---

### 32. Criar bean-catalog-baseline.md

Registre os beans selecionados.

Inclua:

```text
nome;

tipo;

origem;

scope;

alias;

papel.
```

Não cole o catálogo completo do Boot.

---

### 33. Criar scripts

`18_executar_testes_beans.ps1`:

```powershell
Set-Location formacao-java-backend-api
.\mvnw.cmd clean test
```

`19_iniciar_catalogo_beans.ps1` inicia a aplicação e orienta a leitura do catálogo.

`20_validar_conflitos.ps1` executa somente os testes de colisão e ambiguidade.

`21_validar_escopo_aula.ps1` pesquisa controllers, endpoints, JPA e Flyway adicionados indevidamente.

---

### 34. Executar testes isolados

```powershell
.\mvnw.cmd `
  -Dtest=ComponentStereotypeRegistrationIT test

.\mvnw.cmd `
  -Dtest=ConfigurationProxyBehaviorTest test

.\mvnw.cmd `
  -Dtest=BeanDefinitionConflictIT test

.\mvnw.cmd `
  -Dtest=MultipleBeanCandidatesIT test
```

Confirme falhas esperadas como assertions, não como build quebrado.

---

### 35. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Resultado:

```text
BUILD SUCCESS.
```

Todos os contextos temporários precisam ser fechados.

---

### 36. Empacotar e executar

```powershell
.\mvnw.cmd clean package
java -jar target\*.jar `
  --spring.profiles.active=local
```

Confirme catálogo e configurações anteriores.

Encerre corretamente.

---

### 37. Revisar escopo

Confirme:

```text
controller:
zero.

endpoint:
zero.

entity:
zero.

JPA:
ausente.

Flyway:
ausente.

Security:
ausente.

constructor injection entre camadas:
não aprofundado.

lifecycle callbacks:
ausentes.
```

---

### 38. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs;
- segredos;
- arquivos temporários;
- configuração de overriding;
- packages vazios.

---

## Entendendo o que foi feito

### O container ganhou objetos com papeis claros

Component, service, repository e configuration foram distinguidos.

### O registro teve fontes diferentes

Component scan, `@Bean`, properties scan e auto-configuração coexistiram.

### Nome e tipo deixaram de ser equivalentes

Um bean possui nome, tipo e aliases.

### Full e lite mode foram comprovados

A diferença apareceu em chamadas diretas entre factory methods.

### Conflitos foram reproduzidos antes da solucao

Nomes duplicados e tipos ambíguos prepararam a aula de injeção.

---

## Erros comuns importantes

### Anotar tudo com Component

O container passa a administrar objetos que deveriam ser temporários.

### Usar Service como annotation generica

O papel arquitetural fica enganoso.

### Habilitar overriding para esconder colisao

O contexto inicia com uma decisão obscura.

### Chamar metodo bean diretamente em lite mode

Pode surgir uma instância fora do singleton administrado.

### Buscar dependencia no ApplicationContext dentro do negocio

Isso cria Service Locator e esconde o contrato.

---

## Comandos uteis

### Testes completos

```powershell
.\mvnw.cmd clean test
```

### Teste específico

```powershell
.\mvnw.cmd `
  -Dtest=ComponentStereotypeRegistrationIT test
```

### Executar

```powershell
.\mvnw.cmd spring-boot:run
```

### Package

```powershell
.\mvnw.cmd clean package
```

### Procurar stereotypes

```powershell
Get-ChildItem src -Recurse -Filter "*.java" |
  Select-String `
    -Pattern "@Component|@Service|@Repository|@Configuration|@Bean"
```

---

## Exercicio guiado

### Parte 1 — Classificacao

Classifique como bean ou objeto comum:

```text
Clock;

DTO de request;

service;

entity;

mapper compartilhado;

value object;

repository;

command.
```

Justifique.

### Parte 2 — Stereotypes

Troque temporariamente `@Service` por `@Component`.

O contexto continuará registrando.

Explique o que foi perdido semanticamente.

Restaure.

### Parte 3 — Nome

Dê nome explícito ao component.

Observe o teste falhar.

Atualize a expectativa e depois restaure a convenção oficial.

### Parte 4 — Alias

Adicione um terceiro alias.

Confirme mesma instância.

Remova antes do commit.

### Parte 5 — Full e lite

Crie um segundo exemplo de inter-bean call.

Compare com method parameter.

### Parte 6 — Colisao

Crie duas configurações com mesmo nome de bean.

Confirme falha e remova o conflito da produção.

### Parte 7 — Tipo ambiguo

Registre três formatters.

Liste todos por tipo.

Não escolha um automaticamente.

### Parte 8 — ADR

Registre:

```text
stereotypes por papel;

@Bean para terceiros;

proxyBeanMethods false quando independente;

method parameter em lite mode;

overriding desabilitado;

sem Service Locator;

DTOs e entities fora do container.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 359 foi preservada;
- o mesmo projeto foi continuado;
- IoC foi revisado;
- bean foi definido;
- BeanFactory foi explicado;
- ApplicationContext foi explicado;
- BeanFactory não foi usado como Service Locator;
- bean definition foi explicada;
- definition foi diferenciada de instance;
- metadata foi explicada;
- nome de bean foi explicado;
- nome default de component foi validado;
- nome default de método bean foi validado;
- nome explícito foi explicado;
- alias foi criado;
- alias apontou para a mesma instância;
- tipo de bean foi explicado;
- busca por tipo foi testada;
- singleton default foi validado;
- singleton foi limitado ao contexto;
- lifecycle detalhado não foi antecipado;
- component scan foi reutilizado;
- package raiz foi preservado;
- `@Component` foi usado;
- papel genérico de component foi explicado;
- `@Service` foi usado;
- papel de service foi explicado;
- service não recebeu transação automática por stereotype;
- `@Repository` foi usado;
- papel de repository foi explicado;
- tradução de exceptions foi explicada;
- tradução falsa sem provider não foi simulada;
- `@Controller` foi reconhecido sem criação;
- stereotypes foram usados semanticamente;
- `@Configuration` foi usada;
- configuration foi tratada como fonte de definitions;
- configurações permaneceram focadas;
- `@Bean` foi usado;
- factory method foi explicado;
- `Clock` foi registrado por bean;
- classe de terceiro foi registrada por bean;
- classe de terceiro não recebeu annotation Spring;
- lógica de factory permaneceu pequena;
- parameters de factory method foram apresentados;
- constructor injection entre camadas não foi aprofundado;
- full configuration foi explicada;
- `proxyBeanMethods=true` foi explicado;
- inter-bean call foi interceptada;
- lite configuration foi explicada;
- `proxyBeanMethods=false` foi usado;
- chamada direta em lite mode foi testada;
- method parameter foi usado no lite mode correto;
- `@Bean` em component foi mencionado;
- bean overriding foi explicado;
- overriding permaneceu false;
- nome duplicado gerou falha controlada;
- overriding não foi habilitado;
- nome duplicado foi diferenciado de tipo duplicado;
- múltiplos beans do mesmo tipo foram registrados;
- busca singular por tipo falhou por ambiguidade;
- busca de todos por tipo funcionou;
- `@Primary` não foi aprofundado;
- `@Qualifier` não foi aprofundado;
- introspecção foi feita;
- catálogo foi filtrado;
- todos os beans do Boot não foram impressos;
- role foi explicado;
- origin foi explicada;
- assertions não dependeram de detalhes internos instáveis;
- bean de configuration properties foi reconhecido;
- fontes de registro foram comparadas;
- DTO não virou singleton;
- entity não virou singleton;
- value object não virou singleton;
- estado mutável compartilhado foi evitado;
- ApplicationIdentityComponent foi criado;
- RuntimeMessageService foi criado;
- RuntimeMessageRepository foi criado;
- ClockConfiguration foi criada;
- TextToolConfiguration foi criada;
- ThirdPartyTextNormalizer foi criado;
- BeanDescriptor foi criado;
- BeanCatalogDiagnostics foi criado;
- ComponentStereotypeRegistrationIT foi criado;
- ExplicitBeanRegistrationIT foi criado;
- BeanNameAndAliasIT foi criado;
- RepositoryStereotypeMetadataTest foi criado;
- ConfigurationProxyBehaviorTest foi criado;
- BeanDefinitionConflictIT foi criado;
- MultipleBeanCandidatesIT foi criado;
- BeanCatalogDiagnosticsIT foi criado;
- contextos temporários foram fechados;
- falhas esperadas não quebraram o build;
- documentação BeanFactory versus Context foi criada;
- documentação definition versus instance foi criada;
- stereotypes foram documentados;
- component scan foi documentado;
- configuration e bean foram documentados;
- full e lite foram documentados;
- nomes, aliases e conflitos foram documentados;
- repository translation foi documentada;
- baseline do catálogo foi criada;
- scripts foram criados;
- testes isolados passaram;
- suite completa passou;
- package passou;
- aplicação executou;
- profiles anteriores continuaram funcionando;
- nenhum controller foi criado;
- nenhum endpoint foi criado;
- nenhum banco foi adicionado;
- JPA não foi adicionado;
- Flyway não foi adicionado;
- Security não foi adicionada;
- Validation não foi adicionada;
- lifecycle callbacks não foram antecipados;
- aula 361 não foi antecipada;
- ponte para a aula 361 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

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
git commit -m "feat(m14): registrar beans e stereotypes no contexto"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- configuração de overriding;
- testes temporários;
- classes de conflito em produção.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou quais objetos entram no Spring container e por quais mecanismos.

O mapa consolidado ficou:

```text
BeanFactory:
contrato básico.

ApplicationContext:
container completo.

Bean definition:
metadata.

Bean instance:
objeto administrado.

@Component:
papel genérico.

@Service:
serviço.

@Repository:
acesso a dados.

@Configuration:
fonte de definitions.

@Bean:
factory method.

component scan:
descoberta.

alias:
nome alternativo.

singleton:
uma instância por contexto.

full mode:
inter-bean call interceptada.

lite mode:
chamada Java comum.
```

Você comprovou:

```text
component registrado;

service registrado;

repository registrado;

Clock registrado explicitamente;

classe de terceiro registrada explicitamente;

alias apontando para o mesmo singleton;

nome duplicado impedindo startup;

tipo duplicado tornando busca singular ambígua;

catálogo filtrado por aplicação.
```

A decisão central foi:

```text
um objeto deve virar bean
quando existe uma razao para o container
administrar sua criacao, identidade e colaboracao.
```

A próxima aula será:

```text
361 - M14.06 - Injecao de dependencia constructor injection
```

Nela, você continuará no mesmo projeto e estudará:

- dependency injection;
- dependência obrigatória;
- constructor injection;
- construtor único;
- `@Autowired`;
- field injection;
- setter injection;
- imutabilidade;
- testabilidade;
- `final`;
- múltiplos candidatos;
- `@Primary`;
- `@Qualifier`;
- custom qualifier;
- collections de beans;
- `Optional`;
- `ObjectProvider`;
- dependência circular;
- falha rápida;
- composição entre component, service e repository;
- testes unitários sem contexto;
- testes de wiring.

A aula 360 respondeu:

```text
quais objetos o container administra
e como eles são registrados?
```

A aula 361 responderá:

```text
como esses beans recebem
suas dependencias de forma explicita e testavel?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar bean definition de instância.
- [ ] Sei escolher stereotype pelo papel.
- [ ] Sei quando usar `@Bean`.
- [ ] Sei explicar full e lite configuration.
- [ ] Sei diagnosticar colisão de nome e ambiguidade de tipo.

---

## Troubleshooting adicional

### Component nao aparece

Revise package, scan e annotation.

### Bean method nao aparece

Revise se a configuration entrou no contexto.

### Alias cria objeto diferente

Revise se foram criadas duas definitions em vez de alias.

### Contexto falha por nome duplicado

Localize as duas fontes; não habilite overriding automaticamente.

### Busca por tipo falha

Existem múltiplos candidatos; prepare a seleção explícita da aula 361.

### Lite mode cria instancia extra

Pare de chamar outro método bean diretamente e use parâmetro.

---

## Perguntas de revisao

1. O que é um bean?
2. O que é BeanFactory?
3. O que ApplicationContext adiciona?
4. O que é bean definition?
5. Definition e instance são iguais?
6. Qual é o nome default de component?
7. Qual é o nome default de `@Bean`?
8. Alias cria outra instância?
9. Qual é o scope default?
10. O que faz `@Component`?
11. O que comunica `@Service`?
12. O que comunica `@Repository`?
13. O que faz `@Configuration`?
14. Quando usar `@Bean`?
15. O que é full mode?
16. O que muda em lite mode?
17. O que ocorre com nome duplicado?
18. O que ocorre com tipos duplicados?
19. Devemos buscar beans no contexto dentro do negócio?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Objeto administrado pelo container.
2. Contrato básico do container.
3. Environment, eventos, resources e infraestrutura.
4. Metadata de criação e gestão.
5. Não.
6. Nome da classe decapitalizado.
7. Nome do método.
8. Não.
9. Singleton.
10. Marca componente genérico.
11. Papel de serviço.
12. Papel de acesso a dados.
13. Declara fonte de bean definitions.
14. Para factory explícita ou classe de terceiro.
15. Chamadas entre bean methods são interceptadas.
16. Chamadas diretas são Java comum.
17. O contexto pode falhar.
18. Busca singular por tipo fica ambígua.
19. Não.
20. Injeção de dependência por construtor.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 360 - M14.05 - Beans Component Service Repository Configuration

- Continuei no projeto `formacao-java-backend-api`.
- Revisei Inversion of Control.
- Defini o conceito de bean.
- Diferenciei `BeanFactory` de `ApplicationContext`.
- Diferenciei bean definition de bean instance.
- Entendi nome, tipo, alias e scope.
- Validei singleton por contexto.
- Reutilizei o component scan do package raiz.
- Criei `ApplicationIdentityComponent`.
- Usei `@Component` para papel genérico.
- Criei `RuntimeMessageService`.
- Usei `@Service` com semântica de serviço.
- Criei `RuntimeMessageRepository`.
- Usei `@Repository` com semântica de acesso a dados.
- Entendi a elegibilidade para exception translation.
- Não simulei tradução sem provider de persistência.
- Criei `ClockConfiguration`.
- Registrei `Clock` com `@Bean`.
- Criei `ThirdPartyTextNormalizer` sem annotation Spring.
- Registrei classe de terceiro com `@Bean`.
- Criei alias para o normalizer.
- Confirmei mesma instância por alias.
- Entendi o nome default dos beans.
- Entendi factory methods.
- Comparei full e lite configuration.
- Entendi `proxyBeanMethods`.
- Testei inter-bean calls.
- Usei parâmetro de método no lite mode correto.
- Mantive bean overriding desabilitado.
- Reproduzi colisão de nome.
- Reproduzi ambiguidade de tipo.
- Não antecipei `@Primary` e `@Qualifier`.
- Criei catálogo filtrado de beans.
- Comparei component scan, `@Bean`, properties scan e auto-configuration.
- Evitei transformar DTOs, entities e value objects em singletons.
- Mantive controllers e endpoints fora do escopo.
- Próxima aula: Injecao de dependencia constructor injection.
```

---

## Referencia tecnica curta

```text
Bean:
objeto administrado.

Definition:
metadata.

Context:
container.

Component:
genérico.

Service:
aplicação.

Repository:
dados.

Configuration:
definitions.

Bean method:
factory.

Alias:
mesma instância.

Singleton:
por contexto.
```

Regra final:

```text
beans Spring devem representar colaboradores e infraestrutura que realmente precisam ser administrados pelo container; component scan registra classes proprias por stereotypes, metodos Bean registram factories e classes de terceiros, nomes e tipos precisam permanecer inequivocos, configuracoes full e lite devem ser usadas conscientemente, overriding deve continuar desabilitado e objetos temporarios de dominio nao devem ser transformados em singletons apenas por conveniencia.
```
