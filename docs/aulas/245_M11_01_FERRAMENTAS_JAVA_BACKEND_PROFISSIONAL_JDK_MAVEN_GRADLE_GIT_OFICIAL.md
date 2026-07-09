# 245 — M11.01 — Ferramentas Java Backend Profissional: JDK, Maven, Gradle e Git

## Objetivo da aula

Nesta aula, começamos um novo módulo:

```text
M11 — Ferramentas essenciais do Java Backend profissional
```

Até agora, o foco principal foi Java puro, orientação a objetos, SOLID, arquitetura básica e Design Patterns.

Agora vamos começar a aprofundar o ambiente real de trabalho de um backend Java.

Nesta aula, você vai entender o papel das principais ferramentas que aparecem em praticamente qualquer projeto Java profissional:

```text
JDK;
JVM;
JRE;
Maven;
Gradle;
Git;
IDE;
terminal;
build;
dependências;
empacotamento;
execução;
estrutura de projeto;
preparação para Spring.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é JDK, JVM e JRE;
entender por que backend Java precisa de ferramenta de build;
entender o papel do Maven;
entender o papel do Gradle;
entender o papel do Git;
entender como um projeto Java profissional é organizado;
entender o que acontece entre código fonte e aplicação executando;
rodar comandos básicos de diagnóstico;
criar um projeto Java simples manualmente;
entender por que Spring depende desse ecossistema;
preparar a cabeça para aprofundar cada ferramenta nas próximas aulas.
```

---

## Aviso importante sobre este módulo

Aqui não vamos tratar ferramenta como lista decorada.

Vamos aprofundar quando for necessário.

Para cada ferramenta importante, vamos trabalhar com:

```text
o que é;
por que existe;
qual problema resolve;
como funciona por baixo;
como instalar ou validar;
como usar no dia a dia;
erros comuns;
boas práticas;
como aparece em empresa;
como aparece em entrevista;
como conecta com Spring;
como testar na prática.
```

A ideia é formar base profissional.

Não basta saber clicar em botão da IDE.

Você precisa entender o que está acontecendo.

---

# Parte 1 — Por que ferramentas importam

Um backend Java profissional não é apenas:

```text
classe;
método;
if;
for;
interface;
herança.
```

Um backend profissional envolve:

```text
compilar;
executar;
gerenciar dependências;
rodar testes;
empacotar;
versionar;
integrar com banco;
subir aplicação;
configurar ambiente;
debugar;
automatizar build;
publicar artefato;
rodar em container;
monitorar;
entregar em pipeline.
```

As ferramentas existem para organizar esse fluxo.

Sem elas, você até consegue escrever código.

Mas não consegue manter um projeto profissional com qualidade.

---

## Fluxo real simplificado

```text
Código Java
  -> compilação
  -> testes
  -> empacotamento
  -> execução
  -> versionamento
  -> pipeline
  -> deploy
  -> monitoramento
```

Ferramentas entram em cada etapa.

---

# Parte 2 — Visão geral das ferramentas

## JDK

É o kit de desenvolvimento Java.

Você usa para:

```text
compilar código;
executar aplicações;
usar ferramentas como javac, java, jar, jshell;
desenvolver projetos Java.
```

Sem JDK, você não desenvolve Java de verdade.

---

## JVM

É a máquina virtual Java.

Ela executa bytecode Java.

Seu código `.java` não roda diretamente.

Ele é compilado para `.class`.

Depois a JVM executa.

```text
.java -> javac -> .class -> JVM executa
```

---

## JRE

É o ambiente de execução Java.

Historicamente, era comum falar:

```text
JDK para desenvolver;
JRE para executar.
```

Hoje, em projetos modernos, normalmente o JDK é usado no ambiente de desenvolvimento e muitas imagens de runtime já trazem o necessário para execução.

O conceito continua importante:

```text
JDK:
desenvolvimento.

Runtime/JRE:
execução.
```

---

## Maven

Ferramenta de build e gerenciamento de dependências.

Ajuda a:

```text
compilar;
rodar testes;
baixar bibliotecas;
empacotar jar;
organizar ciclo de build;
padronizar estrutura de projeto.
```

Arquivo principal:

```text
pom.xml
```

---

## Gradle

Também é ferramenta de build e gerenciamento de dependências.

Ajuda a:

```text
compilar;
rodar testes;
baixar bibliotecas;
empacotar;
automatizar tarefas;
criar builds mais flexíveis.
```

Arquivos comuns:

```text
build.gradle
settings.gradle
```

ou:

```text
build.gradle.kts
settings.gradle.kts
```

---

## Git

Sistema de controle de versão.

Ajuda a:

```text
registrar histórico;
criar commits;
trabalhar com branches;
comparar mudanças;
voltar versões;
integrar trabalho em equipe;
abrir pull requests;
participar de pipelines.
```

Git não é só salvar código.

Git é rastreabilidade do trabalho.

---

## IDE

Ambiente de desenvolvimento.

Exemplos:

```text
IntelliJ IDEA;
Eclipse;
VS Code;
NetBeans.
```

A IDE ajuda, mas não substitui conhecimento de terminal, build e JDK.

Um backend profissional precisa entender:

```text
o que a IDE faz por trás.
```

---

# Parte 3 — O caminho do código Java

Quando você escreve:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, backend Java.");
    }
}
```

Esse arquivo é:

```text
Main.java
```

Ele precisa ser compilado:

```powershell
javac Main.java
```

Isso gera:

```text
Main.class
```

Depois você executa:

```powershell
java Main
```

Fluxo:

```text
Main.java
  -> javac
  -> Main.class
  -> java
  -> JVM
  -> saída no terminal
```

---

## Por que isso importa

Muita gente usa IDE e esquece que existe compilação.

Mas erro de build, erro de classpath, erro de dependência e erro de versão aparecem no dia a dia.

Você precisa entender a base para resolver problemas reais.

---

# Parte 4 — JDK em detalhes

## O que vem no JDK

Um JDK normalmente traz ferramentas como:

```text
java;
javac;
jar;
javadoc;
jshell;
jlink;
jdeps;
keytool.
```

As principais no começo:

```text
java:
executa aplicação.

javac:
compila código Java.

jar:
empacota classes e recursos em arquivo .jar.
```

---

## Verificando instalação

No terminal:

```powershell
java -version
javac -version
```

Resultado esperado:

```text
java deve responder uma versão.
javac deve responder uma versão.
```

Se `java` funciona e `javac` não funciona, normalmente há problema de instalação ou variável de ambiente.

---

## JAVA_HOME

`JAVA_HOME` é uma variável de ambiente que aponta para a pasta do JDK.

Exemplo conceitual no Windows:

```text
JAVA_HOME=C:\Program Files\Java\jdk-xx
```

O `Path` deve conter:

```text
%JAVA_HOME%\bin
```

Assim o terminal encontra:

```text
java;
javac;
jar.
```

---

## Erros comuns com JDK

## 1. Ter Java instalado, mas não ter javac

Sintoma:

```powershell
java -version
```

funciona, mas:

```powershell
javac -version
```

não funciona.

Possível causa:

```text
runtime instalado, mas JDK não configurado;
Path errado;
JAVA_HOME errado.
```

---

## 2. IDE usando uma versão e terminal usando outra

Sintoma:

```text
na IDE funciona;
no terminal falha.
```

Ou o contrário.

Causa comum:

```text
SDK configurado na IDE diferente do JAVA_HOME.
```

---

## 3. Projeto exigindo uma versão e máquina usando outra

Sintoma:

```text
Unsupported class file major version;
release version not supported;
source option not supported.
```

Causa comum:

```text
versão do JDK incompatível com o projeto.
```

---

# Parte 5 — Maven em detalhes

## O que o Maven resolve

Sem Maven, para usar uma biblioteca externa, você teria que:

```text
baixar jar manualmente;
colocar no classpath;
baixar dependências da dependência;
controlar versões;
compilar manualmente;
rodar testes manualmente;
empacotar manualmente.
```

Isso não escala.

Maven resolve:

```text
estrutura padrão;
dependências;
ciclo de build;
plugins;
testes;
empacotamento;
publicação de artefatos.
```

---

## O arquivo pom.xml

O coração do Maven é:

```text
pom.xml
```

Exemplo simples:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula245-maven-basico</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

---

## groupId, artifactId e version

Esses três formam a identidade do projeto.

```text
groupId:
grupo, empresa ou domínio do projeto.

artifactId:
nome do artefato.

version:
versão do artefato.
```

Exemplo:

```text
br.com.curso:aula245-maven-basico:1.0.0
```

Isso é chamado de coordenada Maven.

---

## Estrutura padrão Maven

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

Significado:

```text
src/main/java:
código principal.

src/main/resources:
arquivos de configuração e recursos.

src/test/java:
testes automatizados.

src/test/resources:
recursos usados nos testes.
```

---

## Comandos Maven importantes

```powershell
mvn -version
```

Mostra versão e JDK usado pelo Maven.

```powershell
mvn compile
```

Compila o projeto.

```powershell
mvn test
```

Roda testes.

```powershell
mvn package
```

Compila, testa e empacota.

```powershell
mvn clean
```

Limpa a pasta `target`.

```powershell
mvn clean package
```

Limpa e empacota do zero.

---

## Pasta target

Quando Maven compila, ele gera:

```text
target
```

Essa pasta contém:

```text
classes compiladas;
resultados de testes;
jar final;
arquivos temporários de build.
```

Normalmente, não versionamos `target` no Git.

---

# Parte 6 — Gradle em detalhes

## O que o Gradle resolve

Gradle resolve problemas parecidos com Maven:

```text
build;
dependências;
testes;
plugins;
empacotamento;
tarefas;
automatização.
```

A diferença está no modelo de build.

Maven é mais baseado em convenção e XML.

Gradle é mais flexível e baseado em scripts.

---

## Arquivo build.gradle

Exemplo simples:

```groovy
plugins {
    id 'java'
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
```

---

## Estrutura padrão Gradle

Gradle também costuma usar:

```text
src/main/java
src/main/resources
src/test/java
src/test/resources
```

Ou seja, a estrutura é parecida com Maven.

---

## Comandos Gradle importantes

Se o projeto usa Gradle Wrapper:

```powershell
./gradlew tasks
./gradlew clean
./gradlew compileJava
./gradlew test
./gradlew build
```

No Windows PowerShell:

```powershell
.\gradlew tasks
.\gradlew clean
.\gradlew compileJava
.\gradlew test
.\gradlew build
```

---

## Gradle Wrapper

Projetos profissionais geralmente usam:

```text
gradlew
gradlew.bat
gradle/wrapper
```

Isso permite rodar o Gradle sem depender da versão instalada globalmente.

Comando típico:

```powershell
.\gradlew build
```

Em empresa, prefira usar o wrapper do projeto quando existir.

---

# Parte 7 — Maven vs Gradle

## Maven

Pontos fortes:

```text
muito usado no mercado;
estrutura previsível;
ciclo de vida bem definido;
fácil entender em projetos tradicionais;
muita documentação e exemplos.
```

## Gradle

Pontos fortes:

```text
mais flexível;
boa performance em projetos grandes;
scripts mais poderosos;
muito usado em Android e projetos modernos;
bom suporte a builds customizados.
```

## Regra prática

```text
Se o projeto usa Maven, aprenda Maven bem.
Se o projeto usa Gradle, aprenda Gradle bem.
```

Não brigue com a ferramenta do projeto.

Domine as duas o suficiente para trabalhar.

---

# Parte 8 — Git em detalhes

## O que o Git resolve

Git registra histórico de mudanças.

Sem Git:

```text
arquivo_final.java
arquivo_final_v2.java
arquivo_final_agora_vai.java
arquivo_final_corrigido.java
```

Com Git:

```text
commits;
branches;
diffs;
merge;
pull request;
histórico rastreável.
```

---

## Conceitos principais

## Working Directory

É sua pasta de trabalho.

Onde você edita arquivos.

---

## Staging Area

Área onde você prepara o que vai entrar no commit.

Comando:

```powershell
git add .
```

---

## Commit

Registro de uma mudança.

Comando:

```powershell
git commit -m "mensagem"
```

Um bom commit deve representar uma unidade lógica de mudança.

---

## Repository

Banco de histórico Git.

Fica na pasta oculta:

```text
.git
```

---

## Branch

Linha de trabalho.

Exemplo:

```text
main;
develop;
feature/nova-validacao;
bugfix/corrigir-reagendamento.
```

---

## Remote

Repositório remoto.

Exemplo:

```text
GitHub;
GitLab;
Bitbucket;
Azure DevOps.
```

---

# Parte 9 — Comandos Git essenciais

Ver status:

```powershell
git status
```

Inicializar repositório:

```powershell
git init
```

Adicionar arquivos:

```powershell
git add .
```

Criar commit:

```powershell
git commit -m "mensagem do commit"
```

Ver histórico:

```powershell
git log --oneline
```

Ver diferenças:

```powershell
git diff
```

Criar branch:

```powershell
git checkout -b feature/aula-245
```

Trocar branch:

```powershell
git checkout main
```

Versões mais novas também usam:

```powershell
git switch main
git switch -c feature/aula-245
```

---

# Parte 10 — O que não versionar

Em projeto Java, normalmente não versionamos:

```text
target;
build;
out;
.idea;
*.class;
*.log;
arquivos temporários;
senhas;
tokens;
.env com segredo real.
```

Exemplo de `.gitignore` básico:

```gitignore
target/
build/
out/
*.class
*.log
.idea/
.vscode/
.env
```

Atenção:

```text
não versionar segredo real;
não subir senha de banco;
não subir token de API;
não subir chave privada.
```

---

# Parte 11 — IDE e terminal

A IDE é importante.

Mas o terminal é obrigatório para backend profissional.

Você precisa conseguir:

```text
rodar java -version;
rodar javac -version;
rodar mvn test;
rodar mvn package;
rodar ./gradlew build;
rodar git status;
entender erro de build;
entender erro de dependência;
entender erro de compilação.
```

A IDE facilita.

O terminal confirma.

---

## Regra prática

```text
Se só funciona na IDE, ainda não está totalmente confiável.
Se funciona no terminal, tende a funcionar melhor em pipeline.
```

Pipeline não clica na IDE.

Pipeline roda comando.

---

# Parte 12 — Build profissional

Build é o processo que transforma código em artefato executável/testável.

Em Java, build pode incluir:

```text
limpar arquivos anteriores;
baixar dependências;
compilar;
rodar testes;
gerar relatório;
empacotar jar;
validar qualidade;
publicar artefato.
```

Com Maven:

```powershell
mvn clean package
```

Com Gradle:

```powershell
.\gradlew clean build
```

---

## Artefato

Artefato é o resultado do build.

Exemplos:

```text
.jar;
.war;
imagem Docker;
arquivo zip;
pacote publicado.
```

Em Spring Boot, normalmente o resultado é um `.jar` executável.

Vamos aprofundar isso mais para frente.

---

# Parte 13 — Dependências

Dependência é uma biblioteca que seu projeto usa.

Exemplos futuros:

```text
JUnit;
Mockito;
Spring Boot;
Spring Web;
Spring Data JPA;
PostgreSQL Driver;
Lombok;
Jackson;
Flyway;
MapStruct;
Testcontainers.
```

Sem Maven/Gradle, gerenciar isso manualmente seria ruim.

Com Maven/Gradle, você declara e a ferramenta baixa.

---

## Dependência direta e transitiva

Dependência direta:

```text
você declarou no pom.xml ou build.gradle.
```

Dependência transitiva:

```text
uma dependência que veio porque outra dependência precisa dela.
```

Exemplo conceitual:

```text
Projeto depende de A.
A depende de B.
Então B entra transitivamente.
```

Isso é normal.

Mas pode gerar conflito de versões.

Vamos aprofundar dependências em aulas específicas.

---

# Parte 14 — Classpath

Classpath é o caminho onde o Java procura classes.

Quando você executa:

```powershell
java -cp out br.com.curso.Main
```

Você está dizendo:

```text
procure classes compiladas na pasta out.
```

Maven e Gradle gerenciam classpath automaticamente no build.

Mas entender classpath ajuda a resolver erros como:

```text
ClassNotFoundException;
NoClassDefFoundError;
package does not exist;
cannot find symbol.
```

---

# Parte 15 — Laboratório 1: projeto Java manual

Crie a pasta:

```powershell
mkdir labs\m11\aula-245-java-manual
cd labs\m11\aula-245-java-manual
mkdir src
```

Crie:

```text
src\Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Java Backend profissional começa pela base.");
    }
}
```

Compile:

```powershell
javac -d out src\Main.java
```

Execute:

```powershell
java -cp out Main
```

Resultado esperado:

```text
Java Backend profissional começa pela base.
```

---

## O que aconteceu

```text
src/Main.java:
código fonte.

javac -d out:
compilou para a pasta out.

java -cp out Main:
executou a classe Main usando out como classpath.
```

---

# Parte 16 — Laboratório 2: projeto Maven mínimo

Crie:

```powershell
mkdir labs\m11\aula-245-maven-minimo
cd labs\m11\aula-245-maven-minimo
mkdir src\main\java\br\com\curso\aula245
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
    <artifactId>aula-245-maven-minimo</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

Crie:

```text
src\main\java\br\com\curso\aula245\App.java
```

Código:

```java
package br.com.curso.aula245;

public class App {
    public static void main(String[] args) {
        System.out.println("Projeto Maven mínimo executando.");
    }
}
```

Compile:

```powershell
mvn compile
```

Empacote:

```powershell
mvn package
```

Execute pela classe compilada:

```powershell
java -cp target\classes br.com.curso.aula245.App
```

---

## O que observar

O Maven criou:

```text
target/classes
```

E colocou ali a classe compilada.

---

# Parte 17 — Laboratório 3: projeto Gradle mínimo

Crie:

```powershell
mkdir labs\m11\aula-245-gradle-minimo
cd labs\m11\aula-245-gradle-minimo
mkdir src\main\java\br\com\curso\aula245
```

Crie:

```text
settings.gradle
```

Conteúdo:

```groovy
rootProject.name = 'aula-245-gradle-minimo'
```

Crie:

```text
build.gradle
```

Conteúdo:

```groovy
plugins {
    id 'java'
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
```

Crie:

```text
src\main\java\br\com\curso\aula245\App.java
```

Código:

```java
package br.com.curso.aula245;

public class App {
    public static void main(String[] args) {
        System.out.println("Projeto Gradle mínimo executando.");
    }
}
```

Compile:

```powershell
gradle compileJava
```

Build:

```powershell
gradle build
```

Se o projeto tiver wrapper, prefira:

```powershell
.\gradlew build
```

---

# Parte 18 — Laboratório 4: Git básico no projeto

Dentro de uma pasta de laboratório:

```powershell
git init
git status
```

Crie um `.gitignore`:

```gitignore
target/
build/
out/
*.class
*.log
.idea/
.vscode/
.env
```

Depois:

```powershell
git add .
git commit -m "Aula 245: projeto base ferramentas backend"
git log --oneline
```

---

## Commit bom

Mensagem ruim:

```text
alterações
```

Mensagem melhor:

```text
Aula 245: projeto base ferramentas backend
```

Mensagem boa deve indicar intenção.

---

# Parte 19 — Erros comuns nesta fase

## 1. Não saber qual Java está usando

Sempre confira:

```powershell
java -version
javac -version
```

---

## 2. Maven usando JDK diferente

Confira:

```powershell
mvn -version
```

Ele mostra o Java usado pelo Maven.

---

## 3. Gradle usando JDK diferente

Confira:

```powershell
gradle -version
```

Ou, com wrapper:

```powershell
.\gradlew -version
```

---

## 4. Versionar target/build/out

Essas pastas são geradas.

Não entram no Git.

---

## 5. Depender apenas da IDE

Sempre valide pelo terminal.

---

## 6. Não ler erro de build

Erro de build tem pista.

Leia de cima para baixo e procure:

```text
cannot find symbol;
package does not exist;
source release;
target release;
dependency not found;
test failure;
compilation failure.
```

---

# Parte 20 — Como isso aparece no trabalho real

Em uma empresa, você normalmente vai receber um projeto com:

```text
pom.xml
```

ou:

```text
build.gradle
```

e instruções como:

```text
rode mvn clean install;
rode ./gradlew build;
configure JDK;
suba Docker Compose;
configure application.yml;
rode testes;
abra pull request.
```

Você precisa olhar o projeto e entender:

```text
qual JDK usa?
é Maven ou Gradle?
como roda teste?
como empacota?
como executa local?
quais dependências existem?
qual branch usar?
qual padrão de commit?
```

---

# Parte 21 — Relação com Spring

Spring não vive isolado.

Para trabalhar bem com Spring, você precisa dominar a base:

```text
JDK:
roda a aplicação.

Maven/Gradle:
baixa Spring, compila, testa e empacota.

Git:
versiona alterações.

IDE:
ajuda no desenvolvimento.

Terminal:
roda comandos reais.

JUnit/Mockito:
testam código.

Docker:
sobe dependências externas.

Banco:
persiste dados.
```

Quando criarmos um projeto Spring Boot, você verá:

```text
pom.xml ou build.gradle;
classe main;
dependências;
plugins;
target ou build;
jar executável;
application.properties;
testes;
profiles;
logs.
```

Tudo começa aqui.

---

# Parte 22 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é JDK.
[ ] Sei explicar o que é JVM.
[ ] Sei explicar o que é JRE/runtime.
[ ] Sei rodar java -version.
[ ] Sei rodar javac -version.
[ ] Sei explicar o papel do Maven.
[ ] Sei explicar o papel do Gradle.
[ ] Sei explicar o papel do Git.
[ ] Sei explicar estrutura src/main/java.
[ ] Sei explicar estrutura src/test/java.
[ ] Sei explicar o que é build.
[ ] Sei explicar o que é artefato.
[ ] Sei explicar o que é dependência.
[ ] Sei explicar o que é classpath.
[ ] Sei por que terminal importa.
[ ] Sei por que isso prepara Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é JDK?
2. Qual diferença entre java e javac?
3. O que é JVM?
4. Para que serve Maven?
5. Para que serve Gradle?
6. O que é pom.xml?
7. O que é build.gradle?
8. O que é Git?
9. O que é commit?
10. Por que target/build/out não devem ir para o Git?
11. O que é dependência?
12. O que é classpath?
13. Por que validar pelo terminal?
14. Como isso prepara Spring?
15. Qual ferramenta você sente que precisa praticar mais?
```

---

# Parte 23 — Exercício prático principal

## Missão

Crie três laboratórios:

```text
labs/m11/aula-245-java-manual
labs/m11/aula-245-maven-minimo
labs/m11/aula-245-git-basico
```

---

## Requisitos

## Java manual

```text
criar Main.java;
compilar com javac;
executar com java;
entender out e classpath.
```

## Maven mínimo

```text
criar pom.xml;
criar App.java com package;
rodar mvn compile;
rodar mvn package;
executar target/classes.
```

## Git básico

```text
git init;
criar .gitignore;
git add;
git commit;
git log --oneline.
```

---

## Critérios

```text
não versionar out;
não versionar target;
não versionar .class;
conseguir explicar cada comando usado;
conseguir apagar out/target e gerar novamente;
conseguir rodar pelo terminal.
```

---

# Parte 24 — Desafio extra

## Diagnóstico de ambiente

Crie um arquivo:

```text
DIAGNOSTICO_AMBIENTE.md
```

Preencha:

```text
Java version:
Javac version:
Maven version:
Gradle version:
Git version:
IDE usada:
Sistema operacional:
JAVA_HOME configurado:
Path contém JAVA_HOME/bin:
```

Depois responda:

```text
1. O terminal encontra java?
2. O terminal encontra javac?
3. Maven usa qual Java?
4. Gradle usa qual Java?
5. Existe divergência entre IDE e terminal?
```

Esse tipo de diagnóstico é muito útil em empresa.

---

# Parte 25 — Simulado rápido

## Questão 1

JDK é usado principalmente para:

```text
A) desenvolver e compilar aplicações Java.
B) versionar código.
C) criar commits.
D) escrever HTML.
```

---

## Questão 2

`javac` serve para:

```text
A) compilar arquivos Java.
B) executar Git.
C) baixar dependências Maven.
D) criar branch.
```

---

## Questão 3

Maven usa como arquivo principal:

```text
A) pom.xml
B) build.gradle
C) package.json
D) Dockerfile
```

---

## Questão 4

Gradle usa comumente:

```text
A) build.gradle
B) pom.xml apenas
C) index.html
D) README apenas
```

---

## Questão 5

Git é usado para:

```text
A) controle de versão.
B) compilar bytecode.
C) executar JVM.
D) baixar JDK.
```

---

## Questão 6

A pasta `target` do Maven normalmente:

```text
A) é gerada pelo build e não deve ser versionada.
B) é código fonte principal.
C) é obrigatória no commit.
D) substitui o pom.xml.
```

---

## Questão 7

A pasta `src/main/java` normalmente contém:

```text
A) código principal da aplicação.
B) apenas arquivos .class.
C) apenas logs.
D) apenas builds temporários.
```

---

## Questão 8

Pipeline de CI normalmente executa:

```text
A) comandos de terminal/build.
B) cliques manuais na IDE.
C) edição manual de arquivos .class.
D) apenas prints.
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
git add labs/m11/aula-245-java-manual
git add labs/m11/aula-245-maven-minimo
git add labs/m11/aula-245-git-basico
git commit -m "Aula 245: ferramentas base Java backend"
git status
```

Se ainda não tiver repositório Git no curso, inicialize apenas na pasta principal do curso.

---

## Fechamento

A principal ideia desta aula é:

```text
Backend Java profissional exige entender não só código, mas também ferramentas de build, execução, dependências e versionamento.
```

Você estudou:

```text
JDK;
JVM;
JRE/runtime;
java;
javac;
jar;
JAVA_HOME;
Maven;
pom.xml;
Gradle;
build.gradle;
Git;
commit;
branch;
.gitignore;
build;
artefato;
dependência;
classpath;
terminal;
IDE;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
JDK, JVM, JRE, bytecode, classpath e variáveis de ambiente.
```

A ideia será entender com mais profundidade o que acontece por baixo quando uma aplicação Java compila e executa.
