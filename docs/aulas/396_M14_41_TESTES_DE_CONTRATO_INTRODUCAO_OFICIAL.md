# 396 - M14.41 - Testes de contrato introdução

## Apresentação da aula

Na aula 395, você integrou a aplicação com um PostgreSQL real usando Testcontainers.

O fluxo ficou:

```text
JUnit;

Testcontainers;

PostgreSQLContainer;

@ServiceConnection;

Spring Boot;

Flyway;

JPA;

application service;

repository;

PostgreSQL.
```

Aquela aula respondeu:

```text
Spring, migrations, persistência
e PostgreSQL funcionam juntos?
```

Agora surge outra pergunta.

Imagine que outro sistema consome o endpoint:

```http
POST /api/v2/runtime/notifications/email
```

Esse consumidor espera:

```text
método POST;

path estável;

Content-Type application/json;

campos subject e message;

status 202;

response com notificationId,
status e submittedAt.
```

A API pode continuar compilando e todos os testes internos podem permanecer verdes mesmo depois de uma mudança incompatível.

Exemplos:

```text
trocar o path;

renomear subject para title;

trocar 202 por 200;

remover notificationId;

trocar status SUBMITTED por SENT;

alterar o formato de submittedAt.
```

Para a equipe produtora, algumas dessas mudanças podem parecer refatorações pequenas.

Para o consumidor, elas podem quebrar a integração.

A pergunta central desta aula será:

```text
como transformar uma expectativa
entre produtor e consumidor
em um artefato versionado
e em um teste executável?
```

A solução introdutória utilizará:

```text
contrato HTTP em JSON;

fixture versionada;

provider contract test;

MockMvc;

ObjectMapper;

@MockitoBean;

assertions orientadas ao contrato.
```

O teste verificará o produtor.

Nesta aula:

```text
produtor:
formacao-java-backend-api.

consumidor hipotético:
portal-formacao.

interação:
enviar notificação simples por e-mail.
```

O contrato será armazenado em:

```text
src/test/resources/contracts
```

Ele conterá:

- nome da interação;
- consumidor;
- produtor;
- versão da API;
- request esperada;
- response esperada.

A fixture não será apenas documentação.

O teste irá:

1. ler o contrato;
2. executar a request descrita;
3. comparar a response real;
4. falhar quando o produtor deixar de cumprir o acordo.

A baseline não adicionará um framework completo de Consumer-Driven Contracts.

Não haverá:

- broker de contratos;
- publicação de stubs;
- repositório externo de contratos;
- geração automática de testes;
- Stub Runner;
- Pact Broker;
- pipeline de verificação por consumidor;
- matriz de compatibilidade;
- versionamento semântico automatizado;
- mensagem assíncrona;
- contratos de eventos.

Spring Cloud Contract será apresentado no material complementar como uma evolução possível. A documentação oficial descreve suporte a contratos producer-driven e consumer-driven, geração de testes e stubs. Nesta aula introdutória, o mecanismo será pequeno e explícito para que você compreenda primeiro o problema.

O endpoint utilizado será o da aula 392.

Isso permite reaproveitar:

- controller real;
- Bean Validation;
- Problem Details;
- service mockado;
- MockMvc.

A diferença para a aula 393 está no objetivo.

Aula 393:

```text
testar o comportamento do controller
a partir da visão da equipe produtora.
```

Aula 396:

```text
testar um acordo versionado
a partir da expectativa de uma integração.
```

Um teste de controller pode conter muitos detalhes internos e cenários de implementação.

Um teste de contrato deve permanecer centrado no que atravessa a fronteira:

- método;
- path;
- headers relevantes;
- request;
- status;
- response;
- tipos;
- campos obrigatórios.

A baseline criará dois contratos:

```text
send-email-submitted-v1.json;

send-email-service-unavailable-v1.json.
```

O primeiro representa o sucesso.

O segundo representa a indisponibilidade temporária do serviço de e-mail.

Eles serão validados por:

```text
EmailNotificationProviderContractTest.
```

O teste não inicia:

- servidor HTTP;
- Mailpit;
- PostgreSQL;
- Redis;
- Docker.

O objetivo não é repetir a integração da aula 395.

O objetivo é provar que o produtor continua respeitando o acordo HTTP.

O projeto permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
397 - M14.42 - Observabilidade inicial com Actuator
```

Por isso, esta aula não adicionará endpoints de health, métricas, readiness, liveness ou configuração de Actuator.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
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

397:
Observabilidade inicial com Actuator.

398:
Health readiness liveness.
```

A aula 395 respondeu:

```text
a aplicação conversa corretamente
com infraestrutura real?
```

A aula 396 responderá:

```text
o produtor continua cumprindo
o acordo HTTP esperado
por um consumidor?
```

Nesta aula:

```text
contrato HTTP:
sim.

produtor:
sim.

consumidor:
sim.

fixture versionada:
sim.

provider verification:
sim.

MockMvc:
sim.

JSON:
sim.

sucesso:
sim.

erro 503:
sim.

Spring Cloud Contract:
apenas referência.

stub publicado:
não.

broker:
não.

contrato de mensagem:
não.

OpenAPI diff:
não.

observabilidade:
não.
```

A regra central será:

```text
contrato é um acordo na fronteira;

o teste precisa falhar
quando o produtor rompe esse acordo.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
src/test/resources/contracts
└── email-notification-v2
    ├── send-email-submitted-v1.json
    └── send-email-service-unavailable-v1.json
```

E:

```text
src/test/java/br/com/formacao/backend
└── contract
    └── notification
        ├── HttpContractFixture.java
        └── EmailNotificationProviderContractTest.java
```

O contrato de sucesso descreverá:

```text
consumer:
portal-formacao.

provider:
formacao-java-backend-api.

request:
POST;
path;
application/json;
subject;
message.

response:
202;
application/json;
notificationId;
SUBMITTED;
submittedAt.
```

O contrato de falha descreverá:

```text
request válida;

service indisponível;

response:
503;
application/problem+json;
code email_service_unavailable.
```

Você irá:

1. definir vocabulário de contrato;
2. escolher uma interação;
3. criar uma fixture versionada;
4. criar records de leitura da fixture;
5. carregar o contrato com `ObjectMapper`;
6. executar a request com MockMvc;
7. controlar o service;
8. validar response orientada ao acordo;
9. provocar uma quebra compatível com o laboratório;
10. registrar a decisão;
11. commitar.

Comando principal:

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationProviderContractTest `
  test
```

---

## Conceito essencial

### O que é contrato

Contrato é um acordo observável entre partes.

Em HTTP, ele pode definir:

- método;
- path;
- headers;
- query parameters;
- request body;
- response status;
- response headers;
- response body;
- tipos;
- campos obrigatórios;
- regras de compatibilidade.

O contrato não precisa descrever toda a implementação.

Ele descreve a fronteira necessária para a integração.

---

### Produtor

Produtor é quem oferece a interface.

Nesta aula:

```text
formacao-java-backend-api.
```

O produtor controla:

- controller;
- service;
- response;
- deploy da API.

Ele precisa provar:

```text
minha implementação cumpre o contrato.
```

---

### Consumidor

Consumidor é quem usa a interface.

Nesta aula, o consumidor será hipotético:

```text
portal-formacao.
```

Ele espera enviar uma notificação e interpretar a response.

O consumidor não precisa conhecer:

- JavaMailSender;
- Mailpit;
- package Java;
- nome do service;
- repository;
- logs internos.

Ele conhece o contrato HTTP.

---

### Interação

Contrato não precisa representar a API inteira.

Uma interação é um comportamento específico.

Exemplo:

```text
dado um subject e uma message válidos;

quando o consumidor envia POST;

então o produtor responde 202
com status SUBMITTED.
```

Outro contrato:

```text
dado que o serviço de e-mail está indisponível;

quando a mesma request é enviada;

então o produtor responde 503
com code email_service_unavailable.
```

Contratos pequenos são mais fáceis de revisar e diagnosticar.

---

### Provider-driven e consumer-driven

Provider-driven:

```text
o produtor define
e verifica o contrato.
```

Consumer-driven:

```text
a expectativa nasce
de uma necessidade do consumidor;
o produtor verifica se consegue atendê-la.
```

A baseline mantém os arquivos no repositório do produtor, mas registra explicitamente o consumidor.

Ela é uma introdução à ideia de Consumer-Driven Contracts, não um fluxo distribuído completo.

Ainda não existe:

- submissão automática pelo consumidor;
- aprovação;
- broker;
- publicação;
- verificação por versões.

---

### Contrato não é apenas exemplo

Um exemplo em documentação pode ficar desatualizado.

Um contrato executável participa do build.

Se o produtor mudar:

```text
path;
status;
campo;
tipo;
valor acordado;
```

o teste falha.

Essa falha transforma uma mudança silenciosa em feedback imediato.

---

### Contrato não é teste end-to-end

End-to-end pode envolver:

```text
consumidor real;

rede;

produtor real;

banco;

SMTP;

ambiente completo.
```

Contrato verifica uma fronteira específica.

Na baseline:

```text
controller e MVC:
reais.

service:
controlado.

SMTP:
fora.
```

O contrato não prova entrega de e-mail.

Ele prova a interface HTTP usada para solicitar o envio.

---

### Contrato não substitui teste de controller

O teste de controller da aula 393 verifica vários cenários da camada web.

O contrato verifica expectativas externas selecionadas.

Exemplo:

```text
controller test:
subject blank retorna 400;
body ausente retorna 400;
media type incorreto retorna 415.

contract test:
sucesso esperado pelo portal;
indisponibilidade esperada pelo portal.
```

Pode existir sobreposição.

A diferença está na origem e no propósito do cenário.

---

### Contrato não substitui integração

A aula 395 comprovou:

- datasource;
- migration;
- JPA;
- PostgreSQL;
- transação.

O contrato desta aula não inicia PostgreSQL.

Ele não prova SQL ou commit.

A pirâmide continua:

```text
unitário;

slice;

integração;

contrato;

fluxos amplos.
```

Cada nível reduz um tipo de risco.

---

### Contrato e OpenAPI

OpenAPI descreve a superfície da API.

Ele pode documentar:

- paths;
- schemas;
- statuses;
- exemplos.

Contrato executável descreve uma interação acordada e prova o comportamento do produtor.

Eles se complementam.

OpenAPI pode dizer:

```text
notificationId é string UUID.
```

Um contrato pode dizer:

```text
para esta interação,
o produtor devolve notificationId,
status SUBMITTED e submittedAt.
```

Nesta aula, não será implementada comparação automática entre contrato e OpenAPI.

---

### Compatibilidade

Mudança compatível normalmente preserva consumidores existentes.

Exemplos frequentemente compatíveis:

- adicionar campo opcional na response;
- adicionar endpoint novo;
- aceitar valor adicional sem remover os antigos;
- documentar melhor uma propriedade.

Mudança potencialmente incompatível:

- remover campo;
- renomear campo;
- mudar tipo;
- alterar status;
- tornar campo opcional obrigatório;
- mudar path;
- mudar método;
- trocar formato de data.

A compatibilidade depende do acordo e da tolerância real do consumidor.

Não use uma lista genérica como verdade universal.

---

### Versionamento da fixture

Os arquivos terão:

```text
-v1.
```

Essa versão pertence à definição do contrato, não à versão HTTP da API.

Exemplo:

```text
email-notification-v2:
versão da API.

send-email-submitted-v1:
primeira versão do contrato.
```

Se o acordo mudar de forma intencional:

```text
revisar consumidor;
criar nova versão;
manter ou remover a antiga
conforme política.
```

Não edite silenciosamente a fixture apenas para o teste voltar a passar.

---

### Valores dinâmicos

A response possui:

```text
notificationId;
submittedAt.
```

Em produção, eles são dinâmicos.

No provider test, o service será mockado para devolver valores fixos.

Isso permite comparar a response de forma determinística.

O contrato não afirma que todo ID real será igual ao exemplo.

Ele afirma:

- campo existe;
- formato esperado;
- status é o acordado.

A baseline usa um exemplo fixo porque ainda não implementará matchers genéricos de contrato.

A limitação será registrada.

---

### Fixture em JSON

Exemplo de estrutura:

```json
{
  "name": "send email notification submitted",
  "consumer": "portal-formacao",
  "provider": "formacao-java-backend-api",
  "apiVersion": "v2",
  "request": {
    "method": "POST",
    "path": "/api/v2/runtime/notifications/email",
    "contentType": "application/json",
    "body": {
      "subject": "Contrato HTTP",
      "message": "Mensagem enviada pelo consumidor."
    }
  },
  "response": {
    "status": 202,
    "contentType": "application/json",
    "body": {
      "notificationId": "f13b90d3-80e5-4c31-a334-1e528765bcec",
      "status": "SUBMITTED",
      "submittedAt": "2026-07-11T16:10:00Z"
    }
  }
}
```

A fixture deve ser legível por pessoas e pelo teste.

---

### Metadados do contrato

Campos:

```text
name;
consumer;
provider;
apiVersion.
```

Eles não são enviados na request.

Eles ajudam a responder:

- qual interação;
- quem depende;
- quem fornece;
- qual versão da API.

Um contrato sem dono tende a se tornar arquivo órfão.

---

### Teste do produtor

Provider verification significa:

```text
executar a implementação do produtor
contra o contrato.
```

Nesta aula:

```text
EmailNotificationController:
real.

GlobalExceptionHandler:
real.

MockMvc:
real.

SimpleEmailNotificationService:
mockado para criar o estado esperado.
```

O mock representa o estado necessário da interação.

Ele não redefine o contrato.

---

### State setup

Contratos frequentemente precisam de um estado.

Exemplo:

```text
email service available;

email service unavailable.
```

No teste:

```text
available:
service devolve result.

unavailable:
service lança EmailNotificationException.
```

Em frameworks completos, esses estados podem ser chamados de provider states.

A baseline usa métodos comuns de setup.

---

### Assertions orientadas à fronteira

Valide:

- status;
- content type;
- campos públicos;
- valores acordados.

Não valide:

- nome do método Java;
- quantidade de logs;
- package;
- classe interna;
- stack trace;
- implementação SMTP.

Contrato não deve acoplar consumidor à estrutura interna.

---

### Falha intencional

Para provar valor, faça uma alteração temporária.

Exemplo:

```text
trocar 202 por 200 no controller.
```

Execute o provider test.

Resultado esperado:

```text
falha:
expected 202;
actual 200.
```

Restaure o código.

Outro exercício:

```text
renomear status para state.
```

O contrato deve falhar.

Se não falhar, ele não protege esse aspecto.

---

### Atualização do contrato

Quando uma mudança é intencional, não altere primeiro o teste apenas para obter verde.

Fluxo profissional:

1. identificar consumidores;
2. discutir compatibilidade;
3. criar nova expectativa;
4. preparar consumidor;
5. preparar produtor;
6. manter período de transição;
7. remover contrato antigo quando permitido.

A baseline documentará o processo, sem implementar pipeline multi-repositório.

---

## Mão na massa guiada

### 1. Criar diretório de contratos

No projeto:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "src/test/resources/contracts/email-notification-v2" |
  Out-Null
```

Não coloque o contrato em:

```text
target;
docs apenas;
src/main/resources.
```

Ele é um artefato de teste versionado.

---

### 2. Criar contrato de sucesso

Arquivo:

```text
send-email-submitted-v1.json
```

Conteúdo:

```json
{
  "name": "send email notification submitted",
  "consumer": "portal-formacao",
  "provider": "formacao-java-backend-api",
  "apiVersion": "v2",
  "request": {
    "method": "POST",
    "path": "/api/v2/runtime/notifications/email",
    "contentType": "application/json",
    "body": {
      "subject": "Contrato HTTP",
      "message": "Mensagem enviada pelo consumidor."
    }
  },
  "response": {
    "status": 202,
    "contentType": "application/json",
    "body": {
      "notificationId": "f13b90d3-80e5-4c31-a334-1e528765bcec",
      "status": "SUBMITTED",
      "submittedAt": "2026-07-11T16:10:00Z"
    }
  }
}
```

Mantenha o JSON formatado.

Não inclua credentials ou dados reais.

---

### 3. Criar contrato de indisponibilidade

Arquivo:

```text
send-email-service-unavailable-v1.json
```

Conteúdo:

```json
{
  "name": "send email notification unavailable",
  "consumer": "portal-formacao",
  "provider": "formacao-java-backend-api",
  "apiVersion": "v2",
  "request": {
    "method": "POST",
    "path": "/api/v2/runtime/notifications/email",
    "contentType": "application/json",
    "body": {
      "subject": "Contrato HTTP",
      "message": "Mensagem enviada pelo consumidor."
    }
  },
  "response": {
    "status": 503,
    "contentType": "application/problem+json",
    "body": {
      "code": "email_service_unavailable"
    }
  }
}
```

O contrato de erro não exige stack trace ou detalhe interno.

---

### 4. Criar records da fixture

Arquivo:

```text
HttpContractFixture.java
```

Conteúdo:

```java
package br.com.formacao.backend.contract
        .notification;

import java.util.Map;

public record HttpContractFixture(
        String name,
        String consumer,
        String provider,
        String apiVersion,
        ContractRequest request,
        ContractResponse response
) {

    public record ContractRequest(
            String method,
            String path,
            String contentType,
            Map<String, Object> body
    ) {
    }

    public record ContractResponse(
            int status,
            String contentType,
            Map<String, Object> body
    ) {
    }
}
```

Os records existem somente no test source.

Não leve o formato da fixture para o código de produção.

---

### 5. Criar a classe de provider test

Arquivo:

```text
EmailNotificationProviderContractTest.java
```

Estrutura:

```java
package br.com.formacao.backend.contract
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
class EmailNotificationProviderContractTest {
}
```

O slice é semelhante ao da aula 393.

O propósito do teste é diferente.

---

### 6. Injetar ferramentas e mock

Adicione:

```java
@Autowired
MockMvc mockMvc;

@Autowired
ObjectMapper objectMapper;

@MockitoBean
SimpleEmailNotificationService
        service;
```

Use os imports atuais do projeto Spring Boot 4.

O Mailpit não participa.

---

### 7. Criar loader de contrato

Adicione:

```java
private HttpContractFixture loadContract(
        String filename
) throws IOException {

    ClassPathResource resource =
            new ClassPathResource(
                    "contracts/email-notification-v2/"
                    + filename
            );

    try (
        InputStream input =
                resource.getInputStream()
    ) {
        return objectMapper.readValue(
                input,
                HttpContractFixture.class
        );
    }
}
```

Não use path absoluto da máquina.

A fixture está no classpath de teste.

---

### 8. Validar metadados

Crie um helper:

```java
private void assertContractOwnership(
        HttpContractFixture contract
) {

    assertThat(
        contract.consumer()
    ).isEqualTo(
        "portal-formacao"
    );

    assertThat(
        contract.provider()
    ).isEqualTo(
        "formacao-java-backend-api"
    );

    assertThat(
        contract.apiVersion()
    ).isEqualTo(
        "v2"
    );
}
```

Esses campos evitam fixture sem identidade.

---

### 9. Preparar resultado fixo

Constants:

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

Stub:

```java
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
```

Os valores coincidem com o contrato.

---

### 10. Executar request descrita

Crie um helper:

```java
private ResultActions perform(
        HttpContractFixture contract
) throws Exception {

    assertThat(
        contract.request().method()
    ).isEqualTo(
        "POST"
    );

    return mockMvc.perform(
            post(
                    contract
                            .request()
                            .path()
            )
            .contentType(
                    contract
                            .request()
                            .contentType()
            )
            .content(
                    objectMapper
                            .writeValueAsString(
                                    contract
                                        .request()
                                        .body()
                            )
            )
    );
}
```

A baseline suporta POST porque os contratos desta aula usam POST.

Não crie um engine genérico para todos os verbos.

---

### 11. Criar teste de sucesso

```java
@Test
void shouldFulfillSubmittedEmailContract()
        throws Exception {

    HttpContractFixture contract =
            loadContract(
                    "send-email-submitted-v1.json"
            );

    assertContractOwnership(
            contract
    );

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

    perform(
            contract
    )
    .andExpect(
            status().is(
                    contract
                            .response()
                            .status()
            )
    )
    .andExpect(
            content()
                    .contentTypeCompatibleWith(
                            contract
                                .response()
                                .contentType()
                    )
    )
    .andExpect(
            jsonPath(
                    "$.notificationId"
            ).value(
                    contract
                        .response()
                        .body()
                        .get(
                            "notificationId"
                        )
            )
    )
    .andExpect(
            jsonPath(
                    "$.status"
            ).value(
                    contract
                        .response()
                        .body()
                        .get(
                            "status"
                        )
            )
    )
    .andExpect(
            jsonPath(
                    "$.submittedAt"
            ).value(
                    contract
                        .response()
                        .body()
                        .get(
                            "submittedAt"
                        )
            )
    );
}
```

O contrato fornece as expectations públicas.

---

### 12. Verificar request entregue ao service

Capture:

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
```

Compare com o contrato:

```java
assertThat(
        captor.getValue().subject()
).isEqualTo(
        contract
            .request()
            .body()
            .get(
                "subject"
            )
);

assertThat(
        captor.getValue().message()
).isEqualTo(
        contract
            .request()
            .body()
            .get(
                "message"
            )
);
```

Isso prova que o produtor interpretou a request conforme o acordo.

---

### 13. Criar teste de indisponibilidade

```java
@Test
void shouldFulfillUnavailableEmailContract()
        throws Exception {

    HttpContractFixture contract =
            loadContract(
                    "send-email-service-unavailable-v1.json"
            );

    assertContractOwnership(
            contract
    );

    when(
            service.send(
                    any(
                        EmailNotificationCommand.class
                    )
            )
    ).thenThrow(
            new EmailNotificationException(
                    "Could not submit email notification"
            )
    );

    perform(
            contract
    )
    .andExpect(
            status().is(
                    contract
                        .response()
                        .status()
            )
    )
    .andExpect(
            content()
                    .contentTypeCompatibleWith(
                            contract
                                .response()
                                .contentType()
                    )
    )
    .andExpect(
            jsonPath(
                    "$.code"
            ).value(
                    contract
                        .response()
                        .body()
                        .get(
                            "code"
                        )
            )
    );
}
```

O teste usa o advice real.

---

### 14. Validar estrutura mínima da fixture

Antes de executar, crie:

```java
private void validateFixture(
        HttpContractFixture contract
) {

    assertThat(
        contract.name()
    ).isNotBlank();

    assertThat(
        contract.request()
    ).isNotNull();

    assertThat(
        contract.response()
    ).isNotNull();

    assertThat(
        contract.request().path()
    ).startsWith(
        "/api/v2/"
    );

    assertThat(
        contract.request().contentType()
    ).isEqualTo(
        "application/json"
    );
}
```

Chame em ambos os testes.

Isso não substitui um JSON Schema.

É uma proteção introdutória.

---

### 15. Evitar assertions genéricas demais

Não faça somente:

```java
status().is2xxSuccessful();
```

O contrato exige:

```text
202.
```

Não faça somente:

```java
jsonPath("$").exists();
```

O contrato exige campos específicos.

O teste precisa quebrar quando a fronteira mudar.

---

### 16. Provar quebra por status

Altere temporariamente o controller:

```text
202 -> 200.
```

Execute:

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationProviderContractTest `
  test
```

Resultado esperado:

```text
falha no contrato de sucesso.
```

Restaure `202`.

---

### 17. Provar quebra por campo

Altere temporariamente o response:

```text
status -> state.
```

Execute.

Resultado esperado:

```text
JsonPath $.status não encontrado.
```

Restaure o campo.

---

### 18. Provar quebra por path

Altere temporariamente a fixture para:

```text
/api/v2/runtime/notifications/mail.
```

Execute.

Resultado:

```text
404 em vez de 202.
```

Restaure a fixture.

Esse exercício mostra que o path faz parte do acordo.

---

### 19. Não atualizar contrato automaticamente

Quando o teste falhar, não implemente:

```text
copiar response atual
para a fixture automaticamente.
```

Isso faria o contrato acompanhar qualquer quebra.

A revisão precisa ser humana.

Perguntas:

- a mudança é intencional?
- o consumidor suporta?
- precisa nova versão?
- existe período de transição?
- a API v2 ainda promete o formato anterior?

---

### 20. Executar provider test

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationProviderContractTest `
  test
```

Não é necessário:

- Docker;
- Mailpit;
- PostgreSQL;
- Redis.

---

### 21. Executar junto com controller test

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,EmailNotificationProviderContractTest" `
  test
```

Os dois testes podem executar cenários parecidos.

Isso é aceitável quando protegem intenções diferentes.

Evite duplicar dezenas de cenários sem propósito.

---

### 22. Executar todos os níveis recentes

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,SimpleEmailNotificationServiceTest,ManagedRuntimeMessagePostgreSqlIT,EmailNotificationProviderContractTest" `
  test
```

Docker será necessário por causa da integração da aula 395.

O provider contract test isolado não precisa.

---

### 23. Revisar o diff

Execute:

```powershell
git diff --check
git diff
```

Confirme:

```text
dois contratos;

records em test source;

provider test;

zero alteração no contrato de produção
sem necessidade.
```

---

## Entendendo o que foi feito

### A expectativa virou artefato

O acordo não ficou somente em texto ou memória da equipe.

### O artefato entrou no build

O provider test lê e verifica a fixture.

### Consumidor e produtor ficaram identificados

Cada contrato possui ownership explícito.

### O contrato ficou pequeno

Uma interação de sucesso e uma de indisponibilidade.

### O produtor foi testado na fronteira

Controller, Jackson, validation e advice participaram.

### Infraestrutura externa ficou fora

SMTP e banco não eram necessários para a pergunta desta aula.

### Quebras ficaram visíveis

Status, path e campos incompatíveis produzem teste vermelho.

### A introdução não virou plataforma

Broker, stubs publicados e geração automática ficaram para evolução consciente.

---

## Erros comuns importantes

### Chamar qualquer teste de controller de contrato

Contrato precisa representar um acordo externo identificável.

### Criar contrato sem consumidor

O arquivo perde contexto e ownership.

### Registrar detalhes internos

Package Java e nome de service não pertencem ao consumidor.

### Alterar fixture automaticamente

O teste deixa de proteger compatibilidade.

### Colocar valores reais sensíveis

Fixtures ficam versionadas.

### Criar um engine genérico cedo demais

A aula possui duas interações POST.

Simplicidade é suficiente.

### Usar apenas documentação

Sem execução, o exemplo pode ficar desatualizado.

### Substituir integração por contrato

Contrato não prova PostgreSQL, SMTP ou transação.

### Exigir response inteira byte a byte

Campos adicionais compatíveis poderiam quebrar o teste sem necessidade.

### Ignorar erros públicos

Consumidores também dependem de status e formato de falha.

---

## Comandos úteis

### Executar contratos

```powershell
.\mvnw.cmd `
  -Dtest=EmailNotificationProviderContractTest `
  test
```

### Contrato de sucesso

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationProviderContractTest#shouldFulfillSubmittedEmailContract" `
  test
```

### Controller e contrato

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,EmailNotificationProviderContractTest" `
  test
```

### Listar fixtures

```powershell
Get-ChildItem `
  "src/test/resources/contracts" `
  -Recurse
```

### Validar JSON no PowerShell

```powershell
Get-Content `
  "src/test/resources/contracts/email-notification-v2/send-email-submitted-v1.json" `
  -Raw |
  ConvertFrom-Json |
  Format-List
```

---

## Exercício guiado

### Parte 1 — Contrato de sucesso

Crie a fixture e faça o provider test passar.

### Parte 2 — Contrato de erro

Adicione o cenário 503.

### Parte 3 — Quebra de status

Troque temporariamente 202 por 200.

Confirme falha.

### Parte 4 — Quebra de campo

Renomeie `status`.

Confirme falha.

### Parte 5 — Campo adicional

Adicione um campo opcional à response.

Confirme que o contrato continua verde quando não exige igualdade byte a byte.

### Parte 6 — Ownership

Troque o consumer para blank.

Faça a validação da fixture falhar.

Restaure.

### Parte 7 — Registrar decisão

Anote:

```text
provider:
formacao-java-backend-api;

consumer:
portal-formacao;

interação:
notificação simples v2;

contratos em test resources;

fixture JSON versionada;

provider test com MockMvc;

service controlado;

sucesso 202;

erro 503;

sem broker;

sem stubs publicados;

sem Spring Cloud Contract plugin;

sem contratos de mensagem;

observabilidade somente na aula 397.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 395 foi preservada;
- contrato foi definido como acordo de fronteira;
- produtor foi identificado;
- consumidor foi identificado;
- interação foi identificada;
- diferença entre provider e consumer foi explicada;
- provider-driven foi explicado;
- consumer-driven foi explicado;
- contrato não foi confundido com end-to-end;
- contrato não foi confundido com integração;
- contrato não substituiu controller test;
- relação com OpenAPI foi explicada;
- compatibilidade foi discutida;
- diretório de contratos foi criado;
- contrato de sucesso foi criado;
- contrato de 503 foi criado;
- arquivos possuem versão;
- fixtures estão em test resources;
- dados sensíveis não foram incluídos;
- records de fixture estão em test source;
- metadata name foi criada;
- consumer foi registrado;
- provider foi registrado;
- apiVersion foi registrada;
- request method foi registrada;
- request path foi registrado;
- request content type foi registrado;
- request body foi registrado;
- response status foi registrado;
- response content type foi registrado;
- response body foi registrado;
- provider test foi criado;
- `@WebMvcTest` foi usado;
- profile `mail-lab` foi ativado;
- filters foram desabilitados conscientemente;
- MockMvc foi usado;
- ObjectMapper foi usado;
- service foi substituído por `@MockitoBean`;
- controller real foi usado;
- advice real foi usado;
- contrato foi carregado do classpath;
- path absoluto não foi usado;
- ownership foi validado;
- estrutura mínima foi validada;
- resultado dinâmico foi controlado;
- request do contrato foi executada;
- status 202 foi validado pelo contrato;
- JSON de sucesso foi validado;
- command recebido foi conferido;
- estado unavailable foi preparado;
- status 503 foi validado;
- code público foi validado;
- detalhes internos não foram validados;
- quebra por status foi demonstrada;
- quebra por campo foi demonstrada;
- quebra por path foi demonstrada;
- campo adicional compatível foi discutido;
- atualização automática de fixture não foi criada;
- provider test executa sem Docker;
- provider test executa sem Mailpit;
- provider test executa sem PostgreSQL;
- provider test executa sem Redis;
- Spring Cloud Contract foi citado somente como evolução;
- plugin não foi adicionado;
- broker não foi antecipado;
- stubs publicados não foram antecipados;
- consumer test remoto não foi antecipado;
- contrato de mensagem não foi antecipado;
- observabilidade não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 397 está correta.

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
git commit -m "test(m14): introduzir contratos HTTP do provider"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- reports;
- stubs gerados;
- credentials;
- dados reais;
- logs;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou uma expectativa de integração em contrato executável.

O fluxo ficou:

```text
fixture JSON;

consumer e provider;

request acordada;

provider contract test;

MockMvc;

controller real;

service controlado;

response real;

assertions do contrato.
```

Você comprovou:

```text
path;

método;

content type;

request;

202;

response de sucesso;

503;

Problem Details;

quebra por status;

quebra por campo;

quebra por path.
```

A decisão central foi:

```text
contrato protege a fronteira
que outro sistema utiliza;

ele não descreve
a implementação interna;

o produtor precisa provar
continuamente que ainda
cumpre o acordo.
```

A próxima aula será:

```text
397 - M14.42 - Observabilidade inicial com Actuator
```

Nela, a aplicação começará a expor informações operacionais controladas sobre seu estado.

Você estudará:

- Spring Boot Actuator;
- endpoints operacionais;
- exposição segura;
- informações básicas de health;
- configuração por ambiente.

Health avançado, readiness e liveness terão aprofundamento na aula 398.

Nada disso foi antecipado no código desta aula.

---

# Material complementar

## Checkpoint final

- [ ] Identifiquei produtor e consumidor.
- [ ] Criei contratos JSON versionados.
- [ ] Verifiquei o produtor com MockMvc.
- [ ] Demonstrei uma quebra incompatível.
- [ ] Mantive infraestrutura externa fora.

---

## Troubleshooting adicional

### Fixture não é encontrada

Confirme:

```text
src/test/resources/contracts;
nome exato;
ClassPathResource;
arquivo incluído no test classpath.
```

### ObjectMapper não lê o record

Revise:

- nomes dos campos;
- JSON válido;
- imports do mapper;
- estrutura dos nested records.

### Controller não existe no slice

Confirme:

```text
@ActiveProfiles("mail-lab");
controllers = EmailNotificationController.class.
```

### Advice não trata o 503

Importe o advice real quando o package não for descoberto.

Não replique a resposta no teste.

### Teste passa depois de remover campo

A assertion não protege esse campo.

Revise o JsonPath.

### Campo adicional quebra o teste

Evite comparar a response inteira como string quando o acordo permite extensão.

### Consumer ficou desatualizado

Contrato precisa de owner e processo de revisão.

O teste do produtor sozinho não atualiza o consumidor.

---

## Observações para evolução

Spring Cloud Contract pode fornecer:

- DSL de contratos;
- geração de provider tests;
- geração de stubs;
- Stub Runner;
- contratos HTTP;
- contratos de mensagens;
- workflows producer-driven;
- workflows consumer-driven.

Pact é outra família de ferramentas para Consumer-Driven Contracts.

Uma adoção real precisa decidir:

- onde os contratos vivem;
- quem aprova;
- como versões são publicadas;
- como stubs são distribuídos;
- como o CI verifica compatibilidade;
- como consumidores antigos são preservados.

Essas decisões não foram implementadas na introdução.

O objetivo foi entender a unidade fundamental:

```text
um acordo versionado
que quebra o build
quando a fronteira muda.
```

---

## Perguntas de revisão

1. O que é contrato?
2. Quem é o produtor?
3. Quem é o consumidor?
4. O que é uma interação?
5. Contrato é end-to-end?
6. Contrato substitui integração?
7. Contrato substitui controller test?
8. Onde ficam as fixtures?
9. Por que versionar?
10. O que provider verification faz?
11. Qual endpoint foi protegido?
12. Qual status de sucesso?
13. Qual status de indisponibilidade?
14. Qual code de erro?
15. O Mailpit participa?
16. PostgreSQL participa?
17. O que acontece ao mudar 202 para 200?
18. O contrato deve ser atualizado automaticamente?
19. Qual evolução foi apenas citada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Acordo observável na fronteira.
2. `formacao-java-backend-api`.
3. `portal-formacao`.
4. Um comportamento específico.
5. Não.
6. Não.
7. Não.
8. `src/test/resources/contracts`.
9. Para controlar evolução do acordo.
10. Executa o produtor contra o contrato.
11. POST de notificação por e-mail v2.
12. 202.
13. 503.
14. `email_service_unavailable`.
15. Não.
16. Não.
17. O provider test falha.
18. Não.
19. Spring Cloud Contract.
20. Observabilidade inicial com Actuator.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 396 - M14.41 - Testes de contrato introdução

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei contrato, controller test e integração.
- Defini contrato como acordo observável de fronteira.
- Identifiquei o produtor.
- Identifiquei o consumidor `portal-formacao`.
- Escolhi a interação de notificação por e-mail v2.
- Criei contratos JSON em test resources.
- Versionei as fixtures com `v1`.
- Registrei método, path, content type e request.
- Registrei status, content type e response.
- Criei contrato de sucesso 202.
- Criei contrato de indisponibilidade 503.
- Criei records para ler as fixtures.
- Criei provider contract test.
- Usei MockMvc.
- Mantive controller e advice reais.
- Controlei o service com `@MockitoBean`.
- Carreguei contratos pelo classpath.
- Validei consumer, provider e apiVersion.
- Executei a request descrita no contrato.
- Validei `notificationId`, `SUBMITTED` e `submittedAt`.
- Validei `email_service_unavailable`.
- Capturei o command recebido pelo service.
- Demonstrei quebra por status.
- Demonstrei quebra por campo.
- Demonstrei quebra por path.
- Não atualizei fixtures automaticamente.
- Não usei Docker, Mailpit, PostgreSQL ou Redis.
- Conheci Spring Cloud Contract como evolução.
- Não adicionei broker, plugin ou stubs publicados.
- Não antecipei observabilidade.
- Próxima aula: Observabilidade inicial com Actuator.
```

---

## Referência técnica curta

- [Spring Cloud Contract — Reference](https://docs.spring.io/spring-cloud-contract/reference/index.html)
- [Spring Cloud Contract — Consumer-Driven Contracts](https://docs.spring.io/spring-cloud-contract/reference/getting-started/cdc.html)
- [Spring Cloud Contract — HTTP contracts](https://docs.spring.io/spring-cloud-contract/reference/project-features-contract/http.html)
- [Spring Framework — MockMvc](https://docs.spring.io/spring-framework/reference/testing/mockmvc.html)

Regra final:

```text
um teste de contrato precisa representar uma expectativa externa identificável, registrar consumidor, produtor e interação, versionar o acordo e verificar a implementação do produtor sem acoplar o consumidor a detalhes internos; nesta baseline, fixtures JSON descrevem o POST v2 de notificação, um provider test executa o controller real com MockMvc, controla o estado pelo service mockado e falha quando path, status ou campos públicos deixam de cumprir o acordo.
```
