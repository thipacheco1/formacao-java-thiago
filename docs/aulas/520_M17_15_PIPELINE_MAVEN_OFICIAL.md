# 520 - M17.15 - Pipeline Maven

## Apresentação da aula

Na aula 519, você criou o primeiro workflow real do GitHub Actions.

O repositório passou a possuir:

```text
.github/workflows/ci-foundation.yml;

triggers;

permissions;

concurrency;

metadata;

verify;

outputs;

cache;

artifacts;

summary.
```

O job principal executou:

```text
./mvnw
--batch-mode
--no-transfer-progress
clean
verify
```

Esse comando funcionou como uma baseline segura.

Entretanto, ainda falta compreender com profundidade o que o Maven faz dentro desse comando.

A pergunta central desta aula será:

```text
como transformar
o Maven

em uma sequência explícita
de compilação,
testes,
integração,
empacotamento
e evidências

adequada para CI?
```

A resposta começa no lifecycle do Maven.

Maven não executa apenas comandos isolados.

Ele organiza o build por:

```text
lifecycles;

phases;

plugins;

goals;

profiles;

properties.
```

Quando você executa:

```text
mvn verify
```

o Maven percorre todas as fases anteriores do lifecycle padrão até chegar em `verify`.

Isso inclui, entre outras:

```text
validate;

compile;

test;

package;

verify.
```

O detalhe importante é:

```text
fases não executam trabalho sozinhas;

plugins ligados às fases
executam goals.
```

Exemplo:

```text
maven-compiler-plugin
compila.

maven-surefire-plugin
executa testes unitários.

maven-failsafe-plugin
executa testes de integração.

maven-jar-plugin
empacota JAR.

spring-boot-maven-plugin
reempacota o aplicativo.
```

Nesta aula, o pipeline Maven será estruturado para produzir três níveis de validação.

#### Validação rápida

Executa:

```text
compilação;

testes unitários;

testes de arquitetura;

validações leves.
```

Objetivo:

```text
feedback rápido.
```

#### Validação de integração

Executa:

```text
testes com contexto Spring;

PostgreSQL real;

Kafka quando necessário;

Flyway;

Testcontainers;

integrações controladas.
```

Objetivo:

```text
validar fronteiras reais.
```

#### Verificação completa

Executa:

```text
unitários;

integração;

empacotamento;

validações pós-integração;

relatórios.
```

Objetivo:

```text
produzir um candidato verificável.
```

A aula diferenciará:

```text
test;

verify;

package;

install;

deploy.
```

#### `test`

Executa até a fase de testes unitários.

Não executa necessariamente o Failsafe completo.

#### `package`

Cria o artefato, como o JAR.

#### `verify`

Executa verificações após os testes de integração.

É a fase recomendada para o gate completo.

#### `install`

Instala o artefato no repositório Maven local.

Em CI, isso pode ser necessário em projetos multimódulo específicos.

Não deve ser usado por hábito.

#### `deploy`

Publica o artefato em um repositório remoto Maven.

Não será executado nesta aula.

Outro ponto central será a separação entre:

```text
Surefire;

Failsafe.
```

Surefire normalmente executa testes unitários durante:

```text
test.
```

Failsafe executa testes de integração durante:

```text
integration-test;

post-integration-test;

verify.
```

Essa separação é importante porque testes de integração podem precisar:

- iniciar containers;
- aguardar banco;
- aplicar migrations;
- preparar dados;
- encerrar recursos;
- coletar relatórios;
- falhar somente em `verify`.

Se o pipeline executar apenas:

```text
mvn test
```

ele pode não executar os testes de integração configurados no Failsafe.

A aula utilizará convenções de nomes.

Unitários:

```text
*Test.java;

*Tests.java;

*TestCase.java.
```

Integração:

```text
*IT.java;

*ITCase.java.
```

O projeto já possui testes com contexto e Testcontainers.

Nem todo teste Spring precisa virar teste de integração.

A classificação deve observar:

- dependências externas;
- tempo;
- isolamento;
- objetivo;
- custo;
- necessidade de infraestrutura.

Um teste que inicializa um contexto pequeno ainda pode permanecer no conjunto unitário quando é rápido e isolado.

A aula também criará profiles Maven:

```text
ci-fast;

ci-integration;

ci-full.
```

#### `ci-fast`

Usado para feedback rápido.

Executa unitários e verificações leves.

Não executa Failsafe.

#### `ci-integration`

Executa testes de integração.

Pode pular unitários quando o pipeline já os executou em outro job.

#### `ci-full`

Executa tudo.

Serve para validação final e reprodução local.

Esses profiles não devem mudar a semântica do código.

Eles controlam:

- grupos de testes;
- plugins;
- propriedades;
- relatórios;
- timeouts.

Outro ponto será:

```text
não duplicar trabalho sem intenção.
```

Se jobs separados executam:

```text
job A:
mvn test.

job B:
mvn verify.
```

o job B executará os testes unitários novamente.

Isso pode ser aceitável para simplicidade.

Mas o custo precisa ser conhecido.

Alternativas:

- separar unit e integration;
- usar `-DskipTests` em fases específicas;
- usar `-DskipITs`;
- usar profiles;
- produzir artifact do JAR;
- manter uma validação completa final.

Nesta aula, a estratégia será:

```text
PR:

ci-fast;

main:

ci-fast
e
ci-integration;

gate final:

ci-full.
```

O workflow será atualizado com jobs:

```text
maven-unit;

maven-integration;

maven-package;

maven-summary.
```

Entretanto, a aula ainda não criará gates de cobertura.

Não haverá:

- JaCoCo threshold;
- branch coverage mínima;
- line coverage mínima;
- mutation testing;
- Sonar quality gate;
- falha por cobertura.

Esses temas pertencem à aula 521:

```text
Pipeline testes cobertura quality gate.
```

A aula 520 preparará os relatórios necessários.

Serão preservados:

```text
Surefire reports;

Failsafe reports;

JAR;

Maven logs resumidos;

informações do build.
```

A aula também aprofundará o cache Maven.

O cache contém dependências baixadas para:

```text
~/.m2/repository.
```

Ele pode acelerar a execução.

Entretanto, o pipeline não pode depender de cache para funcionar.

Uma execução com cache vazio precisa produzir o mesmo resultado funcional.

O cache também precisa ser invalidado quando mudam:

- `pom.xml`;
- POMs de módulos;
- `.mvn/extensions.xml`;
- `.mvn/maven.config`;
- wrapper quando relevante;
- settings quando controlado.

Outro princípio será:

```text
o Maven Wrapper
é parte do build.
```

Os arquivos esperados incluem:

```text
mvnw;

mvnw.cmd;

.mvn/wrapper/maven-wrapper.properties;

.mvn/wrapper/maven-wrapper.jar
ou
download controlado
conforme a distribuição usada.
```

A versão do Maven precisa ser observável.

O pipeline deverá registrar:

```text
Java version;

Maven version;

OS;

commit;

profile;

goals.
```

A aula também tratará de properties de linha de comando.

Exemplos:

```text
-DskipTests;

-Dmaven.test.skip=true;

-DskipITs;

-Dspring.profiles.active=test;

-Dtest=NomeDoTeste;

-Dit.test=NomeDoIT.
```

Essas propriedades não são equivalentes.

#### `-DskipTests`

Compila testes, mas não os executa.

#### `-Dmaven.test.skip=true`

Pode pular compilação e execução de testes.

Usar isso sem intenção reduz confiança.

#### `-DskipITs`

Pode ser configurado para pular testes Failsafe.

A propriedade precisa existir na configuração do projeto.

A aula também definirá timeouts e paralelismo com cuidado.

Testes paralelos podem reduzir duração.

Também podem revelar ou criar problemas de:

- dados compartilhados;
- portas;
- Testcontainers;
- ordem;
- singleton;
- relógio;
- estado estático;
- arquivos temporários.

A baseline não ativará paralelismo agressivo.

Primeiro, o pipeline será determinístico.

A aula seguinte poderá usar relatórios para decidir melhorias.

O workflow final desta aula terá dois jobs de teste executando em paralelo após metadata:

```text
maven-unit;

maven-integration.
```

Depois:

```text
maven-package
```

dependerá dos dois.

O job de package não executará novamente os testes.

Ele utilizará:

```text
-DskipTests;

-DskipITs;
```

somente porque os jobs anteriores já passaram.

Essa decisão será documentada.

O JAR será publicado como artifact.

Esse JAR ainda não será promovido para produção.

A imagem Docker e publicação em registry serão aprofundadas em aulas seguintes.

A próxima aula será:

```text
521 - M17.16 - Pipeline testes cobertura quality gate
```

Ela utilizará a estrutura desta aula para adicionar:

- cobertura;
- thresholds;
- quality gates;
- relatórios consolidados;
- bloqueios quantitativos;
- critérios de exclusão.

Ao final, você deverá explicar:

```text
como o lifecycle Maven funciona;

a diferença entre phase
e goal;

a diferença entre
Surefire e Failsafe;

por que verify
é mais completo que test;

como profiles
organizam o pipeline;

quando usar skipTests;

por que cache
não é artifact;

como separar jobs;

como preservar relatórios;

como evitar
reexecução acidental.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
518:
CI CD profissional visao geral.

519:
GitHub Actions workflows.

520:
Pipeline Maven.

521:
Pipeline testes cobertura quality gate.

522:
Analise estatica e vulnerabilidades.
```

A aula 519 respondeu:

```text
como estruturar
workflows reais
no GitHub Actions?
```

A aula 520 responderá:

```text
como organizar
o build Maven
dentro desses workflows?
```

Nesta aula:

```text
Maven lifecycle:
sim.

phases:
sim.

goals:
sim.

Wrapper:
sim.

Surefire:
sim.

Failsafe:
sim.

profiles:
sim.

unit jobs:
sim.

integration jobs:
sim.

package job:
sim.

artifacts:
sim.

cache:
sim.

relatórios:
sim.

timeouts:
sim.

seleção de testes:
sim.

coverage gate:
não.

JaCoCo threshold:
não.

Sonar:
não.

vulnerability scan:
não.

registry:
não.

deploy:
não.
```

A regra central será:

```text
cada fase Maven
precisa ter
objetivo,
entrada,
saída,
relatório
e gate explícitos.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão revisados ou criados:

```text
pom.xml
.github/workflows/ci-foundation.yml

.mvn
├── maven.config
└── ci
    ├── fast.config
    ├── integration.config
    └── full.config

scripts/maven-pipeline
├── verify-maven-wrapper.ps1
├── run-maven-fast.ps1
├── run-maven-integration.ps1
├── run-maven-full.ps1
├── inspect-maven-reports.ps1
└── verify-maven-artifact.ps1

docs/devops/maven-pipeline
├── MAVEN_LIFECYCLE.md
├── MAVEN_TEST_CLASSIFICATION.md
├── MAVEN_PROFILE_POLICY.md
├── MAVEN_CACHE_POLICY.md
├── MAVEN_REPORT_POLICY.md
├── MAVEN_PIPELINE_GRAPH.md
├── MAVEN_LOCAL_RUNBOOK.md
├── MAVEN_TEST_MATRIX.md
└── MAVEN_PIPELINE_TROUBLESHOOTING.md
```

O workflow será evoluído para:

```text
metadata;

maven-unit;

maven-integration;

maven-package;

maven-summary.
```

Ao final, você terá:

```text
lifecycle documentado;

testes classificados;

profiles Maven;

jobs paralelos;

relatórios unitários;

relatórios de integração;

JAR versionado;

artifact publicado;

scripts locais;

workflow atualizado.
```

Você irá:

1. confirmar a baseline;
2. validar Wrapper;
3. revisar lifecycle;
4. revisar plugins;
5. classificar testes;
6. configurar Surefire;
7. configurar Failsafe;
8. criar propriedade `skipITs`;
9. criar profile fast;
10. criar profile integration;
11. criar profile full;
12. criar scripts locais;
13. executar fast;
14. executar integration;
15. executar full;
16. revisar relatórios;
17. atualizar workflow;
18. criar job unit;
19. criar job integration;
20. executar jobs em paralelo;
21. criar job package;
22. evitar reexecução;
23. publicar JAR;
24. publicar relatórios;
25. criar summary;
26. simular falhas;
27. validar cache;
28. documentar;
29. executar gate;
30. commitar;
31. preparar a aula 521.

---

## Conceito essencial

### Lifecycle

Maven possui lifecycles principais.

Os mais conhecidos são:

```text
clean;

default;

site.
```

O lifecycle `default` cobre build e entrega.

---

### Phase

Phase representa um ponto do lifecycle.

Exemplos:

```text
validate;

compile;

test;

package;

integration-test;

verify;

install;

deploy.
```

Executar uma fase executa as fases anteriores do mesmo lifecycle.

---

### Goal

Goal é uma ação de um plugin.

Exemplo:

```text
surefire:test;

failsafe:integration-test;

compiler:compile.
```

Um goal pode estar ligado a uma phase.

---

### Plugin execution

A configuração de um plugin pode declarar:

- id;
- goals;
- phase;
- configuration.

Isso torna o build reproduzível.

---

### Surefire

Executa testes do conjunto unitário.

Relatórios:

```text
target/surefire-reports.
```

A falha interrompe o build na fase `test`.

---

### Failsafe

Executa testes de integração.

Goals:

```text
integration-test;

verify.
```

Relatórios:

```text
target/failsafe-reports.
```

A verificação final ocorre em `verify`.

---

### Convenção de nomes

Baseline:

```text
unitários:

*Test;
*Tests;
*TestCase.

integração:

*IT;
*ITCase.
```

Não renomeie mecanicamente sem revisar intenção.

---

### Profile

Profile ativa configuração condicional.

Pode ser ativado por:

```text
-Pci-fast.
```

Profiles não devem esconder dependências necessárias ao build normal.

---

### Maven property

Properties podem controlar plugins.

Exemplo:

```xml
<skipITs>false</skipITs>
```

Linha de comando:

```text
-DskipITs=true.
```

---

### Reactor

Em projeto multimódulo, o Maven constrói um reactor.

Opções como:

```text
-pl;

-am;

-amd.
```

selecionam módulos.

O laboratório atual é tratado como um módulo único.

---

### Local repository

Dependências ficam em:

```text
~/.m2/repository.
```

O cache desse diretório acelera downloads.

---

### Batch mode

```text
--batch-mode
```

remove prompts interativos.

É adequado ao CI.

---

### No transfer progress

```text
--no-transfer-progress
```

reduz ruído de download.

Logs importantes continuam disponíveis.

---

### Fail at end

```text
--fail-at-end
```

em projetos multimódulo permite continuar outros módulos independentes.

Não será usado na baseline de módulo único.

---

### Test selection

Surefire:

```text
-Dtest=NomeDoTeste.
```

Failsafe:

```text
-Dit.test=NomeDoIT.
```

Seleção é útil para diagnóstico.

Não substitui a suíte completa no gate final.

---

### Report preservation

Relatórios precisam sobreviver à falha do job.

Por isso, o upload usa:

```text
if: always().
```

---

### Package without tests

Depois de jobs de teste aprovados:

```text
mvn package
-DskipTests
-DskipITs.
```

Essa otimização só é segura quando o grafo garante os testes anteriores.

---

### Determinism

O mesmo commit, JDK, Maven e configuração precisam produzir o mesmo comportamento de teste.

Flaky tests quebram a confiança do pipeline.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  clean `
  verify
```

---

### 2. Validar os arquivos do Wrapper

Confirme:

```text
mvnw;

mvnw.cmd;

.mvn/wrapper/maven-wrapper.properties.
```

Execute:

```powershell
.\mvnw.cmd `
  --version
```

Registre:

- Maven;
- Java;
- OS;
- encoding;
- local repository.

---

### 3. Criar script do Wrapper

Arquivo:

```text
scripts/maven-pipeline/verify-maven-wrapper.ps1
```

Valide:

- arquivos;
- distribution URL;
- checksum quando configurado;
- execução;
- Maven version;
- JDK 21;
- ausência de Maven global obrigatório.

---

### 4. Revisar plugins no POM

Confirme:

- compiler;
- Surefire;
- Failsafe;
- Spring Boot;
- Flyway;
- plugins de teste existentes.

Não adicione versão arbitrária fora do gerenciamento adotado sem necessidade.

---

### 5. Configurar propriedades

No `pom.xml`:

```xml
<properties>
    <java.version>21</java.version>

    <skipITs>false</skipITs>

    <maven.compiler.release>
        21
    </maven.compiler.release>
</properties>
```

Mantenha a formatação do projeto.

---

### 6. Configurar Surefire

Exemplo:

```xml
<plugin>
    <groupId>
        org.apache.maven.plugins
    </groupId>

    <artifactId>
        maven-surefire-plugin
    </artifactId>

    <configuration>
        <failIfNoTests>
            true
        </failIfNoTests>

        <useModulePath>
            false
        </useModulePath>
    </configuration>
</plugin>
```

Use `useModulePath=false` somente se o projeto realmente precisa dessa configuração.

Não copie sem validar.

---

### 7. Configurar Failsafe

```xml
<plugin>
    <groupId>
        org.apache.maven.plugins
    </groupId>

    <artifactId>
        maven-failsafe-plugin
    </artifactId>

    <executions>
        <execution>
            <id>
                integration-tests
            </id>

            <goals>
                <goal>
                    integration-test
                </goal>

                <goal>
                    verify
                </goal>
            </goals>
        </execution>
    </executions>

    <configuration>
        <skipITs>
            ${skipITs}
        </skipITs>

        <failIfNoTests>
            true
        </failIfNoTests>
    </configuration>
</plugin>
```

---

### 8. Classificar testes

Crie:

```text
MAVEN_TEST_CLASSIFICATION.md
```

Para cada conjunto, registre:

- nome;
- tipo;
- dependência;
- tempo;
- infraestrutura;
- plugin;
- relatório.

---

### 9. Renomear integração quando necessário

Exemplos:

```text
FlywayExpandMigrationIT;

OldVersionCompatibilityIT;

NewVersionCompatibilityIT;

ProviderVariantBackfillIT.
```

Atualize referências e packages.

Não renomeie testes puramente unitários.

---

### 10. Criar profile `ci-fast`

No POM:

```xml
<profile>
    <id>
        ci-fast
    </id>

    <properties>
        <skipITs>
            true
        </skipITs>
    </properties>
</profile>
```

Comando:

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-fast `
  clean `
  test
```

---

### 11. Criar profile `ci-integration`

```xml
<profile>
    <id>
        ci-integration
    </id>

    <properties>
        <skipITs>
            false
        </skipITs>
    </properties>
</profile>
```

Comando:

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-integration `
  -DskipTests `
  clean `
  verify
```

A configuração precisa garantir que `-DskipTests` não desabilita Failsafe no projeto.

Teste essa interação.

Quando necessário, use propriedades separadas.

---

### 12. Criar profile `ci-full`

```xml
<profile>
    <id>
        ci-full
    </id>

    <properties>
        <skipITs>
            false
        </skipITs>
    </properties>
</profile>
```

Comando:

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-full `
  clean `
  verify
```

---

### 13. Criar arquivos de argumentos documentais

Diretório:

```text
.mvn/ci.
```

Arquivo:

```text
fast.config.
```

Conteúdo:

```text
--batch-mode
--no-transfer-progress
-Pci-fast
clean
test
```

Esses arquivos são documentação operacional.

O Maven não os lê automaticamente nesse caminho.

Os scripts podem lê-los.

---

### 14. Criar script fast

Arquivo:

```text
run-maven-fast.ps1
```

Responsabilidades:

- validar Wrapper;
- limpar target;
- executar profile fast;
- medir duração;
- localizar Surefire;
- retornar exit code.

---

### 15. Criar script integration

Arquivo:

```text
run-maven-integration.ps1
```

Responsabilidades:

- validar Docker;
- validar Testcontainers;
- executar profile;
- localizar Failsafe;
- medir containers;
- limpar recursos;
- retornar exit code.

---

### 16. Criar script full

Arquivo:

```text
run-maven-full.ps1
```

Executa:

```text
clean verify
-Pci-full.
```

Esse script é a referência local do gate final Maven.

---

### 17. Executar fast

```powershell
.\scripts\maven-pipeline\run-maven-fast.ps1
```

Confirme:

- unitários executados;
- integração não executada;
- Surefire criado;
- Failsafe ausente ou sem execução;
- duração registrada.

---

### 18. Executar integration

```powershell
.\scripts\maven-pipeline\run-maven-integration.ps1
```

Confirme:

- PostgreSQL Testcontainer;
- migrations;
- testes `*IT`;
- Failsafe;
- cleanup.

---

### 19. Executar full

```powershell
.\scripts\maven-pipeline\run-maven-full.ps1
```

Confirme todos os conjuntos.

---

### 20. Criar script de reports

Arquivo:

```text
inspect-maven-reports.ps1
```

Conte:

- tests;
- failures;
- errors;
- skipped;
- duration;
- files.

Não consolide cobertura.

---

### 21. Criar script de artifact

Arquivo:

```text
verify-maven-artifact.ps1
```

Valide:

- JAR existe;
- nome esperado;
- tamanho maior que zero;
- conteúdo;
- manifesto;
- Main-Class quando aplicável;
- nenhum secret;
- nenhum arquivo local inesperado.

---

### 22. Atualizar workflow

Substitua o job `verify` por jobs específicos.

Mantenha `metadata`.

---

### 23. Criar job unit

```yaml
  maven-unit:
    name:
      Maven unit tests

    needs:
      - metadata

    runs-on:
      ubuntu-latest

    timeout-minutes:
      15

    steps:
      - name:
          Checkout repository

        uses:
          actions/checkout@v6

      - name:
          Set up Java 21

        uses:
          actions/setup-java@v5

        with:
          distribution:
            temurin

          java-version:
            "21"

          cache:
            maven

          cache-dependency-path:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml

      - name:
          Run unit tests

        run: |
          set -Eeuo pipefail

          chmod +x mvnw

          ./mvnw \
            --batch-mode \
            --no-transfer-progress \
            -Pci-fast \
            clean \
            test
```

---

### 24. Publicar Surefire

```yaml
      - name:
          Upload Surefire reports

        if:
          always()

        uses:
          actions/upload-artifact@v4

        with:
          name:
            surefire-${{ needs.metadata.outputs.short_sha }}

          path:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/surefire-reports/**

          if-no-files-found:
            error

          retention-days:
            14
```

---

### 25. Criar job integration

O job executa em paralelo com unit.

```yaml
  maven-integration:
    name:
      Maven integration tests

    needs:
      - metadata

    runs-on:
      ubuntu-latest

    timeout-minutes:
      30
```

Use checkout e setup-java.

---

### 26. Executar Failsafe

```yaml
      - name:
          Run integration tests

        run: |
          set -Eeuo pipefail

          chmod +x mvnw

          ./mvnw \
            --batch-mode \
            --no-transfer-progress \
            -Pci-integration \
            -DskipTests \
            clean \
            verify
```

Valide no projeto que unitários foram realmente pulados e ITs executados.

---

### 27. Publicar Failsafe

```yaml
      - name:
          Upload Failsafe reports

        if:
          always()

        uses:
          actions/upload-artifact@v4

        with:
          name:
            failsafe-${{ needs.metadata.outputs.short_sha }}

          path:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/failsafe-reports/**

          if-no-files-found:
            error

          retention-days:
            14
```

---

### 28. Criar job package

```yaml
  maven-package:
    name:
      Package verified application

    needs:
      - metadata
      - maven-unit
      - maven-integration

    runs-on:
      ubuntu-latest

    timeout-minutes:
      15
```

Esse job só começa quando os testes passam.

---

### 29. Empacotar sem repetir testes

```yaml
      - name:
          Package application

        run: |
          set -Eeuo pipefail

          chmod +x mvnw

          ./mvnw \
            --batch-mode \
            --no-transfer-progress \
            -Pci-full \
            -DskipTests \
            -DskipITs \
            clean \
            package
```

Essa otimização depende do grafo.

---

### 30. Verificar JAR

Execute script ou comando:

```yaml
      - name:
          Verify JAR

        run: |
          set -Eeuo pipefail

          jar_file="$(
            find target \
              -maxdepth 1 \
              -type f \
              -name '*.jar' \
              ! -name '*.original' \
              | head -n 1
          )"

          test -n "${jar_file}"

          test -s "${jar_file}"

          echo "jar_file=${jar_file}" \
            >> "${GITHUB_OUTPUT}"
```

Para publicar output, o step precisa de `id`.

---

### 31. Publicar JAR

```yaml
      - name:
          Upload application JAR

        uses:
          actions/upload-artifact@v4

        with:
          name:
            application-jar-${{ needs.metadata.outputs.short_sha }}

          path:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/*.jar

          if-no-files-found:
            error

          retention-days:
            14
```

Exclua `.original` quando necessário.

---

### 32. Atualizar summary

O job final precisa depender de:

```text
maven-unit;

maven-integration;

maven-package.
```

Com `if: always()`.

Ele falha quando qualquer gate obrigatório falha.

---

### 33. Criar grafo documentado

Arquivo:

```text
MAVEN_PIPELINE_GRAPH.md
```

Diagrama:

```text
metadata
   |
   +---------> maven-unit --------+
   |                              |
   +---------> maven-integration -+--> maven-package
                                            |
                                            v
                                      maven-summary
```

---

### 34. Criar política de cache

Arquivo:

```text
MAVEN_CACHE_POLICY.md
```

Inclua:

- conteúdo;
- chave;
- invalidação;
- miss;
- segurança;
- limpeza;
- diferença para artifact.

---

### 35. Criar política de reports

Arquivo:

```text
MAVEN_REPORT_POLICY.md
```

Inclua:

- Surefire;
- Failsafe;
- retenção;
- privacy;
- upload em falha;
- naming;
- ausência de dumps sensíveis.

---

### 36. Criar matriz de testes

Arquivo:

```text
MAVEN_TEST_MATRIX.md
```

Cenários:

- unit passa;
- unit falha;
- integration passa;
- integration falha;
- nenhum unit encontrado;
- nenhum IT encontrado;
- Testcontainers indisponível;
- migration falha;
- package falha;
- JAR ausente;
- cache miss;
- cache hit;
- job cancelado.

---

### 37. Simular falha unitária

Confirme:

- maven-unit falha;
- Surefire sobe;
- maven-package não inicia;
- integration pode continuar;
- summary falha.

Restaure.

---

### 38. Simular falha de integração

Confirme:

- Failsafe sobe;
- package não inicia;
- unit pode passar;
- summary falha.

Restaure.

---

### 39. Simular JAR ausente

Altere temporariamente a seleção do JAR no script.

Confirme o gate.

Restaure.

---

### 40. Criar troubleshooting

Arquivo:

```text
MAVEN_PIPELINE_TROUBLESHOOTING.md
```

Inclua:

- profile não ativa;
- IT não executa;
- unit executa duas vezes;
- `skipTests` pula IT;
- Failsafe não falha verify;
- nenhum relatório;
- Testcontainers sem Docker;
- cache corrompido;
- JAR original selecionado;
- artifact vazio;
- timeout;
- memória;
- encoding;
- diferença Windows/Linux.

---

### 41. Executar gate final

Localmente:

```powershell
.\scripts\maven-pipeline\verify-maven-wrapper.ps1

.\scripts\maven-pipeline\run-maven-fast.ps1

.\scripts\maven-pipeline\run-maven-integration.ps1

.\scripts\maven-pipeline\run-maven-full.ps1

.\scripts\maven-pipeline\inspect-maven-reports.ps1

.\scripts\maven-pipeline\verify-maven-artifact.ps1
```

Depois:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### O Maven ganhou fases explícitas

O pipeline deixou de depender de um único comando opaco.

### Unitários e integração foram separados

Surefire e Failsafe receberam responsabilidades claras.

### Profiles ganharam propósito

Fast, integration e full representam cenários de CI.

### Jobs paralelos reduziram o caminho crítico

Unit e integration podem executar simultaneamente.

### O package passou a depender dos gates

O JAR só é produzido depois dos testes.

### Reexecução foi evitada conscientemente

Skip só foi usado porque o grafo já garantiu os testes.

### Relatórios ficaram especializados

Surefire e Failsafe possuem artifacts próprios.

### O JAR virou saída verificável

Nome, tamanho e conteúdo foram inspecionados.

### O cache permaneceu descartável

A execução continua correta sem cache.

### A próxima aula ganhou relatórios confiáveis

Cobertura e quality gates poderão ser adicionados sobre essa base.

---

## Erros comuns importantes

### Executar apenas `mvn test`

Failsafe pode não executar.

### Usar `install` sem necessidade

O repositório local recebe artefato que o pipeline não usa.

### Usar `deploy` no job de teste

Publicação fica misturada com verificação.

### Usar `maven.test.skip=true`

Testes podem nem ser compilados.

### Confiar em `skipTests` sem testar Failsafe

Os ITs podem ser pulados.

### Renomear todos os testes para IT

A suíte rápida perde valor.

### Fazer package em paralelo aos testes

Um JAR pode ser publicado antes dos gates.

### Reexecutar tudo em cada job

Custo cresce sem intenção.

### Não usar failIfNoTests

Pipeline verde pode executar zero testes.

### Publicar target inteiro

Arquivos desnecessários ou sensíveis podem entrar no artifact.

### Ativar paralelismo cedo

Flakiness e disputa por recursos aumentam.

### Antecipar cobertura

A aula 521 possui esse objetivo.

---

## Comandos úteis

### Fast

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-fast `
  clean `
  test
```

### Integration

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-integration `
  -DskipTests `
  clean `
  verify
```

### Full

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-full `
  clean `
  verify
```

### Selecionar unitário

```powershell
.\mvnw.cmd `
  -Dtest=NotificationProviderReleaseFlagTest `
  test
```

### Selecionar integração

```powershell
.\mvnw.cmd `
  -Dit.test=FlywayExpandMigrationIT `
  verify
```

---

## Exercício guiado

### Parte 1 — Lifecycle

Mapeie phases e goals.

### Parte 2 — Classificação

Separe unit e integration.

### Parte 3 — Plugins

Configure Surefire e Failsafe.

### Parte 4 — Profiles

Crie fast, integration e full.

### Parte 5 — Scripts

Execute localmente.

### Parte 6 — Workflow

Crie jobs paralelos.

### Parte 7 — Package

Produza JAR após os testes.

### Parte 8 — Reports

Publique artifacts separados.

### Parte 9 — Falhas

Comprove o bloqueio do package.

### Parte 10 — Documentação

Registre cache, reports e grafo.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 519 foi preservada;
- Maven lifecycle foi explicado;
- lifecycle clean foi citado;
- lifecycle default foi citado;
- lifecycle site foi citado;
- phase foi definida;
- goal foi definido;
- plugin execution foi definida;
- validate foi citada;
- compile foi citada;
- test foi citada;
- package foi citada;
- integration-test foi citada;
- verify foi citada;
- install foi diferenciada;
- deploy foi diferenciada;
- Surefire foi configurado;
- Failsafe foi configurado;
- relatórios Surefire foram definidos;
- relatórios Failsafe foram definidos;
- convenções de nomes foram definidas;
- testes foram classificados;
- ITs foram renomeados quando necessário;
- Wrapper foi validado;
- Maven version foi registrada;
- JDK 21 foi validado;
- propriedades foram criadas;
- `skipITs` foi criado;
- `failIfNoTests` foi aplicado;
- profile ci-fast foi criado;
- ci-fast pula ITs;
- profile ci-integration foi criado;
- ci-integration executa ITs;
- interação com `skipTests` foi testada;
- profile ci-full foi criado;
- full executa tudo;
- arquivos `.mvn/ci` foram criados;
- arquivos foram classificados como documentação;
- script Wrapper foi criado;
- script fast foi criado;
- script integration foi criado;
- script full foi criado;
- script reports foi criado;
- script artifact foi criado;
- fast foi executado;
- unitários foram executados;
- ITs não executaram em fast;
- integration foi executado;
- Testcontainers foi usado;
- PostgreSQL real foi usado;
- migrations foram testadas;
- Failsafe foi gerado;
- full foi executado;
- todos os testes passaram;
- reports foram inspecionados;
- JAR foi verificado;
- workflow foi atualizado;
- job metadata foi preservado;
- job maven-unit foi criado;
- job maven-integration foi criado;
- jobs executam em paralelo;
- checkout foi usado em cada job;
- setup Java foi usado em cada job;
- cache Maven foi usado;
- job unit usa profile fast;
- Surefire artifact foi publicado;
- artifact usa `always()`;
- if-no-files-found error foi usado;
- job integration usa profile integration;
- Failsafe artifact foi publicado;
- job package depende dos dois;
- package não começa antes dos testes;
- package usa `--no-build` apenas em contexto de deploy, não foi confundido;
- package usa skip somente após gates;
- JAR foi localizado;
- JAR possui tamanho maior que zero;
- JAR artifact foi publicado;
- `.original` foi tratado;
- summary final foi atualizado;
- summary falha quando gate falha;
- grafo foi documentado;
- cache policy foi criada;
- report policy foi criada;
- test matrix foi criada;
- falha unitária foi simulada;
- Surefire foi preservado na falha;
- package não executou;
- falha de integração foi simulada;
- Failsafe foi preservado;
- package não executou;
- JAR ausente foi simulado;
- gate de artifact falhou;
- alterações temporárias foram restauradas;
- troubleshooting foi criado;
- cache foi diferenciado de artifact;
- batch mode foi usado;
- transfer progress foi reduzido;
- paralelismo agressivo não foi antecipado;
- coverage gate não foi implementado;
- JaCoCo threshold não foi implementado;
- Sonar não foi implementado;
- vulnerability scan não foi implementado;
- registry não foi usado;
- deploy não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 521 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  .github/workflows/ci-foundation.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.mvn/ci `
  scripts/maven-pipeline `
  docs/devops/maven-pipeline `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "ci(m17): estruturar pipeline Maven"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- target;
- Surefire local;
- Failsafe local;
- JAR local;
- cache Maven;
- `.env`;
- secret;
- banco;
- volume;
- relatórios baixados;
- cobertura da aula 521.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o workflow passou a compreender o lifecycle Maven.

A estrutura final ficou:

```text
metadata;

maven-unit;

maven-integration;

maven-package;

maven-summary.
```

Você comprovou que:

- phases percorrem o lifecycle;
- goals executam trabalho;
- Surefire cuida dos unitários;
- Failsafe cuida da integração;
- `verify` fecha o gate completo;
- profiles organizam cenários;
- fast reduz feedback;
- integration valida fronteiras reais;
- full reproduz o gate final;
- jobs paralelos reduzem duração;
- package depende dos testes;
- skip só é seguro quando o grafo garante validação;
- cache acelera;
- artifacts preservam relatórios e JAR;
- Maven Wrapper reduz dependência do runner;
- Testcontainers valida PostgreSQL real.

A próxima aula será:

```text
521 - M17.16 - Pipeline testes cobertura quality gate
```

Nela, você irá adicionar cobertura, consolidação de relatórios e gates quantitativos sem transformar métricas em objetivo vazio.

Nenhum quality gate de cobertura foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Entendi lifecycle, phases e goals.
- [ ] Configurei Surefire e Failsafe.
- [ ] Classifiquei os testes.
- [ ] Criei profiles de CI.
- [ ] Separei jobs unit e integration.
- [ ] Produzi JAR após os gates.
- [ ] Publiquei relatórios.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### IT não executa

Revise nome, Failsafe, profile e `skipITs`.

### Unitário executa no job integration

Revise `skipTests` e configuração dos plugins.

### Todos os testes são pulados

`maven.test.skip` ou `skipTests` pode estar afetando mais do que o esperado.

### Failsafe report não existe

Nenhum IT foi encontrado ou o goal não foi ligado.

### Build falha apenas no Linux

Revise case sensitivity, paths, line endings e permissões.

### Testcontainers não inicia

O runner precisa de Docker funcional.

### Cache Maven está corrompido

Limpe ou altere a chave; o build deve funcionar sem cache.

### JAR selecionado é `.original`

A busca precisa excluir o artefato intermediário.

### Package executa apesar de teste falho

`needs` ou condição do job está incorreta.

### Artifact inclui arquivos demais

Restrinja o glob.

### `clean` deixa jobs lentos

Avalie o custo depois de preservar isolamento e determinismo.

### Coverage apareceu no POM

Remova e preserve para a aula 521.

---

## Perguntas de revisão

1. O que é lifecycle?
2. O que é phase?
3. O que é goal?
4. O que faz Surefire?
5. O que faz Failsafe?
6. Qual a diferença entre `test` e `verify`?
7. O que faz `package`?
8. Quando usar `install`?
9. Por que não usar `deploy` no teste?
10. O que é profile?
11. O que faz `skipTests`?
12. O que faz `maven.test.skip`?
13. O que faz `skipITs`?
14. Por que usar Wrapper?
15. Cache é artifact?
16. Por que jobs unit e integration podem ser paralelos?
17. Por que package depende dos dois?
18. Por que usar `always()` nos relatórios?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sequência de build.
2. Ponto do lifecycle.
3. Ação de plugin.
4. Testes unitários.
5. Testes de integração.
6. Verify inclui fases posteriores.
7. Empacotar.
8. Reactor ou uso local necessário.
9. Não publicar durante gate.
10. Configuração condicional.
11. Pula execução.
12. Pode pular compilação.
13. Pula integração.
14. Fixar ferramenta.
15. Não.
16. São independentes.
17. Exigem gates aprovados.
18. Preservar falhas.
19. Coverage e quality gate.
20. Pipeline testes cobertura quality gate.

---

## Desafio opcional

Crie uma estratégia para projeto multimódulo.

Requisitos:

- módulos core, api e worker;
- reactor;
- `-pl`;
- `-am`;
- unitários por módulo;
- integração no módulo api;
- package final;
- cache compartilhado;
- artifacts separados;
- falha em core bloqueia dependentes;
- nenhum coverage gate.

O objetivo é estender o grafo sem antecipar a aula 521.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 520 - M17.15 - Pipeline Maven

- Continuei após GitHub Actions workflows.
- Aprofundei o lifecycle Maven.
- Diferenciei lifecycle, phase e goal.
- Revisei validate, compile, test, package, integration-test, verify, install e deploy.
- Validei o Maven Wrapper.
- Registrei Maven, Java e sistema operacional.
- Configurei propriedades do build.
- Configurei Surefire para testes unitários.
- Configurei Failsafe para testes de integração.
- Defini convenções de nomes.
- Classifiquei testes unitários e de integração.
- Criei `skipITs`.
- Criei os profiles `ci-fast`, `ci-integration` e `ci-full`.
- Criei scripts locais para cada profile.
- Executei a suíte rápida.
- Executei testes de integração com Testcontainers.
- Executei a verificação completa.
- Inspecionei relatórios Surefire e Failsafe.
- Verifiquei o JAR.
- Evoluí o workflow para jobs Maven separados.
- Criei `maven-unit`.
- Criei `maven-integration`.
- Executei os dois jobs em paralelo.
- Publiquei relatórios como artifacts.
- Criei `maven-package`.
- Condicionei o package aos dois gates.
- Evitei reexecução de testes conscientemente.
- Publiquei o JAR como artifact.
- Atualizei o summary final.
- Simulei falhas unitárias, de integração e de artifact.
- Documentei grafo, cache, reports e troubleshooting.
- Não antecipei cobertura ou quality gate.
- Próxima aula: Pipeline testes cobertura quality gate.
```

---

## Referência técnica curta

- Apache Maven Build Lifecycle.
- Maven Plugin Goals.
- Maven Surefire Plugin.
- Maven Failsafe Plugin.
- Maven Wrapper.
- Maven Profiles.
- GitHub Actions Java with Maven.
- GitHub Actions Dependency Caching.
- GitHub Actions Artifacts.
- Testcontainers.

Regra final:

```text
o Pipeline Maven organiza o build Java por lifecycle, phases, plugins e goals: Surefire executa testes unitários e publica `target/surefire-reports`, Failsafe executa testes de integração em `integration-test` e valida em `verify`, enquanto profiles `ci-fast`, `ci-integration` e `ci-full` tornam explícitos os cenários de feedback rápido, fronteiras reais e gate completo; o Maven Wrapper fixa a ferramenta, batch mode evita interação e o cache de `.m2` acelera sem se tornar artifact; no GitHub Actions, `maven-unit` e `maven-integration` executam em paralelo, preservam relatórios mesmo na falha e bloqueiam `maven-package`, que produz o JAR sem repetir testes somente porque o grafo já comprovou os gates; scripts locais reproduzem os comandos, Testcontainers valida PostgreSQL real e o summary consolida resultados; cobertura, JaCoCo, Sonar e thresholds ficam fora desta aula para serem adicionados de forma consciente no quality gate da aula 521.
```
