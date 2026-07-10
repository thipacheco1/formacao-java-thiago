# 330 - M13.20 - Dirty checking

## Apresentacao da aula

Na aula 329, você aprofundou o persistence context como um mapa de identidade.

Dentro do mesmo `EntityManager`, uma combinação de:

```text
classe da entidade;

identificador persistente.
```

corresponde a uma única instância gerenciada.

Você comprovou:

```text
dois find no mesmo contexto:
mesma referência;
um SELECT.

find depois de clear:
nova referência;
novo SELECT.

dois EntityManagers:
mesmo ID;
referências Java diferentes.

refresh:
mesma referência com estado recarregado.

merge:
cópia de estado para a instância managed existente.
```

Agora você vai aprofundar um dos principais comportamentos que o persistence context oferece:

```text
dirty checking.
```

Dirty checking é o mecanismo pelo qual o provider identifica mudanças realizadas em entidades gerenciadas e sincroniza essas mudanças com o banco.

Exemplo:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

cliente.alterarNome(
        "Novo nome"
);
```

Não existe uma chamada:

```java
entityManager.update(cliente);
```

Mesmo assim, durante o flush, o Hibernate pode gerar:

```sql
UPDATE jpa_330.cliente
SET ...
WHERE id = ?
  AND versao = ?
```

Isso acontece porque a entidade:

- está managed;
- pertence ao persistence context;
- possui um estado conhecido pelo provider;
- teve um atributo alterado;
- chegou a um ponto de sincronização.

Nesta aula, você vai entender:

- o que é o snapshot de uma entidade;
- quando o snapshot é criado;
- como o provider compara estado antigo e atual;
- por que apenas entidades managed participam;
- quando o `UPDATE` é executado;
- por que alterar um objeto detached não gera SQL;
- por que não é necessário chamar `merge` em uma entidade já managed;
- como objetos embutidos participam;
- como `@Version` é incrementada;
- por que atribuir o mesmo valor não deveria gerar update;
- por que alterar e desfazer antes do flush pode resultar em nenhuma escrita;
- por que dirty checking não significa que somente colunas alteradas aparecerão no SQL;
- como observar o comportamento com `StatementInspector` e estatísticas;
- qual é o custo de manter muitas entidades gerenciadas;
- quando um contexto read-only pode ser útil;
- por que bulk SQL e alterações externas não são acompanhados automaticamente.

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
formacao_java_jpa_330
```

O schema será:

```text
jpa_330
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade principal será:

```java
ClienteEntity
```

Ela continuará contendo objetos de valor:

```text
DocumentoFiscal;

Endereco;

Dinheiro.
```

O laboratório provará:

```text
entidade managed alterada:
UPDATE no flush;
versão incrementada.

transação sem mudança:
nenhum UPDATE.

atribuição do mesmo valor:
nenhum UPDATE.

mudança seguida de restauração:
nenhum UPDATE.

embeddable substituído:
UPDATE.

entidade detached alterada:
nenhum UPDATE.

entidade nova persistida:
INSERT sem UPDATE adicional.

coluna updatable=false:
fora do UPDATE.

estado final:
zero fixtures CLI-JPA-330-%.
```

A próxima aula será:

```text
331 - M13.21 - Flush clear detach e refresh
```

Nesta aula, `flush`, `clear`, `detach` e `refresh` aparecerão apenas para demonstrar dirty checking.

A aula 331 aprofundará:

- sincronização explícita;
- flush automático;
- flush mode;
- perda de alterações com clear;
- detach de uma entidade;
- refresh e sobrescrita de estado;
- ordem entre SQL e contexto;
- cenários de rollback;
- testes operacionais dessas quatro ações.

Não serão antecipados:

- relacionamentos;
- cascades;
- lazy loading;
- JPQL aprofundada;
- bulk update;
- cache de segundo nível;
- locks;
- callbacks;
- Spring;
- Spring Data;
- bytecode enhancement em produção;
- tuning definitivo.

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
```

Na aula 329, o persistence context manteve a instância.

Nesta aula, ele acompanhará as alterações dessa instância.

A progressão é:

```text
identidade:
qual objeto representa a entidade no contexto?

snapshot:
qual era o estado conhecido?

dirty checking:
o estado mudou?

flush:
quando sincronizar?
```

Nesta aula:

```text
snapshot:
sim.

managed:
sim.

dirty checking:
aprofundado.

UPDATE automático:
sim.

@Version:
sim.

embeddable:
sim.

detached:
comparação.

flush:
uso controlado.

clear, detach e refresh:
somente apoio.

relacionamentos:
não.

Spring:
não.
```

A arquitetura permanecerá:

```text
EntityManager
    -> persistence context
        -> entidade managed
        -> snapshot
        -> dirty checking
        -> action queue
            -> SQL
                -> JDBC
                    -> HikariCP
                        -> PostgreSQL.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-330-dirty-checking
```

Estrutura final:

```text
labs
└── m13
    └── aula-330-dirty-checking
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── fluxo-dirty-checking.md
        │   ├── snapshot-e-flush.md
        │   ├── colunas-update.md
        │   └── troubleshooting-dirty-checking.md
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
            │   │                   └── aula330
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── lab
            │   │                       │   ├── DirtyCheckingLab.java
            │   │                       │   ├── DirtyCheckingObservation.java
            │   │                       │   └── DirtyCheckingReport.java
            │   │                       ├── observability
            │   │                       │   └── SqlCaptureInspector.java
            │   │                       └── valueobject
            │   │                           ├── Dinheiro.java
            │   │                           ├── DocumentoFiscal.java
            │   │                           └── Endereco.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_330.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula330
                                        ├── DirtyCheckingIT.java
                                        ├── DirtyCheckingNoOpIT.java
                                        ├── DirtyCheckingEmbeddableIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
alteração de nome:
um UPDATE;
versão 0 -> 1.

nenhuma alteração:
zero UPDATE;
versão preservada.

mesmo valor:
zero UPDATE.

alterar e restaurar:
zero UPDATE.

novo limite:
um UPDATE;
versão incrementada.

detached:
zero UPDATE.

insert inicial:
um INSERT;
zero UPDATE.

SQL padrão:
pode incluir várias colunas atualizáveis.

criado_em:
não aparece no UPDATE.
```

---

## Conceito essencial

### O que e dirty checking

Dirty checking é a detecção de diferenças entre:

```text
estado conhecido pelo persistence context;

estado atual da entidade managed.
```

Quando existe diferença persistível, o provider agenda uma atualização.

O termo “dirty” significa:

```text
estado alterado em relação ao snapshot.
```

Não significa erro ou dado inválido.

---

### Snapshot

Ao carregar uma entidade, o provider registra uma representação do estado persistente.

Exemplo simplificado:

```text
snapshot:
nome = Cliente Inicial;
limite = 1000.00 BRL;
endereco = Rua A;
versao = 0.
```

Depois, o objeto managed muda:

```text
estado atual:
nome = Cliente Atualizado;
limite = 1000.00 BRL;
endereco = Rua A;
versao = 0.
```

Durante o dirty checking, o provider identifica:

```text
nome mudou.
```

A implementação real do Hibernate utiliza estruturas internas mais sofisticadas.

O modelo de snapshot é suficiente para compreender o comportamento.

---

### Quando o snapshot e criado

O provider pode registrar estado quando:

- a entidade é carregada;
- a entidade é inserida e passa a representar uma linha;
- o contexto é sincronizado;
- a entidade é atualizada pelo provider;
- ocorre refresh.

A aplicação não manipula o snapshot diretamente.

Ela apenas modifica a entidade managed.

---

### Somente managed participa

Dirty checking exige:

```text
entidade no persistence context.
```

Se:

```java
entityManager.contains(cliente)
```

retorna false, mudanças nessa instância não serão automaticamente observadas pelo contexto.

Estados sem dirty checking automático:

```text
new ainda não persistida;

detached;

objeto comum;

DTO;

embeddable fora de uma entidade managed.
```

---

### Nao existe update explicito

JPA não possui um método padrão:

```java
entityManager.update(...)
```

Para entidade managed:

```java
cliente.alterarNome(
        "Novo nome"
);
```

é suficiente.

Quando chega o flush, o provider sincroniza.

Chamar `merge` em uma entidade que já é managed é desnecessário e pode tornar o código confuso.

---

### Momento do UPDATE

Alterar o atributo não significa que o SQL foi executado naquele exato momento.

Fluxo:

```text
find:
entidade managed.

método de domínio:
estado Java alterado.

dirty checking:
diferença detectada.

flush:
UPDATE enviado.

commit:
transação confirmada.
```

O flush pode ocorrer:

- explicitamente;
- antes do commit;
- antes de certas consultas;
- conforme flush mode.

A aula 331 aprofundará esses gatilhos.

---

### Atribuir o mesmo valor

Considere:

```java
cliente.alterarNome(
        cliente.getNome()
);
```

O método foi chamado, mas o estado final é igual ao snapshot.

O dirty checking baseado em comparação de estado não deve produzir `UPDATE`.

A regra é:

```text
setter chamado não significa entidade dirty.
```

O que importa é a diferença persistível no momento da verificação.

---

### Alterar e restaurar

Exemplo:

```java
String original =
        cliente.getNome();

cliente.alterarNome(
        "Valor temporário"
);

cliente.alterarNome(
        original
);
```

Se o flush ocorre apenas depois da restauração, o estado final é igual ao snapshot.

Esperado:

```text
nenhum UPDATE.
```

Se houver flush entre as duas alterações, ocorrerão sincronizações diferentes.

A aula 331 aprofundará esse efeito.

---

### Embeddables

Objetos de valor embutidos fazem parte do estado da entidade proprietária.

Exemplo:

```java
cliente.alterarLimiteCredito(
        new Dinheiro(
                new BigDecimal("2000.00"),
                "BRL"
        )
);
```

A substituição do embeddable altera colunas da tabela Cliente.

O Hibernate detecta diferenças em:

```text
limite_valor;

limite_moeda.
```

Não existe dirty checking independente de `Dinheiro`.

O componente participa do snapshot de `ClienteEntity`.

---

### Substituicao versus mutacao interna

Nesta formação, os objetos de valor são efetivamente imutáveis.

A entidade substitui o objeto completo.

Isso facilita:

- invariantes;
- comparação;
- entendimento;
- testes;
- dirty checking.

Embeddables mutáveis também podem ser acompanhados pelo provider, mas setters internos espalhados aumentam o risco de estado parcial e regras quebradas.

---

### @Version

A entidade possui:

```java
@Version
private int versao;
```

Quando um `UPDATE` real é executado, o provider:

- inclui a versão esperada no `WHERE`;
- incrementa a versão;
- atualiza o campo Java;
- detecta conflitos concorrentes quando nenhuma linha é afetada.

SQL conceitual:

```sql
UPDATE jpa_330.cliente
SET
    nome = ?,
    versao = ?
WHERE id = ?
  AND versao = ?
```

Se não houver mudança e nenhum update for executado:

```text
versão não deve ser incrementada.
```

O foco desta aula é o incremento associado ao dirty checking, não o conflito concorrente.

---

### Dirty checking e colunas do UPDATE

Detectar que uma entidade mudou não significa necessariamente gerar SQL contendo apenas a coluna alterada.

Sem uma otimização específica, o Hibernate pode gerar `UPDATE` com várias colunas atualizáveis:

```sql
UPDATE cliente
SET
    nome = ?,
    limite_valor = ?,
    limite_moeda = ?,
    versao = ?
WHERE id = ?
  AND versao = ?
```

Mesmo quando apenas `nome` mudou.

Distinção:

```text
dirty checking:
a entidade precisa de UPDATE?

dynamic update:
quais colunas entram no UPDATE?
```

O laboratório não habilitará `@DynamicUpdate` no fluxo principal.

---

### @DynamicUpdate conceitual

`@DynamicUpdate` é uma annotation específica do Hibernate.

Ela permite gerar SQL com base nas propriedades alteradas.

Possíveis benefícios:

- menos colunas enviadas;
- menor risco de sobrescrever coluna gerenciada externamente;
- redução de tráfego em linhas largas.

Possíveis custos:

- mais formatos de SQL;
- menor reutilização de prepared statements;
- maior custo de geração;
- acoplamento ao provider;
- complexidade de medição.

Use somente após medir.

Ela será um exercício opcional, não parte do mapeamento oficial.

---

### updatable false

Uma coluna:

```java
@Column(
        updatable = false
)
private OffsetDateTime criadoEm;
```

não deve aparecer no SQL de update.

O dirty checking não transforma uma coluna não atualizável em atualizável.

Se o atributo Java for alterado por reflection ou erro interno, o provider não deve persistir essa mudança por `UPDATE`.

A regra de domínio deve impedir a alteração antes disso.

---

### Dirty checking e encapsulamento

JPA não exige setters públicos para detectar mudanças.

O provider trabalha com acesso por campo ou propriedade conforme o posicionamento das annotations.

Nesta formação, as annotations estão nos campos.

Métodos como:

```java
alterarNome;

alterarLimiteCredito;

alterarEnderecoCobranca.
```

mantêm invariantes e comunicam intenção.

O dirty checking observa o estado resultante.

---

### Dirty checking e setters

Um setter genérico:

```java
setNome(String nome)
```

não é requisito técnico para JPA.

Adicionar setters apenas “para o Hibernate” enfraquece o modelo.

O provider usa reflection, bytecode e mecanismos internos conforme a estratégia de acesso.

Mantenha construtor protegido e métodos de domínio.

---

### Entidade detached

Fluxo:

```java
ClienteEntity detached;

try (
    EntityManager manager =
            factory.createEntityManager()
) {
    detached =
            manager.find(
                    ClienteEntity.class,
                    id
            );
}

detached.alterarNome(
        "Nome detached"
);
```

Depois do fechamento:

```text
contains:
false.

dirty checking:
não ocorre.
```

Abrir uma nova transação vazia não sincroniza o objeto detached.

É necessário buscar a entidade novamente ou usar merge conscientemente.

---

### Transacao sem alteracao

Carregar entidade e confirmar uma transação sem mudanças não deve gerar `UPDATE`.

Exemplo:

```java
transaction.begin();

ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

transaction.commit();
```

Existe:

```text
SELECT.

zero UPDATE.
```

Isso é importante para leituras dentro de uma transação.

---

### Entidade nova

Uma entidade nova persistida gera:

```text
INSERT.
```

Depois do insert e do snapshot inicial, não deve haver um `UPDATE` adicional se nenhum campo mudar.

O laboratório verificará:

```text
um INSERT;

zero UPDATE.
```

Isso ajuda a identificar mapeamentos que provocam escrita dupla desnecessária.

---

### Dirty checking e refresh

`refresh` substitui o estado atual pelo estado do banco.

Se havia uma mudança local ainda não sincronizada, ela pode ser descartada.

O snapshot também passa a refletir o estado recarregado.

A aula 331 aprofundará o uso de refresh.

Nesta aula, ele será apenas citado como redefinição de estado conhecido.

---

### Dirty checking e clear

`clear` desanexa todas as entidades.

Depois:

```text
dirty checking deixa de acompanhá-las.
```

Mudanças não sincronizadas podem ser perdidas.

A aula 331 mostrará a ordem correta entre flush e clear em cenários de processamento.

---

### Snapshot comparison e enhancement

O Hibernate pode detectar mudanças por comparação de snapshots.

Também existem mecanismos de bytecode enhancement capazes de registrar atributos alterados.

Nesta aula:

```text
bytecode enhancement:
não configurado.
```

O modelo mental continuará sendo:

```text
snapshot antigo versus estado atual.
```

Não faça tuning antes de medir volume, memória e tempo de flush.

---

### Custo do dirty checking

O persistence context mantém:

- entidades;
- snapshots;
- metadados;
- ações pendentes;
- informações de versão.

Quanto maior o contexto:

- maior consumo de memória;
- maior quantidade de estados a verificar;
- maior custo potencial de flush;
- maior risco de dados antigos;
- maior complexidade de unidade de trabalho.

Por isso, contextos curtos continuam sendo recomendados.

---

### Read-only conceitual

Hibernate possui formas de marcar entidades ou sessões como read-only.

Uma entidade read-only pode evitar manutenção de snapshot e dirty checking em cenários de leitura.

Esse recurso é específico do provider e exige cuidado.

A aula não o ativará no fluxo principal.

Antes de usar, avalie:

- volume;
- benefício;
- risco de alterações ignoradas;
- acoplamento;
- cobertura de testes.

---

### Alteracoes externas

O dirty checking compara o objeto managed com o snapshot do contexto.

Ele não observa automaticamente uma mudança feita por:

- JDBC externo;
- outra instância da aplicação;
- trigger;
- processo batch;
- ferramenta administrativa.

A aula 329 mostrou que o contexto pode ficar desatualizado.

`refresh`, novo contexto ou lock são mecanismos diferentes para lidar com isso.

---

### Bulk operations

Um `UPDATE` executado diretamente por SQL ou futura JPQL bulk operation não passa pelas entidades managed individualmente.

Isso pode deixar o contexto inconsistente.

Bulk operations serão estudadas mais adiante.

Regra inicial:

```text
não misture bulk update e entidades managed
sem limpar ou sincronizar conscientemente.
```

---

### Dirty checking nao valida regra

Dirty checking sabe que o valor mudou.

Ele não sabe se a mudança respeita o negócio.

Exemplo:

```text
limite negativo.
```

A regra deve ser protegida por:

- objeto de valor;
- método de domínio;
- validação de aplicação;
- constraint do banco.

Dirty checking apenas sincroniza estado persistível.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\java\br\com\formacao\m13\aula330\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\java\br\com\formacao\m13\aula330\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\java\br\com\formacao\m13\aula330\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\java\br\com\formacao\m13\aula330\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\java\br\com\formacao\m13\aula330\valueobject"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-330-dirty-checking\src\test\java\br\com\formacao\m13\aula330"

Set-Location `
  "labs\m13\aula-330-dirty-checking"
```

---

### 2. Criar pom e configuracao

Reutilize as dependências da aula 329.

Ajuste:

```text
artifactId:
aula-330-dirty-checking.

persistence unit:
aula330PU.

Main:
br.com.formacao.m13.aula330.Main.
```

Configuração local:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_330
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-330-jpa
JPA_POOL_NAME=aula-330-pool
JPA_POOL_SIZE=3
```

O arquivo real permanece fora do Git.

---

### 3. Criar migration

Reutilize o modelo de Cliente da aula 329.

Ajustes:

```text
schema:
jpa_330.

sequence:
jpa_330.cliente_id_seq.

start:
330001.
```

Adicione uma coluna:

```sql
atualizado_em timestamptz NOT NULL
```

A tabela deve conter:

- código;
- nome;
- email;
- documento;
- endereço principal;
- endereço de cobrança;
- limite;
- ativo;
- versão;
- criado em;
- atualizado em.

`criado_em` será não atualizável.

`atualizado_em` será alterado pelos métodos de domínio.

---

### 4. Reutilizar objetos de valor

Copie:

```text
DocumentoFiscal;

Endereco;

Dinheiro.
```

Ajuste packages.

Mantenha:

- validações;
- igualdade por valor;
- imutabilidade prática;
- ausência de setters.

---

### 5. Evoluir ClienteEntity.java

Trechos principais:

```java
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

@Column(
        name = "atualizado_em",
        nullable = false
)
private OffsetDateTime atualizadoEm;
```

Métodos:

```java
public void alterarNome(
        String novoNome,
        OffsetDateTime agora
)

public void alterarEmail(
        String novoEmail,
        OffsetDateTime agora
)

public void alterarLimiteCredito(
        Dinheiro novoLimite,
        OffsetDateTime agora
)

public void alterarEnderecoCobranca(
        Endereco novoEndereco,
        OffsetDateTime agora
)
```

Cada método:

- valida;
- normaliza;
- altera o atributo;
- atualiza `atualizadoEm`.

Para testar mesmo valor sem alterar timestamp, crie:

```java
public void reafirmarNome(
        String nomeAtual
)
```

ou execute o método com o mesmo `agora` já persistido.

Prefira não alterar `atualizadoEm` se nenhum valor de negócio mudou.

Implementação recomendada:

```java
public void alterarNome(
        String novoNome,
        OffsetDateTime agora
) {
    String normalizado =
            requireText(
                    novoNome,
                    "novoNome"
            );

    if (this.nome.equals(normalizado)) {
        return;
    }

    this.nome = normalizado;
    this.atualizadoEm =
            Objects.requireNonNull(agora);
}
```

Isso evita mudança artificial de timestamp quando o nome permanece igual.

---

### 6. Criar SqlCaptureInspector.java

Reutilize o inspector das aulas anteriores.

Adicione:

```java
public long insertCount()

public long updateCount()

public long deleteCount()

public List<String> updates()
```

A classificação pode usar SQL normalizado iniciando com:

```text
insert;

update;

delete.
```

Não registre bindings.

---

### 7. Criar DirtyCheckingObservation.java

```java
package br.com.formacao.m13.aula330.lab;

public record DirtyCheckingObservation(
        String etapa,
        int versaoAntes,
        int versaoDepois,
        long insertCount,
        long updateCount,
        boolean colunaCriadoEmAusenteDoUpdate,
        boolean entidadeManaged
) {

    public DirtyCheckingObservation {
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

### 8. Criar DirtyCheckingReport.java

```java
package br.com.formacao.m13.aula330.lab;

import java.util.List;

public record DirtyCheckingReport(
        List<DirtyCheckingObservation> observations,
        boolean managedChangeUpdated,
        boolean noChangeSkippedUpdate,
        boolean sameValueSkippedUpdate,
        boolean revertedChangeSkippedUpdate,
        boolean embeddableChangeUpdated,
        boolean detachedChangeSkippedUpdate,
        boolean insertDidNotCauseExtraUpdate,
        boolean versionIncrementedOnlyOnUpdate
) {

    public DirtyCheckingReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 9. Criar fixture principal

Persista:

```text
CLI-JPA-330-MAIN.
```

Dados:

```text
nome:
Cliente Dirty Inicial.

email:
dirty330@exemplo.com.

documento:
CPF 33033033001.

endereço:
Rua do Snapshot, 330, Centro,
Barueri, SP, 06400000.

limite:
3300.00 BRL.

criadoEm:
2026-07-10T16:00:00-03:00.

atualizadoEm:
mesmo valor.
```

Depois do commit, confirme:

```text
um INSERT;

zero UPDATE;

versão zero.
```

Feche o manager.

---

### 10. Cenário managed alterado

Abra manager e transação.

Busque a fixture.

Guarde:

```text
versão antes:
0.
```

Limpe o inspector depois do SELECT.

Execute:

```java
cliente.alterarNome(
        "Cliente Dirty Atualizado",
        OffsetDateTime.parse(
                "2026-07-10T16:05:00-03:00"
        )
);
```

Antes do flush:

```text
update count:
zero.
```

Execute:

```java
entityManager.flush();
```

Confirme:

```text
um UPDATE;

versão:
1;

contains:
true;

criado_em ausente no SQL.
```

Commit.

---

### 11. Cenário sem alteracao

Abra novo manager e transação.

Busque a entidade.

Guarde a versão.

Limpe inspector.

Não altere nada.

Execute flush e commit.

Confirme:

```text
zero UPDATE;

versão preservada.
```

---

### 12. Cenário mesmo valor

Abra novo manager e transação.

Busque.

Limpe inspector.

Execute:

```java
cliente.alterarNome(
        cliente.getNome(),
        cliente.getAtualizadoEm()
);
```

O método deve retornar sem mudar estado.

Execute flush e commit.

Confirme:

```text
zero UPDATE;

versão preservada.
```

---

### 13. Cenário alterar e restaurar

Abra novo manager e transação.

Busque e guarde:

```text
nome original;

atualizadoEm original.
```

Altere para valor temporário.

Depois restaure ambos por um método didático de domínio seguro ou por dois métodos que resultem exatamente no estado original.

Não execute flush entre as mudanças.

Limpe inspector antes do flush.

Execute flush e commit.

Confirme:

```text
zero UPDATE;

versão preservada.
```

O estado final deve ser igual ao snapshot.

---

### 14. Cenário embeddable

Abra manager e transação.

Busque.

Guarde a versão.

Limpe inspector.

Execute:

```java
cliente.alterarLimiteCredito(
        new Dinheiro(
                new BigDecimal("4000.00"),
                "BRL"
        ),
        OffsetDateTime.parse(
                "2026-07-10T16:10:00-03:00"
        )
);
```

Flush e commit.

Confirme:

```text
um UPDATE;

versão incrementada;

limite_valor novo;

limite_moeda BRL.
```

O SQL pode conter outras colunas atualizáveis.

---

### 15. Cenário detached

Abra manager A.

Busque a entidade.

Feche manager A.

A entidade agora está detached.

Altere:

```java
detached.alterarNome(
        "Nome Detached Não Persistido",
        OffsetDateTime.parse(
                "2026-07-10T16:15:00-03:00"
        )
);
```

Abra manager B e uma transação vazia.

Limpe inspector.

Commit.

Confirme:

```text
zero UPDATE.
```

Abra manager C e confirme que o nome do banco não mudou.

Não use merge.

---

### 16. Remover fixture

Abra novo manager e transação.

Busque a entidade.

Execute remove e commit.

Confirme em outro manager:

```text
find retorna null.
```

O laboratório termina sem dados.

---

### 17. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. executa `DirtyCheckingLab`;
4. imprime as observações;
5. imprime os booleanos;
6. não imprime documento completo;
7. não imprime SQL integral;
8. fecha runtime.

Formato:

```text
etapa | versao antes | versao depois | INSERT | UPDATE | managed
```

---

### 18. Criar DirtyCheckingIT.java

Casos obrigatórios:

#### Managed gera update

- criar fixture;
- carregar;
- alterar nome;
- confirmar zero update antes do flush;
- flush;
- confirmar um update;
- confirmar versão incrementada;
- rollback;
- confirmar banco preservado.

#### Commit gera flush

- carregar;
- alterar;
- não chamar flush explícito;
- commit;
- confirmar update;
- confirmar valor persistido.

#### Detached não gera update

- carregar e fechar;
- alterar detached;
- abrir transação vazia;
- commit;
- confirmar zero update;
- confirmar banco inalterado.

#### Insert sem update adicional

- persistir entidade;
- flush;
- confirmar um insert;
- confirmar zero update;
- rollback.

---

### 19. Criar DirtyCheckingNoOpIT.java

#### Sem mudança

- find;
- flush;
- confirmar zero update;
- versão preservada.

#### Mesmo valor

- chamar método com mesmo nome;
- flush;
- zero update.

#### Alterar e restaurar

- alterar;
- restaurar estado original;
- flush;
- zero update.

#### Coluna não atualizável

- executar mudança real em nome;
- inspecionar SQL;
- confirmar `criado_em` ausente;
- rollback.

Não use comparação rígida de SQL completo.

Normalize e procure fragmentos.

---

### 20. Criar DirtyCheckingEmbeddableIT.java

#### Limite

- substituir `Dinheiro`;
- flush;
- confirmar update;
- confirmar versão;
- rollback.

#### Endereço de cobrança

- substituir `Endereco`;
- flush;
- confirmar update;
- confirmar colunas no banco dentro da transação;
- rollback.

#### Objeto igual

- substituir limite por outro `Dinheiro` equivalente;
- manter mesmo `atualizadoEm`;
- flush;
- confirmar zero update.

Isso prova que igualdade de estado, não referência do embeddable, determina a necessidade de update.

---

### 21. Criar TestDataCleaner.java

Limpe somente:

```sql
DELETE FROM jpa_330.cliente
WHERE codigo LIKE 'CLI-JPA-330-%'
```

Use no `@BeforeEach` e `@AfterEach`.

---

### 22. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_330.
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
zero CLI-JPA-330-%;

schema history com V1;

tabela cliente existente.
```

`05_limpar_database.ps1` remove somente o database isolado depois das evidências.

---

### 23. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
managed alterada gerou update;

versão incrementou;

sem mudança não gerou update;

mesmo valor não gerou update;

alterar e restaurar não gerou update;

embeddable gerou update;

detached não gerou update;

insert não gerou update extra;

estado final ficou limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 24. Criar documentacao

`fluxo-dirty-checking.md` deve desenhar:

```text
load
    -> snapshot
        -> mudança
            -> comparação
                -> action queue
                    -> UPDATE
                        -> novo snapshot.
```

`snapshot-e-flush.md` deve documentar:

- criação do snapshot;
- managed;
- comparação;
- flush explícito;
- flush no commit;
- rollback;
- snapshot após sincronização;
- detached.

`colunas-update.md` deve diferenciar:

```text
entidade dirty;

propriedade dirty;

SQL estático;

@DynamicUpdate;

updatable=false;

trade-offs.
```

`troubleshooting-dirty-checking.md` deve cobrir:

- update não ocorre;
- entidade detached;
- transação ausente;
- update inesperado;
- timestamp mudando;
- setter com mesmo valor;
- SQL com várias colunas;
- versão incrementando;
- clear antes de flush;
- contexto grande.

---

## Entendendo o que foi feito

### O snapshot ficou visivel

A entidade managed foi comparada com o estado conhecido pelo contexto.

### O update deixou de parecer magica

A mudança Java foi detectada no flush e convertida em SQL.

### Nenhuma mudanca significou nenhuma escrita

Transações de leitura e valores iguais não produziram update.

### Embeddables participaram da entidade

A substituição de `Dinheiro` alterou colunas de Cliente e incrementou a versão.

### Detached ficou fora do acompanhamento

A mudança em objeto desanexado não foi sincronizada.

---

## Erros comuns importantes

### Chamar merge em entidade managed

Altere a instância diretamente.

### Achar que setter sempre gera update

O estado final precisa diferir do snapshot.

### Achar que dirty checking atualiza so uma coluna

Isso depende da estratégia de SQL do provider.

### Alterar timestamp mesmo sem mudanca real

O próprio timestamp torna a entidade dirty.

### Manter milhares de entidades no contexto

Snapshots aumentam custo e memória.

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

### Inspecionar versao

```sql
SELECT
    id,
    codigo,
    nome,
    limite_valor,
    limite_moeda,
    versao,
    atualizado_em
FROM jpa_330.cliente
WHERE codigo LIKE 'CLI-JPA-330-%'
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — Commit sem flush explicito

Altere entidade managed e execute apenas commit.

Confirme que o provider executou flush e update.

### Parte 2 — Dois flushes

Altere o nome, faça flush, altere novamente e faça outro flush.

Observe:

```text
dois updates;

duas alterações de versão.
```

Não transforme isso em padrão de produção.

### Parte 3 — DynamicUpdate

Em uma branch experimental, adicione:

```java
@DynamicUpdate
```

Compare o SQL.

Documente:

- colunas;
- formatos de statement;
- acoplamento;
- benefício real.

Remova antes de concluir o fluxo oficial.

### Parte 4 — Contexto read-only

Use API específica Hibernate em teste isolado para marcar uma entidade como read-only.

Altere o objeto.

Observe se o update é ignorado.

Documente o risco.

Não aplique em regra de negócio.

### Parte 5 — Embeddable equivalente

Substitua `Endereco` por outro objeto com valores idênticos.

Confirme zero update quando `atualizadoEm` não muda.

### Parte 6 — Atualizado em

Implemente método que só altera `atualizadoEm` quando algum dado de negócio realmente muda.

Crie testes de no-op.

### Parte 7 — Contexto grande

Carregue cem fixtures em base descartável.

Execute flush sem mudanças.

Meça tempo e memória apenas para observação local.

Não tire conclusão de benchmark.

### Parte 8 — Matriz

Crie:

```text
Estado | Mudança | Flush | UPDATE esperado
```

Inclua new, managed, detached, removed e read-only conceitual.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 330 existe;
- continuidade com a aula 329 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_330` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- `ClienteEntity` foi reutilizada;
- objetos de valor foram reutilizados;
- dirty checking foi definido;
- snapshot foi explicado;
- momento do snapshot foi explicado;
- somente managed foi acompanhada;
- entidade managed foi alterada;
- update não ocorreu no setter;
- update ocorreu no flush;
- commit sem flush explícito foi testado;
- nenhum método update foi criado;
- merge não foi usado em managed;
- transação sem mudança gerou zero update;
- mesmo valor gerou zero update;
- alterar e restaurar gerou zero update;
- insert inicial gerou zero update adicional;
- detached gerou zero update;
- embeddable gerou update;
- embeddable equivalente gerou zero update;
- `@Version` incrementou em update real;
- versão permaneceu em no-op;
- `criado_em` ficou fora do update;
- `atualizado_em` mudou somente com regra real;
- SQL foi observado;
- bindings não foram registrados;
- SQL estático foi diferenciado de propriedade dirty;
- `@DynamicUpdate` foi explicado;
- `@DynamicUpdate` não entrou no fluxo principal;
- updatable false foi respeitado;
- encapsulamento foi preservado;
- setters genéricos não foram criados;
- dirty checking não foi confundido com validação;
- custo de snapshots foi discutido;
- contexto longo foi desaconselhado;
- read-only foi apenas conceitual;
- bytecode enhancement não foi ativado;
- alterações externas foram diferenciadas;
- bulk update não foi antecipado;
- refresh e clear foram apenas conectados;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou vazio;
- relacionamentos não foram antecipados;
- Spring não foi usado;
- ponte para a aula 331 está correta;
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
  labs/m13/aula-330-dirty-checking
```

Commit recomendado:

```powershell
git commit -m "feat(m13): praticar dirty checking com jpa e hibernate"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou o mecanismo que transforma alterações de entidades gerenciadas em SQL.

Aprendeu:

```text
snapshot:
estado conhecido pelo contexto.

dirty checking:
comparação com o estado atual.

managed:
entidade acompanhada.

detached:
entidade fora do acompanhamento.

flush:
momento de sincronização.

@Version:
versão incrementada em update real.

embeddable:
parte do estado da entidade.

no-op:
nenhum update.
```

O laboratório comprovou:

```text
alteração managed gerando UPDATE;

nenhuma escrita sem mudança;

mesmo valor sem update;

mudança restaurada sem update;

embeddable alterado gerando update;

detached sem sincronização;

insert sem update adicional;

coluna não atualizável fora do SQL;

versão incrementada somente quando necessário.
```

A próxima aula será:

```text
331 - M13.21 - Flush clear detach e refresh
```

Nela, você aprofundará:

- quando flush ocorre;
- flush explícito;
- flush antes de commit;
- flush antes de query;
- `FlushModeType.AUTO`;
- `FlushModeType.COMMIT`;
- clear sem flush;
- flush seguido de clear;
- detach de uma entidade;
- detach com mudança pendente;
- refresh;
- sobrescrita de mudanças locais;
- refresh após atualização externa;
- ordem segura em processamento;
- rollback;
- testes com SQL e estados.

Dirty checking decide o que mudou.

A aula 331 mostrará como controlar quando sincronizar, descartar, desanexar ou recarregar.

---

# Material complementar

## Checkpoint final

- [ ] Expliquei snapshot e dirty checking.
- [ ] Comprovei update apenas em entidade managed alterada.
- [ ] Testei no-op, mesmo valor e mudança restaurada.
- [ ] Observei embeddable e incremento de versão.
- [ ] Diferenciei entidade dirty de colunas presentes no SQL.

---

## Troubleshooting adicional

### Alterei a entidade e nao houve UPDATE

Confirme:

- está managed;
- existe transação;
- ocorreu flush;
- valor final difere do snapshot.

### Houve UPDATE sem eu esperar

Verifique:

- timestamp alterado;
- embeddable substituído;
- normalização;
- método de domínio;
- listener futuro;
- valor final realmente diferente.

### SQL atualizou varias colunas

O Hibernate pode usar SQL estático.

Isso não significa que todas estavam dirty.

### Versao incrementou

Um update real ocorreu.

Inspecione o SQL e o método chamado.

### Detached mudou mas banco nao

Dirty checking não acompanha detached.

---

## Perguntas de revisao

1. O que é dirty checking?
2. O que é snapshot?
3. Qual estado participa?
4. Setter chama update imediatamente?
5. Quando o SQL ocorre?
6. É necessário chamar merge em managed?
7. Mesmo valor gera update?
8. Alterar e restaurar gera update?
9. Embeddable participa?
10. Detached participa?
11. New sem persist participa?
12. O que ocorre com @Version?
13. No-op incrementa versão?
14. Dirty checking atualiza só colunas alteradas?
15. O que faz @DynamicUpdate?
16. Updatable false é respeitado?
17. Contexto grande tem custo?
18. Dirty checking valida regra?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Detecção de mudanças managed.
2. Estado conhecido pelo contexto.
3. Managed.
4. Não.
5. No flush.
6. Não.
7. Não.
8. Não, sem flush intermediário.
9. Sim.
10. Não.
11. Não.
12. Incrementa em update real.
13. Não.
14. Não necessariamente.
15. Gera SQL por propriedades alteradas.
16. Sim.
17. Sim.
18. Não.
19. Não.
20. Flush clear detach e refresh.

---

## Desafio opcional

Crie:

```java
DirtyCheckingTrace
```

Entrada:

```text
etapa;

versão antes;

versão depois;

entidade managed;

SQL capturado;

atributos esperados.
```

Saída:

```text
Markdown determinístico.
```

Regras:

- não registrar documento;
- não registrar email;
- não registrar bindings;
- não depender de API interna Hibernate;
- lista imutável;
- testes unitários;
- classificar INSERT, UPDATE e DELETE;
- não afirmar coluna dirty apenas porque aparece no SQL.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 330 - M13.20 - Dirty checking

- Aprofundei o mecanismo de dirty checking.
- Entendi o snapshot de uma entidade managed.
- Relacionei persistence context, snapshot e flush.
- Entendi que setters não executam SQL imediatamente.
- Alterei uma entidade managed sem chamar update.
- Observei o UPDATE durante o flush.
- Confirmei flush automático antes do commit.
- Testei transação sem mudança.
- Confirmei zero UPDATE em no-op.
- Testei atribuição do mesmo valor.
- Confirmei zero UPDATE para o mesmo estado.
- Testei alteração seguida de restauração.
- Confirmei zero UPDATE sem flush intermediário.
- Substituí um embeddable.
- Observei UPDATE das colunas do objeto de valor.
- Testei embeddable equivalente.
- Confirmei zero UPDATE quando o estado final era igual.
- Alterei uma entidade detached.
- Confirmei ausência de dirty checking em detached.
- Persisti entidade nova.
- Confirmei INSERT sem UPDATE adicional.
- Observei incremento de `@Version`.
- Confirmei versão preservada em no-op.
- Mantive `criado_em` fora do UPDATE.
- Diferenciei propriedade dirty de coluna presente no SQL.
- Estudei `@DynamicUpdate` conceitualmente.
- Entendi o custo de snapshots em contextos grandes.
- Mantive Flyway no DDL e Hibernate em validate.
- Não antecipei relacionamentos, bulk update ou Spring.
- Próxima aula: Flush clear detach e refresh.
```

---

## Referencia tecnica curta

```text
Snapshot:
estado anterior.

Dirty:
estado diferente.

Managed:
acompanhada.

Detached:
não acompanhada.

Flush:
sincronização.

Update:
resultado da diferença.

Version:
incremento em escrita.

Embeddable:
parte do snapshot.

No-op:
zero update.

DynamicUpdate:
SQL por propriedades, específico Hibernate.
```

Regra final:

```text
dirty checking funciona porque o persistence context conhece a identidade e o snapshot da entidade managed; o provider sincroniza apenas quando o estado persistivel realmente muda, mas a aplicacao continua responsavel por invariantes, transacoes curtas, observacao do SQL e controle do custo do contexto.
```
