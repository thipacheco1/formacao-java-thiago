# Demo de narracao - M0.10 Git Local do Zero

Beleza. Vamos fazer isso juntos, como se eu estivesse sentado aqui do seu lado.

Antes de digitar qualquer comando, eu quero que voce entenda a ideia principal.

Uma pasta comum guarda arquivos. So isso.

Um repositorio Git guarda arquivos com historico.

Essa e a virada de chave.

Quando voce usa Git, voce para de trabalhar naquele modo antigo de criar copia manual:
projeto final, projeto final certo, projeto final agora vai.

O Git resolve isso de um jeito profissional. Ele cria pontos no tempo. Cada ponto diz:
o que mudou, quando mudou, quem mudou, e com qual intencao.

Agora, primeira coisa importante: Git nao e GitHub.

Git funciona localmente, sem internet. GitHub vem depois, quando voce quer colocar o projeto fora da sua maquina, colaborar, fazer backup, abrir pull request ou montar portfolio.

Hoje a gente esta aprendendo o nucleo: Git local.

Pensa no Git como tres areas.

Primeira: working tree.

Essa e a sua mesa de trabalho. E onde voce cria arquivo, edita README, muda codigo Java, apaga alguma coisa.

Segunda: staging area.

Essa e a mesa de preparacao. Quando voce roda git add, voce esta dizendo:
essa mudanca aqui vai entrar no proximo commit.

Terceira: repository.

Esse e o historico salvo. Quando voce roda git commit, ai sim voce cria um ponto oficial no historico.

Entao o ciclo mental e:
eu edito, olho o status, adiciono, olho o status de novo, faco commit, e depois olho o log.

Agora vamos fazer devagar.

Primeiro eu quero saber onde voce esta no terminal. Roda:

pwd

Olha o caminho. Confirma se voce esta dentro da pasta certa do projeto. Esse cuidado parece pequeno, mas evita um erro classico: rodar git init na pasta errada.

Agora roda:

ls

Voce esta vendo os arquivos do projeto? Se sim, beleza. Agora sim:

git init

Esse comando transforma a pasta em repositorio Git. Ele cria uma pasta oculta chamada ponto git. Voce normalmente nao mexe nela. Ela e o coracao do repositorio.

Agora roda:

git status

Guarda esse comando. Git status e o painel do carro. Antes de acelerar, voce olha o painel. Antes de commitar, voce olha o status.

Agora cria um README simples. Depois roda:

git status

O Git vai dizer que tem arquivo novo, ainda nao rastreado.

Agora prepara esse arquivo:

git add README.md

Percebe: isso ainda nao salvou no historico. So colocou na staging area.

Roda de novo:

git status

Agora o Git deve mostrar que o README esta preparado para commit.

Agora sim fazemos o ponto no historico:

git commit -m "Adiciona README inicial"

Essa mensagem e importante. Nao escreve teste, final, ajuste, coisas.

Uma boa mensagem responde: o que este commit faz?

Agora roda:

git log --oneline

Pronto. Aqui aconteceu o primeiro ciclo completo.

Voce criou uma mudanca, preparou essa mudanca, salvou um ponto no historico e viu esse ponto no log.

E esse e o Git local no seu fundamento mais importante.

Daqui pra frente, sempre que voce mexer em algo, pensa assim:

O que eu mudei?

Essa mudanca deve entrar no proximo commit?

A mensagem explica a intencao?

Eu conferi o status antes?

Eu olhei o diff antes de commitar?

Git nao e so salvar arquivo. Git e comunicacao tecnica.

Voce esta escrevendo uma historia do projeto para o seu eu do futuro, para outros devs e para qualquer pessoa que precise entender por que o codigo chegou naquele estado.

Se voce dominar esse ciclo local, GitHub vai ficar muito mais simples depois.
