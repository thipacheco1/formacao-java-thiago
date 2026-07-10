# 336 - M13.26 - Fetch lazy eager e proxy

## Apresentacao da aula

Na aula 335, você aprofundou cascade e `orphanRemoval` como decisões de responsabilidade.

O laboratório definiu:

```text
OrdemServicoEntity:
raiz do agregado.

AtividadeEntity:
filha exclusiva.

ClienteEntity:
entidade compartilhada.
```

A relação Ordem–Atividade utilizou:

```java
cascade = CascadeType.ALL
orphanRemoval = true
```

A relação Ordem–Cliente permaneceu sem cascade porque o Cliente possui lifecycle independente.

Agora você vai responder outra pergunta fundamental:

```text
quando cada entidade ou coleção relacionada
deve ser carregada do banco?
```

As duas estratégias declaradas pela API JPA são:

```java
FetchType.LAZY
FetchType.EAGER
```

Elas parecem simples:

```text
LAZY:
carregar quando necessário.

EAGER:
carregar junto ou imediatamente.
```

Na prática, é preciso compreender detalhes importantes.

`EAGER` não significa obrigatoriamente:

```text
um único SELECT com JOIN.
```

O provider pode atender ao contrato usando:

- join;
- consulta secundária;
- múltiplos selects;
- outras estratégias internas.

`LAZY` também não significa:

```text
garantia absoluta de que nenhum dado será carregado antes.
```

Para algumas associações, `LAZY` é uma dica ao provider.

No Hibernate, associações to-one lazy podem ser representadas por:

```text
proxy;
ou mecanismo equivalente.
```

Coleções lazy normalmente são representadas por wrappers persistentes.

Esses objetos permitem adiar a consulta até o acesso aos dados.

Nesta aula, você estudará:

- padrões JPA de fetch;
- diferença entre requisito EAGER e dica LAZY;
- associações to-one;
- associações to-many;
- proxies do Hibernate;
- classe de domínio e classe proxy;
- acesso ao identificador;
- acesso a atributo comum;
- `PersistenceUnitUtil.isLoaded`;
- `Hibernate.isInitialized` como diagnóstico específico;
- `find`;
- `getReference`;
- coleção lazy;
- contexto aberto;
- entidade detached;
- `LazyInitializationException`;
- inicialização por `toString`;
- inicialização pelo debugger;
- serialização acidental;
- SQL gerado;
- critérios para escolher fetch.

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
formacao_java_jpa_336
```

O schema será:

```text
jpa_336
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

As entidades principais serão:

```text
ClienteEntity;

OrdemServicoEntity;

AtividadeEntity;

SolicitacaoEagerEntity.
```

A modelagem principal usará:

```text
Ordem -> Cliente:
@ManyToOne LAZY.

Ordem -> Atividades:
@OneToMany LAZY.

Solicitação de demonstração -> Cliente:
@ManyToOne com padrão EAGER.
```

A entidade `SolicitacaoEagerEntity` existirá apenas para comparar o comportamento padrão de uma associação to-one EAGER sem alterar a política profissional da Ordem.

O laboratório comprovará:

```text
find de Ordem:
Cliente lazy não inicializado;
Atividades lazy não inicializadas.

acesso ao ID do Cliente:
pode preservar proxy não inicializado no Hibernate.

acesso ao nome do Cliente:
inicializa a associação.

acesso ao tamanho das Atividades:
inicializa a coleção.

getReference de Cliente:
retorna referência sem SELECT inicial.

acesso após fechar o contexto:
pode lançar LazyInitializationException.

Solicitação EAGER:
Cliente deve estar disponível;
o provider decide como carregar.

toString seguro:
não inicializa associações.

estado final:
zero fixtures CLI-JPA-336-%,
OS-JPA-336-%,
ATV-JPA-336-% e SOL-JPA-336-%.
```

A próxima aula será:

```text
337 - M13.27 - Problema N mais um
```

Nesta aula, você observará consultas individuais e inicialização de uma associação.

A aula 337 aprofundará o efeito de repetir esse acesso em listas.

Não serão antecipados:

- solução de N+1;
- `join fetch`;
- entity graph;
- batch fetching;
- DTO projection;
- Criteria API;
- tuning de cache;
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

338:
JPQL select join fetch.
```

As aulas anteriores responderam:

```text
quem controla a foreign key?

quem controla o lifecycle?

quem é compartilhado?

quem é exclusivo?
```

Agora a pergunta será:

```text
quando o estado relacionado entra na memória?
```

Nesta aula:

```text
FetchType.LAZY:
aprofundado.

FetchType.EAGER:
aprofundado.

padrões JPA:
sim.

proxy Hibernate:
sim.

coleção persistente:
sim.

isLoaded:
sim.

getReference:
sim.

LazyInitializationException:
sim.

N+1:
somente ponte.

join fetch:
não.

Spring:
não.
```

A arquitetura será:

```text
EntityManager
    -> persistence context
        -> Ordem managed
            -> Cliente proxy ou referência lazy
            -> coleção lazy de Atividades.
```

Para a demonstração EAGER:

```text
EntityManager
    -> Solicitação managed
        -> Cliente disponível conforme contrato EAGER.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-336-fetch-lazy-eager-proxy
```

Estrutura final:

```text
labs
└── m13
    └── aula-336-fetch-lazy-eager-proxy
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── defaults-fetch-jpa.md
        │   ├── proxy-e-inicializacao.md
        │   ├── contexto-e-lazy.md
        │   ├── perigos-inicializacao-acidental.md
        │   └── troubleshooting-fetch.md
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
            │   │                   └── aula336
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
            │   │                       │   ├── FetchBehaviorLab.java
            │   │                       │   ├── FetchObservation.java
            │   │                       │   └── FetchReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_336.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula336
                                        ├── FetchDefaultsIT.java
                                        ├── LazyToOneProxyIT.java
                                        ├── LazyCollectionIT.java
                                        ├── EagerAssociationIT.java
                                        ├── DetachedLazyAccessIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
Ordem carregada:
um SELECT principal.

Cliente lazy:
não carregado antes do nome.

Atividades lazy:
não carregadas antes do acesso.

Cliente.getId:
sem SELECT adicional no Hibernate do laboratório.

Cliente.getNome:
SELECT adicional.

Atividades.size:
SELECT da coleção.

getReference:
sem SELECT inicial.

contexto fechado:
acesso lazy falha de forma controlada.

Solicitação EAGER:
Cliente carregado antes do uso normal.

toString:
não toca associações.
```

---

## Conceito essencial

### Fetch e plano de carregamento

Fetch define como o estado relacionado deve ser disponibilizado.

Ele não altera:

- cardinalidade;
- foreign key;
- lado proprietário;
- cascade;
- responsabilidade de lifecycle.

Uma associação pode ser:

```text
LAZY e sem cascade;

LAZY e com cascade;

EAGER e sem cascade.
```

São decisões diferentes.

---

### Padrões JPA

Os padrões são:

```text
@ManyToOne:
EAGER.

@OneToOne:
EAGER.

@OneToMany:
LAZY.

@ManyToMany:
LAZY.
```

Esses padrões explicam por que omitir `fetch` em associações to-one pode carregar mais dados do que o esperado.

No laboratório profissional, `ManyToOne` será declarado explicitamente como:

```java
fetch = FetchType.LAZY
```

---

### EAGER e obrigacao

`EAGER` representa a exigência de que a associação esteja disponível como parte do estado carregado.

O provider não precisa usar um único join.

Pode executar:

```text
SELECT da entidade principal;

SELECT secundário da associação.
```

Por isso:

```text
EAGER não garante uma query;
EAGER não elimina N+1;
EAGER não significa melhor performance.
```

---

### LAZY como dica

Para associações marcadas como LAZY, o provider pode adiar o carregamento.

A especificação trata LAZY como uma dica em alguns contextos.

No Hibernate configurado, espera-se carregamento adiado por proxy ou wrapper.

A aplicação deve testar o provider real quando depender do comportamento operacional.

---

### Proxy de entidade

Um proxy representa uma entidade sem carregar imediatamente todos os seus atributos.

Conceitualmente, ele conhece:

```text
tipo associado;

identificador;

persistence context;

mecanismo para inicializar.
```

Ao acessar um atributo que exige estado:

```java
cliente.getNome()
```

o proxy solicita a leitura ao Hibernate.

---

### Proxy e classe Java

Um proxy pode ser uma subclasse gerada pelo provider ou outro mecanismo de interceptação.

Portanto:

```java
cliente.getClass()
```

pode não retornar exatamente:

```java
ClienteEntity.class
```

Não baseie regra de negócio em comparação rígida de classes de runtime.

Para diagnóstico específico Hibernate, existe:

```java
Hibernate.getClass(cliente)
```

Esse uso deve ficar isolado em código de observabilidade ou infraestrutura.

---

### Proxy e instanceof

Quando o proxy é uma subclasse, `instanceof ClienteEntity` tende a funcionar.

Mesmo assim, regras de igualdade precisam considerar:

- proxies;
- IDs gerados;
- entidades detached;
- classes herdadas;
- estabilidade do hash.

Esta aula não redefinirá `equals` e `hashCode`.

---

### Acesso ao ID

No Hibernate, o identificador de um proxy normalmente pode ser obtido sem inicializar a entidade:

```java
cliente.getId()
```

Isso acontece porque o proxy já conhece a chave.

O laboratório medirá:

```text
isLoaded antes;

acesso ao ID;

isLoaded depois;

contagem de SELECT.
```

Esse comportamento será documentado como específico do provider observado.

---

### Acesso a atributo comum

Acessar:

```java
cliente.getNome()
```

exige estado da entidade.

O Hibernate executará o SELECT necessário quando o proxy ainda não estiver inicializado.

Depois:

```text
isLoaded:
true.
```

A mesma referência continua sendo usada.

---

### getReference

`EntityManager.getReference` solicita uma referência por identidade:

```java
ClienteEntity cliente =
        entityManager.getReference(
                ClienteEntity.class,
                id
        );
```

O provider pode retornar um proxy sem consultar o banco naquele momento.

Usos possíveis:

- preencher uma foreign key;
- associar entidade por ID;
- evitar leitura quando não é necessário validar atributos.

Riscos:

- ID inexistente pode falhar somente depois;
- acesso a atributo pode lançar `EntityNotFoundException`;
- não substitui validação de negócio.

---

### find versus getReference

`find`:

```text
busca a entidade;
retorna managed ou null;
normalmente consulta quando não está no contexto.
```

`getReference`:

```text
retorna referência;
pode não consultar imediatamente;
pode falhar ao inicializar.
```

Use `find` quando precisa:

- confirmar existência;
- validar status;
- ler dados;
- retornar erro de domínio preciso.

Use `getReference` quando:

- a identidade é confiável;
- somente a associação é necessária;
- a foreign key pode realizar a validação final;
- a falha tardia é tratada.

---

### Colecao lazy

Uma coleção `OneToMany` lazy não é uma `ArrayList` comum depois do carregamento da entidade.

O Hibernate utiliza uma implementação persistente capaz de:

- registrar inicialização;
- consultar quando acessada;
- acompanhar alterações;
- integrar dirty checking;
- controlar snapshots da coleção.

A aplicação deve programar para a interface:

```java
List;
Set;
Collection.
```

Não dependa da classe concreta.

---

### Operacoes que inicializam colecao

Ações comuns que podem inicializar:

```java
atividades.size();

atividades.isEmpty();

iterar;

stream;

copiar com List.copyOf;

toString que inclui a coleção;

serialização.
```

Mesmo um getter aparentemente simples pode inicializar se criar uma cópia do wrapper.

No laboratório, será disponibilizado um método de domínio que acessa a coleção conscientemente dentro do contexto.

---

### Getter e copia imutavel

Nas aulas anteriores, o getter retornou:

```java
List.copyOf(atividades)
```

Isso protege a mutabilidade, mas precisa percorrer a coleção e pode inicializá-la.

Essa consequência deve ser conhecida.

Para apenas verificar carregamento, use:

```java
PersistenceUnitUtil.isLoaded(
        ordem,
        "atividades"
)
```

antes de chamar o getter.

---

### PersistenceUnitUtil

API padrão:

```java
PersistenceUnitUtil util =
        entityManagerFactory
                .getPersistenceUnitUtil();
```

Verificações:

```java
util.isLoaded(cliente);

util.isLoaded(
        ordem,
        "cliente"
);

util.isLoaded(
        ordem,
        "atividades"
);
```

É a opção preferida para testes portáveis de carregamento.

---

### Hibernate.isInitialized

Diagnóstico específico:

```java
Hibernate.isInitialized(
        ordem.getCliente()
)
```

e:

```java
Hibernate.isInitialized(
        internalCollection
)
```

Essa API acopla o código ao Hibernate.

Use somente em:

- testes;
- troubleshooting;
- observabilidade;
- infraestrutura específica.

O domínio não deve depender dela.

---

### Contexto aberto

Um proxy ou coleção lazy precisa de acesso ao persistence context e à sessão do provider para inicializar.

Enquanto o `EntityManager` está aberto e a entidade continua associada, o Hibernate consegue executar a leitura.

A transação pode ser recomendada para consistência, mesmo quando a leitura simples tecnicamente funciona em determinadas configurações.

---

### Entidade detached

Depois de:

```java
entityManager.close();
```

a entidade fica detached.

Se a associação lazy não foi inicializada, o proxy não possui mais sessão ativa para buscar dados.

O acesso pode lançar:

```text
LazyInitializationException.
```

Essa exceção indica que o código tentou carregar dados fora da unidade de trabalho.

---

### Solucao incorreta para LazyInitializationException

Soluções frágeis:

```text
trocar tudo para EAGER;

manter EntityManager aberto por toda a requisição sem critério;

habilitar carregamento fora de transação;

capturar a exceção e ignorar;

inicializar tudo sempre.
```

A solução correta começa por:

```text
definir os dados necessários ao caso de uso;

carregá-los dentro da transação;

mapear para resultado apropriado;

fechar o contexto.
```

As técnicas de consulta serão estudadas depois.

---

### EAGER e estado detached

Uma associação EAGER deve estar disponível quando a entidade é carregada.

Por isso, depois de fechar o manager, o atributo normalmente continua acessível.

Isso não significa que associações internas do objeto EAGER também foram todas inicializadas.

O grafo não se torna automaticamente inteiro.

---

### Inicializacao por toString

Evite:

```java
@Override
public String toString() {
    return "Ordem{"
            + cliente
            + atividades
            + "}";
}
```

Isso pode:

- inicializar proxy;
- inicializar coleção;
- gerar SQL em log;
- causar N+1;
- provocar exceção fora do contexto;
- criar recursão bidirecional.

O `toString` deve usar apenas campos simples seguros.

---

### Debugger

Alguns debuggers chamam getters ou `toString` para exibir objetos.

Ao expandir uma associação, o desenvolvedor pode disparar SQL sem perceber.

Durante testes de fetch:

- não expanda associações antes da medição;
- limpe o inspector;
- use assertions;
- evite watches que chamem getters;
- confira logs.

---

### Serializacao

Serializadores podem percorrer getters automaticamente.

Em entidades bidirecionais, isso pode:

- inicializar grafo;
- causar N+1;
- entrar em ciclo;
- expor dados;
- falhar fora do contexto.

Não retorne entidades diretamente por API.

DTOs serão usados quando a camada HTTP chegar.

---

### EAGER e consulta secundaria

Ao buscar `SolicitacaoEagerEntity`, o Hibernate pode:

- usar join;
- executar SELECT da Solicitação e SELECT do Cliente;
- reutilizar Cliente já presente no contexto.

O teste deve verificar:

```text
associação loaded.
```

Não deve exigir um formato único de SQL.

---

### Fetch nao corrige modelo

Uma associação errada continua errada mesmo com fetch otimizado.

Antes de escolher LAZY ou EAGER, confirme:

- cardinalidade;
- owner;
- lifecycle;
- cascade;
- nulabilidade;
- foreign key;
- aggregate boundary.

Fetch é uma decisão operacional sobre carregamento.

---

### Criterio inicial

Política inicial profissional:

```text
coleções:
LAZY.

to-one:
preferir LAZY quando o provider suporta e o caso permite.

consultas:
carregar explicitamente o necessário.

EAGER:
usar quando a associação sempre faz parte do caso
e o custo foi medido.
```

Essa política não substitui análise de cada consulta.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\main\java\br\com\formacao\m13\aula336\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\main\java\br\com\formacao\m13\aula336\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\main\java\br\com\formacao\m13\aula336\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\main\java\br\com\formacao\m13\aula336\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-336-fetch-lazy-eager-proxy\src\test\java\br\com\formacao\m13\aula336"

Set-Location `
  "labs\m13\aula-336-fetch-lazy-eager-proxy"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 335.

Ajuste:

```text
artifactId:
aula-336-fetch-lazy-eager-proxy.

persistence unit:
aula336PU.

Main:
br.com.formacao.m13.aula336.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_336
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-336-jpa
JPA_POOL_NAME=aula-336-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration V1

Crie:

```text
cliente;

ordem_servico;

atividade;

solicitacao_eager.
```

Sequências:

```text
cliente:
336001.

ordem:
336101.

atividade:
336201.

solicitação:
336301.
```

Foreign keys:

```text
ordem_servico.cliente_id -> cliente.id;

atividade.ordem_servico_id -> ordem_servico.id;

solicitacao_eager.cliente_id -> cliente.id.
```

Todos os relacionamentos serão obrigatórios.

Crie índices nas foreign keys.

Não use `ON DELETE CASCADE`.

---

### 4. Criar ClienteEntity.java

Campos:

```text
id;

codigo;

nome;

ativo;

versao;

criadoEm.
```

O método `toString` deve usar apenas:

```text
id;

codigo.
```

Não inclua coleções ou entidades relacionadas.

---

### 5. Criar OrdemServicoEntity.java

Associação to-one:

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

Coleção:

```java
@OneToMany(
        mappedBy = "ordemServico",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
)
private List<AtividadeEntity> atividades =
        new ArrayList<>();
```

Mantenha helpers da aula 335.

Adicione métodos simples:

```java
public ClienteEntity getCliente()

public List<AtividadeEntity> getAtividades()

public int quantidadeAtividades()
```

`quantidadeAtividades` inicializará a coleção de forma consciente.

---

### 6. Criar AtividadeEntity.java

Mapeie:

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

Não inclua `ordemServico` no `toString`.

---

### 7. Criar SolicitacaoEagerEntity.java

A associação será declarada sem `fetch`:

```java
@ManyToOne(
        optional = false
)
@JoinColumn(
        name = "cliente_id",
        nullable = false
)
private ClienteEntity cliente;
```

Como o padrão de `ManyToOne` é EAGER, essa entidade servirá de comparação.

Documente no código:

```text
omissão intencional para demonstrar o padrão JPA.
```

Não use essa omissão como convenção geral do projeto.

---

### 8. Criar persistence.xml e runtime

Liste as quatro entidades.

Use:

```text
aula336PU;

RESOURCE_LOCAL;

shared-cache-mode NONE;

hibernate.hbm2ddl.auto=validate.
```

Reutilize o `SqlCaptureInspector`.

Não habilite cache de segundo nível.

---

### 9. Criar FetchObservation.java

```java
package br.com.formacao.m13.aula336.lab;

public record FetchObservation(
        String etapa,
        boolean clienteLoaded,
        boolean atividadesLoaded,
        String runtimeClass,
        long selectCount,
        boolean managerOpen,
        boolean accessSucceeded
) {

    public FetchObservation {
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

### 10. Criar FetchReport.java

```java
package br.com.formacao.m13.aula336.lab;

import java.util.List;

public record FetchReport(
        List<FetchObservation> observations,
        boolean lazyToOneWasDeferred,
        boolean identifierAccessAvoidedInitialization,
        boolean regularAttributeInitializedProxy,
        boolean lazyCollectionWasDeferred,
        boolean collectionAccessInitializedIt,
        boolean getReferenceWasDeferred,
        boolean eagerAssociationWasLoaded,
        boolean detachedLazyAccessFailed,
        boolean safeToStringAvoidedInitialization
) {

    public FetchReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 11. Criar fixtures

Persista:

```text
CLI-JPA-336-MAIN;

OS-JPA-336-MAIN;

ATV-JPA-336-001;

ATV-JPA-336-002;

SOL-JPA-336-MAIN.
```

A Ordem aponta para o Cliente.

As duas Atividades pertencem à Ordem.

A Solicitação EAGER aponta para o mesmo Cliente.

Confirme e feche o manager.

---

### 12. Testar to-one LAZY

Abra manager.

Limpe o inspector.

Busque a Ordem por ID.

Antes de acessar o Cliente:

```java
boolean loaded =
        persistenceUnitUtil.isLoaded(
                ordem,
                "cliente"
        );
```

Esperado no Hibernate:

```text
false.
```

Confirme:

```text
um SELECT da Ordem;

nenhum SELECT completo do Cliente.
```

Registre a classe de runtime da referência sem chamar métodos que inicializem.

---

### 13. Testar acesso ao ID

Obtenha a referência:

```java
ClienteEntity cliente =
        ordem.getCliente();
```

Apenas obter a referência não deve exigir o nome.

Acesse:

```java
cliente.getId();
```

Confirme no Hibernate do laboratório:

```text
associação ainda não inicializada;

nenhum novo SELECT.
```

Documente como comportamento observado do provider.

---

### 14. Testar acesso ao atributo

Limpe o inspector.

Execute:

```java
String nome =
        cliente.getNome();
```

Confirme:

```text
um SELECT do Cliente;

associação inicializada;

nome correto.
```

Uma segunda chamada a `getNome` no mesmo contexto não deve gerar outro SELECT.

---

### 15. Testar colecao LAZY

Abra novo manager.

Busque a Ordem.

Antes do getter:

```java
isLoaded(
        ordem,
        "atividades"
)
```

deve ser false no Hibernate do laboratório.

Execute:

```java
int quantidade =
        ordem.quantidadeAtividades();
```

Confirme:

```text
quantidade 2;

coleção initialized;

SELECT de Atividades.
```

Não acesse o getter antes da primeira medição.

---

### 16. Testar getReference

Abra manager.

Limpe inspector.

Execute:

```java
ClienteEntity referencia =
        entityManager.getReference(
                ClienteEntity.class,
                clienteId
        );
```

Confirme:

```text
zero SELECT inicial;

referência não inicializada.
```

Acesse o ID.

Confirme ausência de SELECT adicional.

Depois acesse o nome e confirme inicialização.

---

### 17. Testar associacao EAGER

Abra novo manager.

Limpe inspector.

Busque:

```java
SolicitacaoEagerEntity
```

Verifique:

```java
isLoaded(
        solicitacao,
        "cliente"
)
```

Esperado:

```text
true.
```

Não exija um único SELECT.

Registre:

- total de SELECTs;
- associação carregada;
- nome acessível.

---

### 18. Testar contexto fechado

Abra manager.

Busque Ordem.

Não inicialize:

```text
cliente;

atividades.
```

Feche manager.

Primeiro, acesse apenas campos simples da Ordem.

Isso deve funcionar.

Depois tente:

```java
ordem.getCliente().getNome();
```

e:

```java
ordem.getAtividades().size();
```

Espere `LazyInitializationException` no Hibernate.

O teste deve aceitar que uma das associações possa ter sido carregada antecipadamente apenas se o provider real assim decidir, mas o fluxo configurado deve demonstrar pelo menos um acesso lazy falhando.

---

### 19. Testar toString seguro

Abra manager e busque Ordem.

Confirme associações não carregadas.

Limpe inspector.

Execute:

```java
String texto =
        ordem.toString();
```

Confirme:

```text
zero SELECT adicional;

associações continuam não carregadas.
```

O `toString` deve exibir apenas:

```text
id;

codigo;

status.
```

---

### 20. Limpeza final

Remova na ordem:

1. Solicitação;
2. Ordem, propagando remoção das Atividades;
3. Cliente.

Commit.

Confirme zero fixtures.

---

### 21. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `FetchBehaviorLab`;
4. imprime observações;
5. imprime decisões;
6. não chama `toString` de associações;
7. não imprime SQL completo;
8. fecha runtime.

Formato:

```text
etapa | cliente loaded | atividades loaded | classe | SELECTs | manager aberto
```

---

### 22. Criar FetchDefaultsIT.java

Use reflection para confirmar:

```text
ManyToOne sem fetch:
EAGER por padrão.

ManyToOne da Ordem:
LAZY explícito.

OneToMany:
LAZY explícito.
```

Documente também os padrões de `OneToOne` e `ManyToMany`, mesmo sem criar entidades extras.

---

### 23. Criar LazyToOneProxyIT.java

Casos:

#### Find Ordem

- confirmar Cliente não carregado;
- confirmar SQL principal.

#### Acesso ao ID

- acessar ID;
- confirmar ausência de inicialização no Hibernate.

#### Acesso ao nome

- confirmar SELECT;
- confirmar loaded.

#### Runtime class

- registrar `getClass`;
- comparar com `Hibernate.getClass`;
- não usar comparação como regra de domínio.

#### GetReference

- zero SELECT inicial;
- inicialização no atributo.

---

### 24. Criar LazyCollectionIT.java

Casos:

#### Antes do acesso

- find Ordem;
- coleção não carregada.

#### Size

- inicializa;
- retorna 2;
- um SELECT da coleção.

#### Getter imutável

- retorna cópia;
- tentativa de mutação falha;
- reconhecer que a cópia inicializa a coleção.

#### Segundo acesso

- zero SELECT adicional no mesmo contexto.

---

### 25. Criar EagerAssociationIT.java

Casos:

#### Find Solicitação

- associação Cliente loaded;
- nome acessível.

#### SQL

- não exigir join específico;
- aceitar estratégia do provider;
- registrar quantidade de SELECTs.

#### Contexto fechado

- Cliente EAGER permanece acessível depois do fechamento;
- não assumir que o grafo interno inteiro foi carregado.

---

### 26. Criar DetachedLazyAccessIT.java

Casos:

#### Campos simples

- Ordem detached;
- acessar código;
- sucesso.

#### Cliente não inicializado

- fechar contexto;
- acessar nome;
- esperar `LazyInitializationException`.

#### Coleção não inicializada

- fechar contexto;
- acessar size;
- esperar exceção.

#### Inicialização antes do close

- acessar dentro;
- fechar;
- acessar dados já carregados;
- sucesso.

---

### 27. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_336.solicitacao_eager
WHERE codigo LIKE 'SOL-JPA-336-%';

DELETE FROM jpa_336.atividade
WHERE codigo LIKE 'ATV-JPA-336-%';

DELETE FROM jpa_336.ordem_servico
WHERE codigo LIKE 'OS-JPA-336-%';

DELETE FROM jpa_336.cliente
WHERE codigo LIKE 'CLI-JPA-336-%';
```

Use antes e depois dos testes.

---

### 28. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_336.
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
zero CLI-JPA-336-%;

zero OS-JPA-336-%;

zero ATV-JPA-336-%;

zero SOL-JPA-336-%;

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
to-one lazy adiado;

ID sem inicialização observado;

nome inicializou proxy;

coleção lazy adiada;

size inicializou coleção;

getReference adiado;

EAGER carregado;

acesso detached falhou;

toString permaneceu seguro;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 30. Criar documentacao

`defaults-fetch-jpa.md`:

```text
Annotation | Padrão | Natureza | Decisão do laboratório
```

`proxy-e-inicializacao.md` deve explicar:

- referência;
- ID;
- atributo;
- classe runtime;
- `Hibernate.getClass`;
- `isLoaded`;
- SQL.

`contexto-e-lazy.md` deve desenhar:

```text
managed + contexto aberto:
pode inicializar.

detached + não inicializado:
não pode inicializar.
```

`perigos-inicializacao-acidental.md` deve cobrir:

- `toString`;
- debugger;
- logger;
- JSON;
- getter de cópia;
- stream;
- tamanho de coleção.

`troubleshooting-fetch.md` deve cobrir:

- associação carregada cedo;
- proxy inesperado;
- `LazyInitializationException`;
- SELECT no debugger;
- EAGER com vários SELECTs;
- getReference inexistente;
- coleção concreta diferente;
- teste frágil de SQL.

---

## Entendendo o que foi feito

### LAZY ficou observavel

O carregamento foi medido antes e depois do acesso.

### Proxy deixou de parecer entidade incompleta

Ele foi tratado como referência gerenciada que conhece identidade e inicialização.

### EAGER foi separado de JOIN

A associação ficou disponível sem exigir um formato único de SQL.

### O contexto ganhou fronteira clara

Dados lazy precisaram ser carregados dentro da unidade de trabalho.

### Inicializacoes acidentais ficaram visiveis

`toString`, debugger, getters e serialização passaram a ser tratados como possíveis gatilhos.

---

## Erros comuns importantes

### Trocar tudo para EAGER

Isso pode aumentar consultas e volume.

### Acessar lazy depois do close

O proxy não possui contexto para consultar.

### Usar getClass em regra de negocio

A classe de runtime pode ser proxy.

### Colocar associacoes no toString

Isso pode gerar SQL e recursão.

### Achar que EAGER significa um JOIN

O provider escolhe a estratégia.

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

### Consultar fixtures

```sql
SELECT
    ordem.codigo AS ordem_codigo,
    cliente.codigo AS cliente_codigo,
    count(atividade.id) AS atividades
FROM jpa_336.ordem_servico AS ordem
JOIN jpa_336.cliente AS cliente
    ON cliente.id = ordem.cliente_id
LEFT JOIN jpa_336.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
GROUP BY
    ordem.codigo,
    cliente.codigo
ORDER BY ordem.codigo;
```

---

## Exercicio guiado

### Parte 1 — ManyToOne EAGER

Troque temporariamente o Cliente da Ordem para EAGER.

Compare:

- `isLoaded`;
- SQL;
- acesso ao nome;
- contexto fechado.

Restaure LAZY.

### Parte 2 — OneToMany EAGER

Troque a coleção para EAGER em base descartável.

Observe o SQL.

Restaure LAZY.

Não conclua que EAGER resolve N+1.

### Parte 3 — GetReference inexistente

Use ID inexistente.

Compare:

```text
getReference;

getId;

getNome.
```

Registre o momento da falha.

### Parte 4 — Debugger

Execute teste com breakpoint.

Observe se expandir Cliente ou Atividades altera a contagem de SELECTs.

Documente a interferência.

### Parte 5 — toString inseguro

Crie temporariamente um `toString` que inclua Cliente.

Observe o SELECT.

Restaure a versão segura.

### Parte 6 — Getter de copia

Compare:

```text
isLoaded antes;

getAtividades;

isLoaded depois.
```

Explique por que encapsulamento e carregamento são preocupações diferentes.

### Parte 7 — Inicializar antes de detach

Carregue Cliente e Atividades dentro do contexto.

Feche o manager.

Confirme que os dados já inicializados continuam disponíveis.

### Parte 8 — Politica

Registre:

```text
to-one LAZY explícito;

to-many LAZY explícito;

EAGER somente com justificativa;

nenhuma entidade em resposta HTTP;

nenhuma associação em toString;

dados carregados dentro do caso de uso.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 336 existe;
- continuidade com a aula 335 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_336` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- quatro entidades foram mapeadas;
- padrões JPA de fetch foram documentados;
- ManyToOne EAGER padrão foi explicado;
- OneToOne EAGER padrão foi explicado;
- OneToMany LAZY padrão foi explicado;
- ManyToMany LAZY padrão foi explicado;
- Ordem-Cliente usou LAZY explícito;
- Ordem-Atividades usou LAZY explícito;
- demonstração EAGER foi criada;
- EAGER foi diferenciado de join;
- LAZY foi tratado como dica;
- proxy foi explicado;
- classe de runtime foi observada;
- `Hibernate.getClass` foi isolado;
- `instanceof` foi discutido;
- acesso ao ID foi testado;
- ausência de inicialização pelo ID foi observada no Hibernate;
- acesso ao nome inicializou;
- segundo acesso não repetiu SELECT;
- `getReference` foi praticado;
- ausência de SELECT inicial foi observada;
- risco de ID inexistente foi documentado;
- coleção lazy foi observada;
- `size` inicializou a coleção;
- getter de cópia e inicialização foram relacionados;
- `PersistenceUnitUtil.isLoaded` foi usado;
- `Hibernate.isInitialized` foi apenas diagnóstico;
- associação EAGER apareceu carregada;
- teste não exigiu um SQL específico para EAGER;
- contexto aberto permitiu inicialização;
- contexto fechado impediu lazy não carregado;
- `LazyInitializationException` foi testada;
- campos simples detached permaneceram acessíveis;
- dados inicializados antes do close permaneceram acessíveis;
- `toString` seguro foi criado;
- `toString` não inicializou associações;
- efeito do debugger foi documentado;
- risco de serialização foi documentado;
- entidades não foram expostas como JSON;
- política de fetch foi registrada;
- SQL foi observado sem bindings;
- testes de defaults foram criados;
- testes de proxy foram criados;
- testes de coleção foram criados;
- testes EAGER foram criados;
- testes detached foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- N+1 não foi aprofundado antes da aula 337;
- join fetch não foi antecipado antes da aula 338;
- Spring não foi usado;
- ponte para a aula 337 está correta;
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
  labs/m13/aula-336-fetch-lazy-eager-proxy
```

Commit recomendado:

```powershell
git commit -m "feat(m13): praticar fetch lazy eager e proxies"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou quando associações entram na memória.

Aprendeu:

```text
LAZY:
carregamento adiado.

EAGER:
associação exigida como carregada.

proxy:
referência que pode inicializar depois.

coleção persistente:
wrapper lazy do provider.

isLoaded:
verificação de carregamento.

getReference:
referência por identidade.

contexto aberto:
permite inicialização.

detached:
não inicializa dado pendente.
```

O laboratório comprovou:

```text
Cliente lazy não carregado no find da Ordem;

ID acessado sem SELECT adicional no Hibernate;

nome inicializando proxy;

coleção inicializada pelo size;

getReference sem leitura inicial;

EAGER disponível sem exigir join específico;

acesso lazy detached falhando;

toString seguro sem SQL adicional.
```

A próxima aula será:

```text
337 - M13.27 - Problema N mais um
```

Nela, você aprofundará:

- query principal;
- uma consulta adicional por entidade;
- N+1 em `ManyToOne`;
- N+1 em `OneToMany`;
- diferença entre lazy e EAGER;
- contagem de statements;
- impacto em latência;
- impacto em pool;
- volume de dados;
- detecção por testes;
- logs;
- estatísticas Hibernate;
- casos que parecem pequenos;
- critérios para correção;
- preparação para `join fetch`.

A aula 336 mostrou uma inicialização.

A aula 337 mostrará o custo de repetir essa inicialização em uma lista.

---

# Material complementar

## Checkpoint final

- [ ] Conheço os padrões JPA de fetch.
- [ ] Diferenciei LAZY, EAGER e estratégia SQL.
- [ ] Observei proxy e coleção persistente.
- [ ] Testei acesso dentro e fora do contexto.
- [ ] Protegi `toString` e logs contra inicialização acidental.

---

## Troubleshooting adicional

### Cliente carregou imediatamente

Confirme mapping, provider, acesso do debugger e `toString`.

### getReference executou SELECT

Verifique se algum atributo além do ID foi acessado.

### LazyInitializationException

A associação não foi carregada antes do fechamento.

### EAGER executou dois SELECTs

Isso é permitido; EAGER não exige join.

### Getter inicializou colecao

Criar cópia ou iterar exige os elementos.

---

## Perguntas de revisao

1. Qual é o padrão de ManyToOne?
2. Qual é o padrão de OneToOne?
3. Qual é o padrão de OneToMany?
4. Qual é o padrão de ManyToMany?
5. EAGER garante JOIN?
6. LAZY é sempre garantia absoluta?
7. O que é proxy?
8. O proxy conhece o ID?
9. Acessar ID inicializa sempre?
10. Acessar nome pode inicializar?
11. O que faz getReference?
12. O que faz isLoaded?
13. O que é coleção persistente?
14. Size pode inicializar?
15. O que ocorre depois do close?
16. O que é LazyInitializationException?
17. toString pode gerar SQL?
18. O debugger pode interferir?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. EAGER.
2. EAGER.
3. LAZY.
4. LAZY.
5. Não.
6. Não em todo contrato.
7. Referência de inicialização adiada.
8. Sim.
9. Não no Hibernate observado.
10. Sim.
11. Obtém referência por ID.
12. Verifica carregamento.
13. Wrapper de coleção do provider.
14. Sim.
15. Lazy pendente não inicializa.
16. Acesso lazy sem sessão.
17. Sim.
18. Sim.
19. Não.
20. Problema N mais um.

---

## Desafio opcional

Crie:

```java
FetchTraceAnalyzer
```

Entrada:

```text
etapa;

associação;

fetch declarado;

loaded antes;

loaded depois;

SELECTs antes;

SELECTs depois;

manager aberto.
```

Saída:

```text
Markdown determinístico;

alertas de inicialização acidental.
```

Regras:

- não acessar a associação para medir;
- usar `PersistenceUnitUtil`;
- aceitar diagnóstico Hibernate opcional;
- não registrar dados sensíveis;
- não concluir N+1 com uma única entidade;
- possuir testes unitários;
- não depender de Spring.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 336 - M13.26 - Fetch lazy eager e proxy

- Aprofundei estratégias de carregamento JPA.
- Estudei `FetchType.LAZY`.
- Estudei `FetchType.EAGER`.
- Conheci os padrões de cada associação.
- Entendi que EAGER não garante JOIN.
- Entendi LAZY como dica em parte do contrato.
- Configurei ManyToOne LAZY explicitamente.
- Configurei OneToMany LAZY explicitamente.
- Criei uma associação EAGER para comparação.
- Observei proxy de entidade no Hibernate.
- Diferenciei classe de domínio e classe de runtime.
- Isolei `Hibernate.getClass` em diagnóstico.
- Acessei ID sem inicializar no comportamento observado.
- Acessei nome e inicializei o proxy.
- Usei `EntityManager.getReference`.
- Observei ausência de SELECT inicial.
- Estudei risco de referência inexistente.
- Observei coleção persistente lazy.
- Inicializei coleção pelo tamanho.
- Usei `PersistenceUnitUtil.isLoaded`.
- Usei `Hibernate.isInitialized` somente em teste.
- Acessei dados lazy com contexto aberto.
- Testei acesso lazy depois do fechamento.
- Observei `LazyInitializationException`.
- Mantive campos simples acessíveis em detached.
- Criei `toString` seguro.
- Evitei associações em logs.
- Documentei interferência do debugger.
- Documentei risco de serialização automática.
- Mantive Flyway no DDL e Hibernate em validate.
- Não aprofundei N+1 antes da aula 337.
- Não antecipei join fetch antes da aula 338.
- Próxima aula: Problema N mais um.
```

---

## Referencia tecnica curta

```text
ManyToOne:
EAGER por padrão.

OneToOne:
EAGER por padrão.

OneToMany:
LAZY por padrão.

ManyToMany:
LAZY por padrão.

Proxy:
referência adiada.

getReference:
proxy por ID.

isLoaded:
estado de carregamento.

Contexto:
permite inicializar.

Detached:
não carrega pendência.

EAGER:
não significa JOIN.
```

Regra final:

```text
fetch deve ser decidido pelo caso de uso e medido no provider real: LAZY evita carregar dados desnecessarios, EAGER nao garante uma unica query, proxies exigem contexto aberto e nenhuma associação deve ser inicializada acidentalmente por logs, debugger ou serializacao.
```
