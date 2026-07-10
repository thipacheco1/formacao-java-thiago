# 337 - M13.27 - Problema N mais um

## Apresentacao da aula

Na aula 336, você aprofundou:

```text
FetchType.LAZY;

FetchType.EAGER;

proxy;

coleção persistente;

PersistenceUnitUtil.isLoaded;

getReference;

LazyInitializationException.
```

O laboratório mostrou uma associação sendo inicializada.

Exemplo:

```text
find de Ordem:
um SELECT.

acesso ao Cliente lazy:
mais um SELECT.
```

Com uma única Ordem, o custo parece pequeno:

```text
1 + 1 = 2 consultas.
```

O problema surge quando o mesmo padrão é repetido em uma lista.

Considere:

```java
List<OrdemServicoEntity> ordens =
        entityManager.createQuery(
                """
                select o
                from OrdemServico o
                order by o.id
                """,
                OrdemServicoEntity.class
        )
                .getResultList();

for (
    OrdemServicoEntity ordem : ordens
) {
    System.out.println(
            ordem.getCliente()
                    .getNome()
    );
}
```

Se a consulta principal retornar cinco Ordens e cada acesso inicializar um Cliente separadamente, o fluxo pode executar:

```text
1 SELECT para buscar as Ordens;

5 SELECTs adicionais para buscar Clientes.
```

Total:

```text
6 SELECTs.
```

Esse padrão é chamado:

```text
problema N mais um;

N+1.
```

A expressão significa:

```text
1 consulta principal;

N consultas adicionais relacionadas
ao número de resultados acessados.
```

O problema também aparece em coleções.

Exemplo:

```java
List<ClienteEntity> clientes =
        buscarClientes();

for (
    ClienteEntity cliente : clientes
) {
    cliente.getOrdens()
            .size();
}
```

Com quatro Clientes:

```text
1 SELECT para Clientes;

4 SELECTs para as coleções de Ordens.
```

Total:

```text
5 SELECTs.
```

O N+1 não é apenas um problema de quantidade de SQL.

Ele afeta:

- latência total;
- round trips entre aplicação e banco;
- ocupação do pool;
- carga do banco;
- consumo de CPU;
- parsing de statements;
- logs;
- rastreamento;
- escalabilidade;
- previsibilidade;
- custo de uma tela ou endpoint;
- tempo de execução de jobs.

Nesta aula, você vai aprender a:

- reconhecer N+1;
- reproduzir de forma determinística;
- medir SQL;
- diferenciar `ManyToOne` e `OneToMany`;
- entender o papel de LAZY;
- entender por que EAGER não garante solução;
- medir statements e entidades carregadas;
- criar testes de regressão;
- distinguir N+1 de consultas legítimas;
- avaliar gravidade;
- definir orçamento de queries;
- preparar a correção correta;
- evitar otimização por palpite.

A aula não implementará a solução principal.

A próxima aula será:

```text
338 - M13.28 - JPQL select join fetch
```

Nela, você aprenderá a solicitar os dados necessários em uma consulta planejada.

Nesta aula, o foco será:

```text
diagnosticar antes de corrigir.
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
formacao_java_jpa_337
```

O schema será:

```text
jpa_337
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

AtividadeEntity;

SolicitacaoEagerEntity.
```

Os cenários serão:

```text
N+1 ManyToOne LAZY:
lista de Ordens;
acesso ao Cliente.

N+1 OneToMany LAZY:
lista de Clientes;
acesso às Ordens.

EAGER:
lista de Solicitações;
Cliente exigido como carregado;
estratégia do provider observada.

primeiro nível:
Ordens compartilhando Cliente
podem reduzir SELECTs adicionais.

sem acesso à associação:
somente consulta principal.

estado final:
zero fixtures.
```

Não serão antecipados:

- `join fetch`;
- entity graph;
- batch fetching;
- subselect fetching;
- DTO projection;
- Criteria API;
- Specifications;
- cache de segundo nível;
- Spring Data;
- solução definitiva de performance.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
335:
Cascade OrphanRemoval e responsabilidade.

336:
Fetch lazy eager e proxy.

337:
Problema N mais um.

338:
JPQL select join fetch.

339:
Criteria API e Specifications.
```

A aula 336 respondeu:

```text
quando uma associação pode ser inicializada?
```

Esta aula responderá:

```text
o que acontece quando essa inicialização
é repetida para cada item de uma lista?
```

A progressão é:

```text
fetch:
quando carregar?

N+1:
qual foi o custo real?

join fetch:
como planejar uma consulta específica?
```

Nesta aula:

```text
N+1 ManyToOne:
sim.

N+1 OneToMany:
sim.

EAGER:
comparado.

primeiro nível:
considerado.

StatementInspector:
sim.

Hibernate Statistics:
sim.

orçamento de SELECT:
sim.

teste de regressão:
sim.

join fetch:
não implementado.

Spring:
não.
```

A arquitetura de observação será:

```text
caso de uso
    -> consulta principal
        -> lista de entidades
            -> acesso às associações
                -> inicializações
                    -> SELECTs adicionais
                        -> contador e relatório.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-337-problema-n-mais-um
```

Estrutura final:

```text
labs
└── m13
    └── aula-337-problema-n-mais-um
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── modelo-custo-n-mais-um.md
        │   ├── matriz-cenarios.md
        │   ├── orcamento-de-queries.md
        │   ├── eager-nao-e-solucao.md
        │   └── troubleshooting-n-mais-um.md
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
            │   │                   └── aula337
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   ├── OrdemServicoEntity.java
            │   │                       │   └── SolicitacaoEagerEntity.java
            │   │                       ├── lab
            │   │                       │   ├── NPlusOneLab.java
            │   │                       │   ├── QueryBudget.java
            │   │                       │   ├── QueryObservation.java
            │   │                       │   └── NPlusOneReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_337.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula337
                                        ├── NPlusOneManyToOneIT.java
                                        ├── NPlusOneOneToManyIT.java
                                        ├── EagerDoesNotGuaranteeSingleQueryIT.java
                                        ├── QueryBudgetIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
lista sem navegar:
um SELECT.

cinco Ordens com cinco Clientes:
seis SELECTs.

cinco Ordens com um Cliente compartilhado:
dois SELECTs por causa do primeiro nível.

quatro Clientes acessando Ordens:
cinco SELECTs.

Solicitações EAGER:
associações carregadas;
quantidade de SELECTs depende da estratégia.

teste de orçamento:
falha quando o limite é ultrapassado.

estado final:
zero fixtures.
```

---

## Conceito essencial

### Definicao operacional

Um N+1 ocorre quando:

1. uma consulta principal retorna N resultados;
2. o código acessa uma associação para cada resultado;
3. o provider executa consultas adicionais proporcionais a N.

Modelo:

```text
total aproximado:
1 + N.
```

O número real pode ser menor ou maior por:

- primeiro nível de cache;
- entidades compartilhadas;
- associação já carregada;
- EAGER;
- batch fetching;
- consulta anterior;
- cache de segundo nível;
- estrutura do grafo.

Por isso, N+1 é um padrão de crescimento, não apenas uma contagem literal.

---

### N precisa crescer com o resultado

Considere:

```text
1 consulta principal;

2 consultas fixas de apoio.
```

Isso não é necessariamente N+1.

O sinal principal é:

```text
quanto mais resultados,
mais consultas relacionadas na mesma proporção.
```

Teste com diferentes quantidades de fixtures ajuda a confirmar.

---

### ManyToOne LAZY

Cenário:

```text
cada Ordem possui um Cliente;
Cliente é LAZY.
```

Consulta:

```java
select o
from OrdemServico o
order by o.id
```

A consulta retorna somente Ordens.

Ao iterar:

```java
ordem.getCliente()
        .getNome()
```

cada proxy não inicializado pode gerar SELECT.

Com clientes distintos:

```text
1 + quantidade de Ordens.
```

---

### Primeiro nivel reduz repeticoes

Considere cinco Ordens apontando para o mesmo Cliente.

Primeira Ordem:

```text
proxy inicializa Cliente;
um SELECT.
```

Demais Ordens:

```text
mesma identidade já está no persistence context;
instância pode ser reutilizada.
```

Resultado possível:

```text
1 SELECT de Ordens;

1 SELECT de Cliente.
```

Total:

```text
2.
```

Ainda houve carregamento não planejado, mas não um SELECT por Ordem.

O teste precisa escolher dados que exponham o problema.

---

### Dados de teste importam

Um teste com todas as Ordens no mesmo Cliente pode esconder N+1 de `ManyToOne`.

Para reproduzir de forma determinística:

```text
cinco Ordens;

cinco Clientes diferentes.
```

Para provar o efeito do primeiro nível:

```text
cinco Ordens;

um Cliente compartilhado.
```

Os dois cenários são importantes.

---

### OneToMany LAZY

Cenário:

```text
cada Cliente possui uma coleção lazy de Ordens.
```

Consulta principal:

```java
select c
from Cliente c
order by c.id
```

Loop:

```java
for (ClienteEntity cliente : clientes) {
    cliente.quantidadeOrdens();
}
```

Cada coleção é uma associação distinta.

Mesmo que algumas estejam vazias, o provider precisa consultar para descobrir o conteúdo.

Com quatro Clientes:

```text
1 SELECT de Clientes;

4 SELECTs de coleções.
```

---

### Colecao vazia tambem pode consultar

Uma coleção lazy vazia não é conhecida como vazia apenas pela ausência de dados no objeto.

Ao chamar:

```java
isEmpty();

size();

iterator();
```

o provider pode consultar o banco.

Por isso, Clientes sem Ordens também podem contribuir para N+1.

---

### EAGER nao garante solucao

Se `ManyToOne` for EAGER, o provider precisa disponibilizar a associação.

Ele pode usar:

```text
um join;

ou consultas secundárias.
```

Em uma consulta de lista, associações EAGER podem produzir múltiplos SELECTs.

Logo:

```text
trocar LAZY por EAGER
não é uma correção garantida.
```

Além disso, EAGER afeta todos os casos de uso, inclusive os que não precisam da associação.

---

### EAGER pode esconder o gatilho

Com LAZY, o acesso no loop revela claramente o momento da consulta.

Com EAGER, os SELECTs adicionais podem acontecer durante a materialização da lista.

O problema continua existindo, mas o gatilho fica menos visível no código.

Sempre conte statements da operação inteira.

---

### Um SELECT grande tambem pode ser ruim

Eliminar N+1 não significa que qualquer consulta única é boa.

Um join excessivo pode:

- duplicar linhas;
- carregar colunas desnecessárias;
- aumentar memória;
- produzir produto cartesiano;
- dificultar paginação;
- transportar muito dado.

A meta não é:

```text
sempre uma consulta.
```

A meta é:

```text
plano previsível e proporcional ao caso de uso.
```

---

### Custo de round trip

Cada SELECT adicional envolve:

- obtenção e uso da conexão;
- envio pela rede;
- parsing ou lookup do plano;
- execução;
- retorno de linhas;
- materialização;
- logs e métricas.

Mesmo queries rápidas isoladamente podem se tornar caras quando repetidas.

Exemplo conceitual:

```text
latência média por round trip:
4 ms.

101 consultas:
aproximadamente 404 ms
antes de considerar processamento.
```

Esse número é apenas modelo didático.

Meça no ambiente real.

---

### Impacto no pool

Uma unidade de trabalho normalmente usa uma conexão durante a transação.

N+1 não precisa abrir uma conexão nova para cada SELECT.

Mesmo assim, a conexão permanece ocupada por mais tempo.

Com muitas requisições:

- o tempo de retenção aumenta;
- a fila do pool cresce;
- timeouts ficam mais prováveis;
- throughput cai.

A consequência é sistêmica.

---

### Impacto no banco

Cem consultas pequenas podem consumir mais recursos administrativos que uma consulta planejada:

- execução repetida;
- locks curtos repetidos;
- buffers;
- métricas;
- auditoria;
- tráfego;
- CPU.

Não conclua que uma consulta grande sempre é melhor.

Compare planos e volume.

---

### StatementInspector

O laboratório reutilizará um `StatementInspector`.

Ele permitirá:

```text
capturar SQL;

normalizar;

contar SELECT;

identificar tabela principal;

identificar carregamentos relacionados;

verificar ordem.
```

Não serão registrados:

- parâmetros;
- documentos;
- nomes;
- dados sensíveis.

---

### Hibernate Statistics

Com:

```text
hibernate.generate_statistics=true
```

serão observados indicadores como:

```text
prepareStatementCount;

entityLoadCount;

collectionFetchCount;

collectionLoadCount.
```

O inspector responde:

```text
quais statements foram vistos?
```

As estatísticas respondem:

```text
quantas operações o Hibernate realizou?
```

Use ambos como evidências complementares.

---

### Query budget

Um orçamento de queries define um limite esperado para um caso de uso.

Exemplo:

```text
listar Ordens sem detalhes:
máximo 1 SELECT.

listar Ordens e nomes dos Clientes:
cenário atual N+1;
orçamento provisório demonstra falha.

listar Clientes e Ordens:
não deve crescer sem controle.
```

O orçamento precisa ser específico do caso.

Não crie uma regra global:

```text
toda operação deve ter um SELECT.
```

---

### Teste de regressao

Um teste de performance funcional pode:

1. preparar fixtures;
2. limpar estatísticas;
3. executar o caso de uso;
4. consumir exatamente os dados esperados;
5. contar SELECTs;
6. comparar com orçamento.

Esse teste não mede tempo de produção.

Ele detecta mudanças no padrão de acesso.

---

### Contagem precisa de escopo

Limpe o inspector depois da preparação de dados.

Caso contrário, a contagem incluirá:

- INSERTs;
- SELECTs de setup;
- validações;
- limpeza;
- sequência;
- teardown.

O escopo deve ser:

```text
somente a operação sob teste.
```

---

### Debugger e logs contaminam teste

A aula 336 mostrou que debugger e `toString` podem inicializar associações.

Durante medição de N+1:

- não expandir proxies;
- não logar entidades;
- não chamar getters extras;
- não usar assertions que percorram o grafo antes da contagem;
- não imprimir coleções.

O teste deve consumir apenas o que o caso de uso realmente precisa.

---

### N+1 em to-one

Sinais:

```text
SELECT ordem_servico ...;

SELECT cliente WHERE id = ?;

SELECT cliente WHERE id = ?;

SELECT cliente WHERE id = ?.
```

O SQL muda somente nos parâmetros.

Como bindings não são registrados, a repetição estrutural ainda pode ser detectada pelo statement normalizado.

---

### N+1 em colecao

Sinais:

```text
SELECT cliente ...;

SELECT ordem_servico WHERE cliente_id = ?;

SELECT ordem_servico WHERE cliente_id = ?;

SELECT ordem_servico WHERE cliente_id = ?.
```

A consulta de coleção se repete para cada pai.

---

### N+1 em niveis

Um grafo pode produzir:

```text
1 SELECT de Clientes;

N SELECTs de Ordens;

M SELECTs de Atividades por Ordem.
```

O crescimento pode ser pior que N+1 simples.

Nesta aula, cada cenário será isolado para manter o diagnóstico claro.

---

### N+1 pode ser aceitavel?

Em casos pequenos e comprovadamente limitados, consultas adicionais podem ser aceitáveis.

Exemplo:

```text
duas entidades;

operação rara;

dados opcionais;

simplicidade superior;

latência irrelevante.
```

Mas a aceitação deve ser explícita e medida.

Nunca ignore apenas porque os dados de desenvolvimento são poucos.

---

### Paginação nao resolve sozinha

Paginar reduz N por página.

Exemplo:

```text
20 itens:
1 + 20.
```

Ainda existe o padrão.

A paginação limita dano, mas não corrige o plano de carregamento.

A correção será planejada na aula 338.

---

### Cache pode esconder

O primeiro nível pode reduzir SELECTs dentro do mesmo contexto.

Cache de segundo nível poderia reduzir entre contextos.

Isso não torna o plano correto.

Testes devem usar:

```text
contexto novo;

shared cache desativado;

fixtures controladas.
```

O laboratório manterá:

```text
shared-cache-mode NONE.
```

---

### Criterio para corrigir

Antes de escolher uma solução, responda:

- quais dados o caso realmente precisa?
- a associação é to-one ou coleção?
- existe paginação?
- haverá várias coleções?
- o resultado será entidade ou DTO?
- qual volume esperado?
- quantos SELECTs ocorrem agora?
- qual orçamento é aceitável?
- o SQL único duplicará linhas?
- o carregamento precisa ser reutilizável?

A aula 338 começará pela solução `join fetch`.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\main\java\br\com\formacao\m13\aula337\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\main\java\br\com\formacao\m13\aula337\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\main\java\br\com\formacao\m13\aula337\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\main\java\br\com\formacao\m13\aula337\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-337-problema-n-mais-um\src\test\java\br\com\formacao\m13\aula337"

Set-Location `
  "labs\m13\aula-337-problema-n-mais-um"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 336.

Ajuste:

```text
artifactId:
aula-337-problema-n-mais-um.

persistence unit:
aula337PU.

Main:
br.com.formacao.m13.aula337.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_337
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-337-jpa
JPA_POOL_NAME=aula-337-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration

Crie tabelas equivalentes à aula 336:

```text
cliente;

ordem_servico;

atividade;

solicitacao_eager.
```

Use sequences iniciando em:

```text
337001;

337101;

337201;

337301.
```

Mantenha:

- foreign keys;
- índices;
- `NOT NULL`;
- versões;
- sem `ON DELETE CASCADE`.

---

### 4. Reutilizar entidades

Mantenha:

```text
Ordem -> Cliente:
ManyToOne LAZY.

Cliente -> Ordens:
OneToMany LAZY.

Ordem -> Atividades:
OneToMany LAZY.

Solicitação -> Cliente:
ManyToOne EAGER por padrão.
```

Para `Cliente.ordens`, use:

```java
@OneToMany(
        mappedBy = "cliente",
        fetch = FetchType.LAZY
)
private List<OrdemServicoEntity> ordens =
        new ArrayList<>();
```

Não adicione solução de fetch à annotation.

---

### 5. Evoluir SqlCaptureInspector

Adicione métodos:

```java
public long selectCount()

public long selectCountContaining(
        String fragment
)

public List<String> selects()

public void clear()
```

Normalize:

- espaços;
- caixa;
- comentários;
- quebras de linha.

Não remova nomes de tabela.

---

### 6. Criar QueryBudget.java

```java
package br.com.formacao.m13.aula337.lab;

public record QueryBudget(
        String operation,
        long maximumSelects
) {

    public QueryBudget {
        if (
            operation == null
            || operation.isBlank()
            || maximumSelects < 0
        ) {
            throw new IllegalArgumentException(
                    "Orçamento inválido"
            );
        }
    }

    public void verify(
            long actualSelects
    ) {
        if (actualSelects > maximumSelects) {
            throw new IllegalStateException(
                    "Orçamento excedido em "
                    + operation
                    + ": esperado no máximo "
                    + maximumSelects
                    + ", observado "
                    + actualSelects
            );
        }
    }
}
```

O orçamento não conhece JPA.

Ele é uma regra de teste.

---

### 7. Criar QueryObservation.java

```java
package br.com.formacao.m13.aula337.lab;

public record QueryObservation(
        String scenario,
        int rootCount,
        int relatedItemsConsumed,
        long totalSelects,
        long rootSelects,
        long relatedSelects,
        long preparedStatements,
        long entityLoads,
        long collectionFetches,
        boolean nPlusOneDetected
) {

    public QueryObservation {
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

### 8. Criar NPlusOneReport.java

```java
package br.com.formacao.m13.aula337.lab;

import java.util.List;

public record NPlusOneReport(
        List<QueryObservation> observations,
        boolean noTraversalUsedOneSelect,
        boolean distinctClientsProducedNPlusOne,
        boolean sharedClientUsedFirstLevelCache,
        boolean collectionsProducedNPlusOne,
        boolean eagerDidNotGuaranteeSingleSelect,
        boolean queryBudgetDetectedRegression
) {

    public NPlusOneReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar fixtures distintas

Crie cinco Clientes:

```text
CLI-JPA-337-D01;
CLI-JPA-337-D02;
CLI-JPA-337-D03;
CLI-JPA-337-D04;
CLI-JPA-337-D05.
```

Crie uma Ordem para cada:

```text
OS-JPA-337-D01;
...
OS-JPA-337-D05.
```

Esse conjunto reproduzirá N+1 de `ManyToOne`.

---

### 10. Criar fixtures compartilhadas

Crie:

```text
CLI-JPA-337-SHARED.
```

Associe cinco Ordens:

```text
OS-JPA-337-S01;
...
OS-JPA-337-S05.
```

Esse conjunto demonstrará o primeiro nível reduzindo inicializações repetidas.

---

### 11. Criar fixtures de colecao

Crie quatro Clientes:

```text
CLI-JPA-337-C01;
...
CLI-JPA-337-C04.
```

Distribua Ordens:

```text
C01:
duas.

C02:
uma.

C03:
zero.

C04:
três.
```

Ao acessar todas as coleções, cada Cliente deverá provocar uma consulta da coleção.

---

### 12. Criar fixtures EAGER

Crie cinco Solicitações:

```text
SOL-JPA-337-001;
...
SOL-JPA-337-005.
```

Cada uma aponta para um Cliente distinto.

A associação permanece EAGER por padrão.

O cenário observará o número real de SELECTs sem exigir um formato específico.

---

### 13. Cenário sem navegar

Abra novo manager.

Limpe inspector e estatísticas.

Execute:

```java
List<OrdemServicoEntity> ordens =
        entityManager.createQuery(
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
                        "OS-JPA-337-D%"
                )
                .getResultList();
```

Consuma somente:

```text
id;

codigo;

status.
```

Não acesse Cliente.

Confirme:

```text
cinco resultados;

um SELECT;

zero SELECT de Cliente.
```

---

### 14. Cenário ManyToOne com Clientes distintos

Abra novo manager.

Limpe medição.

Carregue as cinco Ordens distintas.

Itere:

```java
List<String> nomes =
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
cinco nomes;

um SELECT de Ordem;

cinco SELECTs de Cliente;

seis SELECTs totais.
```

Marque:

```text
nPlusOneDetected = true.
```

---

### 15. Cenário com Cliente compartilhado

Abra novo manager.

Carregue as cinco Ordens do Cliente compartilhado.

Acesse o nome em todas.

Confirme:

```text
um SELECT de Ordens;

um SELECT do Cliente;

dois SELECTs totais.
```

Explique no relatório:

```text
o primeiro nível reutilizou a mesma identidade;
os dados de teste podem esconder N+1.
```

---

### 16. Cenário OneToMany

Abra novo manager.

Carregue os quatro Clientes `C01` a `C04`.

Itere:

```java
int totalOrdens =
        clientes.stream()
                .mapToInt(
                        ClienteEntity::quantidadeOrdens
                )
                .sum();
```

Confirme:

```text
um SELECT de Clientes;

quatro SELECTs de coleções;

cinco SELECTs totais;

Cliente sem Ordem também consultado.
```

---

### 17. Cenário EAGER

Abra novo manager.

Limpe medição.

Carregue as cinco Solicitações EAGER.

Sem chamar explicitamente o getter antes da materialização, verifique depois:

```text
Cliente loaded em todas.
```

Registre:

```text
total de SELECTs real;

SELECTs de Solicitação;

SELECTs de Cliente.
```

A assertiva principal será:

```text
EAGER não garante exatamente um SELECT.
```

Não force que o Hibernate execute N+1 em toda versão.

Apenas documente a estratégia observada.

---

### 18. Medir estatisticas

Antes de cada cenário:

```java
Statistics statistics =
        sessionFactory
                .getStatistics();

statistics.clear();
inspector.clear();
```

Depois registre:

```java
statistics.getPrepareStatementCount();

statistics.getEntityLoadCount();

statistics.getCollectionFetchCount();
```

Não compare todos os números de forma rígida entre versões.

Use a contagem de SELECT do inspector como contrato principal do laboratório.

---

### 19. Criar orçamento

Para o cenário sem navegar:

```java
new QueryBudget(
        "listar ordens sem detalhes",
        1
);
```

Esse orçamento deve passar.

Para o cenário ManyToOne atual, crie deliberadamente:

```java
new QueryBudget(
        "listar ordens com clientes",
        2
);
```

Execute sobre o cenário N+1 e capture a falha.

O relatório deve marcar:

```text
queryBudgetDetectedRegression = true.
```

O orçamento será atendido somente depois da correção da aula 338.

---

### 20. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. prepara fixtures;
4. executa cenários;
5. imprime relatório;
6. remove fixtures;
7. não imprime entidades;
8. não imprime SQL completo;
9. fecha runtime.

Formato:

```text
cenário | raízes | relacionados | SELECTs | root | related | N+1
```

---

### 21. Criar NPlusOneManyToOneIT.java

Casos:

#### Sem acesso

- carregar cinco Ordens;
- não navegar;
- confirmar um SELECT.

#### Clientes distintos

- carregar cinco Ordens;
- acessar cinco Clientes;
- confirmar seis SELECTs.

#### Cliente compartilhado

- carregar cinco Ordens;
- acessar Cliente;
- confirmar dois SELECTs.

#### Crescimento

Prepare:

```text
1 Ordem distinta:
2 SELECTs.

3 Ordens distintas:
4 SELECTs.

5 Ordens distintas:
6 SELECTs.
```

Confirme crescimento:

```text
1 + N.
```

---

### 22. Criar NPlusOneOneToManyIT.java

Casos:

#### Sem acessar coleções

- carregar quatro Clientes;
- confirmar um SELECT.

#### Acessar coleções

- acessar todas;
- confirmar cinco SELECTs.

#### Coleção vazia

- incluir Cliente sem Ordem;
- confirmar consulta da coleção.

#### Segundo acesso

- acessar cada coleção novamente;
- confirmar zero SELECT adicional no mesmo contexto.

---

### 23. Criar EagerDoesNotGuaranteeSingleQueryIT.java

Casos:

#### Associação loaded

- carregar Solicitações;
- confirmar Cliente loaded.

#### Estratégia

- registrar SQL;
- não exigir join;
- aceitar consulta secundária;
- afirmar apenas que EAGER não define o formato.

#### Comparação

Compare quantidade total com o cenário LAZY sem navegar.

Documente o custo de carregar dados não usados.

---

### 24. Criar QueryBudgetIT.java

#### Orçamento atendido

- operação sem navegação;
- máximo 1;
- passa.

#### Orçamento excedido

- operação ManyToOne N+1;
- máximo 2;
- espera `IllegalStateException`.

#### Mensagem

Confirme que a mensagem contém:

- operação;
- máximo;
- observado.

Não inclua SQL nem parâmetros.

---

### 25. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_337.solicitacao_eager
WHERE codigo LIKE 'SOL-JPA-337-%';

DELETE FROM jpa_337.atividade
WHERE codigo LIKE 'ATV-JPA-337-%';

DELETE FROM jpa_337.ordem_servico
WHERE codigo LIKE 'OS-JPA-337-%';

DELETE FROM jpa_337.cliente
WHERE codigo LIKE 'CLI-JPA-337-%';
```

Use antes e depois dos testes.

---

### 26. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_337.
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
zero CLI-JPA-337-%;

zero OS-JPA-337-%;

zero ATV-JPA-337-%;

zero SOL-JPA-337-%;

foreign keys e índices existentes;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 27. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
lista sem navegação:
um SELECT.

ManyToOne distinto:
seis SELECTs.

Cliente compartilhado:
dois SELECTs.

OneToMany:
cinco SELECTs.

EAGER:
associações loaded;
estratégia registrada.

orçamento:
regressão detectada.

estado final:
limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 28. Criar documentacao

`modelo-custo-n-mais-um.md` deve registrar:

```text
total = 1 + N;

latência aproximada;

round trips;

ocupação de conexão;

limitações do modelo.
```

`matriz-cenarios.md`:

```text
Cenário | Raízes | Acesso | SELECT esperado | Observado
```

`orcamento-de-queries.md` deve explicar:

- escopo;
- limite;
- fixture;
- contador;
- estabilidade;
- quando atualizar orçamento;
- proibição de mascarar regressão aumentando limite sem análise.

`eager-nao-e-solucao.md` deve registrar:

- contrato EAGER;
- ausência de garantia de join;
- carregamento desnecessário;
- consultas secundárias;
- comparação com LAZY.

`troubleshooting-n-mais-um.md` deve cobrir:

- teste não reproduz;
- cache escondendo;
- Cliente compartilhado;
- debugger;
- log;
- setup contado;
- query extra legítima;
- EAGER;
- SQL diferente por versão;
- orçamento frágil.

---

## Entendendo o que foi feito

### O problema foi medido

N+1 deixou de ser uma suspeita baseada em logs visuais.

### ManyToOne e OneToMany foram isolados

Cada cardinalidade mostrou seu padrão de consultas adicionais.

### O primeiro nivel foi considerado

Entidades compartilhadas reduziram SELECTs e mostraram por que fixtures importam.

### EAGER perdeu o papel de solucao magica

A associação ficou carregada, mas o formato de SQL continuou sendo decisão do provider.

### Um orçamento passou a proteger o caso de uso

O teste registrou o limite esperado e falhou diante do crescimento.

---

## Erros comuns importantes

### Diagnosticar com poucos dados

Uma única entidade não revela crescimento.

### Usar todas as Ordens no mesmo Cliente

O primeiro nível pode esconder o problema.

### Trocar tudo para EAGER

O custo passa a existir até quando os dados não são necessários.

### Contar setup e teardown

Limpe o inspector antes da operação.

### Aumentar orçamento para o teste passar

Corrija ou justifique o plano.

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
FROM jpa_337.cliente AS cliente
LEFT JOIN jpa_337.ordem_servico AS ordem
    ON ordem.cliente_id = cliente.id
WHERE cliente.codigo LIKE 'CLI-JPA-337-%'
GROUP BY cliente.codigo
ORDER BY cliente.codigo;
```

---

## Exercicio guiado

### Parte 1 — Crescimento

Execute cenários com:

```text
1;

5;

10;

20 Ordens.
```

Registre a fórmula observada.

Não use tempo como única evidência.

### Parte 2 — Cliente compartilhado

Repita com todas as Ordens no mesmo Cliente.

Explique a diferença provocada pelo primeiro nível.

### Parte 3 — Contexto novo

Execute o mesmo caso em dois EntityManagers diferentes.

Confirme que o primeiro nível não é compartilhado.

### Parte 4 — EAGER

Troque temporariamente o ManyToOne da Ordem para EAGER.

Compare:

- SELECTs;
- loaded;
- dados usados;
- dados desperdiçados.

Restaure LAZY.

### Parte 5 — Logger

Adicione temporariamente um log com `toString` inseguro.

Observe se a contagem muda.

Restaure o código seguro.

### Parte 6 — Paginação

Limite a lista a dez itens.

Confirme:

```text
1 + 10.
```

Explique por que paginação limita, mas não corrige.

### Parte 7 — Orçamento

Crie orçamentos para:

- lista simples;
- lista com Cliente;
- lista de Clientes com contagem de Ordens.

Não aumente limites sem ADR.

### Parte 8 — Relatorio

Exporte:

```text
cenário;

N;

SELECTs;

fórmula;

gravidade;

correção candidata;

aula responsável.
```

Para a correção candidata, registre apenas:

```text
JPQL join fetch na aula 338.
```

Não implemente ainda.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 337 existe;
- continuidade com a aula 336 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_337` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- entidades da aula anterior foram reutilizadas;
- Cliente recebeu coleção de Ordens;
- N+1 foi definido;
- fórmula 1 + N foi explicada;
- crescimento proporcional foi explicado;
- ManyToOne LAZY foi testado;
- cinco Ordens distintas foram criadas;
- cinco Clientes distintos foram criados;
- seis SELECTs foram observados;
- cenário sem navegação gerou um SELECT;
- Cliente compartilhado foi testado;
- primeiro nível reduziu SELECTs;
- fixtures capazes de esconder N+1 foram discutidas;
- OneToMany LAZY foi testado;
- quatro coleções foram acessadas;
- cinco SELECTs foram observados;
- coleção vazia participou da medição;
- segundo acesso não repetiu SELECT;
- EAGER foi testado;
- associação EAGER apareceu loaded;
- EAGER não foi tratado como garantia de join;
- EAGER não foi adotado como solução;
- round trip foi explicado;
- impacto no pool foi explicado;
- impacto no banco foi explicado;
- um SELECT grande também foi problematizado;
- `StatementInspector` foi usado;
- SQL foi normalizado;
- parâmetros não foram registrados;
- Hibernate Statistics foi usado;
- prepare statement count foi registrado;
- entity load count foi registrado;
- collection fetch count foi registrado;
- escopo da medição foi isolado;
- setup e teardown não contam;
- debugger e logs foram controlados;
- `QueryBudget` foi criado;
- orçamento válido passou;
- orçamento excedido falhou;
- mensagem de regressão foi validada;
- teste de crescimento foi criado;
- cache de segundo nível ficou desativado;
- paginação foi diferenciada de correção;
- possibilidade de aceitar custo pequeno foi discutida;
- critério para correção foi documentado;
- join fetch não foi implementado;
- entity graph não foi antecipado;
- batch fetching não foi antecipado;
- DTO projection não foi antecipada;
- testes ManyToOne foram criados;
- testes OneToMany foram criados;
- teste EAGER foi criado;
- teste de orçamento foi criado;
- fixtures foram removidas;
- estado final ficou vazio;
- Spring não foi usado;
- ponte para a aula 338 está correta;
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
  labs/m13/aula-337-problema-n-mais-um
```

Commit recomendado:

```powershell
git commit -m "test(m13): detectar problema n mais um"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou o N+1 em um comportamento mensurável.

Aprendeu:

```text
1:
consulta principal.

N:
consultas adicionais proporcionais
aos resultados ou coleções.

ManyToOne:
um SELECT por entidade associada distinta.

OneToMany:
um SELECT por coleção acessada.

primeiro nível:
pode reduzir repetições.

EAGER:
não garante consulta única.

query budget:
protege o caso de uso.
```

O laboratório comprovou:

```text
cinco Ordens sem navegação:
um SELECT.

cinco Ordens com Clientes distintos:
seis SELECTs.

cinco Ordens com Cliente compartilhado:
dois SELECTs.

quatro Clientes com coleções:
cinco SELECTs.

Solicitações EAGER:
associações carregadas;
estratégia de SQL variável.

orçamento:
falha diante da regressão.
```

A próxima aula será:

```text
338 - M13.28 - JPQL select join fetch
```

Nela, você aprenderá:

- JPQL orientada a entidades;
- `select`;
- aliases;
- parâmetros;
- `join`;
- `join fetch`;
- carregamento de `ManyToOne`;
- carregamento de `OneToMany`;
- `distinct`;
- duplicação de linhas;
- entidades únicas no resultado;
- associação loaded;
- redução de N+1;
- limites com paginação;
- múltiplas coleções;
- comparação de SQL;
- orçamento antes e depois;
- testes de regressão.

A aula 337 identificou e mediu o problema.

A aula 338 implementará uma correção explícita por consulta.

---

# Material complementar

## Checkpoint final

- [ ] Reproduzi N+1 com dados adequados.
- [ ] Medi ManyToOne e OneToMany separadamente.
- [ ] Considerei o primeiro nível de cache.
- [ ] Comprovei que EAGER não garante um SELECT.
- [ ] Criei orçamento de queries e teste de regressão.

---

## Troubleshooting adicional

### O teste mostrou apenas dois SELECTs

Verifique se todas as Ordens apontam para o mesmo Cliente.

### A contagem inclui INSERTs

Limpe o inspector depois da preparação.

### O debugger mudou o resultado

Não expanda proxies ou coleções durante a medição.

### EAGER fez um JOIN

Isso é uma estratégia válida, mas não uma garantia universal.

### O teste ficou frágil após atualizar Hibernate

Afirme o contrato do caso de uso e evite comparar SQL integral.

---

## Perguntas de revisao

1. O que é N+1?
2. O que representa o 1?
3. O que representa N?
4. Como aparece em ManyToOne?
5. Como aparece em OneToMany?
6. Coleção vazia pode consultar?
7. Primeiro nível pode esconder o problema?
8. Por que usar Clientes distintos?
9. EAGER garante uma consulta?
10. LAZY causa sozinho o problema?
11. Qual é o impacto de round trips?
12. Como afeta o pool?
13. StatementInspector mede o quê?
14. Statistics mede o quê?
15. O que é query budget?
16. Paginação corrige?
17. Cache corrige o plano?
18. Um único SELECT é sempre melhor?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma query principal e N adicionais.
2. A consulta principal.
3. Resultados ou coleções acessadas.
4. Um SELECT por associação distinta.
5. Um SELECT por coleção.
6. Sim.
7. Sim.
8. Para revelar as inicializações.
9. Não.
10. Não; o acesso repetido produz o padrão.
11. Soma latência.
12. Retém conexão por mais tempo.
13. SQL executado.
14. Operações internas e statements.
15. Limite esperado por caso de uso.
16. Não.
17. Pode esconder, não corrige.
18. Não.
19. Não.
20. JPQL select join fetch.

---

## Desafio opcional

Crie:

```java
NPlusOneGrowthAnalyzer
```

Entrada:

```text
quantidadeRaizes;

selectsObservados;

selectsBase;

associacoesDistintas.
```

Saída:

```text
padrão constante;

linear;

superlinear;

inconclusivo.
```

Regras:

- usar pelo menos três tamanhos de amostra;
- não depender de tempo;
- produzir relatório Markdown;
- não registrar SQL sensível;
- explicar interferência do primeiro nível;
- possuir testes unitários;
- recomendar investigação, não correção automática.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 337 - M13.27 - Problema N mais um

- Aprofundei o problema N+1.
- Entendi a fórmula uma consulta mais N adicionais.
- Diferenciei consulta principal de inicializações.
- Reproduzi N+1 em `ManyToOne`.
- Usei cinco Ordens com cinco Clientes distintos.
- Observei seis SELECTs.
- Testei lista sem navegar pelas associações.
- Observei somente um SELECT.
- Reproduzi cenário com Cliente compartilhado.
- Observei o efeito do primeiro nível.
- Entendi que fixtures podem esconder N+1.
- Reproduzi N+1 em `OneToMany`.
- Acessei quatro coleções.
- Observei cinco SELECTs.
- Entendi que coleção vazia também pode consultar.
- Confirmei que segundo acesso usa o contexto.
- Comparei associação EAGER.
- Entendi que EAGER não garante JOIN ou consulta única.
- Modelei custo de round trips.
- Entendi impacto no pool e no banco.
- Usei `StatementInspector`.
- Usei estatísticas Hibernate.
- Isolei setup e teardown da medição.
- Evitei interferência do debugger e logs.
- Criei `QueryBudget`.
- Criei teste de regressão por SELECT.
- Diferenciei paginação de correção.
- Mantive cache de segundo nível desativado.
- Não implementei join fetch antes da aula 338.
- Mantive Flyway no DDL e Hibernate em validate.
- Próxima aula: JPQL select join fetch.
```

---

## Referencia tecnica curta

```text
N+1:
uma query mais N.

To-one:
uma consulta por identidade relacionada.

To-many:
uma consulta por coleção.

First-level cache:
pode reduzir repetições.

EAGER:
não garante join.

Inspector:
conta SQL.

Statistics:
mede operações Hibernate.

Budget:
limite por caso de uso.

Pagination:
limita, não corrige.

Diagnóstico:
antes da otimização.
```

Regra final:

```text
o problema N mais um deve ser demonstrado com fixtures representativas, medido dentro de um escopo controlado e protegido por testes de orçamento; LAZY ou EAGER isoladamente não definem um bom plano, e a correcao deve carregar explicitamente apenas os dados exigidos pelo caso de uso.
```
