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
