# 021 — M1.01 — Primeiro Programa Java Destrinchado

## Hoje a aula é sobre entender cada palavra do primeiro programa

O primeiro programa Java clássico é este:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Muita gente começa copiando esse código sem entender.

E aí surgem perguntas:

```text
por que tem public?
por que tem class?
por que o nome é Main?
por que tem static?
por que tem void?
por que o método chama main?
por que String começa com letra maiúscula?
por que tem colchetes?
por que tem args?
por que System começa com S maiúsculo?
por que tem ponto?
por que println?
por que tem ponto e vírgula?
por que tem tantas chaves?
```

Essas perguntas são boas.

Elas não atrapalham.

Elas constroem base.

Nesta aula, vamos responder sem tentar ensinar toda a linguagem de uma vez.

---

## O primeiro programa completo

Crie um arquivo chamado:

```text
Main.java
```

Conteúdo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Esse é o primeiro programa.

Agora vamos desmontar.

---

## `public class Main`

A linha:

```java
public class Main {
```

declara uma classe.

Em Java, praticamente tudo começa dentro de uma classe.

A palavra:

```java
class
```

indica que estamos declarando uma classe.

O nome da classe é:

```java
Main
```

A palavra:

```java
public
```

indica visibilidade pública.

Em termos simples, significa que essa classe pode ser acessada de fora do arquivo/pacote conforme as regras da linguagem.

Neste começo, o mais importante é:

```text
se a classe pública se chama Main,
o arquivo precisa se chamar Main.java.
```

Java é exigente com isso.

---

## Nome do arquivo e nome da classe

Se o arquivo se chama:

```text
Main.java
```

e a classe pública se chama:

```java
public class Main
```

está coerente.

Se o arquivo se chama:

```text
Programa.java
```

mas dentro está:

```java
public class Main
```

vai dar erro.

Regra inicial:

```text
classe pública Main -> arquivo Main.java
classe pública Cliente -> arquivo Cliente.java
classe pública Pedido -> arquivo Pedido.java
```

Java diferencia maiúsculas e minúsculas.

Então:

```text
Main
```

não é o mesmo que:

```text
main
```

E:

```text
Cliente
```

não é o mesmo que:

```text
cliente
```

---

## O que significa a chave `{`

A chave abre um bloco.

Na linha:

```java
public class Main {
```

a chave abre o bloco da classe `Main`.

Tudo que pertence à classe fica dentro dessas chaves.

Exemplo:

```java
public class Main {
    // conteúdo da classe aqui
}
```

A chave final:

```java
}
```

fecha o bloco da classe.

Se faltar chave, o compilador reclama.

Chaves são parte da estrutura do programa.

---

## `public static void main(String[] args)`

Agora a linha mais famosa:

```java
public static void main(String[] args) {
```

Essa linha declara o método principal do programa.

Esse método é o ponto de entrada.

Quando você executa:

```bash
java Main
```

a JVM procura um método com esta assinatura:

```java
public static void main(String[] args)
```

Se ela não encontrar, o programa não inicia do jeito esperado.

Vamos quebrar essa linha.

---

## `public` no método `main`

No método:

```java
public static void main(String[] args)
```

a palavra:

```java
public
```

indica que o método é acessível publicamente.

Para a JVM iniciar o programa por esse método, ele precisa estar acessível.

No começo, memorize com entendimento:

```text
o main precisa ser public para ser chamado como ponto de entrada padrão.
```

Mais tarde, quando estudarmos encapsulamento e modificadores de acesso, isso será aprofundado.

Agora basta entender:

```text
public abre o acesso.
```

---

## `static`

A palavra:

```java
static
```

indica que o método pertence à classe, não a um objeto específico.

Isso parece abstrato no começo.

Vamos com calma.

Em Java, normalmente você cria objetos a partir de classes.

Mas no momento em que o programa começa, ainda não existe nenhum objeto criado por você.

Então a JVM precisa chamar um método sem depender de um objeto.

Por isso o `main` é `static`.

Interpretação inicial:

```text
static permite que o main seja chamado diretamente pela classe.
```

Mais tarde, em orientação a objetos, vamos estudar `static` com mais profundidade.

Por enquanto, entenda:

```text
o programa precisa começar em algum lugar;
esse lugar é um método static chamado main.
```

---

## `void`

A palavra:

```java
void
```

indica que o método não retorna valor.

Em Java, métodos podem retornar algo.

Exemplos futuros:

```java
int somar() { ... }
String obterNome() { ... }
boolean estaAtivo() { ... }
```

Mas o `main` padrão não devolve um valor para outro método Java.

Ele executa instruções.

Por isso:

```java
void
```

Interpretação:

```text
void = este método não retorna valor.
```

---

## `main`

A palavra:

```java
main
```

é o nome do método.

No caso do ponto de entrada Java, esse nome é especial.

A JVM procura exatamente:

```java
main
```

com a assinatura correta.

Se você escrever:

```java
Main
```

com M maiúsculo, não é o mesmo.

Se escrever:

```java
principal
```

não será reconhecido como ponto de entrada padrão.

Java é sensível a maiúsculas e minúsculas.

Então:

```text
main
```

é diferente de:

```text
Main
```

---

## `String[] args`

Dentro dos parênteses:

```java
String[] args
```

temos o parâmetro do método `main`.

Vamos quebrar:

```text
String -> texto;
[] -> array;
args -> nome da variável.
```

`String[] args` significa:

```text
um array de Strings chamado args.
```

Esse array pode receber argumentos passados pela linha de comando.

Exemplo futuro:

```bash
java Main Thiago
```

Mas não vamos usar isso profundamente agora.

No primeiro programa, `args` pode ficar sem uso.

Ele está ali porque faz parte da assinatura padrão do `main`.

---

## `String` com S maiúsculo

Em Java:

```java
String
```

começa com S maiúsculo porque é uma classe.

Tipos primitivos como:

```java
int
double
boolean
char
```

começam com letra minúscula.

`String` não é tipo primitivo.

É uma classe muito usada para representar texto.

Por enquanto:

```text
String = texto.
```

Depois vamos estudar `String` com calma.

---

## `args` pode ter outro nome?

Tecnicamente, sim.

Este método funcionaria:

```java
public static void main(String[] argumentos) {
    System.out.println("Olá!");
}
```

Porque o nome da variável pode mudar.

O que precisa manter é o tipo:

```java
String[]
```

e a estrutura do método.

Mas por convenção, quase sempre usamos:

```java
args
```

Então, para seguir o padrão, use:

```java
String[] args
```

---

## `System.out.println`

A linha:

```java
System.out.println("Olá, Java!");
```

manda imprimir uma mensagem no console.

Vamos quebrar:

```text
System -> classe do Java;
out -> saída padrão;
println -> imprime uma linha;
"Olá, Java!" -> texto que será impresso.
```

Interpretação:

```text
use a saída padrão do sistema para imprimir uma linha.
```

Console é a área onde a saída aparece.

No terminal, depois de executar, você vê:

```text
Olá, Java!
```

---

## `println` versus `print`

`println` imprime e pula linha.

Exemplo:

```java
System.out.println("Linha 1");
System.out.println("Linha 2");
```

Saída:

```text
Linha 1
Linha 2
```

`print` imprime sem pular linha.

Exemplo:

```java
System.out.print("Linha 1");
System.out.print("Linha 2");
```

Saída:

```text
Linha 1Linha 2
```

No começo, use bastante `println`.

Ele ajuda a enxergar o fluxo.

Mais tarde, vamos usar logs profissionais, mas `println` é bom para primeiros passos.

---

## Texto entre aspas

Em Java, texto literal fica entre aspas duplas:

```java
"Olá, Java!"
```

Aspas simples são para caractere único:

```java
'A'
```

Não escreva:

```java
'Olá, Java!'
```

Isso dá erro.

Regra inicial:

```text
texto com várias letras -> aspas duplas;
um caractere -> aspas simples.
```

---

## Ponto e vírgula

A linha:

```java
System.out.println("Olá, Java!");
```

termina com:

```java
;
```

Em Java, muitas instruções terminam com ponto e vírgula.

Se esquecer, o compilador reclama.

Exemplo errado:

```java
System.out.println("Olá, Java!")
```

Exemplo correto:

```java
System.out.println("Olá, Java!");
```

No começo, muitos erros serão apenas ponto e vírgula esquecido.

Isso faz parte.

---

## Indentação

Compare:

```java
public class Main {
public static void main(String[] args) {
System.out.println("Olá, Java!");
}
}
```

com:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Os dois podem compilar.

Mas o segundo é legível.

Indentação não é enfeite.

Indentação mostra estrutura.

A cada bloco aberto com `{`, o conteúdo interno deve ficar deslocado.

Atalho útil no IntelliJ:

```text
Ctrl + Alt + L
```

para reformatar.

---

## O programa com comentários

Comentários ajudam a explicar código.

Exemplo:

```java
public class Main {

    public static void main(String[] args) {
        // Imprime uma mensagem no console
        System.out.println("Olá, Java!");
    }
}
```

O comentário:

```java
// Imprime uma mensagem no console
```

não é executado.

Ele serve para humanos.

Mas cuidado:

```text
comentário ruim repete o óbvio;
comentário bom explica intenção.
```

No começo, comentários podem ajudar a aprender.

Depois, o ideal é código claro e comentários úteis.

---

## Exemplo mínimo digitado do zero

Crie uma pasta para esta aula:

```powershell
cd C:\dev\labs
mkdir aula-021-primeiro-programa-java
cd aula-021-primeiro-programa-java
```

Crie o arquivo:

```powershell
New-Item Main.java
```

Abra no IntelliJ ou editor de texto e digite:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Compile:

```powershell
javac Main.java
```

Execute:

```powershell
java Main
```

Saída esperada:

```text
Olá, Java!
```

Se isso apareceu, o primeiro programa rodou.

---

## O que acontece na compilação

Quando você roda:

```powershell
javac Main.java
```

o compilador Java lê o arquivo-fonte:

```text
Main.java
```

Se não houver erro, ele gera:

```text
Main.class
```

O `.class` contém bytecode.

Bytecode é o formato que a JVM consegue executar.

Fluxo:

```text
Main.java -> javac -> Main.class -> java -> execução na JVM
```

Essa sequência é essencial.

Java não executa diretamente o `.java` nesse fluxo tradicional.

Ele compila primeiro.

Depois executa o `.class`.

---

## O que acontece na execução

Quando você roda:

```powershell
java Main
```

você não escreve:

```powershell
java Main.class
```

Você escreve o nome da classe:

```text
Main
```

A JVM procura a classe `Main` e dentro dela procura:

```java
public static void main(String[] args)
```

Se encontrar, executa.

Se não encontrar, dá erro.

---

## Por que não executar com `.class`

Errado:

```powershell
java Main.class
```

Correto:

```powershell
java Main
```

O comando `java` espera o nome da classe, não o nome do arquivo `.class`.

Esse é um erro muito comum.

---

## Primeiro programa no IntelliJ

No IntelliJ:

```text
1. Abra ou crie um projeto simples.
2. Crie `Main.java`.
3. Digite o código.
4. Clique no ícone de execução ao lado do `main`, se aparecer.
5. Veja a saída no console da IDE.
```

Depois valide também pelo terminal:

```powershell
javac Main.java
java Main
```

A IDE ajuda.

Mas o terminal ensina.

Nesta fase, use os dois.

---

## Debug do primeiro programa

Coloque um breakpoint na linha:

```java
System.out.println("Olá, Java!");
```

Execute em modo Debug.

Observe:

```text
a execução para no breakpoint;
a linha atual fica destacada;
o console ainda não imprimiu antes de passar pela linha;
ao avançar, a mensagem aparece.
```

Atalhos úteis:

```text
Shift + F9 -> debug;
F8 -> Step Over, conforme keymap;
F9 -> Resume, conforme keymap.
```

Se atalhos variarem, use:

```text
Ctrl + Shift + A
```

e procure a ação.

---

## Exemplo com duas impressões

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Iniciando programa...");
        System.out.println("Finalizando programa...");
    }
}
```

Saída:

```text
Iniciando programa...
Finalizando programa...
```

Isso mostra que o Java executa as instruções em ordem, de cima para baixo, dentro do `main`.

Essa noção será importante para lógica.

---

## Ordem de execução

Dentro do método `main`, o fluxo é sequencial.

Exemplo:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Passo 1");
        System.out.println("Passo 2");
        System.out.println("Passo 3");
    }
}
```

Saída:

```text
Passo 1
Passo 2
Passo 3
```

A JVM não escolhe aleatoriamente.

Ela executa a sequência.

Mais tarde, estruturas como `if`, `for`, `while` e métodos vão alterar o fluxo.

Mas a base é:

```text
instruções executam em ordem.
```

---

## Exemplo aplicado ao domínio corporativo

Vamos simular uma saída simples de uma ordem de serviço.

Arquivo:

```text
ResumoOrdemServico.java
```

Código:

```java
public class ResumoOrdemServico {
    public static void main(String[] args) {
        System.out.println("Ordem de Serviço");
        System.out.println("Número: OS-1001");
        System.out.println("Status: ABERTA");
        System.out.println("Responsável: Backoffice");
    }
}
```

Compile:

```powershell
javac ResumoOrdemServico.java
```

Execute:

```powershell
java ResumoOrdemServico
```

Saída esperada:

```text
Ordem de Serviço
Número: OS-1001
Status: ABERTA
Responsável: Backoffice
```

Esse programa ainda não tem variável.

Ainda não tem objeto.

Ainda não tem banco.

Mas já mostra algo importante:

```text
um programa pode representar uma saída de domínio.
```

Mais tarde, `Número`, `Status` e `Responsável` serão variáveis, atributos, objetos, registros no banco e respostas de API.

Agora são apenas textos.

Tudo começa simples.

---

## Outro exemplo aplicado: pedido

Arquivo:

```text
ResumoPedido.java
```

Código:

```java
public class ResumoPedido {
    public static void main(String[] args) {
        System.out.println("Pedido");
        System.out.println("Código: PED-2026-001");
        System.out.println("Cliente: Cliente Exemplo");
        System.out.println("Valor: 150.00");
        System.out.println("Status: PENDENTE");
    }
}
```

Compile:

```powershell
javac ResumoPedido.java
```

Execute:

```powershell
java ResumoPedido
```

Objetivo:

```text
treinar estrutura do programa;
entender nome de arquivo;
entender nome de classe;
executar saída no console;
relacionar código com domínio backend.
```

---

## Primeiro cuidado com nomes

Classes em Java usam PascalCase.

Exemplos bons:

```text
Main
ResumoOrdemServico
ResumoPedido
Cliente
Produto
Pedido
```

Evite:

```text
main
resumo_ordem_servico
resumo ordem servico
RESUMO
Teste1
```

PascalCase significa:

```text
cada palavra começa com letra maiúscula;
sem espaços;
sem underscore para nome de classe.
```

Isso será reforçado mais tarde.

---

## Arquivos gerados e Git

Depois de compilar:

```text
Main.class
ResumoOrdemServico.class
ResumoPedido.class
```

Esses arquivos são gerados.

Não devem ir para Git.

No `.gitignore`, mantenha:

```gitignore
*.class
```

Se `git status` mostrar `.class`, corrija `.gitignore`.

Código-fonte vai para Git:

```text
Main.java
ResumoOrdemServico.java
ResumoPedido.java
```

Bytecode gerado não.

---

## Erros comuns

### Erro 1 — Nome do arquivo diferente da classe pública

Arquivo:

```text
Programa.java
```

Código:

```java
public class Main {
}
```

Erro.

Correção:

```text
arquivo Main.java
```

ou:

```java
public class Programa
```

O nome precisa bater.

---

### Erro 2 — Escrever `main` com M maiúsculo

Errado:

```java
public static void Main(String[] args)
```

Correto:

```java
public static void main(String[] args)
```

Java diferencia maiúsculas e minúsculas.

---

### Erro 3 — Esquecer `static`

Errado:

```java
public void main(String[] args)
```

Correto:

```java
public static void main(String[] args)
```

Sem `static`, a JVM não reconhece o ponto de entrada padrão.

---

### Erro 4 — Esquecer `void`

Errado:

```java
public static main(String[] args)
```

Correto:

```java
public static void main(String[] args)
```

Todo método precisa declarar tipo de retorno.

`void` significa sem retorno.

---

### Erro 5 — Escrever `string` minúsculo

Errado:

```java
public static void main(string[] args)
```

Correto:

```java
public static void main(String[] args)
```

`String` é classe e começa com S maiúsculo.

---

### Erro 6 — Esquecer ponto e vírgula

Errado:

```java
System.out.println("Olá")
```

Correto:

```java
System.out.println("Olá");
```

---

### Erro 7 — Usar aspas simples em texto

Errado:

```java
System.out.println('Olá, Java!');
```

Correto:

```java
System.out.println("Olá, Java!");
```

Aspas duplas para texto.

---

### Erro 8 — Fechar chaves errado

Errado:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
}
```

Falta fechar a classe corretamente.

Correto:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá");
    }
}
```

---

### Erro 9 — Executar com `.class`

Errado:

```powershell
java Main.class
```

Correto:

```powershell
java Main
```

---

### Erro 10 — Rodar `java Main` antes de compilar

Se você alterou o `.java`, compile novamente:

```powershell
javac Main.java
java Main
```

Se rodar sem compilar depois de alteração, pode executar versão antiga do `.class`.

---

## Como ler erro do compilador

Exemplo de erro por ponto e vírgula:

```text
Main.java:3: error: ';' expected
        System.out.println("Olá")
                                 ^
```

Interpretação:

```text
arquivo: Main.java;
linha: 3;
erro: esperava ponto e vírgula;
seta: local aproximado do problema.
```

Erro de compilação não é inimigo.

É feedback.

Leia.

Corrija.

Compile de novo.

---

## Atividade guiada

Crie três arquivos:

```text
Main.java
ResumoOrdemServico.java
ResumoPedido.java
```

Compile e execute cada um:

```powershell
javac Main.java
java Main

javac ResumoOrdemServico.java
java ResumoOrdemServico

javac ResumoPedido.java
java ResumoPedido
```

Depois confira:

```powershell
ls
```

Veja os `.class`.

Valide Git:

```bash
git status
```

Se `.class` aparecer, ajuste `.gitignore`.

Depois registre no diário e faça commit apenas dos arquivos corretos.

---

## Organização sugerida no repositório

Para esta aula, uma estrutura possível:

```text
labs/
└── m1/
    └── aula-021-primeiro-programa-java/
        ├── Main.java
        ├── ResumoOrdemServico.java
        └── ResumoPedido.java
```

Se a pasta não existir:

```powershell
mkdir labs\m1
mkdir labs\m1\aula-021-primeiro-programa-java
```

Entre nela:

```powershell
cd labs\m1\aula-021-primeiro-programa-java
```

Crie os arquivos e pratique.

Essa organização evita jogar arquivos na raiz.

---

## Commit recomendado

Antes:

```bash
git status
git diff
```

Adicione:

```bash
git add labs/m1/aula-021-primeiro-programa-java docs/diario-de-bordo.md .gitignore
```

Revise:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Aula 021: cria primeiro programa Java"
```

Valide:

```bash
git status
```

Se `.class` apareceu, não commite.

Corrija `.gitignore`.

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
criar Main.java;
escrever o primeiro programa Java;
explicar public class Main;
explicar class;
explicar public em nível inicial;
explicar static em nível inicial;
explicar void;
explicar main;
explicar String[] args;
explicar System.out.println;
usar aspas duplas para texto;
usar ponto e vírgula;
organizar chaves;
compilar com javac;
executar com java;
entender .java;
entender .class;
entender que .class não vai para Git;
corrigir erro de nome de arquivo;
corrigir erro de main escrito errado;
corrigir erro de ponto e vírgula;
corrigir erro de String minúsculo;
usar IntelliJ para rodar;
usar debug básico no primeiro programa;
registrar a aula no diário;
fazer commit limpo.
```

Não precisa ainda dominar variáveis.

Não precisa ainda dominar orientação a objetos.

Não precisa ainda entender profundamente `static`.

O objetivo é entender o primeiro programa e executar com segurança.

---

## Fechamento da aula

Hoje o Java começou de verdade.

O primeiro programa parece simples:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Mas ele abriu várias portas:

```text
classe;
método;
ponto de entrada;
compilação;
execução;
console;
estrutura;
erros;
debug;
Git.
```

A partir daqui, vamos avançar camada por camada.

Na próxima aula, entraremos em:

```text
variáveis;
literais;
tipos primitivos;
int;
double;
boolean;
char;
String em uso inicial.
```

Agora o ambiente já está pronto.

O repositório já está organizado.

E o primeiro programa Java já foi destrinchado.
