# 521 - M17.16 - Pipeline testes cobertura quality gate

## Apresentação da aula

Na aula 520, você transformou o build Maven em uma sequência explícita de validações.

O workflow passou a possuir:

```text
metadata;

maven-unit;

maven-integration;

maven-package;

maven-summary.
```

Também foram separados:

```text
Surefire;

Failsafe;

ci-fast;

ci-integration;

ci-full;

JAR;

relatórios;

artifacts;

cache.
```

Essa estrutura resolveu um problema importante:

```text
saber quais testes
executam,
em qual momento,
com qual plugin
e com qual evidência.
```

Entretanto, existe uma pergunta que ainda não foi respondida:

```text
quanto do código
realmente foi exercitado
pelos testes?
```

A resposta mais comum é:

```text
cobertura de código.
```

Cobertura mostra quais instruções, linhas, branches, métodos e classes foram executados durante os testes.

Ela ajuda a identificar:

- áreas sem teste;
- branches nunca exercitados;
- classes críticas sem proteção;
- código morto;
- regressões na suíte;
- diferença entre intenção e evidência.

Mas cobertura não responde sozinha:

- se o teste possui boas assertions;
- se o comportamento correto foi validado;
- se o teste cobre casos de negócio relevantes;
- se o teste é determinístico;
- se o contrato está correto;
- se o design está bom;
- se a aplicação é segura;
- se a integração funciona em produção.

Por isso, a regra central desta aula será:

```text
cobertura é um sinal;

quality gate é uma política;

qualidade é um sistema.
```

A ferramenta escolhida será:

```text
JaCoCo.
```

JaCoCo será integrado ao Maven para:

1. instrumentar a execução dos testes;
2. coletar dados;
3. gerar relatórios;
4. verificar limites;
5. falhar o build quando o gate não for atendido.

A aula trabalhará com:

```text
instruction coverage;

line coverage;

branch coverage;

method coverage;

class coverage;

complexity coverage.
```

A baseline principal utilizará:

```text
line coverage;

branch coverage.
```

Esses indicadores serão aplicados em dois níveis.

#### Gate global

Protege o projeto contra uma queda ampla de cobertura.

Exemplo didático:

```text
line:
75%.

branch:
60%.
```

#### Gate por pacote crítico

Protege áreas que não podem ficar sem testes.

Exemplos:

```text
domain;

application;

feature flags;

migration rules;

idempotency;

retry.
```

O projeto não usará o mesmo limite para tudo.

Classes de configuração, bootstrap e adapters podem possuir perfis diferentes.

Entretanto, exclusões não serão usadas para esconder falta de teste.

Cada exclusão precisa possuir justificativa.

A aula também diferenciará:

```text
coverage threshold;

coverage trend;

changed code coverage.
```

#### Threshold

Limite mínimo atual.

#### Trend

Evolução ao longo do tempo.

#### Changed code coverage

Cobertura apenas do código alterado.

A baseline desta aula implementará threshold no JaCoCo.

Trend e changed code coverage serão documentados como evolução.

A aula também lidará com um desafio técnico.

Os testes unitários executam no job:

```text
maven-unit.
```

Os testes de integração executam em outro job:

```text
maven-integration.
```

Cada job possui filesystem isolado.

Portanto, cada job produzirá seu próprio arquivo de execução.

Exemplo:

```text
jacoco-unit.exec;

jacoco-integration.exec.
```

Esses arquivos não aparecem automaticamente no job de quality gate.

Eles precisam ser publicados como artifacts e baixados no job agregador.

Depois, o JaCoCo precisa gerar um relatório combinado.

No laboratório, a abordagem principal será manter uma execução Maven completa:

```text
ci-full
```

no job de quality gate.

Essa abordagem reduz a complexidade inicial.

O job:

```text
maven-quality-gate
```

executará:

```text
clean verify
-Pci-full
```

com JaCoCo habilitado.

Ele produzirá um único conjunto coerente de dados para unitários e integração.

Os jobs separados continuam existindo porque fornecem:

- feedback paralelo;
- relatórios específicos;
- isolamento;
- diagnóstico rápido.

O job completo existe porque fornece:

- gate consolidado;
- cobertura unificada;
- JAR verificado;
- evidência final.

Essa repetição é consciente.

Ela será documentada como:

```text
redundância de confiança.
```

Depois, projetos maiores podem otimizar com:

- merge de exec files;
- multi-module report aggregation;
- cobertura distribuída;
- serviços especializados;
- changed code coverage.

A aula também introduzirá o conceito de qualidade mínima por camada.

Exemplo:

```text
domain:

branch coverage alta.

application:

line e branch relevantes.

adapters:

integração e contract tests.

configuration:

smoke e context tests.

generated code:

excluído quando realmente gerado.
```

Outro ponto importante será a diferença entre:

```text
missed branches;

unreachable branches;

defensive branches.
```

Nem toda branch sem cobertura indica um bug.

Mas toda branch excluída do gate precisa ser compreendida.

A aula também mostrará que getters, records e código simples podem elevar números sem melhorar a proteção do comportamento.

Por isso, não será usada uma meta extrema como:

```text
100% global.
```

Uma meta extrema pode incentivar:

- testes sem valor;
- assertions vazias;
- exclusões abusivas;
- testes acoplados à implementação;
- medo de refatorar;
- cobertura artificial.

O quality gate deve ser:

- alcançável;
- crescente;
- auditável;
- relevante;
- revisado.

A aula criará uma baseline com valores didáticos.

Esses valores precisam ser ajustados ao relatório real do projeto.

Não serão inventados como promessa de produção.

O processo será:

```text
1. medir a cobertura atual;

2. identificar pacotes críticos;

3. definir baseline;

4. configurar gate;

5. falhar conscientemente;

6. criar testes úteis;

7. recuperar o gate;

8. registrar evidência.
```

A aula também criará relatórios:

```text
HTML;

XML;

CSV;

exec data.
```

#### HTML

Usado por pessoas.

#### XML

Usado por ferramentas e integrações.

#### CSV

Usado em scripts simples e análise.

#### Exec

Dados binários do JaCoCo.

Os artifacts do workflow incluirão:

```text
jacoco-report;

Surefire;

Failsafe;

JAR;

summary.
```

O relatório de cobertura não conterá secrets.

Ainda assim, ele pode revelar:

- packages;
- classes;
- métodos;
- estrutura interna;
- caminhos.

Por isso, a retenção e o acesso precisam ser controlados.

A aula também criará um summary no GitHub Actions com:

```text
line coverage;

branch coverage;

status do gate;

artifact name;

commit.
```

O summary não substituirá o relatório HTML.

Ele apresentará apenas uma visão rápida.

A próxima aula será:

```text
522 - M17.17 - Pipeline Docker build push
```

Portanto, esta aula não irá:

- autenticar em registry;
- publicar imagem;
- usar Docker metadata action;
- executar login;
- gerar tag de container;
- fazer push;
- assinar imagem;
- publicar SBOM de imagem;
- executar provenance de container;
- configurar registry permissions.

O foco será:

```text
testes;

cobertura;

quality gate;

evidência.
```

Ao final, você deverá explicar:

```text
o que cobertura mede;

o que cobertura não mede;

como JaCoCo coleta dados;

como o Maven gera relatórios;

como um gate falha o build;

por que line e branch
precisam de interpretação;

como configurar exclusões;

por que o job completo
pode repetir testes;

como publicar evidências;

como melhorar cobertura
sem criar testes vazios.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
519:
GitHub Actions workflows.

520:
Pipeline Maven.

521:
Pipeline testes cobertura quality gate.

522:
Pipeline Docker build push.

523:
Pipeline scan de vulnerabilidades.
```

A aula 520 respondeu:

```text
como separar
unitários,
integração
e package
no Maven?
```

A aula 521 responderá:

```text
como medir
a execução dos testes

e bloquear
uma queda de qualidade
com um gate explícito?
```

Nesta aula:

```text
JaCoCo:
sim.

line coverage:
sim.

branch coverage:
sim.

instruction coverage:
sim.

method coverage:
sim.

class coverage:
sim.

HTML:
sim.

XML:
sim.

CSV:
sim.

quality gate:
sim.

Maven check:
sim.

workflow artifact:
sim.

workflow summary:
sim.

pacotes críticos:
sim.

exclusões:
sim.

coverage trend:
conceitual.

changed code coverage:
conceitual.

mutation testing:
conceitual.

Sonar:
não.

Docker push:
não.

vulnerability scan:
não.

deploy:
não.
```

A regra central será:

```text
o gate falha
quando a cobertura cai,

mas a equipe melhora
o comportamento testado,
não apenas o número.
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

scripts/quality-gate
├── run-coverage-report.ps1
├── inspect-jacoco-report.ps1
├── verify-coverage-thresholds.ps1
├── list-low-coverage-packages.ps1
└── simulate-coverage-regression.ps1

docs/devops/quality-gate
├── COVERAGE_POLICY.md
├── COVERAGE_BASELINE.md
├── COVERAGE_EXCLUSION_POLICY.md
├── QUALITY_GATE_RULES.md
├── QUALITY_GATE_WORKFLOW.md
├── COVERAGE_IMPROVEMENT_PLAN.md
├── COVERAGE_TEST_MATRIX.md
└── COVERAGE_TROUBLESHOOTING.md
```

O workflow será evoluído para:

```text
metadata;

maven-unit;

maven-integration;

maven-quality-gate;

maven-package;

maven-summary.
```

Ao final, você terá:

```text
JaCoCo configurado;

relatório consolidado;

gate global;

gate de branch;

exclusões justificadas;

job de quality gate;

artifact HTML/XML/CSV;

summary;

scripts locais;

baseline documentada.
```

Você irá:

1. confirmar a baseline;
2. adicionar JaCoCo;
3. preparar agent;
4. gerar report;
5. configurar check;
6. definir limites;
7. criar exclusions;
8. medir cobertura atual;
9. documentar baseline;
10. executar gate local;
11. simular regressão;
12. corrigir com teste útil;
13. revisar line coverage;
14. revisar branch coverage;
15. revisar classes críticas;
16. criar scripts;
17. atualizar workflow;
18. criar job quality gate;
19. publicar relatório;
20. criar summary;
21. condicionar package;
22. simular falha no CI;
23. preservar artifacts;
24. documentar;
25. executar gate;
26. commitar;
27. preparar a aula 522.

---

## Conceito essencial

### Instrumentação

JaCoCo usa instrumentação para registrar quais partes do bytecode foram executadas.

No Maven, o agent é normalmente preparado antes dos testes.

---

### Arquivo `.exec`

Contém dados de execução.

Exemplo:

```text
target/jacoco.exec.
```

Ele não é um relatório humano.

---

### Relatório

O goal `report` combina:

- classes compiladas;
- source files;
- execution data.

Ele produz HTML, XML e CSV.

---

### Instruction coverage

Mede instruções de bytecode executadas.

É mais granular que linha.

---

### Line coverage

Mede linhas com instruções executadas.

Uma linha pode conter várias instruções.

---

### Branch coverage

Mede caminhos condicionais.

Exemplos:

- `if`;
- `switch`;
- operador ternário;
- condições booleanas.

Uma linha coberta pode possuir branch não coberta.

---

### Method coverage

Mede métodos executados.

Não prova qualidade das assertions.

---

### Class coverage

Mede classes com algum método executado.

É um indicador amplo.

---

### Complexity coverage

Relaciona caminhos cobertos à complexidade ciclomática.

Ajuda a identificar lógica ramificada.

---

### Counter

JaCoCo trabalha com counters.

Exemplos:

```text
INSTRUCTION;

LINE;

BRANCH;

METHOD;

CLASS;

COMPLEXITY.
```

---

### Value

A regra pode usar:

```text
COVEREDRATIO;

MISSEDRATIO;

COVEREDCOUNT;

MISSEDCOUNT;

TOTALCOUNT.
```

Nesta aula:

```text
COVEREDRATIO.
```

---

### Scope

A regra pode ser aplicada por:

```text
BUNDLE;

PACKAGE;

CLASS;

SOURCEFILE;

METHOD.
```

A baseline global usa `BUNDLE`.

Pacotes críticos podem receber regras adicionais.

---

### Exclusion

Exclusion remove classes ou packages do relatório ou check.

Ela precisa ser restrita.

Exemplos aceitáveis:

- código gerado;
- classes de bootstrap sem comportamento;
- DTO gerado externamente.

Exemplos ruins:

- pacote difícil de testar;
- adapters com baixa cobertura;
- classes novas sem teste.

---

### Baseline

Baseline é a cobertura medida antes de definir o gate.

Ela evita criar um limite arbitrário.

---

### Ratchet

Ratchet impede regressão.

Exemplo:

```text
baseline:
72%.

novo gate:
72%.

depois:
74%.

o limite não diminui
sem decisão explícita.
```

---

### Changed code coverage

Mede somente linhas alteradas.

É útil em sistemas legados.

Não será implementado tecnicamente nesta aula.

---

### Mutation testing

Mutation testing altera o código para verificar se os testes detectam a mudança.

Cobertura alta com mutation score baixo pode indicar testes fracos.

Não será implementado.

---

### Quality gate

Quality gate é uma regra que bloqueia progressão.

Nesta aula:

```text
mvn verify
falha
quando JaCoCo check falha.
```

---

### Aggregate coverage

Em projeto multimódulo, pode ser necessário usar relatório agregado.

O laboratório atual é tratado como módulo único.

---

### Integration coverage

Testes Failsafe precisam executar com o JaCoCo agent ativo.

A configuração precisa garantir que unitários e integração alimentem o mesmo relatório final.

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
.\scripts\maven-pipeline\run-maven-full.ps1
```

Confirme Surefire, Failsafe e JAR.

---

### 2. Adicionar JaCoCo ao POM

No `pom.xml`:

```xml
<plugin>
    <groupId>
        org.jacoco
    </groupId>

    <artifactId>
        jacoco-maven-plugin
    </artifactId>

    <executions>
        <execution>
            <id>
                prepare-agent
            </id>

            <goals>
                <goal>
                    prepare-agent
                </goal>
            </goals>
        </execution>

        <execution>
            <id>
                report
            </id>

            <phase>
                verify
            </phase>

            <goals>
                <goal>
                    report
                </goal>
            </goals>
        </execution>

        <execution>
            <id>
                check
            </id>

            <phase>
                verify
            </phase>

            <goals>
                <goal>
                    check
                </goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Use a versão gerenciada pelo projeto ou declare uma versão validada pela equipe.

Não use versão arbitrária sem política.

---

### 3. Preservar `argLine`

Se Surefire ou Failsafe já usam `argLine`, o agent do JaCoCo não pode ser sobrescrito.

Uma estratégia é usar late property evaluation.

Exemplo conceitual:

```xml
<argLine>
    @{argLine}
    -Dfile.encoding=UTF-8
</argLine>
```

Valide a configuração real do projeto.

Um `argLine` incorreto pode produzir cobertura zero.

---

### 4. Configurar relatórios

O diretório padrão será:

```text
target/site/jacoco.
```

Arquivos esperados:

```text
index.html;

jacoco.xml;

jacoco.csv.
```

---

### 5. Criar propriedades de threshold

No POM:

```xml
<properties>
    <coverage.line.minimum>
        0.75
    </coverage.line.minimum>

    <coverage.branch.minimum>
        0.60
    </coverage.branch.minimum>
</properties>
```

Esses valores são didáticos.

Ajuste após medir a baseline real.

---

### 6. Configurar o check global

Dentro do execution `check`:

```xml
<configuration>
    <rules>
        <rule>
            <element>
                BUNDLE
            </element>

            <limits>
                <limit>
                    <counter>
                        LINE
                    </counter>

                    <value>
                        COVEREDRATIO
                    </value>

                    <minimum>
                        ${coverage.line.minimum}
                    </minimum>
                </limit>

                <limit>
                    <counter>
                        BRANCH
                    </counter>

                    <value>
                        COVEREDRATIO
                    </value>

                    <minimum>
                        ${coverage.branch.minimum}
                    </minimum>
                </limit>
            </limits>
        </rule>
    </rules>
</configuration>
```

---

### 7. Criar regra para pacote crítico

Exemplo conceitual:

```xml
<rule>
    <element>
        PACKAGE
    </element>

    <includes>
        <include>
            br.com.formacao.m16.domain.*
        </include>
    </includes>

    <limits>
        <limit>
            <counter>
                BRANCH
            </counter>

            <value>
                COVEREDRATIO
            </value>

            <minimum>
                0.70
            </minimum>
        </limit>
    </limits>
</rule>
```

A sintaxe de includes precisa ser validada com os nomes reais dos packages.

Não crie uma regra que nunca corresponda.

---

### 8. Definir exclusões

Exemplo:

```xml
<excludes>
    <exclude>
        **/*Application.class
    </exclude>

    <exclude>
        **/generated/**
    </exclude>
</excludes>
```

A exclusão de `Application` precisa ser justificada.

Não exclua:

- domain;
- retry;
- idempotency;
- migration;
- feature flags;
- worker logic.

---

### 9. Executar relatório sem gate

Durante a primeira medição, você pode executar:

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-full `
  -Djacoco.skip=false `
  -Dcoverage.line.minimum=0 `
  -Dcoverage.branch.minimum=0 `
  clean `
  verify
```

Isso produz a baseline.

Não deixe o gate em zero depois.

---

### 10. Criar script de relatório

Arquivo:

```text
run-coverage-report.ps1
```

Responsabilidades:

- executar `ci-full`;
- gerar JaCoCo;
- validar arquivos;
- mostrar paths;
- retornar exit code;
- não alterar thresholds permanentemente.

---

### 11. Inspecionar XML

Arquivo:

```text
inspect-jacoco-report.ps1
```

Leia:

```text
target/site/jacoco/jacoco.xml.
```

Extraia counters do `report`.

Calcule:

```text
covered / (covered + missed).
```

Trate divisão por zero.

---

### 12. Listar pacotes com baixa cobertura

Arquivo:

```text
list-low-coverage-packages.ps1
```

Ordene por:

- branch ratio;
- line ratio;
- missed branches;
- missed lines.

Use o relatório XML.

---

### 13. Documentar baseline

Arquivo:

```text
COVERAGE_BASELINE.md
```

Inclua:

- data;
- commit;
- Java;
- Maven;
- profile;
- line;
- branch;
- pacotes críticos;
- exclusions;
- gaps;
- próximos passos.

Não invente números.

Use resultados reais.

---

### 14. Criar política de cobertura

Arquivo:

```text
COVERAGE_POLICY.md
```

Regras:

- cobertura é sinal;
- gate não substitui review;
- thresholds não diminuem silenciosamente;
- exclusões precisam de aprovação;
- código novo precisa de testes;
- flakiness não pode ser mascarada;
- branch coverage recebe atenção.

---

### 15. Criar política de exclusões

Arquivo:

```text
COVERAGE_EXCLUSION_POLICY.md
```

Toda exclusão deve possuir:

- pattern;
- justificativa;
- owner;
- revisão;
- prazo quando temporária.

---

### 16. Criar regras do gate

Arquivo:

```text
QUALITY_GATE_RULES.md
```

Inclua:

```text
global line;

global branch;

pacotes críticos;

zero testes;

relatório ausente;

XML inválido;

regressão;

exclusion review.
```

---

### 17. Executar gate local

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-full `
  clean `
  verify
```

O build precisa falhar quando o threshold não é atingido.

---

### 18. Simular regressão

Arquivo:

```text
simulate-coverage-regression.ps1
```

Estratégia:

- selecionar classe de laboratório;
- adicionar branch temporária;
- não criar teste;
- executar gate;
- confirmar falha;
- restaurar arquivo em `finally`.

Não deixe alteração temporária no Git.

---

### 19. Corrigir com teste útil

Crie um teste que valide comportamento.

Exemplo:

```text
feature flag inválida;

variant pinning;

retry após mudança;

backfill interrompido;

rollback decision.
```

O teste deve possuir assertions relevantes.

---

### 20. Reexecutar o gate

Confirme:

```text
gate verde;

relatório atualizado;

branch exercitada;

nenhuma exclusão nova.
```

---

### 21. Criar script de threshold

Arquivo:

```text
verify-coverage-thresholds.ps1
```

Ele:

- lê o XML;
- recebe limites;
- compara;
- escreve summary local;
- falha com exit code;
- não substitui o `jacoco:check`.

Serve como evidência adicional.

---

### 22. Atualizar workflow

Adicione:

```text
maven-quality-gate.
```

Ele depende de:

```text
metadata.
```

Pode executar em paralelo com unit e integration ou após eles.

A baseline executará após os dois para reduzir ruído de falhas simultâneas.

---

### 23. Criar job de quality gate

```yaml
  maven-quality-gate:
    name:
      Maven coverage quality gate

    needs:
      - metadata
      - maven-unit
      - maven-integration

    runs-on:
      ubuntu-latest

    timeout-minutes:
      35

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
```

---

### 24. Executar gate completo

```yaml
      - name:
          Run full Maven quality gate

        run: |
          set -Eeuo pipefail

          chmod +x mvnw

          ./mvnw \
            --batch-mode \
            --no-transfer-progress \
            -Pci-full \
            clean \
            verify
```

---

### 25. Publicar JaCoCo

```yaml
      - name:
          Upload JaCoCo report

        if:
          always()

        uses:
          actions/upload-artifact@v4

        with:
          name:
            jacoco-${{ needs.metadata.outputs.short_sha }}

          path:
            |
              labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/site/jacoco/**
              labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/jacoco.exec

          if-no-files-found:
            error

          retention-days:
            14
```

Se o gate falhar antes do report ser gerado, revise a ordem das executions.

---

### 26. Publicar relatórios completos

Inclua também Surefire e Failsafe do job consolidado.

Use artifact separado ou único.

A baseline poderá usar:

```text
quality-gate-reports-<sha>.
```

---

### 27. Criar summary de cobertura

Adicione um step com:

```yaml
if:
  always()
```

Execute o script:

```text
inspect-jacoco-report.
```

Escreva em:

```text
GITHUB_STEP_SUMMARY.
```

Inclua:

- line;
- branch;
- thresholds;
- status;
- artifact.

---

### 28. Atualizar package

O job `maven-package` passa a depender de:

```text
maven-unit;

maven-integration;

maven-quality-gate.
```

Ele só empacota quando todos passam.

---

### 29. Atualizar summary final

Inclua:

- unit result;
- integration result;
- quality gate result;
- package result;
- short SHA.

Falhe quando qualquer gate obrigatório falhar.

---

### 30. Criar workflow doc

Arquivo:

```text
QUALITY_GATE_WORKFLOW.md
```

Explique:

- jobs;
- dependências;
- repetição consciente;
- artifacts;
- thresholds;
- failure behavior;
- package gate.

---

### 31. Criar improvement plan

Arquivo:

```text
COVERAGE_IMPROVEMENT_PLAN.md
```

Priorize:

1. regras de domínio;
2. branches de erro;
3. idempotência;
4. retries;
5. migration compatibility;
6. feature flags;
7. rollback.

Não priorize apenas classes fáceis.

---

### 32. Criar matriz de testes

Arquivo:

```text
COVERAGE_TEST_MATRIX.md
```

Cenários:

- gate passa;
- line falha;
- branch falha;
- relatório ausente;
- XML inválido;
- zero testes;
- exclusion indevida;
- job unit falha;
- job integration falha;
- gate falha;
- package bloqueado;
- artifact preservado;
- summary parcial;
- cache miss;
- cache hit.

---

### 33. Simular falha no workflow

Em branch de laboratório:

- reduza cobertura;
- faça push;
- confirme quality gate vermelho;
- confirme artifact;
- confirme package bloqueado;
- restaure;
- faça novo push;
- confirme verde.

---

### 34. Revisar relatórios

No artifact HTML, navegue por:

- package;
- class;
- method;
- branch.

Não use apenas o percentual global.

---

### 35. Revisar classes críticas

Confirme cobertura de:

- feature flag decision;
- kill switch;
- variant pinning;
- retry;
- idempotência;
- migration fallback;
- rollback decision;
- worker role.

---

### 36. Criar troubleshooting

Arquivo:

```text
COVERAGE_TROUBLESHOOTING.md
```

Inclua:

- cobertura zero;
- `argLine` sobrescrito;
- unit coberto e IT não;
- report ausente;
- XML ausente;
- threshold decimal errado;
- package rule não corresponde;
- exclusions excessivas;
- generated code;
- artifact vazio;
- gate executa antes do report;
- Testcontainers falha;
- cobertura muda entre ambientes;
- teste flaky.

---

### 37. Executar gate final

Execute:

```powershell
.\scripts\quality-gate\run-coverage-report.ps1

.\scripts\quality-gate\inspect-jacoco-report.ps1

.\scripts\quality-gate\verify-coverage-thresholds.ps1

.\scripts\quality-gate\list-low-coverage-packages.ps1
```

Depois:

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-full `
  clean `
  verify
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Cobertura ganhou significado

Line e branch passaram a ser analisadas, não apenas exibidas.

### O gate entrou no Maven

A mesma política funciona localmente e no CI.

### A baseline virou evidência

Thresholds nasceram de medição real.

### Exclusões ganharam governança

Patterns precisam de justificativa e revisão.

### O job completo consolidou a visão

Unitários e integração alimentam um relatório final.

### A repetição ficou consciente

Jobs rápidos e gate completo possuem objetivos diferentes.

### O package ganhou mais uma dependência

Nenhum JAR é publicado com quality gate vermelho.

### Artifacts preservaram investigação

HTML, XML, CSV e exec permanecem disponíveis.

### O summary ganhou números úteis

A execução mostra cobertura e status rapidamente.

### A próxima aula ganhou um candidato validado

Docker build e push começarão somente depois dos gates.

---

## Erros comuns importantes

### Buscar 100% global

A equipe pode produzir testes artificiais.

### Usar cobertura como qualidade absoluta

Assertions fracas continuam possíveis.

### Excluir pacote difícil

A exclusão esconde risco.

### Configurar threshold sem baseline

O número vira arbitrário.

### Reduzir o limite para passar

O gate perde credibilidade.

### Olhar apenas line coverage

Branches críticas podem permanecer sem teste.

### Sobrescrever `argLine`

O JaCoCo pode gerar cobertura zero.

### Executar report antes dos testes

Não existem dados.

### Publicar package com gate vermelho

A ordem do grafo está errada.

### Não preservar artifact na falha

A causa fica mais difícil de investigar.

### Usar cobertura por pessoa

O sinal deve melhorar o sistema.

### Antecipar Docker push

A aula 522 possui esse objetivo.

---

## Comandos úteis

### Executar cobertura

```powershell
.\mvnw.cmd `
  --batch-mode `
  --no-transfer-progress `
  -Pci-full `
  clean `
  verify
```

### Abrir relatório

```powershell
Start-Process `
  "target/site/jacoco/index.html"
```

### Inspecionar XML

```powershell
.\scripts\quality-gate\inspect-jacoco-report.ps1
```

### Verificar thresholds

```powershell
.\scripts\quality-gate\verify-coverage-thresholds.ps1
```

### Listar gaps

```powershell
.\scripts\quality-gate\list-low-coverage-packages.ps1
```

---

## Exercício guiado

### Parte 1 — JaCoCo

Adicione agent, report e check.

### Parte 2 — Baseline

Meça line e branch.

### Parte 3 — Rules

Crie limites globais.

### Parte 4 — Packages

Proteja áreas críticas.

### Parte 5 — Exclusions

Documente apenas as justificadas.

### Parte 6 — Regression

Faça o gate falhar.

### Parte 7 — Test

Crie teste útil.

### Parte 8 — Workflow

Adicione job consolidado.

### Parte 9 — Artifact

Preserve relatório.

### Parte 10 — Package

Bloqueie quando o gate falhar.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 520 foi preservada;
- cobertura foi definida;
- limitações da cobertura foram explicadas;
- JaCoCo foi adicionado;
- instrumentação foi explicada;
- arquivo exec foi explicado;
- report foi explicado;
- instruction coverage foi explicada;
- line coverage foi explicada;
- branch coverage foi explicada;
- method coverage foi explicada;
- class coverage foi explicada;
- complexity coverage foi explicada;
- counters foram explicados;
- covered ratio foi usado;
- bundle rule foi criada;
- package rule foi discutida;
- baseline foi definida;
- ratchet foi definido;
- changed code coverage foi discutido;
- mutation testing foi discutido;
- quality gate foi definido;
- prepare-agent foi configurado;
- report foi ligado a verify;
- check foi ligado a verify;
- `argLine` foi revisado;
- HTML foi gerado;
- XML foi gerado;
- CSV foi gerado;
- thresholds foram criados;
- line minimum foi criado;
- branch minimum foi criado;
- valores foram classificados como didáticos;
- baseline real foi medida;
- check global foi configurado;
- pacote crítico foi protegido;
- syntax de include foi validada;
- exclusions foram limitadas;
- domínio não foi excluído;
- retry não foi excluído;
- idempotência não foi excluída;
- migration não foi excluída;
- feature flags não foram excluídas;
- relatório sem gate foi executado para baseline;
- gate zero não permaneceu;
- script de relatório foi criado;
- script de inspeção foi criado;
- script de gaps foi criado;
- baseline doc foi criado;
- policy de cobertura foi criada;
- policy de exclusões foi criada;
- rules doc foi criado;
- gate local foi executado;
- regressão foi simulada;
- gate falhou;
- alteração temporária foi restaurada;
- teste útil foi criado;
- assertions relevantes foram usadas;
- gate voltou a passar;
- script de thresholds foi criado;
- workflow foi atualizado;
- job maven-quality-gate foi criado;
- job depende de unit e integration;
- JDK 21 foi usado;
- cache Maven foi usado;
- profile ci-full foi usado;
- clean verify foi executado;
- artifact JaCoCo foi criado;
- artifact usa `always()`;
- HTML foi publicado;
- XML foi publicado;
- CSV foi publicado;
- exec data foi publicada;
- if-no-files-found error foi usado;
- relatórios completos foram preservados;
- summary de cobertura foi criado;
- line foi mostrado;
- branch foi mostrado;
- thresholds foram mostrados;
- status foi mostrado;
- maven-package depende do quality gate;
- package não executa com gate vermelho;
- summary final foi atualizado;
- workflow doc foi criado;
- improvement plan foi criado;
- test matrix foi criada;
- falha no workflow foi simulada;
- artifact foi preservado na falha;
- execução corrigida ficou verde;
- relatório HTML foi revisado;
- packages foram revisados;
- classes críticas foram revisadas;
- troubleshooting foi criado;
- cache foi diferenciado de artifact;
- coverage não foi usada para medir pessoas;
- threshold não foi reduzido silenciosamente;
- Sonar não foi implementado;
- mutation testing não foi implementado;
- Docker push não foi implementado;
- registry não foi usado;
- vulnerability scan não foi implementado;
- deploy não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 522 está correta.

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
  scripts/quality-gate `
  docs/devops/quality-gate `
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
git commit -m "ci(m17): adicionar cobertura e quality gates"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- target;
- jacoco.exec local;
- relatório HTML local;
- Surefire local;
- Failsafe local;
- JAR local;
- cache;
- `.env`;
- secret;
- artifact baixado;
- configuração de regressão;
- Docker push da aula 522.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os testes passaram a produzir um sinal quantitativo integrado ao build.

O pipeline passou a possuir:

```text
unit;

integration;

quality gate;

package;

summary.
```

Você comprovou que:

- cobertura mede execução;
- cobertura não mede qualidade completa;
- line e branch possuem significados diferentes;
- JaCoCo instrumenta o bytecode;
- report gera HTML, XML e CSV;
- check falha o Maven;
- thresholds precisam nascer de baseline;
- exclusions precisam de governança;
- regressão pode bloquear o package;
- artifacts preservam evidência;
- o job completo consolida unit e integration;
- repetição pode ser consciente;
- testes úteis recuperam o gate sem manipular números.

A próxima aula será:

```text
522 - M17.17 - Pipeline Docker build push
```

Nela, você irá construir a imagem somente depois dos gates, gerar tags e metadata, autenticar de forma controlada e publicar o mesmo artefato em um registry.

Nenhum Docker build ou push de pipeline foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Configurei JaCoCo.
- [ ] Medi a baseline.
- [ ] Defini line e branch gates.
- [ ] Governei exclusões.
- [ ] Simulei regressão.
- [ ] Criei teste útil.
- [ ] Integrei ao workflow.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Cobertura aparece como zero

Revise `prepare-agent`, `argLine`, execução dos testes e arquivo exec.

### Unitários aparecem, mas integração não

Failsafe pode não estar recebendo o agent ou o relatório pode ser gerado cedo.

### `jacoco.xml` não existe

O goal `report` não executou ou o build falhou antes.

### O gate não falha

Revise execution `check`, phase, rules e thresholds.

### O pacote crítico não recebe regra

O pattern de include pode não corresponder ao package real.

### A branch coverage caiu muito

Existem caminhos condicionais não exercitados.

### O HTML possui classes excluídas demais

Revise a policy e remova exclusões injustificadas.

### O artifact está vazio

Path do workflow ou ordem do report está incorreta.

### O package executou com gate vermelho

`needs` não inclui o quality gate.

### O XML é diferente entre máquinas

Revise JDK, testes flaky, ordem e infraestrutura.

### O threshold foi reduzido em um PR

Exija justificativa e revisão específica.

### Docker começou a ser publicado

Remova e preserve para a aula 522.

---

## Perguntas de revisão

1. O que cobertura mede?
2. O que cobertura não mede?
3. O que faz o agent JaCoCo?
4. O que contém o arquivo exec?
5. O que é line coverage?
6. O que é branch coverage?
7. O que é instruction coverage?
8. O que é quality gate?
9. O que é baseline?
10. O que é ratchet?
11. O que é exclusion?
12. Por que 100% pode ser ruim?
13. Por que usar HTML?
14. Por que usar XML?
15. Por que publicar artifact na falha?
16. Por que o job completo repete testes?
17. O que bloqueia o package?
18. O que é changed code coverage?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Código executado.
2. Qualidade das assertions.
3. Instrumentar execução.
4. Dados binários.
5. Linhas exercitadas.
6. Caminhos condicionais.
7. Instruções de bytecode.
8. Regra que bloqueia.
9. Medição inicial.
10. Limite que não regressa.
11. Remoção justificada.
12. Incentiva testes artificiais.
13. Análise humana.
14. Integração de ferramentas.
15. Preservar diagnóstico.
16. Consolidar cobertura.
17. Quality gate.
18. Cobertura do diff.
19. Docker build push.
20. Pipeline Docker build push.

---

## Desafio opcional

Crie um gate por pacote crítico.

Requisitos:

- selecionar um package real;
- medir baseline;
- definir branch threshold;
- criar teste que falha o gate;
- corrigir com assertion útil;
- documentar o pattern;
- não excluir classes;
- não alterar gate global;
- não implementar Sonar.

O objetivo é praticar granularidade sem transformar o POM em uma lista impossível de manter.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 521 - M17.16 - Pipeline testes cobertura quality gate

- Continuei após o Pipeline Maven.
- Diferenciei cobertura de qualidade.
- Adicionei o plugin JaCoCo.
- Configurei `prepare-agent`.
- Configurei `report` em `verify`.
- Configurei `check` em `verify`.
- Revisei a integração com `argLine`.
- Gerei relatórios HTML, XML e CSV.
- Estudei instruction, line, branch, method, class e complexity coverage.
- Defini thresholds didáticos para line e branch.
- Medi a baseline real antes de fixar o gate.
- Criei regra global.
- Planejei regra para pacote crítico.
- Criei policy de exclusões.
- Mantive domínio, retry, idempotência, migration e feature flags dentro do relatório.
- Criei scripts de relatório, inspeção, thresholds e gaps.
- Documentei baseline, policy, rules e improvement plan.
- Executei o gate local.
- Simulei regressão de cobertura.
- Confirmei a falha do Maven.
- Criei teste útil para recuperar o gate.
- Adicionei o job `maven-quality-gate`.
- Executei `ci-full` no workflow.
- Publiquei JaCoCo como artifact.
- Preservei relatórios na falha.
- Criei summary com line e branch coverage.
- Condicionei `maven-package` ao quality gate.
- Atualizei o summary final.
- Simulei gate vermelho e package bloqueado.
- Revisei packages e classes críticas.
- Não antecipei Docker build e push.
- Próxima aula: Pipeline Docker build push.
```

---

## Referência técnica curta

- JaCoCo Maven Plugin.
- JaCoCo Coverage Counters.
- Maven Verify Phase.
- Surefire Reports.
- Failsafe Reports.
- Code Coverage Quality Gates.
- Branch Coverage.
- Changed Code Coverage.
- Mutation Testing.
- GitHub Actions Artifacts.

Regra final:

```text
o pipeline de testes transforma cobertura em um quality gate consciente: JaCoCo prepara o agent, coleta dados de unitários e integração, gera HTML, XML e CSV em `verify` e executa `check` com limites de line e branch derivados de uma baseline real; cobertura permanece um sinal e não substitui assertions, review, testes de contrato ou arquitetura; exclusões exigem pattern, justificativa, owner e revisão, enquanto domínio, idempotência, retry, migrations e feature flags permanecem medidos; `maven-quality-gate` executa `ci-full`, publica relatórios mesmo na falha, registra ratios no summary e bloqueia `maven-package` quando o gate fica vermelho; regressões são simuladas e corrigidas com testes úteis, sem reduzir thresholds ou perseguir 100% artificial; com JAR, testes e cobertura validados, a aula 522 poderá construir e publicar a imagem Docker somente depois de todos os gates.
```
