# 333 - M13.23 - Relacionamento OneToMany

## Apresentacao da aula

Na aula 332, você mapeou o primeiro relacionamento JPA entre entidades:

```text
muitas Ordens de Serviço
    -> um Cliente.
```

A associação foi implementada em `OrdemServicoEntity` com:

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

A Ordem ficou como lado proprietário porque contém a coluna física:

```text
ordem_servico.cliente_id.
```

O banco recebeu:

- foreign key real;
- índice em `cliente_id`;
- restrição `NOT NULL`;
- proteção contra Cliente inexistente;
- proteção contra remoção de Cliente referenciado.

Na aula anterior, a navegação existia somente neste sentido:

```text
Ordem -> Cliente.
```

Nesta aula, você adicionará a navegação inversa:

```text
Cliente -> Ordens.
```

O resultado será uma associação bidirecional:

```text
Cliente
    -> várias Ordens.

Ordem
    -> um Cliente.
```

A annotation central será:

```java
@OneToMany
```

O lado Cliente terá uma coleção:

```java
private List<OrdemServicoEntity> ordens;
```

Entretanto, adicionar uma coleção não muda quem controla a foreign key.

O lado proprietário continuará sendo:

```text
OrdemServicoEntity.
```

O lado Cliente será o lado inverso e usará:

```java
mappedBy = "cliente"
```

Esse detalhe é essencial.

`mappedBy` não recebe o nome da coluna:

```text
cliente_id.
```

Ele recebe o nome do atributo Java no lado proprietário:

```text
cliente.
```

A aula aprofundará:

- `@OneToMany`;
- `mappedBy`;
- lado inverso;
- manutenção do lado proprietário;
- associação bidirecional;
- métodos auxiliares;
- sincronização dos dois lados;
- encapsulamento da coleção;
- `List` versus `Set`;
- `FetchType.LAZY`;
- inicialização da coleção;
- `PersistenceUnitUtil.isLoaded`;
- ausência de cascade por padrão;
- cascade consciente;
- `orphanRemoval`;
- remoção da coleção;
- dirty checking da associação;
- foreign key;
- SQL gerado;
- consulta de Clientes;
- introdução ao problema N+1;
- limpeza correta;
- testes de integridade.

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
formacao_java_jpa_333
```

O schema será:

```text
jpa_333
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

O fluxo oficial manterá:

```text
cascade:
nenhum.

orphanRemoval:
false.
```

Essa decisão preserva o critério adotado na aula 332:

```text
Cliente e Ordem possuem operações de lifecycle explícitas;

adicionar Ordem à coleção não deve persistir automaticamente;

remover Ordem da coleção não deve apagar automaticamente;

remover Cliente não deve remover Ordens.
```

Cascade e `orphanRemoval` serão praticados em cenários experimentais controlados e documentados, sem entrar no mapeamento oficial do laboratório.

O laboratório comprovará:

```text
Cliente possui coleção lazy de Ordens;

Ordem continua controlando cliente_id;

adicionarOrdem sincroniza os dois lados;

removerOrdem desfaz os dois lados em memória;

sem cascade, Ordem precisa ser persistida explicitamente;

remover somente da coleção não executa DELETE;

foreign key continua obrigatória;

duas Ordens aparecem na coleção;

coleção não deve ser exposta para mutação arbitrária;

carregar vários Clientes e acessar coleções pode gerar N+1;

estado final:
zero CLI-JPA-333-% e OS-JPA-333-%.
```

A próxima aula será:

```text
334 - M13.24 - ManyToMany com criterio
```

Por isso, não serão antecipados:

- `@ManyToMany`;
- tabela de junção sem entidade;
- associação Ordem–Técnico;
- entidade associativa;
- chave composta de associação;
- `@JoinTable` em fluxo principal;
- Spring;
- Spring Data;
- serialização HTTP.

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

334:
ManyToMany com criterio.
```

A aula 332 criou o lado que contém a foreign key.

A aula 333 adicionará uma visão inversa sem transferir o controle da coluna.

Nesta aula:

```text
@OneToMany:
aprofundado.

mappedBy:
sim.

lado inverso:
sim.

lado proprietário:
revisado.

bidirecional:
sim.

métodos auxiliares:
sim.

List:
praticada.

Set:
comparado conceitualmente.

LAZY:
sim.

cascade:
avaliado.

orphanRemoval:
avaliado.

N+1:
introdução.

ManyToMany:
não.

Spring:
não.
```

A arquitetura será:

```text
ClienteEntity
    -> List<OrdemServicoEntity>
        -> mappedBy = "cliente".

OrdemServicoEntity
    -> ClienteEntity
        -> @JoinColumn("cliente_id")
            -> foreign key real.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-333-relacionamento-onetomany
```

Estrutura final:

```text
labs
└── m13
    └── aula-333-relacionamento-onetomany
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-onetomany.md
        │   ├── sincronizacao-bidirecional.md
        │   ├── list-vs-set.md
        │   ├── cascade-e-orphan-removal.md
        │   ├── n-mais-um-introducao.md
        │   └── troubleshooting-onetomany.md
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
            │   │                   └── aula333
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── OneToManyLab.java
            │   │                       │   ├── OneToManyObservation.java
            │   │                       │   └── OneToManyReport.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_333.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula333
                                        ├── OneToManyMappingIT.java
                                        ├── BidirectionalConsistencyIT.java
                                        ├── CollectionLifecycleIT.java
                                        ├── OneToManyFetchIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
Cliente A:
duas Ordens na coleção.

mappedBy:
aponta para atributo cliente.

foreign key:
continua controlada pela Ordem.

adicionarOrdem:
Cliente contém Ordem;
Ordem aponta para Cliente.

removerOrdem:
coleção deixa de conter;
Ordem deixa de apontar para Cliente em memória.

sem cascade:
persistir apenas Cliente não persiste Ordem nova.

orphanRemoval false:
retirar da coleção não executa DELETE.

LAZY:
coleção não carregada antes do acesso.

N+1:
um SELECT de Clientes e um SELECT por coleção.

estado final:
zero fixtures.
```

---

## Conceito essencial

### Cardinalidade OneToMany

`OneToMany` significa:

```text
uma instância da entidade de origem
pode estar relacionada a várias instâncias da entidade alvo.
```

No laboratório:

```text
Cliente A
    -> Ordem 1;
    -> Ordem 2.
```

O atributo Java será:

```java
private List<OrdemServicoEntity> ordens;
```

A coleção representa a navegação inversa da foreign key já existente.

---

### Bidirecionalidade

Uma associação bidirecional possui duas referências em memória:

```text
Cliente.ordens;

Ordem.cliente.
```

O banco continua possuindo uma única informação física:

```text
ordem_servico.cliente_id.
```

JPA não cria duas foreign keys por existir navegação nos dois sentidos.

---

### Lado proprietario

O lado proprietário continua sendo:

```java
OrdemServicoEntity.cliente
```

porque contém:

```java
@JoinColumn(
        name = "cliente_id"
)
```

É esse lado que controla o valor da foreign key.

Se apenas a coleção do Cliente for alterada e `Ordem.cliente` permanecer incorreto, o banco seguirá o lado proprietário.

---

### Lado inverso

O lado Cliente será:

```java
@OneToMany(
        mappedBy = "cliente"
)
private List<OrdemServicoEntity> ordens;
```

`mappedBy` informa:

```text
esta coleção é o lado inverso;

a associação já é mapeada pelo atributo cliente da Ordem.
```

O lado inverso não possui `@JoinColumn`.

---

### mappedBy usa nome Java

Correto:

```java
mappedBy = "cliente"
```

Incorreto:

```java
mappedBy = "cliente_id"
```

O primeiro aponta para o atributo Java.

O segundo aponta para uma coluna SQL e causa erro de mapeamento.

---

### Relacionamento bidirecional nao se sincroniza sozinho em memoria

Quando a aplicação executa:

```java
ordem.alterarCliente(cliente);
```

JPA não adiciona automaticamente a Ordem em:

```java
cliente.getOrdens()
```

Da mesma forma, executar:

```java
cliente.getOrdens().add(ordem);
```

não atualiza automaticamente:

```java
ordem.getCliente()
```

A aplicação precisa manter o grafo consistente.

---

### Metodo auxiliar adicionarOrdem

A entidade Cliente terá:

```java
public void adicionarOrdem(
        OrdemServicoEntity ordem
)
```

O método deverá:

1. validar a Ordem;
2. verificar se já pertence à coleção;
3. remover da coleção do Cliente anterior, quando necessário;
4. adicionar à coleção atual;
5. atualizar `ordem.cliente`.

A regra precisa evitar recursão infinita entre dois métodos que chamam um ao outro.

Uma estratégia segura é centralizar a sincronização em métodos internos controlados.

---

### Metodo auxiliar removerOrdem

O método:

```java
public void removerOrdem(
        OrdemServicoEntity ordem
)
```

deve:

1. remover da coleção;
2. informar à Ordem que a associação foi desfeita;
3. manter o grafo Java consistente.

Entretanto, no schema oficial:

```text
cliente_id é NOT NULL.
```

Isso significa que uma Ordem persistida não pode ficar sem Cliente no banco.

Portanto, remover da coleção precisa representar uma destas intenções:

- transferir a Ordem imediatamente para outro Cliente;
- remover a própria Ordem;
- operar apenas em objeto novo ainda não persistido;
- rejeitar a operação para Ordem persistida.

No laboratório, a remoção bidirecional será permitida apenas para Ordem nova ainda transient ou em cenário seguido de exclusão explícita.

---

### Invariante da associacao obrigatoria

A Ordem terá:

```java
@ManyToOne(
        optional = false
)
@JoinColumn(
        nullable = false
)
```

Logo:

```text
uma Ordem persistente não pode ficar sem Cliente.
```

O método público da Ordem não oferecerá:

```java
removerCliente()
```

de forma irrestrita.

A transferência será feita com:

```java
clienteDestino.adicionarOrdem(ordem);
```

Esse método remove do Cliente anterior e associa ao novo em uma operação consistente.

---

### Encapsulamento da colecao

Não retorne a lista mutável diretamente.

Evite:

```java
public List<OrdemServicoEntity> getOrdens() {
    return ordens;
}
```

O chamador poderia executar:

```java
cliente.getOrdens().clear();
```

sem sincronizar as Ordens.

Use:

```java
public List<OrdemServicoEntity> getOrdens() {
    return List.copyOf(ordens);
}
```

ou uma visão não modificável.

Os métodos de domínio controlam mudanças.

---

### Inicializacao da colecao

A coleção deve ser inicializada no campo:

```java
private List<OrdemServicoEntity> ordens =
        new ArrayList<>();
```

Isso permite adicionar Ordens em um Cliente novo antes da persistência.

O construtor protegido não deve deixar a coleção nula.

---

### List versus Set

`List`:

- preserva posição em memória;
- permite duplicidades;
- não exige `equals` e `hashCode` para localizar;
- pode ser ordenada com `@OrderBy`;
- não representa automaticamente uma ordem física persistida.

`Set`:

- evita duplicidade conforme `equals` e `hashCode`;
- depende fortemente de igualdade estável;
- IDs gerados tornam implementação de entidades mais delicada;
- não garante ordenação sem tipo específico.

O laboratório usará `List`.

A prevenção de duplicidade será por referência e ID quando disponível.

---

---

### FetchType de OneToMany

O padrão JPA para coleções `OneToMany` é:

```text
LAZY.
```

O laboratório declarará explicitamente:

```java
fetch = FetchType.LAZY
```

para documentar a intenção.

Ao carregar Cliente:

```text
dados básicos podem ser lidos;

coleção pode permanecer não inicializada.
```

Ao acessar:

```java
cliente.getOrdens().size()
```

o provider executa a leitura da coleção.

---

### Colecao lazy e contexto aberto

A coleção lazy deve ser inicializada enquanto o persistence context está aberto.

Se o Cliente ficar detached e a coleção não tiver sido carregada, acessar fora do contexto pode gerar:

```text
LazyInitializationException.
```

Essa exceção é específica do Hibernate.

A correção não é manter o `EntityManager` aberto indefinidamente.

A solução profissional é carregar os dados necessários dentro do caso de uso.

---

### PersistenceUnitUtil

Use:

```java
factory.getPersistenceUnitUtil()
        .isLoaded(
                cliente,
                "ordens"
        );
```

Antes do acesso:

```text
esperado no Hibernate do laboratório:
false.
```

Depois de:

```java
cliente.getOrdens().size()
```

esperado:

```text
true.
```

A medição de SQL permanece específica do provider configurado.

---

### Cascade

O mapeamento oficial será:

```java
@OneToMany(
        mappedBy = "cliente",
        fetch = FetchType.LAZY
)
```

Sem cascade.

Isso significa:

```text
persistir Cliente não persiste Ordens novas;

merge de Cliente não deve ser usado para salvar grafo inteiro;

remover Cliente não remove Ordens;

cada operação de lifecycle é explícita.
```

---

### CascadeType.PERSIST

Em um agregado no qual o pai realmente controla o nascimento dos filhos, `PERSIST` pode fazer sentido.

No domínio didático desta aula, Ordem possui operação explícita e identidade própria.

Por isso, o laboratório oficial não usará cascade persist.

Um exercício controlado permitirá observar o efeito.

---

### CascadeType.REMOVE

Não será usado.

Remover Cliente e apagar todas as Ordens pode destruir histórico operacional.

A foreign key continuará bloqueando a remoção de Cliente em uso.

O caso de negócio deve decidir:

- inativar;
- bloquear;
- transferir;
- encerrar Ordens;
- remover explicitamente em ambiente de teste.

---

### CascadeType.ALL

`ALL` reúne todas as operações de cascade.

Usá-lo por conveniência é perigoso.

Ele pode propagar:

- persist;
- merge;
- remove;
- refresh;
- detach.

Cada propagação precisa de justificativa.

---

### orphanRemoval

Mapeamento conceitual:

```java
@OneToMany(
        mappedBy = "cliente",
        orphanRemoval = true
)
```

Com `orphanRemoval=true`, retirar uma Ordem da coleção pode agendar sua exclusão.

No laboratório oficial:

```text
orphanRemoval=false.
```

Motivo:

```text
retirar da coleção não deve ser confundido com apagar uma Ordem.
```

---

### orphanRemoval e CascadeType.REMOVE

São conceitos relacionados, mas diferentes.

`CascadeType.REMOVE` propaga a remoção do pai para os filhos.

`orphanRemoval` remove um filho que deixou de pertencer à associação do pai.

Ambos podem gerar `DELETE`.

Ambos precisam de critério rigoroso.

---

### Remover da colecao sem orphanRemoval

Se uma Ordem persistida for retirada apenas da lista, mas o lado proprietário continuar apontando para o Cliente:

```text
nenhuma mudança física ocorre.
```

Se o lado proprietário for definido como `null`, o flush falha porque `cliente_id` é obrigatório.

Se a Ordem for transferida para outro Cliente, a foreign key é atualizada.

Se a Ordem for removida explicitamente pelo `EntityManager`, o `DELETE` ocorre.

---

### Transferencia entre Clientes

O método:

```java
clienteB.adicionarOrdem(ordem)
```

deve:

```text
remover da coleção de A;

adicionar à coleção de B;

definir ordem.cliente = B.
```

No flush:

```text
UPDATE ordem_servico
SET cliente_id = B.
```

Não existe `UPDATE` na tabela Cliente.

---

### Ordem da persistencia sem cascade

Fluxo correto:

1. persistir Cliente;
2. persistir Ordem;
3. manter os dois lados sincronizados;
4. commit.

Quando Cliente já existe:

1. buscar Cliente;
2. criar Ordem;
3. chamar `cliente.adicionarOrdem(ordem)`;
4. persistir Ordem;
5. commit.

Adicionar à coleção não substitui `persist(ordem)`.

---

### Lado inverso nao gera foreign key sozinho

Considere:

```java
cliente.getOrdensInternal()
        .add(ordem);
```

sem alterar:

```java
ordem.cliente.
```

No flush, a foreign key não é atualizada pelo lado inverso.

O banco segue o lado proprietário.

Essa falha será demonstrada por um teste de consistência em memória sem persistir um grafo inválido.

---

### N mais um

Considere:

1. carregar três Clientes;
2. iterar;
3. acessar `cliente.getOrdens().size()` para cada um.

SQL possível:

```text
1 SELECT de Clientes;

3 SELECTs de coleções.
```

Total:

```text
N + 1.
```

A aula apenas introduzirá o problema.

Soluções como:

- join fetch;
- entity graph;
- batch fetching;
- DTO projection;
- consulta específica;

serão aprofundadas em aulas posteriores.

---

---

---

### Colecao e dirty checking

O provider acompanha alterações na coleção managed.

Adicionar ou remover elementos pode ser detectado no flush.

Entretanto, em uma associação bidirecional com `mappedBy`, a alteração física depende do lado proprietário.

A coleção ajuda a manter o grafo.

A foreign key é persistida pela Ordem.

---

### Colecao e equals

Operações como:

```java
ordens.remove(ordem)
```

usam `equals`.

Como as entidades não sobrescrevem `equals`, a remoção por referência funciona para a instância gerenciada atual.

Para evitar comportamento ambíguo com objetos detached, o método auxiliar pode localizar por:

- mesma referência;
- mesmo ID não nulo.

Não gere `equals` com todas as propriedades ou associações.

---

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\main\java\br\com\formacao\m13\aula333\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\main\java\br\com\formacao\m13\aula333\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\main\java\br\com\formacao\m13\aula333\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\main\java\br\com\formacao\m13\aula333\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-333-relacionamento-onetomany\src\test\java\br\com\formacao\m13\aula333"

Set-Location `
  "labs\m13\aula-333-relacionamento-onetomany"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 332.

Ajuste:

```text
artifactId:
aula-333-relacionamento-onetomany.

persistence unit:
aula333PU.

Main:
br.com.formacao.m13.aula333.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_333
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-333-jpa
JPA_POOL_NAME=aula-333-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration

Reutilize o schema da aula 332.

Ajustes:

```text
schema:
jpa_333.

cliente sequence:
333001.

ordem sequence:
333101.
```

Mantenha:

- tabela `cliente`;
- tabela `ordem_servico`;
- `cliente_id NOT NULL`;
- foreign key sem cascade delete;
- índice em `cliente_id`;
- índice de status.

Nenhuma tabela adicional é necessária.

---

### 4. Evoluir ClienteEntity.java

Adicione imports:

```java
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
```

Campo:

```java
@OneToMany(
        mappedBy = "cliente",
        fetch = FetchType.LAZY
)
@OrderBy("id ASC")
private List<OrdemServicoEntity> ordens =
        new ArrayList<>();
```

Getter:

```java
public List<OrdemServicoEntity> getOrdens() {
    return List.copyOf(ordens);
}
```

Não exponha a lista mutável.

---

### 5. Criar métodos auxiliares em Cliente

```java
public void adicionarOrdem(
        OrdemServicoEntity ordem
) {
    if (ordem == null) {
        throw new IllegalArgumentException(
                "ordem é obrigatória"
        );
    }

    if (containsOrdem(ordem)) {
        return;
    }

    ClienteEntity clienteAnterior =
            ordem.getCliente();

    if (
        clienteAnterior != null
        && clienteAnterior != this
    ) {
        clienteAnterior
                .removeInternal(ordem);
    }

    ordens.add(ordem);
    ordem.associarClienteInternal(this);
}

public void removerOrdemNova(
        OrdemServicoEntity ordem
) {
    if (ordem == null) {
        return;
    }

    if (ordem.getId() != null) {
        throw new IllegalStateException(
                "Ordem persistida deve ser "
                + "transferida ou removida explicitamente"
        );
    }

    if (removeInternal(ordem)) {
        ordem.associarClienteInternal(null);
    }
}

private boolean removeInternal(
        OrdemServicoEntity ordem
) {
    return ordens.removeIf(
            existente ->
                    sameIdentity(
                            existente,
                            ordem
                    )
    );
}

private boolean containsOrdem(
        OrdemServicoEntity ordem
) {
    return ordens.stream()
            .anyMatch(
                    existente ->
                            sameIdentity(
                                    existente,
                                    ordem
                            )
            );
}

private static boolean sameIdentity(
        OrdemServicoEntity first,
        OrdemServicoEntity second
) {
    if (first == second) {
        return true;
    }

    return first.getId() != null
            && second.getId() != null
            && first.getId()
                    .equals(second.getId());
}
```

O método interno pode ser package-private para permitir cooperação entre entidades no mesmo pacote.

---

### 6. Evoluir OrdemServicoEntity.java

Mantenha:

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

No construtor, não atribua diretamente.

Use:

```java
Objects.requireNonNull(
        cliente,
        "cliente é obrigatório"
);

cliente.adicionarOrdem(this);
```

Método interno:

```java
void associarClienteInternal(
        ClienteEntity cliente
) {
    this.cliente = cliente;
}
```

Método público de transferência:

```java
public void transferirPara(
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

    novoCliente.adicionarOrdem(this);
    this.atualizadaEm = agora;
}
```

O método mantém os dois lados.

---

### 7. Criar persistence.xml e runtime

Liste:

```text
ClienteEntity;

OrdemServicoEntity.
```

Use:

```text
aula333PU;

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

### 8. Criar OneToManyObservation.java

```java
package br.com.formacao.m13.aula333.lab;

public record OneToManyObservation(
        String etapa,
        long clienteId,
        int quantidadeOrdens,
        boolean collectionLoaded,
        boolean bidirectionalConsistent,
        long selectCount,
        long insertCount,
        long updateCount,
        long deleteCount
) {

    public OneToManyObservation {
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

### 9. Criar OneToManyReport.java

```java
package br.com.formacao.m13.aula333.lab;

import java.util.List;

public record OneToManyReport(
        List<OneToManyObservation> observations,
        boolean mappedByWorked,
        boolean helperSynchronizedBothSides,
        boolean collectionWasLazy,
        boolean noCascadeWasProven,
        boolean transferUpdatedOwner,
        boolean removingFromCollectionDidNotDelete,
        boolean foreignKeyStillProtected,
        boolean nPlusOneWasObserved
) {

    public OneToManyReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 10. Criar Clientes e Ordens

Primeira transação:

```text
CLI-JPA-333-A;

CLI-JPA-333-B;

CLI-JPA-333-C.
```

Persista os Clientes explicitamente.

Depois crie:

```text
OS-JPA-333-001;
OS-JPA-333-002;
```

Associe ao Cliente A por:

```java
clienteA.adicionarOrdem(ordem1);
clienteA.adicionarOrdem(ordem2);
```

Persista as Ordens explicitamente.

Flush e commit.

Confirme:

```text
dois INSERTs de Ordem;

cliente_id de ambas aponta para A;

coleção de A possui duas Ordens em memória.
```

---

### 11. Verificar mappedBy

Abra novo manager.

Busque Cliente A.

Use `PersistenceUnitUtil` para verificar a coleção antes do acesso.

Acesse:

```java
clienteA.getOrdens()
        .size()
```

Confirme:

```text
quantidade 2;

cada Ordem aponta para a mesma instância Cliente A;

nenhum UPDATE de foreign key foi necessário para carregar.
```

---

### 12. Verificar LAZY

Abra novo manager e limpe inspector.

Busque Cliente A.

Confirme:

```text
coleção não carregada;

SELECT apenas de Cliente.
```

Acesse a coleção.

Confirme:

```text
coleção carregada;

SELECT de ordem_servico com cliente_id.
```

Feche manager.

---

### 13. Provar ausencia de cascade persist

Crie Cliente transient:

```text
CLI-JPA-333-NOCASCADE.
```

Crie Ordem transient e associe por método auxiliar.

Abra manager e transação.

Persista somente o Cliente.

Flush.

Confirme:

```text
Cliente foi inserido;

Ordem não foi inserida automaticamente.
```

Execute rollback para não manter fixture.

Esse cenário prova que a coleção em memória não propaga `persist`.

---

### 14. Transferir Ordem

Abra manager e transação.

Busque Cliente A, Cliente B e Ordem 2.

Confirme que a coleção de A está inicializada antes da transferência.

Execute:

```java
ordem2.transferirPara(
        clienteB,
        agora
);
```

Confirme em memória:

```text
A não contém Ordem 2;

B contém Ordem 2;

Ordem 2 aponta para B.
```

Flush.

Confirme:

```text
um UPDATE de ordem_servico;

cliente_id aponta para B;

nenhum UPDATE em cliente.
```

Commit.

---

### 15. Remover Ordem nova da colecao

Crie uma Ordem transient para Cliente C.

Confirme:

```text
Cliente C contém a Ordem;

Ordem aponta para C.
```

Execute:

```java
clienteC.removerOrdemNova(
        ordemNova
);
```

Confirme:

```text
coleção não contém;

Ordem não possui Cliente;

nenhum SQL.
```

Não persista essa Ordem.

---

### 16. Provar orphanRemoval false

Abra manager e transação.

Busque Cliente A e Ordem 1.

Não exponha a coleção mutável.

Demonstre por um helper de teste controlado que retirar somente do lado inverso não deve ser usado para excluir.

O teste principal deve provar o comportamento profissional por uma operação explícita:

```java
entityManager.remove(ordem1);
```

Antes da remoção, retire a referência da coleção em memória por método interno seguro.

Flush.

Confirme:

```text
DELETE somente porque remove foi chamado;

não por orphanRemoval.
```

Rollback no teste de prova.

No fluxo principal, mantenha a Ordem até a limpeza final.

---

### 17. Introduzir N mais um

Crie uma Ordem para Cliente B e uma Ordem para Cliente C, de modo que existam três Clientes com coleções.

Abra novo manager.

Limpe inspector.

Execute uma JPQL mínima:

```java
List<ClienteEntity> clientes =
        entityManager.createQuery(
                """
                select c
                from Cliente c
                order by c.id
                """,
                ClienteEntity.class
        )
                .getResultList();
```

Depois:

```java
for (
    ClienteEntity cliente : clientes
) {
    cliente.getOrdens().size();
}
```

Observe:

```text
um SELECT de Clientes;

um SELECT de coleção por Cliente.
```

Registre o padrão N+1.

Não implemente a solução nesta aula.

---

### 18. Testar remocao de Cliente

Abra manager e transação.

Busque Cliente A.

Execute remove e flush.

A foreign key ainda aponta para A por pelo menos uma Ordem.

Espere falha.

Rollback.

Isso prova que a coleção inversa e a ausência de cascade não enfraqueceram a integridade do banco.

---

### 19. Limpeza final

Ordem correta:

1. remover todas as Ordens;
2. flush;
3. remover todos os Clientes;
4. commit.

Confirme:

```text
zero OS-JPA-333-%;

zero CLI-JPA-333-%.
```

---

### 20. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `OneToManyLab`;
4. imprime observações;
5. imprime booleanos;
6. não imprime SQL completo;
7. fecha runtime.

Formato:

```text
etapa | cliente | ordens | loaded | consistente | SELECT | INSERT | UPDATE
```

---

### 21. Criar OneToManyMappingIT.java

Casos:

#### Mapeamento

Use reflection para confirmar:

```text
@OneToMany;

mappedBy cliente;

fetch LAZY;

cascade vazio;

orphanRemoval false.
```

#### Coleção

- Cliente novo inicia lista vazia;
- getter retorna lista não modificável;
- duplicidade da mesma instância é ignorada.

#### Persistência

- persistir Cliente;
- adicionar Ordem;
- persistir Ordem;
- confirmar foreign key;
- rollback.

---

### 22. Criar BidirectionalConsistencyIT.java

#### Adicionar

- criar Cliente e Ordem;
- confirmar os dois lados.

#### Transferir

- persistir A, B e Ordem;
- transferir para B;
- confirmar coleções e lado proprietário;
- flush;
- confirmar FK;
- rollback.

#### Ordem repetida

- adicionar mesma Ordem duas vezes;
- confirmar apenas uma ocorrência.

#### Ordem persistida sem Cliente

O modelo não deve permitir remover Cliente de uma Ordem persistida.

Espere `IllegalStateException` no método inadequado.

---

### 23. Criar CollectionLifecycleIT.java

#### Sem cascade persist

- Cliente e Ordem novos associados;
- persistir somente Cliente;
- flush;
- confirmar Ordem sem ID e sem linha;
- rollback.

#### Sem orphanRemoval

- persistir Cliente e Ordem;
- alterar somente a coleção em helper controlado;
- flush;
- confirmar Ordem ainda existe;
- rollback.

#### Remove explícito

- remover Ordem com `EntityManager.remove`;
- confirmar DELETE;
- confirmar Cliente existe;
- rollback.

#### Remove Cliente protegido

- Cliente com Ordem;
- remove e flush;
- esperar foreign key violation.

---

### 24. Criar OneToManyFetchIT.java

#### Lazy

- find Cliente;
- `isLoaded` false;
- acessar size;
- `isLoaded` true;
- confirmar SELECT da coleção.

#### Fora do contexto

- buscar Cliente sem inicializar;
- fechar manager;
- acessar coleção;
- esperar exceção específica do provider ou comportamento documentado;
- não acoplar regra de negócio à exceção.

#### N mais um

- criar três Clientes;
- carregar lista;
- acessar coleções;
- contar SELECTs;
- confirmar padrão introdutório.

---

### 25. Criar TestDataCleaner.java

A limpeza deve respeitar:

```sql
DELETE FROM jpa_333.ordem_servico
WHERE codigo LIKE 'OS-JPA-333-%';

DELETE FROM jpa_333.cliente
WHERE codigo LIKE 'CLI-JPA-333-%';
```

Use antes e depois de cada teste.

---

### 26. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_333.
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
zero OS-JPA-333-%;

zero CLI-JPA-333-%;

foreign key existente;

índice cliente_id existente;

schema history com V1.
```

`05_limpar_database.ps1` remove somente o database isolado depois das evidências.

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
mappedBy correto;

coleção lazy;

dois lados sincronizados;

sem cascade persist;

transferência atualizou owner;

orphanRemoval ficou false;

remoção explícita preservou Cliente;

foreign key protegeu Cliente;

N+1 foi observado;

estado final ficou limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 28. Criar documentacao

`contrato-onetomany.md` deve registrar:

- cardinalidade;
- atributo;
- `mappedBy`;
- fetch;
- cascade;
- orphan removal;
- lado proprietário;
- lado inverso;
- foreign key.

`sincronizacao-bidirecional.md` deve desenhar:

```text
cliente.adicionarOrdem(ordem)
    -> cliente.ordens.add(ordem)
    -> ordem.cliente = cliente.
```

Inclua transferência e remoção.

`list-vs-set.md` deve comparar:

- duplicidade;
- ordem;
- igualdade;
- IDs gerados;
- remoção;
- performance;
- decisão da aula.

`cascade-e-orphan-removal.md` deve conter uma matriz:

```text
Operação | Configuração | Efeito | Risco
```

Inclua `PERSIST`, `MERGE`, `REMOVE`, `ALL` e `orphanRemoval`.

`n-mais-um-introducao.md` deve registrar:

- cenário;
- SQL observado;
- N;
- impacto;
- soluções futuras;
- proibição de trocar tudo para EAGER.

`troubleshooting-onetomany.md` deve cobrir:

- mappedBy incorreto;
- coleção nula;
- lados inconsistentes;
- Ordem duplicada;
- cascade ausente;
- delete inesperado;
- orphan removal;
- lazy initialization;
- N+1;
- foreign key violation.

---

## Entendendo o que foi feito

### O lado inverso foi adicionado sem mover a foreign key

Cliente passou a navegar para Ordens, mas Ordem continuou controlando `cliente_id`.

### O grafo passou a exigir sincronizacao

Métodos auxiliares mantiveram coleção e referência coerentes.

### A colecao foi encapsulada

O chamador não pode modificar a lista sem passar pelas regras.

### Cascade e orphan removal foram tratados com criterio

O fluxo oficial manteve operações explícitas e evitou deleções implícitas.

### N mais um ficou visivel

A coleção lazy evitou carga inicial, mas acessos em loop produziram consultas adicionais.

---

## Erros comuns importantes

### Usar mappedBy com nome da coluna

Use o atributo Java `cliente`.

### Alterar somente a colecao

A foreign key segue o lado proprietário.

### Expor lista mutavel

O chamador pode quebrar os dois lados.

### Ativar ALL e orphanRemoval por conveniencia

Isso pode apagar histórico operacional.

### Resolver N mais um com EAGER global

Planeje a consulta do caso de uso.

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

### Consultar colecoes

```sql
SELECT
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo,
    count(ordem.id) AS quantidade_ordens
FROM jpa_333.cliente AS cliente
LEFT JOIN jpa_333.ordem_servico AS ordem
    ON ordem.cliente_id = cliente.id
GROUP BY
    cliente.id,
    cliente.codigo
ORDER BY cliente.id;
```

---

## Exercicio guiado

### Parte 1 — Set

Troque a coleção por `LinkedHashSet` em uma branch experimental.

Defina uma estratégia segura de igualdade.

Documente por que ID gerado complica `hashCode`.

Restaure `List`.

### Parte 2 — Cascade PERSIST

Ative somente `PERSIST` em base descartável.

Persista Cliente com Ordem nova.

Observe os INSERTs.

Remova a configuração e registre quando faria sentido.

### Parte 3 — orphanRemoval

Ative `orphanRemoval=true` em branch descartável.

Retire uma Ordem da coleção e sincronize os dois lados.

Observe o DELETE.

Restaure `false`.

### Parte 4 — Ordem persistida

Tente deixar Ordem persistida sem Cliente.

Confirme falha da regra Java ou da foreign key.

### Parte 5 — N mais um

Crie dez Clientes com uma Ordem cada.

Carregue os Clientes e acesse as coleções.

Conte SELECTs.

Não implemente solução nesta aula.

### Parte 6 — EAGER

Troque temporariamente o fetch da coleção para EAGER.

Compare SQL e volume.

Restaure LAZY.

### Parte 7 — Ordenacao

Troque `@OrderBy("id ASC")` por:

```java
@OrderBy("criadaEm DESC")
```

Confirme a ordem.

Não confunda com coluna de posição.

### Parte 8 — ADR

Registre a decisão:

```text
List;

LAZY;

mappedBy cliente;

sem cascade;

orphanRemoval false;

métodos auxiliares obrigatórios.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 333 existe;
- continuidade com a aula 332 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_333` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi evoluída;
- `OrdemServicoEntity` foi evoluída;
- `@OneToMany` foi aplicado;
- coleção de Ordens foi criada;
- coleção foi inicializada;
- `mappedBy="cliente"` foi usado;
- mappedBy apontou para atributo Java;
- Cliente foi identificado como lado inverso;
- Ordem permaneceu lado proprietário;
- `@JoinColumn` permaneceu na Ordem;
- nenhuma segunda foreign key foi criada;
- associação bidirecional foi explicada;
- método `adicionarOrdem` foi criado;
- método de transferência foi criado;
- os dois lados foram sincronizados;
- recursão infinita foi evitada;
- duplicidade da mesma Ordem foi evitada;
- coleção mutável não foi exposta;
- `List.copyOf` ou visão imutável foi usada;
- `List` foi praticada;
- `Set` foi comparado;
- `FetchType.LAZY` foi usado;
- lazy padrão de OneToMany foi explicado;
- `PersistenceUnitUtil.isLoaded` foi usado;
- coleção foi inicializada dentro do contexto;
- acesso fora do contexto foi discutido;
- cascade permaneceu vazio;
- ausência de cascade persist foi provada;
- Cliente não persistiu Ordem automaticamente;
- `CascadeType.REMOVE` não foi usado;
- `CascadeType.ALL` não foi usado;
- `orphanRemoval=false` foi mantido;
- remoção da coleção não foi confundida com DELETE;
- remoção explícita foi praticada;
- Ordem removida preservou Cliente;
- transferência atualizou `cliente_id`;
- versão da Ordem foi incrementada;
- Cliente não sofreu UPDATE na transferência;
- foreign key continuou obrigatória;
- remoção de Cliente referenciado falhou;
- índice da foreign key foi mantido;
- N+1 foi introduzido;
- padrão de SELECTs foi observado;
- EAGER global não foi adotado;
- SQL foi observado sem bindings;
- testes de mapping foram criados;
- testes de consistência foram criados;
- testes de lifecycle foram criados;
- testes de fetch foram criados;
- limpeza respeitou a foreign key;
- fixtures foram removidas;
- estado final ficou vazio;
- ManyToMany não foi antecipado;
- Spring não foi usado;
- ponte para a aula 334 está correta;
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
  labs/m13/aula-333-relacionamento-onetomany
```

Commit recomendado:

```powershell
git commit -m "feat(m13): mapear relacionamento onetomany"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você adicionou a navegação inversa do relacionamento Cliente–Ordem.

Aprendeu:

```text
@OneToMany:
um Cliente para várias Ordens.

mappedBy:
atributo proprietário.

lado inverso:
Cliente.

lado proprietário:
Ordem.

coleção:
List encapsulada.

LAZY:
carregamento adiado.

método auxiliar:
sincronização dos dois lados.

cascade:
propagação de lifecycle.

orphanRemoval:
remoção do filho órfão.

N+1:
consultas adicionais em loop.
```

O laboratório comprovou:

```text
Cliente com duas Ordens;

foreign key controlada pela Ordem;

mappedBy correto;

coleção lazy;

grafo bidirecional consistente;

sem persistência automática por cascade;

transferência entre Clientes;

remoção explícita sem remover Cliente;

foreign key protegendo Cliente;

N+1 em acesso repetido.
```

A próxima aula será:

```text
334 - M13.24 - ManyToMany com criterio
```

Nela, você estudará:

- cardinalidade muitos-para-muitos;
- tabela de junção;
- `@ManyToMany`;
- `@JoinTable`;
- lados proprietário e inverso;
- sincronização bidirecional;
- cascade;
- remoção;
- limites do mapeamento direto;
- quando criar entidade associativa;
- atributos na associação;
- histórico;
- auditoria;
- Ordem e Técnico como exemplo;
- critérios para evitar `ManyToMany` ingênuo.

A aula 333 mostrou uma coleção baseada em foreign key.

A aula 334 mostrará uma associação baseada em tabela intermediária e por que ela exige ainda mais critério.

---

# Material complementar

## Checkpoint final

- [ ] Usei `@OneToMany` com `mappedBy`.
- [ ] Mantive Ordem como lado proprietário.
- [ ] Sincronizei os dois lados com métodos auxiliares.
- [ ] Mantive cascade e orphanRemoval desativados.
- [ ] Observei lazy loading e N+1.

---

## Troubleshooting adicional

### mappedBy references an unknown property

O valor precisa ser o atributo Java `cliente`.

### Colecao continua vazia

Os dois lados não foram sincronizados ou a associação não foi carregada.

### Ordem foi inserida sem eu chamar persist

Existe cascade persist configurado.

### Ordem foi apagada ao retirar da lista

Existe orphanRemoval ativo.

### LazyInitializationException

A coleção foi acessada depois do fechamento do contexto.

---

## Perguntas de revisao

1. O que significa OneToMany?
2. Onde fica a foreign key?
3. Quem é o lado proprietário?
4. Quem é o lado inverso?
5. O que `mappedBy` recebe?
6. `mappedBy` recebe nome da coluna?
7. Por que sincronizar os dois lados?
8. JPA faz isso automaticamente em memória?
9. Por que encapsular a coleção?
10. Qual coleção foi usada?
11. Qual é o fetch padrão?
12. Cascade foi usado?
13. O que faz orphanRemoval?
14. Ele foi ativado?
15. Remover da coleção apaga a Ordem?
16. Como transferir uma Ordem?
17. O que é N+1?
18. EAGER resolve sempre?
19. ManyToMany foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma entidade para várias.
2. Na tabela Ordem.
3. OrdemServicoEntity.
4. ClienteEntity.
5. Nome do atributo proprietário.
6. Não.
7. Para manter o grafo coerente.
8. Não.
9. Para proteger invariantes.
10. List.
11. LAZY.
12. Não.
13. Remove filho órfão.
14. Não.
15. Não no mapeamento oficial.
16. Atualizando os dois lados e o owner.
17. Uma query inicial e N adicionais.
18. Não.
19. Não.
20. ManyToMany com criterio.

---

## Desafio opcional

Crie:

```java
OneToManyContractInspector
```

Ele deve ler por reflection:

```text
atributo;

tipo da coleção;

mappedBy;

fetch;

cascade;

orphanRemoval;

OrderBy.
```

Saída:

```text
Markdown determinístico.
```

Regras:

- nenhuma API interna Hibernate;
- nenhuma conexão;
- lista imutável;
- testes unitários;
- falhar quando não houver `@OneToMany`;
- não afirmar qual lado controla a FK sem verificar o atributo proprietário;
- comparar o contrato com a decisão arquitetural da aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 333 - M13.23 - Relacionamento OneToMany

- Adicionei a navegação Cliente para Ordens.
- Usei `@OneToMany`.
- Usei `mappedBy="cliente"`.
- Entendi que mappedBy aponta para atributo Java.
- Mantive Ordem como lado proprietário.
- Mantive `@JoinColumn` na Ordem.
- Entendi Cliente como lado inverso.
- Criei coleção inicializada de Ordens.
- Usei `List`.
- Comparei `List` e `Set`.
- Encapsulei a coleção.
- Evitei exposição de lista mutável.
- Criei método `adicionarOrdem`.
- Criei transferência entre Clientes.
- Sincronizei os dois lados.
- Evitei recursão infinita.
- Evitei duplicidade da mesma Ordem.
- Mantive `FetchType.LAZY`.
- Usei `PersistenceUnitUtil.isLoaded`.
- Inicializei coleção dentro do contexto.
- Estudei acesso lazy fora do contexto.
- Mantive cascade desativado.
- Provei ausência de cascade persist.
- Mantive `CascadeType.REMOVE` desativado.
- Mantive `CascadeType.ALL` desativado.
- Mantive `orphanRemoval=false`.
- Diferenciei retirar da coleção de remover a entidade.
- Removi Ordem explicitamente.
- Preservei Cliente após remover Ordem.
- Transferi Ordem entre Clientes.
- Observei update de `cliente_id`.
- Mantive foreign key e índice.
- Introduzi o problema N+1.
- Evitei resolver tudo com EAGER.
- Não antecipei ManyToMany ou Spring.
- Próxima aula: ManyToMany com criterio.
```

---

## Referencia tecnica curta

```text
@OneToMany:
um para muitos.

mappedBy:
atributo proprietário.

Owner:
Ordem.

Inverse:
Cliente.

List:
coleção escolhida.

LAZY:
carregamento adiado.

Cascade:
propagação.

orphanRemoval:
DELETE do órfão.

Helper:
sincroniza os lados.

N+1:
uma query mais N.
```

Regra final:

```text
um OneToMany bidirecional profissional exige manter a foreign key no lado proprietário, usar mappedBy corretamente, encapsular a coleção, sincronizar os dois lados e decidir cascade, orphanRemoval e estratégia de carregamento a partir do ciclo de vida real do domínio.
```
