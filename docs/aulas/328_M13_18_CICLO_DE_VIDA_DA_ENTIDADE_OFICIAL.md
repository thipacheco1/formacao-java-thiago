# 328 - M13.18 - Ciclo de vida da entidade

## Apresentacao da aula

Na aula 327, você aprofundou as quatro operações centrais do `EntityManager`:

```text
persist;

find;

merge;

remove.
```

Cada operação possui um contrato diferente.

`persist` recebe uma entidade nova e torna o próprio argumento gerenciado.

`find` busca por identidade e retorna uma entidade gerenciada ou `null`.

`merge` copia o estado de uma entidade nova ou desanexada para outra instância gerenciada.

`remove` marca uma entidade gerenciada para exclusão.

Agora você vai organizar essas operações em um modelo completo de ciclo de vida.

Uma entidade JPA pode estar em um dos quatro estados fundamentais:

```text
new ou transient;

managed;

detached;

removed.
```

Esses estados determinam:

- se a entidade possui identidade persistente;
- se pertence a um persistence context;
- se mudanças são acompanhadas;
- se dirty checking está ativo;
- se haverá `INSERT`;
- se haverá `UPDATE`;
- se haverá `DELETE`;
- se `refresh` pode ser usado;
- se `remove` é válido;
- se `merge` é necessário;
- o que acontece depois de commit;
- o que acontece depois de rollback;
- o que acontece quando o `EntityManager` é fechado.

A pergunta central desta aula é:

```text
em qual estado a entidade está agora
e qual transição a próxima operação provoca?
```

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
formacao_java_jpa_328
```

O schema será:

```text
jpa_328
```

Flyway continuará responsável pelo DDL.

Hibernate continuará em:

```text
validate.
```

A entidade principal será:

```java
ClienteEntity
```

Ela reutilizará os objetos de valor das aulas anteriores:

```text
DocumentoFiscal;

Endereco;

Dinheiro.
```

O laboratório demonstrará transições reais:

```text
new -> managed:
persist.

banco -> managed:
find.

managed -> detached:
detach.

todos managed -> detached:
clear.

managed -> detached:
close do EntityManager.

detached -> cópia managed:
merge.

managed -> removed:
remove.

removed -> managed:
persist antes da sincronização.

managed ou removed -> detached:
rollback da transação associada.

removed -> exclusão confirmada:
flush e commit.
```

Uma nuance importante será observada.

Neste laboratório Java SE, o `EntityManager` é criado diretamente pela aplicação.

Seu persistence context possui escopo estendido e pode atravessar mais de uma transação enquanto o mesmo `EntityManager` permanecer aberto.

Portanto:

```text
commit não fecha automaticamente o EntityManager;

commit não desanexa automaticamente as entidades
desse contexto gerenciado pela aplicação;

close encerra o contexto e desanexa as entidades.
```

Esse comportamento não deve ser confundido com um persistence context container-managed com escopo de transação.

A aula 329 aprofundará:

```text
persistence context;

identidade;

mapa de primeira camada;

escopos;

uma instância por identidade.
```

Nesta aula, o foco permanece no estado e nas transições de uma entidade individual.

Não serão antecipados:

- relacionamentos;
- cascades;
- callbacks de lifecycle;
- entity listeners;
- JPQL;
- locks;
- Spring;
- Spring Data;
- contexto container-managed;
- cache de segundo nível;
- proxy lazy.

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
```

Na aula 327, você escolheu operações pela intenção.

Nesta aula, você observará o estado antes e depois de cada operação.

A progressão é:

```text
operação:
o que o método faz?

lifecycle:
em qual estado a entidade entra?

persistence context:
como o contexto mantém identidade e sincronização?
```

Nesta aula:

```text
new:
sim.

managed:
sim.

detached:
sim.

removed:
sim.

persist:
como transição.

find:
como transição.

merge:
como transição.

remove:
como transição.

detach:
sim.

clear:
sim.

close:
sim.

refresh:
sim.

rollback:
sim.

identidade aprofundada:
não.

Spring:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-328-ciclo-de-vida-entidade
```

Estrutura final:

```text
labs
└── m13
    └── aula-328-ciclo-de-vida-entidade
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── diagrama-estados.md
        │   ├── matriz-transicoes.md
        │   ├── commit-rollback-e-lifecycle.md
        │   └── troubleshooting-lifecycle.md
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
            │   │                   └── aula328
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── lab
            │   │                       │   ├── EntityLifecycleLab.java
            │   │                       │   ├── EntityState.java
            │   │                       │   ├── LifecycleObservation.java
            │   │                       │   └── LifecycleReport.java
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
            │               └── V1__criar_schema_jpa_328.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula328
                                        ├── EntityLifecycleIT.java
                                        ├── RollbackLifecycleIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
new:
ID nulo;
contains false.

managed após persist:
ID preenchido;
contains true.

commit com mesmo manager aberto:
entidade continua managed.

detach:
contains false;
mudança não sincronizada.

merge:
retorno managed;
original detached.

clear:
todas as entidades ficam detached.

refresh:
mudança não sincronizada é descartada.

remove:
DELETE agendado.

persist após remove:
remoção cancelada antes do commit.

rollback:
entidade anteriormente managed fica detached;
linha permanece ou inserção é desfeita.

close:
entidades ficam detached.

remoção final:
linha não existe.

estado final:
zero fixtures CLI-JPA-328-%.
```

---

## Conceito essencial

### Os quatro estados

A especificação organiza a entidade em quatro estados.

#### New ou transient

Uma entidade nova:

- foi criada com `new`;
- ainda não possui identidade persistente;
- não pertence a persistence context;
- não é acompanhada;
- não gera SQL sozinha.

Exemplo:

```java
ClienteEntity cliente =
        new ClienteEntity(...);
```

Evidências:

```text
cliente.getId():
null.

entityManager.contains(cliente):
false.
```

O termo oficial é “new entity”.

“Transient” é amplamente usado no ecossistema Hibernate e na literatura.

Nesta aula, os dois nomes serão tratados como equivalentes no contexto didático.

---

### Managed

Uma entidade managed:

- possui identidade persistente;
- pertence ao persistence context atual;
- é acompanhada pelo provider;
- participa de dirty checking;
- pode ser usada em `remove`;
- pode ser atualizada sem método `update`.

Ela pode entrar nesse estado por:

```text
persist de entidade nova;

find de linha existente;

retorno de merge;

consulta que retorna entidade;

persist de entidade removida antes da sincronização.
```

Evidência principal:

```java
entityManager.contains(cliente)
```

retorna:

```text
true.
```

---

### Detached

Uma entidade detached:

- possui identidade persistente;
- não pertence ao persistence context atual;
- continua sendo um objeto Java;
- pode ser lida e alterada em memória;
- não participa de dirty checking;
- não pode ser removida diretamente;
- pode ter seu estado copiado por `merge`.

Ela pode ficar detached por:

```text
detach;

clear;

close;

rollback;

fim de um persistence context transacional.
```

No laboratório Java SE com `EntityManager` application-managed, o fechamento explícito será a principal fronteira do contexto.

---

### Removed

Uma entidade removed:

- possui identidade persistente;
- está associada ao persistence context;
- foi marcada para exclusão;
- será removida quando o contexto for sincronizado;
- ainda não representa necessariamente um `DELETE` confirmado.

Transição:

```java
entityManager.remove(cliente);
```

Depois:

```text
flush:
envia DELETE.

commit:
confirma DELETE.

rollback:
desfaz DELETE e desanexa a entidade.
```

Não use apenas o valor de `contains` para tentar criar um detector universal de estado removed.

A API não oferece um método:

```java
getEntityState(entity)
```

O estado removed é conhecido pela sequência de operações e pelo comportamento transacional.

---

### JPA nao fornece classificador automatico

Esta aula criará:

```java
EntityState
```

para registrar o estado esperado durante a demonstração.

Isso não significa que a aplicação consegue inferir qualquer estado apenas olhando:

```text
ID;

contains;

classe.
```

Exemplo:

```text
ID não nulo e contains false
```

pode representar:

- detached;
- objeto construído manualmente com ID;
- entidade após rollback com estado inconsistente.

O enum servirá para documentação e teste do fluxo controlado.

---

### Transicao new para managed

Operação:

```java
entityManager.persist(cliente);
```

Antes:

```text
new.
```

Depois:

```text
managed.
```

Com sequence:

```text
ID pode ser obtido durante persist.
```

O `INSERT` pode esperar o flush.

A entidade Java é a mesma referência.

---

### Transicao banco para managed

Operação:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );
```

Se a linha existir:

```text
managed.
```

Se não existir:

```text
null.
```

Não existe entidade transient nem detached quando `find` retorna `null`.

Existe apenas ausência.

---

### Transicao managed para detached por detach

Operação:

```java
entityManager.detach(cliente);
```

Depois:

```text
contains false.
```

Mudanças posteriores não são sincronizadas.

A operação afeta uma entidade específica.

Outras entidades do contexto permanecem managed.

---

### Transicao por clear

Operação:

```java
entityManager.clear();
```

Efeito:

```text
todas as entidades managed ficam detached.
```

Mudanças pendentes ainda não sincronizadas não serão persistidas.

Por isso:

```text
flush antes de clear
```

pode ser necessário quando o objetivo é preservar alterações.

Não chame `clear` para “limpar memória” sem entender o impacto funcional.

---

### Transicao por close

Operação:

```java
entityManager.close();
```

Efeito:

```text
persistence context encerrado;

entidades deixam de ser gerenciadas;

manager não pode mais executar operações.
```

Depois de fechar, apenas os métodos permitidos pela API para verificar estado ou obter a transação devem ser tratados com cuidado.

A prática segura é:

```text
não reutilizar o EntityManager.
```

---

### Application-managed persistence context

No Java SE desta aula:

```java
EntityManager entityManager =
        factory.createEntityManager();
```

A aplicação controla o ciclo.

Esse persistence context existe até:

```java
entityManager.close();
```

Ele pode atravessar múltiplas transações.

Portanto, depois de:

```java
transaction.commit();
```

e antes de fechar o manager:

```java
entityManager.contains(cliente)
```

continua verdadeiro.

A entidade ainda é managed.

---

### Mudanca entre transacoes

Como o contexto application-managed permanece aberto, uma entidade pode continuar managed entre duas transações.

Fluxo:

```text
transação 1:
persist e commit.

fora de transação:
alterar objeto managed.

transação 2:
begin;
flush;
commit.
```

A mudança será sincronizada na segunda transação.

Essa capacidade não significa que manter contextos longos seja uma boa arquitetura.

Contextos extensos aumentam:

- memória;
- snapshots;
- risco de dados antigos;
- complexidade;
- tempo de gerenciamento.

O laboratório demonstra o contrato, não recomenda uma sessão longa.

---

### Merge nao reanexa o argumento

Transição conceitual:

```text
detached original
    -> continua detached.

cópia do estado
    -> instância managed retornada.
```

Código:

```java
ClienteEntity managed =
        entityManager.merge(detached);
```

Não descreva o argumento como “reattachado” de forma imprecisa.

O retorno é a referência importante.

---

### Removed pode voltar a managed

A operação `persist` também pode ser aplicada a uma entidade marcada como removed antes da sincronização final.

Fluxo:

```java
entityManager.remove(cliente);

entityManager.persist(cliente);
```

O segundo comando desfaz o efeito da remoção naquele contexto.

A entidade volta ao estado managed.

Nenhum `DELETE` deve permanecer confirmado.

Esse cenário é didático.

Código de negócio deve evitar sequências contraditórias sem uma regra clara.

---

### Refresh

Operação:

```java
entityManager.refresh(cliente);
```

Pré-condição:

```text
entidade managed.
```

Efeito:

```text
recarrega estado do banco;

sobrescreve mudanças ainda não sincronizadas.
```

Exemplo:

```java
cliente.alterarNome(
        "Mudança local"
);

entityManager.refresh(cliente);
```

O nome volta ao valor persistido.

`refresh` em detached provoca erro.

---

### Flush e estado

`flush` sincroniza o estado atual do contexto.

Ele não muda automaticamente:

```text
managed para detached;

removed para detached.
```

Ele envia SQL correspondente.

Depois do flush:

```text
managed continua managed;

removed continua marcado para remoção;

commit ainda é necessário.
```

Rollback pode desfazer o SQL já enviado.

---

### Commit

Em um persistence context application-managed estendido:

```text
commit confirma SQL;

entidades managed continuam managed
enquanto o EntityManager permanece aberto.
```

Em um contexto container-managed com escopo de transação, o fim da transação encerra o contexto e desanexa as entidades.

A arquitetura precisa saber qual modelo está usando.

---

### Rollback

Rollback merece atenção especial.

Quando um persistence context associado à transação sofre rollback:

```text
entidades managed e removed ficam detached.
```

Além disso, valores Java podem ficar inconsistentes com o banco.

Exemplo:

```text
ID gerado permanece no objeto;

INSERT foi desfeito.
```

Ou:

```text
versão Java foi alterada;

UPDATE foi desfeito.
```

Regra profissional:

```text
depois de rollback, feche o EntityManager;

não reutilize automaticamente as entidades;

recarregue o estado em nova unidade.
```

---

### Rollback de entidade nova

Fluxo:

```java
persist(cliente);
flush();
rollback();
```

No objeto Java:

```text
ID pode continuar preenchido.
```

No banco:

```text
linha não existe.
```

Tratar esse objeto como uma entidade detached normal e executar `merge` pode produzir comportamento indesejado.

Descarte a instância ou reconstrua explicitamente a intenção.

---

### Dirty checking por estado

Dirty checking ocorre para:

```text
managed.
```

Não ocorre automaticamente para:

```text
new sem persist;

detached;

removed como atualização comum.
```

A entidade removed está destinada à exclusão, não à atualização regular.

---

### Diagrama principal

```text
new
  |
  | persist
  v
managed
  | \
  |  \ remove
  |   v
  | removed
  |   |
  |   | persist antes do commit
  |   v
  | managed
  |
  | detach / clear / close / rollback
  v
detached
  |
  | merge
  v
outra instância managed
```

`find` entra diretamente em managed quando a linha existe.

---

### Estado e SQL nao sao a mesma coisa

Estado é conceito do persistence context.

SQL é sincronização com o banco.

Exemplo:

```text
persist:
estado managed antes do INSERT.

remove:
estado removed antes do DELETE.

flush:
SQL executado sem commit.

rollback:
SQL desfeito e entidade detached.
```

Separar esses conceitos evita conclusões erradas.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\java\br\com\formacao\m13\aula328\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\java\br\com\formacao\m13\aula328\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\java\br\com\formacao\m13\aula328\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\java\br\com\formacao\m13\aula328\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\java\br\com\formacao\m13\aula328\valueobject"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-328-ciclo-de-vida-entidade\src\test\java\br\com\formacao\m13\aula328"

Set-Location `
  "labs\m13\aula-328-ciclo-de-vida-entidade"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 327.

Ajuste:

```text
artifactId:
aula-328-ciclo-vida-entidade.

persistence unit:
aula328PU.

Main:
br.com.formacao.m13.aula328.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_328
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-328-jpa
JPA_POOL_NAME=aula-328-pool
JPA_POOL_SIZE=3
```

O arquivo real continua fora do Git.

---

### 3. Criar migration

Reutilize a tabela Cliente da aula 327.

Ajustes:

```text
schema:
jpa_328.

sequence:
jpa_328.cliente_id_seq.

start:
328001.
```

A tabela continua contendo:

- código;
- nome;
- documento;
- endereços;
- limite;
- versão;
- criado em.

O objetivo é mudar o lifecycle, não o mapeamento.

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

Mantenha métodos:

```java
alterarNome;

alterarEnderecoCobranca;

alterarLimiteCredito.
```

Não adicione setters genéricos.

---

### 5. Criar EntityState.java

```java
package br.com.formacao.m13.aula328.lab;

public enum EntityState {
    NEW,
    MANAGED,
    DETACHED,
    REMOVED
}
```

O enum registra o estado esperado no roteiro controlado.

Ele não é um classificador genérico de JPA.

---

### 6. Criar LifecycleObservation.java

```java
package br.com.formacao.m13.aula328.lab;

public record LifecycleObservation(
        String etapa,
        EntityState estadoEsperado,
        Long id,
        boolean entityManagerOpen,
        Boolean contained,
        long inserts,
        long updates,
        long deletes
) {

    public LifecycleObservation {
        if (
            etapa == null
            || etapa.isBlank()
            || estadoEsperado == null
        ) {
            throw new IllegalArgumentException(
                    "etapa e estado são obrigatórios"
            );
        }
    }
}
```

`contained` é `Boolean` porque, depois de fechar o manager, o laboratório não deve chamar `contains`.

Use:

```text
null:
não consultado.
```

---

### 7. Criar LifecycleReport.java

```java
package br.com.formacao.m13.aula328.lab;

import java.util.List;

public record LifecycleReport(
        List<LifecycleObservation> observations,
        boolean commitKeptManaged,
        boolean detachStoppedDirtyChecking,
        boolean mergeReturnedManagedCopy,
        boolean clearDetachedAll,
        boolean refreshDiscardedLocalChange,
        boolean persistUndidRemoval,
        boolean rollbackDetachedEntity,
        boolean closeDetachedEntity,
        boolean finalRemovalCommitted
) {

    public LifecycleReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 8. Criar EntityLifecycleLab.java

A classe recebe:

```text
EntityManagerFactory;

SqlCaptureInspector.
```

Ela mantém uma lista de observações.

#### Etapa new

Crie:

```text
CLI-JPA-328-MAIN.
```

Antes de abrir manager:

```text
ID nulo;

estado esperado NEW.
```

Não invente `contains` sem manager.

---

#### Etapa persist

Abra um `EntityManager`.

Inicie a primeira transação.

Execute:

```java
entityManager.persist(cliente);
```

Registre:

```text
estado MANAGED;

ID não nulo;

contains true.
```

Execute `flush`.

Confirme um `INSERT`.

Commit.

Com o mesmo manager ainda aberto, confirme:

```java
entityManager.contains(cliente)
```

igual a:

```text
true.
```

Isso comprova o escopo estendido do contexto application-managed.

---

#### Etapa managed entre transacoes

Depois do primeiro commit, altere:

```java
cliente.alterarNome(
        "Cliente alterado entre transações"
);
```

Inicie uma segunda transação.

Execute `flush` e commit.

Confirme um `UPDATE`.

A entidade permaneceu managed porque o manager não foi fechado.

---

#### Etapa detach

Execute:

```java
entityManager.detach(cliente);
```

Confirme:

```text
contains false.
```

Altere o nome.

Inicie e confirme uma transação vazia.

Feche o manager.

Em outro manager, busque a entidade.

Confirme que a mudança feita depois do detach não foi persistida.

---

#### Etapa merge

Use o objeto detached.

Altere seu limite.

Abra novo manager e transação.

Execute:

```java
ClienteEntity managed =
        entityManager.merge(cliente);
```

Confirme:

```text
managed != cliente;

contains(cliente) false;

contains(managed) true.
```

Commit.

Guarde a referência managed apenas enquanto o manager estiver aberto.

Depois do fechamento, ela fica detached.

---

#### Etapa clear

Abra novo manager.

Busque duas entidades de fixture:

```text
CLI-JPA-328-MAIN;

CLI-JPA-328-AUX.
```

Confirme ambas managed.

Execute:

```java
entityManager.clear();
```

Confirme:

```text
contains false para ambas.
```

Feche.

A fixture auxiliar será criada no início da etapa e removida ao final.

---

#### Etapa refresh

Abra novo manager e transação.

Busque a entidade principal.

Guarde o nome persistido.

Altere localmente para:

```text
Nome que será descartado.
```

Execute:

```java
entityManager.refresh(managed);
```

Confirme que o nome voltou ao valor do banco.

Commit.

Nenhum `UPDATE` deve ser gerado para a mudança descartada.

---

#### Etapa remove e persist

Abra novo manager e transação.

Busque a entidade principal.

Execute:

```java
entityManager.remove(managed);
```

Registre estado esperado:

```text
REMOVED.
```

Antes do flush, execute:

```java
entityManager.persist(managed);
```

Registre:

```text
MANAGED.
```

Commit.

Em outro manager, confirme que a linha ainda existe.

Essa etapa prova que persist pode desfazer uma remoção ainda pendente.

---

#### Etapa rollback

Abra novo manager e transação.

Busque a entidade principal.

Altere o nome.

Execute:

```java
entityManager.flush();
```

Confirme um `UPDATE`.

Execute:

```java
transaction.rollback();
```

Depois do rollback, confirme:

```java
entityManager.contains(managed)
```

igual a:

```text
false.
```

A entidade ficou detached.

Abra outro manager e confirme que o nome no banco permaneceu anterior.

Feche o manager que sofreu rollback.

Não o reutilize.

---

#### Etapa close

Abra novo manager.

Busque a entidade.

Confirme `contains=true`.

Feche o manager.

Registre estado esperado:

```text
DETACHED.
```

Não chame `contains` depois do fechamento.

Confirme:

```java
entityManager.isOpen()
```

igual a false.

---

#### Etapa removed final

Abra novo manager e transação.

Busque a entidade principal.

Execute:

```java
entityManager.remove(managed);
entityManager.flush();
transaction.commit();
```

Feche.

Em novo manager:

```java
find
```

deve retornar `null`.

Remova também a fixture auxiliar.

---

### 9. Criar helper de observacao

Use o inspector para contar SQL por etapa.

Método:

```java
private LifecycleObservation observe(
        String etapa,
        EntityState state,
        ClienteEntity entity,
        EntityManager entityManager
)
```

O método pode registrar:

```text
ID;

isOpen;

contains quando aberto;

quantidades de INSERT, UPDATE e DELETE.
```

Não tente inferir `REMOVED` automaticamente.

Passe o estado esperado explicitamente.

---

### 10. Criar helper de rollback

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

Depois de rollback, feche o manager e não continue a unidade.

---

### 11. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `EntityLifecycleLab`;
4. imprime as etapas;
5. imprime os booleanos finais;
6. não imprime documento completo;
7. fecha runtime.

Formato:

```text
etapa | estado | id | open | contained
```

Para `contained == null`, imprima:

```text
não consultado.
```

---

### 12. Criar EntityLifecycleIT.java

Casos obrigatórios:

#### New para managed

- criar entidade;
- confirmar ID nulo;
- confirmar `contains=false`;
- persistir;
- confirmar ID;
- confirmar `contains=true`;
- rollback;
- fechar manager.

#### Commit com manager aberto

- persistir e commit;
- confirmar manager aberto;
- confirmar `contains=true`;
- alterar entre transações;
- iniciar outra transação;
- commit;
- confirmar mudança persistida.

#### Detach

- carregar managed;
- detach;
- confirmar `contains=false`;
- alterar;
- commit vazio;
- confirmar banco inalterado.

#### Clear

- carregar duas entidades;
- confirmar ambas managed;
- clear;
- confirmar ambas detached.

#### Close

- carregar;
- fechar;
- confirmar `isOpen=false`;
- esperar `IllegalStateException` em operação posterior.

#### Refresh

- alterar managed sem flush;
- refresh;
- confirmar valor original;
- confirmar nenhum UPDATE.

#### Merge

- criar detached;
- merge;
- confirmar retorno diferente;
- confirmar retorno managed;
- confirmar original detached.

#### Remove e persist

- remove;
- persist da mesma instância;
- commit;
- confirmar linha existente.

#### Remove final

- remove;
- flush;
- commit;
- confirmar linha ausente.

---

### 13. Criar RollbackLifecycleIT.java

#### Rollback de update

1. carregar managed;
2. alterar;
3. flush;
4. rollback;
5. confirmar `contains=false`;
6. confirmar banco preservado;
7. fechar manager.

#### Rollback de insert

1. criar new;
2. persist;
3. flush;
4. guardar ID gerado;
5. rollback;
6. confirmar objeto com ID;
7. confirmar linha ausente;
8. não executar merge no mesmo objeto;
9. descartar instância.

#### Rollback de remove

1. carregar managed;
2. remove;
3. flush;
4. rollback;
5. confirmar entidade detached;
6. confirmar linha existente.

Esses testes documentam o risco de estado Java inconsistente depois de rollback.

---

### 14. Criar TestDataCleaner.java

Limpe somente:

```sql
DELETE FROM jpa_328.cliente
WHERE codigo LIKE 'CLI-JPA-328-%'
```

Use antes e depois de cada teste.

---

### 15. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_328.
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
zero CLI-JPA-328-%;

schema history com V1;

tabela cliente existente.
```

`05_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 16. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
new observado;

managed observado;

detached por detach;

detached por clear;

detached por close;

managed mantido após commit no mesmo manager;

merge retornando managed;

removed observado;

remoção cancelada por persist;

rollback desanexando;

remoção final confirmada;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 17. Criar documentacao

`diagrama-estados.md` deve conter o diagrama:

```text
NEW -> MANAGED -> DETACHED
         |
         v
       REMOVED
```

Inclua todas as setas e operações.

`matriz-transicoes.md` deve possuir:

```text
Origem | Operação | Destino | SQL possível | Observação
```

Inclua:

- persist;
- find;
- detach;
- clear;
- close;
- merge;
- remove;
- persist removed;
- flush;
- commit;
- rollback;
- refresh.

`commit-rollback-e-lifecycle.md` deve comparar:

```text
commit em application-managed context;

commit em transaction-scoped context;

rollback;

ID gerado;

versão;

reuso de instância;

recomendação de fechamento.
```

`troubleshooting-lifecycle.md` deve cobrir:

- contains inesperado;
- entidade alterada sem update;
- merge original;
- remove detached;
- clear perdendo mudança;
- refresh descartando valor;
- rollback com ID preenchido;
- manager fechado;
- contexto longo;
- estado removed mal diagnosticado.

---

## Entendendo o que foi feito

### O estado deixou de ser implicito

Cada etapa passou a registrar explicitamente new, managed, detached ou removed.

### Commit foi separado de close

O contexto application-managed continuou vivo depois do commit.

### Detach, clear e close foram diferenciados

Uma operação afeta uma entidade, outra afeta todas e a última encerra o contexto.

### Rollback ganhou tratamento correto

As entidades foram consideradas detached e potencialmente inconsistentes.

### Removed foi tratado como agendamento

O DELETE só se tornou definitivo depois de commit.

---

## Erros comuns importantes

### Achar que ID nao nulo significa managed

Um detached também possui ID.

### Achar que commit sempre desanexa

Depende do escopo do persistence context.

### Reutilizar entidade depois de rollback

O estado Java pode não representar o banco.

### Executar clear antes de flush sem intencao

Mudanças pendentes podem ser perdidas.

### Tentar classificar removed apenas com contains

Use a sequência da unidade de trabalho.

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
    versao
FROM jpa_328.cliente
WHERE codigo LIKE 'CLI-JPA-328-%'
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — Detach antes de flush

1. carregue entidade;
2. altere nome;
3. execute detach sem flush;
4. commit;
5. confirme banco inalterado.

Explique por que a mudança foi perdida.

### Parte 2 — Flush antes de detach

Repita, mas execute flush antes do detach.

Depois faça rollback.

Confirme que flush não tornou a mudança definitiva.

### Parte 3 — Clear com duas entidades

Altere duas entidades managed.

Execute clear sem flush.

Confirme que nenhuma alteração foi persistida.

### Parte 4 — Contexto entre transacoes

Mantenha um manager aberto.

Faça commit, altere entidade fora da transação e confirme a mudança em uma segunda transação.

Depois documente por que não usar contexto longo indiscriminadamente.

### Parte 5 — Persist removed

Remova uma entidade e execute persist antes do flush.

Confirme que a linha permanece.

Depois repita com flush entre remove e persist e observe o provider em base descartável.

### Parte 6 — Rollback e ID

Persista entidade nova, force flush e faça rollback.

Registre:

```text
ID no objeto;

linha no banco;

contains;

risco de merge.
```

### Parte 7 — Refresh

Altere dois campos managed.

Execute refresh.

Confirme que ambos voltaram ao banco.

Explique por que refresh não é “salvar novamente”.

### Parte 8 — State recorder

Crie um exportador Markdown para as observações:

```text
Etapa | Estado | ID | Contains | SQL
```

O exportador não deve inferir estado automaticamente.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 328 existe;
- continuidade com a aula 327 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_328` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi reutilizada;
- objetos de valor foram reutilizados;
- estado NEW foi explicado;
- estado MANAGED foi explicado;
- estado DETACHED foi explicado;
- estado REMOVED foi explicado;
- enum didático de estados foi criado;
- enum não foi tratado como classificador genérico;
- observações foram registradas;
- persist fez new virar managed;
- find retornou managed;
- detach fez uma entidade ficar detached;
- clear desanexou todas;
- close encerrou o contexto;
- operação após close falhou;
- merge retornou uma cópia managed;
- argumento original permaneceu detached;
- remove marcou entidade;
- flush enviou DELETE;
- commit confirmou DELETE;
- persist desfez remove pendente;
- refresh descartou mudança local;
- dirty checking ocorreu somente em managed;
- mudança detached não foi persistida;
- application-managed context foi explicado;
- commit manteve managed com manager aberto;
- segunda transação sincronizou mudança;
- contexto longo foi desaconselhado;
- rollback de update foi testado;
- rollback de insert foi testado;
- rollback de remove foi testado;
- rollback desanexou entidades;
- ID inconsistente após rollback foi documentado;
- manager após rollback foi fechado;
- reuso automático de entidade após rollback foi proibido;
- flush foi diferenciado de commit;
- estado foi diferenciado de SQL;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou vazio;
- relacionamentos não foram antecipados;
- cascades não foram antecipados;
- callbacks não foram antecipados;
- persistence context e identidade não foram aprofundados antes da aula 329;
- Spring não foi usado;
- ponte para a aula 329 está correta;
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
  labs/m13/aula-328-ciclo-de-vida-entidade
```

Commit recomendado:

```powershell
git commit -m "feat(m13): praticar ciclo de vida de entidades jpa"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você organizou o ciclo de vida de uma entidade JPA.

Aprendeu:

```text
NEW:
objeto novo e não gerenciado.

MANAGED:
identidade persistente e dirty checking.

DETACHED:
identidade persistente fora do contexto.

REMOVED:
entidade agendada para exclusão.
```

As principais transições foram:

```text
persist:
new para managed.

find:
banco para managed.

detach:
managed para detached.

clear:
todos para detached.

close:
encerramento e detach.

merge:
cópia detached para managed.

remove:
managed para removed.

persist removed:
removed para managed.

rollback:
managed e removed para detached.
```

O laboratório também comprovou:

```text
commit não é close;

contexto application-managed atravessa transações;

flush não é commit;

refresh descarta mudança local;

rollback pode deixar ID Java sem linha no banco;

removed só vira exclusão definitiva após commit.
```

A próxima aula será:

```text
329 - M13.19 - Persistence context e identidade
```

Nela, você aprofundará:

- definição de persistence context;
- mapa de identidade;
- uma instância por classe e ID;
- primeiro nível de cache;
- identidade Java e identidade persistente;
- `find` repetido;
- `clear`;
- contextos diferentes;
- entidades iguais em managers diferentes;
- sincronização;
- escopo;
- contexto application-managed;
- contexto transaction-scoped;
- impacto de contextos longos;
- relação com dirty checking;
- testes de identidade.

A aula 328 mostrou o estado de uma entidade.

A aula 329 mostrará o ambiente que gerencia essas entidades.

---

# Material complementar

## Checkpoint final

- [ ] Expliquei os quatro estados de entidade.
- [ ] Diferenciei commit, rollback, clear e close.
- [ ] Comprovei merge retornando outra instância.
- [ ] Entendi o risco de reutilizar objetos após rollback.
- [ ] Registrei todas as transições em um diagrama.

---

## Troubleshooting adicional

### ID preenchido mas contains false

A entidade provavelmente está detached.

ID não define gerenciamento.

### Commit ocorreu e contains continua true

O manager application-managed permanece aberto.

### Mudanca depois de detach nao foi salva

Detached não participa de dirty checking.

### Refresh apagou minha alteracao

Esse é o contrato: recarregar o banco e sobrescrever mudança local.

### Depois do rollback o objeto parece atualizado

O estado Java pode ficar inconsistente.

Recarregue em novo contexto.

---

## Perguntas de revisao

1. Quais são os quatro estados?
2. O que caracteriza uma entidade new?
3. O que caracteriza managed?
4. O que caracteriza detached?
5. O que caracteriza removed?
6. O que persist provoca?
7. O que find provoca?
8. O que detach provoca?
9. O que clear provoca?
10. O que close provoca?
11. O que merge faz com o argumento?
12. O que remove provoca?
13. Quando DELETE é confirmado?
14. Persist pode desfazer remove?
15. O que refresh faz?
16. Flush é commit?
17. Commit sempre desanexa?
18. O que rollback faz com managed?
19. Pode reutilizar entidade após rollback?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. New, managed, detached e removed.
2. Sem identidade persistente e sem contexto.
3. Identidade e associação ao contexto.
4. Identidade sem associação ao contexto.
5. Associada e agendada para exclusão.
6. New vira managed.
7. Linha existente vira managed.
8. Uma entidade vira detached.
9. Todas ficam detached.
10. Encerra o contexto.
11. Copia estado e retorna outra managed.
12. Managed vira removed.
13. No commit.
14. Sim, antes da conclusão.
15. Recarrega e sobrescreve mudanças locais.
16. Não.
17. Não.
18. Desanexa.
19. Não automaticamente.
20. Persistence context e identidade.

---

## Desafio opcional

Crie:

```java
LifecycleDiagramExporter
```

Entrada:

```text
List<LifecycleObservation>.
```

Saída:

```text
Markdown;

Mermaid.
```

O diagrama deve mostrar:

- estado;
- operação;
- SQL observado;
- commit ou rollback;
- manager aberto;
- `contains`.

Regras:

- não inferir removed somente por `contains`;
- lista imutável;
- testes unitários;
- nenhum acesso a senha;
- nenhum dado fiscal;
- nenhuma dependência nativa Hibernate;
- exportação determinística.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 328 - M13.18 - Ciclo de vida da entidade

- Organizei os quatro estados de entidade JPA.
- Entendi o estado new ou transient.
- Entendi o estado managed.
- Entendi o estado detached.
- Entendi o estado removed.
- Criei um enum didático de estados.
- Evitei tratar o enum como classificador automático.
- Usei `persist` para transição new -> managed.
- Usei `find` para obter entidade managed.
- Usei `detach` para desanexar uma entidade.
- Usei `clear` para desanexar todas.
- Usei `close` para encerrar o persistence context.
- Entendi que manager fechado não pode ser reutilizado.
- Usei `merge` e mantive o original detached.
- Usei `remove` para marcar exclusão.
- Forcei DELETE com `flush`.
- Confirmei exclusão com commit.
- Usei `persist` para desfazer remove pendente.
- Usei `refresh` para descartar alteração local.
- Diferenciei estado de entidade e SQL executado.
- Entendi persistence context application-managed.
- Confirmei que commit pode manter entidade managed.
- Atravessei duas transações com o mesmo contexto.
- Entendi os riscos de contexto longo.
- Testei rollback de insert, update e remove.
- Entendi que rollback desanexa entidades.
- Observei ID Java sem linha depois de rollback.
- Evitei reutilizar automaticamente entidades após rollback.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei relacionamentos, cascades ou callbacks.
- Próxima aula: persistence context e identidade.
```

---

## Referencia tecnica curta

```text
NEW:
novo.

MANAGED:
gerenciado.

DETACHED:
desanexado.

REMOVED:
agendado para exclusão.

persist:
new -> managed.

detach:
managed -> detached.

merge:
cópia -> managed.

remove:
managed -> removed.

clear:
todos -> detached.

close:
encerra contexto.

rollback:
desanexa e pode deixar estado inconsistente.
```

Regra final:

```text
trabalhar corretamente com JPA exige saber o estado atual da entidade e a transicao provocada por cada operacao; ID, SQL e commit nao substituem o entendimento do persistence context, e rollback exige descartar ou recarregar o estado.
```
