# 546 - M17.41 - Projeto API pronta para deploy parte 1

## Apresentação da aula

Na aula 545, você executou um deploy controlado em um ambiente Kubernetes simples.

O procedimento passou a possuir:

```text
release candidate;

change record;

preflight;

manifests;

ConfigMap;

Secret efêmero;

rollout;

smoke test;

observabilidade;

rollback;

evidence.
```

Esse exercício comprovou que deploy não é apenas:

```text
kubectl apply.
```

Um deploy confiável depende de uma aplicação preparada para:

- receber configuração externa;
- iniciar de forma previsível;
- informar sua versão;
- responder health checks;
- encerrar graciosamente;
- emitir logs estruturados;
- preservar correlation ID;
- limitar recursos;
- executar sem privilégios;
- falhar rapidamente quando a configuração é inválida;
- ser testada fora da máquina do desenvolvedor;
- ser empacotada de forma imutável;
- oferecer evidências para operação.

Agora você irá iniciar um projeto prático guiado em duas partes.

O objetivo do projeto é transformar a `orders-api` construída ao longo da formação em uma API pronta para deploy.

A pergunta central desta primeira parte será:

```text
quais contratos
a aplicação precisa cumprir

antes de receber
pipeline,
imagem,
manifests
e promoção?
```

Nesta aula, você irá consolidar a camada interna de deployability.

A aplicação passará a possuir:

```text
contrato de configuração;

profiles claros;

validação de startup;

build metadata;

release metadata;

health groups;

graceful shutdown;

logging estruturado;

correlation ID;

tratamento de erros;

limites operacionais;

testes de readiness;

documentação de execução.
```

A regra central será:

```text
uma API pronta para deploy
não depende
de conhecimento implícito
da máquina do desenvolvedor.
```

Esta aula não executará o projeto completo.

Ela não irá:

- criar pipeline remoto definitivo;
- publicar imagem em registry;
- assinar imagem real;
- criar SBOM real de release;
- criar cluster cloud;
- promover para produção;
- criar DNS;
- criar certificado;
- configurar secrets reais;
- concluir os manifests finais;
- executar a validação final do projeto.

Essas etapas pertencem à continuação oficial:

```text
547 - M17.42 - Projeto API pronta para deploy parte 2
```

A parte 1 termina quando a aplicação estiver pronta para empacotamento. A parte 2 concluirá imagem, manifests, pipeline, release, deploy, rollback e evidence.

---

## Onde estamos na formação

A sequência oficial é:

```text
544:
Observacoes de seguranca cloud.

545:
Deploy em ambiente simples.

546:
Projeto API pronta para deploy parte 1.

547:
Projeto API pronta para deploy parte 2.

548:
Checkpoint DevOps Cloud.
```

A aula 545 respondeu:

```text
como executar
um deploy simples

com validação
e rollback?
```

A aula 546 responderá:

```text
como preparar
a própria aplicação

para ser
implantável,
configurável,
observável
e verificável?
```

Nesta aula:

```text
deployability contract:
sim.

profiles:
sim.

configuration validation:
sim.

build metadata:
sim.

release metadata:
sim.

health groups:
sim.

graceful shutdown:
sim.

correlation ID:
sim.

structured logging:
sim.

Problem Details:
sim.

startup validation:
sim.

container readiness:
sim.

Kubernetes readiness:
sim.

integration tests:
sim.

pipeline final:
não.

registry:
não.

deploy final:
não.
```

A regra operacional será:

```text
definir;

implementar;

validar;

testar;

documentar;

preparar
para empacotamento.
```

---

## Objetivo prático

O projeto continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
deploy-ready
├── deployability-contract.yaml
├── runtime-configuration-contract.yaml
├── release-information-contract.yaml
├── health-readiness-contract.yaml
├── logging-contract.yaml
├── graceful-shutdown-contract.yaml
├── operational-limits.yaml
├── deploy-ready-readiness.yaml
└── part-1-acceptance-evidence.yaml

src/main/java/com/formacao/orders/operational
├── BuildInformation.java
├── BuildInformationProperties.java
├── RuntimeEnvironmentProperties.java
├── StartupConfigurationValidator.java
├── ReleaseInformation.java
├── ReleaseInformationController.java
├── CorrelationIdFilter.java
├── CorrelationIdContext.java
└── OperationalProblemHandler.java

src/main/resources
├── application.yml
├── application-local.yml
├── application-test.yml
├── application-container.yml
├── application-kubernetes.yml
└── logback-spring.xml

src/test/java/com/formacao/orders/operational
├── StartupConfigurationValidatorTest.java
├── ReleaseInformationControllerTest.java
├── CorrelationIdFilterTest.java
├── HealthEndpointContractTest.java
└── DeployabilityArchitectureTest.java

scripts/project/deploy-ready
├── validate-deployability-contract.ps1
├── validate-runtime-configuration.ps1
├── validate-build-information.ps1
├── validate-health-contract.ps1
├── validate-logging-contract.ps1
├── validate-graceful-shutdown.ps1
├── test-container-startup.ps1
├── test-invalid-configuration.ps1
├── test-operational-endpoints.ps1
├── collect-part-1-evidence.ps1
└── verify-part-1-baseline.ps1

docs/project/deploy-ready
├── PROJECT_DEPLOYABILITY_SCOPE.md
├── RUNTIME_CONFIGURATION.md
├── BUILD_AND_RELEASE_INFORMATION.md
├── HEALTH_AND_READINESS.md
├── LOGGING_AND_CORRELATION.md
├── GRACEFUL_SHUTDOWN.md
├── OPERATIONAL_LIMITS.md
├── PART_1_TEST_MATRIX.md
└── PART_1_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
aplicação sem configuração implícita;

profiles separados;

startup validado;

versão observável;

release rastreável;

health checks consistentes;

shutdown gracioso;

logs estruturados;

correlation ID;

erros padronizados;

testes operacionais;

evidência da parte 1.
```

Você irá:

1. confirmar a baseline;
2. criar o contrato de deployability;
3. inventariar configuração;
4. separar configuração e Secret;
5. criar profiles;
6. criar properties tipadas;
7. validar startup;
8. criar build information;
9. criar release information;
10. expor endpoint operacional;
11. configurar Actuator;
12. definir health groups;
13. configurar graceful shutdown;
14. criar correlation ID;
15. estruturar logs;
16. padronizar erros;
17. definir limites;
18. criar testes de arquitetura;
19. criar testes de startup;
20. testar configuração inválida;
21. testar container;
22. validar endpoints;
23. criar documentação;
24. coletar evidence;
25. executar gate;
26. commitar;
27. preparar a parte 2.

---

## Conceito essencial

### Deployability

Capacidade de uma aplicação ser empacotada, configurada, implantada, validada e revertida de forma previsível.

---

### Runtime configuration

Configuração recebida no momento da execução.

---

### Build information

Informação gerada durante o build.

Exemplos:

- nome;
- versão;
- commit;
- data;
- artifact.

---

### Release information

Informação que identifica uma versão implantada em determinado ambiente.

---

### Health endpoint

Endpoint que informa estado operacional.

---

### Liveness

Indica se o processo precisa ser reiniciado.

---

### Readiness

Indica se a instância pode receber tráfego.

---

### Startup validation

Validação executada antes de a aplicação se declarar pronta.

---

### Graceful shutdown

Encerramento que deixa de aceitar novo trabalho e permite concluir operações em andamento dentro de um prazo.

---

### Correlation ID

Identificador usado para relacionar logs e chamadas do mesmo fluxo.

---

### Structured logging

Logs produzidos com campos previsíveis e pesquisáveis.

---

### Operational contract

Conjunto explícito de requisitos que a aplicação oferece à plataforma e à operação.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

Depois:

```powershell
git status

git diff --check
```

Quando o cluster estiver disponível:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- testes aprovados;
- aplicação compila;
- nenhum Secret real;
- nenhuma alteração inesperada;
- ambiente anterior saudável;
- dependências externas conhecidas.

---

### 2. Criar o contrato de deployability

Arquivo:

```text
deploy-ready/deployability-contract.yaml
```

Conteúdo:

```yaml
deployability:
  configuration:
    external:
      required

    typed:
      required

    startupValidation:
      required

  artifact:
    immutable:
      required

    versioned:
      required

  observability:
    buildInformation:
      required

    releaseInformation:
      required

    health:
      required

    structuredLogs:
      required

    correlationId:
      required

  runtime:
    gracefulShutdown:
      required

    nonRoot:
      required

    resources:
      explicit:
        required

  security:
    secretsInRepository:
      forbidden

  evidence:
    required
```

---

### 3. Inventariar configuração

Arquivo:

```text
runtime-configuration-contract.yaml
```

Classifique cada propriedade.

Exemplo:

```yaml
configuration:
  server:
    port:
      source:
        environment-or-profile

      secret:
        false

  database:
    jdbcUrl:
      source:
        environment

      secret:
        false

    username:
      source:
        secret-store

      secret:
        true

    password:
      source:
        secret-store

      secret:
        true

  messaging:
    enabled:
      source:
        environment

      secret:
        false

  cache:
    enabled:
      source:
        environment

      secret:
        false

  objectStorage:
    enabled:
      source:
        environment

      secret:
        false
```

---

### 4. Separar configuração de Secret

Configuração não sensível:

- porta;
- profile;
- timeout;
- feature flag;
- quantidade;
- limite;
- log level;
- endpoint público não confidencial.

Secret:

- senha;
- token;
- private key;
- access key;
- client secret;
- credential de banco;
- signing key.

A regra será:

```text
application.yml:
defaults seguros.

profile:
diferença por ambiente.

environment:
valor variável.

secret store:
credencial.
```

---

### 5. Criar `application.yml`

Use uma baseline explícita:

```yaml
spring:
  application:
    name: orders-api

  lifecycle:
    timeout-per-shutdown-phase: 30s

server:
  shutdown: graceful

management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
          - metrics
          - prometheus

  endpoint:
    health:
      probes:
        enabled: true

      show-details: never

  health:
    livenessstate:
      enabled: true

    readinessstate:
      enabled: true

app:
  runtime:
    environment: ${APP_ENVIRONMENT:local}
    release-id: ${APP_RELEASE_ID:local-development}

  features:
    aws-messaging-enabled: ${AWS_MESSAGING_ENABLED:false}
    aws-cache-enabled: ${AWS_CACHE_ENABLED:false}
    aws-s3-enabled: ${AWS_S3_ENABLED:false}
```

---

### 6. Criar profile local

Arquivo:

```text
application-local.yml
```

Conteúdo conceitual:

```yaml
app:
  runtime:
    environment: local

logging:
  level:
    root: INFO
    com.formacao.orders: DEBUG
```

---

### 7. Criar profile de testes

Arquivo:

```text
application-test.yml
```

Regras:

- nenhuma chamada externa;
- adapters em memória;
- clock controlável;
- IDs previsíveis;
- integração cloud desabilitada;
- logs reduzidos;
- migrations controladas;
- banco de teste explícito.

Evite profile de teste que silencie todos os contratos operacionais.

Health, configuração e build information ainda precisam ser testáveis.

---

### 8. Criar profile de container

Arquivo:

```text
application-container.yml
```

Conteúdo:

```yaml
app:
  runtime:
    environment: container

server:
  port: ${SERVER_PORT:8080}

logging:
  level:
    root: ${LOGGING_LEVEL_ROOT:INFO}
```

O container não assume `localhost` para dependências externas.

---

### 9. Criar profile Kubernetes

Arquivo:

```text
application-kubernetes.yml
```

Conteúdo:

```yaml
app:
  runtime:
    environment: ${APP_ENVIRONMENT:kubernetes}
    release-id: ${APP_RELEASE_ID}

management:
  endpoint:
    health:
      probes:
        enabled: true

logging:
  level:
    root: ${LOGGING_LEVEL_ROOT:INFO}
```

`APP_RELEASE_ID` será obrigatório nesse profile.

---

### 10. Criar properties tipadas

Arquivo:

```text
RuntimeEnvironmentProperties.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.runtime")
public record RuntimeEnvironmentProperties(
        @NotBlank String environment,
        @NotBlank String releaseId
) {
}
```

Registre a classe com:

```java
@ConfigurationPropertiesScan
```

na aplicação principal ou configuração equivalente.

---

### 11. Criar build information

Arquivo:

```text
BuildInformation.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

import java.time.Instant;

public record BuildInformation(
        String artifact,
        String version,
        String commit,
        Instant buildTime
) {
}
```

---

### 12. Criar properties de build

Arquivo:

```text
BuildInformationProperties.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.build")
public record BuildInformationProperties(
        String artifact,
        String version,
        String commit,
        String time
) {
}
```

Defaults locais podem usar:

```text
unknown
```

somente no profile local.

Em release, `unknown` bloqueia promoção.

---

### 13. Gerar build metadata no Maven

Configure o build para gerar:

- versão do projeto;
- commit abreviado;
- timestamp;
- artifact name.

Use recursos compatíveis com o projeto atual.

O contrato não exige plugin específico.

Ele exige saída verificável.

Exemplo de propriedades:

```properties
app.build.artifact=@project.artifactId@
app.build.version=@project.version@
app.build.commit=${git.commit.id.abbrev}
app.build.time=${maven.build.timestamp}
```

Quando o plugin de Git não estiver disponível, o pipeline deverá fornecer o commit na parte 2.

---

### 14. Criar release information

Arquivo:

```text
ReleaseInformation.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

public record ReleaseInformation(
        String application,
        String environment,
        String releaseId,
        String artifact,
        String version,
        String commit,
        String buildTime
) {
}
```

---

### 15. Criar endpoint de release

Arquivo:

```text
ReleaseInformationController.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public final class ReleaseInformationController {

    private final RuntimeEnvironmentProperties runtime;
    private final BuildInformationProperties build;

    public ReleaseInformationController(
            RuntimeEnvironmentProperties runtime,
            BuildInformationProperties build
    ) {
        this.runtime = runtime;
        this.build = build;
    }

    @GetMapping("/internal/release")
    public ResponseEntity<ReleaseInformation> release() {
        return ResponseEntity.ok(
                new ReleaseInformation(
                        "orders-api",
                        runtime.environment(),
                        runtime.releaseId(),
                        build.artifact(),
                        build.version(),
                        build.commit(),
                        build.time()
                )
        );
    }
}
```

---

### 16. Criar contrato de release information

Arquivo:

```text
release-information-contract.yaml
```

Conteúdo:

```yaml
releaseInformation:
  endpoint:
    path:
      /internal/release

  fields:
    required:
      - application
      - environment
      - releaseId
      - artifact
      - version
      - commit
      - buildTime

  forbidden:
    - secrets
    - databaseCredentials
    - cloudCredentials
    - environmentDump

  production:
    unknownValue:
      forbidden
```

---

### 17. Validar configuração no startup

Arquivo:

```text
StartupConfigurationValidator.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

import java.util.Set;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public final class StartupConfigurationValidator
        implements ApplicationRunner {

    private static final Set<String> DEPLOY_PROFILES =
            Set.of("container", "kubernetes");

    private final RuntimeEnvironmentProperties runtime;
    private final BuildInformationProperties build;
    private final Environment environment;

    public StartupConfigurationValidator(
            RuntimeEnvironmentProperties runtime,
            BuildInformationProperties build,
            Environment environment
    ) {
        this.runtime = runtime;
        this.build = build;
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        Set<String> activeProfiles =
                Set.of(environment.getActiveProfiles());

        boolean deployProfile = activeProfiles.stream()
                .anyMatch(DEPLOY_PROFILES::contains);

        if (!deployProfile) {
            return;
        }

        requireResolved(
                runtime.releaseId(),
                "app.runtime.release-id"
        );

        requireResolved(
                build.version(),
                "app.build.version"
        );

        requireResolved(
                build.commit(),
                "app.build.commit"
        );
    }

    private void requireResolved(
            String value,
            String field
    ) {
        if (value == null
                || value.isBlank()
                || value.equalsIgnoreCase("unknown")) {
            throw new IllegalStateException(
                    field + " must be resolved"
            );
        }
    }
}
```

---

### 18. Criar health groups

Arquivo:

```text
health-readiness-contract.yaml
```

Conteúdo:

```yaml
health:
  liveness:
    checks:
      - application-process

    externalDependencies:
      forbidden

  readiness:
    checks:
      - application-readiness
      - required-runtime-configuration

    optionalDependencies:
      excluded

  details:
    public:
      hidden

  probes:
    startup:
      required

    readiness:
      required

    liveness:
      required
```

---

### 19. Separar liveness e readiness

Liveness responde:

```text
o processo precisa
ser reiniciado?
```

Readiness responde:

```text
o processo pode
receber tráfego?
```

Não inclua banco, cache ou mensageria indiscriminadamente na liveness.

Uma falha externa não deve provocar restart loop.

Readiness pode refletir dependências obrigatórias, mas precisa evitar flapping.

---

### 20. Configurar health groups

Exemplo:

```yaml
management:
  endpoint:
    health:
      group:
        liveness:
          include:
            - livenessState

        readiness:
          include:
            - readinessState
```

Se houver um indicador de configuração obrigatória, inclua-o na readiness.

Não exponha detalhes internos publicamente.

---

### 21. Graceful shutdown

Arquivo:

```text
graceful-shutdown-contract.yaml
```

Conteúdo:

```yaml
shutdown:
  graceful:
    required

  timeoutSeconds:
    application:
      30

  kubernetes:
    terminationGracePeriodSeconds:
      greaterThanApplicationTimeout:
        required

  newTraffic:
    stopBeforeTermination:
      required

  inFlightRequests:
    completeWithinTimeout:
      required

  messageConsumers:
    stopPolling:
      required
```

O prazo do Kubernetes precisa ser maior que o prazo da aplicação.

---

### 22. Configurar graceful shutdown

No Spring Boot:

```yaml
server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
```

No Deployment da parte 2:

```yaml
terminationGracePeriodSeconds: 40
```

A diferença oferece margem.

A parte 1 valida apenas o comportamento da aplicação.

---

### 23. Criar correlation context

Arquivo:

```text
CorrelationIdContext.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

public final class CorrelationIdContext {

    public static final String HEADER =
            "X-Correlation-Id";

    public static final String MDC_KEY =
            "correlationId";

    private CorrelationIdContext() {
    }
}
```

---

### 24. Criar filtro de correlation ID

Arquivo:

```text
CorrelationIdFilter.java
```

Conteúdo:

```java
package com.formacao.orders.operational;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public final class CorrelationIdFilter
        extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String correlationId =
                resolveCorrelationId(request);

        MDC.put(
                CorrelationIdContext.MDC_KEY,
                correlationId
        );

        response.setHeader(
                CorrelationIdContext.HEADER,
                correlationId
        );

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(CorrelationIdContext.MDC_KEY);
        }
    }

    private String resolveCorrelationId(
            HttpServletRequest request
    ) {
        String received = request.getHeader(
                CorrelationIdContext.HEADER
        );

        if (received == null
                || received.isBlank()
                || received.length() > 128) {
            return UUID.randomUUID().toString();
        }

        return received;
    }
}
```

O correlation ID deve possuir limite e caracteres controlados.

---

### 25. Criar contrato de logging

Arquivo:

```text
logging-contract.yaml
```

Conteúdo:

```yaml
logging:
  format:
    structured:
      required

  fields:
    required:
      - timestamp
      - level
      - logger
      - message
      - correlationId
      - application
      - environment
      - releaseId

  secrets:
    forbidden

  personalData:
    minimized

  stackTrace:
    internalOnly

  requestBody:
    default:
      disabled

  responseBody:
    default:
      disabled
```

---

### 26. Configurar `logback-spring.xml`

A saída precisa ser adequada para container.

Exemplo conceitual em linha única:

```xml
<configuration>
    <springProperty
        name="application"
        source="spring.application.name"
        defaultValue="orders-api" />

    <springProperty
        name="environment"
        source="app.runtime.environment"
        defaultValue="local" />

    <springProperty
        name="releaseId"
        source="app.runtime.release-id"
        defaultValue="local-development" />

    <property
        name="CONSOLE_PATTERN"
        value="%d{yyyy-MM-dd'T'HH:mm:ss.SSSXXX} level=%level app=${application} environment=${environment} release=${releaseId} correlationId=%X{correlationId:-none} logger=%logger message=&quot;%replace(%msg){'\n',' '}&quot;%n" />

    <appender
        name="CONSOLE"
        class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${CONSOLE_PATTERN}</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE" />
    </root>
</configuration>
```

Se o projeto já possui encoder JSON, preserve-o.

---

### 27. Padronizar erros com Problem Details

Arquivo:

```text
OperationalProblemHandler.java
```

Use `ProblemDetail`.

Exemplo:

```java
package com.formacao.orders.operational;

import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public final class OperationalProblemHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    ProblemDetail handleIllegalArgument(
            IllegalArgumentException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problem =
                ProblemDetail.forStatus(
                        HttpStatus.BAD_REQUEST
                );

        problem.setTitle("Invalid request");
        problem.setDetail(exception.getMessage());
        problem.setInstance(
                URI.create(request.getRequestURI())
        );

        problem.setProperty(
                "correlationId",
                MDC.get(CorrelationIdContext.MDC_KEY)
        );

        return problem;
    }
}
```

Não retorne stack trace ao cliente.

Não retorne mensagem que contenha Secret.

---

### 28. Definir limites operacionais

Arquivo:

```text
operational-limits.yaml
```

Conteúdo:

```yaml
limits:
  http:
    requestTimeoutSeconds:
      30

    maximumPayloadBytes:
      decisionRequired

  database:
    poolMaximum:
      12

  messaging:
    maximumConcurrentMessages:
      4

  cache:
    commandTimeoutMilliseconds:
      500

  shutdown:
    seconds:
      30

  startup:
    maximumSeconds:
      120

  correlationId:
    maximumLength:
      128
```

---

### 29. Criar teste de startup válido

Arquivo:

```text
StartupConfigurationValidatorTest.java
```

Cenário:

- profile `kubernetes`;
- release ID válido;
- version válida;
- commit válido;
- startup permitido.

Use teste de contexto ou teste unitário com `MockEnvironment`.

---

### 30. Criar teste de configuração inválida

Cenários:

- release ID vazio;
- commit `unknown`;
- version vazia;
- profile de deploy ativo.

Resultado:

```text
startup bloqueado.
```

O erro precisa informar a propriedade inválida sem exibir valores sensíveis.

---

### 31. Criar teste do endpoint de release

Arquivo:

```text
ReleaseInformationControllerTest.java
```

Valide:

- status `200`;
- application;
- environment;
- release ID;
- version;
- commit;
- build time;
- ausência de password;
- ausência de token;
- ausência de JDBC URL.

---

### 32. Criar teste de correlation ID

Arquivo:

```text
CorrelationIdFilterTest.java
```

Cenários:

- header ausente gera UUID;
- header válido é preservado;
- header vazio é substituído;
- header longo é substituído;
- response recebe header;
- MDC é limpo depois da requisição.

---

### 33. Criar teste de health contract

Arquivo:

```text
HealthEndpointContractTest.java
```

Valide:

```text
/actuator/health;

/actuator/health/liveness;

/actuator/health/readiness.
```

Confirme:

- endpoints disponíveis;
- status esperado;
- detalhes não expostos;
- liveness não depende de integração opcional;
- readiness reflete startup concluído.

---

### 34. Criar teste de arquitetura de deployability

Arquivo:

```text
DeployabilityArchitectureTest.java
```

Regras possíveis:

- pacote de domínio não depende de Spring Web;
- domínio não depende de client cloud;
- integração cloud depende de ports;
- operational pode depender de application, não do contrário;
- controllers não leem environment diretamente;
- Secrets não possuem defaults literais;
- nenhum uso de `System.getenv` espalhado.

Use ArchUnit se já estiver disponível.

Caso não esteja, crie validações de estrutura sem adicionar dependência desnecessária.

---

### 35. Criar contract de readiness

Arquivo:

```text
deploy-ready-readiness.yaml
```

Conteúdo:

```yaml
readiness:
  tests:
    unit:
      required

    integration:
      required

    operational:
      required

  configuration:
    typed:
      required

    startupValidation:
      required

  release:
    buildInformation:
      resolved

    runtimeInformation:
      resolved

  health:
    liveness:
      required

    readiness:
      required

  logging:
    structured:
      required

    correlation:
      required

  shutdown:
    graceful:
      required

  secrets:
    realValue:
      zero

  partTwo:
    imageAndDeployment:
      pending
```

O único item pendente permitido é o escopo formal da parte 2.

---

### 36. Validar contrato de configuração

Execute:

```powershell
.\scripts\project\deploy-ready\validate-runtime-configuration.ps1
```

O script bloqueia:

- Secret literal;
- profile inexistente;
- variável não documentada;
- default inseguro;
- integração cloud habilitada por padrão;
- propriedade obrigatória sem validação;
- profile Kubernetes sem release ID.

---

### 37. Validar build information

Execute:

```powershell
.\scripts\project\deploy-ready\validate-build-information.ps1
```

O script executa o build e verifica:

- artifact;
- version;
- commit;
- timestamp;
- endpoint;
- nenhum valor `unknown` no profile de deploy;
- nenhum Secret.

---

### 38. Validar health contract

Execute:

```powershell
.\scripts\project\deploy-ready\validate-health-contract.ps1
```

Valide:

- health;
- liveness;
- readiness;
- status code;
- tempo de resposta;
- detalhes ocultos;
- integração opcional não derruba liveness.

---

### 39. Validar logging

Execute:

```powershell
.\scripts\project\deploy-ready\validate-logging-contract.ps1
```

O script gera uma requisição fictícia e confirma:

- timestamp;
- level;
- application;
- environment;
- release ID;
- correlation ID;
- mensagem em linha única;
- ausência de password;
- ausência de token;
- ausência de body completo.

---

### 40. Validar graceful shutdown

Execute:

```powershell
.\scripts\project\deploy-ready\validate-graceful-shutdown.ps1
```

A simulação:

1. inicia a aplicação;
2. abre uma requisição controlada;
3. envia término;
4. impede novo tráfego;
5. aguarda a requisição;
6. encerra dentro do prazo;
7. registra duração.

Nenhuma operação longa real será executada.

---

### 41. Testar container startup

Execute:

```powershell
.\scripts\project\deploy-ready\test-container-startup.ps1
```

O script:

- constrói ou reutiliza imagem local;
- inicia com profile `container`;
- injeta release metadata fictícia;
- aguarda health;
- consulta release endpoint;
- valida logs;
- encerra graciosamente;
- remove container.

Ele não publica imagem.

---

### 42. Testar configuração inválida

Execute:

```powershell
.\scripts\project\deploy-ready\test-invalid-configuration.ps1
```

Inicie o container sem release ID.

Resultado esperado:

```text
processo encerra;

erro aponta
a configuração ausente;

nenhuma porta
fica disponível;

nenhum Secret
é exibido.
```

---

### 43. Testar endpoints operacionais

Execute:

```powershell
.\scripts\project\deploy-ready\test-operational-endpoints.ps1
```

Valide:

- `/actuator/health`;
- `/actuator/health/liveness`;
- `/actuator/health/readiness`;
- `/internal/release`;
- endpoint funcional existente;
- correlation ID;
- Problem Details em erro controlado.

---

### 44. Criar documentação de escopo

Arquivo:

```text
PROJECT_DEPLOYABILITY_SCOPE.md
```

Registre:

- objetivo;
- aplicação;
- boundaries;
- dependências;
- profiles;
- contracts;
- riscos;
- decisões;
- o que pertence à parte 1;
- o que pertence à parte 2.

---

### 45. Criar matriz de testes

Arquivo:

```text
PART_1_TEST_MATRIX.md
```

Cenários:

- build limpo;
- profile local inicia;
- profile test não chama cloud;
- profile container inicia;
- profile Kubernetes exige release ID;
- Secret literal é bloqueado;
- build metadata resolvida;
- release endpoint responde;
- release endpoint não expõe Secret;
- health responde;
- liveness independente de cloud;
- readiness válida;
- shutdown gracioso;
- correlation ID novo;
- correlation ID propagado;
- MDC limpo;
- Problem Details sem stack trace;
- logs estruturados;
- logs sem Secret;
- container inicia;
- configuração inválida falha;
- artifact não é publicado;
- deploy final permanece pendente.

---

### 46. Criar troubleshooting

Arquivo:

```text
PART_1_TROUBLESHOOTING.md
```

Inclua:

- profile incorreto;
- property binding falhando;
- release ID ausente;
- build commit `unknown`;
- health `DOWN`;
- readiness não sobe;
- liveness depende do banco;
- correlation ID duplicado;
- MDC vazando;
- log quebrando linha;
- Secret aparecendo;
- graceful shutdown excedido;
- container termina;
- porta ocupada;
- teste de contexto lento;
- metadata Maven ausente;
- endpoint interno público;
- Problem Details expondo mensagem;
- limite operacional inconsistente.

---

### 47. Coletar evidence da parte 1

Script:

```text
collect-part-1-evidence.ps1
```

Arquivo:

```text
part-1-deployability-evidence.json.
```

Campos permitidos:

- project;
- module;
- lesson;
- build status;
- test count;
- profiles validated;
- startup valid;
- invalid startup rejected;
- build information resolved;
- release endpoint status;
- health status;
- liveness status;
- readiness status;
- graceful shutdown duration;
- correlation test status;
- logging contract status;
- secret scan status;
- image published false;
- deploy executed false;
- timestamp.

---

### 48. Criar acceptance evidence

Arquivo:

```text
part-1-acceptance-evidence.yaml
```

Conteúdo:

```yaml
partOne:
  application:
    deployabilityContract:
      approved

    runtimeConfiguration:
      approved

    startupValidation:
      approved

    buildInformation:
      approved

    releaseInformation:
      approved

    health:
      approved

    gracefulShutdown:
      approved

    structuredLogging:
      approved

    correlationId:
      approved

    operationalErrors:
      approved

  security:
    realSecrets:
      zero

  external:
    imagePublished:
      false

    deploymentExecuted:
      false

  nextLesson:
    projectPartTwo:
      ready
```

---

### 49. Executar o gate da parte 1

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\project\deploy-ready\validate-deployability-contract.ps1

.\scripts\project\deploy-ready\validate-runtime-configuration.ps1

.\scripts\project\deploy-ready\validate-build-information.ps1

.\scripts\project\deploy-ready\validate-health-contract.ps1

.\scripts\project\deploy-ready\validate-logging-contract.ps1

.\scripts\project\deploy-ready\validate-graceful-shutdown.ps1

.\scripts\project\deploy-ready\test-container-startup.ps1

.\scripts\project\deploy-ready\test-invalid-configuration.ps1

.\scripts\project\deploy-ready\test-operational-endpoints.ps1

.\scripts\project\deploy-ready\collect-part-1-evidence.ps1

.\scripts\project\deploy-ready\verify-part-1-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- testes aprovados;
- profiles válidos;
- configuração externa;
- startup falha corretamente;
- release identificável;
- health válido;
- logs válidos;
- shutdown válido;
- nenhum Secret;
- nenhuma publicação;
- nenhum deploy final;
- parte 2 preparada.

---

## Entendendo o que foi feito

### A aplicação ganhou contrato de deployability

O que a plataforma pode esperar deixou de ser implícito.

### Configuração ganhou tipo e validação

Valores inválidos são detectados no startup.

### Build e release foram separados

Build descreve o artifact.

Release descreve o artifact em um ambiente.

### Health ganhou semântica

Liveness e readiness passaram a responder perguntas diferentes.

### Shutdown ganhou prazo

A aplicação pode sair sem interromper imediatamente o trabalho em andamento.

### Logs ganharam contexto

Environment, release e correlation ID passaram a acompanhar eventos.

### Erros ganharam contrato HTTP

Problem Details evita respostas inconsistentes e stack traces públicos.

### O container ganhou teste operacional

A aplicação foi validada fora da execução direta do Maven.

### A parte 1 ganhou evidence

A conclusão é verificável e não depende apenas de leitura manual.

---

## Erros comuns importantes

### Usar profile para guardar Secret

Profiles versionam diferenças, não credenciais reais.

### Permitir release ID `unknown`

A versão implantada fica impossível de rastrear.

### Colocar banco na liveness

Uma falha externa pode criar restart loop.

### Expor detalhes completos do health

Informações internas podem ajudar um atacante.

### Aceitar correlation ID ilimitado

Headers podem poluir logs ou causar abuso.

### Não limpar o MDC

Uma requisição pode receber o ID de outra.

### Registrar request body por padrão

O log pode expor dados sensíveis.

### Configurar graceful shutdown apenas no Spring

A plataforma também precisa fornecer tempo suficiente.

### Considerar teste unitário suficiente

Container startup e endpoints operacionais também precisam ser testados.

### Antecipar pipeline e deploy final

Essas etapas pertencem à aula 547.

---

## Comandos úteis

### Build completo

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Iniciar profile local

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

### Iniciar profile container

```powershell
java `
  -jar `
  target/orders-api.jar `
  --spring.profiles.active=container
```

### Consultar release

```powershell
Invoke-RestMethod `
  -Uri `
  http://localhost:8080/internal/release
```

### Consultar readiness

```powershell
Invoke-RestMethod `
  -Uri `
  http://localhost:8080/actuator/health/readiness
```

---

## Exercício guiado

### Parte 1 — Contract

Crie o contrato de deployability.

### Parte 2 — Configuration

Inventarie propriedades e Secrets.

### Parte 3 — Profiles

Separe local, test, container e Kubernetes.

### Parte 4 — Startup

Valide release, build e configuração.

### Parte 5 — Health

Separe liveness e readiness.

### Parte 6 — Operations

Configure shutdown e limites.

### Parte 7 — Observability

Implemente logs e correlation ID.

### Parte 8 — Errors

Padronize Problem Details.

### Parte 9 — Tests

Teste startup, endpoints e container.

### Parte 10 — Evidence

Comprove a conclusão da parte 1.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 545 foi preservada;
- ponte para a aula 547 está correta;
- projeto prático foi iniciado sem antecipar a parte 2;
- deployability foi definida;
- runtime configuration foi definida;
- build information foi definida;
- release information foi definida;
- health, liveness e readiness foram diferenciadas;
- graceful shutdown foi definido;
- correlation ID foi definido;
- structured logging foi definido;
- operational contract foi definido;
- contrato de deployability foi criado;
- configuração externa foi exigida;
- configuração tipada foi exigida;
- startup validation foi exigida;
- artifact imutável foi exigido;
- build e release information foram exigidos;
- logs e correlation ID foram exigidos;
- graceful shutdown foi exigido;
- Secrets no repositório foram proibidos;
- contrato de runtime foi criado;
- properties foram classificadas;
- configuração e Secret foram separados;
- `application.yml` possui defaults seguros;
- integrações AWS ficam desabilitadas por padrão;
- profile local foi criado;
- profile test foi criado;
- profile container foi criado;
- profile Kubernetes foi criado;
- profile Kubernetes exige release ID;
- properties tipadas foram criadas;
- validação Bean Validation foi aplicada;
- `BuildInformation` foi criado;
- build metadata foi modelada;
- commit e timestamp foram incluídos;
- valores `unknown` foram bloqueados em deploy;
- `ReleaseInformation` foi criado;
- endpoint `/internal/release` foi criado;
- endpoint não expõe Secrets;
- contrato de release foi criado;
- `StartupConfigurationValidator` foi criado;
- startup inválido é bloqueado;
- health contract foi criado;
- liveness não depende de integração opcional;
- readiness foi definida;
- detalhes públicos do health foram ocultados;
- graceful shutdown contract foi criado;
- prazo Kubernetes maior foi planejado;
- `CorrelationIdContext` foi criado;
- `CorrelationIdFilter` foi criado;
- response devolve correlation ID;
- tamanho do header foi limitado;
- MDC é limpo;
- logging contract foi criado;
- logs possuem application, environment, release e correlation;
- request e response bodies ficam desabilitados por padrão;
- `logback-spring.xml` foi criado;
- logs são emitidos para console;
- `OperationalProblemHandler` foi criado;
- Problem Details foi usado;
- stack trace público foi proibido;
- limites operacionais foram criados;
- timeout, pool, startup e shutdown foram definidos;
- teste de startup válido foi criado;
- teste de configuração inválida foi criado;
- teste do release endpoint foi criado;
- teste de correlation ID foi criado;
- teste de health foi criado;
- teste de arquitetura foi criado;
- cloud clients ficaram fora do domínio;
- readiness da parte 1 foi criada;
- runtime configuration foi validada;
- build information foi validada;
- health contract foi validado;
- logging contract foi validado;
- graceful shutdown foi validado;
- container startup foi testado;
- configuração inválida foi testada;
- endpoints operacionais foram testados;
- documentação de escopo foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- evidence foi sanitizada;
- Secret real ficou em zero;
- image published ficou false;
- deploy executed ficou false;
- acceptance evidence foi criada;
- gate completo foi executado;
- pipeline final não foi antecipado;
- registry não foi antecipado;
- deploy final não foi antecipado;
- commit recomendado está pronto.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/deploy-ready `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/com/formacao/orders/operational `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java/com/formacao/orders/operational `
  scripts/project/deploy-ready `
  docs/project/deploy-ready `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|jdbc:.*password|client-secret"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): preparar API para deploy parte 1"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- Secret real;
- arquivo `.env`;
- credencial;
- token;
- kubeconfig;
- imagem publicada;
- output completo de ambiente;
- pipeline final;
- manifests finais da parte 2;
- evidence com dados sensíveis.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto de API pronta para deploy foi iniciado pela camada interna da aplicação.

O projeto passou a possuir:

```text
deployability contract;

runtime configuration;

profiles;

startup validation;

build information;

release information;

health groups;

graceful shutdown;

structured logging;

correlation ID;

Problem Details;

operational tests;

evidence.
```

Você comprovou que uma aplicação não está pronta para deploy apenas porque gera um JAR; configuração precisa ser externa e tipada; Secrets não podem possuir defaults reais; builds e releases precisam ser rastreáveis; liveness e readiness possuem semânticas diferentes; startup inválido precisa falhar cedo; logs precisam de contexto sem expor dados; graceful shutdown precisa de prazo; erros precisam de contrato; e a aplicação precisa ser testada dentro de um container antes da promoção.

Próxima aula:

```text
547 - M17.42 - Projeto API pronta para deploy parte 2
```

Nela, você irá concluir o projeto prático com imagem final, configuração de container, manifests Kubernetes, pipeline, gates de segurança, release metadata, deploy controlado, smoke test, rollback e evidence final.

Nenhum pipeline final, imagem publicada, registry, manifest definitivo ou deploy final foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o contrato de deployability.
- [ ] Separei configuração e Secrets.
- [ ] Criei profiles de execução.
- [ ] Implementei startup validation.
- [ ] Expus build e release information.
- [ ] Validei health e graceful shutdown.
- [ ] Implementei logs e correlation ID.
- [ ] Coletei evidence da parte 1.

---

## Troubleshooting adicional

### O profile Kubernetes não inicia

Revise release ID, version e commit obrigatórios.

### O endpoint de release mostra `unknown`

O build ou o pipeline não injetou metadata corretamente.

### A readiness fica `DOWN`

Revise startup state e indicadores incluídos no grupo.

### A liveness cai quando o banco falha

Remova dependências externas da liveness.

### O correlation ID aparece em outra requisição

O MDC não foi limpo no bloco `finally`.

### O log quebra em várias linhas

Revise pattern e tratamento de mensagens.

### O shutdown encerra requisições

Revise timeout do Spring e prazo da plataforma.

### O container inicia localmente, mas não no script

Revise profile, porta, metadata e variáveis exigidas.

### O Problem Details expõe informação interna

Troque a mensagem pública e mantenha detalhe técnico apenas no log.

### Um pipeline final apareceu

Remova e preserve para a aula 547.

---

## Perguntas de revisão

1. O que é deployability?
2. O que é runtime configuration?
3. Qual a diferença entre build e release?
4. Por que validar configuração no startup?
5. O que é liveness?
6. O que é readiness?
7. Por que o banco não deve entrar automaticamente na liveness?
8. O que é graceful shutdown?
9. Para que serve correlation ID?
10. Por que limpar o MDC?
11. O que é structured logging?
12. Por que não registrar request body por padrão?
13. Para que serve Problem Details?
14. O que o endpoint de release deve informar?
15. Por que bloquear `unknown` em deploy?
16. O que o teste de container comprova?
17. O que pertence à parte 1?
18. O que pertence à parte 2?
19. O que não foi publicado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Capacidade de implantar previsivelmente.
2. Configuração recebida na execução.
3. Artifact e artifact no ambiente.
4. Falhar cedo.
5. Saúde do processo.
6. Capacidade de receber tráfego.
7. Evitar restart loop.
8. Encerramento controlado.
9. Relacionar logs e chamadas.
10. Evitar contaminação entre requisições.
11. Logs com campos previsíveis.
12. Evitar dados sensíveis.
13. Padronizar erros HTTP.
14. App, ambiente, release, versão e commit.
15. Garantir rastreabilidade.
16. Execução fora do Maven.
17. Contratos internos e testes.
18. Imagem, pipeline, manifests e deploy.
19. Imagem e release final.
20. Projeto API pronta para deploy parte 2.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 546 - M17.41 - Projeto API pronta para deploy parte 1

- Continuei após Deploy em ambiente simples.
- Iniciei o projeto prático de API pronta para deploy.
- Defini deployability como contrato operacional.
- Criei o contrato de configuração de runtime.
- Separei configuração não sensível de Secrets.
- Criei profiles local, test, container e Kubernetes.
- Mantive integrações AWS desabilitadas por padrão.
- Criei properties tipadas com validação.
- Implementei validação de startup.
- Bloqueei release ID, version e commit não resolvidos.
- Modelei build information.
- Modelei release information.
- Criei endpoint interno de release.
- Impedi exposição de Secrets e environment dump.
- Separei liveness e readiness.
- Mantive integrações externas fora da liveness.
- Configurei graceful shutdown.
- Planejei prazo maior no Kubernetes.
- Criei correlation ID e propagação por header.
- Limitei tamanho do correlation ID.
- Limpei MDC após cada requisição.
- Estruturei logs com application, environment e release.
- Proibi bodies e Secrets nos logs.
- Padronizei erros com Problem Details.
- Criei limites operacionais explícitos.
- Criei testes de startup, release, health e correlation.
- Criei teste de arquitetura de deployability.
- Testei startup em container.
- Testei falha de configuração obrigatória.
- Criei documentação, test matrix e troubleshooting.
- Coletei evidence sanitizada da parte 1.
- Não publiquei imagem e não executei o deploy final.
- Próxima aula: Projeto API pronta para deploy parte 2.
```

---

## Referência técnica curta

- Spring Boot Externalized Configuration.
- Spring Boot Configuration Properties.
- Spring Boot Actuator Health Groups.
- Kubernetes Liveness and Readiness Probes.
- Spring Boot Graceful Shutdown.
- Mapped Diagnostic Context.
- RFC 9457 Problem Details.
- Build and Release Metadata.
- Twelve-Factor App Configuration.
- Deployability and Operational Readiness.

Regra final:

```text
a primeira parte do projeto de API pronta para deploy precisa consolidar a deployability dentro da aplicação antes de automatizar promoção e implantação: configuração é externa, tipada e validada no startup, profiles local, test, container e Kubernetes possuem responsabilidades claras e integrações externas começam desabilitadas; build information identifica artifact, version, commit e timestamp, enquanto release information adiciona environment e release ID, proibindo valores desconhecidos em profiles de deploy; liveness representa saúde do processo, readiness representa aptidão para tráfego e graceful shutdown encerra trabalho dentro de prazo coordenado com a plataforma; logs estruturados carregam application, environment, release e correlation ID sem Secrets ou bodies, MDC é limpo e erros usam Problem Details; testes validam startup válido, configuração inválida, health, release endpoint, correlation, arquitetura e execução em container; nenhuma imagem é publicada, nenhum pipeline final é criado e nenhum deploy definitivo é executado, deixando para a aula 547 a conclusão com artifact final, manifests, gates, pipeline, release, deploy, rollback e evidence.
```
