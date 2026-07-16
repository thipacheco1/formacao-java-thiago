# 678 - M20.08 - Configuracao repositorio profissional

## Apresentação da aula

Na aula 677, você formalizou as principais decisões arquiteturais do OrderFlow.

O projeto passou a possuir ADRs para:

- aplicação Java modular com workers assíncronos;
- PostgreSQL como autoridade;
- Outbox e Inbox;
- Integration Gateway;
- schema lógico com ownership;
- orquestração orientada a eventos;
- projection operacional;
- optimistic locking;
- acesso com escopo de tenant;
- OpenTelemetry;
- Idempotency Registry;
- migrations com expand-contract.

Essas decisões já possuem:

- contexto;
- alternativas;
- consequências;
- evidências;
- owners;
- review triggers;
- rastreabilidade;
- status;
- histórico.

Agora o projeto precisa de um repositório capaz de sustentar essas decisões.

Um repositório profissional não é apenas uma pasta que contém código.

Ele funciona como:

```text
porta de entrada do projeto;

fonte de orientacao;

limite de ownership;

mecanismo de qualidade;

historico de decisoes;

contrato de contribuicao;

ponto de automacao;

base do portfolio.
```

O erro comum seria criar uma estrutura extensa sem relação com a arquitetura.

Outro erro seria configurar dezenas de ferramentas antes de existir código.

Também seria inadequado copiar arquivos de outro projeto sem compreender:

- o que protegem;
- quem os mantém;
- qual risco reduzem;
- como são validados;
- quando precisam ser alterados.

Nesta aula, o repositório será configurado de forma progressiva.

A estrutura precisa refletir o C4:

```text
aplicacoes executaveis;

bibliotecas compartilhadas;

contratos;

adapters;

testes;

documentacao;

automacoes.
```

A configuração também precisa preservar o próximo passo.

A aula 679 implementará o domínio.

Por isso, nesta aula serão criados:

- módulos Maven vazios e compiláveis;
- convenções;
- arquivos de governança;
- templates;
- quality gates;
- documentação;
- automação de validação;
- marcadores de arquitetura.

Não serão implementados:

- `OrderProcess`;
- value objects do domínio;
- invariantes;
- commands;
- domain events;
- repositories;
- controllers;
- consumers;
- providers;
- migrations funcionais.

O laboratório será:

```text
labs/m20/aula-678-configuracao-repositorio-profissional/orderflow
```

Você criará:

- Repository Charter;
- monorepo Maven;
- módulos alinhados ao C4;
- Maven Wrapper;
- `.editorconfig`;
- `.gitattributes`;
- `.gitignore`;
- convenção de packages;
- convenção de branches;
- Conventional Commits;
- pull request template;
- issue forms;
- CODEOWNERS;
- política de contribuição;
- política de segurança;
- documentação inicial;
- quality gates;
- workflow de CI;
- scripts de validação;
- reports, evidence e gate.

A próxima aula será:

```text
679 - M20.09 - Implementacao dominio
```

Na aula 679, o módulo `orderflow-domain` receberá a implementação do aggregate, value objects, policies, domain events, erros e testes.

Nesta aula, o comportamento do domínio não será antecipado.

Regra central:

```text
um repositorio profissional
transforma arquitetura
em estrutura,
convenções,
ownership,
automacao
e feedback rapido.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
675:
Modelagem banco final.

676:
Arquitetura C4 final.

677:
ADRs do projeto.

678:
Configuracao repositorio profissional.

679:
Implementacao dominio.

680:
Implementacao repositorio JPA.
```

Até agora, o projeto foi planejado e modelado.

A partir da aula 679, a implementação começará.

A configuração desta aula precisa permitir que as próximas entregas sejam:

- pequenas;
- revisáveis;
- testáveis;
- rastreáveis;
- reproduzíveis;
- seguras;
- publicáveis.

A estrutura do repositório não deve contradizer:

- bounded context;
- C4;
- ownership de dados;
- ADRs;
- multi-tenancy;
- separação entre domínio e infraestrutura;
- responsabilidade dos workers.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-678-configuracao-repositorio-profissional
└── orderflow
    ├── .github
    │   ├── CODEOWNERS
    │   ├── pull_request_template.md
    │   ├── ISSUE_TEMPLATE
    │   │   ├── bug.yml
    │   │   ├── architecture-decision.yml
    │   │   ├── improvement.yml
    │   │   └── config.yml
    │   └── workflows
    │       └── quality.yml
    ├── .mvn
    │   └── wrapper
    ├── apps
    │   ├── orderflow-api
    │   ├── orchestration-worker
    │   ├── integration-gateway
    │   ├── outbox-publisher
    │   └── projection-worker
    ├── libs
    │   ├── orderflow-domain
    │   ├── orderflow-application
    │   ├── orderflow-contracts
    │   ├── orderflow-persistence
    │   └── orderflow-observability
    ├── tests
    │   ├── architecture-tests
    │   ├── integration-tests
    │   └── end-to-end-tests
    ├── docs
    │   ├── architecture
    │   │   ├── adr
    │   │   ├── c4
    │   │   └── decisions
    │   ├── engineering
    │   │   ├── BUILDING.md
    │   │   ├── TESTING.md
    │   │   ├── BRANCHING.md
    │   │   ├── COMMITS.md
    │   │   ├── QUALITY_GATES.md
    │   │   └── DEPENDENCY_POLICY.md
    │   ├── operations
    │   │   ├── RUNBOOK_INDEX.md
    │   │   └── OBSERVABILITY.md
    │   ├── product
    │   │   ├── FUNCTIONAL_SCOPE.md
    │   │   └── BACKLOG_TRACEABILITY.md
    │   └── security
    │       ├── SECURITY_MODEL.md
    │       └── DATA_CLASSIFICATION.md
    ├── scripts
    │   ├── validate-repository.ps1
    │   ├── validate-architecture.ps1
    │   ├── validate-documentation.ps1
    │   ├── validate-secrets.ps1
    │   └── collect-repository-evidence.ps1
    ├── .editorconfig
    ├── .gitattributes
    ├── .gitignore
    ├── CONTRIBUTING.md
    ├── SECURITY.md
    ├── LICENSE
    ├── README.md
    ├── mvnw
    ├── mvnw.cmd
    └── pom.xml
```

---

## Conceito essencial

### Estrutura deve refletir arquitetura

Se o C4 mostra cinco aplicações executáveis, o repositório deve deixar essas unidades reconhecíveis.

Se o domínio não depende de framework, o módulo do domínio não deve depender de Spring.

Se o Integration Gateway isola providers, adapters externos não devem aparecer no módulo do domínio.

### Monorepo não significa monólito

Um monorepo pode conter múltiplos executáveis.

Vantagens para o OrderFlow:

- mudanças coordenadas;
- contracts próximos;
- uma pipeline;
- documentação central;
- refatoração segura;
- projeto mais simples de demonstrar;
- histórico único.

Custos:

- build maior;
- ownership precisa ser explícito;
- módulos podem se acoplar indevidamente;
- pipeline precisa evitar feedback lento.

### Quality gate é feedback automatizado

Um gate precisa proteger algo concreto.

Exemplos:

- compilação;
- testes;
- cobertura;
- regras arquiteturais;
- formatação;
- vulnerabilidades;
- secrets;
- documentação obrigatória;
- migrations;
- contratos.

Um gate que não gera ação clara vira ruído.

### Branch strategy precisa caber no projeto

Para um projeto individual com entregas frequentes:

```text
trunk-based development
com branches curtas.
```

A branch principal permanece integrável.

Branches longas aumentam conflito e escondem risco.

### Template deve melhorar a decisão

Um pull request template não deve obrigar texto inútil.

Ele precisa incentivar:

- contexto;
- mudança;
- teste;
- risco;
- evidência;
- rollback;
- impacto arquitetural.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-678-configuracao-repositorio-profissional/orderflow

Set-Location `
  labs/m20/aula-678-configuracao-repositorio-profissional/orderflow
```

---

### 2. Criar Repository Charter

Arquivo:

```text
docs/engineering/REPOSITORY_CHARTER.md
```

Conteúdo:

```text
Projeto

OrderFlow.

Objetivo

Fornecer uma estrutura
reproduzivel,
rastreavel,
segura
e adequada
a contribuicao profissional.

Principios

- architecture before convenience;
- short feedback loops;
- trunk remains releasable;
- ownership is explicit;
- documentation is code-adjacent;
- automation protects known risks;
- secrets never enter Git;
- domain implementation belongs to lesson 679.
```

---

### 3. Inicializar Git

Execute:

```powershell
git init

git branch `
  -M `
  main
```

Valide:

```powershell
git status
```

A branch `main` será a linha de integração.

---

### 4. Criar estrutura raiz

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  apps, libs, tests, docs, scripts, .github
```

Crie os subdiretórios conforme a árvore da aula.

Não crie código de domínio ainda.

---

### 5. Escolher monorepo Maven

Decisão aplicada:

```text
um parent POM;

modulos executaveis em apps;

bibliotecas em libs;

testes de sistema em tests.
```

Essa organização permite:

- dependências explícitas;
- build único;
- módulos compiláveis;
- separação de responsabilidade;
- evolução gradual.

---

### 6. Criar parent POM

Arquivo:

```text
pom.xml
```

Conteúdo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.formacao</groupId>
    <artifactId>orderflow-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <name>OrderFlow</name>
    <description>
        Plataforma multi-tenant de orquestracao de pedidos.
    </description>

    <properties>
        <java.version>21</java.version>
        <project.build.sourceEncoding>
            UTF-8
        </project.build.sourceEncoding>
        <project.reporting.outputEncoding>
            UTF-8
        </project.reporting.outputEncoding>
        <maven.compiler.release>
            ${java.version}
        </maven.compiler.release>
    </properties>

    <modules>
        <module>libs/orderflow-domain</module>
        <module>libs/orderflow-application</module>
        <module>libs/orderflow-contracts</module>
        <module>libs/orderflow-persistence</module>
        <module>libs/orderflow-observability</module>
        <module>apps/orderflow-api</module>
        <module>apps/orchestration-worker</module>
        <module>apps/integration-gateway</module>
        <module>apps/outbox-publisher</module>
        <module>apps/projection-worker</module>
        <module>tests/architecture-tests</module>
        <module>tests/integration-tests</module>
        <module>tests/end-to-end-tests</module>
    </modules>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>
                        org.apache.maven.plugins
                    </groupId>
                    <artifactId>
                        maven-compiler-plugin
                    </artifactId>
                    <version>3.13.0</version>
                </plugin>

                <plugin>
                    <groupId>
                        org.apache.maven.plugins
                    </groupId>
                    <artifactId>
                        maven-surefire-plugin
                    </artifactId>
                    <version>3.5.2</version>
                </plugin>

                <plugin>
                    <groupId>
                        org.apache.maven.plugins
                    </groupId>
                    <artifactId>
                        maven-failsafe-plugin
                    </artifactId>
                    <version>3.5.2</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

As versões são uma baseline controlada do curso, não uma afirmação de versão mais recente.

---

### 7. Criar módulos compiláveis

Cada módulo recebe um `pom.xml` mínimo.

Exemplo de `libs/orderflow-domain/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>br.com.formacao</groupId>
        <artifactId>orderflow-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../../pom.xml</relativePath>
    </parent>

    <artifactId>orderflow-domain</artifactId>

    <name>OrderFlow Domain</name>
</project>
```

Os outros módulos seguem o mesmo padrão.

---

### 8. Criar Maven Wrapper

Execute em uma instalação Maven compatível:

```powershell
mvn wrapper:wrapper
```

Depois valide:

```powershell
.\mvnw.cmd `
  --version
```

O wrapper reduz divergência entre ambientes.

---

### 9. Definir convenção de dependências

Arquivo:

```text
docs/engineering/DEPENDENCY_POLICY.md
```

Regras:

- `domain` não depende de Spring;
- `application` depende de `domain`;
- adapters dependem de ports;
- apps compõem módulos;
- módulos não acessam internals de outros;
- versões são centralizadas;
- dependência precisa de propósito;
- vulnerabilidade crítica bloqueia;
- dependência não usada é removida;
- SDK de provider fica no Gateway;
- biblioteca experimental exige ADR ou issue.

---

### 10. Criar mapa de dependências permitido

Arquivo:

```text
docs/architecture/decisions/MODULE_DEPENDENCY_MAP.md
```

Fluxo:

```text
apps
-> application
-> domain.

persistence
-> application ports
e domain mapping.

contracts
-> types publicaveis.

observability
-> instrumentation abstractions.

domain
-> Java Standard Library.
```

Proibido:

```text
domain -> Spring;

domain -> JPA;

domain -> broker;

domain -> provider SDK;

projection -> domain write;
```

---

### 11. Criar `.editorconfig`

Conteúdo:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.java]
indent_style = space
indent_size = 4
max_line_length = 100

[*.{xml,yml,yaml,json,md}]
indent_style = space
indent_size = 2

[*.ps1]
indent_style = space
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

---

### 12. Criar `.gitattributes`

Conteúdo:

```text
* text=auto eol=lf

*.cmd text eol=crlf
*.bat text eol=crlf
*.ps1 text eol=crlf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.pdf binary
*.jar binary
```

O arquivo reduz diffs provocados por final de linha.

---

### 13. Criar `.gitignore`

Conteúdo:

```text
target/
out/
build/

.idea/
*.iml
.vscode/

.env
.env.*
!.env.example

*.log
logs/

coverage/
site/

.DS_Store
Thumbs.db

*.jks
*.p12
*.pem
*.key

secrets/
local-data/
test-results/
```

Credenciais e material criptográfico não entram no Git.

---

### 14. Criar política de arquivos locais

Arquivo:

```text
docs/engineering/LOCAL_FILES_POLICY.md
```

Categorias:

- versionado;
- exemplo sanitizado;
- local ignorado;
- secret;
- artefato gerado;
- evidence publicável.

Exemplo:

```text
.env.example:
versionado e sem valor real.

.env:
local e ignorado.

report sanitizado:
versionado em docs/evidence.

raw production dump:
proibido.
```

---

### 15. Definir packages

Convenção:

```text
br.com.formacao.orderflow
```

Subpackages por intenção:

```text
domain;

application;

adapter.in.http;

adapter.in.messaging;

adapter.out.persistence;

adapter.out.provider;

bootstrap;

observability.
```

Evite packages genéricos:

```text
util;

common;

misc;

helpers.
```

---

### 16. Criar README raiz

O `README.md` deve conter:

- problema;
- visão;
- escopo;
- arquitetura resumida;
- estrutura do repositório;
- requisitos;
- como construir;
- como testar;
- como navegar;
- principais ADRs;
- status do projeto;
- evidências;
- licença.

Não apresente funcionalidades ainda não implementadas como prontas.

---

### 17. Criar status honesto no README

Exemplo:

```text
Status atual

Planejamento e arquitetura concluídos.

Implementação do domínio:
próxima etapa.

Integrações:
não implementadas.

Execução local completa:
ainda indisponível.
```

Transparência fortalece o portfólio.

---

### 18. Criar documentação de build

Arquivo:

```text
docs/engineering/BUILDING.md
```

Comandos:

```powershell
.\mvnw.cmd `
  clean `
  verify
```

Build de um módulo:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -am `
  verify
```

`-am` também constrói dependências necessárias.

---

### 19. Criar documentação de testes

Arquivo:

```text
docs/engineering/TESTING.md
```

Categorias:

```text
unit:
dominio e componentes isolados.

architecture:
dependencias e boundaries.

integration:
banco, broker e adapters.

contract:
APIs e eventos.

end-to-end:
jornadas.

recovery:
falhas, replay e rollback.
```

Nesta aula, apenas a estrutura é criada.

---

### 20. Definir trunk-based development

Arquivo:

```text
docs/engineering/BRANCHING.md
```

Branches:

```text
main;

feat/<descricao>;

fix/<descricao>;

docs/<descricao>;

chore/<descricao>;

refactor/<descricao>;

test/<descricao>.
```

Regras:

- branch curta;
- sincronização frequente;
- pull request pequeno;
- main sempre verificável;
- nenhuma branch de ambiente;
- nenhuma branch permanente de release nesta fase.

---

### 21. Definir Conventional Commits

Arquivo:

```text
docs/engineering/COMMITS.md
```

Tipos:

```text
feat;

fix;

docs;

test;

refactor;

perf;

build;

ci;

chore;

revert.
```

Exemplos:

```text
feat(domain): register OrderProcess

test(domain): cover invalid transitions

docs(adr): record optimistic locking decision

ci(quality): validate Maven build
```

---

### 22. Definir política de commits

Um commit deve:

- representar intenção única;
- compilar;
- manter testes relevantes;
- não misturar formatação com regra;
- não conter secret;
- possuir mensagem explicativa;
- ser reversível quando possível.

Não use:

```text
ajustes;

mudancas;

teste;

final.
```

---

### 23. Criar `CONTRIBUTING.md`

Inclua:

- pré-requisitos;
- setup;
- branching;
- commits;
- pull request;
- testes;
- documentação;
- segurança;
- ADR;
- review;
- Definition of Done.

O arquivo deve apontar para documentos detalhados, sem duplicar tudo.

---

### 24. Criar pull request template

Arquivo:

```text
.github/pull_request_template.md
```

Conteúdo:

```text
Resumo

Descreva a intenção da mudança.

Problema

Qual problema ou risco está sendo tratado?

Mudanças

Quais módulos e comportamentos foram alterados?

Validação

Quais comandos, testes e evidências foram executados?

Arquitetura

Existe impacto em boundary, C4, ADR, contrato ou ownership?

Segurança e dados

Existe impacto em tenant, autorização, secrets ou dados sensíveis?

Operação

Existe impacto em SLO, observabilidade, migration, rollout ou rollback?

Checklist

- build local passou;
- testes relevantes passaram;
- documentação foi atualizada;
- nenhuma credencial foi incluída;
- mudança está dentro do escopo.
```

---

### 25. Criar issue form de bug

Arquivo:

```text
.github/ISSUE_TEMPLATE/bug.yml
```

Campos:

- comportamento esperado;
- comportamento observado;
- passos de reprodução;
- ambiente;
- evidências sanitizadas;
- impacto;
- frequência;
- workaround;
- risco de tenant ou segurança.

Não solicite dump sensível.

---

### 26. Criar issue form de decisão arquitetural

Arquivo:

```text
.github/ISSUE_TEMPLATE/architecture-decision.yml
```

Campos:

- problema;
- contexto;
- decisão necessária;
- alternativas conhecidas;
- evidências;
- impacto;
- owner;
- prazo;
- ADRs relacionados;
- review trigger provável.

Esse form prepara um ADR sem substituí-lo.

---

### 27. Criar issue form de melhoria

Campos:

- outcome;
- usuário ou sistema afetado;
- valor;
- risco reduzido;
- critérios de aceite;
- evidence esperada;
- dependências;
- milestone.

---

### 28. Criar CODEOWNERS

Arquivo:

```text
.github/CODEOWNERS
```

Exemplo de papéis sintéticos:

```text
* @orderflow-maintainers

/libs/orderflow-domain/ @orderflow-domain-owners
/docs/architecture/ @orderflow-architecture-owners
/apps/integration-gateway/ @orderflow-integration-owners
/docs/security/ @orderflow-security-reviewers
/.github/ @orderflow-maintainers
```

Ao publicar o projeto, substitua os papéis sintéticos pelos owners reais do repositório.

---

### 29. Definir ownership para projeto individual

Mesmo com um único autor, CODEOWNERS documenta:

- área;
- responsabilidade;
- revisão necessária;
- evolução futura.

No repositório pessoal, um mesmo usuário pode representar múltiplos papéis.

Não invente aprovação independente inexistente.

---

### 30. Criar `SECURITY.md`

Inclua:

- como reportar vulnerabilidade;
- quais informações não publicar;
- prazo de resposta pretendido;
- tratamento privado;
- severidade;
- evidências sanitizadas;
- política de secrets;
- dependências;
- dados fictícios.

Não publique endereço real de segurança sem possuir esse canal.

---

### 31. Criar licença

Para um projeto de portfólio educacional, uma licença permissiva pode facilitar leitura e reutilização.

A escolha da licença deve considerar:

- intenção do autor;
- código de terceiros;
- uso comercial;
- atribuição;
- responsabilidade.

Registre a decisão.

Não copie licença sem compreender seu efeito.

---

### 32. Criar índice de arquitetura

Arquivo:

```text
docs/architecture/README.md
```

Links:

- System Context;
- Container View;
- Component Views;
- Dynamic Views;
- Deployment View;
- ADR Catalog;
- constraints;
- traceability;
- risks.

Esse índice evita documentos órfãos.

---

### 33. Migrar artefatos anteriores

Copie para o repositório:

```text
C4 sanitizado;

ADRs;

Functional Scope;

Backlog Traceability;

Database Model;

Domain Model;

Evidence catalogs.
```

Preserve:

- source of truth;
- version;
- owner;
- status;
- review trigger.

Não mantenha cópias divergentes.

---

### 34. Criar política de documentação

Arquivo:

```text
docs/engineering/DOCUMENTATION_POLICY.md
```

Regras:

- documento possui owner;
- documento possui propósito;
- ADR não é reescrito silenciosamente;
- diagrama muda com arquitetura;
- README não promete trabalho inexistente;
- links quebrados falham no gate;
- evidence é sanitizada;
- duplicação é evitada;
- documentação stale gera finding.

---

### 35. Criar quality gates

Arquivo:

```text
docs/engineering/QUALITY_GATES.md
```

Gates:

```text
QG-01:
repository structure.

QG-02:
Maven build.

QG-03:
unit tests.

QG-04:
architecture tests.

QG-05:
integration tests.

QG-06:
coverage policy.

QG-07:
format and static analysis.

QG-08:
dependency and secret scan.

QG-09:
documentation validation.

QG-10:
migration validation.

QG-11:
contract compatibility.

QG-12:
evidence collection.
```

Nem todos estarão completos nesta aula.

A pipeline cresce junto com a implementação.

---

### 36. Definir gate proporcional

Estado inicial:

```text
obrigatorio agora:

structure;
Maven build;
documentation;
secret scan;
architecture metadata.

ativado quando existir codigo:

unit tests;
coverage;
static analysis;
architecture tests.

ativado quando existir infraestrutura:

integration tests;
migration tests;
contract tests;
end-to-end tests.
```

O gate não deve falhar por artefato que ainda não existe.

---

### 37. Criar workflow de qualidade

Arquivo:

```text
.github/workflows/quality.yml
```

Conteúdo conceitual:

```yaml
name: quality

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  repository:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Validate repository
        shell: pwsh
        run: ./scripts/validate-repository.ps1

      - name: Build
        run: ./mvnw --batch-mode clean verify

      - name: Validate documentation
        shell: pwsh
        run: ./scripts/validate-documentation.ps1

      - name: Collect evidence
        shell: pwsh
        run: ./scripts/collect-repository-evidence.ps1
```

As actions precisam ser revisadas e fixadas conforme a política de supply chain adotada pelo repositório.

---

### 38. Proteger supply chain

Práticas:

- revisar actions usadas;
- preferir referências imutáveis;
- restringir permissões;
- não expor secrets em forks;
- usar dependabot ou ferramenta equivalente;
- gerar inventário de dependências;
- validar provenance de artifacts;
- não executar script externo não revisado.

A política detalhada evoluirá com a pipeline.

---

### 39. Criar permissões mínimas do workflow

No workflow:

```yaml
permissions:
  contents: read
```

Jobs que precisarem publicar algo recebem permissões específicas.

Não use:

```text
write-all.
```

---

### 40. Criar script de validação do repositório

Arquivo:

```text
scripts/validate-repository.ps1
```

Valide:

- diretórios obrigatórios;
- arquivos obrigatórios;
- parent POM;
- módulos declarados;
- módulos existentes;
- nenhum módulo órfão;
- branch docs;
- README;
- CONTRIBUTING;
- SECURITY;
- CODEOWNERS;
- ausência de arquivos proibidos.

Falhas retornam exit code diferente de zero.

---

### 41. Criar validação arquitetural

Arquivo:

```text
scripts/validate-architecture.ps1
```

Valide:

- módulo `domain` sem dependência de framework;
- apps não acessam internals;
- Gateway separado;
- docs de ADR presentes;
- C4 presente;
- dependency map presente;
- nenhum provider SDK no domain POM;
- nenhum module cycle.

Quando o código existir, ArchUnit reforçará essas regras.

---

### 42. Criar validação de documentação

Arquivo:

```text
scripts/validate-documentation.ps1
```

Valide:

- links internos;
- H1;
- owner;
- status;
- ADR IDs;
- arquivos referenciados;
- ausência de headings quebrados;
- nenhuma palavra de placeholder;
- nenhum documento obrigatório vazio.

---

### 43. Criar validação de secrets

Arquivo:

```text
scripts/validate-secrets.ps1
```

Procure padrões de risco:

```text
password;

client_secret;

private_key;

access_token;

authorization bearer;

BEGIN PRIVATE KEY;

endpoint privado.
```

O script é defesa adicional.

Ele não substitui uma ferramenta especializada.

---

### 44. Criar evidence do repositório

Arquivo:

```text
contracts/professional-repository-evidence.yaml
```

Campos:

- lesson;
- project;
- root file count;
- app module count;
- library module count;
- test module count;
- declared Maven module count;
- existing Maven module count;
- orphan module count;
- documentation index status;
- branching policy status;
- commit policy status;
- PR template status;
- issue form count;
- CODEOWNERS status;
- security policy status;
- workflow count;
- minimum workflow permission status;
- required gate count;
- active gate count;
- secret scan status;
- domain implementation started;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

---

### 45. Criar gate final do repositório

Status:

```text
PASS;

FAIL_REPOSITORY_CHARTER;

FAIL_ROOT_STRUCTURE;

FAIL_MAVEN_PARENT;

FAIL_MAVEN_MODULE;

FAIL_ORPHAN_MODULE;

FAIL_EDITOR_CONFIG;

FAIL_GIT_ATTRIBUTES;

FAIL_GIT_IGNORE;

FAIL_README;

FAIL_CONTRIBUTING;

FAIL_SECURITY_POLICY;

FAIL_BRANCHING_POLICY;

FAIL_COMMIT_POLICY;

FAIL_PR_TEMPLATE;

FAIL_ISSUE_FORM;

FAIL_CODEOWNERS;

FAIL_DOCUMENTATION_INDEX;

FAIL_QUALITY_GATE_POLICY;

FAIL_WORKFLOW;

FAIL_WORKFLOW_PERMISSION;

FAIL_SECRET_SCAN;

FAIL_DOMAIN_ANTICIPATION;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 46. Testar módulo órfão

Cenário:

```text
diretorio possui pom.xml,
mas nao aparece
no parent POM.
```

Resultado:

```text
FAIL_ORPHAN_MODULE.
```

O inverso também falha.

---

### 47. Testar dependência proibida

Cenário:

```text
orderflow-domain
depende de Spring Boot.
```

Resultado:

```text
FAIL_DOMAIN_FRAMEWORK_DEPENDENCY.
```

---

### 48. Testar documentação divergente

README declara:

```text
OrderFlow pronto para producao.
```

Status real:

```text
dominio ainda nao implementado.
```

Resultado:

```text
FAIL_DOCUMENTATION_ACCURACY.
```

---

### 49. Testar secret acidental

Arquivo contém uma chave privada ou token semelhante a credencial.

Resultado:

```text
FAIL_SECRET_SCAN.
```

A correção inclui:

- remover do histórico quando necessário;
- revogar;
- rotacionar;
- registrar incidente;
- melhorar controle preventivo.

---

### 50. Testar workflow excessivo

Workflow usa:

```text
permissions:
write-all.
```

Resultado:

```text
FAIL_WORKFLOW_PERMISSION.
```

---

### 51. Testar PR sem evidência

Mudança arquitetural sem:

- ADR;
- testes;
- relatório;
- justificativa.

Resultado:

```text
FAIL_CHANGE_EVIDENCE.
```

O gate pode começar como política manual e depois ser automatizado.

---

### 52. Criar reports

Exemplo:

```yaml
professionalRepository:
  modules:
    applications:
      5
    libraries:
      5
    tests:
      3
    declared:
      13
    existing:
      13
    orphan:
      0

  governance:
    README:
      true
    contributing:
      true
    security:
      true
    CODEOWNERS:
      true
    PRTemplate:
      true
    issueForms:
      3

  quality:
    definedGates:
      12
    activeGates:
      5
    workflowCount:
      1
    minimumPermissions:
      true
    secretScan:
      PASS

  implementation:
    domainStarted:
      false

  gate:
    PASS
```

---

### 53. Executar validação local

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

---

### 54. Coletar evidence

Execute:

```powershell
.\scripts\collect-repository-evidence.ps1
```

O script gera:

```text
reports/professional-repository-report.yaml;

contracts/professional-repository-evidence.yaml.
```

Evidence precisa ser reproduzível.

---

### 55. Validar experiência de onboarding

Simule uma pessoa nova.

Ela deve conseguir descobrir:

1. o que é o OrderFlow;
2. qual status atual;
3. quais requisitos existem;
4. como construir;
5. como testar;
6. onde está a arquitetura;
7. como contribuir;
8. como reportar segurança;
9. quais decisões existem;
10. qual é a próxima etapa.

Se isso não for possível, o repositório não está pronto.

---

### 56. Criar primeira baseline

Antes do commit:

```powershell
git status

git diff --check

.\mvnw.cmd `
  clean `
  verify
```

Adicione:

```powershell
git add .
```

Revise:

```powershell
git diff `
  --cached `
  --stat

git diff `
  --cached `
  --name-only
```

---

### 57. Criar commit inicial profissional

Commit recomendado:

```powershell
git commit `
  -m `
  "build(m20): configure professional OrderFlow repository"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

---

### 58. Encerrar o laboratório

Confirme:

- Git inicializado;
- branch `main`;
- monorepo Maven;
- módulos declarados;
- Maven Wrapper;
- editor config;
- line endings;
- ignore rules;
- packages;
- README;
- build guide;
- test guide;
- branching;
- commits;
- CONTRIBUTING;
- PR template;
- issue forms;
- CODEOWNERS;
- SECURITY;
- license;
- architecture index;
- documentation policy;
- quality gates;
- CI;
- minimum permissions;
- validation scripts;
- secret scan;
- evidence;
- gate aprovado;
- domínio não implementado.

---

## Entendendo o que foi feito

### A arquitetura virou estrutura

As aplicações, bibliotecas, tests e docs agora representam o C4.

### O domínio ganhou proteção antes do código

A política de dependências impede framework e provider dentro de `orderflow-domain`.

### O fluxo Git ganhou intenção

Branches curtas, commits semânticos e pull requests pequenos tornam mudanças rastreáveis.

### Ownership ficou visível

CODEOWNERS e documentos definem responsabilidades mesmo em um projeto individual.

### A qualidade começou proporcionalmente

Somente gates compatíveis com o estado atual foram ativados.

Novos gates entrarão quando código e infraestrutura existirem.

### O repositório virou portfólio

README, arquitetura, ADRs, decisões, evidências e status honesto tornam o projeto compreensível para terceiros.

---

## Erros comuns importantes

### Estrutura por preferência pessoal

A árvore deve refletir arquitetura e responsabilidades.

### Módulos sem boundary

Apenas dividir pastas não reduz acoplamento.

### README promocional demais

Portfólio precisa ser honesto.

### CODEOWNERS fictício apresentado como governança real

Papéis sintéticos devem ser identificados.

### Pipeline grande antes do código

Feedback fica lento e frágil.

### Quality gate sem risco conhecido

A automação vira ruído.

### Branch longa

Integração tardia esconde problemas.

### Commit genérico

O histórico perde valor.

### Secret no Gitignore depois do vazamento

Ignorar não remove o histórico nem revoga credencial.

### Workflow com permissões amplas

Supply chain fica vulnerável.

### Antecipar implementação do domínio

Essa etapa pertence à aula 679.

---

## Comandos úteis

### Construir tudo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Construir domínio e dependências

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -am `
  verify
```

### Validar repositório

```powershell
.\scripts\validate-repository.ps1
```

### Validar arquitetura

```powershell
.\scripts\validate-architecture.ps1
```

### Validar documentação

```powershell
.\scripts\validate-documentation.ps1
```

### Validar secrets

```powershell
.\scripts\validate-secrets.ps1
```

---

## Exercício guiado

Revise o repositório como se você fosse uma pessoa externa.

Produza um relatório com:

1. clareza do README;
2. precisão do status;
3. facilidade de build;
4. facilidade de teste;
5. localização do C4;
6. localização dos ADRs;
7. ownership;
8. qualidade dos templates;
9. segurança;
10. permissões da CI;
11. riscos de dependência;
12. módulos órfãos;
13. documentos stale;
14. gaps para a aula 679;
15. decisão final.

Classifique:

```text
READY_FOR_DOMAIN_IMPLEMENTATION;

READY_WITH_CONDITIONS;

REWORK_REQUIRED;

INCONCLUSIVE.
```

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 677 e ponte para a aula 679 foram preservadas;
- laboratório `orderflow` foi criado;
- Repository Charter foi criado;
- Git foi inicializado;
- branch `main` foi criada;
- estrutura raiz foi criada;
- monorepo Maven foi escolhido;
- parent POM foi criado;
- módulos compiláveis foram criados;
- Maven Wrapper foi criado;
- Dependency Policy foi criada;
- mapa de dependências permitido foi criado;
- `.editorconfig` foi criado;
- `.gitattributes` foi criado;
- `.gitignore` foi criado;
- política de arquivos locais foi criada;
- packages foram definidos;
- README raiz foi criado;
- status do projeto foi descrito com honestidade;
- Building Guide foi criado;
- Testing Guide foi criado;
- trunk-based development foi definido;
- Conventional Commits foram definidos;
- política de commits foi criada;
- CONTRIBUTING foi criado;
- pull request template foi criado;
- issue form de bug foi criado;
- issue form de arquitetura foi criado;
- issue form de melhoria foi criado;
- CODEOWNERS foi criado;
- ownership individual foi tratado com transparência;
- SECURITY foi criado;
- licença foi discutida;
- índice de arquitetura foi criado;
- artefatos anteriores foram organizados;
- Documentation Policy foi criada;
- Quality Gates foram definidos;
- ativação proporcional foi definida;
- workflow de qualidade foi criado;
- supply chain foi protegida;
- permissões mínimas foram aplicadas;
- script de validação do repositório foi criado;
- script de arquitetura foi criado;
- script de documentação foi criado;
- script de secrets foi criado;
- evidence foi criada;
- gate final foi criado;
- testes de módulo, dependência, documentação, secret, workflow e evidence foram definidos;
- onboarding foi validado;
- commit inicial foi recomendado;
- diário de bordo está presente;
- implementação do domínio não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|BEGIN PRIVATE KEY|productionHost"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "build(m20): configure professional OrderFlow repository"
```

Não inclua:

- credenciais;
- dados reais;
- topologia real;
- owners falsamente apresentados como pessoas reais;
- domínio implementado;
- repositories;
- controllers;
- consumers;
- conteúdo detalhado da aula 679.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você configurou o repositório profissional do OrderFlow.

Você criou:

```text
monorepo Maven;

applications;

libraries;

test modules;

Maven Wrapper;

EditorConfig;

Git attributes;

Git ignore;

README;

CONTRIBUTING;

SECURITY;

CODEOWNERS;

branching policy;

commit policy;

PR template;

issue forms;

documentation index;

quality gates;

CI workflow;

validation scripts;

reports, evidence e gate.
```

Você transformou arquitetura em uma estrutura preparada para implementação.

Você também garantiu que o repositório descreve honestamente o estágio atual do projeto.

A próxima aula será:

```text
679 - M20.09 - Implementacao dominio
```

Nela, você implementará o módulo `orderflow-domain`, começando pelos value objects, seguindo para aggregate, invariantes, policies, domain events, erros e testes.

Nenhuma implementação de domínio foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Inicializei Git.
- [ ] Criei monorepo Maven.
- [ ] Criei módulos.
- [ ] Criei wrapper.
- [ ] Criei convenções.
- [ ] Criei README.
- [ ] Criei governança.
- [ ] Criei templates.
- [ ] Criei CODEOWNERS.
- [ ] Criei security policy.
- [ ] Criei quality gates.
- [ ] Criei CI.
- [ ] Criei scripts.
- [ ] Validei onboarding.
- [ ] Preservei a aula 679.

---

## Troubleshooting adicional

### O parent POM não encontra módulo

Revise caminho relativo e nome do diretório.

### O wrapper não executa no Windows

Valide permissões, Java e `mvnw.cmd`.

### O build está vazio demais

Isso é esperado antes da implementação.

### A CI falha por teste inexistente

Ative o gate somente quando o artefato existir.

### O README possui links quebrados

Corrija antes do commit inicial.

### CODEOWNERS não reconhece o owner

Use uma conta ou equipe existente ao publicar.

### A pipeline recebe secret em pull request externo

Remova secrets do job ou restrinja o evento.

### Um módulo depende de todos os outros

Revise boundaries e dependency map.

### A documentação foi copiada e divergiu

Defina source of truth e remova duplicação.

### Quero começar o aggregate agora

A implementação pertence à aula 679.

---

## Perguntas de revisão

1. O que torna um repositório profissional?
2. Por que estrutura deve refletir C4?
3. Monorepo é monólito?
4. Por que Maven Wrapper?
5. Qual módulo não depende de framework?
6. O que `.editorconfig` protege?
7. O que `.gitattributes` protege?
8. O que `.gitignore` não resolve?
9. Por que README precisa de status honesto?
10. O que é trunk-based development?
11. Por que branch curta?
12. O que Conventional Commits melhora?
13. Para que serve CONTRIBUTING?
14. Para que serve PR template?
15. Para que serve CODEOWNERS?
16. O que SECURITY deve orientar?
17. O que é quality gate?
18. Por que ativar gates progressivamente?
19. Qual permissão padrão da CI?
20. Por que validar secrets?
21. O que é módulo órfão?
22. Como validar onboarding?
23. O que a aula 679 fará?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Estrutura, orientação, ownership, automação e qualidade.
2. Para preservar responsabilidades.
3. Não.
4. Para build reproduzível.
5. `orderflow-domain`.
6. Formatação básica.
7. Final de linha e arquivos binários.
8. Não remove vazamento do histórico.
9. Para não prometer trabalho inexistente.
10. Integração contínua com branches curtas.
11. Para reduzir conflito e risco.
12. Histórico e automação.
13. Orientar contribuição.
14. Melhorar contexto e revisão.
15. Declarar ownership.
16. Reporte privado e proteção.
17. Validação automatizada de risco.
18. Para evitar ruído e fragilidade.
19. Leitura mínima.
20. Para reduzir vazamento.
21. Diretório não declarado ou declaração sem diretório.
22. Simular pessoa nova.
23. Implementar domínio.
24. Implementação domínio.
25. Repositório transforma arquitetura em fluxo profissional.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 678 - M20.08 - Configuracao repositorio profissional

- Continuei após ADRs do projeto.
- Criei o laboratório `orderflow`.
- Criei Repository Charter.
- Inicializei Git.
- Defini branch `main`.
- Criei estrutura de apps, libs, tests, docs e scripts.
- Escolhi monorepo Maven.
- Criei parent POM.
- Criei módulos compiláveis.
- Criei Maven Wrapper.
- Criei Dependency Policy.
- Criei Module Dependency Map.
- Criei `.editorconfig`.
- Criei `.gitattributes`.
- Criei `.gitignore`.
- Criei Local Files Policy.
- Defini convenção de packages.
- Criei README raiz.
- Registrei status honesto.
- Criei Building Guide.
- Criei Testing Guide.
- Defini trunk-based development.
- Defini Conventional Commits.
- Criei política de commits.
- Criei CONTRIBUTING.
- Criei pull request template.
- Criei issue form de bug.
- Criei issue form de decisão arquitetural.
- Criei issue form de melhoria.
- Criei CODEOWNERS.
- Documentei ownership para projeto individual.
- Criei SECURITY.
- Registrei decisão de licença.
- Criei índice de arquitetura.
- Organizei artefatos anteriores.
- Criei Documentation Policy.
- Criei Quality Gates.
- Defini ativação proporcional dos gates.
- Criei workflow de qualidade.
- Protegi supply chain.
- Apliquei permissões mínimas.
- Criei script de validação do repositório.
- Criei script de validação arquitetural.
- Criei script de documentação.
- Criei script de secrets.
- Criei evidence e gate.
- Testei módulos, dependências, documentação, secrets e workflow.
- Validei onboarding.
- Criei baseline inicial do Git.
- Não antecipei a implementação do domínio.
- Próxima aula: Implementacao dominio.
```

---

## Referência técnica curta

- Professional Repository.
- Monorepo.
- Maven Multi-Module.
- Maven Wrapper.
- EditorConfig.
- Git Attributes.
- Git Ignore.
- Trunk-Based Development.
- Conventional Commits.
- Pull Request Template.
- Issue Form.
- CODEOWNERS.
- Security Policy.
- Quality Gate.
- CI Workflow.
- Least Privilege.
- Supply Chain.
- Repository Evidence.

Regra final:

```text
A configuração profissional do OrderFlow deve traduzir arquitetura em módulos, convenções, ownership e feedback automatizado: o monorepo Maven separa applications, libraries e test modules, orderflow-domain permanece livre de framework, apps compõem application, contracts, persistence e observability conforme o C4, o Maven Wrapper torna o build reproduzível, EditorConfig, Git attributes e Git ignore controlam formato e arquivos locais, README comunica problema, arquitetura, comandos e status real, CONTRIBUTING orienta setup, branches, commits, testes, documentação e segurança, trunk-based development usa main integrável e branches curtas, Conventional Commits preserva intenção, pull request template exige problema, mudança, validação, risco, arquitetura, segurança, operação e rollback, issue forms estruturam bugs, melhorias e decisões, CODEOWNERS registra responsabilidades sem fingir independência inexistente, SECURITY define reporte e proteção, documentação possui índice, owner, source of truth e review trigger, quality gates protegem estrutura, build, tests, arquitetura, segurança, documentação, migrations, contracts e evidence de forma proporcional ao estágio, CI usa Java 21, Maven Wrapper e permissões mínimas, scripts validam módulos, boundaries, links, arquivos obrigatórios e secrets, e o gate termina com estrutura, parent POM, modules, policies, templates, owners, workflow, scans, reports e evidence aprovados, enquanto aggregate, value objects, invariantes, policies, domain events e testes de comportamento permanecem reservados para a aula 679.
```
