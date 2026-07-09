# 246 — M11.02 — JDK, JVM, JRE, bytecode, classpath e variáveis de ambiente

## Objetivo da aula

Na aula anterior, você iniciou o módulo de ferramentas profissionais do Java Backend.

Você viu uma visão geral sobre:

```text
JDK;
JVM;
JRE/runtime;
Maven;
Gradle;
Git;
IDE;
terminal;
build;
dependências;
artefatos;
classpath;
preparação para Spring.
```

Agora vamos aprofundar uma parte essencial:

```text
como o Java compila e executa por baixo.
```

Nesta aula, vamos estudar com mais profundidade:

```text
JDK;
JVM;
JRE;
bytecode;
arquivos .java;
arquivos .class;
comando javac;
comando java;
comando jar;
classpath;
packages;
variável JAVA_HOME;
variável PATH;
erros comuns de ambiente;
diferença entre IDE e terminal;
diagnóstico profissional.
```

Ao final desta aula, você deve conseguir:

```text
explicar o que acontece entre escrever código e executar;
diferenciar JDK, JVM e runtime;
compilar Java manualmente;
entender bytecode;
entender classpath;
entender packages e pastas;
executar classe com package pelo terminal;
criar um JAR simples;
entender JAVA_HOME;
entender PATH;
diagnosticar erros comuns;
preparar base sólida para Maven, Gradle e Spring.
```

---

## Ideia central

Java não executa diretamente o arquivo `.java`.

O fluxo real é:

```text
arquivo .java
  -> compilador javac
  -> bytecode .class
  -> JVM
  -> execução
```

Exemplo:

```text
Main.java
  -> Main.class
  -> java Main
```

Quando o projeto tem package:

```text
br/com/curso/App.java
  -> br/com/curso/App.class
  -> java -cp out br.com.curso.App
```

Esse entendimento é obrigatório para backend profissional.

---

# Parte 1 — O que é JDK

JDK significa:

```text
Java Development Kit
```

Em português:

```text
Kit de Desenvolvimento Java
```

Ele é o conjunto de ferramentas para desenvolver aplicações Java.

O JDK inclui:

```text
compilador;
runtime;
ferramentas de empacotamento;
ferramentas de diagnóstico;
bibliotecas padrão;
documentação e utilitários.
```

As ferramentas mais importantes no começo são:

```text
java;
javac;
jar;
jshell;
javadoc;
keytool.
```

---

## java

Executa aplicações Java.

Exemplo:

```powershell
java Main
```

Ou:

```powershell
java -cp out br.com.curso.App
```

---

## javac

Compila arquivos `.java` para arquivos `.class`.

Exemplo:

```powershell
javac Main.java
```

Ou:

```powershell
javac -d out src\br\com\curso\App.java
```

---

## jar

Empacota classes e recursos em um arquivo `.jar`.

Exemplo:

```powershell
jar --create --file app.jar -C out .
```

---

## jshell

Ferramenta interativa para testar Java rapidamente.

Exemplo:

```powershell
jshell
```

Dentro dele:

```java
System.out.println("teste");
```

---

## javadoc

Gera documentação HTML a partir de comentários Java.

Exemplo futuro:

```powershell
javadoc -d docs src\*.java
```

---

## keytool

Ferramenta para certificados, chaves e keystores.

Vai aparecer em contextos como:

```text
HTTPS;
certificados;
assinatura;
integração segura;
TLS.
```

---

# Parte 2 — O que é JVM

JVM significa:

```text
Java Virtual Machine
```

Em português:

```text
Máquina Virtual Java
```

A JVM é responsável por executar bytecode Java.

Ela não executa `.java`.

Ela executa `.class`.

Fluxo:

```text
Código fonte Java
  -> javac
  -> bytecode
  -> JVM
```

---

## Por que existe JVM

A ideia clássica do Java é:

```text
Write once, run anywhere.
```

Em português:

```text
Escreva uma vez, rode em qualquer lugar.
```

A ideia é que seu código Java seja compilado para bytecode.

Depois, qualquer sistema com JVM compatível consegue executar esse bytecode.

Exemplo:

```text
Windows:
JVM Windows executa bytecode.

Linux:
JVM Linux executa bytecode.

Mac:
JVM Mac executa bytecode.
```

O bytecode é o mesmo conceito geral.

A JVM específica do sistema operacional faz a ponte com a máquina real.

---

## JVM não é só executor simples

A JVM também cuida de coisas importantes:

```text
carregamento de classes;
verificação de bytecode;
execução;
gerenciamento de memória;
garbage collector;
threads;
JIT compiler;
segurança;
áreas de memória;
stack;
heap.
```

Esses tópicos serão aprofundados mais para frente, principalmente:

```text
heap;
stack;
garbage collector;
performance;
memória em aplicações backend.
```

---

# Parte 3 — O que é JRE/runtime

JRE significa:

```text
Java Runtime Environment
```

Em português:

```text
Ambiente de Execução Java
```

Historicamente, a explicação era:

```text
JDK:
para desenvolver.

JRE:
para executar.
```

Hoje, em ambientes modernos, o conceito continua importante, mas a distribuição mudou um pouco.

Na prática:

```text
desenvolvedor instala JDK;
servidor/container pode usar runtime adequado;
imagens Docker podem vir com JRE/runtime;
Spring Boot normalmente roda com java -jar.
```

O importante:

```text
para compilar, precisa de javac;
para executar, precisa de runtime/JVM.
```

---

# Parte 4 — JDK vs JVM vs JRE

Resumo:

```text
JDK:
kit completo para desenvolver.

JVM:
máquina virtual que executa bytecode.

JRE/runtime:
ambiente necessário para rodar aplicações Java.
```

Tabela:

| Item | Serve para | Contém |
|---|---|---|
| JDK | Desenvolver e compilar | javac, java, jar, bibliotecas, runtime |
| JVM | Executar bytecode | motor de execução |
| JRE/runtime | Rodar aplicação | JVM + bibliotecas necessárias |

---

## Regra prática

```text
Se você vai programar Java: instale JDK.
Se você só vai rodar uma aplicação: runtime pode bastar.
```

Em backend profissional, no seu computador de desenvolvimento:

```text
use JDK.
```

---

# Parte 5 — Bytecode

Bytecode é o resultado da compilação Java.

Arquivo fonte:

```text
App.java
```

Depois de compilar:

```text
App.class
```

O `.class` contém bytecode.

Ele não é texto Java normal.

Ele é um formato entendido pela JVM.

---

## Exemplo simples

Crie:

```text
labs\m11\aula-246-bytecode\src\Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Estudando bytecode.");
    }
}
```

Compile:

```powershell
javac -d out src\Main.java
```

Veja a pasta:

```powershell
dir out
```

Você verá:

```text
Main.class
```

Execute:

```powershell
java -cp out Main
```

---

## Inspecionando bytecode com javap

O JDK traz uma ferramenta chamada:

```text
javap
```

Ela permite inspecionar classes compiladas.

Execute:

```powershell
javap -c out\Main.class
```

Você verá instruções de bytecode.

Exemplo de ideia:

```text
getstatic
ldc
invokevirtual
return
```

Não precisa decorar isso agora.

O objetivo é entender:

```text
Java compila para bytecode.
A JVM executa bytecode.
```

---

# Parte 6 — Compilação manual com javac

## Sem package

Arquivo:

```text
src\Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Sem package.");
    }
}
```

Compilar:

```powershell
javac -d out src\Main.java
```

Executar:

```powershell
java -cp out Main
```

---

## Com package

Arquivo:

```text
src\br\com\curso\aula246\App.java
```

Código:

```java
package br.com.curso.aula246;

public class App {
    public static void main(String[] args) {
        System.out.println("Com package.");
    }
}
```

Compilar:

```powershell
javac -d out src\br\com\curso\aula246\App.java
```

Executar:

```powershell
java -cp out br.com.curso.aula246.App
```

---

## O que significa -d out

O parâmetro:

```text
-d out
```

diz ao `javac`:

```text
coloque os arquivos compilados dentro da pasta out.
```

Se a classe tem package:

```java
package br.com.curso.aula246;
```

o compilador gera:

```text
out\br\com\curso\aula246\App.class
```

---

# Parte 7 — Packages e estrutura de pastas

Em Java, o package deve combinar com a estrutura de pastas.

Package:

```java
package br.com.curso.aula246;
```

Pasta esperada:

```text
br\com\curso\aula246
```

Classe:

```text
App.java
```

Caminho completo:

```text
src\br\com\curso\aula246\App.java
```

Depois de compilar:

```text
out\br\com\curso\aula246\App.class
```

Execução:

```powershell
java -cp out br.com.curso.aula246.App
```

---

## Erro comum

Tentar executar assim:

```powershell
java -cp out App
```

Se a classe tem package, isso falha.

O correto é usar o nome totalmente qualificado:

```powershell
java -cp out br.com.curso.aula246.App
```

Nome totalmente qualificado é:

```text
package + nome da classe
```

---

# Parte 8 — Classpath em profundidade

Classpath é onde o Java procura classes.

Quando você executa:

```powershell
java -cp out br.com.curso.aula246.App
```

Você está dizendo:

```text
Java, procure as classes dentro da pasta out.
```

A JVM procura:

```text
out\br\com\curso\aula246\App.class
```

porque você pediu:

```text
br.com.curso.aula246.App
```

---

## Classpath com mais de uma pasta ou jar

Você pode ter classpath com vários locais.

No Windows:

```powershell
java -cp "out;libs\biblioteca.jar" br.com.curso.App
```

No Linux/Mac:

```bash
java -cp "out:libs/biblioteca.jar" br.com.curso.App
```

Diferença:

```text
Windows usa ;
Linux/Mac usa :
```

---

## Por que Maven e Gradle ajudam

Em projetos reais, você teria muitas dependências.

Montar classpath manualmente seria horrível.

Maven e Gradle fazem isso por você.

Mas quando dá erro, entender classpath ajuda muito.

---

# Parte 9 — Erros clássicos de classpath

## ClassNotFoundException

Significa, em geral:

```text
a classe não foi encontrada em tempo de execução.
```

Possíveis causas:

```text
classpath errado;
classe não compilada;
package incorreto;
jar não incluído;
nome da classe errado.
```

---

## NoClassDefFoundError

Significa, em geral:

```text
a classe existia em compilação, mas não foi encontrada em execução.
```

Possíveis causas:

```text
dependência faltando no runtime;
jar não incluído;
versão incompatível;
classpath incompleto.
```

---

## cannot find symbol

Erro de compilação.

Significa:

```text
o compilador não encontrou uma classe, método ou variável.
```

Possíveis causas:

```text
import faltando;
nome errado;
classe não existe;
método não existe;
dependência não está no classpath de compilação.
```

---

## package does not exist

Erro de compilação.

Significa:

```text
o pacote importado não foi encontrado.
```

Possíveis causas:

```text
dependência não adicionada;
classpath errado;
import incorreto;
package da classe está diferente.
```

---

# Parte 10 — Variável PATH

`PATH` é uma variável do sistema operacional.

Ela diz ao terminal onde procurar comandos.

Quando você digita:

```powershell
java -version
```

O terminal procura `java.exe` nas pastas registradas no `PATH`.

Se não encontrar, aparece erro como:

```text
'java' não é reconhecido como um comando interno ou externo
```

Ou similar.

---

## Como o PATH deve apontar para Java

Normalmente, o PATH deve incluir:

```text
%JAVA_HOME%\bin
```

Ou o caminho direto:

```text
C:\Program Files\Java\jdk-xx\bin
```

Dentro da pasta `bin` ficam:

```text
java.exe;
javac.exe;
jar.exe;
jshell.exe.
```

---

# Parte 11 — Variável JAVA_HOME

`JAVA_HOME` aponta para a pasta raiz do JDK.

Exemplo:

```text
C:\Program Files\Java\jdk-21
```

Não deve apontar para:

```text
C:\Program Files\Java\jdk-21\bin
```

O correto é a raiz.

Depois o PATH usa:

```text
%JAVA_HOME%\bin
```

---

## Por que JAVA_HOME importa

Ferramentas como Maven, Gradle, IDEs e servidores podem usar `JAVA_HOME` para descobrir qual JDK usar.

Se estiver errado, podem aparecer erros como:

```text
JAVA_HOME is not defined correctly;
The JAVA_HOME environment variable is not defined;
release version not supported;
invalid target release.
```

---

# Parte 12 — Diagnóstico de ambiente

Execute:

```powershell
java -version
javac -version
where java
where javac
echo $env:JAVA_HOME
```

No Linux/Mac, equivalentes:

```bash
java -version
javac -version
which java
which javac
echo $JAVA_HOME
```

---

## Diagnóstico Maven

```powershell
mvn -version
```

Observe:

```text
Apache Maven version;
Java version;
Java home;
OS.
```

Se Maven usa Java diferente do terminal, isso precisa ser corrigido.

---

## Diagnóstico Gradle

```powershell
gradle -version
```

Ou:

```powershell
.\gradlew -version
```

Observe:

```text
Gradle version;
JVM;
OS.
```

---

# Parte 13 — IDE usando JDK diferente

A IDE pode estar configurada com outro JDK.

No IntelliJ, normalmente existe:

```text
Project SDK;
Module SDK;
Gradle JVM;
Maven Runner JRE.
```

Sintoma comum:

```text
terminal usa Java 21;
IDE usa Java 17.
```

Ou:

```text
IDE compila;
Maven no terminal falha.
```

Regra prática:

```text
confira o JDK na IDE e no terminal.
```

Backend profissional exige os dois coerentes.

---

# Parte 14 — Criando JAR simples

JAR significa:

```text
Java Archive
```

É um arquivo empacotado com classes e recursos.

Crie:

```text
labs\m11\aula-246-jar\src\br\com\curso\aula246\App.java
```

Código:

```java
package br.com.curso.aula246;

public class App {
    public static void main(String[] args) {
        System.out.println("Executando a partir de um JAR.");
    }
}
```

Compile:

```powershell
javac -d out src\br\com\curso\aula246\App.java
```

Crie o JAR:

```powershell
jar --create --file app.jar -C out .
```

Execute informando a classe:

```powershell
java -cp app.jar br.com.curso.aula246.App
```

---

## JAR executável com manifest

Para executar assim:

```powershell
java -jar app.jar
```

o JAR precisa ter um manifest indicando a classe principal.

Crie:

```text
manifest.txt
```

Conteúdo:

```text
Main-Class: br.com.curso.aula246.App
```

Atenção:

```text
deixe uma linha em branco no final do arquivo manifest.txt.
```

Crie o JAR:

```powershell
jar --create --file app.jar --manifest manifest.txt -C out .
```

Execute:

```powershell
java -jar app.jar
```

---

## Por que isso importa para Spring

Spring Boot gera um JAR executável.

No futuro, você vai rodar:

```powershell
java -jar target\minha-api.jar
```

Então entender JAR agora ajuda muito.

---

# Parte 15 — Laboratório completo da aula

Crie:

```powershell
mkdir labs\m11\aula-246-jdk-jvm-bytecode-classpath
cd labs\m11\aula-246-jdk-jvm-bytecode-classpath
mkdir src\br\com\curso\aula246
```

Crie:

```text
src\br\com\curso\aula246\Calculadora.java
```

Código:

```java
package br.com.curso.aula246;

public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }

    public int multiplicar(int a, int b) {
        return a * b;
    }
}
```

Crie:

```text
src\br\com\curso\aula246\App.java
```

Código:

```java
package br.com.curso.aula246;

public class App {
    public static void main(String[] args) {
        Calculadora calculadora = new Calculadora();

        int soma = calculadora.somar(10, 5);
        int multiplicacao = calculadora.multiplicar(10, 5);

        System.out.println("Soma: " + soma);
        System.out.println("Multiplicação: " + multiplicacao);
    }
}
```

Compile:

```powershell
javac -d out src\br\com\curso\aula246\Calculadora.java src\br\com\curso\aula246\App.java
```

Execute:

```powershell
java -cp out br.com.curso.aula246.App
```

Inspecione:

```powershell
javap -c out\br\com\curso\aula246\App.class
```

Crie JAR:

```powershell
jar --create --file aula246.jar -C out .
```

Execute pelo classpath:

```powershell
java -cp aula246.jar br.com.curso.aula246.App
```

Crie manifest:

```text
Main-Class: br.com.curso.aula246.App
```

Crie JAR executável:

```powershell
jar --create --file aula246-executavel.jar --manifest manifest.txt -C out .
```

Execute:

```powershell
java -jar aula246-executavel.jar
```

---

# Parte 16 — Compilando múltiplos arquivos

Em projeto com muitos arquivos, listar um por um é ruim.

No PowerShell, você pode usar:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
```

Isso compila todos os `.java` encontrados.

Esse comando foi usado em várias aulas anteriores.

Em Linux/Mac:

```bash
javac -d out $(find src -name "*.java")
```

---

# Parte 17 — O que Maven e Gradle automatizam aqui

Tudo que você fez manualmente:

```text
compilar;
organizar classpath;
gerar classes;
empacotar jar;
rodar testes;
gerenciar dependências.
```

Maven/Gradle automatizam.

Mas a base é a mesma:

```text
código fonte;
compilação;
bytecode;
classpath;
execução;
artefato.
```

Maven e Gradle não fazem mágica.

Eles organizam e automatizam o fluxo.

---

# Parte 18 — Versão source, target e release

Quando compilamos Java, existe compatibilidade de versão.

Termos comuns:

```text
source:
versão da linguagem aceita no código fonte.

target:
versão do bytecode gerado.

release:
forma moderna de dizer para qual plataforma Java compilar.
```

Em Maven, você pode ver:

```xml
<maven.compiler.source>21</maven.compiler.source>
<maven.compiler.target>21</maven.compiler.target>
```

Ou:

```xml
<maven.compiler.release>21</maven.compiler.release>
```

---

## Erro comum

```text
release version 21 not supported
```

Significa:

```text
o JDK usado para compilar não suporta release 21.
```

Exemplo:

```text
projeto pede Java 21;
Maven está usando Java 17.
```

Solução:

```text
ajustar JDK;
ajustar JAVA_HOME;
ajustar IDE;
ajustar Maven/Gradle JVM.
```

---

# Parte 19 — LTS e versões Java

Você verá muito o termo:

```text
LTS
```

LTS significa:

```text
Long-Term Support
```

Versões LTS são comuns em empresas porque têm suporte prolongado.

Exemplos conhecidos:

```text
Java 8;
Java 11;
Java 17;
Java 21.
```

Em projetos modernos, é comum encontrar:

```text
Java 17;
Java 21.
```

O ponto prático:

```text
sempre confira a versão exigida pelo projeto.
```

---

# Parte 20 — Como diagnosticar erro de versão

## Passo 1

Veja o Java do terminal:

```powershell
java -version
javac -version
```

## Passo 2

Veja o Java do Maven:

```powershell
mvn -version
```

## Passo 3

Veja o Java do Gradle:

```powershell
.\gradlew -version
```

## Passo 4

Veja o projeto:

```text
pom.xml;
build.gradle;
README;
Dockerfile;
pipeline.
```

Procure:

```text
source;
target;
release;
toolchain;
java.version.
```

## Passo 5

Confira IDE:

```text
Project SDK;
Gradle JVM;
Maven JRE.
```

---

# Parte 21 — Erros comuns e solução rápida

## Erro: java não reconhecido

Possível causa:

```text
PATH não contém JDK/bin.
```

Verifique:

```powershell
echo $env:JAVA_HOME
where java
```

---

## Erro: javac não reconhecido

Possível causa:

```text
JDK não instalado;
PATH aponta para runtime sem javac;
JAVA_HOME errado.
```

Verifique:

```powershell
javac -version
where javac
```

---

## Erro: Could not find or load main class

Possíveis causas:

```text
classe principal errada;
package esquecido;
classpath errado;
classe não compilada.
```

Exemplo com package:

Errado:

```powershell
java -cp out App
```

Certo:

```powershell
java -cp out br.com.curso.aula246.App
```

---

## Erro: class file has wrong version

Possível causa:

```text
classe foi compilada com Java mais novo;
está tentando executar com Java mais antigo.
```

Solução:

```text
usar runtime compatível;
recompilar com versão adequada.
```

---

## Erro: package does not exist

Possível causa:

```text
dependência faltando;
classpath errado;
import incorreto.
```

Solução:

```text
adicionar dependência;
corrigir import;
corrigir build;
rodar mvn compile ou gradle build.
```

---

# Parte 22 — Como isso aparece em projetos Spring

Quando você criar projeto Spring Boot, terá algo como:

```text
src/main/java/br/com/empresa/projeto/ProjetoApplication.java
```

Com:

```java
@SpringBootApplication
public class ProjetoApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjetoApplication.class, args);
    }
}
```

Por baixo, ainda existe:

```text
compilação;
bytecode;
JVM;
classpath;
dependências;
JAR;
java -jar.
```

Spring parece mágico no começo, mas roda sobre a mesma base.

Por isso estamos aprofundando agora.

---

# Parte 23 — Relação com Docker futuramente

Em Docker, você verá imagens como:

```text
eclipse-temurin:21-jdk
eclipse-temurin:21-jre
```

Ou similares.

Diferença prática:

```text
imagem com JDK:
boa para build.

imagem com runtime/JRE:
boa para execução.
```

Em builds profissionais, é comum usar multi-stage:

```text
stage 1:
compila com JDK.

stage 2:
roda com runtime menor.
```

Vamos aprofundar Docker em módulo próprio.

---

# Parte 24 — Relação com CI/CD futuramente

Em pipeline, você verá etapas como:

```text
setup-java;
mvn clean verify;
gradle build;
java -version;
cache de dependências;
publicação de artefato.
```

Se o pipeline falhar por versão Java, você precisará entender:

```text
qual JDK o pipeline instalou;
qual versão o projeto exige;
qual Maven/Gradle está usando;
qual comando falhou.
```

Esse diagnóstico começa nesta aula.

---

# Parte 25 — Boas práticas de ambiente Java

Use estas práticas:

```text
padronize a versão do JDK do projeto;
documente versão no README;
configure JAVA_HOME corretamente;
não dependa só da IDE;
rode build pelo terminal;
use Maven Wrapper ou Gradle Wrapper quando existir;
não versionar arquivos gerados;
não misturar várias versões sem controle;
investigue erros de classpath com calma;
mantenha commits pequenos e rastreáveis.
```

---

# Parte 26 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar JDK.
[ ] Sei explicar JVM.
[ ] Sei explicar JRE/runtime.
[ ] Sei explicar bytecode.
[ ] Sei compilar com javac.
[ ] Sei executar com java.
[ ] Sei usar -cp.
[ ] Sei explicar classpath.
[ ] Sei explicar package e pasta.
[ ] Sei criar JAR simples.
[ ] Sei criar JAR executável com manifest.
[ ] Sei verificar JAVA_HOME.
[ ] Sei verificar PATH.
[ ] Sei diagnosticar erro de versão.
[ ] Sei diagnosticar erro de main class.
[ ] Sei explicar por que Maven/Gradle automatizam isso.
[ ] Sei conectar essa base com Spring futuro.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é JDK?
2. O que é JVM?
3. O que é JRE/runtime?
4. O que é bytecode?
5. Qual arquivo o javac gera?
6. O que faz o comando java?
7. O que significa -cp?
8. O que é classpath?
9. Por que package precisa combinar com pasta?
10. Como executar uma classe com package?
11. O que é JAVA_HOME?
12. O que é PATH?
13. Para que serve jar?
14. O que é manifest?
15. Como isso aparece no Spring Boot?
```

---

# Parte 27 — Exercício prático principal

## Missão

Crie o laboratório:

```text
labs/m11/aula-246-jdk-jvm-bytecode-classpath
```

Com:

```text
Calculadora.java;
App.java;
package br.com.curso.aula246.
```

---

## Requisitos

Você deve:

```text
compilar com javac;
executar com java -cp;
inspecionar com javap;
criar jar simples;
executar jar via classpath;
criar manifest;
criar jar executável;
executar com java -jar.
```

---

## Critérios

```text
não usar IDE para rodar;
rodar pelo terminal;
não versionar out;
não versionar .class;
não versionar jar se for apenas artefato de build;
documentar comandos usados;
explicar cada erro encontrado.
```

---

# Parte 28 — Desafio extra

Crie um arquivo:

```text
DIAGNOSTICO_JAVA.md
```

Preencha:

```text
java -version:
javac -version:
where java:
where javac:
JAVA_HOME:
mvn -version:
gradle -version ou ./gradlew -version:
IDE Project SDK:
Sistema operacional:
```

Depois responda:

```text
1. Terminal e IDE usam a mesma versão?
2. Maven usa o mesmo JDK?
3. Gradle usa o mesmo JDK?
4. JAVA_HOME aponta para raiz do JDK?
5. PATH contém JAVA_HOME/bin?
6. Existe risco de conflito de versão?
```

---

# Parte 29 — Simulado rápido

## Questão 1

O arquivo `.java` é:

```text
A) código fonte.
B) bytecode.
C) jar executável.
D) variável de ambiente.
```

---

## Questão 2

O arquivo `.class` contém:

```text
A) bytecode.
B) código fonte puro.
C) configuração Git.
D) manifest apenas.
```

---

## Questão 3

Quem compila Java é:

```text
A) javac.
B) git.
C) docker.
D) postman.
```

---

## Questão 4

Quem executa bytecode Java é:

```text
A) JVM.
B) Git.
C) Maven Central.
D) Swagger.
```

---

## Questão 5

Classpath serve para:

```text
A) indicar onde a JVM deve procurar classes.
B) criar branch Git.
C) formatar JSON.
D) criar tabela no banco.
```

---

## Questão 6

Se uma classe tem package `br.com.curso`, normalmente você executa com:

```text
A) java -cp out br.com.curso.NomeClasse
B) java NomeClasse.java
C) git run br.com.curso
D) mvn git
```

---

## Questão 7

JAVA_HOME deve apontar para:

```text
A) a raiz do JDK.
B) qualquer arquivo .java.
C) uma branch Git.
D) o arquivo pom.xml.
```

---

## Questão 8

`jar` serve para:

```text
A) empacotar classes e recursos em arquivo .jar.
B) compilar código Java.
C) criar commit.
D) configurar PATH.
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
git add labs/m11/aula-246-jdk-jvm-bytecode-classpath
git add DIAGNOSTICO_JAVA.md
git commit -m "Aula 246: jdk jvm bytecode classpath ambiente"
git status
```

Se `DIAGNOSTICO_JAVA.md` estiver dentro da pasta do laboratório, ajuste o caminho do `git add`.

---

## Fechamento

A principal ideia desta aula é:

```text
Java profissional exige entender o caminho entre código fonte, bytecode, JVM, classpath, JAR e ambiente de execução.
```

Você estudou:

```text
JDK;
JVM;
JRE/runtime;
java;
javac;
jar;
javap;
bytecode;
.class;
.java;
packages;
classpath;
JAVA_HOME;
PATH;
JAR executável;
manifest;
erros comuns;
diagnóstico de ambiente;
relação com Maven;
relação com Gradle;
relação com Spring;
relação com Docker;
relação com CI/CD.
```

Na próxima aula, vamos aprofundar:

```text
Maven profissional.
```

A ideia será entender `pom.xml`, dependências, repositórios, lifecycle, phases, goals, plugins, scopes, empacotamento, testes e erros comuns em projetos Java Backend.
