# 640 - M19.30 - Resiliencia arquitetural

## Apresentação da aula

Na aula 639, você aprofundou escalabilidade horizontal e vertical. Você mediu workloads, SLO, saturação, capacidade sustentável, headroom, pools de conexão, workers, autoscaling e custo. A arquitetura passou a suportar mais carga sem tratar scale up ou scale out como solução automática.

Agora surge outro problema: mesmo com capacidade suficiente, dependências falham.

O banco pode responder lentamente. O serviço de capacidade pode ficar indisponível. O broker pode acumular lag. O provedor de comunicação pode devolver `429`, `503` ou timeout. Uma réplica pode permanecer saudável, enquanto outra entra em degradação. Uma chamada que normalmente leva 80 ms pode passar a consumir 4 segundos e ocupar todas as threads disponíveis.

Sem políticas explícitas, uma falha localizada se transforma em falha sistêmica:

```text
uma dependência fica lenta;

requests permanecem abertas;

threads e conexões ficam ocupadas;

filas crescem;

retries multiplicam a pressão;

instâncias saudáveis saturam;

o sistema inteiro degrada.
```

Resiliência arquitetural é a capacidade de continuar entregando o resultado essencial, de forma segura e observável, quando componentes falham, atrasam ou operam parcialmente.

Ela não significa esconder toda falha. Em muitos casos, a resposta correta é rejeitar cedo, degradar uma funcionalidade secundária, usar um dado stale autorizado, enfileirar trabalho ou informar indisponibilidade temporária. O objetivo é evitar que uma falha local destrua o restante do sistema.

A pergunta desta aula será:

```text
como limitar o impacto de falhas,
preservar o caminho crítico
e recuperar o sistema
sem criar retries, fallbacks
ou estados silenciosamente incorretos?
```

O laboratório será:

```text
labs/m19/aula-640-resiliencia-arquitetural/service-scheduling-resilience
```

Você construirá um modelo de dependências para `Service Scheduling`, propagação de deadline, timeout budget, retry com backoff e jitter, circuit breaker, bulkhead, concurrency limiter, fallback, load shedding, degradação controlada, recuperação, testes de falha, reports, evidence e gate.

A próxima aula será:

```text
641 - M19.31 - Design de sistemas parte 1
```

A aula 641 organizará requisitos, estimativas, componentes, dados e fluxos de um problema completo de design de sistemas. Nesta aula, o foco permanece em resiliência de uma arquitetura já definida.

Regra central:

```text
resiliência não é insistir até funcionar;

é conter a falha,
proteger o caminho crítico,
degradar com intenção
e recuperar com evidência.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
638 Multi tenancy arquitetura;
639 Escalabilidade horizontal vertical;
640 Resiliencia arquitetural;
641 Design de sistemas parte 1;
642 Design de sistemas parte 2.
```

A progressão é intencional. Primeiro, você isolou tenants. Depois, aumentou capacidade. Agora, precisa impedir que lentidão, indisponibilidade e sobrecarga atravessem fronteiras e derrubem tudo ao mesmo tempo.

Nesta aula, você praticará:

- inventário de dependências e criticidade;
- deadline e timeout por etapa;
- retries seguros e limitados;
- backoff exponencial com jitter;
- circuit breaker por dependência e operação;
- bulkhead e limite de concorrência;
- load shedding e backpressure;
- fallback semanticamente seguro;
- degradação controlada;
- recuperação e retorno gradual;
- observabilidade, testes e gate.

Idempotência avançada da aula 637 será usada como pré-condição para alguns retries, sem ser reensinada. Escalabilidade da aula 639 será usada para entender capacidade, filas e saturação, sem repetir capacity planning. O design completo do sistema permanece para a aula 641.

---

## Objetivo prático

O laboratório será organizado em quatro áreas:

```text
service-scheduling-resilience
├── src/main/java/br/com/formacao/resilience
│   ├── dependency
│   ├── deadline
│   ├── retry
│   ├── circuitbreaker
│   ├── bulkhead
│   ├── fallback
│   ├── overload
│   ├── recovery
│   ├── application
│   └── observability
├── src/test/java/br/com/formacao/resilience
├── resilience
├── contracts
└── reports
```

O código conterá catálogo de dependências, deadline, timeout budget, retry, backoff, circuit breaker, bulkhead, fallback, load shedding, brownout e recovery. Os testes injetarão lentidão, indisponibilidade, rejeição, backlog e resultados desconhecidos.

Scripts:

```text
scripts/m19/service-scheduling-resilience
├── validate-resilience-contract.ps1
├── validate-dependency-catalog.ps1
├── validate-timeout-budget.ps1
├── validate-retry-policy.ps1
├── validate-circuit-breaker-policy.ps1
├── validate-bulkhead-policy.ps1
├── validate-fallback-policy.ps1
├── validate-load-shedding-policy.ps1
├── validate-recovery-policy.ps1
├── validate-resilience-observability.ps1
├── run-resilience-tests.ps1
├── collect-resilience-evidence.ps1
└── verify-resilience-gate.ps1
```

## Conceito essencial

### Falha, erro e degradação

Uma falha é a incapacidade observável de entregar o comportamento esperado. Um erro é um estado interno incorreto que pode ou não produzir falha externa. Uma dependência lenta pode não estar completamente indisponível, mas ainda assim causar degradação severa.

No domínio de agendamento, exemplos incluem:

```text
Capacity Service indisponível;

banco com pool saturado;

broker aceitando mensagens lentamente;

Notification Provider devolvendo 429;

read model atrasado;

thread pool esgotado;

cache indisponível;

deadline do cliente expirado.
```

A arquitetura precisa distinguir indisponibilidade, lentidão, sobrecarga, rejeição, dado stale e resposta funcionalmente inválida. Uma resposta HTTP `200` com capacidade incorreta também é falha.

### Resiliência, confiabilidade e disponibilidade

Confiabilidade mede a probabilidade de o sistema cumprir seu comportamento por um período. Disponibilidade mede a capacidade de estar acessível e responder. Resiliência trata de absorver perturbações, continuar entregando o essencial e recuperar-se.

Um sistema pode estar disponível e retornar dados degradados. Pode estar confiável em condições normais, mas colapsar diante de uma dependência lenta. Pode ser resiliente ao rejeitar uma operação secundária para preservar a confirmação crítica.

### Políticas por operação

Não existe uma política universal para todo endpoint.

```text
Confirm Appointment:
precisa preservar invariantes;

Search Availability:
pode usar snapshot autorizado;

Operational Dashboard:
pode degradar detalhes;

Send Confirmation:
pode enfileirar para processamento posterior;

Audit Export:
pode rejeitar e solicitar nova tentativa.
```

Timeout, retry, fallback e circuit breaker devem ser decididos por operação, dependência, risco e orçamento de latência.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-640-resiliencia-arquitetural/service-scheduling-resilience

Set-Location `
  labs/m19/aula-640-resiliencia-arquitetural/service-scheduling-resilience
```

Crie também as pastas `resilience`, `contracts` e `reports`.

---

### 2. Criar o Resilience Charter

Arquivo:

```text
resilience/RESILIENCE_CHARTER.md
```

Conteúdo:

```markdown
# Resilience Charter

Contexto:

Service Scheduling.

Caminho crítico:

- consultar capacidade válida;
- reservar capacidade;
- confirmar Appointment;
- persistir estado autoritativo.

Funcionalidades degradáveis:

- detalhes enriquecidos de endereço;
- recomendações de janela;
- dashboard agregado;
- envio imediato de notificação.

Princípios:

- deadline fim a fim;
- timeout menor que o deadline restante;
- retry somente quando seguro;
- circuito por dependência e operação;
- isolamento de recursos;
- fallback semanticamente válido;
- rejeição antecipada em sobrecarga;
- recuperação gradual;
- observabilidade sem dados sensíveis.
```

O charter impede que cada equipe use padrões de resiliência de forma contraditória.

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/resilience-contract.yaml
```

Conteúdo:

```yaml
resilience:
  context:
    Service-Scheduling

  required:
    - dependency-catalog
    - critical-path
    - failure-model
    - end-to-end-deadline
    - timeout-budget
    - safe-retry-policy
    - exponential-backoff
    - jitter
    - circuit-breaker
    - bulkhead
    - fallback-catalog
    - degradation-matrix
    - load-shedding
    - recovery-policy
    - observability
    - tests
    - architecture-rules

  forbidden:
    - infinite-timeout
    - retry-everything
    - nested-unbounded-retries
    - fallback-changing-business-truth
    - shared-bulkhead-for-all-dependencies
    - circuit-breaker-without-metrics
    - silent-degradation
    - immediate-full-recovery
    - design-system-deep-dive

  nextLesson:
    code:
      M19.31
```

---

### 4. Catalogar dependências

Arquivo:

```text
resilience/DEPENDENCY_CATALOG.md
```

Registre para cada dependência:

- nome e owner;
- operação consumidora;
- criticidade;
- SLO esperado;
- timeout;
- capacidade concorrente;
- erros transitórios;
- erros definitivos;
- retry permitido;
- fallback permitido;
- circuit breaker;
- bulkhead;
- recovery owner.

Exemplo:

```text
Dependency:
Capacity Service.

Operation:
Confirm Appointment.

Criticality:
CRITICAL.

Timeout:
350 ms.

Retry:
one retry only
when deadline allows
and request is idempotent.

Fallback:
forbidden for reservation.

Circuit:
per operation.

Bulkhead:
20 concurrent calls.
```

---

### 5. Definir o Failure Model

Arquivo:

```text
resilience/FAILURE_MODEL.md
```

Classifique:

```text
TIMEOUT;
CONNECTION_REFUSED;
RATE_LIMITED;
SERVICE_UNAVAILABLE;
INVALID_RESPONSE;
STALE_RESPONSE;
POOL_EXHAUSTED;
QUEUE_OVERFLOW;
DEADLINE_EXCEEDED;
CIRCUIT_OPEN;
BULKHEAD_REJECTED;
OVERLOAD_REJECTED;
UNKNOWN_OUTCOME.
```

`UNKNOWN_OUTCOME` é importante. Um timeout depois de enviar a requisição não prova que a operação remota falhou. A idempotência avançada da aula 637 protege a repetição, mas não elimina a necessidade de reconciliação.

---

### 6. Criar deadline fim a fim

O cliente inicia uma operação com orçamento total. Cada etapa consome parte desse orçamento.

```text
request total:
1.500 ms;

autenticação e validação:
150 ms;

consulta de capacidade:
350 ms;

reserva:
400 ms;

persistência:
250 ms;

margem de resposta:
350 ms.
```

Timeouts independentes que somam mais que o prazo externo criam requests zumbis: o cliente já desistiu, mas o servidor continua consumindo recursos.

---

### 7. Criar Request Deadline

```java
package br.com.formacao.resilience.deadline;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Objects;

public record RequestDeadline(Instant expiresAt) {

    public RequestDeadline {
        Objects.requireNonNull(expiresAt);
    }

    public Duration remaining(Clock clock) {
        Duration remaining = Duration.between(clock.instant(), expiresAt);
        return remaining.isNegative() ? Duration.ZERO : remaining;
    }

    public boolean expired(Clock clock) {
        return !clock.instant().isBefore(expiresAt);
    }
}
```

O deadline deve ser propagado entre camadas e serviços com formato confiável e limite máximo aceito. Nunca confie cegamente em um prazo arbitrário enviado pelo cliente.

---

### 8. Criar Timeout Budget

```java
package br.com.formacao.resilience.deadline;

import java.time.Duration;

public final class TimeoutBudget {

    private final Duration minimumReserve;

    public TimeoutBudget(Duration minimumReserve) {
        this.minimumReserve = minimumReserve;
    }

    public Duration forDependency(
            Duration remaining,
            Duration configuredMaximum) {

        Duration usable = remaining.minus(minimumReserve);

        if (usable.isZero() || usable.isNegative()) {
            throw new DeadlineExceeded("No time left for dependency call");
        }

        return usable.compareTo(configuredMaximum) < 0
                ? usable
                : configuredMaximum;
    }
}
```

O timeout efetivo é o menor entre o máximo configurado e o tempo restante menos uma reserva para concluir a resposta.

---

### 9. Definir retry seguro

Retry é uma nova tentativa, não uma correção automática. Ele aumenta carga e pode repetir efeito.

Um retry só deve ocorrer quando:

- a falha é transitória;
- a operação é idempotente ou possui chave segura;
- existe tempo restante;
- a tentativa anterior terminou em estado compatível com repetição;
- a dependência não está em sobrecarga explícita;
- o número máximo de tentativas não foi atingido.

Não faça retry automático de validação, autorização negada, conflito de versão, erro de negócio ou payload inválido.

---

### 10. Criar Retry Policy

```java
package br.com.formacao.resilience.retry;

import java.time.Duration;
import java.util.Set;

public record RetryPolicy(
        int maxAttempts,
        Duration initialBackoff,
        Duration maximumBackoff,
        Set<FailureType> retryableFailures,
        boolean requiresIdempotency) {

    public RetryPolicy {
        if (maxAttempts < 1 || maxAttempts > 4) {
            throw new IllegalArgumentException("Unsupported attempt count");
        }
    }

    public boolean mayRetry(FailureType failureType) {
        return retryableFailures.contains(failureType);
    }
}
```

`maxAttempts` inclui a tentativa inicial. Três tentativas significam uma chamada inicial e até dois retries.

---

### 11. Backoff exponencial com jitter

Sem backoff, milhares de requests repetem imediatamente. Sem jitter, todos repetem no mesmo instante e produzem uma nova onda.

```text
attempt 1:
0 ms;

attempt 2:
100 ms + jitter;

attempt 3:
200 ms + jitter;

attempt 4:
400 ms + jitter.
```

O `Retry-After` fornecido por uma dependência confiável pode orientar espera, desde que caiba no deadline e seja validado.

---

### 12. Criar Backoff Strategy

```java
package br.com.formacao.resilience.retry;

import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

public final class BackoffStrategy {

    public Duration delayFor(
            int attempt,
            Duration initial,
            Duration maximum) {

        long multiplier = 1L << Math.max(0, attempt - 2);
        long baseMillis = Math.min(
                initial.toMillis() * multiplier,
                maximum.toMillis());
        long jitterMillis = ThreadLocalRandom.current()
                .nextLong(Math.max(1, baseMillis / 2));

        return Duration.ofMillis(baseMillis + jitterMillis);
    }
}
```

Em testes, injete uma fonte determinística de aleatoriedade. O exemplo usa `ThreadLocalRandom` apenas para demonstrar a fórmula.

---

### 13. Evitar retry amplification

Considere três camadas com três tentativas cada:

```text
API:
3 tentativas;

Service:
3 tentativas;

Repository client:
3 tentativas.
```

Uma única requisição pode gerar até 27 chamadas na dependência. A política deve definir uma camada responsável pelo retry e proibir retries aninhados sem orçamento global.

---

### 14. Criar Circuit Breaker

O circuit breaker evita continuar pressionando uma dependência que está falhando ou excessivamente lenta.

Estados:

```text
CLOSED:
chamadas passam;

OPEN:
chamadas são rejeitadas cedo;

HALF_OPEN:
poucas chamadas de teste avaliam recuperação.
```

O circuito não substitui timeout. Uma chamada individual ainda precisa de limite. O circuito também não deve ser global para dependências e operações com riscos diferentes.

---

### 15. Criar Circuit Policy

```java
package br.com.formacao.resilience.circuitbreaker;

import java.time.Duration;

public record CircuitPolicy(
        int minimumCalls,
        double failureRateThreshold,
        double slowCallRateThreshold,
        Duration slowCallThreshold,
        Duration openDuration,
        int halfOpenPermittedCalls) {

    public CircuitPolicy {
        if (minimumCalls < 1) {
            throw new IllegalArgumentException("Minimum calls must be positive");
        }

        if (failureRateThreshold <= 0 || failureRateThreshold > 1) {
            throw new IllegalArgumentException("Invalid failure threshold");
        }
    }
}
```

A janela deve ter volume mínimo. Abrir o circuito após uma única falha produz instabilidade.

---

### 16. Circuito por operação

Uma dependência pode estar degradada apenas em uma rota.

```text
Capacity Service / query availability:
saudável;

Capacity Service / reserve slot:
falhando;

Capacity Service / release slot:
lento.
```

Use chaves que preservem a fronteira sem criar cardinalidade descontrolada. Não crie um circuito por usuário, request ou tenant sem justificativa operacional.

---

### 17. Criar Bulkhead

Bulkhead separa recursos para que uma dependência ou workload não consuma toda a capacidade compartilhada.

Exemplos:

- limite de chamadas simultâneas ao Capacity Service;
- pool separado para notificações;
- fila própria para exportação;
- concorrência por tenant;
- pool de conexões com orçamento explícito.

Sem bulkhead, uma integração lenta pode ocupar todas as threads da aplicação.

---

### 18. Criar Bulkhead com Semaphore

```java
package br.com.formacao.resilience.bulkhead;

import java.time.Duration;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public final class Bulkhead {

    private final Semaphore permits;

    public Bulkhead(int maximumConcurrentCalls) {
        this.permits = new Semaphore(maximumConcurrentCalls);
    }

    public ConcurrencyPermit acquire(Duration waitLimit) {
        try {
            boolean acquired = permits.tryAcquire(
                    waitLimit.toMillis(),
                    TimeUnit.MILLISECONDS);

            if (!acquired) {
                throw new BulkheadRejected("BULKHEAD_FULL");
            }

            return new ConcurrencyPermit(permits::release);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new BulkheadRejected("INTERRUPTED");
        }
    }
}
```

O tempo de espera pelo bulkhead consome deadline. Em alta carga, rejeitar cedo costuma ser melhor que formar uma fila infinita.

---

### 19. Definir fila e concorrência

Um bulkhead precisa declarar:

```text
maximum concurrent calls;
maximum queued calls;
maximum queue wait;
rejection behavior;
metric owner;
recovery behavior.
```

Filas longas escondem sobrecarga e aumentam tail latency. A fila deve ser limitada.

---

### 20. Definir fallback semanticamente seguro

Fallback não é retornar qualquer coisa para evitar erro.

Tipos possíveis:

```text
stale data autorizado;
resultado parcial;
valor padrão não crítico;
enfileiramento posterior;
funcionalidade temporariamente removida;
resposta explícita de indisponibilidade.
```

Fallback é proibido quando pode violar invariantes ou mentir sobre o estado.

Exemplo perigoso:

```text
Capacity Service indisponível;

fallback retorna "há capacidade";

Appointment é confirmado sem reserva.
```

Isso preserva status HTTP, mas destrói a regra de negócio.

---

### 21. Criar Fallback Catalog

Arquivo:

```text
resilience/FALLBACK_CATALOG.md
```

Matriz sugerida:

```text
Search available slots:
stale snapshot até 30 segundos,
com indicador.

Reserve slot:
sem fallback.

Confirm appointment:
sem fallback de negócio;
pode responder processamento pendente
somente se command foi persistido com segurança.

Operational dashboard:
resultado parcial.

Address enrichment:
omitir enriquecimento.

Send confirmation notification:
outbox e processamento posterior.
```

---

### 22. Criar degradation matrix

Arquivo:

```text
resilience/DEGRADATION_MATRIX.md
```

Defina modos:

```text
NORMAL;
DEGRADED_OPTIONAL_FEATURES;
READ_ONLY;
DEFERRED_SIDE_EFFECTS;
CRITICAL_PATH_ONLY;
RECOVERY;
```

Para cada modo, registre funcionalidades permitidas, bloqueadas, resposta ao usuário, SLO temporário, owner e condição de saída.

---

### 23. Load shedding

Load shedding rejeita trabalho antes que o sistema ultrapasse um limite perigoso.

Sinais possíveis:

- fila acima do limite;
- pool de conexões perto da saturação;
- deadline restante insuficiente;
- CPU e latência em degradação conjunta;
- circuitos abertos;
- erro crescente;
- tenant acima da quota.

A rejeição deve priorizar workloads secundários e preservar o caminho crítico.

---

### 24. Criar Load Shedder

```java
package br.com.formacao.resilience.overload;

public final class LoadShedder {

    private final OverloadPolicy policy;

    public AdmissionDecision decide(
            WorkloadClass workloadClass,
            OverloadSignal signal) {

        if (!signal.overloaded()) {
            return AdmissionDecision.accept();
        }

        if (workloadClass == WorkloadClass.CRITICAL_COMMAND
                && signal.criticalCapacityAvailable()) {
            return AdmissionDecision.acceptProtected();
        }

        return AdmissionDecision.reject(
                "TEMPORARY_CAPACITY_PROTECTION");
    }
}
```

A classificação de workload deve ser controlada pelo servidor. O cliente não pode se declarar crítico.

---

### 25. Backpressure

Backpressure comunica ao produtor que o consumidor não consegue acompanhar.

Em fluxos síncronos, aparece como rejeição, limite de concorrência ou redução de leitura. Em filas, pode usar prefetch, pause, quotas e controle de produção. Sem backpressure, backlog cresce até consumir memória, disco ou prazo operacional.

---

### 26. Compor políticas na ordem correta

A ordem importa. Uma composição coerente pode ser:

```text
1. validar deadline;
2. aplicar admission control;
3. adquirir bulkhead;
4. consultar circuit breaker;
5. executar com timeout;
6. avaliar retry seguro;
7. aplicar fallback permitido;
8. registrar resultado e métricas.
```

Não existe uma ordem universal, mas a equipe deve documentar a escolhida. Um retry precisa reacquirir ou não o bulkhead conforme a policy. Um circuito aberto deve rejeitar antes de ocupar recursos remotos.

---

### 27. Criar Resilient Call Executor

```java
package br.com.formacao.resilience.application;

import br.com.formacao.resilience.bulkhead.Bulkhead;
import br.com.formacao.resilience.circuitbreaker.CircuitBreaker;
import br.com.formacao.resilience.deadline.RequestDeadline;
import br.com.formacao.resilience.retry.RetryExecutor;
import java.time.Clock;

public final class ResilientCallExecutor {

    private final Clock clock;
    private final Bulkhead bulkhead;
    private final CircuitBreaker circuitBreaker;
    private final RetryExecutor retryExecutor;

    public <T> T execute(
            RequestDeadline deadline,
            ResilientOperation<T> operation) {

        if (deadline.expired(clock)) {
            throw new RequestRejected("DEADLINE_EXCEEDED");
        }

        try (var permit = bulkhead.acquire(operation.bulkheadWait())) {
            var permission = circuitBreaker.acquirePermission();

            if (!permission.allowed()) {
                throw new RequestRejected("CIRCUIT_OPEN");
            }

            return retryExecutor.execute(deadline, operation);
        }
    }
}
```

O executor centraliza regras técnicas, mas não decide sozinho se um fallback é válido. Essa decisão pertence ao caso de uso e à política de negócio.

---

### 28. Cenário: confirmação de Appointment

Fluxo:

```text
validate command;
check deadline;
acquire confirmation bulkhead;
call Capacity Service;
reserve slot;
persist Appointment and outbox;
return confirmed result;
```

Política:

- timeout curto por etapa;
- no máximo um retry para falha transitória;
- idempotency key obrigatória;
- nenhum fallback que invente reserva;
- circuito por `reserve-slot`;
- rejeição explícita quando o circuito está aberto;
- reconciliação quando o resultado remoto é desconhecido.

---

### 29. Cenário: busca de disponibilidade

A busca é menos crítica que a reserva.

Política:

- timeout de leitura;
- retry apenas para falha transitória e dentro do deadline;
- circuito separado;
- snapshot stale permitido por até 30 segundos;
- resposta informa `generatedAt` e estado degradado;
- snapshot não pode ser usado como confirmação de reserva.

Isso preserva navegação sem transformar dado stale em autoridade.

---

### 30. Cenário: envio de confirmação

Após persistir Appointment e outbox, o envio pode falhar.

Política:

- fluxo assíncrono;
- retry no worker com backoff e jitter;
- circuit breaker do provedor;
- bulkhead próprio;
- dead letter após limite;
- Appointment continua confirmado;
- observabilidade e reprocessamento controlado.

A indisponibilidade do provedor não deve desfazer uma confirmação já persistida.

---

### 31. Cenário: dashboard operacional

O dashboard pode degradar:

```text
ocultar recomendações;
mostrar agregados disponíveis;
indicar atraso;
remover drill-down caro;
reduzir janela temporal;
servir cache recente.
```

O dashboard não pode se tornar fonte de decisão crítica durante degradação.

---

### 32. Brownout controlado

Brownout desativa temporariamente funcionalidades opcionais para reduzir custo computacional e preservar o essencial.

Exemplos:

- desabilitar enriquecimento de endereço;
- reduzir sugestões de janela;
- pausar exportações;
- limitar dashboards detalhados;
- adiar recomputação de analytics.

O modo precisa de trigger, owner, duração máxima, auditoria e condição de retorno.

---

### 33. Recuperação gradual

Quando a dependência melhora, não libere todo o tráfego instantaneamente.

Fluxo recomendado:

```text
confirmar sinais de recuperação;
abrir circuito em half-open;
permitir probes limitados;
aumentar concorrência gradualmente;
drenar backlog com rate limit;
monitorar erro e latência;
reativar funções opcionais;
encerrar incidente;
registrar aprendizado.
```

A recuperação também pode causar sobrecarga. Milhares de retries e mensagens represadas podem derrubar uma dependência recém-recuperada.

---

### 34. Criar Recovery Policy

Arquivo:

```text
resilience/RECOVERY_POLICY.md
```

Inclua:

```text
entry criteria;
probe strategy;
half-open limit;
backlog drain rate;
traffic ramp;
brownout exit;
convergence check;
owner;
rollback criteria;
incident review.
```

---

### 35. Observabilidade de resiliência

Métricas mínimas por dependência e operação:

- chamadas e latência;
- timeout count;
- retry attempts e success after retry;
- retry exhausted;
- circuit state e transitions;
- slow call rate;
- bulkhead active, queued e rejected;
- fallback count e age;
- load shed count;
- brownout state;
- unknown outcomes;
- backlog e recovery duration.

Não interprete `success after retry` apenas como sucesso. Um crescimento contínuo indica dependência degradada e custo adicional.

---

### 36. Segurança durante degradação

Resiliência não pode enfraquecer autorização.

Erros comuns:

- usar cache de permissão expirado sem policy;
- aceitar tenant padrão quando resolução falha;
- remover validação para reduzir latência;
- retornar dados stale de outro tenant;
- registrar token em logs de retry;
- permitir reprocessamento privilegiado sem auditoria.

Quando a autorização crítica está indisponível, a resposta segura pode ser rejeitar.

---

### 37. Testar cenários de resiliência

Crie uma suíte que injete falhas de forma determinística e valide:

- deadline total de 1.000 ms, com timeout efetivo limitado pelo tempo restante;
- `503` transitório recuperado por uma única nova tentativa idempotente;
- conflito de versão, `400`, autorização negada e deadline insuficiente sem retry;
- ausência de retry amplification entre clientes aninhados;
- circuito passando por `CLOSED`, `OPEN` e `HALF_OPEN`, com probes limitados;
- bulkhead rejeitando a chamada excedente sem bloquear outra dependência;
- busca usando snapshot de 20 segundos e recusando snapshot acima de 30 segundos;
- reserva sem fallback de disponibilidade;
- load shedding removendo exportações e preservando confirmação crítica;
- brownout desativando apenas funções opcionais;
- recovery com probes, ramp gradual e drenagem limitada do backlog;
- timeout após reserva remota tratado como `UNKNOWN_OUTCOME`, com idempotência e reconciliação;
- regras arquiteturais impedindo fallback técnico de decidir verdade de negócio.

Exemplo de regra ArchUnit:

```java
package br.com.formacao.resilience.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

class ResilienceBoundaryTest {

    @ArchTest
    static final ArchRule fallbackMustNotDependOnPersistenceInternals =
            noClasses()
                    .that()
                    .resideInAPackage("..fallback..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..persistence.internal..");
}
```

Os testes devem registrar tentativas, estados do circuito, rejeições, fallbacks, unknown outcomes e duração da recuperação.

### 38. Executar validações

Execute as validações específicas e, depois, a suíte completa:

```powershell
.\scripts\m19\service-scheduling-resilience\validate-resilience-contract.ps1
.\scripts\m19\service-scheduling-resilience\validate-dependency-catalog.ps1
.\scripts\m19\service-scheduling-resilience\validate-timeout-budget.ps1
.\scripts\m19\service-scheduling-resilience\validate-retry-policy.ps1
.\scripts\m19\service-scheduling-resilience\validate-circuit-breaker-policy.ps1
.\scripts\m19\service-scheduling-resilience\validate-bulkhead-policy.ps1
.\scripts\m19\service-scheduling-resilience\validate-fallback-policy.ps1
.\scripts\m19\service-scheduling-resilience\validate-load-shedding-policy.ps1
.\scripts\m19\service-scheduling-resilience\validate-recovery-policy.ps1
.\scripts\m19\service-scheduling-resilience\validate-resilience-observability.ps1
.\scripts\m19\service-scheduling-resilience\run-resilience-tests.ps1
```

Ou execute `mvn test`. Qualquer falha de deadline, retry, circuito, isolamento, fallback, segurança ou recovery bloqueia o gate.

### 39. Criar Reports

Exemplo:

```yaml
resilience:
  dependencies:
    6

  timeoutScenarios:
    14

  retries:
    attempted:
      22
    recovered:
      15
    exhausted:
      7

  circuits:
    opened:
      3
    recovered:
      3

  bulkheadRejections:
    9

  fallbacks:
    stale:
      12
    partial:
      4
    deferred:
      8

  loadShedRequests:
    17

  unknownOutcomes:
    2

  unresolvedUnknownOutcomes:
    0

  recoveryDurationSeconds:
    36

  result:
    PASS
```

---

### 40. Criar Gate

O gate valida:

- charter e critical path;
- dependências e failure model;
- deadline e timeout budget;
- retries seguros;
- circuit breaker;
- bulkhead;
- fallback e degradação;
- load shedding e backpressure;
- recovery gradual;
- segurança;
- observabilidade;
- testes;
- arquitetura;
- documentação;
- evidence.

Status:

```text
PASS;

FAIL_DEPENDENCY_CATALOG;

FAIL_DEADLINE;

FAIL_TIMEOUT_BUDGET;

FAIL_RETRY_POLICY;

FAIL_RETRY_AMPLIFICATION;

FAIL_CIRCUIT_BREAKER;

FAIL_BULKHEAD;

FAIL_FALLBACK;

FAIL_OVERLOAD_PROTECTION;

FAIL_RECOVERY;

FAIL_SECURITY;

FAIL_OBSERVABILITY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 41. Coletar Evidence

Arquivo:

```text
contracts/resilience-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- dependency count;
- failure scenario count;
- timeout scenario count;
- retry attempted count;
- retry recovered count;
- retry exhausted count;
- circuit open count;
- circuit recovery count;
- bulkhead rejection count;
- fallback count por tipo;
- load shed count;
- unknown outcome count;
- unresolved unknown outcome count;
- recovery duration;
- security status;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- tokens;
- idempotency keys reais;
- dados pessoais;
- endpoints privados;
- nomes de clientes;
- topologia de produção;
- payloads reais.

---

### 42. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-resilience\validate-resilience-contract.ps1

.\scripts\m19\service-scheduling-resilience\validate-dependency-catalog.ps1

.\scripts\m19\service-scheduling-resilience\validate-timeout-budget.ps1

.\scripts\m19\service-scheduling-resilience\validate-retry-policy.ps1

.\scripts\m19\service-scheduling-resilience\validate-circuit-breaker-policy.ps1

.\scripts\m19\service-scheduling-resilience\validate-bulkhead-policy.ps1

.\scripts\m19\service-scheduling-resilience\validate-fallback-policy.ps1

.\scripts\m19\service-scheduling-resilience\validate-load-shedding-policy.ps1

.\scripts\m19\service-scheduling-resilience\validate-recovery-policy.ps1

.\scripts\m19\service-scheduling-resilience\validate-resilience-observability.ps1

.\scripts\m19\service-scheduling-resilience\run-resilience-tests.ps1

.\scripts\m19\service-scheduling-resilience\collect-resilience-evidence.ps1

.\scripts\m19\service-scheduling-resilience\verify-resilience-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 43. Encerrar o laboratório

Confirme:

- dependências catalogadas;
- caminho crítico explícito;
- failure model definido;
- deadline fim a fim;
- timeout menor que tempo restante;
- retry seguro e limitado;
- backoff e jitter;
- nenhuma amplificação aninhada;
- circuito por dependência e operação;
- bulkhead e fila limitados;
- fallback semanticamente válido;
- nenhuma reserva inventada;
- degradação visível;
- load shedding preserva o essencial;
- tenant não captura toda a capacidade;
- unknown outcomes reconciliados;
- recuperação gradual;
- brownout com expiração;
- segurança preservada;
- reports sanitizados;
- design de sistemas não antecipado.

---

## Entendendo o que foi feito

### Dependências ganharam contratos operacionais

Cada integração passou a declarar criticidade, prazo, concorrência, falhas, retry, fallback, circuito e owner. A arquitetura deixou de tratar chamadas remotas como métodos locais confiáveis.

### O tempo ganhou orçamento fim a fim

Deadlines passaram a limitar toda a operação. Cada timeout usa apenas o tempo restante e preserva margem para responder. Requests expirados não continuam consumindo recursos indefinidamente.

### Repetição ganhou limites

Retries exigem falha transitória, idempotência, backoff, jitter, deadline e ownership. O sistema evita repetir erros definitivos e impede amplificação entre camadas.

### Falhas ganharam contenção

Circuit breakers rejeitam cedo quando a dependência está degradada. Bulkheads isolam concorrência. Load shedding protege o caminho crítico antes que a saturação se torne colapso.

### Degradação ganhou semântica

Fallbacks não inventam verdade de negócio. Dados stale possuem idade e indicador. Resultados parciais informam omissões. Efeitos secundários podem ser diferidos apenas quando existe persistência durável.

### Recuperação ganhou controle

A volta não ocorre com tráfego total imediato. Probes, half-open, ramp gradual, drenagem limitada e critérios de rollback reduzem o risco de uma segunda queda.

---

## Erros comuns importantes

### Configurar timeout maior que o deadline

A operação continua depois que o cliente já desistiu e mantém threads, conexões e memória ocupadas.

### Fazer retry de qualquer erro

Validação, autorização e conflito de negócio não se resolvem por repetição. A carga aumenta sem chance de sucesso.

### Fazer retry em todas as camadas

Uma requisição se multiplica geometricamente e piora a indisponibilidade.

### Abrir circuito após uma falha

Sem volume mínimo, pequenas oscilações interrompem uma dependência saudável.

### Usar circuito global

Uma rota degradada bloqueia operações saudáveis ou tenants não relacionados.

### Usar fila ilimitada como bulkhead

A fila esconde sobrecarga, aumenta o p99 e consome o deadline.

### Criar fallback mentiroso

Retornar disponibilidade fabricada ou autorização presumida preserva aparência de sucesso e viola invariantes.

### Ocultar degradação

Usuários e operadores acreditam que o dado é atual ou completo quando não é.

### Liberar backlog sem limite

A dependência recém-recuperada recebe uma tempestade e cai novamente.

### Usar modo degradado para ignorar segurança

Uma falha operacional se transforma em vazamento cross-tenant ou autorização indevida.

### Confundir resiliência com disponibilidade infinita

Algumas operações precisam rejeitar para permanecer corretas.

### Antecipar o design de sistemas completo

Requisitos globais, estimativas e decomposição completa pertencem à aula 641.

---

## Comandos úteis

### Validar timeout

```powershell
.\scripts\m19\service-scheduling-resilience\validate-timeout-budget.ps1
```

### Validar retry

```powershell
.\scripts\m19\service-scheduling-resilience\validate-retry-policy.ps1
```

### Validar circuit breaker

```powershell
.\scripts\m19\service-scheduling-resilience\validate-circuit-breaker-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-resilience\run-resilience-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-resilience\verify-resilience-gate.ps1
```

---

## Exercício guiado

Implemente o laboratório com três dependências:

```text
Capacity Service;
Notification Provider;
Operational Read Model.
```

Para cada uma:

1. classifique criticidade;
2. defina timeout e concorrência;
3. liste falhas transitórias e definitivas;
4. escolha retry;
5. configure circuit breaker;
6. crie bulkhead;
7. defina fallback permitido;
8. modele sobrecarga;
9. injete falhas;
10. valide recuperação.

Depois execute os cenários de confirmação, busca, notificação e dashboard. Produza reports e conclua o gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade oficial;
- continuidade com a aula 639 e ponte para a aula 641 foram preservadas;
- laboratório, charter, catálogo de dependências e failure model foram criados;
- deadline fim a fim limita os timeouts das etapas;
- nenhuma chamada inicia após expiração;
- retry exige falha transitória, prazo, limite e idempotência quando necessária;
- backoff, jitter e proteção contra retry amplification foram implementados;
- circuit breaker possui volume mínimo, slow-call threshold e half-open limitado;
- bulkhead limita concorrência, fila e espera;
- fallback preserva a verdade de negócio, possui idade e indicador;
- reserva não usa disponibilidade inventada;
- load shedding preserva o caminho crítico, quotas e isolamento multi-tenant;
- brownout possui owner, expiração e saída controlada;
- unknown outcome exige reconciliação;
- recovery usa probes, ramp gradual e backlog rate limited;
- segurança permanece ativa durante degradação;
- métricas, testes, reports, evidence e gate foram criados;
- Design de Sistemas não foi antecipado;
- commit recomendado e diário de bordo estão presentes.

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
  labs/m19/aula-640-resiliencia-arquitetural/service-scheduling-resilience `
  scripts/m19/service-scheduling-resilience `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization: Bearer|access_token|refresh_token|client_secret|idempotencyKeyValue|privateEndpoint|realTopology|customerName|fullSystemDesign"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): modelar resiliencia arquitetural"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- idempotency keys reais;
- dados pessoais;
- topologia real;
- endpoints privados;
- design completo da aula 641.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou resiliência arquitetural.

Você criou:

```text
Resilience Charter;

Dependency Catalog;

Failure Model;

Request Deadline;

Timeout Budget;

Retry Policy;

Backoff com jitter;

Circuit Breaker;

Bulkhead;

Fallback Catalog;

Degradation Matrix;

Load Shedder;

Brownout Controller;

Recovery Policy;

observabilidade;

testes;

reports;

evidence;

gate.
```

Você comprovou que timeout precisa respeitar o deadline fim a fim; que retries exigem falha transitória, idempotência, backoff, jitter e limite; que circuit breakers reduzem pressão; que bulkheads isolam recursos; que filas infinitas apenas escondem saturação; que fallback precisa preservar verdade de negócio; que load shedding protege o caminho crítico; e que recovery deve ser gradual para não causar uma nova queda.

A próxima aula será:

```text
641 - M19.31 - Design de sistemas parte 1
```

Nela, você organizará requisitos funcionais e não funcionais, estimativas, volume, componentes, dados, APIs e fluxos para iniciar um design de sistema completo. Esse aprofundamento não foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei dependências e criticidade.
- [ ] Defini deadline fim a fim.
- [ ] Limitei timeout por tempo restante.
- [ ] Implementei retry seguro com jitter.
- [ ] Evitei retry amplification.
- [ ] Criei circuit breaker por operação.
- [ ] Isolei concorrência com bulkhead.
- [ ] Criei fallbacks semanticamente válidos.
- [ ] Protegi o caminho crítico com load shedding.
- [ ] Validei recuperação gradual e gate.

---

## Troubleshooting adicional

### Retry aumenta a indisponibilidade

Revise owner, tentativas, backoff, jitter, deadline e erros repetíveis. Garanta que apenas uma camada faça retry.

### Circuito oscila

Ajuste volume mínimo, janela, open duration, probes e slow-call threshold.

### Dependência lenta trava endpoints não relacionados

Separe bulkheads, filas e pools; verifique também o pool de conexões compartilhado.

### Fallback está antigo ou incorreto

Defina idade máxima e proíba fallback que inventa capacidade, autorização ou sucesso.

### Backlog derruba o provedor após recovery

Drene com rate limit e ramp gradual.

### Timeout causa duplicação

Trate como `UNKNOWN_OUTCOME`, preserve a chave idempotente e reconcilie.

### Um tenant ocupa todos os permits

Aplique quotas e isolamento sem criar cardinalidade operacional descontrolada.

### O modo degradado nunca termina

Use expiração, owner, alerta e condição objetiva de saída.

## Perguntas de revisão

1. Qual diferença entre deadline e timeout?
2. Quando retry é permitido?
3. Por que usar jitter?
4. O que é retry amplification?
5. Quais são os estados do circuit breaker?
6. Para que serve bulkhead?
7. O que torna um fallback seguro?
8. O que é load shedding?
9. Como ocorre a recuperação gradual?
10. O que é unknown outcome?
11. Qual é a próxima aula?

## Roteiro de resposta

1. Deadline limita a operação inteira; timeout limita uma etapa.
2. Em falha transitória, operação segura, prazo restante e limite explícito.
3. Para evitar retries sincronizados.
4. Multiplicação de tentativas entre camadas.
5. `CLOSED`, `OPEN` e `HALF_OPEN`.
6. Isolar concorrência e recursos.
7. Preservar verdade de negócio, limite, indicador e owner.
8. Rejeitar trabalho antes do colapso.
9. Com probes, half-open, ramp e drenagem limitada.
10. Não saber se a operação remota concluiu após timeout.
11. Design de sistemas parte 1.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 640 - M19.30 - Resiliencia arquitetural**

- Cataloguei dependências e caminhos críticos de Service Scheduling.
- Criei Failure Model para timeout, rejeição, sobrecarga e unknown outcome.
- Modelei deadline fim a fim e timeout por tempo restante.
- Criei Retry Policy com falhas transitórias, limite, backoff e jitter.
- Proibi retry amplification entre camadas.
- Criei Circuit Breaker com closed, open e half-open.
- Separei circuitos por dependência e operação.
- Criei Bulkhead com concorrência, fila e espera limitadas.
- Modelei Fallback Catalog e Degradation Matrix.
- Proibi fallback que inventa disponibilidade ou autorização.
- Criei Load Shedder e política de backpressure.
- Preservei caminho crítico, quotas e isolamento multi-tenant.
- Criei Brownout Controller com expiração.
- Modelei recovery gradual com probes, ramp e backlog rate limited.
- Tratei timeout remoto como unknown outcome quando necessário.
- Preservei segurança durante degradação.
- Criei observabilidade, testes, reports, evidence e gate.
- Não antecipei Design de Sistemas.
- Próxima aula: Design de sistemas parte 1.
```

---

## Referência técnica curta

- Deadline e Timeout Budget.
- Retry, Backoff e Jitter.
- Circuit Breaker.
- Bulkhead e Concurrency Limit.
- Fallback e Graceful Degradation.
- Load Shedding e Backpressure.
- Brownout e Recovery Ramp.
- Unknown Outcome e Reconciliation.

Regra final:

```text
Resiliência arquitetural contém falhas antes que elas atravessem o sistema. Service Scheduling cataloga cada dependência, define caminho crítico, deadline fim a fim e timeout limitado pelo tempo restante. Retry só ocorre para falha transitória, com idempotência, attempt budget, backoff e jitter, em uma camada owner. Circuit breakers rejeitam cedo após volume e thresholds explícitos; bulkheads isolam concorrência e filas; load shedding preserva commands críticos e quotas. Fallbacks precisam manter verdade de negócio, idade máxima e indicador, sem inventar capacidade, autorização ou sucesso. Side effects podem ser diferidos apenas com persistência durável. Unknown outcomes exigem reconciliação. A recuperação usa probes, half-open, ramp gradual, backlog rate limited, brownout reversível e critérios de rollback. Segurança, observabilidade, testes, reports, evidence e gate permanecem obrigatórios, enquanto o design de sistema completo começa somente na aula 641.
```
