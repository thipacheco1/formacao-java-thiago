# 317 - M13.07 - Tratamento de excecoes em JDBC

## Apresentacao da aula

Na aula 316, você aplicou Repository Pattern sem Spring.

A aplicação passou a depender de:

```java
ClienteRepository
```

A infraestrutura JDBC passou a implementar essa porta por meio de:

```java
JdbcClienteRepository
```

O caso de uso deixou de conhecer:

- `ClienteDao`;
- `PreparedStatement`;
- `ResultSet`;
- SQL;
- driver PostgreSQL;
- detalhes de conexão.

Entretanto, uma dependência técnica permaneceu no contrato:

```java
throws SQLException
```

Isso significa que:

```text
a interface da aplicação ainda conhece java.sql;

os casos de uso ainda precisam declarar uma exceção JDBC;

o fake implementa um contrato contaminado por infraestrutura;

a fronteira arquitetural ainda não está completa.
```

Nesta aula, você corrigirá essa dívida.

O tema oficial é:

```text
Tratamento de excecoes em JDBC.
```

Você estudará a anatomia de `SQLException` e aprenderá a separar:

```text
erro técnico original;

categoria de persistência;

mensagem interna;

mensagem segura;

decisão de recuperação.
```

A classe `SQLException` possui informações importantes:

```text
mensagem;

SQLState;

código do fornecedor;

causa;

próxima SQLException encadeada.
```

Ignorar esses dados e lançar apenas:

```java
throw new RuntimeException(
        "Erro no banco"
);
```

destrói informação útil para diagnóstico.

Por outro lado, propagar `SQLException` até o domínio e até todos os casos de uso cria acoplamento com JDBC.

A solução adotada será:

```text
capturar SQLException na infraestrutura;

classificar a falha pelo SQLState;

criar uma exceção de persistência da aplicação;

preservar a SQLException como causa;

expor mensagem segura;

manter detalhes técnicos disponíveis para logs internos.
```

A nova exceção será:

```java
PersistenciaException
```

Ela será não verificada:

```java
extends RuntimeException
```

E carregará:

```text
operação;

categoria;

SQLState;

código do fornecedor;

indicação de possível repetição.
```

Categorias do laboratório:

```text
CONEXAO;

AUTENTICACAO;

DATABASE_INVALIDO;

INTEGRIDADE;

SQL_OU_PERMISSAO;

RECURSO;

OPERACAO_INTERROMPIDA;

TRANSACAO_ABORTADA;

DESCONHECIDA.
```

A classificação será feita por:

```java
JdbcExceptionTranslator
```

O tradutor viverá em:

```text
infrastructure/jdbc.
```

Ele conhece `SQLException`, SQLState e códigos técnicos.

A camada `application` conhecerá apenas:

```text
PersistenciaException;

PersistenciaFalha;

PersistenciaCategoria.
```

O contrato `ClienteRepository` deixará de declarar `SQLException`.

Os casos de uso também deixarão de importar `java.sql`.

O fake de testes permanecerá completamente independente de JDBC.

O laboratório demonstrará falhas reais e controladas:

```text
senha incorreta;

database inexistente;

SQL com coluna inexistente.
```

A classificação de violação de integridade será testada com uma `SQLException` construída para o SQLState:

```text
23505.
```

Isso evita modificar `projeto_os_final` e evita antecipar transações.

Como exercício opcional, você poderá usar uma tabela temporária para observar uma violação real sem alterar o schema persistente.

A aula também mostrará por que:

```text
retryable não significa repetir automaticamente.
```

Uma falha de conexão pode ser transitória, mas uma repetição sem política pode:

- aumentar carga;
- duplicar operações;
- esconder indisponibilidade;
- criar tempestade de requisições;
- piorar o incidente.

Nenhum mecanismo de retry será implementado.

Transações JDBC, `commit` e `rollback` pertencem à próxima aula:

```text
318 - M13.08 - Transacoes com JDBC commit rollback
```

Nesta aula, não haverá:

- `setAutoCommit(false)`;
- `commit`;
- `rollback`;
- pool de conexões;
- CRUD completo;
- JPA;
- Hibernate;
- Spring;
- framework de logs;
- retry automático.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection e DataSource conceitual.

313:
PreparedStatement e SQL Injection.

314:
ResultSet, mapeamento manual e tipos.

315:
DAO inicial com responsabilidade clara.

316:
Repository Pattern sem Spring.

317:
tratamento de exceções em JDBC.

318:
transações com JDBC, commit e rollback.

319:
connection pool e HikariCP conceitual.

320 e 321:
mini projeto JDBC CRUD de Ordem de Serviço.
```

A evolução desta aula é:

```text
antes:
application -> SQLException.

depois:
application -> PersistenciaException.

infraestrutura:
SQLException -> tradução -> PersistenciaException.
```

A pergunta principal é:

```text
como preservar informação técnica sem deixar JDBC atravessar a fronteira da aplicação?
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-317-tratamento-excecoes-jdbc
```

Estrutura final:

```text
labs
└── m13
    └── aula-317-tratamento-excecoes-jdbc
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── catalogo-sqlstate.md
        │   ├── contrato-erros-persistencia.md
        │   ├── politica-mensagens-logs.md
        │   └── troubleshooting-excecoes.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_aplicacao.ps1
        │   ├── 03_testar_falhas_controladas.ps1
        │   └── 04_validar_fronteiras.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula317
            │                           ├── Main.java
            │                           ├── application
            │                           │   ├── ClienteRepository.java
            │                           │   ├── ConsultaClienteResultado.java
            │                           │   ├── ConsultarClienteParaAtendimento.java
            │                           │   ├── ListarClientesAtivos.java
            │                           │   ├── PersistenciaCategoria.java
            │                           │   ├── PersistenciaException.java
            │                           │   └── PersistenciaFalha.java
            │                           ├── domain
            │                           │   ├── Cliente.java
            │                           │   └── ClienteCodigo.java
            │                           └── infrastructure
            │                               └── jdbc
            │                                   ├── ClienteDao.java
            │                                   ├── ClienteMapper.java
            │                                   ├── ConnectionProvider.java
            │                                   ├── DatabaseSettings.java
            │                                   ├── DriverManagerConnectionProvider.java
            │                                   ├── JdbcClienteRepository.java
            │                                   ├── JdbcErrorDetail.java
            │                                   ├── JdbcExceptionChain.java
            │                                   └── JdbcExceptionTranslator.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula317
                                        ├── application
                                        │   ├── ConsultarClienteParaAtendimentoTest.java
                                        │   └── FakeClienteRepository.java
                                        └── infrastructure
                                            └── jdbc
                                                ├── JdbcClienteRepositoryIT.java
                                                ├── JdbcExceptionTranslatorIT.java
                                                └── JdbcExceptionTranslatorTest.java
```

Resultados esperados:

```text
execução normal:
Cliente disponível.

senha incorreta:
categoria AUTENTICACAO;
SQLState 28P01;
mensagem segura;
causa preservada.

database inexistente:
categoria DATABASE_INVALIDO;
SQLState 3D000.

SQL com coluna inexistente:
categoria SQL_OU_PERMISSAO;
SQLState 42703.

violação unique simulada:
categoria INTEGRIDADE;
SQLState 23505.

ClienteRepository:
sem import de java.sql.

casos de uso:
sem throws SQLException.
```

---

## Conceito essencial

### SQLException

`SQLException` é a exceção base da API JDBC.

Ela pode surgir ao:

- abrir conexão;
- autenticar;
- preparar SQL;
- associar parâmetro;
- executar instrução;
- percorrer resultado;
- converter tipo;
- fechar recurso;
- confirmar transação;
- desfazer transação.

Ela é checked exception.

Por isso, o compilador exige:

```text
capturar;

ou declarar throws.
```

Essa característica torna a falha visível, mas também pode espalhar detalhes JDBC por camadas que não deveriam conhecê-los.

---

### Mensagem

O método:

```java
exception.getMessage()
```

pode conter informação útil.

Entretanto, uma mensagem do banco pode incluir:

- nome de tabela;
- nome de constraint;
- valor rejeitado;
- SQL;
- detalhe interno;
- host;
- database;
- usuário.

Ela não deve ser exibida diretamente ao usuário final.

No laboratório, mensagens técnicas ficam preservadas na causa, mas o `Main` exibirá uma mensagem segura derivada da categoria.

---

### SQLState

SQLState é um código de cinco caracteres.

Os dois primeiros representam a classe da falha.

Exemplos:

```text
08:
falha de conexão.

23:
violação de integridade.

28:
autenticação ou autorização.

3D:
database inválido.

40:
transação abortada.

42:
sintaxe, objeto inexistente ou permissão.

53:
recursos insuficientes.

57:
intervenção ou interrupção operacional.
```

Exemplos PostgreSQL:

```text
28P01:
senha inválida.

3D000:
database inexistente.

23505:
violação de unique.

23503:
violação de foreign key.

23502:
not null violado.

42703:
coluna inexistente.

42P01:
relação inexistente.

40001:
falha de serialização.

40P01:
deadlock.
```

A aula 318 usará códigos da classe `40` no contexto de transações.

---

### Codigo do fornecedor

O método:

```java
exception.getErrorCode()
```

fornece um código específico do fornecedor.

No PostgreSQL, SQLState normalmente é mais útil para classificação.

O código do fornecedor ainda será preservado como diagnóstico.

Não escreva regras dependentes apenas da mensagem textual.

---

### Causa

A tradução deve preservar:

```java
exception
```

como causa:

```java
new PersistenciaException(
        falha,
        mensagemSegura,
        exception
);
```

Isso permite:

```java
persistenciaException.getCause()
```

e mantém a stack trace original.

Errado:

```java
throw new PersistenciaException(
        "Falhou"
);
```

A causa desapareceria.

---

### Excecoes encadeadas

`SQLException` possui:

```java
getNextException()
```

Um driver pode fornecer várias falhas relacionadas.

A cadeia de `cause` e a cadeia de `nextException` não são exatamente a mesma coisa.

O laboratório criará:

```java
JdbcExceptionChain
```

para percorrer `getNextException()` e produzir detalhes sanitizados.

A classificação utilizará a primeira exceção da cadeia que contenha SQLState reconhecível.

---

### Traducao de excecao

Traduzir não significa esconder.

Significa converter de uma linguagem técnica para uma abstração adequada à fronteira.

Entrada:

```text
SQLException.
```

Saída:

```text
PersistenciaException.
```

A exceção traduzida preserva:

- categoria;
- operação;
- SQLState;
- código;
- possibilidade de repetição;
- causa original.

A interface da aplicação não precisa importar JDBC.

---

### Excecao checked ou unchecked

`PersistenciaException` será unchecked.

Motivos:

- a maioria dos casos de uso não consegue corrigir localmente senha, conexão ou SQL;
- a falha deve subir até uma fronteira apropriada;
- o contrato não fica poluído por tecnologia;
- tratamento central futuro fica possível.

Unchecked não significa ignorada.

Ela precisa ser:

- registrada;
- classificada;
- convertida em resposta adequada;
- monitorada;
- preservada.

---

### Categoria e recuperacao

Categoria não é mensagem.

Ela orienta comportamento.

Exemplos:

```text
AUTENTICACAO:
revisar configuração;
não repetir automaticamente.

INTEGRIDADE:
corrigir dados ou regra;
não repetir igual.

CONEXAO:
pode ser transitória;
avaliar política.

SQL_OU_PERMISSAO:
erro de código ou grant;
corrigir implantação.

TRANSACAO_ABORTADA:
alguns casos podem permitir nova tentativa;
depende da operação.
```

A propriedade `potencialmenteRepetivel` será apenas um indício.

Nenhum retry será executado.

---

### Mensagem segura

A mensagem segura não deve revelar:

- SQL;
- senha;
- host;
- constraint;
- valor rejeitado;
- stack trace.

Exemplos:

```text
CONEXAO:
Serviço de dados temporariamente indisponível.

AUTENTICACAO:
Configuração de acesso ao banco inválida.

INTEGRIDADE:
A operação viola uma regra de integridade.

SQL_OU_PERMISSAO:
Não foi possível executar a operação de dados.
```

A mensagem técnica completa permanece na causa para diagnóstico controlado.

---

### Fronteira de captura

O lugar correto para capturar `SQLException` é o adaptador JDBC.

Exemplo:

```java
try {
    return clienteDao.findByCode(
            codigo.valor()
    );
} catch (SQLException exception) {
    throw translator.translate(
            "buscar Cliente por código",
            exception
    );
}
```

O DAO continua técnico e pode declarar `SQLException`.

O repository JDBC traduz antes de devolver o controle à aplicação.

---

### Nao capturar cedo demais

O mapper não deve fazer:

```java
catch (SQLException exception) {
    return null;
}
```

Isso esconderia falha de coluna ou tipo.

O DAO não deve transformar tudo em lista vazia.

Falha e ausência são conceitos diferentes.

```text
Optional.empty:
consulta executada e não encontrou Cliente.

PersistenciaException:
consulta não foi concluída corretamente.
```

---

### Nao capturar Exception generica

Evite:

```java
catch (Exception exception)
```

no tradutor JDBC.

O adaptador deve capturar:

```java
SQLException
```

Outros erros de programação devem manter seu significado.

O `Main`, como fronteira do laboratório, pode tratar `RuntimeException` para terminar o processo, mas não deve reclassificar tudo como falha de banco.

---

### Logs tecnicos

Um log técnico pode conter:

```text
operação;

categoria;

SQLState;

código do fornecedor;

tipo da causa;

quantidade de exceções encadeadas;

correlation ID futuro.
```

Não inclua por padrão:

- senha;
- parâmetros;
- documentos;
- emails;
- SQL completo;
- detalhes sensíveis.

O laboratório imprimirá somente um resumo técnico sanitizado.

---

### Integridade e regra de negocio

SQLState `23` indica que o banco protegeu uma restrição.

Exemplos:

- unique;
- foreign key;
- not null;
- check.

A tradução para `INTEGRIDADE` não define automaticamente a mensagem de negócio.

Uma camada futura poderá distinguir:

```text
código duplicado;

Cliente inexistente;

valor inválido.
```

Isso exige conhecer a constraint de forma controlada.

Nesta aula, a categoria será genérica.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\src\main\java\br\com\formacao\m13\aula317\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\src\main\java\br\com\formacao\m13\aula317\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\src\main\java\br\com\formacao\m13\aula317\infrastructure\jdbc"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\src\test\java\br\com\formacao\m13\aula317\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-317-tratamento-excecoes-jdbc\src\test\java\br\com\formacao\m13\aula317\infrastructure\jdbc"

Set-Location `
  "labs\m13\aula-317-tratamento-excecoes-jdbc"
```

---

### 2. Criar .gitignore, pom e configuracao

Reutilize da aula 316:

```text
.gitignore;

pom.xml;

config/database.local.env.example.
```

Ajuste:

```text
artifactId:
aula-317-tratamento-excecoes.

name:
Aula 317 - Tratamento de excecoes em JDBC.

JDBC_APPLICATION_NAME:
aula-317-excecoes.
```

Copie o `.example` para `database.local.env`.

O arquivo real permanece ignorado.

---

### 3. Reutilizar dominio e JDBC basico

Copie da aula 316:

```text
domain/Cliente.java;

domain/ClienteCodigo.java;

infrastructure/jdbc/DatabaseSettings.java;

infrastructure/jdbc/ConnectionProvider.java;

infrastructure/jdbc/DriverManagerConnectionProvider.java;

infrastructure/jdbc/ClienteMapper.java;

infrastructure/jdbc/ClienteDao.java.
```

Ajuste packages para:

```text
br.com.formacao.m13.aula317.
```

`ClienteDao` continua declarando `throws SQLException`.

---

### 4. Criar PersistenciaCategoria.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/application/PersistenciaCategoria.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.application;

public enum PersistenciaCategoria {
    CONEXAO,
    AUTENTICACAO,
    DATABASE_INVALIDO,
    INTEGRIDADE,
    SQL_OU_PERMISSAO,
    RECURSO,
    OPERACAO_INTERROMPIDA,
    TRANSACAO_ABORTADA,
    DESCONHECIDA
}
```

O enum não importa JDBC.

---

### 5. Criar PersistenciaFalha.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/application/PersistenciaFalha.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.application;

public record PersistenciaFalha(
        String operacao,
        PersistenciaCategoria categoria,
        String sqlState,
        int codigoFornecedor,
        boolean potencialmenteRepetivel
) {

    public PersistenciaFalha {
        if (
            operacao == null
            || operacao.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "operacao é obrigatória"
            );
        }

        if (categoria == null) {
            throw new IllegalArgumentException(
                    "categoria é obrigatória"
            );
        }

        sqlState = normalizeState(sqlState);
    }

    private static String normalizeState(
            String sqlState
    ) {
        if (
            sqlState == null
            || sqlState.isBlank()
        ) {
            return "SEM_SQLSTATE";
        }

        return sqlState.trim();
    }
}
```

A ausência de SQLState fica explícita.

---

### 6. Criar PersistenciaException.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/application/PersistenciaException.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.application;

public final class PersistenciaException
        extends RuntimeException {

    private final PersistenciaFalha falha;

    public PersistenciaException(
            PersistenciaFalha falha,
            String mensagemSegura,
            Throwable cause
    ) {
        super(
                requireMessage(mensagemSegura),
                cause
        );

        if (falha == null) {
            throw new IllegalArgumentException(
                    "falha é obrigatória"
            );
        }

        if (cause == null) {
            throw new IllegalArgumentException(
                    "cause é obrigatória"
            );
        }

        this.falha = falha;
    }

    public PersistenciaFalha falha() {
        return falha;
    }

    private static String requireMessage(
            String message
    ) {
        if (
            message == null
            || message.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "mensagemSegura é obrigatória"
            );
        }

        return message;
    }
}
```

`getMessage()` retorna mensagem segura.

A mensagem JDBC permanece na causa.

---

### 7. Criar JdbcErrorDetail.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/infrastructure/jdbc/JdbcErrorDetail.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.infrastructure.jdbc;

record JdbcErrorDetail(
        int position,
        String sqlState,
        int vendorCode,
        String exceptionType
) {
}
```

O record não armazena mensagem bruta.

---

### 8. Criar JdbcExceptionChain.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/infrastructure/jdbc/JdbcExceptionChain.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.infrastructure.jdbc;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

final class JdbcExceptionChain {

    private JdbcExceptionChain() {
    }

    static List<JdbcErrorDetail> inspect(
            SQLException root
    ) {
        List<JdbcErrorDetail> details =
                new ArrayList<>();

        SQLException current = root;
        int position = 1;

        while (current != null) {
            details.add(
                    new JdbcErrorDetail(
                            position,
                            current.getSQLState(),
                            current.getErrorCode(),
                            current.getClass()
                                    .getName()
                    )
            );

            current =
                    current.getNextException();
            position++;
        }

        return List.copyOf(details);
    }
}
```

A cadeia é finita conforme fornecida pelo driver.

---

### 9. Criar JdbcExceptionTranslator.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/infrastructure/jdbc/JdbcExceptionTranslator.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.infrastructure.jdbc;

import java.sql.SQLException;
import java.util.List;

import br.com.formacao.m13.aula317.application.PersistenciaCategoria;
import br.com.formacao.m13.aula317.application.PersistenciaException;
import br.com.formacao.m13.aula317.application.PersistenciaFalha;

public final class JdbcExceptionTranslator {

    public PersistenciaException translate(
            String operacao,
            SQLException exception
    ) {
        if (
            operacao == null
            || operacao.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "operacao é obrigatória"
            );
        }

        if (exception == null) {
            throw new IllegalArgumentException(
                    "exception é obrigatória"
            );
        }

        List<JdbcErrorDetail> chain =
                JdbcExceptionChain.inspect(
                        exception
                );

        JdbcErrorDetail selected =
                chain.stream()
                        .filter(detail ->
                                detail.sqlState()
                                        != null
                        )
                        .findFirst()
                        .orElse(
                                chain.getFirst()
                        );

        PersistenciaCategoria category =
                classify(
                        selected.sqlState()
                );

        PersistenciaFalha failure =
                new PersistenciaFalha(
                        operacao.trim(),
                        category,
                        selected.sqlState(),
                        selected.vendorCode(),
                        potentiallyRetryable(
                                category
                        )
                );

        return new PersistenciaException(
                failure,
                safeMessage(category),
                exception
        );
    }

    static PersistenciaCategoria classify(
            String sqlState
    ) {
        if (
            sqlState == null
            || sqlState.length() < 2
        ) {
            return PersistenciaCategoria
                    .DESCONHECIDA;
        }

        String stateClass =
                sqlState.substring(0, 2);

        return switch (stateClass) {
            case "08" ->
                    PersistenciaCategoria.CONEXAO;
            case "23" ->
                    PersistenciaCategoria.INTEGRIDADE;
            case "28" ->
                    PersistenciaCategoria.AUTENTICACAO;
            case "3D" ->
                    PersistenciaCategoria
                            .DATABASE_INVALIDO;
            case "40" ->
                    PersistenciaCategoria
                            .TRANSACAO_ABORTADA;
            case "42" ->
                    PersistenciaCategoria
                            .SQL_OU_PERMISSAO;
            case "53" ->
                    PersistenciaCategoria.RECURSO;
            case "57" ->
                    PersistenciaCategoria
                            .OPERACAO_INTERROMPIDA;
            default ->
                    PersistenciaCategoria
                            .DESCONHECIDA;
        };
    }

    private static boolean potentiallyRetryable(
            PersistenciaCategoria category
    ) {
        return switch (category) {
            case CONEXAO,
                 RECURSO,
                 OPERACAO_INTERROMPIDA,
                 TRANSACAO_ABORTADA -> true;
            default -> false;
        };
    }

    private static String safeMessage(
            PersistenciaCategoria category
    ) {
        return switch (category) {
            case CONEXAO ->
                    "Serviço de dados "
                            + "temporariamente indisponível.";
            case AUTENTICACAO ->
                    "Configuração de acesso "
                            + "ao banco inválida.";
            case DATABASE_INVALIDO ->
                    "Configuração do database inválida.";
            case INTEGRIDADE ->
                    "A operação viola uma "
                            + "regra de integridade.";
            case SQL_OU_PERMISSAO ->
                    "Não foi possível executar "
                            + "a operação de dados.";
            case RECURSO ->
                    "Banco de dados temporariamente "
                            + "sem recursos.";
            case OPERACAO_INTERROMPIDA ->
                    "Operação de dados interrompida.";
            case TRANSACAO_ABORTADA ->
                    "A operação de dados sofreu "
                            + "um conflito temporário.";
            case DESCONHECIDA ->
                    "Falha inesperada ao acessar dados.";
        };
    }
}
```

A categoria `TRANSACAO_ABORTADA` será aprofundada na aula 318.

---

### 10. Evoluir ClienteRepository.java

Remova:

```java
import java.sql.SQLException;
```

Remova `throws SQLException`.

Contrato:

```java
package br.com.formacao.m13.aula317.application;

import java.util.List;
import java.util.Optional;

import br.com.formacao.m13.aula317.domain.Cliente;
import br.com.formacao.m13.aula317.domain.ClienteCodigo;

public interface ClienteRepository {

    Optional<Cliente> buscarPorCodigo(
            ClienteCodigo codigo
    );

    List<Cliente> listarAtivos(
            int limite
    );
}
```

A porta não depende mais de JDBC.

---

### 11. Evoluir JdbcClienteRepository.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/infrastructure/jdbc/JdbcClienteRepository.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317.infrastructure.jdbc;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import br.com.formacao.m13.aula317.application.ClienteRepository;
import br.com.formacao.m13.aula317.domain.Cliente;
import br.com.formacao.m13.aula317.domain.ClienteCodigo;

public final class JdbcClienteRepository
        implements ClienteRepository {

    private final ClienteDao clienteDao;
    private final JdbcExceptionTranslator translator;

    public JdbcClienteRepository(
            ClienteDao clienteDao,
            JdbcExceptionTranslator translator
    ) {
        this.clienteDao =
                Objects.requireNonNull(
                        clienteDao,
                        "clienteDao é obrigatório"
                );

        this.translator =
                Objects.requireNonNull(
                        translator,
                        "translator é obrigatório"
                );
    }

    @Override
    public Optional<Cliente> buscarPorCodigo(
            ClienteCodigo codigo
    ) {
        Objects.requireNonNull(
                codigo,
                "codigo é obrigatório"
        );

        try {
            return clienteDao.findByCode(
                    codigo.valor()
            );
        } catch (SQLException exception) {
            throw translator.translate(
                    "buscar Cliente por código",
                    exception
            );
        }
    }

    @Override
    public List<Cliente> listarAtivos(
            int limite
    ) {
        if (limite < 1 || limite > 100) {
            throw new IllegalArgumentException(
                    "limite deve estar "
                            + "entre 1 e 100"
            );
        }

        try {
            return clienteDao.findAllActive(
                    limite
            );
        } catch (SQLException exception) {
            throw translator.translate(
                    "listar Clientes ativos",
                    exception
            );
        }
    }
}
```

A captura ocorre exatamente na fronteira JDBC.

---

### 12. Evoluir os casos de uso

Remova de:

```text
ConsultarClienteParaAtendimento;

ListarClientesAtivos.
```

Todos os imports:

```java
java.sql.SQLException
```

E remova `throws SQLException`.

O comportamento funcional permanece igual.

O fake da aula 316 também deve implementar a interface sem checked exception.

---

### 13. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula317/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula317;

import br.com.formacao.m13.aula317.application.ClienteRepository;
import br.com.formacao.m13.aula317.application.ConsultarClienteParaAtendimento;
import br.com.formacao.m13.aula317.application.PersistenciaException;
import br.com.formacao.m13.aula317.domain.ClienteCodigo;
import br.com.formacao.m13.aula317.infrastructure.jdbc.ClienteDao;
import br.com.formacao.m13.aula317.infrastructure.jdbc.ConnectionProvider;
import br.com.formacao.m13.aula317.infrastructure.jdbc.DatabaseSettings;
import br.com.formacao.m13.aula317.infrastructure.jdbc.DriverManagerConnectionProvider;
import br.com.formacao.m13.aula317.infrastructure.jdbc.JdbcClienteRepository;
import br.com.formacao.m13.aula317.infrastructure.jdbc.JdbcExceptionTranslator;

public final class Main {

    private Main() {
    }

    public static void main(String[] args) {
        try {
            DatabaseSettings settings =
                    DatabaseSettings.fromEnvironment();

            ConnectionProvider provider =
                    new DriverManagerConnectionProvider(
                            settings
                    );

            ClienteRepository repository =
                    new JdbcClienteRepository(
                            new ClienteDao(provider),
                            new JdbcExceptionTranslator()
                    );

            ConsultarClienteParaAtendimento useCase =
                    new ConsultarClienteParaAtendimento(
                            repository
                    );

            var result =
                    useCase.executar(
                            new ClienteCodigo(
                                    "CLI-POF-ALFA"
                            )
                    );

            System.out.println(
                    "=== Consulta concluída ==="
            );
            System.out.printf(
                    "situação: %s%n",
                    result.situacao()
            );
            result.cliente().ifPresent(cliente ->
                    System.out.printf(
                            "Cliente: %s%n",
                            cliente.nome()
                    )
            );
        } catch (PersistenciaException exception) {
            System.err.println(
                    "Falha segura: "
                            + exception.getMessage()
            );
            System.err.println(
                    "Operação: "
                            + exception.falha()
                                    .operacao()
            );
            System.err.println(
                    "Categoria: "
                            + exception.falha()
                                    .categoria()
            );
            System.err.println(
                    "SQLState: "
                            + exception.falha()
                                    .sqlState()
            );
            System.err.println(
                    "Código: "
                            + exception.falha()
                                    .codigoFornecedor()
            );
            System.err.println(
                    "Potencialmente repetível: "
                            + exception.falha()
                                    .potencialmenteRepetivel()
            );
            System.err.println(
                    "Causa preservada: "
                            + exception.getCause()
                                    .getClass()
                                    .getSimpleName()
            );
            System.exit(3);
        } catch (RuntimeException exception) {
            System.err.println(
                    "Falha de contrato: "
                            + exception.getMessage()
            );
            System.exit(1);
        }
    }
}
```

A mensagem bruta do PostgreSQL não é exibida.

---

### 14. Criar JdbcExceptionTranslatorTest.java

Crie testes unitários para:

```text
08001 -> CONEXAO;

28P01 -> AUTENTICACAO;

3D000 -> DATABASE_INVALIDO;

23505 -> INTEGRIDADE;

42703 -> SQL_OU_PERMISSAO;

53300 -> RECURSO;

57014 -> OPERACAO_INTERROMPIDA;

40001 -> TRANSACAO_ABORTADA;

estado nulo -> DESCONHECIDA.
```

Exemplo:

```java
@Test
void shouldTranslateUniqueViolation() {
    SQLException source =
            new SQLException(
                    "duplicate key",
                    "23505",
                    0
            );

    PersistenciaException translated =
            translator.translate(
                    "salvar Cliente",
                    source
            );

    assertEquals(
            PersistenciaCategoria.INTEGRIDADE,
            translated.falha().categoria()
    );
    assertEquals(
            "23505",
            translated.falha().sqlState()
    );
    assertSame(
            source,
            translated.getCause()
    );
    assertFalse(
            translated.falha()
                    .potencialmenteRepetivel()
    );
}
```

Também teste que `getMessage()` não contém:

```text
duplicate key.
```

---

### 15. Testar cadeia de SQLException

Crie um teste:

```java
SQLException root =
        new SQLException(
                "root sem estado",
                null,
                10
        );

SQLException next =
        new SQLException(
                "senha inválida",
                "28P01",
                20
        );

root.setNextException(next);
```

O tradutor deve selecionar:

```text
28P01;

AUTENTICACAO.
```

`JdbcExceptionChain.inspect(root)` deve retornar duas posições.

A causa preservada continua sendo `root`.

---

### 16. Atualizar testes de aplicacao

`ConsultarClienteParaAtendimentoTest` não deve mais declarar:

```java
throws Exception
```

quando o teste não precisa.

O fake não importa `java.sql`.

Valide novamente:

- disponível;
- inativo;
- ausente.

Isso comprova que a regra pode ser testada sem checked exception JDBC.

---

### 17. Criar JdbcClienteRepositoryIT.java

Mantenha os testes de sucesso da aula 316:

- busca Alfa;
- email nulo da Gama;
- código inexistente;
- quatro ativos.

Adicione:

```java
assertDoesNotThrow
```

para o fluxo normal.

A integração real comprova que o tradutor não interfere no caminho de sucesso.

---

### 18. Criar JdbcExceptionTranslatorIT.java

Crie um teste de integração para SQL inválido.

Abra conexão pelo provider e execute:

```sql
SELECT
    coluna_inexistente_317
FROM projeto_os_final.cliente
```

Capture `SQLException`, traduza e valide:

```text
SQLState:
42703.

categoria:
SQL_OU_PERMISSAO.

causa:
mesma SQLException.
```

Não altere o schema.

Não execute DML.

---

### 19. Criar scripts de execucao

`01_verificar_pre_requisitos.ps1` deve validar:

- Java;
- Maven;
- container;
- porta;
- database;
- tabela Cliente;
- quatro registros.

`02_executar_aplicacao.ps1` deve carregar variáveis e executar:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

Sempre remova as variáveis no `finally`.

---

### 20. Criar 03_testar_falhas_controladas.ps1

O script deve carregar a configuração correta em memória, sem alterar o arquivo.

Cenário 1:

```text
JDBC_PASSWORD:
senha_incorreta_317.
```

Execute:

```powershell
$output = & mvn -q exec:java 2>&1
```

Valide:

```text
exit code:
3.

Categoria:
AUTENTICACAO.

SQLState:
28P01.

saída não contém a senha.
```

Cenário 2:

Troque somente o database da URL para:

```text
database_inexistente_317.
```

Valide:

```text
categoria DATABASE_INVALIDO;

SQLState 3D000.
```

Cenário 3:

Restaure tudo e execute com sucesso.

No `finally`, limpe as variáveis.

---

### 21. Criar 04_validar_fronteiras.ps1

Valide:

```text
domain:
sem java.sql.

application:
sem java.sql;
sem SQLException;
sem ClienteDao;
sem PreparedStatement;
sem ResultSet.

infrastructure:
pode conhecer java.sql.

ClienteRepository:
sem throws SQLException.

PersistenciaException:
cause obrigatória.

JdbcClienteRepository:
usa translator.
```

Também falhe se encontrar:

```text
catch (Exception;

throw new RuntimeException("Erro no banco");

System.err.println(exception.getCause().getMessage()).
```

A busca textual é apoio didático, não análise completa.

---

### 22. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_aplicacao.ps1
.\scripts\03_testar_falhas_controladas.ps1
.\scripts\04_validar_fronteiras.ps1
```

Confirme:

```text
caminho normal funciona;

application não importa JDBC;

senha inválida vira AUTENTICACAO;

database inválido vira DATABASE_INVALIDO;

SQL inválido vira SQL_OU_PERMISSAO;

integridade 23505 é classificada em teste;

causa é preservada;

mensagem segura não vaza detalhe.
```

---

### 23. Criar catalogo-sqlstate.md

Em:

```text
docs/catalogo-sqlstate.md
```

crie:

```text
Classe | Exemplo | Categoria | Repetível | Ação
```

Inclua:

```text
08;

23;

28;

3D;

40;

42;

53;

57;

desconhecida.
```

Registre que:

```text
repetível é indicação, não ordem de retry.
```

---

### 24. Criar contrato-erros-persistencia.md

Documente:

```text
PersistenciaException;

PersistenciaFalha;

PersistenciaCategoria;

JdbcExceptionTranslator.
```

Para cada campo da falha, descreva:

- origem;
- uso;
- exposição permitida;
- nulabilidade;
- exemplo.

Registre a fronteira:

```text
DAO lança SQLException;

adapter traduz;

repository não declara JDBC;

caso de uso recebe RuntimeException de persistência.
```

---

### 25. Criar politica-mensagens-logs.md

Separe:

```text
mensagem para usuário;

log técnico;

dado proibido.
```

Mensagem de usuário:

- curta;
- segura;
- sem SQL;
- sem parâmetro;
- sem stack trace.

Log técnico:

- operação;
- categoria;
- SQLState;
- vendor code;
- tipo da causa;
- identificador de correlação futuro.

Proibido:

- senha;
- token;
- documento;
- email;
- SQL com valores;
- connection string com segredo.

---

### 26. Criar troubleshooting-excecoes.md

Inclua:

#### SQLState nulo

Classifique como `DESCONHECIDA`.

Preserve a causa.

#### Categoria incorreta

Revise os dois primeiros caracteres e a exceção selecionada na cadeia.

#### Causa perdida

Confirme o terceiro argumento do construtor da exceção.

#### Mensagem sensivel no console

Não imprima `SQLException.getMessage()` na saída do usuário.

#### Caso de uso ainda declara SQLException

Remova import e `throws`.

A captura deve ocorrer no adapter.

#### Tudo vira DESCONHECIDA

Verifique `getNextException()` e se o driver fornece SQLState.

---

## Entendendo o que foi feito

### JDBC ficou restrito a infraestrutura

A porta e os casos de uso não importam `java.sql`.

---

### Informacao tecnica foi preservada

SQLState, código e causa continuam disponíveis na exceção traduzida.

---

### Mensagem segura foi separada

O console não expõe a mensagem bruta do PostgreSQL.

---

### Ausencia continua diferente de falha

`Optional.empty()` significa consulta concluída sem Cliente.

`PersistenciaException` significa operação não concluída.

---

### Testes ficaram mais precisos

A classificação foi testada sem banco e o adapter foi validado com falhas reais controladas.

---

## Erros comuns importantes

### Engolir SQLException

Retornar vazio após falha transforma indisponibilidade em ausência falsa.

### Perder a causa

Crie a nova exceção com a original como `cause`.

### Classificar pela mensagem

Mensagens mudam e podem ser localizadas.

Use SQLState.

### Mostrar detalhe tecnico ao usuario

SQL, constraint e valores devem permanecer em log protegido.

### Repetir automaticamente qualquer falha

Integridade e autenticação não se resolvem por repetição idêntica.

---

## Comandos uteis

### Testes unitarios

```powershell
mvn clean test
```

### Testes de integracao

```powershell
mvn verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Falhas controladas

```powershell
.\scripts\03_testar_falhas_controladas.ps1
```

---

## Exercicio guiado

### Parte 1 — Foreign key

Crie uma `SQLException` de teste:

```text
SQLState:
23503.
```

Confirme categoria `INTEGRIDADE`.

Registre que a mensagem de negócio dependeria da operação e da constraint.

---

### Parte 2 — Estado sem categoria conhecida

Teste:

```text
SQLState:
ZZ999.
```

Esperado:

```text
DESCONHECIDA;

potencialmenteRepetivel false;

causa preservada.
```

---

### Parte 3 — Cadeia com estado na segunda excecao

Construa root sem estado e next com `08001`.

Confirme:

```text
CONEXAO;

causa root;

dois detalhes na cadeia.
```

---

### Parte 4 — Tabela temporaria opcional

Em teste de integração, abra conexão e execute:

```sql
CREATE TEMP TABLE tmp_unique_317 (
    codigo text PRIMARY KEY
)
```

Depois insira o mesmo código duas vezes.

Capture e traduza a segunda falha.

Regras:

- tabela temporária;
- não usar `projeto_os_final`;
- não ensinar CRUD;
- não controlar transação manual;
- conexão fechada ao final.

Esperado:

```text
23505;

INTEGRIDADE.
```

---

### Parte 5 — Mensagem segura

Para cada categoria, crie um teste garantindo que a mensagem:

- não contém SQLState;
- não contém senha;
- não contém SQL;
- não contém nome de tabela;
- não é vazia.

---

### Parte 6 — Remover java.sql da aplicacao

Execute busca recursiva no pacote `application`.

O resultado para:

```text
java.sql
```

deve ser vazio.

Adicione essa verificação ao script.

---

### Parte 7 — Classificador de retry

Crie testes para a flag.

Classifique como potencialmente repetível:

```text
08;

40;

53;

57.
```

Não repetível:

```text
23;

28;

3D;

42;

desconhecida.
```

Escreva por que a flag não inicia retry.

---

### Parte 8 — Operacao obrigatoria

Tente traduzir com operação vazia.

O tradutor deve lançar `IllegalArgumentException`.

A mensagem precisa apontar o contrato inválido, não uma falha de persistência.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade oficial;
- o laboratório oficial da aula 317 existe;
- a continuidade com a aula 316 foi preservada;
- projeto Maven usa Java 21;
- driver PostgreSQL permanece fixado;
- configuração real está fora do Git;
- domínio não importa JDBC;
- aplicação não importa JDBC;
- `ClienteRepository` não declara `SQLException`;
- casos de uso não declaram `SQLException`;
- fake não importa `java.sql`;
- `PersistenciaCategoria` foi criada;
- `PersistenciaFalha` foi criada;
- `PersistenciaException` é unchecked;
- causa é obrigatória;
- causa original foi preservada;
- mensagem segura foi separada;
- operação foi registrada;
- SQLState foi registrado;
- código do fornecedor foi registrado;
- flag de repetição foi registrada;
- `JdbcErrorDetail` foi criado;
- cadeia de SQLExceptions foi inspecionada;
- `JdbcExceptionTranslator` foi criado;
- classe 08 foi classificada;
- classe 23 foi classificada;
- classe 28 foi classificada;
- classe 3D foi classificada;
- classe 40 foi classificada;
- classe 42 foi classificada;
- classe 53 foi classificada;
- classe 57 foi classificada;
- estado nulo virou `DESCONHECIDA`;
- `JdbcClienteRepository` captura somente `SQLException`;
- adapter traduz antes de retornar à aplicação;
- DAO continua técnico;
- ausência não foi confundida com falha;
- senha inválida gerou `28P01`;
- database inválido gerou `3D000`;
- SQL inválido gerou `42703`;
- unique `23505` foi classificado em teste;
- mensagem bruta não foi exibida ao usuário;
- senha não apareceu na saída;
- testes unitários de tradução foram criados;
- teste de cadeia foi criado;
- testes de aplicação continuam sem banco;
- teste de integração de sucesso continua funcionando;
- teste de integração de SQL inválido foi criado;
- scripts de falha controlada foram criados;
- fronteiras foram validadas;
- nenhuma transação manual foi criada;
- nenhum retry automático foi criado;
- nenhum pool foi criado;
- nenhum Spring foi usado;
- schema `projeto_os_final` permaneceu intacto;
- commit recomendado pode ser realizado;
- diário de bordo está pronto;
- ponte para a aula 318 está correta.

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
  labs/m13/aula-317-tratamento-excecoes-jdbc
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): traduzir e classificar excecoes jdbc"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
SQLState;

tradução de exceção;

causa preservada;

mensagem segura;

fronteira sem JDBC;

testes de falha.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você eliminou `SQLException` do contrato da aplicação.

Aprendeu que:

```text
SQLException possui mensagem, SQLState, código e cadeia;

SQLState permite classificação mais estável;

mensagem técnica não deve ir ao usuário;

tradução preserva a causa;

exceção unchecked não significa exceção ignorada;

ausência é diferente de falha;

adapter JDBC é a fronteira de tradução;

retry exige política, não apenas categoria.
```

O fluxo final ficou:

```text
ClienteDao
    -> lança SQLException;

JdbcClienteRepository
    -> captura;
    -> classifica;
    -> traduz;

ClienteRepository
    -> não conhece JDBC;

caso de uso
    -> recebe objetos ou PersistenciaException.
```

A aplicação agora possui uma fronteira melhor.

Entretanto, as operações JDBC continuam independentes.

Cada método abre sua conexão e executa sozinho.

A próxima aula será:

```text
318 - M13.08 - Transacoes com JDBC commit rollback
```

Nela, você vai estudar:

- atomicidade;
- autocommit;
- `setAutoCommit(false)`;
- unidade de trabalho;
- `commit`;
- `rollback`;
- rollback em exceção;
- estado da conexão;
- restauração de configuração;
- conexão compartilhada dentro da transação;
- múltiplas operações atômicas;
- falhas parciais;
- exceções durante rollback;
- tratamento de SQLState de transação;
- testes de integração transacionais.

A tradução criada nesta aula será reutilizada para proteger a fronteira de erros durante `commit` e `rollback`.

---

# Material complementar

## Checkpoint final

- [ ] Removi `SQLException` da porta e dos casos de uso.
- [ ] Classifiquei falhas por SQLState.
- [ ] Preservei a causa original na exceção traduzida.
- [ ] Separei mensagem segura de diagnóstico técnico.
- [ ] Não implementei transações nem retry automático.

---

## Troubleshooting adicional

### Causa aparece como null

O construtor da exceção foi chamado sem a `SQLException`.

### SQLState aparece SEM_SQLSTATE

O driver não forneceu estado ou a exceção selecionada não era a correta.

Inspecione `getNextException()`.

### Senha incorreta vira CONEXAO

Confirme se o PostgreSQL respondeu com `28P01` ou se a rede falhou antes da autenticação.

### Falha de SQL vira DESCONHECIDA

Revise o SQLState real.

Objetos inexistentes normalmente usam classe `42`.

### Teste unitario acessa Docker

Ele está usando `JdbcClienteRepository` em vez do fake ou de uma `SQLException` construída.

---

## Perguntas de revisao

1. O que é `SQLException`?
2. Ela é checked?
3. O que é SQLState?
4. O que representam os dois primeiros caracteres?
5. Qual classe indica conexão?
6. Qual SQLState indica senha inválida?
7. Qual classe indica integridade?
8. Qual SQLState indica unique?
9. Para que serve `getErrorCode`?
10. Para que serve `getNextException`?
11. Por que preservar a causa?
12. Por que não mostrar mensagem bruta?
13. Onde capturar `SQLException`?
14. O DAO ainda pode declará-la?
15. A interface Repository deve declará-la?
16. Ausência é falha?
17. `potencialmenteRepetivel` executa retry?
18. O que faz o tradutor?
19. Transação foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Exceção base do JDBC.
2. Sim.
3. Código padronizado de falha SQL.
4. A classe da falha.
5. `08`.
6. `28P01`.
7. `23`.
8. `23505`.
9. Preservar código do fornecedor.
10. Percorrer exceções JDBC encadeadas.
11. Manter diagnóstico e stack trace.
12. Pode expor detalhe sensível.
13. No adaptador JDBC.
14. Sim.
15. Não.
16. Não.
17. Não.
18. Converte SQLException em PersistenciaException.
19. Não.
20. Transações com JDBC, commit e rollback.

---

## Desafio opcional

Crie:

```java
PersistenciaErrorReporter
```

Entrada:

```text
PersistenciaException.
```

Saída:

```text
record sanitizado para log.
```

Campos:

- operação;
- categoria;
- SQLState;
- código;
- repetível;
- tipo da causa;
- timestamp;
- identificador aleatório da ocorrência.

Regras:

- não incluir mensagem da causa;
- não incluir stack trace no record;
- não incluir SQL;
- não incluir parâmetros;
- testes unitários;
- sem biblioteca externa.

O `Main` pode imprimir o identificador para permitir correlação futura.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 317 - M13.07 - Tratamento de excecoes em JDBC

- Aprofundei a anatomia de `SQLException`.
- Diferenciei mensagem, SQLState e código do fornecedor.
- Entendi a cadeia de `getNextException`.
- Criei categorias de falha de persistência.
- Criei `PersistenciaFalha`.
- Criei `PersistenciaException` como exceção não verificada.
- Preservei a `SQLException` como causa.
- Separei mensagem segura de detalhe técnico.
- Criei `JdbcExceptionChain`.
- Criei `JdbcExceptionTranslator`.
- Classifiquei falhas de conexão, autenticação e database.
- Classifiquei violações de integridade.
- Classifiquei SQL inválido ou permissão.
- Classifiquei falta de recurso e interrupção.
- Preparei a categoria de transação abortada.
- Removi `SQLException` de `ClienteRepository`.
- Removi `SQLException` dos casos de uso.
- Mantive JDBC restrito à infraestrutura.
- Diferenciei ausência de falha.
- Testei senha incorreta com SQLState `28P01`.
- Testei database inexistente com SQLState `3D000`.
- Testei coluna inexistente com SQLState `42703`.
- Testei unique `23505` sem alterar o schema final.
- Garanti que mensagens sensíveis não aparecem no console.
- Documentei que repetibilidade não significa retry automático.
- Não implementei transações, pool ou Spring.
- Preservei `projeto_os_final`.
- Próxima aula: transações com JDBC, commit e rollback.
```

---

## Referencia tecnica curta

```text
SQLException:
falha técnica JDBC.

SQLState:
classificação padronizada.

Vendor code:
código específico.

Next exception:
cadeia JDBC.

Translator:
infraestrutura para exceção da aplicação.

PersistenciaException:
falha não verificada e traduzida.

Cause:
erro original preservado.

Mensagem segura:
sem detalhe sensível.

Retryable:
indício, não execução.

Próximo passo:
transação.
```

Regra final:

```text
tratar excecoes JDBC profissionalmente significa classificar pelo SQLState, preservar a causa, proteger mensagens sensiveis e impedir que detalhes da infraestrutura atravessem o contrato da aplicacao.
```
