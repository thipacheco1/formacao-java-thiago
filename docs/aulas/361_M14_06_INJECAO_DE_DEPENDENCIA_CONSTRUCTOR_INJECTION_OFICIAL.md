# 361 - M14.06 - Injecao de dependencia constructor injection

## Apresentacao da aula

Na aula 360, você aprofundou o conceito de bean e os mecanismos usados para registrar objetos no Spring container.

O projeto contínuo passou a possuir beans registrados por:

```text
@Component;

@Service;

@Repository;

@Configuration;

@Bean;

@ConfigurationPropertiesScan;

auto-configuração.
```

Você também diferenciou:

```text
BeanFactory;

ApplicationContext;

bean definition;

bean instance;

nome;

tipo;

alias;

singleton por contexto;

full configuration;

lite configuration.
```

A aula anterior terminou com dois problemas intencionalmente abertos:

```text
mais de um bean do mesmo tipo;

beans que precisam colaborar entre si.
```

Agora surge a pergunta central:

```text
como um bean recebe os colaboradores
necessarios para cumprir sua responsabilidade?
```

A resposta é:

```text
Dependency Injection.
```

Dependency Injection, ou DI, é uma forma de Inversion of Control.

A classe declara suas dependências.

O container localiza candidatos compatíveis, resolve a composição e fornece os objetos durante a criação do bean.

Em vez de:

```java
public class RuntimeMessageService {

    private final RuntimeMessageRepository repository =
            new RuntimeMessageRepository();

    private final Clock clock =
            Clock.systemUTC();
}
```

a classe receberá:

```java
public RuntimeMessageService(
        RuntimeMessageRepository repository,
        RuntimeMessageFormatter formatter,
        Clock clock
) {
    this.repository = repository;
    this.formatter = formatter;
    this.clock = clock;
}
```

A criação deixa de ser responsabilidade da classe.

O contrato fica explícito.

O objeto pode ser construído:

- pelo Spring;
- por um teste unitário;
- por uma factory;
- por código Java comum.

Nesta aula, o padrão oficial será:

```text
constructor injection.
```

Você estudará:

- Dependency Injection;
- dependência obrigatória;
- constructor injection;
- construtor único;
- `@Autowired`;
- fields `final`;
- field injection;
- setter injection;
- method injection;
- múltiplos candidatos;
- `@Primary`;
- `@Qualifier`;
- qualifier customizado;
- nome de bean como qualifier de fallback;
- collections de beans;
- ordenação;
- `Optional<T>`;
- `ObjectProvider<T>`;
- dependência lazy;
- dependência ausente;
- dependência circular;
- fail fast;
- testabilidade sem contexto;
- grafo de dependências;
- testes de wiring;
- arquitetura sem field injection.

A documentação oficial do Spring estabelece que um bean com apenas um construtor não precisa anotar esse construtor com `@Autowired`.

Quando existem vários construtores, o container precisa de uma regra clara para escolher.

Nesta formação:

```text
um bean de aplicação deve preferir
um único construtor completo.
```

As dependências obrigatórias serão:

- parâmetros de construtor;
- campos `private final`;
- validadas durante a criação;
- impossíveis de trocar depois da construção.

Field injection será demonstrada somente como antipadrão de comparação.

Ela não será usada no código de produção.

Setter injection será reservada para colaboração opcional ou realmente reconfigurável.

Mesmo nesses casos, a escolha precisará ser justificada.

O laboratório continuará no mesmo projeto:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A composição principal será:

```text
RuntimeMessageService
    -> RuntimeMessageRepository
    -> RuntimeMessageFormatter
    -> Clock.
```

Existirão dois formatters:

```text
CompactRuntimeMessageFormatter;

DetailedRuntimeMessageFormatter.
```

O formatter compacto será o candidato primário.

Também será criado um qualifier customizado:

```text
@RuntimeFormat.
```

Ele permitirá selecionar uma implementação por semântica, sem acoplar o consumidor ao nome concreto do bean.

Uma coleção de formatters será injetada em:

```text
RuntimeMessageFormatterCatalog.
```

Ela demonstrará que:

```text
@Primary escolhe um candidato singular;

List<RuntimeMessageFormatter> recebe todos.
```

Uma colaboração diagnóstica opcional será acessada por:

```text
ObjectProvider<RuntimeDiagnosticsHook>.
```

Profile:

```text
diagnostics.
```

O provider permitirá verificar disponibilidade sem tornar a dependência obrigatória.

A aula não usará `ObjectProvider` para buscar qualquer bean arbitrariamente.

Isso seria uma forma de Service Locator.

Uma dependência circular será criada apenas em teste:

```text
FirstCircularService
    -> SecondCircularService
        -> FirstCircularService.
```

A aplicação oficial manterá:

```text
spring.main.allow-circular-references=false.
```

A solução não será habilitar referências circulares.

A solução será redesenhar responsabilidades.

A próxima aula será:

```text
362 - M14.07 - Ciclo de vida de beans
```

Por isso, esta aula não aprofundará:

- criação eager versus lazy;
- callbacks de inicialização;
- `@PostConstruct`;
- `InitializingBean`;
- init method;
- `@PreDestroy`;
- destroy method;
- scopes web;
- ordem de shutdown.

O foco permanecerá:

```text
como as dependencias entram no bean.
```

---

## Onde estamos na formacao

A sequência inicial do M14 está assim:

```text
356:
Spring Boot visão geral.

357:
Spring Initializr e estrutura.

358:
Main Application e auto configuration.

359:
properties, YAML e profiles.

360:
beans e formas de registro.

361:
injeção de dependência por construtor.

362:
ciclo de vida de beans.

363:
primeiros controllers REST.
```

A aula 360 respondeu:

```text
quais objetos fazem parte do container?
```

A aula 361 responderá:

```text
como esses objetos recebem
os colaboradores de que dependem?
```

Nesta aula:

```text
constructor injection:
sim.

@Autowired:
sim.

field injection:
sim, como antipadrão.

setter injection:
sim, como alternativa específica.

final:
sim.

@Primary:
sim.

@Qualifier:
sim.

qualifier customizado:
sim.

List de beans:
sim.

ordenação:
sim.

Optional:
sim.

ObjectProvider:
sim.

dependência circular:
sim.

fail fast:
sim.

teste unitário sem Spring:
sim.

lifecycle detalhado:
não.

@PostConstruct:
não.

@PreDestroy:
não.

controller:
não.

endpoint:
não.
```

O objetivo não é decorar annotations.

O objetivo é conseguir analisar uma classe e responder:

```text
quais dependencias sao obrigatorias?

quais sao opcionais?

qual implementacao deve entrar?

a escolha esta explicita?

o objeto pode ser testado sem Spring?

existe ciclo?

o construtor ficou grande demais?

o design esta revelando responsabilidades demais?
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/backend/beans
├── component
│   ├── ApplicationIdentityComponent.java
│   └── DefaultFormatterProbe.java
├── diagnostics
│   ├── DependencyEdge.java
│   ├── DependencyGraphDiagnostics.java
│   ├── RuntimeDiagnosticsHook.java
│   └── RuntimeDiagnosticsSupport.java
├── formatter
│   ├── CompactRuntimeMessageFormatter.java
│   ├── DetailedRuntimeMessageFormatter.java
│   ├── RuntimeFormat.java
│   ├── RuntimeMessageFormatter.java
│   └── RuntimeMessageFormatterCatalog.java
├── repository
│   └── RuntimeMessageRepository.java
├── service
│   ├── RuntimeMessageResult.java
│   └── RuntimeMessageService.java
└── config
    ├── ClockConfiguration.java
    └── TextToolConfiguration.java
```

Testes novos:

```text
src/test/java/br/com/formacao/backend
├── ConstructorInjectionWiringIT.java
├── RuntimeMessageServiceTest.java
├── PrimaryAndQualifierIT.java
├── CustomQualifierIT.java
├── CollectionInjectionIT.java
├── OptionalDependencyIT.java
├── ObjectProviderIT.java
├── SingleConstructorAutowiredTest.java
├── MultipleConstructorResolutionTest.java
├── FieldInjectionArchitectureTest.java
├── CircularDependencyIT.java
└── DependencyGraphDiagnosticsIT.java
```

Documentação na pasta externa da aula:

```text
docs
├── dependency-injection.md
├── constructor-field-setter.md
├── autowired-constructor-resolution.md
├── primary-and-qualifier.md
├── custom-qualifier.md
├── collections-and-ordering.md
├── optional-and-object-provider.md
├── circular-dependencies.md
├── unit-testing-without-spring.md
└── dependency-graph-baseline.md
```

Scripts:

```text
scripts
├── 22_executar_testes_injecao.ps1
├── 23_executar_testes_selecao.ps1
├── 24_validar_field_injection.ps1
├── 25_validar_ciclo.ps1
└── 26_iniciar_grafo_dependencias.ps1
```

Resultados esperados:

```text
RuntimeMessageService:
um único construtor.

@Autowired no construtor:
desnecessário.

campos:
private final.

repository:
injetado.

formatter:
selecionado por qualifier customizado.

Clock:
injetado.

default formatter:
compacto por @Primary.

formatter detalhado:
selecionável por @Qualifier.

catalogo:
recebe dois formatters.

ordem:
compacto antes do detalhado.

diagnostics hook sem profile:
ausente.

diagnostics hook com profile:
presente.

ObjectProvider:
não falha quando ausente.

field injection em produção:
zero.

ciclo de construtores:
falha controlada.

allow circular references:
false.

teste unitário:
sem ApplicationContext.

controller:
zero.

endpoint:
zero.
```

---

## Conceito essencial

### Dependency Injection

Dependency Injection é a entrega de colaboradores a um objeto.

A classe declara o que precisa.

Outra parte coordena a construção.

No Spring, essa outra parte normalmente é o container.

A relação conceitual é:

```text
IoC:
controle da composição sai da classe.

DI:
dependencias entram por pontos declarados.
```

O container não adivinha a intenção de negócio.

Ele resolve metadata de tipos, qualifiers, nomes, prioridades e optionalidade.

---

### Dependencia obrigatoria

Uma dependência obrigatória é necessária para o objeto existir em estado válido.

Exemplo:

```text
RuntimeMessageService sem repository:
não consegue buscar mensagens.

RuntimeMessageService sem formatter:
não consegue produzir saída.

RuntimeMessageService sem Clock:
não consegue registrar instante controlado.
```

Dependências obrigatórias devem entrar no construtor.

Se uma delas não existir, a criação do bean deve falhar.

Esse fail fast é desejável.

---

### Constructor injection

Constructor injection expressa as dependências no contrato de criação.

Exemplo:

```java
@Service
public class RuntimeMessageService {

    private final RuntimeMessageRepository repository;
    private final RuntimeMessageFormatter formatter;
    private final Clock clock;

    public RuntimeMessageService(
            RuntimeMessageRepository repository,
            @RuntimeFormat("compact")
            RuntimeMessageFormatter formatter,
            Clock clock
    ) {
        this.repository =
                Objects.requireNonNull(
                        repository
                );

        this.formatter =
                Objects.requireNonNull(
                        formatter
                );

        this.clock =
                Objects.requireNonNull(
                        clock
                );
    }
}
```

Benefícios:

- dependências visíveis;
- estado válido após construção;
- campos `final`;
- teste sem container;
- falha rápida;
- baixa dependência do framework;
- impossibilidade de esquecer uma colaboração obrigatória.

---

### Construtor unico

Se o bean possui apenas um construtor, o Spring o usa automaticamente.

Não é necessário:

```java
@Autowired
```

no construtor único.

O código oficial da aula não colocará a annotation nesse caso.

Isso reduz ruído.

---

### Varios construtores

Quando uma classe possui vários construtores, a resolução precisa ser inequívoca.

Exemplo de teste:

```java
@Component
class MultiConstructorComponent {

    MultiConstructorComponent() {
    }

    @Autowired
    MultiConstructorComponent(
            Clock clock
    ) {
    }
}
```

A annotation indica o construtor preferido.

No código de aplicação, vários construtores públicos para um bean geralmente são um sinal de design confuso.

Prefira uma forma oficial de construção.

---

### @Autowired required

O padrão de `@Autowired` é `required=true`.

Uma dependência ausente impede a criação, comportamento correto para colaboradores obrigatórios.

Não use `required=false` apenas para fazer o contexto iniciar.

---

### Field injection

Field injection:

```java
@Autowired
private RuntimeMessageRepository repository;
```

será evitada.

Problemas:

- dependência escondida;
- campo não pode ser `final`;
- objeto pode ser criado inválido;
- teste exige reflection ou contexto;
- construtor não revela o contrato;
- acoplamento direto à annotation;
- ciclos ficam menos visíveis.

A formação adotará um teste arquitetural para impedir field injection no código de produção.

---

### Setter injection

Setter injection pode ser usada quando uma dependência é:

- opcional;
- reconfigurável;
- válida após construção sem o colaborador.

Exemplo conceitual:

```java
@Autowired(
        required = false
)
void setDiagnosticsHook(
        RuntimeDiagnosticsHook hook
) {
    this.hook =
            hook;
}
```

Esse estilo mantém mutabilidade.

Por isso, não será a escolha principal do projeto.

O laboratório usará `ObjectProvider` para a colaboração diagnóstica opcional.

---

### Method injection

`@Autowired` também pode atuar em métodos e o container resolve seus parâmetros.

Para serviços de aplicação, o construtor continua preferível.

Não confunda esse recurso com lookup method injection.

---

### final

Campos de dependências obrigatórias devem ser:

```java
private final.
```

Isso comunica:

- definidos na construção;
- não trocados depois;
- necessários para a identidade funcional do objeto.

`final` não torna automaticamente o colaborador thread-safe ou imutável.

Ele impede apenas que a referência seja reatribuída.

---

### Testabilidade

Com constructor injection:

```java
RuntimeMessageRepository repository =
        new FakeRuntimeMessageRepository();

RuntimeMessageFormatter formatter =
        value -> "[" + value + "]";

Clock clock =
        Clock.fixed(
                instant,
                ZoneOffset.UTC
        );

RuntimeMessageService service =
        new RuntimeMessageService(
                repository,
                formatter,
                clock
        );
```

Nenhum contexto Spring é necessário.

O teste unitário fica:

- rápido;
- determinístico;
- focado;
- independente de component scan.

---

### Resolucao por tipo

O Spring começa procurando candidatos compatíveis com o tipo solicitado.

Exemplo:

```text
RuntimeMessageFormatter.
```

Se existe exatamente um candidato, a resolução é direta.

Se existem dois, o container precisa de metadata adicional.

---

### @Primary

`@Primary` indica o candidato preferido quando uma injeção singular possui vários candidatos.

Exemplo:

```java
@Component
@Primary
public class CompactRuntimeMessageFormatter
        implements RuntimeMessageFormatter {
}
```

Uma dependência sem qualifier receberá o compacto.

`@Primary` expressa:

```text
default do sistema.
```

Ele não elimina os outros beans.

---

### Primary e collections

Uma coleção:

```java
List<RuntimeMessageFormatter>
```

recebe todos os candidatos elegíveis.

`@Primary` não reduz a coleção a um item.

Ele afeta a escolha singular.

Essa diferença será testada.

---

### @Qualifier

`@Qualifier` restringe candidatos.

Exemplo:

```java
public DetailedFormatterProbe(
        @Qualifier(
                "detailedRuntimeMessageFormatter"
        )
        RuntimeMessageFormatter formatter
) {
    this.formatter =
            formatter;
}
```

O qualifier não é simplesmente uma busca global por string.

Ele atua dentro dos candidatos compatíveis por tipo.

O nome do bean pode funcionar como um valor de fallback de qualifier.

Para semântica de domínio, prefira qualifier customizado.

---

### Qualifier customizado

Crie:

```java
@Target({
        ElementType.FIELD,
        ElementType.PARAMETER,
        ElementType.METHOD,
        ElementType.TYPE
})
@Retention(
        RetentionPolicy.RUNTIME
)
@Qualifier
public @interface RuntimeFormat {

    String value();
}
```

Use nos beans:

```java
@Component
@RuntimeFormat("compact")
```

e:

```java
@Component
@RuntimeFormat("detailed")
```

Use no consumidor:

```java
@RuntimeFormat("compact")
RuntimeMessageFormatter formatter
```

A escolha fica semântica e refactor-friendly.

---

### Nome versus semantica

O nome concreto pode funcionar em infraestrutura pequena.

Para contratos de aplicação, o qualifier customizado expressa melhor a semântica e permite trocar a implementação sem alterar o consumidor.

---

### Custom qualifier no bean method

O qualifier também pode anotar um método `@Bean`.

Exemplo conceitual:

```java
@Bean
@RuntimeFormat("external")
RuntimeMessageFormatter externalFormatter() {
    return new ExternalFormatter();
}
```

O qualifier faz parte da bean definition.

---

### Collections

O container pode injetar:

```text
List<T>;

Set<T>;

Map<String, T>;

T[].
```

Uma lista de formatters permite:

- catálogo;
- pipeline;
- estratégia composta;
- validação de capacidades.

Não use collection injection quando o caso de uso exige exatamente uma estratégia.

Nesse caso, selecione um candidato explicitamente.

---

### Ordenacao

Beans em uma lista podem ser ordenados com:

- `@Order`;
- interface `Ordered`;
- metadata de prioridade compatível.

O laboratório utilizará:

```text
compact:
ordem 10.

detailed:
ordem 20.
```

Não dependa de ordem alfabética ou ordem acidental de scan.

---

### Map de beans

`Map<String, RuntimeMessageFormatter>` usa nomes dos beans como chaves.

Ele pode ajudar em registries, mas nomes técnicos não devem virar regra de negócio.

A aula usará lista como mecanismo principal.

---

### Optional<T>

O Spring consegue injetar:

```java
Optional<RuntimeDiagnosticsHook>.
```

Quando nenhum candidato existe:

```text
Optional.empty().
```

Use somente quando a ausência é parte válida do contrato.

Não envolva toda dependência em `Optional` para evitar startup failures.

Dependências obrigatórias devem continuar obrigatórias.

---

### ObjectProvider<T>

`ObjectProvider<T>` permite acesso programático e sob demanda.

Operações úteis:

```text
getIfAvailable;

ifAvailable;

stream;

orderedStream.
```

Ele é apropriado para:

- dependência opcional;
- lazy access;
- múltiplos candidatos sob demanda;
- integração de infraestrutura.

Não o use como um container genérico dentro do negócio.

---

### Lazy access

`ObjectProvider` pode adiar a resolução até a chamada.

Use apenas quando a funcionalidade é opcional, o acesso sob demanda é necessário ou o custo de criação justifica.

Atrasar criação não corrige uma dependência obrigatória ausente.

---

### Profile e dependencia opcional

O `RuntimeDiagnosticsSupport` será registrado apenas com:

```java
@Profile(
        "diagnostics"
)
```

Sem o profile, não existirá bean do tipo:

```text
RuntimeDiagnosticsHook.
```

O consumidor com provider continuará válido.

Com o profile, o hook será encontrado e executado.

---

### Optional versus ObjectProvider

Use `Optional<T>` quando:

- a decisão de presença pode ser feita na construção;
- não é necessário lazy access;
- existe zero ou um candidato.

Use `ObjectProvider<T>` quando:

- precisa consultar sob demanda;
- precisa iterar candidatos;
- precisa comportamento lazy;
- está em integração de infraestrutura.

Não escolha por moda.

---

### ObjectProvider nao e Service Locator

Uso inadequado:

```java
provider.getObject();
```

espalhado por vários métodos para esconder dependências.

Uso adequado:

```text
um ponto de integração opcional
com contrato limitado.
```

A classe ainda declara explicitamente:

```text
ObjectProvider<RuntimeDiagnosticsHook>.
```

---

### Dependencia circular

Um ciclo de constructor injection é:

```text
A precisa de B para ser criado;

B precisa de A para ser criado.
```

Nenhum dos dois pode existir primeiro.

O contexto falha.

Esse comportamento revela um problema arquitetural.

---

### Circular references no Boot

A propriedade:

```text
spring.main.allow-circular-references
```

permanece:

```text
false.
```

Não será alterada.

Mesmo quando um container consegue resolver determinados ciclos por setter ou field, o design continua frágil.

Constructor cycles falham de forma clara.

---

### Como remover um ciclo

Possíveis redesigns:

- extrair uma terceira responsabilidade;
- inverter uma dependência;
- introduzir evento;
- separar leitura de escrita;
- reduzir responsabilidade de service;
- mover coordenação para um application service;
- criar interface em direção correta.

Não use `@Lazy` automaticamente.

Ele pode esconder o ciclo e transferir a falha para runtime.

---

### Grafo de dependencias

Pense em beans como grafo dirigido.

Exemplo:

```text
RuntimeMessageService
    -> RuntimeMessageRepository
    -> RuntimeMessageFormatter
    -> Clock.
```

Um grafo saudável deve permitir uma direção compreensível.

Ciclos dificultam:

- inicialização;
- testes;
- evolução;
- separação de camadas.

---

### Construtor grande

Um construtor com muitos parâmetros revela responsabilidades excessivas.

Revise o design em vez de esconder o problema com field injection.

---

### Falha rapida

Erros que devem impedir startup:

- dependência obrigatória ausente;
- múltiplos candidatos sem seleção;
- qualifier inexistente;
- ciclo;
- configuração incompatível.

Uma aplicação parcialmente montada é mais perigosa que uma falha explícita no início.

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

### 2. Criar RuntimeMessageFormatter

```java
public interface RuntimeMessageFormatter {

    String id();

    String format(
            String value
    );
}
```

O método `id` ajudará a validar coleções sem depender do nome concreto da classe.

---

### 3. Criar @RuntimeFormat

Crie a annotation customizada.

Ela deve possuir:

```text
@Target;

@Retention;

@Qualifier;

String value.
```

Não use `@Component` na annotation.

Ela serve para seleção, não para registro.

---

### 4. Criar CompactRuntimeMessageFormatter

```java
@Component
@Primary
@Order(10)
@RuntimeFormat(
        "compact"
)
public class CompactRuntimeMessageFormatter
        implements RuntimeMessageFormatter {
}
```

O método `format` remove espaços laterais e produz texto compacto.

Não reutilize o normalizer externo como dependência ainda.

Mantenha o exemplo focado.

---

### 5. Criar DetailedRuntimeMessageFormatter

```java
@Component
@Order(20)
@RuntimeFormat(
        "detailed"
)
public class DetailedRuntimeMessageFormatter
        implements RuntimeMessageFormatter {
}
```

Ele produz uma representação distinta e verificável.

Não marque como primary.

---

### 6. Evoluir RuntimeMessageRepository

Mantenha `@Repository`.

Adicione método:

```java
public List<String> findRuntimeMessages() {
    return List.of(
            "bootstrap",
            "configuration",
            "beans",
            "dependency-injection"
    );
}
```

Retorne lista imutável.

---

### 7. Criar RuntimeMessageResult

```java
public record RuntimeMessageResult(
        Instant generatedAt,
        String formatterId,
        List<String> messages
) {

    public RuntimeMessageResult {
        messages =
                List.copyOf(
                        messages
                );
    }
}
```

O result não é bean.

Não adicione stereotype.

---

### 8. Evoluir RuntimeMessageService

Use:

```java
@Service
public class RuntimeMessageService {
```

Campos:

```text
RuntimeMessageRepository;

RuntimeMessageFormatter;

Clock.
```

Todos:

```java
private final.
```

Construtor único sem `@Autowired`.

O formatter recebe:

```java
@RuntimeFormat(
        "compact"
)
```

O método principal:

1. busca mensagens;
2. formata;
3. captura `Instant.now(clock)`;
4. cria result imutável.

---

### 9. Criar teste unitario sem Spring

`RuntimeMessageServiceTest` não usa:

- `@SpringBootTest`;
- `ApplicationContext`;
- component scan;
- mock framework obrigatório.

Crie fake repository ou instância simples.

Crie lambda ou fake formatter.

Use:

```java
Clock.fixed.
```

Valide result.

---

### 10. Criar DefaultFormatterProbe

```java
@Component
public class DefaultFormatterProbe {

    private final RuntimeMessageFormatter formatter;

    public DefaultFormatterProbe(
            RuntimeMessageFormatter formatter
    ) {
        this.formatter =
                formatter;
    }
}
```

Sem qualifier, ele deve receber o primary.

---

### 11. Criar RuntimeMessageFormatterCatalog

```java
@Component
public class RuntimeMessageFormatterCatalog {

    private final List<RuntimeMessageFormatter> formatters;

    public RuntimeMessageFormatterCatalog(
            List<RuntimeMessageFormatter> formatters
    ) {
        this.formatters =
                List.copyOf(
                        formatters
                );
    }
}
```

Exponha somente cópia imutável ou IDs.

A lista deve respeitar `@Order`.

---

### 12. Criar RuntimeDiagnosticsHook

```java
public interface RuntimeDiagnosticsHook {

    String describe();
}
```


---

### 13. Criar RuntimeDiagnosticsSupport

```java
@Component
@Profile(
        "diagnostics"
)
public class RuntimeDiagnosticsSupport
        implements RuntimeDiagnosticsHook {
}
```

Use constructor único quando precisar de configuration properties.

Não adicione lifecycle callback.

---

### 14. Criar consumidor com ObjectProvider

Crie:

```text
RuntimeDiagnosticsBridge.
```

Ele recebe no construtor:

```java
ObjectProvider<RuntimeDiagnosticsHook>.
```

Métodos:

```text
isAvailable;

descriptionOrDefault.
```

Use:

```java
getIfAvailable.
```

Não chame o provider repetidamente sem necessidade.

---

### 15. Criar DependencyEdge

```java
public record DependencyEdge(
        String source,
        String target,
        String resolution
) {
}
```

Não é bean.

---

### 16. Criar DependencyGraphDiagnostics

Registre somente as relações da aula:

```text
RuntimeMessageService -> RuntimeMessageRepository;

RuntimeMessageService -> RuntimeMessageFormatter[compact];

RuntimeMessageService -> Clock;

DefaultFormatterProbe -> RuntimeMessageFormatter[primary];

RuntimeMessageFormatterCatalog -> List<RuntimeMessageFormatter>;

RuntimeDiagnosticsBridge -> ObjectProvider<RuntimeDiagnosticsHook>.
```

Não tente inferir todo o grafo interno do Spring.

---

### 17. Integrar o grafo ao bootstrap

Depois do catálogo de beans, imprima:

```text
DEPENDENCY GRAPH - AULA 361
```

O relatório deve ser curto.

Não imprima objetos nem valores sensíveis.

---

### 18. Criar ConstructorInjectionWiringIT

Use `@SpringBootTest`.

Valide:

- service presente;
- repository presente;
- Clock presente;
- campos do service são final;
- construtor é único;
- construtor não possui `@Autowired`;
- resultado usa formatter compacto;
- instante vem do Clock administrado.

Para teste determinístico do Clock, use configuração de teste explícita ou contexto pequeno.

Não altere o Clock oficial da aplicação permanentemente.

---

### 19. Criar PrimaryAndQualifierIT

Valide:

```text
DefaultFormatterProbe:
recebe compacto por @Primary.

busca por @Qualifier detalhado:
recebe detalhado.

busca singular sem metadata:
resolve primary.
```

Use injeções de teste ou contexto.

---

### 20. Criar CustomQualifierIT

Crie consumidores de teste com:

```text
@RuntimeFormat("compact");

@RuntimeFormat("detailed").
```

Confirme implementações corretas.

Adicione cenário com valor inexistente em `ApplicationContextRunner`.

Confirme falha de candidato ausente.

---

### 21. Criar CollectionInjectionIT

Valide:

- lista possui dois formatters;
- compacto é primeiro;
- detalhado é segundo;
- primary não remove detalhado;
- IDs são únicos;
- lista exposta é imutável.

Também consulte:

```java
Map<String, RuntimeMessageFormatter>
```

apenas no teste para observar os nomes.

---

### 22. Criar OptionalDependencyIT

Use contexto pequeno.

Cenário um:

```text
Optional<RuntimeDiagnosticsHook>
sem bean:
empty.
```

Cenário dois:

```text
com bean:
present.
```

Não altere o consumidor de produção para usar Optional se ObjectProvider já atende melhor.

O teste compara estratégias.

---

### 23. Criar ObjectProviderIT

Execute aplicação sem profile diagnostics.

Confirme:

```text
isAvailable:
false.
```

Execute com:

```java
@ActiveProfiles(
        "diagnostics"
)
```

Confirme:

```text
isAvailable:
true.
```

Valide descrição.

---

### 24. Criar SingleConstructorAutowiredTest

Por reflection, confirme:

- construtor único;
- ausência de `@Autowired`;
- contexto consegue criar o bean;
- campos final.

Esse teste documenta a convenção do curso.

---

### 25. Criar MultipleConstructorResolutionTest

Em configuração de teste, crie uma classe com dois construtores.

Cenário válido:

- um construtor anotado;
- bean criado.

Cenário inválido:

- múltiplos construtores sem seleção adequada;
- contexto falha ou escolhe apenas quando as regras oficiais permitem.

Não derive regra a partir de um único caso acidental.

Documente o motivo.

---

### 26. Criar FieldInjectionArchitectureTest

Leia as classes de produção do package:

```text
br.com.formacao.backend.
```

Falhe se um field possuir:

```java
@Autowired.
```

Permita `@Autowired` em fixtures de teste.

Não use regex frágil sobre arquivos gerados quando reflection resolver.

---

### 27. Criar CircularDependencyIT

Use `ApplicationContextRunner`.

Crie duas classes de teste com constructor injection circular.

Confirme:

- contexto falha;
- causa indica criação circular;
- propriedade de circular references permanece false;
- nenhum workaround `@Lazy` foi adicionado;
- aplicação oficial continua limpa.

---

### 28. Criar teste de redesign do ciclo

No mesmo teste, mostre uma versão corrigida:

```text
FirstService -> CycleCoordinator;

SecondService -> CycleCoordinator.
```

Ou:

```text
Coordinator -> FirstPort e SecondPort.
```

Confirme contexto válido.

O objetivo é comparar design, não apenas reproduzir falha.

---

### 29. Criar DependencyGraphDiagnosticsIT

Valide:

- seis edges esperadas;
- ordem determinística;
- nenhum controller;
- nenhuma dependência circular;
- resolução de cada edge documentada;
- ObjectProvider aparece como opcional.

---

### 30. Documentar dependency-injection.md

Explique:

- IoC;
- DI;
- dependência obrigatória;
- composição;
- fail fast;
- grafo.

---

### 31. Documentar constructor-field-setter.md

Compare:

```text
constructor;

field;

setter.
```

Inclua:

- visibilidade;
- final;
- testabilidade;
- optionalidade;
- mutabilidade;
- padrão oficial.

---

### 32. Documentar autowired-constructor-resolution.md

Inclua:

- construtor único;
- vários construtores;
- `required`;
- método;
- field;
- ausência de annotation no padrão do curso.

---

### 33. Documentar primary-and-qualifier.md

Explique:

- resolução por tipo;
- primary;
- qualifier;
- nome como fallback;
- singular versus collection;
- falhas de ambiguidade.

---

### 34. Documentar custom-qualifier.md

Inclua código de:

```text
@RuntimeFormat.
```

Explique:

- meta-annotation;
- retention;
- targets;
- semântica;
- refactoring.

---

### 35. Documentar collections-and-ordering.md

Inclua:

- List;
- Set;
- Map;
- array;
- `@Order`;
- primary em coleção;
- ordem explícita.

---

### 36. Documentar optional-and-object-provider.md

Compare:

- dependência obrigatória;
- Optional;
- provider;
- lazy;
- stream;
- risco de Service Locator;
- profile diagnostics.

---

### 37. Documentar circular-dependencies.md

Registre:

- grafo;
- falha;
- propriedade false;
- por que não habilitar;
- redesign aplicado;
- risco de `@Lazy`.

---

### 38. Documentar unit-testing-without-spring.md

Mostre:

- fake repository;
- fake formatter;
- fixed Clock;
- criação manual;
- velocidade;
- isolamento;
- limites do teste unitário.

---

### 39. Documentar dependency-graph-baseline.md

Registre as edges oficiais.

Inclua:

```text
source;

target;

tipo de resolução;

obrigatória ou opcional;

teste.
```

---

### 40. Criar scripts

`22_executar_testes_injecao.ps1`:

```powershell
Set-Location formacao-java-backend-api
.\mvnw.cmd clean test
```

`23_executar_testes_selecao.ps1` executa primary, qualifier e collections.

`24_validar_field_injection.ps1` executa o teste arquitetural.

`25_validar_ciclo.ps1` executa o teste circular isolado.

`26_iniciar_grafo_dependencias.ps1` inicia a aplicação com profile local e orienta a leitura.

---

### 41. Executar testes isolados

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageServiceTest test

.\mvnw.cmd `
  -Dtest=PrimaryAndQualifierIT test

.\mvnw.cmd `
  -Dtest=ObjectProviderIT test

.\mvnw.cmd `
  -Dtest=CircularDependencyIT test
```

Falhas esperadas devem ser capturadas como assertions.

---

### 42. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Resultado:

```text
BUILD SUCCESS.
```

Confirme que:

- contexts fecharam;
- profiles não vazaram;
- system properties foram restauradas;
- nenhuma porta ficou presa.

---

### 43. Empacotar e executar

```powershell
.\mvnw.cmd clean package

java -jar target\*.jar `
  --spring.profiles.active=local
```

Confirme:

```text
service criado;

formatter compacto selecionado;

dois formatters no catálogo;

diagnostics hook disponível;

grafo impresso;

aplicação iniciada.
```

Encerre com `Ctrl+C`.

---

### 44. Revisar escopo

Confirme:

```text
field injection em produção:
zero.

circular references:
false.

controller:
zero.

endpoint:
zero.

lifecycle callbacks:
zero.

JPA:
ausente.

Flyway:
ausente.

Security:
ausente.
```

---

### 45. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs;
- classes circulares em produção;
- `@Autowired` em field;
- propriedade que habilita ciclos;
- fixtures temporárias.

---

## Entendendo o que foi feito

### Dependencias obrigatorias ficaram explicitas

O construtor passou a representar o contrato mínimo do bean.

### A selecao entre implementacoes ficou deterministica

Primary, qualifier e qualifier customizado receberam funções distintas.

### Collections mantiveram todos os candidatos

A ordenação foi declarada e testada.

### Optionalidade ficou localizada

O provider foi usado somente na integração diagnóstica.

### O ciclo virou falha de design

A correção foi redesenhar responsabilidades, não habilitar referências circulares.

---

## Erros comuns importantes

### Colocar Autowired em todos os construtores

Um construtor único já é reconhecido.

### Usar field injection para reduzir linhas

As dependências ficam escondidas e o teste piora.

### Marcar tudo como Optional

Falhas obrigatórias deixam de ocorrer no startup.

### Usar Primary para esconder escolha de negocio

Quando a semântica importa, use qualifier.

### Quebrar ciclo com Lazy sem analisar

O problema pode apenas mudar de momento.

---

## Comandos uteis

### Suite

```powershell
.\mvnw.cmd clean test
```

### Teste unitário

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageServiceTest test
```

### Testes de seleção

```powershell
.\mvnw.cmd `
  -Dtest=PrimaryAndQualifierIT,CustomQualifierIT,CollectionInjectionIT test
```

### Ciclo

```powershell
.\mvnw.cmd `
  -Dtest=CircularDependencyIT test
```

### Executar

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

### Procurar field injection

```powershell
Get-ChildItem src\main\java -Recurse -Filter "*.java" |
  Select-String `
    -Pattern "@Autowired"
```

---

## Exercicio guiado

### Parte 1 — Construtor

Remova uma dependência do construtor do service.

Observe como a classe perde capacidade ou passa a criar colaborador manualmente.

Restaure.

### Parte 2 — Field injection

Crie fixture de teste com field injection.

Compare a criação manual com o service oficial.

Não mova o antipadrão para produção.

### Parte 3 — Primary

Remova temporariamente `@Primary`.

Observe a falha do probe sem qualifier.

Restaure.

### Parte 4 — Qualifier

Troque o qualifier do service para detailed.

Confirme o result.

Restaure compact.

### Parte 5 — Collection

Adicione formatter temporário com ordem 15.

Confirme a posição.

Remova antes do commit.

### Parte 6 — Optional

Substitua provider por Optional em uma fixture.

Compare momento de resolução.

### Parte 7 — Ciclo

Desenhe um ciclo entre service, repository e formatter.

Proponha duas refatorações.

### Parte 8 — ADR

Registre:

```text
constructor injection;

construtor único sem Autowired;

campos final;

Primary somente para default;

qualifier para semântica;

custom qualifier;

collections ordenadas;

ObjectProvider apenas opcional;

ciclos proibidos;

field injection proibida.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 360 foi preservada;
- o mesmo projeto foi continuado;
- Dependency Injection foi explicada;
- DI foi relacionada a IoC;
- dependência obrigatória foi explicada;
- constructor injection foi adotada;
- construtor único foi usado;
- `@Autowired` foi omitido no construtor único;
- múltiplos construtores foram estudados;
- seleção por `@Autowired` foi demonstrada em teste;
- `required=true` foi explicado;
- dependências obrigatórias falharam rápido;
- fields de dependência são private final;
- `final` não foi confundido com thread safety;
- field injection foi explicada;
- field injection não foi usada em produção;
- setter injection foi explicada;
- setter não foi adotado para dependência obrigatória;
- method injection foi reconhecida;
- RuntimeMessageFormatter foi criado;
- formatter compacto foi criado;
- formatter detalhado foi criado;
- `@Primary` foi usado;
- função de primary foi explicada;
- primary não removeu beans da collection;
- `@Qualifier` foi usado;
- qualifier restringiu candidatos por tipo;
- nome de bean como fallback foi explicado;
- qualifier customizado foi criado;
- `@RuntimeFormat` possui retention runtime;
- `@RuntimeFormat` possui targets adequados;
- `@RuntimeFormat` usa `@Qualifier`;
- formatter compacto recebeu qualifier;
- formatter detalhado recebeu qualifier;
- service recebeu qualifier semântico;
- custom qualifier foi testado;
- qualifier inexistente falhou;
- List de formatters foi injetada;
- todos os formatters foram recebidos;
- `@Order` foi usado;
- ordem foi determinística;
- Map de beans foi observado em teste;
- nomes técnicos não viraram regra de negócio;
- RuntimeMessageRepository foi evoluído;
- RuntimeMessageResult foi criado;
- result não virou bean;
- RuntimeMessageService foi evoluído;
- repository foi injetado;
- formatter foi injetado;
- Clock foi injetado;
- service não criou dependências com new;
- teste unitário sem Spring foi criado;
- fake repository foi usado;
- fake formatter foi usado;
- Clock fixo foi usado;
- DefaultFormatterProbe foi criado;
- default recebeu primary;
- RuntimeMessageFormatterCatalog foi criado;
- lista foi copiada defensivamente;
- RuntimeDiagnosticsHook foi criado;
- interface não virou bean;
- RuntimeDiagnosticsSupport foi criado;
- profile diagnostics foi usado;
- ObjectProvider foi usado;
- provider foi limitado à integração opcional;
- provider não virou Service Locator;
- `getIfAvailable` foi usado;
- ausência do hook não falhou;
- presença do hook foi validada;
- Optional foi estudado;
- Optional empty foi testado;
- Optional present foi testado;
- Optional não substituiu dependências obrigatórias;
- diferença entre Optional e ObjectProvider foi explicada;
- lazy access foi explicado;
- lazy não foi usado indiscriminadamente;
- DependencyEdge foi criado;
- DependencyGraphDiagnostics foi criado;
- grafo ficou filtrado;
- grafo não tentou inspecionar todo o Boot;
- ciclo de constructor injection foi criado em teste;
- ciclo não foi criado em produção;
- contexto falhou com ciclo;
- circular references permaneceu false;
- propriedade para habilitar ciclo não foi adicionada;
- `@Lazy` não foi usado como correção automática;
- redesign do ciclo foi demonstrado;
- construtor grande foi tratado como sinal de design;
- ConstructorInjectionWiringIT foi criado;
- RuntimeMessageServiceTest foi criado;
- PrimaryAndQualifierIT foi criado;
- CustomQualifierIT foi criado;
- CollectionInjectionIT foi criado;
- OptionalDependencyIT foi criado;
- ObjectProviderIT foi criado;
- SingleConstructorAutowiredTest foi criado;
- MultipleConstructorResolutionTest foi criado;
- FieldInjectionArchitectureTest foi criado;
- CircularDependencyIT foi criado;
- DependencyGraphDiagnosticsIT foi criado;
- testes de falha foram assertions controladas;
- contextos temporários foram fechados;
- profiles foram isolados;
- system properties foram restauradas;
- documentação de DI foi criada;
- constructor, field e setter foram comparados;
- resolução de construtores foi documentada;
- primary e qualifier foram documentados;
- custom qualifier foi documentado;
- collections e ordering foram documentados;
- optional e provider foram documentados;
- circular dependencies foram documentadas;
- teste sem Spring foi documentado;
- grafo baseline foi documentado;
- scripts foram criados;
- testes isolados passaram;
- suite completa passou;
- package passou;
- jar executou;
- profile local continuou funcionando;
- nenhum controller foi criado;
- nenhum endpoint foi criado;
- nenhum banco foi adicionado;
- JPA não foi adicionado;
- Flyway não foi adicionado;
- Security não foi adicionada;
- lifecycle callbacks não foram antecipados;
- aula 362 não foi antecipada;
- ponte para a aula 362 está correta;
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
git commit -m "feat(m14): aplicar constructor injection nos beans"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- fixtures circulares em produção;
- field injection;
- propriedade que habilita referências circulares;
- classes temporárias do exercício.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você conectou os beans registrados na aula 360 por meio de Dependency Injection.

O mapa consolidado ficou:

```text
constructor injection:
dependências obrigatórias.

single constructor:
sem @Autowired.

private final:
referências estáveis.

@Primary:
candidato default.

@Qualifier:
seleção explícita.

custom qualifier:
semântica.

List<T>:
todos os candidatos.

@Order:
ordem previsível.

Optional<T>:
ausência válida.

ObjectProvider<T>:
acesso opcional ou lazy.

circular dependency:
falha de design.
```

Você comprovou:

```text
service criado sem new de colaboradores;

repository injetado;

Clock injetado;

formatter compacto selecionado;

formatter detalhado disponível;

primary funcionando;

qualifier funcionando;

lista ordenada com dois formatters;

hook diagnostics ausente sem profile;

hook diagnostics presente com profile;

teste unitário sem contexto;

field injection ausente;

ciclo falhando;

redesign do ciclo iniciando corretamente.
```

A decisão central foi:

```text
dependencias obrigatorias devem aparecer
no construtor e o objeto deve nascer valido.
```

A próxima aula será:

```text
362 - M14.07 - Ciclo de vida de beans
```

Nela, você continuará no mesmo projeto e estudará:

- registro da bean definition;
- criação do bean;
- resolução de dependências;
- constructor;
- property population;
- aware callbacks;
- BeanPostProcessor antes da inicialização;
- `@PostConstruct`;
- `InitializingBean`;
- init method;
- bean pronto;
- `SmartInitializingSingleton`;
- uso;
- fechamento do contexto;
- `@PreDestroy`;
- `DisposableBean`;
- destroy method;
- ordem de callbacks;
- singleton eager;
- lazy initialization;
- `@Lazy`;
- scopes;
- prototype;
- shutdown;
- recursos externos;
- testes de lifecycle.

A aula 361 respondeu:

```text
como os beans recebem
suas dependencias?
```

A aula 362 responderá:

```text
em que ordem o container cria,
inicializa, disponibiliza e destroi esses beans?
```

---

# Material complementar

## Checkpoint final

- [ ] Uso constructor injection para dependências obrigatórias.
- [ ] Sei resolver múltiplos candidatos conscientemente.
- [ ] Sei diferenciar primary, qualifier e custom qualifier.
- [ ] Sei usar Optional e ObjectProvider sem esconder contratos.
- [ ] Sei reconhecer e redesenhar dependências circulares.

---

## Troubleshooting adicional

### NoUniqueBeanDefinitionException

Existem múltiplos candidatos sem seleção suficiente.

### NoSuchBeanDefinitionException

Tipo ou qualifier solicitado não possui candidato.

### BeanCreationException com ciclo

Revise o grafo; não habilite circular references automaticamente.

### Teste unitario exige contexto

A classe provavelmente esconde dependências ou usa field injection.

### Optional sempre vazio

Revise profile, scan, tipo e qualifier.

### Collection fora de ordem

Use metadata explícita de ordenação.

---

## Perguntas de revisao

1. O que é Dependency Injection?
2. Qual relação com IoC?
3. Onde colocar dependência obrigatória?
4. Construtor único precisa de `@Autowired`?
5. Por que usar fields final?
6. Qual problema do field injection?
7. Quando setter pode ser aceitável?
8. O que faz `@Primary`?
9. O que faz `@Qualifier`?
10. Por que criar qualifier customizado?
11. Primary remove outros beans da lista?
12. Como ordenar uma lista injetada?
13. Quando usar Optional?
14. Quando usar ObjectProvider?
15. Provider pode virar Service Locator?
16. O que é dependência circular?
17. Circular references devem ser habilitadas?
18. Como corrigir um ciclo?
19. O que um construtor grande revela?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Entrega de colaboradores ao objeto.
2. É uma forma de inversão de controle.
3. No construtor.
4. Não.
5. Para impedir reatribuição.
6. Esconde contrato e prejudica testes.
7. Dependência realmente opcional ou reconfigurável.
8. Define candidato default singular.
9. Restringe candidatos.
10. Expressar semântica.
11. Não.
12. Com `@Order` ou `Ordered`.
13. Ausência válida definida na construção.
14. Acesso opcional ou lazy.
15. Sim, se usado indiscriminadamente.
16. A depende de B e B depende de A.
17. Não como solução padrão.
18. Redesenhar responsabilidades.
19. Responsabilidades excessivas.
20. Ciclo de vida de beans.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 361 - M14.06 - Injecao de dependencia constructor injection

- Continuei no projeto `formacao-java-backend-api`.
- Relacionei Dependency Injection a Inversion of Control.
- Identifiquei dependências obrigatórias.
- Adotei constructor injection.
- Mantive um único construtor por bean de aplicação.
- Omiti `@Autowired` no construtor único.
- Mantive fields de dependência como `private final`.
- Comparei constructor, field e setter injection.
- Proibi field injection no código de produção.
- Entendi quando setter pode ser aceitável.
- Evoluí `RuntimeMessageRepository`.
- Criei `RuntimeMessageFormatter`.
- Criei formatter compacto e detalhado.
- Usei `@Primary` para o default.
- Usei `@Qualifier` para seleção explícita.
- Criei o qualifier customizado `@RuntimeFormat`.
- Injetei repository, formatter e Clock no service.
- Criei `RuntimeMessageResult` fora do container.
- Testei o service sem Spring.
- Usei fake repository, fake formatter e Clock fixo.
- Injetei todos os formatters em uma lista.
- Ordenei formatters com `@Order`.
- Comprovei que primary não reduz collections.
- Estudei `Optional<T>`.
- Usei `ObjectProvider<T>` para integração opcional.
- Mantive provider fora do papel de Service Locator.
- Registrei hook somente no profile diagnostics.
- Testei presença e ausência do hook.
- Criei um grafo filtrado de dependências.
- Reproduzi uma dependência circular em teste.
- Mantive circular references desabilitadas.
- Não usei `@Lazy` como correção automática.
- Redesenhei o ciclo.
- Criei teste arquitetural contra field injection.
- Mantive controllers, endpoints e banco fora do escopo.
- Próxima aula: Ciclo de vida de beans.
```

---

## Referencia tecnica curta

```text
DI:
colaboradores entregues.

Constructor:
contrato.

Final:
referência estável.

Primary:
default.

Qualifier:
seleção.

Custom qualifier:
semântica.

List:
todos.

Optional:
ausência válida.

Provider:
acesso sob demanda.

Cycle:
redesign.
```

Regra final:

```text
dependencias obrigatorias de beans Spring devem ser declaradas em um unico construtor, armazenadas em fields final e resolvidas de forma deterministica por tipo, Primary ou Qualifier; field injection deve ser evitada, optionalidade deve ser real e localizada, collections precisam de ordem explicita, ObjectProvider nao deve virar Service Locator e dependencias circulares devem produzir redesign arquitetural em vez de configuracoes que escondem o problema.
```
