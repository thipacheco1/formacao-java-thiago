# 442 - M15.32 - Vulnerabilidades em dependencias

## Apresentação da aula

Na aula 441, o projeto passou a tratar cada objeto conforme a fronteira para a qual foi criado.

O fluxo ficou:

```text
Request DTO:
input externo permitido.

Command:
intenção interna.

Result:
retorno do caso de uso.

Response DTO:
allowlist pública.

Domain Event:
fato mínimo.

Audit Event:
accountability.

Log Event:
diagnóstico seguro.
```

Os dados também passaram a ser classificados como:

```text
PUBLIC;

INTERNAL;

PERSONAL;

SENSITIVE;

SECRET.
```

Essa proteção reduz vazamentos causados pelo código da própria aplicação.

Ainda existe outra origem de risco:

```text
código que o projeto
não escreveu diretamente.
```

A API utiliza bibliotecas para:

- iniciar o Spring Boot;
- proteger endpoints;
- validar JWT;
- serializar JSON;
- acessar PostgreSQL;
- acessar Redis;
- executar migrations;
- gerar logs;
- criar containers de teste;
- expor métricas;
- validar requests.

Uma vulnerabilidade em uma dependência pode atingir a aplicação mesmo quando:

- o código próprio está correto;
- o endpoint possui autenticação;
- o DTO é mínimo;
- o log não contém secrets;
- os testes unitários passam;
- a dependência não aparece diretamente no `pom.xml`.

Isso ocorre porque Maven resolve também dependências transitivas.

Exemplo:

```text
aplicação;

spring-boot-starter-web;

biblioteca intermediária;

componente vulnerável.
```

A pergunta central desta aula será:

```text
como conhecer o software
que realmente entra no build,
detectar vulnerabilidades conhecidas,
priorizar pelo risco do nosso ambiente
e impedir que suppressions
transformem o scanner
em um selo vazio?
```

A solução terá quatro partes:

```text
inventário;

detecção;

triagem;

governança.
```

Inventário:

```text
dependency tree;

effective POM;

SBOM CycloneDX.
```

Detecção:

```text
OWASP Dependency-Check;

NVD;

CISA KEV;

advisories do fornecedor.
```

Triagem:

```text
CVSS;

KEV;

EPSS;

reachability;

exposição;

impacto;

controles compensatórios.
```

Governança:

```text
risk register;

owner;

prazo;

evidência;

suppression com expiração;

gate de build;

PR de atualização.
```

As versões fixadas nesta aula serão:

```text
Maven Dependency Plugin:
3.11.0.

OWASP Dependency-Check:
12.2.2.

CycloneDX Maven Plugin:
2.9.2.
```

Não será usado:

```text
latest;

RELEASE;

LATEST;

version range aberta.
```

A baseline utilizará o OWASP Dependency-Check em um profile Maven:

```text
security-sca.
```

O profile será executado:

- no desenvolvimento durante a aula;
- em job próprio de CI;
- antes de releases;
- em execução agendada.

Ele não dependerá de uma verificação manual no navegador.

O primeiro gate automático será:

```text
failBuildOnCVSS:
8.0.
```

Esse número é uma baseline didática.

Ele não significa:

```text
CVSS 7.9:
seguro.

CVSS 8.0:
sempre explorável.
```

CVSS comunica severidade técnica.

Risco depende também de:

- uso real da dependência;
- código vulnerável alcançável;
- superfície externa;
- privilégios;
- dados tratados;
- exploit conhecido;
- presença no KEV;
- probabilidade de exploração;
- controles compensatórios;
- criticidade do serviço.

Uma vulnerabilidade presente no catálogo Known Exploited Vulnerabilities da CISA receberá escalonamento imediato, ainda que um threshold simples não a bloqueie.

O catálogo KEV será tratado como evidência de exploração conhecida.

EPSS poderá ser usado como sinal adicional de probabilidade de exploração nos próximos trinta dias.

Nenhum dos dois substitui análise contextual.

A aula criará:

```text
pom.xml:
plugins fixados.

security/dependency-check-suppressions.xml;

security/dependency-risk-register.yaml;

.github/dependabot.yml;

docs/security/
├── M15_DEPENDENCY_VULNERABILITY_MANAGEMENT.md
├── M15_DEPENDENCY_RISK_POLICY.md
└── M15_SBOM_RUNBOOK.md.
```

Também serão criados testes de policy:

```text
DependencySuppressionPolicyTest;

DependencyRiskRegisterTest;

DependencyBuildPolicyTest.
```

A aplicação não adicionará uma biblioteca vulnerável propositalmente.

Os testes de regras usarão fixtures sintéticas.

A próxima aula oficial será:

```text
443 - M15.33 - Testes de seguranca
```

Nela, os controles construídos no módulo serão organizados em uma suíte de testes de segurança por camada, contrato e ameaça.

---

## Onde estamos na formação

A sequência oficial é:

```text
440:
Protecao contra mass assignment.

441:
Seguranca em DTOs e logs.

442:
Vulnerabilidades em dependencias.

443:
Testes de seguranca.

444:
Testes de autorizacao.

445:
Hardening de API.
```

A aula 441 respondeu:

```text
quais dados podem
atravessar responses,
errors e logs?
```

A aula 442 responderá:

```text
quais componentes externos
entram no artefato
e qual risco conhecido
eles carregam?
```

Nesta aula:

```text
dependency tree:
sim.

dependências transitivas:
sim.

SBOM:
sim.

Dependency-Check:
sim.

NVD:
sim.

KEV:
sim.

CVSS:
sim.

EPSS:
sim.

risk register:
sim.

suppression:
sim.

Dependabot:
sim.

SAST:
não.

DAST:
não.

testes de segurança:
próxima aula.
```

A regra central será:

```text
scanner encontra sinais;

engenharia transforma
sinais em decisões
rastreáveis e testáveis.
```

---

## Objetivo prático

Ao final da aula, o projeto terá configuração Maven para:

```text
dependency tree;

SBOM CycloneDX;

SCA com Dependency-Check.
```

Arquivos de segurança:

```text
security/
├── dependency-check-suppressions.xml
└── dependency-risk-register.yaml
```

Automação:

```text
.github/
└── dependabot.yml
```

Testes:

```text
src/test/java/br/com/formacao/backend/
└── security
    └── supplychain
        ├── DependencySuppressionPolicyTest.java
        ├── DependencyRiskRegisterTest.java
        └── DependencyBuildPolicyTest.java
```

Fixtures:

```text
src/test/resources/security/supplychain/
├── expired-suppression.xml
├── unsafe-suppression.xml
└── invalid-risk-register.yaml
```

Documentação:

```text
docs/security/
├── M15_DEPENDENCY_VULNERABILITY_MANAGEMENT.md
├── M15_DEPENDENCY_RISK_POLICY.md
└── M15_SBOM_RUNBOOK.md
```

Relatórios gerados:

```text
target/dependency-tree.json;

target/bom.json;

target/bom.xml;

target/dependency-check-report.html;

target/dependency-check-report.json;

target/dependency-check-report.sarif.
```

Você irá:

1. diferenciar dependência direta e transitiva;
2. inspecionar a árvore resolvida;
3. identificar a origem de uma transitiva;
4. revisar o effective POM;
5. diferenciar BOM e SBOM;
6. gerar SBOM;
7. configurar Dependency-Check;
8. proteger a NVD API key;
9. configurar cache;
10. gerar relatórios;
11. criar gate por severidade;
12. interpretar CVE e CPE;
13. considerar KEV;
14. considerar EPSS;
15. avaliar reachability;
16. criar risk register;
17. definir decisões;
18. corrigir vulnerabilidades;
19. governar suppressions;
20. automatizar updates.

---

## Conceito essencial

### Dependência direta

Dependência direta aparece no `pom.xml`.

Exemplo:

```xml
<dependency>
    <groupId>
        org.springframework.boot
    </groupId>
    <artifactId>
        spring-boot-starter-web
    </artifactId>
</dependency>
```

A aplicação declara que precisa desse componente.

---

### Dependência transitiva

Uma dependência direta pode depender de outras bibliotecas.

Maven resolve essas transitivas e monta o classpath efetivo.

Não encontrar um artifact no `pom.xml` não significa que ele não esteja no produto.

A pergunta correta é:

```text
qual caminho introduziu
esse componente?
```

O comando `dependency:tree` responde.

---

### Escopo

Scopes alteram onde a dependência participa.

Principais:

```text
compile;

runtime;

provided;

test.
```

Uma vulnerabilidade em `test` não possui a mesma exposição de uma biblioteca empacotada em runtime.

Porém, test dependencies ainda podem afetar:

- CI;
- agentes;
- geração de código;
- processamento de fixtures;
- plugins;
- supply chain do build.

A triagem registra o escopo em vez de simplesmente ignorá-lo.

---

### Dependency management e BOM

Spring Boot gerencia versões por um BOM de dependências.

Esse BOM:

```text
define versões compatíveis
para o build.
```

Ele não é uma SBOM.

Dependency management responde:

```text
qual versão o Maven deve resolver?
```

SBOM responde:

```text
quais componentes fazem parte
do produto construído?
```

Os termos não são intercambiáveis.

---

### SBOM

Software Bill of Materials é um inventário legível por máquina.

Na baseline CycloneDX, ele registra:

- componentes;
- versões;
- Package URLs;
- hashes quando disponíveis;
- licenças;
- dependências;
- relações.

SBOM não afirma que o software está seguro.

Ela permite localizar rapidamente um componente quando surge um novo advisory.

---

### CVE

CVE é um identificador para uma vulnerabilidade divulgada.

Exemplo estrutural:

```text
CVE-AAAA-NNNN.
```

O identificador não informa sozinho:

- se o projeto usa o componente;
- se a versão é afetada;
- se o caminho vulnerável é alcançável;
- se existe exploit;
- se há mitigação;
- se o ativo é exposto.

---

### CPE, GAV e Package URL

Dependency-Check utiliza evidências para associar componentes a vulnerabilidades.

Identificadores relevantes:

```text
GAV:
groupId:artifactId:version.

PURL:
pkg:maven/group/artifact@version.

CPE:
identificador de produto
usado em bases como NVD.
```

Um mapeamento incorreto de CPE pode gerar falso positivo.

Por isso, cada finding precisa ser ligado ao artifact real.

---

### Advisory

Uma decisão deve consultar fontes adequadas:

- advisory do mantenedor;
- GitHub Security Advisory;
- NVD;
- CISA KEV;
- release notes;
- changelog;
- patch oficial.

Posts e agregadores ajudam a localizar informação.

Eles não devem ser a única evidência para fechar um finding.

---

### CVSS

CVSS comunica severidade técnica em escala de zero a dez.

A versão 4 possui grupos:

```text
Base;

Threat;

Environmental;

Supplemental.
```

O Base Score assume características gerais.

Threat e Environmental ajudam a aproximar o resultado do cenário real.

Registre sempre:

- versão do CVSS;
- score;
- vector.

Não compare números sem saber qual versão e qual vector foram usados.

---

### Severidade não é risco

CVSS não conhece automaticamente:

- criticidade da API OS;
- exposição à internet;
- dados pessoais;
- tenant isolation;
- controles compensatórios;
- frequência do código;
- impacto operacional.

A política usa CVSS como um input.

Não como decisão única.

---

### KEV

O catálogo Known Exploited Vulnerabilities reúne vulnerabilidades com evidência de exploração conhecida.

Se um componente do runtime aparece no KEV:

```text
escalonar imediatamente;

confirmar versão;

localizar caminho;

aplicar correção
ou mitigação urgente.
```

Uma suppression não deve esconder esse status.

---

### EPSS

EPSS estima a probabilidade de atividade de exploração de uma CVE nos próximos trinta dias.

Ele ajuda a priorizar.

Ele não mede impacto e não considera o ambiente específico da API.

Use junto com:

- CVSS;
- KEV;
- exposição;
- reachability;
- impacto.

---

### Reachability

Uma biblioteca vulnerável pode estar presente sem que a API execute o caminho afetado.

A análise precisa verificar:

- classes usadas;
- feature habilitada;
- configuração;
- protocolo;
- formato de input;
- endpoint exposto;
- condições do advisory.

A conclusão:

```text
not reachable
```

exige evidência.

Ausência de teste reproduzindo exploit não prova ausência de reachability.

---

### Falso positivo

Falso positivo ocorre quando o scanner associa um finding que não se aplica.

Exemplos:

- CPE incorreto;
- artifact de mesmo nome;
- versão fora da faixa;
- componente diferente;
- classifier não afetado.

A resposta adequada pode ser suppression precisa.

---

### Falso negativo

Scanner também pode não detectar:

- advisory recente;
- componente sem metadata;
- biblioteca sombreada;
- código copiado;
- imagem base;
- plugin;
- dependência carregada dinamicamente.

Um relatório sem findings não prova ausência de vulnerabilidades.

---

### Remediação

Opções, em ordem de preferência:

1. atualizar o parent ou BOM;
2. atualizar a dependência direta;
3. remover a dependência;
4. excluir a transitiva e adicionar versão corrigida;
5. desabilitar a feature vulnerável;
6. restringir exposição;
7. aplicar mitigação temporária;
8. aceitar risco com owner e validade.

Override de versão gerenciada precisa de testes de compatibilidade.

---

### Suppression

Suppression é uma instrução ao scanner.

Ela não apaga a vulnerabilidade do mundo.

Toda rule precisa possuir:

- artifact preciso;
- CVE ou CPE preciso;
- reason;
- owner;
- ticket;
- evidence;
- expiração.

Rules amplas são proibidas.

Exemplos proibidos:

```text
qualquer CVE abaixo de um score;

regex que cobre todo o group;

suppression sem prazo;

notes sem responsável.
```

---

### Risk register

O risk register mantém findings que exigem decisão.

Estados:

```text
OPEN;

REMEDIATING;

FALSE_POSITIVE;

NOT_AFFECTED;

ACCEPTED_TEMPORARILY;

RESOLVED.
```

Decisões temporárias expiram.

Findings resolvidos mantêm histórico.

---

## Mão na massa guiada

### 1. Inspecionar a árvore textual

Na raiz do projeto:

```powershell
.\mvnw.cmd `
  org.apache.maven.plugins:maven-dependency-plugin:3.11.0:tree
```

A saída mostra:

- dependências diretas;
- transitivas;
- scope;
- versões mediadas;
- caminhos.

---

### 2. Gerar árvore JSON

```powershell
.\mvnw.cmd `
  org.apache.maven.plugins:maven-dependency-plugin:3.11.0:tree `
  -DoutputType=json `
  -DoutputFile=target/dependency-tree.json
```

O JSON será artifact de CI.

Não será commitado em `target`.

---

### 3. Localizar uma transitiva

Quando um relatório apontar:

```text
group:artifact.
```

Execute:

```powershell
.\mvnw.cmd `
  dependency:tree `
  "-Dincludes=group:artifact"
```

Registre o caminho introdutor no risk register.

---

### 4. Gerar o effective POM

```powershell
.\mvnw.cmd `
  help:effective-pom `
  -Doutput=target/effective-pom.xml
```

Use-o para descobrir:

- versão gerenciada;
- parent;
- plugin efetivo;
- profile ativo;
- repository.

Não use o arquivo como configuração de origem.

---

### 5. Fixar versões dos plugins

No `pom.xml`:

```xml
<properties>
    <maven-dependency-plugin.version>
        3.11.0
    </maven-dependency-plugin.version>

    <dependency-check.version>
        12.2.2
    </dependency-check.version>

    <cyclonedx-maven-plugin.version>
        2.9.2
    </cyclonedx-maven-plugin.version>
</properties>
```

Plugin version também é parte da supply chain.

---

### 6. Adicionar CycloneDX

```xml
<plugin>
    <groupId>org.cyclonedx</groupId>
    <artifactId>
        cyclonedx-maven-plugin
    </artifactId>
    <version>
        ${cyclonedx-maven-plugin.version}
    </version>

    <executions>
        <execution>
            <id>generate-sbom</id>
            <phase>package</phase>
            <goals>
                <goal>makeAggregateBom</goal>
            </goals>
        </execution>
    </executions>

    <configuration>
        <projectType>
            application
        </projectType>
        <schemaVersion>1.6</schemaVersion>
        <includeBomSerialNumber>
            true
        </includeBomSerialNumber>
        <includeCompileScope>
            true
        </includeCompileScope>
        <includeRuntimeScope>
            true
        </includeRuntimeScope>
        <includeTestScope>
            false
        </includeTestScope>
        <outputFormat>all</outputFormat>
        <outputName>bom</outputName>
    </configuration>
</plugin>
```

A geração produz JSON e XML.

---

### 7. Gerar a SBOM

```powershell
.\mvnw.cmd clean package
```

Valide:

```powershell
Get-Item `
  target/bom.json,
  target/bom.xml
```

A SBOM acompanha o artifact da mesma execução.

---

### 8. Inspecionar a SBOM

```powershell
$bom =
  Get-Content `
    target/bom.json `
    -Raw |
  ConvertFrom-Json

$bom.specVersion
$bom.metadata.component.name
$bom.components.Count
```

Procure um artifact conhecido:

```powershell
$bom.components |
  Where-Object {
    $_.group -eq "org.springframework.security"
  } |
  Select-Object `
    group,
    name,
    version,
    purl
```

---

### 9. Criar o runbook da SBOM

Arquivo:

```text
docs/security/M15_SBOM_RUNBOOK.md
```

Inclua:

- comando de geração;
- artifact relacionado;
- commit SHA;
- build ID;
- data;
- formato;
- local de armazenamento;
- acesso;
- retenção;
- uso em incidente;
- regeneração.

SBOM pode revelar a arquitetura tecnológica.

Não a publique sem decisão.

---

### 10. Criar o profile SCA

No `pom.xml`:

```xml
<profile>
    <id>security-sca</id>

    <build>
        <plugins>
            <plugin>
                <groupId>org.owasp</groupId>
                <artifactId>
                    dependency-check-maven
                </artifactId>
                <version>
                    ${dependency-check.version}
                </version>

                <executions>
                    <execution>
                        <id>
                            dependency-vulnerability-check
                        </id>
                        <phase>verify</phase>
                        <goals>
                            <goal>check</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</profile>
```

A configuração será adicionada no próximo passo.

---

### 11. Configurar o Dependency-Check

Dentro do plugin:

```xml
<configuration>
    <failOnError>true</failOnError>
    <failBuildOnCVSS>
        8.0
    </failBuildOnCVSS>

    <formats>
        <format>HTML</format>
        <format>JSON</format>
        <format>SARIF</format>
    </formats>

    <prettyPrint>true</prettyPrint>

    <skipTestScope>
        true
    </skipTestScope>

    <knownExploitedEnabled>
        true
    </knownExploitedEnabled>

    <ossIndexAnalyzerEnabled>
        false
    </ossIndexAnalyzerEnabled>

    <nvdApiKeyEnvironmentVariable>
        NVD_API_KEY
    </nvdApiKeyEnvironmentVariable>

    <suppressionFiles>
        <suppressionFile>
            ${project.basedir}/security/dependency-check-suppressions.xml
        </suppressionFile>
    </suppressionFiles>

    <failBuildOnUnusedSuppressionRule>
        true
    </failBuildOnUnusedSuppressionRule>
</configuration>
```

OSS Index fica desabilitado porque esta aula não configurará sua autenticação.

---

### 12. Criar a NVD API key

Solicite a chave pelo processo oficial da NVD.

No runtime local:

```powershell
$env:NVD_API_KEY =
  Read-Host `
    "NVD API key"
```

Não use:

```powershell
Write-Host $env:NVD_API_KEY
```

No CI, armazene como secret protegido.

---

### 13. Não passar a key como propriedade

Evite:

```powershell
-DnvdApiKey=valor
```

Evite também colocar o valor no `pom.xml`.

Debug Maven pode expor configurações sensíveis.

A baseline utiliza:

```text
nvdApiKeyEnvironmentVariable.
```

---

### 14. Atualizar a base separadamente

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  org.owasp:dependency-check-maven:12.2.2:update-only
```

A primeira atualização pode ser longa.

Execuções seguintes reutilizam o cache.

---

### 15. Planejar cache de CI

Cacheie o diretório de dados do Dependency-Check entre jobs confiáveis.

A chave de cache inclui:

- sistema operacional;
- versão do Dependency-Check;
- versão do schema de dados.

Não compartilhe cache gravável entre builds não confiáveis.

Para operação madura, avalie espelho interno da NVD.

---

### 16. Executar o scan

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Esperado:

```text
testes;

package;

SBOM;

Dependency-Check;

gate.
```

Um erro do scanner falha o job.

Não transforme indisponibilidade em build verde.

---

### 17. Abrir o relatório HTML

```powershell
Start-Process `
  target/dependency-check-report.html
```

Revise:

- dependency;
- identifiers;
- CPE;
- PURL;
- CVE;
- CVSS;
- references;
- evidence;
- KEV quando disponível.

O HTML serve à triagem.

JSON e SARIF servem à automação.

---

### 18. Criar suppression XML vazio

Arquivo:

```text
security/dependency-check-suppressions.xml
```

Conteúdo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<suppressions
  xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.4.xsd"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="
    https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.4.xsd
    https://dependency-check.github.io/DependencyCheck/dependency-suppression.1.4.xsd">
</suppressions>
```

O arquivo começa sem regras.

---

### 19. Definir a policy de suppression

Documento:

```text
docs/security/M15_DEPENDENCY_RISK_POLICY.md
```

Uma rule futura precisa conter nas notes:

```text
ticket;

owner;

reason;

evidence;

compensatingControl;

reviewDate.
```

O elemento `<suppress>` precisa usar:

```text
until.
```

E selecionar exatamente:

- PURL ou GAV;
- CVE, vulnerabilityName ou CPE.

---

### 20. Proibir suppressions amplas

O policy test rejeita:

```text
cvssBelow;

cvssScore sem artifact;

vulnerabilityName regex ".*";

GAV que cobre group inteiro;

filePath genérico;

rule sem until;

rule expirada.
```

Suppression é exceção estreita.

---

### 21. Criar o risk register

Arquivo:

```text
security/dependency-risk-register.yaml
```

Estado inicial:

```yaml
version: 1
findings: []
```

A ausência de finding significa apenas:

```text
nenhuma decisão aberta
registrada neste momento.
```

Ela não prova segurança absoluta.

---

### 22. Definir o schema do finding

Quando houver finding:

```yaml
- id: CVE-2026-0001
  component: pkg:maven/org.example/component@1.2.3
  scope: runtime
  introducedBy:
    - org.example:starter:4.5.6
  cvss:
    version: "4.0"
    score: 8.7
    vector: "CVSS:4.0/..."
  knownExploited: false
  epss:
    score: 0.12
    observedAt: 2026-07-11
  reachable: REVIEW_REQUIRED
  exposure: INTERNET_FACING
  decision: REMEDIATING
  owner: backend-platform
  ticket: SEC-2026-042
  dueDate: 2026-07-18
  evidence:
    - vendor-advisory
  compensatingControls:
    - vulnerable-feature-disabled
```

O exemplo é sintético.

Não invente um CVE real no registro.

---

### 23. Criar DependencyRiskRegisterTest

O teste valida:

- versão conhecida;
- ID no formato CVE;
- PURL;
- scope;
- CVSS version e vector;
- owner;
- ticket;
- due date;
- decisão válida;
- evidence;
- data EPSS quando presente;
- findings abertos não vencidos.

Também valida:

```text
knownExploited=true:
não pode ser
ACCEPTED_TEMPORARILY
sem aprovação de emergência.
```

A baseline mais segura bloqueia esse estado.

---

### 24. Criar DependencySuppressionPolicyTest

Use parser XML seguro.

Desabilite:

- DTD;
- external entities;
- external schema fetch durante o teste.

Valide cada `<suppress>`:

- `until`;
- data futura;
- notes;
- owner;
- ticket;
- reason;
- matcher preciso;
- finding correspondente no register.

Uma suppression sem risk register falha.

---

### 25. Criar DependencyBuildPolicyTest

Leia o `pom.xml`.

Rejeite:

```text
LATEST;

RELEASE;

version range;

system scope;

repository HTTP;

plugin sem versão
fora do gerenciamento aprovado.
```

Permita dependências sem versão quando ela vem do BOM do Spring Boot.

O teste não tenta reimplementar todo o Maven.

Ele cria guardrails para padrões conhecidos.

---

### 26. Triar um finding

Para cada finding:

1. confirmar artifact e versão;
2. localizar caminho transitivo;
3. ler advisory do fornecedor;
4. confirmar faixa afetada;
5. verificar runtime ou test;
6. verificar feature;
7. verificar reachability;
8. consultar KEV;
9. consultar CVSS e vector;
10. consultar EPSS;
11. avaliar exposição e impacto;
12. decidir remediação.

Registre evidências.

---

### 27. Atualizar pelo BOM

Quando a correção está disponível em uma release do Spring Boot:

```text
preferir atualizar
o parent ou BOM.
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Isso preserva versões testadas em conjunto.

---

### 28. Override temporário

Quando o BOM ainda não foi atualizado, um override pode ser necessário.

Requisitos:

- versão corrigida confirmada;
- compatibilidade analisada;
- testes completos;
- comentário no POM;
- ticket;
- data de remoção;
- revisão da próxima release do BOM.

Não acumule overrides permanentes.

---

### 29. Excluir transitiva

Quando a transitiva não é necessária:

```xml
<exclusions>
    <exclusion>
        <groupId>
            org.example
        </groupId>
        <artifactId>
            vulnerable-component
        </artifactId>
    </exclusion>
</exclusions>
```

Depois confirme:

```powershell
.\mvnw.cmd `
  dependency:tree `
  "-Dincludes=org.example:vulnerable-component"
```

Ausência na tree precisa ser confirmada no artifact e SBOM.

---

### 30. Remover dependência não utilizada

Antes de atualizar, pergunte:

```text
o projeto ainda precisa
desse componente?
```

Remover reduz:

- superfície;
- tamanho;
- CVEs futuros;
- licenças;
- complexidade.

Execute testes após remoção.

---

### 31. Criar SLAs internos

Baseline didática:

| Situação | Ação |
|---|---|
| KEV ou exploração confirmada | escalonamento imediato e bloqueio de release |
| Critical alcançável e exposta | correção emergencial |
| High alcançável | correção prioritária |
| Medium | correção planejada |
| Low | backlog revisado |

Prazos concretos pertencem à policy aprovada da organização.

---

### 32. Configurar Dependabot

Arquivo:

```text
.github/dependabot.yml
```

Conteúdo:

```yaml
version: 2

updates:
  - package-ecosystem: maven
    directory: /labs/m14/aula-357-spring-initializr-estrutura-projeto
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    groups:
      spring:
        patterns:
          - "org.springframework*"
          - "org.springframework.boot*"
          - "org.springframework.security*"
```

PR automático não substitui review e testes.

---

### 33. Habilitar security updates

No repositório GitHub:

```text
dependency graph;

Dependabot alerts;

Dependabot security updates.
```

Security update tenta abrir PR quando existe correção aplicável.

A disponibilidade depende da configuração e plano do repositório.

---

### 34. Revisar PR de dependência

Checklist:

- advisory;
- mudança direta ou transitiva;
- release notes;
- breaking changes;
- tests;
- SCA;
- SBOM;
- imagem;
- performance;
- rollback;
- owner.

Não faça auto-merge cego para major versions.

---

### 35. Armazenar artifacts de CI

Anexe:

```text
bom.json;

bom.xml;

dependency-check-report.html;

dependency-check-report.json;

dependency-check-report.sarif;

dependency-tree.json.
```

Não anexe:

- NVD API key;
- Maven settings com credentials;
- cache completo público;
- logs de debug;
- repository token.

Defina retenção dos artifacts.

---

### 36. Atualizar o threat model

Adicione:

```text
THR-229:
dependência transitiva vulnerável
não é conhecida.

THR-230:
plugin sem versão muda o build.

THR-231:
scanner indisponível
gera build verde.

THR-232:
CPE incorreto causa
suppression ampla.

THR-233:
finding KEV é priorizado
somente pelo CVSS.

THR-234:
SBOM não acompanha
o artifact publicado.

THR-235:
NVD API key aparece
no log Maven.

THR-236:
cache de CI é envenenado.

THR-237:
override de versão
quebra compatibilidade.

THR-238:
suppression não expira.

THR-239:
PR automático entra
sem testes.

THR-240:
dependência removida
permanece na imagem.
```

Controles:

- tree;
- versões fixas;
- failOnError;
- matcher preciso;
- KEV;
- artifact do build;
- env secret;
- cache confiável;
- suíte completa;
- until;
- review;
- SBOM final.

---

### 37. Atualizar OWASP e baseline

A03 Software Supply Chain Failures:

```text
dependency inventory:
versionado.

SCA:
automatizada.

SBOM:
gerada.

updates:
monitorados.

suppressions:
governadas.
```

A02 Security Misconfiguration:

```text
version ranges:
proibidas.

repositories HTTP:
proibidos.

scanner failure:
não ignorado.
```

A09 Security Logging:

```text
reports:
artifacts controlados.

API keys:
fora dos logs.

findings:
sem dados pessoais.
```

Baseline:

```text
Maven tree:
inspecionável.

SBOM:
CycloneDX.

SCA:
Dependency-Check.

NVD key:
secret.

KEV:
prioridade.

CVSS:
input, não risco final.

suppression:
precisa e temporária.

produção pública:
NO-GO.
```

---

### 38. Executar o gate

Inventário:

```powershell
.\mvnw.cmd `
  dependency:tree

.\mvnw.cmd `
  help:effective-pom `
  -Doutput=target/effective-pom.xml
```

Build e SBOM:

```powershell
.\mvnw.cmd clean package
```

SCA:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Policy tests:

```powershell
.\mvnw.cmd `
  -Dtest=DependencySuppressionPolicyTest,DependencyRiskRegisterTest,DependencyBuildPolicyTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Confirme:

- tree;
- effective POM;
- SBOM;
- report HTML;
- report JSON;
- SARIF;
- threshold;
- KEV review;
- risk register;
- suppressions;
- API key ausente dos logs;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### O classpath ficou visível

Dependências diretas e transitivas passaram a ser inspecionáveis.

### BOM e SBOM foram separados

Uma gerencia versões; a outra inventaria o artifact.

### O scanner entrou no build

Findings severos e falhas do scanner impedem um verde falso.

### CVSS deixou de ser decisão única

KEV, EPSS, reachability, exposição e impacto entraram na triagem.

### Suppressions ganharam governança

Toda exceção possui matcher, owner, ticket, evidência e validade.

### O risk register preservou contexto

Decisões temporárias e findings resolvidos permanecem rastreáveis.

### Atualizações ganharam automação

Dependabot ajuda a abrir PRs, mas review e testes continuam obrigatórios.

### Artifacts apoiam incidentes

Tree, SBOM e reports permitem responder rapidamente a novos advisories.

---

## Erros comuns importantes

### Ver apenas dependências diretas

A vulnerabilidade pode vir de uma transitiva.

### Confundir BOM e SBOM

Dependency management não é inventário do artifact.

### Tratar CVSS como risco completo

O score não conhece o ambiente.

### Suprimir para deixar o build verde

A exceção pode esconder risco real.

### Usar suppression sem expiração

A justificativa fica eterna.

### Colocar NVD key no POM

Debug e artifacts podem expor a credencial.

### Ignorar falha do scanner

Build verde sem scan é falsa confiança.

### Commitar target

Reports mudam com feeds e poluem o histórico.

### Atualizar transitiva sem testes

Overrides podem quebrar compatibilidade.

### Confiar somente em uma fonte

Advisories e bases possuem atrasos e diferenças.

---

## Comandos úteis

### Árvore de dependências

```powershell
.\mvnw.cmd `
  dependency:tree
```

### Filtrar artifact

```powershell
.\mvnw.cmd `
  dependency:tree `
  "-Dincludes=group:artifact"
```

### Effective POM

```powershell
.\mvnw.cmd `
  help:effective-pom `
  -Doutput=target/effective-pom.xml
```

### Gerar SBOM

```powershell
.\mvnw.cmd clean package
```

### Executar SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

### Atualizar base

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  org.owasp:dependency-check-maven:12.2.2:update-only
```

---

## Exercício guiado

### Parte 1 — Inventário

Gere tree e effective POM.

### Parte 2 — SBOM

Gere CycloneDX JSON e XML.

### Parte 3 — Scanner

Configure Dependency-Check no profile.

### Parte 4 — Secret

Passe NVD key por environment variable.

### Parte 5 — Gate

Falhe o build em severidade aprovada.

### Parte 6 — Triagem

Avalie CVSS, KEV, EPSS e reachability.

### Parte 7 — Risk register

Registre owner, ticket, prazo e evidências.

### Parte 8 — Suppression

Crie somente regras precisas e temporárias.

### Parte 9 — Atualização

Corrija por BOM, versão, exclusão ou remoção.

### Parte 10 — Automação

Configure Dependabot e artifacts de CI.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 441 foi preservada;
- dependências diretas e transitivas foram diferenciadas;
- scopes foram considerados;
- BOM e SBOM foram diferenciadas;
- tree e effective POM foram gerados;
- versões dos plugins foram fixadas;
- SBOM CycloneDX JSON e XML foi gerada;
- SBOM acompanha o artifact do build;
- Dependency-Check `12.2.2` foi configurado;
- profile `security-sca` foi criado;
- HTML, JSON e SARIF foram gerados;
- `failOnError` ficou ativo;
- threshold `8.0` foi marcado como baseline;
- KEV foi habilitado e priorizado;
- OSS Index não foi usado sem autenticação;
- NVD key não aparece no POM ou command line;
- environment variable foi utilizada;
- cache e mirror foram documentados;
- CVE, CPE, GAV e PURL foram explicados;
- CVSS foi tratado como severidade;
- versão e vector CVSS são registrados;
- EPSS foi tratado como sinal adicional;
- reachability exige evidência;
- falsos positivos e negativos foram considerados;
- risk register foi criado;
- decisões e estados foram definidos;
- suppressions começam vazias;
- suppressions amplas foram proibidas;
- toda suppression possui expiração e finding correspondente;
- rules não usadas falham o build;
- updates por BOM foram preferidos;
- overrides exigem prazo e testes;
- exclusão transitiva exige nova tree e SBOM;
- Dependabot foi configurado;
- PR automático continua sujeito a review;
- artifacts de CI foram definidos;
- threat model e OWASP foram atualizados;
- SAST e DAST não foram antecipados;
- produção pública permaneceu NO-GO;
- gate completo foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check

git grep `
  -n `
  -E `
  "LATEST|RELEASE|nvdApiKey>|cvssBelow|ignore.*vulner"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/pom.xml `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/security `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/src/test `
  .github/dependabot.yml `
  docs/security `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Confirme que não aparecem:

```text
target;

NVD API key;

settings.xml;

Dependency-Check data cache;

reports gerados.
```

Commit recomendado:

```powershell
git commit -m "build(m15): analisar dependencias e gerar sbom"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- API key;
- cache da NVD;
- token de registry;
- Maven settings;
- reports com path local;
- suppression sem ticket;
- finding real não revisado;
- artifact `target`.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a supply chain da API passou a ser observável.

O inventário ficou:

```text
dependency tree;

effective POM;

SBOM CycloneDX.
```

A detecção ficou:

```text
OWASP Dependency-Check;

NVD;

CISA KEV;

advisories.
```

A priorização passou a considerar:

```text
CVSS;

KEV;

EPSS;

reachability;

exposição;

impacto;

controles.
```

A governança ficou:

```text
risk register;

owner;

ticket;

prazo;

suppression temporária;

gate;

Dependabot;

artifacts de CI.
```

A decisão central foi:

```text
um relatório de SCA
não é uma decisão de risco;

ele é a entrada
de um processo rastreável
de confirmação,
priorização,
remediação
e verificação.
```

A aplicação agora conhece melhor os componentes que carrega.

O próximo passo é organizar testes que comprovem os controles de segurança construídos ao longo do módulo.

A próxima aula será:

```text
443 - M15.33 - Testes de seguranca
```

Nela, você irá:

- criar uma estratégia de testes de segurança;
- separar unit, integration e policy tests;
- testar autenticação;
- testar errors seguros;
- testar rate limiting;
- testar multi-tenancy;
- testar privacidade;
- testar supply chain;
- usar fixtures maliciosas;
- criar uma matriz ameaça-controle-teste.

---

# Material complementar

## Checkpoint final

- [ ] Gerei dependency tree e effective POM.
- [ ] Gerei SBOM CycloneDX.
- [ ] Executei Dependency-Check com secret seguro.
- [ ] Criei risk register e policy de suppression.
- [ ] Configurei gate, artifacts e atualização automática.

---

## Troubleshooting adicional

### O primeiro scan demora muito

A base da NVD precisa ser baixada e processada.

Use API key, cache confiável e, em operação madura, mirror interno.

### O scan retorna 403

Revise API key, rate limits, cache e concorrência de jobs.

Não imprima a key com Maven debug.

### O report aponta artifact inexistente no POM

Ele provavelmente é transitivo.

Use `dependency:tree -Dincludes`.

### O finding parece incorreto

Confirme GAV, PURL, CPE, versão e advisory.

Não crie suppression antes da triagem.

### Uma suppression expirou

O build deve falhar.

Reabra a decisão e remova, renove com aprovação ou corrija o componente.

### O SBOM contém dependências de teste

Revise `includeTestScope`.

### O build falha sem acesso à NVD

A policy escolheu fail-closed para o scanner.

Use cache ou mirror, não desabilite silenciosamente.

### Dependabot abriu PR incompatível

Revise release notes, BOM, testes e rollback.

Não faça merge automático cego.

---

## Perguntas de revisão

1. O que é dependência direta?
2. O que é transitiva?
3. Como localizar o caminho introdutor?
4. BOM e SBOM são iguais?
5. O que uma SBOM registra?
6. SBOM prova segurança?
7. O que é CVE?
8. O que é CPE?
9. O que é PURL?
10. CVSS mede risco completo?
11. O que o KEV indica?
12. O que o EPSS estima?
13. O que é reachability?
14. Scanner pode gerar falso positivo?
15. Scanner pode gerar falso negativo?
16. Quando usar suppression?
17. Suppression pode ser eterna?
18. Onde fica a NVD key?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Declarada no POM.
2. Introduzida por outra dependência.
3. Com `dependency:tree`.
4. Não.
5. Componentes, versões e relações.
6. Não.
7. Identificador de vulnerabilidade.
8. Identificador de produto.
9. Package URL.
10. Não.
11. Exploração conhecida.
12. Probabilidade de exploração em trinta dias.
13. Se o caminho vulnerável é alcançável.
14. Sim.
15. Sim.
16. Após confirmar falso positivo ou exceção aprovada.
17. Não.
18. Em secret do runtime ou CI.
19. Testes de seguranca.
20. Estratégia e suíte de controles.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 442 - M15.32 - Vulnerabilidades em dependencias

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei dependências diretas e transitivas.
- Revisei scopes de Maven.
- Gerei a árvore de dependências.
- Gerei o effective POM.
- Fixei Maven Dependency Plugin `3.11.0`.
- Diferenciei dependency BOM e SBOM.
- Configurei CycloneDX Maven Plugin `2.9.2`.
- Gerei `bom.json` e `bom.xml`.
- Criei o runbook da SBOM.
- Fixei OWASP Dependency-Check `12.2.2`.
- Criei o profile `security-sca`.
- Gerei reports HTML, JSON e SARIF.
- Configurei `failOnError`.
- Adotei CVSS `8.0` como baseline didática.
- Habilitei análise de Known Exploited Vulnerabilities.
- Não configurei OSS Index sem autenticação.
- Passei a NVD API key por environment variable.
- Não coloquei secrets no POM ou command line.
- Planejei cache e mirror da NVD.
- Diferenciei CVE, CPE, GAV e PURL.
- Tratei CVSS como severidade, não risco completo.
- Registrei versão e vector CVSS.
- Usei KEV como prioridade de exploração conhecida.
- Usei EPSS como sinal adicional.
- Avaliei reachability, exposição e impacto.
- Registrei falsos positivos e falsos negativos.
- Criei `dependency-risk-register.yaml`.
- Criei `dependency-check-suppressions.xml` vazio.
- Proibi suppressions amplas e sem expiração.
- Criei `DependencySuppressionPolicyTest`.
- Criei `DependencyRiskRegisterTest`.
- Criei `DependencyBuildPolicyTest`.
- Preferi atualização do parent ou BOM.
- Documentei overrides temporários e exclusions.
- Configurei Dependabot para Maven.
- Defini artifacts de CI para tree, SBOM e reports.
- Criei `M15_DEPENDENCY_VULNERABILITY_MANAGEMENT.md`.
- Criei `M15_DEPENDENCY_RISK_POLICY.md`.
- Criei `M15_SBOM_RUNBOOK.md`.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Testes de seguranca.
```

---

## Referência técnica curta

- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [Dependency-Check Maven Plugin 12.2.2](https://dependency-check.github.io/DependencyCheck/dependency-check-maven/plugin-info.html)
- [Dependency-Check Suppressions](https://dependency-check.github.io/DependencyCheck/general/suppression.html)
- [Apache Maven Dependency Plugin — dependency:tree](https://maven.apache.org/plugins/maven-dependency-plugin/tree-mojo.html)
- [CycloneDX Maven Plugin](https://github.com/CycloneDX/cyclonedx-maven-plugin)
- [CycloneDX Specification](https://cyclonedx.org/specification/overview/)
- [NVD Vulnerability APIs](https://nvd.nist.gov/developers/vulnerabilities)
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [FIRST CVSS v4.0](https://www.first.org/cvss/v4.0/)
- [FIRST EPSS](https://www.first.org/epss/)
- [GitHub Dependabot Security Updates](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates)

Regra final:

```text
vulnerabilidades em dependências devem ser tratadas como gestão contínua de supply chain: o build precisa conhecer dependências diretas e transitivas, gerar SBOM ligada ao artifact, executar SCA com fontes atualizadas e secret seguro, priorizar CVSS junto com KEV, EPSS, reachability, exposição e impacto, registrar decisões com owner e prazo, permitir somente suppressions precisas e temporárias e bloquear releases quando o risco aprovado ou o próprio scanner impedir uma decisão confiável.
```
