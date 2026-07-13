# 515 - M17.10 - Canary deployment

## Apresentação da aula

Na aula 514, você implementou uma topologia blue-green.

A stack passou a possuir:

```text
app-blue;

app-green;

app-worker;

gateway;

PostgreSQL;

Kafka.
```

A versão candidata foi iniciada em paralelo.

Antes de receber tráfego, ela foi validada por:

- liveness;
- readiness;
- versão;
- release color;
- configuração;
- schema;
- smoke test;
- logs;
- métricas;
- ausência de workers duplicados.

Depois, o gateway mudou todo o tráfego:

```text
100% blue
para
100% green.
```

A estratégia reduziu o tempo de indisponibilidade e manteve um retorno rápido.

Entretanto, a primeira requisição real após a troca já podia atingir a candidata.

Se existisse um erro que somente aparecesse com tráfego real, o alcance inicial seria:

```text
todo o tráfego.
```

A pergunta central desta aula será:

```text
como expor
uma versão candidata

a uma parcela pequena
do tráfego

antes de promovê-la
para todos?
```

A resposta será:

```text
canary deployment.
```

Na topologia desta aula:

```text
stable:

versão atual
que recebe a maior parte
do tráfego.

canary:

versão candidata
que recebe uma fração
controlada.
```

O gateway distribuirá requisições com pesos.

Exemplo inicial:

```text
stable:
90%.

canary:
10%.
```

Depois da observação, o canary poderá avançar:

```text
1%;

5%;

10%;

25%;

50%;

100%.
```

No laboratório local, os percentuais serão aproximações.

Poucas requisições não produzem uma amostra estatisticamente confiável.

Por isso, cada etapa será definida por:

```text
peso;

quantidade mínima
de requisições;

tempo mínimo;

cenários obrigatórios;

critérios de erro;

critérios de latência;

critérios de backlog;

decisão de continuar
ou retirar.
```

Canary deployment não é apenas configurar:

```nginx
weight=1.
```

A estratégia precisa responder:

- quem recebe o canary;
- quanto tráfego;
- por quanto tempo;
- quais sinais;
- qual baseline;
- quais thresholds;
- como distinguir stable de canary;
- como retirar o canary;
- como impedir efeitos duplicados;
- como promover;
- como registrar evidências.

A aplicação continua possuindo:

- API HTTP;
- PostgreSQL compartilhado;
- Outbox;
- Kafka;
- Inbox;
- workers;
- provider;
- feature flags;
- healthchecks;
- secrets;
- runtime não root.

Assim como no blue-green, stable e canary não executarão workers.

A topologia terá:

```text
gateway;

app-stable;

app-canary;

app-worker;

postgres;

kafka.
```

O worker permanecerá na versão estável.

Isso evita que uma exposição HTTP de 10% seja confundida com:

```text
10% dos consumers;

10% dos schedulers;

10% dos dispatchers.
```

Background workloads exigem outra unidade de divisão.

A aula aplicará canary somente à API.

O gateway utilizará NGINX weighted round robin.

Exemplo:

```nginx
upstream canary_app {
    server app-stable:8084 weight=9;
    server app-canary:8084 weight=1;
}
```

Essa configuração aproxima:

```text
90% stable;

10% canary.
```

Ela não garante que exatamente uma de cada dez requisições irá para o canary em qualquer janela curta.

O resultado depende de:

- quantidade de requests;
- conexões;
- retries;
- keep-alive;
- falhas de upstream;
- comportamento do client;
- estado dos backends.

A aula criará uma identificação segura da variante.

Cada resposta do laboratório incluirá:

```text
X-Release-Color;

X-App-Version.
```

Esses headers serão adicionados pela aplicação a partir de configuração controlada.

Eles servem para:

- evidência local;
- scripts;
- contagem;
- troubleshooting.

Em ambiente real, a exposição de versão em resposta pública precisa ser avaliada pela política de segurança.

Uma alternativa seria registrar a variante apenas em logs, traces e métricas internas.

O canary também será observado por métricas segmentadas com tags limitadas:

```text
release_color=stable;

release_color=canary.
```

Não serão usadas tags por:

- request ID;
- cliente;
- usuário;
- ordem de serviço;
- container ID.

A candidata compartilhará o mesmo banco e contratos.

Por isso, ela precisa continuar compatível com a versão estável.

A aula mantém:

```text
schema freeze.
```

Nenhuma migration será implementada.

O tema será aprofundado na aula 517.

A estratégia terá dois caminhos de saída.

#### Promoção

Quando o canary atende aos critérios:

```text
peso aumenta;

até 100%.
```

Depois, a versão antiga permanece disponível por uma janela.

#### Aborto

Quando o canary falha:

```text
peso canary vai para zero;

stable volta a receber
100% do tráfego.
```

Isso não será chamado de rollback completo de dados.

É uma retirada de tráfego da candidata.

A aula seguinte será:

```text
516 - M17.11 - Rollback seguro
```

Nela, o retorno será aprofundado para incluir:

- artefato;
- configuração;
- dados;
- contratos;
- evidências;
- critérios;
- automação;
- roll-forward.

Portanto, esta aula não antecipará todo o processo de rollback seguro.

Também não implementará:

- segmentação por usuário;
- sticky canary;
- canary por tenant;
- header routing;
- traffic mirroring;
- análise estatística avançada;
- service mesh;
- Kubernetes;
- progressive delivery controller;
- auto-promotion por pipeline;
- auto-rollback produtivo.

O foco será:

```text
tráfego parcial;

observação segmentada;

promoção em etapas;

retirada rápida.
```

Ao final, você deverá explicar:

```text
a diferença entre
blue-green
e canary;

por que percentuais
são aproximações;

como separar
stable e canary
nas métricas;

por que workers
não entram no canary HTTP;

como definir
um gate por etapa;

como retirar
o canary;

como promover
até 100%;

por que health verde
não basta;

por que amostra pequena
não prova segurança.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
513:
Feature flags.

514:
Blue green deployment.

515:
Canary deployment.

516:
Rollback seguro.

517:
Deploy com migracao sem downtime.
```

A aula 514 respondeu:

```text
como preparar
uma candidata em paralelo

e trocar 100%
do tráfego?
```

A aula 515 responderá:

```text
como liberar
a candidata
para uma parcela pequena

e aumentar
somente após evidência?
```

Nesta aula:

```text
stable:
sim.

canary:
sim.

weighted upstream:
sim.

estágios de promoção:
sim.

headers de variante:
sim.

métricas por variante:
sim.

logs por variante:
sim.

gates:
sim.

amostra mínima:
sim.

janela:
sim.

aborto do canary:
sim.

promoção a 100%:
sim.

worker isolado:
sim.

estado compartilhado:
sim.

feature flags:
reutilizadas.

schema freeze:
sim.

sticky routing:
não.

tenant targeting:
não.

auto-promotion:
não.

Kubernetes:
não.
```

A regra central será:

```text
o canary cresce
somente quando
saúde,
função,
erros,
latência
e estado
permanecem aceitáveis.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou revisados:

```text
compose.canary.yaml

deploy/nginx-canary
├── nginx.conf
├── default.conf
├── active-weights.conf
├── weights-100-0.conf
├── weights-99-1.conf
├── weights-95-5.conf
├── weights-90-10.conf
├── weights-75-25.conf
├── weights-50-50.conf
└── weights-0-100.conf

src/main/java/br/com/formacao/m17/release
├── ReleaseIdentityProperties.java
├── ReleaseIdentityResponseHeaderFilter.java
├── ReleaseIdentityMetrics.java
└── ReleaseIdentityInfoContributor.java

src/test/java/br/com/formacao/m17/release
├── ReleaseIdentityPropertiesTest.java
├── ReleaseIdentityResponseHeaderFilterTest.java
├── CanaryRoutingEvidenceTest.java
└── CanaryMetricCardinalityTest.java

scripts/canary
├── start-canary.ps1
├── validate-canary.ps1
├── set-canary-weight.ps1
├── observe-canary.ps1
├── abort-canary.ps1
├── promote-canary.ps1
└── verify-canary.ps1

docs/devops/canary
├── CANARY_ARCHITECTURE.md
├── CANARY_RELEASE_PLAN.md
├── CANARY_GATES.md
├── CANARY_OBSERVATION.md
├── CANARY_ABORT_PLAN.md
├── CANARY_PROMOTION_PLAN.md
├── CANARY_TEST_MATRIX.md
└── CANARY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
stable ativa;

canary ativa;

worker único;

gateway ponderado;

identificação por resposta;

contagem por variante;

gates por etapa;

observação;

aborto;

promoção;

evidências.
```

Você irá:

1. confirmar a baseline;
2. registrar imagens;
3. criar identidade de release;
4. criar headers;
5. criar métricas;
6. controlar cardinalidade;
7. manter workers desativados;
8. criar Compose canary;
9. criar gateway ponderado;
10. criar arquivos de peso;
11. validar NGINX;
12. iniciar stable;
13. iniciar canary;
14. iniciar worker;
15. iniciar gateway;
16. validar stable direta;
17. validar canary direta;
18. iniciar em 100/0;
19. promover para 99/1;
20. gerar tráfego;
21. contar variantes;
22. observar sinais;
23. promover para 95/5;
24. promover para 90/10;
25. simular falha;
26. abortar;
27. restaurar candidata;
28. retomar rollout;
29. promover 25%;
30. promover 50%;
31. promover 100%;
32. manter stable disponível;
33. criar scripts;
34. documentar;
35. executar gate;
36. commitar;
37. preparar a aula 516.

---

## Conceito essencial

### Stable

Stable é a versão conhecida que recebe a maior parte do tráfego.

Ela fornece a baseline de comparação.

---

### Canary

Canary é a candidata exposta a uma parcela controlada.

Ela precisa possuir:

- versão identificável;
- health;
- readiness;
- logs;
- métricas;
- compatibilidade;
- caminho de retirada.

---

### Weighted round robin

NGINX pode distribuir requisições por peso.

Exemplo:

```nginx
server app-stable:8084 weight=19;
server app-canary:8084 weight=1;
```

A proporção nominal é:

```text
95% stable;

5% canary.
```

Os pesos não representam porcentagem absoluta em uma amostra curta.

---

### Traffic percentage

Percentual é uma intenção operacional.

Ele precisa ser acompanhado de:

```text
minimum requests;

minimum duration;

mandatory scenarios.
```

Exemplo:

```text
5% por 10 minutos
e pelo menos 100 requests.
```

No laboratório, os números servem para praticar o gate.

Eles não são uma política produtiva.

---

### Baseline comparison

Canary deve ser comparada com stable.

Observe por variante:

- HTTP 2xx;
- HTTP 4xx esperados;
- HTTP 5xx;
- latência;
- health;
- CPU;
- memória;
- logs;
- Outbox;
- retries;
- quarantine.

Sem baseline, uma métrica isolada pode ser interpretada incorretamente.

---

### Error budget do canary

A aula não definirá um SLO formal.

Mesmo assim, o gate pode usar limites didáticos.

Exemplo:

```text
canary 5xx:
zero no smoke;

nenhum crescimento
acima da stable
na janela local.
```

---

### Sample size

Uma request no canary com sucesso não prova qualidade.

Dez requests também podem ser insuficientes.

O volume necessário depende de:

- frequência de falha;
- variabilidade;
- confiança;
- criticidade;
- tipos de cenário.

---

### Release identity

A aplicação terá:

```text
app.release.color;

app.release.version.
```

Valores:

```text
stable;

canary;

worker.
```

A identidade será usada em:

- headers de laboratório;
- Actuator info;
- logs;
- métricas.

---

### Controlled cardinality

`release_color` possui conjunto pequeno.

`app_version` pode gerar cardinalidade ao longo do tempo.

Em métricas de longa retenção, prefira:

- `release_color`;
- deployment metadata externa;
- labels controladas;
- inventory.

Nesta aula, versão será usada com cuidado.

---

### Worker isolation

O canary HTTP não controla consumo assíncrono.

Por isso:

```text
stable API:
workers false.

canary API:
workers false.

worker:
workers true.
```

A promoção do worker não faz parte desta aula.

---

### State compatibility

Stable e canary compartilham PostgreSQL.

As duas versões precisam:

- ler o mesmo schema;
- escrever formato compatível;
- preservar eventos;
- preservar idempotência;
- não remover campos usados.

---

### Abort

Abortar o canary significa:

```text
peso canary:
0.

peso stable:
100.
```

A candidata pode permanecer ativa para investigação.

---

### Promotion

Promoção pode ocorrer em etapas.

Exemplo:

```text
1%;

5%;

10%;

25%;

50%;

100%.
```

Cada etapa possui gate independente.

---

### Hold

Hold interrompe a progressão sem remover o canary.

Use quando:

- sinais são inconclusivos;
- amostra é insuficiente;
- operação está em janela de dúvida;
- dependência externa ficou instável.

---

### Automatic versus manual

Nesta aula, a progressão será manual por script.

Automação sem sinais confiáveis pode acelerar a falha.

Antes de auto-promotion, é necessário:

- métricas;
- thresholds;
- query;
- timeout;
- ownership;
- audit trail;
- fallback.

---

### Sticky routing

Sticky routing mantém um cliente na mesma variante.

Pode ser útil quando:

- sessão local;
- experiência consistente;
- fluxo multi-step.

Também reduz aleatoriedade e pode enviesar a amostra.

Não será implementado.

---

### Canary versus A/B

Canary:

```text
reduzir risco técnico.
```

A/B:

```text
medir resultado de produto.
```

A distribuição pode parecer semelhante.

O objetivo e a análise são diferentes.

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

Depois:

```powershell
.\scripts\blue-green\verify-blue-green.ps1
```

---

### 2. Registrar as imagens

Defina:

```text
stable:

formacao-java/m16-integrations:5.0.0.

canary:

formacao-java/m16-integrations:5.1.0.

worker:

formacao-java/m16-integrations:5.0.0.
```

Use as tags e IDs reais do laboratório.

---

### 3. Criar properties de release

```java
package br.com.formacao.m17.release;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    prefix = "app.release"
)
public record ReleaseIdentityProperties(
    @NotBlank String color,
    @NotBlank String version
) {
}
```

Defaults:

```yaml
app:
  release:
    color:
      "${APP_RELEASE_COLOR:standalone}"

    version:
      "${APP_RELEASE_VERSION:unknown}"
```

---

### 4. Criar response header filter

Use `OncePerRequestFilter`.

Headers:

```text
X-Release-Color;

X-App-Version.
```

Aplique apenas quando:

```text
app.release.response-headers-enabled=true.
```

No laboratório:

```text
true.
```

Em ambiente real, a policy pode desativar.

---

### 5. Criar Actuator info contributor

Exponha:

```json
{
  "release": {
    "color": "canary",
    "version": "5.1.0"
  }
}
```

Não exponha:

- commit privado quando proibido;
- token;
- hostname sensível;
- secret;
- configuration dump.

---

### 6. Criar métricas

Counters:

```text
http.release.requests;

http.release.responses.
```

Tags controladas:

```text
release_color;

outcome;

method.
```

Evite path bruto com IDs.

Use route pattern quando disponível.

---

### 7. Criar logs

No início da aplicação:

```text
event=release.identity
color=canary
version=5.1.0
workers=false
```

Por request, prefira trace ou métrica.

Não gere INFO por cada request apenas para contar.

---

### 8. Criar testes de identidade

Teste:

- default standalone;
- stable;
- canary;
- headers habilitados;
- headers desabilitados;
- Actuator info;
- valores vazios rejeitados;
- tags permitidas.

---

### 9. Criar `compose.canary.yaml`

Serviços:

```yaml
name: m17-canary

services:
  postgres:
  kafka:
  app-worker:
  app-stable:
  app-canary:
  gateway:
```

Reutilize os padrões seguros da aula 514.

---

### 10. Configurar stable

```yaml
app-stable:
  image:
    "formacao-java/m16-integrations:${STABLE_IMAGE_TAG:-5.0.0}"

  environment:
    APP_RUNTIME_API_ENABLED:
      "true"

    APP_RUNTIME_WORKERS_ENABLED:
      "false"

    APP_RELEASE_COLOR:
      "stable"

    APP_RELEASE_VERSION:
      "${STABLE_IMAGE_TAG:-5.0.0}"

    APP_RELEASE_RESPONSE_HEADERS_ENABLED:
      "true"
```

Porta de diagnóstico:

```yaml
ports:
  - "127.0.0.1:18084:8084"
```

---

### 11. Configurar canary

```yaml
app-canary:
  image:
    "formacao-java/m16-integrations:${CANARY_IMAGE_TAG:-5.1.0}"

  environment:
    APP_RUNTIME_API_ENABLED:
      "true"

    APP_RUNTIME_WORKERS_ENABLED:
      "false"

    APP_RELEASE_COLOR:
      "canary"

    APP_RELEASE_VERSION:
      "${CANARY_IMAGE_TAG:-5.1.0}"

    APP_RELEASE_RESPONSE_HEADERS_ENABLED:
      "true"
```

Porta:

```yaml
ports:
  - "127.0.0.1:18085:8084"
```

---

### 12. Configurar worker

```text
APP_RELEASE_COLOR=worker;

APP_RUNTIME_WORKERS_ENABLED=true;

APP_RUNTIME_API_ENABLED=false.
```

Use a versão estável.

---

### 13. Criar configuração NGINX

Arquivo:

```text
default.conf
```

Conteúdo:

```nginx
include /etc/nginx/canary/active-weights.conf;

server {
    listen 8080;

    location / {
        proxy_pass http://canary_app;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For
            $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto
            $scheme;
        proxy_set_header X-Request-Id
            $request_id;

        proxy_connect_timeout 3s;
        proxy_read_timeout 30s;
    }
}
```

---

### 14. Criar pesos 100/0

Como um upstream com peso zero não é a baseline mais clara, o arquivo inicial terá apenas stable:

```nginx
upstream canary_app {
    server app-stable:8084;
}
```

Arquivo:

```text
weights-100-0.conf.
```

---

### 15. Criar pesos 99/1

```nginx
upstream canary_app {
    server app-stable:8084 weight=99;
    server app-canary:8084 weight=1;
}
```

---

### 16. Criar pesos 95/5

```nginx
upstream canary_app {
    server app-stable:8084 weight=19;
    server app-canary:8084 weight=1;
}
```

---

### 17. Criar pesos 90/10

```nginx
upstream canary_app {
    server app-stable:8084 weight=9;
    server app-canary:8084 weight=1;
}
```

Crie também:

```text
75/25:

3 para 1.

50/50:

1 para 1.

0/100:

somente canary.
```

---

### 18. Montar o gateway

Monte:

```text
nginx.conf;

default.conf;

active-weights.conf.
```

Publique:

```text
8084:8080.
```

Stable e canary permanecem na rede backend.

---

### 19. Iniciar a stack

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  up `
  --detach
```

Aguarde health de:

- Postgres;
- Kafka;
- worker;
- stable;
- canary;
- gateway.

---

### 20. Validar stable diretamente

```powershell
$response =
  Invoke-WebRequest `
    "http://127.0.0.1:18084/actuator/health"

$response.StatusCode
```

Valide headers em uma rota da aplicação ou endpoint permitido.

---

### 21. Validar canary diretamente

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:18085/actuator/info"
```

Confirme:

```text
color:
canary.

version:
candidata.
```

---

### 22. Validar worker único

Confirme:

- stable sem listeners;
- canary sem listeners;
- worker com listeners;
- uma execução de schedulers;
- um dispatcher;
- um recovery.

---

### 23. Iniciar com 100/0

Copie:

```text
weights-100-0.conf
```

para:

```text
active-weights.conf.
```

Valide:

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  exec `
  gateway `
  nginx `
  -t
```

Recarregue.

---

### 24. Criar script de peso

Arquivo:

```text
set-canary-weight.ps1
```

Parâmetros:

```text
-CanaryPercent;

-Reason.
```

Valores permitidos:

```text
0;

1;

5;

10;

25;

50;

100.
```

Fluxo:

1. validar percentual;
2. localizar arquivo;
3. criar temporário;
4. copiar;
5. validar NGINX;
6. restaurar em falha;
7. reload;
8. registrar ação;
9. validar gateway.

---

### 25. Promover para 1%

```powershell
.\scripts\canary\set-canary-weight.ps1 `
  -CanaryPercent `
  1 `
  -Reason `
  "Inicio do canary"
```

---

### 26. Gerar tráfego controlado

Crie um script que faça:

```text
1.000 requests
de leitura segura.
```

Cada request deve:

- usar timeout;
- fechar ou controlar conexão;
- registrar status;
- registrar release color;
- não criar dado.

Não use endpoint de negócio com efeito para contagem bruta.

---

### 27. Contar distribuição

Exemplo:

```powershell
$results |
  Group-Object ReleaseColor |
  Select-Object Name, Count
```

A distribuição não precisa ser exata.

Registre:

- total;
- stable;
- canary;
- erros;
- duração.

---

### 28. Criar gates

Arquivo:

```text
CANARY_GATES.md
```

Para cada etapa:

```markdown
## 1%

Mínimo:
- 1.000 requests.
- 10 minutos.
- health saudável.
- smoke funcional.

Go:
- nenhum 5xx novo;
- latência sem regressão relevante;
- sem restart;
- sem crescimento de quarantine;
- sem erro exclusivo da canary.

Abort:
- health unhealthy;
- erro funcional;
- 5xx exclusivo;
- corrupção;
- segurança;
- incompatibilidade.
```

Adapte para 5%, 10%, 25%, 50% e 100%.

---

### 29. Observar por variante

Arquivo:

```text
observe-canary.ps1
```

Colete:

- resposta por cor;
- health;
- logs;
- CPU;
- memória;
- 5xx;
- latência;
- Outbox;
- Inbox;
- retry;
- quarantine;
- Kafka lag.

O script precisa possuir timeout.

---

### 30. Promover para 5%

Somente após gate de 1%.

```powershell
.\scripts\canary\set-canary-weight.ps1 `
  -CanaryPercent `
  5 `
  -Reason `
  "Gate de 1 por cento aprovado"
```

Repita geração e observação.

---

### 31. Promover para 10%

Repita o gate.

Aumentar peso sem nova observação elimina o benefício do canary.

---

### 32. Simular falha exclusiva

Configure temporariamente a candidata com uma resposta de erro em um cenário controlado de teste.

Alternativa segura:

```text
feature flag local
que força erro
somente em endpoint de laboratório.
```

O endpoint precisa:

- existir apenas em profile de teste;
- não criar dado;
- não expor segredo;
- ser removido ou desabilitado depois.

---

### 33. Detectar a falha

Com 10%, o script deve identificar:

```text
5xx associado
a release_color=canary.
```

Stable permanece saudável.

O gate deve retornar:

```text
NO-GO.
```

---

### 34. Abortar o canary

Arquivo:

```text
abort-canary.ps1
```

Fluxo:

1. definir peso 0;
2. validar NGINX;
3. reload;
4. confirmar 100% stable;
5. manter canary ativa;
6. coletar evidências;
7. registrar motivo.

---

### 35. Corrigir a candidata

Restaure a configuração de teste.

Recrie apenas canary.

Valide diretamente.

Não altere stable.

---

### 36. Retomar rollout

Reinicie em:

```text
1%.
```

Não retome diretamente em 10% apenas porque a falha parece corrigida.

---

### 37. Promover para 25%

Após gates de 1%, 5% e 10%.

Observe o aumento de amostra e blast radius.

---

### 38. Promover para 50%

Nesse ponto, a candidata recebe metade do tráfego.

O rollback continua sendo reduzir seu peso para zero.

---

### 39. Promover para 100%

Arquivo:

```text
weights-0-100.conf
```

possui somente:

```nginx
upstream canary_app {
    server app-canary:8084;
}
```

Após a promoção:

- canary vira nova stable lógica;
- versão antiga permanece executando;
- nome dos services ainda não muda imediatamente;
- documentação registra a promoção.

---

### 40. Não remover stable imediatamente

Mantenha durante a janela pós-promoção.

Depois, a próxima release pode normalizar nomes.

O service `app-canary` pode tornar-se `app-stable` em uma manutenção planejada.

---

### 41. Criar script de promoção

Arquivo:

```text
promote-canary.ps1
```

O script:

- recebe sequência;
- exige aprovação por etapa;
- executa gate;
- não avança em NO-GO;
- registra evidências;
- permite hold;
- permite abort;
- não executa automaticamente em produção.

---

### 42. Criar script de validação

Arquivo:

```text
validate-canary.ps1
```

Valida:

- versão;
- cor;
- health;
- readiness;
- headers;
- schema;
- workers false;
- secrets;
- smoke;
- métricas.

---

### 43. Criar script de start

Arquivo:

```text
start-canary.ps1
```

Responsabilidades:

1. validar imagens;
2. validar secrets;
3. renderizar Compose;
4. iniciar dependências;
5. aguardar health;
6. iniciar worker;
7. iniciar stable;
8. iniciar canary;
9. iniciar gateway em 100/0;
10. executar validações diretas.

---

### 44. Criar script geral de verify

Arquivo:

```text
verify-canary.ps1
```

Valida:

- topologia;
- health;
- worker único;
- peso atual;
- tráfego;
- distribuição;
- métricas;
- abort path;
- promotion path;
- ausência de configuração de teste.

---

### 45. Criar arquitetura

Arquivo:

```text
CANARY_ARCHITECTURE.md
```

Diagrama:

```text
                         +----------------+
host :8084 ------------> | gateway        |
                         +-------+--------+
                                 |
                       weighted requests
                         /               \
                        v                 v
                 app-stable         app-canary
                   workers=false      workers=false
                        \                 /
                         +-------+-------+
                                 |
                            PostgreSQL

app-worker
workers=true
     |
  Kafka
```

Detalhe o fluxo completo no documento.

---

### 46. Criar plano de release

Arquivo:

```text
CANARY_RELEASE_PLAN.md
```

Inclua:

- stable;
- canary;
- worker;
- sequência;
- gates;
- owners;
- horários;
- observação;
- abort;
- promoção;
- evidência;
- comunicação.

---

### 47. Criar plano de aborto

Arquivo:

```text
CANARY_ABORT_PLAN.md
```

Inclua:

- sinais;
- comando;
- validação;
- coleta;
- canary preservada;
- stable confirmada;
- incident owner;
- próximos passos.

---

### 48. Criar plano de promoção

Arquivo:

```text
CANARY_PROMOTION_PLAN.md
```

Defina:

- 1%;
- 5%;
- 10%;
- 25%;
- 50%;
- 100%;
- gate por etapa;
- hold;
- no-go;
- pós-promoção.

---

### 49. Criar matriz de teste

Arquivo:

```text
CANARY_TEST_MATRIX.md
```

Cenários:

- 100/0;
- 99/1;
- 95/5;
- 90/10;
- 75/25;
- 50/50;
- 0/100;
- canary unhealthy;
- stable unhealthy;
- gateway reload inválido;
- worker parado;
- PostgreSQL indisponível;
- Kafka indisponível;
- erro exclusivo canary;
- abort;
- retomar;
- promoção.

---

### 50. Criar troubleshooting

Arquivo:

```text
CANARY_TROUBLESHOOTING.md
```

Inclua:

- distribuição inesperada;
- keep-alive;
- amostra pequena;
- header ausente;
- versão incorreta;
- duas versões com workers;
- canary sem métricas;
- NGINX config inválida;
- peso não aplicado;
- 502;
- stable unhealthy;
- canary unhealthy;
- abort incompleto;
- tag errada;
- schema incompatível;
- feature flag divergente.

---

### 51. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Renderize:

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  config
```

Execute:

```powershell
.\scripts\canary\verify-canary.ps1
```

Faça:

```text
1%;

5%;

10%;

falha;

abort;

retomada;

100%.
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### A candidata recebeu exposição limitada

O primeiro erro não atingiu todo o tráfego.

### Stable virou baseline

Métricas da candidata puderam ser comparadas.

### Pesos viraram etapas

Cada percentual possui gate próprio.

### Identidade de release ficou observável

Headers, logs, info e métricas distinguem variantes.

### Workers permaneceram únicos

A exposição HTTP não duplicou efeitos assíncronos.

### Estado permaneceu compartilhado

Stable e canary operaram sobre o mesmo PostgreSQL.

### Falha exclusiva foi detectada

O gate identificou erro somente na candidata.

### Abort ficou rápido

Peso canary voltou a zero sem derrubar stable.

### Promoção foi progressiva

100% aconteceu somente após evidência acumulada.

### A próxima aula ganhou base

Rollback seguro aprofundará retorno além do peso do gateway.

---

## Erros comuns importantes

### Usar amostra mínima demais

A ausência de erro não significa segurança.

### Chamar pesos de percentual exato

A distribuição é aproximada.

### Não segmentar métricas

Erro da canary se mistura com stable.

### Executar workers nas duas versões

Efeitos assíncronos duplicam ou dividem carga.

### Aumentar várias etapas de uma vez

O rollout deixa de ser progressivo.

### Automatizar promoção sem gates confiáveis

A falha avança mais rápido.

### Tratar health verde como sucesso completo

Erros funcionais podem permanecer.

### Usar endpoint com efeito para gerar volume

O teste cria estado desnecessário.

### Remover stable após 100%

O retorno rápido desaparece.

### Confundir canary com A/B

Objetivos e análise são diferentes.

### Usar ID único como tag

A cardinalidade explode.

### Antecipar rollback completo

A aula 516 possui esse objetivo.

---

## Comandos úteis

### Renderizar stack

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  config
```

### Subir stack

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  up `
  -d
```

### Validar NGINX

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  exec `
  gateway `
  nginx `
  -t
```

### Recarregar

```powershell
docker compose `
  -f `
  "compose.canary.yaml" `
  exec `
  gateway `
  nginx `
  -s `
  reload
```

### Alterar peso

```powershell
.\scripts\canary\set-canary-weight.ps1 `
  -CanaryPercent `
  10 `
  -Reason `
  "Gate de 5 por cento aprovado"
```

---

## Exercício guiado

### Parte 1 — Identidade

Adicione color e version.

### Parte 2 — Topologia

Crie stable, canary e worker.

### Parte 3 — Gateway

Configure pesos.

### Parte 4 — Baseline

Inicie em 100/0.

### Parte 5 — Exposição

Promova para 1%.

### Parte 6 — Evidência

Conte respostas e métricas.

### Parte 7 — Progressão

Avance por gates.

### Parte 8 — Falha

Produza erro exclusivo.

### Parte 9 — Abort

Retire a candidata.

### Parte 10 — Promoção

Chegue a 100%.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 514 foi preservada;
- stable foi definida;
- canary foi definida;
- weighted round robin foi explicado;
- percentual aproximado foi explicado;
- sample size foi discutido;
- baseline comparison foi definida;
- blast radius foi discutido;
- hold foi definido;
- abort foi definido;
- promotion foi definida;
- stable e canary compartilham estado;
- workers permanecem isolados;
- schema freeze foi preservado;
- identidade de release foi criada;
- properties de release foram criadas;
- color foi validada;
- version foi validada;
- headers foram criados;
- headers podem ser desativados;
- Actuator info foi criado;
- segredo não foi exposto;
- métricas por variante foram criadas;
- tags controladas foram usadas;
- IDs únicos não viraram tags;
- logs de startup foram criados;
- testes de identidade foram criados;
- Compose canary foi criado;
- PostgreSQL foi preservado;
- Kafka foi preservado;
- worker único foi preservado;
- app-stable foi criada;
- app-canary foi criada;
- gateway foi criado;
- stable possui workers false;
- canary possui workers false;
- worker possui workers true;
- stable possui release color;
- canary possui release color;
- worker possui release color;
- portas diretas foram limitadas ao laboratório;
- configuração NGINX foi criada;
- upstream 100/0 foi criado;
- upstream 99/1 foi criado;
- upstream 95/5 foi criado;
- upstream 90/10 foi criado;
- upstream 75/25 foi criado;
- upstream 50/50 foi criado;
- upstream 0/100 foi criado;
- gateway iniciou em 100/0;
- stable foi validada diretamente;
- canary foi validada diretamente;
- worker único foi validado;
- script de peso foi criado;
- percentuais permitidos foram validados;
- alteração usa arquivo temporário;
- NGINX config foi validada;
- reload foi executado;
- rollout começou em 1%;
- tráfego controlado foi gerado;
- endpoint sem efeito foi usado;
- respostas foram segmentadas;
- distribuição foi registrada;
- exatidão absoluta não foi exigida;
- gates foram criados;
- quantidade mínima foi definida;
- tempo mínimo foi definido;
- cenários obrigatórios foram definidos;
- critérios de go foram definidos;
- critérios de abort foram definidos;
- health foi observado;
- HTTP 5xx foi observado;
- latência foi observada;
- Outbox foi observada;
- Inbox foi observada;
- retries foram observados;
- quarantine foi observada;
- Kafka lag foi observado;
- CPU e memória foram observadas;
- promoção para 5% foi executada;
- promoção para 10% foi executada;
- falha exclusiva foi simulada;
- erro canary foi identificado;
- gate retornou NO-GO;
- abort foi executado;
- peso canary voltou a zero;
- stable recebeu 100%;
- canary permaneceu para investigação;
- candidata foi corrigida;
- retomada começou em 1%;
- promoção para 25% foi executada;
- promoção para 50% foi executada;
- promoção para 100% foi executada;
- stable não foi removida imediatamente;
- script de promoção foi criado;
- script de validação foi criado;
- script de start foi criado;
- script geral de verify foi criado;
- arquitetura foi documentada;
- release plan foi criado;
- abort plan foi criado;
- promotion plan foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- sticky routing não foi implementado;
- tenant targeting não foi implementado;
- A/B não foi implementado;
- auto-promotion não foi implementada;
- rollback seguro não foi antecipado;
- migration não foi implementada;
- Kubernetes não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 516 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.canary.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/deploy/nginx-canary `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/br/com/formacao/m17/release `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java/br/com/formacao/m17/release `
  scripts/canary `
  docs/devops/canary `
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
git commit -m "build(m17): implementar canary deployment"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret local;
- `.env`;
- app env local;
- banco;
- volume;
- logs brutos;
- resultado temporário;
- configuração de falha;
- arquivo NGINX temporário;
- imagem exportada;
- rollback avançado da aula 516.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a candidata deixou de receber tudo ou nada.

A topologia passou a possuir:

```text
stable;

canary;

gateway ponderado;

worker único;

estado compartilhado;

identidade;

gates;

abort;

promoção.
```

Você comprovou que:

- blue-green troca todo o tráfego;
- canary expõe uma parcela;
- pesos produzem aproximações;
- amostra e tempo precisam ser definidos;
- stable fornece baseline;
- canary precisa de métricas separadas;
- workers não seguem percentuais HTTP;
- cada etapa precisa de go/no-go;
- erro exclusivo da candidata pode ser detectado;
- abort reduz o peso para zero;
- retomada volta ao início;
- promoção a 100% exige evidência acumulada;
- stable permanece disponível após a promoção.

A próxima aula será:

```text
516 - M17.11 - Rollback seguro
```

Nela, você irá aprofundar o retorno de versão considerando artefato, configuração, estado, compatibilidade, evidências e decisão entre rollback e roll-forward.

Nenhum rollback seguro completo foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei stable e canary.
- [ ] Mantive worker único.
- [ ] Configurei pesos.
- [ ] Segmentei métricas.
- [ ] Criei gates.
- [ ] Simulei falha.
- [ ] Executei abort e promoção.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A distribuição não bate com o peso

A amostra pode ser pequena ou as conexões podem influenciar.

### Canary não recebe tráfego

Revise upstream ativo, reload e health.

### Stable recebe menos que o esperado

Revise pesos e falhas de upstream.

### Headers não aparecem

Revise filter, flag e profile.

### Métricas não distinguem variantes

A tag de release não foi aplicada.

### Workers aparecem na canary

A runtime role está incorreta.

### Abort não zera o tráfego

O arquivo ativo ou reload falhou.

### NGINX retorna 502

Um upstream está indisponível ou o DNS falhou.

### A candidata falha apenas sob carga

Aumente observação e preserve evidências.

### Promoção avançou após NO-GO

O script não aplicou o gate corretamente.

### Stable foi parada cedo

Restaure a imagem e revise a janela pós-promoção.

### O teste de falha ficou habilitado

Remova a configuração antes do commit.

---

## Perguntas de revisão

1. O que é stable?
2. O que é canary?
3. Como o gateway distribui tráfego?
4. O peso garante percentual exato?
5. Por que definir amostra mínima?
6. Por que comparar com stable?
7. O que é blast radius?
8. O que é hold?
9. O que é abort?
10. O que é promoção?
11. Por que segmentar métricas?
12. Workers entram no canary HTTP?
13. O que é release color?
14. Por que usar endpoint sem efeito?
15. O que acontece em NO-GO?
16. De onde retomar após correção?
17. 100% encerra a observação?
18. Canary é igual a A/B?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Versão conhecida.
2. Versão candidata parcial.
3. Pesos do upstream.
4. Não.
5. Produzir evidência.
6. Ter baseline.
7. Alcance da falha.
8. Pausar progressão.
9. Retirar candidata.
10. Aumentar exposição.
11. Identificar regressão.
12. Não.
13. Identidade controlada.
14. Não criar estado.
15. Peso volta a zero.
16. Em baixa exposição.
17. Não.
18. Não.
19. Rollback completo e migrations.
20. Rollback seguro.

---

## Desafio opcional

Modele um canary determinístico por header apenas para testes internos.

Requisitos:

- header protegido;
- clientes comuns não controlam a rota;
- default permanece weighted;
- stable e canary continuam healthy;
- logs registram decisão;
- nenhuma autorização depende do header;
- nenhuma exposição produtiva;
- testes de header ausente, válido e inválido;
- documentação do risco de bypass.

Não implemente sticky session ou segmentação de usuário.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 515 - M17.10 - Canary deployment

- Continuei após blue-green deployment.
- Diferenciei troca total de exposição parcial.
- Defini stable e canary.
- Mantive PostgreSQL e Kafka compartilhados.
- Mantive um worker estável e único.
- Desativei workers nas APIs.
- Criei identidade de release.
- Adicionei release color e version.
- Criei headers de laboratório.
- Criei Actuator info seguro.
- Criei métricas por variante.
- Evitei tags de alta cardinalidade.
- Criei `compose.canary.yaml`.
- Declarei app-stable e app-canary.
- Criei gateway NGINX ponderado.
- Criei pesos 100/0, 99/1, 95/5, 90/10, 75/25, 50/50 e 0/100.
- Iniciei a stack em 100/0.
- Validei stable e canary diretamente.
- Confirmei worker único.
- Criei script de alteração de peso.
- Promovi para 1%.
- Gerei tráfego sem efeito colateral.
- Contei respostas por release color.
- Registrei distribuição aproximada.
- Criei gates com amostra e tempo.
- Observei health, erros, latência, backlog e recursos.
- Promovi para 5% e 10%.
- Simulei falha exclusiva da canary.
- Detectei NO-GO.
- Executei abort para 0%.
- Mantive canary para investigação.
- Corrigi e retomei em 1%.
- Promovi para 25%, 50% e 100%.
- Mantive stable durante a observação.
- Criei scripts de start, validate, weight, observe, abort, promote e verify.
- Documentei arquitetura, gates, abort, promoção e troubleshooting.
- Não antecipei rollback seguro completo.
- Próxima aula: Rollback seguro.
```

---

## Referência técnica curta

- Canary Deployment.
- Weighted Round Robin.
- NGINX Upstream Weights.
- Progressive Delivery.
- Release Gates.
- Baseline Comparison.
- Blast Radius.
- Statistical Sample Size.
- Feature Flags.
- Immutable Infrastructure.

Regra final:

```text
canary deployment reduz o blast radius ao expor a candidata por etapas: `app-stable` e `app-canary` compartilham PostgreSQL e Kafka, executam somente API e mantêm `app-worker` estável como único responsável por publishers, consumers, dispatchers e recoveries; o gateway NGINX usa upstreams ponderados para 100/0, 99/1, 95/5, 90/10, 75/25, 50/50 e 0/100, reconhecendo que pesos geram distribuição aproximada e exigem amostra, tempo e cenários mínimos; release color, headers controlados, Actuator info, logs e métricas segmentam stable e canary sem IDs de alta cardinalidade; cada etapa possui gate de health, função, 5xx, latência, backlog, retry, quarantine, lag e recursos; falha exclusiva produz NO-GO e aborta o canary com peso zero, mantendo a candidata para investigação e retomando o rollout em baixa exposição após correção; 100% acontece somente após evidência acumulada e a stable permanece disponível durante a observação; rollback completo de artefato, configuração e estado fica reservado para a aula 516.
```
