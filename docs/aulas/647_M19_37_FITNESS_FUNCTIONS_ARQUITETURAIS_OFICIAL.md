# 647 - M19.37 - Fitness functions arquiteturais

## Apresentação da aula

Na aula 646, você representou a arquitetura de `Service Scheduling` com C4 Model. Pessoas, sistemas, containers, componentes, relações, trust boundaries, fluxos dinâmicos e visão de deployment passaram a formar uma documentação arquitetural compreensível e versionada.

Agora surge uma nova pergunta.

Como impedir que a arquitetura documentada se degrade silenciosamente enquanto o código, a infraestrutura, o volume, os custos e as integrações continuam evoluindo?

Um diagrama pode estar correto hoje e desatualizado amanhã. Um ADR pode determinar isolamento entre componentes, mas uma dependência proibida pode entrar no próximo pull request. Um SLO pode exigir p95 abaixo de 300 ms, mas a latência pode crescer alguns milissegundos por semana até ultrapassar o limite. Uma estratégia de outbox pode existir, mas o lag pode aumentar sem que ninguém perceba.

Fitness functions arquiteturais transformam características importantes da arquitetura em sinais avaliáveis.

Elas respondem perguntas como:

```text
esta característica continua válida?

qual evidência demonstra isso?

qual limite define degradação?

com que frequência a verificação ocorre?

quem é responsável por reagir?

qual ação acontece quando o resultado falha?
```

Uma fitness function pode ser um teste automatizado, uma consulta de observabilidade, um orçamento de erro, um scanner, um benchmark, uma validação documental, uma revisão humana estruturada ou uma combinação desses mecanismos.

A função não precisa ser exclusivamente de código.

O importante é que ela proteja uma característica arquitetural relevante com intenção, medida, frequência, ownership e resposta explícitos.

A pergunta desta aula será:

```text
como transformar decisões arquiteturais
em verificações contínuas,
mensuráveis,
evolutivas
e acionáveis?
```

O laboratório será:

```text
labs/m19/aula-647-fitness-functions-arquiteturais/service-scheduling-fitness-functions
```

Você criará um catálogo de características, definições executáveis, thresholds, budgets, evaluators, exceções temporárias, trends, reports, evidence e um gate arquitetural.

A próxima aula será:

```text
648 - M19.38 - ArchUnit avancado
```

Regras avançadas de dependência, slices, cycles, layered architecture, onion architecture, freezing e custom conditions com ArchUnit ficam reservadas para a aula 648.

Regra central:

```text
uma arquitetura evolutiva
não depende apenas de intenção;

ela mede continuamente
as características
que não pode perder.
```

## Onde estamos na formação

A sequência oficial é:

```text
644 ADR;
645 RFC tecnico;
646 C4 Model;
647 Fitness functions arquiteturais;
648 ArchUnit avancado;
649 Evolucao controlada da arquitetura.
```

A progressão é:

```text
registrar a decisão;
revisar a proposta;
representar a estrutura;
proteger características;
validar dependências de código;
evoluir sem perder controle.
```

ADR explica o que foi decidido. RFC explica como a proposta foi discutida. C4 mostra a arquitetura resultante. Fitness functions observam se as características continuam saudáveis ao longo do tempo.

Nesta aula, o foco é o modelo completo de proteção arquitetural. Você trabalhará com funções estáticas, dinâmicas, operacionais, de segurança, dados, custo, documentação e processo. A aula 648 aprofundará especificamente a implementação de regras estruturais com ArchUnit; por isso, usaremos apenas uma abstração simples para checks de dependência nesta aula.

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-647-fitness-functions-arquiteturais/service-scheduling-fitness-functions
```

Estrutura principal:

```text
service-scheduling-fitness-functions
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/fitness
│   ├── model
│   ├── evaluator
│   ├── functions
│   ├── source
│   ├── history
│   └── application
├── src/test/java/br/com/formacao/fitness
│   ├── model
│   ├── functions
│   ├── history
│   ├── gate
│   └── architecture
├── architecture
│   ├── FITNESS_FUNCTIONS_CHARTER.md
│   ├── CHARACTERISTIC_CATALOG.md
│   ├── THRESHOLD_POLICY.md
│   ├── FREQUENCY_POLICY.md
│   ├── OWNERSHIP_POLICY.md
│   ├── WAIVER_POLICY.md
│   ├── TREND_POLICY.md
│   ├── PIPELINE_POLICY.md
│   ├── RESPONSE_POLICY.md
│   ├── TRACEABILITY.md
│   └── EVOLUTION_LOG.md
├── contracts
│   ├── fitness-functions-contract.yaml
│   ├── characteristic-policy.yaml
│   ├── threshold-policy.yaml
│   ├── frequency-policy.yaml
│   ├── ownership-policy.yaml
│   ├── waiver-policy.yaml
│   ├── trend-policy.yaml
│   ├── pipeline-policy.yaml
│   ├── evidence-policy.yaml
│   ├── gate-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── characteristic-catalog-report.yaml
    ├── static-fitness-report.yaml
    ├── runtime-fitness-report.yaml
    ├── trend-report.yaml
    ├── waiver-report.yaml
    └── fitness-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-fitness-functions
├── validate-fitness-contract.ps1
├── validate-characteristic-catalog.ps1
├── validate-thresholds.ps1
├── validate-frequencies.ps1
├── validate-ownership.ps1
├── validate-waivers.ps1
├── validate-trends.ps1
├── validate-pipeline-policy.ps1
├── run-fitness-tests.ps1
├── collect-fitness-evidence.ps1
└── verify-fitness-gate.ps1
```

Ao final, você terá um sistema capaz de avaliar continuamente se características como latência, confiabilidade, isolamento, fronteiras, lag, segurança, documentação e custo permanecem dentro das expectativas arquiteturais.

## Conceito essencial

### Fitness function arquitetural

Uma fitness function avalia uma característica da arquitetura e produz um resultado interpretável.

Exemplo:

```text
característica:
latência da confirmação.

sinal:
p95 do endpoint.

threshold:
menor ou igual a 300 ms.

frequência:
a cada deploy e continuamente em produção.

owner:
time de Service Scheduling.

resposta:
bloquear release ou abrir incidente conforme o contexto.
```

### Característica não é métrica isolada

“CPU” não é uma característica arquitetural. CPU pode ser um sinal usado para avaliar capacidade, eficiência ou risco de saturação.

A característica expressa o comportamento que a arquitetura precisa preservar:

```text
isolamento entre tenants;
latência previsível;
recuperação dentro do RTO;
fronteiras de dependência;
consistência de dados;
segurança por padrão;
custo sustentável;
documentação coerente.
```

### Threshold precisa de contexto

Um número sem origem e sem resposta não protege nada.

O threshold deve explicar:

```text
unidade;
janela;
percentil;
ambiente;
fonte;
limite de warning;
limite de failure;
owner;
ação.
```

### Fitness functions podem ser estáticas e dinâmicas

Estáticas avaliam repositório, dependências, configurações, schemas e documentação. Dinâmicas avaliam comportamento em execução, como latência, erros, lag, consumo de conexões e recovery.

### Fitness functions devem evoluir

Uma função pode começar manual, depois tornar-se automatizada. Um threshold pode ser baseado em baseline e endurecido progressivamente. Uma regra obsoleta pode ser substituída, mas a mudança precisa de justificativa e histórico.

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-647-fitness-functions-arquiteturais/service-scheduling-fitness-functions

Set-Location `
  labs/m19/aula-647-fitness-functions-arquiteturais/service-scheduling-fitness-functions
```

Crie as pastas `src`, `architecture`, `contracts` e `reports`.

### 2. Criar o Fitness Functions Charter

Arquivo:

```text
architecture/FITNESS_FUNCTIONS_CHARTER.md
```

Conteúdo essencial:

```markdown
# Fitness Functions Charter

**Contexto**

Service Scheduling.

**Objetivo**

Detectar degradação arquitetural
antes que ela se torne
falha operacional ou dívida estrutural.

**Toda função deve declarar**

- característica protegida;
- motivação;
- sinal ou evidência;
- método de avaliação;
- threshold;
- frequência;
- severidade;
- owner;
- resposta;
- política de exceção;
- rastreabilidade.

**Princípios**

- falha acionável;
- resultado reproduzível;
- threshold justificável;
- exceção temporária;
- tendência observável;
- sem métricas de vaidade.
```

O charter evita criar checks sem propósito arquitetural.

### 3. Criar o contrato principal

Arquivo:

```text
contracts/fitness-functions-contract.yaml
```

Conteúdo:

```yaml
fitnessFunctions:
  context:
    Service-Scheduling

  required:
    - characteristic-catalog
    - measurable-signal
    - threshold
    - frequency
    - owner
    - severity
    - response
    - evidence
    - trend
    - temporary-waiver
    - tests
    - gate

  forbidden:
    - metric-without-characteristic
    - threshold-without-source
    - permanent-waiver
    - silent-failure
    - ownerless-check
    - vanity-metric-only
    - ArchUnit-advanced-deep-dive

  nextLesson:
    code:
      M19.38
```

### 4. Catalogar características arquiteturais

Arquivo:

```text
architecture/CHARACTERISTIC_CATALOG.md
```

Comece com:

```text
FF-001:
Confirmation latency.

FF-002:
API error budget.

FF-003:
Outbox publication lag.

FF-004:
Consumer lag.

FF-005:
Tenant isolation.

FF-006:
Database connection budget.

FF-007:
C4 documentation freshness.

FF-008:
Domain dependency boundary.

FF-009:
Security configuration baseline.

FF-010:
Monthly operational cost budget.
```

Cada item deve explicar por que a característica importa para o negócio e para a operação.

### 5. Criar categorias

```java
package br.com.formacao.fitness.model;

public enum CharacteristicCategory {
    PERFORMANCE,
    RELIABILITY,
    RESILIENCE,
    SECURITY,
    DATA,
    MODULARITY,
    OPERABILITY,
    COST,
    DOCUMENTATION,
    PROCESS
}
```

As categorias ajudam a enxergar cobertura e desequilíbrio. Um catálogo com vinte checks de formatação e nenhum check de confiabilidade não protege a arquitetura.

### 6. Criar Architecture Characteristic

```java
package br.com.formacao.fitness.model;

import java.util.Objects;

public record ArchitectureCharacteristic(
        String id,
        String name,
        CharacteristicCategory category,
        String businessReason,
        String architecturalIntent) {

    public ArchitectureCharacteristic {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(category);
        Objects.requireNonNull(businessReason);
        Objects.requireNonNull(architecturalIntent);

        if (!id.matches("FF-[0-9]{3}")) {
            throw new IllegalArgumentException(
                    "Characteristic id must follow FF-999");
        }
    }
}
```

A característica não contém ainda a implementação da verificação. Ela representa a intenção protegida.

### 7. Definir frequência

```java
package br.com.formacao.fitness.model;

public enum FitnessFunctionFrequency {
    LOCAL,
    PULL_REQUEST,
    CONTINUOUS_INTEGRATION,
    NIGHTLY,
    PRE_RELEASE,
    POST_DEPLOY,
    CONTINUOUS_RUNTIME,
    MONTHLY_REVIEW,
    QUARTERLY_REVIEW
}
```

A mesma característica pode ter mais de uma frequência. Latência pode ser avaliada em teste de carga pré-release e monitorada continuamente em produção.

### 8. Definir severidade

```java
package br.com.formacao.fitness.model;

public enum FitnessFunctionSeverity {
    INFO,
    WARNING,
    BLOCKING,
    CRITICAL
}
```

Severidade indica a consequência de falhar, não a dificuldade de implementar o check.

### 9. Criar Threshold

```java
package br.com.formacao.fitness.model;

import java.math.BigDecimal;
import java.util.Objects;

public record Threshold(
        BigDecimal warningLimit,
        BigDecimal failureLimit,
        String unit,
        String window,
        String source) {

    public Threshold {
        Objects.requireNonNull(failureLimit);
        Objects.requireNonNull(unit);
        Objects.requireNonNull(window);
        Objects.requireNonNull(source);

        if (warningLimit != null
                && warningLimit.compareTo(failureLimit) > 0) {
            throw new IllegalArgumentException(
                    "Warning limit cannot be greater than failure limit");
        }
    }
}
```

Nem toda função usa comparação “menor é melhor”. A definição precisa registrar também a direção da comparação.

### 10. Definir o resultado

```java
package br.com.formacao.fitness.model;

public enum EvaluationStatus {
    PASS,
    WARNING,
    FAIL,
    INCONCLUSIVE,
    WAIVED
}
```

```java
package br.com.formacao.fitness.model;

import java.time.Instant;
import java.util.List;

public record EvaluationResult(
        String functionId,
        EvaluationStatus status,
        String observedValue,
        String expectedValue,
        String safeMessage,
        List<EvidenceReference> evidence,
        Instant evaluatedAt) {
}
```

`INCONCLUSIVE` é diferente de `PASS`. Ausência de dados não comprova saúde.

### 11. Definir a função

```java
package br.com.formacao.fitness.evaluator;

import br.com.formacao.fitness.model.EvaluationResult;
import br.com.formacao.fitness.model.FitnessFunctionDefinition;

public interface FitnessFunction {

    FitnessFunctionDefinition definition();

    EvaluationResult evaluate(
            FitnessFunctionContext context);
}
```

A interface separa metadados da avaliação.

### 12. Criar Fitness Function Definition

```java
package br.com.formacao.fitness.model;

import java.util.Set;

public record FitnessFunctionDefinition(
        String id,
        ArchitectureCharacteristic characteristic,
        FitnessFunctionSeverity severity,
        Set<FitnessFunctionFrequency> frequencies,
        FitnessFunctionOwner owner,
        String responsePolicy,
        String traceabilityReference) {
}
```

A definição precisa apontar para ADR, RFC, requisito, C4 ou risco que originou a função.

### 13. Criar o contexto de avaliação

```java
package br.com.formacao.fitness.evaluator;

import br.com.formacao.fitness.source.ArchitectureCatalogSource;
import br.com.formacao.fitness.source.CostSource;
import br.com.formacao.fitness.source.MetricsSource;
import br.com.formacao.fitness.source.RepositorySource;
import br.com.formacao.fitness.source.SecurityScanSource;

public record FitnessFunctionContext(
        MetricsSource metrics,
        RepositorySource repository,
        ArchitectureCatalogSource architecture,
        SecurityScanSource security,
        CostSource cost) {
}
```

A função recebe fontes por abstrações testáveis. Ela não deve consultar produção diretamente em testes unitários.

### 14. Criar a função de latência

```java
package br.com.formacao.fitness.functions;

import br.com.formacao.fitness.evaluator.FitnessFunction;
import br.com.formacao.fitness.evaluator.FitnessFunctionContext;
import br.com.formacao.fitness.model.EvaluationResult;
import br.com.formacao.fitness.model.EvaluationStatus;
import java.time.Instant;
import java.util.List;

public final class ApiLatencyFitnessFunction
        implements FitnessFunction {

    private static final double WARNING_MS = 250.0;
    private static final double FAILURE_MS = 300.0;

    @Override
    public EvaluationResult evaluate(
            FitnessFunctionContext context) {

        double observed =
                context.metrics()
                        .p95LatencyMillis(
                                "appointment-confirmation",
                                "15m");

        EvaluationStatus status =
                observed > FAILURE_MS
                        ? EvaluationStatus.FAIL
                        : observed > WARNING_MS
                        ? EvaluationStatus.WARNING
                        : EvaluationStatus.PASS;

        return new EvaluationResult(
                "FFF-001",
                status,
                observed + " ms",
                "p95 <= 300 ms",
                "Confirmation latency evaluated",
                List.of(),
                Instant.now());
    }
}
```

Em código de produção, thresholds devem vir do catálogo versionado. Constantes simplificam o laboratório.

### 15. Evitar média como única medida

A média pode esconder caudas ruins. Para endpoints críticos, use percentis e janela explícita.

```text
p50:
experiência típica.

p95:
cauda operacional relevante.

p99:
cauda extrema.
```

A escolha depende de volume, SLO e risco.

### 16. Criar função de error budget

```java
package br.com.formacao.fitness.functions;

public final class ErrorBudgetFitnessFunction
        implements FitnessFunction {

    @Override
    public EvaluationResult evaluate(
            FitnessFunctionContext context) {

        double remainingPercent =
                context.metrics()
                        .remainingErrorBudgetPercent(
                                "service-scheduling",
                                "30d");

        EvaluationStatus status =
                remainingPercent < 10.0
                        ? EvaluationStatus.FAIL
                        : remainingPercent < 25.0
                        ? EvaluationStatus.WARNING
                        : EvaluationStatus.PASS;

        return result(
                "FFF-002",
                status,
                remainingPercent + "%",
                "remaining >= 10% at release gate");
    }
}
```

Quando o orçamento está quase consumido, adicionar risco por deploy pode ser irresponsável.

### 17. Criar função de Outbox Lag

O ADR e o C4 definiram publicação assíncrona por outbox. A característica precisa continuar saudável.

```java
package br.com.formacao.fitness.functions;

public final class OutboxLagFitnessFunction
        implements FitnessFunction {

    @Override
    public EvaluationResult evaluate(
            FitnessFunctionContext context) {

        long oldestPendingSeconds =
                context.metrics()
                        .oldestPendingAgeSeconds(
                                "appointment-outbox");

        EvaluationStatus status =
                oldestPendingSeconds > 60
                        ? EvaluationStatus.FAIL
                        : oldestPendingSeconds > 20
                        ? EvaluationStatus.WARNING
                        : EvaluationStatus.PASS;

        return result(
                "FFF-003",
                status,
                oldestPendingSeconds + " s",
                "oldest pending <= 60 s");
    }
}
```

O check protege a decisão arquitetural, não apenas o worker.

### 18. Criar função de Consumer Lag

Avalie por consumer group e por stream relevante. Um total agregado pode esconder uma partição travada.

```text
warning:
lag acima de 1.000 mensagens por 5 minutos.

failure:
oldest message acima de 120 segundos.
```

Combine quantidade e idade. Mil mensagens pequenas processadas rapidamente podem ser menos graves que dez mensagens bloqueadas há vinte minutos.

### 19. Criar função de isolamento entre tenants

A aula 638 definiu que toda consulta compartilhada precisa aplicar tenant explícito e que caches e mensagens não podem cruzar contexto.

A fitness function pode combinar:

```text
testes automatizados cross-tenant;
scanner de queries sem tenant predicate;
validação de cache keys;
validação de message envelope;
incidentes de isolamento.
```

Resultado crítico:

```text
qualquer evidência de leitura cross-tenant:
FAIL_CRITICAL.
```

Não existe waiver aceitável para vazamento confirmado de dados.

### 20. Criar função de budget de conexões

```java
package br.com.formacao.fitness.functions;

public final class DatabaseConnectionBudgetFitnessFunction
        implements FitnessFunction {

    @Override
    public EvaluationResult evaluate(
            FitnessFunctionContext context) {

        int instances =
                context.metrics()
                        .desiredApplicationInstances();

        int poolPerInstance =
                context.metrics()
                        .configuredPoolSize();

        int reservedConnections =
                context.metrics()
                        .reservedDatabaseConnections();

        int databaseLimit =
                context.metrics()
                        .databaseConnectionLimit();

        int projected =
                instances * poolPerInstance
                        + reservedConnections;

        double utilization =
                projected * 100.0 / databaseLimit;

        EvaluationStatus status =
                utilization > 85.0
                        ? EvaluationStatus.FAIL
                        : utilization > 70.0
                        ? EvaluationStatus.WARNING
                        : EvaluationStatus.PASS;

        return result(
                "FFF-006",
                status,
                utilization + "%",
                "projected utilization <= 85%");
    }
}
```

A função conecta escalabilidade horizontal ao limite do banco.

### 21. Criar função de documentação fresca

O C4 Model precisa acompanhar mudanças relevantes.

Critérios possíveis:

```text
containers implantáveis existentes
aparecem no catálogo;

relações críticas do código
não contradizem o modelo;

RFCs e ADRs aceitos
possuem traceability;

views críticas
foram revisadas
nos últimos 90 dias.
```

A data sozinha não prova qualidade, mas pode disparar revisão.

### 22. Criar função de fronteira de dependência

Nesta aula, use uma abstração simples:

```java
package br.com.formacao.fitness.functions;

public final class DependencyBoundaryFitnessFunction
        implements FitnessFunction {

    @Override
    public EvaluationResult evaluate(
            FitnessFunctionContext context) {

        long violations =
                context.repository()
                        .countForbiddenDependencies(
                                "..domain..",
                                "..infrastructure..");

        EvaluationStatus status =
                violations == 0
                        ? EvaluationStatus.PASS
                        : EvaluationStatus.FAIL;

        return result(
                "FFF-008",
                status,
                Long.toString(violations),
                "0 forbidden dependencies");
    }
}
```

A implementação avançada com ArchUnit será construída na aula 648.

### 23. Criar função de baseline de segurança

Proteja características como:

```text
TLS obrigatório;
segredos fora do repositório;
scopes mínimos;
dependências críticas sem vulnerabilidade conhecida;
headers seguros;
logs sem token;
configuração de CORS explícita.
```

Não transforme a função em um único booleano gigante. Agrupe sinais que possuem a mesma resposta operacional.

### 24. Criar função de custo

Custo é característica arquitetural quando influencia sustentabilidade.

```text
sinal:
custo mensal normalizado por Appointment.

warning:
15% acima do baseline ajustado por volume.

failure:
30% acima sem decisão aprovada.
```

Comparar apenas custo absoluto gera falso alarme quando o volume cresce. Normalize por unidade útil e observe também compromissos fixos.

### 25. Definir threshold policy

Arquivo:

```text
architecture/THRESHOLD_POLICY.md
```

Registre:

```text
threshold precisa ter:

- origem;
- baseline;
- unidade;
- janela;
- direção;
- warning;
- failure;
- owner;
- revisão;
- resposta.
```

Proíba alterar o limite apenas para fazer o pipeline passar.

### 26. Usar baseline antes de endurecer

Quando não existe histórico, aplique sequência:

```text
1. medir sem bloquear;
2. entender distribuição;
3. remover ruído;
4. definir warning;
5. validar resposta;
6. definir failure;
7. bloquear apenas quando confiável.
```

Uma função que falha diariamente e é ignorada não protege arquitetura.

### 27. Criar Frequency Policy

Arquivo:

```text
architecture/FREQUENCY_POLICY.md
```

Exemplo:

```text
fronteira de dependência:
local, PR e CI.

latência:
pre-release e runtime.

error budget:
pre-release e runtime.

custo:
diário e revisão mensal.

documentação:
PR para mudanças estruturais
e revisão trimestral.

recovery:
ensaio mensal ou trimestral.
```

Frequência deve ser compatível com a velocidade de degradação.

### 28. Criar Ownership Policy

Toda função precisa de owner primário e escalonamento.

```text
owner:
time capaz de corrigir a causa.

reviewer:
grupo que valida política.

escalation:
responsável quando o risco ultrapassa o domínio local.
```

“Arquitetura” não pode ser um owner abstrato sem pessoas ou equipe responsável.

### 29. Criar Response Policy

Arquivo:

```text
architecture/RESPONSE_POLICY.md
```

Exemplo:

```text
WARNING:
abrir finding,
atribuir owner
e acompanhar trend.

BLOCKING:
bloquear merge ou release.

CRITICAL:
acionar incidente,
restringir mudança
e iniciar runbook.

INCONCLUSIVE:
falhar de forma segura
quando a evidência é obrigatória.
```

O resultado precisa produzir ação, não apenas dashboard.

### 30. Criar Temporary Waiver

```java
package br.com.formacao.fitness.model;

import java.time.Instant;
import java.util.Objects;

public record TemporaryWaiver(
        String waiverId,
        String functionId,
        String reason,
        String approvedBy,
        Instant createdAt,
        Instant expiresAt,
        String remediationOwner,
        String remediationReference) {

    public TemporaryWaiver {
        Objects.requireNonNull(waiverId);
        Objects.requireNonNull(functionId);
        Objects.requireNonNull(reason);
        Objects.requireNonNull(approvedBy);
        Objects.requireNonNull(expiresAt);
        Objects.requireNonNull(remediationOwner);
        Objects.requireNonNull(remediationReference);

        if (!expiresAt.isAfter(createdAt)) {
            throw new IllegalArgumentException(
                    "Waiver must expire in the future");
        }
    }
}
```

Waiver não altera o resultado técnico. Ele altera temporariamente a ação, preservando visibilidade.

### 31. Proibir waiver permanente

Uma exceção precisa ter:

```text
motivo;
risco aceito;
aprovador;
owner de correção;
plano;
prazo;
expiração;
revisão.
```

Ao expirar, a função volta a bloquear automaticamente.

### 32. Criar histórico de avaliações

```java
package br.com.formacao.fitness.history;

import br.com.formacao.fitness.model.EvaluationResult;
import java.util.List;

public interface EvaluationHistory {

    void append(EvaluationResult result);

    List<EvaluationResult> lastResults(
            String functionId,
            int limit);
}
```

Sem histórico, você enxerga apenas o valor atual e perde degradações lentas.

### 33. Criar Trend Analyzer

```java
package br.com.formacao.fitness.history;

public final class TrendAnalyzer {

    public FitnessTrend analyze(
            List<Double> values) {

        if (values.size() < 3) {
            return FitnessTrend.INSUFFICIENT_DATA;
        }

        double first = values.getFirst();
        double last = values.getLast();
        double change = last - first;

        if (change > 0.10 * Math.abs(first)) {
            return FitnessTrend.DEGRADING;
        }

        if (change < -0.10 * Math.abs(first)) {
            return FitnessTrend.IMPROVING;
        }

        return FitnessTrend.STABLE;
    }
}
```

Em produção, use análise estatística mais robusta. O exemplo demonstra que threshold e trend são complementares.

### 34. Detectar degradação antes da falha

Exemplo:

```text
limite de falha:
300 ms.

semana 1:
190 ms.

semana 2:
210 ms.

semana 3:
235 ms.

semana 4:
260 ms.
```

O sistema ainda passa, mas a tendência exige investigação.

### 35. Criar o Runner

```java
package br.com.formacao.fitness.evaluator;

import br.com.formacao.fitness.model.EvaluationResult;
import java.util.List;

public final class FitnessFunctionRunner {

    public List<EvaluationResult> run(
            List<FitnessFunction> functions,
            FitnessFunctionContext context) {

        return functions.stream()
                .map(function ->
                        safeEvaluate(
                                function,
                                context))
                .toList();
    }

    private EvaluationResult safeEvaluate(
            FitnessFunction function,
            FitnessFunctionContext context) {

        try {
            return function.evaluate(context);
        } catch (RuntimeException exception) {
            return inconclusive(
                    function.definition().id(),
                    "Evaluation source unavailable");
        }
    }
}
```

Erro no evaluator não deve virar `PASS`.

### 36. Criar Composite Fitness Gate

```java
package br.com.formacao.fitness.evaluator;

public final class CompositeFitnessGate {

    public GateResult evaluate(
            List<EvaluationResult> results,
            List<TemporaryWaiver> waivers,
            Instant now) {

        boolean blockingFailure =
                results.stream()
                        .filter(result ->
                                result.status()
                                        == EvaluationStatus.FAIL)
                        .anyMatch(result ->
                                !hasActiveWaiver(
                                        result.functionId(),
                                        waivers,
                                        now));

        if (blockingFailure) {
            return GateResult.FAIL;
        }

        boolean inconclusive =
                results.stream()
                        .anyMatch(result ->
                                result.status()
                                        == EvaluationStatus.INCONCLUSIVE);

        return inconclusive
                ? GateResult.INCONCLUSIVE
                : GateResult.PASS;
    }
}
```

O gate considera severidade, frequência e contexto. Nem toda função informativa bloqueia PR.

### 37. Separar gates por momento

Crie ao menos:

```text
PR Gate:
checks rápidos e determinísticos.

Release Gate:
SLO, error budget, segurança e testes de carga.

Runtime Gate:
latência, erro, lag, saturação e isolamento.

Architecture Review Gate:
C4, ADR, RFC, custo e tendências.
```

Um único gate gigantesco aumenta tempo e reduz clareza.

### 38. Integrar ao pipeline

Arquivo:

```text
architecture/PIPELINE_POLICY.md
```

Defina:

```text
local:
feedback em segundos.

PR:
bloqueia regressões determinísticas.

nightly:
executa checks mais caros.

pre-release:
avalia risco de implantação.

post-deploy:
valida sinais iniciais.

runtime:
observa continuamente.
```

Não execute teste de caos pesado em cada commit.

### 39. Criar evidências sanitizadas

Cada resultado deve referenciar evidência sem expor segredo.

Campos seguros:

```text
function id;
characteristic id;
status;
observed value;
expected value;
window;
environment class;
source type;
owner;
waiver id;
trend;
timestamp.
```

Não inclua tokens, payloads reais, nomes de clientes ou topologia sensível.

### 40. Criar traceability

Arquivo:

```text
architecture/TRACEABILITY.md
```

Exemplo:

```text
FFF-003 Outbox Lag
-> ADR de efeitos assíncronos
-> RFC de confirmação
-> C4 relation Scheduling API -> PostgreSQL
-> C4 relation Outbox Relay -> Broker
-> SLO de comunicação
-> runbook de publicação atrasada
```

A função precisa explicar qual decisão ou risco protege.

### 41. Criar política de qualidade

Arquivo:

```text
contracts/characteristic-policy.yaml
```

Conteúdo:

```yaml
characteristic:
  requires:
    - id
    - name
    - category
    - business-reason
    - architectural-intent
    - signal
    - threshold
    - frequency
    - owner
    - response
    - traceability

  forbidden:
    - duplicate-id
    - empty-owner
    - metric-only-description
    - threshold-without-unit
```

### 42. Criar política de waiver

Arquivo:

```text
contracts/waiver-policy.yaml
```

Conteúdo:

```yaml
waiver:
  requires:
    - function-id
    - reason
    - risk
    - approver
    - remediation-owner
    - remediation-reference
    - expires-at

  permanent:
    forbidden

  expired:
    action:
      BLOCK

  criticalTenantLeakage:
    waiverAllowed:
      false
```

### 43. Criar política de trend

Arquivo:

```text
contracts/trend-policy.yaml
```

Conteúdo:

```yaml
trend:
  requiredFor:
    - latency
    - error-rate
    - outbox-lag
    - consumer-lag
    - connection-utilization
    - cost-per-appointment

  degradingWhilePassing:
    action:
      OPEN_FINDING

  minimumSamples:
    3
```

### 44. Testar função de latência

Cenários:

```text
230 ms:
PASS.

270 ms:
WARNING.

340 ms:
FAIL.

fonte indisponível:
INCONCLUSIVE.
```

Valide também janela e percentil.

### 45. Testar Outbox Lag

Cenários:

```text
10 segundos:
PASS.

35 segundos:
WARNING.

90 segundos:
FAIL.
```

Confirme que backlog zero não esconde mensagem antiga presa.

### 46. Testar isolamento de tenant

Execute testes com dois tenants:

```text
Tenant A cria Appointment A;
Tenant B cria Appointment B;
Tenant A não lê B;
Tenant B não lê A;
cache keys possuem tenant;
mensagens carregam tenant validado;
repository exige tenant context.
```

Qualquer vazamento gera falha crítica sem waiver.

### 47. Testar budget de conexões

Simule:

```text
12 instâncias;
20 conexões por pool;
30 conexões reservadas;
limite do banco 300.
```

Resultado:

```text
270 conexões projetadas;
90% de utilização;
FAIL.
```

A função deve sugerir redução de pool, proxy, limite de autoscaling ou aumento planejado de capacidade.

### 48. Testar documentação

Altere o catálogo de containers sem atualizar a view correspondente.

A função deve detectar:

```text
elemento sem view;
relação sem source;
ADR aceito sem traceability;
review vencida.
```

Não valide apenas data de modificação do arquivo.

### 49. Testar waiver

Cenário:

```text
função falha;
waiver ativa e aprovada;
gate retorna PASS_WITH_WAIVER;
report mantém falha visível;
waiver expira;
gate volta a falhar.
```

A exceção não apaga a dívida.

### 50. Testar tendência

Forneça valores:

```text
180;
195;
220;
250.
```

O limite ainda pode passar, mas o trend deve ser `DEGRADING` e abrir finding.

### 51. Testar resultado inconclusivo

Desative a fonte de métricas.

Confirme:

```text
resultado não vira PASS;
mensagem não expõe stack trace;
evidence registra indisponibilidade;
gate segue policy;
owner é acionado.
```

### 52. Criar reports

Exemplo:

```yaml
fitnessFunctions:
  catalogedCharacteristics:
    10

  executedFunctions:
    10

  passed:
    6

  warnings:
    2

  failed:
    1

  inconclusive:
    1

  activeWaivers:
    1

  expiringWaivers:
    0

  degradingTrends:
    2

  gate:
    FAIL
```

### 53. Criar o gate

Status possíveis:

```text
PASS;
PASS_WITH_WARNING;
PASS_WITH_WAIVER;
FAIL_CHARACTERISTIC;
FAIL_THRESHOLD;
FAIL_OWNER;
FAIL_EVIDENCE;
FAIL_TREND;
FAIL_WAIVER;
FAIL_PIPELINE;
FAIL_SECURITY;
FAIL_TENANT_ISOLATION;
INCONCLUSIVE.
```

Falha de isolamento e segurança crítica nunca deve ser convertida em sucesso por warning genérico.

### 54. Validar o contrato

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-fitness-contract.ps1
```

Valide catálogo, thresholds, frequência, ownership, response, waivers, trends, evidence e não antecipação.

### 55. Validar o catálogo

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-characteristic-catalog.ps1
```

Confirme IDs únicos, categorias, business reason, intent, signal, owner e traceability.

### 56. Validar thresholds

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-thresholds.ps1
```

Confirme unidade, janela, origem, warning, failure, baseline e revisão.

### 57. Validar frequências

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-frequencies.ps1
```

Confirme que cada característica é avaliada antes que sua degradação se torne irreversível ou invisível.

### 58. Validar ownership

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-ownership.ps1
```

Proíba funções sem owner ou com owner genérico sem capacidade de resposta.

### 59. Validar waivers

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-waivers.ps1
```

Confirme expiração, aprovação, remediation owner e ausência de waiver para vazamento cross-tenant.

### 60. Validar trends

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-trends.ps1
```

Valide amostras, direção, findings e ausência de regressão silenciosa.

### 61. Executar testes

```powershell
.\scripts\m19\service-scheduling-fitness-functions\run-fitness-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide funções estáticas, runtime, thresholds, waivers, trends, traceability e gate.

### 62. Coletar evidence

```powershell
.\scripts\m19\service-scheduling-fitness-functions\collect-fitness-evidence.ps1
```

A evidence deve ser reproduzível e sanitizada.

### 63. Verificar o gate

```powershell
.\scripts\m19\service-scheduling-fitness-functions\verify-fitness-gate.ps1
```

O gate deve falhar quando uma característica bloqueante perde evidência, owner ou threshold válido.

### 64. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-fitness-contract.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-characteristic-catalog.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-thresholds.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-frequencies.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-ownership.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-waivers.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-trends.ps1

.\scripts\m19\service-scheduling-fitness-functions\validate-pipeline-policy.ps1

.\scripts\m19\service-scheduling-fitness-functions\run-fitness-tests.ps1

.\scripts\m19\service-scheduling-fitness-functions\collect-fitness-evidence.ps1

.\scripts\m19\service-scheduling-fitness-functions\verify-fitness-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 65. Encerrar o laboratório

Confirme:

```text
características catalogadas;

sinais mensuráveis;

thresholds justificados;

frequências compatíveis;

owners definidos;

respostas acionáveis;

waivers temporárias;

trends observáveis;

checks estáticos e runtime;

pipeline por contexto;

evidence sanitizada;

gate executável;

ArchUnit avançado não antecipado.
```

## Entendendo o que foi feito

### Decisões ganharam mecanismos de proteção

As decisões registradas em RFCs e ADRs passaram a possuir verificações relacionadas. Outbox, isolamento, fronteiras, SLOs e C4 deixaram de depender apenas de memória e revisão ocasional.

### Características ganharam catálogo e ownership

Cada característica possui motivo, sinal, threshold, frequência, severidade, owner, resposta e rastreabilidade.

### Saúde atual e tendência foram separadas

Uma função pode passar hoje e ainda apresentar degradação. Threshold responde ao limite atual; trend responde à direção.

### Exceções ganharam prazo e responsabilidade

Waivers não apagam falhas. Elas registram risco, aprovador, owner de correção e expiração automática.

### O pipeline ganhou níveis de feedback

Checks rápidos ficam em PR; avaliações caras em nightly ou pre-release; sinais runtime permanecem contínuos; revisão arquitetural consolida tendências e decisões.

## Erros comuns importantes

### Criar checks sem característica arquitetural

Contar linhas, arquivos ou cobertura sem explicar qual risco é protegido produz métricas de vaidade.

### Definir threshold arbitrário

Limites sem baseline, unidade, janela e origem são frágeis e facilmente manipuláveis.

### Transformar ausência de dados em sucesso

Fonte indisponível deve produzir `INCONCLUSIVE` ou falha segura, não `PASS`.

### Criar função sem owner

Um alerta sem equipe responsável torna-se ruído.

### Bloquear tudo desde o primeiro dia

Comece observando, reduza ruído e endureça a função quando houver confiança.

### Permitir waiver permanente

A exceção vira nova regra sem decisão explícita.

### Observar somente o valor atual

Degradação lenta passa despercebida sem trend.

### Usar um gate único para todos os contextos

PR, release, runtime e review possuem tempos e respostas diferentes.

### Automatizar o que ainda não está compreendido

Uma revisão humana estruturada pode ser a primeira versão válida da função.

### Antecipar ArchUnit avançado

A fronteira foi representada apenas por abstração. Slices, cycles, layered architecture e custom conditions pertencem à aula 648.

## Comandos úteis

### Validar catálogo

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-characteristic-catalog.ps1
```

### Validar thresholds

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-thresholds.ps1
```

### Validar waivers

```powershell
.\scripts\m19\service-scheduling-fitness-functions\validate-waivers.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-fitness-functions\run-fitness-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-fitness-functions\verify-fitness-gate.ps1
```

## Exercício guiado

Crie ao menos dez características arquiteturais para `Service Scheduling`. Para cada uma, defina motivo de negócio, intenção arquitetural, sinal, threshold, frequência, owner, severidade, resposta e traceability. Implemente funções para latência, error budget, outbox lag, consumer lag, isolamento de tenant, budget de conexões, documentação, fronteira de dependência, segurança e custo. Execute cenários de `PASS`, `WARNING`, `FAIL`, `INCONCLUSIVE` e `WAIVED`, registre histórico, detecte tendência e valide o gate.

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 646 e ponte para a aula 648 foram preservadas;
- o laboratório `service-scheduling-fitness-functions` foi criado;
- Fitness Functions Charter foi criado;
- catálogo de características foi criado;
- características possuem business reason e architectural intent;
- categorias foram definidas;
- sinais mensuráveis foram associados às características;
- thresholds possuem unidade, janela, origem e direção;
- response policy foi criada;
- resultados `PASS`, `WARNING`, `FAIL`, `INCONCLUSIVE` e `WAIVED` foram modelados;
- ausência de dados não vira sucesso;
- função de latência foi criada;
- percentis foram usados conscientemente;
- função de error budget foi criada;
- função de outbox lag foi criada;
- função de consumer lag foi definida;
- isolamento cross-tenant foi protegido;
- vazamento cross-tenant não aceita waiver;
- budget de conexões foi protegido;
- documentação C4 ganhou função de freshness e consistência;
- fronteira de dependência foi representada sem antecipar ArchUnit avançado;
- baseline de segurança foi protegido;
- custo foi normalizado por unidade útil;
- waivers possuem expiração e remediation owner;
- falha permanece visível durante waiver;
- histórico de avaliações foi criado;
- trend analyzer foi criado;
- degradação antes do threshold gera finding;
- runner trata falha de fonte como inconclusiva;
- gates de PR, release, runtime e review foram separados;
- pipeline policy foi criada;
- evidence foi sanitizada;
- traceability conecta função a RFC, ADR, C4, risco ou SLO;
- reports foram criados;
- gate foi criado;
- testes cobrem thresholds, waivers, trends e inconclusão;
- commit recomendado, diário de bordo e regra final estão presentes;
- ArchUnit avançado não foi antecipado.

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
  labs/m19/aula-647-fitness-functions-arquiteturais/service-scheduling-fitness-functions `
  scripts/m19/service-scheduling-fitness-functions `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realTenant|privateEndpoint|productionTopology|customerPayload"
```

Commit recomendado:

```powershell
git commit -m "test(m19): criar fitness functions arquiteturais"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- nomes de clientes;
- endpoints privados;
- topologia produtiva;
- payloads reais;
- regras ArchUnit avançadas.

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou fitness functions arquiteturais.

Você criou:

```text
Fitness Functions Charter;

Characteristic Catalog;

Threshold Policy;

Frequency Policy;

Ownership Policy;

Response Policy;

Waiver Policy;

Trend Policy;

Pipeline Policy;

Fitness Function Runner;

Composite Fitness Gate;

reports;

evidence;

testes.
```

Você transformou características de performance, confiabilidade, isolamento, dados, modularidade, documentação, segurança e custo em verificações explícitas. Cada função passou a declarar motivação, sinal, threshold, frequência, owner, severidade, resposta e traceability.

Você comprovou que uma função precisa ser acionável; que threshold e trend respondem perguntas diferentes; que ausência de dados não é sucesso; que waivers devem expirar; que funções podem ser estáticas, dinâmicas, manuais ou automatizadas; e que PR, release, runtime e revisão arquitetural exigem gates diferentes.

A próxima aula será:

```text
648 - M19.38 - ArchUnit avancado
```

Nela, você aprofundará a proteção estrutural do código Java com regras avançadas de dependência, camadas, slices, ciclos, arquitetura hexagonal, condições customizadas, freezing e integração ao pipeline.

ArchUnit avançado não foi aprofundado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei características arquiteturais.
- [ ] Associei sinais e evidências.
- [ ] Defini thresholds com origem e janela.
- [ ] Defini frequências e owners.
- [ ] Criei response policy.
- [ ] Modelei waivers temporárias.
- [ ] Registrei histórico e tendências.
- [ ] Separei gates por contexto.
- [ ] Executei testes e evidence.
- [ ] Verifiquei o gate final.

## Troubleshooting adicional

### A função falha todos os dias e ninguém reage

Revise ruído, threshold, owner, severidade e response policy. Uma função ignorada perdeu valor.

### O time quer aumentar o limite para liberar o deploy

Exija evidência, análise de risco, aprovação e registro. Não altere threshold apenas para obter verde.

### A métrica está indisponível

Retorne `INCONCLUSIVE`, acione o owner da fonte e aplique a política adequada ao risco.

### A média está boa, mas usuários reclamam

Observe p95, p99 e distribuições por operação, tenant e dependência.

### O gate de PR demora muito

Mova checks pesados para nightly ou pre-release e preserve feedback rápido no PR.

### Uma waiver nunca expira

Corrija a política. Toda exceção precisa de expiração e owner de remediação.

### A função passa, mas piora semanalmente

Use trend e finding preventivo antes do threshold de falha.

### O isolamento de tenant possui waiver

Remova. Vazamento confirmado é falha crítica sem exceção operacional comum.

### A equipe quer regras avançadas de classes agora

Preserve slices, cycles, layered architecture e custom conditions para a aula 648.

## Perguntas de revisão

1. O que é uma fitness function arquitetural?
2. O que diferencia característica de métrica?
3. Por que threshold precisa de unidade e janela?
4. Qual diferença entre função estática e dinâmica?
5. Qual diferença entre threshold e trend?
6. O que significa `INCONCLUSIVE`?
7. Por que ausência de dados não é `PASS`?
8. O que é error budget?
9. Como proteger uma decisão de outbox?
10. Por que observar consumer lag e idade?
11. Como proteger isolamento entre tenants?
12. Por que budget de conexões é arquitetural?
13. Como avaliar documentação C4?
14. O que é waiver?
15. Por que waiver precisa expirar?
16. Qual diferença entre PR Gate e Runtime Gate?
17. O que traceability conecta?
18. Por que owner é obrigatório?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

## Roteiro de resposta

1. Verificação que avalia uma característica arquitetural.
2. Característica expressa intenção; métrica é um sinal possível.
3. Para tornar o resultado interpretável e reproduzível.
4. Estática avalia artefatos; dinâmica avalia comportamento em execução.
5. Threshold avalia limite atual; trend avalia direção.
6. A evidência não permitiu conclusão confiável.
7. Porque falta de prova não demonstra saúde.
8. Margem de falha permitida por um SLO.
9. Medindo backlog, idade pendente, publicação e recuperação.
10. Quantidade e idade revelam riscos diferentes.
11. Com testes cross-tenant, queries, cache e mensagens.
12. Scale out pode esgotar o banco.
13. Comparando catálogos, relações, ADRs, views e revisão.
14. Exceção temporária e explícita à ação do gate.
15. Para não transformar dívida em regra permanente.
16. PR protege regressões rápidas; runtime observa comportamento real.
17. Função a risco, requisito, SLO, RFC, ADR, C4 e runbook.
18. Para garantir resposta e correção.
19. ArchUnit avançado.
20. ArchUnit avançado.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 647 - M19.37 - Fitness functions arquiteturais**

- Aprofundei fitness functions arquiteturais.
- Criei o laboratório `service-scheduling-fitness-functions`.
- Criei Fitness Functions Charter.
- Cataloguei características arquiteturais.
- Diferenciei característica de métrica.
- Modelei Fitness Function Definition.
- Defini frequências e severidades.
- Modelei thresholds com unidade, janela, warning, failure e source.
- Modelei resultados PASS, WARNING, FAIL, INCONCLUSIVE e WAIVED.
- Implementei função de latência p95.
- Implementei função de error budget.
- Implementei função de outbox lag.
- Defini função de consumer lag.
- Protegi isolamento cross-tenant.
- Criei função de budget de conexões.
- Protegi freshness e consistência do C4.
- Modelei fronteira de dependência sem antecipar ArchUnit avançado.
- Protegi baseline de segurança.
- Modelei custo normalizado por Appointment.
- Criei waivers temporárias com expiração.
- Proibi waiver para vazamento cross-tenant.
- Criei histórico de avaliações.
- Criei Trend Analyzer.
- Detectei degradação antes do threshold final.
- Criei Fitness Function Runner.
- Tratei fonte indisponível como INCONCLUSIVE.
- Criei Composite Fitness Gate.
- Separei PR, Release, Runtime e Architecture Review Gates.
- Criei testes de thresholds, waivers, trends e inconclusão.
- Não antecipei ArchUnit avançado.
- Próxima aula: ArchUnit avançado.
```

## Referência técnica curta

- Architectural Fitness Function.
- Architecture Characteristic.
- Signal.
- Threshold.
- Warning Limit.
- Failure Limit.
- Frequency.
- Severity.
- Ownership.
- Response Policy.
- Error Budget.
- Static Fitness Function.
- Dynamic Fitness Function.
- Continuous Fitness Function.
- Trend.
- Temporary Waiver.
- Evidence.
- Traceability.
- Architecture Gate.
- Evolutionary Architecture.

Regra final:

```text
Fitness functions arquiteturais transformam intenções e decisões em verificações contínuas e acionáveis. Cada função protege uma característica explícita, possui business reason, architectural intent, sinal, método, threshold, unidade, janela, frequência, severidade, owner, response policy, evidence e traceability. Métricas isoladas não substituem características, médias não escondem caudas, ausência de dados produz INCONCLUSIVE e thresholds não podem ser alterados apenas para liberar pipeline. Service Scheduling protege latência, error budget, outbox lag, consumer lag, isolamento cross-tenant, budget de conexões, documentação C4, fronteiras de dependência, baseline de segurança e custo normalizado. Threshold mostra o limite atual; trend revela degradação antes da falha. Waivers preservam a falha visível, exigem risco, aprovador, remediation owner e expiração, e nunca autorizam vazamento confirmado de tenant. PR, release, runtime e architecture review usam gates diferentes, com checks proporcionais ao custo e à velocidade de degradação. Reports, history, evidence sanitizada, findings, policies e gate tornam a evolução auditável, enquanto regras avançadas com ArchUnit permanecem reservadas à aula 648.
```
