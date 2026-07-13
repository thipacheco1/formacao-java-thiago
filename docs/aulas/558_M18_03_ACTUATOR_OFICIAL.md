# 558 - M18.03 - Actuator

## Apresentação da aula

Na aula 557, a `orders-api` passou a transportar contexto operacional entre requisições, threads, chamadas HTTP e mensagens.

Os logs estruturados agora podem carregar:

```text
correlation_id;

trace_id;

span_id;

application;

environment;

release_id;

event;

outcome.
```

Esses campos ajudam a responder:

```text
quais eventos
pertencem ao mesmo fluxo?
```

Ainda falta responder outra pergunta:

```text
qual é o estado
da aplicação
agora?
```

Uma aplicação pode continuar com o processo Java ativo e, mesmo assim:

- não estar pronta para receber tráfego;
- estar sem conexão com uma dependência obrigatória;
- estar usando uma configuração inesperada;
- estar executando uma release diferente;
- estar próxima do limite de recursos;
- possuir componentes degradados;
- estar operacionalmente invisível;
- expor endpoints sensíveis sem proteção.

O Spring Boot Actuator cria uma superfície operacional para observar e administrar aspectos da aplicação.

Ele oferece endpoints como:

```text
health;

info;

loggers;

env;

configprops;

beans;

mappings;

threaddump;

heapdump;

metrics;

prometheus;

shutdown.
```

A existência desses endpoints não significa que todos devam ser publicados.

A decisão correta depende de:

- ambiente;
- necessidade operacional;
- risco;
- autenticação;
- rede;
- dados expostos;
- custo;
- responsabilidade.

A pergunta central desta aula será:

```text
como configurar
uma superfície operacional

útil para diagnóstico
e segura para produção?
```

Você irá configurar o Actuator para que a `orders-api` possua:

- dependência correta;
- base path operacional;
- exposure mínima;
- health detalhado somente quando permitido;
- liveness;
- readiness;
- info da aplicação;
- build metadata;
- Git metadata;
- endpoint de release coerente;
- security boundary;
- comportamento diferente por ambiente;
- custom health indicator;
- testes de contrato;
- scan de endpoints expostos;
- evidence sanitizada.

A aula não aprofundará:

- criação de métricas customizadas;
- timers;
- counters;
- gauges;
- tags;
- registries;
- Prometheus;
- dashboards;
- alertas baseados em séries temporais;
- percentis;
- histogramas.

A próxima aula oficial será:

```text
559 - M18.04 - Micrometer
```

O endpoint `/actuator/metrics` poderá ser reconhecido como parte do Actuator, mas a instrumentação com Micrometer permanecerá reservada para a aula 559.

A regra central será:

```text
expor somente
o que possui
utilidade operacional,

proteção adequada
e conteúdo conhecido.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
556:
Logs estruturados.

557:
Correlation ID trace ID.

558:
Actuator.

559:
Micrometer.
```

A progressão do Módulo 18 está formando três camadas:

```text
logs:
o que aconteceu.

contexto:
quais eventos
pertencem ao mesmo fluxo.

Actuator:
qual é o estado
da aplicação.
```

Nesta aula:

```text
Spring Boot Actuator:
sim.

health:
sim.

liveness:
sim.

readiness:
sim.

info:
sim.

build info:
sim.

Git info:
sim.

custom health indicator:
sim.

endpoint exposure:
sim.

segurança:
sim.

testes:
sim.

custom metrics:
não.

Micrometer:
não aprofundado.

Prometheus:
não.

dashboards:
não.
```

A progressão prática será:

```text
1.
adicionar dependência.

2.
definir superfície operacional.

3.
configurar por ambiente.

4.
proteger endpoints.

5.
modelar health.

6.
publicar info segura.

7.
testar contratos.

8.
coletar evidence.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
pom.xml

src/main/java
└── .../observability/actuator
    ├── OperationalDependencyHealthIndicator.java
    ├── OperationalDependencyHealthProperties.java
    ├── ApplicationInfoContributor.java
    ├── ActuatorSecurityConfiguration.java
    └── ActuatorEndpointPolicy.java

src/main/resources
├── application.yml
├── application-local.yml
├── application-container.yml
├── application-kubernetes.yml
├── application-observability.yml
└── META-INF
    └── build-info.properties

src/test/java
└── .../observability/actuator
    ├── ActuatorExposureContractTest.java
    ├── HealthEndpointContractTest.java
    ├── ReadinessLivenessContractTest.java
    ├── InfoEndpointContractTest.java
    ├── ActuatorSecurityContractTest.java
    └── OperationalDependencyHealthIndicatorTest.java

observability/actuator
├── actuator-exposure-contract.yaml
├── actuator-security-contract.yaml
├── health-contract.yaml
├── info-contract.yaml
├── health-dependency-classification.yaml
├── actuator-environment-policy.yaml
├── actuator-failure-policy.yaml
└── actuator-evidence.yaml

scripts/observability/actuator
├── validate-actuator-dependency.ps1
├── validate-actuator-exposure.ps1
├── validate-health-groups.ps1
├── validate-info-endpoint.ps1
├── validate-actuator-security.ps1
├── simulate-health-states.ps1
├── scan-actuator-output.ps1
├── collect-actuator-evidence.ps1
└── verify-actuator-baseline.ps1

docs/observability/actuator
├── ACTUATOR_OVERVIEW.md
├── ACTUATOR_EXPOSURE_POLICY.md
├── HEALTH_AND_PROBES.md
├── ACTUATOR_SECURITY.md
├── ACTUATOR_INFO.md
├── ACTUATOR_TEST_MATRIX.md
└── ACTUATOR_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
Actuator habilitado;

exposure mínima;

health groups;

liveness;

readiness;

info segura;

build e Git metadata;

custom health indicator;

endpoints protegidos;

contratos testados;

evidence sanitizada.
```

Você irá:

1. validar a baseline;
2. adicionar a dependência;
3. definir base path;
4. definir exposure;
5. configurar health;
6. configurar liveness;
7. configurar readiness;
8. classificar dependências;
9. criar health indicator;
10. criar info contributor;
11. gerar build info;
12. gerar Git info;
13. proteger endpoints;
14. diferenciar ambientes;
15. testar acesso;
16. testar estados;
17. escanear output;
18. criar documentação;
19. coletar evidence;
20. executar gate;
21. commitar;
22. preparar a aula 559.

---

## Conceito essencial

### Actuator

Módulo do Spring Boot que expõe informações e operações sobre o estado da aplicação.

---

### Endpoint operacional

Interface voltada para monitoramento, diagnóstico ou administração.

---

### Exposure

Conjunto de endpoints disponibilizados por HTTP ou JMX.

---

### Health

Estado agregado da aplicação e de seus componentes.

---

### Liveness

Indicação de que o processo precisa ou não ser reiniciado.

---

### Readiness

Indicação de que a instância pode ou não receber tráfego.

---

### Health indicator

Componente que contribui para o estado de health.

---

### Health group

Agrupamento de indicadores com finalidade específica.

---

### Info contributor

Componente que adiciona informações ao endpoint `info`.

---

### Sanitização operacional

Restrição do conteúdo exposto por endpoints técnicos.

---

### Management surface

Conjunto total de endpoints, caminhos, autenticação e rede usados para operação.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Inicie a aplicação:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability"
```

Confirme:

- logs estruturados;
- correlation ID;
- trace ID;
- release ID;
- health atual;
- endpoints existentes;
- porta da aplicação;
- porta de management, quando separada;
- nenhum Secret real.

Registre o estado anterior.

---

### 2. Adicionar o Actuator

No `pom.xml`, confirme:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

A dependência precisa usar a versão gerenciada pelo Spring Boot.

Não declare versão manual sem necessidade.

Execute:

```powershell
mvn `
  --batch-mode `
  dependency:tree `
  "-Dincludes=org.springframework.boot:spring-boot-starter-actuator"
```

Resultado esperado:

```text
uma dependência Actuator
coerente com a versão
do Spring Boot.
```

---

### 3. Definir base path

No `application.yml`:

```yaml
management:
  endpoints:
    web:
      base-path: /actuator
```

O padrão já é `/actuator`.

Mesmo assim, registrar explicitamente o contrato ajuda a evitar divergência.

Não use um path que pareça endpoint de negócio.

Exemplo inadequado:

```text
/api/admin.
```

A superfície operacional precisa ser distinguível.

---

### 4. Definir exposure mínima

No profile base:

```yaml
management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
```

Essa deve ser a baseline.

Evite:

```yaml
include: "*"
```

O wildcard publica endpoints que podem expor:

- configuração;
- classes;
- mappings;
- logs;
- threads;
- heap;
- environment;
- propriedades;
- operações administrativas.

A exposure precisa ser allowlist.

---

### 5. Criar contrato de exposure

Arquivo:

```text
actuator-exposure-contract.yaml
```

Conteúdo:

```yaml
actuator:
  basePath:
    /actuator

  defaultExposure:
    include:
      - health
      - info

  forbiddenByDefault:
    - env
    - configprops
    - beans
    - mappings
    - threaddump
    - heapdump
    - shutdown

  wildcardExposure:
    forbidden

  environmentOverrides:
    local:
      additionalEndpoints:
        controlled

    production:
      additionalEndpoints:
        explicitApprovalRequired
```

O contrato impede que profiles publiquem endpoints de forma acidental.

---

### 6. Diferenciar availability e component health

O endpoint geral:

```text
/actuator/health
```

pode agregar vários componentes.

Os endpoints de disponibilidade:

```text
/actuator/health/liveness;

/actuator/health/readiness.
```

possuem finalidades específicas.

Não trate:

```text
health geral
=
liveness
=
readiness.
```

Cada grupo precisa de uma pergunta.

---

### 7. Habilitar probes

No `application.yml`:

```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
```

Quando necessário em ambiente não Kubernetes:

```yaml
management:
  endpoint:
    health:
      probes:
        add-additional-paths: true
```

Os caminhos adicionais podem disponibilizar:

```text
/livez;

/readyz.
```

Use somente quando houver necessidade operacional.

Não crie aliases sem documentação.

---

### 8. Configurar detalhes de health

Baseline:

```yaml
management:
  endpoint:
    health:
      show-details: never
      show-components: never
```

Em ambiente local controlado:

```yaml
management:
  endpoint:
    health:
      show-details: always
      show-components: always
```

Em ambiente protegido:

```yaml
show-details: when-authorized
```

Detalhes podem revelar:

- nomes de dependências;
- hosts;
- estado de banco;
- capacidade;
- mensagens de erro;
- componentes internos.

A decisão precisa ser consciente.

---

### 9. Criar política por ambiente

Arquivo:

```text
actuator-environment-policy.yaml
```

Conteúdo:

```yaml
environments:
  local:
    exposure:
      - health
      - info
      - loggers

    healthDetails:
      always

  container:
    exposure:
      - health
      - info

    healthDetails:
      never

  kubernetes:
    exposure:
      - health
      - info

    probes:
      - liveness
      - readiness

    healthDetails:
      when-authorized

  production:
    exposure:
      minimum

    managementNetwork:
      private

    authentication:
      requiredForSensitiveEndpoints
```

O profile local pode expor mais para diagnóstico.

Isso não autoriza copiar a configuração para produção.

---

### 10. Classificar dependências

Arquivo:

```text
health-dependency-classification.yaml
```

Conteúdo:

```yaml
dependencies:
  primaryDatabase:
    requiredForReadiness:
      true

    requiredForLiveness:
      false

  kafkaProducer:
    requiredForReadiness:
      conditional

    requiredForLiveness:
      false

  redisCache:
    requiredForReadiness:
      false

    degradedMode:
      supported

  optionalExternalApi:
    requiredForReadiness:
      false

    requiredForLiveness:
      false
```

A classificação depende do comportamento real.

Uma dependência opcional não deve derrubar readiness sem justificativa.

---

### 11. Revisar liveness

Liveness responde:

```text
o processo está
em estado irrecuperável
e precisa reiniciar?
```

Liveness não deve depender diretamente de:

- banco;
- Kafka;
- Redis;
- API externa;
- DNS;
- object storage.

Se o banco falha, reiniciar todos os Pods pode aumentar o incidente.

O indicador de liveness deve representar estado interno.

---

### 12. Revisar readiness

Readiness responde:

```text
a instância consegue
atender o contrato
mínimo do tráfego?
```

Pode incluir:

- inicialização concluída;
- configuração válida;
- banco obrigatório;
- migrations concluídas;
- dependência indispensável;
- capacidade interna.

Evite readiness excessivamente sensível a oscilações temporárias.

Use retries, thresholds e timeouts coerentes na plataforma.

---

### 13. Configurar health groups

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
            - operationalDependency
```

O nome do indicator customizado precisa corresponder ao bean.

Não inclua todos os indicators automaticamente em todos os grupos.

---

### 14. Criar properties tipadas

Arquivo:

```text
OperationalDependencyHealthProperties.java
```

Exemplo:

```java
package com.formacao.orders.observability.actuator;

import jakarta.validation.constraints.NotBlank;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
        prefix = "app.health.operational-dependency")
public record OperationalDependencyHealthProperties(
        boolean enabled,
        @NotBlank String name,
        Duration timeout) {
}
```

A property define o comportamento do indicator.

Não leia variáveis diretamente dentro do health check.

---

### 15. Criar health indicator customizado

Arquivo:

```text
OperationalDependencyHealthIndicator.java
```

Exemplo:

```java
package com.formacao.orders.observability.actuator;

import java.time.Duration;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;

public final class OperationalDependencyHealthIndicator
        implements HealthIndicator {

    private final OperationalDependencyProbe probe;
    private final OperationalDependencyHealthProperties properties;

    public OperationalDependencyHealthIndicator(
            OperationalDependencyProbe probe,
            OperationalDependencyHealthProperties properties) {

        this.probe = probe;
        this.properties = properties;
    }

    @Override
    public Health health() {
        if (!properties.enabled()) {
            return Health.unknown()
                    .withDetail(
                            "reason",
                            "dependency-check-disabled")
                    .build();
        }

        var startedAt = System.nanoTime();

        try {
            var result = probe.check(
                    properties.timeout());

            var duration = Duration.ofNanos(
                    System.nanoTime() - startedAt);

            if (!result.available()) {
                return Health.down()
                        .withDetail(
                                "dependency",
                                properties.name())
                        .withDetail(
                                "duration_ms",
                                duration.toMillis())
                        .withDetail(
                                "reason",
                                result.reasonCode())
                        .build();
            }

            return Health.up()
                    .withDetail(
                            "dependency",
                            properties.name())
                    .withDetail(
                            "duration_ms",
                            duration.toMillis())
                    .build();
        } catch (RuntimeException exception) {
            var duration = Duration.ofNanos(
                    System.nanoTime() - startedAt);

            return Health.down()
                    .withDetail(
                            "dependency",
                            properties.name())
                    .withDetail(
                            "duration_ms",
                            duration.toMillis())
                    .withDetail(
                            "error_type",
                            exception.getClass().getSimpleName())
                    .build();
        }
    }
}
```

Não inclua:

- URL completa com credencial;
- username;
- password;
- token;
- stack trace;
- response body;
- dados pessoais.

---

### 16. Evitar health checks caros

Um health indicator não deve:

- executar query pesada;
- varrer tabela;
- publicar mensagem real;
- consumir fila;
- chamar endpoint lento;
- alterar estado;
- realizar retry longo;
- gerar log de erro a cada probe.

Health checks são chamados com frequência.

A operação precisa ser:

- rápida;
- read-only;
- limitada;
- previsível;
- segura.

---

### 17. Evitar cascata de health checks

Imagine:

```text
20 Pods;

probe a cada 5 segundos;

health chama banco;

health chama Kafka;

health chama API externa.
```

O próprio sistema de monitoramento pode criar carga relevante.

Defina:

- timeout curto;
- frequência coerente;
- checks mínimos;
- cache quando apropriado;
- agrupamento;
- fallback;
- thresholds da plataforma.

---

### 18. Criar contrato de health

Arquivo:

```text
health-contract.yaml
```

Conteúdo:

```yaml
health:
  general:
    endpoint:
      /actuator/health

  liveness:
    endpoint:
      /actuator/health/liveness

    externalDependencies:
      forbidden

  readiness:
    endpoint:
      /actuator/health/readiness

    requiredDependencies:
      explicit

  details:
    public:
      forbidden

  checks:
    sideEffects:
      forbidden

    timeout:
      required

    sensitiveData:
      forbidden
```

---

### 19. Configurar `info`

No `application.yml`:

```yaml
management:
  info:
    env:
      enabled: true
    java:
      enabled: true
    os:
      enabled: false
    git:
      mode: simple
```

Evite expor informações que aumentem fingerprinting sem necessidade.

O endpoint pode conter:

- application;
- version;
- release;
- commit;
- build time;
- Java version, quando aprovado.

Não exponha:

- environment completo;
- hostname interno;
- username;
- caminhos;
- Secrets;
- argumentos sensíveis.

---

### 20. Adicionar informações da aplicação

Configuração:

```yaml
info:
  app:
    name: ${spring.application.name}
    environment: ${app.environment}
    release-id: ${app.release-id}
    description: Orders API observability lab
```

O valor precisa vir das mesmas properties usadas no runtime.

Não duplique manualmente release ID em vários arquivos.

---

### 21. Criar `InfoContributor`

Arquivo:

```text
ApplicationInfoContributor.java
```

Exemplo:

```java
package com.formacao.orders.observability.actuator;

import java.util.Map;
import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;

public final class ApplicationInfoContributor
        implements InfoContributor {

    private final ApplicationOperationalInfo operationalInfo;

    public ApplicationInfoContributor(
            ApplicationOperationalInfo operationalInfo) {

        this.operationalInfo = operationalInfo;
    }

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail(
                "application",
                Map.of(
                        "name",
                        operationalInfo.application(),
                        "environment",
                        operationalInfo.environment(),
                        "releaseId",
                        operationalInfo.releaseId()));
    }
}
```

O contributor precisa publicar somente dados aprovados.

---

### 22. Gerar build info

No plugin Maven:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>build-info</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Isso gera metadata como:

- group;
- artifact;
- name;
- version;
- time.

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  package
```

Inspecione:

```powershell
jar tf `
  target/orders-api.jar `
  | Select-String `
      "META-INF/build-info.properties"
```

---

### 23. Gerar Git info

Use o plugin aprovado no projeto para gerar:

```text
git.properties.
```

O conteúdo pode incluir:

- branch;
- commit ID;
- commit time.

Exponha apenas o necessário.

Em produção, prefira:

```text
commit abreviado;
```

quando isso atender à rastreabilidade.

A metadata precisa corresponder ao source do build.

---

### 24. Comparar `/info` e `/internal/release`

A aplicação já possui um endpoint interno de release.

Defina responsabilidades:

```text
/actuator/info:
informação operacional
padronizada pelo Actuator.

/internal/release:
contrato interno
específico da aplicação.
```

Os dois podem coexistir.

Eles precisam concordar sobre:

- application;
- version;
- commit;
- release ID;
- build time.

Divergência é bloqueadora.

---

### 25. Criar contrato de info

Arquivo:

```text
info-contract.yaml
```

Conteúdo:

```yaml
info:
  required:
    - application.name
    - application.environment
    - application.releaseId
    - build.version
    - git.commit.id

  forbidden:
    - password
    - token
    - privateKey
    - username
    - environmentDump
    - commandLineArguments

  consistency:
    internalReleaseEndpoint:
      required
```

---

### 26. Revisar endpoints sensíveis

#### `env`

Pode revelar properties e origens.

#### `configprops`

Pode revelar estrutura de configuração.

#### `beans`

Expõe componentes internos.

#### `mappings`

Expõe rotas.

#### `loggers`

Permite consultar ou alterar níveis.

#### `threaddump`

Expõe stack traces de threads.

#### `heapdump`

Pode conter Secrets e dados pessoais.

#### `shutdown`

Encerra a aplicação.

Esses endpoints não pertencem à exposure pública padrão.

---

### 27. Manter shutdown desabilitado

Configuração:

```yaml
management:
  endpoint:
    shutdown:
      enabled: false
```

Não habilite apenas para facilitar laboratório.

A plataforma deve controlar lifecycle.

Em Kubernetes:

```text
Deployment;

Pod termination;

graceful shutdown.
```

O endpoint HTTP de shutdown aumenta risco operacional.

---

### 28. Proteger o Actuator

Arquivo:

```text
ActuatorSecurityConfiguration.java
```

Exemplo conceitual com Spring Security:

```java
@Bean
SecurityFilterChain actuatorSecurity(
        HttpSecurity http) throws Exception {

    return http
            .securityMatcher(
                    EndpointRequest.toAnyEndpoint())
            .authorizeHttpRequests(
                    authorization ->
                            authorization
                                    .requestMatchers(
                                            EndpointRequest.to(
                                                    HealthEndpoint.class,
                                                    InfoEndpoint.class))
                                    .permitAll()
                                    .anyRequest()
                                    .hasRole("ACTUATOR"))
            .httpBasic(
                    Customizer.withDefaults())
            .build();
}
```

A política exata depende do projeto.

Em ambiente local, uma configuração simplificada pode ser usada.

Em produção, prefira:

- rede privada;
- identidade forte;
- autenticação;
- autorização;
- audit;
- exposure mínima.

---

### 29. Criar contrato de segurança

Arquivo:

```text
actuator-security-contract.yaml
```

Conteúdo:

```yaml
security:
  public:
    allowed:
      - health
      - info-sanitized

  protected:
    - loggers
    - mappings
    - threaddump

  forbidden:
    - heapdump
    - shutdown

  production:
    managementNetwork:
      private

    authentication:
      required

  secrets:
    endpointOutput:
      forbidden
```

A autorização precisa ser testada.

---

### 30. Separar porta de management

Opcionalmente:

```yaml
management:
  server:
    port: 9090
```

Benefícios:

- regra de firewall separada;
- Service separado;
- acesso operacional restrito;
- redução de exposição.

Riscos:

- porta adicional;
- configuração extra;
- health da plataforma precisa apontar corretamente;
- Service e NetworkPolicy precisam incluir o fluxo.

No laboratório, documente a decisão.

Não altere a porta sem atualizar probes e scripts.

---

### 31. Criar policy class

Arquivo:

```text
ActuatorEndpointPolicy.java
```

Responsabilidades:

- listar endpoints públicos;
- listar endpoints protegidos;
- listar endpoints proibidos;
- validar profile;
- fornecer decisão aos testes.

Exemplo:

```java
public final class ActuatorEndpointPolicy {

    public static final Set<String> PUBLIC_ENDPOINTS =
            Set.of("health", "info");

    public static final Set<String> FORBIDDEN_ENDPOINTS =
            Set.of("heapdump", "shutdown");

    private ActuatorEndpointPolicy() {
    }
}
```

O código não substitui configuração.

Ele cria um contrato testável.

---

### 32. Registrar acesso operacional

Acessos relevantes podem gerar logs estruturados.

Exemplo:

```text
event:
actuator.endpoint.accessed.

endpoint:
health.

outcome:
success.

http_status:
200.
```

Evite logar cada probe de sucesso em `INFO`.

Uma política possível:

- health success: `DEBUG` ou filtrado;
- acesso protegido negado: `WARN`;
- alteração de logger: `INFO`;
- tentativa de endpoint proibido: `WARN`.

Não registre credenciais.

---

### 33. Testar exposure

Arquivo:

```text
ActuatorExposureContractTest.java
```

Valide:

- `/actuator/health` disponível;
- `/actuator/info` disponível;
- `/actuator/env` indisponível;
- `/actuator/configprops` indisponível;
- `/actuator/heapdump` indisponível;
- `/actuator/shutdown` indisponível;
- wildcard ausente;
- profile local não altera produção.

Use testes com contextos de profiles diferentes.

---

### 34. Testar health

Arquivo:

```text
HealthEndpointContractTest.java
```

Cenários:

- health `UP`;
- dependency `DOWN`;
- detail oculto;
- detail autorizado;
- nenhum Secret;
- duration numérica;
- error type sanitizado;
- nenhum stack trace;
- endpoint responde com media type correto.

O status HTTP precisa seguir a política.

---

### 35. Testar liveness e readiness

Arquivo:

```text
ReadinessLivenessContractTest.java
```

Cenários:

```text
processo vivo,
banco indisponível:

liveness:
UP.

readiness:
DOWN.
```

Outro cenário:

```text
aplicação iniciando:

liveness:
UP.

readiness:
OUT_OF_SERVICE
ou estado equivalente.
```

O teste precisa provar semântica, não apenas presença dos endpoints.

---

### 36. Testar info

Arquivo:

```text
InfoEndpointContractTest.java
```

Valide:

- application name;
- environment;
- release ID;
- build version;
- commit;
- consistência com `/internal/release`;
- ausência de Secret;
- ausência de username;
- ausência de dump de environment;
- ausência de command-line args sensíveis.

---

### 37. Testar segurança

Arquivo:

```text
ActuatorSecurityContractTest.java
```

Cenários:

- health público permitido;
- info sanitizado permitido;
- endpoint protegido sem autenticação negado;
- endpoint protegido com role correta permitido;
- role incorreta negada;
- endpoint proibido indisponível;
- resposta de erro sem detalhes sensíveis.

Quando o projeto ainda não possuir Spring Security completo, modele e teste o boundary disponível sem inventar autenticação final.

---

### 38. Testar health indicator

Arquivo:

```text
OperationalDependencyHealthIndicatorTest.java
```

Cenários:

- dependency `UP`;
- dependency `DOWN`;
- timeout;
- exception;
- check desabilitado;
- duration;
- reason code;
- nenhum valor sensível;
- nenhum side effect;
- timeout obrigatório.

---

### 39. Simular estados

Script:

```text
simulate-health-states.ps1
```

Cenários:

- aplicação saudável;
- dependência obrigatória indisponível;
- dependência opcional indisponível;
- configuração inválida;
- startup incompleto;
- readiness recuperada;
- liveness estável.

Registre somente outputs sanitizados.

---

### 40. Validar exposure por profile

Script:

```text
validate-actuator-exposure.ps1
```

Para cada profile:

```text
local;

container;

kubernetes;

production-like.
```

Compare:

- endpoints incluídos;
- endpoints excluídos;
- health details;
- management port;
- security policy;
- probes.

O script falha quando encontra:

```text
include = *.
```

---

### 41. Escanear output

Script:

```text
scan-actuator-output.ps1
```

Procure:

- password;
- token;
- Authorization;
- Cookie;
- JDBC URL com credencial;
- private key;
- username;
- hostname proibido;
- command-line arguments;
- environment completo;
- stack trace;
- dados pessoais.

O scanner deve avaliar:

- health;
- info;
- respostas de erro;
- endpoints protegidos;
- evidence.

---

### 42. Criar matriz de testes

Arquivo:

```text
ACTUATOR_TEST_MATRIX.md
```

Cenários:

- dependency presente;
- exposure mínima;
- wildcard proibido;
- health público;
- info sanitizado;
- env bloqueado;
- configprops bloqueado;
- heapdump bloqueado;
- shutdown desabilitado;
- liveness `UP`;
- readiness `DOWN`;
- readiness recuperada;
- dependency opcional;
- build info;
- Git info;
- release consistency;
- role correta;
- role incorreta;
- detail autorizado;
- detail não autorizado;
- no Secret;
- profile isolation;
- management port;
- failure response sanitizada.

---

### 43. Criar troubleshooting

Arquivo:

```text
ACTUATOR_TROUBLESHOOTING.md
```

Inclua:

- endpoint retorna 404;
- exposure ausente;
- endpoint disponível indevidamente;
- health sempre `DOWN`;
- health sempre `UP`;
- liveness inclui banco;
- readiness não inclui dependência obrigatória;
- details vazam dados;
- info sem build metadata;
- Git commit `unknown`;
- `/info` diverge de `/internal/release`;
- management port incorreta;
- probes apontam para porta errada;
- role não autoriza;
- shutdown habilitado;
- duas security chains conflitam;
- health check gera carga;
- custom indicator não aparece.

---

### 44. Criar failure policy

Arquivo:

```text
actuator-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  healthIndicatorException:
    endpointStatus:
      DOWN

    details:
      sanitized

  missingBuildInfo:
    deploymentProfile:
      blockStartupOrReadiness

  releaseIdentityMismatch:
    action:
      blockApproval

  managementSecurityFailure:
    action:
      blockDeployment

  sensitiveOutputDetected:
    action:
      blockRelease
```

O comportamento precisa ser definido antes do incidente.

---

### 45. Coletar evidence

Script:

```text
collect-actuator-evidence.ps1
```

Arquivo:

```text
actuator-evidence.json.
```

Campos permitidos:

- lesson;
- application;
- environment;
- base path;
- exposed endpoints;
- forbidden endpoints status;
- health status;
- liveness status;
- readiness status;
- info status;
- build info status;
- Git info status;
- security status;
- sensitive scan status;
- tests status;
- timestamp.

Não inclua:

- body completo de env;
- configprops;
- heapdump;
- threaddump;
- credentials;
- hostnames corporativos;
- logs completos.

---

### 46. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\actuator\validate-actuator-dependency.ps1

.\scripts\observability\actuator\validate-actuator-exposure.ps1

.\scripts\observability\actuator\validate-health-groups.ps1

.\scripts\observability\actuator\validate-info-endpoint.ps1

.\scripts\observability\actuator\validate-actuator-security.ps1

.\scripts\observability\actuator\simulate-health-states.ps1

.\scripts\observability\actuator\scan-actuator-output.ps1

.\scripts\observability\actuator\collect-actuator-evidence.ps1

.\scripts\observability\actuator\verify-actuator-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- dependência correta;
- exposure mínima;
- wildcard ausente;
- liveness correta;
- readiness correta;
- indicator seguro;
- info coerente;
- build info;
- Git info;
- security boundary;
- shutdown desabilitado;
- scan aprovado;
- evidence completa;
- Micrometer não aprofundado.

---

## Entendendo o que foi feito

### A aplicação ganhou superfície operacional

O estado passou a ser consultável por contratos conhecidos.

### Exposure ganhou allowlist

Endpoints deixaram de ser publicados por conveniência.

### Health ganhou semântica

Estado geral, liveness e readiness foram separados.

### Dependências ganharam classificação

Obrigatória, opcional e degradável deixaram de ser tratadas da mesma forma.

### Health checks ganharam limites

Timeout, side effects, frequência e conteúdo foram controlados.

### Info ganhou rastreabilidade

Application, version, commit e release passaram a ser comparáveis.

### Segurança ganhou boundary

Rede, autenticação, autorização e conteúdo foram considerados em conjunto.

### Profiles ganharam políticas distintas

Local e produção deixaram de compartilhar exposure indiscriminada.

### Actuator ganhou testes

A superfície operacional passou a ser validada como contrato.

### O módulo ganhou base para métricas

A próxima aula poderá instrumentar medidas sobre uma superfície operacional segura.

---

## Erros comuns importantes

### Expor `*`

Endpoints sensíveis ficam disponíveis.

### Publicar `env`

Configuração e origem de properties podem vazar.

### Habilitar `heapdump`

Memória pode conter credenciais e dados pessoais.

### Colocar banco na liveness

Falha externa reinicia a aplicação.

### Remover banco da readiness quando ele é obrigatório

A instância recebe tráfego sem conseguir atender.

### Health check pesado

A própria observabilidade cria carga.

### Exibir detalhes publicamente

Dependências internas são reveladas.

### Habilitar shutdown

Lifecycle fica controlável por HTTP.

### Divergir `/info` e `/internal/release`

A identidade da release fica ambígua.

### Antecipar Micrometer

Custom metrics pertencem à aula 559.

---

## Comandos úteis

### Ver dependência

```powershell
mvn `
  --batch-mode `
  dependency:tree `
  "-Dincludes=org.springframework.boot:spring-boot-starter-actuator"
```

### Consultar health

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/health
```

### Consultar liveness

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/health/liveness
```

### Consultar readiness

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/health/readiness
```

### Consultar info

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/info
```

---

## Exercício guiado

### Parte 1 — Dependency

Adicione e valide o starter.

### Parte 2 — Exposure

Publique somente health e info.

### Parte 3 — Health

Diferencie geral, liveness e readiness.

### Parte 4 — Dependencies

Classifique obrigatórias e opcionais.

### Parte 5 — Indicator

Crie health check rápido e seguro.

### Parte 6 — Info

Publique build, Git e release.

### Parte 7 — Security

Proteja endpoints sensíveis.

### Parte 8 — Profiles

Compare local e production-like.

### Parte 9 — Tests

Valide exposure, health, info e acesso.

### Parte 10 — Evidence

Simule, escaneie e aprove.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 557 e ponte para a aula 559 foram preservadas;
- Actuator, endpoint operacional, exposure, health, liveness, readiness, indicator, group e info contributor foram definidos;
- dependência do Actuator foi adicionada sem versão divergente;
- base path foi registrado;
- exposure usa allowlist;
- wildcard é proibido;
- health e info formam a baseline;
- env, configprops, beans, mappings, threaddump, heapdump e shutdown são bloqueados por padrão;
- política por ambiente foi criada;
- probes foram habilitadas;
- detalhes de health variam por ambiente e autorização;
- liveness não depende de serviços externos;
- readiness inclui somente dependências obrigatórias;
- dependências opcionais permitem degradação quando definida;
- classificação de dependências foi criada;
- health groups foram configurados;
- properties tipadas e validadas foram criadas;
- custom health indicator possui timeout;
- custom health indicator não possui side effect;
- detalhes do indicator são sanitizados;
- health check não registra credentials;
- checks caros e cascatas foram evitados;
- contrato de health foi criado;
- info contributor foi criado;
- build info foi gerada;
- Git info foi gerada;
- `/actuator/info` e `/internal/release` são consistentes;
- info não expõe environment dump, username, token ou command-line args;
- endpoints sensíveis foram analisados;
- shutdown permanece desabilitado;
- security boundary foi definido;
- health e info sanitizados podem ser públicos conforme política;
- endpoints protegidos exigem autorização;
- management port separada foi analisada;
- policy class foi criada;
- logs de acesso não geram ruído de probes;
- exposure possui contract test;
- health possui contract test;
- liveness e readiness possuem testes semânticos;
- info possui teste de consistência;
- segurança possui testes;
- indicator possui testes de UP, DOWN, timeout, exception e disabled;
- simulação de estados foi criada;
- profiles foram comparados;
- output foi escaneado;
- test matrix e troubleshooting foram criados;
- failure policy foi criada;
- evidence é sanitizada;
- nenhum Secret real foi utilizado;
- custom metrics e Micrometer não foram aprofundados;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/actuator `
  scripts/observability/actuator `
  docs/observability/actuator `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|BEGIN PRIVATE KEY|cookie"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): configurar Spring Boot Actuator"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- heapdump;
- threaddump;
- output de env;
- configprops completo;
- credentials;
- logs completos;
- samples temporários;
- custom metrics da aula 559;
- configuração de Prometheus.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a `orders-api` ganhou uma superfície operacional controlada com Spring Boot Actuator.

Você configurou:

```text
/actuator/health;

/actuator/health/liveness;

/actuator/health/readiness;

/actuator/info.
```

Você comprovou que exposure precisa usar allowlist; health geral não substitui liveness e readiness; dependências externas não pertencem à liveness; readiness representa capacidade mínima de atendimento; health indicators precisam ser rápidos, read-only e sanitizados; detalhes de componentes não devem ser públicos por padrão; build e Git metadata ajudam a rastrear release; `/info` e `/internal/release` precisam concordar; endpoints como env, configprops, heapdump e shutdown possuem riscos importantes; e a superfície de management precisa combinar rede, autenticação, autorização e conteúdo seguro.

A próxima aula será:

```text
559 - M18.04 - Micrometer
```

Nela, você irá criar métricas customizadas com counters, timers, gauges e tags controladas, conectando comportamento de negócio e operação a séries temporais.

Nenhuma implementação completa de métricas customizadas, registries, Prometheus ou dashboards foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei e validei o Actuator.
- [ ] Configurei exposure mínima.
- [ ] Diferenciei health, liveness e readiness.
- [ ] Classifiquei dependências.
- [ ] Criei health indicator seguro.
- [ ] Publiquei info, build e Git metadata.
- [ ] Protegi endpoints sensíveis.
- [ ] Testei contratos e coletei evidence.

---

## Troubleshooting adicional

### `/actuator/health` retorna 404

Revise dependência, base path e exposure.

### `/actuator/info` está vazio

Revise contributors, build info e `management.info`.

### Liveness fica `DOWN` quando o banco falha

Remova o banco do grupo de liveness.

### Readiness permanece `UP` sem banco obrigatório

Inclua o indicator correto no grupo.

### Details aparecem publicamente

Revise `show-details`, security e profile ativo.

### `env` está disponível

Corrija a allowlist e teste profiles.

### Git commit aparece `unknown`

Revise geração do `git.properties` no build.

### `/info` diverge de `/internal/release`

Unifique a origem das properties.

### Probes falham em Kubernetes

Revise porta, path, timeout e management server.

### Métricas customizadas começaram a ser criadas

Preserve esse conteúdo para a aula 559.

---

## Perguntas de revisão

1. O que é Actuator?
2. O que é exposure?
3. Por que evitar wildcard?
4. O que é health?
5. O que é liveness?
6. O que é readiness?
7. O banco deve entrar na liveness?
8. Quando entra na readiness?
9. O que é health indicator?
10. Por que health check precisa ser rápido?
11. O que é health group?
12. O que publicar em info?
13. Para que serve build info?
14. Para que serve Git info?
15. Por que proteger env?
16. Qual o risco do heapdump?
17. Por que shutdown fica desabilitado?
18. Como testar a exposure?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Superfície operacional do Spring Boot.
2. Endpoints publicados.
3. Evitar exposição acidental.
4. Estado agregado.
5. Processo precisa reiniciar?
6. Pode receber tráfego?
7. Não.
8. Quando é obrigatória.
9. Componente que contribui para health.
10. Evitar carga e cascata.
11. Agrupamento por finalidade.
12. Identidade operacional segura.
13. Version e build time.
14. Commit e origem.
15. Pode revelar configuração.
16. Pode conter dados sensíveis.
17. Lifecycle pertence à plataforma.
18. Contract tests por profile.
19. Métricas customizadas.
20. Micrometer.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 558 - M18.03 - Actuator

- Continuei após Correlation ID trace ID.
- Adicionei e validei o Spring Boot Actuator.
- Defini `/actuator` como base path operacional.
- Configurei exposure mínima com health e info.
- Proibi wildcard de endpoints.
- Analisei riscos de env, configprops, beans, mappings, threaddump, heapdump e shutdown.
- Criei política de exposure por ambiente.
- Habilitei liveness e readiness probes.
- Diferenciei health geral, liveness e readiness.
- Classifiquei dependências obrigatórias, opcionais e degradáveis.
- Mantive dependências externas fora da liveness.
- Criei health groups explícitos.
- Criei properties tipadas para health.
- Implementei health indicator rápido, read-only e sanitizado.
- Evitei checks caros e efeitos colaterais.
- Configurei info da aplicação.
- Gereei build info e Git info.
- Mantive `/actuator/info` consistente com `/internal/release`.
- Mantive shutdown desabilitado.
- Defini security boundary para endpoints públicos, protegidos e proibidos.
- Analisei porta de management separada.
- Criei testes de exposure, health, probes, info, security e indicator.
- Simulei estados de disponibilidade.
- Escaneei outputs do Actuator.
- Coletei evidence sanitizada.
- Não antecipei métricas customizadas ou Prometheus.
- Próxima aula: Micrometer.
```

---

## Referência técnica curta

- Spring Boot Actuator.
- Actuator Web Endpoints.
- Health Indicators.
- Application Availability.
- Liveness and Readiness Probes.
- Info Contributors.
- Build Info.
- Git Info.
- Actuator Security.
- Operational Endpoint Testing.

Regra final:

```text
o Actuator precisa oferecer uma superfície operacional mínima, segura e testável: health e info formam a exposure padrão, wildcard é proibido e endpoints como env, configprops, heapdump e shutdown permanecem bloqueados; health geral, liveness e readiness possuem finalidades diferentes, dependências externas não entram na liveness e somente dependências obrigatórias compõem readiness; health indicators são rápidos, read-only, possuem timeout, não expõem Secrets e não criam carga excessiva; info publica application, environment, release, build e Git metadata a partir de fontes coerentes com o endpoint interno de release; detalhes variam por ambiente e autorização, a management surface combina rede, autenticação, autorização e allowlist, e contract tests validam exposure, estados, conteúdo e segurança; métricas customizadas, Micrometer e Prometheus ficam reservados para a aula 559.
```
