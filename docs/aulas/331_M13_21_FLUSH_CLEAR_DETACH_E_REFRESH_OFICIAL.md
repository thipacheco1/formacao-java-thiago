# 331 - M13.21 - Flush clear detach e refresh

## Apresentacao da aula

Na aula 330, você aprofundou o dirty checking.

O laboratório mostrou que uma entidade managed pode ser alterada sem uma chamada explícita de update:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

cliente.alterarNome(
        "Novo nome",
        agora
);
```

O Hibernate compara o estado atual da entidade com o snapshot mantido pelo persistence context.

Quando existe uma diferença persistível, o provider agenda um `UPDATE`.

A sincronização acontece em um momento chamado:

```text
flush.
```

Entretanto, nem sempre o objetivo é sincronizar.

Às vezes, a aplicação precisa:

- forçar a execução do SQL antes do commit;
- descartar todas as entidades gerenciadas;
- desanexar somente uma entidade;
- recarregar o estado atual do banco;
- impedir que uma mudança local seja persistida;
- reduzir o tamanho do persistence context;
- detectar uma constraint antes do final da transação;
- observar uma alteração realizada por outro processo;
- controlar processamento em lotes;
- separar sincronização de confirmação.

Nesta aula, você aprofundará quatro operações:

```java
flush
clear
detach
refresh
```

Cada uma possui uma finalidade diferente.

`flush` sincroniza o estado do persistence context com o banco.

`clear` remove todas as entidades do persistence context.

`detach` remove uma entidade específica.

`refresh` recarrega uma entidade managed com o estado atual do banco.

Essas operações não são intercambiáveis.

Erros comuns incluem:

```java
entityManager.clear();
entityManager.flush();
```

quando havia mudanças pendentes.

Nesse caso, as entidades já foram desanexadas e a alteração pode ser perdida.

Outro erro:

```java
entityManager.refresh(cliente);
```

depois de uma alteração local ainda não sincronizada, esperando que o método “salve novamente”.

`refresh` faz o contrário:

```text
o estado do banco substitui o estado local.
```

Outro problema:

```java
entityManager.detach(cliente);

cliente.alterarNome(
        "Nome novo",
        agora
);

transaction.commit();
```

A mudança não é persistida porque a entidade deixou de ser managed.

O laboratório continuará sem Spring.

A infraestrutura será:

```text
Java 21;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O database será isolado:

```text
formacao_java_jpa_331
```

O schema será:

```text
jpa_331
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade principal continuará sendo:

```java
ClienteEntity
```

Ela manterá:

```text
DocumentoFiscal;

Endereco;

Dinheiro;

@Version;

criadoEm;

atualizadoEm.
```

O laboratório comprovará:

```text
flush:
executa SQL antes do commit;
rollback ainda desfaz.

commit:
executa flush automático.

clear sem flush:
descarta mudança pendente.

flush seguido de clear:
persiste mudança depois do commit;
objeto antigo fica detached.

detach:
somente uma entidade é desanexada.

refresh:
descarta mudança local;
recarrega atualização externa.

FlushModeType.AUTO:
query pode provocar flush.

FlushModeType.COMMIT:
query não precisa antecipar flush;
commit sincroniza.

estado final:
zero fixtures CLI-JPA-331-%.
```

A próxima aula será:

```text
332 - M13.22 - Relacionamento ManyToOne
```

Por isso, esta aula manterá uma única entidade principal e não introduzirá associações.

Não serão antecipados:

- `@ManyToOne`;
- `@JoinColumn`;
- `@OneToMany`;
- cascades;
- fetch type;
- lazy loading;
- JPQL aprofundada;
- locks;
- cache de segundo nível;
- Spring;
- Spring Data;
- transações declarativas;
- batching de produção.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
323:
JPA conceitos fundamentais.

324:
Hibernate como implementação JPA.

325:
Entity, Id, GeneratedValue e Column.

326:
Embeddable e objetos de valor persistidos.

327:
EntityManager persist find merge remove.

328:
Ciclo de vida da entidade.

329:
Persistence context e identidade.

330:
Dirty checking.

331:
Flush clear detach e refresh.

332:
Relacionamento ManyToOne.
```

Na aula 329, o persistence context manteve identidade.

Na aula 330, o dirty checking detectou alterações.

Nesta aula, você controlará o que fazer com o estado gerenciado:

```text
sincronizar:
flush.

esvaziar o contexto:
clear.

desanexar uma entidade:
detach.

recarregar do banco:
refresh.
```

Nesta aula:

```text
flush:
aprofundado.

flush automático:
sim.

FlushModeType.AUTO:
sim.

FlushModeType.COMMIT:
sim.

clear:
aprofundado.

detach:
aprofundado.

refresh:
aprofundado.

rollback:
sim.

atualização JDBC externa:
sim.

relacionamentos:
não.

Spring:
não.
```

A arquitetura permanecerá:

```text
EntityManager
    -> persistence context
        -> entidades managed
        -> snapshots
        -> action queue
            -> flush
                -> JDBC
                    -> PostgreSQL.
```

`clear` e `detach` alteram o conteúdo do persistence context.

`refresh` altera o estado de uma entidade que continua dentro dele.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-331-flush-clear-detach-refresh
```

Estrutura final:

```text
labs
└── m13
    └── aula-331-flush-clear-detach-refresh
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-flush.md
        │   ├── contrato-clear-detach.md
        │   ├── contrato-refresh.md
        │   ├── flush-modes.md
        │   └── troubleshooting-sincronizacao.md
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
            │   │                   └── aula331
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── lab
            │   │                       │   ├── SynchronizationLab.java
            │   │                       │   ├── SynchronizationObservation.java
            │   │                       │   └── SynchronizationReport.java
            │   │                       ├── observability
            │   │                       │   ├── ExternalJdbcClient.java
            │   │                       │   └── SqlCaptureInspector.java
            │   │                       └── valueobject
            │   │                           ├── Dinheiro.java
            │   │                           ├── DocumentoFiscal.java
            │   │                           └── Endereco.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_331.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula331
                                        ├── FlushIT.java
                                        ├── ClearDetachIT.java
                                        ├── RefreshIT.java
                                        ├── FlushModeIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
flush explícito:
UPDATE executado;
transação ainda ativa;
rollback restaura o banco.

commit sem flush explícito:
UPDATE executado.

clear antes do flush:
zero UPDATE;
mudança perdida.

flush e clear:
UPDATE executado;
objeto detached;
commit preserva mudança.

detach:
uma entidade deixa o contexto;
outra continua managed.

refresh:
mudança local é descartada;
mudança externa é carregada.

AUTO:
query de contagem pode antecipar flush.

COMMIT:
query pode observar banco antes da sincronização;
commit envia update.

estado final:
zero fixtures CLI-JPA-331-%.
```

---

## Conceito essencial

### Flush nao e commit

`flush` sincroniza o persistence context com o banco.

`commit` confirma a transação.

Fluxo:

```text
entidade managed alterada;

flush;

UPDATE executado;

transação continua ativa;

rollback;

UPDATE desfeito.
```

Portanto:

```text
flush:
envia SQL.

commit:
torna definitivo.
```

A distinção é essencial para:

- antecipar constraints;
- controlar ordem de SQL;
- testar comportamento;
- processamento em lote;
- queries que dependem de alterações pendentes;
- diagnosticar falhas antes do commit.

---

### O que flush sincroniza

Durante o flush, o provider verifica o persistence context e pode executar:

```text
INSERT;

UPDATE;

DELETE;

operações relacionadas a coleções futuras.
```

Nesta aula, somente uma entidade simples será usada.

O flush considera:

- entidades novas persistidas;
- entidades managed alteradas;
- entidades marked removed;
- mudanças em embeddables;
- versão otimista.

---

### Flush explicito

Operação:

```java
entityManager.flush();
```

Pré-condições:

```text
EntityManager aberto;

transação ativa para escrita;

entidade managed ou ação pendente.
```

Possíveis resultados:

- SQL executado;
- versão incrementada;
- constraint violation;
- nenhuma escrita quando não existe mudança.

O `flush` não fecha o manager.

Ele também não encerra a transação.

---

### Flush automatico no commit

Ao executar:

```java
transaction.commit();
```

o provider sincroniza mudanças pendentes antes de confirmar.

Por isso, este fluxo funciona:

```java
transaction.begin();

ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

cliente.alterarNome(
        "Nome atualizado",
        agora
);

transaction.commit();
```

Mesmo sem chamada explícita de `flush`.

---

### Flush antes de query

Com modo:

```java
FlushModeType.AUTO
```

o provider pode executar flush antes de uma query quando as alterações pendentes podem afetar o resultado.

Exemplo:

1. alterar nome de uma entidade managed;
2. executar uma consulta de contagem com critério pelo nome;
3. provider sincroniza antes;
4. consulta enxerga o valor novo.

Esse comportamento mantém consistência entre:

```text
estado em memória;

resultado da consulta.
```

A decisão exata pertence ao provider dentro do contrato JPA.

---

### FlushModeType.AUTO

É o modo padrão mais comum.

Significa:

```text
o provider deve assegurar que atualizações relevantes
sejam visíveis para consultas que precisam delas.
```

Ele não significa:

```text
flush depois de toda alteração Java.
```

O SQL continua sendo adiado até um ponto de sincronização.

---

### FlushModeType.COMMIT

Com:

```java
entityManager.setFlushMode(
        FlushModeType.COMMIT
);
```

o provider pode adiar a sincronização até o commit.

Uma query executada antes pode observar somente o estado atual do banco.

Exemplo didático:

```text
nome alterado em memória;

query por novo nome;

resultado pode ser zero;

commit;

nova query em novo contexto encontra um.
```

Não use `COMMIT` para “ganhar performance” sem compreender inconsistências intermediárias.

---

### Constraint antecipada

Sem flush explícito, uma violação pode aparecer apenas no commit.

Com:

```java
entityManager.flush();
```

a aplicação pode detectar a falha antes de executar etapas posteriores.

Exemplo:

```text
persistir código duplicado;

flush;

capturar violação;

rollback.
```

Isso não transforma o flush em uma validação de negócio.

Ele apenas força o banco a processar o SQL pendente.

---
---

### Clear

Operação:

```java
entityManager.clear();
```

Efeito:

```text
todas as entidades managed ficam detached;

persistence context é esvaziado;

snapshots são descartados;

mudanças pendentes não sincronizadas deixam de ser acompanhadas.
```

`clear` não executa flush automaticamente.

Por isso, a ordem importa.

---

### Clear antes de flush

Fluxo:

```java
cliente.alterarNome(
        "Nome perdido",
        agora
);

entityManager.clear();

transaction.commit();
```

Resultado esperado:

```text
zero UPDATE;

mudança não persistida;

cliente detached.
```

O commit não encontra mais a entidade alterada no contexto.

---

### Flush seguido de clear

Fluxo:

```java
cliente.alterarNome(
        "Nome persistido",
        agora
);

entityManager.flush();

entityManager.clear();

transaction.commit();
```

Resultado:

```text
UPDATE executado;

mudança confirmada no commit;

objeto antigo detached;

contexto vazio.
```

Esse padrão aparece em processamento em lote:

```text
processar bloco;

flush;

clear.
```

Ele reduz memória e quantidade de entidades managed.

---

### Clear e identidade

Depois de `clear`, uma nova busca pelo mesmo ID cria outra instância managed.

Exemplo:

```java
ClienteEntity antigo =
        entityManager.find(
                ClienteEntity.class,
                id
        );

entityManager.clear();

ClienteEntity novo =
        entityManager.find(
                ClienteEntity.class,
                id
        );
```

Esperado:

```text
antigo != novo;

antigo detached;

novo managed.
```

---

### Detach

Operação:

```java
entityManager.detach(cliente);
```

Efeito:

```text
somente a entidade informada deixa o contexto.
```

Outras entidades permanecem managed.

Essa diferença é central:

```text
detach:
uma.

clear:
todas.
```

---

### Detach com mudanca pendente

Se a entidade foi alterada e ainda não houve flush:

```java
cliente.alterarNome(
        "Nome descartado",
        agora
);

entityManager.detach(cliente);

transaction.commit();
```

A mudança não é persistida.

O snapshot e o acompanhamento daquela instância foram removidos.

---

### Flush antes de detach

Fluxo:

```java
cliente.alterarNome(
        "Nome sincronizado",
        agora
);

entityManager.flush();

entityManager.detach(cliente);

transaction.commit();
```

O SQL já foi executado dentro da transação.

O commit confirma a mudança.

Depois do detach, alterações adicionais no objeto não serão sincronizadas.

---

### Detach e referencias

Depois de detach, um `find` da mesma identidade pode criar outra entidade managed.

Você passa a ter:

```text
referência antiga:
detached.

referência nova:
managed.

mesmo ID;
objetos diferentes.
```

Misturar as duas referências pode gerar bugs.

Use a referência managed atual da unidade.

---

### Refresh

Operação:

```java
entityManager.refresh(cliente);
```

Pré-condições:

```text
entidade managed;

linha existente;

manager aberto.
```

Efeito:

```text
recarrega o banco;

sobrescreve estado local;

atualiza snapshot;

mantém a mesma referência managed.
```

---

### Refresh descarta mudanca local

Fluxo:

```java
String original =
        cliente.getNome();

cliente.alterarNome(
        "Nome temporário",
        agora
);

entityManager.refresh(cliente);
```

Depois:

```text
nome volta ao banco;

nenhum UPDATE da mudança temporária;

entidade continua managed.
```

`refresh` não é rollback da transação inteira.

Ele afeta a entidade recarregada.

---

### Refresh depois de alteracao externa

Fluxo:

1. manager A carrega Cliente;
2. JDBC externo altera e confirma;
3. manager A continua com estado antigo;
4. `refresh` é executado;
5. manager A passa a refletir o banco.

Isso foi introduzido na aula 329 e será aprofundado aqui.

O refresh também atualiza:

```text
@Version;

embeddables;

campos simples.
```

---

### Refresh e flush automatico

Se a entidade possui mudanças locais, o provider precisa lidar com a sincronização antes da recarga conforme regras e modo de flush.

No laboratório, a mudança local será descartada de forma controlada sem depender de comportamento ambíguo:

```text
não executar query intermediária;

chamar refresh diretamente;

confirmar estado do banco.
```

Não misture refresh com alterações que precisam ser salvas.

---

### Refresh de detached

Isto é inválido:

```java
entityManager.detach(cliente);
entityManager.refresh(cliente);
```

A entidade não pertence mais ao contexto.

O provider deve lançar:

```text
IllegalArgumentException;
ou exceção de persistência equivalente.
```

A correção é buscar a entidade managed atual.

---

### Refresh de linha removida externamente

Se outro processo remove a linha e o contexto chama `refresh`, o provider pode lançar:

```text
EntityNotFoundException.
```

Esse cenário será testado de forma isolada.

A aplicação deve tratar a ausência conforme sua regra.

---

### Clear, detach e rollback

`clear` e `detach` não desfazem SQL já executado por flush.

Somente rollback desfaz a transação.

Exemplo:

```text
flush;
clear;
rollback.
```

Resultado:

```text
SQL desfeito;

objetos antigos detached.
```

O banco volta ao estado anterior.

O Java mantém objetos desanexados com valores que podem não representar o banco.

---

### Refresh e rollback

Depois de refresh, a entidade representa o estado lido dentro da transação.

Se depois ocorrer rollback, a especificação exige cuidado com o estado gerenciado.

Regra desta formação:

```text
depois de rollback:
fechar manager;
descartar ou recarregar entidades em novo contexto.
```

---

### Quando usar flush

Use flush explícito quando existe uma razão:

- detectar constraint antes;
- garantir ordem entre etapas;
- observar SQL no teste;
- preparar processamento em lote;
- sincronizar antes de operação JDBC na mesma transação;
- obter efeitos do banco necessários ao próximo passo.

Não use depois de cada alteração por hábito.

Flush excessivo:

- aumenta round trips;
- reduz batching;
- aumenta custo;
- incrementa versões mais cedo;
- cria mais pontos de falha.

---

### Quando usar clear

Use clear quando deseja:

- esvaziar o contexto;
- liberar referências de um lote;
- forçar nova leitura;
- evitar crescimento de memória;
- descartar conscientemente mudanças pendentes.

Antes de clear, decida:

```text
quero salvar?
flush.

quero descartar?
clear sem flush.
```

---

### Quando usar detach

Use detach quando deseja remover uma entidade específica do acompanhamento.

Exemplos:

- impedir sincronização posterior de um objeto;
- controlar memória de uma entidade;
- demonstrar boundary;
- preparar objeto detached para outra camada.

Na maioria dos casos de unidade curta, fechar o manager é mais simples.

---

### Quando usar refresh

Use refresh quando precisa:

- recarregar default ou trigger;
- observar alteração externa;
- descartar mudança local;
- sincronizar versão;
- verificar estado atual de uma linha managed.

Não use como rotina depois de todo persist ou update.

Cada refresh custa uma leitura.

---

### Processamento em lote

Padrão conceitual:

```java
for (int index = 0; index < clientes.size(); index++) {
    entityManager.persist(
            clientes.get(index)
    );

    if ((index + 1) % batchSize == 0) {
        entityManager.flush();
        entityManager.clear();
    }
}
```

Benefícios:

- contexto limitado;
- menor consumo de memória;
- SQL enviado em blocos.

O laboratório não fará benchmark.

Apenas provará o efeito sobre `contains`.

Batching JDBC real exige outras configurações e será estudado mais adiante.

---

### Operacao JDBC externa

O laboratório usará `ExternalJdbcClient` para:

- atualizar nome e versão;
- consultar nome diretamente;
- remover uma fixture em teste isolado.

A operação externa representa outro processo.

Ela não usa o mesmo persistence context.

Isso permite observar refresh e estado stale.

---

### Estado e observabilidade

O `StatementInspector` registrará somente SQL normalizado.

Ele não registrará bindings.

As observações incluirão:

```text
etapa;

manager aberto;

contains;

transação ativa;

INSERTs;

UPDATEs;

DELETEs;

SELECTs;

versão.
```

Não use a contagem de SQL como única prova.

Valide também o estado real do banco em um novo contexto.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\java\br\com\formacao\m13\aula331\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\java\br\com\formacao\m13\aula331\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\java\br\com\formacao\m13\aula331\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\java\br\com\formacao\m13\aula331\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\java\br\com\formacao\m13\aula331\valueobject"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-331-flush-clear-detach-refresh\src\test\java\br\com\formacao\m13\aula331"

Set-Location `
  "labs\m13\aula-331-flush-clear-detach-refresh"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 330.

Ajuste:

```text
artifactId:
aula-331-flush-clear-detach-refresh.

persistence unit:
aula331PU.

Main:
br.com.formacao.m13.aula331.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_331
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-331-jpa
JPA_POOL_NAME=aula-331-pool
JPA_POOL_SIZE=4
```

O pool quatro permite uma conexão externa enquanto o manager permanece ativo.

---

### 3. Criar migration

Reutilize a estrutura da aula 330.

Ajustes:

```text
schema:
jpa_331.

sequence:
jpa_331.cliente_id_seq.

start:
331001.
```

Mantenha:

- código;
- nome;
- email;
- documento;
- endereços;
- limite;
- ativo;
- versão;
- criado em;
- atualizado em.

---

### 4. Reutilizar entidade e objetos de valor

Copie e ajuste:

```text
ClienteEntity;

DocumentoFiscal;

Endereco;

Dinheiro.
```

Mantenha métodos de domínio que só atualizam `atualizadoEm` quando existe mudança real.

Adicione getters necessários para os testes:

```java
getNome;

getVersao;

getAtualizadoEm;

getId;

getCodigo.
```

Não adicione setters.

---

### 5. Criar ExternalJdbcClient.java

```java
package br.com.formacao.m13.aula331.observability;

import java.sql.SQLException;

import javax.sql.DataSource;

public final class ExternalJdbcClient {

    private final DataSource dataSource;

    public ExternalJdbcClient(
            DataSource dataSource
    ) {
        this.dataSource = dataSource;
    }

    public void updateName(
            long clienteId,
            String novoNome
    ) {
        String sql = """
                UPDATE jpa_331.cliente
                SET
                    nome = ?,
                    versao = versao + 1,
                    atualizado_em = CURRENT_TIMESTAMP
                WHERE id = ?
                """;

        try (
            var connection =
                    dataSource.getConnection();
            var statement =
                    connection.prepareStatement(
                            sql
                    )
        ) {
            statement.setString(
                    1,
                    novoNome
            );
            statement.setLong(
                    2,
                    clienteId
            );

            if (statement.executeUpdate() != 1) {
                throw new IllegalStateException(
                        "Cliente externo não atualizado"
                );
            }
        } catch (SQLException exception) {
            throw new IllegalStateException(
                    "Falha JDBC externa",
                    exception
            );
        }
    }

    public String findName(
            long clienteId
    ) {
        String sql = """
                SELECT nome
                FROM jpa_331.cliente
                WHERE id = ?
                """;

        try (
            var connection =
                    dataSource.getConnection();
            var statement =
                    connection.prepareStatement(
                            sql
                    )
        ) {
            statement.setLong(
                    1,
                    clienteId
            );

            try (
                var resultSet =
                        statement.executeQuery()
            ) {
                if (!resultSet.next()) {
                    throw new IllegalStateException(
                            "Cliente não encontrado"
                    );
                }

                return resultSet.getString(
                        "nome"
                );
            }
        } catch (SQLException exception) {
            throw new IllegalStateException(
                    "Falha de consulta externa",
                    exception
            );
        }
    }
}
```

A atualização externa incrementa versão.

Não execute enquanto a transação JPA mantém lock de escrita na mesma linha.

Use em etapa separada.

---

### 6. Criar SynchronizationObservation.java

```java
package br.com.formacao.m13.aula331.lab;

public record SynchronizationObservation(
        String etapa,
        boolean managerOpen,
        boolean transactionActive,
        Boolean contained,
        long selectCount,
        long insertCount,
        long updateCount,
        long deleteCount,
        int versao
) {

    public SynchronizationObservation {
        if (
            etapa == null
            || etapa.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "etapa obrigatória"
            );
        }
    }
}
```

`contained` será nulo quando não for seguro consultar.

---

### 7. Criar SynchronizationReport.java

```java
package br.com.formacao.m13.aula331.lab;

import java.util.List;

public record SynchronizationReport(
        List<SynchronizationObservation> observations,
        boolean flushExecutedBeforeCommit,
        boolean rollbackUndidFlushedUpdate,
        boolean commitFlushedAutomatically,
        boolean clearDiscardedPendingChange,
        boolean flushThenClearPersistedChange,
        boolean detachAffectedOnlyOneEntity,
        boolean refreshDiscardedLocalChange,
        boolean refreshLoadedExternalChange,
        boolean autoModeFlushedBeforeQuery,
        boolean commitModeDeferredUntilCommit
) {

    public SynchronizationReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 8. Criar fixtures

Crie duas fixtures:

```text
CLI-JPA-331-MAIN;

CLI-JPA-331-AUX.
```

Use documentos distintos.

Confirme a transação e feche o manager.

A entidade principal será usada em todas as etapas.

A auxiliar provará que detach afeta somente uma entidade.

---

### 9. Cenário flush e rollback

Abra manager e transação.

Busque a principal.

Guarde o nome original.

Altere para:

```text
Nome sincronizado e revertido.
```

Limpe inspector.

Execute:

```java
entityManager.flush();
```

Confirme:

```text
um UPDATE;

transação ativa;

contains true;

versão incrementada no objeto.
```

Use `ExternalJdbcClient.findName` somente se a consulta puder ser executada sem bloquear e compreender visibilidade. Para evitar confusão de isolamento, valide o SQL pelo inspector.

Execute:

```java
transaction.rollback();
```

Feche manager.

Em novo manager, confirme:

```text
nome original;

versão original.
```

Isso prova:

```text
flush não é commit.
```

---

### 10. Cenário commit sem flush explicito

Abra novo manager e transação.

Busque principal.

Limpe inspector.

Altere nome para:

```text
Nome confirmado pelo commit.
```

Não chame flush.

Execute commit.

Confirme:

```text
um UPDATE capturado;

valor persistido;

versão incrementada.
```

---

### 11. Cenário clear sem flush

Abra manager e transação.

Busque principal.

Altere para:

```text
Nome descartado pelo clear.
```

Limpe inspector.

Execute:

```java
entityManager.clear();
```

Confirme:

```text
contains false;

contexto vazio.
```

Commit.

Confirme em novo manager:

```text
nome anterior preservado;

zero UPDATE.
```

---

### 12. Cenário flush seguido de clear

Abra manager e transação.

Busque principal.

Altere para:

```text
Nome salvo antes do clear.
```

Limpe inspector.

Execute:

```java
entityManager.flush();
entityManager.clear();
```

Confirme:

```text
um UPDATE;

objeto antigo detached.
```

Commit.

Em novo manager:

```text
nome novo persistido.
```

A referência antiga continua detached.

---

### 13. Cenário detach de uma entidade

Abra manager e transação.

Busque principal e auxiliar.

Confirme ambas managed.

Execute:

```java
entityManager.detach(principal);
```

Confirme:

```text
principal contains false;

auxiliar contains true.
```

Altere ambas.

Commit.

Esperado:

```text
principal:
mudança não persistida.

auxiliar:
mudança persistida por dirty checking.
```

Depois, restaure a auxiliar em uma transação separada para manter os próximos cenários previsíveis.

---

### 14. Cenário refresh descarta mudanca local

Abra manager e transação.

Busque principal.

Guarde o nome persistido.

Altere para:

```text
Nome local descartado.
```

Limpe inspector.

Execute:

```java
entityManager.refresh(principal);
```

Confirme:

```text
nome voltou ao persistido;

mesma referência;

contains true;

um SELECT;

zero UPDATE.
```

Commit.

---

### 15. Cenário refresh carrega alteracao externa

Abra manager A.

Busque principal.

Guarde nome e versão.

Fora de transação de escrita JPA, execute:

```java
externalJdbcClient.updateName(
        id,
        "Nome atualizado externamente"
);
```

No manager A:

```text
objeto ainda possui nome antigo.
```

Execute uma transação de leitura controlada ou use refresh conforme suporte do provider:

```java
entityManager.refresh(principal);
```

Confirme:

```text
mesma referência;

novo nome;

nova versão;

contains true.
```

Feche manager.

---

### 16. Cenário FlushModeType.AUTO

Abra manager e transação.

Defina:

```java
entityManager.setFlushMode(
        FlushModeType.AUTO
);
```

Busque principal.

Altere para:

```text
Nome modo AUTO.
```

Limpe inspector.

Execute uma query JPQL mínima de contagem:

```java
Long count =
        entityManager.createQuery(
                """
                select count(c)
                from Cliente c
                where c.nome = :nome
                """,
                Long.class
        )
                .setParameter(
                        "nome",
                        "Nome modo AUTO"
                )
                .getSingleResult();
```

JPQL aparece somente como instrumento de observação, não como tema aprofundado.

Confirme:

```text
UPDATE antes do SELECT;

count igual a 1.
```

Rollback para restaurar o estado.

---

### 17. Cenário FlushModeType.COMMIT

Abra manager e transação.

Defina:

```java
entityManager.setFlushMode(
        FlushModeType.COMMIT
);
```

Busque principal.

Altere para:

```text
Nome modo COMMIT.
```

Limpe inspector.

Execute a mesma query pelo novo nome.

Confirme, conforme contrato e comportamento do provider no laboratório:

```text
nenhum UPDATE antes da query;

count baseado no banco ainda igual a zero.
```

Depois execute commit.

Confirme:

```text
UPDATE no commit;

novo contexto encontra o nome.
```

Não transforme essa observação em garantia universal de todas as consultas e providers além do contrato praticado.

---

### 18. Limpeza final

Abra novo manager e transação.

Busque principal e auxiliar.

Remova as duas.

Commit.

Confirme zero fixtures por JDBC ou em novo contexto.

---

### 19. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. cria `ExternalJdbcClient`;
4. executa `SynchronizationLab`;
5. imprime observações;
6. imprime booleanos finais;
7. fecha runtime;
8. não imprime SQL completo;
9. não imprime documento ou email.

Formato:

```text
etapa | open | tx | contains | SELECT | UPDATE | versao
```

---

### 20. Criar FlushIT.java

Casos:

#### Flush executa antes do commit

- carregar;
- alterar;
- limpar inspector;
- flush;
- confirmar UPDATE;
- confirmar transação ativa;
- rollback;
- confirmar banco preservado.

#### Commit executa flush

- alterar;
- não chamar flush;
- commit;
- confirmar UPDATE;
- confirmar valor.

#### Constraint antecipada

- persistir código duplicado;
- chamar flush;
- esperar exceção;
- rollback;
- fechar manager.

---

### 21. Criar ClearDetachIT.java

#### Clear descarta

- alterar managed;
- clear;
- commit;
- zero UPDATE;
- banco preservado.

#### Flush e clear

- alterar;
- flush;
- clear;
- commit;
- mudança persistida;
- objeto antigo detached.

#### Detach uma entidade

- carregar duas;
- detach uma;
- alterar ambas;
- commit;
- somente managed persistida.

#### Detach depois de flush

- alterar;
- flush;
- detach;
- alterar novamente;
- commit;
- somente primeira mudança persistida.

---

### 22. Criar RefreshIT.java

#### Descartar local

- carregar;
- alterar;
- refresh;
- confirmar valor original;
- zero UPDATE;
- commit.

#### Carregar externo

- carregar em manager A;
- atualizar por JDBC;
- confirmar stale;
- refresh;
- confirmar novo valor e versão.

#### Refresh detached

- detach;
- refresh;
- esperar `IllegalArgumentException`.

#### Linha removida externamente

- carregar;
- remover por JDBC em método específico;
- refresh;
- esperar `EntityNotFoundException` ou exceção de persistência equivalente;
- fechar manager.

Esse último caso usa fixture isolada.

---

### 23. Criar FlushModeIT.java

#### AUTO

- alterar;
- executar query dependente;
- confirmar UPDATE antes do SELECT;
- confirmar query vê o valor;
- rollback.

#### COMMIT

- alterar;
- executar query dependente;
- confirmar ausência de UPDATE antes;
- confirmar resultado do banco antigo;
- commit;
- confirmar UPDATE;
- novo contexto vê valor novo.

Não compare SQL completo.

Use ordem dos statements capturados.

---

### 24. Criar TestDataCleaner.java

Limpe somente:

```sql
DELETE FROM jpa_331.cliente
WHERE codigo LIKE 'CLI-JPA-331-%'
```

Use no `@BeforeEach` e `@AfterEach`.

---

### 25. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_331.
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
zero CLI-JPA-331-%;

schema history com V1;

tabela cliente existente.
```

`05_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 26. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
flush executou antes do commit;

rollback desfez flush;

commit realizou flush automático;

clear descartou mudança;

flush e clear preservaram mudança;

detach afetou somente uma entidade;

refresh descartou local;

refresh carregou externo;

AUTO antecipou sincronização;

COMMIT adiou até confirmação;

estado final ficou limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 27. Criar documentacao

`contrato-flush.md` deve registrar:

- definição;
- pré-condições;
- SQL possível;
- relação com dirty checking;
- relação com commit;
- rollback;
- constraint;
- custo;
- uso em lote.

`contrato-clear-detach.md` deve comparar:

```text
Operação | Quantas entidades | Flush automático | Estado final
```

Inclua:

- clear;
- detach;
- close.

`contrato-refresh.md` deve registrar:

- managed;
- recarga;
- mesma referência;
- snapshot;
- mudança local;
- atualização externa;
- linha inexistente;
- custo.

`flush-modes.md` deve comparar:

```text
AUTO;

COMMIT.
```

Inclua:

- query;
- consistência;
- momento do update;
- riscos;
- recomendação.

`troubleshooting-sincronizacao.md` deve cobrir:

- mudança perdida por clear;
- mudança perdida por detach;
- refresh apagando alteração;
- flush confundido com commit;
- constraint no flush;
- update antes de query;
- COMMIT retornando resultado antigo;
- entidade detached;
- manager pós-rollback;
- contexto crescendo.

---

## Entendendo o que foi feito

### Flush virou uma barreira explicita

O SQL pôde ser executado antes do commit e ainda ser revertido.

### Clear ganhou intencao

Ele foi usado tanto para descartar mudanças quanto depois de flush para esvaziar o contexto.

### Detach mostrou granularidade

Somente uma entidade saiu do contexto, enquanto outra permaneceu managed.

### Refresh foi tratado como recarga

Mudanças locais foram descartadas e alterações externas foram carregadas.

### Flush mode mostrou consistencia

AUTO antecipou sincronização; COMMIT permitiu adiamento até a confirmação.

---

## Erros comuns importantes

### Chamar clear antes de flush sem querer descartar

A mudança pendente deixa de ser acompanhada.

### Achar que flush torna definitivo

Rollback ainda desfaz.

### Achar que detach salva o objeto

Detach interrompe o acompanhamento.

### Usar refresh para persistir

Refresh recarrega o banco.

### Mudar flush mode sem teste

Queries intermediárias podem observar estados diferentes.

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

### Verificar fixtures

```sql
SELECT
    id,
    codigo,
    nome,
    versao,
    atualizado_em
FROM jpa_331.cliente
WHERE codigo LIKE 'CLI-JPA-331-%'
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — Insert em lotes

Crie cinquenta Clientes em database descartável.

A cada dez:

```text
flush;

clear.
```

Confirme que referências anteriores ficam detached.

Não faça benchmark conclusivo.

### Parte 2 — Clear sem flush

Persista cinco entidades, execute clear e commit sem flush explícito.

Observe quais inserts ocorreram conforme estratégia de ID e provider.

Documente por que não depender de comportamento implícito.

### Parte 3 — Detach e merge

Detach uma entidade alterada, faça outra mudança e depois merge.

Confirme que o retorno managed é a referência válida.

Não transforme merge em padrão para tudo.

### Parte 4 — Refresh com default

Adicione em uma migration nova uma coluna gerenciada pelo banco.

Persista e use refresh para carregar o valor.

Não altere V1 aplicada.

### Parte 5 — FlushMode COMMIT

Execute duas queries:

- uma dependente da mudança;
- outra sem relação.

Compare SQL e resultados.

Documente o comportamento observado.

### Parte 6 — Constraint

Crie duplicidade, force flush, capture exceção e confirme rollback.

Não reutilize o manager depois da falha.

### Parte 7 — Flush e JDBC na mesma transacao

Desenhe conceitualmente como seria usar `unwrap(Connection.class)` ou trabalho nativo na mesma transação.

Não implemente acoplamento nativo sem necessidade.

### Parte 8 — Matriz de decisão

Crie:

```text
Necessidade | Operação | Risco | Teste obrigatório
```

Inclua flush, clear, detach, refresh e close.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 331 existe;
- continuidade com a aula 330 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_331` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi reutilizada;
- objetos de valor foram reutilizados;
- flush foi definido;
- flush foi diferenciado de commit;
- flush explícito foi executado;
- transação permaneceu ativa após flush;
- rollback desfez update já enviado;
- commit executou flush automático;
- constraint foi antecipada por flush;
- action queue foi explicada;
- clear foi definido;
- clear desanexou todas;
- clear não executou flush automaticamente;
- clear antes de flush descartou mudança;
- flush seguido de clear persistiu mudança;
- referência antiga ficou detached;
- detach foi definido;
- detach afetou uma entidade;
- outra entidade permaneceu managed;
- mudança depois de detach não persistiu;
- flush antes de detach preservou primeira mudança;
- refresh foi definido;
- refresh exigiu managed;
- refresh preservou a referência;
- refresh descartou mudança local;
- refresh carregou alteração externa;
- refresh atualizou versão;
- refresh detached falhou;
- linha removida externamente foi tratada;
- FlushModeType.AUTO foi praticado;
- AUTO antecipou flush antes de query relevante;
- query viu o estado sincronizado;
- FlushModeType.COMMIT foi praticado;
- COMMIT adiou update antes da query;
- commit confirmou o update;
- mudança de flush mode foi documentada;
- processamento em lote foi explicado;
- flush excessivo foi desaconselhado;
- clear e detach não foram confundidos com rollback;
- refresh não foi confundido com persistência;
- manager após falha foi fechado;
- SQL foi observado sem bindings;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou vazio;
- relacionamentos não foram antecipados;
- cascades não foram antecipados;
- Spring não foi usado;
- ponte para a aula 332 está correta;
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
  labs/m13/aula-331-flush-clear-detach-refresh
```

Commit recomendado:

```powershell
git commit -m "feat(m13): controlar flush clear detach e refresh"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou quatro operações de controle do persistence context.

Aprendeu:

```text
flush:
sincroniza SQL sem confirmar.

clear:
desanexa todas as entidades.

detach:
desanexa uma entidade.

refresh:
recarrega do banco.
```

O laboratório comprovou:

```text
UPDATE antes do commit;

rollback desfazendo flush;

commit acionando flush automático;

clear descartando mudança pendente;

flush e clear preservando escrita;

detach mantendo outra entidade managed;

refresh descartando estado local;

refresh carregando estado externo;

AUTO sincronizando antes de query;

COMMIT adiando sincronização.
```

A próxima aula será:

```text
332 - M13.22 - Relacionamento ManyToOne
```

Nela, você iniciará relacionamentos JPA com uma associação comum:

```text
muitas Ordens de Serviço
    -> um Cliente.
```

Você estudará:

- `@ManyToOne`;
- `@JoinColumn`;
- foreign key;
- entidade proprietária;
- identidade da associação;
- nulabilidade;
- `optional`;
- fetch;
- referência managed;
- associação por `find`;
- associação por referência;
- persistência sem cascade;
- SQL gerado;
- constraints do Flyway;
- atualização da foreign key;
- remoção protegida;
- testes de relacionamento.

A aula 331 controlou o persistence context de uma entidade.

A aula 332 começará a observar como duas entidades se relacionam dentro desse contexto.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei flush de commit.
- [ ] Usei clear somente com intenção explícita.
- [ ] Diferenciei detach de clear.
- [ ] Usei refresh para recarregar o banco.
- [ ] Comparei FlushModeType.AUTO e COMMIT.

---

## Troubleshooting adicional

### Chamei flush e o dado sumiu

Provavelmente houve rollback.

Flush não confirma.

### Chamei clear e a alteracao nao foi salva

A entidade foi desanexada antes da sincronização.

### Detach nao removeu a linha

Detach não é delete.

Ele apenas remove do contexto.

### Refresh apagou minha mudanca

O método recarregou o estado do banco.

### Query retornou valor antigo em COMMIT

O provider adiou a sincronização até commit.

---

## Perguntas de revisao

1. O que faz flush?
2. Flush confirma a transação?
3. Rollback desfaz flush?
4. Commit executa flush?
5. O que faz clear?
6. Clear executa flush?
7. O que ocorre com mudanças pendentes após clear?
8. O que faz detach?
9. Qual diferença entre detach e clear?
10. O que faz refresh?
11. Refresh exige managed?
12. Refresh preserva a referência?
13. Refresh salva mudança local?
14. O que é FlushModeType.AUTO?
15. O que é FlushModeType.COMMIT?
16. Quando usar flush explícito?
17. Qual ordem em processamento em lote?
18. Clear desfaz SQL já executado?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sincroniza contexto e banco.
2. Não.
3. Sim.
4. Sim.
5. Desanexa todas.
6. Não.
7. Podem ser perdidas.
8. Desanexa uma.
9. Uma versus todas.
10. Recarrega o banco.
11. Sim.
12. Sim.
13. Não.
14. Flush automático conforme necessidade.
15. Adiamento até commit.
16. Quando existe razão explícita.
17. Flush e depois clear.
18. Não.
19. Não.
20. Relacionamento ManyToOne.

---

## Desafio opcional

Crie:

```java
PersistenceContextOperationTrace
```

Entrada:

```text
etapa;

operação;

manager aberto;

transação ativa;

contains;

versão;

SQL capturado.
```

Saída:

```text
Markdown;

CSV.
```

Regras:

- não registrar documento;
- não registrar email;
- não registrar bindings;
- lista imutável;
- testes unitários;
- classificação de SELECT, INSERT, UPDATE e DELETE;
- não inferir commit apenas pela existência de SQL;
- diferenciar clear, detach, refresh e rollback.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 331 - M13.21 - Flush clear detach e refresh

- Aprofundei a sincronização do persistence context.
- Diferenciei `flush` de commit.
- Executei flush explícito.
- Confirmei que a transação continuou ativa.
- Executei rollback depois de flush.
- Confirmei que o banco foi restaurado.
- Confirmei flush automático no commit.
- Forcei constraint durante flush.
- Entendi o papel da action queue.
- Usei `clear`.
- Entendi que clear não executa flush automaticamente.
- Descartei alteração pendente com clear.
- Usei flush seguido de clear.
- Mantive a escrita e esvaziei o contexto.
- Usei `detach` em uma entidade.
- Mantive outra entidade managed.
- Confirmei que mudança detached não sincroniza.
- Usei flush antes de detach.
- Usei `refresh` em entidade managed.
- Descartei uma mudança local.
- Recarreguei uma alteração JDBC externa.
- Mantive a mesma referência após refresh.
- Atualizei a versão com refresh.
- Testei refresh de entidade detached.
- Estudei `FlushModeType.AUTO`.
- Observei flush antes de query relevante.
- Estudei `FlushModeType.COMMIT`.
- Observei sincronização adiada até commit.
- Entendi o padrão flush e clear em lotes.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei relacionamentos, cascades ou Spring.
- Próxima aula: relacionamento ManyToOne.
```

---

## Referencia tecnica curta

```text
flush:
sincronizar.

commit:
confirmar.

rollback:
desfazer.

clear:
desanexar todas.

detach:
desanexar uma.

refresh:
recarregar.

AUTO:
sincronizar quando necessário.

COMMIT:
adiar até confirmação.

batch:
flush + clear.
```

Regra final:

```text
flush, clear, detach e refresh controlam aspectos diferentes do persistence context; usar cada operacao corretamente exige decidir se a intencao e sincronizar, descartar, desanexar ou recarregar, sempre separando SQL executado de transacao confirmada.
```
