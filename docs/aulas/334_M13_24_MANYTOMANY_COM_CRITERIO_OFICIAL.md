# 334 - M13.24 - ManyToMany com criterio

## Apresentacao da aula

Na aula 333, você adicionou a navegação inversa entre Cliente e Ordem de Serviço.

O relacionamento ficou bidirecional:

```text
Cliente
    -> várias Ordens.

Ordem
    -> um Cliente.
```

A foreign key permaneceu na tabela:

```text
ordem_servico.cliente_id.
```

A Ordem continuou sendo o lado proprietário.

O Cliente passou a usar:

```java
@OneToMany(
        mappedBy = "cliente"
)
```

Você também estudou:

- coleção lazy;
- métodos auxiliares;
- sincronização dos dois lados;
- ausência de cascade por padrão;
- `orphanRemoval=false`;
- transferência entre Clientes;
- introdução ao problema N+1.

Agora você vai estudar uma cardinalidade diferente:

```text
muitas Ordens de Serviço
    -> muitos Técnicos.

muitos Técnicos
    -> muitas Ordens de Serviço.
```

Em um relacionamento muitos-para-muitos, uma foreign key simples em apenas uma das tabelas não é suficiente.

O banco precisa de uma tabela intermediária:

```text
ordem_servico_tecnico.
```

Ela terá duas foreign keys:

```text
ordem_servico_id;

tecnico_id.
```

O mapeamento JPA direto utilizará:

```java
@ManyToMany
```

e:

```java
@JoinTable
```

Entretanto, o título da aula não é apenas:

```text
ManyToMany.
```

O título é:

```text
ManyToMany com criterio.
```

Isso acontece porque o mapeamento direto é frequentemente usado em situações nas quais a associação possui significado próprio.

Exemplos de atributos que podem pertencer ao vínculo entre Ordem e Técnico:

```text
papel;

data de alocação;

data de saída;

responsável principal;

valor negociado;

status da participação;

horas trabalhadas;

observação;

usuário que realizou a alocação.
```

Quando a tabela intermediária possui atributos de negócio, ela deixa de ser apenas uma tabela técnica.

Ela passa a representar um conceito do domínio.

Nesse caso, o melhor modelo costuma ser uma entidade associativa:

```text
AlocacaoTecnicoEntity.
```

O relacionamento deixa de ser um `ManyToMany` direto e passa a ser composto por dois `ManyToOne`:

```text
Alocação -> Ordem;

Alocação -> Técnico.
```

Nesta aula, você praticará as duas decisões:

```text
fluxo oficial:
@ManyToMany direto para vínculo simples.

análise arquitetural:
entidade associativa para vínculo rico.
```

O laboratório oficial representará uma relação simples chamada:

```text
técnicos habilitados para atuar na Ordem.
```

O vínculo direto não terá atributos próprios.

A tabela de junção conterá apenas:

```text
ordem_servico_id;

tecnico_id.
```

Ela terá:

- primary key composta;
- foreign key para Ordem;
- foreign key para Técnico;
- índices;
- ausência de `ON DELETE CASCADE`.

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
formacao_java_jpa_334
```

O schema será:

```text
jpa_334
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

As entidades serão:

```text
OrdemServicoEntity;

TecnicoEntity.
```

O fluxo oficial comprovará:

```text
uma Ordem com dois Técnicos;

um Técnico em duas Ordens;

tabela de junção persistida;

Ordem como lado proprietário;

Técnico como lado inverso;

coleções sincronizadas;

duplicidade bloqueada;

remoção do vínculo sem remover entidades;

Técnico referenciado protegido pela foreign key;

sem cascade PERSIST;

sem cascade REMOVE;

estado final sem fixtures.
```

A próxima aula será:

```text
335 - M13.25 - Cascade OrphanRemoval e responsabilidade
```

Por isso, cascade e `orphanRemoval` serão analisados nesta aula somente no limite necessário para tomar decisões seguras.

O aprofundamento de responsabilidade de lifecycle, propagação de operações e remoção de órfãos ficará para a aula 335.

Não serão antecipados:

- `CascadeType.ALL` como padrão;
- remoção em cascata de grafo;
- `orphanRemoval` aplicado sem aggregate;
- fetch tuning avançado;
- entity graphs;
- Spring;
- Spring Data;
- API HTTP;
- serialização de entidades.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
332:
Relacionamento ManyToOne.

333:
Relacionamento OneToMany.

334:
ManyToMany com criterio.

335:
Cascade OrphanRemoval e responsabilidade.

336:
Fetch lazy eager e proxy.
```

A aula 332 mostrou uma foreign key em uma entidade proprietária.

A aula 333 mostrou uma coleção inversa para essa mesma foreign key.

Nesta aula, nenhuma das tabelas principais consegue armazenar sozinha todos os pares possíveis.

Exemplo:

```text
OS-001:
Técnico A;
Técnico B.

OS-002:
Técnico A;
Técnico C.
```

A tabela intermediária registra:

```text
OS-001 | Técnico A;

OS-001 | Técnico B;

OS-002 | Técnico A;

OS-002 | Técnico C.
```

Nesta aula:

```text
@ManyToMany:
sim.

@JoinTable:
sim.

joinColumns:
sim.

inverseJoinColumns:
sim.

lado proprietário:
sim.

lado inverso:
sim.

mappedBy:
sim.

coleções bidirecionais:
sim.

remoção do vínculo:
sim.

entidade associativa:
critério arquitetural.

cascade:
sem propagação no fluxo oficial.

orphanRemoval:
não se aplica diretamente a ManyToMany.

Spring:
não.
```

A arquitetura será:

```text
OrdemServicoEntity
    -> Set<TecnicoEntity>
        -> @JoinTable.

TecnicoEntity
    -> Set<OrdemServicoEntity>
        -> mappedBy = "tecnicos".

ordem_servico_tecnico
    -> ordem_servico_id;
    -> tecnico_id.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-334-manytomany-com-criterio
```

Estrutura final:

```text
labs
└── m13
    └── aula-334-manytomany-com-criterio
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-manytomany.md
        │   ├── tabela-juncao.md
        │   ├── sincronizacao-bidirecional.md
        │   ├── manytomany-vs-entidade-associativa.md
        │   ├── politica-cascade.md
        │   └── troubleshooting-manytomany.md
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
            │   │                   └── aula334
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── OrdemServicoEntity.java
            │   │                       │   └── TecnicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── ManyToManyLab.java
            │   │                       │   ├── ManyToManyObservation.java
            │   │                       │   └── ManyToManyReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_334.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula334
                                        ├── ManyToManyMappingIT.java
                                        ├── ManyToManyConsistencyIT.java
                                        ├── JoinTableIntegrityIT.java
                                        ├── ManyToManyLifecycleIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
OS A:
Técnico 1;
Técnico 2.

OS B:
Técnico 1.

Técnico 1:
OS A;
OS B.

owner:
OrdemServicoEntity.

inverse:
TecnicoEntity.

join rows:
três.

remoção do vínculo:
uma linha da junção removida;
Ordem e Técnico preservados.

duplicidade:
não cria segundo par igual.

sem cascade:
entidades precisam ser persistidas explicitamente.

estado final:
zero fixtures e zero linhas de junção.
```

---

## Conceito essencial

### Cardinalidade muitos para muitos

Um `ManyToMany` representa:

```text
muitas entidades A
podem se relacionar com muitas entidades B.
```

No laboratório:

```text
uma Ordem possui vários Técnicos habilitados;

um Técnico pode estar habilitado em várias Ordens.
```

Não existe uma única foreign key capaz de representar todos os pares.

Por isso, a relação precisa de uma tabela intermediária.

---

### Tabela de juncao

A tabela será:

```text
jpa_334.ordem_servico_tecnico
```

Colunas:

```text
ordem_servico_id;

tecnico_id.
```

Cada linha representa um vínculo.

Exemplo:

```text
334101 | 334201.
```

A primary key composta impedirá repetição do mesmo par.

---

### @ManyToMany

No lado Ordem:

```java
@ManyToMany(
        fetch = FetchType.LAZY
)
private Set<TecnicoEntity> tecnicos;
```

A annotation informa que a coleção é associada a várias entidades Técnico e que cada Técnico também pode participar de várias Ordens.

O mapeamento direto não cria uma entidade Java para a linha intermediária.

---

### @JoinTable

O lado proprietário definirá:

```java
@JoinTable(
        name = "ordem_servico_tecnico",
        schema = "jpa_334",
        joinColumns = @JoinColumn(
                name = "ordem_servico_id"
        ),
        inverseJoinColumns = @JoinColumn(
                name = "tecnico_id"
        )
)
```

`joinColumns` aponta para a entidade proprietária:

```text
OrdemServicoEntity.
```

`inverseJoinColumns` aponta para a entidade do outro lado:

```text
TecnicoEntity.
```

---

### Lado proprietario

A entidade que declara `@JoinTable` controla as linhas de associação.

No laboratório:

```text
OrdemServicoEntity:
lado proprietário.
```

Adicionar Técnico somente à coleção inversa de `TecnicoEntity` não é suficiente para persistir o vínculo.

A coleção da Ordem precisa ser atualizada.

---

### Lado inverso

No Técnico:

```java
@ManyToMany(
        mappedBy = "tecnicos",
        fetch = FetchType.LAZY
)
private Set<OrdemServicoEntity> ordens;
```

`mappedBy` recebe o nome do atributo Java no owner:

```text
tecnicos.
```

Não recebe:

```text
ordem_servico_tecnico;

tecnico_id;

ordem_servico_id.
```

---

### Sincronizacao bidirecional

JPA não sincroniza automaticamente as duas coleções em memória.

O método:

```java
ordem.adicionarTecnico(tecnico);
```

deve:

1. adicionar Técnico à Ordem;
2. adicionar Ordem ao Técnico;
3. impedir duplicidade;
4. evitar recursão infinita.

A remoção deve executar o inverso.

---

### Colecao Set

O laboratório utilizará:

```java
LinkedHashSet
```

A intenção é representar vínculo sem duplicidade lógica e manter ordem previsível durante os testes.

Entretanto, `Set` depende de `equals` e `hashCode`.

Entidades com IDs gerados exigem cuidado.

Nesta aula, as entidades não sobrescreverão `equals` e `hashCode` com todos os campos.

Os helpers verificarão:

```text
mesma referência;

ou mesmo ID não nulo.
```

A primary key da tabela de junção continuará sendo a proteção final contra duplicidade persistida.

---

### Encapsulamento

Os getters devolverão cópias imutáveis:

```java
public Set<TecnicoEntity> getTecnicos() {
    return Set.copyOf(tecnicos);
}
```

O chamador não poderá executar:

```java
ordem.getTecnicos().clear();
```

Toda mudança passa pelos métodos auxiliares.

---

### Fetch

Coleções `ManyToMany` são lazy por padrão.

O laboratório declarará:

```java
fetch = FetchType.LAZY
```

para tornar a intenção explícita.

A coleção será inicializada dentro do persistence context.

O aprofundamento de proxies e fetch pertence à aula 336.

---

### Cascade no fluxo oficial

Não será configurado cascade.

Motivos:

```text
Ordem e Técnico possuem lifecycle independente;

um Técnico pode existir sem Ordem;

uma Ordem pode existir antes de selecionar Técnicos;

remover o vínculo não remove entidades;

remover uma Ordem não deve remover Técnicos;

remover Técnico não deve remover Ordens.
```

Cada entidade será persistida explicitamente.

---

### Cascade REMOVE e ManyToMany

`CascadeType.REMOVE` é especialmente perigoso em `ManyToMany`.

Se uma Ordem remover Técnicos em cascade:

```text
o mesmo Técnico pode estar ligado a outras Ordens;

a remoção destruiria uma entidade compartilhada;

outras associações seriam afetadas.
```

A operação correta ao desfazer o vínculo é:

```text
DELETE na tabela de junção.
```

Não:

```text
DELETE no Técnico.
```

---

### OrphanRemoval

`orphanRemoval` não é um atributo de `@ManyToMany`.

Ele existe em associações como:

```text
@OneToMany;

@OneToOne.
```

Isso faz sentido porque, em `ManyToMany`, retirar um Técnico de uma Ordem não torna o Técnico órfão.

Ele pode continuar relacionado a outras Ordens ou existir de forma independente.

---

### Adicionar associacao

Fluxo:

```java
ordem.adicionarTecnico(
        tecnico
);
```

No flush, o provider insere:

```sql
INSERT INTO jpa_334.ordem_servico_tecnico (
    ordem_servico_id,
    tecnico_id
)
VALUES (?, ?);
```

Nenhum `UPDATE` precisa ocorrer nas tabelas principais somente para criar o vínculo.

---

### Remover associacao

Fluxo:

```java
ordem.removerTecnico(
        tecnico
);
```

No flush, o provider remove a linha intermediária:

```sql
DELETE FROM jpa_334.ordem_servico_tecnico
WHERE ordem_servico_id = ?
  AND tecnico_id = ?;
```

Ordem e Técnico permanecem.

---

### Duplicidade

Adicionar o mesmo Técnico duas vezes não deve criar duas linhas iguais.

Proteções:

```text
helper de domínio;

Set;

primary key composta.
```

Não dependa apenas da coleção Java.

O banco precisa impedir duplicidade em concorrência e acessos externos.

---

### Remocao de entidade referenciada

Sem `ON DELETE CASCADE`, tentar remover um Técnico que ainda possui linhas na tabela de junção deve falhar.

A aplicação precisa:

1. remover os vínculos;
2. executar flush;
3. remover o Técnico;
4. confirmar.

A mesma regra vale para Ordem.

---

### Quando o ManyToMany direto e aceitavel

O mapeamento direto pode ser adequado quando o vínculo:

- não possui atributos;
- não possui lifecycle próprio;
- não precisa de histórico;
- não precisa de auditoria individual;
- não precisa de status;
- não precisa ser consultado como conceito;
- significa apenas pertencimento simples.

Exemplo da aula:

```text
Técnico habilitado para atuar na Ordem.
```

---

### Quando criar entidade associativa

Crie uma entidade associativa quando o vínculo precisa armazenar:

- papel;
- data de entrada;
- data de saída;
- valor;
- quantidade;
- prioridade;
- status;
- responsável principal;
- observação;
- auditoria;
- versão;
- soft delete;
- histórico.

Exemplo:

```text
AlocacaoTecnicoEntity.
```

Campos:

```text
id;

ordem;

tecnico;

papel;

alocadoEm;

removidoEm;

status;

versao.
```

Nesse modelo:

```text
Alocação -> Ordem:
@ManyToOne.

Alocação -> Técnico:
@ManyToOne.
```

---

### Entidade associativa com ID proprio

Uma entidade associativa pode usar:

```text
ID surrogate Long;
```

e uma constraint única:

```text
ordem_servico_id + tecnico_id + contexto ativo.
```

Essa escolha simplifica:

- referências;
- auditoria;
- versionamento;
- eventos;
- evolução de requisitos.

Também é possível usar chave composta, mas ela aumenta complexidade e será estudada posteriormente.

---

### ManyToMany direto e evolucao

Um vínculo inicialmente simples pode ganhar atributos no futuro.

Migrar de `@ManyToMany` para entidade associativa exige:

- criar nova entidade;
- alterar mapeamentos;
- preservar dados;
- ajustar serviços;
- revisar consultas;
- revisar APIs;
- migrar tabela intermediária.

Por isso, avalie sinais de evolução antes de escolher o mapeamento direto.

---

### Semantica do dominio

Não escolha `ManyToMany` apenas porque o diagrama possui “N para N”.

Pergunte:

```text
o vínculo possui nome?

possui regras?

possui datas?

possui estado?

possui valor?

possui responsabilidade?
```

Se a resposta for sim, provavelmente existe uma entidade de domínio escondida.

---

### Tabela de juncao criada pelo Flyway

Mesmo usando `@JoinTable`, o Hibernate não criará a tabela.

Flyway será responsável por:

- tabela;
- primary key;
- foreign keys;
- índices;
- nomes;
- política de delete.

Hibernate apenas validará o schema.

---

### Indices

A primary key composta:

```text
ordem_servico_id, tecnico_id
```

ajuda buscas iniciadas por Ordem.

Para buscas iniciadas por Técnico, será criado índice adicional:

```text
tecnico_id.
```

Isso evita depender da ordem das colunas da primary key.

---

### N mais um

Acessar coleções many-to-many em loop também pode produzir N+1.

A aula registrará o risco, mas não aprofundará soluções de fetch.

A aula 336 será dedicada a:

```text
lazy;

eager;

proxy.
```

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\main\java\br\com\formacao\m13\aula334\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\main\java\br\com\formacao\m13\aula334\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\main\java\br\com\formacao\m13\aula334\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\main\java\br\com\formacao\m13\aula334\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-334-manytomany-com-criterio\src\test\java\br\com\formacao\m13\aula334"

Set-Location `
  "labs\m13\aula-334-manytomany-com-criterio"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 333.

Ajuste:

```text
artifactId:
aula-334-manytomany-com-criterio.

persistence unit:
aula334PU.

Main:
br.com.formacao.m13.aula334.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_334
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-334-jpa
JPA_POOL_NAME=aula-334-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_334;

CREATE SEQUENCE jpa_334.ordem_servico_id_seq
    START WITH 334101
    INCREMENT BY 1;

CREATE SEQUENCE jpa_334.tecnico_id_seq
    START WITH 334201
    INCREMENT BY 1;

CREATE TABLE jpa_334.ordem_servico (
    id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    descricao varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criada_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_334_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_334_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_334_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'CONCLUIDA',
                'CANCELADA'
            )
        )
);

CREATE TABLE jpa_334.tecnico (
    id bigint NOT NULL,
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,
    ativo boolean NOT NULL DEFAULT true,
    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_334_tecnico
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_334_tecnico_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_334_tecnico_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE jpa_334.ordem_servico_tecnico (
    ordem_servico_id bigint NOT NULL,
    tecnico_id bigint NOT NULL,

    CONSTRAINT pk_jpa_334_ordem_tecnico
        PRIMARY KEY (
            ordem_servico_id,
            tecnico_id
        ),

    CONSTRAINT fk_jpa_334_ordem_tecnico_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES jpa_334.ordem_servico (id),

    CONSTRAINT fk_jpa_334_ordem_tecnico_tecnico
        FOREIGN KEY (tecnico_id)
        REFERENCES jpa_334.tecnico (id)
);

CREATE INDEX idx_jpa_334_ordem_tecnico_tecnico
    ON jpa_334.ordem_servico_tecnico (
        tecnico_id
    );
```

Não use:

```text
ON DELETE CASCADE.
```

---

### 4. Criar TecnicoEntity.java

A entidade terá:

```java
@Entity(name = "Tecnico")
@Table(
        name = "tecnico",
        schema = "jpa_334"
)
public class TecnicoEntity {
```

Campos:

```text
id;

codigo;

nome;

ativo;

versao;

criadoEm.
```

Coleção inversa:

```java
@ManyToMany(
        mappedBy = "tecnicos",
        fetch = FetchType.LAZY
)
private Set<OrdemServicoEntity> ordens =
        new LinkedHashSet<>();
```

Getter:

```java
public Set<OrdemServicoEntity> getOrdens() {
    return Set.copyOf(ordens);
}
```

Métodos internos package-private:

```java
void adicionarOrdemInternal(
        OrdemServicoEntity ordem
)

void removerOrdemInternal(
        OrdemServicoEntity ordem
)
```

Eles não chamam de volta o owner.

---

### 5. Criar OrdemServicoEntity.java

Coleção proprietária:

```java
@ManyToMany(
        fetch = FetchType.LAZY
)
@JoinTable(
        name = "ordem_servico_tecnico",
        schema = "jpa_334",
        joinColumns = @JoinColumn(
                name = "ordem_servico_id",
                nullable = false,
                foreignKey = @ForeignKey(
                        name =
                                "fk_jpa_334_ordem_tecnico_ordem"
                )
        ),
        inverseJoinColumns = @JoinColumn(
                name = "tecnico_id",
                nullable = false,
                foreignKey = @ForeignKey(
                        name =
                                "fk_jpa_334_ordem_tecnico_tecnico"
                )
        )
)
private Set<TecnicoEntity> tecnicos =
        new LinkedHashSet<>();
```

Getter:

```java
public Set<TecnicoEntity> getTecnicos() {
    return Set.copyOf(tecnicos);
}
```

Método adicionar:

```java
public void adicionarTecnico(
        TecnicoEntity tecnico
) {
    Objects.requireNonNull(
            tecnico,
            "tecnico é obrigatório"
    );

    if (containsTecnico(tecnico)) {
        return;
    }

    tecnicos.add(tecnico);
    tecnico.adicionarOrdemInternal(this);
}
```

Método remover:

```java
public void removerTecnico(
        TecnicoEntity tecnico
) {
    if (tecnico == null) {
        return;
    }

    boolean removed =
            tecnicos.removeIf(
                    existente ->
                            sameIdentity(
                                    existente,
                                    tecnico
                            )
            );

    if (removed) {
        tecnico.removerOrdemInternal(this);
    }
}
```

Use helper por referência ou ID não nulo.

---

### 6. Criar persistence.xml e runtime

Liste:

```text
OrdemServicoEntity;

TecnicoEntity.
```

Use:

```text
aula334PU;

RESOURCE_LOCAL;

shared-cache-mode NONE;

hibernate.hbm2ddl.auto=validate.
```

Reutilize:

```text
JpaRuntime;

JpaRuntimeFactory;

SqlCaptureInspector.
```

---

### 7. Criar ManyToManyObservation.java

```java
package br.com.formacao.m13.aula334.lab;

public record ManyToManyObservation(
        String etapa,
        long ordemId,
        int quantidadeTecnicos,
        boolean collectionLoaded,
        boolean bidirectionalConsistent,
        long joinInsertCount,
        long joinDeleteCount,
        long entityDeleteCount
) {

    public ManyToManyObservation {
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

---

### 8. Criar ManyToManyReport.java

```java
package br.com.formacao.m13.aula334.lab;

import java.util.List;

public record ManyToManyReport(
        List<ManyToManyObservation> observations,
        boolean joinTablePersistedThreeRows,
        boolean ownerControlledAssociation,
        boolean inverseSideWasSynchronized,
        boolean duplicateWasIgnored,
        boolean removingLinkPreservedEntities,
        boolean noCascadeWasProven,
        boolean referencedTechnicianDeleteWasBlocked,
        boolean associativeEntityWasRecommendedForRichLink
) {

    public ManyToManyReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar entidades base

Persista explicitamente:

```text
OS-JPA-334-A;

OS-JPA-334-B;

TEC-JPA-334-1;

TEC-JPA-334-2.
```

Não crie associação antes de confirmar a existência das quatro entidades.

Isso deixa claro que não existe cascade persist.

---

### 10. Criar tres vinculos

Abra novo manager e transação.

Busque as entidades.

Execute:

```java
ordemA.adicionarTecnico(tecnico1);
ordemA.adicionarTecnico(tecnico2);
ordemB.adicionarTecnico(tecnico1);
```

Confirme em memória:

```text
Ordem A:
dois Técnicos.

Ordem B:
um Técnico.

Técnico 1:
duas Ordens.

Técnico 2:
uma Ordem.
```

Flush.

Confirme três inserts na tabela de junção.

Commit.

---

### 11. Provar lado proprietario

Em teste controlado, altere somente a coleção interna inversa do Técnico por helper de teste restrito.

Não altere a coleção da Ordem.

Flush.

Confirme:

```text
nenhuma nova linha de junção.
```

Rollback.

A demonstração existe para provar que o owner controla a associação.

O código de produção sempre usará o helper público da Ordem.

---

### 12. Provar duplicidade

Abra manager e transação.

Busque Ordem A e Técnico 1.

Limpe inspector.

Execute duas vezes:

```java
ordemA.adicionarTecnico(
        tecnico1
);
```

Flush.

Confirme:

```text
zero novo INSERT;

coleção continua com duas entidades;

tabela continua com um único par A-1.
```

Commit ou rollback sem mudança.

---

### 13. Verificar lazy

Abra manager.

Busque Ordem A.

Use:

```java
PersistenceUnitUtil
```

para verificar:

```text
tecnicos não carregados antes do acesso.
```

Acesse:

```java
ordemA.getTecnicos()
        .size();
```

Confirme:

```text
coleção carregada;

dois Técnicos;

SELECT da junção e Técnico observado.
```

Feche o manager.

---

### 14. Remover somente o vinculo

Abra manager e transação.

Busque Ordem A e inicialize Técnicos.

Selecione Técnico 2.

Execute:

```java
ordemA.removerTecnico(
        tecnico2
);
```

Confirme em memória:

```text
Ordem A não contém Técnico 2;

Técnico 2 não contém Ordem A.
```

Flush.

Confirme:

```text
DELETE na tabela de junção;

zero DELETE em tecnico;

zero DELETE em ordem_servico.
```

Commit.

---

### 15. Provar ausencia de cascade persist

Crie Ordem e Técnico transient.

Associe os dois.

Abra manager e transação.

Persista somente a Ordem.

Force flush.

Como não há cascade, espere falha por referência transient ou confirme que Técnico não é inserido e a junção não pode ser criada.

Rollback.

Não acople o teste à classe interna exata do Hibernate.

---

### 16. Provar protecao da foreign key

Abra manager e transação.

Busque Técnico 1.

Ele continua associado às Ordens A e B.

Execute:

```java
entityManager.remove(
        tecnico1
);

entityManager.flush();
```

Espere falha da foreign key.

Rollback.

Confirme:

```text
Técnico permanece;

Ordens permanecem;

vínculos permanecem.
```

---

### 17. Avaliar entidade associativa

Crie o documento:

```text
manytomany-vs-entidade-associativa.md
```

Aplique esta pergunta ao vínculo Ordem–Técnico:

```text
a alocação precisa de papel?

data?

status?

valor?

horas?

responsável principal?

histórico?
```

Se qualquer resposta for necessária, registre a decisão:

```text
substituir o ManyToMany direto
por AlocacaoTecnicoEntity.
```

O laboratório não implementará essa migração para não misturar dois modelos no mesmo schema.

---

### 18. Limpeza final

Abra manager e transação.

Carregue Ordens com suas coleções.

Remova todos os vínculos pelos helpers.

Flush.

Depois remova:

```text
Ordens;

Técnicos.
```

Commit.

Confirme:

```text
zero OS-JPA-334-%;

zero TEC-JPA-334-%;

zero linhas de junção.
```

---

### 19. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `ManyToManyLab`;
4. imprime observações;
5. imprime decisões;
6. não imprime SQL completo;
7. fecha runtime.

Formato:

```text
etapa | ordem | técnicos | loaded | consistente | join insert | join delete
```

---

### 20. Criar ManyToManyMappingIT.java

Use reflection para validar:

```text
Ordem.tecnicos possui @ManyToMany;

fetch LAZY;

cascade vazio;

@JoinTable correto;

joinColumns ordem_servico_id;

inverseJoinColumns tecnico_id;

Tecnico.ordens possui mappedBy tecnicos.
```

Confirme que nenhum lado possui:

```text
CascadeType.REMOVE;

CascadeType.ALL.
```

---

### 21. Criar ManyToManyConsistencyIT.java

Casos:

#### Adicionar

- Ordem e Técnico managed;
- adicionar;
- confirmar ambos os lados;
- flush;
- confirmar linha de junção;
- rollback.

#### Remover

- vínculo existente;
- remover;
- confirmar ambos os lados;
- flush;
- confirmar linha removida;
- confirmar entidades existentes;
- rollback.

#### Duplicidade

- adicionar duas vezes;
- confirmar uma ocorrência;
- confirmar uma linha.

#### Lado inverso

- alterar somente inverso em helper de teste;
- flush;
- confirmar ausência de vínculo físico;
- rollback.

---

### 22. Criar JoinTableIntegrityIT.java

#### Primary key composta

Tente inserir o mesmo par por JDBC duas vezes.

Espere violação:

```text
SQLState 23505.
```

#### Foreign key de Ordem

Tente inserir ID de Ordem inexistente.

Espere:

```text
SQLState 23503.
```

#### Foreign key de Técnico

Tente inserir ID de Técnico inexistente.

Espere:

```text
SQLState 23503.
```

#### Remoção protegida

Tente remover Técnico vinculado.

Espere falha.

---

### 23. Criar ManyToManyLifecycleIT.java

#### Sem cascade persist

- associar transient com transient;
- persistir somente owner;
- flush;
- esperar falha;
- rollback.

#### Remover vínculo

- confirmar apenas DELETE da junção.

#### Remover Ordem vinculada

- sem limpar vínculos, remover Ordem;
- esperar foreign key;
- rollback.

#### Limpeza explícita

- limpar vínculos;
- flush;
- remover entidades;
- confirmar sucesso.

---

### 24. Criar TestDataCleaner.java

Ordem de limpeza:

```sql
DELETE FROM jpa_334.ordem_servico_tecnico
WHERE ordem_servico_id IN (
    SELECT id
    FROM jpa_334.ordem_servico
    WHERE codigo LIKE 'OS-JPA-334-%'
)
OR tecnico_id IN (
    SELECT id
    FROM jpa_334.tecnico
    WHERE codigo LIKE 'TEC-JPA-334-%'
);

DELETE FROM jpa_334.ordem_servico
WHERE codigo LIKE 'OS-JPA-334-%';

DELETE FROM jpa_334.tecnico
WHERE codigo LIKE 'TEC-JPA-334-%';
```

Use antes e depois dos testes.

---

### 25. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_334.
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
zero OS-JPA-334-%;

zero TEC-JPA-334-%;

zero linhas de junção das fixtures;

duas foreign keys;

primary key composta;

índice por tecnico_id;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado depois das evidências.

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
três vínculos persistidos;

owner controlou a junção;

lado inverso sincronizado;

duplicidade ignorada;

remoção apagou somente o vínculo;

sem cascade persist;

foreign key protegeu Técnico;

critério de entidade associativa documentado;

estado final ficou limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 27. Criar documentacao

`contrato-manytomany.md` deve registrar:

- cardinalidade;
- owner;
- inverse;
- fetch;
- cascade;
- coleções;
- métodos auxiliares;
- lifecycle.

`tabela-juncao.md` deve registrar:

- nome;
- colunas;
- primary key;
- foreign keys;
- índices;
- política de delete;
- DDL Flyway.

`sincronizacao-bidirecional.md` deve mostrar:

```text
ordem.adicionarTecnico(tecnico)
    -> ordem.tecnicos.add(tecnico)
    -> tecnico.ordens.add(ordem).
```

`manytomany-vs-entidade-associativa.md` deve conter uma matriz:

```text
Pergunta | ManyToMany direto | Entidade associativa
```

Inclua:

- atributos;
- histórico;
- status;
- auditoria;
- versionamento;
- eventos;
- soft delete.

`politica-cascade.md` deve registrar:

```text
PERSIST:
não.

MERGE:
não automático.

REMOVE:
proibido.

ALL:
proibido.
```

`troubleshooting-manytomany.md` deve cobrir:

- join table incorreta;
- mappedBy incorreto;
- vínculo não persistido;
- lados inconsistentes;
- duplicidade;
- transient reference;
- cascade remove;
- foreign key;
- lazy collection;
- entidade associativa necessária.

---

## Entendendo o que foi feito

### A associacao ganhou uma tabela propria

A relação muitos-para-muitos foi persistida como pares de IDs.

### O owner ficou explicito

A Ordem controlou inserções e remoções na tabela de junção.

### Os dois lados foram mantidos em memoria

Os helpers sincronizaram Ordem e Técnico.

### Remover vínculo nao removeu entidades

O DELETE atingiu somente a tabela intermediária.

### O mapeamento direto recebeu limites

A aula registrou quando o vínculo precisa virar uma entidade associativa.

---

## Erros comuns importantes

### Usar ManyToMany para associação com atributos

Crie uma entidade associativa.

### Configurar CascadeType.REMOVE

Entidades compartilhadas podem ser apagadas.

### Alterar somente o lado inverso

O owner controla a tabela de junção.

### Confiar apenas no Set

A primary key do banco continua obrigatória.

### Expor colecao mutavel

Os lados podem ficar inconsistentes.

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

### Consultar vinculos

```sql
SELECT
    ordem.codigo AS ordem_codigo,
    tecnico.codigo AS tecnico_codigo
FROM jpa_334.ordem_servico_tecnico AS vinculo
JOIN jpa_334.ordem_servico AS ordem
    ON ordem.id = vinculo.ordem_servico_id
JOIN jpa_334.tecnico AS tecnico
    ON tecnico.id = vinculo.tecnico_id
ORDER BY
    ordem.codigo,
    tecnico.codigo;
```

---

## Exercicio guiado

### Parte 1 — Lado proprietario invertido

Em branch descartável, mova `@JoinTable` para Técnico.

Ajuste `mappedBy`.

Compare SQL e responsabilidade.

Restaure a decisão oficial.

### Parte 2 — Cascade PERSIST

Ative somente `PERSIST`.

Associe Ordem nova a Técnico novo.

Observe os INSERTs.

Remova a configuração e documente o risco.

### Parte 3 — Cascade REMOVE

Não execute em dados importantes.

Em base descartável, demonstre por que remover Ordem pode tentar remover Técnico compartilhado.

Restaure imediatamente.

### Parte 4 — Atributo papel

Adicione conceitualmente:

```text
papel.
```

Mostre por que ele não cabe no `@ManyToMany` direto.

Desenhe `AlocacaoTecnicoEntity`.

### Parte 5 — Atributo periodo

Adicione:

```text
alocado_em;

removido_em.
```

Defina a constraint de período e explique a necessidade de entidade.

### Parte 6 — Duplicidade concorrente

Simule dois inserts JDBC do mesmo par.

Confirme proteção da primary key.

### Parte 7 — Lazy

Carregue várias Ordens e acesse Técnicos em loop.

Observe o risco de N+1.

Não implemente solução antes da aula de fetch.

### Parte 8 — ADR

Registre:

```text
ManyToMany direto somente sem atributos;

owner Ordem;

LAZY;

sem cascade;

sem delete cascade;

migração para entidade associativa quando o vínculo ganhar estado.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 334 existe;
- continuidade com a aula 333 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_334` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `OrdemServicoEntity` foi criada;
- `TecnicoEntity` foi criada;
- `@ManyToMany` foi aplicado;
- `@JoinTable` foi aplicado;
- tabela de junção foi nomeada;
- schema da tabela foi definido;
- `joinColumns` foi configurado;
- `inverseJoinColumns` foi configurado;
- Ordem foi owner;
- Técnico foi inverse;
- `mappedBy="tecnicos"` foi usado;
- mappedBy apontou para atributo Java;
- duas coleções foram inicializadas;
- `Set` foi praticado;
- `LinkedHashSet` foi usado;
- coleções mutáveis não foram expostas;
- helpers bidirecionais foram criados;
- recursão infinita foi evitada;
- duplicidade em memória foi evitada;
- primary key composta foi criada;
- foreign key para Ordem foi criada;
- foreign key para Técnico foi criada;
- índice por Técnico foi criado;
- `ON DELETE CASCADE` não foi usado;
- três vínculos foram persistidos;
- uma Ordem recebeu dois Técnicos;
- um Técnico recebeu duas Ordens;
- owner controlou a junção;
- alterar somente inverse não persistiu vínculo;
- lazy foi mantido;
- vínculo duplicado não foi inserido;
- remoção do vínculo gerou DELETE na junção;
- Ordem permaneceu depois da remoção do vínculo;
- Técnico permaneceu depois da remoção do vínculo;
- cascade permaneceu vazio;
- ausência de cascade persist foi provada;
- `CascadeType.REMOVE` não foi usado;
- `CascadeType.ALL` não foi usado;
- Técnico compartilhado não foi removido;
- remoção de Técnico vinculado foi bloqueada;
- remoção de Ordem vinculada foi protegida;
- limpeza explícita foi praticada;
- entidade associativa foi explicada;
- atributos no vínculo foram listados;
- critério de migração foi documentado;
- `orphanRemoval` não foi aplicado a ManyToMany;
- SQL foi observado sem bindings;
- testes de mapping foram criados;
- testes de consistência foram criados;
- testes da join table foram criados;
- testes de lifecycle foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- cascade não foi aprofundado antes da aula 335;
- fetch não foi aprofundado antes da aula 336;
- Spring não foi usado;
- ponte para a aula 335 está correta;
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
  labs/m13/aula-334-manytomany-com-criterio
```

Commit recomendado:

```powershell
git commit -m "feat(m13): mapear manytomany com criterio"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você mapeou uma relação muitos-para-muitos sem tratar a annotation como solução automática.

Aprendeu:

```text
@ManyToMany:
coleção muitos-para-muitos.

@JoinTable:
tabela intermediária.

joinColumns:
lado proprietário.

inverseJoinColumns:
lado associado.

mappedBy:
lado inverso.

owner:
controla a junção.

Set:
coleção sem vínculo duplicado.

foreign keys:
integridade real.

entidade associativa:
vínculo com estado próprio.
```

O laboratório comprovou:

```text
Ordem com dois Técnicos;

Técnico em duas Ordens;

três linhas de junção;

sincronização bidirecional;

owner controlando persistência;

duplicidade bloqueada;

remoção somente do vínculo;

entidades preservadas;

cascade destrutivo ausente;

foreign keys protegendo referências.
```

A decisão mais importante foi:

```text
ManyToMany direto:
somente para vínculo simples.

entidade associativa:
quando o vínculo possui atributos,
estado, histórico ou responsabilidade.
```

A próxima aula será:

```text
335 - M13.25 - Cascade OrphanRemoval e responsabilidade
```

Nela, você aprofundará:

- propagação de `PERSIST`;
- propagação de `MERGE`;
- propagação de `REMOVE`;
- propagação de `REFRESH`;
- propagação de `DETACH`;
- `CascadeType.ALL`;
- `orphanRemoval`;
- aggregate root;
- responsabilidade de lifecycle;
- filho exclusivo;
- entidade compartilhada;
- remoção segura;
- diferença entre remover da coleção e remover o pai;
- foreign key;
- testes de efeitos colaterais;
- critérios para cada cascade.

A aula 334 evitou cascades implícitos em entidades compartilhadas.

A aula 335 transformará essa cautela em uma política explícita de responsabilidade.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei `@ManyToMany` com `@JoinTable`.
- [ ] Identifiquei owner e inverse.
- [ ] Sincronizei as duas coleções.
- [ ] Removi vínculos sem remover entidades.
- [ ] Diferenciei ManyToMany direto de entidade associativa.

---

## Troubleshooting adicional

### Relation ordem_servico_tecnico does not exist

Execute Flyway e confira schema e nome da join table.

### mappedBy references unknown property

Use o atributo Java `tecnicos`.

### Vinculo nao foi persistido

O lado proprietário não foi atualizado.

### Duplicate key

O mesmo par já existe.

Revise helper e primary key.

### Transient object

A entidade associada não foi persistida e não existe cascade.

---

## Perguntas de revisao

1. O que significa ManyToMany?
2. Por que existe tabela de junção?
3. Quem é o owner?
4. O que faz `@JoinTable`?
5. O que são joinColumns?
6. O que são inverseJoinColumns?
7. O que mappedBy recebe?
8. Qual lado persiste a associação?
9. Por que sincronizar os dois lados?
10. Qual coleção foi usada?
11. O Set substitui a primary key?
12. Cascade PERSIST foi usado?
13. Cascade REMOVE deve ser usado?
14. O que remover vínculo apaga?
15. OrphanRemoval existe em ManyToMany?
16. Quando o mapeamento direto é aceitável?
17. Quando criar entidade associativa?
18. Quais atributos podem existir no vínculo?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Muitas entidades para muitas.
2. Para armazenar os pares.
3. OrdemServicoEntity.
4. Mapeia a tabela intermediária.
5. Colunas do owner.
6. Colunas do outro lado.
7. Nome do atributo Java proprietário.
8. O owner.
9. Para manter o grafo coerente.
10. Set.
11. Não.
12. Não.
13. Não para entidade compartilhada.
14. A linha da junção.
15. Não.
16. Quando o vínculo é simples.
17. Quando possui estado ou atributos.
18. Papel, datas, valor e status.
19. Não.
20. Cascade OrphanRemoval e responsabilidade.

---

## Desafio opcional

Crie:

```java
ManyToManyDecisionAnalyzer
```

Entrada:

```text
possuiAtributos;

possuiHistorico;

possuiStatus;

possuiAuditoria;

possuiSoftDelete;

entidadesCompartilhadas.
```

Saída:

```text
MANY_TO_MANY_DIRETO;

ENTIDADE_ASSOCIATIVA.
```

Regras:

- decisão determinística;
- justificar cada critério;
- testes unitários;
- nenhuma dependência JPA;
- não substituir decisão arquitetural humana;
- produzir relatório Markdown;
- recomendar entidade associativa quando existir qualquer estado relevante no vínculo.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 334 - M13.24 - ManyToMany com criterio

- Modelei muitas Ordens para muitos Técnicos.
- Usei `@ManyToMany`.
- Usei `@JoinTable`.
- Configurei `joinColumns`.
- Configurei `inverseJoinColumns`.
- Defini Ordem como lado proprietário.
- Defini Técnico como lado inverso.
- Usei `mappedBy="tecnicos"`.
- Criei tabela de junção com Flyway.
- Criei primary key composta.
- Criei duas foreign keys.
- Criei índice por Técnico.
- Mantive `ON DELETE CASCADE` desativado.
- Usei coleções `Set`.
- Inicializei com `LinkedHashSet`.
- Encapsulei as coleções.
- Criei helpers bidirecionais.
- Evitei recursão infinita.
- Evitei duplicidade do vínculo.
- Persisti três linhas de junção.
- Associei uma Ordem a dois Técnicos.
- Associei um Técnico a duas Ordens.
- Comprovei que o owner controla a associação.
- Removi vínculo sem remover entidades.
- Mantive cascade desativado.
- Testei ausência de cascade persist.
- Mantive cascade remove proibido.
- Protegi Técnico compartilhado.
- Diferenciei vínculo simples de vínculo com estado.
- Estudei entidade associativa.
- Listei atributos que exigem entidade própria.
- Mantive Flyway no DDL e Hibernate em validate.
- Não aprofundei cascade antes da aula 335.
- Não aprofundei fetch antes da aula 336.
- Próxima aula: Cascade OrphanRemoval e responsabilidade.
```

---

## Referencia tecnica curta

```text
@ManyToMany:
muitos para muitos.

@JoinTable:
tabela de junção.

Owner:
declara JoinTable.

Inverse:
usa mappedBy.

Set:
coleção de vínculos.

PK composta:
evita duplicidade.

FK:
protege referências.

Remove link:
apaga junção.

Cascade REMOVE:
perigoso.

Entidade associativa:
vínculo com estado.
```

Regra final:

```text
ManyToMany direto deve representar apenas uma associacao simples; quando o vinculo possui atributos, historico, status, auditoria ou responsabilidade propria, ele deve ser promovido a entidade associativa, preservando lifecycle explicito e integridade no banco.
```
