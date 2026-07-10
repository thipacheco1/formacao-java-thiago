# 338 - M13.28 - JPQL select join fetch

## Apresentacao da aula

Na aula 337, você reproduziu e mediu o problema N+1.

Os cenários comprovaram:

```text
cinco Ordens sem navegar para Cliente:
um SELECT.

cinco Ordens com cinco Clientes distintos:
seis SELECTs.

cinco Ordens com um Cliente compartilhado:
dois SELECTs.

quatro Clientes acessando coleções de Ordens:
cinco SELECTs.
```

Você também criou um orçamento de consultas:

```text
listar Ordens sem detalhes:
máximo de um SELECT.

listar Ordens com Cliente:
máximo desejado de dois SELECTs.
```

O cenário N+1 ultrapassou esse orçamento.

Agora você implementará uma correção explícita por caso de uso.

A ferramenta será:

```text
JPQL;
join;
join fetch.
```

JPQL significa:

```text
Jakarta Persistence Query Language.
```

Ela consulta o modelo de entidades e atributos Java.

Em vez de escrever:

```sql
SELECT *
FROM jpa_338.ordem_servico
```

você escreverá:

```java
select o
from OrdemServico o
```

`OrdemServico` é o nome da entidade.

`o` é um alias.

Para carregar o Cliente junto com a Ordem:

```java
select o
from OrdemServico o
join fetch o.cliente
```

Para carregar Clientes e suas Ordens:

```java
select distinct c
from Cliente c
left join fetch c.ordens
order by c.id
```

A diferença mais importante da aula será:

```text
join:
participa da consulta,
mas não determina que a associação fique carregada.

join fetch:
participa da consulta
e altera o plano de carregamento
da associação para aquele caso de uso.
```

Essa correção é local.

O mapping pode continuar:

```text
LAZY.
```

Somente a consulta que realmente precisa dos dados solicita o carregamento antecipado.

Essa abordagem é diferente de trocar toda associação para:

```text
EAGER.
```

O fetch join permite decidir por operação:

```text
lista simples:
não carrega associação.

lista detalhada:
carrega associação necessária.
```

Nesta aula, você aprenderá:

- sintaxe básica de JPQL;
- nome da entidade;
- alias;
- `select`;
- `from`;
- `where`;
- parâmetros nomeados;
- `order by`;
- `join`;
- `inner join`;
- `left join`;
- `join fetch`;
- `left join fetch`;
- fetch join em `ManyToOne`;
- fetch join em `OneToMany`;
- `distinct`;
- duplicação de linhas SQL;
- identidade das entidades no resultado;
- associação carregada;
- correção de N+1;
- orçamento antes e depois;
- limites com paginação;
- riscos de múltiplas coleções;
- testes de regressão.

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

O database será:

```text
formacao_java_jpa_338
```

O schema será:

```text
jpa_338
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

Os mappings continuarão lazy:

```text
Ordem -> Cliente:
ManyToOne LAZY.

Cliente -> Ordens:
OneToMany LAZY.

Ordem -> Atividades:
OneToMany LAZY.
```

O laboratório comprovará:

```text
JPQL simples:
associação continua lazy.

join sem fetch:
associação pode continuar não carregada.

join fetch ManyToOne:
Ordens e Clientes em um SELECT.

left join fetch OneToMany:
Clientes com e sem Ordens preservados.

distinct:
raízes únicas no resultado.

acesso posterior:
zero SELECT adicional para associação carregada.

query budget:
correção atende ao limite.

paginação com collection fetch:
não adotada como solução direta.

estado final:
zero fixtures CLI-JPA-338-%,
OS-JPA-338-% e ATV-JPA-338-%.
```

A próxima aula será:

```text
339 - M13.29 - Criteria API e Specifications
```

Por isso, não serão antecipados:

- `CriteriaBuilder`;
- `CriteriaQuery`;
- `Root`;
- `Predicate`;
- Specifications;
- composição dinâmica de filtros;
- Spring Data;
- projections;
- records de consulta;
- QueryDSL.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
336:
Fetch lazy eager e proxy.

337:
Problema N mais um.

338:
JPQL select join fetch.

339:
Criteria API e Specifications.

340:
Projections DTO interface e record.
```

A aula 336 mostrou quando uma associação é inicializada.

A aula 337 mediu o custo da inicialização repetida.

A aula 338 planejará o carregamento na própria consulta.

A progressão é:

```text
mapping LAZY:
política padrão.

caso de uso:
define os dados necessários.

JPQL join fetch:
carrega apenas para aquela consulta.
```

Nesta aula:

```text
JPQL:
aprofundada no nível necessário.

select:
sim.

aliases:
sim.

parâmetros:
sim.

join:
sim.

join fetch:
sim.

ManyToOne:
sim.

OneToMany:
sim.

distinct:
sim.

query budget:
sim.

paginação:
limites discutidos.

Criteria:
não.

Spring:
não.
```

A arquitetura será:

```text
caso de uso
    -> JPQL específica
        -> join fetch
            -> SQL com join
                -> entidades managed
                    -> associações loaded
                        -> zero inicialização adicional.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-338-jpql-select-join-fetch
```

Estrutura final:

```text
labs
└── m13
    └── aula-338-jpql-select-join-fetch
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── fundamentos-jpql.md
        │   ├── join-vs-join-fetch.md
        │   ├── distinct-em-collection-fetch.md
        │   ├── limites-paginacao.md
        │   ├── orcamento-antes-depois.md
        │   └── troubleshooting-join-fetch.md
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
            │   │                   └── aula338
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── JoinFetchLab.java
            │   │                       │   ├── JoinFetchObservation.java
            │   │                       │   ├── JoinFetchReport.java
            │   │                       │   └── QueryBudget.java
            │   │                       ├── query
            │   │                       │   └── JpaQueryRepository.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_338.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula338
                                        ├── JpqlFundamentalsIT.java
                                        ├── ManyToOneJoinFetchIT.java
                                        ├── OneToManyJoinFetchIT.java
                                        ├── JoinVersusJoinFetchIT.java
                                        ├── JoinFetchQueryBudgetIT.java
                                        ├── PaginationLimitationIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
lista simples de Ordens:
um SELECT;
Cliente não loaded.

join comum:
um SELECT inicial;
Cliente ainda pode exigir inicialização.

join fetch Cliente:
um SELECT total;
Cliente loaded;
zero SELECT posterior.

lista de Clientes com Ordens:
um SELECT;
Clientes sem Ordem preservados;
coleções loaded.

sem distinct:
linhas SQL repetem a raiz.

com distinct:
lista Java contém raízes únicas.

orçamento:
ManyToOne no máximo um SELECT;
OneToMany no máximo um SELECT.
```

---

## Conceito essencial

### JPQL consulta entidades

JPQL usa:

```text
nomes de entidades;

atributos Java;

associações mapeadas.
```

Ela não usa diretamente:

```text
nome da tabela;

nome da coluna;

foreign key física.
```

Exemplo correto:

```java
select o
from OrdemServico o
where o.status = :status
```

Exemplo SQL, não JPQL:

```sql
SELECT *
FROM ordem_servico
WHERE status = ?
```

---

### Nome da entidade

Se a classe possui:

```java
@Entity(name = "OrdemServico")
```

a JPQL usa:

```text
OrdemServico.
```

Não use necessariamente:

```text
OrdemServicoEntity.
```

O nome definido na annotation possui precedência.

---

### Alias

Em:

```java
select o
from OrdemServico o
```

`o` identifica a entidade na consulta.

O alias permite:

```java
o.codigo;

o.status;

o.cliente;

o.atividades.
```

Use nomes curtos e consistentes.

---

### Select implicito

JPQL permite formas implícitas em alguns contextos, mas o laboratório usará:

```java
select o
from OrdemServico o
```

Isso torna o resultado explícito e facilita leitura.

---

### Parametros nomeados

Use:

```java
where o.status = :status
```

e:

```java
.setParameter(
        "status",
        "ABERTA"
)
```

Benefícios:

- evita concatenação;
- melhora legibilidade;
- separa estrutura e valor;
- reduz risco de injeção;
- facilita reuso.

Não concatene entrada do usuário na JPQL.

---

### TypedQuery

Crie consulta tipada:

```java
TypedQuery<OrdemServicoEntity> query =
        entityManager.createQuery(
                jpql,
                OrdemServicoEntity.class
        );
```

Benefícios:

- retorno tipado;
- menos cast;
- falha mais clara;
- melhor manutenção.

---

### Join comum

Exemplo:

```java
select o
from OrdemServico o
join o.cliente c
where c.ativo = true
```

O join permite:

- filtrar;
- ordenar;
- relacionar;
- aplicar condições.

Ele não declara que `o.cliente` deve ficar carregado no resultado.

Depois da consulta, acessar:

```java
o.getCliente().getNome()
```

ainda pode inicializar a associação.

---

### Join fetch

Exemplo:

```java
select o
from OrdemServico o
join fetch o.cliente
where o.status = :status
```

O fetch join solicita que a associação seja carregada como efeito da consulta.

Depois:

```java
isLoaded(
        ordem,
        "cliente"
)
```

deve retornar true.

Acessar o nome não deve provocar outro SELECT.

---

### Fetch join nao muda o mapping

A associação continua declarada:

```java
fetch = FetchType.LAZY
```

O join fetch substitui o plano para aquela consulta.

Outro caso de uso que busca Ordem sem join fetch continuará lazy.

Isso preserva flexibilidade.

---

### Inner join fetch

`join fetch` sem qualificador representa inner join.

Se a associação pudesse ser nula, raízes sem associação seriam excluídas.

No laboratório, Ordem–Cliente é obrigatória.

Portanto:

```java
join fetch o.cliente
```

é coerente.

---

### Left join fetch

Para coleções, use:

```java
select distinct c
from Cliente c
left join fetch c.ordens
```

`left` preserva Clientes sem Ordens.

Se fosse usado inner join:

```text
Cliente sem Ordem:
não apareceria.
```

O cenário inclui um Cliente vazio para comprovar a diferença.

---

### Fetch join em ManyToOne

Uma associação to-one não multiplica a raiz por possuir apenas um alvo.

Consulta:

```java
select o
from OrdemServico o
join fetch o.cliente
order by o.id
```

Para cinco Ordens:

```text
cinco raízes;

cinco Clientes relacionados;

um SELECT.
```

Mesmo que dois Clientes sejam iguais, o persistence context preserva identidade.

---

### Fetch join em OneToMany

Uma coleção multiplica linhas SQL.

Exemplo:

```text
Cliente A:
duas Ordens.

Cliente B:
uma Ordem.

Cliente C:
zero Ordens.
```

O join pode produzir linhas:

```text
A | Ordem 1;

A | Ordem 2;

B | Ordem 3;

C | null.
```

A raiz Cliente A aparece em duas linhas SQL.

---

### Distinct

Use:

```java
select distinct c
from Cliente c
left join fetch c.ordens
```

O objetivo é retornar Clientes únicos no resultado da consulta.

A coleção continua contendo todas as Ordens.

No Hibernate, a identidade do persistence context também ajuda a reutilizar a mesma instância.

Mesmo assim, `distinct` comunica corretamente a intenção e evita duplicidade no resultado JPQL.

---

### Distinct JPQL e SQL

`distinct` pode ser propagado para o SQL e também influenciar a eliminação de duplicidade de entidades no provider.

Não presuma que o custo é sempre zero.

Meça:

- plano;
- linhas;
- ordenação;
- volume;
- resultado.

No laboratório pequeno, o foco é semântico.

---

### Order by com collection fetch

Você pode ordenar as raízes:

```java
order by c.id
```

A ordem dos elementos da coleção deve ser definida pelo mapping:

```java
@OrderBy("id ASC")
```

Não use a ordenação da raiz como substituto da ordenação da coleção.

---

### Fetch join e alias portavel

A sintaxe padrão de fetch join não define uma variável de identificação para a associação fetched.

Use:

```java
join fetch o.cliente
```

Evite depender de extensões como:

```java
join fetch o.cliente c
```

em JPQL portável.

Quando precisa filtrar pela associação, use um join normal apropriado ou navegação no `where`, mantendo a intenção clara.

---

### Filtrar colecao fetched

Evite usar uma coleção parcialmente carregada como se fosse o conjunto completo da entidade.

Exemplo conceitualmente perigoso:

```text
buscar Cliente;
fetch apenas Ordens ABERTAS;
tratar cliente.ordens como todas as Ordens.
```

Isso mistura:

- estado completo da associação;
- recorte de relatório.

Para recortes, considere consulta específica, projection ou outro modelo de resultado.

Projections serão estudadas na aula 340.

---

### N+1 corrigido em to-one

Antes:

```text
1 SELECT de Ordens;

N SELECTs de Clientes.
```

Depois:

```text
1 SELECT com join;

zero SELECT posterior.
```

O orçamento pode mudar de:

```text
máximo 2:
falhava com 6.
```

para:

```text
máximo 1:
passa.
```

---

### N+1 corrigido em colecao

Antes:

```text
1 SELECT de Clientes;

N SELECTs de Ordens.
```

Depois:

```text
1 SELECT com left join fetch;

zero SELECT posterior.
```

As coleções devem estar loaded antes do loop.

---

### Uma consulta nao e sempre melhor

Join fetch pode carregar muitos dados.

Uma coleção grande produz:

- muitas linhas SQL;
- repetição de colunas da raiz;
- mais memória;
- maior payload;
- materialização mais cara.

A correção precisa ser proporcional ao caso de uso.

---

### Paginacao com collection fetch

Aplicar:

```java
setFirstResult(...);

setMaxResults(...);
```

em consulta com fetch join de coleção é problemático.

O banco pagina linhas do join, não raízes completas.

O provider pode:

- paginar em memória;
- emitir warning;
- falhar conforme configuração;
- produzir resultado inesperado.

O laboratório não usará collection fetch join como estratégia direta de paginação.

---

### Paginacao to-one

Fetch join de `ManyToOne` normalmente não multiplica linhas por coleção.

Por isso, paginação de raízes com to-one fetch é mais previsível.

Mesmo assim, teste SQL e contagem.

---

### Estrategia em duas consultas

Para paginar raiz com coleção, uma estratégia futura possível é:

1. buscar IDs paginados;
2. buscar raízes e coleção pelos IDs;
3. reconstruir ordem do resultado.

Essa abordagem não será implementada nesta aula.

O objetivo é reconhecer o limite.

---

### Multiplas colecoes

Buscar duas coleções no mesmo fetch join pode provocar:

- produto cartesiano;
- explosão de linhas;
- duplicidades;
- exceções específicas do provider para múltiplas bags;
- grande consumo de memória.

Não escreva:

```text
fetch Ordens;

fetch Atividades;

fetch Pagamentos;
```

sem analisar cardinalidade.

---

### Fetch join nao altera cascade

Carregar Cliente com Ordem não significa:

- persistir Cliente em cascade;
- remover Cliente em cascade;
- mesclar Cliente automaticamente por qualquer regra.

Fetch e cascade são preocupações independentes.

---

### Fetch join e persistence context

As entidades retornadas ficam managed.

Se o mesmo Cliente aparece em várias Ordens:

```text
mesma classe;

mesmo ID;

mesma instância no contexto.
```

A identidade estudada na aula 329 continua valendo.

---

### Join fetch e count

Uma consulta de contagem não deve conter fetch join de coleção.

Para contar raízes:

```java
select count(c)
from Cliente c
```

Para filtrar por associação, use join normal conforme necessário.

Fetch join existe para carregar grafo no resultado de entidades.

---

### Teste robusto

O teste deve afirmar:

- quantidade de raízes;
- quantidade das coleções;
- associação loaded;
- número máximo de SELECTs;
- zero SELECT depois do acesso;
- presença de Clientes sem filhos quando left join for usado.

Não compare o SQL integral.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\java\br\com\formacao\m13\aula338\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\java\br\com\formacao\m13\aula338\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\java\br\com\formacao\m13\aula338\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\java\br\com\formacao\m13\aula338\query"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\java\br\com\formacao\m13\aula338\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-338-jpql-select-join-fetch\src\test\java\br\com\formacao\m13\aula338"

Set-Location `
  "labs\m13\aula-338-jpql-select-join-fetch"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 337.

Ajuste:

```text
artifactId:
aula-338-jpql-select-join-fetch.

persistence unit:
aula338PU.

Main:
br.com.formacao.m13.aula338.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_338
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-338-jpa
JPA_POOL_NAME=aula-338-pool
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
338001.

ordem:
338101.

atividade:
338201.
```

Mantenha:

- foreign keys;
- índices;
- `NOT NULL`;
- versões;
- sem delete cascade físico.

---

### 4. Reutilizar mappings

`ClienteEntity`:

```java
@OneToMany(
        mappedBy = "cliente",
        fetch = FetchType.LAZY
)
@OrderBy("id ASC")
private List<OrdemServicoEntity> ordens =
        new ArrayList<>();
```

`OrdemServicoEntity`:

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

e:

```java
@OneToMany(
        mappedBy = "ordemServico",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
)
private List<AtividadeEntity> atividades =
        new ArrayList<>();
```

Não mude as associações para EAGER.

---

### 5. Criar JpaQueryRepository.java

```java
package br.com.formacao.m13.aula338.query;

import java.util.List;

import br.com.formacao.m13.aula338.entity.ClienteEntity;
import br.com.formacao.m13.aula338.entity.OrdemServicoEntity;
import jakarta.persistence.EntityManager;

public final class JpaQueryRepository {

    private final EntityManager entityManager;

    public JpaQueryRepository(
            EntityManager entityManager
    ) {
        this.entityManager = entityManager;
    }

    public List<OrdemServicoEntity> findOrdersSimple(
            String prefix
    ) {
        return entityManager.createQuery(
                """
                select o
                from OrdemServico o
                where o.codigo like :prefix
                order by o.id
                """,
                OrdemServicoEntity.class
        )
                .setParameter(
                        "prefix",
                        prefix
                )
                .getResultList();
    }

    public List<OrdemServicoEntity> findOrdersWithActiveClientUsingJoin(
            String prefix
    ) {
        return entityManager.createQuery(
                """
                select o
                from OrdemServico o
                join o.cliente c
                where o.codigo like :prefix
                  and c.ativo = true
                order by o.id
                """,
                OrdemServicoEntity.class
        )
                .setParameter(
                        "prefix",
                        prefix
                )
                .getResultList();
    }

    public List<OrdemServicoEntity> findOrdersWithClient(
            String prefix
    ) {
        return entityManager.createQuery(
                """
                select o
                from OrdemServico o
                join fetch o.cliente
                where o.codigo like :prefix
                order by o.id
                """,
                OrdemServicoEntity.class
        )
                .setParameter(
                        "prefix",
                        prefix
                )
                .getResultList();
    }

    public List<ClienteEntity> findClientsWithOrders(
            String prefix
    ) {
        return entityManager.createQuery(
                """
                select distinct c
                from Cliente c
                left join fetch c.ordens
                where c.codigo like :prefix
                order by c.id
                """,
                ClienteEntity.class
        )
                .setParameter(
                        "prefix",
                        prefix
                )
                .getResultList();
    }
}
```

O repository não abre nem fecha transação.

O chamador controla a unidade de trabalho.

---

### 6. Criar QueryBudget.java

Reutilize a classe da aula 337.

Orçamentos:

```text
orders simple:
máximo 1.

orders with client fetch:
máximo 1.

clients with orders fetch:
máximo 1.
```

---

### 7. Criar JoinFetchObservation.java

```java
package br.com.formacao.m13.aula338.lab;

public record JoinFetchObservation(
        String scenario,
        int rootCount,
        int relatedCount,
        boolean associationLoaded,
        long selectsBeforeAccess,
        long selectsAfterAccess,
        boolean budgetSatisfied
) {

    public JoinFetchObservation {
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

### 8. Criar JoinFetchReport.java

```java
package br.com.formacao.m13.aula338.lab;

import java.util.List;

public record JoinFetchReport(
        List<JoinFetchObservation> observations,
        boolean simpleQueryKeptLazy,
        boolean normalJoinDidNotGuaranteeLoaded,
        boolean manyToOneFetchRemovedNPlusOne,
        boolean oneToManyFetchRemovedNPlusOne,
        boolean leftJoinPreservedEmptyClient,
        boolean distinctReturnedUniqueRoots,
        boolean budgetsPassed,
        boolean paginationLimitationWasDocumented
) {

    public JoinFetchReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar fixtures

Crie cinco Clientes:

```text
CLI-JPA-338-01;
CLI-JPA-338-02;
CLI-JPA-338-03;
CLI-JPA-338-04;
CLI-JPA-338-EMPTY.
```

Distribua Ordens:

```text
Cliente 01:
duas Ordens.

Cliente 02:
uma Ordem.

Cliente 03:
duas Ordens.

Cliente 04:
uma Ordem.

Cliente EMPTY:
zero Ordens.
```

Códigos:

```text
OS-JPA-338-001;
...
OS-JPA-338-006.
```

Adicione duas Atividades em uma Ordem somente para manter o grafo realista.

As Atividades não serão fetched nesta aula.

---

### 10. Cenário JPQL simples

Abra manager.

Limpe inspector.

Execute:

```java
findOrdersSimple(
        "OS-JPA-338-%"
)
```

Confirme:

```text
seis Ordens;

um SELECT;

Cliente não loaded.
```

Não acesse o Cliente antes da medição.

---

### 11. Cenário join sem fetch

Abra novo manager.

Execute:

```java
findOrdersWithActiveClientUsingJoin(
        "OS-JPA-338-%"
)
```

Confirme que o join filtrou pelo Cliente ativo.

Verifique:

```text
o.cliente não é garantidamente loaded.
```

Depois acesse os nomes.

Observe SELECTs adicionais quando a associação estiver lazy.

Esse cenário prova:

```text
join não é join fetch.
```

---

### 12. Cenário ManyToOne join fetch

Abra novo manager.

Limpe inspector.

Execute:

```java
findOrdersWithClient(
        "OS-JPA-338-%"
)
```

Confirme:

```text
seis Ordens;

um SELECT;

Cliente loaded em todas.
```

Guarde a contagem.

Depois consuma:

```java
ordens.stream()
        .map(
                ordem ->
                        ordem.getCliente()
                                .getNome()
        )
        .toList();
```

Confirme:

```text
zero SELECT adicional;

orçamento máximo 1 atendido.
```

---

### 13. Cenário OneToMany left join fetch

Abra novo manager.

Limpe inspector.

Execute:

```java
findClientsWithOrders(
        "CLI-JPA-338-%"
)
```

Confirme:

```text
cinco Clientes únicos;

Cliente EMPTY presente;

coleções loaded;

total de seis Ordens;

um SELECT.
```

Depois itere pelas coleções.

Confirme zero SELECT adicional.

---

### 14. Provar distinct

Crie uma consulta experimental sem `distinct`:

```java
select c
from Cliente c
left join fetch c.ordens
where c.codigo like :prefix
order by c.id
```

Registre:

- quantidade de linhas SQL conceitual;
- quantidade da lista retornada pelo provider;
- identidade das raízes;
- diferença semântica.

O contrato oficial continuará usando `distinct`.

O teste não deve depender de uma duplicação específica do Hibernate quando o provider elimina raízes por identidade.

Ele deve afirmar que a junção SQL multiplica linhas e que `distinct` expressa a lista de raízes únicas.

---

### 15. Provar left versus inner

Execute consulta com:

```java
join fetch c.ordens
```

Confirme que:

```text
Cliente EMPTY não aparece.
```

Execute com:

```java
left join fetch c.ordens
```

Confirme que:

```text
Cliente EMPTY aparece;
coleção está vazia e loaded.
```

---

### 16. Comparar orçamento antes e depois

Registre no relatório:

```text
aula 337:
1 + N para Ordens e Clientes.

aula 338:
1 SELECT com join fetch.
```

Use:

```java
new QueryBudget(
        "listar ordens com clientes",
        1
)
```

O orçamento deve passar.

Para Clientes e Ordens:

```java
new QueryBudget(
        "listar clientes com ordens",
        1
)
```

Também deve passar.

---

### 17. Demonstrar limite de paginacao

Crie teste isolado:

```java
entityManager.createQuery(
        """
        select distinct c
        from Cliente c
        left join fetch c.ordens
        order by c.id
        """,
        ClienteEntity.class
)
        .setFirstResult(0)
        .setMaxResults(2)
        .getResultList();
```

Não adote o resultado como implementação profissional.

Registre:

- warning do provider, quando houver;
- risco de paginação em memória;
- multiplicação das linhas;
- necessidade de estratégia em duas etapas.

O teste deve passar como documentação do risco, não como solução.

---

### 18. Nao buscar duas colecoes

Não crie uma consulta fetching:

```text
Cliente.ordens;

Ordem.atividades.
```

na mesma JPQL principal.

Documente o risco de:

- produto cartesiano;
- explosão de linhas;
- múltiplas bags;
- memória;
- paginação impossível.

Atividades permanecem lazy.

---

### 19. Limpeza final

Remova:

1. Atividades;
2. Ordens;
3. Clientes.

Commit.

Confirme zero fixtures.

---

### 20. Criar Main.java

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
cenário | raízes | relacionados | loaded | SELECT antes | SELECT depois | budget
```

---

### 21. Criar JpqlFundamentalsIT.java

Casos:

#### Select

- consulta tipada;
- alias;
- order by;
- quantidade correta.

#### Parâmetro nomeado

- filtrar por prefixo;
- filtrar por status;
- confirmar resultado.

#### Nome da entidade

- usar `OrdemServico`;
- demonstrar que nome de tabela não é JPQL.

#### Entrada concatenada

Não implemente consulta insegura.

Teste somente o uso de parâmetros.

---

### 22. Criar JoinVersusJoinFetchIT.java

#### Join normal

- filtrar por Cliente;
- confirmar resultado;
- verificar associação não garantidamente loaded;
- acessar;
- observar consulta adicional.

#### Join fetch

- mesma seleção;
- associação loaded;
- zero SELECT posterior.

O teste deve isolar os managers.

---

### 23. Criar ManyToOneJoinFetchIT.java

Casos:

#### Correção

- seis Ordens;
- um SELECT;
- seis Clientes acessíveis;
- zero SELECT adicional.

#### Identidade compartilhada

- duas Ordens do mesmo Cliente;
- mesma instância managed.

#### Mapping continua lazy

Use reflection para confirmar que o mapping não mudou.

---

### 24. Criar OneToManyJoinFetchIT.java

Casos:

#### Left join

- cinco Clientes;
- Cliente vazio presente;
- coleções loaded;
- seis Ordens;
- um SELECT.

#### Inner join

- Cliente vazio ausente.

#### Distinct

- raízes únicas;
- coleções completas;
- ordem previsível.

#### Acesso posterior

- zero SELECT adicional.

---

### 25. Criar JoinFetchQueryBudgetIT.java

#### ManyToOne

Orçamento:

```text
máximo 1.
```

Deve passar.

#### OneToMany

Orçamento:

```text
máximo 1.
```

Deve passar.

#### Sem fetch

Execute cenário antigo com orçamento 1.

Espere falha.

Isso comprova que o teste detecta regressão.

---

### 26. Criar PaginationLimitationIT.java

Execute collection fetch com limite pequeno.

Registre:

```text
resultado;

warning;

SELECTs;

quantidade de linhas;
```

O teste deve documentar:

```text
collection fetch join não será usado
como paginação direta do projeto.
```

Não falhe por texto exato do warning.

---

### 27. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_338.atividade
WHERE codigo LIKE 'ATV-JPA-338-%';

DELETE FROM jpa_338.ordem_servico
WHERE codigo LIKE 'OS-JPA-338-%';

DELETE FROM jpa_338.cliente
WHERE codigo LIKE 'CLI-JPA-338-%';
```

Use antes e depois dos testes.

---

### 28. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_338.
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
zero CLI-JPA-338-%;

zero OS-JPA-338-%;

zero ATV-JPA-338-%;

foreign keys e índices existentes;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 29. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
JPQL simples manteve lazy;

join normal não garantiu loaded;

join fetch to-one:
um SELECT;

left join fetch coleção:
um SELECT;

Cliente vazio preservado;

distinct aplicado;

zero SELECT posterior;

budgets atendidos;

limite de paginação documentado;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 30. Criar documentacao

`fundamentos-jpql.md` deve registrar:

- entidade;
- alias;
- select;
- from;
- where;
- parâmetros;
- order by;
- TypedQuery.

`join-vs-join-fetch.md` deve comparar:

```text
objetivo;

loaded;

SQL posterior;

uso em filtro;

uso em carregamento.
```

`distinct-em-collection-fetch.md` deve explicar:

- multiplicação das linhas;
- raiz repetida no SQL;
- identidade do contexto;
- distinct JPQL;
- coleções completas;
- custo.

`limites-paginacao.md` deve registrar:

- linhas versus raízes;
- paginação em memória;
- warning;
- estratégia futura em duas consultas;
- diferença para fetch to-one.

`orcamento-antes-depois.md` deve mostrar:

```text
caso;

SELECT anterior;

SELECT atual;

limite;

resultado.
```

`troubleshooting-join-fetch.md` deve cobrir:

- nome de entidade incorreto;
- atributo incorreto;
- parâmetro ausente;
- join sem fetch;
- associação não loaded;
- raiz duplicada;
- Cliente vazio ausente;
- paginação;
- múltiplas coleções;
- SQL excessivo.

---

## Entendendo o que foi feito

### JPQL ficou orientada ao modelo

As consultas passaram a usar entidades e atributos Java.

### Join e join fetch foram separados

Um filtra e relaciona; o outro também carrega a associação.

### N+1 foi corrigido localmente

O mapping continuou lazy e a consulta detalhada solicitou os dados necessários.

### Distinct protegeu a lista de raizes

A multiplicação das linhas da coleção não virou duplicidade semântica.

### Limites foram mantidos visiveis

Collection fetch não foi tratado como solução automática para paginação ou múltiplas coleções.

---

## Erros comuns importantes

### Usar nome de tabela na JPQL

Use o nome da entidade.

### Achar que join carrega a associacao

Somente fetch join altera esse plano.

### Esquecer distinct em colecao

A raiz pode ser multiplicada pelas linhas.

### Usar inner join quando precisa de pais vazios

Use left join fetch.

### Paginar collection fetch diretamente

As linhas do join não equivalem às raízes.

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

### Conferir distribuicao

```sql
SELECT
    cliente.codigo,
    count(ordem.id) AS quantidade_ordens
FROM jpa_338.cliente AS cliente
LEFT JOIN jpa_338.ordem_servico AS ordem
    ON ordem.cliente_id = cliente.id
WHERE cliente.codigo LIKE 'CLI-JPA-338-%'
GROUP BY cliente.codigo
ORDER BY cliente.codigo;
```

---

## Exercicio guiado

### Parte 1 — Filtro por status

Adicione parâmetro:

```text
status.
```

Mantenha join fetch de Cliente.

Confirme orçamento de um SELECT.

### Parte 2 — Left join to-one

Em branch experimental, torne Cliente opcional.

Compare inner e left join fetch.

Restaure a associação obrigatória.

### Parte 3 — Sem distinct

Remova `distinct` da consulta de Clientes.

Registre o resultado do provider e as linhas SQL.

Restaure `distinct`.

### Parte 4 — Duas colecoes

Desenhe uma consulta que tentaria carregar Ordens e Atividades.

Não a adote.

Calcule a multiplicação de linhas para:

```text
3 Ordens;

4 Atividades por Ordem.
```

### Parte 5 — Paginação em duas etapas

Desenhe:

```text
query 1:
IDs paginados.

query 2:
raízes com fetch pelos IDs.
```

Não implemente antes da aula apropriada.

### Parte 6 — Query budget

Defina orçamento para:

- lista simples;
- lista com Cliente;
- Clientes com Ordens.

Faça o teste falhar removendo temporariamente o fetch.

### Parte 7 — Join sem fetch

Filtre por nome do Cliente usando join normal.

Confirme que a associação pode continuar lazy.

### Parte 8 — ADR

Registre:

```text
mappings LAZY;

fetch join por caso de uso;

distinct em collection fetch;

left join para preservar coleção vazia;

sem paginação direta com collection fetch;

sem múltiplas coleções no mesmo fetch.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 338 existe;
- continuidade com a aula 337 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_338` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- entidades da aula anterior foram reutilizadas;
- mappings permaneceram LAZY;
- JPQL foi definida;
- nome da entidade foi explicado;
- alias foi explicado;
- `select` foi usado;
- `from` foi usado;
- `where` foi usado;
- parâmetro nomeado foi usado;
- concatenação insegura não foi usada;
- `order by` foi usado;
- TypedQuery foi usada;
- join comum foi praticado;
- join comum foi diferenciado de fetch;
- join fetch foi praticado;
- ManyToOne join fetch foi executado;
- Cliente ficou loaded;
- acesso ao nome gerou zero SELECT adicional;
- N+1 to-one foi reduzido a um SELECT;
- OneToMany fetch foi executado;
- left join fetch foi usado;
- Cliente sem Ordem foi preservado;
- coleção ficou loaded;
- acesso à coleção gerou zero SELECT adicional;
- N+1 de coleção foi reduzido a um SELECT;
- inner join foi comparado;
- Cliente vazio ficou ausente no inner join;
- `distinct` foi aplicado;
- multiplicação de linhas foi explicada;
- raízes únicas foram confirmadas;
- identidade do contexto foi preservada;
- fetch join não mudou o mapping;
- fetch e cascade foram diferenciados;
- fetch join portável não usou alias da associação;
- coleção parcial foi desaconselhada;
- um SELECT grande também foi problematizado;
- paginação to-one foi diferenciada;
- paginação de collection fetch foi tratada como risco;
- warning não foi comparado por texto exato;
- estratégia em duas consultas foi citada sem implementação;
- múltiplas coleções foram desaconselhadas;
- count não usou fetch join;
- `StatementInspector` foi usado;
- parâmetros não foram registrados;
- QueryBudget foi reutilizado;
- orçamento ManyToOne passou;
- orçamento OneToMany passou;
- cenário sem fetch falhou no orçamento;
- testes de fundamentos foram criados;
- testes join versus fetch foram criados;
- testes ManyToOne foram criados;
- testes OneToMany foram criados;
- teste de budget foi criado;
- teste de paginação foi criado;
- fixtures foram removidas;
- estado final ficou vazio;
- Criteria API não foi antecipada;
- Specifications não foram antecipadas;
- projections não foram antecipadas;
- Spring não foi usado;
- ponte para a aula 339 está correta;
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
  labs/m13/aula-338-jpql-select-join-fetch
```

Commit recomendado:

```powershell
git commit -m "feat(m13): corrigir n mais um com jpql join fetch"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você usou JPQL para planejar o carregamento de associações.

Aprendeu:

```text
JPQL:
consulta entidades e atributos.

join:
relaciona e filtra.

join fetch:
relaciona e carrega.

left join fetch:
preserva raízes sem associação.

distinct:
retorna raízes únicas.

parâmetros:
separam estrutura e valor.

query budget:
protege o plano.
```

O laboratório comprovou:

```text
consulta simples:
mapping lazy preservado.

join normal:
não garantiu associação loaded.

join fetch ManyToOne:
um SELECT;
zero consulta posterior.

left join fetch OneToMany:
um SELECT;
Cliente vazio preservado;
coleções loaded.

distinct:
raízes únicas.

orçamento:
limites atendidos.
```

Também foram reconhecidos limites:

```text
collection fetch com paginação;

múltiplas coleções;

explosão de linhas;

coleção parcialmente filtrada;

um SELECT excessivamente grande.
```

A próxima aula será:

```text
339 - M13.29 - Criteria API e Specifications
```

Nela, você aprenderá:

- consultas tipadas programáticas;
- `CriteriaBuilder`;
- `CriteriaQuery`;
- `Root`;
- `Path`;
- `Predicate`;
- parâmetros;
- filtros opcionais;
- composição AND e OR;
- joins;
- ordenação;
- paginação;
- specification como contrato;
- composição de specifications;
- separação de regras de consulta;
- testes de filtros dinâmicos;
- limites de legibilidade;
- comparação com JPQL estática.

A aula 338 resolveu uma consulta conhecida com JPQL estática.

A aula 339 tratará consultas que precisam ser montadas dinamicamente com critérios controlados.

---

# Material complementar

## Checkpoint final

- [ ] Escrevi JPQL usando entidades e atributos.
- [ ] Diferenciei join de join fetch.
- [ ] Corrigi N+1 to-one e to-many.
- [ ] Usei left join e distinct conscientemente.
- [ ] Mantive limites de paginação e múltiplas coleções documentados.

---

## Troubleshooting adicional

### Could not resolve entity

Use o nome definido em `@Entity`.

### Could not resolve attribute

Use o nome do atributo Java, não da coluna.

### Association continua lazy

Confirme que a consulta contém `join fetch`.

### Cliente sem Ordem desapareceu

Troque inner join por left join fetch.

### Resultado ou SQL ficou enorme

Revise cardinalidade, coleções e volume carregado.

---

## Perguntas de revisao

1. O que JPQL consulta?
2. O que representa o alias?
3. Por que usar parâmetros?
4. O que faz join?
5. O que faz join fetch?
6. Join comum garante loaded?
7. Fetch join muda o mapping?
8. Quando usar inner join fetch?
9. Quando usar left join fetch?
10. Por que usar distinct?
11. Uma coleção multiplica linhas?
12. N+1 to-one pode virar quantos SELECTs?
13. N+1 de coleção pode virar quantos?
14. Fetch join sempre é melhor?
15. Pode paginar collection fetch diretamente?
16. Pode buscar várias coleções sem análise?
17. Fetch altera cascade?
18. Count deve usar fetch join?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Entidades e atributos.
2. Identifica a entidade na query.
3. Segurança e clareza.
4. Relaciona ou filtra.
5. Relaciona e carrega.
6. Não.
7. Não.
8. Quando a associação é obrigatória.
9. Quando deve preservar raízes vazias.
10. Para raízes únicas.
11. Sim.
12. Um em vez de 1 + N.
13. Um em vez de 1 + N.
14. Não.
15. Não como solução direta.
16. Não.
17. Não.
18. Não.
19. Não.
20. Criteria API e Specifications.

---

## Desafio opcional

Crie:

```java
JoinFetchContractVerifier
```

Entrada:

```text
nomeDoCaso;

quantidadeRaizes;

associacoesEsperadas;

selectsAntes;

selectsDepois;

loadedAntes;

loadedDepois;

budget.
```

Saída:

```text
PASS;

FAIL;

relatório Markdown.
```

Regras:

- não comparar SQL integral;
- não acessar associações antes da medição;
- falhar quando o budget for excedido;
- registrar risco de collection pagination;
- não depender de Spring;
- possuir testes unitários;
- não recomendar fetch de múltiplas coleções automaticamente.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 338 - M13.28 - JPQL select join fetch

- Aprofundei JPQL orientada a entidades.
- Usei nomes de entidades e atributos Java.
- Criei consultas tipadas.
- Usei aliases.
- Usei `select`, `from`, `where` e `order by`.
- Usei parâmetros nomeados.
- Evitei concatenação insegura.
- Diferenciei `join` de `join fetch`.
- Usei join normal para filtro.
- Confirmei que join normal não garante associação loaded.
- Usei `join fetch` em `ManyToOne`.
- Carreguei Ordens e Clientes em um SELECT.
- Eliminei SELECT posterior ao acessar Cliente.
- Mantive o mapping LAZY.
- Usei `left join fetch` em `OneToMany`.
- Preservei Cliente sem Ordens.
- Inicializei coleções em um SELECT.
- Usei `distinct` para raízes únicas.
- Entendi a multiplicação das linhas SQL.
- Diferenciei inner join de left join.
- Mantive fetch e cascade como decisões separadas.
- Evitei alias não portável em fetch join.
- Evitei coleção parcialmente carregada.
- Reconheci risco de um JOIN excessivo.
- Documentei limite de paginação com collection fetch.
- Documentei risco de múltiplas coleções.
- Reutilizei orçamento de queries.
- Fiz budgets de to-one e coleção passarem.
- Criei testes de regressão.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei Criteria API ou Specifications.
- Próxima aula: Criteria API e Specifications.
```

---

## Referencia tecnica curta

```text
JPQL:
entidades.

Alias:
referência na query.

Parameter:
valor seguro.

Join:
relaciona.

Join fetch:
carrega.

Left join fetch:
preserva vazio.

Distinct:
raízes únicas.

To-one fetch:
bom para consulta detalhada.

Collection fetch:
cuidado com linhas e paginação.

Budget:
proteção de regressão.
```

Regra final:

```text
join fetch deve ser aplicado por caso de uso sobre mappings normalmente lazy, com parametros, testes de carregamento e orcamento de consultas; em colecoes, distinct, cardinalidade, paginacao e multiplicacao de linhas precisam ser avaliados antes de considerar a consulta correta.
```
