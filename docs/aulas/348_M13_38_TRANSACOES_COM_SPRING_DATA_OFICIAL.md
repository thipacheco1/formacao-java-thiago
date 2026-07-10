# 348 - M13.38 - Transacoes com Spring Data

## Apresentacao da aula

Na aula 347, você declarou consultas explícitas com Spring Data JPA.

Foram praticados:

```text
@Query;

JPQL;

SQL nativo;

@Param;

join fetch;

record projection;

interface projection;

Page;

countQuery;

@Modifying;

flushAutomatically;

clearAutomatically.
```

As operações modificadoras foram chamadas dentro de uma transação criada com `TransactionTemplate`.

Essa solução funcionou, mas ainda deixou uma pergunta central:

```text
onde deve começar e terminar
a unidade de trabalho do caso de uso?
```

Considere o fluxo:

```text
criar uma Ordem;

registrar o primeiro histórico;

gravar um log técnico;

publicar uma ação após o commit.
```

Se cada repository executar sua própria transação isolada, o sistema pode ficar parcialmente atualizado.

Exemplo incorreto:

```text
Ordem gravada;

histórico falhou;

caso de uso terminou com dados incompletos.
```

A transação precisa envolver a operação de negócio completa.

Nesta aula, você colocará a fronteira transacional em uma camada de serviço:

```java
@Service
public class OrdemServicoService {

    @Transactional
    public Long abrirOrdem(
            AbrirOrdemCommand command
    ) {
        // Vários repositories na mesma unidade de trabalho.
    }
}
```

O Spring criará um proxy para o serviço.

Quando uma chamada externa atravessar esse proxy, o interceptor transacional:

1. identifica os atributos de `@Transactional`;
2. inicia ou participa de uma transação;
3. associa um `EntityManager` à thread;
4. executa o método;
5. realiza commit ou rollback;
6. libera os recursos.

Você aprenderá:

- `@Transactional`;
- proxy transacional;
- fronteira na camada de serviço;
- transação física e lógica;
- `Propagation.REQUIRED`;
- `Propagation.REQUIRES_NEW`;
- `Propagation.MANDATORY`;
- `Propagation.SUPPORTS`;
- rollback padrão;
- `RuntimeException`;
- checked exception;
- `rollbackFor`;
- `noRollbackFor`;
- rollback-only;
- `UnexpectedRollbackException`;
- `readOnly`;
- timeout;
- isolamento;
- `Isolation.READ_COMMITTED`;
- múltiplos repositories;
- dirty checking;
- flush;
- commit;
- auditoria;
- self-invocation;
- chamada entre beans;
- callback após commit;
- `TransactionSynchronization`;
- uso criterioso de `TransactionTemplate`.

A infraestrutura continuará:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O database será:

```text
formacao_java_jpa_348
```

O schema será:

```text
jpa_348
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

O modelo terá:

```text
OrdemServicoEntity;

OrdemStatusHistoricoEntity;

TransacaoLogEntity.
```

A Ordem e o histórico continuarão auditáveis e versionados.

O log técnico será independente da Ordem para permitir a demonstração segura de `REQUIRES_NEW`.

O laboratório comprovará:

```text
REQUIRED:
Ordem e histórico confirmados juntos.

RuntimeException:
rollback dos dois repositories.

checked exception padrão:
não provoca rollback automaticamente.

rollbackFor:
força rollback em checked exception.

noRollbackFor:
permite commit em exceção selecionada.

REQUIRED interno:
participa da mesma transação.

rollback-only:
não pode ser neutralizado apenas com catch.

REQUIRES_NEW:
confirma log independente mesmo quando a transação externa desfaz.

MANDATORY:
falha sem transação existente.

readOnly:
é intenção e otimização, não barreira de segurança.

timeout:
interrompe unidade de trabalho demorada conforme suporte.

self-invocation:
não atravessa o proxy.

afterCommit:
executa somente após confirmação.

estado final:
zero fixtures.
```

A próxima aula será:

```text
349 - M13.39 - Testes de Repository com Testcontainers
```

Por isso, esta aula não utilizará:

- Docker no teste;
- Testcontainers;
- container PostgreSQL;
- `@DataJpaTest`;
- Spring Boot Test;
- banco iniciado automaticamente;
- reusable containers;
- dynamic properties;
- CI com containers.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
346:
Queries derivadas.

347:
Query annotation native query e JPQL.

348:
Transacoes com Spring Data.

349:
Testes de Repository com Testcontainers.

350:
Mini projeto persistencia completa.
```

A aula 347 respondeu:

```text
como declarar consultas e DML no repository?
```

A aula 348 responderá:

```text
como coordenar essas operações
em uma unidade de trabalho consistente?
```

Nesta aula:

```text
@Transactional:
sim.

service boundary:
sim.

REQUIRED:
sim.

REQUIRES_NEW:
sim.

MANDATORY:
sim.

SUPPORTS:
sim.

rollback rules:
sim.

readOnly:
sim.

timeout:
sim.

isolation:
sim.

self-invocation:
sim.

afterCommit:
sim.

Testcontainers:
não.
```

A arquitetura será:

```text
chamada externa
    -> proxy do service
        -> interceptor transacional
            -> transaction manager
                -> EntityManager associado à thread
                    -> repository A
                    -> repository B
                    -> dirty checking
                -> commit ou rollback.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-348-transacoes-spring-data
```

Estrutura final:

```text
labs
└── m13
    └── aula-348-transacoes-spring-data
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── fronteira-transacional.md
        │   ├── propagacoes.md
        │   ├── rollback-rules.md
        │   ├── readonly-timeout-isolation.md
        │   ├── proxy-e-self-invocation.md
        │   └── after-commit.md
        ├── scripts
        │   ├── 01_criar_database.ps1
        │   ├── 02_executar_migration.ps1
        │   ├── 03_executar_laboratorio.ps1
        │   ├── 04_validar_estado_final.ps1
        │   └── 05_limpar_database.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula348
            │   │                       ├── Main.java
            │   │                       ├── audit
            │   │                       │   ├── AuditActor.java
            │   │                       │   ├── AuditContext.java
            │   │                       │   ├── AuditEntityListener.java
            │   │                       │   ├── AuditableEntity.java
            │   │                       │   └── AuditScope.java
            │   │                       ├── config
            │   │                       │   ├── JpaSettings.java
            │   │                       │   ├── JpaSettingsLoader.java
            │   │                       │   └── SpringDataJpaConfig.java
            │   │                       ├── command
            │   │                       │   └── AbrirOrdemCommand.java
            │   │                       ├── entity
            │   │                       │   ├── OrdemServicoEntity.java
            │   │                       │   ├── OrdemStatusHistoricoEntity.java
            │   │                       │   └── TransacaoLogEntity.java
            │   │                       ├── exception
            │   │                       │   ├── BusinessWarningException.java
            │   │                       │   └── CheckedOperationException.java
            │   │                       ├── lab
            │   │                       │   ├── TransactionLab.java
            │   │                       │   ├── TransactionObservation.java
            │   │                       │   └── TransactionReport.java
            │   │                       ├── repository
            │   │                       │   ├── OrdemServicoRepository.java
            │   │                       │   ├── OrdemStatusHistoricoRepository.java
            │   │                       │   └── TransacaoLogRepository.java
            │   │                       └── service
            │   │                           ├── AfterCommitRecorder.java
            │   │                           ├── MandatoryHistoryService.java
            │   │                           ├── OrdemServicoService.java
            │   │                           ├── RequiredParticipantService.java
            │   │                           ├── RequiresNewLogService.java
            │   │                           └── SelfInvocationService.java
            │   └── resources
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_348.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula348
                                        ├── TransactionalBoundaryIT.java
                                        ├── RequiredPropagationIT.java
                                        ├── RequiresNewPropagationIT.java
                                        ├── MandatoryPropagationIT.java
                                        ├── RollbackRulesIT.java
                                        ├── ReadOnlyIsolationTimeoutIT.java
                                        ├── SelfInvocationIT.java
                                        ├── AfterCommitIT.java
                                        ├── TransactionArchitectureTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
abertura normal:
1 Ordem;
1 histórico.

falha runtime:
0 Ordem;
0 histórico.

checked padrão:
dados confirmados.

checked com rollbackFor:
dados desfeitos.

warning com noRollbackFor:
dados confirmados.

REQUIRES_NEW:
log confirmado;
Ordem externa desfeita.

MANDATORY fora:
falha antes da escrita.

self-invocation:
atributo interno não aplicado pelo proxy.

afterCommit:
registro em memória somente após commit.

rollback:
nenhum afterCommit.

limpeza:
zero ORD-JPA-348-%, HIST-JPA-348-% e LOG-JPA-348-%.
```

---

## Conceito essencial

### Transacao como unidade de trabalho

Uma transação agrupa operações que devem ser confirmadas ou desfeitas juntas.

Para abrir uma Ordem:

```text
INSERT ordem_servico;

INSERT ordem_status_historico.
```

A regra é:

```text
ou os dois commits;

ou os dois rollbacks.
```

Não coloque a transação em cada repository separadamente quando o caso de uso atravessa vários repositories.

---

### @Transactional

A annotation pode ser aplicada a uma classe ou método.

Exemplo:

```java
@Transactional
public Long abrirOrdem(
        AbrirOrdemCommand command
) {
}
```

A configuração precisa conter:

```java
@EnableTransactionManagement
```

e um:

```text
PlatformTransactionManager.
```

Neste laboratório:

```text
JpaTransactionManager.
```

---

### Proxy transacional

O Spring cria um proxy ao redor do bean.

A chamada precisa atravessar o proxy:

```text
outro bean
    -> proxy
        -> método transacional.
```

O proxy inicia a transação antes de chamar o objeto real.

Depois decide commit ou rollback.

A annotation sozinha não modifica o bytecode do método.

---

### Fronteira no service

O repository conhece persistência.

O service conhece o caso de uso.

Por isso, a fronteira oficial será:

```java
@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemRepository;
    private final OrdemStatusHistoricoRepository historicoRepository;

    @Transactional
    public Long abrirOrdem(
            AbrirOrdemCommand command
    ) {
        // Coordenação.
    }
}
```

Evite transação em controller.

Evite espalhar transações sem conhecer a unidade de negócio.

---

### Transacao fisica e logica

`REQUIRED` pode criar várias fronteiras lógicas dentro da mesma transação física.

Exemplo:

```text
service A REQUIRED;

service B REQUIRED chamado por A.
```

B participa da transação existente.

Os dois escopos podem indicar rollback-only.

A conexão e o commit físico continuam compartilhados.

---

### Propagation.REQUIRED

É a propagação padrão.

Comportamento:

```text
sem transação:
cria uma.

com transação:
participa da existente.
```

Exemplo:

```java
@Transactional(
        propagation = Propagation.REQUIRED
)
public void registrarHistorico(
        Long ordemId
) {
}
```

O laboratório fará esse método viver em outro bean para a chamada atravessar um proxy.

---

### Rollback-only

Se um participante `REQUIRED` lança `RuntimeException`, o interceptor pode marcar a transação compartilhada como rollback-only.

Mesmo que o método externo capture a exceção:

```java
try {
    participant.fail();
} catch (RuntimeException ignored) {
    // Isso não torna a transação apta ao commit.
}
```

Ao final, o commit falha com:

```text
UnexpectedRollbackException.
```

Essa proteção evita commit parcial escondido.

---

### Propagation.REQUIRES_NEW

Comportamento:

```text
suspende a transação existente;

abre outra transação física;

confirma ou desfaz independentemente;

retoma a externa.
```

Exemplo:

```java
@Transactional(
        propagation = Propagation.REQUIRES_NEW
)
public void writeTechnicalLog(
        String code,
        String message
) {
}
```

Se a externa fizer rollback, o log já confirmado permanece.

---

### Cuidados com REQUIRES_NEW

A nova transação usa outra conexão enquanto a externa está suspensa.

Isso aumenta pressão no pool.

Também não deve depender de dados ainda não confirmados pela externa.

Por isso, o log técnico será independente e não terá foreign key para a Ordem criada na transação externa.

Não use `REQUIRES_NEW` como mecanismo genérico para “garantir commit”.

---

### Propagation.MANDATORY

Comportamento:

```text
com transação:
participa.

sem transação:
falha.
```

Use quando um método nunca deve executar isoladamente.

Exemplo:

```java
@Transactional(
        propagation = Propagation.MANDATORY
)
public void appendHistory(
        Long orderId,
        String status
) {
}
```

Chamado fora de uma unidade de trabalho, ele lançará:

```text
IllegalTransactionStateException.
```

---

### Propagation.SUPPORTS

Comportamento:

```text
com transação:
participa.

sem transação:
executa sem criar uma.
```

Pode ser útil para leitura que aceita os dois contextos.

Entretanto, o contrato fica menos rígido.

O laboratório demonstrará somente um método de consulta.

---

### Outros modos

Existem ainda:

```text
NOT_SUPPORTED;

NEVER;

NESTED.
```

Eles serão documentados brevemente.

`NESTED` depende de savepoints e do transaction manager.

Não será adotado no laboratório.

---

### Rollback padrao

Por padrão, Spring marca rollback para:

```text
RuntimeException;

Error.
```

Checked exceptions não provocam rollback automaticamente.

Essa convenção precisa ser conhecida.

---

### Checked exception

Considere:

```java
public final class CheckedOperationException
        extends Exception {
}
```

Um método transacional que persiste e depois lança essa exception pode confirmar os dados se nenhuma regra adicional for declarada.

O laboratório demonstrará esse comportamento.

Isso não significa que checked exception deva sempre confirmar.

---

### rollbackFor

Para exigir rollback:

```java
@Transactional(
        rollbackFor =
                CheckedOperationException.class
)
public void operationWithCheckedRollback()
        throws CheckedOperationException {
}
```

A regra fica explícita.

Use classes, não nomes de exception em string.

---

### noRollbackFor

Exemplo:

```java
@Transactional(
        noRollbackFor =
                BusinessWarningException.class
)
public void commitWithWarning() {
}
```

Mesmo sendo runtime, essa exception não provocará rollback.

Esse recurso precisa de justificativa forte.

O chamador ainda recebe a exception, mas os dados podem ter sido confirmados.

---

### Excecao capturada dentro do metodo

O interceptor só decide com base no que atravessa a fronteira ou no status da transação.

Se o próprio método captura uma exception e não marca rollback:

```text
o Spring pode tentar commit.
```

Para marcar explicitamente:

```java
TransactionAspectSupport
        .currentTransactionStatus()
        .setRollbackOnly();
```

Use com parcimônia.

Preferencialmente, deixe a falha sair e modele o contrato.

---

### readOnly

Exemplo:

```java
@Transactional(
        readOnly = true
)
public OrdemResumoRecord consultar(
        Long id
) {
}
```

`readOnly` comunica intenção.

O transaction manager e o provider podem aplicar otimizações, como modo de flush.

Ele não é uma constraint de segurança universal.

Não use como garantia de que nenhum SQL de escrita será possível em todo provider.

---

### Escrita dentro de readOnly

O laboratório não dependerá de uma falha automática.

Ele observará:

- transação marcada read-only;
- ausência de alteração no fluxo oficial;
- estado do `TransactionSynchronizationManager`;
- SQL gerado.

A regra arquitetural será:

```text
métodos readOnly não modificam entidades.
```

---

### Timeout

Exemplo:

```java
@Transactional(
        timeout = 1
)
public void slowOperation() {
}
```

O valor é em segundos.

O suporte e o ponto exato da falha dependem do transaction manager, driver e banco.

O teste usará uma operação PostgreSQL controlada:

```sql
select pg_sleep(2)
```

dentro da transação com timeout de um segundo.

Também terá timeout externo do teste para evitar travamento.

---

### Isolamento

A annotation permite:

```java
isolation = Isolation.READ_COMMITTED
```

O PostgreSQL normalmente utiliza `READ COMMITTED` como padrão.

O laboratório verificará o nível visível na conexão.

Não tentará reproduzir todos os fenômenos de isolamento nesta aula.

---

### Isolation.DEFAULT

`DEFAULT` delega ao padrão do banco ou DataSource.

É preferível quando o sistema não exige nível específico por operação.

Definir níveis diferentes indiscriminadamente pode aumentar contenção ou produzir comportamento inesperado.

---

### Dirty checking na transacao do service

Dentro do service:

```java
OrdemServicoEntity ordem =
        repository.findById(id)
                .orElseThrow();

ordem.alterarStatus(
        "AGENDADA"
);
```

Não é necessário chamar `save` em entidade managed.

No commit:

- callback de auditoria;
- incremento de versão;
- flush;
- update;
- commit.

---

### Flush e commit

Flush:

```text
sincroniza SQL.
```

Commit:

```text
confirma a transação.
```

Uma exception depois de `flush` e antes do commit ainda pode provocar rollback.

O laboratório confirmará essa diferença.

---

### Auditoria e transacao

O `AuditScope` precisa envolver toda a transação.

Exemplo:

```java
try (
    AuditScope ignored =
            AuditContext.open(
                    actor,
                    clock
            )
) {
    service.abrirOrdem(
            command
    );
}
```

O listener encontra o ator no flush.

Fechar o escopo antes do commit pode quebrar callbacks tardios.

---

### Self-invocation

Considere:

```java
public void outer() {
    innerRequiresNew();
}

@Transactional(
        propagation = Propagation.REQUIRES_NEW
)
public void innerRequiresNew() {
}
```

Se `outer` chama `this.innerRequiresNew()`, a chamada não atravessa o proxy.

O atributo `REQUIRES_NEW` não é aplicado.

A solução oficial:

```text
mover o método para outro bean.
```

Evite injetar o próprio proxy como primeira solução.

---

### Visibilidade do metodo

Para um contrato simples e portável no projeto, os métodos transacionais serão públicos.

Métodos privados não podem ser interceptados por uma chamada externa ao proxy.

Não coloque a annotation em private esperando uma nova transação.

---

### Chamada entre beans

O laboratório terá:

```text
OrdemServicoService;

RequiredParticipantService;

RequiresNewLogService;

MandatoryHistoryService.
```

Cada dependência é injetada pelo Spring.

As chamadas atravessam proxies reais.

---

### afterCommit

Algumas ações só devem ocorrer depois da confirmação:

- publicar notificação;
- invalidar cache;
- registrar sinal em memória;
- disparar integração por outbox.

O laboratório usará:

```java
TransactionSynchronizationManager
        .registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {
                        recorder.record(
                                orderCode
                        );
                    }
                }
        );
```

O recorder será em memória para não antecipar mensageria.

---

### Limites de afterCommit

`afterCommit` ocorre depois do commit da transação atual.

Não faça escrita JPA esperando que ela participe da transação já concluída.

Para escrita adicional:

- abra nova transação explicitamente;
- ou use outbox;
- ou publique evento para processamento adequado.

O laboratório apenas registra a chamada.

---

### TransactionTemplate

Mesmo com `@Transactional`, `TransactionTemplate` continua útil quando:

- a fronteira é dinâmica;
- código precisa de controle programático;
- um bloco local precisa de transação;
- testes precisam montar cenários;
- callback de retorno é conveniente.

A regra do projeto será:

```text
casos de uso comuns:
@Transactional.

controle localizado:
TransactionTemplate.
```

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\command"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\exception"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\java\br\com\formacao\m13\aula348\service"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-348-transacoes-spring-data\src\test\java\br\com\formacao\m13\aula348"

Set-Location `
  "labs\m13\aula-348-transacoes-spring-data"
```

---

### 2. Criar pom e configuracao

Reutilize a stack da aula 347.

Ajuste:

```text
artifactId:
aula-348-transacoes-spring-data.

database:
formacao_java_jpa_348.

schema:
jpa_348.

persistence unit:
aula348PU.
```

Mantenha Spring sem Boot.

---

### 3. Criar migration

Crie as tabelas:

```text
ordem_servico;

ordem_status_historico;

transacao_log.
```

A Ordem terá:

```text
id;

codigo;

descricao;

status;

versao;

auditoria.
```

O histórico terá:

```text
id;

ordem_servico_id;

status_anterior;

status_novo;

observacao;

versao;

auditoria.
```

O log independente terá:

```text
id;

codigo;

mensagem;

created_at.
```

Crie primary keys, unique de código, foreign key do histórico, checks e índices.

Não crie foreign key entre log e Ordem.

---

### 4. Criar entidades

`OrdemServicoEntity` e `OrdemStatusHistoricoEntity` estendem `AuditableEntity`.

Ambas usam `@Version`.

`TransacaoLogEntity` é simples e independente.

A Ordem possui método:

```java
public OrdemStatusHistoricoEntity alterarStatus(
        String novoStatus,
        String observacao
)
```

O método retorna o histórico correspondente.

---

### 5. Criar repositories

```java
public interface OrdemServicoRepository
        extends JpaRepository<
                OrdemServicoEntity,
                Long
        > {
}
```

Crie equivalentes para histórico e log.

Adicione apenas consultas simples necessárias para testes por código.

Não antecipe novas técnicas de query.

---

### 6. Habilitar transacoes

A configuração mantém:

```java
@EnableTransactionManagement
@EnableJpaRepositories(...)
```

Beans:

```text
DataSource;

EntityManagerFactory;

JpaTransactionManager;

TransactionTemplate.
```

---

### 7. Criar AbrirOrdemCommand.java

```java
public record AbrirOrdemCommand(
        String codigo,
        String descricao
) {

    public AbrirOrdemCommand {
        if (
            codigo == null
            || codigo.isBlank()
            || descricao == null
            || descricao.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Dados da Ordem inválidos"
            );
        }
    }
}
```

---

### 8. Criar OrdemServicoService.java

```java
@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemRepository;
    private final OrdemStatusHistoricoRepository historicoRepository;
    private final RequiredParticipantService requiredParticipant;
    private final RequiresNewLogService requiresNewLog;
    private final MandatoryHistoryService mandatoryHistory;
    private final AfterCommitRecorder afterCommitRecorder;

    @Transactional
    public Long abrirOrdem(
            AbrirOrdemCommand command
    ) {
        OrdemServicoEntity ordem =
                OrdemServicoEntity.nova(
                        command.codigo(),
                        command.descricao()
                );

        ordemRepository.save(
                ordem
        );

        OrdemStatusHistoricoEntity historico =
                OrdemStatusHistoricoEntity.abertura(
                        ordem
                );

        historicoRepository.save(
                historico
        );

        registerAfterCommit(
                command.codigo()
        );

        return ordem.getId();
    }
}
```

O ID pode exigir flush conforme a estratégia de sequence.

---

### 9. Testar atomicidade normal

Abra `AuditScope`.

Chame `abrirOrdem`.

Depois do retorno, confirme:

```text
uma Ordem;

um histórico;

mesmo ator;

commit concluído;

afterCommit executado.
```

---

### 10. Criar falha runtime

Método:

```java
@Transactional
public void abrirEfalharRuntime(
        AbrirOrdemCommand command
) {
    persistOrderAndHistory(
            command
    );

    throw new IllegalStateException(
            "Falha runtime planejada"
    );
}
```

Confirme zero Ordem e zero histórico.

---

### 11. Criar checked exception padrão

Método:

```java
@Transactional
public void abrirEfalharCheckedDefault(
        AbrirOrdemCommand command
) throws CheckedOperationException {
    persistOrderAndHistory(
            command
    );

    throw new CheckedOperationException(
            "Falha checked planejada"
    );
}
```

Confirme que, pela regra padrão, os dados foram confirmados.

Use fixture exclusiva para não confundir o cenário.

---

### 12. Criar checked com rollbackFor

```java
@Transactional(
        rollbackFor =
                CheckedOperationException.class
)
public void abrirEfalharCheckedRollback(
        AbrirOrdemCommand command
) throws CheckedOperationException {
}
```

Confirme zero linhas.

---

### 13. Criar noRollbackFor

```java
@Transactional(
        noRollbackFor =
                BusinessWarningException.class
)
public void abrirEemitirWarning(
        AbrirOrdemCommand command
) {
    persistOrderAndHistory(
            command
    );

    throw new BusinessWarningException(
            "Warning planejado"
    );
}
```

Confirme que o chamador recebe a exception e os dados ficam confirmados.

Documente o risco desse contrato.

---

### 14. Criar RequiredParticipantService.java

```java
@Service
public class RequiredParticipantService {

    @Transactional(
            propagation = Propagation.REQUIRED
    )
    public void failRequired() {
        throw new IllegalStateException(
                "Participante REQUIRED falhou"
        );
    }
}
```

Crie outro método que atualiza histórico com sucesso.

---

### 15. Testar REQUIRED compartilhado

O método externo:

1. cria Ordem;
2. chama participant de sucesso;
3. confirma.

Valide a mesma transação por:

```java
TransactionSynchronizationManager
        .isActualTransactionActive()
```

e pelo resultado atômico.

---

### 16. Testar rollback-only

O método externo captura a exception do participante REQUIRED.

Ao sair, espere:

```text
UnexpectedRollbackException.
```

Confirme zero dados da transação.

Não trate o catch como recuperação suficiente.

---

### 17. Criar RequiresNewLogService.java

```java
@Service
public class RequiresNewLogService {

    private final TransacaoLogRepository repository;

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void write(
            String code,
            String message
    ) {
        repository.save(
                TransacaoLogEntity.of(
                        code,
                        message
                )
        );
    }
}
```

---

### 18. Testar REQUIRES_NEW

Método externo:

1. cria Ordem;
2. chama `requiresNewLog.write`;
3. lança runtime exception.

Confirme:

```text
Ordem:
rollback.

histórico:
rollback.

log:
commit.
```

O log não referencia a Ordem ainda não confirmada.

---

### 19. Criar MandatoryHistoryService.java

```java
@Service
public class MandatoryHistoryService {

    @Transactional(
            propagation = Propagation.MANDATORY
    )
    public void append(
            OrdemServicoEntity ordem,
            String status
    ) {
        // Persiste histórico.
    }
}
```

Teste dentro de transação e fora dela.

Fora:

```text
IllegalTransactionStateException.
```

---

### 20. Criar consulta SUPPORTS

Método:

```java
@Transactional(
        propagation = Propagation.SUPPORTS,
        readOnly = true
)
public Optional<OrdemServicoEntity> consultar(
        Long id
) {
}
```

Teste com e sem transação externa.

Registre se existe transação ativa em cada cenário.

---

### 21. Criar consulta readOnly

Método:

```java
@Transactional(
        readOnly = true
)
public long contarOrdens() {
    return ordemRepository.count();
}
```

Confirme flag:

```java
TransactionSynchronizationManager
        .isCurrentTransactionReadOnly()
```

Não modifique entidade nesse método.

---

### 22. Criar teste de isolamento

Método:

```java
@Transactional(
        isolation = Isolation.READ_COMMITTED,
        readOnly = true
)
public String currentIsolation() {
    // Consulta SHOW transaction_isolation.
}
```

Use `JdbcTemplate` ou `EntityManager` com native query somente para inspecionar.

Espere:

```text
read committed.
```

---

### 23. Criar teste de timeout

Método:

```java
@Transactional(
        timeout = 1
)
public void exceedTimeout() {
    entityManager.createNativeQuery(
            "select pg_sleep(2)"
    ).getSingleResult();
}
```

Aceite exception traduzida ou causa de timeout.

O teste terá limite externo maior que dois segundos.

Execute rollback e feche o contexto.

---

### 24. Criar SelfInvocationService.java

```java
@Service
public class SelfInvocationService {

    public void outer() {
        innerRequiresNew();
    }

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void innerRequiresNew() {
        // Registra estado da transação.
    }
}
```

Chame `outer` externamente.

Confirme que a chamada interna não aplicou `REQUIRES_NEW`.

Depois mova a operação efetiva para outro bean e confirme a propagação correta.

---

### 25. Criar AfterCommitRecorder.java

```java
@Component
public class AfterCommitRecorder {

    private final List<String> committed =
            new CopyOnWriteArrayList<>();

    public void record(
            String code
    ) {
        committed.add(
                code
        );
    }

    public List<String> snapshot() {
        return List.copyOf(
                committed
        );
    }

    public void clear() {
        committed.clear();
    }
}
```

---

### 26. Registrar afterCommit

No service:

```java
private void registerAfterCommit(
        String code
) {
    TransactionSynchronizationManager
            .registerSynchronization(
                    new TransactionSynchronization() {

                        @Override
                        public void afterCommit() {
                            afterCommitRecorder.record(
                                    code
                            );
                        }
                    }
            );
}
```

Confirme execução após commit.

Em rollback, o código não aparece no recorder.

---

### 27. Criar TransactionObservation.java

```java
public record TransactionObservation(
        String scenario,
        boolean transactionActive,
        boolean readOnly,
        int orderCount,
        int historyCount,
        int logCount,
        boolean committed,
        boolean rolledBack,
        boolean afterCommitExecuted,
        String exceptionType
) {
}
```

---

### 28. Criar TransactionReport.java

```java
public record TransactionReport(
        List<TransactionObservation> observations,
        boolean requiredWasAtomic,
        boolean runtimeRolledBack,
        boolean checkedDefaultCommitted,
        boolean rollbackForWorked,
        boolean noRollbackForWorked,
        boolean rollbackOnlyWasDetected,
        boolean requiresNewWasIndependent,
        boolean mandatoryWasEnforced,
        boolean readOnlyWasExposed,
        boolean timeoutWasDetected,
        boolean selfInvocationWasDemonstrated,
        boolean afterCommitWorked
) {

    public TransactionReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 29. Criar Main.java

O `Main`:

1. inicia contexto;
2. obtém `TransactionLab`;
3. abre escopos de auditoria;
4. executa cenários;
5. imprime relatório;
6. limpa fixtures;
7. fecha contexto.

Formato:

```text
cenário | ativa | readOnly | ordens | históricos | logs | commit | rollback | afterCommit | exception
```

---

### 30. Criar TransactionalBoundaryIT.java

Casos:

- service é proxy;
- método público transacional;
- dois repositories;
- commit atômico;
- dirty checking;
- auditoria;
- versão;
- flush não confundido com commit.

---

### 31. Criar RequiredPropagationIT.java

Casos:

- REQUIRED sem transação cria;
- REQUIRED interno participa;
- sucesso confirma;
- runtime desfaz;
- participante marca rollback-only;
- catch externo não limpa status;
- `UnexpectedRollbackException`.

---

### 32. Criar RequiresNewPropagationIT.java

Casos:

- externa ativa;
- interna possui transação independente;
- log confirma;
- externa desfaz;
- conexão adicional disponível;
- log não depende de dado não confirmado;
- auditoria externa não vaza indevidamente.

---

### 33. Criar MandatoryPropagationIT.java

Casos:

- chamada dentro da transação;
- chamada fora;
- exception correta por tipo;
- zero escrita fora;
- sucesso dentro.

---

### 34. Criar RollbackRulesIT.java

Casos:

- runtime rollback;
- checked default commit;
- checked rollbackFor;
- runtime noRollbackFor;
- exception entregue ao chamador;
- dados finais coerentes;
- afterCommit somente nos commits.

---

### 35. Criar ReadOnlyIsolationTimeoutIT.java

Casos:

- flag readOnly;
- consulta sem escrita;
- isolamento READ_COMMITTED;
- timeout de banco;
- timeout externo do teste;
- rollback seguro;
- conexão devolvida ao pool.

---

### 36. Criar SelfInvocationIT.java

Casos:

- bean é proxy;
- chamada externa a método transacional funciona;
- chamada `this` não cria nova fronteira;
- método em bean separado funciona;
- método private não é tratado como endpoint transacional.

---

### 37. Criar AfterCommitIT.java

Casos:

- commit chama recorder;
- rollback não chama;
- recorder executa uma vez;
- callback não tenta reutilizar a transação concluída;
- estado limpo entre testes.

---

### 38. Criar TransactionArchitectureTest.java

Valide:

- `@Transactional` está na camada de serviço;
- repositories não definem a fronteira do caso de uso;
- métodos são públicos;
- `REQUIRES_NEW` está em bean separado;
- `MANDATORY` está em bean separado;
- afterCommit está registrado;
- Testcontainers não foi importado;
- Spring Boot não foi usado;
- ponte aponta para aula 349.

---

### 39. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_348.ordem_status_historico
WHERE codigo LIKE 'HIST-JPA-348-%';

DELETE FROM jpa_348.ordem_servico
WHERE codigo LIKE 'ORD-JPA-348-%';

DELETE FROM jpa_348.transacao_log
WHERE codigo LIKE 'LOG-JPA-348-%';
```

Execute antes e depois de cada cenário.

Não limpe enquanto uma transação ainda estiver ativa.

---

### 40. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_348.
```

`02_executar_migration.ps1`:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

`03_executar_laboratorio.ps1`:

```powershell
mvn clean verify
mvn exec:java
```

`04_validar_estado_final.ps1` exige:

```text
zero Ordens de fixture;

zero históricos;

zero logs;

foreign key;

índices;

auditoria;

versão;

schema history V1;

nenhuma sessão idle in transaction.
```

`05_limpar_database.ps1` remove o database.

---

### 41. Executar o laboratorio

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
REQUIRED atômico;

runtime rollback;

checked default commit;

rollbackFor;

noRollbackFor;

rollback-only;

UnexpectedRollbackException;

REQUIRES_NEW independente;

MANDATORY;

SUPPORTS;

readOnly;

isolamento;

timeout;

self-invocation;

afterCommit;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 42. Criar documentacao

`fronteira-transacional.md` deve registrar:

```text
caso de uso;

service;

múltiplos repositories;

commit;

rollback;

auditoria.
```

`propagacoes.md` deve comparar:

```text
REQUIRED;

REQUIRES_NEW;

MANDATORY;

SUPPORTS;

NOT_SUPPORTED;

NEVER;

NESTED.
```

`rollback-rules.md` deve comparar runtime, checked, `rollbackFor`, `noRollbackFor` e rollback-only.

`readonly-timeout-isolation.md` deve registrar intenção, suporte, limites e testes.

`proxy-e-self-invocation.md` deve desenhar chamada externa, `this`, bean separado e visibilidade.

`after-commit.md` deve registrar callbacks, commit, rollback, outbox e proibição de reaproveitar a transação encerrada.

---

## Entendendo o que foi feito

### O caso de uso virou a fronteira

Ordem e histórico passaram a compartilhar commit e rollback.

### A propagacao ficou explicita

Cada participante declarou se cria, participa ou exige transação.

### Rollback deixou de ser suposicao

Runtime, checked e regras customizadas foram comprovadas.

### O proxy ganhou importancia pratica

Self-invocation mostrou que a annotation só funciona quando a chamada é interceptada.

### O commit ganhou efeitos posteriores

Ações after-commit deixaram de ocorrer em transações desfeitas.

---

## Erros comuns importantes

### Colocar @Transactional somente no repository

O caso de uso pode atravessar vários repositories.

### Capturar exception REQUIRED e tentar confirmar

A transação pode estar rollback-only.

### Usar REQUIRES_NEW indiscriminadamente

Ele consome conexão e cria commit independente.

### Achar que readOnly proibe toda escrita

É uma intenção e uma oportunidade de otimização.

### Chamar metodo transacional com this

A chamada não atravessa o proxy.

---

## Comandos uteis

### Dependencias

```powershell
mvn dependency:tree
```

### Migration

```powershell
mvn flyway:migrate
mvn flyway:validate
```

### Testes

```powershell
mvn clean verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Consultar transacoes locais

```sql
SELECT
    pid,
    state,
    wait_event_type,
    wait_event,
    xact_start,
    query
FROM pg_stat_activity
WHERE datname = 'formacao_java_jpa_348'
ORDER BY pid;
```

---

## Exercicio guiado

### Parte 1 — REQUIRED em cadeia

Adicione um terceiro service REQUIRED.

Confirme uma única unidade física.

### Parte 2 — REQUIRES_NEW e pool

Reduza o pool de forma controlada.

Observe risco de espera e restaure.

### Parte 3 — MANDATORY

Crie método que falha fora da transação e funciona dentro.

### Parte 4 — Checked exception

Crie outra checked exception.

Escolha e documente sua regra de rollback.

### Parte 5 — noRollbackFor

Substitua warning runtime por retorno explícito.

Compare contratos.

### Parte 6 — Self-invocation

Mova método para bean separado.

Comprove a diferença.

### Parte 7 — After completion

Implemente também:

```java
afterCompletion(
        int status
)
```

Registre commit e rollback em memória.

### Parte 8 — ADR

Registre:

```text
transação na camada de serviço;

REQUIRED como padrão;

REQUIRES_NEW somente para independência real;

MANDATORY para participantes obrigatórios;

rollbackFor em checked quando necessário;

readOnly em leitura;

timeout em operação arriscada;

self-invocation proibida;

efeitos externos somente após commit.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 348 existe;
- continuidade com a aula 347 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data BOM 2026.0.0 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- Spring Boot não foi usado;
- Hibernate 7.4.4.Final foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_348` foi criado;
- configuração real está fora do Git;
- Ordem foi criada;
- histórico foi criado;
- log independente foi criado;
- auditoria foi preservada;
- versão foi preservada;
- foreign key do histórico foi criada;
- log não dependeu de Ordem não confirmada;
- `@EnableTransactionManagement` foi mantido;
- `JpaTransactionManager` foi usado;
- `@Transactional` foi usado;
- service definiu a fronteira;
- controller não definiu transação;
- múltiplos repositories participaram;
- transação física foi explicada;
- transação lógica foi explicada;
- proxy transacional foi explicado;
- chamada externa foi exigida;
- `REQUIRED` foi praticado;
- REQUIRED sem transação criou uma;
- REQUIRED interno participou;
- rollback-only foi explicado;
- `UnexpectedRollbackException` foi testada;
- catch não limpou rollback-only;
- `REQUIRES_NEW` foi praticado;
- transação externa foi suspensa;
- transação interna foi independente;
- log persistiu após rollback externo;
- uso de conexão adicional foi explicado;
- dependência de dado não confirmado foi evitada;
- `MANDATORY` foi praticado;
- chamada fora falhou;
- chamada dentro funcionou;
- `SUPPORTS` foi apresentado;
- outros modos foram documentados;
- runtime exception provocou rollback;
- checked exception padrão foi demonstrada;
- `rollbackFor` foi praticado;
- `noRollbackFor` foi praticado;
- exception chegou ao chamador;
- dados finais foram validados;
- marcação manual de rollback foi apresentada;
- `readOnly` foi praticado;
- readOnly não foi tratado como constraint;
- flag readOnly foi observada;
- escrita em método readOnly foi proibida por arquitetura;
- timeout foi configurado;
- timeout foi testado com proteção externa;
- rollback de timeout foi executado;
- conexão voltou ao pool;
- isolamento READ_COMMITTED foi praticado;
- DEFAULT foi explicado;
- dirty checking funcionou no service;
- save redundante não foi exigido;
- flush foi diferenciado de commit;
- rollback depois de flush foi preservado;
- AuditScope envolveu a transação;
- callback tardio encontrou contexto;
- self-invocation foi demonstrada;
- chamada com `this` não aplicou nova propagação;
- bean separado resolveu a interceptação;
- métodos transacionais oficiais foram públicos;
- private não foi tratado como endpoint;
- afterCommit foi registrado;
- afterCommit executou após commit;
- afterCommit não executou em rollback;
- callback não reutilizou transação encerrada;
- outbox foi citada sem implementação;
- `TransactionTemplate` foi comparado;
- testes de fronteira foram criados;
- testes REQUIRED foram criados;
- testes REQUIRES_NEW foram criados;
- testes MANDATORY foram criados;
- testes de rollback rules foram criados;
- testes readOnly, isolamento e timeout foram criados;
- teste de self-invocation foi criado;
- teste afterCommit foi criado;
- teste de arquitetura foi criado;
- fixtures foram removidas;
- nenhuma transação ficou aberta;
- estado final ficou vazio;
- Testcontainers não foi antecipado;
- Docker não foi antecipado;
- `@DataJpaTest` não foi antecipado;
- ponte para a aula 349 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Confirme que não aparece:

```text
config/jpa.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-348-transacoes-spring-data
```

Commit recomendado:

```powershell
git commit -m "feat(m13): coordenar transacoes com spring data"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você definiu unidades de trabalho profissionais com Spring Data.

Aprendeu:

```text
@Transactional:
fronteira declarativa.

service:
dono do caso de uso.

REQUIRED:
cria ou participa.

REQUIRES_NEW:
transação independente.

MANDATORY:
exige transação existente.

rollbackFor:
inclui exception.

noRollbackFor:
exclui exception.

readOnly:
intenção de leitura.

timeout:
limite da transação.

self-invocation:
não atravessa proxy.

afterCommit:
efeito depois da confirmação.
```

O laboratório comprovou:

```text
Ordem e histórico atômicos;

rollback por runtime;

checked padrão com commit;

checked com rollbackFor;

runtime com noRollbackFor;

rollback-only;

UnexpectedRollbackException;

log REQUIRES_NEW independente;

MANDATORY;

SUPPORTS;

readOnly;

READ_COMMITTED;

timeout;

self-invocation;

afterCommit.
```

A decisão arquitetural foi:

```text
fronteira:
camada de serviço.

propagação padrão:
REQUIRED.

independência real:
REQUIRES_NEW.

participante obrigatório:
MANDATORY.

rollback:
regra explícita.

leitura:
readOnly.

efeito externo:
depois do commit.
```

A próxima aula será:

```text
349 - M13.39 - Testes de Repository com Testcontainers
```

Nela, você aprenderá:

- por que não testar repository somente com mocks;
- banco real em container;
- Testcontainers;
- PostgreSQLContainer;
- lifecycle do container;
- reuse entre testes;
- propriedades dinâmicas;
- Flyway no banco de teste;
- configuração Spring sem Boot;
- isolamento de fixtures;
- testes de mapping;
- queries derivadas;
- `@Query`;
- native queries;
- constraints reais;
- índices e tipos PostgreSQL;
- execução local e CI;
- diagnóstico quando Docker não está disponível.

A aula 348 definiu a transação.

A aula 349 executará repositories contra uma instância PostgreSQL descartável e reproduzível.

---

# Material complementar

## Checkpoint final

- [ ] Coloquei a transação na camada de serviço.
- [ ] Pratiquei REQUIRED, REQUIRES_NEW e MANDATORY.
- [ ] Testei rollback padrão e regras customizadas.
- [ ] Demonstrei self-invocation e afterCommit.
- [ ] Mantive Testcontainers fora desta aula.

---

## Troubleshooting adicional

### @Transactional parece ignorada

Confirme proxy, chamada externa, bean Spring e método público.

### Commit gerou UnexpectedRollbackException

Um participante marcou rollback-only.

### REQUIRES_NEW travou

Revise pool, locks e dependência de dados não confirmados.

### Checked exception confirmou dados

Defina `rollbackFor` quando essa for a regra.

### afterCommit executou em teste errado

Confirme que o recorder foi limpo e que houve commit real.

---

## Perguntas de revisao

1. Onde deve ficar a fronteira transacional?
2. Como `@Transactional` funciona?
3. O que faz REQUIRED?
4. O que faz REQUIRES_NEW?
5. O que faz MANDATORY?
6. O que é rollback-only?
7. Por que surge UnexpectedRollbackException?
8. Runtime provoca rollback por padrão?
9. Checked provoca rollback por padrão?
10. Para que serve rollbackFor?
11. Para que serve noRollbackFor?
12. O que significa readOnly?
13. Timeout é expresso em quê?
14. Qual isolamento foi usado?
15. Managed precisa de save?
16. Flush é commit?
17. Por que self-invocation falha?
18. Quando roda afterCommit?
19. TransactionTemplate ainda é útil?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Na camada de serviço.
2. Por proxy e interceptor.
3. Cria ou participa.
4. Suspende e cria outra.
5. Exige existente.
6. Marca que a transação deve desfazer.
7. O commit foi tentado em transação marcada.
8. Sim.
9. Não.
10. Incluir exception no rollback.
11. Excluir exception do rollback.
12. Intenção de leitura.
13. Segundos.
14. READ_COMMITTED.
15. Não.
16. Não.
17. Não atravessa o proxy.
18. Depois do commit.
19. Sim.
20. Testes de Repository com Testcontainers.

---

## Desafio opcional

Crie:

```java
TransactionalPolicyVerifier
```

Entrada:

```text
classe;

método;

annotation;

propagation;

rollback rules;

visibilidade;

camada.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- alertar transação em controller;
- alertar private;
- alertar REQUIRES_NEW sem justificativa;
- alertar checked sem regra documentada;
- alertar noRollbackFor em runtime;
- alertar escrita em readOnly;
- alertar callback externo antes do commit;
- não iniciar Spring;
- possuir testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 348 - M13.38 - Transacoes com Spring Data

- Coloquei a fronteira transacional na camada de serviço.
- Entendi o proxy de `@Transactional`.
- Diferenciei transação lógica de física.
- Usei `Propagation.REQUIRED`.
- Fiz participantes REQUIRED compartilharem a unidade.
- Entendi rollback-only.
- Reproduzi `UnexpectedRollbackException`.
- Usei `Propagation.REQUIRES_NEW`.
- Mantive log independente da transação externa.
- Entendi o custo de uma conexão adicional.
- Usei `Propagation.MANDATORY`.
- Demonstrei `Propagation.SUPPORTS`.
- Conheci os demais modos de propagação.
- Confirmei rollback padrão para runtime exceptions.
- Demonstrei checked exception sem rollback padrão.
- Usei `rollbackFor`.
- Usei `noRollbackFor`.
- Mantive a exception visível ao chamador.
- Conheci marcação manual de rollback.
- Usei `readOnly = true`.
- Entendi que readOnly não é constraint universal.
- Configurei timeout transacional.
- Testei timeout com proteção externa.
- Usei isolamento `READ_COMMITTED`.
- Mantive dirty checking dentro do service.
- Diferenciei flush de commit.
- Mantive AuditScope durante toda a transação.
- Demonstrei o problema de self-invocation.
- Mudei propagação independente para outro bean.
- Mantive métodos transacionais públicos.
- Registrei callback `afterCommit`.
- Impedi efeito posterior em rollback.
- Comparei `@Transactional` com `TransactionTemplate`.
- Mantive Flyway no DDL e Hibernate em validate.
- Não usei Testcontainers nesta aula.
- Próxima aula: Testes de Repository com Testcontainers.
```

---

## Referencia tecnica curta

```text
@Transactional:
fronteira.

REQUIRED:
participa.

REQUIRES_NEW:
independente.

MANDATORY:
exige.

Runtime:
rollback padrão.

Checked:
commit padrão.

rollbackFor:
inclui.

readOnly:
intenção.

Self-invocation:
bypass.

afterCommit:
efeito confirmado.
```

Regra final:

```text
transacoes com Spring Data devem representar a unidade de trabalho do caso de uso na camada de servico, atravessar um proxy Spring e coordenar repositories, dirty checking, auditoria e commit; propagacao, rollback rules, readOnly, timeout e efeitos after-commit precisam ser escolhas explicitas, enquanto self-invocation, REQUIRES_NEW indiscriminado e captura de falhas rollback-only devem ser tratados como riscos arquiteturais.
```
