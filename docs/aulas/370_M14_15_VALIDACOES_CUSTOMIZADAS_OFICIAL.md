# 370 - M14.15 - Validacoes customizadas

## Apresentacao da aula

Na aula 369, você adicionou Bean Validation aos contratos HTTP do projeto.

A aplicação passou a utilizar:

```text
spring-boot-starter-validation;

jakarta.validation;

Hibernate Validator;

@Valid;

@Validated;

@NotNull;

@NotBlank;

@NotEmpty;

@Size;

@Min;

@Max;

@Positive;

container element constraints;

cascata;

ValidationMessages.
```

Também ficou clara a separação entre:

```text
binding:
converter a entrada.

validation:
verificar o contrato.

regra de negocio:
decidir se a operacao e permitida.
```

As constraints prontas cobrem muitos cenários.

Elas validam presença, tamanho, formato simples, limites numéricos, coleções e objetos aninhados.

Entretanto, algumas regras não possuem uma annotation pronta.

Exemplos:

```text
a mensagem nao pode possuir
espacos nas extremidades;

a mensagem nao pode comecar
com prefixos reservados;

caracteres de controle
nao sao aceitos;

o formato COMPACT aceita
no maximo cinco mensagens;

o formato DETAILED exige
pelo menos duas mensagens.
```

A primeira família de regras atua sobre um único valor.

A segunda depende da relação entre campos do mesmo objeto.

Nesta aula, você aprenderá a criar:

```text
constraints customizadas.
```

Uma constraint customizada possui duas partes principais:

```text
annotation de constraint;

ConstraintValidator.
```

A annotation declara:

- onde pode ser usada;
- por quanto tempo existe;
- qual validator executa;
- mensagem padrão;
- groups;
- payload;
- atributos específicos.

O validator implementa:

```java
boolean isValid(
        T value,
        ConstraintValidatorContext context
);
```

O projeto criará duas constraints de produção:

```text
@RuntimeMessageValue;

@ValidRuntimePreview.
```

`@RuntimeMessageValue` será uma constraint composta e de elemento.

Ela combinará:

```text
@NotBlank;

@Size;

validator customizado;

@ReportAsSingleViolation.
```

Ela será usada em:

```text
CreateManagedRuntimeMessageRequest.value;

elementos de RuntimeMessagePreviewRequest.messages.
```

Seu validator verificará:

- ausência de espaços laterais;
- ausência de caracteres de controle;
- ausência de prefixos reservados;
- política de quebra de linha;
- null policy separada das constraints de presença.

O validator receberá por constructor injection:

```text
RuntimeMessagePolicy.
```

Essa policy será um bean Spring imutável.

Ela não acessará:

- repository;
- banco;
- rede;
- arquivo;
- sessão;
- request atual.

O objetivo da injeção é demonstrar que o `LocalValidatorFactoryBean` utiliza uma factory integrada ao Spring para criar `ConstraintValidator` com dependências.

`@ValidRuntimePreview` será uma constraint em nível de classe.

Ela verificará a relação entre:

```text
format;

messages.
```

Regras do laboratório:

```text
COMPACT:
no maximo cinco mensagens.

DETAILED:
pelo menos duas mensagens.
```

A violation será associada ao campo:

```text
messages.
```

Para isso, o validator utilizará:

```text
ConstraintValidatorContext.
```

A aula também aprofundará:

- `@Constraint`;
- `validatedBy`;
- `@Target`;
- `@Retention`;
- `@Documented`;
- `ANNOTATION_TYPE`;
- `TYPE_USE`;
- `RECORD_COMPONENT`;
- `message`;
- `groups`;
- `payload`;
- `initialize`;
- `isValid`;
- null policy;
- constraint composition;
- `@ReportAsSingleViolation`;
- class-level constraint;
- cross-field validation;
- custom property path;
- dependency injection;
- thread safety;
- performance;
- metadata;
- testes unitários;
- testes programáticos;
- testes MVC;
- teste com servidor real.

A aula não criará:

- validação consultando banco;
- validação de duplicidade por annotation;
- constraint que chama serviço remoto;
- constraint com estado por request;
- body de erro customizado;
- `@ControllerAdvice`;
- Problem Details;
- service layer nova;
- transações;
- repository Spring Data;
- JPA;
- Flyway.

A próxima aula será:

```text
371 - M14.16 - Service layer use cases e transacoes
```

Por isso, validações que dependem do estado atual da aplicação continuarão no service.

Exemplo:

```text
mensagem duplicada:
regra do caso de uso,
nao ConstraintValidator.
```

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
367:
DTO request response.

368:
mappers manuais.

369:
Bean Validation.

370:
validacoes customizadas.

371:
service layer, use cases e transacoes.

372:
repository layer Spring Data.

373:
tratamento global de erros.
```

A aula 369 respondeu:

```text
como aplicar constraints prontas
em DTOs, path e query?
```

A aula 370 responderá:

```text
como criar constraints declarativas
para regras que nao possuem
annotation pronta?
```

Nesta aula:

```text
@Constraint:
sim.

ConstraintValidator:
sim.

annotation customizada:
sim.

constraint composta:
sim.

@ReportAsSingleViolation:
sim.

constraint de classe:
sim.

validacao entre campos:
sim.

ConstraintValidatorContext:
sim.

property node:
sim.

injecao Spring:
sim.

thread safety:
sim.

groups e payload:
sim, como contrato da annotation.

repository no validator:
nao.

I/O no validator:
nao.

constraint cross-parameter:
conceitual.

service layer:
nao aprofundada.

transacao:
nao.

error handler:
nao.
```

A regra central será:

```text
uma constraint customizada
deve ser pura, deterministica,
rapida, declarativa e segura
para execucao concorrente.
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
│       └── RuntimeMessagePolicy.java
└── web
    ├── request
    │   ├── CreateManagedRuntimeMessageRequest.java
    │   └── RuntimeMessagePreviewRequest.java
    └── validation
        ├── RuntimeMessageValue.java
        ├── RuntimeMessageValueValidator.java
        ├── ValidRuntimePreview.java
        └── ValidRuntimePreviewValidator.java
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
│   ├── RuntimeMessageValueAnnotationContractTest.java
│   ├── RuntimeMessageValueValidatorTest.java
│   ├── RuntimeMessageValueSpringInjectionIT.java
│   ├── RuntimeMessageValueCompositionTest.java
│   ├── RuntimeMessageValueThreadSafetyTest.java
│   ├── ValidRuntimePreviewValidatorTest.java
│   ├── ValidRuntimePreviewPropertyPathTest.java
│   ├── CustomConstraintMetadataTest.java
│   └── CustomConstraintProgrammaticTest.java
└── web
    ├── CustomConstraintWebMvcTest.java
    ├── CustomConstraintArchitectureTest.java
    └── CustomConstraintLiveServerIT.java
```

Documentação externa:

```text
docs
├── custom-constraint-anatomy.md
├── constraint-validator-lifecycle.md
├── custom-constraint-null-policy.md
├── constraint-composition.md
├── class-level-cross-field-validation.md
├── constraint-validator-context.md
├── spring-injection-constraint-validator.md
├── custom-validator-thread-safety.md
├── custom-validation-boundaries.md
└── custom-constraint-baseline.md
```

Scripts:

```text
scripts
├── 75_executar_testes_custom_validation.ps1
├── 76_testar_runtime_message_value.ps1
├── 77_testar_preview_cross_field.ps1
├── 78_validar_arquitetura_validators.ps1
├── 79_testar_thread_safety_validators.ps1
└── 80_executar_teste_live_custom_validation.ps1
```

Resultados esperados:

```text
value normal:
valido.

value null:
tratado por constraint composta.

value blank:
uma violation externa.

value curta:
uma violation externa.

value com espaco lateral:
invalido.

value com caractere de controle:
invalido.

value com prefixo internal:
invalido.

value com prefixo system:
invalido.

validator:
dependency injection ativa.

validator:
sem repository.

validator:
sem estado mutavel por request.

COMPACT com cinco mensagens:
valido.

COMPACT com seis:
invalido em messages.

DETAILED com duas:
valido.

DETAILED com uma:
invalido em messages.

format null:
field constraint decide.

messages null:
field constraint decide.

controller:
nao executa service quando invalido.

body de erro:
continua padrao.
```

---

## Conceito essencial

### Anatomia de uma constraint customizada

Uma annotation de constraint precisa declarar:

```java
@Documented
@Constraint(
        validatedBy = ...
)
@Target(...)
@Retention(
        RetentionPolicy.RUNTIME
)
public @interface MinhaConstraint {
}
```

Sem `@Constraint`, a annotation não participa do Jakarta Validation.

Sem retention runtime, o provider não consegue encontrá-la durante a execução.

Sem target adequado, ela não pode ser aplicada nos elementos necessários.

---

### @Constraint

`@Constraint` marca a annotation como constraint Jakarta Validation.

Seu atributo:

```text
validatedBy
```

lista os validators associados.

Exemplo:

```java
@Constraint(
        validatedBy =
                RuntimeMessageValueValidator.class
)
```

Uma constraint somente composta pode usar:

```java
validatedBy = {
}
```

Nesta aula, `@RuntimeMessageValue` terá composição e validator próprio.

---

### Atributos obrigatorios

Toda constraint deve declarar:

```java
String message()
        default "...";

Class<?>[] groups()
        default {};

Class<? extends Payload>[] payload()
        default {};
```

`message` define o template padrão.

`groups` permite selecionar subconjuntos de constraints.

`payload` permite anexar metadata a uma violation.

A aplicação não usará payload para regra de negócio.

---

### message

O default será uma chave:

```java
String message()
        default
        "{runtime.message.value.invalid}";
```

A chave será resolvida nos arquivos `ValidationMessages`.

Não use texto duplicado em cada declaração.

---

### groups

Groups fazem parte do contrato obrigatório da annotation.

Mesmo sem grupos customizados nesta aula, o atributo deve existir.

A constraint pertence ao group `Default` quando nenhum outro é selecionado.

Não crie groups artificiais apenas para preencher a API.

---

### payload

Payload permite associar metadata definida pela aplicação.

Exemplos conceituais:

- severity;
- categoria;
- marcador técnico.

O Jakarta Validation não atribui semântica padrão ao payload.

Não use payload para transportar status HTTP.

---

### Targets

`@RuntimeMessageValue` utilizará:

```java
@Target({
        ElementType.FIELD,
        ElementType.METHOD,
        ElementType.PARAMETER,
        ElementType.ANNOTATION_TYPE,
        ElementType.TYPE_USE,
        ElementType.RECORD_COMPONENT
})
```

`TYPE_USE` permite aplicar a constraint a:

```java
List<
        @RuntimeMessageValue
        String
> messages
```

`ANNOTATION_TYPE` permite composição.

`RECORD_COMPONENT` torna a intenção explícita para records.

---

### Retention

Use:

```java
@Retention(
        RetentionPolicy.RUNTIME
)
```

`SOURCE` desaparece na compilação.

`CLASS` permanece no bytecode, mas não garante disponibilidade por reflection em runtime.

Bean Validation precisa de runtime metadata.

---

### @Documented

`@Documented` permite que a constraint apareça na documentação Java gerada.

Ela não altera a validação.

Mesmo assim, faz parte de uma annotation de contrato bem construída.

---

### ConstraintValidator

A interface é:

```java
ConstraintValidator<
        ConstraintAnnotation,
        ValidatedType
>
```

Exemplo:

```java
ConstraintValidator<
        RuntimeMessageValue,
        CharSequence
>
```

Usar `CharSequence` permite validar `String` e outras implementações compatíveis.

Não use `Object` sem necessidade.

---

### initialize

O método:

```java
initialize(
        RuntimeMessageValue annotation
)
```

recebe os atributos da declaração.

Nesta aula, a annotation possuirá:

```text
allowLineBreaks.
```

O validator copiará esse valor uma vez.

Depois de inicializado, ele apenas lerá o atributo.

Não armazene o objeto validado no validator.

---

### isValid

`isValid` recebe:

- valor;
- contexto.

Ele retorna:

```text
true:
constraint satisfeita.

false:
constraint violada.
```

O método não deve alterar o objeto recebido.

Também não deve produzir efeitos colaterais.

---

### Null policy

A boa prática será:

```java
if (value == null) {
    return true;
}
```

A presença é responsabilidade de:

```text
@NotNull;

@NotBlank;

@NotEmpty.
```

Separar as responsabilidades permite reutilizar a constraint quando null é aceitável.

Como `@RuntimeMessageValue` será composta com `@NotBlank`, null continuará inválido no contrato final.

---

### Constraint composition

Uma constraint pode ser formada por outras constraints.

`@RuntimeMessageValue` será anotada com:

```text
@NotBlank;

@Size;

@Constraint.
```

Assim, uma única annotation representa:

- presença textual;
- tamanho;
- política customizada.

O código consumidor fica menor e o conceito do domínio do contrato fica explícito.

---

### @ReportAsSingleViolation

Sem essa annotation, cada constraint composta pode produzir sua própria violation.

Com:

```java
@ReportAsSingleViolation
```

uma falha em qualquer parte gera uma violation usando a mensagem externa.

Benefícios:

- contrato de mensagem único;
- menos ruído;
- implementação interna encapsulada.

Custo:

- perde detalhes de qual subconstraint falhou.

Use conscientemente.

Nesta aula, o objetivo é publicar uma regra única:

```text
valor de mensagem invalido.
```

---

### RuntimeMessagePolicy

A policy será um bean imutável:

```java
@Component
public class RuntimeMessagePolicy {

    private final Set<String>
            reservedPrefixes =
                    Set.of(
                            "internal:",
                            "system:"
                    );

    public boolean hasReservedPrefix(
            CharSequence value
    ) {
    }
}
```

Ela não possui estado por request.

Ela não consulta infraestrutura externa.

---

### Injecao no validator

O validator receberá:

```java
private final RuntimeMessagePolicy policy;
```

por construtor.

O Spring Framework configura a criação dos `ConstraintValidator` por meio da integração do `LocalValidatorFactoryBean`.

Assim, o validator pode receber um colaborador Spring.

Não é necessário transformar o validator em service de negócio.

---

### Limite da injecao

Dependency Injection ser possível não significa que qualquer dependência seja adequada.

Evite injetar:

- repository;
- cliente HTTP;
- fila;
- `EntityManager`;
- relógio para regra temporal mutável;
- sessão do usuário;
- request servlet.

Uma validation que depende de I/O pode ser:

- lenta;
- não determinística;
- sujeita a timeout;
- repetida muitas vezes;
- executada fora de transação;
- vulnerável a race condition.

Duplicidade continuará no service.

---

### Regra do valor

O validator aceitará null.

Para valor presente, verificará:

```text
value igual a value.strip();

nenhum caractere ISO control
fora das quebras permitidas;

prefixo nao reservado.
```

O validator não executará `trim` para corrigir a entrada.

Validation rejeita.

Normalization transforma.

São responsabilidades diferentes.

---

### Caractere de controle

Use:

```java
Character.isISOControl(
        codePoint
)
```

Percorra code points, não somente chars, quando a regra depende de caracteres Unicode.

Se `allowLineBreaks=true`, permita:

```text
\n;

\r.
```

Outros controles permanecem inválidos.

---

### Class-level constraint

`@ValidRuntimePreview` terá target:

```text
TYPE;

ANNOTATION_TYPE.
```

Ela será aplicada sobre:

```java
@ValidRuntimePreview
public record RuntimeMessagePreviewRequest(...) {
}
```

O validator recebe o objeto completo.

Isso permite comparar dois ou mais campos.

---

### Validacao entre campos

Regras:

```text
COMPACT:
messages.size <= 5.

DETAILED:
messages.size >= 2.
```

O validator não substitui constraints dos campos.

Se `format` ou `messages` estiverem nulos:

```text
return true.
```

`@NotNull` e `@NotEmpty` continuam responsáveis pela ausência.

---

### Violation em property node

Uma constraint de classe normalmente gera path no objeto inteiro.

Para associar a falha ao campo `messages`:

```java
context
        .disableDefaultConstraintViolation();

context
        .buildConstraintViolationWithTemplate(
                messageTemplate
        )
        .addPropertyNode(
                "messages"
        )
        .addConstraintViolation();
```

Isso melhora:

- testes;
- observabilidade;
- futuro body de erro;
- experiência do consumidor.

---

### ConstraintValidatorContext

O contexto permite:

- desabilitar a violation padrão;
- criar violation customizada;
- mudar template;
- adicionar property node;
- adicionar bean node;
- adicionar container element node;
- criar múltiplas violations.

Use apenas quando a mensagem padrão e o path padrão não forem suficientes.

---

### Mensagens especificas da regra cruzada

O validator escolherá:

```text
{runtime.preview.compact.max-items};

{runtime.preview.detailed.min-items}.
```

A annotation terá uma mensagem genérica como fallback.

A escolha depende dos campos já convertidos.

Não use essa técnica para retornar códigos HTTP.

---

### ConstraintValidator thread-safe

O provider pode reutilizar uma instância e chamar `isValid` concorrentemente.

Por isso:

- não guarde o valor atual em field;
- não use contador mutável;
- não use `StringBuilder` compartilhado;
- não altere collections;
- dependências devem ser thread-safe;
- configuração lida em `initialize` deve ficar somente leitura.

A specification exige `isValid` thread-safe.

---

### Performance

Validation pode ocorrer em cada request e em vários objetos.

Boas práticas:

- sem I/O;
- sem consulta a banco;
- sem reflection repetida;
- sem regex recompilada por chamada;
- sem log por valor válido;
- sem alocar estruturas grandes;
- sem bloquear thread;
- sem sincronização desnecessária.

O validator da aula percorrerá somente o texto recebido.

---

### Constraint cross-parameter

Jakarta Validation também permite validator sobre o array de parâmetros de um método.

Isso exige:

```text
@SupportedValidationTarget(
    ValidationTarget.PARAMETERS
).
```

É útil quando a regra relaciona parâmetros de um método.

Nesta aula, a regra entre campos será modelada em um request record com class-level constraint.

Isso mantém o contrato HTTP explícito.

---

### Constraint customizada versus service

Use constraint quando a regra:

- depende apenas do valor recebido;
- é determinística;
- não precisa de estado externo;
- pode ser declarada no contrato;
- pode executar antes do caso de uso.

Use service quando a regra:

- depende de dados persistidos;
- exige transação;
- depende do usuário atual;
- consulta outro sistema;
- muda conforme estado do recurso;
- possui efeito colateral.

---

### Constraint customizada versus converter

Converter transforma:

```text
compact
    -> RuntimeFormatOption.COMPACT.
```

Constraint verifica:

```text
o valor convertido respeita a regra?
```

Não use validator para fazer parsing que pertence ao binding.

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

Todos os testes anteriores precisam permanecer verdes.

---

### 2. Criar RuntimeMessagePolicy

Package:

```text
br.com.formacao.backend.beans.validation.
```

Código:

```java
@Component
public class RuntimeMessagePolicy {

    private static final Set<String>
            RESERVED_PREFIXES =
                    Set.of(
                            "internal:",
                            "system:"
                    );

    public boolean hasReservedPrefix(
            CharSequence value
    ) {
        String normalized =
                value.toString()
                        .toLowerCase(
                                Locale.ROOT
                        );

        return RESERVED_PREFIXES
                .stream()
                .anyMatch(
                        normalized::startsWith
                );
    }
}
```

A collection é imutável.

---

### 3. Criar @RuntimeMessageValue

Package:

```text
br.com.formacao.backend.web.validation.
```

Estrutura:

```java
@Documented
@NotBlank
@Size(
        min =
                ValidationLimits.MESSAGE_MIN,
        max =
                ValidationLimits.MESSAGE_MAX
)
@ReportAsSingleViolation
@Constraint(
        validatedBy =
                RuntimeMessageValueValidator.class
)
@Target({
        ElementType.FIELD,
        ElementType.METHOD,
        ElementType.PARAMETER,
        ElementType.ANNOTATION_TYPE,
        ElementType.TYPE_USE,
        ElementType.RECORD_COMPONENT
})
@Retention(
        RetentionPolicy.RUNTIME
)
public @interface RuntimeMessageValue {

    String message()
            default
            "{runtime.message.value.invalid}";

    Class<?>[] groups()
            default {};

    Class<? extends Payload>[] payload()
            default {};

    boolean allowLineBreaks()
            default false;
}
```

---

### 4. Criar RuntimeMessageValueValidator

Estrutura:

```java
public final class RuntimeMessageValueValidator
        implements ConstraintValidator<
                RuntimeMessageValue,
                CharSequence
        > {
}
```

Não anote com `@Component`.

Receba `RuntimeMessagePolicy` no construtor.

Field:

```text
private final RuntimeMessagePolicy policy.
```

---

### 5. Implementar initialize

Field:

```java
private boolean allowLineBreaks;
```

No método:

```java
@Override
public void initialize(
        RuntimeMessageValue annotation
) {
    this.allowLineBreaks =
            annotation.allowLineBreaks();
}
```

Não armazene a annotation completa sem necessidade.

---

### 6. Implementar isValid

Ordem:

1. null retorna true;
2. compara com `strip`;
3. verifica prefixo reservado;
4. percorre code points;
5. permite line break somente quando configurado;
6. retorna resultado.

Não modifique o texto.

Não faça logging do conteúdo.

---

### 7. Aplicar no create request

Substitua:

```text
@NotBlank + @Size
```

por:

```java
@RuntimeMessageValue
String value
```

Confirme que a composição preserva presença e tamanho.

---

### 8. Aplicar nos elementos de preview

Use:

```java
List<
        @RuntimeMessageValue
        String
> messages
```

Mantenha constraints da lista:

```text
@NotEmpty;

@Size(max=10).
```

A annotation do elemento valida cada mensagem.

---

### 9. Criar @ValidRuntimePreview

Estrutura:

```java
@Documented
@Constraint(
        validatedBy =
                ValidRuntimePreviewValidator.class
)
@Target({
        ElementType.TYPE,
        ElementType.ANNOTATION_TYPE
})
@Retention(
        RetentionPolicy.RUNTIME
)
public @interface ValidRuntimePreview {

    String message()
            default
            "{runtime.preview.invalid}";

    Class<?>[] groups()
            default {};

    Class<? extends Payload>[] payload()
            default {};
}
```

---

### 10. Aplicar no record

```java
@ValidRuntimePreview
public record RuntimeMessagePreviewRequest(
        ...
) {
}
```

Mantenha as constraints dos components.

---

### 11. Criar ValidRuntimePreviewValidator

Implemente:

```java
ConstraintValidator<
        ValidRuntimePreview,
        RuntimeMessagePreviewRequest
>
```

Sem dependencies externas.

Sem state mutável.

---

### 12. Implementar null policy cruzada

```java
if (value == null) {
    return true;
}

if (value.format() == null
        || value.messages() == null) {
    return true;
}
```

As field constraints cuidarão desses casos.

---

### 13. Implementar regra COMPACT

Se:

```text
format == COMPACT
e size > 5
```

crie violation:

```text
{runtime.preview.compact.max-items}
```

no property node:

```text
messages.
```

Retorne false.

---

### 14. Implementar regra DETAILED

Se:

```text
format == DETAILED
e size < 2
```

crie violation:

```text
{runtime.preview.detailed.min-items}
```

em `messages`.

Retorne false.

---

### 15. Atualizar mensagens base

Adicione:

```properties
runtime.message.value.invalid=message value is invalid
runtime.preview.invalid=preview request is inconsistent
runtime.preview.compact.max-items=compact preview accepts at most 5 messages
runtime.preview.detailed.min-items=detailed preview requires at least 2 messages
```

---

### 16. Atualizar mensagens pt-BR

Adicione:

```properties
runtime.message.value.invalid=o valor da mensagem e invalido
runtime.preview.invalid=a requisicao de previa esta inconsistente
runtime.preview.compact.max-items=a previa compacta aceita no maximo 5 mensagens
runtime.preview.detailed.min-items=a previa detalhada exige pelo menos 2 mensagens
```

---

### 17. Criar RuntimeMessageValueAnnotationContractTest

Use reflection.

Valide:

- `@Constraint`;
- validator associado;
- targets;
- runtime retention;
- `@Documented`;
- `@NotBlank`;
- `@Size`;
- `@ReportAsSingleViolation`;
- message;
- groups;
- payload;
- allowLineBreaks default false.

---

### 18. Criar RuntimeMessageValueValidatorTest

Teste unitário direto.

Instancie:

```text
RuntimeMessagePolicy;

RuntimeMessageValueValidator.
```

Para configurar `initialize`, obtenha uma annotation de fixture por reflection.

Cenários:

- null;
- válido;
- espaços iniciais;
- espaços finais;
- control char;
- line break;
- prefixo internal;
- prefixo system;
- texto Unicode normal.

---

### 19. Testar allowLineBreaks

Crie record de fixture:

```java
record MultilineFixture(
        @RuntimeMessageValue(
                allowLineBreaks = true
        )
        String value
) {
}
```

Valide:

- newline permitido;
- tab continua inválido;
- espaços laterais continuam inválidos.

---

### 20. Criar RuntimeMessageValueSpringInjectionIT

Injete o `Validator` do Spring.

Valide um request com prefixo reservado.

Se a dependency injection no validator não funcionar, o contexto ou a validation falhará.

Confirme:

- violation criada;
- policy bean única;
- validator sem stereotype;
- contexto fecha.

---

### 21. Criar RuntimeMessageValueCompositionTest

Valide:

- null;
- blank;
- dois caracteres;
- texto longo;
- prefixo reservado.

Para cada cenário, confirme:

```text
uma violation.
```

Confirme que a annotation externa aparece no descriptor.

Isso prova `@ReportAsSingleViolation`.

---

### 22. Criar ValidRuntimePreviewValidatorTest

Valide programaticamente:

```text
COMPACT com 1:
valido.

COMPACT com 5:
valido.

COMPACT com 6:
invalido.

DETAILED com 1:
invalido.

DETAILED com 2:
valido.

format null:
field violation, sem duplicacao cruzada.

messages null:
field violation, sem duplicacao cruzada.
```

---

### 23. Criar ValidRuntimePreviewPropertyPathTest

Para os dois cenários cruzados, confirme que a violation aponta para:

```text
messages.
```

Valide o message template específico.

Não dependa da ordem do set.

---

### 24. Criar CustomConstraintMetadataTest

Use:

```java
validator.getConstraintsForClass(...)
```

Inspecione:

- class-level constraint;
- property constraints;
- composing constraints;
- validator classes;
- `isReportAsSingleViolation`;
- attributes.

Não teste detalhes internos do Hibernate Validator.

---

### 25. Criar CustomConstraintProgrammaticTest

Use `Validator`.

Valide create request e preview request.

Confirme:

- built-ins e custom constraints cooperam;
- service não é necessário;
- messages são interpoladas;
- locale continua funcionando;
- property paths são estáveis.

---

### 26. Criar RuntimeMessageValueThreadSafetyTest

Use um executor com múltiplas tasks.

Compartilhe o mesmo bean `Validator`.

Valide valores válidos e inválidos em paralelo.

Confirme resultados determinísticos.

Não use `Thread.sleep`.

Feche o executor em `finally`.

---

### 27. Criar CustomConstraintWebMvcTest

Use `@WebMvcTest`.

Importe:

- mappers reais;
- `RuntimeMessagePolicy`;
- infraestrutura necessária para criar validators.

Cenários create:

- válido;
- leading space;
- reserved prefix;
- control character.

Cenários preview:

- COMPACT com seis;
- DETAILED com uma;
- válidos nos limites.

Confirme 400 e ausência de chamada ao service.

---

### 28. Criar CustomConstraintArchitectureTest

Valide:

- annotations terminam com nomes sem sufixo Validator;
- validators terminam em `Validator`;
- validators implementam `ConstraintValidator`;
- annotations possuem message, groups e payload;
- retention runtime;
- targets adequados;
- zero repository nos validators;
- zero `EntityManager`;
- zero `RestClient`;
- zero `HttpClient`;
- zero filesystem;
- zero mutable collection field;
- zero request scope;
- zero service de negócio;
- zero custom error handler;
- zero custom constraint acessando store.

---

### 29. Criar CustomConstraintLiveServerIT

Use servidor real em porta aleatória.

Fluxo:

- create válido retorna 201;
- create com spaces retorna 400;
- create com prefixo reservado retorna 400;
- preview compact com seis retorna 400;
- preview detailed com uma retorna 400;
- preview detailed com duas retorna 200.

Não adote o body padrão de erro como contrato.

---

### 30. Executar curls do valor

Arquivo:

```json
{
  "value": " internal:diagnostic"
}
```

Execute POST.

Resultado:

```text
400.
```

Depois use:

```json
{
  "value": "internal:diagnostic"
}
```

Resultado também:

```text
400.
```

Remova o arquivo.

---

### 31. Executar preview cruzada

COMPACT com seis mensagens:

```text
400.
```

DETAILED com uma:

```text
400.
```

DETAILED com duas:

```text
200.
```

---

### 32. Criar custom-constraint-anatomy.md

Documente:

- `@Constraint`;
- validator;
- message;
- groups;
- payload;
- target;
- retention;
- documented;
- atributos próprios.

---

### 33. Criar constraint-validator-lifecycle.md

Explique:

- criação pelo provider;
- Spring validator factory;
- dependency injection;
- initialize;
- chamadas de isValid;
- reutilização;
- concorrência;
- ausência de estado por request.

---

### 34. Criar custom-constraint-null-policy.md

Registre:

```text
validator customizado retorna true para null;

constraint de presenca cuida de null;

composicao final pode rejeitar null.
```

Inclua motivos.

---

### 35. Criar constraint-composition.md

Explique:

- composing constraints;
- `ANNOTATION_TYPE`;
- outer constraint;
- `@ReportAsSingleViolation`;
- descriptor;
- perda de detalhe;
- quando não compor.

---

### 36. Criar class-level-cross-field-validation.md

Inclua:

- constraint TYPE;
- objeto completo;
- field constraints;
- regras COMPACT e DETAILED;
- null policy;
- property path customizado;
- limites entre validation e business rule.

---

### 37. Criar constraint-validator-context.md

Mostre:

```text
disable default;

template;

property node;

container node;

add violation.
```

Explique que o contexto não deve ser armazenado.

---

### 38. Criar spring-injection-constraint-validator.md

Documente:

- `LocalValidatorFactoryBean`;
- Spring constraint validator factory;
- constructor injection;
- policy imutável;
- validator sem `@Component`;
- dependências permitidas;
- dependências proibidas.

---

### 39. Criar custom-validator-thread-safety.md

Inclua:

- chamadas concorrentes;
- fields somente leitura;
- sem valor atual;
- sem contador;
- sem cache mutável;
- dependências thread-safe;
- performance;
- teste concorrente.

---

### 40. Criar custom-validation-boundaries.md

Tabela:

```text
regra local e deterministica:
constraint.

duplicidade:
service.

permissao:
service/security.

estado persistido:
service/repository.

parsing:
converter.

serializacao:
message converter.
```

---

### 41. Criar custom-constraint-baseline.md

Liste:

- annotation;
- target;
- tipo validado;
- validator;
- null policy;
- dependencies;
- mensagens;
- property path;
- testes.

---

### 42. Criar scripts

`75_executar_testes_custom_validation.ps1` executa todos os testes.

`76_testar_runtime_message_value.ps1` testa valores válidos e inválidos.

`77_testar_preview_cross_field.ps1` testa limites por formato.

`78_validar_arquitetura_validators.ps1` executa teste arquitetural.

`79_testar_thread_safety_validators.ps1` executa concorrência.

`80_executar_teste_live_custom_validation.ps1` executa servidor real.

---

### 43. Executar testes unitarios

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageValueAnnotationContractTest,RuntimeMessageValueValidatorTest,RuntimeMessageValueCompositionTest,ValidRuntimePreviewValidatorTest,ValidRuntimePreviewPropertyPathTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 44. Executar testes de infraestrutura

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageValueSpringInjectionIT,CustomConstraintMetadataTest,CustomConstraintProgrammaticTest test
```

---

### 45. Executar thread safety

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageValueThreadSafetyTest test
```

O teste deve terminar sem timeout artificial.

---

### 46. Executar testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=CustomConstraintWebMvcTest,CustomConstraintArchitectureTest test
```

---

### 47. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=CustomConstraintLiveServerIT test
```

Confirme porta aleatória e contexto fechado.

---

### 48. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 49. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 50. Revisar escopo

Confirme:

```text
custom annotations:
duas.

ConstraintValidators:
dois.

repository em validator:
zero.

I/O em validator:
zero.

estado mutavel por request:
zero.

custom error handler:
zero.

service layer nova:
zero.

transacao:
zero.

Spring Data:
zero.
```

---

### 51. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- payload temporário;
- logs de conteúdo;
- validator com repository;
- arquivos de teste concorrente;
- constraint experimental em produção;
- body de erro;
- transação antecipada.

---

## Entendendo o que foi feito

### Uma regra repetida virou conceito

`@RuntimeMessageValue` encapsulou presença, tamanho e política de texto.

### A relacao entre campos ficou declarativa

`@ValidRuntimePreview` validou o record inteiro sem mover a regra para o controller.

### O path da violation ficou util

A falha de classe foi associada a `messages`.

### A injecao permaneceu limitada

O validator recebeu uma policy imutável, não infraestrutura externa.

### Concorrencia virou requisito explicito

Validators ficaram stateless e foram testados em paralelo.

---

## Erros comuns importantes

### Consultar banco no ConstraintValidator

A validation fica lenta, não transacional e sujeita a race condition.

### Retornar false para null em toda constraint

Presença e regra de valor ficam acopladas sem necessidade.

### Guardar o valor validado em field

Chamadas concorrentes podem misturar estado.

### Usar class-level constraint para tudo

Field constraints simples ficam menos claras.

### Criar violation sem addConstraintViolation

Depois de desabilitar a default, a violation precisa ser adicionada explicitamente.

---

## Comandos uteis

### Testes das annotations

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageValueAnnotationContractTest,CustomConstraintMetadataTest test
```

### Validators

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageValueValidatorTest,ValidRuntimePreviewValidatorTest test
```

### MVC

```powershell
.\mvnw.cmd `
  -Dtest=CustomConstraintWebMvcTest test
```

### Arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=CustomConstraintArchitectureTest test
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Null policy

Remova temporariamente `@NotBlank` da composição.

Valide que null passa pelo validator customizado.

Restaure.

### Parte 2 — ReportAsSingleViolation

Remova temporariamente a annotation.

Compare a quantidade e os descriptors das violations.

Restaure.

### Parte 3 — Allow line breaks

Crie fixture com `allowLineBreaks=true`.

Teste newline, carriage return e tab.

### Parte 4 — Property node

Remova `addPropertyNode`.

Compare o path da violation de classe.

Restaure.

### Parte 5 — Dependency injection

Troque a policy por uma fixture com outro prefixo reservado.

Confirme a mudança sem alterar o validator.

### Parte 6 — Thread safety

Adicione temporariamente um contador mutável ao validator.

Explique o risco e remova antes do commit.

### Parte 7 — Regra no lugar errado

Implemente uma fixture de validator que consulta o store para duplicidade.

Liste race condition, custo e problema transacional.

Remova a fixture.

### Parte 8 — ADR

Registre:

```text
annotations completas;

message, groups e payload;

null separado;

composition consciente;

ReportAsSingleViolation quando o conceito e unico;

class-level para relacao entre campos;

property node explicito;

DI somente para policy pura;

validators stateless e thread-safe;

sem I/O e sem repository.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 369 foi preservada;
- o mesmo projeto foi continuado;
- constraint customizada foi definida;
- annotation e validator foram separados;
- `@Constraint` foi usado;
- `validatedBy` aponta para o validator correto;
- retention runtime foi usada;
- targets adequados foram declarados;
- `@Documented` foi usado;
- `message`, `groups` e `payload` foram declarados;
- groups e payload não receberam semântica HTTP;
- `ANNOTATION_TYPE` permitiu composição;
- `TYPE_USE` permitiu validação de elementos de lista;
- `RECORD_COMPONENT` foi incluído;
- `ConstraintValidator` usou tipos específicos;
- `initialize` leu apenas configuração necessária;
- `isValid` não alterou o valor;
- null policy retornou true no validator de valor;
- presença continuou responsabilidade de constraint própria;
- `@RuntimeMessageValue` foi criado;
- `@RuntimeMessageValue` compõe `@NotBlank` e `@Size`;
- `@ReportAsSingleViolation` foi usado;
- composição gerou uma violation externa;
- perda de detalhe da composição foi documentada;
- `allowLineBreaks` foi testado;
- espaços laterais foram rejeitados;
- caracteres de controle foram rejeitados;
- prefixos reservados foram rejeitados;
- texto Unicode válido foi aceito;
- `RuntimeMessagePolicy` foi criado;
- policy usa coleção imutável;
- policy não acessa repository, banco ou rede;
- validator recebeu policy por constructor injection;
- validator não precisou de stereotype;
- integração Spring de ConstraintValidator foi comprovada;
- `@ValidRuntimePreview` foi criado;
- constraint de classe foi aplicada ao request;
- COMPACT com até cinco itens foi aceito;
- COMPACT com seis foi rejeitado;
- DETAILED com duas foi aceito;
- DETAILED com uma foi rejeitado;
- null de fields não gerou violation cruzada duplicada;
- `ConstraintValidatorContext` foi usado;
- default violation foi desabilitada;
- violation customizada foi adicionada;
- property node `messages` foi criado;
- templates específicos foram usados;
- validators permaneceram stateless;
- nenhum valor atual foi armazenado em field;
- nenhum contexto foi armazenado;
- dependências são thread-safe;
- execução concorrente foi testada;
- validators não executam I/O;
- validators não fazem reflection repetida;
- validators não registram conteúdo sensível;
- constraint cross-parameter foi explicada sem implementação desnecessária;
- validation customizada foi diferenciada de binding;
- validation customizada foi diferenciada de regra de negócio;
- duplicidade permaneceu no service;
- `RuntimeMessageValueAnnotationContractTest` foi criado;
- `RuntimeMessageValueValidatorTest` foi criado;
- `RuntimeMessageValueSpringInjectionIT` foi criado;
- `RuntimeMessageValueCompositionTest` foi criado;
- `RuntimeMessageValueThreadSafetyTest` foi criado;
- `ValidRuntimePreviewValidatorTest` foi criado;
- `ValidRuntimePreviewPropertyPathTest` foi criado;
- `CustomConstraintMetadataTest` foi criado;
- `CustomConstraintProgrammaticTest` foi criado;
- `CustomConstraintWebMvcTest` foi criado;
- requests inválidas não chamam service;
- `CustomConstraintArchitectureTest` foi criado;
- `CustomConstraintLiveServerIT` foi criado;
- teste live usou porta aleatória;
- contexto foi fechado;
- body padrão de erro não virou contrato;
- mensagens base e pt-BR foram atualizadas;
- documentação de anatomy, lifecycle, null, composition, class-level, context, injection, concorrência e fronteiras foi criada;
- baseline foi documentada;
- scripts foram criados;
- testes unitários, infraestrutura, concorrência, MVC, live, suite e package passaram;
- nenhum repository, banco, rede, transação, Spring Data, JPA, Flyway, ControllerAdvice ou ProblemDetail foi antecipado;
- ponte para a aula 371 está correta;
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
git commit -m "feat(m14): criar validacoes customizadas"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- payload temporário;
- logs de valores;
- validator com repository;
- arquivo de concorrência;
- body de erro;
- código de service layer antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, o projeto passou a declarar regras que não existiam nas constraints prontas.

O mapa consolidado ficou:

```text
@Constraint:
declara constraint.

ConstraintValidator:
executa regra.

initialize:
le configuracao.

isValid:
avalia valor.

message:
template.

groups:
subconjuntos.

payload:
metadata.

composition:
reuso de constraints.

ReportAsSingleViolation:
uma violation externa.

class-level:
relacao entre campos.

ConstraintValidatorContext:
path e mensagem customizados.

Spring injection:
policy pura.

thread safety:
sem estado por request.
```

Você comprovou:

```text
constraint de valor composta;

prefixos reservados rejeitados;

espacos laterais rejeitados;

caracteres de controle rejeitados;

constraint de classe;

regra COMPACT;

regra DETAILED;

property path em messages;

injecao Spring no validator;

execucao concorrente deterministica;

service protegido;

zero I/O em validators.
```

A decisão central foi:

```text
constraints customizadas devem validar
regras locais e deterministicas,
sem assumir responsabilidades
de repository, transacao ou negocio.
```

A próxima aula será:

```text
371 - M14.16 - Service layer use cases e transacoes
```

Nela, você continuará no mesmo projeto e estudará:

- service layer;
- application service;
- use case;
- orchestration;
- transaction boundary;
- `@Transactional`;
- read-only;
- rollback;
- checked e unchecked exceptions;
- propagation introdutória;
- isolamento conceitual;
- idempotência de caso de uso;
- commands;
- results;
- ports;
- repository boundary;
- regra de negócio;
- validação dependente de estado;
- duplicidade;
- controller fino;
- testes unitários;
- testes de integração;
- limites entre controller, service e repository.

A aula 370 respondeu:

```text
como criar regras declarativas
que nao existem nas constraints padrao?
```

A aula 371 responderá:

```text
como organizar casos de uso
e definir a fronteira transacional
da aplicacao?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei criar uma annotation Jakarta Validation completa.
- [ ] Sei implementar `ConstraintValidator` com null policy explícita.
- [ ] Sei compor constraints e usar `@ReportAsSingleViolation`.
- [ ] Sei criar class-level constraint e property path customizado.
- [ ] Sei limitar dependency injection e garantir thread safety.

---

## Troubleshooting adicional

### Validator nao e executado

Revise `@Constraint`, `validatedBy`, target, retention e uso de `@Valid`.

### Dependency injection chega null

Confirme que o Validator usado é o configurado pelo Spring e evite bootstrap manual paralelo.

### Violation de classe aparece no objeto

Use `disableDefaultConstraintViolation`, `addPropertyNode` e `addConstraintViolation`.

### Lista nao valida elementos

Confirme `TYPE_USE` na annotation e aplicação no tipo do elemento.

### Varias violations aparecem

Revise `@ReportAsSingleViolation` e constraints externas adicionais.

### Teste concorrente oscila

Procure fields mutáveis, caches compartilhados ou dependências não thread-safe.

---

## Perguntas de revisao

1. O que torna uma annotation uma constraint?
2. Para que serve `validatedBy`?
3. Quais atributos toda constraint deve declarar?
4. Por que usar retention runtime?
5. Para que serve `TYPE_USE`?
6. O que faz `initialize`?
7. O que faz `isValid`?
8. Qual é a null policy recomendada?
9. O que é constraint composition?
10. O que faz `@ReportAsSingleViolation`?
11. Quando usar class-level constraint?
12. Como alterar o property path?
13. O validator pode receber dependency injection?
14. Qual dependência é inadequada em validator?
15. Por que `isValid` precisa ser thread-safe?
16. O validator pode alterar o valor?
17. Onde fica a regra de duplicidade?
18. O que é cross-parameter constraint?
19. Custom validation substitui service?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `@Constraint`.
2. Associar validators.
3. Message, groups e payload.
4. Para metadata existir em execução.
5. Validar usos de tipo e elementos.
6. Ler atributos da annotation.
7. Executar a regra.
8. Separar null de outras regras.
9. Uma constraint formada por outras.
10. Publicar uma violation externa.
11. Relação entre campos.
12. `ConstraintValidatorContext`.
13. Sim, pela integração Spring.
14. Repository ou I/O externo.
15. Pode haver chamadas concorrentes.
16. Não.
17. Service.
18. Validação entre parâmetros de método.
19. Não.
20. Service layer, use cases e transações.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 370 - M14.15 - Validacoes customizadas

- Continuei no projeto `formacao-java-backend-api`.
- Criei annotations customizadas com `@Constraint`.
- Declarei `message`, `groups` e `payload`.
- Usei targets adequados e retention runtime.
- Criei `@RuntimeMessageValue`.
- Combinei `@NotBlank`, `@Size` e validator próprio.
- Usei `@ReportAsSingleViolation`.
- Defini null policy separada.
- Rejeitei espaços laterais.
- Rejeitei caracteres de controle.
- Rejeitei prefixos reservados.
- Criei `RuntimeMessagePolicy` imutável.
- Injetei a policy no `ConstraintValidator`.
- Mantive repository, banco e rede fora do validator.
- Usei `initialize` para configuração da annotation.
- Mantive `isValid` sem efeito colateral.
- Criei `@ValidRuntimePreview`.
- Implementei uma class-level constraint.
- Validei relação entre format e messages.
- Criei violation no property path `messages`.
- Usei `ConstraintValidatorContext`.
- Diferenciei constraint de campo, classe e cross-parameter.
- Testei metadata de constraints.
- Testei composição e violation única.
- Testei validação programática.
- Testei dependency injection do Spring.
- Testei thread safety com validações concorrentes.
- Testei os contratos com MockMvc e servidor real.
- Mantive duplicidade e estado externo no service.
- Não criei tratamento global de erros.
- Não antecipei Spring Data ou transações.
- Próxima aula: Service layer, use cases e transações.
```

---

## Referencia tecnica curta

```text
Constraint:
annotation.

Validator:
regra.

Message:
template.

Groups:
selecao.

Payload:
metadata.

Composition:
reuso.

Class-level:
campos relacionados.

Context:
violation.

Policy:
dependencia pura.

Thread-safe:
obrigatorio.
```

Regra final:

```text
uma constraint customizada deve declarar annotation completa, null policy, targets, message, groups e payload; seu ConstraintValidator precisa ser deterministico, sem efeitos colaterais e thread-safe, pode receber apenas dependencias puras pela integracao Spring, deve usar ConstraintValidatorContext para violations e paths precisos e nao pode substituir services, repositories ou transacoes em regras dependentes do estado atual da aplicacao.
```
