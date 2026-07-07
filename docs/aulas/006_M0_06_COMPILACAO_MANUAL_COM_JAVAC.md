# 006 — M0.06 — Compilação Manual com `javac`

## Hoje a aula é sobre tirar a mágica da execução Java

Até agora, já ficou claro que Java não é apenas escrever código e apertar Run.

Existe um processo.

Você escreve um arquivo `.java`.

Depois esse arquivo precisa ser compilado.

A compilação gera um arquivo `.class`.

Depois a JVM executa esse `.class`.

O fluxo é:

```text
Main.java
↓
javac Main.java
↓
Main.class
↓
java Main
↓
programa executado pela JVM
```

Essa aula existe para fazer esse fluxo ficar natural.

Não é porque, no dia a dia profissional, você vai compilar tudo manualmente o tempo inteiro.

Em projetos reais, Maven, Gradle e a IDE fazem isso por você.

Mas, se você não entende o processo manual, fica refém da ferramenta.

Quando a IDE falha, você trava.

Quando o Maven dá erro, você não sabe separar causa.

Quando aparece `Could not find or load main class`, você tenta chutar.

Quando o classpath entra na história, parece bruxaria.

Então, antes de depender de ferramenta, vamos entender o mecanismo.

---

## O problema que a compilação resolve

O computador não executa código Java do jeito que você escreve.

Este código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java");
    }
}
```

é legível para humanos.

Mas a JVM não executa diretamente esse arquivo `.java` no fluxo tradicional.

Primeiro, o código-fonte precisa virar bytecode.

Quem faz essa transformação é o compilador Java:

```text
javac
```

Então o papel do `javac` é:

```text
ler código-fonte Java
validar sintaxe
validar regras básicas da linguagem
gerar bytecode em arquivo .class
```

Se o código estiver inválido, o `javac` não gera o `.class`.

Isso é importante.

Compilação é uma barreira de qualidade inicial.

Ela impede que certos erros cheguem à execução.

---

## O que acontece quando compila

Imagine este arquivo:

```text
Main.java
```

Com este conteúdo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Compilação manual com javac.");
    }
}
```

Quando você roda:

```bash
javac Main.java
```

o compilador tenta entender o código.

Ele verifica coisas como:

```text
existe classe pública?
o nome da classe pública combina com o arquivo?
a sintaxe está correta?
as chaves abrem e fecham?
os parênteses estão corretos?
os pontos e vírgulas necessários existem?
os tipos fazem sentido?
os métodos chamados existem?
```

Se tudo estiver correto, ele gera:

```text
Main.class
```

Esse arquivo `.class` contém bytecode.

O bytecode será executado pela JVM com:

```bash
java Main
```

---

## Compilar não é executar

Esse ponto precisa ficar muito claro.

Quando você roda:

```bash
javac Main.java
```

você não está executando a lógica do programa.

Você está apenas gerando o `.class`.

Se o código tem:

```java
System.out.println("Olá");
```

o texto não aparece durante a compilação.

Ele aparece durante a execução:

```bash
java Main
```

Então:

```text
javac Main.java  → compila
java Main        → executa
```

Se você confunde essas duas fases, fica difícil diagnosticar erro.

---

## Erro de compilação e erro de execução

Existem erros que aparecem antes do programa rodar.

E existem erros que aparecem enquanto o programa roda.

### Erro de compilação

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá")
    }
}
```

Faltou ponto e vírgula.

Ao rodar:

```bash
javac Main.java
```

o compilador reclama.

O programa nem chega a executar.

Isso é erro de compilação.

---

### Erro de execução

Agora imagine:

```java
public class Main {
    public static void main(String[] args) {
        int resultado = 10 / 0;
        System.out.println(resultado);
    }
}
```

Esse código pode compilar.

Mas ao executar:

```bash
java Main
```

vai falhar, porque divisão por zero em inteiro causa erro em tempo de execução.

Isso é erro de execução.

A diferença é fundamental:

```text
compilação valida se o código pode virar bytecode;
execução revela o comportamento do programa rodando.
```

---

## O arquivo `.java`

O arquivo `.java` é o código-fonte.

É o arquivo que o desenvolvedor escreve.

Exemplo:

```text
Main.java
```

Dentro dele:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Arquivo fonte Java.");
    }
}
```

O `.java` deve ir para o Git.

Ele representa o trabalho humano.

É nele que estão as decisões de código.

---

## O arquivo `.class`

O arquivo `.class` é gerado pelo compilador.

Exemplo:

```text
Main.class
```

Você não escreve esse arquivo manualmente.

Você não edita esse arquivo.

Você normalmente não versiona esse arquivo no Git.

Ele é resultado de build.

Se você apagar `Main.class`, pode recriar com:

```bash
javac Main.java
```

Essa diferença já ensina um princípio profissional:

```text
código-fonte deve ser preservado;
arquivo gerado deve poder ser recriado.
```

Por isso, mais tarde, `.class`, `out/` e `target/` entram no `.gitignore`.

---

## O método `main`

Para executar uma classe Java diretamente com:

```bash
java Main
```

a classe precisa ter um ponto de entrada.

Esse ponto de entrada é o método `main`.

Assinatura clássica:

```java
public static void main(String[] args)
```

Vamos quebrar isso, sem aprofundar tudo agora.

```text
public
```

Significa que a JVM consegue acessar esse método de fora da classe.

```text
static
```

Significa que a JVM pode chamar esse método sem criar um objeto da classe.

```text
void
```

Significa que o método não retorna valor.

```text
main
```

É o nome esperado como ponto de entrada.

```text
String[] args
```

Representa argumentos que podem ser passados pela linha de comando.

Neste momento, não precisa dominar todos os detalhes.

Mas precisa entender:

```text
sem main correto, a classe pode até compilar, mas não será executável diretamente com java NomeDaClasse.
```

---

## Exemplo mínimo digitado do zero

Vamos criar um laboratório limpo.

No PowerShell:

```powershell
cd C:\dev\labs
mkdir compilacao-manual
cd compilacao-manual
```

Confira onde está:

```powershell
pwd
```

Crie o arquivo:

```powershell
New-Item Main.java
```

Abra o arquivo em um editor e escreva:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Compilação manual com javac.");
    }
}
```

Agora liste:

```powershell
ls
```

Você deve ver:

```text
Main.java
```

Compile:

```bash
javac Main.java
```

Se não aparecer erro, liste novamente:

```powershell
ls
```

Agora deve aparecer:

```text
Main.java
Main.class
```

Execute:

```bash
java Main
```

Saída esperada:

```text
Compilação manual com javac.
```

Esse é o fluxo mínimo.

---

## O que cada comando fez

### `cd C:\dev\labs`

Levou o terminal até a pasta de laboratórios.

### `mkdir compilacao-manual`

Criou uma pasta só para esta aula.

### `cd compilacao-manual`

Entrou na pasta da aula.

### `New-Item Main.java`

Criou o arquivo fonte.

### `javac Main.java`

Compilou o código-fonte Java.

### `ls`

Mostrou que o `.class` foi gerado.

### `java Main`

Pediu para a JVM executar a classe `Main`.

Isso é simples, mas é a espinha dorsal de tudo que virá depois.

---

## Por que `java Main` não usa `.class`

Depois de compilar, o arquivo gerado é:

```text
Main.class
```

A tentação comum é executar assim:

```bash
java Main.class
```

Mas isso está errado.

O comando `java` espera o nome da classe, não o nome do arquivo `.class`.

Correto:

```bash
java Main
```

Pense assim:

```text
javac recebe arquivo fonte: Main.java
java recebe nome da classe: Main
```

Esse detalhe ajuda a entender classpath depois.

A JVM procura uma classe chamada `Main` em algum lugar.

Por enquanto, esse lugar é a pasta atual.

Mais tarde, esse “algum lugar” será explicado como classpath.

---

## Alterei o `.java`. Preciso compilar de novo?

Sim.

No fluxo manual, se você altera:

```text
Main.java
```

o arquivo:

```text
Main.class
```

não muda sozinho.

Faça o teste.

Altere o código para:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Mensagem alterada.");
    }
}
```

Agora, sem compilar, rode:

```bash
java Main
```

Pode aparecer a mensagem antiga.

Por quê?

Porque você executou o `.class` antigo.

Agora compile:

```bash
javac Main.java
```

E execute:

```bash
java Main
```

Agora aparece:

```text
Mensagem alterada.
```

Isso ensina uma regra:

```text
alterou fonte no fluxo manual, compile novamente.
```

A IDE geralmente faz isso por você.

Maven e Gradle também.

Mas manualmente, a responsabilidade é sua.

---

## Nome do arquivo e nome da classe pública

Em Java, se uma classe é `public`, o nome do arquivo precisa bater com o nome da classe.

Este arquivo:

```text
Main.java
```

deve conter:

```java
public class Main {
}
```

Se você escrever:

```java
public class Programa {
}
```

dentro de `Main.java`, o compilador reclama.

Por quê?

Porque uma classe pública é uma declaração importante para o compilador.

A regra é:

```text
classe pública Nome → arquivo Nome.java
```

Exemplos corretos:

```text
Cliente.java        → public class Cliente
OrdemServico.java   → public class OrdemServico
Calculadora.java    → public class Calculadora
```

Essa regra parecerá óbvia depois, mas no início gera muito erro.

---

## Compilação com mais de uma classe

Agora vamos dar um passo a mais.

Crie dois arquivos:

```powershell
New-Item Mensagem.java
New-Item Programa.java
```

Em `Mensagem.java`:

```java
public class Mensagem {
    public static String obterTexto() {
        return "Texto vindo de outra classe.";
    }
}
```

Em `Programa.java`:

```java
public class Programa {
    public static void main(String[] args) {
        System.out.println(Mensagem.obterTexto());
    }
}
```

Compile:

```bash
javac Programa.java
```

Liste:

```powershell
ls
```

Você provavelmente verá:

```text
Mensagem.class
Programa.class
Mensagem.java
Programa.java
```

Por que `Mensagem.class` apareceu se você compilou `Programa.java`?

Porque `Programa` depende de `Mensagem`.

O compilador percebeu essa dependência e compilou também o que era necessário.

Execute:

```bash
java Programa
```

Saída:

```text
Texto vindo de outra classe.
```

Isso é importante.

Projetos reais têm muitas classes.

Uma classe chama outra.

O compilador precisa resolver essas dependências.

---

## Compilando vários arquivos explicitamente

Também é possível compilar vários arquivos:

```bash
javac Mensagem.java Programa.java
```

Ou, no PowerShell, todos os `.java` da pasta:

```powershell
javac *.java
```

O `*.java` significa:

```text
todos os arquivos que terminam com .java
```

Isso é útil em laboratório pequeno.

Mas em projeto real, não vamos compilar assim manualmente.

Maven e Gradle assumem esse trabalho.

O importante é entender o princípio:

```text
vários .java podem gerar vários .class
```

---

## Primeira noção de classpath

A próxima aula vai aprofundar classpath.

Mas precisamos iniciar a ideia agora.

Quando você roda:

```bash
java Main
```

a JVM precisa encontrar a classe `Main`.

Por padrão, ela procura no local atual.

Ou seja:

```text
a pasta onde o terminal está
```

Se você está na pasta onde existe `Main.class`, funciona.

Se não está, pode aparecer:

```text
Error: Could not find or load main class Main
```

Isso não significa necessariamente que o código está errado.

Pode significar:

```text
você está na pasta errada;
o .class não foi gerado;
o nome da classe está errado;
o classpath não aponta para o local correto.
```

Por enquanto, guarde:

```text
java NomeDaClasse precisa encontrar NomeDaClasse.class.
```

---

## Exemplo aplicado ao domínio corporativo

Imagine um sistema corporativo com classes como:

```text
OrdemServico
Atividade
Cliente
Produto
Historico
Ocorrencia
AgendamentoService
```

Você não terá uma classe só.

Terá várias classes colaborando.

Mesmo que Spring Boot e Maven compilem tudo, a lógica básica continua:

```text
cada classe nasce em um .java;
a compilação gera .class;
as classes compiladas precisam ser encontradas na execução;
dependências precisam estar disponíveis.
```

Quando um projeto corporativo falha dizendo que uma classe não foi encontrada, isso pode ter relação com:

```text
classe não compilada;
dependência ausente;
pacote errado;
classpath errado;
jar não incluído;
versão incompatível;
build quebrado.
```

Entender o laboratório manual de hoje prepara a leitura desses erros mais complexos.

---

## Compilação e backend real

No backend real, você raramente entrega `.java` solto.

O fluxo profissional costuma ser:

```text
escrever código-fonte
rodar testes
compilar projeto
empacotar aplicação
gerar .jar ou imagem Docker
subir em ambiente
executar com java -jar ou container
```

Exemplo futuro:

```bash
mvn clean package
java -jar target/api.jar
```

Mas por trás disso ainda existe:

```text
.java → .class → execução na JVM
```

O Maven só organiza o processo.

O Docker só empacota ambiente.

O Spring só inicializa aplicação.

Nada disso elimina a base.

---

## Compilação e Git

Git deve guardar:

```text
Main.java
Mensagem.java
Programa.java
```

Git não deve guardar:

```text
Main.class
Mensagem.class
Programa.class
```

Por quê?

Porque `.class` é gerado.

Se o projeto tem código-fonte, qualquer pessoa com JDK pode gerar de novo.

Em `.gitignore`, é comum ter:

```gitignore
*.class
out/
target/
```

Isso evita poluir o repositório.

Profissional que versiona arquivo gerado cria ruído e conflito desnecessário.

---

## Compilação e IDE

Quando você usa IntelliJ e clica em Run, a IDE pode:

```text
compilar;
criar pasta de saída;
montar classpath;
executar a classe;
mostrar saída.
```

Ela faz muito trabalho por baixo.

Isso é ótimo.

Mas se você nunca compilou manualmente, pode achar que a IDE é o Java.

Não é.

A IDE é uma ferramenta em cima do Java.

O Java existe independentemente da IDE.

Essa consciência dá autonomia.

---

## Compilação e Maven

Maven vai padronizar o build.

Mais tarde, em vez de:

```bash
javac *.java
```

vamos usar:

```bash
mvn compile
```

Maven vai compilar os arquivos de:

```text
src/main/java
```

e colocar os `.class` em:

```text
target/classes
```

Perceba a semelhança:

```text
fonte separado de compilado
```

Hoje, em uma pasta pequena, fonte e compilado ficam juntos.

Mais tarde, organizaremos melhor.

---

## Erros comuns

### Erro 1 — Rodar `javac` na pasta errada

Comando:

```bash
javac Main.java
```

Erro possível:

```text
file not found: Main.java
```

Diagnóstico:

```powershell
pwd
ls
```

Se `Main.java` não aparece no `ls`, você está na pasta errada ou o arquivo não existe.

---

### Erro 2 — Esquecer ponto e vírgula

Código:

```java
System.out.println("Olá")
```

Erro na compilação.

Correção:

```java
System.out.println("Olá");
```

Esse erro é de compilação.

O programa nem roda.

---

### Erro 3 — Esquecer chave

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
}
```

Faltou fechar a classe.

Erro de compilação.

A leitura de chaves será treinada constantemente.

---

### Erro 4 — Nome da classe pública diferente do arquivo

Arquivo:

```text
Main.java
```

Código:

```java
public class Programa {
}
```

Erro de compilação.

Correção:

```text
Programa.java
```

ou:

```java
public class Main {
}
```

---

### Erro 5 — Executar com `.class`

Errado:

```bash
java Main.class
```

Correto:

```bash
java Main
```

---

### Erro 6 — Tentar executar sem compilar

Comando:

```bash
java Main
```

Erro possível:

```text
Could not find or load main class Main
```

Pode ser que `Main.class` não exista.

Diagnóstico:

```powershell
ls
```

Se não existe `.class`, compile:

```bash
javac Main.java
```

---

### Erro 7 — Alterar `.java` e executar `.class` antigo

Sintoma:

```text
mudei o código, mas a saída não mudou
```

Causa provável:

```text
não recompilou
```

Correção:

```bash
javac Main.java
java Main
```

---

### Erro 8 — Classe sem método `main`

Código:

```java
public class Main {
    public void executar() {
        System.out.println("Executando");
    }
}
```

Pode compilar.

Mas ao rodar:

```bash
java Main
```

vai falhar porque não há método `main` correto.

Para executar diretamente, precisa:

```java
public static void main(String[] args)
```

---

### Erro 9 — Digitar `Java` em vez de `java`

No Windows, pode até funcionar dependendo do ambiente, mas não crie esse hábito.

Use:

```bash
java
javac
```

Comandos em minúsculo.

Em ambientes Linux, caixa pode importar mais.

---

### Erro 10 — Achar que todo erro é culpa do Java

Muitos erros são de:

```text
pasta errada;
arquivo inexistente;
nome errado;
classe não compilada;
comando digitado errado;
ambiente mal configurado.
```

Antes de culpar a linguagem:

```powershell
pwd
ls
java -version
javac -version
```

---

## Diagnóstico guiado

Quando algo der errado, siga este roteiro.

### 1. Estou na pasta certa?

```powershell
pwd
```

### 2. O arquivo `.java` existe?

```powershell
ls
```

### 3. O compilador existe?

```powershell
javac -version
```

### 4. A compilação gera erro?

```bash
javac Main.java
```

Se gera erro, leia a mensagem.

### 5. O `.class` foi criado?

```powershell
ls
```

### 6. Estou executando pelo nome da classe?

```bash
java Main
```

Não use:

```bash
java Main.class
```

### 7. A classe tem `main` correto?

```java
public static void main(String[] args)
```

Esse roteiro resolve a maioria dos problemas iniciais.

---

## Pequena prática recomendada

Esta prática é relevante porque consolida o entendimento.

Crie laboratório:

```powershell
cd C:\dev\labs
mkdir compilacao-manual-javac
cd compilacao-manual-javac
```

Crie `Main.java`:

```powershell
New-Item Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Primeira compilação.");
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

Altere o texto para:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Segunda compilação.");
    }
}
```

Execute sem compilar:

```bash
java Main
```

Agora compile e execute:

```bash
javac Main.java
java Main
```

Depois crie `Mensagem.java`:

```java
public class Mensagem {
    public static String texto() {
        return "Mensagem vinda de outra classe.";
    }
}
```

Crie `Programa.java`:

```java
public class Programa {
    public static void main(String[] args) {
        System.out.println(Mensagem.texto());
    }
}
```

Compile:

```bash
javac Programa.java
```

Execute:

```bash
java Programa
```

Essa prática prova:

```text
compilação simples;
execução simples;
necessidade de recompilar;
compilação de dependência;
execução pelo nome da classe.
```

---

## Registro no diário de bordo

Registre:

```markdown
# Aula 006 — Compilação manual com javac

## O que aprendi
Aprendi que o arquivo .java é código-fonte, o javac gera .class e o java executa a classe na JVM.

## Fluxo principal
.java -> javac -> .class -> java -> execução

## Comandos praticados
javac Main.java
java Main
javac Programa.java
java Programa

## Erros que quero evitar
- rodar comando na pasta errada;
- executar java Main.class;
- esquecer de recompilar depois de alterar .java;
- deixar nome da classe pública diferente do arquivo;
- esquecer o método main correto.

## Relação com backend real
Mesmo usando IntelliJ, Maven, Gradle e Spring Boot, a base continua sendo código-fonte compilado para bytecode executado pela JVM.

## Dúvidas
-
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é compilação;
explicar o papel do javac;
explicar o papel do java;
diferenciar .java e .class;
compilar Main.java;
executar Main;
entender por que java Main.class está errado;
entender por que precisa recompilar após alterar .java;
identificar erro de compilação;
identificar erro de execução;
entender a regra entre classe pública e nome do arquivo;
compilar exemplo com duas classes;
entender a noção inicial de classpath;
explicar por que .class não deve ir para o Git;
relacionar compilação manual com IDE, Maven, Gradle, Spring Boot e produção.
```

Não precisa dominar build profissional ainda.

Mas precisa sair daqui entendendo o fluxo básico sem depender de botão.

---

## Fechamento da aula

Compilar manualmente é uma aula de humildade técnica.

Ela mostra que antes de qualquer framework existe um processo simples:

```text
escrever fonte;
compilar;
gerar bytecode;
executar na JVM.
```

Quando esse processo fica claro, muitos erros deixam de parecer misteriosos.

A próxima aula continua esse caminho e aprofunda a parte que costuma confundir muita gente:

```text
classpath
execução em pastas diferentes
separação entre src e out
como a JVM encontra classes
```

Esse assunto é uma ponte direta para entender como Maven, IntelliJ e Spring Boot organizam o projeto por baixo.
