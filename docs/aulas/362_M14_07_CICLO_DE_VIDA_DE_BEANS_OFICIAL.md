# 362 - M14.07 - Ciclo de vida de beans

## Apresentacao da aula

Na aula 361, você conectou os beans do projeto por meio de Dependency Injection.

A composição principal passou a ser:

```text
RuntimeMessageService
    -> RuntimeMessageRepository
    -> RuntimeMessageFormatter
    -> Clock.
```

Você adotou:

- constructor injection;
- construtor único;
- campos `private final`;
- `@Primary`;
- `@Qualifier`;
- qualifier customizado;
- collections ordenadas;
- `Optional`;
- `ObjectProvider`;
- testes unitários sem contexto;
- falha rápida para dependências ausentes;
- redesign de dependências circulares.

Agora surge uma nova pergunta:

```text
depois que a bean definition existe
e as dependencias foram resolvidas,
em que ordem o container cria,
inicializa, disponibiliza e destroi o bean?
```

Essa pergunta define o ciclo de vida de beans.

O ciclo não é apenas:

```text
new objeto();
```

Para um singleton Spring, uma visão simplificada é:

```text
bean definition registrada;

bean instanciado;

dependencias resolvidas;

callbacks Aware;

BeanPostProcessor antes da inicializacao;

@PostConstruct;

InitializingBean.afterPropertiesSet;

init method;

BeanPostProcessor depois da inicializacao;

bean pronto para uso;

callbacks globais depois dos singletons;

uso;

encerramento do contexto;

@PreDestroy;

DisposableBean.destroy;

destroy method.
```

Nem todo bean utiliza todas essas etapas.

A maioria dos beans de aplicação deve usar apenas o necessário.

O laboratório combinará vários mecanismos em uma classe didática para comprovar a ordem.

Isso não significa que todo bean de produção deve implementar cinco interfaces e três callbacks.

O padrão recomendado para código moderno será:

```text
constructor:
dependencias obrigatorias.

@PostConstruct:
validacao ou preparacao pequena quando realmente necessaria.

@PreDestroy:
liberacao de recurso administrado pelo bean.
```

Interfaces específicas do Spring, como:

```text
InitializingBean;

DisposableBean;

BeanNameAware;

ApplicationContextAware;
```

serão estudadas para que você entenda o container.

Elas não serão adotadas indiscriminadamente porque acoplam a classe ao framework.

Também serão estudados:

- `BeanFactoryPostProcessor`;
- `BeanPostProcessor`;
- `SmartInitializingSingleton`;
- `Lifecycle`;
- `SmartLifecycle`;
- singleton eager;
- lazy initialization;
- `@Lazy`;
- propriedade global de lazy initialization;
- scope prototype;
- destruição de prototype;
- inferência de `close()` e `shutdown()`;
- shutdown hook;
- encerramento gracioso;
- ordem e phase de lifecycle;
- falhas durante inicialização;
- liberação de recursos.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

O laboratório criará um subsistema de observação:

```text
LifecycleEventRecorder.
```

Ele registrará eventos somente dos beans didáticos desta aula.

A aplicação não imprimirá o ciclo completo de todos os beans do Spring Boot.

Esse cuidado evita:

- logs gigantes;
- dependência de detalhes internos;
- testes frágeis;
- exposição de dados;
- ruído operacional.

O bean principal do experimento será:

```text
ManagedResourceClient.
```

Ele simulará um cliente de recurso externo.

Não haverá chamada HTTP, banco ou thread real.

O bean registrará:

- construção;
- nome recebido;
- contexto recebido;
- post-processing antes;
- `@PostConstruct`;
- `afterPropertiesSet`;
- init customizado;
- post-processing depois;
- uso;
- `@PreDestroy`;
- `destroy`;
- destroy customizado.

Um segundo bean demonstrará:

```text
SmartInitializingSingleton.
```

Ele será chamado depois que todos os singletons não lazy estiverem instanciados.

Um terceiro demonstrará:

```text
SmartLifecycle.
```

Ele participará do start e stop do contexto sem criar trabalho real em background.

O laboratório também criará:

```text
LazyLifecycleProbe;

PrototypeLifecycleProbe;

AutoCloseableChannel.
```

Esses objetos permitirão comprovar diferenças entre:

- singleton eager;
- singleton lazy;
- prototype;
- recurso com destroy method inferido.

Nesta aula, não serão criados:

- controller;
- endpoint;
- request;
- response;
- DTO web;
- banco;
- JPA;
- Flyway;
- Security;
- Actuator;
- cache.

A próxima aula será:

```text
363 - M14.08 - Controller REST primeiros endpoints
```

Portanto, esta aula encerra a fundação inicial do container antes da entrada na camada HTTP.

---

## Onde estamos na formacao

A sequência do M14 chegou a:

```text
356:
visão geral.

357:
Initializr e estrutura.

358:
Main Application e auto configuration.

359:
properties, YAML e profiles.

360:
beans e formas de registro.

361:
constructor injection.

362:
ciclo de vida de beans.

363:
primeiros controllers REST.

364:
HTTP e REST de verdade.
```

A aula 361 respondeu:

```text
como os beans recebem dependencias?
```

A aula 362 responderá:

```text
quando cada etapa do bean acontece
e quem libera seus recursos?
```

Nesta aula:

```text
definition:
sim.

instantiation:
sim.

dependency population:
sim.

Aware callbacks:
sim.

BeanPostProcessor:
sim.

@PostConstruct:
sim.

InitializingBean:
sim.

init method:
sim.

@Post-processing final:
sim.

SmartInitializingSingleton:
sim.

Lifecycle:
sim.

SmartLifecycle:
sim.

@PreDestroy:
sim.

DisposableBean:
sim.

destroy method:
sim.

singleton eager:
sim.

@Lazy:
sim.

prototype:
sim.

shutdown:
sim.

controller:
não.

endpoint:
não.

HTTP:
não.
```

O objetivo é conseguir responder:

```text
o bean ja foi construido?

as dependencias ja chegaram?

o callback ocorre antes ou depois do proxy?

o bean esta pronto para outros objetos?

a aplicacao ja terminou o startup?

o container chamara destroy?

o scope participa da destruicao?

o recurso sera liberado no shutdown?

uma falha aparecera no startup ou somente no primeiro uso?
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/backend/beans/lifecycle
├── AutoCloseableChannel.java
├── LifecycleEvent.java
├── LifecycleEventRecorder.java
├── LifecycleInstrumentationConfiguration.java
├── LifecycleTracingBeanPostProcessor.java
├── ManagedResourceClient.java
├── ManagedResourceConfiguration.java
├── SingletonReadinessProbe.java
├── SmartLifecycleWorker.java
├── TraceLifecycle.java
├── lazy
│   └── LazyLifecycleProbe.java
└── prototype
    ├── PrototypeLifecycleProbe.java
    └── PrototypeLifecycleService.java
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── LifecycleCallbackOrderIT.java
├── BeanPostProcessorLifecycleTest.java
├── SingletonReadinessIT.java
├── SmartLifecycleIT.java
├── LazyInitializationIT.java
├── GlobalLazyInitializationTest.java
├── PrototypeScopeIT.java
├── PrototypeDestructionIT.java
├── DestroyMethodInferenceIT.java
├── LifecycleFailureIT.java
├── LifecycleArchitectureTest.java
└── GracefulShutdownIT.java
```

Documentação externa:

```text
docs
├── bean-lifecycle-phases.md
├── aware-callbacks.md
├── bean-post-processors.md
├── initialization-callbacks.md
├── destruction-callbacks.md
├── smart-initializing-singleton.md
├── lifecycle-smart-lifecycle.md
├── eager-lazy-initialization.md
├── singleton-prototype.md
├── graceful-shutdown.md
└── lifecycle-baseline.md
```

Scripts:

```text
scripts
├── 27_executar_testes_lifecycle.ps1
├── 28_iniciar_lifecycle_lab.ps1
├── 29_validar_lazy.ps1
├── 30_validar_prototype.ps1
├── 31_validar_shutdown.ps1
└── 32_validar_escopo_pre_rest.ps1
```

Resultados esperados:

```text
ManagedResourceClient:
singleton.

construtor:
primeiro evento do bean.

Aware:
antes dos callbacks de inicializacao.

BeanPostProcessor before:
antes de @PostConstruct.

ordem de init:
@PostConstruct
-> afterPropertiesSet
-> customInit.

BeanPostProcessor after:
depois dos callbacks.

SingletonReadinessProbe:
depois dos singletons regulares.

SmartLifecycleWorker:
start e stop controlados.

LazyLifecycleProbe:
nao criado no startup normal.

primeiro getBean:
cria o lazy.

PrototypeLifecycleProbe:
nova instancia por solicitacao.

prototype @PostConstruct:
executado.

prototype @PreDestroy:
nao executado pelo container.

AutoCloseableChannel:
close inferido no shutdown.

ordem de destroy:
@PreDestroy
-> DisposableBean.destroy
-> customDestroy.

contexto:
fechado sem recurso pendente.

controller:
zero.

endpoint:
zero.
```

---

## Conceito essencial

### Bean definition antes da instancia

O container começa com metadata.

A bean definition descreve:

- classe;
- factory method;
- scope;
- lazy;
- dependencies;
- init method;
- destroy method;
- qualifiers;
- source.

Nesse momento, o objeto pode ainda não existir.

Essa diferença permite que post-processors alterem metadata antes da instanciação.

---

### BeanFactoryPostProcessor

`BeanFactoryPostProcessor` atua sobre bean definitions antes da criação normal dos beans.

Ele pode ler ou alterar metadata, mas não deve obter beans comuns, pois `getBean()` nessa fase pode causar instanciação prematura.

O mecanismo será observado apenas em teste isolado.

---

### Instanciacao

Depois da preparação das definitions, o container cria o bean.

Para constructor injection:

1. seleciona construtor;
2. resolve parâmetros;
3. cria dependências necessárias;
4. chama o construtor.

O construtor deve deixar o objeto estruturalmente válido.

Ele não deve iniciar processamento longo.

---

### Dependency population

Em constructor injection, as dependências obrigatórias chegam na construção.

Fields ou setters anotados, quando existentes, são processados depois da instância bruta.

Como o projeto proibiu field injection, o laboratório mantém contratos principais no construtor.

A fase ainda existe porque o container e bibliotecas podem usar outros pontos de injeção.

---

### Aware callbacks

Interfaces `Aware` permitem que o bean receba detalhes do container.

Exemplos:

```text
BeanNameAware;

BeanFactoryAware;

ApplicationContextAware;

EnvironmentAware.
```

O `ManagedResourceClient` usará:

```text
BeanNameAware;

ApplicationContextAware.
```

Ele registrará os eventos recebidos.

Essas interfaces acoplam a classe ao Spring.

Use apenas quando o bean realmente precisa da infraestrutura.

Não use `ApplicationContextAware` para procurar dependências de negócio.

---

### BeanPostProcessor

`BeanPostProcessor` atua sobre instâncias.

Possui dois pontos principais:

```text
postProcessBeforeInitialization;

postProcessAfterInitialization.
```

O primeiro acontece antes dos callbacks de inicialização.

O segundo acontece depois.

Um post-processor pode:

- inspecionar;
- alterar;
- substituir;
- envolver em proxy;
- processar annotations.

Diversos recursos do Spring dependem desse mecanismo.

O laboratório criará um post-processor filtrado pela annotation:

```text
@TraceLifecycle.
```

Ele retornará a mesma referência.

Não criará proxy.

---

### Registro correto de post-processor

Post-processors precisam existir cedo.

Quando declarados por `@Bean`, o método deve expor claramente o tipo de post-processor.

O laboratório usará um método:

```java
@Bean
static LifecycleTracingBeanPostProcessor
        lifecycleTracingBeanPostProcessor(...) {
}
```

O método será `static` e terá dependências mínimas.

Isso reduz risco de criar a classe de configuração e outros beans cedo demais.

---

### @PostConstruct

`@PostConstruct` executa depois que as dependências foram fornecidas.

É adequado para:

- validar configuração;
- preparar estrutura interna pequena;
- calcular cache local simples;
- confirmar invariantes.

Não é adequado para:

- migração demorada;
- chamada externa longa;
- processamento assíncrono pesado;
- acesso indiscriminado a outros beans;
- trabalho que pode gerar deadlock durante a criação de singleton.

O bean só é considerado totalmente inicializado depois que os callbacks terminam.

---

### InitializingBean

A interface:

```java
InitializingBean
```

define:

```java
afterPropertiesSet().
```

Ela permite inicialização depois das propriedades.

A desvantagem é o acoplamento ao Spring.

A documentação oficial recomenda preferir `@PostConstruct` ou método customizado quando possível.

Ela será usada apenas no bean didático para comprovar a ordem.

---

### Init method customizado

Um método POJO pode ser configurado:

```java
@Bean(
        initMethod = "customInit"
)
```

A classe não precisa conhecer o Spring.

Essa opção é útil para:

- classe de terceiro;
- infraestrutura existente;
- API que já possui método de inicialização.

O método deve ser sem argumentos.

---

### Ordem de inicializacao

Quando mecanismos diferentes usam métodos diferentes, a ordem é:

```text
1. @PostConstruct;

2. InitializingBean.afterPropertiesSet;

3. init method customizado.
```

Antes deles, o post-processor executa o callback `before`.

Depois deles, executa o callback `after`.

O teste validará a sequência completa do bean didático.

---

### Bean pronto e proxy

Depois dos callbacks de inicialização, post-processors podem retornar uma referência diferente, como um proxy.

Por isso, o objeto publicado no contexto pode não ser a referência bruta original.

AOP, transações e outros recursos usam proxies em diversos cenários.

O laboratório não criará um proxy manual.

Ele apenas registrará o ponto em que isso poderia ocorrer.

---

### SmartInitializingSingleton

`SmartInitializingSingleton` possui:

```text
afterSingletonsInstantiated.
```

Esse callback ocorre depois que os singletons regulares não lazy foram criados.

Ele é adequado para:

- validação entre singletons;
- preparação que exige todos os colaboradores;
- registro final de infraestrutura;
- atividade pós-instanciação sem permanecer dentro do lock individual de criação.

O `SingletonReadinessProbe` registrará esse momento.

Não use o callback para trabalho externo demorado.

---

### ApplicationReadyEvent

`ApplicationReadyEvent` pertence ao ciclo da aplicação Boot, não ao callback de um único bean.

A aula diferencia os momentos.

---

### Lifecycle

A interface `Lifecycle` representa componentes que podem:

- iniciar;
- parar;
- informar se estão executando.

Ela é útil para recursos ativos.

Exemplos:

- consumidor;
- scheduler customizado;
- conector;
- worker.

Um serviço comum sem processamento ativo não precisa implementá-la.

---

### SmartLifecycle

`SmartLifecycle` amplia `Lifecycle`.

Ela permite:

- auto startup;
- phase;
- stop com callback;
- coordenação de ordem.

O `SmartLifecycleWorker` não abrirá thread real.

Ele apenas registrará:

- start;
- stop;
- running;
- phase.

Isso mantém o laboratório determinístico.

---

### Phase

A phase controla ordem relativa.

Regra conceitual:

```text
startup:
menor phase primeiro.

shutdown:
maior phase primeiro.
```

Use phase somente quando componentes ativos possuem dependências de ordem.

Números arbitrários sem documentação criam confusão.

O laboratório usará uma constante nomeada.

---

### Singleton eager

Por padrão, singletons não lazy de um `ApplicationContext` são pré-instanciados durante o startup.

Benefícios:

- falha rápida;
- startup comprova wiring;
- problemas aparecem antes de receber tráfego;
- latência não é transferida ao primeiro uso.

Essa é a escolha oficial do projeto.

---

### @Lazy

`@Lazy` adia a criação até a primeira solicitação.

Pode ser aplicado a:

- bean;
- component;
- configuration;
- ponto de injeção.

O `LazyLifecycleProbe` será marcado como lazy.

Seu construtor não deverá aparecer no startup base.

Ao chamar:

```java
context.getBean(
        LazyLifecycleProbe.class
);
```

ele será criado e inicializado.

---

### Lazy global

Spring Boot permite lazy initialization global.

Quando ativado, muitos beans são criados sob demanda.

Isso pode reduzir tempo de startup, mas também pode atrasar uma falha até a primeira requisição ou uso.

O projeto não ativará globalmente:

```text
spring.main.lazy-initialization=true.
```

A opção será testada em contexto isolado.

A baseline de produção continuará eager.

---

### Lazy nao corrige dependencia circular

`@Lazy` pode mudar o momento de resolução.

Ele não transforma um design circular em um design saudável.

A regra da aula 361 permanece:

```text
ciclo exige redesign.
```

---

### Scope singleton

Singleton significa uma instância por bean definition em cada contexto.

O container administra criação, inicialização, uso compartilhado e destruição no fechamento correto.

---

### Scope prototype

Prototype cria uma nova instância a cada solicitação ao container.

Exemplo:

```java
@Scope(
        ConfigurableBeanFactory.SCOPE_PROTOTYPE
)
```

O container:

- instancia;
- injeta;
- inicializa;
- entrega ao cliente.

Depois da entrega, ele não mantém o lifecycle completo daquela instância.

---

### Destruicao de prototype

Callbacks de inicialização são executados para prototypes.

Callbacks de destruição configurados não são chamados automaticamente pelo container.

O cliente que recebe o prototype deve liberar recursos caros que ele possuir.

Por isso, prototype não deve ser usado descuidadamente para objetos que abrem recursos.

O teste validará:

```text
@PostConstruct:
sim.

@PreDestroy no close do contexto:
não.
```

Depois fará limpeza explícita da fixture.

---

### Prototype injetado em singleton

Se um prototype é injetado diretamente no construtor de um singleton, a resolução acontece durante a criação do singleton.

O singleton recebe uma única instância.

Para obter uma nova instância a cada operação, use um mecanismo como:

```text
ObjectProvider<PrototypeLifecycleProbe>.
```

O `PrototypeLifecycleService` usará provider de forma restrita para criar prototypes.

---

### @PreDestroy

`@PreDestroy` executa quando o container destrói um singleton administrado.

É apropriado para:

- fechar recurso;
- parar worker;
- liberar handle;
- remover registro;
- flush final controlado.

O método deve ser:

- idempotente quando possível;
- rápido;
- tolerante a shutdown parcial;
- incapaz de depender de tráfego novo.

---

### DisposableBean

A interface:

```text
DisposableBean
```

define:

```text
destroy().
```

Assim como `InitializingBean`, acopla a classe ao Spring.

Ela será usada somente no bean didático.

Para código moderno, prefira `@PreDestroy`, `AutoCloseable` ou destroy method customizado.

---

### Destroy method customizado

Configure:

```java
@Bean(
        destroyMethod = "customDestroy"
)
```

A opção serve para classes próprias ou de terceiros.

Ela permite integrar lifecycle sem alterar a classe com annotation Spring.

---

### Ordem de destruicao

Quando mecanismos diferentes apontam para métodos diferentes, a ordem é:

```text
1. @PreDestroy;

2. DisposableBean.destroy;

3. destroy method customizado.
```

O teste fechará o contexto explicitamente e validará essa ordem.

---

### Inferencia de close e shutdown

Em Java configuration, Spring pode inferir métodos públicos:

```text
close;

shutdown.
```

Também reconhece implementações compatíveis com:

```text
AutoCloseable;

Closeable.
```

O `AutoCloseableChannel` será registrado por `@Bean`.

Ao fechar o contexto, seu método `close()` será chamado.

Se for necessário impedir a inferência, use:

```java
@Bean(
        destroyMethod = ""
)
```

Não desative sem motivo.

---

### Shutdown hook

Spring Boot registra shutdown hook para fechar o contexto no encerramento normal da JVM.

`Ctrl+C` e término controlado permitem callbacks de destruição; finalização forçada pode impedir a limpeza.

---

### Falha durante inicializacao

Se um callback lançar exception, o bean não fica pronto e o contexto pode falhar.

Uma fixture isolada falhará em `@PostConstruct`; ela não entrará no runtime oficial.

---

### Destruicao idempotente

Um recurso deve tolerar inicialização parcial, estado já fechado e shutdown incompleto.

O laboratório validará que `close()` não duplica efeito.

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

Todos os testes anteriores precisam continuar verdes.

---

### 2. Criar TraceLifecycle

Crie annotation:

```java
@Target(
        ElementType.TYPE
)
@Retention(
        RetentionPolicy.RUNTIME
)
public @interface TraceLifecycle {
}
```

Ela não registra bean.

Ela apenas marca beans que o post-processor deve observar.

---

### 3. Criar LifecycleEvent

```java
public record LifecycleEvent(
        long sequence,
        String beanName,
        String phase,
        String detail
) {
}
```

O evento não é bean.

---

### 4. Criar LifecycleEventRecorder

Use uma coleção thread-safe e contador monotônico.

Operações:

```text
record;

snapshot;

phasesFor;

clear.
```

O snapshot deve ser imutável.

Não exponha a coleção interna.

---

### 5. Criar LifecycleTracingBeanPostProcessor

Implemente:

```text
BeanPostProcessor.
```

No callback before:

- verifique `@TraceLifecycle`;
- registre `BPP_BEFORE_INITIALIZATION`;
- retorne o bean.

No callback after:

- registre `BPP_AFTER_INITIALIZATION`;
- retorne o bean.

Não altere referência.

Não inspecione todos os beans.

---

### 6. Criar LifecycleInstrumentationConfiguration

Use:

```java
@Configuration(
        proxyBeanMethods = false
)
```

Registre o post-processor com método:

```java
@Bean
static LifecycleTracingBeanPostProcessor
        lifecycleTracingBeanPostProcessor(
                LifecycleEventRecorder recorder
        ) {
}
```

Se a dependência no método estático causar criação antecipada indesejada no seu experimento, use uma estratégia de registro que preserve a detecção precoce e documente a decisão.

Valide ausência de warning de bean não elegível para post-processing.

---

### 7. Criar ManagedResourceClient

A classe:

- recebe recorder no construtor;
- implementa `BeanNameAware`;
- implementa `ApplicationContextAware`;
- implementa `InitializingBean`;
- implementa `DisposableBean`;
- recebe `@TraceLifecycle`;
- possui `@PostConstruct`;
- possui `@PreDestroy`;
- possui `customInit`;
- possui `customDestroy`;
- possui método `use`.

Cada etapa registra um phase diferente.

Não abra recurso real.

---

### 8. Criar ManagedResourceConfiguration

Registre:

```java
@Bean(
        initMethod = "customInit",
        destroyMethod = "customDestroy"
)
ManagedResourceClient managedResourceClient(
        LifecycleEventRecorder recorder
) {
    return new ManagedResourceClient(
            recorder
    );
}
```

O bean name será:

```text
managedResourceClient.
```

---

### 9. Criar SingletonReadinessProbe

Implemente:

```text
SmartInitializingSingleton.
```

No callback, registre:

```text
AFTER_SINGLETONS_INSTANTIATED.
```

Confirme que ocorre depois de:

```text
BPP_AFTER_INITIALIZATION
do ManagedResourceClient.
```

---

### 10. Criar SmartLifecycleWorker

Implemente:

```text
SmartLifecycle.
```

Use estado atômico.

Defina:

```text
isAutoStartup:
true.

phase:
100.
```

No start:

```text
running = true;
record START.
```

No stop:

```text
running = false;
record STOP.
```

No stop com callback:

1. pare;
2. execute callback.

Não abra thread.

---

### 11. Criar LazyLifecycleProbe

Use:

```java
@Component
@Lazy
@TraceLifecycle
```

Registre construção e `@PostConstruct`.

Não implemente destruição desnecessária.

---

### 12. Criar PrototypeLifecycleProbe

Use:

```java
@Component
@Scope(
        ConfigurableBeanFactory.SCOPE_PROTOTYPE
)
@TraceLifecycle
```

Cada instância recebe um UUID.

Registre:

- constructor;
- `@PostConstruct`;
- `@PreDestroy`;
- cleanup manual.

O cleanup manual não deve ser `@PreDestroy`.

---

### 13. Criar PrototypeLifecycleService

Receba:

```text
ObjectProvider<PrototypeLifecycleProbe>.
```

Método:

```text
createProbe.
```

Cada chamada retorna uma instância nova.

Mantenha o provider limitado a esse factory de prototype.

---

### 14. Criar AutoCloseableChannel

Implemente:

```text
AutoCloseable.
```

Use contador de close.

O método `close()` deve ser idempotente.

Não anote a classe.

---

### 15. Registrar AutoCloseableChannel

Em configuration:

```java
@Bean
AutoCloseableChannel autoCloseableChannel() {
    return new AutoCloseableChannel();
}
```

Não declare `destroyMethod`.

O laboratório deve comprovar a inferência.

---

### 16. Integrar relatório ao bootstrap

Com profile:

```text
lifecycle-lab.
```

Imprima somente o snapshot dos beans da aula.

Não ative o profile por padrão.

Adicione:

```text
application-lifecycle-lab.yaml
```

apenas com logging do package da aula.

Não altere profiles anteriores.

---

### 17. Criar LifecycleCallbackOrderIT

Inicie contexto isolado com as configurações do laboratório.

Valide ordem:

```text
CONSTRUCTOR;

BEAN_NAME_AWARE;

APPLICATION_CONTEXT_AWARE;

BPP_BEFORE_INITIALIZATION;

POST_CONSTRUCT;

AFTER_PROPERTIES_SET;

CUSTOM_INIT;

BPP_AFTER_INITIALIZATION.
```

Não inclua eventos globais na comparação do bean.

---

### 18. Validar ordem de destruicao

No mesmo teste ou em teste separado:

1. capture o contexto;
2. confirme bean pronto;
3. feche contexto;
4. valide:

```text
PRE_DESTROY;

DISPOSABLE_BEAN_DESTROY;

CUSTOM_DESTROY.
```

Confirme que cada callback ocorreu uma vez.

---

### 19. Criar BeanPostProcessorLifecycleTest

Use `AnnotationConfigApplicationContext`.

Valide:

- post-processor registrado cedo;
- before antes de init;
- after depois de init;
- bean retornado é utilizável;
- post-processor não observa bean não marcado;
- contexto fecha.

---

### 20. Criar SingletonReadinessIT

Valide:

```text
ManagedResourceClient inicializado;

SingletonReadinessProbe chamado depois;

lazy bean ainda ausente;

prototype não criado automaticamente.
```

---

### 21. Criar SmartLifecycleIT

Use contexto pequeno.

Valide:

- auto startup;
- `isRunning=true` depois do refresh;
- phase 100;
- stop chamado no close;
- callback de stop executado;
- estado final false.

Não use `Thread.sleep`.

---

### 22. Criar LazyInitializationIT

Valide:

1. contexto inicia;
2. nenhum evento do lazy probe;
3. `getBean` é chamado;
4. constructor e `@PostConstruct` aparecem;
5. segunda busca retorna o mesmo singleton;
6. contexto fecha.

---

### 23. Criar GlobalLazyInitializationTest

Use `SpringApplication` em modo `NONE`.

Ative somente no teste:

```text
spring.main.lazy-initialization=true.
```

Registre um bean inválido lazy.

Confirme:

- contexto inicia;
- falha não aparece no startup;
- primeira solicitação revela falha.

Depois compare com eager:

- startup falha imediatamente.

Feche o contexto bem-sucedido.

---

### 24. Criar PrototypeScopeIT

Obtenha duas instâncias pelo service.

Valide:

```text
id diferente;

referencia diferente;

constructor duas vezes;

@PostConstruct duas vezes.
```

Confirme que injetar prototype diretamente em singleton não produziria instância nova por chamada e documente o motivo.

---

### 25. Criar PrototypeDestructionIT

Crie prototype.

Feche contexto.

Confirme:

```text
PRE_DESTROY:
ausente.
```

Depois execute cleanup manual.

Confirme:

```text
MANUAL_CLEANUP:
presente.
```

Não deixe recurso simulado pendente.

---

### 26. Criar DestroyMethodInferenceIT

Inicie contexto com `AutoCloseableChannel`.

Confirme:

- channel aberto durante uso;
- close count zero;
- contexto fecha;
- close count um;
- segunda chamada manual não aumenta count.

---

### 27. Criar LifecycleFailureIT

Fixture isolada:

```java
@PostConstruct
void fail() {
    throw new IllegalStateException(
            "falha controlada"
    );
}
```

Confirme:

- contexto falha;
- bean não fica disponível;
- causa raiz preservada;
- runtime oficial não contém a fixture.

---

### 28. Criar LifecycleArchitectureTest

Valide no código de produção:

- callbacks longos não existem;
- `Thread.sleep` não existe;
- classes de lifecycle ficam no package dedicado;
- nenhum `ApplicationContextAware` fora do bean didático;
- nenhum bean de negócio usa `getBean`;
- global lazy não está habilitado;
- prototype não possui recurso real;
- zero controller.

---

### 29. Criar GracefulShutdownIT

Inicie contexto programaticamente.

Use recorder.

Feche com:

```java
context.close();
```

Valide:

- SmartLifecycle stop;
- destroy callbacks;
- AutoCloseable close;
- ordem compatível;
- nenhum erro de shutdown;
- close repetido não duplica eventos críticos.

---

### 30. Documentar bean-lifecycle-phases.md

Desenhe:

```text
definitions
-> factory post-processors
-> instantiation
-> dependencies
-> aware
-> BPP before
-> init callbacks
-> BPP after
-> ready
-> destruction.
```

---

### 31. Documentar aware-callbacks.md

Explique:

- BeanNameAware;
- BeanFactoryAware;
- ApplicationContextAware;
- EnvironmentAware;
- acoplamento;
- uso legítimo;
- antipadrão Service Locator.

---

### 32. Documentar bean-post-processors.md

Compare:

```text
BeanFactoryPostProcessor:
definitions.

BeanPostProcessor:
instances.
```

Inclua before, after, proxy e registro precoce.

---

### 33. Documentar initialization-callbacks.md

Inclua:

- `@PostConstruct`;
- `InitializingBean`;
- init method;
- ordem;
- recomendação;
- trabalho permitido;
- risco de atividade externa longa.

---

### 34. Documentar destruction-callbacks.md

Inclua:

- `@PreDestroy`;
- `DisposableBean`;
- destroy method;
- ordem;
- inferência;
- idempotência;
- shutdown anormal.

---

### 35. Documentar smart-initializing-singleton.md

Explique diferença entre:

```text
bean inicializado;

todos os singletons instanciados;

aplicacao pronta.
```

---

### 36. Documentar lifecycle-smart-lifecycle.md

Inclua:

- start;
- stop;
- running;
- auto startup;
- phase;
- callback;
- componentes adequados.

---

### 37. Documentar eager-lazy-initialization.md

Compare:

- falha rápida;
- startup;
- primeiro uso;
- `@Lazy`;
- lazy global;
- impacto web;
- motivo de manter eager.

---

### 38. Documentar singleton-prototype.md

Inclua:

- instâncias;
- provider;
- inicialização;
- destruição;
- responsabilidade do cliente;
- risco de resource leak.

---

### 39. Documentar graceful-shutdown.md

Inclua:

- shutdown hook;
- Ctrl+C;
- context close;
- stop;
- destroy;
- close;
- sinais forçados;
- idempotência.

---

### 40. Criar lifecycle-baseline.md

Registre a ordem observada.

Inclua:

```text
startup;

after singletons;

smart lifecycle;

lazy;

prototype;

shutdown.
```

Não cole logs completos.

---

### 41. Criar scripts

`27_executar_testes_lifecycle.ps1` executa a suite.

`28_iniciar_lifecycle_lab.ps1` ativa o profile lifecycle-lab.

`29_validar_lazy.ps1` executa testes eager/lazy.

`30_validar_prototype.ps1` executa testes de prototype.

`31_validar_shutdown.ps1` executa testes de destruição.

`32_validar_escopo_pre_rest.ps1` confirma zero controllers e endpoints.

---

### 42. Executar testes isolados

```powershell
.\mvnw.cmd `
  -Dtest=LifecycleCallbackOrderIT test

.\mvnw.cmd `
  -Dtest=LazyInitializationIT,GlobalLazyInitializationTest test

.\mvnw.cmd `
  -Dtest=PrototypeScopeIT,PrototypeDestructionIT test

.\mvnw.cmd `
  -Dtest=GracefulShutdownIT test
```

Falhas esperadas devem ser assertions controladas.

---

### 43. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Resultado esperado:

```text
BUILD SUCCESS.
```

Confirme:

- contextos fechados;
- nenhum worker ativo;
- nenhum recurso aberto;
- nenhuma property global vazou;
- recorder limpo entre testes.

---

### 44. Empacotar e executar

```powershell
.\mvnw.cmd clean package

java -jar target\*.jar `
  --spring.profiles.active=local,lifecycle-lab
```

Observe:

- startup;
- callbacks;
- readiness;
- SmartLifecycle start;
- aplicação pronta.

Encerre com:

```text
Ctrl+C.
```

Observe:

- SmartLifecycle stop;
- destroy callbacks;
- AutoCloseable close.

---

### 45. Revisar escopo

Confirme:

```text
controller:
zero.

endpoint:
zero.

request mapping:
zero.

banco:
zero.

JPA:
ausente.

Flyway:
ausente.

Security:
ausente.

global lazy em runtime:
false.

resource real:
zero.
```

---

### 46. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs completos;
- arquivos PID;
- global lazy;
- fixture de falha em runtime;
- recurso externo real;
- controller antecipado.

---

## Entendendo o que foi feito

### O bean deixou de ser apenas uma instancia

Você acompanhou metadata, construção, inicialização, uso e destruição.

### Callbacks ganharam ordem comprovada

A sequência foi testada em vez de presumida.

### Eager e lazy ganharam consequencias

A escolha afeta startup e momento da falha.

### Prototype ganhou responsabilidade explicita

O container inicializa, mas não destrói automaticamente a instância entregue.

### Shutdown virou parte da qualidade

Recursos e componentes ativos precisam terminar de forma controlada.

---

## Erros comuns importantes

### Fazer chamada externa longa em PostConstruct

O startup fica bloqueado e pode ocorrer deadlock.

### Ativar lazy global para esconder falhas

Problemas migram para o primeiro uso.

### Esperar PreDestroy em prototype

O container não administra a destruição completa.

### Implementar Aware para buscar dependencias

Isso cria Service Locator.

### Matar o processo e esperar cleanup garantido

Finalização forçada pode impedir callbacks.

---

## Comandos uteis

### Suite completa

```powershell
.\mvnw.cmd clean test
```

### Lifecycle order

```powershell
.\mvnw.cmd `
  -Dtest=LifecycleCallbackOrderIT test
```

### Lazy

```powershell
.\mvnw.cmd `
  -Dtest=LazyInitializationIT,GlobalLazyInitializationTest test
```

### Prototype

```powershell
.\mvnw.cmd `
  -Dtest=PrototypeScopeIT,PrototypeDestructionIT test
```

### Shutdown

```powershell
.\mvnw.cmd `
  -Dtest=GracefulShutdownIT test
```

### Executar laboratório

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,lifecycle-lab"
```

---

## Exercicio guiado

### Parte 1 — Ordem

Sem consultar o documento, escreva a ordem completa do `ManagedResourceClient`.

Execute o teste e compare.

### Parte 2 — Falha

Mova a falha controlada de `@PostConstruct` para o construtor.

Compare a causa e a etapa.

Restaure a fixture.

### Parte 3 — Lazy

Marque temporariamente um bean obrigatório como lazy.

Observe quando uma configuração inválida aparece.

Restaure eager.

### Parte 4 — Prototype

Injete prototype diretamente em singleton.

Comprove que a referência não muda por operação.

Restaure o provider.

### Parte 5 — Destroy inference

Defina temporariamente:

```java
@Bean(
        destroyMethod = ""
)
```

Confirme que `close()` não é inferido.

Restaure a configuração oficial.

### Parte 6 — Phase

Crie dois SmartLifecycle de teste com phases diferentes.

Comprove ordem de start e stop.

Não mova as fixtures para produção.

### Parte 7 — Post-processor

Faça o post-processor observar apenas uma annotation diferente.

Confirme filtro e restaure.

### Parte 8 — ADR

Registre:

```text
singletons eager;

lazy somente com motivo;

@PostConstruct pequeno;

@PreDestroy para recurso;

interfaces Spring apenas em infraestrutura;

prototype com cleanup do cliente;

close inferido quando adequado;

shutdown gracioso obrigatório.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 361 foi preservada;
- o mesmo projeto foi continuado;
- bean lifecycle foi definido;
- bean definition foi posicionada antes da instância;
- BeanFactoryPostProcessor foi explicado;
- BeanFactoryPostProcessor atuou sobre metadata;
- getBean prematuro foi evitado;
- instanciação foi explicada;
- constructor injection foi preservada;
- dependency population foi explicada;
- callbacks Aware foram explicados;
- BeanNameAware foi demonstrado;
- ApplicationContextAware foi demonstrado;
- Aware não virou Service Locator;
- BeanPostProcessor foi explicado;
- before initialization foi demonstrado;
- after initialization foi demonstrado;
- post-processor foi filtrado;
- post-processor retornou a referência;
- proxy foi explicado sem implementação desnecessária;
- registro precoce foi considerado;
- método bean do post-processor foi static;
- warning de post-processing precoce foi evitado;
- `@PostConstruct` foi usado;
- callback ficou pequeno;
- atividade externa longa foi proibida;
- InitializingBean foi usado somente no bean didático;
- acoplamento ao Spring foi explicado;
- init method foi usado;
- ordem de init foi validada;
- `@PostConstruct` ocorreu primeiro;
- `afterPropertiesSet` ocorreu depois;
- custom init ocorreu por último;
- bean só ficou pronto depois dos callbacks;
- SmartInitializingSingleton foi usado;
- callback ocorreu depois dos singletons regulares;
- lazy bean não foi criado pelo readiness callback;
- ApplicationReadyEvent foi diferenciado;
- Lifecycle foi explicado;
- SmartLifecycle foi usado;
- auto startup foi validado;
- running foi validado;
- phase foi validada;
- stop callback foi executado;
- nenhuma thread real foi criada;
- singleton eager foi explicado;
- eager permaneceu padrão;
- `@Lazy` foi usado em bean didático;
- lazy não foi criado no startup;
- lazy foi criado no primeiro getBean;
- busca seguinte retornou o mesmo singleton;
- lazy global foi testado isoladamente;
- lazy global não foi habilitado no runtime;
- falha atrasada por lazy foi demonstrada;
- eager falhou rápido;
- lazy não foi usado para corrigir ciclo;
- scope singleton foi revisado;
- scope prototype foi usado;
- prototype gerou instâncias diferentes;
- prototype recebeu callback de inicialização;
- prototype não recebeu destroy automático;
- cleanup manual foi demonstrado;
- prototype não abriu recurso real;
- prototype direto em singleton foi explicado;
- ObjectProvider foi usado para novas instâncias;
- `@PreDestroy` foi usado;
- callback de destruição ficou idempotente;
- DisposableBean foi usado somente no bean didático;
- destroy method customizado foi usado;
- ordem de destroy foi validada;
- `@PreDestroy` ocorreu primeiro;
- `DisposableBean.destroy` ocorreu depois;
- custom destroy ocorreu por último;
- inferência de close foi testada;
- AutoCloseable foi usado;
- close ocorreu no shutdown;
- close foi idempotente;
- destroyMethod vazio foi explicado;
- shutdown hook foi explicado;
- Ctrl+C foi usado;
- contexto foi fechado programaticamente em testes;
- finalização forçada foi desencorajada;
- falha em PostConstruct foi testada;
- causa raiz foi preservada;
- fixture de falha não entrou no runtime;
- LifecycleEvent foi criado;
- LifecycleEventRecorder foi criado;
- snapshots foram imutáveis;
- TraceLifecycle foi criada;
- LifecycleTracingBeanPostProcessor foi criado;
- LifecycleInstrumentationConfiguration foi criada;
- ManagedResourceClient foi criado;
- ManagedResourceConfiguration foi criada;
- SingletonReadinessProbe foi criado;
- SmartLifecycleWorker foi criado;
- LazyLifecycleProbe foi criado;
- PrototypeLifecycleProbe foi criado;
- PrototypeLifecycleService foi criado;
- AutoCloseableChannel foi criado;
- LifecycleCallbackOrderIT foi criado;
- BeanPostProcessorLifecycleTest foi criado;
- SingletonReadinessIT foi criado;
- SmartLifecycleIT foi criado;
- LazyInitializationIT foi criado;
- GlobalLazyInitializationTest foi criado;
- PrototypeScopeIT foi criado;
- PrototypeDestructionIT foi criado;
- DestroyMethodInferenceIT foi criado;
- LifecycleFailureIT foi criado;
- LifecycleArchitectureTest foi criado;
- GracefulShutdownIT foi criado;
- nenhum Thread.sleep foi usado;
- testes ficaram determinísticos;
- contextos foram fechados;
- recorder foi limpo entre testes;
- nenhum recurso ficou aberto;
- documentação das fases foi criada;
- callbacks Aware foram documentados;
- post-processors foram documentados;
- init callbacks foram documentados;
- destroy callbacks foram documentados;
- SmartInitializingSingleton foi documentado;
- SmartLifecycle foi documentado;
- eager e lazy foram documentados;
- singleton e prototype foram documentados;
- graceful shutdown foi documentado;
- baseline foi registrada;
- scripts foram criados;
- testes isolados passaram;
- suite completa passou;
- package passou;
- aplicação executou;
- shutdown foi observado;
- nenhum controller foi criado;
- nenhum endpoint foi criado;
- nenhum RequestMapping foi criado;
- nenhum banco foi adicionado;
- JPA não foi adicionado;
- Flyway não foi adicionado;
- Security não foi adicionada;
- Actuator não foi adicionado;
- aula 363 não foi antecipada;
- ponte para a aula 363 está correta;
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
git commit -m "feat(m14): observar ciclo de vida dos beans"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs completos;
- fixture de falha no runtime;
- global lazy habilitado;
- arquivos PID;
- classes temporárias do exercício;
- controller antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você observou o ciclo completo de beans Spring.

O mapa consolidado ficou:

```text
bean definition:
receita.

instantiation:
objeto criado.

dependency injection:
colaboradores entregues.

Aware:
infraestrutura informada.

BPP before:
antes dos init callbacks.

@PostConstruct:
inicializacao moderna.

InitializingBean:
callback acoplado.

init method:
callback POJO.

BPP after:
bean final ou proxy.

SmartInitializingSingleton:
singletons regulares prontos.

SmartLifecycle:
componente ativo.

@PreDestroy:
cleanup moderno.

DisposableBean:
destroy acoplado.

destroy method:
cleanup POJO.
```

Você comprovou:

```text
ordem de inicializacao;

ordem de destruicao;

singleton eager;

singleton lazy;

prototype por solicitacao;

ausencia de destroy automatico no prototype;

close inferido;

start e stop de SmartLifecycle;

falha em inicializacao;

shutdown gracioso.
```

A decisão central foi:

```text
o container administra o lifecycle
somente dentro das fronteiras do scope
e o desenvolvedor precisa escolher callbacks
pequenos, observaveis e seguros.
```

A próxima aula será:

```text
363 - M14.08 - Controller REST primeiros endpoints
```

Nela, você continuará no mesmo projeto e estudará:

- camada web;
- `@RestController`;
- `@RequestMapping`;
- `@GetMapping`;
- primeiro endpoint;
- resposta textual;
- resposta JSON;
- record de response;
- `ResponseEntity`;
- status 200;
- content type;
- path;
- query parameter introdutório;
- controller fino;
- chamada ao service;
- serialização;
- teste com MockMvc;
- teste com servidor real;
- curl;
- logs HTTP básicos;
- separação entre controller e negócio.

A aula 362 respondeu:

```text
como o container cria,
inicializa e destroi beans?
```

A aula 363 responderá:

```text
como expor o primeiro contrato HTTP
sem colocar regra de negocio no controller?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei explicar a ordem de inicialização.
- [ ] Sei escolher callbacks sem acoplamento desnecessário.
- [ ] Sei comparar eager, lazy, singleton e prototype.
- [ ] Sei explicar quem destrói cada recurso.
- [ ] Sei validar shutdown gracioso.

---

## Troubleshooting adicional

### PostConstruct nao executou

Confirme que o objeto é bean administrado e que annotation processing está ativo.

### PreDestroy nao executou

Confirme singleton, fechamento gracioso e método válido.

### Prototype nao foi destruido

Esse é o comportamento esperado; o cliente precisa limpar.

### Bean lazy foi criado no startup

Outro singleton pode estar dependendo dele.

### BeanPostProcessor nao observou o bean

Revise registro precoce, filtro e contexto correto.

### Aplicacao trava no init

Remova trabalho externo e dependência entre singletons durante callback.

---

## Perguntas de revisao

1. O que existe antes da instância?
2. O que BeanFactoryPostProcessor altera?
3. O que BeanPostProcessor altera?
4. Quando Aware callbacks acontecem?
5. Qual é a ordem de init?
6. Qual é a ordem de destroy?
7. Quando o bean fica pronto?
8. O que faz SmartInitializingSingleton?
9. O que faz SmartLifecycle?
10. Como funciona phase?
11. Singleton é eager por padrão?
12. O que `@Lazy` altera?
13. Qual risco do lazy global?
14. Prototype recebe PostConstruct?
15. Prototype recebe PreDestroy automático?
16. Como obter novo prototype em singleton?
17. Quando close é inferido?
18. Para que serve shutdown hook?
19. O que ocorre se PostConstruct falhar?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Bean definition.
2. Metadata.
3. Instâncias.
4. Depois das dependências e antes de init.
5. PostConstruct, afterPropertiesSet, init method.
6. PreDestroy, destroy, destroy method.
7. Depois dos callbacks e post-processing final.
8. Executa depois dos singletons regulares.
9. Participa de start e stop.
10. Ordena startup e shutdown.
11. Sim.
12. Adia criação.
13. Atrasar falhas.
14. Sim.
15. Não.
16. ObjectProvider ou factory.
17. Em bean Java com close/shutdown compatível.
18. Fechar contexto no término normal.
19. O bean e o contexto podem falhar.
20. Controller REST primeiros endpoints.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 362 - M14.07 - Ciclo de vida de beans

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei bean definition de instância.
- Entendi `BeanFactoryPostProcessor`.
- Entendi `BeanPostProcessor`.
- Observei instanciação e injeção.
- Estudei callbacks `Aware`.
- Usei `BeanNameAware`.
- Usei `ApplicationContextAware` somente no bean didático.
- Evitei Service Locator.
- Criei um post-processor filtrado.
- Observei before e after initialization.
- Usei `@PostConstruct`.
- Usei `InitializingBean` somente para demonstrar ordem.
- Usei init method customizado.
- Validei a ordem dos callbacks de inicialização.
- Entendi o ponto de aplicação de proxies.
- Usei `SmartInitializingSingleton`.
- Diferenciei bean pronto, singletons prontos e aplicação pronta.
- Usei `SmartLifecycle`.
- Validei start, stop, running e phase.
- Mantive singletons eager por padrão.
- Usei `@Lazy` em bean didático.
- Comparei eager e lazy global em teste.
- Mantive lazy global desabilitado no runtime.
- Criei bean prototype.
- Validei novas instâncias por solicitação.
- Usei `ObjectProvider` para criar prototypes.
- Confirmei inicialização de prototype.
- Confirmei ausência de destruição automática de prototype.
- Executei cleanup manual.
- Usei `@PreDestroy`.
- Usei `DisposableBean` somente para demonstrar ordem.
- Usei destroy method customizado.
- Validei a ordem dos callbacks de destruição.
- Testei inferência de `close()` com `AutoCloseable`.
- Validei idempotência do fechamento.
- Entendi o shutdown hook.
- Testei falha controlada em `@PostConstruct`.
- Criei testes determinísticos sem `Thread.sleep`.
- Fechei todos os contextos.
- Validei graceful shutdown.
- Mantive controllers e endpoints fora do escopo.
- Próxima aula: Controller REST primeiros endpoints.
```

---

## Referencia tecnica curta

```text
Definition:
metadata.

Constructor:
instancia.

Aware:
container.

BPP before:
pre-init.

PostConstruct:
init.

InitializingBean:
init Spring.

Init method:
init POJO.

BPP after:
bean final.

PreDestroy:
cleanup.

Prototype:
cliente limpa.
```

Regra final:

```text
o ciclo de vida de beans Spring deve ser compreendido desde a bean definition ate o shutdown: dependencias chegam antes da inicializacao, BeanPostProcessors cercam os callbacks, PostConstruct e PreDestroy sao preferiveis para logica pequena e desacoplada, singletons eager favorecem falha rapida, lazy deve ser excepcional, prototypes nao recebem destruicao automatica e recursos ativos ou externos precisam de stop e close idempotentes durante um encerramento gracioso do contexto.
```
