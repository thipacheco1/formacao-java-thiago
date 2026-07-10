# 343 - M13.33 - Lock pessimista

## Apresentacao da aula

Na aula 342, você protegeu a Ordem de Serviço contra atualização perdida usando:

```java
@Version
```

O lock otimista permitiu que duas transações lessem a mesma versão.

A primeira gravação foi confirmada.

A segunda tentou atualizar uma versão obsoleta e recebeu conflito.

O fluxo foi:

```text
A lê versão 1;

B lê versão 1;

A grava versão 2;

B tenta gravar usando versão 1;

zero linhas atualizadas;

conflito otimista;

rollback.
```

Essa estratégia detecta o conflito no momento da gravação.

Ela é adequada quando:

- conflitos são raros;
- leituras são frequentes;
- a edição pode durar algum tempo;
- não se deseja manter um lock físico enquanto o usuário pensa;
- o sistema consegue informar ou reaplicar o comando.

Agora você estudará outra estratégia:

```text
lock pessimista.
```

O lock pessimista parte de uma suposição diferente:

```text
o conflito é provável ou caro demais;
a linha precisa ser reservada antes da alteração.
```

Em vez de permitir que duas transações avancem e detectar o conflito depois, uma transação solicita um lock no banco.

A outra transação pode:

- esperar;
- falhar por timeout;
- falhar imediatamente em uma política sem espera;
- prosseguir somente depois da liberação.

A JPA define os modos:

```java
LockModeType.PESSIMISTIC_READ
LockModeType.PESSIMISTIC_WRITE
LockModeType.PESSIMISTIC_FORCE_INCREMENT
```

O SQL gerado depende do provider e do dialeto.

No PostgreSQL, o Hibernate normalmente utiliza formas de bloqueio baseadas em cláusulas como:

```sql
FOR UPDATE
```

ou variações compatíveis com o modo solicitado.

O laboratório não presumirá que todos os modos produzem exatamente o mesmo SQL em todas as versões.

Ele observará:

- o modo pedido;
- o SQL real;
- o comportamento entre duas conexões;
- o tempo de espera;
- a exceção recebida;
- o rollback;
- a liberação do lock.

Você aprenderá:

- diferença entre otimista e pessimista;
- `PESSIMISTIC_READ`;
- `PESSIMISTIC_WRITE`;
- `PESSIMISTIC_FORCE_INCREMENT`;
- `find` com lock;
- `lock` em entidade managed;
- lock em query;
- requisito de transação;
- SQL de bloqueio;
- espera entre transações;
- timeout;
- `LockTimeoutException`;
- `PessimisticLockException`;
- rollback seguro;
- liberação no commit;
- liberação no rollback;
- transações curtas;
- lock scope;
- ordem de aquisição;
- risco de deadlock;
- critérios profissionais de escolha.

A infraestrutura continuará:

```text
Java 21;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O database será:

```text
formacao_java_jpa_343
```

O schema será:

```text
jpa_343
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade principal continuará versionada:

```text
OrdemServicoEntity;

@Version;
```

O laboratório comprovará:

```text
PESSIMISTIC_WRITE:
reserva a linha para a transação A.

transação B:
não conclui a escrita enquanto A mantém o lock.

commit A:
libera o lock.

rollback A:
também libera o lock.

timeout curto em B:
falha controlada.

find com lock:
funciona dentro de transação.

lock em managed:
funciona dentro de transação.

query com lock:
aplica modo pessimista.

FORCE_INCREMENT:
incrementa a versão conforme contrato do provider.

linhas diferentes:
podem ser bloqueadas independentemente.

ordem de aquisição diferente:
pode criar deadlock.

estado final:
zero OS-JPA-343-%.
```

A próxima aula será:

```text
344 - M13.34 - Auditoria CreatedAt UpdatedAt usuario
```

Por isso, esta aula não aprofundará:

- callbacks de auditoria;
- `@PrePersist`;
- `@PreUpdate`;
- usuário autenticado;
- contexto de auditoria;
- Spring Data Auditing;
- `@CreatedDate`;
- `@LastModifiedDate`;
- trilha histórica;
- outbox;
- eventos de domínio.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
341:
Paginacao e ordenacao com JPA.

342:
Lock otimista.

343:
Lock pessimista.

344:
Auditoria CreatedAt UpdatedAt usuario.

345:
Spring Data Repository conceitos.
```

A aula 342 respondeu:

```text
como detectar uma gravação baseada em estado obsoleto?
```

A aula 343 responderá:

```text
como reservar a linha antes de executar
uma operação concorrente crítica?
```

Nesta aula:

```text
PESSIMISTIC_READ:
sim.

PESSIMISTIC_WRITE:
sim.

PESSIMISTIC_FORCE_INCREMENT:
sim.

find com lock:
sim.

lock em managed:
sim.

query setLockMode:
sim.

timeout:
sim.

duas conexões:
sim.

threads controladas:
sim.

deadlock:
explicado e testado com proteção.

auditoria:
não.

Spring:
não.
```

A arquitetura do cenário principal será:

```text
Thread A
    -> EntityManager A
        -> transação A
            -> find com PESSIMISTIC_WRITE
                -> lock da linha
                    -> aguarda sinal para commit.

Thread B
    -> EntityManager B
        -> transação B
            -> tenta lock da mesma linha
                -> espera ou timeout.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-343-lock-pessimista
```

Estrutura final:

```text
labs
└── m13
    └── aula-343-lock-pessimista
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── comparacao-otimista-pessimista.md
        │   ├── contrato-lock-modes.md
        │   ├── politica-timeout.md
        │   ├── politica-transacao-curta.md
        │   ├── ordem-de-lock-e-deadlock.md
        │   └── troubleshooting-lock-pessimista.md
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
            │   │                   └── aula343
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── exception
            │   │                       │   ├── OrderLockUnavailableException.java
            │   │                       │   └── PessimisticLockTranslator.java
            │   │                       ├── lab
            │   │                       │   ├── PessimisticLockLab.java
            │   │                       │   ├── PessimisticLockObservation.java
            │   │                       │   └── PessimisticLockReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_343.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula343
                                        ├── PessimisticWriteIT.java
                                        ├── PessimisticReadIT.java
                                        ├── ForceIncrementIT.java
                                        ├── LockAcquisitionApiIT.java
                                        ├── LockTimeoutIT.java
                                        ├── DeadlockRiskIT.java
                                        ├── PessimisticLockTranslatorTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
A bloqueia Ordem principal;

B tenta bloquear a mesma Ordem;

B não conclui enquanto A não libera;

commit ou rollback de A libera;

B prossegue depois da liberação
ou falha pelo timeout configurado;

versão continua coerente;

FORCE_INCREMENT aumenta versão;

locks em IDs diferentes não bloqueiam entre si;

deadlock é prevenido por ordem única;

todas as transações são encerradas;

nenhuma thread fica pendurada;

estado final limpo.
```

---

## Conceito essencial

### O que e lock pessimista

Lock pessimista é um lock solicitado ao banco para proteger uma entidade durante uma transação.

A aplicação diz:

```text
pretendo ler ou modificar este registro
e preciso controlar o acesso concorrente agora.
```

O banco mantém o lock até:

- commit;
- rollback;
- término forçado da conexão.

---

### Diferenca para lock otimista

Lock otimista:

```text
não reserva a linha durante a leitura;

usa versão;

detecta conflito no update ou delete;

bom quando conflitos são raros.
```

Lock pessimista:

```text
solicita bloqueio antes da operação crítica;

outros fluxos podem esperar;

pode gerar timeout ou deadlock;

bom quando a reserva é necessária.
```

As duas estratégias não são inimigas.

Uma entidade pode continuar com `@Version` e também ser buscada com lock pessimista em um caso específico.

---

### Transacao obrigatoria

Operações de lock pessimista exigem uma transação ativa.

Exemplo:

```java
EntityTransaction transaction =
        entityManager.getTransaction();

transaction.begin();

OrdemServicoEntity ordem =
        entityManager.find(
                OrdemServicoEntity.class,
                ordemId,
                LockModeType.PESSIMISTIC_WRITE
        );
```

Executar fora de transação pode gerar:

```text
TransactionRequiredException.
```

---

### PESSIMISTIC_WRITE

Use quando a transação pretende modificar a entidade e precisa impedir escritas concorrentes incompatíveis.

Exemplo:

```java
entityManager.find(
        OrdemServicoEntity.class,
        ordemId,
        LockModeType.PESSIMISTIC_WRITE
);
```

A intenção é serializar operações críticas sobre a mesma linha.

A transação deve permanecer curta.

---

### PESSIMISTIC_READ

Use quando a aplicação precisa manter uma leitura estável protegida contra alterações incompatíveis.

O comportamento físico depende do banco e do provider.

Alguns bancos possuem lock compartilhado específico.

Outros dialetos podem usar uma forma mais forte para cumprir o contrato.

Observe:

```text
modo JPA solicitado;

SQL real;

comportamento concorrente.
```

---

### PESSIMISTIC_FORCE_INCREMENT

Esse modo combina:

- lock pessimista;
- entidade versionada;
- incremento forçado da versão.

Exemplo:

```java
entityManager.find(
        OrdemServicoEntity.class,
        ordemId,
        LockModeType.PESSIMISTIC_FORCE_INCREMENT
);
```

Ele pode ser útil quando uma operação precisa:

- reservar a linha;
- marcar uma nova versão lógica;
- invalidar estados antigos;
- representar mudança indireta no agregado.

O momento do incremento pode ocorrer no flush ou commit conforme o provider.

O teste observará o valor final, não dependerá de um instante interno rígido.

---

### SQL FOR UPDATE

Um SQL comum para lock de escrita é:

```sql
SELECT
    ...
FROM jpa_343.ordem_servico
WHERE id = ?
FOR UPDATE;
```

A cláusula exata pode variar:

```text
FOR UPDATE;

FOR NO KEY UPDATE;

FOR SHARE;

NOWAIT;

ou estratégia equivalente.
```

O laboratório procurará evidências de lock no SQL normalizado sem comparar a string completa.

---

### O lock pertence a transacao

O lock não pertence permanentemente ao objeto Java.

Depois do commit:

```text
a entidade pode continuar acessível;

o lock físico foi liberado.
```

Depois do rollback:

```text
o lock também foi liberado.
```

Não existe método JPA para “guardar” o lock depois da transação.

---

### Espera

Quando B tenta adquirir um lock incompatível mantido por A, B pode esperar.

Durante essa espera:

- uma conexão fica ocupada;
- uma thread pode ficar bloqueada;
- o tempo de resposta aumenta;
- a fila do pool pode crescer;
- outras transações podem ser afetadas.

Por isso, lock pessimista exige limites.

---

### Timeout

A JPA define o hint:

```text
jakarta.persistence.lock.timeout
```

O valor é expresso em milissegundos como hint de portabilidade.

Exemplo:

```java
Map<String, Object> properties =
        Map.of(
                "jakarta.persistence.lock.timeout",
                500
        );
```

O provider e o banco podem tratar o hint de formas diferentes.

Ele pode ser:

- convertido em timeout do banco;
- convertido em cláusula sem espera;
- ignorado quando não suportado;
- aproximado.

O teste não dependerá de precisão de milissegundos.

---

### LockTimeoutException

`LockTimeoutException` representa falha de aquisição de lock sem necessariamente marcar toda a transação para rollback pelo contrato abstrato.

Mesmo assim, a política do laboratório será conservadora:

```text
capturar;

rollback;

fechar o EntityManager;

traduzir a falha.
```

Isso simplifica a recuperação e evita continuar em estado duvidoso.

---

### PessimisticLockException

`PessimisticLockException` representa falha pessimista que pode marcar a transação para rollback.

A aplicação deve:

- verificar a cadeia de causas;
- executar rollback quando ativo;
- fechar o contexto;
- não repetir cegamente;
- traduzir para erro de domínio ou infraestrutura.

---

### Timeout de teste versus timeout de negocio

O laboratório terá dois limites:

```text
timeout do lock no banco/provider;

timeout do Future no teste.
```

O timeout do `Future` impede que o teste fique pendurado caso o hint não seja honrado.

Ele não substitui a política de lock da aplicação.

---

### Coordenacao com CountDownLatch

Os testes concorrentes usarão:

```java
CountDownLatch lockAcquired =
        new CountDownLatch(1);

CountDownLatch releaseLock =
        new CountDownLatch(1);
```

Thread A:

1. inicia transação;
2. adquire lock;
3. sinaliza `lockAcquired`;
4. aguarda `releaseLock`;
5. confirma ou desfaz.

Thread B só começa a tentativa depois do sinal de A.

Isso evita testes baseados em `Thread.sleep` como sincronização principal.

---

### ExecutorService

Use:

```java
ExecutorService executor =
        Executors.newFixedThreadPool(2);
```

Cada tarefa cria seu próprio:

- `EntityManager`;
- transação;
- bloco try/catch/finally.

Nunca compartilhe `EntityManager` entre threads.

`EntityManager` não é thread-safe.

---

### Commit libera

Cenário:

1. A adquire `PESSIMISTIC_WRITE`;
2. B tenta o mesmo lock e espera;
3. A executa commit;
4. B adquire;
5. B altera;
6. B confirma.

O teste comprova que B não conclui antes da liberação.

---

### Rollback libera

Repita:

1. A adquire lock;
2. B espera;
3. A executa rollback;
4. B adquire;
5. B conclui.

Commit e rollback encerram a reserva.

---

### Transacoes curtas

Uma transação pessimista deve conter apenas:

- leitura necessária;
- validação local;
- alteração;
- flush;
- commit.

Não deve conter:

- chamada HTTP;
- espera de usuário;
- envio de e-mail;
- processamento pesado;
- acesso lento a arquivo;
- retry com pausa longa;
- integração remota.

Quanto maior a duração, maior o risco de contenção.

---

### Lock e pool

Uma transação bloqueada mantém recursos.

Com pool de quatro conexões:

```text
duas transações bloqueadas;
duas conexões restantes.
```

Em carga alta, vários locks podem esgotar o pool.

O dimensionamento não corrige um fluxo que segura locks por muito tempo.

---

### Linhas diferentes

Locks de linha permitem concorrência quando as transações atuam em registros diferentes.

Cenário:

```text
A bloqueia Ordem 1;

B bloqueia Ordem 2.
```

As duas podem prosseguir.

Isso não significa ausência de outros locks internos, índices ou contenções do banco.

O teste valida o caso simples.

---

### Ordem de aquisicao

Considere:

```text
Transação A:
bloqueia Ordem 1;
depois tenta Ordem 2.

Transação B:
bloqueia Ordem 2;
depois tenta Ordem 1.
```

Cada uma espera a outra.

Isso forma um ciclo:

```text
deadlock.
```

O banco detecta e aborta uma das transações.

---

### Prevenir deadlock

Política:

```text
sempre adquirir locks na mesma ordem.
```

Exemplo:

```text
ordenar IDs crescentemente;

bloquear menor ID;

depois maior ID.
```

Outras medidas:

- transações curtas;
- poucos locks;
- índices adequados;
- timeout;
- retry limitado quando seguro;
- métricas de deadlock;
- logs com correlation ID.

---

### Deadlock nao e lock timeout comum

Timeout:

```text
uma transação esperou além do limite.
```

Deadlock:

```text
existe ciclo de dependência;
nenhuma pode avançar sem abortar uma.
```

A resposta operacional pode ser parecida, mas a causa deve ser distinguida em logs e métricas.

---

### Lock scope

A JPA define propriedades relacionadas ao escopo pessimista:

```text
PessimisticLockScope.NORMAL;

PessimisticLockScope.EXTENDED.
```

`NORMAL` foca as linhas da entidade conforme o contrato.

`EXTENDED` pode solicitar alcance adicional sobre relacionamentos dependentes ou tabelas de coleção, conforme suporte.

A portabilidade é limitada.

O laboratório utilizará:

```text
NORMAL.
```

Não assumirá que bloquear Ordem bloqueia automaticamente todo o agregado.

---

### Lock nao substitui constraint

Mesmo com lock pessimista, mantenha:

- primary key;
- foreign key;
- unique;
- check;
- `@Version`;
- validações.

O lock controla concorrência temporária.

As constraints protegem integridade permanente.

---

### Pessimista e versao

A entidade continuará com `@Version`.

Benefícios:

- operações comuns continuam otimistas;
- operações críticas podem usar lock pessimista;
- alterações ainda incrementam versão;
- clientes detached antigos continuam detectáveis.

A estratégia é escolhida por caso de uso, não apenas por entidade.

---

### Quando usar pessimista

É candidato quando:

- a linha representa recurso escasso;
- duas operações não podem avançar juntas;
- conflito é frequente;
- a falha tardia é muito cara;
- a transação é curta;
- o banco está disponível;
- timeout é definido;
- contenção é observada.

Exemplos:

- reservar uma cota;
- selecionar próximo item de fila;
- impedir dupla alocação;
- atualizar saldo crítico com fluxo curto;
- assumir atendimento exclusivo.

---

### Quando evitar

Evite quando:

- o usuário pode ficar minutos editando;
- a operação envolve integração remota;
- leitura pode ser feita sem reserva;
- o conflito é raro;
- o pool é pequeno;
- o sistema precisa de alta concorrência;
- o lock seria muito amplo;
- não existe política de timeout.

Nesses casos, lock otimista tende a ser melhor.

---

### Traducao de falha

Crie:

```java
OrderLockUnavailableException
```

Mensagem:

```text
A Ordem está sendo processada por outra operação.
Tente novamente em instantes.
```

Não exponha:

- SQL;
- `FOR UPDATE`;
- nome da tabela;
- stack trace;
- detalhes do banco.

Preserve a causa para diagnóstico interno.

---

### Retry

Retry de lock pessimista pode ser aceitável quando:

- comando é idempotente;
- timeout foi transitório;
- número de tentativas é pequeno;
- backoff é limitado;
- não existe efeito externo duplicável.

Não faça retry dentro da mesma transação falha.

Crie nova transação e novo `EntityManager`.

O laboratório não automatizará retry.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\java\br\com\formacao\m13\aula343\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\java\br\com\formacao\m13\aula343\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\java\br\com\formacao\m13\aula343\exception"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\java\br\com\formacao\m13\aula343\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\java\br\com\formacao\m13\aula343\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-343-lock-pessimista\src\test\java\br\com\formacao\m13\aula343"

Set-Location `
  "labs\m13\aula-343-lock-pessimista"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 342.

Ajuste:

```text
artifactId:
aula-343-lock-pessimista.

persistence unit:
aula343PU.

Main:
br.com.formacao.m13.aula343.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_343
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-343-jpa
JPA_POOL_NAME=aula-343-pool
JPA_POOL_SIZE=6
```

O pool terá margem para tarefas concorrentes e validação.

---

### 3. Criar migration

Crie:

```sql
CREATE SCHEMA IF NOT EXISTS jpa_343;

CREATE SEQUENCE jpa_343.ordem_servico_id_seq
    START WITH 343101
    INCREMENT BY 1;

CREATE TABLE jpa_343.ordem_servico (
    id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    descricao varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criada_em timestamptz NOT NULL,
    atualizada_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_343_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_343_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_343_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'EM_ATENDIMENTO',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_jpa_343_ordem_versao
        CHECK (versao >= 0)
);

CREATE INDEX idx_jpa_343_ordem_status
    ON jpa_343.ordem_servico (
        status
    );
```

---

### 4. Criar OrdemServicoEntity.java

Mantenha:

```java
@Version
@Column(
        name = "versao",
        nullable = false
)
private int versao;
```

Métodos:

```java
public void iniciarAtendimento(
        OffsetDateTime agora
)

public void alterarDescricao(
        String descricao,
        OffsetDateTime agora
)

public void concluir(
        OffsetDateTime agora
)
```

Não adicione lógica de lock à entidade.

Lock é preocupação da unidade de trabalho e do repository.

---

### 5. Criar persistence.xml e runtime

Use:

```text
aula343PU;

RESOURCE_LOCAL;

shared-cache-mode NONE;

hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true.
```

Liste somente a Ordem.

O runtime deve fornecer:

- `EntityManagerFactory`;
- `DataSource`;
- `SqlCaptureInspector`;
- método para criar managers independentes.

---

### 6. Evoluir SqlCaptureInspector

Adicione:

```java
public long lockSelectCount()

public boolean containsForUpdateLikeClause()

public List<String> normalizedSelects()

public void clear()
```

A detecção deve aceitar variações do dialeto.

Não exija texto integral.

---

### 7. Criar PessimisticLockObservation.java

```java
package br.com.formacao.m13.aula343.lab;

public record PessimisticLockObservation(
        String scenario,
        boolean firstLockAcquired,
        boolean secondCompletedBeforeRelease,
        boolean secondCompletedAfterRelease,
        boolean timeoutDetected,
        boolean firstRollback,
        boolean secondRollback,
        int initialVersion,
        int finalVersion,
        long lockSelects
) {

    public PessimisticLockObservation {
        if (
            scenario == null
            || scenario.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "cenário obrigatório"
            );
        }
    }
}
```

---

### 8. Criar PessimisticLockReport.java

```java
package br.com.formacao.m13.aula343.lab;

import java.util.List;

public record PessimisticLockReport(
        List<PessimisticLockObservation> observations,
        boolean writeLockBlockedCompetitor,
        boolean commitReleasedLock,
        boolean rollbackReleasedLock,
        boolean timeoutWasTranslated,
        boolean readModeWasObserved,
        boolean forceIncrementChangedVersion,
        boolean findLockWorked,
        boolean managedLockWorked,
        boolean queryLockWorked,
        boolean differentRowsWereIndependent,
        boolean deadlockRiskWasControlled
) {

    public PessimisticLockReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar fixture principal

Persista:

```text
OS-JPA-343-MAIN.
```

Status:

```text
ABERTA.
```

Descrição:

```text
Ordem principal para lock pessimista.
```

Confirme versão inicial 0.

Crie também:

```text
OS-JPA-343-A;

OS-JPA-343-B.
```

Essas duas serão usadas em independência e ordem de locks.

---

### 10. Adquirir PESSIMISTIC_WRITE em A

Thread A:

```java
transaction.begin();

OrdemServicoEntity ordem =
        entityManager.find(
                OrdemServicoEntity.class,
                orderId,
                LockModeType.PESSIMISTIC_WRITE
        );

lockAcquired.countDown();

releaseLock.await(
        5,
        TimeUnit.SECONDS
);

ordem.iniciarAtendimento(
        OffsetDateTime.now()
);

entityManager.flush();
transaction.commit();
```

Use `finally` para rollback e fechamento.

---

### 11. Tentar o mesmo lock em B

Thread B aguarda:

```java
lockAcquired.await(
        5,
        TimeUnit.SECONDS
);
```

Depois:

```java
transaction.begin();

OrdemServicoEntity ordem =
        entityManager.find(
                OrdemServicoEntity.class,
                orderId,
                LockModeType.PESSIMISTIC_WRITE
        );
```

Antes de liberar A, verifique por `Future.isDone()`:

```text
B ainda não terminou.
```

Não use somente duração como prova.

---

### 12. Liberar por commit

Depois da verificação:

```java
releaseLock.countDown();
```

A confirma.

B adquire o lock, altera a descrição e confirma.

Valide:

```text
B concluiu depois da liberação;

nenhuma thread ficou pendurada;

versão incrementou em cada update real.
```

---

### 13. Liberar por rollback

Repita com A executando rollback sem alteração.

B deve adquirir depois do rollback e confirmar.

Confirme:

```text
rollback também liberou o lock.
```

---

### 14. Testar timeout

A adquire lock e permanece aguardando.

B usa properties:

```java
Map<String, Object> properties =
        Map.of(
                "jakarta.persistence.lock.timeout",
                300
        );
```

B chama:

```java
entityManager.find(
        OrdemServicoEntity.class,
        orderId,
        LockModeType.PESSIMISTIC_WRITE,
        properties
);
```

Aceite na cadeia:

```text
LockTimeoutException;

PessimisticLockException;

exceção provider específica traduzível.
```

Use `Future.get` com limite maior que o hint para impedir travamento do teste.

Depois:

```text
rollback B;

liberar A;

encerrar executor.
```

---

### 15. Testar find com lock

Dentro de transação:

```java
entityManager.find(
        OrdemServicoEntity.class,
        orderId,
        LockModeType.PESSIMISTIC_WRITE
);
```

Confirme:

- entidade managed;
- lock mode observado;
- SQL de lock;
- commit.

---

### 16. Testar lock em managed

Fluxo:

```java
OrdemServicoEntity ordem =
        entityManager.find(
                OrdemServicoEntity.class,
                orderId
        );

entityManager.lock(
        ordem,
        LockModeType.PESSIMISTIC_WRITE
);
```

Confirme que a instância continua managed.

Teste negativo:

```text
entidade detached;
lock solicitado em outro manager;
falha.
```

---

### 17. Testar query com lock

Consulta:

```java
TypedQuery<OrdemServicoEntity> query =
        entityManager.createQuery(
                """
                select o
                from OrdemServico o
                where o.codigo = :codigo
                """,
                OrdemServicoEntity.class
        );

query.setParameter(
        "codigo",
        "OS-JPA-343-MAIN"
);

query.setLockMode(
        LockModeType.PESSIMISTIC_WRITE
);
```

Execute dentro de transação.

Confirme uma única Ordem e lock observado.

---

### 18. Testar PESSIMISTIC_READ

A solicita:

```java
LockModeType.PESSIMISTIC_READ
```

Registre:

- SQL gerado;
- lock mode reportado;
- comportamento de B tentando update;
- suporte real do provider.

Não imponha que duas leituras coexistam em todas as combinações.

A assertiva será:

```text
o modo foi solicitado e o provider aplicou
uma estratégia pessimista compatível.
```

---

### 19. Testar FORCE_INCREMENT

Abra transação.

Carregue a versão atual.

Solicite:

```java
entityManager.lock(
        ordem,
        LockModeType.PESSIMISTIC_FORCE_INCREMENT
);
```

Flush e commit.

Abra novo manager.

Confirme:

```text
versão final > versão inicial.
```

Não exija incremento antes do commit.

---

### 20. Testar linhas diferentes

Thread A bloqueia:

```text
OS-JPA-343-A.
```

Thread B bloqueia:

```text
OS-JPA-343-B.
```

As duas devem alcançar o ponto `lock acquired` sem depender da liberação da outra.

Depois, libere ambas e confirme.

---

### 21. Demonstrar risco de deadlock

Use fixtures A e B.

Tarefa 1:

```text
lock A;

depois tenta B.
```

Tarefa 2:

```text
lock B;

depois tenta A.
```

Configure timeout curto de teste e rollback obrigatório.

O objetivo não é exigir que o banco produza uma classe exata de exceção.

O objetivo é provar:

```text
ordens diferentes criam ciclo de espera.
```

Depois, implemente a política segura:

```text
ordenar IDs;

bloquear menor;

bloquear maior.
```

Confirme que as duas operações não formam ciclo.

---

### 22. Criar OrderLockUnavailableException.java

```java
package br.com.formacao.m13.aula343.exception;

public final class OrderLockUnavailableException
        extends RuntimeException {

    private final Long orderId;

    public OrderLockUnavailableException(
            Long orderId,
            Throwable cause
    ) {
        super(
                "A Ordem está sendo processada "
                + "por outra operação. "
                + "Tente novamente em instantes.",
                cause
        );

        this.orderId = orderId;
    }

    public Long getOrderId() {
        return orderId;
    }
}
```

---

### 23. Criar PessimisticLockTranslator.java

Percorra a cadeia de causas.

Reconheça:

```java
LockTimeoutException;

PessimisticLockException.
```

A infraestrutura pode reconhecer exceções específicas do Hibernate ou PostgreSQL sem expô-las ao domínio.

Não traduza qualquer timeout genérico como lock.

---

### 24. Criar Main.java

O `Main`:

1. abre runtime;
2. prepara fixtures;
3. executa cenários controlados;
4. imprime observações;
5. encerra executors;
6. remove fixtures;
7. fecha runtime.

Formato:

```text
cenário | lock A | B antes da liberação | B depois | timeout | rollback | versão
```

Nunca deixe executor não encerrado.

Use:

```java
shutdownNow();
awaitTermination(...);
```

no `finally`.

---

### 25. Criar PessimisticWriteIT.java

Casos:

- A adquire write lock;
- B tenta mesma linha;
- B não conclui antes;
- commit A libera;
- B conclui;
- rollback A libera;
- SQL contém evidência de lock;
- managers e executor fechados.

---

### 26. Criar PessimisticReadIT.java

Casos:

- `PESSIMISTIC_READ` solicitado;
- modo observado;
- SQL capturado;
- comportamento de escrita concorrente registrado;
- sem afirmação rígida sobre cláusula específica;
- rollback seguro.

---

### 27. Criar ForceIncrementIT.java

Casos:

- entidade versionada;
- versão inicial;
- force increment;
- commit;
- versão final maior;
- nenhuma alteração de descrição necessária.

---

### 28. Criar LockAcquisitionApiIT.java

Casos:

```text
find com lock;

lock em managed;

query setLockMode;

fora de transação;

entidade detached.
```

Confirme `TransactionRequiredException` fora de transação quando aplicável.

---

### 29. Criar LockTimeoutIT.java

Casos:

- A mantém lock;
- B usa timeout;
- falha traduzida;
- rollback B;
- liberação A;
- fixture continua íntegra;
- teste possui timeout externo;
- nenhuma thread fica viva.

---

### 30. Criar DeadlockRiskIT.java

Casos:

#### Ordem oposta

- A depois B;
- B depois A;
- timeout ou deadlock detectado;
- rollback de ambas quando necessário.

#### Ordem única

- IDs ordenados;
- sem ciclo;
- operações concluem.

Não compare mensagem de erro do PostgreSQL.

---

### 31. Criar PessimisticLockTranslatorTest.java

Casos:

- `LockTimeoutException`;
- `PessimisticLockException`;
- exceção aninhada;
- exceção não relacionada;
- mensagem pública sem SQL;
- orderId preservado.

Teste unitário sem banco.

---

### 32. Criar TestDataCleaner.java

```sql
DELETE FROM jpa_343.ordem_servico
WHERE codigo LIKE 'OS-JPA-343-%';
```

Execute somente quando nenhuma transação concorrente estiver ativa.

---

### 33. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_343.
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
zero OS-JPA-343-%;

coluna versao válida;

constraints presentes;

índice de status presente;

schema history com V1;

nenhuma sessão do laboratório idle in transaction.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 34. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
write lock bloqueou concorrente;

commit liberou;

rollback liberou;

timeout foi controlado;

read mode foi observado;

force increment mudou versão;

três APIs de aquisição funcionaram;

linhas diferentes foram independentes;

risco de deadlock foi reproduzido com proteção;

ordem única evitou ciclo;

nenhum recurso ficou aberto;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 35. Criar documentacao

`comparacao-otimista-pessimista.md` deve comparar:

```text
momento do conflito;

bloqueio físico;

espera;

versão;

pool;

retry;

uso;
```

`contrato-lock-modes.md` deve registrar:

- READ;
- WRITE;
- FORCE_INCREMENT;
- transação;
- provider;
- SQL observado;
- versão.

`politica-timeout.md` deve registrar:

- hint;
- suporte do provider;
- timeout externo;
- rollback;
- mensagem pública;
- métricas.

`politica-transacao-curta.md` deve listar atividades permitidas e proibidas enquanto o lock está ativo.

`ordem-de-lock-e-deadlock.md` deve desenhar o ciclo e a política de IDs ordenados.

`troubleshooting-lock-pessimista.md` deve cobrir:

- lock não bloqueia;
- operação fora de transação;
- entidade detached;
- timeout ignorado;
- pool esgotado;
- deadlock;
- executor pendurado;
- lock amplo;
- collection lock;
- versão inesperada.

---

## Entendendo o que foi feito

### A linha foi reservada antes da alteracao

O conflito deixou de ser detectado apenas no update.

### O banco controlou a espera

A segunda transação aguardou ou falhou conforme timeout e suporte.

### Commit e rollback liberaram recursos

O lock permaneceu restrito à transação.

### As APIs JPA foram comparadas

`find`, `lock` e query com `setLockMode` chegaram ao mesmo objetivo por pontos diferentes.

### O deadlock virou risco arquitetural

A ordem consistente de aquisição passou a fazer parte do contrato.

---

## Erros comuns importantes

### Segurar lock durante chamada externa

Isso aumenta contenção e risco de timeout.

### Compartilhar EntityManager entre threads

`EntityManager` não é thread-safe.

### Confiar apenas em Thread.sleep

Use latches e futures para coordenar testes.

### Nao configurar timeout externo no teste

Uma falha pode pendurar toda a suíte.

### Bloquear registros em ordens diferentes

Isso facilita deadlocks.

---

## Comandos uteis

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

### Consultar sessoes bloqueadas

```sql
SELECT
    pid,
    state,
    wait_event_type,
    wait_event,
    query
FROM pg_stat_activity
WHERE datname = 'formacao_java_jpa_343'
ORDER BY pid;
```

Use essa consulta apenas em ambiente local controlado.

---

## Exercicio guiado

### Parte 1 — Commit e rollback

Meça separadamente o desbloqueio provocado por cada um.

### Parte 2 — Timeout

Teste dois valores aproximados.

Não afirme precisão exata do hint.

### Parte 3 — Lock por query

Filtre por status e aplique lock.

Limite o resultado a uma Ordem.

### Parte 4 — Duas linhas

Bloqueie A e B em paralelo.

Confirme ausência de espera cruzada.

### Parte 5 — Ordem de IDs

Crie helper:

```java
lockInAscendingOrder(
        List<Long> ids
)
```

Remova duplicados, ordene e bloqueie.

### Parte 6 — Chamada externa simulada

Adicione espera artificial dentro do lock.

Observe o aumento da retenção e depois remova.

### Parte 7 — Otimista versus pessimista

Implemente o mesmo caso com `@Version` sem lock.

Compare espera, conflito e experiência do usuário.

### Parte 8 — ADR

Registre:

```text
otimista como padrão;

pessimista somente em operação crítica;

timeout obrigatório;

transação curta;

um manager por thread;

IDs em ordem crescente;

rollback em qualquer falha;

métricas de espera e deadlock.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 343 existe;
- continuidade com a aula 342 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_343` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- Ordem permaneceu versionada;
- lock pessimista foi definido;
- diferença para otimista foi explicada;
- transação obrigatória foi explicada;
- `PESSIMISTIC_READ` foi praticado;
- `PESSIMISTIC_WRITE` foi praticado;
- `PESSIMISTIC_FORCE_INCREMENT` foi praticado;
- find com lock foi usado;
- lock em entidade managed foi usado;
- query com lock foi usada;
- entidade detached foi rejeitada;
- operação fora de transação foi testada;
- SQL de lock foi observado;
- variações do dialeto foram respeitadas;
- comparação integral de SQL foi evitada;
- duas conexões foram usadas;
- um manager por thread foi usado;
- manager não foi compartilhado;
- `CountDownLatch` coordenou as tarefas;
- `ExecutorService` foi encerrado;
- Future teve timeout externo;
- primeira transação adquiriu lock;
- segunda não concluiu antes da liberação;
- commit liberou o lock;
- rollback liberou o lock;
- timeout pessimista foi testado;
- hint `jakarta.persistence.lock.timeout` foi usado;
- suporte variável do hint foi documentado;
- `LockTimeoutException` foi reconhecida;
- `PessimisticLockException` foi reconhecida;
- rollback conservador foi aplicado;
- mensagem pública não expôs SQL;
- causa original foi preservada;
- versão foi incrementada por force increment;
- momento exato não foi rigidamente assumido;
- linhas diferentes foram bloqueadas independentemente;
- lock scope foi explicado;
- escopo NORMAL foi adotado;
- EXTENDED não foi presumido;
- transações curtas foram exigidas;
- chamadas externas dentro do lock foram proibidas;
- impacto no pool foi explicado;
- espera foi explicada;
- contenção foi explicada;
- deadlock foi definido;
- diferença entre timeout e deadlock foi explicada;
- ordem de aquisição inconsistente foi demonstrada;
- IDs ordenados evitaram ciclo;
- constraints permaneceram obrigatórias;
- lock não substituiu versão;
- critérios de uso pessimista foram documentados;
- critérios para evitar pessimista foram documentados;
- retry cego foi proibido;
- retry em nova transação foi explicado;
- testes de write lock foram criados;
- testes de read lock foram criados;
- testes de force increment foram criados;
- testes das APIs de aquisição foram criados;
- testes de timeout foram criados;
- testes de deadlock foram criados;
- teste do tradutor foi criado;
- fixtures foram removidas;
- nenhuma transação ficou aberta;
- estado final ficou vazio;
- auditoria não foi antecipada;
- Spring não foi usado;
- ponte para a aula 344 está correta;
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
  labs/m13/aula-343-lock-pessimista
```

Commit recomendado:

```powershell
git commit -m "feat(m13): controlar concorrencia com lock pessimista"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você reservou registros antes de operações críticas.

Aprendeu:

```text
PESSIMISTIC_READ:
leitura protegida.

PESSIMISTIC_WRITE:
reserva para escrita.

PESSIMISTIC_FORCE_INCREMENT:
reserva e incrementa versão.

find:
adquire lock na busca.

lock:
aplica em entidade managed.

query:
aplica em seleção.

timeout:
limita espera.

commit e rollback:
liberam lock.

ordem de aquisição:
reduz deadlock.
```

O laboratório comprovou:

```text
segunda transação bloqueada;

liberação por commit;

liberação por rollback;

timeout controlado;

três APIs de aquisição;

force increment;

independência de linhas diferentes;

risco de deadlock;

prevenção por ordem de IDs;

fechamento de managers, transactions e executor.
```

A decisão arquitetural foi:

```text
otimista:
padrão para conflitos raros.

pessimista:
operação curta e crítica.

timeout:
obrigatório.

pool:
recurso limitado.

deadlock:
prevenido por ordem consistente.

retry:
somente em nova transação e comando seguro.
```

A próxima aula será:

```text
344 - M13.34 - Auditoria CreatedAt UpdatedAt usuario
```

Nela, você aprenderá:

- diferença entre timestamp de negócio e auditoria;
- `createdAt`;
- `updatedAt`;
- `createdBy`;
- `updatedBy`;
- `@PrePersist`;
- `@PreUpdate`;
- listener de entidade;
- contexto de usuário;
- usuário técnico;
- operações sem usuário autenticado;
- relógio injetável;
- testes determinísticos;
- proteção de campos de criação;
- atualização automática;
- integração com entidades versionadas;
- limites de auditoria simples;
- diferença para histórico completo.

A aula 343 controlou quem pode alterar uma linha em determinado momento.

A aula 344 registrará quando e por quem cada alteração foi realizada.

---

# Material complementar

## Checkpoint final

- [ ] Usei os três modos pessimistas.
- [ ] Adquiri lock por find, lock e query.
- [ ] Coordenei duas transações sem compartilhar EntityManager.
- [ ] Testei espera, timeout, commit e rollback.
- [ ] Defini ordem consistente para reduzir deadlock.

---

## Troubleshooting adicional

### Segunda transacao nao bloqueou

Confirme transação ativa, mesma linha e modo incompatível.

### Teste ficou pendurado

Use timeout de Future, rollback e shutdown no finally.

### Hint de timeout nao foi exato

Ele é um hint e depende do provider e banco.

### Versao nao incrementou no force

Confirme entidade versionada, flush e commit.

### Deadlock apareceu em producao

Revise ordem dos locks, duração e quantidade de linhas.

---

## Perguntas de revisao

1. O que é lock pessimista?
2. Qual a diferença para otimista?
3. O lock exige transação?
4. O que faz PESSIMISTIC_WRITE?
5. O que faz PESSIMISTIC_READ?
6. O que faz FORCE_INCREMENT?
7. Como adquirir no find?
8. Como aplicar em managed?
9. Como aplicar em query?
10. Quando o lock é liberado?
11. O que significa esperar por lock?
12. Qual hint define timeout?
13. O hint é garantia exata?
14. EntityManager pode ser compartilhado entre threads?
15. O que é deadlock?
16. Como reduzir deadlock?
17. Lock substitui constraint?
18. Quando evitar pessimista?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Reserva no banco durante transação.
2. Um bloqueia antes; outro detecta depois.
3. Sim.
4. Reserva para escrita.
5. Protege leitura conforme suporte.
6. Bloqueia e incrementa versão.
7. Overload de find.
8. `entityManager.lock`.
9. `query.setLockMode`.
10. No commit ou rollback.
11. Outra transação mantém lock incompatível.
12. `jakarta.persistence.lock.timeout`.
13. Não.
14. Não.
15. Ciclo de espera.
16. Ordem consistente e transações curtas.
17. Não.
18. Em edição longa e conflito raro.
19. Não.
20. Auditoria CreatedAt UpdatedAt usuario.

---

## Desafio opcional

Crie:

```java
LockOrderPlanner
```

Entrada:

```text
IDs solicitados;

modo;

timeout;

operationName.
```

Saída:

```text
IDs únicos e ordenados;

plano de aquisição;

alertas;

relatório Markdown.
```

Regras:

- remover duplicados;
- ordenar crescentemente;
- rejeitar lista vazia;
- limitar quantidade de locks;
- não adquirir locks;
- não acessar banco;
- possuir testes unitários;
- não aceitar timeout negativo.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 343 - M13.33 - Lock pessimista

- Diferenciei lock otimista de pessimista.
- Entendi que o lock pessimista reserva a linha.
- Mantive `@Version` na entidade.
- Usei `PESSIMISTIC_READ`.
- Usei `PESSIMISTIC_WRITE`.
- Usei `PESSIMISTIC_FORCE_INCREMENT`.
- Adquiri lock com `find`.
- Apliquei lock em entidade managed.
- Apliquei lock em query.
- Confirmei a necessidade de transação ativa.
- Observei SQL de bloqueio.
- Evitei depender de uma cláusula exata do dialeto.
- Usei dois `EntityManager`.
- Mantive um manager por thread.
- Coordenei concorrência com `CountDownLatch`.
- Usei `ExecutorService`.
- Confirmei que a segunda transação esperou.
- Confirmei liberação por commit.
- Confirmei liberação por rollback.
- Usei `jakarta.persistence.lock.timeout`.
- Tratei `LockTimeoutException`.
- Tratei `PessimisticLockException`.
- Usei timeout externo no teste.
- Executei rollback conservador.
- Fechei todos os managers.
- Encerrei o executor.
- Observei incremento de versão com force increment.
- Testei locks em linhas diferentes.
- Entendi o risco de deadlock.
- Reproduzi ordem de aquisição oposta com proteção.
- Defini IDs crescentes como ordem oficial.
- Mantive transações curtas.
- Proibi chamadas externas enquanto o lock está ativo.
- Entendi impacto no pool.
- Criei tradução de falha sem expor SQL.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei auditoria.
- Próxima aula: Auditoria CreatedAt UpdatedAt usuario.
```

---

## Referencia tecnica curta

```text
PESSIMISTIC_READ:
leitura protegida.

PESSIMISTIC_WRITE:
reserva para escrita.

FORCE_INCREMENT:
lock e nova versão.

Transaction:
obrigatória.

Timeout:
espera limitada.

Commit:
libera.

Rollback:
libera.

Deadlock:
ciclo de espera.

Order:
IDs consistentes.

EntityManager:
um por thread.
```

Regra final:

```text
lock pessimista deve ser reservado para operacoes curtas e realmente criticas, sempre dentro de transacao, com timeout, rollback, um EntityManager por thread e ordem consistente de aquisicao; ele controla espera e exclusividade temporaria, mas nao substitui versao, constraints, integridade ou desenho correto do caso de uso.
```
