# 003 — M0.03 — Organização do Windows para Desenvolvimento Java Backend

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.03.01` — Organização do Windows para desenvolvimento — Conceito, por que existe e vocabulário essencial.
- `M0.03.02` — Organização do Windows para desenvolvimento — Exemplo mínimo digitado do zero.
- `M0.03.03` — Organização do Windows para desenvolvimento — Exemplo aplicado ao domínio corporativo.
- `M0.03.04` — Organização do Windows para desenvolvimento — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para ensinar organização de ambiente como fundamento profissional, não como detalhe cosmético.

---

## Complemento operacional — antes de instalar ferramentas


> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.


Esta aula deve ser usada como a preparação física da máquina antes de baixar JDK, IntelliJ, Git, Maven, PostgreSQL, DBeaver, Postman/Insomnia e Docker.

A organização recomendada continua sendo:

```text
C:\dev
├── projects
├── studies
├── tools
├── labs
└── temp
```

### O que validar antes de seguir

Execute no PowerShell:

```powershell
mkdir C:\dev
cd C:\dev
mkdir projects
mkdir studies
mkdir tools
mkdir labs
mkdir temp
ls
```

Se alguma pasta já existir, não há problema. O importante é que a estrutura esteja clara.

### Onde cada ferramenta entra

Use este raciocínio:

```text
JDK, Git, IntelliJ, Docker Desktop, PostgreSQL e DBeaver
-> normalmente são instalados pelo instalador oficial no local padrão do Windows.

Maven em ZIP manual
-> pode ficar em C:\dev\tools.

Projetos do curso
-> devem ficar em C:\dev\projects.

Laboratórios descartáveis
-> podem ficar em C:\dev\labs ou C:\dev\temp.

Arquivos baixados temporariamente
-> podem ficar em Downloads apenas durante o download, mas não como local definitivo de projeto.
```

### Checklist específico desta aula

```markdown
## Pré-instalação do ambiente

- [ ] `C:\dev` existe.
- [ ] `C:\dev\projects` existe.
- [ ] `C:\dev\tools` existe.
- [ ] `C:\dev\labs` existe.
- [ ] `C:\dev\temp` existe.
- [ ] Projetos não ficam em Downloads.
- [ ] Projetos não ficam na Área de Trabalho.
- [ ] Projetos não ficam dentro de Program Files.
- [ ] Nomes de pastas evitam acento e espaço.
```

### Registro recomendado em `docs/ambiente.md`

```markdown
## Organização local

- Pasta base: `C:\dev`
- Projetos: `C:\dev\projects`
- Ferramentas manuais: `C:\dev\tools`
- Laboratórios: `C:\dev\labs`
- Temporários: `C:\dev\temp`
```

---

## Hoje a aula é sobre organizar a máquina como ambiente profissional

Antes de escrever código com profundidade, é preciso organizar o lugar onde esse código vai viver.

Parece uma aula simples.

Mas não trate como simples demais.

Um ambiente mal organizado vira atrito todo dia.

A pessoa perde arquivo.

Cria projeto em qualquer pasta.

Mistura instalação de ferramenta com código-fonte.

Coloca projeto em pasta com espaço no caminho e depois sofre com comando.

Não sabe onde está o JDK.

Não sabe onde fica o repositório.

Não sabe separar estudo, ferramenta e projeto.

Depois, quando algo falha, fica difícil descobrir se o problema é:

```text
código;
caminho;
permissão;
variável de ambiente;
ferramenta;
IDE;
terminal;
Git;
arquivo no lugar errado.
```

Organização de ambiente não é frescura.

Organização de ambiente reduz erro.

E backend profissional exige reduzir erro.

---

## A ideia central desta aula

A máquina de desenvolvimento precisa ter lugares claros para coisas diferentes.

Pense assim:

```text
ferramenta não é projeto
projeto não é download
código-fonte não é arquivo gerado
anotação não é instalação
repositório não é lixeira
```

Essa separação parece óbvia, mas muita gente não faz.

Um ambiente profissional precisa responder rapidamente:

```text
Onde ficam meus projetos?
Onde ficam minhas ferramentas?
Onde ficam meus estudos?
Onde estão meus repositórios?
Onde ficam arquivos temporários?
Onde fica meu código versionado?
Onde ficam os arquivos que não devem ir para o Git?
```

Se você não sabe responder isso, seu ambiente ainda não está maduro.

---

## A estrutura recomendada

Uma estrutura simples e profissional no Windows pode ser:

```text
C:\dev
├── projects
├── studies
├── tools
├── labs
└── temp
```

Vamos entender cada pasta.

### `C:\dev`

Essa é a raiz do ambiente de desenvolvimento.

Ela funciona como um ponto central.

Em vez de espalhar projetos por:

```text
Área de Trabalho
Downloads
Documentos
OneDrive
pasta da IDE
pasta aleatória
```

você passa a ter um endereço principal:

```text
C:\dev
```

Isso facilita terminal, Git, IDE, Docker, scripts e rotina.

---

### `C:\dev\projects`

Aqui ficam projetos reais ou projetos que simulam estrutura profissional.

Exemplo:

```text
C:\dev\projects\formacao-java-backend
C:\dev\projects\api-pedidos
C:\dev\projects\controle-os
```

Essa pasta deve conter repositórios importantes.

Coisas que você quer manter organizadas, versionadas e cuidadas.

---

### `C:\dev\studies`

Aqui ficam materiais de estudo.

Exemplo:

```text
C:\dev\studies\java
C:\dev\studies\sql
C:\dev\studies\spring
C:\dev\studies\arquitetura
```

Pode ser usada para anotações, leituras, pequenos arquivos e experimentos de estudo.

Mas cuidado: se um estudo virar projeto, ele deve migrar para `projects`.

---

### `C:\dev\tools`

Aqui podem ficar ferramentas manuais, quando fizer sentido.

Exemplo:

```text
C:\dev\tools\apache-maven
C:\dev\tools\postgres-scripts
C:\dev\tools\cli-utils
```

Nem toda ferramenta precisa ficar aqui.

Algumas são instaladas pelo próprio instalador do Windows.

Exemplo:

```text
JDK instalado em Program Files
Git instalado pelo instalador oficial
Docker Desktop instalado pelo instalador oficial
IntelliJ instalado pelo instalador oficial
```

A regra é:

```text
tools guarda ferramentas que você controla manualmente.
```

Não misture `tools` com projeto.

---

### `C:\dev\labs`

Aqui ficam experimentos descartáveis.

Exemplo:

```text
C:\dev\labs\teste-classpath
C:\dev\labs\teste-git
C:\dev\labs\teste-docker
```

Laboratório é lugar para quebrar coisas sem medo.

Nem todo laboratório precisa ir para o Git.

Laboratório serve para aprender.

Projeto serve para construir algo com continuidade.

---

### `C:\dev\temp`

Aqui ficam arquivos temporários.

Exemplo:

```text
C:\dev\temp\saida-teste.txt
C:\dev\temp\json-exemplo.json
C:\dev\temp\arquivo-importacao.csv
```

Mas atenção: temporário não deve virar depósito permanente.

Se algo ficou importante, mova para lugar certo.

---

## Por que evitar Área de Trabalho e Downloads

Muita gente cria projeto na Área de Trabalho porque é fácil.

O problema é que fácil agora pode virar dor depois.

A Área de Trabalho costuma virar mistura de:

```text
atalho;
print;
arquivo baixado;
documento pessoal;
rascunho;
pasta temporária;
projeto importante.
```

Downloads é pior ainda.

Downloads é uma pasta de passagem.

Não é casa de projeto.

Projeto em Downloads corre risco de:

```text
ser apagado sem querer;
ficar misturado com instaladores;
ser difícil de encontrar;
ter caminho ruim;
ser ignorado em backup;
confundir versões.
```

Um desenvolvedor forte não deixa projeto importante em pasta improvisada.

---

## Cuidado com OneDrive, Google Drive e pastas sincronizadas

Pastas sincronizadas podem ser úteis para documentos.

Mas para projeto de desenvolvimento, elas podem causar problemas.

Possíveis problemas:

```text
sincronização durante build;
arquivo bloqueado;
lentidão;
conflito de arquivo;
problema com .git;
alteração inesperada;
caminho grande;
acentos ou espaços no caminho.
```

Não significa que nunca possa usar.

Mas para formação e desenvolvimento Java, o ideal é usar uma pasta local simples, como:

```text
C:\dev
```

ou:

```text
C:\Users\usuario\dev
```

O importante é evitar complexidade desnecessária.

---

## Caminhos com espaço

No Windows, muitas pastas têm espaço:

```text
C:\Program Files
C:\Users\Nome Do Usuario
```

Isso não é proibido.

Mas pode atrapalhar em alguns comandos e scripts quando não usamos aspas.

Exemplo de caminho com espaço:

```text
C:\Users\Aluno Java\Documents\Projetos
```

Um comando mal escrito pode quebrar porque o terminal interpreta o espaço como separação.

Por isso, para projetos, prefira caminhos simples:

```text
C:\dev\projects\formacao-java-backend
```

Evite nomes como:

```text
C:\Meus Projetos Java\Curso Backend Completo
```

Melhor:

```text
C:\dev\projects\curso-java-backend
```

Não é porque o Windows não aceita espaço.

É porque ambiente profissional evita atrito.

---

## Acentos e caracteres especiais no caminho

Evite acentos em nomes de pastas de projeto.

Evite:

```text
C:\dev\projetos\formação-java
C:\dev\projetos\ação-api
C:\dev\projetos\integração-mensageria
```

Prefira:

```text
C:\dev\projects\formacao-java
C:\dev\projects\acao-api
C:\dev\projects\integracao-mensageria
```

Acentos hoje funcionam melhor do que antigamente, mas ainda podem gerar problemas em scripts, ferramentas, encodings e ambientes diferentes.

Projeto profissional deve ser fácil de rodar em qualquer máquina.

Nome simples ajuda.

---

## Maiúsculas, minúsculas e padrão de nomes

Windows costuma não diferenciar maiúsculas e minúsculas em nomes de arquivo.

Mas Git, Linux, Docker e servidores podem diferenciar.

Então evite bagunça como:

```text
ProjetoJava
projetojava
ProjetoJAVA
```

Escolha um padrão.

Para pastas de projeto, um bom padrão é:

```text
minusculo-com-hifen
```

Exemplo:

```text
formacao-java-backend
api-pedidos
controle-ordem-servico
laboratorio-git
```

Para arquivos Java, vale a regra da linguagem:

```text
NomeDaClasse.java
```

Exemplo:

```text
Calculadora.java
OrdemServico.java
Cliente.java
```

Cada tipo de coisa tem seu padrão.

---

## Separando o que é do sistema, da ferramenta e do projeto

Uma confusão comum é querer colocar tudo dentro do projeto.

Errado:

```text
formacao-java-backend
├── jdk-21
├── apache-maven
├── git
├── docker
├── src
└── docs
```

Isso mistura ferramenta com projeto.

O projeto deve carregar o código e a documentação do projeto, não o mundo inteiro.

Mais correto:

```text
C:\Program Files\Eclipse Adoptium\jdk-21
C:\dev\tools\apache-maven
C:\dev\projects\formacao-java-backend
```

Dentro do projeto:

```text
formacao-java-backend
├── docs
├── src
├── README.md
└── .gitignore
```

O JDK é ferramenta do ambiente.

O projeto usa o JDK.

O projeto não contém o JDK.

---

## Permissões

No Windows, algumas pastas exigem permissão de administrador.

Exemplo:

```text
C:\Program Files
C:\Windows
```

Não crie seus projetos ali.

Evite:

```text
C:\Program Files\meu-projeto-java
C:\Windows\java-estudos
```

Essas pastas são para instalação de sistema e programas, não para desenvolvimento diário.

Use uma pasta controlada por você:

```text
C:\dev
```

ou:

```text
C:\Users\usuario\dev
```

Isso evita erro de permissão ao criar arquivo, compilar, apagar, gerar build e rodar ferramenta.

---

## Encoding: por que isso aparece tão cedo

Encoding é a forma como o texto é representado em bytes.

Parece avançado, mas aparece cedo.

Exemplo:

```text
ação
configuração
usuário
não
```

Se uma ferramenta interpreta o arquivo com encoding errado, pode aparecer:

```text
aÃ§Ã£o
configuraÃ§Ã£o
usuÃ¡rio
nÃ£o
```

No ecossistema moderno, use UTF-8 sempre que possível.

No IntelliJ, mais tarde, vamos garantir que os arquivos estejam em UTF-8.

Em projetos Java, isso importa para:

```text
código;
logs;
arquivos .properties;
JSON;
CSV;
SQL;
mensagens;
documentação.
```

No começo, a regra simples é:

```text
crie arquivos em UTF-8;
evite ferramenta antiga que salve em encoding estranho;
evite acentos em nomes de pastas;
use acentos normalmente no conteúdo quando o projeto estiver configurado corretamente.
```

---

## Estrutura mínima para a formação

Para esta formação, uma estrutura boa seria:

```text
C:\dev
└── projects
    └── formacao-java-backend
        ├── docs
        ├── src
        ├── labs
        ├── README.md
        └── .gitignore
```

Mas há uma decisão importante.

Dentro do repositório, podemos ter:

```text
docs
src
labs
```

Fora do repositório, podemos ter laboratórios descartáveis:

```text
C:\dev\labs
```

A diferença:

```text
labs dentro do repositório = laboratórios que queremos preservar.
labs fora do repositório = testes rápidos e descartáveis.
```

Isso precisa ser consciente.

---

## Exemplo mínimo: criando a estrutura base no PowerShell

Abra o PowerShell.

Primeiro, veja onde você está:

```powershell
pwd
```

Agora crie a raiz:

```powershell
mkdir C:\dev
```

Se a pasta já existir, tudo bem.

Entre nela:

```powershell
cd C:\dev
```

Crie as pastas principais:

```powershell
mkdir projects
mkdir studies
mkdir tools
mkdir labs
mkdir temp
```

Liste:

```powershell
ls
```

Você deve ver algo como:

```text
projects
studies
tools
labs
temp
```

Agora crie uma pasta de projeto:

```powershell
cd C:\dev\projects
mkdir formacao-java-backend
cd formacao-java-backend
```

Crie a estrutura inicial:

```powershell
mkdir docs
mkdir src
mkdir labs
New-Item README.md
New-Item .gitignore
```

Liste:

```powershell
ls
```

Você deve ver:

```text
docs
src
labs
README.md
.gitignore
```

Isso já é uma base organizada.

---

## O que cada item representa

### `docs`

Aqui ficam documentos do projeto e da formação.

Exemplo:

```text
docs\diagnostico-inicial.md
docs\diario-de-bordo.md
docs\atalhos.md
docs\decisoes.md
```

Documentação não deve ficar solta.

Ela precisa morar em lugar previsível.

---

### `src`

Aqui ficará código-fonte.

No começo, pode ser simples.

Mais tarde, com Maven, a estrutura muda para:

```text
src\main\java
src\test\java
```

Mas a ideia é a mesma:

```text
src = source = código-fonte
```

---

### `labs`

Aqui ficam experimentos preservados.

Exemplo:

```text
labs\classpath
labs\git
labs\debug
```

Se for algo importante para revisão futura, pode ficar aqui.

Se for descartável, use `C:\dev\labs`.

---

### `README.md`

O README é a porta de entrada do projeto.

No início, pode ser simples:

```markdown
# Formação Java Backend

Repositório de estudos, práticas e evolução técnica em Java Backend.

## Estrutura

- docs: documentação e diário de bordo
- src: código-fonte
- labs: laboratórios de estudo
```

Com o tempo, esse README vai melhorar.

---

### `.gitignore`

O `.gitignore` diz ao Git o que não deve ser versionado.

No começo, para Java, pode conter:

```gitignore
*.class
out/
target/
.idea/
*.iml
.DS_Store
Thumbs.db
```

Cada linha evita versionar coisa que não deve ir para o repositório.

Exemplo:

```text
.class é gerado pela compilação.
out é pasta de saída.
target é saída do Maven.
.idea é configuração local da IDE.
```

O Git deve guardar fonte e documentação, não lixo gerado.

---

## Exemplo aplicado ao domínio corporativo

Imagine uma empresa com vários projetos backend.

Se cada desenvolvedor organiza de um jeito, o time sofre.

Um projeto fica em:

```text
C:\Users\Joao\Desktop\novo projeto final certo
```

Outro fica em:

```text
D:\backup\api-teste-v2-final-final
```

Outro fica em:

```text
C:\Downloads\spring-api
```

Agora imagine um suporte técnico:

```text
Roda o projeto.
Executa os testes.
Valida a branch.
Gera o build.
Sobe o Docker.
Abre o log.
Confere o arquivo de configuração.
```

Se o ambiente está bagunçado, cada passo vira um problema.

Em empresa séria, padronização reduz tempo perdido.

Exemplo melhor:

```text
C:\dev\projects\api-pedidos
C:\dev\projects\api-clientes
C:\dev\projects\worker-notificacoes
C:\dev\tools
C:\dev\labs
```

A pessoa sabe onde procurar.

O time sabe orientar.

Scripts ficam mais previsíveis.

Documentação fica mais fácil.

---

## Como isso se conecta com Java

Java trabalha com arquivos, pacotes, compilação e classpath.

Se o projeto está bagunçado, você se perde rápido.

Exemplo:

```text
Main.java em uma pasta
Main.class em outra
terminal aberto em outro lugar
IDE apontando para outro JDK
Git versionando arquivo gerado
```

Daí aparece erro, e a pessoa acha que “Java é difícil”.

Às vezes, Java nem é o problema.

O problema é ambiente.

Organização ajuda a separar:

```text
erro de código
erro de compilação
erro de execução
erro de caminho
erro de ferramenta
erro de configuração
```

Essa separação é uma habilidade profissional.

---

## Como isso se conecta com Maven

Mais tarde, Maven vai esperar uma estrutura.

Exemplo clássico:

```text
src
├── main
│   └── java
└── test
    └── java
```

E vai gerar saída em:

```text
target
```

Se desde agora você entende que projeto tem estrutura, Maven não vai parecer estranho.

Você vai pensar:

```text
src é onde escrevo.
target é onde o build gera.
pom.xml é a configuração do projeto.
```

A organização que estamos criando agora prepara esse raciocínio.

---

## Como isso se conecta com Git

Git observa arquivos dentro do repositório.

Se você mistura projeto com arquivo temporário, o Git mostra sujeira.

Exemplo ruim:

```text
relatorio-final.xlsx
foto.png
Main.class
teste.zip
out/
src/
README.md
```

Quando roda:

```bash
git status
```

aparece um monte de coisa sem relação com o projeto.

Isso atrapalha commit.

A pessoa começa a commitar o que não devia.

Ou deixa de commitar o que devia.

Organização de pastas e `.gitignore` protegem a qualidade do histórico.

---

## Como isso se conecta com Docker e banco

Mais tarde, Docker pode usar volumes.

PostgreSQL pode usar arquivos.

Scripts podem esperar caminhos.

Compose pode montar diretórios.

Exemplo:

```yaml
volumes:
  - ./data:/var/lib/postgresql/data
```

Se você não entende a pasta do projeto, vai sofrer com volume, arquivo e caminho.

Então, mesmo Docker sendo assunto futuro, a base começa aqui:

```text
saber onde estão os arquivos.
```

---

## Erros comuns

### Erro 1 — Criar projeto em Downloads

Downloads não é lugar de projeto.

Correção:

```text
mover para C:\dev\projects
```

---

### Erro 2 — Criar projeto na Área de Trabalho

A Área de Trabalho vira bagunça rápido.

Correção:

```text
usar pasta dedicada para desenvolvimento
```

---

### Erro 3 — Misturar ferramenta com projeto

Errado:

```text
projeto contendo JDK, Maven, Git e código juntos
```

Correto:

```text
ferramentas instaladas ou em tools;
projeto em projects.
```

---

### Erro 4 — Usar caminho cheio de espaço e acento

Evite:

```text
C:\Meus Projetos\Curso Java Avançado
```

Prefira:

```text
C:\dev\projects\curso-java-avancado
```

---

### Erro 5 — Não saber onde o terminal está

Antes de rodar comando:

```powershell
pwd
ls
```

Esses dois comandos evitam muita confusão.

---

### Erro 6 — Versionar arquivo gerado

Evite versionar:

```text
.class
out/
target/
```

Use `.gitignore`.

---

### Erro 7 — Criar muitas cópias do mesmo projeto

Ruim:

```text
formacao-java
formacao-java-final
formacao-java-copia
formacao-java-agora-vai
```

Correto:

```text
um repositório;
Git para histórico;
branch quando necessário.
```

Cópia manual é sinal de medo de Git.

A formação vai corrigir isso.

---

## Diagnóstico quando algo der errado

Quando um comando não funciona, não tente corrigir no escuro.

Siga esta sequência.

### 1. Ver onde está

```powershell
pwd
```

### 2. Ver arquivos da pasta

```powershell
ls
```

### 3. Ver se o projeto está no lugar esperado

```text
C:\dev\projects\nome-do-projeto
```

### 4. Ver se o arquivo existe

Se quer compilar `Main.java`, ele precisa aparecer no `ls`.

### 5. Ver se não está em pasta errada

Muitas vezes o erro é simples:

```text
terminal está na pasta pai;
arquivo está em src;
comando foi rodado na raiz errada.
```

### 6. Ler a mensagem de erro

Erro de caminho costuma falar coisas como:

```text
file not found
cannot find
path not found
access denied
```

Essas mensagens são pistas.

---

## Prática recomendada

Esta prática faz sentido porque ambiente precisa ser executado, não apenas entendido.

Crie a estrutura:

```powershell
mkdir C:\dev
cd C:\dev

mkdir projects
mkdir studies
mkdir tools
mkdir labs
mkdir temp

cd C:\dev\projects
mkdir formacao-java-backend
cd formacao-java-backend

mkdir docs
mkdir src
mkdir labs
New-Item README.md
New-Item .gitignore
```

Abra o arquivo `.gitignore` e coloque:

```gitignore
*.class
out/
target/
.idea/
*.iml
.DS_Store
Thumbs.db
```

Abra o `README.md` e coloque:

```markdown
# Formação Java Backend

Repositório de estudos, práticas e evolução técnica em Java Backend.

## Estrutura

- docs: documentação e diário de bordo
- src: código-fonte
- labs: laboratórios preservados
```

Depois rode:

```powershell
pwd
ls
```

O objetivo é saber explicar a estrutura criada.

---

## Registro no diário de bordo

Registre:

```markdown
# Aula 003 — Organização do Windows para desenvolvimento

## O que aprendi
Aprendi que ambiente organizado reduz erro e melhora minha autonomia como desenvolvedor.

## Estrutura escolhida
C:\dev
C:\dev\projects
C:\dev\studies
C:\dev\tools
C:\dev\labs
C:\dev\temp

## Projeto principal
C:\dev\projects\formacao-java-backend

## Regras que vou seguir
- não criar projeto em Downloads;
- não criar projeto na Área de Trabalho;
- evitar espaços e acentos em nomes de pastas;
- separar ferramenta de projeto;
- usar Git para histórico, não cópia manual;
- usar .gitignore para arquivos gerados.

## Dúvidas
-
```

Esse registro é simples, mas importante.

Ele cria compromisso com o padrão.

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar por que ambiente organizado importa;
diferenciar tools, projects, studies, labs e temp;
criar uma estrutura C:\dev organizada;
evitar Downloads e Área de Trabalho para projetos;
entender risco de espaços e acentos em caminhos;
explicar por que não colocar JDK dentro do projeto;
criar README.md e .gitignore iniciais;
usar pwd e ls para se localizar;
explicar como organização ajuda Java, Git, Maven, Docker e banco.
```

Não precisa decorar cada pasta.

Precisa entender o raciocínio.

---

## Fechamento da aula

Organizar o Windows para desenvolvimento não é uma etapa decorativa.

É a preparação do terreno.

Um profissional forte reduz atrito antes que ele apareça.

A máquina precisa ajudar, não atrapalhar.

Quando o ambiente está organizado, os próximos assuntos ficam mais fáceis:

```text
terminal;
JDK;
IntelliJ;
Git;
Maven;
PostgreSQL;
Docker;
projetos Java;
Spring Boot;
build;
testes;
deploy.
```

Na próxima aula, vamos entrar no terminal e PowerShell.

Ali a ideia será parar de depender só de clique e começar a ganhar autonomia com comandos.

Não para virar administrador de sistema.

Mas para se tornar um backend que entende o próprio ambiente.
