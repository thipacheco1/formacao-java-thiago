# 062 — M2.01 — JVM, Bytecode e Execução por Baixo

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M2.01.01` — JVM, bytecode e execução por baixo — Conceito profundo e quando usar.
- `M2.01.02` — JVM, bytecode e execução por baixo — Implementação guiada com código realista.
- `M2.01.03` — JVM, bytecode e execução por baixo — Refatoração, melhoria e leitura crítica.
- `M2.01.04` — JVM, bytecode e execução por baixo — Exercício solo, perguntas e critério de aprovação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar compilação, bytecode, JVM, execução por baixo, interpretação conceitual, JIT conceitual, classloader básico, portabilidade, `javac`, `java`, `.java`, `.class`, leitura com `javap`, erros comuns de execução, diagnóstico e relação com desenvolvimento backend Java.

---

## Onde estamos na formação

Estamos iniciando o Módulo 2.

O Módulo 1 fechou com:

```text
061 — M1.41 — Mini projeto Calculadora Profissional Console.
```

Esse mini projeto consolidou:

```text
variáveis;
tipos;
if;
switch;
laços;
arrays;
métodos;
parâmetros;
retorno;
escopo;
entrada segura;
tratamento inicial de erro;
debug;
documentação.
```

Agora entramos em uma camada mais profunda.

No Módulo 1, o foco foi:

```text
escrever Java e fazer funcionar.
```

No Módulo 2, o foco começa a ser:

```text
entender o que acontece por baixo quando Java funciona.
```

A primeira pergunta do módulo é:

```text
quando eu escrevo um arquivo .java e executo, o que realmente acontece?
```

A resposta passa por:

```text
javac;
bytecode;
arquivo .class;
JVM;
classloader;
interpretação;
JIT;
portabilidade.
```

Essa aula é importante porque backend Java não é só escrever código.

Um backend profissional precisa entender minimamente:

```text
como o código é compilado;
por que Java roda em ambientes diferentes;
por que existe JVM;
por que erro de compilação é diferente de erro de execução;
por que um .class pode rodar sem o .java;
por que versão de Java importa;
por que classpath importa;
por que uma aplicação Spring sobe dentro de uma JVM.
```

Hoje vamos abrir essa caixa.

---

## A pergunta central da aula

Quando escrevemos:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, JVM");
    }
}
```

e executamos:

```powershell
javac Main.java
java Main
```

o que acontece?

Resposta curta:

```text
o javac compila o arquivo .java e gera bytecode em um arquivo .class;
o comando java inicia a JVM;
a JVM carrega a classe;
a JVM encontra o método main;
a JVM executa o bytecode.
```

Resposta mais profissional:

```text
código-fonte Java não é executado diretamente;
ele é compilado para bytecode;
bytecode é uma representação intermediária;
a JVM entende bytecode;
a JVM carrega classes quando necessário;
a execução pode começar interpretada;
partes muito usadas podem ser otimizadas por JIT;
isso permite portabilidade e otimização em tempo de execução.
```

Essa aula vai explicar isso com calma.

---

## O que é código-fonte

Código-fonte é o arquivo que nós escrevemos.

Exemplo:

```text
Main.java
```

Dentro dele:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

Esse arquivo é texto.

Ele é legível para seres humanos.

Mas o processador não executa esse texto diretamente.

Antes, precisamos transformar o código-fonte em algo que a plataforma Java consiga executar.

Essa transformação inicial é feita pelo compilador:

```text
javac.
```

---

## O que é javac

`javac` é o compilador Java.

Ele recebe arquivos `.java`.

Exemplo:

```powershell
javac Main.java
```

E gera arquivos `.class`.

Exemplo:

```text
Main.class
```

O arquivo `.class` contém bytecode.

O `javac` também verifica erros de compilação.

Exemplos de erro de compilação:

```text
ponto e vírgula faltando;
variável não declarada;
tipo incompatível;
método inexistente;
classe pública com nome diferente do arquivo;
chaves incorretas.
```

Se o código não compila, não existe `.class` válido.

---

## O que é bytecode

Bytecode é uma representação intermediária do programa Java.

Ele não é o código Java original.

Também não é código nativo direto do Windows, Linux ou macOS.

Ele é um formato que a JVM entende.

Exemplo de fluxo:

```text
Main.java  --javac-->  Main.class
código-fonte           bytecode
```

O bytecode fica no arquivo `.class`.

A JVM lê esse bytecode e executa.

Por isso Java tem a famosa ideia:

```text
escreva uma vez, execute em qualquer lugar.
```

Com uma observação importante:

```text
execute em qualquer lugar que tenha uma JVM compatível.
```

---

## O que é JVM

JVM significa:

```text
Java Virtual Machine.
```

Em português:

```text
Máquina Virtual Java.
```

A JVM é o ambiente que executa bytecode Java.

Quando você roda:

```powershell
java Main
```

você não está executando diretamente o `.java`.

Você está pedindo para a JVM carregar e executar a classe `Main`.

A JVM faz várias coisas:

```text
carrega classes;
verifica bytecode;
gerencia memória;
executa instruções;
controla stack;
controla heap;
faz coleta de lixo;
trata exceções;
executa threads;
otimiza código com JIT.
```

Nesta aula, vamos focar em:

```text
carregar classe;
executar bytecode;
portabilidade;
interpretação;
JIT conceitual.
```

Memória será aprofundada na próxima aula.

---

## O que é JRE

JRE significa:

```text
Java Runtime Environment.
```

É o ambiente necessário para executar aplicações Java.

Ele inclui a JVM e bibliotecas necessárias para execução.

Se você quer apenas rodar um programa Java, precisa de ambiente de runtime.

Hoje, com distribuições modernas do Java, a separação entre JDK e JRE aparece de forma diferente dependendo da distribuição, mas o conceito continua importante:

```text
JRE -> ambiente de execução.
```

---

## O que é JDK

JDK significa:

```text
Java Development Kit.
```

É o kit de desenvolvimento Java.

Ele inclui ferramentas para desenvolver.

Exemplos:

```text
javac;
java;
javap;
jar;
javadoc;
jshell;
ferramentas de diagnóstico.
```

Para programar Java, usamos JDK.

Para compilar:

```powershell
javac
```

Para executar:

```powershell
java
```

Para inspecionar bytecode de forma simples:

```powershell
javap
```

Nesta aula, vamos usar os três:

```text
javac;
java;
javap.
```

---

## Vocabulário essencial

Termos desta aula:

```text
JDK;
JRE;
JVM;
javac;
java;
javap;
código-fonte;
arquivo .java;
classe;
arquivo .class;
bytecode;
compilação;
execução;
classloader;
carregamento de classe;
método main;
interpretação;
JIT;
Just-In-Time;
portabilidade;
classpath;
erro de compilação;
erro de execução;
versão do Java;
LTS;
runtime;
build;
artefato.
```

Termos mais importantes:

```text
.java -> arquivo de código-fonte escrito pelo programador;
javac -> compilador que transforma .java em .class;
.class -> arquivo compilado contendo bytecode;
bytecode -> instruções intermediárias entendidas pela JVM;
java -> comando que inicia a JVM para executar uma classe;
JVM -> máquina virtual que executa bytecode;
classloader -> mecanismo que carrega classes para dentro da JVM;
JIT -> compilação/otimização em tempo de execução para trechos muito usados;
portabilidade -> capacidade de rodar o mesmo bytecode em diferentes ambientes com JVM compatível.
```

---

## Fluxo completo inicial

Fluxo básico:

```text
1. Escrever código Java
   Main.java

2. Compilar com javac
   javac Main.java

3. Gerar bytecode
   Main.class

4. Executar com java
   java Main

5. JVM carrega Main
   classloader

6. JVM encontra main
   public static void main(String[] args)

7. JVM executa o bytecode
   saída no console
```

Visual:

```text
Main.java
   |
   | javac
   v
Main.class
   |
   | java Main
   v
JVM
   |
   | carrega, verifica e executa
   v
Programa em execução
```

---

## Primeiro exemplo mínimo digitado do zero

Crie a pasta:

```powershell
mkdir labs\m2\aula-062-jvm-bytecode-execucao
cd labs\m2\aula-062-jvm-bytecode-execucao
```

Crie o arquivo:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, JVM");
    }
}
```

Compile:

```powershell
javac Main.java
```

Liste os arquivos:

```powershell
dir
```

Você deve ver:

```text
Main.java
Main.class
```

Execute:

```powershell
java Main
```

Saída esperada:

```text
Olá, JVM
```

Agora observe:

```text
você escreveu Main.java;
javac gerou Main.class;
java executou a classe Main;
a JVM executou o bytecode.
```

---

## Por que executar java Main e não java Main.java

Quando fazemos:

```powershell
javac Main.java
```

o compilador gera:

```text
Main.class
```

Quando fazemos:

```powershell
java Main
```

estamos dizendo:

```text
JVM, carregue a classe Main e execute o método main.
```

Não escrevemos:

```powershell
java Main.class
```

E também não escrevemos, neste fluxo tradicional:

```powershell
java Main.java
```

O comando clássico de execução usa o nome da classe:

```powershell
java Main
```

Sem `.class`.

Observação: versões modernas do Java permitem executar arquivos `.java` diretamente em alguns cenários simples, mas para entender compilação e bytecode, nesta aula vamos usar o fluxo explícito:

```powershell
javac Main.java
java Main
```

Esse fluxo mostra o que acontece por baixo.

---

## Arquivo .class não é texto comum

Depois de compilar, tente abrir:

```text
Main.class
```

em um editor de texto.

Você verá caracteres estranhos.

Isso acontece porque `.class` não é código-fonte.

Ele contém bytecode e metadados em formato binário.

Não edite `.class` manualmente.

O caminho correto é:

```text
editar .java;
compilar de novo;
executar .class gerado.
```

---

## Usando javap para ver bytecode

O JDK traz uma ferramenta chamada:

```text
javap
```

Ela permite inspecionar classes compiladas.

Execute:

```powershell
javap Main
```

Saída aproximada:

```text
Compiled from "Main.java"
public class Main {
  public Main();
  public static void main(java.lang.String[]);
}
```

Agora execute:

```powershell
javap -c Main
```

O `-c` mostra instruções de bytecode.

Saída aproximada:

```text
public static void main(java.lang.String[]);
  Code:
     0: getstatic     #7
     3: ldc           #13
     5: invokevirtual #15
     8: return
```

Não precisa decorar essas instruções agora.

O objetivo é perceber:

```text
o Java fonte virou instruções intermediárias.
```

---

## O que significa javap -c

`javap -c` desmonta o bytecode de uma classe em uma forma legível.

Ele não volta exatamente para o código Java original.

Ele mostra as instruções que a JVM entende.

Exemplo conceitual:

```java
System.out.println("Olá, JVM");
```

pode aparecer como instruções que significam:

```text
pegue o System.out;
carregue a String "Olá, JVM";
chame println;
retorne.
```

Isso mostra que o `.class` tem instruções.

Não é mágica.

---

## Exemplo com cálculo

Crie:

```text
CalculadoraBytecode.java
```

Código:

```java
public class CalculadoraBytecode {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 20;

        int resultado = somar(primeiro, segundo);

        System.out.println("Resultado: " + resultado);
    }

    public static int somar(int primeiro, int segundo) {
        return primeiro + segundo;
    }
}
```

Compile:

```powershell
javac CalculadoraBytecode.java
```

Execute:

```powershell
java CalculadoraBytecode
```

Inspecione:

```powershell
javap -c CalculadoraBytecode
```

Procure no resultado:

```text
main;
somar;
instruções de chamada;
instruções de retorno.
```

Você não precisa dominar cada instrução.

Mas precisa entender:

```text
o método somar também virou bytecode.
```

---

## O que é método main por baixo

Quando executamos:

```powershell
java Main
```

a JVM procura um método com assinatura compatível com:

```java
public static void main(String[] args)
```

Esse método é o ponto de entrada.

Se não existir, a execução falha.

Exemplo errado:

```java
public class SemMain {
    public static void iniciar(String[] args) {
        System.out.println("Não é main");
    }
}
```

Compila?

Sim, pode compilar.

Mas ao executar:

```powershell
java SemMain
```

a JVM não encontra o `main` esperado.

Resultado:

```text
erro de execução indicando que o método main não foi encontrado.
```

Isso mostra diferença entre:

```text
compilar;
executar.
```

---

## Erro de compilação versus erro de execução

### Erro de compilação

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá")
    }
}
```

Falta ponto e vírgula.

Ao rodar:

```powershell
javac Main.java
```

dá erro.

Não gera `.class` válido.

---

### Erro de execução

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        int resultado = 10 / 0;

        System.out.println(resultado);
    }
}
```

Esse código compila.

Mas ao rodar:

```powershell
java Main
```

quebra em execução com erro aritmético.

Resumo:

```text
erro de compilação -> problema antes de gerar bytecode;
erro de execução -> problema enquanto a JVM executa o bytecode.
```

---

## Exemplo de erro de compilação

Arquivo:

```text
ErroCompilacao.java
```

Código propositalmente errado:

```java
public class ErroCompilacao {
    public static void main(String[] args) {
        System.out.println("Erro de compilação")
    }
}
```

Compile:

```powershell
javac ErroCompilacao.java
```

Observe o erro.

Depois corrija:

```java
System.out.println("Erro de compilação");
```

Objetivo:

```text
entender que javac impede bytecode inválido.
```

---

## Exemplo de erro de execução

Arquivo:

```text
ErroExecucao.java
```

Código:

```java
public class ErroExecucao {
    public static void main(String[] args) {
        int resultado = 10 / 0;

        System.out.println(resultado);
    }
}
```

Compile:

```powershell
javac ErroExecucao.java
```

O código compila.

Execute:

```powershell
java ErroExecucao
```

A JVM inicia, carrega a classe, entra no `main`, tenta executar a divisão e falha.

Objetivo:

```text
entender que nem todo erro aparece no javac.
```

---

## O que é classloader

Classloader é o mecanismo da JVM responsável por carregar classes.

Quando você roda:

```powershell
java Main
```

a JVM precisa encontrar e carregar a classe `Main`.

Isso envolve:

```text
localizar a classe;
ler o arquivo .class;
carregar a estrutura da classe na JVM;
permitir que o código seja executado.
```

Nesta fase, pense assim:

```text
classloader é quem encontra e carrega classes para a JVM.
```

Em aplicações backend, classloading fica mais complexo porque existem:

```text
muitas classes;
dependências;
bibliotecas;
frameworks;
JARs;
servidores;
plugins;
classpaths.
```

Mas o conceito inicial nasce aqui.

---

## Classloader básico em exemplo

Crie:

```text
Mensagem.java
```

Código:

```java
public class Mensagem {
    public static void exibir() {
        System.out.println("Mensagem carregada por outra classe.");
    }
}
```

Crie:

```text
ProgramaComDuasClasses.java
```

Código:

```java
public class ProgramaComDuasClasses {
    public static void main(String[] args) {
        Mensagem.exibir();
    }
}
```

Compile:

```powershell
javac ProgramaComDuasClasses.java
```

Observe que o `javac` também precisa da classe `Mensagem`.

Se os arquivos estiverem na mesma pasta, ele consegue compilar.

Execute:

```powershell
java ProgramaComDuasClasses
```

Saída:

```text
Mensagem carregada por outra classe.
```

Aqui a JVM carrega `ProgramaComDuasClasses` e também precisa carregar `Mensagem`.

Isso já mostra classloading de forma simples.

---

## Erro quando classe não é encontrada

Se você apagar ou mover:

```text
Mensagem.class
```

e tentar executar:

```powershell
java ProgramaComDuasClasses
```

pode aparecer erro de classe não encontrada.

Esse tipo de erro aparece em backend quando:

```text
dependência não está no classpath;
JAR não foi incluído;
versão errada está no runtime;
classe foi removida;
pacote está incorreto.
```

Nesta fase, o importante é entender:

```text
compilar e executar dependem de classes disponíveis.
```

---

## O que é classpath

Classpath é o caminho onde a JVM e as ferramentas Java procuram classes.

Quando estamos em uma pasta simples e rodamos:

```powershell
java Main
```

a JVM procura a classe no diretório atual.

Em projetos maiores, o classpath pode incluir:

```text
pastas de classes;
arquivos .jar;
dependências externas;
classes geradas pelo build.
```

No futuro, Maven e Gradle ajudam a montar isso.

Em Spring Boot, muita coisa é empacotada para facilitar execução.

Mas por baixo, a JVM ainda precisa encontrar classes.

---

## O que é portabilidade

Portabilidade é a capacidade de o mesmo programa rodar em ambientes diferentes.

No Java, a ideia é:

```text
o bytecode é o mesmo;
cada sistema operacional tem sua JVM;
a JVM daquele ambiente executa o bytecode.
```

Visual:

```text
Main.class
   |
   +--> JVM no Windows
   +--> JVM no Linux
   +--> JVM no macOS
```

O programador escreve Java.

O `javac` gera bytecode.

A JVM de cada ambiente executa.

Por isso Java ficou muito forte em backend corporativo.

Ambientes diferentes podem executar a mesma aplicação, desde que tenham uma JVM compatível.

---

## Trade-off da portabilidade

Portabilidade tem vantagens:

```text
mesmo bytecode para vários ambientes;
ecossistema maduro;
isolamento da plataforma;
ferramentas robustas;
runtime poderoso;
muito usado em servidores.
```

Mas também existem trade-offs:

```text
precisa de JVM instalada ou empacotada;
há consumo de memória do runtime;
inicialização pode ter custo;
versão da JVM importa;
configuração de heap e GC pode importar;
comportamentos de performance podem depender do runtime.
```

Backend profissional precisa saber que Java não é apenas linguagem.

É uma plataforma.

---

## Interpretação conceitual

No início da execução, a JVM pode interpretar bytecode.

Interpretação significa executar instruções intermediárias uma a uma por meio da máquina virtual.

Pense assim:

```text
a JVM lê instruções do bytecode e executa.
```

Isso é diferente de compilar tudo diretamente para código nativo antes de rodar.

Mas a JVM moderna não fica apenas interpretando de forma simples.

Ela também pode otimizar trechos muito usados.

É aí que entra o JIT.

---

## O que é JIT conceitualmente

JIT significa:

```text
Just-In-Time.
```

Em português:

```text
compilação em tempo de execução.
```

A JVM observa o código rodando.

Trechos muito executados podem ser compilados/otimizados para código nativo durante a execução.

Exemplo conceitual:

```text
um método chamado milhares de vezes pode ser otimizado;
um loop muito quente pode receber otimizações;
a JVM aprende com a execução real.
```

Nesta aula, não vamos entrar em detalhes de compilador JIT.

O objetivo é entender a ideia:

```text
Java não é simplesmente interpretado o tempo todo;
a JVM moderna pode otimizar código durante a execução.
```

---

## Por que JIT importa

JIT importa porque explica uma parte da performance do Java.

Java começa com bytecode portável.

A JVM executa.

Durante a execução, pode otimizar trechos importantes.

Isso permite equilibrar:

```text
portabilidade;
segurança;
observação em runtime;
otimização dinâmica;
performance alta em aplicações longas.
```

Em backend, aplicações geralmente ficam rodando por muito tempo.

Isso combina bem com otimizações em runtime.

Exemplo:

```text
API sobe;
recebe tráfego;
métodos mais chamados ficam quentes;
JVM pode otimizar trechos;
aplicação estabiliza.
```

Esse é um dos motivos de Java ser forte em servidores.

---

## O que é código quente

Código quente é código executado muitas vezes.

Exemplos em backend:

```text
método de validação chamado em toda requisição;
serialização de resposta;
mapeamento de entidade;
consulta repetida;
regra de preço;
cálculo de permissão;
filtro de autenticação.
```

A JVM pode identificar trechos muito usados.

JIT pode otimizar.

Esse assunto será aprofundado no futuro.

Por enquanto, guarde:

```text
código muito executado pode ser tratado de forma especial pela JVM.
```

---

## Exemplo conceitual de código quente

Crie:

```text
LoopQuente.java
```

Código:

```java
public class LoopQuente {
    public static void main(String[] args) {
        long soma = 0L;

        for (int indice = 0; indice < 10_000_000; indice++) {
            soma += indice;
        }

        System.out.println("Soma: " + soma);
    }
}
```

Compile:

```powershell
javac LoopQuente.java
```

Execute:

```powershell
java LoopQuente
```

Não vamos medir JIT profissionalmente agora.

Mas esse exemplo serve para entender a ideia de trecho repetido muitas vezes.

No futuro, veremos benchmark corretamente.

Atenção:

```text
não use System.currentTimeMillis e conclusões rápidas para benchmark profissional.
```

Performance em JVM exige cuidado.

---

## Relação com Spring Boot

Quando você roda uma aplicação Spring Boot, também há JVM.

Mesmo que o comando seja diferente, por baixo existe:

```text
bytecode;
classes;
JVM;
classloader;
memória;
threads;
GC;
JIT.
```

Exemplo comum:

```powershell
java -jar minha-api.jar
```

Nesse caso:

```text
java inicia a JVM;
JVM carrega o JAR;
classes são carregadas;
Spring inicializa contexto;
servidor embutido sobe;
aplicação começa a responder requisições.
```

Então entender `java Main` ajuda a entender `java -jar app.jar`.

A escala muda.

O princípio continua.

---

## O que é JAR

JAR significa:

```text
Java ARchive.
```

É um arquivo que empacota classes e recursos.

Um JAR pode conter:

```text
arquivos .class;
metadados;
manifest;
recursos;
configurações;
dependências em alguns formatos.
```

Nesta aula, não vamos criar JAR ainda.

Mas é importante saber:

```text
um JAR é uma forma de empacotar bytecode e recursos para distribuição.
```

No futuro, Maven e Spring Boot vão gerar JARs.

---

## Refatoração mental: do código para a plataforma

Antes, quando algo dava errado, você pensava:

```text
meu if está errado;
meu for está errado;
meu array está errado.
```

Agora você começa a pensar também:

```text
o código compilou?
o .class foi gerado?
estou executando a classe certa?
o main existe?
a JVM está usando qual versão?
a classe dependente está disponível?
estou no diretório certo?
o classpath está correto?
```

Esse raciocínio é essencial em ambiente profissional.

Muitos problemas não estão na regra de negócio.

Estão em:

```text
build;
runtime;
versão;
classpath;
empacotamento;
ambiente.
```

---

## Exemplo de classe pública e nome do arquivo

Em Java, uma classe pública precisa ter o mesmo nome do arquivo.

Arquivo:

```text
OutroNome.java
```

Código errado:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Erro");
    }
}
```

Compile:

```powershell
javac OutroNome.java
```

O Java reclama porque a classe pública `Main` deveria estar em:

```text
Main.java
```

Regra:

```text
classe pública -> nome do arquivo igual ao nome da classe.
```

Isso é básico, mas causa erro em iniciantes.

---

## Exemplo de executar classe errada

Crie:

```text
ProgramaA.java
```

Código:

```java
public class ProgramaA {
    public static void main(String[] args) {
        System.out.println("Programa A");
    }
}
```

Crie:

```text
ProgramaB.java
```

Código:

```java
public class ProgramaB {
    public static void main(String[] args) {
        System.out.println("Programa B");
    }
}
```

Compile:

```powershell
javac ProgramaA.java ProgramaB.java
```

Execute:

```powershell
java ProgramaA
```

Saída:

```text
Programa A
```

Execute:

```powershell
java ProgramaB
```

Saída:

```text
Programa B
```

A JVM executa a classe que você informa.

Se executar a classe errada, verá comportamento diferente.

Isso também acontece em projetos maiores quando configuração aponta para main class errada.

---

## Exemplo de recompilação esquecida

Crie:

```text
Recompilacao.java
```

Código:

```java
public class Recompilacao {
    public static void main(String[] args) {
        System.out.println("Versão 1");
    }
}
```

Compile:

```powershell
javac Recompilacao.java
```

Execute:

```powershell
java Recompilacao
```

Agora altere o `.java`:

```java
System.out.println("Versão 2");
```

Execute direto:

```powershell
java Recompilacao
```

Se você não recompilou, pode continuar vendo:

```text
Versão 1
```

Correção:

```powershell
javac Recompilacao.java
java Recompilacao
```

Esse erro é comum:

```text
alterei o .java, mas executei .class antigo.
```

IDE normalmente recompila automaticamente, mas no terminal você precisa saber o fluxo.

---

## Diagnóstico de execução no terminal

Quando algo não funcionar, faça perguntas.

### 1. Estou na pasta certa?

Comando:

```powershell
dir
```

Veja se o `.java` está ali.

### 2. Compilei?

Comando:

```powershell
javac Main.java
```

### 3. O `.class` foi gerado?

Comando:

```powershell
dir
```

Procure:

```text
Main.class
```

### 4. Executei com o nome da classe?

Correto:

```powershell
java Main
```

Não:

```powershell
java Main.class
```

### 5. A classe tem main?

Procure:

```java
public static void main(String[] args)
```

### 6. Alterei o código e esqueci de recompilar?

Compile novamente.

### 7. A versão do Java está correta?

Comandos:

```powershell
java -version
javac -version
```

### 8. O nome do arquivo bate com classe pública?

```text
Main.java -> public class Main
```

### 9. Tem dependência de outra classe?

Compile todas as classes necessárias.

### 10. O erro é de compilação ou execução?

Leia onde aconteceu:

```text
javac -> compilação;
java -> execução.
```

---

## Erros comuns

### Erro 1 — Achar que o .java é executado diretamente no fluxo clássico

Fluxo correto desta aula:

```text
.java -> javac -> .class -> java -> JVM.
```

---

### Erro 2 — Executar com extensão .class

Errado:

```powershell
java Main.class
```

Correto:

```powershell
java Main
```

---

### Erro 3 — Alterar .java e não recompilar

Depois de alterar código, rode:

```powershell
javac Main.java
```

---

### Erro 4 — Classe pública com nome diferente do arquivo

Arquivo e classe pública precisam combinar.

---

### Erro 5 — Não diferenciar erro de compilação e execução

Erro no `javac` é uma coisa.

Erro no `java` é outra.

---

### Erro 6 — Não entender por que .class existe

`.class` contém bytecode.

A JVM executa bytecode.

---

### Erro 7 — Achar que bytecode é código nativo do Windows

Bytecode é portável e entendido pela JVM.

---

### Erro 8 — Achar que Java é só interpretado

A JVM moderna pode usar JIT para otimizar trechos durante execução.

---

### Erro 9 — Esquecer que versão de Java importa

Código compilado para uma versão pode não rodar em runtime mais antigo.

---

### Erro 10 — Ignorar classpath

Em projetos com múltiplas classes e dependências, a JVM precisa encontrar todas as classes necessárias.

---

## Diagnóstico com javap

Use `javap` quando quiser confirmar que a classe compilada existe e tem métodos esperados.

Exemplo:

```powershell
javap Main
```

Veja se aparece:

```text
public static void main(java.lang.String[]);
```

Use:

```powershell
javap -c Main
```

para ver bytecode.

Não é para decorar.

É para confirmar:

```text
o .class existe;
a classe foi compilada;
métodos estão lá;
existe bytecode.
```

---

## Quebrando de propósito

Faça estes testes.

### Teste 1 — Executar sem compilar

Apague o `.class`:

```powershell
del Main.class
```

Tente:

```powershell
java Main
```

Observe o erro.

Depois compile:

```powershell
javac Main.java
java Main
```

---

### Teste 2 — Executar com .class

Tente:

```powershell
java Main.class
```

Observe o erro.

Depois corrija:

```powershell
java Main
```

---

### Teste 3 — Classe pública com arquivo errado

Crie arquivo `Teste.java` com:

```java
public class Outro {
    public static void main(String[] args) {
        System.out.println("Teste");
    }
}
```

Compile:

```powershell
javac Teste.java
```

Observe o erro.

---

### Teste 4 — Main inexistente

Crie:

```java
public class SemMain {
    public static void iniciar(String[] args) {
        System.out.println("Sem main");
    }
}
```

Compile:

```powershell
javac SemMain.java
```

Execute:

```powershell
java SemMain
```

Observe que compilar é diferente de executar.

---

### Teste 5 — Esquecer de recompilar

Compile versão 1.

Altere para versão 2.

Execute sem compilar.

Observe que a saída pode continuar antiga.

Depois recompile.

---

## Prática recomendada

Crie a pasta:

```powershell
mkdir labs\m2\aula-062-jvm-bytecode-execucao
cd labs\m2\aula-062-jvm-bytecode-execucao
```

Crie arquivos:

```text
Main.java
CalculadoraBytecode.java
ErroCompilacao.java
ErroExecucao.java
Mensagem.java
ProgramaComDuasClasses.java
LoopQuente.java
ProgramaA.java
ProgramaB.java
Recompilacao.java
SemMain.java
README.md
```

Compile os arquivos válidos:

```powershell
javac Main.java
javac CalculadoraBytecode.java
javac ErroExecucao.java
javac ProgramaComDuasClasses.java
javac LoopQuente.java
javac ProgramaA.java ProgramaB.java
javac Recompilacao.java
javac SemMain.java
```

Execute:

```powershell
java Main
java CalculadoraBytecode
java ErroExecucao
java ProgramaComDuasClasses
java LoopQuente
java ProgramaA
java ProgramaB
java Recompilacao
java SemMain
```

Alguns arquivos devem demonstrar erro de propósito.

Inspecione bytecode:

```powershell
javap Main
javap -c Main
javap CalculadoraBytecode
javap -c CalculadoraBytecode
```

Verifique versões:

```powershell
java -version
javac -version
```

---

## README recomendado da aula

Crie:

```text
README.md
```

Conteúdo sugerido:

```markdown
# Aula 062 — JVM, bytecode e execução por baixo

## Objetivo

Entender o fluxo básico de execução Java:

```text
.java -> javac -> .class -> JVM -> execução
```

## Conceitos

- Código-fonte fica em arquivo `.java`.
- `javac` compila `.java` para `.class`.
- `.class` contém bytecode.
- JVM executa bytecode.
- `java NomeDaClasse` inicia a execução.
- A JVM procura `public static void main(String[] args)`.
- `javap` permite inspecionar classes compiladas.
- Classloader carrega classes para a JVM.
- JIT pode otimizar trechos durante a execução.
- Bytecode permite portabilidade entre ambientes com JVM compatível.

## Comandos usados

```powershell
javac Main.java
java Main
javap Main
javap -c Main
java -version
javac -version
```

## Observações

- Não executar com `.class` no comando `java`.
- Recompilar depois de alterar `.java`.
- Diferenciar erro de compilação de erro de execução.
```

---

## Atalhos úteis nesta aula

| Ação | Comando / Atalho | Uso |
|---|---|---|
| Abrir terminal IntelliJ | `Alt + F12` | Compilar e executar |
| Reformatar código | `Ctrl + Alt + L` | Organizar arquivos |
| Rodar no IntelliJ | `Shift + F10` | Executar pela IDE |
| Debug | `Shift + F9` | Ver execução |
| Buscar ação | `Ctrl + Shift + A` | Encontrar comandos |
| Compilar terminal | `javac Main.java` | Gerar `.class` |
| Executar terminal | `java Main` | Rodar na JVM |
| Inspecionar classe | `javap Main` | Ver estrutura compilada |
| Inspecionar bytecode | `javap -c Main` | Ver instruções |
| Ver versão | `java -version` | Runtime |
| Ver compilador | `javac -version` | Compilador |

Se algum atalho variar, procure pelo nome da ação no IntelliJ.

---

## Debug recomendado

Mesmo sendo uma aula sobre JVM e bytecode, use debug em:

```java
public class CalculadoraBytecode {
    public static void main(String[] args) {
        int primeiro = 10;
        int segundo = 20;

        int resultado = somar(primeiro, segundo);

        System.out.println("Resultado: " + resultado);
    }

    public static int somar(int primeiro, int segundo) {
        return primeiro + segundo;
    }
}
```

Coloque breakpoint em:

```java
int resultado = somar(primeiro, segundo);
```

Use Step Into.

Observe:

```text
a JVM executa a classe;
o main inicia;
as variáveis são criadas;
o método somar é chamado;
o método retorna;
a execução continua.
```

Depois compare com:

```powershell
javap -c CalculadoraBytecode
```

Objetivo:

```text
ligar o código que você depura ao bytecode que foi gerado.
```

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 062 — JVM, bytecode e execução por baixo

### O que aprendi
Aprendi que o código Java escrito em `.java` é compilado pelo `javac` para `.class`, que contém bytecode. A JVM executa esse bytecode, carregando classes, encontrando o método `main` e executando as instruções.

### O que pratiquei
Criei arquivos `.java`, compilei com `javac`, executei com `java`, gerei `.class`, inspecionei classes com `javap`, visualizei bytecode com `javap -c`, provoquei erro de compilação, erro de execução, main inexistente e recompilação esquecida.

### Conceitos principais
- JDK
- JRE
- JVM
- `javac`
- `java`
- `javap`
- `.java`
- `.class`
- bytecode
- compilação
- execução
- método main
- classloader
- classpath
- interpretação conceitual
- JIT conceitual
- portabilidade
- erro de compilação
- erro de execução
- versão do Java

### Arquivos criados
- `labs/m2/aula-062-jvm-bytecode-execucao/Main.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/CalculadoraBytecode.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/ErroCompilacao.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/ErroExecucao.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/Mensagem.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/ProgramaComDuasClasses.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/LoopQuente.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/ProgramaA.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/ProgramaB.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/Recompilacao.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/SemMain.java`
- `labs/m2/aula-062-jvm-bytecode-execucao/README.md`

### Comandos usados
```powershell
javac Main.java
java Main
javap Main
javap -c Main
javac CalculadoraBytecode.java
java CalculadoraBytecode
javap -c CalculadoraBytecode
java -version
javac -version
```

### Erros que quero evitar
- achar que `.java` é executado diretamente no fluxo clássico;
- executar com `java Main.class`;
- alterar `.java` e esquecer de recompilar;
- usar classe pública com nome diferente do arquivo;
- confundir erro de compilação com erro de execução;
- ignorar o arquivo `.class`;
- achar que bytecode é código nativo do Windows;
- achar que Java é apenas interpretado;
- ignorar versão de Java;
- ignorar classpath.

### Próximo passo
Estudar stack, heap e referências.
```

---

## Commit recomendado

Valide:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m2/aula-062-jvm-bytecode-execucao docs/diario-de-bordo.md
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 062: pratica JVM bytecode e execucao por baixo"
```

Valide:

```bash
git status
```

Se `.class` aparecer, corrija `.gitignore`.

Arquivos `.class` normalmente não devem ser versionados.

---

## Perguntas de fixação

Responda no diário.

```text
1. O que é um arquivo `.java`?
2. O que o `javac` faz?
3. O que é um arquivo `.class`?
4. O que é bytecode?
5. O que a JVM executa?
6. Por que usamos `java Main` e não `java Main.class`?
7. Qual a diferença entre erro de compilação e erro de execução?
8. O que é o método `main` para a JVM?
9. O que é classloader em uma explicação inicial?
10. O que é classpath em uma explicação inicial?
11. O que significa portabilidade em Java?
12. O que é JIT conceitualmente?
13. Por que Java não é apenas interpretado?
14. Por que versão do Java importa?
15. Como `javap -c` ajuda no aprendizado?
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o fluxo .java -> .class -> JVM;
compilar com javac;
executar com java;
identificar arquivo .class;
explicar bytecode;
explicar JVM;
explicar JDK;
explicar JRE conceitualmente;
usar javap;
usar javap -c;
explicar método main como ponto de entrada;
diferenciar erro de compilação e erro de execução;
provocar erro de compilação;
provocar erro de execução;
explicar classloader básico;
explicar classpath básico;
explicar portabilidade;
explicar interpretação conceitual;
explicar JIT conceitual;
entender por que Java é forte em backend;
diagnosticar execução no terminal;
verificar java -version;
verificar javac -version;
registrar aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar bytecode em profundidade.

Não precisa ainda decorar instruções da JVM.

Não precisa ainda dominar classloader avançado.

Não precisa ainda dominar GC.

Não precisa ainda dominar JIT internals.

Não precisa ainda dominar empacotamento JAR.

Esses assuntos virão depois.

O objetivo é entender o caminho entre código-fonte Java e execução dentro da JVM.

---

## Fechamento da aula

Hoje iniciamos o Módulo 2 estudando JVM, bytecode e execução por baixo.

A ideia central foi:

```text
Java não executa diretamente o arquivo .java no fluxo clássico.
```

O fluxo principal é:

```text
.java -> javac -> .class -> JVM -> execução.
```

Vimos que:

```text
javac compila;
.class contém bytecode;
java inicia a JVM;
JVM carrega classes;
classloader encontra classes;
main é o ponto de entrada;
bytecode permite portabilidade;
JIT pode otimizar trechos em runtime.
```

O ponto mais importante é:

```text
Java é linguagem e plataforma; entender a JVM ajuda a entender backend de verdade.
```

Na próxima aula, vamos estudar:

```text
Stack, heap e referências.
```

A próxima aula vai aprofundar memória: onde ficam variáveis locais, onde ficam objetos, como referências apontam para objetos, o que é `null` e por que isso importa tanto em Java.
