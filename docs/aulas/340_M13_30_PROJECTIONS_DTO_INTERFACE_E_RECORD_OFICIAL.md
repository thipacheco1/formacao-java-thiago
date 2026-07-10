# 340 - M13.30 - Projections DTO interface e record

## Apresentacao da aula

Na aula 339, você construiu consultas dinâmicas com:

```text
CriteriaBuilder;

CriteriaQuery;

Root;

Path;

Predicate;

Join;

Specification.
```

As consultas retornaram entidades managed:

```java
List<OrdemServicoEntity>
```

Esse retorno foi adequado para estudar filtros dinâmicos.

Entretanto, muitos casos de leitura não precisam de uma entidade completa.

Considere uma tela de listagem que exibe apenas:

```text
código da Ordem;

status;

nome do Cliente;

quantidade de Atividades;

data de criação.
```

Carregar `OrdemServicoEntity`, `ClienteEntity` e a coleção de Atividades apenas para montar essas cinco informações pode trazer custos e riscos desnecessários:

- mais colunas;
- mais entidades;
- persistence context maior;
- proxies;
- coleções lazy;
- possibilidade de N+1;
- dirty checking;
- acoplamento da interface ao modelo persistente;
- serialização indevida;
- exposição de campos internos.

Para esse tipo de operação, você pode usar uma projection.

Projection significa:

```text
selecionar somente a forma de dados
necessária ao caso de uso de leitura.
```

Em vez de retornar uma entidade:

```java
OrdemServicoEntity
```

a consulta poderá retornar:

```java
OrdemResumoDto
```

ou:

```java
OrdemResumoRecord
```

ou um contrato:

```java
OrdemResumoView
```

Nesta aula, você estudará três formatos:

```text
DTO clássico;

interface de leitura;

record.
```

Também utilizará:

```text
Tuple
```

para mapear resultados com aliases.

Uma precisão importante:

```text
a JPA padrão não materializa automaticamente
uma interface projection apenas pelo método getter.
```

Esse comportamento é comum em frameworks como Spring Data, mas não pertence ao contrato básico da Jakarta Persistence.

Sem Spring Data, uma interface pode ser usada de forma profissional como:

- contrato de leitura;
- tipo retornado pelo serviço;
- contrato implementado por DTO ou record;
- destino de mapeamento manual;
- fronteira para esconder a implementação.

O laboratório mostrará:

```text
DTO clássico:
instanciado por constructor expression JPQL.

record:
instanciado por constructor expression JPQL.

interface:
implementada pelo record
e preenchida por mapeamento explícito de Tuple.
```

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
formacao_java_jpa_340
```

O schema será:

```text
jpa_340
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

As entidades serão:

```text
ClienteEntity;

OrdemServicoEntity;

AtividadeEntity.
```

As projections serão:

```text
OrdemResumoDto;

OrdemResumoView;

OrdemResumoRecord;

ClienteIndicadorRecord.
```

O repositório demonstrará:

```text
entidade completa;

DTO por constructor expression;

record por constructor expression;

Tuple com aliases;

interface implementada por record;

agregação com count;

group by;

coalesce;

resultado imutável;

zero dirty checking em projections.
```

O laboratório comprovará:

```text
entidade:
permanece managed.

DTO:
não é entidade.

record:
não é entidade.

interface:
é contrato, não materialização automática da JPA.

Tuple:
exige aliases e conversão explícita.

projection:
seleciona somente colunas necessárias.

alterar projection:
não gera UPDATE.

estado final:
zero fixtures CLI-JPA-340-%,
OS-JPA-340-% e ATV-JPA-340-%.
```

A próxima aula será:

```text
341 - M13.31 - Paginacao e ordenacao com JPA
```

Por isso, esta aula não aprofundará:

- `setFirstResult`;
- `setMaxResults`;
- total de páginas;
- count query para paginação;
- ordenação vinda de request;
- cursor pagination;
- keyset pagination;
- Spring Data Page;
- Slice;
- Pageable.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
338:
JPQL select join fetch.

339:
Criteria API e Specifications.

340:
Projections DTO interface e record.

341:
Paginacao e ordenacao com JPA.

342:
Lock otimista.
```

A aula 338 mostrou como carregar entidades e associações de forma planejada.

A aula 339 mostrou como montar filtros dinamicamente.

A aula 340 responderá:

```text
preciso mesmo retornar uma entidade?
```

A progressão será:

```text
entidade:
modelo persistente e managed.

projection:
modelo específico de leitura.

paginação:
limita e organiza o resultado da leitura.
```

Nesta aula:

```text
DTO clássico:
sim.

constructor expression:
sim.

record:
sim.

interface de leitura:
sim.

Tuple:
sim.

aliases:
sim.

agregação:
sim.

group by:
sim.

entidade versus projection:
sim.

dirty checking:
comparado.

paginação:
não aprofundada.

Spring Data projection:
não.
```

A arquitetura será:

```text
query
    -> seleção de colunas
        -> DTO, record ou Tuple
            -> contrato de leitura
                -> consumidor.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-340-projections-dto-interface-record
```

Estrutura final:

```text
labs
└── m13
    └── aula-340-projections-dto-interface-record
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── entidade-vs-projection.md
        │   ├── constructor-expression.md
        │   ├── interface-projection-sem-spring.md
        │   ├── tuple-aliases-e-mapeamento.md
        │   ├── record-como-modelo-de-leitura.md
        │   └── troubleshooting-projections.md
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
            │   │                   └── aula340
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── ProjectionLab.java
            │   │                       │   ├── ProjectionObservation.java
            │   │                       │   └── ProjectionReport.java
            │   │                       ├── projection
            │   │                       │   ├── ClienteIndicadorRecord.java
            │   │                       │   ├── OrdemResumoDto.java
            │   │                       │   ├── OrdemResumoRecord.java
            │   │                       │   └── OrdemResumoView.java
            │   │                       ├── query
            │   │                       │   └── ProjectionRepository.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_340.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula340
                                        ├── EntityVersusProjectionIT.java
                                        ├── DtoConstructorProjectionIT.java
                                        ├── RecordProjectionIT.java
                                        ├── InterfaceProjectionIT.java
                                        ├── TupleProjectionIT.java
                                        ├── AggregateProjectionIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
consulta de entidade:
Ordem managed.

consulta DTO:
OrdemResumoDto imutável.

consulta record:
OrdemResumoRecord imutável.

interface:
retorno como OrdemResumoView.

Tuple:
aliases lidos e mapeados.

agregação:
quantidade de Atividades por Ordem.

projection alterada:
zero UPDATE.

SQL:
somente colunas selecionadas.
```

---

## Conceito essencial

### O que e projection

Projection é um formato de resultado de leitura que contém apenas os dados exigidos pelo caso de uso.

Exemplo:

```java
public record OrdemResumoRecord(
        Long ordemId,
        String codigo,
        String status,
        String clienteNome,
        long quantidadeAtividades,
        OffsetDateTime criadaEm
) {
}
```

Esse record não representa uma tabela.

Ele representa:

```text
o resumo de uma Ordem para uma consulta.
```

---

### Entidade

Uma entidade possui:

- identidade persistente;
- ciclo de vida JPA;
- estado managed;
- dirty checking;
- relacionamentos;
- proxies;
- versão;
- regras de persistência;
- mapeamento de tabela.

Exemplo:

```java
OrdemServicoEntity
```

Quando carregada pelo `EntityManager`, pode ser managed.

---

### Projection

Uma projection:

- não é registrada como `@Entity`;
- não possui persistence context;
- não é managed;
- não recebe dirty checking;
- não possui lifecycle JPA;
- não deve ser passada a `persist`;
- não deve ser passada a `remove`;
- pode ser imutável;
- pode ser específica de uma tela ou relatório.

---

### Quando retornar entidade

Retorne entidade internamente quando o caso de uso precisa:

- alterar estado;
- aplicar regra de domínio;
- executar dirty checking;
- navegar pelo agregado;
- preservar identidade;
- controlar lifecycle.

Mesmo internamente, não exponha a entidade diretamente para camada externa sem critério.

---

### Quando retornar projection

Use projection quando o caso precisa:

- apenas ler;
- selecionar poucas colunas;
- montar listagem;
- montar dashboard;
- calcular indicador;
- exportar relatório;
- evitar grafo completo;
- evitar dirty checking;
- reduzir acoplamento;
- transportar resultado imutável.

---

---

### DTO classico

DTO significa:

```text
Data Transfer Object.
```

Um DTO clássico pode ser uma classe final:

```java
public final class OrdemResumoDto {

    private final Long ordemId;
    private final String codigo;
    private final String status;
    private final String clienteNome;
    private final long quantidadeAtividades;
    private final OffsetDateTime criadaEm;

    public OrdemResumoDto(
            Long ordemId,
            String codigo,
            String status,
            String clienteNome,
            long quantidadeAtividades,
            OffsetDateTime criadaEm
    ) {
        this.ordemId = ordemId;
        this.codigo = codigo;
        this.status = status;
        this.clienteNome = clienteNome;
        this.quantidadeAtividades =
                quantidadeAtividades;
        this.criadaEm = criadaEm;
    }

    public Long getOrdemId() {
        return ordemId;
    }

    public String getCodigo() {
        return codigo;
    }
}
```

O construtor precisa corresponder à consulta.

---

### Constructor expression

JPQL permite:

```java
select new pacote.Classe(
    expressão1,
    expressão2
)
```

Exemplo:

```java
select new br.com.formacao.m13.aula340.projection.OrdemResumoDto(
    o.id,
    o.codigo,
    o.status,
    c.nome,
    count(a.id),
    o.criadaEm
)
from OrdemServico o
join o.cliente c
left join o.atividades a
group by
    o.id,
    o.codigo,
    o.status,
    c.nome,
    o.criadaEm
order by o.codigo
```

A classe precisa ter construtor público compatível em:

- quantidade;
- ordem;
- tipos.

---

### Nome totalmente qualificado

Na constructor expression padrão, use o nome totalmente qualificado:

```text
br.com.formacao...
```

O nome simples não é suficiente de forma portável.

Renomear o pacote exige atualizar a JPQL.

Esse é um custo da abordagem.

---

### Tipo do count

Em JPQL, `count` retorna:

```java
Long
```

Mesmo quando o valor parece pequeno.

O construtor deve aceitar:

```java
Long
```

ou um tipo compatível conforme a expressão.

Para record, prefira:

```java
Long quantidadeAtividades
```

ou trate a conversão explicitamente.

---

### Record

Record é adequado para modelo imutável de leitura.

Exemplo:

```java
public record OrdemResumoRecord(
        Long ordemId,
        String codigo,
        String status,
        String clienteNome,
        Long quantidadeAtividades,
        OffsetDateTime criadaEm
) implements OrdemResumoView {
}
```

O record fornece:

- construtor canônico;
- accessors;
- `equals`;
- `hashCode`;
- `toString`;
- imutabilidade das referências;
- estrutura compacta.

---

### Record e constructor expression

Como record é uma classe com construtor canônico, ele pode ser instanciado por constructor expression quando os tipos correspondem.

Exemplo:

```java
select new br.com.formacao.m13.aula340.projection.OrdemResumoRecord(
    o.id,
    o.codigo,
    o.status,
    c.nome,
    count(a.id),
    o.criadaEm
)
```

O provider não trata o record como entidade.

Ele apenas chama o construtor.

---

### Imutabilidade rasa

Record é imutável quanto às referências dos componentes.

Mas, se um componente for uma lista mutável, a lista ainda pode mudar.

Nesta aula, os records usarão somente:

- `Long`;
- `String`;
- `OffsetDateTime`;
- valores escalares.

---

### Interface projection

Crie:

```java
public interface OrdemResumoView {

    Long ordemId();

    String codigo();

    String status();

    String clienteNome();

    Long quantidadeAtividades();

    OffsetDateTime criadaEm();
}
```

O record implementará a interface:

```java
public record OrdemResumoRecord(
        Long ordemId,
        String codigo,
        String status,
        String clienteNome,
        Long quantidadeAtividades,
        OffsetDateTime criadaEm
) implements OrdemResumoView {
}
```

O consumidor poderá depender de:

```java
List<OrdemResumoView>
```

sem conhecer a implementação concreta.

---

### JPA padrao e interface

A Jakarta Persistence padrão não define uma regra que transforme automaticamente aliases como:

```text
ordemId;

codigo;

clienteNome.
```

em uma interface arbitrária.

Isso é uma capacidade oferecida por frameworks ou por código de adaptação.

No laboratório sem Spring:

```text
interface:
contrato.

record:
implementação.

Tuple:
fonte de mapeamento explícito.
```

---

### Tuple

`Tuple` representa uma linha com múltiplos elementos nomeados ou posicionais.

Consulta:

```java
select
    o.id as ordemId,
    o.codigo as codigo,
    o.status as status,
    c.nome as clienteNome,
    count(a.id) as quantidadeAtividades,
    o.criadaEm as criadaEm
from OrdemServico o
join o.cliente c
left join o.atividades a
group by
    o.id,
    o.codigo,
    o.status,
    c.nome,
    o.criadaEm
order by o.codigo
```

Execução:

```java
List<Tuple> tuples =
        entityManager.createQuery(
                jpql,
                Tuple.class
        )
                .getResultList();
```

---

### Alias no Tuple

Mapeamento:

```java
Long ordemId =
        tuple.get(
                "ordemId",
                Long.class
        );
```

Use aliases estáveis e explícitos.

Evite depender apenas de posição:

```java
tuple.get(0)
```

Posições são frágeis quando a seleção muda.

---

### Mapper de Tuple

Crie:

```java
private static OrdemResumoRecord map(
        Tuple tuple
) {
    return new OrdemResumoRecord(
            tuple.get(
                    "ordemId",
                    Long.class
            ),
            tuple.get(
                    "codigo",
                    String.class
            ),
            tuple.get(
                    "status",
                    String.class
            ),
            tuple.get(
                    "clienteNome",
                    String.class
            ),
            tuple.get(
                    "quantidadeAtividades",
                    Long.class
            ),
            tuple.get(
                    "criadaEm",
                    OffsetDateTime.class
            )
    );
}
```

O mapeamento fica explícito e testável.

---

### Interface como retorno

O repository pode declarar:

```java
public List<OrdemResumoView>
findOrderViews()
```

Internamente:

```java
return tuples.stream()
        .map(ProjectionRepository::map)
        .map(
                record ->
                        (OrdemResumoView) record
        )
        .toList();
```

O consumidor recebe o contrato.

A implementação continua record.

---

### Constructor expression versus Tuple

Constructor expression:

- menos código de mapeamento;
- retorno tipado direto;
- falha quando o construtor não corresponde;
- acoplamento do nome da classe na JPQL;
- aliases menos relevantes.

Tuple:

- seleção flexível;
- aliases explícitos;
- útil em Criteria multiselect;
- exige mapper;
- erros podem aparecer no acesso ao alias;
- melhor para resultados muito dinâmicos.

---

### Interface versus record

Interface:

- define contrato;
- permite múltiplas implementações;
- facilita desacoplamento;
- não armazena estado sozinha;
- JPA padrão não a instancia automaticamente.

Record:

- armazena estado;
- implementa contrato;
- compacto;
- imutável;
- possui construtor compatível;
- excelente para resultado de leitura.

Os dois podem ser usados juntos.

---

### Agregacao

A projection de Ordem incluirá:

```text
count(a.id).
```

Como a consulta usa `left join`, Ordens sem Atividades retornam:

```text
0.
```

`count(a.id)` ignora valores nulos.

Não é necessário `coalesce` para esse count.

---

### Group by

Toda expressão selecionada que não é agregada precisa participar do `group by`.

No exemplo:

```text
o.id;

o.codigo;

o.status;

c.nome;

o.criadaEm.
```

Esquecer um campo pode causar erro SQL ou comportamento não portável.

---

### Projection agregada por Cliente

Crie:

```java
public record ClienteIndicadorRecord(
        Long clienteId,
        String clienteCodigo,
        String clienteNome,
        Long totalOrdens,
        Long ordensAbertas
) {
}
```

A consulta poderá usar:

```java
sum(
    case
        when o.status = 'ABERTA'
        then 1
        else 0
    end
)
```

O objetivo é mostrar projection de relatório.

---

### Case expression

JPQL suporta expressões condicionais.

Exemplo:

```java
sum(
    case
        when o.status = :statusAberta
        then 1
        else 0
    end
)
```

O retorno pode depender do provider e do tipo numérico inferido.

Teste o tipo real e use construtor compatível.

No laboratório, normalize para `Long`.

---

### Projection e dirty checking

Uma projection não é managed.

Alterar uma propriedade de DTO mutável:

```java
dto.setStatus("CANCELADA");
```

não altera o banco.

No laboratório, DTO e record serão imutáveis.

O teste confirmará:

```text
consulta projection;

commit vazio;

zero UPDATE.
```

---

---

---

### Projection e regras de dominio

Projection é modelo de leitura.

Não use projection para executar regras que exigem invariantes da entidade.

Exemplo inadequado:

```text
cancelar Ordem usando apenas OrdemResumoRecord.
```

Para alterar estado:

1. carregue a entidade;
2. aplique regra;
3. confirme transação.

---

---

---

---

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\java\br\com\formacao\m13\aula340\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\java\br\com\formacao\m13\aula340\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\java\br\com\formacao\m13\aula340\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\java\br\com\formacao\m13\aula340\projection"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\java\br\com\formacao\m13\aula340\query"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\java\br\com\formacao\m13\aula340\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-340-projections-dto-interface-record\src\test\java\br\com\formacao\m13\aula340"

Set-Location `
  "labs\m13\aula-340-projections-dto-interface-record"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 339.

Ajuste:

```text
artifactId:
aula-340-projections-dto-interface-record.

persistence unit:
aula340PU.

Main:
br.com.formacao.m13.aula340.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_340
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-340-jpa
JPA_POOL_NAME=aula-340-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration

Crie:

```text
cliente;

ordem_servico;

atividade.
```

Sequences:

```text
cliente:
340001.

ordem:
340101.

atividade:
340201.
```

Mantenha:

- foreign keys;
- índices;
- status;
- timestamps;
- versões;
- sem delete cascade físico.

---

### 4. Reutilizar entidades

Mappings:

```text
Ordem -> Cliente:
ManyToOne LAZY.

Ordem -> Atividades:
OneToMany LAZY.

Cliente -> Ordens:
OneToMany LAZY.
```

Não adicione annotations de projection às entidades.

---

### 5. Criar OrdemResumoView.java

```java
package br.com.formacao.m13.aula340.projection;

import java.time.OffsetDateTime;

public interface OrdemResumoView {

    Long ordemId();

    String codigo();

    String status();

    String clienteNome();

    Long quantidadeAtividades();

    OffsetDateTime criadaEm();
}
```

Esse contrato não depende de JPA.

---

### 6. Criar OrdemResumoDto.java

```java
package br.com.formacao.m13.aula340.projection;

import java.time.OffsetDateTime;
import java.util.Objects;

public final class OrdemResumoDto {

    private final Long ordemId;
    private final String codigo;
    private final String status;
    private final String clienteNome;
    private final Long quantidadeAtividades;
    private final OffsetDateTime criadaEm;

    public OrdemResumoDto(
            Long ordemId,
            String codigo,
            String status,
            String clienteNome,
            Long quantidadeAtividades,
            OffsetDateTime criadaEm
    ) {
        this.ordemId =
                Objects.requireNonNull(ordemId);
        this.codigo =
                Objects.requireNonNull(codigo);
        this.status =
                Objects.requireNonNull(status);
        this.clienteNome =
                Objects.requireNonNull(clienteNome);
        this.quantidadeAtividades =
                Objects.requireNonNull(
                        quantidadeAtividades
                );
        this.criadaEm =
                Objects.requireNonNull(criadaEm);
    }

    public Long getOrdemId() {
        return ordemId;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getStatus() {
        return status;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public Long getQuantidadeAtividades() {
        return quantidadeAtividades;
    }

    public OffsetDateTime getCriadaEm() {
        return criadaEm;
    }
}
```

A classe não possui setters.

---

### 7. Criar OrdemResumoRecord.java

```java
package br.com.formacao.m13.aula340.projection;

import java.time.OffsetDateTime;
import java.util.Objects;

public record OrdemResumoRecord(
        Long ordemId,
        String codigo,
        String status,
        String clienteNome,
        Long quantidadeAtividades,
        OffsetDateTime criadaEm
) implements OrdemResumoView {

    public OrdemResumoRecord {
        Objects.requireNonNull(ordemId);
        Objects.requireNonNull(codigo);
        Objects.requireNonNull(status);
        Objects.requireNonNull(clienteNome);
        Objects.requireNonNull(
                quantidadeAtividades
        );
        Objects.requireNonNull(criadaEm);
    }
}
```

---

### 8. Criar ClienteIndicadorRecord.java

```java
package br.com.formacao.m13.aula340.projection;

public record ClienteIndicadorRecord(
        Long clienteId,
        String clienteCodigo,
        String clienteNome,
        Long totalOrdens,
        Long ordensAbertas
) {
}
```

Use construtor compacto para validar valores não negativos.

---

### 9. Criar ProjectionRepository.java

Métodos:

```java
findEntities();

findDtoSummaries();

findRecordSummaries();

findTupleSummaries();

findViewSummaries();

findClientIndicators();
```

O repository recebe `EntityManager` no construtor.

Não abre nem fecha transação.

---

### 10. Implementar findDtoSummaries

```java
public List<OrdemResumoDto>
findDtoSummaries() {
    return entityManager.createQuery(
            """
            select new br.com.formacao.m13.aula340.projection.OrdemResumoDto(
                o.id,
                o.codigo,
                o.status,
                c.nome,
                count(a.id),
                o.criadaEm
            )
            from OrdemServico o
            join o.cliente c
            left join o.atividades a
            where o.codigo like :prefix
            group by
                o.id,
                o.codigo,
                o.status,
                c.nome,
                o.criadaEm
            order by o.codigo
            """,
            OrdemResumoDto.class
    )
            .setParameter(
                    "prefix",
                    "OS-JPA-340-%"
            )
            .getResultList();
}
```

---

### 11. Implementar findRecordSummaries

Use a mesma estrutura, alterando a classe da constructor expression:

```java
select new br.com.formacao.m13.aula340.projection.OrdemResumoRecord(
    o.id,
    o.codigo,
    o.status,
    c.nome,
    count(a.id),
    o.criadaEm
)
```

O retorno será:

```java
List<OrdemResumoRecord>
```

---

### 12. Implementar findTupleSummaries

JPQL:

```java
select
    o.id as ordemId,
    o.codigo as codigo,
    o.status as status,
    c.nome as clienteNome,
    count(a.id) as quantidadeAtividades,
    o.criadaEm as criadaEm
from OrdemServico o
join o.cliente c
left join o.atividades a
where o.codigo like :prefix
group by
    o.id,
    o.codigo,
    o.status,
    c.nome,
    o.criadaEm
order by o.codigo
```

Retorne:

```java
List<Tuple>
```

---

### 13. Implementar mapper de Tuple

```java
private static OrdemResumoRecord mapTuple(
        Tuple tuple
) {
    return new OrdemResumoRecord(
            tuple.get(
                    "ordemId",
                    Long.class
            ),
            tuple.get(
                    "codigo",
                    String.class
            ),
            tuple.get(
                    "status",
                    String.class
            ),
            tuple.get(
                    "clienteNome",
                    String.class
            ),
            tuple.get(
                    "quantidadeAtividades",
                    Long.class
            ),
            tuple.get(
                    "criadaEm",
                    OffsetDateTime.class
            )
    );
}
```

---

### 14. Implementar findViewSummaries

```java
public List<OrdemResumoView>
findViewSummaries() {
    return findTupleSummaries()
            .stream()
            .map(
                    ProjectionRepository::mapTuple
            )
            .map(
                    item ->
                            (OrdemResumoView) item
            )
            .toList();
}
```

Isso prova:

```text
JPA retornou Tuple;

código mapeou record;

record implementou interface;

consumidor recebeu interface.
```

---

### 15. Implementar indicador por Cliente

JPQL:

```java
select new br.com.formacao.m13.aula340.projection.ClienteIndicadorRecord(
    c.id,
    c.codigo,
    c.nome,
    count(o.id),
    sum(
        case
            when o.status = :statusAberta
            then 1
            else 0
        end
    )
)
from Cliente c
left join c.ordens o
where c.codigo like :prefix
group by
    c.id,
    c.codigo,
    c.nome
order by c.codigo
```

Parâmetros:

```text
statusAberta:
ABERTA.

prefix:
CLI-JPA-340-%.
```

Inclua Cliente sem Ordens.

Confirme:

```text
totalOrdens 0;

ordensAbertas 0.
```

Se o provider retornar tipo numérico diferente no `sum`, ajuste a expressão ou mapper de forma explícita e documentada.

---

### 16. Criar ProjectionObservation.java

```java
package br.com.formacao.m13.aula340.lab;

public record ProjectionObservation(
        String scenario,
        int resultCount,
        long selectCount,
        boolean managed,
        boolean immutable,
        boolean selectedOnlyRequiredColumns,
        String implementationType
) {

    public ProjectionObservation {
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

### 17. Criar ProjectionReport.java

```java
package br.com.formacao.m13.aula340.lab;

import java.util.List;

public record ProjectionReport(
        List<ProjectionObservation> observations,
        boolean dtoConstructorWorked,
        boolean recordConstructorWorked,
        boolean tupleAliasesWorked,
        boolean interfaceContractWorked,
        boolean aggregateProjectionWorked,
        boolean projectionsWereNotManaged,
        boolean projectionChangeProducedNoUpdate,
        boolean noSpringProjectionWasUsed
) {

    public ProjectionReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 18. Criar fixtures

Clientes:

```text
CLI-JPA-340-ALFA;

CLI-JPA-340-BETA;

CLI-JPA-340-EMPTY.
```

Ordens:

```text
OS-JPA-340-001:
ALFA;
ABERTA;
duas Atividades.

OS-JPA-340-002:
ALFA;
CONCLUIDA;
uma Atividade.

OS-JPA-340-003:
BETA;
ABERTA;
zero Atividades.

OS-JPA-340-004:
BETA;
CANCELADA;
três Atividades.
```

Cliente EMPTY não possui Ordens.

Atividades:

```text
ATV-JPA-340-001;
...
ATV-JPA-340-006.
```

---

### 19. Cenário entidade

Abra manager.

Limpe inspector.

Execute consulta de entidades:

```java
select o
from OrdemServico o
where o.codigo like :prefix
order by o.codigo
```

Confirme:

```text
quatro resultados;

entityManager.contains(ordem):
true.
```

Registre a largura SQL observada.

Não inicialize associações.

---

### 20. Cenário DTO

Abra novo manager.

Execute `findDtoSummaries`.

Confirme:

```text
quatro DTOs;

quantidades:
2;
1;
0;
3.

ordem correta;

nenhuma instância managed.
```

Como DTO não é entidade, não chame `contains` esperando false sem considerar que a API pode exigir entidade; use `entityManager.contains(dto)` apenas se o provider aceitar Object e retornar false, ou valide pela ausência de `@Entity` e tipo não gerenciado.

---

### 21. Cenário record

Execute `findRecordSummaries`.

Confirme:

```text
quatro records;

mesmos valores do DTO;

equals por componentes;

imutabilidade;

constructor expression compatível.
```

Compare o primeiro DTO e o primeiro record por valores.

---

### 22. Cenário Tuple

Execute `findTupleSummaries`.

Confirme aliases:

```text
ordemId;

codigo;

status;

clienteNome;

quantidadeAtividades;

criadaEm.
```

Tente um alias inexistente em teste negativo e espere:

```text
IllegalArgumentException.
```

Não acople o teste à mensagem exata.

---

### 23. Cenário interface

Execute `findViewSummaries`.

Confirme:

```text
tipo declarado:
OrdemResumoView.

implementação real:
OrdemResumoRecord.

quatro resultados;

accessors funcionam.
```

Documente:

```text
a interface não foi instanciada pela JPA;
foi implementada pelo record mapeado.
```

---

### 24. Cenário indicador

Execute `findClientIndicators`.

Esperado:

```text
ALFA:
2 Ordens;
1 ABERTA.

BETA:
2 Ordens;
1 ABERTA.

EMPTY:
0 Ordens;
0 ABERTAS.
```

Confirme que o `left join` preservou o Cliente vazio.

---

### 25. Provar zero dirty checking

Abra manager e transação.

Execute uma projection.

Não carregue entidade.

Se usar DTO clássico imutável, apenas crie uma cópia com status diferente em memória.

Commit.

Confirme:

```text
zero UPDATE.
```

Depois, carregue a entidade correspondente e confirme que o status do banco não mudou.

---

### 26. Observar colunas selecionadas

Use `SqlCaptureInspector`.

Compare consulta de entidade e projection.

Valide de forma robusta:

```text
projection SQL contém colunas usadas;

projection não seleciona todas as colunas da entidade;

não comparar SQL integral.
```

Não dependa de aliases gerados pelo Hibernate.

---

### 27. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. prepara fixtures;
4. executa cenários;
5. imprime relatório;
6. remove fixtures;
7. não imprime entidades completas;
8. não imprime SQL integral;
9. fecha runtime.

Formato:

```text
cenário | resultados | SELECTs | managed | imutável | colunas mínimas | implementação
```

---

### 28. Criar EntityVersusProjectionIT.java

Casos:

#### Entidade

- resultado managed;
- tipo entity;
- SQL da entidade.

#### DTO

- não possui annotation Entity;
- não participa de lifecycle;
- valores corretos.

#### Projection não atualiza

- commit vazio;
- zero update;
- banco preservado.

---

### 29. Criar DtoConstructorProjectionIT.java

Casos:

#### Constructor expression

- quatro resultados;
- tipos corretos;
- count correto.

#### Ordem do construtor

Crie consulta experimental com ordem incompatível e espere falha de construção.

Não mantenha a consulta quebrada no fluxo principal.

#### Nome totalmente qualificado

Documente sua necessidade.

---

### 30. Criar RecordProjectionIT.java

Casos:

#### Record constructor

- quatro resultados;
- valores corretos.

#### Igualdade

- duas instâncias com mesmos componentes;
- `equals=true`.

#### Sem setters

Use reflection para confirmar ausência de setters públicos.

#### Interface

Confirme que record implementa `OrdemResumoView`.

---

### 31. Criar InterfaceProjectionIT.java

Casos:

#### Contrato

- repository retorna `List<OrdemResumoView>`;
- accessors funcionam.

#### Implementação

- instância é `OrdemResumoRecord`.

#### Sem materialização automática

- documentação e teste de arquitetura confirmam que repository usa mapper explícito;
- não usar Spring Data.

---

### 32. Criar TupleProjectionIT.java

Casos:

#### Aliases

- leitura por nome e tipo;
- valores corretos.

#### Alias inexistente

- falha controlada.

#### Mapper

- Tuple vira record;
- nenhum cast inseguro espalhado.

#### Ordem posicional

Não use posição no código oficial.

---

### 33. Criar AggregateProjectionIT.java

Casos:

#### Count por Ordem

- 2, 1, 0 e 3.

#### Indicador por Cliente

- totais e abertas corretos.

#### Cliente vazio

- preservado pelo left join.

#### Group by

- uma linha por Cliente;
- uma linha por Ordem na projection correspondente.

---

### 34. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_340.atividade
WHERE codigo LIKE 'ATV-JPA-340-%';

DELETE FROM jpa_340.ordem_servico
WHERE codigo LIKE 'OS-JPA-340-%';

DELETE FROM jpa_340.cliente
WHERE codigo LIKE 'CLI-JPA-340-%';
```

Use antes e depois dos testes.

---

### 35. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_340.
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
zero CLI-JPA-340-%;

zero OS-JPA-340-%;

zero ATV-JPA-340-%;

foreign keys e índices existentes;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 36. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
DTO constructor funcionou;

record constructor funcionou;

Tuple aliases funcionaram;

interface retornou contrato;

record implementou interface;

agregações funcionaram;

projections não ficaram managed;

zero UPDATE foi gerado;

SQL selecionou apenas dados necessários;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 37. Criar documentacao

`entidade-vs-projection.md` deve comparar:

```text
identidade;

managed;

dirty checking;

relacionamentos;

uso;

imutabilidade;

SQL;

exposição.
```

`constructor-expression.md` deve registrar:

- nome totalmente qualificado;
- construtor;
- ordem;
- tipos;
- count Long;
- falhas comuns.

`interface-projection-sem-spring.md` deve explicar:

- interface como contrato;
- ausência de materialização padrão JPA;
- record como implementação;
- mapper explícito;
- diferença para Spring Data.

`tuple-aliases-e-mapeamento.md` deve registrar:

- aliases;
- tipos;
- mapper centralizado;
- alias inexistente;
- posição versus nome;
- uso com Criteria futuro.

`record-como-modelo-de-leitura.md` deve registrar:

- construtor canônico;
- accessors;
- igualdade;
- imutabilidade rasa;
- implementação de interface;
- validação.

`troubleshooting-projections.md` deve cobrir:

- construtor não encontrado;
- tipo `Long` versus `Integer`;
- nome de pacote errado;
- alias incorreto;
- group by incompleto;
- Cliente vazio ausente;
- projection com entidade;
- tentativa de persistir projection;
- expectativa de interface automática;
- SQL maior que o necessário.

---

## Entendendo o que foi feito

### O resultado deixou de ser sempre entidade

Cada consulta passou a retornar o formato necessário ao caso de leitura.

### DTO e record foram materializados diretamente

A constructor expression chamou construtores compatíveis.

### Interface virou contrato explicito

O record implementou a interface e o repository realizou o mapeamento sem magia.

### Tuple trouxe flexibilidade com responsabilidade

Aliases e tipos foram centralizados em um mapper.

### Dirty checking foi evitado

As projections permaneceram fora do persistence context.

---

## Erros comuns importantes

### Esperar interface projection automatica na JPA

Isso não pertence ao contrato padrão.

### Usar Integer para count

JPQL count retorna Long.

### Colocar entidade dentro da projection

Isso reintroduz proxies e lifecycle.

### Esquecer group by

Agregações exigem agrupamento correto.

### Usar projection para alterar dominio

Carregue a entidade para executar regra de escrita.

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

### Conferir dados

```sql
SELECT
    ordem.codigo,
    ordem.status,
    cliente.nome AS cliente_nome,
    count(atividade.id) AS atividades
FROM jpa_340.ordem_servico AS ordem
JOIN jpa_340.cliente AS cliente
    ON cliente.id = ordem.cliente_id
LEFT JOIN jpa_340.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
GROUP BY
    ordem.codigo,
    ordem.status,
    cliente.nome
ORDER BY ordem.codigo;
```

---

## Exercicio guiado

### Parte 1 — Projection minima

Crie:

```java
OrdemCodigoStatusRecord
```

com apenas código e status.

Compare o SQL com `OrdemResumoRecord`.

### Parte 2 — DTO mutavel

Crie temporariamente um DTO mutável.

Altere o status e confirme zero update.

Depois restaure o DTO imutável e documente o motivo.

### Parte 3 — Tuple posicional

Leia uma Tuple por posição em teste experimental.

Reordene o select e observe a fragilidade.

Mantenha aliases no código oficial.

### Parte 4 — Interface adicional

Crie:

```java
IdentifiedView
```

com:

```java
Long ordemId();
```

Faça `OrdemResumoView` estender esse contrato.

### Parte 5 — Indicador

Adicione quantidade de Ordens concluídas ao `ClienteIndicadorRecord`.

Ajuste group by e tipos.

### Parte 6 — Criteria Tuple

Use Criteria API para criar uma consulta `Tuple` com aliases.

Mapeie para `OrdemResumoRecord`.

Não crie paginação.

### Parte 7 — Entidade versus projection

Meça:

- colunas;
- entidades carregadas;
- statements;
- tempo apenas como observação.

Não tire conclusão de performance com poucas fixtures.

### Parte 8 — ADR

Registre:

```text
entidades para escrita e regras;

records para leitura imutável;

interfaces como contrato;

Tuple somente com mapper centralizado;

constructor expression em consultas estáticas;

sem projections genéricas gigantes.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 340 existe;
- continuidade com a aula 339 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_340` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- entidades anteriores foram reutilizadas;
- projection foi definida;
- entidade e projection foram comparadas;
- lifecycle managed foi explicado;
- ausência de dirty checking foi explicada;
- DTO clássico foi criado;
- DTO ficou imutável;
- constructor expression JPQL foi usada;
- nome totalmente qualificado foi usado;
- ordem do construtor foi respeitada;
- tipos do construtor foram respeitados;
- count foi tratado como Long;
- record foi criado;
- record usou construtor canônico;
- record ficou imutável;
- record implementou interface;
- interface projection foi criada;
- interface foi tratada como contrato;
- ausência de materialização automática JPA foi explicada;
- Spring Data não foi usado;
- Tuple foi usada;
- aliases foram definidos;
- leitura tipada por alias foi usada;
- mapper de Tuple foi centralizado;
- posição não foi usada no código oficial;
- alias inexistente foi testado;
- repository retornou interface;
- implementação concreta foi record;
- agregação por Ordem foi criada;
- agregação por Cliente foi criada;
- `left join` preservou zero filhos;
- `count` foi usado;
- `sum case` foi usado;
- `group by` foi usado;
- Ordem sem Atividade retornou zero;
- Cliente sem Ordem retornou zero;
- projection não foi passada a persist;
- projection não foi passada a remove;
- projection alterada não gerou update;
- banco permaneceu inalterado;
- projection não carregou entidade relacionada;
- valores simples foram projetados;
- entidade não foi embutida na projection;
- SQL de projection selecionou menos colunas;
- SQL integral não foi comparado;
- interface e record foram comparados;
- DTO e record foram comparados;
- Tuple e constructor expression foram comparados;
- nomes de caso de uso foram usados;
- projection genérica gigante foi evitada;
- testes de entidade versus projection foram criados;
- testes DTO foram criados;
- testes record foram criados;
- testes interface foram criados;
- testes Tuple foram criados;
- testes de agregação foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- paginação não foi aprofundada antes da aula 341;
- count paginado não foi antecipado;
- Spring não foi usado;
- ponte para a aula 341 está correta;
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
  labs/m13/aula-340-projections-dto-interface-record
```

Commit recomendado:

```powershell
git commit -m "feat(m13): criar projections dto interface e record"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você separou o modelo persistente do modelo de leitura.

Aprendeu:

```text
entidade:
managed e persistente.

DTO:
classe de transporte.

record:
resultado imutável.

interface:
contrato de leitura.

Tuple:
linha por aliases.

constructor expression:
instancia classe diretamente.

projection:
somente dados necessários.
```

O laboratório comprovou:

```text
DTO por JPQL;

record por JPQL;

Tuple por aliases;

interface implementada por record;

agregação por Ordem;

indicador por Cliente;

Cliente sem Ordens preservado;

projection fora do persistence context;

zero dirty checking;

zero update.
```

A decisão arquitetural foi:

```text
entidade:
escrita e regras de domínio.

record:
leitura imutável.

interface:
contrato desacoplado.

DTO clássico:
compatibilidade e controle explícito.

Tuple:
mapeamento flexível e centralizado.
```

A próxima aula será:

```text
341 - M13.31 - Paginacao e ordenacao com JPA
```

Nela, você aprenderá:

- `setFirstResult`;
- `setMaxResults`;
- número da página;
- tamanho da página;
- offset;
- consulta de conteúdo;
- consulta de total;
- total de elementos;
- total de páginas;
- ordenação estável;
- desempate por ID;
- entrada de ordenação permitida;
- limites máximos;
- página vazia;
- página além do final;
- impacto de joins;
- count com filtros;
- DTO paginado;
- riscos de collection fetch;
- introdução a keyset pagination.

A aula 340 definiu o formato enxuto da leitura.

A aula 341 limitará e ordenará esse resultado com contratos previsíveis.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei entidade de projection.
- [ ] Criei DTO e record por constructor expression.
- [ ] Usei interface como contrato sem depender de Spring Data.
- [ ] Mapeei Tuple por aliases.
- [ ] Confirmei que projections não recebem dirty checking.

---

## Troubleshooting adicional

### Could not resolve class

Confira o nome totalmente qualificado na constructor expression.

### Constructor not found

Revise quantidade, ordem e tipos dos argumentos.

### Count chegou como tipo inesperado

Use Long e valide a expressão agregada.

### Alias nao encontrado

Confira o alias da seleção e o mapper.

### Interface nao foi instanciada

A JPA padrão não cria interface arbitrária automaticamente.

---

## Perguntas de revisao

1. O que é projection?
2. Projection é entidade?
3. Projection fica managed?
4. Projection recebe dirty checking?
5. O que é constructor expression?
6. O nome da classe deve ser qualificado?
7. Qual tipo count retorna?
8. Record pode ser usado em constructor expression?
9. O que interface projection representa nesta aula?
10. JPA instancia interface automaticamente?
11. O que é Tuple?
12. Por que usar aliases?
13. Posição é mais segura que alias?
14. O que faz group by?
15. Left join preserva raiz vazia?
16. Pode colocar entidade na projection?
17. Projection deve alterar domínio?
18. Spring Data foi usado?
19. Paginação foi aprofundada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Formato específico de leitura.
2. Não.
3. Não.
4. Não.
5. Instancia uma classe na JPQL.
6. Sim, totalmente qualificado.
7. Long.
8. Sim.
9. Contrato implementado por record.
10. Não no padrão JPA.
11. Linha com elementos.
12. Para mapear por nome.
13. Não.
14. Agrupa dados agregados.
15. Sim.
16. Deve ser evitado.
17. Não.
18. Não.
19. Não.
20. Paginacao e ordenacao com JPA.

---

## Desafio opcional

Crie:

```java
ProjectionContractVerifier
```

Entrada:

```text
classe;

é record;

implementa interface;

possui Entity;

possui setters;

componentes;

construtor público.
```

Saída:

```text
relatório Markdown;

alertas.
```

Regras:

- falhar se projection possuir `@Entity`;
- alertar setters públicos;
- validar interface esperada;
- não instanciar JPA;
- não acessar banco;
- possuir testes unitários;
- não considerar toda classe imutável apenas por ser final.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 340 - M13.30 - Projections DTO interface e record

- Diferenciei entidade de projection.
- Entendi que entidade participa do persistence context.
- Entendi que projection não é managed.
- Entendi que projection não recebe dirty checking.
- Criei `OrdemResumoDto`.
- Mantive o DTO imutável.
- Usei constructor expression JPQL.
- Usei nome totalmente qualificado.
- Respeitei ordem e tipos do construtor.
- Tratei `count` como `Long`.
- Criei `OrdemResumoRecord`.
- Usei o construtor canônico do record.
- Mantive resultado imutável.
- Criei `OrdemResumoView`.
- Usei interface como contrato de leitura.
- Entendi que JPA padrão não instancia interface automaticamente.
- Fiz o record implementar a interface.
- Usei `Tuple`.
- Criei aliases explícitos.
- Li valores por alias e tipo.
- Centralizei o mapper de Tuple.
- Evitei acesso por posição.
- Retornei `List<OrdemResumoView>`.
- Criei agregação por Ordem.
- Criei indicador por Cliente.
- Usei `left join`, `count`, `sum case` e `group by`.
- Preservei Cliente sem Ordens.
- Confirmei zero update após trabalhar com projection.
- Comparei SQL de entidade e projection.
- Evitei entidade dentro da projection.
- Mantive Flyway no DDL e Hibernate em validate.
- Não usei Spring Data projections.
- Não aprofundei paginação antes da aula 341.
- Próxima aula: Paginacao e ordenacao com JPA.
```

---

## Referencia tecnica curta

```text
Entity:
managed.

Projection:
read model.

DTO:
classe de transporte.

Record:
read model imutável.

Interface:
contrato.

Tuple:
aliases e valores.

Constructor expression:
new na JPQL.

Count:
Long.

Group by:
agregação.

Dirty checking:
não se aplica.
```

Regra final:

```text
projections devem representar contratos de leitura especificos, selecionar somente os dados necessarios e permanecer fora do lifecycle JPA; DTOs e records podem ser construidos por JPQL, interfaces exigem implementacao ou adaptacao explicita sem Spring Data, e Tuple deve ser mapeada por aliases centralizados.
```
