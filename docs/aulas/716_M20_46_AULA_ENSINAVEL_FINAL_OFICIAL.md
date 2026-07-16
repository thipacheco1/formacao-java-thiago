# 716 - M20.46 - Aula ensinavel final

## Apresentação da aula

Na aula 715, você aprendeu como transformar conhecimento técnico em aprendizado estruturado.

Você construiu:

- perfil de público;
- mapa de conhecimentos prévios;
- objetivos observáveis;
- proteção de escopo;
- sequência conceitual;
- catálogo de misconceptions;
- estrutura de explicação;
- política de analogias;
- exemplo resolvido;
- prática guiada;
- exercício independente;
- plano de avaliação;
- guia de feedback;
- troubleshooting como ensino;
- revisão de carga cognitiva;
- acessibilidade;
- apoio visual;
- demonstração de código;
- plano de tempo;
- teach-back;
- microteaching;
- scorecard;
- report, evidence e gate.

Agora você aplicará esse método.

Nesta aula, você produzirá uma aula final, ensinável e executável sobre:

```text
Transactional Outbox no OrderFlow:
como salvar um pedido
e garantir publicacao confiavel
sem dual write fragil.
```

O material será criado como se outro aluno fosse estudar sem acompanhamento direto.

Ele precisará encontrar no próprio conteúdo:

- contexto;
- objetivo;
- pré-requisitos;
- preparação do ambiente;
- explicação;
- código;
- testes;
- falhas esperadas;
- prática guiada;
- exercício;
- critérios de aceite;
- troubleshooting;
- revisão;
- commit;
- diário de bordo;
- ponte pedagógica.

Uma aula ensinável não pode depender de informação escondida na cabeça do autor.

Tudo o que for necessário para executar precisa estar visível.

O aluno não deve precisar adivinhar:

- onde criar um arquivo;
- qual package usar;
- qual comando executar;
- qual saída esperar;
- qual erro é normal;
- qual decisão está sendo tomada;
- como validar o resultado;
- o que fazer quando algo falhar.

A aula final também precisa preservar honestidade técnica.

Transactional Outbox não oferece:

- exactly-once global;
- ausência total de duplicidade;
- transação distribuída automática;
- entrega instantânea;
- eliminação de observabilidade;
- substituição de idempotência no consumidor.

Ela oferece uma garantia mais específica:

```text
se a transacao local confirmar,
o registro que precisa ser publicado
tambem fica persistido.

se a transacao local falhar,
nem o agregado
nem a mensagem da Outbox
devem permanecer.
```

A próxima aula será:

```text
717 - M20.47 - Banca tecnica simulada
```

Na aula 717, você usará o projeto, a documentação, as entrevistas, o currículo, o portfólio e a aula ensinável em uma banca técnica integrada.

Nesta aula, nenhuma banca final será executada.

O laboratório será:

```text
labs/m20/aula-716-aula-ensinavel-final/orderflow-outbox-teachable-lesson
```

Regra central:

```text
uma aula final ensinavel
precisa permitir que outra pessoa
entenda,
execute,
erre,
corrija,
teste
e explique o que construiu.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
713:
Live coding Java.

714:
System design interview.

715:
Como ensinar o que aprendeu.

716:
Aula ensinavel final.

717:
Banca tecnica simulada.

718:
Plano de evolucao pos-formacao.
```

A aula 716 utiliza como fonte:

- método pedagógico da aula 715;
- domínio do OrderFlow;
- persistência;
- transações;
- Outbox;
- mensageria;
- retries;
- testes;
- observabilidade;
- troubleshooting;
- diário de bordo;
- documentação do projeto;
- decisões arquiteturais;
- experiência acumulada na formação.

A diferença é que, desta vez, o conteúdo não será apenas um plano.

Será uma entrega completa, pronta para uso.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/final-teachable-lesson
├── LESSON_MANIFEST.md
├── STUDENT_PROFILE.md
├── PREREQUISITES.md
├── LEARNING_OBJECTIVES.md
├── LESSON_SCOPE.md
├── ENVIRONMENT_SETUP.md
├── CONCEPTUAL_EXPLANATION.md
├── DUAL_WRITE_FAILURE.md
├── OUTBOX_DESIGN.md
├── GUIDED_IMPLEMENTATION.md
├── TEST_PLAN.md
├── OBSERVABILITY_PLAN.md
├── TROUBLESHOOTING_GUIDE.md
├── INDEPENDENT_EXERCISE.md
├── EXERCISE_SOLUTION_GUIDE.md
├── ASSESSMENT_RUBRIC.md
├── REVIEW_QUESTIONS.md
├── STUDENT_CHECKPOINT.md
├── INSTRUCTOR_NOTES.md
├── ACCESSIBILITY_REVIEW.md
├── PUBLICATION_CHECKLIST.md
├── FINAL_LESSON_SCRIPT.md
├── FINAL_LESSON_SCORECARD.md
├── FINAL_LESSON_MATRIX.md
├── FINAL_LESSON_RISK_REGISTER.md
├── FINAL_LESSON_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Código de laboratório:

```text
src/main/java/com/orderflow/outbox
├── domain
│   ├── Order.java
│   ├── OrderId.java
│   └── OrderCreatedEvent.java
├── application
│   ├── RegisterOrderCommand.java
│   ├── RegisterOrderHandler.java
│   └── TransactionBoundary.java
├── ports
│   ├── OrderRepository.java
│   └── OutboxRepository.java
└── persistence
    ├── OutboxMessage.java
    ├── OutboxStatus.java
    └── OutboxPublisher.java
```

Testes:

```text
src/test/java/com/orderflow/outbox
├── RegisterOrderHandlerTest.java
├── RegisterOrderTransactionIT.java
├── OutboxPublisherTest.java
└── OutboxBacklogIT.java
```

Artifacts:

```text
reports/final-teachable-lesson-report.yaml

contracts/final-teachable-lesson-evidence.yaml
```

Documento principal:

```text
docs/final-teachable-lesson/FINAL_LESSON_SCRIPT.md
```

---

## Conceito essencial

### Dual write é o problema central

Dual write ocorre quando o mesmo fluxo tenta alterar dois sistemas independentes.

Exemplo:

```text
1. salvar Order no PostgreSQL;
2. publicar OrderCreated no Kafka.
```

As duas operações podem produzir combinações diferentes:

- banco falha e broker não recebe;
- banco confirma e broker falha;
- broker recebe e resposta da aplicação se perde;
- retry publica novamente;
- consumidor processa duplicado.

### Outbox transforma publicação em dado persistente

A aplicação grava:

- Order;
- audit;
- OutboxMessage.

Tudo na mesma transação local.

### Publisher trabalha depois do commit

Outro componente consulta mensagens pendentes e publica.

### Idempotência continua necessária

Uma mensagem pode ser publicada novamente.

O consumidor precisa tolerar repetição.

### Observabilidade fecha a operação

Sem métrica de backlog, uma Outbox pode acumular mensagens silenciosamente.

---

## Mão na massa guiada

### 1. Criar Lesson Manifest

Arquivo:

```text
docs/final-teachable-lesson/LESSON_MANIFEST.md
```

Registre:

- título;
- duração;
- público;
- objetivos;
- pré-requisitos;
- artifacts;
- comandos;
- versão;
- responsável;
- data de revisão.

---

### 2. Definir duração

Plano principal:

```text
120 minutos.
```

Distribuição:

```text
15:
contexto e diagnostico.

20:
dual write.

20:
design da Outbox.

40:
implementacao guiada.

15:
testes.

5:
observabilidade.

5:
fechamento.
```

---

### 3. Criar Student Profile

Arquivo:

```text
docs/final-teachable-lesson/STUDENT_PROFILE.md
```

Perfil:

```text
desenvolvedor Java Backend iniciante ou intermediario,
com conhecimento de Spring Boot,
repositories,
PostgreSQL,
testes
e transacoes basicas,
mas sem experiencia pratica
com publicacao confiavel de eventos.
```

---

### 4. Criar Prerequisites

Arquivo:

```text
docs/final-teachable-lesson/PREREQUISITES.md
```

Obrigatórios:

- Java 21;
- Maven;
- Spring Boot básico;
- PostgreSQL;
- Docker Compose;
- JUnit 5;
- noção de transação;
- Git.

---

### 5. Criar diagnóstico inicial

Perguntas:

```text
o que acontece
se o banco confirmar
e o broker falhar?

um retry pode publicar duas vezes?

uma transacao do PostgreSQL
inclui automaticamente o Kafka?

como saber
se a Outbox esta acumulando?
```

---

### 6. Criar Learning Objectives

Arquivo:

```text
docs/final-teachable-lesson/LEARNING_OBJECTIVES.md
```

Ao final, o aluno consegue:

1. explicar dual write;
2. modelar `OutboxMessage`;
3. persistir `Order` e Outbox na mesma transação;
4. testar commit e rollback;
5. explicar duplicidade;
6. implementar publisher básico;
7. medir backlog;
8. diagnosticar mensagem pendente.

---

### 7. Criar Lesson Scope

Arquivo:

```text
docs/final-teachable-lesson/LESSON_SCOPE.md
```

Dentro:

- dual write;
- transação local;
- tabela Outbox;
- publisher;
- retry básico;
- status;
- métricas;
- testes.

Fora:

- CDC;
- Debezium;
- exactly-once global;
- multi-region;
- schema registry aprofundado;
- tuning avançado de Kafka.

---

## Preparação do ambiente

### 8. Criar Environment Setup

Arquivo:

```text
docs/final-teachable-lesson/ENVIRONMENT_SETUP.md
```

---

### 9. Validar Java

```powershell
java -version

javac -version
```

Saída esperada:

```text
versao 21.
```

---

### 10. Validar Maven

```powershell
mvn -version
```

---

### 11. Validar Docker

```powershell
docker version

docker compose version
```

---

### 12. Subir PostgreSQL

```powershell
docker compose `
  -f `
  compose.local.yml `
  up `
  -d `
  PostgreSQL
```

---

### 13. Verificar health

```powershell
docker compose `
  -f `
  compose.local.yml `
  ps
```

---

### 14. Executar baseline

```powershell
mvn test
```

---

### 15. Criar branch

```powershell
git switch `
  -c `
  lesson/716-transactional-outbox
```

---

### 16. Criar diretório do laboratório

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  -Path `
  labs/m20/aula-716-aula-ensinavel-final/orderflow-outbox-teachable-lesson
```

---

## Explicação conceitual

### 17. Criar Conceptual Explanation

Arquivo:

```text
docs/final-teachable-lesson/CONCEPTUAL_EXPLANATION.md
```

---

### 18. Apresentar o fluxo ingênuo

```text
request
-> save Order
-> publish event
-> response.
```

---

### 19. Mostrar o primeiro ponto de falha

O banco confirma.

A publicação falha.

Resultado:

```text
pedido existe,
mas o processamento assincrono
nao comeca.
```

---

### 20. Mostrar o segundo ponto de falha

O broker recebe.

A aplicação perde a resposta.

O cliente repete.

Resultado possível:

```text
evento duplicado.
```

---

### 21. Nomear dual write

Explique:

```text
duas escritas independentes
sem um commit atomico comum.
```

---

### 22. Perguntar ao aluno

```text
qual estado ficaria
se apenas uma operacao confirmasse?
```

---

### 23. Introduzir transação local

PostgreSQL consegue confirmar atomically:

- Order;
- OrderItem;
- audit;
- OutboxMessage.

---

### 24. Introduzir publisher separado

O publisher:

1. encontra pendentes;
2. tenta publicar;
3. marca sucesso;
4. registra falha;
5. agenda retry.

---

### 25. Declarar semântica

```text
at-least-once.
```

---

### 26. Declarar limite

Mensagem duplicada continua possível.

---

## Falha de dual write

### 27. Criar Dual Write Failure

Arquivo:

```text
docs/final-teachable-lesson/DUAL_WRITE_FAILURE.md
```

---

### 28. Criar implementação frágil

```java
package com.orderflow.outbox.application;

public final class FragileRegisterOrderHandler {

    private final OrderRepository orderRepository;
    private final EventPublisher eventPublisher;

    public FragileRegisterOrderHandler(
        OrderRepository orderRepository,
        EventPublisher eventPublisher
    ) {
        this.orderRepository = orderRepository;
        this.eventPublisher = eventPublisher;
    }

    public void handle(RegisterOrderCommand command) {
        Order order = command.toOrder();
        orderRepository.save(order);
        eventPublisher.publish(order.createdEvent());
    }
}
```

---

### 29. Identificar problema

O método não controla uma transação distribuída.

---

### 30. Criar teste de falha do publisher

O teste deve provar:

- Order foi salva;
- publish falhou;
- fluxo ficou inconsistente.

---

### 31. Explicar por que não manter essa versão

---

## Design da Outbox

### 32. Criar Outbox Design

Arquivo:

```text
docs/final-teachable-lesson/OUTBOX_DESIGN.md
```

Campos:

- ID;
- aggregate type;
- aggregate ID;
- event type;
- payload;
- status;
- attempt count;
- next attempt at;
- created at;
- published at;
- last error;
- tenant ID.

---

### 33. Criar status

```java
package com.orderflow.outbox.persistence;

public enum OutboxStatus {
    PENDING,
    PUBLISHING,
    PUBLISHED,
    FAILED
}
```

---

### 34. Modelar OutboxMessage

```java
package com.orderflow.outbox.persistence;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public final class OutboxMessage {

    private final UUID id;
    private final String tenantId;
    private final String aggregateType;
    private final String aggregateId;
    private final String eventType;
    private final String payload;
    private final Instant createdAt;
    private OutboxStatus status;
    private int attemptCount;
    private Instant nextAttemptAt;
    private Instant publishedAt;
    private String lastError;

    public OutboxMessage(
        UUID id,
        String tenantId,
        String aggregateType,
        String aggregateId,
        String eventType,
        String payload,
        Instant createdAt
    ) {
        this.id = Objects.requireNonNull(id, "id");
        this.tenantId = requireText(tenantId, "tenantId");
        this.aggregateType =
            requireText(aggregateType, "aggregateType");
        this.aggregateId =
            requireText(aggregateId, "aggregateId");
        this.eventType =
            requireText(eventType, "eventType");
        this.payload =
            requireText(payload, "payload");
        this.createdAt =
            Objects.requireNonNull(createdAt, "createdAt");
        this.status = OutboxStatus.PENDING;
        this.nextAttemptAt = createdAt;
    }

    private static String requireText(
        String value,
        String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                field + " must not be blank"
            );
        }
        return value;
    }
}
```

---

### 35. Explicar por que guardar tenant

Toda consulta operacional precisa manter isolamento.

---

### 36. Explicar payload

O payload precisa ser:

- versionado;
- validável;
- sanitizado;
- compatível.

---

### 37. Explicar status `PUBLISHING`

Ajuda no claim, mas exige recuperação de mensagens abandonadas.

---

### 38. Criar migration

```sql
CREATE TABLE outbox_message (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(150) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ NULL,
    last_error VARCHAR(1000) NULL
);
```

---

### 39. Criar índice operacional

```sql
CREATE INDEX idx_outbox_pending_claim
ON outbox_message (
    status,
    next_attempt_at,
    created_at
);
```

---

### 40. Explicar índice parcial como refinamento

```sql
CREATE INDEX idx_outbox_pending_only
ON outbox_message (
    next_attempt_at,
    created_at
)
WHERE status IN ('PENDING', 'FAILED');
```

---

## Implementação guiada

### 41. Criar Guided Implementation

Arquivo:

```text
docs/final-teachable-lesson/GUIDED_IMPLEMENTATION.md
```

---

### 42. Criar OrderId

```java
package com.orderflow.outbox.domain;

import java.util.Objects;

public record OrderId(String value) {

    public OrderId {
        Objects.requireNonNull(value, "value");
        if (value.isBlank()) {
            throw new IllegalArgumentException(
                "value must not be blank"
            );
        }
    }
}
```

---

### 43. Criar OrderCreatedEvent

```java
package com.orderflow.outbox.domain;

import java.time.Instant;

public record OrderCreatedEvent(
    String eventId,
    String tenantId,
    String orderId,
    Instant occurredAt
) {
}
```

---

### 44. Criar Order

Mantenha:

- ID;
- tenant;
- status;
- created at.

---

### 45. Criar RegisterOrderCommand

---

### 46. Criar OrderRepository

```java
package com.orderflow.outbox.ports;

import com.orderflow.outbox.domain.Order;

public interface OrderRepository {
    void save(Order order);
}
```

---

### 47. Criar OutboxRepository

```java
package com.orderflow.outbox.ports;

import com.orderflow.outbox.persistence.OutboxMessage;

public interface OutboxRepository {
    void save(OutboxMessage message);
}
```

---

### 48. Criar TransactionBoundary

```java
package com.orderflow.outbox.application;

public interface TransactionBoundary {
    void execute(Runnable work);
}
```

---

### 49. Implementar handler transacional

```java
package com.orderflow.outbox.application;

import com.orderflow.outbox.domain.Order;
import com.orderflow.outbox.domain.OrderCreatedEvent;
import com.orderflow.outbox.persistence.OutboxMessage;
import com.orderflow.outbox.ports.OrderRepository;
import com.orderflow.outbox.ports.OutboxRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

public final class RegisterOrderHandler {

    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;
    private final TransactionBoundary transactionBoundary;
    private final Clock clock;

    public RegisterOrderHandler(
        OrderRepository orderRepository,
        OutboxRepository outboxRepository,
        TransactionBoundary transactionBoundary,
        Clock clock
    ) {
        this.orderRepository = orderRepository;
        this.outboxRepository = outboxRepository;
        this.transactionBoundary = transactionBoundary;
        this.clock = clock;
    }

    public void handle(RegisterOrderCommand command) {
        transactionBoundary.execute(() -> {
            Instant now = clock.instant();
            Order order = command.toOrder(now);
            OrderCreatedEvent event = order.createdEvent();

            orderRepository.save(order);

            outboxRepository.save(
                new OutboxMessage(
                    UUID.fromString(event.eventId()),
                    event.tenantId(),
                    "Order",
                    event.orderId(),
                    "OrderCreated",
                    command.toPayload(),
                    now
                )
            );
        });
    }
}
```

---

### 50. Explicar por que usar Clock

Permite teste determinístico.

---

### 51. Explicar por que publisher não aparece no handler

Publicação direta recriaria dual write.

---

### 52. Implementar adapter de transação

No runtime Spring:

```java
package com.orderflow.outbox.persistence;

import com.orderflow.outbox.application.TransactionBoundary;
import org.springframework.transaction.support.TransactionTemplate;

public final class SpringTransactionBoundary
    implements TransactionBoundary {

    private final TransactionTemplate transactionTemplate;

    public SpringTransactionBoundary(
        TransactionTemplate transactionTemplate
    ) {
        this.transactionTemplate = transactionTemplate;
    }

    @Override
    public void execute(Runnable work) {
        transactionTemplate.executeWithoutResult(
            status -> work.run()
        );
    }
}
```

---

### 53. Explicar alternativa com `@Transactional`

Pode ser usada no application service quando o proxy e o boundary estão bem definidos.

---

### 54. Evitar self-invocation

---

### 55. Implementar publisher básico

Fluxo:

1. buscar lote;
2. marcar claim;
3. publicar;
4. marcar sucesso;
5. registrar erro;
6. agendar retry.

---

### 56. Definir contrato do broker

```java
package com.orderflow.outbox.persistence;

public interface BrokerPublisher {
    void publish(
        String eventType,
        String aggregateId,
        String payload
    );
}
```

---

### 57. Criar OutboxPublisher

```java
package com.orderflow.outbox.persistence;

import java.time.Clock;
import java.util.List;

public final class OutboxPublisher {

    private final OutboxQueryRepository queryRepository;
    private final BrokerPublisher brokerPublisher;
    private final Clock clock;

    public OutboxPublisher(
        OutboxQueryRepository queryRepository,
        BrokerPublisher brokerPublisher,
        Clock clock
    ) {
        this.queryRepository = queryRepository;
        this.brokerPublisher = brokerPublisher;
        this.clock = clock;
    }

    public void publishBatch(int batchSize) {
        List<OutboxMessage> messages =
            queryRepository.claimPending(
                batchSize,
                clock.instant()
            );

        for (OutboxMessage message : messages) {
            publishOne(message);
        }
    }

    private void publishOne(OutboxMessage message) {
        try {
            brokerPublisher.publish(
                message.eventType(),
                message.aggregateId(),
                message.payload()
            );
            queryRepository.markPublished(
                message.id(),
                clock.instant()
            );
        } catch (RuntimeException error) {
            queryRepository.markFailed(
                message.id(),
                sanitize(error),
                clock.instant()
            );
        }
    }

    private String sanitize(RuntimeException error) {
        String message = error.getMessage();
        if (message == null || message.isBlank()) {
            return error.getClass().getSimpleName();
        }
        return message.substring(
            0,
            Math.min(message.length(), 500)
        );
    }
}
```

---

### 58. Explicar método de claim

Em PostgreSQL, uma estratégia possível usa:

```sql
FOR UPDATE SKIP LOCKED
```

---

### 59. Explicar concorrência

Múltiplos publishers não devem processar a mesma linha simultaneamente.

---

### 60. Explicar crash após publish

Se o processo publicar e cair antes de marcar sucesso, a mensagem pode ser publicada novamente.

---

### 61. Relacionar idempotência do consumidor

---

### 62. Criar retry básico

Use:

- `attempt_count`;
- `next_attempt_at`;
- limite;
- backoff;
- jitter opcional.

---

### 63. Definir estado terminal

Após limite, a mensagem pode permanecer `FAILED` para ação operacional.

---

### 64. Não apagar mensagem falha

Preserve evidence.

---

## Testes

### 65. Criar Test Plan

Arquivo:

```text
docs/final-teachable-lesson/TEST_PLAN.md
```

---

### 66. Testar caminho feliz

Provar:

- Order salva;
- Outbox salva;
- mesmo tenant;
- mesmo aggregate ID;
- status pendente.

---

### 67. Testar rollback

Force falha ao salvar Outbox.

Esperado:

- Order não permanece;
- Outbox não permanece.

---

### 68. Testar publisher com sucesso

---

### 69. Testar publisher com falha

---

### 70. Testar retry

---

### 71. Testar duplicidade de publicação

O consumidor precisa ser idempotente.

---

### 72. Criar teste unitário do handler

Use fakes que registram chamadas.

---

### 73. Criar teste integrado transacional

Use PostgreSQL real com Testcontainers.

---

### 74. Criar cenário de rollback

```java
package com.orderflow.outbox;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class RegisterOrderTransactionIT {

    @Test
    void shouldRollbackOrderWhenOutboxInsertFails() {
        assertThatThrownBy(
            () -> service.register(
                fixture.invalidOutboxCommand()
            )
        ).isInstanceOf(RuntimeException.class);

        fixture.assertNoOrderStored();
        fixture.assertNoOutboxStored();
    }
}
```

---

### 75. Explicar por que H2 pode esconder diferenças

Use banco compatível com produção para constraints e locking.

---

### 76. Contar queries quando testar claim

---

### 77. Testar dois publishers concorrentes

---

### 78. Testar recovery de `PUBLISHING` abandonado

---

## Observabilidade

### 79. Criar Observability Plan

Arquivo:

```text
docs/final-teachable-lesson/OBSERVABILITY_PLAN.md
```

Métricas:

- pending count;
- failed count;
- oldest pending age;
- publication rate;
- failure rate;
- retry count;
- publish latency.

---

### 80. Definir log de sucesso

Inclua:

- message ID;
- event type;
- aggregate ID;
- tenant sanitizado;
- attempt count;
- correlation ID.

---

### 81. Definir log de falha

Não inclua:

- token;
- secret;
- payload sensível integral.

---

### 82. Criar alerta de backlog

Exemplo:

```text
oldest pending age
acima do SLO
por cinco minutos.
```

---

### 83. Criar dashboard mínimo

Cards:

- pendentes;
- falhas;
- idade;
- taxa;
- latência.

---

### 84. Relacionar métrica e ação

Alerta sem runbook não fecha operação.

---

## Troubleshooting

### 85. Criar Troubleshooting Guide

Arquivo:

```text
docs/final-teachable-lesson/TROUBLESHOOTING_GUIDE.md
```

---

### 86. Cenário: Order existe e Outbox não

Possíveis causas:

- transações separadas;
- repository fora do boundary;
- commit intermediário;
- teste incorreto.

---

### 87. Cenário: Outbox cresce

Verifique:

- scheduler;
- publisher;
- broker;
- credencial;
- timeout;
- locks;
- pool.

---

### 88. Cenário: mensagens duplicadas

Verifique:

- crash após publish;
- retry;
- timeout ambíguo;
- consumer sem Inbox.

---

### 89. Cenário: linhas presas em `PUBLISHING`

Implemente recovery por lease ou timeout.

---

### 90. Cenário: claim lento

Verifique:

- índice;
- volume;
- query plan;
- batch;
- lock;
- vacuum.

---

### 91. Cenário: erro vazou payload

Sanitize log e trate como incidente conforme o dado.

---

### 92. Criar árvore de diagnóstico

```text
backlog alto
-> publisher esta rodando?
   -> nao:
      revisar schedule.
   -> sim:
      broker responde?
      -> nao:
         revisar rede e credencial.
      -> sim:
         claim retorna linhas?
         -> nao:
            revisar status,
            next_attempt_at
            e indice.
```

---

## Exercício independente

### 93. Criar Independent Exercise

Arquivo:

```text
docs/final-teachable-lesson/INDEPENDENT_EXERCISE.md
```

Objetivo:

```text
adicionar retry exponencial
com limite,
jitter controlado,
last_error
e next_attempt_at.
```

---

### 94. Definir requisitos

- primeira falha agenda novo horário;
- tentativa incrementa;
- atraso possui teto;
- erro é sanitizado;
- mensagem não é apagada;
- após limite, status terminal;
- `Clock` é injetado;
- tenant é preservado.

---

### 95. Definir testes mínimos

1. primeira falha;
2. segunda falha;
3. teto;
4. sucesso após retry;
5. limite excedido;
6. erro sem mensagem;
7. horário determinístico.

---

### 96. Definir extensão opcional

- jitter injetável;
- claim concorrente;
- recovery de lease;
- métrica por tentativa.

---

## Guia de solução

### 97. Criar Exercise Solution Guide

Arquivo:

```text
docs/final-teachable-lesson/EXERCISE_SOLUTION_GUIDE.md
```

Não entregue código completo no enunciado.

Inclua pistas graduais:

1. atualize `attempt_count`;
2. calcule atraso;
3. aplique teto;
4. use `Clock`;
5. sanitize erro;
6. defina estado.

---

### 98. Criar pseudocódigo

```text
attempt = attempt + 1;

if attempt >= limit:
    status = FAILED;
else:
    next = now + backoff(attempt);
```

---

### 99. Explicar trade-off

Retry mais rápido reduz latência, mas pode aumentar pressão no broker.

---

## Avaliação

### 100. Criar Assessment Rubric

Arquivo:

```text
docs/final-teachable-lesson/ASSESSMENT_RUBRIC.md
```

Critérios:

- explica dual write;
- modela Outbox;
- usa transação única;
- testa rollback;
- implementa publisher;
- reconhece duplicidade;
- mede backlog;
- diagnostica falha;
- explica custos.

---

### 101. Criar níveis

```text
1:
nao demonstrado.

2:
parcial.

3:
adequado.

4:
consistente.

5:
consegue ensinar.
```

---

### 102. Definir evidência por nível

---

### 103. Evitar avaliar Kafka internals avançados

---

## Revisão

### 104. Criar Review Questions

Arquivo:

```text
docs/final-teachable-lesson/REVIEW_QUESTIONS.md
```

Perguntas:

1. o que é dual write?
2. qual garantia a Outbox fornece?
3. por que publisher fica separado?
4. por que duplicidade ainda existe?
5. para que serve Inbox?
6. por que guardar tenant?
7. o que `SKIP LOCKED` ajuda a resolver?
8. o que ocorre em crash após publish?
9. qual métrica mostra backlog?
10. por que testar rollback?
11. o que acontece com mensagem terminal?
12. qual custo a Outbox adiciona?

---

### 105. Criar respostas curtas

---

### 106. Criar Student Checkpoint

Arquivo:

```text
docs/final-teachable-lesson/STUDENT_CHECKPOINT.md
```

Checklist:

- [ ] expliquei dual write;
- [ ] criei migration;
- [ ] criei OutboxMessage;
- [ ] persisti na mesma transação;
- [ ] testei rollback;
- [ ] implementei publisher;
- [ ] tratei falha;
- [ ] medi backlog;
- [ ] completei exercício;
- [ ] expliquei duplicidade.

---

## Notas do instrutor

### 107. Criar Instructor Notes

Arquivo:

```text
docs/final-teachable-lesson/INSTRUCTOR_NOTES.md
```

Inclua:

- pontos onde alunos travam;
- perguntas de diagnóstico;
- alternativas;
- respostas aceitáveis;
- erros comuns;
- plano de corte;
- extensão avançada.

---

### 108. Definir plano de corte

Se faltar tempo, preserve:

- dual write;
- transação;
- teste de rollback;
- limite de duplicidade.

Corte:

- jitter;
- recovery avançado;
- tuning;
- dashboard detalhado.

---

### 109. Definir perguntas de apoio

---

### 110. Definir momentos de silêncio produtivo

---

## Acessibilidade

### 111. Criar Accessibility Review

Arquivo:

```text
docs/final-teachable-lesson/ACCESSIBILITY_REVIEW.md
```

Valide:

- linguagem;
- siglas;
- contraste;
- headings;
- texto alternativo;
- comandos;
- linhas de código;
- resultado esperado;
- sistema operacional;
- navegação por teclado.

---

### 112. Criar descrição textual dos diagramas

---

### 113. Evitar depender de cor nos status

Use nome e ícone textual.

---

### 114. Limitar largura de código

---

### 115. Oferecer comandos PowerShell

---

### 116. Indicar equivalentes conceituais para Bash

---

## Script final

### 117. Criar Final Lesson Script

Arquivo:

```text
docs/final-teachable-lesson/FINAL_LESSON_SCRIPT.md
```

Estrutura:

1. abertura;
2. diagnóstico;
3. objetivo;
4. problema;
5. demonstração da falha;
6. conceito;
7. migration;
8. domínio;
9. repository;
10. transaction boundary;
11. handler;
12. teste;
13. publisher;
14. duplicidade;
15. observabilidade;
16. exercício;
17. revisão;
18. fechamento.

---

### 118. Escrever abertura

```text
hoje voce vai impedir
que um pedido salvo
fique sem evento
por causa de uma falha
entre banco e broker.
```

---

### 119. Escrever checkpoint intermediário

```text
ate aqui,
o pedido
e a mensagem da Outbox
confirmam ou falham juntos.
```

---

### 120. Escrever fechamento

```text
a Outbox protege a durabilidade
da intencao de publicar;
a idempotencia protege
o processamento repetido;
a observabilidade protege
a operacao silenciosa.
```

---

## Publicação

### 121. Criar Publication Checklist

Arquivo:

```text
docs/final-teachable-lesson/PUBLICATION_CHECKLIST.md
```

Valide:

- título;
- H1;
- links;
- comandos;
- packages;
- imports;
- código;
- testes;
- imagens;
- acessibilidade;
- ortografia;
- escopo;
- licença;
- secrets;
- download.

---

### 122. Validar código copiável

---

### 123. Validar links internos

---

### 124. Validar todos os comandos

---

### 125. Validar saída esperada

---

### 126. Executar clean clone

---

### 127. Executar aula do início ao fim

---

### 128. Registrar duração real

---

### 129. Solicitar revisão técnica

---

### 130. Solicitar revisão pedagógica

---

### 131. Solicitar revisão de iniciante

---

### 132. Corrigir bloqueadores

---

## Governança

### 133. Criar Final Lesson Scorecard

Arquivo:

```text
docs/final-teachable-lesson/FINAL_LESSON_SCORECARD.md
```

Critérios:

- público;
- objetivo;
- sequência;
- clareza;
- correção;
- prática;
- teste;
- exercício;
- troubleshooting;
- acessibilidade;
- publicação;
- autonomia do aluno.

---

### 134. Criar Final Lesson Matrix

Arquivo:

```text
docs/final-teachable-lesson/FINAL_LESSON_MATRIX.md
```

Colunas:

- objetivo;
- seção;
- exemplo;
- prática;
- avaliação;
- evidence;
- status.

---

### 135. Criar Risk Register

Arquivo:

```text
docs/final-teachable-lesson/FINAL_LESSON_RISK_REGISTER.md
```

Riscos:

```text
pre-requisito oculto;

comando nao testado;

codigo incompleto;

dual write mal explicado;

duplicidade omitida;

rollback sem teste;

observabilidade superficial;

exercicio desalinhado;

link quebrado;

banca tecnica antecipada.
```

---

### 136. Criar Traceability

Arquivo:

```text
docs/final-teachable-lesson/FINAL_LESSON_TRACEABILITY.md
```

Exemplo:

```text
objetivo:
explicar dual write
-> falha demonstrada
-> diagrama
-> review question.

objetivo:
provar atomicidade
-> transaction boundary
-> integration test
-> rollback evidence.

objetivo:
operar Outbox
-> metrics
-> troubleshooting
-> backlog exercise.
```

---

### 137. Criar boundary da próxima aula

Arquivo:

```text
docs/final-teachable-lesson/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 716 define:

- final teachable lesson;
- student profile;
- prerequisites;
- observable objectives;
- lesson scope;
- environment setup;
- dual-write explanation;
- Outbox design;
- guided implementation;
- migrations;
- transaction boundary;
- publisher;
- retries;
- tests;
- observability;
- troubleshooting;
- independent exercise;
- solution guide;
- assessment;
- review;
- accessibility;
- publication;
- final lesson evidence.

A aula 717 define:

- technical board simulation;
- project presentation;
- architecture defense;
- Java questions;
- Spring JPA questions;
- SQL questions;
- security questions;
- DevOps cloud questions;
- live coding;
- system design;
- teaching defense;
- integrated scoring;
- final feedback.

Nenhuma banca tecnica final
e executada nesta aula.
```

---

## Relatório e evidence

### 138. Criar report

Arquivo:

```text
reports/final-teachable-lesson-report.yaml
```

Exemplo:

```yaml
finalTeachableLesson:
  profile:
    defined:
      true

  objectives:
    total:
      8
    observable:
      8

  execution:
    cleanClone:
      PASS
    commands:
      PASS
    tests:
      PASS
    durationMinutes:
      measured

  teaching:
    sequence:
      PASS
    guidedPractice:
      PASS
    independentExercise:
      PASS
    assessment:
      PASS
    troubleshooting:
      PASS
    accessibility:
      PASS

  reviews:
    technical:
      PASS
    pedagogical:
      PASS
    beginner:
      PASS

  technicalBoard:
    completed:
      false

  gate:
    PASS
```

---

### 139. Criar evidence

Arquivo:

```text
contracts/final-teachable-lesson-evidence.yaml
```

Campos:

- lesson;
- project;
- profile status;
- prerequisite count;
- objective count;
- observable objective count;
- scope item count;
- environment command count;
- code file count;
- test file count;
- test count;
- passing test count;
- migration count;
- diagram count;
- guided step count;
- exercise count;
- acceptance criterion count;
- review question count;
- troubleshooting scenario count;
- accessibility check count;
- publication check count;
- planned duration;
- actual duration;
- clean clone status;
- technical review status;
- pedagogical review status;
- beginner review status;
- broken link count;
- command failure count;
- secret finding count;
- technical board completed;
- documentation status;
- gate status;
- timestamp.

---

### 140. Criar gate

Status:

```text
PASS;

FAIL_LESSON_MANIFEST;

FAIL_STUDENT_PROFILE;

FAIL_PREREQUISITES;

FAIL_LEARNING_OBJECTIVES;

FAIL_SCOPE;

FAIL_ENVIRONMENT_SETUP;

FAIL_CONCEPTUAL_EXPLANATION;

FAIL_DUAL_WRITE_DEMONSTRATION;

FAIL_OUTBOX_DESIGN;

FAIL_GUIDED_IMPLEMENTATION;

FAIL_MIGRATION;

FAIL_TRANSACTION_BOUNDARY;

FAIL_PUBLISHER;

FAIL_RETRY;

FAIL_TESTS;

FAIL_OBSERVABILITY;

FAIL_TROUBLESHOOTING;

FAIL_INDEPENDENT_EXERCISE;

FAIL_SOLUTION_GUIDE;

FAIL_ASSESSMENT;

FAIL_REVIEW;

FAIL_ACCESSIBILITY;

FAIL_PUBLICATION_CHECKLIST;

FAIL_CLEAN_CLONE;

FAIL_TECHNICAL_REVIEW;

FAIL_PEDAGOGICAL_REVIEW;

FAIL_BEGINNER_REVIEW;

FAIL_BROKEN_LINK;

FAIL_COMMAND;

FAIL_SECRET;

FAIL_TECHNICAL_BOARD_ANTICIPATION;

INCONCLUSIVE.
```

---

### 141. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\teaching-method\validate-learning-objectives.ps1

.\scripts\teaching-method\validate-concept-order.ps1

.\scripts\teaching-method\validate-exercise-alignment.ps1

mvn test
```

---

### 142. Executar clean clone

---

### 143. Seguir a aula como aluno

Não use atalhos não documentados.

---

### 144. Registrar todos os bloqueios

---

### 145. Corrigir bloqueios

---

### 146. Reexecutar do zero

---

### 147. Gravar a entrega final

---

### 148. Coletar revisão técnica

---

### 149. Coletar revisão pedagógica

---

### 150. Coletar revisão iniciante

---

### 151. Consolidar feedback

---

### 152. Fechar gate

---

### 153. Encerrar o laboratório

Confirme:

- Manifest;
- profile;
- prerequisites;
- objectives;
- scope;
- environment;
- explanation;
- dual write;
- Outbox;
- migration;
- domain;
- repositories;
- transaction;
- handler;
- publisher;
- retry;
- tests;
- observability;
- troubleshooting;
- exercise;
- solution guide;
- assessment;
- review;
- instructor notes;
- accessibility;
- final script;
- publication;
- clean clone;
- three reviews;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 717 preservada.

---

## Entendendo o que foi feito

### O método virou uma entrega real

A aula deixou de ser apenas planejamento.

### O aluno ganhou autonomia

Pré-requisitos, comandos, resultados e troubleshooting ficaram explícitos.

### O problema apareceu antes da solução

Dual write tornou a necessidade da Outbox compreensível.

### A implementação ganhou evidência

Commit e rollback foram testados.

### O publisher ganhou limite claro

Publicação repetida continuou sendo considerada.

### A operação ganhou observabilidade

Backlog e idade passaram a ser medidos.

### O exercício ganhou alinhamento

Retry foi construído sobre conceitos já ensinados.

### A publicação ganhou validação

Clean clone, comandos e revisões reduziram bloqueios.

---

## Erros comuns importantes

### Entregar código pronto sem mostrar a falha

O aluno não entende a necessidade.

### Tratar Outbox como exactly-once

A explicação fica tecnicamente incorreta.

### Colocar publish dentro da transação local

A chamada externa prolonga e fragiliza o boundary.

### Não testar rollback

A principal garantia fica sem evidence.

### Ignorar tenant

A operação pode violar isolamento.

### Apagar mensagens falhas

Evidence e recuperação são perdidas.

### Não medir idade do backlog

O problema pode ficar silencioso.

### Cobrar jitter sem ter explicado backoff

O exercício introduz assunto novo.

### Publicar sem clean clone

Passos ocultos permanecem.

### Antecipar a banca técnica

Essa etapa pertence à aula 717.

---

## Comandos úteis

### Executar testes

```powershell
mvn test
```

### Subir banco

```powershell
docker compose `
  -f `
  compose.local.yml `
  up `
  -d `
  PostgreSQL
```

### Validar documentação

```powershell
.\scripts\validate-documentation.ps1
```

### Validar secrets

```powershell
.\scripts\validate-secrets.ps1
```

---

## Exercício principal

Produza e execute a aula final sobre Transactional Outbox.

Inclua:

1. criar manifest;
2. definir aluno;
3. listar pré-requisitos;
4. criar diagnóstico;
5. definir objetivos;
6. proteger escopo;
7. validar ambiente;
8. mostrar dual write;
9. criar teste de falha;
10. criar migration;
11. criar status;
12. criar OutboxMessage;
13. criar repositories;
14. criar transaction boundary;
15. implementar handler;
16. testar sucesso;
17. testar rollback;
18. implementar publisher;
19. tratar falha;
20. explicar duplicidade;
21. criar métricas;
22. criar troubleshooting;
23. criar exercício de retry;
24. criar rubrica;
25. criar revisão;
26. revisar acessibilidade;
27. executar clean clone;
28. seguir como aluno;
29. corrigir bloqueios;
30. coletar três revisões;
31. fechar report;
32. fechar evidence;
33. aprovar gate.

Não execute a banca técnica final.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 715 e ponte para a aula 717 foram preservadas;
- Lesson Manifest foi criado;
- duração, público, objetivos, artifacts e versão foram registrados;
- Student Profile foi criado;
- Prerequisites foi criado;
- diagnóstico inicial foi criado;
- Learning Objectives foi criado;
- oito objetivos observáveis foram definidos;
- Lesson Scope foi criado;
- conteúdo principal e fora de escopo foram definidos;
- Environment Setup foi criado;
- Java, Maven, Docker e PostgreSQL foram validados;
- baseline foi executada;
- branch e laboratório foram criados;
- Conceptual Explanation foi criada;
- fluxo ingênuo e falhas foram apresentados;
- dual write foi nomeado;
- transação local e publisher foram explicados;
- at-least-once e duplicidade foram declarados;
- Dual Write Failure foi criado;
- implementação frágil e teste de inconsistência foram criados;
- Outbox Design foi criado;
- campos, status, tenant, payload, migration e índices foram definidos;
- Guided Implementation foi criada;
- OrderId, event, Order, command, repositories e transaction boundary foram definidos;
- handler transacional foi implementado;
- `Clock` foi injetado;
- publicação direta foi evitada;
- adapter Spring foi criado;
- self-invocation foi evitada;
- publisher básico foi implementado;
- claim, concorrência, crash, retry e estado terminal foram explicados;
- mensagem falha não foi apagada;
- Test Plan foi criado;
- caminho feliz, rollback, publisher, retry, duplicidade e concorrência foram testados;
- Testcontainers foi usado;
- banco incompatível foi evitado;
- recovery foi testado;
- Observability Plan foi criado;
- métricas, logs, alerta, dashboard e runbook foram definidos;
- Troubleshooting Guide foi criado;
- inconsistência, backlog, duplicidade, publishing preso, claim lento e vazamento foram tratados;
- árvore de diagnóstico foi criada;
- Independent Exercise foi criado;
- requisitos e testes de retry foram definidos;
- extensão opcional foi criada;
- Exercise Solution Guide foi criado;
- pistas graduais e pseudocódigo foram fornecidos;
- trade-off de retry foi explicado;
- Assessment Rubric foi criada;
- níveis e evidence foram definidos;
- conteúdo avançado fora de escopo não foi cobrado;
- Review Questions foi criado;
- Student Checkpoint foi criado;
- Instructor Notes foi criado;
- plano de corte foi definido;
- Accessibility Review foi criada;
- diagramas, cores, comandos e ambientes foram revisados;
- Final Lesson Script foi criado;
- abertura, checkpoint e fechamento foram escritos;
- Publication Checklist foi criado;
- código, links, comandos, saída e clean clone foram validados;
- duração real foi registrada;
- revisões técnica, pedagógica e iniciante foram coletadas;
- bloqueadores foram corrigidos;
- Scorecard foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 717 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- aula foi seguida como aluno;
- bloqueios foram registrados e corrigidos;
- execução do zero foi repetida;
- entrega final foi gravada;
- commit recomendado e diário de bordo estão presentes;
- banca técnica final não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

mvn test

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/final-teachable-lesson `
  src/main/java/com/orderflow/outbox `
  src/test/java/com/orderflow/outbox `
  scripts/teaching-method `
  reports/final-teachable-lesson-report.yaml `
  contracts/final-teachable-lesson-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|realTenant|realCustomer|technical-board-final-answer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(teaching): publish final Transactional Outbox lesson"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- secret;
- dado real;
- código sem teste;
- respostas da banca 717.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você produziu uma aula ensinável final.

Você entregou:

```text
student profile;

prerequisites;

observable objectives;

scope;

environment setup;

dual-write explanation;

Outbox design;

guided implementation;

migration;

transaction boundary;

publisher;

retry;

tests;

observability;

troubleshooting;

independent exercise;

solution guide;

assessment;

review;

accessibility;

publication checklist;

clean clone;

technical review;

pedagogical review;

beginner review;

report e evidence.
```

Agora outra pessoa pode estudar, executar, errar, corrigir, testar e explicar Transactional Outbox usando o material criado.

A próxima aula será:

```text
717 - M20.47 - Banca tecnica simulada
```

Nela, você apresentará o projeto e responderá uma banca integrada sobre Java, Spring, JPA, SQL, segurança, DevOps, arquitetura, live coding, system design e capacidade de ensino.

Nenhuma banca técnica final foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o perfil do aluno.
- [ ] Listei pré-requisitos.
- [ ] Defini objetivos.
- [ ] Protegi escopo.
- [ ] Expliquei dual write.
- [ ] Modelei Outbox.
- [ ] Implementei transação.
- [ ] Testei rollback.
- [ ] Implementei publisher.
- [ ] Expliquei duplicidade.
- [ ] Criei observabilidade.
- [ ] Criei troubleshooting.
- [ ] Criei exercício.
- [ ] Executei clean clone.
- [ ] Preservei a banca para a aula 717.

---

## Troubleshooting adicional

### O aluno não entende dual write

Use uma linha do tempo com banco e broker.

### A transação não faz rollback

Revise transaction manager, proxy e boundary.

### O publisher publica duplicado

Explique at-least-once e valide consumidor.

### A query de claim bloqueia

Revise `SKIP LOCKED`, índice e duração da transação.

### O backlog não reduz

Verifique scheduler, broker e retry.

### O teste passa em memória, mas falha no PostgreSQL

Use Testcontainers e revise tipos.

### A aula ficou longa

Use o plano de corte.

### O exercício ficou desconectado

Revise objetivos e prática guiada.

### O clean clone falha

Existe passo oculto ou artifact ausente.

### Quero avaliar toda a formação

Essa etapa pertence à aula 717.

---

## Perguntas de revisão

1. O que é dual write?
2. Qual garantia a Outbox fornece?
3. Outbox elimina duplicidade?
4. Por que publisher é separado?
5. O que precisa estar na mesma transação?
6. Para que serve tenant na Outbox?
7. O que `SKIP LOCKED` ajuda a fazer?
8. O que ocorre se o processo cai após publish?
9. Por que usar Inbox?
10. O que oldest pending age mede?
11. Por que testar rollback?
12. Por que usar PostgreSQL real?
13. O que `Clock` melhora?
14. Por que não apagar falha?
15. O que retry pode piorar?
16. Quando usar plano de corte?
17. O que clean clone valida?
18. Por que revisão iniciante?
19. O que rubrica mede?
20. O que traceability conecta?
21. O que a aula 717 fará?
22. O que não foi executado?
23. Qual é a próxima aula?
24. Qual é a regra central?
25. O que torna a aula ensinável?

---

## Roteiro de resposta

1. Duas escritas independentes.
2. Durabilidade da intenção.
3. Não.
4. Evitar dual write.
5. Order e Outbox.
6. Isolamento.
7. Claim concorrente.
8. Pode duplicar.
9. Idempotência do consumidor.
10. Backlog.
11. Provar atomicidade.
12. Compatibilidade real.
13. Testabilidade.
14. Preservar evidence.
15. Pressão e duplicidade.
16. Quando faltar tempo.
17. Passos explícitos.
18. Clareza para o público.
19. Domínio observável.
20. Objetivo e evidence.
21. Banca técnica simulada.
22. Banca final.
23. Banca tecnica simulada.
24. Ensinar execução e correção.
25. Autonomia verificável.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 716 - M20.46 - Aula ensinavel final

- Continuei após Como ensinar o que aprendeu.
- Criei Lesson Manifest.
- Defini duração, público, objetivos, artifacts e revisão.
- Criei Student Profile.
- Criei Prerequisites.
- Criei diagnóstico inicial.
- Criei Learning Objectives.
- Defini oito objetivos observáveis.
- Criei Lesson Scope.
- Protegi conteúdo principal e fora de escopo.
- Criei Environment Setup.
- Validei Java, Maven, Docker e PostgreSQL.
- Executei baseline.
- Criei branch e laboratório.
- Criei Conceptual Explanation.
- Mostrei fluxo ingênuo, dual write e falhas.
- Expliquei transação local, publisher e at-least-once.
- Criei Dual Write Failure.
- Criei implementação frágil e teste de inconsistência.
- Criei Outbox Design.
- Defini campos, status, tenant, payload, migration e índices.
- Criei Guided Implementation.
- Criei OrderId, event, repositories e transaction boundary.
- Implementei handler transacional.
- Injetei Clock.
- Evitei publicação direta.
- Implementei adapter Spring.
- Evitei self-invocation.
- Implementei publisher.
- Defini claim, concorrência, retry e estado terminal.
- Preservei mensagens falhas.
- Criei Test Plan.
- Testei sucesso, rollback, publisher, retry, duplicidade e concorrência.
- Usei Testcontainers.
- Testei recovery.
- Criei Observability Plan.
- Defini métricas, logs, alertas, dashboard e runbook.
- Criei Troubleshooting Guide.
- Tratei inconsistência, backlog, duplicidade, publishing preso, claim lento e vazamento.
- Criei árvore de diagnóstico.
- Criei Independent Exercise.
- Defini retry exponencial, critérios e testes.
- Criei extensão opcional.
- Criei Exercise Solution Guide.
- Forneci pistas e pseudocódigo.
- Criei Assessment Rubric.
- Criei níveis e evidence.
- Criei Review Questions.
- Criei Student Checkpoint.
- Criei Instructor Notes.
- Defini plano de corte.
- Criei Accessibility Review.
- Revisei linguagem, diagramas, cores, comandos e ambientes.
- Criei Final Lesson Script.
- Escrevi abertura, checkpoints e fechamento.
- Criei Publication Checklist.
- Validei código, links, comandos e saída.
- Executei clean clone.
- Segui a aula como aluno.
- Registrei duração real.
- Solicitei revisão técnica, pedagógica e iniciante.
- Corrigi bloqueadores.
- Criei Final Lesson Scorecard.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 717.
- Criei report, evidence e gate.
- Reexecutei a aula do zero.
- Gravei a entrega final.
- Não antecipei a banca técnica.
- Próxima aula: Banca tecnica simulada.
```

---

## Referência técnica curta

- Teachable Lesson.
- Dual Write.
- Transactional Outbox.
- Local Transaction.
- At-Least-Once.
- Inbox.
- Retry.
- Backoff.
- SKIP LOCKED.
- Backlog Age.
- Testcontainers.
- Rollback Test.
- Clean Clone.
- Assessment Rubric.
- Publication Gate.

Regra final:

```text
A aula ensinavel final do OrderFlow deve permitir aprendizagem autonoma e verificavel: lesson manifest registra publico, duracao, objetivos, prerequisites, artifacts and version, student profile define conhecimento e ambiente, observable objectives cobrem explain dual write, model Outbox, persist atomically, test rollback, publish, handle duplicates, observe backlog and diagnose failures, scope protege a aula contra CDC, exactly-once global and advanced Kafka internals, environment setup valida Java 21, Maven, Docker, PostgreSQL and baseline, conceptual explanation mostra request, database commit, broker failure, retry and duplicate before nomear Transactional Outbox, dual-write demonstration prova a inconsistência da publicação direta, Outbox design define ID, tenant, aggregate, event, payload, status, attempts, scheduling, timestamps and sanitized errors, migration and indexes suportam claim operacional, guided implementation cria domain, ports, transaction boundary, handler and publisher sem chamada externa dentro do commit local, Clock torna tempo testável, publisher usa batch, claim seguro, success, failure and retry, crash after publish é tratado como possível duplicidade e exige consumer idempotency, tests cobrem happy path, atomic rollback, publisher success, failure, retry, concurrent claim and abandoned publishing com PostgreSQL real, observability mede pending, failed, oldest age, rate, latency and retries com alert and runbook, troubleshooting investiga transaction, scheduler, broker, locks, indexes, duplicate and sensitive logs, independent exercise adiciona exponential backoff, cap, terminal state and deterministic time, assessment mede conceito, implementação, diagnóstico and defesa, accessibility, final script, publication checklist, clean clone and three reviews comprovam autonomia, report and evidence fecham o gate, enquanto apresentação integrada, perguntas técnicas, live coding, system design and teaching defense permanecem reservados para a aula 717.
```
