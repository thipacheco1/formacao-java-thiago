# 495 - M16.40 - Microsservicos vs monolito modular

## Apresentação da aula

Nas aulas anteriores, você construiu uma base robusta para integrações:

```text
contratos;

mensageria;

Outbox;

Inbox;

deduplicação;

replay;

logs de correlação;

monitoramento.
```

Esses recursos costumam aparecer em arquiteturas de microsserviços.

Isso não significa que todo sistema deva começar distribuído.

Muitas equipes cometem um erro recorrente:

```text
o sistema crescerá;

logo,
precisamos começar
com microsserviços.
```

Outra equipe pode responder com o extremo oposto:

```text
microsserviços são complexos;

logo,
tudo deve permanecer
em uma aplicação única.
```

As duas decisões são superficiais.

A pergunta central desta aula será:

```text
quando manter capacidades
dentro de um monólito modular

e quando aceitar o custo
de extrair um microsserviço?
```

Para responder, você precisa distinguir três modelos:

```text
monólito desorganizado;

monólito modular;

microsserviços.
```

Um monólito desorganizado pode possuir:

- dependências circulares;
- tabelas acessadas por qualquer classe;
- regras espalhadas;
- deploy arriscado;
- ausência de ownership;
- mudanças imprevisíveis;
- testes frágeis.

Esse modelo é frequentemente chamado de:

```text
big ball of mud.
```

Um monólito modular continua sendo uma aplicação implantada como uma unidade, mas possui:

- módulos explícitos;
- APIs internas;
- dados com ownership;
- dependências direcionadas;
- regras encapsuladas;
- testes por módulo;
- menor acoplamento;
- possibilidade de extração futura.

Microsserviços adicionam isolamento por processo e deploy.

Eles também adicionam:

- rede;
- latência;
- falhas parciais;
- contratos remotos;
- consistência eventual;
- observabilidade distribuída;
- pipelines independentes;
- segurança entre serviços;
- operação de múltiplos runtimes;
- maior custo de testes.

Portanto:

```text
microsserviço
não é apenas
um módulo em outro repositório.
```

Ele é uma unidade operacional independente.

O laboratório utilizará um cenário de ordens de serviço, preparando a próxima aula:

```text
496 - M16.41 - Projeto mensageria OS parte 1
```

A aplicação será organizada conceitualmente em quatro capacidades:

```text
service-order;

scheduling;

notification;

audit.
```

Nesta aula, elas permanecerão no mesmo processo.

A comunicação acontecerá por APIs internas bem definidas.

O objetivo é construir:

```text
um monólito modular
pronto para integrar,
não um monólito acoplado.
```

Depois, você criará uma matriz de decisão para avaliar se o módulo `notification` deveria ser extraído.

O resultado esperado não será:

```text
microsserviços sempre;

ou

monólito sempre.
```

A conclusão do laboratório será:

```text
começar com monólito modular;

preservar boundaries;

extrair somente
quando critérios concretos
justificarem o custo.
```

Essa escolha pertence ao cenário didático atual:

- uma aplicação;
- um time;
- baixo volume;
- laboratório local;
- necessidade de aprender boundaries;
- infraestrutura ainda controlada;
- próxima etapa focada em mensageria de OS.

Em outro contexto, a resposta pode ser diferente.

Ao final, você deverá explicar:

```text
por que monólito
não significa desorganização;

por que monólito modular
não é microsserviço;

por que microsserviços
exigem autonomia operacional;

por que banco compartilhado
pode destruir independência;

por que comunicação remota
introduz falhas;

por que deploy independente
só possui valor
com ownership independente;

como medir readiness
para extração;

como evitar
um monólito distribuído.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
493:
Logs de correlacao em integracoes.

494:
Monitoramento de integracoes.

495:
Microsservicos vs monolito modular.

496:
Projeto mensageria OS parte 1.

497:
Projeto mensageria OS parte 2.
```

A aula 494 respondeu:

```text
como detectar degradação
em integrações?
```

A aula 495 responderá:

```text
onde essas capacidades
devem viver
e como decidir sua distribuição?
```

Nesta aula:

```text
monólito:
sim.

monólito modular:
sim.

microsserviços:
sim.

distributed monolith:
sim.

ownership:
sim.

dados:
sim.

deploy:
sim.

escalabilidade:
sim.

falhas:
sim.

custos:
sim.

matriz de decisão:
sim.

ADR:
sim.

módulos Java:
sim.

mensageria OS completa:
não.

extração real:
não.

novo serviço:
não.

bounded contexts aprofundados:
não.
```

A regra central será:

```text
distribuição deve resolver
um problema concreto;

não apenas reproduzir
a mesma dependência
através da rede.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/architecture/os
├── serviceorder
│   ├── api
│   │   ├── CreateServiceOrderCommand.java
│   │   ├── CreateServiceOrderResult.java
│   │   └── ServiceOrderFacade.java
│   ├── application
│   │   └── ServiceOrderApplicationService.java
│   └── domain
│       ├── ServiceOrder.java
│       └── ServiceOrderStatus.java
├── scheduling
│   ├── api
│   │   ├── ScheduleRequest.java
│   │   ├── ScheduleResult.java
│   │   └── SchedulingApi.java
│   └── internal
│       └── InMemorySchedulingService.java
├── notification
│   ├── api
│   │   ├── NotificationApi.java
│   │   └── ServiceOrderCreatedNotification.java
│   └── internal
│       └── LoggingNotificationService.java
└── audit
    ├── api
    │   ├── AuditApi.java
    │   └── AuditEntry.java
    └── internal
        └── LoggingAuditService.java
```

Documentação:

```text
docs/architecture/decomposition
├── MICROSERVICES_VS_MODULAR_MONOLITH.md
├── MODULE_BOUNDARY_POLICY.md
├── SERVICE_EXTRACTION_SCORECARD.md
├── DISTRIBUTED_MONOLITH_WARNING_SIGNS.md
└── ADR-004-start-with-modular-monolith.md
```

Testes:

```text
src/test/java/br/com/formacao/m16/architecture/os
├── ServiceOrderApplicationServiceTest.java
└── ModuleBoundaryPolicyTest.java
```

Você irá:

1. diferenciar os modelos;
2. listar custos de distribuição;
3. listar benefícios reais;
4. definir módulos;
5. definir APIs internas;
6. esconder implementações;
7. definir ownership de dados;
8. criar comunicação síncrona em processo;
9. preservar contratos;
10. criar teste de fluxo;
11. criar teste de imports proibidos;
12. criar matriz de decisão;
13. avaliar o módulo notification;
14. identificar sinais de distributed monolith;
15. criar ADR;
16. definir gatilhos de extração;
17. definir plano de migração;
18. executar o gate;
19. commitar;
20. preparar o projeto de mensageria OS.

---

## Conceito essencial

### Monólito

Monólito é uma aplicação implantada como uma unidade.

Ele pode possuir:

- um processo;
- um artefato;
- uma pipeline;
- um banco;
- uma unidade de escala;
- uma unidade de rollback.

Nada nessa definição exige código desorganizado.

---

### Big ball of mud

Big ball of mud é uma estrutura sem boundaries confiáveis.

Características:

- qualquer pacote acessa qualquer pacote;
- qualquer módulo altera qualquer tabela;
- regras não possuem owner;
- dependências circulares;
- comunicação implícita;
- efeitos colaterais escondidos;
- mudanças pequenas afetam tudo.

O problema não é o deploy único.

O problema é o acoplamento.

---

### Monólito modular

Monólito modular organiza a aplicação em módulos de negócio explícitos.

Cada módulo deve possuir:

- responsabilidade;
- API pública;
- implementação interna;
- dados próprios;
- testes;
- dependências permitidas;
- owner;
- eventos internos quando necessário.

O processo é único.

Os boundaries são lógicos e arquiteturais.

---

### Microsserviço

Microsserviço é uma capacidade de negócio operada como unidade independente.

Ele tende a possuir:

- processo próprio;
- deploy próprio;
- versionamento próprio;
- dados sob seu controle;
- observabilidade própria;
- política de disponibilidade;
- owner;
- contratos remotos;
- capacidade de escalar independentemente.

Separar código sem separar operação não entrega todos esses benefícios.

---

### Monólito distribuído

Distributed monolith ocorre quando a aplicação foi dividida em serviços, mas continua fortemente acoplada.

Sinais:

- deploys precisam acontecer juntos;
- um request atravessa muitos serviços em sequência;
- banco é compartilhado;
- mudanças quebram vários serviços;
- testes só funcionam com tudo ligado;
- falha de um serviço derruba todos;
- contratos mudam sem compatibilidade;
- times não possuem autonomia;
- release exige coordenação global.

O sistema paga o custo de rede sem obter independência.

---

### Custo da rede

Uma chamada em memória pode falhar por regra de negócio.

Uma chamada remota também pode falhar por:

- DNS;
- conexão;
- timeout;
- TLS;
- balanceador;
- deploy;
- indisponibilidade;
- rate limit;
- resposta parcial;
- retry;
- duplicidade.

Cada fronteira remota precisa de políticas explícitas.

---

### Dados compartilhados

Dois microsserviços escrevendo nas mesmas tabelas continuam acoplados.

Problemas:

- schema change coordenada;
- transações cruzadas;
- ownership ambíguo;
- queries internas expostas;
- deploy dependente;
- impossibilidade de evoluir isoladamente.

A separação real exige:

```text
ownership de dados.
```

Isso não significa obrigatoriamente um servidor de banco diferente no primeiro dia.

Significa que apenas um boundary escreve naquele modelo.

---

### Comunicação síncrona

Vantagens:

- resposta imediata;
- fluxo simples;
- erro retornado ao caller;
- menor complexidade inicial.

Custos remotos:

- acoplamento temporal;
- latência;
- cascata;
- timeout;
- retry;
- disponibilidade composta.

Dentro de um monólito modular, uma interface Java pode preservar o boundary sem introduzir rede.

---

### Comunicação assíncrona

Vantagens:

- desacoplamento temporal;
- absorção de picos;
- múltiplos consumidores;
- resiliência;
- replay.

Custos:

- consistência eventual;
- duplicidade;
- ordering;
- contratos;
- operação;
- observabilidade;
- poison messages.

Mensageria não deve ser adicionada apenas para simular microsserviços dentro do mesmo processo.

---

### Deploy independente

Deploy independente só gera autonomia quando:

- contrato é compatível;
- dados são próprios;
- testes são independentes;
- time decide o release;
- observabilidade existe;
- rollback é local;
- downstream tolera versões.

Se todos precisam subir juntos, a independência é ilusória.

---

### Escalabilidade

Microsserviço pode ser útil quando uma capacidade precisa escalar de forma muito diferente.

Exemplo:

```text
notification:

grande volume de envio.

service-order:

baixo volume transacional.
```

Antes de extrair, verifique se:

- escala realmente diverge;
- profiling comprova;
- otimização local não resolve;
- filas internas não resolvem;
- custo operacional compensa.

---

### Fault isolation

Processos separados podem limitar falhas.

Mas isolamento só funciona com:

- timeout;
- circuit breaker;
- bulkhead;
- fila;
- fallback;
- limites;
- capacidade reservada.

Uma cadeia síncrona sem proteção continua acoplada à disponibilidade de todos.

---

### Autonomia de time

Microsserviços podem apoiar times autônomos.

Mas um serviço por desenvolvedor cria:

- baixa cobertura;
- ownership frágil;
- operação sobrecarregada;
- dependência individual;
- pouca revisão.

A topologia organizacional precisa sustentar o modelo.

---

### Consistência

Monólito modular pode utilizar uma transação local entre módulos quando necessário.

Isso é conveniente, mas pode esconder acoplamento.

Microsserviços exigem:

- transações locais;
- eventos;
- sagas;
- compensações;
- reconciliação.

A distribuição muda a consistência do sistema.

---

### Testes

Monólito modular:

- testes rápidos;
- setup local simples;
- refactoring amplo;
- integração em processo.

Microsserviços:

- contratos;
- ambientes;
- rede;
- dados distribuídos;
- versionamento;
- testes ponta a ponta;
- falhas parciais.

A pirâmide de testes precisa mudar.

---

### Quando não extrair

Não extraia apenas porque:

- existem muitas classes;
- existem muitos endpoints;
- o banco está grande;
- Kafka foi adotado;
- a aplicação é importante;
- microsserviços estão em alta;
- o time deseja novos repositórios;
- o deploy demora sem diagnóstico.

Esses sintomas podem possuir outras causas.

---

### Quando considerar extração

Considere quando há evidência de:

- escala independente;
- ciclo de deploy independente;
- ownership claro;
- disponibilidade diferente;
- isolamento regulatório;
- tecnologia realmente distinta;
- boundary estável;
- dados com owner;
- contratos maduros;
- operação preparada;
- custo de acoplamento maior que o custo de distribuição.

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

---

### 2. Criar o domínio de OS

Arquivo:

```text
ServiceOrderStatus.java
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.domain;

public enum ServiceOrderStatus {
    CREATED,
    SCHEDULED,
    NOTIFICATION_PENDING
}
```

Arquivo:

```text
ServiceOrder.java
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.domain;

import java.time.Instant;
import java.util.Objects;

public final class ServiceOrder {

    private final String id;
    private final String customerId;
    private final Instant createdAt;
    private ServiceOrderStatus status;

    public ServiceOrder(
        String id,
        String customerId,
        Instant createdAt
    ) {
        this.id =
            Objects.requireNonNull(id);

        this.customerId =
            Objects.requireNonNull(customerId);

        this.createdAt =
            Objects.requireNonNull(createdAt);

        this.status =
            ServiceOrderStatus.CREATED;
    }

    public void markScheduled() {
        status =
            ServiceOrderStatus.SCHEDULED;
    }

    public String id() {
        return id;
    }

    public String customerId() {
        return customerId;
    }

    public Instant createdAt() {
        return createdAt;
    }

    public ServiceOrderStatus status() {
        return status;
    }
}
```

A classe não importa scheduling, notification ou audit.

---

### 3. Criar API do módulo principal

```java
package br.com.formacao.m16.architecture.os.serviceorder.api;

public record CreateServiceOrderCommand(
    String serviceOrderId,
    String customerId,
    String preferredPeriod
) {
}
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.api;

public record CreateServiceOrderResult(
    String serviceOrderId,
    String status,
    String scheduleId
) {
}
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.api;

public interface ServiceOrderFacade {

    CreateServiceOrderResult create(
        CreateServiceOrderCommand command
    );
}
```

---

### 4. Criar API de scheduling

```java
package br.com.formacao.m16.architecture.os.scheduling.api;

public record ScheduleRequest(
    String serviceOrderId,
    String preferredPeriod
) {
}
```

```java
package br.com.formacao.m16.architecture.os.scheduling.api;

public record ScheduleResult(
    String scheduleId,
    boolean accepted
) {
}
```

```java
package br.com.formacao.m16.architecture.os.scheduling.api;

public interface SchedulingApi {

    ScheduleResult schedule(
        ScheduleRequest request
    );
}
```

O módulo principal depende apenas de `scheduling.api`.

---

### 5. Criar implementação interna

```java
package br.com.formacao.m16.architecture.os.scheduling.internal;

import br.com.formacao.m16.architecture.os.scheduling.api.ScheduleRequest;
import br.com.formacao.m16.architecture.os.scheduling.api.ScheduleResult;
import br.com.formacao.m16.architecture.os.scheduling.api.SchedulingApi;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
class InMemorySchedulingService
        implements SchedulingApi {

    @Override
    public ScheduleResult schedule(
        ScheduleRequest request
    ) {
        return new ScheduleResult(
            UUID.randomUUID().toString(),
            true
        );
    }
}
```

A classe é package-private.

Outros módulos não devem instanciá-la diretamente.

---

### 6. Criar API de notification

```java
package br.com.formacao.m16.architecture.os.notification.api;

public record ServiceOrderCreatedNotification(
    String serviceOrderId,
    String customerId
) {
}
```

```java
package br.com.formacao.m16.architecture.os.notification.api;

public interface NotificationApi {

    void register(
        ServiceOrderCreatedNotification notification
    );
}
```

Implementação:

```java
package br.com.formacao.m16.architecture.os.notification.internal;

import br.com.formacao.m16.architecture.os.notification.api.NotificationApi;
import br.com.formacao.m16.architecture.os.notification.api.ServiceOrderCreatedNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
class LoggingNotificationService
        implements NotificationApi {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            LoggingNotificationService.class
        );

    @Override
    public void register(
        ServiceOrderCreatedNotification notification
    ) {
        LOGGER.info(
            "event=service_order.notification.registered serviceOrderId={}",
            notification.serviceOrderId()
        );
    }
}
```

Neste laboratório, notification apenas registra a intenção.

A mensageria será construída nas aulas 496 e 497.

---

### 7. Criar API de audit

```java
package br.com.formacao.m16.architecture.os.audit.api;

import java.time.Instant;

public record AuditEntry(
    String aggregateId,
    String action,
    Instant occurredAt
) {
}
```

```java
package br.com.formacao.m16.architecture.os.audit.api;

public interface AuditApi {

    void record(
        AuditEntry entry
    );
}
```

Implementação interna:

```java
package br.com.formacao.m16.architecture.os.audit.internal;

import br.com.formacao.m16.architecture.os.audit.api.AuditApi;
import br.com.formacao.m16.architecture.os.audit.api.AuditEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
class LoggingAuditService
        implements AuditApi {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            LoggingAuditService.class
        );

    @Override
    public void record(
        AuditEntry entry
    ) {
        LOGGER.info(
            "event=audit.recorded aggregateId={} action={} occurredAt={}",
            entry.aggregateId(),
            entry.action(),
            entry.occurredAt()
        );
    }
}
```

---


### 8. Criar application service

```java
package br.com.formacao.m16.architecture.os.serviceorder.application;

import br.com.formacao.m16.architecture.os.audit.api.AuditApi;
import br.com.formacao.m16.architecture.os.audit.api.AuditEntry;
import br.com.formacao.m16.architecture.os.notification.api.NotificationApi;
import br.com.formacao.m16.architecture.os.notification.api.ServiceOrderCreatedNotification;
import br.com.formacao.m16.architecture.os.scheduling.api.ScheduleRequest;
import br.com.formacao.m16.architecture.os.scheduling.api.SchedulingApi;
import br.com.formacao.m16.architecture.os.serviceorder.api.CreateServiceOrderCommand;
import br.com.formacao.m16.architecture.os.serviceorder.api.CreateServiceOrderResult;
import br.com.formacao.m16.architecture.os.serviceorder.api.ServiceOrderFacade;
import br.com.formacao.m16.architecture.os.serviceorder.domain.ServiceOrder;
import java.time.Clock;
import org.springframework.stereotype.Service;

@Service
public class ServiceOrderApplicationService
        implements ServiceOrderFacade {

    private final SchedulingApi scheduling;
    private final NotificationApi notification;
    private final AuditApi audit;
    private final Clock clock;

    public ServiceOrderApplicationService(
        SchedulingApi scheduling,
        NotificationApi notification,
        AuditApi audit
    ) {
        this.scheduling = scheduling;
        this.notification = notification;
        this.audit = audit;
        this.clock = Clock.systemUTC();
    }

    @Override
    public CreateServiceOrderResult create(
        CreateServiceOrderCommand command
    ) {
        ServiceOrder order =
            new ServiceOrder(
                command.serviceOrderId(),
                command.customerId(),
                clock.instant()
            );

        var schedule =
            scheduling.schedule(
                new ScheduleRequest(
                    order.id(),
                    command.preferredPeriod()
                )
            );

        if (!schedule.accepted()) {
            throw new IllegalStateException(
                "Schedule was not accepted"
            );
        }

        order.markScheduled();

        notification.register(
            new ServiceOrderCreatedNotification(
                order.id(),
                order.customerId()
            )
        );

        audit.record(
            new AuditEntry(
                order.id(),
                "SERVICE_ORDER_CREATED",
                clock.instant()
            )
        );

        return new CreateServiceOrderResult(
            order.id(),
            order.status().name(),
            schedule.scheduleId()
        );
    }
}
```

A classe não importa pacotes `internal`.

---

### 9. Criar teste de fluxo

```java
package br.com.formacao.m16.architecture.os;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.formacao.m16.architecture.os.audit.api.AuditApi;
import br.com.formacao.m16.architecture.os.notification.api.NotificationApi;
import br.com.formacao.m16.architecture.os.scheduling.api.ScheduleResult;
import br.com.formacao.m16.architecture.os.scheduling.api.SchedulingApi;
import br.com.formacao.m16.architecture.os.serviceorder.api.CreateServiceOrderCommand;
import br.com.formacao.m16.architecture.os.serviceorder.application.ServiceOrderApplicationService;
import org.junit.jupiter.api.Test;

class ServiceOrderApplicationServiceTest {

    @Test
    void shouldCreateScheduledServiceOrder() {
        SchedulingApi scheduling =
            request ->
                new ScheduleResult(
                    "SCH-495",
                    true
                );

        NotificationApi notification =
            ignored -> {
            };

        AuditApi audit =
            ignored -> {
            };

        var service =
            new ServiceOrderApplicationService(
                scheduling,
                notification,
                audit
            );

        var result =
            service.create(
                new CreateServiceOrderCommand(
                    "OS-495",
                    "CUSTOMER-495",
                    "MORNING"
                )
            );

        assertThat(result.status())
            .isEqualTo("SCHEDULED");

        assertThat(result.scheduleId())
            .isEqualTo("SCH-495");
    }
}
```

---

### 10. Criar política de boundaries

Arquivo:

```text
docs/architecture/decomposition/MODULE_BOUNDARY_POLICY.md
```

Regras:

```markdown
# Política de boundaries

## Pacotes públicos

Somente `*.api`.

## Pacotes internos

`*.internal`, `*.application`, `*.domain`.

## Dependências permitidas

- serviceorder -> scheduling.api
- serviceorder -> notification.api
- serviceorder -> audit.api

## Dependências proibidas

- qualquer módulo -> outro `.internal`
- qualquer módulo -> entidade de persistência de outro
- ciclos entre módulos
- acesso direto à tabela de outro owner
```

---

### 11. Criar teste de imports

Sem adicionar dependência externa, crie um teste didático que percorre os fontes.

```java
package br.com.formacao.m16.architecture.os;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;

class ModuleBoundaryPolicyTest {

    private static final Path SOURCE_ROOT =
        Path.of(
            "src",
            "main",
            "java",
            "br",
            "com",
            "formacao",
            "m16",
            "architecture",
            "os"
        );

    @Test
    void modulesMustNotImportInternalPackages()
            throws IOException {
        List<Path> javaFiles;

        try (
            var paths =
                Files.walk(SOURCE_ROOT)
        ) {
            javaFiles =
                paths
                    .filter(
                        path ->
                            path
                                .toString()
                                .endsWith(".java")
                    )
                    .toList();
        }

        for (Path javaFile : javaFiles) {
            String source =
                Files.readString(javaFile);

            assertThat(source)
                .as(javaFile.toString())
                .doesNotContain(
                    ".scheduling.internal."
                )
                .doesNotContain(
                    ".notification.internal."
                )
                .doesNotContain(
                    ".audit.internal."
                );
        }
    }
}
```

Em projetos maiores, uma ferramenta arquitetural dedicada pode substituir esse teste.

---

### 12. Definir ownership de dados

Arquivo:

```text
MICROSERVICES_VS_MODULAR_MONOLITH.md
```

Tabela:

```markdown
| Módulo | Dados sob ownership | Escrita permitida |
|---|---|---|
| serviceorder | ordem de serviço | serviceorder |
| scheduling | agenda e disponibilidade | scheduling |
| notification | intenção e histórico de envio | notification |
| audit | registros de auditoria | audit |
```

Mesmo em um banco único:

```text
um módulo não escreve
nas tabelas do outro.
```

---

### 13. Comparar os modelos

Crie tabela:

```markdown
| Critério | Monólito modular | Microsserviços |
|---|---|---|
| Deploy | Único | Independente |
| Escala | Aplicação inteira | Por serviço |
| Comunicação | Em processo | Rede/broker |
| Transação | Local ampla | Local por serviço |
| Falha | Processo compartilhado | Parcial e distribuída |
| Dados | Banco pode ser único com ownership | Ownership por serviço |
| Teste local | Mais simples | Mais infraestrutura |
| Observabilidade | Centralizada | Distribuída |
| Operação | Menor custo | Maior custo |
| Autonomia | Por módulo, deploy compartilhado | Por serviço e time |
```

---

### 14. Criar scorecard

Arquivo:

```text
SERVICE_EXTRACTION_SCORECARD.md
```

Pontue de `0` a `3`:

```text
0:
não existe motivação.

1:
sinal fraco.

2:
evidência relevante.

3:
necessidade forte.
```

Critérios:

- escala independente;
- frequência de deploy;
- ownership de time;
- isolamento de falha;
- requisito regulatório;
- tecnologia diferente;
- estabilidade do boundary;
- maturidade de contratos;
- dados com ownership;
- observabilidade;
- automação de deploy;
- capacidade de operação.

Não defina extração apenas por soma.

Critérios bloqueantes precisam ser analisados.

---

### 15. Avaliar notification

Exemplo de avaliação:

```markdown
| Critério | Nota | Evidência |
|---|---:|---|
| Escala independente | 2 | Envios podem crescer |
| Deploy independente | 1 | Ainda não comprovado |
| Time próprio | 0 | Mesmo time |
| Isolamento de falha | 2 | Falha de provedor não deve bloquear OS |
| Regulação | 0 | Sem requisito |
| Boundary estável | 2 | Responsabilidade clara |
| Dados próprios | 1 | Modelo ainda em definição |
| Observabilidade | 2 | Métricas já preparadas |
| Operação | 1 | Laboratório local |
```

Decisão:

```text
não extrair agora;

usar mensageria e módulo isolado;

reavaliar com volume
e ownership reais.
```

---

### 16. Criar sinais de distributed monolith

Arquivo:

```text
DISTRIBUTED_MONOLITH_WARNING_SIGNS.md
```

Checklist:

```markdown
- [ ] Deploy coordenado.
- [ ] Banco compartilhado com escrita cruzada.
- [ ] Cadeia síncrona longa.
- [ ] Contratos não versionados.
- [ ] Testes exigem todos os serviços.
- [ ] Falha de um serviço bloqueia o fluxo inteiro.
- [ ] Release train único.
- [ ] Ownership ambíguo.
- [ ] Biblioteca compartilhada com domínio de todos.
- [ ] Eventos usados como chamadas remotas disfarçadas.
```

---

### 17. Criar ADR

Arquivo:

```text
ADR-004-start-with-modular-monolith.md
```

Estrutura:

```markdown
# ADR-004 — Estrutura inicial do fluxo de OS

## Status

Aceito para o laboratório.

## Contexto

Uma aplicação, um time e baixo volume.

## Opções

- Monólito desorganizado.
- Monólito modular.
- Microsserviços.

## Decisão

Monólito modular.

## Motivos

- boundaries podem ser praticados;
- deploy local permanece simples;
- transações locais continuam disponíveis;
- operação distribuída não é necessária;
- mensageria pode ser introduzida no boundary;
- extração futura permanece possível.

## Consequências positivas

## Consequências negativas

## Gatilhos de reavaliação
```

---

### 18. Definir gatilhos de extração

Registre:

```text
volume sustentado
incompatível com a aplicação inteira;

time independente;

deploy independente frequente;

SLO específico;

isolamento regulatório;

falha recorrente afetando outros módulos;

boundary e dados estáveis;

pipeline e observabilidade maduras.
```

A presença de um gatilho não obriga a extração.

Ela inicia uma análise.

---

### 19. Definir plano de extração

Plano futuro para notification:

```text
1. preservar NotificationApi;

2. substituir implementação
   por adapter de mensageria;

3. criar evento versionado;

4. persistir Outbox;

5. criar consumer idempotente;

6. mover dados de notification;

7. executar shadow traffic;

8. comparar resultados;

9. cortar o adapter local;

10. manter rollback.
```

As aulas 496 e 497 começarão pelos passos de mensageria.

---

### 20. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderApplicationServiceTest,ModuleBoundaryPolicyTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### O monólito deixou de ser sinônimo de desordem

A unidade de deploy permaneceu única, mas os módulos ficaram explícitos.

### APIs internas protegeram boundaries

O módulo principal depende de contratos, não de implementações.

### Package-private ganhou valor arquitetural

Classes internas não foram expostas sem necessidade.

### Ownership de dados foi definido

Banco único não virou escrita livre.

### A rede foi evitada sem perder separação

Interfaces Java mantiveram o contrato em processo.

### Microsserviços foram tratados como decisão operacional

Deploy, escala, falha e ownership entraram na análise.

### Notification ganhou caminho de evolução

O módulo poderá receber mensageria antes de ser extraído.

### A extração deixou de ser binária

Scorecard, ADR e gatilhos criaram uma decisão revisável.

---

## Erros comuns importantes

### Chamar qualquer monólito de legado

Organização e deploy são dimensões diferentes.

### Criar package por camada global

`controller`, `service` e `repository` globais escondem o domínio.

### Expor classes internas

Outros módulos passam a depender de detalhes.

### Compartilhar entidades JPA

Ownership de dados desaparece.

### Extrair antes de estabilizar o boundary

A rede congela uma divisão ruim.

### Criar microsserviço sem owner

O serviço vira responsabilidade difusa.

### Usar banco compartilhado com escrita cruzada

A independência fica falsa.

### Criar chamadas síncronas em cascata

A disponibilidade se multiplica negativamente.

### Usar Kafka para toda interação interna

A complexidade cresce sem necessidade.

### Considerar scorecard uma fórmula automática

A decisão exige contexto e trade-offs.

### Confundir módulo com bounded context

Os conceitos se relacionam, mas não são automaticamente iguais.

### Dividir por entidade CRUD

Serviços anêmicos e acoplados aparecem.

---

## Comandos úteis

### Executar testes arquiteturais

```powershell
.\mvnw.cmd `
  -Dtest=ModuleBoundaryPolicyTest `
  test
```

### Procurar imports internos

```powershell
git grep `
  -n `
  -E `
  "\.internal\."
```

### Listar módulos

```powershell
Get-ChildItem `
  "src/main/java/br/com/formacao/m16/architecture/os" `
  -Directory
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Modelos

Diferencie os três modelos.

### Parte 2 — Módulos

Crie serviceorder, scheduling, notification e audit.

### Parte 3 — APIs

Exponha somente contratos necessários.

### Parte 4 — Internals

Proteja implementações.

### Parte 5 — Dados

Defina ownership.

### Parte 6 — Testes

Valide o fluxo e os imports.

### Parte 7 — Comparação

Preencha a matriz.

### Parte 8 — Scorecard

Avalie notification.

### Parte 9 — ADR

Registre a decisão.

### Parte 10 — Migração

Defina gatilhos e plano futuro.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 494 foi preservada;
- monólito foi definido;
- big ball of mud foi definido;
- monólito modular foi definido;
- microsserviço foi definido;
- distributed monolith foi definido;
- deploy foi comparado;
- escala foi comparada;
- dados foram comparados;
- comunicação foi comparada;
- transações foram comparadas;
- falhas foram comparadas;
- testes foram comparados;
- observabilidade foi comparada;
- custo operacional foi comparado;
- autonomia de time foi analisada;
- rede foi tratada como fonte de falha;
- banco compartilhado recebeu ressalva;
- ownership de dados foi definido;
- comunicação síncrona foi analisada;
- comunicação assíncrona foi analisada;
- deploy independente foi qualificado;
- escala independente foi qualificada;
- fault isolation foi qualificado;
- consistência foi analisada;
- sinais falsos de extração foram registrados;
- sinais reais de extração foram registrados;
- cenário de OS foi utilizado;
- módulo serviceorder foi criado;
- módulo scheduling foi criado;
- módulo notification foi criado;
- módulo audit foi criado;
- APIs públicas foram criadas;
- implementações internas foram protegidas;
- domínio não importa outros módulos;
- application service depende de APIs;
- teste de fluxo foi criado;
- teste de imports foi criado;
- nenhuma dependência externa foi exigida;
- política de boundaries foi criada;
- ownership de dados foi documentado;
- tabela comparativa foi criada;
- scorecard foi criado;
- notification foi avaliada;
- decisão de não extrair agora foi justificada;
- sinais de distributed monolith foram documentados;
- ADR foi criado;
- gatilhos de reavaliação foram definidos;
- plano de extração foi definido;
- Outbox e Inbox foram relacionados ao plano;
- mensageria OS não foi antecipada;
- extração real não foi feita;
- bounded contexts não foram aprofundados;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 496 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure violações:

```powershell
git grep `
  -n `
  -E `
  "\.internal\.|ServiceOrderFacade|SchedulingApi|NotificationApi|AuditApi"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/decomposition `
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
git commit -m "refactor(m16): estruturar monolito modular"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- novo microsserviço vazio;
- repositório adicional;
- banco compartilhado sem ownership;
- código de mensageria antecipado;
- logs;
- banco H2;
- target;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a distribuição deixou de ser uma preferência tecnológica e virou uma decisão baseada em contexto.

O modelo escolhido foi:

```text
uma unidade de deploy;

módulos explícitos;

APIs internas;

implementações protegidas;

ownership de dados;

testes de boundaries;

gatilhos de extração.
```

Você comprovou que:

- monólito não significa código desorganizado;
- modularidade pode existir antes da distribuição;
- microsserviços adicionam autonomia e custo operacional;
- rede introduz falhas inexistentes em chamadas locais;
- dados compartilhados reduzem independência;
- deploy independente exige contratos e ownership;
- escala precisa ser comprovada;
- distributed monolith combina custos sem benefícios;
- scorecard ajuda, mas não substitui decisão arquitetural;
- notification ainda não precisa ser extraído;
- o boundary pode receber mensageria antes da separação física.

A próxima aula será:

```text
496 - M16.41 - Projeto mensageria OS parte 1
```

Nela, você irá:

- iniciar o projeto prático de mensageria de OS;
- definir o fluxo funcional;
- definir contratos;
- definir commands e events;
- escolher topics ou queues;
- definir keys;
- definir producers;
- definir consumers;
- relacionar o módulo notification;
- aplicar correlação;
- aplicar idempotência;
- preparar a segunda parte do projeto.

Nenhum fluxo completo de mensageria de OS foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei os três modelos.
- [ ] Criei módulos de OS.
- [ ] Protegi APIs e internals.
- [ ] Defini ownership de dados.
- [ ] Criei teste de boundary.
- [ ] Avaliei notification.
- [ ] Criei ADR e gatilhos.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Um módulo importa `.internal` de outro

Mova o contrato necessário para `api` ou redesenhe a dependência.

### Todos os módulos compartilham a mesma entidade

Crie modelos próprios e mapeamento entre boundaries.

### O teste de source não encontra arquivos

Confirme o diretório de execução do Maven e o `SOURCE_ROOT`.

### O Spring não encontra implementação package-private

A classe pode continuar package-private se estiver anotada e no component scan.

### Existem dependências circulares

Escolha a direção pelo fluxo de negócio ou introduza evento interno.

### Notification bloqueia a criação da OS

A próxima aula introduzirá mensageria para desacoplar temporalmente.

### O scorecard recomenda extração sem time próprio

Revise readiness operacional; a pontuação não é automática.

### O banco único parece contradizer modularidade

Ownership pode existir no mesmo servidor, desde que escrita e schema sejam controlados.

### A aplicação inteira precisa escalar

Isso não prova que um único módulo merece extração; faça profiling.

### Todo módulo virou candidato a microsserviço

Provavelmente os critérios estão genéricos ou sem evidência.

---

## Perguntas de revisão

1. O que é monólito?
2. O que é big ball of mud?
3. O que é monólito modular?
4. O que é microsserviço?
5. O que é distributed monolith?
6. Deploy único impede modularidade?
7. Microsserviço precisa de dados próprios?
8. Rede adiciona quais riscos?
9. O que é ownership de dados?
10. Quando usar chamada local?
11. Quando considerar mensageria?
12. Deploy independente exige o quê?
13. Escala independente deve ser comprovada?
14. Muitos endpoints exigem microsserviços?
15. O que o scorecard oferece?
16. Ele decide sozinho?
17. Qual modelo foi escolhido?
18. Notification foi extraído?
19. Mensageria OS foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Aplicação implantada como unidade.
2. Estrutura sem boundaries confiáveis.
3. Deploy único com módulos explícitos.
4. Capacidade operacional independente.
5. Serviços distribuídos e fortemente acoplados.
6. Não.
7. Precisa de ownership independente.
8. Timeout, indisponibilidade e falhas parciais.
9. Um boundary controla a escrita.
10. Quando o processo e ciclo são comuns.
11. Para desacoplamento temporal e eventos.
12. Contratos, dados, pipeline e owner.
13. Sim.
14. Não.
15. Critérios e evidências.
16. Não.
17. Monólito modular.
18. Não.
19. Não.
20. Projeto mensageria OS parte 1.

---

## Desafio opcional

Avalie o módulo scheduling como candidato a microsserviço.

Requisitos:

- scorecard completo;
- volume;
- disponibilidade;
- dependência temporal;
- ownership;
- dados;
- deploy;
- falhas;
- observabilidade;
- ADR;
- decisão;
- plano de extração;
- nenhuma implementação remota.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 495 - M16.40 - Microsservicos vs monolito modular

- Continuei após o monitoramento de integrações.
- Diferenciei monólito e big ball of mud.
- Defini monólito modular.
- Defini microsserviço como unidade operacional.
- Defini distributed monolith.
- Comparei deploy, escala, dados e comunicação.
- Comparei transações e consistência.
- Comparei falhas e observabilidade.
- Comparei testes e custo operacional.
- Analisei autonomia de time.
- Entendi o custo da rede.
- Defini ownership de dados.
- Evitei escrita cruzada em tabelas.
- Diferenciei chamada local e remota.
- Analisei comunicação assíncrona.
- Qualifiquei deploy independente.
- Qualifiquei escala independente.
- Qualifiquei fault isolation.
- Listei sinais falsos de extração.
- Listei gatilhos reais.
- Criei módulos serviceorder, scheduling, notification e audit.
- Criei APIs internas.
- Protegi implementações internas.
- Mantive o domínio independente.
- Criei application service por contratos.
- Criei teste de fluxo.
- Criei teste de imports proibidos.
- Criei política de boundaries.
- Documentei ownership de dados.
- Criei matriz comparativa.
- Criei scorecard de extração.
- Avaliei o módulo notification.
- Decidi não extrair agora.
- Criei checklist de distributed monolith.
- Criei ADR para monólito modular.
- Defini gatilhos de reavaliação.
- Defini plano de extração futuro.
- Não criei microsserviço prematuro.
- Não antecipei a mensageria OS.
- Próxima aula: Projeto mensageria OS parte 1.
```

---

## Referência técnica curta

- Modular Monolith.
- Microservices Architecture.
- Distributed Monolith.
- Information Hiding.
- Dependency Inversion Principle.
- Database per Service Pattern.
- API Gateway Pattern.
- Asynchronous Messaging.
- Transactional Outbox Pattern.
- Team Topologies.

Regra final:

```text
monólito descreve uma unidade de deploy, não ausência de arquitetura; um monólito modular preserva módulos de negócio, APIs internas, implementações protegidas, ownership de dados e dependências direcionadas dentro do mesmo processo; microsserviços adicionam deploy, escala, dados e operação independentes, mas também rede, falhas parciais, consistência eventual, contratos remotos, observabilidade e pipelines; distribuir sem autonomia, dados próprios e compatibilidade produz um monólito distribuído; a extração precisa de evidência de escala, ownership, SLO, isolamento ou ritmo de mudança, além de maturidade operacional; para o laboratório de OS, a decisão correta é iniciar com monólito modular, aplicar mensageria no boundary de notification e reavaliar a separação física apenas quando os gatilhos concretos justificarem o custo.
```
