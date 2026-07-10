# 318 - M13.08 - Transacoes com JDBC commit rollback

## Apresentacao da aula

Na aula 317, você construiu uma fronteira de erros para a persistência JDBC.

O adaptador passou a:

```text
capturar SQLException;

classificar pelo SQLState;

preservar a causa;

lançar PersistenciaException;

manter JDBC fora da aplicação.
```

Agora o foco deixa de ser apenas uma instrução isolada.

Você trabalhará com uma unidade de negócio que exige duas alterações inseparáveis:

```text
atualizar o status da Ordem de Serviço;

registrar a transição no histórico.
```

Essas operações precisam produzir apenas dois resultados válidos:

```text
as duas alterações foram confirmadas;

nenhuma alteração permaneceu.
```

Não pode existir o estado:

```text
Ordem atualizada sem histórico.
```

Também não pode existir:

```text
histórico criado sem atualização da Ordem.
```

A ferramenta para garantir essa atomicidade é a transação.

No JDBC, uma transação pertence a uma `Connection`.

A sequência fundamental será:

```java
connection.setAutoCommit(false);

try {
    // primeira operação
    // segunda operação

    connection.commit();
} catch (Exception exception) {
    connection.rollback();
    throw exception;
}
```

Entretanto, uma implementação profissional precisa considerar mais detalhes:

- quem abre a conexão;
- onde começa a unidade de trabalho;
- quem compartilha a mesma conexão;
- quem chama `commit`;
- quando chamar `rollback`;
- o que acontece se o rollback falhar;
- como preservar a exceção original;
- como restaurar o estado da conexão;
- como fechar o recurso;
- como traduzir uma `SQLException`;
- como não mascarar uma falha de negócio;
- como testar commit e rollback de forma reproduzível.

Nesta aula, você criará:

```java
JdbcTransactionManager
```

Ele receberá uma função:

```java
TransactionWork<T>
```

e executará essa função dentro de uma transação JDBC.

Também criará:

```java
JdbcOrdemStatusRepository
```

Esse adaptador utilizará uma única conexão para:

1. bloquear e ler a Ordem;
2. validar a transição;
3. atualizar o status;
4. incrementar a versão;
5. inserir o histórico;
6. confirmar a transação.

A aplicação continuará sem conhecer `Connection`, commit, rollback, SQL ou `SQLException`. O caso de uso será `AlterarStatusOrdem`, apoiado pela porta `OrdemStatusRepository`.

O fluxo será:

```text
Main
    -> AlterarStatusOrdem
        -> OrdemStatusRepository
            -> JdbcOrdemStatusRepository
                -> JdbcTransactionManager
                    -> OrdemDao
                    -> OrdemStatusHistoricoDao
                    -> PostgreSQL.
```

O laboratório terá dois cenários principais.

Cenário de sucesso:

```text
Ordem 318901:
ABERTA -> AGENDADA.

UPDATE:
confirmado.

INSERT no histórico:
confirmado.

commit:
executado.
```

Cenário de falha:

```text
Ordem 318902:
UPDATE executado dentro da transação.

falha simulada antes do histórico.

rollback:
executado.

status final:
ABERTA.

novo histórico:
não existe.
```

Os IDs:

```text
318901;

318902.
```

são reservados para esta aula.

O seed oficial continuará com:

```text
6 Ordens;

12 eventos de histórico.
```

depois da execução completa.

A aula reutilizará o tratamento de erros da 317 e preservará falhas de commit, rollback, restauração e fechamento.

Falhas secundárias serão anexadas com `addSuppressed`, sem mascarar a causa principal.

Esta aula não introduzirá pool, retry automático, transação distribuída, mensageria transacional, JPA, Hibernate, Spring ou `@Transactional`.

A próxima aula será:

```text
319 - M13.09 - Connection pool e HikariCP conceitual
```

Nela, a restauração do estado da `Connection` se tornará ainda mais importante, porque `close()` poderá devolver uma conexão lógica ao pool em vez de encerrar imediatamente a conexão física.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection, DriverManager e DataSource conceitual.

313:
PreparedStatement e SQL Injection.

314:
ResultSet, mapeamento manual e tipos.

315:
DAO inicial.

316:
Repository Pattern sem Spring.

317:
tratamento de exceções JDBC.

318:
transações com commit e rollback.

319:
connection pool e HikariCP conceitual.

320 e 321:
mini projeto JDBC CRUD de Ordem de Serviço.
```

Até a aula 317, cada método JDBC podia abrir uma conexão, executar uma consulta e fechar o recurso de forma independente.

Agora a pergunta é:

```text
como várias operações compartilham a mesma conexão e formam uma única unidade atômica?
```

Nesta aula:

```text
autocommit:
desativado durante a unidade de trabalho.

commit:
sim.

rollback:
sim.

conexão compartilhada:
sim, somente dentro da transação.

isolamento:
READ_COMMITTED, sem alteração.

lock:
SELECT FOR UPDATE.

transação distribuída:
não.

pool:
não.

CRUD completo:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-318-transacoes-jdbc-commit-rollback
```

Estrutura final:

```text
labs
└── m13
    └── aula-318-transacoes-jdbc-commit-rollback
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-transacao-status.md
        │   ├── ciclo-commit-rollback.md
        │   ├── decisoes-transacionais.md
        │   └── troubleshooting-transacoes.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_transacoes.ps1
        │   └── 03_validar_estado_final.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula318
            │                           ├── Main.java
            │                           ├── application
            │                           │   ├── AlterarStatusOrdem.java
            │                           │   ├── AlterarStatusOrdemComando.java
            │                           │   ├── OrdemStatusRepository.java
            │                           │   ├── PersistenciaCategoria.java
            │                           │   ├── PersistenciaException.java
            │                           │   └── PersistenciaFalha.java
            │                           ├── domain
            │                           │   ├── OrdemNaoEncontradaException.java
            │                           │   ├── OrdemSnapshot.java
            │                           │   ├── OrdemStatus.java
            │                           │   └── TransicaoStatusInvalidaException.java
            │                           └── infrastructure
            │                               └── jdbc
            │                                   ├── Aula318Fixture.java
            │                                   ├── ConnectionProvider.java
            │                                   ├── ConnectionState.java
            │                                   ├── DatabaseSettings.java
            │                                   ├── DriverManagerConnectionProvider.java
            │                                   ├── JdbcExceptionTranslator.java
            │                                   ├── JdbcOrdemStatusRepository.java
            │                                   ├── JdbcTransactionManager.java
            │                                   ├── OrdemDao.java
            │                                   ├── OrdemStatusHistoricoDao.java
            │                                   └── TransactionWork.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula318
                                        ├── application
                                        │   └── AlterarStatusOrdemTest.java
                                        └── infrastructure
                                            └── jdbc
                                                ├── JdbcOrdemStatusRepositoryIT.java
                                                ├── JdbcTransactionManagerIT.java
                                                └── JdbcTransactionManagerTest.java
```

Resultados esperados:

```text
fixture 318901:
commit confirmado;
status AGENDADA;
versão 1;
dois eventos de histórico.

fixture 318902:
falha simulada;
rollback confirmado;
status ABERTA;
versão 0;
um evento de histórico.

estado final após limpeza:
6 Ordens;
12 históricos;
nenhum código OS-TX-318%.
```

---

## Conceito essencial

### Transacao e unidade de trabalho

Uma transação agrupa operações que devem ser tratadas como uma unidade.

No exemplo:

```text
UPDATE ordem_servico;

INSERT ordem_status_historico.
```

Se apenas o `UPDATE` permanecer, o estado atual e o histórico divergem.

Se apenas o `INSERT` permanecer, o histórico afirma uma transição que não aconteceu.

A transação garante atomicidade:

```text
tudo;

ou nada.
```

---

### ACID no contexto da aula

Atomicidade confirma status e histórico juntos; consistência mantém constraints e histórico coerentes; isolamento impede leitura de alterações não confirmadas; durabilidade preserva o resultado após o commit.

### Autocommit

Uma conexão JDBC começa normalmente com:

```java
connection.getAutoCommit()
```

igual a:

```text
true.
```

Nesse modo, cada instrução é confirmada automaticamente.

Exemplo perigoso:

```text
UPDATE:
commit automático.

INSERT:
falha.

resultado:
UPDATE permaneceu.
```

Para formar uma unidade:

```java
connection.setAutoCommit(false);
```

A partir daí, a aplicação precisa encerrar a transação explicitamente com:

```java
commit();

rollback().
```

---

### A transacao pertence a Connection

Não existe transação JDBC solta.

A mesma `Connection` precisa executar todas as instruções da unidade.

Errado:

```text
OrdemDao abre Connection A;

HistoricoDao abre Connection B;

service chama commit em Connection C.
```

Essas operações não compartilham transação.

Correto:

```text
TransactionManager abre Connection A;

OrdemDao recebe Connection A;

HistoricoDao recebe Connection A;

commit ocorre na Connection A.
```

Por isso, os DAOs desta aula terão métodos que recebem a conexão como parâmetro.

Eles não abrirão uma nova conexão durante a unidade de trabalho.

---

### Transaction manager

`JdbcTransactionManager` abre a conexão, captura o estado, desativa autocommit, executa o callback, confirma ou desfaz, restaura a conexão, fecha o recurso e traduz falhas JDBC. O protocolo não fica repetido nos repositórios.

### Callback transacional

A interface será:

```java
@FunctionalInterface
public interface TransactionWork<T> {

    T execute(Connection connection)
            throws SQLException;
}
```

O callback recebe a conexão ativa.

Ele não chama `commit`.

Ele não chama `rollback`.

Essas decisões pertencem ao transaction manager.

O callback contém somente operações da unidade de trabalho.

---

### Commit

`commit()` torna permanentes todas as alterações da unidade. Ele deve ocorrer uma única vez, somente depois de update e histórico concluírem; commits intermediários quebrariam a atomicidade.

### Rollback e falhas suprimidas

`rollback()` desfaz alterações não confirmadas quando SQL ou regra impedem a conclusão. Se o próprio rollback falhar, a falha principal continua sendo lançada e a secundária é anexada com `addSuppressed`, preservando ambas para diagnóstico.

### Falha de negocio

`OrdemNaoEncontradaException` e `TransicaoStatusInvalidaException` também provocam rollback, mas não são traduzidas como falhas JDBC. O manager relança a mesma `RuntimeException`, mantendo a distinção entre regra e infraestrutura.

### Estado da Connection

A conexão possui autocommit, read only e isolamento mutáveis. O laboratório captura e restaura esses valores antes do fechamento, preparando o código para conexões reutilizadas por pool.

### Fechar sem commit

Não dependa do fechamento para desfazer uma transação aberta. O código deve decidir explicitamente: commit no sucesso e rollback na falha.

### SELECT FOR UPDATE

A leitura usa `FOR UPDATE` para bloquear a Ordem até commit ou rollback. Isso evita alterações concorrentes na mesma linha durante a unidade; mantenha o lock pelo menor tempo possível.

### Validacao de transicao

O domínio permitirá:

```text
ABERTA -> AGENDADA;

ABERTA -> CANCELADA;

AGENDADA -> EM_ATENDIMENTO;

AGENDADA -> CANCELADA;

EM_ATENDIMENTO -> CONCLUIDA;

EM_ATENDIMENTO -> CANCELADA.
```

Estados finais:

```text
CONCLUIDA;

CANCELADA.
```

não avançam.

A validação ocorre depois do lock e antes do `UPDATE`.

---

### Versao

A coluna:

```text
versao
```

será incrementada:

```sql
versao = versao + 1
```

O snapshot bloqueado contém a versão anterior.

O `UPDATE` exige:

```sql
WHERE id = ?
  AND versao = ?
```

Se nenhuma linha for alterada, o código detecta inconsistência concorrente.

O lock já protege a linha no fluxo atual, mas a condição de versão documenta a expectativa e prepara práticas futuras.

---

### Historico na mesma transacao

Depois do `UPDATE`, o adapter insere:

```text
status_anterior;

status_novo;

ocorrido_em;

origem;

ator;

motivo.
```

Somente depois chama `commit`.

Se o insert falhar, o update será desfeito.

---

### Efeito externo nao participa

Rollback do PostgreSQL não desfaz email, mensagem, arquivo ou chamada HTTP. Não execute efeitos externos dentro da transação esperando atomicidade universal; integrações exigem padrões próprios, como outbox.

### Duracao curta

Evite entrada do usuário, API lenta, processamento grande ou pausas de debugger dentro da transação. Prepare dados antes, execute somente o necessário e encerre rapidamente para reduzir locks e recursos ocupados.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\src\main\java\br\com\formacao\m13\aula318\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\src\main\java\br\com\formacao\m13\aula318\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\src\main\java\br\com\formacao\m13\aula318\infrastructure\jdbc"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\src\test\java\br\com\formacao\m13\aula318\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-318-transacoes-jdbc-commit-rollback\src\test\java\br\com\formacao\m13\aula318\infrastructure\jdbc"

Set-Location `
  "labs\m13\aula-318-transacoes-jdbc-commit-rollback"
```

---

### 2. Reutilizar configuracao e tratamento de erros

Copie da aula 317 e ajuste os packages:

```text
.gitignore;

pom.xml;

config/database.local.env.example;

DatabaseSettings;

ConnectionProvider;

DriverManagerConnectionProvider;

PersistenciaCategoria;

PersistenciaFalha;

PersistenciaException;

JdbcExceptionTranslator.
```

Ajustes:

```text
artifactId:
aula-318-transacoes-jdbc.

JDBC_APPLICATION_NAME:
aula-318-transacoes.
```

O arquivo local continua ignorado.

---

### 3. Criar OrdemStatus.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula318/domain/OrdemStatus.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.domain;

import java.util.EnumSet;
import java.util.Set;

public enum OrdemStatus {
    ABERTA,
    AGENDADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA;

    public boolean podeTransicionarPara(
            OrdemStatus destino
    ) {
        if (destino == null) {
            return false;
        }

        Set<OrdemStatus> permitidos =
                switch (this) {
                    case ABERTA ->
                            EnumSet.of(
                                    AGENDADA,
                                    CANCELADA
                            );
                    case AGENDADA ->
                            EnumSet.of(
                                    EM_ATENDIMENTO,
                                    CANCELADA
                            );
                    case EM_ATENDIMENTO ->
                            EnumSet.of(
                                    CONCLUIDA,
                                    CANCELADA
                            );
                    case CONCLUIDA,
                         CANCELADA ->
                            EnumSet.noneOf(
                                    OrdemStatus.class
                            );
                };

        return permitidos.contains(destino);
    }
}
```

---

### 4. Criar OrdemSnapshot.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula318/domain/OrdemSnapshot.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.domain;

public record OrdemSnapshot(
        long id,
        OrdemStatus status,
        int versao
) {

    public OrdemSnapshot {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        if (status == null) {
            throw new IllegalArgumentException(
                    "status é obrigatório"
            );
        }

        if (versao < 0) {
            throw new IllegalArgumentException(
                    "versao não pode ser negativa"
            );
        }
    }
}
```

---

### 5. Criar excecoes de dominio

Crie:

```text
OrdemNaoEncontradaException.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.domain;

public final class OrdemNaoEncontradaException
        extends RuntimeException {

    public OrdemNaoEncontradaException(
            long ordemId
    ) {
        super(
                "Ordem não encontrada: "
                        + ordemId
        );
    }
}
```

Crie:

```text
TransicaoStatusInvalidaException.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.domain;

public final class TransicaoStatusInvalidaException
        extends RuntimeException {

    public TransicaoStatusInvalidaException(
            OrdemStatus origem,
            OrdemStatus destino
    ) {
        super(
                "Transição inválida: "
                        + origem
                        + " -> "
                        + destino
        );
    }
}
```

Essas falhas não são traduzidas como erro JDBC.

---

### 6. Criar AlterarStatusOrdemComando.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula318/application/AlterarStatusOrdemComando.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.application;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import br.com.formacao.m13.aula318.domain.OrdemStatus;

public record AlterarStatusOrdemComando(
        long ordemId,
        OrdemStatus novoStatus,
        LocalDate dataAgendada,
        OffsetDateTime ocorridoEm,
        String ator,
        String motivo
) {

    public AlterarStatusOrdemComando {
        if (ordemId <= 0) {
            throw new IllegalArgumentException(
                    "ordemId deve ser positivo"
            );
        }

        if (novoStatus == null) {
            throw new IllegalArgumentException(
                    "novoStatus é obrigatório"
            );
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException(
                    "ocorridoEm é obrigatório"
            );
        }

        if (ator == null || ator.isBlank()) {
            throw new IllegalArgumentException(
                    "ator é obrigatório"
            );
        }

        ator = ator.trim();

        if (
            novoStatus == OrdemStatus.AGENDADA
            && dataAgendada == null
        ) {
            throw new IllegalArgumentException(
                    "AGENDADA exige dataAgendada"
            );
        }
    }
}
```

---

### 7. Criar porta e caso de uso

Crie:

```text
application/OrdemStatusRepository.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.application;

public interface OrdemStatusRepository {

    void alterarStatus(
            AlterarStatusOrdemComando comando
    );
}
```

Crie:

```text
application/AlterarStatusOrdem.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.application;

import java.util.Objects;

public final class AlterarStatusOrdem {

    private final OrdemStatusRepository repository;

    public AlterarStatusOrdem(
            OrdemStatusRepository repository
    ) {
        this.repository =
                Objects.requireNonNull(
                        repository,
                        "repository é obrigatório"
                );
    }

    public void executar(
            AlterarStatusOrdemComando comando
    ) {
        Objects.requireNonNull(
                comando,
                "comando é obrigatório"
        );

        repository.alterarStatus(comando);
    }
}
```

A aplicação não conhece `Connection`.

---

### 8. Criar TransactionWork.java

Crie:

```text
infrastructure/jdbc/TransactionWork.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

@FunctionalInterface
public interface TransactionWork<T> {

    T execute(
            Connection connection
    ) throws SQLException;
}
```

---

### 9. Criar ConnectionState.java

Crie:

```text
infrastructure/jdbc/ConnectionState.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

record ConnectionState(
        boolean autoCommit,
        boolean readOnly,
        int isolation
) {

    static ConnectionState capture(
            Connection connection
    ) throws SQLException {
        return new ConnectionState(
                connection.getAutoCommit(),
                connection.isReadOnly(),
                connection.getTransactionIsolation()
        );
    }
}
```

---

### 10. Criar JdbcTransactionManager.java

Crie:

```text
infrastructure/jdbc/JdbcTransactionManager.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Objects;

public final class JdbcTransactionManager {

    private final ConnectionProvider connectionProvider;
    private final JdbcExceptionTranslator translator;

    public JdbcTransactionManager(
            ConnectionProvider connectionProvider,
            JdbcExceptionTranslator translator
    ) {
        this.connectionProvider =
                Objects.requireNonNull(
                        connectionProvider,
                        "connectionProvider é obrigatório"
                );

        this.translator =
                Objects.requireNonNull(
                        translator,
                        "translator é obrigatório"
                );
    }

    public <T> T execute(
            String operation,
            TransactionWork<T> work
    ) {
        if (
            operation == null
            || operation.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "operation é obrigatória"
            );
        }

        Objects.requireNonNull(
                work,
                "work é obrigatório"
        );

        Connection connection = null;
        ConnectionState originalState = null;
        Throwable primaryFailure = null;

        try {
            connection =
                    connectionProvider.open();

            originalState =
                    ConnectionState.capture(
                            connection
                    );

            if (!originalState.autoCommit()) {
                throw new IllegalStateException(
                        "Provider devolveu conexão "
                                + "já transacional"
                );
            }

            connection.setReadOnly(false);
            connection.setAutoCommit(false);

            T result =
                    work.execute(connection);

            connection.commit();

            return result;
        } catch (SQLException exception) {
            primaryFailure = exception;

            rollbackAndSuppress(
                    connection,
                    exception
            );

            throw translator.translate(
                    operation,
                    exception
            );
        } catch (RuntimeException | Error exception) {
            primaryFailure = exception;

            rollbackAndSuppress(
                    connection,
                    exception
            );

            throw exception;
        } finally {
            SQLException cleanupFailure =
                    restoreAndClose(
                            connection,
                            originalState
                    );

            if (cleanupFailure != null) {
                if (primaryFailure != null) {
                    primaryFailure.addSuppressed(
                            cleanupFailure
                    );
                } else {
                    throw translator.translate(
                            operation
                                    + " - finalizar conexão",
                            cleanupFailure
                    );
                }
            }
        }
    }

    private static void rollbackAndSuppress(
            Connection connection,
            Throwable primary
    ) {
        if (connection == null) {
            return;
        }

        try {
            if (!connection.isClosed()) {
                connection.rollback();
            }
        } catch (SQLException rollbackFailure) {
            primary.addSuppressed(
                    rollbackFailure
            );
        }
    }

    private static SQLException restoreAndClose(
            Connection connection,
            ConnectionState state
    ) {
        if (connection == null) {
            return null;
        }

        SQLException failure = null;

        try {
            if (!connection.isClosed() && state != null) {
                connection.setTransactionIsolation(
                        state.isolation()
                );
                connection.setReadOnly(
                        state.readOnly()
                );
                connection.setAutoCommit(
                        state.autoCommit()
                );
            }
        } catch (SQLException restoreFailure) {
            failure = restoreFailure;
        }

        try {
            connection.close();
        } catch (SQLException closeFailure) {
            if (failure == null) {
                failure = closeFailure;
            } else {
                failure.addSuppressed(
                        closeFailure
                );
            }
        }

        return failure;
    }
}
```

---

### 11. Criar OrdemDao.java

Crie:

```text
infrastructure/jdbc/OrdemDao.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;

import br.com.formacao.m13.aula318.domain.OrdemSnapshot;
import br.com.formacao.m13.aula318.domain.OrdemStatus;

public final class OrdemDao {

    private static final String LOCK_BY_ID = """
            SELECT
                ordem.id,
                ordem.status,
                ordem.versao
            FROM projeto_os_final.ordem_servico
                AS ordem
            WHERE ordem.id = ?
            FOR UPDATE
            """;

    private static final String UPDATE_STATUS = """
            UPDATE projeto_os_final.ordem_servico
            SET
                status = ?,
                data_agendada = ?,
                concluida_em = ?,
                versao = versao + 1,
                atualizado_em = ?
            WHERE id = ?
              AND versao = ?
            """;

    public Optional<OrdemSnapshot> lockById(
            Connection connection,
            long ordemId
    ) throws SQLException {
        try (
            PreparedStatement statement =
                    connection.prepareStatement(
                            LOCK_BY_ID
                    )
        ) {
            statement.setLong(1, ordemId);

            try (
                ResultSet resultSet =
                        statement.executeQuery()
            ) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }

                OrdemSnapshot snapshot =
                        new OrdemSnapshot(
                                resultSet.getLong("id"),
                                OrdemStatus.valueOf(
                                        resultSet.getString(
                                                "status"
                                        )
                                ),
                                resultSet.getInt(
                                        "versao"
                                )
                        );

                if (resultSet.next()) {
                    throw new IllegalStateException(
                            "ID retornou mais "
                                    + "de uma Ordem"
                    );
                }

                return Optional.of(snapshot);
            }
        }
    }

    public void updateStatus(
            Connection connection,
            OrdemSnapshot current,
            OrdemStatus newStatus,
            LocalDate scheduledDate,
            OffsetDateTime occurredAt
    ) throws SQLException {
        try (
            PreparedStatement statement =
                    connection.prepareStatement(
                            UPDATE_STATUS
                    )
        ) {
            statement.setString(
                    1,
                    newStatus.name()
            );

            if (scheduledDate == null) {
                statement.setNull(
                        2,
                        java.sql.Types.DATE
                );
            } else {
                statement.setObject(
                        2,
                        scheduledDate
                );
            }

            if (newStatus == OrdemStatus.CONCLUIDA) {
                statement.setObject(
                        3,
                        occurredAt
                );
            } else {
                statement.setNull(
                        3,
                        java.sql.Types
                                .TIMESTAMP_WITH_TIMEZONE
                );
            }

            statement.setObject(
                    4,
                    occurredAt
            );
            statement.setLong(
                    5,
                    current.id()
            );
            statement.setInt(
                    6,
                    current.versao()
            );

            int affected =
                    statement.executeUpdate();

            if (affected != 1) {
                throw new SQLException(
                        "Atualização concorrente "
                                + "ou Ordem ausente",
                        "40001"
                );
            }
        }
    }
}
```

O DAO recebe a conexão transacional.

---

### 12. Criar OrdemStatusHistoricoDao.java

Crie:

```text
infrastructure/jdbc/OrdemStatusHistoricoDao.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.OffsetDateTime;

import br.com.formacao.m13.aula318.domain.OrdemStatus;

public final class OrdemStatusHistoricoDao {

    private static final String INSERT = """
            INSERT INTO
                projeto_os_final.ordem_status_historico (
                    ordem_servico_id,
                    status_anterior,
                    status_novo,
                    ocorrido_em,
                    origem,
                    ator,
                    motivo
                )
            VALUES (?, ?, ?, ?, 'API', ?, ?)
            """;

    public void insert(
            Connection connection,
            long ordemId,
            OrdemStatus previousStatus,
            OrdemStatus newStatus,
            OffsetDateTime occurredAt,
            String actor,
            String reason
    ) throws SQLException {
        try (
            PreparedStatement statement =
                    connection.prepareStatement(
                            INSERT
                    )
        ) {
            statement.setLong(1, ordemId);
            statement.setString(
                    2,
                    previousStatus.name()
            );
            statement.setString(
                    3,
                    newStatus.name()
            );
            statement.setObject(
                    4,
                    occurredAt
            );
            statement.setString(
                    5,
                    actor
            );

            if (
                reason == null
                || reason.isBlank()
            ) {
                statement.setNull(
                        6,
                        java.sql.Types.VARCHAR
                );
            } else {
                statement.setString(
                        6,
                        reason.trim()
                );
            }

            int affected =
                    statement.executeUpdate();

            if (affected != 1) {
                throw new SQLException(
                        "Histórico não inserido",
                        "HY000"
                );
            }
        }
    }
}
```

---

### 13. Criar JdbcOrdemStatusRepository.java

Crie:

```text
infrastructure/jdbc/JdbcOrdemStatusRepository.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula318.infrastructure.jdbc;

import java.util.Objects;

import br.com.formacao.m13.aula318.application.AlterarStatusOrdemComando;
import br.com.formacao.m13.aula318.application.OrdemStatusRepository;
import br.com.formacao.m13.aula318.domain.OrdemNaoEncontradaException;
import br.com.formacao.m13.aula318.domain.OrdemSnapshot;
import br.com.formacao.m13.aula318.domain.TransicaoStatusInvalidaException;

public final class JdbcOrdemStatusRepository
        implements OrdemStatusRepository {

    private final JdbcTransactionManager transactionManager;
    private final OrdemDao ordemDao;
    private final OrdemStatusHistoricoDao historicoDao;

    public JdbcOrdemStatusRepository(
            JdbcTransactionManager transactionManager,
            OrdemDao ordemDao,
            OrdemStatusHistoricoDao historicoDao
    ) {
        this.transactionManager =
                Objects.requireNonNull(
                        transactionManager,
                        "transactionManager é obrigatório"
                );
        this.ordemDao =
                Objects.requireNonNull(
                        ordemDao,
                        "ordemDao é obrigatório"
                );
        this.historicoDao =
                Objects.requireNonNull(
                        historicoDao,
                        "historicoDao é obrigatório"
                );
    }

    @Override
    public void alterarStatus(
            AlterarStatusOrdemComando comando
    ) {
        transactionManager.execute(
                "alterar status da Ordem",
                connection -> {
                    OrdemSnapshot current =
                            ordemDao
                                    .lockById(
                                            connection,
                                            comando.ordemId()
                                    )
                                    .orElseThrow(
                                            () ->
                                                    new OrdemNaoEncontradaException(
                                                            comando.ordemId()
                                                    )
                                    );

                    if (
                        !current.status()
                                .podeTransicionarPara(
                                        comando.novoStatus()
                                )
                    ) {
                        throw new TransicaoStatusInvalidaException(
                                current.status(),
                                comando.novoStatus()
                        );
                    }

                    ordemDao.updateStatus(
                            connection,
                            current,
                            comando.novoStatus(),
                            comando.dataAgendada(),
                            comando.ocorridoEm()
                    );

                    historicoDao.insert(
                            connection,
                            current.id(),
                            current.status(),
                            comando.novoStatus(),
                            comando.ocorridoEm(),
                            comando.ator(),
                            comando.motivo()
                    );

                    return null;
                }
        );
    }
}
```

O commit ocorre somente depois do insert do histórico.

---

### 14. Criar Aula318Fixture.java

Crie:

```text
infrastructure/jdbc/Aula318Fixture.java
```

Essa classe é didática e será usada pelo `Main` e pelos testes de integração.

Ela deve oferecer:

```java
void prepare();

void cleanup();

OrdemSnapshot read(long id);

long historyCount(long id).
```

Use os IDs:

```text
318901;
318902.
```

Cada fixture deve possuir:

```text
cliente_id:
307004.

produto_id:
307104.

status:
ABERTA.

prioridade:
NORMAL.

versao:
0.

metadados:
{"aula":318}.
```

Códigos:

```text
OS-TX-318-COMMIT;

OS-TX-318-ROLLBACK.
```

A preparação deve ocorrer em uma transação:

1. limpar apenas códigos `OS-TX-318-%`;
2. inserir as duas Ordens;
3. inserir um histórico inicial `NULL -> ABERTA`;
4. confirmar.

A limpeza deve:

1. excluir históricos das Ordens reservadas;
2. excluir as Ordens;
3. confirmar.

Nunca remova registros fora do prefixo reservado.

---

### 15. Criar Main.java

O `Main` deve:

1. montar provider, tradutor, transaction manager, DAOs e fixture;
2. executar `fixture.prepare()`;
3. alterar `318901` para `AGENDADA`;
4. ler e imprimir status, versão e histórico;
5. iniciar uma transação manual pelo manager para `318902`;
6. atualizar a Ordem;
7. lançar uma `SQLException` simulada com SQLState `08006`;
8. capturar `PersistenciaException`;
9. confirmar que `318902` continua `ABERTA`;
10. executar `fixture.cleanup()` em `finally`;
11. confirmar contagens oficiais.

Trecho do rollback didático:

```java
try {
    transactionManager.execute(
            "demonstrar rollback",
            connection -> {
                OrdemSnapshot current =
                        ordemDao
                                .lockById(
                                        connection,
                                        318902L
                                )
                                .orElseThrow();

                ordemDao.updateStatus(
                        connection,
                        current,
                        OrdemStatus.AGENDADA,
                        LocalDate.of(
                                2026,
                                7,
                                20
                        ),
                        OffsetDateTime.parse(
                                "2026-07-10T14:00:00-03:00"
                        )
                );

                throw new SQLException(
                        "Falha simulada depois do UPDATE",
                        "08006"
                );
            }
    );
} catch (PersistenciaException exception) {
    System.out.printf(
            "rollback classificado: %s%n",
            exception.falha().categoria()
    );
}
```

Ela existe para provar o rollback.

---

### 16. Criar AlterarStatusOrdemTest.java

Use um fake de `OrdemStatusRepository` para validar:

- comando é delegado;
- comando nulo é rejeitado;
- aplicação não importa JDBC;
- nenhuma checked exception é necessária.

O teste não usa PostgreSQL.

---

### 17. Criar JdbcOrdemStatusRepositoryIT.java

No `@BeforeEach`:

```text
fixture.prepare.
```

No `@AfterEach`:

```text
fixture.cleanup.
```

Teste de commit:

1. executar `ABERTA -> AGENDADA` na Ordem `318901`;
2. abrir nova conexão para verificar;
3. esperar `status=AGENDADA`;
4. esperar `versao=1`;
5. esperar dois históricos;
6. esperar último histórico `ABERTA -> AGENDADA`.

Teste de transição inválida:

1. transformar `318901` em AGENDADA;
2. tentar `AGENDADA -> CONCLUIDA`;
3. esperar `TransicaoStatusInvalidaException`;
4. confirmar que status continua AGENDADA;
5. confirmar que não apareceu terceiro histórico.

---

### 18. Criar JdbcTransactionManagerIT.java

Teste de rollback:

1. preparar `318902`;
2. executar callback;
3. bloquear Ordem;
4. atualizar para AGENDADA;
5. lançar `SQLException("falha", "08006")`;
6. esperar `PersistenciaException`;
7. confirmar categoria `CONEXAO`;
8. abrir nova conexão;
9. confirmar `ABERTA`;
10. confirmar `versao=0`;
11. confirmar um histórico.

Teste de runtime:

1. atualizar dentro da transação;
2. lançar `IllegalStateException`;
3. esperar a mesma exceção;
4. confirmar rollback.

Teste de commit:

1. atualizar e inserir histórico no mesmo callback;
2. retornar um valor;
3. confirmar valor retornado;
4. confirmar persistência após nova conexão.

---

### 19. Criar JdbcTransactionManagerTest.java

Use `Proxy` para simular uma `Connection`.

Cenário:

```text
callback lança SQLException principal;

rollback lança SQLException secundária.
```

Valide:

```text
PersistenciaException é lançada;

causa é a SQLException principal;

causa possui uma exceção suprimida;

a suprimida é a falha de rollback.
```

Outro cenário:

```text
commit funciona;

close falha.
```

Valide que a falha de fechamento é traduzida.

O teste é unitário e não usa banco.

---

### 20. Criar scripts

`01_verificar_pre_requisitos.ps1` deve validar:

```text
Java;

Maven;

container;

porta 5433;

6 Ordens;

12 históricos;

ausência de OS-TX-318-%.
```

`02_executar_transacoes.ps1` deve:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

Sempre limpar variáveis no `finally`.

`03_validar_estado_final.ps1` deve consultar:

```sql
SELECT
    (SELECT count(*)
     FROM projeto_os_final.ordem_servico) = 6
AND
    (SELECT count(*)
     FROM projeto_os_final.ordem_status_historico) = 12
AND NOT EXISTS (
    SELECT 1
    FROM projeto_os_final.ordem_servico
    WHERE codigo LIKE 'OS-TX-318-%'
);
```

O resultado deve ser:

```text
t.
```

---

### 21. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_transacoes.ps1
.\scripts\03_validar_estado_final.ps1
```

Confirme:

```text
commit tornou update e histórico visíveis;

rollback removeu update parcial;

nova conexão observou somente dados confirmados;

runtime exception também provocou rollback;

falha secundária ficou suprimida;

fixtures foram removidas;

seed permaneceu intacto.
```

---

### 22. Criar contrato-transacao-status.md

Documente:

```text
operação:
alterar status da Ordem.

entrada:
AlterarStatusOrdemComando.

recursos:
uma Connection.

ordem:
lock, validação, update, histórico, commit.

sucesso:
status e histórico persistidos.

falha:
rollback integral.

isolamento:
READ_COMMITTED.

lock:
FOR UPDATE.

dados externos:
não participam.
```

Inclua as transições válidas.

---

### 23. Criar ciclo-commit-rollback.md

Desenhe:

```text
abrir;
capturar estado;
setAutoCommit(false);
executar;
commit;
restaurar;
fechar.
```

Caminho de falha:

```text
executar;
falhar;
rollback;
traduzir ou relançar;
restaurar;
fechar.
```

Explique `suppressed`.

---

### 24. Criar decisoes-transacionais.md

Registre:

1. uma conexão por unidade de trabalho;
2. transaction manager controla limite;
3. DAOs recebem conexão;
4. callback não chama commit;
5. rollback em `SQLException`;
6. rollback em runtime;
7. causa principal preservada;
8. restauração de estado;
9. lock `FOR UPDATE`;
10. fixtures reservadas e limpas;
11. sem efeitos externos;
12. sem pool nesta aula.

---

### 25. Criar troubleshooting-transacoes.md

Inclua:

#### Update permaneceu depois da falha

Verifique `setAutoCommit(false)` e se as operações usaram a mesma conexão.

#### Historico foi confirmado sozinho

Existe commit intermediário ou conexão diferente.

#### Rollback nao ocorre em regra de negocio

O manager precisa capturar `RuntimeException`.

#### Connection already closed

Algum DAO fechou a conexão recebida.

DAOs transacionais fecham statements e result sets, não a conexão.

#### Transaction is aborted

Uma instrução falhou e a transação precisa de rollback antes de continuar.

#### Dados de fixture permaneceram

Execute `03_validar_estado_final.ps1` e a limpeza reservada.

Nunca apague registros fora de `OS-TX-318-%`.

---

## Entendendo o que foi feito

### O limite transacional ficou centralizado

Casos de uso e DAOs não repetem o protocolo de commit e rollback.

---

### A mesma conexao percorreu toda a unidade

Update e histórico participaram da mesma sessão e da mesma transação.

---

### Commit e rollback foram comprovados

A verificação ocorreu por uma nova conexão, evitando confundir dados ainda visíveis apenas na sessão atual.

---

### Falhas secundarias nao mascararam a principal

Rollback, restauração e fechamento podem aparecer em `getSuppressed()`.

---

### O estado da conexao foi restaurado

A prática prepara a próxima aula sobre pool.

---

## Erros comuns importantes

### Abrir conexao dentro de cada DAO

As operações deixam de compartilhar a transação.

### Chamar commit no meio

O rollback não consegue desfazer o que já foi confirmado.

### Engolir falha de rollback

Ela deve ser preservada como suprimida.

### Usar close como rollback

A decisão deve ser explícita.

### Chamar API externa dentro da transacao

O banco não desfaz esse efeito.

---

## Comandos uteis

### Testes unitarios

```powershell
mvn clean test
```

### Integracao

```powershell
mvn verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Estado final

```powershell
.\scripts\03_validar_estado_final.ps1
```

---

## Exercicio guiado

### Parte 1 — Concluir Ordem

Adicione suporte a:

```text
EM_ATENDIMENTO -> CONCLUIDA.
```

Regras:

- `concluida_em` recebe `ocorridoEm`;
- histórico é criado;
- data de conclusão não pode ser anterior à abertura;
- commit somente após as duas operações.

Use fixture exclusiva `318903` e limpe ao final.

---

### Parte 2 — Falha no historico

Crie um `OrdemStatusHistoricoDao` de teste que lança:

```java
new SQLException(
        "Falha simulada no histórico",
        "08006"
);
```

Execute o repository.

Confirme que o update da Ordem sofreu rollback.

Não adicione flag de simulação ao código principal.

---

### Parte 3 — Runtime depois do update

Dentro de um callback didático:

1. atualize;
2. lance `IllegalStateException`;
3. confirme rollback;
4. confirme que a exceção não virou `PersistenciaException`.

Explique a diferença entre falha técnica e regra.

---

### Parte 4 — Read your writes

Dentro da mesma transação:

1. atualize a Ordem;
2. consulte novamente pela mesma conexão;
3. observe AGENDADA;
4. antes do commit, consulte por outra conexão;
5. observe ABERTA;
6. execute commit;
7. consulte novamente pela outra conexão;
8. observe AGENDADA.

Mantenha o teste curto para não segurar locks.

---

### Parte 5 — Savepoint opcional

Pesquise:

```java
connection.setSavepoint();
```

Crie uma demonstração isolada com fixture reservada.

Não use savepoint no fluxo principal.

Explique que savepoint desfaz parte da transação, mas não substitui um limite transacional bem definido.

---

### Parte 6 — Restauracao

Use proxy de `Connection` para validar a ordem:

```text
setAutoCommit(false);

commit ou rollback;

restaurar isolation;

restaurar readOnly;

restaurar autoCommit;

close.
```

Registre chamadas em lista e compare.

---

### Parte 7 — Falha no commit

Simule `commit()` lançando `SQLException` com SQLState `08006`.

Confirme:

- rollback é tentado;
- exceção é traduzida;
- causa é preservada;
- conexão é fechada.

---

### Parte 8 — Efeito externo

Escreva uma análise:

```text
por que enviar email antes do commit é perigoso?

por que enviar depois do commit também pode falhar?

qual problema um outbox resolve?
```

Não implemente outbox nesta aula.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade oficial;
- o laboratório oficial da aula 318 existe;
- a continuidade com a aula 317 foi preservada;
- projeto Maven usa Java 21;
- driver PostgreSQL permanece fixado;
- configuração real está fora do Git;
- tratamento de exceções da aula 317 foi reutilizado;
- `OrdemStatus` foi criado;
- transições válidas foram definidas;
- `OrdemSnapshot` foi criado;
- comando foi validado;
- aplicação não importa `java.sql`;
- `OrdemStatusRepository` não expõe conexão;
- `TransactionWork` foi criado;
- `ConnectionState` foi criado;
- `JdbcTransactionManager` foi criado;
- estado original foi capturado;
- autocommit foi desativado;
- callback recebeu a conexão;
- commit ocorreu somente após sucesso;
- rollback ocorreu em `SQLException`;
- rollback ocorreu em `RuntimeException`;
- `Error` também não deixa transação aberta;
- falha de rollback foi suprimida;
- falha de restauração foi preservada;
- falha de fechamento foi preservada;
- conexão foi fechada;
- DAOs transacionais receberam conexão;
- DAOs não fecharam a conexão;
- statements foram fechados;
- result sets foram fechados;
- Ordem foi bloqueada com `FOR UPDATE`;
- versão foi validada;
- versão foi incrementada;
- status foi atualizado;
- histórico foi inserido;
- update e histórico compartilharam conexão;
- commit persistiu as duas operações;
- falha após update desfez a alteração;
- nova conexão confirmou o rollback;
- ausência foi diferenciada de falha;
- transição inválida provocou rollback;
- fixture 318901 foi usada;
- fixture 318902 foi usada;
- dados didáticos foram limpos;
- seed terminou com seis Ordens;
- seed terminou com doze históricos;
- nenhuma Ordem `OS-TX-318-%` permaneceu;
- testes unitários foram criados;
- testes de integração foram criados;
- falha de rollback suprimida foi testada;
- nenhuma API externa foi chamada;
- nenhum retry foi criado;
- nenhum pool foi criado;
- nenhum Spring foi usado;
- nenhum JPA ou Hibernate foi usado;
- ponte para a aula 319 está correta;
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
config/database.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-318-transacoes-jdbc-commit-rollback
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): controlar transacoes jdbc com commit e rollback"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
unidade de trabalho;

autocommit false;

commit;

rollback;

conexão compartilhada;

histórico atômico;

falhas suprimidas;

estado restaurado.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você criou uma unidade transacional JDBC completa.

Aprendeu que:

```text
a transação pertence à Connection;

autocommit confirma cada instrução isoladamente;

setAutoCommit(false) transfere o controle à aplicação;

commit confirma toda a unidade;

rollback desfaz alterações não confirmadas;

DAOs precisam compartilhar a mesma conexão;

callback não controla o limite;

falha de negócio também exige rollback;

falha de rollback deve ser preservada;

estado da conexão precisa ser restaurado;

efeitos externos não participam da transação PostgreSQL.
```

O laboratório comprovou:

```text
UPDATE e histórico confirmados juntos;

falha depois do UPDATE desfez tudo;

nova conexão observou somente dados confirmados;

fixtures foram removidas;

seed oficial permaneceu intacto.
```

A próxima aula será:

```text
319 - M13.09 - Connection pool e HikariCP conceitual
```

Nela, você vai estudar:

- custo de abrir conexão;
- conexão física e lógica;
- pool;
- `DataSource`;
- HikariCP;
- tamanho mínimo e máximo;
- timeout de aquisição;
- idle timeout;
- max lifetime;
- leak detection;
- health checks;
- métricas;
- fechamento como devolução;
- restauração de estado;
- saturação;
- configuração local;
- cuidados em produção.

O transaction manager desta aula será reutilizado sobre conexões obtidas de um pool.

---

# Material complementar

## Checkpoint final

- [ ] Usei uma única conexão por unidade de trabalho.
- [ ] Desativei autocommit antes das alterações.
- [ ] Confirmei update e histórico com um único commit.
- [ ] Comprovei rollback após uma falha intermediária.
- [ ] Restaurei e fechei a conexão sem mascarar a falha principal.

---

## Troubleshooting adicional

### Cannot commit when autoCommit is enabled

A conexão não foi configurada antes do callback.

### Current transaction is aborted

Uma instrução falhou.

Execute rollback antes de reutilizar a conexão.

### UPDATE retorna zero

A versão mudou, o ID não existe ou o estado foi alterado por outro fluxo.

### Processo fica aguardando

Investigue lock aberto por outra sessão.

Não mantenha debugger parado dentro da transação.

### Dados aparecem na mesma conexao, mas nao em outra

A transação ainda não recebeu commit.

---

## Perguntas de revisao

1. O que é uma transação?
2. A qual objeto JDBC ela pertence?
3. Qual é o estado padrão de autocommit?
4. O que faz `setAutoCommit(false)`?
5. O que faz `commit()`?
6. O que faz `rollback()`?
7. Por que os DAOs recebem a mesma conexão?
8. O callback deve chamar commit?
9. O que acontece em runtime exception?
10. Rollback pode falhar?
11. Como preservar falha secundária?
12. Para que capturar estado da conexão?
13. O que faz `FOR UPDATE`?
14. Quando o lock termina?
15. Por que incrementar versão?
16. Fechar substitui rollback explícito?
17. Email é desfeito pelo rollback?
18. Por que manter a transação curta?
19. Pool foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Unidade atômica de operações.
2. `Connection`.
3. `true`.
4. Entrega o limite à aplicação.
5. Confirma alterações.
6. Desfaz alterações não confirmadas.
7. Para participar da mesma transação.
8. Não.
9. O manager tenta rollback e relança.
10. Sim.
11. Com `addSuppressed`.
12. Evitar contaminar o próximo uso.
13. Bloqueia a linha selecionada.
14. No commit ou rollback.
15. Detectar expectativa concorrente.
16. Não.
17. Não.
18. Reduz locks e recursos ocupados.
19. Não.
20. Connection pool e HikariCP conceitual.

---

## Desafio opcional

Crie:

```java
TransactionObserver
```

Eventos:

```text
OPENED;

STARTED;

COMMITTED;

ROLLED_BACK;

RESTORED;

CLOSED.
```

Implemente um observer em memória para testes.

Regras:

- não registrar SQL;
- não registrar parâmetros;
- não registrar senha;
- não alterar comportamento da transação;
- observer padrão no-op;
- testes de ordem dos eventos;
- falha do observer não pode confirmar ou desfazer a transação.

O objetivo é preparar observabilidade sem misturá-la ao protocolo transacional.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 318 - M13.08 - Transacoes com JDBC commit rollback

- Entendi transação como unidade atômica.
- Reforcei atomicidade, consistência, isolamento e durabilidade.
- Entendi que a transação pertence à `Connection`.
- Diferenciei autocommit de controle manual.
- Usei `setAutoCommit(false)`.
- Criei `TransactionWork`.
- Criei `ConnectionState`.
- Criei `JdbcTransactionManager`.
- Centralizei abertura, commit, rollback, restauração e fechamento.
- Executei rollback em `SQLException`.
- Executei rollback em `RuntimeException`.
- Preservei falhas secundárias com `addSuppressed`.
- Reutilizei a tradução de exceções da aula 317.
- Mantive JDBC fora da aplicação.
- Criei uma porta para alteração de status.
- Modelei transições válidas de Ordem.
- Usei `SELECT FOR UPDATE`.
- Compartilhei a mesma conexão entre DAOs.
- Atualizei status e versão.
- Registrei histórico na mesma transação.
- Confirmei as duas operações com um único commit.
- Simulei falha depois do update.
- Comprovei rollback por nova conexão.
- Restaurei estado da conexão.
- Limpei as fixtures reservadas.
- Preservei seis Ordens e doze históricos oficiais.
- Não implementei pool, retry ou Spring.
- Próxima aula: connection pool e HikariCP conceitual.
```

---

## Referencia tecnica curta

```text
Transaction:
unidade de trabalho.

autoCommit:
confirmação por instrução.

commit:
confirma alterações.

rollback:
desfaz alterações pendentes.

Connection:
dona da transação.

TransactionWork:
callback com conexão compartilhada.

TransactionManager:
controla o protocolo.

FOR UPDATE:
lock da linha.

suppressed:
falha secundária preservada.

restore:
limpa estado antes do próximo uso.
```

Regra final:

```text
uma transacao JDBC correta usa uma unica Connection, confirma apenas depois de todas as operacoes, desfaz qualquer falha e preserva tanto a causa principal quanto os problemas secundarios de rollback e fechamento.
```
