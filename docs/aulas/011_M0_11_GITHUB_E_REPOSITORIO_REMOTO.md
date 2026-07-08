# 011 — M0.11 — GitHub e Repositório Remoto

## GitHub validado

- [ ] Conta GitHub acessível.
- [ ] Repositório remoto criado.
- [ ] Repositório remoto criado vazio quando o projeto nasceu localmente.
- [ ] `origin` configurado.
- [ ] `git remote -v` mostra URL correta.
- [ ] `git push -u origin main` funciona.
- [ ] Arquivos aparecem no GitHub.
- [ ] Nenhum token/senha/segredo foi versionado.
```

---

## Hoje a aula é sobre sair do Git local para o Git remoto

Git local responde:

```text
o que mudou na minha máquina?
qual é meu histórico local?
quais commits eu tenho aqui?
```

Git remoto adiciona perguntas novas:

```text
meus commits estão publicados?
o repositório remoto está atualizado?
minha máquina está atrasada em relação ao remoto?
alguém alterou algo antes de mim?
qual URL representa o remoto?
qual branch está conectada?
tenho permissão para enviar alterações?
```

Esse é o começo da colaboração profissional.

Mesmo estudando sozinho, usar remoto tem valor.

Ele ajuda em:

```text
backup;
portfólio;
continuidade entre máquinas;
rastreabilidade externa;
organização pública ou privada;
preparação para fluxo de time.
```

Mas GitHub não deve ser usado como “pasta de backup manual”.

Ele deve receber commits organizados.

O Git local continua sendo a base.

---

## Git e GitHub não são a mesma coisa

Vamos fixar isso.

```text
Git é a ferramenta de controle de versão.
GitHub é uma plataforma que hospeda repositórios Git.
```

Você pode usar Git sem GitHub.

Você pode usar Git com GitLab.

Você pode usar Git com Bitbucket.

Você pode usar Git com Azure DevOps.

Você pode usar Git em servidor interno de uma empresa.

GitHub é uma das plataformas.

Importante:

```text
git commit é local.
git push envia para remoto.
git pull traz do remoto.
git clone copia um remoto para sua máquina.
```

Esse vocabulário precisa ficar claro.

---

## O que é um repositório remoto

Um repositório remoto é identificado por uma URL.

Exemplos conceituais:

```text
https://github.com/usuario/repositorio.git
git@github.com:usuario/repositorio.git
```

A URL diz onde o repositório está.

O Git associa essa URL a um nome local.

Normalmente, o nome usado é:

```text
origin
```

Então, quando você vê:

```bash
git remote add origin https://github.com/usuario/repositorio.git
```

está dizendo:

```text
Git, chame esse endereço remoto de origin.
```

O nome `origin` não é obrigatório, mas é o padrão mais comum.

Em projetos profissionais, quase sempre você verá `origin`.

---

## O que é `origin`

`origin` é apenas um apelido local para a URL remota.

Não significa “GitHub”.

Não significa “produção”.

Não significa “principal” por definição absoluta.

É só o nome mais comum para o remoto principal.

Exemplo:

```bash
git remote -v
```

Saída possível:

```text
origin  https://github.com/usuario/repositorio.git (fetch)
origin  https://github.com/usuario/repositorio.git (push)
```

Isso significa:

```text
para buscar dados, use essa URL;
para enviar dados, use essa URL.
```

O mesmo remoto pode ter URL de fetch e push.

Na maioria dos casos iniciais, elas serão iguais.

---

## O que é `push`

`push` envia commits locais para o repositório remoto.

Exemplo:

```bash
git push origin main
```

Interpretação:

```text
envie minha branch local main para o remoto chamado origin.
```

A estrutura é:

```bash
git push <remoto> <branch>
```

Exemplo:

```bash
git push origin main
```

O commit já precisa existir localmente.

`git push` não cria commit.

Ele publica commits.

Fluxo correto:

```text
editar arquivo
git status
git add
git commit
git push
```

Não pule commit.

Sem commit, não há o que enviar.

---

## O que é `pull`

`pull` traz alterações do remoto para a sua máquina e tenta integrá-las à sua branch local.

Exemplo:

```bash
git pull origin main
```

Interpretação:

```text
busque a branch main do remoto origin e integre ao meu trabalho local.
```

Em projetos com mais pessoas, `pull` é comum antes de começar ou antes de enviar mudanças.

Mas `pull` pode gerar conflito se você e outra pessoa alteraram a mesma parte.

Conflitos serão estudados depois.

Por enquanto, entenda:

```text
push envia.
pull traz e integra.
```

---

## O que é `clone`

`clone` cria uma cópia local de um repositório remoto.

Exemplo:

```bash
git clone https://github.com/usuario/repositorio.git
```

Isso cria uma pasta local com o projeto e já configura o remoto `origin`.

Quando você clona, normalmente não precisa rodar `git init`.

O clone já vem como repositório Git.

Fluxo:

```text
repo remoto existe
↓
git clone URL
↓
pasta local criada
↓
origin configurado automaticamente
```

Use `clone` quando o projeto já existe no remoto e você quer trazê-lo para sua máquina.

Use `git init` + `remote add` quando o projeto nasceu localmente e você quer publicar no remoto.

---

## Dois cenários diferentes

Existem dois cenários principais.

### Cenário A — O projeto nasceu localmente

Você já tem:

```text
C:\dev\projects\formacao-java-backend
```

Com commits locais.

Agora quer criar um repositório vazio no GitHub e conectar.

Fluxo:

```bash
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

Esse é o cenário mais comum para publicar um projeto local já iniciado.

### Cenário B — O projeto já existe no GitHub

Você quer trazer para sua máquina.

Fluxo:

```bash
git clone URL_DO_REPOSITORIO
```

Nesse caso, não use `git init` dentro da pasta clonada.

O clone já resolve.

---

## Repositório público ou privado

Ao criar um repositório no GitHub, geralmente há a escolha entre:

```text
público;
privado.
```

### Público

Qualquer pessoa pode visualizar.

Bom para:

```text
portfólio;
projetos open source;
estudos que não contêm dados sensíveis;
demonstração técnica.
```

### Privado

Somente pessoas autorizadas visualizam.

Bom para:

```text
estudo pessoal não compartilhado;
projetos com dados sensíveis;
trabalho corporativo;
código que não deve ser exposto.
```

Cuidado:

```text
não coloque senha, token, dados reais de cliente ou informação corporativa em repositório público.
```

Mesmo em repositório privado, segredo não deve ser versionado.

Privado reduz exposição.

Não transforma segredo em boa prática.

---

## Repositório remoto vazio ou com README

Ao criar um repositório no GitHub, a plataforma pode oferecer opções como:

```text
adicionar README;
adicionar .gitignore;
adicionar licença.
```

Se você já tem um repositório local com commits e quer publicar nele, o caminho mais simples é criar o repositório remoto vazio.

Ou seja:

```text
sem README;
sem .gitignore;
sem licença inicial.
```

Por quê?

Porque se o GitHub cria um commit inicial no remoto e você já tem commits locais, passam a existir dois históricos diferentes.

Isso pode gerar a necessidade de pull, merge ou ajuste.

Não é impossível resolver.

Mas para o começo, cria confusão desnecessária.

Regra simples para projeto que nasceu localmente:

```text
crie o repositório remoto vazio
e envie seus commits locais.
```

Mais tarde, veremos como lidar com históricos divergentes.

---

## HTTPS e SSH

Existem duas formas comuns de conectar ao GitHub:

```text
HTTPS
SSH
```

### HTTPS

Exemplo:

```text
https://github.com/usuario/repositorio.git
```

Pode usar autenticação por navegador, gerenciador de credenciais ou token, dependendo da configuração.

É comum para iniciantes porque a URL é simples e fácil de copiar.

### SSH

Exemplo:

```text
git@github.com:usuario/repositorio.git
```

Usa chave SSH configurada na máquina e na conta.

É muito usado por desenvolvedores experientes e ambientes profissionais.

Nesta aula, o foco conceitual é o remoto.

A escolha entre HTTPS e SSH pode ser ajustada depois.

O importante é:

```text
a URL remota precisa ser válida;
você precisa ter permissão;
a autenticação precisa estar correta.
```

---

## Autenticação e token

Quando você envia commits para o GitHub, precisa provar que tem permissão.

Isso pode acontecer por:

```text
Git Credential Manager;
login via navegador;
personal access token;
chave SSH;
GitHub CLI;
configuração corporativa.
```

Um ponto importante:

```text
não coloque token em arquivo;
não cole token em README;
não commite credenciais;
não compartilhe segredo em print público.
```

Token é como senha de acesso.

Se vazar, pode comprometer repositórios.

Nesta aula, não vamos transformar autenticação em foco principal.

Mas a postura correta já precisa nascer agora:

```text
credencial não vai para Git.
```

---

## Criando o remoto no GitHub

A interface do GitHub pode mudar com o tempo, então o mais importante é entender a intenção.

Você precisa criar um repositório com:

```text
nome;
visibilidade;
descrição opcional;
sem arquivos iniciais se o projeto já nasceu localmente.
```

Exemplo de nome:

```text
formacao-java-backend
```

Evite nomes confusos:

```text
teste
curso
java
projeto-final-agora-vai
```

Prefira nomes claros:

```text
formacao-java-backend
java-backend-labs
api-pedidos
sistema-ordem-servico
```

Nome de repositório também comunica maturidade.

---

## Nome do repositório

Um bom nome deve ser:

```text
curto;
claro;
sem espaço;
sem acento;
em minúsculas;
com hífen quando necessário.
```

Exemplos:

```text
formacao-java-backend
labs-java-core
api-pedidos
controle-ordem-servico
```

Evite:

```text
Meu Curso Java !!!
Projeto Final
Backend Versão Nova
teste123
```

O repositório pode virar portfólio.

O nome faz parte da primeira impressão.

---

## Conectando um repositório local ao remoto

Dentro da pasta do projeto local:

```powershell
cd C:\dev\projects\formacao-java-backend
```

Confira:

```bash
git status
git log --oneline
```

Se existem commits locais, adicione o remoto:

```bash
git remote add origin URL_DO_REPOSITORIO
```

Exemplo:

```bash
git remote add origin https://github.com/usuario/formacao-java-backend.git
```

Valide:

```bash
git remote -v
```

Depois envie:

```bash
git push -u origin main
```

O `-u` configura o upstream.

Isso permite que, depois, você use:

```bash
git push
git pull
```

sem informar remoto e branch toda vez, desde que esteja na branch configurada.

---

## O que é upstream

Upstream é a relação entre sua branch local e a branch remota que ela acompanha.

Quando você roda:

```bash
git push -u origin main
```

você está dizendo:

```text
minha branch local main acompanha origin/main.
```

Depois disso, o Git sabe para onde enviar e de onde puxar por padrão.

Então, em vez de sempre digitar:

```bash
git push origin main
```

pode usar:

```bash
git push
```

E em vez de:

```bash
git pull origin main
```

pode usar:

```bash
git pull
```

No início, é bom entender o comando completo.

Depois o atalho fica natural.

---

## `git remote -v`

Sempre valide o remoto:

```bash
git remote -v
```

Saída esperada:

```text
origin  https://github.com/usuario/repositorio.git (fetch)
origin  https://github.com/usuario/repositorio.git (push)
```

Esse comando responde:

```text
qual remoto está configurado?
qual URL ele usa?
o nome é origin?
```

Antes de dar push para lugar errado, rode:

```bash
git remote -v
```

Isso é cuidado profissional.

---

## Alterando URL remota

Se configurou o remoto errado, não precisa apagar o projeto.

Use:

```bash
git remote set-url origin NOVA_URL
```

Exemplo:

```bash
git remote set-url origin https://github.com/usuario/repositorio-correto.git
```

Valide:

```bash
git remote -v
```

Isso troca o endereço associado ao `origin`.

---

## Removendo remoto

Se precisar remover:

```bash
git remote remove origin
```

Depois valide:

```bash
git remote -v
```

Se não aparecer nada, o remoto foi removido.

Use isso com cuidado.

Normalmente, trocar URL com `set-url` é suficiente.

---

## Clonando um repositório

Se o repositório já existe no GitHub, use:

```bash
cd C:\dev\projects
git clone https://github.com/usuario/repositorio.git
```

Isso cria:

```text
C:\dev\projects\repositorio
```

Entre:

```powershell
cd repositorio
```

Confira:

```bash
git status
git remote -v
git log --oneline
```

O clone já vem com `origin`.

Não rode `git init` depois de clonar.

---

## `fetch` e `pull`

Existe também:

```bash
git fetch
```

`fetch` busca informações do remoto, mas não integra automaticamente ao seu trabalho local.

`pull` busca e integra.

Pense assim:

```text
fetch = olhar o que tem no remoto
pull = trazer e integrar
```

No começo, usaremos mais `pull`.

Mas, profissionalmente, `fetch` ajuda a inspecionar antes de integrar.

Esse assunto será aprofundado em Git profissional.

Agora o importante é saber que `pull` não é a única forma de buscar do remoto.

---

## Primeiro push completo: exemplo mínimo

Cenário:

```text
você já tem repositório local com commits
e criou um repositório vazio no GitHub.
```

Dentro do projeto:

```powershell
cd C:\dev\projects\formacao-java-backend
```

Valide:

```bash
git status
git log --oneline
```

Adicione remoto:

```bash
git remote add origin https://github.com/usuario/formacao-java-backend.git
```

Valide:

```bash
git remote -v
```

Envie:

```bash
git push -u origin main
```

Depois entre no GitHub e veja se os arquivos aparecem.

Se aparecerem:

```text
README.md
.gitignore
docs/
src/
```

o fluxo funcionou.

---

## Primeiro clone completo: exemplo mínimo

Cenário:

```text
o repositório já existe no GitHub
e você quer baixar para a máquina.
```

No PowerShell:

```powershell
cd C:\dev\projects
git clone https://github.com/usuario/formacao-java-backend.git
cd formacao-java-backend
```

Valide:

```bash
git status
git remote -v
git log --oneline
```

Resultado esperado:

```text
pasta criada;
repositório inicializado;
origin configurado;
histórico baixado.
```

---

## Fluxo diário simples

Depois que o remoto está configurado, o fluxo diário pode ser:

```bash
git status
git pull
```

Trabalhar:

```text
editar arquivos
criar código
atualizar docs
rodar testes
```

Revisar:

```bash
git status
git diff
```

Preparar:

```bash
git add .
git status
git diff --staged
```

Commitar:

```bash
git commit -m "Mensagem clara"
```

Enviar:

```bash
git push
```

Esse fluxo é simples, mas poderoso.

Com o tempo, entram branch, pull request, review e CI/CD.

Mas a base é essa.

---

## GitHub como portfólio

GitHub pode funcionar como portfólio técnico.

Mas portfólio não é só ter código.

É mostrar cuidado.

Um repositório de portfólio deve ter:

```text
nome claro;
README útil;
estrutura organizada;
commits coerentes;
código legível;
.gitignore correto;
sem arquivos gerados desnecessários;
sem credenciais;
instruções de execução;
descrição do objetivo;
evolução visível.
```

Um repositório bagunçado pode prejudicar a impressão.

Um repositório bem cuidado mostra maturidade.

Nesta formação, cada repositório deve ensinar algo sobre como você trabalha.

---

## GitHub em contexto corporativo

Em empresas, GitHub ou plataformas equivalentes costumam ser usadas com:

```text
organizações;
times;
permissões;
branches protegidas;
pull requests;
code review;
issues;
projects;
actions/pipelines;
releases;
tags;
security scanning;
dependabot;
políticas de aprovação.
```

Nesta aula, ainda não vamos entrar nisso tudo.

Mas é importante entender que o remoto é o começo de um ecossistema maior.

Em time, você não costuma fazer push direto na branch principal sem regra.

Você cria branch.

Abre pull request.

Passa por review.

Pipeline roda.

Depois mergeia.

Essa maturidade será construída aos poucos.

---

## GitHub não é lugar de segredo

Esse ponto merece repetição.

Não versionar:

```text
senhas;
tokens;
chaves privadas;
arquivos .env reais;
credenciais de banco;
dados de cliente;
dados corporativos;
certificados sensíveis;
prints com informação sigilosa;
logs com dados pessoais.
```

Mesmo em repositório privado, a prática correta é não commitar segredo.

Segredo deve ser tratado por:

```text
variáveis de ambiente;
secret manager;
GitHub Secrets;
configuração local ignorada;
cofre corporativo;
política de segurança.
```

Isso será aprofundado depois.

Mas a regra começa agora:

```text
segredo não entra no Git.
```

---

## GitHub e README

O README é a página inicial do repositório.

No GitHub, ele aparece automaticamente na página principal do projeto.

Por isso, o README precisa explicar:

```text
o que é o projeto;
qual objetivo;
como rodar;
quais tecnologias usa;
qual estrutura;
qual status;
como contribuir, quando aplicável.
```

Nesta formação, o README será estudado com mais profundidade no módulo de Markdown.

Por enquanto, entenda:

```text
README é apresentação técnica.
```

Um repositório sem README parece abandonado.

Um README ruim gera dúvida.

Um README bom reduz atrito.

---

## Erros comuns

### Erro 1 — Criar repositório remoto com README quando já existe histórico local

Isso pode gerar históricos diferentes.

Correção inicial:

```text
para projeto local existente, crie remoto vazio.
```

Se já criou com README, será preciso integrar os históricos com cuidado.

---

### Erro 2 — Rodar `git init` depois de `git clone`

Não precisa.

`git clone` já cria um repositório local.

Correção:

```text
clone já vem com .git e origin.
```

---

### Erro 3 — Confundir commit com push

```text
commit salva localmente.
push envia para remoto.
```

Se você commitou, mas não deu push, o GitHub não verá a mudança.

---

### Erro 4 — Tentar dar push sem commit

Se não há commit novo, não há o que enviar.

Fluxo:

```bash
git add
git commit
git push
```

---

### Erro 5 — Não configurar remoto

Erro possível:

```text
No configured push destination
```

Correção:

```bash
git remote add origin URL
git push -u origin main
```

---

### Erro 6 — `remote origin already exists`

Significa que já existe um remoto chamado `origin`.

Diagnóstico:

```bash
git remote -v
```

Se a URL estiver errada:

```bash
git remote set-url origin URL_CORRETA
```

---

### Erro 7 — Push rejeitado

Mensagem comum:

```text
rejected
non-fast-forward
```

Pode significar que o remoto tem commits que você não tem localmente.

Diagnóstico:

```bash
git status
git remote -v
git pull
```

Mas cuidado: se houver histórico divergente, precisa entender antes de forçar qualquer coisa.

Não use `--force` sem saber exatamente por quê.

---

### Erro 8 — Autenticação falhando

Pode envolver:

```text
credencial errada;
token expirado;
permissão insuficiente;
conta errada;
repositório privado;
URL errada;
SSH não configurado.
```

Diagnóstico:

```bash
git remote -v
```

E confirme se você tem acesso ao repositório.

---

### Erro 9 — Usar URL de outro repositório

Pode acontecer copiando URL errada.

Antes de push:

```bash
git remote -v
```

Confirme o destino.

---

### Erro 10 — Subir segredo para repositório público

Esse é grave.

Correção não é só apagar o arquivo em um commit novo.

Segredo exposto deve ser considerado comprometido.

A ação correta geralmente inclui:

```text
revogar token;
trocar senha;
remover do histórico quando necessário;
investigar exposição;
corrigir .gitignore;
usar gestão adequada de secrets.
```

Prevenção é melhor do que correção.

---

## Exemplo aplicado ao projeto da formação

Uma estrutura inicial poderia ser:

```text
formacao-java-backend
├── docs
│   ├── diagnostico-inicial.md
│   ├── diario-de-bordo.md
│   └── atalhos.md
├── src
│   └── Main.java
├── .gitignore
└── README.md
```

Fluxo local:

```bash
git status
git add .
git commit -m "Adiciona estrutura inicial da formacao Java Backend"
```

Depois, no GitHub, criar repositório vazio:

```text
formacao-java-backend
```

Conectar:

```bash
git remote add origin https://github.com/usuario/formacao-java-backend.git
git push -u origin main
```

Depois de cada aula prática relevante:

```bash
git status
git add docs/diario-de-bordo.md
git commit -m "Registra aprendizado sobre GitHub e repositorio remoto"
git push
```

Esse fluxo cria histórico e backup remoto.

---

## Exemplo aplicado ao domínio corporativo

Imagine uma equipe trabalhando em uma API.

O fluxo profissional pode ser:

```text
clonar repositório;
criar branch;
implementar alteração;
commitar;
enviar branch;
abrir pull request;
passar por review;
rodar pipeline;
fazer merge;
atualizar ambiente.
```

Nesta aula, estamos aprendendo uma parte inicial:

```text
clonar;
configurar remoto;
push;
pull;
verificar origin.
```

Sem isso, o fluxo corporativo não se sustenta.

Todo backend profissional precisa saber lidar com remoto.

Mesmo que a empresa tenha ferramenta visual, o fundamento é Git.

---

## Comandos principais desta aula

```bash
git remote -v
git remote add origin URL
git remote set-url origin URL
git remote remove origin
git push origin main
git push -u origin main
git push
git pull origin main
git pull
git clone URL
git fetch
git branch
```

Não precisa decorar tudo de uma vez.

Mas precisa entender o papel:

```text
remote gerencia endereços remotos;
push envia commits;
pull traz commits;
clone baixa repositório;
fetch consulta remoto sem integrar automaticamente.
```

---

## Atividade guiada

Faça esta prática quando tiver uma conta e um repositório criado no GitHub.

### Cenário: projeto local já existe

Dentro do projeto:

```powershell
cd C:\dev\projects\formacao-java-backend
```

Valide:

```bash
git status
git log --oneline
```

Crie o repositório vazio no GitHub.

Depois:

```bash
git remote add origin https://github.com/usuario/formacao-java-backend.git
git remote -v
git push -u origin main
```

Depois faça uma alteração pequena no README:

```markdown
## Repositório remoto

Este projeto está conectado a um repositório remoto para registrar a evolução da formação.
```

Comandos:

```bash
git status
git diff
git add README.md
git commit -m "Documenta conexao com repositorio remoto"
git push
```

Confira no GitHub se a alteração apareceu.

---

## Prática alternativa: clonar um repositório

Em uma pasta de projetos:

```powershell
cd C:\dev\projects
```

Clone:

```bash
git clone https://github.com/usuario/formacao-java-backend.git
```

Entre:

```powershell
cd formacao-java-backend
```

Valide:

```bash
git status
git remote -v
git log --oneline
```

Essa prática ensina a trazer um projeto remoto para a máquina.

---

## O que aprendi
Aprendi que Git é local e GitHub é uma plataforma remota para hospedar repositórios Git.

## Conceitos principais
Git:
GitHub:
Repositório remoto:
origin:
push:
pull:
clone:
fetch:
upstream:

## Comandos praticados
- git remote -v
- git remote add origin
- git push -u origin main
- git push
- git pull
- git clone

## URL remota configurada
Não registrar token ou credencial aqui.
Registrar apenas se for uma URL segura de repositório.

## Cuidados de segurança
- não commitar senha;
- não commitar token;
- não commitar dados reais de cliente;
- conferir git status antes de push;
- conferir git remote -v antes de enviar.

## Erros que quero evitar
- confundir commit com push;
- criar remoto com README quando já existe histórico local;
- usar origin apontando para URL errada;
- usar --force sem entender;
- expor segredo no repositório.

## Frase principal
Commit salva localmente. Push publica no remoto.
```

---

## Critério de conclusão

Esta aula está concluída quando a pessoa consegue:

```text
explicar diferença entre Git e GitHub;
explicar o que é repositório remoto;
explicar o que é origin;
explicar o que é URL remota;
diferenciar HTTPS e SSH em nível conceitual;
explicar que commit é local;
explicar que push envia para remoto;
explicar que pull traz do remoto;
explicar que clone cria cópia local de um remoto;
usar git remote -v;
usar git remote add origin;
usar git remote set-url origin;
usar git push -u origin main;
usar git push;
usar git pull;
usar git clone;
entender upstream;
entender por que criar remoto vazio quando já há histórico local;
entender risco de segredos em repositório;
relacionar GitHub com portfólio e colaboração profissional.
```

Não precisa dominar pull request ainda.

Não precisa dominar conflito ainda.

Não precisa dominar GitHub Actions ainda.

Esses assuntos virão depois.

Agora o objetivo é conectar local e remoto com segurança e clareza.

---

## Fechamento da aula

Git local dá histórico.

GitHub dá alcance.

Juntos, eles permitem que o projeto deixe de existir apenas na sua máquina.

Mas isso aumenta a responsabilidade.

Antes de enviar qualquer coisa para remoto, pense:

```text
o commit está claro?
o status está limpo?
o remoto está correto?
há segredo nos arquivos?
a mensagem comunica bem?
o README ajuda?
```

Essa postura é profissional.

Na próxima aula, vamos entrar em Markdown para documentação técnica.

Isso é essencial porque código sem documentação mínima vira atrito.

A formação vai usar Markdown para:

```text
README;
diário de bordo;
checklists;
decisões técnicas;
anotações;
documentação de projeto;
documentação de API;
documentação de arquitetura.
```

Git registra a história.

Markdown ajuda a explicar essa história.
