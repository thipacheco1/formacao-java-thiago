# 394 - M14.39 - Testes de service em Spring

## Apresentação da aula

Na aula 393, você testou a camada web com MockMvc.

O fluxo do teste ficou:

```text
JUnit;

@WebMvcTest;

MockMvc;

request JSON;

Bean Validation;

controller real;

service mockado;

response;

JsonPath;

Mockito verify.
```

Aquela aula respondeu:

```text
como provar que o controller
cumpre o contrato HTTP
sem iniciar servidor,
banco, Redis ou SMTP?
```

O service foi substituído por um mock porque o objetivo era testar apenas a fronteira web.

Agora o foco muda.

Nesta aula, o componente real será:

```text
SimpleEmailNotificationService.
```

O controller não participará.

O teste verificará:

- validação do command;
- uso das properties;
- montagem de `SimpleMailMessage`;
- colaboração com `JavaMailSender`;
- geração do ID da notificação;
- horário de submissão;
- resultado retornado;
- tradução de exceptions;
- ausência de envio quando a feature está desabilitada;
- ausência de interações indevidas.

A pergunta central será:

```text
como testar a regra de um service Spring
sem carregar o ApplicationContext
e sem acessar infraestrutura real?
```

A solução utilizará:

```text
JUnit 5;

MockitoExtension;

@Mock;

ArgumentCaptor;

AssertJ;

Clock fixo;

dependências explícitas;

service real;

JavaMailSender mockado.
```

O teste será um teste unitário.

Isso significa:

```text
uma unidade principal;

dependências controladas;

sem Spring Boot startup;

sem servidor;

sem SMTP;

sem Mailpit;

sem banco;

sem Redis;

sem filesystem real.
```

Embora o componente possua:

```java
@Service
```

ele continua sendo uma classe Java.

A annotation permite que o Spring o descubra em runtime.

Ela não obriga o teste unitário a iniciar o framework.

Essa separação é importante:

```text
código Spring bem projetado
continua testável como Java comum.
```

A baseline fará uma pequena evolução de testabilidade.

Na aula 392, o service gerou o ID com:

```java
UUID.randomUUID();
```

Esse valor é válido em produção, mas difícil de controlar em teste.

Você criará:

```text
NotificationIdGenerator.
```

Produção:

```text
gera UUID aleatório.
```

Teste:

```text
devolve UUID fixo.
```

Essa mudança não existe apenas “para agradar o teste”.

Ela torna explícita uma dependência não determinística:

```text
geração de identidade.
```

O `Clock` já foi injetado nas aulas anteriores.

Assim, o teste controlará:

- ID;
- tempo;
- transporte SMTP;
- configuração.

O objeto testado será chamado de:

```text
SUT;
System Under Test.
```

Nesta aula:

```text
SUT:
SimpleEmailNotificationService.
```

Dependências:

```text
JavaMailSender;

EmailNotificationProperties;

Clock;

NotificationIdGenerator.
```

A classe de teste não utilizará:

- `@SpringBootTest`;
- `@WebMvcTest`;
- `@SpringJUnitConfig`;
- `@Autowired`;
- `@MockitoBean`;
- Testcontainers;
- Mailpit.

`@MockitoBean` pertence ao contexto Spring.

Aqui não existe contexto.

Será utilizado:

```text
@Mock.
```

A próxima aula será:

```text
395 - M14.40 - Testes de integração Spring com Testcontainers
```

Nela, dependências reais de infraestrutura participarão do teste.

Por isso, esta aula não antecipará:

- PostgreSQL real;
- Redis real;
- SMTP real;
- container;
- migration;
- repository real;
- controller real;
- servidor real;
- integração entre camadas;
- teste de contrato.

O objetivo é dominar o service como unidade.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
390:
Upload download.

391:
Scheduler.

392:
Email e notificação simples.

393:
Testes de controller com MockMvc.

394:
Testes de service em Spring.

395:
Testes de integração Spring com Testcontainers.

396:
Testes de contrato introdução.
```

A aula 393 respondeu:

```text
como testar mapping,
validation, status e body
do controller?
```

A aula 394 responderá:

```text
como testar regras,
resultados, exceptions e colaborações
de um service Spring?
```

Nesta aula:

```text
JUnit 5:
sim.

MockitoExtension:
sim.

@Mock:
sim.

ArgumentCaptor:
sim.

AssertJ:
sim.

Clock fixo:
sim.

gerador de ID:
sim.

service real:
sim.

JavaMailSender real:
não.

Spring context:
não.

controller:
não.

MockMvc:
não.

Testcontainers:
não.

integração:
não.
```

A regra central será:

```text
o teste de service prova comportamento
e colaboração da unidade;

infraestrutura externa é substituída
por dependências controladas.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
SimpleEmailNotificationServiceTest
```

com cenários para:

1. envio válido;
2. remetente configurado;
3. destinatário configurado;
4. prefixo do assunto;
5. assunto sanitizado;
6. body preservado;
7. resultado `SUBMITTED`;
8. ID controlado;
9. instante controlado;
10. feature desabilitada;
11. command nulo;
12. assunto nulo;
13. assunto blank;
14. mensagem nula;
15. mensagem blank;
16. falha do `JavaMailSender`;
17. tradução para exception da aplicação;
18. ausência de envio em falha de validação;
19. ausência de geração de ID quando desabilitado;
20. uma única chamada de envio no sucesso.

Estrutura:

```text
src/main/java/br/com/formacao/backend
└── application
    └── notification
        ├── NotificationIdGenerator.java
        └── RandomNotificationIdGenerator.java

src/test/java/br/com/formacao/backend
└── application
    └── notification
        └── SimpleEmailNotificationServiceTest.java
```

O comando principal será:

```powershell
.\mvnw.cmd `
  -Dtest=SimpleEmailNotificationServiceTest `
  test
```

Nenhum container será necessário.

---

## Conceito essencial

### O que é uma unidade

Uma unidade é o componente principal que o teste deseja observar.

Ela não precisa ser um único método.

Pode ser uma classe com uma responsabilidade coerente.

Nesta aula:

```text
SimpleEmailNotificationService
```

é a unidade.

O teste não precisa executar o SMTP para provar que o service:

- valida a entrada;
- monta a mensagem;
- chama o port correto;
- retorna o resultado;
- traduz falhas.

---

### Service Spring continua sendo Java

Exemplo:

```java
@Service
public class SimpleEmailNotificationService {
}
```

A annotation `@Service` não altera a linguagem Java da classe.

Quando as dependências entram pelo construtor:

```text
o Spring pode criar em runtime;

o teste pode criar manualmente.
```

Isso é uma vantagem de constructor injection.

Errado para testabilidade:

```java
@Autowired
private JavaMailSender mailSender;
```

Nesse desenho, o teste precisa de reflexão, framework ou setter adicional.

A baseline mantém construtor explícito.

---

### Teste unitário versus teste de integração

Teste unitário:

```text
service real;

dependências controladas;

sem infraestrutura;

feedback rápido.
```

Teste de integração:

```text
múltiplos componentes reais;

infraestrutura real ou equivalente;

configuração Spring;

maior custo.
```

As duas categorias são necessárias.

Elas respondem perguntas diferentes.

Unitário:

```text
o service toma a decisão correta?
```

Integração:

```text
a aplicação e a infraestrutura
funcionam juntas?
```

A aula 395 tratará a segunda pergunta.

---

### MockitoExtension

JUnit 5 utiliza extensions.

A extension do Mockito é ativada com:

```java
@ExtendWith(
        MockitoExtension.class
)
```

Ela inicializa:

- `@Mock`;
- `@Captor`;
- validações de uso do Mockito;
- ciclo de vida dos mocks.

Não existe Spring context.

---

### @Mock

Exemplo:

```java
@Mock
JavaMailSender mailSender;
```

O mock não envia e-mail.

Ele registra chamadas e permite configurar comportamento.

Outro mock:

```java
@Mock
NotificationIdGenerator idGenerator;
```

A configuração `EmailNotificationProperties` é um record simples.

Ela pode ser criada diretamente, sem mock.

O `Clock` também pode ser real e fixo.

Não transforme toda dependência em mock.

---

### Dependência real simples

Use objetos reais quando forem:

- imutáveis;
- determinísticos;
- baratos;
- sem I/O;
- fáceis de construir.

Nesta aula:

```text
EmailNotificationProperties:
real.

Clock.fixed:
real.
```

Mocks serão usados para:

```text
JavaMailSender:
efeito externo.

NotificationIdGenerator:
não determinismo.
```

---

### @InjectMocks

Mockito oferece:

```java
@InjectMocks
SimpleEmailNotificationService service;
```

Ele tenta construir e injetar mocks.

A baseline não utilizará.

O service será construído manualmente:

```java
service =
        new SimpleEmailNotificationService(
                mailSender,
                properties,
                fixedClock,
                idGenerator
        );
```

Vantagens:

- dependências visíveis;
- mudança de construtor quebra o setup;
- nenhum comportamento implícito;
- leitura mais clara.

`@InjectMocks` não é proibido.

A decisão desta formação prioriza clareza.

---

### Arrange, Act, Assert

Estrutura de um teste:

```text
Arrange:
preparar command, mocks e resultado esperado.

Act:
chamar o service.

Assert:
verificar retorno e interações.
```

Exemplo:

```java
// Arrange
when(
        idGenerator.nextId()
).thenReturn(
        NOTIFICATION_ID
);

// Act
EmailNotificationResult result =
        service.send(
                command
        );

// Assert
assertThat(
        result.status()
).isEqualTo(
        "SUBMITTED"
);
```

---

### Stub

Stub define o comportamento de uma dependência.

Exemplo:

```java
when(
        idGenerator.nextId()
).thenReturn(
        NOTIFICATION_ID
);
```

Para métodos `void`, como:

```java
mailSender.send(...);
```

o mock não faz nada por default.

Não é necessário:

```java
doNothing().
```

Use `doThrow` quando quiser simular falha.

---

### Verify

Verificação prova interação.

Exemplo:

```java
verify(
        mailSender
).send(
        any(
            SimpleMailMessage.class
        )
);
```

Para quantidade:

```java
verify(
        mailSender,
        times(1)
).send(
        any(
            SimpleMailMessage.class
        )
);
```

`times(1)` é o default.

Use explicitamente quando a quantidade for parte importante da regra.

---

### ArgumentCaptor

O service cria `SimpleMailMessage` internamente.

O teste precisa inspecionar o objeto enviado.

Use:

```java
ArgumentCaptor<
        SimpleMailMessage
> captor =
        ArgumentCaptor.forClass(
                SimpleMailMessage.class
        );
```

Depois:

```java
verify(
        mailSender
).send(
        captor.capture()
);
```

Mensagem capturada:

```java
SimpleMailMessage sent =
        captor.getValue();
```

Agora o teste verifica:

- from;
- to;
- subject;
- text.

---

### Não testar implementação privada

O service possui:

```text
sanitizeSubject;
recipientDomain;
validate.
```

Esses métodos são privados.

Não use reflexão para chamá-los.

Teste o comportamento público:

```text
subject com CRLF
resulta em mensagem enviada
com assunto em uma linha.
```

A implementação pode mudar sem quebrar o contrato.

---

### Clock fixo

Use:

```java
Clock fixedClock =
        Clock.fixed(
                Instant.parse(
                        "2026-07-11T16:10:00Z"
                ),
                ZoneOffset.UTC
        );
```

O resultado será:

```text
submittedAt fixo.
```

Não dependa do relógio real.

Testes com `Instant.now()` podem falhar por diferença de milissegundos.

---

### Gerador de ID

Interface:

```java
public interface NotificationIdGenerator {

    UUID nextId();
}
```

Produção:

```java
@Component
public class RandomNotificationIdGenerator
        implements NotificationIdGenerator {

    @Override
    public UUID nextId() {
        return UUID.randomUUID();
    }
}
```

Teste:

```java
when(
        idGenerator.nextId()
).thenReturn(
        NOTIFICATION_ID
);
```

O service deixa de chamar `UUID.randomUUID()` diretamente.

---

### Determinismo

Um teste determinístico não depende de:

- horário atual;
- UUID aleatório;
- rede;
- ordem;
- porta;
- filesystem;
- ambiente local;
- Mailpit.

O mesmo input e os mesmos stubs produzem o mesmo resultado.

---

### AssertJ

Exemplos:

```java
assertThat(
        result.notificationId()
).isEqualTo(
        NOTIFICATION_ID
);
```

Exception:

```java
assertThatThrownBy(
        () ->
                service.send(
                        command
                )
)
.isInstanceOf(
        EmailNotificationException.class
)
.hasMessage(
        "Could not submit email notification"
);
```

Quando a exception possui cause:

```java
.hasCause(
        mailException
);
```

Não valide detalhes do provider que não pertencem ao service.

---

### assertThatThrownBy

A exception faz parte do contrato do service.

Exemplo:

```text
MailException externa;
EmailNotificationException interna.
```

O teste prova a tradução.

O controller não deve precisar conhecer a exception do Spring Mail.

---

### verifyNoInteractions

Quando a feature está desabilitada:

```text
mailSender não pode ser chamado;
idGenerator não precisa ser chamado.
```

Use:

```java
verifyNoInteractions(
        mailSender,
        idGenerator
);
```

Quando validation falha:

```text
nenhum efeito externo deve ocorrer.
```

---

### never

Exemplo:

```java
verify(
        mailSender,
        never()
).send(
        any()
);
```

Use quando deseja enfatizar uma operação específica.

`verifyNoInteractions` é mais forte.

Ele falha com qualquer interação.

---

### MailException

`MailException` é abstrata.

Para simular uma falha concreta, use:

```java
MailSendException
```

Exemplo:

```java
MailSendException mailException =
        new MailSendException(
                "SMTP unavailable"
        );
```

Stub de método void:

```java
doThrow(
        mailException
).when(
        mailSender
).send(
        any(
            SimpleMailMessage.class
        )
);
```

---

### Ordem das decisões

O service atual deve:

```text
1. verificar enabled;

2. validar command;

3. gerar notificationId;

4. montar mensagem;

5. enviar;

6. criar resultado.
```

Essa ordem possui efeitos observáveis.

Quando `enabled=false`:

```text
não validar conteúdo;
não gerar ID;
não enviar.
```

Quando command é inválido:

```text
não gerar ID;
não enviar.
```

Essa policy precisa ser consistente e testada.

---

### Um teste por comportamento

Evite um método com:

- sucesso;
- disabled;
- validation;
- exception;
- captor;
- vários resets.

Prefira testes pequenos.

Quando falhar, o nome precisa indicar o contrato quebrado.

---

### Setup compartilhado

Use `@BeforeEach` para construir o service.

Não coloque stubs universais que nem todos os testes precisam.

Exemplo:

```java
@BeforeEach
void setUp() {

    properties =
            new EmailNotificationProperties(
                    true,
                    "no-reply@formacao.local",
                    "aluno@formacao.local",
                    "[Formacao Java] "
            );

    service =
            new SimpleEmailNotificationService(
                    mailSender,
                    properties,
                    FIXED_CLOCK,
                    idGenerator
            );
}
```

Cada teste configura seu próprio ID ou falha.

---

### Strict stubbing

Mockito detecta stubs não utilizados em muitos cenários.

Não crie no `setUp`:

```java
when(
        idGenerator.nextId()
).thenReturn(
        NOTIFICATION_ID
);
```

se vários testes falham antes de gerar ID.

Isso pode produzir warning ou erro de unnecessary stubbing.

Stubbe somente no teste que usa.

---

## Mão na massa guiada

### 1. Criar NotificationIdGenerator

Arquivo:

```text
NotificationIdGenerator.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .notification;

import java.util.UUID;

public interface NotificationIdGenerator {

    UUID nextId();
}
```

A interface fica na camada da aplicação.

Ela não depende do Spring.

---

### 2. Criar implementação de produção

Arquivo:

```text
RandomNotificationIdGenerator.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .notification;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class RandomNotificationIdGenerator
        implements NotificationIdGenerator {

    @Override
    public UUID nextId() {
        return UUID.randomUUID();
    }
}
```

A implementação contém o não determinismo.

---

### 3. Atualizar o service

Adicione ao construtor:

```java
private final NotificationIdGenerator
        idGenerator;
```

Construtor:

```java
public SimpleEmailNotificationService(
        JavaMailSender mailSender,
        EmailNotificationProperties
                properties,
        Clock clock,
        NotificationIdGenerator
                idGenerator
) {
    this.mailSender = mailSender;
    this.properties = properties;
    this.clock = clock;
    this.idGenerator = idGenerator;
}
```

Troque:

```java
UUID.randomUUID()
```

por:

```java
idGenerator.nextId()
```

Não altere o contrato HTTP.

---

### 4. Revisar a validação do service

Garanta que exista:

```java
private void validate(
        EmailNotificationCommand command
) {
    if (command == null) {
        throw new IllegalArgumentException(
                "Email notification command is required"
        );
    }

    if (command.subject() == null
            || command.subject().isBlank()) {
        throw new IllegalArgumentException(
                "Subject is required"
        );
    }

    if (command.message() == null
            || command.message().isBlank()) {
        throw new IllegalArgumentException(
                "Message is required"
        );
    }
}
```

Fluxo no início de `send`:

```java
if (!properties.enabled()) {
    throw new EmailNotificationDisabledException();
}

validate(
        command
);
```

Depois gere o ID.

---

### 5. Criar classe de teste

Arquivo:

```text
SimpleEmailNotificationServiceTest.java
```

Estrutura:

```java
package br.com.formacao.backend.application
        .notification;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension
        .ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter
        .MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail
        .JavaMailSender;

@ExtendWith(
        MockitoExtension.class
)
class SimpleEmailNotificationServiceTest {
}
```

Não adicione annotation Spring.

---

### 6. Criar constants

```java
private static final UUID
        NOTIFICATION_ID =
                UUID.fromString(
                        "f13b90d3-80e5-4c31-a334-1e528765bcec"
                );

private static final Instant
        SUBMITTED_AT =
                Instant.parse(
                        "2026-07-11T16:10:00Z"
                );

private static final Clock
        FIXED_CLOCK =
                Clock.fixed(
                        SUBMITTED_AT,
                        ZoneOffset.UTC
                );
```

---

### 7. Declarar mocks e SUT

```java
@Mock
JavaMailSender mailSender;

@Mock
NotificationIdGenerator idGenerator;

private SimpleEmailNotificationService
        service;

private EmailNotificationProperties
        properties;
```

---

### 8. Criar setUp

```java
@BeforeEach
void setUp() {

    properties =
            new EmailNotificationProperties(
                    true,
                    "no-reply@formacao.local",
                    "aluno@formacao.local",
                    "[Formacao Java] "
            );

    service =
            new SimpleEmailNotificationService(
                    mailSender,
                    properties,
                    FIXED_CLOCK,
                    idGenerator
            );
}
```

Nenhum Spring context é iniciado.

---

### 9. Testar sucesso

```java
@Test
void shouldSubmitEmailNotification()
        {

    when(
            idGenerator.nextId()
    ).thenReturn(
            NOTIFICATION_ID
    );

    EmailNotificationCommand command =
            new EmailNotificationCommand(
                    "Notificacao simples",
                    "Mensagem enviada no teste."
            );

    EmailNotificationResult result =
            service.send(
                    command
            );

    assertThat(
            result.notificationId()
    ).isEqualTo(
            NOTIFICATION_ID
    );

    assertThat(
            result.status()
    ).isEqualTo(
            "SUBMITTED"
    );

    assertThat(
            result.submittedAt()
    ).isEqualTo(
            SUBMITTED_AT
    );

    verify(
            mailSender,
            times(1)
    ).send(
            any(
                SimpleMailMessage.class
            )
    );
}
```

Adicione imports estáticos do AssertJ e Mockito.

---

### 10. Capturar a mensagem

Crie um teste específico:

```java
@Test
void shouldBuildMessageFromConfigurationAndCommand() {

    when(
            idGenerator.nextId()
    ).thenReturn(
            NOTIFICATION_ID
    );

    EmailNotificationCommand command =
            new EmailNotificationCommand(
                    "Assunto",
                    "Corpo da mensagem"
            );

    service.send(
            command
    );

    ArgumentCaptor<
            SimpleMailMessage
    > captor =
            ArgumentCaptor.forClass(
                    SimpleMailMessage.class
            );

    verify(
            mailSender
    ).send(
            captor.capture()
    );

    SimpleMailMessage sent =
            captor.getValue();

    assertThat(
            sent.getFrom()
    ).isEqualTo(
            "no-reply@formacao.local"
    );

    assertThat(
            sent.getTo()
    ).containsExactly(
            "aluno@formacao.local"
    );

    assertThat(
            sent.getSubject()
    ).isEqualTo(
            "[Formacao Java] Assunto"
    );

    assertThat(
            sent.getText()
    ).isEqualTo(
            "Corpo da mensagem"
    );
}
```

Esse teste prova a colaboração com o mail sender.

---

### 11. Testar sanitização do assunto

```java
@Test
void shouldSanitizeControlCharactersFromSubject() {

    when(
            idGenerator.nextId()
    ).thenReturn(
            NOTIFICATION_ID
    );

    service.send(
            new EmailNotificationCommand(
                    "Linha 1\r\nLinha 2\tFim",
                    "Mensagem"
            )
    );

    ArgumentCaptor<
            SimpleMailMessage
    > captor =
            ArgumentCaptor.forClass(
                    SimpleMailMessage.class
            );

    verify(
            mailSender
    ).send(
            captor.capture()
    );

    assertThat(
            captor
                .getValue()
                .getSubject()
    ).isEqualTo(
            "[Formacao Java] Linha 1  Linha 2 Fim"
    );
}
```

O teste não chama o método privado.

---

### 12. Testar feature desabilitada

Crie outro service com properties:

```java
EmailNotificationProperties
        disabledProperties =
            new EmailNotificationProperties(
                    false,
                    "no-reply@formacao.local",
                    "aluno@formacao.local",
                    "[Formacao Java] "
            );
```

Teste:

```java
@Test
void shouldRejectWhenFeatureIsDisabled() {

    SimpleEmailNotificationService
            disabledService =
                new SimpleEmailNotificationService(
                        mailSender,
                        disabledProperties,
                        FIXED_CLOCK,
                        idGenerator
                );

    assertThatThrownBy(
            () ->
                    disabledService.send(
                            new EmailNotificationCommand(
                                    "Assunto",
                                    "Mensagem"
                            )
                    )
    ).isInstanceOf(
            EmailNotificationDisabledException.class
    );

    verifyNoInteractions(
            mailSender,
            idGenerator
    );
}
```

A feature desabilitada interrompe antes dos efeitos.

---

### 13. Testar command nulo

```java
@Test
void shouldRejectNullCommand() {

    assertThatThrownBy(
            () ->
                    service.send(
                            null
                    )
    )
    .isInstanceOf(
            IllegalArgumentException.class
    )
    .hasMessage(
            "Email notification command is required"
    );

    verifyNoInteractions(
            mailSender,
            idGenerator
    );
}
```

---

### 14. Testar assunto inválido

Crie dois testes:

```text
subject null;
subject blank.
```

Expected:

```text
IllegalArgumentException;
nenhum ID;
nenhum envio.
```

Exemplo:

```java
@Test
void shouldRejectBlankSubject() {

    EmailNotificationCommand command =
            new EmailNotificationCommand(
                    "   ",
                    "Mensagem"
            );

    assertThatThrownBy(
            () ->
                    service.send(
                            command
                    )
    )
    .isInstanceOf(
            IllegalArgumentException.class
    )
    .hasMessage(
            "Subject is required"
    );

    verifyNoInteractions(
            mailSender,
            idGenerator
    );
}
```

---

### 15. Testar mensagem inválida

Repita para:

```text
message null;
message blank.
```

O service não deve gerar ID nem chamar SMTP.

A validação web e a validação do service protegem fronteiras diferentes.

---

### 16. Testar falha do mail sender

```java
@Test
void shouldTranslateMailFailure() {

    when(
            idGenerator.nextId()
    ).thenReturn(
            NOTIFICATION_ID
    );

    MailSendException mailException =
            new MailSendException(
                    "SMTP unavailable"
            );

    doThrow(
            mailException
    ).when(
            mailSender
    ).send(
            any(
                SimpleMailMessage.class
            )
    );

    EmailNotificationCommand command =
            new EmailNotificationCommand(
                    "Assunto",
                    "Mensagem"
            );

    assertThatThrownBy(
            () ->
                    service.send(
                            command
                    )
    )
    .isInstanceOf(
            EmailNotificationException.class
    )
    .hasMessage(
            "Could not submit email notification"
    )
    .hasCause(
            mailException
    );

    verify(
            idGenerator
    ).nextId();

    verify(
            mailSender
    ).send(
            any(
                SimpleMailMessage.class
            )
    );
}
```

O resultado não é retornado quando o envio falha.

---

### 17. Testar uma única geração de ID

No sucesso:

```java
verify(
        idGenerator,
        times(1)
).nextId();
```

Na falha SMTP:

```text
ID já foi gerado;
uma tentativa foi identificada.
```

Na validation:

```text
ID não foi gerado.
```

Essa ordem documenta o comportamento.

---

### 18. Testar prefixo vazio permitido ou proibido

As properties usam:

```text
@NotBlank subjectPrefix.
```

No teste unitário, o record pode ser construído com valor inválido porque Bean Validation não é executada automaticamente.

Não transforme o teste de service em teste de `@ConfigurationProperties`.

A policy da configuração deve possuir teste próprio quando necessário.

Nesta aula, use properties válidas.

O service assume que a configuração foi validada no startup.

---

### 19. Não testar logs por enquanto

A aula 384 já ensinou logging.

Seria possível capturar eventos com um appender de teste.

Nesta aula, o foco é:

- resultado;
- exception;
- colaboração;
- ausência de efeitos.

Não adicione acoplamento excessivo ao texto de logs.

Os event names podem receber testes específicos quando forem parte de uma política operacional crítica.

---

### 20. Executar a classe

```powershell
.\mvnw.cmd `
  -Dtest=SimpleEmailNotificationServiceTest `
  test
```

Resultado esperado:

```text
zero failures;
zero errors;
sem Docker;
sem Mailpit.
```

---

### 21. Executar um método

```powershell
.\mvnw.cmd `
  "-Dtest=SimpleEmailNotificationServiceTest#shouldTranslateMailFailure" `
  test
```

Isso acelera o ciclo durante desenvolvimento.

---

### 22. Executar repetidamente

```powershell
1..10 | ForEach-Object {

    .\mvnw.cmd `
      -q `
      -Dtest=SimpleEmailNotificationServiceTest `
      test

    if ($LASTEXITCODE -ne 0) {
        throw "Execution $_ failed"
    }
}
```

Clock e UUID controlados devem manter o resultado determinístico.

---

### 23. Revisar mutation mental

Para cada teste, imagine uma alteração errada.

Exemplo:

```text
remover prefixo;
trocar destinatário;
não sanitizar assunto;
retornar DELIVERED;
ignorar disabled;
engolir MailException;
chamar mail sender duas vezes.
```

Pergunta:

```text
qual teste falharia?
```

Se nenhuma resposta existir, pode haver uma lacuna relevante.

---

### 24. Executar testes das duas aulas

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,SimpleEmailNotificationServiceTest" `
  test
```

Agora existem dois níveis:

```text
controller:
HTTP.

service:
regra e colaboração.
```

Nenhum dos dois utiliza Mailpit.

O teste manual da aula 392 continua útil para provar o SMTP local.

---

## Entendendo o que foi feito

### O service foi testado sem Spring context

Constructor injection permitiu criação manual.

### O transporte foi controlado

`JavaMailSender` mockado não acessou SMTP.

### O tempo ficou determinístico

`Clock.fixed` eliminou dependência do relógio real.

### O ID ficou determinístico

`NotificationIdGenerator` isolou `UUID.randomUUID`.

### A mensagem foi inspecionada

`ArgumentCaptor` comprovou from, to, subject e text.

### Falhas foram traduzidas

`MailSendException` virou `EmailNotificationException`.

### Efeitos indevidos foram bloqueados

Validation e disabled não chamaram dependências externas.

### Controller e service possuem perguntas diferentes

MockMvc testa HTTP.

Mockito testa comportamento da unidade.

---

## Erros comuns importantes

### Iniciar Spring para testar uma classe simples

Aumenta tempo e esconde dependências.

### Mockar properties sem necessidade

Records reais são mais claros.

### Usar horário e UUID reais

O teste perde determinismo.

### Usar @InjectMocks sem entender o construtor

Mudanças podem ficar menos visíveis.

### Testar método privado com reflexão

Acopla o teste à implementação.

### Verificar somente o retorno

O service também possui efeito de envio.

### Verificar somente a interação

O resultado retornado também faz parte do contrato.

### Colocar stub global não utilizado

Mockito pode acusar unnecessary stubbing.

### Reimplementar o service no teste

O teste deve configurar dependências, não duplicar a lógica.

### Usar Mailpit no teste unitário

Isso transforma a unidade em integração.

---

## Comandos úteis

### Executar service test

```powershell
.\mvnw.cmd `
  -Dtest=SimpleEmailNotificationServiceTest `
  test
```

### Executar um cenário

```powershell
.\mvnw.cmd `
  "-Dtest=SimpleEmailNotificationServiceTest#shouldSubmitEmailNotification" `
  test
```

### Controller e service

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,SimpleEmailNotificationServiceTest" `
  test
```

### Todos os unitários por padrão de nome

```powershell
.\mvnw.cmd `
  "-Dtest=*Test" `
  test
```

### Relatórios

```powershell
Get-ChildItem `
  ".\target\surefire-reports"
```

---

## Exercício guiado

### Parte 1 — Resultado

Teste ID, status e instante.

### Parte 2 — Mensagem enviada

Capture `SimpleMailMessage`.

Valide from, to, subject e text.

### Parte 3 — Sanitização

Envie CR, LF e tab no assunto.

Confirme uma linha.

### Parte 4 — Feature desabilitada

Confirme exception e zero interações.

### Parte 5 — Validation

Teste:

```text
command null;
subject null;
subject blank;
message null;
message blank.
```

### Parte 6 — Falha SMTP

Faça `JavaMailSender` lançar `MailSendException`.

Confirme tradução e cause.

### Parte 7 — Determinismo

Execute dez vezes.

Confirme estabilidade.

### Parte 8 — Registrar decisão

Anote:

```text
JUnit 5;

MockitoExtension;

service real;

JavaMailSender mockado;

properties reais;

Clock.fixed;

NotificationIdGenerator;

UUID controlado;

construção manual do SUT;

ArgumentCaptor;

AssertJ;

sem ApplicationContext;

sem SMTP;

sem Mailpit;

sem banco;

sem Redis;

integração somente na aula 395.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 393 foi preservada;
- `SimpleEmailNotificationServiceTest` foi criado;
- `@ExtendWith(MockitoExtension.class)` foi usado;
- `@Mock` foi usado;
- `@MockitoBean` não foi usado;
- `@SpringBootTest` não foi usado;
- `@WebMvcTest` não foi usado;
- ApplicationContext não foi iniciado;
- controller não participou;
- MockMvc não participou;
- Mailpit não foi iniciado;
- JavaMailSender real não foi usado;
- PostgreSQL não foi usado;
- Redis não foi usado;
- filesystem não foi usado;
- service real foi criado;
- constructor injection foi aproveitada;
- SUT foi construído manualmente;
- properties reais foram usadas;
- `Clock.fixed` foi usado;
- `NotificationIdGenerator` foi criado;
- implementação aleatória foi criada;
- UUID direto foi removido do service;
- gerador foi mockado;
- resultado de sucesso foi validado;
- notificationId foi validado;
- status `SUBMITTED` foi validado;
- submittedAt foi validado;
- envio ocorreu uma vez;
- `ArgumentCaptor` foi usado;
- from foi validado;
- to foi validado;
- subject prefix foi validado;
- body foi validado;
- sanitização do assunto foi testada;
- feature desabilitada foi testada;
- command nulo foi testado;
- subject nulo foi testado;
- subject blank foi testado;
- message nula foi testada;
- message blank foi testada;
- dependências não foram chamadas em validation;
- ID não foi gerado em validation;
- ID não foi gerado quando disabled;
- `MailSendException` foi usada;
- falha do mail sender foi simulada;
- exception foi traduzida;
- cause foi preservada;
- interação de falha foi verificada;
- stubs foram locais aos testes;
- unnecessary stubbing foi evitado;
- método privado não foi testado diretamente;
- logs não foram supertestados;
- classe foi executada isoladamente;
- classe foi executada repetidamente;
- controller e service tests foram executados juntos;
- testes de integração não foram antecipados;
- Testcontainers não foi antecipado;
- repository real não foi antecipado;
- contrato não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 395 está correta.

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
git commit -m "test(m14): testar service de notificacao com Mockito"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- relatórios;
- logs;
- dados do Mailpit;
- credentials;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você testou o service de notificação como uma unidade.

O fluxo ficou:

```text
JUnit;

MockitoExtension;

SimpleEmailNotificationService real;

EmailNotificationProperties real;

Clock fixo;

NotificationIdGenerator mockado;

JavaMailSender mockado;

resultado;

ArgumentCaptor;

AssertJ;

Mockito verify.
```

Você comprovou:

```text
resultado SUBMITTED;

ID determinístico;

tempo determinístico;

mensagem montada corretamente;

prefixo;

sanitização;

disabled;

validation;

tradução de MailException;

ausência de efeitos indevidos.
```

A decisão central foi:

```text
um service Spring bem projetado
não precisa do Spring
para ser testado como unidade;

constructor injection torna
dependências explícitas;

mocks controlam efeitos externos;

objetos reais simples preservam clareza.
```

A próxima aula será:

```text
395 - M14.40 - Testes de integração Spring com Testcontainers
```

Nela, o foco mudará para componentes reais trabalhando juntos.

Você utilizará infraestrutura em containers para validar:

- configuração Spring;
- banco real;
- migrations;
- repositories;
- transações;
- integração da aplicação.

Esses cenários não foram antecipados aqui.

---

# Material complementar

## Checkpoint final

- [ ] Criei o service test sem contexto Spring.
- [ ] Controlei ID e tempo.
- [ ] Capturei `SimpleMailMessage`.
- [ ] Testei validation, disabled e falha SMTP.
- [ ] Executei sem Mailpit, banco ou Redis.

---

## Troubleshooting adicional

### Mock é null

Confirme:

```text
@ExtendWith(MockitoExtension.class).
```

### Service exige outra dependência

Atualize o setup manual.

Isso torna a mudança explícita.

### Teste falha por unnecessary stubbing

Mova o stub para o método que realmente o utiliza.

### Captor não possui valor

O mail sender pode não ter sido chamado.

Revise validation, enabled e stub de ID.

### submittedAt varia

O service pode estar usando `Instant.now()` diretamente.

Use o `Clock` injetado.

### notificationId varia

O service pode ainda chamar `UUID.randomUUID()`.

Use `NotificationIdGenerator`.

### Exception não possui cause

Revise o construtor de `EmailNotificationException`.

### Mail sender é chamado em validation

A ordem do service está incorreta.

Valide antes de gerar efeito.

---

## Observações para aulas futuras

Testes de service também podem utilizar:

- fakes;
- stubs escritos manualmente;
- parameterized tests;
- dynamic tests;
- property-based testing;
- mutation testing.

Eles não substituem integração.

Um mock confirma que o service chamou uma interface conforme esperado.

Ele não prova que:

- SMTP aceita a mensagem;
- PostgreSQL executa a query;
- Redis serializa corretamente;
- migration funciona;
- transação faz commit.

A próxima aula começará a responder essas perguntas com Testcontainers.

---

## Perguntas de revisão

1. Qual é o SUT?
2. O teste inicia Spring?
3. Qual extension é usada?
4. O que `@Mock` cria?
5. Por que properties são reais?
6. Por que Clock é fixo?
7. Por que criar gerador de ID?
8. O que ArgumentCaptor inspeciona?
9. O que é stub?
10. O que é verify?
11. Quando usar verifyNoInteractions?
12. O método privado é chamado diretamente?
13. Qual exception simula SMTP?
14. Qual exception o service lança?
15. O Mailpit participa?
16. O controller participa?
17. MockMvc participa?
18. Testcontainers participa?
19. O teste é determinístico?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `SimpleEmailNotificationService`.
2. Não.
3. `MockitoExtension`.
4. Uma dependência controlada.
5. São simples e determinísticas.
6. Para controlar o tempo.
7. Para controlar UUID.
8. A mensagem enviada.
9. Comportamento configurado do mock.
10. Comprovação de interação.
11. Quando nenhuma interação é permitida.
12. Não.
13. `MailSendException`.
14. `EmailNotificationException`.
15. Não.
16. Não.
17. Não.
18. Não.
19. Sim.
20. Testes de integração com Testcontainers.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 394 - M14.39 - Testes de service em Spring

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei teste unitário de teste de integração.
- Testei um service Spring como classe Java.
- Não iniciei ApplicationContext.
- Usei JUnit 5.
- Usei `MockitoExtension`.
- Usei `@Mock`.
- Não usei `@MockitoBean`.
- Mantive `SimpleEmailNotificationService` real.
- Mockei `JavaMailSender`.
- Usei `EmailNotificationProperties` real.
- Usei `Clock.fixed`.
- Criei `NotificationIdGenerator`.
- Criei `RandomNotificationIdGenerator`.
- Removi `UUID.randomUUID()` direto do service.
- Mockei o gerador de ID.
- Construí o SUT manualmente.
- Testei o resultado `SUBMITTED`.
- Validei notificationId e submittedAt.
- Usei `ArgumentCaptor`.
- Validei from, to, subject e text.
- Testei o prefixo do assunto.
- Testei sanitização de CR, LF e tab.
- Testei feature desabilitada.
- Testei command nulo.
- Testei subject nulo e blank.
- Testei message nula e blank.
- Confirmei ausência de efeitos em validation.
- Simulei `MailSendException`.
- Testei tradução para `EmailNotificationException`.
- Preservei a cause.
- Evitei stubs globais desnecessários.
- Executei os testes repetidamente.
- Não usei Mailpit, banco, Redis ou Testcontainers.
- Próxima aula: Testes de integração Spring com Testcontainers.
```

---

## Referência técnica curta

- [JUnit 5 — User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito — JUnit Jupiter](https://javadoc.io/doc/org.mockito/mockito-junit-jupiter/latest/org/mockito/junit/jupiter/MockitoExtension.html)
- [Spring Framework — Unit Testing](https://docs.spring.io/spring-framework/reference/testing/unit.html)
- [AssertJ — Core Assertions](https://assertj.github.io/doc/)

Regra final:

```text
um teste de service deve manter a unidade real, controlar dependências externas, tornar tempo e identidade determinísticos, verificar resultado, exceptions, colaborações e ausência de efeitos indevidos sem iniciar infraestrutura desnecessária; nesta baseline, SimpleEmailNotificationService é construído manualmente, JavaMailSender e NotificationIdGenerator são mocks, properties e Clock são objetos reais, ArgumentCaptor inspeciona a mensagem e AssertJ comprova o contrato do service.
```
