# 371 - M14.16 - Service layer use cases e transacoes

## Apresentacao da aula

Na aula 370, você concluiu o bloco de validação da entrada HTTP.

O projeto passou a possuir:

```text
constraints prontas;

constraints customizadas;

validator de valor;

constraint de classe;

validacao entre campos;

mensagens externalizadas;

validators stateless;

zero I/O durante validation.
```

Uma decisão importante foi preservada:

```text
regra local e deterministica:
Bean Validation.

regra dependente do estado atual:
service.
```

Exemplos de regras que não pertencem a uma constraint:

- verificar duplicidade no armazenamento;
- decidir se um recurso pode ser removido;
- coordenar várias operações;
- garantir atomicidade;
- aplicar idempotência de caso de uso;
- escolher a ordem entre leitura e gravação;
- definir a fronteira transacional;
- decidir rollback.

Agora surge a pergunta central desta aula:

```text
como organizar casos de uso
e definir a fronteira transacional
da aplicacao?
```

A resposta será construída por meio de:

- service layer;
- application service;
- use cases;
- commands;
- results;
- ports;
- repository boundary;
- orchestration;
- `@Transactional`;
- `readOnly`;
- rollback;
- propagation;
- isolation;
- transaction manager;
- AOP proxy;
- testes unitários;
- testes transacionais instrumentados.

Até este ponto, o projeto possui uma classe:

```text
ManagedRuntimeMessageService.
```

Ela já executa criação, busca, duplicidade e exclusão.

Nesta aula, essa estrutura será refinada.

O resultado será:

```text
ManagedRuntimeMessageUseCases:
porta de entrada da aplicacao.

ManagedRuntimeMessageApplicationService:
implementacao dos casos de uso.

ManagedRuntimeMessageRepositoryPort:
porta de persistencia.

InMemoryManagedRuntimeMessageRepositoryAdapter:
adaptador atual em memoria.
```

O controller dependerá da porta de entrada:

```text
ManagedRuntimeMessageUseCases.
```

O application service dependerá da porta de persistência:

```text
ManagedRuntimeMessageRepositoryPort.
```

O controller não conhecerá o adaptador em memória.

O service não conhecerá HTTP.

O port não conhecerá Spring Data.

Essa separação prepara a próxima aula:

```text
372 - M14.17 - Repository layer Spring Data
```

Na aula 372, o adaptador em memória poderá ser substituído ou complementado por um adaptador Spring Data sem mudar a intenção do caso de uso.

Esta aula também introduzirá transações declarativas.

Será adicionada a dependency:

```text
org.springframework:spring-tx.
```

A versão continuará gerenciada pelo Spring Boot.

Os métodos de leitura usarão:

```java
@Transactional(
        readOnly = true
)
```

Os métodos de escrita usarão:

```java
@Transactional
```

Entretanto, existe uma fronteira importante.

O projeto ainda não possui:

- DataSource;
- JPA;
- Spring Data;
- transaction manager de banco;
- recurso transacional real.

`@Transactional` é metadata e não cria uma transação sozinha.

Para que ela seja executada, são necessários:

```text
infraestrutura de transaction management;

TransactionManager;

proxy ou weaving;

invocacao passando pelo interceptor.
```

Por isso, a aula adotará duas camadas de prática:

Primeira:

```text
codigo de producao:
service layer e metadata transacional
prontos para o recurso real.
```

Segunda:

```text
src/test:
RecordingTransactionManager
para observar begin, commit, rollback,
readOnly e propagation.
```

O transaction manager de teste não será apresentado como banco.

Ele servirá apenas para comprovar o comportamento do interceptor Spring.

Ele não será colocado em produção.

A rollback de dados reais será praticada quando um recurso transacional verdadeiro for adicionado.

Essa honestidade evita um antipadrão frequente:

```text
usar um mapa em memoria,
anotar com @Transactional
e afirmar que os dados possuem rollback real.
```

O mapa não participa automaticamente da transação.

Os testes desta aula distinguirão:

```text
rollback da fronteira Spring;

rollback de um recurso real.
```

Também serão estudados:

- transação física;
- escopo lógico;
- `PlatformTransactionManager`;
- `TransactionDefinition`;
- `TransactionStatus`;
- `TransactionInterceptor`;
- propagação `REQUIRED`;
- `REQUIRES_NEW` conceitual;
- `SUPPORTS`;
- `MANDATORY`;
- `NOT_SUPPORTED`;
- `NEVER`;
- `NESTED`;
- isolamento conceitual;
- timeout;
- read-only como hint;
- exception unchecked;
- exception checked;
- `rollbackFor`;
- `noRollbackFor`;
- rollback-only;
- self-invocation;
- métodos públicos;
- annotation na classe;
- override no método;
- `TransactionTemplate`;
- idempotência de caso de uso;
- limites de chamadas externas dentro de transação.

A aula não adicionará:

- Spring Data;
- `JpaRepository`;
- entity JPA;
- Hibernate persistence;
- DataSource;
- Flyway;
- PostgreSQL;
- H2;
- Testcontainers;
- `@ControllerAdvice`;
- Problem Details;
- repository real de banco;
- evento transacional;
- outbox;
- saga;
- transação distribuída.

Esses assuntos possuem etapas próprias.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
372 - M14.17 - Repository layer Spring Data
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
367:
DTO request response.

368:
mappers manuais.

369:
Bean Validation.

370:
validacoes customizadas.

371:
service layer, use cases e transacoes.

372:
repository layer Spring Data.

373:
exception handler global.

374:
Problem Details.
```

A aula 370 respondeu:

```text
como criar validacoes declarativas
para regras locais customizadas?
```

A aula 371 responderá:

```text
como executar regras dependentes de estado,
orquestrar colaboradores
e definir a unidade transacional?
```

Nesta aula:

```text
service layer:
sim.

application service:
sim.

use case:
sim.

input port:
sim.

repository port:
sim.

adapter em memoria:
sim.

orchestration:
sim.

@Transactional:
sim.

readOnly:
sim.

rollback:
sim.

checked versus unchecked:
sim.

propagation:
introducao pratica com REQUIRED.

isolation:
conceitual.

TransactionTemplate:
fixture isolada.

Spring Data:
nao.

banco:
nao.

rollback real de dados:
nao.

global error handler:
nao.
```

A principal regra será:

```text
controller adapta HTTP;

application service executa o caso de uso;

port abstrai a persistencia;

transaction boundary envolve
a unidade de trabalho da aplicacao.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será reorganizada para:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageUseCases.java
│       ├── ManagedRuntimeMessageApplicationService.java
│       ├── command
│       │   └── ManagedRuntimeMessageCreateCommand.java
│       ├── port
│       │   └── ManagedRuntimeMessageRepositoryPort.java
│       └── result
│           ├── ManagedRuntimeMessageCreateOutcome.java
│           └── ManagedRuntimeMessageCreateResult.java
├── domain
│   └── managedmessage
│       └── ManagedRuntimeMessage.java
├── infrastructure
│   └── persistence
│       └── memory
│           └── InMemoryManagedRuntimeMessageRepositoryAdapter.java
└── web
    ├── controller
    ├── mapper
    ├── request
    └── response
```

A feature runtime sem persistência pode permanecer em sua estrutura atual.

O foco transacional será a feature:

```text
managed runtime messages.
```

Dependency nova:

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
</dependency>
```

Testes novos:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageApplicationServiceTest.java
│       ├── ManagedRuntimeMessageUseCaseIdempotencyTest.java
│       ├── ManagedRuntimeMessageStateValidationTest.java
│       └── ServiceLayerArchitectureTest.java
└── transaction
    ├── RecordingTransactionManager.java
    ├── TransactionTestConfiguration.java
    ├── TransactionBoundaryIT.java
    ├── ReadOnlyTransactionIT.java
    ├── RuntimeExceptionRollbackIT.java
    ├── CheckedExceptionRollbackIT.java
    ├── PropagationRequiredIT.java
    ├── SelfInvocationTransactionIT.java
    ├── TransactionMetadataTest.java
    └── TransactionTemplateTest.java
```

Documentação externa:

```text
docs
├── service-layer.md
├── application-service-use-case.md
├── ports-and-adapters-introduction.md
├── transaction-boundary.md
├── transactional-proxy.md
├── transactional-defaults.md
├── rollback-rules.md
├── transaction-propagation.md
├── transaction-isolation-readonly.md
├── self-invocation-transactions.md
├── declarative-vs-programmatic-transactions.md
└── service-transaction-baseline.md
```

Scripts:

```text
scripts
├── 81_executar_testes_service_layer.ps1
├── 82_executar_testes_transaction_boundary.ps1
├── 83_testar_rollback_rules.ps1
├── 84_testar_propagation_required.ps1
├── 85_validar_self_invocation.ps1
└── 86_validar_arquitetura_service.ps1
```

Resultados esperados:

```text
controller dependendo de service concreto:
zero.

controller dependendo de input port:
sim.

application service:
um bean.

repository port:
interface sem Spring Data.

adapter em memoria:
implementa port.

service importando web:
zero.

service importando HttpStatus:
zero.

service importando ResponseEntity:
zero.

service importando adapter concreto:
zero.

create:
transacao read-write.

find:
transacao read-only.

delete:
transacao read-write.

RuntimeException:
rollback registrado.

checked exception sem rollbackFor:
commit registrado.

checked exception com rollbackFor:
rollback registrado.

REQUIRED externo e interno:
uma transacao fisica no teste.

self-invocation:
nao inicia advice interno.

TransactionTemplate:
commit e rollbackOnly observados.

rollback de mapa em memoria:
nao alegado.
```

---

## Conceito essencial

### Service layer

Service layer define a fronteira das operações oferecidas pela aplicação.

Ela coordena:

- comandos;
- regras;
- repositórios;
- políticas;
- tempo;
- autorização já resolvida;
- eventos futuros;
- transação.

Ela não deve conhecer detalhes de HTTP.

Também não deve ser apenas uma coleção de métodos que repassam chamadas sem intenção.

---

### Application service

Application service implementa casos de uso, orquestra objetos e ports e permanece sem detalhes de serialização ou status HTTP.

O nome `ManagedRuntimeMessageApplicationService` deixa explícita sua camada.

---

### Use case

Use case descreve uma capacidade oferecida ao ator, com entrada, regras, resultado, efeitos e fronteira transacional.

Nesta aula, uma interface agregará os três casos simples atuais; projetos maiores podem separar uma interface por operação.

---

### Input port

A interface:

```text
ManagedRuntimeMessageUseCases
```

é uma porta de entrada.

Ela permite que a web invoque a aplicação sem depender da implementação concreta.

O controller conhece o contrato.

O Spring injeta a implementação.

A interface não recebe annotations HTTP.

---

### Output port

A interface:

```text
ManagedRuntimeMessageRepositoryPort
```

é uma porta de saída.

Ela declara o que o caso de uso precisa da persistência:

- salvar;
- buscar por id;
- verificar duplicidade;
- remover.

Ela não declara:

- SQL;
- JPA;
- `JpaRepository`;
- tabela;
- query derivada;
- `EntityManager`.

A próxima aula criará um adaptador Spring Data.

---

### Adapter

O adaptador em memória implementa o port com `ConcurrentHashMap` e `AtomicLong`.

O application service não conhece a forma de armazenamento.

---

### Orchestration

Orquestração organiza a sequência do caso de uso.

Exemplo de criação:

1. receber command;
2. verificar duplicidade;
3. criar modelo;
4. salvar;
5. retornar result.

Cada etapa possui intenção.

O controller não executa essa sequência.

---

### Validacao dependente de estado

A regra de duplicidade depende do conteúdo armazenado.

Ela não pertence a:

```text
@Constraint.
```

Ela pertence ao caso de uso.

O service consulta o repository port e decide o outcome:

```text
CREATED;

DUPLICATE.
```

---

### Transaction boundary

A fronteira transacional deve envolver a unidade de trabalho que precisa ser atômica.

Na criação:

```text
verificar duplicidade;

criar;

salvar.
```

Quando existir banco real, essas etapas precisam participar da mesma transação adequada.

A annotation ficará no application service.

Não no controller.

---

### Transaction manager

Spring usa uma abstração:

```text
TransactionManager.
```

Para fluxo imperativo, a interface central é:

```text
PlatformTransactionManager.
```

Implementações concretas integram recursos como:

- JDBC;
- JPA;
- Hibernate;
- JTA.

A aplicação usa uma programação consistente.

O manager concreto depende da infraestrutura.

---

### TransactionDefinition

`TransactionDefinition` descreve atributos como:

- propagation;
- isolation;
- timeout;
- read-only;
- name.

O transaction interceptor cria essa definição a partir de `@Transactional`.

O manager decide como aplicá-la ao recurso.

---

### TransactionStatus

`TransactionStatus` representa o estado transacional e permite marcar rollback-only, consultar completion e trabalhar com savepoints quando suportado.

Código de negócio normalmente não o manipula diretamente.

---

### TransactionInterceptor

A transação declarativa usa AOP.

Fluxo simplificado:

```text
caller;

transactional proxy;

TransactionInterceptor;

TransactionManager begin;

application service;

commit ou rollback;

return ou exception.
```

A chamada precisa passar pelo proxy.

---

### @Transactional como metadata

`@Transactional` não executa SQL.

Ela descreve semântica transacional.

Pode ser aplicada em:

- classe;
- método;
- interface, embora o curso prefira implementação concreta.

O método pode sobrescrever atributos definidos na classe.

---

### Convencao de annotation

A classe será:

```java
@Service
@Transactional(
        readOnly = true
)
public class ManagedRuntimeMessageApplicationService
        implements ManagedRuntimeMessageUseCases {
}
```

Métodos de escrita sobrescrevem:

```java
@Transactional
```

Resultado:

```text
leitura:
readOnly true.

escrita:
readOnly false.
```

Apenas métodos públicos de caso de uso serão expostos.

Helpers permanecem privados e não recebem annotation.

---

### readOnly

`readOnly=true` é uma indicação semântica para a infraestrutura.

Pode permitir otimizações.

Não é:

- mecanismo de segurança;
- garantia universal de que nenhuma escrita ocorrerá;
- substituto para permissões;
- validação automática de todas as mutações.

O comportamento concreto depende do transaction manager e do recurso.

---

### Defaults de @Transactional

Defaults importantes:

```text
propagation:
REQUIRED.

isolation:
DEFAULT.

readOnly:
false.

timeout:
default do sistema.

rollback:
RuntimeException e Error.
```

Checked exceptions não provocam rollback automático por padrão.

Esses defaults precisam ser conhecidos antes de adicionar a annotation mecanicamente.

---

### Propagation REQUIRED

`REQUIRED` significa:

```text
se existe transacao:
participar.

se nao existe:
criar.
```

Cada método transactional possui um escopo lógico.

Vários escopos podem participar da mesma transação física.

No teste:

```text
OuterService
    -> InnerService.
```

Ambos usam REQUIRED.

O manager deve registrar um begin e um commit físicos.

---

### Rollback-only e REQUIRED

Um escopo interno pode marcar rollback-only.

O outer ainda pode tentar commit.

A infraestrutura precisa informar que o commit esperado não ocorreu.

Em cenários reais, isso pode gerar:

```text
UnexpectedRollbackException.
```

A aula apresenta o conceito sem criar um fluxo artificial de produção.

---

### Outras propagations

`REQUIRES_NEW` suspende a transação existente e cria outra física, com commit e rollback independentes e possível uso de conexão adicional.

`SUPPORTS` participa quando existe transação; `MANDATORY` exige uma; `NOT_SUPPORTED` executa sem transação; `NEVER` rejeita contexto transacional; `NESTED` depende de savepoints e suporte do manager.

Nenhuma delas será aplicada à feature sem necessidade concreta.

---

### Isolation e timeout

Isolation controla como transações concorrentes observam dados. `Isolation.DEFAULT` delega ao recurso; níveis mais fortes podem reduzir concorrência e não devem ser escolhidos por medo.

Timeout limita a duração transacional quando suportado. Ele não substitui timeout HTTP, cancelamento, limite de consulta ou circuit breaker.

---

### Runtime exception

Por padrão:

```text
RuntimeException
```

e:

```text
Error
```

marcam rollback.

Uma exception de negócio unchecked pode ser usada quando o caso de uso precisa abortar.

Nesta feature atual, outcomes continuam preferidos para resultados esperados como duplicidade.

---

### Checked exception

Uma checked exception não causa rollback automático por padrão.

Exemplo de fixture:

```java
@Transactional
public void checkedFailure()
        throws Exception {
    throw new Exception(
            "checked"
    );
}
```

O recording manager registrará commit.

Isso não significa que a exception é ignorada.

Significa somente que a regra padrão não marcou rollback.

---

### rollbackFor

Para provocar rollback com checked exception:

```java
@Transactional(
        rollbackFor = Exception.class
)
```

Use a classe mais específica possível.

Não configure:

```text
rollbackFor = Throwable.class
```

sem necessidade.

---

### noRollbackFor

`noRollbackFor` pode impedir rollback para uma exception que normalmente causaria.

Esse recurso deve ser raro.

Uma exception após escrita parcial normalmente indica que commit pode ser perigoso.

A aula demonstra metadata em fixture, sem aplicá-la à feature.

---

### Self-invocation

Considere:

```java
public void outer() {
    innerTransactional();
}

@Transactional
public void innerTransactional() {
}
```

A chamada interna:

```text
this.innerTransactional()
```

não passa pelo proxy.

A annotation de `innerTransactional` não inicia uma nova transação nesse caminho.

Soluções adequadas:

- colocar a fronteira no método público externo;
- mover o colaborador para outro bean;
- redesenhar o caso de uso;
- usar `TransactionTemplate` quando realmente necessário.

Não use self-injection como correção padrão.

---

### Visibilidade de metodo

O curso utilizará `@Transactional` em métodos públicos de application service.

Isso mantém compatibilidade com diferentes estratégias de proxy e comunica a API do caso de uso.

Métodos privados não podem ser interceptados por proxy.

Não anote helper privado esperando transação.

---

### Classe final e metodo final

Proxies baseados em subclass não conseguem sobrescrever métodos final.

Para evitar comportamento dependente da estratégia:

- application service não será final;
- métodos transacionais não serão final;
- controller depende da interface.

---

### Declarative transactions

O modelo declarativo mantém código de transação fora da regra principal.

Exemplo:

```java
@Transactional
public CreateResult create(...) {
    // caso de uso
}
```

Spring executa begin, commit e rollback ao redor.

É a escolha padrão do curso.

---

### TransactionTemplate

`TransactionTemplate` oferece transação programática imperativa.

Exemplo:

```java
transactionTemplate.execute(
        status -> {
            // operacao
            return result;
        }
);
```

É útil quando:

- poucas operações precisam de controle programático;
- a fronteira precisa estar dentro de um método maior;
- rollback-only precisa ser marcado explicitamente;
- callbacks deixam a intenção mais clara.

Ele acopla o código à API Spring.

Será usado somente em teste de conceito.

---

### Chamadas externas e limites

Evite manter transação aberta durante HTTP remoto, email, espera longa ou processamento pesado. Locks e conexões permanecem ocupados, e rollback local não desfaz efeitos externos.

Uma transação de banco não inclui automaticamente API remota, Kafka, arquivos ou email. Outbox, saga e consistência eventual serão estudados depois.

---

### Idempotencia de caso de uso

Repetir a mesma intenção deve produzir efeito controlado. Na criação atual, a primeira tentativa retorna `CREATED`, a segunda `DUPLICATE`, e nenhum segundo recurso é criado.

A transação ajuda na atomicidade, mas não define sozinha a idempotência.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 2. Adicionar spring-tx

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
</dependency>
```

Não declare versão.

Execute:

```powershell
.\mvnw.cmd dependency:tree
```

Confirme `spring-tx` alinhado ao Spring Framework do Boot.

---

### 3. Criar packages application e domain

Crie:

```text
br.com.formacao.backend.application.managedmessage;

br.com.formacao.backend.domain.managedmessage;

br.com.formacao.backend.infrastructure.persistence.memory.
```

Mova os tipos preservando comportamento.

Atualize imports de forma controlada.

---

### 4. Mover ManagedRuntimeMessage

O record de modelo vai para:

```text
domain.managedmessage.
```

Ele não recebe annotations web ou de persistência.

A próxima aula decidirá o modelo de persistência.

Não adicione `@Entity`.

---

### 5. Criar ManagedRuntimeMessageRepositoryPort

Interface:

```java
public interface ManagedRuntimeMessageRepositoryPort {

    ManagedRuntimeMessage save(
            ManagedRuntimeMessage message
    );

    Optional<ManagedRuntimeMessage> findById(
            long id
    );

    boolean existsByNormalizedValue(
            String normalizedValue
    );

    boolean deleteById(
            long id
    );

    long nextId();
}
```

Se a baseline atual gera id no store, mantenha a operação necessária de forma explícita.

A aula seguinte poderá revisar essa decisão para banco.

---

### 6. Criar InMemoryManagedRuntimeMessageRepositoryAdapter

Implemente o port.

Use:

```java
@Repository
public class InMemoryManagedRuntimeMessageRepositoryAdapter
        implements ManagedRuntimeMessageRepositoryPort {
}
```

Mantenha:

- `ConcurrentHashMap`;
- `AtomicLong`;
- normalização;
- cópias imutáveis.

Não use Spring Data.

---

### 7. Criar ManagedRuntimeMessageUseCases

Interface:

```java
public interface ManagedRuntimeMessageUseCases {

    ManagedRuntimeMessageCreateResult create(
            ManagedRuntimeMessageCreateCommand command
    );

    Optional<ManagedRuntimeMessage> findById(
            long id
    );

    boolean deleteById(
            long id
    );
}
```

Não adicione stereotype.

Não adicione `@Transactional` na interface.

---

### 8. Criar ManagedRuntimeMessageApplicationService

Estrutura:

```java
@Service
@Transactional(
        readOnly = true
)
public class ManagedRuntimeMessageApplicationService
        implements ManagedRuntimeMessageUseCases {
}
```

Injete:

```text
ManagedRuntimeMessageRepositoryPort;

Clock.
```

Não injete controller, mapper ou response DTO.

---

### 9. Implementar create

Use:

```java
@Override
@Transactional
public ManagedRuntimeMessageCreateResult create(
        ManagedRuntimeMessageCreateCommand command
) {
}
```

Fluxo:

1. validar command estruturalmente se necessário;
2. normalizar valor para busca;
3. consultar duplicidade;
4. retornar duplicate quando existir;
5. solicitar id;
6. criar modelo;
7. salvar;
8. retornar created.

Não use `ResponseEntity`.

---

### 10. Implementar findById

Método herda:

```text
readOnly=true.
```

Apenas delegue ao port e preserve Optional.

Não converta para response.

---

### 11. Implementar deleteById

Sobrescreva:

```java
@Override
@Transactional
public boolean deleteById(
        long id
) {
}
```

Mantenha resultado boolean atual.

Não escolha 204 ou 404 no service.

---

### 12. Evoluir controller

Substitua dependência concreta por:

```text
ManagedRuntimeMessageUseCases.
```

O controller continua:

- mapeando request para command;
- chamando use case;
- mapeando result;
- escolhendo status e headers.

Nenhuma regra de duplicidade permanece na web.

---

### 13. Atualizar testes unitarios

Instancie:

```text
ManagedRuntimeMessageApplicationService
```

com port fake e `Clock.fixed`.

Teste sem Spring:

- criação;
- duplicidade;
- busca;
- exclusão;
- ordem de chamadas;
- ausência de save em duplicidade.

---

### 14. Criar ManagedRuntimeMessageUseCaseIdempotencyTest

Execute o mesmo command duas vezes.

Confirme:

```text
um save;

primeiro CREATED;

segundo DUPLICATE;

um recurso no fake port.
```

Não confunda outcome diferente com ausência de idempotência.

O efeito permanece controlado.

---

### 15. Criar ManagedRuntimeMessageStateValidationTest

Confirme que duplicidade depende do port.

Valide que essa regra:

- não está no DTO;
- não está no mapper;
- não está no validator customizado;
- não está no controller.

---

### 16. Criar RecordingTransactionManager

Somente em `src/test/java`.

Implemente sobre:

```text
AbstractPlatformTransactionManager.
```

Registre eventos:

```text
BEGIN;

COMMIT;

ROLLBACK;

SUSPEND;

RESUME.
```

Registre atributos:

```text
name;

readOnly;

propagation;

isolation;

timeout.
```

Não tente simular banco.

---

### 17. Criar TransactionTestConfiguration

Somente em test source:

```java
@TestConfiguration
@EnableTransactionManagement
public class TransactionTestConfiguration {

    @Bean
    RecordingTransactionManager
            recordingTransactionManager() {
        return new RecordingTransactionManager();
    }
}
```

Importe a aplicação service e port fake necessários.

---

### 18. Criar TransactionMetadataTest

Use reflection ou `TransactionAttributeSource`.

Valide:

```text
classe:
readOnly true.

create:
readOnly false.

find:
readOnly true.

delete:
readOnly false.

propagation:
REQUIRED.

isolation:
DEFAULT.
```

Não dependa de `toString()` interno da annotation.

---

### 19. Criar TransactionBoundaryIT

Carregue contexto com:

- `@EnableTransactionManagement`;
- recording manager;
- application service;
- fake port.

Chame:

```text
create.
```

Valide:

```text
BEGIN;

port calls;

COMMIT.
```

Confirme que o bean injetado é um proxy transacional sem acoplar o teste ao tipo exato de proxy.

---

### 20. Criar ReadOnlyTransactionIT

Chame:

```text
findById.
```

Valide que o manager recebeu:

```text
readOnly=true.
```

Chame create.

Valide:

```text
readOnly=false.
```

Não afirme que o fake port bloqueia escrita.

---

### 21. Criar RuntimeExceptionRollbackIT

Crie port fake que lança:

```java
IllegalStateException
```

durante save.

Chame create pelo proxy.

Valide:

```text
BEGIN;

ROLLBACK;

COMMIT ausente.
```

O mapa fake pode ter sido alterado antes da exception.

Não use esse teste como prova de rollback de dados.

---

### 22. Criar CheckedExceptionRollbackIT

Crie bean fixture com dois métodos.

Método um:

```java
@Transactional
public void checkedDefault()
        throws Exception {
    throw new Exception();
}
```

Espere:

```text
COMMIT.
```

Método dois:

```java
@Transactional(
        rollbackFor = Exception.class
)
public void checkedRollback()
        throws Exception {
    throw new Exception();
}
```

Espere:

```text
ROLLBACK.
```

Valide a exception propagada nos dois casos.

---

### 23. Criar PropagationRequiredIT

Crie dois beans de fixture:

```text
OuterUseCase;

InnerOperation.
```

Ambos com `@Transactional` default.

Outer chama Inner por outra referência Spring.

Valide:

```text
um BEGIN;

um COMMIT;

nenhum SUSPEND.
```

Confirme transação ativa nos dois métodos por mecanismo de teste.

---

### 24. Documentar REQUIRES_NEW

Crie teste de metadata ou diagrama.

Não implemente no use case de produção.

Explique:

- suspende outer;
- cria física nova;
- commit independente;
- pool precisa suportar conexão adicional;
- complexidade de erro.

---

### 25. Criar SelfInvocationTransactionIT

Fixture:

```java
public void callInternal() {
    internalTransactional();
}

@Transactional
public void internalTransactional() {
}
```

Chame `callInternal` pelo bean.

Valide:

```text
nenhum BEGIN.
```

Depois mova o método para outro bean de fixture e confirme que o proxy intercepta.

Não use self-injection.

---

### 26. Criar TransactionTemplateTest

Instancie:

```java
TransactionTemplate
```

com recording manager.

Cenário commit:

```java
template.execute(
        status -> "ok"
);
```

Cenário rollback:

```java
template.executeWithoutResult(
        status -> status.setRollbackOnly()
);
```

Valide eventos.

Não mova `TransactionTemplate` para o application service atual.

---

### 27. Criar ServiceLayerArchitectureTest

Valide:

- controller depende de `ManagedRuntimeMessageUseCases`;
- controller não depende da implementação;
- application service implementa o input port;
- application service depende do repository port;
- application service não importa web;
- application service não importa `HttpStatus`;
- application service não importa `ResponseEntity`;
- port não importa Spring Data;
- adapter implementa port;
- domain não importa Spring;
- `@Transactional` está no application service;
- nenhum controller possui `@Transactional`;
- nenhum mapper possui `@Transactional`;
- métodos transacionais públicos não são final;
- application service não é final;
- zero `JpaRepository`;
- zero `EntityManager`.

---

### 28. Preservar contratos web

Execute os testes de:

- criação 201;
- consulta 200;
- condicional 304;
- duplicidade 409;
- exclusão 204;
- inexistente 404.

A refatoração não pode alterar JSON, status ou headers.

---

### 29. Criar service-layer.md

Explique:

- fronteira;
- orquestração;
- dependências;
- regras;
- transação;
- o que não pertence ao service.

---

### 30. Criar application-service-use-case.md

Compare:

```text
service genérico;

application service;

use case;

domain service.
```

Inclua o fluxo create.

---

### 31. Criar ports-and-adapters-introduction.md

Desenhe:

```text
web adapter;

input port;

application service;

output port;

memory adapter;

future Spring Data adapter.
```

Não transforme a aula em arquitetura hexagonal completa.

---

### 32. Criar transaction-boundary.md

Documente:

- unidade de trabalho;
- create;
- find;
- delete;
- transação no service;
- controller fora;
- chamadas externas fora;
- duração curta.

---

### 33. Criar transactional-proxy.md

Desenhe:

```text
caller;

proxy;

interceptor;

manager;

target.
```

Inclua self-invocation, visibilidade e métodos final.

---

### 34. Criar transactional-defaults.md

Liste:

```text
REQUIRED;

DEFAULT isolation;

read-write;

timeout default;

rollback unchecked.
```

Inclua override na classe e método.

---

### 35. Criar rollback-rules.md

Compare:

- RuntimeException;
- Error;
- checked exception;
- `rollbackFor`;
- `noRollbackFor`;
- rollback-only;
- outcome esperado versus exception.

---

### 36. Criar transaction-propagation.md

Documente:

- REQUIRED;
- REQUIRES_NEW;
- SUPPORTS;
- MANDATORY;
- NOT_SUPPORTED;
- NEVER;
- NESTED.

Aprofunde somente REQUIRED.

---

### 37. Criar transaction-isolation-readonly.md

Inclua:

- DEFAULT;
- dirty read;
- non-repeatable read;
- phantom;
- readOnly como hint;
- timeout;
- motivo para não escolher níveis arbitrariamente.

---

### 38. Criar self-invocation-transactions.md

Explique o problema.

Soluções:

- boundary externa;
- outro bean;
- redesign;
- TransactionTemplate.

Rejeite self-injection como padrão.

---

### 39. Criar declarative-vs-programmatic-transactions.md

Compare:

```text
@Transactional;

TransactionTemplate.
```

Inclua vantagens, acoplamento e casos adequados.

---

### 40. Criar service-transaction-baseline.md

Registre:

```text
use case;

annotation;

readOnly;

propagation;

rollback;

port calls;

test.
```

Inclua nota:

```text
sem recurso transacional real nesta aula.
```

---

### 41. Criar scripts

`81_executar_testes_service_layer.ps1` executa testes unitários.

`82_executar_testes_transaction_boundary.ps1` executa begin, commit e read-only.

`83_testar_rollback_rules.ps1` executa checked e unchecked.

`84_testar_propagation_required.ps1` executa outer e inner.

`85_validar_self_invocation.ps1` executa fixture de proxy.

`86_validar_arquitetura_service.ps1` executa teste arquitetural.

---

### 42. Executar testes unitarios

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageApplicationServiceTest,ManagedRuntimeMessageUseCaseIdempotencyTest,ManagedRuntimeMessageStateValidationTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 43. Executar testes de fronteira

```powershell
.\mvnw.cmd `
  -Dtest=TransactionMetadataTest,TransactionBoundaryIT,ReadOnlyTransactionIT test
```

---

### 44. Executar rollback

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeExceptionRollbackIT,CheckedExceptionRollbackIT test
```

Confirme eventos, não rollback real do mapa.

---

### 45. Executar proxy e propagation

```powershell
.\mvnw.cmd `
  -Dtest=PropagationRequiredIT,SelfInvocationTransactionIT,TransactionTemplateTest test
```

---

### 46. Executar arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=ServiceLayerArchitectureTest test
```

---

### 47. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 48. Empacotar

```powershell
.\mvnw.cmd clean package
```

As annotations transacionais estarão prontas.

O manager real será adicionado com a infraestrutura de persistência da próxima aula.

---

### 49. Revisar escopo

Confirme:

```text
spring-tx:
presente.

Spring Data:
ausente.

DataSource:
ausente.

JPA:
ausente.

Flyway:
ausente.

H2:
ausente.

Testcontainers:
ausente.

recording manager:
somente test.

@Transactional em controller:
zero.

rollback real de banco:
nao alegado.
```

---

### 50. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs;
- manager de teste em main;
- dependency Spring Data;
- entity JPA;
- banco embarcado;
- fixture transacional em produção;
- alteração do contrato HTTP.

---

## Entendendo o que foi feito

### O service virou fronteira da aplicacao

Controllers passaram a depender de um input port estável.

### A persistencia virou port

O caso de uso deixou de conhecer o mapa concreto.

### Regras de estado ficaram no lugar correto

Duplicidade permaneceu no application service.

### A transacao ganhou uma fronteira explicita

Create e delete são write; find é read-only.

### O laboratório foi honesto

O recording manager prova o interceptor, não rollback de dados reais.

---

## Erros comuns importantes

### Colocar Transactional no controller

A fronteira fica longa e mistura HTTP com unidade de trabalho.

### Achar que annotation cria banco

É necessário transaction manager e recurso transacional.

### Esperar rollback de um Map

O mapa não participa automaticamente da transação.

### Anotar metodo privado

A chamada não é interceptada pelo proxy.

### Fazer chamada HTTP externa dentro da transacao

Locks e conexões ficam abertos e o rollback não desfaz o efeito remoto.

---

## Comandos uteis

### Dependency tree

```powershell
.\mvnw.cmd dependency:tree
```

### Service layer

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageApplicationServiceTest,ServiceLayerArchitectureTest test
```

### Transacoes

```powershell
.\mvnw.cmd `
  -Dtest=TransactionBoundaryIT,ReadOnlyTransactionIT test
```

### Rollback

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeExceptionRollbackIT,CheckedExceptionRollbackIT test
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Use case separado

Divida em fixtures:

```text
CreateManagedRuntimeMessageUseCase;

FindManagedRuntimeMessageUseCase;

DeleteManagedRuntimeMessageUseCase.
```

Compare com a interface agregada.

Não altere a baseline sem necessidade.

### Parte 2 — Regra no controller

Mova temporariamente a duplicidade para o controller.

Faça o teste arquitetural rejeitar.

Restaure.

### Parte 3 — Checked exception

Crie uma exception checked específica.

Teste com e sem `rollbackFor`.

### Parte 4 — noRollbackFor

Crie fixture com RuntimeException e `noRollbackFor`.

Observe commit.

Explique o risco.

### Parte 5 — REQUIRED

Adicione terceiro bean REQUIRED na cadeia.

Confirme um begin físico.

### Parte 6 — Self-invocation

Anote helper privado.

Confirme que não cria advice próprio.

Restaure.

### Parte 7 — ReadOnly

Tente escrever no fake port dentro de read-only.

Observe que o recording manager não bloqueia.

Explique por que read-only é hint.

### Parte 8 — ADR

Registre:

```text
application service como transaction boundary;

input port para controller;

output port para persistence;

readOnly em consultas;

REQUIRED como default;

rollback unchecked;

checked com regra explicita;

sem self-invocation;

sem chamada remota longa;

sem prometer rollback de recurso nao transacional.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 370 foi preservada;
- o mesmo projeto foi continuado;
- service layer foi definida;
- application service foi diferenciado de service genérico e domain service;
- use case foi definido;
- input port foi criado;
- output port foi criado;
- controller depende de `ManagedRuntimeMessageUseCases`;
- controller não depende da implementação;
- application service implementa o input port;
- application service depende do repository port;
- application service não depende do adaptador concreto;
- adaptador em memória implementa o repository port;
- domain model não recebeu annotation web ou JPA;
- controller permaneceu responsável por HTTP;
- mapper permaneceu responsável por conversão;
- service permaneceu responsável por orquestração;
- duplicidade permaneceu regra dependente de estado;
- Spring Data não foi adicionado;
- `spring-tx` foi adicionado sem versão;
- `@Transactional` foi aplicado na implementação concreta;
- classe usa read-only como baseline;
- create sobrescreve para read-write;
- delete sobrescreve para read-write;
- find permanece read-only;
- controllers não possuem `@Transactional`;
- mappers não possuem `@Transactional`;
- `PlatformTransactionManager` foi explicado;
- `TransactionDefinition` foi explicado;
- `TransactionStatus` foi explicado;
- `TransactionInterceptor` e proxy foram explicados;
- annotation foi tratada como metadata;
- necessidade de transaction manager foi documentada;
- ausência de recurso transacional real foi documentada;
- rollback de mapa em memória não foi alegado;
- defaults REQUIRED, DEFAULT isolation, read-write e rollback unchecked foram explicados;
- readOnly foi tratado como hint;
- timeout foi diferenciado de timeouts externos;
- isolation foi introduzida sem configuração arbitrária;
- REQUIRED foi testado com dois beans;
- um begin e um commit físicos foram observados;
- REQUIRES_NEW, SUPPORTS, MANDATORY, NOT_SUPPORTED, NEVER e NESTED foram explicados;
- REQUIRES_NEW não foi aplicado sem necessidade;
- RuntimeException provocou rollback no manager;
- checked exception sem regra provocou commit;
- checked exception com `rollbackFor` provocou rollback;
- `noRollbackFor` foi explicado;
- rollback-only foi explicado;
- `UnexpectedRollbackException` foi apresentado conceitualmente;
- self-invocation foi demonstrada;
- helper interno não iniciou transação;
- chamada por outro bean passou pelo proxy;
- self-injection não foi adotada;
- métodos transacionais de caso de uso são públicos;
- application service e métodos não são final;
- `TransactionTemplate` foi demonstrado em fixture;
- modelo declarativo permaneceu padrão;
- chamadas externas longas foram mantidas fora da transação;
- transação local não foi confundida com transação distribuída;
- idempotência do caso de uso foi testada;
- segunda criação duplicada não criou outro recurso;
- `ManagedRuntimeMessageApplicationServiceTest` foi criado;
- `ManagedRuntimeMessageUseCaseIdempotencyTest` foi criado;
- `ManagedRuntimeMessageStateValidationTest` foi criado;
- `RecordingTransactionManager` ficou em test source;
- `TransactionTestConfiguration` ficou em test source;
- `TransactionMetadataTest` foi criado;
- `TransactionBoundaryIT` foi criado;
- `ReadOnlyTransactionIT` foi criado;
- `RuntimeExceptionRollbackIT` foi criado;
- `CheckedExceptionRollbackIT` foi criado;
- `PropagationRequiredIT` foi criado;
- `SelfInvocationTransactionIT` foi criado;
- `TransactionTemplateTest` foi criado;
- `ServiceLayerArchitectureTest` foi criado;
- contratos HTTP anteriores foram preservados;
- documentação de service, use cases, ports, transactions, proxy, defaults, rollback, propagation, isolation e self-invocation foi criada;
- baseline transacional foi documentada;
- scripts foram criados;
- testes unitários, transacionais, rollback, propagation, arquitetura, suite e package passaram;
- nenhum DataSource, Spring Data, JPA, Hibernate persistence, Flyway, PostgreSQL, H2, Testcontainers, ControllerAdvice ou ProblemDetail foi antecipado;
- ponte para a aula 372 está correta;
- commit recomendado e diário de bordo estão prontos.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "refactor(m14): organizar use cases e fronteiras transacionais"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- recording manager em main;
- dependência Spring Data;
- entity JPA;
- banco embarcado;
- fixture transacional em produção.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a aplicação ganhou uma service layer explícita.

O fluxo consolidado ficou:

```text
controller;

input port;

application service;

repository port;

adapter em memoria.
```

A fronteira transacional ficou:

```text
create:
read-write.

find:
read-only.

delete:
read-write.
```

Você comprovou:

```text
@Transactional como metadata;

proxy e interceptor;

begin;

commit;

rollback;

readOnly;

REQUIRED;

checked versus unchecked;

rollbackFor;

self-invocation;

TransactionTemplate;

idempotencia de caso de uso;

service independente de HTTP;

port independente de Spring Data.
```

A decisão central foi:

```text
a transacao deve envolver
a unidade de trabalho do caso de uso,
comecar na application service
e terminar antes de efeitos externos longos.
```

A próxima aula será:

```text
372 - M14.17 - Repository layer Spring Data
```

Nela, você continuará no mesmo projeto e estudará:

- repository layer;
- Spring Data;
- repository interfaces;
- abstração de persistência;
- entity de persistência;
- separação entre domain e entity;
- adapter Spring Data;
- derived queries;
- `Optional`;
- save;
- findById;
- exists;
- delete;
- paginação introdutória;
- ordenação;
- transaction manager real;
- integração da service layer;
- testes de repository;
- PostgreSQL;
- Testcontainers;
- Flyway;
- Hibernate validate;
- substituição do adapter em memória.

A aula 371 respondeu:

```text
como organizar casos de uso
e definir a fronteira transacional?
```

A aula 372 responderá:

```text
como implementar a porta de persistencia
com Spring Data e um recurso transacional real?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar controller, application service, port e adapter.
- [ ] Sei posicionar `@Transactional` na fronteira do caso de uso.
- [ ] Sei explicar defaults, rollback e read-only.
- [ ] Sei explicar proxy, propagation REQUIRED e self-invocation.
- [ ] Sei distinguir transação Spring de rollback real do recurso.

---

## Troubleshooting adicional

### Annotation nao gera eventos

Confirme transaction manager, `@EnableTransactionManagement` ou auto-configuração e chamada pelo proxy.

### Find aparece read-write

Revise annotation da classe e override do método.

### Metodo interno nao abre transacao

A chamada não passou pelo proxy.

### Checked exception fez commit

Esse é o default; use `rollbackFor` quando a regra exigir.

### Map nao voltou ao estado anterior

Ele não participa do transaction manager de teste.

### Controller exige implementation bean

Troque a dependência pelo input port e garanta uma implementação única.

---

## Perguntas de revisao

1. O que é service layer?
2. O que é application service?
3. O que é use case?
4. O que é input port?
5. O que é output port?
6. Onde fica a duplicidade?
7. Onde fica `@Transactional`?
8. O que a annotation representa?
9. O que faz o transaction manager?
10. Qual propagation padrão?
11. Qual isolation padrão?
12. O que significa read-only?
13. Qual exception causa rollback por padrão?
14. Checked exception causa rollback padrão?
15. Para que serve `rollbackFor`?
16. O que é self-invocation?
17. O que faz `TransactionTemplate`?
18. Transação local inclui API remota?
19. O mapa possui rollback real?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fronteira de operações da aplicação.
2. Implementação e orquestração dos casos de uso.
3. Capacidade oferecida a um ator.
4. Contrato de entrada da aplicação.
5. Contrato de saída para infraestrutura.
6. Application service.
7. Application service.
8. Metadata transacional.
9. Iniciar, confirmar e reverter o recurso.
10. REQUIRED.
11. DEFAULT.
12. Hint de leitura.
13. RuntimeException e Error.
14. Não.
15. Declarar rollback adicional.
16. Chamada interna que não passa pelo proxy.
17. Transação programática por callback.
18. Não automaticamente.
19. Não.
20. Repository layer Spring Data.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 371 - M14.16 - Service layer use cases e transacoes

- Continuei no projeto `formacao-java-backend-api`.
- Defini service layer e application service.
- Modelei os casos de uso de managed messages.
- Criei `ManagedRuntimeMessageUseCases` como input port.
- Criei `ManagedRuntimeMessageRepositoryPort` como output port.
- Criei um adaptador de memória separado.
- Mantive o controller dependente da abstração.
- Mantive o service independente de HTTP.
- Mantive o port independente de Spring Data.
- Posicionei regras dependentes de estado no application service.
- Mantive duplicidade fora de Bean Validation.
- Adicionei `spring-tx` sem versão manual.
- Usei `@Transactional` na implementation concreta.
- Usei read-only como baseline de consulta.
- Sobrescrevi create e delete para read-write.
- Entendi `PlatformTransactionManager`, `TransactionDefinition` e `TransactionStatus`.
- Entendi o proxy e o `TransactionInterceptor`.
- Estudei os defaults de `@Transactional`.
- Aprofundei propagation REQUIRED.
- Introduzi as outras propagations conceitualmente.
- Diferenciei transação lógica de física.
- Testei begin, commit e rollback com um recording manager.
- Entendi que o mapa em memória não possui rollback real.
- Testei rollback de RuntimeException.
- Testei checked exception com e sem `rollbackFor`.
- Entendi rollback-only e `UnexpectedRollbackException`.
- Testei self-invocation.
- Mantive métodos transacionais públicos e não final.
- Pratiquei `TransactionTemplate` em fixture.
- Mantive chamadas externas fora da fronteira transacional.
- Diferenciei transação local de transação distribuída.
- Testei idempotência do caso de uso.
- Preservei status, headers e JSON da API.
- Não adicionei Spring Data, JPA ou banco.
- Próxima aula: Repository layer Spring Data.
```

---

## Referencia tecnica curta

```text
Use case:
operacao.

Application service:
orquestracao.

Input port:
entrada.

Output port:
infraestrutura.

Transactional:
metadata.

Manager:
execucao.

REQUIRED:
participa ou cria.

ReadOnly:
hint.

Rollback:
falha.

Proxy:
interceptacao.
```

Regra final:

```text
a service layer deve expor casos de uso por input ports, orquestrar regras e output ports sem depender de HTTP ou implementacoes concretas, e definir a fronteira transacional na application service; Transactional e metadata executada por proxy e TransactionManager, REQUIRED e o default, readOnly e um hint, RuntimeException provoca rollback por padrao, checked exceptions exigem regra explicita e nenhum rollback de dados pode ser prometido enquanto o recurso subjacente nao participar de uma transacao real.
```
