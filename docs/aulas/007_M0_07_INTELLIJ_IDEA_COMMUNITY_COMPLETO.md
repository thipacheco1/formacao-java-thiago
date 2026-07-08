# 007 — M0.07 — IntelliJ IDEA Community Completo

## IntelliJ validado

- [ ] IntelliJ IDEA Community instalado.
- [ ] Projeto aberto pela raiz.
- [ ] JDK configurado como Project SDK.
- [ ] `src` reconhecido como pasta de código.
- [ ] `Main.java` executa pelo botão verde.
- [ ] Debug abre.
- [ ] Terminal integrado abre.
- [ ] `java -version` funciona no terminal integrado.
- [ ] `javac -version` funciona no terminal integrado.
```

---

## Hoje a aula é sobre usar a IDE como profissional

IntelliJ IDEA é uma das IDEs mais usadas no ecossistema Java.

Nesta formação, vamos usar a edição Community porque ela é suficiente para aprender Java, criar projetos, compilar, executar, debugar, trabalhar com Git, usar Maven/Gradle em boa parte do fluxo e desenvolver base sólida.

O ponto importante não é decorar todos os menus.

O ponto importante é entender o papel da IDE.

A IDE ajuda em:

```text
criar projeto;
configurar JDK;
editar código;
formatar;
navegar entre arquivos;
mostrar erros;
executar programa;
debugar;
usar terminal integrado;
integrar com Git;
organizar estrutura;
aumentar produtividade.
```

Mas a IDE não muda a essência:

```text
você escreve .java;
o projeto usa um JDK;
o código é compilado;
a JVM executa;
erros precisam ser lidos;
arquivos precisam estar organizados.
```

A IDE melhora o caminho.

Ela não elimina o caminho.

---

## O que é uma IDE

IDE significa:

```text
Integrated Development Environment
```

Em português:

```text
Ambiente de Desenvolvimento Integrado
```

Integrado porque junta várias ferramentas em um lugar:

```text
editor de código;
compilação;
execução;
debug;
terminal;
controle de versão;
busca;
navegação;
refatoração;
formatação;
configuração de projeto.
```

Sem IDE, você pode programar com editor simples e terminal.

Com IDE, você ganha produtividade.

Mas produtividade só é boa quando existe entendimento.

Uma IDE na mão de quem não entende pode esconder problemas.

Uma IDE na mão de quem entende vira uma ferramenta poderosa.

---

## IntelliJ Community e IntelliJ Ultimate

Existe mais de uma edição do IntelliJ.

Para esta formação, a edição Community é suficiente para a base Java e para muitos passos importantes.

A edição Ultimate costuma trazer recursos adicionais voltados a desenvolvimento corporativo, web, frameworks e integrações mais avançadas.

Mas isso não deve ser uma preocupação agora.

A formação não depende de ferramenta paga.

O objetivo é construir competência.

Um desenvolvedor forte consegue aprender Java, OO, Git, testes, Maven, banco, Spring Boot e arquitetura sem depender de botão exclusivo de IDE paga.

Quando algum recurso não existir na Community, usamos alternativas:

```text
terminal;
Maven;
plugins disponíveis;
execução manual;
ferramentas externas;
configuração explícita;
entendimento do projeto.
```

Isso, inclusive, fortalece a formação.

Quem entende por baixo não fica travado por edição de ferramenta.

---

## O conceito de projeto na IDE

No IntelliJ, um projeto representa um conjunto de arquivos, configurações e estrutura que a IDE entende como uma unidade de trabalho.

Um projeto pode ter:

```text
código-fonte;
bibliotecas;
JDK configurado;
pasta de saída;
configurações de execução;
testes;
arquivos de build;
controle Git;
documentação.
```

No começo, um projeto Java simples pode ser pequeno.

Exemplo:

```text
formacao-java-backend
├── docs
├── src
├── labs
├── README.md
└── .gitignore
```

Mais tarde, com Maven, a estrutura fica mais profissional:

```text
src
├── main
│   └── java
└── test
    └── java
pom.xml
```

A IDE precisa entender essa estrutura para ajudar corretamente.

---

## O que é SDK no IntelliJ

No IntelliJ, SDK é o kit de desenvolvimento que o projeto vai usar.

No nosso caso:

```text
JDK 21
```

Quando a IDE pergunta pelo SDK, ela quer saber:

```text
qual JDK será usado para compilar e executar este projeto?
```

Isso se conecta diretamente com a aula anterior.

No terminal, validamos:

```powershell
java -version
javac -version
```

Na IDE, precisamos garantir que o projeto aponta para o JDK correto.

Se o projeto está sem SDK, a IDE pode mostrar erros mesmo com código correto.

Se aponta para versão errada, pode compilar de forma diferente do esperado.

Então, regra:

```text
projeto Java precisa de JDK configurado.
```

No IntelliJ, isso aparece como Project SDK ou Project JDK.

---

## Por que SDK errado é problema real

Imagine que o projeto usa Java 21.

O código usa recurso moderno.

Mas a IDE está configurada com Java 17.

A IDE pode acusar erro.

Ou o build pode falhar.

Ou o terminal funciona e a IDE não.

Ou a IDE funciona e o terminal não.

Esse tipo de inconsistência é comum.

Por isso, quando algo estranho acontecer, verifique:

```text
JDK do terminal;
SDK do projeto na IDE;
versão configurada no Maven/Gradle;
versão usada no pipeline;
versão usada no Docker.
```

No começo parece exagero.

Em projeto profissional, isso é diagnóstico básico.

---

## Criando ou abrindo um projeto

Existem duas situações diferentes.

### Criar projeto novo

Você cria uma pasta nova e o IntelliJ estrutura o projeto.

Isso é útil em aulas iniciais.

### Abrir projeto existente

Você já tem uma pasta com arquivos e abre no IntelliJ.

Isso é comum em projetos reais.

Exemplo:

```text
C:\dev\projects\formacao-java-backend
```

A IDE abre essa pasta como projeto.

Em time profissional, normalmente você clona um repositório e abre a pasta clonada.

---

## Estrutura `src`

A pasta `src` é onde fica código-fonte.

No começo, podemos usar:

```text
src
└── Main.java
```

Mais tarde, com Maven:

```text
src
└── main
    └── java
        └── br
            └── com
                └── exemplo
                    └── Main.java
```

Mas a ideia é sempre:

```text
src guarda fonte
```

Não coloque `.class` em `src`.

Não coloque arquivo gerado em `src`.

Não coloque prints aleatórios em `src`.

Código-fonte precisa ficar limpo.

---

## Source root

No IntelliJ, algumas pastas podem ser marcadas como fonte.

Quando uma pasta é marcada como source root, a IDE entende:

```text
aqui dentro existem arquivos Java que fazem parte do código-fonte.
```

Visualmente, o IntelliJ costuma destacar essas pastas.

Se a pasta `src` não está marcada corretamente, a IDE pode não reconhecer bem as classes.

Em projeto Maven, o IntelliJ geralmente detecta automaticamente:

```text
src/main/java
src/test/java
```

Em projeto simples, às vezes é preciso conferir.

A ideia importante é:

```text
nem toda pasta do projeto é pasta de código.
```

`docs` não é código.

`out` não é código-fonte.

`target` não é código-fonte.

`src` é código-fonte.

---

## Pasta de saída

Quando a IDE compila, ela gera arquivos `.class`.

Esses arquivos precisam ir para algum lugar.

Em projetos simples, pode ser algo como:

```text
out
```

Em Maven, costuma ser:

```text
target/classes
```

O importante é entender:

```text
fonte fica em src;
compilado fica em pasta de saída.
```

Isso conecta com a aula de compilação manual.

Manual:

```text
Main.java
Main.class
```

Organizado:

```text
src/Main.java
out/Main.class
```

Maven:

```text
src/main/java/.../Main.java
target/classes/.../Main.class
```

A IDE ajuda a organizar isso.

Mas o conceito é o mesmo.

---

## O botão Run

O botão Run executa uma configuração.

Ele não é mágica.

Quando você clica em Run, a IDE precisa saber:

```text
qual classe executar;
qual método main usar;
qual JDK usar;
qual classpath montar;
qual pasta de trabalho usar;
quais argumentos passar, se houver.
```

Para programas simples, o IntelliJ detecta o `main`.

Você vê um ícone verde ao lado do método ou da classe.

Mas, por trás, ele está criando uma configuração de execução.

Essa configuração é chamada de Run Configuration.

---

## Run Configuration

Run Configuration é a configuração que diz como executar algo.

Ela pode guardar:

```text
nome da configuração;
classe principal;
módulo;
JDK;
argumentos de programa;
variáveis de ambiente;
diretório de trabalho;
opções da JVM.
```

No começo, vamos usar o básico.

Mas é importante saber que existe.

Em backend real, run configurations podem incluir:

```text
profile ativo;
variável de ambiente;
porta;
configuração local;
argumentos da JVM;
classe principal do Spring Boot.
```

Quando um projeto “roda para uma pessoa e não roda para outra”, a diferença pode estar em uma dessas configurações.

---

## Working directory

Working directory significa:

```text
diretório de trabalho
```

É a pasta considerada como ponto de partida quando o programa executa.

Isso importa para arquivos relativos.

Exemplo:

```java
Path.of("dados/clientes.csv")
```

Esse caminho será resolvido a partir do working directory.

Se a IDE usa uma pasta e o terminal usa outra, pode funcionar em um lugar e falhar no outro.

No início, isso pode parecer detalhe.

Mas em backend, working directory aparece em:

```text
leitura de arquivos;
logs locais;
uploads;
scripts;
configurações;
testes;
execução via IDE;
execução via terminal.
```

Por isso, quando algo envolvendo arquivo falhar, uma pergunta útil é:

```text
qual é o working directory?
```

---

## Terminal integrado

O IntelliJ tem terminal integrado.

Ele permite rodar comandos sem sair da IDE.

Exemplo:

```powershell
pwd
ls
java -version
javac -version
git status
```

O terminal integrado é útil porque mantém você dentro do contexto do projeto.

Mas ele ainda é terminal.

As mesmas regras continuam:

```text
ver onde está;
listar arquivos;
ler erro;
rodar comando com intenção.
```

Uma boa prática é abrir o terminal integrado e verificar:

```powershell
pwd
ls
```

Assim você sabe se ele abriu na raiz do projeto.

---

## Formatação

Código precisa ser legível.

A IDE ajuda com formatação automática.

No IntelliJ, existe atalho para reformatar código.

O atalho pode variar conforme sistema e keymap, mas normalmente a IDE possui a ação:

```text
Reformat Code
```

O ponto importante não é decorar o atalho nesta aula.

O ponto importante é entender a responsabilidade:

```text
código mal formatado aumenta esforço de leitura;
código formatado reduz ruído;
formatação deve ser consistente no projeto.
```

Formatação não corrige design ruim.

Mas remove bagunça visual.

Isso ajuda code review, estudo e manutenção.

---

## Auto import

Quando você usa classes de pacotes externos ou da biblioteca Java, o IntelliJ pode sugerir imports.

Exemplo:

```java
import java.util.Scanner;
```

A IDE pode inserir automaticamente ou sugerir.

Isso é útil.

Mas você precisa entender que import não cria biblioteca.

Import apenas permite referenciar uma classe pelo nome simples.

Exemplo:

```java
Scanner scanner = new Scanner(System.in);
```

Sem import:

```java
java.util.Scanner scanner = new java.util.Scanner(System.in);
```

A IDE ajuda a organizar imports.

Mas import não é magia.

---

## Autocomplete

Autocomplete é uma das maiores ajudas da IDE.

Quando você digita parte de um nome, a IDE sugere:

```text
classes;
métodos;
variáveis;
pacotes;
palavras-chave.
```

Isso acelera.

Mas há um cuidado:

```text
autocomplete não deve escolher por você sem entendimento.
```

Quando aceitar uma sugestão, leia o que entrou.

Veja o tipo.

Veja o método.

Veja o retorno.

Veja os parâmetros.

Use autocomplete como ferramenta de precisão, não como chute automático.

---

## Navegação

A IDE permite navegar rapidamente:

```text
de uma classe para outra;
de um método para sua chamada;
de uma chamada para sua declaração;
entre arquivos;
entre erros;
entre resultados de busca.
```

Isso será muito importante em projetos grandes.

Backend profissional tem muitas classes.

Se você não sabe navegar, perde tempo.

Se sabe navegar, investiga fluxo.

A navegação é uma habilidade real de leitura de sistema.

---

## Refatoração

IDE boa ajuda a refatorar.

Exemplo:

```text
renomear variável;
renomear método;
extrair método;
mover classe;
organizar imports;
formatar código.
```

Mas refatoração automática precisa de intenção.

Não é sair apertando opção.

Antes de refatorar, pergunte:

```text
O que está ruim?
O que quero melhorar?
Nome?
Duplicação?
Responsabilidade?
Leitura?
Acoplamento?
Teste?
```

A IDE executa a mudança.

O desenvolvedor decide por que mudar.

---

## Debug dentro da IDE

O debug será aprofundado na próxima aula.

Mas o IntelliJ é uma ferramenta excelente para isso.

Debug permite:

```text
pausar o código;
ver valores;
avançar linha por linha;
entrar em método;
ver pilha de chamadas;
entender fluxo.
```

Isso é essencial para aprender Java e para investigar backend.

O botão Run executa.

O botão Debug permite observar.

Um desenvolvedor que aprende a debugar cedo evolui mais rápido.

---

## Git dentro do IntelliJ

O IntelliJ também possui integração com Git.

Ele pode mostrar:

```text
arquivos alterados;
diff;
commit;
histórico;
branch;
conflitos.
```

Isso ajuda.

Mas, novamente, não substitui entendimento.

Antes de depender da tela da IDE, é bom saber no terminal:

```bash
git status
git diff
git add
git commit
git log
```

A interface visual é ótima quando você sabe o que ela representa.

Sem isso, você clica sem entender e corre risco.

---

## Exemplo mínimo: criando um projeto simples

A prática desta aula é criar ou abrir um projeto simples.

Se já existe uma pasta organizada, abra:

```text
C:\dev\projects\formacao-java-backend
```

No IntelliJ:

```text
File
Open
selecione a pasta do projeto
```

Depois confira se o SDK está configurado como JDK 21.

Crie a pasta `src`, se ainda não existir.

Dentro de `src`, crie:

```text
Main.java
```

Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Projeto aberto no IntelliJ IDEA Community.");
    }
}
```

Execute pelo botão verde.

Depois abra o terminal integrado e rode:

```powershell
pwd
ls
```

O objetivo é enxergar que a IDE e o terminal estão olhando para o mesmo projeto.

---

## Exemplo aplicado: por que isso importa em projeto corporativo

Imagine um projeto backend com Spring Boot.

O repositório tem:

```text
src/main/java
src/main/resources
src/test/java
pom.xml
README.md
```

Ao abrir no IntelliJ, a IDE precisa reconhecer:

```text
qual é o projeto;
qual é o JDK;
qual é o Maven;
onde está o código principal;
onde estão os testes;
quais dependências existem;
qual classe inicia a aplicação.
```

Se algo não é reconhecido, começam problemas:

```text
imports vermelhos;
classes não encontradas;
testes não rodam;
run configuration errada;
SDK ausente;
Maven não sincronizado;
terminal em pasta errada.
```

Um profissional forte não entra em pânico.

Ele verifica:

```text
JDK do projeto;
estrutura de pastas;
arquivo de build;
dependências;
terminal;
mensagem de erro.
```

O IntelliJ é uma ferramenta poderosa para isso.

---

## A IDE não deve esconder a estrutura

Um erro comum é olhar apenas a visão bonita da IDE e esquecer que tudo são arquivos.

Se houver dúvida, sempre volte para o básico:

```powershell
pwd
ls
```

No sistema de arquivos, o projeto continua sendo uma pasta.

A IDE apenas interpreta essa pasta.

Isso é importante para:

```text
Git;
Maven;
Docker;
CI/CD;
README;
scripts;
build;
execução em outro ambiente.
```

Se um projeto só funciona dentro da IDE e ninguém entende como rodar fora dela, existe fragilidade.

---

## O que colocar em `docs/atalhos.md`

Atalhos ajudam muito, mas não devem ser decorados todos de uma vez.

Crie um arquivo:

```text
docs/atalhos.md
```

E registre aos poucos.

Modelo:

```markdown
# Atalhos e ações do IntelliJ

## Ações principais

| Ação | Atalho / caminho | Observação |
|---|---|---|
| Executar programa | Botão Run / ícone verde | Executa a run configuration |
| Reformatar código | Reformat Code | Ajusta formatação |
| Buscar ação | Find Action | Ajuda a encontrar comandos da IDE |
| Abrir terminal | Terminal | Terminal integrado do projeto |
| Renomear com segurança | Rename | Refatoração, não edição manual cega |
| Organizar imports | Optimize Imports | Remove imports não usados |

## Atalhos que mais usei hoje
-
```

O objetivo não é virar tabela gigante.

É construir repertório útil conforme a prática.

---

## Arquivos que não devem ir para o Git

Quando usar IntelliJ, podem aparecer arquivos de configuração.

Exemplos:

```text
.idea/
*.iml
out/
```

Dependendo do contexto, times podem versionar parte da configuração da IDE ou não.

Na formação inicial, a regra simples é:

```text
não versionar configuração local da IDE;
não versionar saída compilada.
```

Um `.gitignore` inicial pode ter:

```gitignore
.idea/
*.iml
out/
*.class
target/
.DS_Store
Thumbs.db
```

Mais tarde, quando estudarmos Git profissional, veremos nuances.

Por enquanto, a prioridade é evitar sujeira.

---

## Erros comuns

### Erro 1 — Projeto sem SDK

Sintoma:

```text
código Java aparece com erro;
IDE não reconhece linguagem;
não executa main;
JDK não configurado.
```

Correção:

```text
configurar Project SDK / JDK do projeto.
```

---

### Erro 2 — SDK diferente do terminal

Terminal:

```text
Java 21
```

IDE:

```text
Java 17
```

Ou o contrário.

Correção:

```text
alinhar versão do JDK na IDE e no terminal.
```

---

### Erro 3 — Criar arquivo fora de `src`

Se criar `Main.java` em lugar errado, a IDE pode não tratar como código-fonte.

Correção:

```text
colocar código dentro da pasta de fonte;
marcar source root se necessário.
```

---

### Erro 4 — Achar que botão Run é tudo

Run executa uma configuração.

Se a configuração estiver errada, pode falhar.

Correção:

```text
ver classe principal;
ver SDK;
ver working directory;
ver módulo;
ver erro.
```

---

### Erro 5 — Terminal integrado em pasta inesperada

Antes de rodar comandos no terminal integrado:

```powershell
pwd
ls
```

Se não está na raiz do projeto, navegue:

```powershell
cd caminho-do-projeto
```

---

### Erro 6 — Aceitar autocomplete sem ler

Autocomplete acelera, mas pode inserir método ou classe errada.

Correção:

```text
ler assinatura;
ver tipo de retorno;
entender o que foi aceito.
```

---

### Erro 7 — Refatorar sem intenção

A IDE facilita renomear e mover.

Mas a decisão deve ser técnica.

Correção:

```text
refatorar para melhorar nome, responsabilidade, duplicação ou legibilidade.
```

---

### Erro 8 — Versionar `.idea`, `out` ou `.class` sem querer

Correção:

```text
usar .gitignore;
ver git status antes de commit;
entender o que está sendo versionado.
```

---

## Como a IDE ajuda a aprender melhor

Use o IntelliJ para observar, não apenas para digitar.

Quando escrever código:

```text
observe cores;
observe alertas;
observe sugestões;
observe imports;
observe erros antes de rodar;
observe navegação;
observe estrutura.
```

A IDE mostra pistas.

Mas você precisa aprender a interpretá-las.

Exemplo:

```text
texto vermelho indica erro ou símbolo não resolvido;
texto cinza pode indicar código não usado;
lâmpada pode sugerir correção;
underline pode indicar problema;
aba de Run mostra saída;
aba de Problems mostra alertas.
```

Essas pistas fazem parte da leitura profissional.

---

## Atividade guiada

Faça esta prática se estiver com o IntelliJ instalado.

1. Abra o projeto:

```text
C:\dev\projects\formacao-java-backend
```

2. Confira o JDK do projeto.

3. Crie:

```text
src/Main.java
```

4. Código:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("IntelliJ configurado com JDK correto.");
    }
}
```

5. Execute pelo botão verde.

6. Abra o terminal integrado.

7. Rode:

```powershell
pwd
ls
java -version
javac -version
```

8. Crie ou atualize:

```text
docs/atalhos.md
```

9. Registre as ações usadas.

10. Confira se `.gitignore` contém:

```gitignore
.idea/
*.iml
out/
*.class
target/
```

Se o projeto já está versionado, confira:

```bash
git status
```

Não faça commit automático sem entender o que mudou.

---

## O que aprendi
Aprendi que a IDE é uma ferramenta de produtividade, mas o projeto continua dependendo de JDK, estrutura, compilação e execução.

## Conceitos importantes
- Projeto
- SDK/JDK
- src
- source root
- pasta de saída
- Run Configuration
- Working directory
- Terminal integrado

## Validações feitas
- Projeto aberto na pasta correta:
- SDK configurado:
- Main.java criado em src:
- Programa executado:
- Terminal integrado validado com pwd e ls:
- java -version:
- javac -version:

## Erros que quero evitar
- usar SDK errado;
- criar arquivo fora de src;
- depender só do botão Run;
- ignorar terminal integrado;
- aceitar autocomplete sem entender;
- versionar arquivos gerados ou configuração local indevida.

## Atalhos/ações registradas
-
```

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar o que é IDE;
explicar por que IntelliJ Community é suficiente para a formação;
abrir um projeto existente;
entender o que é SDK/JDK do projeto;
relacionar SDK da IDE com java/javac do terminal;
criar arquivo Java em src;
executar uma classe com main;
entender o que é Run Configuration;
entender o que é working directory;
usar terminal integrado;
entender source root;
entender pasta de saída;
usar formatação como disciplina de leitura;
usar autocomplete com consciência;
registrar atalhos úteis;
evitar versionar .class, out e configurações locais indevidas.
```

Não precisa dominar o IntelliJ inteiro.

Precisa conseguir usá-lo como ambiente de estudo e desenvolvimento com consciência.

---

## Fechamento da aula

O IntelliJ é uma ferramenta excelente, mas ele não é o centro da formação.

O centro da formação é entendimento.

A IDE deve ajudar a escrever melhor, navegar melhor, executar melhor e diagnosticar melhor.

Mas a base continua sendo:

```text
projeto organizado;
JDK configurado;
código em src;
compilação;
execução;
terminal;
Git;
leitura de erro.
```

Na próxima aula, vamos aprofundar uma habilidade que acelera muito o aprendizado:

```text
debug
```

Debug é uma das pontes entre “acho que entendi” e “estou vendo exatamente o que acontece”.

É ali que muita coisa começa a ficar clara.
