# 335 - M13.25 - Cascade OrphanRemoval e responsabilidade

## Apresentacao da aula

Na aula 334, você estudou `ManyToMany` com critério.

O laboratório mostrou que uma associação direta muitos-para-muitos pode representar um vínculo simples:

```text
Ordem de Serviço
    -> Técnicos habilitados.
```

A tabela de junção possuía somente:

```text
ordem_servico_id;

tecnico_id.
```

Remover o vínculo apagou apenas a linha intermediária.

A Ordem e o Técnico foram preservados porque são entidades compartilhadas e independentes.

Agora você aprofundará:

```text
cascade;

orphanRemoval;

responsabilidade de lifecycle.
```

Cascade não significa apenas escrever menos chamadas de `persist`, `merge` ou `remove`.

Cascade significa:

```text
propagar uma operação de lifecycle
da entidade de origem para a entidade relacionada.
```

As operações possíveis são:

```java
CascadeType.PERSIST
CascadeType.MERGE
CascadeType.REMOVE
CascadeType.REFRESH
CascadeType.DETACH
CascadeType.ALL
```

A pergunta profissional não é:

```text
qual cascade deixa o código mais curto?
```

A pergunta correta é:

```text
quem é responsável pelo nascimento,
pela atualização, pela recarga,
pela desanexação e pela remoção
da entidade relacionada?
```

O laboratório terá três entidades:

```text
ClienteEntity;

OrdemServicoEntity;

AtividadeEntity.
```

O modelo será:

```text
Cliente:
entidade compartilhada;
lifecycle independente.

Ordem:
raiz do agregado.

Atividade:
filha exclusiva da Ordem.
```

Entre Ordem e Cliente:

```text
@ManyToOne;

sem cascade.
```

Motivos:

- Cliente existe antes da Ordem;
- Cliente pode possuir várias Ordens;
- remover Ordem não pode remover Cliente;
- persistir Ordem não deve criar Cliente implicitamente;
- Cliente possui casos de uso próprios.

Entre Ordem e Atividade:

```text
@OneToMany;

cascade = CascadeType.ALL;

orphanRemoval = true.
```

Motivos:

- Atividade nasce dentro da Ordem;
- Atividade não é compartilhada;
- Atividade não faz sentido sem Ordem;
- remover Ordem deve remover suas Atividades;
- retirar uma Atividade da coleção significa removê-la;
- a Ordem controla o lifecycle da Atividade.

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
formacao_java_jpa_335
```

O schema será:

```text
jpa_335
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

O laboratório provará:

```text
Cascade PERSIST:
persistir Ordem persiste Atividades novas.

Cascade MERGE:
merge da Ordem copia o estado das Atividades detached.

Cascade REMOVE:
remover Ordem remove Atividades.

Cascade REFRESH:
refresh da Ordem recarrega Atividades.

Cascade DETACH:
detach da Ordem desanexa Atividades.

Cascade ALL:
reúne as cinco operações.

orphanRemoval:
retirar Atividade gera DELETE.

sem cascade em Cliente:
Cliente não nasce nem morre com a Ordem.

estado final:
zero CLI-JPA-335-%,
OS-JPA-335-% e ATV-JPA-335-%.
```

A próxima aula será:

```text
336 - M13.26 - Fetch lazy eager e proxy
```

Por isso, carregamento e proxy serão usados somente para permitir os testes desta aula.

Não serão aprofundados:

- padrões LAZY e EAGER;
- classe proxy;
- `LazyInitializationException`;
- N+1;
- join fetch;
- entity graph;
- batch fetching;
- Spring;
- Spring Data.

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

337:
Problema N mais um.
```

As aulas 332 a 334 ensinaram estrutura e propriedade dos relacionamentos.

Esta aula tratará da propagação de lifecycle.

Nesta aula:

```text
CascadeType.PERSIST:
praticado.

CascadeType.MERGE:
praticado.

CascadeType.REMOVE:
praticado.

CascadeType.REFRESH:
praticado.

CascadeType.DETACH:
praticado.

CascadeType.ALL:
usado com justificativa.

orphanRemoval:
praticado.

aggregate root:
introduzido.

filho exclusivo:
sim.

entidade compartilhada:
sim.

fetch:
somente apoio.

Spring:
não.
```

A arquitetura será:

```text
ClienteEntity
    <- sem cascade -
OrdemServicoEntity
    - CascadeType.ALL ->
AtividadeEntity.
```

As foreign keys serão:

```text
ordem_servico.cliente_id
    -> cliente.id.

atividade.ordem_servico_id
    -> ordem_servico.id.
```

Não haverá:

```text
ON DELETE CASCADE.
```

O Hibernate será responsável pela ordem das operações durante o cascade.

O banco continuará protegendo qualquer acesso externo.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-335-cascade-orphanremoval-responsabilidade
```

Estrutura final:

```text
labs
└── m13
    └── aula-335-cascade-orphanremoval-responsabilidade
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── matriz-cascade.md
        │   ├── responsabilidade-lifecycle.md
        │   ├── orphanremoval-vs-remove.md
        │   ├── aggregate-root.md
        │   └── troubleshooting-cascade.md
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
            │   │                   └── aula335
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── CascadeResponsibilityLab.java
            │   │                       │   ├── CascadeObservation.java
            │   │                       │   └── CascadeReport.java
            │   │                       └── observability
            │   │                           ├── ExternalJdbcClient.java
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_335.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula335
                                        ├── CascadePersistMergeIT.java
                                        ├── CascadeRemoveIT.java
                                        ├── CascadeRefreshDetachIT.java
                                        ├── OrphanRemovalIT.java
                                        ├── SharedEntityResponsibilityIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
persistir Ordem com duas Atividades:
um INSERT de Ordem;
dois INSERTs de Atividade.

merge da Ordem detached:
UPDATE de Ordem;
UPDATE da Atividade alterada.

retirar uma Atividade:
DELETE da Atividade órfã.

remover Ordem:
DELETE das Atividades;
DELETE da Ordem;
Cliente preservado.

refresh da Ordem:
Atividade recarregada.

detach da Ordem:
Ordem e Atividades detached.

Cliente transient:
não persistido por cascade.

estado final:
zero fixtures.
```

---

## Conceito essencial

### O que e cascade

Cascade é a propagação de uma operação do `EntityManager` por uma associação.

Exemplo:

```java
entityManager.persist(ordem);
```

Com cascade persist em `ordem.atividades`:

```text
persist Ordem;

persist Atividade 1;

persist Atividade 2.
```

Sem cascade, as Atividades precisam de operações explícitas.

Cascade não modifica a cardinalidade.

Ele modifica o lifecycle propagado.

---

### Cascade pertence ao relacionamento

A configuração aparece no atributo:

```java
@OneToMany(
        mappedBy = "ordemServico",
        cascade = CascadeType.ALL,
        orphanRemoval = true
)
```

Ela não pertence à classe Atividade de forma global.

A mesma entidade poderia participar de outro relacionamento com política diferente.

---

### CascadeType.PERSIST

Propaga:

```java
entityManager.persist(parent)
```

para os filhos.

No laboratório:

```java
entityManager.persist(ordem);
```

persiste as Atividades novas da coleção.

Critérios adequados:

- filho nasce dentro da raiz;
- filho não é compartilhado;
- filho não possui criação independente;
- o vínculo é obrigatório.

Não será usado no Cliente compartilhado.

---

### PERSIST e estado da entidade

Cascade persist não transforma qualquer objeto em “salvável”.

Se a coleção contiver uma entidade detached tratada como nova, o provider pode rejeitar a operação.

As regras de ciclo de vida estudadas continuam válidas.

---

### CascadeType.MERGE

Propaga:

```java
entityManager.merge(parent)
```

para o grafo relacionado.

No laboratório:

1. Ordem e Atividades ficam detached;
2. Ordem e uma Atividade são alteradas;
3. `merge(ordemDetached)` é executado;
4. o retorno managed recebe as cópias;
5. o commit sincroniza o agregado.

O argumento original continua detached.

O retorno do merge é a referência correta.

---

### Custo de MERGE

Cascade merge pode percorrer um grafo extenso.

Isso pode provocar:

- SELECTs;
- cópia de estado;
- dirty checking;
- updates;
- conflitos de versão;
- propagação de estado stale.

Use somente quando o relacionamento e o caso de uso justificarem.

---

### CascadeType.REMOVE

Propaga:

```java
entityManager.remove(parent)
```

para as entidades relacionadas.

No laboratório:

```text
remove Ordem
    -> remove Atividades.
```

A Atividade é exclusiva e não faz sentido depois da remoção da Ordem.

O mesmo não vale para Cliente.

---

### REMOVE e ON DELETE CASCADE

Cascade JPA ocorre no ORM.

`ON DELETE CASCADE` ocorre no banco.

Nesta aula:

```text
CascadeType.REMOVE:
sim para Atividades.

ON DELETE CASCADE:
não.
```

O SQL do Hibernate deverá remover filhos antes da raiz.

O banco continuará rejeitando uma ordem incorreta de deletes externos.

---

### CascadeType.REFRESH

Propaga:

```java
entityManager.refresh(parent)
```

para as entidades relacionadas.

No laboratório:

1. Ordem e Atividade estão managed;
2. JDBC externo altera uma Atividade;
3. o contexto mantém estado antigo;
4. `refresh(ordem)` é executado;
5. Ordem e Atividades são recarregadas.

Mudanças locais ainda não sincronizadas podem ser sobrescritas.

---

### CascadeType.DETACH

Propaga:

```java
entityManager.detach(parent)
```

para as entidades relacionadas.

Depois de desanexar a Ordem:

```text
Ordem:
detached.

Atividades carregadas:
detached.
```

Mudanças posteriores deixam de participar do dirty checking.

---

### CascadeType.ALL

`ALL` reúne:

```text
PERSIST;

MERGE;

REMOVE;

REFRESH;

DETACH.
```

Ele não inclui:

```text
orphanRemoval.
```

No laboratório, `ALL` é justificável porque a Atividade acompanha todas as fases do lifecycle da Ordem.

---

### ALL nao e configuracao padrao

Usar `CascadeType.ALL` em toda associação pode gerar:

- inserções implícitas;
- merges grandes;
- remoções destrutivas;
- refresh em cadeia;
- detach inesperado;
- efeitos colaterais difíceis de diagnosticar.

Use somente quando a entidade relacionada for realmente responsabilidade da raiz.

---

### O que e orphanRemoval

`orphanRemoval=true` remove a entidade filha retirada de uma associação exclusiva.

Exemplo:

```java
ordem.removerAtividade(
        atividade
);
```

O helper:

```text
remove da coleção;

desfaz a referência da Atividade para a Ordem.
```

No flush:

```text
DELETE atividade.
```

---

### OrphanRemoval e Cascade REMOVE

Diferença:

```text
Cascade REMOVE:
remove a Ordem;
remove todas as Atividades.

orphanRemoval:
mantém a Ordem;
remove apenas a Atividade retirada.
```

Os dois geram delete, mas possuem gatilhos diferentes.

---

### Filha exclusiva

`orphanRemoval` só faz sentido quando o filho:

- pertence a um único pai;
- não é compartilhado;
- não possui existência independente;
- pode ser removido fisicamente;
- não exige preservação histórica.

Atividade atenderá a esses critérios no laboratório.

---

### Entidade compartilhada

Cliente não atende aos critérios.

Ele:

- pode possuir várias Ordens;
- existe antes e depois delas;
- possui lifecycle próprio;
- não é removido por desvinculação.

Logo:

```text
sem cascade destrutivo;

sem orphan removal.
```

---

### Aggregate root

A raiz do agregado controla invariantes e acesso aos filhos.

No laboratório:

```text
OrdemServicoEntity:
raiz.

AtividadeEntity:
filha interna.

ClienteEntity:
referência externa.
```

A Ordem controla:

- criação de Atividade;
- remoção de Atividade;
- prevenção de código duplicado;
- vínculo obrigatório;
- lifecycle das Atividades.

Ela não controla o lifecycle do Cliente.

---

### Responsabilidade de nascimento

Pergunta:

```text
quem cria a Atividade?
```

Resposta:

```text
a Ordem.
```

Cascade persist é coerente.

Pergunta:

```text
quem cria o Cliente?
```

Resposta:

```text
um caso de uso próprio.
```

Cascade persist na associação Ordem–Cliente seria incoerente.

---

### Responsabilidade de morte

Pergunta:

```text
a Atividade continua válida sem a Ordem?
```

Resposta:

```text
não.
```

Cascade remove pode ser correto.

Pergunta:

```text
o Cliente continua válido sem uma Ordem?
```

Resposta:

```text
sim.
```

Cascade remove seria destrutivo.

---

### Foreign keys permanecem obrigatorias

A tabela Atividade terá:

```text
ordem_servico_id NOT NULL;

foreign key para Ordem.
```

O banco impede:

- Atividade sem Ordem;
- Ordem inexistente;
- remoção da Ordem antes das Atividades;
- inserções externas inválidas.

Cascade não substitui a integridade física.

---

### Helpers da raiz

A Ordem terá:

```java
public AtividadeEntity adicionarAtividade(
        String codigo,
        String descricao,
        OffsetDateTime agora
)
```

e:

```java
public void removerAtividade(
        AtividadeEntity atividade
)
```

O getter retornará:

```java
List.copyOf(atividades)
```

O chamador não terá acesso direto à lista mutável.

---

### Persistencia da raiz

Fluxo:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                clienteId
        );

OrdemServicoEntity ordem =
        new OrdemServicoEntity(
                codigo,
                cliente,
                descricao,
                agora
        );

ordem.adicionarAtividade(...);
ordem.adicionarAtividade(...);

entityManager.persist(ordem);
```

Não é necessário:

```java
entityManager.persist(atividade);
```

para cada filha.

---

### Cliente sem cascade

O Cliente precisa estar:

```text
managed;

ou representado por referência persistente válida.
```

Persistir uma Ordem com Cliente transient deve falhar.

A separação de responsabilidade será testada.

---

### Merge do agregado

Fluxo:

1. carregar Ordem e Atividades;
2. fechar o manager;
3. alterar o grafo detached;
4. executar merge da Ordem;
5. usar o retorno managed;
6. commit;
7. verificar as atualizações.

Não altere o argumento detached depois do merge esperando sincronização.

---

### Refresh do agregado

Para provar cascade refresh:

1. carregar e inicializar Atividades;
2. atualizar uma filha por JDBC;
3. confirmar estado antigo em memória;
4. chamar `refresh(ordem)`;
5. confirmar descrição e versão novas.

O foco é propagação de refresh, não estratégia de fetch.

---

### Detach do agregado

Para provar cascade detach:

1. carregar Ordem;
2. inicializar Atividades;
3. confirmar `contains=true`;
4. chamar `detach(ordem)`;
5. confirmar Ordem e Atividades detached;
6. alterar uma filha;
7. confirmar zero update.

---

### Ordem dos deletes

Ao remover a Ordem, o SQL deve respeitar:

```text
DELETE atividade;

DELETE atividade;

DELETE ordem_servico.
```

O Cliente não recebe delete.

O inspector observará tipos de SQL sem registrar parâmetros.

---

### Transferencia de Atividade

Atividade é exclusiva.

Transferi-la entre Ordens por simples remoção e adição pode acionar orphan removal.

A política será:

```text
não permitir transferência direta.
```

Se a regra futura exigir transferência, será necessário um caso de uso explícito ou um modelo diferente.

---

### Historico e soft delete

Se Atividades removidas precisarem ser preservadas, `orphanRemoval=true` pode ser inadequado.

Alternativa:

```text
status INATIVA;

removida_em;

auditoria.
```

Nesse cenário, a remoção física seria substituída por transição de estado.

O laboratório assume exclusão física permitida.

---

### Matriz de responsabilidade

A documentação registrará:

```text
Ordem -> Atividade:
exclusiva;
ALL;
orphan true.

Ordem -> Cliente:
compartilhada;
sem cascade;
orphan não aplicável.
```

A matriz precisa ser revista quando o domínio mudar.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\main\java\br\com\formacao\m13\aula335\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\main\java\br\com\formacao\m13\aula335\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\main\java\br\com\formacao\m13\aula335\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\main\java\br\com\formacao\m13\aula335\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-335-cascade-orphanremoval-responsabilidade\src\test\java\br\com\formacao\m13\aula335"

Set-Location `
  "labs\m13\aula-335-cascade-orphanremoval-responsabilidade"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 334.

Ajuste:

```text
artifactId:
aula-335-cascade-orphanremoval-responsabilidade.

persistence unit:
aula335PU.

Main:
br.com.formacao.m13.aula335.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_335
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-335-jpa
JPA_POOL_NAME=aula-335-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_335;

CREATE SEQUENCE jpa_335.cliente_id_seq
    START WITH 335001
    INCREMENT BY 1;

CREATE SEQUENCE jpa_335.ordem_servico_id_seq
    START WITH 335101
    INCREMENT BY 1;

CREATE SEQUENCE jpa_335.atividade_id_seq
    START WITH 335201
    INCREMENT BY 1;

CREATE TABLE jpa_335.cliente (
    id bigint NOT NULL,
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,
    ativo boolean NOT NULL DEFAULT true,
    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_335_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_335_cliente_codigo
        UNIQUE (codigo)
);

CREATE TABLE jpa_335.ordem_servico (
    id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    cliente_id bigint NOT NULL,
    descricao varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criada_em timestamptz NOT NULL,
    atualizada_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_335_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_335_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT fk_jpa_335_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES jpa_335.cliente (id)
);

CREATE TABLE jpa_335.atividade (
    id bigint NOT NULL,
    ordem_servico_id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    descricao varchar(300) NOT NULL,
    status varchar(30) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criada_em timestamptz NOT NULL,
    atualizada_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_335_atividade
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_335_atividade_codigo
        UNIQUE (codigo),

    CONSTRAINT fk_jpa_335_atividade_ordem
        FOREIGN KEY (ordem_servico_id)
        REFERENCES jpa_335.ordem_servico (id)
);

CREATE INDEX idx_jpa_335_ordem_cliente
    ON jpa_335.ordem_servico (
        cliente_id
    );

CREATE INDEX idx_jpa_335_atividade_ordem
    ON jpa_335.atividade (
        ordem_servico_id
    );
```

---

### 4. Criar ClienteEntity.java

Crie uma entidade simples com:

```text
id;

codigo;

nome;

ativo;

versao;

criadoEm.
```

Não adicione coleção de Ordens.

O objetivo é manter o lifecycle do Cliente claramente independente.

---

### 5. Criar AtividadeEntity.java

Associação proprietária:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
@JoinColumn(
        name = "ordem_servico_id",
        nullable = false
)
private OrdemServicoEntity ordemServico;
```

A entidade terá:

```text
id;

codigo;

descricao;

status;

versao;

criadaEm;

atualizadaEm.
```

O construtor será package-private e chamado pela Ordem.

Método de domínio:

```java
public void alterarDescricao(
        String novaDescricao,
        OffsetDateTime agora
)
```

Método interno:

```java
void associarOrdemInternal(
        OrdemServicoEntity ordem
)
```

---

### 6. Criar OrdemServicoEntity.java

Cliente compartilhado:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
@JoinColumn(
        name = "cliente_id",
        nullable = false
)
private ClienteEntity cliente;
```

Sem cascade.

Filhas exclusivas:

```java
@OneToMany(
        mappedBy = "ordemServico",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
)
@OrderBy("id ASC")
private List<AtividadeEntity> atividades =
        new ArrayList<>();
```

Getter:

```java
public List<AtividadeEntity> getAtividades() {
    return List.copyOf(atividades);
}
```

---

### 7. Criar helpers da raiz

Adicionar:

```java
public AtividadeEntity adicionarAtividade(
        String codigo,
        String descricao,
        OffsetDateTime agora
) {
    if (
        atividades.stream()
                .anyMatch(
                        item ->
                                item.getCodigo()
                                        .equals(codigo)
                )
    ) {
        throw new IllegalArgumentException(
                "Código de atividade duplicado"
        );
    }

    AtividadeEntity atividade =
            new AtividadeEntity(
                    codigo,
                    descricao,
                    agora
            );

    atividade.associarOrdemInternal(this);
    atividades.add(atividade);

    return atividade;
}
```

Remover:

```java
public void removerAtividade(
        AtividadeEntity atividade
) {
    if (atividade == null) {
        return;
    }

    boolean removed =
            atividades.removeIf(
                    existente ->
                            sameIdentity(
                                    existente,
                                    atividade
                            )
            );

    if (removed) {
        atividade
                .associarOrdemInternal(null);
    }
}
```

O helper `sameIdentity` usa a mesma referência ou IDs não nulos iguais.

---

### 8. Criar persistence.xml e runtime

Liste:

```text
ClienteEntity;

OrdemServicoEntity;

AtividadeEntity.
```

Use:

```text
aula335PU;

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

O runtime também expõe o `DataSource`.

---

### 9. Criar ExternalJdbcClient.java

Método:

```java
public void updateActivityDescription(
        long atividadeId,
        String descricao
)
```

SQL:

```sql
UPDATE jpa_335.atividade
SET
    descricao = ?,
    versao = versao + 1,
    atualizada_em = CURRENT_TIMESTAMP
WHERE id = ?
```

A atualização será usada no cenário de cascade refresh.

---

### 10. Criar CascadeObservation.java

```java
package br.com.formacao.m13.aula335.lab;

public record CascadeObservation(
        String etapa,
        long ordemId,
        int quantidadeAtividades,
        boolean ordemManaged,
        boolean atividadesManaged,
        long insertCount,
        long updateCount,
        long deleteCount
) {

    public CascadeObservation {
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

### 11. Criar CascadeReport.java

```java
package br.com.formacao.m13.aula335.lab;

import java.util.List;

public record CascadeReport(
        List<CascadeObservation> observations,
        boolean persistWasCascaded,
        boolean mergeWasCascaded,
        boolean removeWasCascaded,
        boolean refreshWasCascaded,
        boolean detachWasCascaded,
        boolean orphanWasDeleted,
        boolean clienteWasNotCascaded,
        boolean responsibilityMatrixWasRespected
) {

    public CascadeReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 12. Criar Cliente base

Persista explicitamente:

```text
CLI-JPA-335-MAIN.
```

Nome:

```text
Cliente compartilhado da aula 335.
```

Esse Cliente será reutilizado por mais de uma Ordem em testes de responsabilidade.

---

### 13. Provar Cascade PERSIST

Abra manager e transação.

Busque o Cliente.

Crie:

```text
OS-JPA-335-MAIN.
```

Adicione:

```text
ATV-JPA-335-001;

ATV-JPA-335-002.
```

Execute somente:

```java
entityManager.persist(
        ordem
);
```

Não persista Atividades diretamente.

Flush.

Confirme:

```text
um INSERT de Ordem;

dois INSERTs de Atividade;

IDs das Atividades preenchidos;

zero INSERT de Cliente.
```

Commit.

---

### 14. Provar ausencia de cascade para Cliente

Crie:

```text
CLI-JPA-335-TRANSIENT;

OS-JPA-335-TRANSIENT;

ATV-JPA-335-TRANSIENT.
```

O Cliente permanece transient.

Persista somente a Ordem.

Force flush.

Espere falha por referência transient.

Rollback.

Confirme que nenhuma fixture foi mantida.

---

### 15. Provar Cascade MERGE

Abra manager A.

Busque a Ordem e inicialize as Atividades.

Feche o manager.

Altere:

```text
descrição da Ordem detached;

descrição da primeira Atividade detached.
```

Abra manager B e transação.

Execute:

```java
OrdemServicoEntity managed =
        entityManager.merge(
                detached
        );
```

Confirme:

```text
managed != detached;

retorno managed;

Atividades do retorno managed;

originais continuam detached.
```

Commit.

Em novo contexto, confirme os dois valores.

---

### 16. Provar orphanRemoval

Abra manager e transação.

Busque a Ordem e suas Atividades.

Selecione:

```text
ATV-JPA-335-002.
```

Execute:

```java
ordem.removerAtividade(
        atividade
);
```

Limpe o inspector.

Flush.

Confirme:

```text
um DELETE em atividade;

zero DELETE em ordem_servico;

Ordem existe;

ATV-JPA-335-001 existe.
```

Commit.

---

### 17. Provar Cascade REFRESH

Abra manager.

Busque Ordem e inicialize a Atividade restante.

Guarde descrição e versão.

Atualize a Atividade com o cliente JDBC externo.

Confirme que o objeto managed continua com estado antigo.

Execute:

```java
entityManager.refresh(
        ordem
);
```

Confirme:

```text
Ordem continua managed;

Atividade continua managed;

descrição externa carregada;

versão externa carregada.
```

Feche o manager.

---

### 18. Provar Cascade DETACH

Abra manager.

Busque Ordem e Atividade.

Confirme ambas managed.

Execute:

```java
entityManager.detach(
        ordem
);
```

Confirme:

```text
contains Ordem:
false.

contains Atividade:
false.
```

Altere a Atividade detached.

Abra e confirme uma transação vazia.

Em novo contexto, confirme que a alteração não foi persistida.

---

### 19. Preparar Cascade REMOVE

Abra manager e transação.

Busque a Ordem.

Adicione:

```text
ATV-JPA-335-003.
```

Como a Ordem está managed, a nova Atividade será inserida durante o flush pela política de cascade.

Commit.

---

### 20. Provar Cascade REMOVE

Abra novo manager e transação.

Busque a Ordem e inicialize Atividades.

Execute:

```java
entityManager.remove(
        ordem
);

entityManager.flush();
```

Confirme:

```text
DELETE das Atividades;

DELETE da Ordem;

zero DELETE de Cliente.
```

Commit.

Em novo contexto:

```text
Ordem ausente;

Atividades ausentes;

Cliente presente.
```

---

### 21. Remover Cliente explicitamente

Somente depois de remover as Ordens:

```java
entityManager.remove(
        cliente
);
```

Commit.

Essa operação pertence a um caso de uso separado.

Confirme zero fixtures.

---

### 22. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. cria `ExternalJdbcClient`;
4. executa o laboratório;
5. imprime observações;
6. imprime a matriz de responsabilidade;
7. não imprime SQL completo;
8. fecha runtime.

Formato:

```text
etapa | ordem | atividades | ordem managed | filhas managed | INSERT | UPDATE | DELETE
```

---

### 23. Criar CascadePersistMergeIT.java

Casos:

#### Persist

- Cliente managed;
- Ordem nova;
- duas Atividades novas;
- persist somente Ordem;
- flush;
- confirmar três inserts do agregado;
- rollback.

#### Cliente transient

- persistir somente Ordem;
- esperar falha;
- rollback.

#### Merge

- Ordem e Atividade detached;
- alterar;
- merge da Ordem;
- usar retorno;
- confirmar updates;
- rollback.

#### Retorno ignorado

- alterar o argumento depois do merge;
- confirmar que a mudança posterior não sincroniza.

---

### 24. Criar OrphanRemovalIT.java

#### Remover uma Atividade

- Ordem com duas;
- remover uma pelo helper;
- flush;
- confirmar um DELETE;
- confirmar pai e outra filha;
- rollback.

#### Adicionar em Ordem managed

- adicionar nova Atividade;
- flush;
- confirmar INSERT por cascade;
- rollback.

#### Coleção protegida

- tentar modificar o retorno do getter;
- esperar `UnsupportedOperationException`.

---

### 25. Criar CascadeRemoveIT.java

#### Remover Ordem

- Ordem com duas Atividades;
- remove;
- flush;
- confirmar deletes;
- confirmar Cliente preservado;
- rollback.

#### Remover Cliente referenciado

- Cliente com Ordem;
- tentar remove;
- flush;
- esperar foreign key;
- rollback.

#### Sem delete cascade físico

Consulte metadados PostgreSQL e confirme a política.

---

### 26. Criar CascadeRefreshDetachIT.java

#### Refresh

- carregar grafo;
- atualizar Atividade externamente;
- refresh Ordem;
- confirmar filha recarregada.

#### Refresh descarta local

- alterar Ordem e Atividade;
- refresh Ordem;
- confirmar estado do banco.

#### Detach

- carregar grafo;
- detach Ordem;
- confirmar todas fora do contexto.

#### Detached sem update

- alterar filha;
- confirmar transação vazia;
- zero update.

---

### 27. Criar SharedEntityResponsibilityIT.java

#### Ordem não cria Cliente

Use Cliente transient e espere falha.

#### Ordem não remove Cliente

Remova Ordem e confirme Cliente existente.

#### Cliente compartilhado

Crie duas Ordens para o mesmo Cliente.

Remova uma.

Confirme:

```text
Cliente existe;

segunda Ordem existe.
```

---

### 28. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_335.atividade
WHERE codigo LIKE 'ATV-JPA-335-%';

DELETE FROM jpa_335.ordem_servico
WHERE codigo LIKE 'OS-JPA-335-%';

DELETE FROM jpa_335.cliente
WHERE codigo LIKE 'CLI-JPA-335-%';
```

Use antes e depois dos testes.

---

### 29. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_335.
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
zero ATV-JPA-335-%;

zero OS-JPA-335-%;

zero CLI-JPA-335-%;

foreign keys existentes;

sem ON DELETE CASCADE;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 30. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
PERSIST propagado;

MERGE propagado;

REMOVE propagado;

REFRESH propagado;

DETACH propagado;

orphan removido;

Cliente não recebeu cascade;

foreign keys preservadas;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 31. Criar documentacao

`matriz-cascade.md`:

```text
Tipo | Operação | Ordem-Atividade | Ordem-Cliente | Motivo
```

`responsabilidade-lifecycle.md` deve responder:

- quem cria;
- quem altera;
- quem remove;
- é compartilhado;
- existe sem pai;
- possui caso de uso próprio;
- precisa de histórico.

`orphanremoval-vs-remove.md` deve comparar:

```text
gatilho;

pai permanece;

filhos afetados;

SQL;

risco.
```

`aggregate-root.md` deve descrever:

```text
Ordem:
raiz.

Atividade:
filha interna.

Cliente:
referência externa.
```

`troubleshooting-cascade.md` deve cobrir:

- transient object;
- delete inesperado;
- cascade ausente;
- merge grande;
- orphan não removido;
- refresh apagando mudanças;
- detach parcial;
- foreign key;
- `ALL` sem justificativa.

---

## Entendendo o que foi feito

### Cascade deixou de ser conveniencia

Cada propagação foi associada a uma responsabilidade real.

### Atividade foi tratada como filha exclusiva

A Ordem controlou criação, merge, refresh, detach e remoção.

### Cliente permaneceu compartilhado

Nenhuma operação da Ordem foi propagada ao Cliente.

### OrphanRemoval ganhou significado

Retirar uma Atividade significou removê-la.

### Banco e ORM trabalharam juntos

O ORM ordenou operações e as foreign keys continuaram protegendo integridade.

---

## Erros comuns importantes

### Usar ALL em toda associacao

Isso pode atingir entidades compartilhadas.

### Confundir orphanRemoval com cascade remove

Os gatilhos são diferentes.

### Usar REMOVE em ManyToOne compartilhado

Remover Ordem não pode remover Cliente.

### Usar orphanRemoval quando precisa de historico

Considere soft delete.

### Alterar filhos fora da raiz

Isso pode quebrar invariantes do agregado.

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

### Consultar agregado

```sql
SELECT
    ordem.codigo AS ordem_codigo,
    atividade.codigo AS atividade_codigo,
    atividade.status,
    atividade.versao
FROM jpa_335.ordem_servico AS ordem
LEFT JOIN jpa_335.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
ORDER BY
    ordem.codigo,
    atividade.codigo;
```

---

## Exercicio guiado

### Parte 1 — Somente PERSIST

Troque `ALL` por:

```java
cascade = CascadeType.PERSIST
```

Execute os testes e registre quais cenários deixam de funcionar.

Restaure `ALL`.

### Parte 2 — Sem orphanRemoval

Defina:

```text
orphanRemoval=false.
```

Retire Atividade da coleção.

Observe o efeito e a foreign key obrigatória.

Restaure `true`.

### Parte 3 — Soft delete

Desenhe uma Atividade com:

```text
status INATIVA;

removida_em.
```

Explique por que orphan removal físico seria inadequado.

### Parte 4 — REMOVE no Cliente

Em base descartável, adicione REMOVE ao `ManyToOne`.

Crie duas Ordens para o mesmo Cliente.

Demonstre o risco e remova a configuração.

### Parte 5 — Refresh

Altere Ordem e Atividade localmente.

Execute refresh na Ordem.

Confirme que o estado do banco vence.

### Parte 6 — Detach

Detach Ordem com Atividades carregadas.

Altere todas.

Confirme zero update.

### Parte 7 — Matriz

Avalie:

```text
Cliente;

Atividade;

Técnico;

Produto;

Pagamento;

Histórico.
```

Defina responsabilidade de lifecycle.

### Parte 8 — ADR

Registre:

```text
ALL e orphanRemoval apenas em filhos exclusivos;

sem cascade destrutivo em compartilhadas;

sem ON DELETE CASCADE no laboratório;

helpers da raiz controlam filhos;

soft delete quando histórico for obrigatório.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 335 existe;
- continuidade com a aula 334 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_335` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi criada;
- `OrdemServicoEntity` foi criada;
- `AtividadeEntity` foi criada;
- Cliente foi tratado como compartilhado;
- Atividade foi tratada como exclusiva;
- Ordem foi tratada como raiz;
- `CascadeType.PERSIST` foi explicado;
- PERSIST foi praticado;
- Atividades foram inseridas sem persist explícito;
- Cliente não foi inserido por cascade;
- Cliente transient foi rejeitado;
- `CascadeType.MERGE` foi explicado;
- MERGE foi praticado;
- retorno managed foi usado;
- estado da Atividade foi mesclado;
- `CascadeType.REMOVE` foi explicado;
- REMOVE foi praticado;
- Atividades foram removidas antes da Ordem;
- Cliente foi preservado;
- `CascadeType.REFRESH` foi explicado;
- REFRESH foi praticado;
- atualização externa foi recarregada;
- `CascadeType.DETACH` foi explicado;
- DETACH foi praticado;
- Ordem e Atividades ficaram detached;
- mudança detached não foi persistida;
- `CascadeType.ALL` foi explicado;
- ALL foi justificado pela exclusividade;
- ALL não foi usado no Cliente;
- `orphanRemoval=true` foi aplicado;
- retirar Atividade gerou DELETE;
- Ordem permaneceu depois do orphan;
- outra Atividade permaneceu;
- orphanRemoval foi diferenciado de REMOVE;
- `ON DELETE CASCADE` não foi usado;
- foreign key Ordem-Cliente foi criada;
- foreign key Atividade-Ordem foi criada;
- índices foram criados;
- helpers da raiz foram criados;
- coleção mutável não foi exposta;
- transferência de Atividade não foi permitida;
- soft delete foi discutido;
- aggregate root foi explicado;
- lifecycle exclusivo foi documentado;
- lifecycle compartilhado foi documentado;
- SQL foi observado sem bindings;
- testes de persist e merge foram criados;
- testes de remove foram criados;
- testes de refresh e detach foram criados;
- testes de orphan foram criados;
- testes de responsabilidade foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- fetch não foi aprofundado antes da aula 336;
- N+1 não foi aprofundado antes da aula 337;
- Spring não foi usado;
- ponte para a aula 336 está correta;
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
  labs/m13/aula-335-cascade-orphanremoval-responsabilidade
```

Commit recomendado:

```powershell
git commit -m "feat(m13): aplicar cascade e orphan removal com responsabilidade"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou cascade em uma decisão de responsabilidade.

Aprendeu:

```text
PERSIST:
propaga criação.

MERGE:
propaga cópia de estado.

REMOVE:
propaga remoção.

REFRESH:
propaga recarga.

DETACH:
propaga desanexação.

ALL:
reúne todas.

orphanRemoval:
remove filho retirado.
```

O modelo foi:

```text
Ordem:
raiz do agregado.

Atividade:
filha exclusiva.

Cliente:
entidade compartilhada.
```

Logo:

```text
Ordem -> Atividade:
CascadeType.ALL;
orphanRemoval true.

Ordem -> Cliente:
sem cascade.
```

O laboratório comprovou:

```text
Atividades persistidas com a Ordem;

grafo detached mesclado;

órfã removida;

Atividades removidas com a Ordem;

refresh propagado;

detach propagado;

Cliente preservado;

foreign keys mantidas.
```

A próxima aula será:

```text
336 - M13.26 - Fetch lazy eager e proxy
```

Nela, você aprofundará:

- `FetchType.LAZY`;
- `FetchType.EAGER`;
- padrões JPA por associação;
- proxy;
- classe real e classe proxy;
- inicialização;
- `PersistenceUnitUtil.isLoaded`;
- acesso ao ID;
- acesso a atributo;
- contexto aberto;
- entidade detached;
- `LazyInitializationException`;
- impacto de `toString`;
- impacto de debugger;
- coleções;
- to-one;
- SQL gerado;
- critérios de carregamento.

A aula 335 decidiu quem controla o lifecycle.

A aula 336 mostrará quando o estado das relações é carregado.

---

# Material complementar

## Checkpoint final

- [ ] Relacionei cascade com responsabilidade de lifecycle.
- [ ] Usei ALL somente em filha exclusiva.
- [ ] Mantive Cliente compartilhado sem cascade.
- [ ] Diferenciei orphanRemoval de Cascade REMOVE.
- [ ] Testei PERSIST, MERGE, REMOVE, REFRESH e DETACH.

---

## Troubleshooting adicional

### Transient object references unsaved Cliente

O `ManyToOne` não possui cascade persist.

Persista ou busque o Cliente.

### Atividade nao foi inserida

Confirme coleção, lado proprietário e cascade persist.

### Atividade retirada nao foi apagada

Confirme `orphanRemoval=true` e helper correto.

### Cliente foi removido junto

Existe cascade remove indevido.

### Refresh apagou alteracoes

Refresh recarrega o banco.

---

## Perguntas de revisao

1. O que cascade propaga?
2. Onde cascade é configurado?
3. O que faz PERSIST?
4. O que faz MERGE?
5. O que faz REMOVE?
6. O que faz REFRESH?
7. O que faz DETACH?
8. O que representa ALL?
9. ALL inclui orphanRemoval?
10. O que faz orphanRemoval?
11. Qual diferença para REMOVE?
12. Quando ALL é adequado?
13. Cliente recebeu cascade?
14. Por que Atividade recebeu?
15. O que é raiz de agregado?
16. O banco ainda precisa de foreign key?
17. ON DELETE CASCADE foi usado?
18. Quando evitar exclusão física?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Operações de lifecycle.
2. Na associação.
3. Propaga persist.
4. Propaga merge.
5. Propaga remove.
6. Propaga refresh.
7. Propaga detach.
8. Todas as cascades.
9. Não.
10. Exclui filho retirado.
11. Um remove pai; outro remove órfão.
12. Em filho exclusivo.
13. Não.
14. Porque é exclusiva.
15. Entidade que controla o agregado.
16. Sim.
17. Não.
18. Quando histórico é obrigatório.
19. Não.
20. Fetch lazy eager e proxy.

---

## Desafio opcional

Crie:

```java
CascadeResponsibilityAnalyzer
```

Entrada:

```text
exclusivo;

compartilhado;

existeSemPai;

criadoPeloPai;

removidoComPai;

precisaHistorico;

podeSerOrfao.
```

Saída:

```text
cascade recomendado;

orphanRemoval recomendado;

justificativa;

alertas.
```

Regras:

- não recomendar REMOVE para compartilhado;
- não recomendar orphan removal quando histórico físico for obrigatório;
- não substituir decisão arquitetural;
- produzir relatório Markdown;
- possuir testes unitários;
- não depender de JPA.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 335 - M13.25 - Cascade OrphanRemoval e responsabilidade

- Aprofundei cascade como propagação de lifecycle.
- Estudei `CascadeType.PERSIST`.
- Persisti Atividades por cascade da Ordem.
- Mantive Cliente sem cascade persist.
- Estudei `CascadeType.MERGE`.
- Mesclei Ordem e Atividade detached.
- Usei o retorno managed do merge.
- Estudei `CascadeType.REMOVE`.
- Removi Atividades junto com a Ordem.
- Preservei Cliente compartilhado.
- Estudei `CascadeType.REFRESH`.
- Recarreguei Atividade por refresh da Ordem.
- Estudei `CascadeType.DETACH`.
- Desanexei Ordem e Atividades.
- Estudei `CascadeType.ALL`.
- Usei ALL somente em filha exclusiva.
- Entendi que ALL não inclui orphanRemoval.
- Usei `orphanRemoval=true`.
- Removi uma Atividade órfã.
- Diferenciei orphanRemoval de Cascade REMOVE.
- Modelei Ordem como raiz de agregado.
- Modelei Atividade como filha exclusiva.
- Modelei Cliente como entidade compartilhada.
- Mantive foreign keys reais no Flyway.
- Mantive `ON DELETE CASCADE` desativado.
- Criei helpers para controlar a coleção.
- Evitei transferência arbitrária de Atividade.
- Estudei soft delete e histórico.
- Mantive Hibernate em validate.
- Não aprofundei fetch antes da aula 336.
- Não aprofundei N+1 antes da aula 337.
- Próxima aula: Fetch lazy eager e proxy.
```

---

## Referencia tecnica curta

```text
PERSIST:
criar junto.

MERGE:
mesclar junto.

REMOVE:
remover junto.

REFRESH:
recarregar junto.

DETACH:
desanexar junto.

ALL:
todas as cascades.

orphanRemoval:
apagar filho retirado.

Aggregate root:
controla lifecycle.

Shared entity:
sem cascade destrutivo.

FK:
proteção física.
```

Regra final:

```text
cascade e orphanRemoval devem refletir responsabilidade real de lifecycle: filhos exclusivos podem acompanhar a raiz, enquanto entidades compartilhadas exigem operacoes explicitas; reduzir codigo nunca justifica propagacao destrutiva ou perda de historico.
```
