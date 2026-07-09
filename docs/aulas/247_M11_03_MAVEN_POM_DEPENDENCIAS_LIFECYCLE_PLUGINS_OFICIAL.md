# 247 — M11.03 — Maven profissional: POM, dependências, lifecycle, plugins e build

## Objetivo da aula

Antes de começar a parte técnica, vamos reforçar o objetivo do curso.

Este curso não é apenas para aprender Java básico.

O objetivo é construir uma formação completa de Java Backend, saindo do nível básico e evoluindo até um nível avançado, com base para atuar como:

```text
desenvolvedor Java Backend;
desenvolvedor Java Backend pleno;
desenvolvedor Java Backend sênior;
engenheiro de software Java;
arquiteto Java;
profissional capaz de entender código, ferramentas, arquitetura e operação real.
```

Por isso, quando entramos em ferramentas como Maven, Gradle, Git, Docker, banco, testes, observabilidade e Spring, não vamos tratar como curiosidade.

Vamos aprofundar.

Nesta aula, vamos estudar Maven de forma profissional.

Você vai entender:

```text
o que é Maven;
por que Maven existe;
como Maven organiza projeto Java;
o que é pom.xml;
o que são coordenadas Maven;
o que são dependências;
o que são dependências transitivas;
o que é Maven Central;
o que é repositório local .m2;
o que é lifecycle;
o que são phases;
o que são goals;
o que são plugins;
o que são scopes;
como rodar build;
como rodar testes;
como empacotar;
como diagnosticar problemas;
como Maven prepara Spring;
como Maven aparece em empresa.
```

Ao final desta aula, você deve conseguir:

```text
ler um pom.xml com segurança;
entender dependências;
entender lifecycle;
executar comandos Maven;
entender target;
entender plugins;
entender scopes;
diagnosticar erro de dependência;
diagnosticar erro de versão Java;
criar projeto Maven básico;
preparar base para projetos Spring Boot reais.
```

---

# Parte 1 — Por que Maven existe

Imagine um projeto Java sem Maven.

Você precisa usar bibliotecas externas como:

```text
JUnit;
Mockito;
PostgreSQL Driver;
Jackson;
Spring Boot;
Hibernate;
Flyway;
Lombok;
MapStruct.
```

Sem Maven, você teria que:

```text
baixar .jar manualmente;
descobrir dependências dessas bibliotecas;
colocar tudo no classpath;
controlar versões;
compilar no terminal;
rodar testes manualmente;
empacotar jar manualmente;
garantir que todo dev use as mesmas versões;
garantir que o pipeline use as mesmas versões.
```

Isso é inviável em projeto profissional.

Maven resolve esse problema padronizando:

```text
estrutura do projeto;
gerenciamento de dependências;
ciclo de build;
plugins;
testes;
empacotamento;
publicação de artefatos;
integração com IDE;
integração com CI/CD.
```

---

## Maven em uma frase prática

```text
Maven é uma ferramenta de build e gerenciamento de dependências para projetos Java.
```

Ou:

```text
Maven transforma código fonte em artefato, baixando dependências e seguindo um ciclo de build padronizado.
```

---

# Parte 2 — Maven não substitui Java

Maven não executa mágica.

Por baixo, Maven usa ferramentas do Java.

Quando você roda:

```powershell
mvn compile
```

Maven usa o compilador Java para gerar bytecode.

Quando você roda:

```powershell
mvn test
```

Maven compila código e testes, monta classpath e executa testes via plugin.

Quando você roda:

```powershell
mvn package
```

Maven compila, testa e empacota.

O fluxo base continua:

```text
.java
  -> javac
  -> .class
  -> JVM
```

Maven organiza e automatiza isso.

---

# Parte 3 — Estrutura padrão Maven

Um projeto Maven típico tem:

```text
projeto
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   └── resources
    └── test
        ├── java
        └── resources
```

---

## src/main/java

Código principal da aplicação.

Exemplo:

```text
src/main/java/br/com/curso/App.java
```

---

## src/main/resources

Arquivos de configuração e recursos da aplicação.

Exemplos futuros:

```text
application.properties;
application.yml;
messages.properties;
templates;
arquivos estáticos;
configurações.
```

Em Maven, os recursos são copiados para o classpath.

---

## src/test/java

Código de testes automatizados.

Exemplo futuro:

```text
src/test/java/br/com/curso/AppTest.java
```

---

## src/test/resources

Recursos usados apenas em testes.

Exemplos:

```text
application-test.yml;
massa de teste;
arquivos JSON;
SQL de teste.
```

---

## target

Pasta gerada pelo Maven.

Contém:

```text
classes compiladas;
classes de teste;
relatórios de teste;
jar;
arquivos temporários;
resultado do build.
```

Normalmente, `target` não vai para o Git.

---

# Parte 4 — O arquivo pom.xml

O arquivo principal do Maven é:

```text
pom.xml
```

POM significa:

```text
Project Object Model
```

Em português:

```text
Modelo de Objeto do Projeto
```

Ele descreve:

```text
identidade do projeto;
versão;
dependências;
plugins;
configurações;
módulos;
build;
propriedades;
repositórios;
perfis.
```

---

## POM mínimo

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula-247-maven-basico</artifactId>
    <version>1.0.0</version>

</project>
```

---

## modelVersion

Normalmente:

```xml
<modelVersion>4.0.0</modelVersion>
```

É a versão do modelo POM.

Na prática, para projetos Maven comuns, você usa `4.0.0`.

---

## groupId

Identifica o grupo, organização ou domínio do projeto.

Exemplos:

```text
br.com.curso
br.com.empresa
com.exemplo
org.projeto
```

---

## artifactId

Nome do artefato gerado.

Exemplos:

```text
aula-247-maven-basico
ms-ordem-servico
api-clientes
core-pagamentos
```

---

## version

Versão do projeto.

Exemplos:

```text
1.0.0
1.2.3
0.0.1-SNAPSHOT
```

Em projetos reais, você verá muito:

```text
0.0.1-SNAPSHOT
```

---

# Parte 5 — Coordenadas Maven

A identidade de uma dependência Maven é formada por:

```text
groupId;
artifactId;
version.
```

Exemplo:

```text
org.junit.jupiter:junit-jupiter:5.10.2
```

Isso significa:

```text
groupId = org.junit.jupiter
artifactId = junit-jupiter
version = 5.10.2
```

Essa coordenada permite o Maven localizar a biblioteca.

---

## Exemplo no pom.xml

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
</dependency>
```

---

# Parte 6 — Properties

Properties evitam repetição e centralizam configuração.

Exemplo:

```xml
<properties>
    <java.version>21</java.version>
    <junit.version>5.10.2</junit.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

Uso:

```xml
<version>${junit.version}</version>
```

---

## Configurando versão do Java

Forma comum:

```xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

Forma moderna:

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

---

## source, target e release

```text
source:
versão da linguagem Java aceita no código.

target:
versão do bytecode gerado.

release:
configuração mais consistente para compilar contra uma versão específica da plataforma Java.
```

Em projetos modernos, `release` é uma boa opção.

---

# Parte 7 — Dependências

Dependência é uma biblioteca externa usada pelo projeto.

Exemplos:

```text
JUnit para testes;
Mockito para mocks;
Jackson para JSON;
PostgreSQL Driver para banco;
Spring Boot Starter Web para API REST;
Hibernate para ORM.
```

No Maven, dependências ficam dentro de:

```xml
<dependencies>
    ...
</dependencies>
```

Exemplo:

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

# Parte 8 — Repositórios Maven

Quando você declara uma dependência, o Maven precisa baixá-la de algum lugar.

O repositório público mais conhecido é:

```text
Maven Central
```

Em empresas, também podem existir repositórios privados:

```text
Nexus;
Artifactory;
GitHub Packages;
Azure Artifacts.
```

Fluxo:

```text
pom.xml declara dependência
  -> Maven procura no repositório local
  -> se não encontrar, procura no remoto
  -> baixa para o repositório local
  -> usa no build
```

---

# Parte 9 — Repositório local .m2

O Maven guarda dependências baixadas em uma pasta local.

No Windows, normalmente:

```text
C:\Users\SEU_USUARIO\.m2\repository
```

No Linux/Mac:

```text
~/.m2/repository
```

Essa pasta é o cache local do Maven.

---

## Por que .m2 importa

Se uma dependência foi baixada, Maven pode reutilizar sem baixar de novo.

Se algo corromper na `.m2`, você pode ter erros estranhos.

Às vezes, uma solução é apagar uma dependência específica dentro da `.m2` para o Maven baixar novamente.

Cuidado:

```text
não apague tudo sem necessidade;
em empresa, pode demorar muito baixar novamente;
entenda o erro antes.
```

---

# Parte 10 — Dependências transitivas

Uma dependência pode depender de outras dependências.

Exemplo:

```text
Seu projeto depende de A.
A depende de B.
B depende de C.
```

Então, Maven traz:

```text
A;
B;
C.
```

Essas são dependências transitivas.

---

## Por que isso é importante

Você pode declarar uma dependência e várias outras aparecerem no projeto.

Isso pode gerar:

```text
conflito de versões;
biblioteca duplicada;
vulnerabilidade transitiva;
comportamento inesperado;
classes diferentes no classpath.
```

---

## Ver árvore de dependências

Comando:

```powershell
mvn dependency:tree
```

Ele mostra a árvore de dependências do projeto.

Esse comando é muito útil.

---

# Parte 11 — Escopos de dependência

Maven tem scopes.

Scope define onde a dependência será usada.

Principais:

```text
compile;
provided;
runtime;
test;
system;
import.
```

Vamos focar nos mais importantes.

---

## compile

É o padrão.

A dependência é usada para compilar e rodar.

Exemplo:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.17.0</version>
</dependency>
```

Se não informar scope, geralmente é `compile`.

---

## test

Usada apenas nos testes.

Exemplo:

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
</dependency>
```

Não entra como dependência de produção.

---

## runtime

Não é necessária para compilar, mas é necessária para rodar.

Exemplo comum:

```text
driver JDBC.
```

Você programa contra interfaces JDBC, mas precisa do driver em runtime.

Exemplo futuro:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.3</version>
    <scope>runtime</scope>
</dependency>
```

---

## provided

Está disponível no ambiente de execução, mas não será empacotada.

Exemplo clássico:

```text
servlet-api em servidor externo.
```

Em Spring Boot moderno, você usará menos esse scope no começo, mas é importante conhecer.

---

# Parte 12 — Lifecycle do Maven

Maven tem ciclos de vida.

O principal é:

```text
default lifecycle
```

Ele contém fases.

Fases importantes:

```text
validate;
compile;
test;
package;
verify;
install;
deploy.
```

---

## validate

Valida se o projeto está correto o suficiente para build.

Comando:

```powershell
mvn validate
```

---

## compile

Compila código principal.

Comando:

```powershell
mvn compile
```

Gera classes em:

```text
target/classes
```

---

## test

Compila e executa testes.

Comando:

```powershell
mvn test
```

Gera relatórios em:

```text
target/surefire-reports
```

---

## package

Empacota o projeto.

Comando:

```powershell
mvn package
```

Pode gerar:

```text
.jar;
.war.
```

---

## verify

Executa verificações adicionais.

Comando:

```powershell
mvn verify
```

Muito usado em builds mais completos.

---

## install

Instala o artefato no repositório local `.m2`.

Comando:

```powershell
mvn install
```

Útil quando outro projeto local depende desse artefato.

---

## deploy

Publica artefato em repositório remoto.

Comando:

```powershell
mvn deploy
```

Normalmente usado em CI/CD, não no dia a dia local sem configuração.

---

# Parte 13 — Maven executa fases anteriores

Se você roda:

```powershell
mvn package
```

Maven executa fases anteriores necessárias:

```text
validate;
compile;
test;
package.
```

Se você roda:

```powershell
mvn install
```

Maven executa antes:

```text
validate;
compile;
test;
package;
verify;
install.
```

Regra prática:

```text
fase maior inclui fases anteriores.
```

---

# Parte 14 — Goals

Goal é uma tarefa específica de plugin.

Exemplo:

```powershell
mvn dependency:tree
```

Aqui:

```text
dependency
```

é o plugin.

```text
tree
```

é o goal.

Outro exemplo:

```powershell
mvn clean:clean
```

Plugin:

```text
clean
```

Goal:

```text
clean
```

---

## Phase vs Goal

Phase:

```text
etapa do ciclo de vida.
```

Goal:

```text
tarefa específica executada por plugin.
```

Exemplo:

```powershell
mvn test
```

`test` é phase.

Exemplo:

```powershell
mvn dependency:tree
```

`dependency:tree` é goal.

---

# Parte 15 — Plugins

Maven é altamente baseado em plugins.

Plugins fazem tarefas como:

```text
compilar;
testar;
empacotar;
limpar;
gerar relatório;
copiar recursos;
montar jar;
executar aplicação;
verificar qualidade.
```

---

## Maven Compiler Plugin

Responsável por compilar.

Exemplo:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <release>21</release>
            </configuration>
        </plugin>
    </plugins>
</build>
```

---

## Maven Surefire Plugin

Responsável por rodar testes unitários.

Exemplo:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.2.5</version>
</plugin>
```

---

## Maven Jar Plugin

Responsável por empacotar JAR.

Pode configurar classe principal:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.4.1</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>br.com.curso.aula247.App</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

---

# Parte 16 — POM completo de laboratório

Vamos criar um projeto Maven com:

```text
Java 21;
JUnit;
classe main;
teste;
jar executável simples.
```

Crie a pasta:

```powershell
mkdir labs\m11\aula-247-maven-profissional
cd labs\m11\aula-247-maven-profissional
mkdir src\main\java\br\com\curso\aula247
mkdir src\test\java\br\com\curso\aula247
```

Crie:

```text
pom.xml
```

Conteúdo:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula-247-maven-profissional</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
    </properties>

    <dependencies>
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
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>21</release>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.1</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>br.com.curso.aula247.App</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

---

# Parte 17 — Código do laboratório

Crie:

```text
src/main/java/br/com/curso/aula247/Calculadora.java
```

Código:

```java
package br.com.curso.aula247;

public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }

    public int subtrair(int a, int b) {
        return a - b;
    }

    public int multiplicar(int a, int b) {
        return a * b;
    }

    public int dividir(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero.");
        }

        return a / b;
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula247/App.java
```

Código:

```java
package br.com.curso.aula247;

public class App {
    public static void main(String[] args) {
        Calculadora calculadora = new Calculadora();

        System.out.println("Soma: " + calculadora.somar(10, 5));
        System.out.println("Subtração: " + calculadora.subtrair(10, 5));
        System.out.println("Multiplicação: " + calculadora.multiplicar(10, 5));
        System.out.println("Divisão: " + calculadora.dividir(10, 5));
    }
}
```

---

# Parte 18 — Teste com JUnit

Crie:

```text
src/test/java/br/com/curso/aula247/CalculadoraTest.java
```

Código:

```java
package br.com.curso.aula247;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculadoraTest {
    @Test
    void deveSomarDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.somar(10, 5);

        assertEquals(15, resultado);
    }

    @Test
    void deveSubtrairDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.subtrair(10, 5);

        assertEquals(5, resultado);
    }

    @Test
    void deveMultiplicarDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.multiplicar(10, 5);

        assertEquals(50, resultado);
    }

    @Test
    void deveDividirDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.dividir(10, 5);

        assertEquals(2, resultado);
    }

    @Test
    void naoDeveDividirPorZero() {
        Calculadora calculadora = new Calculadora();

        assertThrows(IllegalArgumentException.class, () -> calculadora.dividir(10, 0));
    }
}
```

---

# Parte 19 — Rodando comandos Maven

Dentro da pasta do projeto, execute:

```powershell
mvn validate
```

Depois:

```powershell
mvn compile
```

Depois:

```powershell
mvn test
```

Depois:

```powershell
mvn package
```

Depois:

```powershell
java -jar target\aula-247-maven-profissional-1.0.0.jar
```

---

## Resultado esperado

O teste deve passar.

O JAR deve executar:

```text
Soma: 15
Subtração: 5
Multiplicação: 50
Divisão: 2
```

---

# Parte 20 — Entendendo a pasta target

Depois do build, observe:

```text
target
├── classes
├── generated-sources
├── generated-test-sources
├── maven-archiver
├── maven-status
├── surefire-reports
├── test-classes
└── aula-247-maven-profissional-1.0.0.jar
```

Pode variar um pouco, mas a ideia é:

```text
classes:
código principal compilado.

test-classes:
testes compilados.

surefire-reports:
resultado dos testes.

jar:
artefato final.
```

---

# Parte 21 — Maven clean

Execute:

```powershell
mvn clean
```

Isso remove:

```text
target
```

Depois execute:

```powershell
mvn package
```

Maven recria tudo.

Regra prática:

```text
se quer build limpo, use mvn clean package.
```

---

# Parte 22 — Skipping tests

Às vezes, alguém roda:

```powershell
mvn package -DskipTests
```

Isso compila testes, mas não executa.

Também existe:

```powershell
mvn package -Dmaven.test.skip=true
```

Esse pode nem compilar testes.

Cuidado.

Em projeto profissional:

```text
não pule testes sem motivo;
se pulou, saiba explicar por quê;
pipeline geralmente deve rodar testes.
```

---

# Parte 23 — effective-pom

Maven tem herança e defaults.

O POM real usado pelo Maven é chamado:

```text
effective POM
```

Você pode ver com:

```powershell
mvn help:effective-pom
```

Isso mostra configurações finais após aplicar:

```text
POM do projeto;
POM pai;
super POM;
plugins padrão;
properties.
```

É útil para diagnosticar comportamento inesperado.

---

# Parte 24 — dependency tree

Execute:

```powershell
mvn dependency:tree
```

Você verá algo como:

```text
br.com.curso:aula-247-maven-profissional:jar:1.0.0
\- org.junit.jupiter:junit-jupiter:jar:5.10.2:test
   +- org.junit.jupiter:junit-jupiter-api:jar:5.10.2:test
   +- org.junit.jupiter:junit-jupiter-params:jar:5.10.2:test
   \- org.junit.jupiter:junit-jupiter-engine:jar:5.10.2:test
```

Isso mostra dependências transitivas.

---

# Parte 25 — Problemas comuns com dependências

## 1. Dependência sem versão

Erro comum:

```text
dependencies.dependency.version is missing
```

Causa:

```text
dependência declarada sem version;
não há parent/BOM gerenciando versão.
```

Em Spring Boot, muitas versões vêm do parent/BOM.

Mas em projeto Maven puro, você precisa declarar.

---

## 2. Dependência não encontrada

Erro:

```text
Could not find artifact
```

Possíveis causas:

```text
groupId errado;
artifactId errado;
version errada;
internet/proxy;
repositório privado não configurado;
dependência não existe no Maven Central.
```

---

## 3. Conflito de versão

Sintomas:

```text
NoSuchMethodError;
ClassNotFoundException;
comportamento estranho;
duas versões transitivas.
```

Diagnóstico:

```powershell
mvn dependency:tree
```

---

## 4. Dependência em scope errado

Exemplo:

```text
biblioteca necessária em runtime marcada como test.
```

Resultado:

```text
compila em teste, mas falha em execução.
```

---

# Parte 26 — BOM e dependencyManagement

BOM significa:

```text
Bill of Materials
```

Em Maven, BOM ajuda a gerenciar versões compatíveis de várias dependências.

Exemplo conceitual:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.exemplo</groupId>
            <artifactId>exemplo-bom</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Depois, dependências podem omitir versão porque o BOM gerencia.

---

## Spring Boot e BOM

Spring Boot usa muito essa ideia.

Quando você usar parent do Spring Boot, ele gerencia versões compatíveis de várias libs.

Exemplo futuro:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>...</version>
</parent>
```

A partir daí, você normalmente não precisa declarar versão de starters.

Vamos aprofundar quando chegar em Spring.

---

# Parte 27 — Parent POM

Um POM pode herdar de outro.

Exemplo conceitual:

```xml
<parent>
    <groupId>br.com.empresa</groupId>
    <artifactId>empresa-parent</artifactId>
    <version>1.0.0</version>
</parent>
```

O parent pode definir:

```text
versões;
plugins;
properties;
dependências gerenciadas;
configurações comuns.
```

Em empresas, é comum ter parent corporativo.

---

# Parte 28 — Multi-module Maven

Maven permite projetos com vários módulos.

Exemplo:

```text
sistema
├── pom.xml
├── dominio
│   └── pom.xml
├── aplicacao
│   └── pom.xml
└── infra
    └── pom.xml
```

POM raiz:

```xml
<packaging>pom</packaging>

<modules>
    <module>dominio</module>
    <module>aplicacao</module>
    <module>infra</module>
</modules>
```

Isso é avançado, mas importante para arquitetura.

Vamos aprofundar quando entrarmos em projetos maiores.

---

# Parte 29 — packaging

O Maven pode gerar tipos diferentes de artefato.

Exemplos:

```xml
<packaging>jar</packaging>
```

```xml
<packaging>war</packaging>
```

```xml
<packaging>pom</packaging>
```

Se não informar, o padrão geralmente é:

```text
jar
```

---

## jar

Aplicação/biblioteca Java empacotada.

Muito comum em Spring Boot.

---

## war

Web Application Archive.

Era muito usado para deploy em servidores de aplicação como Tomcat externo.

Spring Boot moderno normalmente usa jar executável, mas WAR ainda existe em alguns ambientes.

---

## pom

Usado em projetos agregadores ou parents.

---

# Parte 30 — Maven Wrapper

Maven Wrapper permite rodar Maven sem depender de instalação global.

Arquivos:

```text
mvnw
mvnw.cmd
.mvn/wrapper
```

Comandos:

No Windows:

```powershell
.\mvnw.cmd clean package
```

Ou:

```powershell
.\mvnw clean package
```

No Linux/Mac:

```bash
./mvnw clean package
```

Em projetos profissionais, se houver wrapper, prefira usar o wrapper.

Isso garante versão Maven padronizada.

---

# Parte 31 — Maven em CI/CD

Em pipeline, você verá comandos como:

```powershell
mvn clean verify
```

ou:

```powershell
mvn clean package
```

Possíveis etapas:

```text
checkout do código;
setup do JDK;
cache do .m2;
mvn clean verify;
gerar artefato;
publicar relatório de testes;
gerar imagem Docker;
deploy.
```

Se o pipeline falha, você precisa ler logs Maven.

---

# Parte 32 — Como Maven prepara Spring

Spring Boot com Maven é basicamente um projeto Maven com dependências e plugins específicos.

Exemplo futuro:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Esse starter traz várias dependências transitivas:

```text
Spring MVC;
Jackson;
Tomcat embutido;
validação e outras libs dependendo do starter.
```

O plugin Spring Boot permite gerar jar executável:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

Quando chegar Spring, você vai entender o que isso faz com profundidade.

---

# Parte 33 — Erros comuns de Maven

## 1. Maven não reconhecido

Erro:

```text
mvn não é reconhecido
```

Causa:

```text
Maven não instalado;
PATH não configurado;
terminal não reiniciado.
```

Solução:

```text
verificar mvn -version;
verificar PATH;
usar Maven Wrapper se existir.
```

---

## 2. JAVA_HOME errado

Erro:

```text
JAVA_HOME is not defined correctly
```

Solução:

```text
corrigir JAVA_HOME para a raiz do JDK;
garantir JAVA_HOME/bin no PATH.
```

---

## 3. Release version not supported

Erro:

```text
release version 21 not supported
```

Causa:

```text
pom pede Java 21;
Maven está usando JDK menor.
```

Diagnóstico:

```powershell
mvn -version
```

---

## 4. Teste falhando no build

Erro:

```text
There are test failures.
```

Solução:

```text
abrir target/surefire-reports;
ler qual teste falhou;
corrigir teste ou código.
```

Não pule teste sem entender.

---

## 5. Could not resolve dependencies

Causas:

```text
internet;
proxy corporativo;
Maven Central indisponível;
repositório privado sem acesso;
versão errada;
dependência inexistente.
```

---

# Parte 34 — Boas práticas com Maven

Use boas práticas:

```text
defina versão Java claramente;
use properties para versões repetidas;
não declare dependências sem necessidade;
não use versão dinâmica;
não versionar target;
rode mvn clean test antes de commitar;
leia dependency:tree quando houver conflito;
mantenha POM organizado;
não copie dependência aleatória sem entender;
use scopes corretamente;
prefira wrapper quando disponível;
em Spring, respeite versões gerenciadas pelo parent/BOM.
```

---

# Parte 35 — Maven e arquitetura

Maven também pode ajudar a impor arquitetura.

Em projetos multi-module:

```text
domain não depende de infra;
application depende de domain;
infra depende de application/domain;
api depende de application.
```

Se um módulo tenta depender do lugar errado, o build pode falhar.

Isso é arquitetura protegida por build.

Mais para frente, quando estivermos em nível engenheiro/arquiteto, vamos usar ferramentas e módulos para reforçar fronteiras arquiteturais.

---

# Parte 36 — Laboratório de diagnóstico Maven

Execute no projeto da aula:

```powershell
mvn -version
mvn validate
mvn compile
mvn test
mvn package
mvn dependency:tree
mvn help:effective-pom
```

Registre em um arquivo:

```text
DIAGNOSTICO_MAVEN.md
```

Com:

```text
Versão Maven:
Versão Java usada pelo Maven:
Projeto compilou:
Testes passaram:
Jar gerado:
Dependências diretas:
Dependências transitivas:
Plugins configurados:
Comando de package:
Comando para executar jar:
Erros encontrados:
Solução aplicada:
```

---

# Parte 37 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é Maven.
[ ] Sei explicar por que Maven existe.
[ ] Sei ler groupId, artifactId e version.
[ ] Sei explicar pom.xml.
[ ] Sei explicar dependencies.
[ ] Sei explicar Maven Central.
[ ] Sei explicar .m2 repository.
[ ] Sei explicar dependência transitiva.
[ ] Sei explicar dependency:tree.
[ ] Sei explicar scopes principais.
[ ] Sei explicar lifecycle.
[ ] Sei diferenciar phase e goal.
[ ] Sei explicar plugins.
[ ] Sei rodar mvn compile.
[ ] Sei rodar mvn test.
[ ] Sei rodar mvn package.
[ ] Sei rodar java -jar do artefato.
[ ] Sei diagnosticar erro de versão Java.
[ ] Sei entender como Maven prepara Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Maven?
2. Qual problema Maven resolve?
3. O que é pom.xml?
4. O que é groupId?
5. O que é artifactId?
6. O que é version?
7. O que é dependência?
8. O que é dependência transitiva?
9. O que é Maven Central?
10. O que é .m2?
11. O que é scope test?
12. O que é lifecycle?
13. Qual diferença entre phase e goal?
14. O que é plugin?
15. Qual plugin compila?
16. Qual plugin roda testes?
17. O que faz mvn package?
18. O que faz mvn clean?
19. O que é dependency:tree?
20. Como Maven aparece no Spring?
```

---

# Parte 38 — Exercício prático principal

## Missão

Crie um projeto Maven completo:

```text
labs/m11/aula-247-maven-profissional
```

Com:

```text
pom.xml;
Calculadora.java;
App.java;
CalculadoraTest.java.
```

---

## Requisitos

O projeto deve:

```text
usar Java 21;
usar JUnit 5;
compilar com mvn compile;
testar com mvn test;
empacotar com mvn package;
gerar JAR executável;
rodar com java -jar;
ter target ignorado no Git.
```

---

## Critérios

```text
não usar IDE para executar o build;
rodar pelo terminal;
testes devem passar;
target não deve ser versionado;
pom.xml deve estar organizado;
dependency:tree deve funcionar;
effective-pom deve funcionar.
```

---

# Parte 39 — Desafio extra

## Adicione uma dependência externa simples

Adicione Apache Commons Lang ao projeto.

Dependência:

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
```

Crie uma classe:

```text
NormalizadorTexto
```

Com método:

```java
public String normalizar(String texto)
```

Use:

```java
StringUtils.stripAccents(...)
StringUtils.trimToEmpty(...)
```

Depois crie teste:

```text
NormalizadorTextoTest
```

Critérios:

```text
dependência deve aparecer em dependency:tree;
teste deve passar;
classe deve tratar null;
não criar lógica sem teste.
```

---

# Parte 40 — Simulado rápido

## Questão 1

Maven é principalmente:

```text
A) ferramenta de build e gerenciamento de dependências.
B) banco de dados.
C) servidor web.
D) linguagem de programação.
```

---

## Questão 2

O arquivo principal do Maven é:

```text
A) pom.xml
B) build.gradle
C) package.json
D) index.html
```

---

## Questão 3

Coordenadas Maven são compostas por:

```text
A) groupId, artifactId e version.
B) controller, service e repository.
C) host, port e path.
D) login, senha e token.
```

---

## Questão 4

A pasta `.m2` guarda:

```text
A) repositório local de dependências Maven.
B) código fonte principal.
C) logs do Git.
D) arquivos do Docker.
```

---

## Questão 5

O comando que mostra árvore de dependências é:

```text
A) mvn dependency:tree
B) git dependency
C) java tree
D) mvn git:tree
```

---

## Questão 6

`mvn package` normalmente:

```text
A) compila, testa e empacota o projeto.
B) cria branch.
C) apaga o Git.
D) instala o JDK.
```

---

## Questão 7

Scope `test` significa:

```text
A) dependência usada apenas nos testes.
B) dependência usada apenas em produção.
C) dependência proibida.
D) dependência de banco obrigatória.
```

---

## Questão 8

Plugin no Maven serve para:

```text
A) executar tarefas de build como compilar, testar e empacotar.
B) criar variável de ambiente.
C) substituir a JVM.
D) criar branch Git.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
7. A
8. A
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-247-maven-profissional
git add DIAGNOSTICO_MAVEN.md
git commit -m "Aula 247: maven pom dependencias lifecycle plugins"
git status
```

Se `DIAGNOSTICO_MAVEN.md` estiver dentro da pasta do laboratório, ajuste o caminho.

---

## Fechamento

A principal ideia desta aula é:

```text
Maven organiza o build Java profissional, gerenciando dependências, ciclo de vida, plugins, testes e empacotamento.
```

Você estudou:

```text
Maven;
pom.xml;
groupId;
artifactId;
version;
properties;
dependencies;
Maven Central;
.m2;
dependências transitivas;
scopes;
lifecycle;
phases;
goals;
plugins;
maven-compiler-plugin;
maven-surefire-plugin;
maven-jar-plugin;
target;
dependency:tree;
effective-pom;
BOM;
dependencyManagement;
parent POM;
multi-module;
packaging;
Maven Wrapper;
CI/CD;
Spring futuro;
erros comuns;
boas práticas.
```

Na próxima aula, vamos aprofundar:

```text
Gradle profissional.
```

A ideia será entender `build.gradle`, tasks, plugins, repositories, dependencies, wrapper, lifecycle, comparação com Maven, builds reais e preparação para projetos Spring com Gradle.
