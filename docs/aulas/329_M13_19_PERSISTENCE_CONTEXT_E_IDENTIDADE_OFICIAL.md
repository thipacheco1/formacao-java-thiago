# 329 - M13.19 - Persistence context e identidade

## Apresentacao da aula

Na aula 328, você organizou formalmente o ciclo de vida de uma entidade JPA.

Foram estudados os estados:

```text
NEW;

MANAGED;

DETACHED;

REMOVED.
```

Também foram praticadas transições por:

```text
persist;

find;

merge;

remove;

detach;

clear;

close;

refresh;

commit;

rollback.
```

Agora o foco será o ambiente responsável por gerenciar essas entidades:

```text
persistence context.
```

O persistence context não é apenas um “cache de objetos”.

Ele mantém uma relação controlada entre:

```text
tipo da entidade;

identificador persistente;

instância Java gerenciada.
```

Dentro de um mesmo persistence context, uma entidade de determinada classe e determinado ID possui uma única instância gerenciada.

Exemplo:

```java
ClienteEntity primeiro =
        entityManager.find(
                ClienteEntity.class,
                329001L
        );

ClienteEntity segundo =
        entityManager.find(
                ClienteEntity.class,
                329001L
        );
```

Dentro do mesmo contexto:

```java
primeiro == segundo
```

deve ser:

```text
true.
```

A segunda busca pode ser resolvida pelo cache de primeiro nível, sem novo `SELECT`.

Em outro `EntityManager`, a mesma linha pode ser representada por outra referência Java:

```text
mesma classe;

mesmo ID;

mesma linha;

referências Java diferentes.
```

Essa distinção é essencial para compreender:

- identidade persistente;
- identidade de objeto;
- primeiro nível de cache;
- escopo do contexto;
- entidades desatualizadas;
- `refresh`;
- `clear`;
- `detach`;
- `merge`;
- memória ocupada por contextos longos;
- comportamento entre transações;
- concorrência;
- dirty checking;
- consultas repetidas.

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
formacao_java_jpa_329
```

O schema será:

```text
jpa_329
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade principal será:

```java
ClienteEntity
```

Ela continuará contendo:

```text
DocumentoFiscal;

Endereco;

Dinheiro.
```

O laboratório provará:

```text
dois find no mesmo contexto:
mesma referência;
um SELECT.

find após clear:
nova referência;
novo SELECT.

mesmo ID em dois EntityManagers:
referências diferentes.

detach seguido de find:
objeto antigo detached;
nova instância managed.

atualização JDBC externa:
contexto permanece com estado antigo.

refresh:
estado do banco é recarregado.

merge quando já existe managed:
estado é copiado para a instância já gerenciada.

persist seguido de find no mesmo contexto:
mesma referência;
nenhum SELECT adicional.

close:
encerra o mapa de identidade.
```

A próxima aula será:

```text
330 - M13.20 - Dirty checking
```

Por isso, o dirty checking aparecerá apenas como consequência do gerenciamento.

O aprofundamento sobre snapshots, detecção de mudanças, SQL `UPDATE`, flush mode e colunas modificadas ficará para a aula 330.

Não serão antecipados:

- relacionamentos;
- cascades;
- lazy loading;
- JPQL aprofundada;
- Criteria API;
- cache de segundo nível;
- query cache;
- locks;
- callbacks;
- Spring;
- Spring Data;
- contexto distribuído;
- sessão HTTP como persistence context.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
323:
JPA conceitos fundamentais.

324:
Hibernate como implementação.

325:
Entity, Id, GeneratedValue e Column.

326:
Embeddable e objetos de valor.

327:
EntityManager persist find merge remove.

328:
Ciclo de vida da entidade.

329:
Persistence context e identidade.

330:
Dirty checking.
```

Na aula 327, você estudou os contratos das operações.

Na aula 328, você estudou estados e transições.

Nesta aula, você vai estudar o ambiente que mantém as entidades gerenciadas e garante identidade dentro de uma unidade de trabalho.

Nesta aula:

```text
persistence context:
aprofundado.

identidade persistente:
sim.

identidade Java:
sim.

cache de primeiro nível:
sim.

dois contextos:
sim.

clear:
sim.

detach:
sim.

refresh:
sim.

merge com managed existente:
sim.

contexto application-managed:
sim.

dirty checking aprofundado:
não.

segundo nível:
não.

Spring:
não.
```

A arquitetura permanecerá:

```text
EntityManagerFactory
    -> cria EntityManager
        -> possui persistence context
            -> mantém mapa de identidade
            -> acompanha entidades managed
            -> sincroniza com Hibernate
                -> JDBC
                    -> HikariCP
                        -> PostgreSQL.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-329-persistence-context-identidade
```

Estrutura final:

```text
labs
└── m13
    └── aula-329-persistence-context-identidade
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── mapa-identidade.md
        │   ├── escopo-persistence-context.md
        │   ├── primeiro-nivel-vs-outros-caches.md
        │   └── troubleshooting-contexto.md
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
            │   │                   └── aula329
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── lab
            │   │                       │   ├── IdentityContextLab.java
            │   │                       │   ├── IdentityObservation.java
            │   │                       │   └── IdentityReport.java
            │   │                       ├── observability
            │   │                       │   ├── ExternalJdbcUpdater.java
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
            │               └── V1__criar_schema_jpa_329.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula329
                                        ├── PersistenceContextIdentityIT.java
                                        ├── PersistenceContextRefreshIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
mesmo contexto:
first == second;
um SELECT.

após clear:
first != third;
dois SELECTs acumulados.

dois EntityManagers:
same ID;
referências diferentes.

detach:
contains false;
novo find retorna outra managed.

atualização externa:
segundo find retorna estado antigo.

refresh:
estado externo aparece.

merge:
retorno é a managed já existente.

persist e find:
mesma referência;
zero SELECT para a busca.

estado final:
zero fixtures CLI-JPA-329-%.
```

---

## Conceito essencial

### O que e persistence context

Persistence context é o conjunto de instâncias de entidades gerenciadas por um `EntityManager`.

Ele estabelece uma associação única entre:

```text
tipo da entidade;

identidade persistente;

instância Java.
```

Um modelo mental útil é:

```text
Map<EntityKey, Object>
```

onde:

```text
EntityKey =
classe da entidade + identificador.
```

Exemplo conceitual:

```text
ClienteEntity + 329001
    -> objeto Java A.

ClienteEntity + 329002
    -> objeto Java B.
```

A implementação real do Hibernate é mais complexa, mas esse modelo explica identidade e primeiro nível de cache.

---

### Uma instancia gerenciada por identidade

Dentro do mesmo persistence context:

```text
uma classe + um ID
```

correspondem a uma instância gerenciada.

Se `ClienteEntity` de ID `329001` já está no contexto, outra chamada `find` para a mesma chave retorna a instância existente.

Isso preserva:

- identidade de objeto;
- consistência das mudanças em memória;
- dirty checking;
- ausência de representações concorrentes da mesma linha dentro do contexto.

---

### Identidade persistente

Identidade persistente é a chave usada para distinguir a linha da entidade no banco.

No laboratório:

```java
@Id
private Long id;
```

Para uma entidade gerenciada:

```text
classe:
ClienteEntity.

ID:
329001.
```

Esse par identifica a entidade no contexto.

O ID sozinho não é suficiente quando duas classes diferentes podem possuir o mesmo número.

---

### Identidade de referencia Java

Identidade de referência é comparada por:

```java
==
```

Exemplo:

```java
primeiro == segundo
```

Isso pergunta se as duas variáveis apontam para o mesmo objeto na memória.

Dentro do mesmo contexto e para a mesma identidade persistente:

```text
esperado:
true.
```

Em contextos diferentes:

```text
esperado:
false.
```

Mesmo que os dois objetos representem a mesma linha.

---

### equals nao substitui identidade do contexto

Uma entidade pode ou não sobrescrever `equals`.

O persistence context não depende de um `equals` de negócio para garantir uma instância por ID.

Nesta formação, a entidade continua sem `equals` e `hashCode` automáticos baseados em todos os campos.

Objetos de valor possuem igualdade por valor.

Entidades possuem identidade persistente.

Não use:

```java
cliente1.equals(cliente2)
```

como substituto universal de:

```text
mesmo contexto?

mesma referência?

mesmo ID?

mesma entidade de negócio?
```

Cada pergunta é diferente.

---

### Cache de primeiro nivel

O persistence context também é chamado de cache de primeiro nível.

Características:

```text
obrigatório;

associado ao EntityManager;

não compartilhado entre EntityManagers;

vida igual ao contexto;

armazena entidades gerenciadas;

não pode ser desativado.
```

Quando `find` encontra a entidade no contexto, o provider pode evitar o banco.

Isso reduz consultas repetidas dentro da mesma unidade.

---

### Primeiro nivel nao e query cache

O cache de primeiro nível mantém entidades por identidade.

Ele não significa que toda consulta textual será evitada.

Uma consulta JPQL pode ser executada novamente para descobrir quais IDs satisfazem os critérios, mesmo que algumas entidades já estejam gerenciadas.

Ao materializar um ID já presente, o contexto reutiliza a instância managed.

A aula não praticará JPQL ainda.

A distinção precisa ser conhecida desde agora:

```text
entity cache:
identidade.

query cache:
resultado de consulta.
```

---

### Primeiro nivel nao e segundo nivel

Cache de segundo nível é opcional e pode ser compartilhado entre contextos de uma mesma fábrica, conforme provider e configuração.

Nesta aula:

```text
shared-cache-mode:
NONE.
```

Portanto:

```text
EntityManager A:
não entrega sua instância ao B.

EntityManager B:
pode executar outro SELECT.
```

Mesmo ID em dois contextos gera duas instâncias Java.

---

### Escopo application-managed

Em Java SE:

```java
EntityManager entityManager =
        factory.createEntityManager();
```

A aplicação controla o contexto.

Ele existe desde a criação do manager até:

```java
entityManager.close();
```

Ele pode atravessar várias transações.

Isso significa:

```text
commit não limpa automaticamente;

commit não fecha automaticamente;

entidades podem continuar managed.
```

Essa capacidade não é recomendação para manter um manager aberto por toda a aplicação.

---

### Contexto transaction-scoped conceitual

Em ambientes container-managed, um persistence context pode ter escopo de transação.

Nesse modelo, as entidades deixam de ser managed quando o contexto termina com a transação.

A aula não implementará JTA nem container.

O conceito serve para evitar generalização errada:

```text
commit sempre mantém managed
```

ou:

```text
commit sempre detached.
```

A resposta depende do escopo do contexto.

---

### Find e o mapa de identidade

Fluxo simplificado:

1. receber classe e ID;
2. procurar no persistence context;
3. se encontrado, retornar a instância;
4. se não encontrado, consultar banco;
5. criar entidade;
6. registrar no contexto;
7. retornar.

Essa ordem explica por que uma atualização externa ao banco pode não aparecer em um segundo `find` no mesmo contexto.

---

### Estado potencialmente desatualizado

Considere:

1. EntityManager A busca Cliente;
2. JDBC externo atualiza o nome e confirma;
3. EntityManager A chama `find` novamente.

Como o objeto já está no contexto:

```text
o segundo find pode retornar a mesma instância antiga;
nenhum SELECT adicional;
nome antigo em memória.
```

O persistence context não consulta o banco a cada getter ou a cada `find`.

Isso preserva consistência interna da unidade, mas pode manter estado desatualizado em relação a alterações externas.

---

### Refresh

`refresh` força a recarga da entidade gerenciada:

```java
entityManager.refresh(cliente);
```

Efeitos:

- executa leitura;
- substitui atributos pelo estado atual do banco;
- descarta mudanças locais ainda não sincronizadas;
- mantém a entidade managed;
- preserva a mesma referência Java.

Depois do refresh:

```text
referência:
a mesma.

estado:
recarregado.
```

Use somente quando a regra precisa sincronizar explicitamente com o banco.

---

### Clear

`clear` remove todas as entidades do persistence context:

```java
entityManager.clear();
```

Depois:

```text
contains false;

objetos detached;

mapa de identidade vazio.
```

Uma nova chamada `find`:

- executa novo SELECT;
- cria nova instância;
- registra novo mapa;
- retorna referência diferente.

Alterações pendentes não sincronizadas podem ser perdidas.

---

### Detach

`detach` remove apenas uma entidade específica:

```java
entityManager.detach(cliente);
```

Outras entidades permanecem managed.

Se um novo `find` buscar a mesma classe e ID, o provider pode criar outra instância managed.

Resultado:

```text
objeto antigo:
detached.

objeto novo:
managed.

mesma identidade persistente;
referências diferentes.
```

O código precisa evitar misturar as duas referências.

---

### Close

`close` encerra completamente o contexto application-managed.

Todas as entidades deixam de ser gerenciadas.

O mapa de identidade é descartado.

O `EntityManager` não pode ser reutilizado.

Uma nova unidade exige:

```java
factory.createEntityManager();
```

---

### Persist e identidade no mesmo contexto

Fluxo:

```java
entityManager.persist(novoCliente);

Long id =
        novoCliente.getId();

ClienteEntity encontrado =
        entityManager.find(
                ClienteEntity.class,
                id
        );
```

Como o objeto já está managed:

```text
encontrado == novoCliente:
true.
```

Nenhum SELECT deve ser necessário para localizar a entidade que já está no contexto.

Dependendo da estratégia de ID, pode existir SQL para obter a sequence e INSERT no flush.

A busca em si não precisa consultar novamente.

---

### Merge quando ja existe managed

Considere:

1. objeto detached representa ID `329001`;
2. outro `EntityManager` já possui uma instância managed do mesmo ID;
3. `merge(detached)` é executado.

O provider copia o estado para a instância managed existente.

O retorno do merge deve ser essa instância managed.

Exemplo:

```java
ClienteEntity existente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

ClienteEntity resultado =
        entityManager.merge(
                detached
        );

resultado == existente
```

Esperado:

```text
true.
```

O argumento detached continua fora do contexto.

---

### Duas instancias da mesma identidade fora do contexto

É possível ter:

```text
objeto detached A;

objeto detached B;

mesma classe;

mesmo ID;

referências diferentes.
```

JPA não mantém uma identidade global na JVM.

A garantia vale dentro de um persistence context.

Isso é importante ao transportar entidades entre camadas, serializar objetos ou manter contextos longos.

---

### NonUniqueObject e conflito conceitual

A API JPA evita manter duas instâncias managed para a mesma identidade no mesmo contexto.

Operações que tentam introduzir um segundo objeto podem:

- copiar estado por merge;
- falhar;
- manter o existente;
- depender do contrato da operação.

Não tente contornar o mapa de identidade com reflection ou setters de ID.

Use as operações corretas.

---

### Memoria e contexto longo

Cada entidade managed exige:

- referência;
- metadados;
- snapshot para dirty checking;
- associações internas;
- possíveis coleções futuras.

Carregar milhares de entidades sem limpar o contexto pode aumentar memória e tempo de flush.

Em processamento em lote, uma estratégia comum é:

```text
processar bloco;

flush;

clear;

continuar.
```

Essa técnica será aprofundada em aulas de performance e batching.

Nesta aula, contextos serão pequenos e explícitos.

---

### Isolamento do banco e persistence context

Nível de isolamento do banco e cache de primeiro nível são mecanismos diferentes.

O PostgreSQL pode estar em:

```text
READ COMMITTED.
```

Mesmo assim, um `find` repetido pode não executar nova query porque a entidade já está no contexto.

Para observar uma alteração externa, pode ser necessário:

```text
refresh;

clear + find;

novo EntityManager.
```

Não confunda:

```text
banco permitir nova leitura
```

com:

```text
ORM decidir executar nova leitura.
```

---

### Unidade de trabalho

O persistence context deve acompanhar uma unidade de trabalho coerente.

Fluxo recomendado:

```text
criar EntityManager;

iniciar transação;

carregar entidades;

executar regra;

flush e commit;

fechar EntityManager.
```

Um contexto curto reduz:

- estado antigo;
- crescimento de memória;
- referências duplicadas fora do escopo;
- conflitos de uso;
- retenção de recursos.

---

### Identidade e dirty checking

O dirty checking depende da instância managed mantida no contexto.

Quando a entidade muda:

```java
managed.alterarNome(
        "Novo nome"
);
```

o provider compara o estado atual com seu snapshot.

A aula 330 aprofundará:

- quando o snapshot é criado;
- quando o update ocorre;
- flush;
- mudanças reais;
- colunas;
- objetos embutidos;
- update desnecessário;
- otimização;
- versionamento.

Nesta aula, basta entender que a identidade única permite acompanhar uma representação coerente da entidade.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\java\br\com\formacao\m13\aula329\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\java\br\com\formacao\m13\aula329\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\java\br\com\formacao\m13\aula329\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\java\br\com\formacao\m13\aula329\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\java\br\com\formacao\m13\aula329\valueobject"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-329-persistence-context-identidade\src\test\java\br\com\formacao\m13\aula329"

Set-Location `
  "labs\m13\aula-329-persistence-context-identidade"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 328.

Ajuste:

```text
artifactId:
aula-329-persistence-context-identidade.

persistence unit:
aula329PU.

Main:
br.com.formacao.m13.aula329.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_329
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-329-jpa
JPA_POOL_NAME=aula-329-pool
JPA_POOL_SIZE=4
```

O pool terá quatro conexões para permitir uma atualização JDBC externa enquanto o `EntityManager` permanece aberto.

---

### 3. Criar migration

Reutilize a tabela Cliente da aula 328.

Ajustes:

```text
schema:
jpa_329.

sequence:
jpa_329.cliente_id_seq.

start:
329001.
```

Mantenha:

- código;
- nome;
- documento;
- endereços;
- limite;
- versão;
- criado em.

Não altere o modelo nesta aula.

---

### 4. Reutilizar entidade e objetos de valor

Copie:

```text
ClienteEntity;

DocumentoFiscal;

Endereco;

Dinheiro.
```

Ajuste packages, schema e sequence.

Mantenha:

```java
alterarNome;

alterarLimiteCredito;

alterarEnderecoCobranca.
```

Não adicione `equals` e `hashCode` à entidade.

A identidade do laboratório será observada por:

```text
ID;

referência;

persistence context.
```

---

### 5. Criar persistence.xml e runtime

A persistence unit será:

```text
aula329PU.
```

Use:

```text
RESOURCE_LOCAL;

HibernatePersistenceProvider;

exclude-unlisted-classes true;

shared-cache-mode NONE;

validation-mode NONE.
```

Reutilize:

```text
JpaRuntime;

JpaRuntimeFactory;

SqlCaptureInspector.
```

O runtime deve expor também o `HikariDataSource` para o `ExternalJdbcUpdater`.

Propriedades Hibernate:

```text
hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true;

hibernate.show_sql=false;

statement inspector.
```

---

### 6. Criar ExternalJdbcUpdater.java

```java
package br.com.formacao.m13.aula329.observability;

import java.sql.SQLException;

import javax.sql.DataSource;

public final class ExternalJdbcUpdater {

    private final DataSource dataSource;

    public ExternalJdbcUpdater(
            DataSource dataSource
    ) {
        this.dataSource = dataSource;
    }

    public void updateName(
            long clienteId,
            String novoNome
    ) {
        String sql = """
                UPDATE jpa_329.cliente
                SET
                    nome = ?,
                    versao = versao + 1
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

            int affected =
                    statement.executeUpdate();

            if (affected != 1) {
                throw new IllegalStateException(
                        "Cliente externo não atualizado"
                );
            }
        } catch (SQLException exception) {
            throw new IllegalStateException(
                    "Falha na atualização JDBC externa",
                    exception
            );
        }
    }
}
```

A conexão JDBC usa autocommit padrão do pool.

A atualização representa outro consumidor do banco.

---

### 7. Criar IdentityObservation.java

```java
package br.com.formacao.m13.aula329.lab;

public record IdentityObservation(
        String etapa,
        long id,
        int firstIdentityHash,
        int secondIdentityHash,
        boolean sameReference,
        long selectCount,
        String nomeObservado
) {

    public IdentityObservation {
        if (
            etapa == null
            || etapa.isBlank()
            || id <= 0
        ) {
            throw new IllegalArgumentException(
                    "Observação inválida"
            );
        }
    }
}
```

Use:

```java
System.identityHashCode(object)
```

apenas como evidência didática.

O valor não é identidade persistente e não deve ser salvo.

---

### 8. Criar IdentityReport.java

```java
package br.com.formacao.m13.aula329.lab;

import java.util.List;

public record IdentityReport(
        List<IdentityObservation> observations,
        boolean sameContextSameReference,
        boolean clearCreatedNewReference,
        boolean differentContextsDifferentReferences,
        boolean detachCreatedNewManagedReference,
        boolean staleStateObserved,
        boolean refreshLoadedExternalState,
        boolean mergeReusedExistingManagedInstance,
        boolean persistThenFindReusedInstance
) {

    public IdentityReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar fixture principal

No começo do laboratório, persista:

```text
CLI-JPA-329-MAIN.
```

Dados:

```text
nome:
Cliente identidade inicial.

documento:
CPF 32932932901.

endereço:
Rua do Contexto, 329, Centro,
Barueri, SP, 06400000.

limite:
3290.00 BRL.
```

Confirme a transação.

Depois do commit, feche o manager para iniciar os testes com contextos controlados.

---

### 10. Implementar mesmo contexto

Abra um `EntityManager`.

Limpe o inspector.

Execute:

```java
ClienteEntity first =
        entityManager.find(
                ClienteEntity.class,
                id
        );

ClienteEntity second =
        entityManager.find(
                ClienteEntity.class,
                id
        );
```

Confirme:

```text
first == second;

identityHash igual;

select count igual a 1;

contains true para ambos.
```

Registre a observação.

Feche o manager.

---

### 11. Implementar clear

Abra outro manager.

Limpe o inspector.

Execute primeiro `find`.

Guarde a referência.

Execute:

```java
entityManager.clear();
```

Confirme:

```text
contains false.
```

Execute outro `find`.

Confirme:

```text
referências diferentes;

mesmo ID;

select count 2;

segunda referência managed.
```

Registre a observação.

---

### 12. Implementar dois contextos

Abra:

```java
EntityManager firstManager;
EntityManager secondManager;
```

Busque o mesmo ID em ambos.

Confirme:

```text
first != second;

IDs iguais;

cada manager contém sua própria entidade;

firstManager não contém second;

secondManager não contém first.
```

Essa última verificação mostra que `contains` é relativo ao contexto atual.

Feche ambos.

---

### 13. Implementar detach e novo find

Abra um manager.

Busque a entidade.

Execute:

```java
entityManager.detach(first);
```

Confirme:

```text
contains false.
```

Busque novamente o mesmo ID.

Confirme:

```text
second != first;

second managed;

first detached;

mesmo ID.
```

Altere o objeto antigo detached.

Faça uma transação vazia e commit.

Confirme em novo manager que a mudança do detached não foi persistida.

---

### 14. Implementar estado desatualizado

Abra um manager e busque Cliente.

Guarde:

```text
nome antigo;

versão antiga.
```

Sem fechar esse manager, execute:

```java
externalJdbcUpdater.updateName(
        id,
        "Nome atualizado externamente"
);
```

No mesmo manager, execute `find` novamente.

Confirme:

```text
mesma referência;

nome antigo ainda visível;

nenhum SELECT adicional.
```

Isso prova que o contexto não é atualizado automaticamente por outra conexão.

---

### 15. Implementar refresh

Ainda com a entidade managed:

```java
entityManager.refresh(first);
```

Confirme:

```text
mesma referência;

nome externo visível;

versão incrementada;

novo SELECT observado.
```

Não altere localmente antes do refresh nessa etapa.

O objetivo é sincronizar com o banco.

Feche o manager.

---

### 16. Implementar merge com managed existente

Crie um objeto detached real:

1. abra manager A;
2. busque entidade;
3. feche manager A;
4. altere o nome no objeto detached.

Abra manager B e transação.

Busque a mesma entidade:

```java
ClienteEntity existingManaged =
        managerB.find(
                ClienteEntity.class,
                id
        );
```

Execute:

```java
ClienteEntity merged =
        managerB.merge(
                detached
        );
```

Confirme:

```text
merged == existingManaged;

managerB.contains(merged) true;

managerB.contains(detached) false.
```

Faça commit.

Em novo manager, confirme o nome copiado.

---

### 17. Implementar persist e find

Crie uma segunda entidade:

```text
CLI-JPA-329-PERSIST-FIND.
```

Abra manager e transação.

Execute:

```java
entityManager.persist(newClient);
```

Guarde ID.

Limpe o inspector depois do SQL de sequence e antes do `find`, sem executar `clear`.

Execute:

```java
ClienteEntity found =
        entityManager.find(
                ClienteEntity.class,
                newClient.getId()
        );
```

Confirme:

```text
found == newClient;

select count zero.
```

Execute rollback.

A entidade Java pode manter ID, mas a linha não fica no banco.

Descarte a instância.

---

### 18. Remover fixture principal

Abra novo manager e transação.

Busque a fixture principal.

Execute `remove`.

Commit.

Confirme em outro manager que `find` retorna `null`.

O laboratório termina sem fixtures.

---

### 19. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. cria `ExternalJdbcUpdater`;
4. executa `IdentityContextLab`;
5. imprime as observações;
6. imprime os booleanos;
7. fecha runtime;
8. não imprime documento completo;
9. não imprime SQL integral.

Formato:

```text
etapa | id | hash1 | hash2 | mesma referencia | SELECTs
```

Explique no console:

```text
identityHash é evidência da instância,
não ID persistente.
```

---

### 20. Criar PersistenceContextIdentityIT.java

Casos obrigatórios:

#### Mesmo contexto

- criar fixture;
- buscar duas vezes;
- confirmar `==`;
- confirmar um SELECT.

#### Clear

- buscar;
- clear;
- buscar;
- confirmar referências diferentes;
- confirmar dois SELECTs.

#### Contextos diferentes

- abrir dois managers;
- buscar mesmo ID;
- confirmar IDs iguais;
- confirmar referências diferentes;
- confirmar `contains` relativo.

#### Detach

- buscar;
- detach;
- buscar;
- confirmar nova managed;
- confirmar antiga detached.

#### Persist e find

- persistir nova;
- find pelo ID;
- confirmar mesma referência;
- confirmar zero SELECT na busca;
- rollback;
- confirmar ausência.

#### Merge com existing managed

- detached de manager anterior;
- existing managed no atual;
- merge;
- confirmar retorno igual ao existing managed;
- confirmar argumento detached.

---

### 21. Criar PersistenceContextRefreshIT.java

#### Estado stale

1. criar fixture;
2. buscar em manager A;
3. atualizar por JDBC;
4. buscar novamente em A;
5. confirmar mesma referência;
6. confirmar nome antigo;
7. confirmar nenhuma nova leitura de entidade.

#### Refresh

1. continuar no manager A;
2. refresh;
3. confirmar mesmo objeto;
4. confirmar nome novo;
5. confirmar versão nova.

#### Novo contexto

1. atualizar externamente;
2. fechar manager antigo;
3. abrir novo manager;
4. find;
5. confirmar estado mais recente.

#### Clear e nova leitura

1. carregar estado antigo;
2. atualizar externamente;
3. clear;
4. find;
5. confirmar estado novo.

Esses testes diferenciam:

```text
refresh;

clear + find;

novo EntityManager.
```

---

### 22. Criar TestDataCleaner.java

Limpe apenas:

```sql
DELETE FROM jpa_329.cliente
WHERE codigo LIKE 'CLI-JPA-329-%'
```

Use antes e depois de cada teste.

---

### 23. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_329.
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
zero CLI-JPA-329-%;

schema history com V1;

tabela cliente existente.
```

`05_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 24. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
mesmo contexto preservou referência;

clear criou nova instância;

dois contexts criaram referências diferentes;

detach permitiu nova managed;

estado externo ficou stale;

refresh recarregou;

merge reutilizou managed existente;

persist seguido de find reutilizou instância;

estado final ficou limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 25. Criar documentacao

`mapa-identidade.md` deve mostrar:

```text
EntityManager A:
ClienteEntity + 329001 -> objeto A.

EntityManager B:
ClienteEntity + 329001 -> objeto B.
```

Inclua:

```text
A != B;

A.id == B.id.
```

`escopo-persistence-context.md` deve comparar:

- application-managed;
- transaction-scoped conceitual;
- vida;
- commit;
- close;
- clear;
- riscos de contexto longo.

`primeiro-nivel-vs-outros-caches.md` deve comparar:

```text
primeiro nível;

segundo nível;

query cache;

cache da aplicação;

cache do banco.
```

Somente o primeiro nível é usado no laboratório.

`troubleshooting-contexto.md` deve cobrir:

- SELECT não executado;
- estado externo não aparece;
- `contains` false;
- referências diferentes;
- merge retornando objeto existente;
- clear descartando mudanças;
- memória crescendo;
- manager longo;
- confusão entre `equals` e `==`;
- cache de primeiro nível confundido com query cache.

---

## Entendendo o que foi feito

### O contexto foi tratado como mapa de identidade

Classe e ID apontaram para uma única instância managed dentro do mesmo manager.

### O primeiro nivel foi comprovado

Dois `find` produziram um SELECT e a mesma referência.

### O escopo ficou visivel

Outro manager produziu outra referência para a mesma linha.

### Estado externo nao foi sincronizado automaticamente

O objeto permaneceu stale até `refresh`, `clear` ou novo contexto.

### Merge reutilizou a instancia existente

Quando o contexto já possuía o ID, o retorno foi a referência managed existente.

---

## Erros comuns importantes

### Achar que existe uma instancia global por ID

A garantia vale somente dentro de um persistence context.

### Achar que find sempre consulta o banco

O primeiro nível pode resolver a busca.

### Achar que READ COMMITTED força novo SELECT

O ORM pode retornar a entidade já gerenciada.

### Comparar entidades somente por equals

Pergunte se precisa de referência, ID ou igualdade de negócio.

### Manter contexto longo sem controle

Isso aumenta memória e risco de estado desatualizado.

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

### Consultar fixture

```sql
SELECT
    id,
    codigo,
    nome,
    versao
FROM jpa_329.cliente
WHERE codigo LIKE 'CLI-JPA-329-%'
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — Tres finds

Busque a mesma entidade três vezes no mesmo contexto.

Confirme:

```text
uma referência;

um SELECT.
```

### Parte 2 — Clear com mudanca pendente

Carregue, altere sem flush, execute clear e commit.

Confirme que a mudança não foi persistida.

Explique por que o objeto ficou detached.

### Parte 3 — Refresh e alteracao local

Carregue, altere localmente e execute refresh.

Confirme que o banco sobrescreveu a mudança não sincronizada.

### Parte 4 — Dois contexts e updates

Abra dois managers.

Carregue o mesmo ID.

Altere e confirme no primeiro.

Observe o segundo ainda com estado antigo.

Use refresh no segundo.

Não introduza lock nesta aula.

### Parte 5 — Merge

Mantenha uma entidade managed no contexto.

Crie uma detached da mesma identidade em contexto anterior.

Faça merge.

Confirme que o retorno é a managed existente.

### Parte 6 — Processamento em lote conceitual

Crie cem fixtures em base descartável.

A cada vinte:

```text
flush;

clear.
```

Observe o tamanho lógico do contexto por `contains` das referências antigas.

Não transforme este exercício em benchmark.

### Parte 7 — Cache de segundo nivel

Pesquise apenas na documentação local do projeto quais configurações ativariam cache de segundo nível.

Não ative.

Documente por que ele não é necessário neste estágio.

### Parte 8 — Diagrama

Desenhe dois managers com a mesma identidade persistente e objetos diferentes.

Inclua:

```text
ID;

identityHashCode;

contains;

SELECT count.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 329 existe;
- continuidade com a aula 328 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_329` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi reutilizada;
- objetos de valor foram reutilizados;
- persistence context foi definido;
- mapa de identidade foi explicado;
- identidade persistente foi explicada;
- identidade de referência foi explicada;
- classe e ID foram usados como chave conceitual;
- `equals` foi diferenciado de `==`;
- primeiro nível de cache foi explicado;
- primeiro nível foi diferenciado de query cache;
- primeiro nível foi diferenciado de segundo nível;
- shared cache ficou NONE;
- mesmo contexto retornou a mesma referência;
- dois finds geraram um SELECT;
- clear esvaziou o contexto;
- find após clear gerou nova referência;
- find após clear gerou novo SELECT;
- dois managers geraram referências diferentes;
- IDs permaneceram iguais;
- `contains` foi relativo ao contexto;
- detach desanexou uma entidade;
- find após detach criou nova managed;
- objeto antigo permaneceu detached;
- mudança detached não foi persistida;
- atualização JDBC externa foi criada;
- contexto manteve estado antigo;
- segundo find não recarregou;
- refresh manteve a referência;
- refresh carregou estado externo;
- clear + find carregou estado externo;
- novo manager carregou estado externo;
- merge com managed existente foi praticado;
- retorno do merge foi a managed existente;
- argumento original permaneceu detached;
- persist seguido de find reutilizou a mesma instância;
- busca após persist não executou SELECT;
- rollback removeu a fixture de persist e find;
- contexto application-managed foi explicado;
- contexto transaction-scoped foi explicado conceitualmente;
- commit não foi confundido com close;
- contexto longo foi desaconselhado;
- crescimento de memória foi discutido;
- isolamento do banco foi diferenciado do cache;
- dirty checking foi apenas conectado conceitualmente;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou vazio;
- relacionamentos não foram antecipados;
- query cache não foi ativado;
- segundo nível não foi ativado;
- locks não foram antecipados;
- Spring não foi usado;
- ponte para a aula 330 está correta;
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
  labs/m13/aula-329-persistence-context-identidade
```

Commit recomendado:

```powershell
git commit -m "feat(m13): praticar persistence context e identidade"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou o ambiente responsável por gerenciar entidades JPA.

Aprendeu:

```text
persistence context:
conjunto de entidades managed.

mapa de identidade:
classe e ID para uma instância.

identidade persistente:
classe e chave.

identidade Java:
mesma referência por ==.

primeiro nível:
cache obrigatório por contexto.

clear:
remove todas do contexto.

detach:
remove uma entidade.

refresh:
recarrega o banco.

close:
encerra o contexto.
```

O laboratório comprovou:

```text
dois find no mesmo contexto:
mesma referência.

find depois de clear:
nova referência.

dois EntityManagers:
duas referências para a mesma linha.

detach:
objeto antigo fora e novo managed dentro.

atualização externa:
estado antigo no contexto.

refresh:
estado novo na mesma referência.

merge:
reuso da managed existente.

persist e find:
mesmo objeto sem novo SELECT.
```

A próxima aula será:

```text
330 - M13.20 - Dirty checking
```

Nela, você aprofundará:

- snapshot de estado;
- detecção automática de mudanças;
- entidades managed;
- momento do `UPDATE`;
- flush automático e explícito;
- commit;
- mudança real versus atribuição igual;
- embeddables;
- `@Version`;
- SQL gerado;
- colunas atualizadas;
- efeitos de `clear`;
- detached sem update;
- read only;
- custo do dirty checking;
- contextos grandes;
- testes com estatísticas e inspector.

O persistence context mantém a instância.

O dirty checking observa o que mudou nessa instância.

---

# Material complementar

## Checkpoint final

- [ ] Expliquei persistence context como mapa de identidade.
- [ ] Comprovei mesma referência dentro do mesmo manager.
- [ ] Comprovei referências diferentes em managers distintos.
- [ ] Usei refresh, clear e detach conscientemente.
- [ ] Diferenciei primeiro nível, isolamento e estado do banco.

---

## Troubleshooting adicional

### O segundo find nao executou SELECT

A entidade já estava no primeiro nível.

### O banco mudou, mas o objeto nao

Use refresh, clear ou novo contexto conforme a regra.

### Dois objetos possuem mesmo ID

Eles podem vir de contexts diferentes ou estar detached.

### contains retorna false

A instância não pertence ao manager consultado.

### Merge retornou objeto que ja existia

O contexto já possuía uma managed para aquela identidade.

---

## Perguntas de revisao

1. O que é persistence context?
2. Qual é a chave conceitual do mapa?
3. O que garante uma instância por ID?
4. O que compara `==`?
5. ID igual implica referência igual?
6. Quando a referência é igual?
7. O que é cache de primeiro nível?
8. Ele pode ser desativado?
9. Ele é compartilhado?
10. É query cache?
11. O que clear faz?
12. O que detach faz?
13. O que close faz?
14. O que refresh faz?
15. Find sempre consulta o banco?
16. Atualização externa aparece automaticamente?
17. Dois managers podem ter objetos diferentes?
18. Commit fecha o manager?
19. Contexto longo é sempre recomendado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Conjunto de entidades gerenciadas.
2. Classe e ID.
3. O persistence context.
4. Identidade de referência.
5. Não.
6. No mesmo contexto para mesma identidade.
7. Cache por identidade do manager.
8. Não.
9. Não entre managers.
10. Não.
11. Desanexa todas.
12. Desanexa uma.
13. Encerra o contexto.
14. Recarrega o banco.
15. Não.
16. Não.
17. Sim.
18. Não necessariamente.
19. Não.
20. Dirty checking.

---

## Desafio opcional

Crie:

```java
PersistenceContextIdentityTracer
```

Entrada:

```text
nome da etapa;

EntityManager;

duas entidades.
```

Saída:

```text
IDs;

identityHashCodes;

sameReference;

containsFirst;

containsSecond;

managerOpen.
```

Regras:

- não inferir igualdade de negócio;
- não acessar documento;
- não persistir o hash;
- lista imutável;
- testes unitários;
- nenhuma API nativa Hibernate;
- tratar manager fechado sem chamar `contains`;
- exportar Markdown determinístico.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 329 - M13.19 - Persistence context e identidade

- Aprofundei o conceito de persistence context.
- Modelei o contexto como mapa de identidade.
- Entendi a chave conceitual formada por classe e ID.
- Diferenciei identidade persistente de referência Java.
- Diferenciei `equals` de `==`.
- Entendi uma instância managed por identidade no mesmo contexto.
- Estudei o cache de primeiro nível.
- Entendi que o primeiro nível é obrigatório.
- Entendi que ele pertence ao EntityManager.
- Diferenciei primeiro nível de query cache.
- Diferenciei primeiro nível de segundo nível.
- Mantive shared cache desativado.
- Comprovei dois finds com a mesma referência.
- Comprovei um único SELECT no mesmo contexto.
- Usei `clear` para esvaziar o contexto.
- Observei nova referência depois de clear.
- Comparei a mesma linha em dois EntityManagers.
- Observei referências diferentes com IDs iguais.
- Entendi que `contains` é relativo ao contexto.
- Usei `detach` em uma entidade.
- Busquei nova managed depois do detach.
- Confirmei que mudança detached não sincroniza.
- Simulei atualização JDBC externa.
- Observei estado desatualizado no contexto.
- Usei `refresh` para recarregar o banco.
- Usei novo contexto para obter estado recente.
- Usei `merge` com managed existente.
- Confirmei que o retorno reutilizou a instância managed.
- Usei persist seguido de find sem novo SELECT.
- Entendi riscos de contexto longo.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei cache de segundo nível, locks ou Spring.
- Próxima aula: dirty checking.
```

---

## Referencia tecnica curta

```text
Persistence context:
mapa de entidades managed.

Entity key:
classe + ID.

Java identity:
referência.

Persistent identity:
chave do banco.

First-level cache:
por EntityManager.

find:
consulta o contexto antes do banco.

clear:
esvazia.

detach:
remove uma.

refresh:
recarrega.

close:
encerra.
```

Regra final:

```text
o persistence context garante uma unica instancia gerenciada por classe e identificador dentro de seu escopo; essa identidade local melhora consistencia e evita leituras repetidas, mas exige cuidado com estado desatualizado, contextos longos e referencias vindas de managers diferentes.
```
