# 369 - M14.14 - Bean Validation

## Apresentacao da aula

Na aula 368, você retirou a responsabilidade de conversão dos controllers e concentrou o mapping em componentes explícitos por feature.

O fluxo atual ficou:

```text
HTTP request;

binding Spring MVC;

request DTO;

web mapper;

command de aplicacao;

service;

result ou modelo interno;

web mapper;

response DTO;

ResponseEntity;

HTTP response.
```

Os contratos já estão separados.

Os mappers já controlam quais campos atravessam a fronteira.

Agora surge a próxima pergunta:

```text
como declarar que uma entrada convertida
nao e valida para o contrato?
```

A aula 365 diferenciou:

```text
binding;

validation;

regra de negocio.
```

Binding responde:

```text
o texto ou JSON pode ser convertido
para o tipo Java declarado?
```

Validation responde:

```text
o valor convertido respeita
as regras declarativas do contrato?
```

Regra de negócio responde:

```text
a operacao e permitida
no estado atual da aplicacao?
```

Exemplos:

```text
limit=abc:
falha de binding.

limit=-1:
converte para int,
mas falha de validation.

value em branco:
JSON valido,
record criado,
constraint violada.

mensagem duplicada:
entrada estruturalmente valida,
mas regra de negocio rejeita.
```

Nesta aula, você adicionará Jakarta Validation ao projeto Spring Boot.

O provider utilizado será o Hibernate Validator, gerenciado pelo Spring Boot por meio do starter de validation.

A stack conceitual será:

```text
Jakarta Validation:
especificacao e API.

Hibernate Validator:
implementacao de referencia.

Spring Validation:
integracao com o container e MVC.

Spring Boot:
auto-configuracao e dependency management.
```

Serão estudadas constraints prontas:

- `@NotNull`;
- `@NotBlank`;
- `@NotEmpty`;
- `@Size`;
- `@Min`;
- `@Max`;
- `@Positive`;
- `@PositiveOrZero`;
- `@Pattern`;
- `@Email`.

Você também praticará:

- constraints em record components;
- `@Valid`;
- `@Validated`;
- request body validation;
- path variable validation;
- request param validation;
- method validation;
- validação programática;
- `Validator`;
- `ConstraintViolation`;
- container element constraints;
- validação em listas;
- cascata em objetos aninhados;
- mensagens;
- message interpolation;
- locale;
- grupos em nível conceitual;
- testes com MockMvc;
- testes com servidor real;
- distinção entre exceções MVC.

A implementação atualizará contratos existentes.

O request de criação passará a exigir:

```text
value:
nao nulo;
nao blank;
entre 3 e 120 caracteres.
```

O request de preview passará a exigir:

```text
format:
nao nulo.

messages:
nao nula;
nao vazia;
no maximo 10 itens.

cada mensagem:
nao blank;
no maximo 120 caracteres.
```

A query passará a exigir:

```text
limit:
entre 1 e 50.
```

A posição e os identificadores em paths passarão a exigir:

```text
valor positivo.
```

A validação será executada antes do mapper e do service.

Quando uma request for inválida:

```text
controller:
nao executa o caso de uso.

mapper:
nao e chamado.

service:
nao e chamado.
```

A resposta continuará usando o tratamento padrão da infraestrutura.

Nesta aula, você não criará ainda:

- body de erro oficial;
- `@ControllerAdvice`;
- `@ExceptionHandler`;
- Problem Details customizado;
- error code;
- lista de field errors pública;
- correlation id;
- constraint customizada;
- validator customizado;
- validação entre múltiplos campos;
- validação consultando repository.

Esses pontos pertencem a aulas posteriores.

A próxima aula será:

```text
370 - M14.15 - Validacoes customizadas
```

Por isso, a aula atual utiliza somente constraints fornecidas pela especificação ou pelo provider já presente.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
365:
binding de entrada.

366:
ResponseEntity.

367:
DTOs.

368:
mappers manuais.

369:
Bean Validation.

370:
validacoes customizadas.

371:
service layer, use cases e transacoes.

372:
tratamento global de erros.
```

A aula 368 respondeu:

```text
onde converter os objetos
entre as camadas?
```

A aula 369 responderá:

```text
como declarar e executar
regras de validade sobre as entradas?
```

Nesta aula:

```text
starter validation:
sim.

jakarta.validation:
sim.

Hibernate Validator:
sim.

constraints prontas:
sim.

records:
sim.

@Valid:
sim.

@Validated:
sim.

request body:
sim.

path e query:
sim.

method validation:
sim.

container elements:
sim.

cascata:
sim.

mensagens:
sim.

locale:
sim.

groups:
conceitual.

constraint customizada:
nao.

ControllerAdvice:
nao.

body de erro:
nao.

service layer profunda:
nao.
```

A regra central será:

```text
constraints descrevem validade estrutural
e devem executar antes
da regra de negocio.
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
├── beans
│   └── validation
│       └── RuntimeMessageValidationProbe.java
└── web
    ├── controller
    │   ├── ManagedRuntimeMessageController.java
    │   └── RuntimeMessageController.java
    ├── request
    │   ├── CreateManagedRuntimeMessageRequest.java
    │   └── RuntimeMessagePreviewRequest.java
    └── validation
        └── ValidationLimits.java
```

Resources:

```text
src/main/resources
├── ValidationMessages.properties
└── ValidationMessages_pt_BR.properties
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── validation
│   ├── ValidatorInfrastructureIT.java
│   ├── ProgrammaticBeanValidationTest.java
│   ├── ContainerElementValidationTest.java
│   ├── CascadedValidationTest.java
│   ├── ConstraintNullSemanticsTest.java
│   ├── ValidationMessagesLocaleTest.java
│   └── ServiceMethodValidationIT.java
└── web
    ├── RequestBodyBeanValidationWebMvcTest.java
    ├── PathQueryMethodValidationWebMvcTest.java
    ├── BeanValidationExceptionTypeWebMvcTest.java
    ├── BeanValidationArchitectureTest.java
    └── BeanValidationLiveServerIT.java
```

Documentação externa:

```text
docs
├── jakarta-validation-stack.md
├── built-in-constraints.md
├── valid-vs-validated.md
├── request-body-validation.md
├── method-validation-mvc.md
├── container-element-validation.md
├── cascaded-validation.md
├── null-semantics.md
├── validation-messages-locale.md
├── binding-validation-business-rule.md
└── bean-validation-baseline.md
```

Scripts:

```text
scripts
├── 69_executar_testes_validation.ps1
├── 70_testar_request_body_invalido.ps1
├── 71_testar_path_query_invalidos.ps1
├── 72_testar_container_elements.ps1
├── 73_testar_mensagens_validation.ps1
└── 74_executar_teste_live_validation.ps1
```

Resultados esperados:

```text
starter validation:
presente sem versao explicita.

Validator:
bean disponivel.

request body valido:
service chamado.

value blank:
400.

value menor que 3:
400.

value maior que 120:
400.

format ausente:
400.

messages vazia:
400.

mais de 10 mensagens:
400.

elemento blank:
400.

limit 0:
400.

limit 51:
400.

position 0:
400.

id negativo:
400.

binding abc:
400 antes da validation numerica.

request body invalido:
MethodArgumentNotValidException.

constraint direta em parametro:
HandlerMethodValidationException.

controller com @Validated na classe:
zero.

service probe com @Validated:
method validation ativa.

constraint customizada:
zero.
```

---

## Conceito essencial

### Jakarta Validation

Jakarta Validation define:

- annotations de constraint;
- metadata;
- API `Validator`;
- violations;
- cascata;
- method validation;
- grupos;
- message interpolation;
- integração com providers.

Os imports atuais utilizam:

```java
jakarta.validation...
```

Não use:

```java
javax.validation...
```

O namespace antigo não pertence à stack Jakarta atual do projeto.

---

### Provider

A especificação não executa sozinha.

É necessário um provider.

O projeto utilizará Hibernate Validator por meio do starter do Spring Boot.

Não fixe manualmente versão do provider.

O dependency management do Boot mantém versões compatíveis.

---

### Starter de validation

Adicione ao `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Não declare `<version>`.

Depois execute:

```powershell
.\mvnw.cmd dependency:tree
```

Confirme a presença da API e do provider.

---

### LocalValidatorFactoryBean

A integração Spring utiliza `LocalValidatorFactoryBean` como ponte entre:

```text
jakarta.validation.Validator;

Spring Validator;

ValidatorFactory.
```

O bean também integra:

- message source;
- criação de validators;
- container Spring;
- configuração do provider.

Nesta aula, você apenas confirma a infraestrutura.

A customização de `ConstraintValidator` ficará para a aula 370.

---

### Constraint

Constraint é uma regra declarada por annotation.

Exemplo:

```java
@NotBlank
String value
```

A annotation possui metadata como:

- message;
- groups;
- payload.

A lógica de validação é fornecida por validators associados.

---

### @NotNull

`@NotNull` exige que o valor não seja `null`.

Ele não rejeita:

```text
String vazia;

String com espacos;

colecao vazia.
```

Use quando a ausência do valor é inválida.

---

### @NotBlank

`@NotBlank` é apropriada para texto.

Ela rejeita:

- `null`;
- string vazia;
- texto composto apenas por whitespace.

Ela não substitui `@Size` quando existe limite de comprimento.

---

### @NotEmpty

`@NotEmpty` exige valor não nulo e tamanho maior que zero.

É aplicável a tipos como:

- `CharSequence`;
- `Collection`;
- `Map`;
- array.

Para texto sem espaços, prefira `@NotBlank`.

Para coleção que precisa possuir item, `@NotEmpty` é adequado.

---

### @Size

`@Size` limita tamanho de:

- texto;
- coleção;
- mapa;
- array.

Exemplo:

```java
@Size(
        min = 3,
        max = 120
)
```

A constraint considera `null` válido.

Combine com `@NotNull`, `@NotBlank` ou `@NotEmpty` quando null não for permitido.

---

### @Min e @Max

`@Min` e `@Max` validam limites inclusivos de números.

Exemplo:

```java
@Min(1)
@Max(50)
int limit
```

Em tipos primitivos, null não existe.

Em wrappers, combine com `@NotNull` quando necessário.

---

### @Positive e @PositiveOrZero

`@Positive` exige número maior que zero.

`@PositiveOrZero` aceita zero.

Exemplo:

```java
@Positive
long id
```

Para números nullable, essas constraints aceitam null.

Use `@NotNull` quando ausência não for aceita.

---

### @Pattern

`@Pattern` valida texto por expressão regular.

Exemplo conceitual:

```java
@Pattern(
        regexp = "[A-Z]{3}"
)
String code
```

Não use regex gigante para validar estruturas complexas.

Nesta aula, a annotation será testada em fixture.

---

### @Email

`@Email` verifica formato de endereço eletrônico segundo a implementação.

Ela não confirma:

- existência da caixa;
- propriedade;
- entrega;
- domínio corporativo autorizado.

Use como validação de formato.

O endpoint atual não precisa de email.

A constraint será demonstrada programaticamente.

---

### Constraints em records

Jakarta Validation suporta constraints em record components.

Exemplo:

```java
public record CreateManagedRuntimeMessageRequest(
        @NotBlank
        @Size(
                min = 3,
                max = 120
        )
        String value
) {
}
```

O record continua sendo DTO imutável.

A annotation descreve o contrato do component.

---

### @Valid

`@Valid` ativa validação em cascata.

No controller:

```java
public ResponseEntity<?> create(
        @Valid
        @RequestBody
        CreateManagedRuntimeMessageRequest request
) {
}
```

O `@RequestBody` realiza desserialização.

O `@Valid` solicita validação do objeto criado.

Sem `@Valid`, constraints internas do request body não são aplicadas automaticamente nesse ponto.

---

### @Validated

`@Validated` é uma annotation Spring.

Ela pode:

- acionar method validation em beans;
- selecionar validation groups;
- atuar como variação de `@Valid` em alguns pontos Spring.

No laboratório, será usada em:

```text
RuntimeMessageValidationProbe.
```

Não será colocada no nível de classe dos controllers.

---

### Validacao MVC integrada

Spring MVC possui validação integrada para métodos `@RequestMapping`.

Existem dois caminhos importantes.

Primeiro:

```text
@RequestBody + @Valid
sem constraint direta no metodo.
```

Uma falha normalmente produz:

```text
MethodArgumentNotValidException.
```

Segundo:

```text
constraint direta em @PathVariable,
@RequestParam ou return value.
```

A validação ocorre no método e uma falha produz:

```text
HandlerMethodValidationException.
```

A aplicação precisa conhecer essa diferença antes de criar tratamento global.

---

### Evitar @Validated no controller

Para utilizar a validação de método integrada do Spring MVC atual, não coloque `@Validated` no nível de classe do controller.

O type-level `@Validated` pode direcionar o fluxo para method validation por proxy AOP.

Nesta aula, controllers permanecem sem essa annotation.

`@Validated` será reservado ao bean de aplicação usado no laboratório.

---

### MethodArgumentNotValidException

Essa exception representa erros ao validar um objeto de entrada individual, como um request body com `@Valid`.

Ela possui informações de binding e field errors.

Nesta aula, os testes validam:

- status 400;
- tipo da exception;
- service não chamado.

O body padrão não vira contrato.

---

### HandlerMethodValidationException

Essa exception representa violations de method validation no MVC.

Ela pode reunir erros de:

- path variables;
- request params;
- headers;
- return value;
- parâmetros com cascata quando method validation cobre o método.

Para entrada inválida, o status é 400.

Return value inválido representa falha do servidor e pode resultar em 500.

A aula não adicionará constraint de retorno em produção.

---

### Container element constraints

É possível validar elementos dentro de containers.

Exemplo:

```java
List<
        @NotBlank
        @Size(max = 120)
        String
> messages
```

A lista possui constraints próprias.

Cada elemento também possui constraints.

São responsabilidades diferentes:

```text
@NotEmpty na lista:
exige ao menos um item.

@Size(max=10) na lista:
limita quantidade.

@NotBlank no elemento:
rejeita mensagem vazia.
```

---

### Cascata

Para validar objeto aninhado, marque a referência com:

```java
@Valid
```

Exemplo conceitual:

```java
record BatchRequest(
        @Valid
        @NotNull
        OptionsRequest options
) {
}
```

`@NotNull` rejeita ausência.

`@Valid` percorre constraints do objeto presente.

A cascata será demonstrada em fixture sem alterar o contrato JSON atual.

---

### Null e cascata

`@Valid` sozinho não rejeita null.

Se o objeto aninhado é obrigatório, combine:

```java
@NotNull
@Valid
```

Essa composição é importante.

Cascata responde:

```text
se o objeto existir,
validar internamente.
```

---

### Null semantics

Muitas constraints consideram null válido.

Exemplos comuns:

- `@Size`;
- `@Min`;
- `@Max`;
- `@Positive`;
- `@Pattern`;
- `@Email`.

Isso permite composição.

Use `@NotNull`, `@NotBlank` ou `@NotEmpty` para declarar presença.

Os testes devem impedir suposições erradas.

---

### Validacao programatica

Injete:

```java
jakarta.validation.Validator
```

Depois:

```java
Set<ConstraintViolation<T>> violations =
        validator.validate(object);
```

Isso é útil para:

- testes unitários;
- processamento fora do MVC;
- validação explícita em integração;
- inspeção de metadata.

Não chame `Validation.buildDefaultValidatorFactory()` repetidamente dentro da aplicação Spring.

Use o bean configurado pelo container.

---

### ConstraintViolation

Uma violation contém informações como:

- root bean;
- invalid value;
- property path;
- message;
- message template;
- constraint descriptor.

Em testes, valide principalmente:

- property path;
- message template ou message estável;
- quantidade;
- constraint type.

Evite depender de ordem do `Set`.

---

### Mensagem da constraint

A annotation pode usar:

```java
message = "{runtime.message.value.not-blank}"
```

A chave é resolvida pelo mecanismo de mensagens.

Isso separa:

- regra;
- texto exibido;
- locale.

Não espalhe texto português diretamente em cada annotation sem estratégia.

---

### ValidationMessages

Crie:

```text
ValidationMessages.properties;

ValidationMessages_pt_BR.properties.
```

Exemplo:

```properties
runtime.message.value.not-blank=message value must not be blank
```

e:

```properties
runtime.message.value.not-blank=o valor da mensagem nao pode ficar em branco
```

O arquivo base deve existir como fallback.

---

### Message interpolation

O provider resolve placeholders.

Exemplo:

```properties
runtime.message.value.size=o valor deve possuir entre {min} e {max} caracteres
```

`{min}` e `{max}` vêm dos atributos da constraint.

Não use interpolação para executar regra.

---

### Locale

A mensagem pode variar por locale.

Nos testes programáticos, utilize um interpolator ou contexto de locale compatível com a infraestrutura.

Nos testes MVC, configure o locale da request quando necessário.

A estrutura de erro pública ainda não existe, então o objetivo será validar o mecanismo, não publicar texto definitivo.

---

### Groups

Groups permitem executar subconjuntos de constraints.

Toda constraint sem group explícito pertence a:

```text
Default.
```

Exemplos futuros:

- criação;
- atualização;
- importação.

Nesta aula, groups serão somente conceituais.

Não crie interfaces de group sem uma necessidade real.

O aprofundamento pode ocorrer junto de cenários customizados.

---

### Method validation fora do MVC

Spring Boot habilita method validation quando um provider está no classpath e o bean alvo usa `@Validated`.

Exemplo:

```java
@Component
@Validated
public class RuntimeMessageValidationProbe {

    public String repeat(
            @NotBlank
            String value,

            @Positive
            int times
    ) {
    }
}
```

Chamada inválida pelo proxy gera violation de método.

Não invoque o método por self-invocation esperando que o proxy intercepte.

---

### Self-invocation

Quando um método do mesmo objeto chama outro método validado diretamente:

```text
this.validatedMethod(...)
```

a chamada pode não passar pelo proxy.

Não use method validation como substituto de invariantes do domínio.

O laboratório testa chamadas através do bean Spring.

---

### Validation nao e sanitizacao

Validation rejeita valor inválido.

Sanitização transforma ou remove conteúdo.

Exemplo:

```text
trim no mapper:
normalização.

@NotBlank:
validation.
```

Não altere silenciosamente dado malicioso para fazê-lo passar.

---

### Validation nao e seguranca completa

Constraints não substituem:

- autenticação;
- autorização;
- escaping;
- encoding;
- proteção contra injection;
- limite de payload no servidor;
- rate limit;
- regras de acesso.

Elas protegem parte do contrato estrutural.

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

### 2. Adicionar o starter

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Não fixe versão.

Execute:

```powershell
.\mvnw.cmd dependency:tree
```

---

### 3. Criar ValidationLimits

Classe final utilitária:

```java
public final class ValidationLimits {

    public static final int MESSAGE_MIN = 3;
    public static final int MESSAGE_MAX = 120;
    public static final int PREVIEW_MAX_ITEMS = 10;
    public static final int QUERY_LIMIT_MIN = 1;
    public static final int QUERY_LIMIT_MAX = 50;

    private ValidationLimits() {
        throw new AssertionError(
                "no instances"
        );
    }
}
```

Use constants somente onde annotation aceita constant expression.

---

### 4. Validar create request

Atualize:

```java
public record CreateManagedRuntimeMessageRequest(
        @NotBlank(
                message =
                        "{runtime.message.value.not-blank}"
        )
        @Size(
                min =
                        ValidationLimits.MESSAGE_MIN,
                max =
                        ValidationLimits.MESSAGE_MAX,
                message =
                        "{runtime.message.value.size}"
        )
        String value
) {
}
```

Imports `jakarta.validation.constraints`.

---

### 5. Validar preview request

Atualize:

```java
public record RuntimeMessagePreviewRequest(
        @NotNull(
                message =
                        "{runtime.preview.format.not-null}"
        )
        RuntimeFormatOption format,

        @NotEmpty(
                message =
                        "{runtime.preview.messages.not-empty}"
        )
        @Size(
                max =
                        ValidationLimits.PREVIEW_MAX_ITEMS,
                message =
                        "{runtime.preview.messages.size}"
        )
        List<
                @NotBlank(
                        message =
                                "{runtime.preview.item.not-blank}"
                )
                @Size(
                        max =
                                ValidationLimits.MESSAGE_MAX,
                        message =
                                "{runtime.preview.item.size}"
                )
                String
        > messages
) {

    public RuntimeMessagePreviewRequest {
        messages =
                messages == null
                        ? null
                        : List.copyOf(messages);
    }
}
```

Não normalize null para lista vazia antes da validation.

Caso contrário, `@NotNull` ou `@NotEmpty` perderia parte da distinção.

---

### 6. Adicionar @Valid aos bodies

No POST de criação:

```java
@Valid
@RequestBody
CreateManagedRuntimeMessageRequest request
```

No preview:

```java
@Valid
@RequestBody
RuntimeMessagePreviewRequest request
```

Mantenha `@Valid` próximo ao parâmetro.

---

### 7. Validar path variables

Exemplos:

```java
@PathVariable("position")
@Positive(
        message =
                "{runtime.position.positive}"
)
int position
```

e:

```java
@PathVariable("id")
@Positive(
        message =
                "{runtime.id.positive}"
)
long id
```

Não coloque `@Validated` no controller.

---

### 8. Validar request param limit

No endpoint de query:

```java
@RequestParam(
        name = "limit",
        defaultValue = "10"
)
@Min(
        value =
                ValidationLimits.QUERY_LIMIT_MIN,
        message =
                "{runtime.limit.min}"
)
@Max(
        value =
                ValidationLimits.QUERY_LIMIT_MAX,
        message =
                "{runtime.limit.max}"
)
int limit
```

O default 10 deve permanecer válido.

---

### 9. Preservar format converter

O converter da aula 365 continua responsável por:

```text
texto desconhecido:
falha de conversão.
```

Bean Validation não substitui conversion.

Um format inexistente continua erro de binding.

---

### 10. Criar mensagens base

`ValidationMessages.properties`:

```properties
runtime.message.value.not-blank=message value must not be blank
runtime.message.value.size=message value must contain between {min} and {max} characters
runtime.preview.format.not-null=preview format is required
runtime.preview.messages.not-empty=preview messages must not be empty
runtime.preview.messages.size=preview accepts at most {max} messages
runtime.preview.item.not-blank=preview message must not be blank
runtime.preview.item.size=preview message must contain at most {max} characters
runtime.position.positive=position must be positive
runtime.id.positive=id must be positive
runtime.limit.min=limit must be at least {value}
runtime.limit.max=limit must be at most {value}
```

---

### 11. Criar mensagens pt-BR

Use texto sem depender de encoding incorreto.

Exemplo:

```properties
runtime.message.value.not-blank=o valor da mensagem nao pode ficar em branco
runtime.message.value.size=o valor da mensagem deve possuir entre {min} e {max} caracteres
runtime.preview.format.not-null=o formato da previa e obrigatorio
runtime.preview.messages.not-empty=a lista de mensagens da previa nao pode ficar vazia
runtime.preview.messages.size=a previa aceita no maximo {max} mensagens
runtime.preview.item.not-blank=uma mensagem da previa nao pode ficar em branco
runtime.preview.item.size=uma mensagem da previa deve possuir no maximo {max} caracteres
runtime.position.positive=a posicao deve ser positiva
runtime.id.positive=o id deve ser positivo
runtime.limit.min=o limite deve ser no minimo {value}
runtime.limit.max=o limite deve ser no maximo {value}
```

Use UTF-8 no projeto.

---

### 12. Criar RuntimeMessageValidationProbe

```java
@Component
@Validated
public class RuntimeMessageValidationProbe {

    public String repeat(
            @NotBlank
            String value,

            @Positive
            int times
    ) {
        return value.repeat(
                times
        );
    }
}
```

Ele existe somente para method validation fora do MVC.

Não coloque regra de negócio real.

---

### 13. Criar ValidatorInfrastructureIT

Injete:

```text
jakarta.validation.Validator;

ValidatorFactory.
```

Confirme:

- beans disponíveis;
- provider ativo;
- request válido sem violations;
- request inválido com violations.

Não acople o teste ao nome interno de classes de proxy.

---

### 14. Criar ProgrammaticBeanValidationTest

Use `Validator`.

Teste fixtures com:

- `@NotNull`;
- `@NotBlank`;
- `@NotEmpty`;
- `@Size`;
- `@Min`;
- `@Max`;
- `@Positive`;
- `@PositiveOrZero`;
- `@Pattern`;
- `@Email`.

Valide property paths e constraint annotations.

---

### 15. Criar ConstraintNullSemanticsTest

Para cada constraint relevante, confirme se null é aceito.

Demonstre:

```text
@Size null:
valido.

@NotNull null:
invalido.

@NotBlank null:
invalido.

@Positive em wrapper null:
valido.
```

Documente a necessidade de composição.

---

### 16. Criar ContainerElementValidationTest

Crie preview request com:

```text
um elemento blank;

um elemento acima de 120.
```

Valide paths semelhantes a:

```text
messages[0].<list element>.
```

Não fixe representação textual inteira do path se ela variar.

Inspecione nodes ou confirme que o path aponta para `messages`.

---

### 17. Criar CascadedValidationTest

Fixtures:

```java
record PreviewOptions(
        @NotBlank
        String title
) {
}

record BatchPreviewRequest(
        @NotNull
        @Valid
        PreviewOptions options
) {
}
```

Cenários:

- options null;
- options presente com title blank;
- options válida.

Não altere o JSON de produção.

---

### 18. Criar ValidationMessagesLocaleTest

Valide a mesma violation com:

- locale base;
- `pt-BR`.

Confirme:

- chave resolvida;
- placeholders interpolados;
- mensagens diferentes;
- regra igual.

Não transforme a mensagem textual em error code.

---

### 19. Criar ServiceMethodValidationIT

Injete `RuntimeMessageValidationProbe`.

Chame pelo bean Spring.

Valide:

- chamada válida;
- value blank;
- times zero.

Confirme violation de método.

Adicione teste explicativo de self-invocation em fixture somente se puder mantê-lo determinístico.

---

### 20. Criar RequestBodyBeanValidationWebMvcTest

Use `@WebMvcTest`.

Importe mappers reais.

Mocke services.

Cenários de create:

- value válida;
- null;
- blank;
- 2 caracteres;
- 121 caracteres.

Cenários de preview:

- format ausente;
- messages ausente;
- lista vazia;
- 11 itens;
- item blank;
- item longo;
- request válido.

---

### 21. Confirmar service nao chamado

Para cada body inválido:

```text
verifyNoInteractions(service).
```

Ou confirme que o método específico não foi chamado.

O mapper também não deve ser usado para construir command inválido.

---

### 22. Criar PathQueryMethodValidationWebMvcTest

Cenários:

```text
position 1:
sucesso.

position 0:
400.

position -1:
400.

position abc:
400 de binding.

limit 1:
sucesso.

limit 50:
sucesso.

limit 0:
400.

limit 51:
400.

limit abc:
400 de binding.

id 0:
400.
```

Diferencie conversion de validation pelo tipo da exception resolvida.

---

### 23. Criar BeanValidationExceptionTypeWebMvcTest

Cenário body inválido:

```text
MethodArgumentNotValidException.
```

Cenário constraint direta:

```text
HandlerMethodValidationException.
```

Cenário binding numérico inválido:

```text
exception de type mismatch ou equivalente MVC.
```

Valide status 400.

Não adicione handler.

---

### 24. Criar BeanValidationArchitectureTest

Valide:

- starter presente;
- imports `jakarta.validation`;
- zero `javax.validation`;
- controllers sem type-level `@Validated`;
- request bodies com `@Valid`;
- path e query com constraints;
- DTOs sem annotations Spring stereotypes;
- mappers sem constraints de contrato;
- service probe com `@Validated`;
- zero custom `@Constraint`;
- zero `ConstraintValidator`;
- zero ControllerAdvice;
- zero body de erro customizado.

---

### 25. Criar BeanValidationLiveServerIT

Use servidor real e porta aleatória.

Teste:

- create válido;
- create blank;
- preview válido;
- preview item blank;
- query limit 0;
- path position 0;
- binding `abc`.

Valide status e ausência de execução indevida quando observável.

Não adote o JSON padrão de erro como contrato.

---

### 26. Executar curls de body

Arquivo inválido:

```json
{
  "value": " "
}
```

Execute:

```powershell
curl.exe -i `
  -X POST `
  -H "Content-Type: application/json" `
  --data-binary "@invalid-message.json" `
  http://localhost:8081/api/v1/runtime/managed-messages
```

Resultado:

```text
400.
```

Remova o arquivo.

---

### 27. Testar preview invalido

Envie:

```json
{
  "format": "COMPACT",
  "messages": [
    "valid",
    " "
  ]
}
```

Resultado:

```text
400.
```

---

### 28. Testar query fora do intervalo

```powershell
curl.exe -i `
  "http://localhost:8081/api/v1/runtime/messages?limit=51"
```

Resultado:

```text
400.
```

---

### 29. Testar path invalido

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/messages/0
```

Resultado:

```text
400.
```

Compare com:

```text
/messages/abc.
```

Ambos retornam 400, mas por etapas diferentes.

---

### 30. Documentar jakarta-validation-stack.md

Desenhe:

```text
Jakarta Validation API;

Hibernate Validator;

Spring integration;

Spring Boot auto-configuration.
```

Inclua dependency e namespace.

---

### 31. Documentar built-in-constraints.md

Crie matriz com:

- constraint;
- tipos;
- null válido?;
- uso;
- exemplo;
- erro comum.

---

### 32. Documentar valid-vs-validated.md

Explique:

- `@Valid`;
- `@Validated`;
- groups;
- MVC integrado;
- service proxy;
- por que controller não recebe type-level `@Validated`.

---

### 33. Documentar request-body-validation.md

Inclua:

- desserialização;
- `@Valid`;
- constraints em record;
- `MethodArgumentNotValidException`;
- service não executado;
- body de erro ainda provisório.

---

### 34. Documentar method-validation-mvc.md

Inclua:

- constraints diretas;
- `HandlerMethodValidationException`;
- path;
- query;
- return value conceitual;
- diferença para binding.

---

### 35. Documentar container-element-validation.md

Inclua:

- lista;
- constraint da lista;
- constraint do elemento;
- property path;
- cópia defensiva após validação.

---

### 36. Documentar cascaded-validation.md

Inclua:

- `@Valid`;
- `@NotNull`;
- nested record;
- lista de objetos;
- recursão;
- prevenção de ciclos conceitual.

---

### 37. Documentar null-semantics.md

Registre:

```text
constraints que aceitam null;

constraints de presença;

composições corretas;

primitivo versus wrapper.
```

---

### 38. Documentar validation-messages-locale.md

Inclua:

- message key;
- template;
- interpolation;
- placeholders;
- arquivo base;
- pt-BR;
- locale;
- texto versus error code.

---

### 39. Documentar binding-validation-business-rule.md

Matriz:

```text
abc para int:
binding.

-1 no limit:
validation.

mensagem duplicada:
regra de negocio.
```

Inclua camada e exception.

---

### 40. Criar bean-validation-baseline.md

Liste:

- DTO;
- component;
- constraints;
- mensagem;
- teste;
- exception esperada.

---

### 41. Criar scripts

`69_executar_testes_validation.ps1` executa testes programáticos e MVC.

`70_testar_request_body_invalido.ps1` cria payload temporário e remove.

`71_testar_path_query_invalidos.ps1` testa limites e binding.

`72_testar_container_elements.ps1` executa testes de listas.

`73_testar_mensagens_validation.ps1` executa locale e interpolation.

`74_executar_teste_live_validation.ps1` executa servidor real.

---

### 42. Executar testes programaticos

```powershell
.\mvnw.cmd `
  -Dtest=ValidatorInfrastructureIT,ProgrammaticBeanValidationTest,ConstraintNullSemanticsTest,ContainerElementValidationTest,CascadedValidationTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 43. Executar testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=RequestBodyBeanValidationWebMvcTest,PathQueryMethodValidationWebMvcTest,BeanValidationExceptionTypeWebMvcTest test
```

---

### 44. Executar method validation

```powershell
.\mvnw.cmd `
  -Dtest=ServiceMethodValidationIT,ValidationMessagesLocaleTest test
```

---

### 45. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=BeanValidationLiveServerIT test
```

Confirme porta aleatória e contexto fechado.

---

### 46. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 47. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 48. Revisar escopo

Confirme:

```text
starter validation:
presente.

jakarta imports:
presentes.

javax imports:
zero.

@Valid:
bodies.

@Validated:
service probe.

@Validated em controller:
zero.

custom @Constraint:
zero.

ConstraintValidator:
zero.

ControllerAdvice:
zero.

ProblemDetail customizado:
zero.
```

---

### 49. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- payload temporário;
- logs;
- provider com versão manual;
- namespace javax;
- constraint customizada;
- handler antecipado;
- JSON de erro versionado.

---

## Entendendo o que foi feito

### A validade ficou declarativa

Os DTOs e parâmetros passaram a documentar limites próximos ao contrato.

### Binding e validation ficaram observaveis

Entradas textuais inválidas e valores fora da regra falham em etapas diferentes.

### O service ficou protegido

Requests inválidas não chegam aos mappers nem aos casos de uso.

### Listas passaram a validar estrutura e elementos

Quantidade, presença e conteúdo possuem constraints separadas.

### MVC e beans usam integracoes diferentes

Controllers usam a validação integrada; beans de aplicação usam `@Validated` e proxy.

---

## Erros comuns importantes

### Usar somente Size e esperar rejeicao de null

Muitas constraints aceitam null; combine com constraint de presença.

### Colocar Validated no controller sem necessidade

Isso muda o mecanismo e dificulta o tratamento futuro de exceptions MVC.

### Validar regra de negocio com annotation simples

Duplicidade e estado atual pertencem ao caso de uso.

### Normalizar null antes da validation

O contrato perde a capacidade de distinguir ausência de coleção vazia.

### Testar apenas status 400

Valide também a etapa, a exception e a ausência de chamada ao service.

---

## Comandos uteis

### Dependencias

```powershell
.\mvnw.cmd dependency:tree
```

### Testes programaticos

```powershell
.\mvnw.cmd `
  -Dtest=ProgrammaticBeanValidationTest,ContainerElementValidationTest test
```

### Testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=RequestBodyBeanValidationWebMvcTest,PathQueryMethodValidationWebMvcTest test
```

### Buscar namespace antigo

```powershell
Get-ChildItem src -Recurse -Filter "*.java" |
  Select-String `
    -Pattern "javax.validation"
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — NotNull versus NotBlank

Crie fixtures com null, vazio e espaços.

Compare as violations.

### Parte 2 — Size sem presenca

Remova temporariamente `@NotBlank`.

Valide que null pode não violar `@Size`.

Restaure.

### Parte 3 — PositiveOrZero

Crie fixture para quantidade que aceita zero.

Compare com `@Positive`.

### Parte 4 — Pattern e Email

Valide códigos e emails.

Registre os limites dessas constraints.

### Parte 5 — Lista aninhada

Crie lista de objetos com `@Valid`.

Inclua um elemento inválido.

Inspecione o property path.

### Parte 6 — Locale

Execute a mesma violation em inglês e pt-BR.

Confirme placeholders.

### Parte 7 — Self-invocation

Crie fixture com método validado chamado internamente.

Compare chamada direta com chamada pelo proxy.

### Parte 8 — ADR

Registre:

```text
jakarta.validation;

starter sem versao;

@Valid em request body;

constraints diretas em path e query;

controllers sem @Validated de classe;

@Validated em beans com method validation;

constraints de presenca combinadas;

container elements;

mensagens por chave;

custom constraints somente na aula seguinte.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 368 foi preservada;
- o mesmo projeto foi continuado;
- Jakarta Validation, provider, Spring e Boot foram diferenciados;
- `spring-boot-starter-validation` foi adicionado sem versão;
- dependency tree foi inspecionada;
- imports usam `jakarta.validation`;
- nenhum `javax.validation` permaneceu;
- `LocalValidatorFactoryBean` foi explicado;
- constraints e metadata foram explicadas;
- `@NotNull`, `@NotBlank`, `@NotEmpty`, `@Size`, `@Min`, `@Max`, `@Positive`, `@PositiveOrZero`, `@Pattern` e `@Email` foram estudadas;
- semântica de null de cada família foi testada;
- constraints de presença foram combinadas quando necessário;
- record components receberam constraints;
- create request valida blank e tamanho;
- preview valida format, lista, quantidade e elementos;
- listas continuam defensivas sem esconder null antes da validation;
- `@Valid` foi usado nos request bodies;
- path position e ids receberam `@Positive`;
- query limit recebeu `@Min` e `@Max`;
- binding por converter continuou separado;
- controllers não possuem type-level `@Validated`;
- `MethodArgumentNotValidException` foi observada;
- `HandlerMethodValidationException` foi observada;
- erro de conversão foi diferenciado das duas;
- status 400 foi validado;
- body padrão de erro não virou contrato;
- service e mapper não são chamados para body inválido;
- container element constraints foram usadas;
- quantidade da lista e validade do elemento foram separadas;
- cascata com `@Valid` foi demonstrada em fixture;
- `@NotNull` foi combinado com cascata obrigatória;
- `Validator` foi injetado;
- `ValidatorFactory` foi confirmado;
- validação programática foi testada;
- `ConstraintViolation` e property path foram inspecionados;
- ordem do Set não virou contrato;
- messages usam chaves;
- `ValidationMessages.properties` foi criado;
- `ValidationMessages_pt_BR.properties` foi criado;
- placeholders foram interpolados;
- locale foi testado;
- mensagem textual não foi confundida com error code;
- groups foram explicados sem criação prematura;
- `RuntimeMessageValidationProbe` foi criado;
- `@Validated` foi usado no bean de aplicação;
- method validation fora do MVC foi testada pelo proxy;
- self-invocation foi explicada;
- validation foi diferenciada de sanitização, segurança e regra de negócio;
- `ValidatorInfrastructureIT` foi criado;
- `ProgrammaticBeanValidationTest` foi criado;
- `ConstraintNullSemanticsTest` foi criado;
- `ContainerElementValidationTest` foi criado;
- `CascadedValidationTest` foi criado;
- `ValidationMessagesLocaleTest` foi criado;
- `ServiceMethodValidationIT` foi criado;
- `RequestBodyBeanValidationWebMvcTest` foi criado;
- `PathQueryMethodValidationWebMvcTest` foi criado;
- `BeanValidationExceptionTypeWebMvcTest` foi criado;
- `BeanValidationArchitectureTest` foi criado;
- `BeanValidationLiveServerIT` foi criado;
- teste live usou porta aleatória e contexto fechado;
- documentação da stack, constraints, annotations, MVC, cascata, null, mensagens e camadas foi criada;
- baseline foi documentada;
- scripts foram criados;
- testes programáticos, MVC, method validation, live, suite e package passaram;
- nenhuma constraint customizada, `ConstraintValidator`, ControllerAdvice, ProblemDetail, persistência, JPA, Flyway ou Security foi antecipada;
- ponte para a aula 370 está correta;
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
git commit -m "feat(m14): adicionar bean validation aos contratos"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- payload temporário;
- logs;
- versão manual do provider;
- imports javax;
- constraint customizada;
- handler de erro antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, os contratos passaram a declarar validade antes da execução do caso de uso.

O fluxo consolidado ficou:

```text
HTTP input;

binding;

DTO;

Bean Validation;

mapper;

command;

service;

result;

response.
```

Você comprovou:

```text
request body validado;

path validado;

query validada;

records com constraints;

listas e elementos validados;

cascata;

mensagens interpoladas;

locale;

Validator programatico;

method validation em bean;

exceptions MVC distintas;

service protegido.
```

A decisão central foi:

```text
binding converte,
validation verifica o contrato
e o service decide a regra de negocio.
```

A próxima aula será:

```text
370 - M14.15 - Validacoes customizadas
```

Nela, você continuará no mesmo projeto e estudará:

- `@Constraint`;
- annotation customizada;
- `ConstraintValidator`;
- `isValid`;
- null policy;
- mensagem;
- groups;
- payload;
- targets;
- retention;
- class-level constraint;
- validação entre campos;
- constraint para enum ou código;
- injeção Spring em validator;
- validator sem repository indiscriminado;
- composição de constraints;
- `@ReportAsSingleViolation`;
- testes unitários;
- testes MVC;
- mensagens customizadas;
- performance;
- thread safety;
- limites arquiteturais.

A aula 369 respondeu:

```text
como aplicar constraints prontas
sobre requests e parametros?
```

A aula 370 responderá:

```text
como criar regras declarativas
que nao existem nas constraints padrao?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar binding, validation e regra de negócio.
- [ ] Sei escolher constraints de presença, tamanho e número.
- [ ] Sei validar records, listas e objetos aninhados.
- [ ] Sei diferenciar `@Valid`, `@Validated` e os fluxos MVC.
- [ ] Sei testar violations, mensagens e ausência de chamada ao service.

---

## Troubleshooting adicional

### Constraints do body nao executam

Confirme `@Valid`, starter, provider e imports Jakarta.

### Path negativa chega ao controller

Confirme constraint direta e ausência de configuração que desative method validation.

### WebMvcTest nao encontra validator

Confirme dependency e auto-configuração da slice; evite substituir infraestrutura desnecessariamente.

### Mensagem mostra a chave

Confirme nome e localização de `ValidationMessages`.

### Elemento blank da lista passa

Confirme constraint no `TYPE_USE` do elemento, não somente na lista.

### Service method nao valida

Confirme `@Validated`, chamada pelo proxy Spring e método interceptável.

---

## Perguntas de revisao

1. O que Jakarta Validation define?
2. Qual é o papel do Hibernate Validator?
3. Qual dependency foi adicionada?
4. Qual namespace deve ser usado?
5. O que `@NotNull` rejeita?
6. Qual diferença entre `@NotBlank` e `@NotEmpty`?
7. `@Size` rejeita null?
8. Para que serve `@Valid`?
9. Para que serve `@Validated`?
10. Por que não usar `@Validated` na classe controller?
11. Qual exception pode surgir no body?
12. Qual exception pode surgir em path e query?
13. O que são container element constraints?
14. `@Valid` rejeita nested object null?
15. Para que serve `Validator`?
16. O que possui uma `ConstraintViolation`?
17. Como externalizar mensagens?
18. O que são groups?
19. Validation substitui regra de negócio?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. API, metadata e modelo de constraints.
2. Executar a especificação.
3. `spring-boot-starter-validation`.
4. `jakarta.validation`.
5. Null.
6. Texto sem whitespace versus container não vazio.
7. Não.
8. Cascata ou validação do objeto.
9. Method validation e groups Spring.
10. Para usar validação MVC integrada.
11. `MethodArgumentNotValidException`.
12. `HandlerMethodValidationException`.
13. Constraints nos elementos do container.
14. Não.
15. Validação programática.
16. Path, valor, mensagem e descriptor.
17. `ValidationMessages`.
18. Subconjuntos de constraints.
19. Não.
20. Validações customizadas.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 369 - M14.14 - Bean Validation

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei binding, validation e regra de negócio.
- Adicionei `spring-boot-starter-validation` sem versão.
- Usei o namespace `jakarta.validation`.
- Entendi o papel da especificação, do Hibernate Validator, do Spring e do Boot.
- Estudei `@NotNull`, `@NotBlank`, `@NotEmpty` e `@Size`.
- Estudei `@Min`, `@Max`, `@Positive` e `@PositiveOrZero`.
- Estudei `@Pattern` e `@Email`.
- Testei a semântica de null das constraints.
- Adicionei constraints aos record components.
- Usei `@Valid` nos request bodies.
- Validei path variables e request params.
- Mantive controllers sem `@Validated` em nível de classe.
- Diferenciei `MethodArgumentNotValidException` de `HandlerMethodValidationException`.
- Diferenciei falha de binding de falha de validation.
- Validei lista e elementos da lista.
- Pratiquei cascata com objetos aninhados.
- Injetei `Validator` para validação programática.
- Inspecionei `ConstraintViolation`.
- Externalizei mensagens em `ValidationMessages`.
- Testei interpolation e locale pt-BR.
- Entendi validation groups sem criá-los prematuramente.
- Criei um bean com `@Validated` para method validation.
- Entendi o limite de self-invocation.
- Confirmei que requests inválidas não chegam ao service.
- Criei testes programáticos, MVC e com servidor real.
- Não criei constraint customizada.
- Não criei tratamento global de erros.
- Próxima aula: Validações customizadas.
```

---

## Referencia tecnica curta

```text
Jakarta Validation:
especificacao.

Hibernate Validator:
provider.

Valid:
cascata.

Validated:
method validation.

NotBlank:
texto.

NotEmpty:
container.

Size:
tamanho.

Positive:
numero.

Validator:
API programatica.

Violation:
falha declarativa.
```

Regra final:

```text
Bean Validation deve declarar regras estruturais proximas aos contratos usando jakarta.validation, constraints de presenca precisam ser combinadas com constraints que aceitam null, request bodies devem usar Valid, path e query podem usar method validation integrada do Spring MVC, beans fora do MVC usam Validated pelo proxy, listas precisam validar container e elementos separadamente, mensagens devem ser externalizadas e requests invalidas nao devem alcancar mapper, service ou regra de negocio.
```
