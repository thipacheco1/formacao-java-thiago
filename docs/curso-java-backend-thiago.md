# Curso Java Backend do Thiago

**Versão:** 0.1  
**Status:** Em construção  
**Projeto prático:** `formacao-java-thiago`  
**Repositório:** `https://github.com/thipacheco1/formacao-java-thiago`  
**Objetivo:** transformar a formação prática em uma documentação oficial de curso Java Backend, com explicações completas, exemplos, exercícios, erros comuns, correções e evolução progressiva.

---

## 1. Objetivo deste documento

Este arquivo é a documentação oficial do curso que está sendo construído em paralelo com a formação Java Backend.

A ideia é que ele sirva para três coisas:

1. Apoiar a revisão pessoal do conteúdo estudado.
2. Registrar, em formato de curso, tudo que foi aprendido na prática.
3. Servir futuramente como material de ensino para outras pessoas.

Este documento não substitui o `docs/diario-de-bordo.md`.

Cada arquivo terá uma função:

- `README.md`: apresentação geral do projeto.
- `docs/diario-de-bordo.md`: registro cronológico das aulas concluídas.
- `docs/atalhos.txt`: atalhos usados no IntelliJ, Git e ambiente.
- `docs/curso-java-backend.md`: material didático completo do curso.

---

## 2. Como este curso está sendo conduzido

A formação está sendo feita com um modelo prático e progressivo.

O aluno não apenas lê conceitos. Ele:

- Instala as ferramentas.
- Cria o projeto no IntelliJ.
- Escreve código manualmente.
- Executa no console.
- Testa cenários positivos e negativos.
- Corrige erros reais.
- Atualiza documentação.
- Versiona no Git.
- Envia para o GitHub.
- Mantém histórico profissional do aprendizado.

Esse modelo aproxima o estudo de Java de uma rotina real de desenvolvimento backend.

---

## 3. Ferramentas utilizadas

### 3.1 Java JDK

Foi instalado o JDK 21 LTS Eclipse Temurin.

O JDK é o kit de desenvolvimento Java. Ele inclui as ferramentas necessárias para compilar e executar programas Java.

Comandos usados para validar a instalação:

```bash
java -version
javac -version
```

Resultado validado no ambiente:

```text
openjdk 21.0.11 2026-04-21 LTS
javac 21.0.11
```

### 3.2 IntelliJ IDEA Community

O IntelliJ IDEA Community foi escolhido como IDE principal.

Ele será usado para:

- Criar projetos Java.
- Escrever código.
- Executar programas.
- Visualizar erros.
- Organizar arquivos.
- Trabalhar com Git.
- Evoluir futuramente para projetos maiores.

### 3.3 Git

O Git é usado para versionar o projeto.

Configuração realizada:

```bash
git config --global user.name "Thiago Pacheco"
git config --global user.email "thipacheco1@gmail.com"
```

### 3.4 GitHub

O GitHub é usado para armazenar o projeto remotamente.

Repositório do projeto:

```text
https://github.com/thipacheco1/formacao-java-thiago
```

### 3.5 ChatGPT

O ChatGPT está sendo usado como professor, mentor e revisor técnico.

O papel dele é:

- Explicar conceitos.
- Corrigir erros.
- Propor exercícios.
- Revisar prints e código.
- Gerar documentação de apoio.
- Ajudar a manter a trilha organizada.

### 3.6 Codex

O Codex será usado futuramente como assistente de desenvolvimento, mas não como muleta.

A regra definida foi:

- Código pequeno e conceitos novos devem ser digitados manualmente.
- O aluno precisa entender a sintaxe.
- O Codex pode ser usado depois como apoio, revisão ou aceleração em projetos maiores.

---

## 4. Estrutura do projeto

Estrutura atual esperada:

```text
formacao-java-thiago
│
├── README.md
├── .gitignore
│
├── docs
│   ├── atalhos.txt
│   ├── diario-de-bordo.md
│   └── curso-java-backend.md
│
└── src
    └── Main.java
```

### 4.1 README.md

Arquivo de apresentação do projeto.

Serve para explicar:

- Qual é o objetivo do repositório.
- Quem está estudando.
- Qual formação está sendo seguida.
- Quais tecnologias serão usadas.

### 4.2 .gitignore

Arquivo que define o que não deve entrar no Git.

Conteúdo esperado:

```gitignore
.idea/
*.iml
out/
*.class
.DS_Store
Thumbs.db
```

Explicação:

- `.idea/`: configurações internas do IntelliJ.
- `*.iml`: arquivo de módulo do IntelliJ.
- `out/`: arquivos compilados.
- `*.class`: arquivos gerados pela compilação Java.
- `.DS_Store`: arquivo gerado pelo macOS.
- `Thumbs.db`: arquivo gerado pelo Windows.

### 4.3 docs/diario-de-bordo.md

Registra aula por aula:

- O que foi feito.
- O que foi aprendido.
- Dificuldades.
- Como foi resolvido.
- Status.
- Próxima aula.

### 4.4 docs/atalhos.txt

Registra atalhos úteis usados durante o curso.

### 4.5 docs/curso-java-backend.md

Este arquivo.

Ele é o material didático completo do curso.

---

# Módulo 1 — Ambiente, IntelliJ, Git e GitHub

## Aula 1.1 — Modelo da formação

### Objetivo

Entender como a formação será conduzida.

### Conceito principal

A formação será prática, progressiva e orientada por projeto.

O aluno não vai apenas estudar Java de forma solta. Ele vai construir um repositório real, documentado e versionado.

### Modelo adotado

```text
ChatGPT       = professor / mentor / revisor
IntelliJ      = laboratório de desenvolvimento
Codex         = assistente futuro
Git           = controle de versão
GitHub        = portfólio remoto
Documento v3  = mapa oficial da formação
```

### Aprendizado importante

Um desenvolvedor backend profissional não depende apenas de saber escrever código.

Ele também precisa saber:

- Configurar ambiente.
- Organizar projeto.
- Versionar alterações.
- Documentar decisões.
- Ler erros.
- Corrigir problemas.
- Testar cenários.
- Evoluir o código com disciplina.

---

## Aula 1.2 — Instalação e validação do JDK 21

### Objetivo

Instalar o Java JDK e validar se o ambiente consegue compilar e executar código Java.

### O que é JDK

JDK significa **Java Development Kit**.

Ele é o kit necessário para desenvolver em Java.

Inclui:

- Compilador Java (`javac`).
- Máquina virtual Java (`java`).
- Bibliotecas padrão.
- Ferramentas de desenvolvimento.

### O que é JRE

JRE significa **Java Runtime Environment**.

Ele serve para executar aplicações Java, mas não necessariamente para desenvolvê-las.

### O que é JVM

JVM significa **Java Virtual Machine**.

É a máquina virtual que executa o bytecode Java.

Fluxo simplificado:

```text
Código .java
   ↓ compilação com javac
Arquivo .class
   ↓ execução pela JVM
Programa rodando
```

### Validação realizada

Foram executados:

```bash
java -version
javac -version
```

Se ambos funcionam, o ambiente Java está pronto para desenvolvimento.

---

## Aula 1.3 — Primeiro projeto Java no IntelliJ

### Objetivo

Criar o primeiro projeto Java no IntelliJ e executar o primeiro programa.

### Código inicial

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Thiago começou a formação Java Backend.");
    }
}
```

### Explicação inicial

`public class Main` define uma classe chamada `Main`.

Em Java, todo código precisa estar dentro de uma classe.

`public static void main(String[] args)` é o ponto de entrada do programa.

Quando executamos um programa Java simples, a JVM procura esse método para iniciar a execução.

`System.out.println(...)` imprime uma mensagem no console.

### Problema encontrado

O IntelliJ inicialmente exibiu erros como:

```text
Cannot resolve symbol 'String'
Cannot resolve symbol 'System'
```

### Causa

O projeto não estava reconhecendo corretamente o JDK ou a pasta `src` não estava configurada como raiz de código-fonte.

### Resolução

Foi necessário validar:

- SDK configurado no projeto.
- JDK 21 selecionado.
- Pasta `src` marcada como source root.

### Aprendizado

Nem todo erro inicial é erro no código. Muitas vezes, o problema está na configuração do projeto.

---

## Aula 1.4 — Entendendo o primeiro programa Java

### Objetivo

Entender a estrutura básica do primeiro programa Java.

### Código base

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

### public class Main

Define uma classe pública chamada `Main`.

A classe é uma estrutura básica em Java.

### Chaves { }

As chaves delimitam blocos de código.

Exemplo:

```java
public class Main {
    // conteúdo da classe
}
```

### main

O método `main` é o ponto inicial da execução.

```java
public static void main(String[] args)
```

Por enquanto, o foco é entender que ele é obrigatório para programas Java simples executados pelo console.

### System.out.println

Imprime uma mensagem e pula linha.

Exemplo:

```java
System.out.println("Texto");
```

### Ponto e vírgula

Em Java, instruções geralmente terminam com `;`.

Exemplo:

```java
System.out.println("Olá");
```

Sem o ponto e vírgula, o código não compila.

### print x println

`print` imprime sem pular linha.

```java
System.out.print("A");
System.out.print("B");
```

Resultado:

```text
AB
```

`println` imprime e pula linha.

```java
System.out.println("A");
System.out.println("B");
```

Resultado:

```text
A
B
```

---

## Aula 1.5 — Comentários em Java

### Objetivo

Entender como escrever comentários no código.

### Comentário de uma linha

```java
// Este é um comentário de uma linha
```

### Comentário de várias linhas

```java
/*
Este é um comentário
com várias linhas.
*/
```

### Para que servem comentários

Comentários servem para explicar intenção, contexto ou decisão técnica.

### Mau comentário

```java
// imprime nome
System.out.println(nome);
```

Esse comentário é óbvio demais.

### Bom comentário

```java
// Regra temporária: cliente bloqueado não pode seguir para atendimento
boolean podeSeguir = clienteAtivo && !clienteBloqueado;
```

Esse comentário explica contexto de negócio.

### Aprendizado

Código deve ser claro. Comentários devem complementar o entendimento, não explicar o óbvio.

---

## Aula 1.6 — Diário de bordo

### Objetivo

Criar documentação contínua do aprendizado.

### Arquivo criado

```text
docs/diario-de-bordo.md
```

### Função do diário

Registrar:

- Aulas concluídas.
- Conteúdo estudado.
- Dificuldades.
- Correções.
- Próximos passos.

### Aprendizado

Documentar o aprendizado ajuda na revisão, na organização e na criação de portfólio.

---

## Aula 1.7 — README

### Objetivo

Criar um arquivo de apresentação do projeto.

### Arquivo

```text
README.md
```

### Função do README

O README é o cartão de entrada do projeto no GitHub.

Ele deve explicar:

- O que é o projeto.
- Qual objetivo.
- Tecnologias usadas.
- Como o projeto está organizado.

### Aprendizado

Projetos profissionais precisam ser compreensíveis para outras pessoas.

Um bom README facilita revisão, apresentação e manutenção.

---

## Aula 1.8 — Git inicial e primeiro commit

### Objetivo

Inicializar o Git no projeto e criar o primeiro commit.

### Comandos principais

```bash
git init
git status
git add .
git commit -m "Adiciona estrutura inicial da formacao Java"
```

### git init

Inicializa um repositório Git na pasta atual.

### git status

Mostra o estado atual dos arquivos.

Permite saber:

- Arquivos novos.
- Arquivos modificados.
- Arquivos preparados para commit.
- Estado da branch.

### git add .

Adiciona todos os arquivos modificados para a área de stage.

### git commit

Cria um ponto de histórico.

Exemplo:

```bash
git commit -m "Mensagem do commit"
```

### Erros corrigidos

Foi digitado:

```text
git configo
```

O correto era:

```bash
git config
```

Também foi digitado:

```text
git add ,
```

O correto era:

```bash
git add .
```

### Warning LF/CRLF

O Git exibiu aviso sobre conversão de quebra de linha.

Isso é comum no Windows.

Não era erro impeditivo.

---

## Aula 1.9 — Branch main, GitHub e push

### Objetivo

Conectar o repositório local ao GitHub.

### Comandos usados

```bash
git branch -M main
git remote add origin https://github.com/thipacheco1/formacao-java-thiago
git push -u origin main
```

### git branch -M main

Renomeia a branch principal para `main`.

### git remote add origin

Conecta o repositório local ao repositório remoto.

### git push -u origin main

Envia os commits locais para o GitHub e configura rastreamento entre a branch local e remota.

### Aprendizado

A partir desse ponto, o projeto passou a existir localmente e remotamente.

---

## Aula 1.10 — Revisão da estrutura profissional do projeto

### Objetivo

Validar a estrutura do projeto e garantir que apenas arquivos corretos estavam versionados.

### Comando usado

```bash
git ls-files
```

### Resultado esperado

```text
.gitignore
README.md
docs/atalhos.txt
docs/diario-de-bordo.md
src/Main.java
```

### Aprendizado

Nem tudo deve entrar no Git.

Arquivos de código e documentação entram.

Arquivos gerados, compilados ou específicos da IDE ficam fora.

---

# Módulo 2 — Fundamentos iniciais de Java

## Aula 2.1 — Variáveis em Java

### Objetivo

Entender o que são variáveis e como criar variáveis em Java.

### O que é uma variável

Variável é um espaço na memória que guarda um valor.

Toda variável em Java tem:

```text
tipo
nome
valor
```

Exemplo:

```java
String nome = "Thiago";
int idade = 44;
boolean estudandoJava = true;
```

### String

Usada para textos.

```java
String cidade = "Barueri";
```

Textos usam aspas duplas.

### int

Usado para números inteiros.

```java
int idade = 44;
```

### boolean

Usado para verdadeiro ou falso.

```java
boolean estudandoJava = true;
```

### Concatenar texto com variável

```java
System.out.println("Nome: " + nome);
```

O operador `+` une texto e valor da variável.

### camelCase

Em Java, nomes de variáveis normalmente usam camelCase.

Exemplos:

```java
String objetivoProfissional = "Engenheiro Java Backend";
int anosExperienciaQa = 10;
boolean estudandoJava = true;
```

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        String nome = "Thiago";
        int idade = 44;
        String cidade = "Barueri";
        String profissaoAtual = "QA";
        String objetivoProfissional = "Engenheiro Java Backend";
        int anosExperienciaQa = 10;
        boolean estudandoJava = true;

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Cidade: " + cidade);
        System.out.println("Profissão atual: " + profissaoAtual);
        System.out.println("Objetivo profissional: " + objetivoProfissional);
        System.out.println("Anos de experiência com QA: " + anosExperienciaQa);
        System.out.println("Está estudando Java? " + estudandoJava);
    }
}
```

### Aprendizado

Variáveis permitem que o programa trabalhe com dados.

Sem variáveis, o código ficaria preso a textos e valores fixos.

---

## Aula 2.2 — Tipos primitivos

### Objetivo

Conhecer os principais tipos de dados em Java.

### Tipos primitivos

Java possui 8 tipos primitivos:

```text
byte
short
int
long
float
double
char
boolean
```

### int

Números inteiros.

```java
int idade = 44;
```

### double

Números decimais.

```java
double altura = 1.79;
```

### float

Número decimal com menor precisão que `double`.

Precisa usar `F` no final.

```java
float peso = 90.0F;
```

### long

Número inteiro maior.

Por convenção, pode usar `L` no final.

```java
long populacao = 210000000L;
```

### char

Um único caractere.

Usa aspas simples.

```java
char inicial = 'T';
```

### boolean

Verdadeiro ou falso.

```java
boolean ativo = true;
```

### String não é tipo primitivo

`String` é uma classe, não um tipo primitivo.

Mas é muito usada para texto.

```java
String nome = "Thiago";
```

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        String nomeCompleto = "Thiago Pacheco";
        int idade = 44;
        double altura = 1.79;
        float peso = 90.0F;
        char inicialSobrenome = 'P';
        int quantidadeFilhos = 2;
        int anosExperienciaQa = 10;
        boolean estudaJava = true;
        boolean pretendeVirarArquiteto = true;

        System.out.println("Nome completo: " + nomeCompleto);
        System.out.println("Idade: " + idade);
        System.out.println("Altura: " + altura);
        System.out.println("Peso: " + peso);
        System.out.println("Inicial do sobrenome: " + inicialSobrenome);
        System.out.println("Quantidade de filhos: " + quantidadeFilhos);
        System.out.println("Anos de experiência com QA: " + anosExperienciaQa);
        System.out.println("Estuda Java? " + estudaJava);
        System.out.println("Pretende virar Arquiteto Java? " + pretendeVirarArquiteto);
    }
}
```

### Aprendizado

Escolher o tipo correto deixa o código mais claro e evita problemas.

---

## Aula 2.3 — Operadores aritméticos

### Objetivo

Aprender a fazer cálculos em Java.

### Operadores

```text
+ soma
- subtração
* multiplicação
/ divisão
% resto da divisão
```

### Soma

```java
int total = 10 + 5;
```

### Subtração

```java
int resultado = 10 - 5;
```

### Multiplicação

```java
int total = 10 * 5;
```

### Divisão

```java
int resultado = 10 / 2;
```

### Resto da divisão

```java
int resto = 10 % 3;
```

Resultado:

```text
1
```

Porque 10 dividido por 3 dá 3 e sobra 1.

### Divisão inteira

Se dividir dois inteiros, o resultado será inteiro.

```java
int resultado = 5 / 2;
```

Resultado:

```text
2
```

### Divisão decimal

Para resultado decimal, use `double`.

```java
double resultado = 5.0 / 2;
```

Resultado:

```text
2.5
```

### Dinheiro em Java

Nesta fase foi usado `double` para simplificar.

Mas em sistemas reais, para dinheiro, o ideal futuramente será usar `BigDecimal`.

Isso evita problemas de precisão.

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        double valorPorServico = 120.50;
        int quantidadeServicos = 8;
        double bonus = 150.00;
        double desconto = 80.00;

        double totalBruto = valorPorServico * quantidadeServicos;
        double totalComBonus = totalBruto + bonus;
        double totalFinal = totalComBonus - desconto;

        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Total bruto: R$ " + totalBruto);
        System.out.println("Bônus: R$ " + bonus);
        System.out.println("Total com bônus: R$ " + totalComBonus);
        System.out.println("Desconto: R$ " + desconto);
        System.out.println("Total final: R$ " + totalFinal);
    }
}
```

### Aprendizado

Operadores aritméticos são a base para cálculos de regras de negócio.

---

## Aula 2.4 — Operadores de comparação

### Objetivo

Aprender a comparar valores.

### Operadores

```text
== igual
!= diferente
> maior
< menor
>= maior ou igual
<= menor ou igual
```

### Resultado de uma comparação

Toda comparação retorna um valor booleano:

```text
true
false
```

### Exemplo

```java
boolean atingiuMeta = quantidadeServicos >= metaServicos;
```

Se:

```java
quantidadeServicos = 12;
metaServicos = 10;
```

Então:

```text
12 >= 10
true
```

Se:

```java
quantidadeServicos = 8;
metaServicos = 10;
```

Então:

```text
8 >= 10
false
```

### Diferença entre = e ==

`=` atribui valor.

```java
int idade = 18;
```

`==` compara valor.

```java
idade == 18
```

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        String nomeTecnico = "Carlos";
        int quantidadeServicos = 8;
        int metaServicos = 10;
        double valorPorServico = 120.50;
        double bonusMeta = 200.00;

        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        double totalSemBonus = quantidadeServicos * valorPorServico;

        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total sem bônus: R$ " + totalSemBonus);
        System.out.println("Bônus da meta: R$ " + bonusMeta);
        System.out.println("Atingiu a meta? " + atingiuMeta);
    }
}
```

### Aprendizado

Comparações transformam regras de negócio em respostas verdadeiras ou falsas.

---

## Aula 2.5 — Operadores lógicos

### Objetivo

Combinar várias condições booleanas.

### Operadores

```text
&& E
|| OU
!  NÃO
```

### &&

Todas as condições precisam ser verdadeiras.

```java
boolean podeAcessar = usuarioAtivo && senhaCorreta;
```

### ||

Basta uma condição ser verdadeira.

```java
boolean podeEntrar = admin || gerente;
```

### !

Inverte o valor booleano.

```java
boolean podeAcessar = !contaBloqueada;
```

Se:

```java
contaBloqueada = false;
```

Então:

```java
!contaBloqueada
```

é:

```text
true
```

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        String nomeUsuario = "Thiago";
        boolean usuarioAtivo = true;
        boolean senhaCorreta = true;
        boolean possuiPermissao = true;
        boolean contaBloqueada = false;

        boolean podeAcessarSistema = usuarioAtivo && senhaCorreta && possuiPermissao && !contaBloqueada;

        System.out.println("Usuário: " + nomeUsuario);
        System.out.println("Usuário ativo? " + usuarioAtivo);
        System.out.println("Senha correta? " + senhaCorreta);
        System.out.println("Possui permissão? " + possuiPermissao);
        System.out.println("Conta bloqueada? " + contaBloqueada);
        System.out.println("Pode acessar o sistema? " + podeAcessarSistema);
    }
}
```

### Aprendizado

Operadores lógicos permitem representar regras de negócio mais reais.

Exemplo:

```text
Pode receber bônus se:
atingiu meta
E está ativo
E não está bloqueado
```

---

## Aula 2.6 — if, else if e else

### Objetivo

Aprender tomada de decisão.

### Estrutura básica

```java
if (condicao) {
    // executa se verdadeiro
} else {
    // executa se falso
}
```

### else if

Permite testar várias possibilidades.

```java
if (quantidadeServicos >= 15) {
    System.out.println("Excelente");
} else if (quantidadeServicos >= 10) {
    System.out.println("Boa");
} else {
    System.out.println("Baixa");
}
```

### Ordem importa

Ao classificar faixas, a regra mais forte deve vir primeiro.

Correto:

```java
if (quantidadeServicos >= 15) {
    System.out.println("Excelente");
} else if (quantidadeServicos >= 10) {
    System.out.println("Boa");
}
```

Errado:

```java
if (quantidadeServicos >= 10) {
    System.out.println("Boa");
} else if (quantidadeServicos >= 15) {
    System.out.println("Excelente");
}
```

No exemplo errado, um valor 16 cairia primeiro na regra `>= 10`, e nunca chegaria na regra `>= 15`.

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        String nomeTecnico = "Carlos";
        int quantidadeServicos = 5;
        int metaMinima = 8;
        int metaBoa = 12;
        int metaExcelente = 15;

        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);

        if (quantidadeServicos >= metaExcelente) {
            System.out.println("Performance excelente.");
        } else if (quantidadeServicos >= metaBoa) {
            System.out.println("Performance boa.");
        } else if (quantidadeServicos >= metaMinima) {
            System.out.println("Performance mínima atingida.");
        } else {
            System.out.println("Meta não atingida.");
        }
    }
}
```

### Cenários testados

```text
16 → Performance excelente
13 → Performance boa
9  → Performance mínima atingida
5  → Meta não atingida
```

### Aprendizado

`if`, `else if` e `else` são fundamentais para regras condicionais.

---

## Aula 2.7 — switch

### Objetivo

Aprender a comparar uma variável contra valores fixos.

### Quando usar switch

Use `switch` quando uma variável pode assumir valores conhecidos.

Exemplos:

- Tipo de serviço.
- Status da OS.
- Opção de menu.
- Tipo de usuário.
- Código de categoria.

### Estrutura

```java
switch (variavel) {
    case 1:
        // ação
        break;
    case 2:
        // ação
        break;
    default:
        // ação padrão
}
```

### break

O `break` interrompe o `switch`.

Sem `break`, o Java pode continuar executando os próximos cases.

Esse comportamento é chamado de `fall-through`.

### default

É executado quando nenhum `case` corresponde ao valor informado.

### Código praticado

```java
public class Main {
    public static void main(String[] args) {
        int tipoServico = 9;

        switch (tipoServico) {
            case 1:
                System.out.println("Tipo de serviço: Montagem.");
                break;
            case 2:
                System.out.println("Tipo de serviço: Assistência técnica.");
                break;
            case 3:
                System.out.println("Tipo de serviço: Entrega.");
                break;
            case 4:
                System.out.println("Tipo de serviço: Vistoria.");
                break;
            case 5:
                System.out.println("Tipo de serviço: Troca.");
                break;
            default:
                System.out.println("Tipo de serviço inválido.");
        }
    }
}
```

### Cenários testados

```text
1 → Montagem
2 → Assistência técnica
5 → Troca
9 → Tipo inválido
```

### Aprendizado

`switch` deixa o código mais organizado quando existem muitos valores fixos.

---

## Aula 2.8 — Entrada de dados com Scanner

### Objetivo

Aprender a ler dados digitados pelo usuário.

### Import necessário

```java
import java.util.Scanner;
```

### Criando o Scanner

```java
Scanner scanner = new Scanner(System.in);
```

`System.in` representa a entrada padrão do sistema, normalmente o teclado.

### nextLine

Lê uma linha de texto.

```java
String nome = scanner.nextLine();
```

### nextInt

Lê um número inteiro.

```java
int idade = scanner.nextInt();
```

### nextDouble

Lê um número decimal.

```java
double valor = scanner.nextDouble();
```

No ambiente utilizado, valores decimais com vírgula foram aceitos.

Exemplo:

```text
120,5
```

Foi convertido para:

```text
120.5
```

### nextBoolean

Lê `true` ou `false`.

```java
boolean ativo = scanner.nextBoolean();
```

### scanner.close

Fecha o recurso de entrada.

```java
scanner.close();
```

### Problema clássico: nextInt com nextLine

Quando usamos `nextInt()` antes de `nextLine()`, o Enter pode ficar pendente.

Exemplo problemático:

```java
int idade = scanner.nextInt();
String nome = scanner.nextLine();
```

A leitura do nome pode ser pulada.

Solução:

```java
int idade = scanner.nextInt();
scanner.nextLine();
String nome = scanner.nextLine();
```

O `scanner.nextLine()` extra limpa o Enter pendente.

### Código praticado

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do técnico:");
        String nomeTecnico = scanner.nextLine();

        System.out.println("Digite a quantidade de serviços:");
        int quantidadeServicos = scanner.nextInt();

        System.out.println("Digite a meta de serviços:");
        int metaServicos = scanner.nextInt();

        System.out.println("Digite o valor por serviço:");
        double valorPorServico = scanner.nextDouble();

        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        double totalSemBonus = quantidadeServicos * valorPorServico;

        System.out.println("----- Resultado -----");
        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total sem bônus: R$ " + totalSemBonus);
        System.out.println("Atingiu a meta? " + atingiuMeta);

        scanner.close();
    }
}
```

### Cenário negativo validado

```text
Nome do técnico: Thiago
Quantidade de serviços: 8
Meta de serviços: 10
Valor por serviço: 120,5
```

Resultado:

```text
Total sem bônus: R$ 964.0
Atingiu a meta? false
```

### Aprendizado

Com `Scanner`, o programa deixa de ter apenas valores fixos e passa a receber dados do usuário.

---

## Aula 2.9 — Exercício integrador dos fundamentos iniciais

### Objetivo

Juntar os principais conceitos do Módulo 2 em um programa maior.

### Conceitos usados

- Scanner.
- String.
- int.
- double.
- boolean.
- Operadores aritméticos.
- Operadores de comparação.
- Operadores lógicos.
- switch.
- if / else if / else.
- Regras de negócio.

### Cenário

O programa simula um analisador de serviço técnico.

Dados lidos:

```text
nome do técnico
tipo de serviço
quantidade de serviços
meta de serviços
valor por serviço
técnico ativo
possui bloqueio
```

### Tipo de serviço

```text
1 = Montagem
2 = Assistência técnica
3 = Entrega
4 = Vistoria
5 = Troca
Outro = Tipo inválido
```

### Regra de meta

```java
boolean atingiuMeta = quantidadeServicos >= metaServicos;
```

### Regra de bônus

```java
boolean podeReceberBonus = atingiuMeta && tecnicoAtivo && !possuiBloqueio;
```

### Classificação de performance

```text
quantidadeServicos >= 15 → Excelente
quantidadeServicos >= 10 → Boa
quantidadeServicos >= 5  → Regular
menor que 5              → Baixa
```

### Código praticado

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do técnico:");
        String nomeTecnico = scanner.nextLine();

        System.out.println("Digite o tipo de serviço:");
        System.out.println("1 - Montagem");
        System.out.println("2 - Assistência técnica");
        System.out.println("3 - Entrega");
        System.out.println("4 - Vistoria");
        System.out.println("5 - Troca");
        int tipoServico = scanner.nextInt();

        System.out.println("Digite a quantidade de serviços:");
        int quantidadeServicos = scanner.nextInt();

        System.out.println("Digite a meta de serviços:");
        int metaServicos = scanner.nextInt();

        System.out.println("Digite o valor por serviço:");
        double valorPorServico = scanner.nextDouble();

        System.out.println("O técnico está ativo? true/false");
        boolean tecnicoAtivo = scanner.nextBoolean();

        System.out.println("O técnico possui bloqueio? true/false");
        boolean possuiBloqueio = scanner.nextBoolean();

        String descricaoTipoServico;

        switch (tipoServico) {
            case 1:
                descricaoTipoServico = "Montagem";
                break;
            case 2:
                descricaoTipoServico = "Assistência técnica";
                break;
            case 3:
                descricaoTipoServico = "Entrega";
                break;
            case 4:
                descricaoTipoServico = "Vistoria";
                break;
            case 5:
                descricaoTipoServico = "Troca";
                break;
            default:
                descricaoTipoServico = "Tipo inválido";
        }

        double totalBruto = quantidadeServicos * valorPorServico;
        boolean atingiuMeta = quantidadeServicos >= metaServicos;
        boolean podeReceberBonus = atingiuMeta && tecnicoAtivo && !possuiBloqueio;

        String classificacaoPerformance;

        if (quantidadeServicos >= 15) {
            classificacaoPerformance = "Excelente";
        } else if (quantidadeServicos >= 10) {
            classificacaoPerformance = "Boa";
        } else if (quantidadeServicos >= 5) {
            classificacaoPerformance = "Regular";
        } else {
            classificacaoPerformance = "Baixa";
        }

        System.out.println("----- Resultado da Análise -----");
        System.out.println("Técnico: " + nomeTecnico);
        System.out.println("Tipo de serviço: " + descricaoTipoServico);
        System.out.println("Quantidade de serviços: " + quantidadeServicos);
        System.out.println("Meta de serviços: " + metaServicos);
        System.out.println("Valor por serviço: R$ " + valorPorServico);
        System.out.println("Total bruto: R$ " + totalBruto);
        System.out.println("Técnico ativo? " + tecnicoAtivo);
        System.out.println("Possui bloqueio? " + possuiBloqueio);
        System.out.println("Atingiu a meta? " + atingiuMeta);
        System.out.println("Pode receber bônus? " + podeReceberBonus);
        System.out.println("Classificação de performance: " + classificacaoPerformance);

        scanner.close();
    }
}
```

### Cenários validados

#### Cenário aprovado

```text
tipoServico = 2
quantidadeServicos = 16
metaServicos = 10
tecnicoAtivo = true
possuiBloqueio = false
```

Resultado:

```text
Tipo de serviço: Assistência técnica
Atingiu a meta? true
Pode receber bônus? true
Classificação de performance: Excelente
```

#### Cenário bloqueado

```text
tipoServico = 2
quantidadeServicos = 16
metaServicos = 10
tecnicoAtivo = true
possuiBloqueio = true
```

Resultado:

```text
Atingiu a meta? true
Pode receber bônus? false
Classificação de performance: Excelente
```

#### Cenário abaixo da meta

```text
tipoServico = 9
quantidadeServicos = 4
metaServicos = 10
tecnicoAtivo = true
possuiBloqueio = false
```

Resultado:

```text
Tipo de serviço: Tipo inválido
Atingiu a meta? false
Pode receber bônus? false
Classificação de performance: Baixa
```

### Aprendizado

O exercício mostrou como vários conceitos pequenos se combinam para formar uma regra de negócio maior.

---

## Aula 2.10 — Revisão do Módulo 2

### Objetivo

Revisar o módulo antes de avançar para laços de repetição.

### Perguntas teóricas respondidas

#### Diferença entre = e ==

`=` atribui valor.

```java
int idade = 18;
```

`==` compara valor.

```java
idade == 18
```

#### Regra booleana com && e !

```java
boolean podeAcessar = usuarioAtivo && senhaCorreta && !contaBloqueada;
```

Significa:

```text
Pode acessar se:
usuário está ativo
E senha está correta
E conta não está bloqueada
```

#### Quando usar switch

Use `switch` quando há uma variável com valores fixos conhecidos.

Exemplo:

```text
1 = Aberta
2 = Agendada
3 = Em atendimento
```

#### O que acontece sem break

Sem `break`, o Java pode continuar executando os próximos cases.

Isso é chamado de `fall-through`.

#### Diferença entre nextLine e nextInt

`nextLine()` lê uma linha inteira de texto.

`nextInt()` lê um número inteiro.

### Exercício prático: Sistema de aprovação de OS

### Dados lidos

```text
nomeCliente
statusOs
valorServico
clienteAtivo
possuiPendencia
```

### Status da OS

```text
1 = Aberta
2 = Agendada
3 = Em atendimento
4 = Concluída
5 = Cancelada
Outro = Status inválido
```

### Regra principal

```java
boolean podeSeguirAtendimento = clienteAtivo && !possuiPendencia && statusOs == 2;
```

A OS só pode seguir para atendimento se:

- cliente estiver ativo;
- cliente não possuir pendência;
- status da OS for 2, ou seja, Agendada.

### Classificação de valor

```text
valorServico >= 500 → Serviço de alto valor
valorServico >= 200 → Serviço de médio valor
valorServico > 0    → Serviço de baixo valor
senão               → Valor inválido
```

### Código praticado

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Digite o nome do Cliente : ");
        String nomeCliente = scanner.nextLine();

        System.out.println("Digite o Status da OS:");
        System.out.println("1 - Aberta");
        System.out.println("2 - Agendada");
        System.out.println("3 - Em Atendimento");
        System.out.println("4 - Concluida");
        System.out.println("5 - Cancelada");
        int statusOs = scanner.nextInt();

        System.out.println("Digite o valor do serviço:");
        double valorServico = scanner.nextDouble();

        System.out.println("Cliente ativo? true/false");
        boolean clienteAtivo = scanner.nextBoolean();

        System.out.println("Possui Pendencia? true/false");
        boolean possuiPendencia = scanner.nextBoolean();

        String descricaoStatusOs;

        switch (statusOs) {
            case 1:
                descricaoStatusOs = "Aberta";
                break;
            case 2:
                descricaoStatusOs = "Agendada";
                break;
            case 3:
                descricaoStatusOs = "Em atendimento";
                break;
            case 4:
                descricaoStatusOs = "Concluída";
                break;
            case 5:
                descricaoStatusOs = "Cancelada";
                break;
            default:
                descricaoStatusOs = "Status inválido";
        }

        boolean podeSeguirAtendimento = clienteAtivo && !possuiPendencia && statusOs == 2;

        String classificacaoValor;

        if (valorServico >= 500) {
            classificacaoValor = "Serviço de alto valor";
        } else if (valorServico >= 200) {
            classificacaoValor = "Serviço de médio valor";
        } else if (valorServico > 0) {
            classificacaoValor = "Serviço de baixo valor";
        } else {
            classificacaoValor = "Valor inválido";
        }

        System.out.println("----- Resultado da Análise -----");
        System.out.println("Nome do cliente: " + nomeCliente);
        System.out.println("Status da OS: " + descricaoStatusOs);
        System.out.println("Valor do serviço: R$ " + valorServico);
        System.out.println("Cliente Ativo? " + clienteAtivo);
        System.out.println("Possui pendencia? " + possuiPendencia);
        System.out.println("Pode seguir para atendimento? " + podeSeguirAtendimento);
        System.out.println("Classificação do valor: " + classificacaoValor);

        scanner.close();
    }
}
```

### Cenário positivo validado

```text
nomeCliente = maria
statusOs = 2
valorServico = 350.0
clienteAtivo = true
possuiPendencia = false
```

Resultado:

```text
Status da OS: Agendada
Pode seguir para atendimento? true
Classificação do valor: Serviço de médio valor
```

### Cenário negativo validado

```text
nomeCliente = maria
statusOs = 2
valorServico = 350.0
clienteAtivo = true
possuiPendencia = true
```

Resultado:

```text
Status da OS: Agendada
Pode seguir para atendimento? false
Classificação do valor: Serviço de médio valor
```

### Aprendizado final do Módulo 2

O aluno encerrou o Módulo 2 dominando os fundamentos iniciais para começar estruturas de repetição.

Conceitos consolidados:

- Variáveis.
- Tipos primitivos.
- String.
- Operadores aritméticos.
- Operadores de comparação.
- Operadores lógicos.
- if / else if / else.
- switch.
- Scanner.
- Teste de cenários.
- Organização de projeto.
- Git e GitHub no fluxo de estudo.

---

# Módulo 3 — Laços de repetição

## Aula 3.1 — Introdução aos laços de repetição

Esta aula será iniciada após o fechamento do Módulo 2.

### Objetivo futuro

Entender como repetir blocos de código.

### Laços que serão estudados

```text
for
while
do while
```

### Por que isso importa para backend

Laços são usados para:

- Percorrer listas.
- Processar várias ordens de serviço.
- Validar coleções.
- Ler vários registros.
- Executar regras em massa.
- Processar dados de APIs.
- Automatizar validações repetitivas.

---

# Fluxo oficial de fechamento de aula

A partir deste ponto, cada aula deve seguir este fluxo:

```text
1. Explicação teórica
2. Exemplo simples
3. Exercício prático
4. Teste de cenário positivo
5. Teste de cenário negativo quando aplicável
6. Correção do código
7. Atualização do diário de bordo
8. Atualização do curso oficial quando houver conteúdo novo
9. Atualização dos atalhos quando houver atalho novo
10. Atualização do README quando o projeto mudar de forma relevante
11. Commit
12. Push
13. git status limpo
```

---

# Comandos Git usados no curso

## Ver status

```bash
git status
```

## Adicionar alterações

```bash
git add .
```

## Criar commit

```bash
git commit -m "Mensagem do commit"
```

## Enviar para GitHub

```bash
git push
```

## Validar arquivos versionados

```bash
git ls-files
```

---

# Atalhos registrados até agora

```text
1. main + Tab ou psvm + Tab
Cria o método main.

2. sout + Tab
Cria System.out.println();

3. Shift + F10
Executa o programa.

4. Ctrl + D
Duplica linha.

5. Ctrl + Y
Apaga linha.

6. Ctrl + Alt + L
Formata o código.

7. Ctrl + /
Comenta ou descomenta linha.

8. Alt + Insert
Cria novo arquivo ou classe.

9. Shift + F6
Renomeia variável, classe ou arquivo com segurança.

10. Ctrl + Espaço
Mostra sugestões de auto completar.

11. End
Vai para o final da linha.

12. Home
Vai para o começo da linha.

13. Shift + End / Shift + Home
Seleciona até o fim ou começo da linha.

14. Alt + Enter
Mostra ações rápidas e sugestões de correção.

15. Ctrl + F5
Roda novamente a última execução, se disponível.

16. Tab
Indenta.

17. Shift + Tab
Remove indentação.

18. Shift duas vezes
Busca em qualquer lugar do projeto.

19. Alt + F12
Abre o terminal integrado do IntelliJ.

20. Ctrl + F
Procura dentro do arquivo atual.
```

---

# Observações importantes de qualidade

## 1. Código pequeno deve ser digitado manualmente

O objetivo é desenvolver familiaridade com sintaxe Java.

Copiar tudo sem entender enfraquece o aprendizado.

## 2. Testar cenário positivo não basta

Sempre que possível, testar:

- Cenário positivo.
- Cenário negativo.
- Cenário bloqueado.
- Valor inválido.
- Limite de regra.

## 3. Git limpo antes de avançar

Antes de começar uma nova aula, o ideal é o projeto estar com:

```text
nothing to commit, working tree clean
```

## 4. Documentação faz parte do curso

A documentação não é acessório.

Ela consolida o aprendizado e transforma o estudo em material profissional.

---

# Próximos passos

A próxima etapa da formação será:

```text
Módulo 3
Aula 3.1 - Introdução aos laços de repetição
```

Conteúdo previsto:

- O que é repetição.
- Por que laços são importantes.
- Primeiro contato com `for`.
- Contadores.
- Incremento com `contador++`.
- Exercícios simulando processamento de atividades ou ordens de serviço.

---

# Histórico de conclusão até esta versão

## Módulo 1 concluído

- Aula 1.1 - Modelo da formação.
- Aula 1.2 - Instalação e validação do JDK.
- Aula 1.3 - Primeiro projeto Java no IntelliJ.
- Aula 1.4 - Entendendo primeiro programa Java.
- Aula 1.5 - Comentários.
- Aula 1.6 - Diário de bordo.
- Aula 1.7 - README.
- Aula 1.8 - Git inicial.
- Aula 1.9 - GitHub e push.
- Aula 1.10 - Estrutura profissional do projeto.

## Módulo 2 concluído

- Aula 2.1 - Variáveis.
- Aula 2.2 - Tipos primitivos.
- Aula 2.3 - Operadores aritméticos.
- Aula 2.4 - Operadores de comparação.
- Aula 2.5 - Operadores lógicos.
- Aula 2.6 - if / else if / else.
- Aula 2.7 - switch.
- Aula 2.8 - Scanner.
- Aula 2.9 - Exercício integrador dos fundamentos.
- Aula 2.10 - Revisão do Módulo 2.

---

# Encerramento desta versão

Este documento representa a versão inicial da documentação oficial do curso Java Backend do Thiago, cobrindo desde o ambiente até o encerramento do Módulo 2.

Ele deve ser incrementado continuamente conforme novos módulos forem estudados.

Atualizações futuras devem manter o padrão:

- Explicação conceitual.
- Exemplo simples.
- Código praticado.
- Resultado esperado.
- Erros comuns.
- Correções.
- Relação com backend.
- Relação com QA quando aplicável.
- Resumo da aula.


---

## Aula 3.1 - Introdução aos laços de repetição com for

### Objetivo da aula
Aprender o conceito de laço de repetição e dar o primeiro passo prático usando o for.

Laços de repetição permitem executar o mesmo bloco de código várias vezes sem precisar escrever várias linhas repetidas manualmente.

Sem laço, para processar três atividades, seria necessário escrever algo como:

    System.out.println("Processando atividade 1");
    System.out.println("Processando atividade 2");
    System.out.println("Processando atividade 3");

Com laço, o Java repete automaticamente com base em uma regra definida.

### Por que laços são importantes
Em backend, normalmente não trabalhamos com apenas um item.

É comum precisar:
- processar várias ordens de serviço;
- percorrer listas de clientes;
- validar várias atividades;
- somar valores de várias transações;
- processar dados vindos de uma API;
- percorrer registros vindos do banco de dados;
- gerar relatórios;
- validar coleções de objetos.

Em automação de testes, laços também aparecem para:
- repetir testes com massas diferentes;
- validar vários elementos em tela;
- percorrer arrays em respostas JSON;
- testar combinações de dados;
- validar listas de cards, tabelas e registros.

### Tipos principais de laço em Java
Os principais laços que serão estudados são:
- for;
- while;
- do while.

Nesta aula, o foco foi o for.

### Quando usar for
O for é muito usado quando sabemos ou controlamos a quantidade de repetições.

Exemplos:
- contar de 1 até 10;
- processar 5 atividades;
- percorrer uma lista com tamanho conhecido;
- repetir uma validação para cada item de uma coleção.

### Estrutura do for
A estrutura geral é:

    for (inicio; condicao; incremento) {
        bloco executado enquanto a condição for verdadeira
    }

Exemplo:

    for (int contador = 1; contador <= 5; contador++) {
        System.out.println("Contador: " + contador);
    }

Esse exemplo imprime de 1 até 5.

### Partes do for

#### Início
O início define onde a repetição começa.

    int contador = 1

Isso cria uma variável chamada contador começando em 1.

#### Condição
A condição define até quando o laço continua.

    contador <= 5

Enquanto essa condição for verdadeira, o bloco dentro do for será executado.

#### Incremento
O incremento define o que acontece ao final de cada repetição.

    contador++

Isso significa somar 1 ao contador.

É equivalente a:

    contador = contador + 1;

### Fluxo de execução do for
No exemplo contador de 1 até 5, o Java executa assim:

- contador começa em 1;
- verifica se 1 <= 5;
- como é verdadeiro, executa o bloco;
- imprime Contador: 1;
- executa contador++;
- contador vira 2;
- verifica se 2 <= 5;
- repete o processo;
- quando contador vira 6, a condição 6 <= 5 é falsa;
- o laço termina.

### Exemplo com contexto de OS
Foi testado um exemplo simulando processamento de ordens de serviço:

    public class Main {
        public static void main(String[] args) {

            for (int numeroOs = 1; numeroOs <= 5; numeroOs++) {
                System.out.println("Processando OS número: " + numeroOs);
            }

        }
    }

Resultado esperado:
- Processando OS número: 1
- Processando OS número: 2
- Processando OS número: 3
- Processando OS número: 4
- Processando OS número: 5

### Exercício final
Foi criado um programa simulando o processamento de atividades de uma OS.

Código praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Maria";
            int quantidadeAtividades = 3;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
            }

            System.out.println("Processamento finalizado.");
        }
    }

### Resultado validado
Com quantidadeAtividades = 3, o console exibiu:

- Cliente: Maria
- Processando atividade 1 de 3
- Processando atividade 2 de 3
- Processando atividade 3 de 3
- Processamento finalizado.

### Aprendizado principal
O ponto mais importante da aula foi entender que o for não precisa depender de um número fixo.

Ao usar:

    atividadeAtual <= quantidadeAtividades

o laço passa a respeitar o valor da variável quantidadeAtividades.

Se quantidadeAtividades for 5, o laço executa 5 vezes.
Se quantidadeAtividades for 3, o laço executa 3 vezes.
Se quantidadeAtividades for 100, o laço executa 100 vezes.

Isso torna o código mais flexível, reutilizável e profissional.

### Erros comuns
Erros comuns ao iniciar com for:
- esquecer o ponto e vírgula entre as três partes do for;
- esquecer o incremento;
- criar uma condição que nunca fica falsa;
- começar o contador em 0 quando queria começar em 1;
- usar limite fixo quando deveria usar uma variável;
- confundir contador++ com comparação.

### Relação com backend
Em backend, o conceito aprendido nesta aula será usado futuramente para percorrer listas, coleções e resultados de banco ou API.

Mesmo que no futuro o Java moderno use estruturas como for-each e streams, entender o for tradicional é fundamental para compreender a base da linguagem.

### Resumo da aula
- Laço repete um bloco de código.
- for é usado quando controlamos a quantidade de repetições.
- O for possui início, condição e incremento.
- contador++ soma 1 ao contador.
- O bloco executa enquanto a condição for verdadeira.
- Usar variável como limite torna o código flexível.

---

## Aula 3.2 - Laço for com soma e acumuladores

### Objetivo da aula
Aprender a usar o laço for para somar valores progressivamente.

Na aula anterior, o for foi usado apenas para repetir mensagens no console.

Nesta aula, o for passou a executar uma regra mais útil: acumular valores.

Esse conceito é fundamental para backend, porque muitos sistemas precisam calcular totais, somar itens, processar registros e gerar valores consolidados.

### O que é um acumulador
Um acumulador é uma variável usada para guardar um valor que vai sendo atualizado durante a execução do programa.

Exemplo simples:

    int total = 0;

    total = total + 10;
    total = total + 20;
    total = total + 30;

Ao final, total vale 60.

A variável total acumulou os valores 10, 20 e 30.

### Acumulador dentro do for
O acumulador fica fora do for, porque ele precisa manter o valor entre as repetições.

Exemplo:

    int total = 0;

    for (int numero = 1; numero <= 5; numero++) {
        total = total + numero;
    }

Se o total fosse declarado dentro do for, ele seria recriado a cada repetição e perderia o valor anterior.

### Exemplo somando números de 1 até 5
Código de exemplo:

    public class Main {
        public static void main(String[] args) {
            int total = 0;

            for (int numero = 1; numero <= 5; numero++) {
                total = total + numero;
                System.out.println("Número atual: " + numero);
                System.out.println("Total acumulado: " + total);
            }

            System.out.println("Resultado final: " + total);
        }
    }

Fluxo do cálculo:
- total começa em 0.
- numero = 1, total = 0 + 1 = 1.
- numero = 2, total = 1 + 2 = 3.
- numero = 3, total = 3 + 3 = 6.
- numero = 4, total = 6 + 4 = 10.
- numero = 5, total = 10 + 5 = 15.

Resultado final:
- 15.

### Forma completa e forma abreviada
A forma completa da soma é:

    total = total + numero;

Existe também uma forma abreviada:

    total += numero;

As duas fazem a mesma coisa.

Nesta fase inicial, a forma completa ajuda a entender melhor o raciocínio.

### Diferença entre contador e acumulador
Contador e acumulador não são a mesma coisa.

O contador controla a quantidade de repetições.

Exemplo:

    atividadeAtual

O acumulador guarda um valor calculado ao longo das repetições.

Exemplo:

    totalOs

Em um processamento de OS:
- atividadeAtual indica qual atividade está sendo processada.
- totalOs guarda o valor total acumulado da OS.

### Exemplo com contexto de OS
Uma OS pode ter várias atividades.

Se cada atividade possui um valor, o sistema pode usar um for para processar cada atividade e somar o valor no total da OS.

Exemplo:

    public class Main {
        public static void main(String[] args) {
            int quantidadeAtividades = 5;
            double valorPorAtividade = 100.00;
            double totalOs = 0.0;

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                totalOs = totalOs + valorPorAtividade;

                System.out.println("Atividade " + atividadeAtual + " processada.");
                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("Total final da OS: R$ " + totalOs);
        }
    }

Resultado esperado:
- Atividade 1 processada. Total parcial: R$ 100.0.
- Atividade 2 processada. Total parcial: R$ 200.0.
- Atividade 3 processada. Total parcial: R$ 300.0.
- Atividade 4 processada. Total parcial: R$ 400.0.
- Atividade 5 processada. Total parcial: R$ 500.0.
- Total final da OS: R$ 500.0.

### Exercício final da aula
Foi criado um programa chamado mentalmente de Calculadora de Total da OS.

Variáveis usadas:
- nomeCliente;
- quantidadeAtividades;
- valorPorAtividade;
- totalOs.

Código praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Maria";
            int quantidadeAtividades = 3;
            double valorPorAtividade = 200.00;
            double totalOs = 0.0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                totalOs = totalOs + valorPorAtividade;

                System.out.println("Processando atividade " + atividadeAtual + " de " + quantidadeAtividades);
                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("Total final da OS: R$ " + totalOs);
        }
    }

### Resultado validado
Com:
- quantidadeAtividades = 3;
- valorPorAtividade = 200.00;

O console exibiu:
- Cliente: Maria.
- Processando atividade 1 de 3.
- Total parcial da OS: R$ 200.0.
- Processando atividade 2 de 3.
- Total parcial da OS: R$ 400.0.
- Processando atividade 3 de 3.
- Total parcial da OS: R$ 600.0.
- Total final da OS: R$ 600.0.

### Aprendizado principal
O aprendizado principal foi entender que uma variável pode guardar um valor progressivo durante o laço.

A cada repetição, o programa reaproveita o valor anterior de totalOs e soma um novo valor.

Essa lógica é usada em muitos cenários reais, como:
- calcular total de uma OS;
- somar valores de produtos;
- calcular total de transações;
- somar remunerações;
- calcular quantidade total de itens;
- gerar totais em relatórios;
- consolidar valores retornados de banco de dados.

### Atenção sobre dinheiro
Nesta fase, foi usado double para simplificar o aprendizado.

Em backend real, valores monetários devem ser tratados com BigDecimal.

Motivo:
- double pode apresentar problemas de precisão em cálculos financeiros;
- BigDecimal oferece maior controle para valores monetários;
- BigDecimal será estudado futuramente em momento apropriado.

### Erros comuns
Erros comuns ao usar acumuladores:
- declarar o acumulador dentro do for;
- esquecer de inicializar o acumulador;
- atualizar o acumulador fora do local correto;
- confundir contador com acumulador;
- usar int quando o valor pode ser decimal;
- esperar que o total seja calculado automaticamente sem somar dentro do laço.

### Relação com backend
Em backend, acumuladores aparecem em várias situações:
- cálculo de total de pedidos;
- totalização de atividades;
- soma de valores de notas fiscais;
- cálculo de remuneração;
- consolidação de relatórios;
- processamento de listas;
- totalização de registros retornados de consultas.

Mesmo que futuramente sejam usadas listas, streams e banco de dados, entender acumulador com for é essencial para compreender a base dos cálculos.

### Resumo da aula
- Acumulador guarda um valor progressivo.
- O acumulador deve ser criado antes do for.
- O contador controla a repetição.
- O acumulador guarda o resultado.
- totalOs = totalOs + valorPorAtividade soma um novo valor ao total anterior.
- O total parcial mostra o andamento do cálculo.
- O total final aparece depois que o for termina.


---

## Aula 3.3 - Laço for com condicionais dentro da repetição

### Objetivo da aula
Aprender a usar condicionais dentro de um laço for.

Até este ponto, o for já tinha sido usado para repetir mensagens e acumular valores.

Nesta aula, o for passou a tomar decisões durante a repetição.

Isso significa que, para cada volta do laço, o programa pode analisar uma regra e decidir o que fazer com o item atual.

### Por que usar if dentro do for
Em sistemas reais, nem todos os itens devem ser tratados da mesma forma.

Exemplos:
- uma atividade concluída entra no total da OS;
- uma atividade pendente não entra no total;
- uma atividade cancelada pode ser ignorada;
- uma atividade com erro pode gerar alerta;
- um item inválido pode bloquear o processamento;
- um produto ativo pode ser vendido;
- um produto inativo pode ser desconsiderado.

A estrutura geral fica assim:

    for (...) {
        if (...) {
            // processa item válido
        } else {
            // trata item inválido ou fora da regra
        }
    }

### Primeiro exemplo: par ou ímpar
Foi usado o operador de resto da divisão para identificar números pares e ímpares.

Exemplo:

    public class Main {
        public static void main(String[] args) {

            for (int numero = 1; numero <= 5; numero++) {
                if (numero % 2 == 0) {
                    System.out.println("Número " + numero + " é par.");
                } else {
                    System.out.println("Número " + numero + " é ímpar.");
                }
            }

        }
    }

A regra:

    numero % 2 == 0

significa que, se o resto da divisão por 2 for zero, o número é par.

### Operador %
O operador % retorna o resto da divisão.

Exemplos:
- 2 % 2 = 0
- 3 % 2 = 1
- 4 % 2 = 0
- 5 % 2 = 1

Por isso, números com resto zero na divisão por 2 são pares.

### Segundo exemplo: somar apenas números pares
Foi criado um exemplo usando for, if e acumulador juntos.

Ideia:
- percorrer números de 1 até 10;
- se o número for par, somar;
- se for ímpar, ignorar.

Código de referência:

    public class Main {
        public static void main(String[] args) {
            int totalPares = 0;

            for (int numero = 1; numero <= 10; numero++) {
                if (numero % 2 == 0) {
                    totalPares = totalPares + numero;
                    System.out.println("Somando número par: " + numero);
                    System.out.println("Total parcial: " + totalPares);
                } else {
                    System.out.println("Ignorando número ímpar: " + numero);
                }
            }

            System.out.println("Total final dos pares: " + totalPares);
        }
    }

Resultado final:
- 2 + 4 + 6 + 8 + 10 = 30.

### Exemplo com contexto de OS
O conceito foi aplicado a uma OS com atividades concluídas e pendentes.

Regra:
- atividades concluídas entram no total;
- atividades pendentes não entram no total.

Exemplo:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Maria";
            int quantidadeAtividades = 6;
            int atividadesConcluidas = 4;
            double valorPorAtividade = 150.00;
            double totalOs = 0.0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                if (atividadeAtual <= atividadesConcluidas) {
                    totalOs = totalOs + valorPorAtividade;

                    System.out.println("Atividade " + atividadeAtual + " concluída.");
                    System.out.println("Total parcial da OS: R$ " + totalOs);
                } else {
                    System.out.println("Atividade " + atividadeAtual + " pendente.");
                    System.out.println("Não entrou no total da OS.");
                }
            }

            System.out.println("Total final da OS: R$ " + totalOs);
        }
    }

Com 6 atividades e 4 concluídas, apenas as 4 primeiras entram no total.

Total:
- 4 x R$ 150.00 = R$ 600.0.

### Regra principal da aula
A regra usada foi:

    if (atividadeAtual <= atividadesConcluidas)

Essa condição verifica se a atividade atual está dentro da quantidade de atividades concluídas.

Exemplo:
- atividadesConcluidas = 4;
- atividadeAtual = 1, 2, 3 ou 4 entram no if;
- atividadeAtual = 5 ou 6 caem no else.

### Exercício final da aula
Foi criado um programa chamado mentalmente de Processador de Atividades Concluídas.

Variáveis usadas:
- nomeCliente;
- quantidadeAtividades;
- atividadesConcluidas;
- valorPorAtividade;
- totalOs;
- totalConcluidas;
- totalPendentes.

Código praticado:

    public class Main {
        public static void main(String[] args) {
            String nomeCliente = "Carlos";
            int quantidadeAtividades = 6;
            int atividadesConcluidas = 2;
            double valorPorAtividade = 200.00;
            double totalOs = 0.0;
            int totalConcluidas = 0;
            int totalPendentes = 0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                if (atividadeAtual <= atividadesConcluidas) {
                    totalOs = totalOs + valorPorAtividade;
                    totalConcluidas++;

                    System.out.println("Atividade " + atividadeAtual + " concluída.");
                    System.out.println("Total parcial da OS: R$ " + totalOs);
                } else {
                    totalPendentes++;

                    System.out.println("Atividade " + atividadeAtual + " pendente.");
                }
            }

            System.out.println("----- Resumo da OS -----");
            System.out.println("Total de atividades concluídas: " + totalConcluidas);
            System.out.println("Total de atividades pendentes: " + totalPendentes);
            System.out.println("Total final da OS: R$ " + totalOs);
        }
    }

### Resultado validado
Com:
- quantidadeAtividades = 6;
- atividadesConcluidas = 2;
- valorPorAtividade = 200.00;

Resultado:
- Atividade 1 concluída.
- Atividade 2 concluída.
- Atividade 3 pendente.
- Atividade 4 pendente.
- Atividade 5 pendente.
- Atividade 6 pendente.
- Total de atividades concluídas: 2.
- Total de atividades pendentes: 4.
- Total final da OS: R$ 400.0.

### Aprendizado principal
O aprendizado principal foi entender que uma repetição pode ter regras internas.

O for percorre todos os itens.

O if decide o que fazer com cada item.

O acumulador soma apenas os itens aprovados pela regra.

Os contadores adicionais registram quantos itens caíram em cada cenário.

### Três controles usados
Nesta aula foram usados três controles importantes:

    double totalOs = 0.0;
    int totalConcluidas = 0;
    int totalPendentes = 0;

Função de cada um:
- totalOs acumula o valor financeiro das atividades concluídas;
- totalConcluidas conta quantas atividades foram concluídas;
- totalPendentes conta quantas atividades ficaram pendentes.

### Relação com backend
Essa lógica aparece muito em backend.

Um sistema pode precisar retornar um resumo como:

    totalAtividades: 6
    totalConcluidas: 2
    totalPendentes: 4
    valorTotal: 400.0

Mesmo antes de estudar listas, banco de dados e JSON, a base lógica desse processamento já está aqui.

### Exemplos reais de uso
Esse padrão pode ser usado para:
- somar apenas transações aprovadas;
- contar atividades concluídas;
- ignorar itens cancelados;
- processar apenas clientes ativos;
- calcular total de produtos válidos;
- gerar resumo de status;
- separar registros válidos e inválidos;
- montar relatórios.

### Erros comuns
Erros comuns ao usar if dentro do for:
- colocar o acumulador no lugar errado;
- somar no total mesmo quando o item deveria ser ignorado;
- esquecer de incrementar o contador de pendentes;
- usar a condição invertida;
- esquecer o else;
- declarar contadores dentro do for;
- não testar cenário positivo e negativo.

### Resumo da aula
- O for repete.
- O if decide.
- O else trata o caso contrário.
- O acumulador soma apenas o que passa na regra.
- Contadores adicionais podem registrar quantidades por status.
- Essa lógica é base para processamentos reais em backend.

---

## Aula 3.4 - Laço for com Scanner

### Objetivo da aula
Aprender a combinar Scanner com o laço for.

Até aqui, o for usava valores definidos diretamente no código.

Exemplo:

    int quantidadeAtividades = 6;

Nesta aula, a quantidade passou a ser informada pelo usuário.

Exemplo:

    int quantidadeAtividades = scanner.nextInt();

Isso deixou o programa mais dinâmico, porque o usuário passou a controlar quantas vezes o laço será executado.

### Diferença entre valor fixo e valor digitado
Quando usamos valor fixo, o programa sempre executa com a mesma quantidade.

Exemplo:

    int quantidadeAtividades = 3;

Nesse caso, o for sempre executa 3 vezes, a menos que o código seja alterado.

Quando usamos Scanner:

    int quantidadeAtividades = scanner.nextInt();

o usuário informa a quantidade durante a execução.

Se digitar 3, o for executa 3 vezes.
Se digitar 5, o for executa 5 vezes.
Se digitar 10, o for executa 10 vezes.

### Primeiro exemplo da aula
Foi testado um programa simples em que o usuário informa a quantidade de repetições.

Código de referência:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            System.out.println("Digite a quantidade de repetições:");
            int quantidadeRepeticoes = scanner.nextInt();

            for (int contador = 1; contador <= quantidadeRepeticoes; contador++) {
                System.out.println("Repetição número: " + contador);
            }

            scanner.close();
        }
    }

Esse exemplo mostrou que o for pode usar uma variável lida pelo Scanner como limite.

### Lendo valores dentro do for
Depois, foi estudado um exemplo em que o usuário informa o valor de cada atividade dentro do próprio laço.

Código de referência:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            System.out.println("Digite a quantidade de atividades:");
            int quantidadeAtividades = scanner.nextInt();

            double totalOs = 0.0;

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                System.out.println("Digite o valor da atividade " + atividadeAtual + ":");
                double valorAtividade = scanner.nextDouble();

                totalOs = totalOs + valorAtividade;

                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("Total final da OS: R$ " + totalOs);

            scanner.close();
        }
    }

### O que esse exemplo ensina
Esse exemplo ensina três coisas importantes:

1. O usuário define quantas atividades serão processadas.
2. O for repete com base nessa quantidade.
3. Dentro de cada repetição, o usuário informa um novo valor.

Isso é mais realista do que usar um único valor fixo para todas as atividades.

### Exercício final da aula
Foi criado um programa chamado mentalmente de Calculadora Dinâmica de OS.

O programa pede:
- nome do cliente;
- quantidade de atividades;
- valor de cada atividade.

O programa calcula:
- total parcial da OS;
- quantidade de atividades processadas;
- total final da OS.

Código praticado:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            System.out.println("Digite o nome do cliente:");
            String nomeCliente = scanner.nextLine();

            System.out.println("Digite a quantidade de atividades:");
            int quantidadeAtividades = scanner.nextInt();

            double totalOs = 0.0;

            System.out.println("Cliente: " + nomeCliente);

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                System.out.println("Digite o valor da atividade " + atividadeAtual + ":");
                double valorAtividade = scanner.nextDouble();

                totalOs = totalOs + valorAtividade;

                System.out.println("Atividade " + atividadeAtual + " processada.");
                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("----- Resumo da OS -----");
            System.out.println("Cliente: " + nomeCliente);
            System.out.println("Quantidade de atividades processadas: " + quantidadeAtividades);
            System.out.println("Total final da OS: R$ " + totalOs);

            scanner.close();
        }
    }

### Resultado validado - Maria
Dados informados:
- Cliente: maria;
- Quantidade de atividades: 3;
- Valores: 100, 200 e 300.

Resultado:
- Total parcial após atividade 1: R$ 100.0;
- Total parcial após atividade 2: R$ 300.0;
- Total parcial após atividade 3: R$ 600.0;
- Total final da OS: R$ 600.0.

### Resultado validado - Carlos
Dados informados:
- Cliente: carlos;
- Quantidade de atividades: 4;
- Valores: 120,5, 80, 200 e 99,5.

Cálculo:
- 120,5 + 80 = 200,5;
- 200,5 + 200 = 400,5;
- 400,5 + 99,5 = 500,0.

Resultado:
- Total final da OS: R$ 500.0.

### Conceito principal da aula
O conceito principal pode ser resumido assim:

    Scanner fornece os dados.
    for controla a repetição.
    acumulador calcula o total.

No exercício:
- scanner.nextLine leu o nome do cliente;
- scanner.nextInt leu a quantidade de atividades;
- scanner.nextDouble leu o valor de cada atividade;
- for repetiu conforme a quantidade informada;
- totalOs acumulou os valores digitados.

### Ponto de atenção sobre nextLine e nextInt
Nesta aula, a ordem usada foi:

    String nomeCliente = scanner.nextLine();
    int quantidadeAtividades = scanner.nextInt();

Essa ordem não gerou problema.

O problema clássico acontece quando lemos número primeiro e depois texto com nextLine.

Exemplo problemático:

    int idade = scanner.nextInt();
    String nome = scanner.nextLine();

Nesse caso, pode ser necessário limpar o Enter pendente com:

    scanner.nextLine();

Esse ponto já havia sido estudado na aula de Scanner, mas foi reforçado aqui.

### Relação com backend
Essa lógica se aproxima de processamentos reais.

Um backend pode receber:
- quantidade de itens;
- valores de produtos;
- atividades de uma OS;
- parcelas;
- transações;
- registros de uma solicitação.

Depois, o sistema pode percorrer esses dados, processar cada item e calcular um total.

Nesta fase ainda estamos usando console e Scanner, mas a lógica é a mesma que futuramente será aplicada com listas, objetos, JSON, APIs e banco de dados.

### Exemplos reais de uso
Esse padrão pode ser usado para:
- calcular total de uma OS;
- somar valores de produtos;
- processar atividades informadas;
- calcular total de um pedido;
- somar transações;
- gerar resumo financeiro;
- processar uma lista de itens enviada por uma API.

### Erros comuns
Erros comuns ao usar Scanner com for:
- ler a quantidade depois do for;
- usar um limite fixo em vez da variável digitada;
- esquecer de inicializar o acumulador antes do for;
- declarar o acumulador dentro do for;
- esquecer de somar o valor digitado;
- confundir valorAtividade com totalOs;
- esquecer scanner.close;
- ter problemas com nextLine depois de nextInt.

### Resumo da aula
- O usuário pode definir a quantidade de repetições.
- O for pode usar uma variável lida pelo Scanner como limite.
- É possível ler valores dentro do for.
- Cada repetição pode receber um valor diferente.
- O acumulador soma os valores digitados.
- O programa fica mais dinâmico e mais próximo de um processamento real.

---

## Aula 3.5 - Laço while

### Objetivo da aula
Aprender o laço de repetição while.

O while é usado quando queremos repetir um bloco de código enquanto uma condição continuar verdadeira.

A palavra while pode ser entendida como enquanto.

Exemplo em português:

    Enquanto o usuário não escolher sair:
        exibir o menu
        ler a opção
        executar a ação escolhida

### Diferença entre for e while
O for é mais usado quando sabemos ou controlamos claramente a quantidade de repetições.

Exemplo:

    for (int contador = 1; contador <= 5; contador++) {
        System.out.println(contador);
    }

Nesse caso, está claro que o laço vai de 1 até 5.

O while é mais usado quando a repetição depende de uma condição.

Exemplo:

    while (opcao != 0) {
        // continua executando enquanto a opção for diferente de 0
    }

A quantidade de repetições pode variar. Pode executar uma vez, várias vezes ou nenhuma vez, dependendo da condição.

### Estrutura do while
A estrutura básica é:

    while (condicao) {
        bloco que será repetido
    }

O bloco será executado enquanto a condição for verdadeira.

Quando a condição ficar falsa, o laço termina.

### Primeiro exemplo com while
Foi testado um contador simples usando while.

Código de referência:

    public class Main {
        public static void main(String[] args) {
            int contador = 1;

            while (contador <= 5) {
                System.out.println("Contador: " + contador);
                contador++;
            }
        }
    }

Resultado esperado:
- Contador: 1
- Contador: 2
- Contador: 3
- Contador: 4
- Contador: 5

### Fluxo do contador
O fluxo acontece assim:

- contador começa em 1;
- verifica se 1 <= 5;
- como é verdadeiro, imprime;
- contador++ soma 1;
- contador vira 2;
- verifica novamente;
- repete até contador virar 6;
- quando contador é 6, a condição 6 <= 5 é falsa;
- o while termina.

### Loop infinito
Loop infinito acontece quando a condição do while nunca fica falsa.

Exemplo perigoso:

    int contador = 1;

    while (contador <= 5) {
        System.out.println("Contador: " + contador);
    }

Neste exemplo, falta contador++.

O contador fica sempre 1.

A condição contador <= 5 continua sempre verdadeira.

O programa nunca para sozinho.

### Como evitar loop infinito
Para evitar loop infinito, é preciso garantir que algo dentro do while possa tornar a condição falsa.

Exemplos:
- incrementar um contador;
- alterar uma variável de controle;
- ler uma nova opção do usuário;
- mudar um status;
- sair quando uma condição de parada for atingida.

### Comparação entre for e while no mesmo cenário
Com for:

    for (int contador = 1; contador <= 5; contador++) {
        System.out.println("Contador: " + contador);
    }

Com while:

    int contador = 1;

    while (contador <= 5) {
        System.out.println("Contador: " + contador);
        contador++;
    }

Os dois exemplos fazem a mesma coisa.

A diferença é que no for o início, a condição e o incremento ficam na mesma linha.

No while:
- a variável é criada antes;
- a condição fica no while;
- o incremento fica dentro do bloco.

### Exemplo com Scanner
Foi estudado um exemplo de menu simples.

Código de referência:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            int opcao = 1;

            while (opcao != 0) {
                System.out.println("Digite uma opção:");
                System.out.println("1 - Processar OS");
                System.out.println("0 - Sair");

                opcao = scanner.nextInt();

                if (opcao == 1) {
                    System.out.println("OS processada.");
                } else if (opcao == 0) {
                    System.out.println("Sistema encerrado.");
                } else {
                    System.out.println("Opção inválida.");
                }
            }

            scanner.close();
        }
    }

### Explicação do menu simples
A variável opcao controla o while.

A condição:

    while (opcao != 0)

significa:

    enquanto a opção for diferente de 0, continue executando.

Se o usuário digitar 1:
- o sistema processa a OS;
- o menu aparece novamente.

Se digitar 9:
- o sistema mostra opção inválida;
- o menu aparece novamente.

Se digitar 0:
- o sistema encerra;
- a condição do while fica falsa;
- o laço termina.

### Exercício final da aula
Foi criado um programa chamado mentalmente de Menu de Processamento de OS.

O menu possui as opções:
- 1 - Processar nova OS;
- 2 - Exibir quantidade de OS processadas;
- 0 - Sair.

Regras:
- enquanto o usuário não digitar 0, o menu continua aparecendo;
- se digitar 1, o sistema soma 1 no total de OS processadas;
- se digitar 2, o sistema exibe o total de OS processadas;
- se digitar 0, o sistema encerra;
- se digitar qualquer outro número, mostra opção inválida.

### Código praticado
Código final da aula:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            int opcao = -1;
            int totalOsProcessadas = 0;

            while (opcao != 0) {
                System.out.println("----- Menu de OS -----");
                System.out.println("1 - Processar nova OS");
                System.out.println("2 - Exibir quantidade de OS processadas");
                System.out.println("0 - Sair");
                System.out.println("Digite uma opção:");

                opcao = scanner.nextInt();

                if (opcao == 1) {
                    totalOsProcessadas++;
                    System.out.println("OS processada com sucesso.");
                } else if (opcao == 2) {
                    System.out.println("Total de OS processadas: " + totalOsProcessadas);
                } else if (opcao == 0) {
                    System.out.println("Encerrando sistema.");
                } else {
                    System.out.println("Opção inválida.");
                }
            }

            System.out.println("Total final de OS processadas: " + totalOsProcessadas);

            scanner.close();
        }
    }

### Por que opcao começa com -1
A variável opcao começa com -1 para garantir que seja diferente de 0.

Como a condição do while é:

    opcao != 0

se opcao começasse com 0, o while nem executaria.

Com opcao = -1, o menu aparece pela primeira vez.

### Contador de OS processadas
A variável:

    int totalOsProcessadas = 0;

guarda quantas OS foram processadas.

Ela começa em 0 porque nenhuma OS foi processada no início.

Quando o usuário digita 1, executa:

    totalOsProcessadas++;

Isso soma 1 ao total.

É equivalente a:

    totalOsProcessadas = totalOsProcessadas + 1;

### Opção 2
A opção 2 apenas exibe o total.

Ela não altera o contador.

Exemplo:
- se o total está 2;
- o usuário digita 2;
- o sistema mostra 2;
- o total continua 2.

### Opção 9
A opção 9 foi usada para testar entrada inválida.

Quando o usuário digita 9:
- não processa OS;
- não altera o contador;
- mostra opção inválida;
- o menu continua.

### Opção 0
A opção 0 encerra o programa.

Quando o usuário digita 0:
- opcao passa a valer 0;
- a mensagem Encerrando sistema é exibida;
- ao voltar para a condição do while, opcao != 0 fica falso;
- o laço termina;
- o total final é exibido.

### Sequência validada
Foi testada a sequência:

- 2
- 1
- 1
- 2
- 9
- 1
- 2
- 0

### Resultado da sequência
A sequência gerou o seguinte comportamento:

- opção 2 mostrou Total de OS processadas: 0;
- opção 1 processou uma OS;
- opção 1 processou mais uma OS;
- opção 2 mostrou Total de OS processadas: 2;
- opção 9 mostrou Opção inválida;
- opção 1 processou mais uma OS;
- opção 2 mostrou Total de OS processadas: 3;
- opção 0 encerrou o sistema;
- total final exibido: 3.

### Aprendizado principal
O aprendizado principal foi entender que o while permite criar programas que continuam executando até uma condição de parada acontecer.

No exercício, a condição de parada foi o usuário digitar 0.

Enquanto isso não aconteceu, o menu continuou aparecendo.

### Relação com backend
Menus de console são simples, mas o conceito do while é usado em backend em várias situações.

Exemplos:
- enquanto houver mensagens na fila, processe;
- enquanto houver registros pendentes, continue processando;
- enquanto existir próxima página de resultados, busque a próxima;
- enquanto o status não for finalizado, continue verificando;
- enquanto houver dados para importar, continue importando.

Exemplo conceitual:

    while (temProximaPagina) {
        buscarProximaPagina();
    }

Outro exemplo conceitual:

    while (existeMensagemNaFila) {
        processarMensagem();
    }

A estrutura muda, mas a lógica é a mesma.

### Erros comuns
Erros comuns com while:
- esquecer de atualizar a variável de controle;
- criar uma condição que nunca fica falsa;
- iniciar a variável com um valor que impede o while de executar;
- atualizar o contador no lugar errado;
- reiniciar acumuladores dentro do while;
- não tratar opção inválida;
- esquecer scanner.close;
- confundir while com for.

### Resumo da aula
- while significa enquanto.
- O while repete enquanto a condição for verdadeira.
- O while é útil quando a quantidade de repetições depende de uma condição.
- É preciso garantir que a condição possa ficar falsa.
- Caso contrário, pode ocorrer loop infinito.
- Menus são exemplos clássicos de uso do while.
- O usuário pode controlar quando o laço termina.

---

## Aula 3.6 - Laço do while

### Objetivo da aula
Aprender o laço de repetição do while.

O do while é uma estrutura de repetição parecida com o while, mas com uma diferença muito importante: ele executa o bloco primeiro e verifica a condição depois.

Isso significa que o bloco do do while sempre executa pelo menos uma vez.

### Estrutura do do while
A estrutura básica é:

    do {
        bloco executado
    } while (condicao);

O ponto e vírgula no final é obrigatório.

Isso diferencia o do while do while comum.

### Diferença entre while e do while
O while verifica a condição antes de executar o bloco.

Exemplo:

    int contador = 10;

    while (contador <= 5) {
        System.out.println("Contador: " + contador);
        contador++;
    }

Nesse caso, nada será impresso, porque a condição contador <= 5 já começa falsa.

O do while executa o bloco antes de verificar a condição.

Exemplo:

    int contador = 10;

    do {
        System.out.println("Contador: " + contador);
        contador++;
    } while (contador <= 5);

Nesse caso, será impresso Contador: 10, mesmo a condição sendo falsa depois.

### Resumo da diferença
- while verifica antes de executar.
- do while executa antes de verificar.
- while pode executar zero vezes.
- do while executa pelo menos uma vez.

### Primeiro exemplo com do while
Foi testado um contador de 1 até 5.

Código de referência:

    public class Main {
        public static void main(String[] args) {
            int contador = 1;

            do {
                System.out.println("Contador: " + contador);
                contador++;
            } while (contador <= 5);
        }
    }

Resultado:
- Contador: 1
- Contador: 2
- Contador: 3
- Contador: 4
- Contador: 5

### Exemplo com condição inicialmente falsa
Foi testado também um contador começando em 10.

Código de referência:

    public class Main {
        public static void main(String[] args) {
            int contador = 10;

            do {
                System.out.println("Contador: " + contador);
                contador++;
            } while (contador <= 5);
        }
    }

Resultado:
- Contador: 10

Esse exemplo mostra claramente que o do while executa pelo menos uma vez.

### Quando usar do while
Use do while quando uma primeira execução é obrigatória.

Exemplos:
- exibir um menu pelo menos uma vez;
- pedir uma opção ao usuário pelo menos uma vez;
- solicitar uma senha antes de validar;
- pedir dados antes de perguntar se deseja continuar;
- executar uma tentativa inicial antes de decidir repetir.

### Menu com do while
Foi criado um menu simples usando do while.

Código de referência:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            int opcao;

            do {
                System.out.println("----- Menu de OS -----");
                System.out.println("1 - Processar OS");
                System.out.println("0 - Sair");
                System.out.println("Digite uma opção:");

                opcao = scanner.nextInt();

                if (opcao == 1) {
                    System.out.println("OS processada.");
                } else if (opcao == 0) {
                    System.out.println("Sistema encerrado.");
                } else {
                    System.out.println("Opção inválida.");
                }
            } while (opcao != 0);

            scanner.close();
        }
    }

### Diferença no controle da variável opcao
No while comum, normalmente inicializamos a variável antes.

Exemplo:

    int opcao = -1;

    while (opcao != 0) {
        ...
    }

Isso é necessário porque o while verifica a condição antes de executar.

No do while, podemos declarar:

    int opcao;

E atribuir valor dentro do bloco:

    opcao = scanner.nextInt();

Isso funciona porque o bloco executa antes da condição ser verificada.

### Atenção ao ponto e vírgula
No do while, a linha final precisa terminar com ponto e vírgula:

    } while (opcao != 0);

Esse ponto e vírgula faz parte da sintaxe do do while.

No while comum, a estrutura é diferente:

    while (opcao != 0) {
        ...
    }

### Exercício final da aula
Foi criado um programa chamado mentalmente de Menu de Atendimento com do while.

O menu possui as opções:
- 1 - Processar nova OS;
- 2 - Exibir quantidade de OS processadas;
- 3 - Exibir status do sistema;
- 0 - Sair.

Regras:
- o menu deve aparecer pelo menos uma vez;
- se digitar 1, soma 1 no total de OS processadas;
- se digitar 2, mostra o total de OS processadas;
- se digitar 3, mostra a mensagem de status do sistema;
- se digitar 0, encerra;
- qualquer outro número mostra opção inválida;
- ao final, mostra o total final de OS processadas.

### Código praticado
Código final da aula:

    import java.util.Scanner;

    public class Main {
        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);

            int opcao;
            int totalOsProcessadas = 0;

            do {
                System.out.println("----- Menu de Atendimento -----");
                System.out.println("1 - Processar nova OS");
                System.out.println("2 - Exibir quantidade de OS processadas");
                System.out.println("3 - Exibir status do sistema");
                System.out.println("0 - Sair");
                System.out.println("Digite uma opção:");

                opcao = scanner.nextInt();

                if (opcao == 1) {
                    totalOsProcessadas++;
                    System.out.println("OS processada com sucesso.");
                } else if (opcao == 2) {
                    System.out.println("Total de OS processadas: " + totalOsProcessadas);
                } else if (opcao == 3) {
                    System.out.println("Sistema operacional e aguardando comandos.");
                } else if (opcao == 0) {
                    System.out.println("Encerrando sistema.");
                } else {
                    System.out.println("Opção inválida.");
                }
            } while (opcao != 0);

            System.out.println("Total final de OS processadas: " + totalOsProcessadas);

            scanner.close();
        }
    }

### Sequência validada
Foi testada a sequência:

- 3
- 2
- 1
- 1
- 2
- 9
- 1
- 3
- 0

### Resultado da sequência
A sequência gerou o seguinte comportamento:

- opção 3 mostrou Sistema operacional e aguardando comandos;
- opção 2 mostrou Total de OS processadas: 0;
- opção 1 processou uma OS;
- opção 1 processou mais uma OS;
- opção 2 mostrou Total de OS processadas: 2;
- opção 9 mostrou Opção inválida;
- opção 1 processou mais uma OS;
- opção 3 mostrou Sistema operacional e aguardando comandos;
- opção 0 mostrou Encerrando sistema;
- total final exibido: 3.

### Aprendizado principal
O aprendizado principal foi entender que do while é ideal quando a primeira execução precisa acontecer antes da validação da condição.

No exercício, o menu precisava aparecer pelo menos uma vez.

Depois de cada opção digitada, o sistema verificava se deveria continuar ou parar.

### Relação com backend
O do while aparece menos que for e while em aplicações modernas, mas o conceito é importante.

Ele pode ser útil quando uma primeira execução é obrigatória.

Exemplos conceituais:
- executar uma primeira tentativa e repetir se necessário;
- buscar uma primeira página e verificar se existe próxima;
- solicitar dados e depois perguntar se deseja continuar;
- exibir uma primeira interação antes de validar saída.

### Comparação final entre os laços
for:
- usado quando há controle claro da quantidade de repetições.

while:
- usado quando se repete enquanto uma condição for verdadeira;
- pode executar zero vezes.

do while:
- usado quando é necessário executar pelo menos uma vez;
- verifica a condição depois da execução.

### Erros comuns
Erros comuns com do while:
- esquecer o ponto e vírgula no final;
- confundir a posição da condição;
- achar que ele pode executar zero vezes;
- esquecer de alterar a variável de controle;
- criar loop infinito;
- não tratar opção inválida;
- reiniciar contadores dentro do laço;
- esquecer scanner.close.

### Resumo da aula
- do while executa primeiro e verifica depois.
- Ele sempre executa pelo menos uma vez.
- É útil para menus e fluxos em que a primeira execução é obrigatória.
- A condição fica no final.
- O ponto e vírgula final é obrigatório.
- A opção 0 foi usada como condição de parada.

---

## Aula 3.7 - Revisão dos laços for, while e do while

### Objetivo da aula
Consolidar os principais laços de repetição estudados até agora no Módulo 3.

Nesta aula foram revisados:
- for
- while
- do while
- contador
- acumulador
- condição de parada
- loop infinito
- Scanner com repetição
- if dentro de laço
- menu com repetição
- resumo parcial
- resumo geral
- resumo final

A aula também teve um exercício integrador mais completo, juntando vários conceitos em um único programa.

### Revisão do for
O for é usado quando sabemos ou controlamos a quantidade de repetições.

Exemplo conceitual:

    for (int contador = 1; contador <= 5; contador++) {
        System.out.println("Contador: " + contador);
    }

Leitura em português:
- começa com contador igual a 1;
- continua enquanto contador for menor ou igual a 5;
- ao final de cada repetição, soma 1 no contador.

Uso comum:
- processar uma quantidade conhecida de atividades;
- contar de 1 até 10;
- percorrer itens;
- somar valores em uma quantidade controlada.

### Revisão do while
O while é usado quando queremos repetir enquanto uma condição for verdadeira.

Exemplo conceitual:

    while (opcao != 0) {
        // executa enquanto opcao for diferente de zero
    }

O while verifica a condição antes de executar.

Por isso, ele pode executar:
- zero vezes;
- uma vez;
- várias vezes.

Uso comum:
- manter um menu rodando até o usuário escolher sair;
- processar enquanto houver dados;
- repetir enquanto um status não estiver finalizado;
- buscar dados enquanto existir próxima página.

### Revisão do do while
O do while é usado quando o bloco precisa executar pelo menos uma vez.

Exemplo conceitual:

    do {
        // executa pelo menos uma vez
    } while (opcao != 0);

O do while executa primeiro e verifica a condição depois.

Por isso, ele sempre executa pelo menos uma vez.

Uso comum:
- exibir menu inicial;
- pedir uma opção ao usuário;
- executar uma tentativa inicial;
- solicitar dados antes de perguntar se deseja continuar.

### Comparação direta entre os laços
for:
- usado quando há controle claro da quantidade de repetições.

while:
- usado quando a repetição depende de uma condição;
- pode executar zero vezes.

do while:
- usado quando a primeira execução é obrigatória;
- executa pelo menos uma vez.

### Contador
Contador é uma variável usada para controlar a posição atual ou a quantidade de repetições.

Exemplo:

    int atividadeAtual = 1;

Em um for:

    for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++)

A variável atividadeAtual indica qual atividade está sendo processada no momento.

### Acumulador
Acumulador é uma variável que guarda um valor progressivo.

Exemplo:

    double totalOs = 0.0;

Dentro do laço:

    totalOs = totalOs + valorAtividade;

A cada repetição, o valor anterior é reaproveitado e atualizado.

### Condição de parada
Condição de parada é a regra que faz o laço terminar.

Exemplo:

    opcao != 0

Enquanto essa condição for verdadeira, o laço continua.

Quando a opção vira 0, a condição fica falsa e o laço termina.

### Loop infinito
Loop infinito acontece quando a condição nunca fica falsa.

Exemplo conceitual de problema:

    int contador = 1;

    while (contador <= 5) {
        System.out.println(contador);
    }

Nesse caso, falta alterar o contador.

Como contador continua sempre 1, a condição contador <= 5 nunca fica falsa.

Para corrigir, seria necessário adicionar:

    contador++;

### Exercício integrador da aula
Foi criado um programa chamado mentalmente de Sistema de Processamento de OS com Menu.

Esse programa juntou:
- Scanner
- do while
- for
- if
- else if
- else
- contador
- acumulador local
- acumulador geral
- menu
- opção inválida
- resumo por OS
- resumo geral
- resumo final

### Regras do sistema
O sistema possui um menu com as opções:
- 1 - Processar OS
- 2 - Exibir resumo geral
- 0 - Sair

Na opção 1, o sistema:
- pede o nome do cliente;
- pede a quantidade de atividades;
- usa for para percorrer as atividades;
- lê o valor de cada atividade;
- considera válida apenas atividade com valor maior que zero;
- soma somente atividades válidas no total da OS;
- conta atividades válidas;
- conta atividades inválidas;
- exibe resumo da OS;
- atualiza os acumuladores gerais.

Na opção 2, o sistema:
- exibe o resumo geral acumulado até o momento.

Na opção 0, o sistema:
- encerra;
- exibe o resumo final.

Qualquer outro número:
- exibe opção inválida;
- não altera os acumuladores.

### Uso do scanner.nextLine após nextInt
Foi necessário usar:

    scanner.nextLine();

após:

    opcao = scanner.nextInt();

Isso foi feito para limpar o Enter pendente antes de ler o nome do cliente com nextLine.

Sem essa limpeza, o Java poderia pular a leitura do nome.

Esse é um detalhe importante quando usamos Scanner misturando leitura de número e leitura de texto.

### Acumuladores locais
Acumuladores locais representam apenas a OS atual.

No exercício:
- totalOs
- atividadesValidas
- atividadesInvalidas

Eles são criados dentro da opção 1, porque cada OS precisa começar com seus próprios totais.

Exemplo:
- OS da Maria começa com totalOs igual a 0.0;
- OS do Carlos também começa com totalOs igual a 0.0;
- os dados de uma OS não podem contaminar a outra.

### Acumuladores gerais
Acumuladores gerais representam todo o sistema.

No exercício:
- totalOsProcessadas
- totalGeralSistema
- totalAtividadesValidasGeral
- totalAtividadesInvalidasGeral

Eles são criados antes do do while para manter os valores durante todo o uso do menu.

Eles acumulam tudo que foi processado desde o início do programa.

### Validação da atividade
A regra usada foi:

    valorAtividade > 0

Se o valor for maior que zero:
- a atividade é válida;
- soma no total da OS;
- incrementa atividadesValidas.

Se o valor for menor ou igual a zero:
- a atividade é inválida;
- não soma no total da OS;
- incrementa atividadesInvalidas.

### Sequência validada
Foi testada a sequência:

- 2
- 1
- maria
- 3
- 100
- -50
- 200
- 2
- 1
- carlos
- 2
- 300
- 0
- 2
- 9
- 0

### Resultado da OS Maria
Dados:
- cliente: maria
- quantidade de atividades: 3
- valores: 100, -50 e 200

Resultado:
- atividades válidas: 2
- atividades inválidas: 1
- total da OS: R$ 300.0

Explicação:
- 100 é válido;
- -50 é inválido;
- 200 é válido;
- total válido: 100 + 200 = 300.0.

### Resultado da OS Carlos
Dados:
- cliente: carlos
- quantidade de atividades: 2
- valores: 300 e 0

Resultado:
- atividades válidas: 1
- atividades inválidas: 1
- total da OS: R$ 300.0

Explicação:
- 300 é válido;
- 0 é inválido;
- total válido: 300.0.

### Resultado geral final
Ao final, o sistema exibiu:
- Total de OS processadas: 2
- Total geral do sistema: R$ 600.0
- Total de atividades válidas: 3
- Total de atividades inválidas: 2

Explicação:
- Maria teve total de R$ 300.0;
- Carlos teve total de R$ 300.0;
- total geral ficou R$ 600.0;
- Maria teve 2 atividades válidas;
- Carlos teve 1 atividade válida;
- total de atividades válidas ficou 3;
- Maria teve 1 atividade inválida;
- Carlos teve 1 atividade inválida;
- total de atividades inválidas ficou 2.

### Aprendizado principal
O principal aprendizado foi perceber como os laços podem ser combinados.

O do while controlou o menu.

O for processou as atividades de cada OS.

O if dentro do for validou cada atividade.

Os acumuladores locais guardaram os dados da OS atual.

Os acumuladores gerais guardaram o histórico consolidado do sistema.

Essa combinação se aproxima de uma lógica real de backend.

### Relação com backend
Em backend, é comum ter processamentos que:
- recebem uma solicitação;
- percorrem itens;
- validam cada item;
- acumulam totais;
- separam itens válidos e inválidos;
- retornam um resumo final.

Futuramente, a entrada não será pelo console, mas por API, JSON, banco de dados ou fila.

Mesmo assim, a lógica central será parecida.

### Exemplos reais de aplicação
Esse padrão pode ser usado para:
- processar atividades de uma OS;
- validar itens de um pedido;
- separar transações válidas e inválidas;
- calcular total de produtos;
- gerar resumo financeiro;
- consolidar dados por cliente;
- retornar resumo de importação;
- processar registros de uma fila.

### Erros comuns neste tipo de exercício
Erros comuns:
- esquecer scanner.nextLine após nextInt;
- criar acumuladores gerais dentro do menu e perder os dados;
- criar acumuladores locais fora da OS e misturar dados entre clientes;
- somar valores inválidos;
- esquecer de contar atividades inválidas;
- atualizar totais gerais antes da OS terminar;
- não tratar opção inválida;
- esquecer a condição de parada do do while;
- esquecer scanner.close.

### Resumo da aula
- A aula revisou for, while e do while.
- O exercício integrou os principais conceitos de repetição.
- O sistema processou múltiplas OS.
- Cada OS teve validação própria.
- O sistema manteve um resumo geral.
- Valores inválidos não foram somados.
- O resumo final refletiu tudo que foi processado.

---

## Aula 3.8 - Controle de fluxo com break e continue

### Objetivo da aula
Aprender dois comandos de controle de fluxo usados dentro de laços de repetição:
- break
- continue

Esses comandos permitem controlar o comportamento do laço quando uma regra específica acontece.

### O que é break
O break serve para interromper o laço inteiro imediatamente.

Quando o Java encontra um break dentro de um laço, ele sai do laço na hora.

Exemplo conceitual:
- percorra os números de 1 até 10;
- se encontrar o número 5, pare tudo.

Resultado:
- processa 1, 2, 3 e 4;
- ao chegar no 5, interrompe;
- não processa 6, 7, 8, 9 e 10.

### O que é continue
O continue serve para pular apenas a repetição atual.

Quando o Java encontra um continue, ele ignora o restante do bloco naquela repetição e vai para a próxima volta do laço.

Exemplo conceitual:
- percorra os números de 1 até 10;
- se encontrar o número 5, ignore esse número;
- continue processando os próximos.

Resultado:
- processa 1, 2, 3 e 4;
- ignora 5;
- continua processando 6, 7, 8, 9 e 10.

### Diferença entre break e continue
break:
- interrompe o laço inteiro;
- nenhuma próxima repetição é executada;
- usado quando existe uma regra crítica ou condição de parada.

continue:
- pula apenas a repetição atual;
- o laço continua na próxima repetição;
- usado quando um item específico deve ser ignorado.

Resumo simples:
- break para tudo;
- continue pula só o item atual.

### Exemplo simples com break
Exemplo conceitual:

    for (int numero = 1; numero <= 10; numero++) {
        if (numero == 5) {
            System.out.println("Número 5 encontrado. Parando o laço.");
            break;
        }

        System.out.println("Número atual: " + numero);
    }

Resultado esperado:
- Número atual: 1
- Número atual: 2
- Número atual: 3
- Número atual: 4
- Número 5 encontrado. Parando o laço.

O número 5 não é processado como número atual porque o break acontece antes da impressão.

### Exemplo simples com continue
Exemplo conceitual:

    for (int numero = 1; numero <= 10; numero++) {
        if (numero == 5) {
            System.out.println("Número 5 ignorado.");
            continue;
        }

        System.out.println("Número atual: " + numero);
    }

Resultado esperado:
- Número atual: 1
- Número atual: 2
- Número atual: 3
- Número atual: 4
- Número 5 ignorado.
- Número atual: 6
- Número atual: 7
- Número atual: 8
- Número atual: 9
- Número atual: 10

O número 5 foi ignorado, mas o laço continuou.

### Quando usar continue
Use continue quando um item deve ser ignorado, mas os próximos ainda devem ser processados.

Exemplos:
- ignorar atividade com valor zero;
- ignorar cliente inativo;
- ignorar produto sem estoque;
- ignorar transação inválida;
- ignorar item cancelado;
- pular linha vazia de um arquivo;
- pular registro inválido de uma importação.

Ideia em português:
- se este item é inválido, pule este item;
- continue processando os próximos.

### Quando usar break
Use break quando o processamento inteiro deve ser interrompido.

Exemplos:
- parar ao encontrar uma atividade bloqueada;
- parar ao encontrar erro crítico;
- parar quando encontrar o item procurado;
- parar quando o usuário escolher sair;
- parar quando atingir um limite;
- parar quando uma regra impedir a continuação.

Ideia em português:
- se encontrou erro crítico, pare o processamento inteiro.

### Exemplo com OS usando continue
Cenário:
- uma OS possui 5 atividades;
- cada atividade tem um valor;
- se o valor for menor ou igual a zero, a atividade deve ser ignorada;
- atividades válidas entram no total.

Exemplo conceitual:

    double totalOs = 0.0;

    for (int atividadeAtual = 1; atividadeAtual <= 5; atividadeAtual++) {
        double valorAtividade = 100.00;

        if (atividadeAtual == 3) {
            valorAtividade = 0.0;
        }

        if (valorAtividade <= 0) {
            System.out.println("Atividade " + atividadeAtual + " inválida. Pulando processamento.");
            continue;
        }

        totalOs = totalOs + valorAtividade;

        System.out.println("Atividade " + atividadeAtual + " processada.");
        System.out.println("Total parcial da OS: R$ " + totalOs);
    }

    System.out.println("Total final da OS: R$ " + totalOs);

Nesse exemplo, a atividade 3 é ignorada, mas as atividades 4 e 5 continuam sendo processadas.

### Exemplo com OS usando break
Cenário:
- se encontrar uma atividade bloqueada, o processamento da OS deve parar.

Exemplo conceitual:

    double totalOs = 0.0;

    for (int atividadeAtual = 1; atividadeAtual <= 5; atividadeAtual++) {
        boolean atividadeBloqueada = atividadeAtual == 4;

        if (atividadeBloqueada) {
            System.out.println("Atividade " + atividadeAtual + " bloqueada.");
            System.out.println("Processamento da OS interrompido.");
            break;
        }

        totalOs = totalOs + 100.00;

        System.out.println("Atividade " + atividadeAtual + " processada.");
        System.out.println("Total parcial da OS: R$ " + totalOs);
    }

    System.out.println("Total final da OS: R$ " + totalOs);

Nesse exemplo:
- atividades 1, 2 e 3 são processadas;
- atividade 4 bloqueia;
- atividade 5 nem chega a ser analisada.

### Exercício final da aula
Foi criado um programa chamado mentalmente de Processador de OS com break e continue.

O programa simula 6 atividades.

Regras:
- cada atividade começa com valor padrão de R$ 100.00;
- a atividade 2 possui valor 0.0;
- atividade com valor menor ou igual a zero deve ser ignorada;
- atividade ignorada usa continue;
- a atividade 6 foi configurada como bloqueada no teste adicional;
- atividade bloqueada interrompe o processamento com break;
- atividades válidas entram no total;
- o sistema exibe um resumo final.

### Código praticado
Código final da aula:

    public class Main {
        public static void main(String[] args) {
            int quantidadeAtividades = 6;
            double totalOs = 0.0;
            int atividadesProcessadas = 0;
            int atividadesIgnoradas = 0;
            boolean houveBloqueio = false;

            for (int atividadeAtual = 1; atividadeAtual <= quantidadeAtividades; atividadeAtual++) {
                double valorAtividade = 100.00;
                boolean atividadeBloqueada = atividadeAtual == 6;

                if (atividadeAtual == 2) {
                    valorAtividade = 0.0;
                }

                if (valorAtividade <= 0) {
                    atividadesIgnoradas++;

                    System.out.println("Atividade " + atividadeAtual + " inválida. Valor não será somado.");
                    continue;
                }

                if (atividadeBloqueada) {
                    houveBloqueio = true;

                    System.out.println("Atividade " + atividadeAtual + " bloqueada.");
                    System.out.println("Processamento interrompido.");
                    break;
                }

                totalOs = totalOs + valorAtividade;
                atividadesProcessadas++;

                System.out.println("Atividade " + atividadeAtual + " processada.");
                System.out.println("Total parcial da OS: R$ " + totalOs);
            }

            System.out.println("----- Resumo da OS -----");
            System.out.println("Total processado: R$ " + totalOs);
            System.out.println("Atividades processadas: " + atividadesProcessadas);
            System.out.println("Atividades ignoradas: " + atividadesIgnoradas);
            System.out.println("Houve bloqueio? " + houveBloqueio);
        }
    }

### Resultado validado
Configuração:
- quantidade de atividades: 6;
- atividade inválida: 2;
- atividade bloqueada: 6;
- valor padrão por atividade: R$ 100.00.

Resultado:
- Atividade 1 processada.
- Atividade 2 inválida. Valor não será somado.
- Atividade 3 processada.
- Atividade 4 processada.
- Atividade 5 processada.
- Atividade 6 bloqueada.
- Processamento interrompido.
- Total processado: R$ 400.0.
- Atividades processadas: 4.
- Atividades ignoradas: 1.
- Houve bloqueio? true.

### Explicação do resultado
Atividade 1:
- valor 100;
- processada;
- total passa para 100.

Atividade 2:
- valor 0;
- inválida;
- incrementa atividadesIgnoradas;
- executa continue;
- não soma no total.

Atividade 3:
- valor 100;
- processada;
- total passa para 200.

Atividade 4:
- valor 100;
- processada;
- total passa para 300.

Atividade 5:
- valor 100;
- processada;
- total passa para 400.

Atividade 6:
- bloqueada;
- houveBloqueio vira true;
- executa break;
- processamento é interrompido.

### Ordem dos if
A ordem dos if importa.

No exercício, a ordem foi:
- definir valor padrão;
- identificar se atividade 2 deve ter valor zero;
- verificar se valor é inválido;
- verificar se atividade está bloqueada;
- processar atividade válida.

Se a atividade for inválida, o continue pula para a próxima repetição.

Se a atividade for bloqueada, o break encerra o laço.

### Relação com backend
break e continue aparecem em várias situações de backend.

continue pode ser usado quando:
- um item é inválido, mas os próximos ainda devem ser processados;
- uma linha de arquivo está vazia;
- um registro importado possui erro não crítico;
- um cliente está inativo;
- uma transação deve ser ignorada.

break pode ser usado quando:
- ocorre erro crítico;
- uma regra impede continuação;
- um item obrigatório está bloqueado;
- o sistema encontrou o registro procurado;
- não faz mais sentido continuar o processamento.

### Aprendizado principal
O principal aprendizado foi entender que nem toda repetição precisa ir até o fim da mesma forma.

Às vezes, um item deve ser ignorado.

Às vezes, o processamento inteiro deve parar.

Para isso:
- use continue para pular um item;
- use break para interromper tudo.

### Erros comuns
Erros comuns com break e continue:
- usar break quando queria apenas ignorar um item;
- usar continue quando deveria interromper tudo;
- colocar continue antes de atualizar contadores necessários;
- colocar break antes de registrar o motivo do bloqueio;
- não testar o que acontece depois de um item inválido;
- não testar o que acontece depois de um bloqueio;
- esquecer que break encerra o laço inteiro;
- esquecer que continue pula o restante da repetição atual.

### Resumo da aula
- break interrompe o laço inteiro.
- continue pula apenas a repetição atual.
- continue é útil para ignorar itens inválidos.
- break é útil para interromper processamento crítico.
- A ordem dos if influencia o resultado.
- Atividades inválidas foram ignoradas.
- Atividade bloqueada interrompeu o processamento.
- O resumo final refletiu apenas atividades realmente processadas.


---

## Aula 3.9 - Exercício integrador do Módulo 3

### Objetivo da aula
Construir um exercício integrador para consolidar os principais conceitos do Módulo 3.

A proposta foi criar um Sistema Integrado de Processamento de OS, juntando:
- do while
- while
- for
- switch
- if, else if e else
- break
- continue
- Scanner
- contadores
- acumuladores
- validações
- menu
- resumo da OS
- resumo geral
- resumo final

### Visão geral do sistema
O sistema possui um menu principal com três opções:
- 1 - Processar nova OS
- 2 - Exibir resumo geral
- 0 - Sair

O menu é controlado por do while, porque precisa aparecer pelo menos uma vez e continuar até o usuário escolher sair.

### Uso das estruturas
- do while controla o menu principal.
- while valida a quantidade de atividades.
- for processa as atividades da OS.
- switch traduz o código do status da atividade.
- if aplica as regras de negócio.
- continue ignora itens que não entram no total.
- break interrompe a OS em caso de bloqueio.

### Regras de processamento das atividades
Atividade concluída:
- se o valor for maior que zero, entra no total da OS;
- se o valor for menor ou igual a zero, conta como inválida e não entra no total.

Atividade pendente:
- conta como pendente;
- não entra no total;
- usa continue.

Atividade cancelada:
- conta como cancelada;
- não entra no total;
- usa continue.

Atividade bloqueada:
- marca que houve bloqueio;
- interrompe o processamento da OS;
- usa break.

Status inválido:
- conta como inválida;
- não entra no total;
- usa continue.

### Acumuladores locais
Acumuladores locais representam apenas a OS atual:
- totalOs
- atividadesProcessadas
- atividadesInvalidas
- atividadesPendentes
- atividadesCanceladas
- houveBloqueio

Esses valores são reiniciados a cada nova OS.

### Acumuladores gerais
Acumuladores gerais representam o consolidado de todo o sistema:
- totalOsProcessadas
- totalGeralSistema
- totalAtividadesProcessadasGeral
- totalAtividadesInvalidasGeral
- totalAtividadesPendentesGeral
- totalAtividadesCanceladasGeral
- totalOsBloqueadas

Esses valores ficam fora do processamento individual da OS, porque precisam acumular tudo desde o início do programa.

### Resultado da OS Maria
A OS da Maria teve:
- quantidade inválida inicial igual a 0, corrigida para 3;
- atividade 1 concluída com valor 100;
- atividade 2 pendente com valor 50;
- atividade 3 concluída com valor -20.

Resultado:
- atividades processadas: 1
- atividades inválidas: 1
- atividades pendentes: 1
- atividades canceladas: 0
- houve bloqueio: false
- total da OS: R$ 100.0

### Resultado da OS Carlos
A OS do Carlos teve:
- atividade 1 concluída com valor 200;
- atividade 2 cancelada com valor 150;
- atividade 3 bloqueada com valor 80;
- atividade 4 não foi processada por causa do break.

Resultado:
- atividades processadas: 1
- atividades inválidas: 0
- atividades pendentes: 0
- atividades canceladas: 1
- houve bloqueio: true
- total da OS: R$ 200.0

### Resultado geral final
Ao final da execução, o sistema exibiu:
- Total de OS processadas: 2
- Total geral do sistema: R$ 300.0
- Total de atividades processadas: 2
- Total de atividades inválidas: 1
- Total de atividades pendentes: 1
- Total de atividades canceladas: 1
- Total de OS bloqueadas: 1

### Aprendizado principal
O principal aprendizado foi entender como combinar estruturas de repetição e decisão em um fluxo mais realista.

O sistema usou:
- do while para controlar o ciclo principal;
- while para validação;
- for para processamento repetitivo;
- switch para tradução de status;
- if para aplicar regra de negócio;
- continue para ignorar itens;
- break para interromper em caso crítico.

### Relação com backend
Esse exercício se aproxima de lógicas reais de backend.

Em uma aplicação real, a entrada não viria pelo console, mas poderia vir de:
- API REST;
- JSON;
- banco de dados;
- fila;
- arquivo de importação;
- formulário.

Mesmo assim, a lógica central seria parecida:
- receber dados;
- validar;
- processar itens;
- separar status;
- ignorar itens que não entram na regra;
- interromper em caso crítico;
- acumular totais;
- retornar um resumo.

### Erros comuns neste tipo de sistema
- esquecer scanner.nextLine após nextInt;
- não validar quantidade menor ou igual a zero;
- somar atividade pendente no total;
- somar atividade cancelada no total;
- somar atividade com valor inválido;
- não interromper ao encontrar bloqueio;
- continuar lendo atividades depois de um break esperado;
- misturar acumuladores locais com acumuladores gerais;
- atualizar totais gerais antes de concluir a OS;
- não tratar opção inválida;
- não testar resumo inicial e resumo final.

### Resumo da aula
- A aula integrou os principais conceitos do Módulo 3.
- O sistema processou múltiplas OS.
- Cada OS teve atividades com status diferentes.
- O sistema validou quantidade inválida.
- O sistema ignorou pendentes, canceladas e inválidas.
- O sistema interrompeu OS bloqueada.
- O sistema manteve resumo geral.
- O resultado final consolidou corretamente todas as OS.


---

## Aula 3.10 - Revisão final do Módulo 3 e preparação para arrays

### Objetivo da aula
Fechar o Módulo 3 com uma revisão geral dos laços de repetição e preparar a transição para arrays.

Nesta aula foram revisados:
- for
- while
- do while
- break
- continue
- Scanner
- if
- switch
- contador
- acumulador
- validação
- menu
- resumo local
- resumo geral

Também foi feito um exercício propositalmente repetitivo para mostrar por que arrays serão necessários no próximo módulo.

### Quando usar for
Use for quando você sabe ou controla a quantidade de repetições.

Exemplo mental:
- tenho 5 atividades;
- quero processar da atividade 1 até a atividade 5.

Nesse caso, o for é a estrutura mais natural.

### Quando usar while
Use while quando você quer repetir enquanto uma condição for verdadeira, mas não sabe quantas vezes isso vai acontecer.

Exemplo mental:
- enquanto a quantidade digitada for inválida, peça novamente.

O usuário pode errar uma vez, várias vezes ou nenhuma.

### Quando usar do while
Use do while quando o bloco precisa executar pelo menos uma vez.

Exemplo mental:
- mostrar o menu pelo menos uma vez;
- depois verificar se o usuário quer continuar.

Por isso, do while combina muito com menus.

### Quando usar break
Use break quando precisa parar o laço inteiro.

Exemplo:
- encontrou uma atividade bloqueada;
- não pode continuar processando a OS;
- interrompe o laço.

O break encerra o laço imediatamente.

### Quando usar continue
Use continue quando precisa ignorar apenas o item atual, mas continuar processando os próximos.

Exemplo:
- atividade pendente;
- atividade cancelada;
- atividade com valor inválido.

A atividade atual não entra na regra, mas as próximas ainda podem ser analisadas.

### Acumulador local
Acumulador local guarda informações apenas do processamento atual.

Exemplo:
- total da OS atual;
- atividades processadas da OS atual;
- atividades inválidas da OS atual.

Quando começa uma nova OS, esses valores são reiniciados.

### Acumulador geral
Acumulador geral guarda informações consolidadas de todo o sistema.

Exemplo:
- total de todas as OS processadas;
- total geral financeiro;
- total geral de atividades inválidas;
- total geral de OS bloqueadas.

Esses valores ficam fora do processamento individual e continuam acumulando.

### scanner.nextLine depois de scanner.nextInt
O scanner.nextInt lê apenas o número.

Ele não consome completamente o Enter digitado pelo usuário.

Quando logo depois usamos scanner.nextLine para ler texto, esse Enter pendente pode atrapalhar a leitura.

Por isso, usamos scanner.nextLine depois de scanner.nextInt para limpar o buffer antes de ler uma String.

### Revisão do exercício integrador da Aula 3.9
No exercício da Aula 3.9, a atividade 4 do Carlos não foi processada porque a atividade 3 estava bloqueada.

Quando o sistema encontrou a atividade bloqueada:
- marcou houveBloqueio como true;
- exibiu a mensagem de bloqueio;
- executou break;
- interrompeu o for.

Por isso, a atividade seguinte não foi lida nem processada.

### Papel do switch na Aula 3.9
O switch foi usado para traduzir o código do status da atividade.

Mapeamento:
- 1 - Concluída
- 2 - Pendente
- 3 - Cancelada
- 4 - Bloqueada
- outro valor - Status inválido

O switch deixou a tradução do status mais organizada.

### Papel do while na Aula 3.9
O while foi usado para validar a quantidade de atividades.

Se o usuário digitasse uma quantidade menor ou igual a zero, o sistema pedia novamente.

O programa só continuava quando a quantidade fosse válida.

Esse é um caso clássico de uso de while.

### Exercício prático da Aula 3.10
Foi criado um programa com cinco atividades fixas:

- atividade1 = 100.0
- atividade2 = 200.0
- atividade3 = 0.0
- atividade4 = 150.0
- atividade5 = -50.0

Regras:
- atividades com valor maior que zero entram no total;
- atividades com valor menor ou igual a zero são inválidas;
- ao final, o sistema exibe o total final, a quantidade de válidas e a quantidade de inválidas.

### Resultado validado
O programa exibiu:
- Total final: R$ 450.0
- Atividades válidas: 3
- Atividades inválidas: 2

Explicação:
- 100.0 entrou no total;
- 200.0 entrou no total;
- 0.0 foi inválido;
- 150.0 entrou no total;
- -50.0 foi inválido.

Total:
- 100.0 + 200.0 + 150.0 = 450.0

### Por que esse exercício foi propositalmente repetitivo
O código funcionou, mas ficou repetitivo.

Foi necessário criar variáveis separadas:
- atividade1
- atividade2
- atividade3
- atividade4
- atividade5

Também foi necessário repetir blocos if para cada atividade.

Isso mostra uma limitação importante:
- com poucas atividades, funciona;
- com muitas atividades, fica ruim;
- com 100 atividades, seria inviável manter assim.

### Ponte para arrays
Arrays vão resolver esse problema.

A ideia de array é guardar vários valores do mesmo tipo em uma única estrutura.

Exemplo conceitual:
- valoresAtividades = 100, 200, 0, 150, -50

Em vez de criar uma variável para cada atividade, vamos guardar tudo em uma estrutura só.

Depois, vamos usar for para percorrer essa estrutura.

### Relação entre Módulo 3 e Módulo 4
O Módulo 3 ensinou como repetir ações.

O Módulo 4 vai ensinar como guardar vários valores e percorrer esses valores.

A combinação será:
- array para guardar os dados;
- for para percorrer os dados;
- if para validar os dados;
- acumulador para somar os dados.

### Aprendizado principal
O principal aprendizado da aula foi perceber que os laços resolvem parte do problema, mas não resolvem tudo sozinhos.

Para processar muitos valores de forma organizada, precisamos de uma estrutura para armazenar esses valores.

Essa estrutura será estudada no próximo módulo: arrays.

### Resumo do Módulo 3
No Módulo 3 foram estudados:
- for
- while
- do while
- break
- continue
- menus
- validações
- contadores
- acumuladores
- processamento de múltiplos itens
- resumo local
- resumo geral

Esse módulo criou a base para processamentos repetitivos em Java.

### Encerramento
O Módulo 3 foi concluído com sucesso.

A próxima etapa da formação será o Módulo 4, começando por arrays.
