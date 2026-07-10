# 320 - M13.10 - Mini projeto JDBC CRUD OS parte 1

## Apresentacao da aula

Você chegou ao primeiro mini projeto integrado do módulo de persistência Java.

Nas aulas 311 a 319, cada mecanismo foi estudado separadamente:

```text
driver PostgreSQL;

Connection e DataSource;

PreparedStatement;

ResultSet;

mapeamento manual;

DAO;

Repository Pattern;

tradução de exceções;

transações;

HikariCP.
```

Agora esses elementos serão reunidos em um projeto único e coerente.

O domínio escolhido é o mesmo construído no módulo SQL:

```text
Ordem de Serviço.
```

O banco já possui:

```text
schema:
projeto_os_final.

tabelas principais:
cliente;
produto;
ordem_servico;
ordem_status_historico.
```

A parte 1 do mini projeto implementará:

```text
CREATE:
criar uma Ordem e seu histórico inicial.

READ:
buscar por ID;
buscar por código;
listar com filtros.
```

A parte 2 concluirá o CRUD.

Nesta aula, você não implementará ainda:

- alteração completa da Ordem;
- mudança de status;
- exclusão;
- paginação por cursor;
- auditoria de atualização;
- encerramento integral do projeto.

O objetivo é construir uma base sólida, executável e testável, que a aula 321 possa evoluir sem refatoração improvisada.

A criação de uma Ordem exige mais que um `INSERT`.

A unidade de trabalho será:

1. validar se o Cliente existe e está ativo;
2. validar se o Produto existe e está ativo;
3. inserir a Ordem com status `ABERTA`;
4. inserir o histórico inicial `NULL -> ABERTA`;
5. ler a Ordem criada;
6. confirmar tudo com um único `commit`.

Se qualquer etapa falhar:

```text
rollback integral.
```

Não pode existir:

```text
Ordem sem histórico inicial.
```

Também não pode existir:

```text
histórico sem Ordem.
```

A aplicação dependerá de:

```java
OrdemRepository
```

A implementação real será:

```java
JdbcOrdemRepository
```

A infraestrutura utilizará:

```text
HikariDataSource;

DataSourceConnectionProvider;

JdbcTransactionManager;

JdbcExceptionTranslator;

OrdemDao;

OrdemHistoricoDao;

OrdemMapper.
```

O projeto terá testes unitários e de integração.

As fixtures usarão códigos reservados:

```text
OS-JDBC-320-%.
```

Depois de cada teste, somente esses dados serão removidos.

O estado oficial precisa terminar com:

```text
6 Ordens;

12 históricos;

nenhuma Ordem de teste.
```

A próxima aula será:

```text
321 - M13.11 - Mini projeto JDBC CRUD OS parte 2
```

---

## Onde estamos na formacao

O M13 avançou por uma sequência intencional:

```text
311:
driver.

312:
conexão.

313:
statement seguro.

314:
leitura e mapeamento.

315:
DAO.

316:
Repository Pattern.

317:
exceções.

318:
transações.

319:
pool.

320:
mini projeto parte 1.

321:
mini projeto parte 2.
```

Até a aula 319, os exemplos eram focados em uma capacidade.

Agora o projeto precisa responder perguntas de engenharia:

- quais classes pertencem ao domínio;
- quais contratos pertencem à aplicação;
- quais detalhes pertencem à infraestrutura;
- onde começa e termina uma transação;
- como tratar referências inválidas;
- como retornar a entidade criada;
- como manter SQL explícito;
- como testar sem contaminar o seed;
- como impedir que JDBC atravesse as fronteiras.

A arquitetura será:

```text
Main
    -> casos de uso
        -> OrdemRepository
            -> JdbcOrdemRepository
                -> JdbcTransactionManager
                -> DAOs
                -> Mapper
                    -> PostgreSQL.
```

Nesta aula:

```text
CREATE:
sim.

READ:
sim.

UPDATE:
não.

DELETE:
somente limpeza técnica de fixture.

pool:
sim.

transação:
sim.

Repository Pattern:
sim.

Spring:
não.

JPA:
não.

Hibernate:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-320-mini-projeto-jdbc-crud-os-parte-1
```

Estrutura final:

```text
labs
└── m13
    └── aula-320-mini-projeto-jdbc-crud-os-parte-1
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── arquitetura-parte-1.md
        │   ├── contrato-criacao-os.md
        │   ├── contrato-consultas-os.md
        │   ├── matriz-erros.md
        │   └── troubleshooting-projeto.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_projeto.ps1
        │   ├── 03_limpar_fixtures.ps1
        │   └── 04_validar_estado_final.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula320
            │                           ├── Main.java
            │                           ├── application
            │                           │   ├── CriarOrdem.java
            │                           │   ├── CriarOrdemComando.java
            │                           │   ├── ConsultarOrdem.java
            │                           │   ├── ListarOrdens.java
            │                           │   ├── ListarOrdensFiltro.java
            │                           │   ├── OrdemRepository.java
            │                           │   ├── PersistenciaCategoria.java
            │                           │   ├── PersistenciaException.java
            │                           │   └── PersistenciaFalha.java
            │                           ├── domain
            │                           │   ├── EntidadeRelacionadaInvalidaException.java
            │                           │   ├── Ordem.java
            │                           │   ├── OrdemCodigo.java
            │                           │   ├── OrdemPrioridade.java
            │                           │   └── OrdemStatus.java
            │                           └── infrastructure
            │                               └── jdbc
            │                                   ├── CadastroReferenciaDao.java
            │                                   ├── ConnectionProvider.java
            │                                   ├── ConnectionState.java
            │                                   ├── DataSourceConnectionProvider.java
            │                                   ├── DatabaseSettings.java
            │                                   ├── HikariDataSourceFactory.java
            │                                   ├── JdbcExceptionTranslator.java
            │                                   ├── JdbcOrdemRepository.java
            │                                   ├── JdbcTransactionManager.java
            │                                   ├── OrdemDao.java
            │                                   ├── OrdemHistoricoDao.java
            │                                   ├── OrdemMapper.java
            │                                   ├── PoolSettings.java
            │                                   └── TransactionWork.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula320
                                        ├── application
                                        │   ├── CriarOrdemTest.java
                                        │   └── FakeOrdemRepository.java
                                        ├── domain
                                        │   └── OrdemCodigoTest.java
                                        └── infrastructure
                                            └── jdbc
                                                ├── JdbcOrdemRepositoryIT.java
                                                └── TestDataCleaner.java
```

Resultados esperados:

```text
criação:
Ordem ABERTA;
versão 0;
histórico inicial;
ID gerado pelo banco.

busca por ID:
Ordem encontrada.

busca por código:
Ordem encontrada.

código inexistente:
Optional vazio.

listagem:
ordenação determinística;
filtro por status;
filtro por Cliente;
limite respeitado.

código malicioso:
tratado como dado.

estado final:
seed preservado.
```

---

## Conceito essencial

### Projeto integrado nao e colagem de classes

Reutilizar código não significa copiar tudo de todas as aulas.

Cada classe precisa justificar sua presença.

O projeto manterá:

```text
domain:
tipos e invariantes.

application:
casos de uso e portas.

infrastructure:
JDBC, pool, SQL e transações.

Main:
composição.
```

Não crie uma pasta `util` para esconder responsabilidades indefinidas.

---

### Parte 1 do CRUD

CRUD significa:

```text
Create;

Read;

Update;

Delete.
```

A parte 1 implementa `Create` e `Read`.

A divisão permite aprofundar:

- criação atômica;
- referências;
- retorno do registro criado;
- histórico inicial;
- consultas tipadas;
- filtros;
- testes;
- limpeza.

A parte 2 concluirá as operações restantes.

---

### Ordem como objeto do dominio

`Ordem` representa uma linha de leitura completa.

Ela não contém:

- `Connection`;
- `ResultSet`;
- SQL;
- annotations JPA;
- métodos de persistência.

Campos principais:

```text
id;

codigo;

clienteId;

clienteNome;

produtoId;

produtoNome;

status;

prioridade;

descricaoProblema;

dataAgendada;

abertaEm;

concluidaEm;

valorPrevisto;

versao;

metadadosJson;

criadoEm;

atualizadoEm.
```

---

### OrdemCodigo como value object

O código da Ordem será um record:

```java
OrdemCodigo
```

Responsabilidades:

- remover espaços externos;
- converter para maiúsculas;
- validar prefixo `OS-`;
- limitar tamanho;
- permitir somente letras, números e hífen;
- fornecer igualdade por valor.

A aplicação não passa uma `String` sem contrato para o repository.

---

### Enums do dominio

Status:

```text
ABERTA;

AGENDADA;

EM_ATENDIMENTO;

CONCLUIDA;

CANCELADA.
```

Prioridade:

```text
BAIXA;

NORMAL;

ALTA;

CRITICA.
```

O mapper usa:

```java
OrdemStatus.valueOf(...)
```

e:

```java
OrdemPrioridade.valueOf(...)
```

Se o banco contiver valor fora do contrato, a leitura falhará.

A constraint SQL já protege os valores.

---

### Comando de criacao

`CriarOrdemComando` não possui ID.

O banco gera o ID.

Campos:

```text
codigo;

clienteId;

produtoId;

prioridade;

descricaoProblema;

dataAgendada;

abertaEm;

valorPrevisto;

metadadosJson;

ator.
```

Regras:

- IDs positivos;
- descrição obrigatória;
- valor não negativo;
- data agendada não anterior à abertura;
- ator obrigatório;
- metadata com objeto JSON textual;
- status inicial fixo `ABERTA`;
- versão inicial zero.

O consumidor não pode escolher status inicial diferente.

---

### Referencias relacionadas

A foreign key garante que Cliente e Produto existem.

Mas o requisito do projeto também exige:

```text
Cliente ativo;

Produto ativo.
```

A infraestrutura consultará:

```sql
SELECT ativo
FROM projeto_os_final.cliente
WHERE id = ?
```

e fará o mesmo para Produto.

As verificações acontecem dentro da mesma transação de criação.

Se a referência não existir ou estiver inativa:

```text
EntidadeRelacionadaInvalidaException.
```

Isso é uma falha de regra, não uma `PersistenciaException`.

---

### Criacao atomica

A criação usa uma conexão e um commit.

Fluxo:

```text
validar Cliente;

validar Produto;

INSERT Ordem RETURNING id;

INSERT histórico inicial;

SELECT da Ordem criada;

commit.
```

Se o histórico falhar, a Ordem sofre rollback.

Se a leitura final falhar, a transação também não confirma.

---

### INSERT RETURNING

PostgreSQL permite:

```sql
INSERT ...
RETURNING id
```

Isso evita:

- consulta por sequência global;
- suposição sobre ID;
- corrida entre sessões;
- dependência de `currval` fora de contexto.

O DAO lê o ID pelo `ResultSet` da própria instrução.

---

### Historico inicial

Toda Ordem criada recebe:

```text
status_anterior:
NULL.

status_novo:
ABERTA.

origem:
API.

ator:
valor do comando.

motivo:
Criação da Ordem.
```

O histórico pertence à mesma transação.

---

### Repository como porta

Contrato:

```java
public interface OrdemRepository {

    Ordem criar(
            CriarOrdemComando comando
    );

    Optional<Ordem> buscarPorId(
            long id
    );

    Optional<Ordem> buscarPorCodigo(
            OrdemCodigo codigo
    );

    List<Ordem> listar(
            ListarOrdensFiltro filtro
    );
}
```

A aplicação não conhece JDBC.

---

### Filtro de listagem

`ListarOrdensFiltro` terá:

```text
status opcional;

clienteId opcional;

limite entre 1 e 100.
```

A consulta usa parâmetros.

Não concatene status ou ID no SQL.

Ordenação:

```sql
ORDER BY
    ordem.aberta_em DESC,
    ordem.id DESC
```

O ID resolve empates.

---

### Consulta estatica com filtros opcionais

SQL:

```sql
WHERE (
    CAST(? AS text) IS NULL
    OR ordem.status = ?
)
AND (
    CAST(? AS bigint) IS NULL
    OR ordem.cliente_id = ?
)
```

Cada valor aparece duas vezes.

Quando o filtro é ausente, use `setNull`.

Quando presente, associe o valor nos dois parâmetros.

O limite continua parametrizado.

---

### SQL Injection

Busca por código:

```sql
WHERE ordem.codigo = ?
```

Uma entrada como:

```text
OS-X' OR '1'='1
```

não altera a estrutura SQL.

O value object rejeitará caracteres inválidos antes da infraestrutura.

Um teste direto do DAO também deve manter `PreparedStatement`.

---

### Mapper unico

`OrdemMapper` converte a linha atual.

Todas as consultas usam os mesmos aliases.

Isso evita múltiplos mapeamentos divergentes.

O mapper não:

- abre conexão;
- executa SQL;
- percorre lista;
- trata regra;
- imprime.

---

### Excecoes

O adapter captura `SQLException` e usa:

```java
JdbcExceptionTranslator
```

Categorias relevantes:

```text
CONEXAO;

AUTENTICACAO;

DATABASE_INVALIDO;

DADOS_INVALIDOS;

INTEGRIDADE;

SQL_OU_PERMISSAO;

RECURSO;

TRANSACAO_ABORTADA;

DESCONHECIDA.
```

SQLState classe `22` será mapeada para:

```text
DADOS_INVALIDOS.
```

Isso cobre, por exemplo, JSON inválido enviado ao cast `jsonb`.

A causa permanece preservada.

---

### Pool e ciclo de vida

O `HikariDataSource` será criado uma vez no `Main`.

O repository recebe componentes já montados.

Nenhum DAO cria pool.

Nenhuma operação fecha o DataSource.

Cada operação fecha apenas a conexão lógica obtida.

O DataSource fecha no shutdown.

---

### Testes sem contaminar o seed

Testes de integração usam prefixo:

```text
OS-JDBC-320-
```

A limpeza técnica executa:

1. excluir históricos das Ordens do prefixo;
2. excluir Ordens do prefixo.

A limpeza não representa a operação `Delete` do CRUD.

Ela existe somente na infraestrutura de teste.

O script final confirma:

```text
6 Ordens;

12 históricos;

zero fixtures.
```

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\src\main\java\br\com\formacao\m13\aula320\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\src\main\java\br\com\formacao\m13\aula320\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\src\main\java\br\com\formacao\m13\aula320\infrastructure\jdbc"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\src\test\java\br\com\formacao\m13\aula320\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\src\test\java\br\com\formacao\m13\aula320\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1\src\test\java\br\com\formacao\m13\aula320\infrastructure\jdbc"

Set-Location `
  "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1"
```

---

### 2. Criar .gitignore e pom.xml

Use o mesmo `.gitignore` da aula 319.

No `pom.xml`, mantenha:

```text
Java 21;

pgJDBC 42.7.13;

HikariCP 7.1.0;

SLF4J Simple 2.0.17;

JUnit 5.10.2;

Surefire;

Failsafe;

Exec Maven Plugin.
```

Artifact:

```text
aula-320-mini-projeto-jdbc-os.
```

Main class:

```text
br.com.formacao.m13.aula320.Main.
```

---

### 3. Criar configuracao local

Use:

```properties
JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java
JDBC_USER=formacao
JDBC_PASSWORD=formacao_local
JDBC_SCHEMA=projeto_os_final
JDBC_APPLICATION_NAME=aula-320-jdbc-os

HIKARI_POOL_NAME=aula-320-principal
HIKARI_MAXIMUM_POOL_SIZE=4
HIKARI_MINIMUM_IDLE=1
HIKARI_CONNECTION_TIMEOUT_MS=2000
HIKARI_VALIDATION_TIMEOUT_MS=1000
HIKARI_IDLE_TIMEOUT_MS=60000
HIKARI_MAX_LIFETIME_MS=600000
HIKARI_KEEPALIVE_TIME_MS=120000
HIKARI_INITIALIZATION_FAIL_TIMEOUT_MS=5000
```

Copie para `database.local.env`.

Não versione o arquivo real.

---

### 4. Reutilizar infraestrutura consolidada

Copie e ajuste packages:

```text
DatabaseSettings;

PoolSettings;

HikariDataSourceFactory;

ConnectionProvider;

DataSourceConnectionProvider;

ConnectionState;

TransactionWork;

JdbcTransactionManager;

PersistenciaCategoria;

PersistenciaFalha;

PersistenciaException;

JdbcExceptionTranslator.
```

Adicione ao tradutor:

```java
case "22" ->
        PersistenciaCategoria
                .DADOS_INVALIDOS;
```

Mensagem segura:

```text
Os dados enviados não são válidos para persistência.
```

---

### 5. Criar enums e OrdemCodigo

`OrdemStatus.java`:

```java
package br.com.formacao.m13.aula320.domain;

public enum OrdemStatus {
    ABERTA,
    AGENDADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

`OrdemPrioridade.java`:

```java
package br.com.formacao.m13.aula320.domain;

public enum OrdemPrioridade {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

`OrdemCodigo.java`:

```java
package br.com.formacao.m13.aula320.domain;

import java.util.Locale;
import java.util.regex.Pattern;

public record OrdemCodigo(
        String valor
) {

    private static final Pattern FORMAT =
            Pattern.compile(
                    "OS-[A-Z0-9-]{1,77}"
            );

    public OrdemCodigo {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(
                    "Código da Ordem é obrigatório"
            );
        }

        valor = valor
                .trim()
                .toUpperCase(Locale.ROOT);

        if (valor.length() > 80) {
            throw new IllegalArgumentException(
                    "Código excede 80 caracteres"
            );
        }

        if (!FORMAT.matcher(valor).matches()) {
            throw new IllegalArgumentException(
                    "Código da Ordem inválido"
            );
        }
    }
}
```

---

### 6. Criar Ordem.java

Crie o record:

```java
package br.com.formacao.m13.aula320.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record Ordem(
        long id,
        OrdemCodigo codigo,
        long clienteId,
        String clienteNome,
        long produtoId,
        String produtoNome,
        OrdemStatus status,
        OrdemPrioridade prioridade,
        String descricaoProblema,
        LocalDate dataAgendada,
        OffsetDateTime abertaEm,
        OffsetDateTime concluidaEm,
        BigDecimal valorPrevisto,
        int versao,
        String metadadosJson,
        OffsetDateTime criadoEm,
        OffsetDateTime atualizadoEm
) {

    public Ordem {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        if (codigo == null) {
            throw new IllegalArgumentException(
                    "codigo é obrigatório"
            );
        }

        if (clienteId <= 0 || produtoId <= 0) {
            throw new IllegalArgumentException(
                    "referências devem ser positivas"
            );
        }

        requireText(clienteNome, "clienteNome");
        requireText(produtoNome, "produtoNome");
        requireText(
                descricaoProblema,
                "descricaoProblema"
        );

        if (
            status == null
            || prioridade == null
            || abertaEm == null
            || valorPrevisto == null
            || criadoEm == null
            || atualizadoEm == null
        ) {
            throw new IllegalArgumentException(
                    "Campos obrigatórios ausentes"
            );
        }

        if (valorPrevisto.signum() < 0) {
            throw new IllegalArgumentException(
                    "valorPrevisto negativo"
            );
        }

        if (versao < 0) {
            throw new IllegalArgumentException(
                    "versao negativa"
            );
        }

        requireText(
                metadadosJson,
                "metadadosJson"
        );
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
}
```

---

### 7. Criar comando e filtro

`CriarOrdemComando.java`:

```java
package br.com.formacao.m13.aula320.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import br.com.formacao.m13.aula320.domain.OrdemCodigo;
import br.com.formacao.m13.aula320.domain.OrdemPrioridade;

public record CriarOrdemComando(
        OrdemCodigo codigo,
        long clienteId,
        long produtoId,
        OrdemPrioridade prioridade,
        String descricaoProblema,
        LocalDate dataAgendada,
        OffsetDateTime abertaEm,
        BigDecimal valorPrevisto,
        String metadadosJson,
        String ator
) {

    public CriarOrdemComando {
        if (codigo == null || prioridade == null) {
            throw new IllegalArgumentException(
                    "codigo e prioridade obrigatórios"
            );
        }

        if (clienteId <= 0 || produtoId <= 0) {
            throw new IllegalArgumentException(
                    "IDs relacionados inválidos"
            );
        }

        if (
            descricaoProblema == null
            || descricaoProblema.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "descrição obrigatória"
            );
        }

        descricaoProblema =
                descricaoProblema.trim();

        if (abertaEm == null) {
            throw new IllegalArgumentException(
                    "abertaEm é obrigatório"
            );
        }

        if (
            dataAgendada != null
            && dataAgendada.isBefore(
                    abertaEm.toLocalDate()
            )
        ) {
            throw new IllegalArgumentException(
                    "dataAgendada anterior à abertura"
            );
        }

        if (
            valorPrevisto == null
            || valorPrevisto.signum() < 0
        ) {
            throw new IllegalArgumentException(
                    "valorPrevisto inválido"
            );
        }

        if (
            metadadosJson == null
            || metadadosJson.isBlank()
            || !metadadosJson.trim()
                    .startsWith("{")
            || !metadadosJson.trim()
                    .endsWith("}")
        ) {
            throw new IllegalArgumentException(
                    "metadados devem representar objeto JSON"
            );
        }

        metadadosJson =
                metadadosJson.trim();

        if (ator == null || ator.isBlank()) {
            throw new IllegalArgumentException(
                    "ator é obrigatório"
            );
        }

        ator = ator.trim();
    }
}
```

`ListarOrdensFiltro.java`:

```java
package br.com.formacao.m13.aula320.application;

import br.com.formacao.m13.aula320.domain.OrdemStatus;

public record ListarOrdensFiltro(
        OrdemStatus status,
        Long clienteId,
        int limite
) {

    public ListarOrdensFiltro {
        if (
            clienteId != null
            && clienteId <= 0
        ) {
            throw new IllegalArgumentException(
                    "clienteId inválido"
            );
        }

        if (limite < 1 || limite > 100) {
            throw new IllegalArgumentException(
                    "limite deve estar entre 1 e 100"
            );
        }
    }

    public static ListarOrdensFiltro recentes(
            int limite
    ) {
        return new ListarOrdensFiltro(
                null,
                null,
                limite
        );
    }
}
```

---

### 8. Criar porta e casos de uso

`OrdemRepository.java`:

```java
package br.com.formacao.m13.aula320.application;

import java.util.List;
import java.util.Optional;

import br.com.formacao.m13.aula320.domain.Ordem;
import br.com.formacao.m13.aula320.domain.OrdemCodigo;

public interface OrdemRepository {

    Ordem criar(
            CriarOrdemComando comando
    );

    Optional<Ordem> buscarPorId(
            long id
    );

    Optional<Ordem> buscarPorCodigo(
            OrdemCodigo codigo
    );

    List<Ordem> listar(
            ListarOrdensFiltro filtro
    );
}
```

Crie os casos de uso:

```text
CriarOrdem;

ConsultarOrdem;

ListarOrdens.
```

Cada um recebe `OrdemRepository` por construtor.

`CriarOrdem.executar` delega o comando.

`ConsultarOrdem` possui:

```java
Optional<Ordem> porId(long id);

Optional<Ordem> porCodigo(
        OrdemCodigo codigo
);
```

`ListarOrdens.executar` devolve `List.copyOf`.

Nenhum caso de uso importa JDBC.

---

### 9. Criar EntidadeRelacionadaInvalidaException.java

```java
package br.com.formacao.m13.aula320.domain;

public final class EntidadeRelacionadaInvalidaException
        extends RuntimeException {

    public EntidadeRelacionadaInvalidaException(
            String tipo,
            long id
    ) {
        super(
                tipo
                        + " inexistente ou inativo: "
                        + id
        );
    }
}
```

---

### 10. Criar CadastroReferenciaDao.java

```java
package br.com.formacao.m13.aula320.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class CadastroReferenciaDao {

    private static final String CLIENTE_ATIVO = """
            SELECT ativo
            FROM projeto_os_final.cliente
            WHERE id = ?
            """;

    private static final String PRODUTO_ATIVO = """
            SELECT ativo
            FROM projeto_os_final.produto
            WHERE id = ?
            """;

    public boolean clienteAtivo(
            Connection connection,
            long id
    ) throws SQLException {
        return readActive(
                connection,
                CLIENTE_ATIVO,
                id
        );
    }

    public boolean produtoAtivo(
            Connection connection,
            long id
    ) throws SQLException {
        return readActive(
                connection,
                PRODUTO_ATIVO,
                id
        );
    }

    private static boolean readActive(
            Connection connection,
            String sql,
            long id
    ) throws SQLException {
        try (
            PreparedStatement statement =
                    connection.prepareStatement(sql)
        ) {
            statement.setLong(1, id);

            try (
                ResultSet resultSet =
                        statement.executeQuery()
            ) {
                return resultSet.next()
                        && resultSet.getBoolean(
                                "ativo"
                        );
            }
        }
    }
}
```

---

### 11. Criar OrdemMapper.java

```java
package br.com.formacao.m13.aula320.infrastructure.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import br.com.formacao.m13.aula320.domain.Ordem;
import br.com.formacao.m13.aula320.domain.OrdemCodigo;
import br.com.formacao.m13.aula320.domain.OrdemPrioridade;
import br.com.formacao.m13.aula320.domain.OrdemStatus;

final class OrdemMapper {

    private OrdemMapper() {
    }

    static Ordem map(
            ResultSet resultSet
    ) throws SQLException {
        return new Ordem(
                resultSet.getLong("ordem_id"),
                new OrdemCodigo(
                        resultSet.getString(
                                "ordem_codigo"
                        )
                ),
                resultSet.getLong("cliente_id"),
                resultSet.getString(
                        "cliente_nome"
                ),
                resultSet.getLong("produto_id"),
                resultSet.getString(
                        "produto_nome"
                ),
                OrdemStatus.valueOf(
                        resultSet.getString(
                                "ordem_status"
                        )
                ),
                OrdemPrioridade.valueOf(
                        resultSet.getString(
                                "ordem_prioridade"
                        )
                ),
                resultSet.getString(
                        "descricao_problema"
                ),
                resultSet.getObject(
                        "data_agendada",
                        LocalDate.class
                ),
                resultSet.getObject(
                        "aberta_em",
                        OffsetDateTime.class
                ),
                resultSet.getObject(
                        "concluida_em",
                        OffsetDateTime.class
                ),
                resultSet.getBigDecimal(
                        "valor_previsto"
                ),
                resultSet.getInt("versao"),
                resultSet.getString(
                        "metadados_json"
                ),
                resultSet.getObject(
                        "criado_em",
                        OffsetDateTime.class
                ),
                resultSet.getObject(
                        "atualizado_em",
                        OffsetDateTime.class
                )
        );
    }
}
```

---

### 12. Criar OrdemDao.java

Mantenha uma constante `BASE_SELECT` com todas as colunas e aliases.

Operações:

```java
long insert(
        Connection,
        CriarOrdemComando
);

Optional<Ordem> findById(
        Connection,
        long
);

Optional<Ordem> findByCode(
        Connection,
        OrdemCodigo
);

List<Ordem> list(
        Connection,
        ListarOrdensFiltro
);
```

SQL de inserção:

```sql
INSERT INTO projeto_os_final.ordem_servico (
    codigo,
    cliente_id,
    produto_id,
    status,
    prioridade,
    descricao_problema,
    data_agendada,
    aberta_em,
    concluida_em,
    valor_previsto,
    versao,
    metadados,
    criado_em,
    atualizado_em
)
VALUES (
    ?,
    ?,
    ?,
    'ABERTA',
    ?,
    ?,
    ?,
    ?,
    NULL,
    ?,
    0,
    CAST(? AS jsonb),
    ?,
    ?
)
RETURNING id
```

Associe:

- código;
- Cliente;
- Produto;
- prioridade;
- descrição;
- data opcional;
- abertura;
- valor;
- metadata;
- criado e atualizado iguais à abertura.

Se `RETURNING` não produzir linha, lance `SQLException`.

---

### 13. Criar OrdemHistoricoDao.java

```java
package br.com.formacao.m13.aula320.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

import br.com.formacao.m13.aula320.application.CriarOrdemComando;

public final class OrdemHistoricoDao {

    public void insertInitial(
            Connection connection,
            long ordemId,
            CriarOrdemComando command
    ) throws SQLException {
        String sql = """
                INSERT INTO
                    projeto_os_final
                        .ordem_status_historico (
                            ordem_servico_id,
                            status_anterior,
                            status_novo,
                            ocorrido_em,
                            origem,
                            ator,
                            motivo
                        )
                VALUES (
                    ?,
                    NULL,
                    'ABERTA',
                    ?,
                    'API',
                    ?,
                    'Criação da Ordem'
                )
                """;

        try (
            var statement =
                    connection.prepareStatement(
                            sql
                    )
        ) {
            statement.setLong(1, ordemId);
            statement.setObject(
                    2,
                    command.abertaEm()
            );
            statement.setString(
                    3,
                    command.ator()
            );

            if (statement.executeUpdate() != 1) {
                throw new SQLException(
                        "Histórico inicial não inserido",
                        "HY000"
                );
            }
        }
    }
}
```

---

### 14. Criar JdbcOrdemRepository.java

```java
package br.com.formacao.m13.aula320.infrastructure.jdbc;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import br.com.formacao.m13.aula320.application.CriarOrdemComando;
import br.com.formacao.m13.aula320.application.ListarOrdensFiltro;
import br.com.formacao.m13.aula320.application.OrdemRepository;
import br.com.formacao.m13.aula320.domain.EntidadeRelacionadaInvalidaException;
import br.com.formacao.m13.aula320.domain.Ordem;
import br.com.formacao.m13.aula320.domain.OrdemCodigo;

public final class JdbcOrdemRepository
        implements OrdemRepository {

    private final ConnectionProvider provider;
    private final JdbcTransactionManager transactions;
    private final JdbcExceptionTranslator translator;
    private final CadastroReferenciaDao references;
    private final OrdemDao ordemDao;
    private final OrdemHistoricoDao historicoDao;

    public JdbcOrdemRepository(
            ConnectionProvider provider,
            JdbcTransactionManager transactions,
            JdbcExceptionTranslator translator,
            CadastroReferenciaDao references,
            OrdemDao ordemDao,
            OrdemHistoricoDao historicoDao
    ) {
        this.provider = Objects.requireNonNull(provider);
        this.transactions =
                Objects.requireNonNull(transactions);
        this.translator =
                Objects.requireNonNull(translator);
        this.references =
                Objects.requireNonNull(references);
        this.ordemDao =
                Objects.requireNonNull(ordemDao);
        this.historicoDao =
                Objects.requireNonNull(historicoDao);
    }

    @Override
    public Ordem criar(
            CriarOrdemComando comando
    ) {
        Objects.requireNonNull(comando);

        return transactions.execute(
                "criar Ordem de Serviço",
                connection -> {
                    if (
                        !references.clienteAtivo(
                                connection,
                                comando.clienteId()
                        )
                    ) {
                        throw new EntidadeRelacionadaInvalidaException(
                                "Cliente",
                                comando.clienteId()
                        );
                    }

                    if (
                        !references.produtoAtivo(
                                connection,
                                comando.produtoId()
                        )
                    ) {
                        throw new EntidadeRelacionadaInvalidaException(
                                "Produto",
                                comando.produtoId()
                        );
                    }

                    long id =
                            ordemDao.insert(
                                    connection,
                                    comando
                            );

                    historicoDao.insertInitial(
                            connection,
                            id,
                            comando
                    );

                    return ordemDao
                            .findById(
                                    connection,
                                    id
                            )
                            .orElseThrow(
                                    () ->
                                            new IllegalStateException(
                                                    "Ordem criada não encontrada"
                                            )
                            );
                }
        );
    }

    @Override
    public Optional<Ordem> buscarPorId(
            long id
    ) {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        try (
            var connection =
                    provider.open()
        ) {
            return ordemDao.findById(
                    connection,
                    id
            );
        } catch (SQLException exception) {
            throw translator.translate(
                    "buscar Ordem por ID",
                    exception
            );
        }
    }

    @Override
    public Optional<Ordem> buscarPorCodigo(
            OrdemCodigo codigo
    ) {
        Objects.requireNonNull(codigo);

        try (
            var connection =
                    provider.open()
        ) {
            return ordemDao.findByCode(
                    connection,
                    codigo
            );
        } catch (SQLException exception) {
            throw translator.translate(
                    "buscar Ordem por código",
                    exception
            );
        }
    }

    @Override
    public List<Ordem> listar(
            ListarOrdensFiltro filtro
    ) {
        Objects.requireNonNull(filtro);

        try (
            var connection =
                    provider.open()
        ) {
            return ordemDao.list(
                    connection,
                    filtro
            );
        } catch (SQLException exception) {
            throw translator.translate(
                    "listar Ordens",
                    exception
            );
        }
    }
}
```

---

### 15. Criar Main.java

O `Main` deve:

1. carregar configurações;
2. criar `HikariDataSource`;
3. montar provider, translator, transaction manager e DAOs;
4. montar `JdbcOrdemRepository`;
5. montar casos de uso;
6. criar uma Ordem com código reservado;
7. buscar por ID;
8. buscar por código;
9. listar Ordens abertas;
10. exibir resultados sem imprimir senha;
11. limpar a fixture em `finally`;
12. fechar o DataSource.

Comando de demonstração:

```java
new CriarOrdemComando(
        new OrdemCodigo(
                "OS-JDBC-320-MAIN"
        ),
        307004L,
        307104L,
        OrdemPrioridade.NORMAL,
        "Ajuste de montagem no móvel",
        LocalDate.of(2026, 7, 20),
        OffsetDateTime.parse(
                "2026-07-10T14:30:00-03:00"
        ),
        new BigDecimal("850.00"),
        """
        {
          "origem": "AULA_320",
          "canal": "CLI"
        }
        """,
        "formacao-java"
);
```

Cliente `307004` não possui Ordens no seed.

Produto `307104` é o Móvel Planejado.

---

### 16. Criar TestDataCleaner.java

A classe de teste deve limpar somente:

```text
OS-JDBC-320-%.
```

Dentro de uma transação técnica:

```sql
DELETE FROM
    projeto_os_final.ordem_status_historico
WHERE ordem_servico_id IN (
    SELECT id
    FROM projeto_os_final.ordem_servico
    WHERE codigo LIKE 'OS-JDBC-320-%'
);

DELETE FROM
    projeto_os_final.ordem_servico
WHERE codigo LIKE 'OS-JDBC-320-%';
```

Confirme quantidade de linhas e execute `commit`.

Em falha, execute rollback.

Essa classe fica em `src/test`.

Para o `Main`, crie uma limpeza didática equivalente em uma classe de demonstração ou execute a aplicação somente em ambiente local reservado.

---

### 17. Criar testes unitarios

`OrdemCodigoTest` deve validar:

- normalização;
- igualdade;
- prefixo;
- tamanho;
- caractere inválido;
- valor vazio.

`CriarOrdemTest` usa `FakeOrdemRepository`.

Valide:

- comando é delegado;
- retorno é preservado;
- null é rejeitado;
- aplicação não precisa de banco.

O fake pode usar `Map<OrdemCodigo, Ordem>`.

Não simule JDBC no teste do caso de uso.

---

### 18. Criar JdbcOrdemRepositoryIT.java

Use:

```text
@BeforeEach:
cleaner.cleanup.

@AfterEach:
cleaner.cleanup.
```

Casos obrigatórios:

#### Criar com historico

- código `OS-JDBC-320-CREATE`;
- Cliente 307004;
- Produto 307104;
- esperar ID positivo;
- status `ABERTA`;
- versão zero;
- um histórico inicial;
- status anterior nulo;
- status novo `ABERTA`.

#### Buscar por ID e codigo

Crie uma Ordem.

Busque pelas duas chaves.

Compare o mesmo ID.

#### Listar com filtros

Crie duas Ordens:

```text
OS-JDBC-320-LIST-A;

OS-JDBC-320-LIST-B.
```

Liste:

```text
status ABERTA;

cliente 307004;

limite 10.
```

Confirme que as duas aparecem em ordem determinística.

#### Codigo duplicado

Crie uma vez.

Tente novamente.

Espere:

```text
PersistenciaException;

categoria INTEGRIDADE;

SQLState 23505.
```

Confirme apenas uma Ordem e um histórico.

#### Cliente inexistente

Use ID `999999`.

Espere `EntidadeRelacionadaInvalidaException`.

Confirme que nenhuma Ordem foi inserida.

#### JSON invalido

Contorne a validação textual com conteúdo que começa e termina com chaves, mas é inválido:

```text
{invalido}
```

Espere:

```text
PersistenciaException;

categoria DADOS_INVALIDOS;

SQLState 22P02.
```

Confirme rollback integral.

---

### 19. Criar scripts

`01_verificar_pre_requisitos.ps1` valida:

```text
Java 21;

Maven;

PostgreSQL;

6 Ordens;

12 históricos;

Cliente 307004 ativo;

Produto 307104 ativo;

ausência de OS-JDBC-320-%.
```

`02_executar_projeto.ps1` carrega variáveis e executa:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

`03_limpar_fixtures.ps1` remove somente o prefixo reservado.

`04_validar_estado_final.ps1` exige:

```sql
SELECT
    (SELECT count(*)
     FROM projeto_os_final.ordem_servico) = 6
AND
    (SELECT count(*)
     FROM projeto_os_final.ordem_status_historico) = 12
AND NOT EXISTS (
    SELECT 1
    FROM projeto_os_final.ordem_servico
    WHERE codigo LIKE 'OS-JDBC-320-%'
);
```

Resultado:

```text
t.
```

---

### 20. Executar o projeto

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_projeto.ps1
.\scripts\03_limpar_fixtures.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
criação atômica;

histórico inicial;

buscas corretas;

listagem filtrada;

duplicidade traduzida;

referência inválida sem insert;

JSON inválido com rollback;

seed preservado.
```

---

### 21. Criar documentacao

`arquitetura-parte-1.md` deve desenhar camadas e dependências permitidas.

`contrato-criacao-os.md` deve registrar:

- entrada;
- validações;
- referências;
- transação;
- status inicial;
- versão;
- histórico;
- retorno;
- falhas.

`contrato-consultas-os.md` deve registrar:

- busca por ID;
- busca por código;
- ausência;
- filtros;
- ordenação;
- limite;
- nulabilidade.

`matriz-erros.md` deve incluir:

```text
código duplicado:
INTEGRIDADE.

JSON inválido:
DADOS_INVALIDOS.

Cliente inválido:
regra de domínio.

conexão:
CONEXAO.

SQL inválido:
SQL_OU_PERMISSAO.
```

`troubleshooting-projeto.md` deve cobrir:

- Ordem criada sem histórico;
- fixture restante;
- cast JSONB;
- pool fechado;
- filtro vazio;
- mapper com alias divergente;
- duplicidade;
- conexão não devolvida.

---

## Entendendo o que foi feito

### As aulas anteriores foram integradas

O projeto usa pool, transação, repository, DAO, mapper, statement seguro e tradução de erros em um único fluxo.

### A criacao ficou atomica

Ordem, histórico e leitura final compartilham uma conexão e um commit.

### As consultas ficaram tipadas

A aplicação recebe `Optional<Ordem>` ou `List<Ordem>`, nunca `ResultSet`.

### O seed ficou protegido

As fixtures usam prefixo reservado e validação final obrigatória.

### A parte 2 recebeu uma base estavel

Atualização e exclusão poderão ser adicionadas sem desmontar a arquitetura.

---

## Erros comuns importantes

### Inserir Ordem fora da transacao

O histórico pode falhar depois e deixar estado incompleto.

### Deixar o consumidor escolher status inicial

A criação precisa começar com contrato conhecido.

### Criar pool dentro do repository

O pool deve viver no ciclo da aplicação.

### Retornar entidade parcial

Use o mesmo mapper e contrato completo.

### Limpar dados sem prefixo reservado

Isso pode destruir o seed oficial.

---

## Comandos uteis

### Testes

```powershell
mvn clean test
mvn verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Validar fixtures

```sql
SELECT
    id,
    codigo,
    status,
    versao
FROM projeto_os_final.ordem_servico
WHERE codigo LIKE 'OS-JDBC-320-%';
```

### Validar historico

```sql
SELECT
    historico.*
FROM projeto_os_final.ordem_status_historico
    AS historico
JOIN projeto_os_final.ordem_servico
    AS ordem
    ON ordem.id =
       historico.ordem_servico_id
WHERE ordem.codigo LIKE 'OS-JDBC-320-%'
ORDER BY
    historico.ocorrido_em,
    historico.id;
```

---

## Exercicio guiado

### Parte 1 — Produto inativo

Em uma fixture temporária separada, utilize um Produto inativo ou um ID inexistente.

Confirme que nenhuma Ordem e nenhum histórico são criados.

Não altere o Produto oficial permanentemente.

### Parte 2 — Limite de listagem

Teste limites:

```text
0;

1;

100;

101.
```

Somente 1 a 100 são válidos.

### Parte 3 — Filtro por Cliente

Liste Ordens do Cliente `307004` antes e depois de criar uma fixture.

Confirme zero antes e uma depois.

### Parte 4 — Ordem deterministica

Crie duas Ordens com o mesmo `abertaEm`.

Confirme desempate por ID descendente.

### Parte 5 — Falha no historico

Use um `OrdemHistoricoDao` de teste que lança `SQLException` depois do insert da Ordem.

Confirme rollback.

Não adicione flag de falha ao código de produção.

### Parte 6 — Metadados

Crie metadata válida com:

```json
{
  "origem": "EXERCICIO",
  "correlationId": "CORR-320-001"
}
```

Confirme que a leitura preserva o conteúdo JSON textual.

### Parte 7 — SQL Injection

Tente construir um código com caracteres maliciosos.

Confirme que o value object rejeita.

Depois teste diretamente um parâmetro textual no DAO e confirme que o statement continua preparado.

### Parte 8 — Arquitetura

Amplie um script para impedir:

```text
domain importando java.sql;

application importando infrastructure;

DAO criando HikariDataSource;

Main contendo SQL;

Repository retornando ResultSet.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 320 existe;
- continuidade com a aula 319 foi preservada;
- projeto Maven usa Java 21;
- pgJDBC permanece fixado;
- HikariCP 7.1.0 permanece configurado;
- configuração real está fora do Git;
- domínio, aplicação e infraestrutura estão separados;
- `OrdemCodigo` foi criado;
- `OrdemStatus` foi criado;
- `OrdemPrioridade` foi criado;
- `Ordem` foi criada;
- comando de criação foi validado;
- filtro de listagem foi validado;
- repository não importa JDBC;
- casos de uso não importam JDBC;
- pool é criado uma vez;
- DataSource fecha no shutdown;
- connection provider usa DataSource;
- transaction manager foi reutilizado;
- tradutor de exceções foi reutilizado;
- classe SQLState 22 foi adicionada;
- Cliente ativo foi validado;
- Produto ativo foi validado;
- insert usa PreparedStatement;
- insert usa `RETURNING id`;
- status inicial é ABERTA;
- versão inicial é zero;
- histórico inicial foi inserido;
- Ordem e histórico compartilham conexão;
- commit ocorre depois de todas as etapas;
- rollback ocorre em falha;
- mapper único foi criado;
- busca por ID foi implementada;
- busca por código foi implementada;
- listagem foi implementada;
- filtros são parametrizados;
- ordenação é determinística;
- limite é parametrizado;
- ausência retorna Optional vazio;
- listas são imutáveis;
- ResultSet não atravessa a infraestrutura;
- código malicioso não altera SQL;
- duplicidade gera 23505;
- duplicidade é classificada como INTEGRIDADE;
- JSON inválido gera 22P02;
- JSON inválido é classificado como DADOS_INVALIDOS;
- referência inválida não cria Ordem;
- testes unitários foram criados;
- testes de integração foram criados;
- fixtures usam `OS-JDBC-320-%`;
- limpeza não atinge o seed;
- estado final possui seis Ordens;
- estado final possui doze históricos;
- nenhuma fixture permanece;
- UPDATE funcional não foi antecipado;
- DELETE funcional não foi antecipado;
- Spring não foi usado;
- JPA não foi usado;
- Hibernate não foi usado;
- ponte para a aula 321 está correta;
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
config/database.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-320-mini-projeto-jdbc-crud-os-parte-1
```

Commit recomendado:

```powershell
git commit -m "feat(m13): iniciar mini projeto jdbc crud de os"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou um mini projeto JDBC completo.

A parte 1 reuniu:

```text
HikariCP;

DataSource;

ConnectionProvider;

transaction manager;

tradução de exceções;

Repository Pattern;

DAO;

PreparedStatement;

ResultSet;

mapper;

domínio;

casos de uso;

testes;

fixtures.
```

Você implementou:

```text
criar Ordem;

criar histórico inicial;

buscar por ID;

buscar por código;

listar com filtros.
```

Também comprovou:

```text
criação atômica;

rollback em falha;

referências ativas;

duplicidade traduzida;

JSON inválido traduzido;

seed preservado.
```

A próxima aula será:

```text
321 - M13.11 - Mini projeto JDBC CRUD OS parte 2
```

Nela, o mini projeto será continuado com as operações restantes, cenários de atualização, política de exclusão, concorrência, testes e fechamento técnico do CRUD JDBC.

---

# Material complementar

## Checkpoint final

- [ ] Criei a estrutura completa do mini projeto.
- [ ] Implementei criação atômica com histórico.
- [ ] Implementei busca por ID e código.
- [ ] Implementei listagem filtrada e ordenada.
- [ ] Preservei o seed após todos os testes.

---

## Troubleshooting adicional

### Ordem existe, mas historico nao

A criação ocorreu fora da mesma transação ou houve commit intermediário.

### RETURNING nao retorna linha

Confirme o SQL e o uso de `executeQuery`.

### JSON falha no cast

Valide o conteúdo e preserve SQLState `22P02`.

### Cliente correto é rejeitado

Confirme database, schema e ID `307004`.

### Fixture permanece

Execute limpeza e validação final antes do commit.

---

## Perguntas de revisao

1. Quais partes do CRUD foram implementadas?
2. Por que criação exige transação?
3. Quem gera o ID?
4. Por que usar `RETURNING`?
5. Qual status inicial?
6. Qual versão inicial?
7. Por que validar Cliente e Produto?
8. Onde ficam as regras do comando?
9. Onde fica o SQL?
10. Onde fica o mapper?
11. O repository conhece JDBC?
12. O caso de uso conhece HikariCP?
13. Como ausência é representada?
14. Como listas são retornadas?
15. Como filtros são associados?
16. Qual ordenação foi usada?
17. O que significa SQLState 23505?
18. O que significa SQLState 22P02?
19. Como o seed é protegido?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Create e Read.
2. Para Ordem e histórico serem atômicos.
3. PostgreSQL.
4. Obter o ID da própria inserção.
5. ABERTA.
6. Zero.
7. Exigir referências válidas e ativas.
8. Na aplicação e no domínio.
9. Na infraestrutura.
10. Na infraestrutura JDBC.
11. Não.
12. Não.
13. Optional vazio.
14. Como listas imutáveis.
15. Com PreparedStatement.
16. abertura desc e ID desc.
17. Violação unique.
18. Representação de dado inválida.
19. Prefixo reservado e limpeza restrita.
20. Mini projeto JDBC CRUD OS parte 2.

---

## Desafio opcional

Crie um relatório de execução da criação:

```java
CriacaoOrdemResultado
```

Campos:

```text
Ordem criada;

duração total;

pool active no início;

pool active no fim;

histórico criado.
```

Regras:

- não alterar o contrato principal do repository;
- implementar como decorator ou serviço de observação;
- não registrar senha;
- não registrar metadata completa;
- não registrar documento de Cliente;
- testes unitários;
- nenhuma dependência de Spring.

O objetivo é adicionar observabilidade sem contaminar o código de persistência.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 320 - M13.10 - Mini projeto JDBC CRUD OS parte 1

- Iniciei o mini projeto JDBC de Ordem de Serviço.
- Reuni HikariCP, transações, exceptions, repository, DAO e mapper.
- Separei domain, application e infrastructure.
- Criei `OrdemCodigo` como value object.
- Criei enums de status e prioridade.
- Criei o modelo de leitura `Ordem`.
- Criei `CriarOrdemComando`.
- Criei `ListarOrdensFiltro`.
- Criei a porta `OrdemRepository`.
- Criei casos de uso de criação, consulta e listagem.
- Mantive JDBC fora da aplicação.
- Validei Cliente e Produto ativos.
- Usei `INSERT ... RETURNING id`.
- Fixei status inicial ABERTA.
- Fixei versão inicial zero.
- Criei histórico inicial `NULL -> ABERTA`.
- Executei criação e histórico na mesma transação.
- Reutilizei HikariCP e transaction manager.
- Reutilizei tradução de exceções.
- Adicionei classificação de dados inválidos.
- Implementei busca por ID.
- Implementei busca por código.
- Implementei listagem com filtros parametrizados.
- Mantive ordenação determinística.
- Testei duplicidade 23505.
- Testei JSON inválido 22P02.
- Testei referência inexistente.
- Usei fixtures com prefixo reservado.
- Preservei seis Ordens e doze históricos oficiais.
- Não antecipei update, delete, Spring, JPA ou Hibernate.
- Próxima aula: mini projeto JDBC CRUD OS parte 2.
```

---

## Referencia tecnica curta

```text
Create:
INSERT e histórico.

Read:
ID, código e lista.

RETURNING:
ID gerado.

Repository:
porta da aplicação.

DAO:
SQL técnico.

Mapper:
linha para Ordem.

Transaction:
atomicidade.

HikariCP:
conexões reutilizáveis.

Fixture:
dado de teste reservado.

Parte 2:
restante do CRUD.
```

Regra final:

```text
um mini projeto JDBC profissional integra dominio, casos de uso, repository, SQL parametrizado, transacoes, pool, tratamento de erros e testes sem permitir que detalhes tecnicos atravessem as fronteiras ou contaminem os dados oficiais.
```
