# 321 - M13.11 - Mini projeto JDBC CRUD OS parte 2

## Apresentacao da aula

Na aula 320, você iniciou o mini projeto JDBC de Ordem de Serviço.

A parte 1 integrou:

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

testes de integração.
```

Foram implementadas as operações:

```text
CREATE:
criar Ordem e histórico inicial.

READ:
buscar por ID;
buscar por código;
listar com filtros.
```

Nesta aula, você concluirá o CRUD com:

```text
UPDATE;

DELETE.
```

O objetivo não é apenas executar um `UPDATE` e um `DELETE`.

A parte 2 precisa resolver problemas reais:

- impedir atualização perdida;
- validar a versão esperada;
- controlar transições de status;
- registrar histórico somente quando o status mudar;
- preencher `concluida_em` corretamente;
- executar atualização e histórico na mesma transação;
- definir uma política explícita de exclusão;
- impedir exclusão de Ordem com dependências operacionais;
- remover histórico e Ordem de forma atômica;
- distinguir Ordem inexistente de versão desatualizada;
- manter o seed oficial intacto;
- fechar tecnicamente o mini projeto JDBC.

A atualização usará:

```text
versão esperada;
SELECT FOR UPDATE;
UPDATE com WHERE id e versao;
incremento de versão;
commit único.
```

A exclusão física será permitida somente quando:

```text
status:
ABERTA.

atividades:
zero.

pagamentos:
zero.

versão:
igual à versão esperada.
```

A existência de histórico inicial não impedirá a exclusão.

O histórico pertence à Ordem e será removido dentro da mesma transação antes da exclusão da linha principal.

Essa política é didática.

Em sistemas reais, muitas Ordens precisam ser preservadas por:

- auditoria;
- regras fiscais;
- rastreabilidade;
- suporte;
- compliance;
- integrações.

Nesses cenários, cancelamento ou exclusão lógica costuma ser preferível à remoção física.

O schema atual não possui coluna de exclusão lógica.

Por isso, o mini projeto concluirá o `DELETE` com uma regra restritiva e explícita.

A aplicação continuará dependendo de:

```java
OrdemRepository
```

A interface será evoluída com:

```java
Ordem atualizar(
        AtualizarOrdemComando comando
);

void excluir(
        ExcluirOrdemComando comando
);
```

A infraestrutura continuará usando:

```text
JdbcOrdemRepository;

JdbcTransactionManager;

OrdemDao;

OrdemHistoricoDao;

JdbcExceptionTranslator;

HikariDataSource.
```

As fixtures permanecerão restritas ao prefixo:

```text
OS-JDBC-321-%.
```

Ao final:

```text
6 Ordens oficiais;

12 históricos oficiais;

nenhuma fixture 320 ou 321.
```

A próxima aula será:

```text
322 - M13.12 - Flyway na pratica com Maven
```

Ela introduzirá versionamento automático de schema.

Nesta aula, o banco já existente será usado sem antecipar Flyway.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection e DataSource.

313:
PreparedStatement.

314:
ResultSet e tipos.

315:
DAO.

316:
Repository Pattern.

317:
tratamento de exceções.

318:
transações.

319:
HikariCP.

320:
mini projeto CRUD parte 1.

321:
mini projeto CRUD parte 2.

322:
Flyway com Maven.
```

A parte 1 criou uma arquitetura capaz de crescer.

A parte 2 deve provar que a estrutura suporta operações mais sensíveis sem mover SQL para a aplicação ou quebrar o limite transacional.

Nesta aula:

```text
CREATE:
já implementado e preservado.

READ:
já implementado e preservado.

UPDATE:
implementado.

DELETE:
implementado com política restritiva.

controle de versão:
sim.

histórico de status:
sim.

pool:
sim.

transação:
sim.

Flyway:
não.

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
labs/m13/aula-321-mini-projeto-jdbc-crud-os-parte-2
```

Comece copiando o projeto da aula 320 e evoluindo os packages para:

```text
br.com.formacao.m13.aula321
```

Estrutura adicional principal:

```text
labs
└── m13
    └── aula-321-mini-projeto-jdbc-crud-os-parte-2
        ├── docs
        │   ├── contrato-atualizacao-os.md
        │   ├── contrato-exclusao-os.md
        │   ├── concorrencia-otimista.md
        │   ├── fechamento-mini-projeto.md
        │   └── troubleshooting-update-delete.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_crud_completo.ps1
        │   ├── 03_limpar_fixtures.ps1
        │   └── 04_validar_estado_final.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula321
            │                           ├── Main.java
            │                           ├── application
            │                           │   ├── AtualizarOrdem.java
            │                           │   ├── AtualizarOrdemComando.java
            │                           │   ├── ExcluirOrdem.java
            │                           │   ├── ExcluirOrdemComando.java
            │                           │   └── OrdemRepository.java
            │                           ├── domain
            │                           │   ├── ConcorrenciaOptimistaException.java
            │                           │   ├── OrdemComDependenciasException.java
            │                           │   ├── OrdemNaoEncontradaException.java
            │                           │   ├── OrdemStatus.java
            │                           │   └── PoliticaExclusaoOrdemException.java
            │                           └── infrastructure
            │                               └── jdbc
            │                                   ├── JdbcOrdemRepository.java
            │                                   ├── OrdemDao.java
            │                                   ├── OrdemDependencias.java
            │                                   └── OrdemHistoricoDao.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula321
                                        ├── application
                                        │   ├── AtualizarOrdemTest.java
                                        │   └── ExcluirOrdemTest.java
                                        └── infrastructure
                                            └── jdbc
                                                └── JdbcOrdemRepositoryIT.java
```

Resultados esperados:

```text
atualização de conteúdo:
versão 0 -> 1;
sem novo histórico se status não mudou.

mudança ABERTA -> AGENDADA:
versão incrementada;
data agendada definida;
histórico criado.

versão antiga:
ConcorrenciaOptimistaException;
nenhuma alteração parcial.

transição inválida:
rollback;
status preservado;
histórico não criado.

exclusão permitida:
Ordem ABERTA sem atividades e pagamentos;
histórico removido;
Ordem removida.

exclusão bloqueada:
Ordem com atividades ou pagamentos;
nenhuma linha removida.

estado final:
seed oficial preservado.
```

---

## Conceito essencial

### UPDATE nao significa substituir tudo sem criterio

Uma atualização profissional precisa conhecer:

- a entidade atual;
- a versão lida pelo consumidor;
- os campos alteráveis;
- as invariantes;
- o status atual;
- o destino solicitado;
- a data da mudança;
- o ator;
- o resultado esperado.

O comando não receberá Cliente e Produto nesta etapa.

A alteração dessas referências exigiria regras adicionais e não é necessária para concluir o escopo atual.

Campos atualizáveis:

```text
prioridade;

descrição do problema;

data agendada;

status;

valor previsto;

metadados;

atualizado em.
```

---

### Concorrencia otimista

Considere dois usuários lendo a mesma Ordem:

```text
versão lida:
0.
```

Usuário A atualiza primeiro:

```text
versão:
1.
```

Usuário B tenta gravar com:

```text
versaoEsperada:
0.
```

Sem controle, B sobrescreveria alterações de A.

O comando usa:

```text
versaoEsperada.
```

O repository compara a versão bloqueada e o `UPDATE` também usa:

```sql
WHERE id = ?
  AND versao = ?
```

Se a versão divergir:

```text
ConcorrenciaOptimistaException.
```

O consumidor precisa recarregar a Ordem e decidir novamente.

---

### Lock e versao juntos

A atualização usa:

```sql
SELECT ...
FOR UPDATE
```

O lock serializa alterações concorrentes na linha durante a transação.

A versão detecta que o comando foi construído com uma leitura desatualizada.

Os mecanismos respondem perguntas diferentes:

```text
lock:
quem altera agora?

versão:
o comando foi baseado no estado atual?
```

---

### Transicoes de status

A enum `OrdemStatus` será evoluída:

```java
public boolean podeAtualizarPara(
        OrdemStatus destino
) {
    if (destino == null) {
        return false;
    }

    if (this == destino) {
        return this != CONCLUIDA
                && this != CANCELADA;
    }

    return switch (this) {
        case ABERTA ->
                destino == AGENDADA
                || destino == CANCELADA;
        case AGENDADA ->
                destino == EM_ATENDIMENTO
                || destino == CANCELADA;
        case EM_ATENDIMENTO ->
                destino == CONCLUIDA
                || destino == CANCELADA;
        case CONCLUIDA,
             CANCELADA -> false;
    };
}
```

A mesma situação pode manter o status para atualizar conteúdo, desde que não seja final.

Ordens concluídas ou canceladas ficam imutáveis neste mini projeto.

---

### Data agendada

Quando o destino for:

```text
AGENDADA;

EM_ATENDIMENTO.
```

`dataAgendada` deve existir.

Ela não pode ser anterior à data de abertura da Ordem.

Para `ABERTA` ou `CANCELADA`, o campo pode permanecer nulo ou preservar uma data já conhecida conforme a decisão do comando.

Nesta aula, cancelamento preservará a data agendada para rastreabilidade.

---

### Data de conclusao

Somente status:

```text
CONCLUIDA
```

recebe:

```text
concluida_em = ocorridoEm.
```

Todos os outros status mantêm:

```text
concluida_em = NULL.
```

Isso respeita a constraint do schema.

---

### Historico somente em mudanca de status

Atualizar descrição, prioridade ou valor sem alterar status não cria evento de status.

Quando o status muda, o histórico recebe:

```text
status anterior;

status novo;

ocorrido em;

origem API;

ator;

motivo.
```

O `UPDATE` e o `INSERT` do histórico compartilham a mesma transação.

---

### Versao incrementada

Toda atualização válida incrementa:

```sql
versao = versao + 1
```

Mesmo quando apenas descrição ou metadata muda.

A versão representa uma alteração persistida da entidade.

A Ordem retornada deve conter o novo valor.

---

### DELETE fisico e politica

O método `excluir` não executa um `DELETE` cego.

Política:

```text
Ordem deve existir;

versão deve coincidir;

status deve ser ABERTA;

não pode possuir atividades;

não pode possuir pagamentos.
```

O histórico inicial pode ser removido porque pertence ao agregado da Ordem.

Se a Ordem tiver dependências operacionais:

```text
OrdemComDependenciasException.
```

Se o status não permitir:

```text
PoliticaExclusaoOrdemException.
```

---

### Ordem das operacoes de exclusao

Dentro da transação:

1. bloquear Ordem;
2. validar versão;
3. validar status;
4. contar atividades e pagamentos;
5. excluir histórico;
6. excluir Ordem com ID e versão;
7. commit.

Se o `DELETE` final falhar:

```text
rollback restaura o histórico removido.
```

A ordem respeita a foreign key do histórico.

---

### Nao confundir DELETE funcional com limpeza

A limpeza de fixtures usa prefixo reservado e existe apenas em testes e scripts.

O método funcional `excluir` usa:

```text
ID;

versão;

política de negócio.
```

Ele não aceita prefixo SQL nem remove várias Ordens.

---

### Ordem inexistente e versao desatualizada

Depois de `SELECT FOR UPDATE`:

```text
sem linha:
OrdemNaoEncontradaException.

linha com outra versão:
ConcorrenciaOptimistaException.
```

Essas situações não são convertidas em `PersistenciaException`.

Elas pertencem ao comportamento da aplicação.

---

### Falha JDBC continua traduzida

`UPDATE`, `DELETE`, contagem de dependências e histórico podem lançar `SQLException`.

O adaptador continua usando:

```text
JdbcExceptionTranslator.
```

A aplicação não importa `java.sql`.

---

### Fechamento do mini projeto

Ao final da aula, o projeto terá:

```text
Create;

Read;

Update;

Delete;

pool;

transações;

histórico;

controle de versão;

tradução de erros;

testes;

documentação.
```

O próximo passo não é adicionar mais SQL manualmente.

A aula 322 organizará a evolução do schema com Flyway.

---

### Atomicidade entre atualizacao e historico

O histórico não é um efeito secundário opcional. Ele faz parte da mesma unidade de negócio da mudança de status.

Considere:

```text
UPDATE confirmado;

INSERT do histórico falhou.
```

Se houver commit intermediário, a Ordem muda sem rastreabilidade.

O fluxo correto mantém:

```text
lock;

validação;

UPDATE;

INSERT do histórico;

leitura final;

commit.
```

Qualquer falha antes do commit exige rollback integral.

Quando apenas campos de conteúdo mudam e o status permanece igual, não existe novo evento de status. Isso não elimina a necessidade da transação: a versão, o conteúdo e a leitura final ainda precisam representar uma única alteração coerente.

---

### Idempotencia e repeticao de comandos

A operação de atualização não é automaticamente idempotente.

Repetir o mesmo comando com:

```text
versaoEsperada:
0.
```

depois do primeiro sucesso encontra a Ordem na versão um e produz conflito.

Esse comportamento é intencional.

A versão impede que uma repetição silenciosa incremente novamente a entidade ou produza histórico duplicado.

Para repetir conscientemente, o consumidor precisa:

1. buscar novamente a Ordem;
2. analisar o estado atual;
3. construir um novo comando;
4. usar a nova versão.

Não transforme `ConcorrenciaOptimistaException` em retry automático sem recarregar dados.

---

### Politica de exclusao como contrato

A política de exclusão precisa ser avaliada dentro da transação, depois do lock.

Verificar dependências antes de abrir a transação cria uma janela de corrida:

```text
consulta encontrou zero dependências;

outro fluxo criou uma Atividade;

DELETE tentou remover a Ordem.
```

No laboratório, a Ordem é bloqueada e as dependências são consultadas na mesma unidade.

As foreign keys continuam sendo a última defesa do banco.

A aplicação, entretanto, deve retornar uma falha compreensível antes de depender apenas de uma violação referencial.

A política também diferencia:

```text
exclusão funcional:
ID, versão e regras.

limpeza técnica:
prefixo reservado e ambiente de teste.
```

Misturar esses conceitos pode permitir remoções amplas em código de produção.

---

### Resultado apos commit

O repository lê a Ordem atualizada antes do commit, usando a mesma conexão.

Essa leitura enxerga as alterações da própria transação.

O objeto só é devolvido depois que o transaction manager conclui o commit.

Se o commit falhar, a chamada lança `PersistenciaException` e o objeto não deve ser tratado como persistido.

Em APIs futuras, a resposta de sucesso somente poderá ser construída após o retorno normal do caso de uso.

## Mao na massa guiada

### 1. Copiar a parte 1

Na raiz:

```powershell
Copy-Item `
  -Path "labs\m13\aula-320-mini-projeto-jdbc-crud-os-parte-1" `
  -Destination "labs\m13\aula-321-mini-projeto-jdbc-crud-os-parte-2" `
  -Recurse

Set-Location `
  "labs\m13\aula-321-mini-projeto-jdbc-crud-os-parte-2"
```

Remova:

```text
target.
```

Atualize:

```text
artifactId;

name;

application name;

pool name;

packages aula320 -> aula321;

prefixos de fixture 320 -> 321.
```

---

### 2. Criar AtualizarOrdemComando.java

```java
package br.com.formacao.m13.aula321.application;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import br.com.formacao.m13.aula321.domain.OrdemPrioridade;
import br.com.formacao.m13.aula321.domain.OrdemStatus;

public record AtualizarOrdemComando(
        long ordemId,
        int versaoEsperada,
        OrdemStatus novoStatus,
        OrdemPrioridade prioridade,
        String descricaoProblema,
        LocalDate dataAgendada,
        BigDecimal valorPrevisto,
        String metadadosJson,
        OffsetDateTime ocorridoEm,
        String ator,
        String motivo
) {

    public AtualizarOrdemComando {
        if (ordemId <= 0) {
            throw new IllegalArgumentException(
                    "ordemId deve ser positivo"
            );
        }

        if (versaoEsperada < 0) {
            throw new IllegalArgumentException(
                    "versaoEsperada inválida"
            );
        }

        if (
            novoStatus == null
            || prioridade == null
        ) {
            throw new IllegalArgumentException(
                    "status e prioridade obrigatórios"
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

        if (
            valorPrevisto == null
            || valorPrevisto.signum() < 0
        ) {
            throw new IllegalArgumentException(
                    "valor previsto inválido"
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
                    "metadados inválidos"
            );
        }

        metadadosJson =
                metadadosJson.trim();

        if (ocorridoEm == null) {
            throw new IllegalArgumentException(
                    "ocorridoEm obrigatório"
            );
        }

        if (ator == null || ator.isBlank()) {
            throw new IllegalArgumentException(
                    "ator obrigatório"
            );
        }

        ator = ator.trim();

        if (
            motivo != null
            && motivo.isBlank()
        ) {
            motivo = null;
        }
    }
}
```

A validação dependente da Ordem atual ficará no repository.

---

### 3. Criar ExcluirOrdemComando.java

```java
package br.com.formacao.m13.aula321.application;

public record ExcluirOrdemComando(
        long ordemId,
        int versaoEsperada
) {

    public ExcluirOrdemComando {
        if (ordemId <= 0) {
            throw new IllegalArgumentException(
                    "ordemId deve ser positivo"
            );
        }

        if (versaoEsperada < 0) {
            throw new IllegalArgumentException(
                    "versaoEsperada inválida"
            );
        }
    }
}
```

---

### 4. Evoluir OrdemRepository.java

Adicione:

```java
Ordem atualizar(
        AtualizarOrdemComando comando
);

void excluir(
        ExcluirOrdemComando comando
);
```

Preserve:

```text
criar;

buscarPorId;

buscarPorCodigo;

listar.
```

A interface continua sem JDBC.

---

### 5. Criar casos de uso

`AtualizarOrdem.java`:

```java
package br.com.formacao.m13.aula321.application;

import java.util.Objects;

import br.com.formacao.m13.aula321.domain.Ordem;

public final class AtualizarOrdem {

    private final OrdemRepository repository;

    public AtualizarOrdem(
            OrdemRepository repository
    ) {
        this.repository =
                Objects.requireNonNull(
                        repository
                );
    }

    public Ordem executar(
            AtualizarOrdemComando comando
    ) {
        return repository.atualizar(
                Objects.requireNonNull(
                        comando
                )
        );
    }
}
```

`ExcluirOrdem.java` segue a mesma ideia e delega `ExcluirOrdemComando`.

---

### 6. Criar excecoes de dominio

`OrdemNaoEncontradaException.java`:

```java
public final class OrdemNaoEncontradaException
        extends RuntimeException {

    public OrdemNaoEncontradaException(
            long id
    ) {
        super("Ordem não encontrada: " + id);
    }
}
```

`ConcorrenciaOptimistaException.java`:

```java
public final class ConcorrenciaOptimistaException
        extends RuntimeException {

    public ConcorrenciaOptimistaException(
            long id,
            int esperada,
            int atual
    ) {
        super(
                "Versão desatualizada da Ordem "
                        + id
                        + ": esperada="
                        + esperada
                        + ", atual="
                        + atual
        );
    }
}
```

`OrdemComDependenciasException.java` recebe ID e quantidades.

`PoliticaExclusaoOrdemException.java` recebe ID e status.

Preserve `TransicaoStatusInvalidaException` da aula 318, ajustada ao package atual.

---

### 7. Criar OrdemDependencias.java

```java
package br.com.formacao.m13.aula321.infrastructure.jdbc;

record OrdemDependencias(
        long atividades,
        long pagamentos
) {

    boolean possuiAlguma() {
        return atividades > 0
                || pagamentos > 0;
    }
}
```

---

### 8. Evoluir OrdemDao.java

Adicione o SQL de bloqueio:

```sql
SELECT
    -- mesmo conjunto de aliases
FROM projeto_os_final.ordem_servico
    AS ordem
JOIN projeto_os_final.cliente
    AS cliente
    ON cliente.id = ordem.cliente_id
JOIN projeto_os_final.produto
    AS produto
    ON produto.id = ordem.produto_id
WHERE ordem.id = ?
FOR UPDATE
```

Método:

```java
Optional<Ordem> findByIdForUpdate(
        Connection connection,
        long id
)
```

Use `OrdemMapper`.

---

### 9. Implementar update no DAO

SQL:

```sql
UPDATE projeto_os_final.ordem_servico
SET
    status = ?,
    prioridade = ?,
    descricao_problema = ?,
    data_agendada = ?,
    concluida_em = ?,
    valor_previsto = ?,
    metadados = CAST(? AS jsonb),
    versao = versao + 1,
    atualizado_em = ?
WHERE id = ?
  AND versao = ?
```

Método:

```java
void update(
        Connection connection,
        Ordem atual,
        AtualizarOrdemComando comando
) throws SQLException
```

Regras de associação:

```text
status:
novoStatus.name.

concluidaEm:
ocorridoEm somente para CONCLUIDA;
NULL nos demais.

dataAgendada:
setObject ou setNull.

ID:
atual.id.

versão:
comando.versaoEsperada.
```

Se `executeUpdate()` não retornar um:

```java
throw new SQLException(
        "Atualização concorrente",
        "40001"
);
```

O repository deverá detectar a divergência antes, mas o `WHERE versao` mantém defesa adicional.

---

### 10. Contar dependencias

No DAO:

```sql
SELECT
    (
        SELECT count(*)
        FROM projeto_os_final.atividade
        WHERE ordem_servico_id = ?
    ) AS atividades,
    (
        SELECT count(*)
        FROM projeto_os_final.pagamento
        WHERE ordem_servico_id = ?
    ) AS pagamentos
```

Método:

```java
OrdemDependencias countDependencies(
        Connection connection,
        long ordemId
)
```

A consulta retorna uma linha.

---

### 11. Implementar exclusao tecnica

No `OrdemHistoricoDao`:

```java
void deleteByOrderId(
        Connection connection,
        long ordemId
)
```

SQL:

```sql
DELETE FROM
    projeto_os_final.ordem_status_historico
WHERE ordem_servico_id = ?
```

No `OrdemDao`:

```java
void delete(
        Connection connection,
        long ordemId,
        int versaoEsperada
)
```

SQL:

```sql
DELETE FROM projeto_os_final.ordem_servico
WHERE id = ?
  AND versao = ?
```

Exija uma linha afetada.

A operação pública continua no repository.

---

### 12. Evoluir OrdemHistoricoDao.java

Adicione:

```java
void insertTransition(
        Connection connection,
        long ordemId,
        OrdemStatus anterior,
        OrdemStatus novo,
        OffsetDateTime ocorridoEm,
        String ator,
        String motivo
)
```

Use:

```text
origem:
API.
```

Não insira evento quando os status forem iguais.

---

### 13. Implementar atualizar no JdbcOrdemRepository

```java
@Override
public Ordem atualizar(
        AtualizarOrdemComando comando
) {
    Objects.requireNonNull(comando);

    return transactions.execute(
            "atualizar Ordem de Serviço",
            connection -> {
                Ordem atual =
                        ordemDao
                                .findByIdForUpdate(
                                        connection,
                                        comando.ordemId()
                                )
                                .orElseThrow(
                                        () ->
                                                new OrdemNaoEncontradaException(
                                                        comando.ordemId()
                                                )
                                );

                if (
                    atual.versao()
                            != comando.versaoEsperada()
                ) {
                    throw new ConcorrenciaOptimistaException(
                            atual.id(),
                            comando.versaoEsperada(),
                            atual.versao()
                    );
                }

                if (
                    !atual.status()
                            .podeAtualizarPara(
                                    comando.novoStatus()
                            )
                ) {
                    throw new TransicaoStatusInvalidaException(
                            atual.status(),
                            comando.novoStatus()
                    );
                }

                if (
                    (
                        comando.novoStatus()
                                == OrdemStatus.AGENDADA
                        || comando.novoStatus()
                                == OrdemStatus.EM_ATENDIMENTO
                    )
                    && comando.dataAgendada() == null
                ) {
                    throw new IllegalArgumentException(
                            "Status exige dataAgendada"
                    );
                }

                if (
                    comando.dataAgendada() != null
                    && comando.dataAgendada()
                            .isBefore(
                                    atual.abertaEm()
                                            .toLocalDate()
                            )
                ) {
                    throw new IllegalArgumentException(
                            "dataAgendada anterior "
                                    + "à abertura"
                    );
                }

                ordemDao.update(
                        connection,
                        atual,
                        comando
                );

                if (
                    atual.status()
                            != comando.novoStatus()
                ) {
                    historicoDao.insertTransition(
                            connection,
                            atual.id(),
                            atual.status(),
                            comando.novoStatus(),
                            comando.ocorridoEm(),
                            comando.ator(),
                            comando.motivo()
                    );
                }

                return ordemDao
                        .findById(
                                connection,
                                atual.id()
                        )
                        .orElseThrow();
            }
    );
}
```

O retorno deve apresentar:

```text
versao anterior + 1.
```

---

### 14. Implementar excluir no JdbcOrdemRepository

```java
@Override
public void excluir(
        ExcluirOrdemComando comando
) {
    Objects.requireNonNull(comando);

    transactions.execute(
            "excluir Ordem de Serviço",
            connection -> {
                Ordem atual =
                        ordemDao
                                .findByIdForUpdate(
                                        connection,
                                        comando.ordemId()
                                )
                                .orElseThrow(
                                        () ->
                                                new OrdemNaoEncontradaException(
                                                        comando.ordemId()
                                                )
                                );

                if (
                    atual.versao()
                            != comando.versaoEsperada()
                ) {
                    throw new ConcorrenciaOptimistaException(
                            atual.id(),
                            comando.versaoEsperada(),
                            atual.versao()
                    );
                }

                if (
                    atual.status()
                            != OrdemStatus.ABERTA
                ) {
                    throw new PoliticaExclusaoOrdemException(
                            atual.id(),
                            atual.status()
                    );
                }

                OrdemDependencias dependencias =
                        ordemDao.countDependencies(
                                connection,
                                atual.id()
                        );

                if (dependencias.possuiAlguma()) {
                    throw new OrdemComDependenciasException(
                            atual.id(),
                            dependencias.atividades(),
                            dependencias.pagamentos()
                    );
                }

                historicoDao.deleteByOrderId(
                        connection,
                        atual.id()
                );

                ordemDao.delete(
                        connection,
                        atual.id(),
                        atual.versao()
                );

                return null;
            }
    );
}
```

A exclusão de histórico e Ordem é atômica.

---

### 15. Atualizar Main.java

O `Main` deve demonstrar:

1. criar `OS-JDBC-321-MAIN`;
2. atualizar conteúdo sem mudar status;
3. confirmar versão um e histórico ainda com uma linha;
4. atualizar `ABERTA -> AGENDADA`;
5. confirmar versão dois e dois históricos;
6. tentar atualização com versão zero;
7. capturar `ConcorrenciaOptimistaException`;
8. criar `OS-JDBC-321-DELETE`;
9. excluir com versão zero;
10. confirmar busca vazia;
11. limpar qualquer fixture restante no `finally`.

Não use Ordens oficiais para demonstrações destrutivas.

---

### 16. Testar atualizacao sem status

No teste de integração:

1. criar uma Ordem;
2. registrar ID e versão zero;
3. atualizar descrição, prioridade, valor e metadata;
4. manter status `ABERTA`;
5. esperar versão um;
6. esperar nova descrição;
7. esperar apenas um histórico.

Isso comprova que histórico de status não é auditoria genérica.

---

### 17. Testar transicao de status

Crie Ordem ABERTA.

Atualize para AGENDADA com data.

Confirme:

```text
status:
AGENDADA.

versão:
1.

históricos:
2.

último:
ABERTA -> AGENDADA.
```

Depois atualize para EM_ATENDIMENTO.

Confirme nova versão e novo histórico.

---

### 18. Testar transicao invalida

Crie ABERTA e tente:

```text
ABERTA -> CONCLUIDA.
```

Espere:

```text
TransicaoStatusInvalidaException.
```

Após nova conexão:

```text
status ABERTA;

versão 0;

um histórico.
```

---

### 19. Testar concorrencia otimista

1. crie Ordem versão zero;
2. atualize com versão zero;
3. tente atualizar novamente usando versão zero;
4. espere `ConcorrenciaOptimistaException`;
5. confirme que a segunda alteração não foi aplicada;
6. confirme que não foi criado histórico extra.

---

### 20. Testar conclusao

Fluxo:

```text
ABERTA -> AGENDADA;

AGENDADA -> EM_ATENDIMENTO;

EM_ATENDIMENTO -> CONCLUIDA.
```

Na conclusão:

```text
concluida_em:
igual a ocorridoEm.

versão:
3.

históricos:
4.
```

Tente atualizar novamente e espere transição inválida.

---

### 21. Testar exclusao permitida

1. criar Ordem ABERTA sem atividades e pagamentos;
2. confirmar um histórico;
3. executar excluir com versão zero;
4. confirmar `buscarPorId` vazio;
5. confirmar zero histórico para o ID;
6. confirmar que outras Ordens continuam intactas.

---

### 22. Testar exclusao com dependencia

Use a Ordem oficial:

```text
307303;
OS-POF-003;
status ABERTA;
versão 0.
```

Ela possui atividades e pagamento.

Execute apenas a tentativa de exclusão.

Espere:

```text
OrdemComDependenciasException.
```

Confirme:

```text
Ordem ainda existe;

histórico oficial continua;

atividades continuam;

pagamento continua.
```

Nunca limpe essa Ordem.

---

### 23. Testar politica por status

Crie uma fixture e transicione para AGENDADA.

Tente excluir.

Espere:

```text
PoliticaExclusaoOrdemException.
```

Confirme que Ordem e históricos permanecem.

A limpeza técnica de teste poderá removê-los pelo prefixo reservado no `@AfterEach`.

---

### 24. Testar versao na exclusao

Crie uma Ordem.

Atualize para versão um.

Tente excluir com versão zero.

Espere `ConcorrenciaOptimistaException`.

Confirme que nenhum histórico foi removido.

---

### 25. Atualizar TestDataCleaner

A limpeza deve reconhecer:

```text
OS-JDBC-320-%;

OS-JDBC-321-%.
```

Ela continua restrita a testes.

Ordem:

1. históricos;
2. Ordens.

Nunca remova atividades ou pagamentos oficiais.

---

### 26. Criar scripts

`01_verificar_pre_requisitos.ps1` valida:

```text
6 Ordens;

12 históricos;

OS-POF-003 existe;

OS-POF-003 possui atividades;

OS-POF-003 possui pagamento;

zero fixtures 320 e 321.
```

`02_executar_crud_completo.ps1` executa:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

`03_limpar_fixtures.ps1` remove somente:

```text
OS-JDBC-320-%;

OS-JDBC-321-%.
```

`04_validar_estado_final.ps1` exige:

```text
6 Ordens;

12 históricos;

12 atividades;

7 pagamentos;

nenhuma fixture.
```

---

### 27. Executar o projeto completo

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_crud_completo.ps1
.\scripts\03_limpar_fixtures.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
Create:
funciona.

Read:
funciona.

Update:
funciona com versão e histórico.

Delete:
funciona somente pela política.

rollback:
preserva consistência.

seed:
intacto.
```

---

### 28. Criar documentacao final

`contrato-atualizacao-os.md` deve documentar:

- campos atualizáveis;
- versão esperada;
- lock;
- transições;
- data agendada;
- conclusão;
- histórico;
- retorno;
- falhas.

`contrato-exclusao-os.md` deve documentar:

- status ABERTA;
- zero atividades;
- zero pagamentos;
- versão;
- exclusão de histórico;
- atomicidade;
- por que hard delete é restrito.

`concorrencia-otimista.md` deve mostrar duas leituras da versão zero e o conflito do segundo gravador.

`fechamento-mini-projeto.md` deve listar todas as classes, responsabilidades e operações concluídas.

`troubleshooting-update-delete.md` deve cobrir:

- update retorna zero;
- versão desatualizada;
- transação abortada;
- concluída sem `concluida_em`;
- exclusão bloqueada;
- histórico removido sem Ordem;
- fixture restante.

---

## Entendendo o que foi feito

### CRUD foi concluido

O repository agora oferece Create, Read, Update e Delete.

### Atualizacao ficou protegida

Lock e versão impedem atualização baseada em estado antigo.

### Historico permaneceu coerente

Somente mudança de status cria evento, dentro da mesma transação.

### Exclusao ganhou politica

Hard delete não é operação genérica; depende de status, versão e ausência de dependências.

### O mini projeto ficou pronto para evolucao de schema

A próxima aula poderá introduzir Flyway sem precisar corrigir o desenho da aplicação.

---

## Erros comuns importantes

### Atualizar sem versao

Isso permite lost update.

### Criar historico fora da transacao

A Ordem pode mudar sem registro correspondente.

### Excluir primeiro a Ordem

A foreign key do histórico impede ou causa inconsistência de ordem operacional.

### Apagar dependencias automaticamente

Atividades e pagamentos não devem desaparecer silenciosamente.

### Usar cleaner como regra de negocio

A limpeza por prefixo existe somente para testes.

---

## Comandos uteis

### Executar tudo

```powershell
mvn clean verify
mvn exec:java
```

### Localizar fixtures

```sql
SELECT
    id,
    codigo,
    status,
    versao
FROM projeto_os_final.ordem_servico
WHERE codigo LIKE 'OS-JDBC-32%';
```

### Conferir dependencias

```sql
SELECT
    ordem.id,
    ordem.codigo,
    (
        SELECT count(*)
        FROM projeto_os_final.atividade
        WHERE ordem_servico_id = ordem.id
    ) AS atividades,
    (
        SELECT count(*)
        FROM projeto_os_final.pagamento
        WHERE ordem_servico_id = ordem.id
    ) AS pagamentos
FROM projeto_os_final.ordem_servico
    AS ordem
WHERE ordem.id = 307303;
```

---

## Exercicio guiado

### Parte 1 — Cancelamento

Implemente:

```text
ABERTA -> CANCELADA.
```

Confirme:

- `concluida_em` nulo;
- histórico criado;
- versão incrementada;
- exclusão bloqueada pela política.

### Parte 2 — Duas atualizacoes concorrentes

Use duas threads:

1. ambas leem versão zero;
2. A atualiza;
3. B tenta atualizar com zero;
4. somente A confirma;
5. B recebe concorrência otimista.

Use sincronização de teste controlada.

### Parte 3 — Falha no historico

Substitua o writer de histórico por um double de teste que lança `SQLException`.

Confirme rollback do update.

Não adicione flag de falha ao código principal.

### Parte 4 — Falha no delete final

Simule falha depois de remover histórico e antes do commit.

Confirme que rollback restaura o histórico.

### Parte 5 — Ordem final imutavel

Conclua uma Ordem e tente alterar descrição mantendo `CONCLUIDA`.

Espere `TransicaoStatusInvalidaException`.

Documente a decisão.

### Parte 6 — Politica alternativa

Desenhe uma exclusão lógica com:

```text
excluida_em;

excluida_por;

motivo_exclusao.
```

Não altere o schema agora.

Essa evolução será candidata a uma migration futura.

### Parte 7 — Auditoria de campos

Explique por que histórico de status não substitui auditoria completa de descrição, prioridade e valor.

Não implemente uma tabela de auditoria nesta aula.

### Parte 8 — Revisao arquitetural

Crie um diagrama final com:

```text
casos de uso;

porta;

adapter;

transaction manager;

DAOs;

mapper;

pool;

PostgreSQL.
```

Marque quem conhece `java.sql`.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 321 existe;
- continuidade com a aula 320 foi preservada;
- projeto da parte 1 foi evoluído;
- packages foram atualizados;
- prefixo de fixture 321 foi criado;
- `AtualizarOrdemComando` foi criado;
- `ExcluirOrdemComando` foi criado;
- `AtualizarOrdem` foi criado;
- `ExcluirOrdem` foi criado;
- repository foi evoluído;
- aplicação continua sem JDBC;
- `OrdemStatus` controla transições;
- estados finais são imutáveis;
- atualização usa `FOR UPDATE`;
- versão atual foi lida;
- versão esperada foi validada;
- update usa ID e versão;
- versão foi incrementada;
- descrição pode ser atualizada;
- prioridade pode ser atualizada;
- valor pode ser atualizado;
- metadata pode ser atualizada;
- data agendada foi validada;
- conclusão preenche `concluida_em`;
- outros estados mantêm `concluida_em` nulo;
- histórico é criado somente em mudança de status;
- update e histórico compartilham transação;
- retorno contém nova versão;
- Ordem inexistente foi diferenciada;
- concorrência otimista foi diferenciada;
- transição inválida provoca rollback;
- `OrdemDependencias` foi criada;
- atividades foram contadas;
- pagamentos foram contados;
- exclusão exige status ABERTA;
- exclusão exige zero atividades;
- exclusão exige zero pagamentos;
- exclusão exige versão atual;
- histórico é removido antes da Ordem;
- histórico e Ordem são removidos na mesma transação;
- falha final restaura exclusões parciais;
- cleaner não foi usado como regra funcional;
- teste de update simples foi criado;
- teste de transição foi criado;
- teste de concorrência foi criado;
- teste de conclusão foi criado;
- teste de exclusão permitida foi criado;
- teste com dependências foi criado;
- teste de política por status foi criado;
- teste de versão na exclusão foi criado;
- Ordem oficial 307303 permaneceu intacta;
- seis Ordens oficiais permanecem;
- doze históricos oficiais permanecem;
- doze atividades permanecem;
- sete pagamentos permanecem;
- nenhuma fixture 320 ou 321 permanece;
- Create e Read continuam funcionando;
- CRUD foi concluído;
- HikariCP continua configurado;
- transações continuam centralizadas;
- exceções JDBC continuam traduzidas;
- Spring não foi usado;
- JPA não foi usado;
- Hibernate não foi usado;
- Flyway não foi antecipado;
- ponte para a aula 322 está correta;
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
  labs/m13/aula-321-mini-projeto-jdbc-crud-os-parte-2
```

Commit recomendado:

```powershell
git commit -m "feat(m13): concluir mini projeto jdbc crud de os"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
UPDATE;

DELETE;

controle de versão;

transições;

histórico;

política de exclusão;

CRUD JDBC completo.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você concluiu o mini projeto JDBC CRUD de Ordem de Serviço.

O projeto final possui:

```text
CREATE:
Ordem e histórico inicial.

READ:
ID, código e listagem.

UPDATE:
campos, status, versão e histórico.

DELETE:
política restritiva e transação.
```

Também reúne:

```text
HikariCP;

DataSource;

transaction manager;

Repository Pattern;

DAO;

mapper;

PreparedStatement;

ResultSet;

SQLState;

exceções traduzidas;

testes unitários;

testes de integração;

fixtures seguras.
```

Você praticou decisões que aparecem em sistemas backend reais:

- concorrência otimista;
- bloqueio de linha;
- atualização atômica;
- histórico de status;
- política de hard delete;
- proteção de dependências;
- preservação de seed;
- separação de camadas.

O schema utilizado pelo projeto continua sendo criado por migrations SQL preparadas no módulo anterior, mas a aplicação ainda não executa nem controla automaticamente essas migrations.

A próxima aula será:

```text
322 - M13.12 - Flyway na pratica com Maven
```

Nela, você vai estudar:

- versionamento de banco;
- convenção `V__`;
- tabela de histórico do Flyway;
- plugin Maven;
- baseline;
- validate;
- migrate;
- repair;
- checksum;
- ordem de migrations;
- configuração por ambiente;
- execução segura;
- integração com PostgreSQL;
- evolução do schema sem scripts manuais dispersos.

O mini projeto JDBC servirá como aplicação consumidora de um schema versionado.

---

# Material complementar

## Checkpoint final

- [ ] Implementei update com versão esperada.
- [ ] Registrei histórico dentro da mesma transação.
- [ ] Implementei delete com política restritiva.
- [ ] Testei concorrência, rollback e dependências.
- [ ] Concluí o CRUD sem contaminar o seed.

---

## Troubleshooting adicional

### UPDATE retorna zero

A Ordem não existe ou a versão está desatualizada.

Recarregue antes de repetir.

### Status mudou sem historico

Confirme que o insert está antes do commit e usa a mesma conexão.

### CONCLUIDA viola constraint

Preencha `concluida_em` com data igual ou posterior à abertura.

### DELETE falha por foreign key

Verifique atividades, pagamentos e histórico.

Não remova dependências operacionais automaticamente.

### Historico desapareceu depois de delete falho

As operações não estavam na mesma transação.

### Versao nao incrementa

Confirme `versao = versao + 1` no SQL.

---

## Perguntas de revisao

1. Quais operações concluíram o CRUD?
2. O que é lost update?
3. Para que serve a versão esperada?
4. Para que serve `FOR UPDATE`?
5. Lock substitui versão?
6. Quando o histórico é criado?
7. Atualização sem status cria histórico?
8. Qual campo muda na conclusão?
9. Quais estados são finais?
10. Quando uma Ordem pode ser excluída?
11. Histórico impede exclusão?
12. Atividades impedem exclusão?
13. Pagamentos impedem exclusão?
14. Qual ordem de delete é usada?
15. Por que tudo fica na mesma transação?
16. Cleaner é regra de negócio?
17. Como versão antiga é reportada?
18. Flyway foi usado?
19. O CRUD está completo?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Update e Delete.
2. Sobrescrita de mudança concorrente.
3. Detectar comando desatualizado.
4. Bloquear a linha durante a transação.
5. Não.
6. Quando status muda.
7. Não.
8. `concluida_em`.
9. CONCLUIDA e CANCELADA.
10. ABERTA, sem atividades e pagamentos.
11. Não; ele é removido atomicamente.
12. Sim.
13. Sim.
14. Histórico e depois Ordem.
15. Para rollback integral.
16. Não.
17. ConcorrenciaOptimistaException.
18. Não.
19. Sim.
20. Flyway na prática com Maven.

---

## Desafio opcional

Crie um decorator:

```java
AuditedOrdemRepository
```

Ele deve envolver `OrdemRepository` e registrar somente:

```text
operação;

ID;

código;

versão anterior;

versão nova;

resultado;

duração.
```

Não registre:

- descrição completa;
- metadata;
- documento;
- email;
- senha;
- SQL.

O decorator não substitui o histórico de status.

Ele representa observabilidade da aplicação.

Crie testes unitários sem banco.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 321 - M13.11 - Mini projeto JDBC CRUD OS parte 2

- Concluí o mini projeto JDBC de Ordem de Serviço.
- Implementei `AtualizarOrdemComando`.
- Implementei `ExcluirOrdemComando`.
- Evoluí a porta `OrdemRepository`.
- Criei casos de uso de atualização e exclusão.
- Mantive JDBC fora da aplicação.
- Modelei transições válidas de status.
- Tornei estados finais imutáveis.
- Usei `SELECT FOR UPDATE`.
- Validei a versão esperada.
- Protegi o update com ID e versão.
- Incrementei a versão a cada alteração.
- Atualizei descrição, prioridade, valor e metadata.
- Validei a data agendada.
- Preenchi `concluida_em` na conclusão.
- Criei histórico somente quando o status mudou.
- Mantive update e histórico na mesma transação.
- Tratei versão antiga como concorrência otimista.
- Diferenciei Ordem inexistente de conflito.
- Defini política restritiva de hard delete.
- Permiti exclusão apenas de Ordem ABERTA.
- Bloqueei exclusão com atividades.
- Bloqueei exclusão com pagamentos.
- Removi histórico e Ordem atomicamente.
- Testei rollback em falhas.
- Preservei a Ordem oficial 307303.
- Preservei seis Ordens, doze históricos, doze atividades e sete pagamentos.
- Removi todas as fixtures 320 e 321.
- Concluí Create, Read, Update e Delete.
- Não usei Spring, JPA, Hibernate ou Flyway antecipadamente.
- Próxima aula: Flyway na prática com Maven.
```

---

## Referencia tecnica curta

```text
UPDATE:
alteração controlada.

optimistic locking:
versão esperada.

FOR UPDATE:
lock da linha.

history:
mudança de status.

final status:
imutável.

DELETE:
política restritiva.

dependencies:
atividades e pagamentos.

transaction:
update e histórico;
histórico e delete.

CRUD:
concluído.

next:
Flyway.
```

Regra final:

```text
concluir um CRUD JDBC profissional exige mais que quatro instrucoes SQL: exige concorrencia, transacoes, historico, politicas de exclusao, protecao de dependencias, erros tipados, testes e fronteiras arquiteturais claras.
```
