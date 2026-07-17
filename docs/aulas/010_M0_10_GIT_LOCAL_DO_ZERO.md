# 010 — M0.10 — Git local do zero: seu primeiro repositório, passo a passo

## O que você vai construir

Nesta aula você transformará uma pasta comum em um repositório Git e acompanhará, no terminal, cada mudança de estado até formar um pequeno histórico.

Ao final, o laboratório terá esta estrutura:

```text
git-local-do-zero/
├── .git/          pasta interna criada pelo Git
├── .gitignore     regras para arquivos que não serão versionados
├── Main.class     arquivo de teste ignorado
└── README.md      documentação versionada
```

E o histórico terá quatro commits pequenos:

```text
Configura arquivos ignorados do projeto
Explica que Git local não depende de remoto
Documenta objetivo do laboratorio
Adiciona README inicial
```

Você não precisa decorar comandos. O objetivo é enxergar o ciclo acontecendo e entender o que o Git informa depois de cada ação.

> As saídas mostradas são modelos reais. O caminho da sua pasta, a versão do Git, a data e os códigos dos commits serão diferentes.

## Antes de começar: valide o ambiente

Abra o **PowerShell**. Não use o console do navegador nem o campo de busca do Windows.

Execute um comando por vez:

```powershell
git --version
git config --global user.name
git config --global user.email
git config --global init.defaultBranch
```

Uma configuração válida se parece com esta:

```text
git version 2.50.1.windows.1
Thiago Silva
thiago@example.com
main
```

O nome, o e-mail e a versão serão os seus. A última linha deve ser `main`, conforme configurado na aula anterior.

Se `git --version` produzir a mensagem abaixo, o Git não está disponível nesse terminal:

```text
git : O termo 'git' não é reconhecido como nome de cmdlet...
```

Feche o PowerShell, abra novamente e teste. Se continuar, retorne à aula 009 e valide a instalação antes de prosseguir.

Se nome ou e-mail não aparecerem, configure-os com seus dados reais:

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
git config --global init.defaultBranch main
```

## Entenda o mapa antes de digitar comandos

Durante a aula, um arquivo poderá estar em três lugares lógicos:

![Diagrama das três áreas do Git: working tree, staging area e repository](/lesson-assets/010-git-local/01-tres-areas-git.svg)

- **Working tree:** os arquivos que você está editando na pasta.
- **Staging area:** as mudanças escolhidas para o próximo commit.
- **Repository:** os commits já registrados dentro da pasta `.git`.

Os quatro movimentos principais serão:

```text
git add                 working tree → staging area
git commit              staging area → repository
git restore --staged    staging area → working tree
git restore             descarta mudança não commitada do working tree
```

O Git local funciona sem GitHub e sem internet. GitHub será assunto da próxima aula.

## Passo 1 — Crie uma pasta exclusiva para o laboratório

Primeiro, garanta que a pasta de laboratórios existe:

```powershell
New-Item -ItemType Directory -Path C:\dev\labs -Force | Out-Null
Set-Location C:\dev\labs
```

Crie a pasta desta aula e entre nela:

```powershell
New-Item -ItemType Directory -Path git-local-do-zero | Out-Null
Set-Location git-local-do-zero
```

Confirme onde você está:

```powershell
Get-Location
Get-ChildItem
```

Saída esperada do primeiro comando:

```text
Path
----
C:\dev\labs\git-local-do-zero
```

`Get-ChildItem` ainda não deve listar arquivos. Isso é esperado: a pasta acabou de ser criada.

> Se aparecer “o item já existe”, não sobrescreva nem apague nada. Use outro nome, como `git-local-do-zero-2`, e continue nele.

## Passo 2 — Transforme a pasta em repositório

Confira mais uma vez o caminho exibido no prompt. Ele deve terminar com:

```text
C:\dev\labs\git-local-do-zero
```

Agora inicialize o repositório:

```powershell
git init
```

Saída esperada:

```text
Initialized empty Git repository in C:/dev/labs/git-local-do-zero/.git/
```

Essa frase confirma duas coisas:

1. um repositório vazio foi iniciado;
2. os dados internos estão em `.git/`.

A pasta `.git` é oculta. Para visualizá-la no PowerShell:

```powershell
Get-ChildItem -Force
```

Saída resumida:

```text
Mode   Name
----   ----
d--h-  .git
```

Não edite nem apague `.git`. Ela contém o histórico e a configuração local do repositório.

## Passo 3 — Leia o primeiro `git status`

Execute:

```powershell
git status
```

Saída esperada:

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

Leia linha por linha:

- `On branch main`: você está na branch `main`.
- `No commits yet`: ainda não existe histórico.
- `nothing to commit`: não existe mudança para registrar.

O `git status` não modifica nada. Ele apenas descreve o estado atual e pode ser usado sempre que você estiver em dúvida.

## Passo 4 — Crie e edite o primeiro arquivo

Crie um arquivo vazio chamado `README.md`:

```powershell
New-Item -ItemType File -Path README.md | Out-Null
```

Abra-o no Bloco de Notas:

```powershell
notepad README.md
```

Cole exatamente este conteúdo:

```markdown
# Git Local do Zero

Laboratório para aprender Git local.
```

Salve com `Ctrl+S` e feche o Bloco de Notas. De volta ao PowerShell, confirme o arquivo:

```powershell
Get-Content README.md
```

Saída esperada:

```text
# Git Local do Zero

Laboratório para aprender Git local.
```

Agora pergunte ao Git o que mudou:

```powershell
git status
```

Trecho importante da saída:

```text
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present
```

`Untracked` significa **não rastreado**. O arquivo existe na pasta, mas ainda não faz parte do histórico Git.

Uma visão compacta mostra a mesma informação:

```powershell
git status --short
```

Saída:

```text
?? README.md
```

Os dois pontos de interrogação significam “arquivo ainda não rastreado”.

## Passo 5 — Prepare o arquivo para o primeiro commit

Adicione apenas o README à staging area:

```powershell
git add README.md
```

O comando normalmente não imprime nada quando funciona. Confirme o novo estado:

```powershell
git status
```

Trecho esperado:

```text
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
```

Agora o arquivo está preparado, mas ainda não foi commitado.

Na visão curta:

```powershell
git status --short
```

Saída:

```text
A  README.md
```

O `A` na primeira coluna significa que a adição está na staging area.

Antes do commit, veja exatamente o que está preparado:

```powershell
git diff --staged
```

Parte da saída:

```diff
diff --git a/README.md b/README.md
new file mode 100644
--- /dev/null
+++ b/README.md
@@ -0,0 +1,3 @@
+# Git Local do Zero
+
+Laboratório para aprender Git local.
```

Linhas iniciadas por `+` serão adicionadas pelo próximo commit. Cabeçalhos como `+++ b/README.md` pertencem ao formato do diff; eles não são conteúdo do arquivo.

## Passo 6 — Crie o primeiro commit

Registre a mudança preparada:

```powershell
git commit -m "Adiciona README inicial"
```

Saída semelhante a esta confirma o commit:

```text
[main (root-commit) 4f2c8a1] Adiciona README inicial
 1 file changed, 3 insertions(+)
 create mode 100644 README.md
```

- `main`: branch que recebeu o commit;
- `root-commit`: primeiro commit do repositório;
- `4f2c8a1`: identificador curto, diferente em cada máquina;
- `1 file changed`: um arquivo foi afetado;
- `3 insertions`: três linhas foram adicionadas.

Veja o histórico resumido:

```powershell
git log --oneline
```

Saída:

```text
4f2c8a1 (HEAD -> main) Adiciona README inicial
```

`HEAD -> main` indica que você está no ponto mais recente da branch `main`.

Confirme que a área de trabalho ficou limpa:

```powershell
git status
```

Saída esperada:

```text
On branch main
nothing to commit, working tree clean
```

![Mock de terminal mostrando o primeiro ciclo completo do Git](/lesson-assets/010-git-local/02-primeiro-commit-terminal.svg)

Você completou o primeiro ciclo:

```text
criar → verificar → preparar → revisar → commitar → consultar histórico
```

## Passo 7 — Altere um arquivo e aprenda a ler o `diff`

Abra novamente o README:

```powershell
notepad README.md
```

Acrescente no final:

```markdown

## Objetivo

Praticar o ciclo básico do Git.
```

Salve e feche. Consulte o estado compacto:

```powershell
git status --short
```

Saída:

```text
 M README.md
```

O `M` na segunda coluna significa que o arquivo foi modificado no working tree, mas ainda não está na staging area.

Veja a alteração:

```powershell
git diff
```

Trecho esperado:

```diff
@@ -1,3 +1,7 @@
 # Git Local do Zero

 Laboratório para aprender Git local.
+
+## Objetivo
+
+Praticar o ciclo básico do Git.
```

Se aparecer um aviso sobre `LF` e `CRLF`, não significa que o conteúdo foi perdido. Ele se refere ao padrão de quebra de linha usado pelo Windows e pelo Git.

Prepare e revise a mudança:

```powershell
git add README.md
git diff --staged
```

Crie o segundo commit:

```powershell
git commit -m "Documenta objetivo do laboratorio"
```

Valide:

```powershell
git log --oneline
git status
```

O log agora deve mostrar dois commits, o mais recente em cima:

```text
91ac730 (HEAD -> main) Documenta objetivo do laboratorio
4f2c8a1 Adiciona README inicial
```

## Passo 8 — Configure o `.gitignore` e prove que ele funciona

Crie um arquivo que representa um artefato compilado de Java:

```powershell
New-Item -ItemType File -Path Main.class | Out-Null
git status --short
```

Saída:

```text
?? Main.class
```

Esse arquivo não deve ser versionado. Crie o `.gitignore`:

```powershell
New-Item -ItemType File -Path .gitignore | Out-Null
notepad .gitignore
```

Cole:

```gitignore
# Java e ferramentas de build
*.class
out/
target/

# IntelliJ IDEA
.idea/
*.iml

# Sistema operacional
.DS_Store
Thumbs.db

# Arquivos temporários gerados localmente
*.tmp
*.log
```

Salve e feche. Consulte o estado:

```powershell
git status --short
```

Saída esperada:

```text
?? .gitignore
```

`Main.class` sumiu da lista porque corresponde à regra `*.class`. O arquivo continua no computador. Confira:

```powershell
Test-Path Main.class
```

Saída:

```text
True
```

Descubra qual regra o ignorou:

```powershell
git check-ignore -v Main.class
```

Saída semelhante:

```text
.gitignore:2:*.class    Main.class
```

Agora versione apenas a regra:

```powershell
git add .gitignore
git diff --staged
git commit -m "Configura arquivos ignorados do projeto"
```

O `.gitignore` deve ser criado cedo. Se um arquivo já foi commitado, adicionar uma regra não o remove automaticamente do histórico. Nessa situação, não apague nada no impulso; primeiro confirme o arquivo e use, com intenção, `git rm --cached NOME_DO_ARQUIVO` em uma correção separada.

> A regra `*.log` é adequada para logs gerados pela aplicação. Se o projeto tiver um arquivo `.log` criado intencionalmente como exemplo didático, será necessário criar uma exceção ou escolher outro formato.

## Passo 9 — Descarte uma alteração local com segurança

Agora você praticará um comando que pode apagar trabalho não commitado.

Abra o README:

```powershell
notepad README.md
```

Acrescente no final:

```text
linha errada qualquer
```

Salve e feche. Antes de descartar, veja exatamente o que mudou:

```powershell
git diff
```

Você deverá encontrar:

```diff
+linha errada qualquer
```

Como essa linha foi criada de propósito e não deve permanecer, restaure o arquivo para o último commit:

```powershell
git restore README.md
```

O comando normalmente não imprime nada. Confirme de duas maneiras:

```powershell
git status --short
Get-Content README.md
```

`git status --short` não deve imprimir nada, e a linha errada não deve aparecer no conteúdo.

![Fluxo seguro para decidir entre git add, git restore --staged e git restore](/lesson-assets/010-git-local/03-restore-com-seguranca.svg)

Regra de segurança:

```text
antes de git restore, execute git diff e leia o que será perdido
```

## Passo 10 — Retire uma mudança da staging sem apagá-la

Abra o README novamente:

```powershell
notepad README.md
```

Acrescente:

```markdown

## Observação

Git local registra histórico sem depender de remoto.
```

Salve, feche e prepare a alteração:

```powershell
git add README.md
git status --short
```

Saída:

```text
M  README.md
```

Agora o `M` está na primeira coluna: a mudança está na staging area.

Retire-a da staging sem apagar o texto:

```powershell
git restore --staged README.md
git status --short
```

Saída:

```text
 M README.md
```

O `M` voltou para a segunda coluna. Confira que o texto continua no arquivo:

```powershell
Get-Content README.md
```

Prepare novamente e finalize:

```powershell
git add README.md
git diff --staged
git commit -m "Explica que Git local não depende de remoto"
```

A diferença agora está clara:

```text
git restore --staged README.md  → mantém o texto e apenas desfaz o git add
git restore README.md           → descarta a alteração local não commitada
```

## Passo 11 — Faça a inspeção final

Execute:

```powershell
git status
git log --oneline
Get-ChildItem -Force
```

O estado final deve incluir:

```text
On branch main
nothing to commit, working tree clean
```

O log terá quatro commits. Os códigos serão diferentes:

```text
e12ba77 (HEAD -> main) Explica que Git local não depende de remoto
bd8c104 Configura arquivos ignorados do projeto
91ac730 Documenta objetivo do laboratorio
4f2c8a1 Adiciona README inicial
```

Na pasta você verá `.git`, `.gitignore`, `Main.class` e `README.md`. O arquivo `Main.class` existe, mas não aparece no status porque está ignorado.

## O que você acabou de aprender

Você executou o ciclo essencial do Git local:

```text
arquivo novo
→ untracked
→ git add
→ staged
→ git commit
→ histórico
```

Também praticou dois caminhos de retorno:

```text
staged → git restore --staged → modificado, mas preservado
modificado → git restore → alteração descartada
```

Em um projeto da formação, o mesmo raciocínio será aplicado a arquivos reais:

```text
README.md
docs/diario-de-bordo.md
src/Main.java
pom.xml
testes
configurações versionáveis
```

Um commit deve representar uma intenção compreensível. Exemplos:

```text
Adiciona primeiro programa Java
Documenta comandos básicos do terminal
Corrige validação de entrada do usuário
Configura gitignore para projeto Maven
```

Evite mensagens como `ajuste`, `teste`, `coisas` e `final`, porque elas não explicam a mudança.

Em um sistema corporativo de ordens de serviço, por exemplo, prefira:

```text
Valida status permitido no reagendamento de atividade
```

em vez de:

```text
ajuste
```

Commits pequenos facilitam revisão, investigação e reversão. Não misture documentação, código, configuração e arquivos gerados sem uma razão clara.

## Exercício prático principal

Sem copiar o roteiro anterior linha por linha, crie um arquivo chamado `anotacoes-git.md` com:

```markdown
# Minhas anotações de Git

## Working tree

## Staging area

## Repository
```

Seu desafio é:

1. criar e editar o arquivo;
2. confirmar que está `untracked`;
3. adicioná-lo à staging area;
4. revisar com `git diff --staged`;
5. criar o commit `Adiciona anotacoes sobre as areas do Git`;
6. acrescentar uma explicação em cada seção;
7. revisar com `git diff`;
8. criar o commit `Explica as tres areas do Git`;
9. terminar com `working tree clean`.

Não avance se o estado final não estiver limpo. Use `git status` para descobrir o que falta.

## Fechamento e próxima aula

O Git já controla o histórico dentro da sua máquina. Nenhum commit foi enviado para a internet.

Na aula 011, você criará uma conta no GitHub, abrirá um repositório remoto vazio, copiará a URL correta, autenticará a máquina e publicará este histórico com `git push`.

---

# Material complementar

## Tabela de consulta rápida

| Comando | O que faz | Altera arquivos? |
|---|---|---|
| `git init` | Cria a estrutura interna do repositório | Cria `.git` |
| `git status` | Mostra o estado atual | Não |
| `git status --short` | Mostra o estado de forma compacta | Não |
| `git add arquivo` | Prepara uma mudança | Não altera o conteúdo |
| `git diff` | Mostra mudanças fora da staging | Não |
| `git diff --staged` | Mostra mudanças preparadas | Não |
| `git commit -m "..."` | Registra as mudanças preparadas | Cria histórico |
| `git log --oneline` | Mostra o histórico resumido | Não |
| `git restore --staged arquivo` | Desfaz o `git add` | Preserva o conteúdo |
| `git restore arquivo` | Descarta alteração não commitada | Sim, pode perder trabalho |
| `git check-ignore -v arquivo` | Explica qual regra ignora o arquivo | Não |

## Como ler `git status --short`

As duas primeiras colunas representam staging area e working tree:

```text
?? README.md   arquivo não rastreado
A  README.md   arquivo novo preparado
 M README.md   arquivo modificado fora da staging
M  README.md   modificação preparada
```

## Erros comuns e correções

### `fatal: not a git repository`

Você provavelmente está na pasta errada.

```powershell
Get-Location
Get-ChildItem -Force
```

Entre na pasta que contém `.git` e tente novamente.

### `Author identity unknown`

Nome ou e-mail não foram configurados:

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

Depois repita o commit.

### `pathspec ... did not match any files`

O nome informado não existe na pasta ou foi digitado incorretamente:

```powershell
Get-ChildItem
git status
```

Copie o nome correto e repita o comando.

### `nothing to commit, working tree clean`

Isso não é erro. Significa que não há mudança pendente.

### O arquivo ignorado não aparece

Esse é o comportamento esperado. Confirme a regra:

```powershell
git check-ignore -v NOME_DO_ARQUIVO
```

### Rodei `git init` na pasta errada

Pare antes de executar outros comandos. Não apague `.git` de forma impulsiva, pois ela pode conter um histórico existente. Confira `Get-Location`, veja o conteúdo com `Get-ChildItem -Force` e procure orientação antes de remover qualquer repositório.

## O que não deve entrar em commit

Normalmente não são versionados:

- `.class`, `out/` e `target/`;
- configurações pessoais da IDE;
- logs e temporários gerados;
- cópias manuais do projeto;
- senhas, tokens e chaves privadas;
- `.env` real com credenciais;
- dados reais de clientes.

Antes de cada commit profissional, use esta sequência:

```powershell
git status
git diff
git add ARQUIVOS_ESCOLHIDOS
git diff --staged
git commit -m "Mensagem clara"
```

`git add .` é válido, mas adiciona tudo que não estiver ignorado. No começo, prefira informar os arquivos conscientemente. Se usar `git add .`, confira imediatamente com `git status` e `git diff --staged`.

## Checkpoint final

- [ ] Validei versão, nome, e-mail e branch padrão.
- [ ] Criei o laboratório na pasta correta.
- [ ] Vi a pasta `.git` com `Get-ChildItem -Force`.
- [ ] Interpretei estados `untracked`, `staged` e `clean`.
- [ ] Criei commits com mensagens claras.
- [ ] Comparei `git diff` e `git diff --staged`.
- [ ] Provei uma regra com `git check-ignore -v`.
- [ ] Usei `git restore` somente depois de ler o diff.
- [ ] Usei `git restore --staged` sem perder o conteúdo.
- [ ] Concluí o exercício com `working tree clean`.
