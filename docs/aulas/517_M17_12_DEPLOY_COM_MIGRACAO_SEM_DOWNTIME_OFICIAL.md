# 517 - M17.12 - Deploy com migracao sem downtime

## Apresentação da aula

Na aula 516, você transformou rollback em uma operação completa.

O retorno deixou de considerar somente uma tag e passou a incluir:

```text
tráfego;

imagem;

configuração;

feature flags;

kill switch;

worker;

claims;

backlog;

estado;

evidências.
```

A aula anterior manteve uma regra importante:

```text
schema congelado.
```

Blue, green, stable, canary e worker utilizaram a mesma estrutura de banco.

Isso permitiu voltar para a versão conhecida sem enfrentar uma migration incompatível.

Agora o desafio aumenta.

A aplicação precisa persistir a variante escolhida para a notificação:

```text
V1;

V2.
```

Na aula de feature flags, você definiu o conceito de:

```text
variant pinning.
```

Uma intent criada com V1 deve continuar usando V1 nos retries.

Uma intent criada com V2 deve continuar usando V2.

A decisão não pode mudar no meio da operação somente porque a flag global mudou.

Para tornar essa decisão persistente, a tabela de intents precisa receber uma coluna:

```text
provider_variant.
```

Uma alteração direta e perigosa seria:

```text
1. adicionar a coluna NOT NULL;

2. exigir o novo campo;

3. remover o comportamento antigo;

4. implantar a aplicação nova.
```

Esse processo pode causar:

- lock prolongado;
- falha da versão antiga;
- falha durante coexistência;
- inserts rejeitados;
- rollback impossível;
- indisponibilidade;
- dados parcialmente migrados.

A pergunta central desta aula será:

```text
como alterar
o schema do PostgreSQL

enquanto versões antiga
e nova coexistem,

sem interromper
a API,
os workers
e o rollback?
```

A estratégia será:

```text
expand;

migrate;

contract.
```

#### Expand

Adicionar uma estrutura compatível.

A versão antiga continua funcionando.

A versão nova consegue usar a estrutura nova.

#### Migrate

Atualizar dados e comportamento gradualmente.

As duas versões continuam compatíveis durante a transição.

#### Contract

Remover compatibilidade temporária ou aplicar restrições finais.

Essa etapa acontece somente depois que:

- a versão antiga foi retirada;
- o rollback para ela não é mais necessário;
- o backfill terminou;
- as validações passaram;
- a janela de observação terminou.

Nesta aula, o deploy executará:

```text
expand;

deploy compatível;

backfill;

validação.
```

O contract será planejado, mas não será ativado no diretório de migrations desta release.

Essa separação é fundamental.

Se a migration de contract entrar no mesmo conjunto ativo:

```text
Flyway aplicará
todas as migrations pendentes
na sequência.
```

O rollback para a versão antiga poderá ser perdido antes da hora.

O schema inicial será expandido com:

```text
provider_variant varchar(16)
nullable;

default V1
para inserts antigos;

check constraint
permitindo V1 e V2.
```

A versão antiga:

- ignora a coluna;
- continua inserindo;
- recebe `V1` pelo default;
- continua lendo as colunas conhecidas.

A versão nova:

- lê `provider_variant`;
- trata `null` existente como `V1`;
- grava V1 ou V2 explicitamente;
- preserva a variante nos retries.

Os registros antigos serão atualizados em lotes.

Não será executado um único update massivo sem análise.

O backfill utilizará:

```text
batch limitado;

ordenação;

transação curta;

SKIP LOCKED;

métrica de progresso;

pausa entre lotes;

possibilidade de interromper.
```

Depois que:

```text
provider_variant IS NULL
```

chegar a zero, a equipe ainda manterá a coluna nullable durante a janela de rollback.

A restrição `NOT NULL` ficará documentada como contract futuro.

A aula utilizará Flyway.

Flyway manterá um histórico:

```text
flyway_schema_history.
```

Cada migration versionada terá:

- versão;
- descrição;
- checksum;
- ordem;
- resultado.

Uma migration aplicada não será editada.

Uma correção exige uma migration nova.

A aula também separará o processo de migration do processo da API.

A stack terá um serviço:

```text
db-migrate.
```

Ele:

1. usa a mesma imagem da aplicação;
2. inicia com profile de migration;
3. não publica porta;
4. não inicia workers;
5. aplica Flyway;
6. encerra com exit code;
7. bloqueia a criação da candidata se falhar.

Blue continua atendendo enquanto o expand é aplicado.

Depois:

```text
green inicia;

green é validada;

tráfego muda gradualmente;

backfill começa;

blue permanece disponível;

rollback continua possível.
```

A aula não executará uma migration destrutiva durante a janela.

Não haverá:

- drop de coluna;
- rename exclusivo;
- mudança incompatível de tipo;
- remoção de default;
- `NOT NULL` prematuro;
- reescrita completa de tabela sem medição;
- undo automático;
- restore de banco;
- dual write entre tabelas;
- CDC;
- pipeline CI/CD.

A próxima aula será:

```text
518 - M17.13 - CI CD profissional visao geral
```

Portanto, esta aula encerrará a preparação manual e reproduzível para que migrations, testes, imagem e deploy entrem em um pipeline profissional.

Ao final, você deverá explicar:

```text
por que expand
vem antes da aplicação;

por que a versão antiga
precisa aceitar
o schema expandido;

por que a versão nova
precisa aceitar dados antigos;

por que backfill
deve ser controlado;

por que contract
precisa esperar;

por que migration aplicada
não deve ser editada;

por que rollback
normalmente não desfaz
o expand durante o incidente;

como provar
compatibilidade
entre blue e green.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
515:
Canary deployment.

516:
Rollback seguro.

517:
Deploy com migracao sem downtime.

518:
CI CD profissional visao geral.

519:
GitHub Actions introducao.
```

A aula 516 respondeu:

```text
como restaurar
uma condição operacional
conhecida
sem migration?
```

A aula 517 responderá:

```text
como evoluir
o schema

sem destruir
a possibilidade de retorno?
```

Nesta aula:

```text
Flyway:
sim.

PostgreSQL:
sim.

migration versionada:
sim.

expand:
sim.

migrate:
sim.

contract:
planejado.

compatibilidade:
sim.

backfill em lotes:
sim.

blue-green:
reutilizado.

canary:
reutilizado.

rollback:
reutilizado.

migration job:
sim.

checksum:
sim.

schema history:
sim.

Testcontainers:
sim.

drop de coluna:
não.

undo automático:
não.

CI/CD:
não.

Kubernetes:
não.
```

A regra central será:

```text
cada etapa do schema
precisa funcionar
com a versão anterior
e com a candidata
durante a coexistência.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou revisados:

```text
pom.xml

src/main/resources
├── application-container.yaml
├── application-migration.yaml
└── db/migration
    ├── V17_12_01__expand_notification_intent_provider_variant.sql
    └── V17_12_02__create_provider_variant_backfill_control.sql

src/main/java/br/com/formacao/m17/migration
├── MigrationCompletionRunner.java
├── ProviderVariantBackfillProperties.java
├── ProviderVariantBackfillRepository.java
├── ProviderVariantBackfillService.java
├── ProviderVariantBackfillMetrics.java
└── ProviderVariantBackfillCommand.java

src/test/java/br/com/formacao/m17/migration
├── FlywayExpandMigrationTest.java
├── OldVersionCompatibilityTest.java
├── NewVersionCompatibilityTest.java
├── ProviderVariantBackfillTest.java
└── MigrationRollbackCompatibilityTest.java

compose.migration.yaml

scripts/migration
├── validate-migrations.ps1
├── run-expand-migration.ps1
├── run-provider-variant-backfill.ps1
├── verify-migration-compatibility.ps1
└── inspect-flyway-history.ps1

docs/devops/migrations
├── ZERO_DOWNTIME_MIGRATION_POLICY.md
├── EXPAND_MIGRATE_CONTRACT.md
├── PROVIDER_VARIANT_MIGRATION_PLAN.md
├── MIGRATION_COMPATIBILITY_MATRIX.md
├── MIGRATION_BACKFILL_RUNBOOK.md
├── MIGRATION_ROLLBACK_PLAN.md
├── CONTRACT_PHASE_PLAN.md
├── MIGRATION_TEST_MATRIX.md
└── MIGRATION_TROUBLESHOOTING.md
```

O contract futuro será documentado fora do diretório ativo:

```text
docs/devops/migrations/contract-pending
└── V17_12_03__provider_variant_not_null.sql
```

Ele não será executado nesta release.

Ao final, você terá:

```text
schema expandido;

blue compatível;

green compatível;

default para versão antiga;

fallback para dados antigos;

variant pinning persistido;

backfill em lotes;

histórico Flyway;

contract adiado;

rollback preservado.
```

Você irá:

1. confirmar a baseline;
2. adicionar Flyway;
3. desabilitar criação automática;
4. criar migration expand;
5. criar constraint compatível;
6. criar controle de backfill;
7. criar profile de migration;
8. criar migration runner;
9. criar service `db-migrate`;
10. aplicar expand com blue ativa;
11. inspecionar Flyway;
12. validar blue;
13. adaptar entidade;
14. adaptar criação de intent;
15. adaptar retry;
16. criar fallback;
17. iniciar green;
18. validar green;
19. promover parcialmente;
20. iniciar backfill;
21. observar lotes;
22. interromper e retomar;
23. validar zero nulls;
24. executar rollback de tráfego;
25. validar blue novamente;
26. promover green;
27. retirar blue;
28. documentar contract;
29. testar migrations;
30. criar scripts;
31. executar gate;
32. commitar;
33. preparar a aula 518.

---

## Conceito essencial

### Migration versionada

Um arquivo Flyway versionado segue uma convenção.

Exemplo:

```text
V17_12_01__expand_notification_intent_provider_variant.sql
```

Componentes:

```text
V:

versioned migration.

17_12_01:

versão ordenável.

__:

separador.

descrição:

nome legível.
```

---

### Histórico do schema

Flyway registra migrations aplicadas em:

```text
flyway_schema_history.
```

O histórico permite verificar:

- versão;
- descrição;
- checksum;
- sucesso;
- duração;
- ordem.

---

### Imutabilidade da migration

Depois de aplicada em um ambiente compartilhado:

```text
não edite o arquivo.
```

Uma mudança no conteúdo altera o checksum.

Crie uma nova migration corretiva.

Não use `repair` para esconder uma mudança indevida sem investigação.

---

### Expand

O expand adiciona capacidade sem quebrar clientes antigos.

Nesta aula:

```text
nova coluna nullable;

default V1;

constraint compatível.
```

---

### Migrate

Migrate muda dados e uso.

Nesta aula:

```text
novas intents
gravam variante;

dados antigos
recebem V1
em lotes.
```

---

### Contract

Contract remove a compatibilidade temporária.

Exemplo futuro:

```text
SET NOT NULL;

remover fallback;

remover default
quando todos os writers
forem explícitos.
```

O contract não ocorre nesta release.

---

### Forward-only migration

A baseline tratará migrations como evolução para frente.

Rollback de aplicação continua possível porque o expand é compatível.

Não é necessário remover a coluna durante o incidente.

---

### Default compatível

A versão antiga não envia `provider_variant`.

O PostgreSQL utiliza:

```text
DEFAULT 'V1'.
```

Isso preserva inserts antigos.

---

### Reader compatível

A versão nova pode encontrar registros anteriores com:

```text
provider_variant = null.
```

Ela interpreta:

```text
null
como
V1.
```

Esse fallback é temporário.

---

### Writer compatível

A versão nova grava explicitamente:

```text
V1
ou
V2.
```

A versão antiga continua gravando sem conhecer a coluna.

---

### Check constraint

A constraint permite somente:

```text
V1;

V2;

null durante a transição.
```

A validação precisa ser medida.

Para tabelas grandes, cada operação DDL deve possuir análise de lock e duração.

---

### Backfill

Backfill atualiza dados existentes.

Ele precisa possuir:

- lote;
- progresso;
- pausa;
- retry;
- idempotência;
- interrupção;
- métrica;
- critério de conclusão.

---

### `SKIP LOCKED`

`SKIP LOCKED` permite ignorar linhas já bloqueadas por outra transação.

Ele ajuda workers concorrentes controlados.

Não substitui uma estratégia de ordenação e ownership.

---

### Migration job

A migration não depende de qual API inicia primeiro.

Um job dedicado aplica o schema antes da candidata.

Ele encerra depois do sucesso ou falha.

---

### `service_completed_successfully`

Compose pode condicionar a candidata ao término bem-sucedido do migration job.

Isso não substitui validação externa do schema.

---

### Lock budget

Toda DDL tem impacto potencial.

Defina:

- timeout;
- janela;
- tamanho;
- lock esperado;
- plano de interrupção;
- observação.

Não execute DDL destrutiva sem medição.

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

Valide o rollback:

```powershell
.\scripts\rollback\verify-rollback.ps1
```

---

### 2. Adicionar Flyway

No `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

Deixe o gerenciamento de versão com o Spring Boot usado pelo projeto.

---

### 3. Definir Flyway como owner do schema

No profile de container:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto:
        "validate"

  flyway:
    enabled:
      true

    locations:
      - "classpath:db/migration"

    validate-on-migrate:
      true

    clean-disabled:
      true
```

Não use:

```text
create;

create-drop;

update.
```

em ambientes compartilhados.

---

### 4. Criar migration expand

Arquivo:

```text
V17_12_01__expand_notification_intent_provider_variant.sql
```

Conteúdo:

```sql
ALTER TABLE notification_intent
    ADD COLUMN provider_variant varchar(16);

ALTER TABLE notification_intent
    ALTER COLUMN provider_variant
    SET DEFAULT 'V1';

ALTER TABLE notification_intent
    ADD CONSTRAINT
        ck_notification_intent_provider_variant
    CHECK (
        provider_variant IS NULL
        OR provider_variant IN ('V1', 'V2')
    )
    NOT VALID;

ALTER TABLE notification_intent
    VALIDATE CONSTRAINT
        ck_notification_intent_provider_variant;
```

Não use `IF NOT EXISTS` para esconder drift em uma migration versionada.

---

### 5. Criar tabela de controle do backfill

Arquivo:

```text
V17_12_02__create_provider_variant_backfill_control.sql
```

Conteúdo:

```sql
CREATE TABLE provider_variant_backfill_control (
    id bigint PRIMARY KEY,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    processed_rows bigint NOT NULL DEFAULT 0,
    last_batch_at timestamp with time zone,
    status varchar(32) NOT NULL
);

INSERT INTO provider_variant_backfill_control (
    id,
    status
) VALUES (
    1,
    'PENDING'
);
```

A tabela permite observação operacional.

---

### 6. Criar profile de migration

Arquivo:

```text
application-migration.yaml
```

Configuração:

```yaml
spring:
  main:
    web-application-type:
      "none"

  flyway:
    enabled:
      true

app:
  runtime:
    api:
      enabled:
        false

    workers:
      enabled:
        false
```

---

### 7. Criar runner de conclusão

O Flyway executa durante a inicialização do contexto.

Depois, o runner encerra o job.

```java
package br.com.formacao.m17.migration;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("migration")
public class MigrationCompletionRunner
    implements ApplicationRunner {

    private final ConfigurableApplicationContext context;

    public MigrationCompletionRunner(
        ConfigurableApplicationContext context
    ) {
        this.context = context;
    }

    @Override
    public void run(
        ApplicationArguments arguments
    ) {
        int exitCode =
            SpringApplication.exit(
                context,
                () -> 0
            );

        System.exit(exitCode);
    }
}
```

Esse comportamento fica isolado no profile `migration`.

---

### 8. Criar serviço `db-migrate`

No:

```text
compose.migration.yaml
```

adicione:

```yaml
services:
  db-migrate:
    image:
      "formacao-java/m16-integrations:${MIGRATION_IMAGE_TAG:-5.2.0}"

    environment:
      SPRING_PROFILES_ACTIVE:
        "container,migration"

      DB_URL:
        "jdbc:postgresql://postgres:5432/integrations"

      DB_USERNAME:
        "integrations"

    secrets:
      - source: database_password
        target: spring.datasource.password

    networks:
      - backend

    depends_on:
      postgres:
        condition:
          service_healthy

    restart:
      "no"
```

O job não publica porta.

---

### 9. Condicionar a candidata

No service green ou canary:

```yaml
depends_on:
  db-migrate:
    condition:
      service_completed_successfully
```

A versão antiga continua ativa durante o job.

---

### 10. Renderizar o Compose

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  -f `
  "compose.migration.yaml" `
  config
```

Confirme:

- job;
- imagem;
- profile;
- secret;
- dependência;
- restart.

---

### 11. Aplicar o expand

Com blue ativa:

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  -f `
  "compose.migration.yaml" `
  up `
  db-migrate
```

O exit code precisa ser zero.

---

### 12. Inspecionar o histórico

```sql
SELECT
    installed_rank,
    version,
    description,
    checksum,
    installed_on,
    execution_time,
    success
FROM flyway_schema_history
ORDER BY installed_rank;
```

Registre as duas migrations.

---

### 13. Validar blue depois do expand

Execute:

- liveness;
- readiness;
- smoke;
- criação de OS;
- Outbox;
- worker;
- provider.

Confirme que a versão antiga continua funcional.

---

### 14. Adaptar a entidade

Na intent:

```java
@Enumerated(EnumType.STRING)
@Column(
    name = "provider_variant",
    length = 16
)
private NotificationProviderVariant providerVariant;
```

Durante a transição, o campo permanece nullable no Java.

---

### 15. Criar enum da variante

```java
public enum NotificationProviderVariant {
    V1,
    V2
}
```

O nome precisa corresponder à constraint.

---

### 16. Criar fallback de leitura

```java
public NotificationProviderVariant
resolvedProviderVariant() {

    return providerVariant == null
        ? NotificationProviderVariant.V1
        : providerVariant;
}
```

O fallback fica centralizado.

---

### 17. Gravar variante na criação

Quando uma nova intent é criada:

```text
avaliar feature flag;

persistir V1 ou V2;

usar a variante persistida.
```

A decisão global não é reavaliada no retry.

---

### 18. Adaptar o dispatcher

O dispatcher usa:

```text
intent.resolvedProviderVariant().
```

Ele não consulta a flag novamente para uma intent existente.

---

### 19. Testar versão nova com dados antigos

Crie registros anteriores com `provider_variant` nulo.

Confirme:

```text
leitura:
V1.

retry:
V1.

nenhuma NullPointerException.
```

---

### 20. Iniciar green

A candidata depende do migration job concluído.

Inicie:

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  -f `
  "compose.migration.yaml" `
  up `
  --detach `
  app-green
```

---

### 21. Validar green diretamente

Confirme:

- health;
- readiness;
- Flyway version;
- schema;
- leitura de dados antigos;
- criação de intent nova;
- V1;
- V2;
- workers desativados.

---

### 22. Promover parcialmente

Use canary ou blue-green conforme o laboratório ativo.

Comece em baixa exposição.

Observe:

- erros SQL;
- constraint violations;
- null handling;
- latência;
- locks;
- Outbox;
- retries.

---

### 23. Criar repositório de backfill

Query conceitual:

```sql
WITH batch AS (
    SELECT id
    FROM notification_intent
    WHERE provider_variant IS NULL
    ORDER BY id
    LIMIT :batchSize
    FOR UPDATE SKIP LOCKED
)
UPDATE notification_intent AS intent
SET provider_variant = 'V1'
FROM batch
WHERE intent.id = batch.id;
```

A query é idempotente.

---

### 24. Criar properties do backfill

```yaml
app:
  migration:
    provider-variant-backfill:
      enabled:
        false

      batch-size:
        500

      pause:
        "250ms"
```

O default é desativado.

---

### 25. Criar service do backfill

Responsabilidades:

- marcar `RUNNING`;
- processar lote;
- atualizar contador;
- registrar duração;
- pausar;
- verificar interrupção;
- terminar quando zero;
- marcar `COMPLETED`;
- falhar sem esconder erro.

---

### 26. Criar métricas

Métricas:

```text
migration.backfill.batch.rows;

migration.backfill.batch.duration;

migration.backfill.remaining;

migration.backfill.failures.
```

Tags:

```text
migration=provider_variant;

status.
```

Não use ID de linha como tag.

---

### 27. Executar backfill

Habilite em um job separado.

Não execute em todas as APIs.

Comando:

```powershell
.\scripts\migration\run-provider-variant-backfill.ps1 `
  -BatchSize `
  500 `
  -PauseMilliseconds `
  250
```

---

### 28. Interromper e retomar

Pare o job depois de alguns lotes.

Confirme:

- transações concluídas permanecem;
- linhas restantes continuam nulas;
- controle registra progresso;
- retomada continua sem duplicar.

---

### 29. Medir locks

Durante o backfill, observe:

```sql
SELECT
    pid,
    state,
    wait_event_type,
    wait_event,
    query
FROM pg_stat_activity
WHERE datname = 'integrations';
```

Não deixe query diagnóstica executando sem necessidade.

---

### 30. Validar conclusão

```sql
SELECT count(*)
FROM notification_intent
WHERE provider_variant IS NULL;
```

Resultado esperado:

```text
0.
```

Valide também:

```sql
SELECT provider_variant, count(*)
FROM notification_intent
GROUP BY provider_variant
ORDER BY provider_variant;
```

---

### 31. Executar rollback de tráfego

Com a coluna expandida e default V1:

```text
gateway volta para blue.
```

A versão antiga continua escrevendo.

O banco preenche V1.

Não remova a coluna durante o rollback.

---

### 32. Validar blue após backfill

Confirme:

- leitura;
- criação;
- Outbox;
- worker;
- provider;
- health.

A versão antiga ignora a coluna preenchida.

---

### 33. Retomar green

Promova novamente.

Confirme que:

- dados antigos possuem V1;
- dados novos possuem V1 ou V2;
- retries usam a variante persistida.

---

### 34. Planejar o contract

Arquivo fora da localização ativa:

```text
contract-pending/V17_12_03__provider_variant_not_null.sql
```

Conteúdo planejado:

```sql
ALTER TABLE notification_intent
    ALTER COLUMN provider_variant
    SET NOT NULL;
```

Não mova para `db/migration` nesta aula.

---

### 35. Critérios para contract

O contract exige:

- blue retirada;
- rollback window encerrada;
- todos os writers explícitos;
- zero nulls;
- backfill concluído;
- observação concluída;
- lock analisado;
- backup validado;
- aprovação;
- runbook.

---

### 36. Testar migration com PostgreSQL real

Use Testcontainers.

Cenários:

1. schema anterior;
2. executar Flyway;
3. verificar coluna;
4. verificar default;
5. verificar constraint;
6. inserir como versão antiga;
7. inserir como versão nova;
8. ler null legado;
9. executar backfill;
10. validar rollback da aplicação.

Não use apenas H2 para validar DDL PostgreSQL.

---

### 37. Criar teste de checksum

Execute Flyway validate no teste.

Confirme que uma migration alterada falha.

Não comite a alteração didática.

---

### 38. Criar matriz de compatibilidade

Arquivo:

```text
MIGRATION_COMPATIBILITY_MATRIX.md
```

Tabela:

```markdown
| App | Schema antigo | Schema expandido | Contract |
|---|---:|---:|---:|
| Blue antiga | Sim | Sim | Avaliar |
| Green nova | Não | Sim | Sim |
| Worker antigo | Sim | Sim | Avaliar |
| Worker novo | Não | Sim | Sim |
```

Explique cada célula.

---

### 39. Criar runbook do backfill

Arquivo:

```text
MIGRATION_BACKFILL_RUNBOOK.md
```

Inclua:

- pré-requisitos;
- batch;
- pause;
- métricas;
- locks;
- stop;
- resume;
- conclusão;
- rollback;
- owner.

---

### 40. Criar rollback plan

Arquivo:

```text
MIGRATION_ROLLBACK_PLAN.md
```

Regra:

```text
rollback de aplicação:

sim.

rollback de tráfego:

sim.

remoção da coluna
durante incidente:

não.
```

Explique roll-forward de schema.

---

### 41. Criar política

Arquivo:

```text
ZERO_DOWNTIME_MIGRATION_POLICY.md
```

Regras:

- migrations aditivas primeiro;
- migrations imutáveis;
- Flyway como owner;
- schema validate;
- backfill controlado;
- contract atrasado;
- compatibilidade testada;
- DDL observada;
- rollback ensaiado.

---

### 42. Criar troubleshooting

Arquivo:

```text
MIGRATION_TROUBLESHOOTING.md
```

Inclua:

- checksum mismatch;
- migration job falha;
- blue falha após expand;
- default ausente;
- constraint rejeita V2;
- green não inicia;
- Hibernate validate falha;
- backfill lento;
- lock;
- nulls não chegam a zero;
- worker reavalia flag;
- contract aplicado cedo;
- migration editada;
- histórico inconsistente.

---

### 43. Executar gate final

Execute:

```powershell
.\mvnw.cmd clean verify
```

Renderize:

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  -f `
  "compose.migration.yaml" `
  config
```

Execute:

```powershell
.\scripts\migration\validate-migrations.ps1

.\scripts\migration\verify-migration-compatibility.ps1
```

Valide expand, green, backfill e rollback para blue.

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### O schema ganhou uma fase aditiva

A coluna entrou sem quebrar a versão anterior.

### O default protegeu writers antigos

Blue continua inserindo V1 sem conhecer a coluna.

### O fallback protegeu readers novos

Green entende dados legados nulos.

### A variante virou estado persistente

Retries deixaram de depender da flag global.

### O backfill virou operação controlada

Lotes curtos podem parar e retomar.

### Flyway virou owner do schema

Hibernate apenas valida.

### A migration ganhou processo próprio

O job termina antes da candidata iniciar.

### O rollback permaneceu possível

O expand não foi removido durante o incidente.

### O contract foi atrasado

`NOT NULL` não entrou antes da janela correta.

### A próxima aula ganhou entradas claras

O pipeline poderá automatizar validate, migrate, build e deploy.

---

## Erros comuns importantes

### Aplicar contract na mesma release

A versão antiga pode parar de funcionar.

### Adicionar NOT NULL sem transição

Dados existentes e writers antigos falham.

### Editar migration aplicada

O checksum e a confiança são quebrados.

### Usar Hibernate update

O schema deixa de possuir histórico operacional.

### Fazer update massivo sem medir

Locks e WAL podem afetar produção.

### Reavaliar flag no retry

A mesma intent muda de variante.

### Usar H2 para validar PostgreSQL

Diferenças de DDL ficam escondidas.

### Remover coluna no rollback

O incidente fica mais arriscado.

### Executar backfill em toda API

Concorrência e controle ficam imprevisíveis.

### Não observar zero nulls

Contract é aplicado sem evidência.

### Usar `IF NOT EXISTS` para mascarar drift

Ambientes divergentes parecem válidos.

### Antecipar CI/CD

A aula 518 possui esse objetivo.

---

## Comandos úteis

### Validar Flyway pelo build

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Executar migration job

```powershell
docker compose `
  -f `
  "compose.blue-green.yaml" `
  -f `
  "compose.migration.yaml" `
  up `
  db-migrate
```

### Ver histórico

```powershell
.\scripts\migration\inspect-flyway-history.ps1
```

### Executar backfill

```powershell
.\scripts\migration\run-provider-variant-backfill.ps1 `
  -BatchSize `
  500 `
  -PauseMilliseconds `
  250
```

### Verificar compatibilidade

```powershell
.\scripts\migration\verify-migration-compatibility.ps1
```

---

## Exercício guiado

### Parte 1 — Flyway

Adicione owner do schema.

### Parte 2 — Expand

Crie coluna compatível.

### Parte 3 — Job

Execute migration separada.

### Parte 4 — Blue

Valide versão antiga.

### Parte 5 — Green

Implemente fallback e writer.

### Parte 6 — Canary

Promova parcialmente.

### Parte 7 — Backfill

Atualize em lotes.

### Parte 8 — Rollback

Retorne para blue.

### Parte 9 — Contract

Planeje e adie.

### Parte 10 — Evidência

Teste e documente.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 516 foi preservada;
- expand foi definido;
- migrate foi definido;
- contract foi definido;
- contract foi adiado;
- Flyway foi adicionado;
- módulo PostgreSQL do Flyway foi adicionado;
- Hibernate ddl-auto validate foi definido;
- Flyway virou owner do schema;
- clean foi desabilitado;
- validate-on-migrate foi habilitado;
- migration expand foi criada;
- coluna provider_variant foi criada;
- coluna permaneceu nullable;
- default V1 foi criado;
- constraint aceita V1;
- constraint aceita V2;
- constraint aceita null na transição;
- constraint foi validada;
- `IF NOT EXISTS` não mascarou drift;
- tabela de controle foi criada;
- profile de migration foi criado;
- API foi desativada no job;
- workers foram desativados no job;
- runner de conclusão foi criado;
- job encerra com exit code;
- service db-migrate foi criado;
- job depende de PostgreSQL healthy;
- job não publica porta;
- candidata depende de conclusão com sucesso;
- Compose foi renderizado;
- blue permaneceu ativa;
- expand foi aplicado;
- exit code zero foi validado;
- histórico Flyway foi inspecionado;
- versão foi registrada;
- checksum foi registrado;
- blue foi testada após expand;
- entidade foi adaptada;
- enum V1/V2 foi criado;
- fallback null para V1 foi criado;
- criação de intent grava variante;
- dispatcher usa variante persistida;
- retry não reavalia flag;
- dados legados nulos foram testados;
- green foi iniciada;
- green ficou healthy;
- green leu dados antigos;
- green escreveu V1;
- green escreveu V2;
- workers green permaneceram desativados;
- promoção parcial foi executada;
- erros SQL foram observados;
- locks foram observados;
- repositório de backfill foi criado;
- batch limitado foi usado;
- ordenação foi usada;
- `SKIP LOCKED` foi usado;
- query foi idempotente;
- properties do backfill foram criadas;
- backfill default false foi usado;
- service do backfill foi criado;
- progresso foi registrado;
- métricas foram criadas;
- IDs não viraram tags;
- backfill foi executado por job único;
- backfill foi interrompido;
- backfill foi retomado;
- lotes concluídos permaneceram;
- zero nulls foi validado;
- distribuição V1/V2 foi validada;
- rollback de tráfego foi executado;
- blue continuou inserindo V1;
- coluna não foi removida;
- green foi retomada;
- retries preservaram variante;
- contract SQL foi documentado fora da localização ativa;
- NOT NULL não foi aplicado;
- critérios do contract foram documentados;
- Testcontainers com PostgreSQL foi usado;
- schema anterior foi testado;
- migration foi testada;
- writer antigo foi testado;
- writer novo foi testado;
- backfill foi testado;
- rollback da aplicação foi testado;
- checksum mismatch foi testado;
- migration aplicada não foi editada;
- matriz de compatibilidade foi criada;
- runbook de backfill foi criado;
- rollback plan foi criado;
- política de zero downtime foi criada;
- troubleshooting foi criado;
- drop não foi executado;
- rename incompatível não foi executado;
- undo automático não foi executado;
- migration destrutiva não foi executada;
- CI/CD não foi antecipado;
- Kubernetes não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 518 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.migration.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-container.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-migration.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/db/migration `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/br/com/formacao/m17/migration `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java/br/com/formacao/m17/migration `
  scripts/migration `
  docs/devops/migrations `
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
git commit -m "build(m17): implementar migracao sem downtime"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret;
- `.env`;
- app env local;
- banco;
- volume;
- logs;
- output temporário;
- migration contract no diretório ativo;
- SQL destrutivo;
- arquivo de falha;
- pipeline da aula 518.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o banco deixou de ser uma etapa implícita do deploy.

A evolução passou a seguir:

```text
expand;

deploy compatível;

migrate;

observe;

contract futuro.
```

Você comprovou que:

- Flyway registra histórico e checksum;
- migration aplicada não deve ser editada;
- Hibernate valida e não cria schema compartilhado;
- expand precisa funcionar com blue;
- green precisa ler dados antigos;
- default V1 protege writers antigos;
- fallback V1 protege readers novos;
- variant pinning preserva retries;
- backfill em lotes reduz impacto;
- job pode parar e retomar;
- rollback volta a aplicação sem remover o expand;
- contract espera o fim da janela;
- PostgreSQL real precisa participar dos testes.

A próxima aula será:

```text
518 - M17.13 - CI CD profissional visao geral
```

Nela, você irá organizar essas validações em estágios de pipeline, desde o commit até a promoção controlada.

Nenhum pipeline CI/CD foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei Flyway.
- [ ] Criei o expand.
- [ ] Executei migration job.
- [ ] Validei blue e green.
- [ ] Persisti a variante.
- [ ] Executei backfill.
- [ ] Testei rollback.
- [ ] Adiei o contract.

---

## Troubleshooting adicional

### Flyway não encontra PostgreSQL

Revise o módulo de database, driver e URL.

### Checksum mismatch

Uma migration aplicada foi modificada ou o histórico divergiu.

### Blue falha após expand

A mudança não foi realmente aditiva ou Hibernate está exigindo outra estrutura.

### Green falha em `validate`

Entidade e schema não correspondem.

### Writer antigo grava null

O default não foi aplicado ou a coluna foi mencionada explicitamente.

### Constraint rejeita valor

Enum e SQL estão divergentes.

### Backfill não avança

Revise locks, status, batch e transação.

### Muitos locks aparecem

Reduza batch, pause ou interrompa.

### Nulls não chegam a zero

Ainda existe writer incompatível ou lote falhando.

### Retry usa V2 em intent V1

O dispatcher continua consultando a flag global.

### Contract executou cedo

Remova-o da localização ativa antes de qualquer ambiente novo e avalie compatibilidade.

### `repair` parece resolver tudo

Não use sem entender a causa do histórico divergente.

---

## Perguntas de revisão

1. O que é expand?
2. O que é migrate?
3. O que é contract?
4. Por que o contract espera?
5. O que Flyway registra?
6. Por que não editar migration aplicada?
7. Por que a coluna começa nullable?
8. Para que serve default V1?
9. Para que serve fallback V1?
10. O que é variant pinning?
11. Por que usar backfill em lotes?
12. O que faz `SKIP LOCKED`?
13. Por que usar migration job?
14. O que faz `service_completed_successfully`?
15. Por que Hibernate usa validate?
16. Rollback remove a coluna?
17. Por que testar com PostgreSQL?
18. Quando aplicar NOT NULL?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Adicionar estrutura compatível.
2. Atualizar uso e dados.
3. Remover compatibilidade temporária.
4. Preservar coexistência e rollback.
5. Histórico e checksum.
6. Preservar integridade.
7. Aceitar dados antigos.
8. Proteger writer antigo.
9. Proteger reader novo.
10. Persistir variante.
11. Reduzir impacto.
12. Ignorar linhas bloqueadas.
13. Separar schema da API.
14. Aguardar job com sucesso.
15. Evitar criação automática.
16. Não.
17. Validar DDL real.
18. Após janela e zero nulls.
19. Contract ativo e CI/CD.
20. CI CD profissional visao geral.

---

## Desafio opcional

Modele a migração de uma coluna renomeada.

Use:

```text
campo antigo;

campo novo;

dual read;

dual write;

backfill;

contract.
```

Requisitos:

- blue continua funcional;
- green lê os dois;
- green escreve os dois;
- backfill é idempotente;
- rollback permanece possível;
- coluna antiga não é removida nesta aula;
- matriz de compatibilidade;
- nenhum deploy real da mudança.

O objetivo é aplicar expand–migrate–contract a um cenário mais complexo.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 517 - M17.12 - Deploy com migracao sem downtime

- Continuei após rollback seguro.
- Estudei expand, migrate e contract.
- Adicionei Flyway e suporte a PostgreSQL.
- Defini Flyway como owner do schema.
- Mantive Hibernate em `validate`.
- Criei migration versionada de expand.
- Adicionei `provider_variant` nullable.
- Criei default V1 para writers antigos.
- Criei constraint compatível com V1, V2 e null transitório.
- Criei controle do backfill.
- Criei profile de migration.
- Criei runner de conclusão.
- Criei o service `db-migrate`.
- Condicionei a candidata ao sucesso da migration.
- Apliquei expand com blue ativa.
- Inspecionei `flyway_schema_history`.
- Validei blue após expand.
- Adaptei a entity para provider variant.
- Criei fallback de null para V1.
- Passei a persistir a variante.
- Impedi reavaliação da flag no retry.
- Iniciei e validei green.
- Executei promoção parcial.
- Criei backfill em lotes com `SKIP LOCKED`.
- Adicionei métricas e controle.
- Interrompi e retomei o backfill.
- Validei zero registros nulos.
- Executei rollback de tráfego para blue.
- Confirmei inserts antigos usando default V1.
- Retomei green.
- Planejei o contract fora da localização ativa.
- Não apliquei `NOT NULL`.
- Testei migrations com PostgreSQL real.
- Testei compatibilidade de blue, green e worker.
- Criei runbook, matriz, rollback plan e troubleshooting.
- Não antecipei CI/CD.
- Próxima aula: CI CD profissional visao geral.
```

---

## Referência técnica curta

- Flyway Versioned Migrations.
- Flyway Schema History.
- Spring Boot Database Initialization.
- PostgreSQL `ALTER TABLE`.
- Expand and Contract Pattern.
- Backfill in Batches.
- PostgreSQL `SKIP LOCKED`.
- Zero-Downtime Deployment.
- Backward Compatibility.
- Testcontainers PostgreSQL.

Regra final:

```text
deploy com migration sem downtime evolui o schema em etapas compatíveis: Flyway aplica um expand versionado enquanto blue continua ativa, adicionando `provider_variant` nullable, default V1 para writers antigos e constraint que aceita V1, V2 e null transitório; green lê null como V1, grava a variante escolhida e usa o valor persistido nos retries, preservando variant pinning; um migration job separado aplica o schema e encerra antes da candidata, enquanto Hibernate permanece em `validate`; dados antigos são atualizados por backfill idempotente em lotes com ordenação, `SKIP LOCKED`, métricas, pausa, stop e resume; zero nulls é comprovado, mas o contract `NOT NULL` fica fora da localização ativa até blue ser retirada, a janela de rollback terminar e todos os writers serem explícitos; rollback retorna tráfego e aplicação sem remover o expand, migrations aplicadas permanecem imutáveis e PostgreSQL real participa dos testes; com schema, imagem e compatibilidade controlados, a aula 518 organizará o fluxo em uma visão profissional de CI/CD.
```
