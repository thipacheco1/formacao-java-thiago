# 010 — M0.10 — Git Local do Zero

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.10.01` — Git local do zero — Conceito, por que existe e vocabulário essencial.
- `M0.10.02` — Git local do zero — Exemplo mínimo digitado do zero.
- `M0.10.03` — Git local do zero — Exemplo aplicado ao domínio corporativo.
- `M0.10.04` — Git local do zero — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar Git local como prática real de versionamento, rastreabilidade e segurança de mudança.

---

## Onde estamos na formação

Até aqui, a formação construiu uma base operacional importante:

```text
mapa da formação;
diagnóstico inicial;
organização do Windows;
terminal e PowerShell;
JDK, JRE e JVM;
compilação manual com javac;
IntelliJ IDEA Community;
debug inicial;
instalação e configuração global do Git.
```

Agora vamos usar Git de verdade.

Na aula anterior, o foco foi preparar o Git:

```text
git instalado;
git acessível no terminal;
user.name configurado;
user.email configurado;
branch inicial main;
core.autocrlf;
editor básico.
```

Agora o foco é criar um repositório local do zero e entender o ciclo básico:

```text
iniciar repositório;
ver estado;
adicionar arquivos;
criar commit;
ver histórico;
comparar mudanças;
desfazer alteração de trabalho;
ignorar arquivos que não devem ser versionados.
```

Essa aula é uma das mais importantes do módulo zero.

A partir daqui, a formação começa a deixar rastro técnico real.

---

## Hoje a aula é sobre transformar pasta em repositório

Uma pasta comum guarda arquivos.

Um repositório Git guarda arquivos com histórico.

Essa é a diferença.

Antes do Git:

```text
tenho uma pasta com arquivos.
```

Depois do Git:

```text
tenho uma pasta com arquivos e histórico controlado.
```

Isso significa que o Git passa a conseguir responder:

```text
o que mudou?
quais arquivos estão novos?
quais arquivos foram alterados?
o que está pronto para commit?
qual foi o último commit?
qual é o histórico?
qual diferença existe entre agora e o último ponto salvo?
```

Esse poder começa com um comando:

```bash
git init
```

Mas não se engane.

O comando é simples.

O conceito é profundo.

---

## Git local não depende de GitHub

Antes de seguir, fixe isso:

```text
Git local funciona sem GitHub.
```

Você pode criar um repositório local, fazer commits, ver histórico e controlar versões sem internet.

GitHub entra depois, quando queremos:

```text
subir o repositório para remoto;
colaborar com outras pessoas;
abrir pull request;
ter backup remoto;
integrar pipeline;
exibir portfólio.
```

Nesta aula, não precisamos de remoto.

Vamos aprender o núcleo.

Quem não entende Git local sofre no GitHub.

Quem entende Git local aprende GitHub com muito mais clareza.

---

## O ciclo mental do Git

O Git tem um fluxo básico.

Pense em três áreas:

```text
Working tree
Staging area
Repository
```

Vamos traduzir.

### Working tree

É a sua área de trabalho.

É onde você edita arquivos.

Exemplo:

```text
criou Main.java;
alterou README.md;
editou diario-de-bordo.md;
apagou arquivo temporário.
```

Essas mudanças existem na pasta, mas ainda não foram preparadas para commit.

---

### Staging area

É a área de preparação.

Quando você usa:

```bash
git add
```

você diz ao Git:

```text
esta mudança deve entrar no próximo commit.
```

O `git add` não cria commit.

Ele prepara.

É como separar documentos em cima da mesa antes de arquivar oficialmente.

---

### Repository

É o histórico salvo.

Quando você usa:

```bash
git commit
```

você cria um ponto no histórico.

O commit registra um conjunto de mudanças preparadas.

Então o fluxo é:

```text
edita arquivo
↓
git status
↓
git add
↓
git status
↓
git commit
↓
git log
```

Esse ciclo será repetido centenas de vezes ao longo da formação e da vida profissional.

---

## `git init`

O comando:

```bash
git init
```

inicia um repositório Git na pasta atual.

Ele cria uma pasta oculta:

```text
.git
```

Essa pasta guarda os dados internos do Git.

Você normalmente não edita `.git` manualmente.

Ela é o coração do repositório.

Sem `.git`, a pasta é só uma pasta.

Com `.git`, a pasta vira repositório.

---

## Cuidado com onde roda `git init`

Este é um erro muito comum.

Se você roda:

```bash
git init
```

na pasta errada, transforma a pasta errada em repositório.

Antes de rodar:

```bash
git init
```

sempre confira:

```powershell
pwd
ls
```

Se a pasta atual é:

```text
C:\dev\projects\formacao-java-backend
```

e esse é o projeto, tudo bem.

Se a pasta atual é:

```text
C:\dev
```

talvez você esteja prestes a transformar a raiz de desenvolvimento inteira em um repositório, o que não é desejado.

Regra:

```text
um projeto = um repositório
```

Não transforme `C:\dev` inteiro em repositório se dentro dele existem vários projetos.

---

## `git status`

Se existe um comando que deve virar hábito, é este:

```bash
git status
```

Ele mostra o estado atual do repositório.

Ele responde:

```text
em qual branch estou?
há arquivos novos?
há arquivos modificados?
há arquivos preparados para commit?
há algo para commitar?
o working tree está limpo?
```

Use `git status` o tempo todo.

Antes de adicionar.

Depois de adicionar.

Antes de commit.

Depois de commit.

Antes de mexer em algo sensível.

Depois de resolver erro.

`git status` é o painel do Git.

---

## `git add`

O comando `git add` coloca mudanças na staging area.

Exemplo:

```bash
git add README.md
```

Isso prepara o arquivo `README.md` para o próximo commit.

Para adicionar uma pasta:

```bash
git add docs
```

Para adicionar tudo que mudou:

```bash
git add .
```

Mas cuidado com `git add .`.

Ele é prático, mas pode adicionar lixo se o `.gitignore` estiver ruim ou se você não conferiu o estado antes.

Boa prática:

```bash
git status
git add .
git status
```

O segundo `git status` confirma o que foi preparado.

---

## `git commit`

O comando `git commit` cria um ponto no histórico.

Exemplo:

```bash
git commit -m "Adiciona estrutura inicial do projeto"
```

A mensagem precisa explicar a intenção da mudança.

Não escreva mensagens vazias como:

```text
ajuste
teste
alterações
coisas
final
commit
```

Essas mensagens não ajudam ninguém.

Prefira:

```text
Adiciona estrutura inicial do projeto
Documenta comandos basicos do terminal
Adiciona exemplo de compilacao manual
Corrige validacao de entrada do usuario
```

Uma boa mensagem responde:

```text
o que este commit faz?
```

Mais tarde, veremos padrões mais formais como Conventional Commits.

Agora, o foco é clareza.

---

## `git log`

O comando:

```bash
git log
```

mostra o histórico de commits.

Ele exibe informações como:

```text
hash do commit;
autor;
data;
mensagem.
```

Exemplo:

```text
commit a1b2c3...
Author: Nome <email@exemplo.com>
Date: ...

    Adiciona estrutura inicial do projeto
```

Para uma visão mais curta:

```bash
git log --oneline
```

Exemplo:

```text
a1b2c3d Adiciona estrutura inicial do projeto
```

O `git log` mostra que o Git está guardando história.

Sem log, não há memória.

---

## `git diff`

O comando:

```bash
git diff
```

mostra diferenças entre o que foi alterado no working tree e o que estava no último estado conhecido.

Exemplo:

```bash
git diff
```

Se você alterou `README.md`, o Git mostra linhas removidas e adicionadas.

Isso ajuda a revisar antes de commitar.

Um desenvolvedor cuidadoso não commita no escuro.

Ele olha:

```bash
git status
git diff
```

Depois decide o que adicionar.

Também existe:

```bash
git diff --staged
```

Esse mostra o que já foi preparado com `git add`.

Ou seja:

```text
git diff          → mudanças ainda não preparadas
git diff --staged → mudanças preparadas para commit
```

No começo, pratique os dois.

---

## `git restore`

O comando:

```bash
git restore arquivo
```

descarta alterações locais de um arquivo que ainda não foram commitadas.

Exemplo:

```bash
git restore README.md
```

Isso volta o arquivo ao estado do último commit.

Cuidado: alterações descartadas com `git restore` podem ser perdidas.

Antes de usar:

```bash
git diff
```

Veja o que será descartado.

Git dá poder.

Poder exige atenção.

---

## `git restore --staged`

Se você adicionou um arquivo com `git add`, mas quer tirar da staging area sem perder a alteração, use:

```bash
git restore --staged arquivo
```

Exemplo:

```bash
git restore --staged README.md
```

Isso não apaga sua alteração.

Só remove da área preparada para commit.

Pense assim:

```text
git restore --staged = tire da mesa do próximo commit
git restore = descarte a mudança no arquivo
```

São coisas diferentes.

---

## `.gitignore`

O `.gitignore` diz ao Git quais arquivos devem ser ignorados.

Isso é essencial.

Sem `.gitignore`, o Git pode mostrar arquivos que não deveriam ser versionados:

```text
.class
out/
target/
.idea/
*.iml
arquivos temporários
logs locais
```

Um `.gitignore` inicial para esta formação pode ser:

```gitignore
# Java
*.class
out/
target/

# IntelliJ
.idea/
*.iml

# Sistema operacional
.DS_Store
Thumbs.db

# Temporários
*.tmp
*.log
```

Mas cuidado: ignorar `*.log` pode ser bom para logs gerados, mas ruim se você tiver um arquivo de exemplo intencional.

O `.gitignore` precisa refletir o projeto.

---

## Arquivo ignorado não some do computador

Quando um arquivo está no `.gitignore`, ele não é apagado.

Ele apenas deixa de aparecer como candidato ao versionamento.

Exemplo:

```text
Main.class continua existindo na pasta.
Git apenas não tenta versionar.
```

Isso é importante.

`.gitignore` não limpa projeto.

Ele orienta o Git.

---

## Se o arquivo já foi versionado, `.gitignore` não remove sozinho

Esse é um erro comum.

Se um arquivo já entrou em um commit, colocar no `.gitignore` não faz o Git parar automaticamente de rastrear esse arquivo.

O `.gitignore` atua principalmente sobre arquivos ainda não rastreados.

Se algo já foi versionado por engano, precisa remover do rastreamento com cuidado.

Mais tarde veremos isso melhor.

Por enquanto, a regra é:

```text
crie .gitignore cedo.
```

Antes de commitar lixo.

---

## Exemplo mínimo: criando um repositório local

Vamos criar um laboratório.

No PowerShell:

```powershell
cd C:\dev\labs
mkdir git-local-do-zero
cd git-local-do-zero
```

Confira:

```powershell
pwd
ls
```

Inicie o Git:

```bash
git init
```

Veja o estado:

```bash
git status
```

Crie um arquivo:

```powershell
New-Item README.md
```

Abra o arquivo e coloque:

```markdown
# Git Local do Zero

Laboratório para aprender Git local.
```

Agora:

```bash
git status
```

Você deve ver `README.md` como arquivo não rastreado.

Adicione:

```bash
git add README.md
```

Veja:

```bash
git status
```

Crie o commit:

```bash
git commit -m "Adiciona README inicial"
```

Veja o histórico:

```bash
git log --oneline
```

Esse é o primeiro ciclo completo:

```text
criar arquivo
ver status
adicionar
ver status
commitar
ver log
```

---

## Segundo ciclo: alterando arquivo

Agora altere o `README.md`:

```markdown
# Git Local do Zero

Laboratório para aprender Git local.

## Objetivo

Entender init, status, add, commit, log, diff e restore.
```

Veja o status:

```bash
git status
```

Veja a diferença:

```bash
git diff
```

Adicione:

```bash
git add README.md
```

Veja o que está preparado:

```bash
git diff --staged
```

Commit:

```bash
git commit -m "Documenta objetivo do laboratorio Git"
```

Histórico:

```bash
git log --oneline
```

Agora existem dois commits.

O histórico começou a contar uma história.

---

## Terceiro ciclo: usando `.gitignore`

Crie um arquivo que não deve ser versionado:

```powershell
New-Item Main.class
```

Veja:

```bash
git status
```

O Git provavelmente mostra `Main.class` como não rastreado.

Agora crie `.gitignore`:

```powershell
New-Item .gitignore
```

Conteúdo:

```gitignore
*.class
out/
target/
.idea/
*.iml
.DS_Store
Thumbs.db
```

Veja:

```bash
git status
```

Agora `Main.class` deve sumir da lista.

Mas `.gitignore` deve aparecer.

Adicione e commite:

```bash
git add .gitignore
git commit -m "Adiciona gitignore inicial"
```

Veja:

```bash
git log --oneline
```

Isso ensina que Git não precisa versionar tudo.

Precisa versionar o que importa.

---

## Quarto ciclo: usando `restore` com cuidado

Altere `README.md` adicionando uma linha ruim:

```markdown
linha errada qualquer
```

Veja:

```bash
git diff
```

Agora descarte a alteração:

```bash
git restore README.md
```

Veja:

```bash
git status
```

Abra o arquivo e confirme que a linha sumiu.

Esse comando é útil, mas precisa de cuidado.

Regra:

```text
antes de restore, veja diff.
```

---

## Quinto ciclo: tirando arquivo da staging area

Altere `README.md` de novo com uma linha boa:

```markdown
## Observação

Git local registra histórico sem depender de remoto.
```

Adicione:

```bash
git add README.md
```

Veja:

```bash
git status
```

Agora tire da staging area sem perder a alteração:

```bash
git restore --staged README.md
```

Veja:

```bash
git status
```

A alteração continua no arquivo, mas não está mais preparada.

Adicione de novo e commite:

```bash
git add README.md
git commit -m "Explica que Git local nao depende de remoto"
```

Esse fluxo ensina uma diferença importante:

```text
unstage não é apagar alteração.
```

---

## Exemplo aplicado ao projeto da formação

Agora pense no repositório da formação.

Ele pode ter:

```text
docs/diagnostico-inicial.md
docs/diario-de-bordo.md
docs/atalhos.md
src/Main.java
README.md
.gitignore
```

Um bom primeiro commit poderia ser:

```bash
git add README.md .gitignore docs src
git commit -m "Adiciona estrutura inicial da formacao Java Backend"
```

Depois, ao concluir uma aula:

```bash
git add docs/diario-de-bordo.md
git commit -m "Registra aprendizado sobre terminal e PowerShell"
```

Depois, ao criar um exemplo Java:

```bash
git add src/Main.java
git commit -m "Adiciona primeiro programa Java"
```

Perceba que os commits contam uma história.

Não são cópias aleatórias.

São pontos de evolução.

---

## Exemplo aplicado ao domínio corporativo

Imagine um backend de ordem de serviço.

Você precisa alterar uma regra:

```text
atividade só pode ser reagendada se estiver em status AGENDADO ou REAGENDADO
```

Um commit ruim seria:

```text
ajuste
```

Um commit melhor:

```text
Valida status permitido no reagendamento de atividade
```

Por quê?

Porque, no futuro, alguém pode olhar o histórico e entender:

```text
esse commit mexeu na regra de status do reagendamento.
```

Se der bug nessa regra, o histórico ajuda.

Git não é só salvar.

Git é comunicação técnica.

---

## Mensagens de commit coerentes

Uma mensagem boa deve ser curta, clara e específica.

Prefira verbos no presente:

```text
Adiciona
Corrige
Remove
Atualiza
Documenta
Refatora
Implementa
Configura
```

Exemplos bons:

```text
Adiciona README inicial
Configura gitignore para projeto Java
Documenta comandos basicos do terminal
Implementa exemplo de calculo com debug
Corrige nome da classe principal
```

Exemplos ruins:

```text
teste
aula
ok
final
alteracoes
subindo
corrigido
```

Uma boa mensagem ajuda você do futuro.

E ajuda o time.

---

## Commits pequenos

Evite fazer um commit gigante com tudo misturado.

Ruim:

```text
adiciona README, muda código, apaga arquivo, cria classe, altera docs, configura Git, mexe em teste
```

Melhor:

```text
Adiciona estrutura inicial
Documenta diagnóstico técnico
Adiciona exemplo de compilação manual
Configura gitignore para Java
```

Commits pequenos facilitam:

```text
review;
rollback;
investigação;
entendimento;
histórico limpo.
```

No começo, não precisa ser perfeito.

Mas precisa começar com intenção.

---

## O que não deve entrar em commit

Normalmente, não entram:

```text
.class;
out/;
target/;
logs locais;
arquivos temporários;
credenciais;
senhas;
tokens;
configurações pessoais da IDE;
arquivos grandes sem necessidade;
cópias manuais do projeto.
```

Em backend real, esse cuidado é ainda mais sério.

Nunca commite segredo.

Nunca commite senha.

Nunca commite token.

Nunca commite arquivo `.env` real com credenciais sensíveis.

Mais tarde, em segurança e DevOps, isso será aprofundado.

Mas a consciência começa agora.

---

## `git status` antes de todo commit

Antes de commitar, faça:

```bash
git status
```

Leia o que está em staging.

Depois:

```bash
git diff --staged
```

Confira o conteúdo preparado.

Só então:

```bash
git commit -m "Mensagem clara"
```

Isso evita commit acidental.

Profissional bom não commita no escuro.

---

## Erros comuns

### Erro 1 — Rodar `git init` na pasta errada

Sintoma:

```text
Git aparece monitorando coisa demais.
```

Diagnóstico:

```powershell
pwd
ls
git status
```

Correção depende do caso.

Por isso, antes de `git init`:

```powershell
pwd
```

---

### Erro 2 — Não usar `git status`

Sem `git status`, você não sabe o estado.

Correção:

```bash
git status
```

Use sempre.

---

### Erro 3 — Usar `git add .` sem olhar

Pode adicionar lixo.

Correção:

```bash
git status
git add .
git status
```

E mantenha `.gitignore` correto.

---

### Erro 4 — Commit com mensagem ruim

Ruim:

```text
teste
```

Melhor:

```text
Adiciona README inicial
```

---

### Erro 5 — Achar que `git add` salva no histórico

`git add` só prepara.

Quem salva no histórico é:

```bash
git commit
```

---

### Erro 6 — Achar que `git commit` manda para GitHub

Commit é local.

Para remoto, no futuro, usamos:

```bash
git push
```

Nesta aula, não há remoto.

---

### Erro 7 — Versionar `.class`

Correção:

```gitignore
*.class
```

E crie `.gitignore` cedo.

---

### Erro 8 — Usar `git restore` sem olhar o diff

Pode perder alteração.

Correção:

```bash
git diff
git restore arquivo
```

---

### Erro 9 — Confundir `restore` com `restore --staged`

```text
git restore arquivo
```

descarta alteração do arquivo.

```text
git restore --staged arquivo
```

tira da staging area, mantendo a alteração no arquivo.

---

### Erro 10 — Criar cópias manuais mesmo usando Git

Ruim:

```text
projeto-final
projeto-final-copia
projeto-final-certo
```

Correção:

```text
usar commits para histórico.
```

---

## Diagnóstico quando algo parecer errado

### O Git diz que não é repositório

Mensagem possível:

```text
fatal: not a git repository
```

Você provavelmente está fora de um repositório.

Verifique:

```powershell
pwd
ls
```

Entre na pasta correta ou rode `git init` se realmente ainda não iniciou.

---

### Arquivo não aparece no status

Possibilidades:

```text
arquivo não foi salvo;
arquivo está ignorado;
você está na pasta errada;
arquivo já está rastreado e sem alteração;
arquivo está fora do repositório.
```

Diagnóstico:

```bash
git status
```

e:

```powershell
pwd
ls
```

---

### `.class` aparece no status

Provavelmente `.gitignore` não está configurado ou foi criado depois.

Adicione:

```gitignore
*.class
```

Depois verifique:

```bash
git status
```

---

### Commit não funciona por falta de identidade

Configure:

```powershell
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
```

Valide:

```powershell
git config --global --list
```

---

### O histórico não aparece como esperado

Use:

```bash
git log --oneline
```

Se não há commits, talvez você ainda não tenha commitado.

Lembre:

```text
git add prepara.
git commit grava no histórico.
```

---

## Prática recomendada

Faça o laboratório completo.

```powershell
cd C:\dev\labs
mkdir git-local-do-zero
cd git-local-do-zero

pwd
ls

git init
git status

New-Item README.md
```

Conteúdo do `README.md`:

```markdown
# Git Local do Zero

Laboratório para aprender Git local.
```

Comandos:

```bash
git status
git add README.md
git status
git commit -m "Adiciona README inicial"
git log --oneline
```

Depois altere o README:

```markdown
# Git Local do Zero

Laboratório para aprender Git local.

## Objetivo

Entender init, status, add, commit, log, diff e restore.
```

Comandos:

```bash
git status
git diff
git add README.md
git diff --staged
git commit -m "Documenta objetivo do laboratorio Git"
git log --oneline
```

Agora `.gitignore`:

```powershell
New-Item Main.class
New-Item .gitignore
```

Conteúdo do `.gitignore`:

```gitignore
*.class
out/
target/
.idea/
*.iml
.DS_Store
Thumbs.db
```

Comandos:

```bash
git status
git add .gitignore
git commit -m "Adiciona gitignore inicial"
git log --oneline
```

Teste `restore`:

```text
adicione uma linha qualquer ruim no README.md
```

Comandos:

```bash
git diff
git restore README.md
git status
```

Essa prática dá base real.

---

## Registro no diário de bordo

Registre:

```markdown
# Aula 010 — Git local do zero

## O que aprendi
Aprendi que Git local transforma uma pasta em repositório com histórico e que o ciclo básico é editar, verificar status, adicionar, commitar e consultar log.

## Comandos praticados
- git init
- git status
- git add
- git commit
- git log
- git log --oneline
- git diff
- git diff --staged
- git restore
- git restore --staged

## Conceitos
Working tree:
Staging area:
Repository:
Commit:
.gitignore:

## Mensagens de commit usadas
-

## Erros que quero evitar
- rodar git init na pasta errada;
- usar git add . sem conferir;
- commitar com mensagem ruim;
- versionar .class;
- usar git restore sem olhar diff;
- confundir commit local com push para remoto.

## Frase principal
Git não é cópia de segurança manual. Git é histórico técnico controlado.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar a diferença entre pasta comum e repositório Git;
explicar que Git local não depende de GitHub;
usar git init na pasta correta;
entender o papel da pasta .git;
usar git status;
explicar working tree, staging area e repository;
usar git add;
usar git commit com mensagem clara;
usar git log e git log --oneline;
usar git diff;
usar git diff --staged;
criar .gitignore;
entender que .gitignore não apaga arquivo;
entender que .class não deve ser versionado;
usar git restore com cuidado;
usar git restore --staged;
evitar git add . sem verificar;
explicar por que commits pequenos ajudam;
relacionar Git com rastreabilidade profissional.
```

Não precisa ainda saber branch, merge, rebase ou remoto.

Isso virá em etapas próprias.

Agora o objetivo é dominar o ciclo local básico.

---

## Fechamento da aula

Git local é o começo da maturidade de versionamento.

A partir daqui, a formação deixa de ser apenas leitura e prática solta.

Ela pode virar história.

Cada arquivo criado, cada exemplo Java, cada diário de bordo, cada ajuste relevante pode ser registrado.

Isso cria uma postura profissional:

```text
eu sei o que mudei;
eu sei por que mudei;
eu sei quando mudei;
eu sei voltar e revisar;
eu não dependo de cópia manual;
eu trabalho com histórico.
```

Na próxima aula, vamos ligar esse repositório local ao mundo externo:

```text
GitHub;
repositório remoto;
remote;
push;
pull;
clone;
README;
visibilidade;
tokens e credenciais;
organização de portfólio.
```

Git local é a base.

Git remoto amplia essa base para colaboração, backup e exposição profissional.
