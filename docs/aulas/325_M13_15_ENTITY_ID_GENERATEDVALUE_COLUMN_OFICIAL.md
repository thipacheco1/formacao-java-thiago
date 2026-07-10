# 325 - M13.15 - Entity Id GeneratedValue Column

## Apresentacao da aula

Na aula 324, você tornou visível a implementação Hibernate por trás de Jakarta Persistence.

O laboratório mostrou:

```text
EntityManagerFactory e SessionFactory;

EntityManager e Session;

dialeto PostgreSQL;

SQL gerado;

dirty checking;

cache de primeiro nível;

StatementInspector;

estatísticas;

validação de schema.
```

Agora você aprofundará a descrição básica de uma entidade persistente.

O tema oficial é:

```text
Entity Id GeneratedValue Column.
```

Essas anotações formam o núcleo de um mapeamento JPA simples:

```java
@Entity
@Table
@Id
@GeneratedValue
@SequenceGenerator
@Column
```

Elas respondem perguntas diferentes:

```text
@Entity:
esta classe participa da persistência?

@Table:
qual tabela representa a entidade?

@Id:
qual atributo identifica a entidade?

@GeneratedValue:
quem gera o identificador?

@SequenceGenerator:
qual sequence será utilizada?

@Column:
como o atributo se relaciona com a coluna?
```

O laboratório continuará sem Spring.

O provider será Hibernate, mas o código principal continuará usando Jakarta Persistence.

Flyway seguirá responsável pelo schema.

Você não permitirá:

```text
hibernate.hbm2ddl.auto=create;

hibernate.hbm2ddl.auto=update;

hibernate.hbm2ddl.auto=create-drop.
```

O modo continuará:

```text
validate.
```

O database será isolado:

```text
formacao_java_jpa_325
```

O schema será:

```text
jpa_325
```

Duas estratégias serão praticadas:

```text
SEQUENCE;

IDENTITY.
```

A entidade principal será:

```java
ClienteEntity
```

Ela usará:

```text
Long como ID;

GenerationType.SEQUENCE;

@SequenceGenerator;

@Column com name, nullable, unique, length,
precision, scale, insertable e updatable.
```

Uma segunda entidade didática:

```java
ProtocoloEntity
```

usará:

```text
GenerationType.IDENTITY.
```

A comparação permitirá observar:

- como o provider obtém o ID;
- quando o ID fica disponível;
- como sequence e identity aparecem no SQL;
- por que a estratégia precisa estar alinhada ao banco;
- por que o tipo `Long` é preferível ao `long` para ID gerado;
- por que annotations não substituem constraints do Flyway;
- por que `insertable=false` e `updatable=false` exigem entendimento;
- por que `unique=true` não deve ser sua única defesa;
- por que `precision` e `scale` precisam combinar com `numeric`;
- por que a coluna gerenciada pelo banco pode exigir `refresh`.

A aula também explicará conceitualmente:

```text
GenerationType.AUTO;

GenerationType.TABLE;

GenerationType.UUID.
```

Somente `SEQUENCE` e `IDENTITY` serão implementadas no fluxo principal.

A próxima aula será:

```text
326 - M13.16 - Embeddable e objetos de valor persistidos
```

Por isso, esta aula manterá os atributos como tipos simples.

Não serão antecipados:

- `@Embeddable`;
- `@Embedded`;
- `@AttributeOverride`;
- relacionamentos;
- herança;
- JPQL;
- repositories Spring Data;
- Lombok;
- geração automática de schema.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
322:
Flyway com Maven.

323:
JPA conceitos fundamentais.

324:
Hibernate como implementação JPA.

325:
Entity, Id, GeneratedValue e Column.

326:
Embeddable e objetos de valor persistidos.
```

Na aula 323, `ClienteEntity` possuía um mapeamento mínimo para permitir o estudo do ciclo de vida.

Na aula 324, o provider e o SQL gerado ficaram visíveis.

Nesta aula, o foco passa a ser a precisão do contrato entre:

```text
classe;

entidade JPA;

tabela;

identificador;

estratégia de geração;

colunas;

constraints.
```

Nesta aula:

```text
@Entity:
sim.

@Table:
sim.

@Id:
sim.

@GeneratedValue:
sim.

SEQUENCE:
prática.

IDENTITY:
prática.

AUTO:
conceitual.

TABLE:
conceitual.

UUID:
conceitual.

@Column:
aprofundado.

Embeddable:
não.

Relacionamentos:
não.

Spring:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-325-entity-id-generatedvalue-column
```

Estrutura final:

```text
labs
└── m13
    └── aula-325-entity-id-generatedvalue-column
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-cliente-entity.md
        │   ├── estrategias-generatedvalue.md
        │   ├── annotations-vs-database.md
        │   └── troubleshooting-mapeamento.md
        ├── scripts
        │   ├── 01_criar_database.ps1
        │   ├── 02_executar_migration.ps1
        │   ├── 03_executar_laboratorio.ps1
        │   ├── 04_demo_schema_incompativel.ps1
        │   ├── 05_validar_estado_final.ps1
        │   └── 06_limpar_database.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula325
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── ProtocoloEntity.java
            │   │                       ├── lab
            │   │                       │   ├── BasicMappingLab.java
            │   │                       │   └── MappingReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_325.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula325
                                        ├── BasicMappingIT.java
                                        ├── MappingMetadataTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
Cliente:
ID gerado por sequence;
código imutável no UPDATE;
limite com duas casas decimais;
criado_em preenchido pelo banco;
refresh carregando valor gerado.

Protocolo:
ID gerado por identity;
INSERT necessário para obter ID.

Schema:
validado pelo Hibernate;
criado somente pelo Flyway.

Estado final:
zero fixtures CLI-JPA-325-%;
zero protocolos PROTO-JPA-325-%.
```

---

## Conceito essencial

### @Entity

`@Entity` marca uma classe como entidade JPA.

Exemplo:

```java
@Entity
public class ClienteEntity {
}
```

A classe precisa:

- não ser final;
- possuir construtor sem argumentos público ou protegido;
- possuir identidade;
- ser incluída na persistence unit ou descoberta conforme configuração;
- respeitar as limitações de proxies e do provider.

No laboratório, o construtor sem argumentos será:

```java
protected ClienteEntity() {
}
```

A entidade continuará encapsulando alterações por métodos.

---

### Nome da entidade

Você pode definir:

```java
@Entity(name = "Cliente")
```

Esse nome pertence à linguagem de consultas JPA.

Ele não é necessariamente o nome da tabela.

Mesmo sem usar JPQL nesta aula, a distinção precisa ficar clara:

```text
nome da entidade:
Cliente.

nome da tabela:
cliente.
```

Não confunda `@Entity(name)` com `@Table(name)`.

---

### @Table

`@Table` define detalhes da tabela.

Exemplo:

```java
@Table(
        name = "cliente",
        schema = "jpa_325"
)
```

O schema explícito reduz dependência do `search_path`.

O Flyway cria a tabela com o mesmo nome.

Hibernate apenas valida.

A annotation também possui recursos como `uniqueConstraints` e `indexes`, mas o laboratório manterá índices e constraints no SQL versionado.

Motivo:

```text
Flyway é a fonte da evolução física do schema.
```

---

### @Id

Toda entidade precisa de identidade.

Exemplo:

```java
@Id
private Long id;
```

O identificador diferencia duas entidades persistentes.

No persistence context, a chave lógica é semelhante a:

```text
classe da entidade + ID.
```

Para IDs gerados, use preferencialmente wrapper:

```java
Long
```

em vez de:

```java
long.
```

`Long` permite:

```text
null:
ainda não atribuído.

valor:
identidade atribuída.
```

O primitivo começa em zero, que pode confundir ausência de ID com um valor sentinela.

---

### Identidade de banco e identidade de objeto

Antes de persistir:

```text
ID:
null.

estado:
transient.
```

Depois da geração:

```text
ID:
não nulo.

estado:
managed.
```

O ID de banco não é a mesma coisa que referência Java.

Duas instâncias detached podem representar a mesma linha.

O persistence context, entretanto, mantém uma instância managed por identidade.

---

### equals e hashCode

Entidades com ID gerado exigem cuidado.

Um `hashCode` baseado em ID muda quando:

```text
id null -> id 325001.
```

Se o objeto estiver em `HashSet`, isso pode quebrar sua localização.

Nesta aula, as entidades não sobrescreverão `equals` e `hashCode`.

A próxima aula trabalhará objetos de valor, que possuem igualdade por valor naturalmente.

Regra inicial:

```text
não gere equals/hashCode automaticamente com todos os campos.
```

---

### @GeneratedValue

`@GeneratedValue` indica que o identificador será gerado.

Exemplo:

```java
@GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "cliente_seq"
)
```

A estratégia precisa combinar com o schema.

O provider não inventa uma sequence que o Flyway não criou quando o modo de DDL é `validate`.

---

### GenerationType.SEQUENCE

PostgreSQL oferece sequences nativas.

Mapeamento:

```java
@SequenceGenerator(
        name = "cliente_seq",
        sequenceName = "jpa_325.cliente_id_seq",
        allocationSize = 1
)
```

O nome:

```text
cliente_seq
```

é o nome lógico do generator JPA.

O nome:

```text
jpa_325.cliente_id_seq
```

é o objeto real no banco.

Com `allocationSize=1`, cada novo ID exige avanço individual da sequence.

Isso facilita o laboratório, mas não é a única configuração possível.

Valores maiores permitem alocação em blocos e reduzem round trips.

A sequence do banco e o `allocationSize` precisam estar alinhados à estratégia do provider.

---

### GenerationType.IDENTITY

`IDENTITY` usa uma coluna de identidade ou mecanismo equivalente do banco.

No PostgreSQL:

```sql
GENERATED BY DEFAULT AS IDENTITY
```

O provider precisa executar o `INSERT` para obter o ID produzido.

Isso pode reduzir oportunidades de batching em certos cenários.

No laboratório, `ProtocoloEntity` mostrará a diferença de ordem SQL em relação à sequence.

---

### GenerationType.AUTO

`AUTO` delega a escolha ao provider.

O resultado pode variar por:

- provider;
- versão;
- dialeto;
- tipo do ID;
- configuração.

É conveniente, mas menos explícito.

Em sistemas que exigem previsibilidade de schema e performance, declarar `SEQUENCE` ou `IDENTITY` costuma facilitar revisão.

O laboratório não usará `AUTO`.

---

### GenerationType.TABLE

`TABLE` simula geração por meio de uma tabela própria.

Ele é mais portável para bancos sem sequences ou identity, mas exige leitura e atualização de uma linha geradora.

Pode produzir contenção.

PostgreSQL possui sequences nativas.

Por isso, `TABLE` não será implementada.

---

### GenerationType.UUID

Jakarta Persistence atual também define estratégia UUID.

Ela é apropriada quando o identificador Java é compatível com UUID e quando a arquitetura deseja geração sem round trip central para sequence.

Ela altera:

- tipo da coluna;
- tamanho de índice;
- ordenação;
- legibilidade;
- distribuição de inserções.

A estratégia não será praticada aqui para manter o foco em IDs numéricos gerados pelo PostgreSQL.

---

### @Column name

`name` associa atributo e coluna:

```java
@Column(name = "limite_credito")
private BigDecimal limiteCredito;
```

Sem `name`, regras de naming do provider determinam o nome.

Usar nomes explícitos melhora previsibilidade em um projeto sem framework de configuração.

---

### nullable

```java
@Column(nullable = false)
```

declara que o atributo não deve mapear para coluna nula.

Isso ajuda o provider e a validação.

Mas a proteção real precisa existir no banco:

```sql
NOT NULL
```

Annotation e migration precisam concordar.

---

### unique

```java
@Column(unique = true)
```

expressa unicidade no modelo de schema.

Não dependa apenas dela.

O Flyway deve criar:

```sql
CONSTRAINT uk_jpa_325_cliente_codigo
    UNIQUE (codigo)
```

A constraint do banco protege concorrência e todos os clientes SQL.

---

### length

```java
@Column(length = 120)
```

descreve tamanho de coluna textual.

Ela precisa combinar com:

```sql
varchar(120)
```

O limite também pode ser validado na aplicação.

`length` não é usado para `text` da mesma forma que para `varchar`.

---

### precision e scale

Para:

```java
BigDecimal
```

use:

```java
@Column(
        precision = 15,
        scale = 2
)
```

Alinhamento:

```sql
numeric(15, 2)
```

`precision` é o total de dígitos.

`scale` é a quantidade de casas decimais.

Exemplo máximo positivo aproximado:

```text
9999999999999.99
```

Não use `double` para valores monetários.

---

### insertable

```java
@Column(insertable = false)
```

impede a coluna de aparecer no `INSERT` gerado para aquela propriedade.

Uso comum:

- default do banco;
- coluna calculada;
- trigger;
- valor gerenciado externamente;
- mapeamento duplicado controlado.

No laboratório:

```text
criado_em
```

será preenchido pelo PostgreSQL.

Depois do `persist`, o campo Java permanecerá nulo até ocorrer:

```java
entityManager.refresh(cliente);
```

---

### updatable

```java
@Column(updatable = false)
```

impede a coluna de aparecer no `UPDATE` gerado.

No laboratório:

```text
codigo;

criado_em.
```

serão não atualizáveis.

Isso não substitui uma regra de domínio.

Se o código é imutável, a classe também não deve oferecer alteração pública arbitrária.

---

### columnDefinition

`columnDefinition` permite declarar fragmento SQL específico.

Exemplo conceitual:

```java
@Column(
        columnDefinition = "numeric(15,2)"
)
```

Isso aumenta acoplamento ao banco e costuma ser desnecessário quando Flyway já define o schema.

O laboratório não usará `columnDefinition`.

---

### Annotation nao substitui migration

O contrato completo precisa existir em dois lados coerentes:

```text
Java:
annotations e tipos.

Banco:
DDL, constraints, sequence, identity.
```

Hibernate `validate` verifica compatibilidade importante, mas não garante que todas as regras de negócio estejam equivalentes.

Testes de integração continuam necessários.

---

### Refresh

`refresh` recarrega o estado da linha para a entidade managed.

No laboratório:

1. persistir Cliente;
2. flush;
3. observar `criadoEm == null`;
4. executar `refresh`;
5. observar `criadoEm != null`.

Use `refresh` com critério.

Ele executa leitura adicional e pode sobrescrever mudanças ainda não sincronizadas.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\main\java\br\com\formacao\m13\aula325\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\main\java\br\com\formacao\m13\aula325\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\main\java\br\com\formacao\m13\aula325\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\main\java\br\com\formacao\m13\aula325\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-325-entity-id-generatedvalue-column\src\test\java\br\com\formacao\m13\aula325"

Set-Location `
  "labs\m13\aula-325-entity-id-generatedvalue-column"
```

---

### 2. Criar pom e configuracao

Reutilize da aula 324:

```text
Java 21;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

SLF4J Simple;

JUnit;

Failsafe;

Exec Maven Plugin.
```

Ajuste:

```text
artifactId:
aula-325-mapeamento-basico-jpa.

persistence unit:
aula325PU.

Main:
br.com.formacao.m13.aula325.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_325
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-325-jpa
JPA_POOL_NAME=aula-325-pool
JPA_POOL_SIZE=3
```

O arquivo real permanece ignorado.

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_325;

CREATE SEQUENCE jpa_325.cliente_id_seq
    START WITH 325001
    INCREMENT BY 1;

CREATE TABLE jpa_325.cliente (
    id bigint NOT NULL,
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,
    email varchar(160),
    limite_credito numeric(15, 2) NOT NULL,
    ativo boolean NOT NULL,
    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_325_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_325_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_325_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_jpa_325_cliente_nome
        CHECK (btrim(nome) <> ''),

    CONSTRAINT ck_jpa_325_cliente_limite
        CHECK (limite_credito >= 0)
);

CREATE TABLE jpa_325.protocolo (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo varchar(60) NOT NULL,
    descricao varchar(200) NOT NULL,

    CONSTRAINT pk_jpa_325_protocolo
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_325_protocolo_codigo
        UNIQUE (codigo)
);
```

A sequence do Cliente é explícita.

O Protocolo usa identity.

---

### 4. Criar persistence.xml

Liste:

```text
ClienteEntity;

ProtocoloEntity.
```

Use:

```text
RESOURCE_LOCAL;

provider Hibernate;

exclude-unlisted-classes true;

shared-cache-mode NONE;

validation-mode NONE.
```

As propriedades runtime permanecem na factory.

Hibernate usa:

```text
hbm2ddl.auto=validate;

generate_statistics=true;

StatementInspector.
```

---

### 5. Criar ClienteEntity.java

```java
package br.com.formacao.m13.aula325.entity;

import java.math.BigDecimal;
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
        schema = "jpa_325"
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
                    "jpa_325.cliente_id_seq",
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
            name = "email",
            length = 160
    )
    private String email;

    @Column(
            name = "limite_credito",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal limiteCredito;

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
            insertable = false,
            updatable = false
    )
    private OffsetDateTime criadoEm;

    @Column(
            name = "atualizado_em",
            nullable = false
    )
    private OffsetDateTime atualizadoEm;

    protected ClienteEntity() {
    }

    public ClienteEntity(
            String codigo,
            String nome,
            String email,
            BigDecimal limiteCredito,
            OffsetDateTime agora
    ) {
        requireText(codigo, "codigo");
        requireText(nome, "nome");

        if (
            limiteCredito == null
            || limiteCredito.signum() < 0
        ) {
            throw new IllegalArgumentException(
                    "limiteCredito inválido"
            );
        }

        if (agora == null) {
            throw new IllegalArgumentException(
                    "agora é obrigatório"
            );
        }

        this.codigo = codigo.trim();
        this.nome = nome.trim();
        this.email = normalizeNullable(email);
        this.limiteCredito =
                limiteCredito.setScale(2);
        this.ativo = true;
        this.atualizadoEm = agora;
    }

    public void alterarNomeELimite(
            String novoNome,
            BigDecimal novoLimite,
            OffsetDateTime agora
    ) {
        requireText(novoNome, "novoNome");

        if (
            novoLimite == null
            || novoLimite.signum() < 0
        ) {
            throw new IllegalArgumentException(
                    "novoLimite inválido"
            );
        }

        if (agora == null) {
            throw new IllegalArgumentException(
                    "agora é obrigatório"
            );
        }

        this.nome = novoNome.trim();
        this.limiteCredito =
                novoLimite.setScale(2);
        this.atualizadoEm = agora;
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

    public BigDecimal getLimiteCredito() {
        return limiteCredito;
    }

    public OffsetDateTime getCriadoEm() {
        return criadoEm;
    }

    public int getVersao() {
        return versao;
    }

    private static void requireText(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " é obrigatório"
            );
        }
    }

    private static String normalizeNullable(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
```

Não crie setter de código.

---

### 6. Criar ProtocoloEntity.java

```java
package br.com.formacao.m13.aula325.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity(name = "Protocolo")
@Table(
        name = "protocolo",
        schema = "jpa_325"
)
public class ProtocoloEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
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
            name = "descricao",
            nullable = false,
            length = 200
    )
    private String descricao;

    protected ProtocoloEntity() {
    }

    public ProtocoloEntity(
            String codigo,
            String descricao
    ) {
        if (
            codigo == null
            || codigo.isBlank()
            || descricao == null
            || descricao.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "codigo e descricao obrigatórios"
            );
        }

        this.codigo = codigo.trim();
        this.descricao = descricao.trim();
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }
}
```

---

### 7. Reutilizar runtime e inspector

Reutilize:

```text
JpaRuntime;

JpaRuntimeFactory;

SqlCaptureInspector.
```

Ajuste packages e persistence unit.

A factory continua passando:

```text
jakarta.persistence.dataSource;

hibernate.hbm2ddl.auto=validate;

hibernate.generate_statistics=true;

hibernate.session_factory.statement_inspector.
```

Não configure criação de schema.

---

### 8. Criar MappingReport.java

```java
package br.com.formacao.m13.aula325.lab;

public record MappingReport(
        long clienteId,
        long protocoloId,
        boolean clienteIdGenerated,
        boolean protocoloIdGenerated,
        boolean criadoEmBeforeRefreshWasNull,
        boolean criadoEmAfterRefreshWasPresent,
        boolean sequenceSqlObserved,
        boolean identityInsertObserved,
        boolean updateExcludedImmutableColumns,
        boolean decimalScalePreserved
) {
}
```

---

### 9. Criar BasicMappingLab.java

Fluxo de Cliente:

1. criar `ClienteEntity`;
2. confirmar ID nulo;
3. iniciar transação;
4. executar `persist`;
5. confirmar ID não nulo;
6. confirmar `criadoEm` nulo;
7. executar `flush`;
8. executar `refresh`;
9. confirmar `criadoEm` preenchido;
10. commit.

Use:

```text
CLI-JPA-325-MAIN.
```

Limite:

```text
12345.67.
```

Depois:

1. abrir novo contexto;
2. carregar Cliente;
3. alterar nome e limite para `15000.50`;
4. commit;
5. inspecionar SQL;
6. confirmar UPDATE sem `codigo` e sem `criado_em`.

Fluxo de Protocolo:

1. criar `ProtocoloEntity`;
2. confirmar ID nulo;
3. iniciar transação;
4. limpar inspector;
5. executar `persist`;
6. confirmar ID não nulo;
7. observar `INSERT`;
8. commit.

Use:

```text
PROTO-JPA-325-MAIN.
```

Ao final:

1. remover Cliente;
2. remover Protocolo;
3. confirmar banco limpo;
4. produzir `MappingReport`.

A observação de sequence deve procurar SQL contendo:

```text
nextval;

cliente_id_seq.
```

O formato exato pode variar.

---

### 10. Criar Main.java

O `Main` deve:

1. carregar configuração;
2. abrir runtime;
3. executar `BasicMappingLab`;
4. imprimir os campos do report;
5. não imprimir senha;
6. não imprimir SQL integral;
7. fechar runtime.

Saída esperada:

```text
Cliente ID gerado:
true.

Protocolo ID gerado:
true.

criado_em antes do refresh era nulo:
true.

criado_em depois do refresh presente:
true.

sequence observada:
true.

identity insert observado:
true.

colunas imutáveis fora do UPDATE:
true.

scale decimal preservada:
true.
```

---

### 11. Criar MappingMetadataTest.java

Use reflection para validar as annotations.

Teste:

```text
ClienteEntity possui @Entity name Cliente;

@Table aponta para jpa_325.cliente;

id possui @Id;

id usa SEQUENCE;

generator é cliente_seq;

@SequenceGenerator aponta para sequence correta;

codigo nullable false;

codigo unique true;

codigo length 60;

codigo updatable false;

limite precision 15;

limite scale 2;

criadoEm insertable false;

criadoEm updatable false.
```

Para `ProtocoloEntity`:

```text
ID usa IDENTITY.
```

Esse teste valida metadados Java, não o banco.

---

### 12. Criar BasicMappingIT.java

Casos obrigatórios:

#### Sequence gera ID

- persistir Cliente;
- confirmar ID;
- confirmar SQL de sequence;
- rollback;
- confirmar ausência.

#### Default do banco e refresh

- persistir;
- flush;
- confirmar `criadoEm` nulo antes do refresh;
- refresh;
- confirmar valor presente;
- rollback.

#### Precision e scale

- persistir `999.90`;
- commit;
- recarregar;
- confirmar `scale=2`;
- confirmar igualdade por `compareTo`.

#### Unique real

- persistir dois Clientes com mesmo código;
- esperar falha no flush ou commit;
- rollback;
- confirmar somente a fixture previamente confirmada, quando houver.

#### Identity

- persistir Protocolo;
- confirmar ID;
- confirmar INSERT observado;
- rollback;
- confirmar ausência.

#### Updatable false

- persistir Cliente;
- em outro contexto, alterar nome e limite;
- commit;
- confirmar SQL não contém `codigo=`;
- confirmar banco preservou código.

Não altere o código por reflection.

O objetivo é verificar o SQL gerado pelo mapeamento.

---

### 13. Criar TestDataCleaner.java

Limpe apenas:

```sql
DELETE FROM jpa_325.cliente
WHERE codigo LIKE 'CLI-JPA-325-%';

DELETE FROM jpa_325.protocolo
WHERE codigo LIKE 'PROTO-JPA-325-%';
```

Use no `@BeforeEach` e `@AfterEach`.

---

### 14. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_325.
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

`05_validar_estado_final.ps1` exige:

```text
zero CLI-JPA-325-%;

zero PROTO-JPA-325-%;

schema history com V1;
```

`06_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 15. Demonstrar schema incompativel

Em `04_demo_schema_incompativel.ps1`:

1. faça backup lógico do laboratório ou recrie a base depois;
2. altere temporariamente:

```sql
ALTER TABLE jpa_325.cliente
ALTER COLUMN limite_credito
TYPE numeric(8, 0);
```

3. execute o bootstrap JPA;
4. espere falha de validação;
5. remova e recrie o database;
6. execute Flyway novamente;
7. confirme bootstrap normal.

Não use `hbm2ddl.auto=update`.

A demonstração mostra que:

```text
precision e scale precisam concordar.
```

---

### 16. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\05_validar_estado_final.ps1
```

Registre evidências.

Depois execute a demonstração incompatível em momento controlado:

```powershell
.\scripts\04_demo_schema_incompativel.ps1
```

Valide novamente o fluxo normal.

Ao final:

```powershell
.\scripts\06_limpar_database.ps1
```

---

### 17. Criar documentacao

`contrato-cliente-entity.md` deve registrar:

- entidade;
- tabela;
- schema;
- ID;
- sequence;
- colunas;
- nulabilidade;
- tamanhos;
- decimal;
- colunas imutáveis;
- default do banco;
- versão.

`estrategias-generatedvalue.md` deve comparar:

```text
AUTO;

IDENTITY;

SEQUENCE;

TABLE;

UUID.
```

Inclua:

- origem do ID;
- portabilidade;
- round trips;
- batching;
- previsibilidade;
- uso no PostgreSQL.

`annotations-vs-database.md` deve separar:

```text
annotation:
metadado ORM.

migration:
estrutura física.

constraint:
proteção real.

validação Java:
feedback antecipado.
```

`troubleshooting-mapeamento.md` deve cobrir:

- sequence inexistente;
- generator name incorreto;
- tabela errada;
- schema errado;
- coluna ausente;
- precision divergente;
- default não carregado;
- unique violation;
- ID nulo;
- `refresh` fora de entidade managed.

---

## Entendendo o que foi feito

### A entidade foi mapeada explicitamente

Classe, entidade, tabela e schema deixaram de depender de convenções ocultas.

### A geracao de ID foi alinhada ao banco

Sequence e identity foram criadas pelo Flyway e consumidas pelo JPA.

### Column foi tratada como contrato

Nulabilidade, tamanho, decimal e comportamento de escrita foram documentados.

### O banco continuou como ultima defesa

Unique, checks e tipos permaneceram no DDL.

### Refresh mostrou valor gerenciado pelo banco

`insertable=false` permitiu o default e a leitura explícita sincronizou o objeto.

---

## Erros comuns importantes

### Usar long para ID gerado

Zero não representa tão claramente a ausência de identidade.

### Confundir generator name com sequence name

Um é lógico no JPA; o outro é físico no banco.

### Confiar somente em unique=true

A constraint precisa existir no PostgreSQL.

### Usar double para dinheiro

Use `BigDecimal` e alinhe precision e scale.

### Ativar schema update para corrigir annotation

Crie migration e mantenha o schema versionado.

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

### Inspecionar colunas

```sql
SELECT
    column_name,
    data_type,
    character_maximum_length,
    numeric_precision,
    numeric_scale,
    is_nullable,
    column_default,
    is_identity
FROM information_schema.columns
WHERE table_schema = 'jpa_325'
ORDER BY
    table_name,
    ordinal_position;
```

---

## Exercicio guiado

### Parte 1 — Allocation size

Crie uma base descartável e altere:

```text
allocationSize:
10.
```

Alinhe a migration conforme a estratégia do provider.

Persista vários Clientes e observe quantidade de acessos à sequence.

Não aplique a mudança sem entender o algoritmo.

### Parte 2 — AUTO

Crie uma entidade experimental com `AUTO`.

Observe a estratégia escolhida pelo Hibernate no PostgreSQL.

Documente por que o resultado não deve ser assumido para qualquer provider.

### Parte 3 — UUID

Crie tabela e entidade descartáveis com ID UUID.

Compare:

- geração;
- SQL;
- tamanho da coluna;
- legibilidade;
- índice;
- ausência de sequence.

Não substitua o ID principal desta aula.

### Parte 4 — Campo gerado pelo banco

Adicione uma coluna didática com default.

Mapeie como `insertable=false` e `updatable=false`.

Comprove a necessidade de `refresh`.

### Parte 5 — Unique

Remova temporariamente `unique=true` da annotation, mantendo a constraint no banco.

Confirme que a duplicidade continua bloqueada.

Explique qual camada é a defesa real.

### Parte 6 — Precision

Tente persistir valor que exceda `numeric(15,2)`.

Observe SQLState, rollback e mensagem do provider.

### Parte 7 — Metadata

Use reflection para produzir relatório das annotations sem depender de Hibernate nativo.

Não inclua valores de entidades.

### Parte 8 — ADR

Registre:

```text
SEQUENCE para entidades numéricas principais;

IDENTITY somente quando necessário;

Flyway como dono do DDL;

@Column sem columnDefinition por padrão.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 325 existe;
- continuidade com a aula 324 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway foi mantido como dono do DDL;
- database isolado foi criado;
- schema `jpa_325` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi criada;
- `ProtocoloEntity` foi criada;
- `@Entity` foi aplicada;
- nome da entidade foi definido;
- `@Table` foi aplicada;
- nome da tabela foi definido;
- schema foi definido;
- `@Id` foi aplicado;
- tipo `Long` foi usado;
- `@GeneratedValue` foi aplicado;
- SEQUENCE foi praticada;
- IDENTITY foi praticada;
- AUTO foi explicado;
- TABLE foi explicado;
- UUID foi explicado;
- `@SequenceGenerator` foi aplicado;
- nome lógico do generator foi diferenciado;
- sequence física foi diferenciada;
- allocation size foi definido;
- sequence foi criada pelo Flyway;
- identity foi criada pelo Flyway;
- ID era nulo antes da persistência;
- ID foi atribuído;
- SQL de sequence foi observado;
- INSERT de identity foi observado;
- `@Column(name)` foi aplicado;
- nullable foi aplicado;
- unique foi aplicado;
- length foi aplicado;
- precision foi aplicado;
- scale foi aplicado;
- insertable foi aplicado;
- updatable foi aplicado;
- `BigDecimal` foi usado;
- `double` não foi usado;
- default do banco foi preservado;
- refresh carregou o default;
- código ficou fora do UPDATE;
- criado_em ficou fora do INSERT e UPDATE;
- constraint unique existe no banco;
- check de limite existe no banco;
- Hibernate permaneceu em validate;
- create não foi usado;
- update automático não foi usado;
- schema incompatível falhou;
- metadata Java foi testada;
- schema real foi testado;
- unique violation foi testada;
- precision e scale foram testadas;
- fixtures foram limpas;
- estado final ficou vazio;
- equals e hashCode automáticos não foram gerados;
- Embeddable não foi antecipado;
- relacionamentos não foram antecipados;
- Spring não foi usado;
- ponte para a aula 326 está correta;
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
  labs/m13/aula-325-entity-id-generatedvalue-column
```

Commit recomendado:

```powershell
git commit -m "feat(m13): mapear entidade id generatedvalue e colunas"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou o mapeamento básico JPA.

Aprendeu:

```text
@Entity:
classe persistente.

@Table:
tabela e schema.

@Id:
identidade.

@GeneratedValue:
estratégia de geração.

SEQUENCE:
sequence nativa.

IDENTITY:
identidade gerada no insert.

AUTO:
escolha do provider.

TABLE:
tabela geradora.

UUID:
identidade distribuída.

@Column:
contrato de coluna.
```

O laboratório comprovou:

```text
ID Long iniciando nulo;

sequence atribuindo ID;

identity exigindo insert;

default do banco fora do INSERT;

refresh carregando criado_em;

precision e scale preservadas;

updatable=false removendo coluna do UPDATE;

constraints do Flyway protegendo o banco;

Hibernate validate detectando incompatibilidade.
```

A próxima aula será:

```text
326 - M13.16 - Embeddable e objetos de valor persistidos
```

Nela, você vai estudar:

- `@Embeddable`;
- `@Embedded`;
- objetos de valor;
- igualdade por valor;
- imutabilidade;
- construtor protegido;
- múltiplos atributos em colunas;
- `@AttributeOverride`;
- prefixos;
- nulabilidade do conjunto;
- validação;
- endereço;
- dinheiro;
- documento;
- alinhamento entre domínio, JPA e banco.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei entidade, tabela, ID e generator.
- [ ] Pratiquei SEQUENCE e IDENTITY.
- [ ] Alinhei `@Column` com o DDL do Flyway.
- [ ] Comprovei default do banco com refresh.
- [ ] Mantive Hibernate em `validate`.

---

## Troubleshooting adicional

### Sequence does not exist

Confirme schema, `sequenceName` e migration.

### Unknown Id.generator

Confirme o valor de `generator` e o `name` do `@SequenceGenerator`.

### ID continua nulo

Confirme transação, `persist`, estratégia e provider.

### Column not found

Compare `@Column(name)` com o DDL.

### Precision mismatch

Compare `precision`, `scale` e `numeric`.

### Refresh falha

A entidade precisa estar managed e possuir linha persistida.

---

## Perguntas de revisao

1. O que faz `@Entity`?
2. O nome da entidade é o nome da tabela?
3. O que faz `@Table`?
4. Toda entidade precisa de `@Id`?
5. Por que usar `Long`?
6. O que faz `@GeneratedValue`?
7. O que é SEQUENCE?
8. O que é IDENTITY?
9. O que é AUTO?
10. O que é TABLE?
11. O que é UUID?
12. O que faz `@SequenceGenerator`?
13. Generator name é sequence name?
14. O que faz `nullable`?
15. `unique=true` substitui constraint?
16. Para que servem precision e scale?
17. O que faz insertable=false?
18. O que faz updatable=false?
19. Quem cria o schema?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Marca classe persistente.
2. Não necessariamente.
3. Define tabela e schema.
4. Sim.
5. Null representa ID não atribuído.
6. Define geração do ID.
7. Gerador nativo sequencial.
8. ID obtido pelo insert.
9. Escolha do provider.
10. Tabela usada como gerador.
11. Estratégia de UUID.
12. Configura sequence.
13. Não.
14. Declara nulabilidade do mapeamento.
15. Não.
16. Definir decimal.
17. Exclui coluna do INSERT.
18. Exclui coluna do UPDATE.
19. Flyway.
20. Embeddable e objetos de valor.

---

## Desafio opcional

Crie:

```java
MappingContractInspector
```

Ele deve ler por reflection:

```text
@Entity;

@Table;

@Id;

@GeneratedValue;

@SequenceGenerator;

@Column.
```

Saída:

```text
classe;

entityName;

table;

schema;

idField;

strategy;

generator;

column metadata.
```

Regras:

- nenhuma API nativa Hibernate;
- nenhuma instância de entidade necessária;
- lista imutável;
- testes unitários;
- não imprimir senha;
- falhar claramente quando não houver ID;
- não substituir validação do provider.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 325 - M13.15 - Entity Id GeneratedValue Column

- Aprofundei o mapeamento básico JPA.
- Diferenciei nome da entidade e nome da tabela.
- Usei `@Entity`.
- Usei `@Table` com schema explícito.
- Usei `@Id`.
- Entendi identidade de banco e identidade Java.
- Usei `Long` para ID gerado.
- Evitei equals e hashCode automáticos em entidade.
- Usei `@GeneratedValue`.
- Pratiquei `GenerationType.SEQUENCE`.
- Pratiquei `GenerationType.IDENTITY`.
- Estudei `AUTO`, `TABLE` e `UUID`.
- Usei `@SequenceGenerator`.
- Diferenciei generator lógico de sequence física.
- Entendi `allocationSize`.
- Criei sequence e identity com Flyway.
- Usei `@Column(name)`.
- Usei nullable, unique e length.
- Usei precision e scale com `BigDecimal`.
- Usei insertable e updatable.
- Mantive código fora do UPDATE.
- Mantive criado_em fora do INSERT e UPDATE.
- Usei default do PostgreSQL.
- Usei `refresh` para recarregar valor do banco.
- Mantive constraints reais na migration.
- Testei metadata das annotations.
- Testei compatibilidade do schema.
- Mantive Hibernate em `validate`.
- Não antecipei Embeddable, relacionamentos ou Spring.
- Próxima aula: Embeddable e objetos de valor persistidos.
```

---

## Referencia tecnica curta

```text
@Entity:
classe persistente.

@Table:
tabela.

@Id:
identidade.

@GeneratedValue:
geração.

SEQUENCE:
sequence do banco.

IDENTITY:
ID no insert.

AUTO:
provider escolhe.

TABLE:
tabela geradora.

UUID:
identificador UUID.

@Column:
metadados da coluna.

Flyway:
DDL real.

validate:
alinhamento.
```

Regra final:

```text
um mapeamento JPA basico profissional exige identidade explicita, estrategia de geracao alinhada ao banco, colunas descritas com precisao e constraints versionadas no Flyway; annotations nao substituem o schema real.
```
