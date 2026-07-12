# 398 - M14.43 - Health readiness liveness

## Apresentação da aula

Na aula 397, você adicionou uma interface operacional inicial com Spring Boot Actuator.

A aplicação passou a oferecer:

```text
/actuator/health;

/actuator/info;

/actuator/metrics.
```

A configuração local ficou conservadora:

```text
API de negócio:
porta 8081.

management:
porta 8082.

bind do management:
127.0.0.1.

endpoints expostos:
health, info e metrics.

acesso máximo:
read-only.

health:
sem componentes e sem detalhes.
```

Aquela aula respondeu:

```text
como expor sinais operacionais básicos
sem transformar Actuator
em uma superfície aberta e sensível?
```

Porém, um único estado geral de health não responde todas as decisões operacionais.

Considere três situações.

Primeira:

```text
a aplicação terminou o startup;
o processo funciona;
a instância pode receber tráfego.
```

Segunda:

```text
o processo funciona;
o ApplicationContext está íntegro;
mas a instância está temporariamente
incapaz de atender novas requests.
```

Terceira:

```text
o estado interno ficou irrecuperável;
continuar executando não resolverá;
a instância deveria ser reiniciada.
```

Usar apenas:

```text
UP;
DOWN.
```

para todas essas situações mistura decisões diferentes.

A pergunta central desta aula será:

```text
quando a plataforma deve reiniciar a aplicação
e quando deve apenas parar de enviar tráfego
para uma instância temporariamente indisponível?
```

A solução utilizará:

```text
ApplicationAvailability;

LivenessState;

ReadinessState;

AvailabilityChangeEvent;

health groups;

liveness probe;

readiness probe;

paths adicionais na porta principal.
```

As duas perguntas fundamentais serão:

```text
liveness:
o processo consegue continuar funcionando
ou precisa ser reiniciado?

readiness:
a instância pode receber tráfego agora?
```

Na baseline:

```text
liveness CORRECT:
a aplicação está internamente funcional.

liveness BROKEN:
a aplicação não consegue se recuperar sozinha.

readiness ACCEPTING_TRAFFIC:
pode receber tráfego.

readiness REFUSING_TRAFFIC:
deve permanecer ativa,
mas não deve receber novas requests.
```

O Spring Boot gerencia esses estados durante o ciclo de vida.

No startup:

```text
antes do contexto estar pronto:
liveness BROKEN;
readiness REFUSING_TRAFFIC.

contexto iniciado:
liveness CORRECT;
readiness ainda REFUSING_TRAFFIC.

startup concluído:
readiness ACCEPTING_TRAFFIC.
```

No shutdown gracioso, readiness muda para recusar tráfego antes que a aplicação termine.

Com Actuator, esses estados podem ser expostos como grupos de health:

```text
/actuator/health/liveness;

/actuator/health/readiness.
```

Como a aula 397 colocou Actuator em uma porta de gerenciamento separada, também serão disponibilizados paths na porta principal:

```text
/livez;

/readyz.
```

Essa decisão é importante.

Uma porta de management pode estar saudável enquanto a porta principal está incapaz de aceitar conexões.

Consultar probes também na porta do servidor principal reduz esse ponto cego.

A baseline configurará explicitamente:

```text
liveness:
somente livenessState.

readiness:
somente readinessState.
```

Banco, Redis, SMTP e serviços externos não entrarão automaticamente nos dois grupos.

Especialmente em liveness:

```text
dependência externa indisponível
não deve tornar a aplicação BROKEN.
```

Se o PostgreSQL cair e todas as instâncias publicarem liveness `DOWN`, uma plataforma pode reiniciar todas ao mesmo tempo.

Os restarts não recuperam o banco.

Eles ainda aumentam carga, reconexões e instabilidade.

Readiness permite uma decisão mais contextual.

Uma dependência pode ou não fazer parte da prontidão, conforme:

- ela é obrigatória para todas as requests?
- existe fallback?
- a falha é global ou apenas daquela instância?
- retirar todas as instâncias do tráfego melhora a situação?
- o upstream consegue lidar com erros controlados?

O Spring Boot não inclui automaticamente outros health indicators no grupo de readiness. A decisão é responsabilidade da aplicação.

Nesta aula, você não adicionará banco ou Redis à readiness.

Primeiro dominará os estados de disponibilidade.

Para tornar a diferença observável localmente, será criado um recurso estritamente de laboratório:

```text
availability-lab.
```

Uma property permitirá iniciar a aplicação forçando um estado:

```text
NONE;

REFUSING_TRAFFIC;

BROKEN.
```

Exemplos:

```powershell
$env:AVAILABILITY_LAB_FORCED_STATE =
  "REFUSING_TRAFFIC"
```

Resultado:

```text
/livez:
200 UP.

/readyz:
503 OUT_OF_SERVICE.
```

Com:

```powershell
$env:AVAILABILITY_LAB_FORCED_STATE =
  "BROKEN"
```

Resultado:

```text
/livez:
503 DOWN.
```

Em execução local, nenhuma plataforma reiniciará automaticamente o processo.

O laboratório apenas mostrará o sinal que um orquestrador utilizaria.

A próxima aula será:

```text
399 - M14.44 - Dockerizando API Spring
```

Por isso, esta aula não criará:

- Dockerfile;
- imagem OCI;
- container da aplicação;
- Kubernetes Deployment;
- `livenessProbe` YAML;
- `readinessProbe` YAML;
- `startupProbe`;
- Helm;
- Docker Compose final;
- orchestrator;
- autoscaling.

Os paths ficarão prontos para essas etapas, mas o empacotamento não será antecipado.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
394:
Testes de service em Spring.

395:
Testes de integração Spring com Testcontainers.

396:
Testes de contrato introdução.

397:
Observabilidade inicial com Actuator.

398:
Health readiness/liveness.

399:
Dockerizando API Spring.

400:
Compose API PostgreSQL Redis.
```

A aula 397 respondeu:

```text
como expor health, info e metrics
com superfície mínima?
```

A aula 398 responderá:

```text
como separar estado interno irrecuperável
de capacidade temporária
para receber tráfego?
```

Nesta aula:

```text
ApplicationAvailability:
sim.

LivenessState:
sim.

ReadinessState:
sim.

AvailabilityChangeEvent:
sim.

health groups:
sim.

liveness endpoint:
sim.

readiness endpoint:
sim.

livez:
sim.

readyz:
sim.

lab de estados:
sim.

banco na liveness:
não.

Redis na liveness:
não.

dependências na readiness:
não nesta baseline.

HealthIndicator customizado:
não.

Docker:
não.

Kubernetes:
não.
```

A regra central será:

```text
liveness decide restart;

readiness decide roteamento;

uma dependência externa
não deve causar restart em massa.
```

---

## Objetivo prático

Ao final da aula, a aplicação deverá oferecer:

Na porta de management:

```text
GET http://127.0.0.1:8082/actuator/health/liveness

GET http://127.0.0.1:8082/actuator/health/readiness
```

Na porta principal:

```text
GET http://localhost:8081/livez

GET http://localhost:8081/readyz
```

Com estado normal:

```text
livez:
200.

readyz:
200.
```

Com readiness forçada:

```text
livez:
200.

readyz:
503.
```

Com liveness forçada:

```text
livez:
503.
```

Você irá:

1. habilitar probes explicitamente;
2. configurar paths adicionais;
3. declarar os grupos de liveness e readiness;
4. manter detalhes ocultos;
5. consultar `ApplicationAvailability`;
6. registrar transições com logs;
7. criar properties exclusivas do laboratório;
8. publicar estados forçados somente no profile local;
9. testar `ACCEPTING_TRAFFIC`;
10. testar `REFUSING_TRAFFIC`;
11. testar `BROKEN`;
12. comparar health global e probes;
13. commitar.

Estrutura esperada:

```text
src/main/java/br/com/formacao/backend
├── config
│   └── availability
│       └── AvailabilityLabProperties.java
└── observability
    └── availability
        ├── ApplicationAvailabilityLogListener.java
        └── AvailabilityLabStatePublisher.java
```

Configuração:

```text
src/main/resources
├── application-observability-local.yaml
└── application-availability-lab.yaml
```

Não será criado um controller de negócio para health.

Os endpoints continuam pertencendo ao Actuator.

---

## Conceito essencial

### Availability não é apenas health

Health reúne contribuições operacionais.

Availability representa se a instância está:

```text
viva;

pronta para tráfego.
```

Spring Boot mantém esses estados em memória e publica eventos quando eles mudam.

O Actuator converte os estados em health indicators e grupos HTTP.

---

### ApplicationAvailability

A interface:

```java
ApplicationAvailability
```

permite consultar o estado atual.

Exemplo:

```java
LivenessState liveness =
        availability
                .getLivenessState();

ReadinessState readiness =
        availability
                .getReadinessState();
```

Ela também permite consultar o último evento de mudança.

A interface é read-only.

Para alterar um estado, a aplicação publica um `AvailabilityChangeEvent`.

---

### LivenessState

Possui dois estados principais:

```text
CORRECT;

BROKEN.
```

`CORRECT` significa:

```text
o estado interno permite
que a aplicação funcione corretamente.
```

`BROKEN` significa:

```text
a aplicação não consegue
se recuperar por conta própria.
```

A ação esperada da infraestrutura é reiniciar a instância.

Exemplos possíveis de problema interno irrecuperável:

- corrupção crítica de estado local;
- executor interno definitivamente inutilizado;
- invariantes internas quebradas;
- componente obrigatório local sem recuperação;
- situação em que reiniciar realmente restaura o processo.

Não use liveness para qualquer exception de negócio.

---

### ReadinessState

Possui:

```text
ACCEPTING_TRAFFIC;

REFUSING_TRAFFIC.
```

`ACCEPTING_TRAFFIC`:

```text
a instância aceita receber requests.
```

`REFUSING_TRAFFIC`:

```text
o processo continua ativo,
mas o roteador deve retirar
temporariamente a instância.
```

Possíveis motivos:

- startup ainda não terminou;
- shutdown gracioso começou;
- capacidade temporariamente esgotada;
- manutenção local;
- recurso obrigatório da instância está indisponível;
- aplicação decidiu drenar tráfego.

Readiness não exige reiniciar o processo.

---

### Reiniciar versus retirar do tráfego

Imagine dez instâncias e um banco compartilhado indisponível.

Se o banco estiver na liveness:

```text
dez instâncias ficam DOWN;

orquestrador reinicia todas;

todas reconectam juntas;

banco continua indisponível;

novos restarts acontecem.
```

Isso pode produzir falha em cascata.

Se a decisão for readiness:

```text
instâncias podem ser retiradas do tráfego;

processos permanecem ativos;

nenhum restart inútil acontece.
```

Porém, se todas ficarem unready, o serviço pode parar de aceitar conexões.

A política precisa avaliar o comportamento do sistema completo.

---

### Liveness não depende de sistemas externos

A orientação da baseline é:

```text
não incluir db;

não incluir Redis;

não incluir SMTP;

não incluir APIs externas.
```

Uma falha externa não é prova de que o processo Java está irrecuperável.

Reiniciar não corrige a dependência.

---

### Readiness e dependências externas

Readiness pode considerar dependências, mas a decisão não é automática.

Perguntas:

```text
a API consegue responder algo útil sem o banco?

todas as rotas dependem do Redis?

o cache trabalha com fail-open?

e-mail indisponível deve tirar
toda a API do tráfego?

a falha afeta somente esta instância
ou todas?
```

Nesta aplicação:

```text
SMTP:
não entra na readiness;
a maior parte da API continua útil.

Redis de rate limit:
baseline fail-open;
não entra na readiness.

Redis de cache:
PostgreSQL continua fonte;
não entra na readiness inicial.
```

O PostgreSQL é mais crítico para os casos de uso principais, mas ainda não será adicionado à readiness. Essa decisão exigiria analisar o comportamento do serviço e do roteamento em todas as instâncias.

---

### Health groups

Um health group seleciona indicadores para um propósito.

Exemplo:

```yaml
management:
  endpoint:
    health:
      group:
        liveness:
          include:
            - "livenessState"

        readiness:
          include:
            - "readinessState"
```

URLs:

```text
/actuator/health/liveness;

/actuator/health/readiness.
```

A resposta permanece reduzida porque detalhes e componentes continuam ocultos.

---

### Probes automáticas

Spring Boot oferece os indicadores:

```text
livenessState;

readinessState.
```

Eles podem ser habilitados ou desabilitados com:

```text
management.endpoint.health.probes.enabled.
```

A baseline define explicitamente:

```yaml
probes:
  enabled: true
```

Assim, o comportamento não depende de detecção de plataforma.

---

### Paths adicionais

Com management em porta separada, probes apenas na porta 8082 podem produzir um falso positivo:

```text
management responde;

servidor principal não aceita conexões.
```

A property:

```yaml
management:
  endpoint:
    health:
      probes:
        add-additional-paths: true
```

adiciona:

```text
/livez;

/readyz.
```

na porta principal.

Isso verifica também a infraestrutura web principal.

---

### Status HTTP

Para liveness:

```text
CORRECT:
UP;
HTTP 200.

BROKEN:
DOWN;
HTTP 503.
```

Para readiness:

```text
ACCEPTING_TRAFFIC:
UP;
HTTP 200.

REFUSING_TRAFFIC:
OUT_OF_SERVICE;
HTTP 503.
```

O body exato pode variar conforme o mapping interno, mas a decisão principal é o status HTTP e o status de health.

---

### AvailabilityChangeEvent

Para publicar:

```java
AvailabilityChangeEvent.publish(
        eventPublisher,
        source,
        ReadinessState.REFUSING_TRAFFIC
);
```

Ou:

```java
AvailabilityChangeEvent.publish(
        eventPublisher,
        source,
        LivenessState.BROKEN
);
```

A publicação deve representar uma decisão real.

Não use eventos de disponibilidade como um interruptor genérico em código de negócio.

---

### Ciclo de vida

Durante startup, Spring Boot altera os estados conforme o progresso.

De forma simplificada:

```text
início:
BROKEN;
REFUSING_TRAFFIC.

contexto atualizado:
CORRECT;
REFUSING_TRAFFIC.

application runners concluídos:
CORRECT;
ACCEPTING_TRAFFIC.
```

Durante shutdown:

```text
readiness:
REFUSING_TRAFFIC.

servidor:
deixa de aceitar novas requests.

processo:
encerra.
```

Isso permite drenagem quando a infraestrutura utiliza os sinais corretamente.

---

### Startup demorado

Readiness permanece recusando tráfego até a aplicação estar pronta.

Uma plataforma não deve enviar tráfego antes desse ponto.

Se o startup levar muito tempo, alguns orquestradores também oferecem:

```text
startup probe.
```

Ela evita que liveness mate a aplicação antes de o startup terminar.

Startup probe será estudada quando a formação entrar em Kubernetes.

---

### Estado em memória

Availability state existe no processo atual.

Ele não é:

- persistido no PostgreSQL;
- compartilhado no Redis;
- distribuído entre instâncias.

Cada instância publica seu próprio estado.

Isso é correto porque readiness e liveness são decisões por instância.

---

### Logs de transição

Transições são eventos operacionais importantes.

A baseline registrará:

```text
event:
application_availability.changed.

stateType;

state;

sourceType.
```

Não registre detalhes sensíveis do source.

Um log por transição é suficiente.

---

### Laboratório forçado

O laboratório utilizará:

```text
NONE;

REFUSING_TRAFFIC;

BROKEN.
```

`NONE`:

```text
Spring Boot controla os estados normalmente.
```

`REFUSING_TRAFFIC`:

```text
quando Boot publicar ACCEPTING_TRAFFIC,
o componente publica REFUSING_TRAFFIC.
```

`BROKEN`:

```text
quando Boot publicar CORRECT,
o componente publica BROKEN.
```

O componente existe somente no profile:

```text
availability-lab.
```

Nunca use essa property como mecanismo de produção.

---

## Mão na massa guiada

### 1. Atualizar a configuração do Actuator

No arquivo:

```text
application-observability-local.yaml
```

Mantenha a configuração da aula 397 e acrescente:

```yaml
management:
  endpoint:
    health:
      show-details: "never"
      show-components: "never"

      probes:
        enabled: true
        add-additional-paths: true

      group:
        liveness:
          include:
            - "livenessState"

        readiness:
          include:
            - "readinessState"
```

A exposição continua:

```text
health;
info;
metrics.
```

Os grupos são subpaths de health.

Não é necessário adicionar `liveness` e `readiness` à lista de exposure.

---

### 2. Criar o profile availability-lab

Arquivo:

```text
src/main/resources/application-availability-lab.yaml
```

Conteúdo:

```yaml
app:
  availability:
    lab:
      forced-state:
        "${AVAILABILITY_LAB_FORCED_STATE:NONE}"
```

No profile group local, adicione:

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
        - observability-local
        - availability-lab
```

Preserve os fragments anteriores.

---

### 3. Criar properties do laboratório

Arquivo:

```text
AvailabilityLabProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.availability;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
        "app.availability.lab"
)
public record AvailabilityLabProperties(
        ForcedState forcedState
) {

    public AvailabilityLabProperties {
        if (forcedState == null) {
            forcedState = ForcedState.NONE;
        }
    }

    public enum ForcedState {
        NONE,
        REFUSING_TRAFFIC,
        BROKEN
    }
}
```

O projeto já utiliza `@ConfigurationPropertiesScan`.

Não registre o record novamente.

---

### 4. Criar listener de logs

Arquivo:

```text
ApplicationAvailabilityLogListener.java
```

Conteúdo:

```java
package br.com.formacao.backend.observability.availability;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ApplicationAvailabilityLogListener {

    private static final Logger log =
            LoggerFactory.getLogger(
                    ApplicationAvailabilityLogListener.class
            );

    @EventListener
    public void onAvailabilityChange(
            AvailabilityChangeEvent<?> event
    ) {

        Object source =
                event.getSource();

        log.atInfo()
                .addKeyValue(
                        "event",
                        "application_availability.changed"
                )
                .addKeyValue(
                        "stateType",
                        event
                            .getState()
                            .getClass()
                            .getSimpleName()
                )
                .addKeyValue(
                        "state",
                        event.getState()
                )
                .addKeyValue(
                        "sourceType",
                        source
                            .getClass()
                            .getSimpleName()
                )
                .log(
                        "Application availability changed"
                );
    }
}
```

O listener apenas observa.

Ele não muda estado.

---

### 5. Criar o publisher de laboratório

Arquivo:

```text
AvailabilityLabStatePublisher.java
```

Conteúdo:

```java
package br.com.formacao.backend.observability.availability;

import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.LivenessState;
import org.springframework.boot.availability.ReadinessState;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import br.com.formacao.backend.config.availability.AvailabilityLabProperties;

@Component
@Profile(
        "availability-lab"
)
public class AvailabilityLabStatePublisher {

    private final ApplicationEventPublisher
            eventPublisher;

    private final AvailabilityLabProperties
            properties;

    public AvailabilityLabStatePublisher(
            ApplicationEventPublisher
                    eventPublisher,
            AvailabilityLabProperties
                    properties
    ) {
        this.eventPublisher =
                eventPublisher;
        this.properties =
                properties;
    }

    @EventListener
    public void onLivenessChange(
            AvailabilityChangeEvent<
                    LivenessState
            > event
    ) {

        if (properties.forcedState()
                != AvailabilityLabProperties
                    .ForcedState.BROKEN) {
            return;
        }

        if (event.getState()
                != LivenessState.CORRECT) {
            return;
        }

        AvailabilityChangeEvent.publish(
                eventPublisher,
                this,
                LivenessState.BROKEN
        );
    }

    @EventListener
    public void onReadinessChange(
            AvailabilityChangeEvent<
                    ReadinessState
            > event
    ) {

        if (properties.forcedState()
                != AvailabilityLabProperties
                    .ForcedState
                    .REFUSING_TRAFFIC) {
            return;
        }

        if (event.getState()
                != ReadinessState
                    .ACCEPTING_TRAFFIC) {
            return;
        }

        AvailabilityChangeEvent.publish(
                eventPublisher,
                this,
                ReadinessState
                    .REFUSING_TRAFFIC
        );
    }
}
```

O listener reage somente ao estado normal publicado pelo Boot.

Quando publica o estado forçado, o segundo evento não entra em loop porque não corresponde ao estado de origem.

---

### 6. Consultar o estado por código

Não é necessário criar endpoint novo.

Para compreender a API, revise o uso conceitual:

```java
@Component
public class AvailabilityInspector {

    private final ApplicationAvailability
            availability;

    public AvailabilityInspector(
            ApplicationAvailability
                    availability
    ) {
        this.availability =
                availability;
    }

    public void inspect() {
        LivenessState liveness =
                availability
                    .getLivenessState();

        ReadinessState readiness =
                availability
                    .getReadinessState();
    }
}
```

Não adicione essa classe se ela não tiver uso real.

Os endpoints do Actuator já expõem o estado necessário.

---

### 7. Iniciar no estado normal

Limpe a variável:

```powershell
Remove-Item `
  Env:AVAILABILITY_LAB_FORCED_STATE `
  -ErrorAction SilentlyContinue
```

Inicie:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Nos logs, observe transições como:

```text
LivenessState:
CORRECT.

ReadinessState:
ACCEPTING_TRAFFIC.
```

A ordem pode incluir eventos anteriores do ciclo de vida.

---

### 8. Consultar liveness na porta de management

```powershell
$liveness = Invoke-WebRequest `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/health/liveness"

$liveness.StatusCode
$liveness.Content
```

Resultado esperado:

```text
200;
status UP.
```

Sem detalhes internos.

---

### 9. Consultar readiness na porta de management

```powershell
$readiness = Invoke-WebRequest `
  -Method Get `
  -Uri "http://127.0.0.1:8082/actuator/health/readiness"

$readiness.StatusCode
$readiness.Content
```

Resultado esperado depois do startup:

```text
200;
status UP.
```

---

### 10. Consultar paths na porta principal

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"
```

Resultado esperado:

```text
200 para ambos.
```

Confirme que os paths estão na porta de negócio, não em `/actuator`.

---

### 11. Forçar REFUSING_TRAFFIC

Pare a aplicação.

Defina:

```powershell
$env:AVAILABILITY_LAB_FORCED_STATE =
  "REFUSING_TRAFFIC"
```

Inicie novamente.

Consulte:

```powershell
$live = Invoke-WebRequest `
  "http://localhost:8081/livez" `
  -SkipHttpErrorCheck

$ready = Invoke-WebRequest `
  "http://localhost:8081/readyz" `
  -SkipHttpErrorCheck
```

Resultado esperado:

```text
live:
200.

ready:
503.
```

Isso prova:

```text
o processo está vivo;

a instância recusa tráfego.
```

---

### 12. Observar o body de readiness

```powershell
$ready.Content
```

Resultado esperado representa:

```text
OUT_OF_SERVICE
```

ou status equivalente configurado pelo indicador de readiness.

O status HTTP `503` é a decisão operacional mais importante.

Detalhes continuam ocultos.

---

### 13. Forçar BROKEN

Pare a aplicação.

Defina:

```powershell
$env:AVAILABILITY_LAB_FORCED_STATE =
  "BROKEN"
```

Inicie.

Consulte:

```powershell
$live = Invoke-WebRequest `
  "http://localhost:8081/livez" `
  -SkipHttpErrorCheck

$ready = Invoke-WebRequest `
  "http://localhost:8081/readyz" `
  -SkipHttpErrorCheck
```

Resultado esperado:

```text
live:
503.

ready:
pode permanecer 200,
pois os grupos são independentes.
```

Uma plataforma deve considerar a liveness quebrada e reiniciar a instância.

Localmente, o processo continuará até você encerrá-lo.

---

### 14. Restaurar estado normal

Pare a aplicação.

Execute:

```powershell
Remove-Item `
  Env:AVAILABILITY_LAB_FORCED_STATE
```

Inicie novamente.

Confirme:

```text
/livez:
200.

/readyz:
200.
```

Não faça commit com variável local forçada.

---

### 15. Comparar health global

Com estado normal:

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

O health global pode incluir outros indicators internamente.

Os grupos:

```text
liveness;

readiness.
```

possuem seleção explícita.

Por isso, não presuma que os três endpoints sempre terão o mesmo resultado.

---

### 16. Experimentar falha do Redis

Com estado normal, pare Redis:

```powershell
docker stop formacao-java-redis
```

Consulte:

```powershell
/global health;

/livez;

/readyz.
```

Quando o Redis health indicator estiver ativo:

```text
global health:
pode ficar DOWN.

livez:
continua UP.

readyz:
continua UP na baseline.
```

Isso demonstra que uma dependência externa não foi incluída automaticamente nos probes.

Reinicie:

```powershell
docker start formacao-java-redis
```

A aplicação possui políticas próprias de cache e rate limit para falha do Redis.

---

### 17. Experimentar falha do PostgreSQL

Faça o teste apenas no ambiente local controlado.

Pare o PostgreSQL usado pelo projeto.

Consulte os três endpoints.

O health global pode mudar.

Liveness e readiness permanecem baseados somente nos availability states.

Reinicie o banco depois.

Não conclua automaticamente que readiness deve ignorar PostgreSQL em production. A baseline serve para tornar a decisão explícita.

---

### 18. Revisar decisão de dependências

Preencha uma tabela no diário ou nas anotações:

```text
Componente | Liveness | Readiness | Motivo

PostgreSQL | não | decidir depois | fonte principal.

Redis cache | não | não inicial | possui fallback para banco.

Redis rate limit | não | não inicial | fail-open.

SMTP | não | não | feature isolada.

filesystem upload | não | avaliar por feature | armazenamento local.
```

Não implemente a coluna “decidir depois” nesta aula.

---

### 19. Observar shutdown

Com estado normal, encerre a aplicação com:

```text
Ctrl + C.
```

Nos logs, procure a transição para:

```text
ReadinessState.REFUSING_TRAFFIC.
```

Dependendo da velocidade do encerramento, a janela para consultar `/readyz` pode ser curta.

O log é a evidência principal do laboratório local.

---

### 20. Revisar exposição

Confirme que continuam expostos somente:

```text
health;

info;

metrics.
```

Os grupos de health não ampliam a allowlist para endpoints como:

- env;
- beans;
- loggers;
- shutdown.

---

### 21. Não criar health customizado ainda

Não adicione:

```java
HealthIndicator;
ReactiveHealthIndicator;
CompositeHealthContributor.
```

O objetivo desta aula é separar os estados de disponibilidade.

Indicadores customizados precisam de:

- timeout;
- cache de resultado;
- custo controlado;
- semântica de falha;
- escolha de grupo;
- impacto operacional.

A baseline já possui material suficiente.

---

## Entendendo o que foi feito

### Health foi separado por propósito

O health global continua existindo, mas probes possuem grupos próprios.

### Liveness passou a responder restart

`BROKEN` indica estado interno irrecuperável.

### Readiness passou a responder roteamento

`REFUSING_TRAFFIC` mantém o processo vivo e retira tráfego.

### Dependências externas ficaram fora da liveness

Restart não corrige banco, cache ou SMTP.

### A readiness permaneceu mínima

Somente `readinessState` participa da baseline.

### Probes chegaram à porta principal

`/livez` e `/readyz` também verificam o servidor de negócio.

### O laboratório mostrou estados sem controller

Eventos de disponibilidade alimentaram os health groups do Actuator.

### A evolução ficou preparada

A próxima aula poderá empacotar esses endpoints dentro de uma imagem.

---

## Erros comuns importantes

### Colocar banco na liveness

Uma falha compartilhada pode causar restart em massa.

### Tratar readiness DOWN como pedido de restart

Readiness pede retirada de tráfego, não reinício.

### Usar health global como liveness

O global pode incluir dependências externas.

### Colocar todas as dependências na readiness

Todas as instâncias podem sair do serviço ao mesmo tempo.

### Expor probes somente na porta de management

A porta principal pode estar quebrada enquanto management responde.

### Publicar BROKEN para erro temporário

Liveness deve representar estado irrecuperável.

### Usar o laboratório em produção

A property forçada existe apenas para aprendizado local.

### Criar endpoint manual /health

Actuator já fornece estrutura, grupos e status mapping.

### Mostrar detalhes dos grupos

Os probes precisam de decisão, não inventário da arquitetura.

### Antecipar Kubernetes YAML

A próxima fase de infraestrutura terá contexto próprio.

---

## Comandos úteis

### Estado normal

```powershell
Remove-Item `
  Env:AVAILABILITY_LAB_FORCED_STATE `
  -ErrorAction SilentlyContinue
```

### Forçar readiness

```powershell
$env:AVAILABILITY_LAB_FORCED_STATE =
  "REFUSING_TRAFFIC"
```

### Forçar liveness

```powershell
$env:AVAILABILITY_LAB_FORCED_STATE =
  "BROKEN"
```

### Liveness management

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health/liveness" `
  -SkipHttpErrorCheck
```

### Readiness management

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health/readiness" `
  -SkipHttpErrorCheck
```

### Liveness main port

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez" `
  -SkipHttpErrorCheck
```

### Readiness main port

```powershell
Invoke-WebRequest `
  "http://localhost:8081/readyz" `
  -SkipHttpErrorCheck
```

---

## Exercício guiado

### Parte 1 — Estado normal

Confirme 200 em quatro URLs.

### Parte 2 — Readiness recusando

Force `REFUSING_TRAFFIC`.

Confirme:

```text
livez 200;
readyz 503.
```

### Parte 3 — Liveness quebrada

Force `BROKEN`.

Confirme:

```text
livez 503.
```

### Parte 4 — Dependência externa

Pare Redis.

Compare:

```text
health global;
livez;
readyz.
```

### Parte 5 — Shutdown

Observe o evento de readiness no encerramento.

### Parte 6 — Revisão de política

Classifique PostgreSQL, Redis, SMTP e filesystem.

Não altere os grupos ainda.

### Parte 7 — Registrar decisão

Anote:

```text
probes enabled;

liveness group:
livenessState.

readiness group:
readinessState.

additional paths:
livez e readyz.

liveness:
restart.

readiness:
roteamento.

externos fora da liveness;

dependências fora da readiness inicial;

ApplicationAvailability;

AvailabilityChangeEvent;

listener de transições;

profile availability-lab;

NONE;

REFUSING_TRAFFIC;

BROKEN;

sem Docker;

sem Kubernetes;

sem HealthIndicator customizado.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 397 foi preservada;
- liveness foi definida;
- readiness foi definida;
- restart foi separado de roteamento;
- `ApplicationAvailability` foi explicado;
- `LivenessState` foi explicado;
- `ReadinessState` foi explicado;
- `AvailabilityChangeEvent` foi explicado;
- ciclo de vida do startup foi explicado;
- ciclo de vida do shutdown foi explicado;
- probes foram habilitadas;
- grupo liveness foi configurado;
- grupo readiness foi configurado;
- liveness inclui somente `livenessState`;
- readiness inclui somente `readinessState`;
- banco não foi colocado em liveness;
- Redis não foi colocado em liveness;
- SMTP não foi colocado em liveness;
- dependências externas não foram incluídas na readiness inicial;
- decisão sobre externos foi documentada;
- `/actuator/health/liveness` foi disponibilizado;
- `/actuator/health/readiness` foi disponibilizado;
- additional paths foram habilitados;
- `/livez` foi disponibilizado;
- `/readyz` foi disponibilizado;
- porta de management foi preservada;
- porta principal foi preservada;
- detalhes continuaram ocultos;
- componentes continuaram ocultos;
- allowlist do Actuator não foi ampliada;
- properties de laboratório foram criadas;
- enum NONE foi criado;
- enum REFUSING_TRAFFIC foi criado;
- enum BROKEN foi criado;
- profile `availability-lab` foi criado;
- publisher existe somente no profile de laboratório;
- listener de logs foi criado;
- transições são registradas;
- conteúdo sensível não é logado;
- estado normal foi testado;
- liveness 200 foi testada;
- readiness 200 foi testada;
- readiness 503 foi testada;
- liveness 503 foi testada;
- diferença entre os estados foi comprovada;
- variável forçada foi restaurada;
- health global foi comparado;
- falha do Redis foi experimentada;
- impacto do PostgreSQL foi discutido;
- shutdown foi observado;
- HealthIndicator customizado não foi criado;
- endpoint manual de health não foi criado;
- Dockerfile não foi antecipado;
- Docker Compose não foi antecipado;
- Kubernetes não foi antecipado;
- startupProbe não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 399 está correta.

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
git commit -m "feat(m14): separar health readiness e liveness"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- logs;
- responses salvas;
- variáveis de ambiente;
- estado forçado;
- credentials;
- dumps;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o health operacional deixou de ser uma única decisão genérica.

O fluxo ficou:

```text
Spring Boot lifecycle;

AvailabilityChangeEvent;

ApplicationAvailability;

LivenessStateHealthIndicator;

ReadinessStateHealthIndicator;

health groups;

Actuator;

livez;

readyz.
```

Você comprovou:

```text
CORRECT:
liveness UP.

BROKEN:
liveness DOWN.

ACCEPTING_TRAFFIC:
readiness UP.

REFUSING_TRAFFIC:
readiness OUT_OF_SERVICE.
```

A decisão central foi:

```text
liveness informa
se reiniciar pode recuperar a instância;

readiness informa
se a instância deve receber tráfego;

falhas externas não devem
provocar restart em cascata.
```

A próxima aula será:

```text
399 - M14.44 - Dockerizando API Spring
```

Nela, você empacotará a aplicação em uma imagem de container.

A aula tratará:

- build do jar;
- Dockerfile;
- imagem base;
- usuário não root;
- camadas;
- configuração por ambiente;
- portas;
- healthcheck compatível;
- execução do container.

Docker Compose com API, PostgreSQL e Redis ficará para a aula 400.

Nada disso foi implementado antecipadamente aqui.

---

# Material complementar

## Checkpoint final

- [ ] Separei liveness e readiness.
- [ ] Configurei health groups.
- [ ] Habilitei `/livez` e `/readyz`.
- [ ] Testei `REFUSING_TRAFFIC` e `BROKEN`.
- [ ] Mantive dependências externas fora da liveness.

---

## Troubleshooting adicional

### /actuator/health/liveness retorna 404

Confirme:

```text
starter Actuator;
health exposto;
probes enabled;
profile observability-local.
```

### /livez retorna 404

Confirme:

```text
add-additional-paths=true;
porta principal 8081;
management port separada.
```

### Estado forçado não muda

Confirme:

- profile `availability-lab`;
- nome da variável;
- valor do enum;
- properties scan;
- listener registrado;
- restart após mudar a variável.

### Evento entra em loop

O publisher deve reagir somente a:

```text
CORRECT;
ACCEPTING_TRAFFIC.
```

Ele não deve republicar ao receber o estado forçado.

### Readiness fica 200 com Redis parado

Esse é o comportamento da baseline.

O grupo contém apenas `readinessState`.

### Global health fica DOWN, mas livez fica UP

Isso demonstra a separação entre dependência externa e estado interno.

### BROKEN não encerra o processo local

O estado é um sinal.

Sem orquestrador, ninguém reinicia automaticamente a aplicação.

### O shutdown termina rápido demais

A transição pode aparecer somente no log.

A janela HTTP pode ser curta.

---

## Observações para aulas futuras

Ao empacotar e orquestrar a aplicação, será necessário decidir:

- qual porta a plataforma consulta;
- tempos de startup;
- período das probes;
- timeout;
- failure threshold;
- startup probe;
- graceful shutdown;
- tempo de drenagem;
- termination grace period;
- dependências na readiness;
- comportamento quando todas as instâncias ficam unready.

Health customizado pode ser necessário para recursos locais específicos.

Antes de criar um indicator, responda:

```text
qual decisão a falha provoca?

restart?

retirada do tráfego?

somente alerta?

qual é o timeout?

o check pode sobrecarregar a dependência?
```

Essas perguntas evitam health checks que pioram incidentes.

---

## Perguntas de revisão

1. O que liveness responde?
2. O que readiness responde?
3. Quais estados de liveness existem?
4. Quais estados de readiness existem?
5. O que BROKEN recomenda?
6. O que REFUSING_TRAFFIC recomenda?
7. Banco deve entrar na liveness?
8. Redis deve entrar na liveness?
9. Readiness deve incluir toda dependência?
10. O que é `ApplicationAvailability`?
11. Como alterar um estado?
12. Quais são os grupos?
13. Qual URL de liveness no management?
14. Qual URL de readiness no management?
15. Qual path na porta principal representa liveness?
16. Qual path representa readiness?
17. O laboratório existe em production?
18. BROKEN encerra o processo sozinho?
19. Docker foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Se a instância precisa ser reiniciada.
2. Se pode receber tráfego.
3. `CORRECT` e `BROKEN`.
4. `ACCEPTING_TRAFFIC` e `REFUSING_TRAFFIC`.
5. Reiniciar a instância.
6. Retirar temporariamente do tráfego.
7. Não.
8. Não.
9. Não automaticamente.
10. Interface de consulta dos estados.
11. Publicando `AvailabilityChangeEvent`.
12. Liveness e readiness.
13. `/actuator/health/liveness`.
14. `/actuator/health/readiness`.
15. `/livez`.
16. `/readyz`.
17. Não.
18. Não.
19. Não.
20. Dockerizando API Spring.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 398 - M14.43 - Health readiness liveness

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei health global de availability.
- Defini liveness como decisão de restart.
- Defini readiness como decisão de roteamento.
- Conheci `ApplicationAvailability`.
- Conheci `LivenessState`.
- Conheci `ReadinessState`.
- Conheci `AvailabilityChangeEvent`.
- Entendi os estados `CORRECT` e `BROKEN`.
- Entendi `ACCEPTING_TRAFFIC` e `REFUSING_TRAFFIC`.
- Revisei o ciclo de startup.
- Revisei o ciclo de shutdown.
- Habilitei as probes do Actuator.
- Configurei o grupo liveness.
- Configurei o grupo readiness.
- Mantive somente `livenessState` na liveness.
- Mantive somente `readinessState` na readiness.
- Não incluí banco, Redis ou SMTP na liveness.
- Não incluí dependências externas na readiness inicial.
- Habilitei paths adicionais.
- Disponibilizei `/livez`.
- Disponibilizei `/readyz`.
- Mantive `/actuator/health/liveness`.
- Mantive `/actuator/health/readiness`.
- Criei logs de transição de disponibilidade.
- Criei o profile `availability-lab`.
- Criei estados forçados NONE, REFUSING_TRAFFIC e BROKEN.
- Testei liveness 200.
- Testei readiness 200.
- Testei readiness 503.
- Testei liveness 503.
- Comparei probes com health global.
- Observei que falha externa não deve causar restart em massa.
- Não criei HealthIndicator customizado.
- Não antecipei Docker ou Kubernetes.
- Próxima aula: Dockerizando API Spring.
```

---

## Referência técnica curta

- [Spring Boot — Kubernetes Probes](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes)
- [Spring Boot — Application Availability](https://docs.spring.io/spring-boot/reference/features/spring-application.html#features.spring-application.application-availability)
- [Spring Boot — Health Groups](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.health-groups)
- [Spring Boot — ApplicationAvailability API](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/availability/ApplicationAvailability.html)

Regra final:

```text
liveness e readiness precisam representar decisões operacionais diferentes: liveness indica se o estado interno está irrecuperável e justifica restart, enquanto readiness indica se a instância deve receber tráfego; nesta baseline, os grupos do Actuator usam somente livenessState e readinessState, os paths /livez e /readyz também existem na porta principal, AvailabilityChangeEvent controla as transições e dependências externas permanecem fora da liveness para evitar restarts em cascata.
```
