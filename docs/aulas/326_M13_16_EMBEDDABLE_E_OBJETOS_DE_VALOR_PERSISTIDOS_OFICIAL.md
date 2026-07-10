# 326 - M13.16 - Embeddable e objetos de valor persistidos

## Apresentacao da aula

Na aula 325, você aprofundou o mapeamento básico de uma entidade JPA.

O laboratório trabalhou com:

```text
@Entity;

@Table;

@Id;

@GeneratedValue;

@SequenceGenerator;

@Column;

SEQUENCE;

IDENTITY;

precision;

scale;

insertable;

updatable.
```

Agora você vai evoluir o modelo para representar conceitos do domínio que possuem vários atributos, mas não possuem identidade própria.

Exemplos:

```text
Documento fiscal;

Endereço;

Dinheiro.
```

Esses conceitos não são apenas conjuntos de `String`.

Eles possuem:

- validações;
- significado;
- regras;
- igualdade por valor;
- comportamento;
- representação persistida.

Um endereço não precisa virar uma entidade separada apenas porque possui várias colunas.

Um valor monetário não deve ser espalhado como:

```java
BigDecimal limiteValor;
String limiteMoeda;
```

por toda a aplicação.

Um documento fiscal não deve aceitar qualquer texto sem validar tipo, tamanho e caracteres.

Para esses casos, Jakarta Persistence oferece:

```java
@Embeddable
```

e:

```java
@Embedded
```

A classe embeddable descreve um componente persistível sem identidade própria.

A entidade incorpora esse componente.

As colunas continuam na tabela da entidade proprietária.

Exemplo conceitual:

```text
ClienteEntity
    possui DocumentoFiscal
    possui Endereco principal
    possui Endereco de cobrança
    possui Dinheiro como limite de crédito.
```

Tabela:

```text
jpa_326.cliente
```

Colunas:

```text
documento_tipo;

documento_numero;

end_logradouro;

end_numero;

end_cidade;

cob_logradouro;

cob_numero;

cob_cidade;

limite_valor;

limite_moeda.
```

Não existirão tabelas separadas para:

```text
documento;

endereco;

dinheiro.
```

Os objetos são persistidos como parte da mesma linha de Cliente.

Nesta aula, você praticará:

- diferença entre entidade e objeto de valor;
- `@Embeddable`;
- `@Embedded`;
- igualdade por valor;
- imutabilidade prática;
- construtor protegido para o provider;
- validação no construtor;
- dois embeddables do mesmo tipo;
- `@AttributeOverride`;
- `@AttributeOverrides`;
- colunas opcionais de um componente;
- substituição de objeto de valor;
- dirty checking de componentes;
- alinhamento com Flyway;
- constraints no PostgreSQL;
- testes por reflection;
- testes de integração;
- schema validation.

O laboratório continuará usando:

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
formacao_java_jpa_326
```

O schema será:

```text
jpa_326
```

Flyway continuará responsável pelo DDL.

Hibernate continuará em:

```text
validate.
```

A próxima aula será:

```text
327 - M13.17 - EntityManager persist find merge remove
```

Por isso, as operações do `EntityManager` serão usadas apenas para provar o mapeamento.

O aprofundamento operacional de `persist`, `find`, `merge` e `remove` ficará para a aula 327.

Não serão antecipados:

- `@EmbeddedId`;
- chaves compostas;
- relacionamentos;
- `@ElementCollection`;
- `AttributeConverter`;
- herança;
- JPQL;
- Spring;
- Spring Data;
- Lombok;
- geração automática de schema.

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
```

Na aula 325, os atributos da entidade eram simples:

```text
String;

BigDecimal;

boolean;

OffsetDateTime.
```

Agora o modelo passará a expressar conceitos compostos.

Nesta aula:

```text
@Entity:
continua sendo proprietária da identidade.

@Embeddable:
sim.

@Embedded:
sim.

@AttributeOverride:
sim.

objetos de valor:
sim.

igualdade por valor:
sim.

múltiplos endereços:
sim.

tabela separada:
não.

relacionamentos:
não.

Spring:
não.
```

A arquitetura permanecerá:

```text
Flyway
    -> cria schema e constraints.

Jakarta Persistence
    -> define mapeamento.

Hibernate
    -> implementa o mapeamento.

HikariCP
    -> fornece conexões.

PostgreSQL
    -> persiste e protege integridade.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-326-embeddable-objetos-valor-persistidos
```

Estrutura final:

```text
labs
└── m13
    └── aula-326-embeddable-objetos-valor-persistidos
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── entidade-vs-objeto-valor.md
        │   ├── contrato-embeddables.md
        │   ├── mapa-colunas-embedded.md
        │   └── troubleshooting-embeddable.md
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
            │   │                   └── aula326
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── lab
            │   │                       │   ├── EmbeddableLab.java
            │   │                       │   └── EmbeddableReport.java
            │   │                       └── valueobject
            │   │                           ├── Dinheiro.java
            │   │                           ├── DocumentoFiscal.java
            │   │                           └── Endereco.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_326.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula326
                                        ├── EmbeddableMappingIT.java
                                        ├── EmbeddableMetadataTest.java
                                        ├── ValueObjectTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
DocumentoFiscal:
persistido em duas colunas;
igualdade por valor.

Endereco principal:
colunas end_*.

Endereco de cobrança:
colunas cob_* por overrides.

Dinheiro:
valor e moeda na mesma linha.

Objeto de cobrança nulo:
todas as colunas cob_* nulas.

Substituição de endereço:
UPDATE persistido.

Schema:
criado por Flyway;
validado pelo Hibernate.

Estado final:
zero Clientes CLI-JPA-326-%.
```

---

## Conceito essencial

### Entidade e objeto de valor

Entidade possui identidade própria.

Exemplo:

```text
Cliente com ID 326001.
```

Mesmo que nome e endereço mudem, continua sendo o mesmo Cliente.

Objeto de valor é definido pelo conteúdo.

Exemplo:

```text
Dinheiro:
100.00 BRL.

Endereco:
Rua A, 10, Barueri, SP, 06400000.
```

Dois objetos de valor com o mesmo conteúdo são equivalentes.

Eles não precisam de ID artificial.

---

### Igualdade por identidade

Para uma entidade:

```text
Cliente ID 326001
```

e outro objeto representando o mesmo ID podem referir-se à mesma entidade persistente.

A igualdade de entidade exige estratégia cuidadosa e não será redesenhada nesta aula.

---

### Igualdade por valor

Para um objeto de valor:

```java
new Dinheiro(
        new BigDecimal("100.00"),
        "BRL"
)
```

deve ser igual a outro com o mesmo valor e moeda.

Records oferecem:

- igualdade por componentes;
- `hashCode`;
- `toString`;
- acesso imutável.

Entretanto, JPA precisa de construtor sem argumentos para embeddables tradicionais e o provider precisa preencher campos.

Nesta aula, serão usadas classes comuns efetivamente imutáveis:

- campos privados;
- sem setters;
- construtor protegido sem argumentos;
- construtor público validado;
- métodos que retornam novos objetos;
- `equals` e `hashCode` por todos os atributos.

---

### @Embeddable

`@Embeddable` marca uma classe que pode ser incorporada em uma entidade.

Exemplo:

```java
@Embeddable
public class DocumentoFiscal {
}
```

A classe não possui:

```text
@Id;

@GeneratedValue;

repository próprio;

tabela própria;

ciclo de vida independente.
```

Ela existe como parte da entidade proprietária.

---

### @Embedded

`@Embedded` marca o atributo da entidade que incorpora o componente.

Exemplo:

```java
@Embedded
private DocumentoFiscal documento;
```

As colunas definidas em `DocumentoFiscal` passam a fazer parte do mapeamento da tabela `cliente`.

---

### Colunas do embeddable

O embeddable pode declarar:

```java
@Column(name = "documento_tipo")
private String tipo;
```

e:

```java
@Column(name = "documento_numero")
private String numero;
```

Essas annotations são reutilizadas quando o componente é incorporado.

---

### Dois componentes do mesmo tipo

Uma entidade pode possuir:

```text
endereço principal;

endereço de cobrança.
```

Ambos usam a classe:

```java
Endereco
```

Se nenhum override for aplicado, os dois tentarão mapear as mesmas colunas.

Isso produz conflito de mapeamento.

A solução é:

```java
@AttributeOverrides
```

---

### @AttributeOverride

Um override substitui o mapeamento de um atributo do embeddable em um ponto específico.

Exemplo:

```java
@AttributeOverride(
        name = "logradouro",
        column = @Column(
                name = "cob_logradouro",
                length = 120
        )
)
```

O `name` aponta para o atributo Java dentro do embeddable.

O `column` define a coluna usada naquela incorporação.

---

### @AttributeOverrides

Para substituir várias colunas:

```java
@AttributeOverrides({
    @AttributeOverride(...),
    @AttributeOverride(...)
})
```

No laboratório:

```text
Endereco principal:
usa end_* definidos no embeddable.

Endereco cobrança:
usa cob_* definidos na entidade.
```

Todos os atributos precisam ser revisados.

Esquecer um override pode causar:

- coluna duplicada;
- coluna errada;
- nulabilidade incompatível;
- erro no bootstrap.

---

### Embeddable opcional

`enderecoCobranca` será opcional.

Quando o atributo for `null`, as colunas:

```text
cob_logradouro;

cob_numero;

cob_complemento;

cob_bairro;

cob_cidade;

cob_uf;

cob_cep.
```

ficam nulas.

Não existe uma coluna única chamada:

```text
endereco_cobranca.
```

A nulabilidade é definida por coluna.

O banco terá uma constraint que exige:

```text
ou todas as colunas obrigatórias de cobrança estão nulas;

ou todas estão preenchidas.
```

Isso evita endereço parcial.

---

### Objeto de valor efetivamente imutavel

JPA não exige que embeddables sejam totalmente imutáveis.

Entretanto, objetos de valor ficam mais seguros quando não possuem setters.

Exemplo:

```java
public Endereco comComplemento(
        String novoComplemento
) {
    return new Endereco(
            logradouro,
            numero,
            novoComplemento,
            bairro,
            cidade,
            uf,
            cep
    );
}
```

A entidade substitui o componente:

```java
this.enderecoPrincipal =
        enderecoPrincipal
                .comComplemento(
                        "Bloco B"
                );
```

O persistence context detecta a mudança.

---

### Construtor protegido

O provider precisa instanciar o embeddable.

Por isso:

```java
protected Endereco() {
}
```

O construtor não deve ser usado pela aplicação.

A criação válida usa o construtor público com invariantes.

---

### Validacao no objeto de valor

`DocumentoFiscal` validará:

```text
tipo:
CPF ou CNPJ.

numero:
somente dígitos.

CPF:
11 dígitos.

CNPJ:
14 dígitos.
```

Não será implementado algoritmo completo de dígitos verificadores.

O foco é estrutura e mapeamento.

`Endereco` validará:

```text
logradouro;

número;

bairro;

cidade;

UF com duas letras;

CEP com oito dígitos.
```

`Dinheiro` validará:

```text
valor não negativo;

duas casas decimais;

moeda com três letras.
```

---

### Dinheiro como embeddable

Mapeamento:

```text
limite_valor numeric(15,2);

limite_moeda char(3).
```

A classe oferece:

```java
public Dinheiro somar(
        Dinheiro outro
)
```

Somente moedas iguais podem ser somadas.

O comportamento pertence ao objeto de valor, não à entidade.

---

### Dirty checking de embeddable

Quando uma entidade managed substitui um embeddable:

```java
cliente.alterarLimite(
        new Dinheiro(
                new BigDecimal("2000.00"),
                "BRL"
        )
);
```

o Hibernate detecta diferenças nos atributos persistidos e gera `UPDATE`.

Você não precisa criar um repository específico para `Dinheiro`.

O componente faz parte do estado da entidade.

---

### Ownership

A entidade é dona do componente.

O embeddable:

- não existe sozinho no persistence context;
- não é buscado por ID;
- não é removido separadamente;
- não possui lifecycle independente.

Ao remover Cliente, seus valores embutidos desaparecem com a linha.

---

### Constraints continuam no banco

As validações Java oferecem feedback antecipado.

As constraints PostgreSQL protegem qualquer cliente de banco.

O Flyway criará:

- checks de documento;
- checks de CEP;
- checks de UF;
- check de moeda;
- check de valor;
- check de endereço de cobrança completo.

Annotations não substituem essas constraints.

---

### Embeddable nao e DTO

Um DTO transporta dados entre fronteiras.

Um embeddable representa um conceito persistível do modelo.

Ele pode ter comportamento e invariantes.

Não crie um único tipo para:

- request HTTP;
- resposta;
- persistência;
- evento;
- domínio.

A aula não possui camada HTTP, mas a distinção já deve ficar clara.

---

### Embeddable nao e entidade fraca

A ausência de ID não significa falta de importância.

Objetos de valor podem concentrar regras fundamentais:

- dinheiro;
- documento;
- intervalo;
- coordenada;
- endereço;
- período.

O critério é identidade e ciclo de vida, não quantidade de campos.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\main\java\br\com\formacao\m13\aula326\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\main\java\br\com\formacao\m13\aula326\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\main\java\br\com\formacao\m13\aula326\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\main\java\br\com\formacao\m13\aula326\valueobject"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-326-embeddable-objetos-valor-persistidos\src\test\java\br\com\formacao\m13\aula326"

Set-Location `
  "labs\m13\aula-326-embeddable-objetos-valor-persistidos"
```

---

### 2. Criar pom e configuracao

Reutilize da aula 325:

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
aula-326-embeddable-objetos-valor.

persistence unit:
aula326PU.

Main:
br.com.formacao.m13.aula326.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_326
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-326-jpa
JPA_POOL_NAME=aula-326-pool
JPA_POOL_SIZE=3
```

---

### 3. Criar migration V1

```sql
CREATE SCHEMA IF NOT EXISTS jpa_326;

CREATE SEQUENCE jpa_326.cliente_id_seq
    START WITH 326001
    INCREMENT BY 1;

CREATE TABLE jpa_326.cliente (
    id bigint NOT NULL,
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,

    documento_tipo varchar(4) NOT NULL,
    documento_numero varchar(14) NOT NULL,

    end_logradouro varchar(120) NOT NULL,
    end_numero varchar(20) NOT NULL,
    end_complemento varchar(80),
    end_bairro varchar(80) NOT NULL,
    end_cidade varchar(80) NOT NULL,
    end_uf char(2) NOT NULL,
    end_cep varchar(8) NOT NULL,

    cob_logradouro varchar(120),
    cob_numero varchar(20),
    cob_complemento varchar(80),
    cob_bairro varchar(80),
    cob_cidade varchar(80),
    cob_uf char(2),
    cob_cep varchar(8),

    limite_valor numeric(15, 2) NOT NULL,
    limite_moeda char(3) NOT NULL,

    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL,

    CONSTRAINT pk_jpa_326_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_326_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT uk_jpa_326_cliente_documento
        UNIQUE (
            documento_tipo,
            documento_numero
        ),

    CONSTRAINT ck_jpa_326_documento_tipo
        CHECK (
            documento_tipo IN (
                'CPF',
                'CNPJ'
            )
        ),

    CONSTRAINT ck_jpa_326_documento_numero
        CHECK (
            documento_numero ~ '^[0-9]+$'
            AND (
                (
                    documento_tipo = 'CPF'
                    AND length(documento_numero) = 11
                )
                OR
                (
                    documento_tipo = 'CNPJ'
                    AND length(documento_numero) = 14
                )
            )
        ),

    CONSTRAINT ck_jpa_326_end_uf
        CHECK (end_uf ~ '^[A-Z]{2}$'),

    CONSTRAINT ck_jpa_326_end_cep
        CHECK (end_cep ~ '^[0-9]{8}$'),

    CONSTRAINT ck_jpa_326_cob_completo
        CHECK (
            (
                cob_logradouro IS NULL
                AND cob_numero IS NULL
                AND cob_bairro IS NULL
                AND cob_cidade IS NULL
                AND cob_uf IS NULL
                AND cob_cep IS NULL
            )
            OR
            (
                cob_logradouro IS NOT NULL
                AND cob_numero IS NOT NULL
                AND cob_bairro IS NOT NULL
                AND cob_cidade IS NOT NULL
                AND cob_uf ~ '^[A-Z]{2}$'
                AND cob_cep ~ '^[0-9]{8}$'
            )
        ),

    CONSTRAINT ck_jpa_326_limite_valor
        CHECK (limite_valor >= 0),

    CONSTRAINT ck_jpa_326_limite_moeda
        CHECK (limite_moeda ~ '^[A-Z]{3}$')
);
```

---

### 4. Criar DocumentoFiscal.java

```java
package br.com.formacao.m13.aula326.valueobject;

import java.util.Locale;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class DocumentoFiscal {

    @Column(
            name = "documento_tipo",
            nullable = false,
            length = 4
    )
    private String tipo;

    @Column(
            name = "documento_numero",
            nullable = false,
            length = 14
    )
    private String numero;

    protected DocumentoFiscal() {
    }

    public DocumentoFiscal(
            String tipo,
            String numero
    ) {
        String normalizedType =
                requireText(tipo, "tipo")
                        .toUpperCase(
                                Locale.ROOT
                        );

        String normalizedNumber =
                requireText(numero, "numero")
                        .replaceAll(
                                "[^0-9]",
                                ""
                        );

        if (
            !normalizedType.equals("CPF")
            && !normalizedType.equals("CNPJ")
        ) {
            throw new IllegalArgumentException(
                    "tipo deve ser CPF ou CNPJ"
            );
        }

        int expectedLength =
                normalizedType.equals("CPF")
                        ? 11
                        : 14;

        if (
            normalizedNumber.length()
                    != expectedLength
        ) {
            throw new IllegalArgumentException(
                    "quantidade de dígitos inválida"
            );
        }

        this.tipo = normalizedType;
        this.numero = normalizedNumber;
    }

    public String getTipo() {
        return tipo;
    }

    public String getNumero() {
        return numero;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }

        if (
            !(other instanceof DocumentoFiscal that)
        ) {
            return false;
        }

        return Objects.equals(
                tipo,
                that.tipo
        )
                && Objects.equals(
                        numero,
                        that.numero
                );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
                tipo,
                numero
        );
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

---

### 5. Criar Endereco.java

```java
package br.com.formacao.m13.aula326.valueobject;

import java.util.Locale;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Endereco {

    @Column(
            name = "end_logradouro",
            nullable = false,
            length = 120
    )
    private String logradouro;

    @Column(
            name = "end_numero",
            nullable = false,
            length = 20
    )
    private String numero;

    @Column(
            name = "end_complemento",
            length = 80
    )
    private String complemento;

    @Column(
            name = "end_bairro",
            nullable = false,
            length = 80
    )
    private String bairro;

    @Column(
            name = "end_cidade",
            nullable = false,
            length = 80
    )
    private String cidade;

    @Column(
            name = "end_uf",
            nullable = false,
            length = 2
    )
    private String uf;

    @Column(
            name = "end_cep",
            nullable = false,
            length = 8
    )
    private String cep;

    protected Endereco() {
    }

    public Endereco(
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String uf,
            String cep
    ) {
        this.logradouro =
                requireText(
                        logradouro,
                        "logradouro"
                );
        this.numero =
                requireText(numero, "numero");
        this.complemento =
                normalizeNullable(
                        complemento
                );
        this.bairro =
                requireText(bairro, "bairro");
        this.cidade =
                requireText(cidade, "cidade");
        this.uf =
                requireText(uf, "uf")
                        .toUpperCase(
                                Locale.ROOT
                        );
        this.cep =
                requireText(cep, "cep")
                        .replaceAll(
                                "[^0-9]",
                                ""
                        );

        if (this.uf.length() != 2) {
            throw new IllegalArgumentException(
                    "UF deve possuir duas letras"
            );
        }

        if (this.cep.length() != 8) {
            throw new IllegalArgumentException(
                    "CEP deve possuir oito dígitos"
            );
        }
    }

    public Endereco comComplemento(
            String novoComplemento
    ) {
        return new Endereco(
                logradouro,
                numero,
                novoComplemento,
                bairro,
                cidade,
                uf,
                cep
        );
    }

    public String getLogradouro() {
        return logradouro;
    }

    public String getNumero() {
        return numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getUf() {
        return uf;
    }

    public String getCep() {
        return cep;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }

        if (!(other instanceof Endereco that)) {
            return false;
        }

        return Objects.equals(
                logradouro,
                that.logradouro
        )
                && Objects.equals(
                        numero,
                        that.numero
                )
                && Objects.equals(
                        complemento,
                        that.complemento
                )
                && Objects.equals(
                        bairro,
                        that.bairro
                )
                && Objects.equals(
                        cidade,
                        that.cidade
                )
                && Objects.equals(
                        uf,
                        that.uf
                )
                && Objects.equals(
                        cep,
                        that.cep
                );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                cep
        );
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

---

### 6. Criar Dinheiro.java

```java
package br.com.formacao.m13.aula326.valueobject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Dinheiro {

    @Column(
            name = "limite_valor",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal valor;

    @Column(
            name = "limite_moeda",
            nullable = false,
            length = 3
    )
    private String moeda;

    protected Dinheiro() {
    }

    public Dinheiro(
            BigDecimal valor,
            String moeda
    ) {
        if (
            valor == null
            || valor.signum() < 0
        ) {
            throw new IllegalArgumentException(
                    "valor inválido"
            );
        }

        String normalizedCurrency =
                requireText(
                        moeda,
                        "moeda"
                )
                        .toUpperCase(
                                Locale.ROOT
                        );

        if (
            normalizedCurrency.length() != 3
        ) {
            throw new IllegalArgumentException(
                    "moeda deve possuir três letras"
            );
        }

        this.valor =
                valor.setScale(
                        2,
                        RoundingMode.UNNECESSARY
                );
        this.moeda =
                normalizedCurrency;
    }

    public Dinheiro somar(
            Dinheiro outro
    ) {
        Objects.requireNonNull(
                outro,
                "outro é obrigatório"
        );

        if (!moeda.equals(outro.moeda)) {
            throw new IllegalArgumentException(
                    "moedas diferentes"
            );
        }

        return new Dinheiro(
                valor.add(outro.valor),
                moeda
        );
    }

    public BigDecimal getValor() {
        return valor;
    }

    public String getMoeda() {
        return moeda;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }

        if (!(other instanceof Dinheiro that)) {
            return false;
        }

        return valor.compareTo(
                that.valor
        ) == 0
                && Objects.equals(
                        moeda,
                        that.moeda
                );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
                valor.stripTrailingZeros(),
                moeda
        );
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

---

### 7. Criar ClienteEntity.java

A entidade usa três tipos de valor.

Trecho principal:

```java
@Entity(name = "Cliente")
@Table(
        name = "cliente",
        schema = "jpa_326"
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
                    "jpa_326.cliente_id_seq",
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

    @Embedded
    private DocumentoFiscal documento;

    @Embedded
    private Endereco enderecoPrincipal;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(
                name = "logradouro",
                column = @Column(
                        name = "cob_logradouro",
                        length = 120
                )
        ),
        @AttributeOverride(
                name = "numero",
                column = @Column(
                        name = "cob_numero",
                        length = 20
                )
        ),
        @AttributeOverride(
                name = "complemento",
                column = @Column(
                        name = "cob_complemento",
                        length = 80
                )
        ),
        @AttributeOverride(
                name = "bairro",
                column = @Column(
                        name = "cob_bairro",
                        length = 80
                )
        ),
        @AttributeOverride(
                name = "cidade",
                column = @Column(
                        name = "cob_cidade",
                        length = 80
                )
        ),
        @AttributeOverride(
                name = "uf",
                column = @Column(
                        name = "cob_uf",
                        length = 2
                )
        ),
        @AttributeOverride(
                name = "cep",
                column = @Column(
                        name = "cob_cep",
                        length = 8
                )
        )
    })
    private Endereco enderecoCobranca;

    @Embedded
    private Dinheiro limiteCredito;

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
}
```

O construtor público recebe todos os componentes obrigatórios.

`enderecoCobranca` pode ser nulo.

Métodos:

```java
public void alterarEnderecoCobranca(
        Endereco novoEndereco
)

public void alterarLimiteCredito(
        Dinheiro novoLimite
)

public void complementarEnderecoPrincipal(
        String complemento
)
```

Cada método substitui o objeto.

Não exponha setters dos campos internos.

---

### 8. Criar persistence.xml e runtime

Liste somente:

```text
ClienteEntity.
```

Use:

```text
aula326PU;

RESOURCE_LOCAL;

HibernatePersistenceProvider;

exclude-unlisted-classes true;

shared cache NONE;

validation NONE.
```

Reutilize `JpaRuntime` e `JpaRuntimeFactory`.

Mantenha:

```text
hibernate.hbm2ddl.auto=validate.
```

---

### 9. Criar EmbeddableReport.java

```java
package br.com.formacao.m13.aula326.lab;

public record EmbeddableReport(
        long clienteId,
        boolean documentoPreservado,
        boolean enderecoPrincipalPreservado,
        boolean cobrancaInicialmenteNula,
        boolean cobrancaPersistidaDepois,
        boolean dinheiroPreservado,
        boolean equalityByValueWorked,
        boolean updateWorked
) {
}
```

---

### 10. Criar EmbeddableLab.java

Fluxo:

1. criar dois `DocumentoFiscal` iguais;
2. confirmar `equals`;
3. criar dois `Endereco` iguais;
4. confirmar `equals`;
5. criar dois `Dinheiro` iguais;
6. confirmar `equals`;
7. criar Cliente com cobrança nula;
8. persistir e commit;
9. carregar em novo contexto;
10. confirmar documento, endereço principal e limite;
11. confirmar cobrança nula;
12. substituir cobrança;
13. substituir limite;
14. complementar endereço principal;
15. commit;
16. carregar novamente;
17. confirmar valores atualizados;
18. remover fixture;
19. produzir report.

Dados:

```text
codigo:
CLI-JPA-326-MAIN.

documento:
CPF 12345678901.

endereço:
Avenida Principal, 100, Centro,
Barueri, SP, 06400000.

cobrança:
Rua de Cobrança, 200, Alphaville,
Barueri, SP, 06454000.

limite inicial:
1000.00 BRL.

limite atualizado:
1500.00 BRL.
```

---

### 11. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `EmbeddableLab`;
4. imprime resultados booleanos;
5. fecha runtime;
6. não imprime documentos completos.

Mascaramento:

```text
documento:
***678901.
```

O report não precisa conter o número.

---

### 12. Criar ValueObjectTest.java

Teste sem banco:

#### Documento

- formatação é removida;
- CPF aceita 11 dígitos;
- CNPJ aceita 14;
- tipo inválido falha;
- tamanho inválido falha;
- igualdade por valor;
- hashCode coerente.

#### Endereco

- UF normalizada;
- CEP normalizado;
- complemento vazio vira null;
- CEP inválido falha;
- UF inválida falha;
- `comComplemento` retorna novo objeto;
- original não muda;
- igualdade por valor.

#### Dinheiro

- valor negativo falha;
- mais de duas casas sem arredondamento falha;
- moeda normalizada;
- soma com mesma moeda;
- soma com moeda diferente falha;
- igualdade ignora diferença de escala;
- hashCode coerente.

---

### 13. Criar EmbeddableMetadataTest.java

Use reflection.

Valide:

```text
DocumentoFiscal possui @Embeddable;

Endereco possui @Embeddable;

Dinheiro possui @Embeddable;

Cliente.documento possui @Embedded;

Cliente.enderecoPrincipal possui @Embedded;

Cliente.enderecoCobranca possui @Embedded;

enderecoCobranca possui sete overrides;

logradouro aponta para cob_logradouro;

cep aponta para cob_cep;

limiteCredito possui @Embedded.
```

Confirme que nenhum embeddable possui:

```text
@Id;

@Entity.
```

---

### 14. Criar EmbeddableMappingIT.java

Casos:

#### Persistir todos os valores

Persista Cliente com dois endereços.

Confirme por JDBC:

```text
documento_tipo;

documento_numero;

end_logradouro;

cob_logradouro;

limite_valor;

limite_moeda.
```

#### Cobrança nula

Persista sem endereço de cobrança.

Confirme todas as colunas `cob_*` nulas.

#### Endereço parcial bloqueado

Execute um `INSERT` JDBC de teste com apenas `cob_logradouro`.

Espere SQLState:

```text
23514.
```

A constraint protege o banco.

#### Substituição

Carregue Cliente managed.

Substitua limite e cobrança.

Commit.

Abra novo contexto e confirme os novos objetos.

#### Igualdade

Recarregue e compare com novos objetos construídos com os mesmos valores.

#### Unique de documento

Tente dois Clientes com o mesmo tipo e número.

Espere violação de unicidade.

Rollback e limpeza.

---

### 15. Criar TestDataCleaner.java

Limpe somente:

```sql
DELETE FROM jpa_326.cliente
WHERE codigo LIKE 'CLI-JPA-326-%'
```

Use no `@BeforeEach` e `@AfterEach`.

---

### 16. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_326.
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
zero CLI-JPA-326-%;

schema history com V1.
```

`06_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 17. Demonstrar schema incompativel

`04_demo_schema_incompativel.ps1`:

1. altera temporariamente:

```sql
ALTER TABLE jpa_326.cliente
DROP COLUMN cob_cep;
```

2. executa bootstrap;
3. espera falha de schema validation;
4. recria a base;
5. reaplica Flyway;
6. confirma funcionamento.

Não habilite `update`.

O problema deve ser corrigido pelo schema versionado.

---

### 18. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\05_validar_estado_final.ps1
```

Depois da evidência principal:

```powershell
.\scripts\04_demo_schema_incompativel.ps1
```

Valide novamente.

Ao final:

```powershell
.\scripts\06_limpar_database.ps1
```

---

### 19. Criar documentacao

`entidade-vs-objeto-valor.md` deve comparar:

```text
identidade;

igualdade;

ciclo de vida;

tabela;

repository;

mutabilidade;

exemplos.
```

`contrato-embeddables.md` deve documentar:

- DocumentoFiscal;
- Endereco;
- Dinheiro;
- invariantes;
- colunas;
- nulabilidade;
- igualdade;
- comportamento.

`mapa-colunas-embedded.md` deve mapear:

```text
atributo Java -> coluna SQL.
```

Inclua principal e cobrança.

`troubleshooting-embeddable.md` deve cobrir:

- repeated column;
- override com nome errado;
- coluna ausente;
- embeddable nulo;
- componente parcial;
- construtor ausente;
- igualdade incorreta;
- objeto detached;
- schema validation.

---

## Entendendo o que foi feito

### O modelo ganhou conceitos

Documento, endereço e dinheiro deixaram de ser grupos soltos de campos.

### O banco permaneceu normalizado para o caso

Os valores foram armazenados na mesma linha porque pertencem ao Cliente e não possuem lifecycle independente.

### Overrides permitiram reuso

A mesma classe `Endereco` foi persistida duas vezes com colunas diferentes.

### Igualdade ficou estavel

Os objetos de valor usam todos os componentes, sem depender de ID gerado.

### Flyway continuou protegendo a estrutura

Checks e unique constraints defendem qualquer acesso ao PostgreSQL.

---

## Erros comuns importantes

### Transformar todo conceito em entidade

Nem todo objeto precisa de ID e tabela.

### Usar embeddable sem equals e hashCode

Objetos de valor precisam de igualdade por conteúdo.

### Adicionar setters em todos os campos

Prefira substituição controlada e invariantes.

### Repetir Endereco sem override

As colunas entram em conflito.

### Confiar apenas na validacao Java

Mantenha constraints no banco.

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
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'jpa_326'
  AND table_name = 'cliente'
ORDER BY ordinal_position;
```

---

## Exercicio guiado

### Parte 1 — Endereco alternativo

Adicione um terceiro endereço chamado:

```text
enderecoEntrega.
```

Use overrides `ent_*`.

Atualize migration e mapeamento em uma nova base descartável.

Não altere V1 já aplicada em um ambiente existente.

### Parte 2 — Documento com enum

Substitua a `String tipo` por enum:

```java
TipoDocumento
```

Use `@Enumerated(EnumType.STRING)` dentro do embeddable.

Confirme colunas e validação.

### Parte 3 — Intervalo de datas

Crie:

```java
Periodo
```

com início e fim.

Regra:

```text
fim não anterior ao início.
```

Persista como embeddable em entidade experimental.

### Parte 4 — Dinheiro

Implemente:

```text
subtrair;

maiorQue;

zero.
```

Mantenha o objeto imutável.

### Parte 5 — Nullability

Torne cobrança obrigatória em uma migration nova.

Planeje:

1. preencher linhas antigas;
2. adicionar NOT NULL;
3. alinhar annotations;
4. validar.

### Parte 6 — Constraint

Tente inserir documento inválido por JDBC.

Confirme que PostgreSQL bloqueia mesmo sem passar pelo construtor Java.

### Parte 7 — Reflection

Crie relatório automático de todos os overrides e colunas dos embeddables.

Não dependa de API nativa Hibernate.

### Parte 8 — ADR

Registre critérios:

```text
quando usar entidade;

quando usar embeddable;

quando usar tipo simples;

quando criar tabela própria.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 326 existe;
- continuidade com a aula 325 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_326` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `DocumentoFiscal` foi criado;
- `Endereco` foi criado;
- `Dinheiro` foi criado;
- os três possuem `@Embeddable`;
- nenhum embeddable possui `@Entity`;
- nenhum embeddable possui `@Id`;
- construtores protegidos existem;
- construtores públicos validam invariantes;
- setters públicos não foram criados;
- igualdade por valor foi implementada;
- hashCode é coerente;
- Documento normaliza dígitos;
- Endereco normaliza UF e CEP;
- Dinheiro usa BigDecimal;
- Dinheiro valida moeda;
- Dinheiro possui comportamento;
- Cliente usa `@Embedded`;
- Documento foi incorporado;
- Endereço principal foi incorporado;
- Endereço de cobrança foi incorporado;
- Dinheiro foi incorporado;
- dois Enderecos não conflitam;
- `@AttributeOverride` foi usado;
- `@AttributeOverrides` foi usado;
- sete colunas de cobrança foram sobrescritas;
- cobrança nula foi persistida;
- cobrança completa foi persistida;
- endereço parcial foi bloqueado;
- objeto principal foi preservado;
- objeto de cobrança foi preservado;
- limite foi preservado;
- substituição gerou atualização;
- lifecycle continua pertencendo ao Cliente;
- nenhuma tabela de valor foi criada;
- constraints de documento foram criadas;
- constraint de CEP foi criada;
- constraint de UF foi criada;
- constraint de cobrança foi criada;
- constraint de moeda foi criada;
- constraint de valor foi criada;
- unique de documento foi criada;
- Hibernate permaneceu em validate;
- schema incompatível falhou;
- metadata Java foi testada;
- integração com banco foi testada;
- fixtures foram removidas;
- estado final ficou vazio;
- `@EmbeddedId` não foi antecipado;
- relacionamentos não foram antecipados;
- AttributeConverter não foi antecipado;
- Spring não foi usado;
- operações do EntityManager não foram aprofundadas antes da aula 327;
- ponte para a aula 327 está correta;
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
  labs/m13/aula-326-embeddable-objetos-valor-persistidos
```

Commit recomendado:

```powershell
git commit -m "feat(m13): persistir embeddables e objetos de valor"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você deixou de tratar conceitos compostos como grupos soltos de colunas.

Aprendeu:

```text
entidade:
identidade própria.

objeto de valor:
igualdade pelo conteúdo.

@Embeddable:
classe incorporável.

@Embedded:
atributo incorporado.

@AttributeOverride:
substitui uma coluna.

@AttributeOverrides:
substitui várias colunas.

imutabilidade prática:
sem setters e com substituição.

Flyway:
constraints e schema.

Hibernate validate:
compatibilidade.
```

O laboratório comprovou:

```text
DocumentoFiscal em duas colunas;

Endereco principal em end_*;

Endereco cobrança em cob_*;

Dinheiro em valor e moeda;

cobrança opcional;

cobrança completa;

igualdade por valor;

dirty checking após substituição;

constraints protegendo o banco.
```

A próxima aula será:

```text
327 - M13.17 - EntityManager persist find merge remove
```

Nela, você aprofundará:

- contrato de cada operação;
- pré-condições;
- retorno;
- estado resultante;
- persistência de entidade nova;
- busca por identidade;
- comportamento do primeiro nível de cache;
- merge de entidade detached;
- diferença entre argumento e retorno de merge;
- remove de entidade managed;
- flush;
- exceções;
- transações;
- cenários incorretos;
- testes de ciclo de vida.

Os embeddables desta aula serão usados dentro das entidades manipuladas pelo `EntityManager`.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei entidade de objeto de valor.
- [ ] Criei embeddables sem identidade própria.
- [ ] Persisti dois endereços com overrides.
- [ ] Implementei igualdade por valor.
- [ ] Mantive constraints reais no Flyway.

---

## Troubleshooting adicional

### Repeated column in mapping

Dois embeddables estão usando a mesma coluna.

Revise overrides.

### AttributeOverride aponta para atributo inexistente

O `name` deve usar o nome do campo Java do embeddable.

### Endereco de cobranca volta nulo

Confirme se todas as colunas estão nulas e se o provider interpreta o componente opcional.

### Constraint de cobranca falha

O componente foi persistido parcialmente.

Crie um objeto completo ou use null.

### Embeddable sem construtor

Adicione construtor público ou protegido sem argumentos.

---

## Perguntas de revisao

1. O que diferencia entidade de objeto de valor?
2. Objeto de valor precisa de ID?
3. O que faz `@Embeddable`?
4. O que faz `@Embedded`?
5. As colunas ficam em tabela própria?
6. O que faz `@AttributeOverride`?
7. Quando usar `@AttributeOverrides`?
8. Por que dois Enderecos conflitam sem override?
9. Como funciona igualdade por valor?
10. Objeto de valor deve ter setters?
11. Por que existe construtor protegido?
12. Embeddable possui repository?
13. Quem é dono do lifecycle?
14. Como representar componente opcional?
15. O que ocorre ao substituir embeddable managed?
16. Annotation substitui constraint?
17. Dinheiro deve usar double?
18. Embeddable é DTO?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Identidade versus conteúdo.
2. Não.
3. Marca componente persistível.
4. Incorpora componente na entidade.
5. Não neste mapeamento.
6. Substitui coluna de atributo.
7. Para várias substituições.
8. Tentam usar as mesmas colunas.
9. Com todos os componentes.
10. Preferencialmente não.
11. Para o provider.
12. Não.
13. A entidade.
14. Colunas nulas coerentes.
15. Dirty checking detecta.
16. Não.
17. Não; use BigDecimal.
18. Não.
19. Não.
20. EntityManager persist find merge remove.

---

## Desafio opcional

Crie:

```java
EmbeddableContractInspector
```

Ele deve receber uma classe e produzir:

```text
é embeddable;

atributos;

colunas;

nullable;

length;

precision;

scale;

possui ID;

possui construtor sem argumentos;

equals sobrescrito;

hashCode sobrescrito.
```

Regras:

- usar reflection;
- nenhuma API nativa Hibernate;
- lista imutável;
- testes unitários;
- falhar claramente para classe nula;
- não instanciar objetos com dados inválidos;
- não substituir schema validation.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 326 - M13.16 - Embeddable e objetos de valor persistidos

- Diferenciei entidade de objeto de valor.
- Entendi identidade versus igualdade por conteúdo.
- Criei `DocumentoFiscal`.
- Criei `Endereco`.
- Criei `Dinheiro`.
- Usei `@Embeddable`.
- Usei `@Embedded`.
- Mantive embeddables sem `@Id`.
- Mantive lifecycle pertencendo ao Cliente.
- Criei construtores protegidos para o provider.
- Validei invariantes nos construtores públicos.
- Evitei setters públicos.
- Implementei igualdade e hashCode por valor.
- Normalizei documento, UF, CEP e moeda.
- Usei BigDecimal no objeto Dinheiro.
- Adicionei comportamento de soma.
- Persisti Endereco principal.
- Persisti Endereco de cobrança.
- Usei `@AttributeOverride`.
- Usei `@AttributeOverrides`.
- Evitei conflito de colunas.
- Persisti componente de cobrança opcional.
- Substituí objetos de valor em entidade managed.
- Observei dirty checking dos componentes.
- Criei constraints equivalentes no Flyway.
- Testei endereço parcial inválido.
- Testei documento duplicado.
- Mantive Hibernate em `validate`.
- Não antecipei EmbeddedId, relacionamentos ou converter.
- Próxima aula: EntityManager persist find merge remove.
```

---

## Referencia tecnica curta

```text
Entity:
identidade.

Value Object:
conteúdo.

@Embeddable:
componente.

@Embedded:
incorporação.

@AttributeOverride:
coluna substituída.

Equality:
todos os atributos.

Immutability:
sem mutação pública arbitrária.

Ownership:
entidade proprietária.

Flyway:
constraints.

Validate:
schema compatível.
```

Regra final:

```text
objetos de valor persistidos tornam o modelo mais expressivo quando encapsulam invariantes, igualdade e comportamento; embeddables devem permanecer sem identidade propria, com colunas coerentes, overrides explicitos e constraints reais no banco.
```
