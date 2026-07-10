# 332 - M13.22 - Relacionamento ManyToOne

## Apresentacao da aula

Na aula 331, você aprofundou o controle do persistence context por meio de:

```text
flush;

clear;

detach;

refresh.
```

O laboratório mostrou que:

```text
flush:
sincroniza SQL sem confirmar a transação.

clear:
desanexa todas as entidades.

detach:
desanexa uma entidade.

refresh:
recarrega o estado atual do banco.
```

Até aqui, as entidades principais foram estudadas quase sempre de forma isolada.

Nesta aula, você começará a mapear relações entre entidades.

O primeiro relacionamento será:

```text
muitas Ordens de Serviço
    -> um Cliente.
```

Em termos de negócio:

```text
um Cliente pode possuir várias Ordens;

cada Ordem pertence a um Cliente.
```

O foco oficial é:

```java
@ManyToOne
```

A classe `OrdemServicoEntity` terá um atributo:

```java
private ClienteEntity cliente;
```

Esse atributo será mapeado para a coluna:

```text
cliente_id.
```

No PostgreSQL, a coluna será protegida por uma foreign key real:

```sql
FOREIGN KEY (cliente_id)
REFERENCES jpa_332.cliente (id)
```

A entidade proprietária do relacionamento será:

```text
OrdemServicoEntity.
```

Ela é proprietária porque contém a coluna de associação e define:

```java
@JoinColumn
```

`ClienteEntity` não terá uma coleção de Ordens nesta aula.

A navegação será apenas:

```text
Ordem -> Cliente.
```

A navegação inversa:

```text
Cliente -> Ordens.
```

será estudada na aula 333, dedicada a:

```text
Relacionamento OneToMany.
```

Nesta aula, você praticará:

- `@ManyToOne`;
- `@JoinColumn`;
- foreign key;
- lado proprietário;
- cardinalidade;
- `optional=false`;
- `nullable=false`;
- associação obrigatória;
- `FetchType.LAZY`;
- diferença entre contrato JPA e comportamento do provider;
- associação com entidade managed;
- associação com `getReference`;
- ausência de cascade;
- tentativa de associar entidade transient;
- troca de Cliente em Ordem managed;
- dirty checking da foreign key;
- remoção protegida pela constraint;
- índice da foreign key;
- identidade da entidade associada;
- SQL gerado;
- testes de integração;
- alinhamento com Flyway.

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
formacao_java_jpa_332
```

O schema será:

```text
jpa_332
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

O laboratório criará:

```text
ClienteEntity;

OrdemServicoEntity.
```

O fluxo principal comprovará:

```text
Cliente existente:
pode ser associado a uma nova Ordem.

duas Ordens:
podem apontar para o mesmo Cliente.

foreign key:
fica persistida em cliente_id.

troca de Cliente:
gera UPDATE da foreign key.

Cliente com Ordens:
não pode ser removido.

Ordem removida:
libera a remoção do Cliente.

Cliente transient sem cascade:
não é persistido automaticamente.

getReference:
permite representar associação por identidade.

estado final:
zero fixtures CLI-JPA-332-% e OS-JPA-332-%.
```

A próxima aula será:

```text
333 - M13.23 - Relacionamento OneToMany
```

Por isso, não haverá ainda:

- coleção `List<OrdemServicoEntity>` em Cliente;
- `mappedBy`;
- sincronização bidirecional;
- métodos `adicionarOrdem`;
- `orphanRemoval`;
- cascade em coleção;
- problema de coleção lazy;
- N+1 de OneToMany;
- `join fetch`;
- Spring Data.

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

331:
Flush clear detach e refresh.

332:
Relacionamento ManyToOne.

333:
Relacionamento OneToMany.
```

Até a aula 331, a foreign key existia apenas como conceito de banco estudado anteriormente.

Agora ela será representada no modelo Java por uma referência de entidade.

Em vez de mapear:

```java
private Long clienteId;
```

a entidade mapeará:

```java
private ClienteEntity cliente;
```

O ID da foreign key continua existindo no banco.

Mas o modelo JPA passa a expressar:

```text
esta Ordem pertence a este Cliente.
```

Nesta aula:

```text
@ManyToOne:
aprofundado.

@JoinColumn:
sim.

lado proprietário:
sim.

foreign key:
sim.

associação obrigatória:
sim.

fetch:
sim.

cascade:
ausente de propósito.

getReference:
sim.

OneToMany:
não.

bidirecional:
não.

Spring:
não.
```

A arquitetura será:

```text
OrdemServicoEntity
    -> ClienteEntity
        -> tabela cliente.

OrdemServicoEntity
    -> coluna cliente_id
        -> foreign key
            -> cliente.id.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-332-relacionamento-manytoone
```

Estrutura final:

```text
labs
└── m13
    └── aula-332-relacionamento-manytoone
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-manytoone.md
        │   ├── lado-proprietario.md
        │   ├── fetch-manytoone.md
        │   ├── politica-cascade.md
        │   └── troubleshooting-manytoone.md
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
            │   │                   └── aula332
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── ManyToOneLab.java
            │   │                       │   ├── ManyToOneObservation.java
            │   │                       │   └── ManyToOneReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_332.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula332
                                        ├── ManyToOneMappingIT.java
                                        ├── ManyToOneIntegrityIT.java
                                        ├── ManyToOneFetchIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
Cliente A:
duas Ordens.

Cliente B:
uma Ordem depois da troca.

cliente_id:
persistido corretamente.

mesmo contexto:
duas Ordens do Cliente A apontam para a mesma instância Cliente.

LAZY:
Cliente não precisa ser inicializado no find da Ordem.

getReference:
associação criada por ID.

sem cascade:
Cliente transient provoca falha.

FK:
bloqueia Cliente com Ordem.

estado final:
tabelas sem fixtures.
```

---

## Conceito essencial

### Cardinalidade

`ManyToOne` significa:

```text
muitas instâncias da entidade de origem
podem apontar para uma instância da entidade alvo.
```

No laboratório:

```text
Ordem 1 -> Cliente A;

Ordem 2 -> Cliente A;

Ordem 3 -> Cliente B.
```

A multiplicidade está do lado das Ordens.

A referência Java fica em cada Ordem:

```java
private ClienteEntity cliente;
```

---

### @ManyToOne

Mapeamento básico:

```java
@ManyToOne
private ClienteEntity cliente;
```

A annotation informa ao provider que o atributo representa uma associação muitos-para-um.

Ela não define sozinha:

- nome da coluna;
- nome da foreign key física;
- nulabilidade da coluna;
- índice;
- comportamento de deleção do PostgreSQL.

Esses pontos serão alinhados com `@JoinColumn` e Flyway.

---

### @JoinColumn

Mapeamento:

```java
@JoinColumn(
        name = "cliente_id",
        nullable = false
)
```

`name` é a coluna da tabela proprietária:

```text
ordem_servico.cliente_id.
```

Ela referencia:

```text
cliente.id.
```

A coluna não fica na tabela Cliente.

Ela fica na tabela Ordem porque a Ordem é o lado que conhece seu Cliente.

---

---

### Lado proprietario

O lado proprietário é responsável por persistir a associação.

No laboratório:

```text
OrdemServicoEntity:
possui @ManyToOne;
possui @JoinColumn;
controla cliente_id.
```

A alteração:

```java
ordem.alterarCliente(
        clienteB
);
```

muda a foreign key durante o dirty checking.

`ClienteEntity` ainda não conhece uma coleção de Ordens.

Isso evita antecipar `OneToMany`.

---

### Foreign key fisica

Flyway criará:

```sql
CONSTRAINT fk_jpa_332_ordem_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES jpa_332.cliente (id)
```

A foreign key protege qualquer acesso ao banco:

- JPA;
- JDBC;
- script;
- ferramenta;
- outra aplicação.

A annotation expressa o mapeamento.

A constraint física garante integridade.

---

### Indice na foreign key

PostgreSQL não cria automaticamente um índice na coluna que referencia outra tabela.

O laboratório criará:

```sql
CREATE INDEX idx_jpa_332_ordem_cliente
    ON jpa_332.ordem_servico (
        cliente_id
    );
```

O índice ajuda em:

- consulta de Ordens por Cliente;
- validação de remoção do Cliente;
- joins;
- manutenção da relação.

Não crie índices automaticamente sem considerar consultas, mas foreign keys usadas em joins costumam justificar avaliação.

---

### optional e nullable

Mapeamento:

```java
@ManyToOne(
        optional = false
)
```

e:

```java
@JoinColumn(
        nullable = false
)
```

Expressam intenções relacionadas, mas em níveis diferentes.

`optional=false` pertence ao modelo JPA:

```text
a associação não deve ser nula.
```

`nullable=false` descreve a coluna de join.

O banco também terá:

```sql
cliente_id bigint NOT NULL
```

As três camadas devem concordar.

---

### optional nao substitui validacao

O construtor de `OrdemServicoEntity` também exigirá Cliente não nulo.

Isso oferece falha antecipada.

Mesmo assim, o banco permanece a defesa final.

O modelo terá:

```java
Objects.requireNonNull(
        cliente,
        "cliente é obrigatório"
);
```

---

### FetchType padrao

O padrão JPA para `ManyToOne` é:

```text
EAGER.
```

Isso significa que o provider deve disponibilizar a associação carregada conforme o contrato.

Entretanto, carregar automaticamente toda associação to-one pode aumentar:

- joins;
- SELECTs;
- volume de dados;
- custo de consultas;
- risco de N+1 em listas futuras.

O laboratório configurará:

```java
fetch = FetchType.LAZY
```

---

### LAZY em ManyToOne

Para `ManyToOne`, `LAZY` é uma dica ao provider.

A especificação permite que o provider carregue antecipadamente.

No Hibernate do laboratório, espera-se proxy ou mecanismo equivalente.

O teste de SQL será conscientemente específico do provider:

```text
find Ordem:
não inicializa Cliente.

acessar cliente.getNome():
pode executar SELECT do Cliente.
```

Não escreva regras de negócio que dependam de uma contagem exata de SELECTs sem teste de integração.

---

### Proxy e getId

Uma referência lazy pode ser representada por proxy.

Em muitos casos, chamar:

```java
ordem.getCliente().getId()
```

não exige inicializar toda a entidade, porque o identificador já é conhecido pela foreign key.

Chamar:

```java
ordem.getCliente().getNome()
```

exige os dados do Cliente e pode disparar leitura.

Esse comportamento é do provider e deve ser observado, não assumido universalmente.

---

### PersistenceUnitUtil

A API JPA oferece:

```java
PersistenceUnitUtil
```

Use:

```java
factory.getPersistenceUnitUtil()
        .isLoaded(
                ordem,
                "cliente"
        );
```

Ela ajuda a verificar se a associação foi carregada.

O laboratório combinará:

- `isLoaded`;
- SQL capturado;
- acesso ao atributo.

---

### Associacao com entidade managed

Fluxo seguro:

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

entityManager.persist(ordem);
```

Cliente já pertence ao contexto.

Persistir Ordem insere apenas a Ordem.

---

### Associacao com getReference

Quando a aplicação conhece o ID e não precisa ler os dados do Cliente:

```java
ClienteEntity referencia =
        entityManager.getReference(
                ClienteEntity.class,
                clienteId
        );
```

A referência pode ser usada em:

```java
new OrdemServicoEntity(
        codigo,
        referencia,
        descricao,
        agora
);
```

Isso pode evitar um `SELECT` do Cliente.

A foreign key ainda será validada pelo banco no `INSERT` da Ordem.

---

### Risco do getReference

`getReference` não garante imediatamente que a linha exista.

Se o ID for inexistente:

- acessar atributos pode lançar `EntityNotFoundException`;
- inserir a Ordem pode falhar na foreign key;
- a exceção pode aparecer somente no flush.

Use quando:

- o ID veio de fonte confiável;
- a regra aceita validação no banco;
- o fluxo trata a falha;
- não precisa dos dados da entidade alvo.

Use `find` quando a regra precisa:

- confirmar existência;
- validar status;
- usar atributos;
- produzir mensagem de domínio específica.

---

### Cascade

`@ManyToOne` não terá cascade.

Mapeamento:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
```

Sem:

```java
cascade = ...
```

Motivo:

```text
Cliente possui ciclo de vida independente;

criar Ordem não deve criar Cliente automaticamente;

remover Ordem não deve remover Cliente;

Cliente é compartilhado por várias Ordens.
```

---

### CascadeType.PERSIST

Se fosse usado:

```java
cascade = CascadeType.PERSIST
```

persistir Ordem com Cliente novo poderia persistir o Cliente.

Isso pode esconder uma operação de negócio importante.

No laboratório, Cliente deve ser criado explicitamente antes.

---

### CascadeType.REMOVE

Nunca será usado neste `ManyToOne`.

Se uma Ordem removesse seu Cliente por cascade:

```text
outras Ordens poderiam ficar inválidas;

um filho controlaria o lifecycle do pai compartilhado.
```

A foreign key e a regra de negócio exigem direção oposta.

---

### Entidade transient sem cascade

Fluxo inválido:

```java
ClienteEntity novoCliente =
        new ClienteEntity(...);

OrdemServicoEntity ordem =
        new OrdemServicoEntity(
                "OS-JPA-332-ERRO",
                novoCliente,
                "Ordem inválida",
                agora
        );

entityManager.persist(ordem);
entityManager.flush();
```

Como o Cliente não foi persistido e não existe cascade, o provider deve rejeitar a referência transient.

A falha pode ser traduzida como exceção de persistência.

---

### Troca de associacao

Uma Ordem managed pode trocar de Cliente:

```java
ordem.alterarCliente(
        clienteB,
        agora
);
```

No flush, dirty checking detecta:

```text
cliente_id mudou.
```

O SQL será semelhante a:

```sql
UPDATE jpa_332.ordem_servico
SET
    cliente_id = ?,
    atualizada_em = ?,
    versao = ?
WHERE id = ?
  AND versao = ?
```

A entidade Cliente não precisa ser atualizada.

---

### Associacao e identidade do contexto

Se duas Ordens do mesmo Cliente forem carregadas no mesmo persistence context e suas associações forem inicializadas, ambas devem apontar para a mesma instância managed de Cliente.

Conceitualmente:

```java
ordem1.getCliente()
        == ordem2.getCliente()
```

esperado:

```text
true.
```

Isso é consequência do mapa de identidade estudado na aula 329.

---

### Remocao do Cliente

A foreign key será criada sem:

```text
ON DELETE CASCADE.
```

Ao tentar remover Cliente com Ordens:

```text
DELETE cliente
```

o banco deve rejeitar.

A exceção aparecerá no flush ou commit.

Para remover o Cliente no laboratório:

1. remover as Ordens;
2. flush ou commit;
3. remover Cliente;
4. commit.

Essa sequência respeita a integridade.

---

### Remocao da Ordem

Remover Ordem não remove Cliente.

Sem cascade remove:

```text
DELETE ordem_servico;

Cliente permanece.
```

Esse é o comportamento esperado para uma relação muitos-para-um com entidade alvo compartilhada.

---

---

---

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\main\java\br\com\formacao\m13\aula332\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\main\java\br\com\formacao\m13\aula332\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\main\java\br\com\formacao\m13\aula332\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\main\java\br\com\formacao\m13\aula332\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-332-relacionamento-manytoone\src\test\java\br\com\formacao\m13\aula332"

Set-Location `
  "labs\m13\aula-332-relacionamento-manytoone"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 331.

Ajuste:

```text
artifactId:
aula-332-relacionamento-manytoone.

persistence unit:
aula332PU.

Main:
br.com.formacao.m13.aula332.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_332
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-332-jpa
JPA_POOL_NAME=aula-332-pool
JPA_POOL_SIZE=4
```

O arquivo real permanece fora do Git.

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_332;

CREATE SEQUENCE jpa_332.cliente_id_seq
    START WITH 332001
    INCREMENT BY 1;

CREATE SEQUENCE jpa_332.ordem_servico_id_seq
    START WITH 332101
    INCREMENT BY 1;

CREATE TABLE jpa_332.cliente (
    id bigint NOT NULL,
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,
    ativo boolean NOT NULL DEFAULT true,
    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_332_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_332_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_332_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_jpa_332_cliente_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE jpa_332.ordem_servico (
    id bigint NOT NULL,
    codigo varchar(70) NOT NULL,
    cliente_id bigint NOT NULL,
    status varchar(30) NOT NULL,
    descricao varchar(300) NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criada_em timestamptz NOT NULL,
    atualizada_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_332_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_332_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT fk_jpa_332_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES jpa_332.cliente (id),

    CONSTRAINT ck_jpa_332_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_jpa_332_ordem_descricao
        CHECK (btrim(descricao) <> '')
);

CREATE INDEX idx_jpa_332_ordem_cliente
    ON jpa_332.ordem_servico (
        cliente_id
    );

CREATE INDEX idx_jpa_332_ordem_status
    ON jpa_332.ordem_servico (
        status
    );
```

Não use `ON DELETE CASCADE`.

---

### 4. Criar ClienteEntity.java

```java
package br.com.formacao.m13.aula332.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity(name = "Cliente")
@Table(
        name = "cliente",
        schema = "jpa_332"
)
public class ClienteEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "cliente_seq"
    )
    @SequenceGenerator(
            name = "cliente_seq",
            sequenceName =
                    "jpa_332.cliente_id_seq",
            allocationSize = 1
    )
    private Long id;

    @Column(
            name = "codigo",
            nullable = false,
            unique = true,
            length = 60,
            updatable = false
    )
    private String codigo;

    @Column(
            name = "nome",
            nullable = false,
            length = 120
    )
    private String nome;

    @Column(
            name = "ativo",
            nullable = false
    )
    private boolean ativo;

    @Version
    @Column(
            name = "versao",
            nullable = false
    )
    private int versao;

    @Column(
            name = "criado_em",
            nullable = false,
            updatable = false
    )
    private OffsetDateTime criadoEm;

    protected ClienteEntity() {
    }

    public ClienteEntity(
            String codigo,
            String nome,
            OffsetDateTime criadoEm
    ) {
        this.codigo =
                requireText(codigo, "codigo");
        this.nome =
                requireText(nome, "nome");

        if (criadoEm == null) {
            throw new IllegalArgumentException(
                    "criadoEm é obrigatório"
            );
        }

        this.ativo = true;
        this.criadoEm = criadoEm;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNome() {
        return nome;
    }

    public boolean isAtivo() {
        return ativo;
    }

    private static String requireText(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " é obrigatório"
            );
        }

        return value.trim();
    }
}
```

Não adicione coleção de Ordens.

---

### 5. Criar OrdemServicoEntity.java

```java
package br.com.formacao.m13.aula332.entity;

import java.time.OffsetDateTime;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity(name = "OrdemServico")
@Table(
        name = "ordem_servico",
        schema = "jpa_332"
)
public class OrdemServicoEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "ordem_servico_seq"
    )
    @SequenceGenerator(
            name = "ordem_servico_seq",
            sequenceName =
                    "jpa_332.ordem_servico_id_seq",
            allocationSize = 1
    )
    private Long id;

    @Column(
            name = "codigo",
            nullable = false,
            unique = true,
            length = 70,
            updatable = false
    )
    private String codigo;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "cliente_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name =
                            "fk_jpa_332_ordem_cliente"
            )
    )
    private ClienteEntity cliente;

    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private String status;

    @Column(
            name = "descricao",
            nullable = false,
            length = 300
    )
    private String descricao;

    @Version
    @Column(
            name = "versao",
            nullable = false
    )
    private int versao;

    @Column(
            name = "criada_em",
            nullable = false,
            updatable = false
    )
    private OffsetDateTime criadaEm;

    @Column(
            name = "atualizada_em",
            nullable = false
    )
    private OffsetDateTime atualizadaEm;

    protected OrdemServicoEntity() {
    }

    public OrdemServicoEntity(
            String codigo,
            ClienteEntity cliente,
            String descricao,
            OffsetDateTime agora
    ) {
        this.codigo =
                requireText(codigo, "codigo");
        this.cliente =
                Objects.requireNonNull(
                        cliente,
                        "cliente é obrigatório"
                );
        this.descricao =
                requireText(
                        descricao,
                        "descricao"
                );

        if (agora == null) {
            throw new IllegalArgumentException(
                    "agora é obrigatório"
            );
        }

        this.status = "ABERTA";
        this.criadaEm = agora;
        this.atualizadaEm = agora;
    }

    public void alterarCliente(
            ClienteEntity novoCliente,
            OffsetDateTime agora
    ) {
        Objects.requireNonNull(
                novoCliente,
                "novoCliente é obrigatório"
        );

        if (agora == null) {
            throw new IllegalArgumentException(
                    "agora é obrigatório"
            );
        }

        if (this.cliente == novoCliente) {
            return;
        }

        this.cliente = novoCliente;
        this.atualizadaEm = agora;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public ClienteEntity getCliente() {
        return cliente;
    }

    public String getStatus() {
        return status;
    }

    public int getVersao() {
        return versao;
    }

    private static String requireText(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " é obrigatório"
            );
        }

        return value.trim();
    }
}
```

A annotation `@ForeignKey` documenta o nome esperado.

O objeto físico continua criado pelo Flyway.

---

### 6. Criar persistence.xml e runtime

A persistence unit será:

```text
aula332PU.
```

Liste:

```text
ClienteEntity;

OrdemServicoEntity.
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

Mantenha:

```text
hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true;

hibernate.show_sql=false.
```

---

### 7. Criar ManyToOneObservation.java

```java
package br.com.formacao.m13.aula332.lab;

public record ManyToOneObservation(
        String etapa,
        long ordemId,
        long clienteId,
        boolean clienteLoaded,
        boolean sameClienteReference,
        long selectCount,
        long insertCount,
        long updateCount,
        long deleteCount
) {

    public ManyToOneObservation {
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

### 8. Criar ManyToOneReport.java

```java
package br.com.formacao.m13.aula332.lab;

import java.util.List;

public record ManyToOneReport(
        List<ManyToOneObservation> observations,
        boolean foreignKeyPersisted,
        boolean twoOrdersSharedSameCliente,
        boolean lazyAssociationObserved,
        boolean getReferenceAvoidedClientSelect,
        boolean changingClienteUpdatedForeignKey,
        boolean transientClienteWasRejected,
        boolean deletingReferencedClienteWasBlocked,
        boolean deletingOrderPreservedCliente
) {

    public ManyToOneReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar Clientes

Na primeira transação, persista:

```text
CLI-JPA-332-A;

CLI-JPA-332-B.
```

Nomes:

```text
Cliente ManyToOne A;

Cliente ManyToOne B.
```

Confirme a transação.

Feche o manager para iniciar as etapas controladas.

---

### 10. Persistir duas Ordens para Cliente A

Abra manager e transação.

Busque Cliente A com `find`.

Crie:

```text
OS-JPA-332-001;

OS-JPA-332-002.
```

Associe ambas à mesma instância managed de Cliente.

Persista somente as Ordens.

Flush.

Confirme:

```text
dois INSERTs em ordem_servico;

zero INSERT em cliente;

cliente_id igual ao ID do Cliente A.
```

Commit.

---

### 11. Verificar mesma instancia associada

Abra novo manager.

Busque as duas Ordens por ID.

Inicialize as associações acessando:

```java
getCliente().getNome()
```

Confirme:

```java
ordem1.getCliente()
        == ordem2.getCliente()
```

igual a:

```text
true.
```

O persistence context reutilizou a instância Cliente da mesma identidade.

---

### 12. Verificar lazy

Abra novo manager e limpe inspector.

Busque uma Ordem por ID.

Use:

```java
PersistenceUnitUtil util =
        factory.getPersistenceUnitUtil();
```

Consulte:

```java
util.isLoaded(
        ordem,
        "cliente"
)
```

Esperado no Hibernate do laboratório:

```text
false antes do acesso ao nome.
```

Confirme que o `find` da Ordem não executou SELECT completo do Cliente.

Acesse:

```java
ordem.getCliente().getNome();
```

Depois:

```text
associação carregada;

SELECT do Cliente observado.
```

O teste deve registrar que `LAZY` é uma dica da especificação e que a assertiva de SQL é específica do provider configurado.

---

### 13. Criar Ordem com getReference

Abra manager e transação.

Limpe inspector.

Obtenha:

```java
ClienteEntity referencia =
        entityManager.getReference(
                ClienteEntity.class,
                clienteAId
        );
```

Crie:

```text
OS-JPA-332-003.
```

Persista e flush.

Confirme:

```text
INSERT da Ordem;

cliente_id correto;

nenhum SELECT necessário para carregar dados do Cliente.
```

Não acesse `referencia.getNome()` antes do flush.

Commit.

---

### 14. Trocar Cliente da Ordem

Abra manager e transação.

Busque:

```text
OS-JPA-332-002.
```

Busque Cliente B.

Limpe inspector.

Execute:

```java
ordem.alterarCliente(
        clienteB,
        agora
);
```

Flush.

Confirme:

```text
um UPDATE;

cliente_id agora aponta para B;

versão da Ordem incrementada;

Cliente B não sofreu UPDATE.
```

Commit.

---

### 15. Testar Cliente transient

Crie um Cliente novo fora do contexto:

```text
CLI-JPA-332-TRANSIENT.
```

Crie Ordem:

```text
OS-JPA-332-TRANSIENT.
```

Abra manager e transação.

Persista somente a Ordem.

Force flush.

Espere:

```text
PersistenceException;
ou exceção equivalente do provider.
```

Execute rollback.

Confirme:

```text
Cliente transient não foi inserido;

Ordem não foi inserida.
```

Não compare a classe interna exata do Hibernate.

---

### 16. Testar getReference inexistente

Abra manager e transação.

Obtenha referência para:

```text
ID 999999999.
```

Crie Ordem com essa referência.

Persista e flush.

Espere falha de integridade da foreign key.

Após a exceção:

```text
rollback;

fechar manager.
```

Documente que `getReference` não substitui validação de existência quando a regra precisa de mensagem específica.

---

### 17. Testar remocao protegida

Abra manager e transação.

Busque Cliente A.

Execute:

```java
entityManager.remove(clienteA);
entityManager.flush();
```

Como Cliente A ainda possui Ordens, espere falha da foreign key.

Rollback e feche manager.

Confirme em novo contexto:

```text
Cliente A existe;

Ordens existem.
```

---

### 18. Remover uma Ordem e preservar Cliente

Abra manager e transação.

Busque `OS-JPA-332-003`.

Remova e commit.

Em novo contexto:

```text
Ordem ausente;

Cliente A presente.
```

Isso prova ausência de cascade remove.

---

### 19. Limpeza final

Remova todas as Ordens restantes.

Faça flush.

Depois remova os dois Clientes.

Commit.

A ordem importa por causa da foreign key.

Confirme:

```text
zero OS-JPA-332-%;

zero CLI-JPA-332-%.
```

---

### 20. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `ManyToOneLab`;
4. imprime observações;
5. imprime booleanos;
6. não imprime SQL completo;
7. não imprime dados sensíveis;
8. fecha runtime.

Formato:

```text
etapa | ordem | cliente | loaded | mesma referencia | SELECT | INSERT | UPDATE
```

---

### 21. Criar ManyToOneMappingIT.java

Casos:

#### Persistir associação managed

- criar Cliente;
- persistir Ordem com Cliente managed;
- flush;
- confirmar FK por JDBC;
- rollback.

#### Duas Ordens mesmo Cliente

- carregar duas Ordens;
- inicializar Cliente;
- confirmar mesma referência;
- confirmar mesmo ID.

#### Trocar Cliente

- carregar Ordem e Cliente B;
- alterar;
- flush;
- confirmar update de `cliente_id`;
- confirmar versão;
- rollback.

#### GetReference

- obter referência;
- persistir Ordem;
- confirmar ausência de SELECT do Cliente;
- confirmar FK;
- rollback.

---

### 22. Criar ManyToOneIntegrityIT.java

#### Associação nula

O construtor deve falhar antes do JPA.

#### Cliente transient

Persista somente Ordem.

Force flush.

Espere falha e rollback.

#### ID inexistente por reference

Use getReference de ID inexistente.

Force flush.

Espere falha da foreign key.

#### Remover Cliente referenciado

Force flush da remoção.

Espere falha.

#### Remover Ordem

Confirme que Cliente permanece.

---

### 23. Criar ManyToOneFetchIT.java

#### LAZY antes do acesso

- find Ordem;
- verificar `isLoaded`;
- inspecionar SQL;
- não acessar nome.

#### Inicializar associação

- acessar `getNome`;
- confirmar loaded;
- confirmar SELECT do Cliente.

#### ID da associação

- acessar somente `getId`;
- observar se o Hibernate evita inicialização;
- documentar como comportamento do provider.

Não transforme o último comportamento em garantia portável.

---

### 24. Criar TestDataCleaner.java

A ordem da limpeza será:

```sql
DELETE FROM jpa_332.ordem_servico
WHERE codigo LIKE 'OS-JPA-332-%';

DELETE FROM jpa_332.cliente
WHERE codigo LIKE 'CLI-JPA-332-%';
```

Use no `@BeforeEach` e `@AfterEach`.

---

### 25. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_332.
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
zero OS-JPA-332-%;

zero CLI-JPA-332-%;

foreign key existente;

índice cliente_id existente;

schema history com V1.
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
associação persistida;

duas Ordens compartilharam Cliente;

lazy observado;

getReference evitou leitura;

troca atualizou FK;

transient foi rejeitado;

Cliente referenciado não foi removido;

Ordem removida preservou Cliente;

estado final ficou limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 27. Criar documentacao

`contrato-manytoone.md` deve registrar:

- cardinalidade;
- entidade origem;
- entidade alvo;
- coluna;
- foreign key;
- optional;
- nullable;
- fetch;
- cascade;
- lifecycle.

`lado-proprietario.md` deve explicar:

```text
Ordem possui JoinColumn;

Ordem atualiza cliente_id;

Cliente não possui coleção nesta aula.
```

`fetch-manytoone.md` deve comparar:

```text
EAGER padrão JPA;

LAZY como dica;

proxy;

isLoaded;

acesso ao ID;

acesso ao nome;

SQL observado.
```

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

motivo:
Cliente independente e compartilhado.
```

`troubleshooting-manytoone.md` deve cobrir:

- transient object;
- cliente nulo;
- FK violation;
- lazy initialization;
- proxy;
- `isLoaded`;
- cascade indevido;
- delete bloqueado;
- coluna errada;
- índice ausente;
- schema validation.

---

## Entendendo o que foi feito

### A foreign key ganhou representacao no modelo

`cliente_id` passou a ser manipulada pela referência `ClienteEntity`.

### Ordem ficou como lado proprietario

A entidade que contém `@JoinColumn` controla a associação.

### Cliente permaneceu independente

Criar ou remover Ordem não criou nem removeu Cliente automaticamente.

### Lazy foi observado com criterio

O comportamento foi medido no Hibernate sem ser tratado como garantia universal.

### Integridade permaneceu no banco

A foreign key bloqueou referência inexistente e remoção de Cliente em uso.

---

## Erros comuns importantes

### Adicionar CascadeType.ALL por conveniencia

Isso pode persistir ou remover Cliente indevidamente.

### Usar REMOVE em ManyToOne compartilhado

Uma Ordem não deve controlar o lifecycle do Cliente.

### Achar que LAZY sempre impede SELECT

É uma dica no contrato JPA.

### Usar getReference quando precisa validar status

Use find e aplique a regra de negócio.

### Criar OneToMany antes de dominar o lado proprietario

A foreign key é controlada pela Ordem.

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

### Inspecionar associação

```sql
SELECT
    ordem.id,
    ordem.codigo,
    ordem.cliente_id,
    cliente.codigo AS cliente_codigo,
    ordem.status,
    ordem.versao
FROM jpa_332.ordem_servico AS ordem
JOIN jpa_332.cliente AS cliente
    ON cliente.id = ordem.cliente_id
ORDER BY ordem.id;
```

---

## Exercicio guiado

### Parte 1 — Associação opcional

Em uma branch experimental, permita Ordem sem Cliente.

Altere:

```text
optional;

nullable;

DDL;

construtor.
```

Documente por que essa decisão muda a regra de negócio.

Não altere o fluxo oficial.

### Parte 2 — EAGER

Troque temporariamente para `EAGER`.

Compare SQL de:

```text
find Ordem;

find duas Ordens;

acesso ao Cliente.
```

Restaure `LAZY`.

### Parte 3 — Cascade PERSIST

Ative em ambiente descartável.

Persista Ordem com Cliente novo.

Observe os INSERTs.

Remova a configuração e escreva o risco.

### Parte 4 — Troca de associação

Troque a Ordem entre Cliente A e B em dois flushes.

Observe:

```text
dois UPDATEs;

duas versões.
```

### Parte 5 — Referência inexistente

Compare:

```text
find:
retorna null.

getReference:
retorna referência e falha depois.
```

Documente quando cada escolha é adequada.

### Parte 6 — Índice

Use `EXPLAIN` em consulta de Ordens por `cliente_id`.

Remova o índice apenas em base descartável e compare o plano.

Não faça conclusão com poucos dados.

### Parte 7 — Restrição de remoção

Planeje um caso de uso de exclusão de Cliente.

Defina:

- bloquear;
- inativar;
- transferir Ordens;
- remover dependências.

Não implemente cascade delete.

### Parte 8 — Matriz de relacionamento

Crie:

```text
Decisão | Valor | Motivo | Proteção no banco
```

Inclua optional, nullable, fetch, cascade, foreign key e índice.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 332 existe;
- continuidade com a aula 331 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_332` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi criada;
- `OrdemServicoEntity` foi criada;
- Cliente não possui coleção de Ordens;
- `@ManyToOne` foi aplicado;
- `@JoinColumn` foi aplicado;
- coluna `cliente_id` foi definida;
- associação aponta para primary key;
- lado proprietário foi identificado;
- Ordem controla a foreign key;
- cardinalidade foi explicada;
- `optional=false` foi usado;
- `nullable=false` foi usado;
- construtor rejeitou Cliente nulo;
- coluna física é NOT NULL;
- foreign key real foi criada;
- nome da foreign key foi documentado;
- índice em `cliente_id` foi criado;
- `FetchType.LAZY` foi usado;
- EAGER padrão foi explicado;
- LAZY como dica foi explicado;
- `PersistenceUnitUtil.isLoaded` foi usado;
- acesso ao Cliente inicializou a associação;
- comportamento específico do provider foi documentado;
- associação com entidade managed foi praticada;
- duas Ordens apontaram para o mesmo Cliente;
- mesma instância Cliente no mesmo contexto foi comprovada;
- `getReference` foi praticado;
- ausência de SELECT do Cliente foi observada;
- risco de referência inexistente foi testado;
- foreign key bloqueou ID inexistente;
- cascade não foi configurado;
- Cliente transient foi rejeitado;
- Cliente não foi persistido automaticamente;
- troca de Cliente foi praticada;
- update de `cliente_id` foi observado;
- versão da Ordem incrementou;
- Cliente não sofreu update na troca;
- remoção de Cliente referenciado falhou;
- remoção de Ordem preservou Cliente;
- `ON DELETE CASCADE` não foi usado;
- `CascadeType.REMOVE` não foi usado;
- `CascadeType.ALL` não foi usado;
- SQL foi observado sem bindings;
- testes de mapping foram criados;
- testes de integridade foram criados;
- testes de fetch foram criados;
- limpeza respeitou a ordem da foreign key;
- fixtures usam prefixos reservados;
- fixtures foram removidas;
- estado final ficou vazio;
- OneToMany não foi antecipado;
- `mappedBy` não foi antecipado;
- bidirecionalidade não foi antecipada;
- Spring não foi usado;
- ponte para a aula 333 está correta;
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
  labs/m13/aula-332-relacionamento-manytoone
```

Commit recomendado:

```powershell
git commit -m "feat(m13): mapear relacionamento manytoone"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou relacionamentos JPA pelo lado que controla a foreign key.

Aprendeu:

```text
@ManyToOne:
muitas Ordens para um Cliente.

@JoinColumn:
coluna cliente_id.

lado proprietário:
OrdemServicoEntity.

optional=false:
associação obrigatória no modelo.

nullable=false:
coluna obrigatória.

LAZY:
carregamento adiado como dica.

getReference:
associação por identidade.

cascade ausente:
lifecycles independentes.

foreign key:
integridade real.
```

O laboratório comprovou:

```text
duas Ordens para o mesmo Cliente;

cliente_id persistido;

mesma instância Cliente no contexto;

associação lazy observada;

getReference sem leitura completa;

troca de Cliente gerando UPDATE;

Cliente transient rejeitado;

ID inexistente bloqueado;

Cliente referenciado protegido;

Ordem removida sem remover Cliente.
```

A próxima aula será:

```text
333 - M13.23 - Relacionamento OneToMany
```

Nela, você adicionará a navegação inversa:

```text
Cliente
    -> coleção de Ordens.
```

Você estudará:

- `@OneToMany`;
- `mappedBy`;
- lado inverso;
- lado proprietário;
- coleção;
- inicialização;
- métodos auxiliares;
- sincronização dos dois lados;
- `List` versus `Set`;
- ausência de cascade por padrão;
- cascade consciente;
- `orphanRemoval`;
- remoção da coleção;
- lazy loading;
- SQL gerado;
- N+1 introdutório;
- testes de consistência bidirecional.

A aula 332 estabeleceu o lado proprietário.

A aula 333 construirá a visão inversa sem perder o controle da foreign key.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei muitas Ordens para um Cliente.
- [ ] Identifiquei Ordem como lado proprietário.
- [ ] Alinhei optional, nullable e foreign key.
- [ ] Testei LAZY e getReference.
- [ ] Mantive cascade remove desativado.

---

## Troubleshooting adicional

### Transient object references an unsaved instance

O Cliente associado não foi persistido e não existe cascade.

### Foreign key violation

O `cliente_id` não existe ou o Cliente está sendo removido em uso.

### Cliente carregou antes do esperado

`LAZY` é dica e o provider pode antecipar.

Revise SQL e acesso realizado.

### LazyInitializationException

A associação foi acessada depois do fechamento do contexto.

Carregue os dados necessários dentro da unidade.

### Remover Ordem removeu Cliente

Existe cascade remove indevido.

Remova a configuração.

---

## Perguntas de revisao

1. O que significa ManyToOne?
2. Onde fica a foreign key?
3. Qual é o lado proprietário?
4. O que faz `@JoinColumn`?
5. O que faz `optional=false`?
6. O que faz `nullable=false`?
7. Qual é o fetch padrão de ManyToOne?
8. LAZY é garantia?
9. O que faz `getReference`?
10. Ele confirma existência imediatamente?
11. Quando preferir find?
12. Cascade PERSIST foi usado?
13. Cascade REMOVE deve ser usado aqui?
14. Cliente transient é salvo automaticamente?
15. O que ocorre ao trocar Cliente?
16. Duas Ordens podem compartilhar a mesma instância Cliente?
17. O banco possui foreign key?
18. Remover Ordem remove Cliente?
19. OneToMany foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Muitas entidades para uma.
2. Na tabela da entidade proprietária.
3. OrdemServicoEntity.
4. Mapeia a coluna de associação.
5. Associação obrigatória no JPA.
6. Coluna não nula.
7. EAGER.
8. Não; é dica.
9. Cria referência por identidade.
10. Não.
11. Quando precisa validar ou ler dados.
12. Não.
13. Não.
14. Não.
15. A foreign key é atualizada.
16. Sim, no mesmo contexto.
17. Sim.
18. Não.
19. Não.
20. Relacionamento OneToMany.

---

## Desafio opcional

Crie:

```java
ManyToOneContractInspector
```

Ele deve ler por reflection:

```text
atributo;

tipo alvo;

fetch;

optional;

cascade;

join column;

nullable;

foreign key name.
```

Saída:

```text
Markdown determinístico.
```

Regras:

- nenhuma API interna Hibernate;
- nenhuma conexão necessária;
- lista imutável;
- testes unitários;
- falhar quando não houver `@ManyToOne`;
- não inferir constraint física sem consultar migration;
- comparar metadado Java com um contrato esperado.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 332 - M13.22 - Relacionamento ManyToOne

- Iniciei relacionamentos JPA.
- Modelei muitas Ordens para um Cliente.
- Criei `ClienteEntity`.
- Criei `OrdemServicoEntity`.
- Usei `@ManyToOne`.
- Usei `@JoinColumn`.
- Mapeei a coluna `cliente_id`.
- Identifiquei Ordem como lado proprietário.
- Mantive Cliente sem coleção nesta aula.
- Usei `optional=false`.
- Usei `nullable=false`.
- Criei foreign key real com Flyway.
- Criei índice para `cliente_id`.
- Entendi que ManyToOne é EAGER por padrão.
- Configurei `FetchType.LAZY`.
- Entendi LAZY como dica ao provider.
- Usei `PersistenceUnitUtil.isLoaded`.
- Observei inicialização ao acessar o Cliente.
- Associei Ordem a Cliente managed.
- Associei Ordem com `getReference`.
- Entendi o risco de ID inexistente.
- Mantive cascade desativado.
- Testei Cliente transient sem cascade.
- Troquei o Cliente de uma Ordem.
- Observei update da foreign key.
- Comprovei mesma instância Cliente no contexto.
- Bloqueei remoção de Cliente referenciado.
- Removi Ordem sem remover Cliente.
- Mantive `ON DELETE CASCADE` desativado.
- Não antecipei OneToMany ou bidirecionalidade.
- Próxima aula: Relacionamento OneToMany.
```

---

## Referencia tecnica curta

```text
@ManyToOne:
muitas para uma.

@JoinColumn:
foreign key.

Owner:
lado com a coluna.

optional:
regra JPA.

nullable:
regra da coluna.

LAZY:
dica de carregamento.

getReference:
referência por ID.

cascade:
propagação de lifecycle.

FK:
integridade no banco.

index:
apoio a join e delete.
```

Regra final:

```text
um relacionamento ManyToOne profissional exige identificar o lado proprietário, alinhar optional e nullable, criar foreign key e indice no banco, escolher fetch conscientemente e impedir que cascades transfiram indevidamente o ciclo de vida de uma entidade compartilhada.
```
