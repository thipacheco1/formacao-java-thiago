# 322 - M13.12 - Flyway na pratica com Maven

## Apresentacao da aula

Na aula 321, você concluiu o mini projeto JDBC CRUD de Ordem de Serviço.

O projeto passou a reunir:

```text
HikariCP;

DataSource;

Repository Pattern;

DAO;

PreparedStatement;

ResultSet;

mapeamento;

transações;

tratamento de exceções;

controle de versão;

testes de integração.
```

Entretanto, a aplicação ainda parte de uma premissa externa:

```text
o banco já possui a estrutura correta.
```

Se uma máquina nova, um ambiente de homologação ou uma pipeline receber apenas o código Java, ainda será necessário saber:

- quais schemas criar;
- quais tabelas criar;
- em qual ordem executar scripts;
- quais índices aplicar;
- quais alterações já foram executadas;
- se algum arquivo antigo foi modificado;
- se o banco está atrasado em relação ao repositório;
- como preparar um banco existente sem reaplicar tudo.

Essas perguntas pertencem ao versionamento de banco.

Nesta aula, você utilizará Flyway na prática com Maven.

Flyway mantém migrations no repositório e registra, no banco, quais migrations já foram aplicadas.

O fluxo será:

```text
arquivos SQL versionados
    -> Maven Flyway Plugin
        -> PostgreSQL
            -> flyway_schema_history.
```

A tabela de histórico permitirá responder:

```text
qual migration foi aplicada;

qual versão;

qual descrição;

qual checksum;

quando foi instalada;

quanto tempo levou;

se terminou com sucesso.
```

O laboratório usará uma base isolada:

```text
formacao_java_flyway_322
```

e o schema:

```text
flyway_322
```

Nada será executado em:

```text
projeto_os_final.
```

O seed oficial de seis Ordens e doze históricos permanecerá intocado.

Você criará migrations versionadas:

```text
V1__criar_estrutura_inicial.sql;

V2__criar_indices_e_constraints_adicionais.sql;

V3__inserir_dados_de_referencia.sql;

V4__adicionar_origem_criacao_na_ordem.sql.
```

Também criará uma migration repetível:

```text
R__criar_view_resumo_ordem.sql.
```

Comandos principais:

```powershell
mvn flyway:info
mvn flyway:validate
mvn flyway:migrate
mvn flyway:baseline
mvn flyway:repair
```

A migration `V1` será executada uma vez.

A migration repetível será reexecutada quando seu checksum mudar.

Você também praticará:

- convenção de nomes;
- ordem de execução;
- imutabilidade de migration aplicada;
- checksum;
- baseline de banco legado;
- validação antes do build;
- `repair` em ambiente descartável;
- configuração segura;
- troubleshooting;
- smoke test do schema.

O laboratório utilizará:

```text
Flyway Maven Plugin 12.5.0;

flyway-database-postgresql 12.5.0;

pgJDBC 42.7.13;

Java 21.
```

O suporte PostgreSQL fica em um módulo específico do Flyway e será adicionado às dependências do plugin.

A senha não será passada em argumento de terminal.

As configurações virão de variáveis de ambiente carregadas por script local ignorado pelo Git.

A aula não introduzirá:

- Spring;
- Spring Boot;
- execução automática no startup;
- JPA;
- Hibernate;
- entidades;
- `EntityManager`;
- migrations Java;
- rollback automático de migration;
- `clean` contra banco compartilhado;
- mudança no schema oficial.

A próxima aula será:

```text
323 - M13.13 - JPA conceitos fundamentais
```

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

320 e 321:
mini projeto JDBC CRUD.

322:
Flyway com Maven.

323:
JPA conceitos fundamentais.
```

Até agora, o Java consumiu um schema preparado anteriormente.

A partir desta aula, a estrutura do banco também passa a fazer parte do ciclo versionado do projeto.

A responsabilidade será dividida:

```text
Flyway:
evoluir schema e dados estruturais.

aplicação:
executar regras e persistência.

PostgreSQL:
garantir constraints e armazenamento.

Git:
versionar migrations.
```

Nesta aula:

```text
Maven plugin:
sim.

migration SQL:
sim.

schema history:
sim.

baseline:
sim, em banco legado isolado.

repair:
sim, somente em base descartável.

clean:
desabilitado.

JPA:
não.

Spring:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-322-flyway-pratica-maven
```

Estrutura final:

```text
labs
└── m13
    └── aula-322-flyway-pratica-maven
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── flyway.local.env.example
        │   └── flyway.local.env
        ├── docs
        │   ├── contrato-migrations.md
        │   ├── estrategia-baseline.md
        │   ├── politica-repair.md
        │   └── troubleshooting-flyway.md
        ├── scripts
        │   ├── 01_criar_databases.ps1
        │   ├── 02_executar_migrate.ps1
        │   ├── 03_validar_schema.ps1
        │   ├── 04_preparar_legacy.ps1
        │   ├── 05_executar_baseline_legacy.ps1
        │   ├── 06_demo_checksum.ps1
        │   ├── 07_demo_repair_descartavel.ps1
        │   ├── 08_limpar_laboratorio.ps1
        │   └── 09_validar_escopo.ps1
        └── src
            ├── main
            │   └── resources
            │       └── db
            │           ├── migration
            │           │   ├── V1__criar_estrutura_inicial.sql
            │           │   ├── V2__criar_indices_e_constraints_adicionais.sql
            │           │   ├── V3__inserir_dados_de_referencia.sql
            │           │   ├── V4__adicionar_origem_criacao_na_ordem.sql
            │           │   └── R__criar_view_resumo_ordem.sql
            │           └── legacy
            │               ├── V2__adicionar_prioridade.sql
            │               └── V3__criar_indice_status.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula322
                                        └── FlywaySchemaIT.java
```

Resultados esperados na base principal:

```text
migrations aplicadas:
V1, V2, V3, V4 e R.

tabela de histórico:
5 linhas com sucesso.

schema:
flyway_322.

Clientes:
2.

Produtos:
2.

Ordens:
2.

view:
2 linhas.

validate:
sucesso.

segundo migrate:
nenhuma migration pendente.
```

Resultados esperados no banco legado:

```text
baseline:
versão 1.

migrate:
aplica V2 e V3.

estrutura anterior:
preservada.
```

---

## Conceito essencial

### O problema dos scripts soltos

Um diretório com arquivos:

```text
criar_tabelas.sql;

alterar_tabela_novo.sql;

ajuste_final.sql;

ajuste_final_2.sql.
```

não responde com segurança:

- qual foi aplicado;
- em qual ambiente;
- em qual ordem;
- se foi modificado;
- se pode ser executado de novo;
- se o banco está atualizado.

Flyway transforma migrations em uma sequência rastreável.

---

### Migration versionada

Migration versionada usa o padrão:

```text
V<versao>__<descricao>.sql
```

Exemplos:

```text
V1__criar_estrutura_inicial.sql;

V2__criar_indices.sql;

V2_1__ajustar_constraint.sql.
```

Partes:

```text
V:
prefixo de migration versionada.

1:
versão.

__:
separador duplo.

descricao:
texto legível.

.sql:
sufixo.
```

Depois que uma versionada é aplicada com sucesso, ela não é executada novamente.

---

### Migration repetivel

Migration repetível usa:

```text
R__descricao.sql
```

Ela não possui versão.

É executada:

- depois das migrations versionadas pendentes;
- quando ainda não foi aplicada;
- quando seu checksum muda.

Usos comuns:

- views;
- functions;
- procedures;
- dados de referência reconstruíveis.

Não use migration repetível para uma alteração destrutiva que precise ocorrer exatamente uma vez.

---

### Ordem de execucao

Flyway ordena migrations versionadas pela versão.

Exemplo:

```text
V1;

V2;

V3;

V10.
```

A ordenação não é alfabética simples.

Ainda assim, mantenha nomes claros e versões sem ambiguidade.

No laboratório:

```text
V1;
V2;
V3;
V4;
R.
```

---

### Schema history

A tabela padrão:

```text
flyway_schema_history
```

registra informações de execução.

Colunas importantes:

```text
installed_rank;

version;

description;

type;

script;

checksum;

installed_by;

installed_on;

execution_time;

success.
```

Ela não substitui backup.

Ela registra o histórico de migrations conhecido pelo Flyway.

Não edite essa tabela manualmente.

---

### Checksum

O checksum representa o conteúdo da migration.

Se uma migration aplicada for modificada, `validate` detecta divergência.

Exemplo:

```text
banco registrou checksum A;

arquivo atual possui checksum B.
```

Essa falha é valiosa.

Ela mostra que o repositório não representa mais exatamente o artefato aplicado.

Regra:

```text
migration versionada aplicada é imutável.
```

Para corrigir o schema, crie uma nova migration.

---

### Migrate

`migrate`:

1. lê a configuração;
2. localiza migrations;
3. cria a tabela de histórico quando necessário;
4. compara arquivos e histórico;
5. valida;
6. adquire lock;
7. aplica pendências;
8. registra resultados.

Comando:

```powershell
mvn flyway:migrate
```

Executar novamente sem arquivos novos deve produzir:

```text
schema up to date.
```

---

### Info

`info` mostra:

- migrations aplicadas;
- pendentes;
- baseline;
- repetíveis;
- estado;
- versão atual.

Comando:

```powershell
mvn flyway:info
```

Use antes de `migrate` em operações sensíveis.

---

### Validate

`validate` compara migrations disponíveis com o histórico.

Ele detecta, entre outros cenários:

- checksum diferente;
- migration aplicada ausente;
- versão duplicada;
- nome inválido;
- migration resolvida não aplicada em condições inconsistentes;
- falha registrada.

Comando:

```powershell
mvn flyway:validate
```

No laboratório, `validate` também será executado antes dos testes Maven.

---

### Baseline

Baseline registra um ponto inicial para um banco existente que ainda não era gerenciado pelo Flyway.

Exemplo:

```text
estrutura atual corresponde à versão 1;
Flyway passa a gerenciar a partir dali.
```

O comando não recria a estrutura antiga.

Ele registra uma linha de baseline.

Depois, migrations acima da versão baseline podem ser aplicadas.

Baseline não deve ser usado para esconder um banco desconhecido.

Antes de executar:

- inventarie objetos;
- compare ambientes;
- faça backup;
- defina versão;
- revise migrations futuras;
- documente a decisão.

---

### baselineOnMigrate

Existe uma opção para baseline automático durante `migrate`.

Ela ficará:

```text
false.
```

Motivo:

```text
baseline precisa ser uma decisão explícita.
```

Ativá-la indiscriminadamente pode migrar o banco errado ou legitimar uma estrutura não auditada.

---

### Repair

`repair` ajusta metadados da tabela de histórico em cenários específicos, como:

- remover registro de migration falha quando o banco exige isso;
- realinhar checksum;
- atualizar descrição ou tipo;
- marcar migrations ausentes conforme comportamento suportado.

Ele não corrige o schema por você.

Ele não executa SQL de compensação.

Ele não transforma migration errada em migration correta.

No laboratório, `repair` será demonstrado apenas em uma cópia descartável.

No fluxo normal, uma alteração acidental em migration aplicada deve ser corrigida restaurando o arquivo original.

---

### Clean

`clean` remove objetos dos schemas configurados.

É uma operação destrutiva.

No `pom.xml`:

```xml
<cleanDisabled>true</cleanDisabled>
```

O laboratório terá scripts explícitos para remover apenas os databases didáticos.

Nunca use `flyway:clean` em produção.

---

### Out of order

`outOfOrder` permite aplicar uma migration de versão menor descoberta depois de versões maiores.

Ficará:

```text
false.
```

Exemplo problemático:

```text
V1 e V3 já aplicadas;

alguém adiciona V2 depois.
```

O correto é criar uma nova versão superior, não reescrever a história.

---

### Location

A location principal será:

```text
classpath:db/migration.
```

No Maven Plugin, migrations em:

```text
src/main/resources
```

entram no classpath do projeto.

O perfil legado usará:

```text
filesystem:src/main/resources/db/legacy.
```

Isso separa a demonstração de baseline do schema principal.

---

### PostgreSQL module

Nas versões modernas do Flyway, o suporte PostgreSQL é fornecido por um módulo específico:

```text
flyway-database-postgresql.
```

Ele será adicionado como dependência do plugin.

O driver continuará sendo:

```text
org.postgresql:postgresql.
```

Sem o módulo correto, o Flyway pode não reconhecer o database.

---

### Configuracao e segredo

O POM referencia:

```text
${env.FLYWAY_URL};

${env.FLYWAY_USER};

${env.FLYWAY_PASSWORD}.
```

O arquivo local apenas ajuda o script PowerShell a carregar variáveis.

Ele está no `.gitignore`.

Não execute:

```powershell
mvn flyway:migrate `
  -Dflyway.password=minha_senha
```

Argumentos podem aparecer no histórico do terminal e em logs de processo.

---

### Migration e transacao

PostgreSQL suporta muitas operações DDL transacionais.

Flyway executa migrations em transação quando a combinação de database e instruções permite.

Nem toda operação pode participar de transação.

Exemplo importante:

```sql
CREATE INDEX CONCURRENTLY
```

exige tratamento específico e não será usado nesta aula.

Não suponha que toda migration de qualquer banco será desfeita automaticamente.

---

### Uma migration deve ter uma responsabilidade

Evite uma migration com centenas de mudanças sem relação.

Prefira passos coerentes:

```text
V1:
estrutura inicial.

V2:
índices e constraints adicionais.

V3:
dados de referência.

V4:
evolução da Ordem.
```

A migration precisa ser revisável e operacionalmente compreensível.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-322-flyway-pratica-maven\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-322-flyway-pratica-maven\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-322-flyway-pratica-maven\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-322-flyway-pratica-maven\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-322-flyway-pratica-maven\src\main\resources\db\legacy"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-322-flyway-pratica-maven\src\test\java\br\com\formacao\m13\aula322"

Set-Location `
  "labs\m13\aula-322-flyway-pratica-maven"
```

---

### 2. Criar .gitignore

```text
target/
.idea/
*.iml

config/flyway.local.env
backup-migration/
```

---

### 3. Criar pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
             http://maven.apache.org/POM/4.0.0
             https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.formacao</groupId>
    <artifactId>aula-322-flyway-maven</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>
            UTF-8
        </project.build.sourceEncoding>

        <flyway.version>12.5.0</flyway.version>
        <postgresql.version>42.7.13</postgresql.version>
        <junit.version>5.10.2</junit.version>
        <failsafe.version>3.2.5</failsafe.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.flywaydb</groupId>
                <artifactId>flyway-maven-plugin</artifactId>
                <version>${flyway.version}</version>

                <configuration>
                    <url>${env.FLYWAY_URL}</url>
                    <user>${env.FLYWAY_USER}</user>
                    <password>${env.FLYWAY_PASSWORD}</password>

                    <defaultSchema>
                        ${env.FLYWAY_SCHEMA}
                    </defaultSchema>

                    <schemas>
                        <schema>
                            ${env.FLYWAY_SCHEMA}
                        </schema>
                    </schemas>

                    <locations>
                        <location>
                            classpath:db/migration
                        </location>
                    </locations>

                    <table>
                        flyway_schema_history
                    </table>

                    <createSchemas>true</createSchemas>
                    <validateOnMigrate>true</validateOnMigrate>
                    <baselineOnMigrate>false</baselineOnMigrate>
                    <outOfOrder>false</outOfOrder>
                    <cleanDisabled>true</cleanDisabled>
                    <connectRetries>3</connectRetries>
                </configuration>

                <dependencies>
                    <dependency>
                        <groupId>org.flywaydb</groupId>
                        <artifactId>
                            flyway-database-postgresql
                        </artifactId>
                        <version>
                            ${flyway.version}
                        </version>
                    </dependency>

                    <dependency>
                        <groupId>org.postgresql</groupId>
                        <artifactId>postgresql</artifactId>
                        <version>
                            ${postgresql.version}
                        </version>
                    </dependency>
                </dependencies>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>
                    maven-failsafe-plugin
                </artifactId>
                <version>${failsafe.version}</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>integration-test</goal>
                            <goal>verify</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <profile>
            <id>legacy</id>

            <properties>
                <flyway.schema>
                    flyway_322_legacy
                </flyway.schema>
            </properties>

            <build>
                <plugins>
                    <plugin>
                        <groupId>org.flywaydb</groupId>
                        <artifactId>
                            flyway-maven-plugin
                        </artifactId>

                        <configuration>
                            <url>
                                ${env.FLYWAY_LEGACY_URL}
                            </url>
                            <user>
                                ${env.FLYWAY_USER}
                            </user>
                            <password>
                                ${env.FLYWAY_PASSWORD}
                            </password>
                            <defaultSchema>
                                flyway_322_legacy
                            </defaultSchema>
                            <schemas>
                                <schema>
                                    flyway_322_legacy
                                </schema>
                            </schemas>
                            <locations>
                                <location>
                                    filesystem:src/main/resources/db/legacy
                                </location>
                            </locations>
                            <baselineVersion>1</baselineVersion>
                            <baselineDescription>
                                Estrutura legada inicial
                            </baselineDescription>
                            <baselineOnMigrate>
                                false
                            </baselineOnMigrate>
                            <cleanDisabled>true</cleanDisabled>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

O perfil legado aponta para outro database e outra location.

---

### 4. Criar configuracao local

`config/flyway.local.env.example`:

```properties
FLYWAY_URL=jdbc:postgresql://localhost:5433/formacao_java_flyway_322
FLYWAY_LEGACY_URL=jdbc:postgresql://localhost:5433/formacao_java_flyway_322_legacy
FLYWAY_REPAIR_URL=jdbc:postgresql://localhost:5433/formacao_java_flyway_322_repair
FLYWAY_USER=formacao
FLYWAY_PASSWORD=formacao_local
FLYWAY_SCHEMA=flyway_322
```

Copie:

```powershell
Copy-Item `
  ".\config\flyway.local.env.example" `
  ".\config\flyway.local.env"
```

---

### 5. Criar V1

`V1__criar_estrutura_inicial.sql`:

```sql
CREATE SCHEMA IF NOT EXISTS flyway_322;

CREATE TABLE flyway_322.cliente (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo varchar(40) NOT NULL,
    nome varchar(120) NOT NULL,
    ativo boolean NOT NULL DEFAULT true,
    criado_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_flyway_322_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_flyway_322_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_flyway_322_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_flyway_322_cliente_nome
        CHECK (btrim(nome) <> '')
);

CREATE TABLE flyway_322.produto (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo varchar(40) NOT NULL,
    nome varchar(120) NOT NULL,
    ativo boolean NOT NULL DEFAULT true,
    criado_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_flyway_322_produto
        PRIMARY KEY (id),

    CONSTRAINT uk_flyway_322_produto_codigo
        UNIQUE (codigo)
);

CREATE TABLE flyway_322.ordem_servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo varchar(80) NOT NULL,
    cliente_id bigint NOT NULL,
    produto_id bigint NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'ABERTA',
    prioridade varchar(20) NOT NULL DEFAULT 'NORMAL',
    descricao text NOT NULL,
    criada_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_flyway_322_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_flyway_322_ordem_codigo
        UNIQUE (codigo),

    CONSTRAINT fk_flyway_322_ordem_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES flyway_322.cliente (id),

    CONSTRAINT fk_flyway_322_ordem_produto
        FOREIGN KEY (produto_id)
        REFERENCES flyway_322.produto (id),

    CONSTRAINT ck_flyway_322_ordem_status
        CHECK (
            status IN (
                'ABERTA',
                'AGENDADA',
                'CONCLUIDA',
                'CANCELADA'
            )
        ),

    CONSTRAINT ck_flyway_322_ordem_prioridade
        CHECK (
            prioridade IN (
                'BAIXA',
                'NORMAL',
                'ALTA',
                'CRITICA'
            )
        )
);
```

---

### 6. Criar V2

`V2__criar_indices_e_constraints_adicionais.sql`:

```sql
CREATE INDEX idx_flyway_322_ordem_status
    ON flyway_322.ordem_servico (status);

CREATE INDEX idx_flyway_322_ordem_cliente
    ON flyway_322.ordem_servico (
        cliente_id,
        criada_em DESC
    );

ALTER TABLE flyway_322.produto
    ADD CONSTRAINT ck_flyway_322_produto_codigo
    CHECK (btrim(codigo) <> '');

ALTER TABLE flyway_322.produto
    ADD CONSTRAINT ck_flyway_322_produto_nome
    CHECK (btrim(nome) <> '');

ALTER TABLE flyway_322.ordem_servico
    ADD CONSTRAINT ck_flyway_322_ordem_descricao
    CHECK (btrim(descricao) <> '');
```

---

### 7. Criar V3

`V3__inserir_dados_de_referencia.sql`:

```sql
INSERT INTO flyway_322.cliente (
    codigo,
    nome
)
VALUES
    ('CLI-FLY-001', 'Cliente Flyway Alfa'),
    ('CLI-FLY-002', 'Cliente Flyway Beta');

INSERT INTO flyway_322.produto (
    codigo,
    nome
)
VALUES
    ('PROD-FLY-001', 'Instalação Flyway'),
    ('PROD-FLY-002', 'Manutenção Flyway');

INSERT INTO flyway_322.ordem_servico (
    codigo,
    cliente_id,
    produto_id,
    status,
    prioridade,
    descricao
)
SELECT
    dados.codigo,
    cliente.id,
    produto.id,
    dados.status,
    dados.prioridade,
    dados.descricao
FROM (
    VALUES
        (
            'OS-FLY-001',
            'CLI-FLY-001',
            'PROD-FLY-001',
            'ABERTA',
            'NORMAL',
            'Ordem criada pela migration V3'
        ),
        (
            'OS-FLY-002',
            'CLI-FLY-002',
            'PROD-FLY-002',
            'AGENDADA',
            'ALTA',
            'Segunda Ordem criada pela V3'
        )
) AS dados (
    codigo,
    cliente_codigo,
    produto_codigo,
    status,
    prioridade,
    descricao
)
JOIN flyway_322.cliente
    ON cliente.codigo =
       dados.cliente_codigo
JOIN flyway_322.produto
    ON produto.codigo =
       dados.produto_codigo;
```

Migration versionada não precisa ser escrita para repetir indefinidamente.

Flyway garante execução única por versão.

---

### 8. Criar V4

`V4__adicionar_origem_criacao_na_ordem.sql`:

```sql
ALTER TABLE flyway_322.ordem_servico
    ADD COLUMN origem_criacao varchar(30);

UPDATE flyway_322.ordem_servico
SET origem_criacao = 'MIGRATION_V3'
WHERE origem_criacao IS NULL;

ALTER TABLE flyway_322.ordem_servico
    ALTER COLUMN origem_criacao
    SET DEFAULT 'APLICACAO';

ALTER TABLE flyway_322.ordem_servico
    ALTER COLUMN origem_criacao
    SET NOT NULL;

ALTER TABLE flyway_322.ordem_servico
    ADD CONSTRAINT ck_flyway_322_ordem_origem
    CHECK (
        origem_criacao IN (
            'MIGRATION_V3',
            'APLICACAO',
            'IMPORTACAO'
        )
    );
```

A migration segue a ordem:

```text
adicionar nula;

preencher legado;

definir default;

tornar obrigatória;

adicionar check.
```

---

### 9. Criar migration repetivel

`R__criar_view_resumo_ordem.sql`:

```sql
CREATE OR REPLACE VIEW
    flyway_322.vw_resumo_ordem
AS
SELECT
    ordem.id AS ordem_id,
    ordem.codigo AS ordem_codigo,
    ordem.status,
    ordem.prioridade,
    ordem.origem_criacao,
    cliente.codigo AS cliente_codigo,
    cliente.nome AS cliente_nome,
    produto.codigo AS produto_codigo,
    produto.nome AS produto_nome,
    ordem.criada_em
FROM flyway_322.ordem_servico
    AS ordem
JOIN flyway_322.cliente
    AS cliente
    ON cliente.id = ordem.cliente_id
JOIN flyway_322.produto
    AS produto
    ON produto.id = ordem.produto_id;
```

---

### 10. Criar databases

`scripts/01_criar_databases.ps1` deve executar no container:

```powershell
$databases = @(
    "formacao_java_flyway_322",
    "formacao_java_flyway_322_legacy",
    "formacao_java_flyway_322_repair"
)

foreach ($database in $databases) {
    $exists = docker exec `
        formacao-postgres-m12 `
        psql `
        -X `
        -tA `
        -U formacao `
        -d postgres `
        -c (
            "SELECT 1 " +
            "FROM pg_database " +
            "WHERE datname = '$database';"
        )

    if ($exists.Trim() -ne "1") {
        docker exec `
            formacao-postgres-m12 `
            createdb `
            -U formacao `
            $database
    }
}
```

Não use `DROP DATABASE` nesse script.

---

### 11. Carregar variaveis

Nos scripts, leia:

```text
config/flyway.local.env
```

Ignore linhas vazias e comentários.

Atribua com:

```powershell
[Environment]::SetEnvironmentVariable(
    $name,
    $value,
    "Process"
)
```

No `finally`, remova todas as variáveis `FLYWAY_*`.

---

### 12. Executar migrate principal

`scripts/02_executar_migrate.ps1`:

```powershell
mvn -q resources:resources

mvn flyway:info

mvn flyway:validate

mvn flyway:migrate

mvn flyway:info

mvn flyway:validate

mvn verify
```

Valide `$LASTEXITCODE` após cada comando.

Execute `migrate` uma segunda vez.

O segundo resultado deve indicar nenhuma migration pendente.

---

### 13. Criar FlywaySchemaIT.java

O teste deve abrir conexão usando:

```text
FLYWAY_URL;

FLYWAY_USER;

FLYWAY_PASSWORD.
```

Validações:

```sql
SELECT count(*)
FROM flyway_322.flyway_schema_history
WHERE success;
```

Esperado:

```text
5.
```

Valide:

```text
2 Clientes;

2 Produtos;

2 Ordens;

2 linhas na view;

origem_criacao não nula;

versão V4 presente;

migration repetível presente.
```

O teste não executa migrations.

Ele verifica o resultado produzido pelo plugin Maven.

---

### 14. Consultar historico

Use:

```sql
SELECT
    installed_rank,
    version,
    description,
    type,
    script,
    checksum,
    installed_by,
    installed_on,
    execution_time,
    success
FROM flyway_322.flyway_schema_history
ORDER BY installed_rank;
```

Observe:

```text
version nula na repetível;

checksum preenchido;

success true;

ordem de instalação.
```

---

### 15. Preparar banco legado

`scripts/04_preparar_legacy.ps1` deve criar manualmente:

```sql
CREATE SCHEMA flyway_322_legacy;

CREATE TABLE flyway_322_legacy.ordem_servico (
    id bigint GENERATED BY DEFAULT AS IDENTITY,
    codigo varchar(80) NOT NULL,
    status varchar(30) NOT NULL DEFAULT 'ABERTA',

    CONSTRAINT pk_legacy_ordem
        PRIMARY KEY (id),

    CONSTRAINT uk_legacy_ordem_codigo
        UNIQUE (codigo)
);

INSERT INTO flyway_322_legacy.ordem_servico (
    codigo
)
VALUES ('OS-LEGACY-001');
```

Confirme que não existe tabela de histórico antes do baseline.

---

### 16. Criar migrations legacy

`db/legacy/V2__adicionar_prioridade.sql`:

```sql
ALTER TABLE
    flyway_322_legacy.ordem_servico
ADD COLUMN prioridade varchar(20)
    NOT NULL
    DEFAULT 'NORMAL';

ALTER TABLE
    flyway_322_legacy.ordem_servico
ADD CONSTRAINT ck_legacy_prioridade
CHECK (
    prioridade IN (
        'BAIXA',
        'NORMAL',
        'ALTA',
        'CRITICA'
    )
);
```

`V3__criar_indice_status.sql`:

```sql
CREATE INDEX idx_legacy_ordem_status
    ON flyway_322_legacy.ordem_servico (
        status
    );
```

Não existe `V1` na location legacy porque o banco já contém a estrutura equivalente.

---

### 17. Executar baseline

`scripts/05_executar_baseline_legacy.ps1`:

```powershell
mvn -Plegacy flyway:info

mvn -Plegacy flyway:baseline

mvn -Plegacy flyway:info

mvn -Plegacy flyway:migrate

mvn -Plegacy flyway:validate
```

Valide:

```text
baseline versão 1;

V2 aplicada;

V3 aplicada;

OS-LEGACY-001 preservada;

prioridade NORMAL;

índice criado.
```

Baseline não executou `V1`.

Ele apenas registrou o ponto inicial.

---

### 18. Demonstrar checksum com seguranca

`scripts/06_demo_checksum.ps1` deve:

1. copiar `V4` para `backup-migration`;
2. adicionar um comentário ao arquivo;
3. executar `mvn flyway:validate`;
4. exigir falha;
5. restaurar o arquivo original;
6. executar `validate`;
7. exigir sucesso;
8. remover backup.

A demonstração prova:

```text
até comentário altera checksum.
```

A correção correta foi restaurar a migration aplicada.

Não execute `repair` no banco principal.

---

### 19. Demonstrar repair em base descartavel

Use `FLYWAY_REPAIR_URL` temporariamente como `FLYWAY_URL`.

Fluxo:

1. garantir database repair vazio;
2. executar `migrate`;
3. modificar uma migration aplicada;
4. executar `validate` e confirmar falha;
5. executar `repair`;
6. executar `validate` e confirmar sucesso;
7. registrar que o checksum do histórico foi realinhado;
8. restaurar o arquivo;
9. remover o database repair.

Depois de restaurar o arquivo original, não reutilize a base realinhada.

Ela deve ser descartada.

A lição é:

```text
repair altera metadados;

não corrige o SQL aplicado;

não deve ser resposta automática.
```

---

### 20. Validar schema

`scripts/03_validar_schema.ps1` deve consultar:

```text
history count 5;

versioned count 4;

repeatable count 1;

failed count 0;

Clientes 2;

Produtos 2;

Ordens 2;

view 2.
```

Também execute:

```powershell
mvn flyway:validate
```

---

### 21. Limpar laboratorio

`scripts/08_limpar_laboratorio.ps1` deve:

1. encerrar conexões dos três databases didáticos;
2. executar `DROP DATABASE IF EXISTS` somente para os nomes exatos;
3. nunca aceitar nome via entrada livre;
4. confirmar que `formacao_java` continua existente.

Não use `flyway:clean`.

---

### 22. Validar escopo

`scripts/09_validar_escopo.ps1` deve exigir:

```text
flyway-maven-plugin;

flyway-database-postgresql;

V1__;

V2__;

V3__;

V4__;

R__;

cleanDisabled true;

baselineOnMigrate false;

outOfOrder false.
```

Proibir:

```text
org.springframework;

jakarta.persistence;

@Entity;

EntityManager;

flyway:clean;

projeto_os_final em migrations;

senha literal no pom.
```

---

### 23. Executar o laboratorio completo

Ordem:

```powershell
.\scripts\01_criar_databases.ps1
.\scripts\02_executar_migrate.ps1
.\scripts\03_validar_schema.ps1
.\scripts\04_preparar_legacy.ps1
.\scripts\05_executar_baseline_legacy.ps1
.\scripts\06_demo_checksum.ps1
.\scripts\07_demo_repair_descartavel.ps1
.\scripts\09_validar_escopo.ps1
```

Depois de registrar evidências:

```powershell
.\scripts\08_limpar_laboratorio.ps1
```

Confirme:

```text
database principal original existe;

projeto_os_final permanece intacto;

databases 322 foram removidos.
```

---

### 24. Criar documentacao

`contrato-migrations.md` deve registrar:

- convenção;
- versionadas;
- repetíveis;
- responsabilidade;
- revisão;
- imutabilidade;
- ordem;
- política de dados de referência;
- proibição de senha.

`estrategia-baseline.md` deve explicar:

- quando usar;
- inventário;
- backup;
- versão escolhida;
- ambiente legado;
- riscos;
- por que baselineOnMigrate está false.

`politica-repair.md` deve definir:

```text
repair exige diagnóstico;

não corrige objetos;

não é rotina de deploy;

não deve legitimar edição indevida;

principal permanece intocado;

demonstrações usam banco descartável.
```

`troubleshooting-flyway.md` deve cobrir:

- checksum mismatch;
- migration duplicada;
- migration ausente;
- schema não encontrado;
- database module ausente;
- driver ausente;
- history table inesperada;
- baseline incorreto;
- repair mal utilizado;
- credencial inválida.

---

## Entendendo o que foi feito

### O schema entrou no versionamento

A estrutura deixou de depender de execução manual sem histórico.

### O banco passou a registrar migrations

`flyway_schema_history` tornou a evolução auditável.

### Migrations aplicadas ficaram imutaveis

A demonstração de checksum mostrou que o arquivo precisa ser preservado.

### Baseline incorporou um legado

O banco existente ganhou um ponto inicial sem recriar sua primeira estrutura.

### Repair foi tratado como ferramenta cirurgica

A demonstração ocorreu somente em base descartável.

---

## Erros comuns importantes

### Editar V1 aplicada

Crie uma nova migration.

### Ativar baselineOnMigrate por conveniencia

Isso pode ocultar um banco incorreto.

### Executar repair sem diagnostico

Metadados podem ficar coerentes com um schema errado.

### Colocar senha no pom

Use configuração externa e segredo do ambiente.

### Usar clean em banco compartilhado

A operação remove objetos dos schemas configurados.

---

## Comandos uteis

### Informacao

```powershell
mvn flyway:info
```

### Validacao

```powershell
mvn flyway:validate
```

### Migracao

```powershell
mvn flyway:migrate
```

### Baseline legado

```powershell
mvn -Plegacy flyway:baseline
```

### Repair descartavel

```powershell
mvn flyway:repair
```

---

## Exercicio guiado

### Parte 1 — V5

Crie:

```text
V5__adicionar_data_agendada.sql
```

Adicione `data_agendada date`.

Depois:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

Confirme versão atual cinco.

### Parte 2 — Repetivel

Adicione à view:

```text
descricao.
```

Execute `info` antes e depois do `migrate`.

Confirme nova execução da repetível.

### Parte 3 — Migration duplicada

Crie temporariamente dois arquivos com versão seis.

Execute `validate`.

Registre a falha e remova o arquivo temporário.

### Parte 4 — Nome invalido

Crie:

```text
V7_criar_tabela.sql
```

com apenas um underscore.

Observe o comportamento de validação e naming.

Corrija para separador duplo.

### Parte 5 — Dado de referencia

Crie migration para um novo Produto de referência.

Não use `ON CONFLICT` para esconder erro de versão.

A migration deve executar uma vez.

### Parte 6 — Baseline errado

Em database descartável, tente baseline com versão maior que as migrations futuras.

Observe quais arquivos ficam ignorados.

Descarte o database e documente o risco.

### Parte 7 — Checksum

Altere uma migration aplicada, valide a falha e restaure.

Não use repair.

Explique por que restaurar é superior.

### Parte 8 — Pipeline conceitual

Desenhe:

```text
validate;

migrate em ambiente controlado;

teste da aplicação;

deploy;

monitoramento.
```

Não configure CI nesta aula.

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 322 existe;
- continuidade com a aula 321 foi preservada;
- projeto Maven usa Java 21;
- Flyway Maven Plugin 12.5.0 foi fixado;
- módulo PostgreSQL foi adicionado;
- pgJDBC permanece fixado;
- configuração local está fora do Git;
- senha não aparece no pom;
- senha não é passada na linha de comando;
- database principal do laboratório é isolado;
- database legacy é isolado;
- database repair é descartável;
- schema oficial não foi alterado;
- migrations ficam em `db/migration`;
- migration V1 foi criada;
- migration V2 foi criada;
- migration V3 foi criada;
- migration V4 foi criada;
- migration repetível foi criada;
- convenção usa separador duplo;
- migrations versionadas têm versões únicas;
- `flyway_schema_history` foi criada;
- histórico possui quatro versionadas;
- histórico possui uma repetível;
- todas as migrations têm sucesso;
- `info` foi executado;
- `validate` foi executado;
- `migrate` foi executado;
- segundo migrate não reaplicou versionadas;
- view foi criada;
- dois Clientes foram inseridos;
- dois Produtos foram inseridos;
- duas Ordens foram inseridas;
- origem de criação foi adicionada com evolução segura;
- checksum foi observado;
- alteração de arquivo aplicado falhou no validate;
- arquivo original foi restaurado;
- baseline foi executado em legado;
- baseline versão um foi registrado;
- migrations V2 e V3 legacy foram aplicadas;
- dado legado foi preservado;
- baselineOnMigrate ficou false;
- outOfOrder ficou false;
- cleanDisabled ficou true;
- `flyway:clean` não foi usado;
- repair ocorreu somente em database descartável;
- efeito do repair foi documentado;
- database repair foi removido;
- teste de integração verificou schema;
- scripts validam códigos de saída;
- scripts removem variáveis no finally;
- documentação foi criada;
- nenhum Spring foi usado;
- nenhum JPA ou Hibernate foi antecipado;
- databases do laboratório podem ser removidos;
- `formacao_java` permanece intacto;
- ponte para a aula 323 está correta;
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
config/flyway.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-322-flyway-pratica-maven
```

Commit recomendado:

```powershell
git commit -m "feat(m13): versionar schema com flyway e maven"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
migrations versionadas;

migration repetível;

schema history;

checksum;

baseline;

validate;

migrate;

repair controlado.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você colocou a evolução do banco dentro do ciclo versionado do projeto.

Aprendeu:

```text
migration versionada;

migration repetível;

convenção V__;

convenção R__;

schema history;

checksum;

info;

validate;

migrate;

baseline;

repair;

clean desabilitado;

configuração segura.
```

O laboratório comprovou:

```text
schema criado do zero;

migrations aplicadas em ordem;

segunda execução sem repetição;

view repetível;

checksum protegido;

legado incorporado por baseline;

repair isolado em database descartável;

schema oficial preservado.
```

Agora existe uma base versionada para as tecnologias de persistência de alto nível.

A próxima aula será:

```text
323 - M13.13 - JPA conceitos fundamentais
```

Nela, você começará a estudar:

- especificação JPA;
- Jakarta Persistence;
- provider;
- entidade;
- `EntityManager`;
- persistence unit;
- persistence context;
- identidade;
- estados transient, managed, detached e removed;
- operações `persist`, `find`, `merge` e `remove`;
- diferença entre JPA e Hibernate;
- relação entre ORM, JDBC e SQL;
- primeiro projeto sem Spring.

Flyway continuará responsável pelo schema.

JPA passará a cuidar do mapeamento e do ciclo de vida das entidades.

---

# Material complementar

## Checkpoint final

- [ ] Executei migrations versionadas e repetíveis.
- [ ] Inspecionei a tabela de histórico e checksums.
- [ ] Pratiquei baseline em banco legado isolado.
- [ ] Usei repair somente em base descartável.
- [ ] Mantive schema oficial e segredos protegidos.

---

## Troubleshooting adicional

### No database found to handle URL

Confirme o módulo:

```text
flyway-database-postgresql.
```

### No suitable driver

Confirme o pgJDBC nas dependências do plugin.

### Validate failed checksum mismatch

Restaure o arquivo aplicado e crie nova migration para a mudança desejada.

### Non-empty schema without schema history

Analise baseline explicitamente.

Não ative baseline automático sem auditoria.

### Migration aplicada nao aparece

Confirme location, nome do arquivo e database conectado.

---

## Perguntas de revisao

1. O que é uma migration?
2. Qual padrão de uma versionada?
3. Qual padrão de uma repetível?
4. Quando versionada executa novamente?
5. Quando repetível executa novamente?
6. Para que serve schema history?
7. O que é checksum?
8. Pode editar V1 aplicada?
9. O que faz `info`?
10. O que faz `validate`?
11. O que faz `migrate`?
12. O que faz baseline?
13. Baseline cria a estrutura antiga?
14. O que faz repair?
15. Repair corrige objetos?
16. Por que clean está desabilitado?
17. Onde ficam migrations?
18. Onde fica a senha?
19. JPA foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Mudança versionada do banco.
2. `Vversao__descricao.sql`.
3. `R__descricao.sql`.
4. Nunca, após sucesso.
5. Quando o checksum muda.
6. Registrar migrations aplicadas.
7. Identificador do conteúdo.
8. Não.
9. Mostra estado das migrations.
10. Compara arquivos e histórico.
11. Aplica pendências.
12. Registra ponto inicial legado.
13. Não.
14. Repara metadados.
15. Não.
16. É destrutivo.
17. Em `src/main/resources/db/migration`.
18. Em configuração local ignorada.
19. Não.
20. JPA conceitos fundamentais.

---

## Desafio opcional

Crie um verificador Java:

```java
SchemaVersionGuard
```

Ele deve consultar:

```text
flyway_schema_history.
```

Entrada:

```text
versão mínima esperada.
```

Saída:

```text
atual;

válido;

migrations com falha;

última execução.
```

Regras:

- somente leitura;
- sem executar migrate;
- sem alterar tabela;
- sem senha em log;
- testes de integração;
- não substituir `flyway:validate`.

O objetivo é entender como uma aplicação pode expor diagnóstico de versão sem assumir a responsabilidade de migrar automaticamente.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 322 - M13.12 - Flyway na pratica com Maven

- Entendi o problema de scripts SQL soltos.
- Configurei Flyway Maven Plugin 12.5.0.
- Adicionei o módulo PostgreSQL do Flyway.
- Mantive pgJDBC como driver.
- Criei uma base isolada para migrations.
- Criei migrations V1, V2, V3 e V4.
- Criei uma migration repetível para view.
- Entendi a convenção `V__` e `R__`.
- Executei `flyway:info`.
- Executei `flyway:validate`.
- Executei `flyway:migrate`.
- Confirmei que versionadas rodam uma vez.
- Confirmei que repetíveis dependem do checksum.
- Inspecionei `flyway_schema_history`.
- Entendi o checksum de migration.
- Demonstrei falha ao editar migration aplicada.
- Restaurei o arquivo original.
- Mantive migrations aplicadas imutáveis.
- Preparei um banco legado isolado.
- Executei baseline explícito na versão um.
- Apliquei migrations posteriores ao baseline.
- Mantive `baselineOnMigrate` desativado.
- Mantive `outOfOrder` desativado.
- Mantive `clean` desabilitado.
- Usei repair somente em base descartável.
- Entendi que repair não corrige o schema.
- Mantive senha fora do Git e da linha de comando.
- Preservei `projeto_os_final`.
- Não antecipei Spring, JPA ou Hibernate.
- Próxima aula: JPA conceitos fundamentais.
```

---

## Referencia tecnica curta

```text
Flyway:
versionamento de banco.

V:
migration versionada.

R:
migration repetível.

checksum:
assinatura do conteúdo.

history:
registro das execuções.

info:
estado.

validate:
consistência.

migrate:
aplicar pendências.

baseline:
adotar legado.

repair:
ajustar metadados.

clean:
destrutivo e desabilitado.
```

Regra final:

```text
usar Flyway profissionalmente significa versionar cada evolucao, manter migrations aplicadas imutaveis, validar checksums, tratar baseline e repair como decisoes operacionais e impedir que segredos ou comandos destrutivos entrem no fluxo comum.
```
