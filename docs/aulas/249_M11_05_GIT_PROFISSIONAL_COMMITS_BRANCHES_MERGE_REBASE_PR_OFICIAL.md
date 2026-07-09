# 249 — M11.05 — Git profissional: commits, branches, merge, rebase e pull request

## Objetivo da aula

Na aula anterior, você aprofundou Gradle.

Você estudou:

```text
build.gradle;
settings.gradle;
plugins;
repositories;
dependencies;
tasks;
Gradle Wrapper;
build incremental;
dependencyInsight;
toolchain;
CI/CD;
Spring futuro;
boas práticas.
```

Agora vamos aprofundar uma ferramenta indispensável para qualquer profissional backend:

```text
Git
```

Git não é apenas um lugar para guardar código.

Git é uma ferramenta de controle de versão, colaboração, rastreabilidade, revisão técnica e segurança do desenvolvimento.

Nesta aula, vamos estudar Git com profundidade profissional.

Ao final desta aula, você deve conseguir:

```text
entender o que é Git;
entender repositório local e remoto;
entender working directory, staging area e commit;
criar commits melhores;
entender branches;
entender merge;
entender rebase;
entender pull request;
resolver conflitos;
usar stash;
entender reset;
entender revert;
entender tags;
entender cherry-pick;
entender fluxo de trabalho profissional;
entender Git em CI/CD;
entender Git no contexto de backend Java;
evitar erros perigosos;
trabalhar melhor em time.
```

---

## Reforço do objetivo maior

Nosso objetivo é construir uma formação completa de Java Backend, saindo do básico até um nível avançado, com base para atuar como engenheiro ou arquiteto Java.

Por isso, Git precisa ser tratado com seriedade.

Um profissional avançado precisa saber:

```text
organizar histórico;
criar branches com intenção clara;
abrir pull request bem explicado;
resolver conflitos;
entender impacto de merge e rebase;
evitar quebrar branch compartilhada;
rastrear bugs por commit;
investigar regressões;
ler diff;
reverter mudança com segurança;
usar Git em fluxo profissional;
entender como Git conversa com pipeline.
```

Git mal usado atrapalha o time inteiro.

Git bem usado aumenta qualidade e confiança.

---

# Parte 1 — O que é Git

Git é um sistema de controle de versão distribuído.

Ele permite registrar a evolução dos arquivos de um projeto ao longo do tempo.

Com Git, você consegue:

```text
salvar versões do código;
comparar alterações;
voltar no tempo;
criar linhas paralelas de desenvolvimento;
integrar trabalho de várias pessoas;
rastrear quem mudou o quê;
entender quando um bug entrou;
trabalhar offline localmente;
sincronizar com repositório remoto.
```

---

## Git em uma frase prática

```text
Git registra a história técnica do projeto e permite colaboração segura entre desenvolvedores.
```

---

# Parte 2 — Git não é GitHub

Git é a ferramenta.

GitHub é uma plataforma que hospeda repositórios Git.

Outras plataformas:

```text
GitLab;
Bitbucket;
Azure DevOps;
Gitea;
CodeCommit.
```

Diferença:

```text
Git:
controle de versão.

GitHub/GitLab/Azure DevOps:
plataformas para hospedar, revisar e integrar repositórios.
```

Você usa Git localmente e sincroniza com uma plataforma remota.

---

# Parte 3 — Conceitos principais

## Repositório

É o projeto versionado pelo Git.

Quando você roda:

```bash
git init
```

Git cria uma pasta oculta:

```text
.git
```

Essa pasta guarda o histórico do repositório.

---

## Working Directory

É sua área de trabalho.

Onde você edita arquivos.

Exemplo:

```text
você altera App.java.
```

Essa alteração está no working directory.

---

## Staging Area

É a área de preparação para commit.

Você adiciona arquivos com:

```bash
git add arquivo
```

ou:

```bash
git add .
```

A staging area diz:

```text
estas alterações entrarão no próximo commit.
```

---

## Commit

Commit é um registro de alteração.

Ele tem:

```text
hash;
autor;
data;
mensagem;
alterações.
```

Exemplo:

```bash
git commit -m "Aula 249: adiciona laboratorio git profissional"
```

Commit deve representar uma unidade lógica.

---

## Branch

Branch é uma linha de desenvolvimento.

Exemplos:

```text
main;
develop;
feature/cadastro-produto;
bugfix/corrigir-validacao;
hotfix/ajuste-producao.
```

---

## Remote

Remote é um repositório remoto.

Exemplo comum:

```text
origin
```

Comando:

```bash
git remote -v
```

Mostra os remotes configurados.

---

# Parte 4 — Fluxo mental do Git

Fluxo básico:

```text
editar arquivo
  -> git status
  -> git add
  -> git commit
  -> git push
```

Exemplo:

```bash
git status
git add src/main/java/br/com/curso/App.java
git commit -m "Adiciona classe App"
git push
```

---

## O que acontece

```text
git status:
mostra estado atual.

git add:
prepara alterações.

git commit:
registra snapshot no histórico local.

git push:
envia commits locais para o remoto.
```

---

# Parte 5 — git status

O comando mais importante para segurança é:

```bash
git status
```

Use muito.

Ele mostra:

```text
branch atual;
arquivos modificados;
arquivos staged;
arquivos untracked;
situação em relação ao remoto.
```

Antes de qualquer ação importante:

```bash
git status
```

Depois também:

```bash
git status
```

---

# Parte 6 — git diff

Mostra alterações.

Alterações ainda não staged:

```bash
git diff
```

Alterações staged:

```bash
git diff --staged
```

Diff ajuda a revisar antes de commit.

Regra profissional:

```text
não commite sem olhar o que mudou.
```

---

## Leitura de diff

No diff, você verá:

```text
- linhas removidas
+ linhas adicionadas
```

Exemplo:

```diff
- return valor;
+ return valor.trim();
```

Isso mostra que o retorno foi alterado para remover espaços.

---

# Parte 7 — git add

Adiciona alterações à staging area.

Adicionar arquivo específico:

```bash
git add src/main/java/br/com/curso/App.java
```

Adicionar tudo:

```bash
git add .
```

Adicionar parte interativamente:

```bash
git add -p
```

---

## git add -p

Esse comando permite escolher pedaços da alteração.

É muito útil quando você alterou várias coisas, mas quer separar commits.

Exemplo:

```text
parte 1:
corrige validação.

parte 2:
refatora nome de variável.

parte 3:
ajusta teste.
```

Commits separados ficam mais limpos.

---

# Parte 8 — Commits profissionais

Um commit bom deve ser:

```text
pequeno;
coeso;
explicável;
rastreável;
testável;
com mensagem clara.
```

Mensagem ruim:

```text
ajustes
```

Mensagem melhor:

```text
Corrige validação de data no reagendamento
```

Mensagem boa:

```text
Impede reagendamento com data anterior à atual
```

---

## Commits contam história

Histórico ruim:

```text
teste
ajuste
arrumei
agora vai
final
final 2
```

Histórico bom:

```text
Adiciona validação de status para reagendamento
Cria testes para atividades inelegíveis
Registra histórico ao concluir reagendamento
Corrige mensagem de erro para data inválida
```

---

## Padrão de mensagem

Uma estrutura simples:

```text
Verbo no imperativo + objeto + contexto
```

Exemplos:

```text
Adiciona validação de status da atividade
Corrige cálculo de total da provisão
Remove dependência não utilizada
Refatora parser de regras de pedido
Cria testes para command de aprovação
```

---

## Conventional Commits

Algumas equipes usam Conventional Commits.

Formato:

```text
tipo: descrição
```

Exemplos:

```text
feat: adiciona endpoint de criação de produto
fix: corrige validação de data retroativa
test: adiciona testes de aprovação de transação
refactor: extrai regra de status para strategy
docs: atualiza README do projeto
chore: ajusta configuração do build
```

Tipos comuns:

```text
feat;
fix;
test;
refactor;
docs;
chore;
build;
ci;
perf.
```

Não é obrigatório em todo projeto, mas é muito usado.

---

# Parte 9 — Branches

Branch permite trabalhar em paralelo sem mexer diretamente na linha principal.

Ver branches:

```bash
git branch
```

Criar e trocar:

```bash
git checkout -b feature/aula-249-git
```

Ou com comando moderno:

```bash
git switch -c feature/aula-249-git
```

Trocar para main:

```bash
git switch main
```

---

## Nome de branch profissional

Bons nomes:

```text
feature/cadastro-produto
feature/aula-249-git-profissional
bugfix/corrige-validacao-email
hotfix/corrige-falha-producao
refactor/extrai-usecase-reagendamento
```

Ruins:

```text
thiago
teste
nova
arrumar
branch2
```

---

## Tipos comuns de branch

```text
feature:
nova funcionalidade.

bugfix:
correção de bug.

hotfix:
correção urgente em produção.

refactor:
refatoração sem mudança funcional.

chore:
ajustes de build/configuração.

release:
preparação de versão.
```

---

# Parte 10 — git log

Ver histórico:

```bash
git log
```

Histórico resumido:

```bash
git log --oneline
```

Histórico com gráfico:

```bash
git log --oneline --graph --decorate --all
```

Esse último é muito útil para entender branches.

---

# Parte 11 — git push

Envia commits locais para o remoto.

Primeiro push de uma branch:

```bash
git push -u origin feature/aula-249-git
```

Depois:

```bash
git push
```

O `-u` configura upstream.

Upstream é a relação entre sua branch local e a branch remota.

---

# Parte 12 — git pull

Traz alterações do remoto e integra na branch atual.

Comando:

```bash
git pull
```

Na prática, `git pull` é equivalente a:

```text
git fetch + integração
```

A integração pode ser merge ou rebase, dependendo da configuração.

---

## Cuidado com pull

Antes de pull:

```bash
git status
```

Se você tem alterações locais não commitadas, pode dar conflito ou bloquear.

Fluxo seguro:

```bash
git status
git add .
git commit -m "Mensagem"
git pull
git push
```

Ou, se não quer commitar ainda:

```bash
git stash
git pull
git stash pop
```

---

# Parte 13 — git fetch

`git fetch` baixa informações do remoto, mas não integra automaticamente.

Comando:

```bash
git fetch
```

Depois você pode ver diferenças.

Exemplo:

```bash
git log --oneline main..origin/main
```

Regra prática:

```text
fetch atualiza visão do remoto sem mexer no seu trabalho.
pull baixa e integra.
```

---

# Parte 14 — Merge

Merge integra uma branch em outra.

Exemplo:

```bash
git switch main
git merge feature/aula-249-git
```

Isso traz as alterações da feature para main.

---

## Tipos de merge

## Fast-forward

Quando a branch principal não teve novos commits, Git apenas avança o ponteiro.

Histórico fica linear.

---

## Merge commit

Quando as duas branches evoluíram, Git cria um commit de merge.

Exemplo:

```text
Merge branch 'feature/aula-249-git'
```

Isso preserva a história das duas linhas.

---

## Quando merge é bom

Merge é útil quando:

```text
quer preservar histórico de branches;
fluxo do time usa merge commits;
PRs são integrados com merge;
quer evitar reescrever histórico.
```

---

# Parte 15 — Rebase

Rebase reaplica seus commits em cima de outra base.

Exemplo:

```bash
git switch feature/aula-249-git
git fetch
git rebase origin/main
```

Isso pega seus commits da feature e reaplica em cima da versão mais nova da main.

---

## Visualmente

Antes:

```text
A---B---C main
     \
      D---E feature
```

Depois do rebase:

```text
A---B---C main
         \
          D'---E' feature
```

Os commits D e E são recriados como D' e E'.

---

## Vantagem do rebase

Histórico mais linear.

Facilita leitura:

```text
main evolui em linha reta.
```

---

## Cuidado com rebase

Rebase reescreve commits.

Regra de ouro:

```text
não faça rebase em branch compartilhada sem alinhamento com o time.
```

Se você já deu push e outras pessoas usam sua branch, rebase pode causar confusão.

---

# Parte 16 — Merge vs Rebase

## Merge

```text
preserva histórico;
não reescreve commits;
pode gerar merge commits;
mais seguro em branch compartilhada.
```

## Rebase

```text
histórico linear;
reescreve commits;
bom para atualizar feature local;
exige cuidado com branch compartilhada.
```

---

## Regra prática

```text
Para atualizar sua feature local com main:
rebase pode ser bom.

Para integrar PR no remoto:
depende do padrão do time.

Em branch compartilhada:
prefira merge ou alinhe antes de rebase.
```

---

# Parte 17 — Conflitos

Conflito acontece quando Git não consegue integrar alterações automaticamente.

Exemplo:

Pessoa A alterou:

```java
return "PAGO";
```

Pessoa B alterou a mesma linha:

```java
return "APROVADO";
```

Git não sabe qual manter.

---

## Como conflito aparece

Arquivo pode ficar assim:

```text
<<<<<<< HEAD
return "PAGO";
=======
return "APROVADO";
>>>>>>> feature/status
```

Você precisa editar manualmente.

---

## Resolver conflito

Passos:

```bash
git status
```

Abra o arquivo.

Escolha a versão correta.

Remova marcadores:

```text
<<<<<<<
=======
>>>>>>>
```

Depois:

```bash
git add arquivo
git commit
```

Se estiver em rebase:

```bash
git add arquivo
git rebase --continue
```

---

## Boas práticas para evitar conflitos

```text
atualize branch com frequência;
faça commits pequenos;
evite mexer em muitos arquivos sem necessidade;
combine mudanças grandes com o time;
não formate projeto inteiro sem alinhamento;
não misture refactor grande com feature.
```

---

# Parte 18 — Pull Request

Pull Request, ou PR, é uma solicitação para integrar uma branch em outra.

Também pode ser chamado de Merge Request em GitLab.

Um PR permite:

```text
revisão de código;
discussão técnica;
rodar pipeline;
executar testes;
validar qualidade;
registrar aprovação;
documentar mudança.
```

---

## PR profissional deve conter

```text
objetivo da mudança;
contexto;
o que foi alterado;
como testar;
prints/evidências quando aplicável;
impactos;
riscos;
link do card/ticket;
observações para reviewer.
```

---

## Exemplo de descrição de PR

```md
## Objetivo

Adicionar validação para impedir reagendamento de atividade concluída.

## Alterações

- Criado validador de status da atividade.
- Adicionado teste para status CONCLUIDA.
- Ajustada mensagem de erro.

## Como testar

1. Rodar `mvn test`.
2. Enviar request de reagendamento com atividade CONCLUIDA.
3. Validar retorno 400.

## Ticket

MS-000

## Riscos

Baixo. Alteração restrita ao fluxo de validação de reagendamento.
```

---

## O que reviewer avalia

```text
código funciona?
regra está correta?
testes cobrem?
nomes estão claros?
arquitetura foi respeitada?
não há duplicação desnecessária?
não há segredo commitado?
não quebrou contrato?
build passou?
```

---

# Parte 19 — Code review

Receber comentário em PR não é ataque pessoal.

É parte do processo profissional.

Postura correta:

```text
ler com calma;
responder tecnicamente;
ajustar quando fizer sentido;
perguntar quando não entender;
defender decisão com argumento;
aceitar melhoria.
```

Postura ruim:

```text
ignorar comentário;
levar para o pessoal;
responder de forma agressiva;
fazer alteração sem entender;
aprovar sem ler.
```

---

# Parte 20 — Stash

Stash guarda alterações temporariamente sem commit.

Exemplo:

```bash
git stash
```

Ver stashes:

```bash
git stash list
```

Recuperar último:

```bash
git stash pop
```

Aplicar sem remover da lista:

```bash
git stash apply
```

Guardar com mensagem:

```bash
git stash push -m "alteracoes parciais aula git"
```

---

## Quando usar stash

Use quando:

```text
precisa trocar de branch rapidamente;
precisa fazer pull sem commitar;
precisa guardar trabalho parcial;
vai testar algo em outra branch.
```

Não use stash como depósito permanente.

---

# Parte 21 — Reset

Reset move o ponteiro da branch e pode alterar staging/working directory.

É poderoso e perigoso.

Tipos principais:

```text
--soft;
--mixed;
--hard.
```

---

## reset --soft

Mantém alterações staged.

```bash
git reset --soft HEAD~1
```

Remove último commit, mas deixa alterações preparadas.

---

## reset --mixed

Padrão.

Mantém alterações no working directory, mas tira da staging.

```bash
git reset HEAD~1
```

---

## reset --hard

Descarta alterações.

```bash
git reset --hard HEAD~1
```

Cuidado extremo.

Pode apagar trabalho local.

---

## Regra de segurança

Antes de reset hard:

```bash
git status
git log --oneline
```

Se tiver dúvida:

```text
não use --hard.
```

---

# Parte 22 — Revert

Revert cria um novo commit que desfaz outro commit.

Exemplo:

```bash
git revert abc123
```

Diferença importante:

```text
reset reescreve histórico.
revert preserva histórico.
```

Em branch compartilhada, revert costuma ser mais seguro.

---

## Quando usar revert

Use quando:

```text
commit já foi para remoto;
branch é compartilhada;
quer desfazer mudança mantendo rastreabilidade;
produção precisa de correção segura.
```

---

# Parte 23 — Cherry-pick

Cherry-pick aplica um commit específico em outra branch.

Exemplo:

```bash
git cherry-pick abc123
```

Cenário:

```text
uma correção foi feita na develop;
precisa levar só essa correção para release.
```

Cuidado:

```text
pode gerar conflito;
pode duplicar lógica;
deve ser usado com intenção clara.
```

---

# Parte 24 — Tags

Tags marcam pontos específicos do histórico.

Muito usadas para versões.

Exemplo:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Tag anotada:

```bash
git tag -a v1.0.0 -m "Versão 1.0.0"
```

Ver tags:

```bash
git tag
```

---

## Tags em backend

Podem representar:

```text
release de produção;
versão de API;
marco de entrega;
versão do artefato;
ponto de rollback.
```

---

# Parte 25 — .gitignore

Arquivo `.gitignore` define o que Git deve ignorar.

Para Java/Maven/Gradle:

```gitignore
target/
build/
.gradle/
out/
*.class
*.log
.idea/
.vscode/
.env
```

---

## Nunca commitar segredo

Não commite:

```text
senhas;
tokens;
chaves privadas;
certificados sensíveis;
.env real;
credenciais de banco;
API keys.
```

Se segredo foi commitado, apenas apagar em novo commit pode não bastar.

Ele continua no histórico.

Nesse caso, precisa rotação do segredo e limpeza de histórico com cuidado.

---

# Parte 26 — Git e Java Backend

Em projeto Java Backend, Git versiona:

```text
código fonte;
pom.xml;
build.gradle;
settings.gradle;
mvnw/gradlew;
README;
scripts;
Dockerfile;
docker-compose.yml;
migrations;
testes;
configurações exemplo.
```

Não versiona:

```text
target;
build;
out;
.class;
logs;
arquivos temporários;
segredos reais.
```

---

# Parte 27 — Fluxos de trabalho

## Git Flow

Branches comuns:

```text
main;
develop;
feature;
release;
hotfix.
```

Fluxo mais estruturado.

Pode ser útil em times com releases formais.

---

## Trunk Based Development

Uso de branch principal com branches curtas.

Características:

```text
branches pequenas;
integração frequente;
feature flags;
pipeline forte;
deploy frequente.
```

Muito usado em times modernos.

---

## GitHub Flow

Fluxo simples:

```text
main;
feature branch;
pull request;
merge;
deploy.
```

---

## Regra prática

Não existe fluxo único perfeito.

O melhor fluxo depende de:

```text
time;
produto;
frequência de deploy;
risco;
maturidade de testes;
pipeline;
necessidade de hotfix;
compliance.
```

Como profissional, você precisa se adaptar ao padrão do projeto.

---

# Parte 28 — Git em CI/CD

Pipeline geralmente é disparado por eventos Git:

```text
push;
pull request;
merge;
tag;
release.
```

Exemplo de fluxo:

```text
dev abre PR
  -> pipeline roda testes
  -> reviewer aprova
  -> merge na main
  -> pipeline gera artefato
  -> deploy em ambiente
```

Git é a entrada da automação.

Por isso commit e branch bem feitos importam.

---

# Parte 29 — Boas práticas profissionais

Use boas práticas:

```text
faça commits pequenos;
escreva mensagens claras;
rode testes antes do push;
não suba código quebrado;
não commite arquivos gerados;
não commite segredo;
abra PR com descrição;
responda review com maturidade;
atualize branch com frequência;
evite conflito desnecessário;
não use force push em branch compartilhada sem alinhamento;
entenda antes de usar reset --hard;
prefira revert em histórico compartilhado;
mantenha .gitignore adequado.
```

---

# Parte 30 — Comandos essenciais por situação

## Começar um repositório

```bash
git init
git status
git add .
git commit -m "Commit inicial"
```

---

## Trabalhar em feature

```bash
git switch main
git pull
git switch -c feature/minha-feature
```

---

## Commitar alteração

```bash
git status
git diff
git add .
git diff --staged
git commit -m "Adiciona validação de status"
```

---

## Enviar branch

```bash
git push -u origin feature/minha-feature
```

---

## Atualizar feature com main

```bash
git fetch
git rebase origin/main
```

ou:

```bash
git fetch
git merge origin/main
```

Depende do padrão do time.

---

## Guardar trabalho temporário

```bash
git stash push -m "trabalho parcial"
git stash list
git stash pop
```

---

## Desfazer commit local mantendo alterações

```bash
git reset --soft HEAD~1
```

---

## Desfazer commit compartilhado com segurança

```bash
git revert <hash>
```

---

# Parte 31 — Laboratório prático

Crie:

```bash
mkdir labs/m11/aula-249-git-profissional
cd labs/m11/aula-249-git-profissional
git init
```

Crie:

```text
README.md
```

Conteúdo:

```md
# Aula 249 — Git Profissional

Laboratório para praticar commits, branches, merge, rebase, conflitos e pull request.
```

Crie `.gitignore`:

```gitignore
target/
build/
.gradle/
out/
*.class
*.log
.idea/
.vscode/
.env
```

Faça commit:

```bash
git status
git add README.md .gitignore
git commit -m "Adiciona estrutura inicial do laboratorio Git"
```

---

# Parte 32 — Laboratório: branch e commit

Crie branch:

```bash
git switch -c feature/adiciona-calculadora
```

Crie:

```text
Calculadora.java
```

Código:

```java
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }
}
```

Commit:

```bash
git status
git diff
git add Calculadora.java
git diff --staged
git commit -m "Adiciona calculadora com soma"
```

---

# Parte 33 — Laboratório: segunda alteração

Edite `Calculadora.java`:

```java
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }

    public int subtrair(int a, int b) {
        return a - b;
    }
}
```

Commit:

```bash
git add Calculadora.java
git commit -m "Adiciona subtracao na calculadora"
```

Veja histórico:

```bash
git log --oneline --graph --decorate --all
```

---

# Parte 34 — Laboratório: merge

Volte para main:

```bash
git switch main
```

Integre feature:

```bash
git merge feature/adiciona-calculadora
```

Veja histórico:

```bash
git log --oneline --graph --decorate --all
```

---

# Parte 35 — Laboratório: conflito controlado

Crie branch:

```bash
git switch -c feature/mensagem-a
```

Crie:

```text
mensagem.txt
```

Conteúdo:

```text
Mensagem da feature A
```

Commit:

```bash
git add mensagem.txt
git commit -m "Adiciona mensagem da feature A"
```

Volte para main:

```bash
git switch main
```

Crie outra branch:

```bash
git switch -c feature/mensagem-b
```

Crie `mensagem.txt` com conteúdo diferente:

```text
Mensagem da feature B
```

Commit:

```bash
git add mensagem.txt
git commit -m "Adiciona mensagem da feature B"
```

Volte para main e faça merge da A:

```bash
git switch main
git merge feature/mensagem-a
```

Agora tente merge da B:

```bash
git merge feature/mensagem-b
```

Deve gerar conflito.

Resolva editando `mensagem.txt`:

```text
Mensagem final combinando feature A e feature B
```

Depois:

```bash
git add mensagem.txt
git commit
```

---

# Parte 36 — Laboratório: stash

Crie uma alteração sem commit:

```text
rascunho.txt
```

Conteúdo:

```text
Trabalho em andamento
```

Veja status:

```bash
git status
```

Guarde:

```bash
git stash push -m "rascunho de teste"
```

Veja:

```bash
git stash list
git status
```

Recupere:

```bash
git stash pop
```

---

# Parte 37 — Laboratório: revert

Crie commit:

```bash
echo "linha temporaria" > temporario.txt
git add temporario.txt
git commit -m "Adiciona arquivo temporario"
```

Veja hash:

```bash
git log --oneline
```

Reverta:

```bash
git revert <hash>
```

Isso cria novo commit desfazendo o arquivo temporário.

---

# Parte 38 — Laboratório: tag

Crie uma tag:

```bash
git tag -a v0.1.0 -m "Versao inicial do laboratorio Git"
```

Liste:

```bash
git tag
```

Veja detalhes:

```bash
git show v0.1.0
```

---

# Parte 39 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Git.
[ ] Sei diferenciar Git e GitHub.
[ ] Sei explicar working directory.
[ ] Sei explicar staging area.
[ ] Sei explicar commit.
[ ] Sei explicar branch.
[ ] Sei usar git status.
[ ] Sei usar git diff.
[ ] Sei usar git add.
[ ] Sei criar commit profissional.
[ ] Sei criar branch.
[ ] Sei fazer merge.
[ ] Sei explicar rebase.
[ ] Sei resolver conflito.
[ ] Sei usar stash.
[ ] Sei explicar reset.
[ ] Sei explicar revert.
[ ] Sei explicar cherry-pick.
[ ] Sei criar tag.
[ ] Sei explicar pull request.
[ ] Sei explicar Git em CI/CD.
[ ] Sei evitar commitar arquivos gerados e segredos.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Git?
2. Qual diferença entre Git e GitHub?
3. O que é working directory?
4. O que é staging area?
5. O que é commit?
6. O que é branch?
7. Para que serve git status?
8. Para que serve git diff?
9. O que é merge?
10. O que é rebase?
11. Quando rebase pode ser perigoso?
12. O que é conflito?
13. Como resolver conflito?
14. O que é pull request?
15. O que é stash?
16. Qual diferença entre reset e revert?
17. Para que serve cherry-pick?
18. Para que serve tag?
19. O que não deve ser commitado?
20. Como Git aparece em CI/CD?
```

---

# Parte 40 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-249-git-profissional
```

E praticar:

```text
git init;
.gitignore;
commit inicial;
branch feature;
commits pequenos;
merge;
conflito;
stash;
revert;
tag.
```

---

## Requisitos

Você deve registrar os comandos usados em:

```text
DIARIO_GIT.md
```

Com:

```text
comando executado;
o que aconteceu;
erro encontrado;
como resolveu;
aprendizado.
```

---

## Critérios

```text
histórico deve ter commits claros;
deve existir pelo menos uma branch feature;
deve existir conflito resolvido;
deve existir uso de stash;
deve existir uso de revert;
deve existir uma tag;
.gitignore deve estar correto;
não commitar arquivos gerados;
não commitar segredo.
```

---

# Parte 41 — Desafio extra

## Simular fluxo de PR local

Mesmo sem GitHub, simule um fluxo:

```text
main;
feature/nova-regra;
commits;
atualizar com main;
merge final.
```

Crie um arquivo:

```text
PULL_REQUEST_SIMULADO.md
```

Com:

```md
## Objetivo

## Alterações

## Como testar

## Riscos

## Checklist

- [ ] Build passou
- [ ] Testes passaram
- [ ] Não há segredo
- [ ] Não há arquivo gerado
- [ ] Código revisado
```

Esse hábito prepara trabalho real em plataforma de Git.

---

# Parte 42 — Simulado rápido

## Questão 1

Git é principalmente:

```text
A) sistema de controle de versão.
B) banco de dados.
C) servidor HTTP.
D) framework Java.
```

---

## Questão 2

Staging area é:

```text
A) área onde preparo alterações para commit.
B) ambiente de produção.
C) pasta target.
D) banco local.
```

---

## Questão 3

Commit é:

```text
A) registro de alteração no histórico.
B) arquivo compilado.
C) dependência Maven.
D) imagem Docker.
```

---

## Questão 4

Branch é:

```text
A) linha de desenvolvimento.
B) arquivo .class.
C) plugin Gradle.
D) variável de ambiente.
```

---

## Questão 5

Pull Request serve para:

```text
A) solicitar integração e revisão de uma branch.
B) compilar bytecode.
C) criar JVM.
D) apagar histórico.
```

---

## Questão 6

Rebase:

```text
A) reaplica commits sobre outra base e reescreve histórico.
B) sempre cria banco.
C) é igual a git status.
D) remove o Git do projeto.
```

---

## Questão 7

Revert:

```text
A) cria um novo commit desfazendo outro.
B) apaga sempre o histórico remoto.
C) compila Java.
D) instala Maven.
```

---

## Questão 8

Não devemos commitar:

```text
A) senhas, tokens e arquivos gerados.
B) código fonte.
C) README.
D) testes.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
7. A
8. A
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-249-git-profissional
git commit -m "Aula 249: git profissional commits branches merge rebase pr"
git status
```

Se o laboratório for ele próprio um repositório Git separado, não misture `.git` interno com o repositório principal do curso sem entender.

Nesse caso, você pode manter o diário e os arquivos de exemplo no repositório principal, mas evitar versionar a pasta `.git` interna.

---

## Fechamento

A principal ideia desta aula é:

```text
Git é uma ferramenta essencial para rastreabilidade, colaboração e segurança no desenvolvimento profissional.
```

Você estudou:

```text
Git;
GitHub;
repositório;
working directory;
staging area;
commit;
branch;
remote;
status;
diff;
add;
push;
pull;
fetch;
merge;
rebase;
conflitos;
pull request;
code review;
stash;
reset;
revert;
cherry-pick;
tags;
.gitignore;
segredos;
fluxos de trabalho;
CI/CD;
boas práticas.
```

Na próxima aula, vamos aprofundar:

```text
IDE profissional, terminal, debugging e produtividade no Java Backend.
```

A ideia será entender como usar IntelliJ/IDE, terminal, atalhos, execução, debug, breakpoints, variáveis, stack trace, logs locais e rotina profissional de investigação.
