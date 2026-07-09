# 248 — M11.04 — Gradle profissional: build, tasks, dependências e wrapper

## Objetivo da aula

Na aula anterior, você aprofundou Maven.

Você estudou:

```text
pom.xml;
groupId;
artifactId;
version;
dependencies;
scopes;
Maven Central;
.m2;
lifecycle;
phases;
goals;
plugins;
target;
dependency:tree;
effective-pom;
BOM;
parent POM;
multi-module;
Maven Wrapper;
CI/CD;
preparação para Spring.
```

Agora vamos aprofundar outra ferramenta de build muito usada em Java:

```text
Gradle
```

O objetivo desta aula não é dizer que Gradle é melhor ou pior que Maven.

O objetivo é você entender Gradle profissionalmente, porque no mercado Java Backend você pode encontrar projetos usando:

```text
Maven;
Gradle;
Maven em um projeto e Gradle em outro;
Spring Boot com Maven;
Spring Boot com Gradle;
builds corporativos customizados;
monorepos;
projetos multi-module.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é Gradle;
entender por que Gradle existe;
entender build.gradle;
entender settings.gradle;
entender Gradle Wrapper;
entender tasks;
entender plugins;
entender repositories;
entender dependencies;
entender configurations;
executar build Gradle;
rodar testes;
empacotar JAR;
comparar Maven e Gradle;
diagnosticar erros comuns;
entender como Gradle prepara Spring;
usar Gradle em nível profissional.
```

---

## Reforço do objetivo maior

Este curso está sendo construído para levar você do básico até uma visão de engenheiro/arquiteto Java.

Por isso, ferramenta de build não é detalhe.

Um arquiteto ou engenheiro Java precisa entender:

```text
como o projeto compila;
como dependências entram;
como builds são reproduzíveis;
como módulos se conectam;
como pipeline executa;
como artefatos são gerados;
como versões são controladas;
como reduzir acoplamento entre módulos;
como evitar build quebrado;
como diagnosticar conflito de dependência;
como escolher ferramenta e padrão de projeto.
```

Gradle faz parte desse conhecimento.

---

# Parte 1 — O que é Gradle

Gradle é uma ferramenta de build e automação.

Ele ajuda em tarefas como:

```text
compilar;
rodar testes;
baixar dependências;
empacotar JAR;
gerar relatórios;
executar tarefas customizadas;
organizar projetos multi-module;
integrar com CI/CD;
criar artefatos;
preparar aplicações para execução.
```

Gradle usa uma abordagem baseada em scripts.

Você descreve o build em arquivos como:

```text
build.gradle
settings.gradle
```

ou, usando Kotlin DSL:

```text
build.gradle.kts
settings.gradle.kts
```

Nesta aula, vamos usar a versão Groovy DSL:

```text
build.gradle
settings.gradle
```

porque ainda é muito comum em projetos Java.

---

## Gradle em uma frase prática

```text
Gradle é uma ferramenta de build flexível, baseada em tasks, plugins e scripts, usada para automatizar compilação, testes, dependências e empacotamento.
```

---

# Parte 2 — Por que Gradle existe

Gradle surgiu para resolver problemas de build com mais flexibilidade.

Maven é muito padronizado, baseado em XML e lifecycle fixo.

Gradle oferece:

```text
scripts mais expressivos;
tasks customizadas;
boa performance em builds grandes;
build incremental;
cache;
daemon;
flexibilidade para projetos complexos;
wrapper muito usado;
boa integração com Java, Android, Kotlin e Spring.
```

Em projetos corporativos, você pode encontrar Gradle quando há necessidade de:

```text
build customizado;
múltiplos módulos;
automação específica;
integração com ferramentas;
performance;
configuração mais programável.
```

---

# Parte 3 — Maven vs Gradle

## Maven

Características:

```text
pom.xml;
XML;
estrutura muito convencionada;
lifecycle fixo;
phases;
goals;
plugins;
muito usado em Java corporativo.
```

## Gradle

Características:

```text
build.gradle;
script Groovy ou Kotlin;
tasks;
plugins;
configuração mais flexível;
build incremental;
wrapper muito comum;
muito usado em Android e projetos modernos.
```

---

## Diferença mental

Maven pergunta:

```text
em qual fase do lifecycle estou?
```

Gradle pergunta:

```text
qual task eu quero executar?
```

Exemplos Maven:

```powershell
mvn clean package
mvn test
```

Exemplos Gradle:

```powershell
.\gradlew clean build
.\gradlew test
```

---

## Regra prática profissional

```text
Se o projeto usa Maven, trabalhe bem com Maven.
Se o projeto usa Gradle, trabalhe bem com Gradle.
```

Um profissional Java completo precisa saber ler e operar os dois.

---

# Parte 4 — Estrutura padrão de projeto Gradle

Gradle também segue convenções semelhantes ao Maven para projeto Java.

Estrutura:

```text
projeto
├── build.gradle
├── settings.gradle
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

Código principal.

---

## src/main/resources

Recursos de produção.

Exemplos futuros:

```text
application.properties;
application.yml;
templates;
arquivos de configuração.
```

---

## src/test/java

Testes automatizados.

---

## src/test/resources

Recursos de teste.

---

## build

Pasta gerada pelo Gradle.

Equivale, em ideia, ao `target` do Maven.

Normalmente contém:

```text
classes compiladas;
relatórios;
libs;
JAR gerado;
arquivos temporários;
resultados de testes.
```

Não deve ser versionada no Git.

---

# Parte 5 — settings.gradle

O arquivo:

```text
settings.gradle
```

define configurações do projeto Gradle.

Em projeto simples:

```groovy
rootProject.name = 'aula-248-gradle-profissional'
```

Isso define o nome do projeto raiz.

---

## Em projetos multi-module

Futuramente você verá algo como:

```groovy
rootProject.name = 'sistema-backend'

include 'domain'
include 'application'
include 'infra'
include 'api'
```

Isso indica que o projeto tem módulos.

Gradle é muito usado em projetos multi-module.

---

# Parte 6 — build.gradle

O arquivo:

```text
build.gradle
```

descreve o build.

Exemplo simples:

```groovy
plugins {
    id 'java'
}

group = 'br.com.curso'
version = '1.0.0'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}

test {
    useJUnitPlatform()
}
```

Esse arquivo diz:

```text
use plugin Java;
grupo do projeto;
versão do projeto;
use Maven Central;
adicione JUnit para testes;
rode testes com JUnit Platform.
```

---

# Parte 7 — Plugins

Plugins adicionam capacidades ao Gradle.

Exemplo:

```groovy
plugins {
    id 'java'
}
```

O plugin `java` adiciona tasks como:

```text
compileJava;
processResources;
classes;
compileTestJava;
test;
jar;
assemble;
check;
build.
```

---

## Plugin application

Se você quer rodar uma aplicação com método `main`, pode usar:

```groovy
plugins {
    id 'java'
    id 'application'
}
```

Depois configura:

```groovy
application {
    mainClass = 'br.com.curso.aula248.App'
}
```

Isso permite rodar:

```powershell
.\gradlew run
```

---

## Plugin Spring Boot futuramente

Em Spring Boot com Gradle, você verá:

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '...'
    id 'io.spring.dependency-management' version '...'
}
```

Esses plugins ajudam a:

```text
gerenciar dependências;
empacotar aplicação;
rodar aplicação;
criar bootJar;
integrar com Spring Boot.
```

Vamos aprofundar quando chegar em Spring.

---

# Parte 8 — Repositories

Repositories dizem de onde baixar dependências.

Exemplo:

```groovy
repositories {
    mavenCentral()
}
```

Isso usa Maven Central.

Em empresas, pode haver repositórios privados:

```groovy
repositories {
    mavenCentral()

    maven {
        url = uri("https://repo.empresa.com/repository/maven-releases")
    }
}
```

Possíveis ferramentas corporativas:

```text
Nexus;
Artifactory;
GitHub Packages;
Azure Artifacts.
```

---

# Parte 9 — Dependencies

Dependências no Gradle ficam em:

```groovy
dependencies {
    ...
}
```

Exemplo:

```groovy
dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}
```

Formato:

```text
group:artifact:version
```

Exemplo:

```text
org.junit.jupiter:junit-jupiter:5.10.2
```

Mesmo conceito das coordenadas Maven.

---

# Parte 10 — Configurations no Gradle

No Maven falamos de scopes.

No Gradle, falamos de configurations.

Principais para Java:

```text
implementation;
api;
compileOnly;
runtimeOnly;
testImplementation;
testRuntimeOnly.
```

---

## implementation

Dependência usada para compilar e executar o código principal, mas não exposta como API para consumidores.

Exemplo:

```groovy
implementation 'com.fasterxml.jackson.core:jackson-databind:2.17.0'
```

Em aplicações backend, `implementation` é muito usado.

---

## testImplementation

Dependência usada apenas em testes.

Exemplo:

```groovy
testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
```

---

## runtimeOnly

Dependência necessária apenas em runtime.

Exemplo futuro:

```groovy
runtimeOnly 'org.postgresql:postgresql:42.7.3'
```

Driver de banco costuma ser runtime.

---

## compileOnly

Disponível para compilar, mas não empacotada.

Exemplo comum:

```groovy
compileOnly 'org.projectlombok:lombok:1.18.32'
```

Com Lombok, também costuma aparecer:

```groovy
annotationProcessor 'org.projectlombok:lombok:1.18.32'
```

Vamos aprofundar Lombok mais para frente com cuidado.

---

## api

Aparece quando se usa plugin:

```groovy
id 'java-library'
```

`api` expõe dependência para consumidores da biblioteca.

Em aplicação backend comum, você verá mais `implementation`.

Em biblioteca, `api` pode ser importante.

---

# Parte 11 — Gradle Wrapper

Gradle Wrapper é essencial em projetos profissionais.

Arquivos:

```text
gradlew
gradlew.bat
gradle/wrapper/gradle-wrapper.properties
gradle/wrapper/gradle-wrapper.jar
```

No Windows:

```powershell
.\gradlew.bat build
```

ou:

```powershell
.\gradlew build
```

No Linux/Mac:

```bash
./gradlew build
```

---

## Por que usar Wrapper

Sem wrapper, cada dev precisa instalar Gradle na versão certa.

Com wrapper, o projeto define a versão Gradle.

Benefícios:

```text
build reproduzível;
menos conflito entre máquinas;
pipeline usa mesma versão;
novos devs rodam mais fácil;
evita "na minha máquina funciona".
```

---

## Regra profissional

```text
Se o projeto tem gradlew, use gradlew.
```

Evite usar Gradle global sem necessidade.

---

# Parte 12 — Verificando Gradle

Com Gradle instalado globalmente:

```powershell
gradle -version
```

Com wrapper:

```powershell
.\gradlew -version
```

Observe:

```text
Gradle version;
JVM;
OS;
Kotlin;
Groovy.
```

Se o projeto exige Java 21 e Gradle está usando Java 17, pode falhar.

---

# Parte 13 — Tasks

Gradle é baseado em tasks.

Para listar tasks:

```powershell
.\gradlew tasks
```

Tasks comuns do plugin Java:

```text
clean;
compileJava;
processResources;
classes;
compileTestJava;
test;
jar;
assemble;
check;
build.
```

---

## clean

Remove a pasta `build`.

```powershell
.\gradlew clean
```

---

## compileJava

Compila o código principal.

```powershell
.\gradlew compileJava
```

---

## test

Roda testes.

```powershell
.\gradlew test
```

---

## jar

Gera JAR.

```powershell
.\gradlew jar
```

---

## build

Executa build completo.

```powershell
.\gradlew build
```

Normalmente inclui:

```text
compilação;
testes;
check;
assemble.
```

---

# Parte 14 — Task dependency

Tasks podem depender de outras tasks.

Exemplo:

```text
build depende de test e assemble.
test depende de compileTestJava.
compileTestJava depende de compileJava.
```

Gradle monta um grafo de tasks.

Isso é importante.

Gradle não executa simplesmente uma lista fixa como Maven.

Ele calcula:

```text
quais tasks são necessárias para o comando solicitado.
```

---

# Parte 15 — Build incremental

Gradle tenta evitar trabalho desnecessário.

Se nada mudou, uma task pode aparecer como:

```text
UP-TO-DATE
```

Isso significa:

```text
Gradle percebeu que não precisa executar aquela task de novo.
```

Isso melhora performance.

---

## Exemplo

Execute:

```powershell
.\gradlew build
```

Depois execute novamente:

```powershell
.\gradlew build
```

Você pode ver várias tasks como:

```text
UP-TO-DATE
```

Se alterar código, Gradle recompila o necessário.

---

# Parte 16 — Gradle Daemon

Gradle usa um processo em background chamado:

```text
Gradle Daemon
```

Ele melhora performance mantendo informações em memória.

Você pode ver daemons:

```powershell
.\gradlew --status
```

Parar daemons:

```powershell
.\gradlew --stop
```

Em alguns erros estranhos, parar daemon pode ajudar.

Mas não é para sair parando sempre sem motivo.

---

# Parte 17 — Laboratório Gradle profissional

Crie a pasta:

```powershell
mkdir labs\m11\aula-248-gradle-profissional
cd labs\m11\aula-248-gradle-profissional
mkdir src\main\java\br\com\curso\aula248
mkdir src\test\java\br\com\curso\aula248
```

Crie:

```text
settings.gradle
```

Conteúdo:

```groovy
rootProject.name = 'aula-248-gradle-profissional'
```

Crie:

```text
build.gradle
```

Conteúdo:

```groovy
plugins {
    id 'java'
    id 'application'
}

group = 'br.com.curso'
version = '1.0.0'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}

application {
    mainClass = 'br.com.curso.aula248.App'
}

test {
    useJUnitPlatform()
}
```

---

# Parte 18 — Código do laboratório

Crie:

```text
src/main/java/br/com/curso/aula248/Calculadora.java
```

Código:

```java
package br.com.curso.aula248;

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
src/main/java/br/com/curso/aula248/App.java
```

Código:

```java
package br.com.curso.aula248;

public class App {
    public static void main(String[] args) {
        Calculadora calculadora = new Calculadora();

        System.out.println("Gradle profissional executando.");
        System.out.println("Soma: " + calculadora.somar(10, 5));
        System.out.println("Subtração: " + calculadora.subtrair(10, 5));
        System.out.println("Multiplicação: " + calculadora.multiplicar(10, 5));
        System.out.println("Divisão: " + calculadora.dividir(10, 5));
    }
}
```

---

# Parte 19 — Teste com JUnit

Crie:

```text
src/test/java/br/com/curso/aula248/CalculadoraTest.java
```

Código:

```java
package br.com.curso.aula248;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculadoraTest {
    @Test
    void deveSomar() {
        Calculadora calculadora = new Calculadora();

        assertEquals(15, calculadora.somar(10, 5));
    }

    @Test
    void deveSubtrair() {
        Calculadora calculadora = new Calculadora();

        assertEquals(5, calculadora.subtrair(10, 5));
    }

    @Test
    void deveMultiplicar() {
        Calculadora calculadora = new Calculadora();

        assertEquals(50, calculadora.multiplicar(10, 5));
    }

    @Test
    void deveDividir() {
        Calculadora calculadora = new Calculadora();

        assertEquals(2, calculadora.dividir(10, 5));
    }

    @Test
    void naoDeveDividirPorZero() {
        Calculadora calculadora = new Calculadora();

        assertThrows(IllegalArgumentException.class, () -> calculadora.dividir(10, 0));
    }
}
```

---

# Parte 20 — Rodando o projeto

Se você tiver Gradle instalado:

```powershell
gradle clean build
gradle run
```

Se houver wrapper:

```powershell
.\gradlew clean build
.\gradlew run
```

Como ainda não criamos wrapper, você pode usar Gradle instalado ou gerar wrapper.

---

# Parte 21 — Gerando Gradle Wrapper

Dentro do projeto:

```powershell
gradle wrapper
```

Isso cria:

```text
gradlew
gradlew.bat
gradle/wrapper/gradle-wrapper.properties
gradle/wrapper/gradle-wrapper.jar
```

Depois use:

```powershell
.\gradlew build
.\gradlew run
```

---

## Configurando versão do wrapper

Você pode gerar wrapper com versão específica:

```powershell
gradle wrapper --gradle-version 8.8
```

Em projetos profissionais, a versão vem definida no wrapper.

---

# Parte 22 — Entendendo a pasta build

Depois de rodar:

```powershell
.\gradlew build
```

Observe:

```text
build
├── classes
├── distributions
├── generated
├── libs
├── reports
├── test-results
└── tmp
```

Pontos importantes:

```text
build/classes:
classes compiladas.

build/libs:
JAR gerado.

build/reports/tests/test:
relatório HTML dos testes.

build/test-results:
resultado em XML.
```

---

# Parte 23 — Executando o JAR

Depois de:

```powershell
.\gradlew jar
```

Veja:

```text
build/libs/aula-248-gradle-profissional-1.0.0.jar
```

Dependendo da configuração, esse JAR pode não ser executável diretamente com `java -jar`.

Para JAR executável simples, configure:

```groovy
jar {
    manifest {
        attributes(
            'Main-Class': 'br.com.curso.aula248.App'
        )
    }
}
```

Adicione no `build.gradle`.

Depois rode:

```powershell
.\gradlew clean jar
java -jar build\libs\aula-248-gradle-profissional-1.0.0.jar
```

---

# Parte 24 — Task customizada

Gradle permite criar tasks customizadas.

Adicione ao `build.gradle`:

```groovy
tasks.register('saudacao') {
    doLast {
        println 'Olá, Gradle profissional.'
    }
}
```

Execute:

```powershell
.\gradlew saudacao
```

---

## Task customizada com dependência

Exemplo:

```groovy
tasks.register('diagnosticoProjeto') {
    dependsOn 'test'

    doLast {
        println "Projeto: ${project.name}"
        println "Grupo: ${project.group}"
        println "Versão: ${project.version}"
        println "Build concluído com testes executados."
    }
}
```

Execute:

```powershell
.\gradlew diagnosticoProjeto
```

Essa task roda `test` antes.

---

# Parte 25 — Gradle e dependências transitivas

Assim como Maven, Gradle também baixa dependências transitivas.

Para ver dependências:

```powershell
.\gradlew dependencies
```

Para ver dependências de uma configuration específica:

```powershell
.\gradlew dependencies --configuration testRuntimeClasspath
```

Para entender por que uma dependência entrou:

```powershell
.\gradlew dependencyInsight --dependency junit
```

Esses comandos são muito importantes para diagnóstico.

---

# Parte 26 — Cache do Gradle

Gradle guarda dependências e dados em cache.

Locais comuns:

```text
C:\Users\SEU_USUARIO\.gradle
```

ou:

```text
~/.gradle
```

O projeto também tem pasta:

```text
.gradle
```

Normalmente, `.gradle` do projeto não deve ser versionada.

No `.gitignore`:

```gitignore
.gradle/
build/
```

---

# Parte 27 — .gitignore para Gradle

Exemplo:

```gitignore
.gradle/
build/
out/
*.class
*.log
.idea/
.vscode/
.env
```

Se também tiver Maven no curso:

```gitignore
target/
```

---

# Parte 28 — Gradle e versão Java

No `build.gradle`, configuramos toolchain:

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
```

Isso diz ao Gradle:

```text
use Java 21 para compilar.
```

Toolchain ajuda a padronizar versão Java.

Mas você ainda precisa diagnosticar se o ambiente consegue obter/usar essa versão.

Verifique:

```powershell
.\gradlew -version
```

E também:

```powershell
java -version
javac -version
```

---

# Parte 29 — Erros comuns de Gradle

## 1. gradle não reconhecido

Erro:

```text
gradle não é reconhecido
```

Solução:

```text
usar wrapper se existir;
instalar Gradle;
configurar PATH;
reiniciar terminal.
```

---

## 2. gradlew não executa

No Windows, tente:

```powershell
.\gradlew.bat build
```

No Linux/Mac, pode precisar permissão:

```bash
chmod +x gradlew
./gradlew build
```

---

## 3. Testes não são encontrados

Se usa JUnit 5, precisa:

```groovy
test {
    useJUnitPlatform()
}
```

Sem isso, dependendo da versão/configuração, os testes podem não rodar corretamente.

---

## 4. Java version incompatible

Sintomas:

```text
Unsupported class file major version;
invalid source release;
toolchain not found;
```

Diagnóstico:

```powershell
java -version
.\gradlew -version
```

Verifique:

```text
toolchain;
Gradle JVM na IDE;
JAVA_HOME;
versão do Gradle.
```

---

## 5. Dependência não encontrada

Erro:

```text
Could not find ...
```

Causas:

```text
coordenada errada;
versão errada;
sem repository mavenCentral;
internet/proxy;
repositório privado não configurado.
```

---

# Parte 30 — Gradle na IDE

No IntelliJ, projetos Gradle têm configurações como:

```text
Gradle JVM;
Use Gradle from;
Run tests using;
Build and run using.
```

É comum erro acontecer porque:

```text
terminal usa Java 21;
Gradle na IDE usa Java 17.
```

Regra profissional:

```text
confira Gradle JVM na IDE.
```

---

# Parte 31 — Gradle em CI/CD

Pipeline com Gradle geralmente roda:

```powershell
.\gradlew clean build
```

ou no Linux:

```bash
./gradlew clean build
```

Etapas comuns:

```text
checkout;
setup Java;
cache Gradle;
chmod +x gradlew;
./gradlew clean build;
publicar relatórios;
publicar artefato;
build Docker.
```

Se o pipeline usa wrapper, ele usa a versão definida no projeto.

Isso reduz problemas.

---

# Parte 32 — Gradle e Spring Boot

Em Spring Boot com Gradle, você verá algo assim:

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.x.x'
    id 'io.spring.dependency-management' version '1.x.x'
}

group = 'br.com.empresa'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}
```

Gradle vai baixar os starters, configurar tasks e permitir gerar:

```text
bootJar
```

Comando futuro:

```powershell
.\gradlew bootRun
.\gradlew bootJar
java -jar build\libs\app.jar
```

Vamos aprofundar isso no módulo Spring.

---

# Parte 33 — Maven ou Gradle para Spring?

Spring Boot suporta bem os dois.

No mercado:

```text
Maven é muito comum;
Gradle também é muito usado;
ambos são profissionais.
```

A escolha pode depender de:

```text
padrão da empresa;
histórico do projeto;
complexidade do build;
performance;
time;
ecossistema;
preferência técnica.
```

Para você como profissional:

```text
não importa defender um lado.
importa saber trabalhar com os dois.
```

---

# Parte 34 — Gradle multi-module

Exemplo futuro:

```text
sistema
├── settings.gradle
├── build.gradle
├── domain
│   └── build.gradle
├── application
│   └── build.gradle
├── infra
│   └── build.gradle
└── api
    └── build.gradle
```

No `settings.gradle`:

```groovy
rootProject.name = 'sistema'
include 'domain'
include 'application'
include 'infra'
include 'api'
```

Isso ajuda a separar arquitetura.

Exemplo:

```text
domain:
regra pura.

application:
use cases.

infra:
banco, clients, mensageria.

api:
controllers.
```

No nível arquiteto, build multi-module pode proteger fronteiras.

Vamos aprofundar em momento próprio.

---

# Parte 35 — Build scripts não devem virar bagunça

Como Gradle é flexível, há risco de exagero.

Problemas comuns:

```text
build.gradle enorme;
tasks customizadas sem documentação;
lógica demais no build;
dependências duplicadas;
versões espalhadas;
scripts difíceis de entender;
comportamento diferente entre local e pipeline.
```

Boas práticas:

```text
mantenha build simples;
documente tasks customizadas;
centralize versões quando fizer sentido;
use wrapper;
não invente task sem necessidade;
prefira convenções;
revise dependências;
rode build limpo.
```

---

# Parte 36 — Version Catalog

Em Gradle moderno, existe um recurso chamado:

```text
Version Catalog
```

Ele permite centralizar versões em:

```text
gradle/libs.versions.toml
```

Exemplo conceitual:

```toml
[versions]
junit = "5.10.2"

[libraries]
junit-jupiter = { module = "org.junit.jupiter:junit-jupiter", version.ref = "junit" }
```

Depois no build:

```groovy
dependencies {
    testImplementation libs.junit.jupiter
}
```

Isso é comum em projetos maiores.

Não vamos aprofundar agora, mas é importante saber que existe.

---

# Parte 37 — build.gradle.kts

Gradle também pode usar Kotlin DSL:

```text
build.gradle.kts
settings.gradle.kts
```

Exemplo:

```kotlin
plugins {
    java
}

group = "br.com.curso"
version = "1.0.0"

repositories {
    mavenCentral()
}
```

Kotlin DSL oferece:

```text
tipagem melhor;
autocomplete melhor;
mais segurança em alguns cenários.
```

Groovy DSL ainda é muito comum.

Você precisa reconhecer ambos.

---

# Parte 38 — Laboratório de diagnóstico Gradle

Crie um arquivo:

```text
DIAGNOSTICO_GRADLE.md
```

Preencha:

```text
Gradle global version:
Gradle wrapper version:
Java usado pelo Gradle:
Java usado pelo terminal:
Build executado:
Testes executados:
Jar gerado:
Tasks principais:
Dependências diretas:
Dependências transitivas:
Erros encontrados:
Soluções aplicadas:
```

Comandos úteis:

```powershell
gradle -version
.\gradlew -version
.\gradlew tasks
.\gradlew clean build
.\gradlew dependencies
.\gradlew dependencyInsight --dependency junit
```

---

# Parte 39 — Comparativo de comandos Maven e Gradle

| Ação | Maven | Gradle |
|---|---|---|
| Limpar build | `mvn clean` | `./gradlew clean` |
| Compilar | `mvn compile` | `./gradlew compileJava` |
| Testar | `mvn test` | `./gradlew test` |
| Empacotar/build | `mvn package` | `./gradlew build` |
| Ver dependências | `mvn dependency:tree` | `./gradlew dependencies` |
| Investigar dependência | `mvn dependency:tree` | `./gradlew dependencyInsight --dependency nome` |
| Rodar app | plugin específico | `./gradlew run` com plugin application |
| Wrapper | `./mvnw` | `./gradlew` |

---

# Parte 40 — Boas práticas com Gradle

Use boas práticas:

```text
use Gradle Wrapper;
não versionar build/;
não versionar .gradle/;
configure Java toolchain;
declare repositories claramente;
use implementation em vez de compile;
use testImplementation para testes;
configure useJUnitPlatform para JUnit 5;
rode clean build antes de commitar;
investigue dependencies em caso de conflito;
não coloque lógica excessiva no build;
documente tasks customizadas;
mantenha build reproduzível.
```

---

# Parte 41 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é Gradle.
[ ] Sei explicar por que Gradle existe.
[ ] Sei explicar build.gradle.
[ ] Sei explicar settings.gradle.
[ ] Sei explicar plugins.
[ ] Sei explicar repositories.
[ ] Sei explicar dependencies.
[ ] Sei explicar implementation.
[ ] Sei explicar testImplementation.
[ ] Sei explicar runtimeOnly.
[ ] Sei explicar Gradle Wrapper.
[ ] Sei listar tasks.
[ ] Sei rodar clean.
[ ] Sei rodar build.
[ ] Sei rodar test.
[ ] Sei rodar run com plugin application.
[ ] Sei gerar JAR.
[ ] Sei configurar mainClass.
[ ] Sei explicar build incremental.
[ ] Sei explicar daemon.
[ ] Sei diagnosticar erro de Java/Gradle.
[ ] Sei comparar Maven e Gradle.
[ ] Sei entender como Gradle prepara Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Gradle?
2. Qual problema Gradle resolve?
3. O que é build.gradle?
4. O que é settings.gradle?
5. O que é plugin?
6. O que o plugin java adiciona?
7. O que é repository?
8. O que é dependency?
9. Qual diferença entre implementation e testImplementation?
10. O que é runtimeOnly?
11. O que é Gradle Wrapper?
12. Por que usar gradlew?
13. O que é task?
14. O que faz ./gradlew build?
15. O que significa UP-TO-DATE?
16. O que é Gradle Daemon?
17. Como ver dependências?
18. Como investigar uma dependência?
19. Como Gradle aparece no Spring?
20. Qual diferença mental entre Maven e Gradle?
```

---

# Parte 42 — Exercício prático principal

## Missão

Crie o projeto:

```text
labs/m11/aula-248-gradle-profissional
```

Com:

```text
settings.gradle;
build.gradle;
Calculadora.java;
App.java;
CalculadoraTest.java.
```

---

## Requisitos

O projeto deve:

```text
usar plugin java;
usar plugin application;
usar Java toolchain 21;
usar Maven Central;
usar JUnit 5;
rodar testes;
rodar aplicação com gradlew run;
gerar JAR;
configurar manifest para JAR executável;
ter .gitignore adequado.
```

---

## Critérios

```text
build deve passar;
testes devem passar;
gradlew deve funcionar;
build/ não deve ser versionado;
.gradle/ não deve ser versionado;
DIAGNOSTICO_GRADLE.md deve registrar comandos e resultados;
dependencyInsight deve ser testado.
```

---

# Parte 43 — Desafio extra

## Adicionar Apache Commons Lang

Adicione:

```groovy
implementation 'org.apache.commons:commons-lang3:3.14.0'
```

Crie:

```text
NormalizadorTexto
```

Método:

```java
public String normalizar(String texto)
```

Regras:

```text
null vira "";
remove espaços das pontas;
remove acentos;
converte para maiúsculo.
```

Use:

```java
StringUtils.trimToEmpty(...)
StringUtils.stripAccents(...)
```

Crie teste:

```text
NormalizadorTextoTest
```

Critérios:

```text
teste para null;
teste para acento;
teste para espaços;
teste para maiúsculo;
dependencyInsight deve mostrar commons-lang3.
```

---

# Parte 44 — Simulado rápido

## Questão 1

Gradle é principalmente:

```text
A) ferramenta de build e automação.
B) banco de dados.
C) linguagem de marcação.
D) servidor HTTP.
```

---

## Questão 2

Arquivo principal comum de build Gradle é:

```text
A) build.gradle
B) pom.xml
C) package.json
D) index.html
```

---

## Questão 3

`settings.gradle` normalmente define:

```text
A) nome do projeto e módulos.
B) senha de banco obrigatória.
C) controller REST.
D) classe Java principal apenas.
```

---

## Questão 4

Gradle Wrapper serve para:

```text
A) padronizar a versão do Gradle usada pelo projeto.
B) substituir a JVM.
C) criar banco.
D) abrir pull request automaticamente.
```

---

## Questão 5

`testImplementation` é usado para:

```text
A) dependências de teste.
B) dependências apenas de produção.
C) arquivos Docker.
D) variáveis de ambiente.
```

---

## Questão 6

Com JUnit 5 no Gradle, normalmente configuramos:

```text
A) test { useJUnitPlatform() }
B) git { useJUnit() }
C) java { useGit() }
D) docker { junit() }
```

---

## Questão 7

A pasta `build/` normalmente:

```text
A) é gerada pelo Gradle e não deve ser versionada.
B) deve ser sempre commitada.
C) contém apenas código fonte.
D) substitui src/main/java.
```

---

## Questão 8

Para listar tasks Gradle, usamos:

```text
A) ./gradlew tasks
B) ./gradlew git
C) java tasks
D) mvn gradle
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
git add labs/m11/aula-248-gradle-profissional
git add DIAGNOSTICO_GRADLE.md
git commit -m "Aula 248: gradle build tasks dependencias wrapper"
git status
```

Se `DIAGNOSTICO_GRADLE.md` estiver dentro do laboratório, ajuste o caminho.

---

## Fechamento

A principal ideia desta aula é:

```text
Gradle é uma ferramenta de build flexível e profissional, baseada em plugins, tasks, dependências e wrapper, capaz de automatizar compilação, testes, empacotamento e builds complexos.
```

Você estudou:

```text
Gradle;
build.gradle;
settings.gradle;
plugins;
java plugin;
application plugin;
repositories;
dependencies;
implementation;
testImplementation;
runtimeOnly;
compileOnly;
Gradle Wrapper;
tasks;
clean;
compileJava;
test;
jar;
build;
run;
build incremental;
UP-TO-DATE;
Gradle Daemon;
dependencyInsight;
cache;
.gitignore;
toolchain;
Spring futuro;
multi-module;
Version Catalog;
Kotlin DSL;
CI/CD;
erros comuns;
boas práticas.
```

Na próxima aula, vamos aprofundar:

```text
Git profissional para backend.
```

A ideia será estudar commits, branch, merge, rebase, pull request, conflitos, tags, stash, reset, revert, fluxo de trabalho, boas práticas e como Git aparece em times reais e pipelines.
