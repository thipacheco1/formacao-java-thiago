# 356 - M14.01 - Spring Boot visao geral

## Apresentacao da aula

Você está iniciando oficialmente o Módulo 14:

```text
Spring Boot, REST APIs e backend profissional.
```

O Módulo 13 terminou com uma base sólida de persistência Java.

Você configurou manualmente:

- `DataSource`;
- HikariCP;
- `EntityManagerFactory`;
- Hibernate;
- `JpaTransactionManager`;
- Spring Data repositories;
- Flyway;
- Testcontainers;
- contexto Spring;
- propriedades;
- lifecycle de inicialização.

Essa experiência foi intencional.

Antes de utilizar Spring Boot, você precisou entender o que existe sob a automação.

Agora surge a pergunta:

```text
se Spring Framework já permite construir aplicações,
por que Spring Boot existe?
```

Spring Boot existe para reduzir o custo de configurar, integrar, executar, empacotar e operar aplicações baseadas em Spring.

Ele fornece:

- convenções;
- dependency management;
- starters;
- auto-configuração;
- aplicação executável;
- servidor embarcado;
- configuração externa;
- diagnóstico;
- recursos de produção;
- integração de testes.

Spring Boot não substitui o Spring Framework.

A relação correta é:

```text
Spring Framework:
container IoC, beans, AOP, transações, MVC e infraestrutura central.

Spring Boot:
opiniões, convenções e automação para montar uma aplicação Spring.
```

A relação também não é:

```text
Spring Boot elimina JPA;

Spring Boot elimina Hibernate;

Spring Boot elimina SQL;

Spring Boot elimina Flyway;

Spring Boot elimina decisões arquiteturais.
```

O Boot automatiza a criação e a conexão de componentes quando as condições esperadas estão presentes.

Ele observa principalmente:

- dependências no classpath;
- propriedades externas;
- beans já declarados;
- tipo da aplicação;
- recursos disponíveis;
- condições do ambiente.

Exemplo conceitual:

```text
starter JDBC no classpath;

driver PostgreSQL no classpath;

spring.datasource.url configurada;

nenhum DataSource customizado.

Resultado esperado:
Boot tenta configurar DataSource e HikariCP.
```

Outro exemplo:

```text
starter web MVC no classpath;

nenhum servidor customizado;

aplicação servlet.

Resultado esperado:
Boot prepara infraestrutura web e servidor embarcado.
```

A palavra importante é:

```text
condicional.
```

Auto-configuração não significa:

```text
criar tudo sempre.
```

Significa:

```text
configurar quando as condições combinam
e recuar quando a aplicação fornece sua própria decisão.
```

A versão de referência do início do M14 será:

```text
Spring Boot 4.1.0.
```

Requisitos adotados:

```text
Java 21;

Maven 3.6.3 ou superior;

Spring Framework 7.0.8 ou superior.
```

O Spring Boot 4.1.0 suporta Java 17 até Java 26.

Portanto, o Java 21 Temurin instalado durante a formação permanece adequado.

Nesta aula, você não criará ainda o projeto pelo Spring Initializr.

Isso será feito na aula:

```text
357 - M14.02 - Spring Initializr e estrutura do projeto
```

Você também não implementará ainda:

- `@SpringBootApplication`;
- `SpringApplication.run`;
- controllers;
- endpoints;
- JSON;
- Tomcat em execução;
- profiles;
- properties da aplicação;
- REST API;
- persistência Boot.

Esses assuntos possuem aulas próprias.

A aula 356 construirá uma visão mental correta antes do primeiro projeto.

O laboratório prático será:

```text
labs/m14/aula-356-spring-boot-visao-geral
```

Ele terá um pequeno projeto Maven de inspeção.

Esse projeto:

- usará o parent do Spring Boot;
- adicionará somente o starter central;
- inspecionará o dependency tree;
- analisará o effective POM;
- verificará classes presentes no classpath;
- comprovará classes ausentes sem starters específicos;
- comparará a configuração manual do M13 com a automação futura;
- não iniciará uma aplicação Spring Boot.

O objetivo é evitar que a primeira experiência com Boot pareça magia.

A próxima aula será:

```text
357 - M14.02 - Spring Initializr e estrutura do projeto
```

---

## Onde estamos na formacao

A transição entre os módulos é:

```text
M13:
persistência Java e infraestrutura Spring configurada manualmente.

M14:
Spring Boot, APIs REST e backend profissional.
```

Você leva para o M14:

- Java 21;
- Maven;
- orientação a objetos;
- exceptions;
- testes;
- SQL;
- PostgreSQL;
- JDBC;
- JPA;
- Hibernate;
- Spring Data;
- Flyway;
- transações;
- Testcontainers;
- Git;
- documentação técnica.

O novo módulo adicionará progressivamente:

```text
Spring Boot;

auto-configuração;

configuração externa;

profiles;

Spring MVC;

HTTP;

REST;

Jackson;

Bean Validation;

tratamento de erros;

documentação de API;

testes web;

cache;

observabilidade;

backend completo.
```

Nesta aula:

```text
visão geral:
sim.

dependências gerenciadas:
sim.

starters:
sim.

auto-configuração conceitual:
sim.

servidor embarcado conceitual:
sim.

aplicação executável conceitual:
sim.

Actuator conceitual:
sim.

inspeção de classpath:
sim.

Spring Initializr:
não.

@SpringBootApplication:
não.

SpringApplication.run:
não.

servidor iniciado:
não.

endpoint:
não.
```

A progressão oficial será:

```text
356:
entender o que Spring Boot resolve.

357:
gerar e compreender a estrutura do projeto.

358:
entender Main Application e auto-configuration.

359:
configurar properties, YAML e profiles.

360:
organizar beans e configurações.

361:
aprofundar injeção por construtor.

362:
estudar lifecycle de beans.
```

A aula atual é uma abertura de módulo.

Ela precisa produzir:

- direção;
- vocabulário;
- mapa de responsabilidades;
- critérios de diagnóstico;
- um primeiro laboratório verificável.

---

## Objetivo pratico

Você vai criar:

```text
labs/m14/aula-356-spring-boot-visao-geral
```

Estrutura final:

```text
labs
└── m14
    └── aula-356-spring-boot-visao-geral
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── docs
        │   ├── spring-framework-vs-spring-boot.md
        │   ├── mapa-manual-vs-auto-configuracao.md
        │   ├── starters-e-classpath.md
        │   ├── dependency-management.md
        │   ├── servidor-embarcado.md
        │   ├── producao-e-actuator.md
        │   └── anti-magia.md
        ├── scripts
        │   ├── 01_validar_ambiente.ps1
        │   ├── 02_exibir_dependency_tree.ps1
        │   ├── 03_gerar_effective_pom.ps1
        │   ├── 04_executar_inspector.ps1
        │   └── 05_validar_laboratorio.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m14
            │                       └── aula356
            │                           ├── BootClassPathInspector.java
            │                           ├── ClassPathObservation.java
            │                           └── OverviewReport.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m14
                                    └── aula356
                                        ├── BootClassPathInspectorTest.java
                                        └── ModuleBoundaryTest.java
```

Resultados esperados:

```text
Java 21:
válido.

Maven:
versão compatível.

Spring Boot:
4.1.0.

SpringApplication:
presente.

EnableAutoConfiguration:
presente.

ApplicationContext:
presente.

logging:
presente.

DispatcherServlet:
ausente.

Tomcat:
ausente.

JpaRepository:
ausente.

Flyway:
ausente.

PostgreSQL Driver:
ausente.

servidor:
não inicia.

@SpringBootApplication:
não usada.

Spring Initializr:
não usado.

dependency tree:
gerado.

effective POM:
gerado.

mapa manual versus Boot:
documentado.
```

O laboratório deve mostrar uma ideia central:

```text
o classpath define possibilidades,
mas a auto-configuração ainda depende
de ativação, condições e propriedades.
```

---

## Conceito essencial

### Spring Boot nao e um framework separado

Spring Boot utiliza o Spring Framework.

Beans continuam sendo administrados pelo container Spring.

Injeção continua baseada em dependências.

Transações continuam apoiadas no Spring Transaction.

Spring MVC continua sendo o framework web servlet.

Spring Data continua criando repositories.

O Boot organiza a montagem desses componentes.

---

### O problema que o Boot resolve

Sem Boot, uma aplicação Spring pode exigir:

- escolha manual de versões compatíveis;
- configuração de beans de infraestrutura;
- configuração do servidor;
- empacotamento;
- bootstrap;
- logging;
- propriedades;
- integração de bibliotecas;
- diagnóstico de startup.

Boot reduz esse trabalho usando uma combinação de:

```text
dependency management;

starters;

auto-configuration;

conventions;

runtime executável;

externalized configuration.
```

---

### Aplicacao standalone

Spring Boot foi projetado para facilitar aplicações que podem ser executadas diretamente.

Formato comum:

```powershell
java -jar aplicacao.jar
```

Uma aplicação web pode carregar um servidor dentro do próprio processo.

Isso reduz a necessidade de instalar um servidor externo e publicar um WAR manualmente.

Boot também permite cenários tradicionais de WAR, mas o curso adotará aplicações executáveis.

---

### Production-grade

A expressão:

```text
production-grade
```

não significa que qualquer projeto Boot está automaticamente pronto para produção.

Significa que o Boot fornece suporte e integrações para necessidades operacionais, como:

- health;
- metrics;
- configuration;
- logging;
- graceful shutdown;
- observabilidade;
- informação de aplicação.

Muitas dessas capacidades são expostas por Spring Boot Actuator.

Elas precisam ser configuradas, protegidas e testadas.

---

### Opiniao e convencao

Spring Boot é opinionated.

Isso significa que escolhe padrões razoáveis quando a aplicação não declarou outra decisão.

Exemplos conceituais:

```text
logging padrão;

servidor padrão;

pool padrão;

serialização padrão;

local de configuração;

nome de propriedades.
```

Convenção acelera o início.

Override continua possível.

A equipe precisa saber quando aceitar o padrão e quando substituí-lo.

---

### Dependency management

Uma aplicação moderna depende de muitas bibliotecas.

Versões incompatíveis podem causar:

- `NoSuchMethodError`;
- `ClassNotFoundException`;
- falha de bootstrap;
- comportamento divergente;
- vulnerabilidade;
- conflito transitivo.

Spring Boot publica um conjunto coerente de versões.

Com Maven, uma forma comum é usar:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.0</version>
</parent>
```

Depois, dependências gerenciadas podem omitir versões individuais.

Exemplo:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
```

Não significa que nunca será possível sobrescrever uma versão.

Significa que a versão gerenciada deve ser o ponto de partida.

Overrides exigem motivo e testes.

---

### Parent versus BOM

O parent fornece:

- dependency management;
- plugin management;
- propriedades;
- defaults de build.

Outra estratégia é importar:

```text
spring-boot-dependencies
```

como BOM.

O curso começará com o parent porque o projeto será Maven e a estrutura ficará mais simples.

A escolha será aprofundada quando o projeto for gerado.

---

### Starter

Starter é uma dependência de conveniência.

Ele reúne dependências normalmente necessárias para uma capacidade.

Exemplos atuais:

```text
spring-boot-starter:
núcleo, auto-configuração, logging e YAML.

spring-boot-starter-webmvc:
Spring MVC e Tomcat.

spring-boot-starter-data-jpa:
Spring Data JPA e Hibernate.

spring-boot-starter-jdbc:
JDBC e HikariCP.

spring-boot-starter-flyway:
Flyway.

spring-boot-starter-validation:
Bean Validation.

spring-boot-starter-test:
bibliotecas de teste.
```

Na linha 4.1, o starter `spring-boot-starter-web` aparece como legado em favor de:

```text
spring-boot-starter-webmvc.
```

Quando a parte web começar, a formação usará a opção atual recomendada.

---

### Starter nao e auto-configuracao inteira

Um starter normalmente coloca bibliotecas no classpath.

Auto-configuração contém as classes que analisam condições e registram beans.

É útil separar mentalmente:

```text
starter:
seleção conveniente de dependências.

auto-configuration:
decisão condicional de configuração.
```

---

### Classpath

Classpath é o conjunto de classes e recursos disponíveis para a JVM.

Auto-configurações frequentemente perguntam:

```text
a classe X existe?

a classe Y não existe?

o bean Z já existe?

a propriedade P foi configurada?
```

Dependências alteram as respostas.

Por isso, adicionar um starter não é uma ação neutra.

Ele pode habilitar novas auto-configurações.

---

### Auto-configuracao

Spring Boot tenta configurar a aplicação com base no ambiente.

Uma classe de auto-configuração pode ser condicionada por:

- classe presente;
- classe ausente;
- bean presente;
- bean ausente;
- propriedade;
- tipo da aplicação;
- recurso;
- expressão;
- aplicação web ou não web.

A lógica conceitual é:

```text
SE dependências compatíveis estão presentes
E propriedades necessárias existem
E a aplicação não forneceu um bean substituto
ENTÃO registrar configuração padrão.
```

---

### Back-off

Back-off é a capacidade de a auto-configuração recuar quando encontra uma decisão da aplicação.

Exemplo conceitual:

```text
Boot sabe configurar DataSource.

A aplicação declara seu próprio DataSource.

A auto-configuração condicional não cria o padrão.
```

Isso torna a automação não invasiva.

Entretanto, declarar um bean customizado significa assumir responsabilidade por ele.

---

### Ativacao da auto-configuracao

A auto-configuração precisa ser ativada.

No desenvolvimento comum, isso ocorre por:

```java
@SpringBootApplication
```

ou diretamente por:

```java
@EnableAutoConfiguration
```

A aula 358 aprofundará essa ativação.

Nesta aula, nenhuma das duas annotations será usada.

O laboratório inspeciona o classpath sem iniciar o mecanismo.

---

### SpringApplication

`SpringApplication` coordena o bootstrap.

Ele pode:

- determinar o tipo da aplicação;
- preparar environment;
- criar contexto apropriado;
- registrar listeners;
- carregar beans;
- publicar eventos;
- processar runners;
- finalizar startup.

Nesta aula, a classe será apenas detectada no classpath.

Ela não será executada.

---

### Tipos de aplicacao

Boot diferencia cenários como:

```text
aplicação não web;

aplicação servlet;

aplicação reativa.
```

O classpath ajuda nessa decisão.

Sem starter web, o laboratório atual não terá Spring MVC nem Tomcat.

Logo, não existe motivo para um servidor HTTP iniciar.

---

### Servidor embarcado

Em uma aplicação web servlet, o servidor pode fazer parte do artefato.

Com o starter adequado, Tomcat costuma ser a opção padrão.

Alternativas podem incluir Jetty.

No Spring Boot 4.1, a linha atual suporta Tomcat 11 e Servlet 6.1.

A escolha do servidor afeta:

- dependências;
- configuração;
- threads;
- conexão;
- limites;
- observabilidade;
- compatibilidade servlet.

Nesta aula, o servidor será somente um conceito.

---

### Executable jar

O plugin Maven do Spring Boot pode reorganizar o jar para incluir:

- classes da aplicação;
- dependências;
- loader;
- metadata.

O resultado pode ser executado com `java -jar`.

O processo de build e a diferença entre jar comum e jar executável serão praticados nas aulas seguintes.

---

### Configuracao externa

Boot fornece uma infraestrutura rica para configuração.

Fontes podem incluir:

- arquivos properties;
- YAML;
- variáveis de ambiente;
- argumentos;
- system properties;
- configuração externa ao jar.

A precedência e os profiles serão estudados na aula 359.

Agora o ponto central é:

```text
configuração não deve ficar fixada no código.
```

---

### Diagnostics

Quando uma auto-configuração não acontece, a pergunta correta não é:

```text
por que o Boot está quebrado?
```

O diagnóstico deve verificar:

1. dependência presente;
2. annotation de ativação;
3. propriedade;
4. bean customizado;
5. tipo da aplicação;
6. condição não atendida;
7. relatório de condições;
8. logs.

A formação manterá o princípio:

```text
sem magia;
com condições observáveis.
```

---

### Actuator

Actuator adiciona capacidades operacionais.

Exemplos:

- health;
- info;
- metrics;
- environment;
- loggers;
- mappings;
- startup;
- thread dumps.

Endpoints não devem ser expostos indiscriminadamente.

Segurança, acesso e conteúdo precisam ser avaliados.

Actuator terá aprofundamento posterior.

Nesta aula, ele aparece como parte do conceito de aplicação operável.

---

### Ecossistema Spring Boot

Spring Boot não existe isoladamente.

Ele integra diversos projetos Spring e bibliotecas de terceiros.

Exemplos:

```text
Spring Framework;

Spring Data;

Spring Security;

Spring Validation;

Spring Batch;

Spring Integration;

Spring Kafka;

Micrometer;

Jackson;

Tomcat;

Flyway;

Hibernate.
```

O Boot não reimplementa todos esses projetos.

Ele fornece versões compatíveis, starters e auto-configurações.

Esse entendimento ajuda a procurar documentação no lugar certo.

Uma dúvida sobre transação declarativa pode pertencer ao Spring Framework.

Uma dúvida sobre repository pode pertencer ao Spring Data.

Uma dúvida sobre mapping pode pertencer ao Hibernate ou à especificação JPA.

Uma dúvida sobre condição de startup pode pertencer ao Spring Boot.

---

### Boot e persistencia

No M13, você declarou manualmente:

```text
DataSource;

HikariConfig;

HikariDataSource;

LocalContainerEntityManagerFactoryBean;

JpaTransactionManager;

@EnableJpaRepositories;

Flyway.
```

Com starters e propriedades adequadas, Boot poderá fornecer parte dessa configuração.

Ainda será sua responsabilidade:

- URL e credenciais seguras;
- migrations;
- mappings;
- transações;
- queries;
- constraints;
- performance;
- testes.

---

### Boot e testes

Spring Boot oferece suporte para:

- contexto completo;
- slices;
- propriedades de teste;
- test clients;
- mocks de borda;
- Testcontainers;
- integração com JUnit.

Carregar tudo em todo teste é caro e desnecessário.

As slices serão estudadas quando as camadas correspondentes existirem.

---

### Boot nao e microservico

Spring Boot pode construir:

- monólitos;
- modular monoliths;
- APIs;
- batch jobs;
- CLIs;
- workers;
- microsserviços.

A arquitetura não é definida apenas pela ferramenta.

Adicionar Boot não transforma automaticamente um projeto em microserviço.

---

### Boot nao garante qualidade

Uma aplicação Boot ainda pode possuir:

- transação errada;
- N+1;
- entidade exposta;
- SQL lento;
- senha no Git;
- migration destrutiva;
- endpoint inseguro;
- teste frágil;
- acoplamento excessivo.

Boot acelera a montagem.

Qualidade depende de decisões e evidências.

---

### Custo da conveniencia

Toda conveniência possui custo de compreensão.

Ao aceitar uma configuração padrão, registre:

```text
qual starter trouxe a capacidade;

qual bean foi criado;

qual propriedade controla;

qual versão foi gerenciada;

como substituir;

como testar.
```

Não é necessário decorar todas as auto-configurações.

É necessário saber investigá-las.

---

### Criterio de adocao no curso

O M14 seguirá quatro critérios:

```text
starter mínimo:
adicionar somente o necessário.

configuração observável:
propriedades e beans identificáveis.

override consciente:
customizar somente com motivo.

teste proporcional:
carregar apenas a infraestrutura exigida.
```

Esses critérios reduzem projetos inchados e diagnósticos confusos.

---

### Panorama do backend que sera construido

O módulo avançará em camadas:

```text
bootstrap;

configuração;

beans;

web MVC;

contratos HTTP;

validação;

erros;

persistência;

testes;

documentação;

cache;

observabilidade;

projeto completo.
```

A persistência do M13 será reutilizada.

A nova complexidade virá principalmente de:

- protocolo HTTP;
- serialização;
- status codes;
- contratos de entrada e saída;
- validação de fronteira;
- segurança;
- testes da camada web.

---

### Verificacao consciente de versao

A formação fixa versões para manter reprodutibilidade.

Isso não significa ignorar atualizações.

Antes de atualizar Spring Boot, revise:

- release notes;
- requisitos de Java e Maven;
- alterações de starters;
- bibliotecas gerenciadas;
- deprecações;
- migrations necessárias;
- impacto nos testes;
- compatibilidade de plugins.

A atualização deve ocorrer em branch própria, com build limpo e suíte completa.

Durante o M14, a versão 4.1.0 será mantida até uma decisão explícita de atualização do cronograma.

---

## Mao na massa guiada

### 1. Criar a estrutura

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m14\aula-356-spring-boot-visao-geral\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m14\aula-356-spring-boot-visao-geral\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m14\aula-356-spring-boot-visao-geral\src\main\java\br\com\formacao\m14\aula356"

New-Item -ItemType Directory -Force `
  -Path "labs\m14\aula-356-spring-boot-visao-geral\src\test\java\br\com\formacao\m14\aula356"

Set-Location `
  "labs\m14\aula-356-spring-boot-visao-geral"
```

---

### 2. Criar .gitignore

Inclua:

```text
target/

.idea/

*.iml

effective-pom.xml

dependency-tree.txt
```

Não ignore arquivos de documentação.

---

### 3. Criar pom.xml

Use:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.0</version>
    <relativePath/>
</parent>
```

Projeto:

```text
groupId:
br.com.formacao.

artifactId:
aula-356-spring-boot-visao-geral.

version:
1.0.0-SNAPSHOT.

Java:
21.
```

Dependências:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

Não adicione:

- web MVC;
- JDBC;
- JPA;
- Flyway;
- PostgreSQL;
- Actuator;
- DevTools.

A ausência é parte do experimento.

---

### 4. Adicionar exec plugin

Adicione o plugin Maven Exec somente para executar o inspector puro.

Main class:

```text
br.com.formacao.m14.aula356.BootClassPathInspector.
```

Não adicione o plugin Spring Boot ainda.

O plugin oficial será praticado quando existir aplicação executável.

---

### 5. Criar ClassPathObservation.java

```java
public record ClassPathObservation(
        String capability,
        String className,
        boolean present,
        String interpretation
) {
}
```

Valide textos obrigatórios no construtor compacto.

---

### 6. Criar OverviewReport.java

```java
public record OverviewReport(
        String javaVersion,
        String bootVersion,
        List<ClassPathObservation> observations
) {

    public OverviewReport {
        observations =
                List.copyOf(
                        observations
                );
    }

    public long presentCount() {
        return observations.stream()
                .filter(
                        ClassPathObservation::present
                )
                .count();
    }

    public long absentCount() {
        return observations.size()
                - presentCount();
    }
}
```

---

### 7. Criar BootClassPathInspector.java

O inspector usará:

```java
Class.forName(
        className
);
```

ou `ClassUtils.isPresent`.

Não iniciará contexto Spring.

Verifique:

```text
org.springframework.boot.SpringApplication;

org.springframework.boot.autoconfigure.EnableAutoConfiguration;

org.springframework.context.ApplicationContext;

org.slf4j.LoggerFactory;

org.springframework.web.servlet.DispatcherServlet;

org.apache.catalina.startup.Tomcat;

org.springframework.data.jpa.repository.JpaRepository;

org.flywaydb.core.Flyway;

org.postgresql.Driver.
```

Interpretação:

- quatro primeiras devem estar presentes;
- classes de web, JPA, Flyway e PostgreSQL devem estar ausentes.

Não faça assert rígido sobre classes internas transitivas não documentadas.

---

### 8. Obter versao do Boot

Use:

```java
SpringBootVersion.getVersion()
```

O relatório deve mostrar:

```text
4.1.0.
```

Se vier `null`, trate claramente.

---

### 9. Imprimir o relatorio

Formato:

```text
SPRING BOOT OVERVIEW INSPECTOR

Java:
21.x

Spring Boot:
4.1.0

Capability | Present | Class | Interpretation
```

Finalize com:

```text
Nenhuma aplicacao foi iniciada.
Nenhum servidor foi iniciado.
O resultado descreve somente o classpath.
```

---

### 10. Criar teste do inspector

`BootClassPathInspectorTest` valida:

- versão Boot;
- `SpringApplication` presente;
- auto-config annotation presente;
- contexto Spring presente;
- logging presente;
- MVC ausente;
- Tomcat ausente;
- JPA ausente;
- Flyway ausente;
- PostgreSQL ausente.

O teste não inicia contexto.

---

### 11. Criar ModuleBoundaryTest

Valide por reflection ou leitura de source:

- zero `@SpringBootApplication`;
- zero `@EnableAutoConfiguration`;
- zero `SpringApplication.run`;
- zero controller;
- zero starter web;
- zero starter JPA;
- zero servidor iniciado;
- ponte para a aula 357 documentada.

---

### 12. Criar script de ambiente

`01_validar_ambiente.ps1`:

```powershell
java -version
javac -version
mvn -version
git status
```

Valide Java 21.

Valide Maven 3.6.3 ou superior.

Não altere ferramentas automaticamente.

---

### 13. Criar dependency tree

`02_exibir_dependency_tree.ps1`:

```powershell
mvn dependency:tree `
  -DoutputFile=dependency-tree.txt

Get-Content dependency-tree.txt
```

Identifique:

- starter central;
- Spring Boot;
- auto-configure;
- Spring Core;
- logging.

A árvore exata pode variar por versão gerenciada.

---

### 14. Gerar effective POM

`03_gerar_effective_pom.ps1`:

```powershell
mvn help:effective-pom `
  -Doutput=effective-pom.xml
```

Pesquise:

```text
java.version;

plugins;

dependencyManagement;

encoding;

compiler.
```

Não versione o arquivo gerado.

---

### 15. Executar inspector

`04_executar_inspector.ps1`:

```powershell
mvn clean test

mvn exec:java `
  -Dexec.mainClass="br.com.formacao.m14.aula356.BootClassPathInspector"
```

Confirme que não aparece porta HTTP.

---

### 16. Validar laboratorio

`05_validar_laboratorio.ps1` confirma:

- build verde;
- relatório executado;
- dependency tree existe;
- effective POM existe;
- classes esperadas presentes;
- classes específicas ausentes;
- nenhuma aplicação Boot iniciada;
- nenhum servidor iniciado.

---

### 17. Criar mapa Framework versus Boot

Documento:

```text
spring-framework-vs-spring-boot.md
```

Inclua uma matriz:

```text
container IoC:
Framework.

auto-configuração:
Boot.

Spring MVC:
Framework.

starter webmvc:
Boot.

transações:
Framework.

configuração automática do transaction manager:
Boot.

Spring Data:
projeto Spring Data.

integração gerenciada:
Boot.
```

---

### 18. Criar mapa manual versus auto-configuracao

Compare o M13 com o futuro M14:

```text
DataSource manual
versus
DataSourceAutoConfiguration.

JpaTransactionManager manual
versus
auto-configuração JPA.

Flyway bean manual
versus
integração automática.

contexto criado manualmente
versus
SpringApplication.
```

Não trate nomes de auto-configuração como API de negócio.

---

### 19. Documentar starters

Em `starters-e-classpath.md`, registre:

- o que é starter;
- o que ele não é;
- impacto no classpath;
- exemplos usados no M14;
- riscos de adicionar dependência sem necessidade.

---

### 20. Documentar servidor embarcado

Explique:

```text
processo Java;

servidor interno;

porta;

shutdown;

jar executável;

diferença para WAR tradicional.
```

Não inicie servidor nesta aula.

---

### 21. Documentar anti-magia

Em `anti-magia.md`, crie o checklist:

```text
qual starter?

qual classe no classpath?

qual propriedade?

qual bean já existe?

qual condição?

qual auto-configuração?

qual log?

qual resultado?
```

Esse checklist será reutilizado durante todo o M14.

---

### 22. Executar o laboratorio completo

Ordem:

```powershell
.\scripts\01_validar_ambiente.ps1
.\scripts\02_exibir_dependency_tree.ps1
.\scripts\03_gerar_effective_pom.ps1
.\scripts\04_executar_inspector.ps1
.\scripts\05_validar_laboratorio.ps1
```

Resultado:

```text
BUILD SUCCESS;

Spring Boot 4.1.0;

núcleo presente;

web ausente;

JPA ausente;

servidor ausente;

documentação concluída.
```

---

## Entendendo o que foi feito

### O Boot foi observado antes de ser executado

Você inspecionou dependências e classpath sem depender de uma aplicação pronta.

### Starter e auto-configuracao foram separados

Uma dependência habilita possibilidades; as condições decidem configurações.

### Ausencia tambem virou evidencia

Sem starter web, não havia MVC nem Tomcat.

### O M13 foi conectado ao M14

Beans manuais foram associados às automações futuras.

### A magia foi substituida por diagnostico

Classpath, propriedade, bean e condição formaram um método de análise.

---

## Erros comuns importantes

### Dizer que Boot substitui Spring

Boot é construído sobre Spring Framework.

### Adicionar todos os starters

Cada starter altera dependências e auto-configurações possíveis.

### Achar que starter sempre cria bean

Condições e propriedades ainda precisam ser atendidas.

### Confundir servidor embarcado com servidor inexistente

Ele existe, mas é iniciado dentro do processo da aplicação.

### Comecar pelo endpoint sem entender bootstrap

O módulo seguirá uma progressão controlada.

---

## Comandos uteis

### Versoes

```powershell
java -version
javac -version
mvn -version
```

### Dependencias

```powershell
mvn dependency:tree
```

### Effective POM

```powershell
mvn help:effective-pom `
  -Doutput=effective-pom.xml
```

### Testes

```powershell
mvn clean test
```

### Inspector

```powershell
mvn exec:java `
  -Dexec.mainClass="br.com.formacao.m14.aula356.BootClassPathInspector"
```

---

## Exercicio guiado

### Parte 1 — Mapa do M13

Liste dez beans configurados manualmente no M13.

Associe cada um à automação que espera do Boot.

### Parte 2 — Classpath

Adicione temporariamente o starter JDBC.

Execute o inspector.

Observe novas classes.

Restaure o POM oficial.

### Parte 3 — Web

Sem adicionar starter, explique por que `DispatcherServlet` está ausente.

### Parte 4 — Dependency management

Escolha uma dependência gerenciada.

Localize sua versão no effective POM.

Não fixe versão manual.

### Parte 5 — Back-off

Desenhe um cenário em que a aplicação declara o próprio `DataSource`.

Explique por que o Boot deve recuar.

### Parte 6 — Diagnostico

Crie um cartão:

```text
Starter presente;
bean ausente;
qual sequência investigar?
```

Use o checklist anti-magia.

### Parte 7 — Servidor

Compare aplicação WAR tradicional e jar executável com servidor embarcado.

### Parte 8 — ADR

Registre:

```text
Spring Boot 4.1.0;

Java 21;

Maven;

parent oficial;

starters mínimos;

sem Boot magic;

classpath e condições inspecionados;

Spring Initializr somente na aula 357.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- abertura do M14 foi entregue;
- continuidade com o M13 foi preservada;
- Spring Boot 4.1.0 foi adotado;
- Java 21 foi mantido;
- Maven 3.6.3 ou superior foi exigido;
- Spring Framework 7.0.8 ou superior foi reconhecido;
- compatibilidade Java foi explicada;
- Spring Framework foi diferenciado de Spring Boot;
- Boot não foi tratado como framework isolado;
- aplicação standalone foi explicada;
- production-grade foi explicado;
- opinião e convenção foram explicadas;
- dependency management foi explicado;
- parent foi explicado;
- BOM foi mencionado;
- starter foi explicado;
- auto-configuração foi separada de starter;
- classpath foi explicado;
- condições foram explicadas;
- back-off foi explicado;
- ativação foi explicada sem implementação;
- `@SpringBootApplication` foi apresentada sem uso;
- `SpringApplication` foi apresentada sem execução;
- tipos de aplicação foram apresentados;
- servidor embarcado foi explicado;
- Tomcat foi apresentado sem inicialização;
- jar executável foi explicado;
- configuração externa foi introduzida;
- diagnóstico de condições foi criado;
- Actuator foi introduzido;
- ecossistema Spring foi mapeado;
- custo da conveniência foi discutido;
- critérios de adoção foram definidos;
- panorama do backend foi apresentado;
- verificação consciente de versão foi definida;
- DevTools não foi adicionado;
- persistência manual foi conectada à futura automação;
- responsabilidade do desenvolvedor foi preservada;
- Boot não foi tratado como microserviço;
- qualidade não foi tratada como automática;
- laboratório oficial foi criado;
- parent Boot foi usado;
- starter central foi usado;
- starter de teste foi usado;
- starter web não foi usado;
- starter JPA não foi usado;
- JDBC não foi adicionado oficialmente;
- Flyway não foi adicionado oficialmente;
- PostgreSQL não foi adicionado oficialmente;
- Actuator não foi adicionado;
- DevTools não foi adicionado;
- plugin Boot não foi adicionado;
- inspector puro foi criado;
- contexto Spring não foi iniciado;
- servidor não foi iniciado;
- `SpringApplication` foi detectada;
- auto-config annotation foi detectada;
- `ApplicationContext` foi detectado;
- logging foi detectado;
- MVC ficou ausente;
- Tomcat ficou ausente;
- JPA ficou ausente;
- Flyway ficou ausente;
- PostgreSQL ficou ausente;
- relatório de classpath foi criado;
- dependency tree foi gerada;
- effective POM foi gerado;
- classes internas instáveis não foram usadas como contrato;
- teste do inspector foi criado;
- teste de fronteira foi criado;
- zero `@SpringBootApplication`;
- zero `SpringApplication.run`;
- zero controller;
- zero endpoint;
- documentação Framework versus Boot foi criada;
- mapa manual versus automático foi criado;
- starters foram documentados;
- servidor embarcado foi documentado;
- checklist anti-magia foi criado;
- Spring Initializr não foi antecipado;
- estrutura do projeto oficial não foi antecipada;
- Main Application não foi antecipada;
- auto-configuração profunda não foi antecipada;
- properties e profiles não foram antecipados;
- REST não foi antecipado;
- ponte para a aula 357 está correta;
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
  labs/m14/aula-356-spring-boot-visao-geral `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "docs(m14): introduzir visao geral do spring boot"
```

Valide:

```powershell
git log -1 --oneline
```

Não adicione:

- `target`;
- effective POM;
- dependency tree gerada;
- arquivos da IDE;
- configurações locais.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou o Módulo 14 entendendo o papel do Spring Boot.

O mapa principal ficou:

```text
Spring Framework:
fundação.

Spring Boot:
automação e convenções.

starter:
dependências para uma capacidade.

classpath:
possibilidades disponíveis.

auto-configuration:
configuração condicional.

back-off:
respeito à decisão da aplicação.

embedded server:
servidor dentro do processo.

executable jar:
aplicação distribuível.

Actuator:
recursos operacionais.
```

O laboratório comprovou:

```text
Spring Boot presente;

Spring Framework presente;

auto-configuração disponível;

logging disponível;

web ausente;

Tomcat ausente;

JPA ausente;

Flyway ausente;

PostgreSQL ausente;

nenhuma aplicação iniciada.
```

A principal regra do novo módulo será:

```text
não aceitar automação sem saber
qual condição a ativou
e qual configuração foi criada.
```

A próxima aula será:

```text
357 - M14.02 - Spring Initializr e estrutura do projeto
```

Nela, você:

- acessará o Spring Initializr;
- escolherá Maven;
- escolherá Java;
- fixará Spring Boot 4.1.0;
- escolherá Java 21;
- definirá group e artifact;
- selecionará dependências iniciais;
- baixará o projeto;
- abrirá no IntelliJ Community;
- analisará diretórios;
- estudará `pom.xml`;
- executará o primeiro build;
- entenderá Maven Wrapper;
- verificará estrutura de testes;
- registrará a baseline do projeto.

A aula 356 respondeu:

```text
o que é Spring Boot e por que ele existe?
```

A aula 357 responderá:

```text
como gerar corretamente
o primeiro projeto Spring Boot da formação?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar Spring Framework e Spring Boot.
- [ ] Sei explicar starters, classpath e auto-configuração.
- [ ] Sei explicar back-off e servidor embarcado.
- [ ] Inspecionei dependências sem iniciar aplicação.
- [ ] Estou pronto para gerar o projeto no Initializr.

---

## Troubleshooting adicional

### Maven nao encontra Boot 4.1.0

Revise internet, proxy, settings.xml e repositório Maven.

### Inspector encontrou Tomcat

Existe dependência web ou Tomcat transitiva não prevista.

### Inspector encontrou JPA

Revise o dependency tree e remova starter indevido.

### Effective POM ficou enorme

Isso é esperado; pesquise propriedades específicas.

### Um starter mudou o classpath

Esse é exatamente o comportamento que o laboratório demonstra.

---

## Perguntas de revisao

1. Spring Boot substitui Spring Framework?
2. Qual problema o Boot resolve?
3. O que é dependency management?
4. O que é starter?
5. Starter e auto-configuração são iguais?
6. O que é classpath?
7. O que é configuração condicional?
8. O que significa back-off?
9. Como auto-configuração é ativada?
10. O que faz `SpringApplication`?
11. O que é aplicação standalone?
12. O que é servidor embarcado?
13. O jar pode ser executável?
14. O que é configuração externa?
15. O que é Actuator?
16. Boot garante qualidade?
17. Qual versão foi adotada?
18. Qual Java será usado?
19. O Initializr foi usado nesta aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Não; ele usa o Framework.
2. Reduz configuração e integração repetitiva.
3. Conjunto coerente de versões.
4. Dependência de conveniência.
5. Não.
6. Classes e recursos disponíveis.
7. Configuração aplicada quando condições combinam.
8. Auto-configuração recua diante de bean próprio.
9. Por annotation principal.
10. Coordena bootstrap.
11. Aplicação executada diretamente.
12. Servidor no processo.
13. Sim.
14. Configuração fora do código.
15. Recursos operacionais.
16. Não.
17. 4.1.0.
18. Java 21.
19. Não.
20. Spring Initializr e estrutura do projeto.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 356 - M14.01 - Spring Boot visao geral

- Iniciei o Módulo 14.
- Diferenciei Spring Framework de Spring Boot.
- Entendi que Boot usa o Spring Framework.
- Entendi aplicações standalone.
- Entendi a ideia de produção e operabilidade.
- Entendi convenções e opiniões.
- Conheci dependency management.
- Diferenciei parent e BOM.
- Entendi o papel dos starters.
- Diferenciei starter de auto-configuração.
- Entendi o impacto do classpath.
- Entendi auto-configuração condicional.
- Entendi o mecanismo de back-off.
- Conheci `@SpringBootApplication` sem usá-la.
- Conheci `SpringApplication` sem executá-la.
- Diferenciei aplicação não web, servlet e reativa.
- Entendi servidor embarcado.
- Entendi jar executável.
- Introduzi configuração externa.
- Criei um checklist anti-magia.
- Conheci Actuator conceitualmente.
- Mapeei o ecossistema integrado pelo Boot.
- Mantive Spring Boot 4.1.0.
- Mantive Java 21.
- Usei o parent oficial do Boot.
- Adicionei somente o starter central e o starter de testes.
- Inspecionei o dependency tree.
- Inspecionei o effective POM.
- Criei um inspector de classpath.
- Confirmei o núcleo do Boot presente.
- Confirmei web, Tomcat, JPA, Flyway e PostgreSQL ausentes.
- Não iniciei contexto ou servidor.
- Conectei a configuração manual do M13 à automação futura.
- Não usei Spring Initializr ainda.
- Próxima aula: Spring Initializr e estrutura do projeto.
```

---

## Referencia tecnica curta

```text
Framework:
fundação.

Boot:
automação.

Starter:
dependências.

Classpath:
condições possíveis.

Auto-config:
decisão condicional.

Back-off:
recuo.

Embedded:
servidor interno.

Jar:
execução direta.

Actuator:
operação.

Initializr:
próxima aula.
```

Regra final:

```text
Spring Boot deve ser entendido como uma camada de convencoes, dependency management, starters, bootstrap e auto-configuracao condicional sobre o Spring Framework; ele reduz configuracao repetitiva, mas nao remove a responsabilidade por arquitetura, propriedades, transacoes, persistencia, seguranca, SQL, testes e diagnostico, e toda automacao deve ser explicada por classpath, condicoes, beans e configuracoes observaveis.
```
