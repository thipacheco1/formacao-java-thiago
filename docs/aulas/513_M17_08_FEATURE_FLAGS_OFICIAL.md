# 513 - M17.08 - Feature flags

## Apresentação da aula

Na aula 512, você estudou os fundamentos de release strategy.

O fluxo de uma release passou a ser compreendido como:

```text
build;

identificação;

validação;

planejamento;

go/no-go;

promoção;

observação;

decisão;

rollback
ou roll-forward.
```

Você também diferenciou:

```text
deploy;

release;

rollout;

rollback;

roll-forward.
```

Essa diferença prepara o tema desta aula.

Até agora, uma nova versão da aplicação normalmente significa:

```text
novo código implantado;

novo comportamento disponível
imediatamente.
```

Nesse modelo:

```text
deploy
e
release

acontecem juntos.
```

Feature flags permitem separar esses momentos.

A versão pode ser implantada com um comportamento novo ainda desativado.

Depois, uma decisão operacional ativa o comportamento.

A pergunta central desta aula será:

```text
como disponibilizar
um código novo

sem obrigar
que ele seja usado
por todos imediatamente?
```

A resposta será:

```text
feature flags.
```

Uma feature flag é uma decisão executada em runtime.

Ela responde:

```text
para este contexto,
qual comportamento
deve ser utilizado?
```

Exemplos:

```text
habilitar novo endpoint;

usar novo algoritmo;

enviar novo template;

ativar integração;

liberar comportamento
para uma parcela controlada;

desligar rapidamente
uma funcionalidade problemática.
```

A aplicação do laboratório já possui um bom cenário para uma flag.

Ela cria uma intenção de notificação e chama um provider HTTP fake.

Nesta aula, será criada a flag:

```text
notification.provider.v2-enabled.
```

Quando desativada:

```text
o dispatcher usa
o fluxo atual V1.
```

Quando ativada:

```text
o dispatcher usa
um comportamento V2 controlado.
```

A V2 será deliberadamente pequena e observável.

Ela poderá:

- enviar um header de versão de template;
- selecionar um template V2;
- usar um mapper V2;
- registrar uma métrica específica;
- manter a mesma porta `NotificationProvider`;
- preservar idempotência;
- preservar retry;
- preservar quarantine.

A flag não alterará:

- topic Kafka;
- event ID;
- Outbox;
- Inbox;
- sourceEventId;
- idempotency key;
- lifecycle da intent;
- contrato HTTP público da OS;
- semântica de retry.

Isso é importante.

Uma feature flag deve isolar a mudança que se deseja controlar.

Ela não deve duplicar a arquitetura inteira.

A aula trabalhará com cinco categorias de flags:

```text
release flag;

operational flag;

experiment flag;

permission flag;

kill switch.
```

A flag principal será uma:

```text
release flag.
```

Ela será temporária.

Depois que a V2 estiver estável e totalmente liberada:

```text
a flag precisa ser removida.
```

Flags temporárias esquecidas criam dívida técnica.

Elas aumentam:

- caminhos de execução;
- combinações de teste;
- complexidade;
- risco;
- dificuldade de troubleshooting;
- dependência de configuração histórica.

A aula também criará um kill switch específico:

```text
notification.dispatch.enabled.
```

Quando desativado:

```text
o dispatcher não chama
o provider;

as intents permanecem
em estado recuperável.
```

Esse kill switch não marcará a notificação como enviada.

Ele não apagará a intent.

Ele não perderá a evidência.

O objetivo é interromper um efeito externo sem destruir o trabalho.

A aula não criará um serviço remoto de feature flags.

A primeira implementação utilizará:

```text
Spring Boot ConfigurationProperties;

valores externos;

Compose;

env_file;

testes;

métricas;

logs;

auditoria documental.
```

Essa escolha permite compreender os fundamentos antes de adotar ferramentas como:

- Unleash;
- LaunchDarkly;
- OpenFeature;
- Config Server;
- provider cloud;
- banco de flags;
- streaming de configuração.

A aula também diferenciará:

```text
flag estática de startup;

flag dinâmica.
```

A baseline utilizará flags de startup.

Para mudar a flag:

```text
a configuração muda;

o container é recriado.
```

Essa abordagem não oferece ativação instantânea.

Ela é previsível e suficiente para o laboratório.

Flags dinâmicas serão discutidas conceitualmente.

Não será criado um endpoint administrativo que altera flags sem autenticação.

Não será criado um mapa global mutável.

Não será criado polling improvisado em arquivo.

Não será usada reflection para descobrir flags.

Não será implementado percentage rollout real.

Esses assuntos exigem infraestrutura e controles adicionais.

A próxima aula será:

```text
514 - M17.09 - Blue green deployment
```

Portanto, esta aula não criará:

- dois ambientes completos;
- proxy;
- troca de tráfego;
- serviço blue;
- serviço green;
- promoção de rota;
- rollback por switch de tráfego.

O foco será:

```text
separar deploy de release
dentro da aplicação.
```

Ao final, você deverá explicar:

```text
o que é feature flag;

por que deploy
pode acontecer
antes da release;

qual a diferença
entre release flag
e kill switch;

por que defaults
precisam ser seguros;

como testar
os dois caminhos;

como observar
qual variante executou;

como impedir
que a flag quebre
idempotência;

como ativar
e reverter;

quando remover
a flag.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
511:
Healthcheck em containers.

512:
Release strategy fundamentos.

513:
Feature flags.

514:
Blue green deployment.

515:
Canary release.
```

A aula 512 respondeu:

```text
como promover
uma nova versão
com critérios,
observação
e rollback?
```

A aula 513 responderá:

```text
como implantar
o código novo

e controlar
quando o comportamento
fica ativo?
```

Nesta aula:

```text
feature flag:
sim.

release flag:
sim.

kill switch:
sim.

flag tipada:
sim.

configuração externa:
sim.

Compose:
sim.

defaults seguros:
sim.

testes:
sim.

métricas:
sim.

logs:
sim.

auditoria:
sim.

plano de remoção:
sim.

flag dinâmica:
conceitual.

percentage rollout:
conceitual.

provider remoto:
não.

endpoint administrativo:
não.

blue-green:
não.

canary:
não.

CI:
não.
```

A regra central será:

```text
a flag controla
um comportamento pequeno
e observável;

não substitui
arquitetura,
autorização,
teste
ou rollback.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou revisados:

```text
src/main/java/br/com/formacao/m17/featureflags
├── FeatureFlagKey.java
├── FeatureFlagDecision.java
├── FeatureFlagService.java
├── ConfigBackedFeatureFlagService.java
├── FeatureFlagProperties.java
└── FeatureFlagMetrics.java

src/main/java/br/com/formacao/m16/architecture/os/notification
├── dispatch/NotificationDispatchWorker.java
├── provider/NotificationProvider.java
├── provider/NotificationProviderV1Adapter.java
└── provider/NotificationProviderV2Adapter.java

src/test/java/br/com/formacao/m17/featureflags
├── FeatureFlagPropertiesTest.java
├── ConfigBackedFeatureFlagServiceTest.java
├── NotificationProviderReleaseFlagTest.java
├── NotificationDispatchKillSwitchTest.java
└── FeatureFlagObservabilityTest.java
```

Configuração:

```text
application.yaml
application-container.yaml
config/app.env.example
compose.yaml
```

Documentação:

```text
docs/devops/feature-flags
├── FEATURE_FLAG_POLICY.md
├── FEATURE_FLAG_CATALOG.md
├── FEATURE_FLAG_ROLLOUT_PLAN.md
├── FEATURE_FLAG_REMOVAL_PLAN.md
├── FEATURE_FLAG_TEST_MATRIX.md
├── FEATURE_FLAG_OPERATIONS.md
└── FEATURE_FLAG_TROUBLESHOOTING.md
```

Scripts:

```text
scripts/feature-flags
├── set-local-feature-flag.ps1
├── verify-feature-flag.ps1
└── rollback-feature-flag.ps1
```

Ao final, você terá:

```text
flags tipadas;

defaults seguros;

V1 e V2 isoladas;

kill switch;

testes dos dois caminhos;

métricas por variante;

logs sem cardinalidade alta;

ativação por configuração;

rollback por configuração;

catálogo;

owner;

expiry;

plano de remoção.
```

Você irá:

1. confirmar a baseline;
2. classificar flags;
3. criar catálogo;
4. definir naming;
5. criar keys tipadas;
6. criar properties;
7. criar service;
8. criar decisão;
9. definir defaults;
10. criar flag V2;
11. criar kill switch;
12. separar adapters;
13. preservar provider port;
14. preservar idempotência;
15. preservar lifecycle;
16. adicionar logs;
17. adicionar métricas;
18. evitar alta cardinalidade;
19. testar V1;
20. testar V2;
21. testar kill switch;
22. testar configuração inválida;
23. adicionar config externa;
24. ativar em Compose;
25. recriar app;
26. validar V2;
27. reverter;
28. validar V1;
29. criar scripts;
30. criar plano de rollout;
31. criar plano de remoção;
32. executar gate;
33. commitar;
34. preparar a aula 514.

---

## Conceito essencial

### Feature flag

Feature flag é uma decisão condicional aplicada em runtime.

Forma simples:

```java
if (
    featureFlagService.isEnabled(
        FeatureFlagKey
            .NOTIFICATION_PROVIDER_V2
    )
) {
    useV2();
} else {
    useV1();
}
```

O `if` não deve aparecer espalhado pela aplicação.

A decisão precisa ficar próxima do boundary controlado.

---

### Release flag

Controla a liberação de uma mudança nova.

Características:

- temporária;
- possui owner;
- possui data de remoção;
- possui rollout;
- possui rollback;
- possui testes dos dois caminhos.

Exemplo:

```text
notification.provider.v2-enabled.
```

---

### Operational flag

Controla comportamento operacional.

Exemplo:

```text
notification.dispatch.enabled.
```

Pode permanecer por mais tempo.

Ainda precisa de owner e documentação.

---

### Kill switch

Kill switch interrompe rapidamente um comportamento de risco.

Ele precisa falhar de forma segura.

No laboratório:

```text
dispatch desativado;

intents permanecem
em READY_TO_SEND
ou RETRY_WAIT;

nenhuma intent
é marcada como SENT.
```

---

### Experiment flag

Permite comparar variantes.

Exemplo:

```text
template A;

template B.
```

Exige:

- assignment;
- persistência da variante;
- métricas;
- objetivo;
- análise;
- ética;
- privacidade.

Não será implementada nesta aula.

---

### Permission flag

Controla acesso por identidade ou entitlement.

Ela não substitui autorização.

Um usuário sem permissão não deve ganhar acesso apenas porque uma flag está ativa.

---

### Flag estática

É avaliada a partir de configuração carregada no startup.

Vantagens:

- simples;
- previsível;
- testável;
- sem dependência remota.

Limitações:

- mudança exige restart ou recreate;
- não permite rollout instantâneo;
- não possui targeting sofisticado.

---

### Flag dinâmica

Pode mudar sem restart.

Exige:

- provider;
- cache;
- timeout;
- fallback;
- observabilidade;
- segurança;
- auditoria;
- consistência;
- estratégia quando provider falha.

---

### Default seguro

Quando a flag está ausente, o sistema precisa escolher um comportamento conhecido.

Para a release flag:

```text
V2 default:
false.
```

Para o kill switch:

```text
dispatch enabled default:
true.
```

O default precisa preservar o comportamento anterior.

---

### Fail-open e fail-closed

Quando o provider de flags falha:

#### Fail-open

Ativa ou mantém o comportamento permissivo.

#### Fail-closed

Desativa ou bloqueia.

A escolha depende do risco.

Na baseline estática:

```text
config ausente
usa default explícito.
```

Para segurança e autorização, normalmente a decisão precisa ser conservadora.

---

### Flag key

Keys precisam ser estáveis.

Exemplo:

```text
notification.provider.v2-enabled.
```

Evite:

- nomes genéricos;
- nomes por ticket;
- abreviações obscuras;
- nomes negativos duplos;
- nomes de pessoa.

---

### Contexto

Algumas flags usam contexto:

```text
customer;

tenant;

region;

user;

request;

percentage.
```

A baseline desta aula não usa contexto individual.

A flag é global para a instância.

---

### Variant

Variant identifica o caminho executado.

No laboratório:

```text
V1;

V2;

DISABLED.
```

A variant pode aparecer em:

- log;
- métrica;
- evidência.

Ela deve possuir conjunto controlado.

---

### Observabilidade

Toda flag importante precisa responder:

```text
qual valor está ativo?

qual variante executou?

quantas vezes?

qual erro ocorreu?

quando mudou?

quem mudou?

qual efeito?
```

Não use `customerId` ou `correlationId` como tag de flag.

---

### Auditoria

A configuração local será alterada por Git ignorado e script.

O script registrará:

- flag;
- valor anterior;
- novo valor;
- data;
- operador;
- motivo;
- versão.

Ele não registrará segredo.

---

### Dívida de flag

Uma release flag que permanece depois do rollout completo cria código morto.

Cada flag precisa de:

- owner;
- created date;
- expiry date;
- removal condition;
- issue de remoção;
- testes;
- documentação.

---

### Combinação de flags

Duas flags booleanas geram até quatro combinações.

Dez flags podem gerar muitas combinações.

Evite flags sobrepostas na mesma área sem matriz de teste.

Nesta aula:

```text
provider V2;

dispatch enabled.
```

A matriz terá três cenários relevantes:

```text
dispatch false;

dispatch true + V1;

dispatch true + V2.
```

---

### Idempotência

A variante não pode alterar a identidade lógica.

A mesma intent precisa continuar usando:

```text
sourceEventId
como idempotency key.
```

Se uma tentativa V1 falha e a flag muda para V2 antes do retry:

```text
a mesma identidade
continua.

o comportamento de payload
precisa ser compatível
com o provider.
```

A aula documentará essa transição.

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

Valide a stack atual:

```powershell
.\scripts\health\verify-healthchecks.ps1
```

---

### 2. Criar catálogo de flags

Arquivo:

```text
FEATURE_FLAG_CATALOG.md
```

Tabela:

```markdown
| Key | Tipo | Default | Owner | Expiry |
|---|---|---:|---|---|
| notification.provider.v2-enabled | Release | false | Notification | 30 dias após rollout |
| notification.dispatch.enabled | Kill switch | true | Operations | Revisão trimestral |
```

---

### 3. Criar enum de keys

```java
package br.com.formacao.m17.featureflags;

public enum FeatureFlagKey {

    NOTIFICATION_PROVIDER_V2(
        "notification.provider.v2-enabled"
    ),

    NOTIFICATION_DISPATCH_ENABLED(
        "notification.dispatch.enabled"
    );

    private final String propertyName;

    FeatureFlagKey(
        String propertyName
    ) {
        this.propertyName =
            propertyName;
    }

    public String propertyName() {
        return propertyName;
    }
}
```

A enum centraliza identidade.

Ela não precisa conhecer Spring.

---

### 4. Criar properties

```java
package br.com.formacao.m17.featureflags;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
    prefix = "app.features"
)
public record FeatureFlagProperties(
    Notification notification
) {

    public record Notification(
        Provider provider,
        Dispatch dispatch
    ) {
    }

    public record Provider(
        boolean v2Enabled
    ) {
    }

    public record Dispatch(
        boolean enabled
    ) {
    }
}
```

Adapte nomes ao padrão real do projeto.

---

### 5. Definir defaults

No `application.yaml`:

```yaml
app:
  features:
    notification:
      provider:
        v2-enabled:
          false

      dispatch:
        enabled:
          true
```

Esses defaults preservam o comportamento atual.

---

### 6. Criar decisão de flag

```java
package br.com.formacao.m17.featureflags;

public record FeatureFlagDecision(
    FeatureFlagKey key,
    boolean enabled,
    String variant,
    String source
) {
}
```

Valores controlados:

```text
variant:
V1,
V2,
ENABLED,
DISABLED.

source:
CONFIG.
```

---

### 7. Criar o serviço

```java
package br.com.formacao.m17.featureflags;

public interface FeatureFlagService {

    FeatureFlagDecision evaluate(
        FeatureFlagKey key
    );

    default boolean isEnabled(
        FeatureFlagKey key
    ) {
        return evaluate(key)
            .enabled();
    }
}
```

---

### 8. Implementar provider por configuração

```java
package br.com.formacao.m17.featureflags;

import org.springframework.stereotype.Component;

@Component
public class ConfigBackedFeatureFlagService
    implements FeatureFlagService {

    private final FeatureFlagProperties properties;

    public ConfigBackedFeatureFlagService(
        FeatureFlagProperties properties
    ) {
        this.properties = properties;
    }

    @Override
    public FeatureFlagDecision evaluate(
        FeatureFlagKey key
    ) {
        return switch (key) {
            case NOTIFICATION_PROVIDER_V2 ->
                providerV2();

            case NOTIFICATION_DISPATCH_ENABLED ->
                dispatch();
        };
    }

    private FeatureFlagDecision providerV2() {
        boolean enabled =
            properties
                .notification()
                .provider()
                .v2Enabled();

        return new FeatureFlagDecision(
            FeatureFlagKey
                .NOTIFICATION_PROVIDER_V2,
            enabled,
            enabled ? "V2" : "V1",
            "CONFIG"
        );
    }

    private FeatureFlagDecision dispatch() {
        boolean enabled =
            properties
                .notification()
                .dispatch()
                .enabled();

        return new FeatureFlagDecision(
            FeatureFlagKey
                .NOTIFICATION_DISPATCH_ENABLED,
            enabled,
            enabled ? "ENABLED" : "DISABLED",
            "CONFIG"
        );
    }
}
```

---

### 9. Separar adapters V1 e V2

Preserve a porta:

```java
public interface NotificationProvider {

    NotificationProviderResult send(
        NotificationProviderRequest request
    );
}
```

Crie adapters internos:

```text
NotificationProviderV1Adapter;

NotificationProviderV2Adapter.
```

Eles podem compartilhar o mesmo client HTTP.

Não duplique:

- timeout;
- autenticação;
- retry;
- classificação;
- idempotency key.

A diferença deve ficar no mapper ou template.

---

### 10. Criar router do provider

```java
@Component
public class FeatureFlaggedNotificationProvider
    implements NotificationProvider {

    private final FeatureFlagService flags;
    private final NotificationProviderV1Adapter v1;
    private final NotificationProviderV2Adapter v2;

    @Override
    public NotificationProviderResult send(
        NotificationProviderRequest request
    ) {
        FeatureFlagDecision decision =
            flags.evaluate(
                FeatureFlagKey
                    .NOTIFICATION_PROVIDER_V2
            );

        return decision.enabled()
            ? v2.send(request)
            : v1.send(request);
    }
}
```

O dispatcher continua dependendo da porta.

---

### 11. Definir diferença V2

Uma diferença controlada:

```text
templateCode:

V1:
SERVICE_ORDER_NOTIFICATION_V1.

V2:
SERVICE_ORDER_NOTIFICATION_V2.
```

A idempotency key permanece:

```text
sourceEventId.
```

Headers de correlação permanecem.

---

### 12. Aplicar o kill switch

Antes de claim ou antes da chamada externa, escolha um ponto seguro.

A baseline será:

```text
antes de claimar novas intents.
```

Se dispatch estiver desativado:

```text
worker encerra a rodada;

nenhuma intent muda
para SENDING.
```

Pseudo-fluxo:

```java
if (
    !flags.isEnabled(
        FeatureFlagKey
            .NOTIFICATION_DISPATCH_ENABLED
    )
) {
    metrics.recordDispatchDisabled();
    return;
}
```

---

### 13. Preservar recovery

Intents existentes em:

```text
SENDING
```

não podem ficar presas por causa do kill switch.

O stale claim recovery continua ativo.

O kill switch bloqueia novos efeitos.

Ele não desliga recuperação administrativa.

---

### 14. Criar métricas

Métricas sugeridas:

```text
feature.flag.evaluations;

notification.provider.variant;

notification.dispatch.disabled;
```

Tags controladas:

```text
flag;

enabled;

variant;

source.
```

Keys e variants pertencem a enums ou allowlists.

---

### 15. Evitar cardinalidade

Não use como tags:

- correlationId;
- eventId;
- serviceOrderId;
- customerId;
- intentId;
- user;
- motivo livre;
- arquivo de configuração;
- hostname arbitrário.

---

### 16. Criar logs

Evento de avaliação operacional:

```text
event=feature_flag.evaluated
flag=notification.provider.v2-enabled
enabled=true
variant=V2
source=CONFIG
```

Evite logar em todas as chamadas com nível INFO quando o volume for alto.

Opções:

- DEBUG por avaliação;
- INFO na inicialização;
- counter por execução;
- log de mudança no script.

---

### 17. Criar endpoint de catálogo seguro

Não crie endpoint de alteração.

Um endpoint de leitura pode existir somente se:

- protegido;
- sem segredo;
- sem contexto individual;
- necessário operacionalmente.

Na baseline, prefira:

```text
Actuator info customizado
ou logs de startup.
```

Não exponha flags publicamente sem necessidade.

---

### 18. Configurar o container

No:

```text
config/app.env.example
```

adicione:

```dotenv
APP_FEATURES_NOTIFICATION_PROVIDER_V2_ENABLED=false
APP_FEATURES_NOTIFICATION_DISPATCH_ENABLED=true
```

Spring Boot mapeia os nomes para as properties.

---

### 19. Testar defaults

Sem as variáveis:

```text
provider:
V1.

dispatch:
enabled.
```

Crie teste de binding.

---

### 20. Testar V1

Cenário:

- flag V2 false;
- intent pronta;
- dispatcher ativo;
- provider recebe template V1;
- sourceEventId preservado;
- resultado `SENT`.

---

### 21. Testar V2

Cenário:

- flag V2 true;
- intent pronta;
- provider recebe template V2;
- sourceEventId preservado;
- correlation preservada;
- resultado `SENT`.

---

### 22. Testar kill switch

Cenário:

- dispatch false;
- intent `READY_TO_SEND`;
- worker executa;
- provider não é chamado;
- intent continua recuperável;
- métrica incrementa;
- nenhum retry artificial é criado.

---

### 23. Testar matriz de combinações

Arquivo:

```text
FEATURE_FLAG_TEST_MATRIX.md
```

Tabela:

```markdown
| Dispatch | Provider V2 | Resultado |
|---:|---:|---|
| false | false | Nenhum envio |
| false | true | Nenhum envio |
| true | false | Provider V1 |
| true | true | Provider V2 |
```

---

### 24. Testar retry com mudança de flag

Cenário:

1. V1 envia;
2. recebe timeout;
3. intent vai para `RETRY_WAIT`;
4. flag muda para V2;
5. retry usa o mesmo sourceEventId;
6. provider não cria efeito duplicado.

Documente se a troca de template entre tentativas é aceita.

Uma policy mais conservadora pode persistir a variante na intent.

---

### 25. Persistir variante quando necessário

Para consistência de retry, adicione:

```text
providerVariant.
```

na intent no momento da criação ou primeira tentativa.

Depois:

```text
retries usam
a mesma variante.
```

Essa abordagem evita que uma mudança global altere uma operação em andamento.

A flag controla novas intents.

---

### 26. Definir policy de variant pinning

Arquivo:

```text
FEATURE_FLAG_POLICY.md
```

Regra:

```text
novas intents:

avaliam a flag.

intents existentes:

usam a variante persistida.
```

Isso torna o retry determinístico.

---

### 27. Ativar V2 no ambiente local

Edite:

```text
config/app.env.
```

Defina:

```dotenv
APP_FEATURES_NOTIFICATION_PROVIDER_V2_ENABLED=true
```

Recrie somente a aplicação:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --no-deps `
  --force-recreate `
  app
```

---

### 28. Validar V2

Execute smoke test.

Confirme:

- health;
- readiness;
- variante V2;
- template V2;
- idempotency key;
- métricas;
- ausência de erro novo.

---

### 29. Reverter para V1

Defina:

```dotenv
APP_FEATURES_NOTIFICATION_PROVIDER_V2_ENABLED=false
```

Recrie.

Confirme V1.

Essa reversão não exige rebuild da imagem.

---

### 30. Testar kill switch operacional

Defina:

```dotenv
APP_FEATURES_NOTIFICATION_DISPATCH_ENABLED=false
```

Recrie.

Crie uma OS.

Confirme:

- Outbox;
- Inbox;
- intent criada;
- dispatch não ocorre;
- backlog cresce de forma esperada;
- health permanece coerente;
- alerta operacional é necessário.

---

### 31. Reativar dispatch

Defina:

```dotenv
APP_FEATURES_NOTIFICATION_DISPATCH_ENABLED=true
```

Recrie.

Confirme que as intents pendentes são processadas.

---

### 32. Criar script de alteração

Arquivo:

```text
set-local-feature-flag.ps1
```

Parâmetros:

```text
-Key;

-Value;

-Reason.
```

O script deve:

- aceitar apenas keys conhecidas;
- validar boolean;
- atualizar `config/app.env`;
- registrar valor anterior;
- registrar novo valor;
- registrar data;
- não alterar secrets;
- não recriar sem confirmação.

---

### 33. Criar script de verificação

Arquivo:

```text
verify-feature-flag.ps1
```

Responsabilidades:

- confirmar config;
- recriar app;
- aguardar healthy;
- executar cenário;
- validar variante;
- validar métricas;
- validar logs;
- não depender de texto livre.

---

### 34. Criar script de rollback

Arquivo:

```text
rollback-feature-flag.ps1
```

Recebe:

```text
-Key;

-PreviousValue;

-Reason.
```

Executa:

- alteração;
- recreate;
- health;
- smoke;
- registro.

---

### 35. Criar rollout plan

Arquivo:

```text
FEATURE_FLAG_ROLLOUT_PLAN.md
```

Etapas:

```text
1. deploy com V2 false;

2. validar baseline;

3. ativar em ambiente local;

4. observar;

5. ativar em homologação;

6. observar;

7. liberar em produção;

8. observar;

9. confirmar rollout;

10. remover flag.
```

O laboratório executa apenas a etapa local.

---

### 36. Criar plano de remoção

Arquivo:

```text
FEATURE_FLAG_REMOVAL_PLAN.md
```

Inclua:

- condição de sucesso;
- owner;
- data;
- código V1 a remover;
- código V2 a tornar padrão;
- properties a remover;
- métricas a remover;
- docs a atualizar;
- testes a simplificar;
- migration de coluna de variante quando aplicável.

---

### 37. Criar operações

Arquivo:

```text
FEATURE_FLAG_OPERATIONS.md
```

Inclua:

- listar flags;
- alterar;
- validar;
- rollback;
- kill switch;
- backlog;
- owner;
- evidência;
- expiração.

---

### 38. Criar troubleshooting

Arquivo:

```text
FEATURE_FLAG_TROUBLESHOOTING.md
```

Inclua:

- flag não mapeia;
- env não recarrega;
- V2 não executa;
- kill switch não bloqueia;
- backlog cresce;
- variante muda no retry;
- métrica ausente;
- alta cardinalidade;
- flag duplicada;
- default incorreto;
- flag vencida;
- script altera secret;
- recreate falha.

---

### 39. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Valide Compose:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

Execute a matriz V1, V2 e kill switch.

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Deploy e release foram separados

A imagem contém V1 e V2, mas a configuração decide a ativação.

### A flag ganhou tipo e catálogo

Strings não ficaram espalhadas.

### Defaults preservaram o comportamento

V1 continua ativo quando a flag está ausente.

### O kill switch preservou trabalho

O efeito externo para, mas a intent permanece.

### A porta do provider continuou estável

A arquitetura não foi duplicada.

### Idempotência foi preservada

A variante não criou nova identidade lógica.

### Variant pinning protegeu retries

Operações iniciadas não mudam de comportamento no meio.

### Observabilidade ganhou variants controladas

Logs e métricas mostram V1, V2 ou disabled.

### Rollback não exige rebuild

A configuração retorna para V1.

### A flag ganhou prazo de remoção

Release flag não virou condição permanente.

---

## Erros comuns importantes

### Espalhar `if` por toda a aplicação

A flag fica impossível de remover.

### Usar flag como autorização

Segurança fica dependente de configuração operacional.

### Criar default V2

A mudança ativa sem decisão explícita.

### Alterar idempotency key por variante

Retries podem criar efeito duplicado.

### Mudar variante no meio do retry

Uma operação lógica fica inconsistente.

### Marcar intent como SENT no kill switch

O trabalho é perdido.

### Não observar backlog

O kill switch pode acumular trabalho indefinidamente.

### Criar endpoint público de alteração

A superfície de ataque aumenta.

### Logar cada avaliação em INFO

O volume de logs explode.

### Criar flag sem owner

Ninguém remove ou opera.

### Manter release flag para sempre

A dívida técnica cresce.

### Antecipar blue-green

Feature flag e topologia de ambiente são conceitos diferentes.

---

## Comandos úteis

### Alterar configuração local

```powershell
.\scripts\feature-flags\set-local-feature-flag.ps1 `
  -Key `
  "notification.provider.v2-enabled" `
  -Value `
  "true" `
  -Reason `
  "Validacao local"
```

### Recriar app

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  -d `
  --no-deps `
  --force-recreate `
  app
```

### Ver logs

```powershell
docker compose `
  --env-file `
  ".env.example" `
  logs `
  app
```

### Ver métricas

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "feature_flag|notification_provider_variant"
```

---

## Exercício guiado

### Parte 1 — Catálogo

Defina keys, owner e expiry.

### Parte 2 — Configuração

Crie properties e defaults.

### Parte 3 — Serviço

Crie avaliação tipada.

### Parte 4 — Variação

Separe V1 e V2.

### Parte 5 — Kill switch

Bloqueie novos dispatches.

### Parte 6 — Idempotência

Preserve sourceEventId.

### Parte 7 — Testes

Cubra todas as combinações.

### Parte 8 — Operação

Ative, observe e reverta.

### Parte 9 — Rollout

Crie plano progressivo.

### Parte 10 — Limpeza

Crie plano de remoção.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 512 foi preservada;
- feature flag foi definida;
- deploy foi separado de release;
- release flag foi definida;
- operational flag foi definida;
- kill switch foi definido;
- experiment flag foi apresentada;
- permission flag foi diferenciada de autorização;
- flag estática foi implementada;
- flag dinâmica foi discutida;
- default seguro foi definido;
- fail-open foi discutido;
- fail-closed foi discutido;
- catálogo foi criado;
- keys possuem nomes estáveis;
- owner foi definido;
- expiry foi definida;
- enum de keys foi criado;
- properties tipadas foram criadas;
- defaults foram adicionados;
- V2 default false foi usado;
- dispatch default true foi usado;
- decisão de flag foi criada;
- variant foi criada;
- source foi criada;
- service de flags foi criado;
- provider por configuração foi criado;
- strings não ficaram espalhadas;
- V1 adapter foi criado;
- V2 adapter foi criado;
- porta NotificationProvider foi preservada;
- client HTTP não foi duplicado;
- autenticação não foi duplicada;
- retry não foi duplicado;
- idempotency key foi preservada;
- headers de correlação foram preservados;
- template V1 foi definido;
- template V2 foi definido;
- router por flag foi criado;
- kill switch foi aplicado antes de novos claims;
- intent não foi marcada como SENT;
- stale recovery foi preservado;
- métricas de flag foram criadas;
- tags controladas foram usadas;
- IDs únicos não viraram tags;
- logs de avaliação foram definidos;
- volume de logs foi controlado;
- endpoint administrativo inseguro não foi criado;
- config externa foi adicionada;
- defaults foram testados;
- caminho V1 foi testado;
- caminho V2 foi testado;
- kill switch foi testado;
- matriz de combinações foi criada;
- retry com mudança de flag foi testado;
- sourceEventId permaneceu igual;
- variant pinning foi definido;
- variantes existentes não mudam no retry;
- novas intents avaliam a flag;
- V2 foi ativada localmente;
- app foi recriada;
- health foi validado;
- readiness foi validada;
- V2 foi observada;
- V1 foi restaurada;
- rollback por config foi validado;
- kill switch foi ativado;
- backlog esperado foi observado;
- dispatch foi reativado;
- backlog foi processado;
- script de alteração foi criado;
- keys permitidas foram validadas;
- boolean foi validado;
- motivo foi registrado;
- script de verificação foi criado;
- script de rollback foi criado;
- rollout plan foi criado;
- deploy com false foi primeira etapa;
- observação foi definida;
- plano de remoção foi criado;
- código V1 a remover foi registrado;
- properties a remover foram registradas;
- métricas a remover foram registradas;
- documentação operacional foi criada;
- troubleshooting foi criado;
- serviço remoto de flags não foi antecipado;
- percentage rollout não foi implementado;
- endpoint de mutação não foi criado;
- blue-green não foi antecipado;
- canary não foi antecipado;
- CI não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 514 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/br/com/formacao/m17/featureflags `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/br/com/formacao/m16/architecture/os/notification `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/config/app.env.example `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java/br/com/formacao/m17/featureflags `
  scripts/feature-flags `
  docs/devops/feature-flags `
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
git commit -m "feat(m17): implementar feature flags"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- `config/app.env`;
- `.env`;
- token;
- password;
- logs;
- output de métricas;
- arquivo temporário;
- flag de teste vencida;
- endpoint administrativo;
- arquivos blue-green da aula 514.

---

## Fechamento e ponte para a próxima aula

Nesta aula, deploy e release foram separados na prática.

A aplicação passou a conter:

```text
comportamento V1;

comportamento V2;

release flag;

kill switch;

defaults;

testes;

métricas;

logs;

rollout;

rollback;

remoção.
```

Você comprovou que:

- uma imagem pode conter código ainda não liberado;
- release flag controla mudança temporária;
- kill switch interrompe efeito sem perder trabalho;
- defaults seguros preservam a versão atual;
- flags tipadas evitam strings espalhadas;
- V1 e V2 podem compartilhar a mesma porta;
- idempotência não pode depender da variante;
- variant pinning protege retries;
- flags precisam de owner e expiry;
- métricas e logs mostram a variante;
- configuração pode ativar sem rebuild;
- rollback pode acontecer por configuração;
- flags temporárias precisam ser removidas.

A próxima aula será:

```text
514 - M17.09 - Blue green deployment
```

Nela, você irá criar dois ambientes da aplicação, validar a candidata isoladamente e preparar a troca controlada de tráfego.

Nenhum ambiente blue-green foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei catálogo e keys.
- [ ] Defini defaults seguros.
- [ ] Implementei V1 e V2.
- [ ] Implementei kill switch.
- [ ] Preservei idempotência.
- [ ] Testei combinações.
- [ ] Ativei e reverti.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A variável não mapeia

Revise relaxed binding, prefixo e nome no env.

### V2 fica ativa sem configuração

O default está incorreto.

### Kill switch cria retries

O worker está tratando disable como falha.

### Intent fica em SENDING

O switch foi aplicado depois do claim sem recovery.

### Retry muda de template

A variante não foi persistida.

### Métrica possui IDs

Remova tags de alta cardinalidade.

### Logs ficam volumosos

Reduza nível ou registre apenas mudança e agregados.

### Recreate não muda a flag

O `app.env` pode não estar montado ou o container não foi recriado.

### Backlog não processa ao reativar

Revise scheduler, claims e estados.

### A flag venceu e continua no código

Execute o removal plan.

### Endpoint permite alterar flag

Remova até existir segurança e auditoria adequadas.

### Código blue-green apareceu

Preserve para a aula 514.

---

## Perguntas de revisão

1. O que é feature flag?
2. O que é release flag?
3. O que é kill switch?
4. O que é experiment flag?
5. Flag substitui autorização?
6. O que é default seguro?
7. O que é fail-open?
8. O que é fail-closed?
9. O que é variant?
10. Por que usar keys tipadas?
11. Por que não espalhar `if`?
12. O que o kill switch faz com a intent?
13. Idempotency key muda por variante?
14. O que é variant pinning?
15. Mudar config exige rebuild?
16. Flag estática exige recreate?
17. Por que registrar owner?
18. Por que definir expiry?
19. Quando remover a flag?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Decisão condicional em runtime.
2. Controla liberação temporária.
3. Interrompe comportamento.
4. Controla experimento.
5. Não.
6. Preservar comportamento conhecido.
7. Permitir em falha.
8. Bloquear em falha.
9. Caminho executado.
10. Evitar strings dispersas.
11. Facilitar teste e remoção.
12. Mantém recuperável.
13. Não.
14. Persistir caminho da operação.
15. Não.
16. Sim.
17. Responsabilidade.
18. Evitar dívida.
19. Após rollout estável.
20. Blue green deployment.

---

## Desafio opcional

Implemente uma flag por tenant apenas no domínio de teste.

Requisitos:

- tenant ID não vira tag de métrica;
- assignment é determinístico;
- fallback é seguro;
- autorização permanece separada;
- decisão é auditável;
- teste de dois tenants;
- teste de tenant desconhecido;
- nenhum percentage rollout;
- nenhum provider remoto.

O objetivo é compreender contexto sem antecipar canary ou experimentação real.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 513 - M17.08 - Feature flags

- Continuei após release strategy.
- Separei deploy de release.
- Diferenciei release flag, operational flag, experiment flag e permission flag.
- Criei uma release flag para o provider V2.
- Criei um kill switch para dispatch.
- Defini defaults seguros.
- Criei catálogo com owner e expiry.
- Criei enum de keys.
- Criei properties tipadas.
- Criei decisão com variant e source.
- Criei `FeatureFlagService`.
- Implementei provider por configuração.
- Separei adapters V1 e V2.
- Preservei a porta `NotificationProvider`.
- Mantive idempotency key e correlação.
- Apliquei kill switch antes de novos claims.
- Mantive intents recuperáveis.
- Criei métricas com tags controladas.
- Criei logs de avaliação.
- Adicionei configuração externa.
- Testei defaults.
- Testei V1.
- Testei V2.
- Testei kill switch.
- Criei matriz de combinações.
- Testei retry com mudança de flag.
- Defini variant pinning.
- Ativei V2 sem rebuild.
- Recriei a aplicação.
- Validei health, métricas e comportamento.
- Reverti para V1.
- Ativei e desativei o kill switch.
- Observei e processei backlog.
- Criei scripts de alteração, validação e rollback.
- Criei rollout plan.
- Criei removal plan.
- Documentei operação e troubleshooting.
- Não antecipei blue-green.
- Próxima aula: Blue green deployment.
```

---

## Referência técnica curta

- Feature Toggles.
- Release Toggles.
- Operational Toggles.
- Kill Switch.
- Spring Boot Configuration Properties.
- Externalized Configuration.
- Feature Flag Lifecycle.
- OpenFeature Concepts.
- Idempotency.
- Technical Debt Management.

Regra final:

```text
feature flags separam deploy de release ao controlar um comportamento pequeno, tipado e observável dentro da mesma imagem: `notification.provider.v2-enabled` mantém V1 como default seguro e seleciona V2 sem rebuild, enquanto `notification.dispatch.enabled` funciona como kill switch e interrompe novos efeitos sem marcar intents como enviadas ou perder backlog; keys, properties e decisões ficam centralizadas, V1 e V2 preservam a porta `NotificationProvider`, sourceEventId, correlação, retry e quarantine; métricas usam somente flag, enabled, variant e source controlados, logs evitam IDs de alta cardinalidade e scripts registram alteração, motivo e rollback; novas intents avaliam a flag e operações existentes usam variant pinning para manter retries determinísticos; rollout começa com a flag desligada, avança por ambientes, observa sinais e termina com remoção da flag, do caminho antigo e da documentação temporária; sem endpoint administrativo inseguro, provider remoto, percentage rollout ou blue-green antecipado, a aplicação fica pronta para separar comportamento e topologia na aula 514.
```
