# 009 — M0.09 — Git: Instalação e Configuração Global

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.09.01` — Git instalação e configuração global — Conceito, por que existe e vocabulário essencial.
- `M0.09.02` — Git instalação e configuração global — Exemplo mínimo digitado do zero.
- `M0.09.03` — Git instalação e configuração global — Exemplo aplicado ao domínio corporativo.
- `M0.09.04` — Git instalação e configuração global — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar Git como base de rastreabilidade profissional, não apenas como ferramenta para “salvar código”.

---

## Complemento operacional — baixar, instalar e validar Git


> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.


Esta aula é o ponto oficial para instalar Git no Windows e configurar a identidade global.

### Fonte de download

Baixe o Git para Windows pelo site oficial do Git.

Use a versão para Windows 64-bit quando estiver em máquina moderna 64-bit.

### Instalação no Windows

Durante o instalador, para esta formação, o aluno pode manter o padrão na maior parte das telas.

Pontos de atenção:

```text
Git precisa ficar disponível no PATH;
Git Bash pode ser instalado, mas o curso usa PowerShell como base;
o editor padrão pode ser simples, como Notepad, no início;
não é necessário alterar opções avançadas sem entender.
```

### Validação após instalar

Feche e abra um PowerShell novo:

```powershell
git --version
where git
```

Resultado esperado:

```text
git version ...
```

### Configuração global mínima

```powershell
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.editor "notepad"
```

Depois confira:

```powershell
git config --global --list
```

### Teste local de instalação

```powershell
cd C:\dev\labs
mkdir validacao-git
cd validacao-git
git init
New-Item README.md
git status
git add README.md
git commit -m "Valida instalacao do Git"
git log --oneline
```

Se o commit funcionar, Git está instalado e configurado corretamente.

### Critério operacional atualizado

```markdown
## Git validado

- [ ] Git instalado.
- [ ] `git --version` funciona.
- [ ] `where git` aponta para local esperado.
- [ ] `user.name` configurado.
- [ ] `user.email` configurado.
- [ ] `init.defaultBranch` configurado como `main`.
- [ ] `core.autocrlf` configurado conscientemente.
- [ ] Commit local de validação funciona.
```

---

## Onde estamos na formação

Até aqui, já organizamos o terreno:

```text
mapa da formação;
diagnóstico inicial;
organização do Windows;
terminal e PowerShell;
JDK, JRE e JVM;
compilação manual com javac;
IntelliJ IDEA Community;
debug inicial.
```

Agora entra uma ferramenta que vai acompanhar toda a formação:

```text
Git
```

Git não é um detalhe.

Git é a memória técnica do projeto.

Sem Git, o código vira arquivo solto.

Com Git bem usado, o projeto passa a ter histórico, rastreabilidade, segurança de mudança e possibilidade de colaboração.

Nesta aula, o foco ainda não é branch, merge, rebase, pull request ou conflito.

Esses assuntos virão depois.

Agora o foco é preparar o Git corretamente na máquina.

Antes de versionar código, precisamos garantir que o Git está instalado, acessível no terminal e configurado com identidade, comportamento de linha e branch padrão.

---

## Hoje a aula é sobre preparar o Git para trabalhar direito

Um erro comum é tratar Git como algo que só aparece na hora de “subir para o GitHub”.

Isso é pouco.

Git começa localmente.

Antes de existir GitHub, Git já funciona na sua máquina.

Você pode criar um repositório local, versionar arquivos, criar commits, ver histórico, comparar alterações e voltar mudanças sem depender de internet.

GitHub, GitLab, Bitbucket e Azure DevOps são plataformas remotas.

Git é a ferramenta de versionamento.

Essa distinção é importante:

```text
Git = ferramenta de controle de versão
GitHub = plataforma para hospedar repositórios Git
```

Nesta aula, vamos preparar o Git.

Depois vamos usar Git local.

Depois vamos conectar com repositório remoto.

---

## O problema que o Git resolve

Sem Git, o histórico de um projeto costuma virar isso:

```text
projeto
projeto-final
projeto-final-agora-vai
projeto-final-corrigido
projeto-final-corrigido-2
projeto-backup
projeto-backup-certo
```

Isso é sinal de medo de perder mudança.

O Git resolve esse problema de forma profissional.

Com Git, você registra versões do projeto por commits.

Cada commit representa um ponto do histórico.

Exemplo:

```text
commit 1 — estrutura inicial do projeto
commit 2 — adiciona primeiro programa Java
commit 3 — adiciona diário de bordo
commit 4 — corrige validação de entrada
```

O projeto não precisa ser copiado manualmente.

O Git guarda a evolução.

---

## Git como rastreabilidade

Rastreabilidade é a capacidade de responder:

```text
o que mudou?
quando mudou?
quem mudou?
por que mudou?
quais arquivos foram afetados?
qual era o estado antes?
qual é o estado agora?
```

Em formação, isso ajuda a ver evolução.

Em empresa, isso é essencial.

Quando um bug aparece, o time pode investigar:

```text
qual commit introduziu a mudança?
qual regra foi alterada?
qual arquivo foi tocado?
quem revisou?
qual issue motivou?
qual release levou isso para produção?
```

Sem Git, a investigação vira adivinhação.

Com Git, existe trilha.

Backend profissional precisa de trilha.

---

## Git como segurança para aprender

Durante a formação, você vai errar código.

Isso é esperado.

Você vai quebrar exemplos.

Vai testar variações.

Vai refatorar.

Vai apagar coisa que talvez precise recuperar.

Git dá segurança para isso.

Se você fez um commit em um ponto bom, pode experimentar com mais tranquilidade.

A ideia não é sair usando comandos perigosos.

A ideia é aprender que Git permite trabalhar com histórico.

Isso muda a postura:

```text
sem Git: tenho medo de mexer
com Git: posso mudar com rastreabilidade
```

Profissional que tem medo de alterar código evolui devagar.

Git ajuda a reduzir esse medo.

---

## Instalação do Git no Windows

No Windows, a instalação normalmente é feita pelo instalador oficial do Git para Windows.

Durante a instalação, podem aparecer várias opções.

Neste momento, a recomendação é manter um caminho simples e previsível.

O mais importante é que, ao final, o comando `git` funcione no PowerShell.

Depois de instalar, abra um PowerShell novo e rode:

```powershell
git --version
```

Se aparecer a versão, o Git está acessível.

Se aparecer mensagem dizendo que o comando não foi reconhecido, há problema de instalação ou `PATH`.

Nesta formação, o PowerShell será suficiente para os comandos principais.

O Git também pode instalar o Git Bash, que é outro shell.

Mas não precisamos depender dele agora.

---

## Por que abrir um terminal novo depois de instalar

Quando uma ferramenta é instalada e altera o `PATH`, terminais já abertos podem não enxergar a mudança.

Então, depois de instalar o Git:

```text
feche o PowerShell;
abra um novo PowerShell;
rode git --version.
```

Isso evita falso erro.

Às vezes a instalação está certa, mas o terminal antigo ainda não atualizou o ambiente.

---

## Validando a instalação

Com o PowerShell aberto, rode:

```powershell
git --version
```

Saída esperada:

```text
git version ...
```

Não importa, neste momento, decorar o número exato da versão.

O importante é:

```text
o comando git existe;
o terminal consegue executá-lo;
a instalação está acessível.
```

Você também pode rodar:

```powershell
where git
```

Isso mostra onde o executável foi encontrado.

Exemplo de saída possível:

```text
C:\Program Files\Git\cmd\git.exe
```

Isso ajuda a diagnosticar se há mais de uma instalação ou se o sistema está usando um caminho inesperado.

---

## Configuração global

Depois de instalar, precisamos configurar o Git.

O Git tem configurações em níveis diferentes.

Por enquanto, foque no nível global.

Configuração global significa:

```text
vale para o usuário atual da máquina
```

Ou seja, para os repositórios criados ou usados por esse usuário, salvo exceções locais.

Para ver configurações globais:

```powershell
git config --global --list
```

No começo, pode estar vazio ou ter poucas entradas.

Vamos configurar os pontos mais importantes.

---

## `user.name`

O `user.name` define o nome que aparecerá nos commits.

Exemplo:

```powershell
git config --global user.name "Nome Sobrenome"
```

Esse nome não precisa ser o nome da máquina.

Não precisa ser usuário do Windows.

Ele representa a autoria dos commits.

Em empresa, normalmente deve refletir a identidade profissional da pessoa.

Em projeto pessoal, pode usar o nome desejado para assinar commits.

O ponto importante:

```text
commit precisa ter autor.
```

Sem isso, o Git pode reclamar ao tentar commitar.

---

## `user.email`

O `user.email` define o e-mail associado aos commits.

Exemplo:

```powershell
git config --global user.email "email@exemplo.com"
```

Esse e-mail também aparece no histórico.

Em plataformas remotas, como GitHub ou GitLab, o e-mail pode ser usado para associar commits à conta.

O ponto importante:

```text
nome e e-mail formam a identidade dos commits.
```

Veja:

```text
Author: Nome Sobrenome <email@exemplo.com>
```

Isso é rastreabilidade.

---

## Cuidado com dados pessoais em material compartilhável

Como os documentos da formação devem ser reutilizáveis, os exemplos usam valores genéricos.

No seu computador real, configure com os dados corretos.

No documento, o exemplo fica assim:

```powershell
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
```

Não coloque e-mail real em material que será compartilhado publicamente sem necessidade.

Em documentação didática, use placeholders.

Em configuração real, use dados reais adequados.

---

## Branch padrão

Quando você cria um repositório Git, ele precisa ter uma branch inicial.

Historicamente, muitos repositórios usavam:

```text
master
```

Hoje, é comum usar:

```text
main
```

Para configurar a branch inicial padrão como `main`:

```powershell
git config --global init.defaultBranch main
```

Isso faz com que novos repositórios criados com:

```powershell
git init
```

usem `main` como branch inicial.

Essa configuração evita ter que renomear depois.

Também aproxima o projeto de um padrão moderno bastante comum.

---

## Por que branch padrão importa

Em projeto profissional, nomes importam.

Se um time usa `main`, todos devem seguir.

Se um projeto remoto espera `main` e seu local cria `master`, pode haver confusão inicial.

Não é um problema impossível de resolver.

Mas é atrito desnecessário.

Configurar `init.defaultBranch main` reduz esse atrito.

A formação vai usar `main` como padrão.

---

## Quebra de linha: LF e CRLF

Esse assunto parece chato, mas é importante.

Sistemas operacionais historicamente representam quebra de linha de formas diferentes.

Windows costuma usar:

```text
CRLF
```

Linux/macOS costumam usar:

```text
LF
```

Em projetos com Git, isso pode gerar alterações falsas.

Exemplo:

```text
um arquivo parece inteiro modificado
mas na verdade só mudou quebra de linha
```

Isso atrapalha diff, commit e revisão.

---

## `core.autocrlf`

No Windows, uma configuração comum é:

```powershell
git config --global core.autocrlf true
```

Ela faz o Git lidar automaticamente com conversão de quebras de linha entre o repositório e o diretório de trabalho.

Conceitualmente:

```text
no repositório, Git preserva padrão adequado;
no Windows, arquivos podem aparecer com CRLF no working tree.
```

Há times que preferem estratégias diferentes, principalmente com `.gitattributes`.

Mais tarde, em Git profissional, isso será aprofundado.

Para o início da formação em Windows, `core.autocrlf true` é uma configuração prática.

O mais importante é saber que essa configuração existe porque quebra de linha pode afetar o histórico.

---

## `core.editor`

O Git pode abrir um editor em algumas situações.

Exemplo:

```text
mensagem de commit sem -m;
merge commit;
rebase;
conflito;
configurações avançadas.
```

No começo, vamos usar commit com `-m`.

Mas é bom saber que existe uma configuração de editor.

Exemplo genérico:

```powershell
git config --global core.editor "notepad"
```

Isso configura o Bloco de Notas como editor.

Mais tarde, pode ser ajustado para outro editor.

No início, não é o ponto mais importante.

Mas evita susto quando o Git abre um editor inesperado.

---

## Credenciais

Quando você se conecta a um repositório remoto, pode precisar autenticar.

Exemplo:

```text
GitHub;
GitLab;
Azure DevOps;
Bitbucket.
```

A autenticação pode envolver:

```text
login no navegador;
token;
credential manager;
SSH;
HTTPS;
chave.
```

Nesta aula, não vamos aprofundar credenciais remotas.

Mas precisamos saber que a instalação do Git no Windows normalmente pode trabalhar com gerenciador de credenciais.

Mais tarde, quando conectarmos GitHub, veremos com calma.

Por enquanto, o objetivo é:

```text
Git local instalado e configurado.
```

Não misture instalação local com autenticação remota.

São etapas diferentes.

---

## Configurações principais desta aula

As configurações principais são:

```powershell
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.editor "notepad"
```

Depois, validar:

```powershell
git config --global --list
```

Você deve ver entradas parecidas com:

```text
user.name=Nome Sobrenome
user.email=email@exemplo.com
init.defaultbranch=main
core.autocrlf=true
core.editor=notepad
```

O Git pode mostrar nomes em minúsculas.

Isso é normal.

---

## Exemplo mínimo: instalação validada e configuração global

Abra um PowerShell novo.

Rode:

```powershell
git --version
```

Depois:

```powershell
where git
```

Configure:

```powershell
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.editor "notepad"
```

Valide:

```powershell
git config --global --list
```

Esse é o exemplo mínimo desta aula.

Não criamos repositório ainda.

Isso vem na próxima aula.

Hoje é preparação.

---

## Onde essas configurações ficam

O Git grava configurações globais em um arquivo do usuário.

No Windows, normalmente fica associado ao perfil do usuário.

Você não precisa editar esse arquivo manualmente agora.

Use comandos:

```powershell
git config --global ...
```

Para consultar:

```powershell
git config --global --list
```

Para consultar uma chave específica:

```powershell
git config --global user.name
git config --global user.email
git config --global init.defaultBranch
git config --global core.autocrlf
```

Isso ajuda a validar sem depender de tela.

---

## Alterando uma configuração

Se digitou errado, basta rodar de novo.

Exemplo:

```powershell
git config --global user.name "Nome Corrigido"
```

O novo valor substitui o anterior.

Para conferir:

```powershell
git config --global user.name
```

Essa ideia é importante:

```text
configuração pode ser corrigida.
```

Não precisa reinstalar Git por causa de nome digitado errado.

---

## Removendo uma configuração

Se precisar remover uma configuração global:

```powershell
git config --global --unset nome.da.chave
```

Exemplo:

```powershell
git config --global --unset core.editor
```

Não use isso sem motivo.

Mas é bom saber que existe.

A maioria dos ajustes pode ser feita apenas sobrescrevendo o valor.

---

## Configuração global e configuração local

Existe configuração global e configuração local.

Global:

```text
vale para o usuário da máquina
```

Local:

```text
vale apenas para um repositório específico
```

Exemplo global:

```powershell
git config --global user.name "Nome Sobrenome"
```

Exemplo local, dentro de um repositório:

```powershell
git config user.name "Outro Nome"
```

Sem `--global`, o Git configura localmente, desde que você esteja dentro de um repositório.

Por enquanto, usaremos global.

Mais tarde, local será útil quando projetos diferentes exigirem identidades diferentes.

---

## Exemplo aplicado ao domínio corporativo

Imagine uma empresa com vários desenvolvedores trabalhando em uma API de pedidos.

Um bug aparece.

O time verifica o histórico e encontra um commit:

```text
Author: Nome Sobrenome <email@empresa.com>
Message: ajusta regra de cálculo de frete
```

Isso ajuda o time a entender:

```text
quem fez;
quando fez;
qual foi a intenção;
quais arquivos foram alterados.
```

Agora imagine se todos os commits aparecem como:

```text
Author: usuario <usuario@DESKTOP>
```

Ou pior, sem identidade coerente.

Isso dificulta rastreabilidade.

Em empresa, commit é registro técnico.

Por isso `user.name` e `user.email` importam.

---

## Outro exemplo aplicado: quebra de linha em time

Imagine um time com Windows e Linux.

Um arquivo tem 20 linhas alteradas de verdade.

Mas, por problema de quebra de linha, o Git mostra 500 linhas alteradas.

O code review fica poluído.

O revisor não sabe o que mudou de fato.

Isso gera risco.

Configurar `core.autocrlf` e, mais tarde, `.gitattributes`, ajuda a evitar esse tipo de ruído.

Backend profissional não é só escrever regra.

É também manter o fluxo de trabalho saudável.

---

## Git e qualidade de histórico

A instalação e configuração global são o começo de algo maior.

Um histórico bom depende de:

```text
commits pequenos;
mensagens claras;
arquivos corretos;
sem lixo gerado;
branch organizada;
revisão;
padrão de time;
rastreabilidade com tarefa;
cuidado com conflitos.
```

Mas tudo começa com:

```text
Git instalado;
identidade configurada;
branch padrão definida;
comportamento básico coerente.
```

Não pule essa etapa.

---

## Git e diário de bordo

Nesta formação, o Git também deve registrar evolução.

Quando houver prática de código ou documentação relevante, um commit pode ser sugerido.

Exemplo futuro:

```text
adiciona diagnostico inicial tecnico
adiciona primeiro programa java
documenta comandos basicos do terminal
implementa exemplo de compilacao manual
```

O diário de bordo explica o aprendizado.

O Git registra a evolução dos arquivos.

Juntos, eles criam prova de progresso.

---

## Erros comuns

### Erro 1 — Instalar Git e não abrir novo terminal

Sintoma:

```text
git não é reconhecido
```

Mesmo após instalar.

Correção:

```text
fechar e abrir o PowerShell;
rodar git --version novamente.
```

---

### Erro 2 — Confundir Git com GitHub

Git é a ferramenta local.

GitHub é plataforma remota.

Correção:

```text
primeiro dominar Git local;
depois conectar ao remoto.
```

---

### Erro 3 — Não configurar user.name e user.email

Sintoma ao tentar commitar:

```text
Git reclama de identidade desconhecida.
```

Correção:

```powershell
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
```

---

### Erro 4 — Digitar e-mail errado

Isso afeta autoria dos commits.

Correção:

```powershell
git config --global user.email "email-correto@exemplo.com"
git config --global user.email
```

---

### Erro 5 — Criar repositórios com branch inicial inesperada

Se não configurar branch padrão, pode criar `master` quando queria `main`.

Correção:

```powershell
git config --global init.defaultBranch main
```

---

### Erro 6 — Ignorar quebra de linha

Sintoma:

```text
diff gigante sem alteração real
```

Correção inicial no Windows:

```powershell
git config --global core.autocrlf true
```

Mais tarde, estudar `.gitattributes`.

---

### Erro 7 — Usar Git só pela interface da IDE

A IDE ajuda.

Mas primeiro é importante saber comandos básicos.

Correção:

```text
validar pelo terminal;
usar interface visual com entendimento.
```

---

### Erro 8 — Achar que precisa de GitHub para usar Git

Não precisa.

Você pode usar Git localmente.

GitHub entra quando quiser remoto, backup e colaboração.

---

### Erro 9 — Reinstalar Git para corrigir configuração

Na maioria das vezes, não precisa reinstalar.

Basta ajustar:

```powershell
git config --global chave valor
```

---

### Erro 10 — Não saber ver configuração atual

Sempre valide:

```powershell
git config --global --list
```

Sem validação, você acha que configurou.

Com validação, você sabe.

---

## Diagnóstico quando Git não funcionar

Siga este roteiro.

### 1. O comando existe?

```powershell
git --version
```

Se não reconhece, problema de instalação ou `PATH`.

### 2. Onde o Git está?

```powershell
where git
```

Se não aparece caminho, o sistema não encontrou.

### 3. O terminal foi aberto depois da instalação?

Se não, feche e abra de novo.

### 4. As configurações existem?

```powershell
git config --global --list
```

### 5. Nome está configurado?

```powershell
git config --global user.name
```

### 6. E-mail está configurado?

```powershell
git config --global user.email
```

### 7. Branch padrão está configurada?

```powershell
git config --global init.defaultBranch
```

### 8. Quebra de linha está configurada?

```powershell
git config --global core.autocrlf
```

Esse diagnóstico evita muita tentativa sem direção.

---

## Prática recomendada

Faça a configuração e registre as evidências.

No PowerShell:

```powershell
git --version
where git
git config --global user.name "Nome Sobrenome"
git config --global user.email "email@exemplo.com"
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.editor "notepad"
git config --global --list
```

Depois consulte individualmente:

```powershell
git config --global user.name
git config --global user.email
git config --global init.defaultBranch
git config --global core.autocrlf
git config --global core.editor
```

O objetivo é saber configurar e saber validar.

---

## Registro no diário de bordo

Registre:

```markdown
# Aula 009 — Git instalação e configuração global

## O que aprendi
Aprendi que Git é a ferramenta de controle de versão e que GitHub é uma plataforma remota. Git começa localmente.

## Validações
git --version:
where git:

## Configurações globais
user.name:
user.email:
init.defaultBranch:
core.autocrlf:
core.editor:

## Frase principal
Git registra a evolução técnica do projeto.

## Erros que quero evitar
- confundir Git com GitHub;
- não configurar identidade;
- usar branch padrão diferente sem perceber;
- ignorar quebra de linha;
- depender apenas da IDE;
- não validar configuração.

## Relação com a formação
O Git será usado para registrar a evolução dos códigos, documentos, práticas e decisões ao longo da formação.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar a diferença entre Git e GitHub;
explicar por que Git é rastreabilidade;
validar instalação com git --version;
localizar Git com where git;
configurar user.name;
configurar user.email;
configurar init.defaultBranch main;
entender o básico de core.autocrlf;
configurar core.editor;
listar configurações globais;
consultar uma configuração específica;
corrigir configuração digitada errada;
entender diferença entre configuração global e local;
explicar por que identidade de commit importa;
explicar por que quebra de linha pode atrapalhar time;
relacionar Git com diário de bordo, histórico e colaboração profissional.
```

Não precisa ainda criar repositório.

Isso é a próxima aula.

Hoje o objetivo é ter Git instalado, acessível e configurado corretamente.

---

## Fechamento da aula

Git é uma das ferramentas centrais da vida profissional de desenvolvimento.

Não porque seja bonito usar.

Mas porque software muda.

E toda mudança precisa de histórico.

Sem histórico, há medo.

Com histórico, há rastreabilidade.

Sem rastreabilidade, há confusão.

Com rastreabilidade, há investigação.

Nesta aula, preparamos o Git.

Na próxima, vamos criar um repositório local do zero e entender:

```text
git init;
git status;
git add;
git commit;
git log;
git diff;
git restore;
.gitignore;
mensagens coerentes.
```

A partir daí, cada prática importante da formação poderá deixar rastro.
