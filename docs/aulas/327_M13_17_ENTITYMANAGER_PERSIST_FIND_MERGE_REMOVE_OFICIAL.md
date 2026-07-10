# 327 - M13.17 - EntityManager persist find merge remove

## Apresentacao da aula

Na aula 326, você criou objetos de valor persistidos com:

```text
@Embeddable;

@Embedded;

@AttributeOverride;

@AttributeOverrides.
```

O modelo passou a representar:

```text
DocumentoFiscal;

Endereco;

Dinheiro.
```

Esses objetos foram incorporados em `ClienteEntity`, persistidos na mesma tabela e protegidos por constraints criadas com Flyway.

Nesta aula, o foco deixa de ser o mapeamento e passa a ser o uso operacional do:

```java
EntityManager
```

As quatro operações centrais serão aprofundadas:

```java
persist
find
merge
remove
```

Elas parecem simples, mas possuem contratos diferentes.

`persist` não retorna a entidade.

`find` busca por identidade e pode devolver `null`.

`merge` devolve uma instância gerenciada que pode ser diferente do argumento.

`remove` exige uma entidade gerenciada.

Além disso, todas interagem com:

- persistence context;
- transação;
- flush;
- dirty checking;
- primeiro nível de cache;
- constraints;
- rollback;
- exceções;
- identidade;
- objetos detached;
- estado do `EntityManager`.

O objetivo desta aula é eliminar erros comuns como:

```java
entityManager.merge(cliente);
cliente.alterarNome("Outro nome");
```

ou:

```java
entityManager.remove(clienteDetached);
```

ou:

```java
entityManager.persist(cliente);
entityManager.close();
transaction.commit();
```

ou ainda:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

cliente.getNome();
```

sem verificar se a busca retornou `null`.

O laboratório continuará sem Spring.

A infraestrutura permanecerá:

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
formacao_java_jpa_327
```

O schema será:

```text
jpa_327
```

Flyway seguirá como dono do DDL.

Hibernate continuará em:

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
persist:
nova entidade;
ID gerado;
argumento torna-se managed;
retorno void.

find:
busca por ID;
retorno entidade ou null;
primeiro nível de cache;
nenhum INSERT ou UPDATE.

merge:
copia estado;
retorna managed;
argumento original continua detached;
pode gerar SELECT e UPDATE.

remove:
exige managed;
marca remoção;
DELETE ocorre no flush ou commit.
```

Também serão praticados:

- transação resource-local;
- método utilitário para rollback;
- `flush` explícito;
- validação de exceções;
- tentativa de `persist` em entidade detached;
- tentativa de `remove` em entidade detached;
- `merge` com ID inexistente;
- uso correto do retorno de `merge`;
- exclusão por `find` seguido de `remove`;
- testes que comprovam SQL e estado no banco;
- limpeza segura de fixtures.

A próxima aula será:

```text
328 - M13.18 - Ciclo de vida da entidade
```

Ela aprofundará as transições formais entre:

```text
transient;

managed;

detached;

removed.
```

Por isso, esta aula tratará os estados apenas como consequência direta das operações, sem transformar o conteúdo em uma teoria completa de lifecycle.

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
```

Na aula 323, você teve o primeiro contato com essas operações.

Agora elas serão estudadas como contratos de API, com cenários corretos e incorretos.

Nesta aula:

```text
EntityManager:
sim.

persist:
aprofundado.

find:
aprofundado.

merge:
aprofundado.

remove:
aprofundado.

flush:
sim.

rollback:
sim.

exceções:
sim.

ciclo de vida completo:
não.

callbacks:
não.

relacionamentos:
não.

Spring:
não.
```

A arquitetura permanecerá:

```text
Main
    -> EntityManagerFactory
        -> EntityManager
            -> persistence context
                -> Hibernate
                    -> HikariCP
                        -> PostgreSQL.
```

Flyway continuará fora do runtime JPA.

A migration será executada antes da aplicação.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-327-entitymanager-persist-find-merge-remove
```

Estrutura final:

```text
labs
└── m13
    └── aula-327-entitymanager-persist-find-merge-remove
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-persist.md
        │   ├── contrato-find.md
        │   ├── contrato-merge.md
        │   ├── contrato-remove.md
        │   └── troubleshooting-entitymanager.md
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
            │   │                   └── aula327
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── lab
            │   │                       │   ├── EntityManagerOperationsLab.java
            │   │                       │   └── OperationsReport.java
            │   │                       ├── observability
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
            │               └── V1__criar_schema_jpa_327.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula327
                                        ├── EntityManagerOperationsIT.java
                                        ├── EntityManagerErrorCasesIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
persist:
ID gerado;
contains true;
INSERT confirmado.

find existente:
entidade retornada.

find inexistente:
null.

find repetido:
mesma referência;
um SELECT.

merge:
argumento detached;
retorno managed;
referências diferentes;
UPDATE confirmado.

remove:
entidade managed;
DELETE confirmado.

persist detached:
falha.

remove detached:
falha.

estado final:
zero fixtures CLI-JPA-327-%.
```

---

## Conceito essencial

### EntityManager como porta de operacoes JPA

`EntityManager` é a interface central para manipular entidades dentro de um persistence context.

Operações principais:

```java
persist
find
merge
remove
flush
clear
detach
contains
refresh
```

Nesta aula, o núcleo será:

```java
persist
find
merge
remove
```

O `EntityManager` não deve ser:

- global;
- estático;
- compartilhado entre threads;
- reutilizado depois de fechado;
- mantido aberto indefinidamente.

Ele deve acompanhar uma unidade de trabalho curta.

---

### Transacao resource-local

O laboratório usa Java SE.

Cada escrita segue:

```java
EntityTransaction transaction =
        entityManager.getTransaction();

transaction.begin();

try {
    // operação
    transaction.commit();
} catch (RuntimeException exception) {
    if (transaction.isActive()) {
        transaction.rollback();
    }

    throw exception;
}
```

`persist`, `merge` e `remove` precisam ocorrer em contexto transacional para produzir escrita confiável.

`find` pode ser executado sem transação em leitura simples, mas operações profissionais costumam definir limites transacionais explícitos conforme consistência e arquitetura.

---

### persist

Assinatura conceitual:

```java
void persist(Object entity)
```

Pontos importantes:

```text
retorno:
void.

entrada esperada:
entidade nova.

resultado:
argumento torna-se managed.

ID:
pode ser atribuído durante persist ou flush,
conforme estratégia.

SQL:
INSERT pode ocorrer imediatamente ou no flush.
```

Exemplo:

```java
ClienteEntity cliente =
        new ClienteEntity(...);

entityManager.persist(cliente);
```

A mesma referência passa a ser gerenciada.

Não existe objeto de retorno.

---

### persist nao e save generico

`persist` não significa:

```text
insira ou atualize qualquer objeto.
```

Ele representa a persistência de uma entidade nova.

Passar uma entidade detached que já possui identidade pode produzir:

- `EntityExistsException`;
- exceção do provider;
- falha no flush;
- violação de chave.

Para detached, a operação adequada pode ser `merge`, mas apenas quando a regra realmente deseja copiar o estado.

---

### persist e identidade

Com `SEQUENCE`, o provider pode buscar o próximo valor antes do `INSERT`.

Exemplo de sequência SQL:

```text
SELECT nextval(...);

INSERT ...
```

Com `IDENTITY`, o `INSERT` normalmente precisa acontecer para que o ID seja obtido.

Nesta aula, `ClienteEntity` continuará usando sequence.

Depois de `persist`:

```java
cliente.getId()
```

deve estar preenchido no laboratório.

---

### find

Assinatura:

```java
<T> T find(
        Class<T> entityClass,
        Object primaryKey
)
```

Exemplo:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );
```

Retorno:

```text
entidade managed;
ou null.
```

`find` não lança exceção de “não encontrado”.

O chamador deve tratar `null`.

---

### find e primeiro nivel de cache

Dentro do mesmo persistence context:

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

Esperado:

```text
first == second:
true.

SELECT:
um.
```

A segunda busca pode ser resolvida pelo persistence context.

Depois de `clear`, uma nova busca exige nova instância e novo SELECT.

---

### find por ID invalido

Passar:

```text
null;
tipo incompatível;
```

pode provocar `IllegalArgumentException`.

Exemplo:

```java
entityManager.find(
        ClienteEntity.class,
        null
);
```

não representa “não encontrado”.

É chamada inválida.

---

### merge

Assinatura:

```java
<T> T merge(T entity)
```

`merge` copia o estado do argumento para uma instância managed.

Regra fundamental:

```text
argumento:
não passa automaticamente a ser managed.

retorno:
instância managed.
```

Exemplo correto:

```java
ClienteEntity managed =
        entityManager.merge(detached);
```

Exemplo perigoso:

```java
entityManager.merge(detached);

detached.alterarNome(
        "Nome depois do merge"
);
```

A alteração posterior foi feita no objeto detached original.

Ela não será necessariamente persistida.

---

### merge pode executar SELECT

Para copiar estado, o provider pode precisar localizar a linha existente.

Fluxo possível:

```text
SELECT por ID;

copiar estado;

dirty checking;

UPDATE no flush.
```

Não assuma que merge é uma operação de custo constante ou um simples UPDATE.

---

### merge com entidade nova

JPA permite merge de entidade transient.

O provider cria uma nova instância managed e prepara inserção.

Entretanto, usar merge como substituto universal de persist:

- oculta intenção;
- pode gerar SELECT adicional;
- dificulta entender identidade;
- aumenta custo;
- mascara erros.

Regra didática:

```text
entidade nova:
persist.

entidade detached que precisa ser reanexada por cópia:
merge.
```

---

### merge com ID inexistente

Quando um objeto detached contém ID que não existe mais, o comportamento pode resultar em:

- inserção;
- falha;
- comportamento dependente de estratégia e provider;
- exceção de optimistic locking quando há `@Version`.

Nesta aula, o teste principal usará uma entidade realmente existente.

Um cenário de ID inexistente será explorado de forma controlada e documentado como caso que não deve depender de comportamento implícito.

A aplicação deve verificar a existência quando a regra exige atualização estrita.

---

### remove

Assinatura:

```java
void remove(Object entity)
```

Entrada esperada:

```text
entidade managed.
```

Resultado:

```text
entidade marcada para remoção;
DELETE no flush ou commit.
```

Exemplo correto:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

if (cliente != null) {
    entityManager.remove(cliente);
}
```

---

### remove de detached

Isto é incorreto:

```java
entityManager.remove(clienteDetached);
```

O provider deve rejeitar porque o argumento não pertence ao persistence context atual.

Soluções:

```text
find e remove;

merge e remove do retorno.
```

A opção preferida para exclusão por ID é:

```text
find e remove.
```

Ela deixa a intenção explícita.

---

### remove e objetos embedded

Ao remover `ClienteEntity`, não existe uma operação separada para:

- DocumentoFiscal;
- Endereco;
- Dinheiro.

Eles fazem parte da mesma linha.

O `DELETE` remove a entidade e seus componentes embutidos juntos.

---

### flush

`flush` sincroniza alterações pendentes com o banco.

Exemplo:

```java
entityManager.persist(cliente);
entityManager.flush();
```

Isso força o `INSERT` antes do commit.

Por que usar no laboratório:

- observar SQL;
- antecipar constraint violation;
- provar comportamento;
- separar sincronização de confirmação.

Mesmo depois de flush:

```java
transaction.rollback();
```

pode desfazer a escrita.

---

### FlushModeType.AUTO

O modo padrão é:

```java
FlushModeType.AUTO.
```

O provider pode executar flush antes de consultas que dependem do estado pendente.

A aula não mudará o flush mode.

O objetivo é entender o comportamento padrão antes de otimizar.

---

### Excecoes e estado da transacao

Uma falha durante flush ou commit pode deixar a transação marcada para rollback.

Depois de uma falha:

```text
não continue usando a mesma transação como se estivesse saudável.
```

Fluxo:

1. capturar exceção;
2. verificar se a transação está ativa;
3. rollback;
4. fechar o `EntityManager`;
5. abrir nova unidade para trabalho futuro.

---

### contains

`contains` responde se a instância pertence ao persistence context atual.

Exemplos:

```java
entityManager.contains(cliente)
```

Depois de `persist`:

```text
true.
```

Para o objeto original passado ao `merge`:

```text
false.
```

Para o retorno do `merge`:

```text
true.
```

Depois de `remove`, enquanto o contexto ainda está aberto, a entidade continua associada ao contexto em estado de remoção. A aula 328 aprofundará essa transição formal.

---

### Operacao e intencao

Escolha a operação pelo objetivo:

```text
criar nova entidade:
persist.

buscar por ID:
find.

copiar estado detached:
merge.

remover entidade existente:
find + remove.
```

Evite criar um método genérico:

```java
save(Object entity)
```

sem entender a diferença de estado e custo.

---

### Identidade, referencia e estado persistente

Uma referência Java e uma identidade persistente não são a mesma coisa.

Considere:

```java
ClienteEntity detached =
        carregarEmContextoAnterior();

ClienteEntity managed =
        entityManager.merge(detached);
```

As duas referências podem representar a mesma linha do banco, mas somente `managed` pertence ao persistence context atual.

Isso explica por que:

```text
detached == managed:
false.

detached.getId().equals(
        managed.getId()
):
true.
```

O identificador aponta para a mesma identidade persistente. A referência indica qual objeto está sendo manipulado na memória.

Misturar esses conceitos provoca erros como alterar o objeto detached depois do merge e esperar sincronização automática.

---

### Custo operacional de cada metodo

As operações têm custos diferentes.

`persist` com sequence pode executar:

```text
SELECT nextval;

INSERT no flush.
```

`find` pode executar:

```text
nenhum SELECT:
quando a entidade já está no contexto.

um SELECT:
quando ainda não está.
```

`merge` pode exigir:

```text
SELECT;

cópia de atributos;

dirty checking;

UPDATE.
```

`remove` normalmente exige:

```text
SELECT anterior pelo find;

DELETE no flush.
```

Esse custo depende do provider, do mapeamento e do estado atual.

A escolha da operação não deve ser baseada apenas em “qual comando funciona”, mas na intenção e no custo esperado.

---

### Unidade de trabalho curta

Um `EntityManager` aberto por tempo excessivo acumula entidades managed e snapshots.

Isso pode aumentar:

- memória;
- dirty checking;
- tempo de flush;
- risco de dados desatualizados;
- duração de transação;
- retenção de conexão;
- contenção no banco.

A unidade recomendada é:

```text
abrir manager;

iniciar transação;

executar caso de uso;

commit ou rollback;

fechar manager.
```

Não mantenha o mesmo persistence context durante toda a sessão do usuário.

---

### Excecao de constraint e rollback

Uma violação de unicidade pode aparecer em:

```java
entityManager.flush();
```

ou:

```java
transaction.commit();
```

dependendo do momento em que o provider envia SQL.

Depois da falha, não continue chamando `persist`, `find`, `merge` ou `remove` dentro da mesma transação esperando recuperação.

O fluxo seguro é:

1. capturar a exceção;
2. executar rollback quando ativo;
3. fechar o `EntityManager`;
4. abrir uma nova unidade de trabalho;
5. traduzir a falha para uma mensagem adequada na borda da aplicação.

A exceção do provider deve preservar sua causa JDBC para diagnóstico, mas detalhes sensíveis não devem ser enviados ao usuário final.

---

### Matriz de decisao

Use esta matriz inicial:

```text
Objeto novo sem identidade:
persist.

Busca pontual por chave:
find.

Objeto detached que precisa copiar estado:
merge e usar o retorno.

Exclusão por ID:
find e remove.

Atualização de entidade já managed:
alterar atributos;
dirty checking.

Objeto inexistente:
regra explícita;
não depender de merge como upsert.
```

Essa matriz reduz o uso indiscriminado de `merge` e mantém o código alinhado ao estado real da entidade.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\java\br\com\formacao\m13\aula327\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\java\br\com\formacao\m13\aula327\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\java\br\com\formacao\m13\aula327\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\java\br\com\formacao\m13\aula327\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\java\br\com\formacao\m13\aula327\valueobject"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-327-entitymanager-persist-find-merge-remove\src\test\java\br\com\formacao\m13\aula327"

Set-Location `
  "labs\m13\aula-327-entitymanager-persist-find-merge-remove"
```

---

### 2. Criar pom e configuracao

Reutilize da aula 326:

```text
Java 21;

Jakarta Persistence 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

JUnit 5.10.2.
```

Ajuste:

```text
artifactId:
aula-327-entitymanager-operacoes.

persistence unit:
aula327PU.

Main:
br.com.formacao.m13.aula327.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_327
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-327-jpa
JPA_POOL_NAME=aula-327-pool
JPA_POOL_SIZE=3
```

---

### 3. Criar migration

Reutilize o schema da aula 326 com os ajustes:

```text
schema:
jpa_327.

sequence:
jpa_327.cliente_id_seq.

start:
327001.
```

A tabela continua contendo:

- dados básicos;
- documento;
- endereço principal;
- endereço de cobrança;
- limite;
- versão;
- criado em.

Não altere a estrutura para facilitar as operações.

---

### 4. Reutilizar os mapeamentos

Copie e ajuste packages:

```text
ClienteEntity;

DocumentoFiscal;

Endereco;

Dinheiro.
```

Adicione em `ClienteEntity`:

```java
public void alterarNome(
        String novoNome
) {
    if (
        novoNome == null
        || novoNome.isBlank()
    ) {
        throw new IllegalArgumentException(
                "novoNome é obrigatório"
        );
    }

    this.nome = novoNome.trim();
}
```

Mantenha os métodos de alteração dos objetos de valor.

Não adicione setters genéricos.

---

### 5. Criar persistence.xml e runtime

A persistence unit deve ser:

```text
aula327PU.
```

Liste apenas `ClienteEntity`.

Reutilize:

```text
JpaRuntime;

JpaRuntimeFactory;

SqlCaptureInspector.
```

Propriedades:

```text
jakarta.persistence.dataSource;

hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true;

hibernate.session_factory.statement_inspector.
```

---

### 6. Criar OperationsReport.java

```java
package br.com.formacao.m13.aula327.lab;

public record OperationsReport(
        long clienteId,
        boolean persistReturnedManagedArgument,
        boolean findReturnedEntity,
        boolean findMissingReturnedNull,
        boolean firstLevelCacheWorked,
        boolean mergeReturnedDifferentReference,
        boolean mergeReturnedManaged,
        boolean originalRemainedDetached,
        boolean removeDeletedRow
) {
}
```

O nome `persistReturnedManagedArgument` significa que o próprio argumento passou a ser managed, não que `persist` tenha retorno.

---

### 7. Criar EntityManagerOperationsLab.java

A classe recebe:

```text
EntityManagerFactory;

SqlCaptureInspector.
```

#### Método persistNewClient

1. construir Cliente;
2. confirmar ID nulo;
3. abrir `EntityManager`;
4. iniciar transação;
5. confirmar `contains=false`;
6. executar `persist`;
7. confirmar `contains=true`;
8. confirmar ID preenchido;
9. executar `flush`;
10. confirmar um INSERT;
11. commit;
12. fechar manager;
13. retornar o objeto agora detached.

Código reservado:

```text
CLI-JPA-327-MAIN.
```

#### Método findClient

Em novo manager:

1. `find` por ID;
2. confirmar retorno não nulo;
3. chamar `find` novamente;
4. confirmar mesma referência;
5. confirmar um SELECT;
6. buscar ID `999999999`;
7. confirmar `null`;
8. fechar manager.

#### Método mergeDetached

Use o objeto retornado da criação, agora detached.

Antes do merge:

```java
detached.alterarNome(
        "Cliente alterado fora do contexto"
);
```

Abra novo manager e transação.

Execute:

```java
ClienteEntity managed =
        entityManager.merge(
                detached
        );
```

Confirme:

```text
managed != detached;

contains(detached) false;

contains(managed) true.
```

Altere novamente:

```java
managed.alterarNome(
        "Cliente alterado no retorno do merge"
);
```

Execute flush e commit.

Em novo contexto, confirme que o nome final persistido é o do objeto managed.

#### Método removeByFind

Abra novo manager e transação.

Busque por ID.

Se for nulo, lance `IllegalStateException`.

Execute:

```java
entityManager.remove(managed);
entityManager.flush();
transaction.commit();
```

Em novo contexto, confirme `find` nulo.

---

### 8. Criar helper transacional

Dentro da classe de laboratório, crie um método:

```java
private static void rollbackIfActive(
        EntityTransaction transaction
) {
    if (
        transaction != null
        && transaction.isActive()
    ) {
        transaction.rollback();
    }
}
```

Todo método de escrita deve usar:

```java
try {
    transaction.begin();
    // trabalho
    transaction.commit();
} catch (RuntimeException exception) {
    rollbackIfActive(transaction);
    throw exception;
}
```

O `EntityManager` fica em `try-with-resources`.

---

### 9. Criar Main.java

O `Main`:

1. carrega configuração;
2. abre runtime;
3. executa `EntityManagerOperationsLab`;
4. imprime todos os booleanos;
5. não imprime documento completo;
6. fecha runtime.

Saída esperada:

```text
persist gerenciou o argumento:
true.

find encontrou:
true.

find inexistente retornou null:
true.

primeiro nível funcionou:
true.

merge retornou outra referência:
true.

retorno do merge managed:
true.

original permaneceu detached:
true.

remove excluiu:
true.
```

---

### 10. Criar EntityManagerOperationsIT.java

Casos obrigatórios:

#### Persist

- criar entidade nova;
- confirmar ID nulo;
- persistir;
- confirmar `contains=true`;
- confirmar ID não nulo;
- flush;
- rollback;
- confirmar ausência no banco.

#### Find

- criar fixture confirmada;
- abrir novo manager;
- buscar duas vezes;
- confirmar mesma referência;
- confirmar um SELECT;
- buscar inexistente;
- confirmar null.

#### Merge

- carregar entidade;
- fechar manager;
- alterar detached;
- abrir novo manager;
- merge;
- confirmar referências diferentes;
- confirmar somente retorno managed;
- commit;
- verificar estado final.

#### Remove

- carregar managed;
- remove;
- flush;
- confirmar DELETE capturado;
- rollback;
- confirmar que a linha voltou;
- repetir e commit;
- confirmar ausência.

Esse teste demonstra que flush não confirma.

---

### 11. Criar EntityManagerErrorCasesIT.java

#### Persist de detached

1. criar e confirmar entidade;
2. fechar manager;
3. abrir novo manager e transação;
4. chamar `persist` no objeto detached;
5. esperar `EntityExistsException` ou exceção de persistência equivalente;
6. rollback;
7. confirmar uma única linha.

Não acople o teste à classe concreta interna do Hibernate.

#### Remove de detached

1. criar entidade;
2. fechar manager;
3. abrir novo manager;
4. chamar `remove` no objeto detached;
5. esperar `IllegalArgumentException`;
6. rollback;
7. confirmar linha existente.

#### Find com ID nulo

Espere `IllegalArgumentException`.

#### Operacao com manager fechado

1. criar manager;
2. fechar;
3. chamar `find`;
4. esperar `IllegalStateException`.

#### Merge e retorno ignorado

Demonstre:

1. merge do detached;
2. alterar somente o original depois do merge;
3. commit;
4. confirmar que alteração posterior no original não foi persistida.

O teste deve deixar claro que o erro é de uso da referência.

---

### 12. Criar fixture helper

Crie um método de teste que persiste Cliente e retorna:

```text
ID;

objeto detached.
```

A transação deve ser confirmada.

Use códigos:

```text
CLI-JPA-327-PERSIST;

CLI-JPA-327-FIND;

CLI-JPA-327-MERGE;

CLI-JPA-327-REMOVE;

CLI-JPA-327-ERROR.
```

---

### 13. Criar TestDataCleaner.java

Limpe somente:

```sql
DELETE FROM jpa_327.cliente
WHERE codigo LIKE 'CLI-JPA-327-%'
```

Use no `@BeforeEach` e `@AfterEach`.

---

### 14. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_327.
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
zero CLI-JPA-327-%;

schema history com V1;

tabela cliente existente.
```

`05_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 15. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
persist gerenciou argumento;

find retornou entidade e null;

find repetido usou cache;

merge devolveu outra referência;

retorno do merge foi persistido;

remove exigiu managed;

flush com rollback não confirmou;

casos inválidos falharam;

estado final ficou limpo.
```

Depois das evidências:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 16. Criar documentacao

`contrato-persist.md` deve registrar:

- assinatura;
- retorno void;
- entidade nova;
- estado esperado;
- ID;
- SQL;
- transação;
- falhas;
- anti-padrões.

`contrato-find.md` deve registrar:

- classe;
- chave;
- retorno;
- null;
- primeiro nível;
- ID inválido;
- custo;
- ausência de exceção de not found.

`contrato-merge.md` deve registrar:

- cópia de estado;
- retorno;
- argumento original;
- SELECT possível;
- entidade nova;
- ID inexistente;
- versão;
- custo;
- referência correta.

`contrato-remove.md` deve registrar:

- entidade managed;
- marcação;
- flush;
- rollback;
- detached inválido;
- padrão find + remove.

`troubleshooting-entitymanager.md` deve cobrir:

- object detached passed to persist;
- removing detached instance;
- manager fechado;
- transação inativa;
- find nulo;
- merge ignorado;
- constraint no flush;
- rollback obrigatório;
- fixture restante.

---

## Entendendo o que foi feito

### Persist ganhou uma intencao clara

Ele foi usado somente para entidade nova e tornou o próprio argumento managed.

### Find foi tratado como busca por identidade

O retorno nulo e o primeiro nível de cache foram comprovados.

### Merge deixou de parecer update

Ele copiou estado e devolveu outra referência gerenciada.

### Remove exigiu contexto

A exclusão correta começou com `find`.

### Flush e commit ficaram separados

O laboratório provou que DELETE sincronizado pode ser desfeito por rollback.

---

## Erros comuns importantes

### Usar persist para detached

Persist não é save genérico.

### Ignorar retorno de merge

O argumento original continua detached.

### Remover entidade detached

Busque uma managed antes.

### Não tratar null de find

Ausência não lança not found automaticamente.

### Continuar depois de falha de flush

Rollback e feche a unidade de trabalho.

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

### Inspecionar fixtures

```sql
SELECT
    id,
    codigo,
    nome,
    versao
FROM jpa_327.cliente
WHERE codigo LIKE 'CLI-JPA-327-%'
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — Persist e flush

Persista uma entidade, execute flush e depois rollback.

Confirme:

- ID foi atribuído;
- INSERT foi executado;
- linha não permaneceu.

### Parte 2 — Find depois de clear

Busque duas vezes, confirme um SELECT, execute `clear` e busque novamente.

Confirme novo SELECT e nova referência.

### Parte 3 — Merge sem alteracao

Faça merge de detached sem mudanças.

Observe se o provider executa SELECT e se gera UPDATE.

Não assuma resultado sem medir.

### Parte 4 — Merge de transient

Crie entidade nova e use merge.

Compare SQL e referências com persist.

Documente por que persist comunica melhor a intenção.

### Parte 5 — Remove e rollback

Remova, flush, consulte por JDBC em outra conexão conforme isolamento e depois rollback.

Explique o que cada conexão pode observar.

### Parte 6 — Constraint

Persista duplicidade de documento.

Force flush.

Capture exceção, rollback e confirme que o manager daquela unidade não é reutilizado.

### Parte 7 — Helper de transacao

Crie:

```java
JpaTransactionExecutor
```

Método:

```java
<T> T execute(
        Function<EntityManager, T> work
)
```

Ele deve:

- criar manager;
- iniciar;
- executar;
- commit;
- rollback em falha;
- fechar manager.

Não introduza Spring.

### Parte 8 — Matriz de operacoes

Crie tabela:

```text
Operação | Entrada | Retorno | Estado esperado | SQL provável
```

Preencha persist, find, merge e remove.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 327 existe;
- continuidade com a aula 326 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_327` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi reutilizada;
- embeddables foram reutilizados;
- `EntityManager` foi criado por unidade;
- `EntityManager` foi fechado;
- transação resource-local foi usada;
- rollback em falha foi implementado;
- persist foi aprofundado;
- persist foi usado em entidade nova;
- persist retornou void;
- argumento de persist ficou managed;
- ID foi atribuído;
- flush foi executado;
- INSERT foi observado;
- find foi aprofundado;
- find existente retornou entidade;
- find inexistente retornou null;
- find com ID nulo falhou;
- primeiro nível de cache foi comprovado;
- mesma referência foi comprovada;
- clear provocou nova busca no exercício;
- merge foi aprofundado;
- merge copiou estado;
- merge retornou managed;
- retorno foi diferente do argumento;
- argumento original continuou detached;
- alteração no retorno foi persistida;
- retorno ignorado foi demonstrado;
- merge não foi tratado como save genérico;
- remove foi aprofundado;
- remove foi executado em managed;
- padrão find + remove foi usado;
- remove detached falhou;
- DELETE foi observado;
- rollback após DELETE foi comprovado;
- persist detached falhou;
- manager fechado rejeitou operação;
- exceções não ficaram acopladas a classe interna;
- transação falha foi revertida;
- manager da unidade falha foi fechado;
- SQL foi observado sem parâmetros sensíveis;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou vazio;
- ciclo de vida completo não foi antecipado;
- callbacks não foram antecipados;
- relacionamentos não foram antecipados;
- Spring não foi usado;
- ponte para a aula 328 está correta;
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
  labs/m13/aula-327-entitymanager-persist-find-merge-remove
```

Commit recomendado:

```powershell
git commit -m "feat(m13): aprofundar operacoes do entitymanager"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou as quatro operações centrais do `EntityManager`.

Aprendeu:

```text
persist:
recebe entidade nova;
não retorna;
torna o argumento managed.

find:
busca por identidade;
retorna managed ou null;
usa primeiro nível de cache.

merge:
copia estado;
retorna managed;
não gerencia o argumento original.

remove:
exige managed;
marca para exclusão;
sincroniza no flush.
```

O laboratório comprovou:

```text
ID gerado;

INSERT executado;

find inexistente retornando null;

find repetido evitando SELECT;

merge retornando referência diferente;

argumento permanecendo detached;

remove detached falhando;

DELETE seguido de rollback sendo desfeito;

transações falhas sendo revertidas.
```

A próxima aula será:

```text
328 - M13.18 - Ciclo de vida da entidade
```

Nela, você organizará formalmente:

- estado transient;
- estado managed;
- estado detached;
- estado removed;
- transições por persist;
- transições por find;
- transições por merge;
- transições por remove;
- detach;
- clear;
- close;
- refresh;
- contains;
- flush;
- commit;
- rollback;
- identidade no contexto;
- efeitos sobre dirty checking;
- diagramas de estado;
- testes de transição.

A aula 327 ensinou o contrato das operações.

A aula 328 mostrará o ciclo completo resultante dessas operações.

---

# Material complementar

## Checkpoint final

- [ ] Usei persist somente para entidade nova.
- [ ] Tratei find como entidade ou null.
- [ ] Usei o retorno de merge.
- [ ] Removi somente entidade managed.
- [ ] Diferenciei flush, commit e rollback.

---

## Troubleshooting adicional

### Detached entity passed to persist

A entidade já possui identidade e não é nova.

Revise a operação.

### Removing a detached instance

Busque a entidade no contexto atual antes de remover.

### Find devolveu null

A chave não existe ou o ID está incorreto.

Não dereference sem validar.

### Merge nao persistiu alteracao posterior

A mudança foi feita no argumento detached, não no retorno managed.

### Transaction marked rollback only

Uma falha ocorreu durante a unidade.

Execute rollback e feche o manager.

---

## Perguntas de revisao

1. O que `persist` retorna?
2. Qual entidade deve receber persist?
3. O argumento vira managed?
4. Quando o ID pode ser atribuído?
5. O que `find` retorna se não encontrar?
6. Find lança not found?
7. O que ocorre em dois finds no mesmo contexto?
8. O que `merge` faz?
9. O argumento de merge vira managed?
10. Qual referência deve ser usada?
11. Merge pode executar SELECT?
12. Merge deve substituir persist?
13. O que `remove` exige?
14. Como remover por ID?
15. Quando DELETE ocorre?
16. Flush é commit?
17. Rollback desfaz flush?
18. Pode reutilizar transação após falha?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Void.
2. Entidade nova.
3. Sim.
4. Persist ou flush, conforme estratégia.
5. Null.
6. Não.
7. Mesma referência e cache.
8. Copia estado para managed.
9. Não.
10. O retorno.
11. Sim.
12. Não.
13. Entidade managed.
14. Find e remove.
15. Flush ou commit.
16. Não.
17. Sim.
18. Não.
19. Não.
20. Ciclo de vida da entidade.

---

## Desafio opcional

Crie:

```java
JpaTransactionExecutor
```

Contrato:

```java
public <T> T execute(
        Function<EntityManager, T> work
)
```

Responsabilidades:

```text
criar EntityManager;

iniciar transação;

executar callback;

commit;

rollback em RuntimeException;

fechar EntityManager;

preservar exceção original.
```

Teste:

- retorno normal;
- persist;
- find;
- merge;
- remove;
- callback falhando;
- rollback;
- manager fechado.

Não transforme o executor em repository genérico.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 327 - M13.17 - EntityManager persist find merge remove

- Aprofundei o contrato do `EntityManager`.
- Mantive uma factory longa e managers curtos.
- Usei transações `RESOURCE_LOCAL`.
- Implementei rollback em falhas.
- Usei `persist` somente para entidade nova.
- Entendi que `persist` retorna void.
- Confirmei que o próprio argumento fica managed.
- Observei a atribuição de ID.
- Forcei `flush` para observar INSERT.
- Usei `find` por identidade.
- Tratei retorno nulo.
- Comprovei o cache de primeiro nível.
- Comprovei a mesma referência no mesmo contexto.
- Entendi que ID nulo é chamada inválida.
- Usei `merge` em entidade detached.
- Entendi que merge copia estado.
- Usei a referência retornada pelo merge.
- Confirmei que o argumento original continua detached.
- Observei SELECT e UPDATE possíveis no merge.
- Evitei usar merge como save genérico.
- Usei `remove` em entidade managed.
- Adotei o padrão find + remove.
- Testei remove de detached.
- Testei persist de detached.
- Diferenciei flush de commit.
- Comprovei rollback depois de flush.
- Fechei managers após falhas.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei callbacks, relacionamentos ou Spring.
- Próxima aula: ciclo de vida da entidade.
```

---

## Referencia tecnica curta

```text
persist:
nova -> managed.

find:
ID -> managed ou null.

merge:
estado -> nova referência managed.

remove:
managed -> remoção.

contains:
pertence ao contexto?

flush:
sincronizar.

commit:
confirmar.

rollback:
desfazer.
```

Regra final:

```text
usar EntityManager corretamente exige escolher a operacao pela intencao e pelo estado da entidade: persist para nova, find para identidade, merge usando o retorno e remove somente para managed, sempre dentro de uma unidade transacional curta e segura.
```
