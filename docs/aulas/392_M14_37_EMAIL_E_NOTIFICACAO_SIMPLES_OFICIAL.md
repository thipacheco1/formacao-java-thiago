# 392 - M14.37 - Email e notificação simples

## Apresentação da aula

Na aula 391, você adicionou tarefas agendadas ao projeto.

A aplicação passou a executar uma limpeza periódica de arquivos:

```text
@EnableScheduling;

@Scheduled;

fixed delay;

initial delay;

ThreadPoolTaskScheduler;

retenção;

batch;

logs;

shutdown controlado.
```

Aquela aula respondeu:

```text
como executar uma tarefa periódica
sem criar thread manual
e sem perder controle
de configuração e ciclo de vida?
```

Agora surge outra necessidade comum em sistemas backend.

Depois de um acontecimento relevante, a aplicação pode precisar comunicar uma pessoa.

Exemplos:

- confirmação de uma solicitação;
- aviso de alteração;
- lembrete;
- resumo operacional;
- notificação de conclusão;
- mensagem de suporte.

Existem vários canais possíveis:

```text
e-mail;

SMS;

push;

WhatsApp;

notificação interna;

webhook.
```

Nesta aula, você implementará somente o canal de e-mail.

A pergunta central será:

```text
como enviar uma notificação simples por e-mail
sem acoplar o caso de uso ao protocolo SMTP,
sem colocar credenciais no código
e sem confundir envio com entrega garantida?
```

A solução utilizará:

```text
spring-boot-starter-mail;

JavaMailSender;

SimpleMailMessage;

SMTP;

Mailpit;

properties tipadas;

profile de laboratório;

timeouts;

logs seguros;

tratamento de falha;

endpoint de demonstração.
```

O fluxo ficará:

```text
request HTTP;

controller v2;

application service de notificação;

JavaMailSender;

SMTP;

Mailpit;

mensagem visível na interface local.
```

O Mailpit será utilizado como servidor SMTP de desenvolvimento.

Ele não enviará a mensagem para uma caixa postal real.

Ele irá:

```text
receber a mensagem;

armazená-la localmente;

exibi-la em uma interface web.
```

Isso evita usar:

- Gmail pessoal;
- senha real;
- conta corporativa;
- destinatário real;
- provedor pago;
- credenciais no repositório.

A baseline utilizará:

```text
SMTP:
localhost:1025.

interface do Mailpit:
http://localhost:8025.
```

O endpoint será disponibilizado somente no profile:

```text
mail-lab.
```

O destinatário não virá da request.

Ele será fixado por configuração:

```text
aluno@formacao.local
```

Essa decisão evita transformar o laboratório em um relay que aceita qualquer destinatário informado pelo cliente.

A request informará apenas:

- assunto;
- mensagem em texto simples.

O remetente também virá da configuração:

```text
no-reply@formacao.local
```

O envio será síncrono.

Isso significa:

```text
a request chama o SMTP
antes de concluir.
```

Se o Mailpit aceitar a mensagem, a API responderá:

```http
202 Accepted
```

O status não significa que uma pessoa leu o e-mail.

Também não garante entrega em uma caixa real.

Ele comunica apenas que a notificação foi submetida ao servidor SMTP configurado.

Se o SMTP estiver indisponível, a API responderá com falha controlada.

Não haverá:

- fila;
- broker;
- outbox;
- retry automático;
- dead letter;
- template HTML;
- anexos;
- imagens inline;
- múltiplos destinatários;
- envio em massa;
- e-mail agendado;
- confirmação de leitura;
- provedor real;
- mensageria;
- testes completos.

Esses assuntos exigem decisões próprias e não serão antecipados.

O projeto permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
393 - M14.38 - Testes de controller com MockMvc
```

Por isso, esta aula terá validação manual. A automação completa do controller será aprofundada na aula seguinte.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
388:
Cache com Spring Redis.

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
```

A aula 391 respondeu:

```text
como executar tarefas
em horários ou intervalos controlados?
```

A aula 392 responderá:

```text
como criar e submeter
uma notificação de texto
para um servidor SMTP?
```

Nesta aula:

```text
JavaMailSender:
sim.

SimpleMailMessage:
sim.

SMTP:
sim.

Mailpit:
sim.

profile local:
sim.

properties:
sim.

timeout:
sim.

texto simples:
sim.

logs:
sim.

tratamento de falha:
sim.

HTML:
não.

anexo:
não.

scheduler de e-mail:
não.

async:
não.

fila:
não.

outbox:
não.

provedor real:
não.

testes completos:
não.
```

A regra central será:

```text
a aplicação solicita o envio;

o servidor SMTP aceita ou rejeita;

aceitação pelo SMTP
não é confirmação de entrega final.
```

---

## Objetivo prático

Ao final da aula, você terá um endpoint:

```http
POST /api/v2/runtime/notifications/email
Content-Type: application/json
```

Request:

```json
{
  "subject": "Formação Java Backend",
  "message": "A aula 392 enviou uma notificação simples."
}
```

Resposta de sucesso:

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
```

Body:

```json
{
  "notificationId": "f13b90d3-80e5-4c31-a334-1e528765bcec",
  "status": "SUBMITTED",
  "submittedAt": "2026-07-11T16:10:00Z"
}
```

A mensagem será visível em:

```text
http://localhost:8025
```

Você irá:

1. iniciar o Mailpit;
2. adicionar o starter de e-mail;
3. configurar SMTP local;
4. configurar remetente e destinatário;
5. criar request e response;
6. criar um serviço de notificação;
7. usar `JavaMailSender`;
8. criar `SimpleMailMessage`;
9. tratar falhas de SMTP;
10. criar o endpoint v2;
11. testar envio e indisponibilidade;
12. commitar.

Estrutura esperada:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── notification
│       ├── EmailNotificationCommand.java
│       ├── EmailNotificationResult.java
│       ├── SimpleEmailNotificationService.java
│       └── exception
│           ├── EmailNotificationDisabledException.java
│           └── EmailNotificationException.java
├── config
│   └── notification
│       └── EmailNotificationProperties.java
└── web
    └── v2
        └── notification
            ├── EmailNotificationController.java
            ├── SendEmailNotificationRequest.java
            └── EmailNotificationResponse.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
└── application-mail-lab.yaml
```

A notificação será:

```text
texto simples;

um remetente configurado;

um destinatário configurado;

um assunto validado;

uma mensagem validada.
```

---

## Conceito essencial

### O que acontece em um envio de e-mail

A aplicação não grava diretamente na caixa do destinatário.

Fluxo simplificado:

```text
aplicação;

servidor SMTP configurado;

outros servidores de e-mail;

caixa do destinatário.
```

Nesta aula:

```text
aplicação;

Mailpit local.
```

O Mailpit encerra o fluxo do laboratório.

Ele recebe e apresenta a mensagem.

Não existe entrega externa.

---

### SMTP

SMTP significa:

```text
Simple Mail Transfer Protocol.
```

Ele é utilizado para submeter e transferir mensagens de e-mail.

A aplicação precisa conhecer:

- host;
- porta;
- autenticação, quando existir;
- TLS, quando existir;
- timeouts;
- remetente;
- conteúdo.

No laboratório:

```text
host:
localhost.

porta:
1025.

autenticação:
não.

TLS:
não.
```

Em produção, esses valores normalmente são diferentes e devem ser fornecidos pelo ambiente.

---

### spring-boot-starter-mail

A dependency será:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

O starter fornece a integração necessária para a auto-configuração de e-mail.

Quando a configuração SMTP está disponível, o Spring Boot cria um `JavaMailSender`.

Você não precisa instanciar manualmente:

```java
new JavaMailSenderImpl();
```

A aplicação injeta a abstração.

---

### JavaMailSender

`JavaMailSender` é a interface usada pelo código da aplicação.

Ela permite enviar:

- mensagens simples;
- mensagens MIME;
- HTML;
- anexos;
- conteúdo multipart.

Nesta aula, você usará apenas:

```text
SimpleMailMessage.
```

O service não conhecerá Mailpit diretamente.

Ele conhecerá:

```text
JavaMailSender.
```

Assim, o servidor SMTP pode mudar por configuração.

---

### SimpleMailMessage

`SimpleMailMessage` representa uma mensagem textual simples.

Campos usados:

```text
from;

to;

subject;

text.
```

Exemplo:

```java
SimpleMailMessage message =
        new SimpleMailMessage();

message.setFrom(
        properties.from()
);

message.setTo(
        properties.recipient()
);

message.setSubject(
        subject
);

message.setText(
        body
);
```

Depois:

```java
mailSender.send(
        message
);
```

Não use `SimpleMailMessage` para anexos ou HTML avançado.

Esses casos utilizam mensagens MIME e exigem outra aula prática.

---

### Notificação e transporte

O caso de uso não deve montar propriedades SMTP.

Errado:

```java
service.setHost("localhost");
service.setPort(1025);
```

O serviço recebe:

```text
JavaMailSender;

EmailNotificationProperties.
```

Separação:

```text
Spring Boot:
configura transporte SMTP.

service:
monta e solicita envio da mensagem.
```

---

### Remetente configurado

O remetente será:

```text
no-reply@formacao.local.
```

Ele não virá da request.

Motivos:

- impedir spoofing;
- manter política central;
- evitar valores inválidos;
- facilitar mudança por ambiente;
- impedir que o endpoint escolha identidade arbitrária.

Em produção, o remetente precisa ser autorizado pelo provedor.

---

### Destinatário configurado

O destinatário será:

```text
aluno@formacao.local.
```

A request não aceitará `to`.

Isso evita criar um endpoint que envia para qualquer endereço.

Em uma aplicação real, o destinatário pode vir:

- do cadastro de usuário;
- de uma regra de negócio;
- de configuração;
- de uma identidade autenticada.

Não deve vir livremente de um endpoint público sem autorização.

---

### Assunto e mensagem

A request aceitará:

```text
subject:
máximo de 120 caracteres.

message:
máximo de 2.000 caracteres.
```

Ambos são obrigatórios.

A baseline também removerá caracteres de controle inadequados do assunto.

Motivo:

```text
o assunto participa de headers de e-mail.
```

O body pode conter quebras de linha normais.

Não aceite texto ilimitado.

---

### Profile mail-lab

A configuração local ficará em:

```text
application-mail-lab.yaml.
```

O profile group local incluirá:

```text
mail-lab.
```

A configuração de envio e o controller serão condicionados a esse profile.

Resultado:

```text
local:
endpoint disponível;
Mailpit usado.

production:
endpoint de laboratório ausente,
salvo decisão futura explícita.
```

Não publique um endpoint de demonstração em produção por acidente.

---

### Mailpit

Mailpit atua como:

```text
servidor SMTP;

caixa de captura;

interface de inspeção.
```

Portas padrão utilizadas:

```text
1025:
SMTP.

8025:
interface HTTP.
```

A imagem será fixada:

```text
axllent/mailpit:v1.30.4
```

Isso evita depender de uma tag móvel durante o laboratório.

O container não precisa acessar um provedor externo.

---

### Credenciais

O Mailpit local não exige usuário e senha na baseline.

Produção pode exigir:

```text
MAIL_USERNAME;

MAIL_PASSWORD.
```

Nunca coloque credenciais reais em:

- Java;
- YAML versionado;
- documentação;
- commit;
- comando compartilhado;
- logs.

Use configuração externa segura, como estudado na aula 383.

---

### TLS

O laboratório local não utiliza TLS entre aplicação e Mailpit.

Isso é aceitável somente porque:

```text
tráfego permanece local;
não existem credenciais;
não há destinatário real.
```

Em produção, o provedor pode exigir:

```text
STARTTLS;
SSL/TLS;
certificados;
porta específica.
```

Não copie a configuração sem TLS do laboratório para ambientes reais.

---

### Timeouts

Uma conexão SMTP não deve bloquear indefinidamente.

A configuração utilizará:

```text
connection timeout:
3 segundos.

read timeout:
5 segundos.

write timeout:
5 segundos.
```

Esses valores são baseline de laboratório.

A aplicação precisa falhar de forma previsível quando o SMTP não responde.

Sem timeouts, uma request pode permanecer presa por muito tempo.

---

### Envio síncrono

O service chamará:

```java
mailSender.send(message);
```

A thread da request espera a operação SMTP terminar.

Vantagem:

```text
sucesso ou falha imediata
para o laboratório.
```

Limite:

```text
latência do SMTP
faz parte da latência HTTP.
```

A aula não adicionará `@Async`.

Uma estratégia assíncrona não resolveria durabilidade por si só e reabriria os limites estudados na aula 387.

---

### Submetido não significa entregue

Quando `send` termina sem exception:

```text
o servidor SMTP aceitou a mensagem.
```

Isso não prova:

- que a caixa existe;
- que outro servidor aceitou;
- que não caiu em spam;
- que o destinatário recebeu;
- que a pessoa abriu;
- que o conteúdo foi lido.

A resposta usará:

```text
SUBMITTED.
```

Não use:

```text
DELIVERED;
READ;
CONFIRMED.
```

---

### Falhas de envio

O Spring traduz falhas de e-mail para exceptions da hierarquia:

```text
MailException.
```

Exemplos:

- servidor indisponível;
- autenticação rejeitada;
- endereço inválido;
- mensagem recusada;
- falha de conexão.

A baseline captura `MailException`, registra uma vez e lança uma exception da aplicação:

```text
EmailNotificationException.
```

O controller não conhece detalhes SMTP.

---

### Status de falha

Quando o servidor SMTP está temporariamente indisponível:

```text
503 Service Unavailable.
```

Código público:

```text
email_service_unavailable.
```

O body não informa:

- host;
- porta;
- usuário;
- senha;
- stack trace;
- resposta completa do servidor.

O log interno pode conter a exception.

---

### Logs seguros

Log de sucesso:

```text
event:
email_notification.submitted.

notificationId;

recipientDomain;

subjectLength;

messageLength;

durationMs.
```

Não registrar:

- body;
- assunto completo;
- e-mail completo do destinatário;
- username;
- password;
- propriedades SMTP.

A baseline pode registrar apenas:

```text
formacao.local
```

como domínio do destinatário.

---

### ID da notificação

A aplicação gerará:

```text
UUID.
```

Esse ID serve para:

- resposta;
- log;
- correlação local.

Ele não é o `Message-ID` do protocolo SMTP.

Ele também não representa uma linha persistida.

Não existe tabela de notificações nesta aula.

---

### Endpoint de demonstração

O endpoint servirá para exercitar o envio.

Ele não será chamado automaticamente por:

- upload;
- scheduler;
- evento interno;
- async;
- alteração de mensagem.

Isso evita acoplar várias aulas em uma única feature.

Depois de dominar o canal, integrações podem ser decididas conscientemente.

---

### Por que não enviar no scheduler agora

A aula anterior criou um job.

Seria possível chamar o e-mail ao final da limpeza.

Isso misturaria:

- scheduling;
- filesystem;
- SMTP;
- notificação;
- falha de entrega.

A baseline mantém responsabilidades independentes.

O scheduler não enviará e-mail nesta aula.

---

### Por que não criar retry agora

Retry exige perguntas:

- quantas tentativas;
- qual intervalo;
- quais errors;
- onde persistir;
- o que acontece em restart;
- como evitar duplicidade;
- como observar esgotamento.

Sem persistência, um retry em memória pode ser perdido.

A aula não improvisará esse comportamento.

---

## Mão na massa guiada

### 1. Iniciar Mailpit

Remova um container anterior:

```powershell
docker rm -f formacao-java-mailpit `
  2>$null
```

Inicie:

```powershell
docker run `
  --name formacao-java-mailpit `
  --detach `
  --publish 1025:1025 `
  --publish 8025:8025 `
  axllent/mailpit:v1.30.4
```

Valide:

```powershell
docker ps `
  --filter "name=formacao-java-mailpit"
```

Abra:

```text
http://localhost:8025
```

A caixa deve estar vazia.

---

### 2. Adicionar dependency

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

Não fixe versão.

O Spring Boot gerencia a linha compatível.

Compile:

```powershell
.\mvnw.cmd clean compile
```

---

### 3. Criar EmailNotificationProperties

Arquivo:

```text
EmailNotificationProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.notification;

import jakarta.validation.constraints.NotBlank;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(
        "app.notification.email"
)
@Validated
public record EmailNotificationProperties(
        boolean enabled,

        @NotBlank
        String from,

        @NotBlank
        String recipient,

        @NotBlank
        String subjectPrefix
) {
}
```

O projeto já utiliza `@ConfigurationPropertiesScan`.

Não registre o mesmo record novamente.

---

### 4. Criar application-mail-lab.yaml

Arquivo:

```text
src/main/resources/application-mail-lab.yaml
```

Conteúdo:

```yaml
spring:
  mail:
    host: "${MAIL_HOST:localhost}"
    port: "${MAIL_PORT:1025}"
    default-encoding: "UTF-8"

    properties:
      "[mail.smtp.auth]": false
      "[mail.smtp.starttls.enable]": false
      "[mail.smtp.connectiontimeout]": 3000
      "[mail.smtp.timeout]": 5000
      "[mail.smtp.writetimeout]": 5000

app:
  notification:
    email:
      enabled: "${EMAIL_NOTIFICATION_ENABLED:true}"
      from: "${EMAIL_FROM:no-reply@formacao.local}"
      recipient: "${EMAIL_RECIPIENT:aluno@formacao.local}"
      subject-prefix: "${EMAIL_SUBJECT_PREFIX:[Formacao Java] }"
```

Não coloque username e password no laboratório.

---

### 5. Incluir o profile local

No group local, adicione:

```yaml
spring:
  profiles:
    group:
      local:
        - persistence-lab
        - openapi-lab
        - lifecycle-local
        - cache-redis
        - mail-lab
```

Preserve os fragments existentes.

O endpoint será anotado com:

```text
@Profile("mail-lab").
```

---

### 6. Criar command e result

Arquivo:

```text
EmailNotificationCommand.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .notification;

public record EmailNotificationCommand(
        String subject,
        String message
) {
}
```

Arquivo:

```text
EmailNotificationResult.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .notification;

import java.time.Instant;
import java.util.UUID;

public record EmailNotificationResult(
        UUID notificationId,
        String status,
        Instant submittedAt
) {
}
```

Os records não dependem da web.

---

### 7. Criar exceptions

Crie:

```text
EmailNotificationDisabledException;
EmailNotificationException.
```

Uso:

```text
disabled:
feature desabilitada.

notification exception:
falha ao submeter para SMTP.
```

Mapeamento público:

```text
EmailNotificationDisabledException:
503;
email_notification_disabled.

EmailNotificationException:
503;
email_service_unavailable.
```

Não exponha a cause.

---

### 8. Criar o service

Arquivo:

```text
SimpleEmailNotificationService.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .notification;

import java.time.Clock;
import java.time.Duration;
import java.util.Locale;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail
        .JavaMailSender;
import org.springframework.stereotype.Service;

import br.com.formacao.backend.config.notification
        .EmailNotificationProperties;

@Service
@Profile(
        "mail-lab"
)
public class SimpleEmailNotificationService {

    private static final Logger log =
            LoggerFactory.getLogger(
                    SimpleEmailNotificationService.class
            );

    private final JavaMailSender
            mailSender;

    private final EmailNotificationProperties
            properties;

    private final Clock clock;

    public SimpleEmailNotificationService(
            JavaMailSender mailSender,
            EmailNotificationProperties
                    properties,
            Clock clock
    ) {
        this.mailSender = mailSender;
        this.properties = properties;
        this.clock = clock;
    }

    public EmailNotificationResult send(
            EmailNotificationCommand command
    ) {

        if (!properties.enabled()) {
            throw new EmailNotificationDisabledException();
        }

        UUID notificationId =
                UUID.randomUUID();

        String subject =
                sanitizeSubject(
                        command.subject()
                );

        long startedAt =
                System.nanoTime();

        SimpleMailMessage mail =
                new SimpleMailMessage();

        mail.setFrom(
                properties.from()
        );

        mail.setTo(
                properties.recipient()
        );

        mail.setSubject(
                properties.subjectPrefix()
                + subject
        );

        mail.setText(
                command.message()
        );

        try {
            mailSender.send(
                    mail
            );
        } catch (
            MailException exception
        ) {
            log.atError()
                    .setCause(
                            exception
                    )
                    .addKeyValue(
                            "event",
                            "email_notification.failed"
                    )
                    .addKeyValue(
                            "notificationId",
                            notificationId
                    )
                    .addKeyValue(
                            "recipientDomain",
                            recipientDomain()
                    )
                    .log(
                            "Email notification submission failed"
                    );

            throw new EmailNotificationException(
                    "Could not submit email notification",
                    exception
            );
        }

        long durationMs =
                Duration
                        .ofNanos(
                                System.nanoTime()
                                - startedAt
                        )
                        .toMillis();

        log.atInfo()
                .addKeyValue(
                        "event",
                        "email_notification.submitted"
                )
                .addKeyValue(
                        "notificationId",
                        notificationId
                )
                .addKeyValue(
                        "recipientDomain",
                        recipientDomain()
                )
                .addKeyValue(
                        "subjectLength",
                        subject.length()
                )
                .addKeyValue(
                        "messageLength",
                        command.message().length()
                )
                .addKeyValue(
                        "durationMs",
                        durationMs
                )
                .log(
                        "Email notification submitted"
                );

        return new EmailNotificationResult(
                notificationId,
                "SUBMITTED",
                clock.instant()
        );
    }

    private String sanitizeSubject(
            String subject
    ) {
        return subject
                .replace(
                        '\r',
                        ' '
                )
                .replace(
                        '\n',
                        ' '
                )
                .replace(
                        '\t',
                        ' '
                )
                .trim();
    }

    private String recipientDomain() {
        String recipient =
                properties.recipient()
                        .toLowerCase(
                                Locale.ROOT
                        );

        int separator =
                recipient.lastIndexOf(
                        '@'
                );

        if (separator < 0
                || separator
                        == recipient.length() - 1) {
            return "invalid";
        }

        return recipient.substring(
                separator + 1
        );
    }
}
```

O service envia texto simples.

Ele não registra assunto ou body.

---

### 9. Validar command no service

A web já aplicará Bean Validation.

Mesmo assim, o service não deve aceitar valores vazios quando chamado por outra entrada.

Adicione uma validação pequena:

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

Chame no início de `send`.

Não coloque validação SMTP dentro do controller.

---

### 10. Criar request

Arquivo:

```text
SendEmailNotificationRequest.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.v2
        .notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendEmailNotificationRequest(
        @NotBlank
        @Size(
            max = 120
        )
        String subject,

        @NotBlank
        @Size(
            max = 2000
        )
        String message
) {
}
```

A request não contém:

- from;
- to;
- cc;
- bcc;
- host;
- porta.

---

### 11. Criar response

Arquivo:

```text
EmailNotificationResponse.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.v2
        .notification;

import java.time.Instant;
import java.util.UUID;

import br.com.formacao.backend.application
        .notification.EmailNotificationResult;

public record EmailNotificationResponse(
        UUID notificationId,
        String status,
        Instant submittedAt
) {

    public static EmailNotificationResponse
            from(
                    EmailNotificationResult
                            result
            ) {
        return new EmailNotificationResponse(
                result.notificationId(),
                result.status(),
                result.submittedAt()
        );
    }
}
```

Não devolva remetente ou destinatário.

---

### 12. Criar controller

Arquivo:

```text
EmailNotificationController.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.v2
        .notification;

import jakarta.validation.Valid;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation
        .PostMapping;
import org.springframework.web.bind.annotation
        .RequestBody;
import org.springframework.web.bind.annotation
        .RequestMapping;
import org.springframework.web.bind.annotation
        .RestController;

import br.com.formacao.backend.application
        .notification.EmailNotificationCommand;
import br.com.formacao.backend.application
        .notification.EmailNotificationResult;
import br.com.formacao.backend.application
        .notification.SimpleEmailNotificationService;

@RestController
@Profile(
        "mail-lab"
)
@RequestMapping(
        path =
                "/api/v2/runtime/notifications/email",
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
public class EmailNotificationController {

    private final SimpleEmailNotificationService
            service;

    public EmailNotificationController(
            SimpleEmailNotificationService service
    ) {
        this.service = service;
    }

    @PostMapping(
        consumes =
                MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<
            EmailNotificationResponse
    > send(
            @Valid
            @RequestBody
            SendEmailNotificationRequest request
    ) {

        EmailNotificationResult result =
                service.send(
                        new EmailNotificationCommand(
                                request.subject(),
                                request.message()
                        )
                );

        return ResponseEntity
                .status(
                        HttpStatus.ACCEPTED
                )
                .body(
                        EmailNotificationResponse
                                .from(
                                        result
                                )
                );
    }
}
```

O endpoint existe apenas em `mail-lab`.

---

### 13. Integrar Problem Details

No `GlobalExceptionHandler`, trate:

```text
EmailNotificationDisabledException;
EmailNotificationException.
```

Resposta de indisponibilidade:

```json
{
  "title": "Service Unavailable",
  "status": 503,
  "detail": "Email notification service is unavailable.",
  "code": "email_service_unavailable"
}
```

Não exponha:

- `localhost`;
- porta 1025;
- nome do container;
- exception SMTP;
- remetente;
- destinatário.

A exception completa fica somente no log interno.

---

### 14. Atualizar OpenAPI

Documente somente a v2.

Operation:

```text
sendSimpleEmailNotification.
```

Request:

```text
subject;
message.
```

Responses:

```text
202:
submetida ao SMTP.

400:
payload inválido.

415:
content type inválido.

503:
serviço de e-mail indisponível.
```

Descrição importante:

```text
202 não confirma entrega final.
```

O contrato não deve prometer `DELIVERED`.

---

### 15. Iniciar a aplicação

Confirme Mailpit:

```powershell
docker exec `
  formacao-java-mailpit `
  /mailpit readyz
```

Caso essa forma não esteja disponível na imagem, valide pelo browser:

```text
http://localhost:8025
```

Inicie:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Confirme que:

```text
mail-lab está ativo;
JavaMailSender foi criado;
controller foi registrado.
```

---

### 16. Enviar uma notificação

PowerShell:

```powershell
$body = @{
  subject =
    "Notificacao simples"

  message =
    "A aula 392 enviou esta mensagem pelo Mailpit."
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/runtime/notifications/email" `
  -ContentType "application/json" `
  -Body $body

$response.StatusCode
$response.Content
```

Resultado esperado:

```text
202;
status SUBMITTED;
notificationId;
submittedAt.
```

---

### 17. Inspecionar no Mailpit

Abra:

```text
http://localhost:8025
```

Confirme:

```text
From:
no-reply@formacao.local.

To:
aluno@formacao.local.

Subject:
[Formacao Java] Notificacao simples.

Body:
texto enviado.
```

A mensagem não saiu para a internet.

---

### 18. Testar caracteres no assunto

Envie:

```json
{
  "subject": "Linha 1\r\nLinha 2",
  "message": "Teste de sanitização do assunto."
}
```

Confirme no Mailpit que o assunto foi normalizado em uma linha.

Bean Validation pode rejeitar ou o service pode sanitizar, conforme o parser JSON e o valor final.

O assunto não deve criar headers adicionais.

---

### 19. Testar validação

Assunto vazio:

```powershell
$invalid = @{
  subject = ""
  message = "Mensagem valida"
} | ConvertTo-Json
```

Envie.

Resultado:

```text
400;
violação em subject.
```

Mensagem acima de 2.000 caracteres:

```text
400.
```

O service não deve ser chamado.

---

### 20. Testar feature desabilitada

Pare a aplicação.

Defina:

```powershell
$env:EMAIL_NOTIFICATION_ENABLED = "false"
```

Inicie novamente com `local`.

O endpoint existe porque o profile está ativo, mas o service rejeita o envio:

```text
503;
email_notification_disabled.
```

Restaure:

```powershell
Remove-Item `
  Env:EMAIL_NOTIFICATION_ENABLED
```

---

### 21. Testar SMTP indisponível

Pare o Mailpit:

```powershell
docker stop formacao-java-mailpit
```

Envie novamente.

Resultado esperado depois do timeout configurado:

```text
503;
email_service_unavailable;
log email_notification.failed.
```

A resposta não deve mostrar:

- connection refused;
- host;
- porta;
- stack trace.

Reinicie:

```powershell
docker start formacao-java-mailpit
```

---

### 22. Testar profile sem mail-lab

Pare a aplicação.

Inicie com um profile que não inclua `mail-lab`, usando configuração válida para os demais componentes do projeto.

Resultado:

```text
controller de demonstração ausente;
endpoint não publicado.
```

A feature local não deve aparecer silenciosamente em production.

---

### 23. Revisar logs

Sucesso:

```text
email_notification.submitted;
notificationId;
recipientDomain;
subjectLength;
messageLength;
durationMs.
```

Falha:

```text
email_notification.failed;
notificationId;
recipientDomain;
Throwable uma vez.
```

Confirme ausência de:

- assunto completo;
- body;
- endereço completo;
- configuração SMTP;
- credentials.

---

### 24. Revisar escopo

Confirme:

```text
texto simples:
sim.

Mailpit:
sim.

SMTP:
sim.

destinatário configurado:
sim.

endpoint local:
sim.

HTML:
não.

anexo:
não.

async:
não.

scheduler:
não.

retry:
não.

outbox:
não.

provedor real:
não.
```

---

## Entendendo o que foi feito

### O protocolo ficou externalizado

O service usa `JavaMailSender`.

Host e porta ficam na configuração.

### O laboratório não usa e-mail real

Mailpit captura as mensagens localmente.

### O endpoint não escolhe destinatário

Remetente e destinatário pertencem à política da aplicação.

### A notificação possui limites

Assunto e mensagem são obrigatórios e possuem tamanho máximo.

### O envio é síncrono e explícito

A request espera a submissão SMTP.

### A resposta não promete entrega

`SUBMITTED` é diferente de `DELIVERED`.

### Falhas não vazam infraestrutura

O cliente recebe um Problem Detail controlado.

### A feature não foi acoplada ao scheduler

Envio manual e scheduling permanecem responsabilidades diferentes.

---

## Erros comuns importantes

### Colocar senha no application.yaml

Credentials precisam vir do ambiente ou secret store.

### Aceitar destinatário arbitrário

Sem autenticação e autorização, isso cria risco de relay e abuso.

### Usar Gmail pessoal no laboratório

Cria dependência externa, credentials e risco de bloqueio.

### Não configurar timeout

Uma request pode ficar presa esperando SMTP.

### Logar body e assunto

Notificações podem conter informação sensível.

### Retornar DELIVERED

O SMTP aceitou, mas a entrega final não foi confirmada.

### Adicionar @Async para “melhorar”

Isso muda a fronteira de falha e não cria entrega durável.

### Criar retry em memória

Restart pode perder tentativas e duplicidades ficam sem controle.

### Enviar no scheduler sem necessidade

Mistura duas responsabilidades e dificulta diagnóstico.

### Publicar endpoint de laboratório em production

O profile precisa controlar a exposição.

---

## Comandos úteis

### Iniciar Mailpit

```powershell
docker start formacao-java-mailpit
```

### Parar Mailpit

```powershell
docker stop formacao-java-mailpit
```

### Abrir interface

```text
http://localhost:8025
```

### Enviar notificação

```powershell
$body = @{
  subject = "Teste"
  message = "Mensagem simples"
} | ConvertTo-Json

Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/runtime/notifications/email" `
  -ContentType "application/json" `
  -Body $body
```

### Inspecionar logs do Mailpit

```powershell
docker logs `
  formacao-java-mailpit
```

### Remover container

```powershell
docker rm -f `
  formacao-java-mailpit
```

---

## Exercício guiado

### Parte 1 — Envio válido

Envie uma mensagem e confirme `202`.

### Parte 2 — Inspeção

Confirme From, To, Subject e Body no Mailpit.

### Parte 3 — Validação

Teste:

```text
assunto vazio;
mensagem vazia;
assunto acima de 120;
mensagem acima de 2.000.
```

### Parte 4 — SMTP indisponível

Pare Mailpit.

Confirme timeout e 503.

### Parte 5 — Feature desabilitada

Defina `enabled=false`.

Confirme rejeição controlada.

### Parte 6 — Profile

Inicie sem `mail-lab`.

Confirme endpoint ausente.

### Parte 7 — Registrar decisão

Anote:

```text
spring-boot-starter-mail;

JavaMailSender;

SimpleMailMessage;

Mailpit v1.30.4;

SMTP local 1025;

UI 8025;

profile mail-lab;

remetente configurado;

destinatário configurado;

request sem recipient;

texto simples;

timeouts;

envio síncrono;

status SUBMITTED;

503 em indisponibilidade;

sem HTML;

sem anexo;

sem async;

sem retry;

sem outbox.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 391 foi preservada;
- starter de mail foi adicionado;
- versão da dependency não foi fixada manualmente;
- Mailpit foi iniciado localmente;
- imagem do Mailpit foi fixada;
- SMTP utiliza porta 1025;
- interface utiliza porta 8025;
- Mailpit não envia para destinatário real;
- properties tipadas foram criadas;
- remetente foi configurado;
- destinatário foi configurado;
- subject prefix foi configurado;
- credentials não foram versionadas;
- TLS local foi diferenciado de produção;
- timeouts foram configurados;
- profile `mail-lab` foi criado;
- local inclui `mail-lab`;
- controller depende do profile;
- service depende do profile;
- `JavaMailSender` foi injetado;
- `SimpleMailMessage` foi usado;
- from foi definido;
- to foi definido por configuração;
- subject foi definido;
- text foi definido;
- request não aceita destinatário;
- request não aceita remetente;
- assunto é obrigatório;
- assunto possui limite;
- mensagem é obrigatória;
- mensagem possui limite;
- assunto é sanitizado;
- command foi separado da web;
- result foi separado da web;
- notificationId foi gerado;
- notificationId não foi chamado de Message-ID;
- status `SUBMITTED` foi usado;
- `DELIVERED` não foi prometido;
- endpoint retorna 202;
- endpoint existe somente na v2;
- OpenAPI foi atualizado;
- 202 foi documentado como submissão;
- `MailException` foi tratada;
- falha SMTP retorna 503;
- detalhes do SMTP não vazam;
- log de sucesso foi criado;
- log de falha foi criado;
- body não foi logado;
- assunto não foi logado;
- endereço completo não foi logado;
- credentials não foram logadas;
- envio válido foi testado manualmente;
- Mailpit foi inspecionado;
- validação foi testada;
- feature desabilitada foi testada;
- SMTP indisponível foi testado;
- profile sem mail-lab foi verificado;
- HTML não foi antecipado;
- anexo não foi antecipado;
- scheduler de e-mail não foi antecipado;
- async não foi antecipado;
- retry não foi antecipado;
- fila não foi antecipada;
- broker não foi antecipado;
- outbox não foi antecipada;
- provedor real não foi antecipado;
- testes completos não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 393 está correta.

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
git commit -m "feat(m14): enviar notificacao simples por email"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- credentials;
- `.env`;
- mensagens exportadas;
- banco do Mailpit;
- logs;
- `target`;
- dados reais;
- screenshots;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API passou a submeter uma notificação simples por SMTP.

O fluxo ficou:

```text
POST v2;

validação;

command;

SimpleEmailNotificationService;

SimpleMailMessage;

JavaMailSender;

Mailpit;

202 SUBMITTED.
```

Você comprovou:

```text
SMTP local;

profile controlado;

remetente configurado;

destinatário configurado;

texto simples;

timeout;

sucesso;

falha;

logs seguros;

ausência do endpoint fora do laboratório.
```

A decisão central foi:

```text
o caso de uso solicita o envio
por uma abstração;

o ambiente fornece o transporte;

a aceitação pelo SMTP
não é entrega garantida;

falhas precisam ser controladas
sem expor credentials ou infraestrutura.
```

A próxima aula será:

```text
393 - M14.38 - Testes de controller com MockMvc
```

Nela, você automatizará o comportamento da camada HTTP sem iniciar um servidor real.

A aula poderá validar controllers, requests, status, headers, bodies e Problem Details.

Esses testes completos não foram antecipados aqui.

---

# Material complementar

## Checkpoint final

- [ ] Iniciei Mailpit.
- [ ] Configurei `JavaMailSender`.
- [ ] Enviei uma `SimpleMailMessage`.
- [ ] Inspecionei a mensagem na UI.
- [ ] Testei validação e indisponibilidade.

---

## Troubleshooting adicional

### JavaMailSender não foi criado

Confirme:

- starter de mail;
- profile `mail-lab`;
- `spring.mail.host`;
- configuração YAML válida.

### Connection refused

Confirme:

```text
container ativo;
porta 1025 publicada;
host localhost;
firewall local.
```

### A mensagem não aparece

Veja:

- logs da aplicação;
- logs do Mailpit;
- porta SMTP;
- UI em 8025;
- response 202.

### O endpoint retorna 404

O profile `mail-lab` pode não estar ativo.

### O endpoint retorna 503 com Mailpit ativo

Revise:

- timeouts;
- host;
- porta;
- configuração de auth;
- STARTTLS desabilitado no laboratório.

### O assunto aparece com prefixo duplicado

A request não deve enviar o prefixo da aplicação.

O service adiciona uma vez.

### A aplicação demora ao falhar

Confirme as properties:

```text
mail.smtp.connectiontimeout;
mail.smtp.timeout;
mail.smtp.writetimeout.
```

---

## Observações para aulas futuras

E-mail profissional pode exigir:

- HTML;
- templates;
- internacionalização;
- anexos;
- imagens inline;
- provider externo;
- DNS;
- SPF;
- DKIM;
- DMARC;
- bounce;
- complaint;
- unsubscribe;
- retry;
- outbox;
- idempotência;
- métricas;
- fila.

Esses assuntos não foram implementados agora.

Testes automatizados do controller começam na próxima aula.

Testes de service, integração e contrato continuarão nas aulas seguintes do cronograma.

---

## Perguntas de revisão

1. Qual abstraction envia e-mail?
2. Qual classe representa texto simples?
3. Qual starter foi adicionado?
4. Qual servidor SMTP é usado?
5. Qual porta SMTP?
6. Qual porta da interface?
7. O Mailpit envia para a internet?
8. De onde vem o remetente?
9. De onde vem o destinatário?
10. A request aceita recipient?
11. Por que usar profile?
12. Quais timeouts foram configurados?
13. O envio é síncrono?
14. 202 significa entregue?
15. Qual status interno foi usado?
16. Qual exception base é tratada?
17. Qual status em falha SMTP?
18. O body é logado?
19. Existe retry?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `JavaMailSender`.
2. `SimpleMailMessage`.
3. `spring-boot-starter-mail`.
4. Mailpit.
5. 1025.
6. 8025.
7. Não.
8. Da configuração.
9. Da configuração.
10. Não.
11. Para limitar a feature ao laboratório.
12. Conexão, leitura e escrita.
13. Sim.
14. Não.
15. `SUBMITTED`.
16. `MailException`.
17. 503.
18. Não.
19. Não.
20. Testes de controller com MockMvc.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 392 - M14.37 - Email e notificação simples

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei submissão SMTP de entrega final.
- Adicionei `spring-boot-starter-mail`.
- Usei `JavaMailSender`.
- Usei `SimpleMailMessage`.
- Iniciei Mailpit local.
- Fixei a imagem `axllent/mailpit:v1.30.4`.
- Usei SMTP na porta 1025.
- Usei a interface na porta 8025.
- Criei o profile `mail-lab`.
- Mantive o endpoint fora de production.
- Configurei remetente.
- Configurei destinatário fixo.
- Não aceitei destinatário pela request.
- Configurei prefixo de assunto.
- Configurei encoding UTF-8.
- Configurei timeouts de conexão, leitura e escrita.
- Não versioneI credentials.
- Criei command e result da aplicação.
- Criei request e response da web.
- Validei assunto e mensagem.
- Sanitizei o assunto.
- Gerei `notificationId`.
- Retornei `202 Accepted`.
- Usei status `SUBMITTED`.
- Não prometi `DELIVERED`.
- Tratei `MailException`.
- Retornei 503 quando SMTP ficou indisponível.
- Mantive detalhes SMTP fora da resposta.
- Registrei logs sem assunto, body ou endereço completo.
- Testei envio no Mailpit.
- Testei validação.
- Testei feature desabilitada.
- Testei SMTP indisponível.
- Não antecipei HTML, anexo, async, retry, fila ou outbox.
- Próxima aula: Testes de controller com MockMvc.
```

---

## Referência técnica curta

- [Spring Boot — Sending Email](https://docs.spring.io/spring-boot/reference/io/email.html)
- [Spring Framework — Email](https://docs.spring.io/spring-framework/reference/integration/email.html)
- [Spring Framework — JavaMailSender](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/mail/javamail/JavaMailSender.html)
- [Mailpit — Documentation](https://mailpit.axllent.org/docs/)
- [Mailpit — Docker](https://mailpit.axllent.org/docs/install/docker/)

Regra final:

```text
uma notificação simples por e-mail precisa separar conteúdo e transporte, externalizar host, porta, remetente, destinatário e credentials, aplicar timeouts, limitar os dados aceitos, registrar falhas sem vazar mensagem ou infraestrutura e declarar que a aceitação pelo SMTP não confirma entrega final; nesta baseline, um endpoint v2 disponível somente em mail-lab cria uma SimpleMailMessage, usa JavaMailSender para submetê-la ao Mailpit e responde SUBMITTED quando o servidor local aceita a mensagem.
```
