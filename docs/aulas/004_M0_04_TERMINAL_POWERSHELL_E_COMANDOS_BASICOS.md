# 004 — M0.04 — Terminal, PowerShell e Comandos Básicos para Desenvolvimento Java Backend

## Terminal como diagnóstico

- [ ] Sei abrir PowerShell.
- [ ] Sei abrir terminal integrado no IntelliJ.
- [ ] Sei usar `pwd`.
- [ ] Sei usar `ls`.
- [ ] Sei usar `cd`.
- [ ] Sei usar `where`.
- [ ] Sei consultar `JAVA_HOME`.
- [ ] Sei consultar `MAVEN_HOME`.
- [ ] Sei que terminal antigo pode não refletir PATH atualizado.
```

---

## Hoje a aula é sobre parar de depender só de clique

A partir de agora, o terminal precisa deixar de ser uma tela assustadora.

Ele é só uma forma direta de conversar com o sistema operacional.

Quando se abre o PowerShell, não se está entrando em outro mundo.

Está apenas usando texto para fazer coisas que também poderiam ser feitas com mouse:

```text
entrar em pasta;
listar arquivos;
criar pasta;
apagar arquivo;
executar programa;
ver versão de ferramenta;
rodar Java;
rodar Git;
rodar Maven;
subir Docker;
ver logs.
```

A diferença é que, no backend profissional, comando é mais preciso, mais rápido, mais rastreável e mais fácil de repetir.

Um desenvolvedor backend que não sabe usar terminal fica limitado.

Ele depende da IDE para tudo.

Ele não entende o que o projeto faz por baixo.

Ele sofre quando precisa rodar um comando em pipeline, servidor, Docker, documentação técnica ou tutorial.

Terminal não é assunto paralelo.

Terminal é uma ferramenta diária de trabalho.

---

## A ideia central: terminal é localização + comando

Para usar terminal bem, pense sempre em duas perguntas:

```text
Onde estou?
O que quero executar?
```

A maior parte dos erros iniciais acontece porque a pessoa esquece a primeira pergunta.

Ela tenta rodar:

```bash
javac Main.java
```

mas está na pasta errada.

Ela tenta rodar:

```bash
git status
```

mas não está dentro do repositório.

Ela tenta abrir um arquivo, mas ele não existe naquela pasta.

Então a regra inicial é simples:

```text
Antes de executar comando, saiba onde você está.
```

No PowerShell, para descobrir onde está:

```powershell
pwd
```

Para ver o que tem na pasta:

```powershell
ls
```

Esses dois comandos serão seus primeiros instrumentos de diagnóstico.

---

## Terminal, shell e PowerShell

Vamos separar os nomes.

### Terminal

Terminal é a janela onde você digita comandos.

Exemplo:

```text
Windows Terminal
terminal integrado do IntelliJ
terminal do VS Code
Prompt de Comando
```

### Shell

Shell é o programa que interpreta o comando.

Exemplo:

```text
PowerShell
cmd
bash
zsh
```

### PowerShell

PowerShell é um shell moderno do Windows.

É nele que vamos focar agora.

Quando você digita:

```powershell
pwd
```

o PowerShell interpreta e executa.

Quando digita:

```powershell
ls
```

o PowerShell lista arquivos.

Quando digita:

```powershell
java -version
```

o PowerShell procura o comando `java` e executa.

Então:

```text
terminal é a janela;
PowerShell é quem entende o comando.
```

Essa diferença não é só teoria.

Mais tarde, alguns comandos funcionam em PowerShell, outros em bash, outros em cmd.

Saber onde está ajuda a não copiar comando errado sem entender.

---

## O prompt

Quando você abre o PowerShell, normalmente vê algo assim:

```powershell
PS C:\Users\usuario>
```

Esse trecho informa a pasta atual.

Exemplo:

```powershell
PS C:\dev\projects\formacao-java-backend>
```

Isso significa:

```text
você está dentro da pasta C:\dev\projects\formacao-java-backend
```

O prompt é uma pista.

Não ignore.

Antes de rodar comandos importantes, olhe o prompt.

Se ele estiver em lugar estranho, use:

```powershell
pwd
```

---

## `pwd`: onde estou?

O comando:

```powershell
pwd
```

mostra o caminho da pasta atual.

Exemplo:

```powershell
pwd
```

Saída possível:

```text
Path
----
C:\dev\projects\formacao-java-backend
```

Use `pwd` quando:

```text
não sabe onde está;
um comando não encontrou arquivo;
vai rodar javac;
vai rodar git;
vai criar pasta;
vai apagar algo;
vai executar script.
```

`pwd` evita erro bobo.

Erro bobo repetido vira perda de tempo.

---

## `ls` e `dir`: o que tem aqui?

No PowerShell, você pode usar:

```powershell
ls
```

ou:

```powershell
dir
```

Os dois listam arquivos e pastas.

Exemplo:

```powershell
ls
```

Saída possível:

```text
docs
src
labs
README.md
.gitignore
```

Isso responde:

```text
quais arquivos e pastas existem no local atual?
```

Use `ls` antes de reclamar que o Java, Git ou Maven “não achou” algo.

Às vezes o arquivo realmente não está ali.

---

## `cd`: entrando e saindo de pastas

O comando `cd` muda a pasta atual.

Exemplo:

```powershell
cd C:\dev
```

Agora você está em:

```text
C:\dev
```

Para entrar em uma pasta dentro da atual:

```powershell
cd projects
```

Para entrar no projeto:

```powershell
cd formacao-java-backend
```

Para voltar uma pasta:

```powershell
cd ..
```

Para voltar duas pastas:

```powershell
cd ..\..
```

Exemplo completo:

```powershell
cd C:\dev\projects\formacao-java-backend
pwd
ls
```

O terminal é muito baseado nesse movimento:

```text
ir para o lugar certo;
olhar o que existe;
executar o comando certo.
```

---

## Caminho absoluto e caminho relativo

Esse conceito é essencial.

### Caminho absoluto

É o caminho completo.

Exemplo:

```text
C:\dev\projects\formacao-java-backend\docs
```

Quando você usa caminho absoluto, não depende da pasta atual.

Exemplo:

```powershell
cd C:\dev\projects\formacao-java-backend
```

### Caminho relativo

É o caminho a partir de onde você está agora.

Se você já está em:

```text
C:\dev\projects\formacao-java-backend
```

pode entrar em `docs` assim:

```powershell
cd docs
```

Porque `docs` está dentro da pasta atual.

Caminho relativo exige consciência de onde você está.

Por isso `pwd` importa.

---

## `mkdir`: criando pastas

Para criar pasta:

```powershell
mkdir nome-da-pasta
```

Exemplo:

```powershell
mkdir docs
mkdir src
mkdir labs
```

Se você está em:

```text
C:\dev\projects\formacao-java-backend
```

e roda:

```powershell
mkdir docs
```

a pasta será criada aqui:

```text
C:\dev\projects\formacao-java-backend\docs
```

Se estiver na pasta errada, vai criar no lugar errado.

De novo:

```text
onde estou?
o que quero fazer?
```

---

## `New-Item`: criando arquivo

No PowerShell, para criar arquivo vazio:

```powershell
New-Item README.md
```

Outro exemplo:

```powershell
New-Item docs\diario-de-bordo.md
```

Isso cria o arquivo dentro de `docs`.

Se a pasta `docs` não existir, vai falhar.

Então, antes:

```powershell
mkdir docs
New-Item docs\diario-de-bordo.md
```

Também é possível usar editores, como IntelliJ ou VS Code.

Mas saber criar arquivo pelo terminal ajuda em scripts, laboratório e documentação.

---

## `Copy-Item`: copiando arquivo

Para copiar arquivo:

```powershell
Copy-Item origem destino
```

Exemplo:

```powershell
Copy-Item README.md README-copia.md
```

Copiar para outra pasta:

```powershell
Copy-Item README.md docs\README.md
```

Copiar pasta inteira exige cuidado.

Mais tarde podemos ver parâmetros como `-Recurse`.

Por enquanto, entenda:

```text
Copy-Item copia.
Ele não move.
Ele cria uma segunda versão.
```

Não use cópia como substituto de Git.

Git existe para histórico.

Cópia manual demais vira bagunça.

---

## `Move-Item`: movendo ou renomeando

Para mover:

```powershell
Move-Item README-copia.md docs\README-copia.md
```

Para renomear:

```powershell
Move-Item README-copia.md README-antigo.md
```

Mover muda o lugar.

Copiar cria duplicado.

Essa diferença importa.

---

## `Remove-Item`: apagando com cuidado

Para apagar arquivo:

```powershell
Remove-Item nome-do-arquivo
```

Exemplo:

```powershell
Remove-Item README-copia.md
```

Para apagar pasta, é preciso muito cuidado.

Não saia usando `Remove-Item` sem conferir onde está.

Antes de apagar:

```powershell
pwd
ls
```

Depois apague apenas o que tem certeza.

Terminal é poderoso.

Poder sem atenção vira acidente.

---

## `cls` ou `Clear-Host`: limpar a tela

Para limpar a tela:

```powershell
cls
```

ou:

```powershell
Clear-Host
```

Isso não apaga arquivos.

Só limpa a visualização do terminal.

É útil quando a tela está poluída.

---

## Histórico de comandos

O PowerShell guarda comandos recentes na sessão.

Você pode usar a seta para cima para voltar comandos anteriores.

Isso economiza tempo.

Exemplo:

```text
seta para cima
seta para baixo
```

Também existe:

```powershell
Get-History
```

Ele lista comandos usados.

Histórico ajuda quando você quer repetir ou revisar o que fez.

Mas cuidado: repetir comando sem ler pode repetir erro.

---

## Autocomplete com Tab

O `Tab` completa nomes.

Exemplo:

```powershell
cd C:\de
```

Pressione `Tab`.

O PowerShell pode completar:

```powershell
cd C:\dev
```

Se você digitar:

```powershell
cd .\pro
```

e pressionar `Tab`, ele pode completar:

```powershell
cd .\projects
```

Autocomplete evita erro de digitação.

Use muito.

Profissional experiente usa autocomplete o tempo todo.

---

## Executando comandos de ferramentas

Quando você digita:

```powershell
java -version
```

o PowerShell tenta encontrar um programa chamado `java`.

Quando digita:

```powershell
git --version
```

ele procura `git`.

Quando digita:

```powershell
mvn -version
```

ele procura `mvn`.

Se o comando existe e está no `PATH`, ele roda.

Se não existe, aparece erro parecido com:

```text
The term 'java' is not recognized
```

Isso normalmente significa:

```text
o comando não foi encontrado pelo sistema
```

Pode ser porque:

```text
a ferramenta não está instalada;
o PATH não foi configurado;
o terminal foi aberto antes da configuração;
o nome do comando foi digitado errado.
```

Essa aula prepara o entendimento.

A configuração específica do JDK, Git e Maven aparece em aulas próprias.

---

## Variáveis de ambiente

Variáveis de ambiente são valores que o sistema e os programas podem consultar.

Exemplo clássico no Java:

```text
JAVA_HOME
```

Para ver uma variável no PowerShell:

```powershell
echo $env:JAVA_HOME
```

Para ver caminhos do PATH:

```powershell
echo $env:Path
```

Não precisa dominar isso agora.

Mas precisa saber que existe.

Mais tarde, quando o comando `java` funcionar no terminal, isso terá relação com o `PATH`.

O terminal não encontra comandos por mágica.

Ele procura em locais configurados.

---

## `where`: descobrindo onde um comando está

No Windows, para descobrir onde um executável foi encontrado, use:

```powershell
where java
```

ou:

```powershell
where git
```

ou:

```powershell
where mvn
```

Exemplo:

```powershell
where java
```

Saída possível:

```text
C:\Program Files\Eclipse Adoptium\jdk-21\bin\java.exe
```

Isso é muito útil para diagnóstico.

Às vezes existe mais de um Java instalado.

O `where` ajuda a descobrir qual está sendo usado.

---

## Diferença entre erro de comando e erro do programa

Esse ponto é importante.

Quando você roda:

```powershell
java -version
```

podem acontecer dois tipos de problema.

### O comando não é encontrado

Mensagem parecida:

```text
The term 'java' is not recognized
```

Isso significa:

```text
PowerShell não encontrou o programa java.
```

O problema é ambiente, instalação ou PATH.

### O comando roda, mas o programa reclama

Exemplo futuro:

```text
Error: Could not find or load main class Main
```

Aqui o `java` foi encontrado e executado.

O problema é outro: classe, classpath, compilação ou execução.

Saber diferenciar isso economiza muito tempo.

---

## Exemplo mínimo: criando e navegando em uma estrutura

Vamos fazer um exercício pequeno, mas útil.

Abra o PowerShell.

Vá para `C:\dev`:

```powershell
cd C:\dev
```

Confira:

```powershell
pwd
```

Crie laboratório:

```powershell
mkdir labs\terminal-basico
```

Entre nele:

```powershell
cd labs\terminal-basico
```

Confira:

```powershell
pwd
```

Crie pastas:

```powershell
mkdir entrada
mkdir saida
mkdir docs
```

Crie arquivo:

```powershell
New-Item docs\anotacoes.md
```

Liste:

```powershell
ls
ls docs
```

Renomeie o arquivo:

```powershell
Move-Item docs\anotacoes.md docs\terminal.md
```

Copie:

```powershell
Copy-Item docs\terminal.md docs\terminal-copia.md
```

Liste:

```powershell
ls docs
```

Apague a cópia:

```powershell
Remove-Item docs\terminal-copia.md
```

Liste novamente:

```powershell
ls docs
```

Limpe a tela:

```powershell
cls
```

O objetivo não é decorar.

O objetivo é sentir o fluxo:

```text
localizar
criar
navegar
listar
mover
copiar
apagar
confirmar
```

---

## Exemplo aplicado ao backend

Imagine que você baixou um projeto Java de uma empresa.

O README diz:

```text
Entre na pasta do projeto e rode:
mvn clean test
```

Uma pessoa sem terminal pode travar.

Uma pessoa com base faz:

```powershell
cd C:\dev\projects\api-pedidos
pwd
ls
mvn clean test
```

Se der erro dizendo que `mvn` não foi reconhecido, ela pensa:

```text
problema de Maven/PATH
```

Se o Maven rodar, mas teste falhar, ela pensa:

```text
problema de teste/código/configuração do projeto
```

Se o `pom.xml` não aparecer no `ls`, ela pensa:

```text
estou na pasta errada
```

Esse raciocínio é o ponto.

Terminal não é só comando.

Terminal é diagnóstico.

---

## Outro exemplo aplicado: logs

Em backend, às vezes você precisa abrir uma pasta de logs.

Exemplo:

```powershell
cd C:\dev\projects\api-pedidos\logs
ls
```

Pode haver arquivos:

```text
app.log
error.log
access.log
```

Você pode abrir, copiar, mover, limpar pasta ou verificar se o log foi gerado.

Mais tarde, veremos comandos melhores para leitura de arquivo.

Mas a base é a mesma:

```text
navegar até a pasta;
ver o que existe;
executar ação.
```

---

## Erros comuns

### Erro 1 — Rodar comando na pasta errada

Exemplo:

```powershell
javac Main.java
```

Erro:

```text
file not found: Main.java
```

Antes de achar que o Java está quebrado:

```powershell
pwd
ls
```

Veja se `Main.java` está ali.

---

### Erro 2 — Criar pasta no lugar errado

A pessoa queria criar:

```text
C:\dev\projects\formacao-java-backend\docs
```

mas estava em:

```text
C:\Users\usuario
```

e rodou:

```powershell
mkdir docs
```

Resultado:

```text
C:\Users\usuario\docs
```

Correção:

```powershell
pwd
cd C:\dev\projects\formacao-java-backend
mkdir docs
```

---

### Erro 3 — Apagar sem conferir

Nunca use comando de remoção no automático.

Antes:

```powershell
pwd
ls
```

Depois:

```powershell
Remove-Item arquivo-correto.txt
```

Cuidado aumenta com pastas.

---

### Erro 4 — Confundir arquivo com pasta

Se `docs` é pasta, não trate como arquivo.

Se `README.md` é arquivo, não use `cd README.md`.

`cd` entra em pasta.

Arquivo se abre com editor, não com `cd`.

---

### Erro 5 — Copiar comando de Linux no PowerShell sem adaptar

Exemplo de Linux/macOS:

```bash
rm -rf pasta
```

No PowerShell, o comando é outro.

Não copie comando destrutivo sem entender.

A formação vai usar comandos adequados ao Windows/PowerShell quando o ambiente for Windows.

---

### Erro 6 — Ignorar mensagem de erro

Erro é informação.

Não leia só a primeira palavra.

Mensagem de erro costuma indicar:

```text
comando não encontrado;
arquivo não encontrado;
acesso negado;
caminho inválido;
classe não encontrada;
porta em uso;
falha de autenticação;
dependência ausente.
```

Backend forte lê erro.

Backend fraco tenta comando aleatório.

---

## Diagnóstico em quatro perguntas

Quando algo falhar no terminal, responda:

```text
1. Onde estou?
2. O arquivo ou pasta existe aqui?
3. O comando existe no sistema?
4. A mensagem de erro é do PowerShell ou da ferramenta?
```

Essas quatro perguntas resolvem muitos problemas.

Exemplo:

```powershell
git status
```

Erro:

```text
fatal: not a git repository
```

Isso não quer dizer que Git não está instalado.

Quer dizer:

```text
você não está dentro de um repositório Git
```

Outro exemplo:

```powershell
gittt status
```

Erro:

```text
The term 'gittt' is not recognized
```

Aqui o comando foi digitado errado.

São problemas diferentes.

---

## Comandos principais desta aula

Resumo dos comandos:

```powershell
pwd
ls
dir
cd
cd ..
mkdir
New-Item
Copy-Item
Move-Item
Remove-Item
cls
Get-History
where java
echo $env:JAVA_HOME
echo $env:Path
```

Não precisa decorar todos de uma vez.

Mas precisa praticar os principais:

```powershell
pwd
ls
cd
mkdir
New-Item
Remove-Item
```

Esses já dão autonomia inicial.

---

## Como isso prepara Java

Quando chegarmos em Java, vamos usar comandos como:

```bash
javac Main.java
java Main
```

Para esses comandos funcionarem, você precisa saber:

```text
onde está o arquivo;
se ele aparece no ls;
se está na pasta certa;
se o comando java existe;
se o comando javac existe;
se o erro é de ambiente ou de código.
```

Sem terminal, o aluno acha que tudo é “erro do Java”.

Com terminal, ele investiga.

---

## Como isso prepara Git

Quando chegarmos em Git, vamos usar:

```bash
git status
git add .
git commit -m "mensagem"
git log
```

Para isso, você precisa saber:

```text
em qual pasta está;
se está dentro do repositório;
quais arquivos existem;
quais arquivos foram criados;
o que deve entrar ou não no commit.
```

Terminal e Git caminham juntos.

---

## Como isso prepara Maven, Docker e produção

Maven:

```bash
mvn clean test
mvn package
```

Docker:

```bash
docker ps
docker compose up
```

Spring Boot:

```bash
mvn spring-boot:run
```

Logs:

```text
entrar em pasta;
abrir arquivo;
ver saída;
copiar evidência.
```

CI/CD:

```text
pipeline executa comandos.
```

Produção:

```text
servidores e containers são investigados com comandos.
```

Então esta aula não é pequena.

Ela é a porta de entrada da autonomia.

---

## Prática recomendada

Faça esta prática dentro de:

```text
C:\dev\labs
```

Comandos:

```powershell
cd C:\dev
mkdir labs\terminal-basico
cd labs\terminal-basico

pwd
ls

mkdir entrada
mkdir saida
mkdir docs

New-Item docs\terminal.md

ls
ls docs

Copy-Item docs\terminal.md docs\terminal-copia.md
ls docs

Move-Item docs\terminal-copia.md docs\terminal-renomeado.md
ls docs

Remove-Item docs\terminal-renomeado.md
ls docs

Get-History
cls
```

Depois responda no diário:

```markdown
# Aula 004 — Terminal e PowerShell

## Comandos que pratiquei
- pwd
- ls
- cd
- mkdir
- New-Item
- Copy-Item
- Move-Item
- Remove-Item
- cls
- Get-History

## O que entendi
Terminal depende de saber onde estou e qual comando quero executar.

## Erro que quero evitar
Rodar comando na pasta errada.

## Frase principal
Antes de executar comando: pwd e ls.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar a diferença entre terminal e PowerShell;
usar pwd para saber onde está;
usar ls/dir para listar arquivos;
usar cd para navegar;
criar pasta com mkdir;
criar arquivo com New-Item;
copiar com Copy-Item;
mover/renomear com Move-Item;
apagar arquivo com Remove-Item usando cuidado;
limpar tela com cls;
usar histórico e autocomplete;
entender que comando não encontrado é diferente de erro do programa;
usar where para localizar ferramentas;
entender por que terminal será usado com Java, Git, Maven, Docker e backend real.
```

Não precisa virar especialista em PowerShell.

Precisa deixar de ter medo e começar a diagnosticar.

---

## Fechamento da aula

Terminal é autonomia.

No começo, ele parece mais lento do que clicar.

Mas, com prática, ele vira clareza.

Você passa a entender onde está, o que existe, qual comando executou e o que falhou.

Isso cria uma postura profissional:

```text
não chutar;
investigar;
ler erro;
validar caminho;
confirmar arquivo;
executar com intenção.
```

Essa postura será usada em todas as próximas etapas.

Na próxima aula, vamos entrar em JDK, JRE, JVM e escolha de versão LTS.

Ali começamos a ligar o ambiente ao Java de verdade:

```text
quem compila;
quem executa;
por que existe JVM;
por que usar JDK;
por que versão LTS importa;
como validar java e javac no terminal.
```
