# 342 - M13.32 - Lock otimista

## Apresentacao da aula

Na aula 341, você criou paginação e ordenação com contratos próprios.

A leitura passou a possuir:

```text
PageRequest;

PageResult<T>;

consulta de conteúdo;

consulta de total;

ordenação estável;

desempate por ID;

projection imutável.
```

Essa estrutura torna uma listagem previsível.

Entretanto, previsibilidade de leitura não impede conflito de escrita.

Considere dois usuários abrindo a mesma Ordem de Serviço:

```text
Usuário A:
carrega a Ordem na versão 0.

Usuário B:
carrega a mesma Ordem na versão 0.
```

O usuário A altera a descrição:

```text
"Instalação confirmada."
```

O usuário B altera o status:

```text
"AGENDADA."
```

Se as duas atualizações forem executadas sem controle de concorrência, a última gravação pode sobrescrever parte do trabalho anterior.

Esse problema é conhecido como:

```text
lost update;
atualização perdida.
```

Nesta aula, você implementará controle de concorrência otimista com:

```java
@Version
```

A entidade terá uma coluna:

```text
versao.
```

Quando for carregada:

```text
versão em memória:
0.
```

Ao atualizar, o Hibernate gerará um comando conceitualmente equivalente a:

```sql
UPDATE jpa_342.ordem_servico
SET
    descricao = ?,
    versao = 1
WHERE id = ?
  AND versao = 0;
```

A cláusula:

```text
AND versao = 0
```

significa:

```text
atualize somente se ninguém
modificou essa linha desde a leitura.
```

Se outra transação já alterou a linha, a versão no banco será diferente.

O update afetará:

```text
zero linhas.
```

O provider reconhecerá o conflito e lançará uma exceção otimista.

O laboratório trabalhará com:

```text
OptimisticLockException;

RollbackException;

@Version;

flush explícito;

rollback obrigatório;

merge de entidade detached obsoleta;

remoção concorrente;

tradução para erro de aplicação;

retry consciente;

atualização JDBC compatível com versão.
```

A abordagem é chamada otimista porque não bloqueia a linha durante todo o período de edição.

Ela assume:

```text
conflitos são possíveis,
mas não são o caso dominante.
```

Quando o conflito ocorre, a aplicação:

1. interrompe a gravação;
2. desfaz a transação;
3. recarrega o estado atual;
4. informa o usuário ou reaplica um comando seguro;
5. nunca sobrescreve silenciosamente.

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
formacao_java_jpa_342
```

O schema será:

```text
jpa_342
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade principal será:

```text
OrdemServicoEntity.
```

O laboratório comprovará:

```text
persist inicial:
versão 0.

primeira atualização:
versão 1.

duas transações na versão 1:
somente a primeira confirma.

segunda atualização:
OptimisticLockException no flush.

transação conflitante:
rollback.

recarregamento:
estado vencedor preservado.

merge detached obsoleto:
conflito.

delete concorrente:
conflito.

entidades diferentes:
sem conflito.

JDBC com versão:
controle preservado.

JDBC ignorando versão:
proteção do ORM pode ser contornada.

estado final:
zero OS-JPA-342-%.
```

A próxima aula será:

```text
343 - M13.33 - Lock pessimista
```

Por isso, esta aula não aprofundará:

- `PESSIMISTIC_READ`;
- `PESSIMISTIC_WRITE`;
- `PESSIMISTIC_FORCE_INCREMENT`;
- `SELECT FOR UPDATE`;
- timeout de lock;
- deadlock;
- ordem de aquisição de locks;
- filas de transações bloqueadas;
- Spring Retry;
- transações declarativas.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
340:
Projections DTO interface e record.

341:
Paginacao e ordenacao com JPA.

342:
Lock otimista.

343:
Lock pessimista.

344:
Auditoria CreatedAt UpdatedAt usuario.
```

A aula 341 tratou:

```text
consistência do resultado de leitura.
```

A aula 342 tratará:

```text
consistência da gravação concorrente.
```

Nesta aula:

```text
@Version:
sim.

lost update:
sim.

dois EntityManagers:
sim.

duas transações:
sim.

flush:
sim.

OptimisticLockException:
sim.

RollbackException:
sim.

merge detached:
sim.

delete concorrente:
sim.

retry:
critério, não automação cega.

lock pessimista:
não.

Spring:
não.
```

A arquitetura do conflito será:

```text
EntityManager A
    -> Ordem ID 342101 versão 0.

EntityManager B
    -> Ordem ID 342101 versão 0.

A confirma:
versão 1.

B tenta confirmar:
WHERE versão = 0;
zero linhas;
conflito.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-342-lock-otimista
```

Estrutura final:

```text
labs
└── m13
    └── aula-342-lock-otimista
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-versionamento.md
        │   ├── fluxo-conflito-otimista.md
        │   ├── politica-traducao-conflito.md
        │   ├── politica-retry.md
        │   ├── integracao-jdbc-versionada.md
        │   └── troubleshooting-lock-otimista.md
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
            │   │                   └── aula342
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── exception
            │   │                       │   ├── ConcurrentOrderUpdateException.java
            │   │                       │   └── OptimisticConflictTranslator.java
            │   │                       ├── lab
            │   │                       │   ├── OptimisticLockLab.java
            │   │                       │   ├── OptimisticLockObservation.java
            │   │                       │   └── OptimisticLockReport.java
            │   │                       ├── jdbc
            │   │                       │   └── VersionedJdbcOrderUpdater.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_342.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula342
                                        ├── VersionMappingIT.java
                                        ├── ConcurrentUpdateIT.java
                                        ├── DetachedMergeConflictIT.java
                                        ├── ConcurrentDeleteIT.java
                                        ├── VersionedJdbcIntegrationIT.java
                                        ├── OptimisticConflictTranslatorTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
versão inicial:
0.

após update:
1.

dois leitores da versão 1:
A confirma versão 2;
B falha.

estado final da disputa:
alteração de A.

merge stale:
rejeitado.

delete stale:
rejeitado.

rollback:
executado em todo conflito.

mensagem de aplicação:
não expõe SQL.

JDBC versionado:
incrementa e verifica versão.

limpeza:
zero fixtures.
```

---

## Conceito essencial

### O problema de lost update

Sem versão, dois fluxos podem executar:

```text
A lê descrição antiga.

B lê descrição antiga.

A grava descrição A.

B grava descrição B.
```

O banco aceita as duas atualizações.

O resultado final contém apenas B.

A alteração A foi perdida sem erro.

O lock otimista transforma esse silêncio em conflito explícito.

---

### @Version

A annotation será:

```java
@Version
@Column(
        name = "versao",
        nullable = false
)
private int versao;
```

A entidade pode possuir apenas um atributo versionado.

A aplicação não deve alterar esse campo manualmente.

O provider controla:

- valor inicial;
- comparação;
- incremento;
- verificação em update;
- verificação em delete.

---

### SQL versionado

O update conceitual é:

```sql
UPDATE ordem_servico
SET
    descricao = ?,
    versao = ?
WHERE id = ?
  AND versao = ?;
```

O valor antigo participa do `WHERE`.

O novo valor participa do `SET`.

A quantidade de linhas afetadas decide se existe conflito.

---

### Conflito por zero linhas

Quando o update afeta zero linhas, existem possibilidades:

- a linha foi atualizada por outra transação;
- a linha foi removida;
- a versão foi alterada por outro sistema;
- o ID não existe mais.

Para a unidade de trabalho, todas representam:

```text
o estado usado para gravar não é mais atual.
```

---

### Momento da excecao

A verificação ocorre quando o SQL é executado.

Isso pode acontecer:

- em `flush`;
- antes de uma consulta que provoque flush;
- no commit;
- durante `merge`, conforme o provider e o estado.

O laboratório chamará:

```java
entityManager.flush();
```

para tornar o ponto de falha determinístico.

Sem flush explícito, o commit pode lançar:

```text
RollbackException
```

com uma `OptimisticLockException` na cadeia de causas.

---

### Rollback obrigatorio

Depois de uma falha de persistência:

```text
não continue usando a transação.
```

Fluxo:

```java
try {
    transaction.begin();

    // alterações

    entityManager.flush();
    transaction.commit();
} catch (RuntimeException exception) {
    if (
        transaction.isActive()
    ) {
        transaction.rollback();
    }

    throw exception;
}
```

Depois do conflito, feche o `EntityManager`.

Não tente “consertar” a mesma instância managed dentro da transação marcada para rollback.

---

### Dois EntityManagers

O persistence context é isolado por `EntityManager`.

Para simular concorrência:

```text
manager A:
carrega versão 0.

manager B:
carrega versão 0.
```

Os dois mantêm snapshots independentes.

O pool terá tamanho suficiente para manter as duas transações.

---

### Sequencia deterministica

O teste não precisa de threads.

Sequência:

1. iniciar transação A;
2. iniciar transação B;
3. A carrega a Ordem;
4. B carrega a Ordem;
5. A altera;
6. B altera;
7. A executa flush e commit;
8. B executa flush;
9. B recebe conflito;
10. B executa rollback.

As duas leituras ocorreram antes da primeira confirmação.

Isso reproduz o estado obsoleto.

---

### Estado vencedor

Depois do conflito, abra um terceiro manager.

Busque a Ordem.

Confirme:

```text
alteração de A presente;

alteração de B ausente;

versão incrementada uma vez.
```

O objetivo não é escolher A por prioridade.

Apenas comprovar:

```text
a primeira confirmação venceu;
a segunda não sobrescreveu.
```

---

### Merge de entidade detached

Cenário:

1. manager A carrega Ordem versão 0;
2. manager A fecha;
3. a Ordem fica detached;
4. manager B atualiza a linha para versão 1;
5. manager C tenta `merge` da instância versão 0;
6. conflito é detectado.

O provider pode detectar:

- durante o merge;
- durante o flush;
- no commit.

O teste procura a exceção otimista na cadeia de causas.

---

### Merge nao remove o conflito

`merge` não significa:

```text
force o estado detached sobre o banco.
```

A versão detached precisa ser compatível.

Isso protege formulários antigos, mensagens atrasadas e objetos armazenados em sessão.

---

### Delete concorrente

A verificação de versão também se aplica à remoção.

Cenário:

1. A e B carregam versão 0;
2. A atualiza e confirma versão 1;
3. B tenta remover sua instância versão 0;
4. delete com versão antiga afeta zero linhas;
5. conflito.

Isso evita remover uma entidade que mudou depois da decisão do usuário.

---

### Remocao anterior

Outro cenário:

1. A e B carregam a linha;
2. A remove e confirma;
3. B tenta atualizar;
4. update afeta zero linhas;
5. conflito.

A aplicação pode traduzir isso para:

```text
a Ordem foi alterada ou removida por outro processo.
```

Não prometa distinguir as duas situações sem consulta adicional.

---

### LockModeType.OPTIMISTIC

JPA também permite solicitar explicitamente:

```java
entityManager.lock(
        ordem,
        LockModeType.OPTIMISTIC
);
```

ou buscar com esse modo.

Em entidade versionada, isso solicita verificação otimista na transação.

Para atualizações normais, `@Version` já oferece a verificação necessária.

O laboratório registra o recurso, mas não o transforma em chamada obrigatória em todo update.

---

### OPTIMISTIC_FORCE_INCREMENT

Existe:

```java
LockModeType.OPTIMISTIC_FORCE_INCREMENT
```

Ele solicita incremento da versão mesmo sem alteração comum da entidade.

Pode ser útil quando:

- a raiz precisa registrar mudança indireta;
- uma filha muda e a versão da raiz deve refletir o agregado;
- um caso de uso quer reservar uma nova versão lógica.

O momento exato do incremento é controlado pelo provider.

O fluxo principal não utilizará esse modo.

---

### Agregado e versao da raiz

Atualizar uma Atividade não incrementa automaticamente a versão da Ordem apenas porque existe uma associação.

Se o conflito precisa ser controlado no nível do agregado, alternativas incluem:

- alterar também a raiz;
- usar force increment;
- versionar cada entidade relevante;
- redesenhar a fronteira transacional.

Essa decisão depende do domínio.

---

### Retry consciente

Um retry pode ser seguro quando a operação é:

- idempotente;
- reexecutável;
- baseada em comando;
- independente do estado antigo;
- limitada em tentativas;
- observável.

Exemplo possível:

```text
incrementar contador técnico
com regra reaplicável.
```

Um retry pode ser perigoso quando:

- representa edição humana;
- sobrescreve texto;
- depende de decisão feita sobre estado antigo;
- dispara evento externo;
- cobra pagamento;
- envia mensagem.

No laboratório, o conflito será informado.

Não haverá retry automático.

---

### Recarregar e reaplicar

Fluxo de resolução manual:

1. capturar conflito;
2. rollback;
3. abrir novo contexto;
4. carregar versão atual;
5. comparar com os dados enviados;
6. informar diferenças;
7. usuário decide;
8. executar nova transação.

Não reutilize a entidade stale como se estivesse atual.

---

### Traducao de excecao

A camada de aplicação não deve expor:

```text
org.hibernate.StaleObjectStateException;

SQL;

nome da tabela;

stack trace.
```

Crie:

```java
ConcurrentOrderUpdateException
```

Mensagem:

```text
A Ordem foi alterada ou removida por outro processo.
Recarregue os dados antes de tentar novamente.
```

Preserve a causa para logs internos.

---

### Cadeia de causas

O tradutor percorrerá:

```java
Throwable.getCause()
```

e procurará:

```text
OptimisticLockException.
```

Também pode reconhecer exceções específicas do Hibernate somente na infraestrutura.

O contrato da aplicação permanecerá baseado em Jakarta Persistence.

---

### Atualizacao JDBC versionada

Outro sistema que atualiza a mesma tabela precisa respeitar o protocolo.

SQL correto:

```sql
UPDATE jpa_342.ordem_servico
SET
    descricao = ?,
    versao = versao + 1,
    atualizada_em = CURRENT_TIMESTAMP
WHERE id = ?
  AND versao = ?;
```

Depois:

```text
linhas afetadas 1:
sucesso.

linhas afetadas 0:
conflito.
```

---

### JDBC ignorando versao

SQL perigoso:

```sql
UPDATE jpa_342.ordem_servico
SET descricao = ?
WHERE id = ?;
```

Ele pode alterar a linha sem incrementar `versao`.

O ORM não consegue detectar corretamente uma mudança que não participa do protocolo.

A proteção otimista é um contrato de todos os escritores da tabela.

---

### Bulk update JPQL

Operações bulk como:

```java
update OrdemServico o
set o.status = :status
```

não seguem o dirty checking normal de cada entidade e podem ignorar o mecanismo esperado se a versão não for tratada explicitamente.

Elas também não sincronizam automaticamente entidades já managed.

O laboratório não usará bulk update.

---

### Versao no cliente externo

Uma API futura pode receber:

```text
id;

versao;

campos editados.
```

A versão precisa ser validada de forma segura.

Entretanto, não basta comparar na aplicação e depois executar update sem versão.

A verificação deve permanecer atômica no SQL.

O `@Version` oferece essa atomicidade no ORM.

---

### Isolamento e lock otimista

O lock otimista não substitui o isolamento do banco.

Ele resolve uma classe importante de conflito de atualização por versão.

Ainda existem outros problemas:

- leitura fantasma;
- invariantes entre múltiplas linhas;
- concorrência em agregados;
- unicidade;
- reservas;
- contadores;
- ordem de eventos.

A escolha entre otimista e pessimista depende do caso.

---

### Quando usar otimista

É uma boa escolha quando:

- conflitos são raros;
- leituras são frequentes;
- edição pode durar segundos ou minutos;
- não se deseja manter lock físico durante a interação;
- a entidade possui versão;
- o conflito pode ser informado ou reaplicado.

---

### Quando avaliar outra estrategia

Avalie lock pessimista quando:

- conflito é frequente;
- a operação precisa reservar a linha;
- perder a disputa é muito caro;
- o fluxo é curto;
- bloqueio é aceitável;
- espera e timeout são tratados.

A próxima aula aprofundará essa decisão.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\java\br\com\formacao\m13\aula342\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\java\br\com\formacao\m13\aula342\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\java\br\com\formacao\m13\aula342\exception"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\java\br\com\formacao\m13\aula342\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\java\br\com\formacao\m13\aula342\jdbc"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\java\br\com\formacao\m13\aula342\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-342-lock-otimista\src\test\java\br\com\formacao\m13\aula342"

Set-Location `
  "labs\m13\aula-342-lock-otimista"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 341.

Ajuste:

```text
artifactId:
aula-342-lock-otimista.

persistence unit:
aula342PU.

Main:
br.com.formacao.m13.aula342.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_342
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-342-jpa
JPA_POOL_NAME=aula-342-pool
JPA_POOL_SIZE=4
```

O pool precisa comportar os managers concorrentes do laboratório.

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_342;

CREATE SEQUENCE jpa_342.ordem_servico_id_seq
    START WITH 342101
    INCREMENT BY 1;

CREATE TABLE jpa_342.ordem_servico (
    id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    descricao varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criada_em timestamptz NOT NULL,
    atualizada_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_342_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_342_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_342_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_jpa_342_ordem_versao
        CHECK (versao >= 0)
);

CREATE INDEX idx_jpa_342_ordem_status
    ON jpa_342.ordem_servico (
        status
    );
```

Não crie trigger para incrementar a versão.

O Hibernate controlará o fluxo JPA.

O cliente JDBC terá update explícito.

---

### 4. Criar OrdemServicoEntity.java

Mapeamento:

```java
@Entity(name = "OrdemServico")
@Table(
        name = "ordem_servico",
        schema = "jpa_342"
)
public class OrdemServicoEntity {
```

Versionamento:

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
public void alterarDescricao(
        String novaDescricao,
        OffsetDateTime agora
)

public void alterarStatus(
        String novoStatus,
        OffsetDateTime agora
)

public Long getId()

public String getCodigo()

public String getDescricao()

public String getStatus()

public int getVersao()
```

Não crie setter de versão.

---

### 5. Criar persistence.xml e runtime

Use:

```text
aula342PU;

RESOURCE_LOCAL;

shared-cache-mode NONE;

hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true.
```

Liste somente:

```text
OrdemServicoEntity.
```

Reutilize HikariCP e o inspector.

---

### 6. Evoluir SqlCaptureInspector

Adicione contadores:

```java
updateCount();

deleteCount();

selectCount();

versionedUpdateCount();

versionedDeleteCount();
```

Para identificar SQL versionado, normalize e procure:

```text
versao
```

no `WHERE`.

Não registre parâmetros.

---

### 7. Criar OptimisticLockObservation.java

```java
package br.com.formacao.m13.aula342.lab;

public record OptimisticLockObservation(
        String scenario,
        int versionReadByA,
        int versionReadByB,
        int finalVersion,
        boolean firstCommitSucceeded,
        boolean secondOperationConflicted,
        boolean rollbackExecuted,
        long versionedUpdates,
        long versionedDeletes
) {

    public OptimisticLockObservation {
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

### 8. Criar OptimisticLockReport.java

```java
package br.com.formacao.m13.aula342.lab;

import java.util.List;

public record OptimisticLockReport(
        List<OptimisticLockObservation> observations,
        boolean initialVersionWasZero,
        boolean versionIncrementedOnUpdate,
        boolean concurrentUpdateWasRejected,
        boolean winningStateWasPreserved,
        boolean staleMergeWasRejected,
        boolean staleDeleteWasRejected,
        boolean differentRowsDidNotConflict,
        boolean versionedJdbcWorked,
        boolean unsafeJdbcWasDocumented,
        boolean conflictWasTranslated
) {

    public OptimisticLockReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar fixture inicial

Persista:

```text
OS-JPA-342-MAIN.
```

Descrição:

```text
Ordem base da aula 342.
```

Status:

```text
ABERTA.
```

Depois do flush, confirme:

```text
ID preenchido;

versão 0.
```

Commit e feche o manager.

---

### 10. Provar incremento simples

Abra novo manager e transação.

Busque a Ordem.

Confirme:

```text
versão 0.
```

Altere a descrição.

Limpe inspector.

Flush.

Confirme:

```text
um UPDATE versionado;

versão em memória 1.
```

Commit.

Abra outro manager e confirme versão 1 no banco.

---

### 11. Preparar duas transacoes

Crie:

```text
EntityManager managerA;

EntityManager managerB;

EntityTransaction transactionA;

EntityTransaction transactionB.
```

Inicie as duas transações.

Busque a mesma Ordem nos dois managers antes de qualquer update.

Confirme:

```text
ordemA != ordemB;

mesmo ID;

versão A 1;

versão B 1.
```

---

### 12. Confirmar a primeira atualizacao

No manager A:

```java
ordemA.alterarDescricao(
        "Alteração vencedora da transação A",
        agoraA
);
```

Execute:

```java
managerA.flush();
transactionA.commit();
```

Confirme:

```text
versão de ordemA:
2.
```

Não feche B antes da tentativa conflitante.

---

### 13. Rejeitar a segunda atualizacao

No manager B:

```java
ordemB.alterarStatus(
        "AGENDADA",
        agoraB
);
```

Execute:

```java
managerB.flush();
```

Espere uma exceção otimista.

No catch:

```java
if (
    transactionB.isActive()
) {
    transactionB.rollback();
}
```

Confirme:

```text
rollback executado;

manager B fechado;

nenhum commit B.
```

---

### 14. Confirmar estado vencedor

Abra manager C.

Busque a Ordem.

Confirme:

```text
descrição da transação A;

status anterior preservado;

versão 2.
```

A alteração de B não pode aparecer.

---

### 15. Testar conflito no commit

Repita o cenário sem chamar flush em B.

Execute:

```java
transactionB.commit();
```

Aceite:

```text
RollbackException
```

com conflito otimista na cadeia de causas.

Garanta rollback quando ainda aplicável e feche o manager.

O teste principal continuará usando flush para localizar a falha.

---

### 16. Testar entidade detached stale

Abra manager A.

Busque a Ordem versão atual.

Feche o manager.

A entidade fica detached.

Abra manager B.

Atualize a mesma Ordem e confirme nova versão.

Altere a entidade detached antiga.

Abra manager C.

Execute:

```java
OrdemServicoEntity managed =
        managerC.merge(
                detached
        );

managerC.flush();
```

Espere conflito durante merge, flush ou commit.

Faça rollback e feche manager C.

Confirme que o banco mantém o estado de B.

---

### 17. Testar delete stale

Abra managers A e B.

Ambos carregam a Ordem na mesma versão.

A atualiza e confirma.

B executa:

```java
managerB.remove(
        ordemB
);

managerB.flush();
```

Espere conflito.

Rollback.

Confirme que a Ordem continua existente.

---

### 18. Testar update depois de delete

Crie fixture separada:

```text
OS-JPA-342-DELETE.
```

A e B carregam.

A remove e confirma.

B altera e executa flush.

Espere conflito.

Confirme que a linha permanece removida.

Esse cenário usa fixture separada para não destruir a Ordem principal.

---

### 19. Testar linhas diferentes

Crie:

```text
OS-JPA-342-A;

OS-JPA-342-B.
```

Manager A atualiza a primeira.

Manager B atualiza a segunda.

Confirme ambas as transações.

Resultado:

```text
zero conflito;

cada versão incrementada.
```

---

### 20. Criar ConcurrentOrderUpdateException.java

```java
package br.com.formacao.m13.aula342.exception;

public final class ConcurrentOrderUpdateException
        extends RuntimeException {

    private final Long orderId;

    public ConcurrentOrderUpdateException(
            Long orderId,
            Throwable cause
    ) {
        super(
                "A Ordem foi alterada ou removida "
                + "por outro processo. "
                + "Recarregue os dados.",
                cause
        );

        this.orderId = orderId;
    }

    public Long getOrderId() {
        return orderId;
    }
}
```

Não inclua SQL na mensagem.

---

### 21. Criar OptimisticConflictTranslator.java

```java
package br.com.formacao.m13.aula342.exception;

import jakarta.persistence.OptimisticLockException;

public final class OptimisticConflictTranslator {

    public RuntimeException translate(
            Long orderId,
            RuntimeException exception
    ) {
        if (containsOptimisticConflict(
                exception
        )) {
            return new ConcurrentOrderUpdateException(
                    orderId,
                    exception
            );
        }

        return exception;
    }

    public boolean containsOptimisticConflict(
            Throwable throwable
    ) {
        Throwable current = throwable;

        while (current != null) {
            if (
                current
                        instanceof OptimisticLockException
            ) {
                return true;
            }

            current = current.getCause();
        }

        return false;
    }
}
```

Não traduza qualquer erro de banco como concorrência.

---

### 22. Criar VersionedJdbcOrderUpdater.java

Método seguro:

```java
public boolean updateDescription(
        long orderId,
        int expectedVersion,
        String description,
        OffsetDateTime now
)
```

SQL:

```sql
UPDATE jpa_342.ordem_servico
SET
    descricao = ?,
    atualizada_em = ?,
    versao = versao + 1
WHERE id = ?
  AND versao = ?
```

Retorno:

```text
true:
uma linha.

false:
zero linhas.
```

Se afetar mais de uma linha, lance erro de integridade.

---

### 23. Testar JDBC versionado

Carregue ID e versão atuais.

Execute update JDBC com a versão correta.

Confirme:

```text
true;

descrição atualizada;

versão incrementada.
```

Execute novamente com a versão antiga.

Confirme:

```text
false;

zero alteração.
```

Isso reproduz o protocolo otimista fora do ORM.

---

### 24. Demonstrar JDBC inseguro

Em teste isolado e com rollback ou fixture descartável, execute:

```sql
UPDATE jpa_342.ordem_servico
SET descricao = ?
WHERE id = ?
```

Confirme que:

```text
descrição muda;

versão não muda.
```

Documente:

```text
essa operação viola o contrato.
```

Restaure a fixture por update versionado ou recriação.

O código oficial não deve oferecer esse método em produção.

---

### 25. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `OptimisticLockLab`;
4. imprime observações;
5. imprime decisões;
6. remove fixtures;
7. não imprime SQL completo;
8. fecha runtime.

Formato:

```text
cenário | versão A | versão B | final | primeiro commit | conflito | rollback
```

---

### 26. Criar VersionMappingIT.java

Valide por reflection:

```text
existe exatamente um @Version;

tipo int;

coluna versao;

nullable false;

sem setter público.
```

Teste persist:

```text
versão inicial 0.
```

Teste update:

```text
incrementa para 1.
```

---

### 27. Criar ConcurrentUpdateIT.java

Casos:

#### Dois leitores

- managers distintos;
- mesma versão;
- instâncias diferentes.

#### Primeira gravação

- flush e commit;
- versão incrementada.

#### Segunda gravação

- flush falha;
- conflito encontrado;
- rollback executado.

#### Estado final

- vencedor preservado;
- perdedor ausente.

#### Commit sem flush

- exceção direta ou `RollbackException`;
- causa otimista encontrada.

---

### 28. Criar DetachedMergeConflictIT.java

Casos:

#### Detached atual

- carregar;
- fechar;
- merge sem concorrência;
- sucesso.

#### Detached stale

- carregar;
- outra transação atualizar;
- merge;
- conflito;
- rollback.

#### Retorno do merge

No caso de sucesso, use o retorno managed.

Não use a instância detached como managed.

---

### 29. Criar ConcurrentDeleteIT.java

Casos:

#### Delete stale

- update concorrente vence;
- delete antigo falha.

#### Update depois de delete

- delete vence;
- update antigo falha.

#### Delete atual

- versão atual;
- remoção bem-sucedida.

Use fixtures independentes.

---

### 30. Criar VersionedJdbcIntegrationIT.java

Casos:

#### Versão correta

- uma linha;
- incremento.

#### Versão antiga

- zero linhas;
- conflito retornado.

#### JPA depois do JDBC seguro

- manager novo carrega nova versão.

#### JDBC inseguro

- demonstração controlada;
- versão não muda;
- documentação marca violação.

---

### 31. Criar OptimisticConflictTranslatorTest.java

Casos:

- `OptimisticLockException` direta;
- `RollbackException` com causa otimista;
- cadeia com múltiplas causas;
- erro não otimista retorna original;
- mensagem pública sem SQL;
- orderId preservado.

Esse teste não usa banco.

---

### 32. Criar TestDataCleaner.java

```sql
DELETE FROM jpa_342.ordem_servico
WHERE codigo LIKE 'OS-JPA-342-%';
```

Use antes e depois de cada teste.

---

### 33. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_342.
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
zero OS-JPA-342-%;

coluna versao integer not null;

constraint versao >= 0;

índice de status;

schema history com V1.
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
versão inicial 0;

update incrementou;

conflito concorrente detectado;

rollback executado;

estado vencedor preservado;

merge stale rejeitado;

delete stale rejeitado;

linhas diferentes sem conflito;

JDBC versionado respeitou o protocolo;

JDBC inseguro foi identificado;

tradução de exceção funcionou;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 35. Criar documentacao

`contrato-versionamento.md` deve registrar:

- coluna;
- tipo;
- valor inicial;
- incremento;
- update;
- delete;
- proibição de setter;
- todos os escritores.

`fluxo-conflito-otimista.md` deve desenhar:

```text
A lê v0;

B lê v0;

A grava v1;

B tenta v0;

zero linhas;

rollback.
```

`politica-traducao-conflito.md` deve registrar:

- exceções reconhecidas;
- cadeia de causas;
- mensagem pública;
- causa preservada;
- status futuro da API;
- ausência de SQL.

`politica-retry.md` deve comparar:

```text
edição humana;

comando idempotente;

efeito externo;

número máximo;

recarregamento;

observabilidade.
```

`integracao-jdbc-versionada.md` deve registrar:

- versão esperada;
- incremento atômico;
- row count;
- conflito;
- proibição de update sem versão;
- integração com outros serviços.

`troubleshooting-lock-otimista.md` deve cobrir:

- versão não incrementa;
- setter manual;
- update sem `WHERE versao`;
- conflito somente no commit;
- manager reutilizado após falha;
- merge stale;
- bulk update;
- JDBC inseguro;
- filho não incrementa raiz;
- conflito frequente.

---

## Entendendo o que foi feito

### A atualizacao perdida virou erro

A segunda gravação não sobrescreveu silenciosamente a primeira.

### A versao participou do SQL

O valor lido foi comparado atomicamente no update e no delete.

### O rollback ficou obrigatorio

A transação conflitante não continuou depois da falha.

### Detached nao ignorou concorrencia

O merge de estado antigo também respeitou a versão.

### O contrato passou a incluir todos os escritores

JPA e JDBC precisaram incrementar e verificar a mesma coluna.

---

## Erros comuns importantes

### Criar setter para versao

O provider deve controlar o valor.

### Capturar conflito e continuar

A transação precisa de rollback.

### Fazer retry cego

A regra pode depender do estado antigo.

### Atualizar por JDBC sem versao

Isso contorna a proteção otimista.

### Achar que @Version bloqueia a linha

Ele detecta conflito; não mantém lock físico.

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

### Consultar versoes

```sql
SELECT
    id,
    codigo,
    descricao,
    status,
    versao,
    atualizada_em
FROM jpa_342.ordem_servico
WHERE codigo LIKE 'OS-JPA-342-%'
ORDER BY codigo;
```

---

## Exercicio guiado

### Parte 1 — Conflito de descricao

Faça A e B alterarem o mesmo campo.

Confirme que somente A vence.

### Parte 2 — Campos diferentes

Faça A alterar descrição e B alterar status.

Confirme que ainda existe conflito.

O controle é por versão da linha, não por coluna.

### Parte 3 — Retry manual

Depois do conflito:

1. recarregue;
2. reaplique somente um comando seguro;
3. confirme nova versão.

Documente por que esse retry é aceitável.

### Parte 4 — Force increment

Em branch experimental, use:

```java
LockModeType.OPTIMISTIC_FORCE_INCREMENT
```

Observe a versão sem alteração comum.

Não mantenha no fluxo oficial.

### Parte 5 — Filho e raiz

Modele conceitualmente uma Atividade versionada.

Explique se a alteração da filha deve incrementar a Ordem.

Registre a decisão de agregado.

### Parte 6 — Bulk update

Em base descartável, execute bulk JPQL.

Observe versão e persistence context.

Documente por que requer política explícita.

### Parte 7 — API futura

Desenhe um request:

```text
ordemId;

versaoEsperada;

novaDescricao.
```

Explique por que a comparação final precisa ocorrer no SQL.

### Parte 8 — ADR

Registre:

```text
@Version obrigatória em entidades editáveis;

sem setter de versão;

flush explícito em testes;

rollback e fechamento após conflito;

retry somente para comandos seguros;

JDBC deve respeitar versão;

conflitos frequentes exigem reavaliação.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 342 existe;
- continuidade com a aula 341 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_342` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `OrdemServicoEntity` foi criada;
- coluna `versao` foi criada;
- versão foi `integer not null`;
- constraint de versão não negativa foi criada;
- `@Version` foi aplicado;
- existe somente um atributo versionado;
- setter público de versão não existe;
- valor inicial foi observado;
- primeira atualização incrementou versão;
- update versionado foi observado;
- versão antiga apareceu no `WHERE`;
- nova versão apareceu no `SET`;
- lost update foi explicado;
- dois EntityManagers foram usados;
- duas transações foram abertas;
- as duas leram a mesma versão;
- primeira transação confirmou;
- segunda transação falhou;
- `flush` explícito localizou o conflito;
- `OptimisticLockException` foi reconhecida;
- `RollbackException` com causa otimista foi reconhecida;
- rollback foi obrigatório;
- manager conflitante foi fechado;
- estado vencedor foi preservado;
- estado perdedor não foi gravado;
- versão final foi validada;
- entidades diferentes não conflitaram;
- merge detached atual funcionou;
- merge detached stale falhou;
- retorno managed do merge foi usado;
- delete stale falhou;
- update depois de delete falhou;
- delete atual funcionou;
- tradução de exceção foi criada;
- mensagem pública não expôs SQL;
- causa original foi preservada;
- retry cego foi proibido;
- retry consciente foi explicado;
- recarregamento foi explicado;
- `LockModeType.OPTIMISTIC` foi apresentado;
- `OPTIMISTIC_FORCE_INCREMENT` foi apresentado sem adoção;
- versão da raiz e filhos foi discutida;
- JDBC versionado foi implementado;
- JDBC verificou versão esperada;
- JDBC incrementou versão;
- row count zero representou conflito;
- JDBC inseguro foi demonstrado como violação;
- todos os escritores da tabela foram responsabilizados;
- bulk update foi tratado como risco;
- isolamento foi diferenciado de versionamento;
- critérios de uso otimista foram documentados;
- critérios para avaliar pessimista foram documentados;
- SQL foi observado sem bindings;
- testes de mapping foram criados;
- testes concorrentes foram criados;
- testes de merge foram criados;
- testes de delete foram criados;
- testes JDBC foram criados;
- testes do tradutor foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- lock pessimista não foi antecipado;
- auditoria não foi antecipada;
- Spring não foi usado;
- ponte para a aula 343 está correta;
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
  labs/m13/aula-342-lock-otimista
```

Commit recomendado:

```powershell
git commit -m "feat(m13): proteger atualizacoes com lock otimista"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você protegeu entidades contra atualização perdida.

Aprendeu:

```text
@Version:
controle de concorrência.

versão lida:
estado esperado.

WHERE versão:
comparação atômica.

zero linhas:
conflito.

OptimisticLockException:
falha otimista.

rollback:
obrigatório.

merge stale:
rejeitado.

JDBC:
precisa respeitar versão.
```

O laboratório comprovou:

```text
versão inicial;

incremento no update;

duas leituras concorrentes;

primeira confirmação vencedora;

segunda gravação rejeitada;

estado vencedor preservado;

merge detached obsoleto rejeitado;

delete obsoleto rejeitado;

linhas diferentes independentes;

tradução de conflito;

integração JDBC versionada.
```

A decisão arquitetural foi:

```text
conflitos raros:
lock otimista.

edição humana:
informar e recarregar.

retry:
somente comando seguro.

todos os escritores:
mesmo protocolo de versão.

conflitos frequentes:
avaliar estratégia pessimista.
```

A próxima aula será:

```text
343 - M13.33 - Lock pessimista
```

Nela, você aprenderá:

- `LockModeType.PESSIMISTIC_READ`;
- `LockModeType.PESSIMISTIC_WRITE`;
- `LockModeType.PESSIMISTIC_FORCE_INCREMENT`;
- `find` com lock;
- `lock` em entidade managed;
- SQL `FOR UPDATE`;
- bloqueio entre transações;
- espera;
- timeout;
- rollback;
- lock scope;
- leitura concorrente;
- escrita concorrente;
- ordem de aquisição;
- risco de deadlock;
- transações curtas;
- comparação objetiva com lock otimista.

A aula 342 detectou o conflito no momento da gravação.

A aula 343 mostrará como reservar a linha antes da alteração.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei uma coluna com `@Version`.
- [ ] Reproduzi duas transações lendo a mesma versão.
- [ ] Detectei conflito no `flush`.
- [ ] Executei rollback e preservei o vencedor.
- [ ] Apliquei o protocolo também em JDBC.

---

## Troubleshooting adicional

### Versao nao incrementa

Confirme `@Version`, dirty checking, flush e mapping da coluna.

### Conflito aparece apenas no commit

Use flush explícito quando precisar localizar a falha.

### Transacao nao aceita novas operacoes

Depois da falha, execute rollback e feche o manager.

### Merge sobrescreveu dados inesperados

Revise a versão detached e use o retorno managed.

### JDBC alterou sem conflito

O SQL provavelmente ignorou a versão.

---

## Perguntas de revisao

1. O que é lost update?
2. O que faz `@Version`?
3. Quem altera a versão?
4. A aplicação deve ter setter?
5. Onde a versão antiga aparece?
6. O que significa update com zero linhas?
7. Quando a exceção pode ocorrer?
8. Por que usar flush no teste?
9. O que fazer após conflito?
10. O manager conflitante deve ser reutilizado?
11. Merge ignora versão?
12. Delete usa versão?
13. Linhas diferentes conflitam?
14. Retry sempre é seguro?
15. JDBC precisa usar versão?
16. Bulk update merece cuidado?
17. OPTIMISTIC bloqueia fisicamente?
18. Quando usar lock otimista?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sobrescrita silenciosa de atualização.
2. Controla concorrência por versão.
3. O provider.
4. Não.
5. No `WHERE`.
6. Estado obsoleto ou removido.
7. Merge, flush ou commit.
8. Para tornar o ponto determinístico.
9. Rollback, fechar e recarregar.
10. Não.
11. Não.
12. Sim.
13. Não.
14. Não.
15. Sim.
16. Sim.
17. Não.
18. Quando conflitos são raros.
19. Não.
20. Lock pessimista.

---

## Desafio opcional

Crie:

```java
OptimisticConflictAnalyzer
```

Entrada:

```text
versaoLida;

versaoAtual;

operacao;

retryable;

efeitoExterno;

tentativa.
```

Saída:

```text
CONFLICT;

RELOAD_REQUIRED;

RETRY_ALLOWED;

RETRY_FORBIDDEN;

relatório Markdown.
```

Regras:

- proibir retry com efeito externo não idempotente;
- limitar tentativas;
- nunca alterar versão;
- não acessar banco;
- não depender de Hibernate;
- possuir testes unitários;
- não substituir decisão do caso de uso.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 342 - M13.32 - Lock otimista

- Aprofundei concorrência de atualização.
- Entendi o problema de lost update.
- Criei coluna `versao`.
- Usei `@Version`.
- Mantive a versão sem setter público.
- Observei versão inicial zero.
- Observei incremento após update.
- Identifiquei versão antiga no `WHERE`.
- Identifiquei nova versão no `SET`.
- Usei dois `EntityManager`.
- Abri duas transações sobre a mesma Ordem.
- Fiz as duas lerem a mesma versão.
- Confirmei a primeira atualização.
- Rejeitei a segunda atualização.
- Detectei `OptimisticLockException`.
- Reconheci `RollbackException` com causa otimista.
- Usei `flush` para tornar a falha determinística.
- Executei rollback obrigatório.
- Fechei o manager conflitante.
- Preservei o estado vencedor.
- Testei entidades diferentes sem conflito.
- Testei merge de entidade detached atual.
- Rejeitei merge detached obsoleto.
- Rejeitei delete com versão obsoleta.
- Rejeitei update após remoção concorrente.
- Criei tradução para erro de aplicação.
- Evitei expor SQL na mensagem.
- Estudei retry consciente.
- Evitei retry cego de edição humana.
- Conheci `LockModeType.OPTIMISTIC`.
- Conheci `OPTIMISTIC_FORCE_INCREMENT`.
- Discuto versão da raiz e das filhas.
- Criei atualização JDBC versionada.
- Tratei row count zero como conflito.
- Demonstrei o risco de JDBC sem versão.
- Entendi que todos os escritores devem respeitar o protocolo.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei lock pessimista.
- Próxima aula: Lock pessimista.
```

---

## Referencia tecnica curta

```text
@Version:
versão da entidade.

Old version:
condição do update.

New version:
valor incrementado.

Zero rows:
conflito.

Flush:
ponto de detecção.

Rollback:
obrigatório.

Detached:
também versionado.

Delete:
também protegido.

JDBC:
mesmo protocolo.

Optimistic:
detecta, não bloqueia.
```

Regra final:

```text
o lock otimista deve transformar atualizacoes perdidas em conflitos explicitos por meio de uma versao controlada pelo provider; toda falha exige rollback e novo contexto, retries dependem da semantica do comando e qualquer escritor JPA, JDBC ou externo precisa verificar e incrementar a mesma versao atomicamente.
```
