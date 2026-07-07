# 020 — M0.20 — Checklist Final do Ambiente

## Cobertura da grade operacional

Esta aula cobre integralmente as sessões da grade v4.1:

- `M0.20.01` — Checklist final do ambiente — Conceito, por que existe e vocabulário essencial.
- `M0.20.02` — Checklist final do ambiente — Exemplo mínimo digitado do zero.
- `M0.20.03` — Checklist final do ambiente — Exemplo aplicado ao domínio corporativo.
- `M0.20.04` — Checklist final do ambiente — Erros comuns, diagnóstico e perguntas de fixação.

Nada dessas sessões foi removido.

O conteúdo foi integrado em uma única aula mentorada para validar Java, Git, Maven, banco, Docker, IntelliJ, GitHub, documentação, rotina de estudo e organização do repositório antes da entrada no Módulo 1.

---

## Complemento operacional — checklist final ampliado de instalação e validação


> Nota de manutenção do material: este complemento foi incluído sem remover o conteúdo original da aula. 
> A aula continua com a mesma cobertura da grade; o reforço abaixo apenas deixa mais explícito o que o aluno deve baixar, instalar, configurar, validar e registrar quando esta aula envolver preparação de ambiente.


Esta aula já é o fechamento do Módulo 0. O complemento abaixo transforma o checklist em uma validação final explícita de instalação, configuração e diagnóstico.

### Validação final em terminal externo

Execute no PowerShell:

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac

git --version
git config --global --list

mvn -version
where mvn

wsl --status
wsl -l -v

docker --version
docker version
docker compose version
docker run hello-world
```

### Validação final no IntelliJ

No terminal integrado:

```powershell
pwd
ls
java -version
javac -version
git --version
mvn -version
```

Também validar manualmente:

```text
IntelliJ Community abre;
projeto abre pela raiz;
Project SDK configurado;
Main.java executa;
debug funciona;
terminal integrado funciona.
```

### Validação final de banco

No DBeaver:

```sql
SELECT version();

SELECT current_database();
```

Conferir:

```text
PostgreSQL está rodando;
conexão local funciona;
database de estudo está correta;
senha não foi registrada em Git.
```

### Validação final de cliente HTTP

No Postman ou Insomnia:

```text
collection de estudo existe;
environment local existe;
base_url configurada;
request GET modelo criada;
request POST JSON modelo criada.
```

### Validação final do repositório

```bash
git status
git diff
git remote -v
```

Conferir:

```text
README existe;
docs existem;
diário atualizado;
checklist atualizado;
.gitignore revisado;
nenhum segredo versionado;
nenhum .class/target/out indevido versionado.
```

### Resultado do Módulo 0

Marque no `docs/checklist-ambiente.md`:

```markdown
## Aprovação final do Módulo 0

- [ ] Java validado.
- [ ] IntelliJ validado.
- [ ] Git validado.
- [ ] GitHub validado.
- [ ] Maven validado.
- [ ] PostgreSQL validado.
- [ ] DBeaver validado.
- [ ] Postman ou Insomnia validado.
- [ ] WSL2 validado.
- [ ] Docker validado.
- [ ] Repositório organizado.
- [ ] Diário atualizado.
- [ ] Nenhum segredo versionado.
- [ ] Ambiente aprovado para iniciar o Módulo 1.
```

### Regra de transição para o M1

Se falhar em item crítico, não avance como se estivesse tudo certo.

Itens críticos para começar M1:

```text
Java;
javac;
IntelliJ;
Git;
repositório;
diário;
organização de pastas.
```

Itens como PostgreSQL, Postman/Insomnia e Docker podem ser corrigidos antes dos módulos que dependem deles, mas devem ficar registrados como pendência real se não estiverem prontos.

---

## Onde estamos na formação

Estamos no fechamento oficial do Módulo 0.

Até aqui, a preparação cobriu:

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
M0.18 — Docker Desktop e WSL2 preparação;
M0.19 — estrutura profissional do repositório de curso.
```

Agora vamos fechar a preparação.

Esta aula existe para responder uma pergunta simples:

```text
o ambiente está realmente pronto para começar Java de verdade?
```

Se a resposta for sim, entramos no M1.

Se a resposta for não, corrigimos agora.

---

## Hoje a aula é sobre não entrar no Java com ambiente quebrado

É tentador pular para código logo.

Mas começar Java profundo com ambiente instável gera retrabalho.

Exemplos de problemas que quebram o ritmo:

```text
JDK errado;
javac não encontrado;
IntelliJ sem SDK;
Git sem usuário configurado;
Maven usando Java diferente;
PostgreSQL sem conexão;
DBeaver sem driver;
Postman sem environment;
Docker Desktop parado;
WSL2 não configurado;
repositório sem README;
diário de bordo vazio;
arquivos espalhados;
.gitignore incompleto.
```

Quando isso acontece no meio de uma aula de Java, a pessoa acha que está com dificuldade em Java.

Mas muitas vezes o problema é ambiente.

O checklist final evita isso.

Antes de começar linguagem, validamos ferramenta.

Antes de construir backend, validamos base.

---

## O que é checklist final do ambiente

Checklist final é uma validação objetiva.

Ele responde:

```text
o que precisa estar instalado?
o que precisa responder no terminal?
o que precisa estar configurado?
o que precisa estar documentado?
o que precisa estar versionado?
o que não pode estar no Git?
o que precisa estar pronto para o próximo módulo?
```

Checklist não é burocracia.

Checklist é prevenção de erro.

Em ambiente profissional, checklist aparece em:

```text
onboarding;
deploy;
release;
homologação;
testes;
produção;
auditoria;
segurança;
documentação técnica.
```

Aqui ele aparece para garantir que o Módulo 0 cumpriu seu papel.

---

## O objetivo do Módulo 0

O Módulo 0 não existe para ensinar Java profundamente.

Ele existe para preparar:

```text
máquina;
terminal;
IDE;
Git;
GitHub;
documentação;
Maven;
banco;
cliente HTTP;
Docker;
organização;
rotina.
```

Depois do M0, a pessoa deve conseguir abrir o ambiente e estudar Java sem travar em configuração básica.

O M1 começará Java como linguagem.

Mas o M1 depende de tudo que foi preparado aqui.

---

## Critério geral de prontidão

O ambiente está pronto quando a pessoa consegue:

```text
abrir o terminal;
validar Java;
validar Maven;
abrir IntelliJ;
criar e rodar código simples;
usar debug básico;
usar Git local;
usar GitHub remoto;
documentar em Markdown;
manter diário de bordo;
validar PostgreSQL;
abrir DBeaver;
montar request HTTP;
abrir Postman ou Insomnia;
validar Docker;
validar WSL2;
manter repositório organizado;
fazer commit limpo.
```

Não precisa ser especialista em todas as ferramentas.

Precisa conseguir operar o básico e diagnosticar erro inicial.

---

## Checklist 1 — Organização do Windows

Valide se existe uma organização clara.

Exemplo recomendado:

```text
C:\dev
├── projects
├── labs
├── tools
├── studies
└── temp
```

Critérios:

```text
projetos não ficam em Downloads;
projetos não ficam soltos na Área de Trabalho;
ferramentas ficam em pasta estável;
nomes evitam acento e espaço;
arquivos temporários têm lugar;
repositórios ficam organizados.
```

Checklist:

```markdown
## Windows e pastas

- [ ] Existe uma pasta base de desenvolvimento, como `C:\dev`.
- [ ] Projetos ficam em `C:\dev\projects` ou equivalente.
- [ ] Laboratórios ficam em `C:\dev\labs` ou equivalente.
- [ ] Ferramentas ficam em `C:\dev\tools` ou equivalente.
- [ ] Projetos não estão em Downloads.
- [ ] Projetos não estão espalhados na Área de Trabalho.
- [ ] Nomes técnicos evitam acentos e espaços desnecessários.
```

---

## Checklist 2 — PowerShell e terminal

Comandos:

```powershell
pwd
ls
mkdir teste-terminal
cd teste-terminal
New-Item validacao.txt
ls
cd ..
```

Depois remova a pasta se for apenas teste:

```powershell
Remove-Item teste-terminal -Recurse
```

Critérios:

```text
sabe ver pasta atual;
sabe listar arquivos;
sabe navegar;
sabe criar pasta;
sabe criar arquivo;
sabe remover com cuidado;
sabe abrir terminal integrado no IntelliJ.
```

Checklist:

```markdown
## Terminal

- [ ] Sei usar `pwd`.
- [ ] Sei usar `ls`.
- [ ] Sei usar `cd`.
- [ ] Sei usar `mkdir`.
- [ ] Sei usar `New-Item`.
- [ ] Sei usar `Remove-Item` com cuidado.
- [ ] Sei abrir terminal integrado no IntelliJ com `Alt + F12`.
- [ ] Sei identificar se estou na pasta certa antes de executar comandos.
```

---

## Checklist 3 — JDK, JRE, JVM, `java` e `javac`

Comandos:

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
```

Critérios:

```text
java responde;
javac responde;
JAVA_HOME aponta para raiz do JDK;
where java aponta para local esperado;
where javac aponta para local esperado;
a versão está coerente com a formação.
```

Checklist:

```markdown
## Java

- [ ] `java -version` funciona.
- [ ] `javac -version` funciona.
- [ ] `JAVA_HOME` está configurado.
- [ ] `JAVA_HOME` aponta para a raiz do JDK, não para `bin`.
- [ ] `where java` mostra caminho esperado.
- [ ] `where javac` mostra caminho esperado.
- [ ] Entendo a diferença entre JDK, JRE e JVM em nível inicial.
- [ ] Entendo que `javac` compila e `java` executa.
```

Se `javac` não funciona, não avance.

Corrija o JDK primeiro.

---

## Checklist 4 — Compilação manual

Crie uma validação mínima.

Estrutura:

```text
validacao-java/
└── Main.java
```

`Main.java`:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Ambiente Java validado.");
    }
}
```

Comandos:

```powershell
javac Main.java
java Main
```

Critérios:

```text
arquivo compila;
arquivo executa;
saída aparece no terminal;
entende que .class é gerado;
não versiona .class.
```

Checklist:

```markdown
## Compilação manual

- [ ] Criei `Main.java`.
- [ ] Compilei com `javac Main.java`.
- [ ] Executei com `java Main`.
- [ ] Entendi que o `.class` foi gerado.
- [ ] Entendi que `.class` não deve ir para Git.
```

---

## Checklist 5 — IntelliJ IDEA Community

Valide:

```text
IntelliJ abre;
Project SDK configurado;
classe Main roda;
debug básico funciona;
terminal integrado abre;
Git aparece integrado quando houver repositório.
```

Checklist:

```markdown
## IntelliJ

- [ ] IntelliJ IDEA Community instalado.
- [ ] Projeto abre corretamente.
- [ ] Project SDK configurado.
- [ ] Classe `Main` executa pela IDE.
- [ ] Breakpoint funciona.
- [ ] Consigo usar Step Over.
- [ ] Consigo ver Variables no debug.
- [ ] Terminal integrado abre com `Alt + F12`.
- [ ] Sei procurar ações com `Ctrl + Shift + A`.
- [ ] Sei usar `Alt + 1` para abrir Project.
```

Se o código roda no terminal, mas não na IDE, investigue SDK e configuração de execução.

Se roda na IDE, mas não no terminal, investigue PATH e JAVA_HOME.

---

## Checklist 6 — Git global

Comandos:

```bash
git --version
git config --global user.name
git config --global user.email
git config --global init.defaultBranch
git config --global core.autocrlf
```

Critérios:

```text
Git instalado;
nome configurado;
e-mail configurado;
branch padrão definida;
autocrlf adequado ao Windows.
```

Checklist:

```markdown
## Git global

- [ ] `git --version` funciona.
- [ ] `user.name` configurado.
- [ ] `user.email` configurado.
- [ ] `init.defaultBranch` configurado como `main`.
- [ ] `core.autocrlf` configurado conscientemente.
- [ ] Entendo que Git é controle de versão local.
- [ ] Entendo que GitHub é hospedagem remota.
```

---

## Checklist 7 — Git local

Comandos dentro do repositório:

```bash
git status
git diff
git add .
git diff --staged
git commit -m "Aula 020: valida checklist final do ambiente"
git status
```

Critérios:

```text
sabe ver status;
sabe ver diff;
sabe adicionar arquivos;
sabe revisar staged;
sabe commitar;
sabe deixar working tree limpo.
```

Checklist:

```markdown
## Git local

- [ ] Sei usar `git status`.
- [ ] Sei usar `git diff`.
- [ ] Sei usar `git add`.
- [ ] Sei usar `git diff --staged`.
- [ ] Sei criar commit com mensagem clara.
- [ ] Sei verificar se o repositório ficou limpo.
- [ ] Não faço commit sem revisar.
```

---

## Checklist 8 — GitHub e remoto

Comandos:

```bash
git remote -v
git branch
git push
```

Quando necessário:

```bash
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

Critérios:

```text
repositório remoto existe;
origin configurado;
push funciona;
README aparece no GitHub;
não há segredo versionado.
```

Checklist:

```markdown
## GitHub

- [ ] Repositório remoto criado.
- [ ] `origin` configurado.
- [ ] `git remote -v` mostra URL correta.
- [ ] `git push` funciona.
- [ ] README aparece no remoto.
- [ ] Não há senha, token ou segredo no repositório.
- [ ] Entendo que remoto não substitui organização local.
```

---

## Checklist 9 — Markdown e documentação

Arquivos esperados:

```text
README.md
docs/ambiente.md
docs/atalhos.md
docs/diario-de-bordo.md
docs/checklist-ambiente.md
```

Critérios:

```text
README explica o repositório;
docs registra ambiente;
diário registra evolução;
atalhos centralizados;
checklist atualizado.
```

Checklist:

```markdown
## Documentação

- [ ] `README.md` existe.
- [ ] README explica o objetivo do repositório.
- [ ] `docs/ambiente.md` existe.
- [ ] `docs/atalhos.md` existe.
- [ ] `docs/diario-de-bordo.md` existe.
- [ ] `docs/checklist-ambiente.md` existe.
- [ ] Sei usar títulos Markdown.
- [ ] Sei usar listas.
- [ ] Sei usar blocos de código.
- [ ] Sei usar tabelas simples.
- [ ] Diário de bordo está atualizado.
```

---

## Checklist 10 — IA com método

Valide postura, não ferramenta.

Checklist:

```markdown
## IA com método

- [ ] Uso IA como apoio, não como substituta de entendimento.
- [ ] Leio o código gerado antes de aceitar.
- [ ] Não colo segredo, token, senha ou código sensível sem autorização.
- [ ] Peço explicação quando não entendo.
- [ ] Valido com terminal, teste, debug ou documentação.
- [ ] Registro aprendizados importantes no diário.
- [ ] Não aceito resposta só porque parece bonita.
```

Critério:

```text
a pessoa continua responsável pelo que entrega.
```

---

## Checklist 11 — Maven

Comandos:

```powershell
mvn -version
where mvn
```

Critérios:

```text
Maven instalado;
mvn encontrado no PATH;
Maven usando Java correto;
sabe que mvn -version não exige pom.xml;
sabe que mvn compile exige projeto Maven.
```

Checklist:

```markdown
## Maven

- [ ] `mvn -version` funciona.
- [ ] `where mvn` mostra caminho esperado.
- [ ] Maven usa o JDK esperado.
- [ ] Entendo que Maven depende de Java.
- [ ] Entendo que `mvn -version` valida instalação.
- [ ] Entendo que comandos de build exigem `pom.xml`.
- [ ] Não confundo Maven instalado com projeto Maven.
```

---

## Checklist 12 — PostgreSQL

Critérios:

```text
PostgreSQL instalado;
serviço rodando;
porta conhecida;
usuário local conhecido;
database de estudo criada;
senha não documentada em Git.
```

SQL de validação:

```sql
SELECT version();

SELECT current_database();
```

Checklist:

```markdown
## PostgreSQL

- [ ] PostgreSQL instalado.
- [ ] Serviço do PostgreSQL rodando.
- [ ] Porta identificada, geralmente `5432`.
- [ ] Usuário local identificado.
- [ ] Senha guardada fora do Git.
- [ ] Database `formacao_java` criada.
- [ ] `SELECT version();` executado.
- [ ] `SELECT current_database();` executado.
- [ ] Entendo que PostgreSQL é servidor de banco.
```

---

## Checklist 13 — DBeaver

Critérios:

```text
DBeaver instalado;
conexão PostgreSQL criada;
driver baixado quando solicitado;
Test Connection funciona;
consegue executar SQL.
```

Checklist:

```markdown
## DBeaver

- [ ] DBeaver Community instalado.
- [ ] Conexão PostgreSQL criada.
- [ ] Driver JDBC baixado quando solicitado.
- [ ] `Test Connection` executado com sucesso.
- [ ] Consigo abrir editor SQL.
- [ ] Consigo executar `SELECT version();`.
- [ ] Entendo que DBeaver é cliente, não servidor de banco.
```

---

## Checklist 14 — Postman ou Insomnia

Critérios:

```text
ferramenta instalada;
collection criada;
environment criado;
base_url configurado;
sabe montar GET e POST;
sabe olhar status code.
```

Checklist:

```markdown
## Postman ou Insomnia

- [ ] Postman ou Insomnia instalado.
- [ ] Collection de estudo criada.
- [ ] Environment local criado.
- [ ] Variável `base_url` criada.
- [ ] Sei montar request GET.
- [ ] Sei montar request POST com JSON.
- [ ] Sei configurar `Content-Type: application/json`.
- [ ] Sei identificar status code.
- [ ] Sei diferenciar 200, 201, 204, 400, 401, 403, 404, 409 e 500.
- [ ] Não salvo token real em collection compartilhada.
```

---

## Checklist 15 — HTTP básico

Critérios conceituais:

```text
request;
response;
URL;
método;
headers;
body;
JSON;
status code;
path parameter;
query parameter.
```

Checklist:

```markdown
## HTTP básico

- [ ] Entendo request.
- [ ] Entendo response.
- [ ] Entendo URL.
- [ ] Entendo endpoint.
- [ ] Entendo GET.
- [ ] Entendo POST.
- [ ] Entendo PUT.
- [ ] Entendo PATCH.
- [ ] Entendo DELETE.
- [ ] Entendo header.
- [ ] Entendo body.
- [ ] Entendo JSON básico.
- [ ] Entendo status code.
- [ ] Entendo path parameter.
- [ ] Entendo query parameter.
```

---

## Checklist 16 — WSL2

Comandos:

```powershell
wsl --status
wsl -l -v
```

Critérios:

```text
WSL instalado;
distribuição disponível;
versão 2 quando necessário;
comando wsl funciona.
```

Checklist:

```markdown
## WSL2

- [ ] `wsl --status` funciona.
- [ ] `wsl -l -v` funciona.
- [ ] Existe distribuição Linux instalada.
- [ ] Distribuição está usando WSL2 quando aplicável.
- [ ] Entendo que Docker Desktop no Windows usa WSL2 como base importante.
```

---

## Checklist 17 — Docker Desktop

Comandos:

```powershell
docker --version
docker version
docker info
docker run hello-world
docker ps
docker ps -a
docker images
```

Critérios:

```text
Docker Desktop instalado;
engine rodando;
CLI conversa com engine;
hello-world executa;
imagem e container entendidos.
```

Checklist:

```markdown
## Docker

- [ ] Docker Desktop instalado.
- [ ] Docker Desktop aberto.
- [ ] Docker Engine iniciado.
- [ ] `docker --version` funciona.
- [ ] `docker version` funciona.
- [ ] `docker info` funciona.
- [ ] `docker run hello-world` executado com sucesso.
- [ ] `docker ps` executado.
- [ ] `docker ps -a` executado.
- [ ] `docker images` executado.
- [ ] Entendo diferença entre imagem e container.
- [ ] Entendo conceito de porta.
- [ ] Entendo conceito de volume.
- [ ] Não rodo imagens desconhecidas sem critério.
```

---

## Checklist 18 — Estrutura do repositório

Estrutura esperada:

```text
formacao-java-backend/
├── README.md
├── .gitignore
├── docs/
├── src/
└── labs/
```

Checklist:

```markdown
## Estrutura do repositório

- [ ] `README.md` existe.
- [ ] `.gitignore` existe.
- [ ] `docs/` existe.
- [ ] `src/main/java` existe.
- [ ] `src/test/java` existe.
- [ ] `labs/` existe.
- [ ] `labs/README.md` existe.
- [ ] Nomes de arquivos evitam espaços.
- [ ] Nomes técnicos evitam acentos.
- [ ] `.gitignore` ignora `target/`.
- [ ] `.gitignore` ignora `build/`.
- [ ] `.gitignore` ignora `.gradle/`.
- [ ] `.gitignore` ignora `*.class`.
- [ ] `.gitignore` ignora `.env` real.
- [ ] Não há segredo no repositório.
```

---

## Checklist 19 — Rotina por aula

Checklist:

```markdown
## Rotina por aula

- [ ] Leio a aula.
- [ ] Executo a prática quando aplicável.
- [ ] Registro no diário de bordo.
- [ ] Atualizo documentação relevante.
- [ ] Uso terminal para validar.
- [ ] Uso Git para rastrear alterações.
- [ ] Reviso `git status`.
- [ ] Reviso `git diff`.
- [ ] Reviso `git diff --staged`.
- [ ] Faço commit pequeno e claro.
- [ ] Deixo repositório limpo.
```

Essa rotina será usada no M1.

---

## Checklist 20 — Atalhos essenciais

Não precisa decorar todos, mas estes devem estar familiares:

```markdown
## Atalhos essenciais

- [ ] `Alt + F12` — terminal integrado.
- [ ] `Alt + 1` — painel Project.
- [ ] `Esc` — voltar ao editor.
- [ ] `Ctrl + Shift + A` — buscar ação.
- [ ] `Shift Shift` — Search Everywhere.
- [ ] `Ctrl + E` — arquivos recentes.
- [ ] `Ctrl + Alt + L` — reformatar.
- [ ] `Ctrl + Alt + O` — organizar imports.
- [ ] `Shift + F10` — executar.
- [ ] `Shift + F9` — debug.
- [ ] `Ctrl + K` — commit.
- [ ] `Ctrl + Shift + K` — push.
```

Atalhos variam conforme keymap.

Se algum não funcionar, busque a ação por nome.

---

## Exemplo mínimo digitado do zero

Crie ou atualize:

```text
docs/checklist-ambiente.md
```

Com a estrutura:

```markdown
# Checklist final do ambiente

## Windows e pastas

- [ ] Existe pasta base de desenvolvimento.
- [ ] Projetos não estão em Downloads.

## Terminal

- [ ] `pwd` funciona.
- [ ] `ls` funciona.

## Java

- [ ] `java -version` funciona.
- [ ] `javac -version` funciona.

## Git

- [ ] `git --version` funciona.
- [ ] `git status` funciona no repositório.

## Maven

- [ ] `mvn -version` funciona.

## Banco

- [ ] PostgreSQL preparado.
- [ ] DBeaver conecta.

## HTTP

- [ ] Postman ou Insomnia instalado.
- [ ] Collection criada.

## Docker

- [ ] `docker run hello-world` funciona.

## Repositório

- [ ] README existe.
- [ ] Diário de bordo atualizado.
- [ ] `.gitignore` configurado.
```

Depois execute validações reais e marque os itens.

---

## Exemplo aplicado ao domínio corporativo

Imagine que você entrou em um projeto backend de ordens de serviço.

Antes de pegar uma tarefa, você precisa validar:

```text
consigo clonar o repositório?
consigo abrir no IntelliJ?
JDK está correto?
Maven funciona?
consigo rodar testes?
banco local funciona?
consigo conectar no DBeaver?
consigo chamar health check no Postman?
Docker sobe serviços auxiliares?
Git está configurado?
consigo criar branch?
consigo commitar?
consigo enviar push?
li o README?
há checklist de ambiente?
```

Se isso não está pronto, você terá retrabalho durante a tarefa.

O Módulo 0 simula essa preparação de onboarding.

A diferença é que aqui estamos fazendo para a formação.

Em empresa, você faria para o projeto.

---

## Roteiro de validação completo

Execute e registre no diário.

### Java

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
```

### Maven

```powershell
mvn -version
where mvn
```

### Git

```bash
git --version
git config --global user.name
git config --global user.email
git status
```

### WSL

```powershell
wsl --status
wsl -l -v
```

### Docker

```powershell
docker --version
docker version
docker info
docker run hello-world
docker ps -a
docker images
```

### PostgreSQL/DBeaver

Execute no DBeaver:

```sql
SELECT version();

SELECT current_database();
```

### Repositório

```bash
git status
git diff
git add docs/checklist-ambiente.md docs/diario-de-bordo.md docs/ambiente.md
git diff --staged
git commit -m "Aula 020: valida checklist final do ambiente"
git status
```

---

## Quando um item falhar

Checklist não existe para fingir que tudo está certo.

Se um item falhar:

```text
não marque como concluído;
registre o erro;
corrija;
valide de novo;
só então marque.
```

Exemplo:

```markdown
- [ ] `mvn -version` funciona.
  - Erro: Maven não encontrado no PATH.
  - Correção: adicionar `%MAVEN_HOME%\bin` ao PATH e abrir novo terminal.
```

Depois de corrigir:

```markdown
- [x] `mvn -version` funciona.
```

Esse registro é aprendizado.

---

## Erros comuns no checklist final

### Erro 1 — Marcar item sem testar

Checklist só vale se foi validado.

Não marque porque “deve estar funcionando”.

Execute.

---

### Erro 2 — Confundir instalação com validação

Instalar uma ferramenta não prova que ela funciona.

Exemplo:

```text
Docker instalado não prova engine rodando.
```

Valide com comando.

---

### Erro 3 — Ignorar diferença entre terminal e IDE

Pode funcionar no terminal externo e falhar no terminal do IntelliJ.

Valide ambos quando aplicável.

---

### Erro 4 — Esquecer de registrar erro resolvido

Erro resolvido é aprendizado.

Registre no diário.

---

### Erro 5 — Versionar segredo durante checklist

Ao documentar ambiente, cuidado para não colar senha, token ou URL sensível.

---

### Erro 6 — Fazer commit gigante

Checklist final pode mexer em vários arquivos, mas mantenha intenção clara.

Não misture com outros assuntos.

---

### Erro 7 — Apagar arquivos úteis por ansiedade

Se algo está bagunçado, reorganize com cuidado.

Não apague sem entender.

---

### Erro 8 — Ignorar `.gitignore`

Antes do commit final do M0, confira:

```bash
git status
```

Se aparecer `target`, `build`, `.class`, `.env`, corrija.

---

### Erro 9 — Entrar no M1 com item crítico quebrado

Se Java, IntelliJ, Git ou Maven estão quebrados, não avance.

Corrija primeiro.

---

### Erro 10 — Achar que ambiente pronto significa domínio das ferramentas

Ambiente pronto significa:

```text
consigo usar o básico.
```

Domínio vem com prática nos módulos seguintes.

---

## Diagnóstico por sintoma

### `java` funciona, mas `javac` não

Provável problema:

```text
JRE ou PATH incompleto;
JDK não configurado corretamente.
```

### `mvn -version` não funciona

Provável problema:

```text
Maven não instalado;
PATH sem bin do Maven;
terminal antigo;
MAVEN_HOME incorreto.
```

### IntelliJ não reconhece Java

Provável problema:

```text
Project SDK ausente;
JDK não configurado na IDE.
```

### Git commit falha por identidade

Provável problema:

```text
user.name ou user.email não configurado.
```

### DBeaver não conecta

Provável problema:

```text
PostgreSQL parado;
porta errada;
senha errada;
database inexistente;
driver não baixado.
```

### Postman/Insomnia não conecta em localhost

Provável problema:

```text
API não está rodando;
porta errada;
URL errada.
```

### Docker CLI funciona, mas engine não

Provável problema:

```text
Docker Desktop fechado;
engine não iniciou;
problema de WSL2.
```

### `docker run hello-world` falha

Possíveis causas:

```text
sem internet;
Docker Desktop parado;
problema com WSL2;
proxy;
bloqueio corporativo.
```

### `git status` mostra arquivos gerados

Provável problema:

```text
.gitignore incompleto.
```

---

## Arquivo final recomendado: `docs/checklist-ambiente.md`

Conteúdo sugerido:

````markdown
# Checklist final do ambiente

## Objetivo

Validar se o ambiente está pronto para iniciar o Módulo 1 da formação Java Backend.

## Java

```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
```

- [ ] Java validado.
- [ ] Javac validado.
- [ ] JAVA_HOME validado.

## Maven

```powershell
mvn -version
where mvn
```

- [ ] Maven validado.
- [ ] Maven usando Java correto.

## Git

```bash
git --version
git status
git diff
```

- [ ] Git validado.
- [ ] Repositório limpo.

## PostgreSQL e DBeaver

```sql
SELECT version();
SELECT current_database();
```

- [ ] PostgreSQL validado.
- [ ] DBeaver conectando.

## HTTP

- [ ] Postman ou Insomnia instalado.
- [ ] Collection de estudo criada.
- [ ] Environment local criado.

## Docker e WSL2

```powershell
wsl --status
wsl -l -v
docker --version
docker version
docker run hello-world
```

- [ ] WSL2 validado.
- [ ] Docker validado.

## Repositório

- [ ] README atualizado.
- [ ] Diário de bordo atualizado.
- [ ] `.gitignore` revisado.
- [ ] Nenhum segredo versionado.
- [ ] Commit final do M0 criado.

## Resultado

- [ ] Ambiente aprovado para iniciar o Módulo 1.
````

Esse é o documento de passagem do M0 para o M1.

---

## Registro no diário de bordo

Use este bloco:

```markdown
## Aula 020 — Checklist final do ambiente

### O que aprendi
Aprendi que antes de iniciar Java profundamente preciso validar ambiente, ferramentas, repositório, documentação e rotina.

### O que validei
- Java
- Javac
- JAVA_HOME
- IntelliJ
- Git
- GitHub
- Maven
- PostgreSQL
- DBeaver
- Postman ou Insomnia
- HTTP básico
- WSL2
- Docker
- Estrutura do repositório
- Documentação
- Diário de bordo

### Comandos usados
```powershell
java -version
javac -version
echo $env:JAVA_HOME
where java
where javac
mvn -version
where mvn
wsl --status
wsl -l -v
docker --version
docker version
docker run hello-world
```

```bash
git --version
git status
git diff
git diff --staged
```

```sql
SELECT version();
SELECT current_database();
```

### Arquivos criados ou alterados
- `docs/checklist-ambiente.md`
- `docs/ambiente.md`
- `docs/diario-de-bordo.md`
- `docs/atalhos.md`
- `README.md`

### Erros encontrados e corrigidos
- Nenhum registrado.
- Ou registrar aqui os erros reais encontrados.

### Commit
`Aula 020: valida checklist final do ambiente`

### Próximo passo
Iniciar o Módulo 1: Java fundamentos absolutos e lógica aplicada.
```

---

## Critério de aprovação desta aula

Esta aula está concluída quando a pessoa consegue:

```text
validar organização do Windows;
validar terminal;
validar java -version;
validar javac -version;
validar JAVA_HOME;
validar where java;
validar where javac;
compilar e executar Main.java simples;
abrir IntelliJ;
validar Project SDK;
rodar código pela IDE;
usar debug básico;
validar Git global;
validar Git local;
validar GitHub remoto;
usar Markdown básico;
manter README;
manter docs;
manter diário de bordo;
usar IA com método e segurança;
validar mvn -version;
validar where mvn;
validar PostgreSQL;
validar DBeaver;
executar SELECT version();
executar SELECT current_database();
validar Postman ou Insomnia;
entender HTTP básico;
validar WSL2;
validar Docker Desktop;
executar docker run hello-world;
entender imagem e container;
validar estrutura do repositório;
revisar .gitignore;
garantir que não há segredo versionado;
fazer commit final do M0;
deixar repositório limpo;
explicar com suas palavras por que o M0 existiu.
```

Se itens críticos falharem, a aula ainda não está concluída.

Itens críticos:

```text
Java;
IntelliJ;
Git;
Maven;
repositório;
diário;
organização.
```

PostgreSQL, DBeaver, Postman/Insomnia e Docker são importantes para módulos futuros.

Se algum deles ficar pendente por limitação real da máquina, registre claramente no diário, mas não finja conclusão.

---

## Perguntas de fixação

Responda no diário, de forma curta.

```text
1. Por que o Módulo 0 veio antes do Java profundo?
2. Qual a diferença entre instalar uma ferramenta e validar uma ferramenta?
3. Por que `javac` é importante?
4. O que `mvn -version` prova?
5. O que `docker --version` prova e o que ele não prova?
6. Por que não podemos versionar `.env` com senha real?
7. Por que o README é importante?
8. Por que revisar `git diff` antes do commit?
9. Qual a diferença entre DBeaver e PostgreSQL?
10. Qual a diferença entre Postman/Insomnia e uma API backend?
```

Essas perguntas garantem que a preparação foi entendida, não apenas executada.

---

## Fechamento do Módulo 0

O Módulo 0 termina aqui.

Ele não foi sobre decorar ferramenta.

Ele foi sobre criar base.

Agora existe uma estrutura mínima para estudar com seriedade:

```text
ambiente organizado;
terminal funcional;
JDK validado;
IDE configurada;
debug inicial entendido;
Git funcionando;
GitHub conectado;
Markdown em uso;
diário de bordo ativo;
Maven validado;
PostgreSQL preparado;
DBeaver conectado;
Postman ou Insomnia pronto;
HTTP básico entendido;
Docker e WSL2 preparados;
repositório organizado;
checklist final registrado.
```

Isso reduz retrabalho.

Isso reduz ansiedade.

Isso evita confundir erro de ambiente com dificuldade em Java.

A partir da próxima aula, a formação entra no Módulo 1.

Agora começa Java de verdade.

O próximo passo é destrinchar o primeiro programa Java:

```text
class;
public;
static;
void;
main;
String[] args;
System.out.println;
compilação;
execução;
erro comum;
leitura linha por linha.
```

O ambiente está preparado.

Agora a linguagem pode começar.
