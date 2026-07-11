# 357 - M14.02 - Spring Initializr e estrutura do projeto

## Apresentacao da aula

Na aula 356, você iniciou o Módulo 14 entendendo o papel do Spring Boot.

Foram estudados:

```text
Spring Framework versus Spring Boot;

dependency management;

starter;

classpath;

auto-configuração condicional;

back-off;

aplicação standalone;

servidor embarcado;

jar executável;

Actuator;

diagnóstico anti-magia.
```

O laboratório anterior inspecionou o núcleo do Spring Boot sem iniciar uma aplicação.

Ele comprovou que:

```text
SpringApplication estava no classpath;

EnableAutoConfiguration estava no classpath;

Spring Framework estava disponível;

logging estava disponível;

Spring MVC não estava disponível;

Tomcat não estava disponível;

JPA não estava disponível;

Flyway não estava disponível;

PostgreSQL não estava disponível.
```

Agora você criará o primeiro projeto Spring Boot oficial do curso.

A ferramenta utilizada será:

```text
Spring Initializr.
```

O Spring Initializr é um serviço de geração de projetos JVM.

Ele permite escolher:

- build system;
- linguagem;
- versão da plataforma;
- coordenadas;
- packaging;
- versão do Java;
- dependências iniciais.

O resultado será um arquivo ZIP com uma estrutura Maven pronta para importação.

Nesta aula, o Initializr não será tratado como um botão mágico.

Cada escolha será explicada e registrada.

Você criará o projeto-base:

```text
formacao-java-backend-api
```

Local definitivo dentro da formação:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto
└── formacao-java-backend-api
```

Esse mesmo projeto será continuado nas aulas seguintes.

Não gere um projeto novo a cada aula.

A partir da aula 358, as mudanças ocorrerão sobre:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

As escolhas oficiais serão:

```text
Project:
Maven.

Language:
Java.

Spring Boot:
4.1.0.

Group:
br.com.formacao.

Artifact:
formacao-java-backend-api.

Name:
formacao-java-backend-api.

Description:
Projeto base da formacao Java Backend com Spring Boot.

Package name:
br.com.formacao.backend.

Packaging:
Jar.

Java:
21.
```

Dependência inicial:

```text
Spring Web MVC.
```

A seleção será propositalmente mínima.

Nesta aula, não serão adicionados:

- Spring Data JPA;
- PostgreSQL Driver;
- Flyway;
- Validation;
- Actuator;
- Spring Security;
- DevTools;
- Lombok;
- Docker Compose Support.

Essas dependências terão momentos próprios.

Adicionar tudo no primeiro dia dificultaria identificar o que cada starter altera no classpath e no bootstrap.

O projeto gerado conterá uma classe principal:

```text
FormacaoJavaBackendApiApplication.
```

Também conterá um teste básico de contexto.

Nesta aula, você apenas reconhecerá esses arquivos.

O aprofundamento de:

- `@SpringBootApplication`;
- `SpringApplication.run`;
- component scan;
- auto-configuração;
- tipo de contexto;
- relatório de condições;
- startup do servidor;

ficará para:

```text
358 - M14.03 - Main Application e auto configuration
```

Você poderá executar:

```powershell
.\mvnw.cmd clean test
```

Esse comando compilará o projeto e executará o teste gerado.

Ele não abrirá uma porta HTTP real durante o teste padrão.

Você também poderá empacotar:

```powershell
.\mvnw.cmd clean package
```

Mas não executará ainda:

```powershell
java -jar ...
```

O primeiro startup consciente da aplicação será realizado na aula 358.

A aula 357 terá foco em:

- geração;
- extração;
- importação;
- estrutura;
- Maven Wrapper;
- POM;
- dependências;
- source sets;
- recursos;
- teste baseline;
- build reproduzível;
- commit inicial.

A próxima aula será:

```text
358 - M14.03 - Main Application e auto configuration
```

---

## Onde estamos na formacao

A sequência inicial do M14 é:

```text
356:
Spring Boot visão geral.

357:
Spring Initializr e estrutura do projeto.

358:
Main Application e auto configuration.

359:
Application properties, YAML e profiles.

360:
Beans, Component, Service, Repository e Configuration.

361:
Injeção de dependência e constructor injection.

362:
Ciclo de vida de beans.
```

A aula 356 respondeu:

```text
o que Spring Boot resolve?
```

A aula 357 responderá:

```text
como gerar, importar e validar
o primeiro projeto Spring Boot?
```

Nesta aula:

```text
Spring Initializr:
sim.

Maven:
sim.

Java 21:
sim.

Spring Boot 4.1.0:
sim.

Packaging Jar:
sim.

Spring Web MVC:
sim.

Maven Wrapper:
sim.

pom.xml:
sim.

estrutura src:
sim.

build:
sim.

teste de contexto:
sim.

servidor real:
não.

endpoint:
não.

controller:
não.

properties e profiles:
não.

JPA:
não.

PostgreSQL:
não.
```

A principal mudança em relação aos laboratórios anteriores será a continuidade.

O projeto:

```text
formacao-java-backend-api
```

não será descartável ao fim da aula.

Ele será a base progressiva do módulo.

Por isso, o commit inicial precisa ser limpo e reproduzível.

---

## Objetivo pratico

Você vai criar:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto
```

Estrutura final:

```text
labs
└── m14
    └── aula-357-spring-initializr-estrutura-projeto
        ├── README.md
        ├── docs
        │   ├── selecao-initializr.md
        │   ├── estrutura-gerada.md
        │   ├── pom-anotado.md
        │   ├── maven-wrapper.md
        │   ├── baseline-build.md
        │   └── troubleshooting-initializr.md
        ├── scripts
        │   ├── 01_validar_ambiente.ps1
        │   ├── 02_validar_estrutura.ps1
        │   ├── 03_executar_testes.ps1
        │   ├── 04_empacotar.ps1
        │   └── 05_inspecionar_dependencias.ps1
        └── formacao-java-backend-api
            ├── .gitattributes
            ├── .gitignore
            ├── .mvn
            │   └── wrapper
            │       └── maven-wrapper.properties
            ├── mvnw
            ├── mvnw.cmd
            ├── pom.xml
            └── src
                ├── main
                │   ├── java
                │   │   └── br
                │   │       └── com
                │   │           └── formacao
                │   │               └── backend
                │   │                   └── FormacaoJavaBackendApiApplication.java
                │   └── resources
                │       └── application.properties
                └── test
                    └── java
                        └── br
                            └── com
                                └── formacao
                                    └── backend
                                        └── FormacaoJavaBackendApiApplicationTests.java
```

O Initializr poderá gerar arquivos auxiliares adicionais conforme a versão do serviço.

Não remova um arquivo apenas porque ele não aparece na árvore resumida.

Primeiro descubra sua finalidade.

Resultados esperados:

```text
ZIP baixado;

ZIP preservado somente até a validação;

projeto extraído no local correto;

IntelliJ usando JDK 21;

Maven importado;

Wrapper presente;

parent Spring Boot 4.1.0;

java.version 21;

starter Web MVC;

starter Test;

plugin Maven do Boot;

classe principal presente;

application.properties presente;

teste de contexto presente;

clean test verde;

clean package verde;

jar produzido;

servidor não iniciado;

baseline documentada;

commit inicial criado.
```

---

## Conceito essencial

### O que e Spring Initializr

Spring Initializr é um gerador de projetos.

Ele não é:

- uma IDE;
- um servidor de produção;
- um framework separado;
- um gerador de toda a arquitetura;
- um substituto para Maven;
- um substituto para decisões técnicas.

Ele cria uma baseline coerente.

Depois da geração, o projeto é seu.

Você precisa entender e manter cada arquivo.

---

### Metadados do projeto

O Initializr utiliza metadados para apresentar opções válidas.

Esses metadados podem variar ao longo do tempo.

Por isso, a interface pode mostrar:

- novas versões;
- versões removidas;
- nomes atualizados de dependências;
- novos requisitos de Java;
- opções de packaging.

Nesta formação, a seleção é fixada pela grade.

Não escolha automaticamente a versão mais nova que aparecer.

Use:

```text
Spring Boot 4.1.0.
```

---

### Project: Maven

Maven será o build system.

Ele administra:

- dependências;
- compilação;
- testes;
- plugins;
- empacotamento;
- lifecycle;
- metadata do projeto.

O arquivo principal será:

```text
pom.xml.
```

Você já utilizou Maven em módulos anteriores.

Agora o Boot fornecerá dependency e plugin management sobre o build.

---

### Language: Java

O Initializr também pode oferecer outras linguagens.

A formação utiliza:

```text
Java.
```

Não selecione Kotlin ou Groovy.

Isso alteraria:

- source folders;
- plugins;
- sintaxe;
- testes;
- convenções.

---

### Spring Boot version

A versão da plataforma controla:

- parent;
- BOM;
- starters;
- plugins;
- bibliotecas gerenciadas;
- requisitos de runtime.

O projeto usará:

```text
4.1.0.
```

Evite:

- SNAPSHOT;
- milestone;
- versão não prevista;
- override manual do Spring Framework.

A linha estável escolhida precisa permanecer igual em todos os membros do projeto.

---

### Group

O group será:

```text
br.com.formacao.
```

Ele participa das coordenadas Maven:

```text
br.com.formacao:formacao-java-backend-api.
```

Também influencia a sugestão de package.

O group não precisa ser igual ao package, embora frequentemente estejam relacionados.

---

### Artifact

O artifact será:

```text
formacao-java-backend-api.
```

Ele identifica o artefato Maven.

Também costuma definir:

- nome da pasta baixada;
- nome base do jar;
- referência em dependências;
- identidade no repositório de artefatos.

Evite espaços, acentos e nomes genéricos como `demo`.

---

### Name

O name será:

```text
formacao-java-backend-api.
```

É um nome legível do projeto.

Ele aparece no POM.

Pode ser diferente do artifact, mas nesta baseline permanecerá igual.

---

### Description

Descrição:

```text
Projeto base da formacao Java Backend com Spring Boot.
```

A descrição deve comunicar o objetivo.

Não use a descrição padrão sem revisar.

---

### Package name

Package:

```text
br.com.formacao.backend.
```

A classe principal ficará nesse package.

Subpackages criados depois devem ficar abaixo dele.

Exemplos futuros:

```text
br.com.formacao.backend.config;

br.com.formacao.backend.controller;

br.com.formacao.backend.service;

br.com.formacao.backend.repository.
```

A posição da classe principal influencia o component scan padrão.

Esse comportamento será aprofundado na aula 358.

---

### Packaging: Jar

Packaging:

```text
Jar.
```

O curso utilizará aplicação executável com servidor embarcado.

WAR será apropriado quando a aplicação precisa ser implantada em um container servlet externo por exigência do ambiente.

Não existe necessidade desse modelo nesta formação.

---

### Java 21

Selecione:

```text
21.
```

O POM gerado deverá conter:

```xml
<properties>
    <java.version>21</java.version>
</properties>
```

O IntelliJ e o Maven Wrapper precisam utilizar o mesmo JDK.

Verifique:

```powershell
java -version
javac -version
.\mvnw.cmd -version
```

As três saídas precisam apontar para Java 21.

---

### Dependencia Spring Web MVC

Selecione no Initializr:

```text
Spring Web MVC.
```

Essa dependência prepara o classpath servlet.

Ela trará, por meio do starter:

- Spring MVC;
- infraestrutura web;
- servidor servlet embarcado;
- JSON por bibliotecas gerenciadas;
- logging já integrado pelo núcleo.

Nesta aula, nenhum endpoint será criado.

A dependência estará presente para que a aula 358 possa iniciar a aplicação e analisar o servidor.

---

### Dependencia de teste

O Initializr adiciona uma dependência de teste adequada ao projeto.

O POM deverá possuir:

```text
spring-boot-starter-test.
```

Ela fornece uma composição de ferramentas de teste gerenciadas pelo Boot.

Não adicione versões manualmente.

O conjunto exato pode evoluir com o Boot.

Use o dependency tree para inspecionar.

---

### Maven Wrapper

O Wrapper é composto por:

```text
mvnw;

mvnw.cmd;

.mvn/wrapper/maven-wrapper.properties.
```

No Windows, use:

```powershell
.\mvnw.cmd
```

O Wrapper permite executar Maven com a versão definida pelo projeto, mesmo quando a máquina não possui aquela versão instalada globalmente.

Ele melhora reprodutibilidade entre:

- desenvolvedores;
- CI;
- máquinas novas;
- ambientes de treinamento.

Não delete o Wrapper.

---

### Maven global versus Wrapper

Comando global:

```powershell
mvn clean test
```

Comando do projeto:

```powershell
.\mvnw.cmd clean test
```

No projeto Boot, o padrão oficial será o Wrapper.

O Maven global continua útil para diagnóstico.

O Wrapper reduz variação de versão.

---

### Integridade do Maven Wrapper

Arquivos de Wrapper também fazem parte da cadeia de execução do projeto.

Antes de usá-los:

- confirme a origem oficial do ZIP;
- inspecione `mvnw.cmd`;
- inspecione a URL de distribuição;
- não substitua o Wrapper por arquivos copiados de origem desconhecida;
- versione os arquivos necessários;
- revise mudanças futuras nesses arquivos.

Em um repositório corporativo, alterações no Wrapper devem passar por revisão como qualquer script executável.

Não aceite uma mudança silenciosa apenas porque o arquivo foi gerado por ferramenta.

---

### Estrutura src/main/java

Código de produção:

```text
src/main/java.
```

A classe principal será gerada em:

```text
src/main/java/br/com/formacao/backend.
```

Não coloque código Java diretamente em `src/main`.

Maven depende da convenção de source set.

---

### Estrutura src/main/resources

Recursos:

```text
src/main/resources.
```

O Initializr criará:

```text
application.properties.
```

O arquivo pode estar vazio.

Não preencha configurações antecipadamente.

Properties, YAML e profiles serão estudados na aula 359.

---

### Estrutura src/test/java

Testes:

```text
src/test/java.
```

O Initializr criará um teste com:

```java
@SpringBootTest
```

e um método:

```java
contextLoads()
```

A finalidade inicial é comprovar que o contexto básico pode ser criado.

O teste não substitui testes de comportamento.

Ele é apenas a baseline de bootstrap.

---

### Classe principal

A classe:

```text
FormacaoJavaBackendApiApplication
```

conterá:

- uma annotation principal;
- método `main`;
- chamada de bootstrap.

Nesta aula, apenas localize esses elementos.

Não tente explicar todas as annotations agora.

O aprofundamento é o tema da aula 358.

---

### POM gerado

O POM deverá possuir:

```text
parent Spring Boot;

groupId;

artifactId;

version;

name;

description;

java.version;

dependencies;

build plugin.
```

As dependências não precisam declarar versão quando são gerenciadas pelo Boot.

Isso demonstra dependency management.

---

### Parent do Boot

Trecho esperado:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.0</version>
    <relativePath/>
</parent>
```

O parent fornece defaults e dependency management.

Não altere o parent durante esta aula.

---

### Plugin Maven do Boot

O Initializr deverá incluir:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

O plugin participa do empacotamento executável.

Nesta aula, você apenas confirmará sua presença.

O uso de `spring-boot:run` e `java -jar` será praticado na aula seguinte.

---

### Teste versus servidor

Executar:

```powershell
.\mvnw.cmd test
```

pode criar um contexto Spring durante o teste.

Isso não significa que a aplicação abriu uma porta real.

O teste baseline usa ambiente apropriado para teste.

Na aula 358, você iniciará o servidor e observará a porta.

---

### Build lifecycle

Comandos centrais:

```text
clean:
remove target.

test:
compila e executa testes.

package:
gera o artefato.

verify:
executa verificações adicionais quando configuradas.
```

Nesta baseline:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package
```

precisam terminar com sucesso.

---

### Diretorio target

O build cria:

```text
target.
```

Ele contém:

- classes compiladas;
- relatórios;
- jar;
- metadata;
- outputs temporários.

`target` não deve ser versionado.

O `.gitignore` gerado precisa cobri-lo.

---

### Jar produzido

O nome esperado seguirá:

```text
artifactId-version.jar.
```

Exemplo:

```text
formacao-java-backend-api-0.0.1-SNAPSHOT.jar.
```

A versão exata dependerá do POM gerado.

Não renomeie manualmente o jar.

A identidade deve vir do Maven.

---

### Importacao no IntelliJ Community

Abra a pasta:

```text
formacao-java-backend-api.
```

Não abra apenas o arquivo Java.

O IntelliJ precisa reconhecer:

- `pom.xml`;
- source roots;
- test roots;
- JDK;
- Maven;
- resources.

Quando solicitado, confie no projeto somente se o ZIP veio do serviço oficial.

---

### JDK do projeto

No IntelliJ, confirme:

```text
Project SDK:
Temurin 21.

Language level:
21.
```

Também confira o Maven Runner.

Se o terminal usa Java 21 e o Maven Runner usa outro JDK, o build da IDE pode divergir do terminal.

---

### Importacao Maven

Após abrir:

1. aguarde indexação;
2. abra a janela Maven;
3. recarregue o projeto;
4. confirme dependências resolvidas;
5. verifique ausência de erros no POM;
6. execute o teste pelo Wrapper.

Não comece a editar enquanto a importação ainda está incompleta.

---

### ZIP original

Preserve o ZIP apenas até:

- extração;
- validação da estrutura;
- build verde;
- commit inicial.

Depois, ele pode ser removido.

Não versione o ZIP.

O projeto extraído e o histórico Git são a fonte de trabalho.

---

### Baseline

Baseline significa:

```text
estado inicial conhecido e reproduzível.
```

A baseline desta aula inclui:

- seleção documentada;
- POM sem alterações desnecessárias;
- Wrapper presente;
- build verde;
- teste verde;
- nenhum endpoint;
- nenhuma configuração local;
- commit limpo.

Toda aula futura será comparada a essa baseline.

---

### Registro da geracao

Uma baseline profissional deve registrar a origem.

Em `selecao-initializr.md`, inclua:

- data da geração;
- serviço utilizado;
- Boot selecionado;
- Java selecionado;
- metadata;
- dependências;
- nome do ZIP;
- hash opcional do ZIP;
- resultado do primeiro build;
- commit inicial.

Esse registro ajuda a distinguir:

```text
arquivo originalmente gerado;

mudança feita pelo curso;

mudança transitiva após atualização.
```

Não é necessário guardar o ZIP para sempre quando o conteúdo extraído está versionado.

O registro e o commit preservam a rastreabilidade.

---

### Auditoria inicial do POM

Antes do primeiro commit, faça uma leitura completa do POM.

Pergunte:

- existe repositório externo inesperado?
- existe plugin desconhecido?
- alguma versão foi fixada sem motivo?
- o Java está correto?
- as dependências correspondem à seleção?
- existe dependência opcional não solicitada?
- o plugin Boot está presente?
- o packaging é Jar?

Essa auditoria é pequena no projeto inicial e cria um hábito importante para projetos maiores.

---

### Estrutura minima e responsabilidade

O Initializr cria uma estrutura pequena de propósito.

Ele não deve gerar automaticamente:

- controller;
- service;
- repository;
- entity;
- DTO;
- exception handler.

Esses elementos surgirão conforme requisitos.

Criar todos antecipadamente produziria packages vazios e arquitetura especulativa.

---

### Nomes e consistencia

Use o mesmo nome em:

- artifact;
- name;
- pasta;
- README;
- comandos;
- documentação.

A única diferença consciente será o package:

```text
br.com.formacao.backend.
```

Essa consistência reduz erros de path e bootstrap.

---

### Seguranca da geracao

Antes de extrair:

- confirme que o download veio do serviço oficial;
- não execute scripts de origem desconhecida;
- inspecione os arquivos;
- não forneça credenciais ao Initializr;
- não inclua secrets no metadata.

O projeto inicial não precisa conhecer banco, senha ou token.

---

## Mao na massa guiada

### 1. Validar o ambiente

Na raiz da formação:

```powershell
java -version
javac -version
mvn -version
git status
```

Confirme Java 21.

O Maven global pode existir, mas o projeto usará Wrapper.

---

### 2. Criar a pasta da aula

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m14\aula-357-spring-initializr-estrutura-projeto\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m14\aula-357-spring-initializr-estrutura-projeto\scripts"
```

Não crie manualmente a pasta interna do projeto antes de extrair.

---

### 3. Abrir o Initializr

No navegador, acesse:

```text
start.spring.io
```

Confirme que está no serviço oficial.

A interface pode mudar visualmente.

Procure os campos equivalentes às escolhas descritas nesta aula.

---

### 4. Selecionar Project

Selecione:

```text
Maven.
```

Não selecione Gradle.

---

### 5. Selecionar Language

Selecione:

```text
Java.
```

---

### 6. Selecionar Spring Boot

Selecione:

```text
4.1.0.
```

Não selecione:

- SNAPSHOT;
- milestone;
- outra linha estável;
- versão sugerida automaticamente sem conferir.

---

### 7. Preencher metadata

Use:

```text
Group:
br.com.formacao

Artifact:
formacao-java-backend-api

Name:
formacao-java-backend-api

Description:
Projeto base da formacao Java Backend com Spring Boot

Package name:
br.com.formacao.backend

Packaging:
Jar

Java:
21
```

Revise cada campo antes de gerar.

---

### 8. Adicionar dependencia

Clique em adicionar dependências.

Pesquise:

```text
Spring Web MVC.
```

Selecione somente essa dependência.

Confirme que a lista não possui:

- Data JPA;
- PostgreSQL;
- Flyway;
- Security;
- Actuator;
- DevTools;
- Lombok.

---

### 9. Gerar o ZIP

Clique em:

```text
Generate.
```

O arquivo esperado terá nome semelhante a:

```text
formacao-java-backend-api.zip.
```

O navegador pode acrescentar um número caso o arquivo já exista.

Não confunda versões diferentes.

---

### 10. Mover o ZIP

Exemplo:

```powershell
Move-Item `
  "$env:USERPROFILE\Downloads\formacao-java-backend-api.zip" `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api.zip"
```

Ajuste o caminho se o navegador salvou em outro local.

---

### 11. Inspecionar o ZIP

Antes de extrair:

```powershell
tar -tf `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api.zip"
```

Confirme:

- `pom.xml`;
- `mvnw`;
- `mvnw.cmd`;
- `.mvn`;
- `src/main`;
- `src/test`.

---

### 12. Extrair

```powershell
Expand-Archive `
  -Path "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api.zip" `
  -DestinationPath "labs\m14\aula-357-spring-initializr-estrutura-projeto"
```

Confirme a pasta:

```text
formacao-java-backend-api.
```

---

### 13. Validar a estrutura

```powershell
Get-ChildItem `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api" `
  -Force
```

Depois:

```powershell
Get-ChildItem `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api\src" `
  -Recurse
```

---

### 14. Remover o ZIP

Somente depois de validar a extração:

```powershell
Remove-Item `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api.zip"
```

O ZIP não será versionado.

---

### 15. Abrir no IntelliJ

No IntelliJ Community:

1. `File`;
2. `Open`;
3. escolha a pasta `formacao-java-backend-api`;
4. confirme abertura como projeto;
5. aguarde Maven;
6. selecione JDK 21;
7. aguarde indexação.

Não abra a pasta externa da aula como projeto Maven.

Abra a pasta que contém o `pom.xml`.

---

### 16. Validar Maven Wrapper

No terminal do projeto:

```powershell
.\mvnw.cmd -version
```

Confirme:

- Maven executado;
- Java 21;
- caminho do projeto correto.

Depois inspecione:

```powershell
Get-Content `
  ".mvn\wrapper\maven-wrapper.properties"
```

Registre a versão distribuída, sem alterá-la.

---

### 17. Inspecionar pom.xml

Localize:

```text
parent;

groupId;

artifactId;

version;

name;

description;

java.version;

dependencies;

build.
```

Confirme Boot 4.1.0 e Java 21.

---

### 18. Inspecionar dependencias

No POM, confirme:

```text
spring-boot-starter-webmvc;

spring-boot-starter-test.
```

Se o Initializr gerar um identificador equivalente oficialmente recomendado na versão atual, registre a diferença antes de alterar.

Não adicione versões.

---

### 19. Inspecionar plugin

Confirme:

```text
spring-boot-maven-plugin.
```

Não configure goals manualmente nesta aula.

---

### 20. Inspecionar a classe principal

Abra:

```text
FormacaoJavaBackendApiApplication.java.
```

Identifique:

- package;
- imports;
- annotation principal;
- classe pública;
- método main;
- chamada de bootstrap.

Não altere.

---

### 21. Inspecionar application.properties

Abra:

```text
src/main/resources/application.properties.
```

Ele pode estar vazio.

Não adicione:

- porta;
- nome da aplicação;
- profile;
- logging;
- datasource.

A aula 359 cuidará disso.

---

### 22. Inspecionar o teste

Abra:

```text
FormacaoJavaBackendApiApplicationTests.java.
```

Identifique:

- package;
- `@SpringBootTest`;
- `contextLoads`;
- ausência de assertions de negócio.

Entenda que esse teste é uma smoke test do contexto.

---

### 23. Executar clean test

```powershell
.\mvnw.cmd clean test
```

Resultado esperado:

```text
BUILD SUCCESS.
```

Confirme que não há uma porta HTTP ouvindo.

---

### 24. Gerar dependency tree

```powershell
.\mvnw.cmd dependency:tree `
  -DoutputFile=dependency-tree.txt
```

Inspecione:

```powershell
Get-Content dependency-tree.txt
```

Identifique:

- Spring Boot;
- Spring MVC;
- Tomcat;
- logging;
- starter de teste.

Remova o arquivo depois de documentar.

---

### 25. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme o jar:

```powershell
Get-ChildItem target -Filter "*.jar"
```

Não execute o jar ainda.

---

### 26. Inspecionar o jar

```powershell
jar tf `
  "target\formacao-java-backend-api-0.0.1-SNAPSHOT.jar" |
  Select-Object -First 40
```

Ajuste o nome conforme o POM.

Observe estruturas como:

```text
BOOT-INF;

META-INF;

classes da aplicação.
```

Não altere o conteúdo.

---

### 27. Criar scripts

`01_validar_ambiente.ps1`:

```powershell
java -version
javac -version
git status
```

`02_validar_estrutura.ps1` verifica arquivos obrigatórios.

`03_executar_testes.ps1`:

```powershell
Set-Location formacao-java-backend-api
.\mvnw.cmd clean test
```

`04_empacotar.ps1`:

```powershell
Set-Location formacao-java-backend-api
.\mvnw.cmd clean package
```

`05_inspecionar_dependencias.ps1` gera e remove o relatório após exibição.

---

### 28. Criar documentacao

`selecao-initializr.md` registra todos os campos.

`estrutura-gerada.md` explica cada diretório.

`pom-anotado.md` explica parent, properties, dependencies e plugin.

`maven-wrapper.md` explica os três arquivos do Wrapper.

`baseline-build.md` registra comandos e resultados.

`troubleshooting-initializr.md` registra problemas encontrados.

---

### 29. Criar README

Inclua:

- objetivo da aula;
- local do projeto;
- versão Java;
- versão Boot;
- dependência inicial;
- comandos;
- resultado;
- restrições;
- próxima aula.

Declare:

```text
Este projeto continuará nas aulas seguintes do M14.
```

---

### 30. Validar Git

Na raiz da formação:

```powershell
git status
git diff --check
```

Confirme que não aparecem:

- ZIP;
- target;
- dependency-tree.txt;
- arquivos da IDE;
- configuração local.

---

## Entendendo o que foi feito

### O projeto foi gerado por metadata explicita

Cada escolha do Initializr foi registrada.

### O Wrapper tornou o build reproduzivel

O projeto não depende exclusivamente do Maven global.

### A estrutura Maven foi preservada

Produção, recursos e testes ficaram nos source sets corretos.

### O POM conectou Boot e build

Parent, starters e plugin formaram a baseline.

### A aplicacao ainda nao foi explorada em runtime

O build passou, mas o startup consciente ficou para a aula 358.

---

## Erros comuns importantes

### Escolher a versao sugerida sem conferir

A formação exige Boot 4.1.0 nesta etapa.

### Adicionar muitas dependencias

Isso oculta o efeito de cada starter.

### Apagar o Maven Wrapper

O build perde parte da reprodutibilidade.

### Abrir somente src no IntelliJ

Maven, resources e testes podem não ser importados corretamente.

### Executar o servidor antes da aula de bootstrap

A execução até pode funcionar, mas o objetivo atual é compreender a estrutura primeiro.

---

## Comandos uteis

### Wrapper

```powershell
.\mvnw.cmd -version
```

### Testes

```powershell
.\mvnw.cmd clean test
```

### Package

```powershell
.\mvnw.cmd clean package
```

### Dependency tree

```powershell
.\mvnw.cmd dependency:tree
```

### Estrutura

```powershell
Get-ChildItem -Recurse -Force
```

### Jar

```powershell
jar tf target\*.jar
```

---

## Exercicio guiado

### Parte 1 — Metadata

Explique a diferença entre:

```text
group;

artifact;

name;

package.
```

### Parte 2 — Wrapper

Remova temporariamente o acesso ao Maven global do terminal.

Confirme que o Wrapper continua sendo a entrada do projeto.

Não apague arquivos.

### Parte 3 — Starter

Use o dependency tree para localizar quais componentes web vieram transitivamente.

### Parte 4 — Java

Mude temporariamente o Project SDK da IDE para outra versão.

Observe o alerta e restaure Java 21.

### Parte 5 — Resources

Explique por que `application.properties` não fica em `src/main/java`.

### Parte 6 — Teste baseline

Explique o que `contextLoads` prova e o que não prova.

### Parte 7 — Jar

Inspecione `BOOT-INF/classes` e `BOOT-INF/lib`.

Não execute.

### Parte 8 — ADR

Registre:

```text
Maven;

Java 21;

Spring Boot 4.1.0;

Jar;

Spring Web MVC;

package raiz br.com.formacao.backend;

Wrapper obrigatório;

projeto contínuo;

startup aprofundado na aula 358.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 356 foi preservada;
- Spring Initializr foi utilizado;
- serviço oficial foi identificado;
- projeto Maven foi selecionado;
- linguagem Java foi selecionada;
- Spring Boot 4.1.0 foi selecionado;
- group foi definido;
- artifact foi definido;
- name foi definido;
- description foi definida;
- package foi definido;
- packaging Jar foi selecionado;
- Java 21 foi selecionado;
- Spring Web MVC foi selecionado;
- somente a dependência inicial prevista foi selecionada;
- Data JPA não foi adicionado;
- PostgreSQL não foi adicionado;
- Flyway não foi adicionado;
- Validation não foi adicionado;
- Actuator não foi adicionado;
- Security não foi adicionado;
- DevTools não foi adicionado;
- Lombok não foi adicionado;
- Docker Compose Support não foi adicionado;
- ZIP foi gerado;
- ZIP foi inspecionado;
- ZIP foi extraído;
- ZIP não foi versionado;
- projeto foi colocado no local oficial;
- projeto foi definido como contínuo;
- pasta interna correta foi aberta no IntelliJ;
- JDK 21 foi configurado;
- Maven foi importado;
- indexação foi aguardada;
- POM foi reconhecido;
- Maven Wrapper foi preservado;
- `mvnw` foi preservado;
- `mvnw.cmd` foi preservado;
- properties do Wrapper foram preservadas;
- integridade do Wrapper foi discutida;
- versão do Maven Wrapper foi inspecionada;
- Maven global foi diferenciado do Wrapper;
- parent Spring Boot foi validado;
- parent usa 4.1.0;
- Java property usa 21;
- groupId está correto;
- artifactId está correto;
- versão do projeto foi identificada;
- name está correto;
- description está correta;
- starter Web MVC foi validado;
- starter Test foi validado;
- versões individuais não foram fixadas;
- plugin Maven do Boot foi validado;
- source main Java foi validado;
- source main resources foi validado;
- source test Java foi validado;
- package raiz foi validado;
- classe principal foi localizada;
- annotation principal foi localizada sem aprofundamento;
- método main foi localizado sem aprofundamento;
- chamada de bootstrap foi localizada sem aprofundamento;
- application.properties foi localizado;
- properties não foram antecipadas;
- teste `@SpringBootTest` foi localizado;
- contextLoads foi identificado;
- teste baseline não foi tratado como teste de negócio;
- clean test foi executado;
- build terminou com sucesso;
- servidor real não foi iniciado pelo teste;
- dependency tree foi gerado;
- dependências web foram inspecionadas;
- package foi executado;
- jar foi produzido;
- jar foi inspecionado;
- jar não foi executado;
- target não foi versionado;
- origem da geração foi registrada;
- baseline foi registrada;
- POM foi auditado antes do commit;
- scripts foram criados;
- documentação de seleção foi criada;
- documentação de estrutura foi criada;
- POM anotado foi criado;
- Wrapper foi documentado;
- baseline foi documentada;
- troubleshooting foi criado;
- README foi criado;
- Git foi validado;
- arquivos locais não foram incluídos;
- nenhum controller foi criado;
- nenhum endpoint foi criado;
- nenhuma regra de negócio foi criada;
- `@SpringBootApplication` não foi aprofundada;
- auto-configuração não foi aprofundada;
- relatório de condições não foi antecipado;
- servidor não foi analisado em runtime;
- profiles não foram antecipados;
- ponte para a aula 358 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

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
git commit -m "chore(m14): criar projeto base com spring initializr"
```

Valide:

```powershell
git log -1 --oneline
```

O commit deve representar a baseline gerada e validada.

Não inclua mudanças da aula 358.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você gerou o primeiro projeto Spring Boot oficial da formação.

As escolhas foram:

```text
Maven;

Java;

Spring Boot 4.1.0;

Java 21;

Jar;

Spring Web MVC;

br.com.formacao.backend.
```

Você validou:

```text
estrutura Maven;

Maven Wrapper;

parent Boot;

dependency management;

starter Web MVC;

starter Test;

plugin Boot;

classe principal;

resources;

teste de contexto;

build;

package;

jar.
```

A baseline ficou:

```text
projeto compila;

testes passam;

jar é produzido;

nenhum endpoint existe;

nenhuma configuração local existe;

nenhuma persistência existe;

nenhum servidor foi iniciado conscientemente.
```

A próxima aula será:

```text
358 - M14.03 - Main Application e auto configuration
```

Nela, você continuará no mesmo projeto:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Você estudará:

- `FormacaoJavaBackendApiApplication`;
- `@SpringBootApplication`;
- annotations compostas;
- configuração;
- component scan;
- `@EnableAutoConfiguration`;
- `SpringApplication.run`;
- Environment;
- tipo servlet;
- criação do ApplicationContext;
- startup do Tomcat;
- porta;
- banner;
- logs;
- auto-configuration report;
- condições positivas;
- condições negativas;
- back-off;
- runners de diagnóstico;
- encerramento do contexto.

A aula 357 respondeu:

```text
como gerar e validar
a estrutura inicial do projeto?
```

A aula 358 responderá:

```text
como a classe principal inicia o Boot
e como a auto-configuração decide o que criar?
```

---

# Material complementar

## Checkpoint final

- [ ] Gerei o projeto com todas as opções oficiais.
- [ ] Preservei e validei o Maven Wrapper.
- [ ] Entendi a estrutura Maven criada.
- [ ] Executei testes e package com sucesso.
- [ ] Mantive a baseline sem antecipar a aula 358.

---

## Troubleshooting adicional

### Boot 4.1.0 nao aparece

Atualize a página, confirme o serviço oficial e não escolha snapshot automaticamente.

### ZIP extraiu em pasta duplicada

Mova o diretório que contém o `pom.xml` para o local oficial.

### IntelliJ nao reconheceu Maven

Abra a pasta que contém o POM e recarregue Maven.

### Wrapper usa Java diferente

Revise `JAVA_HOME`, Project SDK e Maven Runner.

### Teste contextLoads falhou

Leia a causa raiz; não remova o teste para obter build verde.

### Jar nao apareceu

Confirme `clean package`, plugin e ausência de falha nos testes.

---

## Perguntas de revisao

1. O que o Initializr gera?
2. Ele substitui Maven?
3. Qual build foi selecionado?
4. Qual linguagem foi selecionada?
5. Qual versão Boot foi usada?
6. Qual Java foi usado?
7. Qual packaging foi usado?
8. Qual dependência inicial foi usada?
9. O que é group?
10. O que é artifact?
11. O que é package?
12. Para que serve o Wrapper?
13. Qual comando usar no Windows?
14. Onde fica código de produção?
15. Onde ficam recursos?
16. Onde ficam testes?
17. O que contextLoads prova?
18. O jar foi executado?
19. O projeto será reutilizado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma baseline de projeto.
2. Não.
3. Maven.
4. Java.
5. 4.1.0.
6. Java 21.
7. Jar.
8. Spring Web MVC.
9. Coordenada organizacional Maven.
10. Identidade do artefato.
11. Namespace Java.
12. Reproduzir a versão Maven.
13. `.\mvnw.cmd`.
14. `src/main/java`.
15. `src/main/resources`.
16. `src/test/java`.
17. Que o contexto básico carrega.
18. Não.
19. Sim.
20. Main Application e auto configuration.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 357 - M14.02 - Spring Initializr e estrutura do projeto

- Usei o Spring Initializr oficial.
- Selecionei Maven.
- Selecionei Java.
- Mantive Spring Boot 4.1.0.
- Mantive Java 21.
- Defini o group `br.com.formacao`.
- Defini o artifact `formacao-java-backend-api`.
- Defini o package `br.com.formacao.backend`.
- Escolhi packaging Jar.
- Adicionei somente Spring Web MVC.
- Evitei dependências antecipadas.
- Baixei e inspecionei o ZIP.
- Extraí o projeto no local oficial.
- Removi o ZIP antes do commit.
- Abri a pasta correta no IntelliJ Community.
- Configurei JDK 21.
- Aguardei a importação Maven.
- Preservei o Maven Wrapper.
- Diferenciei Maven global do Wrapper.
- Inspecionei a integridade do Wrapper.
- Inspecionei o `pom.xml`.
- Validei parent Boot, Java e starters.
- Validei o plugin Maven do Boot.
- Inspecionei `src/main/java`.
- Inspecionei `src/main/resources`.
- Inspecionei `src/test/java`.
- Localizei a classe principal.
- Localizei `application.properties`.
- Localizei o teste `contextLoads`.
- Executei `clean test`.
- Executei `clean package`.
- Inspecionei o dependency tree.
- Confirmei a criação do jar.
- Não iniciei o servidor.
- Registrei a origem da geração.
- Auditei a baseline do POM.
- Documentei a baseline.
- Defini que o projeto continuará nas próximas aulas.
- Próxima aula: Main Application e auto configuration.
```

---

## Referencia tecnica curta

```text
Initializr:
gera baseline.

Maven:
build.

Group:
organização.

Artifact:
artefato.

Package:
namespace.

Wrapper:
reprodutibilidade.

src/main/java:
produção.

src/main/resources:
configuração.

src/test/java:
testes.

POM:
contrato do build.
```

Regra final:

```text
o primeiro projeto Spring Boot deve ser gerado com metadata explicita, dependencias minimas e build reproduzivel; o Spring Initializr cria a baseline, mas o desenvolvedor precisa validar POM, Wrapper, source sets, JDK, dependencias, testes, empacotamento e estado do Git, preservando o projeto como base continua do modulo e adiando o aprofundamento de Main Application e auto-configuracao para a aula seguinte.
```
