# 005 — M0.05 — JDK, JRE, JVM e Escolha de Versão LTS

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.05.01` — JDK, JRE, JVM e escolha de versão LTS — Conceito, por que existe e vocabulário essencial.
- `M0.05.02` — JDK, JRE, JVM e escolha de versão LTS — Exemplo mínimo digitado do zero.
- `M0.05.03` — JDK, JRE, JVM e escolha de versão LTS — Exemplo aplicado ao domínio corporativo.
- `M0.05.04` — JDK, JRE, JVM e escolha de versão LTS — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar a plataforma Java como fundamento profissional, não como uma sequência isolada de siglas.

---

## Complemento operacional — baixar, instalar e configurar o JDK


> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.


Esta aula é o ponto oficial para instalar o Java da formação.

O resultado esperado não é apenas entender JDK, JRE e JVM. O aluno também precisa sair com o JDK funcional no Windows.

### Fonte de download

Baixe o JDK em uma fonte oficial ou reconhecida.

Distribuições comuns:

```text
Eclipse Temurin / Adoptium;
Oracle JDK;
Microsoft Build of OpenJDK;
Amazon Corretto;
Azul Zulu.
```

Para a formação, mantenha uma versão LTS moderna. O padrão didático do curso é:

```text
JDK 21 LTS
```

### Instalação no Windows

Fluxo recomendado:

```text
1. Baixar instalador do JDK para Windows x64.
2. Executar o instalador.
3. Manter caminho de instalação estável.
4. Finalizar instalação.
5. Configurar JAVA_HOME.
6. Garantir `%JAVA_HOME%\bin` no PATH.
7. Abrir novo PowerShell.
8. Validar `java` e `javac`.
```

### JAVA_HOME correto

`JAVA_HOME` deve apontar para a raiz do JDK:

```text
C:\Program Files\...\jdk-21...
```

Errado:

```text
C:\Program Files\...\jdk-21...\bin
```

Correto:

```text
JAVA_HOME = pasta raiz do JDK
PATH = inclui %JAVA_HOME%\bin
```

### Validação obrigatória

No PowerShell novo:

```powershell
java -version
javac -version
where java
where javac
echo $env:JAVA_HOME
```

Ambiente saudável:

```text
java funciona;
javac funciona;
java e javac estão em versões coerentes;
JAVA_HOME aponta para o JDK;
where java e where javac apontam para caminhos esperados.
```

### Teste final desta aula

```powershell
cd C:\dev\labs
mkdir validacao-jdk
cd validacao-jdk
New-Item Main.java
```

Conteúdo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("JDK instalado e validado.");
    }
}
```

Compile e execute:

```powershell
javac Main.java
java Main
```

Saída esperada:

```text
JDK instalado e validado.
```

### Critério operacional atualizado

```markdown
## JDK validado

- [ ] JDK instalado.
- [ ] `JAVA_HOME` configurado.
- [ ] `%JAVA_HOME%\bin` no PATH.
- [ ] `java -version` funciona.
- [ ] `javac -version` funciona.
- [ ] `where java` aponta para local esperado.
- [ ] `where javac` aponta para local esperado.
- [ ] `Main.java` compila pelo terminal.
- [ ] `Main` executa pelo terminal.
```

---

## Hoje a aula é sobre entender onde o Java realmente roda

Antes de escrever muito código Java, é preciso entender a base que permite o Java existir na sua máquina.

Muita gente começa por:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Isso é importante.

Mas existe uma pergunta antes:

```text
Quem compila esse código?
Quem executa esse programa?
O que precisa estar instalado?
Por que existe JVM?
Por que falamos em JDK?
O que é JRE?
Por que escolher versão LTS?
```

Se essas respostas ficam confusas, o aluno passa a tratar o Java como mágica.

E backend profissional não pode depender de mágica.

Um desenvolvedor forte precisa saber o que está instalado, o que executa, o que compila e como diagnosticar quando o ambiente falha.

Essa aula é sobre isso.

---

## A ideia central: Java não é só a linguagem

Quando alguém diz:

```text
Estou estudando Java.
```

pode estar falando de várias coisas ao mesmo tempo.

Pode estar falando da linguagem:

```text
classes
métodos
variáveis
if
for
records
exceptions
generics
streams
```

Pode estar falando da plataforma:

```text
JVM
JRE
JDK
bibliotecas
ferramentas
bytecode
```

Pode estar falando do ecossistema:

```text
Maven
Gradle
Spring Boot
JUnit
Hibernate
Kafka
Docker
cloud
```

Nesta aula, o foco é a plataforma Java.

A plataforma é o que permite que o código Java seja compilado e executado.

---

## O fluxo mais importante

Guarde este fluxo:

```text
arquivo .java
↓
javac compila
↓
arquivo .class
↓
JVM executa
↓
programa roda
```

Em comandos:

```bash
javac Main.java
java Main
```

O primeiro comando compila.

O segundo executa.

Essa separação é essencial.

Muita gente mistura.

Mas, profissionalmente, você precisa saber diferenciar:

```text
erro de compilação
erro de execução
erro de ambiente
erro de configuração
```

Essa aula prepara esse raciocínio.

---

## O que é JVM

JVM significa:

```text
Java Virtual Machine
```

Em português:

```text
Máquina Virtual Java
```

A JVM é quem executa o bytecode Java.

Bytecode é o conteúdo gerado quando o código Java é compilado.

Você escreve:

```text
Main.java
```

O compilador gera:

```text
Main.class
```

A JVM executa:

```text
Main.class
```

Então a JVM não executa diretamente o código-fonte `.java` no fluxo clássico.

Ela executa o resultado compilado.

---

## Por que a JVM existe

A JVM existe para criar uma camada entre o programa Java e o sistema operacional.

Sem essa ideia, um programa precisaria ser compilado de forma diferente para cada sistema:

```text
Windows
Linux
macOS
```

Com Java, o código é compilado para bytecode.

Depois, cada sistema operacional tem sua própria JVM capaz de executar esse bytecode.

A ideia clássica é:

```text
escreva uma vez, execute em vários lugares
```

Na prática profissional, há detalhes, dependências, sistema operacional, arquitetura de processador e configuração.

Mas a ideia principal continua:

```text
Java compila para bytecode.
A JVM executa bytecode.
```

Isso é uma das bases da portabilidade do Java.

---

## O que é bytecode

Bytecode é um formato intermediário.

Ele não é o código Java que você escreveu.

Também não é exatamente código nativo do Windows ou Linux.

Ele é um código que a JVM entende.

Exemplo:

```text
Main.java  → código-fonte
Main.class → bytecode
```

Você não precisa abrir ou editar `.class`.

O `.class` é gerado.

O que você edita é o `.java`.

Essa distinção importa para Git também.

Em geral:

```text
.java vai para o Git
.class não vai para o Git
```

Porque `.class` é resultado de compilação.

Resultado gerado pode ser recriado.

Código-fonte precisa ser preservado.

---

## O que é JRE

JRE significa:

```text
Java Runtime Environment
```

Em português:

```text
Ambiente de Execução Java
```

O JRE contém o necessário para rodar aplicações Java.

Pense assim:

```text
JRE = JVM + bibliotecas para executar programas Java
```

Se alguém só precisa rodar um programa Java pronto, historicamente o JRE já podia ser suficiente.

Mas para desenvolver, não basta.

Por quê?

Porque desenvolver exige compilar.

E o compilador está no JDK.

---

## O que é JDK

JDK significa:

```text
Java Development Kit
```

Em português:

```text
Kit de Desenvolvimento Java
```

O JDK contém o necessário para desenvolver em Java.

Ele inclui:

```text
JVM
bibliotecas
ferramentas de desenvolvimento
compilador javac
comando java
outras ferramentas do ecossistema Java
```

A regra prática para esta formação é simples:

```text
Quem desenvolve Java precisa de JDK.
```

Não instale apenas JRE para estudar backend Java.

Use JDK.

---

## Relação entre JVM, JRE e JDK

A relação pode ser pensada assim:

```text
JVM
executa bytecode

JRE
fornece ambiente para rodar programas Java
inclui JVM e bibliotecas

JDK
fornece ambiente para desenvolver programas Java
inclui JRE e ferramentas como javac
```

Uma frase simples ajuda:

```text
JVM executa.
JRE roda.
JDK desenvolve.
```

Mas não fique só na frase.

Entenda o papel:

```text
JVM é motor de execução.
JRE é ambiente de execução.
JDK é kit de desenvolvimento.
```

---

## `java` e `javac`

Agora entram dois comandos fundamentais.

### `javac`

O comando:

```bash
javac
```

é o compilador Java.

Ele transforma `.java` em `.class`.

Exemplo:

```bash
javac Main.java
```

Resultado esperado:

```text
Main.class
```

### `java`

O comando:

```bash
java
```

executa uma classe Java.

Exemplo:

```bash
java Main
```

Perceba:

```text
javac Main.java
java Main
```

No primeiro, você passa o arquivo `.java`.

No segundo, você passa o nome da classe, sem `.class`.

Esse detalhe é pequeno, mas muito importante.

---

## Por que `java Main` não usa `.class`

Muita gente tenta:

```bash
java Main.class
```

Isso está errado no fluxo que estamos aprendendo.

O comando `java` espera o nome da classe.

Se o arquivo é:

```text
Main.class
```

a classe é:

```text
Main
```

Então:

```bash
java Main
```

A JVM procura uma classe chamada `Main` no classpath.

Classpath será aprofundado na próxima aula.

Por enquanto, entenda:

```text
java executa classe pelo nome.
javac compila arquivo .java.
```

---

## O que é versão LTS

LTS significa:

```text
Long-Term Support
```

Em português:

```text
Suporte de Longo Prazo
```

Uma versão LTS é uma versão escolhida para ter suporte por mais tempo.

No mundo profissional, isso importa porque empresas precisam de estabilidade.

Elas não podem trocar versão de Java a cada novidade sem avaliar impacto.

Uma versão LTS tende a ser melhor para:

```text
projetos corporativos;
backend de longo prazo;
compatibilidade;
suporte;
documentação;
bibliotecas;
times grandes;
ambientes de produção.
```

Nesta formação, usamos uma versão LTS porque o objetivo é profissional.

Não estamos brincando com Java apenas por curiosidade.

Estamos formando base para backend real.

---

## Por que usar JDK 21 LTS

A formação usa JDK 21 LTS como padrão.

Ele é moderno, estável e adequado para estudar Java atual com visão profissional.

Usar uma versão moderna evita aprender Java como se ainda estivéssemos presos ao passado.

Ao mesmo tempo, usar LTS evita ficar pulando entre versões sem necessidade.

A regra é:

```text
versão moderna o suficiente para o mercado atual;
estável o suficiente para formação séria.
```

JDK 21 LTS atende bem esse objetivo.

---

## Cuidado com tutoriais antigos

Muitos tutoriais na internet usam Java 8.

Java 8 foi extremamente importante.

Mas a linguagem evoluiu bastante.

Hoje existem recursos modernos como:

```text
var em contexto local;
records;
switch moderno;
text blocks;
sealed classes;
pattern matching;
melhorias em APIs;
virtual threads;
```

Nem tudo será usado logo no começo.

Mas a formação precisa preparar para Java moderno.

Ao mesmo tempo, muitos sistemas corporativos ainda têm legado em versões antigas.

Então mais tarde também será importante reconhecer código antigo.

A formação precisa ensinar:

```text
Java moderno
sem perder capacidade de ler legado
```

---

## `JAVA_HOME`

`JAVA_HOME` é uma variável de ambiente que aponta para a pasta raiz do JDK.

Exemplo:

```text
C:\Program Files\Eclipse Adoptium\jdk-21
```

O `JAVA_HOME` não deve apontar para `bin`.

Errado:

```text
C:\Program Files\Eclipse Adoptium\jdk-21\bin
```

Correto:

```text
C:\Program Files\Eclipse Adoptium\jdk-21
```

Por quê?

Porque `JAVA_HOME` representa a casa do JDK.

A pasta `bin` fica dentro dessa casa.

Pense assim:

```text
JAVA_HOME = raiz do JDK
PATH = inclui a pasta bin para encontrar comandos
```

---

## `PATH`

`PATH` é uma variável de ambiente que diz ao sistema onde procurar comandos.

Quando você digita:

```powershell
java -version
```

o Windows procura `java.exe` em pastas listadas no `PATH`.

Quando digita:

```powershell
javac -version
```

o Windows procura `javac.exe`.

Por isso, normalmente o `PATH` precisa incluir:

```text
%JAVA_HOME%\bin
```

ou o caminho direto para a pasta `bin` do JDK.

Se o JDK está instalado, mas o `PATH` não aponta para ele, o terminal pode não encontrar `java` ou `javac`.

---

## Como validar o ambiente Java

Abra o PowerShell.

Execute:

```powershell
java -version
```

Esse comando mostra a versão do runtime Java.

Depois:

```powershell
javac -version
```

Esse comando mostra a versão do compilador Java.

Depois:

```powershell
where java
```

Esse comando mostra onde o `java.exe` foi encontrado.

Depois:

```powershell
where javac
```

Esse comando mostra onde o `javac.exe` foi encontrado.

Depois:

```powershell
echo $env:JAVA_HOME
```

Esse comando mostra o valor da variável `JAVA_HOME`.

Esses comandos juntos formam um diagnóstico básico.

---

## O que esperar de um ambiente saudável

Um ambiente Java saudável deve ter coerência.

Exemplo esperado:

```text
java -version       → Java 21
javac -version      → javac 21
where java          → caminho do JDK 21
where javac         → caminho do JDK 21
JAVA_HOME           → raiz do JDK 21
```

Não precisa ser exatamente esse texto.

Mas a ideia é:

```text
java e javac existem;
java e javac estão na mesma versão principal;
JAVA_HOME aponta para o JDK;
o caminho encontrado faz sentido.
```

Se `java` é 21 e `javac` é 17, há inconsistência.

Se `java` funciona e `javac` não, talvez exista runtime mas não compilador acessível.

Se `JAVA_HOME` aponta para `bin`, está conceitualmente errado.

Se `where java` mostra vários caminhos, pode haver múltiplas instalações.

---

## Exemplo mínimo: validar Java no terminal

No PowerShell, rode:

```powershell
java -version
javac -version
where java
where javac
echo $env:JAVA_HOME
```

Depois registre a saída no diário.

Exemplo de registro:

```markdown
# Validação Java

## java -version
...

## javac -version
...

## where java
...

## where javac
...

## JAVA_HOME
...
```

Esse registro é importante porque prova que o ambiente estava saudável naquele momento.

Mais tarde, se algo quebrar, você tem referência.

---

## Primeiro programa visto pelo olhar da plataforma

Crie uma pasta de laboratório:

```powershell
cd C:\dev\labs
mkdir java-plataforma
cd java-plataforma
```

Crie o arquivo:

```powershell
New-Item Main.java
```

Coloque este código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("JDK compila. JVM executa.");
    }
}
```

Compile:

```bash
javac Main.java
```

Liste:

```powershell
ls
```

Você deve ver:

```text
Main.java
Main.class
```

Agora execute:

```bash
java Main
```

Saída esperada:

```text
JDK compila. JVM executa.
```

O que aconteceu?

```text
Main.java foi escrito por você.
javac, ferramenta do JDK, compilou.
Main.class foi gerado.
java iniciou a JVM.
a JVM executou a classe Main.
```

Esse é o primeiro entendimento profissional.

---

## O que esse exemplo prova

Esse exemplo pequeno prova várias coisas.

Prova que:

```text
o JDK está instalado;
o javac está acessível;
o java está acessível;
o código-fonte pode ser compilado;
o bytecode pode ser executado;
o terminal está na pasta correta;
o nome da classe e do arquivo estão coerentes.
```

Um simples `Olá, mundo` pode ser só brincadeira.

Mas, com olhar de engenharia, ele vira diagnóstico do ambiente.

---

## Exemplo aplicado ao backend corporativo

Imagine um projeto backend Spring Boot em uma empresa.

O time diz:

```text
O projeto exige Java 21.
```

Isso não é detalhe.

Se uma pessoa usa Java 17, pode acontecer:

```text
erro de compilação;
recurso da linguagem não suportado;
plugin incompatível;
biblioteca esperando outra versão;
pipeline falhando;
diferença entre local e produção.
```

Agora imagine outro cenário:

```text
No computador local, roda.
No pipeline, falha.
```

Uma das primeiras perguntas técnicas é:

```text
qual versão de Java está rodando em cada ambiente?
```

O mesmo vale para produção.

Se a aplicação foi construída para Java 21, mas o container usa outro runtime, pode falhar.

Então, quando se aprende:

```powershell
java -version
javac -version
where java
```

não é curiosidade.

É base de diagnóstico profissional.

---

## Java na IDE não elimina Java no terminal

A IDE pode esconder muita coisa.

No IntelliJ, você clica em Run e o programa roda.

Mas por trás existe JDK.

Existe compilação.

Existe execução.

Existe configuração de SDK.

Existe classpath.

Existe pasta de saída.

A IDE facilita, mas não elimina a plataforma.

Por isso, mesmo usando IntelliJ, é importante saber validar:

```powershell
java -version
javac -version
```

Se a IDE usa um JDK e o terminal usa outro, você pode ter comportamentos diferentes.

Profissional forte sabe conferir os dois.

---

## Java, Maven e Gradle

Mais tarde, Maven e Gradle vão compilar por você.

Você não vai precisar digitar `javac` manualmente em projeto grande.

Mas isso não significa que `javac` deixou de existir.

Significa que Maven ou Gradle chamam ferramentas e organizam o build.

O fundamento continua:

```text
.java vira .class
.class roda na JVM
dependências entram no classpath
build organiza saída
```

Maven não substitui entendimento.

Maven automatiza um processo.

Quem entende o processo diagnostica melhor o Maven.

---

## Java e Docker

Mais tarde, uma aplicação Java pode rodar dentro de um container Docker.

Nesse caso, o container precisa ter um runtime compatível.

Exemplo conceitual:

```text
imagem com JDK ou JRE
aplicação .jar
comando java -jar app.jar
```

Se a imagem usa versão errada, pode falhar.

Se o `.jar` foi construído para uma versão mais nova do Java do que o runtime suporta, pode aparecer erro.

Então JDK/JRE/JVM também aparecem em Docker.

Não é só assunto local.

---

## Java e produção

Em produção, o programa Java roda em uma JVM.

Essa JVM tem memória, garbage collector, threads, configurações, métricas e logs.

Muito mais tarde, vamos estudar:

```text
heap;
GC;
thread dump;
heap dump;
JVM tuning;
virtual threads;
observabilidade.
```

Tudo isso nasce da mesma base:

```text
Java roda em uma JVM.
```

Hoje estamos aprendendo a porta de entrada.

Mais tarde, vamos entrar na sala inteira.

---

## Erros comuns

### Erro 1 — Achar que JRE basta para desenvolver

Para desenvolver, use JDK.

Se `java -version` funciona, mas `javac -version` não funciona, há um problema para desenvolvimento.

Correção:

```text
instalar/configurar JDK;
validar javac;
ajustar PATH quando necessário.
```

---

### Erro 2 — Confundir `java` e `javac`

Errado:

```text
java compila
javac executa
```

Correto:

```text
javac compila
java executa
```

Comandos:

```bash
javac Main.java
java Main
```

---

### Erro 3 — Executar com `.class`

Errado:

```bash
java Main.class
```

Correto:

```bash
java Main
```

---

### Erro 4 — Alterar `.java` e não recompilar

Se você muda `Main.java`, mas não roda:

```bash
javac Main.java
```

o `Main.class` continua antigo.

Então `java Main` pode mostrar comportamento antigo.

Regra:

```text
alterou .java no fluxo manual → compile de novo
```

---

### Erro 5 — Classe pública com nome diferente do arquivo

Arquivo:

```text
Main.java
```

Código errado:

```java
public class Programa {
}
```

Se a classe é `public`, o nome do arquivo precisa bater.

Correto:

```text
Programa.java
```

com:

```java
public class Programa {
}
```

ou:

```text
Main.java
```

com:

```java
public class Main {
}
```

---

### Erro 6 — `javac` não reconhecido

Mensagem possível:

```text
The term 'javac' is not recognized
```

Possíveis causas:

```text
JDK não instalado;
PATH não configurado;
terminal antigo;
JAVA_HOME errado;
instalação incompleta;
apenas runtime acessível.
```

Diagnóstico:

```powershell
java -version
javac -version
where java
where javac
echo $env:JAVA_HOME
```

---

### Erro 7 — `java` e `javac` em versões diferentes

Exemplo:

```text
java 21
javac 17
```

Isso indica ambiente inconsistente.

Investigue:

```powershell
where java
where javac
echo $env:JAVA_HOME
```

O ideal é manter a mesma versão principal.

---

### Erro 8 — `JAVA_HOME` apontando para `bin`

Errado:

```text
JAVA_HOME=C:\...\jdk-21\bin
```

Correto:

```text
JAVA_HOME=C:\...\jdk-21
```

O `PATH` é que deve encontrar:

```text
%JAVA_HOME%\bin
```

---

### Erro 9 — Rodar comando em terminal antigo

Depois de alterar variável de ambiente, feche e abra o PowerShell.

Terminal já aberto pode não enxergar mudança.

---

### Erro 10 — Colocar JDK dentro do projeto

Errado:

```text
formacao-java-backend
└── jdk-21
```

Correto:

```text
JDK instalado/configurado no ambiente;
projeto separado em C:\dev\projects.
```

Ferramenta não deve morar dentro do projeto.

---

## Diagnóstico quando Java não funcionar

Use esta ordem.

### 1. Ver se o terminal está funcionando

```powershell
pwd
ls
```

### 2. Ver runtime

```powershell
java -version
```

### 3. Ver compilador

```powershell
javac -version
```

### 4. Ver caminhos

```powershell
where java
where javac
```

### 5. Ver JAVA_HOME

```powershell
echo $env:JAVA_HOME
```

### 6. Ver se está na pasta do código

```powershell
ls
```

Procure:

```text
Main.java
```

### 7. Compilar

```bash
javac Main.java
```

### 8. Ver se gerou `.class`

```powershell
ls
```

Procure:

```text
Main.class
```

### 9. Executar

```bash
java Main
```

Não tente resolver no chute.

Siga evidências.

---

## Pequena prática recomendada

Esta prática é importante.

Crie:

```powershell
cd C:\dev\labs
mkdir jdk-jre-jvm
cd jdk-jre-jvm
```

Valide:

```powershell
java -version
javac -version
where java
where javac
echo $env:JAVA_HOME
```

Crie:

```powershell
New-Item Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("JDK, JRE e JVM fazem parte da plataforma Java.");
        System.out.println("javac compila. java executa.");
    }
}
```

Compile:

```bash
javac Main.java
```

Execute:

```bash
java Main
```

Depois altere a mensagem no `.java`.

Execute direto:

```bash
java Main
```

Veja que pode aparecer a mensagem antiga.

Agora compile de novo:

```bash
javac Main.java
java Main
```

Esse pequeno teste ensina que alterar fonte não altera automaticamente o bytecode no fluxo manual.

---

## Registro no diário de bordo

Registre:

```markdown
# Aula 005 — JDK, JRE, JVM e versão LTS

## O que aprendi
Aprendi que Java é linguagem e também plataforma, e que o JDK é necessário para desenvolver.

## Frase principal
javac compila.
java executa.
JVM executa bytecode.

## Validação do ambiente
java -version:
javac -version:
where java:
where javac:
JAVA_HOME:

## Diferenças
JVM:
JRE:
JDK:

## Erros que quero evitar
- confundir java e javac;
- executar java Main.class;
- alterar .java e não recompilar;
- deixar JAVA_HOME apontando para bin;
- usar versões diferentes de java e javac.

## Dúvidas
-
```

Esse registro será útil quando começarmos a compilar manualmente com mais profundidade.

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é JVM;
explicar o que é JRE;
explicar o que é JDK;
explicar por que desenvolvedor usa JDK;
explicar o que é bytecode;
diferenciar .java e .class;
usar java -version;
usar javac -version;
usar where java;
usar where javac;
verificar JAVA_HOME;
entender por que JAVA_HOME não aponta para bin;
compilar Main.java com javac;
executar Main com java;
entender por que java Main.class está errado;
entender por que usar versão LTS;
entender por que JDK 21 LTS é o padrão da formação;
relacionar Java local com IDE, Maven, Docker e produção.
```

Não precisa saber tudo sobre JVM ainda.

Mais tarde vamos aprofundar internals, memória, GC e performance.

Agora o necessário é entender a plataforma e validar o ambiente.

---

## Fechamento da aula

Java não começa no Spring.

Java começa na plataforma.

Antes de controller, repository, API, banco e mensageria, existe:

```text
JDK
javac
.java
.class
JVM
java
```

Esse fluxo é simples, mas poderoso.

Quando ele fica claro, o resto da formação ganha chão.

Na próxima aula, vamos aprofundar a compilação manual com `javac`.

Vamos olhar melhor para:

```text
arquivo .java;
arquivo .class;
compilação;
execução;
erros de compilação;
erros de execução;
noção inicial de classpath.
```

A partir daí, Java deixa de ser botão de IDE e começa a virar entendimento real.
