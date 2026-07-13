# 511 - M17.06 - Healthcheck em containers

## Apresentação da aula

Na aula 510, você separou configuração operacional de segredo.

A stack passou a utilizar:

```text
application defaults;

profile container;

env_file;

Compose interpolation;

secret files;

configtree;

binding tipado;

validação de startup.
```

A aplicação agora pode ser construída e iniciada sem colocar token ou senha:

- no Dockerfile;
- na imagem;
- no histórico de build;
- no bloco comum de `environment`;
- no Git;
- nos logs;
- na documentação.

A stack Compose também já possui:

```text
service app;

service kafka;

network backend;

app_data;

kafka_data;

runtime não root;

root filesystem read-only;

tmpfs;

volumes;

limites básicos.
```

Mesmo assim, ainda existe uma diferença importante entre:

```text
container em execução;

processo Java vivo;

aplicação saudável;

aplicação pronta
para receber tráfego.
```

Um container pode aparecer como:

```text
Up.
```

e ainda apresentar problemas:

- Spring Boot não terminou de iniciar;
- porta HTTP ainda não está aceitando conexões;
- contexto ficou preso durante o startup;
- banco essencial está indisponível;
- aplicação recusou tráfego;
- thread crítica travou;
- endpoint retornou erro;
- processo existe, mas não consegue atender.

A pergunta central desta aula será:

```text
como transformar
o estado interno da aplicação

em sinais de saúde
que Docker e Compose
consigam interpretar?
```

A resposta envolverá três conceitos:

```text
startup;

liveness;

readiness.
```

#### Startup

Responde:

```text
a aplicação
já teve tempo suficiente
para inicializar?
```

#### Liveness

Responde:

```text
a instância está viva
ou entrou em um estado
que exige reinicialização?
```

#### Readiness

Responde:

```text
a instância está pronta
para receber novo tráfego
ou novo trabalho?
```

Docker possui um estado único de health por container:

```text
starting;

healthy;

unhealthy.
```

Spring Boot Actuator oferece grupos separados:

```text
/actuator/health/liveness;

/actuator/health/readiness.
```

Também serão expostos no servidor principal:

```text
/livez;

/readyz.
```

Isso evita que um management server separado responda enquanto a porta principal da aplicação está incapaz de atender.

A imagem receberá um healthcheck padrão baseado em:

```text
liveness.
```

O Compose poderá sobrescrever a política da aplicação para utilizar:

```text
readiness.
```

Essa separação produz uma regra útil:

```text
imagem:

possui um default portátil.

ambiente:

define a política operacional.
```

Kafka também receberá um healthcheck.

O `depends_on` da aplicação será alterado de:

```yaml
depends_on:
  - kafka
```

para:

```yaml
depends_on:
  kafka:
    condition: service_healthy
```

Assim, Compose aguardará o healthcheck do broker durante a criação inicial da aplicação.

Esse mecanismo precisa ser compreendido corretamente.

Ele não significa:

- monitoramento contínuo de dependência;
- restart automático da aplicação quando Kafka fica unhealthy;
- garantia de disponibilidade futura;
- substituição de retry;
- substituição de Outbox;
- substituição de observabilidade;
- substituição de alertas.

No projeto, Kafka não será incluído no readiness da aplicação.

Essa decisão é arquitetural.

A criação da ordem de serviço grava:

```text
estado;

Outbox.
```

na mesma transação local.

Se Kafka ficar temporariamente indisponível:

```text
a API ainda pode
aceitar a ordem;

a Outbox preserva
a intenção de publicação;

o publisher tenta depois.
```

Marcar todas as instâncias como unready porque Kafka está fora poderia retirar do tráfego justamente a aplicação capaz de preservar o trabalho local.

O provider externo também não fará parte da liveness nem da readiness.

A entrega é assíncrona e possui:

- retry;
- backoff;
- idempotência;
- quarantine;
- backlog observável.

O banco local, por outro lado, é necessário para aceitar a operação.

Sem o banco:

```text
a API não consegue
confirmar a ordem
nem a Outbox.
```

Por isso, a readiness incluirá:

```text
readinessState;

db.
```

A liveness incluirá somente:

```text
livenessState.
```

Essa política evita falhas em cascata.

A aula também mostrará que:

```text
healthcheck não deve
executar operação de negócio;

healthcheck não deve
criar dado;

healthcheck não deve
publicar mensagem;

healthcheck não deve
depender de segredo externo;

healthcheck precisa
ser rápido e previsível.
```

A imagem atual não possui `curl` ou `wget`.

Instalar uma ferramenta apenas para o healthcheck aumentaria a superfície do runtime.

Nesta aula, será criado um script Bash pequeno usando:

```text
/dev/tcp.
```

O script fará uma requisição HTTP local.

Ele não gravará arquivos.

Ele funcionará com:

- usuário não root;
- root filesystem read-only;
- capabilities removidas;
- `no-new-privileges`.

A próxima aula será:

```text
512 - M17.07 - Release strategy fundamentos
```

Portanto, esta aula não antecipará:

- blue-green;
- canary;
- rolling release;
- feature flags de release;
- progressive delivery;
- rollback de versão;
- traffic splitting;
- estratégia de registry;
- promoção entre ambientes.

O foco será exclusivamente:

```text
saúde;

startup;

liveness;

readiness;

Docker;

Compose;

Actuator.
```

Ao final, você deverá explicar:

```text
por que processo vivo
não significa aplicação pronta;

por que liveness
não deve depender de Kafka;

por que readiness
pode incluir o banco;

como interval,
timeout,
retries
e start_period
trabalham;

por que healthcheck
precisa ser sem efeito colateral;

como Docker registra
healthy e unhealthy;

como Compose espera
service_healthy;

por que unhealthy
não reinicia automaticamente
um container no Compose local;

como testar
falha e recuperação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
509:
Docker Compose para API completa.

510:
Variaveis secrets e configuracao.

511:
Healthcheck em containers.

512:
Release strategy fundamentos.

513:
CI/CD visao geral.
```

A aula 510 respondeu:

```text
como fornecer
configuração e segredo

sem contaminar
imagem,
Git,
metadata
e logs?
```

A aula 511 responderá:

```text
como declarar
e validar
a saúde dos containers?
```

Nesta aula:

```text
Actuator:
sim.

application availability:
sim.

liveness:
sim.

readiness:
sim.

additional paths:
sim.

health group:
sim.

Dockerfile HEALTHCHECK:
sim.

script local:
sim.

Compose healthcheck:
sim.

Kafka healthcheck:
sim.

service_healthy:
sim.

interval:
sim.

timeout:
sim.

retries:
sim.

start_period:
sim.

falha:
sim.

recuperação:
sim.

release strategy:
não.

CI:
não.

Kubernetes probes:
somente ponte conceitual.

observabilidade completa:
não refeita.
```

A regra central será:

```text
liveness mede
a capacidade de continuar vivo;

readiness mede
a capacidade de receber trabalho;

dependências externas
entram apenas
quando a arquitetura exige.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão revisados ou criados:

```text
Dockerfile
compose.yaml
src/main/resources/application-container.yaml

docker/
└── healthcheck.sh

scripts/health
├── verify-healthchecks.ps1
├── simulate-unhealthy-app.ps1
└── inspect-container-health.ps1

docs/devops/health
├── HEALTHCHECK_POLICY.md
├── LIVENESS_AND_READINESS.md
├── COMPOSE_STARTUP_GATING.md
├── HEALTHCHECK_TEST_MATRIX.md
└── HEALTHCHECK_TROUBLESHOOTING.md
```

Testes sugeridos:

```text
src/test/java/br/com/formacao/m17/health
├── ApplicationAvailabilityEndpointTest.java
├── HealthGroupPolicyTest.java
└── ContainerHealthConfigurationTest.java
```

Ao final, você terá:

```text
/livez;

/readyz;

liveness sem dependência externa;

readiness com banco;

script HTTP local;

HEALTHCHECK na imagem;

healthcheck Kafka;

healthcheck app no Compose;

depends_on service_healthy;

testes de falha;

scripts de inspeção;

documentação operacional.
```

Você irá:

1. confirmar a baseline;
2. revisar Actuator;
3. revisar exposição de endpoints;
4. habilitar probes;
5. habilitar paths adicionais;
6. configurar liveness group;
7. configurar readiness group;
8. excluir Kafka da readiness;
9. excluir provider da readiness;
10. criar script do probe;
11. testar o script no host Linux da imagem;
12. copiar o script;
13. definir permissão;
14. criar `HEALTHCHECK`;
15. construir a imagem;
16. inspecionar a configuração;
17. adicionar healthcheck Kafka;
18. adicionar healthcheck app;
19. configurar tempos;
20. usar `service_healthy`;
21. renderizar Compose;
22. iniciar a stack;
23. observar `starting`;
24. observar `healthy`;
25. simular endpoint incorreto;
26. simular liveness quebrada em teste;
27. simular readiness recusada em teste;
28. interromper Kafka;
29. validar política de readiness;
30. validar recuperação;
31. criar scripts;
32. documentar;
33. executar gate;
34. commitar;
35. preparar a aula 512.

---

## Conceito essencial

### Estado do processo

Docker consegue saber se o processo principal:

```text
está executando;

encerrou;

retornou um exit code.
```

Isso não prova que o serviço atende corretamente.

---

### Estado de health

Quando uma imagem possui `HEALTHCHECK`, Docker executa o comando periodicamente.

Resultado:

```text
exit code 0:
sucesso.

exit code diferente de 0:
falha.
```

O container passa por:

```text
starting;

healthy;

unhealthy.
```

O processo principal pode continuar vivo enquanto o container está unhealthy.

---

### `HEALTHCHECK`

Exemplo:

```dockerfile
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=40s \
  --retries=3 \
  CMD ["/app/healthcheck.sh", "liveness"]
```

A imagem pode possuir apenas uma instrução `HEALTHCHECK` efetiva.

Uma instrução posterior substitui a anterior.

---

### Interval

`interval` define o tempo entre execuções regulares.

Um intervalo muito curto pode:

- gerar carga;
- criar ruído;
- aumentar logs;
- marcar falha por flutuação.

Um intervalo muito longo atrasa detecção.

---

### Timeout

`timeout` limita quanto tempo o comando pode executar.

O probe precisa terminar rapidamente.

Se o comando ultrapassa o limite:

```text
a tentativa falha.
```

---

### Retries

`retries` define quantas falhas consecutivas são necessárias para marcar unhealthy.

Isso reduz falsos positivos por falha isolada.

O valor não substitui investigação.

---

### Start period

`start_period` oferece uma janela de inicialização.

Durante essa fase, a aplicação pode ainda estar:

- criando contexto;
- migrando schema;
- abrindo banco;
- iniciando listeners;
- preparando caches.

Ele não deve esconder startup excessivamente lento.

---

### Start interval

Versões recentes do Compose e Docker podem permitir um intervalo específico durante o start period.

Esse recurso deve ser usado apenas após validar a versão instalada.

A baseline desta aula funcionará sem depender dele.

---

### Liveness

Liveness deve responder:

```text
a aplicação
está em um estado interno
recuperável sem restart?
```

Uma liveness quebrada pode justificar reiniciar a instância.

Por isso, ela não deve incluir sistemas externos compartilhados.

Se Kafka fica fora e liveness depende de Kafka:

```text
todas as instâncias
podem ser reiniciadas;

Kafka continua fora;

a recuperação piora.
```

---

### Readiness

Readiness responde:

```text
a instância
deve receber novo tráfego?
```

Ela pode considerar dependências essenciais.

A decisão é do domínio e da arquitetura.

No laboratório:

```text
banco:
essencial para aceitar OS.

Kafka:
não essencial para aceitar OS,
porque existe Outbox.

provider:
não essencial,
porque a entrega é assíncrona.
```

---

### Startup

Docker não possui um endpoint de startup separado equivalente ao Kubernetes startup probe.

O `start_period` protege o início.

No futuro, Kubernetes poderá utilizar uma startup probe dedicada.

Nesta aula, a aplicação precisa iniciar dentro de uma janela conhecida.

---

### Health group

Spring Boot permite grupos de health.

Configuração:

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
            - db
```

O grupo define quais indicadores participam.

---

### Application availability

Spring Boot mantém estados de disponibilidade:

```text
LivenessState;

ReadinessState.
```

Esses estados mudam durante o lifecycle da aplicação.

Também podem ser alterados por eventos controlados.

---

### Additional paths

Com:

```yaml
management:
  endpoint:
    health:
      probes:
        add-additional-paths: true
```

os grupos ficam disponíveis na porta principal:

```text
/livez;

/readyz.
```

Essa decisão verifica a mesma infraestrutura web usada pela API.

---

### Status HTTP

Quando o grupo está saudável:

```text
HTTP 200.
```

Quando o grupo está `DOWN` ou indisponível:

```text
HTTP 503
na política padrão.
```

O script usa apenas o status HTTP.

---

### Side effect free

Um healthcheck não deve:

- inserir registro;
- alterar status;
- publicar Kafka;
- consumir mensagem;
- chamar endpoint de negócio;
- rotacionar segredo;
- limpar fila;
- executar migração.

Ele deve observar.

---

### Healthcheck da dependência

Kafka receberá um probe que executa:

```text
kafka-topics.sh --list.
```

Esse comando verifica que o broker aceita uma operação administrativa simples.

Ele não prova:

- performance;
- quorum real;
- capacidade;
- ausência de lag;
- disponibilidade futura.

---

### Startup gating

Compose pode esperar:

```yaml
condition: service_healthy
```

antes de criar o service dependente.

Isso reduz corrida de inicialização.

Não substitui retry no client.

---

### Restart policy e health

No Docker Engine e Compose local:

```text
unhealthy
não encerra automaticamente
o processo.
```

A política `restart` reage ao encerramento do container, não necessariamente ao estado unhealthy.

Um orquestrador ou agente externo pode tomar decisões com base em health.

Não crie um script que mata o processo sem compreender o impacto.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Valide o Compose:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

---

### 2. Revisar dependência Actuator

No `pom.xml`, confirme:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>
        spring-boot-starter-actuator
    </artifactId>
</dependency>
```

Não adicione uma segunda biblioteca de health sem necessidade.

---

### 3. Configurar os probes

No:

```text
application-container.yaml
```

use:

```yaml
management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
          - prometheus

  endpoint:
    health:
      show-details:
        "never"

      probes:
        enabled:
          true

        add-additional-paths:
          true

      group:
        liveness:
          include:
            - livenessState

        readiness:
          include:
            - readinessState
            - db
```

Preserve as demais configurações.

---

### 4. Documentar a exclusão de Kafka

No arquivo:

```text
HEALTHCHECK_POLICY.md
```

registre:

```text
Kafka não participa
da readiness da API.

Justificativa:

a transação local
salva estado e Outbox;

a API pode continuar
aceitando trabalho;

o publisher recupera
quando Kafka volta.
```

Essa decisão precisa ser revisada se o contrato da API mudar.

---

### 5. Documentar a exclusão do provider

Registre:

```text
provider externo
não participa
de liveness ou readiness.

Justificativa:

envio assíncrono;

retry;

idempotência;

quarantine;

backlog monitorado.
```

---

### 6. Criar o script de healthcheck

Arquivo:

```text
docker/healthcheck.sh
```

Conteúdo:

```bash
#!/bin/bash

set -Eeuo pipefail

probe="${1:-liveness}"
host="${HEALTHCHECK_HOST:-127.0.0.1}"
port="${SERVER_PORT:-8084}"

case "${probe}" in
  liveness)
    path="${HEALTHCHECK_LIVENESS_PATH:-/livez}"
    ;;

  readiness)
    path="${HEALTHCHECK_READINESS_PATH:-/readyz}"
    ;;

  *)
    echo "Unsupported health probe" >&2
    exit 2
    ;;
esac

exec 3<>"/dev/tcp/${host}/${port}"

printf \
  'GET %s HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n' \
  "${path}" \
  >&3

IFS= read -r status_line <&3

case "${status_line}" in
  *" 200 "*)
    exit 0
    ;;

  *)
    echo "Health endpoint returned a non-200 status" >&2
    exit 1
    ;;
esac
```

O script não mostra body nem segredo.

---

### 7. Revisar o uso de Bash

A base:

```text
eclipse-temurin:21-jre-jammy
```

possui ambiente Ubuntu compatível com Bash.

Se a base mudar:

```text
o probe precisa
ser validado novamente.
```

Não assuma que imagens minimalistas possuem Bash.

---

### 8. Copiar o script no Dockerfile

No runtime stage:

```dockerfile
COPY --chown=app:app \
  docker/healthcheck.sh \
  /app/healthcheck.sh
```

Depois:

```dockerfile
RUN chmod 0555 \
      /app/healthcheck.sh \
    && chmod 0444 \
      /app/app.jar
```

Defina `USER app:app` somente depois dos ajustes executados como root.

---

### 9. Adicionar `HEALTHCHECK`

No runtime stage:

```dockerfile
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=40s \
  --retries=3 \
  CMD ["/app/healthcheck.sh", "liveness"]
```

Esse é o default portátil da imagem.

---

### 10. Construir a imagem

```powershell
docker buildx build `
  --load `
  --tag `
  "formacao-java/m16-integrations:5.0.0" `
  .
```

Os testes do builder precisam continuar passando.

---

### 11. Inspecionar o healthcheck da imagem

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.0.0" `
  --format `
  "{{json .Config.Healthcheck}}"
```

Confirme:

- test;
- interval;
- timeout;
- start period;
- retries.

---

### 12. Testar o script isoladamente

Inicie um container temporário da aplicação com as configurações necessárias.

Depois:

```powershell
docker exec `
  "<container>" `
  /app/healthcheck.sh `
  liveness
```

Exit code esperado:

```text
0.
```

Teste readiness:

```powershell
docker exec `
  "<container>" `
  /app/healthcheck.sh `
  readiness
```

---

### 13. Adicionar healthcheck Kafka

No service `kafka`:

```yaml
healthcheck:
  test:
    - CMD-SHELL
    - >
      /opt/kafka/bin/kafka-topics.sh
      --bootstrap-server localhost:9092
      --list
      >/dev/null 2>&1

  interval:
    10s

  timeout:
    5s

  retries:
    12

  start_period:
    30s
```

O comando não cria topic.

---

### 14. Adicionar healthcheck app no Compose

No service `app`:

```yaml
healthcheck:
  test:
    - CMD
    - /app/healthcheck.sh
    - readiness

  interval:
    10s

  timeout:
    5s

  retries:
    5

  start_period:
    40s
```

O Compose sobrescreve o default de liveness da imagem com readiness para a stack.

---

### 15. Evoluir `depends_on`

Use:

```yaml
depends_on:
  kafka:
    condition:
      service_healthy
```

Não utilize a sintaxe curta ao mesmo tempo.

---

### 16. Renderizar o Compose

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

Confirme:

- healthcheck Kafka;
- healthcheck app;
- condition;
- tempos;
- paths;
- ausência de segredo.

---

### 17. Iniciar a stack limpa

```powershell
docker compose `
  --env-file `
  ".env.example" `
  down
```

Depois:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --build
```

Observe a sequência.

---

### 18. Acompanhar os estados

```powershell
docker compose `
  --env-file `
  ".env.example" `
  ps
```

Inicialmente, você pode observar:

```text
starting.
```

Depois:

```text
healthy.
```

---

### 19. Inspecionar health detalhado

Obtenha o container:

```powershell
$appContainer =
  docker compose `
    --env-file `
    ".env.example" `
    ps `
    -q `
    app
```

Inspecione:

```powershell
docker inspect `
  "${appContainer}" `
  --format `
  "{{json .State.Health}}"
```

Não dependa apenas da coluna resumida.

---

### 20. Validar endpoints pelo host

```powershell
Invoke-WebRequest `
  "http://localhost:8084/livez"
```

Depois:

```powershell
Invoke-WebRequest `
  "http://localhost:8084/readyz"
```

Confirme HTTP 200.

---

### 21. Validar endpoints Actuator

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health/liveness"
```

Depois:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health/readiness"
```

Detalhes sensíveis não devem aparecer.

---

### 22. Testar endpoint incorreto

Altere temporariamente no Compose:

```yaml
environment:
  HEALTHCHECK_READINESS_PATH:
    "/readyz-inexistente"
```

Recrie somente `app`.

O processo Java continuará vivo.

O estado do container deve evoluir para:

```text
unhealthy.
```

Isso prova que:

```text
process state
é diferente
de health state.
```

Restaure o path e recrie.

---

### 23. Testar liveness em teste automatizado

Exemplo:

```java
package br.com.formacao.m17.health;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.LivenessState;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(
    properties = {
        "management.endpoint.health.probes.enabled=true",
        "management.endpoint.health.probes.add-additional-paths=true"
    }
)
@AutoConfigureMockMvc
@DirtiesContext
class ApplicationLivenessEndpointTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ConfigurableApplicationContext context;

    @Test
    void shouldReturnServiceUnavailableWhenLivenessIsBroken()
        throws Exception {

        AvailabilityChangeEvent.publish(
            context,
            LivenessState.BROKEN
        );

        mockMvc.perform(
                get("/livez")
            )
            .andExpect(
                status().isServiceUnavailable()
            );
    }
}
```

O contexto é descartado para não contaminar outros testes.

---

### 24. Testar readiness em teste automatizado

Use:

```java
AvailabilityChangeEvent.publish(
    context,
    ReadinessState.REFUSING_TRAFFIC
);
```

Confirme:

```text
/readyz
-> HTTP 503.
```

Crie um teste separado ou restaure o estado conscientemente.

---

### 25. Testar a política dos grupos

Crie:

```text
HealthGroupPolicyTest.
```

Confirme conceitualmente:

```text
liveness:

livenessState.

readiness:

readinessState,
db.

excluídos:

Kafka,
provider.
```

O teste pode validar properties carregadas e comportamento dos endpoints.

---

### 26. Interromper Kafka

Com a stack saudável:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  stop `
  kafka
```

Observe:

```text
kafka:
parado.

app:
continua executando.
```

A readiness da app deve permanecer coerente com a política:

```text
UP,
se banco e aplicação
estão prontas.
```

---

### 27. Criar uma ordem com Kafka fora

Execute a criação de OS.

Confirme:

- HTTP aceita conforme contrato;
- estado local confirma;
- Outbox fica pendente;
- publisher registra falha transitória;
- app não perde a intenção.

Isso comprova por que Kafka foi excluído da readiness.

---

### 28. Restaurar Kafka

```powershell
docker compose `
  --env-file `
  ".env.example" `
  start `
  kafka
```

Aguarde o broker ficar healthy.

Confirme:

- publisher retoma;
- Outbox é publicada;
- consumer processa;
- jornada termina.

---

### 29. Observar que unhealthy não reinicia sozinho

Configure temporariamente um path inválido.

Aguarde unhealthy.

Execute:

```powershell
docker compose ps
```

Confirme que o container ainda está em execução.

Restaure a configuração.

Documente:

```text
health é sinal;

ação depende
do runtime ou orquestrador.
```

---

### 30. Criar script de inspeção

Arquivo:

```text
scripts/health/inspect-container-health.ps1
```

Responsabilidades:

- localizar container;
- mostrar status resumido;
- mostrar failing streak;
- mostrar últimos resultados;
- ocultar output sensível;
- retornar exit code adequado.

---

### 31. Criar script de verificação

Arquivo:

```text
scripts/health/verify-healthchecks.ps1
```

Fluxo:

1. validar Docker;
2. validar Compose;
3. renderizar configuração;
4. subir stack;
5. aguardar Kafka healthy;
6. aguardar app healthy;
7. chamar `/livez`;
8. chamar `/readyz`;
9. validar usuário não root;
10. executar smoke test;
11. mostrar estados;
12. limpar temporários.

Use timeout total.

Não espere indefinidamente.

---

### 32. Criar script de falha

Arquivo:

```text
scripts/health/simulate-unhealthy-app.ps1
```

O script deve:

- salvar configuração atual;
- aplicar path inválido de forma controlada;
- recriar app;
- aguardar unhealthy;
- provar processo vivo;
- restaurar;
- recriar;
- aguardar healthy;
- executar limpeza em `finally`.

Não deixe a stack quebrada.

---

### 33. Criar matriz de testes

Arquivo:

```text
HEALTHCHECK_TEST_MATRIX.md
```

Inclua:

```markdown
| Cenário | Liveness | Readiness | Container |
|---|---|---|---|
| Startup | Em transição | Em transição | starting |
| Normal | UP | UP | healthy |
| Path inválido | Endpoint não responde | Endpoint não responde | unhealthy |
| Readiness recusada | UP | DOWN | unhealthy no Compose |
| Liveness quebrada | DOWN | Pode variar | unhealthy |
| Kafka fora | UP | UP pela policy | app continua |
| DB indisponível | UP | DOWN | unhealthy |
| Provider fora | UP | UP | retry assíncrono |
```

---

### 34. Documentar liveness e readiness

Arquivo:

```text
LIVENESS_AND_READINESS.md
```

Inclua:

- definição;
- grupo;
- indicadores;
- endpoints;
- status;
- dependências;
- riscos;
- mudanças futuras.

---

### 35. Documentar startup gating

Arquivo:

```text
COMPOSE_STARTUP_GATING.md
```

Inclua:

- `depends_on`;
- `service_healthy`;
- Kafka healthcheck;
- ordem;
- limite;
- retry ainda necessário;
- comportamento em restart;
- comportamento após startup.

---

### 36. Criar troubleshooting

Arquivo:

```text
HEALTHCHECK_TROUBLESHOOTING.md
```

Inclua:

- health fica starting;
- script sem permissão;
- Bash ausente;
- `/dev/tcp` incompatível;
- path incorreto;
- porta incorreta;
- endpoint não exposto;
- probe sem additional path;
- status 503;
- Kafka health falha;
- `depends_on` não reconhece condition;
- container unhealthy sem restart;
- timeout muito baixo;
- start period curto;
- teste contamina contexto;
- detalhe sensível no health.

---

### 37. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

Execute:

```powershell
.\scripts\health\verify-healthchecks.ps1
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Processo e saúde foram separados

`Up` deixou de ser tratado como sinônimo de saudável.

### Liveness ganhou escopo interno

Falhas externas não causam restart em cascata.

### Readiness ganhou decisão arquitetural

O banco participa porque é essencial para aceitar trabalho.

### Kafka ficou fora da readiness

Outbox permite continuar aceitando e recuperar depois.

### O provider ficou fora da readiness

Retry e quarantine isolam a indisponibilidade.

### A imagem ganhou um default portátil

Dockerfile utiliza liveness.

### Compose ganhou política de ambiente

A stack utiliza readiness.

### Kafka ganhou startup gating

App não é criada antes do broker responder ao probe.

### Falhas ficaram demonstráveis

Path inválido produz unhealthy com processo vivo.

### Saúde virou evidência operacional

Scripts e matriz registram comportamento normal, falha e recuperação.

---

## Erros comuns importantes

### Usar `/actuator/health` para tudo

O endpoint global pode misturar indicadores com semânticas diferentes.

### Incluir Kafka na liveness

Uma falha externa pode reiniciar todas as instâncias.

### Incluir provider na readiness sem necessidade

A API pode ser retirada mesmo com retry assíncrono funcional.

### Não incluir banco na readiness

A API recebe tráfego sem conseguir confirmar a transação.

### Criar healthcheck que grava dados

O probe deixa de ser observação.

### Instalar curl sem avaliar custo

A superfície do runtime aumenta.

### Usar timeout maior que interval sem entender

Execuções podem se tornar difíceis de interpretar.

### Usar start period para esconder startup ruim

A causa real permanece.

### Considerar service_healthy monitoramento contínuo

Ele resolve principalmente o gating de criação.

### Esperar restart automático por unhealthy

Compose local não encerra o processo apenas por health.

### Expor detalhes do health

Informações internas podem vazar.

### Fazer probe depender de segredo externo

A operação fica frágil e desnecessariamente acoplada.

---

## Comandos úteis

### Inspecionar health da imagem

```powershell
docker image inspect `
  "formacao-java/m16-integrations:5.0.0" `
  --format `
  "{{json .Config.Healthcheck}}"
```

### Ver status Compose

```powershell
docker compose `
  --env-file `
  ".env.example" `
  ps
```

### Inspecionar container

```powershell
docker inspect `
  "$(docker compose ps -q app)" `
  --format `
  "{{json .State.Health}}"
```

### Chamar liveness

```powershell
Invoke-WebRequest `
  "http://localhost:8084/livez"
```

### Chamar readiness

```powershell
Invoke-WebRequest `
  "http://localhost:8084/readyz"
```

### Executar probe interno

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  /app/healthcheck.sh `
  readiness
```

---

## Exercício guiado

### Parte 1 — Semântica

Defina startup, liveness e readiness.

### Parte 2 — Actuator

Configure grupos e paths.

### Parte 3 — Script

Implemente probe HTTP local.

### Parte 4 — Imagem

Adicione `HEALTHCHECK`.

### Parte 5 — Kafka

Adicione probe do broker.

### Parte 6 — Compose

Configure readiness e service_healthy.

### Parte 7 — Falha

Produza unhealthy com processo vivo.

### Parte 8 — Política

Interrompa Kafka e valide Outbox.

### Parte 9 — Recuperação

Restaure serviços e observe backlog.

### Parte 10 — Evidência

Crie scripts, matriz e documentação.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 510 foi preservada;
- Actuator foi revisado;
- liveness foi definida;
- readiness foi definida;
- startup foi definido;
- processo vivo foi diferenciado de saudável;
- probes foram habilitados;
- paths adicionais foram habilitados;
- `/livez` foi criado;
- `/readyz` foi criado;
- endpoints Actuator foram preservados;
- show-details foi restringido;
- liveness group foi configurado;
- liveness inclui apenas livenessState;
- readiness group foi configurado;
- readiness inclui readinessState;
- readiness inclui db;
- Kafka foi excluído da liveness;
- Kafka foi excluído da readiness;
- provider foi excluído da liveness;
- provider foi excluído da readiness;
- decisão de Kafka foi documentada;
- decisão de provider foi documentada;
- script Bash foi criado;
- script usa endpoint local;
- script não usa segredo;
- script não possui efeito colateral;
- probe liveness foi implementado;
- probe readiness foi implementado;
- path inválido foi tratado;
- exit code zero foi usado no sucesso;
- exit code não zero foi usado na falha;
- script foi copiado para a imagem;
- ownership foi aplicado;
- permissão 0555 foi aplicada;
- JAR permaneceu 0444;
- HEALTHCHECK foi adicionado;
- interval foi definido;
- timeout foi definido;
- retries foi definido;
- start_period foi definido;
- start_interval não foi exigido;
- imagem foi construída;
- healthcheck da imagem foi inspecionado;
- script foi testado isoladamente;
- healthcheck Kafka foi criado;
- comando Kafka não possui efeito colateral;
- healthcheck app foi criado;
- Compose sobrescreve para readiness;
- `depends_on` usa long syntax;
- `service_healthy` foi usado;
- limite de startup gating foi explicado;
- Compose foi renderizado;
- segredo não apareceu no render;
- stack limpa foi iniciada;
- estado starting foi observado;
- estado healthy foi observado;
- health detalhado foi inspecionado;
- `/livez` retornou sucesso;
- `/readyz` retornou sucesso;
- endpoints Actuator foram validados;
- path incorreto foi testado;
- processo vivo com unhealthy foi comprovado;
- liveness quebrada foi testada;
- readiness recusada foi testada;
- contexto de teste foi isolado;
- policy dos grupos foi testada;
- Kafka foi interrompido;
- app permaneceu viva;
- readiness seguiu a policy;
- criação de OS com Kafka fora foi testada;
- Outbox preservou o trabalho;
- Kafka foi restaurado;
- backlog foi recuperado;
- unhealthy sem restart automático foi demonstrado;
- script de inspeção foi criado;
- script de verificação foi criado;
- script possui timeout total;
- script de falha foi criado;
- script restaura configuração;
- matriz de testes foi criada;
- liveness/readiness foram documentadas;
- startup gating foi documentado;
- troubleshooting foi criado;
- healthcheck não alterou segurança da imagem;
- usuário não root foi preservado;
- rootfs read-only foi preservado;
- secrets foram preservados;
- release strategy não foi antecipada;
- CI não foi antecipado;
- Kubernetes probes não foram implementadas;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 512 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/Dockerfile `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/docker/healthcheck.sh `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-container.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java/br/com/formacao/m17/health `
  scripts/health `
  docs/devops/health `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "build(m17): adicionar healthchecks aos containers"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret local;
- `.env`;
- `app.env`;
- token;
- password;
- output de inspect;
- logs;
- arquivo temporário;
- volume;
- banco;
- imagem exportada;
- configuração quebrada de simulação;
- estratégia de release da aula 512.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a stack deixou de verificar apenas se os processos estavam executando.

Ela passou a declarar:

```text
health da imagem;

health da aplicação;

health do Kafka;

startup gating;

liveness;

readiness;

falha;

recuperação.
```

Você comprovou que:

- processo vivo não significa serviço saudável;
- healthcheck transforma uma observação em exit code;
- Docker registra starting, healthy e unhealthy;
- liveness precisa evitar dependências externas;
- readiness precisa refletir capacidade de receber trabalho;
- banco participa da readiness porque é essencial;
- Kafka fica fora porque Outbox preserva trabalho;
- provider fica fora porque envio é assíncrono;
- `/livez` e `/readyz` usam a porta principal;
- o Dockerfile fornece liveness como default;
- Compose usa readiness como política da stack;
- Kafka possui probe próprio;
- `service_healthy` reduz corrida no startup;
- retry continua necessário depois do startup;
- unhealthy não encerra automaticamente o processo no Compose local;
- falhas precisam ser simuladas e restauradas;
- health não substitui métricas, logs ou alertas.

A próxima aula será:

```text
512 - M17.07 - Release strategy fundamentos
```

Nela, você irá estudar os fundamentos para escolher como uma nova versão chega aos ambientes, como reduzir risco, como observar a implantação e como preparar rollback.

Nenhuma estratégia de release foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Configurei liveness.
- [ ] Configurei readiness.
- [ ] Criei o script do probe.
- [ ] Adicionei HEALTHCHECK.
- [ ] Configurei Kafka health.
- [ ] Usei service_healthy.
- [ ] Testei falha e recuperação.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Container fica em `starting`

Revise startup, start period, logs e endpoint.

### Script retorna permission denied

Confirme `chmod 0555` e ownership.

### `/bin/bash` não existe

A base mudou ou foi minimizada.

### `/dev/tcp` não funciona

O shell não é Bash ou não suporta o recurso.

### `/livez` retorna 404

Revise `add-additional-paths`.

### `/readyz` retorna 503

Revise estado de readiness e indicador `db`.

### Health global está UP e readiness DOWN

Os grupos possuem indicadores diferentes.

### Kafka fica unhealthy

Revise listeners, porta, script e tempo de startup.

### App não inicia após `service_healthy`

O health do Kafka nunca passou ou a versão do Compose não suporta a configuração esperada.

### App fica unhealthy, mas não reinicia

Esse é o comportamento esperado no Compose local.

### Kafka fora derruba readiness

Algum health indicator externo foi incluído indevidamente.

### Testes seguintes falham após liveness BROKEN

O contexto ou estado não foi restaurado.

---

## Perguntas de revisão

1. O que é startup?
2. O que é liveness?
3. O que é readiness?
4. Processo vivo significa healthy?
5. Quais estados Docker registra?
6. O que significa exit code zero?
7. Para que serve interval?
8. Para que serve timeout?
9. Para que servem retries?
10. Para que serve start period?
11. Liveness deve depender de Kafka?
12. Readiness deve incluir o banco?
13. Por que Kafka ficou fora?
14. Por que provider ficou fora?
15. O que faz add-additional-paths?
16. O que faz service_healthy?
17. Ele substitui retry?
18. Unhealthy reinicia automaticamente?
19. Health substitui observabilidade?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Período de inicialização.
2. Estado interno de vida.
3. Capacidade de receber trabalho.
4. Não.
5. Starting, healthy, unhealthy.
6. Probe com sucesso.
7. Frequência.
8. Limite de duração.
9. Tolerar falhas consecutivas.
10. Proteger inicialização.
11. Não.
12. Sim neste projeto.
13. Outbox preserva trabalho.
14. Retry assíncrono.
15. Criar `/livez` e `/readyz`.
16. Esperar dependência healthy.
17. Não.
18. Não no Compose local.
19. Não.
20. Release strategy fundamentos.

---

## Desafio opcional

Crie um cenário de readiness degradada sem quebrar liveness.

Requisitos:

- usar evento de `ReadinessState`;
- `/livez` continua 200;
- `/readyz` retorna 503;
- container fica unhealthy no Compose;
- processo continua vivo;
- restauração retorna healthy;
- teste automatizado;
- nenhum endpoint administrativo inseguro;
- nenhuma antecipação de release strategy.

O objetivo é provar que liveness e readiness possuem semânticas diferentes.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 511 - M17.06 - Healthcheck em containers

- Continuei após variáveis, secrets e configuração.
- Diferenciei processo, startup, liveness e readiness.
- Revisei Spring Boot Application Availability.
- Habilitei os probes do Actuator.
- Habilitei paths adicionais.
- Expus `/livez` e `/readyz`.
- Mantive detalhes de health protegidos.
- Configurei liveness apenas com `livenessState`.
- Configurei readiness com `readinessState` e `db`.
- Excluí Kafka da readiness por causa da Outbox.
- Excluí provider por causa do envio assíncrono.
- Documentei as decisões de dependência.
- Criei `docker/healthcheck.sh`.
- Usei HTTP local sem curl.
- Mantive o probe sem efeito colateral.
- Copiei o script para a imagem.
- Apliquei permissão 0555.
- Adicionei `HEALTHCHECK` ao Dockerfile.
- Configurei interval, timeout, retries e start period.
- Inspecionei o healthcheck da imagem.
- Adicionei healthcheck ao Kafka.
- Adicionei readiness healthcheck ao app no Compose.
- Usei `condition: service_healthy`.
- Renderizei o Compose.
- Observei estados starting e healthy.
- Inspecionei `.State.Health`.
- Testei `/livez` e `/readyz`.
- Simulei path incorreto.
- Comprovei processo vivo com container unhealthy.
- Testei liveness quebrada.
- Testei readiness recusada.
- Interrompi Kafka.
- Confirmei app pronta pela policy.
- Criei OS com Kafka fora.
- Confirmei Outbox pendente.
- Restaurei Kafka e processei backlog.
- Comprovei que unhealthy não reinicia sozinho.
- Criei scripts e matriz de testes.
- Documentei startup gating e troubleshooting.
- Não antecipei release strategy.
- Próxima aula: Release strategy fundamentos.
```

---

## Referência técnica curta

- Dockerfile `HEALTHCHECK`.
- Docker Compose `healthcheck`.
- Docker Compose Startup Order.
- Spring Boot Actuator Health.
- Spring Boot Application Availability.
- Spring Boot Liveness and Readiness Probes.
- Health Groups.
- Side-effect-free Probes.
- Graceful Shutdown.
- Transactional Outbox Pattern.

Regra final:

```text
healthcheck em containers precisa representar semânticas arquiteturais, não apenas processo ativo: Spring Boot expõe `livenessState` em `/livez` e `readinessState` mais `db` em `/readyz`, enquanto Kafka e provider externo ficam fora porque Outbox, retry e quarantine permitem continuar aceitando trabalho durante indisponibilidades; o script `/app/healthcheck.sh` executa uma requisição HTTP local sem segredo ou efeito colateral, a imagem define liveness como default por `HEALTHCHECK` e o Compose sobrescreve para readiness; interval, timeout, retries e start period controlam a avaliação, Kafka recebe probe próprio e `depends_on.condition=service_healthy` reduz corrida no startup sem substituir retry; estados starting, healthy e unhealthy são inspecionados, path inválido prova que processo vivo não significa saudável, testes alteram Application Availability e a interrupção do Kafka comprova a política da Outbox; unhealthy é um sinal e não reinicia automaticamente o container no Compose local; com startup, vida e prontidão verificáveis, a formação avança para os fundamentos de release strategy na aula 512.
```
