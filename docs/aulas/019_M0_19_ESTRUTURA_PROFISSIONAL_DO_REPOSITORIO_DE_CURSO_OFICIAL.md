# 019 — M0.19 — Estrutura Profissional do Repositório de Curso

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.19.01` — Estrutura profissional do repositório de curso — Conceito, por que existe e vocabulário essencial.
- `M0.19.02` — Estrutura profissional do repositório de curso — Exemplo mínimo digitado do zero.
- `M0.19.03` — Estrutura profissional do repositório de curso — Exemplo aplicado ao domínio corporativo.
- `M0.19.04` — Estrutura profissional do repositório de curso — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para estruturar o repositório da formação de forma profissional, com `README`, `docs`, `src`, commits por aula, padrões de nome, organização, rastreabilidade e disciplina de versionamento.

---

## Complemento operacional — consolidar ferramentas instaladas dentro do repositório


> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.


Esta aula organiza o repositório do curso. O complemento abaixo conecta essa estrutura com as ferramentas já instaladas no Módulo 0.

### Arquivo obrigatório: `docs/ambiente.md`

Crie ou atualize:

```text
docs/ambiente.md
```

Modelo recomendado:

```markdown
# Ambiente de desenvolvimento

## Pastas

- Pasta base: `C:\dev`
- Projetos: `C:\dev\projects`
- Ferramentas manuais: `C:\dev\tools`

## Java

- `java -version`: validado
- `javac -version`: validado
- `JAVA_HOME`: configurado sem expor caminho sensível desnecessário

## IntelliJ IDEA Community

- Instalado: sim
- Project SDK: JDK usado no curso
- Terminal integrado: validado

## Git e GitHub

- `git --version`: validado
- `user.name`: configurado
- `user.email`: configurado
- Remoto `origin`: configurado

## Maven

- `mvn -version`: validado
- `MAVEN_HOME`: configurado, se instalação manual

## PostgreSQL e DBeaver

- PostgreSQL local: preparado
- Database de estudo: `formacao_java`
- Senha: não documentada

## Postman ou Insomnia

- Ferramenta escolhida:
- Collection de estudo:
- Environment local:

## Docker e WSL2

- `wsl --status`: validado
- `docker run hello-world`: validado
```

### `.gitignore` reforçado

Garanta que o `.gitignore` bloqueie:

```gitignore
target/
build/
.gradle/
*.class
out/
.idea/
*.iml
.env
.env.*
!.env.example
*.log
```

### Critério operacional atualizado

```markdown
## Repositório de curso validado

- [ ] `README.md` existe.
- [ ] `.gitignore` existe.
- [ ] `docs/ambiente.md` existe.
- [ ] `docs/diario-de-bordo.md` existe.
- [ ] `docs/checklist-ambiente.md` existe.
- [ ] `src/main/java` existe.
- [ ] `src/test/java` existe.
- [ ] `labs` existe.
- [ ] `.gitignore` bloqueia arquivos gerados.
- [ ] `.gitignore` bloqueia segredos.
- [ ] Ambiente instalado foi registrado sem senhas reais.
- [ ] `git status` está limpo ou contém apenas mudanças intencionais.
```

---

## Onde estamos na formação

Estamos seguindo a ordem oficial do Módulo 0.

Até aqui, a preparação já cobriu:

```text
M0.01 — mapa da formação;
M0.02 — diagnóstico inicial;
M0.03 — organização do Windows;
M0.04 — PowerShell e comandos básicos;
M0.05 — JDK, JRE e JVM;
M0.06 — compilação manual com javac;
M0.07 — IntelliJ IDEA Community;
M0.08 — debug inicial;
M0.09 — Git instalação e configuração global;
M0.10 — Git local;
M0.11 — GitHub e repositório remoto;
M0.12 — Markdown para documentação técnica;
M0.13 — diário de bordo e rastreabilidade;
M0.14 — Codex/IA no IntelliJ com ética e método;
M0.15 — Maven instalação e validação inicial;
M0.16 — PostgreSQL e DBeaver preparação;
M0.17 — Postman/Insomnia e HTTP básico;
M0.18 — Docker Desktop e WSL2 preparação.
```

Agora vamos organizar o repositório de curso.

Essa aula é importante porque, a partir daqui, a formação começa a ganhar mais arquivos, mais exercícios, mais códigos, mais anotações e mais evidências.

Se o repositório nasce bagunçado, o aprendizado fica bagunçado.

Se o repositório nasce organizado, cada aula vira uma peça rastreável da evolução.

---

## Hoje a aula é sobre transformar estudo em repositório profissional

Muita gente estuda programação assim:

```text
arquivos soltos;
pastas sem padrão;
código na Área de Trabalho;
projeto dentro de Downloads;
nomes aleatórios;
sem README;
sem Git;
sem histórico;
sem explicação;
sem commit por etapa;
sem evidência do que foi feito.
```

Isso pode até parecer rápido no começo.

Mas vira confusão.

Depois de algumas semanas, a pessoa já não sabe:

```text
qual arquivo é o correto;
o que foi feito em cada aula;
qual exercício funcionava;
qual comando usou;
qual erro resolveu;
qual commit representa cada etapa;
qual pasta contém código;
qual pasta contém documentação.
```

Um repositório profissional resolve isso com organização.

Não é burocracia.

É memória técnica.

É rastreabilidade.

É disciplina de engenharia.

---

## O que é um repositório de curso profissional

Um repositório de curso profissional é um repositório organizado para armazenar:

```text
código;
documentação;
anotações;
diário de bordo;
checklists;
scripts;
exercícios;
evidências;
commits por aula;
histórico de evolução.
```

Ele não é apenas uma pasta.

Ele é o lugar onde o aprendizado fica registrado.

A diferença entre uma pasta qualquer e um repositório profissional é:

```text
pasta guarda arquivos;
repositório profissional conta a história técnica do projeto.
```

Essa história precisa ser compreensível.

Inclusive por outra pessoa.

Inclusive por você no futuro.

---

## Por que isso importa para Java Backend

Backend profissional exige organização.

Em projetos reais, você encontrará estruturas como:

```text
src/main/java;
src/test/java;
docs;
README.md;
pom.xml;
Dockerfile;
compose.yml;
scripts;
.gitignore;
.github;
configurações;
migrations;
collections de API;
arquivos de ambiente exemplo.
```

Cada coisa tem lugar.

Se você se acostuma desde o início a organizar estudo com padrão, a transição para projetos reais fica natural.

Se você aprende em bagunça, depois precisa desaprender.

Esta aula existe para criar o hábito correto antes de entrar no Java profundo.

---

## O repositório como trilha de evolução

O repositório deve mostrar evolução.

Exemplo:

```text
primeiro commit: estrutura inicial;
segundo commit: documentação do ambiente;
terceiro commit: validação de JDK;
quarto commit: validação de Maven;
quinto commit: preparação de PostgreSQL;
sexto commit: preparação de HTTP;
sétimo commit: preparação de Docker.
```

Isso permite responder:

```text
o que foi feito?
quando foi feito?
por que foi feito?
qual arquivo mudou?
qual evidência existe?
qual aula gerou isso?
```

Essa mentalidade é muito parecida com trabalho corporativo.

Em backend real, cada commit deveria ter uma intenção clara.

---

## Estrutura recomendada do repositório

Para a formação, uma estrutura inicial boa é:

```text
formacao-java-backend/
├── README.md
├── .gitignore
├── docs/
│   ├── ambiente.md
│   ├── atalhos.md
│   ├── diario-de-bordo.md
│   ├── http-basico.md
│   ├── docker-basico.md
│   └── checklist-ambiente.md
├── src/
│   ├── main/
│   │   └── java/
│   └── test/
│       └── java/
└── labs/
    └── README.md
```

Essa estrutura separa:

```text
README -> entrada do projeto;
docs -> documentação e registros;
src -> código principal e testes;
labs -> experimentos e práticas isoladas.
```

Ainda não vamos programar Java profundamente aqui.

Mas já deixamos `src` pronto para o M1.

---

## README.md

O `README.md` é a porta de entrada do repositório.

Ele deve responder rapidamente:

```text
o que é este repositório?
qual objetivo?
qual stack será usada?
como está organizado?
como validar ambiente?
como estudar?
quais comandos principais?
onde ficam as anotações?
```

Um repositório sem README parece abandonado.

Um README bom reduz dúvida.

Ele não precisa ser gigantesco.

Precisa ser claro.

---

## Modelo de README inicial

Use este modelo:

````markdown
# Formação Java Backend

Repositório de estudos, práticas e documentação da formação Java Backend.

## Objetivo

Construir uma base sólida em Java Backend, passando por ambiente, fundamentos da linguagem, orientação a objetos, banco de dados, APIs, testes, arquitetura, segurança, mensageria, observabilidade e boas práticas profissionais.

## Estrutura

```text
.
├── docs/
├── src/
└── labs/
```

## Pastas

- `docs/` — documentação, diário de bordo, checklists e anotações.
- `src/` — código-fonte dos exercícios e projetos.
- `labs/` — experimentos, provas de conceito e práticas isoladas.

## Ambiente

Ferramentas preparadas no Módulo 0:

- JDK
- IntelliJ IDEA Community
- Git
- GitHub
- Maven
- PostgreSQL
- DBeaver
- Postman ou Insomnia
- Docker Desktop
- WSL2

## Comandos úteis

```bash
git status
git diff
git add .
git commit -m "mensagem"
```

## Diário de bordo

O registro de evolução fica em:

```text
docs/diario-de-bordo.md
```

## Regra de estudo

Cada aula relevante deve gerar:

- anotação;
- prática quando aplicável;
- atualização do diário;
- commit pequeno e rastreável.
````
Esse README é simples, mas profissional.

---

## Pasta `docs`

A pasta `docs` guarda documentação.

Exemplos:

```text
docs/ambiente.md
docs/atalhos.md
docs/diario-de-bordo.md
docs/http-basico.md
docs/docker-basico.md
docs/checklist-ambiente.md
```

A pasta `docs` evita que anotações fiquem misturadas com código.

Isso é importante.

Código e documentação se relacionam, mas não são a mesma coisa.

Um backend profissional precisa saber escrever código e documentar contexto técnico.

---

## `docs/diario-de-bordo.md`

O diário de bordo registra a evolução.

Ele pode ter entradas por aula:

```markdown
## Aula 019 — Estrutura profissional do repositório

### O que aprendi

### O que pratiquei

### Arquivos criados ou alterados

### Comandos usados

### Erros que quero evitar

### Próximo passo
```

O diário não é texto bonito para enfeitar.

Ele serve para:

```text
lembrar decisões;
registrar aprendizado;
anotar erros;
rastrear evolução;
facilitar revisão;
criar evidência de progresso.
```

Em projetos reais, algo parecido aparece em ADRs, changelogs, runbooks e documentação técnica.

---

## `docs/atalhos.md`

Atalhos úteis devem ficar centralizados.

Exemplo:

```markdown
# Atalhos úteis

## IntelliJ

| Ação | Atalho |
|---|---|
| Terminal integrado | `Alt + F12` |
| Project | `Alt + 1` |
| Buscar ação | `Ctrl + Shift + A` |
| Search Everywhere | `Shift Shift` |
| Reformatar | `Ctrl + Alt + L` |
| Commit | `Ctrl + K` |

## DBeaver

| Ação | Atalho |
|---|---|
| Executar SQL atual | `Ctrl + Enter` |
| Autocomplete | `Ctrl + Space` |

## Observações

Atalhos podem variar conforme keymap, teclado e sistema operacional.
```

Isso evita repetir atalhos em arquivos soltos.

---

## `docs/ambiente.md`

Esse arquivo documenta o ambiente de desenvolvimento.

Exemplo:

```markdown
# Ambiente de desenvolvimento

## Java

- JDK instalado.
- `java -version` validado.
- `javac -version` validado.

## Maven

- `mvn -version` validado.
- Maven usando JDK esperado.

## PostgreSQL

- Host local: `localhost`
- Porta padrão: `5432`
- Database de estudo: `formacao_java`
- Senha: não documentada por segurança.

## Docker

- WSL2 validado.
- Docker Desktop iniciado.
- `docker run hello-world` executado.
```

Esse arquivo não deve conter senhas reais.

Ele registra procedimento e estado geral.

---

## `docs/checklist-ambiente.md`

Checklist final do ambiente pode ficar em arquivo próprio.

Exemplo:

```markdown
# Checklist do ambiente

- [ ] Windows organizado.
- [ ] PowerShell validado.
- [ ] JDK validado.
- [ ] IntelliJ instalado.
- [ ] Git configurado.
- [ ] GitHub conectado.
- [ ] Maven validado.
- [ ] PostgreSQL preparado.
- [ ] DBeaver conectado.
- [ ] Postman ou Insomnia instalado.
- [ ] Docker Desktop preparado.
- [ ] WSL2 validado.
```

Na próxima aula, esse checklist será aprofundado.

Aqui, já deixamos o lugar dele criado.

---

## Pasta `src`

A pasta `src` guardará código.

Mesmo antes de Java profundo, podemos preparar:

```text
src/main/java
src/test/java
```

Essa estrutura é padrão em projetos Java com Maven e Gradle.

Significado:

```text
src/main/java -> código principal;
src/test/java -> código de teste.
```

No M1, quando começarmos fundamentos de Java, os exercícios poderão usar essa estrutura ou estruturas específicas de laboratório.

O importante agora é não jogar código solto na raiz.

---

## Pasta `labs`

A pasta `labs` serve para experimentos.

Exemplos futuros:

```text
labs/terminal;
labs/git;
labs/http;
labs/docker;
labs/java-basico;
labs/poo;
labs/sql;
```

Um laboratório pode conter código ou arquivos temporários de estudo.

Mas precisa ter limite.

`labs` não deve virar lixeira.

Se algo virar parte oficial do projeto, deve ir para o lugar correto.

---

## `.gitignore`

O `.gitignore` informa ao Git o que não deve ser versionado.

Para este repositório de curso, um início bom:

```gitignore
# Java / Maven / Gradle
target/
build/
.gradle/
*.class

# IntelliJ
.idea/
*.iml

# Sistema operacional
.DS_Store
Thumbs.db

# Logs e temporários
*.log
*.tmp

# Ambiente e segredos
.env
.env.*
!.env.example
```

Atenção ao trecho:

```gitignore
.env
.env.*
!.env.example
```

Significa:

```text
não versionar arquivos reais de ambiente;
permitir um exemplo seguro.
```

Mais tarde, isso será importante para APIs e banco.

---

## `.gitkeep`

Git não versiona pastas vazias.

Se você quiser manter uma pasta vazia no repositório, pode criar um arquivo chamado:

```text
.gitkeep
```

Exemplo:

```text
src/main/java/.gitkeep
src/test/java/.gitkeep
labs/.gitkeep
```

`.gitkeep` não é uma regra oficial do Git.

É uma convenção comum.

Serve para dizer:

```text
esta pasta ainda está vazia, mas deve existir no repositório.
```

Quando a pasta ganhar arquivos reais, o `.gitkeep` pode ser removido.

---

## Padrões de nome

Nomes consistentes evitam confusão.

Regras recomendadas:

```text
usar letras minúsculas em pastas comuns;
usar hífen para nomes compostos em documentação;
evitar acentos em nomes de arquivos;
evitar espaços;
ser descritivo;
não usar nomes genéricos como teste1, novo, final, final2.
```

Bons nomes:

```text
diario-de-bordo.md
checklist-ambiente.md
http-basico.md
docker-basico.md
ambiente.md
```

Nomes ruins:

```text
coisas.md
teste.md
novo documento.md
aula final certa.md
docker agora vai.md
```

Nome de arquivo é comunicação.

---

## Padrão para commits por aula

Cada aula relevante deve gerar um commit pequeno.

Exemplos:

```bash
git commit -m "Aula 019: organiza estrutura do repositorio"
```

ou:

```bash
git commit -m "Documenta estrutura profissional do repositorio"
```

Evite commits vagos:

```text
update;
ajustes;
coisas;
final;
teste;
subindo arquivos.
```

Commit precisa dizer intenção.

Não precisa contar uma história gigante.

Mas precisa ser claro.

---

## Tamanho do commit

Um commit bom geralmente tem uma intenção principal.

Exemplo bom:

```text
organiza estrutura inicial do repositório.
```

Exemplo ruim:

```text
instala Docker, cria código Java, muda README, apaga arquivos, ajusta Git, adiciona SQL e altera várias coisas sem relação.
```

Commits grandes demais dificultam revisão.

Commits pequenos e claros ajudam a entender evolução.

---

## Fluxo por aula

Um fluxo recomendado:

```text
1. Ler aula.
2. Executar prática.
3. Atualizar documentação.
4. Atualizar diário de bordo.
5. Conferir git status.
6. Conferir git diff.
7. Adicionar arquivos.
8. Conferir staged diff.
9. Commitar.
10. Conferir git status limpo.
```

Comandos:

```bash
git status
git diff
git add .
git diff --staged
git commit -m "Aula 019: organiza estrutura do repositorio"
git status
```

Esse fluxo cria disciplina.

---

## Não usar `git add .` cegamente

`git add .` é útil, mas pode adicionar coisa errada.

Antes dele, rode:

```bash
git status
git diff
```

Se aparecer arquivo inesperado, investigue.

Depois de adicionar:

```bash
git diff --staged
```

Isso mostra o que será commitado.

Regra:

```text
não commitar sem revisar.
```

Essa regra é profissional.

---

## Exemplo mínimo digitado do zero

Vamos criar a estrutura usando PowerShell.

Entre na pasta onde ficam os projetos:

```powershell
cd C:\dev\projects
```

Crie a pasta:

```powershell
mkdir formacao-java-backend
cd formacao-java-backend
```

Crie arquivos principais:

```powershell
New-Item README.md
New-Item .gitignore
```

Crie pastas:

```powershell
mkdir docs
mkdir src
mkdir src\main
mkdir src\main\java
mkdir src\test
mkdir src\test\java
mkdir labs
```

Crie documentos:

```powershell
New-Item docs\ambiente.md
New-Item docs\atalhos.md
New-Item docs\diario-de-bordo.md
New-Item docs\checklist-ambiente.md
New-Item docs\http-basico.md
New-Item docs\docker-basico.md
New-Item labs\README.md
```

Se quiser manter pastas vazias:

```powershell
New-Item src\main\java\.gitkeep
New-Item src\test\java\.gitkeep
```

Inicialize Git, se ainda não existir:

```bash
git init
```

Valide:

```bash
git status
```

---

## Estrutura esperada após a prática

```text
formacao-java-backend/
├── README.md
├── .gitignore
├── docs/
│   ├── ambiente.md
│   ├── atalhos.md
│   ├── checklist-ambiente.md
│   ├── diario-de-bordo.md
│   ├── docker-basico.md
│   └── http-basico.md
├── labs/
│   └── README.md
└── src/
    ├── main/
    │   └── java/
    │       └── .gitkeep
    └── test/
        └── java/
            └── .gitkeep
```

Essa estrutura já é suficiente para continuar a formação com organização.

---

## Conteúdo mínimo do `labs/README.md`

```markdown
# Labs

Esta pasta guarda práticas isoladas e experimentos da formação.

## Regra

- Cada laboratório deve ter nome claro.
- Não usar esta pasta como lixeira.
- Se algo virar projeto principal, mover para a estrutura adequada.
- Não versionar arquivos gerados, temporários ou segredos.
```

Isso evita que `labs` vire bagunça.

---

## Exemplo aplicado ao domínio corporativo

Imagine que a formação já entrou em backend de ordem de serviço.

Uma organização ruim seria:

```text
ordem.java
teste novo.java
banco.sql
postman legal.json
print erro.png
final certo.java
```

Tudo solto na raiz.

Uma organização profissional seria:

```text
src/main/java/br/com/exemplo/ordemservico/
src/test/java/br/com/exemplo/ordemservico/
docs/api/ordem-servico.md
docs/sql/ordem-servico.md
docs/decisoes/adr-001-status-ordem-servico.md
collections/postman/ordem-servico.postman_collection.json
```

Ainda não vamos criar tudo isso agora.

Mas a mentalidade começa aqui:

```text
cada tipo de coisa no seu lugar.
```

Quando chegar em cliente, produto, pedido, pagamento, auditoria e mensageria, a estrutura vai crescer com critério.

---

## Rastreabilidade por aula

Cada aula deve deixar rastro.

Exemplo de entrada no diário:

```markdown
## Aula 019 — Estrutura profissional do repositório

### Arquivos alterados
- `README.md`
- `.gitignore`
- `docs/ambiente.md`
- `docs/atalhos.md`
- `docs/diario-de-bordo.md`
- `docs/checklist-ambiente.md`
- `labs/README.md`

### Commit
`Aula 019: organiza estrutura do repositorio`
```

Isso parece simples.

Mas depois de dezenas de aulas, essa disciplina faz diferença.

Você sabe o que cada aula gerou.

---

## Organização e evidência

Em qualidade de software, evidência importa.

Em engenharia, rastreabilidade importa.

Um repositório organizado gera evidência natural:

```text
commits;
README;
diário;
checklists;
estrutura;
diffs;
histórico.
```

Isso ajuda a provar evolução.

Também ajuda a revisar.

Também ajuda a ensinar outra pessoa.

A formação não é só aprender sintaxe Java.

É construir postura profissional.

---

## Atalhos úteis nesta aula

| Ação | Atalho | Uso |
|---|---|---|
| Terminal integrado | `Alt + F12` | Criar pastas, rodar Git |
| Project | `Alt + 1` | Ver estrutura criada |
| Novo arquivo/pasta no IntelliJ | `Alt + Insert` | Criar arquivos pela IDE |
| Buscar ação | `Ctrl + Shift + A` | Encontrar ações da IDE |
| Search Everywhere | `Shift Shift` | Buscar arquivos e ações |
| Recent Files | `Ctrl + E` | Alternar entre README, diário e gitignore |
| Reformatar | `Ctrl + Alt + L` | Organizar Markdown |
| Buscar no projeto | `Ctrl + Shift + F` | Procurar termos nos docs |
| Commit | `Ctrl + K` | Revisar alterações |
| Push | `Ctrl + Shift + K` | Enviar commits |

Observação:

```text
atalhos podem variar conforme keymap, sistema operacional e teclado.
```

Se algum não funcionar, use:

```text
Ctrl + Shift + A
```

e procure a ação pelo nome.

---

## Erros comuns

### Erro 1 — Criar tudo na raiz

Raiz deve ter poucos arquivos centrais.

Exemplos aceitáveis:

```text
README.md
.gitignore
pom.xml futuramente
```

Não jogue tudo na raiz.

---

### Erro 2 — Nome com espaço e acento

Evite:

```text
diário de bordo.md
meu projeto final.md
```

Prefira:

```text
diario-de-bordo.md
projeto-final.md
```

Isso reduz problema com terminal, scripts e compatibilidade.

---

### Erro 3 — Commit sem revisar

Não faça:

```bash
git add .
git commit -m "update"
```

sem olhar.

Use:

```bash
git status
git diff
git diff --staged
```

---

### Erro 4 — Versionar arquivos gerados

Evite versionar:

```text
target/
build/
.gradle/
*.class
logs
temporários
```

Use `.gitignore`.

---

### Erro 5 — Versionar segredos

Nunca versionar:

```text
.env com senha real;
token;
senha de banco;
credencial de API;
settings.xml com credencial;
arquivo exportado com segredo.
```

Use placeholders e exemplos seguros.

---

### Erro 6 — Criar `docs` mas não usar

A pasta `docs` precisa ser usada.

Não basta existir.

Atualize diário, ambiente e checklists.

---

### Erro 7 — Criar `labs` como lixeira

`labs` é para experimentos organizados.

Não é depósito de qualquer arquivo.

---

### Erro 8 — Misturar teste com código principal

Mais tarde, código principal ficará em:

```text
src/main/java
```

Testes em:

```text
src/test/java
```

Não misture.

---

### Erro 9 — Não manter README atualizado

README desatualizado atrapalha.

Toda mudança estrutural relevante deve refletir no README.

---

### Erro 10 — Ter medo de reorganizar cedo

No começo, é normal ajustar estrutura.

Mas ajuste com commit claro.

Não deixe bagunça crescer.

---

## Diagnóstico de organização

Quando o repositório parecer confuso, pergunte:

```text
o README explica o projeto?
docs contém documentação ou está vazio?
src contém código ou arquivos aleatórios?
labs está organizado?
.gitignore protege arquivos gerados?
git status está limpo?
commits têm mensagens claras?
diário de bordo está atualizado?
há senhas em algum arquivo?
há arquivo duplicado com final, final2, agora-vai?
```

Se a resposta for ruim, reorganize.

---

## Checklist de estrutura

Use este checklist:

```markdown
# Checklist — Estrutura profissional do repositório

- [ ] Existe `README.md`.
- [ ] Existe `.gitignore`.
- [ ] Existe pasta `docs/`.
- [ ] Existe `docs/ambiente.md`.
- [ ] Existe `docs/atalhos.md`.
- [ ] Existe `docs/diario-de-bordo.md`.
- [ ] Existe `docs/checklist-ambiente.md`.
- [ ] Existe pasta `src/main/java`.
- [ ] Existe pasta `src/test/java`.
- [ ] Existe pasta `labs/`.
- [ ] Existe `labs/README.md`.
- [ ] Nomes de arquivos estão sem espaços desnecessários.
- [ ] Nomes de arquivos evitam acentos.
- [ ] `.gitignore` ignora `target/`, `build/`, `.gradle/`, `*.class`, `.env`.
- [ ] Nenhuma senha real foi documentada.
- [ ] `git status` foi revisado.
- [ ] `git diff` foi revisado.
- [ ] Commit da aula foi criado com mensagem clara.
```

Esse checklist prepara o fechamento do Módulo 0.

---

## Prática recomendada

Execute a criação da estrutura.

Depois preencha minimamente:

```text
README.md
.gitignore
docs/ambiente.md
docs/atalhos.md
docs/diario-de-bordo.md
docs/checklist-ambiente.md
labs/README.md
```

Valide:

```bash
git status
git diff
git add README.md .gitignore docs labs src
git diff --staged
git commit -m "Aula 019: organiza estrutura do repositorio"
git status
```

Se já houver repositório com arquivos, adapte sem apagar o que existe.

O objetivo é organizar, não destruir.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 019 — Estrutura profissional do repositório de curso

### O que aprendi
Aprendi que o repositório deve contar a história técnica da formação, separando documentação, código, laboratórios, checklists e histórico de commits.

### O que pratiquei
Criei ou reorganizei a estrutura com `README.md`, `.gitignore`, `docs/`, `src/` e `labs/`.

### Estrutura criada
```text
README.md
.gitignore
docs/
src/main/java
src/test/java
labs/
```

### Arquivos criados ou alterados
- `README.md`
- `.gitignore`
- `docs/ambiente.md`
- `docs/atalhos.md`
- `docs/diario-de-bordo.md`
- `docs/checklist-ambiente.md`
- `labs/README.md`

### Comandos usados
```powershell
mkdir docs
mkdir src
mkdir src\main
mkdir src\main\java
mkdir src\test
mkdir src\test\java
mkdir labs
New-Item README.md
New-Item .gitignore
git status
git diff
git add .
git diff --staged
git commit -m "Aula 019: organiza estrutura do repositorio"
```

### Atalhos úteis
- `Alt + F12` — terminal integrado.
- `Alt + 1` — Project.
- `Alt + Insert` — criar arquivo/pasta.
- `Ctrl + Shift + A` — buscar ação.
- `Ctrl + E` — arquivos recentes.
- `Ctrl + K` — Commit.

### Erros que quero evitar
- criar arquivos soltos na raiz;
- usar nomes com espaço e acento;
- commitar sem revisar diff;
- versionar arquivos gerados;
- versionar senhas;
- deixar README desatualizado;
- transformar labs em lixeira.

### Próximo passo
Executar o checklist final do ambiente.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
explicar por que o repositório precisa de estrutura;
explicar a função do README;
explicar a função da pasta docs;
explicar a função da pasta src;
explicar a função da pasta labs;
criar README.md;
criar .gitignore;
criar docs/ambiente.md;
criar docs/atalhos.md;
criar docs/diario-de-bordo.md;
criar docs/checklist-ambiente.md;
criar src/main/java;
criar src/test/java;
criar labs/README.md;
usar nomes de arquivos sem bagunça;
evitar espaços e acentos em nomes técnicos;
entender .gitkeep quando pasta está vazia;
configurar .gitignore básico;
evitar versionar target, build, .gradle, class e env real;
usar git status;
usar git diff;
usar git diff --staged;
fazer commit pequeno por aula;
escrever mensagem de commit clara;
atualizar diário de bordo;
usar atalhos úteis quando conveniente.
```

Não precisa ainda ter código Java profundo.

Não precisa ainda ter projeto Maven completo.

O objetivo é organizar a casa antes da entrada no M1.

---

## Fechamento da aula

Hoje a formação ganhou estrutura de repositório.

Isso parece simples, mas é um marco.

A partir daqui, cada prática terá lugar.

Cada anotação terá lugar.

Cada código terá lugar.

Cada commit terá intenção.

Essa organização reduz retrabalho, evita perda de contexto e cria rastreabilidade.

Um bom desenvolvedor backend não é apenas alguém que escreve código.

É alguém que mantém o projeto compreensível.

Na próxima aula, vamos fazer o checklist final do ambiente.

Será a revisão prática do Módulo 0 antes de entrar no M1.

Depois disso, começaremos Java de verdade:

```text
variáveis;
tipos;
operadores;
entrada e saída;
controle de fluxo;
métodos;
arrays;
strings;
primeiros problemas de lógica.
```

Mas agora com ambiente, ferramentas e repositório preparados.
