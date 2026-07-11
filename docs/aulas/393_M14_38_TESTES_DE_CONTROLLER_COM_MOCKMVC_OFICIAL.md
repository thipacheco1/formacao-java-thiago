# 393 - M14.38 - Testes de controller com MockMvc

## Apresentação da aula

Na aula 392, você adicionou o envio de uma notificação simples por e-mail.

O fluxo ficou:

```text
request HTTP;

controller v2;

validação;

command;

SimpleEmailNotificationService;

JavaMailSender;

SMTP;

Mailpit;

202 SUBMITTED.
```

Aquela aula foi validada manualmente.

Você iniciou a aplicação, enviou requests e abriu a interface do Mailpit para conferir a mensagem.

Esse tipo de validação é importante.

Porém, repetir todo o processo manualmente a cada alteração possui limites:

- depende de a aplicação estar em execução;
- depende de portas livres;
- depende do Mailpit;
- exige preparação;
- demora mais;
- pode ser esquecido;
- é difícil executar em toda mudança;
- não oferece feedback imediato no build.

A pergunta central desta aula será:

```text
como testar o contrato HTTP de um controller
sem iniciar um servidor real,
sem acessar banco,
sem acessar Redis
e sem enviar e-mail?
```

A solução utilizará:

```text
JUnit 5;

Spring Test;

@WebMvcTest;

MockMvc;

@MockitoBean;

ObjectMapper;

Mockito;

JsonPath;

Bean Validation;

Problem Details.
```

O controller principal do laboratório será:

```text
EmailNotificationController
```

Ele possui uma dependência:

```text
SimpleEmailNotificationService.
```

No teste de controller, o objetivo não é testar SMTP.

O service será substituído por um mock.

Assim, a aula responderá perguntas como:

```text
o endpoint aceita o método correto?

o content type correto é exigido?

o JSON é desserializado?

Bean Validation é executada?

o controller cria o command correto?

o status 202 é devolvido?

o body possui os campos esperados?

uma exception da aplicação vira Problem Details?

o service deixa de ser chamado
quando a request é inválida?
```

O MockMvc executa o pipeline Spring MVC usando requests e responses simuladas.

Ele não abre uma porta HTTP.

Ele não inicia Tomcat real para cada teste.

Mesmo assim, ele exercita grande parte da camada web:

- mapping;
- conversores HTTP;
- Jackson;
- Bean Validation;
- argument resolvers;
- controller;
- `ControllerAdvice`;
- status;
- headers;
- serialização da response.

A baseline utilizará:

```text
@WebMvcTest(
    controllers =
        EmailNotificationController.class
)
```

No Spring Boot 4, `@WebMvcTest` pertence ao módulo de testes MVC e limita o contexto aos componentes relevantes da camada web.

O service será substituído com:

```text
@MockitoBean.
```

A annotation atual substitui ou cria um bean mock no `ApplicationContext` do teste.

O projeto já possui vários filters:

- correlation;
- lifecycle;
- write traffic gate;
- rate limiting.

Esses filters possuem testes e responsabilidades próprias.

Nesta aula, o teste será focado no controller.

Por isso, a baseline utilizará:

```text
@AutoConfigureMockMvc(
    addFilters = false
)
```

Essa escolha significa:

```text
testar o controller e o MVC;

não testar a cadeia completa de filters.
```

Os filters voltarão a participar dos testes de integração, em aula própria.

O controller da aula 392 está condicionado ao profile:

```text
mail-lab.
```

O teste ativará:

```text
@ActiveProfiles("mail-lab")
```

Sem isso, o bean do controller pode não existir.

O teste não iniciará:

- PostgreSQL;
- Redis;
- Mailpit;
- scheduler;
- servidor HTTP real;
- filesystem de upload;
- cache;
- rate limiting.

A próxima aula será:

```text
394 - M14.39 - Testes de service em Spring
```

Por isso, esta aula não aprofundará:

- regras internas do service;
- interação real com `JavaMailSender`;
- testes de repository;
- Testcontainers;
- testes de integração;
- testes de contrato;
- servidor real;
- banco real;
- Redis real.

O objetivo é dominar a camada web de forma isolada e confiável.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
389:
Rate limiting.

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
```

A aula 392 respondeu:

```text
como submeter uma notificação simples
a um servidor SMTP?
```

A aula 393 responderá:

```text
como comprovar automaticamente
que o controller cumpre
seu contrato HTTP?
```

Nesta aula:

```text
JUnit 5:
sim.

@WebMvcTest:
sim.

MockMvc:
sim.

@MockitoBean:
sim.

Mockito:
sim.

ObjectMapper:
sim.

JsonPath:
sim.

Bean Validation:
sim.

Problem Details:
sim.

servidor real:
não.

SMTP real:
não.

Mailpit:
não.

PostgreSQL:
não.

Redis:
não.

Testcontainers:
não.

testes de service:
não.

testes de integração:
não.
```

A regra central será:

```text
o teste de controller verifica a fronteira HTTP;

colaboradores são controlados;

infraestrutura externa permanece fora.
```

---

## Objetivo prático

Ao final da aula, você terá uma classe:

```text
EmailNotificationControllerTest
```

Ela cobrirá:

1. envio válido retorna `202`;
2. response possui `notificationId`;
3. response possui status `SUBMITTED`;
4. response possui `submittedAt`;
5. request JSON vira command;
6. service é chamado uma vez;
7. assunto vazio retorna `400`;
8. mensagem vazia retorna `400`;
9. assunto acima do limite retorna `400`;
10. mensagem acima do limite retorna `400`;
11. JSON inválido retorna `400`;
12. media type incorreto retorna `415`;
13. falha do service retorna `503`;
14. Problem Details possui código esperado;
15. service não é chamado em requests inválidas.

Estrutura:

```text
src/test/java/br/com/formacao/backend
└── web
    └── v2
        └── notification
            └── EmailNotificationControllerTest.java
```

O teste utilizará:

```text
MockMvc:
executar requests.

ObjectMapper:
produzir JSON.

Mockito:
controlar o service.

JsonPath:
verificar campos.

ArgumentCaptor:
inspecionar o command.
```

O resultado será executado com:

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationControllerTest `
  test
```

---

## Conceito essencial

### O que MockMvc testa

MockMvc testa a aplicação Spring MVC no lado do servidor.

Ele simula:

```text
request;
dispatch;
mapping;
conversão;
validation;
controller;
advice;
response.
```

Ele não usa uma conexão TCP real.

A chamada acontece dentro do processo de teste.

Isso torna os testes:

- rápidos;
- determinísticos;
- independentes de porta;
- adequados ao build;
- focados no contrato web.

---

### MockMvc não é um mock do controller

Apesar do nome, MockMvc não significa:

```text
controller substituído por mock.
```

O controller é real.

O que é simulado:

```text
request e response Servlet.
```

A infraestrutura MVC é carregada.

Os colaboradores do controller podem ser substituídos por mocks.

Na baseline:

```text
controller:
real.

Bean Validation:
real.

Jackson:
real.

ControllerAdvice:
real.

service:
mock.
```

---

### @WebMvcTest

`@WebMvcTest` cria um slice de teste.

Slice significa:

```text
carregar somente uma parte
da aplicação.
```

Exemplo:

```java
@WebMvcTest(
        controllers =
                EmailNotificationController.class
)
class EmailNotificationControllerTest {
}
```

A annotation inclui infraestrutura relevante de Spring MVC.

Ela não carrega automaticamente:

- services comuns;
- repositories;
- banco;
- Redis;
- Mailpit;
- scheduler.

As dependências necessárias do controller precisam ser fornecidas.

---

### Slice versus aplicação completa

`@WebMvcTest`:

```text
foco:
web.

contexto:
reduzido.

servidor:
não.

infraestrutura externa:
não.
```

`@SpringBootTest`:

```text
foco:
aplicação ampla.

contexto:
completo.

servidor:
opcional.

infraestrutura:
pode ser necessária.
```

Nesta aula, usar o contexto completo esconderia o objetivo.

O controller não precisa de PostgreSQL ou SMTP para provar que transforma uma request válida em uma chamada ao service e em uma response `202`.

---

### @MockitoBean

O controller depende de:

```text
SimpleEmailNotificationService.
```

O slice não deve criar o service real porque ele exigiria `JavaMailSender`.

Use:

```java
@MockitoBean
SimpleEmailNotificationService
        service;
```

Esse mock participa do `ApplicationContext`.

Quando o controller é construído, o Spring injeta o mock.

A annotation atual pertence ao Spring Test e substitui ou cria o bean necessário para o contexto.

---

### Stub e verificação

Um mock possui dois usos principais.

Stub:

```text
definir o que retorna.
```

Exemplo:

```java
when(
        service.send(
                any(
                    EmailNotificationCommand.class
                )
        )
).thenReturn(
        result
);
```

Verificação:

```text
comprovar que foi chamado.
```

Exemplo:

```java
verify(
        service
).send(
        any(
            EmailNotificationCommand.class
        )
);
```

O teste não deve verificar cada detalhe interno do controller.

Ele verifica a interação relevante.

---

### MockMvc.perform

Uma request é executada com:

```java
mockMvc.perform(
        post(
                "/api/v2/runtime/notifications/email"
        )
        .contentType(
                MediaType.APPLICATION_JSON
        )
        .content(
                json
        )
);
```

Depois, expectativas são encadeadas:

```java
.andExpect(
        status().isAccepted()
)
.andExpect(
        content()
                .contentTypeCompatibleWith(
                        MediaType.APPLICATION_JSON
                )
);
```

---

### ObjectMapper

Não monte JSON com concatenação:

```java
"{\"subject\":\"" + subject + "\"}"
```

Use o `ObjectMapper` configurado no slice:

```java
String json =
        objectMapper.writeValueAsString(
                request
        );
```

Isso garante:

- escape correto;
- encoding;
- nomes dos campos;
- representação compatível com Jackson;
- menor fragilidade.

No projeto Spring Boot 4, o mapper utiliza a linha atual do Jackson configurada pela aplicação.

---

### JsonPath

JsonPath permite verificar partes do JSON.

Exemplo:

```java
.andExpect(
        jsonPath(
                "$.status"
        ).value(
                "SUBMITTED"
        )
);
```

Outros exemplos:

```text
$.notificationId;
$.submittedAt;
$.code;
$.violations[0].field.
```

Não use JsonPath para ignorar todo o contrato.

Campos importantes precisam ser verificados.

---

### Status HTTP

O teste precisa validar o status exato.

Exemplos:

```text
202:
submissão aceita.

400:
payload inválido.

415:
media type não aceito.

503:
service de e-mail indisponível.
```

Evite:

```java
status().is2xxSuccessful()
```

quando o contrato exige especificamente `202`.

---

### Content-Type

O teste deve confirmar:

```text
application/json
```

ou:

```text
application/problem+json
```

conforme a response.

Use:

```java
content()
    .contentTypeCompatibleWith(...)
```

Isso tolera parâmetros válidos, como charset, sem relaxar o tipo principal.

---

### Bean Validation

A request possui:

```text
@NotBlank;
@Size.
```

MockMvc percorre:

```text
JSON;
request DTO;
@Valid;
Bean Validation;
ControllerAdvice.
```

Quando a request é inválida:

```text
o controller não chama o service.
```

O teste precisa provar os dois lados:

- status e body;
- ausência de interação com o service.

---

### verifyNoInteractions

Exemplo:

```java
verifyNoInteractions(
        service
);
```

Use quando nenhuma chamada ao mock é permitida.

Isso ajuda a provar que validation interrompeu o fluxo antes da regra de aplicação.

Se o mesmo mock possuir interações de setup em outro método, prefira uma verificação específica:

```java
verify(
        service,
        never()
).send(
        any()
);
```

---

### ArgumentCaptor

O controller transforma:

```text
SendEmailNotificationRequest
```

em:

```text
EmailNotificationCommand.
```

Use `ArgumentCaptor` para validar o mapeamento:

```java
ArgumentCaptor<
        EmailNotificationCommand
> captor =
        ArgumentCaptor.forClass(
                EmailNotificationCommand.class
        );

verify(
        service
).send(
        captor.capture()
);

assertThat(
        captor.getValue().subject()
).isEqualTo(
        "Notificacao simples"
);
```

Não exponha um mapper separado somente para facilitar esse teste.

---

### Problem Details

A API já possui um formato de erro baseado em Problem Details.

Quando o service lança:

```text
EmailNotificationException
```

o advice transforma em:

```text
503;
application/problem+json;
code email_service_unavailable.
```

O teste precisa validar o contrato público.

Ele não deve validar:

- mensagem interna da exception;
- host SMTP;
- stack trace;
- classe concreta da cause.

---

### Malformed JSON

Uma request pode possuir:

```json
{
  "subject": "Teste",
  "message":
}
```

O controller não recebe um DTO válido.

O pipeline deve devolver:

```text
400.
```

O service não pode ser chamado.

Esse cenário é diferente de Bean Validation.

Aqui, a desserialização falhou antes.

---

### Media type incorreto

O endpoint declara:

```text
consumes application/json.
```

Uma request com:

```text
text/plain
```

deve receber:

```text
415 Unsupported Media Type.
```

O teste confirma que o mapping não aceita conteúdo arbitrário.

---

### @ActiveProfiles

O controller foi anotado:

```text
@Profile("mail-lab").
```

O teste precisa ativar:

```java
@ActiveProfiles(
        "mail-lab"
)
```

Isso faz parte da configuração real da feature.

Não remova o profile do código apenas para o teste ficar verde.

---

### Filters no slice

No Spring Boot 4, `@WebMvcTest` pode incluir filters encontrados no contexto.

O projeto possui filters que dependem de properties, Redis e outras decisões.

Como esta aula testa o controller isoladamente:

```java
@AutoConfigureMockMvc(
        addFilters = false
)
```

Essa decisão não afirma que filters não importam.

Ela afirma:

```text
este arquivo testa o controller;
outro nível testa a cadeia completa.
```

---

### Standalone setup

MockMvc também pode ser construído com:

```text
standaloneSetup.
```

Esse modo instancia um controller diretamente e configura manualmente a infraestrutura.

Ele é útil em testes muito focados.

Porém, exige registrar manualmente:

- advice;
- converters;
- validation;
- argument resolvers;
- configuração MVC.

A baseline utiliza `@WebMvcTest` para testar a configuração MVC real do slice.

---

### Nomes de testes

Use nomes que expressem comportamento.

Exemplos:

```text
shouldReturnAcceptedWhenRequestIsValid;

shouldReturnBadRequestWhenSubjectIsBlank;

shouldNotCallServiceWhenRequestIsInvalid;

shouldReturnServiceUnavailableWhenEmailSubmissionFails.
```

Evite:

```text
test1;
testController;
successTest.
```

---

### Arrange, Act, Assert

Estrutura:

```text
Arrange:
preparar mock e request.

Act:
executar MockMvc.

Assert:
validar response e interação.
```

O encadeamento do MockMvc reúne Act e parte do Assert.

Mantenha o setup legível.

---

### Determinismo

Use valores fixos:

```text
UUID conhecido;
Instant conhecido;
subject conhecido;
message conhecida.
```

Não use:

```java
UUID.randomUUID();
Instant.now();
```

no resultado stubado.

O teste precisa produzir o mesmo resultado em toda execução.

---

## Mão na massa guiada

### 1. Confirmar dependência de teste

O projeto deve possuir:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

No Spring Boot 4, o starter reúne as dependências comuns de teste, enquanto o suporte de slice MVC é fornecido pelos módulos de teste do Boot.

Não adicione versões manualmente.

Execute:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dscope=test"
```

Confirme a presença de:

- JUnit Jupiter;
- Spring Test;
- Mockito;
- AssertJ;
- suporte de MockMvc.

---

### 2. Criar a classe de teste

Arquivo:

```text
EmailNotificationControllerTest.java
```

Estrutura inicial:

```java
package br.com.formacao.backend.web.v2
        .notification;

import org.springframework.boot.webmvc.test
        .autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test
        .autoconfigure.WebMvcTest;
import org.springframework.test.context
        .ActiveProfiles;

@WebMvcTest(
        controllers =
                EmailNotificationController.class
)
@AutoConfigureMockMvc(
        addFilters = false
)
@ActiveProfiles(
        "mail-lab"
)
class EmailNotificationControllerTest {
}
```

Observe os packages do Spring Boot 4:

```text
org.springframework.boot.webmvc.test.autoconfigure.
```

Não copie imports antigos sem conferir a versão do projeto.

---

### 3. Injetar MockMvc e ObjectMapper

Adicione:

```java
@Autowired
MockMvc mockMvc;

@Autowired
ObjectMapper objectMapper;
```

Import do mapper usado pelo projeto:

```java
import tools.jackson.databind.ObjectMapper;
```

Mantenha package-private quando o padrão do projeto permitir.

---

### 4. Criar o mock do service

Adicione:

```java
@MockitoBean
SimpleEmailNotificationService
        service;
```

Import:

```java
import org.springframework.test.context
        .bean.override.mockito.MockitoBean;
```

O controller real receberá esse mock.

Mailpit não será iniciado.

---

### 5. Criar valores fixos

Adicione constants:

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
```

Endpoint:

```java
private static final String
        ENDPOINT =
                "/api/v2/runtime/notifications/email";
```

---

### 6. Testar request válida

Método:

```java
@Test
void shouldReturnAcceptedWhenRequestIsValid()
        throws Exception {

    SendEmailNotificationRequest request =
            new SendEmailNotificationRequest(
                    "Notificacao simples",
                    "Mensagem enviada pelo teste."
            );

    EmailNotificationResult result =
            new EmailNotificationResult(
                    NOTIFICATION_ID,
                    "SUBMITTED",
                    SUBMITTED_AT
            );

    when(
            service.send(
                    any(
                        EmailNotificationCommand.class
                    )
            )
    ).thenReturn(
            result
    );

    mockMvc.perform(
            post(
                    ENDPOINT
            )
            .contentType(
                    MediaType.APPLICATION_JSON
            )
            .content(
                    objectMapper
                            .writeValueAsString(
                                    request
                            )
            )
    )
    .andExpect(
            status().isAccepted()
    )
    .andExpect(
            content()
                    .contentTypeCompatibleWith(
                            MediaType.APPLICATION_JSON
                    )
    )
    .andExpect(
            jsonPath(
                    "$.notificationId"
            ).value(
                    NOTIFICATION_ID.toString()
            )
    )
    .andExpect(
            jsonPath(
                    "$.status"
            ).value(
                    "SUBMITTED"
            )
    )
    .andExpect(
            jsonPath(
                    "$.submittedAt"
            ).value(
                    SUBMITTED_AT.toString()
            )
    );
}
```

O teste comprova o contrato de sucesso.

---

### 7. Verificar o command

No mesmo teste ou em um teste separado:

```java
ArgumentCaptor<
        EmailNotificationCommand
> captor =
        ArgumentCaptor.forClass(
                EmailNotificationCommand.class
        );

verify(
        service
).send(
        captor.capture()
);

EmailNotificationCommand command =
        captor.getValue();

assertThat(
        command.subject()
).isEqualTo(
        "Notificacao simples"
);

assertThat(
        command.message()
).isEqualTo(
        "Mensagem enviada pelo teste."
);
```

Isso comprova o mapping request para aplicação.

---

### 8. Testar assunto vazio

```java
@Test
void shouldReturnBadRequestWhenSubjectIsBlank()
        throws Exception {

    SendEmailNotificationRequest request =
            new SendEmailNotificationRequest(
                    "",
                    "Mensagem valida"
            );

    mockMvc.perform(
            post(
                    ENDPOINT
            )
            .contentType(
                    MediaType.APPLICATION_JSON
            )
            .content(
                    objectMapper
                            .writeValueAsString(
                                    request
                            )
            )
    )
    .andExpect(
            status().isBadRequest()
    )
    .andExpect(
            content()
                    .contentTypeCompatibleWith(
                            MediaType.APPLICATION_PROBLEM_JSON
                    )
    );

    verify(
            service,
            never()
    ).send(
            any()
    );
}
```

Se o Problem Details atual possui `violations`, valide:

```java
.andExpect(
    jsonPath(
        "$.violations[?(@.field == 'subject')]"
    ).exists()
);
```

Use a estrutura real já adotada pelo projeto.

---

### 9. Testar mensagem vazia

Repita o padrão:

```text
subject válido;
message blank;
400;
service não chamado.
```

Não agrupe todos os erros em um único teste enorme.

Uma falha precisa indicar qual comportamento quebrou.

---

### 10. Testar limite do assunto

Crie:

```java
String longSubject =
        "a".repeat(
                121
        );
```

Resultado:

```text
400;
violação de subject;
service não chamado.
```

Depois, adicione um teste de fronteira:

```text
120 caracteres:
aceito.
```

Testes de boundary evitam erro de `>=` versus `>`.

---

### 11. Testar limite da mensagem

Crie:

```java
String longMessage =
        "m".repeat(
                2001
        );
```

Resultado:

```text
400.
```

Teste também:

```text
2.000 caracteres:
aceito.
```

Para os casos aceitos, stubbe o service.

---

### 12. Testar JSON inválido

```java
@Test
void shouldReturnBadRequestWhenJsonIsMalformed()
        throws Exception {

    String malformedJson =
            """
            {
              "subject": "Teste",
              "message":
            }
            """;

    mockMvc.perform(
            post(
                    ENDPOINT
            )
            .contentType(
                    MediaType.APPLICATION_JSON
            )
            .content(
                    malformedJson
            )
    )
    .andExpect(
            status().isBadRequest()
    );

    verifyNoInteractions(
            service
    );
}
```

Esse teste prova o comportamento do converter JSON.

---

### 13. Testar media type incorreto

```java
@Test
void shouldReturnUnsupportedMediaTypeWhenContentTypeIsInvalid()
        throws Exception {

    mockMvc.perform(
            post(
                    ENDPOINT
            )
            .contentType(
                    MediaType.TEXT_PLAIN
            )
            .content(
                    "not-json"
            )
    )
    .andExpect(
            status()
                    .isUnsupportedMediaType()
    );

    verifyNoInteractions(
            service
    );
}
```

O mapping declara `application/json`.

---

### 14. Testar body ausente

Execute POST sem `.content(...)`.

Resultado esperado:

```text
400 Bad Request.
```

O service não é chamado.

Esse caso é diferente de JSON vazio:

```text
body ausente;
body presente e inválido.
```

---

### 15. Testar falha do service

Stub:

```java
when(
        service.send(
                any(
                    EmailNotificationCommand.class
                )
        )
).thenThrow(
        new EmailNotificationException(
                "SMTP unavailable"
        )
);
```

Request válida.

Expectativas:

```java
.andExpect(
        status().isServiceUnavailable()
)
.andExpect(
        content()
                .contentTypeCompatibleWith(
                        MediaType.APPLICATION_PROBLEM_JSON
                )
)
.andExpect(
        jsonPath(
                "$.status"
        ).value(
                503
        )
)
.andExpect(
        jsonPath(
                "$.code"
        ).value(
                "email_service_unavailable"
        )
);
```

Não valide a mensagem interna `"SMTP unavailable"`.

Ela não pertence ao contrato público.

---

### 16. Garantir que a exception é tratada pelo advice

O `@WebMvcTest` normalmente inclui `@ControllerAdvice` encontrado no scan da camada web.

Se o package ou a configuração do projeto impedir a descoberta, importe explicitamente:

```java
@Import(
        GlobalExceptionHandler.class
)
```

Não replique a lógica de Problem Details dentro do teste.

O objetivo é usar o advice real.

---

### 17. Criar método auxiliar de sucesso

Quando vários testes precisarem do mesmo stub:

```java
private void stubSuccessfulSubmission() {

    when(
            service.send(
                    any(
                        EmailNotificationCommand.class
                    )
            )
    ).thenReturn(
            new EmailNotificationResult(
                    NOTIFICATION_ID,
                    "SUBMITTED",
                    SUBMITTED_AT
            )
    );
}
```

Não esconda toda a request em helpers genéricos.

O teste precisa continuar mostrando:

- endpoint;
- método;
- content type;
- payload;
- status esperado.

---

### 18. Criar método auxiliar de execução

Um helper pequeno pode receber a request:

```java
private ResultActions performPost(
        SendEmailNotificationRequest request
) throws Exception {

    return mockMvc.perform(
            post(
                    ENDPOINT
            )
            .contentType(
                    MediaType.APPLICATION_JSON
            )
            .content(
                    objectMapper
                            .writeValueAsString(
                                    request
                            )
            )
    );
}
```

Use somente se melhorar leitura.

Não crie uma DSL completa para uma única classe.

---

### 19. Revisar imports estáticos

Imports recomendados:

```java
import static org.assertj.core.api
        .Assertions.assertThat;

import static org.mockito.ArgumentMatchers
        .any;

import static org.mockito.Mockito
        .never;

import static org.mockito.Mockito
        .verify;

import static org.mockito.Mockito
        .verifyNoInteractions;

import static org.mockito.Mockito
        .when;

import static org.springframework.test.web.servlet
        .request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.content;

import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.jsonPath;

import static org.springframework.test.web.servlet
        .result.MockMvcResultMatchers.status;
```

Imports claros deixam o teste legível.

---

### 20. Executar o teste focado

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationControllerTest `
  test
```

A execução não precisa de:

- Docker;
- PostgreSQL;
- Redis;
- Mailpit.

Se algum desses componentes for exigido, o slice está carregando mais contexto do que deveria.

---

### 21. Executar várias vezes

```powershell
1..5 | ForEach-Object {

    .\mvnw.cmd `
      -q `
      -Dtest=EmailNotificationControllerTest `
      test

    if ($LASTEXITCODE -ne 0) {
        throw "Execution $_ failed"
    }
}
```

O resultado precisa ser determinístico.

Não pode depender de ordem dos testes.

---

### 22. Verificar independência

Cada teste precisa preparar seu próprio stub.

Não dependa de:

- teste anterior;
- contador estático;
- estado no filesystem;
- mensagem no Mailpit;
- ordem alfabética;
- UUID gerado em outro teste.

Mockito é reinicializado pelo contexto de teste conforme a infraestrutura.

Mesmo assim, mantenha cada método autocontido.

---

### 23. Revisar o relatório

Após a execução:

```text
target/surefire-reports
```

Procure:

```text
EmailNotificationControllerTest.
```

Confirme:

- quantidade de testes;
- zero failures;
- zero errors;
- tempo de execução.

Não versione o diretório `target`.

---

### 24. Rodar o build relevante

Execute:

```powershell
.\mvnw.cmd test
```

A nova classe não pode quebrar testes anteriores.

Nesta aula, você não precisa iniciar containers apenas para o slice.

Se a suíte completa atual possuir testes de integração que exigem Docker, execute conforme a política já existente do projeto. O teste novo, isoladamente, continua independente.

---

## Entendendo o que foi feito

### O controller foi testado como componente real

Mapping, validation, Jackson e response participaram.

### O service ficou controlado

`@MockitoBean` evitou SMTP e permitiu cenários determinísticos.

### O teste não iniciou servidor

MockMvc usou requests e responses simuladas.

### O JSON foi produzido pelo mapper real

Concatenação manual foi evitada.

### Erros de entrada foram provados

Validation, JSON inválido e media type incorreto retornaram statuses próprios.

### O advice real tratou a exception

Problem Details foi validado na fronteira pública.

### Filters ficaram fora conscientemente

O arquivo possui responsabilidade clara: controller.

---

## Erros comuns importantes

### Usar @SpringBootTest para todo controller

Carrega contexto e dependências desnecessárias.

### Mockar o próprio controller

Você deixaria de testar mapping e serialização.

### Iniciar Mailpit

SMTP não pertence ao teste do controller.

### Usar JSON concatenado

Escape e estrutura ficam frágeis.

### Verificar somente status

Body, content type e interação também fazem parte do contrato.

### Testar somente caminho feliz

Validation e exceptions são parte importante da web.

### Usar any() em todas as verificações

O mapping request para command pode ficar incorreto sem o teste perceber.

### Validar mensagem interna de exception

Isso acopla o teste à implementação.

### Deixar filters interferirem sem intenção

O teste pode falhar por Redis ou properties em vez do controller.

### Colocar lógica de service no mock

Mocks devem devolver resultados controlados, não reimplementar regra.

---

## Comandos úteis

### Executar a classe

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationControllerTest `
  test
```

### Executar um método

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest#shouldReturnAcceptedWhenRequestIsValid" `
  test
```

### Executar testes web

```powershell
.\mvnw.cmd `
  "-Dtest=*ControllerTest" `
  test
```

### Ver relatório

```powershell
Get-ChildItem `
  ".\target\surefire-reports"
```

### Limpar e testar

```powershell
.\mvnw.cmd clean test
```

---

## Exercício guiado

### Parte 1 — Caminho feliz

Implemente o teste de `202`.

Valide três campos da response.

### Parte 2 — Captura do command

Use `ArgumentCaptor`.

Confirme subject e message.

### Parte 3 — Validation

Crie testes separados para:

```text
subject blank;
message blank;
subject 121;
message 2001.
```

### Parte 4 — Boundaries

Confirme:

```text
subject 120:
aceito.

message 2000:
aceita.
```

### Parte 5 — Protocol errors

Teste:

```text
body ausente;
JSON malformado;
text/plain.
```

### Parte 6 — Problem Details

Faça o mock lançar `EmailNotificationException`.

Valide:

```text
503;
application/problem+json;
code.
```

### Parte 7 — Registrar decisão

Anote:

```text
@WebMvcTest;

controller real;

service mockado;

@MockitoBean;

MockMvc;

ObjectMapper;

JsonPath;

filters desabilitados neste slice;

profile mail-lab ativo;

sem servidor;

sem SMTP;

sem banco;

sem Redis;

sem Testcontainers;

testes de service somente na aula 394.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 392 foi preservada;
- `spring-boot-starter-test` foi confirmado;
- versões de teste não foram fixadas manualmente;
- classe `EmailNotificationControllerTest` foi criada;
- `@WebMvcTest` foi usado;
- package atual do Spring Boot 4 foi usado;
- controller específico foi informado;
- `@ActiveProfiles("mail-lab")` foi usado;
- `MockMvc` foi injetado;
- `ObjectMapper` foi injetado;
- `@MockitoBean` foi usado;
- service real não foi criado;
- Mailpit não foi iniciado;
- PostgreSQL não foi iniciado;
- Redis não foi iniciado;
- servidor real não foi iniciado;
- filters foram desabilitados conscientemente;
- caminho feliz retorna 202;
- content type foi validado;
- notificationId foi validado;
- status `SUBMITTED` foi validado;
- submittedAt foi validado;
- valores fixos foram usados;
- command foi capturado;
- subject do command foi validado;
- message do command foi validada;
- subject blank retorna 400;
- message blank retorna 400;
- subject 121 retorna 400;
- message 2001 retorna 400;
- boundary 120 foi considerado;
- boundary 2000 foi considerado;
- service não é chamado em validation error;
- JSON malformado retorna 400;
- body ausente retorna 400;
- media type incorreto retorna 415;
- service não é chamado em protocol error;
- exception do service foi stubada;
- advice real tratou a exception;
- falha retorna 503;
- `application/problem+json` foi validado;
- code público foi validado;
- mensagem interna da exception não foi validada;
- JsonPath foi usado;
- Mockito foi usado para stub e verify;
- `ArgumentCaptor` foi usado;
- nomes de testes expressam comportamento;
- testes não dependem de ordem;
- testes foram executados repetidamente;
- relatório Surefire foi inspecionado;
- target não foi versionado;
- testes de service não foram antecipados;
- testes de integração não foram antecipados;
- Testcontainers não foi antecipado;
- testes de contrato não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 394 está correta.

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
git commit -m "test(m14): testar controller de notificacao com MockMvc"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- relatórios gerados;
- logs;
- dados do Mailpit;
- credentials;
- arquivos temporários;
- screenshots.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você automatizou a fronteira HTTP do controller de notificação.

O fluxo do teste ficou:

```text
JUnit;

@WebMvcTest;

ApplicationContext MVC reduzido;

MockMvc;

request JSON;

Bean Validation;

EmailNotificationController real;

SimpleEmailNotificationService mockado;

response;

JsonPath;

Mockito verify.
```

Você comprovou:

```text
202 no sucesso;

JSON correto;

mapping para command;

400 em validation;

400 em JSON inválido;

415 em media type inválido;

503 em falha do service;

Problem Details;

ausência de chamada indevida ao service.
```

A decisão central foi:

```text
um teste de controller
deve verificar a fronteira HTTP;

o controller permanece real;

os colaboradores ficam controlados;

infraestrutura externa não participa.
```

A próxima aula será:

```text
394 - M14.39 - Testes de service em Spring
```

Nela, o foco muda.

Em vez de testar status e JSON, você testará:

- regras do service;
- colaboração com dependências;
- caminhos de sucesso;
- exceptions;
- efeitos;
- ausência de efeitos indevidos.

Esses testes não foram antecipados aqui.

---

# Material complementar

## Checkpoint final

- [ ] Criei um slice com `@WebMvcTest`.
- [ ] Executei requests com MockMvc.
- [ ] Substituí o service com `@MockitoBean`.
- [ ] Testei sucesso, validation e Problem Details.
- [ ] Executei sem servidor, SMTP, banco ou Redis.

---

## Troubleshooting adicional

### Context failed to load

Confirme:

- profile `mail-lab`;
- service declarado com `@MockitoBean`;
- imports corretos do Spring Boot 4;
- advice e dependências;
- filters desabilitados.

### Controller não foi encontrado

Confirme:

```text
controllers =
EmailNotificationController.class.
```

E o profile ativo.

### JavaMailSender está sendo solicitado

O service real foi criado.

Revise `@MockitoBean` e o tipo exato usado no construtor.

### Redis é solicitado

Algum filter ou configuração foi incluído.

Confirme:

```text
@AutoConfigureMockMvc(addFilters = false).
```

### Response de validation não é problem+json

Confira o `GlobalExceptionHandler` real e a configuração do projeto.

Não invente expectation diferente do contrato existente.

### submittedAt aparece em formato diferente

Verifique o mapper e a configuração de datas.

Use o formato real definido pelo projeto.

### Mock não registra chamada

O controller pode ter parado na validation ou o tipo mockado não é o bean injetado.

### Testes passam isolados e falham juntos

Procure:

- estado estático;
- stubs compartilhados;
- ordem;
- alteração global de locale;
- alteração global de timezone;
- contexto diferente por nomes de mocks.

---

## Observações para aulas futuras

MockMvc também pode testar:

- upload multipart;
- download;
- headers condicionais;
- paginação;
- filters;
- interceptors;
- async MVC;
- streaming.

Esses cenários devem ser adicionados conforme a responsabilidade de cada feature.

A próxima aula tratará services.

Depois virão testes de integração com Testcontainers e testes de contrato.

Não transforme todos os testes em `@WebMvcTest`.

Cada nível responde uma pergunta diferente.

---

## Perguntas de revisão

1. O que MockMvc simula?
2. Ele inicia servidor real?
3. O controller é real?
4. O service é real?
5. Qual annotation cria o slice?
6. Qual annotation cria o mock no contexto?
7. Por que ativar `mail-lab`?
8. Por que desabilitar filters?
9. Para que usar ObjectMapper?
10. Para que usar JsonPath?
11. O que Bean Validation testa?
12. Quando usar `verifyNoInteractions`?
13. Para que serve ArgumentCaptor?
14. Qual status de sucesso?
15. Qual status de validation?
16. Qual status de media type incorreto?
17. Qual status de falha SMTP?
18. Banco participa?
19. Mailpit participa?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Request e response MVC.
2. Não.
3. Sim.
4. Não, é mock.
5. `@WebMvcTest`.
6. `@MockitoBean`.
7. Porque o controller usa esse profile.
8. Para focar o controller.
9. Para gerar JSON correto.
10. Para verificar campos do JSON.
11. Constraints da request.
12. Quando nenhuma chamada é permitida.
13. Inspecionar o argumento enviado.
14. 202.
15. 400.
16. 415.
17. 503.
18. Não.
19. Não.
20. Testes de service em Spring.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 393 - M14.38 - Testes de controller com MockMvc

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei teste de controller de teste de integração.
- Confirmei `spring-boot-starter-test`.
- Criei `EmailNotificationControllerTest`.
- Usei `@WebMvcTest`.
- Usei o package de testes MVC do Spring Boot 4.
- Ativei o profile `mail-lab`.
- Injetei `MockMvc`.
- Injetei o `ObjectMapper`.
- Substituí o service com `@MockitoBean`.
- Mantive o controller real.
- Desabilitei filters neste slice.
- Não iniciei servidor HTTP.
- Não iniciei Mailpit.
- Não iniciei PostgreSQL.
- Não iniciei Redis.
- Testei `202 Accepted`.
- Testei `application/json`.
- Validei `notificationId`.
- Validei `SUBMITTED`.
- Validei `submittedAt`.
- Usei `ArgumentCaptor`.
- Confirmei o mapping para command.
- Testei subject e message vazios.
- Testei limites de 120 e 2.000 caracteres.
- Testei JSON malformado.
- Testei body ausente.
- Testei media type incorreto.
- Confirmei ausência de chamada ao service em erro.
- Fiz o mock lançar `EmailNotificationException`.
- Testei 503 e Problem Details.
- Usei JsonPath.
- Executei o teste repetidamente.
- Não antecipei testes de service, integração ou contrato.
- Próxima aula: Testes de service em Spring.
```

---

## Referência técnica curta

- [Spring Framework — MockMvc](https://docs.spring.io/spring-framework/reference/testing/mockmvc.html)
- [Spring Framework — MockMvc setup](https://docs.spring.io/spring-framework/reference/testing/mockmvc/setup-options.html)
- [Spring Framework — @MockitoBean](https://docs.spring.io/spring-framework/reference/testing/annotations/integration-spring/annotation-mockitobean.html)
- [Spring Boot — Testing Spring Boot Applications](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Spring Boot 4 — WebMvcTest](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/webmvc/test/autoconfigure/WebMvcTest.html)

Regra final:

```text
um teste de controller precisa exercitar mapping, desserialização, validation, status, headers, body e tratamento público de erros sem carregar infraestrutura desnecessária; nesta baseline, @WebMvcTest cria um slice MVC, MockMvc executa requests simuladas, o controller e o advice permanecem reais, @MockitoBean controla o service e ObjectMapper, JsonPath e Mockito comprovam o contrato HTTP sem servidor, banco, Redis ou SMTP.
```
